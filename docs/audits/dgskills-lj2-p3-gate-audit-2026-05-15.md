# LJ2 Periode 3 Gate Audit - baseline 04bda37

Datum: 2026-05-15  
Worktree: `/private/tmp/dgskills-lj2-p3-gate`  
Branch: `codex/lj2-p3-gate`  
Scope: `ux-detective`, `podcast-producer`, `meme-machine`, `digital-storyteller`, `brand-builder`, `video-editor`, `online-helden`, `media-review`

## Preflight hoofd-worktree

De hoofd-worktree is dirty en blijft buiten scope. Classificatie van open wijzigingen:

- `mission-related`: `src/features/missions/DataDetectiveMission.tsx`, `src/features/missions/DeepfakeDetectorMission.tsx`, `src/features/missions/shared/MissionBriefing.tsx`
- `homepage`: `src/features/public-site/ScholenLanding.tsx`
- `services/hooks`: `src/hooks/useStudentAssistant.ts`, `src/hooks/useTeacherMessages.ts`, `src/services/dataVoorDataService.ts`, `src/services/teacherService.ts`
- `supabase-migrations`: `src/types/database.pending-migrations.ts`, `supabase/migrations/*`
- `docs/instructions`: `AGENTS.md`, `docs/audits/dgskills-j2p2-workability-audit-2026-05-15.md`

Geen van deze wijzigingen is gestaged, gecommit of gerevert voor P3.

## Resolve

Curriculum: LJ2 P3 `Digitale Media & Creatie` staat in `src/config/curriculum.ts:196`, met opdrachten in `src/config/curriculum.ts:200` en review in `src/config/curriculum.ts:209`.

| Missie | Template | Config/engine | SLO mapping | Curriculum | enableChat | chatRoleId |
| --- | --- | --- | --- | --- | --- | --- |
| `ux-detective` | `data-viewer` (`src/config/templateRegistry.ts:76`) | `src/features/missions/templates/data-viewer/configs/ux-detective.ts:3`, `src/features/missions/templates/data-viewer/DataViewer.tsx:47` | `['22A','21B']` (`src/config/slo-kerndoelen-mapping.ts:125`) | LJ2 P3 (`src/config/curriculum.ts:201`) | false | n.v.t. |
| `podcast-producer` | `builder-canvas` (`src/config/templateRegistry.ts:48`) | `src/features/missions/templates/builder-canvas/configs/podcast-producer.ts:4`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:30` | `['22A','21B']` (`src/config/slo-kerndoelen-mapping.ts:126`) | LJ2 P3 (`src/config/curriculum.ts:202`) | true | `podcast-producer` |
| `meme-machine` | `builder-canvas` (`src/config/templateRegistry.ts:51`) | `src/features/missions/templates/builder-canvas/configs/meme-machine.ts:4`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:30` | `['21B','23B']` (`src/config/slo-kerndoelen-mapping.ts:127`) | LJ2 P3 (`src/config/curriculum.ts:203`) | true | `meme-machine` |
| `digital-storyteller` | `builder-canvas` (`src/config/templateRegistry.ts:52`) | `src/features/missions/templates/builder-canvas/configs/digital-storyteller.ts:4`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:30` | `['22A','21B']` (`src/config/slo-kerndoelen-mapping.ts:128`) | LJ2 P3 (`src/config/curriculum.ts:204`) | true | `digital-storyteller` |
| `brand-builder` | `builder-canvas` (`src/config/templateRegistry.ts:49`) | `src/features/missions/templates/builder-canvas/configs/brand-builder.ts:4`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:30` | `['22A']` (`src/config/slo-kerndoelen-mapping.ts:129`) | LJ2 P3 (`src/config/curriculum.ts:205`) | true | `brand-builder` |
| `video-editor` | `builder-canvas` (`src/config/templateRegistry.ts:50`) | `src/features/missions/templates/builder-canvas/configs/video-editor.ts:4`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:30` | `['22A','21B']` (`src/config/slo-kerndoelen-mapping.ts:130`) | LJ2 P3 (`src/config/curriculum.ts:206`) | true | `video-editor` |
| `online-helden` | `scenario-engine` (`src/config/templateRegistry.ts:13`) | `src/features/missions/templates/scenario-engine/configs/online-helden.ts:3`, `src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:93` | `['23B','23C']` (`src/config/slo-kerndoelen-mapping.ts:132`) | LJ2 P3 (`src/config/curriculum.ts:207`) | false | n.v.t. |
| `media-review` | `review-arena` (`src/config/templateRegistry.ts:40`) | `src/features/missions/templates/review-arena/configs/media-review.ts:3`, `src/features/missions/templates/review-arena/ReviewArena.tsx:64` | `['22A','21B','23B']` (`src/config/slo-kerndoelen-mapping.ts:131`) | LJ2 P3 review (`src/config/curriculum.ts:209`) | false | n.v.t. |

## Blockers

- [high] `online-helden` kan geen 100/100 halen en toont foute rondemaxima door hardcoded `25` in ScenarioEngine scoring (`src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx:8`, `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx:19`, `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx:30`, `src/features/missions/templates/scenario-engine/sub/FeedbackBanner.tsx:71`).
  Bewijs: `online-helden` definieert rondes met `maxScore` 30, 40 en 30 (`src/features/missions/templates/scenario-engine/configs/online-helden.ts:59`, `src/features/missions/templates/scenario-engine/configs/online-helden.ts:156`, `src/features/missions/templates/scenario-engine/configs/online-helden.ts:253`), maar de engine rekent alle rondes op 25 punten en gebruikt `base >= 15` als vaste drempel (`src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:28`, `src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:222`).
  Fix: schaal `scoreRound` op `round.maxScore`, gebruik 60%-drempels op `round.maxScore`, toon `score/round.maxScore` en clamp `totalScore` op `config.maxScore`.

- [high] `online-helden` raakt cyberpesten, maar heeft geen actieve welzijnstrigger in de runtime (`src/features/missions/templates/scenario-engine/configs/online-helden.ts:8`, `src/features/missions/templates/scenario-engine/configs/online-helden.ts:43`).
  Bewijs: de missie behandelt uitsluiting, gedeelde privéberichten, viral gaan en langdurig pesten (`src/features/missions/templates/scenario-engine/configs/online-helden.ts:69`, `src/features/missions/templates/scenario-engine/configs/online-helden.ts:119`, `src/features/missions/templates/scenario-engine/configs/online-helden.ts:227`), terwijl `ScenarioEngine` geen `useWellbeingMonitor` of `WellbeingAlert` rendert in de actieve flow (`src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:226`).
  Fix: voeg een zichtbare hulp/protocolkaart plus text-check toe voor welzijnsgevoelige scenario's; bij zorgwekkende tekst moet `WellbeingAlert` openen en de flow niet stil doorgaan.

- [high] `ux-detective` heeft `maxScore: 100`, maar de vraagpunten tellen maar op tot 90 (`src/features/missions/templates/data-viewer/configs/ux-detective.ts:189`, `src/features/missions/templates/data-viewer/configs/ux-detective.ts:195`).
  Bewijs: vraag 8 is een inhoudelijke reflectie maar levert `points: 0`; DataViewer gebruikt de vraagpunten als scorebudget en clamped op `config.maxScore` (`src/features/missions/templates/data-viewer/DataViewer.tsx:520`).
  Fix: maak `q8-verbetervoorstel` 10 punten zodat het berekenbare scorebudget exact 100 is.

- [high] BuilderCanvas-missies met reflectiebonus kunnen boven `maxScore` eindigen (`src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:78`, `src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:103`).
  Bewijs: `podcast-producer` en `brand-builder` hebben elk een `bonusPoints: 5` (`src/features/missions/templates/builder-canvas/configs/podcast-producer.ts:68`, `src/features/missions/templates/builder-canvas/configs/brand-builder.ts:54`); met vier stappen van 25 punten kan de totaalscore 105 worden.
  Fix: clamp `totalScore` op `config.maxScore`.

- [medium] `media-review` mist een zichtbaar missie-doel in de intro (`src/features/missions/templates/review-arena/ReviewArena.tsx:219`).
  Bewijs: `IntroScreen` ondersteunt `goal` (`src/features/missions/templates/shared/IntroScreen.tsx:12`), maar `ReviewArena` geeft alleen emoji, titel, beschrijving en features door (`src/features/missions/templates/review-arena/ReviewArena.tsx:219` tot `src/features/missions/templates/review-arena/ReviewArena.tsx:225`).
  Fix: laat `ReviewArena` `config.missionGoal ?? getMissionGoal(config.missionId)` doorgeven en voeg P3-doelen toe aan `missionGoals`.

## Niet-blocking / expliciet groen

- Chat role mismatch: geen mismatch gevonden voor P3 BuilderCanvas. Registry zet `chatRoleId` voor de vijf BuilderCanvas-missies (`src/config/templateRegistry.ts:48` tot `src/config/templateRegistry.ts:52`), configs bevatten dezelfde ids, `StudentAIChat` krijgt `roleId` (`src/features/missions/templates/builder-canvas/BuilderCanvas.tsx:280`) en system instructions bestaan (`supabase/functions/_shared/systemInstructions.ts:63` tot `supabase/functions/_shared/systemInstructions.ts:67`).
- BuilderCanvas raw marker: `ChatBubble` verbergt `---STEP_COMPLETE:X---` markers in de UI in baseline `04bda37`; geen P3-specifieke raw-marker blocker gevonden.
- CSP assets: geen externe `giphy`/`unsplash` image-assets in P3-configs gevonden.
- DebateArena en PuzzleLab patronen zijn niet runtime-relevant voor LJ2 P3.
- WEEK_MISSIONS is genegeerd conform auditinstructie.

## Voorlopig advies

Advies voor baseline `04bda37`: BLOCK.  
Samenvatting: score-integriteit en welzijnsbescherming raken runtime, leerlingbeoordeling en AI Act-welzijnseisen; fix eerst, daarna browsermatrix.
