# Audit — AI Ethicus (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `ai-ethicus` |
| **Titel** | AI Ethicus |
| **Leerjaar & Periode** | Leerjaar 2, Periode 4 |
| **Template-engine** | debate-arena, enableChat |
| **SLO-kerndoelen** | 21D (AI), 23C (Maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en prikkelend — "AI Ethicus" klinkt professioneel en interessant
- [x] `introDescription` is concreet — "Ontmasker vooroordelen die verstopt zitten in AI-systemen"
- [x] `problemScenario` is relevant en actueel — AI-systeem op school dat leerlingen indeelt in niveaus
- [x] Moeilijkheidsgraad passend — "Hard" klopt voor abstracte ethische redenering
- [x] `examplePrompt` is inhoudelijk sterk — aanbevelingssystemen en bias zijn actuele vraagstukken

**Bronbestanden:** `config/agents/year2.tsx:2112-2123`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. Het scenario (AI op school die leerlingen indeelt) is bijzonder goed gekozen: het is direct relevant voor de eigen situatie van de leerling. Het raakt ook aan de EU AI Act (HIGH RISK classificatie) zonder dat expliciet te benoemen — didactisch knap. De visual preview met concentrische cirkels rondom een weegschaal is abstract maar sterk.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Kleurenschema consistent — violet-to-purple-900 gradient past bij ethiek en filosofie
- [x] Visual preview is abstract maar thematisch correct — weegschaal als ethiek-symbool
- [ ] Hardcoded kleurwaarde — `color: '#7C3AED'` is hardcoded hex
- [x] Concentrische ringen in de preview zijn decoratief en afleidingvrij
- [x] Responsive — preview gebruikt eenvoudige absolute positionering

**Bronbestanden:** `config/agents/year2.tsx:2117, 2124-2132`

**Score:** 4 / 5

**Opmerkingen:**
> Goede visuele presentatie. De weegschaal is een universeel symbool voor rechtvaardigheid en ethiek. De paarse kleurstelling past bij het intellectuele karakter van de missie. Standaard hardcoded hex afwijking.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische 3-stappenopbouw — Systeem onderzoeken → Ethische kwesties → Adviesrapport
- [x] Elke stap bouwt voort op de vorige — je kunt geen advies geven zonder kwesties te begrijpen
- [x] Moeilijkheid past bij "Hard" — van feitelijk onderzoek naar normatief oordeel
- [x] Stap-voorbeelden zijn concreet — TikTok-algoritme als voorbeeld is herkenbaar
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3) met kwantitatieve criteria

**Bronbestanden:** `config/agents/year2.tsx:2153-2156, 2167-2183`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie stappen volgen het ethisch analyseprocces: descriptief (hoe werkt het?) → evaluatief (wat is het probleem?) → prescriptief (wat moet er veranderen?). Dit is een legitiem ethisch redeneermodel. De STEP_COMPLETE criteria zijn goed: "minimaal 2 ethische kwesties", "wie benadeeld wordt", "concrete aanbevelingen".

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk?

**Checkpunten:**
- [x] Informatie is feitelijk correct — bias-vormen (data-bias, selectiebias, bevestigingsbias) kloppen
- [x] Relevante context — concrete voorbeelden zoals gezichtsherkenning en sollicitatiefilter
- [x] Taalgebruik past bij 13-14 jarigen — "Geef ALTIJD concrete voorbeelden die aansluiten bij de leefwereld"
- [x] SLO-kerndoelen kloppen — 21D (AI begrippen) en 23C (maatschappelijke impact)
- [x] Geen feitelijke fouten gevonden

**Bronbestanden:** `config/agents/year2.tsx:2134-2166`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en actueel. De bias-terminologie (data-bias, selectiebias, bevestigingsbias) is correct. De instructie om altijd voorbeelden te geven die bij de leefwereld van 13-14-jarigen aansluiten is essentieel voor begrip van abstracte AI-concepten. De koppeling aan de EU AI Act HIGH RISK classificatie is impliciet aanwezig (AI voor beoordeling leerresultaten).

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens lang — ~1200 tekens
- [x] EERSTE BERICHT aanwezig en motiverend — "⚖️ Welkom bij het AI Ethics Institute!"
- [x] STEP_COMPLETE markers aanwezig voor alle 3 stappen (3/3)
- [x] Verificatiecriteria zijn kwantitatief — "minimaal 2 ethische kwesties", "wie benadeeld wordt"
- [x] Toon past bij de rol — AI-ethiekexpert die kritisch denken stimuleert
- [x] SCOPE GUARD aanwezig — technische details terugsturen naar ethische focus
- [x] Farming-detectie via `SYSTEM_INSTRUCTION_SUFFIX`

**Bronbestanden:** `config/agents/year2.tsx:2134-2166`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende AI-coach. Het EERSTE BERICHT ("grote bedrijven en overheden gebruiken AI-systemen die het leven van mensen beïnvloeden — soms zonder dat die mensen het weten") is maatschappelijk krachtig en zet de juiste toon. De SCOPE GUARD is relevant: leerlingen worden verleid door technische details maar de missie gaat over ethiek.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Chatformat past bij onderzoeken en adviseren
- [x] Vrije keuze van AI-systeem — TikTok, gezichtsherkenning, sollicitatiefilter
- [x] Adviesrapport als eindproduct — concreet en realistisch leerproduct
- [x] Koppeling aan eigen leefwereld (TikTok-algoritme) verhoogt relevantie
- [ ] Geen simulatie van een biased AI-systeem — leerlingen beschrijven bias zonder het te ervaren

**Bronbestanden:** `config/agents/year2.tsx:2123, 2167-2183`

**Score:** 4 / 5

**Opmerkingen:**
> De chat-interactie werkt goed voor ethisch redeneren. De vrijheid in systeemkeuze is motiverend. Een gemiste kans: een korte simulatie van een biased beslissing (bijv. "dit AI-systeem beoordeelde jou als X omdat...") zou de ervaring concreter en meer emotioneel relevant maken.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is?

**Checkpunten:**
- [ ] `goalCriteria` niet gedefinieerd
- [ ] Geen badges gedefinieerd
- [ ] Geen `takeaways[]` aanwezig
- [x] `bonusChallenges: null`
- [x] STEP_COMPLETE (3/3) geeft functionele voortgang

**Bronbestanden:** `config/agents/year2.tsx:2184`

**Score:** 2 / 5

**Opmerkingen:**
> Zelfde structureel tekort als andere J2-missies. Een badge als "AI Ethics Advisor" of "Bias Hunter" zou goed passen. Takeaways over bias, transparantie en AI-rechtvaardigheid zijn inhoudelijk essentieel voor een kernmissie over AI-ethiek.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren?

**Checkpunten:**
- [x] 21D (AI begripen) — leerling begrijpt hoe bias in AI-systemen terechtkomt
- [x] 23C (maatschappelijke gevolgen) — leerling analyseert wie benadeeld wordt door biased AI
- [x] SLO-doelen expliciet in systemInstruction
- [x] Leerdoelen zijn toetsbaar via STEP_COMPLETE criteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:137`, `config/agents/year2.tsx:2142`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie combineert AI-begrip (21D: hoe werkt bias in algoritmes) met maatschappelijke impact (23C: wie wordt benadeeld, wat moet er veranderen). Dit is precies de samenhang die het SLO-curriculum beoogt voor digitale geletterdheid.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn er toegankelijkheidsproblemen?

**Checkpunten:**
- [x] Leesniveau passend voor 13-14 jaar — "Hard" maar met concrete voorbeelden goed te volgen
- [x] Vakjargon wordt uitgelegd — bias, data-bias, selectiebias zijn nader omschreven
- [ ] Visual preview bevat geen alt-teksten
- [x] Geen informatie uitsluitend via kleur
- [x] Chat-interactie is inclusief

**Bronbestanden:** `config/agents/year2.tsx:2124-2132`

**Score:** 4 / 5

**Opmerkingen:**
> Goed toegankelijk. Het abstracte onderwerp is toegankelijk gemaakt via concrete voorbeelden (TikTok, gezichtsherkenning). De chat-gebaseerde interactie is inherent inclusief. Alt-teksten ontbreken bij de preview.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Schoolnabij en actueel scenario |
| 2. Visueel | 4 | ×1 = 4 | Weegschaal-preview sterk, hardcoded hex |
| 3. Didactische flow | 5 | ×2 = 10 | Ethisch redeneermodel correct |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Correct, leefwereldgericht |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geïmplementeerd |
| 6. Interactiviteit | 4 | ×1 = 4 | Vrije systeemkeuze, geen simulatie |
| 7. Afronding & feedback | 2 | ×1 = 2 | Geen badges of takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21D + 23C perfect gekoppeld |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Goed, alt-teksten ontbreken |
| **TOTAAL** | | **45 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (2×1) + (5×1) + (4×1) = 45
Percentage = (45 / 55) × 100% = 81,8%
```

### Verdict

**✅ Klaar** (81,8% — boven de 80% drempel)

> Een sterke kernmissie over AI-ethiek die uitstekend aansluit bij de eigen leefwereld van leerlingen en actuele maatschappelijke vraagstukken. De enige structurele tekortkoming is het ontbreken van afrondingselementen.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen badges, takeaways of goalCriteria. | Product |

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Kort bias-scenario toevoegen als intro (bijv. "dit AI-systeem beoordeelde jou als..."). | Medium |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 7. Afronding | Badge "AI Ethics Advisor" toevoegen. |
| 2 | 4. Inhoud | Verwijzing naar EU AI Act Annex III punt 3b opnemen als extra context voor havo/vwo. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
