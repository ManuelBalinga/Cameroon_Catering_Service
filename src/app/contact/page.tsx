"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function ContactPage() {
  const { t, locale } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">
            {t("contact.title")}
          </h1>
          <p className="mt-2 text-ink-soft">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <div className="card p-6">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">✅</span>
                <p className="font-semibold text-ink">
                  {t("contact.sent")}
                </p>
                <p className="text-sm text-ink-soft">
                  {t("contact.sentDesc")}
                </p>
                <button onClick={() => setSent(false)} className="btn-outline btn-sm">
                  {t("contact.sendAnother")}
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
                    <label className="label">{t("contact.name")}</label>
                    <input required className="field" placeholder="Jean Nkeng" />
                  </div>
                  <div>
                    <label className="label">Email / {t("signup.phone")}</label>
                    <input required className="field" placeholder="+237 6XX XXX XXX" />
                  </div>
                </div>
                <div>
                  <label className="label">{t("contact.subject")}</label>
                  <select className="field">
                    <option>{t("contact.subjectGeneral")}</option>
                    <option>{t("contact.subjectBooking")}</option>
                    <option>{t("contact.subjectCaterer")}</option>
                    <option>{t("contact.subjectDispute")}</option>
                  </select>
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea required className="field min-h-[120px]" />
                </div>
                <button type="submit" className="btn-primary w-full">
                  {t("contact.send")}
                </button>
              </form>
            )}
          </div>

          {/* Direct channels */}
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-ink">{t("contact.channels")}</h3>
              <ul className="mt-3 space-y-3 text-sm text-ink-soft">
                <li className="flex items-center gap-2">📞 +237 6 99 00 11 22</li>
                <li className="flex items-center gap-2">✉️ hello@cameroon-catering.cm</li>
                <li className="flex items-center gap-2">📍 Douala & Yaoundé, Cameroon</li>
                <li className="flex items-center gap-2">🕐 {t("contact.hours")}</li>
              </ul>
              <WhatsAppButton phone="237699001122" className="mt-4 w-full" />
            </div>
            <div className="rounded-2xl bg-brand-950 p-5 text-white">
              <p className="text-sm font-bold">💬 {t("contact.fastest")}</p>
              <p className="mt-1.5 text-sm text-brand-100/80">
                {t("contact.fastestDesc")}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
