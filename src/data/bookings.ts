import type { Booking, QuoteRequest } from "@/lib/types";
import { DEFAULT_COMMISSION } from "@/lib/format";

/**
 * Seed bookings & quote requests.
 *
 * These power the customer, caterer and admin dashboards so the platform looks
 * alive out of the box. In production these rows would live in the `bookings`
 * and `quote_requests` tables and be scoped to the signed-in user.
 */
export const bookings: Booking[] = [
  {
    id: "bk-1001",
    reference: "CCS-4820",
    catererId: "mamie-nkeng",
    customerName: "Estelle Mbeng",
    eventType: "wedding",
    date: "2026-08-15",
    city: "Douala",
    guestCount: 200,
    total: 900000,
    depositAmount: 270000,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "mtn_momo",
    status: "confirmed",
    createdAt: "2026-07-01",
  },
  {
    id: "bk-1002",
    reference: "CCS-4821",
    catererId: "royal-taste",
    customerName: "Carine Ndzana",
    eventType: "office",
    date: "2026-07-19",
    city: "Yaoundé",
    guestCount: 50,
    total: 325000,
    depositAmount: 97500,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "orange_money",
    status: "confirmed",
    createdAt: "2026-06-28",
  },
  {
    id: "bk-1003",
    reference: "CCS-4790",
    catererId: "buea-delights",
    customerName: "Frankline Etah",
    eventType: "birthday",
    date: "2026-06-10",
    city: "Limbe",
    guestCount: 50,
    total: 250000,
    depositAmount: 75000,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "mtn_momo",
    status: "completed",
    createdAt: "2026-05-20",
  },
  {
    id: "bk-1004",
    reference: "CCS-4805",
    catererId: "sweet-celebration",
    customerName: "Michelle Ako",
    eventType: "birthday",
    date: "2026-06-15",
    city: "Douala",
    guestCount: 20,
    total: 60000,
    depositAmount: 18000,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "orange_money",
    status: "completed",
    createdAt: "2026-06-01",
  },
  {
    id: "bk-1005",
    reference: "CCS-4832",
    catererId: "bafoussam-royal",
    customerName: "Fongang Family",
    eventType: "funeral",
    date: "2026-08-21",
    city: "Bafoussam",
    guestCount: 200,
    total: 520000,
    depositAmount: 156000,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "bank_transfer",
    status: "deposit_pending",
    createdAt: "2026-07-05",
  },
  {
    id: "bk-1006",
    reference: "CCS-4840",
    catererId: "kribi-coast",
    customerName: "Sandrine Bilong",
    eventType: "wedding",
    date: "2026-08-16",
    city: "Kribi",
    guestCount: 100,
    total: 700000,
    depositAmount: 210000,
    commissionRate: DEFAULT_COMMISSION,
    paymentMethod: "mtn_momo",
    status: "confirmed",
    createdAt: "2026-07-06",
  },
];

export const quoteRequests: QuoteRequest[] = [
  {
    id: "qr-2001",
    customerName: "Nadège F.",
    eventType: "wedding",
    date: "2026-09-12",
    city: "Douala",
    guestCount: 150,
    cuisine: "cameroonian",
    budget: 5000,
    addOns: ["addon-cake", "addon-decor", "addon-waitstaff"],
    specialRequests: "Traditional wedding, needs Ndolé and Eru. Vegetarian option for 15 guests.",
    status: "quote_requested",
    createdAt: "2026-07-08",
    catererId: "mamie-nkeng",
  },
  {
    id: "qr-2002",
    customerName: "TotalEnergies HR",
    eventType: "office",
    date: "2026-07-30",
    city: "Yaoundé",
    guestCount: 80,
    cuisine: "continental",
    budget: 7000,
    addOns: ["addon-drinks"],
    specialRequests: "Staff appreciation lunch. Need buffet + soft drinks. Invoice required.",
    status: "quoted",
    createdAt: "2026-07-07",
    catererId: "royal-taste",
  },
  {
    id: "qr-2003",
    customerName: "Belinda A.",
    eventType: "birthday",
    date: "2026-08-05",
    city: "Buea",
    guestCount: 40,
    cuisine: "seafood",
    budget: 6000,
    addOns: ["addon-cake", "addon-chairs", "addon-tables"],
    status: "quote_requested",
    createdAt: "2026-07-09",
    catererId: "buea-delights",
  },
  {
    id: "qr-2004",
    customerName: "Grace N.",
    eventType: "school",
    date: "2026-09-01",
    city: "Bamenda",
    guestCount: 120,
    cuisine: "cameroonian",
    addOns: ["addon-chairs", "addon-tables", "addon-rentals"],
    specialRequests: "End-of-year school party. Budget-friendly menu for students.",
    status: "quote_requested",
    createdAt: "2026-07-09",
    catererId: "bamenda-flavors",
  },
];

/** Bookings for the demo customer shown on the customer dashboard. */
export function customerBookings(): Booking[] {
  return bookings.filter((b) =>
    ["bk-1001", "bk-1003", "bk-1004", "bk-1006"].includes(b.id)
  );
}

/** Bookings & quotes for the demo caterer (Mamie Nkeng) dashboard. */
export function catererBookings(catererId: string): Booking[] {
  return bookings.filter((b) => b.catererId === catererId);
}

export function catererQuotes(catererId: string): QuoteRequest[] {
  return quoteRequests.filter((q) => q.catererId === catererId);
}

/** Platform-wide commission earned to date (admin view). */
export function totalCommission(): number {
  return bookings.reduce((sum, b) => sum + b.total * b.commissionRate, 0);
}

export function totalGmv(): number {
  return bookings.reduce((sum, b) => sum + b.total, 0);
}
