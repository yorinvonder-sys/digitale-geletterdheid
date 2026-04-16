# Runtime-audit: ipad-print-instructies
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: WARN

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/PrintInstructiesMission.tsx` → `AuthenticatedApp.tsx:686`
- [PASS] State-machine compleet — state via `useMissionAutoSave<PrintTroubleshooterState>`; quiz-flow met `selectedAnswer` + `showFeedback`; completion via `onComplete(true)` op L399
- [N.V.T.] EERSTE_BERICHT — geen AI-chat
- [PASS] Completion-flow (XP award) — `AuthenticatedApp.tsx:690`: `if (success) handleMissionComplete('ipad-print-instructies')`; `clearSave(); onComplete(true)` op L399 triggert dit
- [PASS] Geen dode refs — imports (lucide-react, `VsoProfile`, `useMissionAutoSave`) bestaan; `default export` aanwezig naast named export (L612)

## Visueel (code-level)
- [PASS] Responsive — standaard Tailwind responsive-classes; geen hardcoded widths
- [PASS] Hardcoded widths — geen `w-[...px]` gevonden
- [PASS] Overflow — geen overflow-issues
- [WARN] Design tokens — hardcoded hex; geen `lab-*` tokens

## ClassRestriction check (BLOCKER-2 koppeling)
- `config/slo-kerndoelen-mapping.ts:35`: `classRestriction: 'MH1A'` — missie geldt alleen voor klas MH1A.
- De routing in `AuthenticatedApp.tsx:686` heeft GEEN classRestriction-check. Elke leerling die de URL direct aanroept of de slug bereikt kan de missie spelen.
- BLOCKER-2 uit `_dashboard-baseline.md` stelt dat classroom_config met `.single()` een 406 geeft bij ontbrekende klas. De `classRestriction`-filtering in `slo-kerndoelen-mapping.ts:222` werkt via `isMissionVisible()`, maar of dit in AuthenticatedApp wordt geëvalueerd voordat `activeModule === 'ipad-print-instructies'` match is niet geverifieerd — de routing heeft geen guard.

## Didactiek
- SLO-audit quote: `ipad-print-instructies` staat niet in de didactische audit van 2026-03-07 — missie is na de audit toegevoegd.
- UI-koppeling: Troubleshooter-quiz voor iPad-printen sluit aan op SLO 21A (functioneel gebruik van hardware). Klassikale beperking (MH1A) past bij een specifiek aparatuurscenario.

## Bevindingen (severity)
1. [MAJOR] Routing in `AuthenticatedApp.tsx:686` heeft geen `classRestriction`-guard — elke leerling kan `ipad-print-instructies` starten ongeacht klas. Filter in `slo-kerndoelen-mapping.ts` wordt alleen op dashboard-weergave toegepast, niet op route-toegang. — fix: voeg classRestriction-check toe voor actieve module in routing-logica
2. [MINOR] Dubbele export: `PrintInstructiesMission.tsx:612` heeft zowel named als default export. Inconsistent met andere legacy-missies die alleen named exports gebruiken.

## Bronnen
- Component: `components/missions/PrintInstructiesMission.tsx`
- Routing: `AuthenticatedApp.tsx:686`
- ClassRestriction: `config/slo-kerndoelen-mapping.ts:35`
