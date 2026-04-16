# Runtime-audit: digital-forensics
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle items hebben `correct`/`correctPosition` + `explanation`. Ronde 2 (order-priority, tijdlijn bouwen) heeft 5 items elk met oplopende `correctPosition` (0–4) die exact de tijdlijn van het simulatieincident weergeven — intern consistent.
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 4 is de laatste; engine bereikt `'results'` na submit.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [PASS] Overflow — ronde 1 bevat technische logregel-notatie in de `description` (bv. `22:54:10 | LOGIN FAILED | user: admin`). Dit is plain text in een `<p>`-element; geen `<code>`-opmaak. Op smalle schermen kan de logtekst wrappen of afgekapt raken zonder horizontale scroll. Geen rendering-break maar visueel suboptimaal voor technische content.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: "Digital Forensics | 23A, 21A | Leerdoel: goed — tijdlijnanalyse en conclusievorming passen goed; voeg expliciet een criterium toe voor bewijs versus aanname. Bloom: goed — analyseren/evalueren is passend voor leerjaar 3. Activerend: goed — leerling reconstrueert actief wat is gebeurd; zeer passend. Differentiatie: matig — bewijsvoering kan lastig zijn; bied een gestructureerde tijdlijn-template voor basis en een vrijere analyse voor verdieping."
- UI-koppeling: Ronde 3 (feit-of-aanname, binary-choice) implementeert precies het didactische criterium "bewijs versus aanname" dat de SLO-audit aanbeveelt. Ronde 2 (tijdlijn bouwen, order-priority) is authentiek voor 23A forensisch werk. Ronde 4 (forensisch protocol, select-correct) biedt procedurele kennis over chain of custody. De missie dekt 21A (informatiesystemen) via de systeemloganalyse en 23A (veiligheid) via de aanvalscyclus.

## Bevindingen (severity)
1. [MINOR] Logregel-tekst in `description` van ronde 1 items (bv. `22:54:10 | LOGIN FAILED | user: admin`) is plain text zonder `<code>`-wrapper. Engine toont dit als gewone tekst — technische leesbaarheid is suboptimaal op mobiel. Fix: gebruik `\`code\`` markdown of voeg een `codeBlock?: string` veld toe aan `ScenarioItem` — `components/missions/templates/scenario-engine/configs/digital-forensics.ts` ronde `verdachte-logregels`.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/digital-forensics.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
