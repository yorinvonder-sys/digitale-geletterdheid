# Runtime-audit: meme-machine
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"meme-machine"` aanwezig in `systemInstructions.ts` (regel 62); bevat persona, SLO-koppeling (21B, 23B), welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: meme-analyse, viraliteit, eigen-meme, verantwoord (4 stuks). Stap 4 (`verantwoord`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — geen `reflectionQuestion` in config; checklist-items per stap aanwezig

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` sub-component actief
- [PASS] Overflow — tekstuele analyse-invoer; geen overflow risico
- [PASS] Design tokens — geen afwijking in config

## Didactiek
- SLO-audit quote: "Meme Machine | 21B, 23B | Leerdoel: goed - mediawerking en bewuste keuzes zijn zichtbaar; voeg expliciet een ethische check toe op stereotypering en verspreiding. Bloom: goed - analyseren/creeren past goed voor leerjaar 2. Differentiatie: matig - geen expliciete niveaulijnen; bied een basisformat en een verdiepende analyse van viraliteitspatronen."
- UI-koppeling: Stap 4 `verantwoord` is de ethische reflectiestap — de meest waardevolle stap voor SLO 23B — maar valt buiten AI-marker bereik (patroon-A). SystemInstruction benoemt expliciet "Houd het respectvol: geen memes die kwetsen of discrimineren", wat goed aansluit op deze stap.

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`verantwoord`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"meme-machine"` (regel 62)

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/meme-machine.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 62
