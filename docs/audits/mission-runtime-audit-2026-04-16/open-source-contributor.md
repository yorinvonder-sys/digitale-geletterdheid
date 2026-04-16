# Runtime-audit: open-source-contributor
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave0-batchC
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, enableChat: true, chatRoleId: 'open-source-contributor', previewType: 'text-preview', 4 steps met checklistItems + textPrompt, maxScore, badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — builder-canvas standaard: intro → 4 stappen → results
- [WARN] EERSTE_BERICHT — system-instructie voor 'open-source-contributor' aanwezig (systemInstructions.ts:77) maar bevat geen EERSTE_BERICHT opener. Chat start zonder welkomstbericht.
- [WARN] STEP_COMPLETE ≥ 3 — zelfde issue als api-architect: system-instructie instrueert `---STEP_COMPLETE:X---` met X=1,2,3 maar missie heeft 4 stappen. Stap 4 (pull request) kan nooit via AI-marker worden afgesloten.
- [PASS] Verificatievragen — checklistItems per stap (4+4+4+4 = 16 totaal); functioneren als verificatie

## Visueel (code-level)
- [PASS] Responsive — identiek builder-canvas patroon; MobileTabBar aanwezig
- [PASS] Overflow — geen hardcoded pixels
- [WARN] Design tokens — badge-kleur `#D97757` (Pull Request Beginner) is een niet-standaard waarde; andere badges (#F59E0B, #10B981, #8B5CF6, #6B6B66) zijn consistent met lab-tokens. Hetzelfde patroon als api-architect — mogelijk bewuste keuze maar niet in lab-token-definitie gedocumenteerd.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "Open Source Contributor | 22A, 22B, 23B | Leerdoel: matig - 22A/22B passen, maar 23B is zwak zichtbaar; maak samenwerking/online communitygedrag expliciet of haal 23B weg. [...] Differentiatie: matig - instapdrempel is hoog; bied vooraf geselecteerde issues op verschillende moeilijkheidsniveaus."
- UI-koppeling: Vier stappen zijn inhoudelijk sterk en authentiek (git-workflow, issue-analyse, bugfix, PR). SLO 23B (samenwerking/communitygedrag) is niet zichtbaar in de stap-instructies; de missie simuleert een solo-workflow, niet een community-interactie. Audit-aanbeveling voor issues op verschillende moeilijkheidsniveaus is niet verwerkt.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE marker verkeerd geconfigureerd — system-instructie (systemInstructions.ts:77) instrueert X=1,2,3 maar missie heeft 4 stappen; stap 4 (pull-request) is nooit AI-voltooibaar — fix: `supabase/functions/_shared/systemInstructions.ts` (regel 77, update naar X=1,2,3,4)
2. [MINOR] SLO 23B niet aantoonbaar — audit-bevinding bevestigd: communitygedrag/samenwerking ontbreekt in de stap-instructies; de SLO-koppeling in `config/slo-kerndoelen-mapping.ts` claimen 23B maar de UI levert geen bewijs — fix: voeg in stap 4 een community-element toe (bijv. reviewer-feedback simulatie) of verwijder 23B uit de SLO-mapping
3. [MINOR] Geen EERSTE_BERICHT — fix: voeg EERSTE_BERICHT toe aan system-instructie 'open-source-contributor'

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/open-source-contributor.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SLO-audit-row: "Open Source Contributor | 22A, 22B, 23B | Leerdoel: matig [...] Differentiatie: matig" (`docs/audits/didactische-audit-missies-2026-03-07.md:132`)
