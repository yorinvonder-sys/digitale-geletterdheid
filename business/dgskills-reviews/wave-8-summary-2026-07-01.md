# Batch-review wave 8 — verse reviews (2026-07-01)

Vijf nooit-gereviewde missies beoordeeld op vormgeving, leerwaarde en techniek. Drie zijn gezond en klaar; twee kregen fixes en houden elk één inhoudelijke keuze voor Yorin open. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| data-journalist | 8 / 6 / 9 | 2.5 | fix-eerst | 3 (AI-coach-briefing gelijkgetrokken met de echte missie: scenario, doel en voorbeeldvraag gingen over een niet-bestaand energie/infographic-scenario) | blocked | SLO-claim 22A (digitale producten) is dun — de missie heeft alleen analysevragen, geen productbouw. Claim laten staan of mapping aanpassen? |
| deepfake-detector | 8 / 7 / 9 | 2.1 | fix-eerst | 1 (dashboard toont nu ook AI-kerndoel 21D, conform autoritaire mapping) | blocked | de AI-hulp beschrijft 5 voorbeelden, het spel toont er 9 — kies welke bron leidend is |
| encryption-expert | 9 / 9 / 8 | 1.3 | ok | 0 | fixed | geen — alle puzzels zelf nagerekend (Caesar, Base64), puntensom exact 100 |
| factchecker | 8.5 / 8.5 / 7 | 1.95 | ok | 0 | fixed | geen — 22 inhoudsclaims feitelijk gecheckt, 0 fouten |
| magister-master | 8 / 8 / 8 | 2.0 | ok | 0 | fixed | geen — alle 3 blockers uit de juni-review bevestigd opgelost |

NB orchestrator-correcties: drie agents gebruikten een verkeerde score-schaal (issue-tellingen of omgekeerd) — kwaliteitsscores en triage zijn bij intake gecorrigeerd; wave-9-prompts vermelden de schaal nu expliciet. Bij data-journalist is het `missionObjective`-veld als orchestrator-aanvulling meegenomen (het rapport stelde 2 van de 3 samenhangende velden voor; 2/3 fixen zou de entry intern tegenstrijdig maken) — de Codex-gate toetst alle drie.

### Codex-gates

- data-journalist (3 fixes) en deepfake-detector (1 fix): uitslag in status-index en PR.
