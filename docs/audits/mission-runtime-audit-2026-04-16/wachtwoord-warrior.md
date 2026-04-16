# Runtime-audit: wachtwoord-warrior
- Datum: 2026-04-16
- Template: puzzle-lab
- Auditor: agent-wave1-puzzlesim
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introDescription, introFeatures, maxScore=100, puzzles(4), badges(4), takeaways(5) aanwezig
- [PASS] Puzzel-feedback aanwezig — alle 4 puzzels hebben successMessage + clues + extraClues; revealExtraAfterAttempts op elke puzzel aanwezig
- [PASS] Terminal states bereikbaar — puzzel 4 (sterk-wachtwoord-maken) is laatste; heeft `validator`-functie ipv vaste answer; bij validator=true wordt phase 'results' bereikt via PuzzleLab.tsx flow

## Visueel (code-level)
- [WARN] Responsive — zelfde patroon als alle PuzzleLab missies: geen breakpoint-classes in component; werkt maar niet geoptimaliseerd voor tablet
- [WARN] Overflow — puzzle 'woordenboekaanval' bevat een **bold**-lijst in description die in principe veilig is; geen codeblokken, geen overflow-risico in deze puzzels
- [PASS] Design tokens — consistent met PuzzleLab palet; geen losse kleuren in config zelf

## Didactiek
- SLO-audit quote: Niet als named missie in audit. J1-P3 Digitaal Burgerschap, meest verwant: *"De Data Handelaar: analyseren/evalueren is sterk, maar juridisch taalgebruik kan voor leerjaar 1 te zwaar zijn"* — contrast: wachtwoord-warrior is juist concreet en goed gescoord voor J1.
- UI-koppeling: Puzzel 1 kraaktijd (berekening), puzzel 2 woordenboekaanval (herkennen), puzzel 3 credential stuffing (analyse), puzzel 4 passphrase maken (toepassen/creëren). Bloom loopt op van onthouden → evalueren → creëren. Authentiek voor J1-P3. Puzzel 4 validator checkt lengte ≥14, A-Z, 0-9, speciaalteken — direct uitvoerbare criteria.

## Bevindingen (severity)
1. [MINOR] Validator in puzzel 4 checkt niet op afwezigheid van herkenbare woordenlijst-woorden — dit is didactisch aangesproken in description maar niet technisch afgedwongen; een leerling kan "Password!1234567" invoeren en slagen — fix: aanvulling validator of extra hint in feedback; `configs/wachtwoord-warrior.ts:124`

## Bronnen
- Config: `components/missions/templates/puzzle-lab/configs/wachtwoord-warrior.ts`
- Component: `components/missions/templates/puzzle-lab/PuzzleLab.tsx`
