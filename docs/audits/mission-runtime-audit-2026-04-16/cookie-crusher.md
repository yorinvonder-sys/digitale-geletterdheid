# Runtime-audit: cookie-crusher
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle 8 items in ronde 1, alle 8 items in ronde 3, alle 8 items in ronde 4 hebben `correct` (bool) + `explanation`. Ronde 2 (order-priority) heeft `correctPosition` + `explanation` op alle 5 items.
- [N.V.T.] EERSTE_BERICHT — `enableChat` afwezig; geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste ronde (index 3); `handleNextRound` in de engine zet phase naar `'results'` wanneer `nextIndex >= config.rounds.length`. Alle paden eindigen in de CompletionScreen.

## Visueel (code-level)
- [PASS] Responsive — ScenarioEngine gebruikt `max-w-md mx-auto p-4`; de engine-wrapper is mobiel-first en responsief.
- [PASS] Overflow — choice-cards in `SelectCorrectRound` en `BinaryChoiceRound` tonen `title` (kort) + `description` (max ~2 regels); geen ongewoon lange strings aangetroffen.
- [PASS] Design tokens — kleuren `#D97757`, `#10B981`, `#6B6B66`, `#FAF9F0` consistent met engine-defaults.

## Didactiek
- SLO-audit quote: "Cookie Crusher | 23C, 21B | Leerdoel: matig — inhoud raakt ook 23A en 21C door tracking en toestemming; vul die expliciet aan in doelen of rubric. Bloom: goed — analyseren past goed en is concreet genoeg voor leerjaar 1. Activerend: goed — herkennen onder tijdsdruk werkt activerend; voeg een stap toe waarin de leerling de beste keuze ook motiveert."
- UI-koppeling: Ronde 1 (select-correct, dark patterns herkennen) + ronde 2 (order-priority, rangschikken van manipulatie) dekt de analysedimensie van SLO 23C goed. Ronde 3 (binary-choice, scenario's) + ronde 4 (select-correct, data op het spel) versterken 21B maar raken 23A (beveiliging) en 21C (dataverwerking) niet expliciet — consistent met de SLO-auditbevinding "leerdoel: matig".

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/cookie-crusher.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
