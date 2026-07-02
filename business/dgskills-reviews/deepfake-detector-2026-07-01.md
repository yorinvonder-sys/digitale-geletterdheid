# Missie-review: deepfake-detector (wave 8, verse review)

**Datum:** 2026-07-01
**TemplateType:** dedicated (`src/features/missions/DeepfakeDetectorMission.tsx`, 684 regels)
**Curriculum-plek:** Leerjaar 1, Periode 2, week 3
**SLO-claim (mapping):** `21B, 21D, 23A, 23C` · VSO: `18B, 18C, 20A`
**SLO-claim (dashboard):** `21B, 23A, 23C` — **mist 21D**

---

## 🎨 Design review

**Mission:** deepfake-detector (dedicated)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** consequent `duck-*` tokens (bg, ink, acid, gray, error) door heel het component, geen hex-literals — `src/features/missions/DeepfakeDetectorMission.tsx:219-683`
- **Criterium 3 (Knop-clarity):** alle knoppen hebben label + icon; icon-only chat-knop heeft `aria-label` — `:479, :516`
- **Criterium 6 (Framer Motion):** geen Framer Motion, alleen Tailwind `animate-in`/`animate-pulse`/`animate-bounce` — functioneel, geen wrapper-spam
- **Criterium 7 (Toegankelijkheid basis):** progressbar heeft `role="progressbar"` + `aria-valuenow`/`aria-valuemax`/`aria-label` (`:526-531`); result-banner gebruikt icon (Check/X) + tekst, niet alleen kleur (`:614-637`)

### ⚠️ Aandachtspunten
- **Criterium 4 (Copy-lengte)**: intro-description in `IntroScreen`-call is kort genoeg (~45 woorden), maar challenge-content varieert sterk in lengte — `DeepfakeDetectorMission.tsx:73, 143, 159` (kort) vs geen probleem gevonden dat >60 woorden overschrijdt voor leerjaar 1. Geen fail.
- **Criterium 7 (kleurcontrast)**: herhaald patroon `text-duck-ink/60` op `bg-duck-bg`/`bg-white` — visueel waarschijnlijk voldoende contrast (donkere ink op lichte bg), maar niet dynamisch geverifieerd (geen dev-server/screenshots in deze wave).
  - **Wat:** meerdere secundaire tekst-elementen gebruiken 60%-opacity ink.
  - **Waarom:** bij lage schermhelderheid kan leesbaarheid dalen voor sommige leerlingen.
  - **Voorstel:** geen actie nodig tenzij een screenshot-audit een concreet contrast-issue toont; patroon is consistent met andere `duck-*`-gemigreerde missies.

### ❌ Blocking issues
Geen.

**Visual Precision Gate:** niet dynamisch geverifieerd — geen screenshots-map aanwezig voor deze missie in `.ui-review/` en geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde 0 hits op). Statisch oordeel: layout gebruikt responsive-vriendelijke patronen (`max-w-2xl mx-auto`, `grid grid-cols-2`, sticky header), geen vaste pixel-widths. Markeer als **unverified** conform skill-instructie.

### Score
4/5 criteria hard geslaagd (criterium 2 n.v.t. voor dedicated) · Aanbeveling: **ship** (visual precision gate blijft open als vervolgtaak, niet blocking voor deze content-review)

---

## 📚 Didactiek review

**Mission:** deepfake-detector (dedicated)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** `21B, 21D, 23A, 23C` (mapping) · VSO: `18B, 18C, 20A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** alle 4 codes (`21B` Media & Informatie, `21D` AI, `23A` Veiligheid & privacy, `23C` Maatschappij) zijn geldige regulier-VO codes; VSO-codes (`18B, 18C, 20A`) zijn geldig — `src/config/slo-kerndoelen-mapping.ts:67`
- **Criterium 2 (SLO-fit):** sterk geraakt voor `21B` (media-analyse van 9 challenges) en `21D` (AI-herkenning is de kern van de missie); `23A` en `23C` geraakt via het actieplan/tips (STOP-CHECK-PRAAT-MELD-WEET in systemInstruction) en de maatschappelijke framing (illegaliteit onder AI Act)
- **Criterium 3 (Leerdoelen helder):** `MISSION_GOAL.primaryGoal` = "Ik herken deepfake-signalen in beeld, tekst en claims en maak een kort actieplan tegen misleiding" — concreet, actiewerkwoord, meetbaar via `criteria.min: 3` — `DeepfakeDetectorMission.tsx:38-45`
- **Criterium 8 (AI-as-copilot):** systemInstruction volgt 3-stappenmethode (erkenning/uitleg/challenge), heeft XP-farming-detectie, welzijnsprotocol, en AI geeft nooit het antwoord vóór de leerling gokt — `supabase/functions/_shared/systemInstructions.ts:36`
- **Criterium 9 (VSO):** `vsoProfile === 'dagbesteding'` triggert altijd-aan hints + vereenvoudigde `challengeQuestionVso` per challenge — `DeepfakeDetectorMission.tsx:275, 312, 664-666`

### ⚠️ Aandachtspunten
- **Criterium 1/SLO-fit — mismatch tussen mapping en dashboard**: `src/config/slo-kerndoelen-mapping.ts:67` claimt `sloKerndoelen: ['21B', '21D', '23A', '23C']` (4 codes), maar `src/features/student/ProjectZeroDashboard.tsx:150` toont de leerling/docent `sloKerndoelen: ['21B', '23A', '23C']` — **`21D` (AI) ontbreekt in het dashboard**, terwijl AI-herkenning het hoofddoel van de missie is.
  - **Wat:** de autoritaire SLO-mapping en de leerling-zichtbare dashboard-entry zijn niet gelijk.
  - **Waarom:** docenten die op SLO-dekking rapporteren aan ouders/inspectie zien via het dashboard een onvolledig beeld — juist het kerndoel dat deze missie het sterkst raakt (AI) ontbreekt daar.
  - **Voorstel (autoFixable):**

    ```tsx
    // ❌ Huidig — src/features/student/ProjectZeroDashboard.tsx:150
    { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', icon: <Eye size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('deepfake-detector'), sloKerndoelen: ['21B', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },

    // ✅ Voorgesteld
    { id: 'deepfake-detector', title: 'Deepfake Detector', description: 'Spot AI-gegenereerde content en nepnieuws.', icon: <Eye size={40} />, number: '02', status: 'available', info: getMissionTooltipInfo('deepfake-detector'), sloKerndoelen: ['21B', '21D', '23A', '23C'], sloVsoKerndoelen: ['18B', '18C', '20A'] },
    ```

- **Criterium 8 (AI-as-copilot) — systemInstruction-content wijkt af van UI-content**: de `deepfake-detector` systemInstruction (`supabase/functions/_shared/systemInstructions.ts:36`) beschrijft "5 cases" met eigen content (perfect portret, NOS-Nieuws.net nepbericht, voicebericht-oplichting, politicus-lipsync, schoolfoto-manipulatie) — géén van deze 5 cases komt overeen met de 9 `CHALLENGES` in het component (hond-met-7-poten, kunstwerk-oorbel, chatbot-Lisa, Harvard-waterclaim, straatfoto-tekst, essay-fragment, opa-social-post, landschapsfoto).
  - **Wat:** de AI-copiloot ("Vraag hulp"-knop) presenteert bij het eerste bericht een compleet ander scenario dan wat de leerling in de challenge-kaart voor zich ziet.
  - **Waarom:** verwarrend voor de leerling — de AI-chat context (`context.currentChallenge`, `:546-551`) stuurt wél de actuele challenge-titel/inhoud mee, dus de AI *kan* contextueel reageren, maar de systemInstruction's eigen "EERSTE BERICHT" en "DE 5 CASES"-script overschrijven dat bij het openen van de chat met een niet-matchende case-set. Een leerling die op "START" typt voor Case 1 (het portret) krijgt een ander verhaal te zien dan de challenge-kaart toont.
  - **Voorstel:** dit is een grotere content-synchronisatie-taak (systemInstruction herschrijven om de 9 bestaande `CHALLENGES` te gebruiken, of het component reduceren naar de 5 systemInstruction-cases) — buiten scope van deze review om zelf te fixen; markeer voor eigenaar-beslissing. Kortetermijn-mitigatie: systemInstruction kan het "DE 5 CASES"-blok laten vervallen en volledig op de meegegeven `context.currentChallenge` vertrouwen (die al aanwezig is), zodat de AI altijd over de challenge praat die de leerling ziet i.p.v. een eigen vaste case-set.

### ❌ Blocking issues
Geen — beide bevindingen zijn "fix-eerst", niet "ship-blocking" (missie functioneert, SLO-claim is inhoudelijk correct, alleen niet overal consistent weergegeven).

### SLO-fit oordeel
- **21B (Media & Informatie):** sterk geraakt — 9 challenges trainen media-analyse op afbeelding/tekst/claim
- **21D (AI):** sterk geraakt — kerndoel van de missie (AI-detectie), maar mist in dashboard-weergave
- **23A (Veiligheid & privacy):** geraakt via actieplan (STOP-CHECK-PRAAT-MELD) in systemInstruction, oppervlakkiger in de losstaande component-UI zelf
- **23C (Maatschappij):** geraakt via "WEET — In de EU is het illegaal (AI Act)" in systemInstruction en de maatschappelijke framing van misleiding

### Score
5/6 criteria geslaagd (criterium 6 curriculum-plek: logisch, geen bevindingen) · Bloom-balans: **medium** (herkennen + classificeren + korte reflectievraag per challenge = toepassen/analyseren-niveau, past bij leerjaar 1) · Aanbeveling: **fix-eerst** (SLO-dashboard-sync is autoFixable, 1 regel)

---

## 🔧 Tech review

**Mission:** deepfake-detector (dedicated)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze wave, geen screenshots-directory aanwezig voor deze missie

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** alle knoppen hebben functionele `onClick` — back-knop, hint-knop, antwoord-knoppen, chat-knop, next-knop, level-complete-knop — geen dode knoppen gevonden
- **A3 (TypeScript-discipline):** geen `any`, geen `as any`, geen `@ts-ignore`/`@ts-expect-error` in het hele bestand (684 regels); expliciete interfaces voor `DeepfakeDetectorState`, `Props`, `DetectionChallenge` — `:18-63`
- **A4 (Imports via alias):** alle imports gebruiken `@/`-alias (`@/types`, `@/hooks/useMissionAutoSave`, `@/features/ai-chat/StudentAIChat`), geen relatieve `../../`-paden — `:12-16`
- **A6 (Restart-safe state):** gebruikt `useMissionAutoSave` correct voor alle progress-relevante state (level, index, score, streak, correctAnswers, screen-flags) — transient UI-state (answer, showFeedback, showHints, isChatOpen) blijft terecht buiten de save — `:256-276`
- **A7 (Security):** geen `dangerouslySetInnerHTML`; `systemInstruction` wordt server-side bepaald via `roleId="deepfake-detector"` doorgegeven aan `StudentAIChat`, niet client-side gedefinieerd — `:542`; geen `<img>`-tags dus geen ontbrekende `alt`-attributen (content is tekstueel beschreven, geen echte afbeeldingen/assets die kunnen ontbreken)
- **Registratie-consistentie:** `deepfake-detector` correct geregistreerd in `RoleId`-union (`src/types.ts:27`) én `AGENT_ROLE_IDS`-array (`src/config/agentRoleIds.ts:31`) — geen TS2367-risico; asset `public/assets/agents/social_safeguard.webp` (gebruikt door de agent-role-entry in `year1.tsx:2604`, niet door het component zelf) bestaat op schijf (54KB)

#### ⚠️ Aandachtspunten
- **A5 (Edge function calls)**: het dedicated component zelf roept geen `supabase.functions.invoke` rechtstreeks aan — dat verloopt via `StudentAIChat` (gedeelde component, buiten scope van deze missie-specifieke review). Geen bevinding hier, want de missie delegeert correct aan het gedeelde AI-chat-component in plaats van een eigen fetch-implementatie te bouwen.
- **Content-duplicatie-risico**: `CHALLENGES`-array (9 items, ~130 regels) staat volledig inline in het component-bestand. Geen aparte config — verwacht en toegestaan voor `templateType: dedicated`, maar betekent dat een toekomstige content-wijziging (bv. syncen met de systemInstruction-cases, zie didactiek-bevinding) een code-wijziging vereist, geen config-only wijziging.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — dynamic verificatie niet uitgevoerd — geen dev-server. `docs/audits/student-missions-ui-ux-review-2026-06-30.md` bevat 0 vermeldingen van `deepfake-detector`, dus geen eerder visueel bewijs beschikbaar om op terug te vallen.

### Score
Static: 5/5 criteria geslaagd · Dynamic: n.v.t. · Aanbeveling: **ship** (visual/dynamic verificatie blijft open als vervolgtaak)

---

## Samenvatting voor orchestrator

| Rubric | Score | Aanbeveling |
|---|---|---|
| Design | 4/5 | ship |
| Didactiek | 5/6 | fix-eerst |
| Tech | 5/5 | ship |

**Triage-prioriteit:** de SLO-dashboard-mismatch (`21D` ontbrengt in `ProjectZeroDashboard.tsx:150`) is de enige autoFixable bevinding — 1 regel, geen risico. De systemInstruction/UI content-mismatch (5 systeeminstructie-cases vs 9 component-challenges) is een grotere, niet-triviale content-synchronisatie die een eigenaarsbeslissing vereist (welke case-set wint), dus expliciet niet automatisch gefixt in deze review.

**Platform-brede bekende context (niet missie-uniek, kort genoemd):** dormante-chat-rol-beslispunt is n.v.t. hier — `deepfake-detector` heeft een actieve, functionerende chat-integratie (`enableChat`-equivalent via directe `StudentAIChat`-render, niet dormant). `systemInstruction` client-side patroon is n.v.t. — deze missie doet het al correct (server-side via roleId).
