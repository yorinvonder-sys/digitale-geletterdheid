# Review: network-navigator (2026-08-07)

## Gratis punten
- `text-observation` vragen: q3-router-observatie (10), q6-latency-verklaring (10), q8-foutcode-uitleg (10) = **30 van 100 punten (30%)** krijgen altijd volle score bij ≥10 tekens (engine-gedrag, vaststaand). Config zelf telt correct op tot maxScore=100 (15+15+10+10+15+10+15+10), maar een derde van de opdracht is inhoudelijk niet geborgd.

## Datakwaliteit
- `netwerk-stappen` rij 4+6 (network-navigator.ts:44,46): totale round-trip naar een Amerikaans datacenter van 61ms (1+3+8+22+5+20+2) is voor een transatlantische verbinding onrealistisch laag — reële RTT NL↔VS ligt door lichtsnelheid+glasvezelpad doorgaans rond 80-100ms+. Geeft leerlingen een vertekend beeld van latency-orde-grootte, terwijl de vraag (q1) juist daarover gaat.
- IP-voorbeeld "31.13.92.36" (network-navigator.ts:72, in explanation) valt binnen een bestaand Meta/Instagram-blok (31.13.64.0/18) — feitelijk plausibel, geen fout.
- Overige termen (DNS, HTTP-codes 200/403/404/500, CDN) kloppen inhoudelijk.

## Beantwoordbaarheid uit data
- q1, q2, q4, q5, q7 zijn direct uit de tabel/grafiek/cards af te leiden.
- q6-latency-verklaring (network-navigator.ts:125-133) vraagt te concluderen dat Amazon een Amerikaans bedrijf is — die informatie staat nergens in de dataset zelf (grafiek toont alleen ping-waarden, geen land/locatie-kolom zoals dataset 1 wel heeft). Leerling moet extern weten dat Amazon.com in de VS staat; risico op giswerk i.p.v. datagedreven redenering.

## Grafiekkeuze
- `website-reactietijden` (network-navigator.ts:94-102): bar-chart is een correcte keuze voor categorische ping-vergelijking, maar gebruikt **6 categorieën** (Google.nl, Wikipedia, Instagram, YouTube, TikTok, Amazon.com) — boven de drempel van 4 waarbij het kapotte kleurenpalet (vaststaand, SimpleChart.tsx) zichtbaar wordt: geel onzichtbaar op wit, 5 van 10 kleuren identiek zwart. Met 6 staven is een deel van de balken dus niet van elkaar te onderscheiden.
- Tabel (dataset 1) en document-cards (dataset 3) zijn passende typen voor hun content.

## Leerdoel 21A
- SLO-mapping (slo-kerndoelen-mapping.ts:119) koppelt de missie aan 21A ("netwerken begrijpen, geen programmeren"). De opdracht blijft grotendeels bij het aflezen van tabellen/grafieken en het herkennen van HTTP-codes — passend bij het beschrijvende niveau van 21A, geen overclaim. Wel: zonder de kapotte scoredrempel (engine, vaststaand) is er geen garantie dat het doel ("Ik leg uit hoe een bericht door het internet reist") ooit getoetst wordt — een leerling kan alles overslaan via lege observatievragen.

## Taalniveau / opbouw / tijd
- Taalniveau past bij 13-14 jaar; korte zinnen, concrete voorbeelden (Instagram, TikTok).
- Opbouw binnen elk dataset is grofweg makkelijk → moeilijker → open vraag; q5 (network-navigator.ts:114-123) vraagt een deling met afronding op 1 decimaal (45÷8=5,625→5,6) — voor deze leeftijd een pittige exacte-match-opgave zonder marge zichtbaar in de config.
- Drie datasets × 3 vragen is qua omvang haalbaar binnen een lesuur, mits het sorteren en de tabel goed werken (bekende engine-tekortkoming, niet hier).

## Conclusie
30% gratis punten + kapot scoregedrag (engine) + een grafiek die het defecte kleurenpalet raakt + een conclusievraag die buiten de data valt, verklaren samen de lage eerdere scores (2/10, 3/10). Config-inhoud zelf (teksten, feitelijke uitleg, SLO-passendheid) is grotendeels in orde; het probleem zit in de combinatie met de motor en één te-veel-categorieën grafiek.
