# Missie-review: layout-doctor (Word Match)

**Datum:** 2026-08-25
**templateType:** dedicated / handcrafted-component
**Gereviewd bestand:** `src/features/missions/review/LayoutDoctorMission.tsx`
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport).

---

## ⚠️ Vooraf: kritieke bevinding buiten de drie assen

`LayoutDoctorMission.tsx` (486 regels) is **niet gekoppeld aan enige route in de app**. Grep op `LayoutDoctorMission` in `src/` levert alleen de eigen definitie op (`src/features/missions/review/LayoutDoctorMission.tsx:51`). De echte `'layout-doctor'`-missie die leerlingen te zien krijgen is een ander component:

- `src/app/AuthenticatedApp.tsx:773-780` rendert bij `activeModule === 'layout-doctor'` het component **`WordSimulator`**, niet `LayoutDoctorMission`.
- `src/features/ai-lab/AiLab.tsx:1410-1416` doet hetzelfde: `selectedRole?.id === 'layout-doctor'` → `<WordSimulator .../>`.
- `src/features/dev-tools/DevMissionPreview.tsx:139-141` (dev-preview) rendert ook `WordSimulator`.
- `src/features/student/ProjectZeroDashboard.tsx:136` toont als omschrijving "Koppel Word-problemen aan de juiste oplossing!" — dat is de `WordSimulator`-matching-opdracht, niet de documentopmaak-taak uit `LayoutDoctorMission.tsx` ("Maak dit document professioneel").

Deze review beoordeelt, zoals gevraagd, het bestand `LayoutDoctorMission.tsx` zelf. Maar de conclusie moet vooraf duidelijk zijn: **dit component bereikt geen enkele leerling** in de huidige codebase. Het is dode code (mogelijk een eerdere iteratie van de missie, vervangen door `WordSimulator` zonder opruiming). Zie "Voorstellen" en de escalatie hieronder.

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)
**Score:** 5/7 criteria geslaagd · Aanbeveling: fix-eerst (indien component alsnog live gaat)

Geen template-baseline beschikbaar (handcrafted/dedicated). Visual Precision Gate: **unverified** — geen Chrome-plugin/dev-server-bewijs beschikbaar in deze pass; dynamische claims zijn dus niet geverifieerd.

### ✅ Geslaagd
- **Criterium 1 (tokens):** Bijna overal consistent `duck-*`-gebruik (`duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`) — `LayoutDoctorMission.tsx:283,304,344` e.v.
- **Criterium 2:** N.v.t. (handcrafted, geen template-baseline)
- **Criterium 4 (copy-lengte):** Opdrachtkaart-tekst is kort en past ruim binnen leerjaar-1-grens (<80 woorden) — `LayoutDoctorMission.tsx:352,358`
- **Criterium 6 (Framer Motion):** `motion.div` voor de sleepbare afbeelding en de twee toast-`AnimatePresence`-blokken hebben functionele waarde (drag-interactie, tijdelijke feedback) — `LayoutDoctorMission.tsx:399-417,311-341`. Geen wrapper-spam.

### ⚠️ Aandachtspunten
- **Criterium 1 — hardcoded hex in plaats van token**: `border-b-2 border-[#08283B]` — `LayoutDoctorMission.tsx:429`
  - **Wat:** kopstijl "Kop 1" gebruikt een los hex-kleur in plaats van een `duck-*`-token.
  - **Waarom:** breekt themabaarheid/consistentie; als de palet later verschuift mist deze regel de update.
  - **Voorstel:** vervang door `border-duck-ink` (dichtstbijzijnde bestaande token, zie Voorstellen-sectie).
- **Criterium 7 — icon-only knoppen zonder `aria-label`**: Bold/Italic/Underline-knoppen (`LayoutDoctorMission.tsx:194-196`) en de terug-knop (`LayoutDoctorMission.tsx:285`) hebben geen `aria-label`, alleen een icoon.
  - **Wat:** screenreader-gebruikers horen geen functieomschrijving bij deze knoppen.
  - **Waarom:** toegankelijkheidsdrempel voor leerlingen die een screenreader gebruiken.
  - **Voorstel:** zie Voorstellen-sectie (terug-knop als voorbeeld).
- **Criterium 5 — responsive: vaste pixel-positie voor sleepbare afbeelding**: `style={{ top: 150, left: 100 }}` — `LayoutDoctorMission.tsx:407`
  - **Wat:** de afbeelding start altijd op een vaste pixelpositie, ongeacht viewport-breedte.
  - **Waarom:** op mobiel (375px) kan dit de afbeelding buiten of tegen de paginarand plaatsen, wat overlap met tekst kan geven — niet dynamisch bevestigd (geen Chrome-plugin-run in deze pass), wel een structureel risico bij een vaste 100px-offset op een 375px-viewport.
  - **Voorstel:** vervang vaste pixels door relatieve positionering (bv. `top-[10%] left-[8%]`) of een layout-afhankelijke default.

### ❌ Blocking issues
- **Visual Precision Gate:** unverified — geen Chrome-plugin-bewijs deze pass. Kan niet als "ship" bevestigd worden zonder dynamische verificatie.

### Score
5/7 criteria geslaagd · Aanbeveling: fix-eerst

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 2 (`src/config/curriculum.ts:96`, reviewMissions-lijst)
**SLO-claim:** `21A` (Digitale systemen), `22A` (Digitale producten); VSO `18A`, `19A` — `src/config/slo-kerndoelen-mapping.ts:40`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21A` en `22A` zijn geldige reguliere codes, `18A`/`19A` geldige VSO-codes — `src/config/slo-kerndoelen-mapping.ts:40`.
- **Criterium 4 (opdracht-beknoptheid):** Opdrachtkaart-tekst en criteria-labels zijn kort en concreet, ruim binnen de leerjaar-1-grens — `LayoutDoctorMission.tsx:26-31,352,358`.
- **Criterium 5 (leeftijds-passend):** Taal is direct en concreet ("Verander de titel naar stijl 'Kop 1'", "Sleep de afbeelding naar rechts") — passend bij leerjaar 1.

### ⚠️ Aandachtspunten
- **Criterium 3 — geen expliciete leerdoelen in het component**: geen `learningObjectives`-array in `LayoutDoctorMission.tsx`.
  - **Wat:** de vijf `ASSIGNMENT_CRITERIA` (`LayoutDoctorMission.tsx:25-31`) zijn actiegericht geformuleerd, maar functioneren als taak-checklist, niet als leerdoel-formulering.
  - **Waarom:** `missionGoals.ts:57-64` levert wél een `primaryGoal` ("Ik verbeter een rommelig Word-document zodat het leesbaar en professioneel wordt.") — dat dekt de taak in dit bestand redelijk, maar dekt **niet** wat leerlingen in productie daadwerkelijk doen (zie hieronder).
  - **Voorstel:** n.v.t. voor dit bestand zolang het niet live is; zie escalatie.
- **Kritiek — SLO/leerdoel-claim komt niet overeen met de werkelijk geleverde missie-ervaring:**
  - **Wat:** `missionGoals.ts` (primaryGoal, evidence) en de `ASSIGNMENT_CRITERIA` in dit bestand beschrijven een documentopmaak-taak (Kop-1-stijl toepassen, tekstterugloop, lettergrootte). De daadwerkelijk gerenderde missie (`WordSimulator`, via `AuthenticatedApp.tsx:773` en `AiLab.tsx:1410`) is een match-opdracht ("Koppel Word-problemen aan de juiste oplossing" — `ProjectZeroDashboard.tsx:136`).
  - **Waarom:** de SLO-fit-claim (`22A` Digitale producten, opmaak toepassen) is geschreven voor de taak in dít bestand, niet voor de matching-opdracht die leerlingen echt spelen. Of die matching-opdracht dezelfde kerndoelen even sterk raakt is niet binnen deze review-scope (WordSimulator viel buiten de opdracht van deze pass) — maar de claim-brontekst en de shipped ervaring lopen aantoonbaar uiteen.
  - **Voorstel:** zie escalatie — dit is een missie-brede coherentie-vraag, geen tekst-tweak in dit bestand.

### ❌ Blocking issues
- **Missie-content-mismatch tussen brondocumenten en shipped ervaring** (zie boven) — kritiek omdat het de betrouwbaarheid van `missionGoals.ts` als bron voor docentrapportage ondermijnt zolang niet is vastgesteld welk component "waar" is.

### SLO-fit oordeel
- **21A / 22A:** binnen dít bestand sterk geraakt (opmaak-acties zijn directe oefening van digitale-productie-vaardigheid) — maar dit bestand bereikt geen leerling, dus de SLO-fit is in de praktijk **niet te beoordelen** zonder ook `WordSimulator.tsx` te reviewen (buiten scope van deze opdracht).

### Score
3/4 relevante criteria geslaagd (bestand-intern) · Bloom-balans: laag (herkennen/toepassen van vaste opmaakregels, geen analyse/evaluatie) · Aanbeveling: fix-eerst — pas na opheldering welk component de missie is

---

## 🔧 Tech review

**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin-run in deze pass; bovendien is het bestand niet bereikbaar via enige route, dus dynamische verificatie van dít bestand is sowieso niet mogelijk zonder het eerst te koppelen.

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (knop-handlers):** alle `<button>`-elementen hebben een functionele `onClick` — geen dode knoppen aangetroffen.
- **Criterium A4 (imports via `@/*`):** `import { useMissionAutoSave } from '@/hooks/useMissionAutoSave'` — `LayoutDoctorMission.tsx:9`.
- **Criterium A6 (restart-safe state, deels):** de vijf opdracht-relevante velden (`titleStyle`, `imageAlign`, `bodyFont`, `fontSize`, `isImageRight`) lopen via `useMissionAutoSave` — `LayoutDoctorMission.tsx:52-61`.
- **Criterium A7 (security):** geen `dangerouslySetInnerHTML`, geen client-side AI-calls, geen user-input naar een AI-endpoint — n.v.t. voor dit component.

#### ⚠️ Aandachtspunten
- **Criterium A3 — `any`-type**: `style?: any; // For text styles, alignment, etc.` — `LayoutDoctorMission.tsx:48`
  - **Wat:** het `style`-veld van `ContentBlock` is impliciet `any`.
  - **Risico:** geen typecontrole op wat daar wordt ingezet; stille runtime-fouten bij toekomstige uitbreiding.
  - **Voorstel:** zie Voorstellen-sectie.
- **Criterium A6 — inconsistente persistence**: `blocks` (documentinhoud, incl. toegevoegde tabellen/vormen/TOC) is losse `useState`, niet via `useMissionAutoSave` — `LayoutDoctorMission.tsx:118-123`.
  - **Wat:** de vijf score-bepalende velden overleven een refresh, de daadwerkelijke documentinhoud niet.
  - **Risico:** laag voor de score zelf (die hangt niet af van `blocks`), maar een leerling die bv. een TOC of tabel heeft toegevoegd en ververst, verliest die wijziging zonder melding.
  - **Voorstel:** buiten scope voor een kleine fix — vereist een state-vorm-wijziging in `useMissionAutoSave`; noteer als bekend gedrag, geen blocking issue.
- **Minor — sleeplogica image-positie is eenrichtings- en viewport-onafhankelijk**: `onDragEnd` zet `isImageRight` alleen op `true`, nooit terug op `false`, en vergelijkt tegen `window.innerWidth / 2` in plaats van de documentbreedte — `LayoutDoctorMission.tsx:402-404`.
  - **Wat:** op brede schermen (document is `max-width` begrensd, venster niet) kan de drempel niet overeenkomen met de zichtbare documenthelft.
  - **Risico:** leerling kan de afbeelding "goed" naar rechts slepen zonder dat de check dat herkent, of andersom.
  - **Voorstel:** buiten scope voor kleine fix — vereist herberekening t.o.v. de documentcontainer, niet `window.innerWidth`.

#### ❌ Blocking issues
- **Component is dode code / onbereikbaar in productie.** `LayoutDoctorMission.tsx` wordt nergens geïmporteerd of gerouteerd (bevestigd via repo-brede grep op `LayoutDoctorMission`). De live `'layout-doctor'`-missie rendert `WordSimulator` (`AuthenticatedApp.tsx:773-780`, `AiLab.tsx:1410-1416`, `DevMissionPreview.tsx:139-141`). Dit is blocking voor elke "ship"-beoordeling van dít bestand: het kan simpelweg niet ship'en, want het is al niet aangesloten.

### Score
Static: 3/7 aandachtspunten-vrije criteria (4 pass, 3 warn, 1 blocking) · Dynamic: n.v.t. (onbereikbaar) · Aanbeveling: kritieke fix vereist (routing/opruim-beslissing, geen code-kwaliteitsfix)

---

## Voorstellen

Kleine, mechanische fixes binnen `LayoutDoctorMission.tsx` (toepasbaar ongeacht de uitkomst van de escalatie hieronder):

**1. Hardcoded hex-kleur → design-token**
```tsx
// ❌ Huidig — LayoutDoctorMission.tsx:429
className={`cursor-text ${titleStyle === 'comic' ? 'text-2xl text-duck-ink/60 text-center font-[Comic_Sans_MS]' : 'text-4xl font-bold border-b-2 border-[#08283B] pb-2 text-left font-sans'} ${selection === block.id ? 'bg-duck-acid/10' : ''}`}

// ✅ Voorgesteld
className={`cursor-text ${titleStyle === 'comic' ? 'text-2xl text-duck-ink/60 text-center font-[Comic_Sans_MS]' : 'text-4xl font-bold border-b-2 border-duck-ink pb-2 text-left font-sans'} ${selection === block.id ? 'bg-duck-acid/10' : ''}`}
```

**2. `aria-label` op icon-only terug-knop**
```tsx
// ❌ Huidig — LayoutDoctorMission.tsx:285
<button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft size={20} /></button>

// ✅ Voorgesteld
<button onClick={onBack} aria-label="Terug naar overzicht" className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white"><ArrowLeft size={20} /></button>
```

**3. `any`-type vervangen door concreet type**
```tsx
// ❌ Huidig — LayoutDoctorMission.tsx:44-49
interface ContentBlock {
    id: string;
    type: BlockType;
    content?: string;
    style?: any; // For text styles, alignment, etc.
}

// ✅ Voorgesteld
interface ContentBlock {
    id: string;
    type: BlockType;
    content?: string;
    style?: React.CSSProperties;
}
```

Deze drie fixes lossen géén van de kernvraag op (is dit bestand de missie of niet) — dat is een productbeslissing, geen codefix, en staat daarom hieronder als escalatie.

---

## Samenvatting & verdict

`LayoutDoctorMission.tsx` is op zichzelf een redelijk gebouwd, functioneel component (duck-tokens grotendeels consistent, autosave op de score-bepalende velden, geen dode knoppen, geen security-issues). De code-kwaliteit binnen het bestand is ruim voldoende voor een kleine opschoning.

Het echte probleem ligt niet in de code van dit bestand, maar in de architectuur eromheen: **dit component is niet de missie die leerlingen spelen.** Elke productieroute voor `'layout-doctor'` (AuthenticatedApp, AiLab, DevMissionPreview) rendert `WordSimulator.tsx`. `LayoutDoctorMission.tsx` is losstaande, onbereikbare code die wél SLO- en leerdoel-claims via `missionGoals.ts` met zich meedraagt die niet overeenkomen met wat leerlingen daadwerkelijk zien.

**AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).**

**Verdict: fix-eerst** — niet vanwege codekwaliteit, maar vanwege een structurele onduidelijkheid die Yorin moet beslissen: dit bestand verwijderen (dode code opruimen) óf alsnog aansluiten als vervanger van `WordSimulator`. Tot die beslissing is genomen is elke "ship"-uitspraak over `LayoutDoctorMission.tsx` betekenisloos — het bestand raakt sowieso geen leerling.
