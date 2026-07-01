# Batch-review wave 7 — verse reviews (2026-07-01)

Wave 7 is de eerste wave met missies die nog nooit gereviewd waren. Elke missie kreeg één review-agent die vormgeving, leerwaarde en techniek in één keer beoordeelde. Twee kleine fixes zijn direct toegepast; de rest staat als beslissing voor Yorin. (Modus: sweep, waveSize 5.)

| Missie | Scores (design/didactiek/tech) | Triage | Verdict | Fixes | Eindstatus | Open punten voor Yorin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ai-bias-detective | 8 / 9 / 8 | 1.6 | ok | 0 | fixed | geen (dormante chat-rol → platformlijst) |
| ai-trainer | 8 / 9 / 8 | 1.6 | ok | 0 | blocked | client- en server-versie van de AI-instructie zijn uit elkaar gegroeid — welke is leidend? |
| code-review-2 | 9 / 8 / 9 | 1.4 | ok | 0 | fixed | geen (dormante chat-rol geldt voor alle 7 review-arena-missies → platformlijst) |
| cyber-detective | 6.5 / 8 / 5 | 3.35 | fix-eerst | 1 (no-op gradient → effen kleur) | blocked | agent-afbeelding ontbreekt (`/assets/agents/cyber-detective.webp` bestaat niet) — leerling ziet kapotte afbeelding; afbeelding genereren? |
| data-detective | 4 / 2 / 4 | 6.8 | fix-eerst | 1 (aria-label terugknop) | blocked | 1) geen expliciete leerdoelen per level (SLO-content, jij keurt) 2) rode fout-kleur wordt als hoofdknop-kleur gebruikt + losse hexkleuren door de hele component (design-opknapbeurt) |

NB: de triage-score van data-detective is door de orchestrator gecorrigeerd (agent rekende 3.2, klopt niet met de formule; werkelijk 6.8 → hoogste prioriteit van deze wave).

### Platform-brede beslissing (nieuw op de gedeelde lijst)

**Dormante chat-rollen:** meerdere template-missies hebben een volledig uitgewerkte AI-chat-persoonlijkheid in de agent-configuratie die leerlingen nooit zien, omdat `enableChat` uitstaat (geverifieerd: geldt o.a. voor ai-bias-detective, code-review-2 — en template-breed voor alle 7 review-arena-missies — plus cyber-detective en data-detective). Dit is één productbeslissing: chat aanzetten waar didactisch zinvol, of de dode instructies expliciet als bewust-uit markeren. Tot die keuze telt dit niet als per-missie-blokkade.

### Codex-gates

- cyber-detective en data-detective (elk 1 toegepaste fix) krijgen een gate; uitslag in de status-index en de PR.
