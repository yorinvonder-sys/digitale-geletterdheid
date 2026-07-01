# DGSkills Missie-review — Algorithm Architect

**Datum:** 2026-07-02
**Mission ID:** `algorithm-architect`
**Template:** `simulation-lab`
**Config:** `src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts`
**Curriculum-plek:** Leerjaar 2, Periode 1 (`src/config/curriculum.ts:181`)
**SLO-claim:** `22B` (Programmeren), VSO `19A` — `src/config/slo-kerndoelen-mapping.ts:110`

---

## 🎨 Design review

**Mission:** algorithm-architect (simulation-lab)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Visual Precision Gate**: engine (`SimulationLab.tsx`) is gedeeld cross-cut UI, geen missie-specifieke afwijking. Geen screenshots-map aanwezig voor deze missie (genoteerd onder tech-review B); statisch oordeel gebaseerd op config + engine.
- **Criterium 1 (Tailwind tokens)**: engine gebruikt consistent `duck-*` tokens (`SimulationLab.tsx:288-491`). Config zelf bevat geen `className`-strings (content-only bestand) — geen missie-specifieke token-inconsistentie.
- **Criterium 1b (badge/bar-chart hex-kleuren)**: badge-`color: '#202023'` (algorithm-architect.ts:408-432) is identiek aan zusterconfigs `code-reviewer.ts` en `ai-spiegel.ts` — consistent patroon binnen simulation-lab (badges gebruiken hex, niet Tailwind class, in alle sim-lab configs). Bar-chart kleuren (`#ff3c21`, `#e3e2dc`, `#202023`, algorithm-architect.ts:62-77) matchen exact `duck-error`/`duck-gray`/`duck-ink` — geen off-brand kleur.
- **Criterium 2 (Layout consistentie)**: alle drie simulaties gebruiken standaard engine-visualTypes (`meter`, `bar-chart`, `comparison`) zonder custom rendering — volledig consistent met andere sim-lab missies.
- **Criterium 3 (Knop-clarity)**: geen missie-specifieke knoppen; alle interactie loopt via engine (`SimulationLab.tsx:405-422`), reeds engine-gevalideerd.
- **Criterium 4 (Copy-lengte)**: introDescription 30 woorden (limiet leerjaar 2: <80), ronde-beschrijvingen 12-27 woorden (limiet <60) — ruim binnen norm.
- **Criterium 6 (Framer Motion)**: geen missie-specifieke animaties; engine-verantwoordelijkheid.
- **Criterium 7 (Toegankelijkheid)**: geen missie-specifieke a11y-afwijkingen; content is puur tekst/opties, geen afbeeldingen of formulieren buiten engine-gestandaardiseerde controls.

### ⚠️ Aandachtspunten
*(geen)*

### ❌ Blocking issues
*(geen)*

### Score
7/7 criteria geslaagd (2 n.v.t. — geen custom UI in config) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** algorithm-architect (simulation-lab)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 22B (regulier), 19A (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `22B` is een geldige code (Programmeren); `19A` is geldig VSO — `src/config/slo-kerndoelen-mapping.ts:110`. Precies 1 kerndoel geclaimd — geen overclaim.
- **Criterium 2 (SLO-fit)**: alle drie simulaties oefenen direct programmeer-denken (algoritme-vergelijking, sorteerlogica, pseudocode) — sterke, substantiële fit met 22B, geen oppervlakkig contact.
- **Criterium 3 (Leerdoelen helder)**: `missionGoal.primaryGoal` (algorithm-architect.ts:167) — "Ik vergelijk algoritmes en leg uit wanneer een zoek-, sorteer- of pseudocode-aanpak efficient is" — bevat meetbare actiewerkwoorden (vergelijken, uitleggen) op Bloom-niveau "analyseren/evalueren". `missionGoals.ts:478` herhaalt dit consistent.
- **Criterium 4 (Opdracht-beknoptheid)**: alle copy-velden ruim onder leerjaar-2-limiet (zie design-review woordentelling).
- **Criterium 5 (Leeftijds-passend)**: vocabulaire past bij 13-14 jaar — voorbeelden zijn concreet (bibliotheek-zoeksysteem, boeken zoeken), technische termen (Big-O, O(n²)) worden in de `explanation`-velden uitgelegd in gewone taal (bv. sa1-q3, algorithm-architect.ts:328-330).
- **Criterium 6 (Curriculum-plek)**: leerjaar 2 periode 1, naast `web-developer` en `network-navigator` (curriculum.ts:179-183) — logische opbouw richting programmeer-denken.
- **Criterium 7 (Bloom-balans)**: mix aanwezig — onthouden (za1-q1 definitie), toepassen (za1-q3 "je hebt de simulatie gedraaid met..."), analyseren (sa1-q2 waarom-vraag). Geen pure quiz-recall.
- **Criterium 9 (Welzijn & inclusiviteit)**: VSO-mapping aanwezig (`19A`); geen gevoelige onderwerpen van toepassing.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot)**: `templateRegistry.ts:35` heeft géén `enableChat: true` voor deze missie, terwijl `src/config/agents/year2.tsx:622-628` een volledig uitgewerkte `systemInstruction` ("Computational Thinking Coach") bevat die nooit wordt aangeroepen.
  - **Wat:** de agent-rol-entry suggereert een chat-copiloot, maar de missie levert die functionaliteit niet — dit is de bekende platform-brede "dormante chat-rol"-situatie (niet missie-specifiek, niet herhalen als nieuw issue).
  - **Waarom:** geen impact op leerling-leerproces zolang de simulatie zelfstandig functioneert (wat hier het geval is) — genoteerd voor volledigheid, geen actie vereist op missie-niveau.

### ❌ Blocking issues
*(geen)*

### SLO-fit oordeel
- **22B (Programmeren)**: sterk geraakt — alle drie simulaties + hun vragen oefenen algoritmisch denken direct (zoeken, sorteren, pseudocode als planningsstap voor code).

### Score
8/8 criteria geslaagd (1 dormant-chat-note, platform-breed, geen fail) · Bloom-balans: medium · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** algorithm-architect (simulation-lab)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen screenshots-map aanwezig voor deze missie en geen dev-server in scope van deze reviewronde; `algorithm-architect` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`.

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (Knop-handlers)**: geen missie-specifieke knoppen in config; alle interactie via gevalideerde engine-handlers (`SimulationLab.tsx:405,418`).
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore` in de config. Type-casts (`params['x'] as number`, algorithm-architect.ts:13,15,17) zijn expliciete narrowing van een `Record<string, number|string|boolean>`-parameterobject — consistent patroon met engine-contract, geen onveilige `any`.
- **Criterium A4 (Imports)**: enige import is relatief `'../SimulationLab'` (algorithm-architect.ts:1) — dit is het staande patroon binnen `templates/simulation-lab/configs/*.ts` (sibling-import binnen dezelfde template-map, niet een cross-domain pad); consistent met zusterconfigs, geen afwijking.
- **Criterium A6 (Restart-safe state)**: voortgang loopt via de gedeelde `SimulationLab`-engine (`useMissionAutoSave`-patroon op engine-niveau) — geen missie-specifieke state buiten de engine.
- **Criterium A7 (Security)**: geen AI-calls, geen `dangerouslySetInnerHTML`, geen user-input naar een model — config is pure content zonder externe data-flows.
- **Interne consistentie simulatie-logica ↔ vragen**: geverifieerd voor Sim 1 — `za1-q3` vraagt naar het aantal stappen bij binair zoeken op 1000 items; `computeVisuals` (algorithm-architect.ts:40-42) berekent voor `lijstgrootte===2, algoritme===1, gesorteerd=true` een `stappenLabel` van "~10 stappen (binair zoeken)", exact matchend met het correcte antwoord in `za1-q3` (regel 262-268). Score-logica (regel 26-38) is intern consistent: lineair-zoeken-score daalt met lijstgrootte (60→30→10), binair-zoeken-score is hoog en stabiel bij `gesorteerd=true` (90→85→80) en zakt naar 20 bij `gesorteerd=false` — matcht de didactische claim in de vragen dat binair zoeken alleen werkt op gesorteerde lijsten.
- **Agent-briefing vs. missie-inhoud**: `systemInstruction` in `year2.tsx:622-628` ("Computational Thinking Coach... helpt bij problemen opsplitsen... EERST denken, DAN coderen") sluit thematisch aan bij de drie simulaties (zoeken, sorteren, pseudocode/computational thinking) — geen inhoudelijke desync, wel dormant (zie didactiek-review, platform-breed bekend).

#### ⚠️ Aandachtspunten
*(geen)*

#### ❌ Blocking issues
*(geen)*

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen `.ui-review/`-screenshots voor deze missie, geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md`, en geen dev-server in scope van deze reviewronde. Dynamische claims blijven unverified; dit is een dekkingsgat voor een toekomstige live-verificatieronde, geen gevonden fout.

### Score
Static: 6/6 criteria geslaagd · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (met aantekening: dynamische multi-viewport-verificatie ontbreekt nog)

---

## Samenvatting

`algorithm-architect` is een intern consistente, goed-gefundeerde simulation-lab-missie. Geen design-, didactiek- of tech-issues gevonden die een fix vereisen. De simulatie-parameters, scoring-logica en toetsvragen zijn onderling exact consistent geverifieerd (met name Sim 1's stappen-berekening tegen de bijbehorende vraag). Het enige aandachtspunt (dormante chat-rol) is een reeds-bekend platform-breed beslispunt, geen missie-specifiek gebrek. Ontbrekende dynamische browserverificatie is een dekkingsgat, geen bewezen fout — geen blocking voor ship.

**Triage-score:** (10-0)\*0.3 + (10-0)\*0.4 + (10-0)\*0.3 = **10.0/10**
