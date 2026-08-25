# Review: Spreadsheet Specialist

**Datum:** 2026-08-25
**TemplateType:** data-viewer
**Wave:** 22

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

## Design — score 6/10

De missie hergebruikt de bestaande data-viewer-subcomponenten (tabel, staafgrafiek, document-cards) consistent en gebruikt duck-kleurtokens (`#202023`, `#e1ff01`) in `chartData` en badges. Inhoudelijk vlekkeloos: geen eigen designfouten in de config zelf.

- **[blocking, geërfd]** `src/features/missions/templates/data-viewer/DataViewer.tsx:984` — geen `onRetry` naar `CompletionScreen`. Een leerling van deze missie die onder 40% scoort (bijv. alleen q1+q4+q5 fout, komt makkelijk voor met 8 vragen) krijgt een uitgeschakelde knop en geen terugweg; `clearSave()` wordt niet aangeroepen, dus herladen laat hem op hetzelfde dode scherm staan. Raakt deze missie net zo hard als elke andere data-viewer-missie.
- **[warning, geërfd]** `DataViewer.tsx:953` — drempel-inconsistentie (`totalScore/maxScore >= 0.4` vs. afgeronde `>= 40`). Bij deze missie (maxScore 100) is elke score al een heel percentage, dus het randgeval (79/200→39,5%→40%) doet zich hier NIET voor — geen extra impact op deze specifieke missie.
- **[info]** De `followUp` bij dataset 1 heeft `bonusPoints: 0`. De vraag ("grootste voordeel van formules") is inhoudelijk sterk, maar levert de leerling niets op — een gemiste motivatieprikkel, geen bug.

## Didactiek — score 8/10

Sterk doordacht: de missie leert leerlingen expliciet **wanneer** je welke formule gebruikt (SOM/GEMIDDELDE/MAX/MIN/AANTAL), niet alleen wat de formule doet. De opbouw tabel → grafiek → cheatsheet is logisch: eerst ruwe data, dan visuele vergelijking, dan abstractie naar formulekeuze. Puntentelling klopt exact op maxScore (20+15+10+10+15+10+15+5 = 100). Badge-drempels (85/65/40/0) sluiten aan op de `score-threshold`-eis van 65 in `missionGoals.ts`.

- De SLO-mapping bevat een expliciete, eerlijke zelfcorrectie in commentaar: `// -22A/-19A: de leerling leest kasboekdata en kiest de juiste formule, maar bouwt geen eigen spreadsheet`. Dit is geen bevinding maar een correct beperkt scopebesluit — de missie claimt geen kerndoel dat ze niet dekt.
- q3 en q8 zijn `text-observation` met `minKeywords: 1` uit een brede keywordlijst (bijv. `['uitschieter','representatief','extreem','hoog','laag']`) — ruim genoeg om legitieme, verschillend geformuleerde antwoorden te accepteren zonder tot triviaal te verwateren.
- Chartdata (Evenement 460, Materiaal 53) klopt exact met de som van de Uitgave-rijen in de tabel — geen data-inconsistentie tussen dataset 1 en dataset 2.

Geen eigen didactische gebreken gevonden.

## Tech — score 6/10

De config zelf is technisch schoon: geen ontbrekende velden, correcte types, consistente `id`'s. De technische risico's zitten volledig in de gedeelde engine en gelden hier ongewijzigd:

- **[blocking, geërfd]** `DataViewer.tsx:950` — `clearSave()` vóór `onComplete`; bij een mislukte serveropslag verliest de leerling zijn voortgang op deze missie net als op elke andere data-viewer-missie.
- **[warning, geërfd]** `DataViewer.tsx:953` — geen eenmalig-guard op `onComplete`, dubbele voltooiingsmelding mogelijk.
- **[warning, geërfd]** `DataViewer.tsx:450` — teller/knop-uitleg zonder `aria-live`/`aria-describedby`; raakt hier vooral vraag q3, q6, q8 (de drie `text-observation`-vragen in deze missie).
- **[info, geërfd]** `InteractiveTable.tsx:97` — placeholder/ingevulde-tekst contrast; raakt de sorteerbare kolommen (`maand`, `categorie`, `bedrag_euro`, `type`) in dataset 1.

Geen missie-specifieke technische fouten in de config gevonden.

## Voorstellen

Geen mechanische auto-fixes binnen de whitelist-scope van deze missie — alle blocking/warning-bevindingen zitten in de gedeelde engine (`DataViewer.tsx`, buiten scope) en zijn al onderdeel van de engine-bevinding voor `data-viewer`. Voor de config zelf is er één optioneel, niet-blocking voorstel:

```ts
// voor (spreadsheet-specialist.ts, dataset 1)
followUp: {
    question: 'Wat is het grootste voordeel van formules boven handmatig rekenen in spreadsheets?',
    options: [...],
    correctIndex: 1,
    explanation: '...',
    bonusPoints: 0,
},

// na
followUp: {
    question: 'Wat is het grootste voordeel van formules boven handmatig rekenen in spreadsheets?',
    options: [...],
    correctIndex: 1,
    explanation: '...',
    bonusPoints: 5,
},
```

## Samenvatting & verdict

De missie-inhoud (config) is didactisch sterk en technisch schoon; alle blocking- en de meeste warning-bevindingen komen uit de gedeelde `data-viewer`-engine en zijn al vastgelegd in de engine-review — ze zijn niet specifiek voor deze missie maar raken haar wel (een leerling die hier onder 40% scoort, loopt vast). Geen eigen blocking- of warning-bevindingen in de config.

**Verdict: fix-eerst** (op basis van de geërfde engine-blockers; de config zelf is klaar).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
