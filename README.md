<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# K&L Pro-Finish Plastering LLC — Marketing Website & Admin Portal

A production website and lightweight CMS/admin portal for **K&L Pro-Finish Plastering LLC**, a plastering / stucco / EIFS / air-barrier & waterproofing contractor. Built as a single-page React app with a Firebase backend (Auth + Firestore + Storage), plus an authenticated admin area for managing services, projects, reviews, leads, and business settings without touching code.

---

## 1. Business Overview

- **Business:** K&L Pro-Finish Plastering LLC
- **Positioning:** A 4-pillar envelope specialist — **Plastering • Stucco • EIFS • Air Barrier & Waterproofing** — emphasizing proper substrate preparation, not just visible finish work.
- **Phone / WhatsApp:** `(402) 802-7647` (`+14028027647`)
- **Primary goals of the site:**
  1. Generate qualified leads via an on-site estimate/booking flow (`features/booking/EstimateSystem.tsx`).
  2. Showcase completed work (project gallery + before/after slider).
  3. Build trust (licensing/insurance badges, warranty info, Google reviews).
  4. Give the business owner a simple, no-code way to update services, projects, reviews, and contact info via `/admin`.
- **Bilingual:** Full English / Spanish support via an in-app `TRANSLATIONS` dictionary (see `constants/index.ts`) and a `Language` toggle used across all public pages.
- **Editable business info:** Company name, phone, WhatsApp, email, hours, license/insurance/warranty details, Google rating/review link, social links, and service areas are all editable at runtime from **Admin → Settings** — no redeploy needed for these values once Firestore is seeded.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + TypeScript, built with Vite 6 |
| Routing | `react-router-dom` v6 (see `App.tsx`) |
| Styling | Tailwind CSS (via CDN `<script>` in `index.html`, not a PostCSS build step) — custom keyframe animations are added as raw `<style>` blocks in `index.html` |
| Icons | `lucide-react` |
| Backend / DB | Firebase **Firestore** (NoSQL document DB) |
| Auth | Firebase **Authentication** (email/password) for admin login |
| File storage | Firebase **Storage** (project photos/media uploads) |
| AI integration | `@google/genai` (Gemini API) — used for AI-assisted content features (see `services/geminiService.ts`) |
| Hosting target | Static build (`vite build` → `dist/`), deployable to Firebase Hosting, Vercel, Netlify, etc. |

---

## 3. Project Structure

```
├── App.tsx                     # Route definitions (public + /admin/*)
├── index.tsx                   # App entry point
├── index.html                  # Tailwind CDN config + custom CSS animations (hero bg)
├── firebase.config.ts          # Firebase project config + SDK initialization
├── firestore.rules             # Firestore security rules (deployed via Firebase Rules API)
├── storage.rules               # Firebase Storage security rules
├── storage-cors.json           # CORS config for Storage bucket
├── vite.config.ts              # Vite build config, env var wiring for Gemini API key
│
├── components/
│   ├── layout/Layout.tsx       # Header, footer, mobile nav, sticky call/WhatsApp buttons
│   ├── layout/Logo.tsx
│   └── common/BeforeAfterSlider.tsx
│
├── pages/
│   ├── PublicPages.tsx         # HomePage, ServicesPage, PortfolioPage (Projects), etc.
│   ├── MorePages.tsx           # Reviews, About, Videos, Contact pages
│   ├── ProjectDetailPage.tsx   # Single project detail view
│   └── admin/                 # Authenticated admin portal (see §5)
│
├── features/
│   └── booking/EstimateSystem.tsx   # Multi-step estimate/booking modal & lead capture flow
│
├── services/                   # Data-access & integration layer
│   ├── db.ts                   # Firestore reads/writes (services, projects, reviews, settings, leads)
│   ├── auth.ts                 # Firebase Auth helpers (admin sign-in/out)
│   ├── storage.ts              # Firebase Storage upload helpers
│   ├── inquiries.ts             # Lead/inquiry submission handling
│   ├── contactLinks.ts         # tel:/wa.me link builders (getTelUrl, getWhatsAppUrl)
│   ├── analytics.ts            # trackEvent() — lightweight event tracking
│   ├── preferences.ts          # Local user prefs (e.g. language)
│   └── geminiService.ts        # Gemini API integration
│
├── constants/index.ts          # COMPANY config, SERVICE_AREAS, bilingual TRANSLATIONS dictionary
├── types/index.ts              # Shared TypeScript types/interfaces
└── dist/                       # Production build output (generated, not committed logic)
```

---

## 4. Public Site Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | `HomePage` | Hero, services preview, trust badges, featured projects, reviews teaser |
| `/services` | `ServicesPage` | Full service catalog grouped by 4 pillars, each with sub-services |
| `/services/:slug` | `ServiceDetailPage` | Individual service detail + booking CTA |
| `/projects` | `PortfolioPage` | Project gallery with category filters + Before/After tab |
| `/projects/:id` | `ProjectDetailPage` | Single project detail (photos, description) |
| `/videos` | `VideosPage` | Video showcase |
| `/reviews` | `ReviewsPage` | Customer reviews |
| `/about` | `AboutPage` | Company story/values |
| `/contact` | `ContactPage` | Contact form, phone/WhatsApp/email, service area |
| `/before-after`, `/portfolio`, `/project/:id` | — | Legacy redirects to `/projects` (backwards-compatible URLs) |

## 5. Admin Portal (`/admin`)

Protected by Firebase Auth + Firestore custom claims (`request.auth.token.admin == true`). Accessible at `/admin` after signing in (handled by `AdminGate.tsx` → `AdminAuthContext.tsx`).

| Route | Purpose |
|---|---|
| `/admin/leads`, `/admin/leads/:id` | View & manage inbound estimate requests/leads |
| `/admin/projects`, `/admin/projects/:id` | Create/edit/delete portfolio projects |
| `/admin/services`, `/admin/services/:id` | Create/edit/delete services (pillars & sub-services) |
| `/admin/reviews`, `/admin/reviews/:id` | Manage customer reviews shown on the public site |
| `/admin/quick-upload` | Fast mobile-friendly photo upload flow for new job photos |
| `/admin/settings` | Edit company info: phone, WhatsApp, email, hours, license/insurance/warranty, Google rating & review URL, social links, logo URL, service areas |

**Data flow note:** Once `business_settings/main` exists in Firestore, `getBusinessSettings()` (`services/db.ts`) reads live from Firestore — the `COMPANY` object in `constants/index.ts` only serves as an initial seed value / offline fallback. To change live business info, use **Admin → Settings**, not the constants file.

---

## 6. Firebase Architecture

- **Project ID:** `kl-profinish-plastering-de401`
- **Firestore collections:** `services`, `projects`, `project_media`, `reviews`, `service_areas`, `business_settings` (single `main` doc), `jobs` (leads/inquiries), plus auth-gated admin writes.
- **Security model:**
  - Public **reads** are open (`allow read: if true`) for marketing content (services/projects/reviews/etc.).
  - All **writes** require `isAdmin()`, defined as `request.auth != null && request.auth.token.admin == true` — i.e., a signed-in user with the `admin` custom claim explicitly set (not just any authenticated user).
  - The admin custom claim is set via the Firebase Admin SDK (one-time script, not part of the deployed app) and requires the affected user to re-authenticate before the new claim takes effect in security rule checks.
- **Storage rules** (`storage.rules`) similarly restrict uploads to authenticated admins while allowing public read access to uploaded media.
- Rules are deployed via the Firebase Rules REST API (or `firebase deploy --only firestore:rules,storage`), config anchored by `firebase.json` / `.firebaserc`.

---

## 7. Key Features

- **Estimate/Booking flow** (`features/booking/EstimateSystem.tsx`): multi-step modal for capturing project details and submitting a lead, written to the `jobs`/leads collection and viewable in `/admin/leads`.
- **Bilingual content**: every public-facing string is sourced from the `TRANSLATIONS` dictionary in `constants/index.ts`, keyed by `Language` (`en`/`es`), with a persisted language preference (`services/preferences.ts`).
- **Trust signals**: license/insurance badges, warranty info, and Google rating — all editable, rendered consistently (vertically stacked/centered) across mobile and desktop.
- **Animated hero background**: CSS-only gradient drift + light-sweep animation (no image/video asset) for fast load times, with `prefers-reduced-motion` fallback (see `index.html`).
- **Sticky Call/WhatsApp actions**: header, footer, and mobile sticky bar all deep-link to `tel:` and `https://wa.me/` using `COMPANY.phone` / `COMPANY.whatsapp` via `services/contactLinks.ts`.
- **Before/After slider**: interactive drag-comparison component (`components/common/BeforeAfterSlider.tsx`) for showcasing renovation results.
- **Analytics hooks**: `trackEvent()` calls sprinkled across CTAs (call, WhatsApp, book, etc.) via `services/analytics.ts` for conversion tracking.

---

## 8. Run Locally

**Prerequisites:** Node.js (v18+ recommended)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Firebase config is currently inlined in `firebase.config.ts` (project: `kl-profinish-plastering-de401`).
3. Run the dev server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000` by default (see `vite.config.ts`).
4. Type-check and build for production:
   ```bash
   npx tsc --noEmit
   npm run build       # outputs to dist/
   npm run preview     # preview the production build locally
   ```

## 9. Deploying Firestore/Storage Rules

```bash
firebase deploy --only firestore:rules,storage
```
(Requires being authenticated with `firebase login` and having write access to the `kl-profinish-plastering-de401` project, or using the Firebase Rules REST API directly if CLI permissions are restricted.)

## 10. Admin Access

- Admin login: `/admin` (email/password via Firebase Auth).
- New admins must be granted the `admin: true` custom claim via the Firebase Admin SDK (requires a service account key — not stored in this repo for security; generate one via **Firebase Console → Project Settings → Service Accounts** when needed, and delete it after use).
- After a claim is granted/changed, the affected user must sign out and back in for the change to take effect in Firestore security rule checks.

---

*Originally scaffolded in Google AI Studio: https://ai.studio/apps/drive/1sMwictcxg8QglPMHpWOr358WTXWJEx43*
