import type { DataViewerConfig } from '../DataViewer';

export const dataJournalistConfig: DataViewerConfig = {
    missionId: 'data-journalist',
    title: 'Data-journalist',
    introEmoji: '📰',
    introTitle: 'Word een data-journalist',
    introDescription:
        'Echte journalisten gebruiken data om verhalen te vertellen. Jij gaat cijfers over social media en schermtijd analyseren, patronen ontdekken en kritisch kijken naar nieuwsberichten. Wat zeggen de getallen écht?',
    missionGoal: {
        primaryGoal: 'Onderzoek datasets kritisch en schrijf een onderbouwde dataconclusie met bron- en patroonbewijs.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Alle drie datasets zijn onderzocht, observaties noemen concrete patronen of bronrisico’s en de score is minimaal 65/100.',
        },
        evidence: 'Leerlingbewijs: antwoorden over platformdata, schermtijd, bronbetrouwbaarheid en drie observaties met concrete datapatronen. Docentbewijs: score, fase-overzicht en zichtbare uitleg over patroon, vergelijking en belangenconflict.',
    },
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Newsroom start: kies eerst welke headline-hypothese je met data gaat checken.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Feedback koppelt headline, patroonbewijs en bronkwaliteit aan een publiceerbare conclusie.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling pint platform-, schermtijd- en bronbewijs voordat de conclusie telt.',
        antiBoringRule: 'Datajournalistiek moet voelen als een redactiekeuze met bewijsdruk, niet als losse quizvragen.',
        chromeAcceptance: 'Headlinekeuze, datasetkaarten, bronkaarten en publiceer-eindstaat blijven responsive zonder overflow.',
    },
    introFeatures: [
        'Analyseer een enquête over social media gebruik (leerjaar 2)',
        'Vergelijk schermtijd in zes landen en ontdek patronen',
        'Beoordeel nieuwsberichten op betrouwbaarheid',
    ],
    investigationHook: {
        title: 'De redactie wil een headline voor morgenochtend',
        role: 'Datajournalist',
        scenario:
            'Er ligt een artikel over jongeren en social media klaar, maar de headline mag pas online als jij genoeg bewijs vindt.',
        prompt: 'Welke headline-hypothese ga je als eerste factchecken?',
        contextLabel: 'Headline-spoor',
        continueLabel: 'Open de bewijsdesk',
        options: [
            {
                id: 'platform',
                label: 'TikTok domineert deze klasgroep',
                description: 'Je checkt of het meest genoemde platform echt uit de data blijkt.',
                evidenceChips: ['TikTok 4x', 'Instagram 3x', 'YouTube 3x'],
                impactCue: 'Patroon eerst, gevoel later',
                feedback: 'Goed spoor. Een sterke headline begint met een telbaar patroon, niet met een gevoel.',
            },
            {
                id: 'screen-time',
                label: 'Schermtijd verschilt sterk per land',
                description: 'Je vergelijkt grafiekbalken voordat je een internationale claim maakt.',
                evidenceChips: ['VS 7,7u', 'NL 4,2u', 'Japan 2,9u'],
                impactCue: 'Voorzichtige internationale vergelijking',
                feedback: 'Journalistiek scherp. Vergelijken maakt een claim sterker, zolang je de cijfers precies houdt.',
            },
            {
                id: 'source-risk',
                label: 'Niet elke bron verdient dezelfde plek',
                description: 'Je onderzoekt onafhankelijkheid, belangen en bewijssterkte van berichten.',
                evidenceChips: ['Meta-analyse 47', 'Intern onderzoek', 'Opinie'],
                impactCue: 'Bronsterkte voor publicatie',
                feedback: 'Sterke redactiekeuze. Bronkwaliteit bepaalt of een verhaal publiceerbaar is.',
            },
        ],
    },
    enableChat: true,
    chatRoleId: 'data-journalist',

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'enquete-social-media',
            title: 'Leerlingenquête: Social media gebruik',
            description:
                'In deze fictieve oefendataset vulden 12 leerlingen van groep 2B een enquête in over hun social media gebruik. Bekijk de tabel en beantwoord de vragen.',
            type: 'table',
            columns: [
                { key: 'naam', label: 'Naam', sortable: true },
                { key: 'platform', label: 'Platform', sortable: true },
                { key: 'uren_per_dag', label: 'Uren/dag', sortable: true },
                { key: 'leeftijd', label: 'Leeftijd', sortable: true },
                { key: 'gevoel_na_gebruik', label: 'Gevoel na gebruik', sortable: true },
            ],
            rows: [
                { naam: 'Emma', platform: 'Instagram', uren_per_dag: 3.5, leeftijd: 13, gevoel_na_gebruik: 'Blij' },
                { naam: 'Daan', platform: 'TikTok', uren_per_dag: 4.0, leeftijd: 14, gevoel_na_gebruik: 'Moe' },
                { naam: 'Sara', platform: 'TikTok', uren_per_dag: 2.5, leeftijd: 13, gevoel_na_gebruik: 'Blij' },
                { naam: 'Liam', platform: 'YouTube', uren_per_dag: 2.0, leeftijd: 14, gevoel_na_gebruik: 'Ontspannen' },
                { naam: 'Noor', platform: 'Instagram', uren_per_dag: 1.5, leeftijd: 14, gevoel_na_gebruik: 'Onzeker' },
                { naam: 'Jayden', platform: 'TikTok', uren_per_dag: 5.0, leeftijd: 13, gevoel_na_gebruik: 'Moe' },
                { naam: 'Fleur', platform: 'Snapchat', uren_per_dag: 1.0, leeftijd: 14, gevoel_na_gebruik: 'Blij' },
                { naam: 'Milan', platform: 'YouTube', uren_per_dag: 3.0, leeftijd: 14, gevoel_na_gebruik: 'Ontspannen' },
                { naam: 'Yara', platform: 'Instagram', uren_per_dag: 2.0, leeftijd: 13, gevoel_na_gebruik: 'Onzeker' },
                { naam: 'Tim', platform: 'TikTok', uren_per_dag: 3.5, leeftijd: 14, gevoel_na_gebruik: 'Moe' },
                { naam: 'Ines', platform: 'Snapchat', uren_per_dag: 0.5, leeftijd: 13, gevoel_na_gebruik: 'Blij' },
                { naam: 'Ravi', platform: 'YouTube', uren_per_dag: 2.5, leeftijd: 14, gevoel_na_gebruik: 'Ontspannen' },
            ],
            questions: [
                {
                    id: 'q1-platform',
                    question:
                        'Kies de headline die de data het best ondersteunt. Noem het platform, tel hoeveel leerlingen het gebruiken en vergelijk kort met minstens één ander platform.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De sterkste headline is dat TikTok in deze oefendataset het vaakst voorkomt: 4 leerlingen gebruiken TikTok (Daan, Sara, Jayden en Tim). Instagram en YouTube komen elk 3 keer voor, Snapchat 2 keer. Een datajournalist noemt dus zowel het patroon als de vergelijking.',
                    points: 15,
                    minLength: 65,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'TikTok als headline-spoor', keywords: ['tiktok', 'headline', 'kop'] },
                        { label: 'aantal leerlingen genoemd', keywords: ['4', 'vier', 'meeste'] },
                        { label: 'vergelijking met ander platform', keywords: ['instagram', 'youtube', 'snapchat', 'vergeleken', 'meer dan'] },
                        { label: 'journalistieke onderbouwing', keywords: ['data', 'bewijs', 'patroon', 'ondersteunt'] },
                    ],
                },
                {
                    id: 'q2-uren-14',
                    question:
                        'Hoeveel uur besteden 14-jarigen in deze enquête gemiddeld per dag aan social media? (Rond af op 1 decimaal)',
                    type: 'number-input',
                    showConfidence: true,
                    correctAnswer: 2.5,
                    explanation:
                        'De 14-jarigen zijn: Daan (4.0), Liam (2.0), Noor (1.5), Fleur (1.0), Milan (3.0), Tim (3.5), Ravi (2.5). Totaal: 17.5 ÷ 7 = 2.5 uur. Filter op leeftijd 14 om alle rijen te zien.',
                    points: 20,
                },
                {
                    id: 'q3-gevoel-observatie',
                    question:
                        'Wat valt je op als je kijkt naar het gevoel na gebruik en het aantal uren per dag? Beschrijf wat je ziet.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Leerlingen die meer dan 3 uur per dag op TikTok zitten, geven vaker aan zich "Moe" te voelen. Leerlingen met minder gebruik rapporteren vaker "Blij" of "Ontspannen". Sorteer op "Uren/dag" om het patroon te zien.',
                    points: 10,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'veel gebruik of meer uren', keywords: ['veel', 'meer', 'hoog', '3 uur', '4 uur', '5 uur'] },
                        { label: 'gevoel moe of vermoeid', keywords: ['moe', 'vermoeid', 'uitgeput'] },
                        { label: 'contrast met blij of ontspannen', keywords: ['blij', 'ontspannen', 'minder', 'laag'] },
                    ],
                },
            ],
            followUp: {
                question: 'Welk aspect is het belangrijkst bij het beoordelen van de betrouwbaarheid van een dataset?',
                options: ['De grootte van de dataset', 'De bron en methode van dataverzameling', 'Hoe recent de data is', 'Of de data je hypothese bevestigt'],
                correctIndex: 1,
                explanation: 'De bron en methode bepalen de validiteit. Grote of recente datasets kunnen alsnog onbetrouwbaar zijn als de verzamelmethode gebrekkig is.',
                bonusPoints: 0,
            },
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'schermtijd-landen',
            title: 'Schermtijd per land: internationaal vergelijk',
            description:
                'In deze fictieve oefencasus vergelijk je de gemiddelde dagelijkse schermtijd van 13-15 jarigen in zes landen. Bekijk de grafiek en beantwoord de vragen.',
            type: 'bar-chart',
            chartData: [
                { label: 'VS', value: 7.7, color: '#D97848' },
                { label: 'Brazilië', value: 6.4, color: '#D7C95F' },
                { label: 'Nederland', value: 4.2, color: '#0B453F' },
                { label: 'Duitsland', value: 3.8, color: '#0B453F' },
                { label: 'Japan', value: 2.9, color: '#5F947D' },
                { label: 'Finland', value: 3.1, color: '#0B453F' },
            ],
            questions: [
                {
                    id: 'q4-hoogste-schermtijd',
                    question:
                        'Maak een voorzichtige internationale headline op basis van de grafiek. Noem welk land bovenaan staat, gebruik het cijferbewijs en voeg één contextzin toe over wat de data nog niet verklaart.',
                    type: 'text-observation',
                    showConfidence: true,
                    correctAnswer: '',
                    explanation:
                        'De VS heeft met 7,7 uur per dag de hoogste gemiddelde schermtijd in deze oefencasus. Brazilië volgt met 6,4 uur. Een sterke dataheadline noemt het patroon, maar blijft voorzichtig: de grafiek verklaart nog niet waarom dit verschil bestaat. Daarvoor heb je context nodig over school, cultuur, platformgebruik of de onderzoeksmethode.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'hoogste land genoemd', keywords: ['vs', 'verenigde staten', 'amerika'] },
                        { label: 'cijferbewijs gebruikt', keywords: ['7,7', '7.7', 'uur', 'hoogste', 'brazilië', '6,4', '6.4'] },
                        { label: 'headline of publicatie', keywords: ['headline', 'kop', 'artikel', 'publiceer', 'publicatie'] },
                        { label: 'voorzichtige context', keywords: ['verklaart niet', 'context', 'mogelijk', 'school', 'cultuur', 'platform', 'methode'] },
                    ],
                },
                {
                    id: 'q5-nl-jp-verschil',
                    question:
                        'Hoeveel uur meer zitten Nederlandse jongeren per dag achter een scherm dan Japanse jongeren? (Geef het exacte getal)',
                    type: 'number-input',
                    showConfidence: true,
                    correctAnswer: 1.3,
                    explanation:
                        'Nederland: 4,2 uur − Japan: 2,9 uur = 1,3 uur verschil per dag. Dat is ruim een uur extra schermtijd per dag in Nederland.',
                    points: 15,
                },
                {
                    id: 'q6-patroon-observatie',
                    question:
                        'Wat valt je op als je Nederland vergelijkt met Japan? Wat zou een mogelijke verklaring kunnen zijn voor dit verschil?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Mogelijke verklaringen: Japan kent een andere schoolcultuur (meer huiswerk, minder vrije tijd), andere social media populariteit (bijv. LINE i.p.v. Instagram/TikTok), of culturele normen rondom schermgebruik. Er is geen eenduidig antwoord — de vraag stimuleert kritisch denken.',
                    points: 10,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'Nederland hoger dan Japan', keywords: ['nederland', 'hoger', 'meer', '4,2', '4.2', 'japan', '2,9', '2.9'] },
                        { label: 'mogelijke verklaring', keywords: ['omdat', 'verklaring', 'misschien', 'kan komen door', 'mogelijk'] },
                        { label: 'cultuur, school of platformgebruik', keywords: ['school', 'cultuur', 'huiswerk', 'platform', 'social media', 'line', 'instagram', 'tiktok'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'nieuwsberichten-social-media',
            title: 'Nieuwsberichten over social media en jongeren',
            description:
                'Hieronder staan vier fictieve voorbeeldberichten over social media en jongeren. Lees ze zorgvuldig — let op de bron, de datum en hoe stellig de uitspraken zijn.',
            type: 'document-cards',
            cards: [
                {
                    title: 'NOS-stijl voorbeeldbericht — 14 februari 2025',
                    icon: '📺',
                    content:
                        'Een fictief RIVM-achtig onderzoeksbericht stelt dat 1 op de 5 jongeren tussen 12 en 18 jaar aangeeft zich "regelmatig eenzaam" te voelen na intensief social media gebruik. Het onderzoek volgde 2.400 jongeren gedurende twee jaar. Onderzoekers benadrukken dat een oorzakelijk verband nog niet bewezen is.',
                },
                {
                    title: 'Instagram-stijl voorbeeldbericht — 3 januari 2025',
                    icon: '📸',
                    content:
                        '"Uit ons interne onderzoek blijkt dat 85% van de tieners zich positief voelt na het gebruik van Instagram Reels. We investeren fors in tools voor digitaal welzijn." Het onderzoek werd uitgevoerd door Instagram zelf en is niet onafhankelijk geverifieerd.',
                },
                {
                    title: 'Volkskrant-stijl voorbeeldbericht — 28 november 2024',
                    icon: '📰',
                    content:
                        'Een meta-analyse van 47 internationale studies concludeert dat er een "matig negatief verband" bestaat tussen intensief social media gebruik (meer dan 3 uur per dag) en zelfgerapporteerd welzijn bij meisjes van 11-14 jaar. Bij jongens was het verband zwakker en minder consistent.',
                },
                {
                    title: 'Schoolkrant 2B — 12 maart 2025',
                    icon: '✏️',
                    content:
                        '"Volgens mij voelen veel jongeren zich somberder door social media." Geschreven door leerling Jayden V. (13) als opiniestuk voor de schoolkrant. Gebaseerd op zijn eigen ervaringen en een gesprek met vrienden.',
                },
            ],
            questions: [
                {
                    id: 'q7-meest-betrouwbaar',
                    question:
                        'Kies als eindredacteur welk bericht bovenaan je bronlijst komt. Leg uit waarom deze bron sterker is dan het Instagram-bericht en het schoolkrant-opiniestuk.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het Volkskrant-stijl voorbeeldbericht is het sterkst voor een wetenschappelijke claim, omdat het verwijst naar een meta-analyse van 47 internationale studies. Het Instagram-bericht is intern en niet onafhankelijk, terwijl de schoolkrant vooral een persoonlijke mening is. Het RIVM-achtige bericht is ook bruikbaar, maar is één studie.',
                    points: 15,
                    minLength: 75,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'sterkste bron gekozen', keywords: ['volkskrant', 'meta-analyse', '47'] },
                        { label: 'onafhankelijkheid genoemd', keywords: ['onafhankelijk', 'intern', 'instagram', 'bedrijf'] },
                        { label: 'mening herkend', keywords: ['schoolkrant', 'mening', 'opiniestuk', 'ervaring'] },
                        { label: 'bewijssterkte uitgelegd', keywords: ['studies', 'wetenschappelijk', 'bewijs', 'bron'] },
                    ],
                },
                {
                    id: 'q8-instagram-probleem',
                    question:
                        'Waarom is het Instagram-bericht minder betrouwbaar dan het RIVM-bericht? Beschrijf het probleem in eigen woorden.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het kernprobleem heet "conflict of interest" of belangenverstrengeling: Instagram heeft er financieel belang bij dat hun product positief wordt beoordeeld. Onafhankelijk onderzoek (door RIVM, universiteiten) heeft dit belang niet. Goed kritisch denken houdt altijd rekening met wie onderzoek financiert of uitvoert.',
                    points: 5,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'belang of belangenverstrengeling', keywords: ['belang', 'belangenverstrengeling', 'conflict of interest', 'financieel'] },
                        { label: 'niet onafhankelijk', keywords: ['niet onafhankelijk', 'onafhankelijk', 'zelf', 'intern'] },
                        { label: 'Instagram als bron', keywords: ['instagram', 'platform', 'bedrijf', 'product'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🏆',
            title: 'Datajournalist in spe!',
            color: '#D7C95F',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Scherpe analist',
            color: '#5F947D',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Op onderzoek uit',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
        },
    ],

    takeaways: [
        'Je kunt data sorteren en filteren om patronen te vinden',
        'Gemiddelden uitrekenen met data uit een tabel',
        'Je kent het verschil tussen onafhankelijk en partijdig onderzoek',
        'Een meta-analyse is sterker bewijs dan één studie',
        'Data vertelt niet automatisch de waarheid — context telt',
    ],
};
