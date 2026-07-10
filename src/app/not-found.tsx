import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl">🍽️</span>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">404</h1>
      <p className="mt-2 max-w-sm text-ink-soft">
        We couldn&apos;t find that page. The caterer may have moved or the link is
        broken.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
        <Link href="/browse" className="btn-outline">
          Browse caterers
        </Link>
      </div>
    </div>
  );
}
