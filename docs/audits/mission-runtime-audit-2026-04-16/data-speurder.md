# Runtime-audit: data-speurder
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items hebben `correct`/`correctPosition` + `explanation`. Ronde 4 (conclusies-trekken, select-correct) heeft 8 items waarvan 4 `correct: true` en 4 `correct: false` — evenwichtige verdeling; score-berekening via `scoreSelectCorrect` is correct (penalty per fout-positief).
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste; engine bereikt `'results'` na submit.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — items zijn van redelijke lengte; ronde 4 items hebben iets langere beschrijvingen (data-analyse context) maar geen overflow-risico.
- [PASS] Design tokens — badge-kleur `#3B82F6` (blauw) voor topscore is buiten de standaard lab-palette maar geen technisch probleem.

## Didactiek
- SLO-audit quote: Data-speurder staat niet expliciet in de SLO-audittabel van 2026-03-07. De dichtstbijzijnde audit-entry is "Data Journalist" (J2 P1: 21B, 21C) en "Spreadsheet Specialist" (J2 P1: 21C, 22A). Data-speurder is J2 P1 en dekt datageletterdheid — passend bij SLO 21B (informatie evalueren) en 21C (data verwerken en presenteren).
- UI-koppeling: Ronde 1 (data vs. conclusie, select-correct) is een sterke conceptuele starter. Ronde 2 (grafiekkeuze, order-priority) werkt het best als de leerling al basiskennis heeft van grafiektypen — de staafdiagram-focus is iets smal (enkel "meest/minst geschikt voor staafdiagram" rangschikken). Ronde 3 (eerlijk/misleidend, binary-choice) dekt kritisch datadenken sterk. Ronde 4 (conclusies trekken, select-correct) is didactisch het sterkst — de leerling onderscheidt correlatie van causaliteit op herkenbare schooldata (schermtijd-voorbeeld).

## Bevindingen (severity)
1. [MINOR] Ronde 2 vraagstelling smal — de ronde vraagt de leerling uitsluitend te rangschikken naar "meest geschikt voor staafdiagram", terwijl de instructie `feedbackIncorrect` ook lijndiagram/cirkeldiagram noemt als alternatieven. De `explanation` op items 3 en 4 leert de leerling wel het alternatief, maar de rondevraag stuurt sterk op één grafiektype. Overweeg de description bij te sturen naar "welke grafiekvorm past het best" (open) i.p.v. "meest geschikt voor staafdiagram" — `components/missions/templates/scenario-engine/configs/data-speurder.ts` ronde `grafiek-kiezen` regel 153.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/data-speurder.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
