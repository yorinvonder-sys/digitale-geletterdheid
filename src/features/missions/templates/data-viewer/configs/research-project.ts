import type { DataViewerConfig } from '../DataViewer';

export const researchProjectConfig: DataViewerConfig = {
    missionId: 'research-project',
    title: 'Research Project',
    introEmoji: '🔬',
    introTitle: 'Voer een onderzoek uit',
    introDescription:
        'Er wordt van alles beweerd over technologie. Maar klopt het? Alleen met echt onderzoek kom je achter de waarheid. Jij gaat leren hoe je een scherpe onderzoeksvraag formuleert, betrouwbare bronnen beoordeelt en een onderbouwde conclusie trekt.',
    introFeatures: [
        'Analyseer een dataset over schermtijd en welzijn bij jongeren',
        'Vergelijk de betrouwbaarheid van onderzoeksmethoden',
        'Beoordeel hoe je een conclusie onderbouwt met data',
    ],
    missionGoal: {
        primaryGoal:
            'Onderzoek een technologische claim kritisch en trek een voorzichtige conclusie met data, methodekennis en bronbewustzijn.',
        criteria: {
            type: 'score-threshold',
            threshold: 50,
            description:
                'Je haalt de completiondrempel door datasets te analyseren, onderzoeksmethoden te vergelijken en tekstobservaties met bewijs te schrijven.',
        },
        evidence:
            'Leerlingbewijs: antwoorden over schermtijddata, correlatie versus causaliteit, onderzoeksmethoden en conclusieopbouw. Docentbewijs: score, fase-overzicht en tekstobservaties tonen of de leerling verantwoord met bewijs redeneert.',
    },
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Research fork: kies of je verband, bewijssterkte of mogelijke oorzaak onderzoekt.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Na de onderzoeksvork krijgt de leerling feedback op claimsterkte en verantwoord bewijsgebruik.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling schrijft conclusies die data, methode en onzekerheid zichtbaar meenemen.',
        antiBoringRule: 'Onderzoek start met autonomie over de route, niet met een vast onderzoeksformulier.',
        chromeAcceptance: 'Onderzoeksvork, datasets en tekstobservaties blijven bruikbaar en niet te tekstzwaar op mobile/tablet.',
    },
    investigationHook: {
        title: 'Kies je onderzoeksvork',
        role: 'Junior onderzoeker',
        scenario:
            'Er ligt een stapel beweringen over schermtijd en welzijn. Jij kiest eerst wat voor soort conclusie je verantwoord wilt proberen te trekken.',
        prompt: 'Welke onderzoeksvraag neem je als startpunt?',
        contextLabel: 'Onderzoeksvork',
        continueLabel: 'Start het onderzoek',
        options: [
            {
                id: 'verband',
                label: 'Is er een verband zichtbaar?',
                description: 'Je onderzoekt patronen in de data zonder meteen oorzaak en gevolg te claimen.',
                feedback: 'Sterke wetenschappelijke start. Eerst aantonen dat iets samenhangt, daarna pas vragen wat het betekent.',
                evidenceChips: ['7,4 naar 5,8', '42% laag welzijn', 'geen causaliteit'],
                impactCue: 'Voorzichtig verband',
            },
            {
                id: 'methode',
                label: 'Hoe betrouwbaar is het bewijs?',
                description: 'Je vergelijkt onderzoeksmethoden voordat je conclusies te zwaar maakt.',
                feedback: 'Goed kritisch spoor. Niet elk onderzoek verdient evenveel vertrouwen; methode bepaalt hoeveel je mag claimen.',
                evidenceChips: ['meta-analyse 95', 'enquete 45', 'n=200'],
                impactCue: 'Bewijssterkte',
            },
            {
                id: 'oorzaak',
                label: 'Wat zou oorzaak kunnen zijn?',
                description: 'Je zoekt voorzichtig naar verklaringen en let extra op correlatie versus causaliteit.',
                feedback: 'Ambitieus, maar haalbaar als je voorzichtig blijft. Een goede onderzoeker noemt alternatieve verklaringen.',
                evidenceChips: ['derde factor', 'omgekeerde richting', 'experiment nodig'],
                impactCue: 'Causaliteitscheck',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'schermtijd-welzijn-onderzoek',
            title: 'Dataset: schermtijd en zelfgerapporteerd welzijn (havo/vwo, n=200)',
            description:
                'Onderzoekers van de Universiteit Leiden maten schermtijd en welzijnsscores bij 200 havo/vwo-leerlingen (15-17 jaar). Welzijn werd gemeten op een schaal van 1-10.',
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
                        'Pin als junior onderzoeker het patroon in deze dataset. Noem minstens twee welzijnsscores en formuleer de claim voorzichtig, zonder oorzaak-gevolg te beweren.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Van < 2 uur (7,4) naar > 8 uur (5,8) daalt het gemiddelde welzijn consistent. Sorteer op "Groep" om de trend te zien. Let op: dit is correlatie, geen causaliteit — we weten niet of schermtijd het welzijn verlaagt, of dat leerlingen met laag welzijn meer gaan swipen.',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'lager welzijn bij meer schermtijd', keywords: ['lager', 'daalt', 'minder welzijn', 'meer schermtijd'] },
                        { label: 'concrete scores genoemd', keywords: ['7,4', '7.4', '5,8', '5.8', '6,2', '6.2'] },
                        { label: 'correlatie voorzichtig benoemd', keywords: ['correlatie', 'hangt samen', 'verband', 'suggereert'] },
                        { label: 'geen causaliteit geclaimd', keywords: ['geen causaliteit', 'geen oorzaak', 'niet bewijst', 'oorzaak'] },
                    ],
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
                'Niet elke onderzoeksmethode is even betrouwbaar. Wetenschappers beoordelen methoden op basis van "levels of evidence". Hogere score = sterker bewijs.',
            type: 'bar-chart',
            chartData: [
                { label: 'Expertmening', value: 15, color: '#445865' },
                { label: 'Casestudy (1 persoon)', value: 25, color: '#D7C95F' },
                { label: 'Enquête (zelfrapportage)', value: 45, color: '#0B453F' },
                { label: 'Cohort-onderzoek', value: 65, color: '#0B453F' },
                { label: 'Gecontroleerd experiment', value: 80, color: '#5F947D' },
                { label: 'Meta-analyse', value: 95, color: '#5F947D' },
            ],
            questions: [
                {
                    id: 'q4-sterkste-bewijs',
                    question:
                        'Rangschik als evidence reviewer welke methode bovenaan je bewijskaart komt. Noem de sterkste methode, haar score en waarom die sterker is dan één losse enquête.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een meta-analyse combineert de resultaten van tientallen of honderden onderzoeken. Zo middel je toevallige fouten uit en zie je het werkelijke patroon. Een meta-analyse van 47 studies over schermtijd en welzijn zegt veel meer dan één studie met 200 leerlingen.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'meta-analyse gekozen', keywords: ['meta-analyse', 'meta analyse'] },
                        { label: 'score of bewijssterkte genoemd', keywords: ['95', 'sterkst', 'hoogste', 'bewijs'] },
                        { label: 'meerdere studies uitgelegd', keywords: ['meerdere onderzoeken', 'studies', 'combineert', 'tientallen'] },
                        { label: 'enquête vergeleken', keywords: ['enquete', 'enquête', 'zelfrapportage', '45', 'losse studie'] },
                    ],
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
                        'Niet alle bronnen zijn gelijkwaardig. Wetenschappelijke tijdschriften (peer-reviewed) zijn betrouwbaarder dan Wikipedia of nieuwsartikelen. Controleer altijd: Wie heeft het geschreven? Wanneer? Is het onafhankelijk onderzoek of gesponsord? Zijn de methoden beschreven? Google Scholar, CBS en RIVM zijn goede startpunten voor scholieren.',
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
                        'Kies als onderzoekscoach de beste onderzoeksvraag en verdedig je keuze. Leg uit waarom de vraag specifiek, meetbaar en niet leidend is.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Deze vraag is specifiek (leeftijdsgroep, platform, jaar), beantwoordbaar (je kunt data verzamelen) en open (suggereert geen antwoord). De andere vragen zijn te breed ("slecht" is vaag), suggestief ("een probleem" gaat al van een negatief antwoord uit) of al een claim in de vraag ("depressief").',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'TikTok-vraag gekozen', keywords: ['tiktok', '13-15', '2025', 'hoeveel uur'] },
                        { label: 'specifiek uitgelegd', keywords: ['specifiek', 'leeftijdsgroep', 'platform', 'jaar'] },
                        { label: 'meetbaar of beantwoordbaar', keywords: ['meetbaar', 'beantwoordbaar', 'data', 'verzamelen'] },
                        { label: 'niet leidend of open', keywords: ['niet leidend', 'open', 'suggereert geen', 'niet suggestief'] },
                    ],
                },
                {
                    id: 'q8-eigen-beperking',
                    question:
                        'De studie in Dataset 1 heeft n=200 leerlingen. Noem één beperking van deze steekproef en beschrijf hoe je het onderzoek zou verbeteren.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Beperkingen: n=200 is relatief klein — resultaten kunnen toeval zijn. Alleen havo/vwo — niet representatief voor alle Nederlandse jongeren. Eenmalige meting — geen longitudinaal beeld. Verbetering: grotere steekproef (n>1000), inclusief mavo-leerlingen, meerdere meetmomenten in de tijd, en objectieve schermtijdmeting (bijv. via telefoondata) in plaats van zelfrapportage.',
                    points: 0,
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
            color: '#0B453F',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Data Onderzoeker',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Kritisch Denker',
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
        'Correlatie en causaliteit zijn niet hetzelfde — verband betekent niet oorzaak',
        'Een meta-analyse is het sterkste wetenschappelijke bewijs, een mening het zwakste',
        'Een goede onderzoeksvraag is specifiek, beantwoordbaar en niet al suggestief',
        'Wetenschappelijke conclusies zijn voorzichtig en benoemen altijd beperkingen',
        'Zelfrapportage is minder betrouwbaar dan objectieve metingen',
    ],
};

export default researchProjectConfig;
