# Missie-review: Eindproject Jaar 2

**Mission ID:** eindproject-j2
**Template:** data-viewer
**Curriculum-plek:** Leerjaar 2, Periode 4 ("Ethiek, Maatschappij & Eindproject") — laatste missie van de periode, capstone-eindmissie
**Datum:** 2026-07-02
**Reviewer-pipeline:** dgskills-mission-review v1.0 (wave 15, verse review)

---

## 🎨 Design review

**Score: 8.5/10**

### ✅ Geslaagd

- **Datasetvariatie:** drie dataset-typen (tabel, bar-chart, document-cards) — voldoet aan de data-viewer-standaard voor visuele afwisseling. — `eindproject-j2.ts:17-206`
- **Bar-chart-kleurencodering consistent met engine-tokens:** `#e1ff01` (acid, top-scorer Spel/Scratch als accent), `#202023` (ink, neutraal), `#ff3c21` (error, laagst-scorende categorie) — logisch gebruik van de bestaande drie-kleurenpalet i.p.v. willekeurige hex-waarden. — `eindproject-j2.ts:99-103`
- **Badge-progressie:** 4 niveaus (0/40/65/85) met oplopende emoji (📚→🎯→⭐→🏆) — heldere visuele feedbackladder. — `eindproject-j2.ts:211-236`
- **Document-cards met citaten:** vier tip-cards met naam + score van de citerende leerling (bijv. "— Elif (8,3)") maakt de tips herleidbaar naar de dataset zelf — sterke visuele/inhoudelijke samenhang tussen dataset 1 en dataset 3.

### ⚠️ Aandachtspunten

- **Visual Precision Gate — unverified:** geen screenshots-map beschikbaar voor deze missie (geen dev-server-run in scope van deze pass). Statische analyse toont geen evidente layout-risico's, maar dynamische verificatie (mobiel/tablet/desktop) staat nog open — consistent met de systeem-brede bevindingen uit de UI/UX-review van 2026-06-30 (data-viewer is een van de systeem-thema's, geen missie-specifiek nieuw risico). `eindproject-j2` staat in die review overigens al genoemd als een van de **best scorende missies** (gem. ≥4.0).

### ❌ Blocking issues

Geen.

---

## 📚 Didactiek review

**Score: 9.0/10**
**SLO-claim:** 21A, 21B, 21C, 21D, 22A, 22B, 23A, 23B, 23C (regulier) · 18A, 18B, 18C, 19A, 20A, 20B (VSO) — expliciet gemarkeerd als "capstone: alle kerndoelen" in `curriculum.ts:144`

### ✅ Geslaagd

- **Sterke capstone-fit:** de missie is de laatste van periode 4 ("Ethiek, Maatschappij & Eindproject"), na `ai-ethicus`, `digital-rights-defender`, `tech-court`, `future-forecaster`, `sustainability-scanner` — en positioneert zichzelf expliciet als integratie van "programmeren, data, design, netwerken en ethiek" (`introDescription`). Past uitstekend bij een eindmissie die alle kerndoelen van het jaar samenbrengt. — `curriculum.ts:212-225`
- **Metacognitief ontwerp:** de missie leert niet alleen data lezen, maar laat leerlingen expliciet reflecteren op hun eigen aanpak (q6 "zou je voor een veilig type gaan of iets onbekends proberen?", q8 "beschrijf jouw idee"). Dit sluit direct aan bij de brede reflectie-eis van een eindproject.
- **Open vragen zonder fout antwoord op de juiste plek:** q3, q6, q8 zijn `text-observation`-vragen zonder `correctAnswer`, met een `explanation` die het denkkader schetst i.p.v. één juist antwoord af te dwingen — didactisch correct voor open, reflectieve items.
- **Gesloten vragen zijn inhoudelijk verifieerbaar:** q1, q2, q4, q5, q7 zijn multiple-choice/number-input met een expliciete, natrekbare berekening in de explanation (zie tech review voor exacte nacalculatie) — leerlingen kunnen het antwoord zelf reconstrueren uit de tabel, wat het analytische leerdoel versterkt.
- **AI-as-copilot correct ingevuld:** `enableChat: true` met een systemInstruction die de agent expliciet als coach positioneert ("Geef geen kant-en-klare oplossingen, maar stel vragen die de leerling verder helpen") en het volledige designcyclus-proces begeleidt (onderwerp → plan → uitvoering → presentatie → reflectie). — `agents/year2.tsx:2516-2543`
- **Realistische, herkenbare tips:** de vier document-cards (probleem-gedreven starten, plannen, presenteren, feedback vragen) zijn concreet en direct toepasbaar op een eigen eindproject, niet abstract.

### ⚠️ Aandachtspunten

- **Vraagtekst-cijfermismatch ondermijnt de leeractiviteit (zie ook tech review):**
  - **Wat:** q2 vraagt de leerling te redeneren vanuit "Chiara scoort 9 voor originaliteit, maar slechts 5 voor techniek" — maar de dataset-rij en de explanation gebruiken techniek=6. Een leerling die de tabel raadpleegt om de vraag te verifiëren, ziet een ander cijfer dan de vraag zelf noemt, wat het narratieve/analytische leerdoel (data-tabel als bewijsbron gebruiken) ondermijnt. — `eindproject-j2.ts:65` vs `eindproject-j2.ts:35,75`
  - **Voorstel:** wijzig de vraagtekst naar "...maar slechts 6 voor techniek" zodat vraag, dataset-rij en explanation consistent zijn.

### ❌ Blocking issues

Geen. De cijfermismatch is een feitelijke onnauwkeurigheid, geen fundamentele SLO- of didactische mismatch.

---

## 🔧 Tech review

**Score: 6.5/10**
**Dynamic verificatie:** niet uitgevoerd deze pass (geen dev-server/screenshots in scope; consistent met systeem-brede data-viewer-bevindingen uit UI/UX-review 2026-06-30).

### Antwoordmodel-nacalculatie — exact nagerekend tegen de dataset

**Alle 16 `eindcijfer`-waarden in dataset 1 herberekend als (originaliteit+techniek+presentatie)/3:**

| Leerling | Berekend | Tabel | Klopt? |
|---|---|---|---|
| Amir t/m Pien (16 rijen) | — | — | ✅ alle 16 exact gelijk (max. afwijking 0,00) |

Volledige nacalculatie uitgevoerd — geen enkele afwijking tussen (originaliteit+techniek+presentatie)/3 en het opgeslagen `eindcijfer` over alle 16 leerlingen.

**q1 (hoogste gemiddelde projecttype) — herberekend per categorie:**

| Projecttype | Gemiddelde (herberekend) |
|---|---|
| App-ontwerp | (7,7+8,3+8,3+7,3)/4 = **7,90** |
| Video/animatie | (8,0+7,0+8,3)/3 = **7,77** |
| Spel (Scratch) | (7,3+7,7+8,0)/3 = **7,67** |
| Website | (7,0+6,0+7,7)/3 = **6,90** |
| Onderzoek | (8,0+6,7+5,7)/3 = **6,80** |

`correctAnswer: 'App-ontwerp'` ✅ klopt — App-ontwerp wint met 7,90, de explanation-berekening (r.59) is correct.

**q4 (verschil top-bottom) — herberekend:** 7,90 − 6,80 = 1,10 → `correctAnswer: 1.1` ✅ klopt.

**Bar-chart dataset 2 — herberekend tegen tabel 1:** alle 5 chart-waarden (App-ontwerp 7.9, Video/animatie 7.8, Spel 7.7, Website 6.9, Onderzoek 6.8) komen overeen met de uit tabel 1 herberekende gemiddelden (afgerond op 1 decimaal). ✅ geen afwijking.

**q2 (Chiara) — data-inconsistentie gevonden:**

| Bron | Techniek-waarde |
|---|---|
| Vraagtekst (r.65) | **5** |
| Dataset-rij Chiara (r.35) | **6** |
| Explanation-berekening (r.75) | **6** |

De dataset-rij en de explanation zijn onderling consistent (9+6+9)/3=8,0, maar de vraagtekst noemt een ander getal (5) dan wat er in de tabel staat. `correctAnswer` zelf blijft de juiste keuze (presentatie compenseert techniek), dus dit is geen fout antwoord — wel een feitelijke inconsistentie die een leerling die de tabel checkt kan verwarren. Zie didactiek-review.

**Puntensom vs maxScore — mismatch gevonden:**

| Vraag | Punten |
|---|---|
| q1 | 15 |
| q2 | 15 |
| q3 | 10 |
| q4 | 10 |
| q5 | 10 |
| q6 | 10 |
| q7 | 15 |
| q8 | 0 |
| **Som** | **85** |
| **`maxScore` (config)** | **100** |

- **Wat:** de 8 vragen leveren samen maximaal 85 punten op, terwijl `maxScore: 100` (`eindproject-j2.ts:209`). Een leerling kan dus nooit meer dan 85% van de score behalen — het scoreplafond ligt structureel onder de 100%-badge-referentie. Het bovenste badge-niveau (`minScore: 85`, "Klaar voor het eindproject!") is toevallig nét haalbaar (85=85), maar dat is een toevalstreffer, geen doorgerekend ontwerp: elke andere badge-drempel boven 85 zou onhaalbaar zijn geweest. — `eindproject-j2.ts:60,76,86,113,130,140,193,203,209`
  - Noot: q8 heeft bewust `points: 0` (open reflectievraag zonder scoretelling) — dat is didactisch verdedigbaar, maar versterkt wel de kloof tussen puntensom (85) en `maxScore` (100).
- **Voorstel A (minimale wijziging, config-only):** verlaag `maxScore` naar 85 zodat het exact overeenkomt met de haalbare puntensom — consistent met het patroon uit `word-wizard` (maxScore = engine-max, geen kunstmatige kloof).
- **Voorstel B (alternatief, indien 100 als rond getal gewenst is):** verhoog een van de bestaande vraagpunten met 15 (bijv. q7 van 15→30, of verdeel 15 punten over meerdere vragen) zodat de som op 100 uitkomt zonder een nieuwe vraag toe te voegen.

### ✅ Geslaagd

- **Datasetintegriteit dataset 1:** alle 16 eindcijfers exact herleidbaar uit de drie deelcriteria — geen enkele rekenfout in de brondata.
- **Bar-chart-consistentie:** chart-waarden komen overeen met de uit dataset 1 herberekende gemiddelden.
- **correctAnswer-verificatie q1, q4, q5, q7:** alle vier multiple-choice/number-input-antwoorden zijn inhoudelijk correct en herleidbaar uit de dataset.
- **Registratie compleet:** `RoleId`-union (`types.ts:41`), `AGENT_ROLE_IDS` (`agentRoleIds.ts:75`), `templateRegistry` (`templateRegistry.ts:82`), `missionGoals` (`missionGoals.ts:807-815`), `slo-kerndoelen-mapping` (`slo-kerndoelen-mapping.ts:144`), `curriculum` (`curriculum.ts:225`), `basisvaardigheden-mapping` (`basisvaardigheden-mapping.ts:540-545`), `missionThumbnails` (`missionThumbnails.ts:75`), `missionBuilder` info-tekst (`missionBuilder.tsx:108`), quick-replies (`useAgentLogic.ts:276`) — alle 10 bouwstenen aanwezig en consistent op `missionId: 'eindproject-j2'`.
- **Security:** geen `dangerouslySetInnerHTML`, geen ongesanitized leerlinginput naar AI zichtbaar in de config zelf (chat-sanitisatie is engine-breed, buiten scope van deze missie-config).

### ⚠️ Aandachtspunten

- **q2 vraagtekst-cijfer (zie hierboven, ook didactiek):** eenregelige tekstfix, geen structuurwijziging.
- **Puntensom vs maxScore (zie hierboven):** config-only fix, geen engine-wijziging nodig.

### ❌ Blocking issues

Geen. Beide gevonden issues zijn kleine, geïsoleerde config-fouten (één cijfer in vraagtekst, één numerieke mismatch) zonder gevolgen voor de kernwerking van de missie.

---

## Samenvatting

- **Geslaagd:** design 3/4 · didactiek 6/7 · tech 5/7 substantiële criteria
- **Blocking:** 0
- **Resterende issues:** 1 didactiek/tech-gedeelde issue (Chiara techniek-cijfer 5 vs 6 in vraagtekst) · 1 tech-issue (puntensom 85 ≠ maxScore 100) — beide laag risico, geen showstoppers, beide met minimale (1-regel resp. 1-waarde) fix
- **Sterkste punt:** uitstekende didactische fit als capstone-eindmissie — integreert alle SLO-kerndoelen van jaar 2, stimuleert metacognitieve reflectie, en de dataset/antwoordmodel zijn (op de twee genoemde issues na) volledig rekenkundig consistent over alle 16 leerlingen, 8 vragen en 5 bar-chart-categorieën.
- **Grootste resterend risico:** het scoreplafond van 85% (puntensom 85 vs maxScore 100) is puur toeval-haalbaar op het topbadge-niveau — bij een toekomstige badge-drempelwijziging (>85) zou de badge structureel onhaalbaar worden zonder dat de puntensom-mismatch zichtbaar is.

**Triage-score:** 1.90 (laag = gezond; schaal (10-design)×0.3 + (10-didactiek)×0.4 + (10-tech)×0.3)

**Verdict: fix-eerst** (geen blocking, maar beide issues zijn met minimale moeite (1-regel tekstfix + 1 config-waarde) te verhelpen vóór volgende schoolpilot, en de puntensom-mismatch is het type stille bug dat pas zichtbaar wordt bij een toekomstige badge-wijziging)

---

## Codex-gate (M1)

**Niet uitgevoerd deze pass** — token-discipline batch-review (wave 15) beperkt scope tot statische drie-rubriek-analyse zonder adversarial gate. Aanbevolen vóór een release-beslissing als de q2-tekstfix en maxScore-fix zijn doorgevoerd.
