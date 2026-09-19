"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { StatCard, StatusBadge } from "@/components/StatCard";
import { Monogram } from "@/components/FoodArt";
import { VerifiedBadge, PremiumBadge } from "@/components/Badges";
import { getCaterer } from "@/data/caterers";
import { catererBookings, catererQuotes } from "@/data/bookings";
import { addOns } from "@/data/addons";
import { eventTypeLabels, statusLabels, cuisineLabels } from "@/lib/i18n";
import {
  formatFCFA,
  formatDate,
  PREMIUM_MONTHLY_PRICE,
  PREMIUM_COMMISSION,
  FEATURED_LISTING_PRICE,
  FEATURED_LISTING_DAYS,
} from "@/lib/format";

const DEMO_CATERER = "mamie-nkeng";

export default function CatererDashboard() {
  const { t, tf, locale } = useI18n();

  /**
   * Both upsells put the caterer into a "requested" state rather than taking
   * money. There is no billing yet, and a button that silently does nothing is
   * worse than one that says what it is waiting for.
   */
  const [upsell, setUpsell] = useState<{ premium: boolean; featured: boolean }>({
    premium: false,
    featured: false,
  });
  const caterer = getCaterer(DEMO_CATERER)!;
  const bookings = catererBookings(DEMO_CATERER);
  const quotes = catererQuotes(DEMO_CATERER);

  const gross = bookings.reduce((s, b) => s + b.total, 0);
  const net = bookings.reduce((s, b) => s + b.total * (1 - b.commissionRate), 0);

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Monogram name={caterer.businessName} hue={caterer.brandHue} size={56} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-ink">{caterer.businessName}</h1>
              {caterer.verified && <VerifiedBadge />}
              {caterer.subscriptionTier === "premium" && <PremiumBadge />}
            </div>
            <p className="text-sm text-ink-soft">
              📍 {caterer.city} ·{" "}
              {caterer.cuisines.map((c) => cuisineLabels[locale][c]).join(", ")}
            </p>
          </div>
        </div>
        <Link href={`/caterers/${caterer.id}`} className="btn-outline">
          {t("cta.viewProfile")}
        </Link>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("cdash.requests")} value={`${quotes.length}`} sub={t("misc.new")} icon="📥" accent="gold" />
        <StatCard label={t("cdash.bookings")} value={`${bookings.length}`} icon="📅" />
        <StatCard label={t("cdash.earnings")} value={formatFCFA(net, locale)} sub={`${t("checkout.subtotal")}: ${formatFCFA(gross, locale)}`} icon="💰" />
        <StatCard label={t("cdash.rating")} value={`${caterer.rating} ★`} sub={`${caterer.reviewCount} ${t("caterer.reviewsCount")}`} icon="⭐" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label={t("cdash.profileViews")} value="1,284" sub="+18% ↑" icon="👁️" accent="ink" />
        <StatCard label={t("cdash.conversion")} value="42%" sub="quotes → bookings" icon="🎯" accent="ink" />
        <StatCard label={t("caterer.responds")} value={`~${caterer.responseTimeHours}h`} icon="⚡" accent="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Incoming quote requests */}
        <div>
          <h2 className="text-lg font-bold text-ink">{t("cdash.requests")}</h2>
          <div className="mt-4 space-y-3">
            {quotes.map((q) => (
              <div key={q.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                      {q.customerName[0]}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{q.customerName}</p>
                      <p className="text-xs text-ink-faint">
                        {eventTypeLabels[locale][q.eventType]} · {q.city}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={q.status} label={statusLabels[locale][q.status]} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <Info label={t("quote.guests")} value={`${q.guestCount}`} />
                  <Info label={t("quote.date")} value={formatDate(q.date, locale)} />
                  <Info label={t("quote.budget")} value={q.budget ? formatFCFA(q.budget, locale) : "—"} />
                  <Info
                    label={t("quote.addons")}
                    value={
                      q.addOns.length
                        ? q.addOns
                            .map((id) => addOns.find((a) => a.id === id)?.icon)
                            .join(" ")
                        : "—"
                    }
                  />
                </div>

                {q.specialRequests && (
                  <p className="mt-3 rounded-lg bg-brand-50/60 p-2.5 text-sm text-ink-soft">
                    “{q.specialRequests}”
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button className="btn-primary btn-sm">{t("cdash.respond")}</button>
                  <button className="btn-ghost btn-sm">WhatsApp</button>
                </div>
              </div>
            ))}
          </div>

          {/* Confirmed bookings */}
          <h2 className="mt-10 text-lg font-bold text-ink">{t("cdash.bookings")}</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-brand-100">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 text-left text-xs uppercase text-ink-faint">
                <tr>
                  <th className="px-4 py-3">{t("dash.reference")}</th>
                  <th className="px-4 py-3">{t("checkout.event")}</th>
                  <th className="hidden px-4 py-3 sm:table-cell">{t("checkout.date")}</th>
                  <th className="px-4 py-3 text-right">{t("cdash.earnings")}</th>
                  <th className="px-4 py-3">{t("dash.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-medium text-ink">{b.reference}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {eventTypeLabels[locale][b.eventType]}
                    </td>
                    <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">
                      {formatDate(b.date, locale)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-700">
                      {formatFCFA(b.total * (1 - b.commissionRate), locale)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} label={statusLabels[locale][b.status]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: upsells */}
        <aside className="space-y-5">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <p className="text-sm font-bold text-gold-300">★ {t("cdash.upgrade")}</p>
            <p className="mt-2 text-sm text-white/80">{t("cdash.upgradeDesc")}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/90">
              <li>✓ {t("cdash.premiumFeatured")}</li>
              <li>
                ✓ {t("cdash.premiumLowerCommission")} (
                {Math.round(PREMIUM_COMMISSION * 100)}%)
              </li>
              <li>✓ {t("cdash.premiumBadge")}</li>
            </ul>
            {upsell.premium ? (
              <div className="mt-4 rounded-xl bg-white/10 p-3 text-center">
                <p className="text-sm font-semibold text-gold-300">
                  ⏳ {t("cdash.upgradeRequested")}
                </p>
                <p className="mt-1 text-xs text-white/60">{t("cdash.billingPending")}</p>
                <button
                  onClick={() => setUpsell((u) => ({ ...u, premium: false }))}
                  className="mt-2 text-xs font-semibold text-white/70 hover:underline"
                >
                  {t("admin.undo")}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setUpsell((u) => ({ ...u, premium: true }))}
                  className="btn-gold mt-4 w-full"
                >
                  {t("cdash.upgrade")}
                </button>
                <p className="mt-2 text-center text-xs text-white/50">
                  {formatFCFA(PREMIUM_MONTHLY_PRICE, locale)} / {t("cdash.perMonth")}
                </p>
              </>
            )}
          </div>

          <div className="card p-5">
            <p className="text-sm font-bold text-ink">🚀 {t("cdash.feature")}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {tf("cdash.featureDesc", { days: FEATURED_LISTING_DAYS })}
            </p>
            {upsell.featured ? (
              <div className="mt-3 rounded-xl bg-brand-50 p-3 text-center">
                <p className="text-sm font-semibold text-brand-700">
                  ⏳ {t("cdash.featureRequested")}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{t("cdash.billingPending")}</p>
                <button
                  onClick={() => setUpsell((u) => ({ ...u, featured: false }))}
                  className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
                >
                  {t("admin.undo")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setUpsell((u) => ({ ...u, featured: true }))}
                className="btn-primary mt-3 w-full btn-sm"
              >
                {t("cdash.feature")} · {formatFCFA(FEATURED_LISTING_PRICE, locale)}
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
