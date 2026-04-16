# Runtime-audit: code-denker
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items hebben `correct`/`correctPosition` + `explanation`. Ronde 4 (patroonherkenning, select-correct) heeft 8 items waarvan 6 `correct: true` en 2 `correct: false` — score-berekening is asymmetrisch (`scoreSelectCorrect`: penalty -4 per fout-positief) maar klopt. Leerling met alle 8 correct geselecteerd minus de 2 foutieve = 6/6 correct, 0 fouten = score 25. Intern consistent.
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste; engine bereikt `'results'` na submit.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — items zijn van gemiddelde lengte; pindakaas-algoritme in ronde 2 heeft iets langere beschrijvingen maar geen overflow-risico.
- [PASS] Design tokens — badge-kleur `#7C3AED` (paars) voor topscore is een accentkleur buiten de standaard lab-palette maar geen technisch probleem.

## Didactiek
- SLO-audit quote: Code-denker staat niet expliciet in de SLO-audittabel van 2026-03-07. De dichtstbijzijnde missie is "Algorithm Architect" (J2 P2: 22B). Code-denker is J1 P2 en dekt computational thinking introductie — passend bij SLO 22B (informatica-vaardigheden, algoritmen) en 21D (AI verkennen als verlengstuk van CT).
- UI-koppeling: Vier rondes dekken elk één CT-concept: decompositie (select-correct), algoritme-volgorde (order-priority), abstractie (binary-choice), patroonherkenning (select-correct). Dit is een sterk didactisch ontwerp — elke ronde heeft een enkelvoudig leerdoel. De pindakaas-analogie in ronde 2 is een klassieke onderwijsaanpak voor algoritme-uitleg; toegankelijk voor J1.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/code-denker.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
