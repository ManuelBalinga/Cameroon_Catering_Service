"use client";

import { useI18n } from "@/context/I18nContext";

/** "Verified" trust badge — only shown for caterers approved by admin. */
export function VerifiedBadge() {
  const { t } = useI18n();
  return (
    <span className="badge-verified" title={t("caterer.verified")}>
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
          clipRule="evenodd"
        />
      </svg>
      {t("caterer.verified")}
    </span>
  );
}

/** "Featured" badge — paid placement, a core revenue lever. */
export function FeaturedBadge() {
  const { t } = useI18n();
  return (
    <span className="badge-featured" title={t("caterer.featured")}>
      <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path d="M10 1l2.6 5.3 5.9.9-4.2 4.2 1 5.9L10 14.8 4.7 17.3l1-5.9L1.5 7.2l5.9-.9z" />
      </svg>
      {t("caterer.featured")}
    </span>
  );
}

export function PremiumBadge() {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-gold-300">
      ★ {t("caterer.premium")}
    </span>
  );
}
