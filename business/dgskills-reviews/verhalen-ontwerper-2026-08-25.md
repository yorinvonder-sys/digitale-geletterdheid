# Missiereview: verhalen-ontwerper

**Datum:** 2026-08-25
**TemplateType:** agent-role (chatmissie met eigen boek-component, geen gedeelde template-engine)
**Curriculum-plek:** Leerjaar 1, Periode 2, week 2 (`src/config/curriculum.ts:85`)
**SLO-claim:** `21D` (AI), `22A` (Digitale producten) — VSO: `18C`, `19A` (`src/config/slo-kerndoelen-mapping.ts:52`)

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** consistent `duck-*`/`lab-*`-gebruik in `year1.tsx` en `BookPreview.tsx`, geen hex-literals waar een token bestaat.
- **Criterium 2:** n.v.t. — agent-role missie zonder templateRegistry-baseline; eigen boek-component is uniek.
- **Criterium 3 (Knop-clarity):** navigatieknoppen (vorige/volgende pagina, print, download) hebben duidelijke iconen + `title`-tooltip en hover-states (`src/features/student/BookPreview.tsx:1290-1336`).
- **Criterium 4 (Copy-lengte):** `problemScenario` (~27 woorden) en `missionObjective` (4 woorden) ruim onder de grens van 80 woorden voor leerjaar 1 (`src/config/agents/year1.tsx:889-890`).
- **Criterium 6 (Framer Motion):** geen wrapper-spam aangetroffen in de boek-flow.

### ⚠️ Aandachtspunten
- **Criterium 7 (Toegankelijkheid) — icon-only knoppen zonder `aria-label`**: de pagina-navigatieknoppen (`ChevronLeft`/`ChevronRight`) hebben geen tekst en geen `aria-label`, alleen visuele iconen — `src/features/student/BookPreview.tsx:1289-1319`.
  - **Wat:** screenreader-gebruikers horen geen functie bij deze knoppen.
  - **Waarom:** leerlingen die een screenreader gebruiken kunnen niet door het boek bladeren.
  - **Voorstel:** voeg `aria-label="Vorige pagina"` / `aria-label="Volgende pagina"` toe.
- **"Opnieuw proberen"-knop zonder eigen `onClick`**: bij een mislukte illustratie krijgt de leerling een knop "✏️ Opnieuw proberen" die géén eigen handler heeft — `src/features/student/BookPreview.tsx:423-425`.
  - **Wat:** de knop werkt alleen omdat de klik doorbubbelt naar de omliggende container (`onClick={() => isInteractive && onImageClick?.(pageIndex + 1)}` op regel 401).
  - **Waarom:** fragiel patroon — een toekomstige `stopPropagation()` ergens in de knop-subtree (bv. bij een icon-library-update) breekt de retry-functie stilletjes, zonder dat een test dit vangt.
  - **Voorstel:** expliciete handler toevoegen i.p.v. op bubbling te vertrouwen:
    ```tsx
    // ❌ Huidig — src/features/student/BookPreview.tsx:423
    <button className="text-[10px] text-white px-3 py-1.5 rounded-full shadow-sm transition-colors mt-1 font-bold" style={{ backgroundColor: '#ff3c21' }}>
        ✏️ Opnieuw proberen
    </button>

    // ✅ Voorgesteld
    <button
        onClick={(e) => { e.stopPropagation(); isInteractive && onImageClick?.(pageIndex + 1); }}
        className="text-[10px] text-white px-3 py-1.5 rounded-full shadow-sm transition-colors mt-1 font-bold"
        style={{ backgroundColor: '#ff3c21' }}
    >
        ✏️ Opnieuw proberen
    </button>
    ```

### ❌ Blocking issues
- **Onleesbare foutmelding: tekst en icoon hebben dezelfde kleur als de achtergrond.** Wanneer een illustratie mislukt (bv. AI-veiligheidsfilter blokkeert de prompt), toont het boek een foutkader met `bg-lab-gold` (`#D7C95F`) én `text-lab-gold` (`#D7C95F`) — exact dezelfde hex-waarde — op zowel de kaft-fout (`src/features/student/BookPreview.tsx:293-303`) als de pagina-fout (`src/features/student/BookPreview.tsx:410-421`).
  - **Wat:** de kop "Oeps! De AI kon dit niet tekenen 🎨", de uitleg-tekst, en het `AlertCircle`-icoon zijn onzichtbaar — goud op goud.
  - **Waarom:** een leerling van 12 jaar wiens illustratie wordt geblokkeerd (bv. door een veiligheidsfilter) ziet een leeg goudkleurig vlak zonder enige uitleg waaróm het mislukte, en begrijpt niet wat er te doen staat. Alleen het losse witte tip-kadertje en (op pagina-niveau) de "Opnieuw proberen"-knop blijven zichtbaar — de kern van de foutboodschap gaat volledig verloren. Dit raakt de Visual Precision Gate (fout/feedbackstaat is niet correct getest/getoond) en Criterium 7 (kleurcontrast).
  - **Bewijs kleurwaarde:** `tailwind.shared.js:23` definieert `gold: '#D7C95F'`; er bestaat al een apart contrast-token `goldText: '#8A8943'` (`tailwind.shared.js:43`) dat hiervoor bedoeld lijkt maar niet gebruikt wordt.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/student/BookPreview.tsx:293-303 (kaft-variant; zelfde patroon op regel 410-421 voor pagina's)
    <div className="w-full h-full bg-lab-gold flex flex-col items-center justify-center text-lab-gold border-2 border-dashed border-lab-gold gap-2 p-4 text-center">
        <AlertCircle size={36} className="text-lab-gold" />
        <span className="font-bold text-sm">Oeps! De AI kon dit niet tekenen 🎨</span>
        <span className="text-xs text-lab-gold max-w-[85%] leading-relaxed">
            De AI heeft regels over wat getekend mag worden. Probeer het opnieuw met andere woorden!
        </span>
        ...
    </div>

    // ✅ Voorgesteld — gebruik het bestaande contrast-token lab-goldText i.p.v. lab-gold voor tekst/iconen
    <div className="w-full h-full bg-lab-gold flex flex-col items-center justify-center text-lab-goldText border-2 border-dashed border-lab-goldText gap-2 p-4 text-center">
        <AlertCircle size={36} className="text-lab-goldText" />
        <span className="font-bold text-sm">Oeps! De AI kon dit niet tekenen 🎨</span>
        <span className="text-xs text-lab-goldText max-w-[85%] leading-relaxed">
            De AI heeft regels over wat getekend mag worden. Probeer het opnieuw met andere woorden!
        </span>
        ...
    </div>
    ```
    Pas dezelfde vervanging (`text-lab-gold` → `text-lab-goldText`, `border-lab-gold` → `border-lab-goldText`) toe op de pagina-variant (regels 411, 412, 416, 419).
  - **Scope:** minimum-fix (~8 regels, 2 plekken in hetzelfde bestand). `BookPreview.tsx` staat niet op de auto-fix-whitelist van deze sweep-run — deze fix moet handmatig of via een aparte edit-taak worden toegepast.

### Score
7/9 criteria geslaagd · **Visual Precision Gate: ❌ BLOCKING** (onleesbare fout/feedbackstaat, niet dynamisch geverifieerd — geen dev-server in deze sweep-run) · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 2
**SLO-claim:** `21D`, `22A` (regulier) — `18C`, `19A` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** `21D` en `22A` zijn beide geldige codes, VSO-mapping `18C`/`19A` aanwezig en logisch gekoppeld (`src/config/slo-kerndoelen-mapping.ts:52`).
- **Criterium 2 (SLO-fit):** de missie laat leerlingen daadwerkelijk een AI-tekstprompt (verhaal) en AI-beeldprompt (illustratie) samen laten werken tot één product — raakt `21D` (AI) substantieel en `22A` (digitaal product) via het prentenboek-eindresultaat.
- **Criterium 3 (Leerdoelen):** geen expliciete `learningObjectives`-array, maar `missionGoals.ts:107-114` bevat een concreet, meetbaar `primaryGoal` ("Ik ontwerp een kort verhaal met AI-beeld en tekst die samen een logisch geheel vormen.") met bijbehorend `evidence`-criterium — telt als impliciet leerdoel, action-verb "ontwerp" aanwezig.
- **Criterium 4 (Beknoptheid):** `problemScenario` ~27 woorden, `missionObjective` 4 woorden — ruim binnen de <80-woordengrens voor leerjaar 1.
- **Criterium 5 (Leeftijds-passend):** systemInstruction gebruikt kindvriendelijke taal, concrete voorbeelden (draak, konijn), en een visuele VERHAALBOOG TEMPLATE als scaffold voor leerlingen die vastlopen (`src/config/agents/year1.tsx:916-935`).
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in J1P2 "AI & Creatie" na `prompt-master`/`game-programmeur`, vóór meer open opdrachten — bouwt voort op eerder geleerde prompt-vaardigheid.
- **Criterium 7 (Bloom-balans):** vraagt Creëren (schrijven + visualiseren van een eigen verhaal), maar met stevige scaffolding (template, één pagina per beurt, sturende vervolgvragen) — passend voor leerjaar 1 mits begeleid.
- **Criterium 8 (AI-as-copilot):** de systemInstruction volgt expliciet een stapsgewijze coach-aanpak: AI vraagt door naar de held, biedt hulp aan bij vastlopen, schrijft telkens één pagina en vraagt daarna "Wat gebeurt er daarna?" — geen kant-en-klaar eindproduct in één keer (`src/config/agents/year1.tsx:960-980`). Geen XP-farming-risico gevonden: elke pagina vereist een leerlingbijdrage.
- **Criterium 9 (Welzijn):** VSO-mapping aanwezig; illustratieprompts worden expliciet kindveilig gehouden ("Hou illustratieprompts kindvriendelijk, veilig en concreet", `src/config/agents/year1.tsx:951`).

### ⚠️ Aandachtspunten
- **Criterium 3 (impliciete leerdoelen)**: er is geen apart `learningObjectives`-veld, alleen `primaryGoal` in `missionGoals.ts`.
  - **Wat:** één zin dekt het hele leerdoel; er is geen opsplitsing naar deelvaardigheden (bv. "kan een verhaalstructuur toepassen" vs. "kan een beeldprompt formuleren").
  - **Waarom:** voor beoordelingsdoeleinden (docent-rubric) is één brede zin minder scherp te toetsen dan 2-3 losse, meetbare doelen.
  - **Voorstel:**
    ```text
    ✅ Voor verhalen-ontwerper (leerjaar 1, SLO 21D/22A):
    learningObjectives: [
      'De leerling ontwerpt een kort verhaal met een begin, midden en eind volgens de verhaalboog.',
      'De leerling formuleert een AI-beeldprompt die aansluit bij de inhoud van een verhaalpagina.',
      'De leerling licht toe welke keuzes zijn gemaakt in tekst en beeld om een samenhangend geheel te vormen.',
    ]
    ```
    (Niet whitelisted voor auto-fix in deze sweep — `missionGoals.ts` staat wél op de whitelist, dit is een optionele verrijking, geen blocking issue.)

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — de kern van de missie is het formuleren van tekst- en beeldprompts en het herkennen van AI-beperkingen (veiligheidsfilters bij illustraties).
- **22A (Digitale producten):** sterk geraakt — het prentenboek is het tastbare digitale eindproduct (downloadbaar als PDF, zie `BookPreview.tsx:1328`).

### Score
9/9 criteria geslaagd (1 met lichte kanttekening) · Bloom-balans: medium-hoog met scaffolding · Aanbeveling: **ship**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze batch-review sweep-run.

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** vrijwel alle knoppen (paginanavigatie, print, download, opslaan) hebben een expliciete `onClick` (`src/features/student/BookPreview.tsx:1290-1336`). Uitzondering: zie aandachtspunt hieronder.
- **A2 (Error/loading/empty states):** aparte `loading`-, `error:`-, en lege-state-varianten voor zowel kaft- als pagina-illustraties (`src/features/student/BookPreview.tsx:286-330, 405-446`).
- **A5 (Graceful image-generatie):** `generateImage(...).then(...)` vangt zowel `undefined`-resultaten als `error:`-geprefixte strings op en zet ze in state i.p.v. de promise te laten crashen (`src/hooks/useAgentLogic.ts:912-935`).
- **A6 (Restart-safe state):** boekvoortgang wordt gedebouncet (1s) automatisch opgeslagen via `saveMissionProgress` en bij missie-start hersteld via `loadMissionProgress` met een 5s-timeout-fallback (`src/hooks/useAgentLogic.ts:556-562, 505-533`).
- **A7 (Security):** de AI-respons wordt door `DOMPurify.sanitize` gehaald met een beperkte allowlist vóórdat hij als HTML wordt gerenderd (`src/hooks/useAgentLogic.ts:1032-1035`); leerling-tekst zelf gaat via de gedeelde `enhancePrompt`/`promptEnhancer`-laag. De `systemInstruction` in `year1.tsx:914` is expliciet gedocumenteerd als **DEV-only fallback** in `aiProviderService.ts:571-573` ("Optional, only used for local DEV fallback simulation") — de daadwerkelijke prompt komt server-side uit `roleId`. Dit is dus geen client-side-systemInstruction-overtreding.

#### ⚠️ Aandachtspunten
- **A1 — "Opnieuw proberen"-knop zonder eigen `onClick`** (zie ook design-sectie): `src/features/student/BookPreview.tsx:423-425`.
  - **Wat:** de knop heeft geen `onClick`-prop; hij werkt alleen doordat de klik doorbubbelt naar de omliggende `<div onClick={...}>` op regel 401.
  - **Risico:** functioneert nu toevallig, maar is niet expliciet getest en breekt stil bij een toekomstige refactor (bv. een icon-wrapper die `stopPropagation()` toevoegt).
  - **Voorstel:** zie code-snippet in de design-sectie hierboven.
- **Onleesbare error-state is ook een tech-bug, niet alleen een design-bug**: `text-lab-gold` op `bg-lab-gold` (zie design-sectie) betekent dat de foutboodschap functioneel onbruikbaar is als feedback-signaal — een leerling kan niet zien wát er misging, alleen dat er een goudkleurig vlak verscheen. Zelfde bestand/regels als hierboven.
- **Gedeelde `data: any` in `MissionProgress`-type** (`src/types.ts:180`): dit is generieke infrastructuur die door alle rolgebaseerde missies gedeeld wordt, niet specifiek voor `verhalen-ontwerper` geïntroduceerd — genoteerd als lichte kanttekening, geen blocking issue voor déze missie-review.

#### ❌ Blocking issues
- Geen aparte technische blocking issues bovenop de al genoemde design-blocking (kleurcontrast) — die is hierboven als design-blocking gerapporteerd omdat de kern van het probleem een verkeerd Tailwind-token is, niet ontbrekende logica.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server beschikbaar in deze sweep-run. Multi-viewport visuele verificatie (mobiel/tablet/desktop × intro/mid-flow/eind) en console/network-logs zijn dus niet gecontroleerd voor deze missie. Aanbevolen als follow-up zodra een dev-preview route beschikbaar is voor chatmissies met eigen component.

### Score
Static: 5/6 · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **fix-eerst** (kleurcontrast-fix is klein en snel toe te passen)

---

## Voorstellen — samenvatting

Beide code-voorstellen (kleurcontrast-fix en expliciete retry-`onClick`) zitten in `src/features/student/BookPreview.tsx`, dat **niet** op de auto-fix-whitelist van deze sweep-run staat (whitelist beperkt tot `templateRegistry.ts`, `agents/year*.tsx`, `slo-kerndoelen-mapping.ts`, `curriculum.ts`, `missionGoals.ts`). Deze fixes moeten dus als aparte, handmatige of gerichte edit-taak worden opgepakt — niet automatisch door deze sweep.

De optionele `learningObjectives`-verrijking (didactiek) raakt wél een whitelisted bestand (`missionGoals.ts`) maar is niet blocking en dus geen verplichte auto-fix.

---

## Eindsamenvatting & verdict

`verhalen-ontwerper` is een didactisch sterke, zorgvuldig gescaffoldede missie (9/9 didactiek) met een op zichzelf goed doordacht boek-component: nette loading-states, restart-safe autosave, en sanitized AI-output. Het echte probleem zit in de **foutstaat bij een mislukte illustratie**: door een simpele Tailwind-tokenfout (`text-lab-gold` op `bg-lab-gold`) is de foutboodschap die een 12-jarige nodig heeft ("waarom lukte mijn tekening niet, en wat kan ik doen?") volledig onzichtbaar — precies het scenario waarin een leerling het meest hulp nodig heeft (een AI-veiligheidsfilter blokkeerde de prompt). Dit is een kleine fix (2 tokens vervangen op 2 plekken in hetzelfde bestand) maar wel functioneel blocking voor de leerling-ervaring.

**Verdict: fix-eerst** — didactiek mag los ship'en, maar de kleurcontrast-fix in `BookPreview.tsx` (en idealiter de expliciete retry-`onClick`) hoort vóór livegang van deze missie te worden toegepast.

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
