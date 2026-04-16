# Runtime-audit: advanced-code-review
- Datum: 2026-04-16
- Template: review-arena
- Auditor: agent-wave1-reviewdebate
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — 4 rounds (drag-sort, match-pairs, categorize, rapid-fire), alle verplichte velden aanwezig
- [N.V.T.] EERSTE_BERICHT — ReviewArena heeft geen chat; `enableChat` niet gezet in config
- [PASS] STEP_COMPLETE — Template-driven via `advanceRound()`; geen marker-systeem van toepassing
- [WARN] enableChat-consistentie — **Patroon-C bevestigd**: geen `enableChat: true` of `chatRoleId` in config. Geen systemInstruction entry gevonden voor `advanced-code-review`. Zelfde patroon als `security-review`.

## Visueel (code-level)
- [PASS] Responsive — standaard `max-w-md mx-auto` layout
- [PASS] Overflow — strings normaal van lengte; `followUp`-opties wat langer maar binnen card-bounds
- [PASS] Design tokens — badges gebruiken `#F59E0B`, `#10B981`, `#6366F1`, `#8B5CF6`, `#D97757`

## Didactiek
- SLO-audit quote: "Code Review: Geavanceerd — Leerdoel: goed - review van geavanceerde programmeerconcepten past direct bij 22B; voeg expliciet API- en datadenkvragen toe als dat echt tot de leerdoelen hoort. Opbouw: matig - review staat te vroeg in het dashboard."
- UI-koppeling: De drag-sort stap (ML-pipeline volgorde) is didactisch sterk als ordered-sequencing. Twee rondes hebben `followUp` met bonuspunten — dit vergroot diepte. Categorize-ronde (supervised vs unsupervised) met 8 items is inhoudelijk volledig afgedekt.

## Bevindingen (severity)
1. [MINOR] Patroon-C bevestigd — `enableChat` afwezig in config; geen systemInstruction entry voor `advanced-code-review`. Zelfde fix-pad als `security-review`. — fix: `components/missions/templates/review-arena/configs/advanced-code-review.ts`

## Bronnen
- Config: `components/missions/templates/review-arena/configs/advanced-code-review.ts`
- Component: `components/missions/templates/review-arena/ReviewArena.tsx`
