import { Suspense } from "react";
import { BrowseClient } from "./BrowseClient";

export const metadata = {
  title: "Browse caterers — Cameroon Catering Service",
};

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-ink-faint">Loading…</div>}>
      <BrowseClient />
    </Suspense>
  );
}
