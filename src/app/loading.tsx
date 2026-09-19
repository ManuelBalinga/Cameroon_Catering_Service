import { Spinner } from "@/components/Spinner";

/**
 * Route-level loading state. Nothing needs it while every page reads an
 * in-memory array, but the first Supabase query changes that — and a boundary
 * added after the data layer moves is a boundary added during an outage.
 */
export default function Loading() {
  return (
    <div className="container-page flex min-h-[50vh] items-center justify-center py-20">
      <Spinner size={36} />
      <span className="sr-only">Loading</span>
    </div>
  );
}
