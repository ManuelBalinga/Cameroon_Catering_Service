"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { getCaterer } from "@/data/caterers";
import { eventTypeLabels, paymentLabels } from "@/lib/i18n";
import { eventTypes } from "@/lib/options";
import {
  formatFCFA,
  depositFor,
  balanceAfterDeposit,
  DEPOSIT_RATE,
  DEFAULT_COMMISSION,
} from "@/lib/format";
import type { PaymentMethod, EventType } from "@/lib/types";
import { Monogram } from "@/components/FoodArt";

const paymentOptions: { key: PaymentMethod; icon: string; hint: string }[] = [
  { key: "mtn_momo", icon: "📱", hint: "*126#" },
  { key: "orange_money", icon: "🟠", hint: "#150#" },
  { key: "bank_transfer", icon: "🏦", hint: "IBAN" },
  { key: "cash", icon: "💵", hint: "on approval" },
];

export function CheckoutClient() {
  const { t, tf, locale } = useI18n();
  const params = useSearchParams();
  const caterer = getCaterer(params.get("caterer") ?? "");
  const pkg = caterer?.packages.find((p) => p.id === (params.get("package") ?? "pkg-100"));

  const [eventType, setEventType] = useState<EventType>("wedding");
  const [date, setDate] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("mtn_momo");
  const [momoNumber, setMomoNumber] = useState("");
  const [paid, setPaid] = useState(false);
  const [reference] = useState(
    () => `CCS-${Math.floor(1000 + Math.random() * 9000)}`
  );

  const guests = pkg?.guestCount ?? 50;
  const total = pkg ? pkg.pricePerGuest * pkg.guestCount : 0;
  const deposit = depositFor(total);
  const balance = balanceAfterDeposit(total);

  const canPay = useMemo(() => {
    if (!date) return false;
    if ((method === "mtn_momo" || method === "orange_money") && momoNumber.length < 8)
      return false;
    return true;
  }, [date, method, momoNumber]);

  if (!caterer || !pkg) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-soft">
          {t("checkout.selectFirst")}
        </p>
        <Link href="/browse" className="btn-primary mt-4 inline-flex">
          {t("cta.browseAll")}
        </Link>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="container-page flex justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
            🎉
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">{t("checkout.success")}</h1>
          <p className="mt-2 text-ink-soft">{t("checkout.successDesc")}</p>
          <div className="mt-5 rounded-xl bg-brand-50 p-4 text-left text-sm">
            <Row label={t("checkout.ref")} value={reference} bold />
            <Row label={t("checkout.caterer")} value={caterer.businessName} />
            <Row label={t("checkout.deposit")} value={formatFCFA(deposit, locale)} />
            <Row label={t("checkout.payWith")} value={paymentLabels[locale][method]} />
          </div>
          <Link href="/dashboard/customer" className="btn-primary mt-6 inline-flex w-full">
            {t("checkout.goDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">{t("checkout.title")}</h1>
      <p className="mt-1 text-ink-soft">{t("checkout.subtitle")}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: event details + payment */}
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="font-bold text-ink">{t("checkout.event")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("quote.eventType")}</label>
                <select
                  className="field"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                >
                  {eventTypes.map((et) => (
                    <option key={et} value={et}>
                      {eventTypeLabels[locale][et]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">{t("checkout.date")}</label>
                <input
                  type="date"
                  className="field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </section>

          <section className="card p-5">
            <h2 className="font-bold text-ink">{t("checkout.payWith")}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMethod(opt.key)}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                    method === opt.key
                      ? "border-brand-500 bg-brand-50 ring-1 ring-brand-200"
                      : "border-brand-100 hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">
                      {paymentLabels[locale][opt.key]}
                    </span>
                    <span className="block text-xs text-ink-faint">{opt.hint}</span>
                  </span>
                </button>
              ))}
            </div>

            {(method === "mtn_momo" || method === "orange_money") && (
              <div className="mt-4">
                <label className="label">{t("checkout.momoNumber")}</label>
                <input
                  className="field"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="6XX XXX XXX"
                  inputMode="numeric"
                />
                <p className="mt-1.5 text-xs text-ink-faint">
                  {t("checkout.momoPrompt")}
                </p>
              </div>
            )}
            {method === "bank_transfer" && (
              <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-ink-soft">
                {t("checkout.bankLater")}
              </p>
            )}
            {method === "cash" && (
              <p className="mt-4 rounded-xl bg-gold-100/60 p-3 text-sm text-gold-800">
                ⚠️{" "}
                {t("checkout.cashWarning")}
              </p>
            )}
          </section>

          <button
            onClick={() => setPaid(true)}
            disabled={!canPay}
            className="btn-primary w-full py-4 text-base"
          >
            🔒 {t("checkout.pay")} · {formatFCFA(deposit, locale)}
          </button>
          <p className="text-center text-xs text-ink-faint">{t("checkout.secure")}</p>
        </div>

        {/* Right: summary */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-brand-50 p-5">
              <Monogram name={caterer.businessName} hue={caterer.brandHue} size={44} />
              <div>
                <p className="font-bold text-ink">{caterer.businessName}</p>
                <p className="text-xs text-ink-faint">{pkg.name[locale]}</p>
              </div>
            </div>
            <div className="space-y-2 p-5 text-sm">
              <Row label={t("checkout.guests")} value={`${guests}`} />
              <Row
                label={`${formatFCFA(pkg.pricePerGuest, locale)} × ${guests}`}
                value={formatFCFA(total, locale)}
              />
              <div className="my-2 border-t border-dashed border-brand-100" />
              <Row label={t("checkout.subtotal")} value={formatFCFA(total, locale)} bold />
              <Row
                label={`${t("checkout.deposit")} (${Math.round(DEPOSIT_RATE * 100)}%)`}
                value={formatFCFA(deposit, locale)}
                highlight
              />
              <Row label={t("checkout.balance")} value={formatFCFA(balance, locale)} muted />
            </div>
            <div className="border-t border-brand-50 bg-brand-50/50 p-4 text-xs text-ink-faint">
              {tf("checkout.commissionNote", {
                rate: Math.round(DEFAULT_COMMISSION * 100),
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-ink-faint" : "text-ink-soft"}>{label}</span>
      <span
        className={`${bold ? "font-bold text-ink" : ""} ${
          highlight ? "font-bold text-brand-700" : ""
        } ${muted ? "text-ink-faint" : "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
