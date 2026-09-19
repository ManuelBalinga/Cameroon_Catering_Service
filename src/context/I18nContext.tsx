"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Locale } from "@/lib/types";
import { dictionary, type TranslationKey } from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey) => string;
  /**
   * Translate a key whose text carries `{token}` placeholders, e.g.
   * `tf("offers.responded", { count: 4 })`. Keeps interpolated strings in the
   * dictionary instead of being rebuilt in each page.
   */
  tf: (key: TranslationKey, vars: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "ccs.locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore the visitor's language choice on mount.
  useEffect(() => {
    const stored = (typeof window !== "undefined" &&
      window.localStorage.getItem(STORAGE_KEY)) as Locale | null;
    if (stored === "en" || stored === "fr") {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "fr" : "en");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: TranslationKey) => dictionary[locale][key] ?? key,
    [locale]
  );

  const tf = useCallback(
    (key: TranslationKey, vars: Record<string, string | number>) =>
      Object.entries(vars).reduce<string>(
        (text, [name, value]) => text.split(`{${name}}`).join(String(value)),
        dictionary[locale][key] ?? key
      ),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t, tf }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
