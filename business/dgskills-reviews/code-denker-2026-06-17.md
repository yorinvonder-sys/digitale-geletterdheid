# Mission Review: code-denker
**Datum:** 2026-06-17
**Template:** scenario-engine
**Pipeline:** M4 batch-review wave-2
**Reviewer:** dgskills-batch-review (Sonnet 4.6)

---

## 🎨 Design Review

**Mission:** code-denker (scenario-engine)
**Reviewer:** dgskills-design-reviewer (ingebouwd in orchestrator)

### ✅ Geslaagd

- **Criterium 1 (Tailwind tokens):** Config bevat geen Tailwind class-strings — design tokens zitten uitsluitend in de gedeelde `ScenarioEngine.tsx` en sub-componenten, die `duck-*` tokens correct gebruiken (duck-bg, duck-ink, duck-acid, duck-error). De config heeft alleen `color` in `BadgeConfig`, typed als `string` en gedocumenteerd als `'// tailwind-compatible color like '#202023''` in `src/features/missions/templates/shared/types.ts:49`. Dit is by-design.
- **Criterium 2 (Layout consistentie):** Config volgt het identieke patroon als andere scenario-engine configs (introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, rounds[]).
- **Criterium 3 (Knop-clarity):** Alle interactieve elementen zitten in de gedeelde engine; config definieert geen knoppen. Engine-knoppen (submit, volgende) zijn correct gekoppeld.
- **Criterium 4 (Copy-lengte leerjaar 1):** Alle copy-velden ruim binnen limiet: introDescription 38 woorden (limiet 80), ronde-beschrijvingen 22-31 woorden (limiet 60). Geen overschrijdingen.
- **Criterium 5 (Responsive):** Config-only — engine handelt viewport-logica met `max-w-md mx-auto` en mobile-first `p-4`. Geen vaste pixel-widths in config.
- **Criterium 6 (Framer Motion):** Geen Framer Motion in config; engine-gebruik is minimaal en functioneel.
- **Criterium 7 (Toegankelijkheid basis):** Icons zijn emoji (decoratief), tekst-labels beschikbaar. Engine heeft `aria-label="Laden..."` op spinner.

### ⚠️ Aandachtspunten

- **Badge color hex-literals:** `src/features/missions/templates/scenario-engine/configs/code-denker.ts:28,34,40,46` — alle vier badges hebben `color: '#202023'`. Dat is het `duck-ink`-hex. Dit is niet fout (types.ts schrijft dit voor als `string`), maar top-badge (`Meester Algoritme-Denker`) heeft dezelfde inkkleur als de laagste badge. In `cookie-crusher.ts` gebruikt de top-badge `'#ff3c21'` (duck-error) voor visueel onderscheid. Aandachtspunt, geen blocker.
  - **Wat:** Alle vier badges zijn visueel identiek qua achtergrondkleur in het CompletionScreen gradient.
  - **Waarom:** Leerling die het hoogste badge behaalt ziet dezelfde visuele beloning als degene die het laagste behaalt — vermindert motivatie-feedback.
  - **Voorstel:** Top-badge `color: '#e1ff01'` (duck-acid) of `'#ff3c21'` (duck-error/accentrood, zoals cookie-crusher).

- **Visual Precision Gate:** Geen dev-server beschikbaar in batch-review context; geen screenshots aanwezig (`geen bestaande screenshots — dynamische visuele verificatie overgeslagen`). Statische analyse suggereert geen layout-problemen, maar gate kan niet als PASS geverifieerd worden. Gemarkeerd als UNVERIFIED.

### ❌ Blocking issues

Geen.

### Score

6/7 criteria geslaagd (Criterium 7 deels unverified door ontbrekende screenshots). Visual Precision Gate: UNVERIFIED.
**Aanbeveling:** ship (minor badge-kleur aandachtspunt, geen blocker)

---

## 📚 Didactiek Review

**Mission:** code-denker (scenario-engine)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** 22B (Programmeren) · VSO: 19A
**Reviewer:** dgskills-didactiek-reviewer (ingebouwd in orchestrator)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** `['22B']` is een geldige reguliere code (Programmeren); `['19A']` is een geldige VSO-code. Eén kerndoel — prima scope.
- **Criterium 2 (SLO-fit):** 22B = Programmeren. De missie behandelt computational thinking: decompositie, patroonherkenning, abstractie, algoritmen. Computational thinking is het primaire denkraamwerk van programmeren en staat expliciet onder 22B in het SLO-kader. Geraakt via vier rondes met actief oefenen. `src/config/slo-kerndoelen-mapping.ts:52` bevestigt de weloverwogen keuze (comment: "-21D: puur computational thinking, geen AI").
- **Criterium 3 (Leerdoelen helder):** Vier leerdoelen aanwezig in `learningObjectives`. Alle vier starten met meetbaar actiewerkwoord: "herkent" (Bloom: onthouden/begrijpen), "zet ... in volgorde" (toepassen), "onderscheidt" (analyseren), "selecteert" (toepassen/analyseren). Concreeet en gedragsgericht. `src/features/missions/templates/scenario-engine/configs/code-denker.ts:17-21`.
- **Criterium 4 (Opdracht-beknoptheid):** Leerjaar 1 limit: intro <80, ronde <60 woorden. Alle rondes ruim binnen limiet. Ronde-items hebben eigen beschrijvingen maar die zijn per-item, niet per scherm.
- **Criterium 5 (Leeftijdspassend):** Alledaagse voorbeelden (verjaardag organiseren, pindakaasboterham, route naar Albert Heijn, Fibonacci-reeks). Directe, motiverende tone-of-voice. Geen academisch jargon zonder uitleg; alle vier concepten worden in introDescription kernachtig uitgelegd.
- **Criterium 6 (Curriculum-plek):** Leerjaar 1, Periode 2, Week 2. Past na de AI/prompt-periode (Periode 1) als verdieping in programmeerdenkwijzen. Sluit aan op `game-programmeur` en `chatbot-trainer` in dezelfde periode.
- **Criterium 8 (AI-as-copilot):** Geen `enableChat` in templateRegistry entry (`src/config/templateRegistry.ts:19`). Niet van toepassing.
- **Criterium 9 (Welzijn & inclusiviteit):** VSO-mapping aanwezig. Geen gevoelige onderwerpen. Genderneutrale taal.

### ⚠️ Aandachtspunten

- **Criterium 7 (Bloom-balans — herhaling vs hogere orde):** Rondes 1 en 4 zijn herkenningsrondes (select-correct) op Bloom-niveau "onthouden/begrijpen". Ronde 2 (volgorde ordenen) is "toepassen". Ronde 3 (abstractie-oordeel) is "analyseren". De balans is voldoende voor leerjaar 1, maar er is geen reflectievraag of zelf-formulering (creëren). De `takeaways` zijn puur informatief, geen actieve verwerking. Aandachtspunt voor volgende iteratie.

- **missionGoal mismatch:** `src/config/missionGoals.ts:138` — `primaryGoal: 'Ik herken programmeerlogica door stappen, voorwaarden en volgorde goed te lezen.'`. Het woord "voorwaarden" (conditionals/if-else) dekt de missie-inhoud niet: de missie behandelt decompositie, patroonherkenning, abstractie en algoritmen — maar geen conditionele logica (if/else, loops). "Voorwaarden" is een accurate term voor programmeerlogica maar misleidend voor de specifieke inhoud van deze missie.
  - **Wat:** primaryGoal noemt "voorwaarden" maar geen van de vier rondes oefent conditionele logica.
  - **Waarom:** Leerling weet niet precies wat hij zal oefenen; kleine perceptie-mismatch.
  - **Voorstel:** `primaryGoal` aanpassen naar: `'Ik herken de vier bouwstenen van computational thinking: decompositie, patroonherkenning, abstractie en algoritmen.'`

### ❌ Blocking issues

Geen.

### SLO-fit oordeel

- **22B (Programmeren):** Sterk geraakt — alle vier rondes oefenen programmeer-denkwijzen actief (decompositie herkennen, algoritme ordenen, abstractie beoordelen, patronen selecteren). Geen oppervlakkig contact.
- **19A (VSO):** Parallel aan 22B, inhoud past.

### Score

8/9 criteria geslaagd. Bloom-balans: medium (Bloom 1-3, geen 4-6). missionGoal-tekst is klein autofix.
**Aanbeveling:** fix-eerst (missionGoal-tekst) — dan ship

---

## 🔧 Tech Review

**Mission:** code-denker (scenario-engine)
**Reviewer:** dgskills-tech-reviewer (ingebouwd in orchestrator)
**Dynamic verificatie:** overgeslagen — DGSkills SPA is state-based (geen URL per missie). Multi-viewport visuele verificatie niet uitgevoerd.

### Static analyse

#### ✅ Geslaagd

- **A1 (Knop-handlers):** Config heeft geen knoppen; engine-knoppen zijn alle correct gekoppeld (handleSubmit, handleNextRound, handleToggle, handleBinaryChoice, handleAddToOrder, handleResetOrder in `ScenarioEngine.tsx:140-177`). Geen dode knoppen.
- **A2 (Error states):** Engine heeft `LoadingScreen` en `ErrorScreen` voor async load-failure (`ScenarioEngine.tsx:37-79`). Config-load via dynamic import met catch. User-friendly foutmelding aanwezig.
- **A3 (TypeScript-discipline):** Config is strikt getypeerd via `const config: ScenarioEngineConfig = { ... }`. Geen `any`, geen `@ts-ignore`. Alle velden matchen de type-definitie in `src/features/missions/templates/scenario-engine/types.ts`.
- **A4 (Imports via `@/*`):** Config heeft geen eigen imports buiten `import type { ScenarioEngineConfig } from '../types'` (relatief, maar dat is standaard binnen hetzelfde subpakket). Engine gebruikt `@/hooks/...`, `@/config/...` correct.
- **A5 (Edge function calls):** Geen edge function calls in deze missie. Niet van toepassing.
- **A6 (Restart-safe state):** Engine gebruikt `useMissionAutoSave` (`ScenarioEngine.tsx:116`). Voortgang wordt bewaard tussen sessies.
- **A7 (Security):** Geen user-input naar AI. Geen `dangerouslySetInnerHTML`. Config is statische TypeScript — geen injection-risico's.

#### ⚠️ Aandachtspunten

- **maxScore ↔ badge-drempel:** `maxScore: 100`, topbadge `minScore: 80`. Perfecte score geeft geen speciale badge boven 80 — is by-design voor dit systeem (80%+ = top). Consistent met cookie-crusher en andere configs.
- **selectie-check ronde 1 & 4:** Beide zijn `select-correct` met 4 correcte antwoorden uit 8. Scoring via `scoreSelectCorrect`: `(correctSelected / correctIds.length) * 25 - incorrectSelected * 4`. Dit kan negatief worden als leerling alles aanklikt. `Math.max(0, ...)` vangt dit op. Goed.

#### ❌ Blocking issues

Geen.

### Dynamic verificatie

Overgeslagen — DGSkills SPA is state-based (geen URL per missie). Voor automatische Fase B is een dev-preview route (bv. `/dev/mission/<id>` met auth-bypass in `import.meta.env.DEV`) een follow-up taak.

### Score

Static: 7/7 · Dynamic: n.v.t.
**Aanbeveling:** ship

---

## Samenvatting

| As | Score (0-10) | Oordeel |
|---|---|---|
| Design | 8 | Top-badge kleur minder onderscheidend; visuele gate unverified |
| Didactiek | 7 | missionGoal noemt "voorwaarden" maar missie dekt dat niet |
| Techniek | 9 | Volledig correct; geen blocking issues |

**triageScore:** (10-8)*0.3 + (10-7)*0.4 + (10-9)*0.3 = 0.6 + 1.2 + 0.3 = **2.1** (laag = goed)

**Verdict:** fix-eerst — één autofix (missionGoal-tekst), daarna ship.

### Escalaties

Geen escalaties noodzakelijk.

### AutoFix — missionGoal tekst

**File:** `src/config/missionGoals.ts:138`

```
BEFORE:
primaryGoal: 'Ik herken programmeerlogica door stappen, voorwaarden en volgorde goed te lezen.',

AFTER:
primaryGoal: 'Ik herken de vier bouwstenen van computational thinking: decompositie, patroonherkenning, abstractie en algoritmen.',
```
