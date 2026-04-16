# Runtime-audit: cloud-commander
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; stap 2 en 4 hebben `verificationQuestion`; stap 1 en 3 hebben alleen checklistItems
- [PASS] Terminal states — bereikbaar; score-berekening werkt correct met 2 verificatievragen × 5 pts + 4 × 10 pts = max 50 pts; config declareert echter `maxScore: 60`
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [PASS] Screenshot-overflow — niet van toepassing
- [PASS] Design tokens — DGSkills-palette consistent

## Didactiek
- SLO-audit quote: "Leerdoel: goed - sterke koppeling aan bestandbeheer in de cloud; voeg ook delen/herstellen van bestanden toe voor meer diepgang. Differentiatie: matig - lineair pad; voeg een verdiepingsopdracht toe rond delen, naamconventies of versiebeheer."
- UI-koppeling: stap 4 implementeert het delen via deellink — dat dekt de audit-wens "delen toevoegen". Herstellen van bestanden en naamconventies/versiebeheer zijn niet geïmplementeerd. Differentiatie ontbreekt in config, maar dat is een didactische wens.

## Bevindingen (severity)
1. [MAJOR] `maxScore: 60` maar berekenbare maximumscore is 50 (4 stappen × 10 + 2 verificatievragen × 5). `computeScore()` kan dit bedrag nooit bereiken → `CompletionScreen` toont altijd een onvolledig percentage — `configs/cloud-commander.ts:86`
2. [MINOR] Config exporteert als `cloudCommanderConfig` (named export), niet als `default export`. `ToolGuide.tsx:510` zoekt op `mod.default ?? Object.values(mod).find(...)` — fallback werkt, maar is inconsistent met de andere configs die `export default config` gebruiken — `configs/cloud-commander.ts:3`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/cloud-commander.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
