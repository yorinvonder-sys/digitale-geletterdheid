# DGSkills J1P2 Staging Playtest Review - 2026-06-07

## Scope

Doel van deze slice: `ai-tekengame` en `review-week-2` uit J1 P2 diep uitspelen als leerling, visueel controleren op desktop/tablet/iPad/mobile, en valideren dat completion/progress/evidence niet alleen lokaal maar ook via Supabase wordt opgeslagen.

Nog niet in deze slice: de overige J1P2-missies, teacher-dashboard visual readback, echte iPad Safari, en de volledige periodebrede securitypass. Het brede 96-opdrachten-doel blijft open.

## Target En Accounts

- Target: lokale production preview op `http://127.0.0.1:4173`, met staging/disposable Supabase-data.
- QA-school: `dgskills-qa-review-2026-06-04`.
- QA-student: `dgskills.qa.review0604.j1@example.test`.
- Secrets/wachtwoorden staan niet in dit rapport; credentials blijven buiten git onder `/private/tmp/dgskills-full-review-2026-06-04/`.

## Commands

- `npm run build:prod`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop node scripts/run-app-route-mission.mjs ai-tekengame`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs ai-tekengame`
- `QA_SKIP_APP_SERVER_PROBE=1 QA_ORIGIN=http://127.0.0.1:4173 ... QA_VIEWPORTS=desktop,mobile,ipad-portrait,ipad-landscape node scripts/run-app-route-mission.mjs review-week-2`
- Chrome CDP op poort `9225`; responsive her-run met software WebGL flags omdat `--disable-gpu` valse `THREE.WebGLRenderer` console-errors gaf in headless Chrome.

## Screenshotmanifest

Artifacts staan buiten git onder `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/`.

| Viewport | Status | Artifactdir |
|---|---|---|
| Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/ai-tekengame-j1p2-staging-share-0607-tekengame-progress-fix31-desktop-fixproof/` |
| Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/ai-tekengame-j1p2-staging-share-0607-tekengame-progress-fix33-mobile-complete-detect-mobile-fixproof/` |
| iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/ai-tekengame-j1p2-staging-share-0607-tekengame-progress-fix32-webgl-responsive-ipad-portrait-fixproof/` |
| iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/ai-tekengame-j1p2-staging-share-0607-tekengame-progress-fix31-responsive-ipad-landscape-fixproof/` |
| Desktop `1440x900` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/review-week-2-j1p2-staging-share-0607-review-week-2-deep-play-06-config-driven-desktop-fixproof/` |
| Mobile `390x844` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/review-week-2-j1p2-staging-share-0607-review-week-2-deep-play-06-config-driven-mobile-fixproof/` |
| iPad portrait `820x1180` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/review-week-2-j1p2-staging-share-0607-review-week-2-deep-play-06-config-driven-ipad-portrait-fixproof/` |
| iPad landscape `1180x820` | `ship` | `/private/tmp/dgskills-full-review-2026-06-07/staging-app-route-smoke/review-week-2-j1p2-staging-share-0607-review-week-2-deep-play-06-config-driven-ipad-landscape-fixproof/` |

Elke groene `ai-tekengame` run bevat minimaal drawing, feedback/result, complete en confirmed screenshots. Elke groene `review-week-2` run bevat intro/start, drag-sort, match-pairs inclusief bewuste fout, categorize, rapid-fire, completion-ready en completion-confirmed screenshots. Echte iPad-check blijft nodig voor Safari-specifiek gedrag.

## Oordeel Per Opdracht

| Missie | Oordeel | Design | Didactiek | Tech |
|---|---|---|---|---|
| `ai-tekengame` | `ship` na fixes | Bruikbaar op alle vier viewports in Chrome-emulatie; CTA zichtbaar en eindstaat bereikbaar. | Leerling ziet tekenen, AI-confidence, fout/herstel via opnieuw/volgende rondes, en einduitleg over neurale netwerken. | Completion schrijft nu naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; runner detecteert eindstaat correct. |
| `review-week-2` | `ship` na fixes | ReviewArena past bruikbaar op desktop, mobile, iPad portrait en iPad landscape; ronde-CTA's en finale CTA blijven bereikbaar. | Leerling ordent ontwikkelstappen, koppelt begrippen, categoriseert codekwaliteit, maakt een bewuste match-fout en herstelt via feedback. | Completion schrijft na finale knop naar `users.stats.missionsCompleted`, `mission_progress` en `student_activities`; runner is config-driven en niet meer afhankelijk van React internals. |

## Gevonden En Gefixte Issues

1. `Klaar!` was gekoppeld aan pointer-state en blokkeerde canvas-gedreven QA/touchachtige input.
   - Fix: knop blijft klikbaar; analyse blijft inhoudelijk streng.
   - Bestand: `src/features/ai-lab/previews/DrawingGamePreview.tsx`.

2. Laatste ronde toonde de eindstaat voordat mission-completion veilig naar Supabase was bevestigd.
   - Fix: `onLevelComplete` is async-aware en wordt awaited voordat de conclusion zichtbaar wordt.
   - Bestanden: `src/features/ai-lab/previews/DrawingGamePreview.tsx`, `src/features/ai-lab/AiLab.tsx`, `src/types.ts`.

3. Algemene stats-save kon `missionsCompleted` niet betrouwbaar via de remote whitelist opslaan.
   - Fix: nieuwe RPC `mark_mission_completed(p_mission_id text)` met auth-bound update, idempotente stats append en `mission_progress` upsert.
   - Bestand: `supabase/migrations/20260607095122_complete_mission_rpc.sql`.

4. De student simulator zag een echte mobiele eindstaat als fout wanneer `Missie Voltooid` al zichtbaar was.
   - Fix: `scripts/chrome-student-simulator.mjs` herkent de eindstaat voordat hij nog een extra `Klaar!`-knop zoekt.

5. `review-week-2` had geen stabiele QA-hooks op ReviewArena-subrondes.
   - Fix: QA-selectors toegevoegd voor sorteren, matchen, categoriseren, rapid-fire en follow-upvragen.
   - Bestanden: `DragSort.tsx`, `MatchPairs.tsx`, `Categorize.tsx`, `RapidFire.tsx`, `FollowUpCard.tsx`.

6. `review-week-2` werd visueel uitgespeeld tot de eindpagina, maar completion werd niet gepersist omdat de finale knop niet expliciet werd geklikt.
   - Fix: `CompletionScreen` heeft nu `data-qa="confirm-completion"` en de simulator klikt die finale leerlingactie.
   - Bestanden: `src/features/missions/templates/shared/CompletionScreen.tsx`, `scripts/chrome-student-simulator.mjs`.

7. De ReviewArena-runner kon hangen op React-fiber-inspectie voor `match-pairs` en `categorize`.
   - Fix: de runner gebruikt nu de geladen missieconfig voor verwachte paren en categorieen.
   - Bestand: `scripts/chrome-student-simulator.mjs`.

## Security/RLS Notities

- Risico: Rood, omdat mission completion leerlingprogress en minderjarigendata raakt.
- De RPC valideert `auth.uid()`, accepteert alleen veilige kebab-case mission ids, en werkt alleen op de eigen `public.users.id = auth.uid()` rij.
- Restpunt voor securitypass: de RPC is een `SECURITY DEFINER` functie in schema `public`. Dit past bij bestaande DGSkills-public-RPC patronen, maar moet in de brede Supabase/RLS-review expliciet worden herbeoordeeld tegen de Supabase best practice om privileged functies liever buiten exposed schemas te houden.
- Functioneel model: een ingelogde leerling kan een geldige mission id voor zichzelf als voltooid markeren. Dat is gelijk aan het bedoelde client-side completionpad, maar blijft een bewuste product/security-keuze.
- `npm run audit:security` faalt nog op bestaande dependency-vulnerabilities: `tmp <0.2.6` high, `uuid <11.1.1` via `exceljs`, en `ws 8.0.0-8.20.0`. Niet automatisch gefixt in deze slice omdat `npm audit fix --force` een breaking `exceljs` wijziging aankondigt.

## Acceptatie Voor Deze Slice

- Alle vier viewports doorlopen tot eindstaat: ja, voor `ai-tekengame` en `review-week-2`.
- Feedback/resultstaat gezien: ja.
- Completion/evidence zichtbaar en persistent: ja, desktop/mobile/iPad-runs groen met remote readback.
- Console/network relevante errors: ja, groen na herstart van headless Chrome zonder `--disable-gpu`; eerdere WebGL-errors waren testbrowserconfig.
- Teacher visibility: nog niet apart visueel bevestigd in deze slice.
- Checks: `npm run context:budget` groen; `node --check scripts/chrome-student-simulator.mjs` groen; `git diff --check` groen; `npm run doctor` groen; `npm run build:prod` groen; `npm run check:rls:functions` groen; `npm run audit:security` rood op dependency-audit hierboven.
