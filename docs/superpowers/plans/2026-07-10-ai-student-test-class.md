# AI Student Test Class Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bouw een veilig, herhaalbaar AI-testklasje dat DGSkills-missies via de echte leerlingroute uitvoert met configureerbare leerlingpersona’s en per run technisch, UX-, taal-, didactisch en omzeilingsbewijs rapporteert.

**Architecture:** Behoud `scripts/chrome-student-simulator.mjs` tijdelijk als legacy referentie, maar bouw de nieuwe runner modulair onder `tests/ai-students/` met de reeds aanwezige Playwright-library. Persona-configuratie, semantische missieobservatie, besluitvorming, browserbesturing, evaluatie en rapportage krijgen afzonderlijke interfaces; de eerste adapter ondersteunt `ScenarioEngine` en de eerste proef gebruikt `mail-detective`.

**Tech Stack:** Node.js 22 ESM, Playwright 1.60, React 19, TypeScript 6, Vite 8, Supabase Auth/Postgres/RLS, Vercel, JSON Schema, Node `node:test`.

## Global Constraints

- Gebruik uitsluitend een aantoonbare staging- of lokale testomgeving en fictieve accounts onder een QA-school.
- Gebruik geen persoonsgegevens van echte leerlingen en schrijf geen secrets naar code, logs, screenshots of rapporten.
- Voer geen destructieve databaseacties uit; de runner gebruikt alleen normale leerlingacties en readback met de eigen sessie.
- Wijzig geen auth, rollen, RLS, databasebeleid, productieconfiguratie, leerdoelen, normeringen, scores of inhoudelijke antwoordmodellen zonder aparte menselijke beoordeling.
- Push nooit rechtstreeks naar `main`; werk op `feat/ai-student-test-class` en houd commits per zelfstandig testbare taak klein.
- Voeg geen betaalde afhankelijkheid toe. Gebruik de bestaande `playwright` dependency en Node-standaardbibliotheek.
- Deterministische regressietests zijn standaard; eventuele modelgestuurde analyses zijn optioneel en nooit vereist voor de vaste CI-smoke.
- Rapporteer objectieve bevindingen apart van simulaties, inschattingen en punten die echte leerlingen moeten valideren.
- Browserbewijs omvat desktop, iPad portrait, iPad landscape en mobile wanneer een missie of productwijziging wordt beoordeeld.

---

## Fase 1: bevindingen uit de repository-inspectie

### Project en runtime

- Frontend: React `19.2.3`, TypeScript `6.0.3`, Vite `8.0.16`, Tailwind `3.4.17`, Framer Motion en enkele Three.js-componenten.
- Backend/data: Supabase Auth, Postgres/RLS, Realtime en Edge Functions. Client-AI loopt via server-side Edge Functions.
- Hosting: Vercel met `npm run build:prod`; publieke routes worden na Vite geprerenderd.
- Hoofdroute: `src/main.tsx` → `src/app/App.tsx` → `src/app/AppRouter.tsx` → `src/app/AuthenticatedApp.tsx`.
- Rollen: `student`, `teacher`, `admin`, `developer`; alleen server-set `app_metadata.role` wordt vertrouwd.
- Missies: 81 template-registraties, 12 dedicated missies en 105 agent/mission-id’s met overlap. Templateflows staan onder `src/features/missions/templates/`.
- Voortgang: missiestate wordt per gebruiker lokaal opgeslagen door `src/hooks/useMissionAutoSave.ts`; algemene voltooiing loopt vanuit `AuthenticatedApp.tsx` via `users.stats`, XP en `student_activities`. `mission_progress` heeft eigen RLS en servicefuncties.

### Bestaande test- en browserinfrastructuur

- `playwright` is al een devDependency; er is geen `playwright.config.*`, Cypress, Jest of Vitest setup.
- `scripts/screenshot-all-assignments.mjs` gebruikt Playwright direct voor visuele screenshots.
- `scripts/chrome-student-simulator.mjs` is een 7.372-regelige CDP-runner met missie-specifieke klikpaden, vier viewports, fictieve Supabase-login, screenshots, consolelogging, persistence-readback en JSON/Markdown-uitvoer.
- De bestaande simulator kent alleen losse labels zoals `diligent` en `struggling`; gedrag is verspreid door de missiecode en vaak gebaseerd op hardgecodeerde juiste antwoorden.
- De simulator zet `Network.enable` aan, maar registreert geen `requestfailed`, HTTP 4xx/5xx of responsemetadata.
- De simulator verwacht meerdere `data-qa` selectors die op de huidige `main` niet in de ScenarioEngine-componenten aanwezig zijn. Daardoor is de legacy playthrough niet betrouwbaar als huidige regressietest.
- Rapportage bevat nog niet het gevraagde issue-schema, ernstniveaus, cross-persona-deduplicatie of het onderscheid objectief/simulatie/menselijke validatie.
- Het standaardscreenshotpad in de legacy runner bevat een absolute lokale gebruikersmap en moet in de nieuwe runner verdwijnen.

### Staging, accounts en database

- Er bestaat een remote branch `staging`, maar die staat op een commit van 1 juni 2026 en wijkt sterk af van `main` van 4 juli 2026. Deze branch is geen veilige basis voor de nieuwe feature zonder eerst deployment en actualiteit te bevestigen.
- De repository documenteert lokale productiepreviews op `http://127.0.0.1:4173` met disposable Supabase-QA-data en ondersteunt optioneel een beschermde Vercel-preview via `QA_VERCEL_SHARE`/`QA_VERCEL_JWT`.
- Er staat geen permanente staging-URL of aparte staging-Supabaseconfiguratie in de repository.
- `supabase/config.toml` bevat één project-ref. Totdat expliciet bevestigd is dat dit een disposable testproject is, mag de AI-runner daar niet tegen schrijven.
- Bestaande QA-scripts gebruiken fictieve `example.test` accounts en credentials buiten git. Dat patroon is bruikbaar, maar de nieuwe runner moet een expliciete staging-allowlist en fail-closed guard toevoegen.
- Benodigde niet-gecommitte secrets/config: `QA_ORIGIN`, `QA_SUPABASE_URL`, `QA_SUPABASE_ANON_KEY`, `AI_STUDENT_CREDENTIALS_PATH`; optioneel `QA_VERCEL_SHARE` of `QA_VERCEL_JWT`. Een service-role key hoort niet in de runner.

### Logging en CI/CD

- Applicatielogging gebruikt consolemeldingen, consent-gated analytics, `student_activities`, `audit_logs` en web-vitals.
- `.gitignore` sluit `.env*`, browserrapporten, `test-results/` en screenshots uit; runtime-artifacts kunnen dus veilig buiten git blijven.
- GitHub Actions bevat: performance CI op iedere PR/main, een Claude-specifieke typecheck/security/build-gate, en twee agent-bridge workflows.
- Er is geen algemene AI-student-, Playwright- of functionele missieworkflow. CI-integratie moet daarom pas na de pilot als handmatige/optionele workflow worden toegevoegd.

### Nulmeting op `main`

- `npm run context:budget`: geslaagd; werkboom was schoon.
- `node --check scripts/chrome-student-simulator.mjs`: geslaagd.
- `npm run check:mission-registration`: bestaande failure omdat `ethics-council` nog onbekend is in het checks-script, plus 35 waarschuwingen.
- `npm run check:mission-goals`: bestaande failures voor `DataDetectiveMission.tsx` en `DeepfakeDetectorMission.tsx`.
- Deze bestaande failures zijn geen onderdeel van de AI-testklas en mogen niet stil worden “meegenomen” in dezelfde PR.

### Eerste representatieve missie

Gebruik `mail-detective` voor de pilot:

- doelgroep leerjaar 1 sluit aan op 12–13 jaar;
- geen kostbare externe AI-provider nodig;
- vier rondes met selecteren, ordenen, binaire keuzes, feedback en follow-up;
- lokaal autosave, score, eindstatus en app-route-completion zijn testbaar;
- lange teksten, vaktaal en een hover-uitleg maken de missie geschikt voor Snelle Sam, Taalzwakke Tess en iPad-Iris;
- de missie is geregistreerd in curriculum, template registry, mission goals en SLO-mapping, maar heeft al bestaande registratiewaarschuwingen die het rapport als baseline moet markeren.

## Beoogde bestandsstructuur

```text
tests/ai-students/
  README.md
  cli.mjs
  config/
    devices.mjs
    run-config.mjs
  personas/
    persona.schema.json
    snelle-sam.json
    onzekere-noor.json
    letterlijke-luca.json
    afgeleide-amir.json
    digisterke-dani.json
    taalzwakke-tess.json
    ipad-iris.json
    creatieve-cheater.json
  persona/
    load-personas.mjs
  behavior/
    decision-engine.mjs
    reading-model.mjs
    seeded-random.mjs
  browser/
    auth-session.mjs
    create-context.mjs
    safety-guard.mjs
    telemetry.mjs
  missions/
    contracts.mjs
    registry.mjs
    scenario-engine.mjs
  evaluation/
    issue-builder.mjs
    language-evaluator.mjs
    rubric-evaluator.mjs
  reporting/
    report.schema.json
    aggregate.mjs
    write-report.mjs
  unit/
    persona-loader.test.mjs
    decision-engine.test.mjs
    safety-guard.test.mjs
    report-writer.test.mjs
    scenario-engine.test.mjs
docs/testing/
  ai-students.md
  ai-students-secrets.md
test-results/ai-students/
  model-routing.md
```

## Kerninterfaces

```js
// tests/ai-students/missions/contracts.mjs
/** @typedef {{id:string, kind:string, accessibleName:string, disabled:boolean, metadata?:object}} ActionCandidate */
/** @typedef {{missionId:string, stepId:string, stepIndex:number, instruction:string, bodyText:string, actions:ActionCandidate[], feedback?:object, progress?:object}} MissionObservation */

// Iedere adapter implementeert exact dit contract.
export const missionAdapter = {
  supports(missionId) {},
  async observe(page, runContext) {},
  async perform(page, action, runContext) {},
  async readOutcome(page, runContext) {},
};
```

```js
// tests/ai-students/behavior/decision-engine.mjs
/**
 * @param {{persona: object, observation: object, history: object[], seed: string}} input
 * @returns {{actionId:string, reasonCode:string, confidence:number, delayMs:number, flags:string[]}}
 */
export function decideNextAction(input) {}
```

```js
// tests/ai-students/evaluation/issue-builder.mjs
export function createIssue({
  missionId, personaId, stepId, category, severity, description,
  expected, actual, learnerImpact, reproduce, evidence, recommendation,
  confidence, evidenceType, requiresHumanValidation, pedagogicalImpact,
}) {}
```

## Task 1: Veilige CLI-basis en configuratie

**Files:**
- Create: `tests/ai-students/cli.mjs`
- Create: `tests/ai-students/config/run-config.mjs`
- Create: `tests/ai-students/config/devices.mjs`
- Create: `tests/ai-students/browser/safety-guard.mjs`
- Test: `tests/ai-students/unit/safety-guard.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `parseRunConfig(argv, env)`, `assertSafeTarget(config)` en `DEVICE_PROFILES`.
- Consumes: geen productcode.

- [ ] **Step 1: schrijf falende safety-tests** voor localhost, expliciet toegestane Vercel-preview en afwijzing van `https://dgskills.app`, ontbrekende testmarker, niet-`example.test` accounts en een niet-QA-school.
- [ ] **Step 2: run `node --test tests/ai-students/unit/safety-guard.test.mjs`** en verwacht failures door ontbrekende modules.
- [ ] **Step 3: implementeer fail-closed configuratie** met verplichte `AI_STUDENT_ENVIRONMENT=test|staging`, `AI_STUDENT_ALLOWED_ORIGINS`, `AI_STUDENT_EXPECTED_SUPABASE_PROJECT_REF`, `AI_STUDENT_CREDENTIALS_PATH` en account/school-prefixvalidatie.
- [ ] **Step 4: voeg scripts toe**:

```json
{
  "test:ai-students": "node tests/ai-students/cli.mjs",
  "test:ai-students:unit": "node --test tests/ai-students/unit/*.test.mjs",
  "test:ai-students:pilot": "node tests/ai-students/cli.mjs --mission=mail-detective --persona=snelle-sam,taalzwakke-tess,ipad-iris"
}
```

- [ ] **Step 5: run de unit-test opnieuw** en verwacht alle safety-cases groen.
- [ ] **Step 6: commit** met `test(ai-students): add fail-closed runner configuration`.

## Task 2: Persona-schema en acht configuraties

**Files:**
- Create: `tests/ai-students/personas/persona.schema.json`
- Create: de acht gevraagde JSON-bestanden onder `tests/ai-students/personas/`
- Create: `tests/ai-students/persona/load-personas.mjs`
- Test: `tests/ai-students/unit/persona-loader.test.mjs`

**Interfaces:**
- Produces: `loadPersonas(directory)`, `loadPersona(id)` en een versieerbaar `schemaVersion: 1`.
- Consumes: het minimale gebruikersschema plus generieke gedragsgewichten tussen `0` en `1`.

- [ ] **Step 1: schrijf tests** die alle JSON-bestanden automatisch ontdekken, unieke IDs eisen, verplichte velden valideren en een tijdelijk negende persona zonder codewijziging laden.
- [ ] **Step 2: run de test** en verwacht failure omdat schema/loader ontbreken.
- [ ] **Step 3: voeg het JSON Schema toe** met de verplichte velden uit de opdracht en aanvullende generieke velden `behaviorWeights`, `preferredViewports`, `seedSalt` en `schemaVersion`.
- [ ] **Step 4: voeg alle acht persona’s toe** met uitsluitend fictieve profielinformatie; geen accountgegevens in deze bestanden.
- [ ] **Step 5: implementeer een dependencyvrije validator** die duidelijke veldpaden rapporteert en onbekende extra persona’s automatisch accepteert zolang ze schema-conform zijn.
- [ ] **Step 6: run de test** en verwacht acht ingebouwde persona’s plus de tijdelijke negende persona groen.
- [ ] **Step 7: commit** met `test(ai-students): add extensible learner personas`.

## Task 3: Modelrouting en runmanifest

**Files:**
- Create at runtime: `test-results/ai-students/model-routing.md`
- Create: `tests/ai-students/config/model-routing.mjs`
- Create: `tests/ai-students/reporting/report.schema.json`
- Test: `tests/ai-students/unit/report-writer.test.mjs`

**Interfaces:**
- Produces: `recordModelRouting(entry, runDir)` en een runmanifest zonder chain-of-thought.
- Consumes: `{task, complexity, risk, chosenModel, thinkingLevel, reason, fallback}`.

- [ ] **Step 1: schrijf een test** die het vereiste Markdownformaat en redactie van tokens/e-mailadressen controleert.
- [ ] **Step 2: implementeer append-only routingregistratie** binnen de actuele runmap en de gevraagde overkoepelende locatie.
- [ ] **Step 3: leg de standaardroutering vast**: Luna/laag voor inventarisatie en samenvoegen, Terra/gemiddeld voor persona’s en Playwright, Sol/hoog voor architectuur, auth/data en security.
- [ ] **Step 4: run de test** en controleer dat alleen zakelijke redenen worden opgeslagen.
- [ ] **Step 5: commit** met `test(ai-students): record model routing metadata`.

## Task 4: Playwrightbrowser, fictieve login en telemetry

**Files:**
- Create: `tests/ai-students/browser/create-context.mjs`
- Create: `tests/ai-students/browser/auth-session.mjs`
- Create: `tests/ai-students/browser/telemetry.mjs`
- Test: `tests/ai-students/unit/telemetry.test.mjs`

**Interfaces:**
- Produces: `createStudentContext(config, persona)`, `authenticateQaStudent(config, alias)` en `attachTelemetry(page, redactor)`.
- Telemetry retourneert `{consoleErrors, pageErrors, failedRequests, httpErrors, externalLinks, mediaErrors}`.

- [ ] **Step 1: schrijf unit-tests** voor URL/header/body-redactie en classificatie van console-, requestfailed- en 4xx/5xx-events.
- [ ] **Step 2: implementeer Playwright-contexten** met desktop, mobile, iPad portrait en iPad landscape; iPad-profielen gebruiken touch en correcte viewport/deviceScaleFactor.
- [ ] **Step 3: implementeer auth** via Supabase password grant met credentials uit een bestand buiten git en installeer de sessie vóór de app-route; rapporteer alleen accountalias, nooit e-mail, wachtwoord, JWT of anon key.
- [ ] **Step 4: implementeer telemetrylisteners** via `page.on('console')`, `page.on('pageerror')`, `page.on('requestfailed')` en `page.on('response')`.
- [ ] **Step 5: run unit-tests** en een lokale no-auth smoke tegen `/dev/mission-preview` zonder databasewrites.
- [ ] **Step 6: commit** met `test(ai-students): add Playwright session and telemetry layer`.

## Task 5: Semantische observatie en persona-besluitvorming

**Files:**
- Create: `tests/ai-students/missions/contracts.mjs`
- Create: `tests/ai-students/behavior/seeded-random.mjs`
- Create: `tests/ai-students/behavior/reading-model.mjs`
- Create: `tests/ai-students/behavior/decision-engine.mjs`
- Test: `tests/ai-students/unit/decision-engine.test.mjs`

**Interfaces:**
- Produces: het hierboven gedefinieerde `MissionObservation`- en `Decision`-contract.
- Besluitvorming mag geen correct-answer oracle gebruiken; antwoordmetadata is alleen voor evaluatie achteraf.

- [ ] **Step 1: schrijf tabeltests** waarin dezelfde observatie per persona ander gedrag oplevert: scannen, hint zoeken, letterlijk uitvoeren, teruggaan, alternatieve route, taalwoordherkenning, touch en manipulatieprobe.
- [ ] **Step 2: voeg een seedbare PRNG toe** zodat gedrag realistisch varieert maar een run met dezelfde seed reproduceerbaar is.
- [ ] **Step 3: implementeer het leesmodel** dat zichtbare instructie in persona-afhankelijke tekstdekking omzet.
- [ ] **Step 4: implementeer de decision engine** met generieke gewichten voor foutkans, twijfel, hints, backtracking, snelheid en omzeilingsprobe.
- [ ] **Step 5: run tests** en bewijs zowel variatie tussen persona’s als determinisme binnen dezelfde seed.
- [ ] **Step 6: commit** met `test(ai-students): add persona decision engine`.

## Task 6: ScenarioEngine-adapter en stabiele toegankelijke hooks

**Files:**
- Create: `tests/ai-students/missions/registry.mjs`
- Create: `tests/ai-students/missions/scenario-engine.mjs`
- Test: `tests/ai-students/unit/scenario-engine.test.mjs`
- Modify: `src/features/missions/templates/shared/IntroScreen.tsx`
- Modify: `src/features/missions/templates/shared/CompletionScreen.tsx`
- Modify: `src/features/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx`
- Modify: `src/features/missions/templates/scenario-engine/sub/OrderPriorityRound.tsx`
- Modify: `src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx`
- Modify: `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx`

**Interfaces:**
- Produces: adapter voor alle ScenarioEngine-missies via rollen/labels en stabiele `data-qa` hooks.
- Consumes: alleen zichtbare DOM-inhoud voor persona-beslissingen; bronconfig mag uitsluitend als testoracle voor score/feedbackvergelijking worden gelezen.

- [ ] **Step 1: schrijf adaptertests** op minimale HTML-fixtures voor intro, drie rondetypes, feedback, follow-up en completion.
- [ ] **Step 2: voeg semantische hooks toe** zoals `scenario-option`, `scenario-order-item`, `scenario-binary-accept`, `scenario-binary-reject`, `scenario-submit`, `scenario-next`, `scenario-reset-order` en `confirm-completion`; behoud bestaande labels en minimaal 44×44 px touchdoelen.
- [ ] **Step 3: implementeer `observe`** zodat stap, instructie, opties, feedback, score en beschikbare herstelacties worden teruggegeven.
- [ ] **Step 4: implementeer `perform`** met `getByRole`, `getByLabel` en alleen daarna `data-qa`; gebruik geen CSS-klassen of positie-index zonder semantische ID.
- [ ] **Step 5: run `node --test` en `npm run doctor`**; verwacht unit-tests en critical TypeScriptcheck groen, behoud de bekende unrelated baselinefailures.
- [ ] **Step 6: browser-smoke `mail-detective` op vier viewports** zonder auth via de dev-preview en controleer geen horizontale overflow of onbruikbare touchdoelen.
- [ ] **Step 7: commit** met `test(missions): expose stable ScenarioEngine controls`.

## Task 7: Voortgang, refresh en completion-readback

**Files:**
- Create: `tests/ai-students/browser/progress-probe.mjs`
- Test: `tests/ai-students/unit/progress-probe.test.mjs`

**Interfaces:**
- Produces: `captureProgressBefore`, `verifyRefreshRecovery`, `captureProgressAfter`.
- Readback gebruikt alleen de eigen ingelogde studenttoken en `SELECT`; geen service-role en geen delete/reset.

- [ ] **Step 1: schrijf tests** voor user-scoped localStoragekeys, refreshherstel en redactie van databasepayloads.
- [ ] **Step 2: implementeer een mid-flow refreshprobe** die vóór refresh stap/keuzes vastlegt en na refresh dezelfde of een expliciet herstelbare staat verwacht.
- [ ] **Step 3: implementeer server-readback** voor `users.stats.missionsCompleted`, `mission_progress` en `student_activities` met before/after timestamps/counts.
- [ ] **Step 4: classificeer bestaande-completion** als `preexisting` in plaats van ten onrechte als nieuw succes.
- [ ] **Step 5: run tests** en commit met `test(ai-students): verify mission progress persistence`.

## Task 8: Beoordelingskader en rapportage

**Files:**
- Create: `tests/ai-students/evaluation/issue-builder.mjs`
- Create: `tests/ai-students/evaluation/language-evaluator.mjs`
- Create: `tests/ai-students/evaluation/rubric-evaluator.mjs`
- Create: `tests/ai-students/reporting/aggregate.mjs`
- Create: `tests/ai-students/reporting/write-report.mjs`
- Test: `tests/ai-students/unit/report-writer.test.mjs`

**Interfaces:**
- Produces: per-persona `report.json`/`report.md`, runbrede `summary.json`/`summary.md` en screenshot/logverwijzingen.
- Ernst is exact `BLOCKER|HIGH|MEDIUM|LOW|OBSERVATION`.

- [ ] **Step 1: schrijf schema- en snapshottests** voor alle verplichte issuevelden en de samenvattende tabel.
- [ ] **Step 2: implementeer objectieve technische checks** voor laden, bediening, console, netwerk, media, refresh, completion en persist.
- [ ] **Step 3: implementeer heuristische UX/taal/didactiekchecks** en markeer die als `SIMULATED` of `INFERENCE` met zekerheid en human-validationflag.
- [ ] **Step 4: implementeer omzeilingschecks** die alleen de eigen fictieve sessie en testomgeving raken: directe eindroute, lokale state-manipulatie, herhaalde scoreactie en passieve inspectie van client/netwerkantwoorden.
- [ ] **Step 5: dedupliceer cross-persona-problemen** op missie, stap, categorie en kernoorzaak; verhoog geen ernst automatisch, maar markeer multi-persona-prioriteit.
- [ ] **Step 6: schrijf artifacts** naar `test-results/ai-students/<ISO-datum-tijd>/` en houd secrets/redacted payloads buiten de bestanden.
- [ ] **Step 7: run tests** en commit met `test(ai-students): add evidence-based reports`.

## Task 9: Eerste werkende proef met drie persona’s

**Files:**
- Modify: `tests/ai-students/cli.mjs`
- Create: runtime-artifacts onder `test-results/ai-students/<run>/`
- Create/modify: `docs/testing/ai-students.md`

**Interfaces:**
- Consumes: `mail-detective`, `snelle-sam`, `taalzwakke-tess`, `ipad-iris` en drie afzonderlijke fictieve stagingaccounts.
- Produces: volledige app-route-playthroughs en het eerste gezamenlijke rapport.

- [ ] **Step 1: bevestig handmatig** dat origin en Supabaseproject disposable staging zijn; stop wanneer dat niet aantoonbaar is.
- [ ] **Step 2: run unit-tests, `npm run doctor` en `npm run build:prod`** vóór browserwrites.
- [ ] **Step 3: voer Snelle Sam uit op desktop**, Taalzwakke Tess op desktop en iPad-Iris op portrait én landscape; gebruik dezelfde mission adapter maar andere decision-profielen.
- [ ] **Step 4: laat iedere run intro, alle vier rondes, feedback, refreshprobe en eindstatus bereiken**; leg console-, netwerk-, score- en persistencebewijs vast.
- [ ] **Step 5: genereer rapporten** en controleer handmatig alle BLOCKER/HIGH-bevindingen en alle screenshots op secrets.
- [ ] **Step 6: commit alleen code/docs**, niet de runtimecredentials of ongeredigeerde artifacts, met `test(ai-students): complete mail detective pilot`.

## Task 10: Alle persona’s en meerdere missies

**Files:**
- Modify: `tests/ai-students/cli.mjs`
- Modify: `tests/ai-students/missions/registry.mjs`
- Add adapters only when a template family is selected and separately reviewable.

- [ ] **Step 1: voeg alle acht persona’s toe aan de matrix** zonder persona-specifieke branches in missie-adapters.
- [ ] **Step 2: ondersteun filters** `--mission`, `--persona`, `--device`, `--seed`, `--mode=deterministic|ai-assisted` en `--report-dir`.
- [ ] **Step 3: voeg per volgende templatefamilie één adapter met eigen unit/browserbewijs toe**; begin pas na een groene ScenarioEngine-pilot.
- [ ] **Step 4: houd AI-assisted analyse opt-in** en sla prompt/response nooit met leerlinginput of secrets op.
- [ ] **Step 5: commit per templatefamilie**, niet als één omvangrijke refactor.

## Task 11: Veilige verbetercyclus en voor/na-vergelijking

**Files:**
- Create: `tests/ai-students/reporting/compare-runs.mjs`
- Test: `tests/ai-students/unit/compare-runs.test.mjs`

- [ ] **Step 1: implementeer vergelijking** op stabiele issue fingerprint, persona, missie, ernst, score, completion en regressies.
- [ ] **Step 2: laat de runner uitsluitend fixkandidaten voorstellen** wanneer zekerheid hoog, implementatierisico laag en er geen pedagogisch/auth/data-effect is.
- [ ] **Step 3: maak voor iedere gekozen productfix een apart mini-plan en commit**; inhoudelijke of pedagogische wijzigingen blijven voorstellen voor menselijke beoordeling.
- [ ] **Step 4: voer vóór en na dezelfde seeds/persona’s uit** en draai de productwijziging terug bij nieuwe regressies voor andere persona’s.

## Task 12: Documentatie, optionele CI en pull request

**Files:**
- Create: `docs/testing/ai-students.md`
- Create: `docs/testing/ai-students-secrets.md`
- Create only after pilot stability: `.github/workflows/ai-students.yml`
- Modify: `README.md` met één compacte verwijzing.

- [ ] **Step 1: documenteer lokaal en cloudgebruik**, fictieve accountprovisioning, stagingguard, artifactlocaties, kosten, beperkingen en teardown buiten de runner.
- [ ] **Step 2: documenteer secretsnamen en scope** zonder waarden; service-role is expliciet niet nodig voor normale runs.
- [ ] **Step 3: voeg een `workflow_dispatch` CI-workflow toe** voor de kostbare app-route-run en een goedkope unit/deterministische smoke voor normale PR’s, pas nadat de pilot herhaald groen is.
- [ ] **Step 4: run `npm run test:ai-students:unit`, `npm run doctor`, `npm run build:prod`, targeted browsermatrix en `git diff --check`**.
- [ ] **Step 5: controleer `git status`** op `.env`, credentials, JWT’s, screenshots en ongeredigeerde rapporten.
- [ ] **Step 6: open een draft-PR** met toevoegingen, pilotmissie/persona’s, gevonden/opgeloste/menselijke punten, reproduceercommando’s, beperkingen, modelrouting, privacy en security.

## Risicobeoordeling

| Risico | Niveau | Maatregel |
|---|---|---|
| Per ongeluk productie of echte leerlingdata raken | Rood | Fail-closed origin/project/accountguard; geen run zonder handmatig bevestigde stagingcontext |
| Auth/RLS omzeilen vanuit testcode | Rood | Alleen normale studenttoken; geen service-role; auth/RLS-wijzigingen buiten deze PR |
| Destructieve resets van voortgang | Rood | Geen deletes/resets; before/after-readback en disposable accounts/project |
| Secrets in screenshots of rapporten | Rood | Centrale redactor, artifactscan en credentials buiten git |
| Legacy simulator geeft vals vertrouwen | Geel | Nieuwe Playwrightlaag modulair; legacy runner alleen als referentie tot parity bewezen is |
| Persona’s volgen alsnog vaste juiste paden | Geel | Besluitvorming vanuit zichtbare observatie, seedbare variatie en geen answer oracle |
| Heuristische didactiek als feit rapporteren | Geel | `evidenceType`, confidence en human-validationflag verplicht |
| Browsermatrix wordt kostbaar/flaky | Geel | Unit/deterministische smoke standaard; volledige/app-route/AI-runs handmatig of gepland |
| Onbedoelde wijziging van leerdoel of normering | Rood | Productfixgate sluit content, score, normering en answer keys uit |

## Fasegate na dit plan

Fase 2 mag pas starten wanneer een disposable staging-Supabaseproject en fictieve QA-accountpool zijn bevestigd. Zonder die bevestiging mogen alleen no-auth dev-previewtests en unit-tests worden gebouwd; app-routewrites en persistencechecks blijven geblokkeerd.
