# Runtime-audit: video-editor
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures (4), enableChat: true, chatRoleId: 'video-editor', previewType: 'text-preview', steps (4), maxScore: 100, badges (5), takeaways (5) aanwezig.
- [PASS] Phase-transitions — BuilderCanvas.tsx doorloopt stappen 0..3 (concept, storyboard, shotlist, montageplan); `handleNextStep` en `isLastStep`-logica correct.
- [WARN] EERSTE_BERICHT — `enableChat: true` ingesteld; systemInstruction voor 'video-editor' aanwezig. GEEN `EERSTE_BERICHT`-marker. Chat opent zonder AI-opening. Zelfde patroon als digital-storyteller.
- [WARN] STEP_COMPLETE ≥ 3 — systemInstruction beschrijft marker voor "stapnummer 1, 2, of 3"; config heeft 4 stappen. Stap 4 (montageplan) mist STEP_COMPLETE:4.
- [WARN] Verificatievragen aanwezig — alle 4 stappen hebben `checklistItems` (3-4 items). GEEN `reflectionQuestion` in enige stap. Geen kennistoets-component aanwezig. Checklist verifieert aanwezigheid van content maar niet begrip.

## Visueel (code-level)
- [PASS] Responsive — gedeelde BuilderCanvas.tsx; split-layout, MobileTabBar, `md:flex-row` aanwezig.
- [PASS] Overflow — config bevat geen brede elementen; storyboard-instructie verwijst naar tekstuele beschrijvingen (geen tabel of grafiek).
- [PASS] Design tokens — badge-kleuren (`#F59E0B`, `#10B981`, `#D97757`, `#8B5CF6`, `#6B6B66`) consistent.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Video Editor | 22A, 21B | Leerdoel: goed - verhaalstructuur en montage passen goed; voeg expliciet een criterium toe voor ritme en publiekswerking. Bloom: goed - creeren past goed voor leerjaar 2. Opbouw: goed - sterke culminatie van meerdere mediavaardigheden; laat leerlingen eerder gemaakte merk- of verhaalideeën hergebruiken. Activerend: goed - plannen, monteren en publiceren is zeer actief; voeg een feedbackscreening toe. Differentiatie: matig - weinig zichtbaar basis/verdieping; bied een basismontagepad en een expertspoor met audio/ondertiteling."
- UI-koppeling: Stap 1 (concept) + stap 2 (storyboard) + stap 3 (shotlist) + stap 4 (montageplan) dekken de volledige productiecyclus — audit-compliment "sterke culminatie" is terecht. "Criterium voor ritme en publiekswerking" ontbreekt als expliciete checklistitem. "Feedbackscreening" (stap 4) is beschreven in instructie maar niet als structureel onderdeel. "Basismontagepad vs. expertspoor" niet geïmplementeerd.
- SLO-mapping (`config/slo-kerndoelen-mapping.ts` regel 129): `['22A', '21B']` — passend.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE-marker in systemInstruction beschrijft stap 1-3; config heeft 4 stappen. Stap 4 (montageplan) mist STEP_COMPLETE:4. Zelfde bug als digital-storyteller en app-prototyper. — fix: `supabase/functions/_shared/systemInstructions.ts` (entry "video-editor"): update naar stap 1-4.
2. [MINOR] Geen EERSTE_BERICHT — chat opent zonder AI-opening. Drie van drie builder-canvas missies met enableChat missen dit. Patroon-bug. — fix: voeg EERSTE_BERICHT toe aan alle drie builder-canvas systemInstructions.
3. [MINOR] Geen `reflectionQuestion` — kennistoets ontbreekt volledig in alle 4 stappen. — fix: voeg minimaal 1 `reflectionQuestion` toe, bijv. bij stap 2 (storyboard) over camerahoek-keuze.

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/video-editor.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SLO-audit-row: "Video Editor | 22A, 21B | Leerdoel: goed - verhaalstructuur en montage passen goed; voeg expliciet een criterium toe voor ritme en publiekswerking. [...] Differentiatie: matig - weinig zichtbaar basis/verdieping; bied een basismontagepad en een expertspoor met audio/ondertiteling."
