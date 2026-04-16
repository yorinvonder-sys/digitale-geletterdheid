# Runtime-audit: api-verkenner
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave0-batchA
- Status: WARN

## Functioneel (code-level)
- [PASS] Config compleet — `DataViewerConfig` aanwezig met alle verplichte velden: `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures` (3), `datasets` (3), `maxScore: 100`, `badges` (4), `takeaways` (5). Default export aanwezig.
- [PASS] Phase-transitions bereikbaar — data-viewer template; `intro → explore (dataset 0..2) → results`. Alle drie datasets bereikbaar.
- [N.V.T.] EERSTE_BERICHT aanwezig — `enableChat` niet ingesteld; AI-chat uitgeschakeld.
- [WARN] STEP_COMPLETE markers — system instruction aanwezig met boilerplate, maar nul missie-specifieke triggers. Chat niet actief, geen blocker nu.
- [PASS] Verificatievragen aanwezig — dataset 1: 3 vragen (number-input, MC, text-observation); dataset 2: 3 vragen (MC, number-input, text-observation); dataset 3: 2 vragen (MC, text-observation). Totaal 8 vragen.
- [WARN] `showConfidence` ontbreekt volledig — geen enkele vraag in api-verkenner heeft `showConfidence: true`, terwijl dit in data-journalist en spreadsheet-specialist wél aanwezig is op sommige vragen. Inconsistentie binnen het data-viewer template-ecosysteem.
- [WARN] SLO-koppeling 21D aanvechtbaar — config en registry gebruiken `21C, 21D`; de didactische audit-row meldt "21D is hier niet zichtbaar — koppel 21D alleen als er ook een AI-API of modelreflectie in komt." De huidige config heeft geen AI-component; alle datasets gaan over REST API's (geen ML, geen AI-model). SLO 21D is in de config-beschrijving dan ook niet hard aantoonbaar.
- [PASS] Geen dode code-verwijzingen.

## Visueel (code-level)
- [WARN] Tabel `min-w-[480px]` — zelfde situatie als data-journalist; correct gewrapped in `overflow-x-auto`. UX-WARN op mobiel.
- [WARN] `showConfidence` ontbreekt — geen confidence UI-element zichtbaar voor leerlingen in deze missie; inconsistent met de andere data-viewer missies.
- [PASS] Design tokens — `#7C3AED`, `#3B82F6`, `#10B981` consistent.
- [WARN] Geen responsive breakpoints in DataViewer.tsx — gedeeld template-issue, zelfde als data-journalist en spreadsheet-specialist.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "API Verkenner | 21C, 21D | Leerdoel: matig — de missie gaat duidelijk over data-uitwisseling, maar AI is hier niet zichtbaar; koppel 21D alleen als er ook een AI-API of modelreflectie in komt. Bloom: goed — begrijpen/toepassen/analyseren. Opbouw: goed — volgt logisch na datasets en bereidt dashboards voor; laat de leerling een vraag formuleren die met API-data wordt beantwoord. Activerend: goed — data lezen en interpreteren is actief; voeg een stap toe waarin de leerling zelf velden selecteert. Differentiatie: matig — JSON kan snel te lastig worden; bied een uitgeklede response voor basis en een complexere voor verdieping."
- UI-koppeling: Dataset 1 (JSON tabel) is eenvoudig gehouden (10 rijen, duidelijke keys/values) — dit sluit deels aan bij "uitgeklede response voor basis". Er is geen complexere variant voor verdieping. De aanbeveling "laat de leerling een vraag formuleren die met API-data wordt beantwoord" ontbreekt — er is geen open opdracht die de leerling laat nadenken over een onderzoeksvraag. Vraag q8 (URL bouwen voor charizard) is een goede transfer-taak maar vraagt geen eigen onderzoeksvraag. De 21D-SLO-koppeling is ook in de config niet opgelost.

## Bevindingen (severity)
1. [MAJOR] SLO 21D onjuist gekoppeld — `config/slo-kerndoelen-mapping.ts` koppelt 21D aan api-verkenner, maar de config bevat geen AI-component. De didactische audit markeert dit expliciet als "matig". Fix: verwijder 21D uit de SLO-koppeling in `config/slo-kerndoelen-mapping.ts` óf voeg een dataset toe over een AI-API (bijv. OpenAI/Gemini API response-analyse). Bestand: `config/slo-kerndoelen-mapping.ts`.
2. [MINOR] `showConfidence` ontbreekt — inconsistent met andere data-viewer missies. Fix: voeg `showConfidence: true` toe aan vragen q1, q4, q5. Bestand: `components/missions/templates/data-viewer/configs/api-verkenner.ts`.
3. [MINOR] Geen open onderzoeksvraag als afsluiting — audit vraagt "laat de leerling een vraag formuleren die met API-data wordt beantwoord". Fix: voeg als laatste vraag in dataset 3 een `text-observation` toe: "Bedenk één vraag die jij zou willen beantwoorden met een echte API. Welke API zou je gebruiken en welke parameter heb je nodig?" Bestand: `components/missions/templates/data-viewer/configs/api-verkenner.ts`.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/api-verkenner.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- SLO-mapping: `config/slo-kerndoelen-mapping.ts`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"api-verkenner"` sleutel (aanwezig, chat niet actief)
- SLO-audit-row: "API Verkenner | 21C, 21D | Leerdoel: matig — de missie gaat duidelijk over data-uitwisseling, maar AI is hier niet zichtbaar..."
