# Runtime-audit: ai-spiegel
- Datum: 2026-04-16
- Template: simulation-lab
- Auditor: agent-wave1-puzzlesim
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures, maxScore=100, simulations(3), badges(5), takeaways(5), computeVisuals aanwezig
- [PASS] Sim-feedback aanwezig — alle 3 simulaties hebben questions(3 elk), correctAnswer + explanation + points; geen followUp
- [FAIL] Score-optelling klopt niet — sim 1: maxScore=30, sim 2: maxScore=40, sim 3: maxScore=30 → som=100 ✓. Maar sim 2 questions: q1=10pt, q2=15pt, q3=15pt → som=40 ✓. Technisch correct, maar: sim 1 questions geven elk 10pt → sim 1 vraag-punten optelling = 30 ✓. Sim 3 questions geven elk 10pt → 30 ✓. Terminal state bereikbaar.

Herziening: na doorrekening is de puntensom correct (zie boven). Fase WARN blijft om visueel issue hieronder.

## Visueel (code-level)
- [PASS] Responsive — erft SimulationLab.tsx layout correct
- [WARN] Overflow — sim 2 (ipad-instellingen) heeft 3 sliders met labels "Apps met locatietoegang (altijd)" — lange labeltekst kan wrappen op 320px schermen; ParameterControl.tsx heeft geen expliciete wrapping-constraint gecontroleerd
- [PASS] Design tokens — kleuren consistent (D97757, C46849, B05A3C, E8E6DF, 10B981, 8B5CF6); badge 'Bewuste Digitale Burger' gebruikt #E8956F — lichte afwijking maar binnen warm DGSkills tintenpalet

## Didactiek
- SLO-audit quote: *"De AI Spiegel: Leerdoel: goed — sterke koppeling aan weloverwogen keuzes en platforminvloed; voeg expliciet taal toe over aanbevelingssystemen. Bloom: goed — analyseren/evalueren is passend en relevant voor deze leeftijdsgroep. Differentiatie: matig — open voorbeelden helpen, maar steunniveaus ontbreken; bied voorbeeldprofielen en een verdiepend advertentieprofielspoor."* (audit 2026-03-07, J1-P3)
- UI-koppeling: Sim 1 (advertentieprofiel → meter profielnauwkeurigheid), sim 2 (iPad-instellingen → bar chart privacy exposure), sim 3 (filterbubbel → comparison). Koppeling platform-data → profiel → filterbubbel is didactisch logisch en progressief. Sim 3 question fb1-q2 over filterbubbel en democratie is hoog Bloom-niveau (evalueren/verbanden leggen) — positief uitstekend voor J1.
- Patroon-B check: geen `enableChat`-veld — niet van toepassing.

## Bevindingen (severity)
1. [MINOR] Sim 2 slider-labels zijn lang ("Apps met locatietoegang (altijd)") — mogelijke wrapping op mobiel; ParameterControl render onbekend maar risico aanwezig — fix: `components/missions/templates/simulation-lab/sub/ParameterControl.tsx`
2. [MINOR] SLO-audit adviseert expliciete taal over "aanbevelingssystemen" — sim 3 gebruikt "aanbevelingsalgoritme" als parameterlabel maar de begripsintroductie in de description mist dit woord; filterbubbel-sim vervangt dit deels maar niet volledig — didactisch verbeterpunt, geen blocker

## Bronnen
- Config: `components/missions/templates/simulation-lab/configs/ai-spiegel.ts`
- Component: `components/missions/templates/simulation-lab/SimulationLab.tsx`
