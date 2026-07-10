"use client";

import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import { HeroSearch } from "@/components/HeroSearch";
import { CatererCard } from "@/components/CatererCard";
import { SectionHeading } from "@/components/SectionHeading";
import { PaymentBadges } from "@/components/PaymentBadges";
import { Rating } from "@/components/Rating";
import { featuredCaterers } from "@/data/caterers";
import { recentReviews } from "@/data/reviews";
import { addOns, expansionServices } from "@/data/addons";
import { eventTypeLabels } from "@/lib/i18n";
import { eventTypes, eventEmoji } from "@/lib/options";
import { formatFCFA } from "@/lib/format";

export default function HomePage() {
  const { t, locale } = useI18n();
  const featured = featuredCaterers();
  const testimonials = recentReviews(3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 to-white">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-gold-100/50 blur-3xl" />

        <div className="container-page relative py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="chip mx-auto mb-4 bg-white shadow-sm">
              🇨🇲 {t("brand.tagline")}
            </span>
            <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-ink-soft sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
              <span className="flex items-center gap-1.5">✅ {t("hero.trust1")}</span>
              <span className="flex items-center gap-1.5">⭐ {t("hero.trust2")}</span>
              <span className="flex items-center gap-1.5">🔒 {t("hero.trust3")}</span>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-5xl animate-fade-up">
            <HeroSearch />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-ink-faint">
              <span>{t("why.momo.title")}:</span>
              <PaymentBadges />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Featured caterers */}
      <section className="container-page py-14">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="⭐ Premium"
            title={t("section.featured")}
            subtitle={t("section.featuredSub")}
          />
          <Link href="/browse" className="hidden shrink-0 btn-outline sm:inline-flex">
            {t("cta.browseAll")}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CatererCard key={c.id} caterer={c} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/browse" className="btn-outline w-full">
            {t("cta.browseAll")}
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------- Event categories */}
      <section className="surface-soft py-14">
        <div className="container-page">
          <SectionHeading
            center
            eyebrow="Occasions"
            title={t("section.categories")}
            subtitle={t("section.categoriesSub")}
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {eventTypes.map((et) => (
              <Link
                key={et}
                href={`/browse?event=${et}`}
                className="card group flex flex-col items-center gap-2 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {eventEmoji[et]}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {eventTypeLabels[locale][et]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- How it works */}
      <section id="how" className="container-page scroll-mt-20 py-16">
        <SectionHeading
          center
          eyebrow={t("how.customer")}
          title={t("section.how")}
          subtitle={t("section.howSub")}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { n: 1, icon: "🔍", title: t("how.step1.title"), desc: t("how.step1.desc") },
            { n: 2, icon: "📝", title: t("how.step2.title"), desc: t("how.step2.desc") },
            { n: 3, icon: "💳", title: t("how.step3.title"), desc: t("how.step3.desc") },
            { n: 4, icon: "⭐", title: t("how.step4.title"), desc: t("how.step4.desc") },
          ].map((s, i) => (
            <div key={s.n} className="relative">
              <div className="card h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg text-white">
                    {s.icon}
                  </span>
                  <span className="text-4xl font-black text-brand-100">0{s.n}</span>
                </div>
                <h3 className="mt-4 font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-brand-200 lg:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/quote" className="btn-primary">
            {t("cta.requestQuote")}
          </Link>
          <Link href="/browse" className="btn-outline">
            {t("cta.browseAll")}
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------ Why trust us */}
      <section className="bg-brand-950 py-16 text-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold-300">
              Trust
            </p>
            <h2 className="text-2xl font-bold sm:text-3xl">{t("section.why")}</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🛡️", title: t("why.verified.title"), desc: t("why.verified.desc") },
              { icon: "⭐", title: t("why.reviews.title"), desc: t("why.reviews.desc") },
              { icon: "📱", title: t("why.momo.title"), desc: t("why.momo.desc") },
              { icon: "💬", title: t("why.support.title"), desc: t("why.support.desc") },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-brand-100/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Add-on services */}
      <section className="container-page py-16">
        <SectionHeading
          center
          eyebrow="More revenue"
          title={t("section.addons")}
          subtitle={t("section.addonsSub")}
        />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {addOns.map((a) => (
            <div key={a.id} className="card flex items-center gap-3 p-4">
              <span className="text-2xl">{a.icon}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{a.name[locale]}</p>
                <p className="text-xs text-ink-faint">
                  {t("caterer.from")} {formatFCFA(a.priceFrom, locale)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expansion roadmap — the marketplace grows beyond catering. */}
        <div className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-5">
          <p className="text-sm font-semibold text-ink">
            🚀 Coming soon to the marketplace
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {expansionServices.map((s) => (
              <span key={s.en} className="chip bg-white">
                {s.icon} {locale === "fr" ? s.fr : s.en}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Testimonials */}
      <section className="surface-soft py-16">
        <div className="container-page">
          <SectionHeading center title={t("section.testimonials")} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((r) => (
              <figure key={r.id} className="card p-6">
                <Rating value={r.rating} showValue={false} />
                <blockquote className="mt-3 text-sm text-ink-soft">
                  “{r.comment[locale]}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2 text-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {r.author[0]}
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{r.author}</span>
                    <span className="block text-xs text-ink-faint">
                      {r.city} · {eventTypeLabels[locale][r.eventType]}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Dual CTA */}
      <section className="container-page py-16">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-brand-500 p-8 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <h3 className="text-xl font-bold">🎉 Planning an event?</h3>
            <p className="mt-2 max-w-sm text-brand-50/90">
              Get matched with verified caterers and receive real quotes today.
            </p>
            <Link href="/quote" className="btn-gold mt-5 inline-flex">
              {t("cta.requestQuote")}
            </Link>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-brand-100 bg-white p-8">
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-100/60" />
            <h3 className="text-xl font-bold text-ink">👨‍🍳 Are you a caterer?</h3>
            <p className="mt-2 max-w-sm text-ink-soft">
              List your business, receive quote requests, and grow with featured
              placements. Only pay commission on successful bookings.
            </p>
            <Link href="/caterers/join" className="btn-primary mt-5 inline-flex">
              {t("cta.becomeCaterer")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
