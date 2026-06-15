import type { DataViewerConfig } from '../DataViewer';

export const networkNavigatorConfig: DataViewerConfig = {
    missionId: 'network-navigator',
    title: 'Network Navigator',
    introEmoji: '🌍',
    introTitle: 'Word een Network Navigator',
    introDescription:
        'Als je een bericht stuurt op Instagram, maakt dat bericht een reis langs servers, routers en datacenters voordat het aankomt. Jij gaat als netwerk-engineer uitzoeken hoe het internet werkt — van IP-adressen en DNS tot routers en foutcodes.',
    missionGoal: {
        primaryGoal: 'Ik leg uit hoe een bericht door het internet reist en gebruik data om netwerkproblemen te herkennen.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Alle drie datasets zijn onderzocht en de kernvragen zijn beantwoord.',
        },
        evidence: 'Antwoorden over datapakketten, reactietijden en HTTP-foutcodes.',
    },
    introFeatures: [
        'Analyseer hoe een bericht reist van je telefoon naar een server',
        'Vergelijk reactietijden van populaire websites',
        'Beoordeel wat HTTP-foutcodes betekenen',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'netwerk-stappen',
            title: 'Reis van een Instagram-bericht: de stappen',
            description:
                'Elk bericht dat je verstuurt, doorloopt deze stappen. Bekijk de tabel en beantwoord de vragen over hoe het netwerk werkt.',
            type: 'table',
            columns: [
                { key: 'stap', label: 'Stap', sortable: false },
                { key: 'locatie', label: 'Locatie', sortable: true },
                { key: 'component', label: 'Component', sortable: true },
                { key: 'actie', label: 'Wat gebeurt hier?', sortable: false },
                { key: 'tijd_ms', label: 'Tijd (ms)', sortable: true },
            ],
            rows: [
                { stap: 1, locatie: 'Telefoon', component: 'App', actie: 'Bericht wordt aangemaakt en verpakt als datapakket', tijd_ms: 1 },
                { stap: 2, locatie: 'Thuis', component: 'WiFi-router', actie: 'Pakket wordt doorgestuurd naar het internet', tijd_ms: 3 },
                { stap: 3, locatie: 'Buurt', component: 'DNS-server', actie: 'instagram.com wordt vertaald naar IP-adres', tijd_ms: 8 },
                { stap: 4, locatie: 'Internet', component: 'Routers (x12)', actie: 'Pakket springt via 12 routers naar de server', tijd_ms: 22 },
                { stap: 5, locatie: 'Datacenter VS', component: 'Instagram-server', actie: 'Server ontvangt pakket en slaat bericht op', tijd_ms: 5 },
                { stap: 6, locatie: 'Internet', component: 'Routers (x12)', actie: 'Bevestiging reist terug naar je telefoon', tijd_ms: 20 },
                { stap: 7, locatie: 'Telefoon', component: 'App', actie: 'App toont "verzonden" en updatet de chat', tijd_ms: 2 },
            ],
            questions: [
                {
                    id: 'q1-totaaltijd',
                    question:
                        'Hoeveel milliseconden duurt de complete reis van het bericht in totaal?',
                    type: 'number-input',
                    correctAnswer: 61,
                    explanation:
                        'Tel alle tijden op: 1 + 3 + 8 + 22 + 5 + 20 + 2 = 61 ms. Dat is minder dan een tiende van een seconde! Dat voelt "instant" aan voor de gebruiker. Sorteer op "Stap" om de volgorde te zien.',
                    points: 15,
                },
                {
                    id: 'q2-dns-functie',
                    question: 'Wat doet een DNS-server?',
                    type: 'multiple-choice',
                    options: [
                        'Slaat berichten op als er geen verbinding is',
                        'Vertaalt een domeinnaam (instagram.com) naar een IP-adres',
                        'Versleutelt het bericht zodat niemand het kan lezen',
                        'Stuurt het bericht door naar de dichtstbijzijnde router',
                    ],
                    correctAnswer: 'Vertaalt een domeinnaam (instagram.com) naar een IP-adres',
                    explanation:
                        'DNS staat voor Domain Name System. Het is het "telefoonboek van het internet": je geeft de naam (instagram.com) en DNS geeft het adres terug (bijv. 31.13.92.36). Zonder DNS zou je IP-adressen uit je hoofd moeten kennen.',
                    points: 15,
                },
                {
                    id: 'q3-router-observatie',
                    question:
                        'Stap 4 en 6 nemen samen de meeste tijd in beslag. Wat zegt dit over waar je internet-snelheid het meeste van afhangt?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De reis door het internet (via routers) neemt het meeste tijd in beslag — niet de app of de server. Dit heet "latency" of vertraging: hoe ver de data moet reizen en via hoeveel routers. Servers in de VS zijn verder weg dan servers in Amsterdam, waardoor de latency hoger is. Dat is waarom Netflix en YouTube servers dichter bij gebruikers plaatsen (CDN).',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'website-reactietijden',
            title: 'Reactietijd van populaire websites (ping)',
            description:
                'Onderzoekers maten de reactietijd (ping) van populaire websites vanuit Nederland in milliseconden. Hoe lager, hoe sneller.',
            type: 'bar-chart',
            chartData: [
                { label: 'Google.nl', value: 8, color: '#202023' },
                { label: 'Wikipedia', value: 15, color: '#202023' },
                { label: 'Instagram', value: 34, color: '#ff3c21' },
                { label: 'YouTube', value: 12, color: '#ff3c21' },
                { label: 'TikTok', value: 45, color: '#202023' },
                { label: 'Amazon.com', value: 72, color: '#e1ff01' },
            ],
            questions: [
                {
                    id: 'q4-snelste-site',
                    question: 'Welke website heeft de laagste reactietijd vanuit Nederland?',
                    type: 'multiple-choice',
                    options: ['YouTube', 'Wikipedia', 'Google.nl', 'Instagram'],
                    correctAnswer: 'Google.nl',
                    explanation:
                        'Google.nl heeft met 8 ms de laagste reactietijd. Dit komt doordat Google enorme servers en CDN-knooppunten (Content Delivery Networks) in Nederland heeft. Amazon.com is het langzaamst (72 ms) omdat de hoofdserver ver weg staat.',
                    points: 10,
                },
                {
                    id: 'q5-verschil-tiktok-google',
                    question:
                        'Hoeveel keer trager is TikTok vergeleken met Google.nl?',
                    type: 'number-input',
                    correctAnswer: 5.6,
                    explanation:
                        'TikTok: 45 ms. Google: 8 ms. 45 ÷ 8 = 5,625 → ≈ 5,6 keer trager. TikTok heeft veel servers in Azië. Voor een spelletje of video merk je dit nauwelijks, maar voor realtime toepassingen (videobellen, online gaming) is elke milliseconde belangrijk.',
                    points: 15,
                },
                {
                    id: 'q6-latency-verklaring',
                    question:
                        'Amazon.com is een grote, professionele website maar toch het traagst. Wat is de meest logische verklaring?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Amazon.com is een Amerikaans bedrijf. Zelfs met CDN moeten sommige verzoeken naar servers in de VS. De fysieke afstand (over de Atlantische Oceaan) zorgt voor extra latency. Bedrijven die Europa serieus nemen (zoals Google en Netflix) plaatsen servers in Nederlandse datacenters om dit te vermijden.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'http-foutcodes',
            title: 'HTTP-foutcodes: wat betekenen ze?',
            description:
                'Als iets misgaat op het internet, krijg je een foutcode. Hieronder staan vier veelvoorkomende codes. Ze helpen je begrijpen wat er mis is.',
            type: 'document-cards',
            cards: [
                {
                    title: '404 — Not Found',
                    icon: '🔍',
                    content:
                        'De server is bereikbaar, maar de pagina die je zoekt bestaat niet. Dit zie je als je een verkeerde URL typt (bijv. een typefout in het pad na de slash). De server zegt letterlijk: "Ik ben er wel, maar ik weet niet waar je naar vraagt." Tip: controleer of je de URL goed hebt getypt.',
                },
                {
                    title: '500 — Internal Server Error',
                    icon: '💥',
                    content:
                        'Er is iets misgegaan aan de kant van de server — niet aan de kant van jou. De server heeft een interne fout. Dit kan komen door bugs in de code, een database die niet reageert, of een overbelaste server. Als dit gebeurt bij een website, is er niets wat jij kunt doen — het is het probleem van de websitebeheerder.',
                },
                {
                    title: '403 — Forbidden',
                    icon: '🚫',
                    content:
                        'Je bent bij de server, maar je hebt geen toegang. Dit zie je bijvoorbeeld als je een beveiligde pagina probeert te openen zonder in te loggen, of als je te snel te veel verzoeken stuurt (rate limiting). De server zegt: "Ik ken je verzoek, maar je mag hier niet komen."',
                },
                {
                    title: '200 — OK',
                    icon: '✅',
                    content:
                        'Alles werkt perfect! Elke succesvolle API-response of pagina-laad stuurt een 200-statuscode. Je ziet deze code normaal niet, maar apps en browsers controleren hem altijd. Een 200 betekent: "Verzoek ontvangen, begrepen, en hier is je antwoord." Dit is de gewenste situatie.',
                },
            ],
            questions: [
                {
                    id: 'q7-foutcode-herkennen',
                    question:
                        'Je bezoekt een website en krijgt de melding "Pagina niet gevonden". Welke HTTP-foutcode hoort hierbij?',
                    type: 'multiple-choice',
                    options: ['200', '403', '404', '500'],
                    correctAnswer: '404',
                    explanation:
                        '"Pagina niet gevonden" is de 404-fout: de server bestaat, maar de specifieke pagina niet. 500 is een serverfout (server crashed), 403 is "geen toegang" en 200 betekent succes.',
                    points: 15,
                },
                {
                    id: 'q8-foutcode-uitleg',
                    question:
                        'Leg in eigen woorden uit wat het verschil is tussen een 404-fout en een 500-fout. Aan welke kant ligt het probleem bij elk?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Bij een 404-fout ligt het probleem aan de kant van de aanvraag: de URL bestaat niet. Bij een 500-fout ligt het probleem aan de kant van de server: er is iets intern misgegaan. Als gebruiker kun je bij een 404 de URL controleren; bij een 500 kun je niets doen — je moet wachten tot de beheerder het repareert.',
                    points: 10,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🌐',
            title: 'Netwerk Engineer!',
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '📡',
            title: 'Internetdetective',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔌',
            title: 'Netwerk Verkenner',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#202023',
        },
    ],

    takeaways: [
        'DNS vertaalt domeinnamen naar IP-adressen — het "telefoonboek van het internet"',
        'Een bericht reist in milliseconden via routers door het internet',
        'Latency (vertraging) hangt af van de fysieke afstand en het aantal routers',
        '404 = pagina niet gevonden, 500 = serverfout, 200 = alles OK',
        'CDN-servers dicht bij gebruikers zorgen voor lagere reactietijden',
    ],
};

export default networkNavigatorConfig;
