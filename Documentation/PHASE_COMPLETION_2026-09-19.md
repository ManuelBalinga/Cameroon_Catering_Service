# Phase completion report — 19 September 2026

This report covers the repository at commit `605f2d2` on branch `dev`.

"Built" means the code exists, typechecks, and produces the screen it is meant
to produce. It does not mean a person has completed the action, or that the
result survived a page refresh. Nothing on this project has survived a page
refresh, because there is no server for it to survive into. That distinction is
maintained throughout.

Four claims in this report were verified by running the toolchain on 19
September rather than by reading the source. They are marked **Verified**.

## Phase A — Foundation and design system

**Done:** All eight deliverables are Built. Next.js 14 App Router with
TypeScript and Tailwind; a warm green, gold and ink palette that takes its cues
from the Cameroonian flag without printing the flag on the page; a shared set of
`card`, `chip`, `field` and `btn-*` primitives that every page uses rather than
re-inventing; a responsive navbar with a working mobile menu; and a 404 page.

The placeholder art deserves a note. `FoodArt.tsx` generates a CSS gradient
seeded by each caterer's `brandHue` plus a cuisine emoji. It is stable per
caterer across renders, costs nothing to load, and removes every external image
and CDN dependency from the MVP. On a mobile-first product for a market with
expensive data, that was the right call — and it is also a temporary one, since
nobody chooses a caterer without seeing the food.

**Verified:** `tsc --noEmit` exits clean across all 47 source modules.

**Not done:** Nothing outstanding in this phase.

## Phase B — Domain model and seed data

**Done:** All six deliverables are Built. `src/lib/types.ts` describes eleven
eventual database tables — users, customers, caterers, bookings, quote requests,
reviews, payments, messages, featured listings, subscriptions and add-on
services — and the seed data was written to satisfy those types rather than the
other way round.

That ordering has already paid for itself. The prototype was forced to answer
schema questions early that are expensive to answer late: what a booking
reference looks like, whether commission is stored per booking or derived at
read time, how availability is represented (a list of fully-booked ISO dates on
the caterer), and what separates a package from a menu item.

Seed volume: 8 caterers across five cities, 12 reviews, 10 bookings and quote
requests spanning every `BookingStatus` from `quote_requested` to `disputed`,
and 8 add-on services. Every dashboard state is reachable from the seed data,
which is why the dashboards could be built honestly.

**Not done:** Five of the eleven types — `User`, `payments`, `messages`,
`featured_listings` and `subscriptions` — are described but not consumed by any
screen that persists them. They are a map for the backend phase, not a claim
about what exists.

## Phase C — Discovery funnel

**Done:** All eight deliverables are Built. Home page with hero search, browse
directory with five filters and four sort orders, caterer cards, full caterer
profiles, an availability calendar and per-guest package pricing.

The filter state seeds from the URL, so a search started on the home page
arrives at `/browse` pre-filtered rather than resetting. That is a small thing
that makes the funnel feel like a funnel.

**Not done:** The availability calendar is read-only. It renders the caterer's
`bookedDates` correctly, but a caterer has no way to block a date from inside
the product. That is a backend deliverable, not a UI one.

## Phase D — Quote, offer and booking

**Done:** The quote form, the live FCFA estimate, the compare-offers page, the
checkout screen and all of the money arithmetic are Built.

The estimate is more careful than it needs to be for a prototype: per-guest
add-ons — drinks, waitstaff, chairs, tables — scale with headcount, while cakes,
décor and rentals stay flat. That is how these quotes actually work, and getting
it right in the prototype means the pricing logic does not have to be redesigned
when it moves server-side.

The offers page simulates the replies a quote request would attract. It honours
the customer's stated budget where that budget falls inside a caterer's range,
and falls back to any caterer who can handle the headcount, so the page is never
empty. Checkout collects the event date, the payment method and — for Mobile
Money — the number, and computes a 30% deposit rounded to the nearest 50 FCFA.

**Not done:** Two things, and they are the two that matter.

A quote request reaches nobody. The form sets local state and renders a success
card. Nothing is stored, sent or queued. This is the single largest gap between
the demonstration and a product.

A deposit is not collected. "Pay deposit" sets a boolean and displays a
generated reference of the form `CCS-1234`. No payment provider is contacted.
This is blocked on a merchant account before it is blocked on code — see
[`PAYMENTS.md`](./PAYMENTS.md).

## Phase E — Accounts and dashboards

**Done:** The customer, caterer and admin dashboards are Built, and they are
genuinely built: real filtering over the seed data, real commission and GMV
arithmetic, correct empty states, and links that lead into the right flows.

**Not done:** Everything underneath them.

There is no authentication. Login accepts any credentials and routes to the
dashboard matching the selected role; the page says so in both languages, which
is the honest way to ship a simulated login. All three dashboards are publicly
reachable by URL and show fixed demo users.

Admin approve and reject both call the same handler, which removes the row from
local state. Approving a caterer and rejecting one are currently
indistinguishable, and a refresh restores the queue. The screen is right; the
action is not.

The featured-listing and Premium-subscription buttons have no click handlers at
all. Two of the four stated revenue streams are presently unclickable. They
should either be wired to billing or taken off the screen until they work —
leaving them visible and inert is the worst of the three options.

## Phase F — Reviews, onboarding and messaging

**Done:** The leave-a-review form and the caterer onboarding flow both exist,
with correct gating: the review route takes a caterer and a booking reference,
is linked only from a completed booking in the customer dashboard, and shows a
not-found state otherwise. WhatsApp deep links are on every caterer profile and
support page.

**Worth noting:** `CLAUDE.md` lists both of these as still to do. They were
shipped in commit `ed3827d`. The project's own documentation is behind its code
— see "Documentation drift" below.

**Not done:** Neither form submits anywhere. A review is not published; a
caterer application never reaches the admin queue, which means the approval
screen in Phase E has nothing real to approve. In-app messaging is deliberately
outside the MVP and is replaced by WhatsApp, which is where these conversations
happen in Cameroon anyway.

## Phase G — Content and trust

**Done:** About, Contact, FAQ and Legal are all Built and bilingual, along with
the verified and featured badges.

The legal page states plainly, in both languages, that it is a demonstration
document and must be replaced by professionally drafted terms before any real
launch. That is the correct thing for it to say and it should keep saying it
until it is true.

**Not done:** The verification behind the "verified" badge is an admin action
that does not persist. The badge is currently a property of seed data.

## Phase H — Bilingual EN / FR

**Done:** The i18n context, the navbar toggle, the dictionary and the enum label
maps for event types, cuisines, payment methods and booking statuses.

**Verified:** The dictionary is at exact parity — 199 keys in English and 199 in
French, with zero keys present in one language and missing from the other. For a
hand-maintained dictionary of that size, that is a good result and it should be
checked again whenever keys are added.

**Not done:** The architecture rule that every user-facing string goes through
`t(key)` does not hold. There are **94 inline `fr ? "…" : "…"` ternaries across
9 files**, concentrated in the newer pages:

| File | Inline ternaries |
| --- | --- |
| `src/app/caterers/join/page.tsx` | 27 |
| `src/app/contact/page.tsx` | 14 |
| `src/app/signup/page.tsx` | 13 |
| `src/app/login/page.tsx` | 11 |
| `src/app/about/page.tsx` | 8 |
| `src/app/review/ReviewClient.tsx` | 6 |
| `src/app/legal/page.tsx` | 6 |
| `src/app/faq/page.tsx` | 5 |
| `src/app/offers/OffersClient.tsx` | 4 |

Both languages still render correctly, so nothing is visibly broken. What is
lost is the single place to change a translation and the ability to add a
language without touching every file. This gets harder every time a page is
added, which is the argument for fixing it now rather than later.

## Phase I — Money and locale formatting

**Done:** All three deliverables are Built. `formatFCFA` and
`formatFCFACompact` render whole FCFA amounts with locale grouping and no
centimes, which is how prices are quoted in Cameroon. Dates format as
day-month-year in both locales. The commission band (10–15%), the default
commission (12%) and the deposit rate (30%) live in one module and are consumed
everywhere.

**Not done:** Two numbers escape that rule. The Premium price (15,000 FCFA per
month) and the featured-listing price (10,000 FCFA for 7 days) are written into
the caterer dashboard rather than into `src/lib`. They should move before
billing is built, or they will be changed in one place and not the other.

## Phase J — Backend, persistence and delivery

**Done:** Nothing, and that is the plan. The seam is clean — every page reads
through the exported helpers in `src/data`, so replacing those function bodies
with queries is most of the migration.

**Not done:** The database, the query layer, photo storage and notifications.
The schema is designed in `src/lib/types.ts` and blocked on the Supabase or
Firebase decision in [`BACKEND_DECISION.md`](./BACKEND_DECISION.md).

Of the four, notifications are the one most likely to be underestimated. A quote
request that nobody is told about is not a quote request, and on this market
that means WhatsApp Business API or SMS, not email.

## Phase K — Quality and release engineering

**Verified — production build:** `npm run build` succeeds on Next.js 14.2.15 and
emits 18 route entries — 17 pages plus the 404 — of which 17 prerender as
static content and one (`/caterers/[id]`) is server-rendered on demand. Next
reports 19 static pages generated. Shared JS is 87.1 kB; the heaviest
first load is the home page at 114 kB. For a mobile-first product on expensive
data, that is a defensible budget and worth protecting.

**Verified broken — lint:** `npm run lint` does not work. The repository
contains no ESLint configuration file and no ESLint dependency, so `next lint`
drops into its interactive first-run setup prompt and lints nothing. Both
`README.md` and `CLAUDE.md` document it as a normal command. It has never run
against this codebase — 5,700 lines have never been linted.

**Not done:** There are no automated tests. Not one file, no runner, no
coverage. On a project whose revenue is a percentage of a booking total, the
commission and deposit arithmetic in `src/lib/format.ts` is the first thing that
should have assertions around it, and it is a small pure function with no
dependencies — the cheapest meaningful coverage available here.

No deployment has been made or confirmed. `vercel.json` pins the framework to
Next.js and the build is static-friendly, so hosting is straightforward when
there is a reason to host it.

## Documentation drift

`CLAUDE.md` is the file an AI assistant reads first, and it is behind the code
in two ways.

Its page inventory lists twelve routes and the 404. The application has
seventeen and the 404.
`/login`, `/signup`, `/offers`, `/review` and `/caterers/join` all exist and were
all shipped in commit `ed3827d`, and none of them is mentioned.

Its TODO list asks for "a working leave-a-review form" (item 4) and "a real
signup/profile-builder flow" (item 6). Both screens exist. What they lack is a
backend, which is item 1 — so those entries should be rewritten as "simulated,
needs persistence" rather than left as though the work has not started.

Neither is a defect in the code. Both are the reason this status folder exists:
the source of truth had drifted from the source.

## What the next phase actually is

The front half of the product is finished and the back half has not started.
That is a reasonable place to be — the screens have settled what the database
must store, and the types were written as that schema in advance.

But the next phase is not more building of the same kind. It is a different kind
of work, with credentials, a hosting bill, a merchant account and a legal entity
attached. Three items can be done today with none of that: fix the lint setup,
put assertions around the money functions, and reconcile `CLAUDE.md` with the
code. Everything after those depends on a decision in
[`OPEN_REQUESTS.md`](./OPEN_REQUESTS.md).
