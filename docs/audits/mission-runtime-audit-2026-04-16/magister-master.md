# Runtime-audit: magister-master
- Datum: 2026-04-16
- Template: tool-guide
- Auditor: agent-wave1-toolguide
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — alle verplichte velden aanwezig (`missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures`, `toolName`, `toolIcon`, `steps`, `maxScore`, `badges`, `takeaways`)
- [PASS] Step-checks — 4 stappen; stap 1, 2, 4 hebben `verificationQuestion`; stap 3 heeft geen verificatievraag maar wel 3 checklistItems (acceptabel: stap is praktische actie zonder conceptuele keuze)
- [PASS] Terminal states — `phase: 'results'` bereikbaar via `handleNext()` op laatste stap na alle checks; `CompletionScreen` ontvangt `score` en `maxScore`
- [PASS] Screenshot/assets refs — geen screenshot- of asset-sleutels in config; ToolGuide.tsx bevat geen screenshot-rendering; geen ontbrekende refs

## Visueel (code-level)
- [PASS] Responsive — ToolGuide.tsx gebruikt `max-w-md mx-auto` en `p-4`; StepCard is `w-full max-w-md`; past binnen mobiel viewport
- [PASS] Screenshot-overflow — geen screenshot-weergave in template; niet van toepassing
- [PASS] Design tokens — kleuren via `lab-*` niet aanwezig maar het component gebruikt de hardcoded DGSkills-palette (`#D97757`, `#FAF9F0`, `#1A1A19`, `#10B981`) consistent met de rest van de codebase

## Didactiek
- SLO-audit quote: "Leerdoel: goed - directe match met functioneel gebruik van schoolsystemen; voeg een check toe op zelfstandig navigeren zonder hulp. Bloom: goed - onthouden/toepassen is passend als startmissie; voeg 1 transferopdracht toe voor berichten of cijfers. Differentiatie: matig - iedereen doet hetzelfde; bied een snelklaar-route met extra zoektaak in Magister."
- UI-koppeling: 4 stappen dekken exact de introFeatures (inloggen, rooster, huiswerk, cijfers). Verificatievragen bij stappen 1, 2 en 4 activeren conceptbegrip. Stap 3 (huiswerk) mist verificatievraag — komt overeen met het audit-punt "transferopdracht ontbreekt". Differentiatie is niet geïmplementeerd, maar dat is een didactische wens, geen code-bug.

## Bevindingen (severity)
1. [MINOR] Stap 3 (huiswerk) heeft geen `verificationQuestion` terwijl de SLO-audit expliciet vraagt om een transferopdracht voor berichten/cijfers — overweeg toevoeging — `configs/magister-master.ts:67-78`

## Bronnen
- Config: `components/missions/templates/tool-guide/configs/magister-master.ts`
- Component: `components/missions/templates/tool-guide/ToolGuide.tsx`
