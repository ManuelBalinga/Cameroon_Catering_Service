import { caterers } from "@/data/caterers";
import { CatererProfileClient } from "./CatererProfileClient";

/**
 * Prerender every caterer profile at build time. Profiles are the pages a
 * customer lands on from search, and most of them arrive on a phone over a slow
 * connection — a static page beats a round trip. Once caterers live in the
 * database this becomes a query, and any profile added after a build still
 * renders on demand.
 */
export function generateStaticParams() {
  return caterers.map((c) => ({ id: c.id }));
}

export default function CatererProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return <CatererProfileClient id={params.id} />;
}
