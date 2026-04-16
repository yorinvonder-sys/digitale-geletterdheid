# Runtime-audit: policy-maker
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig: 4 stakeholders, 4 positions, 3 argumentPrompts, 2 reflectionQuestions, counterArgument, maxScore: 100, badges (4), takeaways (4)
- [N.V.T.] EERSTE_BERICHT — DebateArena-template heeft geen chat-implementatie
- [PASS] STEP_COMPLETE (Patroon-A) — state-machine; 6 fasen bereikbaar.
- [FAIL] enableChat-consistentie (Patroon-B) — `templateRegistry.ts:90` heeft `enableChat: true, chatRoleId: 'policy-maker'`. `agentRoleIds.ts:88` bevat `'policy-maker'`. DebateArena implementeert geen chat.

## Visueel (code-level)
- [PASS] Responsive — standaard debate-arena layout
- [PASS] Overflow — teksten normaal
- [PASS] Design tokens — badges `#7C3AED`, `#8B5CF6`, `#10B981`, `#6B6B66`

## Didactiek
- SLO-audit quote: "Policy Maker — Leerdoel: goed - stakeholders, beleid en impact passen sterk; voeg expliciet een criterium toe voor uitvoerbaarheid. Opbouw: goed - bouwt logisch op van dilemma naar voorstel en impactanalyse. Differentiatie: matig - abstractieniveau kan hoog zijn; bied een beleidssjabloon voor basis en een vrije variant voor verdieping."
- UI-koppeling: Stakeholder-set bevat een wethouder die EU AI Act-compliance benoemt — hoge relevantie voor J3P3. `argumentPrompts` zijn beleidsmatig geformuleerd ("Mijn beleidsadvies is...") — goed afgestemd. Onderzoeker-stakeholder (effectiviteitsbewijs ontbreekt) biedt een goede basis voor kritisch argument in challenge-fase.

## Bevindingen (severity)
1. [MAJOR] Patroon-B: `enableChat: true` in `templateRegistry.ts:90` heeft geen effect. — fix: `components/missions/templates/debate-arena/DebateArena.tsx`

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/policy-maker.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
