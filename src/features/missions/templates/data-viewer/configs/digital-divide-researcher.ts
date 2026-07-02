import type { DataViewerConfig } from '../DataViewer';

export const digitalDivideResearcherConfig: DataViewerConfig = {
    missionId: 'digital-divide-researcher',
    title: 'Connectivity Researcher',
    introEmoji: '🌍',
    introTitle: 'Word een Connectivity Researcher',
    introDescription:
        'Hoe snel is het internet in verschillende landen? Wie gebruikt welke apparaten? En hoe zijn die trends de afgelopen jaren veranderd? Jij gaat als onderzoeker data over internetconnectiviteit en apparaatgebruik analyseren.',
    introFeatures: [
        'Analyseer gemiddelde internetsnelheden per land',
        'Vergelijk smartphonegebruik per leeftijdsgroep',
        'Onderzoek trends in platform- en apparaatadoptie',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'internetsnelheid-landen',
            title: 'Gemiddelde downloadsnelheid (Mbps) per land — 2024 (Speedtest Global Index)',
            description:
                'De gemiddelde downloadsnelheid zegt iets over de kwaliteit van internetinfrastructuur in een land. Bekijk de tabel en zoek patronen.',
            type: 'table',
            columns: [
                { key: 'land', label: 'Land', sortable: true },
                { key: 'mobiel_mbps', label: 'Mobiel (Mbps)', sortable: true },
                { key: 'vast_mbps', label: 'Vast (Mbps)', sortable: true },
                { key: 'regio', label: 'Regio', sortable: true },
                { key: 'top10', label: 'Top 10 wereldwijd?', sortable: true },
            ],
            rows: [
                { land: 'Nederland', mobiel_mbps: 112, vast_mbps: 219, regio: 'West-Europa', top10: 'Ja' },
                { land: 'Zuid-Korea', mobiel_mbps: 138, vast_mbps: 254, regio: 'Oost-Azië', top10: 'Ja' },
                { land: 'Noorwegen', mobiel_mbps: 121, vast_mbps: 231, regio: 'Noord-Europa', top10: 'Ja' },
                { land: 'Duitsland', mobiel_mbps: 74, vast_mbps: 146, regio: 'West-Europa', top10: 'Nee' },
                { land: 'Brazilië', mobiel_mbps: 48, vast_mbps: 93, regio: 'Zuid-Amerika', top10: 'Nee' },
                { land: 'India', mobiel_mbps: 31, vast_mbps: 58, regio: 'Zuid-Azië', top10: 'Nee' },
                { land: 'Nigeria', mobiel_mbps: 18, vast_mbps: 21, regio: 'Afrika', top10: 'Nee' },
                { land: 'Indonesië', mobiel_mbps: 22, vast_mbps: 34, regio: 'Zuidoost-Azië', top10: 'Nee' },
            ],
            questions: [
                {
                    id: 'q1-snelste-land',
                    question:
                        'Welk land in de tabel heeft de hoogste vaste internetsnelheid?',
                    type: 'multiple-choice',
                    options: ['Nederland', 'Zuid-Korea', 'Noorwegen', 'Duitsland'],
                    correctAnswer: 'Zuid-Korea',
                    explanation:
                        'Zuid-Korea heeft de hoogste vaste snelheid in de tabel: 254 Mbps. Nederland (219 Mbps) en Noorwegen (231 Mbps) staan ook in de top 10 wereldwijd. Sorteer op "Vast (Mbps)" om de rangschikking direct te zien.',
                    points: 15,
                },
                {
                    id: 'q2-verschil-nl-nigeria',
                    question:
                        'Hoeveel Mbps verschil is er in mobiele snelheid tussen Nederland en Nigeria?',
                    type: 'number-input',
                    correctAnswer: 94,
                    explanation:
                        'Nederland: 112 Mbps mobiel. Nigeria: 18 Mbps mobiel. Verschil: 112 − 18 = 94 Mbps. Dit grote verschil weerspiegelt de staat van mobiele infrastructuur: Nederland heeft breed uitgerold 4G/5G, terwijl Nigeria nog grotendeels op 3G/4G draait in stedelijke gebieden.',
                    points: 15,
                },
                {
                    id: 'q3-oorzaak-observatie',
                    question:
                        'Duitsland scoort lager dan Nederland en Noorwegen, terwijl het een welvarend land is. Noem twee mogelijke verklaringen voor dit verschil.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Mogelijke verklaringen: (1) Infrastructuurkeuzes — Duitsland heeft lang ingezet op koperbekabeling (DSL) in plaats van glasvezel; Nederland schakelde eerder over op glasvezel. (2) Geografie — Duitsland heeft meer platteland en kleine kernen die moeilijker en duurder zijn aan te sluiten. (3) Regelgeving — het tempo van netwerkinvesteringen verschilt per land. Snelheidsdata meten de huidige staat van het netwerk, niet de welvaart van een land op zichzelf.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'smartphone-gebruik-leeftijd',
            title: 'Smartphonegebruik (%) per leeftijdsgroep — Nederland 2024 (CBS)',
            description:
                'Het CBS meet jaarlijks hoeveel Nederlanders een smartphone gebruiken, uitgesplitst naar leeftijdsgroep. Bekijk hoe gebruik varieert over generaties.',
            type: 'bar-chart',
            chartData: [
                { label: '12-17 jaar', value: 98, color: '#202023' },
                { label: '18-24 jaar', value: 99, color: '#202023' },
                { label: '25-34 jaar', value: 97, color: '#202023' },
                { label: '35-49 jaar', value: 93, color: '#e1ff01' },
                { label: '50-64 jaar', value: 82, color: '#202023' },
                { label: '65-74 jaar', value: 68, color: '#ff3c21' },
                { label: '75+ jaar', value: 44, color: '#ff3c21' },
            ],
            questions: [
                {
                    id: 'q4-laagste-gebruik',
                    question:
                        'Hoeveel procentpunt verschil is er in smartphonegebruik tussen de 18-24 jaar groep en de 75+ jaar groep?',
                    type: 'number-input',
                    correctAnswer: 55,
                    explanation:
                        '18-24 jaar: 99%. 75+ jaar: 44%. Verschil: 99 − 44 = 55 procentpunt. Dit verschil is groter dan het verschil tussen de meeste andere leeftijdsgroepen en weerspiegelt dat ouderen later zijn begonnen met smartphonegebruik dan jongere generaties die ermee zijn opgegroeid.',
                    points: 15,
                },
                {
                    id: 'q5-gemiddelde-gebruik',
                    question:
                        'Wat is het gemiddelde smartphonegebruik van alle 7 leeftijdsgroepen in de grafiek?',
                    type: 'number-input',
                    correctAnswer: 83,
                    explanation:
                        'Totaal: 98 + 99 + 97 + 93 + 82 + 68 + 44 = 581. Gemiddelde: 581 ÷ 7 ≈ 83%. De jongere leeftijdsgroepen zitten ver boven dit gemiddelde; de oudste groep er ver onder.',
                    points: 10,
                },
                {
                    id: 'q6-trend-observatie',
                    question:
                        'Wat verwacht jij dat er met het smartphonegebruik van de 75+ groep zal gebeuren in de komende 10 jaar? Onderbouw je verwachting.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Verwachting: het gebruik zal waarschijnlijk stijgen. De huidige 65-74 jarigen (68% gebruik) worden de nieuwe 75-84 jarigen en nemen hun smartphonegewoonten mee. Bovendien worden smartphones steeds eenvoudiger in gebruik (grotere letters, spraakbediening). Het is echter ook mogelijk dat de alleroudste groep (85+) altijd een laag gebruik zal houden, ongeacht de trend.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'connectiviteit-begrippen',
            title: 'Vier begrippen voor connectivity-onderzoek',
            description:
                'Als connectivity-onderzoeker werk je met vaste concepten. Hier zijn vier kernbegrippen die je nodig hebt om data te lezen en te vergelijken.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Begrip 1: Bandbreedte vs. latency',
                    icon: '📡',
                    content:
                        'Bandbreedte (Mbps) = hoeveel data per seconde kan worden overgedragen — vergelijkbaar met de breedte van een waterleiding. Latency (ms) = hoe lang het duurt voor een datapakket aankomt — vergelijkbaar met de afstand tot de kraan. Hoge bandbreedte is goed voor het streamen van video. Lage latency is cruciaal voor videogamen of videogesprekken.',
                },
                {
                    title: 'Begrip 2: Mobiel vs. vast internet',
                    icon: '📶',
                    content:
                        'Vast internet (via kabel of glasvezel) is doorgaans sneller en stabieler dan mobiel internet (via 4G/5G). Mobiel internet is flexibeler: je kunt het overal gebruiken. In landen met weinig vaste infrastructuur — zoals in delen van Afrika — is mobiel internet juist de hoofdverbinding. Onderzoekers kijken naar beide om een volledig beeld te krijgen.',
                },
                {
                    title: 'Begrip 3: Penetratie vs. snelheid',
                    icon: '📊',
                    content:
                        'Penetratie (%) = hoeveel procent van de bevolking toegang heeft tot internet. Snelheid (Mbps) = hoe snel de verbinding is. Beide zijn aparte indicatoren: een land kan hoge penetratie hebben maar trage snelheden (veel mensen met traag internet), of hoge snelheid maar lage penetratie (weinig mensen met supersnel internet). Goed connectivity-onderzoek bekijkt altijd beide.',
                },
                {
                    title: 'Begrip 4: Adoptiecurve',
                    icon: '📈',
                    content:
                        'De adoptiecurve beschrijft hoe nieuwe technologie zich verspreidt in een bevolking: eerst vroege gebruikers (innovators), dan vroege meerderheid, dan late meerderheid, dan achterblijvers. Smartphones zijn in Nederland al in de "late meerderheid"—fase: meer dan 80% gebruikt er één. Nieuwe technologieën (zoals augmented reality-brillen) zitten nog in de "innovators"—fase.',
                },
            ],
            questions: [
                {
                    id: 'q7-begrip-toepassen',
                    question:
                        'Stel: een land heeft 95% internetpenetratie maar een gemiddelde snelheid van slechts 8 Mbps. Welke conclusie kun je trekken?',
                    type: 'multiple-choice',
                    options: [
                        'Het land heeft een uitstekende digitale infrastructuur',
                        'Bijna iedereen heeft toegang, maar de verbindingskwaliteit is laag',
                        'Slechts 5% van de bevolking heeft geen internet',
                        'B en C zijn allebei juist',
                    ],
                    correctAnswer: 'B en C zijn allebei juist',
                    explanation:
                        '95% penetratie betekent inderdaad dat slechts 5% geen toegang heeft — dat is correct. Tegelijk is 8 Mbps erg traag: HD-video streamen vereist minstens 5 Mbps, maar moderne apps en videogesprekken vragen veel meer. Het land scoort goed op bereik, maar matig op kwaliteit. Als connectivity-onderzoeker rapporteer je beide dimensies.',
                    points: 15,
                },
                {
                    id: 'q8-eigen-analyse',
                    question:
                        'Beschrijf hoe jij als connectivity-onderzoeker zou uitleggen waarom Zuid-Korea consistente topscoort op internetsnelheid. Gebruik minimaal twee factoren.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Mogelijke factoren: (1) Vroege glasvezelinvestering — de Koreaanse overheid investeerde al in de jaren 2000 massaal in glasvezelnetwerken, waardoor de infrastructuur nu is afgeschreven en uitgebouwd. (2) Bevolkingsdichtheid — de meeste Koreanen wonen in steden, wat het goedkoper maakt om snel internet aan te leggen. (3) Concurrentie — meerdere grote providers concurreren, wat innovatie en snelheid stimuleert. (4) Overheidsbeleid — de overheid stelde snelheidsdoelen en subsidieerde uitrol.',
                    points: 10,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🌍',
            title: 'Connectivity Expert!',
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '🔬',
            title: 'Data Onderzoeker',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Data Analist',
            color: '#e1ff01',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#202023',
        },
    ],

    takeaways: [
        'Zuid-Korea en Nederland behoren tot de snelste internetlanden ter wereld met gemiddeld 254 en 219 Mbps vaste snelheid',
        'Er is 55 procentpunt verschil in smartphonegebruik tussen 18-24 jarigen (99%) en 75-plussers (44%) in Nederland',
        'Bandbreedte en latency zijn twee aparte kwaliteitsmaten voor een internetverbinding',
        'Penetratie (bereik) en snelheid zijn beide nodig om connectiviteit volledig in kaart te brengen',
        'Adoptiesnelheid van technologie varieert sterk per leeftijdsgroep en land',
    ],
};

export default digitalDivideResearcherConfig;
