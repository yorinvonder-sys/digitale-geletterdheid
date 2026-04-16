# Runtime-audit: data-voor-data
- Datum: 2026-04-16
- Template: legacy-standalone
- Auditor: agent-wave2-legacy
- Status: WARN

## Functioneel (code-level)
- [PASS] Component bestaat + geroute — `components/missions/DataVoorDataMission.tsx` → `AuthenticatedApp.tsx:727`
- [PASS] State-machine compleet — 4 phases: `intro → auction → reflection → results`; alle transitions aanwezig (L145: `setPhase('reflection')` of `setPhase('results')` na laatste ronde); `results` bevat completion-knop
- [N.V.T.] EERSTE_BERICHT — geen AI-chat
- [PASS] Completion-flow (XP award) — `clearSave(); onComplete(true)` op L385 (results-phase); `AuthenticatedApp.tsx:731`: `if (success) handleMissionComplete('data-voor-data')`
- [WARN] Geen dode refs — importeert `getDataVoorDataRoundStats` en `saveDataVoorDataAnswers` via `@/services/dataVoorDataService`. Service exists. Echter: service gebruikt `(supabase as any).rpc('submit_data_for_data_answers', ...)` en `(supabase as any).rpc('get_data_for_data_round_stats')` — `as any` cast om TypeScript-type te omzeilen. Als de RPC-functies niet bestaan in Supabase zal dit runtime silently falen.

## Visueel (code-level)
- [PASS] Responsive — standaard Tailwind; geen hardcoded pixel-widths
- [PASS] Hardcoded widths — geen `w-[...px]` gevonden
- [PASS] Overflow — geen overflow-issues
- [WARN] Design tokens — hardcoded hex; geen `lab-*` tokens

## Didactiek
- SLO-audit quote: "Data voor Data | 23C, 23B — Leerdoel: goed - afwegen van gemak versus privacy past goed bij welzijn en maatschappij; voeg expliciet een koppeling toe aan verdienmodellen van apps. Bloom: goed - evalueren is passend als afronding van de periode. Activerend: goed - keuzespel en vergelijking met klasgenoten werken activerend."
- UI-koppeling: Veiling-mechanic (deal/no-deal per dataronde) implementeert het "keuzespel" uit de audit. `roundStats` toont klasgenoten-vergelijking via RPC — als de RPC werkt is dit precies de "vergelijking met klasgenoten" die de audit noemt. `reflection`-fase dwingt nadenken af vóór resultaten. Verdienmodellen van apps ontbreken als expliciete context.

## Bevindingen (severity)
1. [MAJOR] `dataVoorDataService.ts` gebruikt `(supabase as any).rpc(...)` voor twee RPC-calls. Als Supabase-functies `submit_data_for_data_answers` en `get_data_for_data_round_stats` niet bestaan, faalt de service runtime zonder foutmelding zichtbaar voor leerling (fout wordt gecatcht maar `roundStats` blijft leeg). — fix: verificeer dat de RPCs bestaan via Supabase dashboard; verwijder `as any` cast en gebruik gegenereerde typen

## Bronnen
- Component: `components/missions/DataVoorDataMission.tsx`
- Service: `services/dataVoorDataService.ts`
- Routing: `AuthenticatedApp.tsx:727`
