import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'magister-master',
    title: 'Magister Meester',
    introEmoji: '📅',
    introTitle: 'Magister Meester',
    introDescription:
        'Open Magister op je iPad en bewijs stap voor stap dat je rooster, huiswerk en cijfers zelf kunt vinden.',
    missionGoal: {
        primaryGoal: 'Laat zien dat je zelfstandig de belangrijkste Magister-onderdelen voor school kunt vinden.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier de stappen zijn afgerond met checklist, checkpunt en docentcheck waar nodig.',
        },
        evidence: 'Je toont je startscherm, rooster, huiswerkplek en cijferoverzicht zonder je cijfers hardop te delen.',
    },
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Spoedcase: toets- of huiswerkbewijs vinden voordat de leerling de stappenlijst ziet.',
        primaryInteraction: 'prioritize-case',
        feedbackMoment: 'Na de gekozen bewijsplek hoort de leerling waarom agenda/huiswerk sterker is dan gokken of rondvragen.',
        visualKit: 'tool-crisis',
        evidenceMoment: 'De leerling toont rooster, huiswerkplek en cijferoverzicht zonder cijfers hardop te noemen.',
        antiBoringRule: 'Start nooit met "open Magister"; start met een herkenbare schoolstress-case en laat Magister het bewijs leveren.',
        chromeAcceptance: 'Introchallenge en alle vier stappen werken op desktop, tablet portrait, tablet landscape en mobile zonder horizontale overflow.',
    },
    introFeatures: [
        'Inloggen met je schoolaccount in de Magister-app',
        'Je rooster voor vandaag en morgen bekijken',
        'Huiswerk en deadlines opzoeken',
        'Je laatste cijfer terugvinden',
    ],
    introChallenge: {
        title: 'Toetsalarm',
        scenario:
            'Je hoort in de pauze dat er morgen misschien een toets is. Je wilt niet gokken of rondvragen, maar zelf het bewijs vinden in Magister.',
        prompt: 'Waar kijk je als eerste om te controleren wat je morgen moet leren?',
        preview: {
            beforeTitle: 'Gokken en rondvragen',
            afterTitle: 'Bewijs in Magister',
            beforeSignals: [
                'Gerucht in de pauze',
                'Cijfers zijn achteraf',
                'Berichten zijn niet altijd compleet',
            ],
            afterSignals: [
                'Rooster voor morgen',
                'Agenda of ELO-opdracht',
                'Deadline bij het vak',
            ],
            evidenceTitle: 'Schoolbewijs',
            evidenceItems: ['Rooster', 'Agenda', 'Huiswerk', 'Privacy bij cijfers'],
        },
        options: [
            {
                id: 'agenda',
                title: 'Agenda of huiswerk',
                description: 'Hier staan opdrachten, deadlines en soms toetsinformatie per vak.',
                correct: true,
                feedback:
                    'Sterke start. Huiswerk en toetsafspraken vind je meestal bij Agenda, ELO of de opdrachtinformatie van het vak. Nu ga je bewijzen dat je die plek zelf kunt vinden.',
            },
            {
                id: 'cijfers',
                title: 'Cijfers',
                description: 'Hier zie je resultaten nadat iets beoordeeld is.',
                correct: false,
                feedback:
                    'Cijfers zijn handig na de toets, maar niet om te weten wat je morgen moet leren. Je start straks bij rooster en huiswerk, zodat je vooruit kunt plannen.',
            },
            {
                id: 'berichten',
                title: 'Alleen berichten',
                description: 'Berichten kunnen helpen, maar niet elke docent zet toetsinformatie daar neer.',
                correct: false,
                feedback:
                    'Berichten kunnen extra uitleg geven, maar zijn niet je eerste bewijsplek. Agenda, ELO en rooster zijn betrouwbaarder om je schooldag te checken.',
            },
        ],
        continueLabel: 'Vind het bewijs',
    },
    toolName: 'Magister',
    toolIcon: '📅',
    steps: [
        {
            id: 'stap-1-inloggen',
            title: 'Inloggen in Magister',
            instruction:
                'Open **Magister** en log in met je **schoolaccount**. Vraag hulp als je je account niet weet.',
            tip: 'Gebruik altijd je schoolaccount om in te loggen, nooit een privé-account. Je schoolaccount geeft je toegang tot je eigen rooster, cijfers en berichten.',
            checklistItems: [
                { id: 'app-gevonden', label: 'Ik heb de Magister-app gevonden op mijn iPad' },
                { id: 'ingelogd', label: 'Ik ben ingelogd met mijn schoolaccount' },
                { id: 'dashboard', label: 'Ik zie het startscherm van Magister' },
            ],
            teacherCheck: 'Laat het startscherm van Magister kort aan je docent zien voordat je doorgaat.',
            verificationQuestion: {
                question: 'Met welk account log je in bij Magister?',
                options: [
                    'Mijn persoonlijke Gmail of iCloud-account',
                    'Mijn schoolaccount dat school aan mij heeft gegeven',
                    'Een nieuw account dat ik zelf aanmaak',
                    'Het account van mijn ouders',
                ],
                correctIndex: 1,
                explanation:
                    'Precies! Je logt altijd in met het schoolaccount dat school aan jou heeft gegeven. Zo zijn je gegevens veilig en kun je alleen jouw eigen rooster en cijfers zien.',
            },
        },
        {
            id: 'stap-2-rooster',
            title: 'Rooster bekijken',
            instruction:
                'Open je **rooster**. Zoek je eerste les van vandaag en kijk welk vak, lokaal en starttijd erbij staan.',
            tip: 'Het rooster kan soms veranderen door uitval of lokaalwijzigingen. Check Magister elke ochtend even — dan sta je nooit voor een verrassing.',
            checklistItems: [
                { id: 'kalender-open', label: 'Ik heb het kalender-icoon gevonden' },
                { id: 'eerste-les', label: 'Ik weet welk vak mijn eerste les vandaag is' },
                { id: 'lokaal', label: 'Ik weet in welk lokaal ik moet zijn' },
            ],
            teacherCheck: 'Laat je docent je eerste les of roosterregel aanwijzen op je scherm.',
            verificationQuestion: {
                question: 'Waarom is het slim om elke ochtend je rooster in Magister te checken?',
                options: [
                    'Omdat je dan punten verdient in Magister',
                    'Omdat het rooster soms verandert door uitval of lokaalwijzigingen',
                    'Omdat je anders geen toegang hebt tot je cijfers',
                    'Omdat de app anders uitlogt',
                ],
                correctIndex: 1,
                explanation:
                    'Goed! Het rooster kan dagelijks veranderen. Een docent kan ziek zijn, een lokaal kan bezet zijn — in Magister zie je die wijzigingen altijd het eerst.',
            },
        },
        {
            id: 'stap-3-huiswerk',
            title: 'Huiswerk opzoeken',
            instruction:
                'Open **Agenda** of **ELO**. Zoek één vak met huiswerk of controleer bewust dat er niets klaarstaat.',
            tip: 'Sommige docenten zetten huiswerk in de ELO van Magister, anderen gebruiken Teams of Classroom. Als je niks ziet in Magister, vraag je docent waar hij of zij huiswerk plaatst.',
            checklistItems: [
                { id: 'agenda-open', label: 'Ik heb de Agenda of ELO geopend' },
                { id: 'huiswerk-gevonden', label: 'Ik heb huiswerk van één vak gevonden (of gezien dat er geen staat)' },
                { id: 'deadline', label: 'Ik weet voor wanneer het huiswerk ingeleverd moet worden' },
            ],
            teacherCheck: 'Laat je docent zien waar jij huiswerk of opdrachten terugvindt.',
        },
        {
            id: 'stap-4-cijfers',
            title: 'Cijfers bekijken',
            instruction:
                'Open **Cijfers**. Zoek je meest recente cijfer en bekijk bij welk vak en welke weging het hoort.',
            tip: 'Een cijfer met een hoge weging telt zwaarder mee voor je rapportcijfer. In Magister zie je bij elk cijfer hoeveel het weegt. Let daar goed op!',
            checklistItems: [
                { id: 'cijfers-open', label: 'Ik heb het tabblad Cijfers geopend' },
                { id: 'laatste-cijfer', label: 'Ik weet wat mijn laatste cijfer is en voor welk vak' },
                { id: 'weging', label: 'Ik heb de wegingsfactor van dat cijfer bekeken' },
            ],
            teacherCheck: 'Laat je docent zien dat je het cijferoverzicht kunt openen. Je hoeft geen cijfer hardop te noemen.',
            verificationQuestion: {
                question: 'Wat betekent de wegingsfactor bij een cijfer in Magister?',
                options: [
                    'Hoe moeilijk de toets was',
                    'Hoeveel het cijfer meetelt voor je rapportcijfer',
                    'Hoeveel leerlingen dezelfde toets hebben gemaakt',
                    'Hoe lang je over de toets hebt gedaan',
                ],
                correctIndex: 1,
                explanation:
                    'Juist! De wegingsfactor laat zien hoe zwaar een cijfer meetelt voor je uiteindelijke rapportcijfer. Een cijfer met weging 2 telt dubbel zo zwaar als een cijfer met weging 1.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Magister Expert',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '📅',
            title: 'Magister Meester',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#5F947D',
        },
    ],
    takeaways: [
        'Je kunt inloggen in de Magister-app met je schoolaccount',
        'Je weet hoe je je rooster voor vandaag en morgen bekijkt',
        'Je kunt huiswerk en deadlines opzoeken in de Agenda of ELO',
        'Je weet hoe je je laatste cijfers terugvindt en de wegingsfactor leest',
        'Je begrijpt waarom je Magister dagelijks even checkt',
    ],
};

export default config;
