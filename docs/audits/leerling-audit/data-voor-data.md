# Audit — Data voor Data (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-voor-data` |
| **Titel** | Data voor Data |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 23A (privacy), 23C (maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Data voor Data" is intrigerend
- [x] `introDescription` geeft concrete verwachting — "DEAL of NO DEAL: Data Editie" is direct herkenbaar
- [x] Visueel element past bij het thema — spelshow-visual met groene DEAL en rode NO DEAL knoppen plus 8 rondevakjes
- [x] Moeilijkheidsgraad voelbaar — "Medium" klopt voor bewuste afwegingen

**Bronbestanden:** `config/agents/year1.tsx:2845-2881`

**Score:** 5 / 5

**Opmerkingen:**
> De "DEAL of NO DEAL" spelshow-framing is uitstekend: het is herkenbaar, laagdrempelig, en maakt een abstract concept (data als betaalmiddel) concreet via spelkeuzes. De visual met 8 rondevakjes communiceert de structuur direct. De problemScenario ("Gratis apps zijn nooit echt gratis") is een krachtige kernboodschap.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — violet/paars gradient past bij spelshow-thema
- [x] DEAL/NO DEAL knoppen zijn visueel duidelijk onderscheiden (groen vs. rood)
- [ ] Kleur via `lab-*` tokens — `color: '#E8956F'` is hardcoded hex
- [x] 8 rondevakjes zijn compact maar leesbaar

**Bronbestanden:** `config/agents/year1.tsx:2850` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De visual is goed. De spelshow-interface met groene DEAL en rode NO DEAL knoppen is intuïtief. De 8 rondevakjes geven een duidelijke voortgangsindicatie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Ronden 1-4 (basis data) → Ronden 5-8 (gevoeliger data, hogere inzet)
- [x] Elke ronde bouwt voort — de data wordt steeds gevoeliger (muziek → VPN-browsegeschiedenis → biometrisch → alles tegelijk)
- [x] Moeilijkheid past bij leerjaar — eenvoudige DEAL/NO DEAL keuzes zijn toegankelijk voor J1
- [x] Privacy-profiel aan het einde sluit de cirkel — "Wat ben jij voor data?" is een reflectiemoment

**Bronbestanden:** `config/agents/year1.tsx:2883-2948`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De acht rondes lopen van relatief onschadelijk (MuziekStream: luistergeschiedenis) naar progressief intenser (WeatherNow: locatie altijd aan → FaceGame: biometrische gezichtsscan → WifiWorld: ALLES permanent). De escalatie maakt de progressie van data-gevoeligheid voelbaar zonder dat het uitgelegd hoeft te worden.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — data-uitwisseling voor gratis diensten is correct beschreven
- [x] SafeVPN Pro-voorbeeld is didactisch sterk — een gratis VPN die browsegeschiedenis verkoopt is een reëel risico
- [x] FaceGame (biometrische scan) is correct als meest invasief gepositioneerd
- [x] Kernboodschap is correct — "Gratis bestaat niet — data IS de betaling"
- [x] Geen oordeel over keuzes — "geen goed of fout, maar weet je WAT je inruilt?" is pedagogisch juist
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year1.tsx:2883-2930`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De acht rondes zijn realistisch: de risico's per data-type zijn correct geordend van laag naar hoog. Bijzonder goed: Ronde 5 (gratis VPN verkoopt browsegeschiedenis) is een reëel en onderschat risico dat correct wordt uitgelicht. De kernboodschap zonder moreel oordeel is pedagogisch sterk.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is aanwezig — ~700 tekens
- [x] EERSTE BERICHT is aanwezig en energiek — "Welkom bij DEAL of NO DEAL: Data Editie! 🎰"
- [ ] STEP_COMPLETE markers — **ONTBREEKT** (0/3)
- [ ] `goalCriteria` — **ontbreekt** in agent-config
- [x] Toon past bij spelshow-host — enthousiast, geen oordeel
- [x] Farming-detectie actief via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year1.tsx:2883-2930`

**Score:** 2 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is perfect: energiek, duidelijk en in de juiste spelshow-toon. Maar er ontbreken STEP_COMPLETE markers en `goalCriteria`. De missie heeft drie stappen gedefinieerd maar de AI heeft geen instructie om stap-voltooiing te signaleren. De spel-structuur (8 rondes) is volledig in de systemInstruction beschreven maar niet formeel geïmplementeerd.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] DEAL/NO DEAL format is direct en aantrekkelijk voor J1
- [x] Acht rondes bieden voldoende variatie
- [x] Geen "juist" antwoord — alle keuzes zijn geldig als bewust gemaakt
- [ ] Interactie is puur tekst-gebaseerd — geen klikbare DEAL/NO DEAL knoppen

**Bronbestanden:** `config/agents/year1.tsx:2891-2912`

**Score:** 3 / 5

**Opmerkingen:**
> Het spelshow-format is uitstekend conceptueel maar de implementatie als chat-interactie vermindert de spelervaring. Klikbare DEAL/NO DEAL knoppen (zoals in een ScenarioEngine binary-choice) zouden het spelelement versterken. Nu moeten leerlingen "DEAL" of "NO DEAL" typen, wat de spelervaring vlak maakt.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria — **geen `goalCriteria`** in agent-config
- [ ] Badges — **geen badges gedefinieerd** in agent-config
- [ ] Scoring — geen formele scoring
- [ ] Takeaways — **geen takeaways gedefinieerd**
- [x] Privacy-profiel in systemInstruction aanwezig — 4 types (Privacy Purist, Bewuste Gebruiker, Comfort Lover, Data Donor)

**Bronbestanden:** `config/agents/year1.tsx:2913-2929` (alleen informeel in systemInstruction)

**Score:** 1 / 5

**Opmerkingen:**
> De systemInstruction beschrijft een goed privacy-profiel-afsluiting met vier types, maar dit is niet formeel geïmplementeerd. Er is geen `goalCriteria`, geen `badges[]`, en geen `takeaways[]`. Een leerling weet niet wanneer de missie "klaar" is en ontvangt geen formele badge. Het privacy-profiel is de sterkste afsluiting van alle standalone missies — des te jammer dat het niet formeel is.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23A (privacy/data bewust gebruiken) en 23C (maatschappelijk: data als economisch model)
- [x] Mapping is intern consistent
- [ ] Leerdoel beperkt toetsbaar — geen formele scoring

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 23C)

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. 23A is aanwezig via bewuste data-afwegingen. 23C via het datahandel-model als maatschappelijk fenomeen. De missie leert daadwerkelijk wat ze claimt te leren.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — DEAL/NO DEAL is voor iedereen begrijpelijk
- [x] Kleur gecombineerd met tekst — DEAL en NO DEAL zijn ook tekstueel gelabeld
- [x] Spelshow-format is laagdrempelig voor alle vaardigheidsniveaus
- [x] Geen platform- of apparaatspecifieke instructies

**Bronbestanden:** `config/agents/year1.tsx:2857-2881`

**Score:** 4 / 5

**Opmerkingen:**
> Uitstekend toegankelijk. De eenvoudige DEAL/NO DEAL structuur verlaagt de drempel maximaal. Geen apparaat-specifieke instructies. Goed voor leerlingen met beperkte digitale vaardigheden.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Spelshow-framing uitstekend |
| 2. Visueel | 4 | ×1 = 4 | Spelshow-visual goed, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Escalerende rondes didactisch sterk |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, geen oordeel, VPN-voorbeeld sterk |
| 5. AI-coach kwaliteit | 2 | ×1 = 2 | Geen STEP_COMPLETE, geen goalCriteria |
| 6. Interactiviteit | 3 | ×1 = 3 | Chat-only, geen klikbare knoppen |
| 7. Afronding & feedback | 1 | ×1 = 1 | Geen formele afsluiting |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23A + 23C aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Uitstekend laagdrempelig |
| **TOTAAL** | | **39 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (2×1) + (3×1) + (1×1) + (4×1) + (4×1) = 39
Percentage = (39 / 55) × 100% = 70,9%
```

### Verdict

**⚠️ Needs work** (70,9% — boven de 60% drempel, maar met blokkerende issues)

> Data voor Data heeft een bijzonder sterk concept (DEAL of NO DEAL spelshow) en uitstekende inhoud, maar wordt significant teruggehouden door het ontbreken van formele afsluiting en structuurelementen. Het concept leent zich uitstekend voor een ScenarioEngine-migratie met binary-choice rondes — dat zou de score in één stap naar >85% brengen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen formele afsluiting: geen `goalCriteria`, geen `badges[]`, geen `takeaways[]`. | Product |
| 2 | 5. AI-coach kwaliteit | Geen STEP_COMPLETE markers (0/3) en geen `goalCriteria` in agent-config. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Migreren naar ScenarioEngine met binary-choice type voor klikbare DEAL/NO DEAL knoppen. Dit is de hoogste prioriteit verbetering. | Hoog |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#E8956F` vervangen door `lab-*` token. |
| 2 | 3. Didactische flow | Vergelijkingsinformatie toevoegen ("X% van leerlingen koos DEAL") voor meer sociale context. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
