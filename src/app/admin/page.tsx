"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { StatCard, StatusBadge } from "@/components/StatCard";
import { Monogram } from "@/components/FoodArt";
import { Rating } from "@/components/Rating";
import { caterers, getCaterer } from "@/data/caterers";
import { bookings, quoteRequests, totalCommission, totalGmv } from "@/data/bookings";
import { recentReviews } from "@/data/reviews";
import { eventTypeLabels, statusLabels } from "@/lib/i18n";
import { formatFCFA, formatFCFACompact, formatDate } from "@/lib/format";

export default function AdminDashboard() {
  const { t, locale } = useI18n();

  const approved = caterers.filter((c) => c.verified);
  const initialPending = caterers.filter((c) => !c.verified);
  const [pending, setPending] = useState(initialPending);
  const featured = caterers.filter((c) => c.featured);
  const openQuotes = quoteRequests.filter((q) => q.status === "quote_requested");

  const gmv = totalGmv();
  const commission = totalCommission();

  function handle(id: string) {
    setPending((p) => p.filter((c) => c.id !== id));
  }

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-faint">{t("dash.admin")}</p>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t("admin.overview")}</h1>
        </div>
        <span className="chip bg-ink text-white">🔐 Admin</span>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.totalBookings")} value={`${bookings.length}`} icon="📅" />
        <StatCard label={t("admin.revenue")} value={formatFCFACompact(gmv, locale)} sub="GMV" icon="💵" />
        <StatCard label={t("admin.commission")} value={formatFCFACompact(commission, locale)} sub="12% avg" icon="🏦" accent="gold" />
        <StatCard label={t("admin.approvedCaterers")} value={`${approved.length}`} icon="✅" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t("admin.pendingCaterers")} value={`${pending.length}`} icon="⏳" accent="ink" />
        <StatCard label={t("admin.pendingQuotes")} value={`${openQuotes.length}`} icon="📝" accent="ink" />
        <StatCard label={t("admin.disputes")} value="1" icon="⚠️" accent="ink" />
        <StatCard label={t("admin.featured")} value={`${featured.length}`} icon="⭐" accent="ink" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Pending approvals */}
        <section className="card p-5">
          <h2 className="font-bold text-ink">{t("admin.pendingCaterers")}</h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 && (
              <p className="rounded-xl bg-brand-50/60 p-4 text-center text-sm text-ink-soft">
                🎉 {locale === "fr" ? "Aucune demande en attente." : "No pending approvals."}
              </p>
            )}
            {pending.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border border-brand-100 p-3">
                <Monogram name={c.businessName} hue={c.brandHue} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{c.businessName}</p>
                  <p className="text-xs text-ink-faint">
                    📍 {c.city} · {c.yearsActive} yrs · {c.completedEvents} events
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handle(c.id)} className="btn-primary btn-sm">
                    {t("admin.approve")}
                  </button>
                  <button onClick={() => handle(c.id)} className="btn-ghost btn-sm text-red-500">
                    {t("admin.reject")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Commission tracking */}
        <section className="card p-5">
          <h2 className="font-bold text-ink">{t("admin.commissionTracking")}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-ink-faint">
                <tr>
                  <th className="pb-2">{t("dash.reference")}</th>
                  <th className="pb-2 text-right">{t("checkout.subtotal")}</th>
                  <th className="pb-2 text-right">{t("admin.commission")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="py-2 font-medium text-ink">{b.reference}</td>
                    <td className="py-2 text-right text-ink-soft">
                      {formatFCFA(b.total, locale)}
                    </td>
                    <td className="py-2 text-right font-semibold text-brand-700">
                      {formatFCFA(b.total * b.commissionRate, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-brand-100">
                  <td className="pt-2 font-bold text-ink">Total</td>
                  <td className="pt-2 text-right font-bold text-ink">
                    {formatFCFA(gmv, locale)}
                  </td>
                  <td className="pt-2 text-right font-bold text-brand-700">
                    {formatFCFA(commission, locale)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Recent bookings */}
        <section className="card p-5">
          <h2 className="font-bold text-ink">{t("admin.recentBookings")}</h2>
          <div className="mt-4 space-y-2.5">
            {bookings.slice(0, 5).map((b) => {
              const c = getCaterer(b.catererId);
              return (
                <div key={b.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    {c && <Monogram name={c.businessName} hue={c.brandHue} size={32} />}
                    <div>
                      <p className="font-medium text-ink">{b.customerName}</p>
                      <p className="text-xs text-ink-faint">
                        {c?.businessName} · {eventTypeLabels[locale][b.eventType]}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} label={statusLabels[locale][b.status]} />
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent reviews */}
        <section className="card p-5">
          <h2 className="font-bold text-ink">{t("admin.recentReviews")}</h2>
          <div className="mt-4 space-y-3">
            {recentReviews(4).map((r) => {
              const c = getCaterer(r.catererId);
              return (
                <div key={r.id} className="rounded-xl border border-brand-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">
                      {r.author} → {c?.businessName}
                    </p>
                    <Rating value={r.rating} showValue={false} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-soft">
                    “{r.comment[locale]}”
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
