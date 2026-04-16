# Runtime-audit: web-developer
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"web-developer"` aanwezig in `systemInstructions.ts` (regel 54); bevat persona, werkwijze, XP-farming detectie, welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: html-structuur, css-layout, javascript, testen (4 stuks). Stap 4 (`testen`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — geen `reflectionQuestion` in steps; checklist-items per stap aanwezig (3-4 items)

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` en `PreviewPanel` sub-componenten actief
- [WARN] Overflow — code-invoer in `text-preview` voor JavaScript/HTML kan breed worden op mobiel; geen max-width beperking zichtbaar in config
- [PASS] Design tokens — geen afwijking in config

## Didactiek
- SLO-audit quote: "Web Developer | 22A, 22B | Leerdoel: goed - duidelijke koppeling tussen productontwerp en code; voeg een criterium toe voor toegankelijkheid of responsiviteit. Bloom: goed - creeren is passend en motiverend voor leerjaar 2. Differentiatie: goed - ontwerpvrijheid geeft ruimte; voeg wel een basischecklist en expertfeatures toe."
- UI-koppeling: Stap 3 `javascript` bevat gerichte checklist (addEventListener, DOM-manipulatie, sluitknop) — goede aansluiting met SLO 22B. Stap 4 `testen` vraagt testplan en debug-redenering — valt buiten bereik AI-marker (patroon-A).

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`testen`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"web-developer"` (regel 54)

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/web-developer.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 54
