# Runtime-audit: neural-navigator
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave0-batchC
- Status: WARN

## Speciaal: double-registration check

**Bevinding:** Zowel een template-config (`components/missions/templates/data-viewer/configs/neural-navigator.ts`) als een legacy component (`components/missions/NeuralNavigatorMission.tsx`, ~54KB) bestaan.

**Welke wordt gebruikt?**
- `config/templateRegistry.ts:74` registreert `'neural-navigator': { templateType: 'data-viewer' }` — dit is de actieve route.
- `TemplateMissionRouter.tsx` routeert op basis van templateRegistry → DataViewer template wordt geladen.
- `NeuralNavigatorMission.tsx` wordt **nergens geïmporteerd** — geen enkel .tsx/.ts bestand (buiten het bestand zelf) importeert de export `NeuralNavigatorMission`. Het is dode code.
- `config/agentRoleIds.ts:77` heeft 'neural-navigator' als role-id, maar ook dat is de template-route.

**Conclusie:** Geen double-registration bug in productie. DataViewer-template is de actieve implementatie. NeuralNavigatorMission.tsx is volledig ontkoppeld maar neemt ~54KB op in de bundel indien niet tree-shaken.

## Functioneel (code-level)
- [PASS] Config compleet — missionId, introEmoji, introTitle, introDescription, 3 datasets (table/bar-chart/document-cards), maxScore, badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — DataViewer heeft intro → dataset-loop → results; data-viewer configs sturen geen expliciete phases maar werken via dataset-index
- [N.V.T.] EERSTE_BERICHT — neural-navigator heeft geen enableChat; geen chatRoleId in DataViewerConfig; N.V.T.
- [PASS] STEP_COMPLETE ≥ 3 — N.V.T. voor data-viewer; scoring via correcte antwoorden per question (8 questions, totaalscore 90 punten + 0-pt open vraag)
- [PASS] Verificatievragen — 8 vragen over 3 datasets: 3 number-input, 3 multiple-choice, 2 text-observation; correctAnswer aanwezig voor alle gesloten vragen

## Visueel (code-level)
- [PASS] Responsive — DataViewer volgt standaard max-w-md layout
- [PASS] Overflow — document-cards gebruiken `grid` layout; bar-chart via chartData array zonder pixel-sizes
- [PASS] Design tokens — badges consistent (#EC4899, #8B5CF6, #3B82F6, #6B6B66)

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Neural Navigator | 21D, 22B | Leerdoel: goed - neuron, netwerk en backpropagation zijn kerninhoudelijk sterk; voeg een expliciete koppeling toe aan interpretatie van modeluitkomsten. [...] Differentiatie: matig - wiskundige belasting kan groot zijn; bied rekensteun voor basis en extra lagen/activatiefuncties voor verdieping."
- UI-koppeling: Dataset 1 (forward pass berekening) geeft directe koppeling aan modeluitkomsten. Audit-aanbeveling voor visualisatie-opdracht ("leerlingen tekenen zelf relaties") is niet geïmplementeerd; dataset 3 toont lagen als document-cards maar vraagt geen tekenactiviteit. Rekensteun voor basis ontbreekt.

## Bevindingen (severity)
1. [MAJOR] Dode code — `NeuralNavigatorMission.tsx` (~54KB) is volledig losgehangen van de routering maar niet verwijderd. Risico: Vite/tree-shaking elimineert het waarschijnlijk, maar het onderhoud van twee implementaties met dezelfde missionId `'neural-navigator'` in useMissionAutoSave kan bij toekomstige refactor tot save-state-conflicten leiden — fix: verwijder of archiveer `components/missions/NeuralNavigatorMission.tsx`
2. [MINOR] Scoregat — totaal van question.points = 90 (20+10+10+15+10+10+15+0), maar maxScore = 100. 10 punten zijn theoretisch onbereikbaar — fix: `components/missions/templates/data-viewer/configs/neural-navigator.ts` (herbalanceer points of zet maxScore op 90)

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/neural-navigator.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- Legacy (dode code): `components/missions/NeuralNavigatorMission.tsx`
- Routing: `config/templateRegistry.ts:74`
- SLO-audit-row: "Neural Navigator | 21D, 22B | Leerdoel: goed [...] Differentiatie: matig" (`docs/audits/didactische-audit-missies-2026-03-07.md:130`)
