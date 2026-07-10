"use client";

import { useI18n } from "@/context/I18nContext";

/** EN / FR switch — Cameroon is officially bilingual. */
export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center rounded-lg border border-brand-100 bg-white p-0.5 text-xs font-bold">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-md px-2.5 py-1 uppercase transition-colors ${
            locale === l
              ? "bg-brand-500 text-white"
              : "text-ink-faint hover:text-brand-700"
          }`}
          aria-pressed={locale === l}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
