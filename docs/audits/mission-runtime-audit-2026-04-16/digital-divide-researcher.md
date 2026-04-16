# Runtime-audit: digital-divide-researcher
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: 75+ = laagste internetgebruik (58%) EN laagste basisvaardigheden (32%) ✓
  - q2: 97 − 32 = 65 procentpunt ✓
  - q4: 98 − 62 = 36 procentpunt ✓
  - q5: (98+96+91+87+82+68+62)/7 = 584/7 = 83,43 → correctAnswer: 83.4 ✓ (5% tolerantie dekt dit)
  - q7: "Digitale vaardigheden in het onderwijs" ✓ (structureel voor kinderen)
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(15)+q5(10)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — InteractiveTable 5 kolommen met overflow-x-auto.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - digitale ongelijkheid en aanbevelingen passen sterk bij maatschappij en keuzes; voeg expliciet een criterium toe voor bronkwaliteit." (didactische-audit-2026-03-07, LJ3 P3)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:177` → `['23C', '21B']` — passend: digitale ongelijkheid = 23C (maatschappij), data/bronnen evalueren = 21B.
- UI-koppeling: CBS-tabel met kwetsbaar-kolom maakt directe visuele matching mogelijk bij q1. Europese bar-chart ondersteunt berekeningen bij q4/q5. document-cards bieden beleidscontext voor afwegingsvraag q7/q8.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — scoreerbare punten = 90, maxScore = 100. — fix: `configs/digital-divide-researcher.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:177`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ3 P3)
