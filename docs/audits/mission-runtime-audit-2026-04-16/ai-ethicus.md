# Runtime-audit: ai-ethicus
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig: 4 stakeholders, 4 positions, 3 argumentPrompts, 2 reflectionQuestions, counterArgument, maxScore: 100, badges (4), takeaways (4)
- [N.V.T.] EERSTE_BERICHT — DebateArena-template heeft geen chat-implementatie
- [PASS] STEP_COMPLETE (Patroon-A) — state-machine; 6 fasen bereikbaar. Geen marker-systeem van toepassing.
- [FAIL] enableChat-consistentie (Patroon-B) — `templateRegistry.ts:86` heeft `enableChat: true, chatRoleId: 'ai-ethicus'`. `agentRoleIds.ts:69` bevat `'ai-ethicus'`. DebateArena-template rendert geen `StudentAIChat`. Chat is geconfigureerd maar werkt niet.

## Visueel (code-level)
- [PASS] Responsive — standaard debate-arena layout
- [PASS] Overflow — stakeholder-perspectieven zijn uitgebreid (Dr. Chen heeft 3-bias-types beschrijving) maar in scroll-containers
- [PASS] Design tokens — badges `#7C3AED`, `#8B6F9E`, `#10B981`, `#6B6B66`

## Didactiek
- SLO-audit quote: "AI Ethicus — Leerdoel: goed - bias, werking en advies passen sterk bij AI en maatschappij; voeg een criterium toe voor bewijs uit casus of bron. Opbouw: goed - sluit logisch aan op AI Bias Detective en verdiept de ethische laag. Differentiatie: matig - morele complexiteit is niet opgebouwd; bied een eenvoudige en een complexe AI-case."
- UI-koppeling: Het `counterArgument` ("menselijke leraren hebben ook vooroordelen — maar die zijn onzichtbaar") is didactisch sterk als challenge. `takeaways` bevatten expliciete EU AI Act-verwijzing — relevant voor J2P4 context. `reflectionQuestions` raken de kern van het debat (algoritmische consistentie ≠ ethische eerlijkheid).

## Bevindingen (severity)
1. [MAJOR] Patroon-B: `enableChat: true` in `templateRegistry.ts:86` + `agentRoleIds.ts:69` heeft geen effect. DebateArena-template implementeert chat niet. — fix: `components/missions/templates/debate-arena/DebateArena.tsx`

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/ai-ethicus.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
