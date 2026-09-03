# Review: advanced-code-review

**Datum:** 2026-08-25
**TemplateType:** review-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 7/10

De vier ronden volgen consequent het review-arena-patroon (badges, kleuren, followUp-uitleg) en de badge-drempels (0/25/50/70/90) zijn logisch oplopend met passende titels. Geen eigen visuele bevindingen in de config zelf.

- **Warning (geërfd van engine):** de match-ronde gebruikt `text-duck-ink/70`-achtige body-tekst en DragSort een hardgecodeerde `#ff3c21`-achtergrond voor het positienummer — het bekende duck-token-contrastrisico raakt ook deze missie via de gedeelde subcomponenten (geen actie hier nodig, staat al op de engine-lijst).

## Didactiek — score 7/10

Inhoudelijk sterk: de vier rondes bouwen logisch op (ML-stappenvolgorde → begrippen koppelen → supervised/unsupervised classificeren → waar/onwaar-kennischeck), en de followUp-vragen bij categorize en rapid-fire hebben goede, uitlegrijke afleiders (geen "duidelijk fout"-opties). De uitleg bij elke rapid-fire-vraag is behulpzaam en correct.

- **Warning (geërfd van engine, concreet voor deze missie):** ronde 1 (`round-drag-sort`, 6 items) en ronde 3 (`round-categorize`, 8 items, 2 categorieën) hebben geen gokcorrectie en een zwakke poort ("alles ergens neerzetten" volstaat om in te dienen). Bij categorize is de verdeling 4/4 over de twee categorieën, dus willekeurig indienen levert gemiddeld ~50% van de rondescore op zonder inhoudelijke keuze — precies het patroon dat het engine-rapport beschrijft.
- **Info:** de SLO-koppeling (`21D`, `22B` in `slo-kerndoelen-mapping.ts:166`) en curriculumplaatsing (leerjaar 3, week 1) zijn coherent met de missie-inhoud (ML/AI-concepten + REST API's).

## Tech — score 4/10 (inherited blockers dominate)

De config zelf is technisch schoon: correcte `correctPosition`-reeks (0-5, geen gaten), consistente `correctCategory`-waarden die matchen met `categories`, en `maxScore` per ronde (25×4=100) klopt met de totale `maxScore: 100`.

Deze missie draait echter op de gedeelde review-arena-engine en wordt daardoor concreet geraakt door twee blocking bevindingen uit het engine-rapport:

- **Blocking (geërfd):** `round-match-pairs` gebruikt `MatchPairs.tsx`, waar elke foute koppelpoging al een rondescore vastlegt (`onSubmit(scoreFor(attempts))`). Bij herladen na één foute klik toont de missie de ronde als "al ingediend" met bijna de volle score (19/25 bij 4 paren), zonder een juiste koppeling gemaakt te hebben.
- **Blocking (geërfd):** het gedeelde `CompletionScreen` heeft geen `onRetry`/terugweg wanneer `ReviewArena` alleen `onComplete` doorgeeft. Een leerling die onder 40% scoort op deze missie loopt vast op een uitgeschakelde knop zonder enige uitgang.

Beide bevindingen zitten in de gedeelde engine, niet in deze mission-config — er is dus niets in `advanced-code-review.ts` zelf te repareren; de fix hoort bij de engine-review.

## Voorstellen

Geen mission-config-specifieke autoFixes: alle blocking/warning-bevindingen zitten in de gedeelde engine (`MatchPairs.tsx`, `ReviewArena.tsx`, `DragSort.tsx`, `Categorize.tsx`), niet in `advanced-code-review.ts`, `templateRegistry.ts`, `agents/year3.tsx`, `slo-kerndoelen-mapping.ts`, `curriculum.ts` of `missionGoals.ts`. Deze bestanden zijn zelf correct en vergen geen wijziging.

## Samenvatting & verdict

De inhoud van deze missie (rondevolgorde, begrippen, followUp-vragen) is didactisch stevig en de registry-integratie (registry/SLO/curriculum/agent) is coherent. De technische score wordt gedrukt door twee engine-brede blocking bugs die concreet op deze missie van toepassing zijn: de vroegtijdige scorevastlegging in de koppelronde en de doodlopende voltooiingsscherm-knop onder 40%. Beide zijn niet in deze missie-config op te lossen — de fix hoort in de gedeelde `review-arena`-engine.

**Verdict: fix-eerst** (blokkerend op engine-niveau, niet op mission-config-niveau).
