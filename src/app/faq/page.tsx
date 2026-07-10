"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

const faqs = [
  {
    en: { q: "How do I book a caterer?", a: "Search or browse caterers, open a profile, then either choose a ready-made package or request a custom quote. Once you're happy, pay a small deposit to confirm your date." },
    fr: { q: "Comment réserver un traiteur ?", a: "Cherchez ou parcourez les traiteurs, ouvrez un profil, puis choisissez une formule ou demandez un devis personnalisé. Quand tout vous convient, payez un petit acompte pour confirmer la date." },
  },
  {
    en: { q: "Which payment methods can I use?", a: "You can pay your deposit with MTN Mobile Money, Orange Money or bank transfer. Cash may be allowed in special cases with caterer approval, but digital deposits best protect your booking." },
    fr: { q: "Quels moyens de paiement puis-je utiliser ?", a: "Vous pouvez payer votre acompte avec MTN Mobile Money, Orange Money ou virement bancaire. Les espèces sont possibles dans certains cas avec l'accord du traiteur, mais l'acompte digital protège mieux votre réservation." },
  },
  {
    en: { q: "Why do I pay a deposit?", a: "A deposit (usually 30%) confirms your date and shows the caterer you're serious. The balance is paid after the event. Your deposit is held securely by the platform." },
    fr: { q: "Pourquoi payer un acompte ?", a: "Un acompte (généralement 30%) confirme votre date et montre au traiteur votre sérieux. Le solde est réglé après l'événement. Votre acompte est conservé en sécurité par la plateforme." },
  },
  {
    en: { q: "What does 'Verified' mean?", a: "Verified caterers have had their business details, past events and identity checked by our team before being approved on the platform." },
    fr: { q: "Que signifie « Vérifié » ?", a: "Les traiteurs vérifiés ont vu leurs informations d'entreprise, événements passés et identité contrôlés par notre équipe avant d'être approuvés sur la plateforme." },
  },
  {
    en: { q: "I'm a caterer — how much does it cost?", a: "Listing is free. We only charge a 10–15% commission on successful bookings. Optional featured listings and a Premium subscription help you get more visibility." },
    fr: { q: "Je suis traiteur — combien ça coûte ?", a: "L'inscription est gratuite. Nous prélevons seulement 10–15% de commission sur les réservations réussies. Les annonces à la une et l'abonnement Premium (optionnels) augmentent votre visibilité." },
  },
  {
    en: { q: "What if there's a problem at my event?", a: "Contact our support team on WhatsApp. Because your deposit is held by the platform, we can help mediate disputes fairly between you and the caterer." },
    fr: { q: "Que se passe-t-il en cas de problème ?", a: "Contactez notre support sur WhatsApp. Comme votre acompte est conservé par la plateforme, nous pouvons aider à résoudre équitablement les litiges entre vous et le traiteur." },
  },
  {
    en: { q: "Do you cover my city?", a: "We're live in Douala, Yaoundé, Buea, Limbe, Bamenda, Bafoussam and Kribi, and expanding fast. Many caterers also travel to nearby towns on request." },
    fr: { q: "Couvrez-vous ma ville ?", a: "Nous sommes présents à Douala, Yaoundé, Buea, Limbe, Bamenda, Bafoussam et Kribi, et nous grandissons vite. Beaucoup de traiteurs se déplacent aussi vers les villes voisines sur demande." },
  },
];

export default function FaqPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {fr ? "Questions fréquentes" : "Frequently asked questions"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {fr ? "Tout ce qu'il faut savoir avant de réserver." : "Everything you need to know before booking."}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            const item = fr ? f.fr : f.en;
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-ink">{item.q}</span>
                  <span
                    className={`shrink-0 text-brand-500 transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    ＋
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-brand-50 px-4 pb-4 pt-3 text-sm text-ink-soft">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-brand-50/60 p-6 text-center">
          <p className="font-semibold text-ink">
            {fr ? "Vous ne trouvez pas votre réponse ?" : "Can't find your answer?"}
          </p>
          <Link href="/contact" className="btn-primary mt-3 inline-flex">
            {fr ? "Contacter le support" : "Contact support"}
          </Link>
        </div>
      </div>
    </div>
  );
}
