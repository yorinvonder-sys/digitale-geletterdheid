# Audit — Innovation Lab (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `innovation-lab` |
| **Titel** | Innovation Lab |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | BuilderCanvas + AI-chat (chatRoleId: `innovation-lab`) |
| **SLO-kerndoelen** | 23C (Maatschappij), 22A (Digitale producten) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Bedenk een technologische oplossing voor de wereld"
- [x] `introDescription` is concreet — VN Innovation Lab context, SDGs als kader
- [x] `introFeatures` geeft vier stappen helder weer
- [x] Emoji (🔬) en scenario (VN, SDGs) zijn aansprekend voor J3
- [x] Moeilijkheidsgraad "Hard" past bij havo/vwo J3

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/innovation-lab.ts:1-18`, `config/agents/year3.tsx:1330-1407`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het VN Innovation Lab-scenario geeft een authentiek en ambitieus kader. De keuze om SDGs als startpunt te nemen is didactisch slim — leerlingen kiezen zelf een thema dat hen raakt. De intro maakt duidelijk dat creativiteit én haalbaarheid beide tellen.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — `#F59E0B` en `#10B981` zijn hardcoded hex in badges
- [x] BuilderCanvas-template is visueel consistent
- [x] Amber-gradient past bij het innovatie-thema
- [x] Tips zijn visueel onderscheiden van instructies
- [x] Responsive via template

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/innovation-lab.ts:86-91`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel sterk via de BuilderCanvas-template. De hardcoded hex-kleuren in de badge-definitie zijn een code-kwaliteitsissue maar beïnvloeden de leerervaring niet. De amber-gradient (🔬 Innovation Lab kleur) is consistent met het thema.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — SDG kiezen → Oplossing ontwerpen → MVP uitwerken → Impact presenteren
- [x] Elke stap bouwt voort op de vorige — impact presenteren is onmogelijk zonder stap 1-3
- [x] Design Thinking-methodologie is herkenbaar (empathie → idee → prototype)
- [x] Moeilijkheid past bij J3 havo/vwo
- [x] Checklist-items per stap zijn concreet en verifieerbaar
- [x] Airbnb MVP-voorbeeld in tip is herkenbaar en didactisch sterk

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/innovation-lab.ts:19-83`

**Score:** 5 / 5

**Opmerkingen:**
> Didactisch uitstekend. De vier stappen volgen de Design Thinking-cyclus en bouwen aantoonbaar op elkaar voort. Het Airbnb MVP-voorbeeld ("een simpele website met foto's van één appartement") is perfect gekozen voor de doelgroep. De instructie om ook risico's en bijeffecten te benoemen in stap 4 is een sterke ethische dimensie.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] SDG-referenties correct — SDG 3, 4, 10, 13 zijn correct omschreven
- [x] MVP-concept correct uitgelegd — kernfunctie + geen extra's
- [x] WhatsApp-voorbeeld correct — "heruitvond SMS niet, gebruikte internet voor berichten"
- [x] Geen spelfouten gevonden
- [x] Taalgebruik is toegankelijk en enthousiast

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/innovation-lab.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De SDG-omschrijvingen zijn correct. Het MVP-begrip is juist uitgelegd. De tip dat sociale media verbindt maar ook polarisatie veroorzaakt is een eerlijke en correcte observatie over onbedoelde gevolgen van technologie. Geen fouten gevonden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ~1900 tekens
- [x] EERSTE BERICHT aanwezig — "Uitvinder, welkom bij het Innovation Lab"
- [x] STEP_COMPLETE markers aanwezig (3/3) — SDG-probleem, 3 oplossingen kiezen, prototype beschrijven
- [x] Verificatievraag in EERSTE BERICHT — "Kies een SDG en beschrijf een concreet persoon"
- [x] Scope Guard — "In het Innovation Lab gaat het om het concept"
- [x] Toon: visionair en hands-on, passend bij innovatie-context

**Bronbestanden:** `config/agents/year3.tsx:1349-1406`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coaching structuur. De opdracht om een concreet persoon te beschrijven (niet een groep) is een klassieke Design Thinking-techniek die goed wordt ingezet. De SCOPE GUARD ("In het Innovation Lab gaat het om het concept") bewaakt de focus. De instructie "Geef NOOIT een kant-en-klare oplossing" borgt eigenheid.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Schrijf-interactie past bij leerdoel — innovatie ontwerpen is een creatief-analytisch proces
- [x] Vrije keuze van SDG geeft eigenaarschap
- [x] AI-chat biedt gepersonaliseerde begeleiding per gekozen SDG
- [x] Vier stappen geven voldoende variatie
- [x] Checklist-items per stap zijn actief en verifieerbaar

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas + AI-chat combinatie werkt goed. De vrije SDG-keuze geeft leerlingen eigenaarschap. Licht punt: het prototype-concept blijft puur tekstueel — een schets of wireframe zou de leerervaring verrijken. Geen blokkerende issues.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "VN Innovator" (≥90%), "Innovation Lab" (≥70%), "Probleemoplosser" (≥50%), "Op weg" (≥0%)
- [x] maxScore: 100
- [x] `takeaways[]` aanwezig — 5 concrete lessen over SDGs, MVP, impact en risico's
- [x] Badgenamen zijn thematisch passend
- [x] Checklist-items per stap maken duidelijk wanneer klaar

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/innovation-lab.ts:85-98`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De vijf takeaways zijn inhoudelijk compleet: SDGs kennen, oplossing ontwerpen, MVP begrijpen, impact beschrijven, risico's erkennen. De badge "VN Innovator" is aspirationeel en past bij het VN-context.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23C (Maatschappij) aanwezig — SDGs, maatschappelijk probleemanalyse, risico's en bijeffecten
- [x] 22A (Digitale producten) aanwezig — prototype-concept, MVP, productontwikkeling
- [x] Mapping in `slo-kerndoelen-mapping.ts` correct — `['23C', '22A']`
- [x] Leerdoel is toetsbaar — leerling produceert een prototype-beschrijving met impact-analyse

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:176`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 23C wordt ingevuld via SDG-koppeling en impact-analyse. 22A wordt ingevuld via prototype-ontwerp en MVP-beschrijving. Beide kerndoelen zijn aantoonbaar aanwezig in de missie-inhoud.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [x] Informatie niet alleen via kleur overgebracht — checklist-items zijn tekstueel
- [x] Toetsenbord-toegankelijkheid via template
- [ ] Kleurcontrast formeel niet geverifieerd — amber-gradient niet getest
- [x] SDG-keuze in EERSTE BERICHT is textueel beschreven (niet alleen visueel)

**Score:** 4 / 5

**Opmerkingen:**
> Geen fundamentele toegankelijkheidsproblemen. De amber-gradient is niet formeel WCAG AA-getest maar lijkt voldoende. De SDG-opties in het EERSTE BERICHT zijn tekst-gebaseerd.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Authentiek VN-scenario, sterke intro |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex in badges |
| 3. Didactische flow | 5 | ×2 = 10 | Design Thinking-cyclus, uitstekende opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | SDG + MVP correct, Airbnb voorbeeld sterk |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Alle structuurelementen aanwezig |
| 6. Interactiviteit | 4 | ×1 = 4 | Tekstueel sterk, schets/wireframe ontbreekt |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scores aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C + 22A beide aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | WCAG-test aanbevolen |
| **TOTAAL** | | **52 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 52
Percentage = (52 / 55) × 100% = 94,5%
```

### Verdict

**✅ Klaar** (94,5% — ruim boven de 80% drempel)

> Een sterk uitgewerkte missie die Design Thinking authentiek integreert in een maatschappelijk relevant kader. De SDG-koppeling, het MVP-begrip en de expliciete aandacht voor risico's en bijeffecten maken dit didactisch hoogwaardig. Direct inzetbaar in de pilot.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded hex in badges vervangen door `lab-*` tokens | Laag |
| 2 | 9. Toegankelijkheid | Formele WCAG AA kleurcontrast-test op amber-gradient | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Optionele schets-upload of wireframe-tool toevoegen voor prototype-stap |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
