import type { DataViewerConfig } from '../DataViewer';

export const apiVerkennerConfig: DataViewerConfig = {
    missionId: 'api-verkenner',
    title: 'API Verkenner',
    introEmoji: '🌐',
    introTitle: 'Word een API Verkenner',
    introDescription:
        'Elke app die je gebruikt — Instagram, Buienradar, Google Maps — haalt data op via API\'s. Jij gaat ontdekken hoe die onzichtbare datakoppelingen werken. Van JSON-responses tot URL-parameters: na deze missie begrijp je hoe apps met elkaar "praten".',
    introFeatures: [
        'Analyseer een echte JSON-response van een weer-API',
        'Vergelijk welke data populaire apps via API\'s ophalen',
        'Beoordeel hoe URL-parameters werken bij het opvragen van data',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'json-response-analyse',
            title: 'JSON-response van een weer-API: Amsterdam',
            description:
                'Een app heeft de volgende JSON-response ontvangen van de OpenWeatherMap API voor Amsterdam. Bekijk de tabel (een vereenvoudigde weergave van de JSON) en beantwoord de vragen.',
            type: 'table',
            columns: [
                { key: 'key', label: 'JSON-sleutel (key)', sortable: true },
                { key: 'waarde', label: 'Waarde (value)', sortable: false },
                { key: 'type', label: 'Datatype', sortable: true },
                { key: 'betekenis', label: 'Betekenis', sortable: false },
            ],
            rows: [
                { key: 'city', waarde: 'Amsterdam', type: 'string', betekenis: 'Naam van de stad' },
                { key: 'country', waarde: 'NL', type: 'string', betekenis: 'Landcode' },
                { key: 'temp', waarde: 14.2, type: 'number', betekenis: 'Temperatuur in °C' },
                { key: 'feels_like', waarde: 12.8, type: 'number', betekenis: 'Gevoelstemperatuur in °C' },
                { key: 'humidity', waarde: 78, type: 'number', betekenis: 'Luchtvochtigheid in %' },
                { key: 'wind_speed', waarde: 4.5, type: 'number', betekenis: 'Windsnelheid in m/s' },
                { key: 'description', waarde: 'licht bewolkt', type: 'string', betekenis: 'Weersomschrijving' },
                { key: 'sunrise', waarde: '06:42', type: 'string', betekenis: 'Zonsopgang (lokale tijd)' },
                { key: 'sunset', waarde: '20:15', type: 'string', betekenis: 'Zonsondergang (lokale tijd)' },
                { key: 'timestamp', waarde: 1711952400, type: 'number', betekenis: 'Unix timestamp (seconden sinds 1970)' },
            ],
            questions: [
                {
                    id: 'q1-gevoelstemperatuur',
                    question:
                        'Hoeveel graden is het verschil tussen de werkelijke temperatuur en de gevoelstemperatuur in deze JSON-response?',
                    type: 'number-input',
                    correctAnswer: 1.4,
                    explanation:
                        'temp: 14,2 °C minus feels_like: 12,8 °C = 1,4 °C verschil. De gevoelstemperatuur is lager door wind (windchill). Bekijk de rijen "temp" en "feels_like" in de tabel.',
                    points: 15,
                },
                {
                    id: 'q2-datatype',
                    question:
                        'Welk datatype heeft de waarde van "humidity" in deze JSON-response?',
                    type: 'multiple-choice',
                    options: ['string', 'boolean', 'number', 'array'],
                    correctAnswer: 'number',
                    explanation:
                        '"humidity" heeft de waarde 78 — dat is een getal (number), geen tekst. Strings staan tussen aanhalingstekens ("Amsterdam"), numbers zijn kale getallen. Sorteer op "Datatype" om alle numbers te groeperen.',
                    points: 10,
                },
                {
                    id: 'q3-json-observatie',
                    question:
                        'Wat is het nut van een "key" (sleutel) in een JSON-response? Waarom geeft een API niet gewoon een lijstje getallen terug?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Keys geven betekenis aan de waarden. Zonder keys zou "14.2, 12.8, 78" niks zeggen — je weet niet welk getal de temperatuur is. Met keys zoals "temp" en "humidity" begrijpt elke app wat elk getal betekent, ook als de volgorde verandert. Dit maakt API-communicatie betrouwbaar en leesbaar.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'api-verzoeken-per-app',
            title: 'Hoeveel API-verzoeken stuurt een app per sessie?',
            description:
                'Onderzoekers van de TU Delft (2024) analyseerden hoeveel API-verzoeken populaire apps sturen tijdens een sessie van 5 minuten. Elke bar toont het gemiddeld aantal verzoeken.',
            type: 'bar-chart',
            chartData: [
                { label: 'Google Maps', value: 47, color: '#D97848' },
                { label: 'Instagram', value: 38, color: '#D97848' },
                { label: 'Buienradar', value: 12, color: '#0B453F' },
                { label: 'WhatsApp', value: 8, color: '#5F947D' },
                { label: 'Spotify', value: 22, color: '#5F947D' },
                { label: 'Wikipedia', value: 3, color: '#0B453F' },
            ],
            questions: [
                {
                    id: 'q4-meeste-verzoeken',
                    question: 'Welke app stuurt de meeste API-verzoeken tijdens een sessie van 5 minuten?',
                    type: 'multiple-choice',
                    options: ['Instagram', 'Spotify', 'WhatsApp', 'Google Maps'],
                    correctAnswer: 'Google Maps',
                    explanation:
                        'Google Maps stuurt 47 verzoeken per 5 minuten — de meeste van alle apps. Dit komt doordat kaartdata, verkeersinformatie, locatiedata en routeberekeningen allemaal via aparte API-calls worden opgehaald terwijl je navigeert.',
                    points: 10,
                },
                {
                    id: 'q5-verschil-instagram-wikipedia',
                    question:
                        'Hoeveel keer meer API-verzoeken stuurt Instagram vergeleken met Wikipedia in dezelfde 5-minutensessie?',
                    type: 'number-input',
                    correctAnswer: 12.7,
                    explanation:
                        'Instagram: 38 verzoeken. Wikipedia: 3 verzoeken. 38 ÷ 3 ≈ 12,7 keer meer. Instagram laadt continu nieuwe content (foto\'s, aanbevelingen, notificaties) via API\'s. Wikipedia laadt doorgaans één pagina en is daarna klaar.',
                    points: 15,
                },
                {
                    id: 'q6-verzoeken-observatie',
                    question:
                        'Waarom denk je dat WhatsApp minder API-verzoeken nodig heeft dan Instagram, terwijl beide sociale apps zijn?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'WhatsApp stuurt en ontvangt alleen berichten — relatief kleine hoeveelheden tekst en af en toe een foto. Instagram laadt continu een feed met hoge-resolutie foto\'s, video\'s, aanbevelingen, likes en reacties. Meer soorten data betekent meer afzonderlijke API-verzoeken. Instagram heeft ook een aanbevelingsalgoritme dat constant data ophaalt.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'api-endpoints-voorbeelden',
            title: 'Hoe ziet een API-URL eruit? Vier voorbeelden',
            description:
                'Een API-request is een URL met extra informatie. Hieronder zie je vier echte API-URL\'s (vereenvoudigd). Lees ze zorgvuldig om te begrijpen hoe parameters werken.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Weer-API: Amsterdam',
                    icon: '🌤️',
                    content:
                        'URL: https://api.weather.com/current?city=Amsterdam&units=metric&lang=nl\n\nDe vraagteken (?) geeft aan dat er parameters volgen. "city=Amsterdam" specificeert de stad. "units=metric" vraagt om graden Celsius (niet Fahrenheit). "lang=nl" vraagt om Nederlandse beschrijvingen. Parameters worden gescheiden door &.',
                },
                {
                    title: 'Pokémon-API: Pikachu',
                    icon: '⚡',
                    content:
                        'URL: https://pokeapi.co/api/v2/pokemon/pikachu\n\nDeze API gebruikt geen parameters maar een "pad" (path). Na /pokemon/ typ je de naam van het Pokémon. De API geeft dan JSON terug met alle gegevens: stats, moves, afbeelding, type. Dit is een gratis, publieke API — iedereen mag hem gebruiken.',
                },
                {
                    title: 'Nieuws-API: technologie nieuws',
                    icon: '📰',
                    content:
                        'URL: https://newsapi.org/v2/top-headlines?category=technology&country=nl&apiKey=DEMO_SLEUTEL\n\nHier zie je een "apiKey" — een unieke code die bewijst wie jij bent. Dit is een demo-sleutel; een echte API-key deel je nooit in screenshots, chats of openbare code. "category=technology" filtert alleen tech-nieuws. "country=nl" toont alleen Nederlandse bronnen.',
                },
                {
                    title: 'Valuta-API: euro naar dollar',
                    icon: '💱',
                    content:
                        'URL: https://api.exchangerate.host/convert?from=EUR&to=USD&amount=100\n\nDeze API rekent valuta om. "from=EUR" is de bronvaluta. "to=USD" is de doelvaluta. "amount=100" is het bedrag. De response bevat dan de omgerekende waarde. Ideaal voor een webshop die prijzen in meerdere valuta toont.',
                },
            ],
            questions: [
                {
                    id: 'q7-parameter-functie',
                    question:
                        'Wat is de functie van een "apiKey" in een API-URL? Kies het beste antwoord.',
                    type: 'multiple-choice',
                    options: [
                        'Het versleutelt de data die de API terugstuurt',
                        'Het identificeert wie het verzoek stuurt en voorkomt misbruik',
                        'Het versnelt de API-response',
                        'Het bepaalt de taal van de JSON-response',
                    ],
                    correctAnswer: 'Het identificeert wie het verzoek stuurt en voorkomt misbruik',
                    explanation:
                        'Een apiKey is als een pasje: het bewijst wie jij bent. Zo kan de API-aanbieder bijhouden wie de API gebruikt en misbruik blokkeren. Omdat een echte sleutel toegang kan geven tot jouw account of tegoed, houd je die altijd privé.',
                    points: 15,
                },
                {
                    id: 'q8-url-bouwen',
                    question:
                        'Je wilt de Pokémon API vragen om data over "charizard". Hoe zou de URL eruitzien op basis van het patroon dat je hebt gezien?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Op basis van het patroon: https://pokeapi.co/api/v2/pokemon/charizard — je vervangt alleen "pikachu" door "charizard" in het pad. Dit is hoe REST API\'s werken: het "pad" bepaalt welke resource je opvraagt. Dit is een van de meest fundamentele concepten van het moderne web.',
                    points: 15,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🌐',
            title: 'API-expert!',
            color: '#0B453F',
        },
        {
            minScore: 65,
            emoji: '📡',
            title: 'Digitale ontdekkingsreiziger',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🔌',
            title: 'Aan de slag met APIs',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
        },
    ],

    takeaways: [
        'Een API is een koppeling waarmee apps data kunnen opvragen bij servers',
        'JSON gebruikt keys en values — keys geven betekenis aan de data',
        'API-parameters (na de ?) bepalen welke specifieke data je opvraagt',
        'Een apiKey identificeert de gebruiker en voorkomt misbruik',
        'Elke app achter je scherm gebruikt tientallen API-verzoeken per minuut',
    ],
};

export default apiVerkennerConfig;
