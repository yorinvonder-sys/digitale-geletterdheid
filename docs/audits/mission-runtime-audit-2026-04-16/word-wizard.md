# Runtime-audit: word-wizard
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; stap 1, 2, 4 hebben `verificationQuestion`; stap 3 (afbeelding invoegen) heeft geen verificatievraag maar wel 3 checklistItems
- [PASS] Terminal states — bereikbaar; 3 verificatievragen × 5 + 4 × 10 = max 55 pts; `maxScore: 60` — zie bevinding
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [PASS] Screenshot-overflow — niet van toepassing
- [PASS] Design tokens — DGSkills-palette consistent

## Didactiek
- SLO-audit quote: "Leerdoel: goed - directe match met functioneel toolgebruik en digitaal product maken; voeg een rubric toe voor opmaakkwaliteit. Bloom: goed - toepassen/creeren past bij leerjaar 1; voeg 1 keuze toe tussen basis- en verdiepingslay-out. Differentiatie: matig - weinig zichtbaar niveauverschil; voeg een verdiepingsspoor met kop/voettekst of bronvermelding toe."
- UI-koppeling: de 4 stappen dekken exact de introFeatures. Stap 2 legt de link tussen kopstijlen en inhoudsopgave expliciet uit via tip en verificatievraag — dat is sterke didactische UI-koppeling. Differentiatie en rubric zijn didactische wensen, niet geïmplementeerd.

## Bevindingen (severity)
1. [MINOR] `maxScore: 60` maar berekenbare max is 55 (3 verificatievragen × 5 + 4 stappen × 10). Zelfde patroon als cloud-commander; score zal nooit 100% bereiken — `configs/word-wizard.ts:104`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/word-wizard.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
