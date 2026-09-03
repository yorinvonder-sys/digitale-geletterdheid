# Opdracht-standaard DGSkills

Dit is het werkinstrument waarmee we een opdracht **afkeuren of goedkeuren**. Geen essay, geen visiestuk. Je pakt dit document erbij, je speelt de opdracht, en aan het eind weet je of hij door mag.

Het vervangt de puntentelling niet, maar staat ervóór. `rubric.md` bepaalt hoe *goed* een opdracht is. Dit document bepaalt of hij überhaupt in aanmerking komt om beoordeeld te worden.

---

## Waarom dit er moest komen

Meerdere AI-beoordelingen gaven de opdrachten steeds groen licht. De grondige audit (`docs/pedagogy/missie-snoeilijst.md`, staat op de nog niet samengevoegde tak `claude/challenging-digital-literacy-tasks-4f7e3b`) liet zien waarom dat gevoel niet klopte:

| Wat de audit vond | Aantal |
|---|---|
| Opdrachten die neerkomen op aanklikken en afvinken | 53 van de 100 |
| Opdrachten waarin je invult binnen een vast stramien | 39 van de 100 |
| Opdrachten waarin een leerling echt zelf iets maakt | 8 van de 100 |
| Opdrachten waar de leerling níets meeneemt naar buiten | 67 van de 100 |
| Opdrachten die draaien op 10 gedeelde motoren | 82 van de 100 |

Een **motor** is het stukje gedeelde software dat bepaalt wát je in een opdracht kunt doen — niet de tekst of het onderwerp erin.

De laatste regel is de kern. **Het probleem zit niet in de teksten, maar in de motor eronder.** Opdrachten die dezelfde motor delen, spelen grotendeels hetzelfde — hoe anders het onderwerp ook is. Zeven van de acht opdrachten die wél goed zijn, zijn maatwerk: een eigen bestand, voor niemand anders herbruikbaar. De achtste, `website-bouwer`, is de uitzondering die het middenniveau in Deel 3 bewijst: hij draait op de motor `builder-canvas` — dezelfde motor als tientallen andere, ondiepere projectopdrachten — en is toch diep, omdat leerlingen er echt HTML in typen die meteen in een browservenster verschijnt. Eén motor kan dus zowel ondiep als diep uitpakken; het verschil zit in wat er instelbaar is (zie Deel 3).

> Deze cijfers komen uit die audit. Ze zijn hier niet opnieuw nagemeten.

### Waarom de oude norm dit doorliet

`rubric.md` heeft al een ondergrens: V1, V3 en V7 moeten minimaal ⚠ scoren voor "klaar voor gebruik". V3 is denkorde, V7 is leerbaar bewijs — dus op papier is de rubric hier al streng genoeg.

Het echte gat zit ergens anders: **de rubric zegt nergens hóe je V3 en V7 vaststelt, en in de praktijk werd dat gedaan door het instellingenbestand te lezen — niet door de opdracht te spelen.** Zo kon een opdracht die bij het spelen plat aanvoelt, op papier toch ⚠ of ✓ scoren, omdat de code de juiste velden en componenten bevatte. De code loog niet; de manier van meten wel.

Daarom voegt dit document geen nieuwe score toe, maar een poort ervóór: **vier veto's, uitsluitend vast te stellen door te spelen.** Zak je op één, dan is er geen score. Punt.

---

## Deel 1 — De vier veto's

### De meetregel gaat hieraan vooraf (lees dit eerst)

> **Je stelt alle vier de veto's uitsluitend vast door de opdracht te SPELEN. Nooit door het instellingenbestand te lezen.**

Dit is de belangrijkste enkele reparatie in dit hele document.

Een eerdere beoordelingsronde gaf het gros van de opdrachten groen op interactiviteit (dit getal komt van BAAS, niet uit een bestand in deze repo — neem het als voorbeeld van het patroon, niet als harde meting). Die score kwam tot stand door in de code te kijken of er interactieve onderdelen in zaten — niet door de opdracht te spelen. In de code stónden die onderdelen ook. Alleen: bij het spelen bleek het twaalf keer hetzelfde kaartje-met-vier-knoppen (de scenario-engine, zie Deel 3). De code klopte, de meting was onzin.

Wat je in een instellingenbestand ziet, is wat de bouwer van plan was. Wat je bij het spelen ziet, is wat de leerling krijgt. Alleen dat tweede telt.

**Concreet, elke keer opnieuw:**

1. Open de opdracht in de browser (`/dev/mission-preview?mission=<id>` werkt zonder in te loggen).
2. Speel hem uit, van begin tot eind, als leerling. Niet doorklikken, niet scannen — spelen.
3. Schrijf tijdens het spelen op wat je doet. Niet wat er staat.
4. Pas daarna vul je de vier veto's in.

Een beoordeling waarin niet staat dát er gespeeld is, is geen beoordeling. Die gaat terug.

**Bekende valkuil:** acht `bonus-*`-opdrachten renderen leeg (blanco scherm) in de standalone preview (`/dev/mission-preview`), maar zijn niet kapot — hun instellingen zitten genest in een hoofdrol en spelen wél goed binnen die hoofdrol. Krijg je een blanco scherm bij zo'n opdracht: speel hem via zijn hoofdrol, keur hem niet af op basis van de lege preview.

---

### Veto 1 — Het artefact

**Neem eerst deze twee:**

In *Datalekken Rampenplan* (`src/features/missions/DatalekkenRampenplanMission.tsx`) schrijf je als leerling een echt rampenplan: wie bel je eerst, wat zeg je tegen ouders, welke stappen in welke volgorde. Aan het eind ligt er een document dat jij hebt opgesteld. Je mentor kan het lezen. Je kunt het volgend jaar terugvinden en zien dat je toen dommer was.

In een gemiddelde scenario-opdracht kies je vier keer uit vier kaartjes. Aan het eind staat er "Goed gedaan, 120 XP". Er is niets. Er valt niets te lezen, niets te laten zien, niets te bewaren.

**De regel:** aan het eind bestaat er iets dat de leerling zelf heeft gemaakt, dat bewaard blijft, en dat een ander kan bekijken.

Alle drie moeten waar zijn:

- **Zelf gemaakt** — niet gekozen. Een keuze uit opties telt niet mee, ook geen slimme keuze, ook geen keuze met een toelichting eronder. De vraag is: heeft de leerling dit *bedacht*, of *aangewezen*?
- **Blijft bewaard** — het staat er morgen nog. Een tekstvak dat na "Volgende" leeg is, telt niet mee. Een tekstvak waarvan de inhoud nergens heen gaat, telt niet mee.
- **Een ander kan het bekijken** — de docent, een klasgenoot, een ouder. Kan alleen de leerling zelf het zien, in het moment, dan is het geen artefact.

**Afgekeurd zodra:**
- het enige wat overblijft een score, een badge of een percentage is;
- het "artefact" een samenvatting is die het systeem schreef van de keuzes die de leerling maakte;
- er wel een tekstvak was, maar je na afloop nergens meer bij kunt wat je erin typte.

**Twijfelgeval, en hoe je hem oplost:** een leerling schrijft één alinea argumentatie bij een keuze, en die alinea wordt opgeslagen. Telt dat? Ja — als die alinea van de leerling zelf is en later terug te lezen valt. Nee — als hij uit een keuzemenu van voorgeschreven argumenten komt. Het onderscheid is of er iets in staat wat de bouwer niet van tevoren had kunnen typen.

---

### Veto 2 — De handelingen

**Neem eerst dit:**

In de *Word Simulator* (`src/features/word-simulator/WordSimulator.tsx`) doet een leerling per minuut zoiets als: kopregel selecteren, opmaakprofiel toepassen, zien dat de inhoudsopgave meeverandert, ontdekken dat de tweede kop níet meeging, terugzoeken waarom, opnieuw. Dat zijn handelingen. Er zit een vinger, een keuze en een gevolg in elke stap.

In een gemiddelde afvink-opdracht doet een leerling per minuut: tekst lezen, knop klikken, tekst lezen, knop klikken. Dat zijn ook handelingen, maar het zijn er twee, en ze staan los van elkaar.

**De regel:** schrijf op wat de leerling per minuut fysiek doet. Bestaat meer dan de helft van de minuten uitsluitend uit lezen, klikken, aanvinken en een antwoord typen dat nergens invloed op heeft → afgekeurd.

**Zo vul je hem in.** Tijdens het spelen noteer je per minuut een werkwoord. Niet het onderwerp, het werkwoord. Bijvoorbeeld:

| Minuut | Wat de leerling doet |
|---|---|
| 0-1 | leest introductie |
| 1-2 | klikt op scenario A |
| 2-3 | leest gevolg, klikt "volgende" |
| 3-4 | klikt op scenario B |
| 4-5 | leest gevolg, klikt "volgende" |

Vier van de vijf regels zijn "lezen en klikken". Deze is af. Afgekeurd.

Ter vergelijking, hetzelfde soort tabel bij een opdracht die wél door de poort komt:

| Minuut | Wat de leerling doet |
|---|---|
| 0-1 | bekijkt vier bronnen, kiest er één om mee te beginnen |
| 1-3 | zoekt de datum op, ontdekt dat die niet klopt met de foto |
| 3-4 | sleept de bron naar "verdacht", typt waarom |
| 4-6 | vindt de originele foto, past zijn conclusie aan |
| 6-8 | schrijft het eindoordeel, moet kiezen welk bewijs het zwaarst weegt |

**Afgekeurd zodra:**
- meer dan de helft van de minuten alleen "lezen" en "klikken" bevat;
- "typen" het enige actieve werkwoord is en het getypte nergens invloed op heeft;
- je de lijst niet kunt invullen omdat elke minuut hetzelfde is.

**Let op deze val:** "antwoord typen" ziet er actief uit maar is het vaak niet. Als het antwoord alleen wordt opgeslagen en niets verandert aan wat er daarna gebeurt, is het een verkapt afvinkvakje. Vraag jezelf af: verandert er iets door wat de leerling typte? Zo nee, dan telt het als klikken.

---

### Veto 3 — Het onderscheid

**Neem eerst dit:**

Zet twee scenario-opdrachten over verschillende onderwerpen naast elkaar. Je krijgt in allebei vier rondes, elke ronde een situatiekaart met vier knoppen, na elke keuze een stukje uitleg, aan het eind een samenvatting. De teksten verschillen. De handelingen niet. Een leerling die de tweede speelt, leert daar niets nieuws over hoe je zoiets aanpakt — hij typt alleen andere woorden op dezelfde plek.

**De regel:** leg de opdracht naast elke andere opdracht op dezelfde motor. Doet de leerling daar iets anders? Zo nee → afgekeurd.

"Iets anders" gaat over de handelingen uit Veto 2, niet over het onderwerp. Nepnieuws en online pesten zijn verschillende onderwerpen. Als je in allebei vier keer op een kaartje klikt, is het dezelfde opdracht in een ander jasje.

**Zo doe je hem:**

1. Zoek op welke motor de opdracht draait — dat staat in de kolom "Engine" van `docs/pedagogy/missie-snoeilijst.md` (op de tak `claude/challenging-digital-literacy-tasks-4f7e3b`), of anders aan de mapnaam onder `src/features/missions/templates/`.
2. Zoek de andere opdrachten op diezelfde motor.
3. Speel er één van die je nog niet kent — echt spelen, zie de meetregel.
4. Leg de twee handelingslijsten uit Veto 2 naast elkaar.
5. Verschillen ze wezenlijk? Dan geslaagd. Zijn het dezelfde werkwoorden in dezelfde volgorde? Afgekeurd.

**Afgekeurd zodra:**
- de handelingslijsten van de twee opdrachten uitwisselbaar zijn;
- het enige verschil de tekst, het plaatje of het thema is;
- je de twee opdrachten door elkaar zou halen als je de teksten weghaalde.

**Bij nieuwe opdrachten geldt dit vooraf, niet achteraf.** Voor je begint te bouwen bepaal je op welke motor de opdracht komt, en welke opdracht daar al op draait. Kun je niet uitleggen wat de leerling straks anders gaat doen dan in die bestaande opdracht — dan hoef je niet te beginnen.

---

### Veto 4 — De belofte

**Neem eerst deze drie, alle drie echt en alle drie nagemeten:**

- `dashboard-designer` belooft in zijn naam dat je een dashboard *ontwerpt*. Bij spelen blijkt: de leerling beantwoordt acht vragen over een dashboard dat al af is. Er wordt niets ontworpen.
- `podcast-producer` belooft een podcast die je *maakt*. Bij spelen blijkt: er wordt geen seconde geluid opgenomen — de leerling beschrijft zijn podcast in vier tekstvakken.
- `app-prototyper` belooft een prototype dat je *bouwt*. Bij spelen blijkt: het prototype wordt in vier tekstvakken beschreven; niemand kan er daarna op klikken.

Dit is een ander soort fout dan Veto 1 en 2. Een opdracht kan de andere veto's best halen — echt eigen tekst schrijven, echt afwegen — en toch de belofte in zijn eigen naam niet waarmaken. Dat is precies waarom dit een apart veto is en geen extra regel bij Veto 1.

**De regel:** lees de titel en de eerste zin van de opdracht, en schrijf op wat een leerling daarna verwacht te gaan doen. Doet de opdracht dat vervolgens niet, dan is hij afgekeurd — ook als de rest goed is.

**Zo vul je hem in:**

1. Lees alleen de titel en de openingszin. Schrijf op: "Ik verwacht dat ik ga [werkwoord]."
2. Speel de opdracht. Doe je dat werkwoord ook echt?
3. Nee → afgekeurd. Ja → geslaagd, ongeacht hoe je erover denkt of het onderwerp interessant is.

**Afgekeurd zodra:**
- de titel een activiteit belooft (ontwerpen, bouwen, opnemen, coderen, componeren) die nergens in de opdracht voorkomt;
- het enige wat de leerling doet, is *beschrijven* wat hij zou doen als hij het echt zou doen;
- je de opdracht een eerlijker naam zou moeten geven om hem niet meer misleidend te vinden.

**De uitweg gaat twee kanten op:** de opdracht waarmaken (leerling gaat echt ontwerpen/maken/opnemen), of hem eerlijk hernoemen naar wat hij werkelijk is (bijvoorbeeld "dashboard-lezer" in plaats van "dashboard-designer"). Beide zijn een geldige oplossing. Alleen de titel laten staan terwijl de opdracht hem niet waarmaakt, is dat niet.

---

### Het afkeurformulier

Dit is wat een beoordeling minimaal bevat. Zonder deze regels is er geen beoordeling.

Elk veto kent drie mogelijke uitkomsten, niet twee: **GESLAAGD**, **GEZAKT**, of **NIET VASTGESTELD**. Die derde is geen tussenweg en geen halve goedkeuring — zie de uitleg direct onder het formulier.

```
Opdracht:       <naam + id>
Gespeeld op:    <datum>  —  van begin tot eind: ja / nee

Veto 1 Artefact       GESLAAGD / GEZAKT / NIET VASTGESTELD
  Wat blijft er over: ...............................
  Wie kan het bekijken: ............................
  Bij NIET VASTGESTELD — waarom niet en wat is er nodig: ...

Veto 2 Handelingen    GESLAAGD / GEZAKT / NIET VASTGESTELD
  Handelingslijst per minuut (bijgevoegd): ja / nee
  Aandeel lezen+klikken: ....%  (GEZAKT boven 50%)
  Bij NIET VASTGESTELD — waarom niet en wat is er nodig: ...

Veto 3 Onderscheid    GESLAAGD / GEZAKT / NIET VASTGESTELD
  Motor: ...........................................
  Vergeleken met: ..................................
  Wat doet de leerling daar anders: ................
  Bij NIET VASTGESTELD — waarom niet en wat is er nodig: ...

Veto 4 Belofte        GESLAAGD / GEZAKT / NIET VASTGESTELD
  Titel + verwachte handeling: .....................
  Wat de leerling werkelijk doet: ..................
  Bij NIET VASTGESTELD — waarom niet en wat is er nodig: ...

UITKOMST:  DOOR NAAR RUBRIC  /  AFGEKEURD  /  NIET VASTGESTELD — NIET NAAR LEERLINGEN
```

Eén GEZAKT is genoeg. Er volgt dan geen score, geen puntentotaal, geen "18 van de 20 maar let nog even op". De opdracht gaat terug naar de tekentafel of hij gaat weg.

### De derde uitkomst: Niet vastgesteld

Soms kun je een veto niet met zekerheid spelen. Het artefact zit bijvoorbeeld achter een docentenscherm dat je niet kunt openen, of je hebt geen tijd om een tweede opdracht op dezelfde motor te spelen voor Veto 3. Voor die situatie is er een derde uitkomst naast geslaagd en gezakt: **niet vastgesteld**.

Drie regels horen daar onlosmakelijk bij:

1. **Niet vastgesteld is geen goedkeuring.** Het telt nooit als geslaagd, ook niet stilzwijgend, ook niet omdat de rest van de opdracht er goed uitziet.
2. **Wie het invult, schrijft twee dingen op:** waarom het niet vast te stellen was, en wat er nodig zou zijn om het alsnog te doen (toegang tot het docentenscherm, tijd om een tweede opdracht te spelen, een testaccount, wat dan ook).
3. **Een opdracht met één of meer niet-vastgestelde veto's mag niet naar leerlingen** totdat elk daarvan alsnog is vastgesteld — als geslaagd of als gezakt. "Niet vastgesteld" is nooit het eindstation.

Die derde regel is niet vrijblijvend. Zonder haar wordt "niet vastgesteld" binnen een maand het nieuwe "wel goed genoeg" — precies zoals "een keuze telt als bewijs" dat eerder werd voordat Veto 1 er kwam. Een opdracht die op "niet vastgesteld" blijft steken, staat gewoon nog open, niet klaar.

---

## Deel 2 — De vier speelvormen

Elke nieuwe opdracht kiest één van deze vier als **hoofdvorm** en schrijft dat op bij het ontwerp. Niet "een beetje van alles" — dat is precies hoe je in het midden uitkomt waar niets spannend is.

De vier vormen zijn de vier manieren waarop we spanning kunnen maken. En elke vorm levert vanzelf een ander soort artefact op, wat meteen Veto 1 helpt halen.

### 1. Simulatie met gevolgen

**Waar de spanning vandaan komt:** je keuze verandert de volgende situatie. Je kunt niet terug. Wat je nu doet, bepaalt met welk probleem je zo zit.

**Het artefact:** het pad dat de leerling aflegde, plus wat hij onderweg zelf opschreef — een plan, een verklaring, een besluit met onderbouwing.

**Voorbeeld (bestand bestaat, gebruik de meetregel om zelf te controleren of hij ook speelt zoals hier beschreven):** `src/features/missions/DatalekkenRampenplanMission.tsx` — een datalek loopt door terwijl je beslist. Wacht je met ouders informeren, dan is de situatie een stap later anders dan wanneer je het meteen doet.

**Waar het misgaat:** als elke keuze naar dezelfde volgende stap leidt en alleen de feedbacktekst verschilt, is het geen simulatie maar een quiz met sfeer. Toets: kunnen twee leerlingen dezelfde opdracht spelen en op een aantoonbaar andere plek uitkomen? Zo nee, dan is dit de verkeerde vorm.

### 2. Maken en bouwen

**Waar de spanning vandaan komt:** het ding moet echt werken. Het systeem vleit je niet — je ziet gewoon of het werkt of niet.

**Het artefact:** het gemaakte ding zelf. Sterkste artefact van de vier, want hij bestaat sowieso.

**Voorbeelden (bestanden bestaan, gebruik de meetregel om zelf te controleren of ze ook speelt zoals hier beschreven):** `src/features/missions/GameDirectorMission.tsx` en `src/features/word-simulator/WordSimulator.tsx`. In allebei geldt: wat je bouwt doet iets, en als je het fout doet zie je dat aan het resultaat, niet aan een foutmelding.

**Waar het misgaat:** als "maken" neerkomt op velden invullen in een formulier dat daarna een net vormgegeven kaartje toont. Toets: kan de leerling het kapot maken? Kan hij iets bouwen wat de bouwer niet had voorzien? Zo nee, dan is het invullen, niet maken.

### 3. Onderzoek en ontmaskeren

**Waar de spanning vandaan komt:** je weet het antwoord nog niet en je moet bewijs stapelen tot je er zeker genoeg van bent. Het aantrekkelijke is de twijfel onderweg.

**Het artefact:** de bewijsketen plus het eindoordeel — welke aanwijzingen vond je, welke woog je het zwaarst, wat concludeer je.

**Voorbeeld (bestand bestaat, gebruik de meetregel om zelf te controleren of hij ook speelt zoals hier beschreven):** `src/features/missions/DeepfakeDetectorMission.tsx` — je verzamelt aanwijzingen over een beeld en komt tot een oordeel dat je moet kunnen verdedigen.

**Waar het misgaat:** als het "onderzoek" bestaat uit drie aanwijzingen die je stuk voor stuk moet aanklikken, waarna de conclusie voor je verschijnt. Toets: kan een leerling tot een verkeerde conclusie komen en dat pas later ontdekken? Als fout gaan onmogelijk is, is er niets te onderzoeken.

### 4. Wedstrijd en tijdsdruk

**Waar de spanning vandaan komt:** de klok loopt en er is een score. Simpel, maar het werkt — mits het onderwerp zich ervoor leent.

**Het artefact:** dit is de zwakste vorm voor Veto 1, en dat moet je vooraf oplossen. Een score is geen artefact. Zorg dus dat er iets uit voortkomt: een lijst van wat je fout had met jouw uitleg erbij, een strategie die je opschreef, een oplossing die bewaard blijft.

**Voorbeelden van de vórm (let op: deze geven nu alleen een score terug — `RapidFire.tsx` roept letterlijk `onComplete(score, maxScore)` aan en verder niets — en zouden op Veto 1 zakken; ze laten zien hoe de vorm aanvoelt, niet hoe je hem goedkeurt):** `src/features/missions/templates/review-arena/sub/RapidFire.tsx`, en de escaperoom in `src/features/assessment/escaperoom/` (met onder meer `KamerCodekluis.tsx`, `KamerNepnieuwsfabriek.tsx`, `KamerDatalek.tsx`, `KamerDilemma.tsx` en `KamerVergrendeldeLaptop.tsx`).

**Waar het misgaat:** tijdsdruk op een taak die nadenken vraagt, maakt de taak dommer in plaats van spannender. Gebruik deze vorm voor herkennen en toepassen, niet voor afwegen en oordelen.

### Bij het ontwerp schrijf je dit op

```
Hoofdvorm:        simulatie / maken / onderzoek / wedstrijd
Waar zit de spanning:  .....................................
Wat neemt de leerling mee:  .................................
```

Drie regels. Kun je ze niet invullen, dan is het ontwerp nog niet af.

---

## Deel 3 — Het middenniveau

Dit is het scharnierpunt van het hele document. Alles hierboven zegt wat er beter moet. Dit deel zegt hoe dat betaalbaar blijft.

### Het probleem in twee getallen

**Maatwerk is diep, maar kost 700 tot 1400 regels code per opdracht.** Elk van onze 8 goede opdrachten is zo gebouwd. Dat kunnen we geen honderd keer doen — niet met de tijd die er is.

**Sjablonen zijn goedkoop, maar meestal ondiep van bouw.** 82 van de 100 opdrachten draaien op 10 gedeelde motoren en spelen daardoor grotendeels hetzelfde. Goedkoop, maar we hebben gezien wat dat oplevert.

Zolang we alleen deze twee opties hebben, is elke keuze fout. De uitweg is er een derde bij te bouwen.

### Dit bestaat al: website-bouwer

Voordat we verder redeneren: dit is geen theorie. `website-bouwer` (motor `builder-canvas`) staat al in de "behouden"-lijst van de audit als één van de acht goede opdrachten — de enige daarvan die op een gedeelde motor draait. Leerlingen typen er echte HTML in en zien die meteen in een browservenster verschijnen. Diezelfde motor `builder-canvas` draagt ook tientallen andere, veel ondiepere projectopdrachten. Dat is precies het bewijs dat één motor zowel plat als diep kan uitpakken, en dat het middenniveau hieronder geen wensdenken is maar iets wat al werkt.

### De derde soort: een motor die diep is van bouw, maar configureerbaar

Een echte motor is **diep gebouwd, één keer**, en daarna instelbaar per opdracht. Niet instelbaar op alleen de teksten — dat is wat we nu hebben. Instelbaar op **drie dingen**:

1. **De wereld** — waar speelt het, wie zijn de personages, wat is de aanleiding.
2. **De data** — welke bronnen, welke bewijsstukken, welke bestanden, welke berichten.
3. **De regels** — en dit is het punt waar de sjablonen op vastlopen.

Met "de regels" bedoelen we: wat er gebeurt als de leerling iets doet. Hoeveel tijd kost een handeling. Wat maakt een oplossing goed. Wat gaat er mis als je te lang wacht. Welke acties zijn hier überhaupt beschikbaar.

**Richtgetal (schatting, geen meting): één zo'n motor kan 10 tot 20 opdrachten dragen.** Dat is de rekensom die het middenniveau de moeite waard maakt: je betaalt één keer maatwerkprijs, en krijgt er in potentie tien tot twintig opdrachten voor terug die niet hetzelfde spelen — mits de regels, niet alleen de teksten, per opdracht verschillen.

### De motortoets

Zo weet je of je een echte motor hebt of een sjabloon met een mooie naam:

> Zet twee opdrachten op dezelfde motor naast elkaar en speel ze allebei.
> **Doet de leerling daar iets anders?**

Dit is dezelfde vraag als Veto 3, maar dan gesteld aan de motor in plaats van aan de opdracht. Bij een sjabloon is het antwoord nee. Bij een echte motor moet het antwoord ja zijn — **en om de juiste reden: omdat de onderliggende regels tussen de twee opdrachten verschillen, niet alleen de teksten.**

**Waarom de scenario-engine zakt.** Twaalf opdrachten, twaalf onderwerpen. Elke opdracht: vier rondes, per ronde een kaartje met vier keuzes, na elke keuze een toelichting. De teksten verschillen volledig. De regels zijn twaalf keer identiek — er is niets aan de spelregels dat per opdracht anders staat. Dus doet de leerling twaalf keer hetzelfde. Dat is een sjabloon.

### Voorbeeld: hoe hetzelfde onderwerp een motor wordt

Stel je bouwt een **onderzoeksmotor** voor "ontmaskeren" (speelvorm 3). Wat wordt er per opdracht ingesteld?

| Instelling | Opdracht A: nepnieuwsbericht | Opdracht B: phishingmail |
|---|---|---|
| Wereld | redactie van een nieuwssite | jouw eigen mailbox |
| Data | 6 bronnen, 2 foto's, 1 tijdlijn | 4 mails, 2 bijlagen, 1 inlogscherm |
| **Regel — hoe je bewijs krijgt** | bron aanklikken kost je tijd van de deadline | bijlage openen kan je "besmetten" |
| **Regel — wat een goed oordeel is** | minimaal 3 onafhankelijke bronnen die elkaar dekken | één sluitend technisch bewijs is genoeg |
| **Regel — hoe het misgaat** | je publiceert te laat en het verhaal is achterhaald | je klikt op de verkeerde link en de opdracht verandert |

De handelingen van de leerling verschillen nu écht: in A ben je aan het afwegen tussen snelheid en zekerheid, in B ben je voorzichtig aan het aftasten wat je durft te openen. Dezelfde motor, ander spel. Dat is het middenniveau.

Was alleen de bovenste twee rijen instelbaar geweest, dan had je een sjabloon gehad.

### Wat dit betekent voor de planning

- **Bouw geen losse opdracht meer op een bestaande sjabloonmotor.** Die zakt op Veto 3, dus het is verspilde tijd.
- **Bouw per speelvorm één goede motor**, en dan de opdrachten daarop.
- **Bij elke nieuwe motor schrijf je vooraf op welke regels instelbaar zijn.** Staan daar alleen teksten, kleuren en plaatjes bij, dan bouw je een sjabloon en moet je terug naar de tekentafel.
- **Maatwerk blijft bestaan** voor het handvol opdrachten dat echt niet in een motor past. Maar het is de uitzondering, niet het plan.

---

## Deel 4 — Niveau via lagen, niet via versies

### Het probleem

Mavo, havo en vwo krijgen binnen hetzelfde leerjaar op dit moment exact dezelfde opdracht. Voor de vwo-leerling is dat te makkelijk, voor de mavo-leerling soms te veel ineens.

De voor de hand liggende oplossing — drie versies bouwen — is de verkeerde. Dat vermenigvuldigt al het werk met drie: drie keer bouwen, drie keer beoordelen, drie keer onderhouden, drie keer de veto's langslopen. Dat houden we niet vol.

### De regel

**Eén opdracht per leerjaar en periode.** Die opdracht bestaat uit:

- een **basisroute** die op zichzelf af is en op zichzelf beoordeelbaar. Een leerling die alleen de basisroute doet, heeft een complete opdracht gedaan en een echt artefact gemaakt. Geen half product, geen "je hebt het makkelijke deel gedaan".
- **verdiepingsblokken** voor wie verder wil of kan. Extra lagen bovenop hetzelfde werk: een moeilijker geval, een extra afweging, een tegenargument dat je moet weerleggen.

Belangrijk: de verdieping is **hetzelfde werk, dieper**, niet ander werk erbij. Je bouwt niet twee opdrachten in één jas. Je bouwt één opdracht waar je verder in kunt graven.

### Waarom dit ook voor de veto's beter is

Bij drie losse versies moet je drie keer alle veto's doorlopen, en zak je waarschijnlijk op Veto 3 tegen je eigen andere versies — die spelen immers grotendeels hetzelfde. Bij één opdracht met lagen beoordeel je de basisroute op de veto's, en toets je de verdiepingsblokken op één extra vraag: **maakt dit blok de denkstap moeilijker, of maakt het alleen de opdracht langer?** Alleen langer is geen verdieping.

### Dit bestaat al werkend

Het lagenmodel is geen idee — er staat werkende code voor. Let op de tak-context:

> `src/features/missions/projects/shared/DepthBlocks.tsx` en `src/features/missions/projects/nepnieuws-test/sub/DepthAnswer.tsx` staan **niet** op de huidige tak (`team/bouwer`) en ook niet op de hoofdlijn. Ze staan, geverifieerd, op de nog niet samengevoegde tak `claude/challenging-digital-literacy-tasks-4f7e3b`, die alleen lokaal bestaat en nog niet is gepusht — op een andere computer is deze tak dus (nog) niet te vinden.

Wie het nu wil bekijken, moet dus naar die tak. Zeg niet dat het "in de codebase staat" zonder die tak erbij te noemen — dan klopt de bewering niet voor wie het gaat opzoeken. Zolang die tak niet is samengevoegd, is het lagenmodel wel bewezen maar nog niet beschikbaar voor nieuw werk.

---

## Deel 5 — SLO: het artefact is het bewijs

### Het probleem

Kerndoel 22A (digitale producten maken) is met **40 opdrachten** (geteld in `src/config/slo-kerndoelen-mapping.ts`) ons best gedekte kerndoel. Tegelijk levert **67 van de 100 opdrachten geen enkel eigen product op**. Die twee kunnen niet allebei waar zijn.

Wat er gebeurde: het label werd geplakt omdat de opdracht *over* digitale producten gaat. Niet omdat de leerling er een maakt. Zo wordt een kerndoel-label een belofte in plaats van een bewijs — en op papier ziet de dekking er goed uit terwijl de praktijk anders is.

### De regel

> **Een kerndoel mag alleen getagd worden als het artefact het aantoont. Niet als de opdracht er "over gaat".**

De toets is één vraag, en je stelt hem met het artefact uit Veto 1 in je hand:

> Als iemand alleen dit artefact bekijkt, zonder de opdracht te kennen — kan hij dan zien dat de leerling dit kerndoel beheerst?

Ja → tag hem. Nee → geen tag, hoe passend het onderwerp ook is.

Dit koppelt Deel 5 direct aan Veto 1: **geen artefact betekent automatisch geen kerndoel-tag.** Een opdracht die op Veto 1 zakt, kan per definitie geen kerndoel aantonen.

### Voorbeelden

| Situatie | Tag 22A? |
|---|---|
| Leerling maakt een werkend document met opmaakprofielen en inhoudsopgave | Ja — het product ís het bewijs |
| Leerling kiest vier keer welke opmaak het beste past | Nee — er is geen product |
| Leerling leest hoe een goede presentatie is opgebouwd en beantwoordt vragen | Nee — kennis over, geen product |
| Leerling bouwt een presentatie die iemand anders kan bekijken | Ja |

### Voorrang bij nieuwe opdrachten

**Kerndoel 23B (digitaal welzijn) is met 17 opdrachten (geteld in `src/config/slo-kerndoelen-mapping.ts`) het sterkst onderdekt.** Dat kerndoel krijgt voorrang bij alles wat we nieuw bouwen.

Let daarbij op de valkuil die bij welzijn extra hard toeslaat: welzijnsonderwerpen lenen zich makkelijk voor "kies wat jij zou doen"-kaartjes, en dat is precies de vorm die op de veto's zakt. Voor 23B zijn simulatie met gevolgen (Deel 2, vorm 1) en onderzoek (vorm 3) de kansrijke routes — daar levert de leerling een plan, een oordeel of een onderbouwd besluit op dat je kunt bewaren en laten lezen.

---

## Samengevat: de volgorde waarin je dit gebruikt

**Bij een nieuwe opdracht, vóór je bouwt:**

1. Kies je hoofdspeelvorm en schrijf de drie ontwerpregels op (Deel 2).
2. Bepaal op welke motor hij komt, en wat de leerling daar anders gaat doen dan in de opdrachten die er al op draaien (Veto 3 vooraf).
3. Bepaal wat het artefact wordt (Veto 1 vooraf) — als je dat niet kunt benoemen, is het ontwerp niet af.
4. Kies een titel die klopt met wat de leerling gaat doen, en niet meer belooft dan de opdracht waarmaakt (Veto 4 vooraf).
5. Bepaal de basisroute en de verdiepingsblokken (Deel 4).
6. Tag pas een kerndoel als je weet dat het artefact het aantoont (Deel 5).

**Bij een bestaande opdracht, of na het bouwen:**

1. Speel hem. Van begin tot eind. Nooit het instellingenbestand lezen.
2. Vul het afkeurformulier in, per veto: GESLAAGD, GEZAKT, of NIET VASTGESTELD (met reden en wat er nodig is).
3. Eén GEZAKT = afgekeurd, geen score.
4. Eén of meer NIET VASTGESTELD, verder geen GEZAKT = niet naar leerlingen totdat alsnog vastgesteld.
5. Alle vier GESLAAGD = door naar `rubric.md` voor de inhoudelijke beoordeling.
