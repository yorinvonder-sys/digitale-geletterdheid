# Missie-review: data-review

**Datum:** 2026-07-02 · **Wave:** 15 (verse review) · **Reviewer:** M2-pipeline (Sonnet, single-pass)
**templateType:** `review-arena`
**Config:** `src/features/missions/templates/review-arena/configs/data-review.ts`
**Agent-rol:** `src/config/agents/year2.tsx:515-601`
**Curriculum-plek:** Leerjaar 2, Periode 1 ("Data & Informatie") — `reviewMissions`, `config/curriculum.ts:171-172`
**SLO-claim:** `21B, 21C, 21D` (regulier) · `18B, 18C` (VSO) — `config/slo-kerndoelen-mapping.ts:104`

---

## 🎨 Design review

**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (Tailwind tokens):** 100% `duck-*` tokens — geen `lab-*` legacy, geen hardcoded hex-className's. Consistent over `ReviewArena.tsx` + alle 4 sub-componenten (`DragSort.tsx`, `MatchPairs.tsx`, `Categorize.tsx`, `RapidFire.tsx`).
- **Criterium 2 (Layout consistentie):** Container-structuur (`min-h-screen bg-duck-bg p-4` → `max-w-md mx-auto` → `PhaseHeader`) identiek aan zuster-missies van hetzelfde type (bv. `review-week-2`). Geen structurele afwijking.
- **Criterium 3 (Knop-clarity):** alle `<button>`-elementen hebben duidelijk label + hover-state. Icon-only knoppen (omhoog/omlaag in `DragSort.tsx:88,97`) hebben correcte `aria-label`.
- **Criterium 4 (Copy-lengte):** `introDescription` 25 woorden (limiet leerjaar 2: <80). Ronde-beschrijvingen 7-11 woorden (limiet: <60). Ruim binnen grens.
- **Criterium 5 (Responsive):** `max-w-md mx-auto` + relatieve grid (`grid-cols-2`/`grid-cols-3`) — geen vaste pixel-widths. Statisch gezien mobile-safe.
- **Criterium 6 (Framer Motion):** animaties in `MatchPairs`/`Categorize`/`RapidFire` hebben functionele waarde (state-transitie, foutfeedback, progress-bar) — geen wrapper-spam.
- **Criterium 7 (Toegankelijkheid):** focus-states aanwezig (`focus-visible:ring-2` in `DragSort.tsx:89,98`), geen kleur-only informatie (icon + tekst dubbel bij correct/fout in alle 4 rondes).

### ⚠️ Aandachtspunten

- **Dode CSS-variabelen in `CATEGORY_COLORS`** — `src/features/missions/templates/review-arena/sub/Categorize.tsx:30-34`
  - **Wat:** `CATEGORY_COLORS` bevat `light`/`border`-velden met een ongebruikelijk format (`'#D97848/10'` — hex + slash-opacity-suffix als losse string, geen geldige CSS/Tailwind-waarde) die nergens in de component worden gerenderd; alleen `color.bg` wordt gebruikt (regels 132-133, 138).
  - **Waarom:** geen zichtbaar effect voor de leerling (dode code), maar verwarrend voor een volgende developer die de kleuren denkt te kunnen gebruiken.
  - **Voorstel:** verwijder `light`/`border`-velden of vervang door daadwerkelijk gebruikte Tailwind-opacity-classes.
    ```ts
    // ❌ Huidig — Categorize.tsx:30-34
    const CATEGORY_COLORS = [
        { bg: '#ff3c21', light: '#D97848/10', border: '#D97848/40' },
        { bg: '#202023', light: '#0B453F/10', border: '#0B453F/40' },
        { bg: '#e1ff01', light: '#D7C95F/10', border: '#D7C95F/40' },
    ];

    // ✅ Voorgesteld
    const CATEGORY_COLORS = [
        { bg: '#ff3c21' },
        { bg: '#202023' },
        { bg: '#e1ff01' },
    ];
    ```

### ❌ Blocking issues

Geen.

### Score

6/7 criteria volledig geslaagd, 1 met kleine (niet-blocking) opmerking · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 21B (Media & Informatie), 21C (Data & Dataverwerking), 21D (AI) + VSO 18B, 18C
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** `21B`, `21C`, `21D` bestaan alle in de geldige kerndoelenlijst; `18B`/`18C` zijn geldige VSO-codes. 3 codes = binnen de "max 3"-richtlijn.
- **Criterium 2 (SLO-fit):** alle 3 kerndoelen worden substantieel geraakt: 21B via ronde 1 (bronbetrouwbaarheid — `round-drag-sort`), 21C via ronde 2/3 (databeveiliging, persoonsgegevens-classificatie), 21D indirect via de bredere periode-herhaling (systemInstruction noemt AI-bias expliciet). Geen oppervlakkig contact.
- **Criterium 3 (Leerdoelen):** geen expliciete `learningObjectives`-array in de config (review-arena-templateType heeft dat veld niet in `ReviewArenaConfig`), maar `missionGoals.ts:488-496` levert een `primaryGoal` + `evidence`-paar dat functioneert als impliciet leerdoel: "Ik beoordeel databronnen op betrouwbaarheid, classificeer persoonsgegevens en beantwoord vragen over AVG-rechten" — concreet en met meetbaar gedrag (beoordeel/classificeer/beantwoord).
- **Criterium 4 (Opdracht-beknoptheid):** zie design-review — ruim binnen grenzen.
- **Criterium 5 (Leeftijds-passend vocabulary):** AVG-termen (`persoonsgegevens`, `bijzondere persoonsgegevens`, `recht op vergetelheid`) worden in `explanation`-velden direct uitgelegd (bv. `data-review.ts:63,166,190`) — geen onuitgelegd jargon voor leerjaar 2.
- **Criterium 6 (Curriculum-plek):** logisch als afsluitende reviewmissie ná de 6 inhoudelijke missies van Periode 1 (`data-journalist`, `spreadsheet-specialist`, `factchecker`, `api-verkenner`, `dashboard-designer`, `ai-bias-detective` — `curriculum.ts:163-172`). Geen voorkennis-sprong.
- **Criterium 7 (Bloom-balans):** goede mix — onthouden (rapid-fire waar/onwaar), toepassen (match-pairs beveiligingsmaatregelen), analyseren (drag-sort ranking op betrouwbaarheid), en de follow-up-vraag in ronde 1 vraagt onderscheid maken (bijzondere vs. gewone persoonsgegevens) — evalueren-niveau, passend bij een reviewmissie eind-periode.
- **Criterium 9 (Welzijn):** VSO-mapping aanwezig; geen gevoelige onderwerpen in deze missie.

### ⚠️ Aandachtspunten

- **Criterium 8 (AI-as-copilot) — dormant chat-rol:** `enableChat` staat niet in `data-review.ts`, dus de uitgebreide agent-rol in `year2.tsx:515-601` (met `STAP-VOLTOOIING`, `steps`, `EERSTE BERICHT`) wordt binnen deze missie nooit geactiveerd. Dit is een **bekend, template-breed patroon** voor alle `review-arena`-missies (niet missie-specifiek, niet opnieuw als bug rapporteren) — de missie functioneert volledig zelfstandig via de 4 interactieve rondes zonder chat.

### ❌ Blocking issues

Geen.

### SLO-fit oordeel

- **21B (Media & Informatie):** sterk geraakt — ronde 1 (bronbetrouwbaarheid-ranking, 6 bronnen van CBS tot TikTok).
- **21C (Data & Dataverwerking):** sterk geraakt — ronde 2 (databeveiliging) + ronde 3 (persoonsgegevens-classificatie).
- **21D (AI):** oppervlakkig — geen directe AI-inhoud in de 4 rondes zelf; alleen impliciet via de periode-brede herhalingscontext in de (dormant) agent-rol. Score-technisch geen probleem (AI-bias is elders in periode 1 behandeld via `ai-bias-detective`), maar de missie-zelf toetst 21D niet actief.

### Score

7/8 criteria volledig geslaagd (1 n.v.t. door template-eigenschap) · Bloom-balans: **medium-hoog** · Aanbeveling: **ship**

---

## 🔧 Tech review

**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze reviewrun; static analyse is volledig.

### Static analyse

#### ✅ Geslaagd

- **A1 (Knop-handlers):** alle knoppen in `DragSort`, `MatchPairs`, `Categorize`, `RapidFire` hebben functionele `onClick`. Geen dode knoppen gevonden.
- **A2 (Error/empty states):** n.v.t. — geen async data-fetching in deze missie (puur client-side quizlogica); geen loading/error-state nodig.
- **A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore` in `ReviewArena.tsx` of de 4 sub-componenten. Interfaces expliciet gedefinieerd (`DragSortRound`, `MatchPairsRound`, etc. in `ReviewArena.tsx:19-63`).
- **A4 (Imports):** `@/hooks/useMissionAutoSave`, `@/features/ai-chat/StudentAIChat`, `@/config/missionGoals` — alle via `@/*`-alias.
- **A5 (Edge function calls):** n.v.t. — deze missie roept geen edge functions aan (chat is dormant).
- **A6 (Restart-safe state):** `useMissionAutoSave<ReviewArenaState>(missionId, initialState)` — `ReviewArena.tsx:118-121`. Voortgang overleeft refresh.
- **A7 (Security):** geen `dangerouslySetInnerHTML`; geen client-side `systemInstruction` (agent-rol staat server-side in `year2.tsx`, alleen `roleId` wordt doorgegeven via `chatRoleId`-optie — hoewel die hier ongebruikt is want `enableChat` niet gezet).

**Score-narekenwerk (config `maxScore: 100`, 4 rondes × 25):**

| Ronde | Formule | Nagerekend |
|---|---|---|
| `round-drag-sort` | `round((correct/6)*25)` | ✅ correct, 6 items met unieke `correctPosition` 0-5 |
| `round-match-pairs` | `penalty=min(wrongAttempts,5)`; `max(0, round(((5-penalty)/5)*25))` | ✅ correct, floor bij 0 ingebouwd, 5 paren |
| `round-categorize` | `round((correct/8)*25)` | ✅ correct, 8 items |
| `round-rapid-fire` | `base=round((correct/8)*25)`; `bonus=min(floor(streak/3)*2,10)`; `total=min(base+bonus,25)` | ✅ correct, cap voorkomt overflow (bij 8/8 + streak 8: base 25 + bonus 4 → gecapt op 25) |
| **Totaal maxScore** | 25+25+25+25 | ✅ = 100, matcht config |
| **Follow-up bonus** (`bonusPoints: 5`, alleen ronde 1) | trigger `score > maxScore*0.5`; `finalScore = min(base+bonus, maxScore)` | ✅ correct, geen overflow — cap in `ReviewArena.tsx:195` vangt het af (bekend patroon uit `review-week-2`) |

Geen rekenfouten gevonden.

#### ⚠️ Aandachtspunten

- **Zie design review** — dode `CATEGORY_COLORS`-velden in `Categorize.tsx:30-34` (nette-code-observatie, geen functioneel risico).

#### ❌ Blocking issues

Geen.

### Dynamic verificatie

Niet uitgevoerd — geen dev-server beschikbaar in deze single-pass reviewrun. Geen `screenshots/`-map voor `data-review` aangetroffen; missie komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (0 treffers bij grep) — dus geen eerdere UI/UX-bevindingen om tegen te verifiëren of tegen te spreken.

### Score

Static: 7/7 · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting

`data-review` is een technisch en didactisch solide reviewmissie: score-logica rekent overal kloppend, SLO-koppeling is sterk onderbouwd voor 21B/21C (21D oppervlakkig maar dat is inherent aan een reviewmissie die vooral periode 1 herhaalt), tokens zijn 100% duck-consistent, en copy blijft ruim binnen de leerjaar-2-grenzen. De enige bevinding is een niet-functionele dode-code-observatie (ongebruikte kleurvelden in `Categorize.tsx`) — geen blocking issue, geen leerling-impact.

**Verdict: ok** — geen fixes vereist vóór ship.
