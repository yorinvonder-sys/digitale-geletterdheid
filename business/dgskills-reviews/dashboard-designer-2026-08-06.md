# Review: Dashboard Designer (`dashboard-designer`)

**Template:** data-viewer · **Leerjaar 2, periode 1** "Data & Informatie" · **SLO:** 21C, 22A (vso 18B, 19A)
**Config:** `src/features/missions/templates/data-viewer/configs/dashboard-designer.ts`
**Reviewdatum:** 2026-08-06 · Scope: alléén deze missie-config + registraties (gedeelde engine wordt apart beoordeeld)

## Samenvatting

De missie is inhoudelijk sterk opgezet (drie datasets, oplopende Bloom-niveaus, duidelijk SLO-doel), maar bevat één **blokkerende** fout: de kleuren van het cirkeldiagram in dataset 2 zijn zo gekozen dat drie van de vijf segmenten (Engels, Nederlands, Overige vakken) **exact dezelfde kleur** (`#202023`) hebben. Dat maakt de taart zelf onleesbaar — en dat gebeurt in een missie die leerlingen juist leert "gebruik kleur bewust, denk aan kleurenblinden" (Principe 4 in dataset 3). De legenda toont gelukkig wel exacte waarden per label, dus de vragen zijn nog wel beantwoordbaar, maar het lesmateriaal zelf demonstreert de fout die het probeert te voorkomen.

Daarnaast: 30 van de 100 punten (3 open `text-observation`-vragen) worden door de gedeelde engine altijd toegekend zodra een leerling ≥10 tekens typt — inhoud wordt niet beoordeeld. Dit is engine-gedrag (niet in deze config te fixen), maar weegt hier zwaar omdat het 30% van de maxScore is; gemeld als escalatie naar de engine-reviewer.

---

## 🎨 Design review

**Mission:** dashboard-designer (data-viewer)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Copy-lengte**: `introDescription` (~35 woorden) en alle vraagteksten ruim onder de leerjaar 1-2-grens (intro <80, vraag <60 woorden) — `dashboard-designer.ts:8`.
- **Data-tabel kolommen**: alle 5 kolommen (`klas`, `gem_cijfer`, `aanwezigheid_pct`, `onvoldoendes`, `tevredenheid`) zijn `sortable`, sluit aan bij de opdracht om te sorteren (zie explanation q2) — `dashboard-designer.ts:22-27`.
- **Antwoord-positie niet voorspelbaar**: correcte antwoorden staan niet altijd op dezelfde optie-positie (2C = index 2, Wiskunde = index 2, Lijndiagram = index 2, wisselend genoeg om patroon-gokken te voorkomen) — geen vast-patroon-probleem.

### ⚠️ Aandachtspunten
- **Interne datacoherentie pie chart**: dataset 2 telt op tot 100 (28+18+14+22+18) wat suggereert percentages, maar het veld heet `value` zonder eenheid-toelichting in de UI (legenda toont wél "18 (18%)"). Niet fout, maar een expliciete noot ("aantal onvoldoendes, toevallig optellend tot 100") zou verwarring voorkomen.
  - **Voorstel:** voeg een `description`-zin toe die verduidelijkt dat de waarden absolute aantallen zijn.

### ❌ Blocking issues
- **Pie-chart kleurdubbeling maakt de visualisatie zelf onbruikbaar** — `dashboard-designer.ts:101-107`:
  ```ts
  { label: 'Wiskunde', value: 28, color: '#ff3c21' },
  { label: 'Engels', value: 18, color: '#202023' },
  { label: 'Nederlands', value: 14, color: '#202023' },
  { label: 'Aardrijkskunde', value: 22, color: '#e1ff01' },
  { label: 'Overige vakken', value: 18, color: '#202023' },
  ```
  **Wat:** Engels, Nederlands en Overige vakken krijgen alledrie `#202023` (bijna-zwart). In `SimpleChart.tsx` wordt `d.color` direct als `fill` gebruikt zonder deduplicatie (`sub/SimpleChart.tsx:122`), dus in de SVG-taart smelten deze drie segmenten visueel samen tot één grote donkere vlek van 50% (18+14+18).
  **Waarom:** De missie leert expliciet (Principe 4, `dashboard-designer.ts:167-169`) "gebruik nooit meer dan 4-5 kleuren... denk ook aan kleurenblinden: zorg dat informatie niet alleen door kleur wordt overgebracht" — het eigen voorbeeld schendt die regel. Een leerling die het cirkeldiagram zelf probeert te lezen (i.p.v. de legenda-tekst) kan de drie donkere segmenten niet uit elkaar houden.
  **Voorstel:**
  ```ts
  { label: 'Wiskunde', value: 28, color: '#ff3c21' },
  { label: 'Engels', value: 18, color: '#202023' },
  { label: 'Nederlands', value: 14, color: '#99984D' },
  { label: 'Aardrijkskunde', value: 22, color: '#e1ff01' },
  { label: 'Overige vakken', value: 18, color: '#c2c1bd' },
  ```
  (gebruikt uitsluitend bestaande duck-tokens/kleuren die al elders in de engine als default-palet dienen, `SimpleChart.tsx:14-17`, zodat elk segment visueel te onderscheiden is.)

### Visual Precision Gate
Niet dynamisch geverifieerd (geen dev-server/Chrome-plugin-sessie in deze reviewronde — reviewscope was config-only). De hierboven beschreven kleurbotsing is statisch afgeleid uit de config + de rendering-logica in `SimpleChart.tsx` en is een deterministische fout (geen aanname over runtime-gedrag).

### Score
2/3 criteria geslaagd · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Mission:** dashboard-designer (data-viewer)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 21C, 22A (vso 18B, 19A)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **SLO-codes geldig**: `21C` (Data & Dataverwerking) en `22A` (Digitale producten) bestaan in de kerndoelenlijst; vso-mapping `18B`/`19A` aanwezig — `slo-kerndoelen-mapping.ts:105`.
- **21C-fit sterk**: alle drie datasets vragen leerlingen expliciet data te interpreteren, te sorteren en te vergelijken (q1, q2, q4) — direct onder "Data & Dataverwerking".
- **Leerdoel helder (via `missionGoals.ts`)**: `primaryGoal: 'Ik kies de juiste visualisatie voor een dataset en selecteer zinvolle KPI's...'` — begint met meetbaar werkwoord (kies, selecteer), concreet, Bloom-niveau toepassen/evalueren — `missionGoals.ts:744-751`.
- **Bloom-balans goed**: mix van onthouden/toepassen (q1, q2, q4, q7), begrijpen (q5), en evalueren/creëren (q3, q6, q8 — reflectieve open vragen over KPI-keuze en dashboardontwerp voor een specifieke klas).
- **Curriculum-plek logisch**: week 1, periode 1 "Data & Informatie", naast `factchecker` en `api-verkenner` — thematisch consistent — `curriculum.ts:172-176`.
- **Feitelijke juistheid van de vakinhoud**: alle grafiekadviezen kloppen (lijndiagram voor trend, staafdiagram voor exacte vergelijking, cirkeldiagram voor verdeling van een geheel, "3-6 categorieën" vuistregel) — `dashboard-designer.ts:106-116, 166`.

### ⚠️ Aandachtspunten
- **22A-fit oppervlakkig**: `22A` staat voor "Digitale producten [ontwerpen]", maar leerlingen ontwerpen zelf geen dashboard — ze analyseren bestaand voorbeeldmateriaal en beantwoorden vragen. Alleen q8 ("Beschrijf... hoe jij een dashboard zou ontwerpen voor klas 2C") komt dicht bij een ontwerp-actie, maar blijft tekstueel/reflectief zonder een daadwerkelijk product — `dashboard-designer.ts:239-247`.
  - **Voorstel:** ofwel 22A vervangen door een sterker passend kerndoel, ofwel (didactisch krachtiger) q8 uitbreiden met een concrete mini-ontwerp-opdracht (bv. "noem de 3 visualisaties die je zou plaatsen en in welke volgorde") zodat de claim steviger bewezen wordt.
- **Scorewinst zonder inhoudelijke toets (engine-gedrag, maar zwaar voor déze missie)**: de drie `text-observation`-vragen (q3, q6, q8) zijn samen 30/100 punten — 30% van de maxScore — en worden door de engine altijd toegekend zodra de leerling ≥10 tekens typt, ongeacht kwaliteit (`DataViewer.tsx:79,103,152`). Voor een missie die juist kritisch nadenken over KPI-keuze wil toetsen, is dat een groot deel van de score dat "gratis" is.
  - **Voorstel:** buiten scope van deze config (engine-verantwoordelijkheid) — zie escalatie naar `engine-data-viewer`-reviewer. Als workaround op configniveau: verlaag het puntenaandeel van open vragen t.o.v. toetsbare vragen in toekomstige data-viewer-missies.

### ❌ Blocking issues
Geen — bovenstaande zijn warnings, geen showstoppers.

### SLO-fit oordeel
- **21C**: sterk geraakt — alle 3 datasets, 8 vragen.
- **22A**: oppervlakkig — alleen indirect via één reflectievraag (q8).

### Score
5/6 criteria geslaagd · Bloom-balans: medium-hoog · Aanbeveling: ship (met de 22A-kanttekening als niet-blokkerende opvolgtaak)

---

## 🔧 Tech review (static, config-scope)

**Mission:** dashboard-designer (data-viewer)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Scope:** alleen config-level static analyse; geen dev-server beschikbaar in deze reviewronde, dus Fase B (dynamische Chrome-verificatie) is niet uitgevoerd — "dynamic verificatie niet uitgevoerd — geen dev-server".

### ✅ Geslaagd
- **maxScore-rekensom klopt**: dataset 1 (15+15+10=40) + dataset 2 (10+15+10=35) + dataset 3 (15+10=25) = **100**, exact gelijk aan `maxScore: 100` — `dashboard-designer.ts:200-247, 249`.
- **Badge-drempels bereikbaar**: 0/40/65/85 liggen allemaal binnen het haalbare bereik 0-100, geen onbereikbare drempel — `dashboard-designer.ts:251-270`.
- **Type-discipline**: config gebruikt het bestaande `DataViewerConfig`-type zonder `any`/`@ts-ignore`, correcte question-types (`multiple-choice`/`number-input`/`text-observation`) — `dashboard-designer.ts:1-2`.
- **Number-input tolerantie correct**: q2 (`correctAnswer: 8`) valt binnen de engine's 5%-tolerantie-logica voor een geheel getal; het verwachte antwoord (97-89=8) is zelf correct berekend uit de tabel — `dashboard-designer.ts:44`.
- **Registraties consistent**: `templateRegistry.ts:75`, `slo-kerndoelen-mapping.ts:105`, `curriculum.ts:174`, `missionGoals.ts:744` verwijzen allemaal correct naar dezelfde `missionId`.

### ❌ Blocking issues
- **Data-bug: kleurwaarden in `chartData` veroorzaken visueel onbruikbare pie-chart** (zelfde vondst als design-review) — `dashboard-designer.ts:101-107`. Dit is puur een dataprobleem in de config (geen engine-bug): drie hardcoded `color`-velden zijn identiek, terwijl de engine (`SimpleChart.tsx:122`) die kleur ongewijzigd doorgeeft aan de SVG-`fill`. Zie design-review voor exacte fix-snippet.

### Score
5/6 criteria geslaagd · Aanbeveling: **fix-eerst** (één regel-wijziging in `chartData`)

---

## Escalaties

- **structural → engine-data-viewer**: `text-observation`-vragen krijgen altijd volledige punten bij ≥10 tekens (`DataViewer.tsx:79,103,152`), ongeacht inhoud. Voor `dashboard-designer` is dat 30/100 punten. Dit is engine-breed gedrag dat alle data-viewer-missies met open vragen raakt — niet oplosbaar in deze config, wel relevant voor scoring-integriteit van de hele template.

## Auto-fixable

- **axis: design** (en tech) — `dashboard-designer.ts:101-107` — kleurwaarden vervangen zodat geen twee segmenten dezelfde kleur delen (zie exacte before/after in design-sectie hierboven).

## Claims om na te spelen

1. In het cirkeldiagram van dataset 2 zijn de segmenten Engels, Nederlands en Overige vakken (samen 50% van de taart) visueel niet van elkaar te onderscheiden omdat ze dezelfde kleur hebben.
2. Een leerling kan bij q3, q6 en q8 (samen 30 punten) willekeurige tekst van ≥10 tekens invullen en toch de volle punten krijgen, ongeacht de inhoud van het antwoord.
3. De badge-drempels (40/65/85 van 100) zijn daadwerkelijk haalbaar gegeven de puntenverdeling van de 8 vragen.

---

**Eindverdict:** fix-eerst — één concrete, kleine wijziging (kleurwaarden dataset 2) is vereist vóór ship; de rest van de missie (didactiek, SLO-fit, score-logica) is solide.
