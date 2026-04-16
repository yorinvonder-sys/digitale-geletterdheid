# Runtime-audit: review-week-2
- Datum: 2026-04-16
- Template: review-arena (NIET debate-arena — zie opmerking)
- Auditor: agent-wave0-batchA
- Status: WARN

## Opmerking over template-type
De opdracht beschrijft `review-week-2` als `debate-arena`. Dit klopt **niet**: `config/templateRegistry.ts:36` registreert de missie als `templateType: 'review-arena'`. De config-file staat in `components/missions/templates/review-arena/configs/review-week-2.ts`. Deze audit is gebaseerd op de werkelijke registratie.

## Functioneel (code-level)
- [PASS] Config compleet — `ReviewArenaConfig` aanwezig met `missionId`, `title`, `rounds`, `maxScore`, `badges`, `takeaways`. Alle vereiste velden aanwezig.
- [PASS] Phase-transitions bereikbaar — `ReviewArena.tsx` heeft `intro → round[0..n] → results` flow; elke ronde heeft een submit-trigger. Vier ronden aanwezig (drag-sort, match-pairs, categorize, rapid-fire).
- [WARN] enableChat niet ingesteld in config — de config heeft geen `enableChat: true`; de system instruction in `systemInstructions.ts` voor `"review-week-2"` bestaat wél (met introductie-script en STEP_COMPLETE-protocol). De chat is dus beschikbaar via het AI-systeem maar de config activeert hem niet. Als `ReviewArena.tsx` `enableChat` vereist voor het tonen van de chat-UI, dan is de AI-instructie dead code.
- [WARN] STEP_COMPLETE markers — de system instruction bevat het STEP_COMPLETE boilerplate (`:X` als generieke aanduiding), maar nul missie-specifieke `STEP_COMPLETE:1/2/3`-triggers in het eigenlijke mission-script (vóór het boilerplate-blok). De AI weet niet wanneer een specifieke case is afgerond.
- [PASS] Verificatievragen — het rapid-fire round heeft 8 waar/onwaar-vragen; categorize-round heeft een followUp vraag. Voldoende verificatie-logica aanwezig.
- [PASS] Geen dode code-verwijzingen — alle geïmporteerde subcomponenten (`DragSort`, `MatchPairs`, `Categorize`, `RapidFire`) bestaan in `review-arena/sub/`.

## Visueel (code-level)
- [WARN] Responsive breakpoints — `ReviewArena.tsx` zelf heeft geen `sm:`/`md:` klassen; de subcomponenten hebben beperkte responsive styling. `RapidFire.tsx:276` gebruikt `min-h-[100px]` (niet een brekend pixel-size maar een minimum-hoogte, acceptabel).
- [PASS] Geen brekende overflow-hidden — `DragSort.tsx:47` gebruikt `overflow-hidden pointer-events-none` op een drag-overlay, functioneel correct. `MatchPairs.tsx:172` gebruikt overflow-hidden op een progress bar — geen content-risico.
- [PASS] Design tokens — kleuren `#F59E0B`, `#10B981`, `#6366F1` consistent met project; `lab-*` tokens niet direct maar hex-waarden zijn de directe equivalent.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "De Code-Criticus | 21B, 21D | Leerdoel: goed — beoordelen van AI-output past bij media/AI; voeg expliciete criteria toe voor hallucinatie, bias en bruikbaarheid. Bloom: goed — analyseren/evalueren. Opbouw: matig — dashboardvolgorde zet deze review voor de instructiemissies; gebruik hem als afsluiter of startscan. Activerend: matig — nu vooral herkennen/benoemen; laat leerlingen de output ook verbeteren of herschrijven. Differentiatie: matig — moeilijkheid niet zichtbaar opgebroken."
- UI-koppeling: De config heeft vier ronden die oplopen in abstractieniveau (volgorde sorteren → koppelen → categoriseren → waar/onwaar). Dit is een impliciete moeilijkheidsopbouw, maar er is geen zichtbaar basis/verdieping-spoor zoals de audit vraagt. De aanbeveling "laat leerlingen output verbeteren/herschrijven" is niet geïmplementeerd — de missie blijft bij herkennen/benoemen. De aanbeveling over dashboardvolgorde (review voor instructie) is een cursusniveau-issue, niet oplosbaar in de config.

## Bevindingen (severity)
1. [MINOR] System instruction aanwezig maar chat niet geactiveerd via config — `enableChat` ontbreekt in `review-week-2.ts`; de AI-instructie in `systemInstructions.ts` is niet bereikbaar via de normale ReviewArena-flow tenzij ReviewArena `enableChat` controleert. Fix: voeg `enableChat: true, chatRoleId: 'review-week-2'` toe aan de config, of verwijder de chat-instructie als die niet bedoeld is. Bestand: `components/missions/templates/review-arena/configs/review-week-2.ts`.
2. [MINOR] STEP_COMPLETE markers ontbreken in mission-script — de system instruction stuurt nooit een step-trigger in het eigenlijke scriptdeel. Fix: voeg in de system instruction na elke case-afsluiting `---STEP_COMPLETE:X---` toe. Bestand: `supabase/functions/_shared/systemInstructions.ts` (review-week-2 sectie).
3. [MINOR] Geen herstel/verbeterstap na beoordeling — audit vraagt "laat leerlingen output ook verbeteren"; geen enkele ronde heeft een verwerkingsstap na feedback. Fix: voeg aan de categorize- of rapid-fire-ronde een korte open tekstvraag toe (analoog aan `text-observation` in data-viewer). Bestand: `components/missions/templates/review-arena/configs/review-week-2.ts`.

## Bronnen
- Config: `components/missions/templates/review-arena/configs/review-week-2.ts`
- Component: `components/missions/templates/review-arena/ReviewArena.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"review-week-2"` sleutel
- SLO-audit-row: "De Code-Criticus | 21B, 21D | Leerdoel: goed — beoordelen van AI-output..."
