# Runtime-audit: slide-specialist
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; stap 1, 2, 4 hebben `verificationQuestion`; stap 3 (animatie) heeft geen verificatievraag maar wel 3 checklistItems
- [PASS] Terminal states — bereikbaar; 3 verificatievragen × 5 + 4 × 10 = max 55 pts; `maxScore: 60` — zie bevinding
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [PASS] Screenshot-overflow — niet van toepassing
- [PASS] Design tokens — DGSkills-palette consistent; badge-kleuren `#EA580C` en `#F97316` zijn oranje-tinten die afwijken van het standaard `#D97757` maar zijn niet strijdig met de codebase

## Didactiek
- SLO-audit quote: "Leerdoel: goed - sterke match met presentatieproductie; voeg een expliciet criterium toe voor doelgroepgericht ontwerpen. Bloom: goed - toepassen/creeren is passend; voeg een evaluatiestap toe waarin een leerling 1 slide verantwoordt. Differentiatie: matig - iedereen volgt hetzelfde basispad; voeg een expertoptie toe voor informatievisualisatie of timing."
- UI-koppeling: stap 2 beperkt tekst expliciet tot 3–5 punten en vraagt dit te verantwoorden via verificatievraag — dat dekt de Bloom-wens "evaluatiestap". Stap 3 (animatie) mist een verificatievraag over het doelbewust gebruik van animaties, wat de SLO-wens "doelgroepgericht ontwerpen" deels mist.

## Bevindingen (severity)
1. [MINOR] `maxScore: 60` maar berekenbare max is 55 — zelfde patroon als word-wizard en cloud-commander — `configs/slide-specialist.ts:104`
2. [MINOR] Stap 3 (animatie) heeft geen `verificationQuestion` terwijl de SLO-audit vraagt om een evaluatiestap; een conceptvraag over animatiedoelstelling zou de didactische kwaliteit verhogen — `configs/slide-specialist.ts:68-78`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/slide-specialist.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
