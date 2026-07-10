"use client";

import Link from "next/link";
import type { Caterer } from "@/lib/types";
import { useI18n } from "@/context/I18nContext";
import { cuisineLabels } from "@/lib/i18n";
import { formatFCFA } from "@/lib/format";
import { Rating } from "./Rating";
import { VerifiedBadge, FeaturedBadge } from "./Badges";
import { CoverArt, foodEmoji } from "./FoodArt";

export function CatererCard({ caterer }: { caterer: Caterer }) {
  const { t, locale } = useI18n();

  return (
    <Link
      href={`/caterers/${caterer.id}`}
      className="group card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative">
        <CoverArt hue={caterer.brandHue} emoji={foodEmoji(caterer.cuisines[0])} />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {caterer.featured && <FeaturedBadge />}
          {caterer.verified && <VerifiedBadge />}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-ink group-hover:text-brand-700">
              {caterer.businessName}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-faint">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z"
                  clipRule="evenodd"
                />
              </svg>
              {caterer.city}
            </p>
          </div>
          <Rating value={caterer.rating} showValue />
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
          {caterer.tagline[locale]}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {caterer.cuisines.slice(0, 3).map((c) => (
            <span key={c} className="chip">
              {cuisineLabels[locale][c]}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-brand-50 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-faint">
              {t("caterer.from")}
            </p>
            <p className="font-bold text-brand-700">
              {formatFCFA(caterer.priceFromPerGuest, locale)}
              <span className="text-xs font-normal text-ink-faint">
                {" "}
                {t("caterer.perGuest")}
              </span>
            </p>
          </div>
          <span className="text-xs font-semibold text-brand-600 group-hover:underline">
            {t("cta.viewProfile")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
