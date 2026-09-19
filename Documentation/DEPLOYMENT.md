# Deployment

**Status:** not deployed. No deployment has been made or confirmed from this
repository.

## Running it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Node 18.18 or newer. Developed on Node 24.

Three runtime dependencies — `next`, `react`, `react-dom` — and nothing else
ships to the browser. `npm install` is fast and offline-friendly after the first
run.

## Verifying before a commit

```bash
npm run build    # production build; also typechecks
npx tsc --noEmit # typecheck on its own
```

Both pass as of 19 September 2026. The build emits 18 route entries — 17
pages plus the 404 — of which 17 prerender as static content and one
(`/caterers/[id]`) is server-rendered on demand; Next reports 19 static pages
generated. Shared JS
is 87.1 kB and the heaviest first load is the home page at 114 kB.

```bash
npm run lint     # DOES NOT WORK
```

There is no ESLint configuration and no ESLint dependency in this repository, so
`next lint` drops into its interactive first-run setup prompt and lints nothing.
Fix it before relying on it:

```bash
npm i -D eslint eslint-config-next
printf '{ "extends": "next/core-web-vitals" }\n' > .eslintrc.json
npm run lint
```

## Deploying to Vercel

The application is a standard Next.js 14 App Router build with no custom server,
no middleware and no external services, so deployment is close to a default.

`vercel.json` already pins the framework:

```json
{ "framework": "nextjs" }
```

Steps:

1. Import the repository in Vercel and select the `dev` branch, or promote to
   `main` first if a stable branch is wanted for production.
2. Leave the build command and output directory as detected.
3. Set the Node version to 18 or newer.
4. No environment variables are required today, because there are no secrets —
   see below.
5. Deploy.

## Environment variables

There are none, and that is worth saying explicitly rather than leaving an empty
section. The application has no backend, no authentication and no payment
provider, so there is nothing to configure and no `.env.example` to copy.

When the backend lands, this is the set to expect:

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | The deployed origin. Needed the moment auth exists, because it builds the links in confirmation and password-recovery emails. Left as localhost, those links only work on the machine that sent them. |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Client key, constrained by row-level policies |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses every row-level policy. Treat it like a database password. It must never be prefixed `NEXT_PUBLIC_`. |
| `MOMO_SUBSCRIPTION_KEY` / `MOMO_API_USER` / `MOMO_API_KEY` | **server only** | MTN MoMo collections |
| `ORANGE_CLIENT_ID` / `ORANGE_CLIENT_SECRET` | **server only** | Orange Money |
| `PAYMENT_WEBHOOK_SECRET` | **server only** | Verifies incoming payment webhooks |
| `WHATSAPP_API_TOKEN` or an SMS provider key | **server only** | Booking and quote notifications |

Add a `.env.example` listing the names — never the values — in the same commit
that introduces the first one.

## Before deploying publicly

This is a demonstration built on invented data. Anything published today will be
read as a real service by anyone who finds it.

- Every caterer, review, booking and price in `src/data/` is invented. The
  businesses do not exist and the phone numbers are not real.
- The footer already carries a demo badge and the legal page says in both
  languages that it is demonstration text. Keep both visible until they are not
  true.
- `/dashboard/customer`, `/dashboard/caterer` and `/admin` are reachable by URL
  with no authentication. On invented data that is only embarrassing; the day
  real data lands it is a breach.
- The login page accepts any credentials and says so. That is honest for a demo
  and unacceptable for anything else.

A public demo is a reasonable thing to publish. It just needs to be a decision
rather than a side effect.

## Custom domain

Blocked on the product name and legal entity — see
[`OPEN_REQUESTS.md`](./OPEN_REQUESTS.md). "Cameroon Catering Service" is a
working title and the domain should not be bought before the name is settled.
