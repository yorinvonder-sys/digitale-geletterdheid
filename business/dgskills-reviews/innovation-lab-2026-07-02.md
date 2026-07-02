# Missie-review: Innovation Lab

**Mission ID:** innovation-lab
**Template:** builder-canvas
**Curriculum-plek:** Leerjaar 3, Periode 3 (Maatschappelijke Impact & Innovatie)
**Datum:** 2026-07-02
**Reviewer-pipeline:** M4 batch-review (wave 19)

---

## 🎨 Design review

**Mission:** innovation-lab (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind token consistentie)**: geen Tailwind-classNames, geen hex-literals in de builder-canvas-config zelf — uitsluitend content/copy — `src/features/missions/templates/builder-canvas/configs/innovation-lab.ts` (hele bestand)
- **Criterium 2 (Layout consistentie)**: identieke structuur als baseline `web-developer.ts`/`prototype-developer.ts` — `introFeatures`, 4 `steps` met `checklistItems` + `textPrompt`, `badges`, `takeaways` — geen structurele afwijking
- **Criterium 3 (Knop-clarity)**: geen knoppen in de config zelf; engine-knoppen zijn gedeeld en elders al gereviewd — n.v.t.
- **Criterium 4 (Copy-lengte)**: `introDescription` 40 woorden (grens leerjaar 3: <90) — ruim binnen grens; checklist-labels kort — `innovation-lab.ts:8-9`
- **Criterium 5/6 (Responsive/Framer Motion)**: geen missie-specifieke code (engine-gedeeld)
- **Criterium 7 (Toegankelijkheid)**: badges gebruiken emoji + tekst-titel, geen kleur-only informatie — `innovation-lab.ts:87-91`

### ⚠️ Aandachtspunten
- **Bekend shared-shell probleem, hier zwaarder dan gemiddeld**: de platform-brede UI/UX-review (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:61`) noemt `innovation-lab` expliciet als de missie waar de KEES-avatar/tekstballon-clipping **zelfs op desktop** optreedt, niet alleen mobiel zoals bij de meeste andere missies. Dit is een shared-shell-fix (1× voor ~15-20 missies), geen missie-specifieke code-wijziging — niet blocking voor deze missie op zichzelf, maar wel de zwaarste instantie van het patroon die tot nu toe in de reviews is genoteerd.

### ❌ Blocking issues
_Geen._

### Visual Precision Gate
`WARN` — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run. Wel bestaande dynamische evidence uit de platform-brede UI/UX-review (2026-06-30) die de desktop-clipping bevestigt (zie boven).

### Score
7/7 criteria geslaagd (1 aandachtspunt, bekend platform-patroon, hier de zwaarste instantie) · Aanbeveling: **ship, shared-shell-fix aanbevelen als vervolgtaak**

---

## 📚 Didactiek review

**Mission:** innovation-lab (builder-canvas)
**Curriculum-plek:** Leerjaar 3, Periode 3
**SLO-claim:** 23C (Design Thinking voor maatschappelijke problemen), 22A
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct)**: `23C`/`22A` zijn geldige codes, 2 codes (binnen richtlijn); comment `21D→23C` in de mapping wijst op een bewuste eerdere herclassificatie — `src/config/slo-kerndoelen-mapping.ts:178`
- **Criterium 2 (SLO-fit)**: `23C` sterk geraakt via de volledige Design Thinking-cyclus (probleem → oplossing → MVP → impact); `22A` geraakt via de technologie-analyse in stap 2 — `innovation-lab.ts:19-83`
- **Criterium 3 (Leerdoelen helder)**: `missionGoals.ts:643-651` bevat expliciete `primaryGoal` + meetbare `criteria` (steps-complete, min 4) en concrete `evidence`-eis (gebruikers, kernfunctie, meetbare impact-indicatoren) — voldoet aan action-verb + concreet-eis
- **Criterium 4 (Opdracht-beknoptheid)**: 4 stappen, instructions zijn genummerde deelvragen (leesbaar gescand), passend voor leerjaar 3 (havo/vwo, `difficulty: 'Hard'`)
- **Criterium 5 (Leeftijds-passend vocabulary)**: MVP wordt uitgelegd ("Minimum Viable Product") met een concreet Airbnb-voorbeeld — `innovation-lab.ts:56-59`; geen onverklaard jargon
- **Criterium 6 (Curriculum-plek logisch)**: staat in periode 3 "Maatschappelijke Impact & Innovatie" naast `startup-simulator`, `policy-maker`, `tech-impact-analyst` — logische plek in het innovatie-cluster — `src/config/curriculum.ts:281-297`
- **Criterium 7 (Bloom-taxonomie balans)**: goede mix — analyseren (probleemkeuze), creëren (oplossingsontwerp + MVP), evalueren (impact + risico's/duurzaamheid, stap 4) — geen platte recall, passend hoog voor leerjaar 3

### ⚠️ Aandachtspunten
- **Missie-specifieke bevinding — server/client content-drift (niet het bekende "dormante chat"-patroon, en géén platform-breed punt)**:
  - **Wat:** de builder-canvas-config en de client-side systemInstruction in `src/config/agents/year3.tsx:1330-1420` zijn herschreven van "**maatschappelijk** probleem + SDG-kader" naar "**alledaags** probleem (school, sport, hobby, thuis)" — zonder SDG-referentie. Maar de server-side `systemInstructions.ts:90` (die de daadwerkelijke chat-ervaring bepaalt, zie platform-inzicht) bevat nog de **oude** tekst: "maatschappelijk probleem", "gekoppeld aan een SDG", "Sustainable Development Goals (SDGs) als kader", en instrueert de AI expliciet: *"Laat de leerling een maatschappelijk probleem kiezen, gekoppeld aan een SDG."* De server-versie heeft bovendien **4** STEP_COMPLETE-markers (`1`-`4`), de client-versie **3** (`1`-`3`) — een aparte, kleinere desync bovenop de content-drift.
  - **Waarom dit didactisch relevant is (niet triviaal)**: de config, badges en `missionGoals.ts` beloven een missie over "een alledaags probleem — op school, in de sport, bij een hobby, thuis of in het dagelijks leven" (`innovation-lab.ts:9`, geen SDG-eis). De leerling die daadwerkelijk chat, krijgt echter een AI-coach die vraagt om een **maatschappelijk** probleem **gekoppeld aan een SDG** — een wezenlijk andere, zwaardere opdracht dan wat de missie-omschrijving en de canvas-stappen (`probleem-kiezen`: "school, sport, hobby of thuis") vragen. Dit is geen cosmetische tekstverschil maar een verschil in wat de leerling geacht wordt te doen.
  - **Extra: interne inconsistentie binnen het client-bestand zelf** — `year3.tsx:1387` (SCOPE GUARD) zegt nog letterlijk *"Blijf bij Design Thinking en **maatschappelijke impact** van technologie"*, terwijl de rest van dezelfde systemInstruction (INHOUDELIJKE FOCUS, WERKWIJZE, EERSTE BERICHT) al is omgezet naar "alledaags". De update naar "alledaags" is dus zelfs client-side niet volledig doorgevoerd.
  - **Voorstel** (niet toegepast — Stap D-instructie: wijzig niets):
    ```diff
    # supabase/functions/_shared/systemInstructions.ts (regel 90, binnen de "innovation-lab"-string)
    - INHOUDELIJKE FOCUS (SLO 23C, 22A):
    - - Maatschappelijke problemen analyseren vanuit een technologisch perspectief
    - - Design Thinking: van empathie naar prototype
    - - Sustainable Development Goals (SDGs) als kader
    - - Innovatie: wat maakt een oplossing vernieuwend?
    - - Technologische haalbaarheid: wat bestaat er al, wat is nieuw?
    -
    - WERKWIJZE:
    - 1. Laat de leerling een maatschappelijk probleem kiezen, gekoppeld aan een SDG.
    + INHOUDELIJKE FOCUS (SLO 23C, 22A):
    + - Alledaagse problemen analyseren vanuit een technologisch perspectief
    + - Design Thinking: van empathie naar prototype
    + - Innovatie: wat maakt een oplossing vernieuwend?
    + - Technologische haalbaarheid: wat bestaat er al, wat is nieuw?
    + - Probleemafbakening: van breed probleem naar concreet ontwerp
    +
    + WERKWIJZE:
    + 1. Laat de leerling een concreet alledaags probleem kiezen (school, sport, hobby, thuis, dagelijks leven).
    ```
    (Server-tekst 1-op-1 gelijktrekken met de al-bijgewerkte `year3.tsx`-versie, inclusief het STEP_COMPLETE-aantal van 4 naar 3 en de EERSTE BERICHT-tekst.)
    ```diff
    # src/config/agents/year3.tsx:1387 (SCOPE GUARD, binnen dezelfde systemInstruction)
    - - Blijf bij Design Thinking en maatschappelijke impact van technologie. Als de leerling technische implementatiedetails wil bespreken: [...]
    + - Blijf bij Design Thinking en de gekozen alledaagse toepassing. Als de leerling technische implementatiedetails wil bespreken: [...]
    ```
  - **autoFixable:** nee — dit vraagt een bewuste redactionele keuze (welke versie is de bedoelde: "alledaags" of "maatschappelijk + SDG"?) en raakt een `_shared`-bestand dat mogelijk door meerdere rollen wordt gedeeld; niet blind te patchen zonder te bevestigen dat de "alledaags"-richting de gewenste eindstaat is.

### ❌ Blocking issues
_Geen — de content-drift is een reëel kwaliteitsprobleem maar blokkeert geen ship, want de missie is functioneel en didactisch coherent zonder de chat (canvas-stappen + checklist staan op zichzelf); het risico zit specifiek in de AI-coaching-laag._

### SLO-fit oordeel
- **23C (Design Thinking voor maatschappelijke problemen)**: sterk geraakt door de canvas-stappen zelf (probleem → oplossing → MVP → impact/duurzaamheid)
- **22A**: geraakt via de technologie-analyse in stap 2 (bestaande technologie als bouwsteen, "WhatsApp heruitvond SMS niet")

### Score
7/9 criteria geslaagd (2 relevante aandachtspunten: server/client content-drift + interne SCOPE GUARD-inconsistentie) · Bloom-balans: **medium-hoog** · Aanbeveling: **ship met vervolgtaak** — de canvas-missie zelf is didactisch sterk; de chat-coaching-tekst moet gelijkgetrokken worden

---

## 🔧 Tech review

**Mission:** innovation-lab (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/screenshots-map beschikbaar in deze M4-batch-run

### Static analyse

#### ✅ Geslaagd
- **Criterium A1/A2 (Knop-handlers/error states)**: geen missie-specifieke knoppen/async-calls in de config — engine-gedeeld, buiten scope
- **Criterium A3 (TypeScript-discipline)**: geen `any`, geen `@ts-ignore`/`@ts-expect-error`; config volledig getypeerd via `BuilderCanvasConfig` — `innovation-lab.ts:3`
- **Criterium A4 (Imports via alias)**: enige import `import type { BuilderCanvasConfig } from '../BuilderCanvas'` — consistent patroon binnen dezelfde template-map — `innovation-lab.ts:1`
- **Criterium A6 (Restart-safe state)**: geldt via de gedeelde engine, niet missie-specifiek te verifiëren — buiten scope
- **Scoring-integriteit**: `pointsPerStep = Math.floor(100/4) = 25`; 4 stappen × 25 = **100**, exact gelijk aan `maxScore: 100` — geen scoring-mismatch — `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:78`, `innovation-lab.ts:85`
- **Registratie compleet**: `RoleId`-union (`src/types.ts:47`), `AGENT_ROLE_IDS` (`agentRoleIds.ts:90`), `templateRegistry.ts:59`, `curriculum.ts:288`, `slo-kerndoelen-mapping.ts:178`, `missionGoals.ts:643` — alle bronnen consistent op `innovation-lab`

#### ⚠️ Aandachtspunten
- **Criterium A7 (Security/config-integriteit)**: zie didactiek-bevinding — de server-side `systemInstructions.ts` en client-side `year3.tsx` zijn beide legitieme, getypeerde bronnen maar staan inhoudelijk niet meer synchroon (server = oude SDG-versie, 4 STEP_COMPLETE; client = nieuwe alledaags-versie, 3 STEP_COMPLETE). Geen security-risico (geen XSS/injectie/auth-issue), wel een config-integriteitsissue: twee bronnen van waarheid voor dezelfde rol zijn uit elkaar gegroeid tijdens een contentwijziging die niet volledig is doorgevoerd. Zie het Voorstel-blok in de didactiek-sectie hierboven.

#### ❌ Blocking issues
_Geen._

### Dynamic verificatie (indien uitgevoerd)
Niet uitgevoerd — geen dev-server of screenshots-map beschikbaar in deze M4-batch-run. `innovation-lab` komt wél voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md:61-62` (de KEES-clipping-bevinding, incl. desktop-instantie — zie design-sectie).

### Score
Static: 5/6 criteria geslaagd (1 aandachtspunt, config-integriteit, niet blocking) · Dynamic: n.v.t. (bestaande evidence uit platform-review overgenomen) · Aanbeveling: **ship**

---

## 🖼️ Visuele evidence (multi-viewport)

Geen aparte screenshots-map beschikbaar voor deze missie in deze M4-batch-run. Wel bestaande evidence uit de platform-brede UI/UX-review (`docs/audits/student-missions-ui-ux-review-2026-06-30.md:61`): op mobiel (390px) én — uniek voor deze missie — **ook op desktop** is de KEES-avatar/tekstballon bovenaan afgekapt. Dit is de zwaarste tot nu toe genoteerde instantie van het bekende shared-shell-patroon.

---

## Bekende platform-brede punten (niet herhaald als missie-specifieke fix-eis)

- **Coach-plan vs. canvas-stappen desync (aantal)**: de chat-agent (`year3.tsx`, momenteel 3 STEP_COMPLETE-markers) vs. de builder-canvas-config (4 canvas-stappen: probleem-kiezen, technologie-oplossing, prototype-concept, impact). Dit is het bekende platform-brede desync-patroon (chat-voortgangstracking los van canvas-checklist-voortgang) — `innovation-lab` hoort bij de set die dit patroon vertoont. STEP_COMPLETE-markers zijn functioneel inert in builder-canvas-missies (bevestigd elders in deze wave-serie), dus dit raakt alleen coachingtekst, niet voortgangsregistratie. **Let op**: bovenop dit bekende aantal-verschil is bij déze missie ook een **inhoudelijke** content-drift gevonden (zie didactiek-sectie) — dat deel is wél missie-specifiek en nieuw, dus hierboven volledig uitgewerkt in plaats van hier weggelaten.
- **Dormante chat-mogelijkheid**: n.v.t. — de chat is hier actief (`enableChat: true`) en de server-side prompt bestaat en is inhoudelijk uitgewerkt (alleen gedateerd, zie boven).
- **Duck-tokens**: n.v.t. — config bevat geen Tailwind-classNames.
- **KEES-avatar shared-shell clipping**: bekend platform-patroon (~15-20 missies), hier de zwaarste instantie (desktop + mobiel) — zie design-sectie.

---

## Samenvatting
- **Geslaagd:** 19 criteria (7 design + 7 didactiek + 5 tech)
- **Aandachtspunten:** 3 relevant (1 design — zwaarste KEES-clipping-instantie; 2 didactiek/tech — server/client content-drift + interne SCOPE GUARD-inconsistentie in de chat-coaching-tekst)
- **Blocking issues:** 0
- **Aanbeveling:** **ship, met een gerichte vervolgtaak** — de builder-canvas-missie zelf (stappen, SLO-fit, scoring, registratie) is solide en compleet. Het enige reële risico zit in de AI-chat-coaching: de server-side prompt is een oudere contentversie (SDG-gekoppeld, "maatschappelijk probleem") die niet is meegenomen toen de config/client-versie is herschreven naar "alledaags probleem". Leerlingen die de chat gebruiken kunnen daardoor een andere opdracht van de AI-coach krijgen dan wat de missie-omschrijving belooft. Aanbevolen vervolgstap: `systemInstructions.ts:90` en `year3.tsx:1387` gelijktrekken met de bedoelde eindversie (voorstel-diff hierboven), als bewuste redactiebeslissing — niet blind patchen.

---

## Codex-gate (M1)
_Niet uitgevoerd — deze M4-batch-review-run draait zonder Codex-adversarial-gate-stap (buiten scope van de gegeven taakinstructie voor deze wave). Rapport is sub-reviewer-output, geen Codex-gevalideerd ship-bewijs._
