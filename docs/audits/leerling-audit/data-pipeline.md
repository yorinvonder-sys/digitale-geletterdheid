# Audit — Data Pipeline (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-pipeline` |
| **Titel** | Data Pipeline |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | DataViewer |
| **SLO-kerndoelen** | 21C (Data & Dataverwerking), 22B (Programmeren) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Word een Data Engineer" is concreet en actief
- [x] `introDescription` maakt ETL-concept direct duidelijk — "Ruwe data is altijd een puinhoop" is een eerlijke en boeiende opener
- [x] Emoji 🔧 past bij het engineering/bouwen-thema
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (3 bullets) zijn concreet en variëren: analyseren, vergelijken, beoordelen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-pipeline.ts:3-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. "Ruwe data is altijd een puinhoop" is de eerlijkste introductiezin van alle J3-missies — het zet meteen de juiste verwachting. De drie features zijn concreet en beschrijven een oplopende reeks van herkennen → vergelijken → kiezen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Staafgrafiek gebruikt hardcoded hex-kleuren (`#EF4444`, `#3B82F6`, `#F97316`, `#10B981`) — consistent patroon probleem
- [x] DataViewer responsive lay-out is bewezen
- [x] De sensordata-tabel heeft 5 kolommen — hanteerbaarder dan de 7-koloms neuron-tabel
- [x] "Probleem?"-kolom in de tabel maakt direct visueel duidelijk welke rijen fouten bevatten

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-pipeline.ts:88-93`

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde hardcoded kleurenproblematiek als ml-trainer en neural-navigator. De tabel-opzet is echter slim: de "Probleem?"-kolom als extra kolom maakt het leerproces zelf zichtbaar in de tabel. Dit is een goed didactisch ontwerpdetail.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Rommelige data herkennen (tabel) → Effect van opschoning zien (grafiek) → Strategieën begrijpen (kaarten)
- [x] Elke stap bouwt voort — je ziet eerst de rommel, dan het effect van opschoning, dan de gereedschapskist
- [x] Moeilijkheid past bij leerjaar — "Hard" maar haalbaar met scaffolding
- [x] STEP_COMPLETE markers aanwezig (3/3): problemen geïdentificeerd → transformatiestrategieën beschreven → schone data beschreven
- [x] "Garbage in, garbage out" als rode draad is een krachtig en herkenbaar concept

**Bronbestanden:** `config/agents/year3.tsx:317-320`, `components/missions/templates/data-viewer/configs/data-pipeline.ts`

**Score:** 5 / 5

**Opmerkingen:**
> De driedelige opbouw (herkennen → meten → aanpakken) is didactisch sterk. Het schoolgebouw-sensordata-scenario is geloofwaardig voor J3. De "Probleem?"-kolom is een slimme didactische keuze die het leren van data-kwaliteitsherkenning direct zichtbaar maakt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] ETL-definitie correct — Extract, Transform, Load
- [x] q1: 5 rijen met problemen — correct (duplicaat, missende waarde, inconsistente naam+fout getal, verkeerd datumformaat, onmogelijke waarde)
- [x] q4: Verschil 47.8-21.6 = 26.2 graden — correct
- [x] Imputatie-strategie correct beschreven — gemiddelde van omliggende waarden
- [x] Vier transformatiestrategieën (verwijderen/imputatie/standaardiseren/uitschieters markeren) zijn correct en compleet
- [x] "lokaal 3a" vs "Lokaal 3A" als voorbeeld van inconsistentie is concreet en herkenbaar
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-pipeline.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De numerieke voorbeelden zijn exact correct. De sensordata-tabel bevat zorgvuldig geconstrueerde fouten die precies de vier strategieën illustreren. De "215°C vs 21.5°C" fout is een uitstekend voorbeeld dat het effect van één uitschieter op een gemiddelde dramatisch illustreert.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Data Engineer gevraagd — urgente situatie!"
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "Data Engineer" is professioneel maar toegankelijk
- [x] Sensordata van de school als rode draad verankerd in SCOPE GUARD

**Bronbestanden:** `config/agents/year3.tsx:293-355`

**Score:** 5 / 5

**Opmerkingen:**
> Volledig geconfigureerde coach. De urgentietoon ("urgente situatie!") in het EERSTE BERICHT past goed bij het data-engineering scenario.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Tabel sorteren/filteren op "Probleem?" kolom is didactisch passend — direct leerbaar
- [x] Multiple choice, number-input en text-observation geven goede variatie (8 vragen)
- [x] De tabel-interactiviteit met de "Probleem?"-kolom is een slim didactisch ontwerp
- [x] DataViewer is bewezen werkend

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-pipeline.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit. Minpuntje: vraag q8 (reflectievraag over nadelen imputatie) heeft `points: 0` — dit geeft waardevolle discussie maar geen score-incentief. Het is didactisch verdedigbaar maar kan demotiverend zijn.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 Data Engineer Pro! (≥85), 🔧 Pipeline Bouwer (≥65), 📊 ETL Beginner (≥40), 📚 Aan de slag! (≥0)
- [x] `maxScore: 100` is helder
- [x] `takeaways[]` aanwezig — 5 kernlessen inclusief de krachtige "Garbage in, garbage out"
- [x] Badgenames zijn thematisch consistent en professioneel

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-pipeline.ts:200-234`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaway "Garbage in, garbage out: slechte data levert altijd slechte analyses op" is de essentie van de missie in één zin.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 21C (Data & Dataverwerking): ETL, data-opschoning, en transformatiestrategieën zijn kern van dataverwerking
- [x] 22B (Programmeren): ETL-processen zijn programmeertaken; het ontwerpen van een pipeline is computational thinking
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 1, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:155`

**Score:** 5 / 5

**Opmerkingen:**
> De dubbele SLO-koppeling is goed onderbouwd. Data-pipeline is het meest directe voorbeeld van 21C in het J3-curriculum.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [ ] Staafgrafiek gebruikt kleur als primair onderscheidingsmiddel (4 kleuren voor 4 groepen)
- [x] "Probleem?"-kolom in de tabel is tekst-gebaseerd — toegankelijk
- [x] DataViewer heeft standaard focus states

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde staafgrafiek-toegankelijkheidsprobleem als de andere DataViewer-missies. De tabel-component is hier echter beter dan bij neural-navigator (minder kolommen, "Probleem?"-kolom als tekstindicator).

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Eerlijk, boeiend, concreet |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex-kleuren in grafiek |
| 3. Didactische flow | 5 | ×2 = 10 | Sterk scenario, STEP_COMPLETE compleet |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Alle getallen en concepten correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Goed, q8 heeft 0 punten zonder uitleg |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges en takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C+22B aantoonbaar aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek-kleuren zonder alternatief |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (3×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar** (90,9% — ruim boven de 80% drempel)

> Sterke missie met een praktisch en herkenbaar scenario. Geen blokkerende issues.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex-kleuren in `chartData` vervangen door `lab-*` tokens | Medium |
| 2 | 9. Toegankelijkheid | Staafgrafiek: voeg datawaarden als tekstlabel toe aan de bars | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | q8 (`points: 0`) label toevoegen als "bonusvraag" zodat leerlingen weten dat het een reflectieopdracht is zonder score |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
