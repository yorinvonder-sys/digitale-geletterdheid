# Runtime-audit: ai-bias-detective
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items in alle rondes hebben `correct`/`correctPosition` + `explanation`. Ronde 2 (order-priority) heeft 5 items elk met `correctPosition` (0–4) en `explanation`. Ronde 3 (binary-choice) heeft 6 items alle met `correct` (bool) + `explanation`.
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste; engine bereikt `'results'` na submit van ronde 4.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — items zijn van gemiddelde lengte; de langste beschrijvingen (ronde 1 items 5, 6) zijn ~2-3 regels, binnen kaartgrootte.
- [PASS] Design tokens — badge-kleur `#DC2626` (rood) voor topscore is afwijkend van de standaard `#D97757` maar consistent binnen het thema "eerlijkheidsexpert". Geen technisch probleem.

## Didactiek
- SLO-audit quote: "AI Bias Detective | 21D, 23C | Leerdoel: goed — bias-analyse verbindt AI en maatschappelijke impact sterk; voeg expliciet een verbetering op data of promptniveau toe. Bloom: goed — analyseren/evalueren past goed voor leerjaar 2. Activerend: goed — leerling onderzoekt output en formuleert oplossingen; laat ook 1 tegenvoorbeeld bedenken. Differentiatie: matig — complexiteit van biascases is niet zichtbaar; werk met herkenbare basiscases en een subtiele expertcase."
- UI-koppeling: Ronde 1 (herken bias, select-correct) en ronde 3 (eerlijk of scheef, binary-choice) dekken de analysedimensie van 21D sterk. Ronde 4 (oplossingen, select-correct) vult de "verbetering op data/promptniveau" die de SLO-audit aanbeveelt deels in. Ronde 2 (risicoranking) dekt de maatschappelijke-impact-dimensie van 23C. Echte gedocumenteerde cases (COMPAS, Amazon CV-filter, Joy Buolamwini) versterken de authenticiteit.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
