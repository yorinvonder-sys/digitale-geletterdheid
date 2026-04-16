# Runtime-audit: spreadsheet-specialist
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave0-batchA
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — `DataViewerConfig` aanwezig met alle verplichte velden: `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures` (3), `datasets` (3), `maxScore: 100`, `badges` (4), `takeaways` (5). Default export aanwezig.
- [PASS] Phase-transitions bereikbaar — identiek aan data-viewer template; `intro → explore (dataset 0..2) → results`. Alle drie datasets bereikbaar.
- [N.V.T.] EERSTE_BERICHT aanwezig — `enableChat` niet ingesteld; AI-chat uitgeschakeld. Niet van toepassing.
- [WARN] STEP_COMPLETE markers — system instruction aanwezig met boilerplate, maar nul mission-specifieke triggers. Chat niet actief, geen blocker nu.
- [PASS] Verificatievragen aanwezig — dataset 1: 3 vragen + followUp; dataset 2: 3 vragen (geen followUp); dataset 3: 2 vragen. Totaal 8 vragen.
- [WARN] Dataset 2 staafgrafiek heeft slechts 2 bars — `chartData` bevat alleen `Evenement` (460) en `Materiaal` (53). Vraag q4 biedt als MC-opties `Materiaal`, `Vergadering`, `Evenement`, `Drukwerk` — maar `Vergadering` en `Drukwerk` komen niet voor in de grafiek. Leerling ziet in de grafiek slechts 2 categorieën maar krijgt 4 keuzes aangeboden. Dit is een inhoudelijke inconsistentie.
- [PASS] Geen dode code-verwijzingen.

## Visueel (code-level)
- [WARN] Tabel `min-w-[480px]` — zelfde situatie als data-journalist; correct gewrapped in `overflow-x-auto`. Geen blocker.
- [PASS] Design tokens — `#0891B2`, `#F59E0B`, `#10B981` consistent.
- [WARN] Geen responsive breakpoints in DataViewer.tsx — zelfde bevinding als data-journalist; gedeeld template-issue.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "Spreadsheet Specialist | 21C, 22A | Leerdoel: goed — formules en grafieken passen direct bij dataverwerking en productcreatie; voeg een foutzoekmoment toe voor rekenfouten. Bloom: goed — toepassen/analyseren. Opbouw: goed — concrete vaardigheidsopbouw na Data Journalist; laat de grafiekkeuze verbinden met het communicatiedoel. Activerend: goed — leerling bouwt echt in een spreadsheet; behoud de combinatie van berekenen en interpreteren. Differentiatie: matig — voeg basisformules, keuzeformules en een verdieping met conditionele logica toe."
- UI-koppeling: Dataset 3 (formule-cheatsheet) biedt direct inzicht in SOM, GEMIDDELDE, MAX/MIN en AANTAL — dit sluit aan bij de audit-aanbeveling "basisformules". Conditionele logica (SOMALS, AANTALS) is alleen impliciet aangestipt in de uitleg van q1, niet als aparte verdiepingsvraag. De aanbeveling "foutzoekmoment voor rekenfouten" ontbreekt — er is geen vraag waarbij de leerling een verkeerde berekening moet herkennen en corrigeren. De grafiekkeuze-motivatie (waarom staafdiagram vs lijndiagram) is aanwezig in q6 (text-observation).

## Bevindingen (severity)
1. [MAJOR] MC-opties q4 kloppen niet met de grafiek — `Vergadering` en `Drukwerk` staan als antwoordopties maar zijn niet zichtbaar in de staafgrafiek (alleen `Evenement` en `Materiaal` worden getoond). Dit creëert verwarring bij leerlingen. Fix: voeg `Vergadering` en `Drukwerk` toe aan `chartData` met waarde 0 of kleine waarden, of vervang de niet-bestaande opties door bestaande grafiek-labels. Bestand: `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts:92-103`.
2. [MINOR] Geen foutzoekmoment — audit vraagt expliciet een moment waar leerlingen een rekenfout herkennen. Fix: voeg een vraag toe in dataset 1 waarbij een onjuiste formule-uitkomst wordt getoond en de leerling de fout moet benoemen. Bestand: `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/spreadsheet-specialist.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"spreadsheet-specialist"` sleutel (aanwezig, chat niet actief)
- SLO-audit-row: "Spreadsheet Specialist | 21C, 22A | Leerdoel: goed — formules en grafieken passen direct..."
