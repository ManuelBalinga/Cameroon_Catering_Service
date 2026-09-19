import { describe, expect, it } from "vitest";
import {
  formatFCFA,
  formatFCFACompact,
  formatDate,
  depositFor,
  commissionFor,
  balanceAfterDeposit,
  COMMISSION_MIN,
  COMMISSION_MAX,
  DEFAULT_COMMISSION,
  DEPOSIT_RATE,
} from "@/lib/format";

/**
 * The money functions are where the revenue model lives, so they are the first
 * thing on this project to get assertions. Everything here is a pure function —
 * no DOM, no network, no seed data.
 */

describe("formatFCFA", () => {
  it("never shows centimes", () => {
    expect(formatFCFA(4500.67)).not.toContain(".");
    expect(formatFCFA(4500.67)).not.toContain(",6");
  });

  it("rounds rather than truncates", () => {
    expect(formatFCFA(4500.6)).toBe("4,501 FCFA");
    expect(formatFCFA(4500.4)).toBe("4,500 FCFA");
  });

  it("groups thousands for each locale", () => {
    expect(formatFCFA(1_250_000, "en")).toBe("1,250,000 FCFA");
    // French grouping uses a narrow no-break space, not a comma.
    const fr = formatFCFA(1_250_000, "fr");
    expect(fr).toMatch(/^1\s?250\s?000 FCFA$/u);
  });

  it("handles zero", () => {
    expect(formatFCFA(0)).toBe("0 FCFA");
  });
});

describe("formatFCFACompact", () => {
  it("compacts at thousands and millions", () => {
    expect(formatFCFACompact(12_400_000, "en")).toBe("12.4M FCFA");
    expect(formatFCFACompact(850_000, "en")).toBe("850K FCFA");
  });

  it("leaves small amounts alone", () => {
    expect(formatFCFACompact(900, "en")).toBe("900 FCFA");
  });
});

describe("formatDate", () => {
  it("is day-month-year in both locales, which is what Cameroon expects", () => {
    expect(formatDate("2026-07-14", "en")).toBe("14 Jul 2026");
    expect(formatDate("2026-07-14", "fr")).toMatch(/^14 juil\.? 2026$/u);
  });
});

describe("commission", () => {
  it("keeps the default inside the published 10-15% band", () => {
    expect(DEFAULT_COMMISSION).toBeGreaterThanOrEqual(COMMISSION_MIN);
    expect(DEFAULT_COMMISSION).toBeLessThanOrEqual(COMMISSION_MAX);
  });

  it("takes the default rate off a known total", () => {
    expect(commissionFor(500_000)).toBe(60_000);
  });

  it("accepts an explicit rate for Premium caterers", () => {
    expect(commissionFor(500_000, COMMISSION_MIN)).toBe(50_000);
  });

  it("returns whole FCFA, never a fraction", () => {
    expect(Number.isInteger(commissionFor(333_333))).toBe(true);
  });
});

describe("deposit", () => {
  it("is 30% of the total", () => {
    expect(DEPOSIT_RATE).toBe(0.3);
    expect(depositFor(500_000)).toBe(150_000);
  });

  it("rounds to the nearest 50 FCFA, because prices are quoted that way", () => {
    // 30% of 450,010 is 135,003 -> nearest 50 is 135,000
    expect(depositFor(450_010)).toBe(135_000);
    // 30% of 450,100 is 135,030 -> nearest 50 is 135,050
    expect(depositFor(450_100)).toBe(135_050);
    expect(depositFor(450_010) % 50).toBe(0);
    expect(depositFor(450_100) % 50).toBe(0);
  });

  it("never exceeds the total", () => {
    for (const total of [0, 50, 999, 12_345, 5_000_000]) {
      expect(depositFor(total)).toBeLessThanOrEqual(total);
    }
  });

  it("leaves a balance that adds back up to the total", () => {
    const total = 487_500;
    expect(depositFor(total) + balanceAfterDeposit(total)).toBe(total);
  });
});
