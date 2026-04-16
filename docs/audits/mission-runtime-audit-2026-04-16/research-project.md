# Runtime-audit: research-project
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: < 2u = 7,4 → > 8u = 5,8 → dalende trend = "meer schermtijd hangt samen met lager welzijn" ✓
  - q2: 42 − 6 = 36 procentpunt ✓
  - q4: meta-analyse = 95 = hoogste ✓
  - q5: 80 − 45 = 35 ✓
  - q7: "Hoeveel uur zitten jongeren van 13-15 jaar per dag op TikTok in 2025?" ✓ (specifiek, beantwoordbaar, open)
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(10)+q5(15)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — 5-koloms onderzoekstabel; bar-chart onderzoeksmethoden via SimpleChart.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: (missie niet aanwezig in didactische-audit-2026-03-07 als expliciete rij in LJ3 P4; mapping via slo-kerndoelen-mapping.ts)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:188` → `['21B', '21C', '23C']` — passend: onderzoeksvaardigheden = 21B, dataverzameling/-verwerking = 21C, maatschappelijke context = 23C.
- UI-koppeling: Welzijnsdataset (n=200) met standaarddeviatie-kolom brengt echte onderzoeksdata in beeld — goed voor Bloom-niveau analyseren (q1/q2). Bar-chart levels of evidence is visueel directe ondersteuning bij q4/q5. document-cards geven stappenplan dat in q7 wordt getest.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — scoreerbare punten = 90, maxScore = 100. — fix: `configs/research-project.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/research-project.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:188`
