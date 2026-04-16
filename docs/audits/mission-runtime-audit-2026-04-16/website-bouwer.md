# Runtime-audit: website-bouwer
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [FAIL] EERSTE_BERICHT — geen entry `"website-bouwer"` in `systemInstructions.ts`; `chatRoleId: 'website-bouwer'` verwijst naar een niet-bestaande key
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** De systemInstruction-template beschrijft `STEP_COMPLETE:X` waarbij X = "1, 2, of 3". Config heeft 4 stappen. Stap 4 (`reflectie`) kan nooit via AI worden voltooid.
- [PASS] Verificatievragen — geen `reflectionQuestion` in config (niet verplicht); checklist-items aanwezig per stap

## Visueel (code-level)
- [PASS] Responsive — `BuilderCanvas.tsx` gebruikt `MobileTabBar` en `PreviewPanel`; mobile-first patroon aanwezig
- [WARN] Overflow — `previewType: 'text-preview'` voor HTML-code-invoer; grote blokken code in textarea kunnen op mobiel breed uitlopen
- [PASS] Design tokens — geen afwijking gevonden van `lab-*` tokenpatroon in config

## Didactiek
- SLO-audit quote: "Leerdoel: goed - duidelijke koppeling tussen productontwerp en code; voeg een criterium toe voor toegankelijkheid of responsiviteit."  *(Opmerking: de SLO-audit vermeldt `web-developer`, niet `website-bouwer` expliciet. Website-bouwer is de instapvariant op havo/mavo-niveau.)*
- UI-koppeling: Stap 4 `reflectie` vraagt metacognitie ("leg uit wat HTML doet"), maar heeft geen reflectievraag-widget (`reflectionQuestion`). De stap is inhoudelijk sterk maar heeft geen bonuspunten-mechanic.

## Bevindingen (severity)
1. [BLOCKER] `chatRoleId: 'website-bouwer'` bestaat niet in `systemInstructions.ts` — chat-knop is zichtbaar maar AI-aanroep faalt bij runtime — fix: voeg entry `"website-bouwer"` toe in `systemInstructions.ts`
2. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in systemInstruction zodra entry bestaat

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/website-bouwer.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (geen entry aanwezig)
