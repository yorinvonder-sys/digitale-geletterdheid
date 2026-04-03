# Audit — Prompt Perfectionist (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `prompt-master` |
| **Titel** | Prompt Perfectionist |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (chat-gebaseerd) |
| **SLO-kerndoelen** | 21D (AI aansturen), 22A (digitaal product maken) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Prompt Perfectionist" is prikkelend en duidelijk
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — legt helder uit wat prompts zijn en waarom ze ertoe doen
- [x] Emoji of visueel element past bij het thema — violet gradient met score-indicatoren past bij het "perfectie"-thema
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" is juist voor een eerste kennismaking met prompt-schrijven

**Bronbestanden:** `config/agents/year1.tsx:35-126`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De intro legt meteen uit wat een prompt is, waarom het belangrijk is, en wat de leerling gaat doen. De score-indicatoren in de visuele preview maken direct duidelijk dat er een beoordelingssysteem is, wat motiverend werkt. Moeilijkheidsgraad "Easy" is correct voor J1.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — tekst-gebaseerde chat-interface is inherent flexibel
- [x] Kleuren zijn consistent — violet gradient past bij het thema en is coherent
- [x] Animaties zijn niet afleidend of overweldigend — geen overmatige animaties
- [ ] Responsive op minimaal 375 px breed (mobiel) — score-indicatoren in de preview gebruiken hardcoded hex `#E8956F` in plaats van `lab-*` tokens

**Bronbestanden:** `config/agents/year1.tsx:35-125`

**Score:** 4 / 5

**Opmerkingen:**
> De visuele presentatie is sterk. De preview toont score-indicatoren die de beoordelingscriteria visualiseren, wat pedagogisch waardevol is. Één punt van verbetering: de kleur `#E8956F` op het agent-object is een hardcoded hex-waarde in plaats van een `lab-*` token. Chat-gebaseerde missies zijn inherent goed schaalbaar naar mobiel. Verder geen visuele bezwaren.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — drie stappen bouwen op elkaar voort: basis prompt → specifieke details → context toevoegen
- [x] Elke stap bouwt aantoonbaar voort op de vorige — de scoredrempels stijgen per stap, leerling ervaart progressie
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, met duidelijke voorbeelden en scaffolding
- [x] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — termen als "specificiteit" en "context" worden uitgelegd met voorbeelden

**Bronbestanden:** `config/agents/year1.tsx:120-126` (STAP-VOLTOOIING), `config/agents/year1.tsx:35-119` (systemInstruction)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen (duidelijkheid → specificiteit → context) zijn logisch geordend van eenvoudig naar complex. Het scoresysteem met drie criteria is helder en geeft leerlingen directe feedback op hun prompts. De STAP-VOLTOOIING sectie (regels 120-123) bevat drie concrete criteria waaraan voldaan moet worden. Dit is near gold-standard scaffolding voor chat-gebaseerde missies.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — prompt-schrijven en de drie criteria (duidelijkheid, specificiteit, context) zijn correct beschreven
- [x] Geen typografische fouten of spelfouten — tekst is taalkundig correct
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, aansprekend, met goede voorbeelden
- [x] Geen Engelse termen waar goed Nederlands beschikbaar is — "prompt" is gangbaar, overige terminologie is Nederlands
- [x] Terminologie consistent door de hele missie

**Bronbestanden:** `config/agents/year1.tsx:35-126`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en feitelijk correct. De drie beoordelingscriteria (duidelijkheid, specificiteit, context) zijn de standaard framework voor prompt-kwaliteit en worden goed uitgelegd met concrete voorbeelden. Het taalgebruik is informeel en toegankelijk voor J1-leerlingen. Geen taal- of spelfouten aangetroffen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~2500+ tekens, uitstekend uitgewerkt
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 126, uitnodigend met voorbeeld
- [x] STEP_COMPLETE markers zijn aanwezig voor alle stappen — STAP-VOLTOOIING sectie aanwezig (regels 120-123) met 3 concrete criteria
- [x] Verificatievragen aanwezig — scoresysteem met 3 criteria fungeert als formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — "Prompt Coach" past bij het lesdoel
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:35-126`, `config/agents/shared.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige AI-coaching structuur aanwezig. Het EERSTE BERICHT is uitnodigend en geeft direct een voorbeeld. De STAP-VOLTOOIING criteria zijn concreet en meetbaar. Het scoresysteem (drie criteria, elk 1-5 punten) geeft de AI-coach een helder kader om voortgang te beoordelen. De systemInstruction (~2500+ tekens) is gedetailleerd genoeg om consistente begeleiding te garanderen. Dit is een referentie-implementatie voor andere missies.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — prompt-schrijven via chat is de meest authentieke oefenvorm voor dit leerdoel
- [x] Voldoende variatie — drie stappen met oplopende complexiteit, feedback per stap
- [x] Feedback op foute antwoorden is leerzaam — scoresysteem geeft gedetailleerde feedback per criterium
- [ ] Het element werkt technisch zonder zichtbare bugs — geen interactieve widget; puur chat-based

**Bronbestanden:** `config/agents/year1.tsx:35-126`

**Score:** 4 / 5

**Opmerkingen:**
> Chat-gebaseerd prompt-schrijven is de meest authentieke oefenvorm voor dit leerdoel — je leert prompts schrijven door daadwerkelijk prompts te schrijven. Het scoresysteem maakt de feedback concreet en leerzaam. Punt van aandacht: er is geen interactieve widget of visuele tool naast de chat. Voor sommige leerlingen kan dit minder stimulerend zijn dan een game-gebaseerde aanpak. De keuze is didactisch verdedigbaar maar interactiviteit had versterkt kunnen worden met een voorbeeld-prompt-builder.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder voor de leerling — `goalCriteria: { type: 'steps-complete', min: 3 }` aanwezig
- [ ] Badges hebben betekenisvolle namen — geen badges gedefinieerd
- [x] Scoredrempels zijn realistisch — sterren-scoresysteem op basis van prompt-kwaliteit
- [ ] `takeaways[]` vatten de kernlessen samen — geen takeaways gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:35-126`

**Score:** 4 / 5

**Opmerkingen:**
> De missie heeft een helder completion-criterium (3 stappen voltooid) en een scoresysteem met sterren op basis van prompt-kwaliteit. Dit geeft leerlingen een duidelijk doel en meetbare voortgang. Twee elementen ontbreken: badges met betekenisvolle namen en een `takeaways[]` array die de kernlessen samenvat. Dit vermindert de didactische afsluiting enigszins, maar is geen blokkeerder.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21D (AI aansturen) past perfect: leerlingen sturen een AI aan via prompts
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — 21D + 22A zijn consistent geclaimd
- [x] Het leerdoel is toetsbaar geformuleerd — "schrijf een effectieve prompt die een score van 4/5 haalt op alle drie criteria" is toetsbaar via het scoresysteem

**Bronbestanden:** `config/agents/year1.tsx:35`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. 21D (AI aansturen) is de kern van de missie — leerlingen leren letterlijk hoe je een AI aanstuurt via prompts. 22A (digitaal product maken) sluit aan omdat leerlingen een steeds beter product (de prompt zelf) maken. Het scoresysteem maakt de leerdoelen toetsbaar, wat zeldzaam sterk is voor een chat-gebaseerde missie.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — tekst is helder en begrijpelijk voor J1
- [x] Alt-teksten aanwezig op alle niet-decoratieve afbeeldingen — geen afbeeldingen in chat-interface
- [x] Alle interactieve elementen bereikbaar en bedienbaar met toetsenbord — chat-interface is volledig toetsenbord-toegankelijk
- [ ] Kleurcontrast voldoet aan WCAG AA — violet gradient op score-indicatoren niet getest
- [x] Informatie wordt niet uitsluitend via kleur overgebracht — score is ook numeriek weergegeven

**Bronbestanden:** `config/agents/year1.tsx:35-126`

**Score:** 4 / 5

**Opmerkingen:**
> Chat-gebaseerde missies zijn inherent toegankelijk: volledig toetsenbord-bedienbaar, geen canvas-beperkingen, geen vereiste van muis of touchscreen. Het leesniveau is passend voor J1. Één aandachtspunt: het kleurcontrast van de violet gradient op de score-indicatoren is niet getest op WCAG AA-conformiteit. Dit is een small punt zonder grote impact op de bruikbaarheid.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Heldere intro, aantrekkelijke preview |
| 2. Visueel | 4 | ×1 = 4 | Goed visueel, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekende scaffolding, 3 duidelijke stappen |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk correct, goede voorbeelden |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig: EERSTE BERICHT, STAP-VOLTOOIING, scoring |
| 6. Interactiviteit | 4 | ×1 = 4 | Authentieke oefenvorm, geen widget |
| 7. Afronding & feedback | 4 | ×1 = 4 | goalCriteria aanwezig, mist badges/takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21D + 22A = perfecte match |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Inherent toegankelijk, contrast niet getest |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (4×1) + (5×1) + (4×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar voor pilot** (92,7% — near gold-standard kwaliteit)

> Een van de sterkst uitgewerkte missies in de catalogus. De combinatie van een helder scoresysteem, volledige AI-coaching structuur (EERSTE BERICHT + STAP-VOLTOOIING + verificatie), en perfecte SLO-aansluiting maakt dit tot een referentie-implementatie. De twee kleine verbeterpunten (badges en takeaways) zijn geen blokkeerders.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

_Geen blokkerende issues aangetroffen._

#### Verbeterpunten (score 3-4 — oplossen vóór of tijdens pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#E8956F` vervangen door `lab-*` token. | Laag |
| 2 | 7. Afronding & feedback | `takeaways[]` toevoegen met de 3 kernlessen (duidelijkheid, specificiteit, context). | Laag |
| 3 | 7. Afronding & feedback | Badges toevoegen met betekenisvolle namen (bijv. "Prompt Starter", "Prompt Pro"). | Laag |

#### Nice-to-haves (optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Optionele prompt-builder widget toevoegen naast de chat voor visueel ingestelde leerlingen. |
| 2 | 9. Toegankelijkheid | Kleurcontrast violet gradient testen op WCAG AA-conformiteit. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
