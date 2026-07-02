# Batch-review wave 13 — verse reviews (2026-07-02)

Vijf missies beoordeeld: drie gezond (met nagerekende puzzels en scores), één met een echte rekenfout in de lesstof (gefixt), één met een misleidende briefing op een welzijnsgevoelig thema (naar Yorin). (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| meme-machine | 8.5 / 7.5 / 8.5 | 1.9 | ok | 1 (checklist-item over auteursrecht/bronvermelding toegevoegd — dekte kwetsen/inclusiviteit maar niet de juridische herkomst-vraag) | blocked | coach-plan-desync (5e geval, nu ook leerjaar 2) — mét prioriteit: de gemiste 4e stap is juist het welzijns-/ethiekonderdeel |
| mission-launch | 8.5 / 9 / 9.5 | 1.0 | ok | 0 | fixed | geen — scoreplafond 60=60 exact |
| neural-navigator | 8 / 7 / 8 | 2.4 | fix-eerst | 3 (tabelwaarden Neuron A 0,69→0,68 en Neuron C 0,81→1,01 — de formule die de missie zelf leert gaf andere uitkomsten, bij C was de bias vergeten; q8 telt nu 10 participatiepunten → som exact 100) | fixed* | geen |
| scroll-stopper | 8 / 5 / 9 | 2.9 | fix-eerst | 0 | blocked | briefing belooft een dark-pattern-CEO-rollenspel, de missie is een stakeholder-debat — misleidend voor leerlingen; herschrijfvoorstel klaar, maar thema (schermtijd/verslaving) is welzijnsgevoelig dus jouw keuze |
| security-auditor | 8.5 / 8 / 8.5 | 1.70 | ok | 0 | fixed | geen — alle 4 puzzels feitelijk nagerekend |

*na Codex-gate.

## Platform-inzicht (nieuw, geverifieerd)

**STEP_COMPLETE-markers doen in builder-canvas-missies functioneel niets.** Een hulp-verificatie bevestigde: de marker-verwerking leeft uitsluitend in de AI-Lab-werkbank (`useAgentLogic`-keten); de chat die builder-canvas-missies gebruiken stuurt de marker-instructie wel mee naar de AI maar verwerkt het antwoord nooit (de chatbubbel stript het token alleen cosmetisch). Gevolg voor het coach-desync-beslispunt: het gaat puur om de **coaching-tekstkwaliteit** (de coach vertelt een verkeerd stappenplan), niet om kapotte voortgangsregistratie. Dat maakt optie (a) — briefings herschrijven naar het canvasmodel — nog duidelijker de juiste route.

## Codex-gates

- neural-navigator (3 fixes) en meme-machine (1 fix): uitslag in status-index en PR.
