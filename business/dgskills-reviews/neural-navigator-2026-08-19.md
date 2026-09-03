## Opdracht Live Check: neural-navigator — J3P1 (motor data-viewer)

**Advies:** fix-eerst
**Risico:** Rood
**Getest als:** gesimuleerde leerlingen (serieuze baseline · sjoemelaar · worstelaar · iPad via Playwright) op de dev-previewroute, zonder login
**Datum:** 2026-08-19

### In één alinea
De missie laat leerlingen een forward pass door een neuraal netwerk uitrekenen aan de hand van twee datasets. Een zorgvuldige leerling haalt de volle punten, maar een sjoemelaar komt zonder één berekening op 85% omdat de antwoorden al op het scherm staan. Een worstelaar komt door de missie heen, maar zit na een onvoldoende permanent vast op een dood eindscherm zonder herkansing. De kern van de missie meet daardoor leesvaardigheid in plaats van het beloofde rekenwerk. Het oordeel is fix-eerst: de missie is speelbaar, maar de belangrijkste leerdoelen zijn te omzeilen en het zak-scenario is onafrondbaar.

### Scores per profiel
| Profiel | Resultaat |
|---|---|
| Serieuze baseline | 95/100 (95%) eerlijk; gokproef 0/100 (0%) |
| Sjoemelaar | 85/100 (85%, badge 'Neural Netwerk Expert!') puur door aflezen zonder één berekening; blind gokken 0/100 (0%) |
| Worstelaar | 100/100 (100%) na zorgvuldig lezen; gokproef 0/100 (0%) |
| iPad (Playwright) | 100/100 (100%) via Playwright op 820x1180, geen layoutproblemen op 820x1180, 1180x820 en 390x844 |

### Bevindingen
1. **BLOCKER** · motor · bevestigd — Een leerling die onder de 40% eindigt komt permanent vast te zitten: het eindscherm heeft één knop, die is uitgeschakeld, en herladen brengt opnieuw op datzelfde dode scherm. _Bewijs: 3 runs: [data-qa=confirm-completion] disabled:true; reload zonder reset gaf opnieuw 0/100; DataViewer.tsx:984-995 (geen onRetry) vs CompletionScreen.tsx:163-166_
2. **MAJOR** · missie · bevestigd — Het leerdoel 'reken zelf een forward pass' is omzeilbaar: de antwoorden op beide rekenvragen staan al kant-en-klaar op het scherm (0.48 en 1.01 in de OUTPUT-kolom, 0.87 als staaflabel). _Bewijs: configs/neural-navigator.ts:36 (output 0.48) vs :46 (correctAnswer 0.48); :86 (label 0.87) vs :98 (correctAnswer 0.87)_
3. **MAJOR** · motor · bevestigd — De vraagtekst letterlijk terugplakken in een open vraag levert 3/3 keer exact +5 van 10 punten op, zonder dat de leerling iets over de data zegt. _Bewijs: run-creatieve-cheater.json F3 (stappen 4, 7, 10); mechanisme in DataViewer.tsx:284-290_
4. **MAJOR** · motor · weerlegd — De motorbevinding dat vraagtekst-echo VOLLE punten geeft, geldt hier niet: alle drie de observatievragen hebben keywords, waardoor de echo maximaal de helft oplevert. _Bewijs: configs/neural-navigator.ts:66, :124, :184 tonen keywords; run-creatieve-cheater.json F3 mat 3/3 keer halve punten_
5. **MAJOR** · motor · bevestigd — Meerkeuze wordt nooit gehusseld en beide vragen zetten het juiste antwoord in de middelste twee posities; de strategie 'nooit de buitenste twee' levert hier 20 van de 100 punten op. _Bewijs: configs/neural-navigator.ts:55-56 (positie 3/4) en :107-114 (positie 2/4); DataViewer.tsx:400 (geen shuffle)_
6. **MINOR** · missie · bevestigd — De beoordeling van de laatste open vraag is onvoorspelbaar: 'spraakherkenning' kreeg 5 van 10, 'spraakassistent' kreeg 10 van 10, beide inhoudelijk correct. _Bewijs: run-digisterke-dani.json stap 12 (+5) vs run-onzekere-noor.json stap 9 (+10); configs/neural-navigator.ts:184 keywords zonder spraak/stem_
7. **MINOR** · motor · bevestigd — De vaste hint 'Sorteer of filter om antwoorden te vinden' klopt niet: er is geen filterveld en maar één sorteerbare kolom; de hint stuurt de leerling naar aflezen. _Bewijs: DataViewer.tsx:704 (vaste hinttekst); configs/neural-navigator.ts:26-32 (alleen 'output' sortable:true)_
8. **MINOR** · motor · onbevestigd — Raakt een observatie de welzijnsmonitor, dan doet 'Bevestigen' bij een missie zonder chat stil niets; niet in een speelsessie geraakt. _Bewijs: DataViewer.tsx:905-914; configs/neural-navigator.ts bevat geen enableChat_
9. **MINOR** · motor · onbevestigd — Zonder Supabase-sessie valt de autosave-sleutel terug op een sleutel zonder userId, waardoor twee uitgelogde leerlingen elkaars voortgang kunnen zien; niet getest. _Bewijs: src/hooks/useMissionAutoSave.ts:213-216_
10. **MINOR** · motor · bevestigd — De knop 'Vorige dataset' meet 106x44px en zit precies op de ondergrens voor tikdoelen, zonder marge; alle andere knoppen zitten er ruim boven. _Bewijs: run-ipad-iris.json personaNotes (Playwright-meting op 820x1180)_
11. **MINOR** · motor · weerlegd — Dat de eindknop 'Missie voltooid! 🎉' niets doet is een bekend preview-artefact, geen productfout; bij een geslaagde afronding werkt het opruimen wél. _Bewijs: run-digisterke-dani.json F5 (reload toonde de INTRO); DevMissionPreview.tsx:96-97_
12. **MINOR** · missie · weerlegd — De zorg dat een rij filtervelden op smalle schermen omslaat bestaat niet: DataViewer rendert helemaal geen filter-UI, alleen de hinttekst die filteren noemt. _Bewijs: DataViewer.tsx: 'filter' alleen in hinttekst (:704); configs/neural-navigator.ts:26-32 definieert zeven kolommen_

### Wat goed werkte
- Blind gokken levert nul op: eerste MC-optie, foute getallen en herhaalde-tekentekst gaven in drie runs bij álle vragen 0 punten, met een eindscore van precies 0/100.
- Tussentijds herladen (autosave/resume) is betrouwbaar: drie runs herstelden exact dezelfde score, dataset-positie en eerder gegeven feedback — geen puntenverdubbeling, geen terugval.
- Geen state-corruptie door misbruik: dubbelklikken op 'Bevestigen' gaf 20 in plaats van 40 punten, en heen-en-weer navigeren liet de score onveranderd.
- &reset=1 start altijd schoon vanaf de intro, ook na een voltooide of gezakte run.
- Technisch schoon in alle vier de runs: 0 console-fouten, alle requests 200/304, geen calls naar dummy.supabase.co — de missie is volledig client-side.
- Feedbackkwaliteit past bij de doelgroep: per vraag directe uitslag met uitleg en formule, een woordenteller onder de open vragen, en een geruststellende intro-toon.
- Responsief in orde: Playwright mat op drie formaten geen horizontale scroll of afgekapte content; alle tikdoelen halen 44px; de staafwaarden staan als vast label (geen hover-only informatie).

### Reparatiekandidaten (niet uitgevoerd — ter beslissing)
| # | Wat | Waar | Omvang | Waarom |
|---|---|---|---|---|
| 1 | Geef het eindscherm van data-viewer een werkende uitweg bij zakken (onRetry meegeven en de opgeslagen resultatenfase wissen) | motor | klein | Enige blocker in deze review; het patroon bestaat al elders, dus het gat is een omissie. Zonder deze reparatie is de missie voor elke leerling onder de 40% onafrondbaar. |
| 2 | Haal de OUTPUT-kolom uit de tabel van dataset 1, of vraag naar een neuron/waarde die niet in de tabel staat | config | klein | Zolang het antwoord op de rekenvraag naast de vraag staat, meet de missie leesvaardigheid in plaats van het beloofde 'reken zelf een forward pass'. |
| 3 | Herformuleer de getalvraag bij de staafgrafiek zodat het antwoord niet één-op-één een zichtbaar label is (bijvoorbeeld het verschil voor/na) | config | klein | De waardelabels moeten zichtbaar blijven voor touch-toegankelijkheid, dus de vraag moet meebewegen in plaats van het label. |
| 4 | Verdeel de juiste meerkeuze-antwoorden over alle vier de posities, of hussel de opties bij het renderen | motor | middel | Beide vragen staan in de middelste twee posities; over vijftien missies is dat 91%, waardoor 'nooit de buitenste twee' een sterke gokstrategie is. |
| 5 | Breid de keywordlijst van de laatste open vraag uit met het spraak-/stemdomein (spraak, stem, assistent, vertaalt) | config | klein | Een inhoudelijk correct antwoord ('spraakherkenning') scoorde de helft terwijl een vrijwel identiek antwoord ('spraakassistent') vol scoorde. |
| 6 | Maak de vaste datahint per dataset instelbaar in plaats van altijd 'Sorteer of filter om antwoorden te vinden' | motor | klein | Deze missie heeft geen filters en één sorteerbare kolom; de hint is feitelijk onjuist en stuurt de leerling naar aflezen. |
| 7 | Maak zichtbaar waarom 'Bevestigen' niets doet wanneer de welzijnsmonitor aanslaat bij een missie zonder chat | motor | klein | Onbevestigd in deze speelruns, maar het codepad geldt ook voor deze config; een stille knop is voor een leerling niet te onderscheiden van een kapotte knop. |

### Nog onzeker
- De zeven kolommen brede tabel van dataset 1 is niet op telefoonformaat (390x844) bekeken; de Playwright-run mat daar alleen dataset 3 en het eindscherm.
- Het zak-scenario is niet via Playwright of op iPad getest; het is wel drie keer onafhankelijk in het browserpaneel bevestigd met directe DOM-controle.
- Waarom 'spraakherkenning' de helft kreeg en 'spraakassistent' de volle punten is niet met een gerichte herproef vastgesteld; de keywordlijst verklaart het waarschijnlijk, maar dat is afgeleid uit de code.
- De welzijnsblokkade (B8) en de gedeelde autosave-sleutel bij uitgelogde leerlingen (B9) komen uitsluitend uit de motoranalyse en zijn in geen enkele speelsessie geraakt.
- De baseline-run mat op mobiel wisselende innerWidth-waarden (519-533 terwijl outerWidth 390 bleef); dat oogt als een meetartefact en wordt tegengesproken door de Playwright-meting, maar is niet met zekerheid verklaard.
- Geen enkele run zag een laadscherm; loadWaitSec staat overal op 0, mogelijk omdat de missie al warm gecached was.
