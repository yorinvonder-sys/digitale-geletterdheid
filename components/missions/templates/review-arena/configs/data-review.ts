import type { ReviewArenaConfig } from '../ReviewArena';

export const dataReviewConfig: ReviewArenaConfig = {
    missionId: 'data-review',
    title: 'Data & Informatie Review',
    introEmoji: '📊',
    introTitle: 'Wat weet jij over data en informatie?',
    introDescription:
        'Test je kennis over datasets, spreadsheets, APIs, datavisualisatie, AI-bias en fact-checking — de stof van Periode 1. Vier afwisselende ronden, steeds iets uitdagender.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Data Expert',
            color: '#F59E0B',
        },
        {
            minScore: 70,
            emoji: '📊',
            title: 'Data-analist',
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
        'Data zijn ruwe feiten of cijfers; informatie is data met betekenis en context.',
        'Een dataset bestaat uit rijen (observaties) en kolommen (variabelen).',
        'Een API is een koppeling waarmee programma\'s data met elkaar kunnen uitwisselen via requests en responses.',
        'AI-bias ontstaat wanneer trainingsdata niet representatief is voor alle groepen.',
        'De CRAAP-methode (Currency, Relevance, Authority, Accuracy, Purpose) helpt je bronnen beoordelen op betrouwbaarheid.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Van ruw naar bruikbaar',
            description:
                'Zet deze stappen in de juiste volgorde: hoe verwerk je ruwe data tot bruikbare informatie?',
            maxScore: 25,
            items: [
                {
                    id: 'collect',
                    label: 'Ruwe data verzamelen (bijv. meetwaarden, enquêteresultaten)',
                    correctPosition: 0,
                },
                {
                    id: 'clean',
                    label: 'Data opschonen: fouten, duplicaten en lege cellen verwijderen',
                    correctPosition: 1,
                },
                {
                    id: 'analyse',
                    label: 'Data analyseren: patronen en gemiddelden berekenen',
                    correctPosition: 2,
                },
                {
                    id: 'visualise',
                    label: 'Resultaten visualiseren in een grafiek of dashboard',
                    correctPosition: 3,
                },
                {
                    id: 'interpret',
                    label: 'Conclusies trekken en de informatie communiceren',
                    correctPosition: 4,
                },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Dataconcepten koppelen',
            description: 'Koppel elk concept aan de juiste beschrijving.',
            maxScore: 25,
            pairs: [
                {
                    left: 'API',
                    right: 'Een koppeling waarmee twee applicaties data uitwisselen via requests en responses',
                },
                {
                    left: 'Dataset',
                    right: 'Een gestructureerde verzameling gegevens in rijen en kolommen',
                },
                {
                    left: 'AI-bias',
                    right: 'Systematische fout in een AI-model door niet-representatieve trainingsdata',
                },
                {
                    left: 'Lijndiagram',
                    right: 'Visualisatie die trends en veranderingen over tijd laat zien',
                },
                {
                    left: 'Fact-checking',
                    right: 'Het verifiëren van een bewering via meerdere betrouwbare bronnen',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Welk grafiektype past het best?',
            description:
                'Categoriseer elk scenario als "Lijndiagram" of "Staafdiagram".',
            maxScore: 25,
            categories: ['Lijndiagram', 'Staafdiagram'],
            items: [
                { label: 'Temperatuurverloop over één week', correctCategory: 'Lijndiagram' },
                { label: 'Vergelijking van sportscores tussen 5 teams', correctCategory: 'Staafdiagram' },
                { label: 'Groei van websitebezoekers per maand over een jaar', correctCategory: 'Lijndiagram' },
                { label: 'Aantal leerlingen per klas in een school', correctCategory: 'Staafdiagram' },
                { label: 'CO₂-uitstoot per jaar van 2010 tot 2024', correctCategory: 'Lijndiagram' },
                { label: 'Populariteit van vijf sociale media-platforms vergeleken', correctCategory: 'Staafdiagram' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'Data & Informatie: Waar of Onwaar?',
            description: 'Acht snelle vragen. Goed raden telt mee voor je streak-bonus!',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Data en informatie betekenen hetzelfde.',
                    answer: false,
                    explanation:
                        'Data zijn ruwe feiten; informatie is data met betekenis en context.',
                },
                {
                    question: 'Een API-response bevat meestal data in JSON-formaat.',
                    answer: true,
                    explanation:
                        'JSON (JavaScript Object Notation) is het meest gebruikte formaat voor API-responses.',
                },
                {
                    question: 'Een cirkeldiagram is de beste keuze om een trend over tijd te tonen.',
                    answer: false,
                    explanation:
                        'Voor trends over tijd gebruik je een lijndiagram; een cirkeldiagram toont verhoudingen op één moment.',
                },
                {
                    question: 'AI-bias kan ontstaan doordat vrouwen ondervertegenwoordigd zijn in de trainingsdata.',
                    answer: true,
                    explanation:
                        'Niet-representatieve trainingsdata is een veelvoorkomende oorzaak van bias in AI-systemen.',
                },
                {
                    question: 'De CRAAP-methode is een techniek om spreadsheetformules te controleren.',
                    answer: false,
                    explanation:
                        'De CRAAP-methode (Currency, Relevance, Authority, Accuracy, Purpose) gebruik je om de betrouwbaarheid van bronnen te beoordelen.',
                },
                {
                    question: 'Een spreadsheetformule als =GEMIDDELDE(B2:B20) berekent het gemiddelde van een reeks cellen.',
                    answer: true,
                    explanation:
                        'Dit is een basisformule in spreadsheetprogramma\'s zoals Excel en Google Sheets.',
                },
                {
                    question: 'Wikipedia is altijd een betrouwbare primaire bron voor een wetenschappelijk onderzoek.',
                    answer: false,
                    explanation:
                        'Wikipedia kan een startpunt zijn, maar is geen primaire bron; controleer altijd de oorspronkelijke bronnen onderaan de pagina.',
                },
                {
                    question: 'Een dashboard combineert meerdere grafieken om snel een overzicht te geven.',
                    answer: true,
                    explanation:
                        'Een dashboard is een verzameling van visualisaties die samen inzicht geven in een onderwerp.',
                },
            ],
        },
    ],
};
