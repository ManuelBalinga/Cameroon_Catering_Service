"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { cities } from "@/lib/options";

/**
 * Simulated account creation. Customers land on their dashboard; caterers are
 * sent into the onboarding / profile-builder flow at /caterers/join.
 */
export default function SignupPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "caterer">("customer");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(role === "caterer" ? "/caterers/join" : "/dashboard/customer");
  }

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-2xl shadow-card">
            🍲
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            {t("signup.title")}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {t("signup.subtitle")}
          </p>
        </div>

        <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
          <div>
            <label className="label">{t("signup.iWantTo")}</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "customer" as const, icon: "🎉", label: t("signup.asCustomer") },
                { key: "caterer" as const, icon: "👨‍🍳", label: t("signup.asCaterer") },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                    role === r.key
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-brand-100 text-ink-soft hover:border-brand-300"
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">{t("signup.fullName")}</label>
            <input required className="field" placeholder="Jean Nkeng" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{t("signup.phone")}</label>
              <input required className="field" placeholder="+237 6XX…" />
            </div>
            <div>
              <label className="label">{t("signup.city")}</label>
              <select className="field">
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="field" placeholder="you@email.com" />
          </div>
          <div>
            <label className="label">{t("login.password")}</label>
            <input required type="password" className="field" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary w-full">
            {role === "caterer"
              ? t("signup.continueProfile")
              : t("signup.createAccount")}
          </button>

          <p className="text-center text-xs text-ink-faint">
            {t("signup.termsPrefix")}
            <Link href="/legal" className="text-brand-600 hover:underline">
              {t("signup.terms")}
            </Link>
            .
          </p>
        </form>

        <p className="mt-4 text-center text-sm text-ink-soft">
          {t("signup.haveAccount")}{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            {t("signup.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
