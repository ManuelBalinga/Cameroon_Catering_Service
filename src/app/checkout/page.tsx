import { Suspense } from "react";
import { CheckoutClient } from "./CheckoutClient";

export const metadata = {
  title: "Booking checkout — Cameroon Catering Service",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-ink-faint">Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
