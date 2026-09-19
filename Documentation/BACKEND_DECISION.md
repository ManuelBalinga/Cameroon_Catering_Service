# Backend decision — Supabase or Firebase

**Status: decided, 19 September 2026 — Supabase.** Group J is unblocked.

The reasoning is kept below, unchanged, because the *why* is the part worth
having in six months when someone asks whether Firestore would have been easier.
Either option would have worked; this is why one fits this product better.

## What the backend has to do

`src/lib/types.ts` already describes the schema. Eleven entities:

```
users            customers        caterers
bookings         quote_requests   reviews
payments         messages         featured_listings
subscriptions    add_on_services
```

The shapes of the queries are visible too, in the helper functions the UI
already calls:

| Helper | What the query becomes |
| --- | --- |
| `getCaterer(id)` | Row by primary key, with packages, menu and booked dates |
| `featuredCaterers()` | Filter on a boolean, ordered |
| `catererCities()` | Distinct cities across caterers |
| `reviewsFor(catererId)` | Join on a foreign key |
| `recentReviews(limit)` | Ordered, limited, across all caterers |
| `catererBookings(id)` | Filter by owner |
| `catererQuotes(id)` | Filter by owner and status |
| `totalGmv()` / `totalCommission()` | Aggregate across all bookings |

Read that list again and note what it is made of: foreign keys, distinct
values, ordered joins, and two aggregates. That is a relational workload
described in relational language, and it was written that way before either
database was chosen.

## The case for Supabase

**The data is relational and it already knows it.** Bookings reference
caterers, reviews reference both a caterer and a booking, quote requests
reference add-on services by id. In Postgres those are foreign keys with
integrity guarantees. In Firestore they are string fields with a convention and
a hope.

**`totalGmv()` and `totalCommission()` are aggregates.** Postgres does `SUM()`
over a filtered set in one query. Firestore has no general aggregate over an
arbitrary filter; the usual answers are to maintain counters in a write path,
or to read every matching document and add it up on the client. The admin
dashboard is built entirely from aggregates, and they will only get heavier as
bookings accumulate.

**Browse is a multi-field filtered query.** City, cuisine (an array
containment), minimum guest count, price range and a verified flag, with four
sort orders. Postgres takes that as one `where` clause with indexes. Firestore
needs a composite index per combination and has real limits on how many
inequality filters can be combined.

**Permissions have a natural home.** Row Level Security lets the rule "a caterer
sees only their own bookings" live in the database, where it cannot be forgotten
by the next person writing a query. Firestore security rules do a similar job
and are perfectly capable; the difference is that the same rule in Postgres is
also the rule enforced against every future admin script, background job or SQL
console.

**It is portable.** A Supabase database is a Postgres database. If the project
outgrows Supabase, the schema moves to Neon, RDS or a plain Postgres box and
only the client library changes. Leaving Firestore means rewriting the data
layer and reshaping the data.

**It keeps the types honest.** `src/lib/types.ts` maps almost one-to-one onto
tables and columns. With generated types from the schema, the mapping stays
checked by the compiler rather than by memory.

## The case for Firebase

It is not weak, and it should be stated properly.

**Real-time is free.** If in-app messaging between customer and caterer becomes
a priority — it is currently out of scope in favour of WhatsApp — Firestore's
listeners are the simpler path. Supabase Realtime exists and is good, but this
is Firebase's home ground.

**Auth has more providers out of the box**, including phone-number sign-in,
which matters more than usual here: many Cameroonian users have a phone number
and no email address they check. Supabase supports phone auth too, via an SMS
provider that has to be configured and paid for. Firebase's is more turnkey.

**It scales without thought.** Firestore will not fall over because a query was
written badly; it will refuse the query instead. For a small team with no
database operator, that failure mode has real value.

**Offline support is better** if a mobile app ever follows the web product.

## Why Supabase wins here anyway

The deciding factor is the shape of the work already done. This product's data
model was designed relationally, written down relationally, and every query the
UI needs is a relational query. Choosing Firestore means translating that model
into collections and denormalising it, and then maintaining that translation
every time the schema moves.

Phone authentication is the one genuine advantage Firebase has for this market,
and it is solvable on Supabase with an SMS provider — which will be needed
anyway for booking notifications, so the cost is shared rather than added.

## What to do once it is decided

1. Create the project. Keep a development instance separate from production
   from the very first day — migrating later is worse than the ten minutes it
   costs now.
2. Write the schema as a migration from `src/lib/types.ts`. Money columns are
   integers in FCFA; there are no centimes, and floating-point money is a bug
   waiting to be written.
3. Enable Row Level Security on every table before inserting a single row, and
   write the policies from [`ROLE_MODEL.md`](./ROLE_MODEL.md).
4. Seed it from `src/data/*` so the UI has something to render on day one.
5. Replace the helper function bodies in `src/data/` with queries, one at a
   time, keeping their signatures. The UI should not need to change at all —
   and if it does, the seam was not as clean as it looked, which is worth
   knowing early.
6. Convert `/caterers/[id]` to fetch server-side first. It is already the only
   dynamic route, so it is the natural place to start.

## What not to do

- Do not put permission filters in TypeScript. If the rule is "a caterer sees
  only their own bookings", that rule belongs in a policy. A filter in a
  component is one forgotten `where` clause away from leaking another business's
  revenue.
- Do not store money as a float.
- Do not let the service-role key anywhere near a `NEXT_PUBLIC_` variable. It
  bypasses every row-level policy in the database.
