# Audit — AI Bias Detective (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-bias-detective` |
| **Titel** | AI Bias Detective |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | ScenarioEngine (4 rondes: select-correct, order-priority, binary-choice, select-correct) |
| **SLO-kerndoelen** | 21D, 23C |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "AI Bias Detective" is uitnodigend en mysterieus
- [x] `introDescription` beschrijft het leerdoel concreet (bias herkennen, risico's rangschikken)
- [x] `introFeatures` bevat 4 concrete leeractiviteiten
- [x] Moeilijkheidsgraad "Medium" is correct — bias is een abstract concept maar de ScenarioEngine maakt het concreet
- [x] Rode kleur en vergrootglas-icoon zijn passend voor een detective-missie

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts:1-15`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De detective-framing is motiverend. De vier introFeatures beschrijven precies de vier rondes. De rode kleur communiceert urgentie, passend bij een missie over eerlijkheid en gelijkheid.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Rode kleurschema is consistent door de hele missie
- [x] Vier rondetypen bieden visuele afwisseling
- [ ] Badge-kleuren (`#DC2626`, `#10B981`, `#6B6B66`) zijn hardcoded hex
- [x] Ronde-iconen (🚩, ⚠️, ⚖️, 🛠️) zijn passend en herkenbaar
- [x] Visuele preview is eenvoudige gradient — geen render-risico's

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts:17-49`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De rode urgentie-kleur is een bewuste keuze die past bij het thema AI-eerlijkheid. Hardcoded badge-kleuren zijn het enige verbeterpunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen rondes op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: herkennen → rangschikken op risico → eerlijk vs scheef beoordelen → oplossingen
- [x] Elke ronde traint een andere vaardigheid (herkennen, risico-analyse, beoordelen, evalueren)
- [x] Ronde 1 geeft de conceptuele basis (wat is bias?), ronde 4 geeft de oplossingen
- [x] Ronde 2 leert risicodenken — een hogere cognitieve vaardigheid
- [x] De moeilijkheidsgraad stijgt per ronde (van herkennen naar oplossingen evalueren)
- [x] De verbinding met J1P4 (review-week-3 had ook AI-bias) bouwt op eerder geleerde kennis

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts:50-386`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De vier rondes volgen een Bloom-progressie: herkennen → analyseren → evalueren → oplossingen bedenken. Het is bijzonder goed dat ronde 4 specifiek over oplossingen gaat — de missie eindigt constructief in plaats van enkel problemen te signaleren.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle AI-bias scenario's inhoudelijk?

**Checkpunten:**
- [x] CV-filter-bias (Amazon 2018 casus) is een gedocumenteerde, reële casus
- [x] Gezichtsherkenningsbias (Joy Buolamwini) is correct en goed geciteerd
- [x] Pijnbehandelingsalgoritme (ziekenhuis VS) is een gedocumenteerde casus
- [x] Navigatieapp-bias (vrachtwagens door woonwijken) is een herkenbaar en plausibel voorbeeld
- [x] COMPAS-systeem (strafrechtspraak) is de bekendste bias-casus en correct beschreven
- [x] Ronde 4 (oplossingen): alle 6 correcte antwoorden zijn inhoudelijk juist (diverse data, diverse teams, fairness audits, transparantie, wetgeving, participatief ontwerp)
- [x] EU AI Act-referentie is correct (explainability als vereiste voor hoog-risico AI)
- [x] Taalgebruik op B1/B2-niveau, gevoelig maar niet betuttelend

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De casussen zijn reëel en gedocumenteerd — dit versterkt de geloofwaardigheid. De EU AI Act-referentie in ronde 4 (oplossingen) is een waardevolle koppeling aan actuele regelgeving die leerlingen in dit curriculum zullen tegenkomen. De selectie van "AI sneller en goedkoper maken" als fout antwoord (het ís geen oplossing voor bias) is pedagogisch uitstekend.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "Wist je dat AI-systemen soms per ongeluk discrimineren?"
- [x] STEP_COMPLETE markers aanwezig (3/3): analyse, bias identificeren, verbetervoorstel
- [x] SCOPE GUARD aanwezig
- [x] Gevoeligheid over identiteit (gender, etniciteit) expliciet benoemd als instructie
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year2.tsx:449-512`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. De expliciete instructie "Wees gevoelig: bias raakt aan identiteit" is cruciaal voor een missie die discriminatie bespreekt in een klas met 13-14 jarigen. EERSTE BERICHT, STEP_COMPLETE markers (3/3) en SCOPE GUARD zijn alle aanwezig.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Vier afwisselende rondetypen houden de aandacht vast
- [x] Ronde 2 (order-priority) is bijzonder interactief — leerlingen slepen risicovolgorde
- [x] Ronde 3 (binary-choice: eerlijk/scheef?) is verrassend uitdagend — niet alle bias is meteen zichtbaar
- [x] De verrassende antwoorden (navigatieapp = bias, medicinedosering op gewicht = eerlijk) stimuleren onverwacht leren
- [x] Casussen zijn uit het echte leven — geen verzonnen scenario's

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De binary-choice ronde (eerlijk/scheef?) is de sterkste ronde: leerlingen moeten nuanceren en denken na over het verschil tussen eerlijke personalisatie en echte bias. De "verrassende" antwoorden (navigatieapp, filterbubbel) stimuleren diep leren.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges: AI Eerlijkheidsexpert (80+), Bias Detective (60+), Goed Begonnen (40+), Blijf Oefenen (0+)
- [x] `takeaways[]` bevat 5 memorabele leerpunten
- [x] Per ronde is een `maxScore` gedefinieerd (25+25+25+25 = 100)
- [x] Feedback per ronde is aanwezig (feedbackCorrect/feedbackIncorrect)

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De takeaway "Als AI wordt gebruikt voor beslissingen die mensen raken, moet er altijd menselijk toezicht zijn" is een krachtige en relevante boodschap. De badges zijn passend. De totale puntentelling klopt (4 × 25 = 100).

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21D (AI) sluit aan — leerling begrijpt AI-bias als eigenschap van AI-systemen
- [x] SLO 23C (Maatschappij) sluit aan — maatschappelijke impact van bevooroordeelde AI
- [x] slo-kerndoelen-mapping.ts: `ai-bias-detective` → `['21D', '23C']` — correct
- [x] Periode 1 J2 context klopt: AI-bias bouwt voort op J1P2 (AI-basiskennis) en J1P4 (review-week-3 AI-ethiek)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:101`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie bouwt voort op de AI-kennis uit J1 en verdiept het maatschappijaspect (23C) met concrete, gedocumenteerde casussen. De koppeling aan de EU AI Act maakt de actuele relevantie duidelijk.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1/B2-niveau — passend voor J2
- [x] Gevoelige onderwerpen (gender, etniciteit, discriminatie) worden respectvol behandeld
- [x] Select-correct format is inclusief — meerdere antwoorden mogelijk
- [x] Feedback bij foute antwoorden is niet-bestraffend en leerzaam
- [ ] Ronde 2 (strafrechtspraak, leningen, sollicitaties) kan abstract zijn voor 13-14 jarigen die dit nog niet uit eigen ervaring kennen

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/ai-bias-detective.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De gevoelige onderwerpen worden respectvol behandeld. Ronde 2 (risico-rangschikking) kan abstract zijn voor 13-14 jarigen die nog geen ervaring hebben met sollicitaties, hypotheken of rechtszaken. De casus-uitleg per item compenseert dit deels, maar de persoonlijke relevantie is minder dan bij de andere rondes.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Motiverende detective-framing |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded badge-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-progressie, eindigt constructief |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Gedocumenteerde casussen, EU AI Act correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle vereisten aanwezig, gevoeligheidsinstructie |
| 6. Interactiviteit | 5 | ×1 = 5 | Verrassende antwoorden stimuleren diep leren |
| 7. Afronding & feedback | 5 | ×1 = 5 | Puntentelling klopt, memorabele takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21D + 23C correct, bouwt op J1 |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Ronde 2 abstract voor 13-14 jarigen |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar voor inzet** (89,1% — ruim boven de 80% drempel)

> Een van de sterkste missies in het hele curriculum. Inhoudelijk rijke, maatschappelijk relevante missie met uitstekende didactische opbouw. De combinatie van echte casussen, Bloom-progressie en constructief einde (oplossingen) maakt dit een modelleermissie.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded badge-kleuren vervangen door `lab-*` tokens | Laag |
| 2 | 9. Toegankelijkheid | Ronde 2-context verankeren met een intro-zin die de link naar de leerling verduidelijkt | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
