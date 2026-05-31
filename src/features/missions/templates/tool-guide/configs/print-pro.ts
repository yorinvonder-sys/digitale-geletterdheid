import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'print-pro',
    title: 'Print Pro',
    introEmoji: '🖨️',
    introTitle: 'Print Pro',
    introDescription:
        'Leer printen op school, stap voor stap. Je ontdekt hoe je je apparaat verbindt met de schoolprinter, de juiste instellingen kiest en je printopdracht verstuurt.',
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Printercrisis: voorkom dat de opdracht verkeerd, te vaak of in de verkeerde kleur uit de printer komt.',
        primaryInteraction: 'choose-with-consequence',
        feedbackMoment: 'Na de gekozen instelling hoort de leerling welk printprobleem daarmee wordt voorkomen.',
        visualKit: 'tool-crisis',
        evidenceMoment: 'De leerling kan printer, aantal kopieen, kleurinstelling en ophaal/inleverstap uitleggen.',
        antiBoringRule: 'Printen wordt alleen interessant als een verkeerde instelling direct voelbare gevolgen heeft.',
        chromeAcceptance: 'Printer-op-hol challenge en stapkaarten blijven bedienbaar zonder sticky button overlap op mobile.',
    },
    introFeatures: [
        'Het printsysteem van je school herkennen',
        'Je apparaat verbinden met de schoolprinter',
        'De juiste printinstellingen kiezen (kleur, dubbelzijdig)',
        'Een printopdracht versturen en ophalen',
    ],
    introChallenge: {
        title: 'Printer op hol',
        scenario:
            'Je wilt een verslag van 4 pagina\'s printen. In het printvenster staat per ongeluk: 28 kopieen, enkelzijdig, kleur.',
        prompt: 'Welke instelling moet je als eerste controleren om de grootste print-ramp te voorkomen?',
        preview: {
            beforeTitle: 'Risico: papierberg',
            afterTitle: 'Veilig: slim printen',
            beforeSignals: [
                '28 kopieen',
                'Enkelzijdig',
                'Kleur aan',
            ],
            afterSignals: [
                '1 kopie',
                'Dubbelzijdig',
                'Zwart-wit waar het kan',
            ],
            evidenceTitle: 'Printbewijs',
            evidenceItems: ['Aantal', 'Dubbelzijdig', 'Kleurmodus', 'Privacy'],
        },
        options: [
            {
                id: 'kopieen',
                title: 'Aantal kopieen',
                description: 'Van 28 terug naar 1 voordat je op print drukt.',
                correct: true,
                feedback:
                    'Precies. Het aantal kopieen is de grootste rampmaker. Daarna check je dubbelzijdig, kleur en de juiste printer.',
            },
            {
                id: 'kleur',
                title: 'Kleur of zwart-wit',
                description: 'Belangrijk voor kosten en inkt, maar niet de grootste fout hier.',
                correct: false,
                feedback:
                    'Kleur is belangrijk, maar 28 kopieen is de grootste fout. Eerst voorkom je verspilling, daarna maak je de rest netjes.',
            },
            {
                id: 'bestandsnaam',
                title: 'Bestandsnaam',
                description: 'Handig om je document terug te vinden, maar het verandert de printopdracht niet.',
                correct: false,
                feedback:
                    'Een goede bestandsnaam helpt later, maar voorkomt geen papierberg. Je gaat nu leren welke printinstellingen echt tellen.',
            },
        ],
        continueLabel: 'Stop de print-ramp',
    },
    toolName: 'Schoolprinter',
    toolIcon: '🖨️',
    steps: [
        {
            id: 'stap-1-systeem',
            title: 'Printsysteem herkennen',
            instruction:
                'Elke school gebruikt een eigen printsysteem. Kijk eerst welk **apparaat** je gebruikt: iPad, Chromebook, Windows-laptop of Mac. Zoek daarna uit welk **printsysteem** jullie school heeft. Kijk in de App Library op je iPad naar apps als **RICOH myPrint**, **PaperCut**, of **FollowMe**. Op een laptop ga je naar Instellingen > Printers. Weet je het niet? Vraag je docent of de IT-helpdesk van school.',
            tip: 'Je hoeft het printsysteem maar één keer in te stellen. Als je weet hoe het werkt op jouw school, kun je altijd en overal snel printen.',
            checklistItems: [
                { id: 'apparaat-weet', label: 'Ik weet welk apparaat ik gebruik (iPad, Chromebook, laptop)' },
                { id: 'systeem-weet', label: 'Ik weet welk printsysteem mijn school gebruikt, of ik heb het gevraagd' },
                { id: 'app-gevonden', label: 'Ik heb de print-app gevonden op mijn apparaat (of de printfunctie in het OS)' },
            ],
            verificationQuestion: {
                question: 'Hoe kom je erachter welk printsysteem jouw school gebruikt?',
                options: [
                    'Dat staat altijd op de printer zelf, nergens anders',
                    'Door te kijken in de App Library, of door het te vragen aan je docent of IT-helpdesk',
                    'Door gewoon te printen — het systeem kiest zichzelf',
                    'Door een nieuwe app te installeren',
                ],
                correctIndex: 1,
                explanation:
                    'Precies! Je kijkt in de App Library of in de Instellingen van je apparaat, of je vraagt het gewoon aan je docent of de IT-helpdesk. Die weten precies welk systeem de school gebruikt.',
            },
        },
        {
            id: 'stap-2-verbinden',
            title: 'Printer instellen',
            instruction:
                'Open de **print-app** van je school (bijv. RICOH myPrint, PaperCut of FollowMe) of gebruik de ingebouwde printfunctie van je apparaat. **iPad:** Open een document en tik op Deel > Afdrukken — kies dan de schoolprinter. **Chromebook:** Open een document en kies Afdrukken (Ctrl+P), selecteer de printer. **Windows:** Ctrl+P in je document, kies de printer in de lijst. Log in met je **schoolaccount** als de app daarom vraagt.',
            tip: 'Veel scholen gebruiken een "FollowMe"-systeem: je verstuurt de print naar de server en haalt hem op bij elke printer op school met je pas of pincode. Zo blijft je document privé.',
            checklistItems: [
                { id: 'printer-gevonden', label: 'Ik heb de schoolprinter gevonden in de lijst' },
                { id: 'ingelogd-printer', label: 'Ik ben ingelogd met mijn schoolaccount (als dat nodig was)' },
                { id: 'printer-verbonden', label: 'Mijn apparaat is verbonden met de schoolprinter' },
            ],
        },
        {
            id: 'stap-3-instellingen',
            title: 'Printinstellingen kiezen',
            instruction:
                'Voordat je print, controleer je de instellingen. Open het **printvenster** (Ctrl+P, Cmd+P of Deel > Afdrukken). Stel in: **Kleur of zwart-wit** (zwart-wit is goedkoper en spaart inkt), **Enkelzijdig of dubbelzijdig** (dubbelzijdig spaart papier — gebruik dit voor verslagen), en het **aantal kopieën** (normaal: 1). Kijk ook naar het **paginabereik** — wil je alle pagina\'s printen of alleen bepaalde?',
            tip: 'Druk nooit zomaar op "Print" zonder de instellingen te checken. Een fout printopdracht kost papier en inkt — en soms ook geld van je printbudget op school.',
            checklistItems: [
                { id: 'kleur-zwart', label: 'Ik heb gekozen voor kleur of zwart-wit' },
                { id: 'dubbelzijdig', label: 'Ik heb ingesteld of ik enkelzijdig of dubbelzijdig wil printen' },
                { id: 'aantal', label: 'Ik heb het aantal kopieën gecontroleerd (1 tenzij anders nodig)' },
            ],
            verificationQuestion: {
                question: 'Wanneer gebruik je dubbelzijdig afdrukken?',
                options: [
                    'Nooit, want dubbelzijdig is moeilijker te lezen',
                    'Altijd, ook voor losse aantekeningen van één pagina',
                    'Bij langere documenten zoals verslagen, om papier te sparen',
                    'Alleen als de printer dat automatisch doet',
                ],
                correctIndex: 2,
                explanation:
                    'Goed gedacht! Dubbelzijdig printen gebruik je bij documenten van meerdere pagina\'s — zoals verslagen of samenvattingen. Dat spaart papier en is beter voor het milieu. Voor een losse pagina is het niet nodig.',
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
                question: 'Waarom is het belangrijk om je print direct op te halen bij de printer?',
                options: [
                    'Omdat de printer anders automatisch stopt',
                    'Vanwege je privacy en omdat de opdracht anders uit de wachtrij kan verdwijnen',
                    'Omdat je anders extra moet betalen voor wachttijd',
                    'Omdat andere leerlingen dan ook jouw opdracht kunnen bewerken',
                ],
                correctIndex: 1,
                explanation:
                    'Juist! Je print bevat jouw werk — misschien met persoonlijke informatie. Haal hem direct op voor je privacy. Bovendien kunnen sommige systemen onafgehaalde opdrachten automatisch verwijderen.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Print Expert',
            color: '#445865',
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
            color: '#5F947D',
        },
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
