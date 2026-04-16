# Runtime-audit: pitch-perfect
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'pitch-perfect'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `pitch-perfect`. Chat opent zonder kaderstellende introductie van de pitch-coach.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat slechts `STEP_COMPLETE:1`. Stappen 2 (uitschrijven), 3 (oefenen/feedback) en 4 (jury-vragen) missen een marker. **Patroon-A bevestigd.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout werkt correct. MobileTabBar aanwezig.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Stap 1 (6 pitchonderdelen) heeft substantieel tekstgebied; scrollt correct.
- [PASS] Design tokens — consistente `lab-*` kleuren en Outfit/Newsreader fonts. Geen afwijkingen.

## Didactiek
- SLO-audit quote: "Pitch Perfect — Leerdoel: goed — communiceren over een digitaal product past goed bij media en productpresentatie; voeg expliciet doelgroepanalyse toe in de rubric."
- UI-koppeling: De 4 stappen (structuur → uitschrijven → oefenen → jury-vragen) vormen een volledige pitchcyclus en dekken SLO 21B (informatieverwerking/presenteren) en 22A (creëren) goed. Doelgroepanalyse ontbreekt als checklist-item: de stap 'pitch-structuur' vermeldt de jury als publiek maar checkt niet of de leerling de jury heeft gekarakteriseerd. Geen differentiatie-spoor; podiumvaardigheid verschilt sterk per leerling (bevestigt SLO-audit).

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft 1 marker voor een 4-staps missie. Stap-afsluiting voor stappen 2-4 via AI werkt niet. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `pitch-perfect`.
3. [MINOR] Geen `reflectionQuestion` in config-stappen. — fix: `components/missions/templates/builder-canvas/configs/pitch-perfect.ts`
4. [MINOR] Doelgroepanalyse (jury-karakterisatie) ontbreekt als checklist-item in stap 1 (SLO-auditaanbeveling). — fix: voeg checklist-item toe: "Ik heb beschreven wie de jury is en wat zij belangrijk vinden."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/pitch-perfect.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 427808)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 3, Periode 4)
