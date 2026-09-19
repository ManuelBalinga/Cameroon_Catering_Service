# Role model

Three roles: **customer**, **caterer**, **admin**. `UserRole` in
`src/lib/types.ts` is the source of truth for the names.

There is no hierarchy between customers and caterers. They are two sides of a
marketplace, not two levels of one.

**Nothing in this document is enforced today.** There is no authentication and
no database, so every route is publicly reachable and every dashboard shows a
fixed demo user. This is the specification the backend has to implement, written
down before it is built so that the policies can be written from it rather than
inferred from the UI.

## Customer

A person booking catering for an event.

| May | Notes |
| --- | --- |
| Browse and filter caterers | Public — no account needed, and it should stay that way. A marketplace that demands a signup before showing prices loses the visitor. |
| View a caterer profile, packages, menu, reviews, availability | Public |
| Request a quote | Should require an account, because the caterer needs someone to reply to |
| Compare offers received | Own requests only |
| Pay a deposit | Own bookings only |
| See their own bookings and quote requests | Own only — the strongest rule on this list |
| Review a completed booking | Only a booking that is theirs, whose status is `completed`, and only once |
| Contact a caterer on WhatsApp | Public, by design — this is how the market already works |

**The review rule is the platform's trust model** and it is the one most worth
enforcing in the database rather than the UI. Today `/review` takes a caterer id
and a booking reference from the URL and is linked only from a completed booking
in the customer dashboard. That is correct routing and zero enforcement: anyone
can type the URL. When reviews persist, the insert must verify that the booking
exists, belongs to the authenticated customer, is `completed`, and has no review
already. Every seed review carries `verifiedBooking: true`; that flag has to mean
something.

## Caterer

A business selling catering services.

| May | Notes |
| --- | --- |
| Create and edit their own business profile | Via `/caterers/join`; edits after verification may need re-approval |
| Publish packages and menu items | Own profile only |
| See quote requests addressed to them | Own only |
| Respond with an offer | Not built — the reply side of the funnel does not exist |
| See their own bookings and earnings | Own only. A caterer seeing another caterer's revenue is the worst leak this product can have. |
| Mark dates unavailable | Not built — the availability calendar is read-only |
| Buy a featured listing or Premium | Buttons exist, neither has a handler |
| Read reviews of their business | Public anyway |
| Reply to a review | Not built, and worth considering |

**A caterer may not:** verify themselves, set their own commission rate, edit or
delete a review, or see anything belonging to another caterer.

The `verified` and `featured` flags are admin-controlled and must not be
writable by the caterer they describe. Today they are properties of seed data;
when they become columns, they need a policy that says so explicitly.

## Admin

Platform staff.

| May | Notes |
| --- | --- |
| Approve or reject caterer applications | Both buttons currently call the same handler — approving and rejecting are indistinguishable |
| See platform-wide GMV and commission | Aggregates across every booking |
| See all bookings and quote requests | Read-only in the current design |
| Manage featured listings and subscriptions | Not built |
| Handle disputes | The dashboard counts them and offers no way to resolve one |
| Remove a review | For abuse only, and every removal should be logged |

**An admin may not:** create a booking on a customer's behalf, alter a completed
booking's total, or edit review content. Those are the actions that destroy
trust in a marketplace, and the absence of them is worth stating rather than
assuming.

## What the database must enforce, not the UI

When the backend lands, these are the rules that belong in Row Level Security
policies (or Firestore rules), because a filter in a React component is one
forgotten condition away from leaking another business's revenue:

1. A customer reads only their own bookings, quote requests and payments.
2. A caterer reads only quote requests addressed to them and bookings where they
   are the caterer.
3. A caterer writes only their own profile, packages and menu, and cannot write
   `verified`, `featured` or `subscriptionTier` at all.
4. A review inserts only against a `completed` booking owned by the authenticated
   customer, and only once per booking.
5. Financial aggregates are admin-only. `totalGmv()` and `totalCommission()`
   currently run in the browser over all seed data; as queries they must be
   refused for anyone who is not an admin.
6. Caterer approval is an admin-only write, and approve and reject must be
   distinct operations with distinct outcomes.
7. Public reads — the directory and profiles — stay public. Requiring an account
   to browse would be a product mistake, not a security improvement.

## Current state, stated plainly

| Rule | Enforced where today |
| --- | --- |
| All seven above | Nowhere |

`/dashboard/customer`, `/dashboard/caterer` and `/admin` are all reachable by
typing the URL, and each renders a fixed demo user from seed data. That is
acceptable for a prototype whose data is invented. It stops being acceptable the
moment the first real caterer's revenue is in the database.
