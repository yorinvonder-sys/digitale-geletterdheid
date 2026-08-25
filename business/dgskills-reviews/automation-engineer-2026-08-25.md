# Rubric-review: automation-engineer

**Datum:** 2026-08-25
**templateType:** builder-canvas
**Curriculum-plek:** Leerjaar 2, Periode 2 ("Programmeren & Computational Thinking")
**SLO-claim:** 22B (Programmeren), 21A (Digitale systemen) · VSO 19A, 18A

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Score:** 7/10

De config zelf bevat geen styling (geen JSX/Tailwind) — Criterium 1 (tokens), 2 (layout), 6 (Framer Motion) zijn dus niet van toepassing op dit bestand en al beoordeeld op engineniveau. Wat wél concreet voor deze missie geldt, is hoe de gedeelde engine haar 4 stappen + checklist + tekstvelden rendert.

### ✅ Geslaagd
- Copy-structuur is consistent met andere builder-canvas-missies (title, tip, checklistItems, textPrompt per stap) — `src/features/missions/templates/builder-canvas/configs/automation-engineer.ts:29-119`
- 4 heldere stappen met eigen checklist en tekstprompt, past bij het gedeelde template-patroon

### ⚠️ Aandachtspunten
- **Toegankelijkheid (contrast)** — elk van de 4 stappen gebruikt `StepInstructionPanel` en `ChecklistItem`, waar leerlingtekst, placeholder én checklist-labels allemaal op `/70`-opacity ink staan (engine: `sub/StepInstructionPanel.tsx:157` e.v., `sub/ChecklistItem.tsx:31`). Voor deze missie betekent dat: bij alle 4 checklists (16 items totaal) en alle 4 tekstvelden is het contrast tussen ingevoerde tekst en placeholder identiek — een leerling kan niet zien of hij al iets getypt heeft zonder te scrollen naar de teller.
  - **Voorstel:** engine-fix nodig (buiten scope van deze config); hier alleen vermeld omdat de missie 4× dit patroon activeert.
- **Mijlpaal-toast bij herlaad** — met 4 stappen triggert deze missie 4× de mijlpaal-toast (`showMilestone`). De engine-bug (toast blijft hangen bij herlaad binnen 2s, `BuilderCanvas.tsx:229`) is dus voor déze missie 4 kansen op een vastgeplakte "✓ n/4 voltooid!"-melding in plaats van 1.
- **Dubbele-klik risico op afronding** — geldt onveranderd voor deze missie: na stap 4 (testplan) kan de leerling met een dubbele klik/Enter-herhaling twee keer `onComplete` triggeren.

### ❌ Blocking issues
- Geen missie-specifieke blockers. De bovenstaande punten zijn engine-niveau en al als bevinding vastgelegd in de gedeelde builder-canvas-review; ze zijn hier herhaald omdat deze missie ze via 4 stappen extra vaak activeert.

**Visual Precision Gate:** niet dynamisch geverifieerd (geen Chrome-plugin-sessie in deze pass) — statisch oordeel op basis van config + gedeelde engine-bevindingen. Markeer als unverified voor live rendering.

---

## 📚 Didactiek review

**Score:** 7.5/10
**SLO-claim:** 22B, 21A (regulier) · 19A, 18A (VSO)
**Bloom-balans:** medium-hoog

### ✅ Geslaagd
- **SLO-codes correct** — 22B (Programmeren) en 21A (Digitale systemen) zijn beide geldige codes, twee stuks (niet te veel) — `src/config/slo-kerndoelen-mapping.ts:120`
- **SLO-fit sterk** — 22B wordt substantieel geraakt: leerlingen schrijven pseudocode met IF/THEN + lus (stap 2) én een Python-scriptstructuur met functies (stap 3). 21A (digitale systemen) is minder direct maar plausibel via "hoe een script/systeem stap-voor-stap werkt".
- **Curriculum-plek logisch** — leerjaar 2, periode 2 "Programmeren & Computational Thinking" naast `algorithm-architect`, `bug-hunter`, `code-reviewer` — `src/config/curriculum.ts:181-192`. Bouwt logisch voort op eerdere programmeer-missies in dezelfde periode.
- **Leerdoel helder + meetbaar** — `missionGoal.primaryGoal`: "Ik ontwerp een veilige automatisering door een herhaaltaak te analyseren, in stappen te zetten en te testen" — start met actiewerkwoord, concreet, en `missionGoals.ts:627-634` herhaalt dit consistent met de config.
- **Bloom-mix aanwezig** — analyseren (stap 1) → creëren/pseudocode (stap 2) → creëren/structureren (stap 3) → evalueren/testen (stap 4). Geen pure onthoud-quiz, goede hogere-orde-mix.
- **Scaffolding aanwezig** — elke stap heeft een `tip` met concreet voorbeeld (bijv. het kant-en-klare `verstuur_herinnering`-functievoorbeeld in stap 3), wat het hoge Bloom-niveau (creëren) voor leerjaar 2 draaglijk maakt.

### ⚠️ Aandachtspunten
- **Opdracht-beknoptheid overschreden voor leerjaar 1-2** — de skill-rubric stelt voor leerjaar 1-2 (waar leerjaar 2 onder valt): opdracht/instructie <60 woorden. Drie van de vier `instruction`-velden overschrijden dat duidelijk:
  - Stap 1 (`taak-analyse`): ±63 woorden — `automation-engineer.ts:35`
  - Stap 2 (`algoritme`): ±80 woorden — `automation-engineer.ts:48`
  - Stap 3 (`script-structuur`): ±85 woorden — `automation-engineer.ts:61`
  - Stap 4 (`testplan`): ±55 woorden — binnen de grens
  - **Wat:** elke instructie combineert een uitleg-zin met een genummerde lijst van 3-4 deelvragen, wat de woordentelling snel laat oplopen.
  - **Waarom:** voor 12-14-jarigen kan een instructie-blok van 4 losse deelvragen tegelijk cognitief zwaar zijn, zeker gecombineerd met de al hoge Bloom-eis (creëren).
  - **Voorstel:** de deelvragen zijn functioneel (ze sturen de checklist direct aan), dus schrappen is niet wenselijk — didactisch te verdedigen als context, maar wel de moeite waard om compacter te formuleren. Zie Voorstellen hieronder voor stap 2.
- **Presence-based scoring is een didactisch risico (Criterium 8 — XP-farming)** — de engine-bevinding "40 tekens plausibele tekst + alle vinkjes = volle stappunten" geldt voor alle 4 stappen van deze missie. Met `minTextLength: 150` (stappen 1-3) en `200` (stap 4) ligt de drempel wel hoger dan de engine-default van 40, wat het gokrisico enigszins beperkt, maar de checklist blijft pure zelfrapportage. Een leerling kan alle 16 checklist-items aanvinken zonder dat de tekst ze inhoudelijk dekt.
  - **Voorstel:** buiten scope van deze config (scoringslogica zit in de engine); vermeld hier zodat de docent weet dat eindscores op deze missie altijd een steekproef-nalezing verdienen.

### ❌ Blocking issues
Geen. SLO-codes zijn geldig, leerdoel is aanwezig en meetbaar, curriculum-plek klopt.

### SLO-fit oordeel
- **22B (Programmeren):** sterk geraakt — pseudocode (stap 2) en Python-scriptstructuur (stap 3) zijn kernactiviteiten van deze missie.
- **21A (Digitale systemen):** oppervlakkig-tot-matig geraakt — de missie behandelt automatisering van een taak/systeem, maar minder expliciet "systeemdenken" dan bijvoorbeeld `network-navigator`. Geen misalignment, wel de zwakste van de twee claims.

---

## 🔧 Tech review

**Score:** 8/10
**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin-sessie in deze rubric-pass; alleen static analyse van de config.

### Static analyse

#### ✅ Geslaagd
- **Geen `any`/`@ts-ignore`** in de config — volledig getypeerd via `BuilderCanvasConfig` — `automation-engineer.ts:1-3`
- **Consistente structuur** — alle 4 steps volgen hetzelfde shape (`checklistItems`, `textPrompt`, `minTextLength`), geen ontbrekende velden
- **`minTextLength` bewust hoger dan engine-default** (150/150/150/200 i.p.v. de default 40) — een expliciete, verstandige keuze die het presence-based-scoringsrisico van de engine deels compenseert
- **`maxScore: 100`** en 4 stappen — consistent met `missionGoals.ts` (`min: 4` steps-complete) en `slo-kerndoelen-mapping.ts`-entry; geen mismatch tussen de drie bronnen

#### ⚠️ Aandachtspunten
- **Geïmporteerde engine-risico's gelden onverkort** — het dubbele-`onComplete`-risico bij snel dubbelklikken (`CompletionScreen.tsx:163` / `BuilderCanvas.tsx:264`) en de `showMilestone`-persistentiebug (`BuilderCanvas.tsx:229`) zijn niet mission-specifiek oplosbaar; ze zijn al vastgelegd als engine-bevinding. Voor deze missie relevant omdat 4 stappen = 4 kansen op de toast-bug en 1 kans op de dubbele-klik-bug bij afronding.

#### ❌ Blocking issues
Geen missie-specifieke blockers in de config zelf.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze rubric-only pass. Visuele/interactieve claims boven zijn statisch, niet dynamisch bevestigd.

### Score
Static: 8/10 · Dynamic: n.v.t. · Aanbeveling: ship (met kennisname van de gedeelde engine-bevindingen)

---

## Voorstellen

### 1. Instructie stap 2 (`algoritme`) inkorten — didactiek, opdracht-beknoptheid

```ts
// ❌ Huidig — src/features/missions/templates/builder-canvas/configs/automation-engineer.ts:48
instruction:
    'Schrijf het algoritme voor je automatisering in pseudocode. Gebruik duidelijke stappen (STAP 1, STAP 2...), IF/THEN-constructies voor keuzes, en FOR-lussen voor herhalingen. Voorbeeld: "ALS het bestand al bestaat, SLA DAN OVER. ANDERS: hernoem het bestand." Schrijf minimaal 8 stappen.',

// ✅ Voorgesteld
instruction:
    'Schrijf je algoritme in pseudocode: minimaal 8 genummerde stappen (STAP 1, STAP 2...). Gebruik IF/THEN voor keuzes en een FOR-lus voor herhaling. Voorbeeld: "ALS het bestand bestaat, SLA OVER. ANDERS: hernoem het."',
```

Van ±80 naar ±40 woorden, zelfde inhoud en checklist-dekking (acht-stappen, if-then, lus, logisch) blijft intact.

### 2. Instructie stap 3 (`script-structuur`) inkorten — didactiek, opdracht-beknoptheid

```ts
// ❌ Huidig — src/features/missions/templates/builder-canvas/configs/automation-engineer.ts:61
instruction:
    'Schrijf de Python-structuur van je script. Gebruik: 1) Commentaarregels (#) om elke sectie te beschrijven, 2) Minstens 2 functiedefinities met `def functienaam():`, 3) Een main-sectie die de functies aanroept, 4) Beschrijf in commentaar welke Python-modules (= een gereedschapsset die Python al klaar heeft staan, bijv. `os` voor bestanden) je nodig hebt. Je hoeft de functies niet volledig te implementeren.',

// ✅ Voorgesteld
instruction:
    'Schrijf je Python-structuur: commentaarregels (#) per sectie, minstens 2 functies met `def functienaam():`, en een main-sectie die ze aanroept. Noem in commentaar welke Python-modules je nodig hebt (bijv. `os` voor bestanden). Je hoeft de functies niet volledig te implementeren.',
```

Van ±85 naar ±48 woorden, checklist-dekking (twee-functies, main, commentaar, modules) blijft gedekt.

---

## Samenvatting & verdict

De config van `automation-engineer` is technisch schoon en didactisch stevig: geldige SLO-codes, een meetbaar leerdoel, een logische curriculum-plek en een goede Bloom-mix (analyseren → creëren → evalueren) met scaffolding via tips. De belangrijkste eigen tekortkoming is dat 3 van de 4 instructie-velden de leerjaar-1-2-richtlijn van <60 woorden overschrijden — verdedigbaar omdat elke deelvraag direct een checklist-item aanstuurt, maar wel eenvoudig in te korten (zie Voorstellen). Daarnaast erft deze missie — via haar 4 stappen — de al bekende engine-risico's (presence-based scoring, dubbele-klik op afronden, mijlpaal-toast die blijft hangen, contrast op ink/70) vaker dan een missie met minder stappen, maar dit zijn geen missie-specifieke bugs.

**Verdict: ok** — geen blocking issues in de config zelf; de twee voorgestelde instructie-inkortingen zijn optioneel maar aan te raden.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
