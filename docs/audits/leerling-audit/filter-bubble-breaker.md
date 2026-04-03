# Audit — Filter Bubble Breaker (Leerlingperspectief)

---

### Metadata

| Veld | Waarde |
|------|--------|
| **Missie ID** | `filter-bubble-breaker` |
| **Titel** | Filter Bubble Breaker |
| **Leerjaar & Periode** | Leerjaar 1, Periode 3 |
| **Template-engine** | Standalone (AI-chat coach) |
| **SLO-kerndoelen** | 21B (mediawijsheid), 23C (maatschappij) |
| **Auditdatum** | 2026-04-03 |
| **Auditor** | Claude (geautomatiseerd) |

---

### Dimensie 1 — Eerste indruk

**Vraag:** Is het intro-scherm duidelijk en uitnodigend? Weet je als leerling meteen wat je moet doen?

**Checkpunten:**
- [x] `introTitle` aanwezig en begrijpelijk — "Filter Bubble Breaker" is direct
- [x] `introDescription` geeft concrete opdracht — "Vergelijk twee feeds, doe een quiz, leer 3 tips"
- [x] Visueel element past bij het thema — twee feeds (SAM vs. LINA) naast elkaar met "ALGORITME ACTIEF" banner
- [x] Moeilijkheidsgraad voelbaar — "Medium" klopt

**Bronbestanden:** `config/agents/year1.tsx:2654-2686`

**Score:** 5 / 5

**Opmerkingen:**
> De split-screen feed visual (SAM: ⚽🎮💪 vs. LINA: 🎨📚🌱) communiceert het concept van filterbubbels direct en visueel. Het "ALGORITME ACTIEF" label geeft onmiddellijk context. De problemScenario ("Zie jij hetzelfde als je klasgenoot op TikTok?") is een directe, herkenbare vraag.

---

### Dimensie 2 — Visueel

**Vraag:** Klopt de lay-out? Zijn de kleuren consistent (lab-* tokens)? Is de tekst goed leesbaar? Werkt het op mobiel?

**Checkpunten:**
- [x] Kleuren consistent — indigo/paars gradient past bij algoritmethema
- [x] Split-screen preview is leesbaar
- [ ] Kleur via `lab-*` tokens — `color: '#D97757'` is hardcoded hex
- [ ] Split-screen op mobiel (375px) kan krap zijn — twee kolommen naast elkaar

**Bronbestanden:** `config/agents/year1.tsx:2659` (hardcoded hex)

**Score:** 3 / 5

**Opmerkingen:**
> Het split-screen visual werkt op desktop maar kan op mobiele schermen (375px) problemen geven met twee kolommen naast elkaar. De tekst in de preview-vakken is ook erg klein (text-[8px]). Dit verdient een mobiele test.

---

### Dimensie 3 — Didactische flow _(telt dubbel)_

**Vraag:** Is de scaffolding helder? Bouwen stappen op elkaar voort? Past de moeilijkheidsgraad bij het leerjaar?

**Checkpunten:**
- [x] Logische opbouw — Feed vergelijking → Quiz over algoritmes → Tips om bubbel te breken
- [x] Elke stap bouwt voort — je begrijpt het probleem (feeds vergelijken) voordat je de theorie leert (quiz)
- [x] Moeilijkheid past bij leerjaar — quiz met 5 vragen is behapbaar voor J1
- [ ] Drie stappen zijn relatief snel — geen echte diepgang per stap

**Bronbestanden:** `config/agents/year1.tsx:2688-2745`

**Score:** 4 / 5

**Opmerkingen:**
> De driestappe opbouw is logisch maar compact. De quiz (5 vragen) is functioneel maar biedt weinig ruimte voor verdieping. De drie tips aan het einde zijn bruikbaar maar summier. De missie is goed als kennismaking met filterbubbels maar minder diep dan bijv. de AI Spiegel-missie die hetzelfde onderwerp vanuit de SimulationLab aanpakt.

---

### Dimensie 4 — Inhoudelijke correctheid _(telt dubbel)_

**Vraag:** Kloppen alle instructies en uitleg inhoudelijk? Zijn er taal- of spelfouten? Is het Nederlands begrijpelijk voor 12-18-jarigen?

**Checkpunten:**
- [x] Filterbubbel-definitie correct — "algoritme dat content kiest op basis van je gedrag"
- [x] TikTok-gedragsbeschrijving correct — "kijktijd, likes en herhaling"
- [x] Voordelen én nadelen besproken — evenwichtige aanpak
- [x] Tips zijn praktisch en correct — incognito, andere accounts volgen, bewust kijken
- [ ] Quiz-antwoorden liggen voor de hand (B is bijna altijd het antwoord in de systemInstruction) — te weinig distractors

**Bronbestanden:** `config/agents/year1.tsx:2707-2713`

**Score:** 4 / 5

**Opmerkingen:**
> Inhoudelijk correct. De drie tips zijn praktisch: andere accounts volgen, incognito zoeken (DuckDuckGo), en bewust kijken naar andere content. Punt: de quiz in de systemInstruction heeft vijf vragen waarbij het correcte antwoord steeds "B" is — dit is een pedagogisch zwakte die leerlingen snel kunnen doorzien.

---

### Dimensie 5 — AI-coach kwaliteit

**Vraag:** Maakt de systemInstruction een goede mentor? Is er hint-progressie? Past de toon bij de doelgroep?

**Checkpunten:**
- [x] `systemInstruction` is aanwezig — ~800 tekens
- [x] EERSTE BERICHT is aanwezig — "Hey! Ik ben je Bubbel Breker Coach. 🫧"
- [ ] STEP_COMPLETE markers — **ONTBREEKT** (0/3)
- [ ] Verificatiedrempel voor elke stap — quiz-antwoorden zijn niet gevalideerd met expliciete drempel
- [x] Toon past bij de rolnaam — "Bubbel Breker Coach" is luchtig en passend
- [x] Farming-detectie actief via SYSTEM_INSTRUCTION_SUFFIX

**Bronbestanden:** `config/agents/year1.tsx:2688-2729`

**Score:** 2 / 5

**Opmerkingen:**
> De systemInstruction is relatief kort en mist essentiële structuur. Er zijn geen STEP_COMPLETE markers, de quiz-antwoorden zijn hardcoded in de instructie met een patroon (steeds optie B), en er is geen `goalCriteria` of `primaryGoal` gedefinieerd in de agent-config. De coach kan de voortgang niet tracken. Dit is een significante structurele zwakte.

---

### Dimensie 6 — Interactiviteit

**Vraag:** Werkt het interactieve element? Is het boeiend voor de doelgroep? Past de interactievorm bij het leerdoel?

**Checkpunten:**
- [x] Feed-vergelijking is visueel en direct begrijpelijk
- [x] Quiz-format is herkenbaar en snel
- [ ] Chat-interface is het enige interactiekanaal — weinig variatie
- [ ] De quiz is via tekst, geen klikbare opties — minder interactief dan ScenarioEngine

**Bronbestanden:** `config/agents/year1.tsx:2697-2718`

**Score:** 3 / 5

**Opmerkingen:**
> De interactiviteit is beperkt vergeleken met template-gebaseerde missies. De feed-vergelijking via [FEED]-tags is didactisch sterk maar de quiz is puur tekst. De chat-interface mist de visuele rijkheid van een ScenarioEngine of SimulationLab. De missie had sterker kunnen zijn als template (vergelijk met de SimulationLab-implementatie van hetzelfde filterbubbel-thema in De AI Spiegel).

---

### Dimensie 7 — Afronding & feedback

**Vraag:** Is het duidelijk wanneer de missie klaar is? Is de feedback betekenisvol? Zijn badges en scores logisch?

**Checkpunten:**
- [ ] Completion-criteria — **geen `goalCriteria` aanwezig** in agent-config
- [ ] Badges — **geen badges gedefinieerd**
- [ ] Scoring — **geen scoring**
- [ ] Takeaways — **geen takeaways gedefinieerd**
- [x] Afsluiting in systemInstruction aanwezig — badge "Bubbel Breker" en score (0-1, 2-3, 4-5)

**Bronbestanden:** `config/agents/year1.tsx:2654-2747` (geen goalCriteria, geen badges)

**Score:** 1 / 5

**Opmerkingen:**
> De afsluiting is alleen informeel in de systemInstruction beschreven (badge "Bubbel Breker" bij 4-5 goede antwoorden) maar niet formeel geïmplementeerd in de agent-config. Er is geen `goalCriteria`, geen `badges[]`, geen `takeaways[]`. Leerlingen ontvangen geen formele afsluiting. Dit is een blokkerende issue.

---

### Dimensie 8 — SLO-aansluiting

**Vraag:** Leert de leerling daadwerkelijk wat de missie claimt te leren? Is de kerndoel-mapping consistent?

**Checkpunten:**
- [x] Inhoud matcht geclaimde kerndoelen — 21B (mediawijsheid/kritisch omgaan met media) en 23C (maatschappelijke effecten)
- [x] Mapping is intern consistent
- [ ] Leerdoel is beperkt toetsbaar — quiz is via tekst zonder formele scoring

**Bronbestanden:** `config/slo-kerndoelen-mapping.ts` (week 3, 21B + 23C)

**Score:** 3 / 5

**Opmerkingen:**
> De SLO-aansluiting is inhoudelijk goed: 21B (mediawijsheid) via het begrijpen van hoe algoritmes content selecteren, 23C via de maatschappelijke gevolgen (democratie). De feitelijke leeractiviteit is echter beperkt — de quiz is kort en de verdieping is minimaal.

---

### Dimensie 9 — Toegankelijkheid

**Vraag:** Is het leesniveau passend? Wordt informatie niet alleen via kleur overgebracht? Zijn focus states aanwezig?

**Checkpunten:**
- [x] Leesniveau past bij het leerjaar — begrijpelijk voor J1
- [x] Feed-labels zijn tekstueel niet uitsluitend kleurgebaseerd
- [ ] Split-screen preview kan op mobiel slecht leesbaar zijn
- [x] Chat-interface is laagdrempelig

**Bronbestanden:** `config/agents/year1.tsx:2666-2686`

**Score:** 3 / 5

**Opmerkingen:**
> Leesniveau is goed. De split-screen preview heeft kleine tekst (text-[8px]) die op mobiele schermen lastig leesbaar kan zijn. De chat-interface zelf is toegankelijk.

---

### Scoretabel

| Dimensie | Score (1-5) | Gewogen | Opmerkingen |
|---|---|---|---|
| 1. Eerste indruk | 5 | ×1 = 5 | Split-feed visual sterk |
| 2. Visueel | 3 | ×1 = 3 | Split-screen mobiel risico |
| 3. Didactische flow | 4 | ×2 = 8 | Logisch maar compact |
| 4. Inhoudelijke correctheid | 4 | ×2 = 8 | Correct, quiz-B-patroon zwak |
| 5. AI-coach kwaliteit | 2 | ×1 = 2 | Geen STEP_COMPLETE, geen goalCriteria |
| 6. Interactiviteit | 3 | ×1 = 3 | Chat-only, quiz tekst-gebaseerd |
| 7. Afronding & feedback | 1 | ×1 = 1 | Geen formele afsluiting |
| 8. SLO-aansluiting | 3 | ×1 = 3 | Inhoudelijk goed, beperkt toetsbaar |
| 9. Toegankelijkheid | 3 | ×1 = 3 | Goed niveau, kleine tekst in preview |
| **TOTAAL** | | **36 / 55** | |

### Gewogen totaal

```
(5×1) + (3×1) + (4×2) + (4×2) + (2×1) + (3×1) + (1×1) + (3×1) + (3×1) = 36
Percentage = (36 / 55) × 100% = 65,5%
```

### Verdict

**⚠️ Needs work** (65,5% — boven de 60% drempel, maar met blokkerende issues)

> Filter Bubble Breaker heeft een sterke eerste indruk en correct inhoud, maar mist essentiële structuurelementen: geen formele afsluiting, geen badges, geen STEP_COMPLETE, en geen goalCriteria. Twee gerichte verbeteringen (formele afsluiting + STEP_COMPLETE) zouden de score significant verhogen. Vergelijk met De AI Spiegel die hetzelfde filterbubbel-onderwerp via SimulationLab uitwerkt — die scoort 85%.

---

### Actielijst

#### Blokkerende issues (score 1-2 — oplossen vóór inzet)

| # | Dimensie | Beschrijving | Verantwoordelijk |
|---|----------|--------------|-----------------|
| 1 | 7. Afronding & feedback | Geen formele afsluiting: geen `goalCriteria`, geen badges, geen takeaways. Leerling weet niet wanneer klaar. | Product |
| 2 | 5. AI-coach kwaliteit | Geen STEP_COMPLETE markers (0/3) en geen `goalCriteria` in agent-config. | Product |

#### Verbeterpunten (score 3 — oplossen vóór pilot)

| # | Dimensie | Beschrijving | Prioriteit |
|---|----------|--------------|-----------|
| 1 | 6. Interactiviteit | Migreren naar ScenarioEngine of SimulationLab voor rijkere interactie (vergelijk met AI Spiegel). | Hoog |
| 2 | 4. Inhoudelijke correctheid | Quiz-antwoordpatroon (steeds optie B) doorbreken — andere posities voor correcte antwoorden. | Medium |
| 3 | 2. Visueel | Mobiele split-screen preview testen op 375px. | Medium |

#### Nice-to-haves (score 4 — optioneel, verbetert kwaliteit)

| # | Dimensie | Beschrijving |
|---|----------|--------------|
| 1 | 3. Didactische flow | Extra verdiepingsronde toevoegen met echte feed-vergelijking via screenshot-analyse. |
| 2 | 2. Visueel | Hardcoded hex `#D97757` vervangen door `lab-*` token. |

---

_Audit uitgevoerd op basis van template v1.0 — `docs/audits/audit-plan-template-leerling.md`_
