# Runtime-audit: digitale-balans-coach
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig: 4 stakeholders, 4 positions, 3 argumentPrompts, 3 reflectionQuestions (afwijkend: meer dan standaard 2), 1 counterArgument, 5 takeaways
- [N.V.T.] EERSTE_BERICHT — DebateArena-template heeft geen chat-implementatie
- [PASS] STEP_COMPLETE (Patroon-A) — state-machine, geen markers. Alle 6 fasen bereikbaar.
- [PASS] enableChat-consistentie — `templateRegistry.ts:84` heeft `{ missionId: 'digitale-balans-coach', templateType: 'debate-arena' }` — **geen `enableChat`**. Consistent: geen chat in registry, geen chat in template.

## Visueel (code-level)
- [PASS] Responsive — standaard debate-arena layout
- [PASS] Overflow — teksten zijn uitgebreider dan andere debate-configs maar binnen normale grenzen
- [PASS] Design tokens — badges `#6366F1`, `#D97757`, `#10B981`, `#6B6B66`

## Didactiek
- SLO-audit quote: Geen aparte entry in didactische audit 2026-03-07. SLO-mapping: `23B` (digitaal welzijn), `23A` (privacy-bewustzijn). Periode J1P3.
- UI-koppeling: Config heeft 3 `argumentPrompts` (afwijkend van standaard 2), gericht op persoonlijke reflectie in plaats van argumentatie-structuur ("Welk perspectief spreekt jou het meest aan..."). Dit past bij de bewuste coachende toon maar kan de argue-fase minder debatachtig maken. `reflectionQuestions` (3) is meer dan standaard 2 — geen runtime-probleem maar iets rijker dan de gem. debate-config.

## Bevindingen (severity)
1. [MINOR] `argumentPrompts` zijn reflectief geformuleerd ("Welk perspectief spreekt jou het meest aan?") in plaats van argumentatief ("Ik vind dat..."). Dit past bij de coachende naam maar wijkt af van het debate-arena patroon. Geen blocker, maar didactisch inconsistent met de argue-fase instructie. — fix: `components/missions/templates/debate-arena/configs/digitale-balans-coach.ts` (optioneel)
2. [MINOR] Missie zit niet in `agentRoleIds.ts` — geen chatRoleId in registry óf agentRoles. Consistent met geen chat, maar bevestigt dat missie als "niet voor chat" is bedoeld.

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/digitale-balans-coach.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
