// ============================================================
// Persistent database layer (Firebase Firestore + Storage).
//
// Replaces localStorage as the system of record for business data:
// services, projects, reviews, service areas, and business settings.
// On first run (empty collection) each getter seeds Firestore from the
// bundled defaults in constants.ts so the site keeps working even before
// an admin has entered real data — after that, Firestore is authoritative.
//
// localStorage is intentionally NOT used here. It remains appropriate
// only for client UI preferences (see services/preferences.ts).
// ============================================================
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit as fsLimit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase.config';
import { Service, Project, Review, ServiceArea, BusinessSettings, ProjectMedia, ProjectMediaType, JobDraft, Inquiry, InquiryStatus } from '../types';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_REVIEWS, SERVICE_AREAS, COMPANY } from '../constants';

const COLLECTIONS = {
  SERVICES: 'services',
  PROJECTS: 'projects',
  REVIEWS: 'reviews',
  SERVICE_AREAS: 'service_areas',
  BUSINESS_SETTINGS: 'business_settings',
  PROJECT_MEDIA: 'project_media',
  JOB_DRAFTS: 'job_drafts',
  INQUIRIES: 'inquiries',
} as const;

const BUSINESS_SETTINGS_DOC_ID = 'main';

// Simple in-memory cache per session to avoid re-seeding/re-fetching repeatedly.
let seededServices = false;
let seededProjects = false;
let seededReviews = false;
let seededServiceAreas = false;
let seededSettings = false;

// Firestore calls can hang indefinitely (rather than reject) when the
// backend/database is unreachable (e.g. no Cloud Firestore database
// provisioned yet, or no network). Race every public read against a
// timeout so the UI always falls back to bundled defaults instead of
// spinning forever.
//
// Circuit breaker: once any Firestore call fails/times out, assume the
// backend is unreachable for the rest of this session and skip straight
// to bundled defaults on every subsequent call (no more waiting on a
// timeout per-page-load). This is what keeps repeat navigations to
// /services and /projects near-instant instead of re-paying the ~6s
// timeout on every single click.
const FIRESTORE_TIMEOUT_MS = 3000;
let firestoreUnavailable = false;

// Exported so ad-hoc Firestore calls elsewhere (e.g. the "jobs" collection
// reads in PortfolioPage/ProjectDetailPage that bypass this module) can
// share the same circuit breaker instead of re-paying the timeout.
export function isFirestoreUnavailable(): boolean {
  return firestoreUnavailable;
}
export function markFirestoreUnavailable(): void {
  firestoreUnavailable = true;
}

function withTimeout<T>(promise: Promise<T>, ms: number = FIRESTORE_TIMEOUT_MS): Promise<T> {
  if (firestoreUnavailable) {
    return Promise.reject(new Error('Firestore previously unreachable this session — skipping'));
  }
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      firestoreUnavailable = true;
      reject(new Error(`Firestore request timed out after ${ms}ms`));
    }, ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); firestoreUnavailable = true; reject(e); },
    );
  });
}

async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  defaults: T[],
): Promise<boolean> {
  const snap = await getDocs(collection(db, collectionName));
  if (!snap.empty) return false;
  const batch = writeBatch(db);
  defaults.forEach((item) => {
    const { id, ...rest } = item as any;
    batch.set(doc(db, collectionName, id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return true;
}

// ---------------- SERVICES ----------------
export async function getServices(): Promise<Service[]> {
  try {
    if (!seededServices) {
      await withTimeout(seedCollectionIfEmpty<Service>(COLLECTIONS.SERVICES, INITIAL_SERVICES));
      seededServices = true;
    }
    const snap = await withTimeout(getDocs(query(collection(db, COLLECTIONS.SERVICES), orderBy('order', 'asc'))));
    if (snap.empty) return INITIAL_SERVICES;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service));
  } catch (err) {
    console.error('getServices failed, falling back to defaults:', err);
    return INITIAL_SERVICES;
  }
}

// ---------------- PROJECTS ----------------
export async function getProjects(): Promise<Project[]> {
  try {
    if (!seededProjects) {
      await withTimeout(seedCollectionIfEmpty<Project>(COLLECTIONS.PROJECTS, INITIAL_PROJECTS));
      seededProjects = true;
    }
    const snap = await withTimeout(getDocs(query(collection(db, COLLECTIONS.PROJECTS), orderBy('completionDate', 'desc'))));
    if (snap.empty) return INITIAL_PROJECTS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch (err) {
    console.error('getProjects failed, falling back to defaults:', err);
    return INITIAL_PROJECTS;
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const snap = await withTimeout(getDoc(doc(db, COLLECTIONS.PROJECTS, id)));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Project;
  } catch (err) {
    console.error('getProjectById failed:', err);
    return null;
  }
}

// ---------------- REVIEWS ----------------
export async function getReviews(): Promise<Review[]> {
  try {
    if (!seededReviews) {
      await withTimeout(seedCollectionIfEmpty<Review>(COLLECTIONS.REVIEWS, INITIAL_REVIEWS));
      seededReviews = true;
    }
    const snap = await withTimeout(getDocs(query(collection(db, COLLECTIONS.REVIEWS), orderBy('date', 'desc'), fsLimit(20))));
    if (snap.empty) return INITIAL_REVIEWS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
  } catch (err) {
    console.error('getReviews failed, falling back to defaults:', err);
    return INITIAL_REVIEWS;
  }
}

// ---------------- SERVICE AREAS ----------------
export async function getServiceAreas(): Promise<ServiceArea[]> {
  try {
    if (!seededServiceAreas) {
      const snap = await withTimeout(getDocs(collection(db, COLLECTIONS.SERVICE_AREAS)));
      if (snap.empty) {
        const batch = writeBatch(db);
        SERVICE_AREAS.forEach((area, i) => {
          batch.set(doc(db, COLLECTIONS.SERVICE_AREAS, `area-${i}`), {
            ...area,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });
        await withTimeout(batch.commit());
      }
      seededServiceAreas = true;
    }
    const snap = await withTimeout(getDocs(collection(db, COLLECTIONS.SERVICE_AREAS)));
    if (snap.empty) return SERVICE_AREAS;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceArea));
  } catch (err) {
    console.error('getServiceAreas failed, falling back to defaults:', err);
    return SERVICE_AREAS;
  }
}

// ---------------- BUSINESS SETTINGS ----------------
const defaultBusinessSettings: BusinessSettings = {
  id: BUSINESS_SETTINGS_DOC_ID,
  name: COMPANY.name,
  phone: COMPANY.phone,
  phoneDisplay: COMPANY.phoneDisplay,
  whatsapp: COMPANY.whatsapp,
  email: COMPANY.email,
  address: COMPANY.address,
  primaryCity: COMPANY.primaryCity,
  hoursEn: COMPANY.hoursEn,
  hoursEs: COMPANY.hoursEs,
  licenseNumber: COMPANY.licenseNumber,
  insuranceInfo: COMPANY.insuranceInfo,
  warrantyYears: COMPANY.warrantyYears,
  warrantyInfo: COMPANY.warrantyInfo,
  googleRating: COMPANY.googleRating,
  googleReviewCount: COMPANY.googleReviewCount,
  googleReviewUrl: COMPANY.googleReviewUrl,
  instagram: COMPANY.social.instagram,
  facebook: COMPANY.social.facebook,
  youtube: COMPANY.social.youtube,
  tiktok: COMPANY.social.tiktok,
  logoUrl: COMPANY.logoUrl,
};

export async function getBusinessSettings(): Promise<BusinessSettings> {
  try {
    const ref = doc(db, COLLECTIONS.BUSINESS_SETTINGS, BUSINESS_SETTINGS_DOC_ID);
    if (!seededSettings) {
      const snap = await withTimeout(getDoc(ref));
      if (!snap.exists()) {
        await withTimeout(setDoc(ref, { ...defaultBusinessSettings, updatedAt: serverTimestamp() }));
      }
      seededSettings = true;
    }
    const snap = await withTimeout(getDoc(ref));
    if (!snap.exists()) return defaultBusinessSettings;
    return { id: snap.id, ...snap.data() } as BusinessSettings;
  } catch (err) {
    console.error('getBusinessSettings failed, falling back to defaults:', err);
    return defaultBusinessSettings;
  }
}

// ============================================================
// ADMIN CRUD — all admin writes go through Firestore (never localStorage).
// ============================================================

function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const out: Record<string, any> = {};
  Object.keys(obj).forEach((k) => {
    if (obj[k] !== undefined) out[k] = obj[k];
  });
  return out as T;
}

// ---------- Services ----------
export async function createService(data: Partial<Service>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(id: string, data: Partial<Service>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.SERVICES, id), { ...stripUndefined(data), updatedAt: serverTimestamp() });
}

export async function deleteService(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
}

// ---------- Projects ----------
export async function createProject(data: Partial<Project>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), { ...stripUndefined(data), updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
}

// ---------- Project Media ----------
export async function getProjectMedia(projectId: string): Promise<ProjectMedia[]> {
  try {
    const snap = await withTimeout(getDocs(collection(db, COLLECTIONS.PROJECT_MEDIA)));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as ProjectMedia))
      .filter((m) => m.projectId === projectId)
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  } catch (err) {
    console.error('getProjectMedia failed:', err);
    return [];
  }
}

// Uploads a project media file with progress + a hang-guard timeout
// (resumable uploads can retry indefinitely on CORS/network failure).
export function uploadProjectMedia(
  projectId: string,
  file: File,
  type: ProjectMediaType,
  onProgress?: (pct: number) => void,
  timeoutMs = 20000
): Promise<ProjectMedia> {
  return new Promise((resolve, reject) => {
    const path = `projects/${projectId}/${type}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      task.cancel();
      reject(new Error('Upload timed out. Please check your connection and try again.'));
    }, timeoutMs);

    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      },
      async () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const url = await getDownloadURL(task.snapshot.ref);
        const media: Omit<ProjectMedia, 'id'> = {
          projectId,
          type,
          url,
          storagePath: path,
        } as any;
        const docRef = await addDoc(collection(db, COLLECTIONS.PROJECT_MEDIA), {
          ...media,
          createdAt: serverTimestamp(),
        });
        resolve({ id: docRef.id, ...media } as ProjectMedia);
      }
    );
  });
}

export async function deleteProjectMedia(mediaId: string, storagePath?: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.PROJECT_MEDIA, mediaId));
  if (storagePath) {
    try {
      await deleteObject(ref(storage, storagePath));
    } catch (err) {
      console.warn('Failed to delete storage object (may already be removed):', err);
    }
  }
}

// ---------- Reviews ----------
export async function createReview(data: Partial<Review>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.REVIEWS), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateReview(id: string, data: Partial<Review>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.REVIEWS, id), { ...stripUndefined(data), updatedAt: serverTimestamp() });
}

export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.REVIEWS, id));
}

// ---------- Service Areas ----------
export async function createServiceArea(data: Partial<ServiceArea>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.SERVICE_AREAS), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateServiceArea(id: string, data: Partial<ServiceArea>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.SERVICE_AREAS, id), { ...stripUndefined(data), updatedAt: serverTimestamp() });
}

export async function deleteServiceArea(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.SERVICE_AREAS, id));
}

// ---------- Business Settings ----------
export async function updateBusinessSettings(data: Partial<BusinessSettings>): Promise<void> {
  const settingsRef = doc(db, COLLECTIONS.BUSINESS_SETTINGS, BUSINESS_SETTINGS_DOC_ID);
  await setDoc(settingsRef, { ...stripUndefined(data), updatedAt: serverTimestamp() }, { merge: true });
}

// ---------- Job Drafts (Quick Job Upload) ----------
export async function createJobDraft(data: Partial<JobDraft>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTIONS.JOB_DRAFTS), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getJobDrafts(): Promise<JobDraft[]> {
  const q = query(collection(db, COLLECTIONS.JOB_DRAFTS), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as JobDraft));
}

export async function updateJobDraft(id: string, data: Partial<JobDraft>): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.JOB_DRAFTS, id), { ...stripUndefined(data), updatedAt: serverTimestamp() });
}

export async function deleteJobDraft(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTIONS.JOB_DRAFTS, id));
}

// Uploads a quick-job photo/video directly (used by the mobile Quick Upload flow).
export function uploadJobDraftFile(
  draftId: string,
  file: File,
  folder: 'before' | 'after' | 'video',
  onProgress?: (pct: number) => void,
  timeoutMs = 20000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = `job_drafts/${draftId}/${folder}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      task.cancel();
      reject(new Error('Upload timed out. Please check your connection and try again.'));
    }, timeoutMs);

    task.on(
      'state_changed',
      (snap) => {
        if (onProgress) onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      },
      async () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ---------- Inquiries (Leads) ----------
export async function getInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, COLLECTIONS.INQUIRIES), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Inquiry));
}

export async function getInquiryById(id: string): Promise<Inquiry | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.INQUIRIES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Inquiry;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { status, updatedAt: serverTimestamp() });
}

export async function updateInquiryNotes(id: string, internalNotes: string): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.INQUIRIES, id), { internalNotes, updatedAt: serverTimestamp() });
}
