# Runtime-audit: media-review
- Datum: 2026-04-16
- Template: review-arena
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId: 'media-review', title: 'De Media Mixer', introEmoji, introTitle, introDescription, maxScore: 100, badges (5), takeaways (5), rounds (4) aanwezig. Geen `enableChat` of `chatRoleId` in config.
- [PASS] Phase-transitions — 4 rounds: drag-sort (productiestappen video), match-pairs (mediabegrippen), categorize (bewuste vs. toevallige mediakeuze), rapid-fire (8 vragen). ReviewArena.tsx doorloopt correct sequentieel.
- [N.V.T.] EERSTE_BERICHT — `enableChat` niet in config. systemInstruction voor 'media-review' bestaat in systemInstructions.ts. Inconsistentie: instructie aanwezig maar geen chatinterface.
- [PASS] STEP_COMPLETE ≥ 3 — systemInstruction bevat STEP_COMPLETE-marker (al is chat afwezig); 4 rounds fungeren als stap-equivalenten.
- [PASS] Verificatievragen aanwezig — round `round-categorize` heeft `followUp` (4 opties, correctIndex: 1, bonusPoints: 5, uitgebreide explanation); round `round-rapid-fire` heeft 8 where/false vragen met explanation.

## Visueel (code-level)
- [PASS] Responsive — gedeelde ReviewArena.tsx; responsive-structuur is gedeeld over alle review-arena missies.
- [WARN] Overflow — `round-categorize` heeft 8 categorie-items en 2 categorieën. Op kleine schermen kan de "Bewuste mediakeuze" / "Geen mediakeuze" kolom-layout krap worden afhankelijk van de sub-component implementatie. Dit is niet verifieerbaar puur uit config maar is een risico bij lange labels ("Groen in een logo om duurzaamheid uit te stralen" = 41 tekens).
- [PASS] Design tokens — badge-kleuren (`#F59E0B`, `#10B981`, `#6366F1`, `#8B5CF6`, `#D97757`) consistent met projectpalet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "De Media Mixer | 22A, 21B, 23B | Leerdoel: goed - review van maken, media en keuzes sluit goed aan; voeg expliciet een criterium toe voor publieksimpact. Bloom: goed - analyseren/creeren past voor een periode-review. Opbouw: matig - als review staat hij te vroeg in het dashboard; zet hem na de productmissies of maak hem een korte instapscan. Activerend: matig - veel hangt af van vraagvorm; voeg een verplichte verbeteropdracht toe op basis van een voorbeeld. Differentiatie: matig - geen niveauversies zichtbaar; werk met basisitems en een expert-mediaplan."
- UI-koppeling: Drag-sort (videoproductie-stappen) en match-pairs (mediabegrippen) dekken 22A en 21B goed. Round `round-categorize` (bewuste vs. toevallige mediakeuze) raakt 23B (bewuste keuzes). Rapid-fire (8 vragen over podcasts, memes, branding, storytelling) dekt de breedte van P3. "Criterium voor publieksimpact" is niet als verplicht onderdeel zichtbaar. "Verplichte verbeteropdracht" (activerend-kritiek) niet geïmplementeerd — format is puur kennistoets. "Expert-mediaplan" als verdiepingsspoor ontbreekt.
- SLO-mapping (`config/slo-kerndoelen-mapping.ts` regel 130): `['22A', '21B', '23B']` — passend met de audit.

## Bevindingen (severity)
1. [MINOR] `enableChat` ontbreekt in config maar systemInstruction voor 'media-review' bestaat — zelfde inconsistentie als data-review en code-review-2. Maak de keuze expliciet. — fix: `components/missions/templates/review-arena/configs/media-review.ts` of verwijder de systemInstruction-entry.
2. [WARN] Mogelijke overflow op mobiel bij Categorize-round: labels tot 41 tekens in 2-koloms layout. Niet verifieerbaar zonder runtime-test, maar risico bij kleine schermen. — fix: controleer Categorize sub-component op tekstafkap of wrap-gedrag.
3. [MINOR] Geen differentiatie: alle items hebben gelijke moeilijkheid; audit-aanbeveling "basisitems en expert-mediaplan" niet geïmplementeerd.

## Bronnen
- Config: `components/missions/templates/review-arena/configs/media-review.ts`
- Component: `components/missions/templates/review-arena/ReviewArena.tsx`
- SLO-audit-row: "De Media Mixer | 22A, 21B, 23B | Leerdoel: goed - review van maken, media en keuzes sluit goed aan; voeg expliciet een criterium toe voor publieksimpact. [...] Differentiatie: matig - geen niveauversies zichtbaar; werk met basisitems en een expert-mediaplan."
