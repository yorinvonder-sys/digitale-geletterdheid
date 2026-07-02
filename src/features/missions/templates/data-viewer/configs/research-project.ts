import type { DataViewerConfig } from '../DataViewer';

export const researchProjectConfig: DataViewerConfig = {
    missionId: 'research-project',
    title: 'Research Project',
    introEmoji: '🔬',
    introTitle: 'Jij bent de onderzoeker',
    introDescription:
        'Er wordt van alles beweerd over technologie. Maar klopt het? Alleen met echt onderzoek kom je achter de waarheid. Jij gaat leren hoe je een scherpe onderzoeksvraag formuleert, betrouwbare bronnen beoordeelt en een onderbouwde conclusie trekt.',
    introFeatures: [
        'Analyseer een dataset over schermtijd en welzijn bij jongeren',
        'Vergelijk de betrouwbaarheid van onderzoeksmethoden',
        'Beoordeel hoe je een conclusie onderbouwt met data',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'schermtijd-welzijn-onderzoek',
            title: 'Dataset: schermtijd en zelfgerapporteerd welzijn (havo/vwo, n=200)',
            description:
                'Onderzoekers van de Universiteit Leiden maten schermtijd en welzijnsscores bij 200 havo/vwo-leerlingen (15-17 jaar). Welzijn werd gemeten op een schaal van 1-10. Let op twee sleutelbegrippen: correlatie (= twee dingen hangen samen) en causaliteit (= het ene veroorzaakt het andere) — die zijn niet hetzelfde.',
            type: 'table',
            columns: [
                { key: 'groep', label: 'Groep (uren/dag)', sortable: true },
                { key: 'n', label: 'Aantal leerlingen', sortable: true },
                { key: 'gem_welzijn', label: 'Gem. welzijn (1-10)', sortable: true },
                { key: 'std_dev', label: 'Standaarddeviatie', sortable: true },
                { key: 'pct_laag_welzijn', label: '% Laag welzijn (<6)', sortable: true },
            ],
            rows: [
                { groep: '< 2 uur', n: 35, gem_welzijn: 7.4, std_dev: 0.9, pct_laag_welzijn: 6 },
                { groep: '2-4 uur', n: 68, gem_welzijn: 7.1, std_dev: 1.0, pct_laag_welzijn: 9 },
                { groep: '4-6 uur', n: 57, gem_welzijn: 6.6, std_dev: 1.2, pct_laag_welzijn: 18 },
                { groep: '6-8 uur', n: 28, gem_welzijn: 6.2, std_dev: 1.4, pct_laag_welzijn: 29 },
                { groep: '> 8 uur', n: 12, gem_welzijn: 5.8, std_dev: 1.6, pct_laag_welzijn: 42 },
            ],
            questions: [
                {
                    id: 'q1-patroon-herkennen',
                    question:
                        'Wat is het verband tussen schermtijd en gemiddeld welzijn op basis van deze data?',
                    type: 'multiple-choice',
                    options: [
                        'Meer schermtijd hangt samen met hoger welzijn',
                        'Er is geen verband tussen schermtijd en welzijn',
                        'Meer schermtijd hangt samen met lager welzijn',
                        'Alleen boven 8 uur is er een verband',
                    ],
                    correctAnswer: 'Meer schermtijd hangt samen met lager welzijn',
                    explanation:
                        'Van < 2 uur (7,4) naar > 8 uur (5,8) daalt het gemiddelde welzijn consistent. Sorteer op "Groep" om de trend te zien. Let op: dit is correlatie, geen causaliteit — we weten niet of schermtijd het welzijn verlaagt, of dat leerlingen met laag welzijn meer gaan swipen.',
                    points: 15,
                },
                {
                    id: 'q2-laag-welzijn-verschil',
                    question:
                        'Hoeveel procentpunt meer leerlingen in de "> 8 uur" groep hebben laag welzijn (<6) vergeleken met de "< 2 uur" groep?',
                    type: 'number-input',
                    correctAnswer: 36,
                    explanation:
                        '> 8 uur: 42% laag welzijn. < 2 uur: 6% laag welzijn. Verschil: 42 − 6 = 36 procentpunt. Dit grote verschil is statistisch significant, maar je kunt er nog steeds geen oorzakelijk verband van afleiden — daarvoor is experimenteel onderzoek nodig.',
                    points: 15,
                },
                {
                    id: 'q3-correlatie-causaliteit',
                    question:
                        'De data toont een correlatie tussen schermtijd en welzijn. Leg in eigen woorden uit waarom correlatie NIET hetzelfde is als causaliteit.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Correlatie = twee dingen hangen samen. Causaliteit = het ene veroorzaakt het andere. Het kan ook zijn: leerlingen met laag welzijn zoeken afleiding op hun scherm (omgekeerde richting), of er is een derde factor (bijv. eenzaamheid) die zowel schermtijd als laag welzijn verklaart. Om causaliteit te bewijzen heb je een experiment nodig: willekeurig schermtijd beperken bij een groep en meten of welzijn verandert.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'onderzoeksmethoden-vergelijking',
            title: 'Betrouwbaarheid van onderzoeksmethoden',
            description:
                'Niet elke onderzoeksmethode is even betrouwbaar. Wetenschappers beoordelen methoden op basis van "levels of evidence". Hogere score = sterker bewijs. Twee methoden in de grafiek die je misschien niet kent: cohort-onderzoek (= een groep mensen langere tijd volgen) en meta-analyse (meerdere studies samenvatten).',
            type: 'bar-chart',
            chartData: [
                { label: 'Expertmening', value: 15, color: '#202023' },
                { label: 'Casestudy (1 persoon)', value: 25, color: '#e1ff01' },
                { label: 'Enquête (zelfrapportage)', value: 45, color: '#202023' },
                { label: 'Cohort-onderzoek', value: 65, color: '#202023' },
                { label: 'Gecontroleerd experiment', value: 80, color: '#202023' },
                { label: 'Meta-analyse', value: 95, color: '#202023' },
            ],
            questions: [
                {
                    id: 'q4-sterkste-bewijs',
                    question: 'Welke onderzoeksmethode levert het sterkste wetenschappelijke bewijs?',
                    type: 'multiple-choice',
                    options: ['Expertmening', 'Cohort-onderzoek', 'Meta-analyse', 'Enquête'],
                    correctAnswer: 'Meta-analyse',
                    explanation:
                        'Een meta-analyse combineert de resultaten van tientallen of honderden onderzoeken. Zo middel je toevallige fouten uit en zie je het werkelijke patroon. Een meta-analyse van 47 studies over schermtijd en welzijn zegt veel meer dan één studie met 200 leerlingen.',
                    points: 10,
                },
                {
                    id: 'q5-enquete-beperking',
                    question:
                        'De studie in Dataset 1 gebruikte zelfrapportage (leerlingen geven zelf hun welzijn op). Hoeveel punten lager scoort enquête/zelfrapportage dan een gecontroleerd experiment?',
                    type: 'number-input',
                    correctAnswer: 35,
                    explanation:
                        'Gecontroleerd experiment: 80 punten. Enquête (zelfrapportage): 45 punten. Verschil: 80 − 45 = 35 punten. Zelfrapportage heeft de beperking dat mensen hun eigen gedrag en gevoel vaak niet accuraat inschatten — sociaal wenselijk antwoorden of niet precies weten hoeveel uur ze per dag achter een scherm zitten.',
                    points: 15,
                },
                {
                    id: 'q6-methode-keuze',
                    question:
                        'Jij wilt onderzoeken of jongeren meer focusproblemen hebben als ze meer schermtijd hebben. Welke methode is het meest haalbaar voor een scholier en waarom?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een enquête is het meest haalbaar: je kunt een vragenlijst maken en afnemen in je klas. Een gecontroleerd experiment (willekeurig schermtijd beperken bij de helft van de klas voor 4 weken) is meer betrouwbaar maar bijna onmogelijk te organiseren als scholier. Een goede onderzoeker erkent de beperkingen van zijn methode — dat is geen zwakte maar wetenschappelijke eerlijkheid.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'onderzoeksproces-stappen',
            title: 'Vier stappen van wetenschappelijk onderzoek',
            description:
                'Goed onderzoek volgt altijd dezelfde structuur. Hier zijn de vier stappen die elke onderzoeker doorloopt.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Stap 1: Scherpe onderzoeksvraag formuleren',
                    icon: '❓',
                    content:
                        'Een goede onderzoeksvraag is: specifiek (niet "is schermtijd slecht?" maar "hangt schermtijd samen met welzijn bij havo-leerlingen van 15-17 jaar?"), beantwoordbaar (je kunt data verzamelen), en open (niet al een antwoord suggereert). Deelvragen helpen om de hoofdvraag op te splitsen in behapbare stukken.',
                },
                {
                    title: 'Stap 2: Betrouwbare bronnen zoeken',
                    icon: '🔍',
                    content:
                        'Niet alle bronnen zijn gelijkwaardig. Wetenschappelijke tijdschriften zijn peer-reviewed (= gecontroleerd door andere wetenschappers) en daardoor betrouwbaarder dan Wikipedia of nieuwsartikelen. Controleer altijd: Wie heeft het geschreven? Wanneer? Is het onafhankelijk onderzoek of gesponsord? Zijn de methoden beschreven? Google Scholar, CBS en RIVM zijn goede startpunten voor scholieren.',
                },
                {
                    title: 'Stap 3: Data analyseren',
                    icon: '📊',
                    content:
                        'Kijk naar patronen, trends en uitzonderingen. Gebruik gemiddelden, percentages en vergelijkingen om bevindingen duidelijk te maken. Let op: één datapunt maakt geen patroon. Zoek naar meerdere bronnen die hetzelfde patroon bevestigen. Noteer ook wat de data NIET zegt — dat zijn de beperkingen van je onderzoek.',
                },
                {
                    title: 'Stap 4: Conclusie en beperkingen',
                    icon: '📝',
                    content:
                        'Een goede conclusie beantwoordt de onderzoeksvraag met bewijs. Ze is voorzichtig: "deze data suggereert dat..." in plaats van "dit bewijst dat...". Ze benoemt beperkingen: kleine steekproef, zelfrapportage, geen causaliteit. Een conclusie zonder beperkingen is onwetenschappelijk. De sterkste onderzoekers zijn ook de eerlijksten over wat ze niét weten.',
                },
            ],
            questions: [
                {
                    id: 'q7-onderzoeksvraag-beoordelen',
                    question:
                        'Welke onderzoeksvraag is het meest geschikt voor wetenschappelijk onderzoek?',
                    type: 'multiple-choice',
                    options: [
                        '"Is social media slecht voor jongeren?"',
                        '"Hoeveel uur zitten jongeren van 13-15 jaar per dag op TikTok in 2025?"',
                        '"Waarom is schermtijd een probleem?"',
                        '"Social media maakt je depressief — klopt dat?"',
                    ],
                    correctAnswer: '"Hoeveel uur zitten jongeren van 13-15 jaar per dag op TikTok in 2025?"',
                    explanation:
                        'Deze vraag is specifiek (leeftijdsgroep, platform, jaar), beantwoordbaar (je kunt data verzamelen) en open (suggereert geen antwoord). De andere vragen zijn te breed ("slecht" is vaag), suggestief ("een probleem" gaat al van een negatief antwoord uit) of al een claim in de vraag ("depressief").',
                    points: 15,
                },
                {
                    id: 'q8-eigen-beperking',
                    question:
                        'De studie in Dataset 1 heeft n=200 leerlingen. Noem één beperking van deze steekproef en beschrijf hoe je het onderzoek zou verbeteren.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Beperkingen: n=200 is relatief klein — resultaten kunnen toeval zijn. Alleen havo/vwo — niet representatief voor alle Nederlandse jongeren. Eenmalige meting — geen longitudinaal beeld. Verbetering: grotere steekproef (n>1000), inclusief mavo-leerlingen, meerdere meetmomenten in de tijd, en objectieve schermtijdmeting (bijv. via telefoondata) in plaats van zelfrapportage.',
                    points: 10,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🔬',
            title: 'Wetenschapper in spe!',
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Data Onderzoeker',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Kritisch Denker',
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
        'Correlatie en causaliteit zijn niet hetzelfde — verband betekent niet oorzaak',
        'Een meta-analyse is het sterkste wetenschappelijke bewijs, een mening het zwakste',
        'Een goede onderzoeksvraag is specifiek, beantwoordbaar en niet al suggestief',
        'Wetenschappelijke conclusies zijn voorzichtig en benoemen altijd beperkingen',
        'Zelfrapportage is minder betrouwbaar dan objectieve metingen',
    ],
};

export default researchProjectConfig;
