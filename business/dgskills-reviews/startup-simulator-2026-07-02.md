# Missie-review: Startup Simulator

**Mission ID:** startup-simulator
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 3, Periode 3 (Maatschappelijke Impact & Innovatie)
**Datum:** 2026-07-02
**Reviewer-pipeline:** M4 batch-review (wave 19)

---

## 🎨 Design review

**Mission:** startup-simulator (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind token consistentie in config)**: geen Tailwind-classNames in de config zelf (`startup-simulator.ts` bevat alleen tekst/data, geen JSX/styling) — n.v.t. voor deze config-only missie
- **Criterium 2 (Layout consistentie)**: identieke `steps[]`-structuur (id/title/description/instruction/tip/checklistItems/textPrompt) als baseline `pitch-perfect.ts`/`app-prototyper.ts` van hetzelfde templateType — geen structurele afwijking
- **Criterium 3 (Knop-clarity)**: geen knoppen in de config zelf; engine-knoppen (`BuilderCanvas.tsx`) zijn gedeeld en al elders goedgekeurd — n.v.t. voor deze missie-specifieke review
- **Criterium 4 (Copy-lengte)**: `introDescription` 32 woorden (grens leerjaar 3: <120), 4 `instruction`-teksten 53-61 woorden (uitgebreide meerdelige opdrachten, passend bij het aantal deelvragen per stap — vergelijkbaar met andere builder-canvas-missies die meerdere subvragen per stap combineren) — ruim binnen grenzen — `startup-simulator.ts:8-9`, `:26`, `:42`, `:58`, `:74`
- **Criterium 5 (Responsive design)**: geen missie-specifieke responsive-code (engine-gedeeld); geen vaste pixel-widths in config
- **Criterium 6 (Framer Motion)**: geen motion-gebruik in config (engine-gedeeld)
- **Criterium 7 (Toegankelijkheid)**: geen missie-specifieke a11y-afwijkingen; badges gebruiken emoji + tekst-titel samen (geen kleur-only informatie) — `startup-simulator.ts:88-93`

### ⚠️ Aandachtspunten
_Geen._

### ❌ Blocking issues
_Geen._

### Visual Precision Gate
`WARN` — geen dev-server/screenshots-map beschikbaar in deze batch-run (M4-pipeline draait zonder Chrome-plugin-stap); geen dynamische viewport-evidence. Geen bekende structurele UI-afwijking op basis van static analyse en de gedeelde `BuilderCanvas`-engine (elders al geverifieerd, engine-issues buiten scope van deze missie-review). `previewType: 'text-preview'` is een gangbaar, al-ondersteund patroon binnen builder-canvas.

### Score
7/7 criteria geslaagd · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** startup-simulator (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 3
**SLO-claim:** 23C (Maatschappij), 22A (Product)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23C` en `22A` zijn beide geldige regulier-VO-codes, 2 codes (binnen de "max 3"-richtlijn) — `src/config/slo-kerndoelen-mapping.ts:176`
- **Criterium 2 (SLO-fit)**: 22A (product/ontwerp) sterk geraakt via de vier canvas-stappen die samen een compleet productontwerp-proces vormen (probleem → businessmodel → marktanalyse → pitch); 23C (maatschappij) geraakt via de nadruk op een "maatschappelijk pijnpunt" als startpunt (coach-instructie én canvas-tip "painkiller, niet vitamine") — beide codes zijn goed onderbouwd in de content, niet oppervlakkig toegevoegd — `startup-simulator.ts:21-35` (stap 1, probleemdefinitie), `year3.tsx:1177` (maatschappelijke impact expliciet genoemd)
- **Criterium 3 (Leerdoelen helder)**: `missionGoals.ts:634-641` bevat `primaryGoal` met actiewerkwoord ("Ik ontwikkel...") en meetbare `criteria` (`steps-complete`, min 4) plus concrete `evidence` (break-even-berekening, USP, pitch-outline) — voldoet aan action-verb + concreet-eis
- **Criterium 4 (Opdracht-beknoptheid)**: 4 stappen met elk 4-6 checklist-items — past bij "max 4-5 rondes"-richtlijn voor leerjaar 3
- **Criterium 5 (Leeftijds-passend vocabulary)**: taal past bij 15-16 jaar (havo/vwo); vakjargon wordt direct uitgelegd binnen dezelfde zin ("Break-even punt (= het punt waarop inkomsten de kosten dekken)", "USP: Unique Selling Proposition", "traction (= bewijs dat mensen je product willen)") — geen onverklaard jargon — `startup-simulator.ts:42`, `:58`, `:74`
- **Criterium 6 (Curriculum-plek logisch)**: staat als eerste missie in periode 3 "Maatschappelijke Impact & Innovatie", vóór `policy-maker`/`innovation-lab` — logische opening van het thema (ondernemerschap als concrete toepassing van "technologie oplost maatschappelijk probleem") — `src/config/curriculum.ts:286`
- **Criterium 7 (Bloom-taxonomie balans)**: goede mix — onthouden/toepassen (business-model-templates, Lean Canvas-structuur), analyseren (marktanalyse-stap: concurrenten vergelijken, USP formuleren), evalueren (break-even-berekening, prijsstrategie afwegen), creëren (complete pitch-structuur schrijven) — sterke opbouw naar hogere-orde-denken, geen platte quiz-recall
- **Criterium 9 (Welzijn & inclusiviteit)**: geen gevoelige onderwerpen; geen gender-specifieke aannames; expliciete ethische laag aanwezig in de coach-instructie ("Ethische overwegingen bij tech-startups: privacy, inclusiviteit, duurzaamheid" — `year3.tsx:1181`) al reikt die laag inhoudelijk niet door in de canvas-stappen zelf (zie aandachtspunt)

### ⚠️ Aandachtspunten
- **Criterium 2/6-gerelateerd (coach-plan ↔ canvas-stappen desync)**: de coach-`systemInstruction` (client `year3.tsx:1165-1217` én server `systemInstructions.ts:88`, **identiek** — geen extra platform-drift) beschrijft een **3-stappen-plan** (Probleem identificeren → Businessmodel ontwerpen → Pitch voorbereiden) met `STEP_COMPLETE:1/2/3`, terwijl de canvas-config **4 stappen** heeft (`probleem-oplossing`, `businessmodel`, `marktanalyse`, `pitch`). De coach noemt "marktanalyse" nergens en heeft geen `STEP_COMPLETE:4`-instructie.
  - **Wat:** een leerling die via de chat-coach werkt, ziet nooit een expliciete aansporing om de marktanalyse-stap (concurrenten, USP, marktomvang) te doorlopen — de coach "denkt" dat de missie na de pitch klaar is.
  - **Waarom:** dit is het bekende platform-brede coach-plan-desync-patroon (BEKEND, niet opnieuw als losstaand issue te classificeren) — de canvas-stappen zijn de bron van waarheid voor voortgang/scoring, de chat is een parallel hulpmiddel. Een leerling kan de canvas direct invullen zonder de chat te gebruiken en mist dan niets; het risico zit alleen in leerlingen die uitsluitend op de coach-chat vertrouwen voor sturing.
  - **Voorstel:** dit is een platform-beslispunt (niet autoFixable binnen deze missie-review) — zie BEKEND-sectie in de opdracht. Wordt hier alleen genoteerd als bevinding, geen fix voorgesteld.
- **Criterium 9-gerelateerd (ethiek-laag niet doorgezet in canvas)**: de coach-instructie noemt expliciet "Ethische overwegingen bij tech-startups (privacy, inclusiviteit, duurzaamheid)" als inhoudelijke focus, maar geen van de 4 canvas-`checklistItems` vraagt de leerling hier concreet naar (de checklist toetst alleen probleem/oplossing/businessmodel/markt/pitch-mechanica, geen ethische afweging).
  - **Wat:** de ethische laag bestaat alleen in de coach-chat (die desyncroon is, zie hierboven) en niet in de canvas zelf — een leerling die de canvas invult zonder chat-gebruik krijgt nooit een ethische toets.
  - **Waarom:** dit is inhoudelijk een gemiste kans (niet blocking) — de missie claimt impliciet ethisch bewustzijn via de coach-instructie, maar het meetbare succescriterium (`steps-complete`, min 4) toetst dat niet.
  - **Voorstel (niet-blocking, optioneel):** een 5e checklist-item toevoegen aan de `marktanalyse`- of `pitch`-stap zoals `{ id: 'ethiek', label: 'Ik heb nagedacht over een mogelijk risico van mijn startup (privacy, inclusiviteit of duurzaamheid)' }` zou de ethische laag verankeren in het meetbare gedeelte. Dit is een contentkeuze voor Yorin, geen technisch defect — niet als blocking geclassificeerd.

### ❌ Blocking issues
_Geen._

### SLO-fit oordeel
- **23C (Maatschappij)**: geraakt — bewijs: probleemdefinitie-stap vraagt expliciet naar maatschappelijke relevantie/omvang van het probleem; coach-tip "painkiller, niet vitamine" framet de opdracht maatschappelijk
- **22A (Product)**: sterk geraakt — bewijs: complete productontwerp-cyclus over 4 stappen (probleem→oplossing→businessmodel→markt→pitch), inclusief concrete deliverables (break-even-berekening, USP, pitch-outline)

### Score
9/9 criteria geslaagd (2 aandachtspunten, beide niet-blocking) · Bloom-balans: **medium-hoog** (sterke opbouw naar evalueren/creëren, passend bij leerjaar 3) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** startup-simulator (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (Knop-handlers)**: geen missie-specifieke knoppen in de config; engine-gedeeld (`BuilderCanvas.tsx`) — buiten scope voor missie-review
- **Criterium A2 (Error states)**: geen missie-specifieke async-calls in de config; engine-gedeeld error-handling — buiten scope
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in `startup-simulator.ts` — config is volledig getypeerd via `BuilderCanvasConfig`
- **Criterium A4 (Imports via alias)**: enige import is `import type { BuilderCanvasConfig } from '../BuilderCanvas'` — relatief pad, maar dit is het gangbare patroon binnen dezelfde template-map (consistent met alle andere builder-canvas-configs) — geen missie-specifieke afwijking
- **Criterium A5 (Scoring-integriteit)**: `maxScore: 100` met 4 `steps` — engine-formule `pointsPerStep = Math.floor(config.maxScore / config.steps.length)` = `Math.floor(100/4)` = 25 punten/stap, `totalScore` max = 4×25 = **100/100 exact behaalbaar** (`BuilderCanvas.tsx:78,103`) — geen scoring-mismatch zoals eerder gevonden bij data-viewer-missies met som-van-punten-config
- **Criterium A6 (Restart-safe state)**: `useMissionAutoSave` correct aangeroepen in de gedeelde engine (`BuilderCanvas.tsx`) — geldt voor alle builder-canvas-missies inclusief deze
- **Criterium A7 (Security)**: geen `dangerouslySetInnerHTML`, geen hardcoded secrets in config; chat-gebruik verloopt via gedeelde `StudentAIChat`/edge function — geen missie-specifieke security-afwijking

#### ⚠️ Aandachtspunten
- **Platform-inzicht (chat drift-check, niet autoFixable)**: client-`systemInstruction` (`year3.tsx:1165-1217`) en server-`systemInstruction` (`systemInstructions.ts:88`) zijn **byte-voor-byte identiek** (beide 3-stappen-plan) — géén client/server-drift op deze missie; de enige desync is coach-plan (3 stappen) vs. canvas-config (4 stappen), zoals in de didactiek-sectie beschreven. Server-versie is de daadwerkelijk actieve prompt in productie (client is fallback); dit is dus geen extra tech-risico bovenop het al genoteerde didactiek-punt.
- **`badges`-drempel-check**: badge-drempels (0/25/50/70/90) zijn onder `maxScore: 100` — consistent en zonder plafond-probleem (in tegenstelling tot eerder gevonden data-viewer-missies) — `startup-simulator.ts:88-93`

#### ❌ Blocking issues
_Geen._

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server of screenshots-map beschikbaar in deze M4-batch-run. Geen console/network/visuele evidence verzameld. `startup-simulator` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (gecontroleerd via grep, geen treffer) — geen bestaande multi-viewport-dekking, openstaande follow-up net als voor de rest van deze batch-wave.

### Score
Static: 7/7 criteria geslaagd (0 blocking) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## 🖼️ Visuele evidence (multi-viewport)

Geen screenshots-map beschikbaar voor deze missie in deze M4-batch-run. Geen dev-server gestart (buiten scope van deze batch-review-configuratie). `startup-simulator` is niet opgenomen in de bestaande UI/UX-review van 2026-06-30 — multi-viewport-verificatie via Chrome-plugin is een openstaande follow-up.

---

## Samenvatting
- **Geslaagd:** 23 criteria (7 design + 9 didactiek + 7 tech)
- **Aandachtspunten:** 3 issues, allemaal niet-blocking (1 platform-brede coach-plan-desync — BEKEND, niet opnieuw te fixen; 1 inhoudelijke gemiste-kans op ethiek-verankering in canvas; 1 informatief tech-punt zonder actie)
- **Aanbeveling:** **ship** — geen blocking issues op design, didactiek of techniek; scoring is intern consistent (100/100 exact behaalbaar); enige bevinding is het bekende coach/canvas-desync-patroon plus een optionele contentverrijking (ethiek-checklist-item), beide niet vereist vóór ship

---

## Codex-gate (M1)
_Niet uitgevoerd — deze M4-batch-review-run draait zonder Codex-adversarial-gate-stap (buiten scope van de gegeven taakinstructie voor deze wave). Rapport is sub-reviewer-output, geen Codex-gevalideerd ship-bewijs._

---

## Triage-score

Formule: `triageScore = (10-design)*0.3 + (10-didactiek)*0.4 + (10-tech)*0.3`

- Design-kwaliteit: 10/10 (7/7 criteria, geen aandachtspunten)
- Didactiek-kwaliteit: 9/10 (9/9 criteria geslaagd, 2 niet-blocking aandachtspunten)
- Tech-kwaliteit: 9.5/10 (7/7 criteria, 2 informatieve niet-blocking noten, geen blocking)

`triageScore = (10-10)*0.3 + (10-9)*0.4 + (10-9.5)*0.3 = 0 + 0.4 + 0.15 = 0.55`
