# Runtime-audit: dashboard-designer
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, pie-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: 2C = laagste cijfer (6,4) + laagste aanwezigheid (89%) ✓
  - q2: 97 − 89 = 8 procentpunt ✓
  - q4: Wiskunde = 28% = grootste segment ✓
  - q5: "Data die laat zien hoe een totaal verdeeld is over categorieën" ✓ (cirkeldiagram)
  - q7: Lijndiagram voor trend over tijd ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0` — dit is een reflectievraag zonder puntentoekenning. Dit is een bewuste keuze (observatie), maar de `maxScore: 100` telt deze punten niet mee. Totaal scorend: q1(15)+q2(15)+q3(10)+q4(10)+q5(15)+q6(10)+q7(15)+q8(0) = 90. maxScore is 100. Gat van 10 punten is niet uitgelegd in config.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4 consistent.
- [PASS] Tabel/grafiek-overflow — pie-chart via SimpleChart, tabel via InteractiveTable (overflow-x-auto).
- [PASS] Design tokens — consistent gebruik van lab-tokens.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - sterke match met datakeuze en productontwerp; voeg een criterium toe voor leesbaarheid en beslisrelevantie." (didactische-audit-2026-03-07, Leerjaar 2 P1)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts` → `['21C', '22A']` — passend: q1-q3 = 21C (dataverwerking), q4-q8 = 22A (productontwerp/visualisatie).
- UI-koppeling: pie-chart dataset verbindt grafiektype direct met de vraag over grafiekkeuze (q5) — goede UI-didactische koppeling. document-cards in dataset 3 dekken Bloom-niveau evalueren (q7: principe toepassen).

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — `maxScore: 100` maar optelling van vraagpunten = 90 (q8 = 0 punten). Leerling kan max 90 scoren maar maxScore zegt 100. Dit kan resulteert in badge-berekening die nooit 100% haalt. — fix: `configs/dashboard-designer.ts` — wijzig `maxScore: 90` OF geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/dashboard-designer.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:100`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ2 P1)
