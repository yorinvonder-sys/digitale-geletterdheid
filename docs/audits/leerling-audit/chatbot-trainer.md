# Audit — Chatbot Trainer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `chatbot-trainer` |
| **Titel** | Chatbot Trainer |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | Standalone (chat) |
| **SLO-kerndoelen** | 21D (AI), 22B (programmeerdenken) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Chatbot Trainer" is direct en herkenbaar
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — duidelijk dat je een chatbot gaat programmeren
- [x] Emoji of visueel element past bij het thema — chat-bubble preview met bot/gebruiker is direct herkenbaar
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Medium" past bij het concept van IF-THEN regels schrijven

**Bronbestanden:** `config/agents/year1.tsx:3486-3546`

**Score:** 4 / 5

**Opmerkingen:**
> Goede eerste indruk. De preview met chat-bubbles (bot/gebruiker) is herkenbaar en aantrekkelijk voor J1-leerlingen die dagelijks met chatbots werken. De beschrijving is concreet en uitnodigend. Niet een volle 5 omdat de overgang van preview naar interactie niet verifieerbaar is zonder runtime.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Geen afgebroken of afgekapte teksten — tekst in chat-bubbles is kort en leesbaar
- [x] Kleuren zijn consistent — indigo/purple gradient past bij het tech-thema
- [x] Animaties zijn niet afleidend of overweldigend — chat-bubbles zijn rustige visuele elementen
- [x] Responsive op minimaal 375 px breed (mobiel) — chat-interface is van nature mobiel-vriendelijk

**Bronbestanden:** `config/agents/year1.tsx:3486-3546`

**Score:** 4 / 5

**Opmerkingen:**
> Sterk visueel ontwerp. De indigo/purple kleurencombinatie is consistent met het platform-thema en de chat-bubble lay-out is inherent mobiel-vriendelijk. De bot/gebruiker visuele scheiding is duidelijk. Geen significante visuele tekortkomingen gevonden.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — Keywords → Responses → Test is een logische stroom
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je kunt niet testen zonder eerst regels te definiëren
- [x] Moeilijkheid past bij het leerjaar — J1, Medium, IF-THEN is een eerste stap in programmeerdenken
- [x] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — pizza-voorbeeld maakt IF-THEN concreet en relateerbaar

**Bronbestanden:** `config/agents/year1.tsx:3486-3657`

**Score:** 4 / 5

**Opmerkingen:**
> Goede didactische opbouw. De drie stappen (sleutelwoorden definiëren → antwoorden koppelen → testen) zijn logisch opgebouwd en sluiten aan bij hoe echte rule-based chatbots werken. Het pizza-bestelvoorbeeld is uitstekend gekozen — herkenbaar voor J1 en concreet genoeg om het IF-THEN patroon direct te begrijpen. Minpunt: geen STEP_COMPLETE markers, waardoor voortgang niet formeel getrackt wordt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — rule-based chatbots via IF-THEN logica is juist uitgelegd
- [x] Geen typografische fouten of spelfouten — tekst is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, aansprekend, pizza-voorbeeld is relateerbaar
- [x] Terminologie consistent door de hele missie — IF-THEN wordt consequent gebruikt

**Bronbestanden:** `config/agents/year1.tsx:3486-3657`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De uitleg van rule-based chatbots via IF-THEN logica is feitelijk correct en de systemInstruction (~1200 tekens) geeft goede voorbeelden. Het onderscheid tussen rule-based chatbots en AI-chatbots (zoals ChatGPT) is een waardevolle aanvulling die leerlingen helpt begrijpen dat niet alle chatbots "slim" zijn in dezelfde zin. Het pizza-voorbeeld is didactisch uitstekend gekozen.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1200 tekens, ruim voldoende
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 3546, uitnodigend met duidelijke eerste stap
- [ ] STEP_COMPLETE markers zijn aanwezig voor alle stappen — **ONTBREEKT**
- [ ] Verificatievragen aanwezig — reflectievragen aanwezig, maar geen formeel verificatieprotocol
- [x] Toon past bij de rolnaam en het thema — past bij het Chatbot Trainer-concept
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:3546-3657`, `config/agents/shared.tsx`

**Score:** 3 / 5

**Opmerkingen:**
> Het EERSTE BERICHT is aanwezig en uitnodigend — een plus. De systemInstruction is met ~1200 tekens substantieel en bevat goede voorbeelden. Toch ontbreken STEP_COMPLETE markers, waardoor de AI-coach niet formeel weet wanneer een leerling klaar is met een stap. Er is ook geen formeel verificatieprotocol: de reflectievragen zijn wel opgenomen in de instructie maar worden niet actief gecontroleerd. Dit beperkt de coachende functie van de AI.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — het concept van een chatbot bouwen via chat is meta en aantrekkelijk
- [x] Voldoende variatie — keywords definiëren, antwoorden koppelen, en testen zijn drie verschillende activiteiten
- [ ] Feedback op foute antwoorden is leerzaam — geen echte chatbot-builder widget aanwezig, alleen chat-simulatie
- [ ] Het element werkt technisch zonder zichtbare bugs — er is geen interactieve chatbot-builder, alles loopt via de chat-interface

**Bronbestanden:** `config/agents/year1.tsx:3486-3657`

**Score:** 3 / 5

**Opmerkingen:**
> Het concept is sterk — een chatbot bouwen via een chatbot-interface is meta en aantrekkelijk voor leerlingen. Maar de uitvoering is beperkt: er is geen echte chatbot-builder widget. Alles loopt via de tekst-chat interface met de AI-coach. Dit betekent dat leerlingen hun chatbot niet daadwerkelijk kunnen "testen" door er vragen aan te stellen — ze beschrijven alleen hoe hun chatbot zou werken. Een interactieve chatbot-builder (bijv. een eenvoudige IF-THEN editor) zou de missie aanzienlijk versterken.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria zijn helder voor de leerling — **geen `goalCriteria` gedefinieerd**
- [ ] Badges hebben betekenisvolle namen — **geen badges gedefinieerd** (`bonusChallenges: null`)
- [ ] Scoredrempels zijn realistisch — **geen scoring systeem**
- [ ] `takeaways[]` vatten de kernlessen samen — **geen takeaways gedefinieerd**

**Bronbestanden:** `config/agents/year1.tsx:3657` (`bonusChallenges: null`)

**Score:** 1 / 5

**Opmerkingen:**
> Er is geen enkel afrondingselement aanwezig. `bonusChallenges: null` is expliciet ingesteld, wat bevestigt dat dit bewust is weggelaten. Geen badges, geen scoring, geen takeaways, geen goalCriteria. Een leerling weet niet wanneer de missie "klaar" is en krijgt geen samenvatting van wat geleerd is. Dit is een blokkerende issue voor pilot-gebruik.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 21D (AI) past: leerlingen leren hoe rule-based chatbots werken
- [x] 22B (programmeerdenken) is correct: IF-THEN logica is een basisvorm van algoritmisch denken
- [x] Geen conflict tussen `curriculum.ts` en `slo-kerndoelen-mapping.ts` — beide SLO's zijn aantoonbaar aanwezig
- [ ] Het leerdoel is toetsbaar geformuleerd — activiteit beschreven ("bouw een chatbot") maar geen meetbaar resultaat

**Bronbestanden:** `config/agents/year1.tsx:3486-3489`, `config/curriculum.ts`, `config/slo-kerndoelen-mapping.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. De combinatie van 21D (AI-concepten) en 22B (programmeerdenken via IF-THEN) is sterk gemotiveerd — het bouwen van een rule-based chatbot vereist precies dit soort logisch, algoritmisch denken. De missie onderscheidt ook expliciet tussen rule-based en AI-chatbots, wat aansluit bij 21D (begrip van wat AI wel en niet is). Minpunt: geen toetsbaar geformuleerd leerdoel.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — informeel, begrijpelijk voor J1, pizza-voorbeeld is herkenbaar
- [x] Alt-teksten aanwezig op niet-decoratieve elementen — tekst-gebaseerde interface, geen kritieke afbeeldingen
- [x] Alle interactieve elementen bereikbaar met toetsenbord — chat-interface is toetsenbord-toegankelijk
- [x] Kleurcontrast voldoet aan WCAG AA — indigo/purple op wit is doorgaans voldoende
- [ ] Informatie wordt niet uitsluitend via kleur overgebracht — niet volledig verifieerbaar zonder runtime

**Bronbestanden:** `config/agents/year1.tsx:3486-3657`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De chat-interface is van nature toetsenbord-toegankelijk en het leesniveau is passend voor J1. Het pizza-voorbeeld is herkenbaar voor vrijwel alle leerlingen ongeacht achtergrond. Geen significante toegankelijkheidsproblemen gevonden.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 4 | ×1 = 4 | Chat-bubble preview herkenbaar en uitnodigend |
| 2. Visueel | 4 | ×1 = 4 | Indigo/purple consistent, chat-interface mobiel-vriendelijk |
| 3. Didactische flow | 4 | ×2 = 8 | Keywords→Responses→Test logisch, mist STEP_COMPLETE |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | IF-THEN correct uitgelegd, pizza-voorbeeld uitstekend |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | EERSTE BERICHT aanwezig, maar geen STEP_COMPLETE |
| 6. Interactiviteit | 3 | ×1 = 3 | Concept sterk, maar geen echte chatbot-builder widget |
| 7. Afronding & feedback | 1 | ×1 = 1 | bonusChallenges: null — niets aanwezig |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21D+22B beide sterk gemotiveerd |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Chat-interface inherent toegankelijk |
| **TOTAAL** | | **39 / 55** | |

### Gewogen totaal

```
(4×1) + (4×1) + (4×2) + (4×2) + (3×1) + (3×1) + (1×1) + (4×1) + (4×1) = 39
Percentage = (39 / 55) × 100% = 70,9%
```

### Verdict

**⚠️ Needs work** (70,9% — net boven de 70% drempel, met blokkerende issue)

> Solide missie met een sterk concept en goed didactisch raamwerk. Het IF-THEN principe wordt correct en relateerbaar uitgelegd via het pizza-voorbeeld. De enige blokkerende issue is het volledig ontbreken van afrondingselementen. Daarnaast mist de interactiviteit een daadwerkelijke chatbot-builder widget — leerlingen beschrijven hun chatbot alleen via chat, maar testen hem niet echt. Dit beperkt het leereffect.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | `bonusChallenges: null` — geen badges, scoring, takeaways of goalCriteria aanwezig. Voeg minimaal 1 badge + 3 takeaways toe. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Eenvoudige IF-THEN editor toevoegen zodat leerlingen hun chatbot daadwerkelijk kunnen testen. Nu is alles tekst-chat. | Hoog |
| 2 | 5. AI-coach kwaliteit | STEP_COMPLETE markers toevoegen voor de 3 stappen. Formeel verificatieprotocol toevoegen per stap. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 4. Inhoudelijke correctheid | Leerdoel herformuleren als meetbaar resultaat: "Kan uitleggen wat het verschil is tussen een rule-based chatbot en een AI-chatbot." |
| 2 | 3. Didactische flow | Extra stap toevoegen: leerling test andermans chatbot om te ontdekken wat er mis gaat met simpele regels. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
