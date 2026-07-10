"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { eventTypeLabels, cuisineLabels } from "@/lib/i18n";
import { eventTypes, cuisines, cities } from "@/lib/options";
import { addOns } from "@/data/addons";
import { getCaterer } from "@/data/caterers";
import { formatFCFA } from "@/lib/format";
import { Monogram } from "@/components/FoodArt";

export function QuoteClient() {
  const { t, locale } = useI18n();
  const params = useSearchParams();
  const caterer = getCaterer(params.get("caterer") ?? "");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    eventType: (params.get("event") as string) || "wedding",
    date: "",
    city: caterer?.city ?? "",
    guests: "50",
    cuisine: "",
    budget: "",
    requests: "",
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  // Rough live estimate to set expectations before caterers reply.
  const estimate = useMemo(() => {
    const guests = Number(form.guests) || 0;
    const perGuest = form.budget
      ? Number(form.budget)
      : caterer
        ? (caterer.priceFromPerGuest + caterer.priceToPerGuest) / 2
        : 4500;
    const addOnTotal = selectedAddOns.reduce((sum, id) => {
      const a = addOns.find((x) => x.id === id);
      if (!a) return sum;
      // per-guest add-ons scale with headcount, others are flat.
      const scales = ["drinks", "waitstaff", "chairs", "tables"].includes(a.category);
      return sum + (scales ? a.priceFrom * guests : a.priceFrom);
    }, 0);
    return guests * perGuest + addOnTotal;
  }, [form.guests, form.budget, selectedAddOns, caterer]);

  if (submitted) {
    return (
      <div className="container-page flex justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
            ✅
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{t("quote.success")}</h1>
          <p className="mt-2 text-ink-soft">{t("quote.successDesc")}</p>
          <div className="mt-5 rounded-xl bg-brand-50 p-4 text-left text-sm">
            <p><span className="text-ink-faint">{t("quote.eventType")}:</span> {eventTypeLabels[locale][form.eventType as keyof typeof eventTypeLabels["en"]]}</p>
            <p><span className="text-ink-faint">{t("quote.guests")}:</span> {form.guests}</p>
            <p><span className="text-ink-faint">{t("quote.estimate")}:</span> <span className="font-bold text-brand-700">{formatFCFA(estimate, locale)}</span></p>
          </div>
          <div className="mt-6 space-y-2">
            <Link
              href={`/offers?event=${form.eventType}&city=${encodeURIComponent(
                form.city
              )}&guests=${form.guests}&cuisine=${form.cuisine}&budget=${form.budget}`}
              className="btn-primary w-full"
            >
              {t("cta.compare")} →
            </Link>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button onClick={() => setSubmitted(false)} className="btn-outline flex-1">
                {t("quote.reset")}
              </button>
              <Link href="/dashboard/customer" className="btn-ghost flex-1">
                {t("nav.dashboard")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t("quote.title")}</h1>
          <p className="mt-2 text-ink-soft">{t("quote.subtitle")}</p>
        </div>

        {caterer && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
            <Monogram name={caterer.businessName} hue={caterer.brandHue} size={40} />
            <p className="text-sm text-ink-soft">
              {locale === "fr" ? "Devis demandé à" : "Requesting a quote from"}{" "}
              <span className="font-bold text-ink">{caterer.businessName}</span>
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div>
            <label className="label">{t("quote.yourName")}</label>
            <input
              required
              className="field"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Jean Nkeng"
            />
          </div>
          <div>
            <label className="label">{t("quote.phone")}</label>
            <input
              required
              className="field"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+237 6XX XXX XXX"
            />
          </div>

          <div>
            <label className="label">{t("quote.eventType")}</label>
            <select
              className="field"
              value={form.eventType}
              onChange={(e) => update("eventType", e.target.value)}
            >
              {eventTypes.map((et) => (
                <option key={et} value={et}>
                  {eventTypeLabels[locale][et]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("quote.date")}</label>
            <input
              required
              type="date"
              className="field"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </div>

          <div>
            <label className="label">{t("quote.city")}</label>
            <select
              className="field"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            >
              <option value="">{t("search.any")}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("quote.guests")}</label>
            <input
              required
              type="number"
              min={1}
              className="field"
              value={form.guests}
              onChange={(e) => update("guests", e.target.value)}
            />
          </div>

          <div>
            <label className="label">{t("quote.cuisine")}</label>
            <select
              className="field"
              value={form.cuisine}
              onChange={(e) => update("cuisine", e.target.value)}
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
            <label className="label">{t("quote.budget")}</label>
            <input
              type="number"
              min={0}
              step={500}
              className="field"
              value={form.budget}
              onChange={(e) => update("budget", e.target.value)}
              placeholder="4500"
            />
          </div>

          {/* Add-ons */}
          <div className="sm:col-span-2">
            <label className="label">{t("quote.addons")}</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {addOns.map((a) => {
                const active = selectedAddOns.includes(a.id);
                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => toggleAddOn(a.id)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-medium transition-colors ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-brand-100 text-ink-soft hover:border-brand-300"
                    }`}
                  >
                    <span className="text-lg">{a.icon}</span>
                    <span className="truncate">{a.name[locale]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="label">{t("quote.requests")}</label>
            <textarea
              className="field min-h-[96px]"
              value={form.requests}
              onChange={(e) => update("requests", e.target.value)}
              placeholder={t("quote.requestsPlaceholder")}
            />
          </div>

          {/* Estimate */}
          <div className="sm:col-span-2 flex flex-col items-start justify-between gap-3 rounded-2xl bg-brand-950 p-5 text-white sm:flex-row sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-wide text-brand-100/70">
                {t("quote.estimate")}
              </p>
              <p className="text-2xl font-extrabold">{formatFCFA(estimate, locale)}</p>
              <p className="text-xs text-brand-100/60">{t("quote.estimateNote")}</p>
            </div>
            <button type="submit" className="btn-gold w-full sm:w-auto">
              {t("quote.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
