# Missiereview: Spreadsheet Specialist

**Mission:** `spreadsheet-specialist` (`data-viewer`)
**Leerjaar 2, periode 1 — Data & Informatie · SLO 21C, 22A (vso 18B, 19A)**
**Configbestand:** `src/features/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`
**Reviewdatum:** 2026-08-06

Scope: alleen deze missie-config en zijn registraties (`templateRegistry.ts:73`,
`slo-kerndoelen-mapping.ts:102`, `curriculum.ts:171`, `missionGoals.ts:726-734`).
De gedeelde `data-viewer`-engine wordt apart beoordeeld; hier alleen gelezen
waar nodig om een feitelijke claim in déze config te verifiëren (sorteer-/
filterfunctionaliteit).

## 🎨 Design review

### ✅ Geslaagd
- **Criterium 1 (tokens):** deze config bevat geen JSX/className — alle
  `color`-velden in `chartData` (`spreadsheet-specialist.ts:93-94`) zijn
  letterlijke hex-waarden (`#202023`, `#e1ff01`), maar dat is het patroon in
  **alle** 15 `data-viewer`-configs (bv. `data-journalist.ts:98-103`,
  `dashboard-designer.ts:79-83`) — geen mission-specifieke afwijking.
- **Criterium 2 (layout consistentie):** structuur (datasets → questions →
  followUp → badges → takeaways) is identiek aan de andere `data-viewer`-configs.
- **Criterium 4 (copy-lengte):** `introDescription` (31 woorden) en alle
  dataset-`description`-velden (max 27 woorden) blijven ruim onder de
  leerjaar 1-2-grens van 80 woorden.

### ⚠️ Aandachtspunten
- Geen missie-specifieke design-issues gevonden. De config draagt zelf geen
  layout/JSX; visuele precisie hangt volledig af van de gedeelde engine
  (zie engine-review).

### ❌ Blocking issues
- Geen.

### Score
3/3 toepasbare criteria geslaagd (criteria 3, 5, 6, 7 zijn n.v.t. — geen JSX in
deze config) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 2, Periode 1 ("Data & Informatie")
**SLO-claim:** 21C (Data & dataverwerking), 22A (Digitale producten) · vso 18B, 19A

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** 21C, 22A, 18B, 19A bestaan allemaal in de
  mapping-definitie — `slo-kerndoelen-mapping.ts:102`.
- **Criterium 2 — 21C:** sterk geraakt. Alle 8 vragen draaien om optellen,
  gemiddelde, vergelijken en formulekeuze op echte kasboekdata
  (`spreadsheet-specialist.ts:46-186`). Rekenwerk geverifieerd: uitgaven-totaal
  120+85+35+160+18+95 = 513 (q1, regel 49) klopt; Subsidie 500+200=700 >
  Verkoop 42+230=272 (q2, regel 60-62) klopt; Evenement 460 vs Materiaal 53,
  verschil 407 (q5, regel 114-116) klopt en komt overeen met de
  `chartData`-waarden op regel 93-94.
- **Criterium 4 (copy-lengte):** alle opdracht-/vraagteksten blijven ruim onder
  de 60-woordengrens voor leerjaar 1-2.
- **Criterium 5 (vocabulaire):** jargon wordt inline uitgelegd — "penningmeester
  (= degene die de kas bijhoudt)" (regel 22), "uitschieters (= waarden die er
  ver buiten vallen...)" (regel 150). Passend voor de doelgroep.
- **Criterium 6 (curriculum-plek):** logisch naast `data-journalist`,
  `dashboard-designer` in dezelfde periode (`curriculum.ts:169-176`); vraagt
  geen voorkennis die nog niet is aangeboden.
- **Leerdoelen (impliciet via `missionGoals.ts:726-734`):** `primaryGoal`
  ("Ik gebruik spreadsheet-formules zoals SOM, GEMIDDELDE en MAX...") is
  concreet en start met een handelingswerkwoord. De genoemde
  "filteren en sorteren" is geverifieerd als daadwerkelijk werkende
  functionaliteit in `InteractiveTable.tsx` (per-kolom tekstfilter +
  klik-op-kolomkop sortering) — de claim is dus feitelijk juist, niet
  overdreven.

### ⚠️ Aandachtspunten
- **Criterium 2 — SLO 22A (Digitale producten): oppervlakkig contact** —
  `spreadsheet-specialist.ts:4` (missionId) claimt 22A, maar de leerling
  produceert nergens een eigen digitaal artefact (geen formule zelf typen,
  geen eigen grafiek bouwen) — alles is lezen + rekenen + multiple-choice op
  vooraf berekende data.
  - **Wat:** de missie test *kennis over* formules (welke formule wanneer), niet
    het *zelf toepassen* ervan in een spreadsheet.
  - **Waarom:** 22A ("Digitale producten") impliceert dat de leerling iets
    digitaals maakt of bewerkt; hier blijft het bij herkennen/beschrijven
    (Bloom: onthouden/begrijpen, met wat toepassen bij het handmatig optellen).
    Het risico is een SLO-claim die de rapportage aan de docent overschat.
  - **Voorstel:** ofwel de SLO-claim beperken tot 21C alleen (en 22A laten
    vervallen voor deze missie), ofwel — als 22A behouden moet blijven — een
    korte "bouw je eigen formule"-vraag toevoegen waarbij de leerling een
    formule-string invult (bv. `=SOM.ALS(...)`) die tekstueel wordt gevalideerd.
    Dit is een keuze voor Yorin/curriculumeigenaar, geen kleine tweak.
- **Bloom-balans licht laag** — van de 8 vragen zijn er 5 herkennen/vergelijken
  (q1, q2, q4, q5, q7) en 3 uitleggen-in-eigen-woorden (q3, q6, q8; altijd
  volpunten, zie Tech-review). Geen enkele vraag vereist "toepassen" in de zin
  van een formule zelf samenstellen of een eigen situatie analyseren.
  - **Voorstel:** één vraag vervangen door "Schrijf zelf de formule op die het
    totaal van kolom D zou berekenen" (tekstvalidatie op patroon `=SOM(`).

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21C**: sterk geraakt — bewijs: q1, q2, q3, q4, q5, q7, q8 draaien allemaal
  direct op formule-toepassing/interpretatie van kasboekdata.
- **22A**: oppervlakkig — bewijs: geen enkele opdracht laat de leerling zelf
  een digitaal product (formule, grafiek) bouwen; zie aandachtspunt hierboven.

### Score
6/7 toepasbare criteria geslaagd (criterium 3 "expliciete learningObjectives"
is template-breed afwezig, ingevuld via `missionGoals.ts`; criterium 8 n.v.t.,
geen chat) · Bloom-balans: **laag-medium** · Aanbeveling: **fix-eerst** (SLO
22A-claim vs. inhoud verdient een beslissing, geen blocker voor ship)

---

## 🔧 Tech review

**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze
reviewronde; alleen static analyse.

### Static analyse

#### ✅ Geslaagd
- **maxScore-rekensom klopt:** q1(20)+q2(15)+q3(10)=45 (dataset 1) +
  q4(10)+q5(15)+q6(10)=35 (dataset 2) + q7(15)+q8(5)=20 (dataset 3) = **100**,
  gelijk aan `maxScore: 100` (`spreadsheet-specialist.ts:192`). FollowUp
  `bonusPoints: 0` (regel 81) telt terecht niet mee.
- **Badge-drempels haalbaar:** 85/65/40/0 tegen maxScore 100 — alle drempels
  bereikbaar (`spreadsheet-specialist.ts:196-218`).
- **Feitelijke juistheid formules:** `=SOM()`, `=GEMIDDELDE()`, `=MAX()`,
  `=MIN()`, `=AANTAL()`, `=AANTALA()`, `=SOM.ALS()`, `=GEMIDDELDE.ALS()` zijn
  correcte Nederlandstalige Excel/Google Sheets-functienamen (regel 51, 62, 72,
  141-163). Geen menupaden of platform-specifieke knopnamen genoemd — dus geen
  iPad/iOS-uitvoerbaarheidsrisico zoals gevraagd in de reviewopdracht.
- **Sorteer/filter-claim geverifieerd:** de uitleg bij q1 ("Filter op 'Uitgave'
  om het snel te controleren", regel 51) en q2 ("Sorteer op 'Type' en
  'Categorie'...", regel 62) verwijst naar functionaliteit die daadwerkelijk
  bestaat in `InteractiveTable.tsx` (per-kolom tekstfilter, regel 20/32-40;
  klik-sorteer met asc/desc/reset, regel 18-57) — geen dode of verzonnen UI-claim.

#### ⚠️ Aandachtspunten
- **Punt 1 uit de reviewopdracht — gratis punten via tekst-observatie:** de
  drie `text-observation`-vragen (q3: 10 pt, q6: 10 pt, q8: 5 pt = **25 van de
  100 punten**) worden door de gedeelde engine altijd als correct geaccepteerd
  ongeacht inhoud (`DataViewer.tsx:79` `// always participation points` en
  `DataViewer.tsx:103` `// always accepted`). Dit is engine-gedrag, niet
  specifiek voor deze config, maar bepaalt wél of déze missie volledig zonder
  inhoudelijk werk te spelen valt.
  - **Wat:** de enige drempel is een lengte-check (`DataViewer.tsx:152`,
    minimaal 10 tekens om te mogen bevestigen) — geen inhoudelijke keuring
    daarna. Een leerling die bij q3/q6/q8 "aaaaaaaaaa" (10 tekens) intypt,
    krijgt de volle 25 punten.
  - **Risico:** 25/100 punten zijn niet inhoudelijk gekeurd. De overige 75
    punten (q1, q2, q4, q5, q7) vereisen wél een juist antwoord, dus een volle
    score (100/100, badge "Formule-expert") is niet zonder correcte
    multiple-choice/number-antwoorden haalbaar — maar de badge-drempel van 65
    ("Data-analist in opleiding") is met alleen de 3 tekstvragen (25 pt) plus
    bijvoorbeeld giswerk op 2-3 mc-vragen makkelijker te faken dan bedoeld.
  - **Voorstel:** dit is een engine-brede eigenschap — cross-cutting, niet in
    deze config op te lossen. Doorgegeven aan de engine-reviewer (zie
    escalations); voor déze config geen actie nodig behalve bewustzijn bij het
    interpreteren van scores.
- **Bloom/toepassing:** zie didactiek-sectie — geen tech-issue maar wel relevant
  voor hoe "volledige score" zich verhoudt tot daadwerkelijke vaardigheid.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
n.v.t. — geen dev-server deze ronde.

### Score
Static: 4/4 toepasbare criteria (A1-A4, A5, A7 n.v.t. — config bevat geen
handlers/imports/AI-calls) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting voor Yorin

Rekenkundig, feitelijk en structureel klopt deze missie: alle formule-uitleg is
correct Nederlandse Excel/Sheets-terminologie, de score-rekensom klopt exact,
en de "filter/sorteer"-tips in de uitleg verwijzen naar functionaliteit die
echt werkt. Twee dingen zijn het melden waard, geen van beide blocking:

1. **SLO 22A-claim is zwak onderbouwd** — de missie laat leerlingen nooit zelf
   iets digitaals bouwen, alleen herkennen/berekenen. Overweeg de claim te
   beperken tot 21C, of voeg een "typ zelf een formule"-vraag toe.
2. **25 van de 100 punten zijn ongekeurd** (de drie open vragen) — dit is een
   eigenschap van de gedeelde `data-viewer`-engine, niet van deze missie
   specifiek; zie escalatie naar de engine-reviewer.

**Eindoordeel: ship**, met de SLO-22A-vraag als open punt voor een
curriculumbeslissing (geen codewijziging nodig om te shippen).
