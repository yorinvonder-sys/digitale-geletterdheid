# DGSkills fun- en gamificationaudit alle leerjaren

Datum: 2026-05-16  
Scope: actuele curriculum- en reviewopdrachten in leerjaar 1 t/m 3  
Outputtype: audit, geen productfixes

## Samenvatting

Het plan ging uit van 97 opdrachten. De huidige werkboom bevat in `src/config/curriculum.ts` 96 curriculum-/reviewopdrachten: J1 = 39, J2 = 31, J3 = 26. De 12 assessments staan wel in de curriculumconfig, maar zijn alleen context en zijn niet als gewone speelopdracht gescoord (`src/config/curriculum.ts:73`, `src/config/curriculum.ts:100`, `src/config/curriculum.ts:123`, `src/config/curriculum.ts:137`, `src/config/curriculum.ts:173`, `src/config/curriculum.ts:194`, `src/config/curriculum.ts:212`, `src/config/curriculum.ts:225`, `src/config/curriculum.ts:261`, `src/config/curriculum.ts:277`, `src/config/curriculum.ts:295`, `src/config/curriculum.ts:309`).

Verdeling:

| Oordeel | Aantal | Betekenis |
|---|---:|---|
| Leuk genoeg | 15 | Duidelijke rol, snelle actie, score/progressie en sterke spel- of puzzellus. |
| Voldoende spelend | 44 | Actief en bruikbaar, maar vaak meer checklist/productieflow dan echte game. |
| Matig/statisch | 30 | Leerzaam, maar de eerste interactie voelt vaak als invullen, lezen of doorstappen. |
| Saai-risico | 7 | Vooral walkthrough/checklist; badges en score compenseren de statische kern niet genoeg. |

Kort oordeel: DGSkills heeft genoeg gamification in de engines, maar de fun is ongelijk verdeeld. ReviewArena, PuzzleLab, ScenarioEngine en GameDirector zijn het meest levendig. ToolGuide, agent-role briefings, DataViewer en DebateArena dragen het didactische werk, maar voelen vaker als statische opdrachten met scorelaag erbovenop.

## Rubric

Score 1-5 op leerlingbeleving:

| Score | Label | Criteria |
|---:|---|---|
| 4.2-5.0 | Leuk genoeg | Rol/fantasie, actieve eerste handeling, directe feedback, progressie, beloning en variatie. |
| 3.5-4.1 | Voldoende spelend | Duidelijke opdracht, score/badges en actieve stappen, maar beperkt verrassing of spelkeuze. |
| 2.6-3.4 | Matig/statisch | Vooral tekst, analyse, invullen of lineaire stappen; gamification is aanwezig maar dun. |
| 1.0-2.5 | Saai-risico | Walkthrough/checklist of routeprobleem; leerling doet weinig dat als spelend voelt. |

Bewijsbronnen: curriculum (`src/config/curriculum.ts:60`), template-routing (`src/config/templateRegistry.ts:1`), enginecode, missieconfigs, agentrollen, Chrome-triage via routes zoals `/dev/mission-preview?mission=magister-master&reset=1`, volledige mobile/iPad-emulatie via headless Google Chrome CDP, en tijdelijke notities/screenshots onder `/private/tmp/dgskills-fun-audit-2026-05-16/`.

## Topbevindingen

1. ToolGuide is het grootste saai-risico.
   Alle 7 ToolGuide-opdrachten scoren laag. De engine heeft punten, badges en completion, maar de kern is checklist plus vraag (`src/features/missions/templates/tool-guide/ToolGuide.tsx:61`, `src/features/missions/templates/tool-guide/ToolGuide.tsx:529`). Chrome bevestigde dat J1P1 na start telkens een schooltool-stap opent met 3-4 interacties en score, maar weinig spelkeuze.

2. ReviewArena is de sterkste gamificationlaag.
   De reviewopdrachten gebruiken drag-sort, match-pairs, categoriseren en rapid-fire rondes (`src/features/missions/templates/review-arena/ReviewArena.tsx:19`, `src/features/missions/templates/review-arena/ReviewArena.tsx:274`). Chrome op `review-week-2` en `media-review` startte direct in een sorteeropdracht met 14 interacties en 0 consolefouten.

3. DataViewer en DebateArena zijn didactisch sterk maar speels middelmatig.
   DataViewer heeft score, badges, datasetfases en confidence (`src/features/missions/templates/data-viewer/DataViewer.tsx:510`, `src/features/missions/templates/data-viewer/DataViewer.tsx:625`), maar Chrome laat veel schermen starten als "0 pts DATASET 1/3" met tabelvragen. DebateArena heeft punten en fasen (`src/features/missions/templates/debate-arena/DebateArena.tsx:99`, `src/features/missions/templates/debate-arena/DebateArena.tsx:188`), maar de eerste interactie is vaak perspectieven lezen.

4. De speelse titels in enkele J1 AI-opdrachten worden niet altijd waargemaakt.
   `game-programmeur`, `ai-trainer`, `chatbot-trainer`, `verhalen-ontwerper`, `ai-tekengame` en `ai-beleid-brainstorm` starten in Chrome vooral als briefing/step-flow met "Volgende" en 2 interacties. De rol is leuk, maar de mechaniek blijft tekstueel. Agentrolroutes zitten achter `DevMissionPreview` en AiLab (`src/features/dev-tools/DevMissionPreview.tsx:143`, `src/features/dev-tools/DevMissionPreview.tsx:180`; speciale assessmentachtige routes in `src/features/ai-lab/AiLab.tsx:913` en `src/features/ai-lab/AiLab.tsx:1050`).

5. Het huidige curriculum wijkt af van de planverwachting.
   J2P4 bevat nu 5 missies en geen `sustainability-scanner` (`src/config/curriculum.ts:218`). De huidige `templateRegistry` heeft DataViewer op 14 missies en bevat `sustainability-scanner` niet (`src/config/templateRegistry.ts:66`). Een Chrome-probe op die oude/verwachte id geeft "Mission preview niet beschikbaar"; daarom is die id niet meegescoord.

## Chrome-triage

Chrome plugin gebruikt: ja, via de Codex Chrome Extension.  
Desktopbasis: `http://127.0.0.1:3000` omdat `localhost:3000` lokaal naar een andere IPv6 Next-server wees.  
Sample: 35 routes geprobeerd; 34 actuele of relevante opdrachten plus 1 oude/verwachte id (`sustainability-scanner`) om de 97-vs-96 mismatch te controleren.  
Console/network: in de korte batches 0 relevante error/warning logs op de actuele routes.  
Artifacts: `/private/tmp/dgskills-fun-audit-2026-05-16/chrome-triage-batch-a.json`, `chrome-triage-batch-b.json`, `chrome-triage-batch-c.json`, plus screenshots.

### Volledige mobile/iPad-emulatie

Omdat de Chrome plugin-wrapper in deze sessie geen viewport-capability exposeerde, is de responsive-check uitgevoerd met headless Google Chrome via CDP met expliciete device metrics, touch-emulatie en mobiele user agents. De vaste Vite-server draaide op `http://127.0.0.1:5188`.

| Device | Viewport | Checks | Console/network errors | Horizontale overflow | Unsupported/config missing | Startfailure |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 390x844, DPR 3, touch | 96 | 0 | 0 | 0 | 0 na gerichte hercheck |
| iPad portrait | 820x1180, DPR 2, touch | 96 | 0 | 0 | 0 | 0 |

De volledige run gaf eerst 1 mobile timing-false-positive op `magister-master` doordat de pagina nog op `Laden...` stond; een langzamere gerichte hercheck op dezelfde mobile-emulatie gaf 0 errors, 0 overflow en 0 startfailure. Eindbewijs: 192 volledige responsive routechecks plus 1 gerichte recheck. Artifacts: `/private/tmp/dgskills-fun-audit-2026-05-16/responsive-emulation-results.json`, `/private/tmp/dgskills-fun-audit-2026-05-16/responsive-magister-mobile-recheck.json`, en `responsive-*.png` screenshots.

Aanvullende responsive-observatie: mobile/iPad routeert en start betrouwbaar voor alle actuele opdrachten, maar 55 checks signaleren kleine touch targets (<36 px) in zichtbare controls. Dit is vooral zichtbaar bij compacte terug-/hintknoppen en DataViewer-inputs; het veroorzaakt geen startblokkade of overflow, maar verdient UI-polish als de mobiele ervaring echt leerling-first moet voelen.

Chrome-observaties:

| Cluster | Chrome-indruk |
|---|---|
| ToolGuide | Start betrouwbaar, score zichtbaar, maar eerste actie is lineaire schooltool-stap. |
| Agent-role J1 | Start betrouwbaar, maar eerste interactie is vooral "Volgende" in briefing/step-flow. |
| DataViewer | Start betrouwbaar, veel interacties (14-16), maar voelt als datawerkblad met score. |
| DebateArena | Start betrouwbaar, 7 interacties, maar eerste echte actie is perspectieven lezen. |
| ReviewArena | Sterk: direct ronde, sorteren/koppelen, score, veel interactie. |
| PuzzleLab | Sterk: `cyber-detective` start als puzzel met +25 pts en concrete keuzevraag. |
| SimulationLab | Goed: `bug-hunter` start met instellingen/simulatie en directe feedbackbelofte. |
| Custom | `game-director` en `cloud-cleaner` zijn visueel en actief; `game-director` toont 85 interactables en score/levelstate. |

## Heatmap per periode

| Periode | Aantal | Gem. score | Matig/statisch + saai-risico | Oordeel |
|---|---:|---:|---:|---|
| J1P1 | 5 | 2.1 | 5 | Saai-risico: alle opdrachten zijn ToolGuide. |
| J1P2 | 16 | 3.7 | 7 | Gemengd: sterke `game-director`/ReviewArena, zwakke agent-role briefings. |
| J1P3 | 14 | 3.8 | 5 | Redelijk speels; custom/scenario sterk, debat/data-rollen statischer. |
| J1P4 | 4 | 3.2 | 2 | Eindproject bevat builder-fun, maar `mission-launch` en `review-week-3` zijn minder speels. |
| J2P1 | 7 | 3.8 | 2 | Goed genoeg; datawerk blijft soms werkbladachtig. |
| J2P2 | 11 | 3.9 | 1 | Sterkste J2-periode door simulation, puzzle, builder en review. |
| J2P3 | 8 | 3.9 | 1 | Voldoende speels; creatiemissies zijn actief, `ux-detective` blijft datawerkblad. |
| J2P4 | 5 | 3.4 | 4 | Inhoudelijk serieus, maar debat/data-eindproject voelt statischer. |
| J3P1 | 6 | 3.7 | 3 | Technisch rijk, maar data-viewer clustering drukt fun. |
| J3P2 | 6 | 4.3 | 0 | Beste periode: puzzle/scenario/review passen goed bij cybersecurity. |
| J3P3 | 8 | 3.5 | 5 | Innovatiecontext leuk, maar data/debat/tool-guide geeft statisch risico. |
| J3P4 | 6 | 3.6 | 2 | Voldoende door builder, maar meesterproef blijft portfolio-/reflectiewerk. |

## Heatmap per engine

| Engine/laag | Aantal | Gem. score | Zwakke opdrachten | Oordeel |
|---|---:|---:|---:|---|
| ReviewArena | 7 | 4.8 | 0 | Beste gamification: mini-games, rondes, scores, badges. |
| PuzzleLab | 5 | 4.3 | 0 | Sterke puzzelfantasie en directe uitdaging. |
| ScenarioEngine | 11 | 4.1 | 0 | Goede scenario-keuzes met score en fases. |
| SimulationLab | 5 | 4.0 | 0 | Actief door instellingen/simulaties, soms tekstueel. |
| Custom | 11 | 3.8 | 2 | Sterk waar echt interactief; wisselend bij data/privacy-varianten. |
| BuilderCanvas | 19 | 3.7 | 0 | Productief en creatief, maar vaak checklist/canvas in plaats van spel. |
| DataViewer | 14 | 3.4 | 11 | Veel interactie, maar werkbladgevoel. |
| DebateArena | 10 | 3.4 | 10 | Goede rolcontext, weinig speelse mechaniek in eerste fase. |
| Agent-role | 4 | 3.1 | 4 | Titels/rollen leuker dan de interactie. |
| Assessment-route | 3 | 2.9 | 3 | Leerzaam, maar spelbelofte zwakker. |
| ToolGuide | 7 | 2.2 | 7 | Grootste saai-risico. |

## Top 10 leukste opdrachten

| Score | Opdracht | Waarom |
|---:|---|---|
| 4.8 | `game-director` | Echte game-loop: levels, score, canvas, blokken en playtest (`src/features/missions/GameDirectorMission.tsx:30`, `src/features/missions/GameDirectorMission.tsx:196`). |
| 4.8 | `review-week-2` | ReviewArena-mini-games met sorteren/koppelen en score (`src/features/missions/templates/review-arena/configs/review-week-2.ts:5`). |
| 4.8 | `data-review` | Zelfde sterke reviewmechaniek voor data. |
| 4.8 | `code-review-2` | Review als gamevorm, niet alleen reflectie. |
| 4.8 | `media-review` | Beste J2P3-review; Chrome startte direct in sorteeropdracht. |
| 4.8 | `advanced-code-review` | ReviewArena schaalt goed naar J3. |
| 4.8 | `security-review` | Past uitstekend bij cybersecurity. |
| 4.8 | `impact-review` | ReviewArena houdt maatschappelijk onderwerp actief. |
| 4.3 | `mail-detective` | Scenario-detectiverol met rondes, score en keuzes (`src/features/missions/templates/scenario-engine/configs/mail-detective.ts:56`). |
| 4.3 | `cyber-detective` | PuzzleLab start als echte puzzel met punten en duidelijke uitdaging. |

## Grootste saai-risico's

| Score | Opdracht | Issue |
|---:|---|---|
| 2.1 | `magister-master` | Nuttige schooltooltraining, maar lineair en checklist-heavy. |
| 2.1 | `cloud-commander` | Zelfde ToolGuide-patroon: uitvoeren/afvinken, weinig spelkeuze. |
| 2.1 | `word-wizard` | Vaardigheid nuttig, beleving schools. |
| 2.1 | `slide-specialist` | Visueel onderwerp, maar eerste loop blijft instructiestappen. |
| 2.1 | `print-pro` | Praktisch, maar weinig fun buiten score/badges. |
| 2.3 | `mission-launch` | Eindprojectlancering voelt als contentformulier. |
| 2.3 | `startup-pitch` | Startupcontext leuk, ToolGuide-uitvoering te lineair. |
| 2.8 | `ai-beleid-brainstorm` | Brainstorm is actief, maar geen sterke spel-/feedbacklus. |
| 2.9 | `game-programmeur` | Titel belooft game, Chrome toont eerst step/briefing. |
| 3.0 | `chatbot-trainer` / `ai-tekengame` | Assessmentachtige route ondermijnt de speelse titel. |

## Alle opdrachten

| Plek | Opdracht | Type | Engine/laag | Score | Oordeel | Signalen | Bewijs |
|---|---|---|---|---:|---|---|---|
| J1P1 | `magister-master` | mission | tool-guide | 2.1 | Saai-risico | badges, checklist-heavy | `src/config/curriculum.ts:67`; `src/config/templateRegistry.ts:95`; `src/features/missions/templates/tool-guide/configs/magister-master.ts:5` |
| J1P1 | `cloud-commander` | mission | tool-guide | 2.1 | Saai-risico | badges, checklist-heavy | `src/config/curriculum.ts:68`; `src/config/templateRegistry.ts:96`; `src/features/missions/templates/tool-guide/configs/cloud-commander.ts:5` |
| J1P1 | `word-wizard` | mission | tool-guide | 2.1 | Saai-risico | badges, checklist-heavy | `src/config/curriculum.ts:69`; `src/config/templateRegistry.ts:97`; `src/features/missions/templates/tool-guide/configs/word-wizard.ts:5` |
| J1P1 | `slide-specialist` | mission | tool-guide | 2.1 | Saai-risico | badges, checklist-heavy | `src/config/curriculum.ts:70`; `src/config/templateRegistry.ts:98`; `src/features/missions/templates/tool-guide/configs/slide-specialist.ts:5` |
| J1P1 | `print-pro` | mission | tool-guide | 2.1 | Saai-risico | badges, checklist-heavy | `src/config/curriculum.ts:71`; `src/config/templateRegistry.ts:99`; `src/features/missions/templates/tool-guide/configs/print-pro.ts:5` |
| J1P2 | `prompt-master` | mission | custom | 3.8 | Voldoende spelend | custom interactie | `src/config/curriculum.ts:81`; `src/features/missions/PromptMasterMission.tsx:343`; `src/features/missions/PromptMasterMission.tsx:325` |
| J1P2 | `game-programmeur` | mission | agent-role | 2.9 | Matig/statisch | AI-chat/rol; geen eigen gamecomponent in preview | `src/config/curriculum.ts:82`; `src/config/agents/year1.tsx:1040`; Chrome batch A |
| J1P2 | `ai-trainer` | mission | agent-role | 3.1 | Matig/statisch | trainerfantasie/chatrol; eerste interactie briefing/tekst | `src/config/curriculum.ts:83`; `src/config/agents/year1.tsx:1522`; Chrome batch A |
| J1P2 | `chatbot-trainer` | mission | assessment-route | 3.0 | Matig/statisch | assessmentachtige flow; minder speels dan titel | `src/config/curriculum.ts:84`; `src/config/agents/year1.tsx:3533`; `src/features/ai-lab/AiLab.tsx:913` |
| J1P2 | `verhalen-ontwerper` | mission | agent-role | 3.3 | Matig/statisch | creatieve agency; gamification vooral tekst/chat | `src/config/curriculum.ts:85`; `src/config/agents/year1.tsx:871`; Chrome batch A |
| J1P2 | `game-director` | mission | custom | 4.8 | Leuk genoeg | levels, score, canvas, playtest | `src/config/curriculum.ts:86`; `src/features/missions/GameDirectorMission.tsx:30`; `src/features/missions/GameDirectorMission.tsx:196` |
| J1P2 | `ai-tekengame` | mission | assessment-route | 3.0 | Matig/statisch | assessmentachtige flow; spelmechaniek beperkt bewezen | `src/config/curriculum.ts:87`; `src/config/agents/year1.tsx:3621`; `src/features/ai-lab/AiLab.tsx:913` |
| J1P2 | `ai-beleid-brainstorm` | mission | assessment-route | 2.8 | Matig/statisch | brainstorm actief, geen sterke spel-lus | `src/config/curriculum.ts:88`; `src/config/agents/year1.tsx:3704`; Chrome batch B |
| J1P2 | `code-denker` | mission | scenario-engine | 4.1 | Voldoende spelend | badges, scenario-keuzes | `src/config/curriculum.ts:89`; `src/config/templateRegistry.ts:19`; `src/features/missions/templates/scenario-engine/configs/code-denker.ts:5` |
| J1P2 | `website-bouwer` | mission | builder-canvas | 3.7 | Voldoende spelend | chatcoach, badges | `src/config/curriculum.ts:90`; `src/config/templateRegistry.ts:46`; `src/features/missions/templates/builder-canvas/configs/website-bouwer.ts:5` |
| J1P2 | `schermtijd-coach` | mission | debate-arena | 3.4 | Matig/statisch | debatfases met score, maar tekstzwaar | `src/config/curriculum.ts:91`; `src/config/templateRegistry.ts:83`; `src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts:5` |
| J1P2 | `notificatie-ninja` | mission | scenario-engine | 4.1 | Voldoende spelend | badges, scenario-keuzes | `src/config/curriculum.ts:92`; `src/config/templateRegistry.ts:12`; `src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts:5` |
| J1P2 | `cloud-cleaner` | review | custom | 3.9 | Voldoende spelend | drag/drop, XP | `src/config/curriculum.ts:95`; `src/features/missions/review/CloudCleanerMission.tsx:126`; `src/features/missions/review/CloudCleanerMission.tsx:556` |
| J1P2 | `layout-doctor` | review | custom | 3.9 | Voldoende spelend | interactieve review/simulator | `src/config/curriculum.ts:96`; `src/features/missions/review/LayoutDoctorMission.tsx:53`; `src/features/missions/review/LayoutDoctorMission.tsx:400` |
| J1P2 | `pitch-police` | review | custom | 3.9 | Voldoende spelend | reviewrol, concrete verbeteractie | `src/config/curriculum.ts:97`; `src/features/missions/review/PitchPoliceMission.tsx:254`; `src/features/missions/review/PitchPoliceMission.tsx:358` |
| J1P2 | `review-week-2` | review | review-arena | 4.8 | Leuk genoeg | mini-games, badges, bonus/vertrouwen | `src/config/curriculum.ts:98`; `src/config/templateRegistry.ts:37`; `src/features/missions/templates/review-arena/configs/review-week-2.ts:5` |
| J1P3 | `data-detective` | mission | custom | 3.7 | Voldoende spelend | levels en score | `src/config/curriculum.ts:108`; `src/features/missions/DataDetectiveMission.tsx:37`; `src/features/missions/DataDetectiveMission.tsx:348` |
| J1P3 | `data-verzamelaar` | mission | agent-role | 3.2 | Matig/statisch | onderzoek/output; weinig systeemgamification | `src/config/curriculum.ts:109`; `src/config/agents/year1.tsx:2218`; Chrome batch B |
| J1P3 | `deepfake-detector` | mission | custom | 3.7 | Voldoende spelend | levels, score, streak | `src/config/curriculum.ts:110`; `src/features/missions/DeepfakeDetectorMission.tsx:50`; `src/features/missions/DeepfakeDetectorMission.tsx:270` |
| J1P3 | `ai-spiegel` | mission | simulation-lab | 3.9 | Voldoende spelend | simulatie, score, badges | `src/config/curriculum.ts:111`; `src/config/templateRegistry.ts:33`; `src/features/missions/templates/simulation-lab/configs/ai-spiegel.ts:146` |
| J1P3 | `social-safeguard` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:112`; `src/config/templateRegistry.ts:15`; `src/features/missions/templates/scenario-engine/configs/social-safeguard.ts:5` |
| J1P3 | `scroll-stopper` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, tekstzwaar | `src/config/curriculum.ts:113`; `src/config/templateRegistry.ts:85`; `src/features/missions/templates/debate-arena/configs/scroll-stopper.ts:5` |
| J1P3 | `cookie-crusher` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:114`; `src/config/templateRegistry.ts:11`; `src/features/missions/templates/scenario-engine/configs/cookie-crusher.ts:5` |
| J1P3 | `mail-detective` | mission | scenario-engine | 4.3 | Leuk genoeg | detectivefantasie, rondes, score | `src/config/curriculum.ts:115`; `src/config/templateRegistry.ts:10`; `src/features/missions/templates/scenario-engine/configs/mail-detective.ts:56` |
| J1P3 | `data-handelaar` | mission | puzzle-lab | 4.3 | Leuk genoeg | puzzelstructuur | `src/config/curriculum.ts:116`; `src/config/templateRegistry.ts:26`; `src/features/missions/templates/puzzle-lab/configs/data-handelaar.ts:5` |
| J1P3 | `filter-bubble-breaker` | mission | custom | 3.4 | Matig/statisch | score en fases, maar reflectief | `src/config/curriculum.ts:117`; `src/features/missions/FilterBubbleBreakerMission.tsx:45`; `src/features/missions/FilterBubbleBreakerMission.tsx:247` |
| J1P3 | `datalekken-rampenplan` | mission | custom | 3.7 | Voldoende spelend | meerfasige score | `src/config/curriculum.ts:118`; `src/features/missions/DatalekkenRampenplanMission.tsx:123`; `src/features/missions/DatalekkenRampenplanMission.tsx:657` |
| J1P3 | `data-voor-data` | mission | custom | 3.4 | Matig/statisch | rondes en score, maar tekstueel privacythema | `src/config/curriculum.ts:119`; `src/features/missions/DataVoorDataMission.tsx:162`; `src/features/missions/DataVoorDataMission.tsx:299` |
| J1P3 | `data-speurder` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:120`; `src/config/templateRegistry.ts:20`; `src/features/missions/templates/scenario-engine/configs/data-speurder.ts:5` |
| J1P3 | `digitale-balans-coach` | mission | debate-arena | 3.2 | Matig/statisch | rolcontext, eerste fase lezen | `src/config/curriculum.ts:121`; `src/config/templateRegistry.ts:84`; `src/features/missions/templates/debate-arena/configs/digitale-balans-coach.ts:5` |
| J1P4 | `mission-blueprint` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, badges | `src/config/curriculum.ts:130`; `src/config/templateRegistry.ts:63`; `src/features/missions/templates/builder-canvas/configs/mission-blueprint.ts:5` |
| J1P4 | `mission-vision` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, badges | `src/config/curriculum.ts:131`; `src/config/templateRegistry.ts:64`; `src/features/missions/templates/builder-canvas/configs/mission-vision.ts:5` |
| J1P4 | `mission-launch` | mission | tool-guide | 2.3 | Saai-risico | checklist-heavy | `src/config/curriculum.ts:132`; `src/config/templateRegistry.ts:100`; `src/features/missions/templates/tool-guide/configs/mission-launch.ts:5` |
| J1P4 | `review-week-3` | review | debate-arena | 3.2 | Matig/statisch | debat/ethiek, eerste fase lezen | `src/config/curriculum.ts:135`; `src/config/templateRegistry.ts:92`; `src/features/missions/templates/debate-arena/configs/review-week-3.ts:5` |
| J2P1 | `data-journalist` | mission | data-viewer | 3.7 | Voldoende spelend | chatcoach, datasetfases | `src/config/curriculum.ts:163`; `src/config/templateRegistry.ts:67`; `src/features/missions/templates/data-viewer/configs/data-journalist.ts:5` |
| J2P1 | `spreadsheet-specialist` | mission | data-viewer | 3.5 | Voldoende spelend | data-interactie, bonus/vertrouwen | `src/config/curriculum.ts:164`; `src/config/templateRegistry.ts:69`; `src/features/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:5` |
| J2P1 | `factchecker` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:165`; `src/config/templateRegistry.ts:16`; `src/features/missions/templates/scenario-engine/configs/factchecker.ts:5` |
| J2P1 | `api-verkenner` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:166`; `src/config/templateRegistry.ts:70`; `src/features/missions/templates/data-viewer/configs/api-verkenner.ts:5` |
| J2P1 | `dashboard-designer` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:167`; `src/config/templateRegistry.ts:71`; `src/features/missions/templates/data-viewer/configs/dashboard-designer.ts:5` |
| J2P1 | `ai-bias-detective` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:168`; `src/config/templateRegistry.ts:17`; `src/features/missions/templates/scenario-engine/configs/ai-bias-detective.ts:5` |
| J2P1 | `data-review` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:171`; `src/config/templateRegistry.ts:38`; `src/features/missions/templates/review-arena/configs/data-review.ts:5` |
| J2P2 | `algorithm-architect` | mission | simulation-lab | 4.1 | Voldoende spelend | simulatie, bonus/vertrouwen | `src/config/curriculum.ts:180`; `src/config/templateRegistry.ts:34`; `src/features/missions/templates/simulation-lab/configs/algorithm-architect.ts:161` |
| J2P2 | `web-developer` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:181`; `src/config/templateRegistry.ts:47`; `src/features/missions/templates/builder-canvas/configs/web-developer.ts:5` |
| J2P2 | `network-navigator` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:182`; `src/config/templateRegistry.ts:72`; `src/features/missions/templates/data-viewer/configs/network-navigator.ts:5` |
| J2P2 | `app-prototyper` | mission | builder-canvas | 3.9 | Voldoende spelend | builderstappen, bonus/vertrouwen | `src/config/curriculum.ts:183`; `src/config/templateRegistry.ts:53`; `src/features/missions/templates/builder-canvas/configs/app-prototyper.ts:5` |
| J2P2 | `bug-hunter` | mission | simulation-lab | 3.9 | Voldoende spelend | simulatie met instellingen | `src/config/curriculum.ts:184`; `src/config/templateRegistry.ts:31`; `src/features/missions/templates/simulation-lab/configs/bug-hunter.ts:153` |
| J2P2 | `automation-engineer` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:185`; `src/config/templateRegistry.ts:54`; `src/features/missions/templates/builder-canvas/configs/automation-engineer.ts:5` |
| J2P2 | `code-reviewer` | mission | simulation-lab | 3.9 | Voldoende spelend | simulatie | `src/config/curriculum.ts:186`; `src/config/templateRegistry.ts:32`; `src/features/missions/templates/simulation-lab/configs/code-reviewer.ts:151` |
| J2P2 | `privacy-by-design` | mission | simulation-lab | 4.1 | Voldoende spelend | simulatie, bonus/vertrouwen | `src/config/curriculum.ts:187`; `src/config/templateRegistry.ts:30`; `src/features/missions/templates/simulation-lab/configs/privacy-by-design.ts:154` |
| J2P2 | `wachtwoord-warrior` | mission | puzzle-lab | 4.3 | Leuk genoeg | puzzelstructuur | `src/config/curriculum.ts:188`; `src/config/templateRegistry.ts:25`; `src/features/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts:5` |
| J2P2 | `access-control-engineer` | mission | custom | 3.7 | Voldoende spelend | stappen en tests | `src/config/curriculum.ts:189`; `src/features/missions/AccessControlEngineerMission.tsx:44`; `src/features/missions/AccessControlEngineerMission.tsx:583` |
| J2P2 | `code-review-2` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:192`; `src/config/templateRegistry.ts:39`; `src/features/missions/templates/review-arena/configs/code-review-2.ts:5` |
| J2P3 | `ux-detective` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:201`; `src/config/templateRegistry.ts:76`; `src/features/missions/templates/data-viewer/configs/ux-detective.ts:5` |
| J2P3 | `podcast-producer` | mission | builder-canvas | 3.9 | Voldoende spelend | creatieflow, chatcoach | `src/config/curriculum.ts:202`; `src/config/templateRegistry.ts:48`; `src/features/missions/templates/builder-canvas/configs/podcast-producer.ts:5` |
| J2P3 | `meme-machine` | mission | builder-canvas | 3.7 | Voldoende spelend | creatieflow, badges | `src/config/curriculum.ts:203`; `src/config/templateRegistry.ts:51`; `src/features/missions/templates/builder-canvas/configs/meme-machine.ts:5` |
| J2P3 | `digital-storyteller` | mission | builder-canvas | 3.7 | Voldoende spelend | creatieflow, badges | `src/config/curriculum.ts:204`; `src/config/templateRegistry.ts:52`; `src/features/missions/templates/builder-canvas/configs/digital-storyteller.ts:5` |
| J2P3 | `brand-builder` | mission | builder-canvas | 3.9 | Voldoende spelend | creatieflow, bonus/vertrouwen | `src/config/curriculum.ts:205`; `src/config/templateRegistry.ts:49`; `src/features/missions/templates/builder-canvas/configs/brand-builder.ts:5` |
| J2P3 | `video-editor` | mission | builder-canvas | 3.7 | Voldoende spelend | creatieflow, badges | `src/config/curriculum.ts:206`; `src/config/templateRegistry.ts:50`; `src/features/missions/templates/builder-canvas/configs/video-editor.ts:5` |
| J2P3 | `online-helden` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:207`; `src/config/templateRegistry.ts:13`; `src/features/missions/templates/scenario-engine/configs/online-helden.ts:5` |
| J2P3 | `media-review` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:210`; `src/config/templateRegistry.ts:40`; `src/features/missions/templates/review-arena/configs/media-review.ts:5` |
| J2P4 | `ai-ethicus` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, eerste fase lezen | `src/config/curriculum.ts:219`; `src/config/templateRegistry.ts:86`; `src/features/missions/templates/debate-arena/configs/ai-ethicus.ts:5` |
| J2P4 | `digital-rights-defender` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, eerste fase lezen | `src/config/curriculum.ts:220`; `src/config/templateRegistry.ts:87`; `src/features/missions/templates/debate-arena/configs/digital-rights-defender.ts:5` |
| J2P4 | `tech-court` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, eerste fase lezen | `src/config/curriculum.ts:221`; `src/config/templateRegistry.ts:88`; `src/features/missions/templates/debate-arena/configs/tech-court.ts:5` |
| J2P4 | `future-forecaster` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, eerste fase lezen | `src/config/curriculum.ts:222`; `src/config/templateRegistry.ts:89`; `src/features/missions/templates/debate-arena/configs/future-forecaster.ts:5` |
| J2P4 | `eindproject-j2` | mission | data-viewer | 3.5 | Voldoende spelend | eindproduct met score, chatcoach | `src/config/curriculum.ts:223`; `src/config/templateRegistry.ts:80`; `src/features/missions/templates/data-viewer/configs/eindproject-j2.ts:5` |
| J3P1 | `ml-trainer` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:252`; `src/config/templateRegistry.ts:74`; `src/features/missions/templates/data-viewer/configs/ml-trainer.ts:5` |
| J3P1 | `api-architect` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:253`; `src/config/templateRegistry.ts:55`; `src/features/missions/templates/builder-canvas/configs/api-architect.ts:5` |
| J3P1 | `neural-navigator` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:254`; `src/config/templateRegistry.ts:75`; `src/features/missions/templates/data-viewer/configs/neural-navigator.ts:5` |
| J3P1 | `data-pipeline` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:255`; `src/config/templateRegistry.ts:73`; `src/features/missions/templates/data-viewer/configs/data-pipeline.ts:5` |
| J3P1 | `open-source-contributor` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:256`; `src/config/templateRegistry.ts:56`; `src/features/missions/templates/builder-canvas/configs/open-source-contributor.ts:5` |
| J3P1 | `advanced-code-review` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:259`; `src/config/templateRegistry.ts:42`; `src/features/missions/templates/review-arena/configs/advanced-code-review.ts:5` |
| J3P2 | `cyber-detective` | mission | puzzle-lab | 4.3 | Leuk genoeg | puzzelstructuur | `src/config/curriculum.ts:268`; `src/config/templateRegistry.ts:24`; `src/features/missions/templates/puzzle-lab/configs/cyber-detective.ts:5` |
| J3P2 | `encryption-expert` | mission | puzzle-lab | 4.3 | Leuk genoeg | puzzelstructuur | `src/config/curriculum.ts:269`; `src/config/templateRegistry.ts:23`; `src/features/missions/templates/puzzle-lab/configs/encryption-expert.ts:5` |
| J3P2 | `phishing-fighter` | mission | scenario-engine | 4.3 | Leuk genoeg | scenario-keuzes, bonus/vertrouwen | `src/config/curriculum.ts:270`; `src/config/templateRegistry.ts:14`; `src/features/missions/templates/scenario-engine/configs/phishing-fighter.ts:5` |
| J3P2 | `security-auditor` | mission | puzzle-lab | 4.3 | Leuk genoeg | puzzelstructuur | `src/config/curriculum.ts:271`; `src/config/templateRegistry.ts:27`; `src/features/missions/templates/puzzle-lab/configs/security-auditor.ts:5` |
| J3P2 | `digital-forensics` | mission | scenario-engine | 4.1 | Voldoende spelend | scenario-keuzes | `src/config/curriculum.ts:272`; `src/config/templateRegistry.ts:18`; `src/features/missions/templates/scenario-engine/configs/digital-forensics.ts:5` |
| J3P2 | `security-review` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:275`; `src/config/templateRegistry.ts:41`; `src/features/missions/templates/review-arena/configs/security-review.ts:5` |
| J3P3 | `startup-simulator` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:284`; `src/config/templateRegistry.ts:57`; `src/features/missions/templates/builder-canvas/configs/startup-simulator.ts:5` |
| J3P3 | `policy-maker` | mission | debate-arena | 3.4 | Matig/statisch | debatfases, eerste fase lezen | `src/config/curriculum.ts:285`; `src/config/templateRegistry.ts:90`; `src/features/missions/templates/debate-arena/configs/policy-maker.ts:5` |
| J3P3 | `innovation-lab` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:286`; `src/config/templateRegistry.ts:58`; `src/features/missions/templates/builder-canvas/configs/innovation-lab.ts:5` |
| J3P3 | `digital-divide-researcher` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:287`; `src/config/templateRegistry.ts:77`; `src/features/missions/templates/data-viewer/configs/digital-divide-researcher.ts:5` |
| J3P3 | `tech-impact-analyst` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:288`; `src/config/templateRegistry.ts:78`; `src/features/missions/templates/data-viewer/configs/tech-impact-analyst.ts:5` |
| J3P3 | `welzijnsonderzoeker` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:289`; `src/config/templateRegistry.ts:68`; `src/features/missions/templates/data-viewer/configs/welzijnsonderzoeker.ts:28` |
| J3P3 | `startup-pitch` | mission | tool-guide | 2.3 | Saai-risico | checklist-heavy | `src/config/curriculum.ts:290`; `src/config/templateRegistry.ts:101`; `src/features/missions/templates/tool-guide/configs/startup-pitch.ts:5` |
| J3P3 | `impact-review` | review | review-arena | 4.8 | Leuk genoeg | mini-games | `src/config/curriculum.ts:293`; `src/config/templateRegistry.ts:43`; `src/features/missions/templates/review-arena/configs/impact-review.ts:5` |
| J3P4 | `portfolio-builder` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:302`; `src/config/templateRegistry.ts:59`; `src/features/missions/templates/builder-canvas/configs/portfolio-builder.ts:5` |
| J3P4 | `research-project` | mission | data-viewer | 3.3 | Matig/statisch | datasetwerkblad met score | `src/config/curriculum.ts:303`; `src/config/templateRegistry.ts:79`; `src/features/missions/templates/data-viewer/configs/research-project.ts:5` |
| J3P4 | `prototype-developer` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:304`; `src/config/templateRegistry.ts:60`; `src/features/missions/templates/builder-canvas/configs/prototype-developer.ts:5` |
| J3P4 | `pitch-perfect` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:305`; `src/config/templateRegistry.ts:61`; `src/features/missions/templates/builder-canvas/configs/pitch-perfect.ts:5` |
| J3P4 | `reflection-report` | mission | debate-arena | 3.4 | Matig/statisch | debat/reflectie, eerste fase lezen | `src/config/curriculum.ts:306`; `src/config/templateRegistry.ts:91`; `src/features/missions/templates/debate-arena/configs/reflection-report.ts:5` |
| J3P4 | `meesterproef` | mission | builder-canvas | 3.7 | Voldoende spelend | builderstappen, chatcoach | `src/config/curriculum.ts:307`; `src/config/templateRegistry.ts:62`; `src/features/missions/templates/builder-canvas/configs/meesterproef.ts:5` |

## Concrete verbeterclusters

1. Maak ToolGuide minder lineair.
   Voeg per tool minstens 1 echte microchallenge toe: tijdsdruk optioneel, fout-diagnose, keuze met feedback, of drag/drop/sorteren. Huidige score/badge blijft behouden, maar de eerste interactie moet meer zijn dan checklist afvinken.

2. Herpak J1 agent-role opdrachten als mini-missies.
   `game-programmeur` en `ai-trainer` verdienen een zichtbare simulatie of testarena. Nu zit de fun vooral in de naam en briefing; Chrome toont vooral "Volgende".

3. Geef DataViewer een detective-/onderzoekslus.
   Voeg per dataset een "hypothese kiezen", "bewijs pinnen" of "misleiding spotten" mechaniek toe. Dan blijft de sterke data-inhoud bestaan, maar voelt het minder als tabelvragen.

4. Maak DebateArena actiever in de eerste minuut.
   Start met een stem/keuze of dilemma-kaart voordat leerlingen alle stakeholders lezen. De engine heeft score/fases, maar de eerste fase voelt nu passief.

5. Gebruik ReviewArena als patroon voor herontwerp.
   ReviewArena bewijst dat sorteren, koppelen en categoriseren met korte rondes goed werkt. Dit patroon kan ToolGuide, DataViewer en DebateArena optillen zonder nieuwe zware engine.

## Beperkingen

- Niet alle 96 opdrachten zijn dynamisch diep uitgespeeld; Chrome-triage is representatief en gericht op lage/verdachte scores plus sterke referenties.
- Mobiele/iPad startbaarheid en eerste interactie zijn volledig apart geemuleerd voor alle 96 opdrachten: mobile 390x844 en iPad portrait 820x1180. De check bewijst geen volledige afronding per opdracht.
- Voltooiingsstaten zijn alleen statisch en beperkt dynamisch beoordeeld; het rapport claimt geen end-to-end completion voor elke opdracht.
- De telling volgt de huidige werkboom. De planverwachting van 97 opdrachten lijkt verouderd ten opzichte van `src/config/curriculum.ts`.

## Self-check

- Telling gecontroleerd tegen `src/config/curriculum.ts`: 96 curriculum-/reviewopdrachten en 12 assessments.
- Alle hoofdbevindingen hebben file:regel-bewijs of Chrome-artifactverwijzing.
- Geen productfixes uitgevoerd.
- Chrome plugin gebruikt; browserdeel niet onbewezen.
- Mobile/iPad-emulatie toegevoegd: 192 volledige Chrome-CDP checks plus 1 gerichte recheck; 0 echte startfailures, 0 overflow, 0 relevante console/network errors.
- `npm run typecheck` eindigde zonder fouten.
