import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'tech-court',
    title: 'Tech Court',
    introEmoji: '⚖️',
    introTitle: 'Tech Court',
    introDescription:
        'Een groot techbedrijf wordt aangeklaagd omdat hun AI-systeem vrouwen en mensen met een niet-westerse naam systematisch lager beoordeelt bij sollicitaties. Jij staat in de rechtszaal. Wie heeft gelijk?',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'AI-discriminatie bij sollicitaties',
    dilemma:
        'Een techbedrijf gebruikt AI om cv\'s te beoordelen. Het systeem scoort kandidaten met vrouwelijke namen en namen met een niet-westerse herkomst significant lager — zonder dat de programmeurs dit hebben bedoeld. Is het bedrijf schuldig aan discriminatie?',
    stakeholders: [
        {
            id: 'nadia',
            name: 'Nadia',
            emoji: '👩',
            role: 'Sollicitante, aanklager',
            perspective:
                'Ik heb exact dezelfde opleiding en ervaring als een mannelijke kandidaat met een Nederlandse naam. Toch werd hij uitgenodigd en ik niet. Pas later bleek dat het systeem mijn naam als negatief signaal beschouwde omdat het getraind was op cv\'s van mensen die al werden aangenomen — en dat waren bijna allemaal mannen.',
            keyArgument:
                'Intentie maakt discriminatie niet minder erg. Het resultaat telt: ik ben afgewezen op basis van kenmerken die niets met mijn geschiktheid te maken hebben.',
        },
        {
            id: 'verburg',
            name: 'Mr. Verburg',
            emoji: '👔',
            role: 'Advocaat van het techbedrijf',
            perspective:
                'Het systeem kijkt alleen naar objectieve indicatoren: studieresultaten, werkervaring, vaardigheden. Het is nooit geprogrammeerd om op geslacht of naam te selecteren. Als er correlaties zijn, reflecteert dat de realiteit van de arbeidsmarkt — geen opzettelijke discriminatie van onze kant.',
            keyArgument:
                'Een bedrijf kan niet aansprakelijk worden gesteld voor statistieken in historische data die het systeem heeft geleerd. Er is geen opzet, geen kwade wil.',
        },
        {
            id: 'rechter',
            name: 'Rechter De Boer',
            emoji: '👨‍⚖️',
            role: 'Rechter',
            perspective:
                'De gelijkebehandelingswet verbiedt zowel directe als indirecte discriminatie. Indirect discrimineren — waarbij een neutrale maatregel in de praktijk bepaalde groepen benadeelt — is ook strafbaar. De vraag is of het bedrijf wist of had moeten weten dat het systeem discriminerende uitkomsten produceerde.',
            keyArgument:
                'Het recht onderscheidt intentie en effect. Indirecte discriminatie hoeft niet opzettelijk te zijn om verboden te zijn.',
        },
        {
            id: 'expert',
            name: 'Dr. Fontein',
            emoji: '🔬',
            role: 'Onafhankelijk AI-expert',
            perspective:
                'Dit is een klassiek geval van historische bias. Het systeem leerde van cv\'s van mensen die al waren aangenomen — en die groep was door historische ongelijkheid al niet representatief. De fout zat niet in de bedoeling maar in de methode: je kunt geen eerlijk systeem bouwen op oneerlijke data zonder correcties.',
            keyArgument:
                'Techbedrijven hebben een plicht om systemen te auditen op discriminerende uitkomsten voordat ze worden ingezet. Die plicht bestaat los van intentie.',
        },
    ],
    positions: [
        {
            id: 'schuldig',
            label: 'Schuldig — resultaat telt',
            description: 'Het bedrijf is schuldig aan indirecte discriminatie. Intentie doet er niet toe als het effect aantoonbaar discriminerend is.',
        },
        {
            id: 'niet-schuldig',
            label: 'Niet schuldig — geen opzet',
            description: 'Zonder opzet is er geen schuld. Het bedrijf heeft geprobeerd een goed systeem te bouwen en kan niet aansprakelijk zijn voor historische dataproblemen.',
        },
        {
            id: 'gedeelde-schuld',
            label: 'Gedeelde verantwoordelijkheid',
            description: 'Het bedrijf heeft een fout gemaakt, maar ook de wet had duidelijker moeten zijn over AI-verplichtingen. Verantwoordelijkheid is gedeeld.',
        },
        {
            id: 'systeem-kwestie',
            label: 'Systeemfalen, niet individueel',
            description: 'Het echte probleem is structurele ongelijkheid in de arbeidsmarkt. Dat is een maatschappelijk probleem dat niet op één bedrijf kan worden afgewenteld.',
        },
    ],
    argumentPrompts: [
        'Mijn sterkste argument is...',
        'Het bewijs daarvoor is...',
        'Het tegenargument dat ik weerleg is...',
    ],
    reflectionQuestions: [
        'Maakt het uit of een bedrijf bewust of onbewust discrimineert? Waarom wel of niet?',
        'Wat zou jij als rechter anders doen dan je debatpartner?',
    ],
    counterArgument:
        '"Als bedrijven aansprakelijk zijn voor elke onbedoelde correlatie in hun systemen, stopt innovatie. Elk systeem dat leert van historische data zal imperfecties hebben. Perfectie als eis maakt AI onmogelijk — en dan blijven we achter terwijl andere landen vooruitlopen."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#DC2626',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#B91C1C',
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
        'De wet verbiedt zowel directe als indirecte discriminatie — ook als er geen opzet is.',
        'Historische data bevat historische ongelijkheid. AI die daar niet op corrigeert, bestendigt die ongelijkheid.',
        'De EU AI Act verplicht bedrijven om hoog-risico systemen te auditen vóór inzet.',
        'Een goed argument heeft altijd drie componenten: standpunt, bewijs en weerlegging van het tegenargument.',
    ],
};

export default config;
