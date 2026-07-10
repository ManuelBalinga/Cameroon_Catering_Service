# CLAUDE.md — project context for AI agents

This file gives Claude Code (local or cloud) the context needed to continue work
on **Cameroon Catering Service** without re-deriving everything. Read it first.

## What this is
A **web-first catering marketplace for Cameroon** — a booking & quotation
platform (NOT food delivery) connecting customers with verified caterers for
weddings, funerals, birthdays, office/church/school events and bulk orders.
Revenue = 10–15% booking commission + featured listings + Premium subscriptions
+ add-on commissions (cakes, drinks, waitstaff, décor, rentals…).

## Stack
- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Bilingual **EN/FR** via `src/context/I18nContext.tsx` + `src/lib/i18n.ts`
- **Seed data** in `src/data/` stands in for a real DB (no backend yet)
- Currency: **FCFA (XAF)**, formatted in `src/lib/format.ts`
- No external image/CDN deps — placeholder art is CSS gradient + emoji (`FoodArt.tsx`)

## Run / verify
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + typecheck (run before committing)
npm run lint
```
Node 18.18+ (developed on Node 24).

## Architecture rules (keep these)
- **UI** lives in `src/components`, **data** in `src/data`, **domain logic/types**
  in `src/lib`. Don't mix them.
- All user-facing strings go through `useI18n().t(key)` with EN + FR entries in
  `src/lib/i18n.ts`. Enum labels (event types, cuisines, payment, status) also
  live there. Never hardcode a visible English-only string.
- Interactive pages are client components (`"use client"`). Pages that read
  `useSearchParams` (browse, quote, checkout) are wrapped in `<Suspense>` via a
  thin server `page.tsx` that renders a `*Client.tsx`.
- Money: use `formatFCFA` / `formatFCFACompact`; commission = `DEFAULT_COMMISSION`
  (0.12), deposit = `DEPOSIT_RATE` (0.30).
- Types are the single source of truth: `src/lib/types.ts` mirrors the eventual
  DB tables (users, customers, caterers, bookings, quote_requests, reviews,
  payments, messages, featured_listings, subscriptions, add_on_services).

## Pages (all built)
Home `/` · Browse `/browse` · Caterer profile `/caterers/[id]` · Quote `/quote`
· Checkout `/checkout` · Customer dashboard `/dashboard/customer` · Caterer
dashboard `/dashboard/caterer` · Admin `/admin` · About `/about` · Contact
`/contact` · FAQ `/faq` · Legal `/legal` · 404.

## Still TODO (good tasks for a cloud agent)
These are intentionally mocked in the MVP — replacing them is the path to prod:
1. **Backend/DB** — wire Supabase or Firebase to the entities in `src/lib/types.ts`;
   replace `src/data/*` with real queries.
2. **Auth** — real customer/caterer/admin login (currently simulated; dashboards
   show fixed demo users).
3. **Payments** — integrate MTN MoMo & Orange Money collection APIs + bank
   transfer reference flow in `src/app/checkout` (currently a simulated success).
4. **Reviews** — build a working "leave a review" form for completed bookings
   (customer dashboard currently links to the profile's reviews anchor).
5. **In-app messaging** — thread between customer & caterer (today it's WhatsApp
   deep-links + a contact form).
6. **Caterer onboarding** — a real signup/profile-builder flow (today caterers
   are seed data; admin can approve/reject the unverified one).
7. **Featured listings & subscriptions** — make the admin/caterer upsell buttons
   actually change state + billing.
8. **Real photos** — swap `FoodArt` placeholders for uploaded images once a
   storage bucket exists.
9. **Tests** — none yet; add component/e2e coverage.

## Conventions
- Commit messages end with the Co-Authored-By trailer.
- Prefer editing existing components over adding near-duplicates.
- This is a demo MVP: keep copy realistic for Cameroon (local cities, dishes,
  Mobile Money, WhatsApp, bilingual).
