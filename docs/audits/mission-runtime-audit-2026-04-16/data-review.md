# Runtime-audit: data-review
- Datum: 2026-04-16
- Template: review-arena
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, maxScore, badges, takeaways, rounds allemaal aanwezig.
- [PASS] Phase-transitions — 4 rounds aanwezig (drag-sort, match-pairs, categorize, rapid-fire); ReviewArena.tsx doorloopt rounds sequentieel via index-state.
- [N.V.T.] EERSTE_BERICHT — enableChat staat NIET in config (geen chatRoleId in data-review config); chat is afwezig maar systeminstructie bestaat wel als "data-review" entry in systemInstructions.ts. Niet geblokkeerd, maar inconsistentie.
- [PASS] STEP_COMPLETE >= 3 — systemInstructie bevat STEP_COMPLETE-patroon; template gebruikt ronde-index als stap-equivalent.
- [PASS] Verificatievragen aanwezig — round-drag-sort heeft followUp met correctIndex+explanation+bonusPoints; round-rapid-fire heeft 8 vragen met answer+explanation; round-categorize heeft showConfidence.

## Visueel (code-level)
- [PASS] Responsive — ReviewArena.tsx gebruikt flex flex-col, w-full, sub-componenten via gedeelde structuur.
- [PASS] Overflow — geen hardcoded pixel-widths in config of template root; overflow-y-auto aanwezig in ReviewArena.
- [PASS] Design tokens — badge-kleuren (#F59E0B, #10B981, #6366F1, #8B5CF6, #D97757) consistent met projectpalet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Data Review | 21B, 21C, 21D | Leerdoel: goed - de review dekt de periodebreedte; voeg per domein 1 expliciet succescriterium toe. Bloom: goed - begrijpen/toepassen/analyseren is passend voor een afsluitende check. Opbouw: matig - review staat in de dashboardvolgorde voor de inhoudsmissies; verplaats hem naar het einde of maak hem lichter als instapscan. Activerend: matig - vraag-antwoord alleen is beperkt; voeg een mini-case of dataprobleem toe dat echt opgelost moet worden. Differentiatie: matig - moeilijkheid is niet zichtbaar afgestemd; werk met basisvragen en een expertcase."
- UI-koppeling: Config heeft 4 rounds met wisselende formats — dit dekt de "activerend: matig"-kritiek gedeeltelijk. Echter: geen basis/expert-splitsing zichtbaar in config; differentiatie-aanbeveling niet geïmplementeerd. Round-volgorde: review staat per het dashboard voor inhoudsmissies (opbouw-kritiek van audit geldig).

## Bevindingen (severity)
1. [MINOR] enableChat ontbreekt in config maar systemInstruction bestaat — inconsistentie. Als chat bewust uitgeschakeld is: verwijder de systemInstruction-entry of documenteer de keuze. — fix: components/missions/templates/review-arena/configs/data-review.ts + supabase/functions/_shared/systemInstructions.ts (entry "data-review")
2. [MINOR] Geen basis/expert-differentiatie in rounds — audit-aanbeveling niet geïmplementeerd. — fix: config kan optionele difficulty-tag per item krijgen.
3. [MINOR] Opbouw-volgorde in dashboard: review staat te vroeg. Vereist dashboardvolgorde-aanpassing.

## Bronnen
- Config: components/missions/templates/review-arena/configs/data-review.ts
- Component: components/missions/templates/review-arena/ReviewArena.tsx
- SLO-audit-row: "Data Review | 21B, 21C, 21D | Leerdoel: goed - de review dekt de periodebreedte; [...] Differentiatie: matig - moeilijkheid is niet zichtbaar afgestemd; werk met basisvragen en een expertcase."
