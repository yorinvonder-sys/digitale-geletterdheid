# Batch-review wave 19 — verse reviews (2026-07-02)

Vijf missies beoordeeld, één met een fix. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| datalekken-rampenplan | 8.5 / 9 / 9 | 1.15 | ok | 1 (schermlezer-label op de icoon-terugknop) | fixed* | geen — AVG-meldplicht-feiten geverifieerd correct |
| filter-bubble-breaker | 8.5 / 9 / 9 | 1.15 | ok | 0 | fixed | geen |
| startup-simulator | 10 / 9 / 9.5 | 0.55 | ok | 0 | blocked | 7e missie in het coach-plan-patroon (coach mist de marktanalyse-stap) — zelfde ene productkeuze |
| innovation-lab | 9 / 7 / 8 | 2.1 | ok | 0 | blocked | server-coach vraagt nog "maatschappelijk probleem + SDG" terwijl de missie is verlicht naar "alledaags probleem" — server-tekst hergenereren (AI-endpoint, aan jou) |
| layout-doctor | 7 / 8.5 / 8 | 2.1 | ok | 0 | blocked | a11y-opknapcluster: mobiel start de instructiekaart uitgeklapt, opmaakknoppen te klein voor touch, focus-rand ontbreekt — voorstellen in rapport |

*na Codex-gate.

## Toelichting

- **Score-correctie bij intake:** de layout-doctor-reviewer rapporteerde een omgekeerde schaal (4/2/2, triage 7.4) terwijl het eigen narratief een gezonde missie beschrijft (alle criteria juist, geen blocking). Herijkt naar 7 / 8.5 / 8 — vierde geval van deze bekende sub-agent-fout in de run.
- **Server-prompt-dossier: vijfde bewijs.** innovation-lab's server-coach geeft leerlingen een zwaardere opdracht (SDG-koppeling) dan de herschreven missie vraagt. Dossier-stand: verkeerde inhoud (sustainability-scanner), verouderd op actieve missie (verhalen-ontwerper, innovation-lab), dekkingsgat (data-verzamelaar), en byte-identiek-maar-desync-met-canvas (startup-simulator, app-prototyper).
- **Coach-plan-patroon nu 7 missies** (startup-simulator erbij) — nog steeds één productkeuze.
- **AVG-check datalekken-rampenplan:** de compliance-gevoelige feiten (72-uurs meldplicht, wat is een datalek, wanneer betrokkenen informeren) zijn expliciet gecontroleerd en kloppen; alleen een verrijkingssuggestie over BSN-risico-framing genoteerd.

## Codex-gates

- datalekken-rampenplan (1): uitslag in status-index en PR.

## Gate-uitslag (addendum)

datalekken-rampenplan: eerste poging **BLOCK** — Codex ving dat het voorgestelde label "Terug naar dashboard" een bestemming beloofde die de knop niet heeft (hij gaat naar de missie-intro, en alleen vanaf fase 1). Label gecorrigeerd naar "Terug naar de missie-intro" → re-gate **ALLOW**. Negende echte gate-vangst van de run; de stille no-op op latere fases staat als suggestie bij de a11y-opknapronde.
