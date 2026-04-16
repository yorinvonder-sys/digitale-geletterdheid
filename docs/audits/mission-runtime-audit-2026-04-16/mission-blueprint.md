# Runtime-audit: mission-blueprint
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'mission-blueprint'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `mission-blueprint`. Bovendien is de systemInstruction opvallend kort en generiek (Project Manager, focus op takenlijst/tijd/resources) vergeleken met de andere nieuwere instructies.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat 2× `STEP_COMPLETE:1` (duplicate) maar geen `STEP_COMPLETE:2`, `STEP_COMPLETE:3` of `STEP_COMPLETE:4`. Stappen 2-4 worden door de AI nooit afgerond gesignaleerd. **Patroon-A bevestigd. Bovendien: duplicate marker suggereert een copy-paste fout bij het opstellen van de instructie.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout werkt correct. MobileTabBar aanwezig.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Stap 2 (minimaal 8 taken met tijdsinschatting) bevat groot tekstgebied; scrollt correct.
- [PASS] Design tokens — consistente `lab-*` kleuren en Outfit/Newsreader fonts. Geen afwijkingen.

## Didactiek
- SLO-audit quote: "De Blauwdruk — Leerdoel: goed — plannen in Word/OneDrive past direct bij systemen en productaanpak; voeg een succescriterium toe voor haalbare planning."
- UI-koppeling: De 4 stappen (project beschrijven → taken opschrijven → volgorde bepalen → opslaan in de cloud) dekken SLO 21A (systemen gebruiken) en 22A (creëren) goed. Het ontbrekende succescriterium voor 'haalbare planning' is niet terug te vinden in de checklistItems: stap 2 checkt minimaal 8 taken en tijdsinschattingen, maar niet of die tijdsinschattingen realistisch zijn. Geen differentiatie-spoor.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft slechts `STEP_COMPLETE:1` (2× duplicate) voor een 4-staps missie. AI kan stap 2-4 niet afsluiten. — fix: `supabase/functions/_shared/systemInstructions.ts` → verwijder duplicate, voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `mission-blueprint`.
3. [MAJOR] SystemInstruction is opvallend spaarzaam (3 bullets, generieke rol) t.o.v. de rijke config. Suggest dat de instructie een oude/onvolledige versie is die nooit is bijgewerkt na de template-split. — fix: herschrijf/extend de systemInstruction voor `mission-blueprint` conform de rijke instructie-opbouw van de andere meesterproef-missies.
4. [MINOR] Geen `reflectionQuestion` in config-stappen. — fix: `components/missions/templates/builder-canvas/configs/mission-blueprint.ts`
5. [MINOR] Stap 2 mist haalbaarheidscriteria voor tijdsinschattingen (SLO-aanbeveling). — fix: voeg checklist-item toe: "Geen enkele taak duurt langer dan 2 uur (anders gesplitst)."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/mission-blueprint.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 139475)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 1, Periode 4)
