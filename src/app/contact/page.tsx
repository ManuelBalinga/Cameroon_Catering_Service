"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function ContactPage() {
  const { locale } = useI18n();
  const fr = locale === "fr";
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {fr ? "Contact & support" : "Contact & support"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {fr
              ? "Une question ? Notre équipe répond en anglais et en français."
              : "Have a question? Our team replies in English and French."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="card p-6">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">✅</span>
                <p className="font-semibold text-ink">
                  {fr ? "Message envoyé !" : "Message sent!"}
                </p>
                <p className="text-sm text-ink-soft">
                  {fr
                    ? "Nous vous répondrons sous 24h. (Démo — aucun message réel.)"
                    : "We'll reply within 24 hours. (Demo — no real message sent.)"}
                </p>
                <button onClick={() => setSent(false)} className="btn-outline btn-sm">
                  {fr ? "Envoyer un autre" : "Send another"}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">{fr ? "Nom" : "Name"}</label>
                    <input required className="field" placeholder="Jean Nkeng" />
                  </div>
                  <div>
                    <label className="label">Email / {fr ? "Téléphone" : "Phone"}</label>
                    <input required className="field" placeholder="+237 6XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="label">{fr ? "Sujet" : "Subject"}</label>
                  <select className="field">
                    <option>{fr ? "Question générale" : "General question"}</option>
                    <option>{fr ? "Problème de réservation" : "Booking issue"}</option>
                    <option>{fr ? "Devenir traiteur" : "Become a caterer"}</option>
                    <option>{fr ? "Litige / remboursement" : "Dispute / refund"}</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea required className="field min-h-[120px]" />
                </div>
                <button type="submit" className="btn-primary w-full">
                  {fr ? "Envoyer le message" : "Send message"}
                </button>
              </form>
            )}
          </div>

          {/* Direct channels */}
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-ink">{fr ? "Canaux directs" : "Direct channels"}</h3>
              <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center gap-2">📞 +237 6 99 00 11 22</li>
                <li className="flex items-center gap-2">✉️ hello@cameroon-catering.cm</li>
                <li className="flex items-center gap-2">📍 Douala & Yaoundé, Cameroon</li>
                <li className="flex items-center gap-2">🕐 {fr ? "Lun–Sam, 8h–20h" : "Mon–Sat, 8am–8pm"}</li>
              </ul>
              <WhatsAppButton phone="237699001122" className="mt-4 w-full" />
            </div>
            <div className="rounded-2xl bg-brand-950 p-5 text-white">
              <p className="text-sm font-bold">💬 {fr ? "Réponse la plus rapide" : "Fastest response"}</p>
              <p className="mt-1.5 text-sm text-brand-100/80">
                {fr
                  ? "WhatsApp est notre canal le plus rapide — la plupart des messages reçoivent une réponse en moins d'une heure."
                  : "WhatsApp is our fastest channel — most messages get a reply within the hour."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
