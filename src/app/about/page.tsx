"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { SectionHeading } from "@/components/SectionHeading";

export default function AboutPage() {
  const { t, locale } = useI18n();

  const values = [
    {
      icon: "🤝",
      en: { t: "Trust first", d: "Verified suppliers, real reviews and secure deposits protect every customer." },
      fr: { t: "La confiance d'abord", d: "Fournisseurs vérifiés, avis réels et acomptes sécurisés protègent chaque client." },
    },
    {
      icon: "📱",
      en: { t: "Built for mobile", d: "Designed for the phone-first, Mobile-Money reality of Cameroon." },
      fr: { t: "Pensé pour le mobile", d: "Conçu pour la réalité mobile et Mobile Money du Cameroun." },
    },
    {
      icon: "🌍",
      en: { t: "Proudly local", d: "Local dishes, local cities, local languages — English and French." },
      fr: { t: "Fièrement local", d: "Plats locaux, villes locales, langues locales — anglais et français." },
    },
    {
      icon: "📈",
      en: { t: "Growing together", d: "Fair commissions help caterers grow and hire in their communities." },
      fr: { t: "Grandir ensemble", d: "Des commissions justes aident les traiteurs à grandir et à embaucher." },
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50/80 to-white py-16">
        <div className="container-page max-w-3xl text-center">
          <span className="chip mx-auto mb-4 bg-white shadow-sm">🇨🇲 {t("about.eyebrow")}</span>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
            {t("about.title")}
          </h1>
          <p className="mt-4 text-ink-soft">
            {t("about.body")}
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.icon} className="card p-6">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="mt-3 font-bold text-ink">{v[locale].t}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{v[locale].d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-soft py-14">
        <div className="container-page">
          <SectionHeading
            center
            title={t("about.moneyTitle")}
            subtitle={
              t("about.moneySub")
            }
          />
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "💰", en: "10–15% commission per successful booking", fr: "10–15% de commission par réservation réussie" },
              { icon: "⭐", en: "Featured listings for extra visibility", fr: "Annonces à la une pour plus de visibilité" },
              { icon: "👑", en: "Premium caterer subscriptions", fr: "Abonnements traiteur Premium" },
              { icon: "🎈", en: "Commission on add-ons (cakes, décor, rentals…)", fr: "Commission sur les extras (gâteaux, déco, location…)" },
            ].map((m) => (
              <div key={m.icon} className="rounded-2xl border border-brand-100 bg-white p-5">
                <span className="text-2xl">{m.icon}</span>
                <p className="mt-2 text-sm text-ink-soft">{m[locale]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 text-center">
        <h2 className="text-2xl font-bold text-ink">
          {t("about.joinTitle")}
        </h2>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/quote" className="btn-primary">
            {t("about.joinQuote")}
          </Link>
          <Link href="/dashboard/caterer" className="btn-outline">
            {t("about.joinCaterer")}
          </Link>
        </div>
      </section>
    </div>
  );
}
