# Audit — Datalekken Rampenplan (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `datalekken-rampenplan` |
| **Titel** | Datalekken Rampenplan |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 23A (privacy), 21A (systeemdenken/security) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Datalekken Rampenplan" is direct
- [x] `introDescription` geeft concrete verwachting — crisismanagementscenario is duidelijk
- [x] Visueel element past bij het thema — rode noodmelding met "SECURITY BREACH DETECTED" en vier fasen (DETECT, CONTAIN, NOTIFY, PREVENT)
- [x] Moeilijkheidsgraad voelbaar — "Hard" klopt voor het complexe crisisscenario
- [x] Het verhaal is direct betrokken — "Jij bent de crisismanager" geeft verantwoordelijkheidsgevoel

**Bronbestanden:** `config/agents/year1.tsx:2749-2778`

**Score:** 5 / 5

**Opmerkingen:**
> De visuele preview is zeer effectief: de rode achtergrond met "SECURITY BREACH DETECTED" animatie en de vier fasen communiceert urgentie. Het missionObjective (4 crisismanagementfasen) is duidelijk. De moeilijkheidsgraad "Hard" is eerlijk — dit is de complexere missie in J1P3.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — rood past bij urgentiethema
- [x] Animaties zijn thematisch — `animate-pulse` op noodmelding is passend
- [ ] Kleur via `lab-*` tokens — `color: '#DC2626'` is hardcoded hex
- [ ] Rood-zware visual kan overweldigend zijn — geen rustiger alternatief

**Bronbestanden:** `config/agents/year1.tsx:2753` (hardcoded hex)

**Score:** 3 / 5

**Opmerkingen:**
> De visual is thematisch sterk maar visueel intensief (donkerrood, alarmerend). Voor een leerjaar 1-leerling die nog geen achtergrond heeft in cybersecurity kan dit stressvol aanvoelen. De vier fase-labels (DETECT, CONTAIN, NOTIFY, PREVENT) zijn Engelstalig — een kleine drempel voor J1.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Detect → Contain → Notify → Prevent
- [x] Elke fase bouwt voort op de vorige — je kunt pas containen als je weet wat er gelekt is
- [x] Vier fasen zijn pedagogisch compleet — de complete incidentrespons is gedekt
- [ ] Moeilijkheidsgraad kan te hoog zijn voor J1 — begrippen als "AP" (Autoriteit Persoonsgegevens) en "72-uurs melding" zijn gevorderd

**Bronbestanden:** `config/agents/year1.tsx:2780-2824`

**Score:** 4 / 5

**Opmerkingen:**
> De didactische opbouw is logisch en compleet. De vier crisismanagementfasen zijn de industriestandaard (NIST-gebaseerd). De missie is echter ambitieus voor J1: de "72-uurs melding bij AP" en de keuze-matrix in Fase 2 (wachtwoorden vs. wachten vs. systemen offline vs. social media posten) vereisen voorkennis. Dat is geen blokkeerder — het is uitdagend voor "Hard"-niveau.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — "AP binnen 72 uur" klopt (AVG art. 33)
- [x] "Ouders/leerlingen direct informeren" is correct beleid bij school
- [x] haveibeenpwned.com correct als tool voor datalekcontrole
- [x] Security-checklist (sterk wachtwoord, 2FA, verdachte links) is correct en praktisch
- [x] Keuze B/D (wachten of social media posten) zijn terecht onjuist
- [x] Geen spelfouten gevonden

**Bronbestanden:** `config/agents/year1.tsx:2780-2824`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk correct. De acties in Fase 2 zijn goed doordacht: "wachtwoorden wijzigen" en "systemen offline halen" zijn de correcte eerste stappen; "wachten" en "social media posten" zijn correct als fout gemarkeerd. De uiteindelijke security-checklist voor leerlingen (2FA, verdachte links, haveibeenpwned.com) is direct toepasbaar.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is aanwezig — ~800 tekens
- [x] EERSTE BERICHT is aanwezig — "[ALERT] 🚨 NOODMELDING — 14:23 UUR"
- [ ] STEP_COMPLETE markers — **ONTBREEKT** (0/3)
- [ ] `goalCriteria` — **ontbreekt** in agent-config
- [x] Toon is "urgent maar kalm en professioneel" — past bij crisismanagementrol
- [x] Farming-detectie actief via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year1.tsx:2780-2824`

**Score:** 2 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is sterk — de [ALERT]-tag en de noodmelding-opmaak creëren direct immersie. Maar er ontbreken STEP_COMPLETE markers en `goalCriteria`. De missie heeft ook geen `primaryGoal` gedefinieerd. De AI-coach kan niet aangeven wanneer een fase is afgerond. Dit is een structureel probleem voor een missie met vier fasen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Crisismanagement-rollenspel past bij het leerdoel — leerlingen denken als systeembeheerder
- [x] Keuzemoment in Fase 2 is interactief en didactisch (juiste vs. foute acties)
- [ ] Vier fasen zijn chat-gebaseerd zonder structurele interface-ondersteuning
- [ ] Scoring in systemInstruction (100 punten totaal) is niet formeel geïmplementeerd

**Bronbestanden:** `config/agents/year1.tsx:2791-2824`

**Score:** 3 / 5

**Opmerkingen:**
> Het crisismanagement-format is conceptueel sterk maar de chat-implementatie is beperkend. De scoring (20 punten per goed antwoord in Fase 1/2/3, max 100) is beschreven in de systemInstruction maar niet formeel geïmplementeerd via een scoringssysteem. Leerlingen zien geen score.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria — **geen `goalCriteria`** in agent-config
- [ ] Badges — **geen badges gedefinieerd** in agent-config
- [ ] Scoring — geen formele scoring in agent-config
- [ ] Takeaways — **geen takeaways gedefinieerd**
- [x] Afsluiting in systemInstruction aanwezig — badges ("Gecertificeerd Crisis Manager", "Aankomend Security Officer", "Trainee") en security-checklist

**Bronbestanden:** `config/agents/year1.tsx:2811-2814` (alleen informeel in systemInstruction)

**Score:** 1 / 5

**Opmerkingen:**
> De systemInstruction beschrijft een mooie afsluiting met drie badges en een security-checklist, maar dit is niet formeel geïmplementeerd. Er is geen `goalCriteria`, geen `badges[]`, en geen `takeaways[]`. Leerlingen ontvangen geen formele badge of samenvatting. Voor een missie die werkt aan "Hard"-niveau is dit extra pijnlijk.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 23A (privacy/datalekken) en 21A (systeemdenken/security response) zijn aanwezig
- [x] Mapping is intern consistent
- [ ] Leerdoel is beperkt toetsbaar zonder formele scoring

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 23A + 21A)

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. 23A (privacy, datalekken) is de kern van de missie. 21A (systeemdenken) is aanwezig via de DETECT-CONTAIN-NOTIFY-PREVENT framework. Het ontbreken van formele scoring maakt toetsbaarheid beperkt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij "Hard"-niveau — gevorderde begrippen zijn passend voor de moeilijkheidsgraad
- [x] Kleur gecombineerd met tekst — faselabels zijn tekstueel
- [ ] Engelstalige faselabels (DETECT, CONTAIN, NOTIFY, PREVENT) zijn een kleine drempel
- [ ] Intense rode visual kan stressvol zijn voor sommige leerlingen

**Bronbestanden:** `config/agents/year1.tsx:2770-2778`

**Score:** 3 / 5

**Opmerkingen:**
> De toegankelijkheid is redelijk voor een "Hard"-missie. De Engelstalige faselabels zijn een kleine drempel maar acceptabel voor de doelgroep. De intense rode visual kan voor sommige leerlingen overweldigend zijn.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Urgent crisisscenario, direct betrokken |
| 2. Visueel | 3 | ×1 = 3 | Intensief rood, Engelstalige labels |
| 3. Didactische flow | 4 | ×2 = 8 | Logisch, ambitieus voor J1 |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | AVG correct, praktische checklist |
| 5. AI-coach kwaliteit | 2 | ×1 = 2 | Geen STEP_COMPLETE, geen goalCriteria |
| 6. Interactiviteit | 3 | ×1 = 3 | Chat-only, scoring niet geïmplementeerd |
| 7. Afronding & feedback | 1 | ×1 = 1 | Geen formele afsluiting |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 23A + 21A aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Hard-niveau OK, rood intensief |
| **TOTAAL** | | **39 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (4×2) + (5×2) + (2×1) + (3×1) + (1×1) + (4×1) + (3×1) = 39
Percentage = (39 / 55) × 100% = 70,9%
```

### Verdict

**⚠️ Needs work** (70,9% — boven de 60% drempel, maar met blokkerende issues)

> Datalekken Rampenplan heeft een uitstekende eerste indruk en correct inhoud, maar mist essentiële structuurelementen: geen formele afsluiting, geen badges, geen STEP_COMPLETE en geen goalCriteria. Het concept is sterk — twee gerichte verbeteringen zouden de missie boven de 80% brengen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen formele afsluiting: geen `goalCriteria`, geen `badges[]`, geen `takeaways[]`. | Product |
| 2 | 5. AI-coach kwaliteit | Geen STEP_COMPLETE markers (0/4 fasen) en geen `goalCriteria` in agent-config. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Migreren naar ScenarioEngine voor gestructureerde keuzemomenten in Fase 2 (acties kiezen). | Medium |
| 2 | 2. Visueel | Engelse faselabels vertalen naar Nederlands (DETECTEER, BEPERK, MELD, VOORKOM). | Laag |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 3. Didactische flow | Voorkennis-brug toevoegen voor begrippen als "Autoriteit Persoonsgegevens" en "72 uur". |
| 2 | 2. Visueel | Hardcoded hex `#DC2626` vervangen door `lab-*` token. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
