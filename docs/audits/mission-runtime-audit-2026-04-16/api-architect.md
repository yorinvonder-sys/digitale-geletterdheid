# Runtime-audit: api-architect
- Datum: 2026-04-16
- Template: builder-canvas
- Auditor: agent-wave0-batchC
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — missionId, title, enableChat: true, chatRoleId: 'api-architect', previewType: 'text-preview', 4 steps met checklistItems + textPrompt, maxScore, badges, takeaways aanwezig
- [PASS] Phase-transitions bereikbaar — builder-canvas doorloopt intro → step 0-3 → results; elke stap heeft checklistItems die isStepComplete() sturen (BuilderCanvas.tsx:80+)
- [WARN] EERSTE_BERICHT — system-instructie voor 'api-architect' aanwezig (systemInstructions.ts:74) maar bevat geen EERSTE_BERICHT opener. De AI-chat start zonder een welkomstbericht dat de context zet. BuilderCanvas activeert chat via StudentAIChat maar stuurt geen initieel bericht.
- [WARN] STEP_COMPLETE ≥ 3 — system-instructie gebruikt `---STEP_COMPLETE:X---` (X = 1, 2 of 3), maar de missie heeft 4 stappen. De system-instructie is niet bijgewerkt na toevoeging van stap 4 (documentatie). AI kan stap 4 nooit via marker voltooien.
- [PASS] Verificatievragen — geen expliciete verificatievragen in config (previewType: text-preview); checklistItems per stap fungeren als functionele verificatie

## Visueel (code-level)
- [PASS] Responsive — BuilderCanvas gebruikt MobileTabBar-sub-component; `max-w-md` layout; geen hardcoded px-sizes in config
- [PASS] Overflow — textPrompt-inputs zijn textarea-gebaseerd; geen overflow-risico zichtbaar
- [PASS] Design tokens — badges consistent met lab-token-spectrum (#F59E0B, #10B981, #D97757, #8B5CF6, #6B6B66)

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote: "API Architect | 22B, 21C | Leerdoel: goed [...] Opbouw: goed - resources, endpoints en documentatie bouwen logisch op; laat de leerling eerst een use case schetsen. Differentiatie: matig - geen zichtbare moeilijkheidsniveaus; bied een basisdomein en een complexer domein met authenticatie."
- UI-koppeling: Opbouw volgt audit-advies (step 1: REST-principes → step 2: endpoints → step 3: authenticatie → step 4: documentatie). Use-case-schets ontbreekt als expliciete stap. Authenticatie-stap (stap 3) biedt enige complexiteitslaag maar differentiatie ontbreekt.

## Bevindingen (severity)
1. [MAJOR] STEP_COMPLETE marker verkeerd geconfigureerd — system-instructie (systemInstructions.ts:74) instrueert AI om `---STEP_COMPLETE:X---` met X=1,2,3 te sturen, maar missie heeft 4 stappen. Stap 4 (documentatie) kan nooit via AI-marker als voltooid worden gemarkeerd — fix: `supabase/functions/_shared/systemInstructions.ts` (regel 74, update STAP VOLTOOIING sectie naar X=1,2,3,4)
2. [MINOR] Geen EERSTE_BERICHT — chat opent zonder context-zettend welkomstbericht; leerling weet niet hoe AI te gebruiken bij opstart — fix: voeg EERSTE_BERICHT toe aan system-instructie 'api-architect'

## Bronnen
- Config: `components/missions/templates/builder-canvas/configs/api-architect.ts`
- Component: `components/missions/templates/builder-canvas/BuilderCanvas.tsx`
- SLO-audit-row: "API Architect | 22B, 21C | Leerdoel: goed [...] Differentiatie: matig" (`docs/audits/didactische-audit-missies-2026-03-07.md:129`)
