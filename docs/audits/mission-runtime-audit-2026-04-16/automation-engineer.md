# Runtime-audit: automation-engineer
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"automation-engineer"` aanwezig in `systemInstructions.ts` (regel 57); bevat persona, SLO-koppeling (22B, 21A), welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: taak-analyse, algoritme, script-structuur, testplan (4 stuks). Stap 4 (`testplan`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — geen `reflectionQuestion` in config; checklist-items per stap aanwezig (4 items per stap)

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` + `PreviewPanel` sub-componenten aanwezig
- [WARN] Overflow — stap 2 en 3 vragen pseudocode resp. Python-structuur; meerdere regels code in `text-preview` kunnen op mobiel scrollen vereisen
- [PASS] Design tokens — geen afwijking in config

## Didactiek
- SLO-audit quote: "Automation Engineer | 22A, 22B | Leerdoel: goed - scriptmatig automatiseren past goed bij product en code; voeg expliciet functie- en lusbegrippen toe in de beoordelingscriteria. Bloom: goed - creeren past goed en is relevant voor leerjaar 2. Differentiatie: matig - open taakkeuze helpt, maar steun ontbreekt; bied voorbeeldtaken en een verdiepend script met invoer of foutafhandeling."
- UI-koppeling: Stap 4 `testplan` is de meest cognitief veeleisende stap (dry-run, testcases, veiligheid) en sluit direct aan op SLO 22B — maar valt buiten AI-marker bereik (patroon-A). SystemInstruction benadrukt tijdsbesparing en efficiëntie, wat goed aansluit op stap 1.

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`testplan`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"automation-engineer"` (regel 57)

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/automation-engineer.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 57
