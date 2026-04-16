# Runtime-audit: app-prototyper
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures, enableChat: true, chatRoleId: 'app-prototyper', previewType: 'text-preview', steps (4), maxScore: 100, badges (5), takeaways aanwezig.
- [PASS] Phase-transitions — BuilderCanvas.tsx doorloopt intro -> building (step 0..3) -> results; handleNextStep schakelt correct door; isLastStep detectie aanwezig (regel 130).
- [WARN] EERSTE_BERICHT — enableChat: true en chatRoleId: 'app-prototyper' zijn ingesteld. systemInstructions.ts heeft een entry voor 'app-prototyper'. Echter: GEEN EERSTE_BERICHT-marker aangetroffen in de systemInstruction. De chat opent zonder voorgedefinieerd openingsbericht vanuit de AI.
- [WARN] STEP_COMPLETE >= 3 — STEP_COMPLETE-instructie aanwezig maar verwijst naar "stapnummer 1, 2, of 3" terwijl config 4 stappen heeft. Mismatch: stap 4 (testplan) krijgt nooit een STEP_COMPLETE:4 marker.
- [PASS] Verificatievragen aanwezig — stap 'schermen-ontwerpen' heeft reflectionQuestion met 4 opties, correctIndex: 1, bonusPoints: 5. Overige stappen hebben checklistItems als verificatie.

## Visueel (code-level)
- [PASS] Responsive — BuilderCanvas.tsx gebruikt flex flex-col md:flex-row (regel 240); MobileTabBar schakelt panelen op mobiel; md:w-[45%] en md:w-[55%] voor split-layout.
- [PASS] Overflow — overflow-y-auto op linker panel; geen hardcoded px-widths in root-layout.
- [PASS] Design tokens — badge-kleuren (#F59E0B, #10B981, #D97757, #8B5CF6, #6B6B66) consistent met projectpalet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "App Prototyper | 22A, 22B | Leerdoel: matig - 22A past goed, maar 22B is in de zichtbare stappen niet expliciet; voeg klikbare logica, states of eenvoudige programmeerstappen toe. Bloom: goed - creeren past voor leerjaar 2. Opbouw: goed - doelgroep, schermen en flow zijn een logische ontwerpketen; laat de missie voorafgaan aan een bouw- of testmoment. Activerend: goed - leerling ontwerpt een eigen oplossing; voeg gebruikerstesten of taakscenarios toe. Differentiatie: goed - open probleemkeuze biedt variatie; maak ook een basis-template beschikbaar voor leerlingen die minder ontwerpsterk zijn."
- UI-koppeling: Stap 4 (testplan) dekt de "gebruikerstesten"-aanbeveling gedeeltelijk. 22B (programmeerlogica) is niet zichtbaar in stappen — audit-kritiek is terecht en niet opgelost in de huidige config. Differentiatie via open probleemkeuze is aanwezig; basis-template ontbreekt als optie.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE-marker geconfigureerd voor maximaal stap 3, maar config heeft 4 stappen — stap 4 (testplan) genereert nooit een STEP_COMPLETE:4 event. — fix: supabase/functions/_shared/systemInstructions.ts (entry "app-prototyper"): update marker-instructie naar stap 1-4.
2. [MINOR] Geen EERSTE_BERICHT in systemInstruction — leerling start chat zonder AI-opening. — fix: voeg openingsbericht toe aan systemInstruction "app-prototyper".
3. [MINOR] SLO 22B niet zichtbaar in stappen — audit-aanbeveling niet geïmplementeerd. — fix: config stap 'gebruikersflow': voeg optionele logica/state-beschrijving toe.

## Bronnen
- Config: components/missions/templates/builder-canvas/configs/app-prototyper.ts
- Component: components/missions/templates/builder-canvas/BuilderCanvas.tsx
- SLO-audit-row: "App Prototyper | 22A, 22B | Leerdoel: matig - 22A past goed, maar 22B is in de zichtbare stappen niet expliciet; [...] Differentiatie: goed - open probleemkeuze biedt variatie; maak ook een basis-template beschikbaar."
