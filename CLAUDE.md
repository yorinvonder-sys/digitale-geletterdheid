# Claude-Specific DGSkills Guidance

Read `AGENTS.md` first. This file only adds Claude-specific routing so Claude
does not load long baton, launch, or reference files by default.

## Lean Startup

- Do not auto-load `.claude/*.md` at session start.
- Open only the file needed for the current request:
  - project context: `.claude/project-context.md`
  - skill routing: `.claude/skill-router.md`
  - acceptance checks: `.claude/acceptance-checklist.md`
  - workstream/status format: `.claude/workstreams.md`,
    `.claude/adhd-format.md`
  - previous-work continuation only: `.claude/current-task.md`,
    `.claude/task-queue.md`, `.claude/progress-log.md`
- Do not read `LAUNCH-PLAN.md` unless the user asks for launch-plan work.
- Start broad investigations with `npm run context:budget`, then inspect only
  the paths that matter.

## Stack And Conventions

- React 19 + TypeScript + Vite.
- Supabase for auth, database, edge functions, and RLS.
- Tailwind inline classes, no `@apply`; use `duck-*` tokens (DUCK English design system) for new components; `lab-*` tokens are legacy.
- Mistral AI en Black Forest Labs calls stay server-side through Supabase Edge Functions.
- Vercel deployment uses `npm run build:prod`.
- State is React hooks + Contexts; no Redux.
- Components: PascalCase named exports with `React.FC<Props>` where the local
  codebase already uses that style.
- Services: camelCase filenames; edge function proxy preferred for AI/provider
  calls.
- Hooks: `use*` camelCase.
- Types: PascalCase interfaces in `types/` or local feature types.

## A.L.C.H.E.M.Y. Gate Sequence

For non-trivial design or refactor work, walk these gates in order.
Gates 1–4 design, 5–6 enforce, 7 optimizes (second iteration only).
Audits run in reverse (4 → 1).

| # | Gate | Skill | Output |
|---|---|---|---|
| 1 | Necessity | `functionality-complexity-tradeoff` | PASS / DROP |
| 2 | First principles | `architecture-guidelines` | Smallest correct design |
| 3 | Placement | `geometric-architecture` | Domain / tier / layer per component |
| 4 | Complexity | `structural-simplification` | Component-kinds / dependency-edges / max-chain-depth / module-count Δ |
| 5 | Enforcement | `architecture-as-code` | Per-module config |
| 6 | Shift-left | `defect-shift-left` | Each error path → earliest stage |
| 7 | Optimize | `system-optimization` | Constraint analysis |

Use `design-and-refactor` as the orchestrating skill that sequences these gates automatically.

## Claude Workflow Notes

- Default language is Dutch unless code/docs context is English.
- Keep visible status concise: one task at a time, clear proof, no giant lists.
- Follow the `AGENTS.md` model-routing rule: Claude may plan/review, but should
  prefer DeepSeek for bounded implementation when a safe DeepSeek bridge or
  working `DEEPSEEK_API_KEY` is available. Choose `deepseek-v4-flash` for small
  mechanical executor work and `deepseek-v4-pro` for larger bounded executor
  work. Never expose or commit the key.
- Use `.claude/adhd-format.md` only for Claude operator sessions or when the
  user explicitly asks for that workflow.
- Use `.agents/skills/skales-agentic-fintech-engineering/SKILL.md` for Skales,
  fintech, auth/admin, payments, invoices, personal data, compliance, or
  beginner-safe explanation work.
- Use project-local skills from `.agents/skills/` only when their trigger
  clearly applies; do not load generic references preemptively.

## Reference Pointers

- **Docs overview**: `docs/README.md` — centrale navigatie-index voor alle documentatie
- **Pedagogisch fundament**: `docs/pedagogy/README.md` — frameworks, rubric en missie-audit
- AI context strategy: `docs/architecture/agent-context-strategy.md`
- Feature-domain rules: `src/features/AGENTS.md` and local
  `src/features/<domain>/AGENTS.md`
- Security overview: `SECURITY.md`, `docs/security/`, and compliance docs under
  `business/nl-vo/compliance/`
- Supabase-specific guidance: `supabase/CLAUDE.md`

## MCP Hints

- Supabase: schema, logs, migrations, edge function context.
- Tavily or web search: use only when current external facts are needed.
- Sequential thinking: use only for genuinely complex reasoning chains.
- Notion: gebruik altijd het Kanban-board als taaktracker. Bij elke Notion-interactie (lezen of schrijven) de bijbehorende taak naar de juiste kolom verplaatsen: Backlog → In Progress (Coding) → Review → Done. Nieuwe taken starten in Backlog.
