# Missie-review: AI Tekengame

**Mission ID:** ai-tekengame
**Template:** handcrafted
**Curriculum-plek:** Leerjaar 1, Periode 2 - AI & Creatie
**Datum:** 2026-05-09
**Reviewer-pipeline:** dgskills-mission-review (Codex GPT-5.5)

---

## 🎨 Design review

**Mission:** ai-tekengame (handcrafted)
**Reviewer:** dgskills-design-reviewer (Codex)

### ✅ Geslaagd
- **Interactieve flow is visueel concreet:** de leerling krijgt een echt tekenvlak, score, timer, ronde-indicator en analyse-overlay; Chrome-check op desktop bevestigde intro, tekenstaat, analyse en resultaatstaat - `components/DrawingGamePreview.tsx:765`.
- **Knoppen zijn herkenbaar en groot genoeg:** `Wissen`, `Klaar`, `Volgende` en de header-acties gebruiken icoon plus label en hebben grote touch targets - `components/DrawingGamePreview.tsx:971`.
- **Canvas-fit op desktop:** in Chrome desktop bleef het tekenvlak volledig zichtbaar met de onderste acties in beeld tijdens de tekenfase - `components/DrawingGamePreview.tsx:872`.
- **Visual Precision Gate:** desktop Chrome is bekeken voor intro, draw, analyse en result. Geen overlap in deze desktop-flow; mobiel/tablet zijn niet volledig dynamisch geverifieerd.

### ⚠️ Aandachtspunten
- **CTA kan onder de vouw vallen in de intro:** in de Chrome-harness stond de startknop niet zichtbaar in de eerste viewport nadat de stappen zichtbaar waren; de knop is wel bereikbaar via scroll/accessibility, maar voor een game-start is dit onnodige frictie - `components/DrawingGamePreview.tsx:693`.
  - **Wat:** intro-content staat bovenaan in een scrollcontainer, met avatar, speech bubble, titel en stappenkaart voor de primaire actie.
  - **Waarom:** leerlingen kunnen denken dat de intro nog niet klaar is of de startknop missen.
  - **Voorstel:**
```tsx
// Huidig
<div className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 overflow-y-auto">

// Voorgesteld
<div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 overflow-y-auto">
```
- **Tailwind token-consistentie is laag:** de missie gebruikt veel hex literals terwijl dezelfde lab-tokens bestaan - `components/DrawingGamePreview.tsx:691`.
  - **Wat:** onder andere `#FCF6EA`, `#FFFDF7`, `#E7D8BD`, `#08283B`, `#445865`, `#5F947D` en `#0B453F` staan inline.
  - **Waarom:** dit maakt redesigns en contrastcontrole lastiger.
  - **Voorstel:**
```tsx
// Huidig
style={{ backgroundColor: '#FCF6EA', color: '#445865' }}

// Voorgesteld
className="bg-lab-bg text-lab-muted"
```

### ❌ Blocking issues
- Geen design-blocker gevonden op de desktop-flow. Door ontbrekende mobile/tablet Chrome-verificatie krijgt de Visual Precision Gate geen volledige `ship`.

### Score
5/7 geslaagd - Aanbeveling: fix-eerst

---

## 📚 Didactiek review

**Mission:** ai-tekengame (handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** 21D | VSO: 18C
**Reviewer:** dgskills-didactiek-reviewer (Codex)

### ✅ Geslaagd
- **SLO-fit 21D is sterk:** de missie laat leerlingen ervaren dat AI patronen in beelden herkent en onzeker kan zijn bij afwijkende tekeningen - `config/agents/year1.tsx:3637`.
- **Leeftijdspassende uitleg:** de "1 miljoen mensen tekenen een kat"-analogie is concreet en geschikt voor leerjaar 1 - `config/agents/year1.tsx:3642`.
- **Basisvaardigheid sluit aan:** de mapping koppelt ai-tekengame expliciet aan patroonherkenning - `config/basisvaardigheden-mapping.ts:182`.
- **Curriculum-plek logisch:** de missie staat in leerjaar 1 periode 2, AI & Creatie - `config/curriculum.ts:80`.

### ⚠️ Aandachtspunten
- **Opdrachtverwachting klopt niet met de echte game:** de missiekaart zegt "Teken 3 objecten" en "20 seconden", maar de component gebruikt 10 rondes en 45 seconden - `config/agents/year1.tsx:3608`, `config/agents/year1.tsx:3666`, `components/DrawingGamePreview.tsx:360`, `components/DrawingGamePreview.tsx:365`.
  - **Wat:** briefing en spelregels spreken elkaar tegen.
  - **Waarom:** leerlingen en docenten krijgen een andere tijds- en inspanningsverwachting dan de game vraagt.
  - **Voorstel:**
```text
missionObjective: 'Teken 10 korte objecten en ontdek welke patronen de AI herkent.'
steps[0].description: 'Je krijgt een woord en hebt 45 seconden om te tekenen.'
```
- **Reflectievragen bestaan vooral in de chatrol, niet in de gameflow:** de game toont wel analyse, maar vraagt de leerling niet actief te reflecteren op waarom de AI goed/fout zat - `config/agents/year1.tsx:3653`, `components/DrawingGamePreview.tsx:931`.
  - **Wat:** de result card geeft uitleg, maar geen kleine reflectiehandeling.
  - **Waarom:** de leerwinst van 21D wordt sterker als leerlingen zelf één observatie benoemen.
  - **Voorstel:** voeg na elke 2-3 rondes één korte prompt toe: "Welk patroon hielp de AI het meest?"

### ❌ Blocking
- Geen didactische blocker, maar de briefing/game-mismatch moet vóór pilotgebruik worden rechtgetrokken.

### N.v.t.
- **AI-as-copilot:** deze missie gebruikt geen gewone `enableChat`-flow in de game zelf; de chatrol bestaat wel voor uitleg, maar de primaire game is canvas-based.

### SLO-fit oordeel
- **21D:** sterk geraakt - leerlingen tekenen, zien AI-confidence en krijgen uitleg over pixels/patronen - `components/DrawingGamePreview.tsx:840`.
- **18C:** passend voor VSO op hoofdlijn, mits de flowkortheid wordt aangescherpt - `config/slo-kerndoelen-mapping.ts:48`.

### Score
7/9 geslaagd - Bloom-balans: medium - Aanbeveling: fix-eerst

---

## 🔧 Tech review

**Mission:** ai-tekengame (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Codex)
**Dynamic verificatie:** uitgevoerd op desktop Chrome via tijdelijke harness; app-route `/dev/mission-capture?mission=ai-tekengame` redirectte naar `/login`, daarom is de component direct gerenderd in een tijdelijke Vite-harness. Mobiel/tablet niet volledig dynamisch geverifieerd.

### Static analyse

#### ✅ Geslaagd
- **Knop-handlers gekoppeld:** start, wissen, submit, opnieuw, volgende en afronden hebben handlers - `components/DrawingGamePreview.tsx:735`, `components/DrawingGamePreview.tsx:539`, `components/DrawingGamePreview.tsx:548`, `components/DrawingGamePreview.tsx:602`.
- **Async AI-call heeft fallbackpad:** `submitDrawing` vangt fouten rond analyse af en probeert lokale analyse - `components/DrawingGamePreview.tsx:564`.
- **Restart-state bestaat:** `initialState` wordt hersteld en voortgang wordt via `onSave` opgeslagen - `components/DrawingGamePreview.tsx:381`, `components/AiLab.tsx:917`.
- **Geen `dangerouslySetInnerHTML`:** de bekeken missie toont AI-redenering als React-tekst - `components/DrawingGamePreview.tsx:931`.

#### ⚠️ Aandachtspunten
- **Verborgen sidebar is niet verborgen voor accessibility:** de AI-uitlegsidebar wordt visueel buiten beeld gezet met transform/opacity, maar blijft in de accessibility tree staan tijdens de tekenfase - `components/DrawingGamePreview.tsx:840`.
  - **Wat:** screenreader-gebruikers kunnen "Hoe AI Denkt" horen terwijl het paneel visueel verborgen is.
  - **Risico:** verwarrende navigatie en dubbele context.
  - **Voorstel:**
```tsx
<div
  aria-hidden={gamePhase === 'draw'}
  className={`absolute left-4 top-4 bottom-4 ... ${gamePhase !== 'draw' ? 'translate-x-0' : '-translate-x-full opacity-0'}`}
>
```
- **TypeScript-discipline kan strakker:** `peerFeedbackProps?: any`, `drawing_data?: any` en `parseDrawingAnalysisPayload(data: any)` laten precies de mission-contracten los waar validatie nuttig is - `components/DrawingGamePreview.tsx:35`, `services/duelService.ts:36`, `services/geminiService.ts:898`.
  - **Risico:** foutieve peer-feedback of AI-response-shapes worden pas runtime zichtbaar.
  - **Voorstel:** maak `PeerFeedbackProps`, `DuelDrawingData` en `DrawingAnalysisPayload` expliciet.

#### ❌ Blocking
- **Offline/API-fallback beoordeelt bijna altijd verkeerd:** `analyzeDrawingWithAI` vangt zijn eigen fouten af en retourneert altijd `possibleLabels[0]` als hoofdgok. Daardoor komt `DrawingGamePreview` niet in de lokale `analyzeDrawing(...)` fallback terecht; bij elk doelwoord behalve het eerste label (`zon`) wordt offline/API-fout als een fout antwoord beoordeeld - `services/geminiService.ts:977`, `components/DrawingGamePreview.tsx:571`.
  - **Wat:** de service geeft een geldig ogend resultaat terug, waardoor de component denkt dat AI-analyse gelukt is.
  - **Risico:** als de edge function faalt of sessie/auth hapert, kan een leerling goede tekeningen niet afronden. Chrome-resultaat bevestigde "Offline modus"; de ronde slaagde alleen omdat het doel toevallig `zon` was.
  - **Minimum-fix:**
```ts
// services/geminiService.ts
// Laat de caller de lokale canvas-fallback uitvoeren.
throw error instanceof Error ? error : new Error('AI drawing analysis failed');
```
  - **Structureel:** laat de service een `{ fallbackUsed: true }`-veld teruggeven en toon een expliciete offline-status in de UI.

### Dynamic verificatie

#### Console-output
- Niet via DevTools uitgelezen. Wel visueel/AX bevestigd in Chrome.

#### Network-failures
- Niet via DevTools uitgelezen. De UI gaf wel "(Offline modus)" terug na submit.

#### Visuele bewijslast
- **Desktop intro:** zichtbaar met stappenkaart; startknop kwam pas na scroll/AX in beeld.
- **Desktop draw:** target, timer, score, ronde, canvas en acties zichtbaar.
- **Desktop analyse:** sidebar + analyse-overlay zichtbaar; layout bleef coherent.
- **Desktop result:** confidence bars, feedbacktekst en `Volgende` zichtbaar; geen overlap.

### Score
Static: 5/7 - Dynamic: 2/3 desktop-only - Aanbeveling: kritieke fix

---

## Samenvatting
- **Geslaagd:** 17 criteria
- **Aandachtspunten:** 7 issues (waarvan 1 blocking)
- **Aanbeveling:** fix-eerst

## Top 3 issues
1. **AI-fallback blokkeert voortgang bij API/offline-fout:** `services/geminiService.ts:977`, `components/DrawingGamePreview.tsx:571`.
2. **Briefing zegt 3 objecten/20 seconden, game doet 10 rondes/45 seconden:** `config/agents/year1.tsx:3608`, `components/DrawingGamePreview.tsx:365`.
3. **Verborgen AI-sidebar blijft toegankelijk voor screenreaders:** `components/DrawingGamePreview.tsx:840`.

## Self-check
self-check passed: alle bevindingen hebben file:regel-anchors of expliciete Chrome-observatie; telling en aanbeveling zijn afgestemd op 1 blocking issue; geen buildclaim zonder buildoutput.

## Demo-zin
AI Tekengame laat leerlingen zichtbaar ervaren hoe beeldherkenning werkt: ze tekenen zelf, zien de AI-gok met confidence, en ontdekken dat AI patronen herkent in plaats van echt te begrijpen wat er op het scherm staat.
