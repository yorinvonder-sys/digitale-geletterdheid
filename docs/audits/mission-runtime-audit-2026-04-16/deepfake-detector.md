# Runtime-audit: deepfake-detector
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: PASS

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/DeepfakeDetectorMission.tsx` → `AuthenticatedApp.tsx:671`
- [PASS] State-machine compleet — state via `useMissionAutoSave<DeepfakeDetectorState>` met velden `currentLevel`, `currentChallengeIndex`, `score`, `streak`, `correctAnswers`, `showIntro`, `showLevelComplete`, `showMissionComplete`; alle transitions aanwezig (L306: `showMissionComplete: true`)
- [PASS] EERSTE_BERICHT — `StudentAIChat` aanwezig met expliciete `roleId="deepfake-detector"` (L567). Contextuele props meegegeven incl. `currentChallenge`, `missionStage`, `level`, `vsoProfile`.
- [PASS] Completion-flow (XP award) — `clearSave(); onComplete(true)` op L484; `AuthenticatedApp.tsx:676` roept `handleMissionComplete('deepfake-detector')` aan
- [PASS] Geen dode refs — alle imports (`StudentAIChat`, `useMissionAutoSave`, `VsoProfile`) bestaan

## Visueel (code-level)
- [PASS] Responsive — geen hardcoded pixel-widths; standaard Tailwind responsive-classes
- [PASS] Hardcoded widths — geen `w-[...px]` gevonden
- [PASS] Overflow — geen overflow-issues
- [WARN] Design tokens — hardcoded hex; geen `lab-*` tokens

## Didactiek
- SLO-audit quote: "Deepfake Detector | 21B, 21D, 23C — Leerdoel: goed - zeer sterke match met media, AI en maatschappelijke impact; voeg een expliciete handelingsstap toe voor delen/niet delen. Bloom: goed - analyseren/evalueren past goed voor leerjaar 1 met concrete cases. Differentiatie: matig - casezwaarte is impliciet; label cases als basis en verdieping."
- UI-koppeling: Classificatieuitdagingen (real vs AI) implementeren de "analyseren/evalueren" intentie. `streak`-mechanisme voegt motivatielaag toe. `showHints` default aan voor `vsoProfile === 'dagbesteding'` is goede toegankelijkheidsoverweging. `roleId="deepfake-detector"` garandeert missie-specifieke AI-hulp. Expliciete handelingsstap voor "delen/niet delen" ontbreekt in UI.

## Bevindingen (severity)
Geen bevindingen.

## Bronnen
- Component: `components/missions/DeepfakeDetectorMission.tsx`
- Routing: `AuthenticatedApp.tsx:671`
