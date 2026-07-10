"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { StatCard, StatusBadge } from "@/components/StatCard";
import { Monogram } from "@/components/FoodArt";
import { customerBookings } from "@/data/bookings";
import { getCaterer } from "@/data/caterers";
import { eventTypeLabels, statusLabels } from "@/lib/i18n";
import { formatFCFA, formatDate } from "@/lib/format";

export default function CustomerDashboard() {
  const { t, locale } = useI18n();
  const bookings = customerBookings();
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.date >= today);
  const past = bookings.filter((b) => b.date < today);

  const totalSpent = bookings.reduce((s, b) => s + b.total, 0);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-ink-faint">{t("dash.welcome")} 👋</p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Estelle Mbeng</h1>
        </div>
        <Link href="/quote" className="btn-primary">
          {t("cta.requestQuote")}
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("dash.upcoming")} value={`${upcoming.length}`} icon="📅" />
        <StatCard label={t("dash.past")} value={`${past.length}`} icon="✅" />
        <StatCard label={t("checkout.subtotal")} value={formatFCFA(totalSpent, locale)} icon="💰" accent="gold" />
        <StatCard label={t("dash.myQuotes")} value="2" sub={t("misc.new")} icon="📝" />
      </div>

      {/* Upcoming */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">{t("dash.upcoming")}</h2>
        <div className="mt-4 space-y-3">
          {upcoming.map((b) => {
            const caterer = getCaterer(b.catererId);
            return (
              <div key={b.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {caterer && (
                  <Monogram name={caterer.businessName} hue={caterer.brandHue} size={48} />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{caterer?.businessName}</p>
                    <StatusBadge status={b.status} label={statusLabels[locale][b.status]} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {eventTypeLabels[locale][b.eventType]} · {b.guestCount} {t("caterer.guests")} · {b.city}
                  </p>
                  <p className="text-xs text-ink-faint">
                    {t("dash.reference")}: {b.reference} · 📅 {formatDate(b.date, locale)}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <p className="font-bold text-brand-700">{formatFCFA(b.total, locale)}</p>
                  <div className="flex gap-2">
                    {b.status === "deposit_pending" ? (
                      <Link
                        href={`/checkout?caterer=${b.catererId}&package=pkg-${b.guestCount}`}
                        className="btn-gold btn-sm"
                      >
                        {t("dash.pay")}
                      </Link>
                    ) : (
                      <Link href={`/caterers/${b.catererId}`} className="btn-outline btn-sm">
                        {t("dash.view")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Past */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">{t("dash.past")}</h2>
        <div className="mt-4 space-y-3">
          {past.map((b) => {
            const caterer = getCaterer(b.catererId);
            return (
              <div key={b.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                {caterer && (
                  <Monogram name={caterer.businessName} hue={caterer.brandHue} size={48} />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{caterer?.businessName}</p>
                    <StatusBadge status={b.status} label={statusLabels[locale][b.status]} />
                  </div>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {eventTypeLabels[locale][b.eventType]} · 📅 {formatDate(b.date, locale)}
                  </p>
                </div>
                <Link
                  href={`/review?caterer=${b.catererId}&booking=${b.reference}`}
                  className="btn-outline btn-sm"
                >
                  ⭐ {t("dash.review")}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
