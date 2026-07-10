# 🍲 Cameroon Catering Service

A **web-first catering marketplace for Cameroon** — connecting customers with
verified caterers for weddings, funerals, birthdays, office lunches, church and
school events, and bulk food orders.

This is **not** a food-delivery app. It is a **booking & quotation platform**
built around trust, simple bookings, Mobile Money, and commission-based revenue.

> **Status:** Production-minded MVP prototype. The UI is complete and fully
> responsive, powered by realistic **seed data** in `src/data`. Swap the seed
> layer for Supabase/Firebase to go live.

---

## ✨ What it does

| For customers | For caterers | For admin |
|---|---|---|
| Discover & compare verified caterers | List a business & build a profile | Approve caterers |
| Filter by event, city, guests, cuisine, budget | Receive quote requests | Track bookings & commission |
| Request quotes & choose packages | Send quotes & get booked | Handle disputes |
| Pay a deposit (MTN MoMo / Orange Money) | Track orders, earnings & reviews | Manage featured listings |
| Review after the event | Boost visibility (featured / Premium) | View platform analytics |

### Core money model 💰
1. **10–15% commission** per successful booking (see `DEFAULT_COMMISSION` in `src/lib/format.ts`)
2. **Featured listings** for caterers
3. **Premium subscriptions** (lower commission, priority support)
4. **Add-on commissions** — cakes, drinks, waitstaff, chairs, tables, décor, rentals

Expansion roadmap surfaced in the UI: photographers, DJs, lighting, cleanup,
transport, full event planning.

---

## 🧱 Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** design system (warm green + gold, Cameroon-inspired)
- **Bilingual EN/FR** via a lightweight i18n context (Cameroon is officially bilingual)
- **No external image/CDN dependencies** — placeholder food art is generated
  with CSS gradients + emoji so the app runs fully offline and fast
- Clean separation of **UI (`components`) / data (`data`) / domain logic (`lib`)**

---

## 🚀 Run it locally

```bash
# 1. install dependencies
npm install

# 2. start the dev server
npm run dev

# 3. open the app
#    http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

Requires **Node 18.18+** (tested on Node 24).

---

## 🗂️ Project structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout: i18n provider + navbar + footer
│   ├── page.tsx                # Home (hero, featured, how-it-works, trust, CTA)
│   ├── browse/                 # Caterer directory + filters (BrowseClient)
│   ├── caterers/[id]/          # Caterer profile (packages, menu, reviews, calendar)
│   ├── quote/                  # Request-a-quote form + live estimate
│   ├── checkout/               # Deposit payment flow (MoMo / Orange / bank / cash)
│   ├── dashboard/customer/     # Customer dashboard (bookings, quotes)
│   ├── dashboard/caterer/      # Caterer dashboard (requests, earnings, upsells)
│   ├── admin/                  # Admin dashboard (approvals, commission, analytics)
│   ├── about / contact / faq / legal
│   └── not-found.tsx
│
├── components/                 # Reusable UI (CatererCard, Navbar, Footer,
│                               #   Rating, Badges, PackageCard, StatCard,
│                               #   AvailabilityCalendar, HeroSearch, FoodArt…)
│
├── context/
│   └── I18nContext.tsx         # EN/FR provider + useI18n() hook
│
├── data/                       # 🌱 Seed data (swap for Supabase/Firebase)
│   ├── caterers.ts             #    8 realistic Cameroonian caterers
│   ├── reviews.ts              #    verified-booking reviews
│   ├── bookings.ts             #    bookings + quote requests
│   └── addons.ts               #    add-on services + expansion roadmap
│
└── lib/
    ├── types.ts                # Domain entities (users, caterers, bookings…)
    ├── i18n.ts                 # Translation dictionary + enum labels
    ├── format.ts               # FCFA formatting, commission & deposit rates
    └── options.ts              # Event types, cuisines, cities, guest buckets
```

---

## 🔌 Going to production (next steps)

The app is structured so the seed layer is the only thing to replace:

1. **Database** — create tables mirroring `src/lib/types.ts`
   (`users`, `customers`, `caterers`, `bookings`, `quote_requests`, `reviews`,
   `payments`, `messages`, `featured_listings`, `subscriptions`, `add_on_services`).
2. **Auth** — Supabase Auth / Firebase Auth for customers, caterers and admins.
3. **Payments** — integrate MTN MoMo & Orange Money collection APIs (and a bank
   transfer reference flow) at `src/app/checkout`.
4. **Storage** — replace `FoodArt` placeholders with uploaded caterer photos.
5. **Notifications** — WhatsApp Business API / SMS for quote & booking updates.

Search `TODO`-style comments and the `src/data` folder to see every seam.

---

## 🌍 Built for Cameroon

- **Mobile-first** layout — most users are on phones.
- **MTN MoMo & Orange Money** front and centre; bank transfer + conditional cash.
- **WhatsApp** contact on every caterer and support page.
- **English & French** throughout — toggle in the navbar.
- **FCFA (XAF)** pricing everywhere.

_This is a demonstration MVP — content and data are illustrative._
