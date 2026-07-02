# Batch-review wave 16 — verse reviews (2026-07-02)

Vijf missies beoordeeld. Bijzonderheid: twee reviews werden afgebroken door de sessielimiet, maar hun rapporten stonden al volledig op schijf — de uitkomsten zijn daaruit hersteld en de fixes alsnog toegepast (met gates). (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| mission-vision | 9 / 8.5 / 9 | 1.2 | ok | 0 | fixed | geen |
| open-source-contributor | 7 / 6 / 8 | 3.1 | fix-eerst | 0 | blocked | 1) SLO-bronconflict: mapping zegt 22B/23C, coach zegt 22A/22B — welke set is leidend? 2) platform belooft een licentie-leerdoel (MIT/GPL) dat nergens in de missie voorkomt — schrappen of content toevoegen (voorstellen klaar) |
| social-safeguard | 8.5 / 9 / 9.5 | 1.0 | fix-eerst | 0 | blocked | 1) ronde 1+4 tonen 8 items per scherm (leerjaar-1-richtlijn 3-4) 2) welzijn: bij een fysieke-dreiging-scenario wordt 0900-8844 genoemd zonder 112-verwijzing — veiligheidsprecisering aan jou |
| sustainability-scanner | 7 / 6 / 8 | 3.1 | fix-eerst | 2 (coach-SLO-tekst volgt nu de mapping; q8 telt 10 participatiepunten → som exact 100) | blocked | identiteit: naam/blad-icoon beloven duurzaamheid, de inhoud is mediaconsumptie-trends zonder ethiekcomponent — hernoemen/verplaatsen? (icoon-voorstel klaar; id-hernoemen raakt 8+ bestanden) |
| tech-impact-analyst | 9 / 8.5 / 6 | 2.1 | fix-eerst | 1 (q8 telt nu 15 punten → som exact 100; q8 is nota bene de énige AI-vraag — 0 punten ondergewaardeerde het AI-kerndoel) | fixed* | geen |

*na Codex-gate.

## Conventie-notitie voor Yorin (punten-patroon definitief in kaart)

De slot-reflectievraag met `points: 0` blijkt een **cross-missie auteurspatroon** (sustainability-scanner, tech-impact-analyst, eerder ux-detective, eindproject-j2, ml-trainer, data-pipeline, digital-divide-researcher, neural-navigator). Deze run heeft het per missie gelijkgetrokken (punten laten meetellen óf maxScore verlagen — 7 gevallen, alle met gate-goedkeuring), maar het verdient één vastgelegde conventie voor toekomstige missies: *tellen reflectievragen mee als participatiepunten (aanbevolen — engine keert ze automatisch uit) of blijven ze op 0 met een verlaagde maxScore?*

## Codex-gates

- sustainability-scanner (2) en tech-impact-analyst (1): uitslag in status-index en PR.
