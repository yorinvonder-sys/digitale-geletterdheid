# Runtime-audit: datalekken-rampenplan
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: PASS

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/DatalekkenRampenplanMission.tsx` → `AuthenticatedApp.tsx:713`
- [PASS] State-machine compleet — 6 phases: `intro → evidence → priorities → letter → budget → results`; `PHASE_SEQUENCE` array (L638) definieert volgorde; `intro` en `results` zijn rand-phases buiten de sequentie; alle transitions via `nextPhase()` / `prevPhase()` en directe `setPhase()` calls
- [N.V.T.] EERSTE_BERICHT — geen AI-chat
- [PASS] Completion-flow (XP award) — `clearSave(); onComplete(true)` op L808; `AuthenticatedApp.tsx:717`: `if (success) handleMissionComplete('datalekken-rampenplan')`
- [PASS] Geen dode refs — imports (lucide-react, `useMissionAutoSave`) bestaan; `useMemo` geïmporteerd en gebruikt

## Visueel (code-level)
- [PASS] Responsive — standaard Tailwind responsive; `PhaseCard` sub-component is inline-defined en responsive
- [PASS] Hardcoded widths — geen `w-[...px]` gevonden
- [PASS] Overflow — geen overflow-issues
- [WARN] Design tokens — hardcoded hex; geen `lab-*` tokens

## Didactiek
- SLO-audit quote: "Datalekken Rampenplan | 23A, 23B, 23C — Leerdoel: goed - veiligheid, keuzes en maatschappelijke gevolgen komen sterk samen; voeg expliciet brongebruik of meldplicht in leerlingtaal toe. Bloom: matig - analyseren/evalueren/creeren is rijk, maar voor leerjaar 1 vrij complex; deel de crisis in kleinere besluitmomenten met voorbeeldfeedback. Activerend: goed - crisisbeslissingen maken de leerling actief."
- UI-koppeling: 4 besluitmomenten (evidence/priorities/letter/budget) implementeren exact de "kleinere besluitmomenten" die de audit aanbeveelt. `PhaseCard`-structuur geeft duidelijke fase-indicator. De audit vraagt om "teams hun keuzes vergelijken" — dat ontbreekt (individuele missie). Meldplicht in leerlingtaal is niet expliciet zichtbaar.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Component: `components/missions/DatalekkenRampenplanMission.tsx`
- Routing: `AuthenticatedApp.tsx:713`
