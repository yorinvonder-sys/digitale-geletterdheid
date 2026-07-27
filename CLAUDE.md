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

### Front-door triage (before the gates)

| Step shape | Action |
|---|---|
| Mechanical + reversible (one file, fits in a sentence, <~30 lines) | **Skip** — implement directly |
| Hides a product / permission / identity decision | **Grill** — run the afstemmingscheck; lock intent in 2 sentences first |
| Hides a *design* (>1 viable shape, high coupling, multi-file, or touches Supabase/RLS/auth/AI) | **Forge** — `rfc-forge` → RFC → then `design-and-refactor` (gates 1–7) |

Rule of thumb: **skip when it's mechanical and reversible; grill when a step hides a decision; forge when a step hides a design.**

Use `design-and-refactor` as the orchestrating skill that sequences these gates automatically.

## Model- en Denkniveau-Selectie

Bepaal vóór iedere taak zelf welk model en denkniveau past, op basis van
complexiteit, risico en benodigde verificatie. Deze standaard geldt
repository-breed; domein-`CLAUDE.md`'s voegen alleen een strengere ondergrens toe
(geen herhaling van deze tabel).

### Sessiestart-check (verplicht, elke nieuwe sessie)

Bij de eerste taak van een sessie: bepaal expliciet model + denkniveau vóór de
eerste tooluitvoering, en meld dat in één regel. Herhaal de check zodra het
taaktype wisselt (bijv. van copy naar auth) — niet bij elke deelstap.

Formaat: `Classificatie: <model> <niveau> — <reden in max 8 woorden>`

Ontbreekt de informatie om te classificeren, vraag dat vóór uitvoering, niet
erna.

### Modelpalet

| Model | Kies bij |
|---|---|
| Haiku 4.5 | Bulkwerk, classificatie, goedkope read-only subagents. Let op: 200K context i.p.v. 1M. Nooit voor code die gemerged wordt. |
| Sonnet 5 | Teksten, docs, styling, afgebakende componentwijzigingen, repetitief onderhoud. |
| Opus 5 | Standaard voor echte codewijzigingen en alles in de kritieke domeinen. |
| Fable 5 | Niet gebruiken in deze repo (stand juli 2026). De securityclassifier geeft hoge false positives op auth-, RLS- en security-adjacent werk en routeert dan stil door naar een zwakker model — precies de kritieke domeinen van dit project, tegen dubbel tarief ($10/$50 vs $5/$25). Opus 5 scoort bovendien hoger op codeerbenchmarks. Herbeoordeel als de false-positive-rate aantoonbaar is opgelost. |

### Taakclassificatie

| Model + niveau | Wanneer |
|---|---|
| Sonnet 5 low/medium | Teksten, documentatie, eenvoudige styling, kleine componentwijzigingen, repetitief werk, duidelijk afgebakend onderhoud. |
| Opus 5 low | Standaard voor normale codewijzigingen, overzichtelijke bugs, reguliere implementatie. |
| Opus 5 medium | Complexe features, frontendinteracties, animaties, state-samenwerking, normale PR-reviews, wijzigingen over meerdere bestanden. |
| Opus 5 high | Supabase, auth, rollen, sessies, dependencies, CI/CD, Vercel-config, performanceproblemen, architectuur, moeilijk reproduceerbare regressies. |
| Opus 5 xhigh | Grote productie-impact, complexe securityvragen, dependencyconflicten, database-/datamigraties, regressies over meerdere systemen of branches. Ook: agentische codeertaken over veel bestanden. |
| Opus 5 max | Zelden. Alleen wanneer correctheid zwaarder weegt dan kosten én latency, en er geen tweede reviewer beschikbaar is. |

Denkniveau-gebruik in de praktijk:

- `high` is de default; ga daar niet standaard boven zitten.
- Voor agentisch codeerwerk begin je op `xhigh` en werk je omláág zodra het werkt.
- `low` en `medium` presteren op Opus 5 uitzonderlijk goed tegen een fractie van
  de tokens. Test omlaag voordat je omhoog escaleert.
- `max` is niet "veiliger" — het leidt vaker tot overthinking en diminishing
  returns. Een onafhankelijke tweede reviewer op `xhigh` is sterker dan één
  reviewer op `max`.
- Op `xhigh`/`max`: reken op een ruim outputbudget, anders kapt het werk af.

### Agents en subagents

Kies model + denkniveau per subagent apart; erf niet automatisch het niveau van
de hoofdsessie.

- Zoeken, inventariseren, read-only verkenning: Haiku 4.5 of Sonnet 5, `low`.
- Implementerende subagent op niet-kritieke code: Opus 5 `low`/`medium`.
- Subagent die auth, RLS, migraties of productieconfiguratie raakt: Opus 5
  `high` minimaal — dezelfde ondergrens als de hoofdsessie.
- Onafhankelijke eindreview: Opus 5 `xhigh`, en het mag niet dezelfde agent zijn
  die de wijziging schreef.
- Delegeer alleen wanneer de opbrengst de overhead overtreft. Een subagent
  herbouwt zijn context, rapporteert terug, en jij leest die rapportage — voor
  een paar bestandslezingen of een simpele edit is dat verlies. Gebruik geen
  subagent om je eigen werk te verifiëren; verificatie hoort in de hoofdloop.

### Kostenregel

Beoordeel totale taakkosten, niet prijs per token. Opus 5 low/medium kan
goedkoper zijn dan Sonnet high/xhigh wanneer het minder herstelpogingen,
redeneertokens en toolrondes kost. Kies Sonnet voor eenvoudig volume; Opus
wanneer de taak werkelijk redeneerkwaliteit vereist.

### Beknoptheid

Opus 5 schrijft standaard langere antwoorden én langere bestanden dan eerdere
modellen. Een lager denkniveau lost dat niet op — dat vergt een expliciete
instructie. Houd zichtbare antwoorden kort en beperk Markdown-deliverables tot
de inhoud: geen vulsecties, geen herhaalde samenvattingen, geen boilerplate.

### Zelfevaluatie vóór uitvoering

Bepaal kort — sluit aan op de Front-door triage hierboven: taaktype; impact bij
een fout; omkeerbaarheid; betrokken kritieke domeinen; onzekerheden; benodigd
model + denkniveau; vereiste tests/bewijs; of onafhankelijke review nodig is.

### Escalatieregels

- Verhoog het denkniveau bij nieuwe onzekerheid, onverwachte dependency-effecten,
  productie-impact of securityrisico.
- Verlaag het niveau niet enkel om kosten te besparen zolang relevante risico's
  niet onderzocht zijn.
- Meer denkvermogen vervangt nooit runtimeproeven, tests, directe
  configuratiecontrole of onafhankelijke review.
- Groen bouwen, linten of `npm audit` bewijst geen runtimecompatibiliteit of
  veiligheid.
- Verifieer kritieke claims via de echte downstream consumer en het werkelijk
  bereikbare productiepad.
- Een model mag zijn eigen kritieke wijziging niet als enige reviewer goedkeuren.
- Voor auth, RLS, security, dependencies, migraties en productieconfiguratie is
  een onafhankelijke read-only eindreview verplicht vóór merge.
- Wijzig draft/ready-status, merge-status, externe configuratie of productie
  alleen als de gebruiker daar expliciet om vraagt.

### Zelfevaluatie ná uitvoering

Geen aparte verificatieronde en geen "dubbelcheck je werk"-instructies — die
leiden tot over-verificatie. Verifieer tijdens het werk en controleer vóór
afronding alleen dit: zijn alle eisen echt uitgevoerd; welke claims zijn direct
bewezen versus alleen afgeleid; draaien de tests écht in CI (en kunnen
branchnamen of conditionele workflows dat omzeilen); welke risicopaden en
configuratiescopes zijn ongetest gebleven; is een onafhankelijke reviewer nodig
vóór merge.

### Rapportage

Houd zichtbare rapportage kort. Vermeld alleen: gekozen classificatie (als
relevant); uitgevoerd bewijs/tests; resterende onzekerheden; nodige
onafhankelijke review; en een duidelijke conclusie — gereed / gereed onder
voorwaarden / niet gereed.

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
