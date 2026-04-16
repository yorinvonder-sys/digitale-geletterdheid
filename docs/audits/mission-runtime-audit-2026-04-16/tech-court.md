# Runtime-audit: tech-court
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig: 4 stakeholders, 4 positions, 3 argumentPrompts, 2 reflectionQuestions, counterArgument, maxScore: 100, badges (4), takeaways (4)
- [N.V.T.] EERSTE_BERICHT — DebateArena-template heeft geen chat-implementatie
- [PASS] STEP_COMPLETE (Patroon-A) — state-machine; 6 fasen bereikbaar.
- [FAIL] enableChat-consistentie (Patroon-B) — `templateRegistry.ts:88` heeft `enableChat: true, chatRoleId: 'tech-court'`. `agentRoleIds.ts:71` bevat `'tech-court'`. DebateArena-template implementeert geen chat. Zelfde patroon als overige debate-missies.

## Visueel (code-level)
- [PASS] Responsive — standaard debate-arena layout
- [PASS] Overflow — teksten normaal; position-descriptions zijn compact
- [WARN] Design tokens — badges `#DC2626` en `#B91C1C` (rode tinten) zijn niet in de standaard lab-kleurpalette. Geen runtime-blocker maar afwijkend van de rest.

## Didactiek
- SLO-audit quote: "Tech Court — Leerdoel: goed - afwegen van techdilemma's past sterk bij welzijn en maatschappij. Opbouw: goed - debatvorm is een logische verdieping na individuele ethiekmissies; laat argumenten vooraf structureren in claim-bewijs-redenering. Differentiatie: goed - rolkeuze biedt natuurlijke niveauruimte."
- UI-koppeling: De rechtbank-setting (aanklager, advocaat, rechter, expert) geeft 4 duidelijk onderscheiden rollen — sterk voor de position-fase. `argumentPrompts` zijn gericht op rechtbankstijl ("Mijn sterkste argument is...", "Het bewijs daarvoor is...") — goed afgestemd op de context. `counterArgument` bevat een innovatieverslammings-argument — realistisch en uitdagend.

## Bevindingen (severity)
1. [MAJOR] Patroon-B: `enableChat: true` in `templateRegistry.ts:88` + `agentRoleIds.ts:71` heeft geen effect. — fix: `components/missions/templates/debate-arena/DebateArena.tsx`
2. [MINOR] Badge-kleuren `#DC2626` / `#B91C1C` (rechtbank-rood) zijn buiten de lab-tokenset. Visueel inconsistent maar geen blocker. — fix: `components/missions/templates/debate-arena/configs/tech-court.ts`

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/tech-court.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
