# Audit — Factchecker (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `factchecker` |
| **Titel** | Factchecker |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | ScenarioEngine (4 rondes: select-correct, order-priority, binary-choice, select-correct) |
| **SLO-kerndoelen** | 21B, 23C |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Factchecker" is direct herkenbaar
- [x] `introDescription` beschrijft het leerdoel concreet (desinformatie herkennen, CRAAP-methode)
- [x] `introFeatures` bevat 4 concrete leeractiviteiten
- [x] Moeilijkheidsgraad "Easy" is logisch voor een J2 introductie-missie
- [x] Amber-gele kleur en vergrootglas-icoon zijn passend voor onderzoeksjournalistiek

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts:1-16`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De framing als detective die desinformatie opspoort is intrinsiek motiverend. De vier introFeatures beschrijven exact wat de leerling gaat doen. "Easy" is correct — de ScenarioEngine-missies zijn interactiever dan open opdrachten.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Amber-gele kleur is consistent door de hele missie
- [x] Vier rondes bieden visuele variatie (select-correct, order-priority, binary-choice, select-correct)
- [ ] Badge-kleuren (`#D97706`, `#10B981`, `#6B6B66`) zijn hardcoded hex
- [x] Ronde-iconen (🚩, 📊, 🤔, 🧪) zijn passend en herkenbaar
- [x] Visuele preview is eenvoudig gradient met icoon — geen risico op render-problemen

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts:17-41`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De vier rondes zorgen voor afwisseling en houden de aandacht vast. Hardcoded badge-kleuren zijn het enige verbeterpunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen rondes op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: rode vlaggen herkennen → bronnen rangschikken → delen of niet? → CRAAP toepassen
- [x] Elke ronde traint een andere vaardigheid (herkennen, rangschikken, beslissen, toepassen)
- [x] Ronde 1 (rode vlaggen) geeft de conceptuele basis voor de rest
- [x] Ronde 3 (delen of niet?) is toepassingsgericht — de meest praktische vaardigheid
- [x] Ronde 4 (CRAAP-methode) consolideert de geleerde methode
- [x] Moeilijkheidsgraad stijgt per ronde (van herkennen naar toepassen)

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts:50-385`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De vier rondes volgen de taxonomie van Bloom: herkennen → begrijpen → toepassen → analyseren. De volgorde is pedagogisch correct: je kunt pas goed beslissen "delen of niet?" als je de methoden kent. De CRAAP-ronde sluit de missie af met een concrete methode.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle scenario's en uitleg inhoudelijk?

**Checkpunten:**
- [x] Rode vlaggen zijn correct (sensatiekoppen, oud nieuws, anonimiteit, emotioneel geladen taal)
- [x] Bronnen-rangschikking (peer-reviewed > RIVM > NOS > arts-blog > TikTok) is correct
- [x] Binary-choice items zijn goed geconstrueerd (betrouwbare vs onbetrouwbare berichten)
- [x] CRAAP-methode is correct uitgelegd en de vragen zijn goed gecategoriseerd
- [x] De uitleg "likes zijn geen indicator van betrouwbaarheid" is een waardevolle correctie van een common misconception
- [x] Taalgebruik op B1-niveau voor 13-14 jaar

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De rode vlaggen zijn realistisch en herkenbaar uit de dagelijkse mediaervaring van leerlingen. De CRAAP-methode is correct en leeftijdspassend vereenvoudigd. De uitleg bij elke vraag is diepgaand en leerzaam.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig: "BREAKING: Jij bent aangesteld als fact-checker!"
- [x] STEP_COMPLETE markers aanwezig (3/3): bron geanalyseerd, claim gecheckt, eindoordeel gegeven
- [x] SCOPE GUARD aanwezig
- [x] Pedagogische principes: nooit zomaar "dit is nep" zeggen, laat leerling zelf redeneren
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX
- [x] ScenarioEngine-template heeft ingebouwde scoring die de AI-coach aanvult

**Bronbestanden:** `config/agents/year2.tsx:195-257`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. Het "BREAKING" EERSTE BERICHT is creatief en direct motiverend. STEP_COMPLETE markers (3/3), SCOPE GUARD en anti-farmingprotectie zijn alle aanwezig. De pedagogische aanpak ("jij bent de detective, ik ben je assistent") is uitstekend voor kritisch denken.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Vier verschillende rondetypen zorgen voor afwisseling
- [x] Select-correct (meerdere antwoorden) is uitdagender dan single-choice
- [x] Order-priority (rangschikken) is interactief en visueel
- [x] Binary-choice (delen/niet delen) is direct relevant voor de dagelijkse praktijk
- [x] Feedback per item is direct en leerzaam
- [x] Onderwerp (desinformatie op social media) is direct relevant voor 13-14 jarigen

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De ScenarioEngine-template is bijzonder geschikt voor het trainen van kritisch denken: je moet actief keuzes maken en onmiddellijk uitleg ontvangen. Het "delen of niet?" format simuleert echte sociale mediasituaties die leerlingen dagelijks tegenkomen.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges: Master Factchecker (80+), Kritische Lezer (60+), Goed Begonnen (40+), Blijf Oefenen (0+)
- [x] `takeaways[]` bevat 5 memorabele leerpunten
- [x] Per ronde is een `maxScore` gedefinieerd (25+25+25+25 = 100)
- [x] Feedback per ronde (feedbackCorrect/feedbackIncorrect) geeft direct inzicht

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts:17-49`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De takeaways zijn memorabel en direct toepasbaar: "Twijfelen is een superkracht" is een krachtige boodschap voor de doelgroep. De badges zijn passend voor het thema kritisch mediagebruik.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21B (Media en informatie) sluit aan — kritisch evalueren van digitale informatie
- [x] SLO 23C (Maatschappij) sluit aan — maatschappelijke impact van desinformatie
- [x] slo-kerndoelen-mapping.ts: `factchecker` → `['21B', '23C']` — correct
- [x] Periode 1 J2 context klopt: factchecking bouwt voort op datajournalistiek (data interpreteren)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:98`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie leert daadwerkelijk mediawijsheid (21B) en het herkennen van maatschappelijke risico's van desinformatie (23C). De CRAAP-methode is een bekende, erkende methode in mediawijsheidonderwijs.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1-niveau, herkenbaar taalgebruik voor 13-14 jaar
- [x] Select-correct format is inclusief — leerlingen kunnen meerdere antwoorden selecteren
- [x] Feedback bij elk item is begrijpelijk en niet-bestraffend
- [x] Binary-choice is de meest laagdrempelige interactievorm
- [x] Geen informatie uitsluitend via kleur overgebracht

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/factchecker.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende toegankelijkheid. De ScenarioEngine-template is inherent laagdrempeliger dan open schrijfopdrachten: leerlingen kiezen uit gegeven opties in plaats van vrije tekst te typen. De feedback bij foute antwoorden is non-punitive en leerzaam.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Motiverend, direct relevant |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded badge-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Bloom-taxonomie correct gevolgd |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, herkenbaar, CRAAP juist uitgelegd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle vereisten aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | Uitstekend, direct relevant |
| 7. Afronding & feedback | 5 | ×1 = 5 | Memorabele takeaways, goede badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21B + 23C correct |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Laagdrempelig format |
| **TOTAAL** | | **50 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (5×1) = 50
Percentage = (50 / 55) × 100% = 90,9%
```

### Verdict

**✅ Klaar voor inzet** (90,9% — ruim boven de 80% drempel)

> Een van de sterkste missies in het hele curriculum. De ScenarioEngine-template met vier afwisselende rondetypen maakt dit een uitstekende missie voor het trainen van kritisch mediagebruik.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded badge-kleuren vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
