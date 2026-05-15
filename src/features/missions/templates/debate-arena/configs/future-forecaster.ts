import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'future-forecaster',
    title: 'Future Forecaster',
    introEmoji: '🔮',
    introTitle: 'Future Forecaster',
    introDescription:
        'Het is 2040. AI geeft bijna alle lessen, zelfrijdende auto\'s zijn de norm en je digitale tweeling houdt je gezondheid bij. Maar niet iedereen is blij. Debatteer mee over hoe ver technologie mag gaan.',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Technologie en de toekomst van onderwijs en werk',
    dilemma:
        'In 2040 kan een AI-leraar elke les perfect aanpassen op elke leerling, 24/7 beschikbaar zijn en nooit ongeduldig worden. Moeten we menselijke leraren dan nog inzetten — en zo ja, waarvoor?',
    stakeholders: [
        {
            id: 'lars',
            name: 'Lars',
            emoji: '👦',
            role: 'Leerling in 2040, 15 jaar',
            perspective:
                'Mijn AI-tutor kent mij beter dan welke leraar ook. Hij weet wanneer ik me verveel, wanneer ik gestrest ben, en past de stof aan. Mijn resultaten zijn beter dan ooit. Eerlijk gezegd mis ik menselijke leraren niet zo.',
            keyArgument:
                'Als het doel van onderwijs is leren, en AI kan dat beter dan mensen — waarom houden we dan vast aan de menselijke leraar?',
        },
        {
            id: 'jansen',
            name: 'Mevrouw Jansen',
            emoji: '👩‍🏫',
            role: 'Leraar in 2040',
            perspective:
                'Ik geef geen les meer in de traditionele zin. Ik coach, ik motiveer, ik help leerlingen omgaan met tegenslagen. Dat kan een AI niet. Onderwijs is meer dan informatieoverdracht — het is een menselijke relatie van vertrouwen en veiligheid.',
            keyArgument:
                'Kinderen leren niet alleen kennis, maar ook hoe ze mensen zijn in de wereld. Dat vraagt menselijk contact, niet een algoritme.',
        },
        {
            id: 'guo',
            name: 'Dr. Guo',
            emoji: '🔬',
            role: 'Futuroloog en onderwijsonderzoeker',
            perspective:
                'AI in onderwijs is nu al een realiteit in sommige landen. Het vergroot de kloof: leerlingen met toegang tot de beste AI-systemen presteren veel beter dan leerlingen zonder. Als we niet oppassen, creëren we een tweedeling waar je toekomst afhangt van de kwaliteit van je AI-abonnement.',
            keyArgument:
                'Technologie is zelden neutraal. Elke tech-trend versterkt bestaande ongelijkheid als er niet actief op wordt gestuurd.',
        },
        {
            id: 'politicus',
            name: 'Minister Tran',
            emoji: '🏛️',
            role: 'Minister van Onderwijs in 2040',
            perspective:
                'We hebben besloten dat elke leerling recht heeft op een AI-tutor als extra ondersteuning, maar dat menselijke leraren de kern van het onderwijs blijven. Dat kost meer geld dan volledig AI-onderwijs, maar we geloven dat de sociale en democratische waarde van onderwijs niet geautomatiseerd mag worden.',
            keyArgument:
                'Onderwijs is een publiek goed, geen product. De overheid moet keuzes maken die eerlijkheid boven efficiëntie stellen.',
        },
    ],
    positions: [
        {
            id: 'ai-primair',
            label: 'AI als primaire leraar',
            description: 'AI-systemen geven de meeste lessen. Menselijke leraren zijn beschikbaar voor coaching en sociale ondersteuning.',
        },
        {
            id: 'hybride',
            label: 'Hybride model',
            description: 'Menselijke leraren en AI werken samen. AI verwerkt stof en geeft feedback; mensen begeleiden, motiveren en inspireren.',
        },
        {
            id: 'menselijk-centraal',
            label: 'Menselijke leraar centraal',
            description: 'Menselijke leraren blijven het hart van onderwijs. AI is alleen een hulpmiddel, zoals een boek of een rekenmachine.',
        },
        {
            id: 'recht-op-keuze',
            label: 'Keuzevrijheid voor leerlingen',
            description: 'Leerlingen en ouders kiezen zelf welk model het beste bij hen past. De overheid bepaalt geen standaard.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Mijn onderbouwing is...',
        'Dit is belangrijk voor de toekomst omdat...',
    ],
    reflectionQuestions: [
        'Wat maakt onderwijs tot meer dan alleen informatieoverdracht?',
        'Is jouw visie op de toekomst veranderd door het standpunt van een andere betrokkene?',
    ],
    counterArgument:
        '"Als we vasthouden aan menselijke leraren puur uit traditie, dan benadelen we de leerlingen die het meest gebaat zijn bij personalisatie — leerlingen met dyslexie, ADHD of een taalachterstand. Voor hen is een perfecte AI-tutor geen luxe maar een gelijkmaker. Traditie als argument is geen argument."',
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
            emoji: '🔭',
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
        'Toekomstvoorspellingen zijn het sterkst als ze gebaseerd zijn op trends die nu al zichtbaar zijn.',
        'Technologie vergroot ongelijkheid als er niet actief op gestuurd wordt.',
        'Onderwijs heeft zowel een kennisfunctie als een sociale en democratische functie.',
        'Er is geen één juiste toekomst — de keuzes die we nu maken bepalen welke toekomst werkelijkheid wordt.',
    ],
};

export default config;
