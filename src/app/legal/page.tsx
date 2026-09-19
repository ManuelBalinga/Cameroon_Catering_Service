"use client";

import { useI18n } from "@/context/I18nContext";

export default function LegalPage() {
  const { t, locale } = useI18n();

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">
          {t("legal.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">
          {t("legal.title")}
        </h1>
        <p className="mt-2 text-sm text-ink-faint">
          {t("legal.updated")}
        </p>

        {/* Terms */}
        <section className="prose-legal mt-8">
          <h2 className="text-lg font-bold text-ink">
            {t("legal.termsTitle")}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {t("legal.terms1")}
            </p>
            <p>
              {t("legal.terms2")}
            </p>
            <p>
              {t("legal.terms3")}
            </p>
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="mt-10 scroll-mt-20">
          <h2 className="text-lg font-bold text-ink">
            {t("legal.privacyTitle")}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {t("legal.privacy1")}
            </p>
            <p>
              {t("legal.privacy2")}
            </p>
            <p>
              {t("legal.privacy3")}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-ink">
            {t("legal.disputesTitle")}
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-soft">
            <p>
              {t("legal.disputes1")}
            </p>
          </div>
        </section>

        <p className="mt-10 rounded-xl bg-brand-50/60 p-4 text-xs text-ink-faint">
          ⚠️{" "}
          {t("legal.disclaimer")}
        </p>
      </div>
    </div>
  );
}
