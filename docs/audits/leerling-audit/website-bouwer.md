# Audit — Website Bouwer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `website-bouwer` |
| **Titel** | Website Bouwer |
| **Leerjaar & Periode** | Leerjaar 1, Periode 2 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22B (programmeren) + 22A (digitaal product) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk voor de doelgroep — "Website Bouwer" is direct en concreet
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht — "echte code typen" is een sterke uitnodiging
- [x] Emoji of visueel element past bij het thema — visuele preview met HTML-tags (`<html>`, `<body>`) in emerald/teal gradient is treffend
- [x] Moeilijkheidsgraad is zichtbaar of voelbaar uit de intro — "Medium" is correct voor een eerste kennismaking met HTML

**Bronbestanden:** `config/agents/year1.tsx:3952-3990`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De preview met zichtbare HTML-tags maakt onmiddellijk duidelijk dat je gaat programmeren. De belofte van "echte code typen" is motiverend voor J1-leerlingen die voor het eerst met code in aanraking komen. De emerald/teal gradient past goed bij het tech-thema.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren zijn consistent — emerald/teal gradient past bij het web-developer thema
- [x] Animaties zijn niet afleidend of overweldigend — geen overmatige animaties in de preview
- [ ] Kleuren via `lab-*` tokens — preview gebruikt hardcoded hex `#10B981` (Tailwind emerald-500) in plaats van `lab-*` token
- [ ] Responsive op minimaal 375 px breed (mobiel) — BuilderCanvas met live code preview is op kleine schermen beperkt; code typen op mobiel is onhandig

**Bronbestanden:** `config/agents/year1.tsx:3952-3990`, `components/missions/templates/builder-canvas/configs/web-developer.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De visuele presentatie is sterk en thematisch consistent. Het enige aandachtspunt is de hardcoded hex-kleur `#10B981` op het agent-object in plaats van een `lab-*` token. De BuilderCanvas met live HTML-preview is inherent minder geschikt voor mobiel — code typen op een telefoon is onprettig, maar dit is een aanvaardbare beperking voor een programmeerervaring.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw van eenvoudig naar complex — tag-voor-tag progressie: `<html>` → `<head>` → `<body>` → `<h1>` → `<p>` → `<img>`
- [x] Elke stap bouwt aantoonbaar voort op de vorige — leerling ziet het resultaat van elke tag direct in de live preview
- [x] Moeilijkheid past bij het leerjaar — J1, Medium, gestructureerde begeleiding voorkomt overweldiging
- [x] Geen onverklaard vakjargon of plotselinge sprongen in complexiteit — de systemInstruction legt elke tag uit met de recept-analogie ("HTML is als een recept") vóór de leerling hem typt

**Bronbestanden:** `config/agents/year1.tsx:3952-4070` (systemInstruction en steps)

**Score:** 5 / 5

**Opmerkingen:**
> Excellent didactisch ontwerp. De flow "uitleggen → typen → zien → volgende stap" is een bewezen scaffolding-aanpak voor beginnende programmeurs. De live preview zorgt voor directe feedback na elke stap, wat het leren versterkt. De systemInstruction geeft de AI-coach expliciete instructies om nooit de volledige code in één keer te geven — de leerling typt altijd zelf.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Informatie is feitelijk correct — HTML-structuur en tag-uitleg zijn technisch correct
- [x] Geen typografische fouten of spelfouten — taal is verzorgd door de hele systemInstruction
- [x] Taalgebruik past bij de leeftijdsgroep — informeel, enthousiast, zonder neerbuigend te zijn
- [x] Analogie werkt didactisch — "HTML als recept" (`<html>` = map, `<body>` = ingrediënten) is treffend en begrijpelijk
- [x] Veelgemaakte fouten worden proactief behandeld — systemInstruction bespreekt vergeten afsluit-tags en hoofdlettergevoeligheid

**Bronbestanden:** `config/agents/year1.tsx:3952-4070`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. De recept-analogie voor HTML-structuur is didactisch sterk en sluit aan bij de belevingswereld van J1-leerlingen. De systemInstruction is zorgvuldig geschreven: veelgemaakte fouten worden proactief besproken, de uitleg is stap-voor-stap, en de toon is enthousiast zonder te kinderachtig te zijn. Feitelijk klopt alles.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~3000+ tekens, uitgebreid en gedetailleerd
- [x] EERSTE BERICHT is aanwezig en heet de leerling goed welkom — aanwezig op regel 4019, met codevoorbeeld en concrete eerste opdracht
- [x] STEP_COMPLETE markers zijn aanwezig — "STAP-VOLTOOIING" sectie aanwezig (regels 4014-4017) met 3 duidelijke criteria
- [x] Verificatievragen aanwezig — "Wat zie je op je scherm?" na elk toegevoegd element
- [x] Toon past bij de rolnaam en het thema — "Web Developer Coach" is een logische en motiverende rol
- [x] Farming-detectie actief — via `SYSTEM_INSTRUCTION_SUFFIX` (gedeelde suffix)

**Bronbestanden:** `config/agents/year1.tsx:3952-4070`, `config/agents/shared.tsx`

**Score:** 5 / 5

**Opmerkingen:**
> Bijna goudstandaard AI-coach configuratie. Het EERSTE BERICHT is uitstekend: het stelt de coach voor, geeft een motiverend codevoorbeeld, en geeft een concrete eerste opdracht. De STEP_COMPLETE markers zijn helder en meetbaar. De verificatievraag "Wat zie je op je scherm?" dwingt leerlingen om de live preview te gebruiken en verankert het leren. De systemInstruction bevat expliciete instructies voor foutafhandeling.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Interactietype past bij het leerdoel — echte code typen in een live-preview editor is de meest authentieke manier om HTML te leren
- [x] Voldoende variatie — progressieve opbouw van lege pagina naar volledige website met meerdere elementen
- [x] Feedback op fouten is leerzaam — live preview toont onmiddellijk het effect van een fout
- [x] BuilderCanvas geeft directe visuele beloning — elke tag die je typt verandert iets zichtbaars

**Bronbestanden:** `components/missions/templates/builder-canvas/`, `config/agents/year1.tsx:3952`

**Score:** 5 / 5

**Opmerkingen:**
> De combinatie van BuilderCanvas (live code preview) + AI-chat coach is de meest effectieve interactievorm voor dit leerdoel. Het is authentiek (echte HTML, echte browser-rendering), het geeft directe feedback, en het is intrinsiek motiverend omdat leerlingen iets zichtbaars bouwen. Dit is een sterke keuze die het leereffect maximaliseert.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Completion-criteria zijn helder — `goalCriteria: { type: 'steps-complete', min: 3 }` aanwezig
- [x] Stap-voltooiingscriteria zijn duidelijk voor de AI-coach (3 criteria in STEP_COMPLETE sectie)
- [ ] Badges hebben betekenisvolle namen — geen badges gedefinieerd
- [ ] `takeaways[]` vatten de kernlessen samen — geen takeaways gedefinieerd

**Bronbestanden:** `config/agents/year1.tsx:4014-4017` (STEP_COMPLETE), `config/agents/year1.tsx:4019` (goalCriteria)

**Score:** 4 / 5

**Opmerkingen:**
> De goalCriteria en STEP_COMPLETE markers zijn aanwezig en functioneel — de missie weet wanneer een leerling klaar is. Wat ontbreekt zijn formele badges en takeaways die de geleerde stof samenvatten. Een leerling bouwt een echte website (dat is de output), wat op zichzelf betekenisvol is als afsluiting. Toch zouden badges ("Web Developer Jr.") en takeaways de didactische sluiting versterken.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht het geclaimde SLO-kerndoel aantoonbaar — 22B (programmeren) is perfect: leerlingen schrijven echte HTML-code
- [x] 22A (digitaal product maken) klopt — leerlingen bouwen letterlijk een digitaal product (een webpagina)
- [x] Het leerdoel is toetsbaar — leerling heeft aan het einde een werkende webpagina met minimaal 3 HTML-elementen
- [x] Dubbele SLO-dekking versterkt de missiewaarde — programmeren én een product maken zijn twee kanten van dezelfde activiteit

**Bronbestanden:** `config/agents/year1.tsx:3952`, `config/slo-kerndoelen-mapping.ts`, `config/curriculum.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De combinatie 22B + 22A is perfect voor een missie waarbij leerlingen een echte website bouwen. Het leerdoel is volledig toetsbaar: aan het einde heeft de leerling een werkende HTML-pagina met aantoonbaar zelf geschreven code. Dit is een van de sterkst-gemapte missies in de curriculum.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — duidelijk, kort, informeel, geschikt voor J1
- [x] Tekst-gebaseerde interactie is toetsenbord-toegankelijk — code typen werkt met toetsenbord
- [x] Eenvoudig woordgebruik — de recept-analogie maakt abstracte concepten concreet
- [ ] Responsive op mobiel — code typen op een klein scherm blijft problematisch

**Bronbestanden:** `config/agents/year1.tsx:3952-4070`, `components/missions/templates/builder-canvas/`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke toegankelijkheid voor een programmeerervaring. Tekst-gebaseerde code-invoer is van nature toetsenbord-toegankelijk, wat een groot voordeel heeft ten opzichte van canvas-gebaseerde missies. Het woordgebruik is eenvoudig (B1-niveau). De beperking is mobiel gebruik — code typen op een telefoon is onprettig, maar dit is een aanvaardbaar compromis voor een desktop-gerichte programmeerervaring.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Duidelijke preview, uitnodigende beschrijving |
| 2. Visueel | 4 | ×1 = 4 | Sterk, hardcoded hex is enig minpunt |
| 3. Didactische flow | 5 | ×2 = 10 | Tag-voor-tag progressie, live preview |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Recept-analogie, foutafhandeling, correct NL |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + STEP_COMPLETE + verificatie |
| 6. Interactiviteit | 5 | ×1 = 5 | Authentiek, directe feedback, intrinsiek motiverend |
| 7. Afronding & feedback | 4 | ×1 = 4 | goalCriteria aanwezig, geen badges/takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22B + 22A perfect, leerdoel toetsbaar |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Toetsenbord OK, mobiel beperkt |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (4×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar voor pilot** (94,5% — bijna goudstandaard)

> Een van de sterkst uitgewerkte missies in het platform. De combinatie van BuilderCanvas, uitstekende AI-coach configuratie en sterke SLO-aansluiting maakt dit tot een modelimplementatie. De enige verbeterpunten zijn klein en niet-blokkerend: hardcoded hex-kleur en ontbrekende badges/takeaways. Direct inzetbaar in de pilot.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

_Geen blokkerende issues._

#### Verbeterpunten (score 3-4 — oplossen vóór of tijdens pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#10B981` vervangen door `lab-*` token. | Laag |
| 2 | 7. Afronding & feedback | Badges toevoegen (bijv. "Web Developer Jr.") en `takeaways[]` met de 3 kernlessen. | Medium |
| 3 | 9. Toegankelijkheid | Optioneel: mobiele ervaring testen en eventueel vereenvoudigde mobiele layout voor BuilderCanvas. | Laag |

#### Nice-to-haves (score 5 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Bonusopdracht toevoegen: eigen kleuren of links toevoegen aan de gebouwde pagina. |
| 2 | 8. SLO-aansluiting | Toetsbare afrondingsvraag formuleren: "Wat doet de `<h1>` tag?" als mini-quiz bij voltooiing. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
