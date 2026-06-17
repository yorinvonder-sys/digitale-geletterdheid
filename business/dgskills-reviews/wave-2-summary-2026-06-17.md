# DGSkills Batch Review — Wave 2 (samenvatting)

- **Datum:** 2026-06-17
- **Modus:** sweep (worst-first, high-band)
- **Wave-grootte:** 5 missies (de 5 slechtste resterende high-priority missies, `triageScores.total = 6`)
- **Uitvoering:** 1 Sonnet review-agent per missie (alle 3 rubrics in één pass), Opus orchestratie
- **Branch:** `fix/batch-review-wave-2` (gestapeld op wave-1 / PR #83)
- **Codex-gate:** ALLOW op de enige missie met fixes (access-control-engineer)

## Resultaten

| Missie | design | didactiek | tech | triage | verdict | auto-fixes | escalaties | Codex |
|---|---|---|---|---|---|---|---|---|
| access-control-engineer | 7 | 7 | 8 | 2.1 | fix-eerst | **4** | 2 | ALLOW |
| ai-beleid-brainstorm | 7 | 6 | 7 | 2.1 | fix-eerst | 0 | 4 | n.v.t. |
| code-denker | 8 | 7 | 9 | 2.1 | fix-eerst | 0 | 2 | n.v.t. |
| data-speurder | 8 | 7 | 9 | 1.37 | fix-eerst | 0 | 3 | n.v.t. |
| notificatie-ninja | 7 | 7 | 8 | 1.5 | ok | 0 | 3 | n.v.t. |

(scores 0–10; triage = gewogen `(10-d)*0.3 + (10-di)*0.4 + (10-t)*0.3`, hoog = slechter)

## Toegepaste auto-fixes (alleen access-control-engineer)

1. Ontbrekend `missionGoals`-entry toegevoegd in `src/config/missionGoals.ts` — waarden 1-op-1 uit de component-lokale `MISSION_GOAL`. (zelfde patroon als wave-1)
2. 4 onzichtbare hover-knoppen gefixt: `text-duck-ink` → `text-white` op `bg-duck-ink` (donker-op-donker).
3. Onzichtbaar AI-coach-icon gefixt: `text-duck-ink` → `text-white` op `bg-duck-ink`-cirkel.
4. Ongebruikte `Lightbulb`-import verwijderd.

`typecheck:app` groen. Codex adversariële review: ALLOW, geen materiële bevindingen.

## Openstaande escalaties (handmatig — Yorin beslist)

Gerangschikt: gedeelde-engine > SLO > content/didactiek > overig.

| Missie | Categorie | Beschrijving | Bestand |
|---|---|---|---|
| data-speurder | **gedeelde engine** | `FeedbackBanner` "Volgende ronde"-knop: `text-white` op `duck-acid` ≈ WCAG 1.3:1 (onleesbaar). **Raakt ALLE scenario-engine missies.** | `.../scenario-engine/sub/FeedbackBanner.tsx` |
| ai-beleid-brainstorm | SLO | Inconsistentie: `ProjectZeroDashboard` toont `23B` vs centrale mapping `21D/23C` | `src/features/student/ProjectZeroDashboard.tsx` |
| access-control-engineer | SLO | `22B` (Programmeren) geclaimd zonder programmeeractiviteit | `src/config/slo-kerndoelen-mapping.ts` |
| code-denker | content/SLO | `missionGoal` noemt "voorwaarden" die de missie niet behandelt — reword voorgesteld (before/after in rapport) | `src/config/missionGoals.ts` |
| data-speurder | content/SLO | Ontbrekende `learningObjectives` — AI-voorstel klaar, maar SLO-content → Yorin keurt | `.../configs/data-speurder.ts` |
| notificatie-ninja | content/didactiek | Ronde 4: absolute claim over apps verwijderen — nuance voorgesteld | `.../configs/notificatie-ninja.ts` |
| ai-beleid-brainstorm | design | `lab-coral`/`lab-teal` → duck (coral→rood = visuele identiteitswijziging) | `src/config/agents/year1.tsx` |
| ai-beleid-brainstorm | structureel | `aria-label` stemknop (buiten missie-whitelist); `studentName` niet opgeslagen in `ai_beleid_feedback` (teacher-rapportage-gap) | `.../AiBeleidBrainstormPreview.tsx`, `teacherService.ts` |
| access-control-engineer | structureel | Cognitieve load stap 2: 24 toggle-buttons voor leerjaar 2 (herontwerp) | `.../AccessControlEngineerMission.tsx` |
| notificatie-ninja | didactiek | Ronde 2: 8 items = te hoge cognitieve load leerjaar 1; `showConfidence` ontbreekt | `.../configs/notificatie-ninja.ts` |

**Belangrijkste signaal:** de gedeelde `FeedbackBanner` contrast-bug is engine-breed — één fix raakt elke scenario-engine missie. Aanrader voor een aparte engine-PR.

## Voortgang

- Status: **4 fixes-applied / 11 reviewed / 83 pending** (98 totaal)
- High-priority: 10 (wave-1) + 5 (wave-2) gedaan → **16 high-band resterend**
- **Wave-3 queue (worst-first):** digital-storyteller, privacy-by-design, video-editor, wachtwoord-warrior, ai-ethicus

## Per-missie rapporten

- `business/dgskills-reviews/access-control-engineer-2026-06-17.md`
- `business/dgskills-reviews/ai-beleid-brainstorm-2026-06-17.md`
- `business/dgskills-reviews/code-denker-2026-06-17.md`
- `business/dgskills-reviews/data-speurder-2026-06-17.md`
- `business/dgskills-reviews/notificatie-ninja-2026-06-17.md`
