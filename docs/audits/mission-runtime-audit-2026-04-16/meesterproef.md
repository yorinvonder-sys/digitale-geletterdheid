# Runtime-audit: meesterproef
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'meesterproef'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `meesterproef`. Chat opent zonder introductie van de eindproject-coach.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat slechts `STEP_COMPLETE:1`. Stappen 2 (ontwikkelproces), 3 (eindproduct) en 4 (verdediging) missen een marker. **Patroon-A bevestigd.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout via `md:flex-row` werkt correct. MobileTabBar aanwezig.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Stap 2 (ontwikkeldagboek voor 3 sessies) bevat het meeste tekstvolume; scrollt correct.
- [PASS] Design tokens — consistente `lab-*` kleuren en Outfit/Newsreader fonts. Geen afwijkingen.

## Didactiek
- SLO-audit quote: "De Meesterproef — Leerdoel: matig — als integrerend eindproject is breedte logisch, maar alle 9 kerndoelen tegelijk zijn in deze bron niet hard aantoonbaar; werk met een bewijs-matrix per kerndoel of beperk de koppeling tot verplichte onderdelen."
- UI-koppeling: De config koppelt aan alle 9 kerndoelen (21A–23C). De checklistItems per stap zijn concreet en productgericht, maar er is geen bewijs-matrix in de UI die aantoont welk checklist-item welk kerndoel dekt. Dit bevestigt de SLO-auditobservatie rechtstreeks. Geen formele go/no-go-momenten of begeleidingsmomenten als UI-element. Geen differentiatie-spoor.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft 1 marker voor een 4-staps missie. Stap-afsluiting voor stappen 2-4 via AI werkt niet. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `meesterproef`.
3. [MINOR] Geen `reflectionQuestion` in config-stappen. Missie bevat de zwaarste leertaak van het curriculum maar biedt geen metacognitieve verdiepingsvragen. — fix: `components/missions/templates/builder-canvas/configs/meesterproef.ts`
4. [MINOR] Geen bewijs-matrix in UI: de relatie tussen checklistItems en de 9 SLO-kerndoelen is onzichtbaar voor leerling en docent. — fix: overweeg een tooltip of label per stap-header met de bijbehorende kerndoel-codes.

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/meesterproef.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 438140)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 3, Periode 4)
