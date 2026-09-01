# Kwaliteitspoorten

Dit bestand is voor de eigenaar en beschrijft drie poorten die na de vier
veto's uit de opdrachtstandaard komen. De eigenaar mag deze tekst zelf
aanpassen. De beoordeling gebeurt altijd na het werkelijk spelen van de
opdracht. Eerst worden alle vier veto's ingevuld; alleen bij vier keer
GESLAAGD worden de drie poorten beoordeeld. Eén GEZAKT maakt de opdracht
afgekeurd. Zonder een GEZAKT maakt één NIET VASTGESTELD de uitkomst niet
vastgesteld. Alleen als alles is vastgesteld en geslaagd gaat de beoordeling
door naar de rubric.

## Bewijscontract voor de vier veto's

Een oordeel steunt op wat de speler werkelijk doet en ziet. Een beschrijving
vooraf, een instellingenlijst of een knop die iets zou kunnen opslaan is geen
bewijs.

- **Veto 1 — Artefact:** de speler maakt iets, ververst de pagina volledig en
  vindt het gemaakte werk terug, of een docent- of klasgenootweergave toont het
  werk. Lukt dat in de oefenomgeving niet, dan is de uitkomst NIET VASTGESTELD
  met als benodigd bewijs: een proefronde met een testaccount buiten de echte
  leerlingomgeving, na toestemming van de eigenaar.
- **Veto 2 — Handelingen:** de speler levert een tijdlijn van wat er per minuut
  werkelijk is gedaan. De tijdlijn komt uit de tijdregistratie tijdens het
  spelen. Elke begonnen minuut telt als hele minuut. Minuten waarin de speler
  alleen leest of klikt vormen samen meer dan de helft van de speeltijd? Dan is
  Veto 2 GEZAKT. Zonder zo'n registratie is
  het veto NIET VASTGESTELD.
- **Veto 3 — Onderscheid:** de speler doorloopt een tweede opdracht op dezelfde
  motor en de reviewer vergelijkt de handelingen in dezelfde volgorde. Zonder
  twee volledige speelrondes is het veto NIET VASTGESTELD. Maatwerk zonder
  gedeelde motor: Veto 3 = GESLAAGD met de notitie 'eigen motor', tenzij de
  reviewer een andere maatwerkopdracht aanwijst die bij het spelen dezelfde
  handelingen geeft. Deze regel geldt voorlopig, tot de eigenaar hem bevestigt
  of schrapt (zie Beslislog).
- **Veto 4 — Belofte:** vóór de eerste handeling schrijft de speler de titel,
  openingszin en de zin "ik verwacht dat ik ga [werkwoord]" op, met het
  tijdstip. Achteraf invullen telt niet als voorafgaande belofte.

Bij elk NIET VASTGESTELD noteert het rapport de reden en welk bewijs nog nodig
is. Gebruik deze uitkomsttekst letterlijk:

```text
UITKOMST:  DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

## Poort 1 — Visueel + Beweging

### Regel

De opdracht heeft een herkenbare DGSkills-vorm en reageert zichtbaar op wat de
leerling doet. De DGSkills-huisstijl (de eend-stijl uit `design.md`) voert de boventoon. Titels, kaarten, knoppen en
teksten zijn rustig uitgelijnd, goed leesbaar en groot genoeg om aan te raken.
Beweging is betekenisvol: na een zichtbare leerlingactie verandert het element
dat bij die actie hoort. Ook kleurwissel of verschijnen en verdwijnen telt als
beweging. Zwevende versiering zonder aanleiding telt niet.

### Afgekeurd zodra

- De hoofdinteractie bestaat uit afvinkkaders, tekstvakken en een volgende-knop
  (een formulier in een jasje), ook als de opdracht een groot project is.
  Omvang is geen excuus: een project verdient een dragende vorm (jury,
  werkbank, studio, kaart) waarin het werk van de leerling zichtbaar groeit;
  een afvinklijstje mag hooguit een klein hulpmiddel zijn.
- De oude laboratoriumstijl overheerst de huisstijl in de werkelijk getoonde
  opdracht.
- Na een zichtbare leerlingactie verandert geen enkel zichtbaar onderdeel,
  terwijl de gewone bewegingsstand aan staat.
- De stand voor minder beweging verbergt of vertraagt de inhoud.
- Een knop of ander aanraakdoel is te klein, tekst valt weg of onderdelen
  overlappen of vallen buiten beeld.
- De reviewer kan niet in één zin uitleggen wat er door de handeling van de
  leerling beweegt of zichtbaar verandert.

### Goed voorbeeld

Word Simulator en Kamer Codekluis laten een zichtbaar gevolg op de handeling
van de leerling zien. Datalekken-rampenplan is een inhoudelijk voorbeeld van
een opdracht die groter is dan één formulier.

### Slecht voorbeeld

Een stil kaartje met vier knoppen en één openingsscherm zonder overgang. Losse
versiering die niet door de leerling wordt veroorzaakt telt evenmin.

### Bewijs dat de reviewer moet leveren

Leg één leerlingactie vast met een beeld vóór de actie en drie opeenvolgende
beeldjes erna. Noteer het element dat je volgde, de zichtbare verandering en
de gemeten uiterlijke kenmerken: kleur, positie, grootte en doorzichtigheid. Voeg de beelden van de actie en het gevolg
toe. Herhaal de controle in de stand voor minder beweging en voeg het beeld
van die run toe. Drie gelijke beeldjes zijn NIET VASTGESTELD; alleen aantoonbaar
stilvallen met de gewone bewegingsstand is GEZAKT. Hoe de reviewer dit precies meet, staat in de skill `opdracht-review` (Meetrecept).

**Geannoteerde gevallen**

- Positief — Word Simulator: GESLAAGD, omdat een leerlingactie een zichtbaar
  gevolgd element laat veranderen in drie opeenvolgende beeldjes.
- Negatief — IntroScreen: uitkomst NIET VASTGESTELD totdat de reviewer de
  actiegebonden verandering werkelijk heeft gemeten.
- Grensgeval — Datalekken-rampenplan: NIET VASTGESTELD zolang een actiegebonden
  meting ontbreekt; een stil beeld kan niet bewijzen dat beweging ontbreekt.

## Poort 2 — Instructie

### Regel

De speler doorloopt in de opdracht zelf minstens drie opeenvolgende
intro-stappen of scènes. Elke stap heeft een eigen beeld en een zichtbare
overgang en blijft begrijpelijk in de stand voor minder beweging. Daarna kan de
speler, uitsluitend op basis van de tekst op het scherm, drie zinnen geven:
wat maak je, voor wie, en hoe weet je dat het goed is. De tekst is begrijpelijk
voor het afgesproken niveau (maximaal B1).

### Afgekeurd zodra

- Er is maar één stil openingsscherm of er zijn minder dan drie opeenvolgende
  stappen.
- Een stap heeft geen eigen beeld, overgang of begrijpelijke tekst.
- Eén van de drie zinnen ontbreekt of kan niet uit de zichtbare tekst worden
  uitgelegd.
- De zichtbare tekst is moeilijker dan B1.

### Goed voorbeeld

Een meerstaps introductie waarin de speler drie duidelijke scènes achter elkaar
ziet en daarna alle drie de antwoorden uit het scherm kan halen.

### Slecht voorbeeld

Een titel, alinea en knop op één stil scherm waarbij de reviewer buiten de
opdracht moet raden wat het doel of de doelgroep is.

### Bewijs dat de reviewer moet leveren

Leg elke introductiestap vast met een beeld en de volledige tekst die op dat
moment zichtbaar is. Noteer daarna de drie zinnen van de speler en de
beoordeling van het taalniveau. Hoe de reviewer dit precies meet, staat in de skill `opdracht-review` (Meetrecept).

**Geannoteerde gevallen**

- Positief — een meerstaps introductie: GESLAAGD, omdat de speler drie zichtbare
  stappen doorloopt en alle antwoorden uit het scherm kan citeren.
- Negatief — IntroScreen: GEZAKT, omdat één stil scherm geen drie opeenvolgende
  introductiestappen geeft.
- Grensgeval — filmische introductie: NIET VASTGESTELD zolang de spelerstekst
  niet per stap is vastgelegd.

## Poort 3 — Doelen

### Regel

Voor elk genoemd kerndoel en elk platformdoel laat de reviewer zien waar de
leerling dit tijdens het spelen doet en waar het resultaat in het gemaakte werk
zichtbaar is. De doelen passen bij de onderwijsbelofte en de leerling maakt
zelf het kernwerk; slimme hulp mag coachen, niet overnemen. Het SLO-overzicht en
de opdrachtlijst mogen alleen worden gelezen om vast te stellen welke doelen
de opdracht claimt (de aanklacht), nooit als bewijs dat het doel ook werkelijk
wordt geoefend. Projectgereedheid blijft een losse observatie: groeit het werk
over lessen, kan een tweede leerling bijdragen en is het groter dan één scherm?

### Afgekeurd zodra

- Een genoemd kerndoel of platformdoel geen zichtbare handeling én geen plek in
  het gemaakte werk heeft.
- Een doel alleen op papier staat en niet in het gespeelde werk terugkomt.
- De platformbelofte wordt tegengesproken of slimme hulp schrijft het kernwerk.
- Projectgereedheid wordt behandeld als extra veto, poort of score.

### Goed voorbeeld

Bij Datalekken-rampenplan koppelt de reviewer elk doel aan een handeling die hij
zag en aan een herkenbare plek in het gemaakte plan. De drie observaties over
projectgereedheid staan apart, zonder eigen status of score.

### Slecht voorbeeld

Een doelcode op papier zonder zichtbaar resultaat, of slimme hulp die het
antwoord schrijft en alleen om akkoord vraagt.

### Bewijs dat de reviewer moet leveren

Maak per kerndoel en platformdoel een korte tabel met: het doel, de handeling die
je zag, het beeldnummer van de plek in het gemaakte werk en één zin uitleg.
Schrijf de drie observaties over projectgereedheid apart. Hoe de reviewer dit precies meet, staat in de skill `opdracht-review` (Meetrecept).

**Geannoteerde gevallen**

- Positief — Datalekken-rampenplan: GESLAAGD, omdat elk genoemd doel aan een
  echte handeling en een zichtbare plek in het werk is gekoppeld.
- Negatief — dashboard-designer: GEZAKT, omdat kerndoel 22A is genoemd maar er
  niets wordt ontworpen.
- Grensgeval — podcast-producer: NIET VASTGESTELD zolang de reviewer geen
  handeling en plek in het gemaakte werk heeft vastgelegd.

## Uitkomstvolgorde

Beoordeel eerst alle vier veto's. Daarna geldt: minstens één GEZAKT betekent
AFGEKEURD; anders betekent minstens één NIET VASTGESTELD
NIET VASTGESTELD — NIET NAAR LEERLINGEN; anders worden de drie poorten
beoordeeld. Beoordeel ook de drie poorten volledig. Daarna geldt opnieuw:
minstens één GEZAKT betekent AFGEKEURD; anders minstens één NIET VASTGESTELD
betekent NIET VASTGESTELD — NIET NAAR LEERLINGEN; anders DOOR NAAR RUBRIC.

## Het afkeurformulier

```text
Poort 1 Visueel + Beweging  GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 2 Instructie          GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
Poort 3 Doelen              GESLAAGD / GEZAKT / NIET VASTGESTELD
  Bewijs: ............................................................
```

## Regressieset

| opdracht | Verwachte uitkomst | Verwachte veto/poort | Exacte afkeurreden |
|---|---|---|---|
| `podcast-producer` | `AFGEKEURD` | Veto 1 + 2 + 3 + 4 | Er blijft geen aantoonbaar werk over; de speler leest en typt vooral, doet dezelfde handelingen als andere formulieropdrachten en de titel belooft maken/opnemen. |
| `app-prototyper` | `AFGEKEURD` | Veto 1 + 2 + 3 + 4 | Er blijft geen klikbaar prototype over; de speler leest en typt vooral, doet dezelfde handelingen als andere formulieropdrachten en de titel belooft bouwen. |
| `dashboard-designer` | `AFGEKEURD` | Veto 3 + Veto 4 | De speler voert dezelfde handelingen uit als data-journalist en ontwerpt niets; de titel belooft ontwerpen. |
| `datalekken-rampenplan` | `AFGEKEURD` | Veto 1 (gemeten 2 sep 2026); daarnaast zou Poort 2 zakken | De crisisbrief bestaat uit voorgeschreven alinea's die je aanvinkt; de leerling schrijft nergens zelf. Veto 3 slaagt via de maatwerkregel. De introductie is één stil scherm. |

Deze set is een speelbare terugvalcontrole. Wijkt een review af van deze tabel
zonder dat de tabel is aangepast, dan is de REVIEW verdacht, niet de tabel: de
reviewer noteert welk nieuw speelbewijs het verschil verklaart en legt de
afwijking aan de eigenaar voor.

## Woordenlijst

- **Platformdoel:** wat DGSkills als geheel belooft (zie het merkdocument):
  leerlingen maken zelf iets echts, AI helpt maar neemt niet over.
- **Kernwerk:** het deel van de opdracht dat de leerling zelf moet bedenken of
  maken; niet de uitleg eromheen.
- **Slimme hulp:** de AI-coach in de opdracht.
- **Projectgereedheid:** drie losse waarnemingen, geen oordeel: groeit het werk
  over meerdere lessen, kan een tweede leerling meedoen, is het groter dan één
  scherm.
- **Stand voor minder beweging:** de instelling waarmee een leerling animaties
  uitzet; de inhoud moet dan meteen zichtbaar zijn.
- **Motor:** het gedeelde stuk software waarop meerdere opdrachten draaien;
  maatwerk heeft een eigen motor.

## Beslislog

| Datum | Wat de eigenaar besliste | Gevolg |
|---|---|---|
| 2026-09-01 | Instructie = geanimeerde intro in de app, geen video; review speelt altijd eerst. | Poort 2 vereist zichtbare, opeenvolgende in-app stappen; video is geen vervanging. |
| 2026-09-01 | Ook grote/projectmatige opdrachten geen suffe UI met afvinkkaders; creatiever en aantrekkelijker | Poort 1: formulier-hoofdinteractie = GEZAKT |
| 2026-09-01 | Voorstel (nog door de eigenaar te bevestigen): maatwerk zonder gedeelde motor slaagt op Veto 3 met notitie 'eigen motor' | Veto 3 |
| 2026-09-02 | Uitleg van de meetregel: instellingen mogen alleen worden gelezen om te weten wat een opdracht CLAIMT (welke kerndoelen, welke motor), nooit als bewijs dat het gebeurt | Veto 3, Poort 3 |
| 2026-09-02 | Gemeten: datalekken-rampenplan zakt op Veto 1 (aanvinkbrief); de regressieset is daarop aangepast | Veto 1 |
