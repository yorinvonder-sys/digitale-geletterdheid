# Runtime-audit: digital-storyteller
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures (4), enableChat: true, chatRoleId: 'digital-storyteller', previewType: 'text-preview', steps (4), maxScore: 100, badges (5), takeaways (5) aanwezig.
- [PASS] Phase-transitions — BuilderCanvas.tsx doorloopt stappen 0..3 (verhaalidee, flowchart, scène-schrijven, digitale-presentatie); `handleNextStep` en `isLastStep`-logica correct.
- [WARN] EERSTE_BERICHT — `enableChat: true` is ingesteld en systemInstruction voor 'digital-storyteller' bestaat. Echter: GEEN `EERSTE_BERICHT`-marker in de systemInstruction. Chat opent zonder AI-opening; leerling moet zelf starten. Scaffolding-gemis voor leerlingen die niet weten wat ze moeten vragen.
- [WARN] STEP_COMPLETE ≥ 3 — systemInstruction beschrijft STEP_COMPLETE-marker voor "stapnummer 1, 2, of 3" — config heeft 4 stappen. Stap 4 (digitale-presentatie) wordt nooit als compleet gemarkeerd via STEP_COMPLETE:4.
- [PASS] Verificatievragen aanwezig — alle 4 stappen hebben `checklistItems` (3-4 items elk); geen `reflectionQuestion` aanwezig in deze config (in tegenstelling tot app-prototyper). Verificatie via checklist is functioneel maar biedt geen kennistoets-component.

## Visueel (code-level)
- [PASS] Responsive — gedeelde BuilderCanvas.tsx; `flex flex-col md:flex-row`, MobileTabBar, `md:w-[45%]`/`md:w-[55%]` split. Mobiel volledig gedekt.
- [PASS] Overflow — geen overflow-risico; instructieteksten zijn redelijk kort; geen tabellen of brede elementen in config.
- [PASS] Design tokens — badge-kleuren (`#F59E0B`, `#10B981`, `#D97757`, `#8B5CF6`, `#6B6B66`) consistent.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Digital Storyteller | 22A, 21B | Leerdoel: goed - interactieve verhaalbouw koppelt media en productontwerp sterk; voeg een criterium toe voor coherente keuzes en verhaallogica. Bloom: goed - creeren past goed voor leerjaar 2. Opbouw: goed - bouwt logisch voort op media-analyse naar eigen narratief product; voeg peerfeedback op keuzemomenten toe. Activerend: goed - leerling ontwerpt verhaallijn en keuzes; zeer actief. Differentiatie: goed - genrekeuze en keuzepaden bieden natuurlijke verdieping; voeg een compact basispad voor minder sterke schrijvers toe."
- UI-koppeling: Stap 1 (verhaalidee) + stap 2 (flowchart) + stap 3 (scène-schrijven) dekken de "logische opbouw" goed. Stap 4 (digitale-presentatie) voegt mediabesef toe — passend bij 21B. Peerfeedback-aanbeveling is niet geïmplementeerd in config. "Compact basispad voor minder sterke schrijvers" ontbreekt als zichtbare optie. Criterium voor coherente keuzes/verhaallogica is niet als verplicht succescriterium geformuleerd (alleen als checklist-item impliciet).
- SLO-mapping (`config/slo-kerndoelen-mapping.ts` regel 127): `['22A', '21B']` — passend.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE-marker in systemInstruction beschrijft stap 1-3; config heeft 4 stappen. Stap 4 krijgt nooit STEP_COMPLETE:4. — fix: `supabase/functions/_shared/systemInstructions.ts` (entry "digital-storyteller"): update naar stap 1-4.
2. [MINOR] Geen EERSTE_BERICHT — chat opent zonder AI-opening; leerling moet initiëren. — fix: voeg EERSTE_BERICHT-blok toe aan systemInstruction met contextualiserende eerste vraag over het verhaalidee.
3. [MINOR] Geen `reflectionQuestion` in enige stap — kennistoets-component ontbreekt volledig. Overige builder-canvas missies (app-prototyper) hebben dit wel. Inconsistentie in template-gebruik.

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/digital-storyteller.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SLO-audit-row: "Digital Storyteller | 22A, 21B | Leerdoel: goed - interactieve verhaalbouw koppelt media en productontwerp sterk; [...] Differentiatie: goed - genrekeuze en keuzepaden bieden natuurlijke verdieping; voeg een compact basispad voor minder sterke schrijvers toe."
