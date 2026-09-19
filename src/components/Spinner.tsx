/**
 * Shared loading indicator. Pure CSS so it costs nothing to load — the same
 * reasoning as FoodArt: no external asset on a page whose whole point is that it
 * arrives fast on a slow connection.
 */
export function Spinner({ size = 32 }: { size?: number }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className="inline-block animate-spin rounded-full border-2 border-brand-100 border-t-brand-500"
      style={{ width: size, height: size }}
    />
  );
}
