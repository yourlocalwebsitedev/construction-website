export enum Language {
  EN = 'en',
  ES = 'es'
}

export enum ServiceCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INTERIOR = 'Interior',
  INDUSTRIAL = 'Industrial'
}

export interface LocalizedString {
  en: string;
  es: string;
}

export interface FaqItem {
  question: LocalizedString;
  answer: LocalizedString;
}

// A single labeled step in a service's technical installation/repair process
// (e.g. "Scratch Coat", "Reinforcing Mesh"). Used on individual service pages
// to communicate technical competency beyond just the finished look.
export interface ProcessStep {
  title: LocalizedString;
  description: LocalizedString;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  description: LocalizedString;
  category: ServiceCategory;
  imageUrl: string;
  priceRange?: string;
  problems?: LocalizedString[];
  benefits?: LocalizedString[];
  faqs?: FaqItem[];
  // Ordered technical process (assembly/steps) shown on the service detail page.
  processSteps?: ProcessStep[];
  // Optional simplified assembly diagram text, e.g. "Scratch → Brown → Finish".
  assemblySummary?: LocalizedString;
  // True for the four primary pillar services shown on the homepage/nav;
  // false/undefined for narrower sub-services nested under a pillar.
  isPillar?: boolean;
  // For sub-services, the slug of the parent pillar service (e.g. 'stucco').
  parentSlug?: string;
  active?: boolean;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface BeforeAfterItem {
  id: string;
  title: LocalizedString;
  service: LocalizedString;
  location: string;
  category: string;
  beforeImage: string;
  afterImage: string;
}

export interface VideoItem {
  id: string;
  title: LocalizedString;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export interface ServiceArea {
  id?: string;
  city: string;
  state: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Project {
  id: string;
  slug?: string;
  title: LocalizedString;
  shortDescription?: LocalizedString;
  description: LocalizedString;
  problem?: LocalizedString;
  solution?: LocalizedString;
  images: string[];
  category: ServiceCategory;
  featured: boolean;
  published?: boolean;
  displayOrder?: number;
  completionDate: string;
  location?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  services?: LocalizedString[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Media attached to a project (before/during/after/general photos + video).
export type ProjectMediaType = 'before' | 'during' | 'after' | 'general' | 'video' | 'video_thumbnail';

export interface ProjectMedia {
  id: string;
  projectId: string;
  type: ProjectMediaType;
  url: string;
  storagePath?: string;
  order?: number;
  createdAt?: any;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: LocalizedString;
  date: string;
  source?: string;
  isPlaceholder?: boolean;
  featured?: boolean;
  displayOrder?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // ISO String
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

// ==================================================
// ESTIMATE INQUIRY SYSTEM
// ==================================================
export enum InquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  ESTIMATE_SCHEDULED = 'ESTIMATE_SCHEDULED',
  ESTIMATE_SENT = 'ESTIMATE_SENT',
  WON = 'WON',
  LOST = 'LOST',
}

export type PreferredContact = 'call' | 'text' | 'email' | 'whatsapp';

export interface InquiryMedia {
  id: string;
  inquiryId: string;
  url: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  createdAt?: any;
}

export interface Inquiry {
  id: string;
  createdAt?: any;
  updatedAt?: any;
  submissionDate: string; // ISO string, client-side timestamp
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
  photos: InquiryMedia[];
  language: Language;
  status: InquiryStatus;
  internalNotes?: string;
  source: string; // e.g. 'website'
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  } | null;
}

// Legacy simple contact form model (kept for backward compatibility with storage.ts).
export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  zip: string;
  serviceType: string;
  timeline: string;
  preferredContact: 'phone' | 'email' | 'text';
  message: string;
  attachmentUrl?: string; // base64 or mock url
  date: string;
}

// ==================================================
// BUSINESS SETTINGS (single-document configuration)
// ==================================================
export interface BusinessSettings {
  id?: string;
  name: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  primaryCity: string;
  hoursEn: string;
  hoursEs: string;
  licenseNumber: string | null;
  insuranceInfo: string | null;
  warrantyYears: number | null;
  warrantyInfo: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  googleReviewUrl: string | null;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  logoUrl: string | null;
  updatedAt?: any;
}

// A rough field-photos-only entry created via Quick Job Upload before it
// has been turned into a polished, published Project.
export interface JobDraft {
  id: string;
  name: string;
  location: string;
  serviceId?: string;
  serviceLabel?: string;
  beforePhotos: string[];
  afterPhotos: string[];
  videoUrl?: string;
  notes?: string;
  convertedToProjectId?: string;
  createdAt?: any;
  updatedAt?: any;
}