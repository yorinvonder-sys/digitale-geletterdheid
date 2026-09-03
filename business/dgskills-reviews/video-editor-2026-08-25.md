# Missie-review: video-editor

**Datum:** 2026-08-25
**templateType:** builder-canvas
**Leerjaar/periode:** leerjaar 2, week 3 (SLO 22A, 21B / vso 19A, 18B)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 8/10

### ✅ Geslaagd
- Geen hardcoded hex-kleuren of afwijkende tokens in de config; content-only bestand, geen JSX/className hier.
- 4 stappen met consistente structuur (title/description/instruction/tip/checklistItems/textPrompt) — volgt exact het builder-canvas-patroon.
- `badges`-drempels lopen consistent op (0/25/50/70/90) en dekken de volle score-range van 0–100.

### ⚠️ Aandachtspunten
- **Bekend engineprobleem, hier van toepassing:** de gedeelde `StepInstructionPanel`/`ChecklistItem`-tokens (`text-duck-ink/70`) gelden voor élke builder-canvas-missie inclusief deze; contrast-risico op het eigen antwoordveld en de checklist-labels. Config-niveau geen fix mogelijk (engine-bestand, buiten scope van deze missie).
- Vier iconen voor vijf-of-meer stappen (engine-bevinding) is hier niet van toepassing — deze missie heeft precies 4 stappen, dus alle iconen zijn uniek. Geen actie nodig.

### ❌ Blocking issues
- Geen missie-specifieke blocking design-issues gevonden.

Visual Precision Gate: **unverified** — geen Chrome-plugin/dev-server-bewijs beschikbaar in deze pass; alleen statische config-analyse uitgevoerd.

---

## Didactiek — score 7/10

### ✅ Geslaagd
- SLO-codes `22A`/`21B` (vso `19A`/`18B`) komen overeen met de entry in `slo-kerndoelen-mapping.ts:138`; consistent met curriculum-plaatsing leerjaar 2.
- `missionGoals.ts:591-597` sluit aan op de 4 configstappen (`min: 4`, evidence noemt expliciet 5 scènes / 8 shots — identiek aan de checklist-eisen in de config).
- Duidelijke leerdoelprogressie: concept → storyboard → shotlist → montageplan, oplopend in Bloom-niveau (begrijpen → toepassen → analyseren/creëren).
- Vaktermen worden direct uitgelegd tussen haakjes ("voice-over (= ingesproken stem…)", "dissolve (= overvloeien)") — goed voor leeftijdsgroep 12-13 jaar.

### ⚠️ Aandachtspunten
- **Opdracht-beknoptheid (Criterium 4):** voor leerjaar 1-2 geldt een richtlijn van <60 woorden per opdracht/vraag. Twee van de vier `instruction`-velden overschrijden dit: storyboard (66 woorden) en montageplan (66 woorden). De opsomming met genummerde deel-eisen (1-4) maakt het wel goed scanbaar, maar de rauwe woordentelling zit boven de leerjaar-1-2-grens. Concreet voorstel hieronder.
- Zoals de engine-bevinding ook al signaleert: scoring is presence-based (checklist + 40 tekens tekst) — bij deze missie is er geen aparte verdiepingsvraag die inhoudelijk discrimineert (config heeft geen `deepDivePrompt`/bonusvraag-veld), dus de volledige 100 punten zijn hier zelfrapportage. Dat is een missie-config-keuze (geen extra discriminerende vraag toegevoegd), niet alleen een engine-gegeven.

### ❌ Blocking issues
- Geen.

---

## Tech — score 9/10

### Static analyse
- Config is puur data (geen JSX, geen handlers) — voldoet aan het builder-canvas-contract (`BuilderCanvasConfig`-type correct geïmporteerd en gebruikt).
- `enableChat: true` + `chatRoleId: 'video-editor'` staat consistent in zowel de config als `templateRegistry.ts:54`.
- Geen ontbrekende velden: alle verplichte config-keys (`missionId`, `title`, `steps[].checklistItems`, `maxScore`, `badges`, `takeaways`) zijn aanwezig en `maxScore: 100` is consistent met wat de engine als cap gebruikt.
- Engine-bevindingen (afrondknop dubbelklik, showMilestone-persistentie, geen onRetry) zijn generiek voor alle builder-canvas-missies — niet missie-specifiek fixbaar op configniveau, hier genoemd ter volledigheid, niet als aparte bevinding.

### Dynamic verificatie
- Niet uitgevoerd in deze pass (geen dev-server/browserbewijs beschikbaar). Aanbevolen bij een latere live-check via `opdracht-live-check`.

### ❌ Blocking issues
- Geen missie-specifieke blocking tech-issues.

---

## Voorstellen

### 1. Opdracht-beknoptheid: storyboard-instructie inkorten (didactiek, warning)

**Bestand:** `src/features/missions/templates/builder-canvas/configs/video-editor.ts`

Voor:
```ts
instruction:
    'Schrijf een tekstueel storyboard voor je video met minimaal 5 scènes. Voor elke scène: 1) Wat zie je in beeld? (beschrijving van de shot), 2) Wat hoor je? (dialoog, voice-over (= ingesproken stem over de beelden) of muziek), 3) Hoe lang duurt de scène? (in seconden), 4) Camerahoek (totaalshot, close-up, over-the-shoulder (= over iemands schouder gefilmd)). Begin met een sterke openingsscène die meteen de aandacht trekt.',
```

Na (kort de camerahoek-uitleg in, verplaats naar de `tip`):
```ts
instruction:
    'Schrijf een tekstueel storyboard voor je video met minimaal 5 scènes. Voor elke scène: 1) Wat zie je in beeld?, 2) Wat hoor je? (dialoog, voice-over of muziek), 3) Hoe lang duurt de scène? (in seconden), 4) Camerahoek. Begin met een sterke openingsscène die meteen de aandacht trekt.',
tip: 'De eerste 3 seconden bepalen of mensen blijven kijken. Begin dus niet met een logo of een "Hoi, welkom bij…". Begin direct met actie of een prikkelende vraag. Camerahoeken: totaalshot, close-up, of over-the-shoulder (= over iemands schouder gefilmd).',
```

### 2. Opdracht-beknoptheid: montageplan-instructie inkorten (didactiek, warning)

**Bestand:** `src/features/missions/templates/builder-canvas/configs/video-editor.ts`

Voor:
```ts
instruction:
    'Schrijf een montageplan: 1) De definitieve volgorde van je shots (geef shottitels of nummers), 2) Welke overgangstypen je gebruikt (hard cut, dissolve (= overvloeien), fade to black (= langzaam naar zwart)) en waarom, 3) Welk type muziek of geluid past bij elke sectie, 4) Waar de pacing (= het tempo van de video) versnelt en waar het rustiger wordt. Leg bij elk punt de motivatie uit.',
```

Na:
```ts
instruction:
    'Schrijf een montageplan: 1) De definitieve volgorde van je shots, 2) Welke overgangstypen je gebruikt (hard cut, dissolve, fade to black) en waarom, 3) Welk type muziek past bij elke sectie, 4) Waar de pacing (= het tempo) versnelt of rustiger wordt.',
tip: 'Minder overgangen = professioneler. Gebruik "hard cuts" (direct knippen) als standaard en dissolves (= overvloeien) of fades (= langzaam naar zwart) alleen voor bewuste, emotionele momenten.',
```

---

## Samenvatting

Deze missie is inhoudelijk sterk gebouwd: SLO-koppeling, curriculum-plek en missionGoals sluiten strak op elkaar aan, en de vier stappen vormen een logische productieketen (concept → storyboard → shotlist → montage) met heldere leeftijdspassende uitleg van vaktermen. De enige concrete missie-eigen bevinding is dat twee van de vier opdracht-instructies iets boven de leerjaar-1-2-richtlijn van 60 woorden zitten (66 woorden) — een kleine, niet-blokkerende tekstredactie. De overige aandachtspunten (contrastrisico invoerveld, presence-based scoring, dubbelklik-risico) zijn allemaal engine-brede bevindingen die al zijn vastgesteld en niet op configniveau van deze missie op te lossen zijn.

**Verdict: ok** (geen blocking issues; twee kleine, autofixable warnings)
