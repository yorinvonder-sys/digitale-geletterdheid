# Audit — Data Speurder (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-speurder` |
| **Titel** | Data Speurder |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | ScenarioEngine (4 rondes) |
| **SLO-kerndoelen** | 21C (data) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Data Speurder" met 📊 is direct
- [x] `introDescription` geeft concrete verwachting — "datageletterdheid is een van de meest gevraagde vaardigheden van de 21e eeuw" is motiverend
- [x] Vier concrete introductiefeatures beschrijven wat de leerling gaat leren
- [x] Moeilijkheidsgraad voelbaar — "Easy" klopt voor de datageletterdheids-introductie

**Bronbestanden:** `config/agents/year1.tsx:3852-3879`, `components/missions/templates/scenario-engine/configs/data-speurder.ts:1-15`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke intro. De visual preview (barchart met drie staven) communiceert direct het onderwerp. De introductie in de ScenarioEngine-config ("Data is overal — maar zonder de juiste vaardigheden is het gewoon ruis") is een motiverende opening. Kleine noot: het problemScenario in year1.tsx ("iedereen zegt dat jongeren 'te veel op hun telefoon zitten'") verbindt het onderwerp met het leven van de leerling.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — blauw/indigo gradient past bij data-thema
- [x] ScenarioEngine-template is proven responsive
- [ ] Kleur via `lab-*` tokens — `color: '#3B82F6'` is hardcoded hex
- [x] Barchart-animatie met `animate-pulse` is subtiel

**Bronbestanden:** `config/agents/year1.tsx:3857` (hardcoded hex)

**Score:** 4 / 5

**Opmerkingen:**
> De ScenarioEngine-template biedt een consistente, responsive ervaring. De blauw/indigo kleur past goed bij het data-analytische thema.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Data/Informatie/Conclusie onderscheid → Juiste grafiek kiezen → Eerlijk/Misleidend → Correcte conclusies
- [x] Elke ronde bouwt voort — je kunt pas misleidende grafieken herkennen als je weet wat data is
- [x] Moeilijkheid past bij leerjaar — concrete voorbeelden (schermtijd, spelletjes, temperatuur)
- [x] Concepten zijn goed opgebouwd: data → presentatie → analyse

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts:50-386`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier rondes dekken de volledige datageletterdheids-cyclus: herkennen (Ronde 1), presenteren (Ronde 2), kritisch beoordelen (Ronde 3), en correct concluderen (Ronde 4). De progressie is logisch en elk concept bouwt voort op het vorige. De correlatie/causaliteit-nuance in Ronde 4 is een hoog niveau voor J1 maar goed scaffolded.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — data vs. informatie vs. conclusie-onderscheid is correct
- [x] Correlatie/causaliteit correct uitgelegd — "twee dingen die samen bewegen zijn niet per se oorzaak en gevolg"
- [x] Y-as misleiding correct beschreven — y-as die begint op 95% maakt kleine stijging er enorm uitzien
- [x] Cirkeldiagram-fout (110% optelt) correct als misleidend geïdentificeerd
- [x] "Steekproef van 10 vaste klanten" correct als niet-representatief uitgelegd
- [x] Geen spelfouten gevonden
- [x] Concrete voorbeelden zijn herkenbaar voor J1 (Instagram, TikTok, schermtijd)

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts:51-384`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De datageletterdheidsinhoud is methodologisch correct en op een toegankelijk niveau gebracht. Bijzonder sterk: het onderscheid tussen correlatie ("verband") en causaliteit ("oorzaak") wordt correct en begrijpelijk uitgelegd aan J1-leerlingen. De concrete voorbeelden (schermtijd, spelletjes, temperatuur) zorgen voor herkenning.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] ScenarioEngine heeft ingebouwde feedback per ronde — `feedbackCorrect` en `feedbackIncorrect`
- [x] Per item een `explanation` — directe feedback bij elk antwoord
- [x] `maxScore: 100` aanwezig (4×25=100)
- [x] Chat systemInstruction aanwezig als aanvulling (year1.tsx) — met EERSTE BERICHT en STEP_COMPLETE markers
- [x] EERSTE BERICHT aanwezig — "Hoi! Ik ben je Data Coach. 📊"
- [x] STAP-VOLTOOIING uitleg aanwezig in chat-systemInstruction

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts`, `config/agents/year1.tsx:3897-3932`

**Score:** 4 / 5

**Opmerkingen:**
> De ScenarioEngine heeft ingebouwde structuur. De chat-systemInstruction bevat STAP-VOLTOOIING richtlijnen die de coach vertellen wanneer een stap klaar is. Wel: de chat-systemInstruction gaat over schermtijd-data verzamelen (eigen telefoon), terwijl de ScenarioEngine-config over datageletterdheid in bredere zin gaat. Er is een kleine inhoudelijke spanning tussen de twee instrucielagen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Vier rondetypes houden de aandacht vast
- [x] Herkenbare context — schermtijd, spelletjes, temperatuur
- [x] Order-priority ronde (grafieken kiezen) vraagt actief redeneren
- [x] Binary-choice voor misleidende grafieken stimuleert kritisch denken

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts:148-288`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. De vier rondetypes bieden afwisseling en de context (schermtijd, spelletjes) is herkenbaar voor J1. Het order-priority-type voor "welke grafiek past het best?" is didactisch sterk — leerlingen moeten actief redeneren over de eigenschappen van verschillende grafiektypes.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges gedefinieerd — 4 badges: Data Expert (≥80), Data Analist (≥60), Goed Begonnen (≥40), Blijf Oefenen (≥0)
- [x] `maxScore: 100` aanwezig
- [x] `takeaways` aanwezig — 5 concrete lessen (data vs. informatie, correlatie ≠ causaliteit, y-as, gemiddelde vs. mediaan, visualisatie)
- [x] `goalCriteria: { type: 'steps-complete', min: 3 }` aanwezig in year1.tsx

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts:17-49`, `config/agents/year1.tsx:3865`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. De "Data Expert"-badge is thematisch sterk. De 5 takeaways zijn specifiek en inhoudelijk waardevol, inclusief het correlatie/causaliteit-onderscheid. De goalCriteria in year1.tsx zorgt voor formele voortgangsregistratie.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimd kerndoel — 21C (data) is volledig aanwezig: verzamelen, analyseren, presenteren
- [x] Mapping is intern consistent
- [x] Leerdoel is toetsbaar — ScenarioEngine-scoring meet datageletterdheid
- [x] De focus op "puur data verzamelen en analyseren" klopt met de mapping-notitie ("-21B")

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 21C — mapping-notitie: "-21B: puur data")

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie is volledig gefocust op 21C (datageletterdheid) zonder afleiding naar mediawijsheid of andere kerndoelen. De vier rondes samen geven een volledige dekking van 21C: data herkennen, presenteren, beoordelen, en conclusies trekken.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — concrete voorbeelden, begrijpelijke taal
- [x] Grafiekbeschrijvingen zijn tekstueel — geen kleurafhankelijkheid
- [x] ScenarioEngine-template is proven toegankelijk
- [x] Geen platform- of apparaatspecifieke instructies in de ScenarioEngine-config

**Bronbestanden:** `components/missions/templates/scenario-engine/configs/data-speurder.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekend toegankelijk. De grafieken worden beschrijvend in tekst uitgelegd — geen kleurafhankelijkheid. De concrete voorbeelden (schermtijd, spelletjes) zijn voor alle leerlingen herkenbaar.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Sterk, motiverende opening |
| 2. Visueel | 4 | ×1 = 4 | ScenarioEngine proven, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Complete datageletterdheids-cyclus |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Methodologisch correct, correlatie/causaliteit |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | ScenarioEngine + chat, lichte spanning |
| 6. Interactiviteit | 5 | ×1 = 5 | Uitstekend, herkenbare context |
| 7. Afronding & feedback | 5 | ×1 = 5 | Volledig: badges + takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C volledig gedekt |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Uitstekend |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (5×2) + (5×2) + (4×1) + (5×1) + (5×1) + (5×1) + (5×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar** (87,3% — ruim boven de 80% drempel)

> Data Speurder is een uitstekende ScenarioEngine-missie. De didactische opbouw is volledig, de inhoud is methodologisch correct en op niveau, en de afrondingsstructuur is compleet. Klaar voor directe inzet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

Geen blokkerende issues.

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach kwaliteit | Spanning verduidelijken tussen chat-systemInstruction (schermtijd verzamelen) en ScenarioEngine-config (bredere datageletterdheid). Welke is primair? | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 2. Visueel | Hardcoded hex `#3B82F6` vervangen door `lab-*` token. |
| 2 | 1. Eerste indruk | Introductietekst in ScenarioEngine-config specifieker maken voor J1-context (nu ietwat algemeen). |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
