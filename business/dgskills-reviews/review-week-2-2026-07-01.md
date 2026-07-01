# Missie-review: review-week-2 ("De Code-Criticus")

**Datum:** 2026-07-01 · **Template:** review-arena · **Wave:** 10
**Config:** `src/features/missions/templates/review-arena/configs/review-week-2.ts`
**Engine:** `src/features/missions/templates/review-arena/ReviewArena.tsx`
**Agent-rol:** `src/config/agents/year1.tsx:1623-1705`
**SLO:** `src/config/slo-kerndoelen-mapping.ts:59`
**Curriculum:** Leerjaar 1, Periode 2, reviewMissions (`src/config/curriculum.ts:94-99`)
**missionGoals:** `src/config/missionGoals.ts:176-183`

## Visueel bewijs

Geen screenshots-map (`.ui-review/`) aanwezig voor deze wave. `review-week-2` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — geen eerder visueel bewijs beschikbaar. Design-oordeel hieronder is static-only.

---

## 🎨 Design review

**Mission:** review-week-2 (review-arena)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: config bevat geen JSX/className (puur content-config); de vier sub-engines (`DragSort.tsx`, `MatchPairs.tsx`, `Categorize.tsx`, `RapidFire.tsx`) en `ReviewArena.tsx` gebruiken uitsluitend `duck-*` tokens (`bg-duck-bg`, `text-duck-ink`, `bg-duck-acid`, `border-duck-gray`, `bg-duck-error` in `RapidFire.tsx:139`) — engine-breed, niet missie-specifiek, niet herhaald als issue. Geen `lab-*` legacy-tokens en geen per-missie `role.color`-gebruik gevonden in de template-map.
- **Criterium 2 (Layout consistentie)**: identieke structuur (missionId/title/introEmoji/badges/takeaways/rounds) als sibling-configs (`code-review-2.ts` e.a.) — geen structurele afwijking.
- **Criterium 4 (Copy-lengte)**: `introDescription` = 39 woorden (leerjaar 1-grens: <60) — `review-week-2.ts:8-9`. Ronde-beschrijvingen zijn alle ≤2 zinnen.
- **Criterium 7 (Toegankelijkheid)**: chat-toggle heeft `aria-label="Open AI-assistent"` (`ReviewArena.tsx:371`) — n.v.t. voor deze missie zelf, want chat staat uit (zie tech-sectie). `DragSort.tsx:88,97` heeft correcte `aria-label` op de pijltjes-knoppen voor sleutelbord-toegankelijkheid.

### Start-CTA vergelijking met review-week-1 (#190-fix)
Geverifieerd tegen commit `7183d37` (#190, review-week-1 + verhalen-ontwerper Start-CTA on-brand fix). Die fix zat in `AssessmentEngine.tsx` en `BookPreview.tsx` — losstaande componenten voor een ander missietype (geen review-arena-missie; `review-week-1` bestaat niet als reviewMission-entry). `review-week-2` gebruikt de gedeelde `IntroScreen` (`ReviewArena.tsx:221-230`), die zijn Start-knop al hardcoded op `bg-duck-acid`/`text-duck-ink` heeft staan (`IntroScreen.tsx:176-180`, sinds de PR #186-unificatie) — géén `role.color`-afhankelijkheid. **Geen afwijking, geen fix nodig**: de CTA is al on-brand.

### ⚠️ Aandachtspunten
Geen missie-specifieke aandachtspunten.

### ❌ Blocking issues
Geen.

### Score
4/4 relevante criteria geslaagd (2, 3, 5, 6 n.v.t. — content-only config, engine-breed) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** review-week-2 (review-arena)
**Curriculum-plek:** Leerjaar 1, Periode 2 (reviewMissions, na cloud-cleaner/layout-doctor/pitch-police)
**SLO-claim:** 21D, 22B · VSO 18C
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: 21D en 22B zijn geldige regulier-codes; 18C is geldige VSO-code — `slo-kerndoelen-mapping.ts:59`. Inline comment noteert bewust "21B→22B: review bevat code-bugs herkennen" (uitlegbare mapping-keuze, geen onbegründete claim).
- **Criterium 2 (SLO-fit)**: 22B (programmeren/debuggen) sterk geraakt door `round-match-pairs` (bug→oplossing) en de `round-rapid-fire`-vragen over if-statements/loops/variabelen/debuggen (`review-week-2.ts:73-93,152-179`); 21D (kritisch AI-gebruik) sterk geraakt door `round-categorize` (AI-fout vs. programmeer-bug) en de hallucinatie-followUp (`review-week-2.ts:100-124`).
- **Criterium 3 (Leerdoelen)**: `missionGoals.ts:177` — "Ik beoordeel AI- en codevoorbeelden kritisch en herken wat beter moet." Meetbaar actiewerkwoord (beoordelen/herkennen), Bloom analyseren.
- **Criterium 4 (Opdracht-beknoptheid)**: intro 39 woorden, ronde-opdrachten kort en concreet — ruim binnen leerjaar-1-grens.
- **Criterium 5 (Leeftijds-passend)**: herkenbare, concrete voorbeelden voor 12-13-jarigen (vijand die van het scherm loopt, teller die verkeerd optelt, AI die halverwege stopt) — geen onuitgelegd jargon; technische termen (hallucinatie, if-statement, event listener, model, dataset) worden inline uitgelegd (`review-week-2.ts:100`, agent-rol `year1.tsx:1618`).
- **Criterium 6 (Curriculum-plek)**: logische afsluiting van periode 2 na de losse missies uit dezelfde periode (`curriculum.ts:80-99`) — bouwt voort op eerder aangeboden stof (game-programmeur, ai-trainer, code-denker).
- **Criterium 7 (Bloom-balans)**: mix van onthouden (rapid-fire true/false), begrijpen (match-pairs), toepassen (drag-sort volgorde) en analyseren (categorize AI-fout vs. bug, met followUp-scenario's die evalueren vragen — `review-week-2.ts:103-113,133-143`). Niet uitsluitend recall.
- **Criterium 9 (Welzijn)**: VSO-mapping aanwezig; geen gevoelig onderwerp van toepassing.
- **Inhoudelijke juistheid (extra check, gezien AI-claims in content)**: alle 5 match-pairs-koppels zijn correct; alle 8 categorize-items zijn correct geclassificeerd (incl. "AI geeft antwoord in verkeerde taal" → terecht AI-fout, niet bug); beide followUp-vragen hebben de juiste correctIndex met een onderbouwde explanation die de afgewezen opties inhoudelijk weerlegt; alle 8 rapid-fire-stellingen zijn feitelijk correct (geen overclaims over AI-mogelijkheden, bv. vraag 5 "AI begrijpt context altijd volledig" → terecht `false`). Geen didactische onjuistheden gevonden.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — dormante agent-rol, hier met extra content-mismatch**: `review-week-2` heeft géén `enableChat`/`chatRoleId` in de config (`ReviewArenaConfig`-veld ontbreekt) en géén registry-override. Tegelijk bevat `src/config/agents/year1.tsx:1649-1704` een volledig uitgewerkte `systemInstruction` ("DE CODE-CRITICUS") die spreekt over "2 CASES" met specifieke content (Case 1: onafgemaakt drakenverhaal / Case 2: vijand die van het scherm loopt via `enemy.x = enemy.x + 5`) — dat is **andere content** dan de 4 daadwerkelijke rounds (drag-sort/match-pairs/categorize/rapid-fire) die de leerling ziet. De agent-rol `steps`-array (`year1.tsx:1636-1647`, 2 stappen: "Introductie"/"Cases Oplossen") wordt sowieso nooit gerenderd voor template-missies (die tonen `config.rounds`, niet `agents.tsx`-`steps`).
  - **Wat:** `StudentAIChat` rendert alleen als `config.enableChat` waar is (`ReviewArena.tsx:345`); niet het geval hier, dus zowel de systemInstruction als de steps-array zijn onbereikbaar via elk runtime-pad.
  - **Waarom:** geen blocking issue — de missie functioneert zelfstandig zonder chat, de 4 rondes zijn op zichzelf compleet en toetsbaar. Dit is **hetzelfde platform-brede patroon** dat al bekend is bij alle 7 review-arena-missies (bevestigd: geen van de 7 heeft `enableChat`) — dus geen unieke fout van deze missie, kort genoemd conform bekend-patroon, geen escalatie.
  - **Voorstel:** productbeslissing, geen mechanische fix — zelfde twee opties als bij eerdere review-arena-missies (chat activeren mét kostenimplicatie, of systemInstruction laten vervallen als bewuste dode content). Geen auto-fix.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **21D (Kritisch AI-gebruik/mediawijsheid)**: sterk geraakt — categorize-ronde + hallucinatie-followUp.
- **22B (Programmeren/debuggen)**: sterk geraakt — match-pairs + rapid-fire-ronde.

### Score
8/9 criteria geslaagd (criterium 8 = aandachtspunt, geen fail) · Bloom-balans: medium-hoog · Aanbeveling: **ship** (met bekende, niet-nieuwe productvraag over de dormante chat-rol)

---

## 🔧 Tech review

**Mission:** review-week-2 (review-arena)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart voor deze wave, geen visueel bewijs beschikbaar (zie boven)

### Static analyse

#### ✅ Geslaagd
- **A3 (TypeScript-discipline)**: config volledig getypeerd via `ReviewArenaConfig`, geen `any`, geen `@ts-ignore` — `review-week-2.ts:3`.
- **A4 (Imports)**: enige import is het sibling-type `ReviewArenaConfig` via `'../ReviewArena'` — standaardpatroon binnen dezelfde template-map, geen violatie van de `@/*`-regel.
- **A7 (Security)**: config bevat geen user-input-verwerking, geen `dangerouslySetInnerHTML` — pure statische content.
- **Rekenlogica narekenen (verplicht voor review-arena)**:
  - `maxScore: 100` = som van 4 ronde-`maxScore`'s (25+25+25+25) — klopt (`review-week-2.ts:10,57,72,101,131`).
  - Score-formule per sub-engine is generiek en engine-breed correct: `Math.round((correct/total) * maxScore)`, gecapt op ronde-`maxScore` (`DragSort.tsx:121`, `Categorize.tsx:81`, `MatchPairs.tsx:71`, `RapidFire.tsx:82-84`).
  - FollowUp-bonuslogica (`ReviewArena.tsx:176-210`): bonus wordt alleen aangeboden bij `score > maxScore*0.5`, en `finalScore = Math.min(base+bonus, maxScore)` — de `bonusPoints: 5` in `round-categorize`/`round-rapid-fire` (`review-week-2.ts:112,142`) kan het rondetotaal dus nooit boven de eigen `maxScore: 25` duwen. Consistent, geen bug.
  - Totaalscore kan dus nooit boven `maxScore: 100` uitkomen — narekent kloppend.

#### ⚠️ Aandachtspunten
- **Config/agent-rol content-mismatch**: zie didactiek-sectie criterium 8 — vanuit tech-hoek: `year1.tsx:1649-1704` is effectief ongebruikte code (240+ regels systemInstruction die geen enkel runtime-pad ooit bereikt zolang `enableChat` niet gezet wordt), en de content ervan (2 cases) beschrijft een andere missie-flow dan de daadwerkelijke 4-rounds-config. Geen bug, geen leerling-risico. Risico is puur onderhoudbaarheid.
  - **Voorstel:** zie didactiek-sectie — productbeslissing, geen auto-fix.

### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze wave-run. Geen console-, network- of visuele bewijslast te rapporteren.

### Score
Static: 4/4 relevante criteria geslaagd (incl. rekenlogica-narekening) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting

| Axis | Score (0-10) | Verdict |
|---|---|---|
| Design | 9 | ship |
| Didactiek | 8 | ship |
| Tech | 9 | ship |

**triageScore** = (10-9)\*0.3 + (10-8)\*0.4 + (10-9)\*0.3 = 0.3 + 0.8 + 0.3 = **1.4**

**Enige noemenswaardige bevinding:** de agent-rol `systemInstruction` in `year1.tsx:1649-1704` beschrijft een "2-cases"-flow die inhoudelijk afwijkt van de 4 daadwerkelijke rounds, en is — net als bij alle 7 review-arena-missies — onbereikbaar zolang `enableChat` niet gezet is. Platform-breed bekend patroon, geen unieke fout van deze missie, geen escalatie. Start-CTA is al on-brand (`duck-acid` via shared `IntroScreen`) — geen actie nodig t.o.v. de #190-fix (die een ander missietype betrof). Rekenlogica van alle 4 ronde-typen + followUp-bonussen narekent kloppend tot maxScore 100.

**Eindverdict: ok** (triageScore 1.4 — geen fix-eerst of herontwerp nodig).
