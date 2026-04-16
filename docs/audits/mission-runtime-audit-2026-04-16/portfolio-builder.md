# Runtime-audit: portfolio-builder
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'portfolio-builder'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `portfolio-builder`. Chat opent zonder welkomstboodschap of stap-context.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat slechts `STEP_COMPLETE:1`. Stappen 2 (reflecties), 3 (structuur) en 4 (persoonlijk profiel) hebben geen bijbehorende completion-marker. **Patroon-A bevestigd.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout via `md:flex-row`, MobileTabBar actief. Correct op mobiel en desktop.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Lange tekstinvoer scrollt correct.
- [PASS] Design tokens — consistente `lab-*` kleuren en Outfit-font via inline style. Geen afwijkingen.

## Didactiek
- SLO-audit quote: "Portfolio Builder — Leerdoel: goed — digitaal presenteren van eigen werk past goed; voeg expliciet een criterium toe voor navigatie en context per project."
- UI-koppeling: De 4 stappen (projectselectie → reflecties → structuur → persoonlijk profiel) dekken SLO 21A (communiceren) en 22A (creëren) goed. Het ontbrekende criterium voor navigatie en projectcontext is niet terug te vinden in de checklistItems: stap 3 (portfolio-structuur) checkt wel `eerste-indruk` en `secties` maar benoemt navigatielogica niet expliciet. Geen differentiatie-spoor.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft 1 marker voor een 4-staps missie. AI kan stap-afsluiting voor stappen 2-4 niet signaleren. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `portfolio-builder`.
3. [MINOR] Geen `reflectionQuestion` in config-stappen. Leerling mist metacognitief moment per stap. — fix: `components/missions/templates/builder-canvas/configs/portfolio-builder.ts`
4. [MINOR] Stap 3 (structuur) mist navigatiecriterium. Sluit niet volledig aan op de SLO-auditaanbeveling. — fix: voeg checklist-item toe: "Ik heb beschreven hoe een bezoeker door mijn portfolio navigeert van sectie naar sectie."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/portfolio-builder.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 412083)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 3, Periode 4)
