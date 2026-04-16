# Runtime-audit: data-verzamelaar
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: MISSING

## Functioneel (code-level)
- [FAIL] Component bestaat + geroute — GEEN `DataVerzamelaarMission.tsx` gevonden in `components/missions/`. Geen routing in `AuthenticatedApp.tsx`.
- [FAIL] State-machine compleet — N.V.T. (component ontbreekt)
- [FAIL] EERSTE_BERICHT — N.V.T.
- [FAIL] Completion-flow (XP award) — N.V.T.
- [FAIL] Geen dode refs — N.V.T.

## Wat WEL bestaat
- `components/DataVerzamelaarPreview.tsx` — een preview-component voor AiLab standalone app. Dit is een leerling-preview, geen volledige missie.
- `components/AiLab.tsx` lazy-importeert `DataVerzamelaarPreview` voor `selectedRole?.id === 'data-verzamelaar'`
- `config/agents/year1.tsx`: missie-definitie aanwezig met `id: 'data-verzamelaar'`
- `config/slo-kerndoelen-mapping.ts:35`: `{ id: 'data-verzamelaar', title: 'Data Verzamelaar', week: 3, yearGroup: 1, sloKerndoelen: ['21C', '23C'] }`
- `config/curriculum.ts`: `'data-verzamelaar'` opgenomen in curriculum

## Bevindingen (severity)
1. [BLOCKER] `data-verzamelaar` staat in curriculum en SLO-mapping als goudstandaard-referentiemissie maar heeft geen runtime-component. Leerlingen kunnen de missie niet uitvoeren — ze zien alleen een preview-card. XP kan niet worden verdiend.
2. [MAJOR] `DataVerzamelaarPreview.tsx` is een preview voor de standalone AiLab-app, niet voor de hoofdapp. Verwarring in codebase over scope van dit component.

## Bronnen
- Preview-component: `components/DataVerzamelaarPreview.tsx`
- Config: `config/agents/year1.tsx`, `config/slo-kerndoelen-mapping.ts:35`
- Routing: AuthenticatedApp.tsx — geen entry voor `data-verzamelaar`
