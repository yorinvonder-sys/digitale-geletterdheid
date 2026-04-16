import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'magister-master',
    title: 'Magister Meester',
    introEmoji: '📅',
    introTitle: 'Magister Meester',
    introDescription:
        'Leer de Magister-app kennen op je iPad. Je vindt je rooster, checkt je huiswerk en bekijkt je laatste cijfers — in minder dan een minuut.',
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
                'Open de **Magister**-app op je iPad. Je vindt hem op het beginscherm of in de App Library. Tik op **Inloggen** en voer je **schoolaccount** in — dat is het e-mailadres dat school aan jou heeft gegeven (eindigt op @leerling.schoolnaam.nl of iets vergelijkbaars). Weet je het niet? Vraag je docent of kijk in de brief die je bij de start van het schooljaar hebt gekregen.',
            tip: 'Gebruik altijd je schoolaccount om in te loggen, nooit een privé-account. Je schoolaccount geeft je toegang tot je eigen rooster, cijfers en berichten.',
            checklistItems: [
                { id: 'app-gevonden', label: 'Ik heb de Magister-app gevonden op mijn iPad' },
                { id: 'ingelogd', label: 'Ik ben ingelogd met mijn schoolaccount' },
                { id: 'dashboard', label: 'Ik zie het startscherm van Magister' },
            ],
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
                'Tik onderin het scherm op het **kalender-icoon** (of op "Vandaag"). Je ziet nu je lessen van vandaag. Zoek de **eerste les** van vandaag op: welk vak is het, in welk lokaal, en hoe laat begint het? Tik op de les om meer details te zien. Blader ook naar morgen door naar rechts te vegen of op de pijl te tikken.',
            tip: 'Het rooster kan soms veranderen door uitval of lokaalwijzigingen. Check Magister elke ochtend even — dan sta je nooit voor een verassing.',
            checklistItems: [
                { id: 'kalender-open', label: 'Ik heb het kalender-icoon gevonden' },
                { id: 'eerste-les', label: 'Ik weet welk vak mijn eerste les vandaag is' },
                { id: 'lokaal', label: 'Ik weet in welk lokaal ik moet zijn' },
            ],
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
                'Tik op **"Vandaag"** of ga naar het tabblad **"Agenda"** of **"ELO"** (elke school ziet dit iets anders). Je ziet hier een overzicht van huiswerk, opdrachten en deadlines per vak. Zoek een vak waarbij huiswerk staat. Tik erop om de volledige beschrijving te lezen. Maak een foto van het huiswerk met je eigen ogen — of schrijf het op — zodat je het ook offline weet.',
            tip: 'Sommige docenten zetten huiswerk in de ELO van Magister, anderen gebruiken Teams of Classroom. Als je niks ziet in Magister, vraag je docent waar hij of zij huiswerk plaatst.',
            checklistItems: [
                { id: 'agenda-open', label: 'Ik heb de Agenda of ELO geopend' },
                { id: 'huiswerk-gevonden', label: 'Ik heb huiswerk van één vak gevonden (of gezien dat er geen staat)' },
                { id: 'deadline', label: 'Ik weet voor wanneer het huiswerk ingeleverd moet worden' },
            ],
        },
        {
            id: 'stap-4-cijfers',
            title: 'Cijfers bekijken',
            instruction:
                'Tik op het tabblad **"Cijfers"** (onderaan of in het menu). Je ziet een overzicht van al je vakken en de laatste cijfers die zijn ingevoerd. Zoek je **meest recente cijfer** op — klik erop voor meer details zoals de wegingsfactor en de omschrijving van de toets. Controleer ook of er cijfers zijn die je nog niet had gezien.',
            tip: 'Een cijfer met een hoge weging telt zwaarder mee voor je rapportcijfer. In Magister zie je bij elk cijfer hoeveel het weegt. Let daar goed op!',
            checklistItems: [
                { id: 'cijfers-open', label: 'Ik heb het tabblad Cijfers geopend' },
                { id: 'laatste-cijfer', label: 'Ik weet wat mijn laatste cijfer is en voor welk vak' },
                { id: 'weging', label: 'Ik heb de wegingsfactor van dat cijfer bekeken' },
            ],
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
            color: '#3B82F6',
        },
        {
            minScore: 40,
            emoji: '📅',
            title: 'Magister Meester',
            color: '#6366F1',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#10B981',
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
