"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useI18n } from "@/context/I18nContext";
import { getCaterer } from "@/data/caterers";
import { reviewsFor } from "@/data/reviews";
import { cuisineLabels, eventTypeLabels } from "@/lib/i18n";
import { formatFCFA } from "@/lib/format";
import { CoverArt, Monogram, foodEmoji } from "@/components/FoodArt";
import { VerifiedBadge, FeaturedBadge, PremiumBadge } from "@/components/Badges";
import { Rating } from "@/components/Rating";
import { PackageCard } from "@/components/PackageCard";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function CatererProfileClient({ id }: { id: string }) {
  const { t, tf, locale } = useI18n();
  const caterer = getCaterer(id);
  if (!caterer) notFound();

  const reviews = reviewsFor(caterer.id);
  const waMessage =
    tf("caterer.whatsappIntro", { business: caterer.businessName });

  return (
    <div>
      {/* Cover banner */}
      <div className="relative">
        <CoverArt
          hue={caterer.brandHue}
          emoji={foodEmoji(caterer.cuisines[0])}
          className="h-48 w-full sm:h-64"
        />
      </div>

      <div className="container-page">
        {/* Header card overlapping the banner */}
        <div className="-mt-16 rounded-2xl border border-brand-100 bg-white p-5 shadow-lift sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <Monogram name={caterer.businessName} hue={caterer.brandHue} size={64} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
                    {caterer.businessName}
                  </h1>
                  {caterer.verified && <VerifiedBadge />}
                  {caterer.featured && <FeaturedBadge />}
                  {caterer.subscriptionTier === "premium" && <PremiumBadge />}
                </div>
                <p className="mt-1 text-sm text-ink-soft">{caterer.tagline[locale]}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-faint">
                  <span className="flex items-center gap-1">📍 {caterer.city}</span>
                  <Rating value={caterer.rating} count={caterer.reviewCount} />
                  <span>🍽️ {caterer.completedEvents} {t("caterer.events")}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:w-52">
              <Link
                href={`/quote?caterer=${caterer.id}`}
                className="btn-primary w-full"
              >
                {t("cta.requestQuote")}
              </Link>
              <WhatsAppButton phone={caterer.whatsapp} message={waMessage} className="w-full" />
            </div>
          </div>

          {/* quick stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-brand-50 pt-5 sm:grid-cols-4">
            <Stat label={t("caterer.from")} value={`${formatFCFA(caterer.priceFromPerGuest, locale)}`} sub={t("caterer.perGuest")} />
            <Stat label={t("caterer.minOrder")} value={`${caterer.minGuests}`} sub={t("caterer.guests")} />
            <Stat label={t("caterer.responds")} value={`~${caterer.responseTimeHours}${t("caterer.hours")}`} />
            <Stat label={t("caterer.years")} value={`${caterer.yearsActive}`} />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-10">
            {/* About */}
            <section>
              <h2 className="text-lg font-bold text-ink">{t("caterer.about")}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{caterer.about[locale]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {caterer.cuisines.map((c) => (
                  <span key={c} className="chip">
                    {foodEmoji(c)} {cuisineLabels[locale][c]}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">{t("caterer.serviceAreas")}:</span>{" "}
                {caterer.serviceAreas.join(" · ")}
              </div>
            </section>

            {/* Packages */}
            <section id="packages">
              <h2 className="text-lg font-bold text-ink">{t("caterer.packages")}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t("package.for")} 20–200 {t("caterer.guests")}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {caterer.packages.map((p) => (
                  <PackageCard
                    key={p.id}
                    caterer={caterer}
                    pkg={p}
                    popular={p.guestCount === 100}
                  />
                ))}
              </div>
            </section>

            {/* Sample menu */}
            <section>
              <h2 className="text-lg font-bold text-ink">{t("caterer.menu")}</h2>
              <div className="mt-4 divide-y divide-brand-50 overflow-hidden rounded-2xl border border-brand-100">
                {caterer.menu.map((m) => (
                  <div key={m.id} className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold text-ink">{m.name}</p>
                      <p className="text-sm text-ink-soft">{m.description[locale]}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-brand-700">
                      {formatFCFA(m.pricePerGuest, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-lg font-bold text-ink">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {caterer.gallery.map((g, i) => (
                  <CoverArt
                    key={g}
                    hue={(caterer.brandHue + i * 24) % 360}
                    emoji={foodEmoji(caterer.cuisines[i % caterer.cuisines.length])}
                    label={g}
                    className="rounded-xl"
                    tall
                  />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-ink">{t("caterer.reviews")}</h2>
                <Rating value={caterer.rating} count={caterer.reviewCount} size="md" />
              </div>
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                          {r.author[0]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{r.author}</p>
                          <p className="text-xs text-ink-faint">
                            {r.city} · {eventTypeLabels[locale][r.eventType]}
                          </p>
                        </div>
                      </div>
                      <Rating value={r.rating} showValue={false} />
                    </div>
                    <p className="mt-3 text-sm text-ink-soft">“{r.comment[locale]}”</p>
                    {r.verifiedBooking && (
                      <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600">
                        ✅ {t("caterer.verifiedBooking")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-ink-faint">
                {t("caterer.from")}
              </p>
              <p className="text-2xl font-extrabold text-brand-700">
                {formatFCFA(caterer.priceFromPerGuest, locale)}
                <span className="text-sm font-normal text-ink-faint">
                  {" "}
                  – {formatFCFA(caterer.priceToPerGuest, locale)} {t("caterer.perGuest")}
                </span>
              </p>
              <div className="mt-4 space-y-2">
                <Link href={`/quote?caterer=${caterer.id}`} className="btn-primary w-full">
                  {t("cta.requestQuote")}
                </Link>
                <Link
                  href={`/checkout?caterer=${caterer.id}&package=pkg-100`}
                  className="btn-outline w-full"
                >
                  {t("cta.bookNow")}
                </Link>
                <WhatsAppButton phone={caterer.whatsapp} message={waMessage} className="w-full" />
              </div>
              <p className="mt-3 text-center text-xs text-ink-faint">🔒 {t("checkout.secure")}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-bold text-ink">{t("caterer.availability")}</h3>
              <AvailabilityCalendar bookedDates={caterer.bookedDates} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
      <p className="font-bold text-ink">
        {value} {sub && <span className="text-xs font-normal text-ink-faint">{sub}</span>}
      </p>
    </div>
  );
}
