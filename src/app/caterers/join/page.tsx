"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { cuisineLabels } from "@/lib/i18n";
import { cuisines, cities } from "@/lib/options";
import { PaymentBadges } from "@/components/PaymentBadges";
import type { Cuisine } from "@/lib/types";

/**
 * Caterer onboarding / profile-builder. New caterers submit their business here;
 * it lands in the admin dashboard's "pending approval" queue (verified = false)
 * until an admin approves it. Simulated — see CLAUDE.md TODO #6.
 */
export default function JoinPage() {
  const { t, locale } = useI18n();
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleCuisine = (c: Cuisine) =>
    setSelectedCuisines((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  if (submitted) {
    return (
      <div className="container-page flex justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
            🎉
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            {t("join.submitted")}
          </h1>
          <p className="mt-2 text-ink-soft">
            {t("join.submittedDesc")}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/caterer" className="btn-primary flex-1">
              {t("join.goDashboard")}
            </Link>
            <button onClick={() => setSubmitted(false)} className="btn-outline flex-1">
              {t("join.edit")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Value banner */}
      <section className="bg-gradient-to-b from-brand-50/80 to-white py-12">
        <div className="container-page max-w-3xl text-center">
          <span className="chip mx-auto mb-3 bg-white shadow-sm">👨‍🍳 {t("join.eyebrow")}</span>
          <h1 className="text-2xl font-extrabold text-ink sm:text-4xl">
            {t("join.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            {t("join.lead")}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <span>✅ {t("join.perkFree")}</span>
            <span>💰 {t("join.perkPayouts")}</span>
            <span>⭐ {t("join.perkVerified")}</span>
          </div>
        </div>
      </section>

      <div className="container-page py-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="mx-auto max-w-2xl space-y-6"
        >
          {/* Business basics */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              1. {t("join.businessSection")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">{t("join.businessName")}</label>
                <input required className="field" placeholder="Mamie Nkeng Traiteur" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("join.tagline")}</label>
                <input
                  className="field"
                  placeholder={t("join.taglinePlaceholder")}
                />
              </div>
              <div>
                <label className="label">{t("signup.city")}</label>
                <select className="field">
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t("join.yearsActive")}</label>
                <input type="number" min={0} className="field" placeholder="5" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("join.serviceAreas")}</label>
                <input
                  className="field"
                  placeholder={t("join.serviceAreasPlaceholder")}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("join.about")}</label>
                <textarea
                  required
                  className="field min-h-[100px]"
                  placeholder={
                    t("join.aboutPlaceholder")
                  }
                />
              </div>
            </div>
          </section>

          {/* Cuisines */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              2. {t("join.cuisinesSection")}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {t("join.cuisinesHint")}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cuisines.map((c) => {
                const active = selectedCuisines.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-brand-100 text-ink-soft hover:border-brand-300"
                    }`}
                  >
                    {cuisineLabels[locale][c]}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Pricing */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              3. {t("join.pricingSection")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">{t("join.priceFrom")}</label>
                <input type="number" min={0} step={500} className="field" placeholder="3000" />
              </div>
              <div>
                <label className="label">{t("join.priceTo")}</label>
                <input type="number" min={0} step={500} className="field" placeholder="9000" />
              </div>
              <div>
                <label className="label">{t("join.minGuests")}</label>
                <input type="number" min={1} className="field" placeholder="20" />
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-brand-50/60 p-3 text-xs text-ink-soft">
              💡{" "}
              {t("join.pricingTip")}
            </div>
          </section>

          {/* Contact & payout */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              4. {t("join.contactSection")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("signup.phone")}</label>
                <input required className="field" placeholder="+237 6XX XXX XXX" />
              </div>
              <div>
                <label className="label">WhatsApp</label>
                <input className="field" placeholder="+237 6XX XXX XXX" />
              </div>
            </div>
            <div className="mt-4">
              <p className="label">{t("join.payoutVia")}</p>
              <PaymentBadges />
            </div>
          </section>

          <button type="submit" className="btn-primary w-full py-4 text-base">
            {t("join.submit")}
          </button>
          <p className="text-center text-xs text-ink-faint">
            {t("join.submitHint")}
          </p>
        </form>
      </div>
    </div>
  );
}
