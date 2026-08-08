# Teamreview leerjaar 2, periode 2 — Programmeren & Computational Thinking

**Datum:** 7 augustus 2026
**Omvang:** 11 opdrachten, 1 afsluitende review-opdracht, 1 periodetoets, 6 gedeelde motoren
**Werkwijze:** motoren één keer beoordeeld, elke opdracht apart, één ronde daadwerkelijk gespeeld in de browser, dragende claims tegengelezen door een onafhankelijk model

---

## In het kort

De problemen van deze periode zaten niet in de losse opdrachten maar in de **machinerie eronder**. Alle zes de motoren die deze periode draagt, kregen het oordeel "eerst repareren". Het patroon was steeds hetzelfde: een leerling kon de volle score halen zonder inhoudelijk werk te leveren, en op twee plekken leerde de opdracht iets dat feitelijk niet klopt.

Wat een leerling hiervan merkte:

- **Bij Netwerk Verkenner** telde elk open antwoord automatisch voor de volle punten. "aaaaaaaaaa" leverde tien van de tien op. De opdracht meldde daarna sowieso "gehaald", ongeacht de score.
- **Bij het Wachtwoord-fort** kreeg zestien keer de letter "a" het oordeel "houdt stand — 691.000 jaar" en de hoogste badge. Dat is niet alleen een scorelek maar een onjuiste les: zo'n wachtwoord is in seconden te kraken.
- **Bij Bug Hunter** stond het juiste antwoord bij alle negen vragen op dezelfde plek. Altijd de tweede optie aanklikken volstond.
- **In de afsluitende review-opdracht** was de categorie "JavaScript" onzichtbaar: gele tekst op een crèmekleurige achtergrond.
- **In de puzzelmotor** was het invoerveld donkergrijs op donkergrijs — een leerling zag niet wat hij typte.

Dat is allemaal gerepareerd. Wat overblijft zijn zes keuzes die van jou zijn, niet van mij; die staan onderaan.

---

## Wat er is gerepareerd

### Scoring die weer iets meet

| Waar | Was | Is nu |
|---|---|---|
| Netwerk Verkenner (open vragen) | elk antwoord van 10 tekens gaf de volle punten | inhoudelijke controle; onzin geeft hooguit de helft |
| Netwerk Verkenner (afronding) | meldde altijd "gehaald" | alleen boven de drempel van 40% |
| Wachtwoord-fort | 16× "a" = hoogste niveau | zakt naar het laagste niveau; een echte wachtwoordzin haalt nog wél het hoogste |
| Wachtwoord-fort (afronding) | meldde altijd "gehaald" | gekoppeld aan het aantal echt gehaalde rondes |
| Bouwopdrachten (3×) | 40 willekeurige tekens per stap volstonden | inhoudelijke controle plus een drempel die past bij de stap (150–200 tekens) |
| Simulatie-opdrachten (4×) | vragen te beantwoorden zonder de simulatie aan te raken | de simulatie moet eerst gebruikt zijn |
| Afsluitende review | ronde opnieuw speelbaar na herladen, met de antwoorden bekend | ingediende ronde ligt vast; na herladen volgt de uitslag, niet de ronde |
| Afsluitende review (sorteren) | direct in te dienen, hussel kon toevallig het antwoord tonen | pas na een verplaatsing, en de hussel kan nooit op de antwoordvolgorde uitkomen |
| Toegangsbeheerder (stap 1 en 2) | alles aanklikken telde als "gevonden" en "ingesteld" | alleen daadwerkelijk onveilige regels en correcte rechten tellen |
| Wachtwoord Warrior | gratis aanwijzing bevatte een werkend wachtwoord | abstract patroon; validator dwingt nu af wat hij belooft |

### Voorspelbare antwoorden weggehaald

Vier configuraties hadden het juiste antwoord vrijwel altijd op dezelfde positie. Nageteld met een script over de broncode:

| Opdracht | Verdeling vóór | Verdeling na |
|---|---|---|
| Bug Hunter | 0 / 9 / 0 / 0 | 3 / 2 / 2 / 2 |
| Code Reviewer | 0 / 8 / 1 / 0 | 3 / 2 / 2 / 2 |
| Algorithm Architect | 1 / 7 / 1 / 0 | 3 / 2 / 2 / 2 |
| Privacy by Design | 1 / 7 / 0 / 1 | 3 / 2 / 2 / 2 |

De laatste stond niet in enig deelrapport — die kwam alleen boven water doordat ik de telling zelf overdeed.

### Feitelijke correcties in de leerstof

- **Algorithm Architect:** het als juist gemarkeerde antwoord ("begin met het getal 0 als tijdelijke grootste") sprak de eigen uitleg tegen en faalt bij een lijst met alleen negatieve getallen. Gecorrigeerd naar "begin met het eerste element".
- **Privacy by Design:** dataminimalisatie werd "een AVG-recht" genoemd. Het is een beginsel (artikel 5 lid 1 sub c), geen recht van de betrokkene. Herschreven.
- **Wachtwoord-fort:** de hint stuurde op "8 tekens met hoofdletters en cijfers", wat de eigen kernles tegensprak en volgens het eigen rekenmodel maar 23 minuten tot 30 uur standhoudt. Herschreven naar minimaal 14–15 tekens, in lijn met NIST en het NCSC. Een hint die een compleet werkend wachtwoord weggaf, is vervangen door een patroonbeschrijving.

### Leesbaarheid

Alle gemeten waarden zijn berekend, niet geschat. De norm is 4,5:1.

- Invoerveld puzzelmotor: **1,0:1** (tekst in de achtergrondkleur) → hersteld
- Categorie "JavaScript" in de afsluitende opdracht: **1,0:1** → nu **14,4:1**, gemeten in de browser
- Categorie "HTML": 3,1:1 → nu 14,4:1
- Uitleg na een fout antwoord in de simulatiemotor: 1,1:1 → hersteld
- Foutmarkering in de snelle ronde: 1,1:1 → hersteld
- Lopende tekst door alle motoren heen: 4,3:1 → opgehoogd

### Bediening zonder muis

Sorteren in de datatabel kon alleen met de muis, terwijl de opdracht leerlingen opdraagt te sorteren om de antwoorden te vinden. In de afsluitende opdracht kon een verkeerd geplaatst item niet worden teruggenomen met het toetsenbord, terwijl indienen pas mocht als alles geplaatst was — een gedwongen foute inzending. Beide hersteld, samen met namen voor schuifregelaars en invoervelden en gesproken feedback na een antwoord.

### Vastlopers

Drie motoren zetten opgeslagen voortgang ongecontroleerd terug. Wijzigde een opdracht, dan crashte hij bij elke herlaad opnieuw, zonder uitweg voor de leerling. Alle drie vangen dat nu af.

### Nieuw gevonden tijdens het spelen

De tweede dataset van Netwerk Verkenner toonde een staafdiagram zonder waarden, terwijl een vraag van vijftien punten om een exacte verhouding vroeg (45 gedeeld door 8). Die getallen stonden nergens op het scherm — alleen raden was mogelijk. De grafiek toont nu overal de waarden. Ook stond de heen-en-terugtijd naar een Amerikaans datacenter op 61 milliseconden; dat is realistisch onmogelijk en ondermijnt juist de les over vertraging. Verhoogd naar 97 milliseconden, met het antwoord van de bijbehorende vraag mee aangepast.

---

## Wat de tegenlezing heeft gecorrigeerd

Vijftien dragende claims zijn door een onafhankelijk model getoetst met de opdracht ze te breken. Drie moesten worden bijgesteld:

- **Weerlegd:** "bij Wachtwoord Warrior levert alle opties aanklikken de volle score op." Er zijn vier opties en maar drie pogingen, dus dat kan niet. Claim geschrapt.
- **Te sterk:** "een leerling krijgt volledige punten zonder werk." De puntentoekenning is begrensd op 25 per keer en kent een daglimiet. Het echte probleem — de opdracht meldt "gehaald" ongeacht de score — blijft staan.
- **Te sterk:** "veertig herhaalde tekens leveren de stappunten op." Er moesten ook nog checklistvakjes worden aangevinkt. Herformuleerd.
- **Te zwak:** bij Algorithm Architect stonden zeven van de negen juiste antwoorden op dezelfde plek, niet zes.

Verder viel op dat de speelronde twee dingen als "weerlegging" noteerde die in werkelijkheid bewijs waren dát de reparaties werken — die proeven draaiden pas nadat de fixes al geladen waren.

---

## Wat is geverifieerd, en wat niet

**In de browser nagespeeld:** het scorelek van Netwerk Verkenner (onzin wordt nu geweigerd, een echt antwoord komt door), de leesbaarheid van de drie categorieën, de sorteerknoppen in de tabel, en het oordeel van het wachtwoord-fort op zestien keer "a".

**Wel in de code bewezen, niet in de browser:** de herlaad-beveiliging van de afsluitende opdracht. De speelronde testte het verkeerde moment (midden in een ronde in plaats van ná het indienen), dus die proef is onbeslist gebleven. De bevinding zelf is door de tegenlezing bevestigd op regelniveau.

**Niet nagespeeld:** zeven van de twaalf opdrachten zijn alleen op code beoordeeld, niet gespeeld. De speelronde is bewust ingekort omdat de code-analyse de meeste claims al had bevestigd.

**Technische controles:** typecheck schoon, productiebouw slaagt.

---

## Beslispunten — dit zijn keuzes voor jou, geen reparaties

1. **De AI-coach vertelt de verkeerde stap.** De server-instructie zegt dat een bouwopdracht drie stappen heeft, terwijl deze drie er vier hebben; bij stap 3 en 4 benoemt de coach dus de verkeerde. De client-kant is al gerepareerd, de serverkant niet. Ik heb dit bewust niet aangeraakt: het staat in een gedeeld bestand dat 91 rollen raakt en het vraagt een aparte uitrol.

2. **De hele veiligheidskant van deze periode wordt nergens getoetst.** Vijf van de elf opdrachten gaan over netwerken, privacy, wachtwoorden en toegangsrechten. De afsluitende review-opdracht toetst daar niets van, en de periodetoets ook niet — die claimt vier kerndoelen maar toetst er twee. Dit oplossen betekent nieuw toetsmateriaal maken, geen reparatie.

3. **Wanneer heet een opdracht "gehaald"?** Ik heb voor Netwerk Verkenner de bestaande 40%-drempel aangezet en het wachtwoord-fort aan zijn eigen rondedoel gekoppeld. Of dat de juiste grens is, en of dat voor alle opdrachten zo moet gelden, raakt het docentdashboard en de puntentelling. Jouw keuze.

4. **Mag een herkansing opnieuw punten opleveren?** Nu wist een voltooide opdracht zijn opgeslagen voortgang, dus een tweede doorloop begint schoon — met alle antwoorden bekend.

5. **Voorspellen of aflezen?** In de simulatiemotor staat het live-resultaat permanent boven de vragen, terwijl sommige vragen de leerling iets laten "voorspellen" wat al op het scherm staat. Dit los je op door het paneel te verbergen of de vraag te verplaatsen — beide veranderen de opbouw van de opdracht.

6. **De sorteerronde van de afsluitende opdracht is niet eenduidig.** De gevraagde volgorde van "API" en "gebruikerservaring" kent geen dwingend juist antwoord; een leerling kan een andere volgorde verdedigen zonder fout te zitten. In een scorende ronde is dat lastig te verantwoorden.

Daarnaast blijft staan dat de Toegangsbeheerder 24 schakelknoppen op één scherm zet voor leerjaar 2. Ik heb de knoppen wel netjes laten aankondigen, maar het aantal terugbrengen is een herontwerp.

---

## Per opdracht

| Opdracht | Ontwerp | Didactiek | Techniek | Oordeel |
|---|---|---|---|---|
| Algorithm Architect | 6 | 5 | 8 | gerepareerd |
| Web Developer | 7 | 5 | 4 | gerepareerd |
| Netwerk Verkenner | 3 | 3 | 3 | gerepareerd |
| App Prototyper | 6 | 6 | 4 | gerepareerd |
| Bug Hunter | 6 | 5 | 6 | gerepareerd |
| Automation Engineer | 6 | 5 | 4 | gerepareerd |
| Code Reviewer | 7 | 6 | 4 | gerepareerd |
| Privacy by Design | 4 | 4 | 3 | gerepareerd |
| Wachtwoord Warrior | 7 | 6 | 7 | gerepareerd |
| Wachtwoord-fort | 3 | 3 | 3 | gerepareerd |
| Toegangsbeheerder | 2 | 2 | 4 | gerepareerd |
| Code Review 2 | 5 | 3 | 6 | gerepareerd |
| Periodetoets | 6 | 4 | 7 | beslispunt 2 |

De cijfers zijn de stand vóór de reparaties. Losse rapporten per opdracht staan in dezelfde map, met dezelfde datum in de bestandsnaam.

---

## Twee eerdere openstaande punten opgelost

- "Toegangsbeheerder claimt kerndoel 22B zonder programmeeractiviteit" — **weerlegd**. De opdracht claimt alleen 21A en 23A; 22B staat in de periode-brede opsomming, wat een optelsom over elf opdrachten is.
- "Wachtwoord-fort overlapt met Wachtwoord Warrior" — **weerlegd**. De twee vullen elkaar aan (herkennen versus toepassen) en staan in de juiste volgorde.
