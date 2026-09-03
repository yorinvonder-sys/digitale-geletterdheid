# Wachtwoord Fortress — Rubric Review

**Datum:** 2026-08-25
**templateType:** password-fortress

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7.5/10

De missie heeft een sterke, consistente vertelling (vier opeenvolgende aanvallers, oplopende dreigingsniveaus) en duidelijke visuele voortgang via de fortmeter/badges. Bevindingen zijn engine-gedragen, niet missie-specifiek:

- **Warning** — de uitslag (score, voortgangsstip) wordt al zichtbaar vóórdat de aanvalsanimatie is afgelopen (engine, `PasswordFortress.tsx:263`). Dit ondermijnt de opbouw die de missie-config juist met de `story`-teksten per ronde probeert op te bouwen.
- **Info** — badge-drempels (90/70/40/0) sluiten logisch aan bij `maxScore: 100` en `pointsPerRound: 25`; geen probleem.

## Didactiek — score 8/10

De vier rondes bouwen didactisch consequent op (brute-force → woordenboek → leetspeak → credential stuffing), elke ronde heeft een heldere `story`, twee stapsgewijze hints en een `clearedLesson` die de kernles herhaalt. De `takeaways` dekken alle vier de lessen plus een praktisch handelingsperspectief (passphrase, wachtwoordmanager). `missionGoal.criteria.min: 3` met expliciete tekst "de laatste ronde is altijd verplicht" is een goed doordacht ontwerp.

- **Blocking (engine-gedragen, niet in deze config-file te fixen)** — de missie-config belooft in `missionGoal.criteria.description` dat de laatste ronde verplicht is, maar de engine (`PasswordFortress.tsx:341`) checkt alleen `cleared.length >= 3` zonder te verifiëren dat `ronde-credential-stuffing` daadwerkelijk is gehaald. Een leerling kan ronde 4 overslaan en toch als geslaagd worden gemarkeerd — dit ondermijnt precies de didactische kern van de missie (credential stuffing is de zwaarste, meest realistische les). Dit is een bevinding over de gedeelde engine, niet over deze missieconfig; wordt niet als autoFixable opgenomen omdat de whitelist geen engine-bestanden toestaat.
- **Info** — de snelste winnende strategie (willekeurige 14 kleine letters) haalt alle vier rondes zonder dat de leerling de hints hoeft te lezen (engine-bevinding `fortressEngine.ts:283`); geen missie-specifieke fix mogelijk binnen de config.

## Tech — score 8/10

De missieconfig zelf (`wachtwoord-fortress.ts`) is technisch schoon: types kloppen (`PasswordFortressConfig`), `targetSeconds` berekeningen zijn consistent met `DAY`/`YEAR`-constantes, `attacks`-arrays bouwen logisch op, en registry/SLO/curriculum/missionGoals-entries zijn onderling consistent (zelfde `primaryGoal`, `criteria.min: 3`, evidence-tekst komt overeen).

- **Blocking (engine, niet deze config)** — CompletionScreen krijgt geen `onRetry` mee (`PasswordFortress.tsx:333`); een leerling die onder de 40% scoort (bijvoorbeeld 1 ronde = 25%) komt in een doodlopend scherm met uitgeschakelde knop terecht. Ook dit is een gedeelde-engine-bevinding, geen missie-config-bevinding.
- Overige engine-bevindingen (focusbeheer, live-regio, contrast, state-herstel-validatie) zijn al vastgesteld in de engine-review en gelden voor elke missie die deze template gebruikt, inclusief deze.

## Voorstellen

Geen mechanische voor/na-fixes binnen de missie-config-whitelist voor deze missie: alle blocking- en warning-bevindingen zitten in de gedeelde engine (`PasswordFortress.tsx`, `fortressEngine.ts`), niet in `wachtwoord-fortress.ts` of de registry/SLO/curriculum/missionGoals-entries. Die entries zijn intern consistent en vereisen geen wijziging.

## Samenvatting & verdict

De missie-eigen content (verhaal, hints, lessen, doelstelling, registry-koppelingen) is van goede kwaliteit en didactisch sterk opgebouwd. De kritieke problemen — doodlopend scherm onder 40%, verplichte laatste ronde niet afgedwongen, voortijdige verklapping van de uitslag — zitten allemaal in de gedeelde `PasswordFortress`-engine en gelden voor de hele template, niet specifiek voor deze missie. Verdict: **fix-eerst** (engine-niveau), missie-config zelf behoeft geen wijziging.
