"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { SectionHeading } from "@/components/SectionHeading";

export default function AboutPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

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
          <span className="chip mx-auto mb-4 bg-white shadow-sm">🇨🇲 {fr ? "Notre histoire" : "Our story"}</span>
          <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
            {fr
              ? "Rendre le traiteur simple et digne de confiance au Cameroun"
              : "Making catering simple and trustworthy in Cameroon"}
          </h1>
          <p className="mt-4 text-ink-soft">
            {fr
              ? "Organiser un événement au Cameroun signifie souvent appeler des dizaines de contacts, négocier à l'aveugle et espérer que le traiteur se présente. Nous changeons cela en réunissant traiteurs vérifiés, prix clairs et paiements Mobile Money sécurisés sur une seule plateforme."
              : "Planning an event in Cameroon often means calling dozens of contacts, negotiating blind, and hoping the caterer shows up. We're changing that by bringing verified caterers, clear pricing and secure Mobile Money payments together in one platform."}
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.icon} className="card p-6">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="mt-3 font-bold text-ink">{fr ? v.fr.t : v.en.t}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{fr ? v.fr.d : v.en.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-soft py-14">
        <div className="container-page">
          <SectionHeading
            center
            title={fr ? "Comment nous gagnons de l'argent" : "How we make money"}
            subtitle={
              fr
                ? "Un modèle transparent, aligné sur le succès des traiteurs."
                : "A transparent model aligned with caterer success."
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
                <p className="mt-2 text-sm text-ink-soft">{fr ? m.fr : m.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 text-center">
        <h2 className="text-2xl font-bold text-ink">
          {fr ? "Rejoignez le mouvement" : "Join the movement"}
        </h2>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/quote" className="btn-primary">
            {fr ? "Demander un devis" : "Request a quote"}
          </Link>
          <Link href="/dashboard/caterer" className="btn-outline">
            {fr ? "Devenir traiteur partenaire" : "Become a partner caterer"}
          </Link>
        </div>
      </section>
    </div>
  );
}
