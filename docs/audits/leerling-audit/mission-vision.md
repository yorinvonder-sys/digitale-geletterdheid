# Audit — Mission Vision (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `mission-vision` |
| **Titel** | De Visie |
| **Leerjaar & Periode** | Leerjaar 1, Periode 4 |
| **Template-engine** | BuilderCanvas (4 stappen, text-preview, enableChat) |
| **SLO-kerndoelen** | 22A, 21B |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Visualiseer je droom" is aantrekkelijk en motiverend
- [x] `introDescription` beschrijft de missie concreet (moodboard + pitch-presentatie)
- [x] `introFeatures` bevat 4 duidelijke leeractiviteiten
- [x] Moeilijkheidsgraad "Medium" past bij het creatieve karakter (meer keuzes dan bij Blauwdruk)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts:1-15`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het intro legt glashelder uit dat leerlingen een moodboard gaan maken en een pitch gaan schrijven. De Apple/Spotify-anekdote in het EERSTE BERICHT van de AI-coach geeft direct relevantie. Visuele preview (gloeilamp, amber gradient) past uitstekend bij het creativiteitsthema.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Visuele preview met gloeilamp-icoon en amber gradient is thematisch passend
- [x] `animate-pulse` op het gloeilampicoon is intentioneel en niet afleidend
- [ ] `color: '#F59E0B'` in het agent-object en badges zijn hardcoded hex — zou `lab-amber` moeten zijn
- [x] `previewType: 'text-preview'` past bij een schrijf/ontwerpopdracht

**Bronbestanden:** `config/agents/year1.tsx:3124-3138`, `components/missions/templates/builder-canvas/configs/mission-vision.ts:84-89`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel sterk en coherent. De amber-gele kleurenschema past bij het "visie" en "creativiteit" thema. Hardcoded hex-kleuren in de badges zijn het enige verbeterpunt, consistent met mission-blueprint.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: Visie formuleren → Moodboard maken → Slides ontwerpen → Pitch schrijven
- [x] Elke stap bouwt voort op de vorige: visie bepaalt moodboard, moodboard bepaalt slides, slides worden samengevat in de pitch
- [x] Elke stap heeft gedetailleerde `instruction` met concrete aanwijzingen (bijv. "Wij geloven in een wereld waar...")
- [x] Scaffolding in systemInstruction: concrete voorbeelden per moeilijkheid (games, apps, sport)
- [x] Checklistsysteem per stap geeft concrete "done"-criteria (3-4 items per stap)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts:19-82`, `config/agents/year1.tsx:3153-3204`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier stappen vormen een coherent creatief proces: van abstract (wat droom je?) naar concreet (hoe pitch je het?). De instructies bevatten concrete sjablonen ("Wij geloven in een wereld waar [jouw droom] werkelijkheid is") die leerlingen op weg helpen zonder het werk over te nemen. De scaffolding-tips voor kleurkeuze zijn bijzonder goed voor 12-13 jarigen.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies inhoudelijk?

**Checkpunten:**
- [x] Moodboard-concept correct beschreven (sfeer, beelden, kleuren)
- [x] Presentatieprincipes kloppen (minder tekst, ene boodschap per slide, design-principes)
- [x] Pitch-structuur (probleem → oplossing → voorbeeld → uitnodiging) is een gangbare aanpak
- [x] Taalgebruik op B1-niveau, met jongerenreferenties (games, apps, Nike, Fortnite)
- [x] De visuele hierarchie-tip ("Sterkste presentaties hebben weinig tekst") klopt

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts`, `config/agents/year1.tsx:3153-3204`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De presentatie- en pitch-instructies zijn professioneel en didactisch correct. De link naar realistische tools (PowerPoint, Google Slides, Canva) maakt het direct toepasbaar. SLO-kerndoelen (21B: Media en informatie, 22A: Digitale producten) zijn expliciet vermeld in de systemInstruction.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig met motiverende opening (Apple/Spotify anekdote)
- [ ] STEP_COMPLETE markers ontbreken — geen expliciete stap-voltooiing-triggers in de systemInstruction
- [x] Concrete scaffolding-tips voor vastgelopen leerlingen (kleurkeuze, doelgroep, "waarom")
- [x] Toon is creatief en inspirerend, past bij de rol "Creatief Director"
- [x] "NOOIT het werk voor de leerling doen" is expliciet als regel opgenomen
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year1.tsx:3139-3210`

**Score:** 4 / 5

**Opmerkingen:**
> Uitstekende systemInstruction met sterk EERSTE BERICHT. De Creatief Director-rol is goed uitgewerkt. Ontbrekende STEP_COMPLETE markers zijn wederom het enige structurele tekort, maar de BuilderCanvas-template compenseert dit met checklistItems.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Vier stappen met elk een tekstinvoer-vlak en checklistsysteem
- [x] Chat-functionaliteit ingeschakeld voor creatieve begeleiding
- [x] Stap 2 (moodboard in woorden beschrijven) is een creatieve maar haalbare opdracht
- [x] Stap 4 (pitch schrijven als gesproken woord) sluit aan bij realistische vaardigheden
- [ ] Geen mogelijkheid om echte afbeeldingen toe te voegen aan het moodboard — leerlingen beschrijven alleen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts:19-82`

**Score:** 4 / 5

**Opmerkingen:**
> Sterke interactie. De tekst-preview mode is geschikt voor schrijf- en ontwerpopdrachten. Het beschrijven van het moodboard in woorden (in plaats van echte beelden) is een pragmatische keuze — het focust op het denken achter de visuele keuzes. Leerlingen die visueel ingesteld zijn kunnen mogelijk minder gefaciliteerd worden, maar dit is acceptabel voor een J1-missie.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges en scores logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges gedefinieerd: Visionair (90+), Ideeënspreker (70+), Moodboard Maker (50+), Op weg (0+)
- [x] `takeaways[]` bevat 5 leerpunten die de kernlessen samenvatten
- [x] Checklistsysteem geeft per stap aan wanneer de leerling klaar is
- [x] De pitch-stap heeft concrete criteria (4 onderdelen, gesproken taal, uitnodiging, 250-300 woorden)

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts:84-97`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende afronding. De badges zijn goed gekozen — "Visionair" past bij de hoogste score, "Moodboard Maker" bij een gemiddelde score. De takeaways zijn concreet en leerling-gericht ("Je weet hoe je een visie formuleert die anderen inspireert").

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 22A (Digitale producten) sluit aan — leerling ontwerpt een visueel product (moodboard + presentatie)
- [x] SLO 21B (Media en informatie) sluit aan — bewust kiezen van beelden en kleuren om een boodschap over te brengen
- [x] slo-kerndoelen-mapping.ts: `mission-vision` → `['22A', '21B']` — correct
- [x] Periode 4 (Eindproject) context klopt: de visie is de tweede stap na de blauwdruk

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:85`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. Zowel 22A als 21B worden daadwerkelijk bediend: leerlingen maken een digitaal product (presentatie) en leren bewust omgaan met media-keuzes (beelden, kleuren, sfeer). Dit is de meest creatieve missie in het J1P4-eindproject en de SLO-doelen zijn passend.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau op B1 — correct voor 12-13 jaar, met jargon dat uitgelegd wordt
- [x] Tekstinvoer-interface is toetsenbord-toegankelijk
- [ ] Pitch-stap (250-300 woorden, gesproken taal) kan uitdagend zijn voor leerlingen met dyslexie of taalachterstand
- [ ] Geen alternatieve opdrachtvorm voor leerlingen die moeite hebben met schrijven

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/mission-vision.ts:67-80`

**Score:** 3 / 5

**Opmerkingen:**
> De missie is sterk voor taalvaardige leerlingen, maar de schrijfintensieve aard (vier uitgebreide tekstvelden + een 2-minuten pitch) kan belemmerend zijn voor leerlingen met dyslexie of een taalachterstand. Er is geen alternatieve opdrachtvorm beschikbaar. Dit is een punt van aandacht voor inclusiviteit in heterogene klassen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Sterke intro, motiverende opening |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded hex badges |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekende opbouw, goede scaffolding |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | Professionele instructies, B1-niveau |
| 5. AI-coach kwaliteit | 4 | ×1 = 4 | Mist STEP_COMPLETE, rest sterk |
| 6. Interactiviteit | 4 | ×1 = 4 | Checklist + chat werkt, geen echte beelden |
| 7. Afronding & feedback | 5 | ×1 = 5 | Uitstekende badges en takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A + 21B correct |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Schrijfintensief, geen alternatieve vorm |
| **TOTAAL** | | **46 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (4×1) + (4×1) + (5×1) + (5×1) + (3×1) = 46
Percentage = (46 / 55) × 100% = 83,6%
```

### Verdict

**✅ Klaar voor inzet** (83,6% — boven de 80% drempel)

> Sterke creatieve missie met uitstekende didactische flow en SLO-aansluiting. De enige serieuze aandachtspunten zijn de schrijfintensiviteit (toegankelijkheid) en de ontbrekende STEP_COMPLETE markers.

---

### Actielijst

#### Verbeterpunten (score 3-4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Alternatieve opdrachtvorm overwegen voor leerlingen met schrijfproblemen (bijv. mondeling pitch opnemen) | Medium |
| 2 | 5. AI-coach | STEP_COMPLETE markers toevoegen aan systemInstruction | Laag |
| 3 | 2. Visueel | Hardcoded hex-kleuren in badges vervangen door `lab-*` tokens | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
