# Rubric-review: Welzijnsonderzoeker

**Datum:** 2026-08-25
**templateType:** data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — 8/10
Consistent met het duck-token-palet (`#202023` basis, `#ff3c21` en `#e1ff01` als accenten in de staafgrafiek). Geen mission-specifieke designfouten gevonden. De generieke placeholder-contrastkwestie in `InteractiveTable.tsx` en het ontbreken van `aria-live` op de woordenteller zijn al vastgelegd in de gedeelde engine-bevindingen (data-viewer) en worden hier niet dubbel gescoord.

Geen bevindingen specifiek voor deze missieconfig.

## Didactiek — 7/10
- Sterk: het onderscheid correlatie/causaliteit wordt drie keer geoefend (q1, q6, q7) met steeds een concrete tegenvoorbeeld-redenering (bijv. P04 met limiet maar toch 4.0u; april-uitzondering in de trendtabel). De uitleg bij elk antwoord bouwt telkens verder op de data in plaats van het antwoord te herhalen.
- Zwak: de `keywords`/`minKeywords` van de open vragen bieden weinig gokbescherming, ondanks dat de engine zelf (per gedeeld rapport) scoring al gokbestendig heeft gemaakt op enginesniveau — de mission-config ondermijnt dat met te losse trefwoorden:
  - `woz-q3-limiet-tevredenheid` (regel 110): keywords `['p04', 'garandeert', 'uitzondering', 'tevreden', 'ontevreden']`, `minKeywords: 1`. De vraag zelf gaat expliciet over "tevredenheid" — een leerling die simpelweg het woord "tevreden" of "ontevreden" uit de vraag terug typt zonder de tabel te lezen, haalt al het punt.
  - `woz-q7-correlatie-causaliteit` (regel 220): keywords `['toetsdruk', 'toetsen', 'vakantie', 'andere factoren', 'andere']`. Het woord "andere" op zichzelf is zo algemeen dat vrijwel elke zin met "andere reden"/"andere oorzaak" al telt, ook zonder dat de leerling de contextkolom (toetsdruk/vakantie) daadwerkelijk gebruikt — terwijl de vraag expliciet vraagt om de contextkolom te gebruiken.

## Tech — 8/10
De config zelf is structureel in orde: `maxScore` (100) klopt met de som van de puntentelling in de header-comment en de badge-drempels (0/40/65/85) sluiten aan op de `score-threshold`-drempel van 65 in `missionGoals.ts`. Cross-references kloppen:
- `templateRegistry.ts:72` → `data-viewer` ✓
- `slo-kerndoelen-mapping.ts:189` → 23B/21C/23C ✓ (consistent met comment in config)
- `curriculum.ts:298` → leerjaar 3, periode "Technologie en de toekomst" ✓
- `missionGoals.ts:719` → threshold 65 ✓

Geen mission-specifieke techfouten gevonden. De blocking-bevindingen uit de gedeelde engine (dode resultatenscherm onder 40%, `clearSave()` vóór bevestigde server-opslag) gelden voor élke data-viewer-missie inclusief deze — al vastgelegd in de gedeelde engine-review, hier niet herhaald als losse bevinding.

## Voorstellen

**1. Verscherp keywords `woz-q3-limiet-tevredenheid`** (mechanisch, whitelist-scope):
```ts
// voor
keywords: ['p04', 'garandeert', 'uitzondering', 'tevreden', 'ontevreden'],
minKeywords: 1,

// na
keywords: ['p04', 'garandeert', 'uitzondering'],
minKeywords: 1,
```
Verwijdert de twee te-algemene termen die letterlijk uit de vraagstelling terug te typen zijn; behoudt de termen die daadwerkelijk wijzen op het lezen van de tabel (de P04-uitzondering).

**2. Verscherp keywords `woz-q7-correlatie-causaliteit`** (mechanisch, whitelist-scope):
```ts
// voor
keywords: ['toetsdruk', 'toetsen', 'vakantie', 'andere factoren', 'andere'],
minKeywords: 1,

// na
keywords: ['toetsdruk', 'toetsen', 'vakantie', 'andere factoren'],
minKeywords: 1,
```
Verwijdert het losse woord "andere", dat door zijn algemeenheid vrijwel elk antwoord laat slagen zonder dat de contextkolom daadwerkelijk wordt gebruikt.

## Samenvatting en verdict

Deze missie is inhoudelijk sterk: drie datasets bouwen consistent naar hetzelfde leerdoel (correlatie ≠ causaliteit) met concrete tegenvoorbeelden uit de eigen data, en alle cross-references (SLO, curriculum, templateRegistry, missionGoals) kloppen. De enige bevindingen zijn twee te losse keyword-lijsten bij open vragen, die met een kleine mechanische aanpassing op te lossen zijn. Geen mission-specifieke blocking issues; de bekende engine-brede blockers (dode resultatenscherm, save-volgorde) zijn al elders vastgelegd.

**Verdict: ok** (triageScore 2.4 — laag, geen blocking bevindingen op missieniveau).
