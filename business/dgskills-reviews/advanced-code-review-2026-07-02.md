# Missie-review: advanced-code-review

**Datum:** 2026-07-02
**Wave:** 17 (verse review)
**TemplateType:** `review-arena`
**Config:** `src/features/missions/templates/review-arena/configs/advanced-code-review.ts`
**Curriculum-plek:** Leerjaar 3, Periode 1 (reviewMissions), `havo`/`vwo` — `src/config/curriculum.ts:261`
**SLO-claim:** `21D`, `22B` — `src/config/slo-kerndoelen-mapping.ts:159`

---

## 🎨 Design review

**Mission:** advanced-code-review (review-arena)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** de config zelf bevat geen `className`-literals; alle styling zit in de gedeelde `ReviewArena.tsx`-engine (engine-eigendom). Badge-kleuren (`#e1ff01`, `#202023`, `#ff3c21`) matchen exact de DUCK-tokens `duck-acid`/`duck-ink`/`duck-error` — consistent, geen off-brand kleuren.
- **Criterium 2 (Layout consistentie):** template-missie, layout volledig gedeeld met de andere 6 review-arena-missies via dezelfde engine.
- **Criterium 4 (Copy-lengte, leerjaar 3 → intro <120w, opdracht <80w):** `introDescription` 24 woorden, ronde-beschrijvingen 11-20 woorden — ruim binnen grens (`advanced-code-review.ts:8-9,55-56,100-101,131`).
- **Criterium 6 (Framer Motion):** geen animatie-code in de config — engine-eigendom.

### ⚠️ Aandachtspunten
Geen missie-specifieke design-issues gevonden.

### ❌ Blocking issues
Geen.

### Score
4/4 toepasbare criteria geslaagd · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** advanced-code-review (review-arena)
**Curriculum-plek:** Leerjaar 3, Periode 1, reviewMissions (`curriculum.ts:261`)
**SLO-claim:** `21D`, `22B` (`slo-kerndoelen-mapping.ts:159`)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `22B` (programmeren: ontwerpen/schrijven/testen) past bij ML-pipeline-stappen en API-concepten. `21D` (comment: "+21D: review bevat ML/AI-concepten") is een redelijke aanvullende claim gezien de ML/neurale-netwerken-inhoud.
- **Criterium 2 (SLO-fit):** sterke fit — alle 4 rondes oefenen direct ML/AI/API-kennis uit Periode 1: pipeline-volgorde, begrippenkoppeling, supervised/unsupervised-classificatie, feitenkennis over neurale netwerken/API's/open source.
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts:524-531` bevat een meetbaar `primaryGoal` met actiewerkwoorden (ordenen, koppelen, classificeren) en een concrete `evidence`-zin.
- **Criterium 4 (Opdracht-beknoptheid):** binnen leerjaar-3-grenzen (zie design-review).
- **Criterium 6 (Curriculum-plek logisch):** logisch als afsluitende reviewmissie ná een Periode-1-blok met ML/API/neurale-netwerken-missies (bevestigd door `problemScenario`: "De periode zit erop... Alleen wie alles begrijpt, mag door").
- **Criterium 7 (Bloom-balans):** goede mix — ronde 1 (sorteren = toepassen/analyseren van procesvolgorde), ronde 2 (koppelen = begrijpen), ronde 3 (categoriseren + transfer-followUp = analyseren), ronde 4 (waar/onwaar + overfitting-diagnose-followUp = analyseren/evalueren). Niet alleen kale recall.
- **Criterium 8 (AI-as-copilot):** N.v.t. — `templateRegistry.ts:43` bevestigt geen `enableChat` voor deze missie, platform-breed voor alle 7 review-arena-missies. Bekend, niet opnieuw als issue van déze missie.
- **Criterium 9 (Welzijn):** geen gevoelige-onderwerp-risico's.

### Inhoudelijke juistheid van de ML/AI-content (missie-eigen check)
Alle 4 rondes + beide follow-ups feitelijk geverifieerd:
- **ML-pipeline-sortering** (`:58-65`): volgorde probleem→data→features/split→trainen→evalueren→deployen is de standaard ML-workflow, correct.
- **Begrippenkoppeling** (`:73-94`): alle 5 koppelingen correct — overfitting, REST API, epoch, data pipeline, open source; definities kloppen exact.
- **Supervised/unsupervised-categorisatie** (`:116-125`): alle 8 items correct geclassificeerd (4 supervised met gelabelde voorbeelden, 4 unsupervised zonder vooraf bekende categorieën), inclusief de subtielere gevallen (huizenprijzen-regressie = supervised, anomaliedetectie zonder normaal-label = unsupervised).
  - **FollowUp** (`:104-114`): streamingdienst-scenario → `correctIndex: 1` (unsupervised) is correct met een heldere uitleg die ook uitlegt waarom "historische data gebruiken" niet automatisch supervised betekent.
- **Rapid-fire stellingen** (`:147-187`): alle 8 waar/onwaar-antwoorden feitelijk juist (NN-basislagen, data-kwaliteit>kwantiteit, GET-semantiek, deep learning niet per se beter, JSON, open-source-aanpasrecht, train/test-split-doel, AI vs ML-relatie). Geen verouderd of technisch onjuist advies.
  - **FollowUp** (`:133-144`): 100%-train/55%-test-scenario → `correctIndex: 1` (overfitting) correct, uitleg legt overtuigend uit waarom de andere 3 opties fout zijn.

Geen feitelijke fouten in de ML/AI-inhoud aangetroffen.

### ⚠️ Aandachtspunten
- **`missionGoals.ts:529`** — de `criteria.description` zegt "...categoriseert **leerstijlen** en beantwoordt AI/ML-vragen", maar de categorize-ronde in de config gaat over **supervised vs. unsupervised learning**, niet over leerstijlen. Dit lijkt een kopieerfout (mogelijk overgenomen uit een andere missie-config of generieke placeholder-tekst) — de leerling-facing `evidence`-zin op regel 531 klopt wél ("overfitting van underfitting onderscheiden" — trouwens ook een lichte mismatch, zie hieronder). Niet leerling-facing (missionGoals wordt getoond op de IntroScreen via `getMissionGoal`), dus wél zichtbaar voor leerlingen als onderdeel van het leerdoel-blok.
- **`missionGoals.ts:531`** — de `evidence`-zin noemt "overfitting van underfitting onderscheiden", maar geen van de 4 rondes test expliciet *underfitting* (alleen *overfitting* komt voor, in de match-pairs-ronde en de rapid-fire-followUp). Underfitting wordt nergens in de config genoemd of getoetst. Kleine overclaim van wat de missie daadwerkelijk bewijst.
- **`year3.tsx:458`** — `missionObjective: 'Doorloop drie review-rondes en bewijs je kennis...'` — de missie heeft feitelijk **4 rondes** (drag-sort, match-pairs, categorize, rapid-fire), niet 3. Dit is leerling-facing tekst (getoond bij de missie-briefing) en spreekt de daadwerkelijke `config.rounds.length` (4) tegen.

### ❌ Blocking issues
Geen — alle 3 punten zijn tekstuele/metadata-onnauwkeurigheden, geen didactische fouten in de daadwerkelijke toetsstof.

### SLO-fit oordeel
- **21D + 22B:** goed geraakt — bewijs: alle 4 rondes toetsen direct ML-pipeline-kennis, API-concepten en programmeerbegrippen uit Periode 1.

### Score
7/9 criteria volledig geslaagd, 2 met kleine tekstuele onnauwkeurigheid (rondetelling + leerdoel-omschrijving) · Bloom-balans: medium-hoog · Aanbeveling: **ship met kleine tekstfix**

---

## 🔧 Tech review

**Mission:** advanced-code-review (review-arena)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** niet uitgevoerd — geen screenshots-map aanwezig voor deze missie en geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 resultaten); dit rapport beperkt zich tot statische analyse conform de M4-batch-scope.

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** `ReviewArenaConfig`-type geïmporteerd en toegepast (`advanced-code-review.ts:1`), geen `any`, geen `@ts-ignore`, alle round-types expliciet getypeerd via de gedeelde interface.
- **Criterium A4 (Imports via alias):** enige import is `'../ReviewArena'` (relatief, binnen dezelfde template-map) — gebruikelijk patroon, geen padvervuiling.
- **Criterium A6 (Restart-safe state):** N.v.t. op config-niveau — state-persistence zit in de gedeelde engine.
- **Criterium A7 (Security-checks):** geen `enableChat` (bevestigd via templateRegistry), dus geen client-side AI-interactie-oppervlakte in deze config. Geen `dangerouslySetInnerHTML`, geen leerling-input die binnen déze config naar een AI-model gaat.
- **Data-integriteit rondes:** `round-drag-sort` heeft 6 items met `correctPosition` 0-5, geen duplicaten of gaten (`:58-65`) — sorteer-logica kan niet vastlopen.
- **maxScore-consistentie:** 4 rondes × 25 punten = 100, exact gelijk aan top-level `maxScore: 100` (`:10,57,102,132`) — geen scoring-mismatch.
- **Bonus-cap correct toegepast:** engine-logica (`ReviewArena.tsx:189-210`, `handleFollowUpComplete`) capt `base + bonus` op `round.maxScore` via `Math.min(...)` — voor beide followUps (categorize +5, rapid-fire +5) blijft de rondescore dus altijd ≤25, ook bij een score van 25/25 + bonus. Correct toegepast, engine-eigendom.
- **Badge-drempels sluitend:** 5 badges met drempels 0/25/50/70/90, oplopend zonder gaten of overlap (`:12-42`) — elke score 0-100 valt in precies één categorie.

#### ⚠️ Aandachtspunten
- **Platform-inzicht — client/server systemInstruction drift (niet autoFixable, bevinding):** de client-side `systemInstruction` in `year3.tsx:463-533` (en identiek de server-side `systemInstructions.ts:81`) beschrijft een **structureel ander missie-ontwerp** dan wat de config daadwerkelijk bouwt. De prompt beschrijft 3 chat-gebaseerde rondes met vrije tekst-interactie (Ronde 1: begripsvraag beantwoorden, Ronde 2: fout in pseudocode/API-ontwerp vinden en verbeteren, Ronde 3: synthese-scenario beschrijven), inclusief STEP_COMPLETE-markers per ronde en een hint-systeem. De daadwerkelijk gebouwde missie is een 4-ronden drag-sort/match-pairs/categorize/rapid-fire UI-flow zonder vrije-tekst-invoer, zonder code-fout-analyse en zonder STEP_COMPLETE-gebruik (review-arena-engine kent dat mechanisme niet). Omdat `enableChat` niet aanstaat is deze prompt sowieso dormant (bekend, platform-breed) — maar de inhoud van de prompt zelf is een drift ten opzichte van de config, vermoedelijk een restant van een eerdere/andere missie-opzet. Conform instructie: dit is een bevinding, geen autoFixable issue.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd (zie boven). Bekend, engine-breed gat in de huidige batch-run, geen nieuw issue van déze missie.

### Score
Static: 7/7 toepasbare criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship** (drift-bevinding meegenomen, niet blocking)

---

## Voorstel-blokken

### Voorstel 1 — `missionGoals.ts:529` categorize-omschrijving corrigeren

**Bestand:** `src/config/missionGoals.ts`
**Probleem:** "leerstijlen" is feitelijk onjuist — de categorize-ronde classificeert supervised vs. unsupervised learning-scenario's, geen leerstijlen.

```ts
// VOOR (regel 524-532)
'advanced-code-review': {
    primaryGoal: 'Ik laat zien dat ik geavanceerde programmeer- en ML-concepten beheers door een ML-pipeline te ordenen, begrippen te koppelen en scenario\'s te classificeren.',
    criteria: {
        type: 'rounds-complete',
        min: 4,
        description: 'Je sorteert ML-stappen, koppelt geavanceerde begrippen, categoriseert leerstijlen en beantwoordt AI/ML-vragen.',
    },
    evidence: 'Je kunt de stappen van een ML-pipeline in de juiste volgorde zetten en overfitting van underfitting onderscheiden.',
},

// NA
'advanced-code-review': {
    primaryGoal: 'Ik laat zien dat ik geavanceerde programmeer- en ML-concepten beheers door een ML-pipeline te ordenen, begrippen te koppelen en scenario\'s te classificeren.',
    criteria: {
        type: 'rounds-complete',
        min: 4,
        description: 'Je sorteert ML-stappen, koppelt geavanceerde begrippen, categoriseert supervised en unsupervised learning en beantwoordt AI/ML-vragen.',
    },
    evidence: 'Je kunt de stappen van een ML-pipeline in de juiste volgorde zetten en supervised van unsupervised learning onderscheiden.',
},
```

### Voorstel 2 — `year3.tsx:458` rondetelling corrigeren

**Bestand:** `src/config/agents/year3.tsx`
**Probleem:** "Doorloop drie review-rondes" spreekt de daadwerkelijke `config.rounds.length` (4) tegen.

```tsx
// VOOR (regel 458)
missionObjective: 'Doorloop drie review-rondes en bewijs je kennis van geavanceerd programmeren en AI.',

// NA
missionObjective: 'Doorloop vier review-rondes en bewijs je kennis van geavanceerd programmeren en AI.',
```

---

## Samenvatting

| Rubric | Score (0-10) | Aanbeveling |
|---|---|---|
| Design | 9.0 | ship |
| Didactiek | 7.5 (2 tekstuele onnauwkeurigheden: rondetelling + leerdoel-mismatch) | ship met kleine tekstfix |
| Tech | 8.5 (static volledig groen, dynamic n.v.t., drift-bevinding niet-blocking) | ship |

**triageScore** = (10-9.0)×0.3 + (10-7.5)×0.4 + (10-8.5)×0.3 = 0.30 + 1.00 + 0.45 = **1.75**

Lage triageScore bevestigt: dit is een didactisch en technisch solide missie met alleen kleine, niet-blokkerende tekstfixes. De ML/AI-inhoud zelf (alle 4 rondes + follow-ups) is feitelijk 100% correct.

**Bekende platform-brede punten (niet aan deze missie toe te schrijven, niet opnieuw ter discussie):**
- Dormante chat-rol geldt template-breed voor alle 7 review-arena-missies zonder `enableChat` — architectuurkeuze, geen bug.
- Duck-tokens beperkt tot bg/bgLight/ink/acid/gray/error — badge-kleuren in deze config zijn hex-literals die met die tokens overeenkomen, geen afwijking.
- Geen dynamic/Chrome-plugin-evidence beschikbaar voor deze wave — engine-brede beperking van de huidige batch-run.

**Wijzigingen aangebracht:** geen (conform opdracht — "Wijzig NIETS"). Bovenstaande Voorstel-blokken zijn voorstellen voor een aparte fix-pass, niet toegepast.
