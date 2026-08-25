# Missie-review: ml-trainer
**Datum:** 2026-08-25 · **templateType:** data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

### ✅ Geslaagd
- Tailwind/duck-tokens: config bevat geen `className`-strings (data-viewer templates renderen content via de gedeelde engine); geen hex-literals in UI-lagen.
- Copy-structuur consistent met andere data-viewer-missies (title/description/source per dataset).
- `source`-metadata (`kind: 'synthetic'`, `methodNote`) is bij alle 3 datasets ingevuld — voorkomt dat leerlingen gesimuleerde cijfers voor echte statistiek aanzien.

### ⚠️ Aandachtspunten
- `chartData[].color` gebruikt hardcoded hex (`'#e1ff01'`, `'#202023'`) in plaats van een duck-tokenverwijzing (src/features/missions/templates/data-viewer/configs/ml-trainer.ts:105-110). Dit is data, geen className, dus geen directe Tailwind-schending, maar bij een toekomstige duck-paletwijziging (zie project-memory: duck-palet heeft 6 tokens) volgen deze waarden niet automatisch mee.
- Alle 4 badges (regel 210-234) gebruiken exact dezelfde `color: '#202023'` — geen visuele differentiatie tussen prestatieniveaus, terwijl vergelijkbare data-viewer-missies vaak per badge een andere accentkleur gebruiken.
- **Visual Precision Gate:** niet dynamisch geverifieerd — geen Chrome-plugin-bewijs beschikbaar in deze pass. Markeer als *unverified*, geen blocking (config bevat geen layout-risico's zoals te lange strings of ontbrekende breekpunten).

### ❌ Blocking issues
- Geen missie-specifieke blockers. De engine-brede blockers (zie Tech) raken deze missie wel functioneel.

## Didactiek — score 8/10

### ✅ Geslaagd
- Leerdoelen impliciet helder in `introDescription` en `takeaways`: meetbaar (supervised learning, features/labels, overfitting, classificatie/regressie).
- Opdracht-beknoptheid: `introDescription` ≈ 55 woorden, ruim onder de leerjaar 3-grens van <120 woorden; vraagformuleringen (`question`) blijven allemaal onder de 40 woorden.
- Bloom-balans: q1/q4/q5 (onthouden/toepassen — tellen/filteren), q2/q7 (analyseren — sterkste feature, overfitting herkennen), q3/q6/q8 (evalueren/uitleggen aan leek). Goede spreiding over niveaus voor leerjaar 3.
- `sloEntry` (curriculum.ts:161) bevat 3 codes — binnen de grens van max 3.

### ⚠️ Aandachtspunten
- **SLO-fit 22B (Programmeren):** de missie bevat geen enkele programmeeractiviteit — leerlingen filteren/lezen een tabel, vergelijken een staafgrafiek en lezen begrippenkaarten. Dit is oppervlakkig contact met 22B op zijn best; het kerndoel wordt geclaimd maar niet substantieel geoefend (`src/config/slo-kerndoelen-mapping.ts:161`). 21D (AI) en 21C (Data) zijn wél sterk gedekt.
- q3 en q8 zijn `text-observation` met `minKeywords: 1` — bij q3 volstaat het noemen van één van vijf brede keywords (`'juiste antwoord'`, `'begeleid'`, `'vergelijkt'`, `'voorbeelden'`, `'vooraf'`) om als correct te tellen, wat een oppervlakkig antwoord kan laten slagen zonder dat de leerling het concept "supervised" echt uitlegt.

### ❌ Blocking issues
- Geen.

## Tech — score 6/10 (grotendeels engine-erfenis)

Deze missie is een pure content-config; er zit geen eigen handler-, error- of securitylaag in `ml-trainer.ts`. De onderstaande bevindingen komen uit de gedeelde data-viewer-engine (reeds apart beoordeeld) en zijn hier alleen genoemd voor zover ze deze missie concreet raken.

### ⚠️ Aandachtspunten die deze missie raken
- **Voltooiing bij zakken (engine, blocking elders):** `maxScore: 100`, en de engine's slaag-drempel ligt op 40% van `maxScore`. Een leerling die minder dan 40 punten haalt op deze missie komt vast te zitten op het resultatenscherm zonder `onRetry` of terugweg (DataViewer.tsx:984) — dit treft elke ml-trainer-leerling die onder de drempel scoort, dus met 8 vragen en een minimumscore-risico bij verkeerd beantwoorden van de zwaarst wegende vragen (q1/q2/q5/q7 = 15 punten elk) is dit een reëel scenario voor deze specifieke missie.
- **Premature clearSave (engine, blocking elders):** bij een mislukte serveropslag verliest een ml-trainer-leerling zijn ingevulde antwoorden vóór bevestiging (DataViewer.tsx:950) — identiek risico voor deze missie als voor elke andere data-viewer-missie.
- **Drempel-inconsistentie (engine, warning):** `totalScore/maxScore >= 0.4` vs. afgeronde percentage-check in `CompletionScreen.tsx` kan bij een score rond 40/100 tegenstrijdige "geslaagd"-signalen geven aan leerling vs. docentrapportage.

### ✅ Geslaagd (missie-eigen)
- Geen `any`, geen ts-ignore, geen relatieve importpaden in de config zelf.
- `correctAnswer`-waarden en `keywords` zijn consistent getypeerd per `type` (number-input/multiple-choice/text-observation).

### ❌ Blocking issues (missie-eigen, whitelist-scope)
- Geen — de blockers zitten uitsluitend in de gedeelde engine (`DataViewer.tsx`), niet in `ml-trainer.ts` zelf, en vallen dus buiten de auto-fix-whitelist voor deze missie.

## Voorstellen

Geen mechanische auto-fix-kandidaten binnen de whitelist-scope voor deze missie: de gevonden issues zitten óf in de gedeelde engine (buiten scope), óf zijn beoordelingsvragen (SLO 22B-fit, badge-kleuren) die een inhoudelijke keuze vereisen, geen 1-op-1 code-snippet-fix.

Suggestie voor Yorin om zelf te overwegen (geen auto-fix, ter info):

```ts
// src/features/missions/templates/data-viewer/configs/ml-trainer.ts — badges (regel 210-234)
// voor:
{ minScore: 85, emoji: '🧠', title: 'ML Expert!', color: '#202023' },
{ minScore: 65, emoji: '🤖', title: 'Model Trainer', color: '#202023' },
// na (voorbeeld, vereist visuele keuze):
{ minScore: 85, emoji: '🧠', title: 'ML Expert!', color: '#e1ff01' },
{ minScore: 65, emoji: '🤖', title: 'Model Trainer', color: '#202023' },
```

## Samenvatting

`ml-trainer` is een inhoudelijk sterke, goed opgebouwde data-viewer-missie: duidelijke datasets, correcte antwoorden met uitleg, goede Bloom-spreiding en nette source-attributie. De belangrijkste zwakte is de SLO-claim op 22B (Programmeren), die niet substantieel wordt geoefend — dit is een beoordelingskeuze voor Yorin, geen codefout. De echte technische risico's (vastlopen bij zakken, dataverlies bij mislukte opslag) zitten in de gedeelde `DataViewer`-engine en gelden voor alle data-viewer-missies, niet specifiek voor deze config.

**Verdict: ok**, met de kanttekening dat de engine-brede blockers eerst in de gedeelde engine moeten worden opgelost voordat de missie als volledig veilig voor leerlingen geldt.
