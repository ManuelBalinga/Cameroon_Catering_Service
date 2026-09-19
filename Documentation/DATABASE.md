# Database

**Backend: Supabase** (decided 19 September 2026 — see
[`BACKEND_DECISION.md`](./BACKEND_DECISION.md)).

**Status: written and rehearsed locally, not applied to any hosted project.**
No Supabase project exists yet. Everything below runs against a throwaway local
PostgreSQL 16 and has never touched a hosted database.

## What is here

```
supabase/migrations/     the schema, seven migrations, applied in order
supabase/seed.sql        generated from src/data — 8 caterers and their menus
db/local-rehearsal/      Supabase stand-ins and the permission suite
scripts/rehearse-migrations.sh
scripts/generate-seed.ts
```

## Rehearsing it

```bash
npm run db:rehearse
```

Drops a local `ccs_rehearsal` database, applies the Supabase stand-ins, applies
every migration in order — each inside a transaction, as Supabase does — then
runs the permission suite and prints a schema summary.

Requires a local PostgreSQL 16 and the ability to run `psql` as the `postgres`
user. **Never point it at a hosted database: it drops the target first.**

As of 19 September it produces 13 tables, row level security on all 13, 31
policies, 12 functions, and **53 permission assertions, all passing**.

### What the rehearsal proves, and what it does not

It proves the SQL is valid, the constraints and triggers behave, the policies
compile, the grants are accepted, and the permission rules deny what they are
supposed to deny on a real PostgreSQL 16.

It does not prove behaviour under PostgREST with Supabase's own role grants, or
that Supabase Auth populates `auth.users` the way the stand-ins assume. Those
need a hosted development project, and until one exists nothing in this folder
is **Working** in the sense the status page uses.

The rehearsal has already earned its keep. It caught four things that would each
have been found the expensive way:

1. The profile trigger listed six target columns and supplied five values. Every
   sign-up would have failed.
2. A partial unique index used `now()` in its predicate, which Postgres refuses —
   an index predicate must be `IMMUTABLE`.
3. Revoking `EXECUTE` on the helper functions from `anon` broke the **public**
   caterer directory, because the read policy called one of them. Logged-out
   visitors would have seen an empty marketplace.
4. Column-level `UPDATE` grants belong to the role, not the policy, and an
   administrator is also `authenticated` — so the narrow grant that stopped a
   caterer verifying itself also stopped admins approving anybody.

## The schema

Thirteen tables, generated from `src/lib/types.ts`, which was written as this
schema in advance.

| Table | Notes |
| --- | --- |
| `profiles` | Marketplace identity, keyed to `auth.users`. Created by a trigger on sign-up. |
| `caterers` | The businesses. Slug primary key, because it is the URL. |
| `event_packages` | Per-guest bundles at 20 / 50 / 100 / 200. |
| `menu_items` | Individual dishes. |
| `caterer_blocked_dates` | Availability. One row per unavailable date. |
| `add_on_services` | Cakes, drinks, waitstaff, décor — commission-bearing extras. |
| `quote_requests` | A customer asking for a price. |
| `bookings` | The agreement. Carries its own commission rate. |
| `reviews` | One per completed booking, enforced by trigger and policy. |
| `payments` | One row per attempt, successes and failures alike. |
| `messages` | Out of the MVP, but bookings need a written record. |
| `featured_listings` | Revenue stream 2. |
| `subscriptions` | Revenue stream 3. |

### Decisions worth knowing

**Money is `integer` FCFA**, through a domain called `fcfa` that refuses
negatives. There are no centimes in everyday Cameroonian pricing and
floating-point money is a bug waiting to be written.

**Bilingual text is a domain, not a convention.** `localized` is `jsonb` with a
check that both `en` and `fr` are present and non-empty. A row with only English
in it cannot be inserted. Cameroon is officially bilingual; this makes that a
constraint rather than a habit.

**Commission is stored per booking**, not derived. The rate a caterer was on
when they booked must not change retroactively because the platform's default
moved or they upgraded to Premium.

**Booking references come from the database.** `next_booking_reference()`
returns `CCS-26-01234` from a sequence. The browser used to generate `CCS-` plus
four random digits, which collided at roughly one in ten thousand — and a
reference has to exist and be stored before any payment provider is called, so
that a webhook naming an unknown reference is an error rather than a guess.

**Verification is three states, not a boolean.** `verification_status` is
`pending | approved | rejected`, with `verified` as a generated column derived
from it. A boolean cannot distinguish "rejected" from "nobody has looked at this
yet", which is how an application gets reviewed twice. `verified` is generated,
so nobody can write it — not even an administrator, who moves the status
instead.

**Approval goes through `approve_caterer()` and `reject_caterer()`**, not an
`UPDATE`. See finding 4 above: column privileges belong to the role, so the only
way to let admins approve without also letting caterers approve themselves is a
`SECURITY DEFINER` function that checks `is_admin()` first.

**Triggers keep derived columns honest.** Confirming a booking blocks the
caterer's date; a review recomputes the caterer's rating and review count; a
featured listing or subscription refreshes the flags that browse sorts on. The
cache cannot drift from the truth, whichever code path wrote it.

## Permissions

The rules are in [`ROLE_MODEL.md`](./ROLE_MODEL.md); `0007_row_level_security.sql`
implements them and `db/local-rehearsal/10_permission_suite.sql` asserts them.

Two things to keep in mind when changing that file:

**RLS fails silently.** A wrong policy returns fewer rows rather than raising, so
a broken permission looks like an empty page, not a stack trace. Several
assertions in the suite exist specifically to pin down which failures are silent
— an ordinary customer's `delete from reviews` succeeds and removes nothing, and
the assertion that matters is that the review is still there afterwards.

**Do not add permission filters in TypeScript.** If a rule needs to change, it
changes in a policy. A filter in a component is one forgotten condition away
from showing a caterer another business's revenue.

## Seeding

```bash
npm run db:seed:generate    # regenerate supabase/seed.sql from src/data
```

Every business, price, review and phone number in it is invented. The seed
exists so the schema is exercised by realistic rows before a real caterer is
onboarded, and so a fresh project has something to render. It is re-runnable:
every statement is an upsert.

It covers caterers, packages, menus, blocked dates and add-ons — 8, 32, 34, 21
and 7 rows. It does **not** cover bookings, quote requests or reviews, because
those reference `profiles`, which reference `auth.users`, which only Supabase
Auth can create. Those arrive with the first real accounts.

## Applying it for the first time

In this order. Nothing here has been done.

1. Create two Supabase projects, development and production. Two from the first
   day — separating them later is worse than the ten minutes it costs now.
2. Apply `supabase/migrations/*.sql` to **development** only, in order.
3. Apply `supabase/seed.sql`.
4. Re-run the permission suite against the hosted project. This is the step that
   turns the security model from a local result into a real one, and it creates
   and deletes throwaway users — development project only, never production.
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   `.env.local`. The application already reads them via `src/lib/supabase/env.ts`
   and reports whether it is configured.
6. Install `@supabase/supabase-js` and write the browser and server clients.
   Deliberately not installed yet: there is no project to test against, and the
   version should be pinned when there is.
7. Replace the helper bodies in `src/data/` with queries, one at a time, keeping
   their signatures. If the UI has to change, the seam was not as clean as it
   looks — which is worth finding out early.
