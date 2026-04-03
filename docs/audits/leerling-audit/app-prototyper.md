# Audit — App Prototyper (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `app-prototyper` |
| **Titel** | App Prototyper |
| **Leerjaar & Periode** | Leerjaar 2, Periode 2 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Ontwerp een app van idee tot prototype"
- [x] `introDescription` concreet — schoolkantine-probleem is herkenbaar
- [x] Moeilijkheidsgraad "Medium" passend voor J2
- [x] Vier fasen duidelijk benoemd in template

**Bronbestanden:** `config/agents/year2.tsx:767-847`, `components/missions/templates/builder-canvas/configs/app-prototyper.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Het kantine-druktescenario is uitstekend gekozen: leerlingen herkennen het probleem uit hun eigen schoolleven. De EERSTE BERICHT-openingsvraag ("welk probleem wil jij oplossen met jouw app?") is open en activerend. De Instagram/TikTok-referentie ("begonnen als een schets op papier") is motiverend voor de doelgroep.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] BuilderCanvas-template biedt consistente visuele structuur
- [x] Roze/pink kleurthema consistent
- [ ] Hardcoded hex impliciet via Tailwind gradient — geen directe hex-probleem
- [x] Smartphone-icoon past bij het app-prototyping thema

**Bronbestanden:** `config/agents/year2.tsx:779-785`

**Score:** 4 / 5

**Opmerkingen:**
> De visualPreview is functioneel maar minder rijk dan network-navigator. Het is een eenvoudige gradient met een smartphone-icoon — dit is correct maar niet bijzonder onderscheidend. De template zorgt voor structurele consistentie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Probleem → Persona → Wireframes → Navigatie → Prototype
- [x] Vier fasen: "Gebruikersprobleem analyseren", "Schermen ontwerpen", "Gebruikersflow uitwerken", "Testplan schrijven"
- [x] UX-denken centraal — "denk ALTIJD vanuit de gebruiker"
- [x] SCOPE GUARD: "Focus op ontwerp, niet op echte code"
- [x] Moeilijkheidsgraad "Medium" correct voor J2

**Bronbestanden:** `config/agents/year2.tsx:799-828`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De UX-coach stelt de goede vragen op het juiste moment: eerst het probleem en de gebruiker, dan pas de schermen. De vraag "Is dit duidelijk voor iemand die de app voor het eerst opent?" is een krachtig UX-evaluatiecriterium dat leerlingen leren denken buiten hun eigen perspectief.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] UX-begrippen correct — wireframing, prototyping, UX-principes (eenvoud, consistentie, feedback)
- [x] Gebruikerspersona als begrip correct uitgelegd
- [x] "Focus op het ONTWERP, niet op echte code" is een correct pedagogisch kader
- [x] Geen spelfouten gevonden
- [x] Taalgebruik passend — creatief en gebruikersgericht

**Bronbestanden:** `config/agents/year2.tsx:786-828`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk correct. Het onderscheid tussen wireframe (schets), prototype (klikbaar) en echte app is duidelijk aangebracht. De UX-principes worden correct benoemd. STEP_COMPLETE criteria zijn helder: "minimaal 3 schermen beschreven met navigatiestructuur".

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` minimaal 500 tekens — ~1100 tekens
- [x] EERSTE BERICHT aanwezig — "App Incubator — jouw idee verdient een kans!"
- [x] STEP_COMPLETE markers aanwezig (3/3) — gebruikersonderzoek, wireframes, presentatie
- [x] SCOPE GUARD aanwezig — code-enthousiasme terugsturen naar ontwerp
- [x] Creatieve toon past bij app-design

**Bronbestanden:** `config/agents/year2.tsx:786-828`

**Score:** 5 / 5

**Opmerkingen:**
> Alle essentiële elementen aanwezig. De STEP_COMPLETE criteria zijn concreet: stap 1 vereist doelgroep + behoefte + probleem, stap 2 minimaal 3 schermen + navigatiestructuur, stap 3 presentatie met ontwerpkeuzes vanuit gebruikersperspectief. De toon (creatief, gebruikersgericht) past uitstekend bij het thema.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] BuilderCanvas met AI-chat is geschikt voor ontwerp-dialoog
- [x] Vier fasen bieden structuur voor het prototyping-proces
- [x] Leerlingen ontwerpen tekstueel — passend voor wireframing zonder echte tekensoftware
- [x] maxScore: 100 met badge-systeem

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas is een goede keuze voor een ontwerpgerichte missie. Leerlingen ontwerpen via tekst (beschrijvingen van schermen), wat realistisch is voor de context. Beperking: geen visuele wireframe-tool beschikbaar, leerlingen schetsen alleen tekstueel. Dit is een bewuste keuze (focus op UX-denken, niet tekensoftware), maar vermindert de hands-on factor.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig (4) — "UX Maestro" (90%), "App Designer" (70%), "Wireframe Maker" (50%), "Op weg"
- [x] maxScore: 100
- [x] takeaways aanwezig in BuilderCanvas-config
- [x] Badge "UX Maestro" is aantrekkelijk voor de doelgroep

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsstructuur. "UX Maestro" is een aspirerende badge die leerlingen motiveert. De vier fasen geven duidelijke progression.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] SLO 22A (Digitale vaardigheden) — correct, app-ontwerp en UX zijn digitale vaardigheden
- [x] Notitie in mapping ("prototype ontwerpen zonder code") is een correct onderscheid
- [x] Geen 22B-claim — terecht, want er wordt niet geprogrammeerd
- [x] Inhoud consistent met SLO-mapping

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:110`

**Score:** 5 / 5

**Opmerkingen:**
> De SLO-koppeling is correct en de mapping-opmerking ("prototype ontwerpen zonder code") is een waardevolle toelichting. 22A omvat digitale vaardigheden inclusief ontwerp van digitale producten.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau passend voor J2
- [x] Chat-gebaseerd — volledig tekstueel toegankelijk
- [x] Geen kleurafhankelijke informatie in de missie-flow
- [x] Creatieve taal is begrijpelijk en niet exclusief

**Score:** 5 / 5

**Opmerkingen:**
> De tekstuele en chat-gebaseerde aanpak maakt de missie volledig toegankelijk. App-ontwerp via tekstbeschrijvingen is inclusief voor leerlingen die geen tekensoftware kunnen bedienen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Kantine-scenario herkenbaar, activerende vraag |
| 2. Visueel | 4 | ×1 = 4 | Functioneel, geen hardcoded hex, niet bijzonder |
| 3. Didactische flow | 5 | ×2 = 10 | Probleem→Persona→Wireframe→Prototype correct |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | UX-begrippen correct, STEP_COMPLETE helder |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle elementen aanwezig, creatieve toon |
| 6. Interactiviteit | 4 | ×1 = 4 | BuilderCanvas goed, geen visuele wireframe-tool |
| 7. Afronding & feedback | 5 | ×1 = 5 | UX Maestro badge, maxScore compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A correct, 22B terecht niet geclaimd |
| 9. Toegankelijkheid | 5 | ×1 = 5 | Volledig tekstueel, inclusief |
| **TOTAAL** | | **54 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (5×1) = 54
Percentage = (54 / 55) × 100% = 98,2%
```

### Verdict

**✅ Klaar voor inzet** (98,2%)

> Een uitstekende missie die UX-denken op een toegankelijke en activerende manier aanbiedt. Het kantine-scenario, de creatieve toon en de volledige afrondingsstructuur maken dit tot een van de sterkste missies in J2P2.

---

### Actielijst

#### Verbeterpunten (nice-to-have)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Overweeg een eenvoudige scherm-template toe te voegen waarop leerlingen hun wireframe-beschrijvingen kunnen structureren | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
