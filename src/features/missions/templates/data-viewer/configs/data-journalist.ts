import type { DataViewerConfig } from '../DataViewer';

export const dataJournalistConfig: DataViewerConfig = {
    missionId: 'data-journalist',
    title: 'Data-journalist',
    introEmoji: '📰',
    introTitle: 'Word een data-journalist',
    introDescription:
        'Echte journalisten gebruiken data om verhalen te vertellen. Jij gaat cijfers over social media en schermtijd analyseren, patronen ontdekken en kritisch kijken naar nieuwsberichten. Wat zeggen de getallen écht?',
    introFeatures: [
        'Analyseer een enquête over social media gebruik (leerjaar 2)',
        'Vergelijk schermtijd in zes landen en ontdek patronen',
        'Beoordeel nieuwsberichten op betrouwbaarheid',
    ],
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
                    question: 'Welk platform wordt door de meeste leerlingen in deze enquête gebruikt?',
                    type: 'multiple-choice',
                    showConfidence: true,
                    options: ['Instagram', 'TikTok', 'YouTube', 'Snapchat'],
                    correctAnswer: 'TikTok',
                    explanation:
                        'TikTok wordt door 4 leerlingen gebruikt (Daan, Sara, Jayden, Tim), meer dan elk ander platform. Sorteer de kolom "Platform" om dit snel te zien.',
                    points: 15,
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
                { label: 'VS', value: 7.7, color: '#ff3c21' },
                { label: 'Brazilië', value: 6.4, color: '#e1ff01' },
                { label: 'Nederland', value: 4.2, color: '#202023' },
                { label: 'Duitsland', value: 3.8, color: '#202023' },
                { label: 'Japan', value: 2.9, color: '#202023' },
                { label: 'Finland', value: 3.1, color: '#202023' },
            ],
            questions: [
                {
                    id: 'q4-hoogste-schermtijd',
                    question: 'Welk land heeft de hoogste gemiddelde schermtijd per dag voor jongeren van 13-15 jaar?',
                    type: 'multiple-choice',
                    showConfidence: true,
                    options: ['Brazilië', 'Nederland', 'VS', 'Japan'],
                    correctAnswer: 'VS',
                    explanation:
                        'De VS heeft met 7,7 uur per dag de hoogste schermtijd. Dat is bijna een volledige werkdag! De VS scoort bijna een uur hoger dan nummer 2, Brazilië.',
                    points: 10,
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
                        '"Social media maakt iedereen depressief, dat is wel duidelijk." Geschreven door leerling Jayden V. (13) als opiniestuk voor de schoolkrant. Gebaseerd op zijn eigen ervaringen en een gesprek met vrienden.',
                },
            ],
            questions: [
                {
                    id: 'q7-meest-betrouwbaar',
                    question:
                        'Welk nieuwsbericht is het meest betrouwbaar als bewijs voor een wetenschappelijke claim over social media en welzijn?',
                    type: 'multiple-choice',
                    showConfidence: true,
                    options: [
                        'NOS-stijl bericht — RIVM-achtig onderzoek',
                        'Instagram-stijl blog — intern onderzoek',
                        'Volkskrant-stijl bericht — meta-analyse 47 studies',
                        'Schoolkrant 2B — opiniestuk Jayden',
                    ],
                    correctAnswer: 'Volkskrant-stijl bericht — meta-analyse 47 studies',
                    explanation:
                        'Het Volkskrant-stijl voorbeeldbericht is gebaseerd op 47 onafhankelijke studies — dat is de sterkste vorm van wetenschappelijk bewijs. Het RIVM-achtige bericht is ook goed, maar één studie. Het Instagram-onderzoek is niet onafhankelijk. De schoolkrant is een mening.',
                    points: 15,
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
            color: '#e1ff01',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Scherpe analist',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Op onderzoek uit',
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
        'Je kunt data sorteren en filteren om patronen te vinden',
        'Gemiddelden uitrekenen met data uit een tabel',
        'Je kent het verschil tussen onafhankelijk en partijdig onderzoek',
        'Een meta-analyse is sterker bewijs dan één studie',
        'Data vertelt niet automatisch de waarheid — context telt',
    ],
};
