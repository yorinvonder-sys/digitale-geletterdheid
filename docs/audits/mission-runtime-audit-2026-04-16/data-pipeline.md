# Runtime-audit: data-pipeline
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: rijen met probleem = rij 2 (duplicaat), rij 3 (missend), rij 4 (inconsistent+fout), rij 5 (verkeerd datum), rij 6 (-50W) = 5 ✓
  - q2: imputation (vervangen door gemiddelde omliggende) ✓
  - q4: 47,8 − 21,6 = 26,2 ✓
  - q7: imputatie voor missende temp ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0` — zelfde patroon als dashboard-designer. Optelling vraagpunten: q1(15)+q2(15)+q3(10)+q4(15)+q5(10)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — InteractiveTable overflow-x-auto; 5-koloms tabel (timestamp, lokaal, temp, stroom, probleem) past op mobiel via scroll.
- [PASS] Design tokens — kleuren consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - ETL-denken en datakwaliteit zijn helder zichtbaar; voeg expliciet validatiecriteria toe voor de output." (didactische-audit-2026-03-07, Leerjaar 3 P1)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:155` → `['21C', '22B']` — passend: datakwaliteit + ETL = 21C, transformatiestrategieën + algoritmisch denken = 22B.
- UI-koppeling: Tabel met probleem-kolom is de primaire data voor q1/q2/q3. Bar-chart voor/na vergelijking dekt q4/q5 direct. document-cards als referentie bij strategie-vraag q7 — sterke UI-didactische koppeling.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — `maxScore: 100` maar scoreerbare punten = 90. Badge-berekening nooit 100% haalbaar. — fix: `configs/data-pipeline.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/data-pipeline.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:155`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ3 P1)
