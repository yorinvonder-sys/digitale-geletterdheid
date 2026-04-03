# Audit — Mission Blueprint (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `mission-blueprint` |
| **Titel** | De Blauwdruk |
| **Leerjaar & Periode** | Leerjaar 1, Periode 4 |
| **Template-engine** | BuilderCanvas (4 stappen, text-preview, enableChat) |
| **SLO-kerndoelen** | 22A (Digitale producten) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Plan je meesterwerk" is helder
- [x] `introDescription` geeft een concrete, begrijpelijke opdracht
- [x] `introFeatures` bevat 4 concrete leeractiviteiten
- [x] Moeilijkheidsgraad "Easy" past bij de aard van de opdracht (plannen)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts:1-18`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De vier introFeatures (taken opbreken, volgorde bepalen, tijdsindeling, cloud-opslag) geven de leerling een duidelijk beeld van wat er te wachten staat. De emoji (kaart) past bij het thema projectplanning.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent? Is de tekst goed leesbaar?

**Checkpunten:**
- [x] `previewType: 'text-preview'` — geen canvas-gerelateerde problemen
- [x] Kleur `#1A1A19` (donker) voor de agent in year1.tsx is consistent met het "blauwdruk"-thema
- [x] Visuele preview met blueprint-patroon en "Build Setup" tekst is thematisch sterk
- [ ] `color: '#F59E0B'` in badge-config is hardcoded hex — zou `lab-amber` token moeten zijn

**Bronbestanden:** `config/agents/year1.tsx:3031-3047`, `components/missions/templates/builder-canvas/configs/mission-blueprint.ts:82-88`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De blueprint-preview is thematisch passend. Kleine aanmerking: hardcoded hex-kleuren in de badge-configuratie (`#F59E0B`, `#10B981`, `#D97757`, `#6B6B66`) zouden vervangen moeten worden door lab-tokens voor consistentie.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: Project beschrijven → Taken opschrijven → Volgorde bepalen → Opslaan in cloud
- [x] Elke stap heeft een duidelijke `description`, concrete `instruction` met voorbeelden, en een `tip`
- [x] Checklistsysteem per stap geeft de leerling concrete "done"-criteria
- [x] Moeilijkheid past bij leerjaar 1 (eenvoudige planningstaak, herkenbaar voor 12-13 jarigen)
- [x] Scaffolding in systemInstruction: NIET het werk doen, maar vragen stellen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts:19-81`, `config/agents/year1.tsx:3062-3111`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De vier stappen bouwen logisch op elkaar voort: je moet eerst weten WAT je maakt voordat je taken kunt opschrijven, en je moet taken hebben voordat je ze kunt ordenen. De checklistItems per stap (3-4 items) geven concrete "done"-criteria. De systemInstruction in de AI-coach versterkt dit met expliciete scaffolding-tips.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies inhoudelijk? Is het Nederlands begrijpelijk voor 12-13 jarigen?

**Checkpunten:**
- [x] Projectmanagement-concepten correct beschreven (afhankelijkheden, tijdsinschatting, takenlijst)
- [x] Taalgebruik op B1-niveau, begrijpelijk voor 12-13 jaar
- [x] Geen vakjargon zonder uitleg — "afhankelijkheid" wordt concreet gemaakt met een voorbeeld
- [x] De 2-uur-splitsregel is een gangbare best practice in projectmanagement
- [x] Cloud-opslagadvies is correct en actueel (Google Docs, OneDrive, Notion)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts`, `config/agents/year1.tsx:3048-3116`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De instructies zijn praktisch en correct. Bijzonder goed: de definitie van Done als expliciet concept, de taak-splitsregel ("meer dan 2 uur = te groot"), en de concrete afhankelijkheidsuitleg. SLO-kerndoelen (21A, 22A) zijn expliciet vermeld in de systemInstruction.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig en heet de leerling goed welkom met een motiverende opening
- [ ] STEP_COMPLETE markers ontbreken — de AI-coach heeft geen expliciete stap-voltooiing-triggers
- [x] Verificatievragen zijn ingebouwd via "past als dit duidelijk is, ga je naar stap 2"
- [x] Toon past bij de doelgroep — enthousiast maar gestructureerd, gericht op 12-13 jaar
- [x] Scaffolding-tips aanwezig voor vastgelopen leerlingen (3 scenario's)
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year1.tsx:3048-3111`

**Score:** 4 / 5

**Opmerkingen:**
> Goede systemInstruction met EERSTE BERICHT en scaffolding-tips. Het ontbreken van STEP_COMPLETE markers is een gemiste kans voor voortgangstracking, maar de BuilderCanvas-template heeft zijn eigen checklistsysteem dat dit deels compenseert. De AI-coach is een "Project Manager Coach" met duidelijke pedagogische principes.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Checklistsysteem per stap is interactief en concreet
- [x] Tekstinvoer per stap sluit aan bij het leerdoel (schrijven = het plannen uitvoeren)
- [x] Chat-functionaliteit ingeschakeld voor begeleide interactie met AI
- [x] `textPrompt` per stap geeft de leerling een duidelijke startvraag
- [x] Variatie: 4 stappen met elk andere instructie en andere checklistItems

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts:19-81`

**Score:** 4 / 5

**Opmerkingen:**
> De combinatie van checklistsysteem + vrije tekstinvoer + AI-chat is een sterke interactievorm voor een planningsopdracht. De tekst-preview mode past perfect bij een schrijf-opdracht. Kleine kanttekening: de interactie is vrij open (je schrijft tekst in), wat voor sommige leerlingen te vrijblijvend kan voelen zonder de AI-coach erbij.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges gedefinieerd met betekenisvolle namen: Projectmanager (90+), Planner (70+), Takenlijst Maker (50+), Op weg (0+)
- [x] `takeaways[]` bevat 5 leerpunten die de kernlessen samenvatten
- [x] Checklistsysteem geeft per stap aan wanneer de leerling klaar is
- [ ] Score-berekening is niet zichtbaar in de config — onduidelijk hoe punten worden toegekend

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts:82-98`

**Score:** 4 / 5

**Opmerkingen:**
> Goede afrondingselementen. De badges zijn betekenisvol en de takeaways zijn concreet en direct gekoppeld aan de leerdoelen. Het scoreberekeningssysteem is niet transparant in de config, maar de template zelf handelt dit waarschijnlijk af via de checklistItem-voortgang.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 22A (Digitale producten: planmatig werken) sluit aan — leerling maakt een planning in Word/cloud
- [x] SLO-kerndoelen zijn expliciet vermeld in de systemInstruction ("21A: Digitale systemen functioneel inzetten", "22A: Werkwijzen bij het maken van digitale producten")
- [x] slo-kerndoelen-mapping.ts: `mission-blueprint` → `['22A']` — correct
- [x] Periode 4 (Eindproject) context klopt: plannen is de eerste stap van het eindproject

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:84`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie leert daadwerkelijk planmatig werken (22A) door het letterlijk te laten doen: taken opschrijven, ordenen, tijdsindeling maken en opslaan. De SLO-kerndoelen zijn expliciet in de systemInstruction opgenomen, wat de koppeling voor docenten transparant maakt.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states en kleurcontrast aanwezig?

**Checkpunten:**
- [x] Leesniveau op B1 — correct voor 12-13 jaar
- [x] Tekstinvoer-interface is toetsenbord-toegankelijk
- [x] Geen informatie uitsluitend via kleur overgebracht (checklistsysteem gebruikt ook labels)
- [ ] Kleurcontrast van hardcoded badge-kleuren (#F59E0B geel op wit) niet getoetst
- [x] Geen afbeeldingen met ontbrekende alt-tekst (geen afbeeldingen in stap-content)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-blueprint.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Toegankelijkheid is goed voor een tekstgebaseerde missie. Geen grote blokkades. Het gele badge-kleur (#F59E0B) op een witte achtergrond is mogelijk onvoldoende contrast voor WCAG AA (4.5:1 vereist). Dit is een verbeterpunt maar geen blokkade.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Uitstekende intro met concrete features |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex in badges, rest goed |
| 3. Didactische flow | 5 | ×2 = 10 | Logische opbouw, sterke scaffolding |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Feitelijk correct, B1-niveau |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | Mist STEP_COMPLETE, rest sterk |
| 6. Interactiviteit | 4 | ×1 = 4 | Checklist + chat + tekstinvoer werkt goed |
| 7. Afronding & feedback | 4 | ×1 = 4 | Badges en takeaways aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A klopt, expliciet in systemInstruction |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekstgebaseerd = goed, kleurbadges onduidelijk |
| **TOTAAL** | | **46 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (4×1) + (4×1) + (5×1) + (4×1) = 46
Percentage = (46 / 55) × 100% = 83,6%
```

### Verdict

**✅ Klaar voor inzet** (83,6% — boven de 80% drempel)

> Sterke, goed doordachte missie. De combinatie van BuilderCanvas-template met een AI-coach en checklistsysteem werkt uitstekend voor een planningsopdracht. Geen blokkerende issues.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 5. AI-coach | STEP_COMPLETE markers toevoegen aan systemInstruction voor betere voortgangstracking | Laag |
| 2 | 2. Visueel | Hardcoded hex-kleuren in badges vervangen door `lab-*` tokens | Laag |
| 3 | 9. Toegankelijkheid | Badge-kleur `#F59E0B` controleren op WCAG AA contrast (4.5:1) | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Voorbeeldplanning toevoegen als referentie voor leerlingen die vastlopen |
| 2 | 7. Afronding | Score-toewijzingslogica per checklistItem transparant maken in config |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
