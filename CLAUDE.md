# Claude-Specific DGSkills Guidance

Read `AGENTS.md` first. This file only adds Claude-specific routing so Claude
does not load long baton, launch, or reference files by default.

## Lean Startup

`AGENTS.md` § Lean Context Rules geldt onverkort. Aanvullend voor Claude: laad
`.claude/*.md` niet automatisch bij sessiestart, en open alleen het bestand dat
de huidige vraag nodig heeft.

- project context: `.claude/project-context.md`
- nieuwe leerling-opdracht: `.claude/opdracht-eisen.md` — verplicht vóór de eerste
  regel code van een nieuwe of herschreven opdracht
- skill routing: `.claude/skill-router.md`
- kosten, escalatie en afrondingscontrole: `.claude/model-selection.md`
- acceptance checks: `.claude/acceptance-checklist.md`
- workstream/status format: `.claude/workstreams.md`, `.claude/adhd-format.md`

## Security-poort

Is één van deze condities waar, lees dan vóór de eerste edit in `SECURITY-PIPELINE.md`:
`POORT-0`, de sectie hieronder, élke rij in `BEWIJS` die bij die sectie hoort — sommige routes
hebben er meer dan één — en `STOP`. Verder niets.
Staat je wijziging er niet bij, maar is het werk Rood volgens § Risk Labels in `AGENTS.md`
(betalingen, facturen, bankgegevens, webhooks, toestemming): lees `POORT-0` en `STOP`.
Is het werk Groen — teksten, content, styling — dan open je het bestand niet.

| Conditie | Sectie |
|---|---|
| Er verandert iets onder `supabase/migrations/`, of er komt een tabel, kolom, policy of cron-taak bij | `P-DB` |
| Er verandert iets onder `supabase/functions/`, in `supabase/config.toml`, of aan AI-instructies in `src/config/agents/` of `src/config/templateRegistry.ts` | `P-EDGE` |
| Rol-, rechten-, MFA- of routebeveiliging wijzigt, of een Realtime- of Storage-toegang — o.a. `src/services/PermissionService.ts` | `P-AUTH` |
| Er komt een omgevingsvariabele, secret of externe dienst bij, of er wijzigt er één | `P-SECRETS` |
| `vercel.json`, een dependency in `package.json`, `.github/workflows/`, `index.html` of `vite.config.ts` verandert | `P-DEPLOY` |
| De wijziging slaat leerlinggegevens op, toont, logt, exporteert, of stuurt ze naar een extern model | `R-DATA` |
| Er wordt door gebruikers ingevoerde tekst of AI-output op het scherm getoond | `R-FRONT` |
| Een bestaande beveiliging of een controlescript zou zwakker worden — waar dan ook, ook buiten Git | `STOP` |
| Geen van bovenstaande | Niet lezen |

De onderste rijen zijn dragend: de vangnetrij vangt wat geen pad raakt, en het expliciete
"niet lezen" voorkomt dat het bestand elke sessie meeleest. De `STOP`-rij is een uitkomst, geen
beginpunt — je herkent een verzwakking pas terwijl je de route al loopt.

## Stack And Conventions

`AGENTS.md` § Project Shape beschrijft de stack en de mappenindeling. Aanvullend:

- Tailwind: geen `@apply`; gebruik `duck-*` tokens (DUCK English design system)
  voor nieuwe componenten, `lab-*` is legacy.
- Mistral AI en Black Forest Labs calls blijven server-side via Supabase Edge
  Functions.
- State is React hooks + Contexts; geen Redux.
- Productiebuild voor Vercel: `npm run build:prod`.
- Components: PascalCase named exports met `React.FC<Props>` waar de omliggende
  code die stijl al gebruikt.
- Services: camelCase bestandsnamen; edge-functionproxy heeft de voorkeur voor
  AI- en providercalls.
- Hooks: `use*` camelCase.
- Types: PascalCase interfaces in `src/types/` of lokaal in de feature.

## A.L.C.H.E.M.Y. Gate Sequence

For non-trivial design or refactor work, walk these gates in order.
Gates 1–4 design, 5–6 enforce, 7 optimizes (second iteration only).
Audits run in reverse (4 → 1).

| # | Gate | Skill | Output |
|---|---|---|---|
| 1 | Necessity | `functionality-complexity-tradeoff` | PASS / DROP |
| 2 | First principles | `architecture-guidelines` | Smallest correct design |
| 3 | Placement | `morphogenetic-architecture` | Domain / tier / layer per component |
| 4 | Complexity | `structural-simplification` | Component-kinds / dependency-edges / max-chain-depth / module-count Δ |
| 5 | Enforcement | `architecture-as-code` | Per-module config |
| 6 | Shift-left | `defect-shift-left` | Each error path → earliest stage |
| 7 | Optimize | `system-optimization` | Constraint analysis |

### Front-door triage (before the gates)

| Step shape | Action |
|---|---|
| Mechanical + reversible (one file, fits in a sentence, <~30 lines) | **Skip** — implement directly |
| Hides a product / permission / identity decision | **Grill** — run the afstemmingscheck; lock intent in 2 sentences first |
| Hides a *design* (>1 viable shape, high coupling, multi-file, or touches Supabase/RLS/auth/AI) | **Forge** — `rfc-forge` → RFC → then `design-and-refactor` (gates 1–7) |

Rule of thumb: **skip when it's mechanical and reversible; grill when a step hides a decision; forge when a step hides a design.**

Use `design-and-refactor` as the orchestrating skill that sequences these gates automatically.

## Model- en Denkniveau-Selectie

Bepaal vóór iedere taak model + denkniveau op complexiteit, risico en
verificatie. Meld dat bij de eerste taak van een sessie in één regel, en opnieuw
zodra het taaktype wisselt:

`Classificatie: <model> <niveau> — <reden in max 8 woorden>`

Projectspecifieke ondergrenzen (de rest staat in `.claude/model-selection.md`):

- Supabase, auth, rollen, sessies, migraties, CI/CD, Vercel-config: **Opus 5
  `high`** minimaal — ook voor subagents die dit raken.
- Onafhankelijke eindreview: Opus 5 `xhigh`, nooit dezelfde agent die schreef.
- Haiku 4.5 nooit voor code die gemerged wordt (200K context).
- Fable 5 niet in deze repo (stand juli 2026): de securityclassifier geeft
  false positives op auth/RLS-werk en routeert stil door naar een zwakker
  model, tegen dubbel tarief. Herbeoordeel als dat aantoonbaar is opgelost.
- `high` is de default; `max` is niet veiliger. Houd antwoorden en
  Markdown-deliverables kort: geen vulsecties, geen herhaalde samenvattingen.

Volledige tabellen (modelpalet, taakclassificatie, subagent-keuze), kostenregel,
escalatie en zelfevaluatie: `.claude/model-selection.md` — open bij twijfel,
niet standaard.

## Claude Workflow Notes

- Default language is Dutch unless code/docs context is English.
- Keep visible status concise: one task at a time, clear proof, no giant lists.
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
- Security overview: `SECURITY.md`, `docs/security/`, and compliance docs under
  `business/nl-vo/compliance/`
- Supabase-specific guidance: `supabase/CLAUDE.md`

## MCP Hints

- Supabase: schema, logs, migrations, edge function context.
- Tavily or web search: use only when current external facts are needed.
- Sequential thinking: use only for genuinely complex reasoning chains.
- Linear: gebruik altijd het DGSkills-board (team `DGS`) als taaktracker. Verplaats de
  bijbehorende taak bij elke fase naar de juiste status: Backlog → Todo → In Progress →
  In Review → Done. Nieuwe taken starten in Backlog. Notion is legacy en wordt niet meer
  bijgewerkt.
