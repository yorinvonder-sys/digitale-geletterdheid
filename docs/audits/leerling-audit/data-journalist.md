# Audit — Data Journalist (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `data-journalist` |
| **Titel** | Data Journalist |
| **Leerjaar & Periode** | Leerjaar 2, Periode 1 |
| **Template-engine** | DataViewer (3 datasets: tabel, staafgrafiek, document-cards) |
| **SLO-kerndoelen** | 21C, 22A |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` "Word een data-journalist" is motiverend en uitnodigend
- [x] `introDescription` beschrijft de inhoud concreet (social media data, schermtijd, nieuwsberichten)
- [x] `introFeatures` bevat 3 concrete leeractiviteiten
- [x] Moeilijkheidsgraad "Medium" past bij het analyseren van datasets (J2, beginperiode)
- [x] Emerald-groene kleur en BarChart2-icoon zijn passend voor data-journalistiek

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts:1-14`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende eerste indruk. De framing als "nieuwste datajournalist" is motiverend voor 13-14 jarigen. De drie introFeatures beschrijven exact wat de leerling gaat doen. De koppeling aan social media gebruik (een herkenbaar onderwerp) maakt het direct relevant.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent?

**Checkpunten:**
- [x] Emerald-groene kleur is consistent door de hele missie
- [x] Drie dataset-types (tabel, staafgrafiek, document-cards) bieden visuele variatie
- [x] Kleurcodering van de staafgrafiek (per land een andere kleur) is duidelijk
- [ ] Staafgrafiek-kleuren zijn hardcoded hex (`#D97757`, `#F59E0B`, etc.) — zou `lab-*` tokens moeten zijn
- [x] Visieele preview is een eenvoudige gradient met icoon — geen complexe preview die kan breken

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts:86-93`

**Score:** 4 / 5

**Opmerkingen:**
> Visueel coherent. De drie dataset-types zorgen voor afwisseling en maken de missie visueel interessant. De chart-kleuren zijn hardcoded, wat een styling-inconsistentie is.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen datasets op elkaar voort?

**Checkpunten:**
- [x] Logische opbouw: tabel (patronen herkennen) → staafgrafiek (internationaal vergelijk) → document-cards (bronkritiek)
- [x] Elke dataset bouwt voort: eerst leren welke patronen er zijn, dan vergelijken, dan bronkritiek
- [x] Vragen per dataset variëren in type (multiple-choice, number-input, text-observation)
- [x] STEP_COMPLETE markers aanwezig in de agent-systemInstruction (1/3, 2/3, 3/3)
- [x] De moeilijkheidsgraad stijgt: rekenvraag (dataset 2) is uitdagender dan observatievraag (dataset 1)
- [x] EERSTE BERICHT aanwezig in de systemInstruction

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts`, `config/agents/year2.tsx:27-88`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische flow. De drie datasets zijn thematisch verbonden (social media en jongeren) en bouwen op elkaar voort. De variatie in vraagtypen (multiple-choice, rekenen, open observatie) biedt differentiatie. Dataset 3 (nieuwsberichten) introduceert bronkritiek — een hogere vaardigheid die past als afsluiting.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle data en instructies inhoudelijk?

**Checkpunten:**
- [x] Dataset 1: rekenvraag over gemiddelde schermtijd (14-jarigen) — het juiste antwoord is 2.5, maar de config zegt 2.6. MISMATCH: (4.0+2.0+1.5+1.0+3.0+3.5+2.5)/7 = 17.5/7 = 2.5, niet 2.6
- [x] Dataset 2: VS (7.7 uur) als hoogste schermtijd is plausibel maar het "Universiteit van Utrecht 2024" is fictief
- [x] Dataset 3: NOS/RIVM/Volkskrant/schoolkrant als bronnenhiërarchie is correct en leerzaam
- [x] De uitleg bij "conflict of interest" (Instagram-onderzoek) is correct en waardevol
- [x] Taalgebruik op B1-niveau, correct voor 13-14 jaar

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts:56-66`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk sterk, maar er is een rekenkundige fout: de vraag over het gemiddelde voor 14-jarigen (q2) heeft `correctAnswer: 2.6` terwijl het juiste antwoord 2.5 is: (4.0+2.0+1.5+1.0+3.0+3.5+2.5)/7 = 17.5/7 = 2.5. Dit is een inhoudelijke fout die leerlingen misleidt. Verder: de bron "Universiteit van Utrecht 2024" voor de internationale schermtijdstudie is fictief — dit is acceptabel voor een educatieve context maar zou vermeld moeten worden.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim >1500 tekens
- [x] EERSTE BERICHT aanwezig en enthousiast: "Welkom bij de redactie van DataNieuws!"
- [x] STEP_COMPLETE markers aanwezig: stap 1 (2 observaties), stap 2 (patroon + uitleg), stap 3 (infographic-ontwerp)
- [x] SCOPE GUARD aanwezig — leerlingen worden teruggeleid bij afdwaling
- [x] Anti-farmingbescherming via SYSTEM_INSTRUCTION_SUFFIX
- [x] Pedagogische principes expliciet: nooit de analyse cadeau doen, stel vragen

**Bronbestanden:** `config/agents/year2.tsx:27-88`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende systemInstruction. EERSTE BERICHT, STEP_COMPLETE markers (3/3) en SCOPE GUARD zijn alle aanwezig. De pedagogische aanpak is expliciet uitgewerkt met vier concrete principes. Dit is de best gestructureerde agent in J2P1.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep?

**Checkpunten:**
- [x] Drie dataset-types geven visuele en functionele variatie
- [x] Sorteer- en filterfunctie in de tabel zijn interactieve leerinstrumenten
- [x] Drie vraagtypen (multiple-choice, number-input, text-observation) bieden differentiatie
- [x] Onderwerp (social media van leerlingen zelf) is intrinsiek motiverend voor de doelgroep
- [x] Uitleg bij elke vraag leert de leerling van fouten en correcte antwoorden

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende interactiviteit. Het social media-thema is direct relevant voor 13-14 jarigen — ze zijn zelf de onderzoeksgroep. De dataviewer-interactie (sorteren, filteren, grafieken bekijken) is authentiek: zo werken echte datajournalisten ook. De drie vraagtypen zorgen voor cognitieve variatie.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Zijn badges en scores logisch?

**Checkpunten:**
- [x] `maxScore: 100` gedefinieerd
- [x] 4 badges gedefinieerd: Datajournalist in spe! (85+), Scherpe analist (65+), Op onderzoek uit (40+), Aan de slag! (0+)
- [x] `takeaways[]` bevat 5 concrete leerpunten
- [x] Punten per vraag zijn transparant in de config (15, 20, 10, etc.)
- [x] De totaalpunten per dataset (25+25+15 = 65) zijn minder dan 100 — betekent dat niet alle punten haalbaar zijn via de DataViewer en de rest via de AI-coach wordt gescoord

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts:192-227`

**Score:** 4 / 5

**Opmerkingen:**
> Goede afronding. De badges zijn goed gekozen en motiverend. De takeaways zijn concreet. Aandachtspunt: de totaalpunten in de config (15+20+10+10+15+10+15+5 = 100) kloppen wel op, maar het is onduidelijk hoe punten worden verdeeld over DataViewer-vragen en AI-coach-voortgang.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt?

**Checkpunten:**
- [x] SLO 21C (Data en dataverwerking) sluit aan — leerling analyseert datasets, herkent patronen
- [x] SLO 22A (Digitale producten) sluit aan — infographic-ontwerp als eindproduct
- [x] slo-kerndoelen-mapping.ts: `data-journalist` → `['21C', '22A']` — correct
- [x] Periode 1 J2 context klopt: datajournalistiek is een uitstekende openingsmissie voor "Data & Informatie"

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:96`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende SLO-aansluiting. De missie leert leerlingen daadwerkelijk data analyseren (21C) en communiceren via een infographic (22A). De koppeling van data-analyse aan storytelling (infographic) maakt de SLO-leeruitkomst concreet toetsbaar.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau op B1-niveau — correct voor 13-14 jaar
- [x] Tabel is sorteer- en filterbaar, wat cognitieve verwerking vergemakkelijkt
- [ ] Rekenvraag (gemiddelde berekenen) kan uitdagend zijn voor leerlingen met rekenproblemen — en bevat een fout (zie D4)
- [x] Text-observation vragen zijn open maar hebben gedetailleerde uitleg als feedback
- [x] Geen informatie uitsluitend via kleur overgebracht

**Bronbestanden:** `components/missions/templates/data-viewer/configs/data-journalist.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Goede toegankelijkheid. De sorteer- en filterfunctie helpt leerlingen die moeite hebben met het overzien van alle data. De text-observation vragen zijn inclusief (er is geen enkel correct antwoord). De rekenkundige fout in de number-input vraag (zie D4) schaadt de toegankelijkheid voor leerlingen die hun berekening vertrouwen.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Motiverend, herkenbaar thema |
| 2. Visueel | 4 | ×1 = 4 | Hardcoded chart-kleuren |
| 3. Didactische flow | 5 | ×2 = 10 | Uitstekende opbouw, 3 dataset-types |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Rekenfout in q2 (2.5 niet 2.6) |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | EERSTE BERICHT + STEP_COMPLETE + SCOPE GUARD |
| 6. Interactiviteit | 5 | ×1 = 5 | Uitstekend, intrinsiek motiverend thema |
| 7. Afronding & feedback | 4 | ×1 = 4 | Goede badges en takeaways |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 21C + 22A correct |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Rekenfout schaadt vertrouwen |
| **TOTAAL** | | **46 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (4×2) + (5×1) + (5×1) + (4×1) + (5×1) + (4×1) = 46
Percentage = (46 / 55) × 100% = 83,6%
```

### Verdict

**✅ Klaar voor inzet** (83,6% — boven de 80% drempel, mits rekenfout gecorrigeerd)

> Sterke missie met uitstekende didactische opbouw en AI-coach. De rekenfout in dataset 1 (gemiddelde 14-jarigen: 2.5, niet 2.6) moet gecorrigeerd worden vóór inzet om het vertrouwen van leerlingen niet te beschadigen.

---

### Actielijst

#### Blokkerende issues (oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 4. Inhoud | Rekenfout in q2: `correctAnswer: 2.6` moet `2.5` zijn (17.5 ÷ 7 = 2.5). En ook de uitleg bevat al het juiste getal "2.5 uur" maar de `correctAnswer` is fout. | Product |

#### Verbeterpunten (score 4 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 2. Visueel | Hardcoded chart-kleuren vervangen door `lab-*` tokens | Laag |
| 2 | 4. Inhoud | Bron "Universiteit van Utrecht 2024" als fictief markeren of een echte bron gebruiken | Laag |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
