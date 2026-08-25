# Rubric-review: startup-simulator
**Datum:** 2026-08-25 · **templateType:** builder-canvas

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6.5/10

- **[warning]** Alleen stap 1 (probleem-oplossing) heeft een `evidence`-veld; stap 2-4 leunen volledig op vrije tekst + checklist. Gegeven de gedeelde-engine-bevinding dat scoring presence-based is, is dit de enige stap die inhoudelijk discrimineert (break-even-berekening, USP-vergelijking). De andere drie stappen missen een vergelijkbaar verificatiepunt terwijl de instructie wél om berekeningen/vergelijkingen vraagt (break-even in stap 2, twee concurrenten + marktomvang in stap 3).
- **[info]** `previewType: 'text-preview'` past bij de contentvorm; geen structurele designfouten in de configstructuur zelf.
- **[info]** Badge-tiers zijn correct aflopend geordend (90/70/50/25/0) en dekken het hele bereik zonder gaten.

## Didactiek — score 7/10

- **[info]** Sterke scaffolding: elke stap heeft een korte theoretische framing (painkiller vs. vitamine, freemium-voorbeeld, "zeg nooit geen concurrenten") vóór de opdracht — goed voor onderbouw VO.
- **[warning]** Break-even wordt in stap 2 geïntroduceerd en in stap 4 herhaald met dezelfde uitleg tussen haakjes — functioneel als geheugensteun, maar het is de enige plek waar herhaling voorkomt; andere kernbegrippen (USP, traction) worden maar één keer uitgelegd. Overweeg dezelfde stijl van korte definitie-tussen-haakjes ook bij USP in stap 3 en traction in stap 4 voor consistentie.
- **[warning]** Checklistitems in stap 1-3 zijn zelfrapportage zonder harde toets (bijv. "Ik heb een verdienmodel gekozen en uitgelegd") — sluit aan bij de engine-bevinding dat checklist+40 tekens voldoende is voor volle punten. Voeg voor stap 2 en 3 een `evidence`-veld toe zoals in stap 1, zodat break-even-berekening en marktomvang-schatting apart worden vastgelegd i.p.v. verstopt in vrije tekst.
- **[info]** Takeaways dekken de vier stappen 1-op-1 en sluiten logisch op elkaar aan.

## Tech — score 8/10

- **[info]** Registry-entry (`templateRegistry.ts:61`), SLO-mapping (`slo-kerndoelen-mapping.ts:183`), curriculumplaatsing (`curriculum.ts:293`), missionGoals-entry (`missionGoals.ts:654-661`) en agent-rol (`year3.tsx:1105`) zijn onderling consistent — geen ontbrekende koppeling gevonden.
- **[info]** `maxScore: 100` met 4 stappen; geen expliciete per-stap puntenverdeling in deze config (die zit in de gedeelde engine/scoring-logica) — niets afwijkends hier.
- Geen missie-specifieke technische bugs boven op de al vaststaande engine-bevindingen (dubbelklik-afronding, presence-based scoring, milestone-toast-persistentie, contrast op /70-tokens) — die zijn engine-breed en niet apart in deze config te repareren.

## Voorstellen

### 1. Evidence-veld toevoegen aan stap "businessmodel" (break-even-bewijs)

Voor:
```ts
{
    id: 'businessmodel',
    ...
    textPrompt: 'Beschrijf je businessmodel',
},
```

Na:
```ts
{
    id: 'businessmodel',
    ...
    textPrompt: 'Beschrijf je businessmodel',
    evidence: {
        label: 'Bewijs voor je break-even-berekening',
        prompt: 'Noteer je berekening: vaste kosten ÷ prijs per klant = aantal klanten voor break-even.',
        placeholder: 'Bijv. €600 vaste kosten ÷ €5 per klant = 120 betalende klanten nodig.',
        minLength: 30,
    },
},
```

### 2. Evidence-veld toevoegen aan stap "marktanalyse" (USP-bewijs)

Voor:
```ts
{
    id: 'marktanalyse',
    ...
    textPrompt: 'Schrijf je marktanalyse',
},
```

Na:
```ts
{
    id: 'marktanalyse',
    ...
    textPrompt: 'Schrijf je marktanalyse',
    evidence: {
        label: 'Bewijs voor je USP-vergelijking',
        prompt: 'Noteer per concurrent één concreet verschilpunt met jouw product.',
        placeholder: 'Bijv. Concurrent A heeft geen abonnement onder 18 jaar, wij wel.',
        minLength: 30,
    },
},
```

## Samenvatting en verdict

De missie is inhoudelijk en didactisch sterk opgebouwd (heldere theorie-framing per stap, coherente afsluiting op alle vier configuratiebronnen), maar leunt — net als de gedeelde engine — zwaar op zelfrapportage. Alleen stap 1 heeft een apart bewijsveld; de twee stappen met de meeste rekenkundige/vergelijkende diepgang (break-even, USP) missen dat verificatiepunt. Geen missie-specifieke technische fouten; de bekende engine-issues (dubbelklik-afronding, presence-based scoring, milestone-toast) gelden hier ongewijzigd mee.

**Verdict: ok** (met niet-blokkerende verbetervoorstellen voor didactische diepgang)
