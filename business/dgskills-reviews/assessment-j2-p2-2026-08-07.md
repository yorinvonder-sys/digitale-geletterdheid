# Review: Periodetoets `assessment-j2-p2` (leerjaar 2, periode 2)

Datum: 2026-08-07

## 1. Bereikbaarheid

- `assessmentRegistry.ts:53` registreert `'assessment-j2-p2': { config: J2P2_CONFIG, tasks: J2P2_ASSESSMENT }` — bestaat en levert correcte inhoud.
- `curriculum.ts:202` zet `assessmentId: 'assessment-j2-p2'` op periode 2. Dit veld wordt echter **nergens gelezen** om een selecteerbare rol/missie voor de leerling te bouwen: `missionBuilder.tsx:277-292` (`buildMissionsForPeriod`) bouwt de zichtbare missielijst uitsluitend uit `periodConfig.reviewMissions` (hier `['code-review-2']`, `curriculum.ts:198-200`) en `periodConfig.missions`. `assessmentId` wordt alleen doorgezet naar de `school_containers`-tabel (`containerService.ts:197`, `:353`) zonder dat een consument dat veld ooit terugleest (geen enkele treffer buiten `curriculum.ts`/`containerTypes.ts`/`containerService.ts`).
- De leerling bereikt de toets in de praktijk dus via de legacy-id `code-review-2` (`assessmentRegistry.ts:57`, `'code-review-2': { config: J2P2_CONFIG, tasks: J2P2_ASSESSMENT }`), die toevallig naar dezelfde inhoud wijst. Content komt aan, maar:
  - de kaart/rol toont de titel van de `code-review-2`-rol ("Code Review"), niet "Periodetoets 2";
  - de letterlijke id `assessment-j2-p2` is een verweesd, ongebruikt eiland.
- Dit is **niet** identiek aan de L1P4-bug (daar wees de toets naar verkeerde/foute inhoud) — de inhoud hier klopt. Het is wel hetzelfde risicopatroon: bedrading die alleen toevallig werkt via een tweede, niet-gedocumenteerde route. Verwijdert een toekomstige opschoning de `code-review-2`-legacy-mapping (bijvoorbeeld omdat iemand aanneemt dat `assessmentId` de echte route is), dan wordt de toets stil onbereikbaar.

**Bevinding (warning):** ontkoppel `assessmentId` van `reviewMissions`, of laat `buildMissionsForPeriod` daadwerkelijk `periodConfig.assessmentId` gebruiken zodat er één bron van waarheid is.

## 2. SLO-dekking vs. getoetste stof

Claim (`slo-kerndoelen-mapping.ts:127`): `21A, 22A, 22B, 23A`.

Periode 2 missies (`curriculum.ts:182-196`): algorithm-architect, web-developer, network-navigator, app-prototyper, bug-hunter, automation-engineer, code-reviewer, privacy-by-design, wachtwoord-warrior, wachtwoord-fortress, access-control-engineer.

Daadwerkelijke toetsvragen (`j2p2Assessment.ts`):
1. **Bug Hunter** (regel 27-58): off-by-one bug in sorteeralgoritme → programmeerlogica/debuggen.
2. **Debug Procedure** (regel 63-80): juiste volgorde van debugstappen → debuggen.
3. **Concept Matcher** (regel 85-109): variabele/loop/conditie/functie koppelen aan definitie → basisprogrammeerconcepten.

Alle drie de vragen toetsen uitsluitend **22A/22B** (programmeren, algoritmisch denken, code lezen/debuggen).

**Niet getoetst, ondanks SLO-claim:**
- **21A** (systemen/netwerken) — hoort bij `network-navigator`, `automation-engineer`, `access-control-engineer`. Geen enkele vraag raakt netwerken of systemen.
- **23A** (digitale veiligheid/privacy) — hoort bij `privacy-by-design`, `wachtwoord-warrior`, `wachtwoord-fortress`, `access-control-engineer`. Geen enkele vraag raakt wachtwoorden, toegangsrechten of privacy-by-design.

Dat betekent dat **5 van de 11 missies** in deze periode (network-navigator, privacy-by-design, wachtwoord-warrior, wachtwoord-fortress, access-control-engineer) helemaal niet terugkomen in de periodetoets, terwijl de SLO-claim wél 21A en 23A dekt.

**Bevinding (blocking):** SLO-claim `21A`/`23A` in `slo-kerndoelen-mapping.ts:127` is niet gedekt door de toetsvragen. Voeg minimaal één vraag per ontbrekend kerndoel toe (bijv. een netwerk-scenario voor 21A, een wachtwoord/toegangsrechten-scenario voor 23A), of verwijder die kerndoelen uit de claim totdat de toets ze daadwerkelijk toetst.

## 3. Meet de scoring iets?

- `AssessmentEngine.tsx` telt per taak alles-of-niets XP (`handleTaskComplete`, regel 80-97) en weegt dat automatische deel voor 60% mee (`hybridConfig.autoWeight = 0.6`, `j2p2Assessment.ts:11`), docent voor 40%.
- **Onbeperkte pogingen zonder afstraffing:**
  - `InspectorTask.tsx:15-27` (Bug Hunter, hotspot-klik): bij een foute hotspot wordt na 2,5s alleen de feedback weggehaald (`setTimeout(() => setShowFeedback(null), 2500)`), zonder puntenaftrek, foutenteller of poginglimiet. Met slechts **3 hotspots** vindt een leerling de juiste altijd binnen maximaal 2 foute pogingen, puur door te elimineren.
  - `RescuerTask.tsx:27-42` (Debug Procedure): bij een foute volgorde (`result === 'fail'`) kan de leerling via `handleReset` (regel 39-42) onbeperkt opnieuw proberen, zonder cap.
  - `SimulatorTask.tsx:34-61` (Concept Matcher): een foute drop toont alleen `'❌ Dat hoort daar niet thuis!'` (regel 58) en het item blijft beschikbaar voor een nieuwe poging, onbeperkt.
- Gevolg: het automatische deel van de score (60% gewicht) meet in de praktijk niet "begrijpt de leerling dit", maar "heeft de leerling genoeg geduld om te blijven proberen" — succes is voor elke leerling uiteindelijk gegarandeerd zolang hij niet stopt. Dit ondermijnt precies de functie van een periodetoets.

**Bevinding (blocking):** voeg een poginglimiet of scoreafslag per foute poging toe aan `InspectorTask`, `RescuerTask` en `SimulatorTask` (gedeeld door alle periodetoetsen die deze engine gebruiken, dus fix op enginenniveau), zodat de automatische score daadwerkelijk onderscheid maakt tussen begrip en trial-and-error.

## 4. Vraagkwaliteit

- Alle drie de vragen zijn eenduidig geformuleerd met precies één juist antwoord (`correct: true` op exact één hotspot/sequentie/koppel-set).
- Taalniveau past bij 13-14 jaar (mavo/havo/vwo leerjaar 2).
- Geen overlap tussen vragen; geen weggevertjes in de vraagtekst zelf.
- Geen blocking bevindingen op dit punt.

## 5. Toegankelijkheid en leesbaarheid

- **Toetsenbordbediening (blocking-niveau a11y):** `SimulatorTask.tsx` (Concept Matcher, regel 89-121) gebruikt kale HTML5 drag-and-drop (`draggable`, `onDragStart`, `onDrop`) zonder enig toetsenbord-alternatief — geen `tabIndex`, geen `onKeyDown`, geen ARIA drag-and-drop-pattern (`aria-grabbed`/`aria-dropeffect` of een klik-gebaseerd alternatief zoals bij de andere twee opdrachten). Een leerling die niet kan slepen (motorische beperking, alleen toetsenbord) kan deze opdracht — 100 van 270 XP, 37% van het gewicht — niet voltooien. Dit is WCAG 2.1.1 (Toetsenbord): een harde fail, geen suboptimale styling.
- **Contrast (berekend, niet geschat):** `InspectorTask.tsx:322-330`, het feedback-bericht (`<p className="font-medium">{message}</p>`) toont witte tekst op `bg-lab-coral` (`#D97848`, uit `tailwind.config.js:25`). Berekende contrastratio wit/#D97848 ≈ **3.12:1**. Dat voldoet niet aan WCAG AA voor normale tekst (eis 4.5:1). De titel erboven (`text-xl font-bold`, groot genoeg om als "grote tekst" te tellen, drempel 3:1) haalt de eis nét wel; de berichttekst (normale grootte) niet.
- `aria-label="Missie verlaten"` op de exit-knop (`AssessmentEngine.tsx:356`) is aanwezig en correct.

**Bevindingen (warning):** (a) voeg een klik-/toetsenbord-alternatief toe aan `SimulatorTask` naast drag-and-drop; (b) gebruik een donkerder variant of `text-lab-coralText` (`#9D4920`, al gedefinieerd in `tailwind.config.js:42`) voor de feedbacktekst op coral-achtergrond in plaats van wit.

## Verdict

**fix-eerst.** Twee blocking issues (SLO-dekkingsgat op 21A/23A; scoring meet niets door onbeperkte pogingen zonder afstraffing) plus een niet-blocking maar risicovolle bedradingsvondst (verweesde `assessmentId` vs. werkende `code-review-2`-legacy-route) en twee a11y-warnings (drag-and-drop zonder toetsenbord, contrast feedbackbericht).
