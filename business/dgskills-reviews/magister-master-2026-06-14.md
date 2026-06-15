# Missie-review: Magister Meester

**Mission ID:** magister-master
**Template:** tool-guide
**Curriculum-plek:** Leerjaar 1, Periode 1
**Datum:** 2026-06-14
**Reviewer-pipeline:** dgskills-mission-review v1.0

---

## 🎨 Design review

**Mission:** magister-master (tool-guide)
**Reviewer:** dgskills-design-reviewer (Sonnet)

---

### Visual Precision Gate

**Status: BLOCKING (gedeeltelijk bevestigd via DOM-inspectie)**

Dynamische Chrome-plugin screenshot-verificatie (multi-viewport) niet uitgevoerd — DGSkills SPA is state-based zonder URL per missie. Echter: de tech-reviewer heeft via de `/dev/mission-preview`-route en JavaScript DOM-inspecties dynamisch bevestigd dat de `duck-coral`, `duck-muted`, `duck-line` en `duck-creamDeep` tokens renderen als transparant of fallback-kleur. De stap-teller-dot (primaire voortgangsindicator) is onzichtbaar. Visuele volledigheid van intro/mid-flow/eindstaat is niet via screenshots onderbouwd.

**Oordeel: fix-eerst** — token-bug maakt de UI visueel gebroken vóór enig viewport-bewijs.

---

### ✅ Geslaagd

- **Criterium 4 — Copy-lengte:** `introDescription` = 23 woorden (<80), alle stap-instructies 16–19 woorden (<60). Ruim binnen normen voor leerjaar 1. — `magister-master.ts:8–9,32,57,82,95`
- **Criterium 6 — Framer Motion:** Geen `motion.*` of `AnimatePresence` in engine. Geen animatieproblemen. — `ToolGuide.tsx` volledig
- **Criterium 2 — Layout consistentie (template-baseline):** Magister-master volgt exact de stap-structuur van baseline cloud-commander: `introDescription` → `introFeatures` → stappen met `checklistItems` + `tip` + optioneel `verificationQuestion` + `takeaways`. Container-pattern (`max-w-md`, `space-y-2`, `p-4`, `rounded-2xl`) identiek. Geen structurele afwijkingen. — `magister-master.ts` vs `cloud-commander.ts`
- **Criterium 7 — Toegankelijkheid (basis, deels):** Klikbare items en CTA gebruiken `<button>` met `focus-visible:ring-2`. Terug-knop heeft `aria-label="Terug"`. — `ToolGuide.tsx:234,280,407`

---

### ⚠️ Aandachtspunten

- **Criterium 7 — Fout-feedback enkel via kleur (borderline):** Bij verkeerd antwoord is de indicator `bg-duck-acid/20` (neon-geel) + `!`-symbool. 12-jarigen associëren neon-geel niet met "fout". — `ToolGuide.tsx:389`
  - **Wat:** Fout-feedbackstate gebruikt neon-geel als primaire kleurindicator; rood/oranje is convenioneel voor fout.
  - **Waarom:** Kan verwarrend zijn voor leerlingen die standaard UI-conventies gewend zijn.
  - **Voorstel:** Vervang `bg-duck-acid/20 border border-duck-acid/50` door `bg-duck-error/10 border border-duck-error/30` voor de fout-state.

- **Criterium 5 — CompletionScreen max-w-lg vs max-w-md:** Eindscherm gebruikt `max-w-lg` terwijl intro/stappen `max-w-md` gebruiken — kleine layout-breuk in eindstaat. — `ToolGuide.tsx:543`
  - **Voorstel:** Stel `max-w-md` in op `CompletionScreen` voor consistente breedte door de hele flow.

---

### ❌ Blocking issues

**[ENGINE-BREED — raakt alle 5 LJ1-P1 ToolGuide-missies]**

**BLOCKING-D1 — Ontbrekende duck-namespace tokens**

`ToolGuide.tsx`, `IntroScreen.tsx` en `CompletionScreen.tsx` gebruiken `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep` — tokens die **niet bestaan** in de `duck`-namespace van `tailwind.shared.js`. De `duck`-namespace definieert alleen: `bg`, `bgLight`, `ink`, `acid`, `gray`, `error`.

Gevolg: stap-teller-dot transparant, checklist-headers kleurloos, verificatievraag-labels onzichtbaar, teacher-check-blok zonder achtergrond, card-borders onzichtbaar.

```tsx
// ❌ Huidig — ToolGuide.tsx:374
<button className="bg-duck-coral/10 hover:bg-duck-coral/20 text-duck-coral border border-duck-coral/20 ...">
  Controleer antwoord
</button>

// ✅ Voorgesteld (Optie A — token-uitbreiding in tailwind.shared.js)
// Voeg toe aan duck-namespace in tailwind.shared.js:
coral: '#D97848',
muted: '#445865',
line: '#E7D8BD',
creamDeep: '#F3E4CB',
```

Dynamisch bevestigd door tech-reviewer: `bg-duck-coral → rgba(0,0,0,0)`, `text-duck-coral → rgb(32,32,35)`.

**BLOCKING-D2 — Focus-ring werkt niet (WCAG 2.1 AA)**

`focus-visible:ring-duck-coral` (regels 234, 342, 374) rendert als geen ring — `duck-coral` bestaat niet. Toetsenbordgebruikers (switch-access op iPad) zien geen focusindicator. WCAG 2.1 criterion 2.4.7-overtreding.

```tsx
// ❌ Huidig — ToolGuide.tsx:234,342,374
focus-visible:ring-duck-coral

// ✅ Voorgesteld (na Optie A fix, automatisch opgelost)
// Na toevoeging duck.coral in tailwind.shared.js werkt dit zonder verdere aanpassingen
```

---

### Score

3/7 criteria geslaagd · **Aanbeveling: fix-eerst**

Config-kwaliteit (copy, structuur, layout-baseline) is sterk. Engine heeft twee blocking issues die engine-breed alle ToolGuide-missies raken.

---

## 📚 Didactiek review

**Mission:** magister-master (tool-guide)
**Curriculum-plek:** Leerjaar 1, Periode 1
**SLO-claim:** `['21A']` (regulier) · `['18A']` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

---

### ✅ Geslaagd

- **Criterium 1 — SLO-codes correct:** `21A` geldig regulier, `18A` geldig VSO. Één code per profiel — geen overflow. — `slo-kerndoelen-mapping.ts:28`
- **Criterium 4 — Opdracht-beknoptheid:** Alle stap-instructies 16–19 woorden (<60 voor LJ1). Intro = 23 woorden (<80). — `magister-master.ts:9,32,57,82,95`
- **Criterium 6 — Curriculum-plek logisch:** Eerste missie LJ1-P1 "Digitale Basisvaardigheden" — logische openingspositie, geen vereiste voorkennis. — `curriculum.ts:67`
- **Criterium 8 — AI-as-copilot:** Geen `enableChat` in templateRegistry — geen chat-component. Criterium n.v.t. — `templateRegistry.ts:96`
- **Criterium 9 — Welzijn & inclusiviteit:** VSO-mapping aanwezig. Genderneutrale taal. Privacygevoelig moment (cijfers) expliciet gemitigeerd via `evidence`-veld + `teacherCheck` stap 4. — `magister-master.ts:18,102`
- **Criterium 5 — Leeftijdspassend vocabulary:** Direct, herkenbaar taalgebruik. Wegingsfactor uitgelegd in explanation. Teams/Classroom alternatief eerlijk benoemd. — `magister-master.ts:33,58,83,96`

---

### ⚠️ Aandachtspunten

- **Criterium 3 — Geen expliciete `learningObjectives`-array:**
  - **Wat:** Config heeft geen `learningObjectives`-veld. Impliciete doelen zijn af te leiden uit `introDescription`, `missionGoal.primaryGoal` en `takeaways`, maar niet geformuleerd als "De leerling kan + actiewerkwoord + meetbaar resultaat." — `magister-master.ts:9,11,139-143`
  - **Waarom:** Ontbreken ankerfunctie voor docenten en SLO-verantwoording. `takeaways` bevat "begrijpt waarom" (vage Bloom-1/2 formulering).
  - **Voorstel:**
    ```text
    learningObjectives: [
      'De leerling logt zelfstandig in op de Magister-app met het juiste schoolaccount.',
      'De leerling vindt het rooster voor vandaag en benoemt vak, lokaal en starttijd van de eerste les.',
      'De leerling zoekt huiswerk of opdrachten op in de Agenda of ELO.',
      'De leerling opent het cijferoverzicht en leest de wegingsfactor van het meest recente cijfer.',
    ]
    ```

- **Criterium 2 — SLO-fit 21A oppervlakkig (navigatie ≠ systeemkennis):**
  - **Wat:** SLO 21A ("Digitale systemen") omvat begrip van hoe systemen werken. De missie traint uitsluitend navigatiehandelingen (klikken, openen, vinden) zonder één redeneer- of systeemvraag. — `magister-master.ts:27-115`
  - **Waarom:** Leerling bewijst dat hij Magister kan bedienen, maar niet dat hij begrijpt wat het systeem doet — kern van 21A.
  - **Voorstel:** Voeg aan de explanation van stap 1 een systeemdenk-zin toe die uitlegt waarom Magister rooster, cijfers en communicatie koppelt. Alternatief: optioneel `reflection`-veld "Welke informatie over jou staat er in Magister?" (raakt ook 23A).

- **Criterium 7 — Bloom-balans laag (overwegend Bloom 1-2):**
  - **Wat:** Vier stappen bestaan uit onthouden (checklist) en begrijpen (verificationQuestions over feitenkennis). Geen stap vraagt analyseren, vergelijken of oordelen. — `magister-master.ts:40-50,65-75,103-114`
  - **Waarom:** Bloom 1-2 is passend voor LJ1-opener, maar het "bewijs stap voor stap"-frame (intro regel 9) wordt niet didactisch ingelost: geen reflectiemoment na voltooiing.
  - **Voorstel:** Voeg één Bloom-3 afsluiting toe (past bij LJ1):
    ```text
    'Stel je voor dat een nieuwe leerling Magister voor het eerst gebruikt.
     Welke stap zou jij hem of haar als eerste uitleggen, en waarom?'
    ```

---

### ❌ Blocking issues

Geen.

---

### SLO-fit oordeel

- **21A (Digitale systemen):** oppervlakkig geraakt — navigatiegedrag in een digitaal systeem aangetoond, maar geen systeembegrip geoefend. Verdedigbaar als startniveau LJ1, maar versterking wenselijk.
- **18A (VSO — Gebruik van digitale toepassingen):** sterk geraakt — alle vier stappen zijn direct bewijs van actief gebruik van een digitale toepassing in schoolcontext.

---

### Score

6/9 criteria geslaagd · Bloom-balans: laag (Bloom 1-2, passend voor startniveau maar zonder hogere-orde afsluiting) · **Aanbeveling: fix-eerst** — voeg expliciete `learningObjectives` toe en één reflectiemoment; 21A-claim verdedigbaar maar te versterken.

---

## 🔧 Tech review

**Mission:** magister-master (tool-guide)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** Uitgevoerd — dev-preview route `/dev/mission-preview?mission=magister-master` bereikbaar (HTTP 200). Auth-bypass actief in DEV-modus via `DevMissionPreview.tsx`. Viewport-screenshots niet beschikbaar; UI-state en computed styles geverifieerd via JavaScript DOM-inspecties via Chrome-plugin.

---

### Static analyse

#### ✅ Geslaagd

- **A1 — Knop-handlers gekoppeld:** Alle `<button>`-elementen hebben functionele `onClick`-handlers (checklist, teacher-check, antwoordopties, submit, volgende, terug). Geen dode handlers. — `ToolGuide.tsx:231-258,279,336-342,372-379,405-413`
- **A2 — Error states aanwezig:** Config-laad via `import()` heeft `loadError`-state met user-friendly bericht + terug-knop. Loading-state via `<LoadingScreen />`. — `ToolGuide.tsx:581-606`
- **A3 — TypeScript-discipline:** Geen `any`, geen `@ts-ignore`. Interfaces (`ToolGuideConfig`, `ToolStep`, `ChecklistItem`, `VerificationQuestion`, `ToolGuideState`, `StepCardProps`) volledig en expliciet. — `ToolGuide.tsx:12-61`
- **A5 — Edge function calls:** Geen `supabase.functions.invoke` aanwezig. ToolGuide heeft geen AI-aanroepen — alle logica is lokaal. Criterium n.v.t. — grep bevestigd
- **A6 — Restart-safe state:** `useMissionAutoSave<ToolGuideState>` correct gebruikt: debounced save (1s), `beforeunload`-flush, unmount-flush, `clearSave()` bij voltooiing, userId-scoping tegen cross-user lekkage op gedeelde apparaten. — `ToolGuide.tsx:438-441`, `useMissionAutoSave.ts:52-135`
- **A7 — Security:** Geen user-input naar AI. Geen `dangerouslySetInnerHTML`. `RichText`-component rendert alleen hardcoded config-tekst. `systemInstruction` niet aanwezig (n.v.t. voor dit template). — `ToolGuide.tsx:87-103`

---

#### ⚠️ Aandachtspunten

- **A4 — Relatieve imports:** `ToolGuide.tsx` importeert `IntroScreen`, `CompletionScreen`, `PhaseHeader` via relatieve paden (`../shared/...`) i.p.v. `@/*`-alias.
  - **Risico:** Laag — werkt correct, maar afwijking van project-conventie.
  - **Voorstel:** Vervang `'../shared/IntroScreen'` → `'@/features/missions/templates/shared/IntroScreen'` etc. — `ToolGuide.tsx:5-9`

- **hasSavedProgress niet benut voor resume-UX:** `useMissionAutoSave` retourneert `hasSavedProgress` maar `ToolGuideInner` toont geen "verder gaan"-banner op het intro-scherm.
  - **Risico:** Leerling ziet geen bevestiging dat voortgang bewaard is na onderbreking.
  - **Voorstel:** Voeg `hasSavedProgress`-prop toe aan `IntroScreen` met kleine banner ("Je voortgang is bewaard — ga verder!"). — `ToolGuide.tsx:438,515-525`

---

#### ❌ Blocking issues

**[ENGINE-BREED — raakt alle 5 LJ1-P1 ToolGuide-missies]**

**BLOCKING-T1 — Ontbrekende duck-namespace tokens (dynamisch bevestigd)**

`ToolGuide.tsx`, `IntroScreen.tsx`, `CompletionScreen.tsx` gebruiken `duck-coral`, `duck-muted`, `duck-line`, `duck-creamDeep`. De `duck`-namespace in `tailwind.shared.js` definieert alleen `bg`, `bgLight`, `ink`, `acid`, `gray`, `error`.

Bewijs (DOM computed styles):
- `bg-duck-coral` → `rgba(0,0,0,0)` — stap-teller-dot transparant
- `text-duck-coral` → `rgb(32,32,35)` — valt terug op `duck-ink`
- `border-duck-line` → `rgb(229,231,235)` — Tailwind gray-200 fallback
- `text-duck-muted` → `rgb(32,32,35)` — valt terug op `duck-ink`
- `bg-duck-creamDeep` → teacher-check sectie transparante achtergrond

**Voorstel (aanbevolen — Optie A, één file):**

```js
// ❌ Huidig — tailwind.shared.js:8-15
duck: {
    bg: '#f2f1ec',
    bgLight: '#f8f8f5',
    ink: '#202023',
    acid: '#e1ff01',
    gray: '#c2c1bd',
    error: '#ff3c21',
},

// ✅ Voorgesteld
duck: {
    bg: '#f2f1ec',
    bgLight: '#f8f8f5',
    ink: '#202023',
    acid: '#e1ff01',
    gray: '#c2c1bd',
    error: '#ff3c21',
    coral: '#D97848',
    muted: '#445865',
    line: '#E7D8BD',
    creamDeep: '#F3E4CB',
},
```

**BLOCKING-T2 — maxScore-discrepantie: config 60, engine max 55**

`magister-master.ts:117` definieert `maxScore: 60`. Engine berekent max 55: 4 stappen × 10 pt = 40 + 3 verificatievragen × 5 pt = 15. Stap 3 heeft geen `verificationQuestion`. Gevolg: bij perfecte voltooiing toont CompletionScreen "55/60 punten (92%)" — leerling kan nooit 100% halen.

```ts
// ❌ Huidig — magister-master.ts:117
maxScore: 60,

// ✅ Voorgesteld
maxScore: 55,
```

---

### Dynamic verificatie

**Dev-preview route:** `http://localhost:5173/dev/mission-preview?mission=magister-master` — bereikbaar, no-auth DEV-modus.

#### Console-output
- Errors: 0
- Warnings: 0

#### Network-failures
- Geen netwerkaanroepen gegenereerd (template volledig lokaal, geen Supabase edge functions)

#### Visuele bewijslast
- **Intro-state:** "Start de missie"-knop functioneel (`bg-duck-acid` = `rgb(225,255,1)` correct)
- **Mid-flow (stap 1-2):** Checklist-items klikbaar en toggelbaar. Teacher-check verschijnt na all-checked. VerificationQuestion verschijnt na all-checked. Score-teller toont "15 pts" na stap 1 correct
- **Eind-state:** Niet volledig bereikt via geautomatiseerde flow (AutoSave-unmount-flush overschrijft state bij navigatie — correct gedrag)
- **Token-bug dynamisch bevestigd** — zie BLOCKING-T1

**Visual Precision Gate: BLOCKING** — stap-teller-dot (primaire voortgangsindicator) transparant door ontbrekend `duck-coral` token.

---

### Score

Static: 5/7 (A4 warn, hasSavedProgress warn) · Dynamic: 0 console-errors, flow functioneel, token-bug bevestigd · **Aanbeveling: fix-eerst**

---

## 🖼️ Visuele evidence (multi-viewport)

Multi-viewport screenshot-verificatie (desktop/tablet/mobiel) niet volledig uitgevoerd — DGSkills SPA is state-based (geen URL per missie). De `/dev/mission-preview`-route is beschikbaar en biedt partiële dynamische verificatie via DOM-inspecties, maar viewport-screenshots (375px / 768px / 1280px) zijn niet gemaakt.

**Beschikbaar dynamisch bewijs:**
- Intro-state: geverifieerd via DOM (HTTP 200, knop functioneel)
- Stap 1-2 mid-flow: geverifieerd via DOM-interacties (checklist, teacher-check, verificationQuestion, score-teller)
- Token-bug: geverifieerd via `getComputedStyle()` (4 tokens bevestigd gebroken)
- Console/network: 0 errors/failures

**Aanbeveling follow-up:** voeg viewport-emulatie toe aan de dev-preview route of maak screenshots via Chrome DevTools multi-viewport voor definitieve visuele QA. Markeer als "Echte iPad-check nodig" voor schoolpilot.

**Status: PARTIAL REVIEW** — dit rapport is gebaseerd op statische analyse + partiële DOM-verificatie. Desktop/tablet/mobiel viewport-screenshots en de eindstaat zijn niet via visuele QA bevestigd. Dit rapport is een fix-lijst, geen release-gate document — definitieve release-gate vereist volledige visuele QA na het fixen van de 3 blockers.

---

## Samenvatting

- **Geslaagd:** 14 criteria (design 3 + didactiek 6 + tech 5)
- **Aandachtspunten:** 7 issues (waarvan 0 blocking in didactiek, 2 blocking design, 2 blocking tech)
- **Blocking (uniek):** 3 unieke issues — (1) duck-namespace tokens ontbreken [engine-breed, D+T], (2) focus-ring WCAG-overtreding [engine-breed, D], (3) maxScore-discrepantie [config, T]
- **Aanbeveling: fix-eerst**
- **Release-gate status: BLOCKED** — visuele QA (multi-viewport + eindstaat) is niet uitgevoerd; zie Codex-gate bevinding hieronder

**Goede nieuws:** de missie-config (`magister-master.ts`) is inhoudelijk sterk — heldere stap-structuur, passende copy, goede teacherCheck-verankering, welzijnsbewust (cijfers privé). De blockers zitten **niet** in de config maar in de gedeelde engine en de `tailwind.shared.js`. Fix de 3 blocking issues, voer daarna multi-viewport visuele QA uit, en de LJ1-P1 ToolGuide-familie kan als ship-ready worden beschouwd.

**Top 3 issues:**
1. `tailwind.shared.js:8-15` — Voeg `coral`, `muted`, `line`, `creamDeep` toe aan duck-namespace (één-regel fix, engine-breed impact)
2. `magister-master.ts:117` — `maxScore: 55` (leerling kan nu nooit 100% halen)
3. `magister-master.ts` — Voeg expliciete `learningObjectives`-array toe (didactische ankerfunctie)

---

## Codex-gate (M1)

**Verdict: BLOCK**
**Model:** gpt-5.5 · **Effort:** xhigh · **Datum:** 2026-06-14

**Bevindingen:**

**[HIGH]** `business/dgskills-reviews/magister-master-2026-06-14.md:314-316` — Codex-gate sectie was een lege placeholder; het rapport maakte een shippability-claim zonder eindoordeel van de gate. Fix: deze sectie is nu ingevuld met het echte BLOCK-oordeel.

**[MEDIUM]** `business/dgskills-reviews/magister-master-2026-06-14.md:284-305` — De samenvattingszin "Fix de 3 blocking issues en de hele LJ1-P1 ToolGuide-familie is shipbaar" was niet gedekt door het rapport's eigen bewijs: multi-viewport screenshots en eindstaat zijn niet geverifieerd. Fix: claim vervangen door conditionele formulering + expliciete BLOCKED release-gate status.

**Next steps (uit Codex):**
1. Fix de 3 blocking issues (tailwind tokens, maxScore, learningObjectives)
2. Voer na de fix volledige multi-viewport visuele QA uit (desktop / tablet staand / tablet liggend / mobiel, alle 4 states: intro / mid-flow / fout-feedback / eindstaat)
3. Herrun de review (of markeer visuele QA als "Echte iPad-check: gedaan") voordat dit rapport als release-gate dient
