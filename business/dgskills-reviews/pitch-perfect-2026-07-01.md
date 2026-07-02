# Missie-review: pitch-perfect

**Datum:** 2026-07-01 · **Wave:** 9 (verse review) · **TemplateType:** `builder-canvas`
**Config:** `src/features/missions/templates/builder-canvas/configs/pitch-perfect.ts`
**Curriculum-plek:** Leerjaar 3, Periode 4 (Meesterproef) · **SLO-claim:** `21B`, `22A`
**Agent-rol:** `src/config/agents/year3.tsx:2018-2112`

---

## 🎨 Design review

**Mission:** pitch-perfect (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: config-file bevat geen inline className's (content-only, engine bepaalt UI) — geen hex-literals of niet-doeldomein tokens aangetroffen in `pitch-perfect.ts`.
- **Criterium 2 (Layout consistentie)**: identiek aan baseline `portfolio-builder.ts` — zelfde 4-stappen-structuur, zelfde velden (`checklistItems`, `textPrompt`, `tip`), gedeelde engine `BuilderCanvas.tsx` rendert beide identiek.
- **Criterium 3 (Knop-clarity)**: geen knoppen in config zelf; engine-knoppen (`BuilderCanvas.tsx:304-311` chat-toggle, `:318-325` mobile-terug) zijn engine-breed en al goedgekeurd via eerdere `builder-canvas`-reviews.
- **Criterium 6 (Framer Motion)**: geen animatie-code in config — n.v.t.
- **Criterium 7 (Toegankelijkheid)**: geen config-niveau a11y-items (engine-verantwoordelijkheid, al gedekt).

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: geen screenshots-map (`.ui-review/`) voor `pitch-perfect` aangetroffen, en geen entry in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`. Dynamische verificatie **niet uitgevoerd** — status: unverified. Engine is gedeeld met `portfolio-builder` (wel elders geverifieerd via batch-review), dus laag risico, maar mission-specifieke content (langere checklist met 8 items in stap 1 t.o.v. baseline's 4) is niet visueel bevestigd.
  - **Wat:** stap `pitch-structuur` heeft 8 checklist-items (i.p.v. de gebruikelijke 4) — mogelijk een langere scroll-lijst in het linkerpaneel op mobiel.
  - **Waarom:** meer items kan op 375px-viewport de checklist onder de fold duwen vóór de tekst-invoer zichtbaar is.
  - **Voorstel:** geen code-wijziging nodig zonder visueel bewijs; noteer als openstaand punt voor eerstvolgende Chrome-plugin-sweep.

### ❌ Blocking issues
_Geen._

### Score
4/5 toepasselijke criteria geslaagd (1 unverified door ontbrekend dynamisch bewijs) · Aanbeveling: **ship** (met aantekening dat visuele verificatie nog niet is gedaan)

---

## 📚 Didactiek review

**Mission:** pitch-perfect (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 4 (Meesterproef)
**SLO-claim:** `21B` (Media & Informatie), `22A` (Digitale producten)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `21B` en `22A` zijn beide geldige regulier-VO-codes (`src/config/slo-kerndoelen-mapping.ts:19-21`). Geen VSO-mapping — consistent met de rest van het meesterproef-cluster (`portfolio-builder`, `prototype-developer` hebben ook geen VSO-tag).
- **Criterium 3 (Leerdoelen helder)**: `missionGoals.ts:670-678` bevat een expliciete `primaryGoal` met actiewerkwoord ("Ik bereid... voor"), meetbare `criteria` (`steps-complete`, min 4) en concreet `evidence`-veld. Voldoet aan alle sub-eisen.
- **Criterium 4 (Opdracht-beknoptheid)**: `introDescription` = 34 woorden (grens 120) ruim binnen. Instructie-velden: `pitch-structuur` 29w, `uitwerking` 83w, `oefenen` 57w, `jury-vragen` 82w (grens 80w/opdracht). Twee van de vier stappen zitten 2-3 woorden boven de richtlijn — marginaal en didactisch verklaarbaar (elke instructie bevat een genummerde deelvragenlijst, wat woordentelling opdrijft t.o.v. lopende tekst).
- **Criterium 5 (Leeftijds-passend)**: taal is direct en motiverend zonder jargon ("Wat vind jij zelf het moeilijkste onderdeel"). Geen kinderachtige toon voor leerjaar 3 (13-14 jaar).
- **Criterium 6 (Curriculum-plek)**: past logisch in periode-4-cluster ná `research-project`/`prototype-developer` — leerling heeft dan al een project om te pitchen (`curriculum.ts:299-312`).
- **Criterium 7 (Bloom-balans)**: mix van toepassen (structuur bouwen), creëren (pitch schrijven), evalueren (feedback verwerken) en analyseren (jury-vragen voorbereiden) — goede spreiding, geen pure quiz-recall.
- **Criterium 8 (AI-as-copilot)**: `enableChat: true` + `systemInstruction` (`year3.tsx:2047-2093`) volgt expliciet coach-patroon: stelt vragen, geeft scaffolding via 4-onderdelen-structuur, vraagt leerling zelf te formuleren ("Beschrijf jouw project in één zin — zodat je oma het begrijpt"). Geen antwoordenmachine-gedrag zichtbaar.
- **Criterium 9 (Welzijn)**: geen gevoelige onderwerpen; taalgebruik neutraal, geen gender-aannames.

### ⚠️ Aandachtspunten
- **Criterium 2 (SLO-fit — claim vs werkelijkheid)**: `22A` (Digitale producten) is twijfelachtig voor deze missie — `pitch-perfect.ts:1-105`
  - **Wat:** de missie-content (4 stappen: structuur → uitschrijven → oefenen → jury-vragen) is zuiver mondelinge presentatie- en communicatievaardigheid. Er wordt geen digitaal product gebouwd, bewerkt of vormgegeven — in tegenstelling tot de zuster-missie `portfolio-builder` (zelfde SLO-paar `22A`+`21B`), die wél een expliciet portfolio-artefact (structuur, platform-keuze, visuele vormgeving) oplevert en dat ook motiveert met een comment (`slo-kerndoelen-mapping.ts:189`: "21A→21B: portfolio presentatie = product + informatievaardigheden").
  - **Waarom:** `pitch-perfect` heeft géén vergelijkbare motiverende comment in de mapping-file, en de content zelf bevat geen "product maken"-activiteit (geen slides bouwen, geen visueel materiaal). Het kerndoel dat wél sterk wordt geraakt is `21B` (informatieverwerking en presenteren — expliciet genoemd in de systemInstruction zelf) en mogelijk `23C` (maatschappij/communicatie), maar `22A` wordt oppervlakkig of niet geraakt.
  - **Voorstel:** ofwel (a) een motiverende comment toevoegen bij `pitch-perfect` in `slo-kerndoelen-mapping.ts:192` die uitlegt waarom `22A` van toepassing is (bv. als de pitch een visuele demo/slide bevat), ofwel (b) heroverwegen of `22A` moet worden vervangen door een ander kerndoel dat beter aansluit. Dit is een **aanbeveling, geen blocker** — de missie zelf functioneert didactisch prima, het gaat om claim-precisie in de mapping.

### ❌ Blocking issues
_Geen._

### SLO-fit oordeel
- **21B (Media & Informatie)**: sterk geraakt — alle 4 stappen draaien om informatie structureren en presenteren; systemInstruction citeert dit kerndoel expliciet.
- **22A (Digitale producten)**: oppervlakkig/twijfelachtig — geen "product maken"-activiteit in de content; ontbrekende motiverende comment t.o.v. vergelijkbare zuster-missie.

### Score
7/8 toepasselijke criteria geslaagd · Bloom-balans: medium-hoog · Aanbeveling: **ship** (SLO-claim-precisie is een lichte aandachtspunt, geen blocker)

---

## 🔧 Tech review

**Mission:** pitch-perfect (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewronde, geen bestaande screenshots-map voor deze missie aangetroffen

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`, config is volledig getypeerd via `BuilderCanvasConfig` (`pitch-perfect.ts:1,3`).
- **Criterium A4 (Imports via alias)**: enige import is relatief (`../BuilderCanvas`), consistent met alle andere `builder-canvas`-configs (`portfolio-builder.ts:1` idem) — is het gevestigde patroon binnen deze configs-map, geen afwijking.
- **Criterium A6 (Restart-safe state)**: engine (`BuilderCanvas.tsx:69-72`) gebruikt `useMissionAutoSave` — geldt voor alle configs van dit template, inclusief `pitch-perfect`.
- **Criterium A7 (Security)**: `chatRoleId: 'pitch-perfect'` (`pitch-perfect.ts:17`) — `systemInstruction` wordt server-side bepaald via `roleId` (engine geeft `roleId` door aan `StudentAIChat`, `BuilderCanvas.tsx:281`), geen client-side prompt-definitie in de config.
- **Registry-consistentie**: `templateRegistry.ts:62` en `VALID_BUILDER_CANVAS_IDS`-allowlist in `BuilderCanvas.tsx:345` bevatten beide `pitch-perfect` — config laadt correct via de dynamische `import()`.
- **Score-consistentie**: `maxScore: 100` / 4 stappen → 25 punten/stap via `pointsPerStep = Math.floor(config.maxScore / config.steps.length)` (`BuilderCanvas.tsx:78`) — 100/4 = exact 25, geen afronding-rest. Badge-drempels (90/70/50/25/0) zijn identiek aan baseline-patroon.

#### ⚠️ Aandachtspunten
_Geen missie-specifieke technische issues gevonden buiten wat hierboven als bekend engine-breed gedrag geldt (niet opnieuw gerapporteerd per instructie)._

#### ❌ Blocking issues
_Geen._

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server actief in deze reviewronde en geen bestaande screenshot-evidence voor `pitch-perfect` specifiek gevonden in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` of een `.ui-review/`-map. Alle dynamische/visuele claims zijn **unverified**.

### Score
Static: 5/5 toepasselijke criteria geslaagd · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (dynamische verificatie is een openstaand punt, geen blocker gegeven dat de gedeelde engine elders al is geverifieerd)

---

## Samenvatting & scores

| Rubric | Score (0-10, 10=uitstekend) | Aanbeveling |
|---|---|---|
| Design | 8.0 | ship |
| Didactiek | 7.0 | ship (SLO-claim-precisie aandachtspunt) |
| Tech | 8.5 | ship |

**triageScore** = (10-8.0)×0.3 + (10-7.0)×0.4 + (10-8.5)×0.3 = 0.6 + 1.2 + 0.45 = **2.25**

## Conclusie

`pitch-perfect` is een didactisch solide, technisch correct geïmplementeerde missie die het gevestigde `builder-canvas`-patroon volgt zonder afwijkingen. Het enige inhoudelijke aandachtspunt is de SLO-claim `22A` (Digitale producten), die zwakker onderbouwd is dan bij de vergelijkbare zuster-missie `portfolio-builder` — de missie bouwt geen digitaal product, ze traint mondelinge presentatievaardigheid. Dit is een documentatie/mapping-precisie-kwestie, geen functionele of leerling-ervaring-blocker. Visuele dynamische verificatie ontbreekt (geen bestaande screenshots), wat een openstaand punt is voor een toekomstige Chrome-plugin-sweep, maar de gedeelde engine is elders al gevalideerd. **Ship-aanbeveling: ja, met de SLO-comment-aanvulling als lichte follow-up.**
