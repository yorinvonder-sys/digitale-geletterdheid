# Runtime-audit: notificatie-ninja
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 4 rounds aanwezig.
- [PASS] Choice-feedback — alle 8 items per ronde hebben `correct` (bool voor select-correct/binary-choice) of `correctPosition` (order-priority) + `explanation`. Ronde 2 heeft 8 items in order-priority, wat afwijkt van de meeste andere missies (5 items) maar technisch correct is — `scoreOrderPriority` handelt willekeurig aantal items af.
- [N.V.T.] EERSTE_BERICHT — geen chatflow; `enableChat` afwezig.
- [PASS] Terminal states — ronde 4 sluit de rondelus; phase naar `'results'` bereikbaar.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [WARN] Overflow — ronde 2 heeft 8 items in een order-priority ronde. `OrderPriorityRound` toont items als klikbare kaarten; 8 items is meer dan gebruikelijk (5 bij andere missies). Op kleine schermen kan de lijst lang scrollen. Niet functioneel gebroken, maar UX-risico op mobiel.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: Notificatie-ninja is Periode 1 (J1 P1) maar staat niet in de SLO-audittabel van 2026-03-07. De audit dekte alleen de missies zichtbaar in `config/agents.tsx` op 7 maart. Geen directe quote beschikbaar.
- UI-koppeling: De vier rondes dekken herkennen (select-correct), rangschikken van manipulatiegraad (order-priority), classificeren nuttig vs. manipulatief (binary-choice) en bewuste actie (select-correct). Dit sluit aan op SLO 23B (weloverwogen keuzes) en 23C (maatschappelijke invloed van technologie) voor J1 P1.

## Bevindingen (severity)
1. [MINOR] Slug-bug (dashboard toont `notificatie-ninja` als technische slug in plaats van titel) — reeds gerapporteerd in `_dashboard-baseline.md` MAJOR-1. Niet opnieuw te fixen hier; verwezen naar baseline.
2. [MINOR] 8 items in order-priority (ronde 2) vs. standaard 5 — op kleine schermen langere scroll. Overweeg splitsen in twee rondes of beperken tot 6 items — `components/missions/templates/scenario-engine/configs/notificatie-ninja.ts` ronde `rangschik-manipulatie`.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/notificatie-ninja.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
