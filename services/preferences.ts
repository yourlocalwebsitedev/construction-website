// ============================================================
// Client-side UI preferences.
//
// This is the ONLY appropriate use of localStorage after the Phase 2
// migration to Firestore — non-sensitive, device-local preferences such
// as the selected language. All business data lives in Firestore
// (see services/db.ts and services/inquiries.ts).
// ============================================================
import { Language } from '../types';

const LANGUAGE_KEY = 'kl_language_pref_v1';

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    if (stored === Language.EN || stored === Language.ES) return stored;
  } catch {
    // localStorage may be unavailable (private browsing, SSR, etc).
  }
  return Language.EN;
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Ignore write failures.
  }
}
