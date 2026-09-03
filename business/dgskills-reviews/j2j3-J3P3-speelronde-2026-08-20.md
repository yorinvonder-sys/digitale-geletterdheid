# Speelronde J3P3 — periode-overzicht (2026-08-20)

## In het kort

In alle acht missies haalden eerlijke leerlingen meestal 'Gehaald', maar de scores meten vaak vorm en doorloop, niet of de leerling de stof begrijpt. In startup-simulator, innovation-lab, policy-maker en startup-pitch is zakken onmogelijk; een sjoemelaar scoort daar met lege zinnen of vaste gokposities exact gelijk aan een eerlijke leerling. In de drie data-viewer-missies en impact-review kan een leerling wél onder de 40% zakken, maar dan blokkeert het eindscherm: de enige knop staat uit en herladen helpt niet. De juiste meerkeuze-antwoorden staan bijna altijd op de middelste posities, waardoor blind gokken te vaak wordt beloond. Wie bij open vragen de vraagtekst terugplakt of losse trefwoorden gooit, krijgt daar zonder enige inhoudelijke inspanning de helft van de punten voor. Taalzwakke worstelaars lopen het vaakst vast op misleidende of ontbrekende hints, bijvoorbeeld een teller die 'voldaan' zegt terwijl de doorgaan-knop dicht blijft. Inhoudelijk zijn de missies grotendeels didactisch sterk; de belangrijkste problemen zitten in de motormeetlat, niet in de lesstof. iPad is niet gemeten; alle resultaten komen van desktopruns.

## Adviezen per missie

| Missie | Motor | Advies | Risico | Kern in 1 zin |
|---|---|---|---|---|
| startup-simulator | builder-canvas | fix-eerst | Geel | Een inhoudsloze zin in alle velden plus vinkjes geeft 100/100 'Gehaald', identiek aan een eerlijk antwoord. |
| policy-maker | debate-arena | fix-eerst | Geel | Vulzinnen geven 83/100 en de hoogste badge; zakken kan niet omdat de poort minimaal 83% afdwingt. |
| innovation-lab | builder-canvas | fix-eerst | Geel | Vier onzinzinnen en alle vinkjes geven 100/100 'Top Innovator'; afronden is per definitie 100%. |
| digital-divide-researcher | data-viewer | fix-eerst | Rood | Onder 40% zit de leerling vast op een dood eindscherm; vraagtekst-echo lekt halve punten. |
| tech-impact-analyst | data-viewer | fix-eerst | Geel | Eerlijke antwoorden scoren soms 0 door te smalle trefwoordenlijsten, terwijl vraagtekst-echo altijd deelpunten oplevert. |
| welzijnsonderzoeker | data-viewer | fix-eerst | Rood | Eerlijk antwoord van 10 woorden krijgt 0 met misleidende lengte-feedback; de eerder gemelde 'bevroren knop' is in de tegenlezing weerlegd (wel een misleidende woordenteller). |
| startup-pitch | tool-guide | fix-eerst | Geel | Checklist aanvinken zonder één vraag goed geeft al 73% 'Gehaald'; alle juiste meerkeuze-antwoorden staan op positie 3. |
| impact-review | review-arena | fix-eerst | Geel | De '+5 bonus' wordt afgekapt op het rondemaximum (bij een foutloze ronde levert hij niets op); onder 40% eindigt de missie in een dood scherm. |

## Rode draden

1. Onder 40% wacht in elke data-viewer-missie en in impact-review een dood eindscherm: de enige knop is uitgeschakeld, herladen helpt niet en er is geen terugweg.
2. Tekstpoorten controleren alleen vorm, niet inhoud: een irrelevante zin of alleen vinkjes geven in builder-canvas-, debate-arena- en tool-guide-missies gewoon 'Gehaald', met dezelfde score als een doordacht antwoord.
3. Meerkeuzevragen worden nooit gehusseld: in 39 van de 43 gevallen staat het juiste antwoord op een middelste positie, dus 'altijd de middelste' is een leerbaar gokpatroon.
4. Vraagtekst-echo en losse trefwoorden geven bij open vragen in data-viewer-missies consequent de helft tot twee-derde van de punten, zonder dat de leerling de data bekeken heeft.
5. Feedbackhints zijn vaak misleidend of afwezig: tellers tonen 'voldaan' terwijl de knop dicht blijft, en 'schrijf minstens 8 woorden' verschijnt bij een antwoord van 10 woorden.
6. In vier van de acht missies (startup-simulator, policy-maker, innovation-lab, startup-pitch) is zakken onmogelijk: afronden staat per definitie boven de 40%-drempel.

## Correcties uit de tegenlezing

- **Bevroren Bevestig-knop (welzijnsonderzoeker) weerlegd als blocker.** De knop wordt bij elke tekstwijziging opnieuw berekend; een permanente vergrendeling bestaat niet. De schijnbare bevriezing zit in de woordenteller: die telt ruwe woorden, de knop de gestripte tekst. Blijft overeind als major (misleidende feedback), niet als blocker.
- **+5-bonus (impact-review) afgekapt op rondemaximum.** De bonus telt wél mee, maar wordt begrensd op de maximale rondescore (25). Bij een foutloze ronde voegt hij dus niets toe. De UI belooft '+5' zonder die grens te vermelden; het mechanisme zelf werkt.
- **Match-pairs-weerlegging (impact-review) zelf weerlegd.** De code schrijft bij een foute koppeling direct de score weg; de automatische opslag slaat binnen ongeveer een seconde op, en ook bij het verlaten van de pagina. De eerdere herlaad-testen vielen waarschijnlijk binnen die ene seconde. De vergrendelingsbug is code-bevestigd maar runtime-onbeslist; hertest met meer dan een seconde wachttijd nodig.
- **Echo-nuances (data-viewer-missies).** '0 punten bij alleen "Dit telt nog niet mee"' was te sterk: ná die melding toont de UI alsnog de inhoudelijke uitleg, en een antwoord met minstens twee inhoudsoverlappingen kan alsnog op de helft vallen. Ook de maximale gokscore is hoger dan eerder geschat: drie open antwoorden met één keyword plus één juiste meerkeuzegok halen al 45/100. Gemeten blijft: echo-variant 30/100, pure gok 0/100.
- **Meerkeuzeverdeling gecorrigeerd.** Over 45 vragen (eerder: 43) staat het juiste antwoord 2 keer op positie 0, 20 keer op positie 1, 19 keer op positie 2 en 4 keer op positie 3; de api-verkenner en sustainability-scanner hebben ook een juist antwoord op de vierde positie.

## Reparatiekandidaten met de meeste impact

1. **Herkansingsknop op het eindscherm onder 40%** — scope: motor; omvang: klein. Een gezakte leerling zit nu permanent vast op een disabled knop; dit raakt alle data-viewer- en review-arena-missies.
2. **Inhoudelijke relevantiecheck op open antwoorden** — scope: motor; omvang: groot. De tekstpoort keurt alleen vorm; inhoudsloze zinnen scoren daardoor net zo hoog als doordachte antwoorden.
3. **Vraagtekst-echo en losse trefwoorden naar 0 punten** — scope: motor; omvang: middel. Teruggeplakte vraagtekst en losse keywords leveren nu structureel halve punten op; op andere configs kan het lek groter zijn.
4. **Bestaande kwaliteitshint overal tonen waar tekst wordt afgekeurd** — scope: motor; omvang: klein. Het bewijsveld en de Challenge/Reflect-fasen houden de doorgaan-knop dicht zonder uitleg; de hint bestaat al, maar wordt alleen op sommige plekken getoond.
5. **Meerkeuze-posities door elkaar of herverdeeld** — scope: motor (met config-aandeel); omvang: middel. De meeste juiste antwoorden staan op de middelste posities; startup-pitch heeft alle drie op de derde plek. Gokpatronen worden zo aangeleerd.
6. **'Gehaald' en badges laten differentiëren** — scope: motor; omvang: middel. Door poort-afgedwongen ondergrenzen is zakken onmogelijk; het label meet alleen doorloopgedrag, geen kwaliteit.
7. **Woordenteller en knop op één telling zetten** — scope: motor; omvang: klein. De hint telt ruwe woorden, de knop de gestripte tekst; een leerling kan daardoor ten onrechte denken dat de knop bevroren is.
8. **Match-pairs-vergrendeling hertesten en de score pas ná de automatische opslag vastleggen** — scope: motor; omvang: klein. De eerdere weerlegging is zelf weerlegd; een herlaad binnen de opslagwachttijd maskeert de fout.

## Niet gemeten

- **iPad/mobiel** — niet gemeten: Playwright is op verzoek van Yorin uitgeschakeld omdat het venster telkens de focus stal. Er is daardoor geen enkele tablet- of telefoonrun in deze ronde.
- **Chat/AI-coach** — in de preview niet reproduceerbaar zonder ingelogde sessie; een hulpvraag leverde de kale foutmelding 'Je sessie is verlopen' op. Of de vriendelijke fallback in productie werkt, is niet vastgesteld. Chat is optionele hulp en blokkeert de missie niet.
- **Productie-afrondpad** — de echte afronding in productie is niet als run getest; in de preview is de afrondknop een knop die bewust niets doet maar wél de voortgang wist. Codecontrole wijst uit dat een tweede klik in productie geen tweede afronding start, maar dat is geen gespeelde productierun.
