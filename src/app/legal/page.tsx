"use client";

import { useI18n } from "@/context/I18nContext";

export default function LegalPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
          {fr ? "Mentions légales" : "Legal"}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
          {fr ? "Conditions & confidentialité" : "Terms & Privacy"}
        </h1>
        <p className="mt-2 text-sm text-ink-faint">
          {fr ? "Dernière mise à jour : juillet 2026 · Document de démonstration." : "Last updated: July 2026 · Demonstration document."}
        </p>

        {/* Terms */}
        <section className="prose-legal mt-8">
          <h2 className="text-lg font-bold text-ink">
            {fr ? "1. Conditions d'utilisation" : "1. Terms of Service"}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {fr
                ? "Cameroon Catering Service est une place de marché mettant en relation clients et traiteurs. Nous ne préparons pas les aliments nous-mêmes ; nous facilitons la découverte, la demande de devis, la réservation et le paiement d'acompte."
                : "Cameroon Catering Service is a marketplace connecting customers with caterers. We do not prepare food ourselves; we facilitate discovery, quotes, bookings and deposit payments."}
            </p>
            <p>
              {fr
                ? "En réservant, le client accepte de payer un acompte pour confirmer la date. La plateforme prélève une commission de 10 à 15% au traiteur sur chaque réservation réussie."
                : "By booking, the customer agrees to pay a deposit to confirm the date. The platform charges the caterer a 10–15% commission on each successful booking."}
            </p>
            <p>
              {fr
                ? "Les traiteurs sont responsables de la qualité, de l'hygiène et de la livraison des aliments conformément à la législation camerounaise."
                : "Caterers are responsible for the quality, hygiene and delivery of food in line with Cameroonian law."}
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="mt-10 scroll-mt-20">
          <h2 className="text-lg font-bold text-ink">
            {fr ? "2. Politique de confidentialité" : "2. Privacy Policy"}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {fr
                ? "Nous collectons uniquement les données nécessaires pour traiter vos réservations : nom, téléphone (WhatsApp), ville et détails de l'événement. Vos coordonnées ne sont partagées qu'avec le traiteur que vous choisissez."
                : "We collect only the data needed to process your bookings: name, phone (WhatsApp), city and event details. Your contact details are shared only with the caterer you choose."}
            </p>
            <p>
              {fr
                ? "Les paiements Mobile Money sont traités par les opérateurs (MTN, Orange). Nous ne stockons jamais vos codes PIN."
                : "Mobile Money payments are processed by the operators (MTN, Orange). We never store your PIN codes."}
            </p>
            <p>
              {fr
                ? "Vous pouvez demander la suppression de vos données à tout moment via la page Contact."
                : "You can request deletion of your data at any time via the Contact page."}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">
            {fr ? "3. Litiges & remboursements" : "3. Disputes & refunds"}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {fr
                ? "En cas de problème, contactez le support. L'acompte est conservé de façon sécurisée et peut être remboursé si le traiteur ne respecte pas ses engagements, après examen par notre équipe."
                : "If there's a problem, contact support. The deposit is held securely and may be refunded if the caterer fails to meet their commitments, after review by our team."}
            </p>
          </div>
        </section>

        <p className="mt-10 rounded-xl bg-brand-50/60 p-4 text-xs text-ink-faint">
          ⚠️{" "}
          {fr
            ? "Ceci est un prototype de démonstration. Ce texte n'est pas un avis juridique et doit être remplacé par des conditions rédigées par un professionnel avant tout lancement réel."
            : "This is a demonstration prototype. This text is not legal advice and should be replaced with professionally drafted terms before any real launch."}
        </p>
      </div>
    </div>
  );
}
