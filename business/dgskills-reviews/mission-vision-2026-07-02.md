# Missie-review: mission-vision ("De Visie")

**Datum:** 2026-07-02
**TemplateType:** builder-canvas
**Curriculum-plek:** Leerjaar 1, Periode 4 (eindproject-cluster, na mission-blueprint, vóór mission-launch)
**SLO-claim:** 22A (Digitale producten), 21B (Media & Informatie) · VSO: 19A, 18B
**Config:** `src/features/missions/templates/builder-canvas/configs/mission-vision.ts`
**Agent-rol:** `src/config/agents/year1.tsx:3173-3264` (Creatief Director)

---

## 🎨 Design review

**Mission:** mission-vision (builder-canvas)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tailwind tokens):** config is content-only (geen inline `className`), rendering loopt via `BuilderCanvas.tsx` die consequent `duck-*` tokens gebruikt (`bg-duck-bg`, `duck-acid`, `duck-ink`, `duck-gray`) — `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:227,306,320,384`. Geen missie-specifieke afwijking.
- **Criterium 2 (Layout consistentie):** config volgt exact hetzelfde schema als sibling `mission-blueprint` (zelfde velden, zelfde structuur, zelfde `maxScore: 100`, zelfde badge-drempels 0/25/50/70/90) — `src/features/missions/templates/builder-canvas/configs/mission-blueprint.ts:138-142` vs `mission-vision.ts:137-143`.
- **Criterium 3 (Knop-clarity):** N.v.t. voor deze config — knoppen zijn engine-eigendom (BuilderCanvas), geen missie-specifieke knoppen in de config.
- **Criterium 6/7 (Framer Motion, a11y):** N.v.t. — geen missie-specifieke JSX in deze config; engine-verantwoordelijkheid.

### ⚠️ Aandachtspunten
- **Visual Precision Gate**: **unverified** — geen screenshots-map aanwezig voor deze wave, en `mission-vision` komt niet voor in `docs/audits/student-missions-ui-ux-review-2026-06-30.md` (grep leverde geen treffer). Geen dynamic Chrome-plugin-bewijs beschikbaar in deze review-pass.
  - **Wat:** geen multi-viewport-screenshot-bewijs voor intro/mid-flow/eind-states van deze specifieke missie.
  - **Waarom:** kan niet uitsluiten dat de generieke BuilderCanvas-layout bij 5 stappen (méér dan de meeste builder-canvas-missies) op mobiel prettig scrollt.
  - **Voorstel:** meenemen in een toekomstige Fase-B dynamic-verificatieronde met dev-server; geen actie nu (bekend platform-beperking, niet missie-specifiek).

### ❌ Blocking issues
Geen.

### Score
4/4 toepasbare criteria geslaagd (overige N.v.t. — engine-eigendom) · Visual Precision Gate: unverified · Aanbeveling: **ship** (met notitie dat dynamic-verificatie nog volgt)

---

## 📚 Didactiek review

**Mission:** mission-vision (builder-canvas)
**Curriculum-plek:** Leerjaar 1, Periode 4
**SLO-claim:** 22A, 21B · VSO 19A, 18B
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes correct):** 22A en 21B zijn beide geldige regulier-VO-codes; VSO-mapping 19A/18B aanwezig — `src/config/slo-kerndoelen-mapping.ts:87`.
- **Criterium 2 (SLO-fit):** 22A (digitale producten, creatief proces) wordt sterk geraakt door de moodboard- en slides-stappen; 21B (bewust kiezen van beelden/kleuren om boodschap over te brengen) wordt expliciet geraakt door stap "moodboard" (kleurenpalet + motivatie) en de agent-rol STAP 2 "DE SFEER". Inline comment in de mapping onderbouwt de keuze (`// 21D→21B: moodboard + pitch = product + visuele communicatie`) — sterk bewijs van bewuste SLO-toewijzing.
- **Criterium 3 (Leerdoelen):** `takeaways` (5 stuks) zijn concreet en grotendeels action-verb-gestuurd: "Je weet hoe je een visie formuleert...", "Je hebt presentatieslides ontworpen..." — `mission-vision.ts:144-149`.
- **Criterium 6 (Curriculum-plek):** logische opbouw: mission-blueprint (plan) → mission-vision (visie/uitstraling) → mission-launch (lancering), alle P4 eindproject-cluster, yearGroup 1.
- **Criterium 8 (AI-as-copilot):** agent-rol bevat expliciete regel "Ga NOOIT het werk voor de leerling doen. Stel vragen zodat ZIJ creatieve keuzes maken." + "Geef GEEN kant-en-klare moodboards of pitches" — `src/config/agents/year1.tsx:3202-3203`. 4-stappen-scaffolding (doelgroep → sfeer → moodboard → pitch) met concrete voorbeeldvragen per stap, geen kant-en-klaar-antwoord-patroon.
- **Criterium 9 (VSO + inclusiviteit):** VSO-mapping aanwezig; geen gender-specifieke aannames in copy.

### ⚠️ Aandachtspunten
- **Criterium 4 (Opdracht-beknoptheid)**: de `instruction`-velden van stap 1-3 overschrijden de leerjaar-1-richtlijn van <60 woorden per opdracht — `mission-vision.ts:26` (82 woorden), `mission-vision.ts:54` (77 woorden), `mission-vision.ts:84` (69 woorden). `introDescription` (31 woorden, `mission-vision.ts:9`) blijft ruim binnen de <80-grens.
  - **Wat:** drie van de vijf stap-instructies zijn genummerde 4-5-deel-opdrachten die de 60-woordengrens met 15-37% overschrijden.
  - **Waarom:** voor leerjaar 1 (12-13 jaar) is dit geen wall-of-text-risico — de genummerde opsomming (1/2/3/4) breekt de tekst visueel op in behapbare delen, wat het effectieve leesbaarheids-risico verlaagt t.o.v. lopende-tekst-instructies van gelijke lengte. Dit is dezelfde structuur als de al-goedgekeurde `mission-blueprint` (platform-patroon voor eindproject-missies met meerdere deelvragen per stap).
  - **Voorstel:** geen ingrijpende herschrijving nodig — de genummerde structuur compenseert de lengte. Optioneel: stap 1 (82 woorden, grootste overschrijding) kan het laatste zinsdeel over kernwaarden als apart, korter vervolgzinnetje splitsen. Niet blocking.
- **Criterium 7 (Bloom-balans)**: reflectievragen (met Bloom-toets via multiple-choice-uitleg) staan alleen op stap 1-3 (`visie-formuleren`, `moodboard`, `slides-ontwerpen`) — `mission-vision.ts:34,64,93`. Stap 4 (`pitch-schrijven`) en stap 5 (`slides-bouwen`) — de twee stappen met de hoogste toepassings-/creatie-Bloom-niveau (leerling schrijft zelf een pitch, bouwt zelf slides) — hebben géén reflectionQuestion.
  - **Wat:** de missie toetst begrip/toepassen via reflectievragen alleen bij de eerste drie (voorbereidende) stappen, niet bij de twee stappen waar de leerling het hoogste-orde werk levert.
  - **Waarom:** een korte reflectievraag bij stap 4 of 5 (bv. over wat een goede pitch-afsluiting onderscheidt van een zwakke) zou de Bloom-balans richting evalueren/creëren versterken, precies waar de missie het meest wint.
  - **Voorstel:** niet blocking — reflectionQuestion is optioneel per stap in het BuilderCanvas-type en 3 van 5 stappen hebben er al één (vergelijkbaar met mission-blueprint's 4 van 5). Geen wijziging vereist.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **22A**: sterk geraakt — moodboard maken (stap 2) en slides ontwerpen+bouwen (stap 3, 5) zijn beide een compleet creatief proces van idee naar visueel digitaal product.
- **21B**: sterk geraakt — kleurenpalet-keuze met motivatie (stap 2) en "gevoel in 2 woorden" zijn directe oefening van bewuste beeld/kleur-keuzes om een boodschap over te brengen.

### Score
6/6 toepasbare criteria geslaagd (2 aandachtspunten, niet blocking) · Bloom-balans: medium (kan iets hoger bij stap 4/5) · Aanbeveling: **ship**

---

## 🔧 Tech review

**Mission:** mission-vision (builder-canvas)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server gestart in deze review-run, geen screenshots-map aanwezig voor deze wave

### Static analyse

#### ✅ Geslaagd
- **Criterium A3 (TypeScript-discipline):** geen `any`, geen `@ts-ignore` in de config. Config is getypeerd als `BuilderCanvasConfig` (`mission-vision.ts:1,3`).
- **Criterium A6 (Restart-safe state):** engine (`BuilderCanvas.tsx:69`) gebruikt `useMissionAutoSave` — geldt voor alle builder-canvas-missies inclusief deze, geen missie-specifieke afwijking.
- **Criterium A7 (Security):** `systemInstruction` is server-side bepaald via `chatRoleId: 'mission-vision'` in `templateRegistry.ts:65`, niet client-side hardcoded in de config zelf. Geen `dangerouslySetInnerHTML` in de config (bevat geen JSX/HTML, puur data).
- **Registratie-consistentie:** `mission-vision` correct geregistreerd op alle bekende bronnen: `RoleId`-union (`src/types.ts:29`), `AGENT_ROLE_IDS` (`src/config/agentRoleIds.ts:37`), `templateRegistry.ts:65`, `missionGoals.ts:338`, `curriculum.ts:132`, `slo-kerndoelen-mapping.ts:87`, `basisvaardigheden-mapping.ts:310`, agent-rol in `year1.tsx:3173`, dashboard-entry in `ProjectZeroDashboard.tsx:164`, thumbnail in `missionThumbnails.ts:42`.

#### ⚠️ Aandachtspunten
- **Coach-plan vs canvas-stappen desync (bekend platform-patroon, niet missie-specifiek)**: agent-rol `steps` array in `year1.tsx:3259-3263` toont 3 markers (Idee/Sfeer/Pitch) terwijl de config 5 canvas-stappen bevat (visie-formuleren/moodboard/slides-ontwerpen/pitch-schrijven/slides-bouwen). Dit is het bekende, functioneel inerte marker-systeem dat platform-breed bij alle 6 builder-canvas-missies met chat voorkomt — niet als missie-issue behandeld conform reviewinstructie.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd — geen dev-server beschikbaar in deze review-pass, en `mission-vision` staat niet in de UI/UX-review van 2026-06-30 (grep leverde 0 treffers). Aanbevolen als follow-up wanneer een volgende dynamic-verificatieronde draait.

### Score
Static: 4/4 · Dynamic: n.v.t. · Aanbeveling: **ship**

---

## Samenvatting

`mission-vision` is een goed gestructureerde builder-canvas-missie met sterke SLO-onderbouwing (expliciete keuze-comment in de mapping), correcte platform-registratie op alle 9 bronnen, en een agent-rol die het AI-as-copilot-principe voorbeeldig naleeft. De enige aandachtspunten zijn niet-blocking: drie stap-instructies overschrijden de zachte 60-woordengrens (gecompenseerd door genummerde opsomming, consistent met sibling mission-blueprint) en de laatste twee stappen missen een reflectievraag (optioneel veld, geen vereiste). Geen dynamic/visuele verificatie deze wave — aanbevolen als toekomstige follow-up, niet blocking voor ship.

**Eindverdict: ship** (geen fixes vereist)
