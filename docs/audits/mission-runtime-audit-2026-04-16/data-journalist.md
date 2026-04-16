# Runtime-audit: data-journalist
- Datum: 2026-04-16
- Template: data-viewer
- Auditor: agent-wave0-batchA
- Status: PASS

## Functioneel (code-level)
- [PASS] Config compleet — `DataViewerConfig` aanwezig met alle verplichte velden: `missionId`, `title`, `introEmoji`, `introTitle`, `introDescription`, `introFeatures` (3), `datasets` (3), `maxScore: 100`, `badges` (4), `takeaways` (5).
- [PASS] Phase-transitions bereikbaar — `DataViewer.tsx` heeft `intro → explore (dataset 0..2) → results` flow; elke dataset wordt sequentieel afgehandeld via `currentDataset` state. Alle drie datasets zijn bereikbaar.
- [N.V.T.] EERSTE_BERICHT aanwezig — `enableChat` is niet ingesteld in de config; AI-chat is uitgeschakeld. Niet van toepassing.
- [WARN] STEP_COMPLETE markers — de system instruction voor `"data-journalist"` bevat STEP_COMPLETE-boilerplate maar nul missie-specifieke step-triggers in het mission-scriptdeel. Chat is niet actief, dus geen blocker; maar bij activering van chat ontbreken ze.
- [PASS] Verificatievragen aanwezig — dataset 1: 3 vragen (MC, number-input, text-observation) + followUp; dataset 2: 3 vragen + geen followUp; dataset 3: 2 vragen. Totaal 8 vragen, voldoende verificatie.
- [PASS] Geen dode code-verwijzingen — `InteractiveTable`, `SimpleChart`, `ConfidenceRating`, `FollowUpCard`, `loadMissionConfig` bestaan.
- [WARN] `showConfidence` ontbreekt op dataset 2 vragen — dataset 1 heeft `showConfidence: true` op vragen q1 en q2; dataset 2 vragen q4, q5, q6 hebben dit niet. Inconsistentie maar geen blocker.

## Visueel (code-level)
- [WARN] Tabel met `min-w-[480px]` — `InteractiveTable.tsx:78` gebruikt `<table className="w-full min-w-[480px]">`. Dit is correct gewrapped in `<div className="overflow-x-auto">` (regel 77) zodat horizontaal scrollen werkt op kleine schermen. Geen brekend probleem maar een WARN voor UX op mobiel.
- [PASS] `overflow-hidden` op tabel-container — `InteractiveTable.tsx:60` gebruikt `overflow-hidden` op de border-radius wrapper; de tabel zit binnenin `overflow-x-auto`. Correct patroon.
- [PASS] Design tokens — `#D97757`, `#F59E0B`, `#3B82F6`, `#10B981` consistent met project-kleuren.
- [WARN] Geen responsive breakpoints in `DataViewer.tsx` — geen `sm:`/`md:` klassen in het main component. De layout vertrouwt op `max-w-*` en flexbox maar heeft geen breakpoint-specifieke aanpassingen voor tabel-layout op mobiel.

## Didactiek (SLO-audit vergelijk)
- SLO-audit quote (uit 2026-03-07): "Data Journalist | 21B, 21C | Leerdoel: goed — analyse en infographic sluiten sterk aan op data en informatie; voeg expliciet bronvermelding toe. Bloom: goed — analyseren/creeren. Opbouw: goed — sterke opener van observeren naar duiden; laat de infographic later terugkomen in Dashboard Designer. Activerend: goed — leerling onderzoekt, selecteert en visualiseert; houd de conclusie verplicht. Differentiatie: matig — datasetcomplexiteit niet gespecificeerd; bied een eenvoudige en een rijke dataset."
- UI-koppeling: De config heeft drie datasets in toenemende complexiteit (enkelvoudige tabel → staafgrafiek → document-cards met betrouwbaarheidsoordeel). Dit sluit aan bij de audit-aanbeveling "eenvoudige en rijke dataset". De audit vraagt ook om bronvermelding expliciet toe te voegen — in dataset 3 worden bronnen al beoordeeld (NOS/Volkskrant vs Instagram-blog). De aanbeveling "infographic later terugkomen in Dashboard Designer" is een curriculum-koppeling, buiten scope van de config. Er is geen creatieve productiestap (infographic maken) in de huidige config — de missie stopt bij analyseren/beoordelen.

## Bevindingen (severity)
1. [MINOR] Geen creatieve uitvoerstap — audit vraagt "visualiseert; houd de conclusie verplicht"; de missie eindigt na beoordelen, er is geen verplichte conclusie of visualisatie-opdracht. Fix: voeg aan dataset 3 een `text-observation` vraag toe: "Schrijf in één zin jouw eindconclusie over social media en welzijn". Bestand: `components/missions/templates/data-viewer/configs/data-journalist.ts`.
2. [MINOR] `showConfidence` inconsistent — dataset 2 vragen hebben geen confidence rating terwijl dataset 1 dat wel heeft. Fix: voeg `showConfidence: true` toe aan vragen q4–q6. Bestand: `components/missions/templates/data-viewer/configs/data-journalist.ts`.

## Bronnen
- Config: `components/missions/templates/data-viewer/configs/data-journalist.ts`
- Component: `components/missions/templates/data-viewer/DataViewer.tsx`
- Sub: `components/missions/templates/data-viewer/sub/InteractiveTable.tsx`
- System instruction: `supabase/functions/_shared/systemInstructions.ts` — `"data-journalist"` sleutel (aanwezig, chat niet actief)
- SLO-audit-row: "Data Journalist | 21B, 21C | Leerdoel: goed — analyse en infographic sluiten sterk aan..."
