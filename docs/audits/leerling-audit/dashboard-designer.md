# Audit — Dashboard Designer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `dashboard-designer` |
| **Titel** | Dashboard Designer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | DataViewer (3 datasets: tabel, cirkelgrafiek, document-cards) |
| **SLO-kerndoelen** | 21C, 22A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Word een Dashboard Designer" is motiverend
- [x] `introDescription` beschrijft het leerdoel concreet (school-/sportclubdata, visualisatieprincipes)
- [x] `introFeatures` bevat 3 concrete leeractiviteiten
- [x] Moeilijkheidsgraad "Hard" is correct — dashboard-ontwerp vereist metacognitive redenering
- [x] Blauwe kleur en dashboard-icoon zijn passend voor data-visualisatie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. "Een goed dashboard vertelt een verhaal zonder woorden" is een motiverende en memorabele uitspraak. De concrete context (school-/sportclub) maakt het direct relevant voor 13-14 jarigen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Blauwe kleurschema is consistent door de hele missie
- [x] Drie dataset-types (tabel, cirkelgrafiek, document-cards) bieden visuele variatie
- [x] Cirkelgrafiek is een nieuwe type versus de staafgrafieken in eerdere J2P1-missies
- [ ] Hardcoded chart-kleuren (`#D97757`, `#3B82F6`, etc.) in de cirkelgrafiek
- [x] Document-cards over dashboard-principes zijn overzichtelijk met een icoon per principe

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts:76-84`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De cirkelgrafiek is een waardevolle aanvulling na de staafgrafieken in de eerdere J2P1-missies — leerlingen zien nu meerdere visualisatietypen. Hardcoded chart-kleuren zijn het enige verbeterpunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen datasets op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: tabel (data lezen, KPI kiezen) → cirkelgrafiek (visualisatietype begrijpen) → document-cards (designprincipes leren)
- [x] Dataset 1 legt de data-basis, dataset 2 traint grafiekinterpretatie, dataset 3 geeft de meta-kennis
- [x] STEP_COMPLETE markers aanwezig in de systemInstruction (3/3)
- [x] KPI-concept wordt in dataset 1 geïntroduceerd en in dataset 3 principe verdiept
- [x] De moeilijkheidsgraad stijgt: van feitenvragen naar reflectie over ontwerp

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts`, `config/agents/year2.tsx:363-428`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De drie datasets werken samen: je leert eerst data lezen (tabel), dan een specifiek grafiektype begrijpen (cirkelgrafiek), dan de designprincipes die bepalen welk grafiek je wanneer gebruikt (document-cards). Dit is een goed doordachte kennisopbouw.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle data en uitleg inhoudelijk?

**Checkpunten:**
- [x] Dataset 1: 2C heeft laagste cijfer (6.4) EN laagste aanwezigheid (89%) — klopt
- [x] Dataset 1: aanwezigheidspercentages 97-89=8 procentpunt — klopt
- [x] Dataset 2: Wiskunde 28% als grootste segment — klopt met chartData
- [x] Dashboard-principes (Ken je doelgroep, juiste visualisatie, minder is meer, kleur bewust) zijn correct en zijn de vier standaardprincipes uit de UX/data-visualisatieliteratuur
- [x] Edward Tufte-referentie ("data-ink ratio") is correct en een relevante verdieping
- [x] Taalgebruik op B1/B2-niveau — passend voor een "Hard" missie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De vier dashboardprincipes zijn professionele standaarden die ook in de echte werkwereld worden gebruikt. De Edward Tufte-referentie is een waardevolle verdieping voor nieuwsgierige leerlingen. Alle berekeningen zijn correct.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "Dashboard Studio — jouw projectbrief is binnen!"
- [x] STEP_COMPLETE markers aanwezig (3/3): data+doelgroep, visualisatiekeuze, dashboard-ontwerp
- [x] SCOPE GUARD aanwezig
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX
- [x] Pedagogische aanpak: altijd vanuit perspectief eindgebruiker beoordelen

**Bronbestanden:** `config/agents/year2.tsx:363-428`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. Het EERSTE BERICHT simuleert een echte "klantbrief" (sportclub die een dashboard wil), wat de missie authentiek maakt. STEP_COMPLETE markers (3/3) en SCOPE GUARD aanwezig.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Schooldata als context is direct herkenbaar voor leerlingen (ze zijn zelf leerling in leerjaar 2)
- [x] Cirkelgrafiek-interactie is nieuw t.o.v. de eerdere J2P1-missies
- [x] KPI-keuze vraag (q3) is een open vraag die creatief denken stimuleert
- [x] Dashboard-reflectie voor klas 2C (q8) is een praktijkgerichte toepassing
- [x] Document-cards over designprincipes zijn leesbaar en praktisch

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De keuze voor schooldata (klas 2A-2D) is slim — leerlingen herkennen de context direct omdat ze zelf in leerjaar 2 zitten. De KPI-keuze vraag ("welke 2 cijfers zou jij kiezen?") is open maar goed gestructureerd.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges: Dashboard Designer Pro! (85+), Data Visualist (65+), Dashboard Starter (40+), Aan de slag! (0+)
- [x] `takeaways[]` bevat 5 concrete leerpunten
- [x] Punten per vraag: 15+15+10+10+15+10+15+0 = 90 — telt NIET op tot 100. Laatste vraag (q8) heeft 0 punten
- [ ] q8 heeft `points: 0` wat merkwaardig is — de reflectievraag is didactisch waardevol maar telt niet mee

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts:160-181`

**Score:** 4 / 5

**Opmerkingen:**
> Goede badges en takeaways. Aandachtspunt: de puntentelling telt op tot 90 (q8 heeft 0 punten), niet 100. Dit is consistent met api-verkenner, dus mogelijk intentioneel (AI-coach geeft de resterende punten), maar het moet gedocumenteerd worden. De keuze om q8 nul punten te geven is pedagogisch begrijpelijk (open reflectie is moeilijk te scoren) maar onduidelijk voor leerlingen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21C (Data en dataverwerking) sluit aan — data lezen, KPI kiezen, visualisaties interpreteren
- [x] SLO 22A (Digitale producten) sluit aan — dashboard ontwerpen
- [x] slo-kerndoelen-mapping.ts: `dashboard-designer` → `['21C', '22A']` — correct
- [x] Periode 1 J2 context klopt: dashboard-design bouwt voort op data-journalist (visualiseren)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:100`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. Dashboard-design brengt 21C (data begrijpen) en 22A (digitaal product ontwerpen) samen in een authentieke, herkenbare context.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1/B2-niveau, passend voor een "Hard" J2-missie
- [x] "KPI" wordt uitgelegd als "Key Performance Indicator: de meest relevante maatstaven"
- [x] Edward Tufte-referentie is verdiepend maar niet vereist voor begrip
- [x] Document-cards zijn overzichtelijk — elk principe apart
- [ ] "Data-ink ratio" als concept is abstract en wordt niet volledig uitgelegd in de context

**Bronbestanden:** `components/missions/templates/data-viewer/configs/dashboard-designer.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid voor een "Hard" missie. De expliciete uitleg van KPI is een goede toegankelijkheidsinterventie. "Data-ink ratio" wordt als referentie vermeld maar niet uitgelegd — voor nieuwsgierige leerlingen is dit een springplank, voor anderen is het onduidelijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Motiverend, herkenbare schoolcontext |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded chart-kleuren, cirkelgrafiek goed |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekende opbouw, goede KPI-introductie |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, professionele principes |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle vereisten aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | Schoolcontext motiverend, goede vragen |
| 7. Afronding & feedback | 4 | ×1 = 4 | q8 heeft 0 punten, puntentelling = 90 |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C + 22A correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Data-ink ratio abstract |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (4×1) + (5×1) + (4×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar voor inzet** (87,3% — boven de 80% drempel)

> Sterke missie met uitstekende didactische opbouw. De schooldata-context maakt de missie direct relevant. De puntentelling-discrepantie (90 vs 100) en de 0-punten-vraag zijn aandachtspunten maar geen blokkades.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 7. Afronding | Beslissen: q8 punten geven (bijv. 10) en maxScore behouden op 100, of maxScore naar 90 bijstellen | Medium |
| 2 | 2. Visueel | Hardcoded chart-kleuren vervangen door `lab-*` tokens | Laag |
| 3 | 9. Toegankelijkheid | "Data-ink ratio" kort uitleggen of als verdiepingslink markeren | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
