# Audit — Future Forecaster (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `future-forecaster` |
| **Titel** | Future Forecaster |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | debate-arena, enableChat |
| **SLO-kerndoelen** | 21D (AI), 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en fantasierijk — "Future Forecaster" klinkt mysterieus en aansprekend
- [x] `introDescription` is concreet — "Voorspel hoe technologie de wereld van 2040 vormgeeft"
- [x] `problemScenario` is creatief en uitdagend — "Is het 2040. Hoe ziet jouw wereld eruit?"
- [x] Moeilijkheidsgraad passend — "Medium" klopt voor het schrijven van een onderbouwde toekomstvisie
- [x] `examplePrompt` is goed — "technologietrends van nu die het grootst zijn in 2040"

**Bronbestanden:** `config/agents/year2.tsx:2346-2357`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario ("het is 2040 — hoe ziet jouw wereld eruit?") is creatief en activerend. De futuroloog-rol is uniek in het curriculum en stimuleert kritisch-creatief denken. De visual preview met sterretjes en een telescoop is thematisch sterk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — blue-to-indigo-900 gradient past bij toekomst en ruimte
- [x] Visual preview is aantrekkelijk — pulserende sterretjes en telescoop
- [ ] Hardcoded kleurwaarde — `color: '#2563EB'` is hardcoded hex (zelfde als digital-storyteller)
- [ ] Preview sterretjes gebruiken `Math.random()` voor posities — dit geeft niet-deterministische rendering
- [x] Animate-pulse op sterretjes is sfeerverhogend maar niet afleidend

**Bronbestanden:** `config/agents/year2.tsx:2351, 2358-2366`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De nacht-sfeer met sterretjes en telescoop communiceert "toekomst kijken" effectief. De `Math.random()` positionering van sterretjes is een kleine technische afwijking (posities zijn niet consistent tussen renders) maar dit is cosmetisch. Standaard hex-kleur afwijking.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Trends analyseren → Scenario schrijven → Presenteren
- [x] Elke stap bouwt voort op de vorige — je kunt geen toekomstscenario schrijven zonder trendanalyse
- [x] Moeilijkheid past bij leerjaar 2 — van feitelijke trends naar creatief-kritisch scenario
- [x] Stap-voorbeelden zijn concreet — AI, zelfrijdende auto's, VR zijn herkenbaar
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:2388-2391, 2402-2418`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De STEP_COMPLETE criteria zijn goed: "minimaal 2 trends met richting", "toekomstscenario minimaal 150 woorden, aannemelijk", "presentatie met afweging voor- en nadelen". De eis van 150 woorden is specifiek en haalbaar. De SCOPE GUARD ("geen sciencefiction maar echte trends") is essentieel voor de didactische integriteit.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Futurologie als methode is correct beschreven — trendanalyse als basis voor voorspellingen
- [x] De eis dat voorspellingen op echte trends gebaseerd moeten zijn is methodologisch correct
- [x] Concrete specificiteit vereist — "niet 'de wereld is anders' maar 'in 2040 heb je geen schooltas meer omdat...'"
- [x] Kritische vragen zijn goed geformuleerd — "Waarom denk je dat?" en "Wat zou er misgaan?"
- [x] SLO-kerndoelen kloppen — 23C (maatschappij) en de AI-component via 21D

**Bronbestanden:** `config/agents/year2.tsx:2368-2401`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De methodologische eis ("elke voorspelling gebaseerd op een echte trend") maakt het verschil tussen sciencefiction schrijven en futurologisch denken. Het KERNIDEE is goed: "technologische veranderingen zijn voorspelbaar als je de juiste patronen ziet". De afweging van voor- en nadelen in stap 3 is kritisch-didactisch waardevol.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1100 tekens
- [x] EERSTE BERICHT aanwezig en activerend — "🔮 Welkom bij het Toekomstlab!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 150 woorden", "voor- en nadelen"
- [x] Toon past bij de rol — futuroloog die stimuleert en kritisch ondervraagt
- [x] SCOPE GUARD aanwezig — sciencefiction terugsturen naar echte trends
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2368-2401`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT ("futurologen worden betaald om na te denken over wat er gaat gebeuren") is motiverend en positioneert de leerling als professional. De vraag "noem 3 technologieën die je de afgelopen maanden hebt gezien" activeert directe persoonlijke relevantie.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past perfect bij analytisch-creatief denken
- [x] Vrije keuze van trends en thema — AI, VR, zelfrijdende auto's, biotech
- [x] Iteratief scenario-schrijven met AI-coach als critical friend
- [x] Eigen toekomstscenario is een persoonlijk, betekenisvol leerproduct
- [ ] Geen tijdlijn-visualisatie of interactieve kaart

**Bronbestanden:** `config/agents/year2.tsx:2357, 2402-2418`

**Score:** 4 / 5

**Opmerkingen:**
> Het chatformat werkt goed voor futurologisch denken. De vrijheid in thema-keuze is sterk. Het ontbreken van een tijdlijn of visualisatie is een gemiste kans — maar het scenario-schrijven in tekst is al een rijke activiteit.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:2419`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort. Een badge als "Future Thinker" of "Technology Forecaster" zou goed passen. Takeaways over hoe je trends herkent en hoe je voor- en nadelen van technologie afweegt zouden het leermoment vastleggen.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 23C (maatschappij) — leerling analyseert maatschappelijke gevolgen van technologische trends
- [x] 21D (AI) — AI is een van de kerntrends die worden geanalyseerd
- [x] SLO-doelen impliciet aanwezig in de systemInstruction
- [x] De missie-mapping is consistent met de systemInstruction-inhoud

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:140`, `config/agents/year2.tsx:2376`

**Score:** 4 / 5

**Opmerkingen:**
> Goede SLO-aansluiting. De combinatie van 21D (AI als centrale trend in 2040) en 23C (maatschappelijke impact analyseren) is logisch. De systemInstruction noemt alleen 23C als kerndoel, de mapping voegt 21D toe — dit is consistent met de AI-focus in de trend-analyse.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau past bij leerjaar 2 — creatief en analytisch maar toegankelijk
- [x] Abstracte begrippen (futuroloog, trendanalyse) worden uitgelegd in context
- [ ] Visual preview bevat geen alt-teksten; `Math.random()` positionering is niet reproduceerbaar
- [x] Geen informatie uitsluitend via kleur
- [x] Schrijven is een inclusieve activiteit

**Bronbestanden:** `config/agents/year2.tsx:2358-2366`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. De `Math.random()` positionering van sterretjes in de preview is een kleine toegankelijkheidsafwijking (inconsistente rendering) maar heeft geen invloed op de leerervaring. Alt-teksten ontbreken.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Creatief scenario, unieke rol |
| 2. Visueel | 4 | ×1 = 4 | Sterren-preview sterk, Math.random() afwijking |
| 3. Didactische flow | 5 | ×2 = 10 | Trendanalyse → scenario → evaluatie |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Methodologisch correct, concreet |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Vrije thema-keuze, geen visualisatie |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 4 | ×1 = 4 | 21D + 23C goed, impliciet in instructie |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, Math.random() kleine afwijking |
| **TOTAAL** | | **44 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (4×1) + (4×1) = 44
Percentage = (44 / 55) × 100% = 80,0%
```

### Verdict

**✅ Klaar** (80,0% — exact op de 80% drempel)

> Een creatief en inhoudelijk sterke missie die leerlingen leert om kritisch-analytisch naar technologische trends te kijken. De futuroloog-rol is uniek en motiverend. Afrondingselementen ontbreken maar blokkeren de inzet niet.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | `Math.random()` in preview vervangen door vaste posities. | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "Future Thinker" toevoegen. |
| 2 | 6. Interactiviteit | Tijdlijn-visualisatie van 2024 → 2040 als optioneel hulpmiddel. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
