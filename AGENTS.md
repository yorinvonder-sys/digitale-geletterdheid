# DGSkills Agent Instructions

These rules apply to all agents working in this repository. Keep the repo safe for
a non-coding founder to direct, and keep AI context small by default.

## Model And Delegation

- OpenCode is the control plane. Start every work slice with `Model`, `Thinking`,
  `Why`, and `Escalate when`.
- Launch project sessions with argument-free `npm run agent:opencode`. The safe
  launcher rejects all CLI overrides, removes provider/config override variables,
  and isolates global OpenCode config while preserving the local OAuth store.
  Direct worker/external-agent selection is forbidden.
- Use the lowest effort that safely handles the task. If a worker needs a level
  above its ceiling, switch model instead of buying more reasoning on the wrong
  model.
- Only one agent may write in a worktree at a time. Claude writes only in a
  disposable `claude/**` worktree; Sol reviews and integrates its diff.

| Route | Allowed effort | Use | Ceiling |
|---|---|---|---|
| DeepSeek V4 Flash | `none`, `low`, `high` | Sanitized Groen discovery and analysis | `max` is eval-only; never Rood or personal data |
| Luna | `low`, `medium`, `high` | Bounded reversible implementation | `xhigh`/`max` routes to Sol |
| Terra | `medium`, `high` | Shadow evaluation only | No applied edits until the eval gate passes |
| Sol | `low` through `max` | Orchestration, integration, architecture, Rood and final validation | `ultra` only for manual, independently verifiable delegation |
| Claude Opus 5 | `low` through `max` | Independent review or isolated implementation | No push, merge, deploy or production credentials |
| Claude Opus 4.8 | `xhigh` | Independent ordinary release review only | Read-only |
| Claude Fable 5 | `max` | Independent security-incident review only | Read-only |

- Claude Sonnet, Haiku, `opusplan`, automatic model-family fallback and the
  default Claude model are excluded from this workflow.
- DeepSeek and Terra analyze only the strict, single-part sanitized packet
  supplied by Sol; duplicate/unknown safety headers and likely PII fail closed.
  Every external delegation also requires user approval before provider access.
  They have no repository, shell, network, skill or MCP tools. Luna has no shell
  or grep and machine-enforced denies for Rood and agent-policy paths.
- OpenCode internal title, summary and compaction work uses Sol, not Luna, so a
  sensitive session is never silently handed to a lower-risk route.
- Legacy GitHub inbox/comment bridge workflows and npm entrypoints are retired.
  Do not re-enable them without DLP, trusted-actor checks and exact model proof.
- Ordinary release gate: Sol `xhigh` prepares the release evidence, Opus 4.8
  `xhigh` reviews it independently, and the user makes the go/no-go decision.
- Security-incident gate: Sol `max` owns investigation and remediation; Fable 5
  `max` and Opus 5 `max` review the same sanitized evidence independently and
  blind to each other's conclusions. Any critical finding blocks release. Sol
  reconciles; the user makes the incident and release decision.
- Do not send secrets, personal data, learner records, raw prompts, auth/session
  details or production dumps to DeepSeek, Claude, Linear, Sentry or Notion.

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

## Linear And Sentry Workflow

- Use the existing Linear DGSkills project for substantial work. New work starts
  in Backlog, moves to In Progress when the branch starts, In Review when the PR
  opens, and Done only after merge and proof.
- Agent branches use `agent/<LINEAR-ID>-<slug>`. A one-time bootstrap branch may
  omit the Linear ID until OAuth is connected, then records the issue in its PR.
- Agents may create branches, push and open PRs. They may not merge, enable
  auto-merge, deploy, or change branch protection.
- Use Sentry as evidence for production-only failures. Sentry and Linear never
  replace security, privacy or release judgment.

## Infrastructure MCP Boundaries

- Only `dg-orchestrator` may use Linear, Supabase or Vercel MCP tools. Workers,
  shadow evaluators and independent reviewers receive sanitized evidence only.
- Supabase MCP is pinned to the non-production project in `supabase/config.toml`,
  with `read_only=true` and only schema metadata plus documentation tools. Never
  query table rows, execute arbitrary SQL, deploy functions or apply migrations.
- Vercel MCP OAuth is team/account scoped because Vercel does not offer a hard
  project scope. Use it only for DGSkills project and deployment metadata. Raw
  logs, runtime errors, analytics, agent traces, protected URLs, deploys,
  purchases, comments and CLI execution stay disabled.
- MCP OAuth tokens remain in OpenCode's local credential store. Never commit,
  print, copy into prompts or send them to another model or service.
- OpenCode CLI tool traces can print MCP arguments even when the model is told
  not to. Capture subprocess output for MCP checks and emit only a sanitized
  final status; never stream raw tool traces into chat, CI logs or Linear.

## Before Code Or Config Changes

Begin each code/config work slice, pre-edit moment, and scope change with an
afstemmingscheck:

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
