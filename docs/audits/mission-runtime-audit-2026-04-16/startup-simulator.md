# Runtime-audit: startup-simulator
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasA
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `steps` (4x), `badges`, `takeaways`, `maxScore` aanwezig
- [PASS] EERSTE_BERICHT — entry `"startup-simulator"` aanwezig in `systemInstructions.ts` (regel 85); bevat uitgebreide persona (coach-rol), SLO-koppeling (23C, 22A), Lean Canvas-model, welzijnsprotocol
- [FAIL] STEP_COMPLETE (markers: max 3, config-stappen: 4) — **Patroon-A bevestigd.** SystemInstruction zegt expliciet `"stapnummer is (1, 2, of 3)"`. Config heeft stappen: probleem-oplossing, businessmodel, marktanalyse, pitch (4 stuks). Stap 4 (`pitch`) kan via AI nooit worden gecompleteerd.
- [PASS] Verificatievragen — geen `reflectionQuestion` in config; checklist-items per stap aanwezig

## Visueel (code-level)
- [PASS] Responsive — `MobileTabBar` + `PreviewPanel` sub-componenten aanwezig
- [PASS] Overflow — tekstuele pitch-inhoud; geen layout-overflow risico
- [WARN] Design tokens — één badge heeft `minScore: 25` met emoji '🌱' en ook `minScore: 0` met '🌱' — dubbele emoji voor twee badges, geen technisch probleem maar visueel onduidelijk

## Didactiek
- SLO-audit quote: "Startup Simulator | 23B, 23C | Leerdoel: matig - de opdracht is sterk ondernemend, maar de koppeling aan digitaal welzijn is dun; voeg expliciet impact op gebruikers, verslavingsrisico of datagebruik toe. Bloom: goed - creeren/evalueren past goed voor leerjaar 3. Differentiatie: goed - open probleemkeuze geeft veel niveauruimte; voeg een basiscanvas en een verdiepende validatie-opdracht toe."
- UI-koppeling: SystemInstruction is inhoudelijk rijker dan de meeste andere missies (Lean Canvas, zakelijk inzicht, ethische overwegingen) en past goed bij stappen 1-3. Stap 4 `pitch` — de climax van de missie — is niet bereikbaar via AI-marker (patroon-A). SLO-audit wijst op zwakke koppeling 23B; systemInstruction adresseert dit met "Ethische overwegingen bij tech-startups (privacy, inclusiviteit, duurzaamheid)".

## Bevindingen (severity)
1. [MAJOR] Patroon-A: STEP_COMPLETE max :3, config heeft 4 stappen — stap 4 (`pitch`) kan via AI nooit worden gecompleteerd — fix: verhoog marker-maximum naar 4 in `systemInstructions.ts` entry `"startup-simulator"` (regel 85)
2. [MINOR] Dubbele badge-emoji: zowel `minScore: 25` als `minScore: 0` gebruiken '🌱' — fix: pas één badge aan in `startup-simulator.ts` regel 89-91

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/startup-simulator.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` regel 85
