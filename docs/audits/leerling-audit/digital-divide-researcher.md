# Audit — Digital Divide Researcher (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `digital-divide-researcher` |
| **Titel** | Digital Divide Researcher |
| **Leerjaar & Periode** | Leerjaar 3, Periode 3 (J3P3) |
| **Template-engine** | DataViewer (geen chat) |
| **SLO-kerndoelen** | 23C (Maatschappij), 21B (Media & Informatie) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig — "Onderzoek de digitale kloof"
- [x] `introDescription` is concreet en empathisch — geeft direct context over wie geraakt wordt
- [x] `introFeatures` beschrijft drie concrete activiteiten
- [x] Emoji (🌍) past bij het maatschappelijke thema
- [x] Drie datasets geven direct richting

**Bronbestanden:** `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De intro is empathisch van toon ("Ouderen zonder smartphone, gezinnen zonder stabiel internet") en geeft meteen context over wie de digitale kloof raakt. De drie activiteiten zijn concreet en oplopend in complexiteit.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [ ] Kleuren via lab-* tokens — hardcoded hex in chartData en badges (`#F59E0B`, `#3B82F6`, etc.)
- [x] DataViewer-template geeft duidelijke tabel- en grafiek-layout
- [x] Staafgrafiek heeft kleur-labels per land — duidelijk onderscheid
- [x] Document-cards zijn goed leesbaar
- [x] Tabel is sorteerbaar — interactief element

**Bronbestanden:** `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts:84-91`

**Score:** 3 / 5

**Opmerkingen:**
> De DataViewer-template geeft een duidelijke structuur. Echter: de staafgrafiek gebruikt uitsluitend kleur om landen te onderscheiden (geen labels naast de balken bij hover-only interactie). Dit is een toegankelijkheidsrisico voor kleurenblinden. De hardcoded hex-kleuren zijn een code-kwaliteitsissue. Grafiek-toegankelijkheid is een aandachtspunt voor de DataViewer-template in het algemeen.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Nederland-data → Europa-vergelijking → Beleidsmaatregelen evalueren
- [x] Tabel → Staafgrafiek → Document-cards: oplopende complexiteit van datatype
- [x] Moeilijkheid past bij J3 havo/vwo
- [x] Vragen gaan van gesloten (multiple-choice, getal) naar open (text-observation)
- [x] Elke dataset heeft een duidelijke introductie

**Bronbestanden:** `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts:16-226`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De drie datasets zijn zorgvuldig geordend: eerst analyse van Nederlandse data (concreet, dichtbij), dan Europees vergelijkend (abstracter), dan beleidsevaluatie (toepassen). De vragen zijn gevarieerd: multiple-choice, getal-invoer, en open observaties. De open vragen (text-observation) bevatten uitgebreide modelantwoorden die de docent kan gebruiken als rubric.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] CBS-data 2024 is correct nagelabeld
- [x] 75+ groep heeft laagste internetgebruik (58%) én laagste basisvaardigheden (32%) — plausibel met CBS-cijfers
- [x] DigiSterker-programma bestaat en is correct omschreven
- [x] KPN/T-Mobile "Kans op internet" bestaat en is correct omschreven
- [x] Breedband-percentages per land zijn representatief voor 2024
- [x] Geen spelfouten gevonden
- [x] Explanations zijn uitgebreid en inhoudelijk correct

**Bronbestanden:** `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk en actueel. De data is gelabeld als CBS 2024 en plausibel. De beleidsmaatregelen zijn herkenbaar uit de Nederlandse praktijk. De uitleg bij het EU-gemiddelde (584÷7=83,4%) is correct. De toelichting bij de open vragen is rijk en bruikbaar als modelantwoord voor docenten.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [ ] Geen AI-chat in deze missie — DataViewer-template zonder `enableChat`
- [x] Toelichting bij vragen fungeert als "coach" — de explanations zijn uitgebreid
- [x] Text-observation vragen bevatten modelantwoorden
- [ ] Geen EERSTE BERICHT, STEP_COMPLETE, of Scope Guard mogelijk
- [x] Systeminstruction in agent aanwezig (voor eventuele chat-integratie later)

**Bronbestanden:** `config/templateRegistry.ts:76` (`digital-divide-researcher` zonder `enableChat`)

**Score:** 3 / 5

**Opmerkingen:**
> Deze missie heeft geen AI-chat, wat een bewuste keuze lijkt voor de DataViewer-template. De explanations bij elke vraag fungeren als vervanging voor AI-coaching en zijn uitgebreid (gemiddeld 60-80 woorden per antwoord). De systemInstruction in het agent-bestand is aanwezig maar wordt niet actief gebruikt zonder chat. Het ontbreken van personalisatie is een structureel nadeel ten opzichte van chat-missies.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Multiple-choice vragen zijn interactief
- [x] Getal-invoer vragen vereisen actief rekenwerk
- [x] Sorteerbare tabel is een nuttige interactie
- [x] Open vragen (text-observation) stimuleren eigen redenering
- [ ] Geen gepersonaliseerde feedback op open antwoorden — explanation is statisch
- [x] Staafgrafiek geeft visuele datarepresentatie

**Score:** 4 / 5

**Opmerkingen:**
> Goede interactiviteit voor een DataViewer-missie. De combinatie van tabel, grafiek en document-cards biedt variatie. De open vragen zijn het sterkst didactisch — ze stimuleren echte redenering. Nadeel: de feedback op open antwoorden is statisch (dezelfde modelantwoord voor iedereen). Een AI-coach zou hier meerwaarde bieden.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig — "Digital Inclusie Expert!" (≥85%), "Onderzoeker Digitale Kloof" (≥65%), "Data Analist" (≥40%), "Aan de slag!" (≥0%)
- [x] maxScore: 100 met puntenverdelingen per vraag
- [x] `takeaways[]` aanwezig — 5 concrete lessen
- [x] Scoredrempels zijn realistisch (≥85% voor expert)
- [x] Badgenamen zijn thematisch passend

**Bronbestanden:** `components/missions/templates/data-viewer/configs/digital-divide-researcher.ts:192-225`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke afronding. De puntenverdelingen per vraag zijn logisch (15 punten voor rekenkundige vragen, 10 punten voor open observaties). De takeaways vatten de kernlessen adequaat samen. De badge "Digital Inclusie Expert!" is aspirationeel maar realistisch bij 85%.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 23C (Maatschappij) aanwezig — digitale kloof als maatschappelijk probleem, beleidsaanbevelingen
- [x] 21B (Media & Informatie) aanwezig — data analyseren, bronnen beoordelen, conclusies trekken
- [x] Mapping correct — `['23C', '21B']` in slo-kerndoelen-mapping.ts
- [x] Leerdoel is toetsbaar — leerling beantwoordt concrete vragen met beoordelingscriteria

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:177`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke SLO-aansluiting. 23C wordt ingevuld via beleidsmaatregelen evalueren en aanbevelingen formuleren. 21B wordt ingevuld via data analyseren (tabel lezen, grafiek interpreteren, bronnen beoordelen). Beide kerndoelen zijn aantoonbaar aanwezig.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo
- [ ] Informatie in staafgrafiek deels via kleur — landen onderscheiden door kleur, geen expliciete labels in balken
- [x] Tabel-data is tekstueel leesbaar
- [x] Document-cards zijn tekstueel
- [ ] Kleurcontrast in grafiek niet geverifieerd

**Score:** 3 / 5

**Opmerkingen:**
> De tabel en document-cards zijn goed toegankelijk. Maar de staafgrafiek gebruikt kleur als primaire discriminator voor landen — dit is problematisch voor kleurenblinden (circa 8% van de mannelijke bevolking). De grafiek moet labels direct op of naast de balken tonen, niet alleen in de legenda. Dit is een structureel issue van de DataViewer-template, niet alleen van deze missie.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Empathische intro, duidelijke activiteiten |
| 2. Visueel | 3 | ×1 = 3 | Hardcoded hex, grafiek-onderscheiding via kleur |
| 3. Didactische flow | 5 | ×2 = 10 | Oplopende complexiteit, uitstekende opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | CBS-data, DigiSterker correct, geen fouten |
| 5. AI-coach kwaliteit | 3 | ×1 = 3 | Geen chat, explanations als vervanger |
| 6. Interactiviteit | 4 | ×1 = 4 | Goed, statische feedback op open vragen |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges, takeaways, scoring aanwezig |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 23C + 21B beide aanwezig |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Grafiek-kleuronderscheiding problematisch |
| **TOTAAL** | | **48 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (5×2) + (5×2) + (3×1) + (4×1) + (5×1) + (5×1) + (3×1) = 48
Percentage = (48 / 55) × 100% = 87,3%
```

### Verdict

**✅ Klaar** (87,3% — boven de 80% drempel)

> Inhoudelijk en didactisch sterke missie met authentieke CBS-data en een oplopende complexiteitsstructuur. Twee aandachtspunten die vóór brede uitrol opgelost moeten worden: (1) grafiek-toegankelijkheid (kleuronderscheiding), en (2) het ontbreken van AI-chat beperkt gepersonaliseerde feedback. Beide zijn structurele template-issues, niet missie-specifiek.

---

### Actielijst

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 9. Toegankelijkheid | Staafgrafiek: labels direct op/naast balken toevoegen naast kleur-legenda (DataViewer-template fix) | Medium |
| 2 | 2. Visueel | Hardcoded hex-kleuren vervangen door `lab-*` tokens in chartData en badges | Laag |

#### Nice-to-haves

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 5. AI-coach kwaliteit | Chat toevoegen (enableChat) om open antwoorden te begeleiden — vergroot leerdepth |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
