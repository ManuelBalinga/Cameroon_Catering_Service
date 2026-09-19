# Onboarding prompt for a new collaborator

Send the block below to anyone joining the project. They paste it into their
first chat with their AI assistant. It gives the assistant enough context to work
without reading the whole repository first.

Before sending it, make sure the person actually has access:

1. **GitHub** — add them as a collaborator on
   `ManuelBalinga/Cameroon_Catering_Service` (Settings → Collaborators).
2. **Node 18.18+** — developed on Node 24.
3. **Nothing else.** There are no secrets, no `.env.local` and no external
   services yet. `npm install && npm run dev` is the whole setup, and that will
   change the moment a backend lands — at which point
   [`DEPLOYMENT.md`](./DEPLOYMENT.md) becomes required reading.

---

## The prompt — copy everything below this line

I'm joining a project called **Cameroon Catering Service**. It's a web-first
catering marketplace for Cameroon: customers find and compare verified caterers
for weddings, funerals, birthdays, church, school and office events, request
quotes, and pay a deposit by Mobile Money. It is a booking and quotation
platform, **not** a food-delivery app, and it earns a 10–15% commission on each
completed booking.

**Stack:** Next.js 14 (App Router, TypeScript, Tailwind). Three runtime
dependencies: `next`, `react`, `react-dom`. Bilingual EN/FR. Currency is FCFA
(XAF). There is **no backend** — seed data in `src/data/` stands in for a
database. The repo is `ManuelBalinga/Cameroon_Catering_Service`; development
happens on the `dev` branch.

### Before you write any code, read these, in this order

1. **`PROJECT_STATUS.html`** (repo root) — every deliverable and whether it is
   built. It also explains the two words this project uses carefully; see below.
2. **`Documentation/PHASE_COMPLETION_2026-09-19.md`** — what is done, what is
   not, and why.
3. **`Documentation/OPEN_REQUESTS.md`** — what is unverified and what is waiting
   on a decision.
4. **`CLAUDE.md`** — project conventions. **It is behind the code**; see the
   warning below.
5. Whichever file in `Documentation/` covers what you're about to touch.

### Four things about this project that are easy to get wrong

**"Built" and "working" are different words here.** Built means the code exists,
typechecks and produces the right screen. Working means a real person performed
the action and the result survived a refresh. **Nothing on this project is
Working**, because there is no server for anything to survive into. The status
page counts them separately and that has been kept honest. Don't blur them — and
if you ship something, say which of the two you shipped.

**`CLAUDE.md` is out of date and will mislead you.** Its page list stops at
twelve routes and the 404; there are seventeen and the 404. `/login`, `/signup`, `/offers`, `/review`
and `/caterers/join` all exist and none is mentioned. Its TODO items 4 and 6 ask
for a review form and a caterer onboarding flow that were both shipped in commit
`ed3827d`. **Check the code before building anything that file says is missing.**
If you fix the drift, fix it in `CLAUDE.md` rather than only in your head.

**All user-facing strings are supposed to go through `useI18n().t(key)`, with EN
and FR entries in `src/lib/i18n.ts`.** The dictionary is at exact parity — 199
keys each — and should stay that way. But 94 inline `fr ? "…" : "…"` ternaries
across 9 files currently bypass it, mostly in the newer pages. **Don't add more.**
If you touch one of those files, move its strings into the dictionary while
you're there.

**Money has rules.** Amounts are whole FCFA — no centimes, never a float. Always
format through `formatFCFA` / `formatFCFACompact` in `src/lib/format.ts`, and
take commission and deposit from `DEFAULT_COMMISSION` (0.12) and `DEPOSIT_RATE`
(0.30) rather than writing a number into a page. Two prices currently break this
rule — the Premium and featured-listing prices in the caterer dashboard — and
they should move into `src/lib` before billing is built.

### Architecture rules

- **UI** in `src/components`, **data** in `src/data`, **domain logic and types**
  in `src/lib`. Don't mix them. No component reaches past the data helpers.
- `src/lib/types.ts` is the single source of truth, and it was written as the
  eventual database schema. If a shape changes, it changes there first.
- Interactive pages are client components. Anything reading `useSearchParams`
  needs a thin server `page.tsx` wrapping a `*Client.tsx` in `<Suspense>` — see
  browse, quote, offers, checkout and review for the pattern.
- The seed layer is the only seam to the future backend. Keep the helper
  signatures in `src/data/` stable; their bodies become queries.
- Prefer editing an existing component over adding a near-duplicate.

### Before you call anything done

```bash
npm run build      # production build; also typechecks
npx tsc --noEmit   # typecheck alone
```

Both pass today. Keep them passing.

**`npm run lint` does not work.** There is no ESLint config and no ESLint
dependency, so `next lint` opens an interactive setup prompt and lints nothing —
despite both `README.md` and `CLAUDE.md` documenting it as a command. Fixing
that is an open task and a good first contribution.

**There are no tests at all.** If you add the first ones, put them around the
money functions in `src/lib/format.ts` — pure, small, and where the revenue
model lives.

### Working agreements

- Development happens on `dev`. Don't push to `main` without asking.
- Commit messages end with the project's Co-Authored-By trailer.
- Keep the copy realistic for Cameroon: local cities, local dishes, Mobile
  Money, WhatsApp, bilingual. The seed data sets the tone — match it.
- If a deliverable's status changes, update `PROJECT_STATUS.html` in the same
  commit. A status page that lags the code is worse than no status page.

Start by reading `PROJECT_STATUS.html` and
`Documentation/PHASE_COMPLETION_2026-09-19.md`, then tell me where things stand
and what you think is worth picking up first.
