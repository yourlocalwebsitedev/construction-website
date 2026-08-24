// ============================================================
// Estimate inquiry submission — no backend.
//
// There is no database or file storage for this site, so a customer's
// estimate request is delivered as a pre-filled WhatsApp message straight
// to the business number (COMPANY.whatsapp) instead of being written to a
// database. Photo upload has intentionally been removed from the form —
// customers are invited to send photos directly in the WhatsApp chat
// afterward.
// ============================================================
import { COMPANY } from '../constants';
import { getWhatsAppUrl } from './contactLinks';
import { Language, PreferredContact } from '../types';

/** Basic spam guard: form filled out faster than a human reasonably could, or honeypot tripped. */
export function isLikelySpam(honeypotValue: string, formOpenedAt: number): boolean {
  if (honeypotValue && honeypotValue.trim().length > 0) return true;
  const elapsedMs = Date.now() - formOpenedAt;
  return elapsedMs < 2500; // submitted in under 2.5s — almost certainly a bot
}

export interface SubmitInquiryInput {
  customerName: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
  bestTimeToContact?: string;
  serviceLabel: string;
  zip: string;
  city: string;
  description: string;
  language: Language;
}

export interface SubmitInquiryResult {
  referenceNumber: string;
  whatsappUrl: string;
}

/** Generates a short human-friendly reference number (not persisted anywhere — just for the customer's records). */
function generateReferenceNumber(): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KL-${rand}`;
}

/**
 * Builds a WhatsApp (wa.me) link pre-filled with the customer's estimate
 * request, and returns it (plus a reference number) for the UI to open.
 * There is no server-side persistence — the WhatsApp message itself IS
 * the submission.
 */
export function submitInquiry(input: SubmitInquiryInput): SubmitInquiryResult {
  const referenceNumber = generateReferenceNumber();
  const lines = [
    `New Estimate Request (${referenceNumber})`,
    '',
    `Name: ${input.customerName}`,
    `Phone: ${input.phone}`,
    `Email: ${input.email}`,
    `Preferred contact method: ${input.preferredContact}`,
    input.bestTimeToContact ? `Best time to contact: ${input.bestTimeToContact}` : '',
    '',
    `Service requested: ${input.serviceLabel}`,
    `City: ${input.city}`,
    `ZIP: ${input.zip}`,
    '',
    'Project details:',
    input.description,
  ].filter((line) => line !== '');

  const message = lines.join('\n');
  const whatsappUrl = getWhatsAppUrl(COMPANY.whatsapp, message);

  return { referenceNumber, whatsappUrl };
}

