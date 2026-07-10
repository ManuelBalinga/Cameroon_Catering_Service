"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import type { UserRole } from "@/lib/types";

/**
 * Simulated sign-in. No real auth yet (see CLAUDE.md TODO) — any credentials
 * work, and the chosen role routes to the matching dashboard. This gives the
 * MVP a believable entry point until Supabase/Firebase auth is wired in.
 */
export default function LoginPage() {
  const { t, locale } = useI18n();
  const fr = locale === "fr";
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("customer");

  const roles: { key: UserRole; label: string; icon: string; dest: string }[] = [
    { key: "customer", label: fr ? "Client" : "Customer", icon: "🎉", dest: "/dashboard/customer" },
    { key: "caterer", label: fr ? "Traiteur" : "Caterer", icon: "👨‍🍳", dest: "/dashboard/caterer" },
    { key: "admin", label: "Admin", icon: "🔐", dest: "/admin" },
  ];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const dest = roles.find((r) => r.key === role)!.dest;
    router.push(dest);
  }

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-2xl shadow-card">
            🍲
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            {fr ? "Bon retour 👋" : "Welcome back 👋"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {fr ? "Connectez-vous à votre compte" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
          {/* Role selector */}
          <div>
            <label className="label">{fr ? "Je suis un…" : "I am a…"}</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
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
                  <span className="text-lg">{r.icon}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">{fr ? "Email ou téléphone" : "Email or phone"}</label>
            <input required className="field" placeholder="+237 6XX XXX XXX" />
          </div>
          <div>
            <label className="label">{fr ? "Mot de passe" : "Password"}</label>
            <input required type="password" className="field" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-1.5 text-ink-soft">
              <input type="checkbox" className="h-3.5 w-3.5 accent-brand-500" />
              {fr ? "Se souvenir de moi" : "Remember me"}
            </label>
            <a className="font-semibold text-brand-600 hover:underline" href="#">
              {fr ? "Mot de passe oublié ?" : "Forgot password?"}
            </a>
          </div>

          <button type="submit" className="btn-primary w-full">
            {t("nav.signin")}
          </button>

          <p className="rounded-lg bg-brand-50/60 p-2.5 text-center text-xs text-ink-faint">
            {fr
              ? "Démo — n'importe quels identifiants fonctionnent."
              : "Demo — any credentials work."}
          </p>
        </form>

        <p className="mt-4 text-center text-sm text-ink-soft">
          {fr ? "Nouveau ici ?" : "New here?"}{" "}
          <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
            {fr ? "Créer un compte" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
