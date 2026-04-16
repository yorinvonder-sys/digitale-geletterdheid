# Runtime-audit: game-director
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: FAIL

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/GameDirectorMission.tsx` → `AuthenticatedApp.tsx:502`
- [PASS] State-machine compleet — 4 challenges in volgorde; `showConclusion` als eindscherm (L216); `onComplete(true)` via MissionConclusion op L738
- [N.V.T.] EERSTE_BERICHT — `StudentAIChat` aanwezig (L859) maar zonder `roleId` prop → valt terug op default `student-assistant` system instruction. Geen missie-specifieke AI-instructie voor game-director.
- [FAIL] Completion-flow (XP award) — `AuthenticatedApp.tsx:506`: `onComplete={() => handleExitModule()}` — roept NIET `handleMissionComplete('game-director')` aan. XP wordt nooit toegekend. Missie staat nooit als voltooid geregistreerd.
- [PASS] Geen dode refs — alle imports (`BlockPalette`, `CodeWorkspace`, `BlockTypes`, `BlockExecutor`, `MissionConclusion`, `StudentAIChat`, `useMissionAutoSave`) bestaan.

## Visueel (code-level)
- [PASS] Responsive — `mobileTab` state voor drie views (blocks/code/game) op mobiel; `md:flex` / `md:w-64` patroon aanwezig (L907, L924)
- [WARN] Hardcoded widths — `md:w-64`, `md:w-[40%]`, `md:min-w-[320px]`, `md:max-w-[800px]` voor game-area (L924). De `40%` is een responsieve percentage maar `320px` min-width kan op smalle telefoons (360px) krap worden.
- [PASS] Overflow — `overflow-y-auto` op hoofdcontainer (L725); game-canvas `overflow-hidden` (L937)
- [WARN] Design tokens — hardcoded hex in className; geen `lab-*` tokens. Consistent met andere legacy-missies.

## Didactiek
- SLO-audit quote: "Game Director | 22A, 22B — Leerdoel: goed - vrije ontwerpruimte sluit aan op maken en programmeren; voeg expliciet 1 ontwerpkeuze toe die onderbouwd moet worden. Bloom: goed - creeren is passend nadat basisblokken zijn geoefend."
- UI-koppeling: Block-based visual programming implementeert de "vrije experimenteerruimte" uit de audit. 4 challenges stijgen in complexiteit (move → jump → keyboard → smart jump). `StudentAIChat` is aanwezig als hulp maar mist missie-specifieke context (geen `roleId`). De audit vraagt om een "checklist voor minimumdoelen" voor basisleerlingen — dat ontbreekt in de UI.

## Bevindingen (severity)
1. [BLOCKER] `onComplete={() => handleExitModule()}` op `AuthenticatedApp.tsx:506` — XP wordt niet toegekend, missie wordt niet als voltooid geregistreerd. — fix: `AuthenticatedApp.tsx:506` → `onComplete={(success) => { if (success) handleMissionComplete('game-director'); else handleExitModule(); }}`
2. [MINOR] `StudentAIChat` zonder `roleId` — valt terug op generiek `student-assistant` — geen game-context-bewuste AI-hulp. — fix: `GameDirectorMission.tsx:859` — voeg `roleId="game-director"` toe

## Bronnen
- Component: `components/missions/GameDirectorMission.tsx`
- Routing: `AuthenticatedApp.tsx:502`
