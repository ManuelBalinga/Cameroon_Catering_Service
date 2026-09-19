import { describe, expect, it } from "vitest";
import {
  dictionary,
  eventTypeLabels,
  cuisineLabels,
  paymentLabels,
  statusLabels,
} from "@/lib/i18n";
import { eventTypes, cuisines } from "@/lib/options";

/**
 * Cameroon is officially bilingual, so a key that exists in one language and not
 * the other is a visible bug rather than a tidiness issue. The dictionary is
 * hand-maintained; this is what keeps it honest as it grows.
 */

describe("translation dictionary", () => {
  const en = Object.keys(dictionary.en).sort();
  const fr = Object.keys(dictionary.fr).sort();

  it("has the same keys in English and French", () => {
    expect(fr.filter((k) => !en.includes(k))).toEqual([]);
    expect(en.filter((k) => !fr.includes(k))).toEqual([]);
  });

  it("has no empty translations", () => {
    for (const locale of ["en", "fr"] as const) {
      for (const [key, value] of Object.entries(dictionary[locale])) {
        expect(value, `${locale}.${key} is empty`).not.toBe("");
      }
    }
  });
});

describe("enum label maps", () => {
  it("label every event type in both languages", () => {
    for (const et of eventTypes) {
      expect(eventTypeLabels.en[et]).toBeTruthy();
      expect(eventTypeLabels.fr[et]).toBeTruthy();
    }
  });

  it("label every cuisine in both languages", () => {
    for (const c of cuisines) {
      expect(cuisineLabels.en[c]).toBeTruthy();
      expect(cuisineLabels.fr[c]).toBeTruthy();
    }
  });

  it("label every payment method and booking status in both languages", () => {
    for (const map of [paymentLabels, statusLabels]) {
      const enKeys = Object.keys(map.en).sort();
      const frKeys = Object.keys(map.fr).sort();
      expect(enKeys).toEqual(frKeys);
      for (const k of enKeys) {
        expect((map.en as Record<string, string>)[k]).toBeTruthy();
        expect((map.fr as Record<string, string>)[k]).toBeTruthy();
      }
    }
  });
});
