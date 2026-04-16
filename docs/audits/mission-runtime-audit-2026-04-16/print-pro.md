# Runtime-audit: print-pro
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig
- [PASS] Step-checks — 4 stappen; alle 4 hebben `verificationQuestion`
- [PASS] Terminal states — bereikbaar; 4 verificatievragen × 5 + 4 × 10 = max 60 pts; `maxScore: 60` — correct
- [PASS] Screenshot/assets refs — geen screenshot-sleutels; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — `max-w-md mx-auto`, `p-4` consistent
- [PASS] Screenshot-overflow — niet van toepassing
- [WARN] Design tokens — badge-kleuren `#6B6B66` en `#64748B` zijn grijstinten buiten het standaard DGSkills-palet (`#D97757`, `#10B981`, `#3B82F6`). Functioneel correct maar visueel inconsistent met badgekleuren in andere configs.

## Didactiek
- SLO-audit quote: "Leerdoel: goed - sluit precies aan op functioneel printen en inleveren; voeg een storingsscenario toe voor echte transfer. Bloom: goed - toepassen past; voeg 1 analysetaak toe waarin verkeerde instellingen worden herkend. Opbouw: goed - sluit de keten van maken, opslaan en inleveren logisch af."
- UI-koppeling: de missie is school-agnostisch (RICOH myPrint / PaperCut / FollowMe worden als opties benoemd) — dat is correct voor een tool-guide die op meerdere scholen gebruikt wordt. Stap 1 vraagt actief uit te zoeken welk systeem de school gebruikt. Verificatievraag bij stap 3 (dubbelzijdig) dekt de Bloom-wens "analysetaak bij verkeerde instellingen".

## Bevindingen (severity)
1. [MINOR] Badge-kleuren `#6B6B66` en `#64748B` zijn grijstinten die visueel weinig onderscheid tonen ten opzichte van de lege/neutrale staat — overweeg een kleur met meer contrast (bijv. `#3B82F6`) voor de tweede badge — `configs/print-pro.ts:111-117`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/print-pro.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
