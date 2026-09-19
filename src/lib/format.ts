import type { Locale } from "./types";

/**
 * Cameroon uses the Central African CFA franc (XAF), displayed as "FCFA".
 * Amounts are whole numbers — there are no centimes in everyday pricing.
 */
export function formatFCFA(amount: number, locale: Locale = "en"): string {
  const grouped = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${grouped} FCFA`;
}

/** Compact form for dashboards, e.g. "12,4M FCFA". */
export function formatFCFACompact(amount: number, locale: Locale = "en"): string {
  const nf = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return `${nf.format(amount)} FCFA`;
}

export function formatDate(iso: string, locale: Locale = "en"): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Standard platform commission band: 10%–15% per successful booking. */
export const COMMISSION_MIN = 0.1;
export const COMMISSION_MAX = 0.15;
export const DEFAULT_COMMISSION = 0.12;

/** Deposit customers pay up front to confirm a booking. */
export const DEPOSIT_RATE = 0.3;

/**
 * Deposits are quoted to the nearest 50 FCFA — prices in Cameroon are not
 * written to the franc. This rounding used to live inside the checkout
 * component, which meant the platform's own deposit rule was defined by a page.
 */
export function depositFor(total: number, rate: number = DEPOSIT_RATE): number {
  return Math.min(total, Math.round((total * rate) / 50) * 50);
}

/** What the customer still owes the caterer on the day of the event. */
export function balanceAfterDeposit(
  total: number,
  rate: number = DEPOSIT_RATE
): number {
  return total - depositFor(total, rate);
}

/** The platform's cut of a completed booking, in whole FCFA. */
export function commissionFor(
  total: number,
  rate: number = DEFAULT_COMMISSION
): number {
  return Math.round(total * rate);
}

/**
 * Upsell pricing. These two lived in the caterer dashboard until 19 September —
 * the only prices in the product that escaped this module.
 */
export const PREMIUM_MONTHLY_PRICE = 15_000;
export const FEATURED_LISTING_PRICE = 10_000;
export const FEATURED_LISTING_DAYS = 7;

/** Premium caterers pay the bottom of the commission band instead of the default. */
export const PREMIUM_COMMISSION = COMMISSION_MIN;
