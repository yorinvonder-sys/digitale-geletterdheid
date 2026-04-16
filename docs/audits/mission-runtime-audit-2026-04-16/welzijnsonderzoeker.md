# Runtime-audit: welzijnsonderzoeker
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, table), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — alle berekeningen geverifieerd:
  - q2: gem. limiet = (4.0+2.5+3.0+1.5+2.0)/5 = 2,6 ✓
  - q4: social media 2,8 uur = hoogste bar ✓
  - q6: correctAnswer = "Meer schermtijd VEROORZAAKT een lagere welzijnsscore" ✓ (niet aflezen uit data)
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [PASS] Terminal states — 3 datasets → na dataset 3 gaat fase naar 'results'. CompletionScreen bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — DataViewer gebruikt `max-w-lg mx-auto` + `px-4`. Werkt op mobiel.
- [PASS] Tabel/grafiek-overflow — InteractiveTable heeft `overflow-x-auto` (zie sub/InteractiveTable.tsx). Bar-chart via SimpleChart.
- [PASS] Design tokens — alle kleuren via `lab-*`/hex tokens consistent met rest van template.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - sterke koppeling aan welzijn en maatschappij; voeg een criterium toe voor bronkwaliteit." (geen directe quote voor welzijnsonderzoeker in didactische-audit; missie verscheen na 2026-03-07)
- SLO-mapping: `slo-kerndoelen-mapping.ts` → `['23B', '21C', '23C']` — passend: q1/q2 = 21C (data-analyse), q6/q7 = 23C (correlatie ≠ causaliteit), dataset 2 = 23B (welzijn).
- UI-koppeling: Bloom niveau 6 (Creëren) is haalbaar via text-observation q3/q5/q7. Tabel-sortering ondersteunt actief analyseren.

## Bevindingen (severity)
1. [WARN] Slug-bug kandidaat — dashboard-baseline.md MAJOR-1 noemt `welzijnsonderzoeker` als missende ROLES-entry. In `ProjectZeroDashboard.tsx` is het `info`-veld aanwezig (regel 282), maar de missie heeft geen `title`-property in ROLES. Controleer of de dashboard-kaart de juiste titel toont of de raw slug. — fix: `config/agents.tsx` of equivalent ROLES-bestand — voeg `title: 'Welzijnsonderzoeker'` toe conform patroon andere missies.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/welzijnsonderzoeker.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- Dashboard: `components/ProjectZeroDashboard.tsx:282`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:180`
- Baseline-BLOCKERs: `docs/audits/mission-runtime-audit-2026-04-16/_dashboard-baseline.md` (niet herhaald)
