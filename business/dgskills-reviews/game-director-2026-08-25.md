# Missie-review: Game Director

**Datum:** 2026-08-25
**templateType:** dedicated (handcrafted component, geen shared engine)
**Component:** `src/features/missions/GameDirectorMission.tsx` + `src/features/missions/game-director/{BlockPalette,CodeBlock,CodeWorkspace,BlockExecutor,BlockTypes}`

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## Design — score 6.5/10

De missie oogt strak binnen het DUCK-designsysteem (`duck-*` tokens, consistente typografie, responsive mobile-tabs). Er zitten wel duidelijke restanten van een eerdere kleurmigratie die de bedoelde visuele contrasten stilzwiegend hebben weggehaald.

**Bevindingen**

1. **Warning — dode hover-states op knoppen.** Meerdere knoppen hebben een `hover:`-klasse die exact dezelfde achtergrondkleur gebruikt als de basisstaat, waardoor er geen enkele visuele feedback is bij hover/focus:
   - "Hulp nodig?"-knop (regel ~874): `bg-duck-acid hover:bg-duck-acid`
   - Mobiele Start/Stop-knop (regel ~1028-1031): `bg-duck-acid hover:bg-duck-acid hover:text-duck-ink` / `bg-duck-acid hover:bg-duck-acid disabled:bg-duck-gray`

   Dit is typisch het gevolg van een mechanische token-swap (zie projectmemory `reference_duck_palette_and_teacher_migration.md`): een losstaande hover-tint is vervangen door dezelfde token als de basiskleur.

2. **Info — onzichtbare "nachtpark"-details in de canvas-tekening.** In de `update()`-functie wordt de achtergrond gevuld met `#202023`, en vervolgens tekent de code een "subtiel gras-patroon" (grid-lijnen), een grondstrook, een highlight-randje én grasspriet-accenten — allemaal óók met `fillStyle`/`strokeStyle` `#202023`. Al deze tekencode draait elk frame maar is onzichtbaar tegen de identieke achtergrondkleur: pure verspilde rekentijd zonder visueel effect. Sterren, hekken en de speler-sprite hebben wél eigen kleuren en zijn zichtbaar.

3. **Warning — categoriekleuren van codeblokken vallen samen.** In `BlockTypes.ts` (niet gewijzigd door deze review, want buiten de whitelist voor deze missie) is `COLORS.event` en `COLORS.control` beide `#e1ff01`, terwijl de code-comments nog spreken van "Yellow/Gold for events" resp. "Orange for control". Hierdoor krijgen event-blokken (`wanneer game start`, `wanneer toets ingedrukt`) en control-blokken (`als op de grond dan`, `herhaal`, `als ik de rand raak dan`) in zowel de palet-headers (`BlockPalette.tsx`, `borderLeft: info.color`) als de losse blokken in de werkruimte identiek dezelfde accentkleur. Zie sectie Didactiek voor de impact hiervan.

Geen blokkerende designfouten: de kernflow (paneel wisselen, blok slepen/toevoegen, spelen, hint, reflectie) is visueel consistent en werkt.

---

## Didactiek — score 8/10

Sterk punt: dit is een van de best doordachte progressie-opzetten in de sweep tot nu toe.

- Vijf levels bouwen expliciet op elkaar: los bewegen → toets-koppeling → twee-richtingsbesturing → conditionele logica (`if_grounded`) → variabele-experiment (zwaartekracht). Elke stap voegt precies één nieuw concept toe.
- Level 2's slaagconditie is bewust ontkoppeld van "haal het doel" en getest op "heeft daadwerkelijk gesprongen" — de code-comment legt expliciet uit waarom (het testen van de key→actie-koppeling, niet van navigatievaardigheid). Dat is precieze didactische intentie, geen toeval.
- Adaptieve moeilijkheidsgraad (Hard Mode bij <45s) beloont snelle voltooiers met een moeilijker volgend level in plaats van enkel meer punten — voorkomt XP-farming zonder leerdruk op langzamere leerlingen te leggen.
- Verplichte reflectie (≥10 tekens) vóór afronden, gekoppeld aan een expliciete "Wie is de baas?"-uitleg over AI-alignment in `MissionConclusion` — sluit aan bij de 3-stappenmethode (erkenning → korte uitleg → challenge) uit `business/nl-vo/didactische-onderbouwing.md`.
- Hint-systeem en contextuele "Hulp nodig?"-AI-chat (met huidige challenge, geplaatste blokken en gamestatus meegegeven) geven een leerling die vastloopt een uitweg zonder de puzzel voor te kauwen.

**Bevindingen**

1. **Warning — kleurcode-scaffolding valt weg (zie Design #3).** Scratch-achtige bloktalen leunen zwaar op "categorie = kleur" als cognitieve steun voor beginners (leerjaar 1, 12-13 jaar). Met event- en control-blokken in identieke kleur verliest een leerling een deel van die visuele steun bij het herkennen "dit is een startpunt" vs. "dit is een voorwaarde". Niet blokkerend — labels en vorm blijven aanwezig — maar het ondermijnt een bewust ontworpen scaffolding-mechanisme.

Geen bevindingen over AI-gedrag/privacy (aparte pass) en geen bevindingen over SLO-koppeling: `game-director` is coherent aanwezig in `slo-kerndoelen-mapping.ts` (22B / VSO 19A), `curriculum.ts` (leerjaar 1, periode 2) en `missionGoals.ts`.

---

## Tech — score 7.5/10

- State-architectuur is degelijk: persistente voortgang via `useMissionAutoSave`, transiënte gamestate (canvas, keys, physics) correct gescheiden in refs zodat de render-loop niet bij elke frame re-rendert.
- Geen `eval`/dynamische codeconstructie: block-`execute`-functies zijn hardcoded in `BLOCK_DEFINITIONS`, leerling-input (blokwaarden) blijft numeriek/dropdown-begrensd via `min`/`max`/`options` — geen injectierisico.
- Keyboard-listeners worden correct opgeruimd (`removeEventListener` in cleanup), `requestAnimationFrame` wordt gecanceld bij stop/unmount.

**Bevindingen**

1. **Warning — `BlockExecutor`-state is `static` op klasseniveau in plaats van instance-scoped.** `gameStartExecuted` en `previousKeyStates` zijn `static` velden (`BlockExecutor.ts` regel 12-13), gedeeld over ALLE instanties van de klasse binnen de hele app-sessie. Dit werkt correct zolang `handleReset()` (die `BlockExecutor.reset()` aanroept) altíjd vóór elke nieuwe speelsessie wordt aangeroepen — wat hier het geval is via `handleTogglePlay`. Het wordt fragiel zodra:
   - React StrictMode in dev twee instanties dubbel mount/unmount (kan `gameStartExecuted` laten "aanstaan" voor de verkeerde sessie),
   - een teacher-preview of testomgeving twee `GameDirectorMission`-instanties tegelijk rendert (bijv. side-by-side vergelijking).

   Niet blokkerend voor de huidige leerlingflow, wel een architecturale schuld die bij hergebruik van `BlockExecutor` elders (of bij parallelle previews) tot verwarrende bugs kan leiden.

2. **Info — verspilde canvas-rekenwerk** (zie Design #2): geen functioneel risico, wel onnodige `fillRect`/`stroke`-calls elke frame voor onzichtbare pixels.

Geen blokkerende technische fouten gevonden.

---

## Voorstellen

### 1. Dode hover-state — "Hulp nodig?"-knop (`GameDirectorMission.tsx`)

**Voor:**
```tsx
<button
    onClick={() => setIsChatOpen(true)}
    className="flex items-center gap-1 text-[10px] text-duck-ink font-bold px-3 py-1.5 bg-duck-acid hover:bg-duck-acid rounded-full transition-all duration-300 shadow-lg shadow-duck-acid/20 focus-visible:ring-2 focus-visible:ring-duck-acid"
>
    <Sparkles size={12} /> Hulp nodig?
</button>
```

**Na:**
```tsx
<button
    onClick={() => setIsChatOpen(true)}
    className="flex items-center gap-1 text-[10px] text-duck-ink font-bold px-3 py-1.5 bg-duck-acid hover:brightness-95 rounded-full transition-all duration-300 shadow-lg shadow-duck-acid/20 focus-visible:ring-2 focus-visible:ring-duck-acid"
>
    <Sparkles size={12} /> Hulp nodig?
</button>
```

### 2. Dode hover-state — mobiele Start/Stop-knop (`GameDirectorMission.tsx`)

**Voor:**
```tsx
<button
    onClick={handleTogglePlay}
    disabled={blocks.length === 0}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-300 ${isPlaying
        ? 'bg-duck-acid hover:bg-duck-acid hover:text-duck-ink'
        : 'bg-duck-acid hover:bg-duck-acid disabled:bg-duck-gray disabled:text-duck-ink/60'
    }`}
>
```

**Na:**
```tsx
<button
    onClick={handleTogglePlay}
    disabled={blocks.length === 0}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-300 ${isPlaying
        ? 'bg-duck-acid hover:brightness-95 hover:text-duck-ink'
        : 'bg-duck-acid hover:brightness-95 disabled:bg-duck-gray disabled:text-duck-ink/60'
    }`}
>
```

### 3. Onzichtbare grid-lijnen in de canvas-achtergrond (`GameDirectorMission.tsx`, `update()`)

**Voor:**
```tsx
// Clear — park at night theme
ctx.fillStyle = '#202023';
ctx.fillRect(0, 0, width, height);

// Subtle grass pattern
ctx.strokeStyle = '#202023';
ctx.lineWidth = 1;
```

**Na:**
```tsx
// Clear — park at night theme
ctx.fillStyle = '#202023';
ctx.fillRect(0, 0, width, height);

// Subtle grass pattern
ctx.strokeStyle = 'rgba(153, 152, 77, 0.12)'; // zichtbaar tegen de donkere achtergrond
ctx.lineWidth = 1;
```

*(Dezelfde aanpak geldt voor de grondstrook-highlight en grasspriet-accenten iets verderop in dezelfde functie — momenteel ook `#202023` op `#202023`.)*

### 4. Categoriekleuren van event- en control-blokken (buiten whitelist, ter info)

`BlockTypes.ts` valt buiten de bewerkingsscope van deze missie-review (niet in de whitelist), maar de oorzaak van Design-bevinding #3 / Didactiek-bevinding #1 zit hier:

**Voor:**
```ts
const COLORS = {
    event: '#e1ff01',    // Yellow/Gold for events
    motion: '#202023',   // Blue for motion
    control: '#e1ff01',  // Orange for control
    variable: '#ff3c21', // Dark orange for variables
};
```

**Na (voorstel, niet toegepast):**
```ts
const COLORS = {
    event: '#e1ff01',    // Geel — startpunten
    motion: '#99984D',   // Zandkleur — beweging (onderscheidend van de donkere achtergrond)
    control: '#5F947D',  // Groen — voorwaarden/herhaling
    variable: '#ff3c21', // Oranje-rood — variabelen/score
};
```

---

## Samenvatting

De Game Director-missie is didactisch de sterkste van dit review-batch tot nu toe: een heldere vijf-levels-progressie met een doelbewust ontkoppelde slaagconditie voor level 2, adaptieve moeilijkheidsgraad, verplichte reflectie en een contextbewuste AI-hulp-knop. De gevonden problemen zijn stuk voor stuk restanten van een eerdere kleur-tokenmigratie (dode hover-states, onzichtbare canvas-details, samenvallende categoriekleuren) — niet-blokkerend, maar wel de moeite van het herstellen waard omdat één ervan (categoriekleuren) een bewust ontworpen scaffolding-mechanisme voor beginnende programmeurs raakt.

**Verdict: ok** — geen blokkerende bevindingen; de drie in-scope voorstellen zijn mechanisch en risicoloos toe te passen.
