import { Suspense } from "react";
import { ReviewClient } from "./ReviewClient";

export const metadata = {
  title: "Leave a review — Cameroon Catering Service",
};

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-ink-faint">Loading…</div>}>
      <ReviewClient />
    </Suspense>
  );
}
