# Batch-review wave 18 — verse reviews (2026-07-02)

Vijf missies beoordeeld, één met een fix. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| impact-review | 8 / 8 / 9 | 1.7 | ok | 1 (introtekst beschreef "cases analyseren en samenvatten" terwijl de missie sorteert/koppelt/categoriseert — herschreven naar de echte 4 rondes) | fixed* | geen |
| cookie-crusher | 8 / 8 / 9 | 1.7 | ok | 0 | fixed | geen — scenario-feiten en scoring nagerekend, geen promptdrift |
| verhalen-ontwerper | 8 / 8.5 / 7.5 | 1.95 | ok | 0 | blocked | **server-instructie is een oudere versie dan de code** op deze ACTIEVE chat-missie (mist de "eerst schrijven, illustreren op verzoek"-herziening) — server-entry hergenereren is aan jou (AI-endpoint) |
| data-verzamelaar | 7.5 / 8.5 / 8 | 1.95 | ok | 0 | fixed | geen — wel 2 platform-datapunten (zie hieronder) |
| data-voor-data | 8 / 6.5 / 8.5 | 2.45 | fix-eerst | 0 | blocked | beloofde basisvaardigheid (dataminimalisatie/recht op vergetelheid) zit niet in de missie — 1-zins-toevoeging ligt klaar in het rapport, óf de belofte aanpassen |

*na Codex-gate.

## Server-prompt-dossier groeit (drie varianten nu bewezen)

Wave 16 ontdekte dat de échte coach-instructies server-side staan. Wave 18 voegt twee varianten toe:

1. **Verouderde server-versie op een actieve missie** — verhalen-ontwerper: leerlingen krijgen in productie nog de oude boek-flow.
2. **Dekkingsgat** — data-verzamelaar ontbreekt volledig aan de server-kant (client-tekst is daar de enige bron).
3. **Verkeerde inhoud** (wave 16) — sustainability-scanner: server-coach praat over het oude milieu-thema.

Advies blijft: één drift-audit over alle ~90 server-entries vs client-configs, mét dekkingscheck in beide richtingen.

## Overige platform-datapunten

- briefingImage-hergebruik: data-verzamelaar toont het social-safeguard-schild (copy-paste over 7 missies in year1.tsx); data-voor-data hergebruikt ai_spiegel.webp (4×).
- data-voor-data: k-anonimiteit in de datakoppeling expliciet geverifieerd en correct (klas n≥5, school n≥10).

## Codex-gates

- impact-review (1): uitslag in status-index en PR.
