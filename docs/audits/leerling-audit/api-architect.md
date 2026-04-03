# Audit — API Architect (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `api-architect` |
| **Titel** | API Architect |
| **Leerjaar & Periode** | Leerjaar 3, Periode 1 |
| **Template-engine** | BuilderCanvas (enableChat: true) |
| **SLO-kerndoelen** | 22A (Digitale producten), 22B (Programmeren), 21A (Digitale systemen) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Ontwerp een professionele REST API" is concreet
- [x] `introDescription` geeft een heldere opdracht — huiswerkplanner-startup als context is herkenbaar
- [x] Emoji 🔌 past bij het API/verbinding-thema
- [x] Moeilijkheidsgraad "Hard" is correct voor J3 havo/vwo
- [x] `introFeatures` (4 bullets) maken het leerpad duidelijk: REST begrijpen, endpoints ontwerpen, documenteren, beveiligen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts:3-18`

**Score:** 5 / 5

**Opmerkingen:**
> Sterke eerste indruk. Het huiswerkplanner-scenario is herkenbaar voor leerlingen en verlaagt de drempel. De vier features geven een volledig beeld van de leerroute.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] BuilderCanvas is een bewezen template met een vaste responsive lay-out
- [x] `previewType: 'text-preview'` — geen grafische elementen met hardcoded kleuren
- [x] Checklist-items per stap zijn visueel overzichtelijk
- [ ] Lange tekst-instructies (step "endpoints-ontwerpen" heeft een uitgebreide instructie) kunnen op mobiel 375px krap worden

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts`

**Score:** 4 / 5

**Opmerkingen:**
> BuilderCanvas-template scoort goed visueel. De text-preview is een eenvoudig en consistent formaat. De instructies zijn gedetailleerd maar goed gestructureerd. Mobiele weergave van de vier stappen met checklijsten is het enige kleine aandachtspunt.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw: Beginselen (stap 1) → Endpoints ontwerpen (stap 2) → Authenticatie (stap 3) → Documentatie (stap 4)
- [x] Elke stap bouwt aantoonbaar voort — je kunt pas endpoints documenteren als je ze hebt ontworpen
- [x] Moeilijkheid past bij leerjaar — J3, conceptueel uitdagend maar geen programmeerkode vereist
- [x] STEP_COMPLETE markers aanwezig (3/3): resources benoemd → 5 endpoints ontworpen → 2 endpoints gedocumenteerd
- [x] Tips per stap ("REST-APIs werken stateless") bieden scaffold zonder het antwoord te geven
- [x] ChecklistItems per stap maken duidelijk wanneer de stap klaar is

**Bronbestanden:** `config/agents/year3.tsx:139-142`, `components/missions/templates/builder-canvas/configs/api-architect.ts:19-97`

**Score:** 5 / 5

**Opmerkingen:**
> Uitstekende didactische opbouw. De vier stappen volgen de professionele API-ontwikkelflow stap voor stap. De checklistItems per stap geven de leerling concrete done-criteria. De tip "gebruik altijd meervoud voor resource-namen" is precies het soort professionele kennis dat J3 leerlingen onderscheidt van beginners.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] REST-principes correct beschreven — stateless, resource-namen, HTTP-methodes
- [x] HTTP-statuscodes correct — succes én fout worden gevraagd
- [x] JWT-authenticatie correct uitgelegd — "het token bevat versleuteld wie je bent en wanneer het verloopt"
- [x] Restaurant-analogie (klant/keuken/ober) is didactisch correct en beeldend
- [x] Documentatie in het Engels gevraagd — professioneel en correct gebruik
- [x] Geen aantoonbare spelfouten

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts`

**Score:** 5 / 5

**Opmerkingen:**
> Inhoudelijk sterk. De JWT-toelichting is nauwkeurig zonder technisch te worden. De keuze om documentatie in het Engels te laten schrijven is professioneel en leert leerlingen de internationale standaard.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is minimaal 500 tekens — ruim voldoende
- [x] EERSTE BERICHT aanwezig — "Welkom, API Architect! De huiswerkplanner-startup heeft jou ingehuurd."
- [x] STEP_COMPLETE markers aanwezig voor alle drie stappen (3/3)
- [x] Toon past bij de rolnaam — "ervaren Backend Developer" is professioneel maar toegankelijk
- [x] Chat is ingeschakeld (`enableChat: true`) — leerling heeft live toegang tot AI-coach
- [x] Scope guard aanwezig — geen echte implementatie vereist

**Bronbestanden:** `config/agents/year3.tsx:115-175`

**Score:** 5 / 5

**Opmerkingen:**
> De AI-coach is volledig geconfigureerd. De combinatie van BuilderCanvas (structuur) + chat (begeleiding) is de sterkste missievorm in het platform — leerlingen kunnen zelfstandig werken maar hebben altijd toegang tot de coach.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] BuilderCanvas met teksteditor + checklijst is geschikt voor ontwerp-taken
- [x] Chat-integratie maakt de missie dynamisch — geen statisch invulformulier
- [x] Vier stappen met elk hun eigen checklistItems geven genoeg structuur voor J3 leerlingen
- [x] `textPrompt` per stap geeft een duidelijk startpunt

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts`

**Score:** 4 / 5

**Opmerkingen:**
> De BuilderCanvas+Chat combinatie is interactief en open. Minpuntje: de missie vraagt veel schrijfwerk (endpoints tabel, authenticatiebeschrijving, documentatie voor 2 endpoints) — dit kan in één sessie te veel zijn voor leerlingen met minder schrijfvaardigheid of concentratieproblemen. Er is geen time-estimate voor de missie.

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [x] Badges aanwezig: 🏆 API Master (≥90), 🔌 Backend Architect (≥70), 📡 Endpoint Builder (≥50), 🌱 Op weg (≥0)
- [x] `maxScore: 100` is helder
- [x] `takeaways[]` aanwezig — 5 kernlessen over REST, endpoints, authenticatie en documentatie
- [x] Badgenames zijn betekenisvol en motiverend
- [x] Checklistcriteria per stap geven tussentijdse done-signalen

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts:83-97`

**Score:** 5 / 5

**Opmerkingen:**
> Volledige afrondingsset. De takeaways zijn concreet en formuleringen als "Je kunt API-documentatie schrijven die andere developers direct kunnen gebruiken" zijn ambitieus maar haalbaar voor J3.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] 22A (Digitale producten): API ontwerpen en documenteren is een digitaal product maken
- [x] 22B (Programmeren): Endpoints met HTTP-methodes, statuscodes, en request/response-structuur zijn programmeerlogica
- [x] 21A (Digitale systemen): REST als architectuurprincipe is systeemkennis
- [x] Mapping is consistent met `slo-kerndoelen-mapping.ts` (week 1, J3)

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts:153`

**Score:** 5 / 5

**Opmerkingen:**
> De drievoudige SLO-koppeling is goed onderbouwd. API-architect raakt expliciet alle drie kerndoelen.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij J3 havo/vwo — professioneel maar uitlegbaar
- [x] Geen kleur als primaire informatiebron — tekst-gebaseerde interface
- [x] Checklist-items zijn tekst-first — geen pictogram-only UI
- [x] BuilderCanvas heeft standard focus states voor buttons en inputs
- [x] Geen afbeeldingen of canvas-elementen die toegankelijkheidsproblemen geven

**Bronbestanden:** `components/missions/templates/builder-canvas/configs/api-architect.ts`

**Score:** 4 / 5

**Opmerkingen:**
> Toegankelijkheid is goed voor dit template-type. De tekstintensieve aard van de missie maakt het inherent toegankelijker dan visuele missies. Kleine onzekerheid over toetsenbord-toegankelijkheid van de BuilderCanvas-editor-component, niet verifieerbaar zonder runtime.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Helder scenario, goede feature-bullets |
| 2. Visueel | 4 | ×1 = 4 | Template solide, mobiel lichte zorg |
| 3. Didactische flow | 5 | ×2 = 10 | Professionele stap-voor-stap opbouw |
| 4. Inhoudelijke correctheid | 5 | ×2 = 10 | JWT, REST, statuscodes allemaal correct |
| 5. AI-coach kwaliteit | 5 | ×1 = 5 | Volledig geconfigureerd met chat |
| 6. Interactiviteit | 4 | ×1 = 4 | Veel schrijfwerk, geen tijdschatting |
| 7. Afronding & feedback | 5 | ×1 = 5 | Badges en takeaways compleet |
| 8. SLO-aansluiting | 5 | ×1 = 5 | 22A+22B+21A aantoonbaar aanwezig |
| 9. Toegankelijkheid | 4 | ×1 = 4 | Tekst-first, kleine toetsenbord-onzekerheid |
| **TOTAAL** | | **53 / 55** | |

### Gewogen totaal

```
(5×1) + (4×1) + (5×2) + (5×2) + (5×1) + (4×1) + (5×1) + (5×1) + (4×1) = 53
Percentage = (53 / 55) × 100% = 96,4%
```

### Verdict

**✅ Klaar** (96,4% — ruim boven de 80% drempel)

> Een van de best geconfigureerde missies in het platform. De BuilderCanvas+Chat combinatie werkt goed voor dit type ontwerp-opdracht. Geen blokkerende issues.

---

### Actielijst

#### Nice-to-haves (score 4 — optioneel)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 6. Interactiviteit | Voeg een tijdschatting toe aan het intro-scherm ("~60-90 min") zodat leerlingen weten wat ze kunnen verwachten |
| 2 | 9. Toegankelijkheid | Verifieer toetsenbord-navigatie in BuilderCanvas editor-component |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
