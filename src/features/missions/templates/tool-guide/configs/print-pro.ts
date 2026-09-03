import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'print-pro',
    title: 'Print Pro',
    introEmoji: '🖨️',
    introTitle: 'Print Pro',
    introDescription:
        'Leer printen op school, stap voor stap. Je ontdekt hoe je je apparaat verbindt met de schoolprinter, de juiste instellingen kiest en je printopdracht verstuurt.',
    introFeatures: [
        'Het printsysteem van je school herkennen',
        'Je apparaat verbinden met de schoolprinter',
        'De juiste printinstellingen kiezen (kleur, dubbelzijdig)',
        'Een printopdracht versturen en ophalen',
    ],
    toolName: 'Schoolprinter',
    toolIcon: '🖨️',
    steps: [
        {
            id: 'stap-1-systeem',
            title: 'Printsysteem herkennen',
            instruction:
                'Elke school gebruikt een eigen printsysteem. Kijk eerst welk **apparaat** je gebruikt: iPad, Chromebook, Windows-laptop of Mac. Zoek daarna uit welk **printsysteem** jullie school heeft. Op een laptop ga je naar Instellingen > Printers. Weet je het niet? Vraag je docent of de IT-helpdesk van school.',
            tip: 'Je hoeft het printsysteem maar één keer in te stellen. Als je weet hoe het werkt op jouw school, kun je altijd en overal snel printen.',
            checklistItems: [
                { id: 'apparaat-weet', label: 'Ik weet welk apparaat ik gebruik (iPad, Chromebook, laptop)' },
                { id: 'systeem-weet', label: 'Ik weet welk printsysteem mijn school gebruikt, of ik heb het gevraagd' },
                { id: 'app-gevonden', label: 'Ik heb de print-app gevonden op mijn apparaat (of de printfunctie in het OS)' },
                { id: 'systeem-naam', label: 'Ik ken de naam van het systeem op mijn school (bijv. RICOH myPrint, PaperCut of FollowMe)' },
            ],
            verificationQuestion: {
                question:
                    'Je hebt op je apparaat gekeken waar de printers staan (Instellingen > Printers, of de print-app). Wat zag je daar?',
                options: [
                    'Een lijst met printers die al zijn ingesteld, plus een knop om een printer toe te voegen',
                    'Een melding dat alleen docenten de printers mogen bekijken',
                    'Meteen een voorbeeld van je laatst geprinte document',
                    'Een lijst met alle leerlingen die vandaag hebben geprint',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Ga terug naar Instellingen > Printers (of je print-app) en kijk goed wat er in dat scherm staat. Kies daarna opnieuw.',
                explanation:
                    'Klopt! Bij Printers zie je welke printers al op je apparaat staan, plus een knop om er een toe te voegen. Staat de schoolprinter er niet tussen, dan moet je hem nog instellen of de naam navragen bij je docent of de IT-helpdesk.',
            },
            teacherCheck: 'Laat je docent zien welk printsysteem jouw school gebruikt.',
        },
        {
            id: 'stap-2-verbinden',
            title: 'Printer instellen',
            instruction:
                'Open de **print-app** van je school of de ingebouwde printfunctie. **iPad:** tik op Deel > Afdrukken en kies de schoolprinter. **Chromebook/Windows:** Ctrl+P in je document en kies de printer. Log in met je **schoolaccount** als dat gevraagd wordt.',
            tip: 'Veel scholen gebruiken een **FollowMe**-systeem (een vrijgave-systeem: je print pas als je je bij de printer aanmeldt): je verstuurt de print naar de server en haalt hem op bij elke printer op school met je pas of pincode. Zo blijft je document privé.',
            checklistItems: [
                { id: 'printer-gevonden', label: 'Ik heb de schoolprinter gevonden in de lijst' },
                { id: 'ingelogd-printer', label: 'Ik ben ingelogd met mijn schoolaccount (als dat nodig was)' },
                { id: 'printer-verbonden', label: 'Mijn apparaat is verbonden met de schoolprinter' },
            ],
            verificationQuestion: {
                question:
                    'Je hebt het printvenster geopend. Wat gebeurt er als je bovenin op de naam van de printer tikt of klikt?',
                options: [
                    'De printopdracht wordt meteen verstuurd',
                    'Er klapt een lijst open met de printers waaruit je kunt kiezen',
                    'Het printvenster sluit en je document wordt opgeslagen',
                    'Je moet je apparaat opnieuw opstarten',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Open het printvenster nog eens en tik echt op de printernaam bovenin; kijk wat er dan gebeurt. Kies daarna opnieuw.',
                explanation:
                    'Precies! Bovenin het printvenster staat de printer die nu gekozen is. Tik of klik je erop, dan zie je alle printers die je apparaat kent — daar kies je de schoolprinter uit.',
            },
        },
        {
            id: 'stap-3-instellingen',
            title: 'Printinstellingen kiezen',
            instruction:
                'Controleer voor het printen de instellingen. Open het **printvenster** (Ctrl+P, Cmd+P of Deel > Afdrukken). Kies **kleur of zwart-wit**, **enkel- of dubbelzijdig** (dubbelzijdig spaart papier, handig voor verslagen) en het **aantal kopieën** (meestal 1). Check ook het **paginabereik**.',
            tip: 'Druk nooit zomaar op "Print" zonder de instellingen te checken. Een foute printopdracht kost papier en inkt — en soms ook tegoed van je **printbudget** (je tegoed om te printen) op school.',
            checklistItems: [
                { id: 'kleur-zwart', label: 'Ik heb gekozen voor kleur of zwart-wit' },
                { id: 'dubbelzijdig', label: 'Ik heb ingesteld of ik enkelzijdig of dubbelzijdig wil printen' },
                { id: 'aantal', label: 'Ik heb het aantal kopieën gecontroleerd (1 tenzij anders nodig)' },
            ],
            verificationQuestion: {
                question:
                    'Kijk in het printvenster naar het paginabereik. Wat staat daar ingevuld voordat jij iets verandert?',
                options: [
                    'Alles — dus alle pagina\'s van je document',
                    'Alleen pagina 1',
                    'Niets, je moet er altijd zelf iets intypen',
                    'De pagina\'s van het document dat je hiervoor printte',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk in het printvenster naar het vakje bij Pagina\'s of Paginabereik, vóórdat je er zelf iets in typt. Kies daarna opnieuw.',
                explanation:
                    'Goed gezien! Standaard staat het paginabereik op alles. Wil je maar een deel printen, dan typ je daar zelf de paginanummers in — dat scheelt papier en inkt.',
            },
        },
        {
            id: 'stap-4-ophalen',
            title: 'Printopdracht versturen en ophalen',
            instruction:
                'Tik op **Afdrukken** of **Print** om de opdracht te versturen. Als jouw school een **FollowMe**- of vrijgave-systeem gebruikt, ga je naar de printer en log je in met je **schoolpas, pincode of schoolaccount**. Zoek je opdracht in de lijst op het display en tik op **Afdrukken** of **Vrijgeven**. Haal je print direct op — verlaten printers kunnen je werk laten zien aan anderen.',
            tip: 'Haal je print altijd meteen op. Niet alleen om privacy-redenen, maar ook om te voorkomen dat je printopdracht uit de wachtrij verdwijnt of iemand anders hem per ongeluk meeneemt.',
            checklistItems: [
                { id: 'opdracht-verstuurd', label: 'Ik heb de printopdracht verstuurd' },
                { id: 'printer-ingelogd', label: 'Ik heb me aangemeld bij de printer (of de opdracht stond direct in de wachtrij)' },
                { id: 'print-opgehaald', label: 'Ik heb mijn print opgehaald bij de printer' },
            ],
            verificationQuestion: {
                question: 'Je hebt op Afdrukken getikt. Wat zie je daarna op je eigen scherm?',
                options: [
                    'Het printvenster sluit en de opdracht is verstuurd; soms zie je kort een melding dat hij in de wachtrij staat',
                    'De printer vraagt eerst of je genoeg papier hebt bijgevuld',
                    'Je document gaat automatisch dicht',
                    'Je krijgt een e-mail met je print als bijlage',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Let op je eigen scherm op het moment dat je op Afdrukken tikt: wat verdwijnt of verschijnt daar? Kies daarna opnieuw.',
                explanation:
                    'Klopt! Zodra je opdracht verstuurd is, verdwijnt het printvenster. Bij een FollowMe- of vrijgave-systeem wacht je print daarna op de server tot je je bij de printer aanmeldt — haal hem meteen op, dan blijft je werk privé.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 60,
            emoji: '🏆',
            title: 'Print Expert',
            color: '#D97848',
        },
        {
            minScore: 40,
            emoji: '🖨️',
            title: 'Print Pro',
            color: '#445865',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#7B8794',
        },
    ],
    learningObjectives: [
        'De leerling herkent welk printsysteem zijn of haar school gebruikt en weet waar die informatie te vinden is.',
        'De leerling verbindt zijn of haar apparaat (iPad, Chromebook of laptop) met de schoolprinter via de juiste app of OS-functie.',
        'De leerling past printinstellingen bewust aan (kleur/zwart-wit, dubbelzijdig, paginabereik) op basis van het document.',
        'De leerling benoemt waarom direct ophalen van een printopdracht bijdraagt aan privacy en betrouwbaarheid.',
    ],
    takeaways: [
        'Je weet hoe je het printsysteem van je school herkent en instelt',
        'Je kunt je apparaat verbinden met de schoolprinter',
        'Je snapt welke printinstellingen je wanneer gebruikt (kleur, dubbelzijdig, aantal)',
        'Je weet hoe je een printopdracht verstuurt en ophaalt',
        'Je begrijpt waarom je printopdracht direct ophalen slim en veilig is',
    ],
};

export default config;
