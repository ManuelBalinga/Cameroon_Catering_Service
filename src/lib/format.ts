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
