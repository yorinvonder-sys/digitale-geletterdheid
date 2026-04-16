# Runtime-audit: innovation-lab
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'innovation-lab'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `innovation-lab`. De chat opent blanco; de AI weet niet welke stap de leerling bij aanvang zit.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat slechts `STEP_COMPLETE:1`. Stappen 2, 3 en 4 hebben geen bijbehorende completion-trigger. AI kan stap-overgang voor stappen 2-4 niet herkennen. **Patroon-A bevestigd.**
- [FAIL] Verificatievragen — geen verificatievragen aanwezig in systemInstruction. Geen van de 4 config-stappen heeft een `reflectionQuestion` in de config.

## Visueel (code-level)
- [PASS] Responsive — split-layout via `md:flex-row`, MobileTabBar schakelt tussen 'instructies' en 'preview' op mobiel. Geen issues in BuilderCanvas.tsx.
- [PASS] Overflow — `overflow-y-auto` op beide panelen (StepInstructionPanel en PreviewPanel). Canvas scrollt correct.
- [PASS] Design tokens — consistent gebruik van `lab-*` kleuren (`#D97757`, `#FAF9F0`, `#1A1A19`, `#6B6B66`, `#10B981`). Fonts: Outfit + Newsreader via inline `style`.

## Didactiek
- SLO-audit quote: "Innovation Lab — Leerdoel: matig — 22A past, maar 21D is niet expliciet in de zichtbare stappen; maak AI een verplichte ontwerpkeuze of herlabel naar bredere technologie."
- UI-koppeling: De 4 stappen (SDG-probleem → technologische oplossing → prototype-concept → impact) dekken SLO 22A (creëren) goed. SLO 21D (AI) verschijnt niet als verplicht keuzemoment in de stap-instructies, wat de audit-observatie bevestigt. Geen differentiatie-spoor (basis/verdieping) zichtbaar in de config.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft 1 marker voor een 4-staps missie. Stappen 2-4 triggeren geen stap-afsluiting via AI. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe per betreffende stap.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. Chat start zonder context over de huidige stap. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `innovation-lab`.
3. [MINOR] Geen `reflectionQuestion` in config-stappen. Geen bonuspunten mogelijk. Leerling mist verdiepend denkmoment na elke stap. — fix: `components/missions/templates/builder-canvas/configs/innovation-lab.ts` → voeg `reflectionQuestion` toe per stap.
4. [MINOR] SLO 21D niet afdwingbaar in UI. Stap 2 beschrijft vrije technologiekeuze zonder AI-verplicht element. — fix: voeg in stap 'technologie-oplossing' een checklist-item toe: "Ik heb beschreven of/hoe AI een rol speelt in mijn oplossing."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/innovation-lab.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 389757)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 3, Periode 3)
