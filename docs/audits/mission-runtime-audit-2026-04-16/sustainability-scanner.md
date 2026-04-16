# Runtime-audit: sustainability-scanner
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, pie-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: Bitcoin-transactie = 700.000 gram = veruit hoogste ✓
  - q2: 1,8 × 97 = 174,6g/dag × 7 = 1.222,2g/week → correctAnswer: 1222.2 ✓
  - q4: 28+18+15 = 61% hernieuwbaar ✓
  - q5: aardgas = 22% = grootste niet-hernieuwbaar ✓
  - q7: "Verleng de levensduur van je apparaat" ✓ (70-80 kg > jaar streaming ~64 kg)
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(10)+q2(20)+q3(10)+q4(15)+q5(10)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — 5-koloms CO2-tabel; pie-chart via SimpleChart.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - milieu-impact en keuzes passen goed; voeg expliciet een verband toe met levensduur, e-waste of energieverbruik." (didactische-audit-2026-03-07, LJ2 P4)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:141` → `['23C']` — passend: duurzaamheid als maatschappelijke keuze. Opmerking: de audit-notitie (`-23B`) is bewust aangebracht; 23B (welzijn) is niet direct aanwezig.
- UI-koppeling: CO2-tabel met vergelijkingskolom maakt de impact tastbaar (q2 rekenvraag). Pie-chart energiemix ondersteunt q4/q5 direct. document-cards geven handelingsperspectief bij q7/q8.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — scoreerbare punten = 90, maxScore = 100. — fix: `configs/sustainability-scanner.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/sustainability-scanner.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:141`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ2 P4)
