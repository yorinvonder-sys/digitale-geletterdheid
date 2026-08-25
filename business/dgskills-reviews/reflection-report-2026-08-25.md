# Review: reflection-report (debate-arena)

**Datum:** 2026-08-25
**TemplateType:** debate-arena

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

- **Bevinding (info):** `introEmoji`/badge-kleuren gebruiken het bestaande duck-acid-token `#e1ff01` consistent met de andere debate-arena-configs; geen missie-specifieke kleurfout gevonden (de gedeelde `STAKEHOLDER_COLORS`-contrastbug uit de engine-review raakt indices ≥4; deze missie heeft maar 4 stakeholders, dus wordt niet geraakt).
- **Bevinding (blocking):** de agentkaart in `src/config/agents/year3.tsx` (regels 2126-2134) presenteert de missie als een individueel *schrijf*-opdracht ("Schrijf een reflectieverslag…", `examplePrompt: 'Ik vind het lastig om over mezelf te schrijven. Hoe begin ik met mijn reflectieverslag?'`), terwijl de missie zelf een debate-arena is over de vraag of reflectie een kerndoel moet zijn (`topic`, `dilemma`, `positions` in de config). Leerlingen die de briefing lezen verwachten een essay en komen in een debat met 4 stakeholders terecht — een directe content-mismatch tussen briefing en uitvoering.

## Didactiek — score 5/10

- **Bevinding (blocking, zelfde als design):** de missie-briefing (probleemschets, doel, voorbeeldprompt) beschrijft een heel andere opdrachtvorm dan de debate-arena-mechaniek. Dat ondermijnt de leerdoelstelling: leerlingen bereiden zich mentaal voor op zelfstandig schrijven, niet op standpuntbepaling/argumentatie tegen 4 perspectieven.
- **Bevinding (info):** de inhoudelijke stakeholder-perspectieven (leerling, HR-manager, docent, onderwijsfilosoof) zijn behoorlijk sterk en dekken uiteenlopende invalshoeken (arbeidsmarkt, curriculumdruk, ethiek) — dit deel van de missie-inhoud is goed.
- **Niet-bevinding:** deze config heeft 2 `reflectionQuestions`, dus de gedeelde scoring-bug uit de engine-review (som > 100 bij 3 reflectievragen) is hier NIET van toepassing.
- **Niet-bevinding:** de SLO-mapping bevat bewust alleen `23B` (comment sluit `23C` expliciet uit als "welzijn, niet maatschappij") — geen actie nodig.

## Tech — score 7/10

- De missie is correct doorverwezen in `templateRegistry.ts` (enableChat: true, chatRoleId matcht), `slo-kerndoelen-mapping.ts`, `curriculum.ts` (leerjaar 3) en `missionGoals.ts`. Geen missing/dangling references gevonden.
- Deze missie erft de gedeelde debate-arena-engine-bugs (dubbele voltooiknop-klik, retry-knop die voortgang wist bij <40%) — zie de aparte engine-review; geen missie-specifieke technische fout gevonden bovenop de gedeelde engine.

## Voorstellen

### 1. Briefing laten aansluiten op de debate-arena-mechaniek

Bestand: `src/config/agents/year3.tsx`

**Voor:**
```tsx
description: 'Schrijf een reflectieverslag over je leerproces van drie jaar informatica.',
problemScenario: 'Drie jaar informatica zitten erop. Je hebt geprogrammeerd, ontworpen, onderzocht en gepresenteerd. Maar wat heb je eigenlijk geleerd? En hoe ga je deze kennis gebruiken in de toekomst? Een goed reflectieverslag dwingt je om stil te staan bij je groei — en dat is precies wat vervolgopleidingen en werkgevers willen zien.',
missionObjective: 'Schrijf een reflectieverslag waarin je je leerproces beschrijft, je sterke en zwakke punten analyseert en vooruitkijkt naar de toekomst.',
briefingImage: '/assets/agents/reflection-report.webp',
difficulty: 'Medium',
examplePrompt: 'Ik vind het lastig om over mezelf te schrijven. Hoe begin ik met mijn reflectieverslag?',
```

**Na:**
```tsx
description: 'Debatteer over de waarde van reflectie en ethiek in het informatica-curriculum.',
problemScenario: 'Drie jaar informatica zitten erop. Maar moet een informatica-opleiding ook bijdragen aan wie je bent als persoon — je zelfkennis, je verantwoordelijkheidsgevoel, je digitale ethiek? Vier betrokkenen denken daar heel verschillend over. Kies een positie, bouw argumenten op en reageer op een tegenargument.',
missionObjective: 'Formuleer een onderbouwd standpunt over de rol van reflectie en ethisch denken in het informatica-curriculum, gebaseerd op minstens twee stakeholderperspectieven.',
briefingImage: '/assets/agents/reflection-report.webp',
difficulty: 'Medium',
examplePrompt: 'Ik weet niet welke positie ik moet kiezen in dit debat. Kun je de standpunten nog eens naast elkaar zetten?',
```

## Samenvatting & verdict

De inhoud van de debate-arena-config zelf (stakeholders, posities, tegenargument, takeaways) is didactisch sterk en technisch correct doorverwezen in alle registries. Het kernprobleem zit in de briefingkaart (`year3.tsx`): die beschrijft een individueel schrijfopdracht die niet overeenkomt met de daadwerkelijke debat-mechaniek, wat leerlingen op het verkeerde been zet vóór ze de missie starten. Gecombineerd met de geërfde, elders al vastgestelde engine-blockers (dubbele voltooiing, dataverlies bij retry) is dit **fix-eerst**: geen herontwerp nodig, wel een mechanische briefing-correctie plus de generieke engine-fixes.

**Verdict: fix-eerst**
