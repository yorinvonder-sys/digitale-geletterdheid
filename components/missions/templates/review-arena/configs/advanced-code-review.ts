import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'advanced-code-review',
    title: 'Code Review: Geavanceerd',
    introEmoji: '🤖',
    introTitle: 'Scan je kennis van geavanceerd programmeren!',
    introDescription:
        'Machine learning, REST API\'s, neurale netwerken, data pipelines — je hebt het allemaal gezien. Doorloop vier ronden en bewijs dat je de geavanceerde concepten echt beheerst.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'AI Architect',
            color: '#F59E0B',
        },
        {
            minScore: 70,
            emoji: '🤖',
            title: 'ML Engineer',
            color: '#10B981',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#6366F1',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#D97757',
        },
    ],
    takeaways: [
        'Machine learning leert van voorbeelddata — hoe meer en betere data, hoe beter het model.',
        'Een REST API communiceert via HTTP-methoden: GET (ophalen), POST (aanmaken), PUT/PATCH (bijwerken), DELETE (verwijderen).',
        'Een neuraal netwerk is opgebouwd uit lagen neuronen die patronen leren herkennen.',
        'Een data pipeline automatiseert het verzamelen, schoonmaken en verwerken van data.',
        'Overfitting treedt op als een model de trainingsdata uit het hoofd leert maar slecht presteert op nieuwe data.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Stappen van machine learning',
            description:
                'Sorteer de stappen van een machine learning project van start (boven) tot inzet (onder).',
            maxScore: 25,
            items: [
                { id: 'probleem', label: 'Probleem definiëren en doel bepalen', correctPosition: 0 },
                { id: 'data', label: 'Data verzamelen en opschonen', correctPosition: 1 },
                { id: 'features', label: 'Features selecteren en data splitsen (train/test)', correctPosition: 2 },
                { id: 'trainen', label: 'Model trainen op trainingsdata', correctPosition: 3 },
                { id: 'evalueren', label: 'Model evalueren op testdata', correctPosition: 4 },
                { id: 'inzetten', label: 'Model inzetten (deployen) in een applicatie', correctPosition: 5 },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Geavanceerde begrippen koppelen',
            description: 'Koppel elk geavanceerd programmeerbegrip aan de juiste omschrijving.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Overfitting',
                    right: 'Model presteert goed op trainingsdata maar slecht op nieuwe data',
                },
                {
                    left: 'REST API',
                    right: 'Interface waarmee systemen via HTTP met elkaar communiceren',
                },
                {
                    left: 'Epoch',
                    right: 'Eén volledige doorgang van alle trainingsdata door het model',
                },
                {
                    left: 'Data pipeline',
                    right: 'Geautomatiseerde stroom van data van bron naar analyse',
                },
                {
                    left: 'Open source',
                    right: 'Software waarvan de broncode openbaar en aanpasbaar is',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Supervised of unsupervised learning?',
            description:
                'Bepaal bij elk scenario of het supervised learning (gelabelde data) of unsupervised learning (geen labels) betreft.',
            maxScore: 25,
            categories: ['Supervised learning', 'Unsupervised learning'],
            items: [
                { label: 'E-mails classificeren als spam of niet-spam op basis van voorbeelden', correctCategory: 'Supervised learning' },
                { label: 'Klanten groeperen op basis van koopgedrag zonder vooraf bekende categorieën', correctCategory: 'Unsupervised learning' },
                { label: 'Foto\'s herkennen als "hond" of "kat" met gelabelde dataset', correctCategory: 'Supervised learning' },
                { label: 'Patronen ontdekken in website-navigatiegedrag zonder labels', correctCategory: 'Unsupervised learning' },
                { label: 'Huizenprijzen voorspellen op basis van historische verkoopdata', correctCategory: 'Supervised learning' },
                { label: 'Afwijkende transacties opsporen zonder te weten wat normaal is', correctCategory: 'Unsupervised learning' },
                { label: 'Stemmen herkennen door het model voorbeelden van "ja" en "nee" te geven', correctCategory: 'Supervised learning' },
                { label: 'Nieuwsartikelen automatisch onderverdelen in thema\'s zonder instructies', correctCategory: 'Unsupervised learning' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'AI & Geavanceerd Programmeren: Waar of Onwaar?',
            description: 'Acht snelle vragen over ML, neurale netwerken en API\'s.',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Een neuraal netwerk heeft altijd minstens drie lagen: invoer, verborgen en uitvoer.',
                    answer: true,
                    explanation: 'Het basismodel van een neuraal netwerk heeft een invoerlaag, één of meer verborgen lagen en een uitvoerlaag.',
                },
                {
                    question: 'Meer data leidt altijd tot een beter machine learning model.',
                    answer: false,
                    explanation: 'Kwaliteit van data is minstens zo belangrijk als kwantiteit — slechte of bevooroordeelde data maakt een model slechter.',
                },
                {
                    question: 'Een GET-request in een REST API vraagt data op van een server.',
                    answer: true,
                    explanation: 'GET is de HTTP-methode voor het ophalen van data — zonder de data te wijzigen.',
                },
                {
                    question: 'Een deep learning model heeft altijd betere resultaten dan een eenvoudig algoritme.',
                    answer: false,
                    explanation: 'Voor eenvoudige problemen met weinig data kan een simpel model (bijv. lineaire regressie) beter presteren.',
                },
                {
                    question: 'JSON is een veelgebruikt formaat om data te sturen via een API.',
                    answer: true,
                    explanation: 'JSON (JavaScript Object Notation) is lichtgewicht, leesbaar en ondersteund door vrijwel alle programmeertalen.',
                },
                {
                    question: 'Bij open source software mag je de code bekijken maar niet aanpassen.',
                    answer: false,
                    explanation: 'Open source geeft het recht om de code te bekijken, te gebruiken én aan te passen — afhankelijk van de licentie.',
                },
                {
                    question: 'Een trainings-testset splitsing voorkomt dat je model op de testdata wordt getraind.',
                    answer: true,
                    explanation: 'Door data te splitsen test je het model op data die het nooit eerder heeft gezien, zodat je echte prestaties meet.',
                },
                {
                    question: 'Kunstmatige intelligentie en machine learning zijn precies hetzelfde.',
                    answer: false,
                    explanation: 'AI is het bredere begrip; machine learning is één techniek binnen AI waarbij computers van data leren.',
                },
            ],
        },
    ],
};

export default config;
