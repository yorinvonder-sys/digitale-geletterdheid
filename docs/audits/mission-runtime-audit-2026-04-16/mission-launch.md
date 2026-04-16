# Runtime-audit: mission-launch
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; stap 1, 2, 4 hebben `verificationQuestion`; stap 3 (CTA) heeft geen verificatievraag maar wel 3 checklistItems
- [PASS] Terminal states — bereikbaar; 3 verificatievragen × 5 + 4 × 10 = max 55 pts; `maxScore: 60` — zie bevinding
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [WARN] Screenshot-overflow — stap 1 en stap 4 bevatten multi-line instructietekst met `\n`-tekens die in de RichText-renderer niet als `<br>` worden gerenderd; de instructies worden weergegeven als één lange string zonder visuele regelbreuk. Hierdoor zijn de "formules" in stap 1 en de hiërarchielijst in stap 4 onleesbaar op mobiel.
- [PASS] Design tokens — DGSkills-palette consistent

## Didactiek
- SLO-audit quote: "Leerdoel: onvoldoende - de opdracht draait vooral om communiceren en ontwerpen; herlabel naar 21B/22A of voeg echte data-/systeemcomponent toe. Opbouw: goed - flyer en presentatie zijn een logische afronding van planning en visie."
- UI-koppeling: de missie richt zich volledig op flyer-ontwerp en communicatie (kop, kernboodschap, CTA, visuele hiërarchie). De SLO-koppeling `21A, 21C` (bestandsbeheer / ICT-systemen) klopt niet met de missie-inhoud. Dat is een didactische fout in de config-context, niet in ToolGuide.tsx. De praktische flyer-opdrachten zijn didactisch sterk (stap 1 vraagt 3 opties te bedenken en te kiezen — Bloom: evalueren).

## Bevindingen (severity)
1. [MAJOR] `\n`-tekens in `instruction`-tekst worden door `RichText`-renderer niet vertaald naar zichtbare regelbreuk (`<br>` of `whitespace-pre`). Stap 1 toont de drie formules als één aaneengesloten tekst; stap 4 toont de hiërarchielijst als één blok. Op mobiel onleesbaar — `ToolGuide.tsx:82-98` (RichText mist `white-space: pre-line` of newline-parsing)
2. [MINOR] `maxScore: 60` maar berekenbare max is 55 — zelfde patroon als andere configs — `configs/mission-launch.ts:105`
3. [MINOR] SLO-koppeling in de SLO-audit (`21A, 21C`) sluit niet aan op de feitelijke missie-inhoud (communicatieontwerp) — dit is een curriculum-mapping issue, buiten scope van runtime-audit, maar ter informatie

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/mission-launch.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
