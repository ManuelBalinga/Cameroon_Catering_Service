# Demo script

A rehearsed route through the product, about eight minutes. It follows the money:
a customer finds a caterer, gets a price, and pays a deposit.

Run `npm run dev` and open `http://localhost:3000`. Use a narrow browser window
or device emulation — this is a mobile-first product and it shows better at
phone width than at desktop width.

**Before you start, decide how you will handle the simulated parts.** The
honest framing works better than hoping nobody asks: *"The screens are finished
and the numbers are real arithmetic. What is missing is the database behind
them, and that is the next phase."* Each step below flags what to say if the
question comes up.

## 1 · Home (45 seconds)

Land on `/`. Point out the search — city, event type, guest count — and the
featured caterers below it.

Say what the product is and is not: a booking and quotation marketplace for
weddings, funerals, birthdays, church, school and office events. Not food
delivery. Nothing here moves food; it moves agreements about food.

**Toggle the language in the navbar, immediately.** EN to FR, then back. It is
the fastest way to show that bilingual is built in rather than promised, and
Cameroon being officially bilingual makes it a requirement rather than a
feature.

## 2 · Browse (60 seconds)

Search a city — Douala or Yaoundé — with an event type and a headcount. Note
that the browse page arrives pre-filtered: the search carried across.

Show the filters: city, cuisine, guest count, maximum budget per guest,
verified-only. Change the sort to price low-to-high and let the list reorder.

Point at a verified badge and say what it is for. In a market where catering is
arranged by personal recommendation, the verification badge is the thing the
platform sells.

## 3 · Caterer profile (90 seconds)

Open a caterer. Walk down the page: about, cuisines, packages priced per guest,
menu, gallery, reviews, availability calendar.

Two things to land:

- **Packages are priced per guest at the sizes people actually book** — 20, 50,
  100, 200. A customer planning a 100-guest wedding sees a number for a
  100-guest wedding, not a rate card to do arithmetic with.
- **Every review is tied to a completed booking.** That is the trust model. A
  review you cannot leave without having booked is worth more than one you can.

*If asked about the food photographs:* they are generated placeholders — a CSS
gradient seeded per caterer plus a cuisine emoji. Deliberate, so the app has no
image dependency and loads fast on a phone. Real photographs come with the
storage bucket.

## 4 · Request a quote (90 seconds)

Press the quote CTA. Fill the form: event type, date, city, guests, cuisine,
budget, then tick two or three add-ons.

**Watch the estimate while you tick them.** It recomputes live, and the add-ons
behave correctly — drinks, waitstaff, chairs and tables scale with the guest
count, while a cake and décor stay flat. That is how these quotes actually work
and it is the detail that makes the number believable.

Submit. Note the success card showing event type, guest count and the estimate.

*If asked whether the caterer received it:* no. The request is not stored or
sent. That is the first thing the backend has to fix, and it is the single
largest gap between this demonstration and a product.

## 5 · Compare offers (60 seconds)

Follow "compare offers" from the success card. Matching caterers appear side by
side, each with an indicative total for the requested headcount.

The pricing honours the stated budget where it falls inside a caterer's range,
so the offers respond to what was asked for rather than ignoring it.

This is the screen that replaces ringing four people on WhatsApp and writing
their prices on paper.

## 6 · Checkout (90 seconds)

Press "book now" on an offer. The checkout screen collects the event date and
the payment method.

Show all four payment options. Select MTN MoMo — the phone-number field appears
and the pay button stays disabled until a date and a plausible number are
present. Select cash and read the warning aloud: cash requires caterer approval
and does not secure the date. That warning is the platform taking a position.

Point at the summary panel: total, 30% deposit, balance due on the day. The
deposit rounds to the nearest 50 FCFA, because that is how prices are quoted in
Cameroon.

Press pay. A booking reference appears.

*If asked whether money moved:* no. The screen is complete, the arithmetic is
real, and no provider is contacted. MTN and Orange collection APIs need a
registered business and a merchant account before the integration can even be
tested — it is a business step ahead of an engineering one.

## 7 · Customer dashboard (45 seconds)

Land on `/dashboard/customer`. Upcoming bookings, past events, quote requests,
and a deposit-pending prompt on anything unpaid.

Open "leave a review" on a completed booking. Set the stars, write a line,
submit. The confirmation says plainly that nothing is published — that honesty
is deliberate and it is worth pointing at.

## 8 · The other two sides (90 seconds)

`/dashboard/caterer` — incoming requests, a bookings table, earnings with
commission already deducted, rating, and the two upsells: featured placement at
10,000 FCFA for seven days, Premium at 15,000 FCFA a month for lower commission
and a badge. *Do not press either button; neither does anything yet.*

`/admin` — GMV, commission earned, approved and pending caterers, open quotes,
disputes, recent reviews. Approve the pending caterer and watch the queue
shorten.

*If asked:* the row disappears from local state and returns on refresh. Approve
and reject currently do the same thing. The screen is right; the action needs a
database.

## 9 · Close (30 seconds)

Four revenue streams, all visible in the product: a 10–15% booking commission
(12% by default, and configurable in one place), featured listings, Premium
subscriptions, and commission on add-ons.

Close on where it stands: the front end is finished and the back end has not
started. The screens have settled what the database must store —
`src/lib/types.ts` was written as that schema in advance — so the next phase is
a database, authentication and payments, in that order.

## Questions you will get

**"Is it live?"** No. It runs locally and has never been deployed.

**"Are these real caterers?"** No. Eight invented businesses with invented
reviews, prices and phone numbers. Realistic for Cameroon, entirely fictional.

**"How long to make it real?"** Do not answer with a number. Answer with the
order: database, then one flow made real end to end — quote request stored,
caterer notified, caterer replies — then authentication, then payments. The
payment step waits on a legal entity and a merchant account, which is a business
timeline rather than an engineering one.

**"Can it handle a thousand caterers?"** Not as built — browse filters an array
in the browser. It is the right shape for eight and the wrong shape for eight
hundred, and it becomes a database query in the backend phase.

**"Why not an app?"** Web-first, mobile-first, no install, works on a cheap
Android phone on a slow connection. 87 kB of shared JavaScript and not one
external image. An app is a distribution decision for later, not a launch
requirement.
