import type { ReviewArenaConfig } from '../ReviewArena';

export const dataReviewConfig: ReviewArenaConfig = {
    missionId: 'data-review',
    title: 'Data & Informatie Review',
    introEmoji: '📊',
    introTitle: 'Wat weet jij over data en informatie?',
    introDescription:
        'Je werkte deze periode als data-journalist, spreadsheet-specialist, factchecker, API-verkenner, dashboard-designer en bias-detective. In vier ronden test je of die kennis is blijven hangen: bronnen wegen, de juiste formule kiezen, de juiste grafiek pakken, JSON lezen en AI-bias herkennen.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Data Expert',
            color: '#e1ff01',
        },
        {
            minScore: 70,
            emoji: '🎯',
            title: 'Scherpe data-analist',
            color: '#202023',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Kennis in opbouw',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#ff3c21',
        },
    ],
    takeaways: [
        'Een meta-analyse van veel onderzoeken weegt zwaarder als bewijs dan één studie of een mening.',
        'De CRAAP-methode weegt een bron op actualiteit, relevantie, autoriteit, juistheid en doel.',
        '=SOM telt op, =GEMIDDELDE middelt, =MAX en =MIN zoeken de uitersten, =AANTAL telt hoeveel getallen er staan.',
        'Een staafdiagram vergelijkt categorieën, een lijndiagram toont een trend in de tijd, een cirkeldiagram toont de verdeling van een geheel.',
        'In JSON hoort bij elke sleutel een waarde; een API-sleutel bewijst wie het verzoek stuurt.',
        'AI-bias komt uit de data waarmee een systeem is getraind — testen op groepen, transparantie en menselijk toezicht helpen ertegen.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Hoe sterk is dit bewijs?',
            description:
                'Sorteer deze bronnen van sterkst bewijs (boven) naar zwakst bewijs (onder) voor een uitspraak over jongeren en sociale media.',
            maxScore: 25,
            followUp: {
                question: 'De A van Authority in de CRAAP-methode: welke vraag hoort daarbij?',
                options: [
                    'Hoe oud is deze informatie?',
                    'Wie heeft dit geschreven en welke kennis heeft die persoon?',
                    'Past deze bron bij mijn onderwerp?',
                    'Waarom is dit geschreven?',
                ],
                correctIndex: 1,
                explanation:
                    'Authority gaat over de auteur: wie zegt het en waarom mag je die persoon geloven? De andere vragen horen ook bij CRAAP, maar bij een andere letter: Currency (hoe oud), Relevance (past het) en Purpose (waarom geschreven).',
                bonusPoints: 0,
            },
            items: [
                {
                    id: 'bedrijf-eigen-onderzoek',
                    label: 'Onderzoek dat een social-mediabedrijf zelf over zijn eigen app publiceerde',
                    correctPosition: 3,
                },
                {
                    id: 'anoniem',
                    label: 'Bericht zonder auteursnaam en zonder datum op een onbekende website',
                    correctPosition: 5,
                },
                {
                    id: 'meta-analyse',
                    label: 'Meta-analyse: één studie die 47 andere onderzoeken samenvat',
                    correctPosition: 0,
                },
                {
                    id: 'opiniestuk',
                    label: 'Opiniestuk in de schoolkrant, gebaseerd op eigen ervaring',
                    correctPosition: 4,
                },
                {
                    id: 'krantenartikel',
                    label: 'Krantenartikel met auteursnaam dat naar het originele onderzoek linkt',
                    correctPosition: 2,
                },
                {
                    id: 'losse-studie',
                    label: 'Eén wetenschappelijk onderzoek dat 2.400 jongeren twee jaar volgde',
                    correctPosition: 1,
                },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Welke formule hoort bij welke vraag?',
            description:
                'Je hebt het kasboek van de leerlingenraad voor je. De bedragen staan in kolom D, het type (Inkomst of Uitgave) in kolom E. Koppel elke vraag aan de formule die het antwoord geeft.',
            maxScore: 25,
            followUp: {
                question: 'Je wilt in het kasboek alleen de uitgaven zien, zonder rijen te verwijderen. Wat doe je?',
                options: [
                    'Sorteren op bedrag, van hoog naar laag',
                    'Filteren op de kolom Type, met "Uitgave"',
                    'De inkomsten met de hand weghalen',
                    'De kolom Type verbergen',
                ],
                correctIndex: 1,
                explanation:
                    'Filteren verbergt tijdelijk de rijen die je niet nodig hebt; je data blijft heel. Sorteren verandert alleen de volgorde en laat alle rijen staan.',
                bonusPoints: 0,
            },
            pairs: [
                {
                    left: 'Het totaal van alle bedragen',
                    right: '=SOM(D2:D11)',
                },
                {
                    left: 'Het gemiddelde bedrag per transactie',
                    right: '=GEMIDDELDE(D2:D11)',
                },
                {
                    left: 'Het hoogste bedrag in de lijst',
                    right: '=MAX(D2:D11)',
                },
                {
                    left: 'Het laagste bedrag in de lijst',
                    right: '=MIN(D2:D11)',
                },
                {
                    left: 'Hoeveel transacties er in het kasboek staan',
                    right: '=AANTAL(D2:D11)',
                },
                {
                    left: 'Alleen de bedragen met type "Uitgave" optellen',
                    right: '=SOM.ALS(E2:E11;"Uitgave";D2:D11)',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Welke grafiek past hierbij?',
            description:
                'Je ontwerpt een dashboard voor de schoolleiding. Kies bij elke vraag het grafiektype dat de boodschap het duidelijkst laat zien.',
            maxScore: 25,
            categories: ['Staafdiagram', 'Lijndiagram', 'Cirkeldiagram'],
            items: [
                {
                    label: 'Het gemiddelde cijfer van 2A, 2B, 2C en 2D naast elkaar zetten',
                    correctCategory: 'Staafdiagram',
                },
                {
                    label: 'De aanwezigheid per maand over het hele schooljaar volgen',
                    correctCategory: 'Lijndiagram',
                },
                {
                    label: 'Welk deel van alle onvoldoendes bij elk vak hoort',
                    correctCategory: 'Cirkeldiagram',
                },
                {
                    label: 'De uitgaven aan evenementen vergelijken met die aan materiaal',
                    correctCategory: 'Staafdiagram',
                },
                {
                    label: 'Hoe het aantal bezoekers van de schoolsite zich zes maanden lang ontwikkelde',
                    correctCategory: 'Lijndiagram',
                },
                {
                    label: 'Welk aandeel van het schoolbudget naar boeken, ICT en gebouw gaat',
                    correctCategory: 'Cirkeldiagram',
                },
                {
                    label: 'Hoeveel API-verzoeken zes verschillende apps per sessie sturen',
                    correctCategory: 'Staafdiagram',
                },
                {
                    label: 'De gemiddelde temperatuur per week in het afgelopen jaar',
                    correctCategory: 'Lijndiagram',
                },
                {
                    label: 'Welk deel van alle leerlingen in leerjaar 2 in elke klas zit',
                    correctCategory: 'Cirkeldiagram',
                },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: "API's & AI-bias: waar of onwaar?",
            description: 'Acht snelle vragen over JSON, API-verzoeken en eerlijke AI. Fout antwoorden kost punten, dus gok niet zomaar.',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'In een JSON-antwoord hoort bij elke sleutel (key) een waarde (value).',
                    answer: true,
                    explanation:
                        'JSON werkt met paren: "temp": 14.2. De sleutel geeft betekenis aan de waarde, zodat een app weet dat 14,2 de temperatuur is en niet de luchtvochtigheid.',
                },
                {
                    question: 'Het getal 78 zonder aanhalingstekens in JSON is van het type string.',
                    answer: false,
                    explanation:
                        'Zonder aanhalingstekens is het een number. Een string staat altijd tussen aanhalingstekens, zoals "Amsterdam".',
                },
                {
                    question: 'Een API-sleutel (apiKey) versleutelt de data die je terugkrijgt.',
                    answer: false,
                    explanation:
                        'Een API-sleutel bewijst wie het verzoek stuurt, zodat de aanbieder misbruik kan blokkeren. Versleutelen van het verkeer doet https, niet de sleutel. Daarom deel je een echte sleutel nooit.',
                },
                {
                    question: 'In een API-URL staan de parameters achter het vraagteken, gescheiden door een &.',
                    answer: true,
                    explanation:
                        'Bijvoorbeeld ?city=Amsterdam&units=metric: het vraagteken start de parameters en de & scheidt ze. Zo vraag je precies de data die je nodig hebt.',
                },
                {
                    question: 'Als je alle beslissingen volledig aan de AI overlaat, verdwijnt de bias.',
                    answer: false,
                    explanation:
                        'Een AI leert van menselijke data en kan bestaande vooroordelen juist op grote schaal herhalen. Bij beslissingen over mensen blijft menselijk toezicht nodig.',
                },
                {
                    question: 'Een AI kan een groep systematisch benadelen, ook al staat dat nergens in de code.',
                    answer: true,
                    explanation:
                        'Bias zit meestal in de trainingsdata, niet in een regel code. Een cv-filter dat leerde van jaren aanname-beslissingen neemt de patronen daaruit over.',
                },
                {
                    question: 'Een AI vóór de uitrol testen op verschillende groepen helpt om bias op te sporen.',
                    answer: true,
                    explanation:
                        'Zo\'n test laat zien of het systeem voor de ene groep slechter werkt dan voor de andere — je vindt het probleem voordat er schade ontstaat.',
                },
                {
                    question: 'Een AI sneller en goedkoper maken, maakt hem ook eerlijker.',
                    answer: false,
                    explanation:
                        'Snelheid en prijs zeggen niets over eerlijkheid. Een goedkoper bevooroordeeld systeem wordt vaker gebruikt, waardoor het probleem juist groter wordt.',
                },
            ],
        },
    ],
};
