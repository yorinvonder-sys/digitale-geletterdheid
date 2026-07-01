# Missie-review: chatbot-trainer

**Datum:** 2026-07-02
**Wave:** 11 (verse review)
**TemplateType:** `agent-role` (geen templateRegistry-config; geleverd via `AiLab.tsx` full-screen preview)
**Curriculum-plek:** Leerjaar 1, Week 2
**SLO-claim:** `21D` (AI), `22A` (Digitale producten) · VSO: `18C`, `19A`

## Leveringspad (geverifieerd vóór review)

- Agent-rol-entry: `src/config/agents/year1.tsx:3540-3620` (systemInstruction + steps)
- Component: `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx` (1233 regels, volledig zelfstandig — geen config-file)
- Rendering: `src/features/ai-lab/AiLab.tsx:917-923` — `chatbot-trainer` wordt expliciet gerouteerd naar `<ChatbotTrainerPreview>` in de full-screen game-mode-tak (regel 914). **Niet dormant** — actief geleverd pad, geen chat-only rol die op een niet-bestaande template wacht.
- Registratie: `RoleId`-union (`src/types.ts:25`) + `AGENT_ROLE_IDS` (`src/config/agentRoleIds.ts:43`) beide aanwezig — geen TS2367-risico.

## sloKerndoelen-consistentiecheck

| Bron | sloKerndoelen | sloVsoKerndoelen |
|---|---|---|
| `slo-kerndoelen-mapping.ts:47` (AUTORITAIR) | `['21D', '22B']` | `['18C', '19A']` |
| `ProjectZeroDashboard.tsx:141` (dashboard) | `['21D', '22A']` | `['18C', '19A']` |

**MISMATCH gevonden:** mapping claimt `22B` (Programmeren), dashboard toont `22A` (Digitale producten). VSO-codes matchen wel.

De missie-inhoud (intent-classificatie via IF-THEN-regels, geen code schrijven) sluit inhoudelijk beter aan bij `22A` (een digitaal product bouwen/configureren) dan bij `22B` (Programmeren) — er wordt geen programmeertaal of syntax geoefend. `21D`/AI is voor beide bronnen correct en sterk bewezen (intent-training, confidence-scores, bias-reflectie).

## Voorstel: fix mapping naar dashboard-waarheid (autoFixable)

```ts
// ❌ Huidig — src/config/slo-kerndoelen-mapping.ts:47
{ id: 'chatbot-trainer', title: 'Chatbot Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22B'], sloVsoKerndoelen: ['18C', '19A'] },                // 22A→22B: IF-THEN regels = programmeerlogica

// ✅ Voorgesteld
{ id: 'chatbot-trainer', title: 'Chatbot Trainer', week: 2, yearGroup: 1, sloKerndoelen: ['21D', '22A'], sloVsoKerndoelen: ['18C', '19A'] },
```

**Reden voor de fix-richting (mapping → dashboard, niet andersom):** de missie bevat geen programmeeractiviteit (geen code, geen syntax, geen debugging van instructies) — leerlingen configureren intents/trainingsvoorbeelden/antwoorden via UI-formulieren. Dat is een digitaal product bouwen (`22A`), niet programmeren (`22B`). De inline comment in de mapping ("IF-THEN regels = programmeerlogica") beargumenteert het omgekeerde, maar IF-THEN-classificatie die de leerling nooit zelf schrijft (het is de onderliggende `classifyIntent`-functie, niet leerling-code) is geen programmeeroefening voor de leerling. De dashboard-waarde is didactisch correcter.

## 🎨 Design review

**Mission:** chatbot-trainer (agent-role, component-based)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Visual Precision Gate (statisch geoordeeld):** consistente CSS-var-thema (`CHATBOT_THEME_VARS`, regel 8-21) toegepast door de hele component — geen mix van hardcoded hex en var() binnen dezelfde laag. Alle 3 modi (intro/setup/training) delen hetzelfde kleurenpalet.
- **Criterium 1 (Tailwind tokens):** hybride patroon — layout/spacing via Tailwind-classes, kleur via component-scoped CSS custom properties (`var(--chatbot-*)`). Geen conflicterende `duck-*`/`lab-*` hex-literals; waar `duck-*` tokens wél direct gebruikt worden (regel 944-949, 1178-1180: `text-duck-ink/60`, `text-duck-acid`, `text-duck-error`) zijn dat de correcte bekende tokens (bg/bgLight/ink/acid/gray/error).
- **Criterium 6 (Framer Motion):** geen Framer Motion — gebruikt Tailwind `animate-in`/`slide-in-from-*`-utility classes (regel 677, 968, 1163, 1193) met duidelijke functionele waarde (state-transities, nieuwe berichten). Geen wrapper-spam.
- **Criterium 5 (responsive, statisch):** intro/setup-modi gebruiken `max-w-md`/`max-w-sm`/`grid-cols-1 md:grid-cols-2` — mobile-first correct opgebouwd.

### ⚠️ Aandachtspunten
- **Criterium 3 (knop-clarity) — delete-knop is een `<div>`, geen `<button>`**: `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx:955-960`
  - **Wat:** de intent-verwijderknop (Trash2-icon) is een `<div onClick={...}>` in plaats van een `<button>`.
  - **Waarom:** geen keyboard-focus, geen `role="button"`, screenreaders kondigen het niet aan als interactief element — toetsenbordgebruikers kunnen een intent niet verwijderen.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — regel 955-960
    <div
        onClick={(e) => deleteIntent(intent.id, e)}
        className="opacity-0 group-hover:opacity-100 hover:text-duck-error p-1"
    >
        <Trash2 size={12} />
    </div>

    // ✅ Voorgesteld
    <button
        type="button"
        onClick={(e) => deleteIntent(intent.id, e)}
        aria-label={`Verwijder intent ${intent.name}`}
        className="opacity-0 group-hover:opacity-100 hover:text-duck-error p-1"
    >
        <Trash2 size={12} />
    </button>
    ```
- **Criterium 7 (toegankelijkheid) — icon-only knoppen zonder `aria-label`**: geen enkele `aria-label` in het hele component (0 matches). Getroffen knoppen: delete-intent (regel 956, zie boven), share-knop (regel 871-876, heeft wél zichtbare tekst "Delen" dus lager risico), en de intro-terugknop (regel 726, heeft tekst "Terug" — ook lager risico). Het kritieke geval is de icon-only delete-knop.
  - **Voorstel:** zie snippet hierboven — `aria-label` toegevoegd in dezelfde fix.
- **Criterium 5 (responsive, dynamisch niet geverifieerd) — vaste breedtes in 3-koloms training-layout**: `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx:910` (`w-64` intent-lijst) en `:1143` (`w-80` test-chat), met `flex-1` middenpaneel. Geen `md:`/`lg:`-varianten voor deze drie kolommen.
  - **Wat:** de training-modus (hoofd-werkscherm) is een vaste 3-koloms flex-layout (`w-64` + `flex-1` + `w-80`) zonder responsive breakpoints.
  - **Waarom:** op mobiel (375px) is `w-64` (256px) + `w-80` (320px) = 576px alleen al aan zijkolommen — ruim boven de viewport-breedte. Zonder dynamische Chrome-plugin-verificatie (geen dev-server/screenshots beschikbaar deze run) is dit een sterk vermoeden van layout-breuk op mobiel, niet hard bewezen.
  - **Voorstel:** dit is een structureel probleem (3-koloms IDE-achtig paneel past niet op telefoonformaat) dat een responsive herontwerp vraagt — bv. tabs/accordion op mobiel i.p.v. zij-aan-zij kolommen. Buiten scope van een mechanische autofix; noteer als aandachtspunt voor een aparte design-taak, **niet autoFixable**.

### ❌ Blocking issues
- Geen. De delete-div-issue is een a11y-tekortkoming maar geen functionele blocker (muisgebruikers kunnen wel klikken); het responsive-vermoeden is niet dynamisch bevestigd.
- **Visual Precision Gate:** `UNVERIFIED` — geen dev-server/Chrome-plugin-sessie deze run, dus geen screenshot-bewijs voor alignment/overlap/text-fit/game-fit. Het vaste-breedtes-vermoeden hierboven blijft ongeverifieerd tot een dynamische pass.

### Score
6/8 criteria geslaagd (2 aandachtspunten, geen blockers) · Aanbeveling: **fix-eerst** (a11y-fix is triviaal; responsive-vermoeden verdient een losse dynamische verificatie-pass)

## 📚 Didactiek review

**Mission:** chatbot-trainer (agent-role, component-based)
**Curriculum-plek:** Leerjaar 1, Periode/Week 2
**SLO-claim:** `21D`, `22A` (na fix) — VSO `18C`, `19A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21D` en `22A` (na mapping-fix) zijn beide geldige regulier-VO-codes; `18C`/`19A` geldige VSO-codes.
- **Criterium 2 (SLO-fit):** `21D` (AI) sterk bewezen — leerlingen trainen daadwerkelijk een intent-classifier (trainingsvoorbeelden → confidence-score → matched intent, `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx:249-271`) en zien direct het effect van te weinig trainingsdata. `22A` sterk bewezen na fix — leerlingen bouwen een compleet digitaal product (chatbot met eigen naam/intents/antwoorden) via de "Vrije Keuze"-flow (regel 758-841).
- **Criterium 5 (leeftijds-passend vocabulary):** taal past bij leerjaar 1 (12-13 jaar) — "Wist je dat veel chatbots NIET slim zijn?" (systemInstruction), concrete voorbeelden (pizzeria, dierenwinkel), geen jargon zonder uitleg. `agents/year1.tsx:3577` legt IF-THEN expliciet uit met een alledaags "woordenzoekspel"-metafoor.
- **Criterium 7 (Bloom-taxonomie balans):** sterke mix — onthouden/begrijpen (intro-uitleg IF-THEN), toepassen (intents configureren), analyseren (test-resultaten interpreteren, waarom faalt een match), **creëren** (eigen chatbot-scenario ontwerpen via de "Vrije Keuze"-wizard, regel 398-442), en reflecteren op hoge orde via de eindconclusie ("Training Data & Bias", regel 900-903 — leerling koppelt eigen ervaring aan het abstracte concept "dataset-beperking").
- **Criterium 9 (VSO-mapping):** aanwezig en consistent (`18C`, `19A` in beide bronnen).

### ⚠️ Aandachtspunten
- **Criterium 3 (leerdoelen helder geformuleerd) — geen expliciete `learningObjectives`-array**: geen `learningObjectives`-veld gevonden in de agent-rol-entry of het component (agent-role missies gebruiken dit veld doorgaans niet — bevestigd door afwezigheid in `missionGoals.ts:98-104`, die wel een `primaryGoal` heeft).
  - **Wat:** `missionGoals.ts:98-104` heeft wel een impliciet leerdoel: `primaryGoal: 'Ik bouw en test chatbotregels die passende antwoorden geven op leerlingvragen.'` — dit ontbreekt aan een meetbaar actiewerkwoord-format zoals het rubric vraagt, maar dekt de kern functioneel.
  - **Waarom:** voor docenten die vooraf willen zien wat een leerling "kan" na de missie is de huidige formulering bruikbaar maar niet SMART-geformuleerd.
  - **Voorstel:** dit is een acceptabel patroon voor agent-role missies (het `missionGoals`-systeem dekt de functie van `learningObjectives` voor dit type). Geen actie nodig — noteer als "impliciet leerdoel via missionGoals, functioneel gedekt", niet als didactisch gat.
- **Criterium 2 (SLO-fit, mapping-mismatch)** — zie sectie hierboven (autoFixable-voorstel al gegeven).

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — leerling traint een echte (zij het simpele) intent-classifier en ervaart de kern-AI-concepten training/confidence/bias hands-on.
- **22A (Digitale producten, na fix):** sterk geraakt — leerling ontwerpt en bouwt een compleet, werkend digitaal product met eigen naam/scope/testcriteria.
- **22B (Programmeren, huidige mapping-waarde):** mismatch — geen programmeeractiviteit voor de leerling; de classificatielogica is voorgeprogrammeerd in het platform, niet iets wat de leerling schrijft.

### Score
5/5 relevante criteria geslaagd (1 mapping-mismatch, 1 acceptabel patroon genoteerd) · Bloom-balans: **hoog** (bereikt creëren + reflecteren, ongebruikelijk sterk voor leerjaar 1) · Aanbeveling: **ship na mapping-fix**

## 🔧 Tech review

**Mission:** chatbot-trainer (agent-role, component-based)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart deze run; geen `.ui-review`-screenshotmap voor chatbot-trainer aangetroffen en geen entry in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`.

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (knop-handlers):** alle 15+ `<button>`-elementen hebben functionele `onClick`. Eén klikbaar element is géén `<button>` (zie A1-aandachtspunt).
- **Criterium A2 (error states):** `startCustomScenario` valideert input met `alert()`-feedback (regel 403-406); test-flow heeft expliciete loading-indicator (`isTesting && !showResults`, regel 1021-1026) en lege-staat-tekst (regel 1155-1159, 1062-1065).
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `as any`, geen `@ts-ignore`/`@ts-expect-error` in het hele bestand. Alle interfaces expliciet gedefinieerd (`ChatbotPersistState`, `Intent`, `TestMessage`, `Scenario`, regel 43-94).
- **Criterium A4 (imports via alias):** alle imports gebruiken `@/*`-alias (regel 4-6), geen relatieve `../../`-paden.
- **Criterium A5 (edge function calls):** n.v.t. — component doet geen `supabase.functions.invoke` of AI-netwerkcalls; de intent-classificatie (`classifyIntent`, regel 249-271) is pure client-side string-matching, geen externe AI-call. Dit past bij het missie-doel (leerling ziet transparant hoe simpele rule-based matching werkt, zónder een "magische" LLM-blackbox).
- **Criterium A6 (restart-safe state):** component gebruikt geen `useMissionAutoSave` direct, maar heeft een eigen debounced `onSave`-callback (regel 346-360, 1.5s debounce) die staat doorgeeft aan de parent (`AiLab.tsx:922`, `onSave={handleMissionDataSave}`) — functioneel equivalent restart-safe pattern, consistent met hoe andere agent-role preview-componenten in dit bestand werken. Geen violatie.
- **Criterium A7 (security):** geen `dangerouslySetInnerHTML`; `systemInstruction` is server-side bepaald via de agent-rol-config (`agents/year1.tsx`), niet client-side gedefinieerd — bekend platformpatroon, geen nieuwe bevinding.

#### ⚠️ Aandachtspunten
- **Criterium A1 (dode/verkeerd-getypeerd interactief element):** zie Design review, Criterium 3 — `src/features/ai-lab/previews/ChatbotTrainerPreview.tsx:955-960`, delete-knop is `<div onClick>` i.p.v. `<button>`. Zelfde Voorstel-blok als in de design-sectie (één fix lost beide bevindingen op).
- **Criterium A6 (edge case in auto-save):** de `useEffect` op regel 346-360 heeft `onSave` in de dependency-array. Als de parent (`AiLab.tsx`) een nieuwe `handleMissionDataSave`-referentie doorgeeft bij elke render (geen `useCallback`), triggert dit de debounce-timer telkens opnieuw te resetten voordat hij afgaat — een potentiële "auto-save vuurt nooit af"-bug bij snelle parent re-renders. Niet geverifieerd binnen scope van dit component alleen (vereist AiLab.tsx-analyse); genoteerd als aandachtspunt, niet als bevestigde blocker.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server actief deze reviewrun. `Visual Precision Gate: UNVERIFIED`.

### Score
Static: 6/7 criteria geslaagd (1 aandachtspunt, 1 mogelijk-maar-ongeverifieerd edge case) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (a11y/button-fix triviaal; mapping-fix triviaal; responsive-vermoeden en auto-save-edge-case verdienen een dynamische pass vóór definitief ship-akkoord)

---

## Samenvatting

`chatbot-trainer` is een sterke, volledig zelfstandige agent-role missie met een ongebruikelijk hoge Bloom-balans voor leerjaar 1 (bereikt creëren + reflecteren via de bias/dataset-conclusie). Het enige harde, autoFixable probleem is de SLO-mapping-mismatch (`22B`→`22A`). De overige bevindingen zijn kleine a11y/tech-tweaks (delete-knop als `<div>`) en twee ongeverifieerde vermoedens (mobiele 3-koloms layout, auto-save re-render-edge-case) die een dynamische Chrome-plugin-pass vragen — niet mechanisch autoFixable binnen deze static review.
