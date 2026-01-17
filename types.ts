export enum Language {
  EN = 'en',
  ES = 'es'
}

export enum ServiceCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial',
  INDUSTRIAL = 'Industrial'
}

export interface LocalizedString {
  en: string;
  es: string;
}

export interface Service {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  category: ServiceCategory;
  imageUrl: string;
  priceRange?: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  images: string[];
  category: ServiceCategory;
  featured: boolean;
  completionDate: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  text: LocalizedString;
  date: string;
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

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  attachmentUrl?: string; // base64 or mock url
  date: string;
}
