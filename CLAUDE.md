# Claude-Specific DGSkills Guidance

Read `AGENTS.md` first. This file only adds Claude-specific routing so Claude
does not load long baton, launch, or reference files by default.

## Lean Startup

`AGENTS.md` section Lean Context Rules applies unchanged. Do not auto-load
`.claude/*.md`; open only the file required by the current task.

- project context: `.claude/project-context.md`
- skill routing: `.claude/skill-router.md`
- effort, escalation and final checks: `.claude/model-selection.md`
- acceptance checks: `.claude/acceptance-checklist.md`
- workstream/status format: `.claude/workstreams.md`, `.claude/adhd-format.md`

## Stack And Conventions

`AGENTS.md` section Project Shape describes the stack and directories. In
addition:

- Tailwind: no `@apply`; use `duck-*` tokens for new components, `lab-*` is
  legacy.
- Mistral AI and Black Forest Labs calls remain server-side through Supabase
  Edge Functions.
- State is React hooks and Contexts; no Redux.
- Vercel production build: `npm run build:prod`.
- Components use PascalCase named exports and follow the surrounding local style.
- Services use camelCase filenames; prefer an edge-function proxy for AI calls.
- Hooks use `use*`; types use PascalCase in `src/types/` or local feature types.

## A.L.C.H.E.M.Y. Gate Sequence

For non-trivial design or refactor work, walk these gates in order. Gates 1-4
design, 5-6 enforce, and 7 optimizes only after a stable first iteration.

| # | Gate | Skill | Output |
|---|---|---|---|
| 1 | Necessity | `functionality-complexity-tradeoff` | PASS / DROP |
| 2 | First principles | `architecture-guidelines` | Smallest correct design |
| 3 | Placement | `geometric-architecture` | Domain / tier / layer |
| 4 | Complexity | `structural-simplification` | Four-axis delta |
| 5 | Enforcement | `architecture-as-code` | Machine-enforced boundary |
| 6 | Shift-left | `defect-shift-left` | Earliest defect gate |
| 7 | Optimize | `system-optimization` | Iteration-two constraint analysis |

Front-door triage:

| Step shape | Action |
|---|---|
| Mechanical and reversible | Implement directly |
| Hides a product, permission or identity decision | Run the afstemmingscheck |
| Multiple viable shapes, high coupling, or Rood | Design first, then run the gates |

Use `design-and-refactor` as the orchestrating skill.

## Claude Model Policy

`AGENTS.md` is the model and effort source of truth. Claude Code is invoked only
through `scripts/agent-runtime/claude-delegate.mjs` so model, effort, tools, data
classification and worktree boundary are explicit.

- Use Opus 5 for Claude review and isolated implementation.
- Use Opus 4.8 `xhigh` only as the independent ordinary-release reviewer.
- Use Fable 5 `max` only as one of two blind security-incident reviewers.
- Never use Sonnet, Haiku, `default`, `best` or `opusplan`; never configure a
  cross-family fallback.
- Claude build mode requires a clean disposable `claude/**` worktree and may not
  use Bash, Glob, Write, push, commit, merge, deploy or production credentials.
  Read and Edit use deny-first absolute rules generated from the filesystem root
  so only the packet's validated existing `ALLOWED_PATHS` remain accessible; the
  parent wrapper also rejects any resulting diff outside that slice and Sol
  verifies it.
- Claude review modes are tool-less and can inspect only the sanitized evidence
  packet. They cannot browse the repository, home directory, MCP or network.
- Ordinary-release evidence must be a mode-0600 regular file, bind to the exact
  clean `COMMIT_SHA`, and match the worktree `HEAD` before Opus 4.8 runs.
- Claude review output is untrusted input. Sol verifies cited evidence before
  integrating a finding.
- If the requested model is unavailable or its quota is exhausted, fail closed
  and return the task to Sol. Never silently substitute another family.

## Claude Workflow Notes

- Default language is Dutch unless code or docs context is English.
- Keep visible status concise: one task at a time, clear proof, no giant lists.
- Use `.claude/adhd-format.md` only for explicit Claude operator workflows.
- Load project skills only when their trigger clearly applies.
- Linear is the task tracker. Notion is legacy and is not updated.

## Reference Pointers

- Docs overview: `docs/README.md`
- Pedagogy: `docs/pedagogy/README.md`
- Agent context: `docs/architecture/agent-context-strategy.md`
- Security: `SECURITY.md`, `docs/security/`, `business/nl-vo/compliance/`
- Supabase: `supabase/CLAUDE.md`

## MCP Hints

- Linear: keep the existing DGSkills issue current without sensitive details.
- Supabase: schema, logs, migrations and edge context; treat as Rood.
- Tavily or web search: only for current external facts.
- Sequential thinking: only for genuinely complex reasoning chains.
