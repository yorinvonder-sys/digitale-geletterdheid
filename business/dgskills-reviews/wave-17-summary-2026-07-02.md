# Batch-review wave 17 — verse reviews (2026-07-02)

Vijf missies beoordeeld, twee met fixes. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| welzijnsonderzoeker | 8.5 / 9 / 9 | 1.15 | ok | 0 | fixed | geen — antwoordmodellen nagerekend, welzijnsthema netjes behandeld |
| automation-engineer | 10 / 10 / 10 | 0.0 | ok | 0 | fixed | geen — foutloos |
| app-prototyper | 8 / 8 / 9 | 1.7 | ok | 0 | blocked | platform-patroon: coach-briefing (3 stappen) dekt de 4 canvas-stappen niet — 6e missie in dezelfde productkeuze |
| advanced-code-review | 9 / 7.5 / 8.5 | 1.75 | fix-eerst | 3 (leerdoel-omschrijving noemde "leerstijlen" i.p.v. wat echt geoefend wordt; bewijs-zin claimde iets dat de missie niet toetst; intro zei "drie rondes" terwijl het er vier zijn) | fixed* | geen |
| ai-spiegel | 8 / 8 / 9 | 1.7 | fix-eerst | 1 (dashboard toont nu dezelfde kerndoelen als de officiële registratie) | blocked* | 1) welke basisvaardigheid-categorie toevoegen voor privacy (vgl. social-safeguard) 2) kleurkeuze middencategorie bar-chart (voorgestelde kleur zit niet in het palet — niet toegepast) |

*na Codex-gate.

## Toelichting

- **Niet toegepast (bewust):** het bar-chart-kleurvoorstel voor ai-spiegel introduceerde een nieuwe kleur (`#ffb020`) die nergens in het ontwerpsysteem bestaat. Zelfde beslisklasse als eerder teruggedraaide identiteits-fixes → design-keuze voor Yorin.
- **Server-prompt-inzicht toegepast:** reviewers checken nu client- én server-kant van de coach-instructies; bij advanced-code-review en app-prototyper zijn beide identiek (drift alleen t.o.v. het missie-ontwerp, chat is dormant — platform-breed punt).

## Codex-gates

- advanced-code-review (3) en ai-spiegel (1): uitslag in status-index en PR.
