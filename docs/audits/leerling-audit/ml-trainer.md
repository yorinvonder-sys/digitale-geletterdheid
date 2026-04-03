# Audit — ML Trainer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ml-trainer` |
| **Titel** | ML Trainer |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | DataViewer + standalone MLTrainerMission.tsx |
| **SLO-kerndoelen** | 22B (Programmeren), 21D (AI), 21C (Data & Dataverwerking) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Word een ML Trainer" is helder en actief geformuleerd
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — supervised learning, features, accuracy worden duidelijk aangekondigd
- [x] Visueel element past bij het thema — emoji 🧠 sluit aan bij ML-thema
- [x] Moeilijkheidsgraad is zichtbaar — "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (3 bullets) zetten de verwachtingen helder: dataset analyseren, accuracy vergelijken, overfitting beoordelen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts:3-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De drie feature-bullets maken het leerpad onmiddellijk duidelijk. Het spamfilter-scenario in `problemScenario` (year3.tsx) is herkenbaar en relevant. Moeilijkheidsgraad "Hard" is realistisch voor de inhoud.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren zijn consistent — `chartData` in dataset 2 gebruikt hardcoded hex-kleuren (`#F59E0B`, `#3B82F6`, `#10B981`, `#8B5CF6`) in plaats van `lab-*` tokens
- [x] DataViewer-template heeft een bewezen responsive lay-out
- [x] Animaties zijn niet afleidend — DataViewer gebruikt geen onnodige animaties
- [x] Teksten zijn goed leesbaar — korte zinnen, Nederlandse terminologie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts:93-97`

**Score:** 3 / 5

**Opmerkingen:**
> De DataViewer-template is solide, maar de hardcoded hex-kleuren in de staafgrafiek zijn een stijlovertreding. Mobiele weergave van tabellen met 6 kolommen kan krap worden op 375px — niet verifieerbaar zonder runtime. De standalone `MLTrainerMission.tsx` (fruit-labeling game) heeft een eigen lay-out die niet als onderdeel van de DataViewer wordt geladen; de integratiepunten zijn onbekend.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Dataset 1 (tabel/spam) → Dataset 2 (staafgrafiek/accuracy) → Dataset 3 (begripskaarten) bouwt goed op
- [x] Elke stap bouwt aantoonbaar voort — spam-dataset legt de basis voor de accuracy-vergelijking
- [x] Moeilijkheid past bij het leerjaar — J3 havo/vwo, "Hard"
- [x] STEP_COMPLETE markers aanwezig (3/3) in systemInstruction: dataset beschreven → modeltype gekozen → accuracy geïnterpreteerd
- [x] Reflectievragen (text-observation) stimuleren dieper denken zonder te prescriptief te zijn

**Bronbestanden:** `config/agents/year3.tsx:54-57`, `components/missions/templates/data-viewer/configs/ml-trainer.ts:46-198`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drieledige structuur (tabel → grafiek → kaarten) is een bewezen leerpatroon. De reflectievragen zoals "Hoe leg jij aan een niet-technisch persoon uit of 88% accuracy goed genoeg is?" zijn precies goed voor havo/vwo niveau — open, contextueel en uitdagend. De STEP_COMPLETE-criteria zijn helder en toetsbaar.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — supervised learning, overfitting, classificatie vs. regressie worden juist uitgelegd
- [x] De overfitting-analogie ("leerling die antwoorden uit zijn hoofd leert") is didactisch sterk en correct
- [x] Geen aantoonbare spelfouten in de gecheckte content
- [x] Taalgebruik past bij de leeftijdsgroep — toegankelijk maar inhoudelijk niet uitgehold
- [x] Terminologie consistent — "features", "labels", "accuracy" consistent gebruikt
- [x] Oefenvraag q1: antwoord 50% is correct (6 spam / 12 totaal)
- [x] Oefenvraag q5: 88-68=20 procentpunt is correct

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts:46-237`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk de sterkste missie van J3P1. Alle concepten zijn correct en proportioneel uitgelegd. De vier begripskaarten (trainingset vs. testset, overfitting, features/labels, classificatie vs. regressie) vormen een mini-woordenboek dat leerlingen ook buiten de missie kunnen gebruiken. Geen fouten gevonden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — welkomt de leerling als "ML Trainer" met het spamscenario
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Machine Learning Coach" is enthousiast maar inhoudelijk
- [x] Scope guard aanwezig — geen echte code vereist, conceptueel begrip staat centraal
- [x] Farming-detectie actief via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year3.tsx:30-90`

**Score:** 5 / 5

**Opmerkingen:**
> De AI-coach is goed geconfigureerd. Het EERSTE BERICHT zet onmiddellijk de context (spamprobleem bij bedrijf) en geeft de leerling een concrete eerste taak. De STEP_COMPLETE-criteria zijn meetbaar: "dataset beschreven met features, labels en train/test-split" is concreet genoeg voor de AI om te beoordelen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — tabel sorteren/filteren, multiple choice, number-input en text-observation zijn gevarieerd
- [x] Voldoende variatie over de 3 datasets (8 vragen totaal)
- [x] Feedback op foute antwoorden is leerzaam — uitgebreide `explanation` bij elke vraag
- [x] DataViewer-template is bewezen werkend
- [x] De standalone MLTrainerMission.tsx (fruit-labeling) biedt extra hands-on interactie naast de DataViewer

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts`, `components/missions/MLTrainerMission.tsx`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke interactiviteit. De combinatie van DataViewer (8 vragen) én de standalone fruit-labeling game geeft leerlingen twee complementaire ervaringen: conceptueel (DataViewer) en hands-on (MLTrainerMission). Punt van aandacht: de relatie tussen de twee componenten is onduidelijk — worden ze allebei getoond, of alleen één? Als de MLTrainerMission een aparte route heeft, kan een leerling één van beide missen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig en betekenisvol: 🧠 ML Expert! (≥85), 🤖 Model Trainer (≥65), 📊 Data Scientist in opleiding (≥40), 📚 Aan de slag! (≥0)
- [x] `maxScore: 100` is helder
- [x] `takeaways[]` aanwezig — 5 kernlessen die het geleerde samenvatten
- [x] Scoredrempels zijn realistisch — 85 voor Expert is ambitieus maar haalbaar
- [x] Puntenstructuur is transparant (15+15+10+10+15+10+15+0 = 90 scoreable punten van 100)

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts:201-237`

**Score:** 5 / 5

**Opmerkingen:**
> Afrondingselementen zijn compleet en didactisch zinvol. De takeaways vatten de kernlessen bondig samen ("Supervised learning leert van gelabelde voorbeelden"). De badgeprogresie is logisch. Kleine observatie: vraag q8 (classificatie vs. regressie reflectie) heeft `points: 0` — dat is een bewuste keuze maar kan verwarrend zijn voor leerlingen die niet begrijpen waarom hun antwoord niet meetelt.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 22B (Programmeren): ML-trainingsstappen en modelkeuze passen bij computationeel denken
- [x] 21D (AI): supervised learning, neurale netwerken, model-evaluatie zijn kern van AI-geletterdheid
- [x] 21C (Data & Dataverwerking): dataset-analyse, features, train/test-split zijn dataverwerking
- [x] Mapping is consistent tussen `slo-kerndoelen-mapping.ts` (week 1, J3) en de missie-inhoud

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:152`

**Score:** 5 / 5

**Opmerkingen:**
> De drievoudige SLO-koppeling (22B + 21D + 21C) is goed onderbouwd en aantoonbaar aanwezig in de missie-inhoud. Geen mismatch gevonden.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — inhoudelijk uitdagend maar begrijpelijk
- [ ] Staafgrafiek gebruikt kleur als primaire onderscheidingsdimensie — geen tekstlabels als alternatief voor kleurblinde leerlingen
- [x] Tabel-interactiviteit (sorteren) is toetsenbord-toegankelijk in standaard HTML-tabel
- [x] Geen informatie uitsluitend via kleur voor kritieke vragen — multiple choice en number-input zijn kleur-onafhankelijk
- [ ] Alt-teksten voor eventuele afbeeldingen niet verifieerbaar

**Bronbestanden:** `components/missions/templates/data-viewer/configs/ml-trainer.ts:92-97`

**Score:** 3 / 5

**Opmerkingen:**
> De staafgrafiek-component gebruikt kleuren om de vier modellen te onderscheiden. Voor leerlingen met kleurblindheid kan dit een probleem zijn als er geen patroon of tekst-alternatief is. De tabel-component scoort beter: sorteerbare kolommen zijn functioneel zonder kleuronderscheid.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Helder intro, goede feature-bullets |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex-kleuren in grafiek |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekende opbouw, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Alle concepten correct, sterke analogieën |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + 3/3 STEP_COMPLETE |
| 6. Interactiviteit | 4 | ×1 = 4 | Gevarieerd, integratie DataViewer+standalone onduidelijk |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scoring compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22B+21D+21C aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek-kleuren zonder alternatief |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (3×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — ruim boven de 80% drempel)

> Een van de sterkste missies in J3. Didactisch solide, inhoudelijk correct, AI-coach goed geconfigureerd. De twee kleine verbeterpunten (hex-kleuren en staafgrafiek-toegankelijkheid) blokkeren de inzet niet.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-kleuren in `chartData` vervangen door `lab-*` tokens of Tailwind-klassen | Medium |
| 2 | 9. Toegankelijkheid | Staafgrafiek: voeg tekstlabels toe aan de bars zodat kleur niet het enige onderscheidingsmiddel is | Medium |

#### Nice-to-haves (score 4 — optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Verduidelijken hoe DataViewer en MLTrainerMission.tsx samenhangen — zijn het twee losse routes of één flow? |
| 2 | 7. Afronding | Uitleg toevoegen waarom q8 `points: 0` heeft, zodat leerlingen begrijpen dat het een bonusvraag is |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
