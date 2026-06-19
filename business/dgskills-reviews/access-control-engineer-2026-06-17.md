# Missie-review: `access-control-engineer` — 2026-06-17

**Template-type:** dedicated (handcrafted React-component)
**Primaire file:** `src/features/missions/AccessControlEngineerMission.tsx`
**Curriculum-plek:** Leerjaar 2, Week 2
**SLO-claim:** `21A`, `23A`, `22B` (regulier) · `18A`, `20A`, `19A` (VSO)
**Pipeline:** M4 wave-2 batch-review

---

## Screenshots

Geen bestaande screenshots in `screenshots/assignments/access-control-engineer/` — dynamische visuele verificatie overgeslagen. Fase B tech-criteria niet uitvoerbaar (DGSkills SPA is state-based, geen URL per missie). Alle visuele claims zijn static-only.

---

## 🎨 Design review

**Mission:** access-control-engineer (handcrafted)
**Reviewer:** dgskills-design-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (Tailwind tokens, missie-component):** Uitsluitend `duck-*` tokens gebruikt in het missie-component. Geen hardcoded hex in JSX, geen legacy `lab-*` tokens in `AccessControlEngineerMission.tsx`. Tokens `duck-bg`, `duck-ink`, `duck-acid`, `duck-error` zijn alle geverifieerd aanwezig in `tailwind.shared.js`. — `src/features/missions/AccessControlEngineerMission.tsx` volledig
- **Criterium 2 (Layout consistentie):** N.v.t. — handcrafted, geen template-baseline.
- **Criterium 3 (Knop-clarity):** Alle knoppen hebben functionele `onClick`-handlers en zijn voorzien van duidelijke labels of `aria-label` (navigatiepijlen hebben `aria-label="Terug"`). Touch-targets zijn overal `min-h-[44px]`. — `src/features/missions/AccessControlEngineerMission.tsx:366`
- **Criterium 5 (Responsive design):** Geen vaste pixel-widths; `max-w-2xl w-full` + `flex flex-wrap` op rol-checkboxes zorgen voor mobile-first layout. Rolbadges wrappen correct. — `src/features/missions/AccessControlEngineerMission.tsx:402`
- **Criterium 6 (Framer Motion):** Geen `motion.div` of animatie-wrappers; de coach-bubble gebruikt een Tailwind `animate-in slide-in-from-bottom-4` (standaard CSS animation, geen Motion). Geen cognitieve overload. — `src/features/missions/AccessControlEngineerMission.tsx:702`
- **Criterium 7 (Toegankelijkheid basics):** Geen `dangerouslySetInnerHTML`. Interactieve elementen hebben focus-visible ring (`focus-visible:ring-2 focus-visible:ring-duck-acid`). Coach-sluitknop heeft `aria-label="Sluit hint"`. — `src/features/missions/AccessControlEngineerMission.tsx:366, 712`

### ⚠️ Aandachtspunten

- **Criterium 3 (Hover kleur — Volgende-knop):** De "Volgende"- en "Test uitvoeren"-knoppen hebben `hover:bg-duck-ink hover:text-duck-ink`. Hover-staat resulteert in donkere tekst op donkere achtergrond (`#202023` op `#202023`): tekst wordt onzichtbaar.
  - **Wat:** `bg-duck-acid text-duck-ink transition-colors hover:bg-duck-ink hover:text-duck-ink` — dit is fout. De hover-text moet `text-white` zijn.
  - **Waarom:** Leerling ziet op hover de actie-knoptekst niet meer.
  - **Voorstel:** Zie autoFix-voorstel onder `autoFixable`.
  - Betroffen regels: `src/features/missions/AccessControlEngineerMission.tsx:498, 573, 618, 681`

- **Criterium 1 (Lab-tokens in visualPreview, year2.tsx):** De `visualPreview`-JSX in `src/config/agents/year2.tsx:2725-2746` gebruikt `lab-coral` en `lab-sage`. Dit zijn legacy-tokens buiten de whitelist van de missie-component zelf. De whitelist voor autoFix omvat `src/config/agents/year2.tsx`, maar het zijn decoratieve preview-elementen — geen UI die de leerling ervaart.
  - **Wat:** `bg-lab-coral`, `text-lab-coral`, `bg-lab-sage`, `text-lab-sage` in visualPreview.
  - **Waarom:** Niet per se kapot (tokens bestaan), maar onwenselijk voor consistentie. Niet blocking.
  - **Voorstel:** Vervang bij gelegenheid door `duck-acid`, `duck-ink`, `duck-error` voor thematische coherentie. Niet autoFixable (buiten missie-flow, decoratief).

- **Criterium 7 (Coach-icon kleur):** De coach-bubble bevat `<MessageCircle size={16} className="text-duck-ink" />` op een `bg-duck-ink`-achtergrond (`w-8 h-8 bg-duck-ink rounded-full`): icon is onzichtbaar.
  - **Wat:** `src/features/missions/AccessControlEngineerMission.tsx:704-705` — donker icon op donkere achtergrond.
  - **Voorstel:** Verander `text-duck-ink` naar `text-duck-acid` of `text-white`. AutoFixable.

- **Visual Precision Gate:** WARN — statische analyse toont geen overlap/alignment-issues in de flow, maar de hover-kleur-bug en het onzichtbare coach-icon zijn visuele tekortkomingen die pas zichtbaar worden in interactie. Dynamische verificatie ontbreekt (geen dev-server). Claims zijn unverified voor multi-viewport.

### ❌ Blocking issues

Geen blocking issues (hover-kleur is een warning-niveau UX-bug, geen blocker).

### Score

5/7 criteria geslaagd (Criterium 2 N.v.t.) · Aanbeveling: **fix-eerst**

---

## 📚 Didactiek review

**Mission:** access-control-engineer (handcrafted)
**Curriculum-plek:** Leerjaar 2, Week 2
**SLO-claim:** `21A` Digitale systemen · `23A` Veiligheid & privacy · `22B` Programmeren · VSO: `18A`, `20A`, `19A`
**Reviewer:** dgskills-didactiek-reviewer (Sonnet)

### ✅ Geslaagd

- **Criterium 1 (SLO-codes correct):** Codes zijn geldig. `21A` (digitale systemen — systeembeheer), `23A` (veiligheid & privacy — AVG/toegangscontrole), `22B` (programmeren — zie discussie onder SLO-fit). VSO-codes `18A`, `19A`, `20A` zijn valide. — `src/config/slo-kerndoelen-mapping.ts:118`
- **Criterium 3 (Leerdoelen helder):** `MISSION_GOAL.primaryGoal` ("Ik beveilig het schoolsysteem door onveilige toegangsregels te vinden, te verbeteren en te testen.") is concreet in eerste persoon. Criteria-string beschrijft de drie stappen. Evidence-field aanwezig. — `src/features/missions/AccessControlEngineerMission.tsx:60-68`
- **Criterium 5 (Leeftijds-passend vocabulary):** Taal is herkenbaar (schoolsysteem, cijfers, rooster), geen academisch jargon zonder uitleg. "principle of least privilege" wordt in de agent-instructie uitgelegd via metafoor (sleutels). VSO-taalvariant aanwezig op stap 1 (`isVso`-branch). — `src/features/missions/AccessControlEngineerMission.tsx:415-421`
- **Criterium 6 (Curriculum-plek logisch):** Week 2 Leerjaar 2, samen met `wachtwoord-warrior` en `privacy-by-design`. Logische verdieping op privacy/veiligheidsthema. — `src/config/curriculum.ts:185-190`
- **Criterium 8 (AI-as-copilot):** Missie heeft geen `enableChat: true` in de component-flow — de Security Coach verschijnt als contextual hint-bubble, niet als vrije-chat AI. Geen XP-farming-risico via chatbot. — `src/features/missions/AccessControlEngineerMission.tsx:700-720`
- **Criterium 9 (Welzijn & inclusiviteit):** VSO-mapping aanwezig. Geen gevoelige onderwerpen (geen pesten, zelfbeeld etc.). Taalgebruik gender-neutraal. — `src/config/slo-kerndoelen-mapping.ts:118`

### ⚠️ Aandachtspunten

- **Criterium 2 (SLO-fit — 22B Programmeren):** De claim op `22B` (Programmeren) is zwak. De missie vraagt leerlingen om _rollen aan/uit te zetten via checkboxes_ — er wordt geen code geschreven, geen logica ontworpen, geen pseudocode of programmeerconcept actief geoefend. Het principe van toegangscontrole is relevant voor programmeurs maar het _oefenen_ van 22B vereist meer.
  - **Wat:** Stap 2 (rechten instellen) is een checkbox-UI, geen programmeeractivity. — `src/features/missions/AccessControlEngineerMission.tsx:519-557`
  - **Waarom:** Opgelegde 22B-claim zonder substantiële programmeeractivity maakt de SLO-rapportage voor docenten onbetrouwbaar.
  - **Voorstel:** Verwijder `22B` uit `sloKerndoelen` en vervang door `23C` (Maatschappij — digitale veiligheid als maatschappelijk thema) of behoud `22B` alleen als er een expliciete programmeer-/logica-opdracht wordt toegevoegd (bv. een simpel conditie-raden in pseudocode). Escalatie voor curriculaire beslissing — niet autoFixable.

- **Criterium 4 (Cognitieve load — Stap 2):** Stap 2 toont 6 resources tegelijk met 4 rollen elk = 24 toggle-buttons op één scherm. Voor leerjaar 2 (max 3-4 keuzes per scherm) is dit aan de hoge kant.
  - **Wat:** `RESOURCES.length` = 6 × 4 rollen = 24 knopjes. — `src/features/missions/AccessControlEngineerMission.tsx:519`
  - **Waarom:** Risico op overwhelm bij jongere leerlingen; het VSO-profiel maakt het niet lichter.
  - **Voorstel:** Overweeg de 6 resources op te splitsen in 2 sub-stappen (3 + 3), of prioriteer de 3 meest relevante resources als verplicht en maak de andere 3 optioneel. Niet autoFixable (structureel).

- **Criterium 7 (Bloom-balans):** Stap 1 = Onthouden/Begrijpen (regels herkennen), Stap 2 = Toepassen (rechten instellen), Stap 3 = Analyseren (testscenario's evalueren). Balans is goed. Enkel aandachtspunt: de coach-hints `stap2_start` en `stap2_teveel_rechten` zijn gedefinieerd maar worden **nooit aangeroepen** — de didactische scaffolding voor Stap 2 is daardoor dood code.
  - **Wat:** `COACH_HINTS.stap2_start` en `stap2_teveel_rechten` worden niet door `getCoachHint()` aangeroepen. — `src/features/missions/AccessControlEngineerMission.tsx:225-232, 317-320`
  - **Waarom:** Leerlingen die te veel rechten geven (bijv. gast = admin) krijgen geen feedback tijdens het instellen.
  - **Voorstel:** Voeg in `updateToegangsRegel()` een controle toe: als `rollen.includes('gast') && rollen.length >= 3`, trigger `getCoachHint('stap2_teveel_rechten')`. AutoFixable (lokale logica-toevoeging).

### ❌ Blocking issues

Geen blocking issues. De 22B-claim is een curriculaire escalatie, geen showstopper voor de leerling-ervaring.

### SLO-fit oordeel

- **21A (Digitale systemen):** sterk geraakt — leerling werkt met rol-gebaseerd toegangsmodel van een schoolsysteem, begrijpt systeemcomponenten (gebruiker, resource, rechten).
- **23A (Veiligheid & privacy):** sterk geraakt — expliciete AVG-verbinding in agent-instructie, privacy-casussen (cijfers, wachtwoorden), principle of least privilege.
- **22B (Programmeren):** oppervlakkig / mismatch — leerling past UI-toggles aan, schrijft geen code en ontwerpt geen logica. Claim riskant.
- **VSO 18A/19A/20A:** aannemelijk, parallelle claims volgen zelfde structuur als 21A/22B/23A; VSO-taalvariant aanwezig.

### Score

7/9 criteria geslaagd · Bloom-balans: medium-hoog (Onthouden → Toepassen → Analyseren) · Aanbeveling: **fix-eerst**

---

## 🔧 Tech review

**Mission:** access-control-engineer (handcrafted)
**Reviewer:** dgskills-tech-reviewer (Sonnet)
**Dynamic verificatie:** overgeslagen — DGSkills SPA is state-based (geen URL per missie). Multi-viewport visuele verificatie niet uitgevoerd.

### Static analyse

#### ✅ Geslaagd

- **A1 (Knop-handlers):** Alle `<button>` elementen hebben functionele `onClick`-handlers. Geen lege handlers gevonden. — `src/features/missions/AccessControlEngineerMission.tsx` volledig gescand
- **A2 (Error states):** Missie is puur client-side (geen async/edge function calls). Geen async-operaties aanwezig, dus loading/error states zijn niet van toepassing. State is volledig lokaal + autosave.
- **A3 (TypeScript-discipline):** Geen `any` types, geen `@ts-ignore`. Alle interfaces zijn expliciet gedefinieerd (`User`, `Regel`, `ToegangsRegel`, `TestScenario`, `MissionState`, `Props`). — `src/features/missions/AccessControlEngineerMission.tsx:11-58`
- **A4 (Imports via `@/*` alias):** `useMissionAutoSave` geïmporteerd via `@/hooks/useMissionAutoSave`. `MissionGoalBanner` en types via relatief pad (`./templates/shared/...`) — dit is consistent met andere mission-componenten in dezelfde directory (acceptabel pattern). — `src/features/missions/AccessControlEngineerMission.tsx:3-5`
- **A5 (Edge function calls):** Geen edge function calls aanwezig. Missie is volledig client-side. N.v.t.
- **A6 (Restart-safe state):** `useMissionAutoSave<MissionState>('access-control-engineer', {...})` aanwezig. `clearSave()` aangeroepen bij voltooiing. — `src/features/missions/AccessControlEngineerMission.tsx:267-276, 349-352`
- **A7 (Security):** Geen user-input die naar AI gaat. Geen `dangerouslySetInnerHTML`. Missie-state bevat geen persoonsgegevens. Coach-hints zijn hardcoded strings.

#### ⚠️ Aandachtspunten

- **Ongebruikte import `Lightbulb`:** `Lightbulb` is geïmporteerd uit lucide-react maar nergens gebruikt in JSX. — `src/features/missions/AccessControlEngineerMission.tsx:2`
  - **Risico:** Geen runtime-risico; bundlegrootte-impact minimaal. TypeScript/linter warning.
  - **Voorstel:** Verwijder `Lightbulb` uit de import. AutoFixable.

- **Dode coach-hint keys `stap2_start` en `stap2_teveel_rechten`:** Twee coach-hint arrays zijn gedefinieerd maar geen enkel `getCoachHint()`-aanroep gebruikt deze keys. — `src/features/missions/AccessControlEngineerMission.tsx:225-232`
  - **Risico:** Leerling krijgt geen feedback bij problematische rechten-configuraties in Stap 2.
  - **Voorstel:** Voeg trigger toe in `updateToegangsRegel`. Zie didactiek-voorstel.

- **Scoring-logica edge case (`stap3Klaar`):** `stap3Klaar = aantalTestsGedaan >= 5 && aantalTestsCorrect >= 4`. Er zijn 6 `TEST_SCENARIOS`. Een leerling kan de missie afronden met 5 tests gedaan, 4 correct, zonder de 6e test ooit te starten. — `src/features/missions/AccessControlEngineerMission.tsx:292`
  - **Risico:** Niet kritiek maar leerling mist 1 scenario. Bewuste drempelkeuze is verdedigbaar.
  - **Voorstel:** Overweeg `>= 6` voor consistentie met volledigheid. Niet autoFixable (curriculaire beslissing).

- **`voerTestUit` gebruikt fallback op niet-geconfigureerde resource:** `state.aangepasteRegels[resource.id] ?? resource.toegestaanVoor` — als leerling stap 3 betreedt zonder stap 2 te voltooien (via step-indicator direct), worden de default-rechten gebruikt. Dit kan leiden tot verwarrende testresultaten. — `src/features/missions/AccessControlEngineerMission.tsx:333`
  - **Risico:** Lichte UX-verwarring; geen data-integriteitsrisico.
  - **Voorstel:** Voeg een guard toe in stap 3 die waarschuwt als `aantalRegelsIngesteld < 4`. Niet autoFixable (UX-beslissing).

#### ❌ Blocking issues

Geen blocking issues.

### Dynamic verificatie

Niet uitgevoerd — DGSkills SPA is state-based (geen URL per missie). Voor automatische Fase B is een dev-preview route (bv. `/dev/mission/access-control-engineer` met auth-bypass in `import.meta.env.DEV`) een follow-up taak.

### Score

Static: 7/7 · Dynamic: n.v.t. · Aanbeveling: **fix-eerst**

---

## Samenvatting

`access-control-engineer` is een didactisch goed doordachte handcrafted missie met solide structuur: drie-stappenflow (analyseren → instellen → testen), duidelijke leerdoelen, concrete schoolcontext, en goede TypeScript-discipline. De missie levert een positieve leerervaring op 23A (veiligheid & privacy) en 21A (digitale systemen).

**Kritieke bevindingen:**

1. **`missionGoals.ts` entry ontbreekt** (autoFixable) — missie heeft geen entry in de globale goals-registry. De component-lokale `MISSION_GOAL` vult dit grotendeels op, maar de registry is de bron van waarheid voor teacher-reporting.
2. **Hover-kleur bug** (autoFixable) — meerdere CTA-knoppen: `hover:bg-duck-ink hover:text-duck-ink` = onzichtbare tekst op hover.
3. **Coach-icon onzichtbaar** (autoFixable) — `text-duck-ink` op `bg-duck-ink` achtergrond.
4. **Ongebruikte import `Lightbulb`** (autoFixable) — verwijderen.
5. **SLO `22B` claim zwak** (escalatie) — geen echte programmeeractivity in de missie.
6. **Dode coach-hints Stap 2** (warning) — `stap2_start` / `stap2_teveel_rechten` worden nooit getriggerd.

---

## Escalatie-lijst

- **Curriculair/SLO:** `22B` Programmeren-claim is een mismatch. Advies: verwijder of vervang door `23C` of voeg expliciete programmeeractiviteit toe. Beslissing bij Yorin.
- **Cognitieve load Stap 2:** 24 toggle-buttons voor leerjaar 2 is boven de aanbevolen cognitieve load. Structurele ingreep nodig (niet autoFixable).
- **Visual Precision Gate:** WARN (unverified) — dynamische verificatie vereist een dev-preview route.
