# Review: ai-beleid-brainstorm — 2026-06-17

**Mission ID:** ai-beleid-brainstorm  
**Template type:** agent-role (custom preview component — AiBeleidBrainstormPreview)  
**Curriculum:** Leerjaar 1, Periode 2, Week 2  
**SLO-claim:** `21D`, `23C` (regulier) + `20B` (VSO)  
**Reviewer:** M4 batch-review-pipeline (Sonnet 4.6)  
**Screenshots:** Geen bestaande screenshots — dynamische visuele verificatie overgeslagen.

---

## Samenvatting

Deze missie is een unieke participatieve brainstorm-ervaring: leerlingen vullen een enquête in, delen een idee over AI-beleid in vier categorieën, en stemmen op elkaars voorstellen. De component is technisch solide met goede content-filtering, error states en voting-deduplicatie via Supabase RPC. De kernproblemen zijn: (1) een SLO-inconsistentie tussen de centrale mapping en de student-dashboard weergave (23B vs 21D), (2) ontbrekende expliciete leerdoelen in de config-entry, (3) beperkte Bloom-dekking (geen hogere orde dan begrijpen/evalueren), en (4) ontbrekende `aria-label` op icon-knoppen. Geen blocking-issues voor ship, maar drie `fix-eerst`-punten.

---

## 🎨 Design review

**Mission:** ai-beleid-brainstorm (agent-role, handcrafted custom preview)  
**Reviewer:** dgskills-design-reviewer (Sonnet)

### Visual Precision Gate

Status: **UNVERIFIED** — geen dev-server beschikbaar, geen Chrome-plugin screenshots. Statische code-analyse gedaan; dynamische bewijslast ontbreekt.

Statische observaties:
- Elke fase heeft een duidelijke `bg-gradient-to-br from-duck-acid via-white to-duck-ink` als background — consistent.
- De Browse-fase toont een leaderboard (top 3) + scrollbare lijst. Op mobiel (375px) kan de `grid-cols-2` categoriekaart-grid (fase `categories`) krap worden maar Tailwind `sm:grid-cols-2` is aanwezig — beperkt risico.
- `AnimatePresence` en `motion.div` zijn functioneel ingezet voor fase-overgangen en succes-feedback, niet als decoratieve wrapper-spam.

### ✅ Geslaagd

- **Criterium 1 (Tokens):** `AiBeleidBrainstormPreview.tsx` gebruikt uitsluitend `duck-*` tokens. Categoriekaarten gebruiken `duck-ink`, `duck-acid`, `duck-bg`, `duck-error` — consistent DUCK English design system. `src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx:75-116`
- **Criterium 2 (Layout):** N.v.t. — handcrafted, geen template-baseline.
- **Criterium 3 (Knop-clarity):** Alle `<button>`-elementen hebben tekst of icon + tekst labels. De "Afronden ✓"-knop heeft `disabled={!canComplete}` waardoor dode-knop-risico is afgedekt. `AiBeleidBrainstormPreview.tsx:607`
- **Criterium 5 (Responsive):** `min-h-full`, `max-w-2xl`, `w-full`, `grid-cols-1 sm:grid-cols-2` aanwezig. Geen vaste pixel-widths. `AiBeleidBrainstormPreview.tsx:263,431,436`
- **Criterium 6 (Framer Motion):** `AnimatePresence` bewaakt succes/submit transities (lines 499-582), `motion.div` heeft altijd `initial`/`animate` props. Geen wrapper-spam. `AiBeleidBrainstormPreview.tsx:501,512`

### ⚠️ Aandachtspunten

- **Criterium 1 — Legacy tokens in `visualPreview`:** De `visualPreview` JSX in de agent-config gebruikt `lab-coral` en `lab-teal` (4 keer op regels 3717, 3729, 3732, 3733). Die tokens bestaan als `lab.coral` en `lab.teal` in `tailwind.shared.js` (regels 25 en 39) — dus geen build-error. Wel inconsistent met de doelstijl DUCK English die de rest van de preview component gebruikt. De `visualPreview` is het kleine kaartje in de briefing-gallerij, niet de missie zelf.
  - **Wat:** 4 `from-lab-coral`, `to-lab-teal`, `border-lab-coral`, `text-lab-coral` in `visualPreview`.
  - **Waarom:** Visueel contrast met de rest van de mission-preview die duck-tokens gebruikt; bij toekomstige theme-migratie een onnodig fixpunt.
  - **Voorstel:** Migreer naar `from-duck-error to-duck-ink` (lab-coral = #D97848 ≈ duck-error = #ff3c21 qua oranje-gevoel) of een duck-acid variant. Kleine lokale fix, geen gedeelde component.
  - **File:** `src/config/agents/year1.tsx:3717-3733`

- **Criterium 7 (Toegankelijkheid) — ontbrekende aria-labels:** De stemknop (ThumbsUp icon + getal, `AiBeleidBrainstormPreview.tsx:675-686`) is een icon+getal-knop zonder `aria-label`. Screenreaders lezen "1" of "3" voor zonder context.
  - **Voorstel:** Voeg `aria-label={hasVoted ? 'Al gestemd' : 'Stem op dit idee'}` toe aan de stemknop.

- **Criterium 4 (Copy-lengte):** Introductietekst "Jouw mening telt! Help mee met het vormgeven van de AI-regels op school." (~14 woorden) — ruim binnen de 80-woorden grens voor leerjaar 1. Geen overschrijding.

### ❌ Blocking issues

Geen.

### Score

5/7 criteria geslaagd (C1 deels, C7 deels) · Visual Precision Gate: UNVERIFIED · Aanbeveling: **fix-eerst** (lab-token migratie + aria-label)

---

## 📚 Didactiek review

**Mission:** ai-beleid-brainstorm (agent-role, handcrafted)  
**Curriculum-plek:** Leerjaar 1, Periode 2  
**SLO-claim:** `['21D', '23C']` (regulier) + `['20B']` (VSO)  
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** `21D` (AI), `23C` (Maatschappij), `20B` (VSO) zijn alle geldige codes. `src/config/slo-kerndoelen-mapping.ts:51`
- **Criterium 2 (SLO-fit):**
  - `21D` (AI): leerlingen nadenken over wat AI kan/mag op school — substantieel geraakt.
  - `23C` (Maatschappij): democratisch AI-beleid vormen, publiek belang afwegen — substantieel geraakt.
  - `20B` (VSO): beleidsformulering toegankelijk gemaakt via categorieën en stemmen — passend.
- **Criterium 5 (Leeftijds-passend):** Toon is direct, motiverend, concreet. Categorieën zijn duidelijk (Regels/Mogelijkheden/Zorgen/Suggesties). B1-taalniveau aanwezig in UI en `systemInstruction`. `AiBeleidBrainstormPreview.tsx:75-116`, `year1.tsx:3737-3759`
- **Criterium 6 (Curriculum-plek):** Week 2, Periode 2, Leerjaar 1 — past na `ai-tekengame` (21D, patroonherkenning) en `verhalen-ontwerper` (21D, creatief). Beleidsreflectie als afsluiting van de AI-blok is logisch gesitueerd. `src/config/curriculum.ts:88`
- **Criterium 9 (Welzijn + inclusiviteit):** VSO-mapping aanwezig (`20B`). Content-filter aanwezig voor ongepaste invoer. Geen gevoelige zelfbeeldthema's. `AiBeleidBrainstormPreview.tsx:11-56`

### ⚠️ Aandachtspunten

- **Criterium 3 — Geen expliciete leerdoelen in config:** De agent-config entry (`year1.tsx:3704-3778`) heeft geen `learningObjectives` veld. De `missionGoals.ts` entry (`primaryGoal`) is aanwezig maar bevat alleen een taak-beschrijving, geen actiewerkwoord-gebaseerde leerdoelen. `steps[]` beschrijven fasen, niet leerdoelen.
  - **Wat:** Geen `learningObjectives: [...]` array met Bloom-compatible actiewerkwoorden.
  - **Waarom:** Leerkrachten en het platform kunnen geen toetsbare leeruitkomsten rapporteren.
  - **Voorstel-blok:**
    ```text
    ❌ Huidig — src/config/missionGoals.ts:129-136
    'ai-beleid-brainstorm': {
        primaryGoal: 'Ik bedenk bruikbare AI-afspraken voor school en onderbouw waarom ze nodig zijn.',
        criteria: { type: 'component-complete', description: 'Je levert voorstellen, stemt of kiest, en legt je keuze uit.' },
        evidence: 'Je hebt minimaal twee concrete AI-regels met reden en schoolsituatie.',
    }

    ✅ Voorgesteld — voeg toe als comment/documentatie (leerdoelen zijn geen veld in MissionGoal type):
    // Impliciete leerdoelen voor ai-beleid-brainstorm (leerjaar 1, SLO 21D + 23C):
    // 1. De leerling benoemt minimaal één voordeel en één risico van AI-gebruik op school.
    // 2. De leerling formuleert een concrete schoolregel voor AI (actiewerkwoord: formuleert).
    // 3. De leerling evalueert ideeën van anderen door te stemmen en zijn keuze toe te lichten.
    ```

- **Criterium 7 (Bloom-balans):** De missie bereikt voornamelijk Bloom-niveau 2 (begrijpen) en 3 (toepassen via ideeën indienen). Stemmen op anderen bevat een impliciete evaluatie (niveau 5) maar zonder expliciete redeneer-vraag ("waarom stem je hierop?"). Het evidence-criterium in `missionGoals.ts` ("legt je keuze uit") impliceert redeneren maar de UI dwingt dit niet af.
  - **Wat:** De `browse`-fase heeft geen verplicht reflectiemoment bij stemmen.
  - **Waarom:** Leerlingen kunnen stemmen op trending ideeën zonder nadenken ("XP-farming" via klikken).
  - **Voorstel:** Voeg een optionele (niet blokkerend) reflectievraag toe na stemmen: "Waarom vind jij dit een goed idee? (optioneel)". Dit verhoogt Bloom-niveau zonder de flow te blokkeren.

- **Criterium 8 (AI-as-copilot):** De `systemInstruction` begint correct met uitleg over de custom component, maar de fallback-chat-instructie (lines 3742-3751) werkt als een antwoordenmachine: de AI legt uit hoe de missie werkt in plaats van scaffold-vragen te stellen. Bij toevallige chat-start ("Als er toch een chat gestart wordt") geeft de AI een script-antwoord zonder challenge.
  - **Wat:** Fallback-instructie vermeldt geen 3-stappen-methode (erkenning → uitleg → challenge). `year1.tsx:3742-3751`
  - **Waarom:** Leerling die toch chat opent krijgt geen didactische scaffolding.
  - **Risico:** Laag (custom preview neemt bijna altijd over), maar bij technisch falen is de fallback-chat didactisch zwak.

### ❌ Blocking issues

Geen.

### SLO-fit oordeel

- **21D (AI):** Sterk geraakt — leerling denkt na over wat AI mag/kan op school, formuleert regels. `AiBeleidBrainstormPreview.tsx:75-116`
- **23C (Maatschappij):** Sterk geraakt — democratisch stemproces, publiek belang, beleidsvorming. `AiBeleidBrainstormPreview.tsx:589-693`
- **20B (VSO):** Adequaat — beleidsformulering via categorieën toegankelijk voor VSO.

**SLO-inconsistentie (WARNING):** `ProjectZeroDashboard.tsx:142` vermeldt `sloKerndoelen: ['23B', '23C']` (inclusief 23B = Digitaal welzijn), terwijl de centrale `slo-kerndoelen-mapping.ts:51` `['21D', '23C']` heeft (met expliciete comment "23B→21D"). Dit is een data-inconsistentie die de student-dashboard incorrect informeert.

**Voorstel-blok:**
```text
❌ Huidig — src/features/student/ProjectZeroDashboard.tsx:142
sloKerndoelen: ['23B', '23C']

✅ Voorgesteld
sloKerndoelen: ['21D', '23C']
```

### Score

6/9 criteria geslaagd · Bloom-balans: laag-medium (niveau 2-3, weinig niveau 4-5) · Aanbeveling: **fix-eerst** (SLO-inconsistentie is data-fout; Bloom-verbetering is aanbevolen)

---

## 🔧 Tech review

**Mission:** ai-beleid-brainstorm (agent-role, handcrafted custom preview)  
**Reviewer:** dgskills-tech-reviewer (Sonnet)  
**Dynamic verificatie:** Overgeslagen — geen dev-server beschikbaar.

### Static analyse

#### ✅ Geslaagd

- **A1 (Knop-handlers):** Alle knoppen hebben functionele `onClick` handlers. De "Afronden"-knop is disabled wanneer `!canComplete`. De stemknop is disabled na stemmen (`disabled={hasVoted}`). `AiBeleidBrainstormPreview.tsx:562-578, 675-686`
- **A2 (Error states):** `contentError`, `surveyError`, `submitError` states aanwezig en zichtbaar als rode `duck-error`-banners. `loading` state aanwezig tijdens `loadIdeeen()`. Empty-state getoond als `ideeen.length === 0`. `AiBeleidBrainstormPreview.tsx:144-147, 646-651`
- **A3 (TypeScript-discipline):** Geen `any` types in component zelf. Interface `AiBeleidBrainstormPreviewProps` correct gedefinieerd. `AiBeleidBrainstormPreview.tsx:65-73`
- **A4 (Imports via `@/*`):** Alle imports gebruiken `@/services/teacherService`, `@/types`, `@/features/missions/shared/MissionConclusion`. `AiBeleidBrainstormPreview.tsx:4-6`
- **A5 (Edge function calls):** Geen directe `supabase.functions.invoke` in dit component — service-laag (`teacherService.ts`) wrrapt alle Supabase-calls met try/catch. `teacherService.ts:558-576, 579-626`
- **A7 (Security):** Content-filter aanwezig met `BLOCKED_WORDS` + `BLOCKED_PHRASES` lists en regex-check vóór submit. `dangerouslySetInnerHTML` niet gebruikt. Idee-tekst wordt geescaped via React. `AiBeleidBrainstormPreview.tsx:11-56, 178-185`

#### ⚠️ Aandachtspunten

- **A6 (Restart-safe state):** Geen `useMissionAutoSave` patroon. Component gebruikt alleen `localStorage` (key `ai_beleid_participated_${user.uid}`) om bijdrage-status te onthouden. Ideeën-data wordt bij reload opnieuw gefetcht (correct). Echter: `surveyData` state, `selectedCategory`, `ideeText`, en `phase` worden bij refresh gereset.
  - **Wat:** Als leerling halverwege de survey refresht, begint hij opnieuw bij `intro` (tenzij al submitted en in localStorage).
  - **Risico:** Laag — de missie is relatief kort en de content-filter geeft duidelijke feedback. Geen XP-verlies bij refresh.
  - **Voorstel:** Gebruik `sessionStorage` voor `surveyData` en `phase` zodat in-progress state de paginarefresh overleeft binnen dezelfde sessie. Niet kritiek.

- **A3 — `any` in `stemOpIdee` RPC-return:** `teacherService.ts:641` bevat `const result = data as Record<string, any>`. Dit is in `teacherService.ts`, niet in de whitelist, maar is de service die door de component wordt aangeroepen.
  - **Wat:** `as Record<string, any>` is een type-escape rond Supabase RPC-response.
  - **Risico:** Minimaal — RPC-resultaat wordt alleen op `.success` gecheckt.
  - **Voorstel:** Definieer `type VoteResult = { success: boolean }` en cast naar dat type. Niet in whitelist → ESCALEER (technisch schoonmaak in teacherService.ts).

- **Studentnaam niet opgeslagen bij idee-submit:** `submitAiBeleidIdee` in `teacherService.ts:558-576` slaat `student_name` niet op in de `ai_beleid_feedback` tabel (zit niet in het insert-object). De component geeft `studentName: user.displayName || 'Anoniem'` mee in de aanroep, maar `submitAiBeleidIdee` negeert dit veld. Data is later niet herleidbaar naar de student voor teacher-rapportage.
  - **File:** `src/services/teacherService.ts:558-576` (buiten whitelist — ESCALEER)
  - **Impact:** Teacher-dashboard kan niet zien welke leerling welk idee heeft ingediend — beperkte rapportage-waarde.

#### ❌ Blocking issues

Geen.

### Dynamic verificatie

Niet uitgevoerd — DGSkills SPA is state-based (geen URL per missie). Multi-viewport visuele verificatie vereist een dev-preview route of handmatige sessie.

### Score

Static: 6/7 · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (SLO-inconsistentie in dashboard + aria-label; studentnaam-opslag en restart-state als follow-up)

---

## Escalatie-lijst

1. **SLO-inconsistentie in ProjectZeroDashboard** (`src/features/student/ProjectZeroDashboard.tsx:142`): `23B` moet `21D` zijn. Dit is een data-fout die leerlingen en docenten verkeerd informeert. Autofix is mogelijk in `ProjectZeroDashboard.tsx` maar dat staat BUITEN de whitelist voor deze missie → ESCALEREN.

2. **`studentName` niet opgeslagen in `ai_beleid_feedback`** (`src/services/teacherService.ts:562-569`): Teacher-rapportage-gap. Buiten whitelist → ESCALEREN.

3. **`any` type in `stemOpIdee` RPC** (`src/services/teacherService.ts:641`): TypeScript-kwaliteitsverbetering. Buiten whitelist → ESCALEREN.

---

## Autofix-kandidaten (binnen whitelist)

### Fix 1: lab-tokens → duck-tokens in visualPreview

**File:** `src/config/agents/year1.tsx`  
**Regels:** 3717, 3729, 3732, 3733

```tsx
// ❌ Huidig — year1.tsx:3717
<div className="w-full h-full bg-gradient-to-br from-lab-coral to-lab-teal flex flex-col items-center justify-center relative overflow-hidden p-4">

// ✅ Voorgesteld
<div className="w-full h-full bg-gradient-to-br from-duck-error to-duck-ink flex flex-col items-center justify-center relative overflow-hidden p-4">
```

```tsx
// ❌ Huidig — year1.tsx:3729
<div className="w-20 h-20 bg-gradient-to-br from-lab-coral to-lab-teal rounded-2xl flex items-center justify-center shadow-xl mb-4 relative z-10">

// ✅ Voorgesteld
<div className="w-20 h-20 bg-gradient-to-br from-duck-error to-duck-ink rounded-2xl flex items-center justify-center shadow-xl mb-4 relative z-10">
```

```tsx
// ❌ Huidig — year1.tsx:3732
<div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-lab-coral relative z-10">
    <p className="text-lab-coral font-bold text-sm">Jouw stem telt!</p>

// ✅ Voorgesteld
<div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-duck-error relative z-10">
    <p className="text-duck-error font-bold text-sm">Jouw stem telt!</p>
```

> Let op: `lab-coral` is #D97848 (oranje-bruin), `duck-error` is #ff3c21 (rood-oranje). Visueel verwant maar niet identiek. Als kleurverschil ongewenst is, gebruik dan `from-[#D97848]` als inline-override — maar overleg met Yorin. Hex-literals in `visualPreview` (niet in component) zijn hier acceptabel omdat de rendering op raw hex-waarden rekent via style-prop, niet via token-naam.

**Belangrijk:** Check EERST of `color: '#ff3c21'` (line 3709) op dezelfde manier als raw waarde in een `style={{}}` wordt doorgegeven door de gedeelde component (`MissionBriefing.tsx`) — als dat zo is, is de hele color-aanpak intentioneel en moet ook de `visualPreview` legacy tokens als raw-backup behouden. Beperkt risico, maar verifieer voor autofix.

### Fix 2: aria-label op stemknop

**File:** `src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx`  
**Regel:** 675

```tsx
// ❌ Huidig — AiBeleidBrainstormPreview.tsx:675
<button
    onClick={() => handleVote(idee.id!)}
    disabled={hasVoted}
    className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold transition-all ${hasVoted
        ? 'bg-duck-acid text-duck-ink'
        : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-acid hover:text-duck-ink'
        }`}
>
    <ThumbsUp size={16} />
    {idee.stemmen || 0}
</button>

// ✅ Voorgesteld
<button
    onClick={() => handleVote(idee.id!)}
    disabled={hasVoted}
    aria-label={hasVoted ? 'Al gestemd' : `Stem op dit idee (${idee.stemmen || 0} stemmen)`}
    className={`flex items-center gap-1 px-3 py-2 rounded-full font-bold transition-all ${hasVoted
        ? 'bg-duck-acid text-duck-ink'
        : 'bg-duck-bg text-duck-ink/60 hover:bg-duck-acid hover:text-duck-ink'
        }`}
>
    <ThumbsUp size={16} />
    {idee.stemmen || 0}
</button>
```

---

## Verdikt

**fix-eerst** — geen blocking-issues, maar twee lokale autofixes (aria-label + lab-tokens in visualPreview) zijn snel uitvoerbaar, en de SLO-inconsistentie in ProjectZeroDashboard (`23B` → `21D`) is een data-fout die leerlingen verkeerd informeert en via escalatie moet worden gefixed.
