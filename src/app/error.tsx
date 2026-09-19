"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

/**
 * Route-level error boundary. It sits inside the root layout, so the i18n
 * provider is available and the message can be shown in the visitor's language.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    // Until there is real error reporting, the console is the only record.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
        🍲
      </div>
      <h1 className="mt-4 text-2xl font-bold text-ink">{t("error.title")}</h1>
      <p className="mt-2 max-w-md text-ink-soft">{t("error.body")}</p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={reset} className="btn-primary">
          {t("error.retry")}
        </button>
        <Link href="/" className="btn-outline">
          {t("misc.backHome")}
        </Link>
      </div>
      <Link href="/contact" className="mt-4 text-sm font-semibold text-brand-600 hover:underline">
        {t("error.contact")}
      </Link>
    </div>
  );
}
