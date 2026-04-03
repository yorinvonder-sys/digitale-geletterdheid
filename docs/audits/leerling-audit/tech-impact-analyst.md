# Audit — Tech Impact Analyst (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `tech-impact-analyst` |
| **Titel** | Tech Impact Analyst |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | DataViewer (geen chat) |
| **SLO-kerndoelen** | 23C (Maatschappij), 21D (AI) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Word een Tech Impact Analyst"
- [x] `introDescription` schetst de rol authentiek — "onafhankelijk analist"
- [x] `introFeatures` beschrijft drie concrete datasets/activiteiten
- [x] Emoji (🔎) past bij analytisch werk
- [x] Formulering "Technologie is nooit neutraal" zet de kritische toon meteen

**Bronbestanden:** `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De rol van "onafhankelijk analist voor de overheid" is authentiek en relevant. De formulering "Voordelen én risico's. Want technologie is nooit neutraal" geeft meteen de analytische lens mee. De drie activiteiten zijn helder en concreet.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in chartData (`#3B82F6`, `#8B5CF6`, etc.) en badges
- [x] DataViewer-template geeft duidelijke structuur
- [x] Impact-matrix (tabel) is overzichtelijk met sorteerbare kolommen
- [x] Staafgrafiek heeft kleur-labels per land
- [ ] Grafiek onderscheidt landen primair via kleur — toegankelijkheidsrisico

**Bronbestanden:** `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts:87-93`

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde structurele issues als bij digital-divide-researcher: hardcoded hex en kleur-primaire grafiekonderscheiding. De impact-matrix (tabel met domein, positief effect, negatief risico, ernst, zekerheid) is inhoudelijk rijk maar kan visueel overweldigend zijn door de breedte van de kolommen op mobiel. De DataViewer-template-breedte is een aandachtspunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Impact-matrix → AI-regulering vergelijken → Methode leren
- [x] Dataset 1 (feiten) → Dataset 2 (vergelijkend) → Dataset 3 (methodologisch): oplopende abstractie
- [x] Moeilijkheid past bij J3 havo/vwo — PESTLE-methode is uitdagend maar haalbaar
- [x] Vragen gaan van gesloten naar open
- [x] Methodologische dataset 3 geeft de leerling een herbruikbaar analyseframework

**Bronbestanden:** `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts:16-190`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. Dataset 3 (vier stappen impact-analyse) is bijzonder sterk: leerlingen leren niet alleen de inhoud maar ook de methode. Dit maakt de kennis transfereerbaar naar andere technologieën. De vraag over TikTok in de laatste dataset is een sterke afsluiting die de methode op een herkenbare context toepast.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Algoritmische bias correct uitgelegd — niet-representatieve trainingsdata is de juiste oorzaak
- [x] EU AI Act score 78 is representatief voor de relatieve strengheid (de score is fictief maar de rangorde klopt)
- [x] EU scoort hoogst — correct, de EU AI Act is 's werelds eerste uitgebreide AI-wetgeving
- [x] Vraag over sollicitatie-AI correct als "hoog risico" gelabeld (Annex III, punt 4)
- [x] Geen spelfouten gevonden
- [x] Taalgebruik is helder en professioneel voor J3

**Bronbestanden:** `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en actueel. De EU AI Act-referenties zijn correct. De uitleg over algoritmische bias ("niet-representatieve trainingsdata") is de wetenschappelijk geaccepteerde verklaring. De AI-regulering scores zijn illustratief maar de rangorde (EU > China > VK > Japan > VS > India) is representatief voor 2024. De massasurveillance-uitleg bij veiligheid/privacy is correct en goed geformuleerd.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] Geen AI-chat in deze missie — DataViewer zonder `enableChat`
- [x] Explanations bij vragen zijn uitgebreid en fungeren als coach-vervanger
- [x] Text-observation vragen bevatten rijke modelantwoorden
- [ ] Geen EERSTE BERICHT, STEP_COMPLETE, of Scope Guard actief
- [x] Systeminstruction aanwezig in agent (voor eventuele toekomstige chat)

**Bronbestanden:** `config/templateRegistry.ts:77` (`tech-impact-analyst` zonder `enableChat`)

**Score:** 3 / 5

**Opmerkingen:**
> Dezelfde situatie als digital-divide-researcher: geen chat, explanations als vervanger. De explanations zijn bijzonder uitgebreid (bijv. de massasurveillance-uitleg is een volledige miniles). De systemInstruction in het agent-bestand beschrijft de PESTLE-methode maar wordt niet actief gebruikt. Het ontbreken van gepersonaliseerde begeleiding is een structureel nadeel.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Impact-matrix is sorteerbaar op ernst-score — relevante interactie voor analyse
- [x] Multiple-choice vragen zijn direct gerelateerd aan de data
- [x] Rekenkundige vragen (EU vs. VS verschil) zijn actief
- [x] Open vragen stimuleren eigen standpuntvorming (TikTok-analyse)
- [ ] Geen gepersonaliseerde feedback op open antwoorden

**Score:** 4 / 5

**Opmerkingen:**
> De sorteerbare impact-matrix is een sterke interactie voor een analytische missie — je kunt letterlijk de "ernst 5" domeinen bovenaan sorteren om ze te identificeren. De TikTok-vraag aan het eind is uitnodigend voor de doelgroep. Structureel nadeel: statische feedback op open antwoorden.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Tech Impact Expert!" (≥85%), "Kritisch Analist" (≥65%), "Impact Onderzoeker" (≥40%), "Aan de slag!" (≥0%)
- [x] maxScore: 100 met puntenverdelingen per vraag
- [x] `takeaways[]` aanwezig — 5 lessen over bias, EU AI Act, impact-analyse
- [x] Badgenamen zijn thematisch passend
- [x] Puntenverdeling is logisch (15 punten voor inhoudelijke vragen)

**Bronbestanden:** `components/missions/templates/data-viewer/configs/tech-impact-analyst.ts:194-227`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De takeaways vatten de kernlessen compleet samen: bias, EU AI Act, impact-analyse methode, ernst/waarschijnlijkheid, winnaars/verliezers. De badge "Kritisch Analist" is aspirationeel voor 65% — een realistische lat.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23C (Maatschappij) aanwezig — impact-analyse, beleidsaanbevelingen, ethische afweging
- [x] 21D (AI) aanwezig — gezichtsherkenning, algoritmische bias, EU AI Act
- [x] Mapping correct — `['23C', '21D']` in slo-kerndoelen-mapping.ts
- [x] Leerdoel toetsbaar — concrete vragen met beoordelingscriteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:178`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 21D wordt diepgaand ingevuld via gezichtsherkenning, algoritmische bias en EU AI Act. 23C wordt ingevuld via beleidsanalyse en ethische afwegingen. De missie leert precies wat ze claimt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [ ] Staafgrafiek onderscheidt landen primair via kleur
- [x] Impact-matrix is tekstueel leesbaar
- [ ] Brede tabel (5 kolommen) kan problematisch zijn op mobiel
- [ ] Kleurcontrast formeel niet geverifieerd

**Score:** 3 / 5

**Opmerkingen:**
> Zelfde grafiek-toegankelijkheidsrisico als digital-divide-researcher. Aanvullend: de impact-matrix heeft 5 kolommen, wat op mobiel (375px breed) mogelijk horizontaal scrollen vereist. Dit is een DataViewer-template issue dat meerdere missies raakt.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Authentieke analistenrol, scherpe intro |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, grafiek-kleuronderscheiding |
| 3. Didactische flow | 5 | ×2 = 10 | Methode-leren in dataset 3 is uitstekend |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | EU AI Act correct, bias correct uitgelegd |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen chat, explanations als vervanger |
| 6. Interactiviteit | 4 | ×1 = 4 | Sorteerbare matrix sterk, statische feedback |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scoring aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C + 21D beide aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek + brede tabel op mobiel |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (4×1) + (5×1) + (5×1) + (3×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar** (87,3% — boven de 80% drempel)

> Inhoudelijk en didactisch uitstekende missie met actuele EU AI Act-inhoud en een transfereerbaar analysekader. De impact-matrix is een origineel en krachtig leergereedschap. Aandachtspunten: grafiek-toegankelijkheid en brede tabel op mobiel zijn structurele template-issues. Inzetbaar na oplossing van de grafiek-labels.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Staafgrafiek: land-labels direct op/naast balken (DataViewer-template fix) | Medium |
| 2 | 9. Toegankelijkheid | Impact-matrix (5 kolommen): horizontaal scrollen testen op 375px | Medium |
| 3 | 2. Visueel | Hardcoded hex vervangen door `lab-*` tokens | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 5. AI-coach kwaliteit | Chat toevoegen voor begeleiding bij de open vragen |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
