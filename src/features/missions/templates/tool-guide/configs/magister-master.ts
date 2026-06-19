import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'magister-master',
    title: 'Magister Meester',
    introEmoji: '📅',
    introTitle: 'Magister Meester',
    introDescription:
        'Open Magister op je iPad en bewijs stap voor stap dat je rooster, huiswerk en cijfers zelf kunt vinden.',
    missionGoal: {
        primaryGoal: 'Ik laat zien dat ik zelfstandig de belangrijkste Magister-onderdelen voor school kan vinden.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier de stappen zijn afgerond met checklist, checkpunt en docentcheck waar nodig.',
        },
        evidence: 'Je toont je startscherm, rooster, huiswerkplek en cijferoverzicht zonder je cijfers hardop te delen.',
    },
    introFeatures: [
        'Inloggen met je schoolaccount in de Magister-app',
        'Je rooster voor vandaag en morgen bekijken',
        'Huiswerk en deadlines opzoeken',
        'Je laatste cijfer terugvinden',
    ],
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
    maxScore: 55,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Magister Expert',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '📅',
            title: 'Magister Meester',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#202023',
        },
    ],
    learningObjectives: [
        'De leerling logt zelfstandig in op de Magister-app met het juiste schoolaccount.',
        'De leerling vindt het rooster voor vandaag en benoemt vak, lokaal en starttijd van de eerste les.',
        'De leerling zoekt huiswerk of opdrachten op in de Agenda of ELO.',
        'De leerling opent het cijferoverzicht en leest de wegingsfactor van het meest recente cijfer.',
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
