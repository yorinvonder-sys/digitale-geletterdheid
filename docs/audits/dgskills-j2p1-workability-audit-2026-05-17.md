# DGSkills J2 P1 Workability Audit

Datum: 2026-05-17
Scope: Leerjaar 2, periode 1 - Data & Informatie
Opdrachten: `data-journalist`, `spreadsheet-specialist`, `factchecker`, `api-verkenner`, `dashboard-designer`, `ai-bias-detective`, `data-review`

## Coordinator Summary

J2 P1 is inhoudelijk sterk genoeg om verder te brengen, maar nog geen release-kandidaat. Alle zeven opdrachten starten in `@Chrome` en de eerste interactie is aantoonbaar bereikbaar, maar geen enkele opdracht toont een expliciet doel/evidencecontract in de intro. Daarnaast zijn completion en docentbewijs te zwak: DataViewer en ReviewArena accepteren completion te generiek, ScenarioEngine accepteert al vanaf 40% score, en open tekstbewijs telt bij DataViewer altijd als correct.

Formeel oordeel per opdracht:

| Opdracht | Oordeel | Kortste beslisbare conclusie |
|---|---|---|
| `data-journalist` | `fix-eerst` | Route/start/interactie werkt, maar doel/evidence en tekstbewijs zijn te zwak. |
| `spreadsheet-specialist` | `fix-eerst` | Didactisch passend, maar tekst- en formulebewijs wordt niet streng genoeg beoordeeld. |
| `factchecker` | `fix-eerst` | Sterke opdracht, maar completiondrempel en gevoelige medische voorbeelden moeten steviger worden ingekaderd. |
| `api-verkenner` | `fix-eerst` | Goede API-opbouw, maar doel/evidence en CTA/completionbewijs ontbreken. |
| `dashboard-designer` | `fix-eerst` | Sterke datavisualisatie-opdracht, maar cognitieve belasting en evidencecontract vragen een fix. |
| `ai-bias-detective` | `menselijke keuze nodig` | Inhoudelijk relevant, maar gevoelige biasvoorbeelden en docentkader moeten menselijk gekozen worden. |
| `data-review` | `fix-eerst` | Privacy/security-review is nuttig, maar ReviewArena completion en follow-up state zijn te zwak. |

## Bewijsbasis

Uitgevoerd:

- `npm run context:budget`
- Static inspectie van curriculum, template registry, SLO-koppeling, missieconfigs en template-engines.
- Vier read-only subagentanalyses: static contract, design/didactiek, techniek/completion, browser QA.
- `@Chrome` extensiecheck: Chrome draait, extensie ingeschakeld, native host correct.
- `@Chrome` smoke op alle 7 opdrachten via `/dev/mission-preview?mission=<id>&reset=1`.

Niet volledig uitgevoerd:

- De verplichte Chrome viewportmatrix is nog niet formeel rond. De `@Chrome` extensie-route kon een zichtbare tab claimen en bedienen, maar gaf geen betrouwbare viewport-override voor desktop, iPad portrait, iPad landscape en mobile.
- Een sidecar-agent draaide wel een Chrome-CDP matrix, maar omdat Yorin expliciet `@Chrome` vroeg, telt die CDP-run niet als formeel browserbewijs in dit rapport.
- Echte iPad/Safari is nog niet uitgevoerd.

Artefacten:

- `@Chrome` smoke JSON: `/private/tmp/dgskills-j2p1-chrome-plugin-smoke/results.json`
- `@Chrome` screenshots: `/private/tmp/dgskills-j2p1-chrome-plugin-smoke/*-chrome-plugin-locator.png`

## Static Contract

Curriculum en routing kloppen als basis:

- J2 P1 bevat 6 reguliere missies en 1 reviewmissie in `src/config/curriculum.ts:158`.
- Template mapping is coherent:
  - DataViewer: `data-journalist`, `spreadsheet-specialist`, `api-verkenner`, `dashboard-designer` in `src/config/templateRegistry.ts:67`.
  - ScenarioEngine: `factchecker`, `ai-bias-detective` in `src/config/templateRegistry.ts:16`.
  - ReviewArena: `data-review` in `src/config/templateRegistry.ts:38`.
- SLO-koppeling bestaat voor alle zeven opdrachten in `src/config/slo-kerndoelen-mapping.ts:97`.

Contractgaten:

- Geen van de zeven J2 P1-opdrachten heeft een expliciet `missionGoal` of evidencecontract in de missieconfig.
- De intro gebruikt wel `config.missionGoal ?? getMissionGoal(config.missionId)`, maar voor J2 P1 levert dat geen zichtbaar doel/evidencebewijs op.
- Eerdere brede audits markeerden J2 P1 al als completion/no-button-risico, vooral bij DataViewer en ReviewArena.

## Techniek En Completion

Belangrijkste enginebevindingen:

| Engine | Bevinding | Bewijs | Risico | Actie |
|---|---|---|---|---|
| DataViewer | `text-observation` krijgt altijd punten en telt altijd als correct. | `src/features/missions/templates/data-viewer/DataViewer.tsx:78`, `src/features/missions/templates/data-viewer/DataViewer.tsx:102` | Leerling kan zwak bewijs leveren en toch slagen. | Rubric/criterium toevoegen voor observatievragen. |
| DataViewer | Completion roept `onComplete(true)` aan zodra results voltooid worden. | `src/features/missions/templates/data-viewer/DataViewer.tsx:591` | Completion zegt weinig over bewijsniveau. | Completion koppelen aan score, criteria en ingeleverd bewijs. |
| ScenarioEngine | Completion is `totalScore >= maxScore * 0.4`. | `src/features/missions/templates/scenario-engine/ScenarioEngine.tsx:180` | Te lage release- en leerbewijsdrempel. | Drempel en eindstaat per missie expliciet maken. |
| ReviewArena | Follow-up verschijnt alleen bij `score > 50%`, niet bij exact 50%, en pending state is lokaal. | `src/features/missions/templates/review-arena/ReviewArena.tsx:176` | Randscore/follow-up kan inconsistent zijn; refresh kan state verliezen. | Follow-upregel expliciet kiezen en state autosaven. |
| ReviewArena | Completion roept altijd `onComplete(true)` aan. | `src/features/missions/templates/review-arena/ReviewArena.tsx:212` | Review afronden is niet gelijk aan voldoende evidence. | Completion koppelen aan rondecriteria en docentbewijs. |

## Design En Didactiek

| Opdracht | Sterk | Risico | Voorgestelde actie |
|---|---|---|---|
| `data-journalist` | Goede journalistieke dataflow met datasets en observatie. | Open antwoord wordt te makkelijk geaccepteerd. | Mini-rubric voor observatie en eindbewijs toevoegen. |
| `spreadsheet-specialist` | Duidelijke spreadsheetcontext met formules en interpretatie. | Formulebegrip en tekstbewijs zijn niet hard genoeg. | Criteria voor formule-uitleg en interpretatiebewijs toevoegen. |
| `factchecker` | Sterke CRAAP/source-ranking opbouw. | Gezondheid/medicatie/COVID-achtige voorbeelden vragen docentframing. | Completiondrempel verhogen en gevoelige casussen kaderen. |
| `api-verkenner` | Begrijpelijke opbouw van API-concepten. | Demo key, appdata en privacyrisico's moeten explicieter. | Evidencecontract plus privacy/API-kader toevoegen. |
| `dashboard-designer` | Sterke koppeling tussen publiek, grafiektype en hiërarchie. | Relatief hoge cognitieve belasting zonder zichtbaar doelbewijs. | Doel, criteria en eindproductbeschrijving bovenaan tonen. |
| `ai-bias-detective` | Relevante en urgente AI-geletterdheid. | Bias rond gender, huidskleur en zorg vraagt menselijke didactische keuze. | Menselijk kader kiezen; typo `mensenlijk toezicht` fixen. |
| `data-review` | Goede combinatie van datatypes, beveiliging en AVG. | AVG/security kan te simplistisch worden afgerond. | Rondecriteria en docentbewijs expliciteren. |

## @Chrome Smoke

Route: `http://127.0.0.1:5191/dev/mission-preview?mission=<id>&reset=1`
Gemeten viewport in de claimbare `@Chrome` tab: `1280x511`, DPR 2.
Let op: dit is geen volwaardige desktop/iPad/mobile matrix.

| Opdracht | Route/start | Doel/evidence zichtbaar | Eerste interactie | Console | Overflow/CTA |
|---|---|---:|---|---|---|
| `data-journalist` | Pass | Nee | Tekst/input/radio + bevestigen gelukt | 0 errors | Geen horizontale overflow; kleine viewport toont niet alle CTA-context. |
| `spreadsheet-specialist` | Pass | Nee | Tekst/input/radio + bevestigen gelukt | 0 errors | Geen horizontale overflow; meerdere knoppen buiten zicht door korte viewport. |
| `factchecker` | Pass | Nee | Scenario-keuze klikbaar | 0 errors | Geen horizontale overflow; lange keuze-kaarten vragen scroll. |
| `api-verkenner` | Pass | Nee | Tekst/input/radio + dataset-advance gelukt | 0 errors | Geen horizontale overflow; korte viewport beperkt overzicht. |
| `dashboard-designer` | Pass | Nee | Tekst/input/radio + dataset-advance gelukt | 0 errors | Geen horizontale overflow; korte viewport beperkt overzicht. |
| `ai-bias-detective` | Pass | Nee | Keuzekaart klikbaar | 0 errors | Geen horizontale overflow; gevoelige lange kaarten vragen scroll. |
| `data-review` | Pass | Nee | Keuze + bevestigen + volgende ronde gelukt | 0 errors | Geen horizontale overflow; reviewkaart past inhoudelijk redelijk. |

## Blokkades

1. Doel/evidence ontbreekt zichtbaar bij alle zeven missies.
2. Completion is niet hard genoeg gekoppeld aan leerlingbewijs.
3. DataViewer accepteert observatievragen als correct zonder rubric.
4. ScenarioEngine heeft een lage generieke completiondrempel.
5. ReviewArena completion en follow-up state zijn onvoldoende robuust.
6. `ai-bias-detective` vraagt menselijke didactische keuze rond gevoelige voorbeelden.
7. De formele Chrome viewportmatrix is nog open voor `@Chrome`; echte iPad/Safari blijft apart open.

## Aanbevolen Fixbatch

1. Voeg `missionGoal`/criteria/evidence toe aan alle zeven J2 P1-configs.
2. Pas DataViewer-observatievragen aan naar rubricgedreven feedback of minimale criteria.
3. Maak completionregels per engine aantoonbaar: score, alle rondes/datasets, eindbewijs en docenttekst.
4. Herkader `factchecker`, `api-verkenner` en `ai-bias-detective` didactisch op gevoelige casussen, privacy en bias.
5. Draai daarna gericht opnieuw:
   - `@Chrome` viewportmatrix.
   - Completionpoging per engine.
   - Een regressie op DataViewer, ScenarioEngine en ReviewArena.

## Hercheck 2026-05-18

Status: `fix deels groen`, met formele deployblocker op de `@chrome` extensietool.

### Wat is aangepast

- Alle zeven J2 P1-configs hebben nu een zichtbaar `missionGoal` met leerdoel, succescriteria, threshold en leerling-/docentbewijs.
- DataViewer-observatievragen in J2 P1 hebben rubricachtige `textEvidenceCriteria`; zwakke korte tekst krijgt geen evidencepunten en kan completion blokkeren.
- DataViewer, ScenarioEngine en ReviewArena koppelen `onComplete(success)` aan score-threshold en afgeronde rondes/datasets.
- ReviewArena opent follow-up nu bij `>= 50%` ronde-score.
- CompletionScreen toont nu `Bewijs compleet` of `Nog niet voltooid` plus leerling-/docentbewijs.
- `ai-bias-detective` behoudt de concrete casussen, krijgt extra respectvol didactisch kader en corrigeert `mensenlijk toezicht` naar `menselijk toezicht`.

### Bewijs

- `node scripts/check-j2p1-workability-contract.mjs`: groen voor 7 missies.
- `npm run doctor`: groen.
- `npm run build:prod`: groen; Vite chunk-size waarschuwing blijft bestaand buildsignaal, geen blocker voor deze fix.
- Lokale Google Chrome CDP-check op `http://127.0.0.1:5192/dev/mission-preview?mission=<id>&reset=1`: groen voor J2 P1 viewportmatrix en regressies.
- Screenshots: `/private/tmp/dgskills-j2p1-cdp-qa/*.png`.

Viewportmatrix met Chrome-CDP:

| Scope | Desktop | iPad portrait 1024x1366 | iPad landscape 1366x1024 | Mobile 390x844 | Resultaat |
|---|---:|---:|---:|---:|---|
| `data-journalist` | ja | ja | ja | ja | goal/evidence, start, flow, feedback, geen console/overflow blocker |
| `spreadsheet-specialist` | ja | ja | ja | ja | goal/evidence, start, flow, feedback, geen console/overflow blocker |
| `factchecker` | ja | ja | ja | ja | goal/evidence, start, scenariofeedback, geen console/overflow blocker |
| `api-verkenner` | ja | ja | ja | ja | goal/evidence, start, flow, feedback, geen console/overflow blocker |
| `dashboard-designer` | ja | ja | ja | ja | goal/evidence, start, flow, feedback, geen console/overflow blocker |
| `ai-bias-detective` | ja | ja | ja | ja | goal/evidence, start, scenariofeedback, geen console/overflow blocker |
| `data-review` | ja | ja | ja | ja | goal/evidence, start, reviewfeedback, geen console/overflow blocker |
| Regressie `network-navigator` | ja | ja | ja | ja | DataViewer-regressie groen |
| Regressie `data-speurder` | ja | ja | ja | ja | ScenarioEngine-regressie groen |
| Regressie `code-review-2` | ja | ja | ja | ja | ReviewArena-regressie groen |

Eindstate-smoke:

| Missie | Viewports | Resultaat |
|---|---|---|
| `data-journalist` | desktop, iPad portrait, iPad landscape, mobile | `Bewijs compleet`, CTA en leerling-/docentbewijs zichtbaar |
| `factchecker` | desktop, iPad portrait, iPad landscape, mobile | `Bewijs compleet`, CTA en leerling-/docentbewijs zichtbaar |
| `data-review` | desktop, iPad portrait, iPad landscape, mobile | `Bewijs compleet`, CTA en leerling-/docentbewijs zichtbaar |
| Regressie `code-review-2` | desktop, iPad portrait, iPad landscape, mobile | `Bewijs compleet`, CTA en leerling-/docentbewijs zichtbaar |

### Resterende risico's

- De expliciet gevraagde `@chrome` extensie is in deze Codex-sessie niet als callable tool beschikbaar na tool discovery. Daarom telt de Chrome-CDP-run als technisch browserbewijs, maar niet als formeel `@chrome` extensiebewijs.
- Live deploy blijft geblokkeerd totdat de `@chrome` extensie zelf callable is of Yorin expliciet akkoord geeft dat CDP-bewijs volstaat.
- Echte iPad/Safari-check blijft open; Chrome-emulatie bewijst geen Safari-specifiek gedrag.
