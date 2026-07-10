"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: { href: string; label: string }[] = [
    { href: "/browse", label: t("nav.browse") },
    { href: "/#how", label: t("nav.how") },
    { href: "/caterers/join", label: t("nav.forCaterers") },
    { href: "/about", label: t("nav.about") },
    { href: "/faq", label: t("nav.faq") },
  ];

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/70 bg-white/90 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-lg shadow-card">
            🍲
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight text-ink sm:block">
            Cameroon<span className="text-brand-500">Catering</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link href="/login" className="hidden btn-ghost btn-sm sm:inline-flex">
            {t("nav.signin")}
          </Link>
          <Link href="/quote" className="hidden btn-primary btn-sm sm:inline-flex">
            {t("nav.getQuote")}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost btn-sm px-2 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-brand-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-outline btn-sm flex-1"
              >
                {t("nav.signin")}
              </Link>
              <Link
                href="/quote"
                onClick={() => setOpen(false)}
                className="btn-primary btn-sm flex-1"
              >
                {t("nav.getQuote")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
