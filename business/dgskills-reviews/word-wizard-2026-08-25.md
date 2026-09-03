# Review: Word Wizard (word-wizard)
**Datum:** 2026-08-25 · **templateType:** tool-guide

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 8/10

De config volgt het bestaande tool-guide-patroon strak: heldere `introFeatures`, consistente stap-opbouw (instructie → tip → checklist → teacherCheck → optioneel verificationQuestion), en een 3-laags badge-progressie die logisch oploopt (0/40/55). Geen custom Tailwind-classes in de config zelf — alle vormgeving loopt via de gedeelde `ToolGuide`-engine, dus geen missie-specifieke visuele risico's.

Bevindingen:
- **Warning** — stap 3 ("Afbeelding invoegen") heeft geen `verificationQuestion`, terwijl de andere drie stappen dat wel hebben. Dat is inhoudelijk verdedigbaar (praktische handeling, geen conceptvraag), maar breekt het visuele ritme: de leerling ziet in 3 van de 4 stappen een extra kennisblok en in stap 3 niet, zonder duidelijke reden zichtbaar in de UI zelf.
- **Info** — `tip`-tekst in stap 4 is relatief lang (twee zinnen) t.o.v. de andere tips; komt overeen met de complexiteit van het onderwerp (device-afhankelijkheid), dus geen actie nodig.
- Bekende engine-brede a11y-issues (checklist-items zonder `role="checkbox"`/`aria-checked`, ontbrekend focusbeheer bij stapwissel, mogelijke stille no-op van `/8`-opacity-klassen) gelden ook hier, maar zijn engine-eigendom — niet apart herhaald als missie-bevinding.

## Didactiek — score 7/10

SLO-koppeling is consistent over de vier bronnen: `21A, 22A` (regulier) / `18A, 19A` (VSO) in zowel `slo-kerndoelen-mapping.ts` als de config-verwachting, leerjaar 1 periode 1 ("Digitale Basisvaardigheden"), en de missie staat op de juiste plek in `curriculum.ts`. `missionGoals.ts`-entry (`primaryGoal`, `criteria.min: 4`, `evidence`) sluit logisch aan op de vier stappen in de config.

De vier `learningObjectives` zijn concreet en toetsbaar geformuleerd (aanmaken+opslaan, Kop 1/Kop 2, afbeelding+tekstomloop, inhoudsopgave-voorbereiding+uitleg), en de `verificationQuestion`s toetsen begrip ("waarom", "waarvoor") in plaats van kaal feitjes ophalen — dat is goed Bloom-niveau voor leerjaar 1 (begrijpen, niet alleen onthouden).

Bevindingen:
- **Warning** — stap 4 vraagt de leerling impliciet om een device-wissel (iPad → laptop/desktop) binnen één missie. De `tip` vangt het scenario "geen laptop beschikbaar" wel op ("Laat je kopstructuur aan je docent zien"), maar de checklistitems `desktopstap-bekeken` en `bijwerken-bekeken` zijn dan alsnog zelf-gerapporteerd zonder dat de leerling het echt gedaan hoeft te hebben — een structureel didactisch compromis, niet mission-specifiek op te lossen (raakt de gedeelde checklistlogica, zie engine-bevindingen).
- **Info** — `criteria.min: 4` in `missionGoals.ts` komt overeen met het aantal stappen (4), dus de drempel is inhoudelijk zinvol; geen mismatch met de config.
- Geen chat/AI-rol in deze missie (geen `enableChat`) — verwacht voor tool-guide, geen bevinding.

## Tech — score 6/10

De config zelf is technisch schoon: geldige `ToolGuideConfig`-shape, unieke `id`'s per stap en checklistitem, `correctIndex` binnen bereik van `options`, `maxScore: 55` klopt met 4 stappen × 10 (checklist) + 3 × 5 (bonusvragen, stap 3 heeft er geen) = 40 + 15 = 55.

De grote technische risico's zitten in de gedeelde `ToolGuide`-engine (scoring gokbaar tot 73%+ zonder inhoudelijk werk, gratis kennisbonus via `allowRetry`, ontbrekende `validate`-callback bij state-herstel, geen dubbelklik-guard op afronden, geen `onRetry` bij score <40%) — die zijn al vastgesteld in de engine-pass en gelden hier ongewijzigd door.

Missie-specifiek relevant:
- **Warning** — deze missie heeft 3 van de 4 stappen met `allowRetry: true`; dat is precies het patroon waarmee de "gratis kennisbonus"-engine-bug hier volledig uitpakt (15 van de 55 punten zijn met de brute-force-tactiek gratis).
- **Info** — de missie heeft geen edge-function-calls of externe data, dus criteria rond error-states/edge-function-security (A5, A7) zijn hier niet van toepassing — lager risico-oppervlak dan bijv. debate-arena-missies.

## Voorstellen

Geen mechanische config-fixes voorgesteld voor dit rapport — de belangrijkste bevindingen (scoring-gokbestendigheid, retry-bonus, state-herstel-crash) zitten in de gedeelde engine en zijn buiten de whitelist van deze missie-review. Eén optioneel, niet-blokkerend voorstel voor de config zelf:

**Voor** (`src/features/missions/templates/tool-guide/configs/word-wizard.ts`, stap 3 mist een `verificationQuestion` terwijl de andere stappen die wel hebben):
```ts
        {
            id: 'stap-3-afbeelding',
            ...
            teacherCheck:
                'Laat je docent de gekozen afbeelding, de bron en de ingestelde tekstomloop zien.',
        },
```

**Na** (optioneel — alleen als consistente kennistoetsing per stap gewenst is):
```ts
        {
            id: 'stap-3-afbeelding',
            ...
            teacherCheck:
                'Laat je docent de gekozen afbeelding, de bron en de ingestelde tekstomloop zien.',
            verificationQuestion: {
                question: 'Waarom noteer je de bron van een afbeelding die je in je verslag gebruikt?',
                options: [
                    'Omdat Word anders de afbeelding niet toont',
                    'Om te kunnen aantonen dat je de afbeelding mag gebruiken',
                    'Omdat de bestandsnaam er anders foutief uitziet',
                    'Omdat de tekstomloop er anders anders uitziet',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint: 'Nog niet. Denk aan waarom bronvermelding bij beeldmateriaal belangrijk is. Kies daarna opnieuw.',
                explanation: 'Goed! Bronvermelding laat zien dat je het beeldmateriaal mag gebruiken, ook als iemand anders het gemaakt heeft.',
            },
        },
```
Dit is een suggestie, geen blocker — niet in de auto-fix-lijst opgenomen omdat het een inhoudelijke toevoeging is, geen mechanische correctie.

## Samenvatting

Word Wizard is als config inhoudelijk en didactisch solide: goede SLO-consistentie, zinvolle stapopbouw, begripsgerichte kennisvragen. De echte technische risico's (gokbestendigheid, retry-bonus, crash bij state-herstel) zijn engine-eigendom en gelden voor alle 7 tool-guide-missies, niet uniek voor word-wizard. Missie-eigen bevindingen zijn licht (ontbrekende vraag in stap 3, device-wissel-afhankelijkheid in stap 4) en niet blokkerend.

**Verdict: ok** (afhankelijk van de engine-fixes die in de gedeelde tool-guide-pass worden opgepakt; op missie-niveau geen blokkerende issues).
