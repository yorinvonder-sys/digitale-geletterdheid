# Speelronde J3P1 — 6 missies, 19-20 augustus 2026

We hebben elke missie in de browser getest met vier gesimuleerde profielen: een eerlijke leerling, een sjoemelaar, een struggelaar en een iPad-gebruiker. Daarna is een onafhankelijke tegenlezing (sol) op de code gedaan. Het hoofdbeeld: alle zes missies krijgen het advies “fix-eerst”; vier daarvan hebben risico Rood. De belangrijkste problemen zitten in gedeelde motorlagen, waardoor één reparatie vaak meerdere missies helpt. De tegenlezing kantelt geen enkel missie-oordeel, maar scherpt een paar te stellige conclusies aan.

| Missie | Motor | Advies | Risico | Bevestigd (blocker/major/minor) |
|---|---|---|---|---|
| ml-trainer | data-viewer | fix-eerst | Rood | 1 / 2 / 3 |
| api-architect | builder-canvas | fix-eerst | Geel | 0 / 2 / 2 |
| neural-navigator | data-viewer | fix-eerst | Rood | 1 / 3 / 3 |
| data-pipeline | data-viewer | fix-eerst | Rood | 1 / 4 / 1 |
| open-source-contributor | builder-canvas | fix-eerst | Geel | 0 / 2 / 2 |
| advanced-code-review | review-arena | fix-eerst | Rood | 1 / 3 / 2 |

## Gedeelde motorproblemen (één reparatie helpt veel missies)

- **Dood eindscherm onder de 40%-drempel:** in data-viewer, puzzle-lab en review-arena (en latent in builder-canvas) is de enige knop bij een onvoldoende uitgeschakeld, zonder herkansing of terugweg. Herladen zet de leerling op hetzelfde scherm terug. Live bevestigd in 10+ runs en door sol op de code. Eén reparatie in de motorlaag dekt tientallen missies.
- **Builder-canvas:** de checklist is zelfrapportage en de tekstpoort toetst alleen vorm. Irrelevante zinnen geven 100/100; alleen herhaalde tekens worden geweerd.
- **Data-viewer:** meerkeuze wordt nooit gehusseld — 91% van de juiste antwoorden staat op de middelste twee posities — en de vraagtekst-echo geeft minstens halve punten.
- **Review-arena:** match-pairs legt de rondescore vast bij de eerste foute klik; herladen bankiert 20/25 zonder de ronde af te maken. Rapid-fire scoort na een timeout-sprong een andere stelling dan getoond. De +5-bonus wordt afgekapt op het rondemaximum en is voor foutloze leerlingen loos.

## Correcties uit de tegenlezing

Alle zes missies blijven fix-eerst; geen oordeel kantelt. De claim dat data-viewer geen filter-UI rendert, is weerlegd, maar de iPad-observatie over de filterrij blijft staan. De stelling “vraagtekst-echo geeft hooguit halve punten” is te stellig en wordt onzeker in plaats van weerlegd. Ook “sjoemelaar haalt de 40% niet” bij advanced-code-review is te stellig: in drie runs niet gehaald (19-38%), maar de marge is klein. “Alle tapdoelen ≥44px” is weerlegd voor de categorie-knoppen in de review-arena; de gemeten knoppen blijven schoon. “Toetsenbordgeraas wordt geblokkeerd” is te breed: alleen herhaalpatronen worden geweerd, gevarieerd geraas passeert de vormcheck. De kern daarvan — vorm- en geen inhoudstoets — blijft bevestigd.

## Aanbevolen volgorde van repareren

1. **Repareer eerst het dode eindscherm in de motorlaag.** Dit lost de bevestigde blocker op bij ml-trainer, neural-navigator, data-pipeline en advanced-code-review, en het haalt het latente risico weg bij api-architect en open-source-contributor.
2. **Daarna de inhoudstoets van builder-canvas.** Vervang de vormcheck door een controle die antwoorden tegen de opdracht toetst. Dit is de kern-major bij api-architect en open-source-contributor: beide gaven 100/100 bij irrelevante zinnen.
3. **Dan de missie-eigen verklappers.** Haal de OUTPUT-kolom weg of vraag naar een niet-zichtbare waarde bij neural-navigator, herformuleer de getalvraag bij de staafgrafiek, herzie de trefwoorden bij ml-trainer, hussel meerkeuze en eis een samenhangende zin bij data-pipeline, en koppel rapid-fire en match-pairs bij advanced-code-review aan de zichtbaar getoonde ronde.
