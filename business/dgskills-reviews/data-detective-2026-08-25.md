# Review: Data Detective — 2026-08-25

**templateType:** dedicated / handcrafted (`src/features/missions/DataDetectiveMission.tsx`)
**Curriculum-plek:** Leerjaar 1, Periode 3 ("Digitaal Burgerschap")
**AI-gedrag & privacy:** aparte veiligheids-pass (zie sweep-rapport). Deze missie heeft geen chat/AI-interactie (geen `enableChat`, geen `supabase.functions.invoke`) — buiten scope van deze pass sowieso.

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)
**Criterium 2 (layout consistentie):** N.v.t. (handcrafted, geen template-baseline)

### ✅ Geslaagd
- **Criterium 3 (knop-clarity):** alle knoppen hebben duidelijke labels + icon (`Volgende`, `Volgende Level`, terug-pijl met `aria-label`) en functionele `onClick` — `src/features/missions/DataDetectiveMission.tsx:550-559, 717-725`.
- **Criterium 4 (copy-lengte):** scenario's en vragen zijn kort (1-2 zinnen), passend bij leerjaar 1 — bv. `src/features/missions/DataDetectiveMission.tsx:79, 86`.
- **Criterium 5 (responsive, statisch):** gebruikt `max-w-*`/`w-full`, geen vaste pixel-breedtes, responsive Tailwind-prefixes (`sm:`) op tekstgroottes — `src/features/missions/DataDetectiveMission.tsx:213-231`.

### ⚠️ Aandachtspunten
- **Criterium 1 (Tailwind token consistentie)**: het hele component gebruikt inline `style={{ backgroundColor: '#f2f1ec', color: '#202023', ... }}` met hex-literals in plaats van `duck-*`-tokens, terwijl exact deze hex-waarden 1-op-1 overeenkomen met bestaande tokens (`#f2f1ec` = `duck-bg`, `#202023` = `duck-ink`, `#ff3c21` = `duck-error`). — `src/features/missions/DataDetectiveMission.tsx:424, 546, 561-588` (en tientallen andere plekken).
  - **Wat:** geen enkele `duck-*`/`lab-*` class, alles via `style`-object met hardcoded hex.
  - **Waarom:** breekt met het projectconventie ("gebruik `duck-*` tokens voor nieuwe componenten") en maakt een toekomstige theming/rebrand-pas onmogelijk zonder deze file handmatig te doorzoeken.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/missions/DataDetectiveMission.tsx:546
    <div className="min-h-screen" style={{ backgroundColor: '#f2f1ec' }}>

    // ✅ Voorgesteld
    <div className="min-h-screen bg-duck-bg">
    ```
- **Criterium 6 (dode hover-states)**: op drie knoppen is `onMouseEnter`/`onMouseLeave` gedefinieerd maar zet beide dezelfde kleur — geen enkel visueel effect. — `src/features/missions/DataDetectiveMission.tsx:461-463, 532-534, 720-722`.
  - **Wat:** `onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ff3c21')}` en `onMouseLeave={...'#ff3c21'}` zijn identiek.
  - **Waarom:** dode code; leerling krijgt geen hover-feedback, en het is verwarrend voor een volgende ontwikkelaar die denkt dat er een hover-effect actief is.
  - **Voorstel:** verwijder de no-op handlers, of gebruik een echte Tailwind `hover:` class.
- **Criterium 7 (toegankelijkheid)**: de bar/line/pie/table-grafieken communiceren waarden uitsluitend visueel (kleur + positie); er is geen `aria-label`/`role="img"` met een tekstuele samenvatting van de dataset voor screenreader-gebruikers. — `src/features/missions/DataDetectiveMission.tsx:208-332`.
  - **Wat:** `<svg>`/`<div>`-grafieken zonder toegankelijke tekstuele equivalent.
  - **Waarom:** een leerling die een screenreader gebruikt kan de kernopdracht (grafiek interpreteren) niet volgen.
  - **Voorstel:** voeg `aria-label` toe met een korte tekstsamenvatting, bv. `aria-label={data.labels.map((l,i)=>`${l}: ${data.values[i]}`).join(', ')}` op de chart-wrapper.

### ❌ Blocking issues
- Geen.

### Score
5/7 criteria geslaagd (Criterium 2 n.v.t.) · Visual Precision Gate: **unverified** — geen dev-server/Chrome-plugin bewijs beschikbaar in deze pass · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim:** `src/config/slo-kerndoelen-mapping.ts:68` → `['23A', '21C']` (regulier), `['18B', '20A']` (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes geldig)**: `23A` (Veiligheid & privacy) en `21C` (Data & Dataverwerking) zijn geldige, bij elkaar passende codes voor een missie over datatracking en privacykeuzes — `src/config/slo-kerndoelen-mapping.ts:68`.
- **Criterium 2 (SLO-fit)**: elke ronde (app-databronnen, personalisatie-trade-off, doorgifte aan derden, misleidende grafiek, correlatie-vs-causaliteit, dark patterns) oefent zichtbaar met privacy-afwegingen en dataverwerking — `src/features/missions/DataDetectiveMission.tsx:73-205`.
- **Criterium 5 (leeftijds-passend)**: concrete, herkenbare voorbeelden (TikTok, Instagram, cookie-pop-up) i.p.v. abstract jargon; tone is direct — `src/features/missions/DataDetectiveMission.tsx:78-92, 186-204`.
- **Criterium 7 (Bloom-balans)**: goede opbouw van onthouden/begrijpen (beginner) → analyseren (gevorderd: misleidende grafiek herkennen) → evalueren (expert: correlatie vs. causaliteit, dark patterns) — `src/features/missions/DataDetectiveMission.tsx:75-204`.
- **Criterium 9 (VSO-mapping)**: aanwezig en inhoudelijk passend — `src/config/slo-kerndoelen-mapping.ts:68`.

### ⚠️ Aandachtspunten
- **Criterium 1/6 (metadata-coherentie tussen bronnen)**: de SLO-codes voor deze missie verschillen tussen twee bronnen die beide claimen autoritatief te zijn: `slo-kerndoelen-mapping.ts` zegt `['23A', '21C']`, maar `ProjectZeroDashboard.tsx` toont de leerling nog de oude codes `['21B', '23C']`.
  - **Wat:** `src/config/slo-kerndoelen-mapping.ts:68` (comment bevestigt bewuste wijziging: "21B,23C→23A,21C") vs. `src/features/student/ProjectZeroDashboard.tsx:150` (nog `sloKerndoelen: ['21B', '23C']`).
  - **Waarom:** de leerling en (via reporting) de docent zien inconsistente kerndoel-labels voor dezelfde missie, afhankelijk van welk scherm ze bekijken — ondermijnt de betrouwbaarheid van de SLO-rapportage aan docenten.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/student/ProjectZeroDashboard.tsx:150
    { id: 'data-detective', title: 'Data Detective', description: 'Ontdek wat bedrijven met data doen: risico's en kansen.', icon: <BarChart2 size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('data-detective'), sloKerndoelen: ['21B', '23C'], sloVsoKerndoelen: ['18B', '20A'] },

    // ✅ Voorgesteld
    { id: 'data-detective', title: 'Data Detective', description: 'Ontdek wat bedrijven met data doen: risico's en kansen.', icon: <BarChart2 size={40} />, number: '01', status: 'available', info: getMissionTooltipInfo('data-detective'), sloKerndoelen: ['23A', '21C'], sloVsoKerndoelen: ['18B', '20A'] },
    ```
    *(Buiten de whitelist van deze rubric-pass — `ProjectZeroDashboard.tsx` staat niet in de auto-fix scope. Zie escalatie hieronder.)*
- **Criterium 7 (Bloom, gaming-risico i.p.v. didactiek)**: van de 6 challenges heeft het juiste antwoord in 4 van de 6 gevallen optie `a` of vroeg in de lijst (`b1`→a, `b2`→a, `g2`→a, verder `g1`→c, `e1`→b, `e2`→b) — `src/features/missions/DataDetectiveMission.tsx:88, 108, 130, 150, 178, 199`.
  - **Wat:** geen shuffle van antwoordopties; een leerling die snel doorklikt kan met een "kies meestal a"-strategie een deel van de punten scoren zonder de redenering te volgen.
  - **Waarom:** ondermijnt het doel van de missie (kritisch redeneren) en past niet bij "geen beloning voor oppervlakkige interactie" (project-invariant, `src/features/missions/CLAUDE.md`).
  - **Voorstel:** shuffle `options` per challenge bij het laden van de challenge (bv. met een seeded shuffle op basis van `challenge.id`), zodat de juiste-antwoordpositie niet voorspelbaar is.

### ❌ Blocking issues
- Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy)**: sterk geraakt — vrijwel elke ronde draait om privacyafwegingen (databronnen, doorgifte aan derden, dark patterns).
- **21C (Data & Dataverwerking)**: sterk geraakt — leerling interpreteert grafieken, herkent misleiding, onderscheidt verband van oorzaak.

### Score
5/9 criteria expliciet geslaagd, overige n.v.t./niet apart getoetst · Bloom-balans: **medium-hoog** (goede progressie, licht risico op gaming door voorspelbare antwoordposities) · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server beschikbaar in deze rubric-pass.

### Static analyse

#### ✅ Geslaagd
- **A1 (knop-handlers)**: alle knoppen hebben functionele `onClick` (`onBack`, `handleAnswer`, `handleNext`, `handleNextLevel`, completion-knop) — `src/features/missions/DataDetectiveMission.tsx:550, 664-666, 717-718, 458-459, 529-530`.
- **A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`; props en state hebben expliciete interfaces (`Props`, `DataDetectiveState`, `DataChallenge`) — `src/features/missions/DataDetectiveMission.tsx:17-70`.
- **A4 (imports via alias)**: alle imports gebruiken `@/`-alias of relatieve imports binnen dezelfde feature-map (`./templates/shared/...`), geen `../../`-ketens — `src/features/missions/DataDetectiveMission.tsx:10-15`.
- **A5 (edge function calls)**: n.v.t. — component doet geen `supabase.functions.invoke`, geen netwerk-calls.
- **A6 (restart-safe state)**: gebruikt `useMissionAutoSave` direct, geen tussenlaag — `src/features/missions/DataDetectiveMission.tsx:335-346`.
- **A7 (security)**: geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`, geen leerling-vrije-tekstinvoer die naar AI/DOM gaat (multiple-choice only) — geen aanknopingspunt voor XSS of prompt-injection.

#### ⚠️ Aandachtspunten
- **Config-drift / duplicate source-of-truth voor missiedoel**: het component definieert een eigen lokale `MISSION_GOAL`-constante (`primaryGoal`, `criteria.min: 3`, `evidence`) i.p.v. de centrale entry uit `src/config/missionGoals.ts` te importeren en te gebruiken. De twee definities zijn inhoudelijk verschillend: de centrale entry mist `criteria.min`, en de `primaryGoal`-tekst is woord-voor-woord gelijk maar niet gekoppeld — een toekomstige wijziging aan één plek werkt niet door naar de ander.
  - **Wat:** `src/features/missions/DataDetectiveMission.tsx:34-42` (lokale const, wordt daadwerkelijk gebruikt in `IntroScreen`) vs. `src/config/missionGoals.ts:186-193` (nooit geïmporteerd door dit component, dus dode/ongebruikte config).
  - **Risico:** iemand die `missionGoals.ts` aanpast (bv. voor een dashboard-overzicht dat wél die centrale bron leest) verwacht dat de missie zelf hetzelfde doel toont — dat klopt hier toevallig tekstueel, maar structureel is er geen garantie, en `criteria.min: 3` bestaat alleen lokaal.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — src/features/missions/DataDetectiveMission.tsx:34-42
    const MISSION_GOAL: MissionGoal = {
        primaryGoal: 'Ik onderzoek hoe apps data gebruikt en kies bewust welke data ik wel of niet deel.',
        criteria: {
            type: 'component-complete',
            min: 3,
            description: 'Alle drie Data Detective levels zijn voltooid.',
        },
        evidence: 'Antwoorden over patronen, misleiding en kritische datakeuzes.',
    };

    // ✅ Voorgesteld — importeer uit de centrale bron, of vul de centrale bron aan met `criteria.min`
    import { MISSION_GOALS } from '@/config/missionGoals';
    const MISSION_GOAL: MissionGoal = MISSION_GOALS['data-detective'];
    ```
    *(Vereist ook een `min: 3` toevoeging aan `src/config/missionGoals.ts:186-193` — binnen de whitelist van deze pass.)*
- **Overcomplexe progress-berekening**: `completedChallenges` gebruikt een `filter(...).slice(...).length`-constructie die drie geneste ternaries combineert om in feite alleen "aantal voltooide challenges vóór het huidige level + huidige index" te berekenen.
  - **Wat:** `src/features/missions/DataDetectiveMission.tsx:357-363`.
  - **Risico:** geen actieve bug geconstateerd, maar de logica is moeilijk te verifiëren op correctheid en foutgevoelig bij een toekomstige wijziging (bv. een vierde level toevoegen breekt de hardcoded `2 +` / `4 +` offsets).
  - **Voorstel:** vervang door een expliciete `LEVEL_ORDER = ['beginner','gevorderd','expert']`-lookup: `LEVEL_ORDER.indexOf(currentLevel) * 2 + currentChallengeIndex` (met level-lengtes uit `CHALLENGES.filter(...).length` i.p.v. hardcoded `2`).

#### ❌ Blocking issues
- Geen.

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server beschikbaar in deze rubric-pass. Alle claims boven zijn static-code-gebaseerd.

### Score
Static: 6/7 criteria geslaagd (1 n.v.t.: A5) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst**

---

## Voorstellen (samenvatting, mechanisch toepasbaar binnen whitelist)

1. **`src/config/missionGoals.ts:186-193`** — voeg `min: 3` toe aan de `criteria` van de `data-detective`-entry, zodat deze inhoudelijk overeenkomt met de lokale `MISSION_GOAL` in het component (voorkomt verdere drift, ook al gebruikt het component de centrale bron nu nog niet).
2. **`src/features/missions/DataDetectiveMission.tsx`** — verwijder de drie no-op hover-handlers (`onMouseEnter`/`onMouseLeave` die dezelfde kleur zetten) op regel 461-463, 532-534, 720-722.

## Escalaties (buiten whitelist van deze rubric-pass)

- **`src/features/student/ProjectZeroDashboard.tsx:150`** — `sloKerndoelen` staat op de oude waarde `['21B', '23C']` terwijl `slo-kerndoelen-mapping.ts` (de bedoelde autoritatieve bron, met expliciete migratie-comment) `['23A', '21C']` gebruikt. Dit bestand valt buiten de whitelist van deze missie-specifieke rubric-pass; aanpassing hoort bij een cross-missie sweep of losse fix-taak, omdat `ProjectZeroDashboard.tsx` mogelijk meerdere missies met dezelfde drift bevat.

---

## Samenvatting & verdict

Data Detective is een inhoudelijk sterke, didactisch goed opgebouwde quiz-missie (privacy/data-tracking, misleidende grafieken, correlatie-vs-causaliteit) met correcte SLO-fit en passend taalgebruik voor leerjaar 1. Er zijn geen blocking issues en geen security-risico's (geen AI-interactie, geen vrije tekstinvoer, geen edge-function calls). De aandachtspunten zijn stuk voor stuk klein en mechanisch te verhelpen: geen `duck-*`-designtokens gebruikt (afwijking van projectconventie), dode hover-handlers, een ongebruikte/drift-gevoelige `missionGoals.ts`-entry, een verouderde SLO-labelset op het dashboard (cross-file, buiten whitelist), en een voorspelbare antwoordpositie die het kritisch-denken-doel van de missie licht ondermijnt.

**Verdict: fix-eerst** — geen herontwerp nodig, wel een paar gerichte fixes vóór verdere opschaling (met name de SLO-labelmismatch, omdat die de docent-rapportage raakt).

AI-gedrag & privacy: aparte veiligheids-pass (zie sweep-rapport).
