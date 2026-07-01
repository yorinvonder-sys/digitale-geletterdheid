# Batch-review wave 9 — verse reviews (2026-07-01)

Vijf nooit-gereviewde missies beoordeeld. Sterkste vondst: het antwoordmodel van ml-trainer rekende een goed rekenende leerling fout. Twee missies hebben een identieke inhoudelijke keuze voor Yorin (chat-coach-plan ≠ canvas-stappen). (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| meesterproef | 8.5 / 7.5 / 8.5 | 1.90 | ok | 0 | blocked | coach beschrijft 3 fasen, canvas heeft 4 stappen — herschrijfvoorstel ligt klaar |
| ml-trainer | 8 / 8 / 3 | 3.5 | fix-eerst | 2 (antwoordmodel q1: dataset telt 5/12 spam = 42%, "50" werd goedgerekend en de uitleg verzon een zesde rij; q8 telt nu 10 participatiepunten mee → som exact 100) | fixed* | geen |
| pitch-perfect | 8 / 7 / 8.5 | 2.25 | ok | 0 | blocked | 22A-claim (digitale producten) zwak onderbouwd — zelfde curator-vraag als brand-builder/data-journalist |
| pitch-police | 3 / 4 / 2 | 6.9 | fix-eerst | 1 (dashboard-SLO 22B→22A conform mapping) | blocked | kwaliteit laag over de hele linie (2 blockers + 4 warnings); intro-knop oogt uitgeschakeld (platform-intro-patroon) — opknapronde nodig |
| podcast-producer | 8 / 6 / 8 | 2.8 | fix-eerst | 0 | blocked | ACTIEVE chat-coach hanteert een eigen 3-stappenplan terwijl het canvas 4 stappen heeft — kies welke structuur leidend is (herschrijfvoorstel klaar) |

*na Codex-gate.

Orchestrator-notities: (1) de q8-participatiepunten-fix is pas toegepast ná verificatie dat de engine `text-observation`-vragen altijd hun volle punten toekent (regel 78 DataViewer) — dat bevestigt met terugwerkende kracht ook de research-project-fix uit wave 6; (2) engine-kennis: number-input heeft 5% tolerantie, dus antwoord 42 accepteert 41,7; (3) de coach-plan-vs-canvas-desync bij podcast-producer en meesterproef is bewust NIET mechanisch toegepast (les digital-forensics: structurele content-herschrijvingen door mensen laten kiezen); (4) reviewer flagde zelfstandig een wees-component (MLTrainerMission.tsx, nergens geïmporteerd) als apart taakje.

### Codex-gates

- ml-trainer (2 fixes) en pitch-police (1 fix): uitslag in status-index en PR.
