# DGSkills Agent Instructions

These rules apply to all agents working in this repository. Keep the repo safe for
a non-coding founder to direct, and keep AI context small by default.

## Model And Delegation

- Keep `gpt-5.5` as the main model for architecture, integration, ambiguous
  debugging, security-sensitive work, release decisions, and final validation.
- At the start of each task, classify the task's risk and complexity, choose the
  lowest safe ChatGPT thinking level, and state the chosen thinking level before
  doing substantive work. Raise the thinking level when uncertainty, coupling,
  security, data sensitivity, or release risk increases.
- Do not invoke Superpowers skills as a standard startup/default workflow. Use
  Superpowers only when the user explicitly calls for Superpowers or a specific
  `superpowers:*` skill; this repo instruction intentionally overrides
  Superpowers plugin metadata that says to use `using-superpowers` when starting
  conversations.
- When Codex is planning and reviewing, prefer DeepSeek as the bounded code
  executor when the current environment exposes a safe DeepSeek bridge or a
  working `DEEPSEEK_API_KEY`. Think explicitly about `deepseek-v4-flash` versus
  `deepseek-v4-pro` before delegation: use `deepseek-v4-flash` for narrow,
  low-risk, mechanical implementation; use `deepseek-v4-pro` for larger or more
  coupled implementation that is still safe to delegate.
- Never write, print, commit, log, or paste the DeepSeek API key. Treat any
  DeepSeek bridge, executor script, or AI endpoint configuration as Rood work
  unless it is a docs-only instruction change.
- If DeepSeek is not available, fall back to the existing cheaper delegated
  agent route, such as `gpt-5.3-codex-spark`, for the same narrow executor work.
- Use cheaper delegated agents only for explicit, narrow, low-risk sidecar work:
  targeted file discovery, log reading, one-route QA, or one-file review.
- Do not delegate auth, Supabase/RLS, payments, invoices, personal data,
  webhooks, secrets, AI endpoints, or final validation decisions.
- Use the lowest reasoning effort that safely handles the current slice.

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
- `services/PermissionService.ts`
- `services/supabase.ts`
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
