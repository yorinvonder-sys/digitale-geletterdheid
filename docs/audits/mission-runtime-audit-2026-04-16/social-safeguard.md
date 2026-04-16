# Runtime-audit: social-safeguard
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items in alle rondes hebben `correct`/`correctPosition` + `explanation`. Ronde 3 (binary-choice, 6 items) heeft ook `explanation` op elk item inclusief nuance (bv. item 5: "Niet doen" ondanks `correct: false`).
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste ronde; bereikbaar na alle 4 rondes.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — items zijn van gemiddelde lengte; geen extreme teksten.
- [PASS] Design tokens — badge-kleur `#EF4444` (rood) voor topscore is functioneel en consistent met het "Online Beschermer"-thema; geen afwijking van design-systeem.

## Didactiek
- SLO-audit quote: "Social Safeguard | 23A, 23B | Leerdoel: goed — directe match met veiligheid en digitale keuzes; voeg expliciet een meldroute binnen school toe. Bloom: goed — analyseren/evalueren/toepassen past sterk bij scenario-onderwijs in leerjaar 1. Activerend: goed — scenario's dwingen tot keuze en onderbouwing; voeg een rollenspel of peerbespreking toe. Differentiatie: matig — niet zichtbaar welke scenario's lichter of zwaarder zijn; werk met niveau 1/2/3-incidenten."
- UI-koppeling: Ronde 2 (order-priority, SAFE-ACT protocol) is bijzonder sterk: de leerling leert de juiste volgorde van handelen bij pesten, wat direct `analyseren + toepassen` op Bloom-niveau is. Ronde 4 (privacy-instellingen select-correct) verdiept 23A. Ronde 1 en 3 dekken herkenning en besluitvorming (23B). De meldroute binnen school wordt gedekt in ronde 3 item 3 (fysieke bedreiging → 0900-8844) maar niet structureel als vast protocol — consistent met SLO-auditadvies.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/social-safeguard.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
