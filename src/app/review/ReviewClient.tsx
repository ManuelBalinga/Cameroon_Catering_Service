"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";
import { getCaterer } from "@/data/caterers";
import { eventTypeLabels } from "@/lib/i18n";
import { eventTypes } from "@/lib/options";
import { Monogram } from "@/components/FoodArt";

/**
 * "Leave a review" form for a completed booking. Only reachable from the
 * customer dashboard's past events, mirroring the platform's rule that reviews
 * come from real, verified bookings.
 */
export function ReviewClient() {
  const { t, locale } = useI18n();
  const fr = locale === "fr";
  const params = useSearchParams();
  const caterer = getCaterer(params.get("caterer") ?? "");
  const bookingRef = params.get("booking");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [eventType, setEventType] = useState("wedding");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!caterer) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-ink-soft">
          {fr ? "Réservation introuvable." : "Booking not found."}
        </p>
        <Link href="/dashboard/customer" className="btn-primary mt-4 inline-flex">
          {t("nav.dashboard")}
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container-page flex justify-center py-16">
        <div className="card max-w-lg p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-3xl">
            ⭐
          </div>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            {fr ? "Merci pour votre avis !" : "Thanks for your review!"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {fr
              ? "Votre avis aide d'autres familles à réserver en toute confiance. (Démo — rien n'est publié.)"
              : "Your review helps other families book with confidence. (Demo — nothing is published.)"}
          </p>
          <div className="mt-5 flex items-center justify-center gap-1 text-2xl">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < rating ? "text-gold-400" : "text-brand-100"}>
                ★
              </span>
            ))}
          </div>
          <Link href="/dashboard/customer" className="btn-primary mt-6 inline-flex w-full">
            {t("checkout.goDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-ink">{t("cta.leaveReview")}</h1>
        <p className="mt-1 text-ink-soft">
          {fr
            ? "Comment s'est passé votre événement ?"
            : "How was your event?"}
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 p-3">
          <Monogram name={caterer.businessName} hue={caterer.brandHue} size={44} />
          <div>
            <p className="font-bold text-ink">{caterer.businessName}</p>
            {bookingRef && (
              <p className="text-xs text-ink-faint">
                {t("dash.reference")}: {bookingRef}
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (rating === 0) return;
            setSubmitted(true);
          }}
          className="mt-6 space-y-5"
        >
          {/* Star input */}
          <div>
            <label className="label">{fr ? "Votre note" : "Your rating"}</label>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const val = i + 1;
                const active = (hover || rating) >= val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHover(val)}
                    onMouseLeave={() => setHover(0)}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      active ? "text-gold-400" : "text-brand-100"
                    }`}
                    aria-label={`${val} star${val > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-ink-soft">
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="label">{t("quote.eventType")}</label>
            <select
              className="field"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              {eventTypes.map((et) => (
                <option key={et} value={et}>
                  {eventTypeLabels[locale][et]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{fr ? "Votre commentaire" : "Your comment"}</label>
            <textarea
              required
              className="field min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                fr
                  ? "Qualité de la nourriture, ponctualité, service…"
                  : "Food quality, punctuality, service…"
              }
            />
          </div>

          <button type="submit" disabled={rating === 0} className="btn-primary w-full">
            {fr ? "Publier mon avis" : "Post my review"}
          </button>
          {rating === 0 && (
            <p className="text-center text-xs text-ink-faint">
              {fr ? "Sélectionnez une note pour continuer." : "Select a rating to continue."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
