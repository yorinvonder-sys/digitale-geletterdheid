# DGSkills Agent Instructions

These rules apply to all agents working in this repository. Keep the repo safe for
a non-coding founder to direct, and keep AI context small by default.

## Model And Delegation

- Model choice and reasoning effort: see `CLAUDE.md` § Model- en
  Denkniveau-Selectie. That table is the single source of truth; do not restate
  it here.
- Use cheaper delegated agents only for explicit, narrow, low-risk sidecar work:
  targeted file discovery, log reading, one-route QA, or one-file review.
- Never delegate Rood work — auth, Supabase/RLS, payments, invoices, personal
  data, webhooks, secrets, AI endpoints, migrations — to a cheaper or weaker
  agent. If you delegate it at all, the delegated agent holds the same model and
  effort floor as the main session.
- Final go/no-go stays with the user. An independent reviewer that did not write
  the change is required before merging Rood work; that review informs the
  decision, it does not replace it.

## Lean Context Rules

- Start context-heavy work with `npm run context:budget`.
- Read `docs/architecture/agent-context-strategy.md` for the context map before
  broad repo work.
- Use path-scoped commands: `rg`, `git status --short -- <paths>`,
  `git diff -- <paths>`, and small file reads.
- Do not broad-read `.claude/worktrees/`, `.playwright-mcp/`, `dist/`,
  `node_modules/`, `public/video/`, reports, screenshots, or binary assets.
- Do not auto-load `.claude/current-task.md`, `.claude/progress-log.md`,
  `.claude/task-queue.md`, or `LAUNCH-PLAN.md` unless the user asks to continue
  that specific workflow.
- If a prompt is broad, choose the smallest useful slice first and state the
  assumption. Ask only when a wrong assumption would be costly or risky.

## Before Code Or Config Changes

Begin every assistant reply for code/config work with an afstemmingscheck:

- Decide if the request is clear enough to execute safely.
- If vague, broad, risky, or multi-interpretation, ask critical clarifying
  questions / kritische vragen first and wait for the answer.
- Prefer one question at a time; include a recommended answer when useful.
- If no question is needed, briefly say why it is clear enough to proceed.

Before editing, give this Dutch block:

```text
Plan: what will change in normal language.
Risico: Groen / Geel / Rood, with one sentence why.
Waarschijnlijke bestanden: files or areas likely to change.
Bewijs: test, build, browser check, or manual check that proves it.
```

Keep tasks small, avoid unrelated refactors, and never hide uncertainty.

## Risk Labels

- Groen: copy, static docs/content, harmless UI polish.
- Geel: forms, dashboards, API reads, non-sensitive data updates, ordinary
  product logic, internal tooling without sensitive data.
- Rood: auth, admin, Supabase/RLS, AI endpoints, secrets, payments,
  subscriptions, invoices, KYC, bank data, personal data, webhooks, exports,
  database migrations, consent, or minors' data.

For Rood work: slow down, identify tests before implementation, verify
permissions/privacy/duplicate-processing invariants, and do not claim production
readiness without proof.

## Project Shape

- Stack: React 19, TypeScript, Vite, Supabase, Tailwind inline classes,
  Framer Motion, Vercel.
- Entry path: `App.tsx` -> `AppRouter.tsx` -> `AuthenticatedApp.tsx`.
- Use `@/*` imports from the project root.
- Follow local `AGENTS.md` files under `src/features/` before changing a
  feature domain.
- Put domain UI in `src/features/<domain>/`; shared UI in `src/components/`;
  Supabase, AI, analytics, exports, and auth integration in `src/services/`
  unless clearly feature-local.

## Security Baseline

DGSkills handles minors' data in a high-risk AI education context. For every
code change, check that you are not introducing XSS, injection, SSRF, path
traversal, unsafe secrets, permission bypasses, client-side-only validation, or
privacy leaks. Keep secrets out of code, logs, prompts, and client bundles.

Extra caution around:

- `supabase/functions/`
- `src/services/PermissionService.ts`
- `src/services/supabase.ts`
- `supabase/migrations/`
- auth, consent, teacher/admin, exports, and AI chat flows

## Proof And Final Response

- Docs/tooling only: run `npm run context:budget` or the smallest matching
  sanity check.
- Code/config: run `npm run doctor` unless a narrower project check is clearly
  sufficient.
- Rood work: also run `npm run build:prod` and explicit permission/privacy flow
  verification.
- DGSkills assignment/mission review or UI QA requires Chrome evidence across
  desktop, tablet portrait, tablet landscape, and mobile; state if Chrome could
  not be used.

After code changes, explain:

- what changed in normal language;
- why it changed;
- which files changed and what each one does;
- which tests/checks ran;
- what remains risky, unverified, or needs human review.
