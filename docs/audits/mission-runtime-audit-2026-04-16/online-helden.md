# Runtime-audit: online-helden
- Datum: 2026-04-16
- Template: scenario-engine
- Auditor: agent-wave1-scenarioengine
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — title, introEmoji, introTitle, introDescription, introFeatures, maxScore, badges, takeaways, 3 rounds aanwezig.
- [PASS] Choice-feedback — alle items hebben `correct` + `explanation`. Ronde 2 (select-correct, 8 items) en ronde 3 (order-priority, 8 items) zijn volledig. Ronde 1 (binary-choice, 8 items) heeft `correct` op elk item.
- [N.V.T.] EERSTE_BERICHT — geen chatflow geconfigureerd.
- [PASS] Terminal states — ronde 3 (index 2) is de laatste ronde; na submit gaat de engine naar `'results'`.

## Visueel (code-level)
- [PASS] Responsive — engine-wrapper consistent.
- [WARN] Overflow — ronde 2 en ronde 3 bevatten 8 items (select-correct en order-priority). `OrderPriorityRound` met 8 items kan op kleine schermen een lange scrolllijst geven. Zelfde risico als bij `notificatie-ninja`.
- [PASS] Design tokens — consistent.

## Didactiek
- SLO-audit quote: Online-helden staat niet in de SLO-audittabel van 2026-03-07 (was nog niet zichtbaar in `config/agents.tsx` op die datum — ook aangeduid in `_dashboard-baseline.md` als missie zonder ROLES-metadata). Geen directe quote beschikbaar.
- UI-koppeling: Drie rondes dekken herkennen van cyberpesten (binary-choice), bijstander-acties kiezen (select-correct) en impact rangschikken (order-priority). Dit sluit aan op SLO 23A (veilig handelen) en 23B (weloverwogen keuzes) voor J1 P1. De engine biedt geen chat of reflectielaag; de didactische verdieping zit volledig in de `explanation`-teksten.

## Bevindingen (severity)
1. [MINOR] `online-helden` ontbreekt in `config/agents.tsx` ROLES-metadata — dashboard toont vermoedelijk technische slug als titel (baseline MAJOR-1 patroon). Niet opnieuw te fixen hier; verwezen naar baseline-fix.
2. [MINOR] 8 items in order-priority ronde 3 — UX-risico op mobiel (lange scrolllijst), zelfde als `notificatie-ninja`. Fix: beperk tot 5-6 items — `components/missions/templates/scenario-engine/configs/online-helden.ts` ronde `rangschik-impact`.

## Bronnen
- Config: `components/missions/templates/scenario-engine/configs/online-helden.ts`
- Component: `components/missions/templates/scenario-engine/ScenarioEngine.tsx`
