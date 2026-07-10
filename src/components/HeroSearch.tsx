"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { eventTypeLabels, cuisineLabels } from "@/lib/i18n";
import { eventTypes, cuisines, cities, guestBuckets } from "@/lib/options";

/**
 * Homepage search. Collects the essentials — event, city, guests, cuisine —
 * and hands them to /browse as query params so the directory opens pre-filtered.
 */
export function HeroSearch() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [eventType, setEventType] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [cuisine, setCuisine] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (eventType) params.set("event", eventType);
    if (city) params.set("city", city);
    if (guests) params.set("guests", guests);
    if (cuisine) params.set("cuisine", cuisine);
    router.push(`/browse${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
    >
      <div>
        <label className="label">{t("search.eventType")}</label>
        <select className="field" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="">{t("search.any")}</option>
          {eventTypes.map((et) => (
            <option key={et} value={et}>
              {eventTypeLabels[locale][et]}
            </option>
          ))}
        </select>
      </div>

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
        <label className="label">{t("search.guests")}</label>
        <select className="field" value={guests} onChange={(e) => setGuests(e.target.value)}>
          <option value="">{t("search.any")}</option>
          {guestBuckets.map((g) => (
            <option key={g} value={g}>
              {g}+
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">{t("search.cuisine")}</label>
        <select className="field" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
          <option value="">{t("search.any")}</option>
          {cuisines.map((c) => (
            <option key={c} value={c}>
              {cuisineLabels[locale][c]}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn-primary h-[46px] w-full">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.9 3.5l4.3 4.3-1.4 1.4-4.3-4.3A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        {t("search.search")}
      </button>
    </form>
  );
}
