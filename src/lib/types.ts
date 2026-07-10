/**
 * Domain types for Cameroon Catering Service.
 *
 * These mirror the database entities the platform will eventually persist
 * (users, caterers, bookings, quote requests, reviews, payments, messages,
 * featured listings, subscriptions, add-on services). Keeping them in one
 * place lets UI, mock data, and future API code share a single contract.
 */

export type Locale = "en" | "fr";

/** A string that can be shown in either supported language. */
export type Localized = Record<Locale, string>;

export type UserRole = "customer" | "caterer" | "admin";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string; // Cameroonian numbers, e.g. +237 6XX XXX XXX
  email?: string;
  city: string;
  createdAt: string;
}

export type EventType =
  | "wedding"
  | "birthday"
  | "funeral"
  | "office"
  | "church"
  | "school"
  | "private_dinner"
  | "bulk_order";

export type Cuisine =
  | "cameroonian"
  | "continental"
  | "grill"
  | "pastry"
  | "nigerian"
  | "asian"
  | "vegetarian"
  | "seafood";

export type PaymentMethod =
  | "mtn_momo"
  | "orange_money"
  | "bank_transfer"
  | "cash";

export type BookingStatus =
  | "quote_requested"
  | "quoted"
  | "deposit_pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "disputed";

/** A pre-built menu bundle sized to a common guest count (20/50/100/200). */
export interface EventPackage {
  id: string;
  name: Localized;
  guestCount: number;
  pricePerGuest: number; // in XAF (FCFA)
  highlights: Localized[];
  includesService: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: Localized;
  cuisine: Cuisine;
  pricePerGuest: number; // in XAF (FCFA)
}

export interface Review {
  id: string;
  catererId: string;
  author: string;
  city: string;
  eventType: EventType;
  rating: number; // 1..5
  comment: Localized;
  date: string;
  verifiedBooking: boolean;
}

export interface Caterer {
  id: string;
  businessName: string;
  tagline: Localized;
  about: Localized;
  city: string;
  serviceAreas: string[];
  cuisines: Cuisine[];
  verified: boolean;
  featured: boolean;
  subscriptionTier: "free" | "premium";
  rating: number;
  reviewCount: number;
  completedEvents: number;
  minGuests: number;
  priceFromPerGuest: number; // in XAF (FCFA)
  priceToPerGuest: number; // in XAF (FCFA)
  responseTimeHours: number;
  yearsActive: number;
  phone: string;
  whatsapp: string; // international format without +, for wa.me links
  /** Deterministic gradient seed so the placeholder art is stable per caterer. */
  brandHue: number;
  packages: EventPackage[];
  menu: MenuItem[];
  gallery: string[]; // short labels used by the CSS placeholder gallery
  /** Availability: ISO dates that are already fully booked. */
  bookedDates: string[];
}

/** Optional extras the platform earns commission on. */
export interface AddOnService {
  id: string;
  name: Localized;
  category:
    | "cake"
    | "drinks"
    | "waitstaff"
    | "chairs"
    | "tables"
    | "decoration"
    | "rentals";
  unit: Localized;
  priceFrom: number; // in XAF (FCFA)
  icon: string; // emoji used in the UI
}

export interface QuoteRequest {
  id: string;
  customerName: string;
  eventType: EventType;
  date: string;
  city: string;
  guestCount: number;
  cuisine?: Cuisine;
  budget?: number;
  addOns: string[]; // AddOnService ids
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  catererId?: string;
}

export interface Booking {
  id: string;
  reference: string;
  catererId: string;
  customerName: string;
  eventType: EventType;
  date: string;
  city: string;
  guestCount: number;
  total: number; // in XAF (FCFA)
  depositAmount: number; // in XAF (FCFA)
  commissionRate: number; // 0.10 - 0.15
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
}
