import { Project, Service, Review, Booking, ContactInquiry } from '../types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_REVIEWS } from '../constants';

// Bumped to v12 for the K&L Pro-Finish rebrand data shape (adds Service.slug, etc).
const KEYS = {
  PROJECTS: 'br_projects_v12',
  SERVICES: 'br_services_v12',
  REVIEWS: 'br_reviews_v12',
  BOOKINGS: 'br_bookings_v12',
  INQUIRIES: 'br_inquiries_v12'
};

const get = <T>(key: string, initial: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

const set = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const storageService = {
  getProjects: () => get<Project[]>(KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (projects: Project[]) => set(KEYS.PROJECTS, projects),
  
  getServices: () => get<Service[]>(KEYS.SERVICES, INITIAL_SERVICES),
  saveServices: (services: Service[]) => set(KEYS.SERVICES, services),

  getReviews: () => get<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]) => set(KEYS.REVIEWS, reviews),

  getBookings: () => get<Booking[]>(KEYS.BOOKINGS, []),
  saveBookings: (bookings: Booking[]) => set(KEYS.BOOKINGS, bookings),
  addBooking: (booking: Booking) => {
    const bookings = get<Booking[]>(KEYS.BOOKINGS, []);
    bookings.push(booking);
    set(KEYS.BOOKINGS, bookings);
  },
  updateBookingStatus: (id: string, status: Booking['status']) => {
    const bookings = get<Booking[]>(KEYS.BOOKINGS, []);
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    set(KEYS.BOOKINGS, updated);
  },

  getInquiries: () => get<ContactInquiry[]>(KEYS.INQUIRIES, []),
  addInquiry: (inquiry: ContactInquiry) => {
    const inquiries = get<ContactInquiry[]>(KEYS.INQUIRIES, []);
    inquiries.push(inquiry);
    set(KEYS.INQUIRIES, inquiries);
  }
};