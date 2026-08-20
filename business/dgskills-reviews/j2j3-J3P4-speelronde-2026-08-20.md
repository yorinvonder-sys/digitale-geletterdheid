# Speelronde J3P4 — periode-overzicht (2026-08-20)

## In het kort

Deze speelronde is de eindbeoordelingsperiode van leerjaar 3: zes missies waarin leerlingen hun werk moeten laten zien. Drie gesimuleerde profielen zijn gebruikt: een serieuze leerling, een sjoemelaar en een taalzwakke worstelaar; iPad-resultaten ontbreken. De meesterproef is de eindbeoordeling, maar certificeert 'Geslaagd' op vorm-loze invoer: vier irrelevante zinnen over kat, weer, fietsen en weekend plus vinkjes leveren 100/100 op. Over de hele linie kijkt de tekstpoort alleen naar lengte en vorm, niet naar inhoud. Daardoor halen sjoemelaars overal 100/100 of ruim de drempel, en is zakken bij vijf van de zes missies structureel onmogelijk. Alleen research-project kan zakken, maar daar zit een leerling dan vast op een dood eindscherm zonder herkansing. Feedback is op meerdere plekken misleidend, bijvoorbeeld een teller die voldaan oogt terwijl de knop uit blijft. De gevraagde structuur, zoals werksessies of een SLO-matrix, wordt nergens echt afgedwongen.

## Adviezen per missie

| Missie | Motor | Advies | Risico | Kern in één zin |
|---|---|---|---|---|
| portfolio-builder | builder-canvas | fix-eerst | Geel | Elke afronding is automatisch 100/100; zelfs pizza- en weerzinnen worden goedgekeurd. |
| research-project | data-viewer | fix-eerst | Rood | Zakken kan, maar dan zit de leerling vast op een dood eindscherm; middenpositie-gok haalt de drempel. |
| prototype-developer | builder-canvas | fix-eerst | Geel | Ook hier is zakken onmogelijk en meldt de knop 'Vink alles af' terwijl de checklist al af is. |
| pitch-perfect | builder-canvas | fix-eerst | Geel | Volle punten met vier keer dezelfde niet over de pitch gaande zin; vaardigheid wordt niet gemeten. |
| reflection-report | debate-arena | fix-eerst | Geel | Blind vinkjes zetten en onzin invullen levert 83/100 en de hoogste badge op. |
| meesterproef | builder-canvas | fix-eerst | Rood | De eindbeoordeling geeft 'Geslaagd' voor zinnen over kat, weer, fietsen en weekend plus vinkjes. |

## Rode draden

1. Tekstpoorten kijken alleen naar vorm, niet naar inhoud. Een tekst is al goed genoeg met ongeveer 40 tot 45 tekens, drie woorden en zes verschillende letters; ook het verplichte bewijsveld naast de hoofdtekst accepteert zinnen over het weer of de kat als volwaardig bewijs.

2. Zakken is structureel onbereikbaar bij vijf van de zes missies. Wie het resultatenscherm haalt, krijgt automatisch 100/100 of minimaal 83/100; alleen research-project kan zakken, maar een zakkende leerling blijft daar vastzitten op een dood eindscherm zonder echte herkansing.

3. Feedback misleidt op meerdere momenten: de knop zegt 'Vink alle items af' terwijl de checklist al compleet is, het bewijsveld toont een teller die voldaan oogt terwijl de knop uit blijft, en op één scherm staan soms twee verschillende tekengetallen.

4. Meerkeuze-gokken werkt: bij research-project staan alle juiste antwoorden op de middelste posities. Alleen de middelste optie kiezen levert precies 40/100 op, de drempel, zonder de data te lezen.

5. Gevraagde structuur wordt niet gecontroleerd. De meesterproef vraagt om drie werksessies, een beslissingenlog en een SLO-matrix, maar biedt één vrij tekstveld; drie losse zinnetjes of het overtypen van het voorbeeld met onzinwoorden worden als volledig geaccepteerd.

6. Alleen letterherhaling wordt geweerd. Een tekst als 'aaaa aaaa' wordt overal geblokkeerd, maar gevarieerde onzin of een herhaalde zin levert gewoon punten op.

## Correcties uit de tegenlezing

- De sjoemelroute is niet alleen “vier irrelevante zinnen + vinkjes”: er hoort ook een apart bewijsveld bij dat zelfstandig door de kwaliteitscheck moet. In de runs stond daar ook irrelevante tekst, dus de exploit zelf blijft staan.
- “Elke route” is beperkt tot de normale missie-UI. Omdat opgeslagen state zonder validatie wordt hersteld, zijn absolute claims over álle routes niet gedekt.
- De feedback van research-project toont na afloop wél de uitleg met een sectie ‘Verbetering’. De correctie is: de scoring controleert niet dat beide delen van de tweeledige vraag beantwoord zijn, en de feedback benoemt niet welk deel ontbreekt.
- Het bewijsveld toont wél een generieke melding (‘Schrijf minimaal N tekens betekenisvol bewijs (x/N)’). Wat ontbreekt, is alleen de specifieke kwaliteitshint die het hoofdveld wél toont.
- De taalniveau-claim is genuanceerd naar “waarschijnlijk te abstract voor A2-B1”.
- Uitvinken laat de score functioneel staan: de totaalscore blijft het stap-id meetellen, niet alleen de weergave.

## Reparatiekandidaten met de meeste impact

Eerst de reparaties die in de onderliggende motor zitten en meerdere missies tegelijk raken. De meesterproef-inhoudscheck staat bovenaan omdat dit de eindbeoordeling van leerjaar 3 is.

- **1. Inhoudelijke relevantiecheck voor eindbeoordelingsmissies (meesterproef)** — scope: motor, omvang: groot. Een leerling haalt nu ‘Meesterproef Geslaagd’ met zinnen over de kat en het weer. Voor een eindbeoordeling is dat onacceptabel; de tekst moet worden gecontroleerd op projectinhoud.
- **2. Tekstpoort inhoudelijk maken of uitslag eerlijk** — scope: motor, omvang: groot. Raakt portfolio-builder, prototype-developer en pitch-perfect: elke afronding levert nu 100/100 op, ook met volledig irrelevante zinnen. De score meet typen en vinken, niet of de leerling de opdracht begrijpt.
- **3. Data-viewer: herkansing mogelijk maken bij onvoldoende** — scope: motor, omvang: klein. Wie onder de 40%-drempel eindigt, zit permanent vast op een dood eindscherm dat ‘probeer het gerust nog eens’ belooft. Dit geldt voor alle data-viewer-missies.
- **4. Data-viewer: meerkeuze-opties husselen** — scope: motor, omvang: middel. Zonder shuffle staan juiste antwoorden bijna altijd in de middelste posities. In research-project haalde de middenpositie-gok in z’n eentje al de slaagdrempel.
- **5. Data-viewer: vraagtekst-echo uitsluiten** — scope: motor, omvang: middel. Teruggeplakte vraagtekst levert nu gegarandeerd 5/10 per open vraag op, zonder dat de leerling iets begrijpt.
- **6. Bouwmissies: bewijsveld dezelfde kwaliteitshint geven en knop-tekst laten kloppen** — scope: motor, omvang: klein. De teller oogt voldaan (bijv. 59/45) terwijl de knop uit blijft; de specifieke hint ontbreekt en de knop noemt soms 40 tekens terwijl het veld 45 eist.
- **7. Bouwmissies: bij een uitgeschakelde knop tonen welke voorwaarde nog openstaat** — scope: motor, omvang: klein. Op zware stappen (bijv. stap 1 van pitch-perfect met 8 vinkjes + twee velden) moet de leerling nu zelf zoeken wat er mist.
- **8. Debatmissie: bestaande kwaliteitshint ook in Challenge- en Reflect-fase tonen** — scope: motor, omvang: klein. In reflection-report blijft de knop zonder uitleg uit terwijl de teller ‘22/20 min.’ voldaan toont.

## Niet gemeten

- **iPad/mobiel:** niet gemeten, omdat Playwright op verzoek van Yorin is uitgeschakeld (het venster stal focus).
- **Chat/AI-coach:** niet getest. De zes missies draaiden zonder chat-afhankelijkheid; de coach zelf is geen onderdeel van deze speelronde.
- **Productie-afrondpad:** de eindknop ‘Missie voltooid!’ is alleen in de dev-preview getest. Daar is onComplete een no-op, dus echt afronden met de backend is niet geverifieerd.
- **Milestone-toast-timing:** herladen binnen ~1-2 seconden na een stapovergang kon niet live worden gereproduceerd. De code wijst op een risico, maar een live bevestiging ontbreekt.
