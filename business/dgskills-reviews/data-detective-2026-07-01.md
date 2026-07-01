# M2 Mission Review — data-detective

**Datum:** 2026-07-01 · **Wave:** 7 · **Type:** handcrafted (dedicated component)
**Component:** `src/features/missions/DataDetectiveMission.tsx`
**Curriculum-plek:** Leerjaar 1, Periode 3 (Digitaal Burgerschap) — `src/config/curriculum.ts:108`

---

## 🎨 Design review

**Mission:** data-detective (handcrafted)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 2 (Layout consistentie):** N.v.t. (handcrafted, geen template-baseline)
- **Criterium 3 (Knop-clarity):** alle 5 `<button>`-elementen hebben functionele `onClick` + duidelijk label (`DataDetectiveMission.tsx:551,458,529,665,716`); geen dode knoppen
- **Criterium 5 (Responsive, statisch):** `max-w-lg`/`max-w-2xl`/`max-w-4xl` + `w-full`, geen vaste pixel-widths; responsive prefixes (`sm:`) aanwezig op chart-grid (`DataDetectiveMission.tsx:214`)
- **Criterium 6 (Framer Motion):** geen `motion.*`-gebruik — component gebruikt CSS-transitions (`transition-all duration-300/500`), geen wrapper-spam
- **Visual Precision Gate (statisch):** geen `w-[Npx]`-vaste breedtes, chart-componenten gebruiken relatieve/SVG-viewBox-schaling; geen zichtbare overlap-risico's in de JSX-structuur

### ⚠️ Aandachtspunten
- **Criterium 1 (Tailwind token consistentie)**: component gebruikt **uitsluitend inline `style={{ backgroundColor: '#...' }}`** i.p.v. duck-tokens, terwijl 5 van de gebruikte hex-waarden exact matchen met bestaande tokens — `DataDetectiveMission.tsx` (tientallen regels, o.a. 213, 424, 429, 452, 461, 546, 562-571, 652)
  - **Wat:** `#f2f1ec` (29+ occurrences als achtergrond) = `duck-bg`, `#202023` (29×) = `duck-ink`, `#e1ff01` (4×) = `duck-acid`, `#ff3c21` (29×, gebruikt als primaire CTA/accent-kleur) = `duck-error`. Component importeert nul Tailwind color-classes voor deze kleuren; alles via `style` inline.
  - **Waarom:** `#ff3c21` (`duck-error`) wordt hier gebruikt als **primaire actieknop-kleur** (regels 461, 531, 719) — dat is semantisch verkeerd: `duck-error` is bedoeld voor foutstaten, niet voor de hoofd-CTA. Dit vervuilt het merkkleursysteem en maakt de missie moeilijker te onderhouden (geen enkele Tailwind-class om op te grep'en bij een rebrand).
  - **Voorstel:** vervang de repetitieve inline-hex-patronen door `bg-duck-bg`, `text-duck-ink`, `text-duck-gray` (voor `#6f6e69`, benaderend) waar mogelijk. Voor de CTA-kleur: overweeg `duck-ink` of `duck-acid` i.p.v. `duck-error` voor primaire acties — `duck-error` semantisch herstellen voor echte foutmeldingen. Dit is een grote sweep (60+ regels) — **niet autoFixable** binnen scope van dit rapport; apart op te pakken als tech-debt.
- **Criterium 7 (Toegankelijkheid — kleurcontrast)**: `#6f6e69` (secundaire tekst, geen bestaand duck/lab-token) op `#f2f1ec` (duck-bg) — contrastratio is grensgeval (~4.1:1), voldoet net aan WCAG AA voor normale tekst maar niet ruim. Niet blocking, wel aandachtspunt voor leesbaarheid op mobiel-schermen in zonlicht.
- **Criterium 3 (icon-only elements)**: geen expliciete `aria-label` op de terug-knop (`<ArrowLeft>` only, `DataDetectiveMission.tsx:550-558`) — icon-only knop zonder tekst-label of aria-label.
  - **Wat:** `<button onClick={onBack} ...><ArrowLeft size={24} /></button>` heeft geen `aria-label="Terug"`.
  - **Waarom:** screenreader-gebruikers horen geen functie-omschrijving bij deze knop.
  - **Voorstel (autoFixable):**
    ```tsx
    // ❌ Huidig — DataDetectiveMission.tsx:550
    <button
        onClick={onBack}
        className="p-2 transition-colors"

    // ✅ Voorgesteld
    <button
        onClick={onBack}
        aria-label="Terug naar Mission Control"
        className="p-2 transition-colors"
    ```

### ❌ Blocking issues
Geen.

### Score
4/7 criteria volledig geslaagd (2 N.v.t.) · Aanbeveling: **fix-eerst** (token-migratie is tech-debt, niet blocking; aria-label is autoFixable)

---

## 📚 Didactiek review

**Mission:** data-detective (handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim (autoritair, `slo-kerndoelen-mapping.ts:65`):** `sloKerndoelen: ['23A', '21C']`, `sloVsoKerndoelen: ['18B', '20A']`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23A` (Veiligheid & privacy) en `21C` (Data & Dataverwerking) zijn beide geldige regulier-VO-codes; `18B`/`20A` zijn geldige VSO-codes — `slo-kerndoelen-mapping.ts:65`
- **Criterium 2 (SLO-fit)**: sterk geraakt. Alle 6 challenges (beginner/gevorderd/expert) draaien direct op databehandeling door bedrijven (21C) en privacykeuzes/dark patterns (23A) — `DataDetectiveMission.tsx:73-205`
- **Criterium 4 (Opdracht-beknoptheid, leerjaar 1: intro <80 woorden)**: intro-description in `IntroScreen`-props is 18 woorden (`DataDetectiveMission.tsx:412`); scenario's per challenge zijn 15-35 woorden — ruim binnen grens
- **Criterium 5 (Leeftijds-passend taal)**: vocabulaire is B1-niveau met inline-uitleg van vakjargon tussen haakjes, bv. "een verband (= twee dingen die samen veranderen)" (regel 179), "dark pattern (= een truc die je iets laat doen wat je niet wilt)" (regel 199) — precies het gewenste scaffolding-patroon voor onderbouw
- **Criterium 7 (Bloom-balans)**: goede opbouw — beginner = herkennen/begrijpen (b1, b2), gevorderd = analyseren/evalueren (g1, g2 met "spot de misleiding"), expert = evalueren/kritisch redeneren (e1 correlatie-vs-causatie, e2 dark patterns) — mooie Bloom-progressie over de 3 levels
- **Criterium 9 (Welzijn & inclusiviteit)**: VSO-mapping aanwezig (`18B`, `20A`); toon is empowerend, niet angst-gedreven ("Empower leerlingen: geef ze kennis en handelingsperspectief, GEEN angst" — zie agent-role systemInstruction, `year1.tsx:2130` e.v., zie escalatie hieronder)

### ⚠️ Aandachtspunten
- **Criterium 3 (Leerdoelen helder)**: geen expliciete `learningObjectives`-array; `MISSION_GOAL.primaryGoal` ("Ik onderzoek hoe apps data gebruiken en kies bewust welke data ik wel of niet deel.") is impliciet leerdoel-achtig maar mist een actiewerkwoord-structuur per deel-doel — `DataDetectiveMission.tsx:34-42`
  - **Wat:** één brede primaryGoal-zin, geen per-level leerdoelen.
  - **Waarom:** docent kan minder precies rapporteren welk deel-kerndoel per level (beginner/gevorderd/expert) geraakt is.
  - **Voorstel:** niet blocking — `MISSION_GOAL.evidence` compenseert deels ("Antwoorden over patronen, misleiding en kritische datakeuzes"). Optioneel: 3 sub-leerdoelen toevoegen per level, geen verplichte fix.
- **Criterium 8 (AI-as-copilot)**: mission gebruikt **geen chat/AI-interactie** ondanks een uitgebreide `systemInstruction` + `problemScenario` gedefinieerd in de agent-role-entry (`year1.tsx:2096-2135+`). Zie escalatie hieronder — dit is primair een tech-bevinding maar heeft didactische impact.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy)**: sterk geraakt — elke challenge vraagt leerlingen expliciet privacyrisico's te wegen (bv. g1: "welke toepassing vraagt de meeste kritische controle", e2: dark patterns bij cookie-consent)
- **21C (Data & Dataverwerking)**: sterk geraakt — leerlingen interpreteren bar/line/pie/table-datasets en trekken conclusies over databehandeling door bedrijven

### Score
6/8 toepasbare criteria geslaagd · Bloom-balans: **medium-hoog** (mooie progressie, ongebruikelijk sterk voor leerjaar 1) · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** data-detective (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen screenshots-map aanwezig, geen dev-server gestart in deze review-run (grep in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` gaf geen treffer voor `data-detective` — deze missie zat niet in de 2026-06-30 sweep)

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (Knop-handlers)**: alle 5 knoppen hebben functionele `onClick` — geen dode knoppen (`DataDetectiveMission.tsx:551,458,529,665,716`)
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`; alle interfaces expliciet gedefinieerd (`DataDetectiveState`, `Props`, `DataChallenge`) — `DataDetectiveMission.tsx:17-70`
- **Criterium A4 (Imports via `@/*`)**: alle imports gebruiken `@/types`, `@/hooks/useMissionAutoSave`, `@/features/missions/templates/shared/IntroScreen` — geen relatieve `../../`-paden (`DataDetectiveMission.tsx:12-15`)
- **Criterium A6 (Restart-safe state)**: `useMissionAutoSave<DataDetectiveState>('data-detective', {...})` direct aangeroepen in component — voortgang overleeft refresh (`DataDetectiveMission.tsx:335-346`)
- **Criterium A7 (Security)**: geen `dangerouslySetInnerHTML`, geen AI-calls dus geen `promptSanitizer`-noodzaak — component is pure client-side quiz-logica zonder externe data-instroom

#### ⚠️ Aandachtspunten
- **Criterium A2 (Error states)**: geen expliciete try/catch of error-state aanwezig, maar **geen async-operaties in dit component** (geen `fetch`, geen `supabase.functions.invoke`) — dus dit criterium is grotendeels n.v.t. Enige risico: `useMissionAutoSave` kan intern falen (bv. localStorage vol/geblokkeerd) zonder zichtbare foutmelding aan de leerling, maar dat is een gedeeld hook-patroon buiten scope van deze missie.
- **Criterium A5 / A7 (dormant agent-role — BELANGRIJKSTE BEVINDING)**: `src/config/agents/year1.tsx:2096` bevat een volledige `AGENT_ROLES`-entry voor `data-detective` met `systemInstruction` (Data Detective Coach persona), `problemScenario`, `visualPreview`, `examplePrompt` — maar het dedicated component `DataDetectiveMission.tsx` **importeert geen `StudentAIChat`, gebruikt geen `roleId`, en heeft geen enkele chat/AI-interactie**. De twee zijn volledig ontkoppeld.
  - **Wat:** een complete, doordachte AI-coach-persona bestaat in de codebase maar wordt nergens aangeroepen door de missie die zijn `id` deelt.
  - **Risico:** dit is het **bekende dormant-chat-patroon** uit `project_mission_delivery_types` (memory) — een template-missie zonder `enableChat` maakt de agent-rol dormant. Hier is het net andersom: een **handcrafted** component dat de bijbehorende agent-role helemaal negeert. Geen leerling-zichtbaar risico (de missie werkt prima zonder chat, quiz-logica is deterministisch en zelfstandig) — maar het is verwarrend onderhoud: een toekomstige dev kan denken dat de missie chat-gedreven is.
  - **Voorstel:** GEEN fix binnen deze review-scope (architectuurkeuze, niet een bug). **Escaleren** naar `dgskills-mission-author` of Yorin: ofwel (a) de agent-role-entry in `year1.tsx` bewust markeren als ongebruikt/legacy in een comment, ofwel (b) een bewuste product-beslissing maken om een optionele AI-verdiepingsvraag toe te voegen aan het component. Niet autoFixable — vereist productkeuze.
- **Criterium A6 (missing-asset check)**: beide gekoppelde assets bestaan wél op schijf — `public/assets/previews/project_data_detective.webp` (392KB) en `public/assets/agents/social_safeguard.webp` (54KB) zijn aanwezig, geen 404-risico.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — geen screenshots-map beschikbaar voor `data-detective`, geen dev-server gestart binnen deze reviewrun, en de missie zat niet in de `docs/audits/student-missions-ui-ux-review-2026-06-30.md`-sweep (0 treffers bij grep). Alle visuele/dynamische claims in dit rapport zijn **unverified** — Visual Precision Gate: **WARN** (statisch geen breukbewijs, maar geen viewport/state-verificatie uitgevoerd).

### Score
Static: 5/7 volledig geslaagd (2 aandachtspunten, geen blocking) · Dynamic: n.v.t. · Aanbeveling: **fix-eerst** (dormant agent-role + token-migratie zijn tech-debt, geen leerling-blockers; wel binnen een volgende wave oppakken)

---

## Samenvattend oordeel

| As | Score (0-10, hoger = meer issues) | Verdict |
|---|---|---|
| Design | 4 (inline-hex i.p.v. tokens, ontbrekend aria-label) | fix-eerst |
| Didactiek | 2 (sterke missie, kleine leerdoel-formulering-gap) | ship |
| Tech | 4 (dormant agent-role, geen dynamic verificatie mogelijk) | fix-eerst |

**Eindverdict: fix-eerst.** Geen blocking issues voor leerlingen — de missie werkt functioneel correct, is didactisch sterk (goede Bloom-progressie, empowerend i.p.v. angstgedreven, correcte SLO-fit) en technisch veilig (geen AI/security-oppervlak, restart-safe state). De aandachtspunten zijn stuk voor stuk **tech-debt/onderhoudskwaliteit**, niet leerling-zichtbare bugs: (1) inline-hex i.p.v. duck-tokens (grote sweep, niet in scope hier), (2) ontbrekend aria-label op terug-knop (klein, autoFixable), (3) dormant agent-role in `year1.tsx` die nergens wordt aangeroepen (architectuurvraag, escaleren).

## Escalaties
- **Dormant agent-role `data-detective` in `src/config/agents/year1.tsx:2096`**: volledige AI-coach-persona (systemInstruction, problemScenario) bestaat maar wordt door het dedicated component nooit aangeroepen. Geen leerling-risico, wel onderhoudsverwarring. → escaleren naar Yorin/mission-author voor bewuste keuze (comment markeren als legacy, of alsnog integreren).
- **Geen dynamic/visuele verificatie mogelijk** binnen deze review-run (geen dev-server, geen bestaande screenshots, niet in de 2026-06-30-sweep) — Visual Precision Gate blijft WARN tot een aparte Fase-B-run.

## AutoFixable (mechanisch + missie-specifiek)
1. **aria-label op terug-knop** — `src/features/missions/DataDetectiveMission.tsx:550-558`
