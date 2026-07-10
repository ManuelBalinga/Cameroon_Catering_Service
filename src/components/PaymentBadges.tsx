/**
 * Payment method badges. Cameroon runs on Mobile Money, so MTN MoMo and
 * Orange Money lead, with bank transfer and (conditional) cash as fallbacks.
 */
const methods = [
  { key: "mtn", label: "MTN MoMo", bg: "#FFCC00", fg: "#1a1a1a" },
  { key: "orange", label: "Orange Money", bg: "#FF6600", fg: "#ffffff" },
  { key: "bank", label: "Bank", bg: "#0f7145", fg: "#ffffff" },
];

export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {methods.map((m) => (
        <span
          key={m.key}
          className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold shadow-sm"
          style={{ background: m.bg, color: m.fg }}
        >
          {m.label}
        </span>
      ))}
    </div>
  );
}
