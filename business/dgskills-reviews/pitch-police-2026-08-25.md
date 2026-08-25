# Review: Pitch Politie (`pitch-police`)

**Datum:** 2026-08-25
**templateType:** handcrafted
**Component:** `src/features/missions/review/PitchPoliceMission.tsx`
**Curriculum-plek:** Leerjaar 1, Periode 2 (week 2, reviewMissions)
**SLO-claim:** `21A`, `22A` (regulier) · `18A`, `19A` (VSO)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (rubric)

### ✅ Geslaagd
- **Criterium 1 (tokens):** doorgaans consistent `duck-*`-gebruik (`duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`, `duck-bgLight`) — `PitchPoliceMission.tsx:55-251` en verder.
- **Criterium 2 (layout):** N.v.t. — handcrafted, geen template-baseline.
- **Criterium 3 (knop-clarity):** alle knoppen hebben label + icon of duidelijke tekst ("Vorige", "Volgende Dia", "Afronden", optie-teksten volledig uitgeschreven) — `PitchPoliceMission.tsx:538-551, 625-641`.
- **Criterium 5 (responsive):** aparte mobile-sheet + desktop-sidebar, `hidden lg:flex`/`lg:hidden`-splitsing consequent toegepast — `PitchPoliceMission.tsx:481, 556, 572, 604, 646`. Geen vaste pixelbreedtes die mobiel breken.
- **Criterium 6 (motion):** geen Framer Motion; Tailwind `animate-in`/`transition-all` wordt functioneel gebruikt (state-transitie bij "fixed"-status), geen wrapper-spam.
- **Criterium 7 (a11y, deels):** afbeeldingen hebben `alt` (`PitchPoliceMission.tsx:131-144, 192-196`), interactieve elementen hebben `focus-visible:ring-2`.

### ⚠️ Aandachtspunten
- **Criterium 1 (hardcoded hex i.p.v. token)** — `PitchPoliceMission.tsx:232, 423, 437`
  - **Wat:** `border-[#08283B]` en twee keer `focus-visible:ring-[#0B453F]` zijn hardcoded lab-hex-waarden terwijl de rest van het component consequent `duck-*`-tokens gebruikt.
  - **Waarom:** breekt de token-discipline; bij een toekomstige paletwijziging worden deze drie plekken gemist.
  - **Voorstel:** vervang door `border-duck-ink` (r.232) en `focus-visible:ring-duck-ink` (r.423, r.437) — sluit aan bij de focus-ring-stijl die de rest van het bestand al gebruikt (bv. r.540, r.548, r.629).

- **Robuustheid extern beeldmateriaal** — `PitchPoliceMission.tsx:131-133, 141, 193`
  - **Wat:** slides 4 en 6 hotlinken naar `media.giphy.com` en `images.unsplash.com` zonder `onError`-fallback.
  - **Waarom:** als een van deze externe bronnen niet meer bestaat of geblokkeerd wordt (schoolnetwerk-firewall komt vaker voor), toont de slide een kapotte afbeelding — precies het "rommelige slide"-gevoel dat de missie leerlingen leert te vermijden, nu per ongeluk in de eigen UI.
  - **Voorstel:** kleine, niet-blocking verbetering — `onError`-handler die een neutrale placeholder toont, of de assets lokaal serveren via `/assets/`. Buiten de whitelist-scope van deze auto-fix-ronde (geen missie-eigen bestand nodig, maar wel een asset-vraag), dus als aandachtspunt genoteerd, niet als Voorstel-blok.

### ❌ Blocking issues
- **Onleesbare optie-letter (contrast = 1:1)** — `PitchPoliceMission.tsx:632` (desktop inspector) en `PitchPoliceMission.tsx:674` (mobiele bottom sheet)
  - **Wat:** de cirkel met de optie-letter (A/B/C) heeft `bg-duck-ink text-duck-ink` — achtergrond én tekstkleur zijn dezelfde kleur (`#202023`). De letter is in de standaardstaat volledig onzichtbaar; alleen bij `:hover` (waar de achtergrond naar `duck-acid` wisselt en de tekst `text-duck-ink` blijft) wordt de letter zichtbaar.
  - **Waarom:** leerlingen op een touchscreen (tablet/telefoon — de hoofddoelgroep laut de skill) hebben geen hover-state. Zij zien lege, zwarte cirkels zonder A/B/C-label bij elke keuzeoptie — een directe WCAG-contrastschending (0:1) en een bruikbaarheidsprobleem op het belangrijkste interactiepunt van de missie.
  - **Voorstel:** zie Voorstel-blok hieronder.

### Visual Precision Gate
`WARN` — geen dev-server/Chrome-plugin-bewijs beschikbaar in deze pass (statische analyse only); de contrast-bug hierboven is via code-analyse hard aangetoond (identieke hex-waarde voor bg en text), dus als static finding wel bewezen, maar de volledige multi-viewport/multi-state visuele check is niet uitgevoerd.

### Score
5/7 criteria geslaagd (1 blocking) · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Reviewer:** dgskills-didactiek-reviewer (rubric)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** `21A`, `22A` · VSO `18A`, `19A`

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig):** `21A` en `22A` zijn beide geldige regulier-codes; `18A`/`19A` geldige VSO-codes — `src/config/slo-kerndoelen-mapping.ts:61`.
- **Criterium 2 (SLO-fit):** de missie laat leerlingen daadwerkelijk digitale producten (presentatieslides) beoordelen en verbeteren op tekst, contrast, rust, beeld, verhoudingen, spelling en datavisualisatie — dit raakt `22A` (digitale producten) substantieel over alle 8 slides. `21A` (digitale systemen) is minder direct zichtbaar in de opdrachtinhoud zelf, maar past bij het onderliggende "hoe werkt een presentatietool"-kader.
- **Criterium 3 (leerdoelen, impliciet):** `missionGoals.ts:66` — "Ik herken veelvoorkomende slideproblemen en kies per slide een passende verbetering" is een concreet, meetbaar leerdoel met actiewerkwoorden (herken, kies).
- **Criterium 4 (beknoptheid):** intro-tekst (`PitchPoliceMission.tsx:368-369`) is 15 woorden, ruim onder de <80-woorden-grens voor leerjaar 1. De per-slide `feedback`-teksten zijn allemaal 1-2 zinnen.
- **Criterium 5 (leeftijds-passend):** herkenbare onderwerpen voor leerjaar 1 (gamen, vakantie, kermis, droomauto, schoolcijfers) — geen jargon, directe/motiverende toon ("Wow, rustig aan!", "Au!").
- **Criterium 6 (curriculum-plek):** logisch geplaatst als reviewMission in J1P2 naast `cloud-cleaner` en `layout-doctor` (`src/config/curriculum.ts:95-98`) — vergelijkbare "herken en fix"-opdrachten.
- **Criterium 7 (Bloom-balans):** mix van herkennen (issue identificeren) en evalueren/kiezen (juiste oplossing tussen 3 opties, waarvan 2 plausibele afleiders) — passend niveau voor leerjaar 1, geen pure quiz-recall.
- **Criterium 8 (AI-as-copilot):** N.v.t. — component importeert geen chatcomponent/`useChat`/AI-provider; bewust een niet-AI review-missie (bekende valkuil, geen bevinding).
- **Criterium 9 (VSO + inclusiviteit):** VSO-mapping aanwezig; geen gevoelige onderwerpen, geen gender-aannames.

### ⚠️ Aandachtspunten
- **Criterium 1 (aantal codes)** — `src/config/slo-kerndoelen-mapping.ts:61`
  - **Wat:** 2 reguliere + 2 VSO-codes, binnen de aanbevolen grens (max 3) — geen fail, maar `21A` is de zwakste claim van de twee.
  - **Waarom:** `21A` (digitale systemen) wordt door geen enkele slide-opdracht expliciet geoefend; leerlingen sleutelen aan content-keuzes (tekst, contrast, beeld), niet aan systeeminstellingen.
  - **Voorstel:** overweeg bij een volgende contentronde `21A` te vervangen door `23C` (maatschappij/communicatie) of de claim te laten staan met een korte docent-noot dat `21A` hier via "hoe presentatiesoftware werkt" indirect wordt geraakt. Geen code-wijziging nu nodig — dit is een lichte SLO-fit-kanttekening, geen blocking mismatch.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **22A (Digitale producten):** sterk geraakt — 8 slides, elk met een concrete productverbetering.
- **21A (Digitale systemen):** oppervlakkig — geen directe systeem-interactie in de opdracht zelf.

### Score
8/9 criteria geslaagd · Bloom-balans: medium · Aanbeveling: **ship**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (rubric)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze pass (statische analyse only)

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers):** alle knoppen hebben functionele `onClick` — geen dode knoppen gevonden.
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`/`@ts-expect-error` in het bestand; props volledig getypeerd via `PitchPoliceProps`/`SlideData`/`SlideOption` (`PitchPoliceMission.tsx:8-39`).
- **A5 (edge functions):** N.v.t. — geen `supabase.functions.invoke`-aanroepen in dit component.
- **A6 (restart-safe state):** gebruikt `useMissionAutoSave('pitch-police', ...)` rechtstreeks, geen tussenlaag (`PitchPoliceMission.tsx:256-263`).
- **A7 (security):** geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`, geen leerling-vrije-tekstinvoer die naar AI of DOM gaat.

#### ⚠️ Aandachtspunten
- **A2 (error state bij completion)** — `PitchPoliceMission.tsx:326-333`
  - **Wat:** `await onComplete(true)` staat in een `try { … } finally { … }` zonder `catch`. Bij een reject (bv. netwerkfout in de save-laag) wordt de fout niet opgevangen; er verschijnt geen leerling-vriendelijke foutmelding, `isCompleting` wordt wel netjes teruggezet via `finally`.
  - **Risico:** de leerling ziet de knop terug naar normaal springen zonder enige feedback over wat er misging — lijkt op een "niets gebeurt er"-bug in plaats van een duidelijke foutmelding.
  - **Voorstel:** voeg een `catch` toe die een korte foutstate toont (vergelijkbaar met het bestaande `showFeedback === false`-patroon), bijvoorbeeld:
    ```tsx
    // ❌ Huidig — PitchPoliceMission.tsx:326-333
    try {
        const completed = await onComplete(true);
        if (completed === true) clearSave();
    } finally {
        completionLockRef.current = false;
        setIsCompleting(false);
    }

    // ✅ Voorgesteld
    try {
        const completed = await onComplete(true);
        if (completed === true) clearSave();
    } catch {
        setShowFeedback(false); // hergebruikt bestaande foutoverlay
        setTimeout(() => setShowFeedback(null), 2000);
    } finally {
        completionLockRef.current = false;
        setIsCompleting(false);
    }
    ```
  - Niet blocking — de kans op falen is klein en het faalgedrag is stil, niet destructief.

- **A4 (imports via alias)** — `PitchPoliceMission.tsx:6`
  - **Wat:** `import { MissionGoalBanner } from '../templates/shared/MissionGoalBanner'` is een relatief pad i.p.v. `@/features/missions/templates/shared/MissionGoalBanner`.
  - **Waarom:** strikt genomen een A4-afwijking, maar het is het consistente patroon in de hele `review/`-map (o.a. `CloudCleanerMission.tsx:7` doet identiek) — geen op-zichzelf-staande bug, wel repo-brede drift die buiten de scope van deze missie-only review valt.
  - **Voorstel:** geen actie op missie-niveau; als dit wordt aangepakt, hoort het bij een repo-brede alias-opschoning, niet bij een pitch-police-specifieke fix.

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server/Chrome-plugin in deze pass. Alle dynamische claims (console, network, multi-viewport) zijn **unverified**.

### Score
Static: 5/7 (2 warn, geen fail) · Dynamic: n.v.t. · Aanbeveling: **ship** (met de A2-fix als kleine follow-up, geen blocker)

---

## Voorstellen

### Voorstel 1 — Contrast-bug optie-letter oplossen (BLOCKING, design)

**Bestand:** `src/features/missions/review/PitchPoliceMission.tsx`

```tsx
// ❌ Huidig — regel 632 (desktop inspector)
<div className="w-6 h-6 rounded-full bg-duck-ink text-duck-ink flex items-center justify-center text-xs font-bold group-hover:bg-duck-acid group-hover:text-duck-ink transition-all duration-300 shrink-0">

// ✅ Voorgesteld
<div className="w-6 h-6 rounded-full bg-duck-ink text-white flex items-center justify-center text-xs font-bold group-hover:bg-duck-acid group-hover:text-duck-ink transition-all duration-300 shrink-0">
```

```tsx
// ❌ Huidig — regel 674 (mobiele bottom sheet)
<div className="w-6 h-6 rounded-full bg-duck-ink flex items-center justify-center text-xs font-bold group-hover:bg-duck-acid group-hover:text-duck-ink transition-all duration-300 shrink-0 text-duck-ink">

// ✅ Voorgesteld
<div className="w-6 h-6 rounded-full bg-duck-ink flex items-center justify-center text-xs font-bold group-hover:bg-duck-acid group-hover:text-duck-ink transition-all duration-300 shrink-0 text-white">
```

### Voorstel 2 — Hex-literals vervangen door tokens (aandachtspunt, design)

**Bestand:** `src/features/missions/review/PitchPoliceMission.tsx`

```tsx
// ❌ Huidig — regel 232
<div className="flex items-end gap-6 h-64 w-96 border-b-4 border-[#08283B] p-4">

// ✅ Voorgesteld
<div className="flex items-end gap-6 h-64 w-96 border-b-4 border-duck-ink p-4">
```

```tsx
// ❌ Huidig — regel 423 en 437
focus-visible:ring-[#0B453F]

// ✅ Voorgesteld
focus-visible:ring-duck-ink
```

---

## Samenvatting

**Pitch Politie** is didactisch en technisch solide: het SLO-doel (`22A`, digitale producten) wordt door alle 8 slides substantieel geraakt, de copy is kort en leeftijdsgepast, en er zijn geen dode knoppen, `any`-types of security-gaten. De ene echte blocker is een **contrast-bug**: de optie-letter (A/B/C) in de keuzeknoppen is standaard onzichtbaar omdat achtergrond- en tekstkleur identiek zijn (`bg-duck-ink text-duck-ink`), zichtbaar op zowel desktop als mobiel. Dit raakt het kernmoment van de missie — leerlingen kiezen een oplossing — en is een mechanische eenregelige fix per plek (2 plekken). Twee kleinere aandachtspunten (hardcoded hex-kleuren, ontbrekende `catch` bij completion) zijn geen blockers.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

**Eindverdict: fix-eerst** — klein, mechanisch, safe om automatisch te fixen (zie `autoFixable`).
