# Rubric-review: ux-detective

**Datum:** 2026-08-25
**TemplateType:** data-viewer

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

- De drie datasets (tabel, staafgrafiek, document-cards) bouwen logisch op elkaar voort en herhalen dezelfde casus (schoolapps), wat de missie samenhangend maakt.
- **Bevinding (info):** `q8-verbetervoorstel` heeft `points: 0` terwijl het qua vorm en diepte gelijk is aan de andere text-observation-vragen (10-15 punten). Dit oogt als een kopieerfout, niet als bewuste keuze — een leerling die deze vraag goed beantwoordt krijgt geen punten voor het werk, wat demotiverend werkt.
- **Bevinding (info):** de som van alle `points` (15+15+10 + 10+15+10 + 15+0 = 90) komt niet uit op `maxScore: 100`. Een leerling kan dus nooit het maximum halen, zelfs bij alle antwoorden goed.
- Engine-gerelateerd (niet missie-specifiek, alleen genoteerd omdat deze missie het raakt): de bevestigknop bij observatievragen kan zonder duidelijke uitleg disabled blijven voor schermlezergebruikers (zie gedeeld engine-rapport).

## Didactiek — score 7.5/10

- Sterke opbouw: van concrete gebruikersklachten (tabel) → kwantitatieve vergelijking (SUS-scores) → abstracte principes (document-cards) → toepassing (q7/q8). Dit is een goede leerlijn van feit naar begrip naar transfer.
- De uitleg-teksten bij elke vraag zijn inhoudelijk correct en leggen het "waarom" uit (bijv. SUS-drempel 68, prioriteringslogica op ernst × frequentie).
- **Bevinding (warning):** `q3` en `q8` zijn text-observation met `minKeywords: 1` uit een brede synoniemenlijst (bijv. `['frequentie', 'ernst', 'prioriteit', 'vaakst', 'meeste']`). Eén toevallig treffend woord in een verder inhoudsloos antwoord ("de ernst is hoog") scoort al vol. Dit is consistent met hoe de engine dit soort vragen scoort (zie gedeeld engine-rapport: scoring is daar al gokbestendig gemaakt op engine-niveau), maar op missie-niveau blijft de keyword-drempel zelf laag — een strengere `minKeywords: 2` zou dieper redeneren beter afdwingen zonder de vraag onbereikbaar te maken.
- Curriculumplaatsing (leerjaar 2, periode 3 "Digitale Media & Creatie") past inhoudelijk: UX-analyse is een voorloper op het zelf ontwerpen/creëren van digitale media verderop in dezelfde periode.

## Tech — score 8/10

- Config is intern consistent: dataset-ids, question-ids en kolomsleutels zijn uniek en worden correct gebruikt in `columns`/`rows`/`chartData`.
- Rekenkundige antwoorden zijn correct geverifieerd: gemiddelde navigatie-ernst (5+5+3+5)/4 = 4,5 ✓; SUS-verschil 78−55 = 23 ✓.
- `templateRegistry.ts`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` en `missionGoals.ts` bevatten alle vier een consistente `ux-detective`-entry; geen dubbele of ontbrekende registratie.
- **Bevinding (warning, gedeeld met design):** de `points`-som (90) wijkt af van `maxScore` (100) — zie Design-sectie. Dit is de enige technische inconsistentie in de config zelf.
- Overige door de engine gerapporteerde issues (geen onRetry op het resultatenscherm, `clearSave()` vóór bevestigde serveropslag, dubbele `onComplete`-calls, drempelverschil 0.4 vs afgerond 40%) zitten in de gedeelde `DataViewer.tsx`-engine, niet in deze missieconfig — al raakt deze missie ze net zo hard als elke andere data-viewer-missie omdat ze de threshold van 40% dicht kan naderen (bijv. bij 39/100 op de dataset-1-vragen).

## Voorstellen

**1. Punten laten optellen tot `maxScore: 100`**

Bestand: `src/features/missions/templates/data-viewer/configs/ux-detective.ts`

Voor:
```ts
                    keywords: ['affordance', 'feedback', 'consistentie', 'foutpreventie'],
                    minKeywords: 1,
                    correctAnswer: '',
                    explanation:
                        'Een goede verbetering past een UX-principe toe: ...',
                    points: 0,
                },
```

Na:
```ts
                    keywords: ['affordance', 'feedback', 'consistentie', 'foutpreventie'],
                    minKeywords: 1,
                    correctAnswer: '',
                    explanation:
                        'Een goede verbetering past een UX-principe toe: ...',
                    points: 10,
                },
```

**2. Strengere keyword-drempel voor de twee open reflectievragen**

Bestand: `src/features/missions/templates/data-viewer/configs/ux-detective.ts`

Voor (bij `q3-prioriteit-observatie` en `q8-verbetervoorstel`):
```ts
                    minKeywords: 1,
```

Na:
```ts
                    minKeywords: 2,
```

## Samenvatting & verdict

De missie is didactisch sterk opgebouwd (feit → cijfer → principe → toepassing) en technisch correct geregistreerd in alle vier de configbestanden. Het enige harde probleem is dat de score-optelsom (90) niet aansluit op `maxScore` (100) door een vergeten `points`-waarde bij de laatste vraag — een mechanische fout die met één regel te herstellen is. Daarnaast kan de keyword-drempel bij de open vragen strenger, als kwaliteitsverbetering, niet als blokkade.

**Verdict: fix-eerst** (mechanische score-inconsistentie moet vóór livegang worden hersteld; overige punten zijn optioneel).
