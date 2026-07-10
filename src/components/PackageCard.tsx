"use client";

import Link from "next/link";
import type { Caterer, EventPackage } from "@/lib/types";
import { useI18n } from "@/context/I18nContext";
import { formatFCFA } from "@/lib/format";

/**
 * Event package card, sized to a common guest count (20/50/100/200).
 * Clicking through carries the caterer + package into the checkout flow.
 */
export function PackageCard({
  caterer,
  pkg,
  popular = false,
}: {
  caterer: Caterer;
  pkg: EventPackage;
  popular?: boolean;
}) {
  const { t, locale } = useI18n();
  const total = pkg.pricePerGuest * pkg.guestCount;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white p-5 transition-shadow hover:shadow-card ${
        popular ? "border-brand-400 ring-1 ring-brand-200" : "border-brand-100"
      }`}
    >
      {popular && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
          ★ Popular
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <h4 className="font-bold text-ink">{pkg.name[locale]}</h4>
        <span className="text-xs font-semibold text-ink-faint">
          {pkg.guestCount} {t("caterer.guests")}
        </span>
      </div>

      <p className="mt-3">
        <span className="text-2xl font-extrabold text-brand-700">
          {formatFCFA(pkg.pricePerGuest, locale)}
        </span>
        <span className="text-sm text-ink-faint"> {t("package.perGuest")}</span>
      </p>

      <ul className="mt-4 flex-1 space-y-2 text-sm text-ink-soft">
        {pkg.highlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 text-brand-500">✓</span>
            {h[locale]}
          </li>
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-brand-50/70 px-3 py-2 text-sm">
        <span className="text-ink-faint">{t("package.total")}: </span>
        <span className="font-bold text-ink">{formatFCFA(total, locale)}</span>
      </div>

      <Link
        href={`/checkout?caterer=${caterer.id}&package=${pkg.id}`}
        className="btn-primary mt-4 w-full"
      >
        {t("caterer.selectPackage")}
      </Link>
    </div>
  );
}
