# Missie-review: layout-doctor ("Layout Doctor")

**Datum:** 2026-07-02
**Levering:** DEDICATED component (`LayoutDoctorMission.tsx`), geen template-engine
**Curriculum-plek:** Leerjaar 1, week 2 (`slo-kerndoelen-mapping.ts:37`)
**SLO-claim:** 21A, 22A · VSO: 18A, 19A
**Component:** `src/features/missions/review/LayoutDoctorMission.tsx`
**Agent-rol:** `src/config/agents/year1.tsx:24-40` (Layout Doctor, kleur `#99984D`)
**Wiring:** `src/features/ai-lab/AiLab.tsx:1311-1330` (levelIndex-persist via `missionProgress`)

---

## 🎨 Design review

**Mission:** layout-doctor (dedicated Word-simulatie component)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** consequent `duck-*` (`bg-duck-bg`, `duck-acid`, `duck-ink`, `duck-gray`) door de hele component — geen `lab-*`-restanten aangetroffen.
- **Criterium 2 (Micro-interacties):** alle interactieve elementen hebben `transition-all duration-300`; drag-to-reposition via Framer Motion (`drag`, `dragMomentum={false}`) werkt zonder page-jank.
- **Criterium 6 (Framer Motion):** `AnimatePresence` correct gebruikt voor de twee toast-varianten (inline message, change-explanation); geen dubbele mount/unmount-warnings te verwachten.
- **Criterium 7 (a11y basis):** `focus-visible:ring-2` op header-knoppen en het lettertype-`<select>`; ribbon-knoppen missen dit patroon (zie aandachtspunt).

### ⚠️ Aandachtspunten
- **Mobiele layout — canvas pas zichtbaar na scrollen (bevestigd in code, audit-terminologie gecorrigeerd).** Root is `min-h-screen flex flex-col`; header + ribbon (`h-24`, vast) + de standaard-uitgeklapte opdrachtkaart (`showAssignment: true` bij mount) staan allemaal vóór het Word-canvas in de verticale flow (`LayoutDoctorMission.tsx:281-380`). Op een telefoon-viewport (~390px breed, ~700-800px hoog) vullen header+ribbon+opdrachtkaart realistisch de hele eerste viewport, dus het canvas — waar de daadwerkelijke opdracht plaatsvindt — is initieel niet zichtbaar.
  - **Wat:** het UI/UX-auditrapport (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:66`) noemt dit "alleen het docent-paneel vult het scherm" — die component-naam klopt niet (deze missie heeft geen docentpaneel, alleen een inklapbare opdrachtkaart), maar het onderliggende mobiele-zichtbaarheidsprobleem is in de code reproduceerbaar en dus wél reëel.
  - **Waarom:** de leerling moet eerst naar beneden scrollen om te zien wát hij moet bewerken; de opdrachtkaart is weliswaar inklapbaar (`showAssignment`-toggle), maar start uitgeklapt en neemt daardoor standaard ruimte in.
  - **Voorstel:** `showAssignment` initieel op `false` zetten voor viewports `<640px` (of globaal), zodat het canvas direct na de ribbon zichtbaar is; leerling klapt de kaart zelf uit wanneer nodig. Kleine, lokale wijziging (`useState(true)` → conditionele init), geen architectuurwijziging.
- **Ribbon-knoppen onder touch-formaat op mobiel.** Bold/Italic/Underline-knoppen (`p-1` rond `size={14}` icoon ≈ 22-24px totaal) en de tekstterugloop-knop (`p-1` rond `size={20}`) blijven onder de ~44px-richtlijn voor touch-targets — `LayoutDoctorMission.tsx:194-196,214`.
  - **Wat:** kleine tik-doelen in een missie die al op krappe ruimte draait (ribbon is `overflow-x-auto`, alle tabs samen).
  - **Waarom:** op mobiel (touchscreen, dikkere vingers) verhoogt dit de kans op mis-taps, vooral bij B/I/U die vlak naast elkaar staan.
  - **Voorstel:** `p-1` → `p-2` op de drie format-knoppen en de tekstterugloop-knop specifiek voor `<640px` (bv. via een `sm:p-1 p-2`-patroon). Niet blocking voor desktop-gebruik (waarschijnlijk hoofdgebruik gezien schoolcontext), wel voor de mobiele leerling.
- **`focus-visible:ring-2` ontbreekt op de meeste ribbon-knoppen** (Bold/Italic/Underline, titel-stijl-knoppen, Invoegen/Ontwerpen/Indeling/Verwijzingen-knoppen) terwijl de header-knoppen en het lettertype-`<select>` het wel hebben.
  - **Wat:** inconsistente keyboard-focus-zichtbaarheid binnen dezelfde component.
  - **Waarom:** een leerling die met toetsenbord navigeert (of een docent die het toetsenbord-pad test) ziet bij de meeste ribbon-acties geen focus-indicator.
  - **Voorstel:** `focus-visible:ring-2 focus-visible:ring-duck-acid` toevoegen aan de ribbon-knop-classNames; mechanische, herhaalbare wijziging.

### ❌ Blocking issues
Geen. De drie aandachtspunten zijn UI-polish, niet completion-blockers — de missie is op desktop (het aannemelijke hoofdgebruik in een schoolcontext) volledig bruikbaar, en zelfs op mobiel is de opdracht na scrollen bereikbaar.

### Score
Design-kwaliteit: **4/10** (10=uitstekend, dus lagere score = meer gevonden issues) — 1 mobiel-zichtbaarheidsprobleem + 1 touch-target-issue + 1 a11y-focus-inconsistentie, alle drie fixable zonder architectuurwijziging, geen van alle blocking.

---

## 📚 Didactiek review

**Mission:** layout-doctor
**Curriculum-plek:** Leerjaar 1, week 2
**SLO-claim:** 21A (Digitale vaardigheden — bewerken/opmaken), 22A (Digitale producten) · VSO 18A, 19A
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 21A/22A zijn geldige VO-codes voor "documenten professioneel opmaken"; VSO-mapping 18A/19A aanwezig — `slo-kerndoelen-mapping.ts:37`.
- **Criterium 2 (SLO-fit):** sterke, directe fit — de missie laat de leerling letterlijk documentopmaak (koppen, lettertype, tekstterugloop, lettergrootte) toepassen, precies wat 21A/22A beogen. Geen gekunstelde koppeling.
- **Criterium 3 (Leerdoelen concreet):** `missionGoals.ts:57-63` primaryGoal ("Ik verbeter een rommelig Word-document zodat het leesbaar en professioneel wordt") is actiegericht en meetbaar; `evidence`-veld is concreet navolgbaar.
- **Criterium 4 (Opdracht-beknoptheid):** de opdrachtkaart-titel ("Maak dit document professioneel") + 5 criteria-labels zijn stuk voor stuk kort (<15 woorden per item) — geen wall-of-text-risico.
- **Criterium 8 (Uitleg bij correcte actie):** elke correcte wijziging triggert een contextuele `CHANGE_EXPLANATIONS`-toast die het "waarom" uitlegt (bv. "Kopstijlen zorgen voor een duidelijke structuur...") — dit is precies het "korte uitleg"-onderdeel van de platform-3-stappenmethode, hier zonder AI-copiloot maar via directe feedback-toast, wat voor deze deterministische oefen-missie een passende invulling is.
- **Criterium 9 (Geen shallow-interaction-reward):** completion vereist alle 5 criteria (`titleStyle === 'modern' && imageAlign === 'wrap' && bodyFont === 'sans' && fontSize >= 12 && isImageRight`), geen los klik-volstaat-patroon.

### ⚠️ Aandachtspunten
- **Interne scoring nagerekend — alle 5 criteria zijn feitelijk correct én bereikbaar.** Doorgelopen: (1) "Kop 1"-stijl → `titleStyle==='modern'` levert `text-4xl font-bold border-b-2 ... font-sans`, feitelijk een gangbare kopstijl-conventie, tegenover de default `comic`-variant (Comic-Sans, gecentreerd, grijs) — didactisch correct contrast. (2) Arial/sans → `bodyFont==='sans'` zet `fontFamily: 'Arial'`, feitelijk juist. (3) Tekstterugloop → alleen bereikbaar via de knop die verschijnt zodra `selection==='image'` (leerling moet dus eerst de afbeelding aanklikken) — logische UX-volgorde, geen dead-end. (4) Afbeelding naar rechts → drag-and-drop met `onDragEnd`-check tegen `window.innerWidth/2`; werkt op alle viewport-breedtes (leerling kan de afbeelding altijd naar de rechterhelft van het scherm slepen, ongeacht documentbreedte) — **bereikbaar, geen blocker**, wel een lichte didactische onnauwkeurigheid (zie hieronder). (5) Lettergrootte ≥12 → simpele numerieke check, correct.
  - **Wat:** criterium 4 (afbeelding rechts) wordt afgevinkt zodra de leerling over de schermmidden sleept — dit is een grove proxy voor "de afbeelding staat rechts in het document", niet een check tegen de documentcontainer zelf.
  - **Waarom:** op een breed desktop-scherm met het document gecentreerd (`max-w-4xl`/`min(21cm,100%)`) kan de leerling de afbeelding relatief weinig hoeven verplaatsen om over de viewport-helft te komen als het document toevallig rechts van het scherm-midden staat, of juist ver moeten slepen als het document links staat — de pedagogische intentie ("afbeeldingen rechts plaatsen is een leesbaarheidsconventie", `CHANGE_EXPLANATIONS.isImageRight`) wordt dus benaderd, niet precies getoetst.
  - **Voorstel:** niet blocking (completion blijft voor elke leerling op elk scherm bereikbaar) — optioneel: check tegen de documentcontainer-breedte (`info.point.x` relatief aan de canvas-`div`) i.p.v. `window.innerWidth` voor een precieze visuele toets. Cosmetische verbetering, geen didactisch risico op dit moment.
- **Geen "undo"-pad voor `isImageRight`.** Eenmaal op `true` gezet (drag over schermmidden), is er geen UI-actie die het terugzet — de leerling kan de afbeelding wel terugslepen naar links, maar de state-vlag blijft `true` (`setIsImageRight` wordt alleen aangeroepen met `v=true` in de `onDragEnd`-handler, nooit met `false`).
  - **Wat:** het criterium kan niet meer "ontdaan" worden nadat het één keer is gehaald, ook als de leerling de afbeelding weer terugsleept.
  - **Waarom:** dit is voor completion een non-issue (leerling kán het criterium alleen maar vroeger behalen, nooit verliezen) — maar didactisch is het een klein signaal-mismatch: de visuele staat (afbeelding weer links) en de voortgangs-staat (criterium afgevinkt) kunnen uit elkaar lopen, wat verwarrend kan zijn als de leerling per ongeluk terugsleept en denkt dat het criterium "weer open" moet.
  - **Voorstel:** niet blocking. Optioneel: `onDragEnd` ook `setIsImageRight(false)` laten zetten bij `info.point.x <= window.innerWidth/2`, zodat visuele en voortgangs-staat synchroon blijven. Kleine, lokale wijziging.
- **AI-copiloot-principe (criterium 6, 3-stappenmethode):** deze missie heeft bewust géén chat/AI-interactie — het is een deterministische oefen-simulatie (vergelijkbaar met `game-programmeur`, zie project-memory). Dat is een geldige, bewuste keuze voor een "toepassen wat je net leerde"-oefening in week 2 van leerjaar 1, geen tekortkoming. Wordt hier benoemd ter volledigheid, niet als aandachtspunt.

### ❌ Blocking issues
Geen. Alle 5 completion-criteria zijn feitelijk correct en op elk scherm bereikbaar; de gevonden punten zijn precisie-verbeteringen, geen blokkades.

### Score
Didactiek-kwaliteit: **2/10** (10=uitstekend, dus lagere score = meer gevonden issues) — sterke SLO-fit en correcte, bereikbare scoring; twee kleine precisie/UX-nuances rond de drag-detectie, geen van beide blocking.

---

## 🔧 Techniek review

**Mission:** layout-doctor
**Reviewer:** dgskills-tech-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (State management):** `useMissionAutoSave<LayoutDoctorState>` correct gebruikt voor de 5 completion-relevante velden (`titleStyle`, `imageAlign`, `bodyFont`, `fontSize`, `isImageRight`); cosmetische state (`pageColor`, `showWatermark`, `layout`, `blocks`) bewust buiten de autosave gehouden — juiste scheiding tussen voortgang en UI-decoratie.
- **Criterium 2 (Completion-flow):** `clearSave()` wordt aangeroepen bij `onComplete(true)` — voortgang wordt correct opgeruimd na inleveren, consistent met platform-patroon.
- **Criterium 3 (XSS/sanitization):** geen `dangerouslySetInnerHTML`; alle `block.content` rendert via React's standaard JSX-escaping (`{block.content}`). Content is bovendien hardcoded (geen leerling-vrije-tekstinvoer die naar state gaat), dus geen input-sanitization-risico van toepassing.
- **Criterium 4 (Geen AI-endpoint):** deze missie heeft geen server-calls, dus geen prompt-injection- of rate-limiting-oppervlak — terecht buiten scope.
- **Criterium 5 (Levelindex-persist):** `AiLab.tsx:1323` leest `initialLevelIndex` uit `missionProgress`, maar het component zelf gebruikt geen `initialLevelIndex`-prop (component heeft geen levels/stappen-concept, alleen een flat scoring-criteria-lijst) — laat me dit als observatie noteren, niet als bug: de prop wordt waarschijnlijk gedeeld met een generiek wiring-patroon en simpelweg genegeerd door dit component. Geen functioneel probleem, wel een klein signaal van copy-paste-wiring dat niet 1-op-1 aansluit bij dit component se API.

### ⚠️ Aandachtspunten
- **`onDragEnd`-callback met niet-getypeerde cast.** `handleSelection(e as unknown as React.MouseEvent, 'image', 'image')` (`LayoutDoctorMission.tsx:405`) forceert een Framer Motion `PanInfo`-event door een `React.MouseEvent`-signature — werkt runtime (alleen `stopPropagation` wordt gebruikt, wat op beide event-types bestaat), maar is een type-onveiligheid die bij toekomstige `handleSelection`-uitbreiding (die meer van het event-object verwacht) stil zou kunnen breken.
  - **Voorstel:** niet blocking, cosmetische type-hygiëne. Kan in een aparte kleine PR.
- **Vaste `top: 150, left: 100`-startpositie voor de sleepbare afbeelding** (`LayoutDoctorMission.tsx:407`) — op een smal mobiel scherm (documentbreedte < 250px binnen de `padding: clamp(...)`) kan de afbeelding (`w-32`=128px) gedeeltelijk buiten het zichtbare canvas starten.
  - **Waarom geen blocker:** de afbeelding is versleepbaar (`drag` actief), dus zelfs als de startpositie deels off-canvas is, kan de leerling 'm terugslepen — en op de daadwerkelijke schermbreedtes waarop deze site draait (telefoon ≥360px, canvas-`padding` met `clamp(0.5rem,...)`) is 100px+128px=228px ruim binnen een 360px-breed scherm. Puur theoretisch randgeval, geen praktisch probleem.
- **Geen React-key-collision-risico gevonden** in `blocks`-array-rendering; `generateTOC` gebruikt `'toc-' + Date.now()` en `addBlock` gebruikt `Date.now().toString()` — bij zeer snelle opeenvolgende clicks (<1ms) theoretisch een key-collision, maar niet praktisch bereikbaar via UI-clicks (menselijke reactietijd >>1ms). Niet blocking.

### ❌ Blocking issues
Geen.

### Score
Techniek-kwaliteit: **2/10** (10=uitstekend, dus lagere score = meer gevonden issues) — solide state-scheiding en completion-flow, twee kleine type-/edge-case-observaties zonder praktisch risico.

---

## Platform-drift check (server-side vs. client-side systemInstruction)

N.v.t. — `layout-doctor` heeft geen chat/AI-interactie (`systemInstruction: ''` in `year1.tsx:38`, en het component roept geen edge function aan). Geen drift mogelijk waar geen server-side prompt bestaat.

---

## Screenshot-dekking

Geen `screenshots/`-map aanwezig voor deze wave (Stap B, dynamic-verificatie). `layout-doctor` komt wél voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (regels 66-67, 114, 133) — die bevindingen (mobiel-canvas-zichtbaarheid, toolbar-touch-formaat) zijn in deze review geverifieerd tegen de daadwerkelijke code (zie Design-sectie) en bevestigd als reëel, met correctie van de foutieve "docent-paneel"-terminologie uit het auditrapport.

---

## Samenvatting & aanbeveling

| Rubric | Score (0-10, lager=beter) | Blocking issues |
|---|---|---|
| Design | 4 | 0 |
| Didactiek | 2 | 0 |
| Techniek | 2 | 0 |

**triageScore** = (10-4)×0.3 + (10-2)×0.4 + (10-2)×0.3 = 1.8 + 3.2 + 2.4 = **7.4**

**Aanbeveling: ALLOW.** Geen blocking issues in alle drie rubrics; alle 5 completion-criteria zijn feitelijk correct en op elk scherm bereikbaar. De gevonden punten (mobiele opdrachtkaart-default, ribbon-touch-targets, focus-ring-consistentie, drag-detectie-precisie) zijn stuk voor stuk niet-blocking polish-items die de missie niet onbruikbaar maken, maar wel de mobiele ervaring merkbaar verbeteren als ze worden opgepakt. Genoemd in het reeds-bestaande UI/UX-auditrapport (KRITIEK-thema B) als platform-brede prioriteit voor de "op-maat-missies" — dit sluit aan bij die eerdere, bredere bevinding.

**Voorgestelde vervolgstap (niet uitgevoerd — buiten scope van deze review, wijzig-niets-instructie):** `showAssignment` default op `false` voor mobiel + `p-2` op de kleine ribbon-format-knoppen zouden de twee grootste mobiele frictiepunten in één kleine PR oplossen.
