"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { PaymentBadges } from "./PaymentBadges";

export function Footer() {
  const { t } = useI18n();

  const columns: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t("footer.explore"),
      links: [
        { href: "/browse", label: t("nav.browse") },
        { href: "/quote", label: t("cta.requestQuote") },
        { href: "/#how", label: t("nav.how") },
        { href: "/dashboard/customer", label: t("nav.dashboard") },
      ],
    },
    {
      title: t("footer.forBusiness"),
      links: [
        { href: "/dashboard/caterer", label: t("dash.caterer") },
        { href: "/caterers/join", label: t("cta.becomeCaterer") },
        { href: "/admin", label: t("dash.admin") },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
        { href: "/faq", label: t("nav.faq") },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { href: "/legal", label: t("footer.terms") },
        { href: "/legal#privacy", label: t("footer.privacy") },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-brand-100 bg-brand-950 text-brand-50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg">
              🍲
            </span>
            <span className="text-lg font-extrabold">CameroonCatering</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-brand-100/80">
            {t("footer.tagline")}
          </p>
          <div className="mt-4">
            <PaymentBadges />
          </div>
          <p className="mt-4 text-xs text-brand-100/60">{t("footer.builtFor")}</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-white">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-brand-100/75 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-800/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-brand-100/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Cameroon Catering Service. {t("footer.rights")}
          </p>
          <p className="flex items-center gap-1">
            <span className="rounded bg-brand-800/70 px-2 py-0.5">{t("misc.demo")}</span>
            <span>MVP prototype</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
