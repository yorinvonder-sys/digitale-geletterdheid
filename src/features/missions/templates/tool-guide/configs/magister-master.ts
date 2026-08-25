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
                question: 'Wat vroeg de Magister-app als allereerste, nog vóór je gebruikersnaam en wachtwoord?',
                options: [
                    'Mijn geboortedatum',
                    'De naam van mijn school',
                    'In welke klas ik zit',
                    'Mijn e-mailadres van thuis',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk terug naar het eerste scherm van de app, vóór het inlogscherm. Kies daarna opnieuw.',
                explanation:
                    'Klopt! De app vraagt eerst welke school je hebt, want elke school heeft een eigen Magister. Daarna log je in met je schoolaccount.',
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
                question: 'Wat staat er in jouw rooster bij de les die je net hebt opgezocht, behalve de naam van het vak?',
                options: [
                    'Het cijfer dat je voor dat vak hebt',
                    'De starttijd en het lokaal',
                    'De namen van de leerlingen die naast je zitten',
                    'Hoeveel huiswerk je nog open hebt staan',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk nog een keer naar de balk van die les in je rooster. Kies daarna opnieuw.',
                explanation:
                    'Goed gekeken! Bij elke les staat wanneer die begint en in welk lokaal je moet zijn. Daarom check je je rooster elke ochtend: die tijd of dat lokaal kan veranderd zijn.',
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
            verificationQuestion: {
                question: 'Hoe zag je in de Agenda of ELO voor wanneer het huiswerk af moet zijn?',
                options: [
                    'Er loopt een timer die aftelt tot de deadline',
                    'Het staat bij de dag of datum waarop het in de agenda is gezet',
                    'Het staat onderaan bij mijn cijfers',
                    'Je krijgt elke ochtend een telefoontje van de docent',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk waar het huiswerkitem precies staat in je agenda. Kies daarna opnieuw.',
                explanation:
                    'Precies! Huiswerk staat bij de dag waarop het af moet zijn. Zo zie je in één oogopslag wat er wanneer klaar moet zijn.',
            },
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
                question: 'Wat zag je in het cijferoverzicht bij jouw laatste cijfer staan?',
                options: [
                    'Het gemiddelde cijfer van mijn hele klas',
                    'Het vak en hoe zwaar dit cijfer meetelt (de weging)',
                    'Hoeveel klasgenoten een hoger cijfer hadden',
                    'Hoeveel minuten ik over de toets heb gedaan',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk nog eens naar de regel van je laatste cijfer. Kies daarna opnieuw.',
                explanation:
                    'Juist! Bij elk cijfer staat het vak en de weging. Die weging laat zien hoe zwaar dat cijfer meetelt voor je rapportcijfer: weging 2 telt dubbel zo zwaar als weging 1.',
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
