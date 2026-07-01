# Missie-review: code-review-2 ("Code Terugblik")

**Datum:** 2026-07-01 · **Template:** review-arena · **Wave:** 7
**Config:** `src/features/missions/templates/review-arena/configs/code-review-2.ts`
**Engine:** `src/features/missions/templates/review-arena/ReviewArena.tsx`
**Agent-rol:** `src/config/agents/year2.tsx:1338`
**SLO:** `src/config/slo-kerndoelen-mapping.ts:120`
**Curriculum:** Leerjaar 2, Periode 2, reviewMissions (`src/config/curriculum.ts:192-194`)

## Visueel bewijs

Geen screenshots-map (`.ui-review/`) aanwezig voor deze wave. `code-review-2` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — geen eerder visueel bewijs beschikbaar. Design-oordeel hieronder is static-only.

---

## 🎨 Design review

**Mission:** code-review-2 (review-arena)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens)**: config bevat geen JSX/className (puur content-config); engine gebruikt correct `bg-duck-bg`, `text-duck-ink`, `bg-duck-acid`, `border-duck-gray` (`ReviewArena.tsx:259,272,291,369`) — engine-breed, niet missie-specifiek, niet herhaald als issue.
- **Criterium 2 (Layout consistentie)**: identieke structuur (missionId/title/introEmoji/badges/takeaways/rounds) als baseline `review-week-2.ts` — geen structurele afwijking.
- **Criterium 4 (Copy-lengte)**: `introDescription` = 49 woorden (leerjaar 2-grens: <80) — `code-review-2.ts:8-9`. Ronde-beschrijvingen zijn alle 1 zin (<20 woorden).
- **Criterium 7 (Toegankelijkheid)**: chat-toggle heeft `aria-label="Open AI-assistent"` (`ReviewArena.tsx:371`) — n.v.t. voor deze missie zelf, want chat staat uit (zie tech-sectie).

### ⚠️ Aandachtspunten
- **Criterium 1 (legacy token in dashboard-kaart)**: `visualPreview` in de agent-rol-entry gebruikt `lab-cream`/`lab-coral`/`lab-creamDeep` i.p.v. duck-tokens — `src/config/agents/year2.tsx:1351-1352`.
  - **Wat:** `bg-gradient-to-br from-lab-cream to-lab-cream` en `from-lab-coral to-lab-creamDeep` zijn legacy-aliassen, geen duck-tokens.
  - **Waarom:** lage impact — dit is de dashboard-tegel-preview, niet de missie-flow zelf, en het patroon komt zichtbaar herhaald voor in andere jaar2-tegels (niet uniek voor deze missie). Geen aparte fix-prioriteit hier; onderdeel van een bredere dashboard-kaart-migratie indien die ooit gepland wordt.
  - **Voorstel:** geen actie nu — buiten scope van deze missie-review.

### ❌ Blocking issues
Geen.

### Score
3/4 relevante criteria geslaagd (2, 3, 5, 6 n.v.t. — content-only config, engine-breed) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** code-review-2 (review-arena)
**Curriculum-plek:** Leerjaar 2, Periode 2 (reviewMissions, na algorithm-architect/web-developer/bug-hunter/automation-engineer/code-reviewer e.a.)
**SLO-claim:** 22A (Digitale producten), 22B (Programmeren) · VSO 19A
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: 22A en 22B zijn geldige regulier-codes; 19A is geldige VSO-code — `slo-kerndoelen-mapping.ts:120`.
- **Criterium 2 (SLO-fit)**: 22A sterk geraakt door `round-drag-sort` (weblagen HTML/CSS/JS/API/UX) en `round-categorize` (codefragmenten classificeren); 22B sterk geraakt door `round-match-pairs` (algoritme/debuggen/functie/loop) en `round-rapid-fire` (loops, variabelen, debugging, computational thinking) — `code-review-2.ts:61-195`.
- **Criterium 3 (Leerdoelen)**: `missionGoal.primaryGoal` = "Ik bewijs dat ik de programmeerconcepten uit periode 2 kan herkennen, koppelen en uitleggen." — meetbare actiewerkwoorden (herkennen/koppelen/uitleggen), Bloom onthouden→toepassen — `code-review-2.ts:10-18`.
- **Criterium 4 (Opdracht-beknoptheid)**: intro 49 woorden, ronde-opdrachten <20 woorden — ruim binnen leerjaar-2-grens.
- **Criterium 5 (Leeftijds-passend)**: concrete, herkenbare voorbeelden voor 13-14-jarigen — "klasgenoot klaagt over knop die niks doet" (`code-review-2.ts:111`), "schoolagenda-app werkt niet op telefoon" (`code-review-2.ts:141`). Geen onuitgelegd jargon.
- **Criterium 6 (Curriculum-plek)**: logische afsluiting van periode 2 na de losse programmeer-missies in dezelfde periode (`curriculum.ts:181-194`) — bouwt voort op eerder aangeboden stof.
- **Criterium 7 (Bloom-balans)**: mix van onthouden (rapid-fire true/false), begrijpen (match-pairs), en toepassen/analyseren via de followUp-scenario's die evalueren vragen ("welke laag moet worden aangepast?", `code-review-2.ts:110-121`, `140-151`). Niet uitsluitend recall.
- **Criterium 9 (Welzijn)**: VSO-mapping aanwezig; geen gevoelig onderwerp van toepassing.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — dormante agent-rol**: `code-review-2` heeft géén `enableChat`/`chatRoleId` in `src/config/templateRegistry.ts:40` en géén `enableChat`-veld in `code-review-2.ts` (config bevat het optionele veld uit `ReviewArenaConfig` niet). Tegelijk bevat `src/config/agents/year2.tsx:1357-1405` een volledig uitgewerkte `systemInstruction` voor deze missie: progressieve moeilijkheid (⭐/⭐⭐/⭐⭐⭐), 3 concrete uitdagingen, een hint-systeem na 2 foute pogingen, en een afrondingszin.
  - **Wat:** de `StudentAIChat`-overlay rendert alleen als `config.enableChat` waar is (`ReviewArena.tsx:345`); dat is hier niet het geval, dus deze systemInstruction wordt nooit aangeroepen. Geverifieerd: geen los AiLab-pad dat `code-review-2` als zelfstandig te kiezen rol toont (geen treffers in `src/features/ai-lab/`, geen los `AGENT_ROLES`-overzicht dat missie-onafhankelijk rollen aanbiedt) — de rol is dus daadwerkelijk onbereikbaar, niet via een ander kanaal alsnog live.
  - **Waarom:** geen blocking issue — de missie functioneert zelfstandig zonder chat, de 4 rondes zijn op zichzelf compleet en toetsbaar. Wél een gemiste didactische kans: de agent-auteur heeft een rijke, missie-specifieke quizervaring geschreven (met scaffolding en hints) die de leerling nooit ziet. Dit is hetzelfde patroon als de bekende "dormant-chat-valkuil" bij template-missies zonder `enableChat`.
  - **Voorstel:** dit is een productbeslissing, geen mechanische fix — twee opties, beide legitiem:
    1. **Chat activeren**: `enableChat: true, chatRoleId: 'code-review-2'` toevoegen aan zowel `code-review-2.ts` als de registry-entry in `templateRegistry.ts:40`. Dit is consistent met hoe andere templates (bv. builder-canvas) chat aanbieden, maar activeert een nieuwe AI-kostenpost + moderatie-oppervlak voor een reviewweek-missie.
    2. **SystemInstruction laten vervallen** (bewuste keuze: reviewweken zijn zelfstandige quizzen zonder chat) — dan is de uitgebreide instructie in `year2.tsx` dode content die verwarrend is voor toekomstige onderhouders.
  - Geen van de andere 6 review-arena-missies (`review-week-2`, `data-review`, `media-review`, `security-review`, `advanced-code-review`, `impact-review`) heeft `enableChat` in de registry — dit is dus een **consistent template-breed patroon**, geen unieke fout van deze missie. De asymmetrie zit alleen in het feit dat juist déze missie een disproportioneel uitgewerkte systemInstruction heeft gekregen terwijl het kanaal ernaartoe overal in dit template dicht staat.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **22A (Digitale producten)**: sterk geraakt — drag-sort + categorize-ronde.
- **22B (Programmeren)**: sterk geraakt — match-pairs + rapid-fire-ronde.

### Score
8/9 criteria geslaagd (criterium 8 = aandachtspunt, geen fail) · Bloom-balans: medium · Aanbeveling: **ship** (met optionele product-beslissing over de dormante chat-rol)

---

## 🔧 Tech review

**Mission:** code-review-2 (review-arena)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart voor deze wave, geen visueel bewijs beschikbaar (zie boven)

### Static analyse

#### ✅ Geslaagd
- **A3 (TypeScript-discipline)**: config volledig getypeerd via `ReviewArenaConfig`, geen `any`, geen `@ts-ignore` — `code-review-2.ts:3`.
- **A4 (Imports)**: enige import is het sibling-type `ReviewArenaConfig` via `'../ReviewArena'` — standaardpatroon binnen dezelfde template-map, identiek aan baseline `review-week-2.ts:1`, geen violatie van de `@/*`-regel (die geldt voor cross-domain imports).
- **A7 (Security)**: config bevat geen user-input-verwerking, geen `dangerouslySetInnerHTML` — pure statische content.

#### ⚠️ Aandachtspunten
- **Config/agent-rol drift**: zie didactiek-sectie criterium 8 — dezelfde bevinding vanuit tech-hoek: `year2.tsx:1357-1405` is effectief ongebruikte code (een systemInstruction die geen enkel runtime-pad ooit bereikt zolang `enableChat` niet gezet wordt). Geen bug, geen risico voor de leerling, wel technische drift tussen agent-config en missie-config die bij een toekomstige audit verwarring kan geven.
  - **Risico:** laag — geen crash, geen leerling-impact. Risico is puur onderhoudbaarheid (toekomstige developer denkt dat chat actief is).
  - **Voorstel:** zie didactiek-sectie — productbeslissing, geen auto-fix.

### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze wave-run. Geen console-, network- of visuele bewijslast te rapporteren.

### Score
Static: 3/3 relevante criteria geslaagd (A1/A2/A5/A6 n.v.t. — content-only config, engine-breed) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting

| Axis | Score | Verdict |
|---|---|---|
| Design | 9/10 | ship |
| Didactiek | 8/10 | ship |
| Tech | 9/10 | ship |

**Enige noemenswaardige bevinding:** een uitgewerkte, missie-specifieke chat-systemInstruction in `year2.tsx` die door het ontbreken van `enableChat` nooit bereikt wordt. Consistent met de rest van het review-arena-template (geen van de 7 missies heeft chat aan) — dus geen missie-specifieke fout, wel een asymmetrie tussen investering (uitgebreide instructie) en bereikbaarheid (0%). Geen blocking issue; escaleren als productvraag, niet als auto-fix.

**Eindverdict: ok** (triageScore 1.4 — geen fix-eerst of herontwerp nodig).
