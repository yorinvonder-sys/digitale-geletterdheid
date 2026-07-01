# Review: prototype-developer

**Datum:** 2026-07-01 · **Wave:** 10 (verse review) · **Template:** builder-canvas
**Config:** `src/features/missions/templates/builder-canvas/configs/prototype-developer.ts`
**Curriculum-plek:** Leerjaar 3, Periode 4 (Meesterproef) · **SLO-claim:** 22A, 22B

---

## 🎨 Design review

**Mission:** prototype-developer (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** `curriculum.ts:1935-1949` gebruikt `lab-sage`, `lab-coral`, `lab-gold` — alle drie geldige legacy-tokens (`tailwind.shared.js:23-25`). Engine (`BuilderCanvas.tsx`) gebruikt consequent `duck-*` tokens. Geen hex-literals waar een token bestaat.
- **Criterium 2 (Layout consistentie):** identiek aan baseline `web-developer` (oudste builder-canvas-config) — zelfde `IntroScreen`/`PhaseHeader`/`StepInstructionPanel`/`PreviewPanel`-structuur, geen structurele afwijking.
- **Criterium 3 (Knop-clarity):** alle knoppen in `StepInstructionPanel.tsx:147-165` en `BuilderCanvas.tsx:304-311` hebben functionele `onClick`, duidelijk label + hover/focus-state, `aria-label` op icon-only chat-knop.
- **Criterium 4 (Copy-lengte):** `introDescription` 30 woorden (grens leerjaar 3: <120) — ruim binnen grens. Instructies per stap: 77 / 51 / 66 / 54 woorden (grens: <80) — stap 1 zit net onder de grens (77/80).
- **Criterium 5 (Responsive):** `BuilderCanvas.tsx:250-271` gebruikt `md:w-[45%]`/`md:w-[55%]` met mobile-tab-fallback (`MobileTabBar`), geen vaste pixel-widths.
- **Criterium 6 (Framer Motion):** geen `motion.*` in deze missie — n.v.t.
- **Criterium 7 (Toegankelijkheid):** focus-states aanwezig (`focus-visible:ring-2`), `<label htmlFor>` gekoppeld aan textarea (`StepInstructionPanel.tsx:118-124`), geen kleur-only info.
- **Visual Precision Gate:** geen Chrome-plugin-bewijs beschikbaar (geen dev-server in deze reviewrun) — statisch oordeel: geen overlap/afkap-risico zichtbaar in code; **unverified** voor dynamische claims.

### ⚠️ Aandachtspunten
- Geen noemenswaardige design-issues gevonden.

### ❌ Blocking issues
- Geen.

### Score
7/7 criteria geslaagd (statisch) · Visual Precision Gate: unverified (geen dev-server) · Aanbeveling: ship

---

## 📚 Didactiek review

**Mission:** prototype-developer (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 4
**SLO-claim:** 22A (Digitale producten), 22B (Programmeren)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `slo-kerndoelen-mapping.ts:191` — 22A + 22B zijn beide geldige regulier-VO-codes, geen VSO-mapping (redelijk: dit is een havo/vwo-only missie, zie `curriculum.ts:1924`).
- **Criterium 2 (SLO-fit):** 22A (digitale producten) sterk geraakt via canvas-stap "bouwen" (`prototype-developer.ts:52-67`, verplicht een werkend prototype + technische beschrijving). 22B (programmeren) redelijk geraakt — instructie vraagt expliciet naar "technische bouwblokken" en een "code-snippet" (`prototype-developer.ts:58`), al is de missie tool-agnostisch (Scratch/Figma/no-code toegestaan naast code) — licht oppervlakkig voor 22B bij niet-code-tools, maar consistent met de bredere "prototype"-scope.
- **Criterium 3 (Leerdoelen):** impliciete leerdoelen via `introFeatures` (`prototype-developer.ts:10-15`) en `takeaways` (`prototype-developer.ts:93-98`) zijn concreet en actie-gericht ("Je weet hoe je een project afbakent", "Je kunt een technisch ontwerp schrijven").
- **Criterium 4 (Opdracht-beknoptheid):** alle instructies onder de leerjaar-3-grens (max 77/80 woorden) — zie design-review.
- **Criterium 5 (Leeftijds-passend):** taal is direct en motiverend, past bij 15-16-jarigen; termen als "feature creep" en "rubber duck debugging" worden inline uitgelegd (`prototype-developer.ts:27,59`) — geen onuitgelegd jargon.
- **Criterium 6 (Curriculum-plek):** past logisch in Periode 4 "Meesterproef" naast `portfolio-builder`, `research-project`, `pitch-perfect` (`curriculum.ts:303-310`) — bouwt op eerdere periodes.
- **Criterium 7 (Bloom-balans):** goede mix — scopen/afbakenen (analyseren), ontwerpen (toepassen), bouwen (creëren), testen/itereren (evalueren). Geen pure recall.
- **Criterium 9 (Welzijn):** geen gevoelige onderwerpen; geen gender-aannames.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — briefing/canvas STEP_COMPLETE-desync**: `src/config/agents/year3.tsx:1966-1978`
  - **Wat:** de agent-briefing (`systemInstruction`) beschrijft **3 STAP's** met bijbehorende `STEP_COMPLETE:1/2/3`-markers, terwijl de canvas **4 stappen** heeft (`idee-uitwerken`, `ontwerpen`, `bouwen`, `testen-itereren`). De inhoud van de briefing-STAP's is bovendien met één positie verschoven t.o.v. de canvas-stap-namen: briefing STAP 1 ("Ontwerp maken", STEP_COMPLETE:1 = "wireframe met kernfunctionaliteit + min. 3 schermen") komt inhoudelijk overeen met canvas-stap 2 ("ontwerpen"), niet canvas-stap 1 ("idee-uitwerken" = scope/afbakening, geen wireframe-eis). Briefing STAP 2 ("Prototype bouwen", STEP_COMPLETE:2 = "werkende versie gebouwd") komt overeen met canvas-stap 3 ("bouwen"). Briefing STAP 3 ("Testen en itereren", STEP_COMPLETE:3 = "getest met 2 personen + verbetering") komt overeen met canvas-stap 4 ("testen-itereren"). Canvas-stap 1 ("idee-uitwerken", scope/afbakening — de kern van de missie's eigen tip over feature creep) heeft **geen** corresponderende STEP_COMPLETE-marker in de briefing.
  - **Waarom:** de leerling ziet in de canvas 4 losstaande stappen met eigen checklist + tekstvak; de AI-chat-coach werkt met een intern 3-stappen-model dat qua telling en inhoud niet aansluit. Dit is geen directe UI-breuk (chat krijgt via `BuilderCanvas.tsx:286-289` wel de juiste `currentStepData.title/instruction/tip` per canvas-stap mee als context), maar de agent kan de leerling foutief adviseren welke canvas-stap "voltooid" is, en de scope-afbakening (canvas-stap 1, dé kern-competentie van deze missie) wordt in de briefing helemaal niet als eigen mijlpaal herkend.
  - **Voorstel:** breid de `STAP-VOLTOOIING`-sectie uit naar 4 STAP's die 1-op-1 matchen met de canvas-stappen:
    ```text
    ❌ Huidig — src/config/agents/year3.tsx:1975-1978
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling een wireframe of mockup heeft beschreven met kernfunctionaliteit, doelgroep en minimaal 3 schermen of functionaliteiten
    - Stuur ---STEP_COMPLETE:2--- als de leerling een werkende versie heeft gebouwd en beschreven hoe de kernfunctie werkt
    - Stuur ---STEP_COMPLETE:3--- als de leerling het prototype heeft getest met minimaal 2 personen, de feedback heeft samengevat en minimaal 1 concrete verbetering heeft doorgevoerd

    ✅ Voorgesteld
    STAP-VOLTOOIING:
    - Stuur ---STEP_COMPLETE:1--- als de leerling het idee heeft afgebakend: kernzin met gebruiker + probleem + kernfunctie, gebruikte tools, max 3 functies voor v1, en uitgelegd welke functies bewust worden uitgesteld
    - Stuur ---STEP_COMPLETE:2--- als de leerling een wireframe of mockup heeft beschreven met kernfunctionaliteit, doelgroep en minimaal 3 schermen of functionaliteiten
    - Stuur ---STEP_COMPLETE:3--- als de leerling een werkende versie heeft gebouwd en beschreven hoe de kernfunctie werkt
    - Stuur ---STEP_COMPLETE:4--- als de leerling het prototype heeft getest met minimaal 2 personen, de feedback heeft samengevat en minimaal 1 concrete verbetering heeft doorgevoerd
    ```
    Pas ook `WERKWIJZE` (`year3.tsx:1959-1964`, momenteel 5 punten voor 3 STAP's) en de losse `STAP 1/2/3`-beschrijvingen (`year3.tsx:1966-1968`) aan naar 4 stappen die de canvas-stapnamen volgen (scopen → ontwerpen → bouwen → testen).

### ❌ Blocking issues
- Geen (functioneel werkt de chat door — de context-injectie compenseert deels — maar de interne desync is een reëel risico voor onjuiste voortgangsfeedback aan de leerling, dus dit staat op de rand van blocking).

### SLO-fit oordeel
- **22A (Digitale producten):** sterk geraakt — canvas-stap "bouwen" + "testen-itereren" vragen een aantoonbaar werkend product met iteratie.
- **22B (Programmeren):** oppervlakkig-tot-sterk, afhankelijk van gekozen tool — de missie staat expliciet no-code/low-code toe (`prototype-developer.ts:12`), waardoor 22B niet bij elke leerling evenveel geraakt wordt. Geen fout, wel een didactische kanttekening.

### Score
8/9 criteria geslaagd · Bloom-balans: hoog (goede mix) · Aanbeveling: fix-eerst (STEP_COMPLETE-desync corrigeren vóór volgende deploy-cyclus)

---

## 🔧 Tech review

**Mission:** prototype-developer (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewrun; geen screenshots-map aangetroffen voor deze missie.

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** alle knoppen in engine hebben functionele `onClick` (`BuilderCanvas.tsx:107,148,165,304-311,319`; `StepInstructionPanel.tsx:147-148`) — geen dode knoppen.
- **A2 (Error states):** `LoadingScreen` tijdens config-import, `loadError`-state met terug-knop bij ontbrekende config (`BuilderCanvas.tsx:357-388`); empty-state in `PreviewPanel.tsx:58-68` ("Hier verschijnt jouw werk...").
- **A3 (TypeScript-discipline):** geen `any` of `@ts-ignore` in config of engine-bestanden die gelezen zijn; `BuilderCanvasConfig`/`BuilderStep` interfaces expliciet getypeerd (`BuilderCanvas.tsx:18-45`).
- **A4 (Imports via `@/*`):** `StudentAIChat` (`@/features/ai-chat/StudentAIChat`), `useMissionAutoSave` (`@/hooks/useMissionAutoSave`), `getMissionGoal` (`@/config/missionGoals`) — correcte alias-imports (`BuilderCanvas.tsx:6-8`).
- **A5 (Edge function calls):** deze missie roept zelf geen edge function direct aan; chat-flow loopt via `StudentAIChat` (gedeelde component, buiten scope van deze missie-review).
- **A6 (Restart-safe state):** `useMissionAutoSave<BuilderCanvasState>(config.missionId, initialState)` (`BuilderCanvas.tsx:69-72`) — voortgang persisteert per missie-id.
- **A7 (Security):** `PreviewPanel.tsx:11-18` sanitized HTML-preview strip `<script>`/`<iframe>`/`<object>`/`<embed>`/event-handlers/`javascript:`-URI's vóórdat het in een gesandboxte `srcDoc`-iframe (`sandbox=""`, CSP `default-src 'none'`) terechtkomt — al is `showHtmlPreview` alleen actief voor `website-bouwer` (`PreviewPanel.tsx:44`), dus n.v.t. voor `prototype-developer` zelf (`previewType: 'text-preview'` zonder HTML-render). Leerling-tekst wordt verder alleen als platte tekst gerenderd (`whitespace-pre-wrap`, geen `dangerouslySetInnerHTML`).

#### ⚠️ Aandachtspunten
- **STEP_COMPLETE-desync tussen agent-briefing en canvas** (zie didactiek-review voor volledige analyse en voorstel) — `src/config/agents/year3.tsx:1975-1978` vs `src/features/missions/templates/builder-canvas/configs/prototype-developer.ts:20-83`. Technisch gezien breekt niets (de chat blijft functioneren, `currentStep`-context wordt correct meegestuurd), maar de STAP-telling in de systemInstruction is functioneel inconsistent met de daadwerkelijke 4-stappen-canvas — risico op verkeerde AI-feedback over voortgang.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
- Niet uitgevoerd — geen dev-server in deze reviewrun. Geen bestaande screenshots-map voor `prototype-developer` aangetroffen (bevestigd: `find` op `screenshot*`-paden gaf geen resultaat).
- Bekend (niet herhalen): UI/UX-review 2026-06-30 (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:61-62`) noemt `prototype-developer` expliciet bij het shared-shell mobiele-clipping-issue (avatar/tekstballon + KEES-kaart bovenaan afgekapt op 390px) — dit is een platform-brede shared-shell-bug, geen missie-specifiek issue, niet opnieuw als losstaand punt gerapporteerd.

### Score
Static: 7/7 · Dynamic: n.v.t. (geen dev-server) · Aanbeveling: fix-eerst (zelfde STEP_COMPLETE-fix als didactiek-review; verder ship-ready)

---

## Samenvatting

| Rubric | Score (0-10) | Aanbeveling |
|---|---|---|
| Design | 9 | ship |
| Didactiek | 6 | fix-eerst |
| Tech | 7 | fix-eerst |

**triageScore = (10-9)×0.3 + (10-6)×0.4 + (10-7)×0.3 = 0.3 + 1.6 + 0.9 = 2.8**

**Kernbevinding:** de missie zelf (canvas-config, engine, security, responsive, copy) is solide en vrijwel foutloos. Het enige echte issue is een **inhoudelijke desync tussen de agent-briefing (`year3.tsx`, 3 STAP's) en de canvas (4 stappen)** — de STEP_COMPLETE-markers tellen en matchen niet 1-op-1 met wat de leerling in de UI doorloopt, waardoor canvas-stap 1 (scope/afbakening, de kern-competentie tegen feature creep) geen eigen mijlpaal heeft in de chat-coach. Dit is autoFixable (mechanische tekstwijziging in `systemInstruction`, geen architectuurwijziging) maar wel missie-specifiek en vereist een zorgvuldige herformulering (geen blinde 1-3 → 1-4 hernummering, want de inhoud moet ook per stap verschuiven).
