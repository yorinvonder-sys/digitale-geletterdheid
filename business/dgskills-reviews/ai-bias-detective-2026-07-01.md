# Missie-review: AI Bias Detective (`ai-bias-detective`)

**Datum:** 2026-07-01 · **Wave:** 7 (verse review) · **Template:** `scenario-engine`
**Curriculum:** Leerjaar 2, Periode 1 (Data & Informatie) · **SLO:** 21D (AI), 23C (Maatschappij) · VSO: 18C, 20B

**Config:** `src/features/missions/templates/scenario-engine/configs/ai-bias-detective.ts`
**Agent-rol (dormant):** `src/config/agents/year2.tsx:430-473`
**Visueel bewijs:** geen bestaande screenshots (`screenshots/assignments/ai-bias-detective/` bestaat niet); geen vermelding in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` — dynamische verificatie overgeslagen, statisch oordeel op basis van config + bekende engine-brede bevindingen.

---

## 🎨 Design review

**Mission:** ai-bias-detective (scenario-engine)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config bevat geen hardcoded hex voor UI-chrome — enige hex-literals zijn badge-kleuren (`#ff3c21`, `#202023`), en dat is het bekende, al-geëscaleerde badge-kleurpatroon (niet opnieuw rapporteren) — `src/features/missions/templates/scenario-engine/configs/ai-bias-detective.ts:20,27,33,39`
- **Criterium 2 (Layout consistentie):** gebruikt hetzelfde `ScenarioEngineConfig`-schema (rounds/items/badges/takeaways) als de overige 11 scenario-engine-missies — geen structurele afwijking
- **Criterium 4 (Copy-lengte):** introDescription 45 woorden (grens leerjaar 2: <80), ronde-beschrijvingen 15-21 woorden (grens: <60) — ruim binnen de norm
- **Criterium 6 (Framer Motion):** geen missie-specifieke animatie-code in de config (animaties zitten in de gedeelde engine — buiten scope van deze review)

### ⚠️ Aandachtspunten
- **Visual Precision Gate — unverified**: geen Chrome-plugin bewijs beschikbaar voor deze missie specifiek. Het UI/UX-auditrapport van 30 juni dekt scenario-engine als templategroep (gemiddelde score 3.83/5 over 12 missies, zie audit regel 45) maar noemt `ai-bias-detective` niet met naam. Bekend engine-breed risico dat óók hier kan spelen: shared-shell laat ~35-40% lege ruimte onder de stappen-kaart zien bij scenario-engine op iPad-staand (audit regel 86) — dit is al geëscaleerd als engine-issue, niet opnieuw als missie-issue rapporteren.
  - **Wat:** deze missie is nooit los gescreenshot/geaudit.
  - **Waarom:** zonder dynamisch bewijs kan niet worden bevestigd of de 8-9 items in ronde 1 en ronde 4 (langste rondes, 8 items elk) prettig scrollen op mobiel binnen de scenario-engine-kaart.
  - **Voorstel:** meenemen in een volgende Fase B-sweep zodra een dev-server draait; geen actie nu.

### ❌ Blocking issues
_geen_

### Score
3/4 statisch-verifieerbare criteria geslaagd (Visual Precision Gate = unverified, niet fail) · Aanbeveling: **ship** (config zelf toont geen design-gebreken; ontbrekend visueel bewijs is een dekkingsgat, geen kwaliteitsprobleem)

---

## 📚 Didactiek review

**Mission:** ai-bias-detective (scenario-engine)
**Curriculum-plek:** Leerjaar 2, Periode 1
**SLO-claim:** 21D (AI), 23C (Maatschappij) · VSO 18C, 20B
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 21D en 23C zijn beide geldige regulier-VO-codes, VSO-mapping 18C/20B aanwezig — `src/config/slo-kerndoelen-mapping.ts:103`
- **Criterium 2 (SLO-fit):** 21D (AI) wordt substantieel geraakt — alle 4 rondes draaien om AI-bias herkennen, analyseren en oplossen. 23C (Maatschappij) wordt geraakt via de maatschappelijke impact-voorbeelden (COMPAS-rechtspraak, politie-AI, gezichtsherkenning) en ronde 4 (wetgeving/EU AI Act-vermelding) — `configs/ai-bias-detective.ts:238-352` (ronde 4)
- **Criterium 3 (Leerdoelen helder):** `missionGoals.ts` bevat een expliciet, meetbaar `primaryGoal` met actiewerkwoorden ("herken", "schat in", "kies") en concreet `evidence`-criterium ("twee concrete voorbeelden... en een maatregel die écht helpt") — `src/config/missionGoals.ts:401-409`
- **Criterium 4 (Opdracht-beknoptheid):** ruim binnen leerjaar 2-grenzen (zie design-sectie) — geen wall-of-text
- **Criterium 6 (Curriculum-plek):** logisch geplaatst in Periode 1 "Data & Informatie" ná `data-journalist`, `factchecker` e.a. — AI-bias bouwt voort op het factchecken/data-analyseren dat leerlingen net hebben geoefend — `src/config/curriculum.ts:169`
- **Criterium 7 (Bloom-balans):** goede mix — ronde 1 = herkennen/classificeren (begrijpen), ronde 2 = risico rangschikken (analyseren/evalueren), ronde 3 = onderscheid maken tussen bias en legitieme personalisatie (analyseren), ronde 4 = oplossingen beoordelen op effectiviteit (evalueren). Geen pure onthoud-quiz.
- **Criterium 9 (Welzijn & inclusiviteit):** onderwerp raakt gevoelige categorieën (gender, etniciteit) en wordt zorgvuldig behandeld — elke item-explanation legt de mechaniek uit zonder groepen te stigmatiseren; VSO-mapping aanwezig.

### ⚠️ Aandachtspunten
- **Criterium 8 (AI-as-copilot) — n.v.t., want dormant**: de agent-rol in `year2.tsx` bevat een volledig uitgewerkte 3-stappen-chat-flow (erkenning → identificatie → verbetervoorstel, met `EERSTE BERICHT` en `STEP_COMPLETE`-markers), maar `templateRegistry.ts:18` registreert deze missie **zonder** `enableChat: true` / `chatRoleId` — vergelijk met bijv. `data-journalist` op regel 68 die dat wel heeft. Geverifieerd dat de rol ook niet via een andere route (AiLab) bereikbaar is voor deze missie: `AiLab.tsx` is de losstaande agent-chat-hub, maar `ai-bias-detective` wordt door `TEMPLATE_MISSIONS` naar de scenario-engine geroute, niet naar AiLab.
  - **Wat:** ~50 regels doordachte didactische chat-content (scaffolding-vragen, scope-guard, welzijns-taal) wordt nooit aan een leerling getoond.
  - **Waarom:** de missie levert wel leerdoel-dekking via de scenario-engine-rondes (zie Bloom-balans hierboven), dus dit is geen SLO-gat — maar het is verspilde content en een gemiste kans op open, begeleide reflectie (de chat-flow vraagt leerlingen zelf een AI-systeem te kiezen en te analyseren, wat rijker is dan multiple-choice-rondes).
  - **Voorstel:** buiten scope van deze missie-review om te fixen (activeren van een dormante rol is een missie-brede beslissing, geen mechanische config-fix) — zie `autoFixable` hieronder waarom dit niet is opgenomen. Aanbeveling: apart bekijken of dit patroon (dormante rol + scenario-engine) bewust is voor de hele batch, of een onbedoeld restant uit een eerdere ontwerpiteratie.

### ❌ Blocking issues
_geen_

### SLO-fit oordeel
- **21D (AI):** sterk geraakt — kernonderwerp van alle 4 rondes, met concrete, geverifieerde praktijkvoorbeelden (Amazon-recruiting-AI 2018, Buolamwini gezichtsherkenning-onderzoek, COMPAS)
- **23C (Maatschappij):** sterk geraakt — expliciete koppeling naar maatschappelijke impact, machtsverhoudingen (arme vs. rijke wijken) en EU AI Act-vereisten (explainability, externe audits)

### Score
7/8 relevante criteria geslaagd (criterium 5 leeftijds-vocabulary niet apart uitgesplitst, zit impliciet in beknoptheid-oordeel) · Bloom-balans: **medium-hoog** (goede spreiding begrijpen→evalueren) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** ai-bias-detective (scenario-engine)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-run, geen bestaande screenshots, geen vermelding in het 30-juni-auditrapport

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore`, config is volledig getypeerd via `ScenarioEngineConfig` — `configs/ai-bias-detective.ts:1-3`
- **Criterium A4 (Imports via alias):** enige import is de gedeelde type via relatief pad `'../types'`, wat het gevestigde patroon is binnen de configs-submap van scenario-engine (consistent met zustermissies zoals `cookie-crusher.ts`, `factchecker.ts`) — geen afwijking
- **Criterium A6 (Restart-safe state):** config zelf bevat geen state-logica — state/autosave wordt door de gedeelde `ScenarioEngine.tsx` afgehandeld (engine-verantwoordelijkheid, buiten scope van missie-specifieke review)
- **Criterium A7 (Security):** geen user-input-verwerking in de config zelf (multiple-choice/ranking-items, geen vrije tekstinvoer naar een AI-model) — geen sanitization-risico op missie-niveau

#### ⚠️ Aandachtspunten
- **Dormante agent-rol bevestigd (zie ook didactiek-sectie):** `src/config/agents/year2.tsx:430-473` bevat een complete `systemInstruction` + `steps` + `bonusChallenges: null` die nooit wordt uitgevoerd omdat `templateRegistry.ts:18` geen `enableChat`/`chatRoleId` zet.
  - **Wat:** dode configuratie — geen bug, geen bereikbaarheidsprobleem voor de leerling, maar wel technische schuld (twee parallelle content-bronnen voor dezelfde missie, waarvan er één nooit rendert).
  - **Risico:** laag voor de huidige leerling-ervaring; risico is dat een toekomstige onderhouder de `year2.tsx`-content bijwerkt in de veronderstelling dat die live is, of dat de twee bronnen inhoudelijk uit elkaar gaan lopen (bijv. SLO-focus-comment in year2.tsx zegt "21D, 23C" wat matcht met de mapping — vooralsnog consistent, maar niet gegarandeerd bij toekomstige edits).
  - **Voorstel:** geen fix binnen deze review — vereist een missie-brede beslissing (activeren via `enableChat: true` zou een architectuurkeuze zijn, geen mechanische fix) en valt buiten `autoFixable`-scope.

#### ❌ Blocking issues
_geen_

### Dynamic verificatie
Niet uitgevoerd — geen dev-server actief tijdens deze review, geen bestaande screenshots, en geen vermelding in het recente (30 juni) UI/UX-auditrapport dat de overige 11 scenario-engine-missies wel dekt. Aanbeveling: meenemen in een gerichte Fase B-sweep.

### Score
Static: 4/4 relevante criteria geslaagd · Dynamic: n.v.t. (niet uitgevoerd) · Aanbeveling: **ship** (statisch schoon; dynamische dekking is een openstaand actiepunt, geen blocker)

---

## Samenvatting

|As | Score | Verdict |
|---|---|---|
| 🎨 Design | 8/10 | ship (visueel bewijs ontbreekt, config zelf schoon) |
| 📚 Didactiek | 9/10 | ship (sterke SLO-fit, goede Bloom-balans) |
| 🔧 Tech | 8/10 | ship (statisch schoon, dynamisch ongedekt) |

**Triage-score:** (10-8)×0.3 + (10-9)×0.4 + (10-8)×0.3 = 0.6 + 0.4 + 0.6 = **1.6**

**Eindverdict: ok** — geen blocking issues op alle drie de assen. De enige substantiële bevinding (dormante chat-rol) is een architectuurkeuze-vraag, geen kwaliteitsdefect, en is niet mechanisch fixbaar binnen missie-scope. Ontbrekend dynamisch/visueel bewijs is genoteerd als openstaand actiepunt voor een toekomstige Fase B-sweep, geen reden om de missie te blokkeren.

### Geen auto-fixable issues gevonden
Er zijn in deze review geen mechanische, missie-specifieke fixes binnen de config of centrale entries geïdentificeerd. De dormante-rol-bevinding vereist een expliciete architectuurbeslissing (activeren van chat vs. bewust behouden als scenario-only) en is daarom niet opgenomen als auto-fix.
