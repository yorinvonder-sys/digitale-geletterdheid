import type { SimulationLabConfig, VisualData } from '../SimulationLab';

// ─── computeVisuals ───────────────────────────────────────────────────────────
// Switch/case over simId — no eval, pure TypeScript.

function computeVisuals(
    simId: string,
    params: Record<string, number | string | boolean>
): VisualData {
    // ── Sim 1: Social media profiel → Meter (Privacy Score) ──────────────────
    if (simId === 'social-media-profiel') {
        // profielfoto: 0 = publiek, 1 = vrienden, 2 = niemand
        const foto = params['profielfoto'] as number ?? 0;
        // locatie: true = aan, false = uit  (uit = beter voor privacy)
        const locatie = params['locatie-delen'] as boolean ?? true;
        // zoekbaarheid: true = aan, false = uit
        const zoekbaarheid = params['zoekbaarheid'] as boolean ?? true;

        // Score: foto 0→10, 1→35, 2→40; locatie uit→30; zoekbaarheid uit→30
        const fotoScore = foto === 0 ? 10 : foto === 1 ? 35 : 40;
        const locatieScore = locatie ? 0 : 30;
        const zoekbaarScore = zoekbaarheid ? 0 : 30;
        const score = fotoScore + locatieScore + zoekbaarScore;

        const sublabel =
            score <= 20
                ? 'Iedereen kan jou vinden en volgen'
                : score <= 50
                ? 'Gedeeltelijk beschermd, maar nog risico\'s'
                : score <= 80
                ? 'Goed beschermd'
                : 'Maximale privacy ingesteld';

        return { type: 'meter', data: { value: score, label: 'Privacy Score', sublabel } };
    }

    // ── Sim 2: App permissies → BarChart (Dataverzameling) ───────────────────
    if (simId === 'app-permissies') {
        const camera = params['camera'] as boolean ?? false;
        const microfoon = params['microfoon'] as boolean ?? false;
        const locatie = params['locatie'] as boolean ?? false;
        const contacten = params['contacten'] as boolean ?? false;
        const opslag = params['opslag'] as boolean ?? false;

        // Data sensitivity score per category (1 = basic, 5 = very sensitive)
        const bars = [
            {
                label: 'Camera',
                value: camera ? 4 : 0,
                color: camera ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Microfoon',
                value: microfoon ? 5 : 0,
                color: microfoon ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Locatie',
                value: locatie ? 5 : 0,
                color: locatie ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Contacten',
                value: contacten ? 3 : 0,
                color: contacten ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Opslag',
                value: opslag ? 2 : 0,
                color: opslag ? '#E8956A' : '#E7D8BD',
            },
        ];

        return { type: 'bar-chart', data: bars };
    }

    // ── Sim 3: Cookie-instellingen → Comparison (Website ziet vs Privacy) ────
    if (simId === 'cookie-instellingen') {
        const cookies = params['cookies'] as string ?? 'Alle cookies';

        if (cookies === 'Alle cookies') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Wat de website ziet',
                    leftItems: [
                        { icon: '📍', label: 'Jouw locatie (stad/land)' },
                        { icon: '🖱️', label: 'Elke klik en scroll die je maakt' },
                        { icon: '🛒', label: 'Wat je bekijkt en koopt' },
                        { icon: '👤', label: 'Jouw leeftijdscategorie en interesses' },
                        { icon: '📱', label: 'Je apparaat, browser en OS' },
                        { icon: '🔗', label: 'Van welke site je komt' },
                    ],
                    rightTitle: 'Jouw privacy',
                    rightItems: [
                        { icon: '❌', label: 'Geen anonimiteit mogelijk' },
                        { icon: '❌', label: 'Profiel wordt opgebouwd' },
                        { icon: '❌', label: 'Gerichte advertenties' },
                        { icon: '❌', label: 'Data kan worden doorverkocht' },
                    ],
                },
            };
        }

        if (cookies === 'Functioneel alleen') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Wat de website ziet',
                    leftItems: [
                        { icon: '🔐', label: 'Inlogstatus (nodig voor de site)' },
                        { icon: '🛒', label: 'Winkelmandje-inhoud' },
                        { icon: '⚙️', label: 'Taalvoorkeur' },
                    ],
                    rightTitle: 'Jouw privacy',
                    rightItems: [
                        { icon: '✅', label: 'Geen tracking-profiel' },
                        { icon: '✅', label: 'Geen advertentiedoorverkoop' },
                        { icon: '⚠️', label: 'Site werkt volledig' },
                        { icon: '⚠️', label: 'Sessie-info tijdelijk opgeslagen' },
                    ],
                },
            };
        }

        // Geen cookies
        return {
            type: 'comparison',
            data: {
                leftTitle: 'Wat de website ziet',
                leftItems: [
                    { icon: '🌐', label: 'Alleen je IP-adres (via server)' },
                    { icon: '📄', label: 'Welke pagina je bezoekt' },
                ],
                rightTitle: 'Jouw privacy',
                rightItems: [
                    { icon: '✅', label: 'Maximale privacy' },
                    { icon: '✅', label: 'Geen profiel opgeslagen' },
                    { icon: '⚠️', label: 'Je blijft niet ingelogd' },
                    { icon: '⚠️', label: 'Winkelmandje vergeten bij sluiten' },
                ],
            },
        };
    }

    // Fallback
    return { type: 'meter', data: { value: 0, label: 'Geen data' } };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const privacyByDesignConfig: SimulationLabConfig = {
    missionId: 'privacy-by-design',
    title: 'Privacy by Design',
    introEmoji: '🔐',
    introTitle: 'Privacy by Design',
    introDescription:
        'Ontdek hoe jouw digitale keuzes bepalen hoeveel anderen over jou weten. Speel met instellingen en zie direct wat er verandert.',
    introFeatures: [
        'Sim 1 — Pas je sociale media instellingen aan',
        'Sim 2 — Kies welke app-permissies je geeft',
        'Sim 3 — Begrijp de cookie-afruil',
    ],
    computeVisuals,
    simulations: [
        {
            id: 'social-media-profiel',
            title: 'Jouw sociale media profiel',
            description:
                'Stel de privacyinstellingen van je profiel in. Pas de schuifjes aan en kijk hoe jouw Privacy Score verandert.',
            visualType: 'meter',
            maxScore: 30,
            followUp: {
                question: 'Welk Privacy by Design-principe houdt in dat privacy de standaardinstelling moet zijn?',
                options: ['Privacy als preventie', 'Privacy als standaard (default)', 'Privacy ingebouwd in ontwerp', 'End-to-end beveiliging'],
                correctIndex: 1,
                explanation: 'Privacy als standaard (Privacy by Default) betekent dat de meest privacyvriendelijke instelling automatisch actief is, zonder dat de gebruiker iets hoeft te doen.',
                bonusPoints: 5,
            },
            parameters: [
                {
                    id: 'profielfoto',
                    label: 'Profielfoto zichtbaar voor',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'locatie-delen',
                    label: 'Locatie automatisch delen',
                    type: 'toggle',
                    defaultToggle: true,
                },
                {
                    id: 'zoekbaarheid',
                    label: 'Vindbaar via zoekmachines',
                    type: 'toggle',
                    defaultToggle: true,
                },
            ],
            questions: [
                {
                    id: 'sp1-q1',
                    question:
                        'Wat gebeurt er met jouw Privacy Score als je profielfoto op "publiek" staat én je locatie deelt?',
                    type: 'multiple-choice',
                    options: [
                        'De score is hoog, want iedereen kan je vinden',
                        'De score is laag, want jij deelt veel informatie',
                        'De score verandert niet door de profielfoto',
                        'Locatie-sharing heeft geen effect op de score',
                    ],
                    correctAnswer: 'De score is laag, want jij deelt veel informatie',
                    explanation:
                        'Hoe meer je deelt, hoe lager jouw Privacy Score. Een publieke foto en gedeelde locatie geven anderen veel informatie over jou.',
                    points: 10,
                },
                {
                    id: 'sp1-q2',
                    question: 'Welke instelling verbetert de Privacy Score het meest?',
                    type: 'multiple-choice',
                    options: [
                        'Profielfoto op "vrienden" zetten',
                        'Locatie-delen uitschakelen',
                        'Zoekbaarheid uitschakelen',
                        'Locatie-delen én zoekbaarheid allebei uitschakelen',
                    ],
                    correctAnswer: 'Locatie-delen én zoekbaarheid allebei uitschakelen',
                    explanation:
                        'Locatie en zoekbaarheid leveren elk 30 punten op. Beide uitschakelen geeft de grootste verbetering — samen 60 van de 100 punten.',
                    points: 10,
                },
                {
                    id: 'sp1-q3',
                    question: 'Wat is het grootste risico van je locatie automatisch delen op sociale media?',
                    type: 'multiple-choice',
                    options: [
                        'Je profiel ziet er minder mooi uit',
                        'Mensen weten waar je bent en wanneer je niet thuis bent',
                        'Je batterij gaat sneller leeg',
                        'Je krijgt minder volgers',
                    ],
                    correctAnswer: 'Mensen weten waar je bent en wanneer je niet thuis bent',
                    explanation:
                        'Locatiedata is erg gevoelig. Het verraadt niet alleen waar je nu bent, maar ook patronen: wanneer je slaapt, werkt, of op vakantie bent.',
                    points: 10,
                },
            ],
        },
        {
            id: 'app-permissies',
            title: 'App permissies instellen',
            description:
                'Een nieuwe app vraagt toegang tot jouw telefoon. Zet permissies aan of uit en zie welke data er verzameld wordt.',
            visualType: 'bar-chart',
            maxScore: 40,
            parameters: [
                { id: 'camera', label: 'Camera', type: 'toggle', defaultToggle: false },
                { id: 'microfoon', label: 'Microfoon', type: 'toggle', defaultToggle: false },
                { id: 'locatie', label: 'Locatie', type: 'toggle', defaultToggle: false },
                { id: 'contacten', label: 'Contacten', type: 'toggle', defaultToggle: false },
                { id: 'opslag', label: 'Opslag', type: 'toggle', defaultToggle: false },
            ],
            questions: [
                {
                    id: 'ap1-q1',
                    question:
                        'Welke permissie verzamelt de meest privacy-gevoelige data?',
                    type: 'multiple-choice',
                    options: ['Camera', 'Microfoon of Locatie', 'Opslag', 'Contacten'],
                    correctAnswer: 'Microfoon of Locatie',
                    explanation:
                        'Microfoon en locatie scoren het hoogst (5 punten elk). Via een microfoon kunnen gesprekken worden afgeluisterd; locatie onthult al je dagelijkse bewegingen.',
                    points: 10,
                },
                {
                    id: 'ap1-q2',
                    question:
                        'Een spelletjes-app vraagt toegang tot je contacten. Waarom is dat verdacht?',
                    type: 'multiple-choice',
                    options: [
                        'Spellen hebben contacten nodig om scores bij te houden',
                        'Een spelletje heeft contacten normaal gesproken helemaal niet nodig',
                        'Het is wettelijk verplicht voor apps',
                        'Contacten bevatten geen gevoelige data',
                    ],
                    correctAnswer: 'Een spelletje heeft contacten normaal gesproken helemaal niet nodig',
                    explanation:
                        'Vraag jezelf altijd af: heeft deze app deze permissie écht nodig? Een spelletje zonder sociale functies heeft geen reden om je contactenlijst te lezen.',
                    points: 15,
                },
                {
                    id: 'ap1-q3',
                    question:
                        'Wat is het principe van "data minimalisatie" bij app-permissies?',
                    type: 'multiple-choice',
                    options: [
                        'Geef apps zo weinig permissies als mogelijk voor ze te laten werken',
                        'Verwijder apps die je niet gebruikt',
                        'Geef alle permissies om de app optimaal te laten werken',
                        'Permissies zijn alleen relevant bij betaalde apps',
                    ],
                    correctAnswer: 'Geef apps zo weinig permissies als mogelijk voor ze te laten werken',
                    explanation:
                        'Data minimalisatie is een AVG-recht en een privacyprincipe: apps mogen alleen data verzamelen die strikt nodig is. Geef nooit meer toegang dan de app functioneel nodig heeft.',
                    points: 15,
                },
            ],
        },
        {
            id: 'cookie-instellingen',
            title: 'Cookie-instellingen begrijpen',
            description:
                'Kies jouw cookie-voorkeur en vergelijk wat een website dan ziet versus wat jij privé houdt.',
            visualType: 'comparison',
            maxScore: 30,
            parameters: [
                {
                    id: 'cookies',
                    label: 'Cookie-keuze',
                    type: 'select',
                    options: ['Alle cookies', 'Functioneel alleen', 'Geen cookies'],
                    defaultOption: 'Alle cookies',
                },
            ],
            questions: [
                {
                    id: 'ck1-q1',
                    question:
                        'Wat betekent het als een website zegt "we gebruiken cookies voor een betere ervaring"?',
                    type: 'multiple-choice',
                    options: [
                        'De site wordt sneller voor jou',
                        'De site slaat jouw gedrag op om gerichte advertenties te tonen',
                        'Je hoeft nooit meer in te loggen',
                        'Cookies zijn altijd anoniem en onschadelijk',
                    ],
                    correctAnswer: 'De site slaat jouw gedrag op om gerichte advertenties te tonen',
                    explanation:
                        '"Betere ervaring" betekent in de praktijk vaak: jouw klikgedrag, interesses en browserprofiel worden opgeslagen en doorverkocht aan adverteerders.',
                    points: 10,
                },
                {
                    id: 'ck1-q2',
                    question: 'Welk cookie-type heb je minimaal nodig om een webshop te gebruiken?',
                    type: 'multiple-choice',
                    options: [
                        'Geen cookies — je kunt alles anoniem doen',
                        'Functionele cookies — voor je winkelmandje en inlogstatus',
                        'Alle cookies — anders werkt de webshop niet',
                        'Tracking-cookies — voor persoonlijke aanbevelingen',
                    ],
                    correctAnswer: 'Functionele cookies — voor je winkelmandje en inlogstatus',
                    explanation:
                        'Functionele cookies zijn de minimaal benodigde categorie. Ze onthouden je sessie en winkelwagen, maar bouwen geen profiel van jou op.',
                    points: 10,
                },
                {
                    id: 'ck1-q3',
                    question:
                        'Je kiest "Geen cookies". Welk nadeel heeft dit voor jou als gebruiker?',
                    type: 'multiple-choice',
                    options: [
                        'De site laadt langzamer',
                        'Je blijft niet ingelogd en je winkelmandje wordt vergeten',
                        'Je kunt de site helemaal niet meer bezoeken',
                        'De site stuurt je meer reclame-e-mails',
                    ],
                    correctAnswer: 'Je blijft niet ingelogd en je winkelmandje wordt vergeten',
                    explanation:
                        'Zonder cookies kan de site jou niet herkennen tussen pagina\'s of sessies door. Je moet elke keer opnieuw inloggen en kunt niets in je mandje bewaren.',
                    points: 10,
                },
            ],
        },
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Privacy Expert',
            color: '#5F947D',
        },
        {
            minScore: 70,
            emoji: '🔐',
            title: 'Privacy Pro',
            color: '#D97848',
        },
        {
            minScore: 50,
            emoji: '🛡️',
            title: 'Privacy Beginner',
            color: '#445865',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Startende Privacy Ontwerper',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '📖',
            title: 'Aan het leren',
            color: '#445865',
        },
    ],
    takeaways: [
        'Je privacyinstellingen bepalen hoeveel anderen over jou weten — controleer ze actief.',
        'Locatie en microfoon zijn de meest privacy-gevoelige permissies op je telefoon.',
        'Data minimalisatie: geef apps alleen toegang tot wat ze écht nodig hebben.',
        'Functionele cookies zijn genoeg voor de meeste websites — tracking-cookies zijn optioneel.',
        'Privacy is geen alles-of-niets keuze: kleine aanpassingen maken al groot verschil.',
    ],
};
