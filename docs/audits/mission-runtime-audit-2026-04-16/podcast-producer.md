# Runtime-audit: podcast-producer
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"podcast-producer"` aanwezig in `systemInstructions.ts` (regel 61); bevat persona, SLO-koppeling (22A, 21B), welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: onderwerp, structuur, intro, vragen (4 stuks). Stap 4 (`vragen`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — stap 3 (`intro`) heeft een `reflectionQuestion` met bonusPoints: 5 aanwezig en correct gevuld

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` sub-component actief voor mobile-layout
- [PASS] Overflow — `text-preview` voor tekstuele podcast-inhoud; geen breed-overflow risico
- [PASS] Design tokens — geen afwijking in config

## Didactiek
- SLO-audit quote: "Podcast Producer | 22A, 21B | Leerdoel: goed - script en doelgroep passen bij media maken; voeg expliciet een criterium toe voor brongebruik of feitelijke correctheid. Bloom: goed - creeren past goed voor leerjaar 2. Differentiatie: matig - open onderwerpkeuze helpt, maar steun ontbreekt; bied een scriptsjabloon en een verdiepingsoptie met sound design."
- UI-koppeling: `reflectionQuestion` in stap 3 test begrip van "hook vs. intro" — directe didactische koppeling. Stap 4 interviewvragen is de meest complexe stap, maar valt buiten AI-marker bereik (patroon-A).

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`vragen`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"podcast-producer"` (regel 61)

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/podcast-producer.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 61
