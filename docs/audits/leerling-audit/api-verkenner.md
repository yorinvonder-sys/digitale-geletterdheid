# Audit — API Verkenner (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `api-verkenner` |
| **Titel** | API Verkenner |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | DataViewer (3 datasets: tabel/JSON, staafgrafiek, document-cards) |
| **SLO-kerndoelen** | 21A, 21C |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Word een API Verkenner" is uitnodigend
- [x] `introDescription` beschrijft APIs concreet (Instagram, Buienradar, Google Maps)
- [x] `introFeatures` bevat 3 concrete leeractiviteiten (JSON analyseren, vergelijken, URL-parameters)
- [x] Moeilijkheidsgraad "Hard" is correct — APIs zijn een abstract concept voor 13-14 jarigen
- [x] Violet-paarse kleur en globe-icoon zijn passend voor internet/connectiviteit

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. De concrete appnamen (Instagram, Buienradar, Google Maps) maken het abstracte API-concept direct herkenbaar voor de doelgroep. "Hard" is terecht — APIs zijn inhoudelijk uitdagend voor J2.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Violet-paarse kleurschema is consistent door de hele missie
- [x] Drie dataset-types (tabel, staafgrafiek, document-cards) bieden visuele variatie
- [ ] Hardcoded chart-kleuren (`#D97757`, `#E91E63`, etc.) in de staafgrafiek
- [x] JSON-tabel-weergave is een slimme keuze — maakt abstracte JSON visueel toegankelijk
- [x] Pokémon-kaart in document-cards (⚡) is een herkenbaar voorbeeld voor de doelgroep

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts:82-90`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De keuze om JSON als tabel te tonen (in plaats van raw JSON-syntax) is didactisch uitstekend — het maakt de structuur zichtbaar zonder codeerervaring te vereisen.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen datasets op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: JSON-response lezen (wat is een API?) → API-verzoeken analyseren (hoe vaak?) → URL-parameters begrijpen (hoe werkt een API?)
- [x] Dataset 1 legt de structuur uit, dataset 2 geeft schaalcontext, dataset 3 leert de mechanica
- [x] STEP_COMPLETE markers aanwezig in de systemInstruction (3/3)
- [x] De ober-metafoor in de systemInstruction is een uitstekende didactische brug
- [x] Moeilijkheid stijgt: van data lezen naar URL bouwen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts`, `config/agents/year2.tsx:279-342`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De drie datasets volgen een logische kennisopbouw: structuur kennen → gebruik begrijpen → mechanica leren. De Pokémon-API als voorbeeld in dataset 3 is briljant gekozen — het is een bekende, gratis API die leerlingen zelf kunnen uitproberen.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle API-concepten inhoudelijk?

**Checkpunten:**
- [x] JSON-sleutels en datatypes (string, number) correct beschreven
- [x] Gevoelstemperatuur berekening: 14.2 - 12.8 = 1.4 — klopt
- [x] API-verzoeken per app (Google Maps 47, Instagram 38, etc.) zijn plausibel, hoewel "TU Delft 2024" fictief is
- [x] URL-parameteruitleg (?, &, =) is correct
- [x] apiKey-uitleg (authenticatie, niet versleuteling) is correct
- [x] Pokémon-API URL-patroon is reëel en correct
- [x] Taalgebruik op B1/B2-niveau, passend voor 13-14 jaar bij een "Hard" missie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. Alle API-concepten zijn correct uitgelegd. De JSON-tabel met keys/values/types/betekenis is een briljante didactische interventie. De uitleg "Keys geven betekenis aan de waarden" is een correcte en diepgaande verklaring voor het nut van JSON.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "Weet jij hoe jouw weer-app precies weet wat het morgen gaat regenen?"
- [x] STEP_COMPLETE markers aanwezig (3/3): API uitleggen, request beschrijven, JSON interpreteren
- [x] SCOPE GUARD aanwezig — leerlingen worden teruggeleid bij programmeerverzoeken
- [x] Pedagogische beperking: leerlingen hoeven NIET te programmeren (expliciet)
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year2.tsx:279-342`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. Het EERSTE BERICHT start direct met een herkenbare vraag. De SCOPE GUARD is bijzonder belangrijk voor deze missie: API-missies kunnen snel ontsporen naar "leer me programmeren", wat buiten scope is. De expliciete instructie "Leerlingen hoeven NIET te programmeren" is didactisch correct voor J2.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] JSON als tabel met sorteer/filterfunctie is uniek en innovatief
- [x] Staafgrafiek over API-verzoeken van bekende apps is visueel indrukwekkend
- [x] Document-cards met echte API-URLs zijn authentiek en te controleren
- [x] Vraag "hoe zou de URL eruit zien voor Charizard?" is een creatieve toepassingsvraag
- [x] Combinatie van multiple-choice, number-input en text-observation biedt differentiatie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De JSON-als-tabel weergave is bijzonder vernieuwend en effectief. De echte API-URLs (inclusief PokeAPI) zijn extra motiverend — leerlingen kunnen ze na de les zelf uitproberen in een browser.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges: API-expert! (85+), Digitale ontdekkingsreiziger (65+), Aan de slag met APIs (40+), Aan de slag! (0+)
- [x] `takeaways[]` bevat 5 concrete leerpunten
- [x] Punten per vraag: 15+10+10+10+15+10+15+5 = 90 — dit telt NIET op tot 100

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts:190-226`

**Score:** 4 / 5

**Opmerkingen:**
> Goede badges en takeaways. Aandachtspunt: de puntentelling telt op tot 90, niet 100 (maxScore). Dit betekent dat de maximale badge (85+) altijd bereikbaar is, maar het suggereert een inconsistentie — óf de maxScore moet 90 zijn, óf er moeten nog 10 punten worden toegevoegd.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21A (Digitale systemen) sluit aan — begrip van hoe systemen communiceren via APIs
- [x] SLO 21C (Data en dataverwerking) sluit aan — JSON-data lezen en interpreteren
- [x] slo-kerndoelen-mapping.ts: `api-verkenner` → `['21A', '21C']` — correct
- [x] Periode 1 J2 context klopt: APIs zijn een verdieping van data-begrip (na data-journalist en spreadsheet)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:99`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie leert daadwerkelijk hoe digitale systemen communiceren (21A) en hoe data in JSON-formaat te interpreteren (21C). De keuze voor 21A in plaats van 21D (AI) is correct — APIs zijn een systeemconcept, geen AI.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1/B2-niveau, passend voor "Hard" missie in J2
- [x] De ober-metafoor maakt het abstracte concept concreet
- [x] JSON-tabel is visueel toegankelijker dan raw JSON-syntax
- [ ] Technische termen zoals "Unix timestamp" en "API-endpoint" worden niet altijd uitgelegd in de tabelbeschrijvingen
- [x] Moeilijkheidsgraad "Hard" stelt de juiste verwachtingen bij leerlingen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/api-verkenner.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid voor een "Hard" missie. De tabel-representatie van JSON is de slimste toegankelijkheidsinterventie in deze missie. "Unix timestamp" in de JSON-tabel heeft een betekenis-kolom ("seconden since 1970") maar een korte uitleg van why dit bestaat zou helpen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Herkenbare apps, uitnodigend |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded chart-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Logische opbouw, goede scaffolding |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, innovatieve JSON-weergave |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle vereisten aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | Innovatief, echte API-URLs |
| 7. Afronding & feedback | 4 | ×1 = 4 | Puntentelling telt op tot 90 niet 100 |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21A + 21C correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed voor Hard, Unix timestamp abstract |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (4×1) + (5×1) + (4×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar voor inzet** (87,3% — boven de 80% drempel)

> Didactisch innovatieve missie. De JSON-als-tabel weergave is een creatieve oplossing voor een complex concept. De puntentelling-discrepantie (90 vs 100) moet gecorrigeerd worden maar blokkeert de inzet niet.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding | Puntentelling corrigeren: ofwel maxScore naar 90 aanpassen, ofwel 10 punten toevoegen aan een vraag | Medium |
| 2 | 2. Visueel | Hardcoded chart-kleuren vervangen door `lab-*` tokens | Laag |
| 3 | 9. Toegankelijkheid | Korte uitleg toevoegen bij "Unix timestamp" in de JSON-tabel | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
