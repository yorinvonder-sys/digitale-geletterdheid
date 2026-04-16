# Runtime-audit: digital-rights-defender
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave0-batchC
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, topic, dilemma, stakeholders (4), positions (4), argumentPrompts, reflectionQuestions, counterArgument, maxScore, badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — intro → explore → position → argue → challenge → reflect → results; alle transities aanwezig in DebateArena.tsx (regels 167-176, 180+)
- [N.V.T.] EERSTE_BERICHT — debate-arena heeft geen enableChat; DebateArena.tsx importeert geen StudentAIChat. System-instructie voor `digital-rights-defender` (systemInstructions.ts:68) bestaat wél maar wordt nooit aangeroepen vanuit dit template. Ongebruikte system-instructie.
- [PASS] STEP_COMPLETE ≥ 3 — N.V.T. voor debate-arena; score berekend via calcScore() op basis van stakeholdersRead, arguments, counterResponse, reflectionAnswers
- [PASS] Verificatievragen — explorationQuiz aanwezig (correctIndex: 1, bonusPoints: 5); 2 reflectionQuestions

## Visueel (code-level)
- [PASS] Responsive — DebateArena.tsx gebruikt `max-w-md mx-auto` + `p-4`; sub-componenten volgen zelfde patroon
- [PASS] Overflow — geen hardcoded pixel-sizes in config; alle content via Tailwind-classes
- [PASS] Design tokens — badges gebruiken hex-kleuren consistent met lab-token-spectrum (#059669, #10B981, #6B6B66)

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Digital Rights Defender | 23A, 23B | Leerdoel: goed - privacy en bewuste keuzes komen direct samen; voeg expliciet rechten als inzage/toestemming/verwijdering toe. [...] Differentiatie: matig - open opdracht helpt, maar steunniveau ontbreekt."
- UI-koppeling: Config bevat nu wél expliciete AVG-rechten (inzage, correctie, verwijdering) in takeaways en stakeholder-perspectieven — audit-aanbeveling is dus verwerkt. Differentiatie-aanbeveling (sjabloon + expertvariant) is niet geïmplementeerd: geen zichtbaar basis/verdiepingsspoor in config of template.

## Bevindingen (severity)
1. [MINOR] Ongebruikte system-instructie — `digital-rights-defender` key bestaat in systemInstructions.ts (regel 68), maar debate-arena-template heeft geen enableChat/chatRoleId; de instructie wordt nooit aangeroepen. Kan worden opgeschoond of template moet alsnog chat activeren — fix: `supabase/functions/_shared/systemInstructions.ts:68` + `components/missions/templates/debate-arena/DebateArena.tsx`
2. [MINOR] Differentiatie ontbreekt — audit-aanbeveling "bied sjabloon met basisafspraken en expertvariant" niet verwerkt in config of template — fix: `components/missions/templates/debate-arena/configs/digital-rights-defender.ts`

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/digital-rights-defender.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
- SLO-audit-row: "Digital Rights Defender | 23A, 23B | Leerdoel: goed [...] Differentiatie: matig" (`docs/audits/didactische-audit-missies-2026-03-07.md:117`)
