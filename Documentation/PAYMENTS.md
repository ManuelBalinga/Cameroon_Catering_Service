# Payments — MTN MoMo and Orange Money

**Status:** not started. Blocked on a business decision, not on code.

## What exists today

`src/app/checkout/CheckoutClient.tsx` is a complete deposit screen. It:

- offers MTN MoMo, Orange Money, bank transfer and cash, each with the right
  follow-up field or warning;
- collects the Mobile Money number when one of the two wallets is selected, and
  disables the pay button until a date and a valid-length number are present;
- computes the total from the chosen package, takes 30% as a deposit
  (`DEPOSIT_RATE`), rounds it to the nearest 50 FCFA, and shows the remaining
  balance;
- flags cash as requiring caterer approval and not recommended for securing a
  date — which is the correct advice;
- on submit, sets a boolean and displays a generated reference of the form
  `CCS-1234`.

That last line is the whole gap. No provider is contacted. Nothing is charged.
The reference is `Math.random()`.

## Why this is a business blocker first

Both MTN and Orange gate collection APIs — the direction that takes money from a
customer — behind a registered business. In practice that means:

- a registered Cameroonian legal entity;
- a merchant or business account with the operator;
- KYC on the business and its directors;
- a signed commercial agreement, with per-transaction pricing that is negotiated
  rather than published;
- for MTN, a developer account and a subscription key, with sandbox credentials
  available before the commercial agreement but production credentials only
  after it.

Sandbox access is enough to write the integration. It is not enough to test that
money actually arrives, which is the only test that counts. So the sequence is
fixed: entity, then merchant account, then integration — and this is why the
legal-entity question in [`OPEN_REQUESTS.md`](./OPEN_REQUESTS.md) blocks more
than the legal pages.

## The two routes

### Direct integration

Talk to MTN MoMo Collections and Orange Money Web Payment separately. Cheaper
per transaction, no intermediary, full control of the reconciliation data.

Costs: two integrations, two sets of credentials, two sandboxes, two support
relationships, and two settlement reports to reconcile against bookings. Both
operators must be onboarded before launch, because a platform that only takes
MTN excludes roughly half the market.

### Aggregator

A payment aggregator covering both wallets — and usually cards and bank transfer
too — behind one API. Faster to launch, one integration, one reconciliation
report, and often a hosted payment page that removes most of the compliance
surface from this codebase.

Cost: a percentage of each transaction, charged on top of the platform's own
10–15% commission. On a 30% deposit of a 500,000 FCFA wedding, an aggregator
taking 2% costs 3,000 FCFA per booking, against a commission of 60,000 FCFA.
That is a real margin cut but not a decisive one, and it buys weeks.

**For a first launch, the aggregator is the better trade** unless a direct
agreement is already in hand. Volume is the thing that makes direct integration
worth its overhead, and this platform has none yet.

## How the flow has to work

Mobile Money collection is asynchronous and this is the part most likely to be
got wrong. The customer does not complete a payment in the browser. They receive
a USSD prompt on their phone, and they may approve it in ten seconds, approve it
in four minutes, or walk away and never approve it at all.

```
Customer presses "Pay deposit"
  → server creates a payment row (status: pending, with a booking reference)
  → server calls the provider with amount, payer number, external reference
  → provider returns a transaction id; the browser starts polling or waits on a socket
  → customer approves the USSD prompt on their handset
  → provider calls the webhook  → server marks the payment successful
                                → server confirms the booking
                                → server notifies the caterer
  → browser sees the state change and shows the success screen
```

Consequences for the current code:

- **The success screen must follow the webhook, not the button press.** The
  present screen shows success immediately, which in a real integration would
  confirm bookings that were never paid for.
- **The booking reference must be generated server-side and stored before the
  provider is called**, so a webhook arriving for an unknown reference is an
  error rather than a guess. `CCS-` plus four random digits also collides far
  too easily to be a real reference.
- **Webhooks must be idempotent and signature-verified.** They are retried, they
  arrive out of order, and they arrive from the open internet.
- **There must be a timeout and a retry path.** A customer who missed the prompt
  needs to be able to ask for it again without creating a second booking.
- **Every payment attempt is a row**, including the failures. The `payments`
  entity in `src/lib/types.ts` is already there for this and no screen writes to
  it yet.

## Bank transfer — do this one first

Bank transfer needs no provider integration at all, and it is what a 500-guest
wedding will actually use, because the deposit alone exceeds normal Mobile Money
wallet limits.

The flow is entirely inside the product: show the platform's bank details with
the booking reference, mark the booking as awaiting transfer, and let an admin
confirm receipt against a bank statement. It is manual, it is honest about being
manual, and it can ship before any merchant account exists. The checkout screen
already offers the option and currently promises that "bank transfer details
will be shown after you confirm" — details that do not exist yet.

## Cash

The UI already warns that cash requires caterer approval and does not secure a
date. Keep that warning. A marketplace that takes a commission on a booking it
never touched the money for has no way to collect that commission, which is
exactly the failure mode informal arrangements have today.

## Before any of this is written

- Amounts stay integers in FCFA. There are no centimes, and floating-point money
  is a bug waiting to happen.
- Provider credentials go in server-only environment variables. Never
  `NEXT_PUBLIC_`.
- Payment initiation happens on the server. A client that can name its own
  amount can name a smaller one.
- Log every provider request and response against the payment row. When a
  customer says they paid and the platform says they did not, that log is the
  only thing that settles it.
