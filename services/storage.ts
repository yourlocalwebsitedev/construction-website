import { Project, Service, Review, Booking, ContactInquiry } from '../types';
import { INITIAL_PROJECTS, INITIAL_SERVICES, INITIAL_REVIEWS } from '../constants';

// Updated keys to v7 to strictly force fresh data load
const KEYS = {
  PROJECTS: 'br_projects_v7',
  SERVICES: 'br_services_v7',
  REVIEWS: 'br_reviews_v7',
  BOOKINGS: 'br_bookings_v7',
  INQUIRIES: 'br_inquiries_v7'
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