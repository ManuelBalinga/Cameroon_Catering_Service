import type { EventType, Cuisine } from "./types";

/** Enumerations surfaced in dropdowns across search, quote and checkout. */
export const eventTypes: EventType[] = [
  "wedding",
  "birthday",
  "funeral",
  "office",
  "church",
  "school",
  "private_dinner",
  "bulk_order",
];

export const cuisines: Cuisine[] = [
  "cameroonian",
  "continental",
  "grill",
  "pastry",
  "nigerian",
  "asian",
  "vegetarian",
  "seafood",
];

/** Common Cameroonian cities the platform launches in. */
export const cities = [
  "Douala",
  "Yaoundé",
  "Bamenda",
  "Buea",
  "Limbe",
  "Bafoussam",
  "Kribi",
  "Dschang",
  "Edéa",
  "Garoua",
];

/** Guest-count buckets shown as quick chips — mirror the package sizes. */
export const guestBuckets = [20, 50, 100, 200, 500];

export const eventEmoji: Record<EventType, string> = {
  wedding: "💍",
  birthday: "🎉",
  funeral: "🕊️",
  office: "💼",
  church: "⛪",
  school: "🎓",
  private_dinner: "🍷",
  bulk_order: "📦",
};
