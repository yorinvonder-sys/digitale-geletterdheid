# Missie-review: datalekken-rampenplan (wave 19)

**Datum:** 2026-07-02
**Levering:** dedicated component (`src/features/missions/DatalekkenRampenplanMission.tsx`, 915 regels)
**Curriculum-plek:** Leerjaar 1, Periode 3 (naast cookie-crusher, mail-detective, filter-bubble-breaker)
**SLO-claim:** `23A` (Veiligheid & privacy), `21A` (Digitale systemen) · VSO: `20A`, `18A`
**Reviewer:** general-purpose sub-agent (Sonnet), drie rubrics gecombineerd

---

## Samenvatting

Dit is één van de sterkste missies in de codebase (UI/UX-audit 2026-06-30 gaf de hoogste score, 4.25/5, van alle 109 missies). Vier fasen (bewijsanalyse → prioriteiten → crisisbrief → budget), elk met exact narekenbare scoring-logica, correcte AVG-feiten en een sterke SLO-fit. Twee kleine toegankelijkheidsgaten en één didactische lacune (BSN-framing) zijn de enige aandachtspunten — geen blocking issues.

---

## 🎨 Design review

**Mission:** datalekken-rampenplan (handcrafted)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (Tokens):** uitsluitend `duck-*` tokens (`duck-bg`, `duck-ink`, `duck-acid`, `duck-gray`, `duck-error`), geen hex-literals, geen legacy `lab-*` — volledig gemigreerd
- **Criterium 2 (Layout):** N.v.t. (handcrafted, geen template-baseline)
- **Criterium 4 (Copy-lengte):** intro-description 21 woorden (grens leerjaar 1: <80) — `DatalekkenRampenplanMission.tsx:690`; fase-beschrijvingen 35-50 woorden elk (grens: <60) — allemaal ruim binnen grens
- **Criterium 5 (Responsive):** `max-w-sm`/`max-w-lg`/`max-w-3xl` + `w-full`, geen vaste pixel-widths, `pb-safe` voor mobile-safe-area — `DatalekkenRampenplanMission.tsx:718,821`
- **Criterium 6 (Framer Motion):** geen `motion.*` gebruikt — CSS-transitions (`transition-all duration-300`) zijn functioneel en niet overdadig

### ⚠️ Aandachtspunten
- **Criterium 3 + 7 (Knop-clarity / Toegankelijkheid)**: icon-only terug-knop zonder tekst of aria-label — `DatalekkenRampenplanMission.tsx:175`
  - **Wat:** `<button onClick={onBack} ...><ArrowLeft size={18} /></button>` heeft geen zichtbare tekst en geen `aria-label`.
  - **Waarom:** een screenreader-gebruiker hoort alleen "button" zonder functie. Twee vergelijkbare missies in dezelfde codebase lossen dit netjes op: `DataVoorDataMission.tsx` met `aria-label="Terug naar dashboard"`, `FilterBubbleBreakerMission.tsx` met een zichtbare `<span>Terug</span>` naast het icoon.
  - **Voorstel:**
    ```tsx
    // ❌ Huidig — DatalekkenRampenplanMission.tsx:175
    <button onClick={onBack} className="text-duck-ink/60 hover:text-duck-ink transition-all duration-300">
        <ArrowLeft size={18} />
    </button>

    // ✅ Voorgesteld
    <button onClick={onBack} aria-label="Terug naar dashboard" className="text-duck-ink/60 hover:text-duck-ink transition-all duration-300">
        <ArrowLeft size={18} />
    </button>
    ```
- **Criterium 7 (Toegankelijkheid — focus-state dekking)**: `focus-visible` ontbreekt op de meeste primaire CTA-knoppen — `DatalekkenRampenplanMission.tsx:299-310, 396-403, 501-513, 612-624`
  - **Wat:** alleen de eind-resultaat-knop (regel 783) en de "volgende fase"-knop (regel 903) hebben `focus-visible:ring-2`; de vier fase-submit-knoppen (Dien analyse in / Bevestig volgorde / Verstuur brief / Beveiligingsplan indienen) missen dit.
  - **Waarom:** toetsenbord-navigatie geeft geen zichtbare focus-indicator op de belangrijkste interactieknoppen per fase.
  - **Voorstel:** voeg `focus-visible:ring-2 focus-visible:ring-duck-acid` toe aan de vier submit-knoppen, consistent met regel 903.

### ❌ Blocking issues
Geen.

### Visual Precision Gate
`WARN` — geen dev-server/Chrome-plugin verificatie deze wave (geen browser-toegang toegewezen aan deze review-run). Bestaand bewijs: UI/UX-audit `docs/audits/student-missions-ui-ux-review-2026-06-30.md:122` noemt deze missie expliciet als **hoogste scorer** (4.25/5) van alle 109 missies — sterk indirect bewijs dat de visuele flow werkt, maar geen verse multi-viewport screenshot-set voor deze review.

### Score
5/7 criteria volledig PASS, 2 WARN (geen FAIL) · **Design: 8.5/10** · Aanbeveling: ship (kleine a11y-fixes optioneel)

---

## 📚 Didactiek review

**Mission:** datalekken-rampenplan (handcrafted)
**Curriculum-plek:** Leerjaar 1, Periode 3
**SLO-claim:** 23A, 21A (regulier) · 20A, 18A (VSO)
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd
- **Criterium 1 (SLO-codes):** `23A` en `21A` zijn beide geldige regulier-codes, `20A`/`18A` geldige VSO-codes — `slo-kerndoelen-mapping.ts:76`
- **Criterium 2 (SLO-fit):** sterk geraakt op beide codes. `23A` (veiligheid & privacy): fase 1 (bewijs wegen op relevantie), fase 3 (welke data mag/moet in een crisisbrief, BSN/AVG-context). `21A` (digitale systemen): fase 1 (serverlogs, brute-force, data-exfiltratie interpreteren) en fase 4 (2FA/firewall/backup-maatregelen afwegen)
- **Criterium 3 (Leerdoelen):** geen expliciet `learningObjectives`-veld (verwacht bij handcrafted), maar `missionGoals.ts:281-287` geeft een concreet, meetbaar impliciet leerdoel: *"Je crisisplan noemt wie je informeert, welke data geraakt is en welke actie eerst komt"* — voldoet aan action-verb + concreet-criterium
- **Criterium 4 (Copy-lengte):** alle copy-velden ruim binnen leerjaar-1-grenzen (zie design-review)
- **Criterium 5 (Vocabulary):** vaktermen worden consequent inline uitgelegd — "data-exfiltratie (= gegevens stiekem naar buiten kopiëren)" (regel 49), "brute-force aanval (= heel snel wachtwoorden raden)" (regel 51), "penetratietest (= laten testen hoe inbreekbaar je systeem is)" (regel 115) — precies het patroon dat onderbouw-taal vereist
- **Criterium 6 (Curriculum-plek):** logisch geplaatst na cookie-crusher/mail-detective/filter-bubble-breaker in periode 3 (digitaal burgerschap/veiligheid-thema) — `curriculum.ts:119`
- **Criterium 7 (Bloom-balans):** sterke mix — fase 1 analyseren (bewijs wegen), fase 2 evalueren (prioriteren), fase 3 creëren (brief samenstellen uit bouwstenen), fase 4 toepassen (budget-afweging) — geen pure onthoud-quiz
- **Criterium 9 (Welzijn/inclusiviteit):** VSO-mapping aanwezig, geen gender-specifieke aannames, geen sensitief-thema-trigger nodig voor dit onderwerp

### ⚠️ Aandachtspunten
- **Criterium 2/5 (SLO-fit-precisie — AVG-feit)**: BSN wordt geframed als een routinematig te vermelden datacategorie zonder het verhoogde risico te benoemen — `DatalekkenRampenplanMission.tsx:90`
  - **Wat:** `LETTER_BLOCKS[1]`: *"Het gaat om namen, e-mailadressen, cijfers en BSN-nummers van alle leerlingen."* wordt gemarkeerd als `belongsInLetter: true` met uitleg *"Verplicht — mensen moeten weten WELKE data is gelekt zodat ze zich kunnen beschermen."* Dat is op zichzelf correct (transparantieplicht), maar de missie benoemt nergens dat een BSN-lek specifiek zwaarder weegt dan naam/cijfers (identiteitsfraude-risico) — een kernfeit binnen het `23A`-kerndoel (veiligheid & privacy) dat hier didactisch onbenut blijft.
  - **Waarom:** leerlingen leren "BSN moet je noemen" maar niet "BSN-lekken zijn extra ernstig en vragen extra vervolgacties (bijv. wijzen op fraude-alertsysteem)" — een gemiste verdieping op precies het kerndoel dat deze missie claimt.
  - **Voorstel:** voeg één zin toe aan de `explanation` van dit blok, bijvoorbeeld:
    ```text
    ❌ Huidig — DatalekkenRampenplanMission.tsx:90
    explanation: 'Verplicht — mensen moeten weten WELKE data is gelekt zodat ze zich kunnen beschermen.'

    ✅ Voorgesteld
    explanation: 'Verplicht — mensen moeten weten WELKE data is gelekt. BSN-nummers zijn extra gevoelig: die kunnen worden misbruikt voor identiteitsfraude, dus dit moet met nadruk genoemd worden.'
    ```
    Niet blocking — dit is een verrijking, geen feitelijke fout.

### ❌ Blocking issues
Geen.

### SLO-fit oordeel
- **23A (Veiligheid & privacy)**: sterk geraakt — bewijs: fase 1 (bewijs wegen), fase 3 (welke gegevens/BSN-gevoeligheid), fase 4 (2FA/backups/pentest)
- **21A (Digitale systemen)**: sterk geraakt — bewijs: fase 1 (serverlogs/brute-force/exfiltratie interpreteren als systeeminbraak-signalen), fase 4 (technische maatregelen afwegen)

### Score
9/9 criteria PASS (1 verrijkings-suggestie, geen fail) · Bloom-balans: **hoog** (analyseren/evalueren/creëren/toepassen, geen pure recall) · **Didactiek: 9/10** · Aanbeveling: ship

---

## 🔧 Tech review

**Mission:** datalekken-rampenplan (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — geen dev-server/Chrome-plugin toegewezen deze wave; bestaand bewijs uit UI/UX-audit 2026-06-30 (hoogste score van alle missies) gebruikt als indirect signaal

### Static analyse

#### ✅ Geslaagd
- **A1 (Knop-handlers):** elke knop heeft een functionele `onClick` — geen dode knoppen aangetroffen in de 4 fase-componenten
- **A2 (Error/edge states):** geen async-operaties (puur lokale/localStorage-state), dus loading/error n.v.t.; wél een expliciete edge-state: "Je bent over budget! Deselecteer een maatregel." — `DatalekkenRampenplanMission.tsx:606-609`
- **A4 (Imports):** consistent via `@/hooks/useMissionAutoSave`, `@/config/missionGoals`, `@/features/missions/templates/shared/IntroScreen` — geen relatieve `../../`-paden
- **A5 (Edge functions):** n.v.t. — component doet geen AI-/edge-function-calls, puur deterministische multiple-choice/drag-order/budget-state
- **A6 (Restart-safe state):** correct gebruik van `useMissionAutoSave<DatalekkenState>('datalekken-rampenplan', INITIAL_STATE)` — `DatalekkenRampenplanMission.tsx:631-634`; hook zelf persisteert debounced naar localStorage en herstelt bij mount
- **A7 (Security):** geen `dangerouslySetInnerHTML`, geen user-vrije-tekstinvoer (alle interactie is selectie/volgorde/allocatie uit vaste opties) — geen prompt-injection-oppervlak in dit component

#### ⚠️ Aandachtspunten
- **A3 (TypeScript-discipline)**: `stats?: any; vsoProfile?: any;` op de props-interface — `DatalekkenRampenplanMission.tsx:10-11`
  - **Wat:** twee `any`-typen op de component-props.
  - **Risico:** normaliter een TS-discipline-fail, maar geverifieerd als **platform-breed contract**: exact dezelfde props-signature staat in `DataVoorDataMission.tsx:15-16`, `FilterBubbleBreakerMission.tsx:10-11`, `MLTrainerMission.tsx:19`, `NeuralNavigatorMission.tsx:27` en meer — dit is de gedeelde shape waarmee `AiLab.tsx`/`AuthenticatedApp.tsx` alle handcrafted missie-componenten aanroepen. Een missie-specifieke fix hier zou de props-contract met de shell breken zonder een bredere refactor.
  - **Voorstel:** geen actie op missie-niveau — dit is een platform-conventie (analoog aan de al bekende dormante-chat- en briefing-asset-patronen), geen missie-specifiek defect. Vermelden als context, niet als fail.

#### ❌ Blocking issues
Geen.

### Dynamic verificatie
Niet uitgevoerd deze wave (geen browser-toegang). Indirect bewijs: `docs/audits/student-missions-ui-ux-review-2026-06-30.md:122` classificeert `datalekken-rampenplan` als beste missie van het hele platform (4.25/5) — sterk signaal dat de vier-fasen-flow, scoring-feedback en eindscherm functioneel correct renderen op alle geteste viewports in die eerdere audit-ronde.

### Scoring-logica narekenen (dedicated-verplicht)
Alle vier scorefuncties zijn wiskundig geverifieerd:
- `scoreEvidence`: 4 relevante bewijsstukken van 6, max 25pt bij alle 4 correct + 0 incorrect — klopt
- `scorePriorities`: 6 acties, exacte positie = 1pt, ±1 positie = 0.5pt bonus, max 25pt bij perfecte volgorde — klopt
- `scoreLetter`: 5 correcte blocks van 8, max 25pt bij alle 5 correct + 0 incorrect — klopt
- `scoreBudget`: `bestRealistic = 13` geclaimd als optimum binnen €10.000 — **onafhankelijk herberekend via brute-force over alle 32 deelverzamelingen van de 5 budget-items: bevestigd, 2FA+Training+Pentest (effectiveness 5+4+4=13, kosten €9.500) is het daadwerkelijke wiskundige optimum.** Geen bug.
- Max haalbare eindscore: 25+25+25+25 = 100/100, consistent met de badge-drempels (≥80 Crisis Commander, ≥55 Noodplan Specialist, <55 Trainee) — logisch verdeeld

### Score
Static: 6/7 criteria PASS (1 context-noot, geen fail) · Dynamic: n.v.t. (indirect bewijs positief) · **Tech: 9/10** · Aanbeveling: ship

---

## Platform-brede context (niet als missie-issue gerekend)
- Dormante chat: de agent-rol (`year1.tsx:2809`) en server-side `systemInstructions.ts:38` zijn volledig uitgewerkt (3-stappenmethode, XP-farm-detectie, welzijnsprotocol, STEP_COMPLETE-markers), maar de kernmissie draait op het dedicated component — de chat is nooit de hoofdroute. Bekend platform-patroon, niet herhaald als bevinding.
- Briefing-asset hergebruik: `briefingImage: '/assets/agents/social_safeguard.webp'` in `year1.tsx` hergebruikt een asset van een andere missie — bekend platform-patroon, niet herhaald.
- `stats?: any`/`vsoProfile?: any` props: platform-breed contract over 7+ handcrafted missies, geen missie-specifiek defect.

## Escalaties
Geen — geen compliance-gevoelige feitenfout gevonden (72-uurs AP-meldplicht, prioriteitsvolgorde en BSN-transparantieplicht zijn feitelijk correct). De BSN-framing is een verrijkingssuggestie, geen fout die escalatie naar jurist/compliance vereist.

## Samenvattend oordeel
**Verdict: ok** — triageScore 1.15 (laag = weinig verbeterpotentieel nodig). Twee kleine a11y-fixes (aria-label + focus-visible) zijn autoFixable en beknopt; de BSN-verrijking is optioneel en niet blocking. Geen herontwerp, geen fix-eerst-vereiste.
