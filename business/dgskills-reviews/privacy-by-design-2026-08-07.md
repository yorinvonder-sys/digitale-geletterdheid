# Review: privacy-by-design (2026-08-07)

## Open punt vorige ronde — bevestigd
`config.missionGoal` (privacy-by-design.ts:159-167) wint altijd van `getMissionGoal()` (missionGoals.ts:468-476), via de vaste patroon `config.missionGoal ?? getMissionGoal(config.missionId)` (SimulationLab.tsx:265). De leerling ziet dus de inline tekst uit privacy-by-design.ts. De entry in missionGoals.ts is dode code.

Verschil: `primaryGoal` en `criteria` zijn identiek in beide bronnen; alleen `evidence` wijkt af:
- Inline (privacy-by-design.ts:166): "Keuzes rond profielzichtbaarheid, app-permissies en cookie-instellingen."
- missionGoals.ts:475: "Je kunt per simulator uitleggen welke instelling meer of minder data deelt en waarom."

Advies: verwijder de missionGoals.ts-entry óf verwijder `missionGoal` uit de config zodat één bron canoniek is.

## Engine-checklist (simulation-lab, vaststaand)
- Prediction-vragen: N.v.t. — alle 9 vragen zijn `type: 'multiple-choice'` (privacy-by-design.ts:217,232,247,280,291,306,342,357,373), geen `'prediction'`-type gebruikt. Het permanente resultaatpaneel blokkeert dus niets hier.
- Vraag zonder `options`: geen — alle 9 vragen hebben een `options`-array met 4 items.
- `correctAnswer` als getal: geen — alle `correctAnswer`-waarden zijn strings die exact overeenkomen met een optie-tekst (geverifieerd voor alle 9 vragen).
- Dubbele optieteksten: geen gevonden binnen dezelfde vraag.
- Positie van het juiste antwoord: verspreid over de opties (2e, 4e, 2e, 2e, 2e, 1e, 2e, 2e, 2e) — niet altijd dezelfde positie, dus geen patroon-gok mogelijk.

## AVG-juistheid
- privacy-by-design.ts:316: "Data minimalisatie is een AVG-recht (AVG = de Europese privacywet)". Dit is feitelijk onnauwkeurig: dataminimalisatie is een **beginsel/verplichting** voor de verwerkingsverantwoordelijke (AVG art. 5 lid 1 sub c), geen "recht" — rechten onder de AVG zijn de rechten van de betrokkene (inzage, correctie, vergetelheid, etc.). De inhoudelijke boodschap (geef apps niet meer toegang dan nodig) klopt, maar het label "recht" is verwarrend en leert leerlingen een verkeerde term.
- Overige uitleg (cookies, permissies, locatiedata) is inhoudelijk correct en passend vereenvoudigd voor de doelgroep.
- Geen echte persoonsgegevens in voorbeelden; leerlingen wordt nergens gevraagd eigen gegevens in te vullen.
- Aansluiting bij leefwereld 13-14-jarigen: concreet (sociale media, apps, cookies), niet abstract.

## Bevindingen
**Tech**
- privacy-by-design.ts:159-167 vs missionGoals.ts:468-476 — dubbele, licht afwijkende bron voor missionGoal; missionGoals.ts-entry is dode code (zie open punt hierboven).

**Didactiek**
- privacy-by-design.ts:316 — "AVG-recht" i.p.v. "AVG-beginsel/principe" voor dataminimalisatie; corrigeer de term.

**Design**
- Geen blocking bevindingen. Sim 1 heeft een `followUp`-vraag, sim 2 en 3 niet — inconsistent maar geen blocker.

## Verdict
fix-eerst — twee kleine, snel te fixen punten (terminologie AVG + dode-code opruiming), geen herontwerp nodig.
