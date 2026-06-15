# DGSkills J2P1 Staging Playtest Review - 2026-06-11

## Scope

Doel van deze slice: de J2 P1 review-prerequisite `data-review` en alle hoofdmissies (`data-journalist`, `spreadsheet-specialist`, `factchecker`, `api-verkenner`, `dashboard-designer` en `ai-bias-detective`) diep uitspelen als leerling, op desktop, mobiel, iPad portrait en iPad landscape, met screenshots en Supabase-readback.

Nog niet in deze slice: teacher-dashboard visual readback, echte iPad Safari, en de volledige periodebrede securitypass. Het brede 96-opdrachten-doel blijft open.

## Target En Accounts

- Target: lokale production preview op `http://127.0.0.1:4173`, met disposable Supabase-QA-data.
- QA-school: `dgskills-qa-review-2026-06-04`.
- QA-student J2: `dgskills.qa.review0604.j2@example.test`.
- Secrets/wachtwoorden staan niet in dit rapport; credentials blijven buiten git onder `/private/tmp/dgskills-full-review-2026-06-11-0604-qa-accounts-credentials.json`.

## Commands

- `npm run build:prod`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs data-review`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs data-journalist`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs spreadsheet-specialist`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs factchecker`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs api-verkenner`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs dashboard-designer`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs ai-bias-detective`
- Chrome CDP op poort `9225`; headless Chrome met software WebGL flags.

## Screenshotmanifest

Artifacts staan buiten git onder `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/`.

| Missie | Viewport | Status | Artifactdir |
|---|---|---|---|
| `data-review` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-review-j2p1-staging-share-0611-data-review-prereq-deep-play-02-0604-reset-desktop-fixproof/` |
| `data-review` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-review-j2p1-staging-share-0611-data-review-prereq-deep-play-02-0604-reset-mobile-fixproof/` |
| `data-review` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-review-j2p1-staging-share-0611-data-review-prereq-deep-play-02-0604-reset-ipad-portrait-fixproof/` |
| `data-review` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-review-j2p1-staging-share-0611-data-review-prereq-deep-play-02-0604-reset-ipad-landscape-fixproof/` |
| `data-journalist` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-journalist-j2p1-staging-share-0611-data-journalist-deep-play-01-dataviewer-confirm-desktop-fixproof/` |
| `data-journalist` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-journalist-j2p1-staging-share-0611-data-journalist-deep-play-01-dataviewer-confirm-mobile-fixproof/` |
| `data-journalist` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-journalist-j2p1-staging-share-0611-data-journalist-deep-play-01-dataviewer-confirm-ipad-portrait-fixproof/` |
| `data-journalist` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/data-journalist-j2p1-staging-share-0611-data-journalist-deep-play-01-dataviewer-confirm-ipad-landscape-fixproof/` |
| `spreadsheet-specialist` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/spreadsheet-specialist-j2p1-staging-share-0611-spreadsheet-specialist-deep-play-01-desktop-fixproof/` |
| `spreadsheet-specialist` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/spreadsheet-specialist-j2p1-staging-share-0611-spreadsheet-specialist-deep-play-01-mobile-fixproof/` |
| `spreadsheet-specialist` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/spreadsheet-specialist-j2p1-staging-share-0611-spreadsheet-specialist-deep-play-01-ipad-portrait-fixproof/` |
| `spreadsheet-specialist` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/spreadsheet-specialist-j2p1-staging-share-0611-spreadsheet-specialist-deep-play-01-ipad-landscape-fixproof/` |
| `factchecker` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/factchecker-j2p1-staging-share-0611-factchecker-deep-play-02-scenario-hooks-desktop-fixproof/` |
| `factchecker` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/factchecker-j2p1-staging-share-0611-factchecker-deep-play-02-scenario-hooks-mobile-fixproof/` |
| `factchecker` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/factchecker-j2p1-staging-share-0611-factchecker-deep-play-02-scenario-hooks-ipad-portrait-fixproof/` |
| `factchecker` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/factchecker-j2p1-staging-share-0611-factchecker-deep-play-02-scenario-hooks-ipad-landscape-fixproof/` |
| `api-verkenner` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/api-verkenner-j2p1-staging-share-0611-api-verkenner-deep-play-01-desktop-fixproof/` |
| `api-verkenner` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/api-verkenner-j2p1-staging-share-0611-api-verkenner-deep-play-01-mobile-fixproof/` |
| `api-verkenner` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/api-verkenner-j2p1-staging-share-0611-api-verkenner-deep-play-01-ipad-portrait-fixproof/` |
| `api-verkenner` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/api-verkenner-j2p1-staging-share-0611-api-verkenner-deep-play-01-ipad-landscape-fixproof/` |
| `dashboard-designer` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/dashboard-designer-j2p1-staging-share-0611-dashboard-designer-deep-play-01-desktop-fixproof/` |
| `dashboard-designer` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/dashboard-designer-j2p1-staging-share-0611-dashboard-designer-deep-play-01-mobile-fixproof/` |
| `dashboard-designer` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/dashboard-designer-j2p1-staging-share-0611-dashboard-designer-deep-play-01-ipad-portrait-fixproof/` |
| `dashboard-designer` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-11/staging-app-route-smoke/dashboard-designer-j2p1-staging-share-0611-dashboard-designer-deep-play-01-ipad-landscape-fixproof/` |
| `ai-bias-detective` | Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-12/staging-app-route-smoke/ai-bias-detective-j2p1-staging-share-0612-ai-bias-detective-deep-play-01-desktop-fixproof/` |
| `ai-bias-detective` | Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-12/staging-app-route-smoke/ai-bias-detective-j2p1-staging-share-0612-ai-bias-detective-deep-play-01-mobile-fixproof/` |
| `ai-bias-detective` | iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-12/staging-app-route-smoke/ai-bias-detective-j2p1-staging-share-0612-ai-bias-detective-deep-play-01-ipad-portrait-fixproof/` |
| `ai-bias-detective` | iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-12/staging-app-route-smoke/ai-bias-detective-j2p1-staging-share-0612-ai-bias-detective-deep-play-01-ipad-landscape-fixproof/` |

`data-review` bevat ReviewArena-staten voor drag-sort, match-pairs, categorize, rapid-fire, completion-ready en completion-confirmed. `data-journalist`, `spreadsheet-specialist`, `api-verkenner` en `dashboard-designer` bevatten DataViewer-staten voor intro/start, datasetvragen, bewuste korte/foute inputprobe, follow-up-feedback, dataset-complete, completion-ready en completion-confirmed. `factchecker` en `ai-bias-detective` bevatten ScenarioEngine-staten voor intro/start, vier rondes feedback, completion-ready en completion-confirmed.

## Oordeel Per Opdracht

| Missie | Oordeel | Design | Didactiek | Tech |
|---|---|---|---|---|
| `data-review` | `ship` na runnerfix | ReviewArena blijft bruikbaar op alle vier viewports; CTA's blijven zichtbaar en tappable in Chrome-emulatie. | Leerling sorteert databronnen, koppelt datatypes aan beveiliging, categoriseert persoonsgegevens en beantwoordt AVG-vragen. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; ReviewArena-runner is robuust voor follow-up race conditions. |
| `data-journalist` | `ship` na prerequisite + runnerfix | DataViewer is bruikbaar op alle vier viewports; ook mobiel doorloopt datasets, feedback en eindstaat zonder relevante console/network blockers. | Leerling leest tabellen/grafiek/documentkaarten, maakt een bewuste korte/foute observatieprobe, herstelt en trekt data-onderbouwde conclusies. | Completion schrijft na finale knop naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; DataViewer-runner klikt nu expliciet de finale `confirm-completion` CTA. |
| `spreadsheet-specialist` | `ship` | DataViewer blijft bruikbaar op alle vier viewports; spreadsheet-/tabelcontent is speelbaar op mobiel en iPad-emulatie. | Leerling gebruikt spreadsheetbegrippen, formules, totalen en grafiekachtige interpretatie om financiële/data-chaos te ordenen. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; geen extra runner- of productfix nodig na DataViewer completionfix. |
| `factchecker` | `ship` na ScenarioEngine QA-hookfix | ScenarioEngine blijft bruikbaar op desktop, mobiel en iPad-emulatie; CTA's blijven bereikbaar in de vier rondes en eindstaat. | Leerling herkent rode vlaggen, rangschikt betrouwbaarheid, beslist over delen/niet delen en past CRAAP-check toe. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; ScenarioEngine heeft nu stabiele QA-hooks en finale `confirm-completion` bevestiging. |
| `api-verkenner` | `ship` | DataViewer blijft bruikbaar op alle vier viewports; JSON/API-tabellen, vragen en eind-CTA's blijven bereikbaar. | Leerling analyseert JSON-response, vergelijkt app-verzoeken en herkent API-endpoints/velden. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; geen extra productfix nodig na DataViewer completionfix. |
| `dashboard-designer` | `ship` | DataViewer blijft bruikbaar op alle vier viewports; dashboardtabellen, principes en eind-CTA's blijven bereikbaar. | Leerling analyseert schooldata, herkent een zorgenklas, vergelijkt vakverdeling/onvoldoendes en past dashboardprincipes toe. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; geen extra productfix nodig na DataViewer completionfix. |
| `ai-bias-detective` | `ship` na ScenarioEngine QA-hookfix | ScenarioEngine blijft bruikbaar op desktop, mobiel en iPad-emulatie; alle vier rondes en eind-CTA's blijven bereikbaar. | Leerling herkent bias, rangschikt risicovolle AI-keuzes, beoordeelt eerlijk/scheef en kiest verbeteroplossingen. | Completion schrijft naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; geen extra productfix nodig na ScenarioEngine QA-hookfix. |

## Gevonden En Gefixte Issues

1. `data-journalist` was terecht vergrendeld zolang `data-review` niet voltooid was.
   - Bevinding: dashboard toont “Voltooi 0/1 herhalingen om de nieuwe missies vrij te spelen.”
   - Oordeel: geen bug; dit is een curriculumgate. De echte leerlingroute vereist eerst `data-review`.

2. `data-review` kon in de runner falen op `followup-submit` terwijl de UI al naar ronde 2 was gegaan.
   - Fix: ReviewArena follow-up handling is tolerant voor verdwenen submitknop na rondeovergang.
   - Bestand: `scripts/chrome-student-simulator.mjs`.

3. `data-journalist` bereikte het eindscherm maar persisteerde completion niet als de finale knop niet werd geklikt.
   - Fix: DataViewer-runner klikt nu de gedeelde `data-qa="confirm-completion"` knop en maakt ready/confirmed screenshots.
   - Bestanden: `src/features/missions/templates/shared/CompletionScreen.tsx`, `scripts/chrome-student-simulator.mjs`.

4. `spreadsheet-specialist` is daarna als regressie op dezelfde DataViewer-template gespeeld.
   - Bevinding: alle vier viewports groen zonder aanvullende productfix; de DataViewer completionfix dekt deze missie ook.

5. `factchecker` laadde visueel, maar de ScenarioEngine-knoppen hadden geen stabiele QA-selectors voor diepe leerling-clicks.
   - Fix: ScenarioEngine subrondes hebben nu `scenario-option`, `scenario-order-item`, `scenario-binary-accept`, `scenario-binary-reject`, `scenario-submit`, `scenario-next` en `scenario-reset-order`; de runner bevestigt na de laatste ronde de gedeelde completion-CTA.
   - Bestanden: `src/features/missions/templates/scenario-engine/sub/SelectCorrectRound.tsx`, `src/features/missions/templates/scenario-engine/sub/OrderPriorityRound.tsx`, `src/features/missions/templates/scenario-engine/sub/BinaryChoiceRound.tsx`, `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx`, `scripts/chrome-student-simulator.mjs`.

6. Disposable QA-credentials in `/private/tmp` waren opgeschoond.
   - Fix: bestaande 2026-06-04 QA-accounts zijn opnieuw gereset met nieuwe tijdelijke credentials buiten git; public profile/stats-readback is bevestigd.

7. `api-verkenner` is als extra DataViewer-regressie gespeeld.
   - Bevinding: alle vier viewports groen zonder aanvullende productfix; de flow bevat JSON-responseanalyse, app-verzoeken, endpointvoorbeelden, bewuste input-error-probe en finale completionbevestiging.

8. `dashboard-designer` is als extra DataViewer-regressie gespeeld.
   - Bevinding: alle vier viewports groen zonder aanvullende productfix; de flow bevat schooldata-klassen, vakkenverdeling/onvoldoendes, dashboardprincipes, bewuste input-error-probe en finale completionbevestiging.

9. `ai-bias-detective` is als extra ScenarioEngine-regressie gespeeld.
   - Bevinding: alle vier viewports groen zonder aanvullende productfix; de flow bevat bias herkennen, risico rangschikken, eerlijk/scheef beoordelen, oplossingen kiezen en finale completionbevestiging.

## Security/RLS Notities

- Risico: Rood, omdat mission completion leerlingprogress en minderjarigendata raakt.
- De completion loopt via de gedeelde `mark_mission_completed(p_mission_id text)` RPC; remote aanwezigheid is bevestigd.
- Restpunt voor de brede securitypass blijft: de RPC is `SECURITY DEFINER` in schema `public` en moet periodebreed naast RLS policies, grants, teacher visibility en exports worden herbeoordeeld.
- De account-reset gebruikte expliciet `app.bypass_stats_protection` voor disposable QA-data; dit is niet gebruikt voor echte leerlingdata.

## Acceptatie Voor Deze Slice

- Alle vier viewports doorlopen tot eindstaat: ja, voor alle J2P1 leerlingmissies en de review-prerequisite: `data-review`, `data-journalist`, `spreadsheet-specialist`, `factchecker`, `api-verkenner`, `dashboard-designer` en `ai-bias-detective`.
- Feedback/resultstaat gezien: ja.
- Completion/evidence zichtbaar en persistent: ja, alle achtentwintig runs groen met Supabase-readback.
- Prerequisite-route getest: ja, `data-journalist` was locked voor `data-review` en daarna speelbaar.
- Teacher visibility: nog niet apart visueel bevestigd in deze slice.
- Checks: `npm run build:prod` groen; `npm run doctor` groen; `node --check scripts/chrome-student-simulator.mjs` groen; `git diff --check` groen; `npm run check:rls:functions` groen.
- `npm run audit:security` blijft rood op bestaande dependency-vulnerabilities: `tmp <0.2.6` high, `uuid <11.1.1` via `exceljs`, en `ws 8.0.0-8.20.0`. Niet automatisch gefixt in deze slice omdat `npm audit fix --force` een breaking `exceljs` wijziging aankondigt.
