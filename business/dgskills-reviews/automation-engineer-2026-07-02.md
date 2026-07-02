# Missie-review: Automation Engineer

**Mission ID:** automation-engineer
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 2, Periode 2 (Programmeren & Computational Thinking)
**Datum:** 2026-07-02
**Reviewer-pipeline:** M4 batch-review (wave 17)

---

## 🎨 Design review

**Mission:** automation-engineer (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind token consistentie)**: geen Tailwind-classNames, geen hex-literals in de config — deze bevat uitsluitend content/copy (titel, beschrijvingen, checklist-items); alle styling zit in de gedeelde `BuilderCanvas.tsx`-engine (buiten scope) — `src/features/missions/templates/builder-canvas/configs/automation-engineer.ts` (hele bestand)
- **Criterium 2 (Layout consistentie)**: identieke structuur als baseline `web-developer.ts`/`prototype-developer.ts` van hetzelfde templateType — `missionGoal`, `introFeatures`, 4 `steps` met `checklistItems` + `textPrompt`, `badges`, `takeaways` — geen structurele afwijking
- **Criterium 3 (Knop-clarity)**: geen knoppen in de config zelf; engine-knoppen (`BuilderCanvas.tsx`) zijn gedeeld en elders al gereviewd — n.v.t. voor deze missie-specifieke review
- **Criterium 4 (Copy-lengte)**: `introDescription` 29 woorden (grens leerjaar 2: <80) — ruim binnen grens; checklist-labels zijn kort (4-9 woorden per item) — `automation-engineer.ts:8-9`
- **Criterium 5 (Responsive design)**: geen missie-specifieke responsive-code (engine-gedeeld)
- **Criterium 6 (Framer Motion)**: geen motion-gebruik in config (engine-gedeeld)
- **Criterium 7 (Toegankelijkheid)**: geen missie-specifieke a11y-afwijkingen; badges gebruiken emoji + tekst-titel (geen kleur-only informatie) — `automation-engineer.ts:95-101`

### ⚠️ Aandachtspunten
- **Criterium 4 (Instruction-veld lengte, licht)**: `steps[0].instruction` (taak-analyse) telt 63 woorden — `automation-engineer.ts:35`
  - **Wat:** het `instruction`-veld van stap 1 bevat een 4-punts opsomming en overschrijdt daarmee licht de 60-woorden-richtlijn voor "ronde-opdracht" bij leerjaar 2.
  - **Waarom:** voor leerjaar 2 (12-13 jaar) is een compacte opdrachtformulering belangrijk om cognitieve overload te voorkomen; een lange opsomming in doorlopende tekst is lastiger te scannen dan losse regels.
  - **Voorstel:** geen actie nodig — het `instruction`-veld is een uitgebreide taakomschrijving (met genummerde deelvragen), geen korte ronde-vraag zoals bij scenario-engine-missies; de opsomming zelf (1/2/3/4) breekt de tekst al visueel op in de UI. Vergelijkbare instruction-velden in baseline `web-developer.ts` zijn even lang. Niet-blocking, context-afhankelijk.

### ❌ Blocking issues
_Geen._

### Visual Precision Gate
`WARN` — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run; geen dynamische viewport-evidence. Geen bekende structurele UI-afwijking op basis van static analyse en de gedeelde `BuilderCanvas`-engine (elders al geverifieerd, engine-issues buiten scope van deze missie-review).

### Score
7/7 criteria geslaagd (1 niet-blocking aandachtspunt) · Aanbeveling: **ship**

---

## 📚 Didactiek review

**Mission:** automation-engineer (builder-canvas)
**Curriculum-plek:** Leerjaar 2, Periode 2
**SLO-claim:** 22B (Programmeren), 21A (Digitale systemen)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `22B` en `21A` zijn beide geldige regulier-VO-codes, 2 codes (binnen "max 3"-richtlijn); VSO-mapping `19A`/`18A` aanwezig — `src/config/slo-kerndoelen-mapping.ts:114`
- **Criterium 2 (SLO-fit)**: `22B` (Programmeren) sterk geraakt — stap 2 (algoritme/pseudocode met IF/THEN + FOR-lus) en stap 3 (Python-scriptstructuur met functies) zijn expliciete programmeeractiviteiten, geen oppervlakkig contact; `21A` (Digitale systemen) geraakt via stap 1 (taakanalyse van een repetitief systeemproces) en stap 4 (testplan/dry-run als systeemveiligheidsdenken) — `automation-engineer.ts:46-76` (stap 2-3), `:29-44`,`:77-92` (stap 1/4)
- **Criterium 3 (Leerdoelen helder)**: `missionGoal.primaryGoal` ("Ik ontwerp een veilige automatisering door...") bevat impliciet actiewerkwoorden; `missionGoals.ts:607-613` bevat expliciete `primaryGoal` + meetbare `criteria` (steps-complete, min 4) — voldoet aan action-verb + concreet-eis — `automation-engineer.ts:11`, `src/config/missionGoals.ts:607-613`
- **Criterium 4 (Opdracht-beknoptheid)**: intro 29 woorden, checklist-items kort, 4 stappen (binnen "max 3-4 rondes"-richtlijn leerjaar 2) — `automation-engineer.ts:19-24` (introFeatures), `:28-93` (steps)
- **Criterium 5 (Leeftijds-passend vocabulary)**: taal past bij 12-13 jaar; technische termen worden direct uitgelegd binnen dezelfde zin — "Python-modules (= een gereedschapsset die Python al klaar heeft staan, bijv. `os` voor bestanden)" (`:67`), "pseudocode: code die leesbaar is voor mensen, niet voor computers" (`:49`) — geen onverklaard jargon
- **Criterium 6 (Curriculum-plek logisch)**: staat in periode 2 na `app-prototyper` en vóór `bug-hunter`, in dezelfde reeks als `algorithm-architect`/`web-developer` (programmeer-cluster) — logische opbouw: eerst algoritmisch denken (`algorithm-architect`), dan toepassen op automatisering — `src/config/curriculum.ts:176-187`
- **Criterium 7 (Bloom-taxonomie balans)**: goede mix — analyseren (stap 1: taak beoordelen op automatiseerbaarheid + tijdsbesparing berekenen), creëren (stap 2: pseudocode-algoritme ontwerpen; stap 3: scriptstructuur ontwerpen), evalueren (stap 4: testplan + risico-denken) — geen platte quiz-recall, passend hoog voor leerjaar 2 met voldoende scaffolding (tips per stap, voorbeeld-snippet)
- **Criterium 8 (AI-as-copilot)**: `enableChat: true` + `chatRoleId: 'automation-engineer'`; server-side `systemInstruction` (`src/config/agents/year2.tsx:952-995`) volgt WERKWIJZE-scaffolding (identificeer → splits op → schrijf script → test → schaal op) en een expliciete SCOPE GUARD die complexe frameworks afwijst en terugstuurt naar de basis — AI stelt vragen/coacht, geeft geen kant-en-klaar antwoord — `year2.tsx:966-971`, `:987-989`
- **Criterium 9 (Welzijn & inclusiviteit)**: geen gevoelige onderwerpen; VSO-mapping aanwezig (`19A`/`18A`); geen gender-specifieke aannames; scenario (conciërge die 200 mails handmatig verstuurt) is herkenbaar en neutraal — `year2.tsx:940`

### ⚠️ Aandachtspunten
_Geen — alle criteria geslaagd._

### ❌ Blocking issues
_Geen._

### SLO-fit oordeel
- **22B (Programmeren)**: sterk geraakt — bewijs: pseudocode-stap met verplichte IF/THEN + FOR-lus (min. 8 stappen) en Python-scriptstructuur-stap met min. 2 functiedefinities + main-sectie
- **21A (Digitale systemen)**: sterk geraakt — bewijs: taakanalyse van een repetitief systeemproces + testplan/dry-run-denken als systeemveiligheidsprincipe

### Score
9/9 criteria geslaagd · Bloom-balans: **medium-hoog** (analyseren/creëren/evalueren, passend met scaffolding voor leerjaar 2) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** automation-engineer (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run

### Static analyse

#### ✅ Geslaagd
- **Criterium A1 (Knop-handlers)**: geen missie-specifieke knoppen in de config; engine-gedeeld (`BuilderCanvas.tsx`) — buiten scope voor missie-review
- **Criterium A2 (Error states)**: geen missie-specifieke async-calls in de config; engine-gedeeld error-handling — buiten scope
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`/`@ts-expect-error` in `automation-engineer.ts`; config is volledig getypeerd via `BuilderCanvasConfig` — `automation-engineer.ts:3`
- **Criterium A4 (Imports via alias)**: enige import is `import type { BuilderCanvasConfig } from '../BuilderCanvas'` — relatief pad, maar dit is het gangbare patroon binnen dezelfde template-map (consistent met alle andere builder-canvas-configs, incl. baseline `web-developer.ts`) — geen missie-specifieke afwijking — `automation-engineer.ts:1`
- **Criterium A6 (Restart-safe state)**: geldt via de gedeelde engine (`BuilderCanvas.tsx`), niet missie-specifiek te verifiëren vanuit de config — buiten scope
- **Criterium A7 (Security)**: geen `dangerouslySetInnerHTML`, geen client-side `systemInstruction`-definitie op templateRegistry-niveau; de chat gebruikt `chatRoleId: 'automation-engineer'`, waarmee de server-side `systemInstruction` (`year2.tsx:952`) autoritair is — `automation-engineer.ts:25-26`
- **Scoring-integriteit (specifiek gecheckt na tech-impact-analyst-bevinding elders in deze wave)**: `pointsPerStep = Math.floor(maxScore / steps.length)` = `Math.floor(100/4)` = `25`; 4 stappen × 25 = **100**, exact gelijk aan `maxScore: 100` — geen scoring-mismatch zoals bij `tech-impact-analyst` — `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:78`, `automation-engineer.ts:94`

#### ⚠️ Aandachtspunten
_Geen._

#### ❌ Blocking issues
_Geen._

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server of screenshots-map beschikbaar in deze M4-batch-run. Geen console/network/visuele evidence verzameld. `automation-engineer` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde geen treffers), dus ook geen bestaande dynamische dekking uit de eerdere platform-brede UI/UX-review. Multi-viewport-verificatie is een openstaande follow-up.

### Score
Static: 6/6 criteria geslaagd (n.v.t. voor A1/A2/A6, buiten missie-scope) · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## 🖼️ Visuele evidence (multi-viewport)

Geen screenshots-map beschikbaar voor deze missie in deze M4-batch-run. Geen dev-server gestart (buiten scope van deze batch-review-configuratie). `automation-engineer` staat niet in de bestaande platform-brede UI/UX-review (`docs/audits/student-missions-ui-ux-review-2026-06-30.md`). Multi-viewport-verificatie via Chrome-plugin is een openstaande follow-up.

---

## Bekende platform-brede punten (niet herhaald als missie-specifieke bevinding)
- **Coach-plan vs. canvas-stappen desync**: de chat-agent (`year2.tsx:996-1012`, `STEP_COMPLETE:1/2/3`) heeft **3 coach-stappen**, terwijl de builder-canvas-config **4 canvas-stappen** heeft (taak-analyse, algoritme, script-structuur, testplan). Dit is hetzelfde platform-brede desync-patroon dat bij meerdere builder-canvas-missies in eerdere waves is geconstateerd als een architectuur-beslispunt (chat-voortgangstracking loopt via een apart, niet-gesynchroniseerd mechanisme dan de canvas-checklist-voortgang) — geen missie-specifieke fix, platform-beslispunt.
- **Dormante chat-mogelijkheid**: de daadwerkelijke systeeminstructie die de leerling ervaart is server-side (`systemInstructions.ts` bepaalt op basis van `chatRoleId`); de client-side `systemInstruction`-tekst in `year2.tsx` is fallback/referentie, niet de bron-van-waarheid voor productiegedrag — platform-breed patroon, geen missie-specifieke drift geconstateerd bij handmatige vergelijking van de kern-scaffolding (WERKWIJZE + SCOPE GUARD komen inhoudelijk overeen met de builder-canvas-stappen).
- **Duck-tokens**: n.v.t. voor deze missie — config bevat geen Tailwind-classNames.

---

## Samenvatting
- **Geslaagd:** 22 criteria (7 design + 9 didactiek + 6 tech)
- **Aandachtspunten:** 1 niet-blocking (design, licht instruction-woordenaantal, geen actie nodig)
- **Blocking issues:** 0
- **Aanbeveling:** **ship** — sterke missie op alle drie de assen; scoringslogica correct (geen mismatch zoals elders in deze wave geconstateerd), SLO-fit sterk bewezen op beide geclaimde kerndoelen, AI-scaffolding volgt correct de 3-stappen-methode en scope guard

---

## Codex-gate (M1)
_Niet uitgevoerd — deze M4-batch-review-run draait zonder Codex-adversarial-gate-stap (buiten scope van de gegeven taakinstructie voor deze wave). Rapport is sub-reviewer-output, geen Codex-gevalideerd ship-bewijs._
