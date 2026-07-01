# Batch-review wave 12 — verse reviews (2026-07-02)

Vijf missies beoordeeld: vier gezond (waarvan drie met volledig nagerekende antwoordmodellen/scoring), één met serieuze toegankelijkheidsproblemen. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| cloud-cleaner | 6.5 / 7.5 / 5.5 | 3.40 | fix-eerst | 1 (dashboard-SLO +23A conform mapping — 6e alignment-fix) | blocked | 1) sleep-interactie volledig ontoegankelijk zonder muis/touch (0 toetsenbord-ondersteuning) — aparte toegankelijkheidsronde? 2) mobiele actieknop overlapt bestandskaarten (open sinds audit 30 juni) |
| code-reviewer | 8 / 9 / 9 | 1.3 | ok | 0 | fixed | geen — scoring 30+40+30=100 exact |
| dashboard-designer | 9 / 8 / 9 | 1.4 | ok | 0 | fixed | geen — antwoordmodellen 100% nagerekend |
| data-pipeline | 8 / 7 / 8 | 2.4 | ok | 1 (q8-reflectie telt nu 10 participatiepunten mee → som exact 100) | fixed* | geen |
| digitale-balans-coach | 8.5 / 9 / 9 | 1.15 | ok | 0 | fixed | geen — welzijnsgevoelige content expliciet schoon bevonden |

*na Codex-gate.

## Gedeelde lijst (aanvullingen)

- **Puntensom ≠ maxScore is een engine-breed patroon:** 7 van de 15 data-viewer-configs hebben het gat (meestal een text-observation-vraag met 0 punten). Drie zijn er nu per missie gefixt (research-project, ml-trainer, data-pipeline) met gate-goedkeuring; de rest kan in één veegronde mee zodra hun missies aan de beurt zijn.
- cloud-cleaner bevestigt de al gedocumenteerde mobiele FAB-overlap (audit 30 juni, prioriteit 4) — nog altijd open.
