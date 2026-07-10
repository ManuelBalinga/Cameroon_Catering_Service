/**
 * Self-contained, dependency-free placeholder art.
 *
 * Rather than rely on external image URLs (which may be blocked offline or in
 * previews), each caterer gets a stable gradient "cover" derived from its
 * `brandHue`, with a food emoji motif. This keeps the app fast, reliable and
 * fully self-hosted while still looking appetising. Swap for real photos when
 * a storage bucket (Supabase/Firebase) is connected.
 */

const cuisineEmoji: Record<string, string> = {
  cameroonian: "🍲",
  continental: "🍽️",
  grill: "🍢",
  pastry: "🎂",
  nigerian: "🍚",
  asian: "🍜",
  vegetarian: "🥗",
  seafood: "🦐",
};

export function foodEmoji(cuisine: string): string {
  return cuisineEmoji[cuisine] ?? "🍽️";
}

export function CoverArt({
  hue,
  emoji,
  label,
  className = "",
  tall = false,
}: {
  hue: number;
  emoji: string;
  label?: string;
  className?: string;
  tall?: boolean;
}) {
  const bg = `linear-gradient(135deg, hsl(${hue} 62% 42%), hsl(${(hue + 40) % 360} 58% 30%))`;
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        tall ? "aspect-[4/3]" : "aspect-[16/9]"
      } ${className}`}
      style={{ background: bg }}
      aria-hidden
    >
      {/* soft decorative circles */}
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-black/10" />
      <span className="drop-shadow-lg" style={{ fontSize: tall ? "3.5rem" : "2.75rem" }}>
        {emoji}
      </span>
      {label && (
        <span className="absolute bottom-2 left-3 rounded-md bg-black/25 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  );
}

/** Small circular monogram used as a caterer "logo". */
export function Monogram({
  name,
  hue,
  size = 48,
}: {
  name: string;
  hue: number;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-card"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 60% 45%), hsl(${(hue + 30) % 360} 55% 32%))`,
        fontSize: size * 0.34,
      }}
    >
      {initials}
    </div>
  );
}
