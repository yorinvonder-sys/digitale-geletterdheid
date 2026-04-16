# Runtime-audit DGSkills — Master-Index (volledig)

- **Datum:** 2026-04-16
- **Scope:** alle 89 missies (78 template + 11 legacy) + sanity-check `data-verzamelaar`
- **Tooling:** Playwright MCP (dashboard smoke-test), Sonnet 4.6 (10 audit-agents), Codex GPT-5.4 (eindreview)
- **Dev-server:** http://localhost:3000 (Vite, bestaand proces)
- **Login:** `yorinvonder+audit-leerling@gmail.com` (leerling, klas 1)

## Samenvatting (TL;DR)

- **92 rapporten geschreven** in deze directory. 1 missie is MISSING (`data-verzamelaar` — stond in inventory als goudstandaard, bestaat niet in de codebase).
- **8 BLOCKERs** (3 dashboard-niveau, 5 missie-specifiek) — leerlingen kunnen deze niet zinvol voltooien.
- **2 zware systemische patronen** raken 20+ missies tegelijk (patroon-A BuilderCanvas, DebateArena chat-bug).
- **Alle 3 referentiemissies uit mission-inventory:**
  - `privacy-by-design` — **PASS ✓** (simulation-lab)
  - `network-navigator` — **PASS ✓** (data-viewer)
  - `data-verzamelaar` — **MISSING ✗** (component weg, alleen preview-stub)

## Status per wave

| Wave | Scope | #Missies | Status | BLOCKERs | MAJORs |
|------|-------|---------:|--------|---------:|-------:|
| Baseline | Dashboard cross-cutting | — | ✅ | 3 | 1 |
| 0 | Top-20 prioriteit (3 Sonnet batches) | 20 | ✅ | 0 | 7 |
| 1 | ScenarioEngine/PuzzleLab/SimLab/ReviewArena/DebateArena/ToolGuide | 34 | ✅ | 0 | 4 + 3 patroon |
| 2A | BuilderCanvas deel 1 | 7 | ✅ | 1 | 7 (patroon-A) |
| 2B | BuilderCanvas deel 2 | 7 | ✅ | 0 | 7 (patroon-A, allemaal FAIL) |
| 2C | DataViewer resterend | 11 | ✅ | 2 | patroon maxScore |
| 2D | Legacy | 12 + MISSING-check | ✅ | 2 | 3 |
| **Totaal** | — | **92 rapporten** | ✅ | **8** | 30+ |

## Cross-cutting BLOCKERs (alle leerlingen elke load)

Zie [_dashboard-baseline.md](_dashboard-baseline.md).

1. **BLOCKER** `public.assessment_results` tabel ontbreekt — 3×404 per dashboard-load. Code verwacht oude tabel; database heeft alleen `nulmeting_results`. Fix in `services/assessmentService.ts`.
2. **BLOCKER** `classroom_configs?id=eq.Klas+1` → 406 wegens `.single()` + ontbrekende row. Fix via `.maybeSingle()` of auto-seed.
3. **BLOCKER** `student_activities.mission_id` kolom bestaat niet — activity-logging faalt bij elke missie-start. Fix via migratie of rename in `services/teacherService.ts:235`.
4. **MAJOR** `notificatie-ninja` slug-bug — al geflagd 2026-04-15, niet opgelost. `ROLES` entry ontbreekt. Ook `digitale-balans-coach`, `online-helden`, `welzijnsonderzoeker` mogelijk.

## Systemische patronen

### Patroon-A — BuilderCanvas STEP_COMPLETE onvolledig (~14 missies)

**Status: Universeel in BuilderCanvas-template.** Elke missie heeft 4 config-stappen, maar systemInstruction bevat meestal alleen `STEP_COMPLETE:1`. Stappen 2-4 kunnen nooit via AI-marker worden afgerond. Bij sommige missies staat tot `STEP_COMPLETE:3`; bij ≥ 7 missies alleen `STEP_COMPLETE:1`.

**Geraakt (bevestigd):** `app-prototyper`, `digital-storyteller`, `video-editor`, `api-architect`, `open-source-contributor`, `website-bouwer`, `web-developer`, `podcast-producer`, `brand-builder`, `meme-machine`, `automation-engineer`, `startup-simulator`, `innovation-lab`, `portfolio-builder`, `prototype-developer`, `pitch-perfect`, `meesterproef`, `mission-blueprint`, `mission-vision`.

**NB over discrepantie:** Wave 0 agents rapporteerden "STEP_COMPLETE max 3" voor 5 missies; Wave 2 agents rapporteerden "alleen STEP_COMPLETE:1". Codex-eindreview moet dit nuanceren — óf Wave 0 was minder strikt, óf de bug verschilt per missie.

**Fix:** voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe per missie in `supabase/functions/_shared/systemInstructions.ts`.

### Patroon-B — ReviewArena: enableChat=false maar systemInstruction bestaat (7 missies)

Dode AI-prompts: `data-review`, `code-review-2`, `media-review`, `code-reviewer`, `security-review`, `advanced-code-review`, `impact-review`. Niet schadelijk, wel onderhoudsschuld.

### Patroon-C — DebateArena: enableChat=true maar template rendert GEEN chat (8 missies)

**MAJOR structurele bug.** 6/7 DebateArena-configs hebben `enableChat: true` in registry, maar `DebateArena.tsx` implementeert geen `StudentAIChat`. De `TemplateMissionRouter.tsx` geeft `enableChat` niet door. Chat-knop verschijnt nooit.

**Geraakt:** `digital-rights-defender`, `future-forecaster`, `schermtijd-coach`, `scroll-stopper`, `ai-ethicus`, `tech-court`, `policy-maker`, `reflection-report`.

### Patroon-D — DataViewer: maxScore 100 maar ~90 scoreerbaar (8 missies)

Structureel patroon: laatste reflectievraag (q8) heeft `points: 0`. Leerling kan nooit 100/100 scoren.

**Geraakt:** `dashboard-designer`, `data-pipeline`, `ux-detective`, `digital-divide-researcher`, `tech-impact-analyst`, `sustainability-scanner`, `research-project`, +1.

### Patroon-E — ToolGuide: `\n` wordt niet gerenderd (2+ missies)

In `ToolGuide.tsx:82-98` `RichText`-component rendert newlines niet. Impact op missies met lijstopmaak via `\n`: `mission-launch`, `startup-pitch` hard geraakt.

## Top BLOCKERs (missie-specifiek, priority-ordered)

| # | Missie | Probleem | Fix |
|---|--------|----------|-----|
| 1 | `game-director` | XP wordt NOOIT toegekend bij completion. Use `handleMissionComplete` in plaats van `handleExitModule`. | `AuthenticatedApp.tsx:506` |
| 2 | `data-verzamelaar` | Component bestaat niet meer, alleen preview-stub. Stond in inventory als goudstandaard. | Bouwen óf uit curriculum verwijderen |
| 3 | `website-bouwer` | `systemInstructions.ts` mist entry — chat faalt volledig ondanks `enableChat:true` | Add entry |
| 4 | `ml-trainer` q1 | Correct answer = 50%, dataset = 5/12 = 41,7%. Correcte leerling krijgt fout. | Fix q1 in `ml-trainer.ts` config |
| 5 | `eindproject-j2` | `enableChat:true` staat in `templateRegistry.ts` maar niet in config — chat-knop verschijnt nooit | Add `enableChat:true` to config |

## Alle missie-rapporten

Zie individuele `<mission-id>.md` bestanden in deze directory (92 totaal).

**Status-overzicht per batch (Wave 0+1+2):**

### Top-20 prioriteit (Wave 0)

16 WARN, 4 PASS, 0 FAIL, 0 MISSING

### Wave 1 — 34 missies

- ScenarioEngine (9): 7 PASS, 2 WARN, 1 MAJOR (`phishing-fighter.wrongFeedback`)
- PuzzleLab+SimulationLab (8): 7 PASS, 1 WARN, goudstandaard `privacy-by-design` ✓
- ReviewArena+DebateArena (10): 10 WARN (patroon-C is MAJOR voor 6 debate-missies)
- ToolGuide (7): 4 PASS, 3 WARN, 1 MAJOR (RichText `\n` rendering)

### Wave 2 — 37 missies

- BuilderCanvas (14): 0 PASS, 6 WARN, 8 FAIL — **template-wide patroon-A**
- DataViewer (11): 1 PASS (goudstandaard `network-navigator`), 10 WARN, 2 BLOCKERs
- Legacy (12): 6 PASS, 4 WARN, 1 FAIL (`game-director`), `data-verzamelaar` MISSING

## Verificatie-status

- ✅ **Sanity-check referentiemissies:** 2/3 PASS (privacy-by-design, network-navigator). 1 MISSING (data-verzamelaar).
- ✅ **Cross-check P0-fixes (commit 32173c9):** geen regressies waargenomen.
- 🔄 **Codex GPT-5.4 eindreview:** draait op moment van schrijven. Focus: verifieer patroon-A inconsistentie Wave 0 vs Wave 2, valideer spreadsheet-specialist q4 bug, cross-check ml-trainer q1 telbug.
- ⏳ **Runtime spot-check:** top-3 BLOCKERs worden in browser geverifieerd na Codex-review (dashboard-baseline is al bevestigd in de browser; `game-director`, `ml-trainer` q1 en `eindproject-j2` chat staan gepland).

## Aanbevolen vervolg

**Top-5 fixes voor Yorin (grootste impact eerst):**

1. **Patroon-A** — fix `STEP_COMPLETE` voor alle 19 BuilderCanvas-missies tegelijk. Eén PR met gestandaardiseerde system-instruction template.
2. **Patroon-C** — fix DebateArena: OF chat-implementatie toevoegen in `DebateArena.tsx`, OF `enableChat` uit de registry halen voor de 6 debate-missies.
3. **Dashboard BLOCKERs** — repair `assessment_results`, `classroom_configs`, `student_activities.mission_id` — één migratie + service-update.
4. **Missie-specifieke BLOCKERs** — `game-director` XP-bug, `data-verzamelaar` bestaat niet, `ml-trainer` q1, `website-bouwer` chat, `eindproject-j2` chat.
5. **Patroon-D maxScore** — reflectie q8 telt 0 in 8 DataViewer-missies. Ontwerp-keuze of bug? Oordeel.
