# DGSkills Agent Instructions

These rules apply to all agents working in this repository. Keep the repo safe for
a non-coding founder to direct, and keep AI context small by default.

## Session Preflight And Delegation

- These repository rules are the model-routing source of truth and override
  broader global defaults and `CLAUDE.md` when they differ. Use only
  `gpt-5.6-luna` and `gpt-5.6-sol`; do not route work to Terra.
- At the start of a work slice, and whenever a plan is written or materially
  revised, state `Model`, `Thinking`, `Why`, and `Escalate when` before
  substantive work.
- Route the current coherent slice, not the hardest possible later phase. A
  later Sol sign-off does not pull earlier work to Sol.
- Luna is the default for all work except the Sol sign-offs below. Difficulty,
  ambiguity, importance, coupling, architecture, file count, or deeper
  reasoning alone never trigger Sol.
- Favor higher Luna levels; cost alone never justifies lower thinking:
  - Luna `low`: only lookups, status checks, and trivial edits.
  - Luna `medium`: only small, explicit, verifiable changes.
  - Luna `high`: routine bounded implementation, debugging, and QA.
  - Luna `xhigh`: default for substantive planning, implementation, review,
    debugging, browser QA, and multi-file work.
  - Luna `max`: use readily for architecture, ambiguity, coupled or
    multi-feature work, important behavior, sensitive implementation, large
    audits, and extensive evidence collection.
- Prefer Luna `xhigh` over `high`. Prefer `max` over `xhigh` whenever uncertainty,
  coupling, impact, or evidence volume is material. Neither level triggers Sol
  or grants sensitive sign-off.
- Sol independently signs off auth, permissions/RLS, secrets, payments,
  migrations, AI endpoints, consent, exports/webhooks, personal or minors'
  data, destructive external actions, production incidents, and release,
  deployment, SHIP, or readiness decisions with material or sensitive risk.
- Luna may investigate, plan, implement, and verify that work. Before completion,
  merge, deployment, or release, use Sol `high` for ordinary sign-off and Sol
  `xhigh` for security, privacy, data-integrity, or release-critical approval.
  Sol `max` remains exceptional.
- If Sol is unavailable, Luna may finish investigation, implementation, and
  verification, but must report the mandatory approval as blocked rather than
  treating its own output as final sign-off.
- Use delegated agents only for explicit, scoped work. Delegation never lowers
  the required model or effort; delegated Rood work keeps the main session's
  model and effort floor.
- Final go/no-go stays with the user. Before merging Rood work, require an
  independent reviewer that did not write the change; its review informs but
  does not replace the user's decision.

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
