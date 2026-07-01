# Missie-review: `portfolio-builder` — 2026-07-01

**Template-type:** builder-canvas
**Config:** `src/features/missions/templates/builder-canvas/configs/portfolio-builder.ts`
**Agent-rol:** `src/config/agents/year3.tsx:1739`
**Curriculum-plek:** Leerjaar 3, Periode 4 ("Meesterproef")
**SLO-claim:** `22A`, `21B`
**Pipeline:** M4 wave-10 batch-review

---

## Screenshots

Geen `screenshots/`-map voor deze missie gevonden — dynamische visuele verificatie overgeslagen. Fase B tech-criteria niet uitvoerbaar (DGSkills SPA is state-based, geen URL per missie, geen dev-server in deze review-run). Alle visuele claims zijn static-only.

Geen vermelding van `portfolio-builder` in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`.

---

## ⚠️ Kritieke desync: agent-briefing beschrijft ANDER stappenplan dan canvas-config

Vóór de rubric-review: de config (`portfolio-builder.ts`) en de agent-briefing (`year3.tsx:1765-1807`) beschrijven **twee verschillende missies**.

| | Canvas-config (`portfolio-builder.ts`) | Agent-briefing (`year3.tsx`) |
|---|---|---|
| **Aantal stappen** | 4 canvas-stappen: `projectselectie`, `reflecties`, `structuur`, `persoonlijk-profiel` | 3 chat-stappen met `---STEP_COMPLETE:1/2/3---` |
| **Stap 1** | 3-5 projecten selecteren + rangschikken | Minimaal 4 projecten + rol + wat geleerd |
| **Stap 2** | Reflecties schrijven (WWW-structuur, 2 stuks, 60-100 woorden) | Structuur + visuele opzet |
| **Stap 3** | Portfolio-structuur ontwerpen | Portfolio deelbaar maken + feedback verwerken |
| **Stap 4** | Persoonlijk profiel (80-120 woorden) | *(bestaat niet in briefing)* |
| **Persoonlijk profiel** | Expliciete stap 4, apart criterium | Niet genoemd |
| **Publicatie/delen** | Niet genoemd in config | Expliciete stap 3 ("deelbaar maken") |

`missionGoals.ts:652-660` volgt de **config**-structuur (projectselectie, WWW-reflecties, portfoliostructuur, persoonlijk profiel 80-120 woorden) — dus config + missionGoals zijn onderling consistent. De agent-briefing is de outlier.

**Praktisch effect:** `enableChat: true` + `chatRoleId: 'portfolio-builder'` in de config koppelt de builder-canvas UI aan deze system-instruction. Als een leerling tijdens de canvas-stappen de chat opent, krijgt hij een AI-coach die een driestappen-flow met STEP_COMPLETE-markers volgt die niet overeenkomt met de 4 zichtbare canvas-stappen. De chat kan bijvoorbeeld vragen om het portfolio "deelbaar te maken" (briefing-stap 3) terwijl de leerling nog in canvas-stap 2 (reflecties) zit, of nooit vragen naar het persoonlijk profiel (canvas-stap 4) omdat de briefing die stap niet kent.

Dit is hetzelfde desync-patroon dat in wave-9 bij zuster-missies is gevonden (config/briefing-inhoud uit de pas). **Escaleren, niet fixen** — een herschrijving van de agent-briefing naar het 4-stappen canvas-model is een inhoudelijke coach-herstructurering, buiten `autoFixable`-scope.

---

## 🎨 Design review

**Mission:** portfolio-builder (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (Tailwind tokens):** N.v.t. op configPath — `portfolio-builder.ts` bevat geen JSX/className-strings (pure content-config). Styling zit in de gedeelde `BuilderCanvas`-engine (engine-breed, niet missie-specifiek). Badge-`color`-velden zijn hex-strings (`#e1ff01`, `#202023`, `#ff3c21`) die exact matchen met `duck-acid`, `duck-ink`, `duck-error` — consistent met het patroon in andere builder-canvas-configs (engine-conventie, geen missie-specifieke afwijking).
- **Criterium 4 (Copy-lengte, leerjaar 3: intro <120, opdracht <80 woorden):** `introDescription` = 32 woorden (ruim onder 120). Alle 4 `instruction`-velden: 57-69 woorden (onder 80). Geen overschrijding. — `portfolio-builder.ts:8-9, 26, 42, 58, 74`
- **Criterium 6 (Framer Motion):** N.v.t. — config bevat geen animatie-declaraties; animaties zijn engine-verantwoordelijkheid.

### ⚠️ Aandachtspunten

- **Criterium 2 (Layout consistentie):** Niet apart beoordeeld — builder-canvas-engine is gedeeld over alle configs in deze map (`api-architect.ts`, `brand-builder.ts`, etc.); structurele afwijkingen zouden een engine-issue zijn, niet missie-specifiek. Geen afwijking gevonden in de config-structuur zelf (zelfde velden: `steps[]`, `checklistItems[]`, `badges[]`, `takeaways[]` als vergelijkbare configs).
- **Criterium 3 (Knop-clarity):** N.v.t. — knoppen zijn engine-gerenderd, niet in config.
- **Criterium 5 (Responsive):** N.v.t. statisch — geen viewport-specifieke declaraties in config (engine-verantwoordelijkheid). Dynamisch niet geverifieerd (geen dev-server).
- **Criterium 7 (Toegankelijkheid):** N.v.t. op config-niveau — geen `alt`/`aria`/formulier-declaraties in deze content-only file.
- **Visual Precision Gate:** UNVERIFIED — geen Chrome-plugin evidence beschikbaar in deze review-run. Alle dynamische/visuele claims zijn niet geverifieerd.

### ❌ Blocking issues

Geen.

### Score

3/7 criteria expliciet geslaagd, 4/7 N.v.t. (config bevat geen UI-laag — engine-verantwoordelijkheid) · Aanbeveling: **ship** (voor het design-aspect van de config zelf; engine-brede issues niet in scope)

---

## 📚 Didactiek review

**Mission:** portfolio-builder (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 4 ("Meesterproef")
**SLO-claim:** `22A` (Digitale producten), `21B` (Media & Informatie)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** `22A` en `21B` zijn beide geldige regulier-VO-codes. Geen VSO-mapping (`sloVsoKerndoelen` ontbreekt) — niet kritiek voor een bovenbouw-meesterproef-missie, maar wel een gemiste kans (zie Aandachtspunten). — `src/config/slo-kerndoelen-mapping.ts:189`
- **Criterium 2 (SLO-fit):** `22A` (digitale producten/creëren) wordt sterk geraakt: de leerling ontwerpt en bouwt daadwerkelijk een portfolio-product (stappen `structuur`, `persoonlijk-profiel`). `21B` (media & informatie) wordt geraakt via `projectselectie` (informatie selecteren/prioriteren) en `reflecties` (informatie contextualiseren). Beide claims zijn goed onderbouwd.
- **Criterium 3 (Leerdoelen helder):** Geen expliciete `learningObjectives`-array in de config, maar `takeaways[]` (regel 93-98) functioneert als impliciete leerdoelen en zijn concreet: "Je weet hoe je je beste projecten selecteert en prioriteert", "Je kunt zinvolle reflecties schrijven die groei... laten zien". Actiewerkwoorden aanwezig (selecteert, schrijft, ontworpen). — `portfolio-builder.ts:93-98`
- **Criterium 4 (Opdracht-beknoptheid):** Zie Design-review — ruim binnen leerjaar-3-grenzen.
- **Criterium 5 (Leeftijds-passend vocabulary):** Taal past bij 15-16-jarigen (havo/vwo leerjaar 3): concreet, direct, geen onnodig jargon. Voorbeeld-tip "CSS Grid makkelijker is dan Flexbox" is een passend concreet voorbeeld voor deze doelgroep. — `portfolio-builder.ts:43`
- **Criterium 6 (Curriculum-plek logisch):** Periode 4 = "Meesterproef" (`curriculum.ts:299-311`), sloFocus dekt alle SLO-codes uit 3 jaar. Een portfolio dat 3 jaar werk bundelt is een logische afsluiter van precies deze periode — sterke fit.
- **Criterium 7 (Bloom-taxonomie):** Goede balans over de 4 stappen: `projectselectie` = analyseren/evalueren (rangschikken + motiveren), `reflecties` = evalueren (WWW-structuur dwingt tot metacognitie), `structuur` = creëren (ontwerpbeslissingen), `persoonlijk-profiel` = creëren (synthese). Geen pure onthoud/quiz-vragen — passend hoog Bloom-niveau voor een leerjaar-3-afsluitmissie.
- **Criterium 9 (Welzijn):** Geen gevoelige thematiek. Taal is inclusief, geen gender-specifieke aannames.

### ⚠️ Aandachtspunten

- **Criterium 1 (VSO-mapping ontbreekt):** Geen `sloVsoKerndoelen` voor deze missie, terwijl zuster-missies in dezelfde periode dat wel kunnen hebben.
  - **Wat:** `sloVsoKerndoelen` is niet gezet in `slo-kerndoelen-mapping.ts:189`.
  - **Waarom:** Niet kritiek (VSO-mapping is optioneel), maar een portfolio-opdracht is bij uitstek geschikt te herformuleren voor VSO-niveau — een gemiste toegankelijkheidskans, geen fout.
  - **Voorstel:** Buiten scope van deze review (vereist VSO-curriculumkennis, geen mechanische fix).

- **Zie hierboven — Kritieke desync agent-briefing vs config:** dit raakt primair Criterium 8 (AI-as-copilot). De briefing volgt een eigen 3-stappen-logica los van de 4 canvas-stappen die de leerling ziet. Het 3-stappen-methode-principe (erkenning → uitleg → challenge) is wel aanwezig in de briefing zelf (`WERKWIJZE`-sectie, `year3.tsx:1771-1776`), maar de STAP-VOLTOOIING-markers matchen niet de canvas-progressie. Zie escalatie-sectie bovenaan.

### ❌ Blocking issues

Geen — de desync is een coherentie-probleem, geen showstopper (elke laag werkt op zichzelf correct).

### SLO-fit oordeel

- **22A**: sterk geraakt — bewijs: stappen `structuur` en `persoonlijk-profiel` vragen concrete productie/ontwerpbeslissingen.
- **21B**: sterk geraakt — bewijs: stappen `projectselectie` en `reflecties` vragen informatie selecteren, prioriteren en contextualiseren.

### Score

7/8 toepasselijke criteria geslaagd (Criterium 8 gedeeltelijk door desync) · Bloom-balans: **hoog** (passend voor leerjaar-3-afsluiter) · Aanbeveling: **fix-eerst** (vanwege de briefing/canvas-desync)

---

## 🔧 Tech review

**Mission:** portfolio-builder (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze review-run

### Static analyse

#### ✅ Geslaagd

- **Criterium A3 (TypeScript-discipline):** Config is getypeerd als `BuilderCanvasConfig`. Geen `any`, geen `@ts-ignore`. Alle velden expliciet getypeerd via het gedeelde interface. — `portfolio-builder.ts:3`
- **Criterium A4 (Imports via alias):** Enige import is relatief (`../BuilderCanvas`) — dit is de gebruikelijke conventie binnen dezelfde template-map (config → eigen engine-type), consistent met andere configs in deze directory. Geen `@/*`-violatie op een pad dat wél alias zou moeten gebruiken.
- **Criterium A7 (Security — systemInstruction server-side):** `chatRoleId: 'portfolio-builder'` wijst naar een server-side `roleId`-resolutie; de config zelf bevat geen client-side `systemInstruction`-definitie. — `portfolio-builder.ts:17`

#### ⚠️ Aandachtspunten

- **Criterium A1/A2/A5/A6 (knop-handlers, error-states, edge-function-calls, restart-safe state):** Niet beoordeeld op config-niveau — dit is engine-verantwoordelijkheid (`BuilderCanvas.tsx`), engine-breed en dus buiten missie-specifieke scope conform review-instructie.
- **Visual Precision Gate:** UNVERIFIED — geen Chrome-plugin evidence. Alle dynamische claims niet geverifieerd.

#### ❌ Blocking issues

Geen.

### Dynamic verificatie (indien uitgevoerd)

Niet uitgevoerd — geen dev-server in deze review-run. Multi-viewport visuele verificatie, console-output en network-failures niet gecontroleerd.

### Score

3/3 toepasselijke static criteria geslaagd (overige criteria = engine-scope, niet missie-specifiek) · Dynamic: n.v.t. · Aanbeveling: **ship** (voor het technische aspect van de config zelf)

---

## Samenvatting & Voorstel-blokken

Geen `autoFixable`-issues gevonden. De enige substantiële bevinding (agent-briefing/canvas-desync) is een **structurele coach-herschrijving** — expliciet uitgesloten van `autoFixable`-scope (geen mechanische, missie-specifieke fix; vereist een inhoudelijke keuze over welk stappenmodel leidend wordt).

### Voorstel — NIET autoFixable, ter escalatie

**Optie A (aanbevolen):** herschrijf de agent-briefing (`year3.tsx:1771-1807`) zodat de `WERKWIJZE`/`STAP-VOLTOOIING`-sectie het 4-stappen canvas-model volgt (`projectselectie` → `reflecties` → `structuur` → `persoonlijk-profiel`) met 4 STEP_COMPLETE-markers in plaats van 3. Dit is de kleinere ingreep (alleen de briefing-tekst wijzigt, config/missionGoals blijven ongemoeid — die zijn al consistent).

**Optie B:** herschrijf de config naar het 3-stappen briefing-model. Grotere ingreep — raakt `missionGoals.ts` (dat nu de config volgt) en de checklist-structuur.

Geen van beide is in deze review toegepast — vereist een productbeslissing over welk model leidend is, buiten `autoFixable`-scope per de wave-9-precedent.
