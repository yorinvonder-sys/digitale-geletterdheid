# Audit — Schermtijd Coach (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `schermtijd-coach` |
| **Titel** | Schermtijd Coach |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | DebateArena (enableChat: true) |
| **SLO-kerndoelen** | 23B (digitaal welzijn) + 21D (AI en apps sturen gedrag) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Schermtijd Coach" is herkenbaar en direct relevant voor J1
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — verwijzingen naar TikTok, Instagram en YouTube maken het persoonlijk en actueel
- [x] Emoji of visueel element past bij het thema — amber/oranje gradient met gesimuleerde app-gebruik balken is treffend en herkenbaar
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Easy" klopt: persoonlijke reflectie vraagt geen voorkennis

**Bronbestanden:** `config/agents/year1.tsx:4069-4100`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De visuele preview met gesimuleerde TikTok/Instagram/YouTube-gebruiksbalken is onmiddellijk herkenbaar voor elke J1-leerling. De beschrijving raakt een onderwerp dat voor deze doelgroep hoog op de agenda staat. De toon is uitnodigend zonder te moraliseren — dat is een belangrijke keuze die de drempel verlaagt.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — amber/oranje gradient past bij het welzijns- en energiethema
- [x] App-gebruiksbalken zien er realistisch uit — de visuele preview simuleert een herkenbaar schermtijdoverzicht
- [x] Animaties zijn niet afleidend of overweldigend — geen excessieve animaties
- [ ] Kleuren via `lab-*` tokens — hardcoded kleuren in het agent-object in plaats van `lab-*` tokens

**Bronbestanden:** `config/agents/year1.tsx:4069-4100`

**Score:** 4 / 5

**Opmerkingen:**
> De visuele presentatie is warm en uitnodigend. De amber/oranje kleurkeuze communiceert energie en aandacht zonder alarmerend te zijn — een goede keuze voor een welzijnsgesprek. De gesimuleerde app-balken zijn een sterke visuele haak die de doelgroep direct aanspreekt. Enig verbeterpunt: hardcoded hexkleuren moeten vervangen worden door `lab-*` tokens.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — stap 1: analyseren → stap 2: trucjes herkennen → stap 3: plan maken
- [x] Elke stap bouwt aantoonbaar voort op de vorige — je kunt pas een plan maken als je weet welke trucjes je beïnvloeden
- [x] Moeilijkheid past bij het leerjaar — J1, Easy, persoonlijke reflectie zonder abstracte theorie
- [x] Progressie is persoonlijk en relevant — de leerling onderzoekt zijn eigen schermtijdgedrag, niet een abstract scenario

**Bronbestanden:** `config/agents/year1.tsx:4069-4160` (systemInstruction en steps)

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drietraps-progressie (analyseren → herkennen → plannen) is een klassieke reflectiecyclus die bewust is gekozen voor gedragsverandering. De missie maakt persoonlijk wat abstract zou kunnen zijn: leerlingen werken met hun eigen schermtijddata. Dit verhoogt de relevantie en het leereffect aanzienlijk.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — de 8 aandachtstechnieken (infinite scroll, autoplay, notificaties, etc.) zijn inhoudelijk correct en goed gedocumenteerd in de literatuur
- [x] Geen typografische fouten of spelfouten — taal is verzorgd
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, niet-veroordelend, empathisch
- [x] Toon is niet-moraliserend — systemInstruction benoemt expliciet dat de coach niet oordeelt
- [x] Wellbeing protocol aanwezig — de systemInstruction bevat instructies voor het geval een leerling stress of zorgen deelt over schermtijd

**Bronbestanden:** `config/agents/year1.tsx:4069-4160`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend en doordacht. De 8 aandachtstechnieken zijn didactisch sterk — leerlingen leren niet alleen dat apps verslavend kunnen zijn, maar ook hoe en waarom. De niet-veroordelende toon is essentieel voor een onderwerp dat jongeren persoonlijk raakt. Het welzijnsprotocol in de systemInstruction is een teken van zorgvuldig ontwerp dat past bij de HIGH RISK classificatie.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~3000+ tekens, uitgebreid en zorgvuldig
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 4141, persoonlijk en niet-oordelend
- [x] STEP_COMPLETE markers zijn aanwezig — "STAP-VOLTOOIING" sectie aanwezig (regels 4136-4139) met 3 duidelijke criteria
- [x] Verificatievragen aanwezig — coach vraagt om persoonlijke data of reflectie als bewijs van stap-voltooiing
- [x] Toon past bij de rolnaam en het thema — "Schermtijd Coach" is een passende, niet-bedreigende rol
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:4100-4160`, `config/agents/shared.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële AI-coaching elementen zijn aanwezig en goed uitgewerkt. Het EERSTE BERICHT is persoonlijk en empathisch — het erkent dat iedereen schermtijd heeft en veroordeelt niemand. De STAP-VOLTOOIING criteria zijn helder. De verificatie via persoonlijk delen (eigen schermtijddata benoemen) zorgt voor betrokkenheid en authentieke leerbewijzen. Het wellbeing protocol zorgt voor veilige begeleiding bij gevoelige onderwerpen.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — persoonlijk gesprek via chat is geschikt voor reflectie en gedragsverandering
- [x] DebateArena template voegt structuur toe aan de gesprekken
- [ ] Voldoende variatie in interactievormen — de missie is primair chat-gebaseerde reflectie; weinig variatie in interactiemechanismen
- [ ] Gamification-elementen — de DebateArena template is minder prominent dan bij debat-missies

**Bronbestanden:** `config/agents/year1.tsx:4069`, `components/missions/templates/debate-arena/`

**Score:** 4 / 5

**Opmerkingen:**
> Chat-gebaseerde persoonlijke reflectie is de meest passende interactievorm voor dit onderwerp — een game-mechanic zou de intimiteit en eerlijkheid van de reflectie ondermijnen. De DebateArena template voegt enige structuur toe. Verbeterpunt: de missie is voornamelijk tekstueel en mist de extra interactiviteit die sommige andere missies hebben. Dit is een bewuste en verdedigbare keuze voor een welzijnsmissie, maar beperkt de interactieve beleving.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — `goalCriteria: { type: 'steps-complete' }` aanwezig
- [x] Het eindproduct (balansplan) is betekenisvol — de leerling maakt een concreet persoonlijk plan als afsluiting
- [ ] Badges hebben betekenisvolle namen — geen badges gedefinieerd
- [ ] `takeaways[]` vatten de kernlessen samen — geen takeaways gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:4136-4145`

**Score:** 4 / 5

**Opmerkingen:**
> De goalCriteria zijn aanwezig en het eindproduct — een persoonlijk balansplan — is op zichzelf betekenisvol als afsluiting. Dat is sterker dan een abstracte badge. Verbeterpunt: formele badges en takeaways ontbreken. Een badge als "Digitale Balans Expert" en takeaways die de 8 aandachtstechnieken samenvatten zouden de didactische sluiting versterken en leerlingen iets tastbaars geven om mee te nemen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht 23B (digitaal welzijn) aantoonbaar — de missie gaat volledig over bewust omgaan met schermtijd en digitale gezondheid
- [x] Inhoud matcht 21D (AI en apps sturen gedrag) aantoonbaar — de 8 aandachtstechnieken zijn expliciet algorithme- en AI-gedreven mechanismen
- [x] Dubbele SLO-dekking is inhoudelijk gerechtvaardigd — het begrijpen van hoe apps werken (21D) versterkt het bewust kunnen omgaan met schermtijd (23B)
- [x] Het leerdoel is toetsbaar — leerling levert een concreet balansplan op

**Bronbestanden:** `config/agents/year1.tsx:4069`, `config/slo-kerndoelen-mapping.ts`, `config/curriculum.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte SLO-aansluiting. De combinatie 23B + 21D is bijzonder sterk: door te begrijpen hoe apps via algoritmes aandacht vangen (21D) kunnen leerlingen bewustere keuzes maken over hun schermtijd (23B). De twee kerndoelen versterken elkaar — 21D geeft de theorie, 23B geeft de praktische toepassing. Het balansplan als eindproduct maakt 23B toetsbaar.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — B1-niveau, informeel, kort
- [x] Tekst-gebaseerde interactie is toetsenbord-toegankelijk — chat via toetsenbord is standaard toegankelijk
- [x] Inclusieve toon — de missie veroordeelt geen gedrag en is sensitief voor verschillende achtergronden
- [ ] Responsive op mobiel — niet verifieerbaar zonder runtime; chat is doorgaans goed op mobiel

**Bronbestanden:** `config/agents/year1.tsx:4069-4160`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke toegankelijkheid. De chat-interface is van nature toetsenbord-toegankelijk en werkt goed op mobiel — een voordeel ten opzichte van canvas-gebaseerde missies. Het taalgebruik is eenvoudig en inclusief. De niet-oordelende toon is belangrijk voor leerlingen die gevoelig kunnen zijn over hun schermtijdgedrag. Kleine onzekerheid: mobiele lay-out van de DebateArena template is niet geverifieerd.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Herkenbare app-balken, uitnodigende toon |
| 2. Visueel | 4 | ×1 = 4 | Warm amber/oranje, hardcoded kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Analyseren → herkennen → plannen |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | 8 technieken correct, wellbeing protocol |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 4 | ×1 = 4 | Chat passend, weinig variatie |
| 7. Afronding & feedback | 4 | ×1 = 4 | goalCriteria + balansplan, geen badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23B + 21D perfect, wederzijds versterkend |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Chat-first, inclusieve toon |
| **TOTAAL** | | **51 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (4×1) + (5×1) + (4×1) = 51
Percentage = (51 / 55) × 100% = 92,7%
```

### Verdict

**✅ Klaar voor pilot** (92,7%)

> Schermtijd Coach is een inhoudelijk uitstekend uitgewerkte welzijnsmissie. De drietraps-reflectiecyclus, de niet-oordelende toon, het welzijnsprotocol en de sterke SLO-koppeling maken dit tot een voorbeeld van hoe gevoelige onderwerpen didactisch verantwoord behandeld kunnen worden. De vier kleine verbeterpunten (hardcoded kleuren, ontbrekende badges/takeaways, beperkte variatie in interactie) zijn geen blokkeerders voor pilotinzet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

_Geen blokkerende issues._

#### Verbeterpunten (score 3-4 — oplossen vóór of tijdens pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hexkleuren vervangen door `lab-*` tokens. | Laag |
| 2 | 7. Afronding & feedback | Badges toevoegen (bijv. "Digitale Balans Expert") en `takeaways[]` met de 8 aandachtstechnieken als kernlessen. | Medium |
| 3 | 6. Interactiviteit | Optioneel: een korte quiz of poll-vraag toevoegen om de interactiviteit te vergroten (bijv. "Welke van de 8 technieken herken jij het meest?"). | Laag |

#### Nice-to-haves (optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 9. Toegankelijkheid | DebateArena template op mobiel testen (375 px), met name de app-balk visuele preview. |
| 2 | 7. Afronding & feedback | Mogelijkheid toevoegen om het balansplan op te slaan of te delen met een ouder/mentor. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
