import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'review-week-3',
    title: 'De Ethische Raad',
    introEmoji: '⚖️',
    introTitle: 'De Ethische Raad',
    introDescription:
        'We lanceren een groot AI-project — maar mag alles wat kan? Jij bent lid van de Ethische Raad. Drie dossiers liggen op tafel: over privacy, bias en eerlijkheid. Debatteer mee over de grenzen van technologie.',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Ethiek van AI-projecten op school',
    dilemma:
        'Een schoolteam wil een AI-systeem lanceren dat leerlingfoto\'s verzamelt, niveaus voorspelt en eindverslagen beoordeelt. Technisch is het mogelijk. Maar is het ook ethisch verantwoord?',
    stakeholders: [
        {
            id: 'yara',
            name: 'Yara',
            emoji: '👧',
            role: 'Leerling en privacy-bewuste gebruiker',
            perspective:
                'Ik gebruik social media en ik weet dat mijn foto\'s openbaar zijn. Maar "openbaar" betekent niet dat iedereen ze mag gebruiken voor wat ze willen. Als iemand mijn foto gebruikt om een AI te trainen zonder mijn toestemming, is dat een schending van mijn recht op mijn eigen afbeelding.',
            keyArgument:
                'Openbaar betekent niet vrij beschikbaar voor elk doel. Toestemming is een grondrecht, ook bij openbare informatie.',
        },
        {
            id: 'bouwer',
            name: 'Sander',
            emoji: '💻',
            role: 'Leerling-projectleider',
            perspective:
                'We hebben een maand gewerkt aan ons AI-systeem. We scrapen alleen openbare profielen, het niveau-model is gebaseerd op bestaande data en ChatGPT helpt ons bij het nakijken. Alles is technisch mogelijk. Ik snap het probleem niet — niemand wordt er slechter van.',
            keyArgument:
                'Als we elk mogelijk bezwaar moeten wegnemen voordat we iets bouwen, bouwen we nooit iets. Innovatie vereist enig risico.',
        },
        {
            id: 'raadslid',
            name: 'Dr. Okonkwo',
            emoji: '⚖️',
            role: 'Voorzitter Ethische Raad',
            perspective:
                'Drie toetsen: Is het legaal? Is het eerlijk? Is het transparant? Bij het scrapen van foto\'s: nee, niet zonder toestemming. Bij het niveau-model: als de trainingsdata historische ongelijkheid bevat, reproduceert het systeem die ongelijkheid. Bij AI-beoordeling: wie is er aansprakelijk als een AI een leerling onterecht afwijst?',
            keyArgument:
                'Technologie die legale, ethische en transparantie-toetsen niet doorstaat, mag niet worden ingezet — ook niet als het technisch kan.',
        },
        {
            id: 'docent',
            name: 'Mevrouw Groot',
            emoji: '👩‍🏫',
            role: 'Begeleidend docent',
            perspective:
                'Ik ben trots op wat dit team heeft gebouwd. Maar mijn taak is ook om te leren dat technologie verantwoord worden ingezet. ChatGPT gebruiken als copiloot bij het schrijven: prima. ChatGPT een verslag laten schrijven en dat als eigen werk inleveren: dat is plagiaat, en het ondermijnt wat leren betekent.',
            keyArgument:
                'AI als tool is krachtig. AI als vervanger voor jouw eigen denken is een gemiste leerkans — en oneerlijk tegenover je klasgenoten.',
        },
    ],
    positions: [
        {
            id: 'stoppen',
            label: 'Project stopzetten',
            description: 'Het project voldoet niet aan privacy-, ethische en eerlijkheidseisen. Stoppen en opnieuw beginnen met een ethisch verantwoord ontwerp.',
        },
        {
            id: 'aanpassen',
            label: 'Aanpassen met voorwaarden',
            description: 'Het project mag doorgaan als foto\'s worden verwijderd, het niveau-model wordt geaudit op bias en AI-beoordeling menselijk wordt gecontroleerd.',
        },
        {
            id: 'doorgaan',
            label: 'Doorgaan — voordelen wegen zwaarder',
            description: 'De voordelen van het systeem wegen op tegen de risico\'s. Met kleine aanpassingen is het project verantwoord.',
        },
        {
            id: 'apart-beoordelen',
            label: 'Elk dossier apart beoordelen',
            description: 'De drie ethische kwesties — foto\'s scrapen, niveau-model, AI-beoordeling — zijn los van elkaar te beoordelen en vereisen elk een eigen beslissing.',
        },
    ],
    argumentPrompts: [
        'Mijn advies aan de Ethische Raad is...',
        'De reden daarvoor is...',
        'De waarde die ik het zwaarst laat wegen is...',
    ],
    reflectionQuestions: [
        'Welke van de drie dossiers vind jij het ernstigst? Waarom?',
        'Is er een situatie waarbij je het project wel volledig zou goedkeuren? Onder welke voorwaarden?',
    ],
    counterArgument:
        '"Als we dit project afkeuren, sturen we de boodschap dat technologie niet mag worden uitgeprobeerd. Dat maakt leerlingen bang om te experimenteren. Fouten maken is onderdeel van leren — ook ethische fouten. Beter nu leren van een fout in een veilige schoolomgeving dan later in de echte wereld."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#E8956F',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#D97757',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#10B981',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#6B6B66',
        },
    ],
    takeaways: [
        'Openbaar betekent niet automatisch vrij te gebruiken — toestemming is een apart vereiste.',
        'Drie ethische toetsen: Is het legaal? Is het eerlijk? Is het transparant?',
        'AI als copiloot is een krachtig hulpmiddel; AI als vervanger van je eigen denken is plagiaat.',
        'Bias in trainingsdata reproduceert ongelijkheid — ook als het niet de bedoeling was.',
    ],
};

export default config;
