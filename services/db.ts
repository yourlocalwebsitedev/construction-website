// ============================================================
// Static content layer.
//
// There is no backend/database for this site — Services, Projects,
// Reviews, Service Areas, and Business Settings are all developer-edited
// content living directly in constants.ts. To update the site's content
// or photos, edit constants/index.ts and redeploy.
//
// These functions keep the same async signatures the UI already expects
// (getServices/getProjects/etc.) so call sites didn't need to change,
// but they simply resolve immediately with the bundled data — no network
// call, no timeout, no fallback logic required.
// ============================================================
import { Service, Project, Review, ServiceArea, BusinessSettings } from '../types';
import { INITIAL_SERVICES, INITIAL_PROJECTS, INITIAL_REVIEWS, SERVICE_AREAS, COMPANY } from '../constants';

export async function getServices(): Promise<Service[]> {
  return INITIAL_SERVICES;
}

export async function getProjects(): Promise<Project[]> {
  return INITIAL_PROJECTS;
}

export async function getReviews(): Promise<Review[]> {
  return INITIAL_REVIEWS;
}

export async function getServiceAreas(): Promise<ServiceArea[]> {
  return SERVICE_AREAS;
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  return {
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
}
