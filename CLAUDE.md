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
npm run dev              # http://localhost:3000
npm run build            # production build + typecheck (run before committing)
npm run typecheck        # tsc --noEmit on its own
npm run lint             # eslint-config-next; clean as of 19 Sep
npm test                 # vitest — money and dictionary assertions
npm run db:rehearse      # apply migrations to a throwaway local Postgres
npm run db:seed:generate # regenerate supabase/seed.sql from src/data
```
Node 18.18+ (developed on Node 24). Run build, typecheck, lint and test before
calling anything done.

`db:rehearse` needs a local PostgreSQL 16 and drops its target database. Never
point it at a hosted project.

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

## Pages (17 routes + 404, all built)
Home `/` · Browse `/browse` · Caterer profile `/caterers/[id]` · Caterer signup
`/caterers/join` · Quote `/quote` · Compare offers `/offers` · Checkout
`/checkout` · Leave a review `/review` · Sign in `/login` · Sign up `/signup` ·
Customer dashboard `/dashboard/customer` · Caterer dashboard
`/dashboard/caterer` · Admin `/admin` · About `/about` · Contact `/contact` ·
FAQ `/faq` · Legal `/legal` · 404.

Every route prerenders as static content, including all eight caterer profiles
via `generateStaticParams`.

## Where things actually stand

`PROJECT_STATUS.html` (repo root) tracks all 85 deliverables and is the source
of truth. Read it before planning work. Two words are used carefully across this
project: **built** means the code exists, typechecks and renders; **working**
means a real person did it and the result survived a refresh. Nothing is working
yet, because there is no server for anything to survive into.

### Built but simulated — these need a backend, not a rebuild
These screens exist. Do not rebuild them; connect them.
- **Sign in / sign up** (`/login`, `/signup`) — any credentials are accepted and
  the page says so.
- **Leave a review** (`/review`) — gated to a completed booking by route, posts
  nowhere.
- **Caterer onboarding** (`/caterers/join`) — never reaches the admin queue.
- **Checkout** (`/checkout`) — real deposit and commission arithmetic, no
  provider call, and the success screen fires on the button press rather than on
  a webhook.
- **Admin approve / reject** — distinct outcomes in local state; resets on
  refresh.
- **Featured listing and Premium** — both move to a "requested" state; no
  billing behind them.

### Not started
1. **Backend** — Supabase, decided 19 Sep. The schema, policies and seed are
   written in `supabase/` and rehearsed against a local Postgres, but no project
   exists and nothing has been applied. See `Documentation/DATABASE.md`.
2. **Replace `src/data/*` with queries** — keep the helper signatures; their
   bodies become queries. That seam is the whole migration.
3. **Auth** — no sessions, no roles enforced; all three dashboards are public
   URLs showing fixed demo users.
4. **Payments** — MTN MoMo and Orange Money need a registered business and a
   merchant account before code. The bank-transfer flow needs neither and should
   come first. See `Documentation/PAYMENTS.md`.
5. **Notifications** — a quote request nobody is told about is not a quote
   request. WhatsApp Business API or SMS, not email.
6. **In-app messaging** — deliberately out of the MVP in favour of WhatsApp.
7. **Real photos** — `FoodArt` placeholders until a storage bucket exists.
8. **Component / e2e tests** — `src/lib` has unit coverage; nothing renders a
   component in a test yet.

## Conventions
- Commit messages end with the Co-Authored-By trailer.
- Money: whole FCFA integers, never a float. Format through `formatFCFA` /
  `formatFCFACompact`; take rates and prices from `src/lib/format.ts`
  (`DEFAULT_COMMISSION`, `DEPOSIT_RATE`, `PREMIUM_MONTHLY_PRICE`,
  `FEATURED_LISTING_PRICE`) rather than writing a number into a page.
- Permissions belong in the database, not in TypeScript. If a rule changes, it
  changes in a policy in `supabase/migrations/`. A filter in a component is one
  forgotten condition away from showing a caterer another business's revenue.
- Keep `PROJECT_STATUS.html` current in the same commit as the code. A status
  page that lags the code is worse than none.
- Prefer editing existing components over adding near-duplicates.
- This is a demo MVP: keep copy realistic for Cameroon (local cities, dishes,
  Mobile Money, WhatsApp, bilingual).
