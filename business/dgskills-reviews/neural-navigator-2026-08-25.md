# Missiereview: Neural Navigator

**Datum:** 2026-08-25
**templateType:** data-viewer
**Leerjaar/periode:** jaar 3, week 1 (curriculum.ts) · SLO 21D, 22B

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 7/10

- Kleurgebruik in de staafgrafiek (`output-na-aanpassing`) volgt het duck-palet (`#ff3c21`/`#202023`), consistent met de rest van de missie.
- Badges hebben een logische opbouw (0/40/65/85) en sluiten aan bij `missionGoals`-drempel van 65.
- **Warning:** de engine-bevinding over `text-duck-ink/75` op zowel tekst als placeholder in `InteractiveTable.tsx` (gebruikt door dataset 1, `neuron-berekeningen`) raakt deze missie direct: de tabel met vier neuronen is de eerste interactie die de leerling ziet, en het contrastprobleem is daar meteen zichtbaar.
- Info: geen missie-specifieke designfouten los van de gedeelde engine gevonden.

## Didactiek — score 6.5/10

- Sterke opbouw: rekenvoorbeeld (dataset 1) → voor/na-vergelijking die het leereffect concreet maakt (dataset 2) → begripslaag over netwerkarchitectuur (dataset 3). Dit volgt een logische cognitieve opbouw van rekenen naar begrijpen.
- Uitleg bij `q1-neuron-b-berekening` en `q4-juiste-voorspelling` koppelt het rekenresultaat expliciet terug aan het grotere concept (backpropagation, leereffect) — goed voor transfer.
- **Bevinding (blocking, missie-specifiek):** `missionGoals.ts:785` zet de teacher-facing pass-drempel op `threshold: 65` (score-threshold op 100), terwijl de gedeelde data-viewer-engine intern slaagt bij `totalScore/maxScore >= 0.4` (40%) — zie engine-bevinding "scoring". Voor Neural Navigator betekent dit dat een leerling op 45/100 in de missie zelf als "Gehaald" wordt gefeliciteerd (CompletionScreen toont 40%+ als geslaagd), terwijl de docentrapportage via `missionGoals` pas vanaf 65 als voldaan aan het primaire leerdoel telt. Dat is een zichtbare tegenstrijdigheid tussen wat de leerling te zien krijgt en wat de docent als "doel behaald" leest.
- Warning: `q3-gewichten-observatie` en `q6-backpropagation` gebruiken keyword-detectie met `minKeywords: 1` — dat is zeer soepel (één woord als "fout" of "verandert" volstaat al) en beloont mogelijk oppervlakkige antwoorden. Past bij de bekende engine-gokbestendigheid, maar bij een kernbegrip als backpropagation zou 2 keywords een sterkere borging zijn tegen minimale inspanning.
- Info: `q8-netwerk-toepassing` is een sterke transfervraag (eigen voorbeeld uit dagelijks leven) — goed voor motivatie en begrip.

## Tech — score 7/10

- Config-structuur volgt het `DataViewerConfig`-contract correct; alle drie datasettypes (table, bar-chart, document-cards) worden gebruikt, wat variatie in interactie geeft.
- Identiteit is compleet en consistent: `templateRegistry.ts`, `slo-kerndoelen-mapping.ts` (21D, 22B), `curriculum.ts` (jaar 3, periode 1) en `missionGoals.ts` bevatten allen de `neural-navigator`-entry — geen ontbrekende koppeling.
- Rekenkundig correct: alle `correctAnswer`-waarden in dataset 1 en 2 zijn nagerekend en kloppen met de gegeven formule (bijv. Neuron B: 1.0×0.2 + 0.4×0.7 + 0.0 = 0.48).
- De blocking engine-bevindingen (geen `onRetry` → dode knop onder 40%, `clearSave()` vóór bevestigde serveropslag) gelden onverkort voor deze missie: een leerling die op deze missie onder 40% scoort loopt vast op het resultatenscherm zonder terugweg. Dit is geen missie-specifiek defect maar treft Neural Navigator net zo hard als elke andere data-viewer-missie.
- Info: geen missie-specifieke tech-fouten los van de engine en de scoring-drempel-mismatch hierboven.

---

## Voorstellen

### 1. Scoring-drempel afstemmen (missie-config, autofixable-kandidaat)

De mismatch zit deels in de gedeelde engine (40%-check) en deels in de missie-eigen `missionGoals`-entry (65-drempel). Binnen de whitelist van deze missie kan alleen de `missionGoals`-kant worden aangepast; het is echter zinvoller om de engine-drempel leidend te maken (zie engine-rapport, sweep-niveau escalatie) zodat álle data-viewer-missies consistent worden — een geïsoleerde wijziging van alleen deze ene `threshold` zou de tegenstrijdigheid met CompletionScreen (40%) juist verergeren i.p.v. oplossen.

**Voor** (`src/config/missionGoals.ts:785`):
```ts
'neural-navigator': {
    primaryGoal: 'Ik bereken een forward pass door een neuraal netwerk en leg uit hoe lagen, gewichten en backpropagatie werken.',
    criteria: {
        type: 'score-threshold',
        threshold: 65,
        description: 'Je analyseert neuronen met gewichten en biassen, vergelijkt trainingsresultaten en beantwoordt vragen over netwerklagen.',
    },
    evidence: 'Je kunt de output van een neuron berekenen met invoer, gewichten en bias, en uitleggen wat backpropagatie doet.',
},
```

**Na** (voorstel, pas toepassen ná sweep-brede beslissing over de 40%-vs-65%-norm):
```ts
'neural-navigator': {
    primaryGoal: 'Ik bereken een forward pass door een neuraal netwerk en leg uit hoe lagen, gewichten en backpropagatie werken.',
    criteria: {
        type: 'score-threshold',
        threshold: 40, // afgestemd op DataViewer-engine pass-logica (totalScore/maxScore >= 0.4)
        description: 'Je analyseert neuronen met gewichten en biassen, vergelijkt trainingsresultaten en beantwoordt vragen over netwerklagen.',
    },
    evidence: 'Je kunt de output van een neuron berekenen met invoer, gewichten en bias, en uitleggen wat backpropagatie doet.',
},
```

### 2. Sterkere keyword-borging voor kernbegrip backpropagation

**Voor** (`src/features/missions/templates/data-viewer/configs/neural-navigator.ts:120-129`):
```ts
{
    id: 'q6-backpropagation',
    question: 'Beschrijf in eigen woorden hoe backpropagation werkt. Gebruik een vergelijking als hulp.',
    type: 'text-observation',
    keywords: ['fout', 'mis', 'antwoord', 'verandert', 'aanpast'],
    minKeywords: 1,
    ...
},
```

**Na:**
```ts
{
    id: 'q6-backpropagation',
    question: 'Beschrijf in eigen woorden hoe backpropagation werkt. Gebruik een vergelijking als hulp.',
    type: 'text-observation',
    keywords: ['fout', 'mis', 'antwoord', 'verandert', 'aanpast'],
    minKeywords: 2,
    ...
},
```

---

## Samenvatting en verdict

Neural Navigator is inhoudelijk een van de sterkere data-viewer-missies: de rekenkundige voorbeelden kloppen, de opbouw van rekenen naar begrijpen is logisch, en de identiteitskoppeling (curriculum/SLO/registry/goals) is compleet. Het missie-specifieke probleem is de scoring-drempel-mismatch tussen `missionGoals` (65) en de engine-pass-logica (40%), die de leerling een ander "geslaagd"-signaal geeft dan de docentrapportage. Dat staat los van, maar verergert het effect van, de al bekende blocking engine-defecten (dode resultatenscherm onder 40%, opslag gewist vóór bevestiging) die voor alle data-viewer-missies gelden.

**Verdict: fix-eerst.** De blocking engine-issues zijn sweep-niveau (niet in deze missie zelf op te lossen); de scoring-drempel-mismatch is een missie-specifiek punt dat wacht op de sweep-brede beslissing over welke norm (40% of 65%) leidend wordt.
