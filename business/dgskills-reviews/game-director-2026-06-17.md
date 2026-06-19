# Missie-review: game-director

**Mission ID:** game-director
**Template:** dedicated (handcrafted component)
**Datum:** 2026-06-17
**Vorige review:** game-director-2026-05-09.md
**Verdict:** Didactisch en technisch solide kern, maar twee blocking issues uit de mei-review zijn onopgelost.

---

## Voortgang t.o.v. vorige review (2026-05-09)

De twee blocking issues uit mei zijn **niet opgelost**:

1. `roleId="game-director"` ontbreekt nog steeds bij `StudentAIChat` (regel 873).
2. Mobiele canvas 0x0-bug: geen screenshot beschikbaar in `screenshots/assignments/game-director/` om te verifieren, maar de code op regel 951-960 bevat nog geen expliciete mobiele hoogte-fix.

Positief: de DUCK-tokenmigratie is doorgevoerd — de JSX-laag gebruikt nu `duck-*`-tokens consistent. De hexwaarden die nog aanwezig zijn (`#202023`, `#99984D`, `#e1ff01`, `#e8e3d8`) bevinden zich uitsluitend in Canvas 2D-drawingcode, wat acceptabel is (geen Tailwind-context).

---

## 🎨 Design review

### ✅ Goed

- **DUCK-tokens in JSX consequent**: de component gebruikt `bg-duck-bg`, `text-duck-ink`, `bg-duck-acid`, `border-duck-gray` etc. Geen hardcoded hex in Tailwind-klassen.
- **Responsive mobiele tabstructuur aanwezig**: drie tabs (Blokken / Code / Game) via `mobileTab`-state; `lg:hidden` / `lg:flex` prefixes gebruikt.
- **Framer Motion niet gebruikt**: geen overbodige animatiebibliotheek; transitions zijn CSS (`transition-all duration-300`). Intentioneel en licht.
- **Copy leeftijdsgeschikt (J1)**: levelomschrijvingen zijn <= 60 woorden, hints zijn concreet en speels. Toon klopt voor onderbouw VO.
- **"Hulp nodig?"-knop heeft focus-ring**: `focus-visible:ring-2 focus-visible:ring-duck-acid` aanwezig op de AI-chatknop (regel ~861).

### ⚠️ Aandachtspunten

- **Icon-only knoppen missen aria-label** — de play/reset-overlay op het canvas (regels 964-973) heeft geen `aria-label`.
  Gevolg: screenreadergebruikers horen enkel "button".

  **Voorstel** (`src/features/missions/GameDirectorMission.tsx:966`):
  ```tsx
  // Voor:
  <button onClick={handleTogglePlay} className="...">
    {isPlaying ? <RotateCcw size={20} /> : <Play size={20} fill="currentColor" />}
  </button>

  // Na:
  <button
    onClick={handleTogglePlay}
    aria-label={isPlaying ? 'Stop game' : 'Start game'}
    className="..."
  >
    {isPlaying ? <RotateCcw size={20} /> : <Play size={20} fill="currentColor" />}
  </button>
  ```

- **Hover = rust-state op "Volgende"-knop** (regel ~844): `bg-duck-ink hover:bg-duck-ink` — hover is identiek aan rust. Leerling krijgt geen visuele feedback.

  **Voorstel** (`src/features/missions/GameDirectorMission.tsx:844`):
  ```tsx
  // Voor:
  className="... bg-duck-ink hover:bg-duck-ink text-white ..."

  // Na:
  className="... bg-duck-ink hover:opacity-80 text-white ..."
  ```

- **Mobiele "Game"-tab canvas hoogte**: De canvas-wrapper (`div.absolute.inset-0`) erft hoogte van de parent `flex-1`-container, maar op mobiel kan die container inklappen als er geen `min-h` is. Geen screenshot beschikbaar om huidig gedrag te bevestigen — visueel **niet geverifieerd**.

  **Voorstel** (`src/features/missions/GameDirectorMission.tsx:951`):
  ```tsx
  // Voor:
  <div className="flex-1 relative bg-duck-ink rounded-2xl overflow-hidden ...">

  // Na:
  <div className="flex-1 min-h-[280px] relative bg-duck-ink rounded-2xl overflow-hidden ...">
  ```

### ❌ Blokkers

- **Geen screenshots beschikbaar** — `screenshots/assignments/game-director/` bestaat niet. Visuele beoordeling op mobiel kan niet worden bevestigd. Vorige review (2026-05-09) dokumenteerde een 0x0-canvas op 390×844; zonder nieuwe screenshots is de mobiele bug onopgelost te beschouwen.

---

## 📚 Didactiek review

### ✅ Goed

- **Primair doel aanwezig en concreet**: `MISSION_GOAL.primaryGoal` = "Ik programmeer Robbie door vijf levels heen en leg uit wat duidelijke instructies met AI te maken hebben." — actief geformuleerd, concreet en leeftijdspassend.
- **Objectives starten met actiewerkwoord**: de challenge-titels gebruiken "Programmeer", "Zorg dat", "Pas aan" — Bloom-conform.
- **SLO 22B inhoudelijk sterk geraakt**: leerlingen bouwen events (`when_game_starts`, `when_key_pressed`), condities (`if_grounded`), variabelen (`gravity`) en herhaling — de kern van visueel programmeren.
- **Bloom-progressie aanwezig**: Level 1 (onthouden/toepassen) → Level 4 (analyseren: spring alleen als grounded) → Level 5 (evalueren: zwaartekrachtwaarde kiezen). Goede scaffolding zonder gat.
- **AI-copilot-rol bewust**: de systemInstruction in `year1.tsx:211` is een gedetailleerde Game Design Coach met blokken-opsomming, werkwijze en expliciete "antwoordenmachine"-preventie (step 3: laat leerling testen).
- **Welzijnsprotocol actief**: `StudentAIChat` gebruikt `useStudentAssistant` dat welzijnssignalen scant; dit is platform-breed aanwezig.
- **Reflectie-gate**: leerling kan missie niet voltooien zonder >= 10 tekens reflectie. Oppervlakkig maar functioneel.
- **Adaptive difficulty (Hard Mode)**: levelvoltooiing < 45 seconden triggert een moeilijkere layoutvariant. Goed doordacht.

### ⚠️ Aandachtspunten

- **SLO-metadata inconsistentie (22A)**: de formele SLO-mapping (`slo-kerndoelen-mapping.ts:49`) claimt alleen `['22B']`, maar `ProjectZeroDashboard.tsx:140` claimt `['22A', '22B']`. De kommentaartoelichting bij de mapping (`-22A: focus is visueel programmeren, niet productontwerp`) is intern consistent, maar de dashboardkaart is fout.

  **Voorstel** (`src/features/student/ProjectZeroDashboard.tsx:140`):
  ```tsx
  // Voor:
  sloKerndoelen: ['22A', '22B']

  // Na:
  sloKerndoelen: ['22B']
  ```

- **Dashboardbeschrijving belooft meer dan de missie levert**: "Word de architect. Herschrijf de natuurwetten en ontwerp je eigen game-regelset." klinkt als productontwerp (22A), maar de checks valideren uitsluitend functioneel programmeren (22B). De reflectievraag ("Wat heb je geleerd?") is te generiek om 22A te dekken.

  **Voorstel**: òf dashboardtekst aanpassen naar "Programmeer Robbie door vijf levels heen en ontdek hoe codeblokken werken.", òf een ontwerp-keuze-reflectievraag toevoegen (bijv. "Welke blokken koos je voor Level 5 en waarom?") zodat 22A-claim onderbouwd is.

- **Leerdoel in `year1.tsx` en `missionGoals.ts` zijn identiek**: goed voor consistentie, maar `goalCriteria` in `year1.tsx:200` zegt `{ type: 'steps-complete', min: 3 }` terwijl de werkelijke missie 5 challenges heeft. Dit onderrapporteert de leeruitkomst als het criterium ergens voor rapportage wordt gebruikt.

  **Voorstel** (`src/config/agents/year1.tsx:200`):
  ```tsx
  // Voor:
  goalCriteria: { type: 'steps-complete', min: 3 },

  // Na:
  goalCriteria: { type: 'steps-complete', min: 5 },
  ```

- **Reflectievraag is te open voor onderbouw J1**: "Wat heb je geleerd? Waar kom je dit nog meer tegen?" is een cognitief zware vraag zonder structuur. Leerlingen met beperkte schrijfvaardigheid leveren "leuk" in en halen de 10-tekens-gate. Een structured prompt zou meer opleveren.

### ❌ Blokkers

- **`roleId` ontbreekt bij `StudentAIChat`** (`src/features/missions/GameDirectorMission.tsx:873`): de AI-coach wordt opgeroepen zonder `roleId="game-director"`. De `useStudentAssistant`-hook valt terug op de generieke `student-assistant`-rol, met Week 1/Magister-systemInstruction in plaats van de Game Design Coach.

  **Voorstel** (`src/features/missions/GameDirectorMission.tsx:873-887`):
  ```tsx
  // Voor:
  <StudentAIChat
      userIdentifier={userId || 'anonymous'}
      isOpen={isChatOpen}
      onOpenChange={setIsChatOpen}
      context={{ ... }}
  />

  // Na:
  <StudentAIChat
      roleId="game-director"
      userIdentifier={userId || 'anonymous'}
      isOpen={isChatOpen}
      onOpenChange={setIsChatOpen}
      context={{ ... }}
  />
  ```

---

## 🔧 Tech review

### ✅ Goed

- **`useMissionAutoSave` correct gebruikt**: `'game-director'`-sleutel, alle relevante state (challenge-index, score, hard-mode, reflectie) bewaard. Restart-safe.
- **`clearSave()` wordt aangeroepen bij voltooiing**: `onExit`-handler in de conclusie roept `clearSave()` aan voor `onComplete(true)`.
- **Geen `dangerouslySetInnerHTML`**: alle gebruikersinvoer wordt via React's standaard escaping weergegeven.
- **Canvas-game-loop correct beheerd**: `requestAnimationFrame` is gebonden aan `isPlaying`; `cancelAnimationFrame` in de cleanup. Geen memory leaks bij tab-switch.
- **`BlockExecutor.reset()` bij handleReset**: garandeert dat `when_game_starts` opnieuw triggert na reset. Correcte aanpak.
- **Import-aliassen correct**: `@/features/...`, `@/hooks/...`, `@/types` consistent gebruikt.
- **Geen `@ts-ignore`** in het component zelf.
- **`supabase.functions.invoke` niet rechtstreeks in component**: AI-calls lopen via `StudentAIChat` → `useStudentAssistant` (edge function proxy).

### ⚠️ Aandachtspunten

- **TypeScript `any` in BlockTypes**: `BlockInput.default: any` en `PlacedBlock.inputs: Record<string, any>` (`BlockTypes.ts:9,19`). Verkeerde inputtypen kunnen pas runtime zichtbaar worden. Niet blocking voor de missie zelf, maar verhoogt onderhoudsrisico.

  **Voorstel** (`src/features/missions/game-director/BlockTypes.ts:9`):
  ```ts
  // Voor:
  default: any;
  ...
  inputs: Record<string, any>;

  // Na:
  type BlockInputValue = string | number;
  default: BlockInputValue;
  ...
  inputs: Record<string, BlockInputValue>;
  ```

- **Level 1 check inconsistent met andere levels**: `first_move` checkt `ctx.player.x > 150` (bereikt positie), terwijl levels 2-5 `ctx.reachedGoal` eisen. Leerling kan Level 1 halen zonder de bone te bereiken.

  **Voorstel** (`src/features/missions/GameDirectorMission.tsx:55`):
  ```ts
  // Voor:
  check: (ctx) => ctx.player.x > 150

  // Na:
  check: (ctx) => ctx.reachedGoal
  ```

- **`handleAddBlock` gebruikt `as Record<string, any>`** (regel 217): dit accepteert de `any`-default van BlockInput zonder typevalidatie.

- **`inputs: b.inputs`** doorgegeven aan StudentAIChat-context (regel 884): blok-inputwaarden (inclusief potentiële user-opgegeven strings) worden zonder sanitize doorgegeven als AI-context. Dit is low-risk omdat het via een edge function gaat die server-side het context injecteert, maar het is de moeite waard te controleren of de edge function deze waarden sanitized.

### ❌ Blokkers

- **`roleId` ontbreekt bij `StudentAIChat`** (zie didactiek): technisch gevolg is dat de server-side systemInstruction niet de Game Design Coach is. Dit is een eenregelige fix.

  **Voorstel**: zie didactiek-sectie.

- **Mobiele canvas-hoogte** (visueel niet geverifieerd, maar structureel risico): de canvas-container heeft `flex-1` maar geen `min-h` op mobiel. Zie design-sectie.

---

## Samenvatting

| As | Score | Status |
|---|---|---|
| UI/UX | 2/3 | Tokenmigratie compleet; icon-a11y en mobiele canvas nog open |
| Didactiek | 2/3 | Sterke kern; roleId-gap en SLO-inconsistentie blokkeren |
| Tech | 2/3 | Goed fundament; roleId + any-types zijn de openstaande punten |

**Auto-fixbare issues:** 6 (roleId, SLO-dashboard, goalCriteria min, level-1-check, aria-label, hover-state)
**Escalaties:** 0 (geen RLS/security/fundamentele redesign-issues)
