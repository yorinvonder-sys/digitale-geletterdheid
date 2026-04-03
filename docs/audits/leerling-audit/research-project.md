# Audit — Research Project (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `research-project` |
| **Titel** | Research Project |
| **Leerjaar & Periode** | Leerjaar 3, Periode 4 (J3P4 — Meesterproef) |
| **Template-engine** | DataViewer (geen chat) |
| **SLO-kerndoelen** | 21B (Media & Informatie), 21C (Data & Dataverwerking), 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Voer een onderzoek uit"
- [x] `introDescription` is kritisch en uitnodigend — "Er wordt van alles beweerd over technologie. Maar klopt het?"
- [x] `introFeatures` beschrijft drie concrete activiteiten
- [x] Emoji (🔬) past bij wetenschappelijk onderzoek
- [x] De opening "Alleen met echt onderzoek kom je achter de waarheid" is motiverend

**Bronbestanden:** `components/missions/templates/data-viewer/configs/research-project.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De intro is sceptisch van toon ("Er wordt van alles beweerd — maar klopt het?") wat direct de wetenschappelijke kritische houding aanspreekt. Het onderwerp (schermtijd en welzijn) is direct relevant voor de doelgroep. De drie activiteiten zijn concreet en oplopend in complexiteit.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in chartData en badges
- [x] DataViewer-template geeft duidelijke structuur
- [x] Tabel met schermtijd-welzijn-data is overzichtelijk (5 kolommen, 5 rijen)
- [x] Betrouwbaarheids-grafiek is helder
- [ ] Grafiek onderscheidt methoden primair via kleur

**Bronbestanden:** `components/missions/templates/data-viewer/configs/research-project.ts:85-90`

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde structurele visuele issues als bij digital-divide-researcher en tech-impact-analyst: hardcoded hex en kleurprimaire grafiekonderscheiding. De schermtijd-tabel is compact (5×5) en goed leesbaar. De betrouwbaarheidsgrafiek heeft 6 methoden die elk via kleur onderscheiden worden — dit is een toegankelijkheidsrisico.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Dataset analyseren → Methoden vergelijken → Onderzoeksproces leren
- [x] Dataset 1 (feiten) → Dataset 2 (meta-niveau methoden) → Dataset 3 (methodologisch proces)
- [x] Moeilijkheid past bij J3P4 — correlatie vs. causaliteit is een hogere-orde concept
- [x] Correlatie vs. causaliteit wordt expliciet en correct uitgelegd
- [x] "Evidence hierarchy" in dataset 2 is een authentiek wetenschappelijk concept

**Bronbestanden:** `components/missions/templates/data-viewer/configs/research-project.ts:16-229`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. Het onderscheid tussen correlatie en causaliteit is één van de meest waardevolle wetenschappelijke inzichten die in het VO onderwezen kan worden. Dataset 2 (evidence hierarchy) voegt een meta-niveau toe — leerlingen leren niet alleen onderzoeksresultaten lezen maar ook beoordelen welk onderzoek betrouwbaar is. Dataset 3 geeft een herbruikbaar onderzoeksproces.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Correlatie vs. causaliteit correct uitgelegd — confounding variables correct benoemd
- [x] Evidence hierarchy correct — meta-analyse > experiment > cohort > enquête > case study > mening
- [x] Dataset 1 (n=200, Universiteit Leiden) is plausibel en realistisch
- [x] Berekening 42-6=36 procentpunt is correct
- [x] Getal-invoer-antwoord meta-analyse vs. enquête: 80-45=35 is correct
- [x] Wetenschappelijke conclusies voorzichtig geformuleerd
- [x] Geen spelfouten gevonden

**Bronbestanden:** `components/missions/templates/data-viewer/configs/research-project.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De evidence hierarchy is correct en corresponds met "levels of evidence" in wetenschappelijk onderzoek. De uitleg over confounding variables ("het kan ook zijn dat eenzaamheid zowel schermtijd als laag welzijn verklaart") is methodologisch correct en pedagogisch sterk. De berekeningen zijn correct. De suggestie om n>1000 te gebruiken voor verbetering is realistisch.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] Geen AI-chat in deze missie — DataViewer zonder `enableChat`
- [x] Explanations bij vragen zijn uitgebreid (60-80 woorden gemiddeld)
- [x] Verklaring correlatie vs. causaliteit is een volledige miniles
- [ ] Geen EERSTE BERICHT, STEP_COMPLETE, of Scope Guard actief
- [x] Systeminstruction aanwezig in agent (niet actief gebruikt)

**Bronbestanden:** `config/templateRegistry.ts:79` (`research-project` zonder `enableChat`)

**Score:** 3 / 5

**Opmerkingen:**
> Dezelfde structurele situatie als de andere DataViewer-missies: geen chat. De explanations zijn bijzonder goed — de correlatie/causaliteit-uitleg is rijker dan in de meeste schoolboeken. Het ontbreken van gepersonaliseerde begeleiding is een gemiste kans, zeker voor een Meesterproef-missie die persoonlijk onderzoekswerk ondersteunt.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Sorteerbare schermtijd-tabel — leerling kan zelf patroon ontdekken
- [x] Rekenkundige vragen vereisen actief rekenwerk (42-6, 80-45)
- [x] Open vragen stimuleren eigen redenering
- [x] Evidence hierarchy grafiek is informatief en sorteert cognitief
- [ ] Geen gepersonaliseerde feedback op open antwoorden

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit. De sorteerbare tabel laat leerlingen het patroon zelf ontdekken — dit is actief leren. De rekenkundige vragen zijn concreet en verifieerbaar. Open vragen over correlatie vs. causaliteit zijn de sterkste didactische elementen. Nadeel: statische feedback.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Wetenschapper in spe!" (≥85%), "Data Onderzoeker" (≥65%), "Kritisch Denker" (≥40%), "Aan de slag!" (≥0%)
- [x] maxScore: 100 met puntenverdelingen per vraag
- [x] `takeaways[]` aanwezig — 5 lessen over onderzoeksvaardigheden
- [x] "Wetenschapper in spe!" is een aspirationele en aansprekende badge
- [x] Puntenverdeling logisch (15 voor inhoudelijk, 10 voor open)

**Bronbestanden:** `components/missions/templates/data-viewer/configs/research-project.ts:191-226`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De takeaways vatten de wetenschappelijke kernlessen samen: correlatie ≠ causaliteit, meta-analyse sterkste bewijs, scherpe vraagformulering, voorzichtige conclusies, beperking zelfrapportage. De badge "Wetenschapper in spe!" is aspirationeel en motiverend voor J3P4-leerlingen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 21B (Media & Informatie) aanwezig — bronnen beoordelen, informatie analyseren
- [x] 21C (Data & Dataverwerking) aanwezig — dataset analyseren, berekeningen, patronen herkennen
- [x] 23C (Maatschappij) aanwezig — maatschappelijk relevant onderwerp (schermtijd en welzijn)
- [x] Mapping correct — `['21B', '21C', '23C']` in slo-kerndoelen-mapping.ts
- [x] Leerdoel toetsbaar

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:187`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke en brede SLO-aansluiting. Drie kerndoelen worden alle drie aantoonbaar ingevuld: 21B via bronbeoordeling en evidence hierarchy, 21C via data-analyse en berekeningen, 23C via het maatschappelijk relevante onderwerp. Dit is een van de rijkste SLO-dekkingen in de catalogus.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3P4 havo/vwo
- [ ] Evidence hierarchy-grafiek: methoden onderscheiden via kleur
- [x] Tabel data is tekstueel leesbaar
- [x] Document-cards zijn tekstueel
- [ ] Kleurcontrast formeel niet geverifieerd

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde grafiek-toegankelijkheidsrisico als bij digital-divide-researcher. De evidence hierarchy grafiek heeft 6 kleur-onderscheiden methoden. Labels op de balken zijn essentieel voor toegankelijkheid.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Kritische wetenschappelijke toon, relevant topic |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, kleur-grafiek issue |
| 3. Didactische flow | 5 | ×2 = 10 | Correlatie/causaliteit, evidence hierarchy excellent |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Methodologisch correct, berekeningen kloppen |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen chat, explanations als vervanger |
| 6. Interactiviteit | 4 | ×1 = 4 | Sorteerbare tabel, rekenwerk, statische feedback |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scoring aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21B + 21C + 23C alle drie aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek-kleuronderscheiding issue |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (4×1) + (5×1) + (5×1) + (3×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar** (87,3% — boven de 80% drempel)

> Een inhoudelijk uitstekende missie die correlatie vs. causaliteit en de evidence hierarchy correct en didactisch sterk aanbiedt. De drie SLO-kerndoelen worden alle drie aantoonbaar ingevuld. Aandachtspunten: grafiek-toegankelijkheid en het ontbreken van AI-chat beperken de gepersonaliseerde leerervaring in een Meesterproef-context.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Evidence hierarchy-grafiek: labels direct op/naast balken (DataViewer-template fix) | Medium |
| 2 | 2. Visueel | Hardcoded hex vervangen door `lab-*` tokens | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 5. AI-coach kwaliteit | Chat toevoegen voor begeleiding bij open vragen over correlatie/causaliteit |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
