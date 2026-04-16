# Runtime-audit: code-review-2
- Datum: 2026-04-16
- Template: review-arena
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId: 'code-review-2', title: 'Code Terugblik', introEmoji, introTitle, introDescription, maxScore: 100, badges (5), takeaways (5), rounds (4) aanwezig.
- [PASS] Phase-transitions — 4 rounds: drag-sort (lagen van webpagina), match-pairs (begrippen), categorize (HTML/CSS/JS), rapid-fire (8 vragen). ReviewArena.tsx doorloopt sequentieel.
- [N.V.T.] EERSTE_BERICHT — `enableChat` en `chatRoleId` NIET in config. systemInstruction voor 'code-review-2' bestaat echter wel in systemInstructions.ts. Inconsistentie (zelfde patroon als data-review).
- [PASS] STEP_COMPLETE ≥ 3 — systemInstruction aanwezig met STEP_COMPLETE-marker (al is chat afwezig); de 4 rounds fungeren als stap-equivalenten in ReviewArena.
- [PASS] Verificatievragen aanwezig — round `round-categorize` heeft `followUp` (correctIndex: 2, bonusPoints: 5); round `round-rapid-fire` heeft `followUp` (correctIndex: 1, bonusPoints: 5) + 8 where/false vragen.

## Visueel (code-level)
- [PASS] Responsive — zelfde ReviewArena.tsx als data-review; responsive-structuur is gedeeld.
- [PASS] Overflow — geen overflow-risico zichtbaar in config; items en pairs zijn beperkt in aantal.
- [PASS] Design tokens — badge-kleuren (`#F59E0B`, `#10B981`, `#6366F1`, `#8B5CF6`, `#D97757`) consistent met projectpalet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Code Terugblik | 22A, 22B | Leerdoel: goed - de review vat programmeerconcepten helder samen; voeg expliciete dekking van ontwerp en debuggen toe. Bloom: goed - analyseren/evalueren is passend voor een review in leerjaar 2. Opbouw: matig - review staat te vroeg in de dashboardvolgorde; gebruik hem als eindtoets of instapscan met minder gewicht. Activerend: matig - beantwoording alleen is beperkt; voeg een mini-debugtaak toe die echt opgelost moet worden. Differentiatie: matig - weinig adaptiviteit zichtbaar; bied verplichte basisvragen en optionele expertproblemen."
- UI-koppeling: Config dekt algoritmes, webdev (HTML/CSS/JS categorize), UX en automatisering in takeaways. Ontwerp en debuggen zijn aanwezig in takeaways maar NIET als aparte round — audit-aanbeveling voor expliciete dekking van debuggen niet geïmplementeerd. Rapid-fire dekt computational thinking gedeeltelijk. Geen mini-debugtaak (activerend-kritiek valid).
- SLO-mapping (`config/slo-kerndoelen-mapping.ts` regel 118): `['22A', '22B']` — passend.

## Bevindingen (severity)
1. [MINOR] `enableChat` ontbreekt in config maar systemInstruction bestaat voor 'code-review-2' — zelfde inconsistentie als data-review. Maak de keuze expliciet. — fix: `components/missions/templates/review-arena/configs/code-review-2.ts` of verwijder de systemInstruction-entry.
2. [MINOR] Geen debuggen-round — takeaways noemen debuggen maar er is geen interactieve debugtaak. Audit-aanbeveling "voeg een mini-debugtaak toe" niet geïmplementeerd.
3. [MINOR] Geen differentiatie: alle rounds zijn uniformly moeilijk; basis/expert-splitsing ontbreekt.

## Bronnen
- Config: `components/missions/templates/review-arena/configs/code-review-2.ts`
- Component: `components/missions/templates/review-arena/ReviewArena.tsx`
- SLO-audit-row: "Code Terugblik | 22A, 22B | Leerdoel: goed - de review vat programmeerconcepten helder samen; [...] Activerend: matig - beantwoording alleen is beperkt; voeg een mini-debugtaak toe die echt opgelost moet worden."
