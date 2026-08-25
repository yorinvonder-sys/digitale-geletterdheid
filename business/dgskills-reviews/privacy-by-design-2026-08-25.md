# Review: Privacy by Design

**Datum:** 2026-08-25 · **templateType:** simulation-lab · **missionId:** `privacy-by-design`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

De gedeelde simulation-lab-engine is al beoordeeld (zie `engine-simulation-lab.json`); alleen wat deze missie concreet raakt wordt hier herhaald.

## Design — 8/10

- ✅ Drie visualisatietypes (meter, bar-chart, comparison) sluiten logisch aan bij de content van elke simulatie; goede afwisseling in plaats van drie keer dezelfde componentvorm.
- ✅ Copy per simulatie is beknopt en leeftijdspassend (leerjaar 2).
- ⚠️ De bar-chart-kleuren in `computeVisuals` (`#ff3c21` actief / `#e3e2dc` inactief, regels 44-71) zijn losse hexwaarden in plaats van `duck-*`-tokens. Functioneel geen probleem (het zijn chart-datawaarden, geen className's), maar bij een toekomstige paletwijziging moeten deze handmatig worden meegenomen.
- Engine-brede bevindingen die deze missie raken (niet opnieuw scoren, wel vermelden): bare slash-opacity (`/8`, `/75`) op de simulatie-hint en disabled-knoppen geldt ook hier, en de "eerst experimenteren"-poort is met één klik te omzeilen bij alle drie simulaties van deze missie.

## Didactiek — 8.5/10

- ✅ SLO-codes `23A` (Veiligheid & privacy) en `23C` (Maatschappij) zijn geldig en worden substantieel geraakt: alle drie simulaties laten leerlingen een privacy-afweging maken en die uitleggen, niet alleen "aanraken".
- ✅ `missionGoals.ts`-entry (regel 470-478) is consistent met de config: dezelfde `primaryGoal`, `criteria.min: 3`, en evidence-tekst sluit aan bij de content.
- ✅ Bloom-balans: vragen combineren herkennen ("wat gebeurt er met je score") met toepassen ("welke instelling verbetert het meest") en beoordelen ("waarom is contacten-toegang verdacht").
- ✅ `slo-kerndoelen-mapping.ts` regel 123 (`week: 2, yearGroup: 2`) is consistent met `curriculum.ts` regel 194.
- ⚠️ Sim 1 se follow-up-vraag introduceert het begrip "Privacy by Default" zonder dat de introductie (`introDescription`) dat begrip al noemt — de leerling moet het antwoord afleiden uit de opties zelf. Lichte scope-mismatch tussen intro en follow-up-diepgang, geen blocker.

## Tech — 6.5/10

- ❌ **Score-mismatch in de config zelf** (niet de engine): sim 1 heeft `maxScore: 30` maar de drie vragen (10+10+10) plus de follow-up-bonus (5 punten, regel 178-184) kunnen samen 35 punten opleveren. De som van alle sim-maxScores (30+40+30=100) klopt met `config.maxScore: 100`, maar de daadwerkelijk haalbare punten zijn 105. In combinatie met de al bekende engine-bevinding (totaalscore clamt op `config.maxScore`, resultatenscherm clamt per sim op `sim.maxScore`) betekent dit dat een leerling die overal goed antwoordt én de follow-up haalt, op het resultatenscherm een uitsplitsing ziet die niet optelt tot het getoonde totaal.
- ✅ `computeVisuals` is pure TypeScript zonder `eval`, geen `any`-types, duidelijke per-sim branches.
- ✅ Geen edge function calls, geen security-relevante code in deze config.
- ✅ Import (`'../SimulationLab'`) is de gebruikelijke relatieve template-interne import, geen A4-overtreding.

## Voorstellen

### 1. Sim 1 se `maxScore` optellen met de follow-up-bonus

**Bestand:** `src/features/missions/templates/simulation-lab/configs/privacy-by-design.ts`

Voor:
```ts
{
    id: 'social-media-profiel',
    title: 'Jouw sociale media profiel',
    ...
    visualType: 'meter',
    maxScore: 30,
```

Na:
```ts
{
    id: 'social-media-profiel',
    title: 'Jouw sociale media profiel',
    ...
    visualType: 'meter',
    maxScore: 35,
```

En de config-brede `maxScore: 100` wordt `maxScore: 105`, zodat de som van sim-maxScores (35+40+30) weer gelijk is aan `config.maxScore` en het resultatenscherm niet meer kan afwijken van het getoonde totaal.

## Samenvatting

Sterke, compacte simulation-lab-missie met drie goed onderbouwde privacy-scenario's en een correcte SLO-koppeling. Eén concrete, mechanisch te fixen scorefout (sim 1 se maxScore houdt geen rekening met de follow-up-bonus) is de enige blocking bevinding; de rest zijn kleine, niet-blocking kanttekeningen die al grotendeels uit de gedeelde engine-review komen.

**Verdict: fix-eerst** (score-mismatch moet gecorrigeerd worden vóór live-gang; overige punten zijn optioneel).
