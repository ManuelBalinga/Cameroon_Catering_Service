import type { BookingStatus } from "@/lib/types";

/** KPI tile used across all three dashboards. */
export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: string;
  accent?: "brand" | "gold" | "ink";
}) {
  const accents = {
    brand: "bg-brand-50 text-brand-700",
    gold: "bg-gold-100 text-gold-700",
    ink: "bg-ink/5 text-ink",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {label}
        </p>
        {icon && (
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${accents[accent]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-soft">{sub}</p>}
    </div>
  );
}

const statusStyles: Record<BookingStatus, string> = {
  quote_requested: "bg-gold-100 text-gold-800",
  quoted: "bg-blue-50 text-blue-700",
  deposit_pending: "bg-orange-50 text-orange-700",
  confirmed: "bg-brand-100 text-brand-800",
  completed: "bg-brand-500 text-white",
  cancelled: "bg-red-50 text-red-600",
  disputed: "bg-red-100 text-red-700",
};

export function StatusBadge({
  status,
  label,
}: {
  status: BookingStatus;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status]}`}
    >
      {label}
    </span>
  );
}
