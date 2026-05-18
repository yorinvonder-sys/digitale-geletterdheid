import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'ai-ethicus',
    title: 'AI Ethicus',
    introEmoji: '⚖️',
    introTitle: 'AI Ethicus',
    introDescription:
        'Een AI-systeem op een school deelt leerlingen automatisch in op niveau — maar sommige groepen worden vaker lager ingedeeld. Is dat eerlijk? En wat moet er aan gedaan worden? Debatteer mee over bias in algoritmes.',
    missionGoal: {
        primaryGoal:
            'Onderzoek AI-bias vanuit meerdere perspectieven en formuleer een verdedigbaar standpunt.',
        criteria: {
            type: 'rounds-complete',
            description:
                'Je leest perspectieven, kiest positie, bouwt argumenten en reflecteert op je mening.',
        },
        evidence:
            'Je standpunt noemt minstens twee argumenten en een gevolg voor leerlingen of school.',
    },
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Bias in AI-systemen op scholen',
    dilemma:
        'Een AI-systeem wijst leerlingen toe aan schoolniveaus. Het systeem is getraind op historische data — en die data bevat ongelijkheid. Is het ethisch om zo\'n systeem te gebruiken?',
    stakeholders: [
        {
            id: 'anouk',
            name: 'Anouk',
            emoji: '👧',
            role: 'Leerling, 14 jaar',
            perspective:
                'Het systeem zette mij op vmbo terwijl mijn basisschoolleraar zei dat ik havo aan zou kunnen. Mijn ouders spreken geen goed Nederlands en mijn postcode is arm. Dat zijn dingen die het systeem meewoog. Ik heb niet eens de kans gekregen om het zelf te bewijzen.',
            keyArgument:
                'Een AI die leert van het verleden, kopieert de ongelijkheid van het verleden. Dat is geen objectiviteit — dat is systematische discriminatie.',
        },
        {
            id: 'berg',
            name: 'Dhr. Berg',
            emoji: '🏫',
            role: 'Schooldirecteur',
            perspective:
                'Dit systeem verwerkt honderden leerlingen per jaar. Zonder AI zouden we dat niet aankunnen. De aanbevelingen zijn niet bindend — een docent kan altijd afwijken. Bovendien is het systeem getraind op grote datasets, dus het is betrouwbaarder dan de gok van één leraar.',
            keyArgument:
                'Een algoritme is consistent en transparant. Een menselijke leraar heeft ook vooroordelen, maar die zijn onzichtbaar en oncontroleerbaar.',
        },
        {
            id: 'chen',
            name: 'Dr. Chen',
            emoji: '🔬',
            role: 'AI-onderzoeker',
            perspective:
                'Er zijn drie soorten bias die hier spelen: historische bias in de trainingsdata, selectiebias bij welke leerlingen überhaupt in de data zitten, en bevestigingsbias doordat het systeem vroeger gedrag als norm ziet. Een systeem kan alleen eerlijk zijn als de data eerlijk is — en die is het nooit volledig.',
            keyArgument:
                'Technische nauwkeurigheid en ethische eerlijkheid zijn twee verschillende dingen. Een systeem kan statistisch kloppen en toch structureel oneerlijk zijn.',
        },
        {
            id: 'meijer',
            name: 'Wethouder Meijer',
            emoji: '🏛️',
            role: 'Gemeentelijk onderwijsambtenaar',
            perspective:
                'De AVG en de EU AI Act stellen eisen aan AI-systemen die mensen beoordelen. Onderwijssystemen vallen onder de categorie "hoog-risico AI". Dat betekent verplichte transparantie, menselijk toezicht en de mogelijkheid tot bezwaar. De vraag is of scholen zich aan die regels houden.',
            keyArgument:
                'Wetgeving dwingt scholen om verantwoording af te leggen. Maar regels werken alleen als ze gehandhaafd worden — en dat ontbreekt nu.',
        },
    ],
    positions: [
        {
            id: 'verboden',
            label: 'Verbieden',
            description: 'AI-systemen mogen nooit zelfstandig beslissen over schoolniveau-indeling. Dat is een menselijke verantwoordelijkheid.',
        },
        {
            id: 'toezicht',
            label: 'Met menselijk toezicht',
            description: 'AI mag adviseren, maar een mens neemt altijd de eindbeslissing en kan gemotiveerd afwijken.',
        },
        {
            id: 'verbeteren',
            label: 'Bias actief aanpakken',
            description: 'AI-systemen mogen worden gebruikt mits aantoonbaar geaudit op bias, met publieke verantwoording en recht op bezwaar.',
        },
        {
            id: 'vrij',
            label: 'Scholen vrij laten kiezen',
            description: 'Scholen mogen zelf beslissen welke tools ze gebruiken. Overregulering remt innovatie in het onderwijs.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Want onderzoek of de wet zegt dat...',
        'Dit raakt met name...',
    ],
    reflectionQuestions: [
        'Wat is het verschil tussen een algoritme dat consistent is en een algoritme dat eerlijk is?',
        'Heeft dit debat je kijk op "objectiviteit" veranderd?',
    ],
    counterArgument:
        '"Menselijke leraren hebben ook vooroordelen — alleen zijn die onzichtbaar. Een algoritme kun je in ieder geval auditen en verbeteren. Door AI te verbieden, vervangen we een controleerbaar systeem door een oncontroleerbaar menselijk oordeel."',
    argumentQualityIndicators: true,
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#0B453F',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#445865',
        },
    ],
    takeaways: [
        'AI leert van historische data — en die data bevat de ongelijkheid van het verleden.',
        'Statistisch nauwkeurig en ethisch eerlijk zijn niet hetzelfde.',
        'De EU AI Act classificeert onderwijssystemen als hoog-risico AI met extra verplichtingen.',
        'Menselijk toezicht is geen formaliteit — het is de kern van verantwoord AI-gebruik.',
    ],
};

export default config;
