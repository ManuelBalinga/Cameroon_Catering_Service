"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { CatererCard } from "@/components/CatererCard";
import { caterers } from "@/data/caterers";
import { cuisineLabels } from "@/lib/i18n";
import { cuisines, cities, guestBuckets } from "@/lib/options";
import type { Cuisine } from "@/lib/types";

type SortKey = "recommended" | "rating" | "priceLow" | "priceHigh";

export function BrowseClient() {
  const { t, locale } = useI18n();
  const params = useSearchParams();

  // Seed filter state from the URL (set by the homepage search).
  const [city, setCity] = useState(params.get("city") ?? "");
  const [cuisine, setCuisine] = useState<string>(params.get("cuisine") ?? "");
  const [guests, setGuests] = useState(params.get("guests") ?? "");
  const [maxBudget, setMaxBudget] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("recommended");

  const results = useMemo(() => {
    let list = caterers.filter((c) => {
      if (city && c.city !== city) return false;
      if (cuisine && !c.cuisines.includes(cuisine as Cuisine)) return false;
      if (guests && c.minGuests > Number(guests)) return false;
      if (maxBudget && c.priceFromPerGuest > Number(maxBudget)) return false;
      if (verifiedOnly && !c.verified) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "rating":
          return b.rating - a.rating;
        case "priceLow":
          return a.priceFromPerGuest - b.priceFromPerGuest;
        case "priceHigh":
          return b.priceFromPerGuest - a.priceFromPerGuest;
        default:
          // Recommended: featured & premium first, then rating.
          return (
            Number(b.featured) - Number(a.featured) ||
            Number(b.subscriptionTier === "premium") -
              Number(a.subscriptionTier === "premium") ||
            b.rating - a.rating
          );
      }
    });
    return list;
  }, [city, cuisine, guests, maxBudget, verifiedOnly, sort]);

  function clearFilters() {
    setCity("");
    setCuisine("");
    setGuests("");
    setMaxBudget("");
    setVerifiedOnly(false);
  }

  const hasFilters = city || cuisine || guests || maxBudget || verifiedOnly;

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t("nav.browse")}</h1>
        <p className="mt-1 text-ink-soft">
          <span className="font-semibold text-brand-700">{results.length}</span>{" "}
          {t("search.results")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters --------------------------------------------------------- */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-ink">{t("search.filters")}</h2>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  {t("search.clear")}
                </button>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label">{t("search.location")}</label>
                <select className="field" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">{t("search.any")}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("search.cuisine")}</label>
                <select
                  className="field"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                >
                  <option value="">{t("search.any")}</option>
                  {cuisines.map((c) => (
                    <option key={c} value={c}>
                      {cuisineLabels[locale][c]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">{t("search.guests")}</label>
                <div className="flex flex-wrap gap-1.5">
                  {guestBuckets.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(guests === String(g) ? "" : String(g))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        guests === String(g)
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-brand-100 text-ink-soft hover:border-brand-300"
                      }`}
                    >
                      {g}+
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">{t("search.budget")}</label>
                <select
                  className="field"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                >
                  <option value="">{t("search.any")}</option>
                  <option value="3000">≤ 3 000 FCFA</option>
                  <option value="5000">≤ 5 000 FCFA</option>
                  <option value="8000">≤ 8 000 FCFA</option>
                  <option value="15000">≤ 15 000 FCFA</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-brand-50/60 p-3">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="h-4 w-4 accent-brand-500"
                />
                <span className="text-sm font-medium text-ink">
                  🛡️ {t("search.verifiedOnly")}
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Results --------------------------------------------------------- */}
        <div>
          <div className="mb-4 flex items-center justify-end">
            <label className="mr-2 text-sm text-ink-faint">{t("search.sortBy")}:</label>
            <select
              className="field max-w-[220px] py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="recommended">{t("search.sort.recommended")}</option>
              <option value="rating">{t("search.sort.rating")}</option>
              <option value="priceLow">{t("search.sort.priceLow")}</option>
              <option value="priceHigh">{t("search.sort.priceHigh")}</option>
            </select>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => (
                <CatererCard key={c.id} caterer={c} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center gap-3 p-12 text-center">
              <span className="text-4xl">🔍</span>
              <p className="text-ink-soft">{t("search.noResults")}</p>
              <button onClick={clearFilters} className="btn-outline">
                {t("search.clear")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
