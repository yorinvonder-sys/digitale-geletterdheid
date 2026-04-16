# Runtime-audit: ux-detective
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: "Huiswerk niet vinden in menu" = leerlingen 1, 4, 10 = 3× = meest voorkomend ✓
  - q2: navigatie-rijen = leerling 1 (ernst 5), leerling 4 (ernst 5), leerling 5 (ernst 3). Gemiddelde: (5+5+3)/3 = 4,33 → correctAnswer: 4.3 ✓ (5% tolerantie in scoreQuestion dekt dit)
  - q4: Magister (61) + Itslearning (55) zijn beide onder 68 ✓
  - q5: 78 − 55 = 23 ✓
  - q7: feedback-principe ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(10)+q5(15)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — InteractiveTable met 5 kolommen; overflow-x-auto aanwezig.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - gebruikservaring analyseren en verbeteren past goed bij product en media; voeg een criterium toe voor toegankelijkheid." (didactische-audit-2026-03-07, LJ2 P3)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:124` → `['22A', '21B']` — passend: UX-analyse = 22A (productontwerp), bronkritiek/informatie beoordelen = 21B.
- UI-koppeling: Gebruikersfeedback-tabel is direct bewijsmateriaal voor q1-q3. SUS-score bar-chart in dataset 2 koppelt aan q4/q5/q6. document-cards in dataset 3 geven definitiebasis voor q7/q8. Sterke didactische keten: observeren → meten → principes toepassen.

## Bevindingen (severity)
1. [MINOR] maxScore mismatch — scoreerbare punten = 90, maxScore = 100. Badge-berekening nooit 100% haalbaar. — fix: `configs/ux-detective.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/ux-detective.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:124`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ2 P3)
