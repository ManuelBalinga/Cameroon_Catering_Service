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
  const { locale } = useI18n();
  const fr = locale === "fr";
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
            {fr ? "Profil soumis pour vérification !" : "Profile submitted for review!"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {fr
              ? "Notre équipe vérifie votre entreprise sous 48h. Une fois approuvé, votre profil apparaît dans les résultats et vous recevez des demandes de devis. (Démo.)"
              : "Our team verifies your business within 48h. Once approved, your profile appears in search results and you start receiving quote requests. (Demo.)"}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/caterer" className="btn-primary flex-1">
              {fr ? "Voir mon tableau de bord" : "Go to my dashboard"}
            </Link>
            <button onClick={() => setSubmitted(false)} className="btn-outline flex-1">
              {fr ? "Modifier" : "Edit"}
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
          <span className="chip mx-auto mb-3 bg-white shadow-sm">👨‍🍳 {fr ? "Espace traiteurs" : "For caterers"}</span>
          <h1 className="text-2xl font-extrabold text-ink sm:text-4xl">
            {fr ? "Développez votre activité de traiteur" : "Grow your catering business"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            {fr
              ? "Inscription gratuite. Vous ne payez qu'une commission de 10–15% sur les réservations réussies. Recevez des demandes, envoyez des devis et bâtissez votre réputation."
              : "Free to list. You only pay a 10–15% commission on successful bookings. Receive requests, send quotes and build your reputation."}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink-soft">
            <span>✅ {fr ? "Inscription gratuite" : "Free to join"}</span>
            <span>💰 {fr ? "Paiements Mobile Money" : "Mobile Money payouts"}</span>
            <span>⭐ {fr ? "Badge vérifié" : "Verified badge"}</span>
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
              1. {fr ? "Votre entreprise" : "Your business"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">{fr ? "Nom de l'entreprise" : "Business name"}</label>
                <input required className="field" placeholder="Mamie Nkeng Traiteur" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{fr ? "Slogan court" : "Short tagline"}</label>
                <input
                  className="field"
                  placeholder={fr ? "Festins camerounais authentiques" : "Authentic Cameroonian feasts"}
                />
              </div>
              <div>
                <label className="label">{fr ? "Ville" : "City"}</label>
                <select className="field">
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{fr ? "Années d'activité" : "Years active"}</label>
                <input type="number" min={0} className="field" placeholder="5" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{fr ? "Zones desservies" : "Service areas"}</label>
                <input
                  className="field"
                  placeholder={fr ? "Douala, Bonabéri, Edéa" : "Douala, Bonabéri, Edéa"}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">{fr ? "À propos" : "About"}</label>
                <textarea
                  required
                  className="field min-h-[100px]"
                  placeholder={
                    fr
                      ? "Présentez votre cuisine, votre expérience et ce qui vous rend unique…"
                      : "Describe your cooking, experience and what makes you unique…"
                  }
                />
              </div>
            </div>
          </section>

          {/* Cuisines */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              2. {fr ? "Vos cuisines" : "Your cuisines"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              {fr ? "Sélectionnez tout ce qui s'applique." : "Select all that apply."}
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
              3. {fr ? "Tarifs & capacité" : "Pricing & capacity"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">{fr ? "Prix min. / invité" : "Price from / guest"}</label>
                <input type="number" min={0} step={500} className="field" placeholder="3000" />
              </div>
              <div>
                <label className="label">{fr ? "Prix max. / invité" : "Price to / guest"}</label>
                <input type="number" min={0} step={500} className="field" placeholder="9000" />
              </div>
              <div>
                <label className="label">{fr ? "Commande min." : "Min. guests"}</label>
                <input type="number" min={1} className="field" placeholder="20" />
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-brand-50/60 p-3 text-xs text-ink-soft">
              💡{" "}
              {fr
                ? "Astuce : proposez des formules pour 20, 50, 100 et 200 invités pour attirer plus de clients."
                : "Tip: offer packages for 20, 50, 100 and 200 guests to attract more customers."}
            </div>
          </section>

          {/* Contact & payout */}
          <section className="card p-6">
            <h2 className="font-bold text-ink">
              4. {fr ? "Contact & paiements" : "Contact & payouts"}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{fr ? "Téléphone" : "Phone"}</label>
                <input required className="field" placeholder="+237 6XX XXX XXX" />
              </div>
              <div>
                <label className="label">WhatsApp</label>
                <input className="field" placeholder="+237 6XX XXX XXX" />
              </div>
            </div>
            <div className="mt-4">
              <p className="label">{fr ? "Recevez vos paiements via" : "Get paid via"}</p>
              <PaymentBadges />
            </div>
          </section>

          <button type="submit" className="btn-primary w-full py-4 text-base">
            {fr ? "Soumettre pour vérification" : "Submit for verification"}
          </button>
          <p className="text-center text-xs text-ink-faint">
            {fr
              ? "Un administrateur examinera votre profil avant sa mise en ligne."
              : "An admin will review your profile before it goes live."}
          </p>
        </form>
      </div>
    </div>
  );
}
