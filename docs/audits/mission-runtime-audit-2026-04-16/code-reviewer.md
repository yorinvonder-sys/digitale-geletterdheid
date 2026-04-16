# Runtime-audit: code-reviewer
- Datum: 2026-04-16
- Template: simulation-lab
- Auditor: agent-wave0-batchB
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, introEmoji, introTitle, introDescription, introFeatures, computeVisuals (pure TypeScript switch/case), simulations (3), maxScore: 100, badges (5), takeaways aanwezig. `SimulationLabConfig` type volledig geïmplementeerd.
- [PASS] Phase-transitions — SimulationLab.tsx doorloopt `intro → sim[0] → sim[1] → sim[2] → results`; elke simulatie heeft parameters, questions en visualType.
- [N.V.T.] EERSTE_BERICHT — `SimulationLabConfig` heeft geen `enableChat`-veld; geen chat in dit template. systemInstruction voor 'code-reviewer' bestaat wel. Inconsistentie: systemInstruction aanwezig maar geen chat-UI.
- [WARN] STEP_COMPLETE ≥ 3 — systemInstruction bevat STEP_COMPLETE-marker instructie voor "stapnummer 1, 2, of 3". SimulationLab heeft echter geen chat — de marker is nooit bereikbaar. Instructie is dode code.
- [PASS] Verificatievragen aanwezig — elke simulatie heeft 3 multiple-choice vragen (cl1-q1/q2/q3, dry1-q1/q2/q3, fb1-q1/q2/q3) met correctAnswer, explanation en points.

## Visueel (code-level)
- [PASS] Responsive — SimulationLab.tsx laadt sub-componenten (SimulationVisual, ParameterControl, QuestionCard); template gebruikt flex-layout zonder hardcoded px-widths op rootniveau.
- [PASS] Overflow — geen overflow-risico op config-niveau zichtbaar; simulaties zijn compact in parameters.
- [PASS] Design tokens — badge-kleuren (`#10B981`, `#059669`, `#6B6B66`, `#8B5CF6`) en bar-chart kleuren (`#D97757`, `#B05A3C`, `#C46849`, `#10B981`, `#E8E6DF`) consistent met projectpalet.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Code Reviewer | 22B, 23B | Leerdoel: matig - code review past sterk bij 22B, maar 23B is hier zwak zichtbaar; koppel digitaal welzijn alleen als samenwerking/feedback expliciet leerdoel is. Bloom: goed - analyseren/evalueren/creeren past goed voor leerjaar 2. Opbouw: goed - afsluitende metacognitieve missie na bouwen en debuggen; laat hem volgen op een echte peer-codebase. Activerend: goed - lezen, feedback geven en verbeteren is sterk actief; houd de implementatiestap verplicht. Differentiatie: matig - geen niveauvariatie in codecomplexiteit; bied korte en complexe reviewcases."
- UI-koppeling: Simulatie 3 (feedback-methode) dekt 23B gedeeltelijk via sandwich-methode als samenwerking/communicatievaardigheid. Echter: geen echte peer-codebase als input (audit-aanbeveling "laat hem volgen op een echte peer-codebase" niet geïmplementeerd). Differentiatie: alle 3 simulaties hebben dezelfde vraagmoeilijkheid — geen basis/verdieping-splitsing.
- SLO-mapping (`config/slo-kerndoelen-mapping.ts` regel 113): `['22A', '22B']` — de mapping vermeld 22A, maar de config beschrijft primair 22B/review-content. 22A (digitaal product maken) is niet zichtbaar in de simulaties.

## Bevindingen (severity)
1. [MINOR] systemInstruction bestaat voor 'code-reviewer' inclusief STEP_COMPLETE-marker, maar SimulationLab heeft geen chatinterface — instructie is volledig onbereikbaar. — fix: verwijder de systemInstruction-entry voor 'code-reviewer' of verander het template naar simulation-lab + chat variant.
2. [MINOR] SLO-mapping registreert 22A maar config heeft geen digitaal-product-stap. — fix: `config/slo-kerndoelen-mapping.ts` regel 113: verwijder 22A of voeg een maak-stap toe.
3. [MINOR] Geen niveaudifferentiatie in simulatieparameters — alle leerlingen krijgen dezelfde moeilijkheidsgraad. Audit-aanbeveling "bied korte en complexe reviewcases" niet geïmplementeerd.

## Bronnen
- Config: `components/missions/templates/simulation-lab/configs/code-reviewer.ts`
- Component: `components/missions/templates/simulation-lab/SimulationLab.tsx`
- SLO-audit-row: "Code Reviewer | 22B, 23B | Leerdoel: matig - code review past sterk bij 22B, maar 23B is hier zwak zichtbaar; [...] Differentiatie: matig - geen niveauvariatie in codecomplexiteit; bied korte en complexe reviewcases."
