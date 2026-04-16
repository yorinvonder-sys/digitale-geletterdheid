# Runtime-audit: brand-builder
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"brand-builder"` aanwezig in `systemInstructions.ts` (regel 64); bevat persona, SLO-koppeling (22A, 21B), welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: merkanalyse, kleurenpalet, logo-concept, huisstijl (4 stuks). Stap 4 (`huisstijl`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — stap 2 (`kleurenpalet`) heeft een `reflectionQuestion` (kleurcontrast, bonusPoints: 5) correct aanwezig

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` + `PreviewPanel` sub-componenten aanwezig
- [PASS] Overflow — tekstuele design-beschrijvingen; geen layout-overflow risico
- [PASS] Design tokens — geen afwijking in config

## Didactiek
- SLO-audit quote: "Brand Builder | 22A, 21B | Leerdoel: goed - merkidentiteit en doelgroepgericht media-ontwerp passen sterk; voeg een criterium toe voor consistentie tussen keuzes. Bloom: goed - creeren/evalueren past goed voor leerjaar 2. Differentiatie: goed - open ontwerpkeuzes bieden ruimte; voeg een basis-template en een expertopdracht met meerdere uitingen toe."
- UI-koppeling: Stap 4 `huisstijl` is de integrerende afsluiting van alle ontwerpkeuzes — juist de meest samenhangende stap valt buiten AI-marker bereik (patroon-A). `reflectionQuestion` in stap 2 over WCAG-contrast is sterke didactische koppeling.

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`huisstijl`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"brand-builder"` (regel 64)

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/brand-builder.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 64
