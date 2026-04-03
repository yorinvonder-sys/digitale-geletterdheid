# Audit — Digital Storyteller (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `digital-storyteller` |
| **Titel** | Digital Storyteller |
| **Leerjaar & Periode** | Leerjaar 2, Periode 3 |
| **Template-engine** | builder-canvas, enableChat |
| **SLO-kerndoelen** | 22A (Digitale producten ontwerpen), 21B (Media & Informatie) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en aansprekend — "Digital Storyteller" is duidelijk
- [x] `introDescription` is concreet — "Schrijf een interactief verhaal waar de lezer zelf keuzes maakt"
- [x] `problemScenario` is motiverend — game-studio zoekt iemand voor interactief verhaalprototype
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor narratief ontwerpen
- [x] `examplePrompt` is aansprekend — sci-fi ruimtereis past bij de doelgroep

**Bronbestanden:** `config/agents/year2.tsx:1718-1729`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het scenario (game-studio huurt jou in als prototype-ontwerper) geeft de leerling een professionele en creatieve rol. De visual preview met een boekje met keuze-knoppen A en B illustreert het concept direct en correct.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — blue-to-indigo gradient past bij verhalen en fantasie
- [x] Visual preview illustreert het concept goed — boekje met vertakkingsknoppen
- [ ] Hardcoded kleurwaarde — `color: '#2563EB'` is hardcoded hex
- [x] Responsive — preview gebruikt flexbox zonder problematische fixed-widths
- [x] Contrast is voldoende — witte elementen op blauwe achtergrond

**Bronbestanden:** `config/agents/year2.tsx:1723, 1730-1747`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De preview met het boekje en de twee keuze-knoppen (A en B) is helder en direct begrijpelijk — leerlingen begrijpen meteen wat "interactief verhaal" betekent. Kleine afwijking: hardcoded hex-kleur.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Structuur ontwerpen → Keuzemomenten toevoegen → Publiceren
- [x] Elke stap bouwt aantoonbaar voort — je kunt geen keuzes toevoegen zonder verhaalstructuur
- [x] Moeilijkheid past bij leerjaar 2 — creatief schrijven met structuur is passend
- [x] Stap-voorbeelden zijn concreet — ruimtestation-voorbeeld is levendig
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)

**Bronbestanden:** `config/agents/year2.tsx:1775-1778, 1789-1805`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen het klassieke ontwerp-proces: idee → uitwerking → publicatie. De STEP_COMPLETE criteria zijn helder: "minimaal 2 vertakkingspunten", "keuzemomenten uitgelegd waarom interessant", "beschreven hoe het gepresenteerd wordt". De SCOPE GUARD (terugsturen naar interactiviteit als leerling een lineair verhaal schrijft) is didactisch essentieel.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — branching narrative en storytelling-begrippen kloppen
- [x] Begrippen worden uitgelegd — branching narrative, keuzemomenten, spanningsboog, setting, protagonist
- [x] Taalgebruik past bij de doelgroep — creatief en aanmoedigend
- [x] Digitale dimensie is aanwezig — uitleg hoe digitale media nieuwe vertelvormen mogelijk maakt
- [x] SLO-kerndoelen kloppen — 22A (ontwerpen) en 21B (media begrijpen)

**Bronbestanden:** `config/agents/year2.tsx:1749-1788`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. Het KERNIDEE is goed geformuleerd: "digitale media maken nieuwe vormen van storytelling mogelijk die in print niet bestaan" — dit verbindt het creatieve product aan een breder mediawijsheidsbegrip. De begrippen zijn correct en leeftijdspassend.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en creatief — "📖 Storytelling Lab — jouw verhaal, jouw regels!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 2 keuzemomenten", "hoe het gepresenteerd wordt"
- [x] Toon past bij de rol — Verhalenverteller die stimuleert en begeleidt
- [x] SCOPE GUARD aanwezig — lineaire verhalen terugsturen naar interactiviteit
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:1749-1788`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT stelt direct de kernvraag: wie is je hoofdpersonage en welke moeilijke keuze staat die te wachten? Dit is narratief denken op het juiste niveau. De instructie "schrijf het verhaal niet zelf; begeleid de leerling" is essentieel voor een authentieke leerervaring.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past bij creatief schrijven en narratief ontwerpen
- [x] Vrijheid in genre en setting — sci-fi, fantasy, realisme, alles kan
- [x] Iteratieve samenwerking met AI-coach bij het uitwerken
- [ ] Geen visuele vertakkingstool — leerlingen beschrijven de structuur in tekst, kunnen geen diagram maken
- [ ] Het "publiceren" (stap 3) is conceptueel, niet functioneel — er is geen echte publicatiemogelijkheid

**Bronbestanden:** `config/agents/year2.tsx:1729, 1789-1805`

**Score:** 4 / 5

**Opmerkingen:**
> De chat werkt goed voor narratief ontwerp. Het ontbreken van een visuele vertakkingstool (flowchart) is een gemiste kans — leerlingen leren beter met een diagram van de verhaalvertakkingen. De "publicatiestap" is conceptueel correct (beschrijven hoe je het zou presenteren) maar kan demotiverend aanvoelen als er geen echte publicatieoptie is.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:1806`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort als overige J2P3-missies. Een badge als "Story Architect" of "Branching Narrative Designer" zou goed passen. Takeaways over interactieve media als communicatievorm zouden het leermoment vastleggen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 22A (digitale producten ontwerpen) — leerling ontwerpt een interactief digitaal verhaal
- [x] 21B (media begrijpen) — leerling begrijpt dat digitale media nieuwe vertelvormen mogelijk maakt
- [x] SLO-doelen expliciet in systemInstruction
- [x] Leerdoelen toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:127`, `config/agents/year2.tsx:1766`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. Het leerproduct (interactief verhaal) is een concreet digitaal product (22A). De reflectie op hoe digitale media nieuwe vertelvormen mogelijk maakt (21B) is expliciet in de missie verwerkt. Perfect.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — creatief en aanmoedigend
- [x] Vakjargon wordt verklaard — protagonist, spanningsboog, branching narrative
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Creatief schrijven is een inclusieve activiteit — geen fysieke drempels

**Bronbestanden:** `config/agents/year2.tsx:1730-1747`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Creatief schrijven is inherent inclusief. Leerlingen met dyslexie kunnen gebruik maken van spraak-naar-tekst. De enige afwijking is het ontbreken van alt-teksten op de preview-elementen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterk scenario, creatieve rol |
| 2. Visueel | 4 | ×1 = 4 | Goed, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Ontwerp-proces correct gevolgd |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Begrippen correct, digitale dimensie aanwezig |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig: EERSTE BERICHT + STEP + GUARD |
| 6. Interactiviteit | 4 | ×1 = 4 | Geen visuele tool, publicatie conceptueel |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | Perfect |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, alt-teksten ontbreken |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (5×1) + (4×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar** (81,8% — boven de 80% drempel)

> Kwalitatief sterke missie met uitstekende AI-coaching en SLO-aansluiting. Afrondingselementen ontbreken maar blokkeren de inzet niet. Na toevoeging van badges en takeaways scoort deze missie >90%.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Suggestie toevoegen om een eenvoudige vertakking-diagram te tekenen (op papier of Canva). | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Koppeling naar Twine of vergelijkbare gratis interactieve verhalentool. |
| 2 | 7. Afronding | Badge "Story Architect" toevoegen. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
