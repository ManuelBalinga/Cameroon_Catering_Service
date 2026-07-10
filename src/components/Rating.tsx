/** Compact star-rating display used on cards and profiles. */
export function Rating({
  value,
  count,
  size = "sm",
  showValue = true,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  showValue?: boolean;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const dim = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full;
          const isHalf = i === full && half;
          return (
            <svg
              key={i}
              className={`${dim} ${filled || isHalf ? "text-gold-400" : "text-brand-100"}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isHalf ? (
                <>
                  <defs>
                    <linearGradient id={`half-${i}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#d6f9e2" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${i})`}
                    d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z"
                  />
                </>
              ) : (
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              )}
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-ink">{value.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-ink-faint">({count})</span>
      )}
    </div>
  );
}
