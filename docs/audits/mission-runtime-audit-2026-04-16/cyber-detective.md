# Runtime-audit: cyber-detective
- Datum: 2026-04-16
- Template: puzzle-lab
- Auditor: agent-wave1-puzzlesim
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introDescription, introFeatures, maxScore=100, puzzles(4), badges(4), takeaways(5) allemaal aanwezig
- [PASS] Puzzel-feedback aanwezig — alle 4 puzzels hebben een successMessage; clues + extraClues per puzzel; revealExtraAfterAttempts geconfigureerd
- [PASS] Terminal states bereikbaar — puzzel 4 (rapport-tijdlijn) is de laatste; bij correct antwoord zet PuzzleLab.tsx phase naar 'results'

## Visueel (code-level)
- [WARN] Responsive — PuzzleLab.tsx heeft geen breakpoint-classes (sm:/md:/lg:); container is `max-w-md` maar geen `w-full` wrapper buiten dat. Acceptabel op mobiel, maar codebreedte-blokken (```-backticks in description) kunnen horizontaal overflown op smalle schermen.
- [WARN] Overflow — codeblokken in puzzle descriptions worden niet gestyled met `overflow-x-auto`; op kleine schermen kunnen logregels (`185.234.xx.xx | LOGIN FAILED`) uitsteken.
- [PASS] Design tokens — geen `lab-*` tokens in PuzzleLab.tsx; template gebruikt eigen donker kleurenpalet consistent; geen losse hex-afwijkingen in deze config

## Didactiek
- SLO-audit quote: "cyber-detective" staat niet als named missie in `didactische-audit-missies-2026-03-07.md`. Inhoudelijk valt dit onder J3-P2 security/forensics — meest aanverwante quote uit audit: *"analyseren/evalueren is uitdagend maar passend"* (bij Code Reviewer, zelfde Bloom-niveau).
- UI-koppeling: 4 puzzels dekken brute force → forensisch bewijs → phishing → tijdlijnreconstructie. Bloom-progressie van analyseren (p1-p3) naar synthetiseren (p4 tijdlijn). SLO 23A (veiligheid) + 23C (maatschappij) goed herkenbaar. Text-input puzzel 4 vereist actieve constructie, wat het niveau verhoogt.

## Bevindingen (severity)
1. [MINOR] Codeblok-overflow in puzzle descriptions — de ```-blocks in puzzles 'loganalyse' en 'xss-scenario' (lang IP-logformaat) hebben geen `overflow-x-auto` wrapper in PuzzleLab.tsx; kan op 320px-schermen overlopen — fix: `components/missions/templates/puzzle-lab/PuzzleLab.tsx` (description render, ~regel 300-350)
2. [MINOR] SLO-koppeling niet formeel gedocumenteerd in config — config heeft geen `sloLinks`-veld; verwacht gedrag voor J3-P2 maar niet machinaal verifieerbaar — fix: overweeg `sloLinks: ['23A', '23C']` toe te voegen aan PuzzleLabConfig type

## Bronnen
- Config: `components/missions/templates/puzzle-lab/configs/cyber-detective.ts`
- Component: `components/missions/templates/puzzle-lab/PuzzleLab.tsx`
