# Runtime-audit: reflection-report
- Datum: 2026-04-16
- Template: debate-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig: 4 stakeholders (leerling, HR-manager, informaticadocent, onderwijsfilosoof), 4 positions, 3 argumentPrompts, 2 reflectionQuestions, counterArgument, maxScore: 100, badges (4), takeaways (4)
- [N.V.T.] EERSTE_BERICHT — DebateArena-template heeft geen chat-implementatie
- [PASS] STEP_COMPLETE (Patroon-A) — state-machine; 6 fasen bereikbaar.
- [FAIL] enableChat-consistentie (Patroon-B) — `templateRegistry.ts:91` heeft `enableChat: true, chatRoleId: 'reflection-report'`. `agentRoleIds.ts:97` bevat `'reflection-report'`. DebateArena implementeert geen chat.

## Visueel (code-level)
- [PASS] Responsive — standaard debate-arena layout
- [PASS] Overflow — teksten normaal
- [PASS] Design tokens — badges `#F59E0B`, `#D97706`, `#10B981`, `#6B6B66`

## Didactiek
- SLO-audit quote: "Reflection Report — Leerdoel: goed - reflectie op keuzes en maatschappelijke positionering past goed; voeg een expliciete koppeling toe aan concrete artefacten uit eerdere projecten. Opbouw: goed - leermomenten, sterktes/zwaktes en toekomst vormen een logische reflectielijn. Differentiatie: matig - schrijven kan voor sommigen zwaar zijn; bied reflectievragen voor basis en een vrij essay voor verdieping."
- UI-koppeling: De `dilemma`-formulering ("Moet een informatica-opleiding ook bijdragen aan wie je bent als persoon?") is passend als afsluiter van J3P4. `reflectionQuestions` zijn persoonlijk en terugblikkend — sterke aansluiting op de phase 'reflect'. Het counterargument (concurrentiepositie) is relevant maar kan voor J3-leerlingen een bekende reframing zijn.

## Bevindingen (severity)
1. [MAJOR] Patroon-B: `enableChat: true` in `templateRegistry.ts:91` heeft geen effect. Zelfde structureel probleem als alle andere debate-arena-missies met `enableChat: true`. — fix: `components/missions/templates/debate-arena/DebateArena.tsx`
2. [MINOR] Missie is gelabeld als "J3 P4?" (met vraagteken) in de audittaak. SLO-mapping bevestigt J3P4 (`23B`). Geen config-probleem, alleen documentatie-onzekerheid.

## Patroon-B samenvatting (alle DebateArena-missies met enableChat)
De volgende 6 missies hebben `enableChat: true` in `templateRegistry.ts` maar worden niet bediend door de template:
- `schermtijd-coach` (regel 83)
- `scroll-stopper` (regel 85)
- `ai-ethicus` (regel 86)
- `tech-court` (regel 88)
- `policy-maker` (regel 90)
- `reflection-report` (regel 91)

Root cause: `DebateArena.tsx` ontvangt `TemplateMissionProps` (zonder `enableChat`), en de router geeft het `enableChat` uit de registry niet door. Oplossing vereist één van twee paden:
- (A) `TemplateMissionProps` uitbreiden met `enableChat?` + `chatRoleId?`, router doorgeven, DebateArena implementeren
- (B) `enableChat` verwijderen uit alle debate-arena registry-entries

## Bronnen
- Config: `components/missions/templates/debate-arena/configs/reflection-report.ts`
- Component: `components/missions/templates/debate-arena/DebateArena.tsx`
