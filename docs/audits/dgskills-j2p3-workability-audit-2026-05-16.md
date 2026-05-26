# DGSkills J2 P3 Werkbaarheidsaudit - 2026-05-16

Status: auditrapport, geen productfixes uitgevoerd.

Scope: `ux-detective`, `podcast-producer`, `meme-machine`, `digital-storyteller`, `brand-builder`, `video-editor`, `online-helden`, reviewmissie `media-review` en assessmentlaag `assessment-j2-p3`.

Werkbaarheidsdefinitie: een leerling kan de opdracht zelfstandig starten, begrijpen, doorlopen en afronden, en een docent kan redelijk zien wat de leerling heeft bewezen.

Advies in een zin: de periode is inhoudelijk bruikbaar als media/creatieblok, maar nog niet als geheel shippable; de grootste blokkades zijn ontbrekende expliciete doelcontracten, onvolledig hard completionbewijs en een reviewroute die in dev-preview anders kan aanvoelen dan de echte assessmentroute.

## Executive Summary

- De curriculumscope klopt: J2 P3 heet `Digitale Media & Creatie`, bevat zeven reguliere missies, reviewmissie `media-review` en assessmentId `assessment-j2-p3` (`src/config/curriculum.ts:196`).
- Alle acht leerlingmissies zijn routeerbaar via `templateRegistry`: `media-review` als `review-arena`, vier creatiemissies als `builder-canvas`, `ux-detective` als `data-viewer` en `online-helden` als `scenario-engine` (`src/config/templateRegistry.ts:40`, `src/config/templateRegistry.ts:48`, `src/config/templateRegistry.ts:76`, `src/config/templateRegistry.ts:13`).
- De scoped missieconfigs bevatten geen expliciet `missionGoal`, `primaryGoal`, `criteria` of `evidence`; targeted search op de acht configs en `src/config/missionGoals.ts` vond geen J2 P3 fallback. De engines tonen alleen een doel als `config.missionGoal ?? getMissionGoal(config.missionId)` iets teruggeeft (`src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:178`, `src/features/missions/templates/data-viewer/DataViewer.tsx:616`, `src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:192`, `src/features/missions/templates/review-arena/ReviewArena.tsx:226`).
- Chrome bewijs is uitgevoerd met echte Google Chrome. De dedicated Chrome Extension browser-tools waren in deze sessie niet als callable namespace beschikbaar na tool discovery; daarom is de best beschikbare Chrome-bewijslast: zichtbare Google Chrome via Computer Use plus een Chrome-CDP smoke. In de gewone Chrome was de Codex-extensie zichtbaar en `media-review` startte van intro naar ronde 1.
- Het assessment is technisch gekoppeld maar niet hetzelfde als de template-review: `assessment-j2-p3` en legacy `media-review` wijzen naar dezelfde `J2P3_CONFIG`/`J2P3_ASSESSMENT` in de registry (`src/features/assessment/data/assessmentRegistry.ts:50`, `src/features/assessment/data/assessmentRegistry.ts:56`), terwijl `/dev/mission-preview?mission=media-review` door `isTemplateMission` naar `TemplateMissionRouter` gaat (`src/features/dev-tools/DevMissionPreview.tsx:159`).

## Bewijsbasis

Uitgevoerde checks:

| Check | Resultaat |
| --- | --- |
| `npm run context:budget` | Geslaagd. Dirty worktree aanwezig; audit is path-scoped uitgevoerd. |
| `npm run typecheck` | Geslaagd: `tsc -p tsconfig.app.json --noEmit` eindigde zonder output/fouten. |
| Lokale devserver | Geslaagd: Vite draaide op `http://127.0.0.1:5177/`. |
| Chrome Computer Use | Geslaagd voor `media-review`: intro, CTA en eerste ronde zichtbaar in de normale Chrome met Codex-extensie in de toolbar. |
| Chrome-CDP smoke | Geslaagd als rooktest voor de acht missie-IDs op desktop, iPad portrait en mobiel: intro/render, start en eerste interactie; geen app-console errors in de smoke-output. |

Tijdelijke artifacts:

- `/private/tmp/dgskills-j2p3-audit-2026-05-16/media-review-chrome-computer-use.png`
- `/private/tmp/dgskills-j2p3-audit-2026-05-16/chrome-review-notes.json`

Beperkingen:

- De Chrome Extension browser namespace zelf was niet callable in deze sessie; dit rapport noemt browserbewijs daarom expliciet als Chrome Computer Use + CDP, niet als volledige extension-run.
- De CDP-smoke bewijst start en eerste interactie, niet volledige leerlingafronding.
- Geen echte iPad/Safari gebruikt; iPad portrait is viewport-emulatie.
- Geen productcode of database gewijzigd.

## Topbevindingen

### Blockers

1. Ontbrekend doel- en evidencecontract voor alle acht leerlingmissies.
   - Targeted search vond geen `missionGoal`, `primaryGoal`, `criteria` of `evidence` in de J2 P3 configs en geen fallback in `src/config/missionGoals.ts`.
   - De intro-engines tonen juist alleen een doelbanner als config of fallback bestaat (`src/features/missions/templates/shared/IntroScreen.tsx:39`).
   - Gevolg: leerlingen zien wel opdrachtcopy, maar geen hard "klaar als" bewijscriterium; docenten moeten bewijs afleiden.

2. Completion is dynamisch niet hard bewezen.
   - De engines hebben statische completionpaden: BuilderCanvas (`src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:187`), DataViewer (`src/features/missions/templates/data-viewer/DataViewer.tsx:623`), ScenarioEngine (`src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:200`) en ReviewArena (`src/features/missions/templates/review-arena/ReviewArena.tsx:233`).
   - De Chrome-smoke bereikte start/eerste interactie, maar geen volledig eindscherm per missie.
   - Advies: voor release nog per opdracht een volledige leerlingdoorloop of een gerichte completion-smoke.

3. Reviewroute kan verwarrend zijn: `media-review` heeft twee gezichten.
   - In de echte AiLab-route kiest `hasAssessment(selectedRole.id)` voor `AssessmentEngine` (`src/features/ai-lab/AiLab.tsx:913`, `src/features/ai-lab/AiLab.tsx:1050`).
   - In dev-preview kiest `isTemplateMission(media-review)` eerst voor `TemplateMissionRouter` (`src/features/dev-tools/DevMissionPreview.tsx:159`).
   - Gevolg: visuele QA op `/dev/mission-preview?mission=media-review` bewijst de ReviewArena-template, maar niet automatisch de echte assessmentervaring.

### Belangrijk

4. `online-helden` past didactisch minder strak in de periodebelofte.
   - De periodefocus is `22A`, `21B`, `23B` (`src/config/curriculum.ts:199`), maar `online-helden` claimt `23B` en `23C` zonder `22A` of `21B` (`src/config/slo-kerndoelen-mapping.ts:132`).
   - De missie-inhoud gaat over cyberpesten en bijstanderacties (`src/features/missions/templates/scenario-engine/configs/online-helden.ts:8`), inhoudelijk waardevol maar minder "media maken".

5. Assessmentlaag is inhoudelijk sterk, maar apart te bewijzen.
   - `J2P3_CONFIG` gebruikt hybride beoordeling met 60% automatische score en 40% docentbeoordeling (`src/features/assessment/data/j2p3Assessment.ts:10`).
   - De verplichte docentchecks dekken UX, designproces en mediacreatie (`src/features/assessment/data/j2p3Assessment.ts:14`).
   - De assessmenttaken toetsen UX-problemen, design thinking en auteursrecht (`src/features/assessment/data/j2p3Assessment.ts:27`, `src/features/assessment/data/j2p3Assessment.ts:70`, `src/features/assessment/data/j2p3Assessment.ts:93`).

6. Visuele basisrendering is goed genoeg voor een rooktest.
   - Chrome liet voor de acht missie-IDs intro/start/eerste interactie zien op desktop, iPad portrait en mobiel.
   - Geen horizontale overflow of app-console errors kwamen uit de smoke-output.
   - In de gewone Chrome-check startte `media-review` naar ronde 1 met zichtbare sorteerstappen en `Volgorde bevestigen`.

## Verificatie Per Opdracht

Legenda: `ja` = bewezen in statische inspectie of Chrome-smoke; `deels` = route/render/start bewezen maar niet volledig afgerond; `nee` = niet bewezen in deze audit.

| Opdracht | Engine/laag | Route | Goal zichtbaar | Eerste interactie | Completion hard bewezen | Advies |
| --- | --- | --- | --- | --- | --- | --- |
| `ux-detective` | `data-viewer` | ja | nee | ja | nee | `fix-eerst` |
| `podcast-producer` | `builder-canvas` | ja | nee | ja | nee | `fix-eerst` |
| `meme-machine` | `builder-canvas` | ja | nee | ja | nee | `fix-eerst` |
| `digital-storyteller` | `builder-canvas` | ja | nee | ja | nee | `fix-eerst` |
| `brand-builder` | `builder-canvas` | ja | nee | ja | nee | `fix-eerst` |
| `video-editor` | `builder-canvas` | ja | nee | ja | nee | `fix-eerst` |
| `online-helden` | `scenario-engine` | ja | nee | ja | nee | `fix-eerst` |
| `media-review` | `review-arena` in dev-preview | ja | nee | ja | nee | `fix-eerst` |
| `assessment-j2-p3` | `AssessmentEngine` data/config | statisch ja | n.v.t. | niet dynamisch bewezen | nee | `fix-eerst` |

## Design En Werkbaarheid

- Sterk: de gedeelde intro zet de startknop boven featurelijsten, waardoor de CTA ook bij langere copy snel bereikbaar blijft (`src/features/missions/templates/shared/IntroScreen.tsx:41`).
- Sterk: BuilderCanvas-missies tonen checklistknoppen en een AI-hulpknop in de eerste opdrachtstaat; Chrome-smoke zag deze bij de creatiemissies.
- Aandachtspunt: zonder doelbanner ontbreekt op de eerste viewport een expliciet bewijscriterium, ondanks de aanwezigheid van `MissionGoalBanner`-ondersteuning (`src/features/missions/templates/shared/IntroScreen.tsx:39`).
- Visual Precision Gate: rooktest geslaagd voor rendering, start en eerste interactie; release-gate blijft onbewezen voor volledige flow en eindstaat.

## Didactiek

- Sterk: de periode heeft een duidelijke lijn van UX-analyse naar productie: podcast, meme, storytelling, branding en video staan in de curriculumvolgorde (`src/config/curriculum.ts:200`).
- Sterk: SLO-mapping is voor de meeste opdrachten compact en passend bij media/product: `ux-detective`, `podcast-producer`, `digital-storyteller` en `video-editor` combineren `22A` met `21B` (`src/config/slo-kerndoelen-mapping.ts:125`, `src/config/slo-kerndoelen-mapping.ts:126`, `src/config/slo-kerndoelen-mapping.ts:128`, `src/config/slo-kerndoelen-mapping.ts:130`).
- Aandachtspunt: `brand-builder` claimt alleen `22A`, waardoor mediawijsheid expliciet uit de mapping is gehaald (`src/config/slo-kerndoelen-mapping.ts:129`). Dat kan, maar dan moet de opdracht vooral als productontwerp worden gepositioneerd.
- Aandachtspunt: `online-helden` is meer digitaal welzijn/maatschappij dan media-creatie; plaatsing is verdedigbaar als mediawijs handelen, maar de periodecopy moet dat explicieter maken.

## Tech

- Routeerbaarheid: alle acht leerlingmissies staan in `TEMPLATE_MISSIONS`.
- Configloading: de template-engines importeren missieconfigs dynamisch per `missionId`, met load-error fallback in DataViewer en ReviewArena (`src/features/missions/templates/data-viewer/DataViewer.tsx:731`, `src/features/missions/templates/review-arena/ReviewArena.tsx:399`).
- State en completion: engines hebben `onComplete`-paden, maar de audit heeft geen eindstaat per missie doorlopen.
- Assessment: `AssessmentEngine` ondersteunt autosave via `onSave` en herstelt voortgang uit `initialState` (`src/features/assessment/AssessmentEngine.tsx:40`, `src/features/assessment/AssessmentEngine.tsx:62`).
- TypeScript: `npm run typecheck` is groen in de huidige werkboom.

## Herstelplan

1. P0: voeg per J2 P3 missie een expliciet `missionGoal` toe met `primaryGoal`, `criteria` en `evidence`.
2. P0: maak de dev-previewroute voor `media-review` expliciet: kies of QA de ReviewArena-template of de echte AssessmentEngine moet tonen, en label dat in de route/UI.
3. P1: voeg een gerichte J2 P3 workability check toe, vergelijkbaar met `scripts/check-j2p2-workability-contract.mjs`, maar pas na besluit over de reviewroute.
4. P1: draai een volledige Chrome-flow per missie tot eindscherm, inclusief iPad portrait en mobile.
5. P2: herformuleer periodecopy of `online-helden`-intro zodat cyberpesten/bijstandergedrag duidelijk als mediawijs handelen binnen P3 voelt.

## Public APIs, Interfaces En Types

Geen wijzigingen uitgevoerd of aanbevolen als onderdeel van deze auditronde. Dit rapport wijzigt geen runtime-code, publieke API's, types, database, auth of edge-function contracten.

## Self-check

- File:regel-anchors aanwezig bij alle topbevindingen.
- Samenvatting claimt alleen bewezen start/eerste interactie, geen volledige afronding.
- Chrome-beperking is expliciet genoemd.
- Geen productfixes uitgevoerd.
