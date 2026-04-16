# Runtime-audit: startup-pitch
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; stap 1, 2, 4 hebben `verificationQuestion`; stap 3 (branding) heeft geen verificatievraag maar wel 3 checklistItems
- [PASS] Terminal states — bereikbaar; 3 verificatievragen × 5 + 4 × 10 = max 55 pts; `maxScore: 60` — zie bevinding
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [WARN] Screenshot-overflow — zelfde `\n`-rendering probleem als mission-launch: stap 1 (`instruction` bevat `\n- **Probleem...`), stap 2, stap 3 en stap 4 bevatten allemaal genummerde/gebulleede lijsten via `\n`. RichText-renderer verwerkt `**bold**` maar niet newlines; de lijsten worden weergegeven als één aaneengesloten tekstregel op mobiel.
- [PASS] Design tokens — DGSkills-palette consistent

## Didactiek
- SLO-audit quote: "Leerdoel: matig - de opdracht is sterk ondernemend, maar de koppeling aan digitaal welzijn is dun; voeg expliciet impact op gebruikers, verslavingsrisico of datagebruik toe. Bloom: goed - creeren/evalueren past goed voor leerjaar 3."
- UI-koppeling: stap 4 (ethische reflectie) behandelt expliciet privacy, dataverzameling bij minderjarigen (EU-regels) en eerlijkheid/toegankelijkheid. Dit dekt de SLO-audit-wens "datagebruik en eerlijkheid toevoegen" volledig. Verslavingsrisico is niet geïmplementeerd maar is een randzaak. De missie combineert ontwerpen (logo/slogan), analyseren (probleemomschrijving) en evalueren (ethiek) — passend voor J3 P3.

## Bevindingen (severity)
1. [MAJOR] `\n`-tekens in `instruction` worden niet als regelbreuk weergegeven door RichText-renderer — stap 1 t/m 4 bevatten elk meerregelige instructies met opsommingen die samenklonteren tot één blok. Dit is hetzelfde structurele probleem als mission-launch en treft deze missie zwaarder omdat bijna alle stappen lijstopmaak gebruiken — `ToolGuide.tsx:82-98`
2. [MINOR] `maxScore: 60` maar berekenbare max is 55 — `configs/startup-pitch.ts:106`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/startup-pitch.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
