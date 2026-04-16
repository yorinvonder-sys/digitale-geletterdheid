# Runtime-audit: privacy-by-design
- Datum: 2026-04-16
- Template: simulation-lab
- Auditor: agent-wave1-puzzlesim
- Status: PASS

**Referentie-sanity-check: PASS** — alle kernaspecten van de goudstandaard zijn intact. Deze missie is bruikbaar als referentiepunt voor andere SimulationLab-audits.

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures, maxScore=100, simulations(3), badges(5), takeaways(5), computeVisuals aanwezig
- [PASS] Sim-feedback aanwezig — alle 3 simulaties hebben questions(3 elk), correctAnswer + explanation + points per vraag; sim 1 heeft followUp-blok met bonusPoints:5
- [PASS] Terminal states bereikbaar — sim 3 is laatste; handleNextSim triggert phase:'results' na allQuestionsSubmitted; followUp op sim 1 geblokkeerd via `followUpPending`-guard; CompletionScreen correct aangeroepen

## Visueel (code-level)
- [PASS] Responsive — SimulationLab.tsx gebruikt `max-w-2xl mx-auto` container; `flex flex-col md:flex-row` op sim-layout; ParameterControl en QuestionCard zijn flex-based
- [PASS] Overflow — geen codeblokken in descriptions; MeterVis en BarChartVis zijn SVG/flex met expliciete max-breedte; ComparisonData gebruikt flex-col layout
- [PASS] Design tokens — kleuren in config (D97757, C46849, B05A3C, E8E6DF, 10B981) zijn uit het DGSkills palet; consistent met andere SimLab configs

## Didactiek
- SLO-audit quote: *"De AI Spiegel [verwante missie, J1-P3]: sterke koppeling aan weloverwogen keuzes en platforminvloed; voeg expliciet taal toe over aanbevelingssystemen."* — privacy-by-design is J2-P2, hogere abstractie; SLO 23A (veiligheid/privacy) + 23B (welzijn) goed afgedekt.
- UI-koppeling: Sim 1 (social media profiel → privacy meter), sim 2 (app permissies → bar chart), sim 3 (cookie-instellingen → comparison). Directe visuele koppeling tussen parameterwijziging en visual. FollowUp-vraag op sim 1 koppelt aan "Privacy by Default" begrip — sterke SLO-verankering. Alle 3 simulations hebben 30-40-30 puntverdeling die optelt naar maxScore:100 (30+40+30=100 ✓).

## Bevindingen (severity)
Geen bevindingen — config en component functioneren conform goudstandaard.

## Bronnen
- Config: `components/missions/templates/simulation-lab/configs/privacy-by-design.ts`
- Component: `components/missions/templates/simulation-lab/SimulationLab.tsx`
