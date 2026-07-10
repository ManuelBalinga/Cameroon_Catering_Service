"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useI18n } from "@/context/I18nContext";
import { caterers } from "@/data/caterers";
import { cuisineLabels, eventTypeLabels } from "@/lib/i18n";
import { formatFCFA } from "@/lib/format";
import { Monogram, foodEmoji } from "@/components/FoodArt";
import { Rating } from "@/components/Rating";
import { VerifiedBadge, FeaturedBadge } from "@/components/Badges";
import type { Cuisine, EventType } from "@/lib/types";

/**
 * "Compare offers" — after a customer sends a quote request, this simulates the
 * offers that matching caterers send back, side by side. Each offer computes an
 * indicative total from the caterer's price range and the requested guest count.
 */
export function OffersClient() {
  const { t, locale } = useI18n();
  const fr = locale === "fr";
  const params = useSearchParams();

  const city = params.get("city") ?? "";
  const cuisine = (params.get("cuisine") as Cuisine) || "";
  const guests = Number(params.get("guests")) || 50;
  const budget = Number(params.get("budget")) || 0;
  const eventType = (params.get("event") as EventType) || "";

  const offers = useMemo(() => {
    let list = caterers.filter((c) => {
      if (city && c.city !== city) return false;
      if (cuisine && !c.cuisines.includes(cuisine)) return false;
      if (c.minGuests > guests) return false;
      return true;
    });
    // Fall back to any caterer that can handle the headcount so the customer
    // always sees offers to compare.
    if (list.length === 0) {
      list = caterers.filter((c) => c.minGuests <= guests);
    }

    const withPrice = list.map((c) => {
      const mid = Math.round((c.priceFromPerGuest + c.priceToPerGuest) / 2 / 50) * 50;
      // Respect the customer's budget when it falls inside the caterer's range.
      const perGuest =
        budget && budget >= c.priceFromPerGuest && budget <= c.priceToPerGuest
          ? budget
          : mid;
      return { caterer: c, perGuest, total: perGuest * guests };
    });

    return withPrice.sort(
      (a, b) =>
        Number(b.caterer.featured) - Number(a.caterer.featured) ||
        Number(b.caterer.subscriptionTier === "premium") -
          Number(a.caterer.subscriptionTier === "premium") ||
        b.caterer.rating - a.caterer.rating
    );
  }, [city, cuisine, guests, budget]);

  const nearestPackage = (g: number) => {
    const sizes = [20, 50, 100, 200];
    return sizes.reduce((prev, s) => (Math.abs(s - g) < Math.abs(prev - g) ? s : prev), 50);
  };

  return (
    <div className="container-page py-10">
      <div className="mb-2 flex items-center gap-2 text-sm text-brand-600">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs">✓</span>
        {fr ? "Devis envoyé" : "Quote sent"}
      </div>
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t("cta.compare")}</h1>
      <p className="mt-1 text-ink-soft">
        {fr
          ? `${offers.length} traiteurs ont répondu à votre demande`
          : `${offers.length} caterers responded to your request`}
      </p>

      {/* Request summary chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {eventType && (
          <span className="chip">🎉 {eventTypeLabels[locale][eventType]}</span>
        )}
        <span className="chip">👥 {guests} {t("caterer.guests")}</span>
        {city && <span className="chip">📍 {city}</span>}
        {cuisine && <span className="chip">{foodEmoji(cuisine)} {cuisineLabels[locale][cuisine]}</span>}
        {budget > 0 && (
          <span className="chip">💰 {formatFCFA(budget, locale)} {t("caterer.perGuest")}</span>
        )}
      </div>

      {/* Offers */}
      <div className="mt-6 space-y-4">
        {offers.map(({ caterer, perGuest, total }, i) => (
          <div
            key={caterer.id}
            className={`card p-5 ${i === 0 ? "ring-1 ring-brand-200" : ""}`}
          >
            {i === 0 && (
              <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-bold text-white">
                ★ {fr ? "Meilleure correspondance" : "Best match"}
              </span>
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <Monogram name={caterer.businessName} hue={caterer.brandHue} size={52} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{caterer.businessName}</p>
                    {caterer.verified && <VerifiedBadge />}
                    {caterer.featured && <FeaturedBadge />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint">
                    <Rating value={caterer.rating} count={caterer.reviewCount} />
                    <span>📍 {caterer.city}</span>
                    <span>⚡ {fr ? "Répond en" : "Responds in"} ~{caterer.responseTimeHours}h</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {caterer.cuisines.slice(0, 3).map((c) => (
                      <span key={c} className="chip py-0.5 text-[11px]">
                        {cuisineLabels[locale][c]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="text-xs text-ink-faint">
                  {formatFCFA(perGuest, locale)} {t("caterer.perGuest")}
                </p>
                <p className="text-2xl font-extrabold text-brand-700">
                  {formatFCFA(total, locale)}
                </p>
                <p className="text-[11px] text-ink-faint">
                  {fr ? "estimé pour" : "estimated for"} {guests} {t("caterer.guests")}
                </p>
                <div className="mt-3 flex gap-2 sm:justify-end">
                  <Link href={`/caterers/${caterer.id}`} className="btn-outline btn-sm">
                    {t("cta.viewProfile")}
                  </Link>
                  <Link
                    href={`/checkout?caterer=${caterer.id}&package=pkg-${nearestPackage(guests)}`}
                    className="btn-primary btn-sm"
                  >
                    {t("cta.bookNow")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-brand-50/60 p-5 text-center text-sm text-ink-soft">
        {fr
          ? "Vous ne trouvez pas votre bonheur ? Ajustez votre recherche ou contactez-nous."
          : "Not seeing the right fit? Adjust your search or contact us."}
        <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/browse" className="btn-outline btn-sm">
            {t("cta.browseAll")}
          </Link>
          <Link href="/quote" className="btn-ghost btn-sm">
            {t("cta.requestQuote")}
          </Link>
        </div>
      </div>
    </div>
  );
}
