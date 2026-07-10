"use client";

import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

/**
 * Lightweight month view showing which dates a caterer is already fully
 * booked. Read-only — enough for a customer to gauge availability before
 * requesting a quote. A real build would sync this to the bookings table.
 */
export function AvailabilityCalendar({ bookedDates }: { bookedDates: string[] }) {
  const { t, locale } = useI18n();
  const [monthOffset, setMonthOffset] = useState(0);

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + monthOffset);
  const year = base.getFullYear();
  const month = base.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const booked = new Set(bookedDates);

  const monthName = base.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  });
  const weekdays =
    locale === "fr"
      ? ["D", "L", "M", "M", "J", "V", "S"]
      : ["S", "M", "T", "W", "T", "F", "S"];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const iso = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
          disabled={monthOffset === 0}
          className="btn-ghost btn-sm px-2 disabled:opacity-30"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="text-sm font-bold capitalize text-ink">{monthName}</p>
        <button
          onClick={() => setMonthOffset((m) => Math.min(5, m + 1))}
          disabled={monthOffset === 5}
          className="btn-ghost btn-sm px-2 disabled:opacity-30"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((w, i) => (
          <span key={i} className="text-[11px] font-semibold text-ink-faint">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e-${i}`} />;
          const dayIso = iso(d);
          const isBooked = booked.has(dayIso);
          const isPast = dayIso < todayIso;
          return (
            <span
              key={dayIso}
              className={`flex h-8 items-center justify-center rounded-md text-xs font-medium ${
                isBooked
                  ? "bg-red-50 text-red-400 line-through"
                  : isPast
                    ? "text-ink-faint/40"
                    : "bg-brand-50 text-brand-700"
              }`}
              title={isBooked ? t("caterer.booked") : t("caterer.available")}
            >
              {d}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-50 ring-1 ring-brand-200" />
          {t("caterer.available")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-200" />
          {t("caterer.booked")}
        </span>
      </div>
    </div>
  );
}
