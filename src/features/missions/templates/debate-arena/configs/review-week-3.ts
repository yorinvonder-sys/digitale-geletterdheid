import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'review-week-3',
    title: 'De Ethische Raad',
    introEmoji: '⚖️',
    introTitle: 'De Ethische Raad',
    introDescription:
        'Je hebt je project gemaakt en gelanceerd. Nu stelt de Ethische Raad de vraag die er écht toe doet: mag jouw project bestaan zoals het nu is? Je past drie ethische toetsen toe op je eigen werk — is het legaal, eerlijk en transparant? — en laat zien dat je een bewuste digitale burger bent, óók als maker.',
    introFeatures: [
        'Lees de drie ethische toetsen en wie ze bewaakt',
        'Geef je eerlijke oordeel over je eigen project',
        'Onderbouw waarom het legaal, eerlijk en transparant is',
        'Reageer op een stevig tegenargument',
        'Reflecteer: wat zou je nog aanpassen?',
    ],
    topic: 'De drie ethische toetsen op je eigen eindproject',
    dilemma:
        'Jouw P4-project staat klaar om gelanceerd te worden. Drie dossiers liggen op tafel — over jóuw project: Is het LEGAAL? Is het EERLIJK? Is het TRANSPARANT? De Ethische Raad wil jouw eigen onderbouwing horen.',
    stakeholders: [
        {
            id: 'avg-advocaat',
            name: 'AVG-advocaat',
            emoji: '⚖️',
            role: 'Privacy- en wetgevingsspecialist',
            perspective:
                'Ik bekijk jouw project door de bril van de wet (de AVG — de Europese privacywet). Verwerk jij persoonsgegevens — namen, foto\'s, e-mailadressen? Dan moet je kunnen aantonen dat je toestemming hebt én dat duidelijk is wie verantwoordelijk is voor die gegevens. "Ik dacht dat het mocht" is geen verdediging als de rechter ernaar kijkt.',
            keyArgument:
                'Legaal betekent: ook als een rechter ernaar kijkt, klopt het — niet "waarschijnlijk mag het".',
        },
        {
            id: 'eerlijkheidsrechter',
            name: 'Eerlijkheidsrechter',
            emoji: '🔍',
            role: 'Ethicus voor eerlijkheid en bias',
            perspective:
                'Mijn vraag aan jou: werkt jouw project voor iedereen even goed? Sluit het bepaalde leerlingen buiten — misschien per ongeluk? Werkt het bijvoorbeeld ook voor leerlingen met dyslexie? En als je iemand met een beperking jouw project zou laten gebruiken, zou het dan ook voor hem of haar werken?',
            keyArgument:
                'Eerlijk betekent: niemand wordt systematisch benadeeld door jouw project — ook niet per ongeluk.',
        },
        {
            id: 'transparantie-officier',
            name: 'Transparantie-officier',
            emoji: '🪟',
            role: 'Expert in openheid en verantwoording',
            perspective:
                'Ik wil weten of een gewone gebruiker begrijpt wat jouw project doet. Weet diegene of er AI in zit? Weet diegene wat er met eventuele gegevens gebeurt? Als je dat alleen kunt uitleggen door je code te laten lezen, is jouw project niet transparant genoeg.',
            keyArgument:
                'Transparant betekent: een gebruiker begrijpt hoe jouw project werkt zonder de broncode te lezen.',
        },
        {
            id: 'ai-copiloot-bewaker',
            name: 'AI-Copiloot Bewaker',
            emoji: '🤖',
            role: 'Bewaker van eerlijk AI-gebruik',
            perspective:
                'Heb jij AI ingezet bij het maken van dit project? Dan wil ik weten: heb je AI-tekst als eigen werk ingeleverd, of heb je het bewerkt en aangevuld met jouw eigen denken? En als je AI-gegenereerde afbeeldingen hebt gebruikt — staat er bij de bron dat AI die heeft gemaakt?',
            keyArgument:
                'AI als copiloot is krachtig. AI als vervanger van je eigen denken ondermijnt waarom je het maakt.',
        },
    ],
    positions: [
        {
            id: 'voldoet',
            label: 'Mijn project voldoet aan alle drie de toetsen',
            description: 'Legaal, eerlijk én transparant — en ik kan dat onderbouwen.',
        },
        {
            id: 'aanpassen',
            label: 'Mijn project heeft aanpassingen nodig',
            description: 'Op één of meer toetsen scoort het nog niet goed genoeg. Ik benoem wat ik aanpas.',
        },
        {
            id: 'grijszone',
            label: 'Mijn project zit in een grijszone',
            description: 'Er zijn botsende belangen. Ik leg uit waarom het niet zwart-wit is.',
        },
        {
            id: 'opnieuw',
            label: 'Mijn project moet opnieuw ontworpen worden',
            description: 'De toetsen onthullen een fundamenteel probleem. Ik schets een beter ontwerp.',
        },
    ],
    reflectionQuestions: [
        'Welke van de drie toetsen was het lastigst toe te passen op jóuw project, en waarom?',
        'Stel je voor dat een klasgenoot jouw project beoordeelt: welk ethisch punt zou hij of zij als grootste zorg aanwijzen?',
    ],
    counterArgument:
        '"Jij bent een scholier, geen bedrijf. Ethische toetsen zijn voor echte developers, niet voor schoolprojecten. Niemand wordt vervolgd voor een schoolopdracht — dus waarom al die moeite?"',
    explorationQuiz: {
        question: 'In welke volgorde pas je de drie ethische toetsen het slimst toe?',
        options: [
            'Transparant → Eerlijk → Legaal',
            'Legaal → Eerlijk → Transparant',
            'Eerlijk → Transparant → Legaal',
            'De volgorde maakt niet uit',
        ],
        correctIndex: 1,
        bonusPoints: 10,
        explanation:
            'Eerst legaal: is iets illegaal, dan is de discussie voorbij. Dan eerlijk: benadeelt het niemand? Dan transparant: snappen gebruikers wat het doet? Deze volgorde leerde je in Periode 3.',
    },
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#ff3c21',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#ff3c21',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#202023',
        },
    ],
    takeaways: [
        'Je hebt de drie ethische toetsen (legaal, eerlijk, transparant) toegepast op je eigen project.',
        'Je kunt uitleggen waarom "openbaar" niet hetzelfde is als "vrij te gebruiken".',
        'Je begrijpt het verschil tussen AI als copiloot en AI als vervanger van je eigen denken.',
        'Je kunt een ethisch oordeel onderbouwen met een claim én een reden.',
        'Je laat zien dat je een bewuste digitale burger bent — óók als maker, niet alleen als gebruiker.',
    ],
};

export default config;
