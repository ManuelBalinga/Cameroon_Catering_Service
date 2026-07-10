import type { AddOnService } from "@/lib/types";

/**
 * Add-on services the platform up-sells and earns commission on.
 *
 * These are the natural expansion path for the marketplace: today catering,
 * tomorrow cakes, drinks, décor, rentals, waitstaff, photographers, DJs and
 * cleanup — all bookable in the same trusted flow.
 */
export const addOns: AddOnService[] = [
  {
    id: "addon-cake",
    name: { en: "Celebration cake", fr: "Gâteau de fête" },
    category: "cake",
    unit: { en: "per cake", fr: "par gâteau" },
    priceFrom: 25000,
    icon: "🎂",
  },
  {
    id: "addon-drinks",
    name: { en: "Drinks & bar service", fr: "Boissons & bar" },
    category: "drinks",
    unit: { en: "per guest", fr: "par invité" },
    priceFrom: 1500,
    icon: "🥤",
  },
  {
    id: "addon-waitstaff",
    name: { en: "Waiters & hostesses", fr: "Serveurs & hôtesses" },
    category: "waitstaff",
    unit: { en: "per person / day", fr: "par personne / jour" },
    priceFrom: 12000,
    icon: "🤵",
  },
  {
    id: "addon-chairs",
    name: { en: "Chairs (Chiavari)", fr: "Chaises (Chiavari)" },
    category: "chairs",
    unit: { en: "per chair", fr: "par chaise" },
    priceFrom: 500,
    icon: "🪑",
  },
  {
    id: "addon-tables",
    name: { en: "Tables & linens", fr: "Tables & nappes" },
    category: "tables",
    unit: { en: "per table", fr: "par table" },
    priceFrom: 3000,
    icon: "🍽️",
  },
  {
    id: "addon-decor",
    name: { en: "Décor & flowers", fr: "Décoration & fleurs" },
    category: "decoration",
    unit: { en: "per event", fr: "par événement" },
    priceFrom: 75000,
    icon: "🎈",
  },
  {
    id: "addon-rentals",
    name: { en: "Canopies & rentals", fr: "Bâches & location" },
    category: "rentals",
    unit: { en: "per unit", fr: "par unité" },
    priceFrom: 20000,
    icon: "⛺",
  },
];

export function getAddOn(id: string): AddOnService | undefined {
  return addOns.find((a) => a.id === id);
}

/**
 * Future marketplace categories — surfaced in the UI as "coming soon" so the
 * expansion story is visible to caterers and investors alike.
 */
export const expansionServices = [
  { icon: "📸", en: "Photographers", fr: "Photographes" },
  { icon: "🎧", en: "DJs & sound", fr: "DJ & sonorisation" },
  { icon: "💡", en: "Lighting", fr: "Éclairage" },
  { icon: "🧹", en: "Cleanup crews", fr: "Équipes de nettoyage" },
  { icon: "🚐", en: "Event transport", fr: "Transport événementiel" },
  { icon: "🎪", en: "Full event planning", fr: "Organisation complète" },
];
