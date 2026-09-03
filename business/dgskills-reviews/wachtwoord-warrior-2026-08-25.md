# Review: Wachtwoord Warrior — 2026-08-25

**templateType:** puzzle-lab

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

- De vier puzzels vormen een logische opbouw (kraaktijd → symboolvervanging → credential stuffing → zelf een sterk wachtwoord maken), met duidelijke feedback per antwoord en een goed gekozen badge-drempelreeks (0/40/70/90).
- **Blocking (gedeeld met engine, raakt deze missie):** de drie multiple-choice-puzzels hebben elk 4 opties en `maxAttempts: 3`. Een leerling die blind klikt, heeft 3 kansen op 4 opties en slaagt bijna altijd binnen de score-drempel — de puzzel test dan niets. Zie engine-bevinding "scoring" (PuzzleLab.tsx:131).
- **Warning:** de hint-knop (`hintCost: 4` of `2`) kost punten voor aanwijzingen die — volgens de gedeelde engine-bevinding — na het onthullen van extraClues al gratis onder de puzzel staan. Voor deze missie is dat met name puzzel `sterk-wachtwoord-maken` relevant, waar hints juist zouden moeten helpen bij het zelf formuleren.
- **Info:** de badge-kleuren zijn consistent met de duck-palet-conventie (geen bevinding).

## Didactiek — score 7/10

- Sterke leerdoelformulering: van "waarom is dit zwak" naar "maak zelf een sterk wachtwoord" — bouwt kennis op naar toepassing (Bloom: begrijpen → toepassen).
- De validator voor `sterk-wachtwoord-maken` is inhoudelijk goed doordacht: lengte, hoofdletter, cijfer, speciaal teken, geen herhaalde tekens, geen los herkenbaar woord. Dit is een van de betere text-input-validators in de sweep.
- **Warning:** de leerdoel-drempel (`min: 3` rounds-complete van de 4 puzzels) staat los van de gok-kwetsbaarheid hierboven — een leerling kan de drempel halen zonder de stof te begrijpen. Dit is didactisch een probleem: het cijfer meet dan giscompetentie, niet kennis over wachtwoordbeveiliging.
- **Info:** `extraClues` bij `sterk-wachtwoord-maken` geeft bewust géén kant-en-klaar wachtwoord (voorkomt kopiëren) — goede didactische keuze.

## Tech — score 7/10

- Config is intern consistent: `missionId` komt overeen in templateRegistry, slo-kerndoelen-mapping, curriculum en missionGoals; `missionGoals.ts`-tekst is een nette parafrase van de config zonder tegenstrijdigheden.
- De regex-validator (`(.)\1{2,}` en het `letterBlocks`-check) is robuust voor de bedoelde afwijzingsgevallen; geen ReDoS-risico (geen geneste kwantoren op userinvoer).
- **Blocking (gedeeld, raakt deze missie):** zonder `onRetry` op CompletionScreen kan een leerling die onder de 40%-drempel blijft (bijv. na drie mislukte pogingen op alle MC-puzzels) vastlopen op een uitgeschakelde knop — engine-bevinding, niet in deze config zelf op te lossen.
- **Warning:** `hintCost: 4` bij de eerste twee puzzels (25 punten) is relatief hoog (16% van de puzzelscore per hint) t.o.v. `hintCost: 2` bij de laatste — geen bug, maar een inconsistente balans die de moeite waard is om te herzien.

## Voorstellen

1. **MC-puzzels gokbestendiger maken** (mission-eigen mitigatie, los van de engine-fix): verlaag `maxAttempts` naar 2 zodat blind gokken op 4 opties minder vaak slaagt.

```ts
// voor
maxAttempts: 3,
points: 25,

// na
maxAttempts: 2,
points: 25,
```

2. **Hint-kosten consistenter maken** over de vier puzzels:

```ts
// voor (puzzel 1 en 2)
hintCost: 4,

// na
hintCost: 3,
```

## Samenvatting

Wachtwoord Warrior is inhoudelijk een van de sterkere puzzle-lab-missies: heldere opbouw, een goed doordachte validator voor het zelf-maken van een wachtwoord, en consistente config-wiring over alle vier bronbestanden. De blokkerende problemen (gokbestendigheid, vastloop-knop zonder onRetry, hint-knop zonder informatiewinst) zitten in de gedeelde puzzle-lab-engine en zijn niet mission-specifiek op te lossen; deze missie erft ze wel. Verdict: **fix-eerst** — wacht op de engine-fix (onRetry + score-penalty), de mission-eigen `maxAttempts`-verlaging kan los daarvan alvast mee.

**Verdict: fix-eerst**
