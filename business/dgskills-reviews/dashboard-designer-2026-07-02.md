# Missie-review: `dashboard-designer` — 2026-07-02

**Template-type:** data-viewer
**Primaire file:** `src/features/missions/templates/data-viewer/configs/dashboard-designer.ts`
**Curriculum-plek:** Leerjaar 2, Week 1
**SLO-claim:** `21C` Data & Dataverwerking, `22A` Digitale producten (regulier) · `18B`, `19A` (VSO)
**Pipeline:** M4 wave-12 batch-review

---

## Screenshots

Geen bestaande screenshots-map voor `dashboard-designer` gevonden. Dynamische visuele verificatie overgeslagen; alle claims hieronder zijn static-only (code-analyse). Grep op `docs/audits/student-missions-ui-ux-review-2026-06-30.md` gaf geen treffers — deze missie zat niet in de live UI/UX-sweep van 30 juni.

---

## 🎨 Design review

**Mission:** dashboard-designer (data-viewer template)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 2 (Layout consistentie):** Volgt exact de gedeelde `data-viewer`-template (drie datasets: table, pie-chart, document-cards). Geen custom layout-afwijkingen t.o.v. de engine-baseline.
- **Criterium 4 (Data-kleuren):** `chartData`-kleuren gebruiken hex (`#ff3c21`, `#202023`, `#e1ff01`) — dit is de bekende engine-brede hex-tokenisatie voor chart-data, geen missie-specifiek issue.
- **Criterium 6 (Framer Motion):** Geen custom animatie-code in de config; alles via de gedeelde template-engine.
- **Criterium 7 (Toegankelijkheid basics):** Geen `dangerouslySetInnerHTML`, geen inline HTML-injectie in card-content of question-teksten. A11y-basis (focus states, aria-labels) zit in de gedeelde `DataViewer.tsx`-engine — bekend engine-niveau, niet missie-specifiek.

### ⚠️ Aandachtspunten

Geen missie-specifieke design-issues gevonden. Alle visuele eigenschappen (kleuren, layout, a11y-primitives) lopen via de gedeelde data-viewer-engine.

### ❌ Blocking issues

Geen.

### Score

3/3 toepasbare criteria geslaagd (overige N.v.t. — template-gedreven) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** dashboard-designer (data-viewer template)
**Curriculum-plek:** Leerjaar 2, Week 1
**SLO-claim:** `21C` Data & Dataverwerking · `22A` Digitale producten · VSO: `18B`, `19A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** `21C` (dataverwerking — leerlingen analyseren schooldata, sorteren kolommen, interpreteren een cirkeldiagram) en `22A` (digitale producten — een dashboard is een ontworpen digitaal product met doelgroep-denken) zijn beide inhoudelijk sterk gefundeerd in de config. VSO-codes `18B`, `19A` zijn valide equivalenten. — `src/config/slo-kerndoelen-mapping.ts:102`
- **Criterium 3 (Leerdoelen helder):** `MISSION_GOAL.primaryGoal` ("Ik kies de juiste visualisatie voor een dataset en selecteer zinvolle KPI's voor een schooldashboard.") is concreet en in eerste persoon. Evidence-field is toetsbaar ("Je kunt uitleggen wanneer je een taartdiagram of staafgrafiek kiest"). — `src/config/missionGoals.ts:726-733`
- **Criterium 4 (Puntensom klopt):** Puntensom van alle 8 vragen (15+15+10+10+15+10+15+10) = **100**, exact gelijk aan `maxScore: 100`. Geen scoring-drift.
- **Criterium 5 (Leeftijds-passend vocabulary):** Taal is toegankelijk voor 13-14-jarigen; vaktermen (KPI, dashboard) worden direct uitgelegd in de dataset-beschrijving en de document-cards. Geen ongeduid jargon.
- **Criterium 6 (Curriculum-plek logisch):** Week 1 Leerjaar 2, naast `data-journalist` (ook data-thema). Logische opbouw: eerst data lezen en verhalen vertellen (Data Journalist), dan data visueel structureren in een dashboard.
- **Criterium 7 (Antwoordmodellen kloppen tegen dataset):** Alle drie de nagerekende antwoorden zijn correct:
  - q1 (2C heeft zowel laagste cijfer 6,4 als laagste aanwezigheid 89%) — geverifieerd, geen andere klas matcht beide minima.
  - q2 (verschil aanwezigheid beste/slechtste = 97−89 = 8) — geverifieerd exact.
  - q4 (Wiskunde grootste aandeel onvoldoendes, 28 van 100 totaal) — geverifieerd, pie-chart-waarden tellen op tot exact 100.
  - q5 en q7 zijn conceptuele definitievragen (cirkeldiagram = verdeling-van-geheel, lijndiagram = trend-in-tijd) — correct en consistent met de document-cards-content.
- **Criterium 9 (Welzijn & inclusiviteit):** Geen gevoelige onderwerpen. Scenario (schoolprestaties, klasvergelijking) is neutraal en didactisch functioneel, niet stigmatiserend — de vraag focust op "aandachtspunt voor de klas", niet op individuele leerlingen.

### ⚠️ Aandachtspunten

- **Criterium 8 (AI-as-copilot / scenario-mismatch chat-rol vs. data-viewer):** De agent-rol in `year2.tsx` heeft **geen `enableChat: true`** in `templateRegistry.ts` (`'dashboard-designer': { missionId: 'dashboard-designer', templateType: 'data-viewer' }` — geen `chatRoleId`). Dit is het bekende platform-brede dormant-chat-patroon: de leerling ziet alleen de data-viewer-config, de systemInstruction/briefing wordt nooit getoond.
  - **Wat:** De systemInstruction beschrijft een compleet ander scenario dan de data-viewer-config: de agent-briefing opent met _"Een lokale sportclub wil weten hoe hun leden trainen"_ (`src/config/agents/year2.tsx:406-408`), terwijl alle drie de daadwerkelijke datasets over **schooldata** gaan (klassen, cijfers, aanwezigheid, vakken). Als deze chat ooit geactiveerd wordt (`enableChat: true` gezet), ontstaat een directe inhoudelijke mismatch tussen wat de AI-coach bespreekt (sportclub-leden) en wat de leerling daadwerkelijk analyseert (schoolklassen).
  - **Waarom:** Dit is dezelfde categorie bevinding als de bekende `data-journalist-les`-mismatch uit de review-instructie: een dormant chat-rol met een scenario dat niet aansluit bij de actieve content. Momenteel geen leerling-impact (chat is dormant), maar een latente inconsistentie die bij toekomstige activatie direct zichtbaar wordt.
  - **Voorstel:** Zie `autoFixable` hieronder — vervang het sportclub-scenario in de systemInstruction (EERSTE BERICHT + stap-examples) door het schooldata-scenario dat al in de data-viewer-config zit, zodat chat-rol en data-viewer-content congruent zijn mocht de rol ooit geactiveerd worden.

### ❌ Blocking issues

Geen. De scenario-mismatch is inactief (dormant chat) en dus niet leerling-zichtbaar — non-blocking maar wel autoFixable voor toekomstbestendigheid.

### Score

7/7 toepasbare criteria geslaagd (1 aandachtspunt, non-blocking) · Aanbeveling: **ship** (autoFix optioneel)

---

## ⚙️ Techniek review

**Mission:** dashboard-designer (data-viewer template)
**Reviewer:** dgskills-techniek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (Config-structuur valide):** `DataViewerConfig`-shape volledig correct: `missionId`, `title`, `introEmoji/Title/Description`, `introFeatures`, `datasets[]`, `maxScore`, `badges[]`, `takeaways[]` allemaal aanwezig en correct getypeerd.
- **Criterium 2 (Scoring-logica correct toegepast):**
  - `text-observation`-vragen (q3, q6, q8) krijgen altijd volle participatiepunten (engine `scoreQuestion()` regel 79: `return q.points`) — dit is het bekende engine-gedrag, correct toegepast in de config (geen misleidend `correctAnswer`-veld anders dan lege string).
  - `number-input` (q2, `correctAnswer: 8`) valt binnen de 5%-tolerantieband van de engine (`Math.abs(correct) * 0.05` = 0,4 rond 8) — voor een heel getal betekent dit in de praktijk dat alleen `8` exact wordt geaccepteerd, wat consistent is met de vraagstelling ("Hoeveel procentpunt verschil").
  - `multiple-choice` matcht case-insensitive/trimmed tegen `correctAnswer` — alle MC-opties (q1, q4, q5, q7) zijn exacte string-matches met de opgegeven `correctAnswer`-waarden.
- **Criterium 3 (Puntensom = maxScore):** 100 = 100, exact (herbevestigd vanuit techniek-perspectief, zie ook didactiek-criterium 4).
- **Criterium 4 (Registratie compleet):** Alle vier verplichte registratiepunten aanwezig en consistent:
  - `templateRegistry.ts:72` → `templateType: 'data-viewer'`
  - `src/config/agents/year2.tsx:345` → agent-rol geregistreerd, `id: 'dashboard-designer'`
  - `src/config/slo-kerndoelen-mapping.ts:102` → SLO-entry met correcte week/yearGroup (week 1, yearGroup 2)
  - `src/config/curriculum.ts:168` → curriculum-plaatsing aanwezig
  - `src/config/missionGoals.ts:726` → MISSION_GOAL entry met threshold 65
- **Criterium 5 (Geen XSS/injectie-risico):** Alle content is statische string-literals in de config — geen user-input-interpolatie, geen `dangerouslySetInnerHTML`. Geen injectie-oppervlak.
- **Criterium 6 (Duck-tokens):** Config bevat geen Tailwind-classes (puur data/content) — n.v.t. voor deze bestandslaag. Badge-kleuren zijn hex (`#202023`, `#e1ff01`) — engine-brede badge-kleurconventie, geen missie-specifieke afwijking.

### ⚠️ Aandachtspunten

Geen missie-specifieke technische issues. Alle bevindingen die opvielen (hex-tokenisatie, dormant chat) zijn expliciet bekende engine-/platform-brede patronen, niet missie-specifieke bugs.

### ❌ Blocking issues

Geen.

### Score

6/6 criteria geslaagd · Aanbeveling: **ship**

---

## Samenvatting & Voorstel

### Triage-score

- Design-kwaliteit: 9/10 (geen issues, template-conform)
- Didactiek-kwaliteit: 8/10 (1 non-blocking aandachtspunt: dormant-chat scenario-mismatch)
- Techniek-kwaliteit: 9/10 (geen issues, registratie compleet, scoring correct)

```
triageScore = (10-9)*0.3 + (10-8)*0.4 + (10-9)*0.3
            = (1)*0.3 + (2)*0.4 + (1)*0.3
            = 0.3 + 0.8 + 0.3
            = 1.4
```

**Aanbeveling: SHIP.** Geen blocking issues op alle drie de rubrics. De missie is inhoudelijk sterk: antwoordmodellen zijn 100% correct nagerekend tegen de dataset, puntensom klopt exact, SLO-mapping is inhoudelijk goed gefundeerd, en alle registratiepunten zijn compleet.

### Voorstel (optioneel, non-blocking)

**Voorstel 1 — Scenario-congruentie chat-rol (autoFixable, low-priority):**

Vervang het sportclub-scenario in de systemInstruction door het schooldata-scenario, zodat de dormant chat-rol (mocht die ooit geactiveerd worden) congruent is met de data-viewer-content.

**Bestand:** `src/config/agents/year2.tsx`

**Voor** (regel 406-408, EERSTE BERICHT):
```
"📊 Dashboard Studio — jouw projectbrief is binnen!
Een lokale sportclub wil weten hoe hun leden trainen. Ze hebben data, maar geen overzicht.
Jij ontwerpt hun dashboard. Vertel me eerst: voor wie is dit dashboard en wat moeten ze er in 5 seconden uit kunnen halen?"
```

**Na:**
```
"📊 Dashboard Studio — jouw projectbrief is binnen!
De schooldirecteur wil in één oogopslag zien hoe het gaat met de klassen: cijfers, aanwezigheid, tevredenheid. De data staat er, maar het overzicht ontbreekt.
Jij ontwerpt het dashboard. Vertel me eerst: voor wie is dit dashboard en wat moeten ze er in 5 seconden uit kunnen halen?"
```

**Waarom:** Sluit aan bij `problemScenario` (`src/config/agents/year2.tsx:352`, al schooldirecteur-scenario) en bij de daadwerkelijke datasets. Voorkomt een toekomstige inconsistentie als `enableChat` ooit aangezet wordt.

**Risico van niet-toepassen:** Nul bij huidige staat (chat is dormant, leerling ziet dit nooit). Wordt pas relevant bij activatie van de chat-rol.

---

**Status: SHIP.** Geen wijzigingen doorgevoerd in deze review-pass (read-only conform opdracht).
