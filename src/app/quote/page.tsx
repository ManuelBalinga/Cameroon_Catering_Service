import { Suspense } from "react";
import { QuoteClient } from "./QuoteClient";

export const metadata = {
  title: "Request a quote — Cameroon Catering Service",
};

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-ink-faint">Loading…</div>}>
      <QuoteClient />
    </Suspense>
  );
}
