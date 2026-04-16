# Runtime-audit: ml-trainer
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave2-dataviewer
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, 3 datasets (table, bar-chart, document-cards), questions, answers, badges, takeaways aanwezig
- [PASS] Data/antwoord-consistentie — geverifieerd:
  - q1: spam-e-mails in tabel = ID 1,3,5,7,10 (5 spam) — maar explanation zegt "6 spam en 6 geen spam". Tellen: ID 1 (Spam), 3 (Spam), 5 (Spam), 7 (Spam), 10 (Spam) = **5 spam**, 7 geen spam. De explanation spreekt van "ID 1, 3, 5, 7, 10 en één extra" wat klopt niet. Tabel heeft 12 rijen: 5 spam + 7 geen-spam → correctAnswer 50% klopt NIET (5/12 ≈ 41,7%). DATAFOUT.
  - q4: "Alle features + datum" = 89% = hoogste ✓
  - q5: 88 − 68 = 20 ✓
  - q7: 98% train / 61% test = overfitting ✓
- [N.V.T.] EERSTE_BERICHT — geen enableChat; N.v.t.
- [WARN] q8 heeft `points: 0`. Optelling: q1(15)+q2(15)+q3(10)+q4(10)+q5(15)+q6(10)+q7(15)+q8(0) = 90. maxScore: 100. Gat van 10 punten.
- [PASS] Terminal states — 3 datasets → results bereikbaar.

## Legacy double-registration check
- `MLTrainerMission.tsx` bestaat in `/components/missions/MLTrainerMission.tsx`.
- Dit is een legacy component los van het data-viewer template.
- `config/templateRegistry.ts` toont: `ml-trainer` is NIET aanwezig als expliciete entry in templateRegistry (geen regel gevonden voor ml-trainer in templateRegistry.ts via grep). De DataViewer laadt configs dynamisch via `import('./configs/${missionId}.ts')`, dus de config in `data-viewer/configs/ml-trainer.ts` wordt correct geladen.
- **Risico:** Als `MLTrainerMission.tsx` nog ergens als route geregistreerd is (bijv. via een switch-case buiten templateRegistry), kan dubbele rendering optreden. Verificatie vereist in routing-laag.

## Visueel (code-level)
- [PASS] Responsive — max-w-lg + px-4.
- [PASS] Tabel/grafiek-overflow — InteractiveTable overflow-x-auto; 6-koloms tabel past via scroll.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - modelleren, trainen en evalueren passen sterk; vervang 'hoge accuracy' als hoofdfocus door begrip van keuzes, bias en generalisatie." (didactische-audit-2026-03-07, LJ3 P1)
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:152` → `['22B', '21D', '21C']` — passend: ML-cyclus = 22B, AI-begrip = 21D, feature-engineering = 21C.
- UI-koppeling: Spam-tabel (dataset 1) is de directe databasis voor features/labels-begrip. Bar-chart dataset 2 visualiseert accuracy per model — goede koppeling met q4/q5. document-cards dekken begrippen die in q7/q8 worden bevraagd.

## Bevindingen (severity)
1. [BLOCKER] Data/antwoord-inconsistentie q1 — `correctAnswer: 50` maar de tabel bevat 5 spam-rijen (niet 6) op 12 totaal = 41,7%. Explanation zegt "ID 1, 3, 5, 7, 10 en één extra" maar een zesde spam-rij bestaat niet in de data. Leerling die correct telt (5/12 ≈ 42%) krijgt fout. — fix: `configs/ml-trainer.ts:53` — ofwel voeg een 6e spam-rij toe (ID bijv. 13), ofwel wijzig `correctAnswer: 41.7` + `explanation` aanpassen.
2. [WARN] Legacy MLTrainerMission.tsx bestaat — mogelijke double-registration. Verificeer of `MLTrainerMission.tsx` nog als route actief is buiten templateRegistry. — fix: verwijder of deprecate `components/missions/MLTrainerMission.tsx` als de data-viewer config de actieve versie is.
3. [MINOR] maxScore mismatch — scoreerbare punten = 90, maxScore = 100. — fix: `configs/ml-trainer.ts` — wijzig `maxScore: 90` of geef q8 10 punten.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/ml-trainer.ts`
- Legacy: `components/missions/MLTrainerMission.tsx`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts:152`
- Didactische audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (LJ3 P1)
