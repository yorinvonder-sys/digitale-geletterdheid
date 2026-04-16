# Runtime-audit: mission-vision
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave2-buildercanvasB
- Status: FAIL

## Functioneel (code-level)
- [PASS] Config compleet — `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `enableChat: true`, `chatRoleId: 'mission-vision'`, `previewType: 'text-preview'`, 4 stappen, `maxScore: 100`, 5 badges, 5 takeaways aanwezig.
- [FAIL] EERSTE_BERICHT — geen `EERSTE_BERICHT`-blok in systemInstruction voor `mission-vision`. Chat opent zonder introductie van de visionair-strateeg.
- [FAIL] STEP_COMPLETE (markers:1, config-stappen:4) — systemInstruction bevat 2× `STEP_COMPLETE:1` (duplicate) maar geen markers voor stap 2-4. **Patroon-A bevestigd. Duplicate marker is identiek aan het patroon bij `mission-blueprint` — bevestigt dat beide instructies via dezelfde gebrekkige template-generatie zijn aangemaakt.**
- [FAIL] Verificatievragen — geen verificatievragen in systemInstruction. Geen `reflectionQuestion` in config-stappen.

## Visueel (code-level)
- [PASS] Responsive — split-layout werkt correct. MobileTabBar aanwezig.
- [PASS] Overflow — `overflow-y-auto` op beide panelen. Stap 3 (5 slides beschrijven) heeft substantieel tekstvolume; scrollt correct.
- [WARN] Design tokens — stap 3 bevat het concept "moodboard" waarbij leerling een platform kiest (Canva, Pinterest, PowerPoint, Google Slides). De PreviewPanel toont alleen tekst (`text-preview`). Visuele resultaten van een moodboard zijn niet zichtbaar in de preview. Dit is een inherente beperking van het `text-preview`-type voor een visueel-georiënteerde missie.

## Didactiek
- SLO-audit quote: "De Visie — Leerdoel: goed — moodboard en AI-gebruik passen goed bij creatief conceptontwerp; voeg een criterium toe voor doelgroeppassing."
- UI-koppeling: De 4 stappen (visie formuleren → moodboard → slides ontwerpen → pitchen) dekken SLO 21D (AI) en 22A (creëren) goed. Het ontbrekende doelgroepcriterium is gedeeltelijk aanwezig: stap 1 vraagt "Wie profiteert ervan?" maar er is geen checklist-item dat doelgroeppassing als succes-criterium borgt. De `text-preview` mismatch met het visuele karakter van stap 2 (moodboard) en stap 3 (slides) is een didactische beperking: leerling beschrijft beelden maar kan ze niet tonen.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE mismatch: systemInstruction heeft slechts `STEP_COMPLETE:1` (2× duplicate) voor een 4-staps missie. AI signaleert stap 2-4 nooit als afgerond. — fix: `supabase/functions/_shared/systemInstructions.ts` → verwijder duplicate, voeg `STEP_COMPLETE:2`, `STEP_COMPLETE:3`, `STEP_COMPLETE:4` toe.
2. [MAJOR] Geen EERSTE_BERICHT in systemInstruction. — fix: `supabase/functions/_shared/systemInstructions.ts` → voeg `EERSTE_BERICHT`-blok toe voor `mission-vision`.
3. [MAJOR] SystemInstruction is opvallend spaarzaam (3 bullets, generieke rol) net als `mission-blueprint`. Beide zijn waarschijnlijk niet bijgewerkt na de template-split. — fix: herschrijf/extend de systemInstruction voor `mission-vision`.
4. [WARN] `previewType: 'text-preview'` is functioneel maar niet ideaal voor een visueel-georiënteerde missie (moodboard + slides). Leerling beschrijft beelden maar kan ze niet laten zien in de preview. — fix: overweeg of dit een acceptabele inperking is, of voeg een upload/link-veld toe in stap 2-3.
5. [MINOR] Geen `reflectionQuestion` in config-stappen. — fix: `components/missions/templates/builder-canvas/configs/mission-vision.ts`
6. [MINOR] Doelgroepcriterium ontbreekt als checklist-item (SLO-aanbeveling). — fix: voeg in stap 1 toe: "Ik heb beschreven voor welke doelgroep mijn visie/idee bedoeld is en hoe het hun leven verandert."

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/mission-vision.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- Sub-componenten: `components/missions/templates/builder-canvas/sub/`
- SystemInstruction: `supabase/functions/_shared/systemInstructions.ts` (pos. 143300)
- SLO-audit: `docs/audits/didactische-audit-missies-2026-03-07.md` (Leerjaar 1, Periode 4)
