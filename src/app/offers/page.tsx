import { Suspense } from "react";
import { OffersClient } from "./OffersClient";

export const metadata = {
  title: "Compare offers — Cameroon Catering Service",
};

export default function OffersPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-ink-faint">Loading…</div>}>
      <OffersClient />
    </Suspense>
  );
}
