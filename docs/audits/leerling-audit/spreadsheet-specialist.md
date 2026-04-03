# Audit — Spreadsheet Specialist (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `spreadsheet-specialist` |
| **Titel** | Spreadsheet Specialist |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | DataViewer (3 datasets: tabel, staafgrafiek, document-cards) |
| **SLO-kerndoelen** | 21C, 22A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Word een Spreadsheet Specialist" is helder
- [x] `introDescription` beschrijft het scenario concreet (kasboek leerlingenraad)
- [x] `introFeatures` bevat 3 concrete leeractiviteiten (formules, grafiek, beoordelen)
- [x] Moeilijkheidsgraad "Medium" past bij spreadsheet-basisvaardigheden (J2)
- [x] Cyan-blauwe kleur en tabel-icoon zijn passend voor spreadsheets

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het kasboek van de leerlingenraad is een herkenbaar en aansprekend scenario voor 13-14 jarigen. De drie introFeatures geven een helder beeld van wat de leerling gaat leren.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Cyan-blauwe kleurschema is consistent door de hele missie
- [x] Drie dataset-types (tabel, staafgrafiek, document-cards) bieden visuele variatie
- [ ] Hardcoded chart-kleuren in de staafgrafiek (`#0891B2`, `#F59E0B`, etc.)
- [x] Document-cards met formule-cheatsheet zijn visueel overzichtelijk

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:82-88`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De kleurstelling past bij het data/spreadsheet-thema. Hardcoded chart-kleuren zijn het enige verbeterpunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen datasets op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: tabel (formules toepassen) → staafgrafiek (visualisatie begrijpen) → document-cards (formules leren kiezen)
- [x] Dataset 1 (kasboek) leert formules toepassen op realistische data
- [x] Dataset 2 (uitgaven per categorie) leert grafieken interpreteren
- [x] Dataset 3 (formule-cheatsheet) leert wanneer welke formule te gebruiken
- [x] De drie stap-voltooiing criteria in de agent-systemInstruction zijn helder
- [x] STEP_COMPLETE markers aanwezig in de systemInstruction (3/3)
- [x] De vragen stijgen in abstractieniveau: van "tel op" naar "leg uit wanneer gemiddelde misleidend is"

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`, `config/agents/year2.tsx:111-173`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De drie datasets vormen een coherente leerroute: doen (formules), zien (grafiek), begrijpen (wanneer welke formule). De cheatsheet in dataset 3 is een uitstekend scaffolding-hulpmiddel.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle data en instructies inhoudelijk?

**Checkpunten:**
- [x] Dataset 1: rekenvraag totaal uitgaven — 120+85+35+160+18+95 = 513 euro, klopt
- [x] Dataset 1: Subsidie als hoogste inkomsten (500+200=700 vs 42+230=272), klopt
- [x] Dataset 2: Evenement 460 euro als grootste post, klopt met de chartData
- [x] Dataset 2: 460-(53+35) = 372, klopt
- [x] Dataset 3: Formule-uitleg voor =SOM(), =GEMIDDELDE(), =MAX(), =MIN(), =AANTAL() is correct
- [x] De uitleg "uitschieters beïnvloeden het gemiddelde" is pedagogisch correct
- [x] Taalgebruik op B1-niveau voor 13-14 jaar

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk uitstekend. Alle berekeningen zijn gecontroleerd en correct. De formule-uitleg is nauwkeurig en didactisch sterk. De analogie "formules zijn als recepten" in de systemInstruction is een uitstekende didactische keuze.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1000 tekens
- [x] EERSTE BERICHT aanwezig: "Welkom in het Data Lab! Ik ben je spreadsheet-trainer."
- [x] STEP_COMPLETE markers aanwezig: stap 1 (werkende formule), stap 2 (grafiek aangemaakt), stap 3 (samenvatting)
- [x] SCOPE GUARD aanwezig
- [x] Pedagogische principes: NOOIT kant-en-klare formules, laat leerling zelf nadenken
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year2.tsx:111-173`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. EERSTE BERICHT, STEP_COMPLETE markers (3/3) en SCOPE GUARD aanwezig. De specifieke pedagogische regel "Schrijf formules NOOIT zomaar voor" is een goede anti-farming maatregel.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Kasboek van de leerlingenraad is een herkenbaar en betekenisvol scenario
- [x] Sorteren en filteren in de kasboek-tabel past bij de leerdoelen (SOM over "Uitgave"-rijen)
- [x] Staafgrafiek geeft directe visuele feedback op de data
- [x] Formule-cheatsheet als document-cards is interactief en bruikbaar als naslagwerk
- [x] Combinatie van multiple-choice, number-input en text-observation biedt differentiatie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. Het kasboek-scenario is geloofwaardig en direct bruikbaar als leeropdracht. De formule-cheatsheet heeft dubbele waarde: een interactief leermoment EN een naslagwerk voor toekomstig gebruik.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges: Formule-expert! (85+), Data-analist in opleiding (65+), Spreadsheet-starter (40+), Aan de slag! (0+)
- [x] `takeaways[]` bevat 5 concrete leerpunten
- [x] Punten per vraag zijn transparant: totaal = 20+15+10+10+15+10+15+5 = 100 — klopt precies

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:182-218`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De punten tellen exact op tot 100. De badges zijn passend voor het spreadsheet-thema. De takeaways zijn concreet en direct toepasbaar buiten de missie.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21C (Data en dataverwerking) sluit aan — formules, sorteerfiltering, datapatronen
- [x] SLO 22A (Digitale producten) sluit aan — spreadsheet als productietool
- [x] slo-kerndoelen-mapping.ts: `spreadsheet-specialist` → `['21C', '22A']` — correct
- [x] Periode 1 J2 context klopt: spreadsheets zijn een kernvaardigheid voor "Data & Informatie"

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:97`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie leert daadwerkelijk spreadsheet-vaardigheden (21C) en het gebruik van tools voor dataproductie (22A). De combinatie van kasboek + grafiek + formule-uitleg dekt de leerdoelen volledig.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend?

**Checkpunten:**
- [x] Leesniveau op B1-niveau — correct voor 13-14 jaar
- [x] Formule-analogie ("recepten") maakt abstracte concepten concreet
- [x] Tabel is sorteer- en filterbaar
- [x] Formule-cheatsheet is beschikbaar als naslagwerk
- [ ] =SOMALS() wordt vermeld als oplossing maar is niet uitgelegd in de formule-cheatsheet — discrepantie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:50, 128-154`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De formule-cheatsheet helpt leerlingen die het overzicht verliezen. Kleine discrepantie: de uitleg bij vraag 1 noemt =SOMALS() als oplossing, maar deze formule staat niet in de formule-cheatsheet in dataset 3. Leerlingen die de cheatsheet raadplegen zullen dit missen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Herkenbaar scenario, helder |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded chart-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekend, logische opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Alle berekeningen correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + STEP_COMPLETE + SCOPE GUARD |
| 6. Interactiviteit | 5 | ×1 = 5 | Authentiek scenario, goede variatie |
| 7. Afronding & feedback | 5 | ×1 = 5 | Punten tellen exact op, goede badges |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C + 22A correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | =SOMALS() mist in cheatsheet |
| **TOTAAL** | | **49 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (5×1) + (5×1) + (5×1) + (4×1) = 49
Percentage = (49 / 55) × 100% = 89,1%
```

### Verdict

**✅ Klaar voor inzet** (89,1% — ruim boven de 80% drempel)

> Een van de sterkste missies in J2P1. Alle berekeningen kloppen, de didactische flow is uitstekend, en de AI-coach heeft alle vereiste onderdelen. Kleine verbeterpunten zijn niet blokkerend.

---

### Actielijst

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | =SOMALS() toevoegen aan de formule-cheatsheet in dataset 3 | Laag |
| 2 | 2. Visueel | Hardcoded chart-kleuren vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
