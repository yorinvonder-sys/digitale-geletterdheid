# Audit — Code Reviewer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `code-reviewer` |
| **Titel** | Code Reviewer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | SimulationLab |
| **SLO-kerndoelen** | 22A, 22B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig via SimulationLab-template
- [x] `introDescription` concreet — medeleerlings chaotische code reviewen
- [x] Moeilijkheidsgraad "Medium" zichtbaar en passend
- [x] EERSTE BERICHT actief — "Code Review Studio — jouw blik is gevraagd!"

**Bronbestanden:** `config/agents/year2.tsx:1016-1097`, `components/missions/templates/simulation-lab/configs/code-reviewer.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Het scenario (medeleerling heeft chaotische code geschreven) is sociaal en herkenbaar. De "jouw blik is gevraagd!" framing geeft leerlingen een gevoel van professionele verantwoordelijkheid. Het EERSTE BERICHT presenteert meteen code om te lezen, wat hands-on is.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Emerald/groen kleurthema past bij "constructief" reviewen
- [x] SimulationLab-template biedt structurele consistentie
- [ ] Hardcoded hex `#059669` in visualPreview
- [x] FileCode-icoon is thematisch correct

**Bronbestanden:** `config/agents/year2.tsx:1028-1034`

**Score:** 4 / 5

**Opmerkingen:**
> Functioneel en thematisch consistent. De groene kleur past bij de constructieve toon van code review. Hardcoded hex is een minor issue.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Lezen → Feedback → Verbeteren is correct code review proces
- [x] "Sandwich-methode" (positief → verbeterpunt → positief) is een professionele feedbacktechniek
- [x] "Review eerst, herschrijven daarna" is correct pedagogisch kader
- [x] Drie SimulationLab-simulaties met 30+40+30 = 100 punten
- [x] Moeilijkheidsgraad "Medium" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:1049-1078`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De sandwich-methode wordt als expliciete techniek aangeleerd, wat transfer naar andere feedbacksituaties mogelijk maakt. De volgorde "Lees → Begrijp → Beoordeel → Verbeter" is pedagogisch correct en professioneel. SCOPE GUARD ("Review eerst, daarna herschrijven") voorkomt dat leerlingen de review-stap overslaan.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Code quality concepten correct — naamgeving, herhaalde code, commentaar, structuur
- [x] DRY-principe correct benoemd en uitgelegd ("Don't Repeat Yourself")
- [x] Sandwich-methode correct als feedbacktechniek
- [x] Taalgebruik passend — constructief en respectvol
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:1043-1078`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. DRY, naamgeving, leesbaarheid en structuur zijn de kern van code quality. De formulering "goede code werkt niet alleen, maar is ook begrijpelijk voor anderen — en voor jezelf over 6 maanden" is een uitstekende formulering die de langetermijnwaarde van code review benadrukt.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1300 tekens
- [x] EERSTE BERICHT aanwezig — "Code Review Studio — jouw blik is gevraagd!"
- [x] STEP_COMPLETE markers aanwezig (3/3)
- [x] SCOPE GUARD aanwezig
- [x] Constructief-respectvolle toon past bij code review

**Bronbestanden:** `config/agents/year2.tsx:1035-1078`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. De STEP_COMPLETE criteria zijn goed geformuleerd: stap 1 lezen (begrijpen zonder herschrijven), stap 2 feedback op 2+ verbeterpunten, stap 3 verbeteringen implementeren. De SCOPE GUARD is precies: "Wat is het eerste verbeterpunt dat je ziet?"

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] SimulationLab biedt drie simulaties met code-review-scenario's
- [x] Leerlingen beoordelen code en geven feedback via multiple-choice + chat
- [x] maxScore: 100 (30+40+30)
- [x] Drie verschillende code-review-dimensies per simulatie

**Score:** 5 / 5

**Opmerkingen:**
> De SimulationLab is een uitstekende keuze voor code review. Leerlingen kunnen systematisch code analyseren via de simulaties. De combinatie van visuele vergelijkingen en multiple-choice vragen toetst begrip van code quality.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig in SimulationLab-config
- [x] maxScore: 100
- [x] takeaways aanwezig
- [x] Afrondingsstructuur compleet

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur via SimulationLab-template.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22A (Digitale vaardigheden) — correct, code lezen is een digitale vaardigheid
- [x] SLO 22B (Programmeren) — correct, code verbeteren is onderdeel van 22B
- [x] Mapping-opmerking ("codekwaliteit + productkwaliteit") is een correct onderscheid
- [x] Geen conflict tussen mapping en content

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:113`

**Score:** 5 / 5

**Opmerkingen:**
> Beide kerndoelen worden correct aangeraakt. 22A via het begrijpen en beoordelen van code als digitale vaardigheid; 22B via het verbeteren van code als programmeervaardigheid.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] SimulationLab heeft structurele toegankelijkheid
- [x] Multiple-choice vragen volledig tekstueel
- [x] Constructieve toon is inclusief voor alle leerlingen

**Score:** 4 / 5

**Opmerkingen:**
> Vergelijkbaar met andere SimulationLab-missies. Barchart-visualisaties kunnen kleur als primaire informatiedrager gebruiken. De rest is goed toegankelijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Medeleerling-scenario herkenbaar, hands-on |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex, groen thema correct |
| 3. Didactische flow | 5 | ×2 = 10 | Sandwich-methode sterk, volgorde correct |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | DRY correct, "6 maanden later" formulering uitstekend |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle elementen aanwezig |
| 6. Interactiviteit | 5 | ×1 = 5 | SimulationLab geschikt voor code review |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, maxScore, takeaways aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A en 22B beiden gedekt |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Barchart kleurafhankelijk |
| **TOTAAL** | | **54 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 54
Percentage = (54 / 55) × 100% = 98,2%
```

### Verdict

**✅ Klaar voor inzet** (98,2%)

> Een uitstekende missie die code review als professionele vaardigheid introduceert. De sandwich-methode, de DRY-uitleg en de volledige SimulationLab-structuur maken dit een sterke J2P2-missie.

---

### Actielijst

#### Verbeterpunten (nice-to-have)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#059669` vervangen door lab-* token | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
