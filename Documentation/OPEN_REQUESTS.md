# What remains open

The front end is complete and builds clean. There is no database, no
authentication, no payment integration and no persistence. Every piece of state
in the application lives in React component state and is gone on refresh.

This file tracks the work that is unverified, and the decisions that only the
project owner can make. It should shrink over time.

## Verification still required

None of the items below needs a decision first. They are unblocked and they are
cheap.

### 0. Make `npm run lint` work

The repository has no ESLint configuration file and no ESLint dependency, so
`next lint` enters its interactive first-run setup prompt and lints nothing.
Both `README.md` and `CLAUDE.md` document the command as though it works.

Add `eslint` and `eslint-config-next` as dev dependencies with an `.eslintrc`
extending `next/core-web-vitals`, then run it once. Roughly 5,700 lines have
never been linted; expect it to have something to say, and expect some of it to
be worth acting on.

### 1. Put assertions around the money

There are no tests on this project. The first ones should cover
`src/lib/format.ts`, because it is where the revenue model lives and because it
is pure, small and dependency-free:

- `formatFCFA` groups correctly in both locales and never emits centimes.
- `formatFCFACompact` is right at 1,000, 100,000 and 10,000,000 FCFA.
- The 30% deposit rounds to the nearest 50 FCFA, including at the boundaries.
- A 12% commission on a known total produces the expected figure.
- `DEFAULT_COMMISSION` stays inside the 10–15% band.

That last one looks trivial until somebody changes the default to 18% in a
hurry.

### 2. Measure the thing on a real phone

The product is built for a mid-range Android phone on a slow connection —
mobile-first layout, three runtime dependencies, no images, 87.1 kB of shared
JS. It has never been measured on one. Run Lighthouse on a throttled 3G profile
and open it on an actual device before claiming the performance story.

### 3. Walk the full flow by hand and write down where it lies

Nobody has clicked through the whole product in one sitting and noted every
point where a screen implies something happened that did not. Start at the home
page, search, open a profile, request a quote, compare offers, check out, land
on the dashboard, leave a review, then switch to the caterer and admin
dashboards. The list that comes out of that walk is the real backlog, and
[`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) is the route to follow.

### 4. Reconcile `CLAUDE.md` with the code

Its page list stops at twelve routes and the 404; there are seventeen and the 404. `/login`, `/signup`,
`/offers`, `/review` and `/caterers/join` are missing from it. Its TODO items 4
and 6 — the review form and caterer onboarding — describe screens that already
exist and need a backend rather than a build. Fix both, or the next assistant
to read that file will start by rebuilding something.

## Decisions only the owner can make

### 1. Payment route — aggregator or direct

MTN MoMo and Orange Money collection APIs both require a registered Cameroonian
business entity, a merchant account and KYC. An aggregator gets to market faster
and takes a percentage of the transaction on top of the platform's own
commission. Going direct is cheaper per booking and slower to start.

This is not primarily an engineering question, and until it is answered the
integration cannot be tested even if it were written. See
[`PAYMENTS.md`](./PAYMENTS.md).

### 2. Launch commission rate, and who pays it

The code defaults to 12%, charged to the caterer, with a 10–15% band. All three
of "10% to win caterers", "15% because the platform carries the risk" and
"split it with the customer" are supported by the constants and change the
pitch entirely. Caterer recruitment cannot start without an answer, because the
rate is the first question a caterer will ask.

### 3. Launch city and first caterers

A marketplace with no caterers has nothing to show a customer. Douala and
Yaoundé are the obvious candidates. Whichever is chosen needs real caterers
signed up and verified before the platform is worth opening — and the eight
caterers currently in `src/data/caterers.ts` are invented, so none of that work
has started.

### 4. Product name, domain and legal entity

"Cameroon Catering Service" is a working title. The terms and privacy pages say
in both languages that they are demonstration text and must be replaced by
professionally drafted terms before launch — they mean it. The legal entity is
also a precondition for the merchant account in decision 2, so these two are
more connected than they look.

## Answered decisions

- **Backend: Supabase** (19 September 2026). The data model was designed
  relationally and every query the UI needs is a relational query — foreign
  keys, distinct values, ordered joins and two aggregates. Firestore would have
  meant translating and denormalising that model, and then maintaining the
  translation. Phone authentication was Firebase's one real advantage for this
  market and it is solvable on Supabase with an SMS provider, which is needed
  for booking notifications anyway. Full reasoning in
  [`BACKEND_DECISION.md`](./BACKEND_DECISION.md).
- **Product category.** A booking and quotation marketplace, not food delivery.
  Nothing in the product moves food.
- **Revenue model.** Booking commission, plus featured listings, Premium
  subscriptions and add-on commissions. Implemented as constants in
  `src/lib/format.ts` and surfaced across the UI.
- **Languages.** English and French, both official, both first-class. No third
  language planned.
- **Currency.** FCFA (XAF), whole numbers, no centimes.
- **Images in the MVP.** CSS gradient and emoji placeholders rather than an
  image CDN, so the app stays fast and self-contained. Revisit when a storage
  bucket exists.
- **Messaging in the MVP.** WhatsApp deep links rather than in-app threads,
  because that is the channel this market already uses.

## Candidate work after the backend lands

Chosen from what the first real users do, not from what is next on a list.

| Candidate | Why it may matter |
| --- | --- |
| Caterer-controlled availability | The calendar is read-only today; caterers will want to block dates the moment they are real |
| Real photographs | Nobody chooses a caterer without seeing the food; placeholder art is a launch blocker, not a polish item |
| WhatsApp or SMS notifications | A quote request nobody is told about is not a quote request |
| Bank-transfer reference flow | Needs no provider integration and is what large weddings will actually use |
| Featured and Premium billing | Two of four revenue streams; the buttons already exist and do nothing |
| Dispute handling | The admin dashboard counts disputes and offers no way to resolve one |
| Search beyond eight caterers | Filtering an array is fine at 8 and wrong at 800 |
