import type { DataViewerConfig } from '../DataViewer';

export const apiVerkennerConfig: DataViewerConfig = {
    missionId: 'api-verkenner',
    title: 'API Verkenner',
    introEmoji: '🌐',
    introTitle: 'Word een API Verkenner',
    introDescription:
        'Elke app die je gebruikt — Instagram, Buienradar, Google Maps — haalt data op via API\'s. Jij gaat ontdekken hoe die onzichtbare datakoppelingen werken. Van JSON-responses tot URL-parameters: na deze missie begrijp je hoe apps met elkaar "praten".',
    missionGoal: {
        primaryGoal: 'Leg uit hoe apps data ophalen via API’s en herken welke technische en privacykeuzes daarbij horen.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Alle drie datasets zijn onderzocht, observaties noemen API-begrippen en privacyrisico’s en de score is minimaal 65/100.',
        },
        evidence: 'Leerlingbewijs: antwoorden over JSON, API-verzoeken, parameters, apiKeys en drie observaties met technische uitleg. Docentbewijs: score, fase-overzicht en zichtbaar bewijs dat de leerling API-data en privacyrisico’s kan uitleggen.',
    },
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'API-detective: de leerling kiest eerst waarom een weer-widget blijft hangen.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Na de hypothese koppelt feedback endpoint, JSON-key of apiKey direct aan een technisch spoor.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling wijst API-begrippen, URL-parameters en privacyrisico’s aan in data.',
        antiBoringRule: 'API-data mag niet starten als begrippenlijst; start met een kapotte keten en bewijsstukken.',
        chromeAcceptance: 'Investigation hook, datasetkaarten en tekstobservaties werken op alle vier viewports zonder horizontale overflow.',
    },
    introFeatures: [
        'Analyseer een echte JSON-response van een weer-API',
        'Vergelijk welke data populaire apps via API\'s ophalen',
        'Beoordeel hoe URL-parameters werken bij het opvragen van data',
    ],
    investigationHook: {
        title: 'De weer-widget blijft hangen',
        role: 'API-detective',
        scenario:
            'De schoolsite toont al de hele ochtend hetzelfde weerbericht. Jij krijgt drie minuten om te bepalen waar de API-keten waarschijnlijk breekt voordat iemand in de code duikt.',
        prompt: 'Welke hypothese onderzoek je als eerste?',
        contextLabel: 'API-hypothese',
        continueLabel: 'Open de API-data',
        options: [
            {
                id: 'endpoint-route',
                label: 'De app vraagt de verkeerde endpoint op',
                description: 'Je let extra op URL-paden, parameters en welke resource de app eigenlijk opvraagt.',
                feedback: 'Sterke technische start. Als de route of parameter niet klopt, kan een API prima werken maar toch de verkeerde data teruggeven.',
                evidenceChips: ['/current vs /now', 'city=Amsterdam', 'units=metric'],
                impactCue: 'Route en parameters',
            },
            {
                id: 'json-keys',
                label: 'De JSON wordt verkeerd gelezen',
                description: 'Je zoekt naar keys, datatypes en waarden die de app verkeerd kan interpreteren.',
                feedback: 'Goede onderzoekslijn. Een app heeft niets aan data als de code niet begrijpt welke key bij welke waarde hoort.',
                evidenceChips: ['humidity 78', 'temp 14,2', 'datatype number'],
                impactCue: 'Key mapping',
            },
            {
                id: 'api-key',
                label: 'De toegangssleutel is het risico',
                description: 'Je kijkt of apiKeys, misbruikpreventie of gedeelde sleutels een rol spelen.',
                feedback: 'Slim bekeken. API-toegang is niet alleen techniek, maar ook beveiliging: een sleutel hoort nooit zichtbaar rond te zwerven.',
                evidenceChips: ['apiKey verborgen', 'niet delen', 'misbruik blokkeren'],
                impactCue: 'Sleutelveiligheid',
            },
        ],
    },

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
                        'Pin de JSON-sleutel die de luchtvochtigheid beschrijft. Leg uit welk datatype deze waarde heeft en waarom een weer-app dit niet als gewone tekst moet behandelen.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '"humidity" heeft de waarde 78. Dat is een number: een kaal getal waarmee de app kan rekenen, vergelijken of een meter kan vullen. Als de app dit als gewone tekst behandelt, kan hij bijvoorbeeld niet betrouwbaar sorteren, drempels checken of een vochtigheidswaarschuwing berekenen.',
                    points: 10,
                    minLength: 60,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'humidity-key genoemd', keywords: ['humidity', 'luchtvochtigheid'] },
                        { label: 'datatype number', keywords: ['number', 'getal', 'numeriek', 'datatype'] },
                        { label: 'waarde 78 gebruikt', keywords: ['78', 'waarde'] },
                        { label: 'app kan ermee rekenen', keywords: ['rekenen', 'vergelijken', 'meter', 'sorteren', 'drempel', 'waarschuwing'] },
                        { label: 'niet gewone tekst', keywords: ['geen tekst', 'niet als tekst', 'string'] },
                    ],
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
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'key of sleutel', keywords: ['key', 'sleutel'] },
                        { label: 'betekenis bij waarde', keywords: ['betekenis', 'waarde', 'value', 'label'] },
                        { label: 'apps begrijpen de data', keywords: ['app', 'begrijpt', 'leesbaar', 'volgorde', 'json'] },
                    ],
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
                    question:
                        'Markeer de app die als request-volume incident bovenaan je API-monitor moet staan. Noem het aantal verzoeken en leg uit welke soorten data daardoor waarschijnlijk tegelijk worden opgehaald.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Google Maps stuurt 47 verzoeken per 5 minuten — de meeste van alle apps. Dit komt doordat kaartdata, verkeersinformatie, locatiedata en routeberekeningen allemaal via aparte API-calls worden opgehaald terwijl je navigeert.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Google Maps gemarkeerd', keywords: ['google maps', 'maps'] },
                        { label: '47 verzoeken genoemd', keywords: ['47', 'verzoeken', 'api-calls', 'api calls'] },
                        { label: 'meeste of hoogste piek benoemd', keywords: ['meeste', 'hoogste', 'piek', 'bovenaan', 'incident'] },
                        { label: 'soorten kaartdata uitgelegd', keywords: ['kaartdata', 'verkeer', 'locatie', 'route', 'navigatie'] },
                    ],
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
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'WhatsApp heeft kleinere berichtdata', keywords: ['whatsapp', 'bericht', 'tekst', 'klein'] },
                        { label: 'Instagram laadt feed of media', keywords: ['instagram', 'feed', 'foto', 'video', 'likes', 'aanbeveling'] },
                        { label: 'meer soorten data betekent meer API-verzoeken', keywords: ['meer data', 'meer verzoek', 'api', 'continu', 'verschillende data'] },
                    ],
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
                        'Review de API-URL alsof je hem moet vrijgeven aan een schoolsite. Leg uit waarvoor een apiKey dient, welk misbruikrisico ontstaat als je een echte sleutel deelt en welke veilige regel je daarom toepast.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een apiKey is als een pasje: het bewijst wie jij bent. Zo kan de API-aanbieder bijhouden wie de API gebruikt en misbruik blokkeren. Omdat een echte sleutel toegang kan geven tot jouw account of tegoed, houd je die altijd privé.',
                    points: 15,
                    minLength: 90,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'identificatie of toegang benoemd', keywords: ['identificeert', 'wie', 'toegang', 'pasje', 'sleutel'] },
                        { label: 'misbruik of blokkeren benoemd', keywords: ['misbruik', 'blokkeren', 'limiet', 'rate limit', 'bijhouden'] },
                        { label: 'privé houden', keywords: ['privé', 'niet delen', 'nooit delen', 'geheim', 'niet openbaar'] },
                        { label: 'risico voor account of tegoed', keywords: ['account', 'tegoed', 'kosten', 'quota', 'rechten'] },
                    ],
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
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'pokeapi-url', keywords: ['pokeapi', 'api/v2', 'pokemon'] },
                        { label: 'charizard in het pad', keywords: ['charizard', '/charizard'] },
                        { label: 'pikachu vervangen', keywords: ['vervang', 'pikachu', 'pad', 'resource'] },
                    ],
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
