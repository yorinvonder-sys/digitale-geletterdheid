# Rubric-review: data-pipeline (templateType: data-viewer)
Datum: 2026-08-25

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

Bevindingen:
- (warning) De teller onder het observatieveld en de disabled-bevestigknop missen `aria-live`/`aria-describedby` (gedeeld engine-issue, geldt ook voor deze missie's tekstvragen q3, q6, q8).
- (info) Filterveld-placeholder in `InteractiveTable` heeft dezelfde kleur als ingevulde tekst (gedeeld engine-issue, raakt dataset 1 "ruwe-sensordata").
- (info) Typo in vraagtekst q4: "schoone gemiddelde" moet "schone gemiddelde" zijn.
- Content zelf is visueel consistent: kleurgebruik in de bar-chart (`#ff3c21` ruw vs `#202023` schoon) is functioneel en leesbaar, badges gebruiken de standaard duck-kleuren.

## Didactiek — score 7/10

Bevindingen:
- Sterk doordachte opbouw: tabel → grafiek → strategiekaarten volgt een logische ETL-leerlijn (probleem herkennen → effect meten → strategie kiezen).
- Rekenkundig kloppend: q1 (5 probleemrijen), q4 (47,8 − 21,6 = 26,2) zijn correct herleidbaar uit de dataset.
- (warning) `minKeywords: 1` bij alle drie tekstvragen (q3, q6, q8) is zwak: een leerling die alleen het woord "gemiddelde" noemt zonder de kern van de vraag te raken (bijv. bij q6 zonder "extract"/"transform"/"load" te noemen, alleen "opslaan") scoort toch de punten. Dit ondermijnt het doel van de vraag (ETL-stappen kunnen benoemen).
- (info) q2's "correcte" aanpak (imputatie via gemiddelde van buren) is didactisch verdedigbaar maar wordt als hardgecodeerde tekstmatch beoordeeld (multiple-choice, dus geen risico) — geen bevinding, alleen ter info.
- missionGoals-evidence ("vijf datakwaliteitsproblemen benoemen") sluit goed aan op q1's antwoord (5).

## Tech — score 8/10

Bevindingen (config-niveau; engine-brede bugs zijn al vastgesteld en hieronder alleen genoemd waar ze deze missie concreet raken):
- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` (periode 3.1) en `missionGoals.ts` zijn onderling consistent: missionId, threshold (65) en badge-drempel (65 = "Pipeline Bouwer") komen overeen.
- Puntentelling klopt: 15+15+10 (dataset 1) + 15+10+10 (dataset 2) + 15+10 (dataset 3) = 100 = `maxScore`.
- Geërfde engine-bugs die deze missie raken (niet apart scoren, al vastgesteld in de gedeelde engine-review): een leerling die onder 40% scoort op deze missie loopt vast op het resultatenscherm (geen `onRetry`), en de lokale voortgang wordt gewist vóór de server de voltooiing bevestigt. Dit is een blocking-risico voor élke data-viewer-missie inclusief data-pipeline, maar zit in `DataViewer.tsx`, niet in `data-pipeline.ts`.

## Voorstellen

1. Typo in q4 (bestand: `src/features/missions/templates/data-viewer/configs/data-pipeline.ts`)

Voor:
```ts
question:
    'Hoeveel graden wijkt het ruwe gemiddelde van Lokaal 3A af van het schoone gemiddelde?',
```

Na:
```ts
question:
    'Hoeveel graden wijkt het ruwe gemiddelde van Lokaal 3A af van het schone gemiddelde?',
```

2. Verhoog `minKeywords` voor de tekstvragen zodat een leerling de kern van het antwoord moet raken (voorbeeld voor q6, ETL-stappen):

Voor:
```ts
keywords: ['extract', 'ophalen', 'transform', 'opschonen', 'opslaan'],
minKeywords: 1,
```

Na:
```ts
keywords: ['extract', 'ophalen', 'transform', 'opschonen', 'opslaan'],
minKeywords: 2,
```

## Samenvatting en verdict

De missie-inhoud (dataset, vragen, uitleg) is inhoudelijk sterk en rekenkundig correct; de belangrijkste zwakte is didactisch (te lage `minKeywords`-drempel op tekstvragen) plus één typo. De blocking-issues voor deze missie zitten in de gedeelde `data-viewer`-engine (vastloop-scherm bij <40%, opslag vóór bevestiging), niet in `data-pipeline.ts` zelf — die vallen buiten de auto-fixbare scope van dit rapport.

**Verdict: fix-eerst** (vanwege de gedeelde engine-blockers; de config zelf is met kleine fixes klaar).
