# Review: wachtwoord-warrior (2026-08-07)

Bestand: `src/features/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts`

## Bevindingen

1. **BLOCKING — gratis oplossing via extraClue (tech/didactiek)**
   `src/features/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts:129` (puzzle `sterk-wachtwoord-maken`, `revealExtraAfterAttempts: 2` op regel 131) toont na 2 foute pogingen gratis het exacte voorbeeld `"Tafel!Oranje9Wolk"`. De validator (regel 133-141) accepteert dit voorbeeld letterlijk (17 tekens, hoofdletter, cijfer, speciaal teken). Een leerling hoeft alleen 2× iets fout in te vullen en kan daarna het voorbeeld copy-pasten voor de volle 25 punten, zonder zelf een wachtwoord te construeren. Dit ondermijnt het leerdoel van precies deze puzzel (zelf een sterk wachtwoord maken) en is de tegenhanger van het motorprobleem "extraClues verklappen gratis wat de hint betaald laat doen" — hier is het zelfs de letterlijke oplossing, niet alleen een aanwijzing.
   *Fix*: extraClue herschrijven naar een uitleg van de opbouw (bv. "denk aan twee losse woorden + cijfer + symbool, bv. type-structuur zonder kant-en-klaar voorbeeld") in plaats van een kant-en-klaar geldig wachtwoord.

2. **Didactiek — ontbrekende waarschuwing "gebruik nooit je echte wachtwoord"**
   `wachtwoord-warrior.ts:118-122` (puzzle `sterk-wachtwoord-maken`) vraagt de leerling een wachtwoord te typen, zonder waarschuwing. De zustermissie `wachtwoord-fortress` (`introDescription`, regel 12 van dat bestand) zegt expliciet: "Let op: gebruik nooit je échte wachtwoord — verzin er hier eentje. Alles blijft in je browser." Wachtwoord-warrior mist die zin bij exact dezelfde soort invoerveld. Niet blocking (geen data wordt server-side opgeslagen voor zover uit deze config blijkt), maar inconsistent en een gemiste kans om veilig gedrag te modelleren.
   *Fix*: dezelfde waarschuwingszin toevoegen aan de `description` van deze puzzel.

## Engine-checklist (motor-bevindingen toegepast op deze config)

- **maxAttempts vs. aantal opties**: alle 3 multiple-choice puzzels hebben 4 opties met `maxAttempts: 3` (kraaktijd, woordenboekaanval, credential-stuffing) — 3 < 4, dus alle knoppen aanklikken garandeert GEEN volle score. Geen probleem.
- **Gratis extraClues vs. betaalde hint**: bij de 3 multiple-choice puzzels verklappen de `extraClues` de kraaktijd-orde-van-grootte en algemene mechanismen, maar niet letterlijk het antwoord-label. Bij puzzle 4 (`sterk-wachtwoord-maken`) is dit wél letterlijk de oplossing zelf — zie bevinding 1 (blocking).
- **Vaste positie juiste antwoord**: kraaktijd → optie 4, woordenboekaanval → optie 2, credential-stuffing → optie 3. Wisselt per puzzel in deze config, dus geen exploiteerbaar patroon binnen wachtwoord-warrior zelf (los van het motorfeit dat er nooit geschud wordt).
- **Vraagt om echt wachtwoord**: geen enkele puzzel eist expliciet een échte wachtwoord-invoer, maar puzzle 4 nodigt door het ontbreken van een waarschuwing er impliciet toe uit (bevinding 2).

## Feitelijke juistheid veiligheidsadvies

Klopt met actuele richtlijnen: nadruk op lengte boven complexiteit-trucs, waarschuwing tegen symboolvervanging-als-schijnveiligheid, credential stuffing/hergebruik, passphrases, wachtwoordmanager. Geen verouderd advies (geen "wissel maandelijks", geen verplichte speciale-tekens-regel als op zichzelf voldoende). Geen fouten gevonden.

## Overlap met wachtwoord-fortress

Complementair, geen duplicaat: `wachtwoord-fortress` verwijst in zijn eigen `introDescription` expliciet terug naar wachtwoord-warrior ("In Wachtwoord Warrior leerde je hoe aanvallers denken — nu ga je dat zelf toepassen"). Warrior = theorie/kennis via quizvragen + één maak-opdracht; Fortress = toepassing via live gesimuleerde aanvallen op een zelfgebouwd wachtwoord. Logische opbouw, geen inhoudelijke doublure — wel is het zaak dat de curriculum-volgorde (beide week 2, yearGroup 2) Warrior vóór Fortress plant, wat consistent is met de tekst in Fortress.

## Verdict

**fix-eerst** — bevinding 1 (gratis letterlijke oplossing via extraClue in een tekst-invoerpuzzel) is blocking en eenvoudig te herstellen zonder herontwerp.
