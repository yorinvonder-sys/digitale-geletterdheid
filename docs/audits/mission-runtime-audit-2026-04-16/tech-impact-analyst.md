# Runtime-audit: tech-impact-analyst
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: ernst-score 5 = veiligheid, privacy, democratie = 3 domeinen ✓
  - q2: algoritmische bias door niet-representatieve trainingsdata ✓
  - q4: EU = 78 = hoogste ✓
  - q5: 78 − 38 = 40 ✓
  - q7: Stap 3 (risico's analyseren) = eerste serieuze risico blootlegging ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(10)+q5(10)+q6(10)+q7(15)+q8(0) = 85. maxScore: 100. Gat van 15 punten — groter dan andere missies.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — 5-koloms tabel (domein, positief, negatief, ernst, zekerheid); overflow-x-auto aanwezig.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - technologie-uitleg en impactanalyse passen sterk; voeg expliciet stakeholders toe in het rapportformat." (didactische-audit-2026-03-07, LJ3 P3)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:178` → `['23C', '21D']` — passend: maatschappelijke impact = 23C, AI-begrip/impact = 21D.
- UI-koppeling: Impact-matrix tabel dekt q1/q3 direct via sorteren op ernst. AI-regulering bar-chart ondersteunt q4/q5. document-cards geven stappenplan dat in q7 wordt bevraagd.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — scoreerbare punten = 85, maxScore = 100. Gat van 15 punten — dit is het grootste gat in de wave. — fix: `configs/tech-impact-analyst.ts` — wijzig `maxScore: 85` of verdeel 15 punten over open vragen.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:178`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ3 P3)
