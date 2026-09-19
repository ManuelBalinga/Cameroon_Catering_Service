# Documentation

Project documentation for **Cameroon Catering Service**. The status page itself
lives at [`../PROJECT_STATUS.html`](../PROJECT_STATUS.html) in the repository
root; this folder holds the detail behind it.

Read them in this order.

| File | What it answers |
| --- | --- |
| [`../PROJECT_STATUS.html`](../PROJECT_STATUS.html) | Every deliverable and whether it is built, and what "built" does and does not mean here. Start here. |
| [`PHASE_COMPLETION_2026-09-19.md`](./PHASE_COMPLETION_2026-09-19.md) | Phase-by-phase report: what is done, what is not, and why. |
| [`OPEN_REQUESTS.md`](./OPEN_REQUESTS.md) | What remains unverified, and the five decisions only the owner can make. |
| [`BACKEND_DECISION.md`](./BACKEND_DECISION.md) | Supabase vs Firebase, with a recommendation. Blocks the whole backend phase. |
| [`PAYMENTS.md`](./PAYMENTS.md) | How MTN MoMo and Orange Money collection actually works, and why this is a business blocker before it is an engineering one. |
| [`ROLE_MODEL.md`](./ROLE_MODEL.md) | Customer, caterer, admin — what each may do, and what the database must enforce rather than trust the UI to enforce. |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | How to run it, how to deploy it, and what to configure once a backend exists. |
| [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) | A rehearsed click-through for showing the product, including what to say about the parts that are simulated. |
| [`COLLABORATOR_ONBOARDING.md`](./COLLABORATOR_ONBOARDING.md) | The prompt to hand a new collaborator or their AI assistant. |

## Two words that are used carefully here

**Built** means the code exists, typechecks, and produces the screen it is
supposed to produce.

**Working** means a real person performed the action and the result survived a
page refresh.

Nothing on this project is Working yet, because there is no server for anything
to survive into. Every document in this folder keeps those two words apart, and
so should anything added to it.

## Updating these

- If a deliverable's status changes, update `PROJECT_STATUS.html` in the same
  commit as the code. A status page that lags the code is worse than none.
- Add a new phase-completion report rather than editing the last one. They are
  dated for a reason.
- `OPEN_REQUESTS.md` shrinks over time. When a decision is made, move it from
  "open" to "answered" with the date and the reasoning — the reasoning is the
  part you will want in six months.
