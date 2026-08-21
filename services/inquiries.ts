// ============================================================
// Estimate inquiry submission service.
//
// Persists customer estimate requests to Firestore (`inquiries` collection)
// with uploaded photos stored in Firebase Storage under
// `inquiries/{inquiryId}/{fileName}`. Firestore Storage documents only ever
// get *created* by the public client — see firestore.rules / storage.rules
// for the security model (public create-only, no read/update/delete).
// ============================================================
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import { Inquiry, InquiryMedia, InquiryStatus, Language, PreferredContact } from '../types';

export const MAX_PHOTOS = 8;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export interface PhotoValidationError {
  fileName: string;
  reason: 'type' | 'size';
}

/** Validates a batch of photo files client-side before upload. */
export function validatePhotos(files: File[], existingCount: number): { valid: File[]; errors: PhotoValidationError[] } {
  const valid: File[] = [];
  const errors: PhotoValidationError[] = [];
  const remainingSlots = Math.max(0, MAX_PHOTOS - existingCount);

  for (const file of files.slice(0, remainingSlots)) {
    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      errors.push({ fileName: file.name, reason: 'type' });
      continue;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      errors.push({ fileName: file.name, reason: 'size' });
      continue;
    }
    valid.push(file);
  }
  return { valid, errors };
}

export interface SubmitInquiryInput {
  customerName: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
  bestTimeToContact?: string;
  serviceId: string;
  serviceLabel: string;
  zip: string;
  city: string;
  description: string;
  photos: File[];
  language: Language;
  source?: string;
}

export interface SubmitInquiryResult {
  id: string;
  referenceNumber: string;
  photosUploaded: number;
  photosFailed: number;
}

/** Basic spam guard: form filled out faster than a human reasonably could, or honeypot tripped. */
export function isLikelySpam(honeypotValue: string, formOpenedAt: number): boolean {
  if (honeypotValue && honeypotValue.trim().length > 0) return true;
  const elapsedMs = Date.now() - formOpenedAt;
  return elapsedMs < 2500; // submitted in under 2.5s — almost certainly a bot
}

function getUtmParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const val = params.get(key);
      if (val) utm[key.replace('utm_', '')] = val;
    });
    return Object.keys(utm).length ? utm : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Uploads photos + creates the Firestore inquiry document.
 * onProgress reports overall (0-100) upload progress across all photos.
 */
export async function submitInquiry(
  input: SubmitInquiryInput,
  onProgress?: (percent: number) => void,
): Promise<SubmitInquiryResult> {
  // 1. Create the inquiry document first (without photos) so we have a stable ID for storage paths.
  const inquiryData: Omit<Inquiry, 'id' | 'photos'> = {
    submissionDate: new Date().toISOString(),
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    preferredContact: input.preferredContact,
    bestTimeToContact: input.bestTimeToContact || '',
    serviceId: input.serviceId,
    serviceLabel: input.serviceLabel,
    zip: input.zip,
    city: input.city,
    description: input.description,
    language: input.language,
    status: InquiryStatus.NEW,
    source: input.source || 'website',
    utm: getUtmParams() || null,
  };

  const docRef = await addDoc(collection(db, 'inquiries'), {
    ...inquiryData,
    photos: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const inquiryId = docRef.id;

  // 2. Upload photos (if any) with aggregated progress reporting.
  // Photo upload failures (e.g. storage misconfiguration) must not block
  // submission of the core inquiry — we still want the lead captured.
  const photos: InquiryMedia[] = [];
  let uploadFailureCount = 0;
  if (input.photos.length > 0) {
    const perFileProgress = new Array(input.photos.length).fill(0);
    const reportProgress = () => {
      const total = perFileProgress.reduce((a, b) => a + b, 0) / input.photos.length;
      onProgress?.(Math.round(total));
    };

    for (let i = 0; i < input.photos.length; i++) {
      const file = input.photos[i];
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `inquiries/${inquiryId}/${Date.now()}_${safeName}`;
      const storageRef = ref(storage, storagePath);

      try {
        await new Promise<void>((resolve, reject) => {
          const task = uploadBytesResumable(storageRef, file);
          // uploadBytesResumable retries indefinitely on network/CORS errors by
          // default, which would hang the form. Bail out after a reasonable
          // timeout so the user isn't stuck on "Submitting...".
          const timeoutMs = 20000;
          const timeoutId = setTimeout(() => {
            task.cancel();
            reject(new Error('Photo upload timed out'));
          }, timeoutMs);

          task.on(
            'state_changed',
            (snapshot) => {
              perFileProgress[i] = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              reportProgress();
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error);
            },
            async () => {
              clearTimeout(timeoutId);
              try {
                const url = await getDownloadURL(task.snapshot.ref);
                photos.push({
                  id: `${inquiryId}-${i}`,
                  inquiryId,
                  url,
                  storagePath,
                  fileName: file.name,
                  fileSize: file.size,
                  contentType: file.type,
                });
                perFileProgress[i] = 100;
                reportProgress();
                resolve();
              } catch (e) {
                reject(e);
              }
            },
          );
        });
      } catch (err) {
        console.error(`Photo upload failed for ${file.name}, continuing without it:`, err);
        uploadFailureCount += 1;
        perFileProgress[i] = 100; // stop blocking progress on a failed file
        reportProgress();
      }
    }

    // 3. Patch the inquiry doc with whatever photo metadata succeeded.
    await updateDoc(doc(db, 'inquiries', inquiryId), {
      photos,
      updatedAt: serverTimestamp(),
    });
  }

  const referenceNumber = `KL-${inquiryId.slice(0, 6).toUpperCase()}`;
  return { id: inquiryId, referenceNumber, photosUploaded: photos.length, photosFailed: uploadFailureCount };
}
