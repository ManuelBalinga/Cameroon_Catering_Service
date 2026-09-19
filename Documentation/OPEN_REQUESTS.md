# What remains open

The front end is complete and builds clean. There is no database, no
authentication, no payment integration and no persistence. Every piece of state
in the application lives in React component state and is gone on refresh.

This file tracks the work that is unverified, and the decisions that only the
project owner can make. It should shrink over time.

## Done since this file was written (19 September)

- **Lint works.** `eslint` and `eslint-config-next` added; the first pass over
  5,700 previously unlinted lines came back clean.
- **The money has assertions.** 20 Vitest tests covering FCFA formatting,
  deposit rounding, commission, the 10–15% band, and EN/FR dictionary parity.
  Writing them found the deposit rounding living inside the checkout component;
  it moved to `src/lib/format.ts`.
- **Every user-facing string is in the dictionary.** All 94 inline ternaries
  gone; 325 keys per language, still at parity, now guarded by a test.
- **`CLAUDE.md` matches the code.** All seventeen routes listed, and the TODO
  list split into "built but simulated" and "not started".
- **The Supabase schema exists and has been rehearsed.** Seven migrations,
  thirteen tables, 31 policies, a generated seed, and 53 permission assertions
  passing against a local PostgreSQL 16. See [`DATABASE.md`](./DATABASE.md).

## Verification still required

### 0. Apply the migrations to a hosted development project

This is the gate everything else waits behind. The rehearsal proves the SQL,
the constraints, the triggers and the policy logic on a real Postgres 16. It
does not prove behaviour under PostgREST with Supabase's own role grants, or
that Supabase Auth fills `auth.users` the way the local stand-ins assume.

Create two projects, development and production. Apply
`supabase/migrations/*.sql` in order to development, then `supabase/seed.sql`,
then re-run `db/local-rehearsal/10_permission_suite.sql` against it. That suite
creates and deletes throwaway users — **never point it at production**.

### 1. Measure the thing on a real phone

The product is built for a mid-range Android phone on a slow connection —
mobile-first layout, three runtime dependencies, no images, 87.1 kB of shared
JS, every route prerendered. It has never been measured on one. Run Lighthouse
on a throttled 3G profile and open it on an actual device before claiming the
performance story.

### 2. Walk the full flow by hand and write down where it lies

Nobody has clicked through the whole product in one sitting and noted every
point where a screen implies something happened that did not. The list that
comes out of that walk is the real backlog, and [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)
is the route to follow.

### 3. Add tests that render something

`src/lib` has coverage. Nothing renders a component in a test yet, and that
matters most in the week the data layer moves: a broken query should fail a
test rather than quietly render an empty page — which is exactly how RLS fails.

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
