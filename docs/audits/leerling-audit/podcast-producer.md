# Audit — Podcast Producer (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `podcast-producer` |
| **Titel** | Podcast Producer |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | builder-canvas, enableChat |
| **SLO-kerndoelen** | 22A (Digitale producten maken), 21B (Media & Informatie) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Podcast Producer" is direct herkenbaar
- [x] `introDescription` geeft concrete opdracht — "Schrijf een podcastconcept en script over een tech-onderwerp dat jou boeit"
- [x] `problemScenario` is motiverend — mediaplatform zoekt tiener-stemmen, jij mag een pilot produceren
- [x] Moeilijkheidsgraad zichtbaar — "Medium" past bij de schrijf- en creatieve taken
- [x] `examplePrompt` geeft vliegende start — AI-muziek als thema is aansprekend voor jongeren

**Bronbestanden:** `config/agents/year2.tsx:1534-1545`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het scenario (online mediaplatform zoekt frisse stemmen) geeft de leerling een professionele rol. De groene kleur past bij creatief en fris. De visual preview met microfoon en audiosignaal is herkenbaar en motiverend.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — emerald-to-green gradient, past bij het media-thema
- [x] Visual preview is aantrekkelijk — microfoon met animerende audiobars is creatief
- [x] Geen afleidende animaties in preview
- [ ] Hardcoded kleurwaarde — `color: '#059669'` is hardcoded hex
- [x] Responsive — de preview gebruikt flexbox zonder fixed-width beperkingen

**Bronbestanden:** `config/agents/year2.tsx:1539, 1546-1562`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De audiosignaal-bars in de preview zijn creatief maar technisch hardcoded via inline `style={{ height: \`${h * 4}px\` }}` — dit is geen ernstig issue maar wel onconventioneel. De kleurcontrast van witte elementen op de groene achtergrond is voldoende.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Concept → Script → Opnameplan
- [x] Elke stap bouwt voort op de vorige — je kunt geen script schrijven zonder concept
- [x] Moeilijkheid past bij leerjaar 2 — schrijven en plannen is passend voor 14-15 jaar
- [x] Stap-voorbeelden zijn concreet — "Mijn podcast gaat over hoe AI muziek maakt, voor tieners..."
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)

**Bronbestanden:** `config/agents/year2.tsx:1593-1596, 1607-1623`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie fasen (concept, script, opnameplan) zijn de echte stadia van podcastproductie. De SCOPE GUARD ("de daadwerkelijke opname doet de leerling later buiten het platform") is didactisch slim: de missie focust op het plannings- en schrijfproces, wat ook zonder studio-apparatuur uitvoerbaar is.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — podcast-terminologie klopt
- [x] Begrippen worden uitgelegd — hook, storytelling, doelgroep, script, call-to-action
- [x] Taalgebruik past bij de leeftijdsgroep — enthousiast en motiverend
- [x] Geen onnodige Engelse termen zonder uitleg — "hook" en "call-to-action" worden verklaard
- [x] SLO-kerndoelen kloppen — 22A (media maken) en 21B (mediawijsheid)

**Bronbestanden:** `config/agents/year2.tsx:1575-1601`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De vier werkstappen in de systemInstruction (onderwerp kiezen, structuur leren, script schrijven, opnameplan maken) volgen een authentiek productieproces. De nadruk op persoonlijke stijl ("geen Wikipedia-samenvatting") is pedagogisch waardevol.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1300 tekens
- [x] EERSTE BERICHT aanwezig en motiverend — "🎙️ Welkom bij Podcast Studio!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 3 minuten script", "concept beschreven"
- [x] Toon past bij de rol — Podcast Mentor is warm en aanmoedigend
- [x] SCOPE GUARD aanwezig en relevant
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1564-1606`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT stelt meteen de kernvraag ("wat wil jij vertellen en aan wie?") die de leerling direct aan het denken zet. De STEP_COMPLETE criteria zijn helder en realistisch. De SCOPE GUARD is praktisch: als leerlingen willen opnemen, worden ze teruggestuurd naar het script.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chat-format past perfect bij creatief schrijven en plannen
- [x] Vrijheid in onderwerpkeuze — eigen interesses als startpunt
- [x] Iteratieve samenwerking — AI helpt bij verbeteren van script
- [x] `examplePrompt` verlaagt de drempel
- [ ] Geen preview-mogelijkheid van het script — leerlingen schrijven in chat maar zien geen geformatteerde versie

**Bronbestanden:** `config/agents/year2.tsx:1545, 1607-1623`

**Score:** 4 / 5

**Opmerkingen:**
> Het chatformat werkt goed voor creatief schrijven. Leerlingen kunnen volledig hun eigen onderwerp kiezen, wat de motivatie verhoogt. Een gemiste kans is dat er geen export- of opmaakfunctie is voor het script — leerlingen moeten het zelf kopiëren uit de chat.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd — ontbreekt
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null` — bewust leeg
- [x] STEP_COMPLETE (3/3) geeft wel een functionele voortgangsindicator

**Bronbestanden:** `config/agents/year2.tsx:1624`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort als andere J2P3-missies: geen afrondingselementen. Na de derde STEP_COMPLETE weet de leerling dat de missie klaar is, maar er is geen samenvatting van geleerde concepten of belonende badge. Voor een creatieve missie zou een badge als "Podcast Pioneer" goed passen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (digitale media maken) — leerling maakt een concreet podcastconcept en script
- [x] 21B (media & informatie) — leerling analyseert het medium podcast als communicatievorm
- [x] SLO-doelen expliciet vermeld in systemInstruction
- [x] Leerdoelen zijn toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:125`, `config/agents/year2.tsx:1583`

**Score:** 5 / 5

**Opmerkingen:**
> Perfecte SLO-aansluiting. De missie laat leerlingen daadwerkelijk een digitaal mediaproduct ontwerpen (22A) en het medium podcast als communicatievorm begrijpen (21B: doelgroep, hook, storytelling). De SLO-doelen zijn in de systemInstruction expliciet vermeld.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — helder, enthousiast taalgebruik
- [x] Vakjargon wordt verklaard in een begrippenlijst
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Chat-interactie is inherent toegankelijk

**Bronbestanden:** `config/agents/year2.tsx:1546-1562`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het enige punt is het ontbreken van alt-teksten op de preview-elementen. De chat-gebaseerde interactie is inclusief: leerlingen met dyslexie kunnen langzamer typen zonder tijdsdruk, en er is geen motorische vereiste.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterk scenario, motiverende rol |
| 2. Visueel | 4 | ×1 = 4 | Goed, hardcoded hex is kleine afwijking |
| 3. Didactische flow | 5 | ×2 = 10 | Authentieke productiefasen |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, begrippen goed uitgelegd |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig: EERSTE BERICHT + STEP + GUARD |
| 6. Interactiviteit | 4 | ×1 = 4 | Vrije keuze, geen script-export |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges, takeaways, goalCriteria |
| 8. SLO-aansluiting | 5 | ×1 = 5 | Perfecte match |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, alt-teksten ontbreken |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (5×1) + (4×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar** (81,8% — boven de 80% drempel)

> Sterke missie die leerlingen authentiek door een mediaprodutieproces begeleidt. Het enige structurele tekort (ontbreken van badges en takeaways) verlaagt de score maar blokkeert de inzet niet. Na toevoeging van afrondingselementen scoort deze missie >90%.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. Voeg toe voor completie-beleving. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex `#059669` vervangen door `lab-*` token. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Script-export functie zodat leerlingen hun podcastscript kunnen downloaden of kopiëren. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
