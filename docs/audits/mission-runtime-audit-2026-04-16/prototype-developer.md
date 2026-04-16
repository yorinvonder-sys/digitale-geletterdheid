# Runtime-audit: prototype-developer
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'prototype-developer'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `prototype-developer`. Chat opent zonder context over de huidige bouwfase.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat slechts `STEP_COMPLETE:1`. Stappen 2 (ontwerpen), 3 (bouwen) en 4 (testen/itereren) missen een marker. **Patroon-A bevestigd.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout werkt correct. MobileTabBar biedt wisseling instructies/preview.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Stap 3 (bouwen) heeft lange instructietekst die correct scrollt.
- [PASS] Design tokens — consistente `lab-*` kleuren en Outfit/Newsreader fonts. Geen afwijkingen.

## Didactiek
- SLO-audit quote: "Prototype Developer — Leerdoel: goed — ontwerp, bouw en iteratie passen direct bij 22A/22B; voeg expliciet een criterium toe voor testbaar probleemoplossend vermogen."
- UI-koppeling: De 4 stappen (idee uitwerken → ontwerpen → bouwen → testen/itereren) vormen een volledige ontwikkelcyclus en dekken SLO 22A en 22B goed. Het genoemde criterium voor 'testbaar probleemoplossend vermogen' ontbreekt in de checklistItems van stap 4 (testen): er staat wel een 'verbetering'-item maar geen expliciete meetbaarheids-check. Geen differentiatie-spoor.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft 1 marker voor een 4-staps missie. Stap-afsluiting voor stappen 2-4 via AI werkt niet. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `prototype-developer`.
3. [MINOR] Geen `reflectionQuestion` in config-stappen. — fix: `components/missions/templates/builder-canvas/configs/prototype-developer.ts`
4. [MINOR] Stap 4 mist expliciete meetbaarheidscheck voor probleemoplossend vermogen (SLO-aanbeveling). — fix: voeg checklist-item toe: "Ik heb beschreven hoe ik weet of mijn prototype het probleem daadwerkelijk oplost (meetcriterium)."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/prototype-developer.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 422664)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 3, Periode 4)
