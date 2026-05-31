import type { DataViewerConfig } from '../DataViewer';

export const mlTrainerConfig: DataViewerConfig = {
    missionId: 'ml-trainer',
    title: 'ML Trainer',
    introEmoji: '🧠',
    introTitle: 'Word een ML Trainer',
    introDescription:
        'Machine learning klinkt ingewikkeld, maar het idee is simpel: je laat een computer leren van voorbeelden. Jij gaat ontdekken hoe supervised learning werkt — van het kiezen van features tot het beoordelen van de accuracy van een model.',
    missionGoal: {
        primaryGoal:
            'Train je ML-denken door data, features, accuracy en overfitting met concrete voorbeelden uit te leggen.',
        criteria: {
            type: 'score-threshold',
            threshold: 55,
            description:
                'Alle drie datasets zijn onderzocht, de observaties noemen concrete ML-begrippen en de score is minimaal 55/100.',
        },
        evidence:
            'Leerlingbewijs: antwoorden over spamlabels, features, accuracy, overfitting en eigen tekstobservaties. Docentbewijs: score, fase-overzicht en tekstbewijs waarin supervised learning en modelkwaliteit zichtbaar worden.',
    },
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Model audit: kies waarom de spamfilter ondanks goede demoscore faalt.',
        primaryInteraction: 'operate-simulation',
        feedbackMoment: 'Na de faalhypothese koppelt feedback labels, features of overfitting aan modelkwaliteit.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling noemt labels, features, accuracy en overfitting in concrete observaties.',
        antiBoringRule: 'ML moet voelen als modeltesten en foutzoeken, niet als spreadsheetanalyse.',
        chromeAcceptance: 'Model-audit hook en ML-datasets zijn responsive en tekstobservaties blijven duidelijk zichtbaar.',
    },
    introFeatures: [
        'Analyseer een gelabelde dataset voor een spamfilter',
        'Vergelijk accuracy van modellen met verschillende features',
        'Beoordeel wat overfitting betekent en hoe je het herkent',
    ],
    investigationHook: {
        title: 'De spamfilter laat rare mails door',
        role: 'Model-auditor',
        scenario:
            'Een spamfilter scoort goed in de demo, maar mist in de praktijk verdachte mails. Jij kiest eerst welke modelzwakte je gaat testen.',
        prompt: 'Welke faalhypothese lijkt het meest onderzoekbaar?',
        contextLabel: 'Modelhypothese',
        continueLabel: 'Audit de trainingsdata',
        options: [
            {
                id: 'labels',
                label: 'De labels sturen het model verkeerd',
                description: 'Je controleert of voorbeelden consequent als spam of geen spam zijn gelabeld.',
                feedback: 'Sterk. Supervised learning is zo betrouwbaar als de labels waarmee het model leert.',
                evidenceChips: ['Label-kolom', '5 spam / 7 geen spam', 'supervised'],
                impactCue: 'Labelkwaliteit',
            },
            {
                id: 'features',
                label: 'De features zijn te oppervlakkig',
                description: 'Je kijkt welke kenmerken echt iets voorspellen en welke vooral ruis toevoegen.',
                feedback: 'Goede ML-denkstap. Een model wordt niet slimmer van meer kolommen als die kolommen weinig betekenis hebben.',
                evidenceChips: ['Gratis/Win', 'ID 9 en 11', '+1% winst'],
                impactCue: 'Signaal vs ruis',
            },
            {
                id: 'overfitting',
                label: 'Het model kent de oefenset te goed',
                description: 'Je zoekt verschil tussen mooi trainen en betrouwbaar presteren op nieuwe voorbeelden.',
                feedback: 'Prima auditspoor. Overfitting voelt eerst als succes, totdat nieuwe data laat zien dat het model niet generaliseert.',
                evidenceChips: ['98% training', '61% test', 'minder features'],
                impactCue: 'Train-test kloof',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'spam-dataset',
            title: 'Trainingsdataset: 12 e-mails voor spamfilter',
            description:
                'Een data-engineer heeft 12 e-mails gelabeld als "spam" of "geen spam". Elke rij bevat features (kenmerken) die een model kan leren. Analyseer de dataset.',
            type: 'table',
            columns: [
                { key: 'email_id', label: 'ID', sortable: true },
                { key: 'afzender_onbekend', label: 'Onbekende afzender', sortable: true },
                { key: 'heeft_link', label: 'Bevat link', sortable: true },
                { key: 'woorden_als_gratis', label: '"Gratis" of "Win"', sortable: true },
                { key: 'hoofdletters_pct', label: 'Hoofdletters (%)', sortable: true },
                { key: 'label', label: 'Label', sortable: true },
            ],
            rows: [
                { email_id: 1, afzender_onbekend: 'Ja', heeft_link: 'Ja', woorden_als_gratis: 'Ja', hoofdletters_pct: 45, label: 'Spam' },
                { email_id: 2, afzender_onbekend: 'Nee', heeft_link: 'Ja', woorden_als_gratis: 'Nee', hoofdletters_pct: 8, label: 'Geen spam' },
                { email_id: 3, afzender_onbekend: 'Ja', heeft_link: 'Nee', woorden_als_gratis: 'Ja', hoofdletters_pct: 62, label: 'Spam' },
                { email_id: 4, afzender_onbekend: 'Nee', heeft_link: 'Nee', woorden_als_gratis: 'Nee', hoofdletters_pct: 5, label: 'Geen spam' },
                { email_id: 5, afzender_onbekend: 'Ja', heeft_link: 'Ja', woorden_als_gratis: 'Ja', hoofdletters_pct: 78, label: 'Spam' },
                { email_id: 6, afzender_onbekend: 'Nee', heeft_link: 'Ja', woorden_als_gratis: 'Nee', hoofdletters_pct: 12, label: 'Geen spam' },
                { email_id: 7, afzender_onbekend: 'Ja', heeft_link: 'Ja', woorden_als_gratis: 'Ja', hoofdletters_pct: 55, label: 'Spam' },
                { email_id: 8, afzender_onbekend: 'Nee', heeft_link: 'Nee', woorden_als_gratis: 'Nee', hoofdletters_pct: 7, label: 'Geen spam' },
                { email_id: 9, afzender_onbekend: 'Ja', heeft_link: 'Nee', woorden_als_gratis: 'Nee', hoofdletters_pct: 15, label: 'Geen spam' },
                { email_id: 10, afzender_onbekend: 'Nee', heeft_link: 'Ja', woorden_als_gratis: 'Ja', hoofdletters_pct: 38, label: 'Spam' },
                { email_id: 11, afzender_onbekend: 'Ja', heeft_link: 'Ja', woorden_als_gratis: 'Nee', hoofdletters_pct: 20, label: 'Geen spam' },
                { email_id: 12, afzender_onbekend: 'Nee', heeft_link: 'Nee', woorden_als_gratis: 'Nee', hoofdletters_pct: 3, label: 'Geen spam' },
            ],
            questions: [
                {
                    id: 'q1-spam-percentage',
                    question: 'Hoeveel procent van de e-mails in deze dataset is gelabeld als "Spam"?',
                    type: 'number-input',
                    correctAnswer: 42,
                    explanation:
                        'Er zijn 5 spam-mails (ID 1, 3, 5, 7 en 10) en 7 geen-spam-mails. 5 ÷ 12 × 100 = 41,7%, afgerond 42%. Filter op "Label" = "Spam" om te tellen. Deze dataset is dus niet perfect gebalanceerd — een model kan daardoor sneller een voorkeur leren voor de meest voorkomende klasse.',
                    points: 15,
                },
                {
                    id: 'q2-beste-feature',
                    question:
                        'Kies als model-auditor de feature die jij het sterkste bewijs vindt voor spam. Onderbouw je keuze met voorbeelden uit de dataset en noem ook waarom één andere feature minder betrouwbaar is.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '"Gratis" of "Win" is de sterkste feature: de spamvoorbeelden ID 1, 3, 5, 7 en 10 hebben dit signaal, terwijl andere features meer uitzonderingen hebben. Onbekende afzender is bijvoorbeeld minder betrouwbaar, omdat ID 9 en 11 onbekende afzenders hebben maar toch geen spam zijn. Een model-auditor kijkt dus naar patroon én uitzonderingen.',
                    points: 15,
                    minLength: 75,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'sterke feature gekozen', keywords: ['gratis', 'win', 'feature', 'signaal'] },
                        { label: 'spamvoorbeelden gebruikt', keywords: ['1', '3', '5', '7', '10', 'spam'] },
                        { label: 'uitzondering genoemd', keywords: ['9', '11', 'uitzondering', 'geen spam'] },
                        { label: 'minder betrouwbare feature', keywords: ['onbekende afzender', 'link', 'hoofdletters', 'minder betrouwbaar'] },
                        { label: 'model-audit redenering', keywords: ['patroon', 'bewijs', 'model', 'voorspeller', 'auditor'] },
                    ],
                },
                {
                    id: 'q3-supervised-learning',
                    question:
                        'Waarom heet dit "supervised learning"? Wat is de rol van de "Label"-kolom in dit leerproces?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '"Supervised" betekent begeleid: een mens heeft elke e-mail vooraf gelabeld als spam of niet. Het model leert van die voorbeelden. De Label-kolom is het "juiste antwoord" — het model vergelijkt zijn voorspellingen met de labels en past zijn gewichten aan. Zonder labels (unsupervised learning) moet het model zelf patronen vinden, zonder te weten wat goed is.',
                    points: 10,
                    minLength: 40,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'supervised of begeleid', keywords: ['supervised', 'begeleid'] },
                        { label: 'label als juist antwoord', keywords: ['label', 'juiste antwoord', 'antwoord'] },
                        { label: 'leren van voorbeelden', keywords: ['voorbeeld', 'voorbeelden', 'training', 'leren'] },
                    ],
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'model-accuracy-vergelijking',
            title: 'Accuracy van modellen met verschillende features',
            description:
                'Vier versies van een spamfilter zijn getraind met verschillende features. Bekijk de accuracy op de testset.',
            type: 'bar-chart',
            chartData: [
                { label: 'Alleen afzender', value: 68, color: '#D7C95F' },
                { label: 'Afzender + link', value: 75, color: '#0B453F' },
                { label: 'Alle 3 features', value: 88, color: '#5F947D' },
                { label: 'Alle features + datum', value: 89, color: '#0B453F' },
            ],
            questions: [
                {
                    id: 'q4-beste-model',
                    question:
                        'Maak als model-auditor een verdict: kies je het 89%-model met extra datumfeature, of het 88%-model met minder complexiteit? Gebruik de accuracy-data en leg uit wat je risico/afweging is.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het 89%-model heeft technisch de hoogste accuracy, maar wint maar 1 procentpunt van het 88%-model met alle 3 features. Een sterke model-auditor benoemt daarom de afweging: extra complexiteit en mogelijk overfitting tegenover een heel kleine winst. Beide keuzes kunnen kloppen als je de accuracy-data en het risico helder onderbouwt.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'modelkeuze', keywords: ['89', '88', 'datum', 'alle 3 features', 'model'] },
                        { label: 'accuracy-data', keywords: ['accuracy', 'procent', '1', '88', '89'] },
                        { label: 'complexiteit of risico', keywords: ['complexiteit', 'extra feature', 'overfitting', 'risico', 'afweging'] },
                        { label: 'auditor-verdict', keywords: ['kies', 'verdict', 'advies', 'model-auditor', 'betrouwbaar'] },
                    ],
                },
                {
                    id: 'q5-accuracy-stijging',
                    question:
                        'Hoeveel procentpunt stijgt de accuracy als je van "Alleen afzender" naar "Alle 3 features" gaat?',
                    type: 'number-input',
                    correctAnswer: 20,
                    explanation:
                        '"Alle 3 features": 88%. "Alleen afzender": 68%. Verschil: 88 − 68 = 20 procentpunt. Dit is een flinke sprong — het toont aan dat elke extra relevante feature de accuracy significant verbetert, tot op een punt van afnemende meeropbrengst.',
                    points: 15,
                },
                {
                    id: 'q6-accuracy-observatie',
                    question:
                        'Wat betekent een accuracy van 88%? Hoe zou jij aan een niet-technisch persoon uitleggen of dit "goed genoeg" is?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '88% accuracy betekent: het model maakt de juiste beslissing bij 88 van de 100 e-mails. Of dit goed genoeg is, hangt af van de toepassing. Voor een spamfilter is 12% fouten misschien acceptabel (je mist wat spam), maar voor een medisch diagnose-model is 88% veel te laag. Context bepaalt altijd of een accuracy "goed" is.',
                    points: 10,
                    minLength: 45,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: '88 van 100 correct', keywords: ['88', '100', 'juist', 'correct'] },
                        { label: 'fouten of foutmarge', keywords: ['fout', 'fouten', '12'] },
                        { label: 'context van toepassing', keywords: ['context', 'toepassing', 'spamfilter', 'medisch'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'ml-begrippen',
            title: 'Vier kernbegrippen van machine learning',
            description:
                'Machine learning heeft een eigen taal. Hier zijn vier kernbegrippen die elke ML Trainer moet kennen.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Trainingset vs. testset',
                    icon: '✂️',
                    content:
                        'Je splitst je dataset in twee delen: de trainingset (bijv. 80%) waarmee het model leert, en de testset (bijv. 20%) waarmee je meet hoe goed het model is op nieuwe, ongeziene data. Waarom apart houden? Als je het model test op dezelfde data als waarop het getraind is, "kent" het de antwoorden al. Dat zegt niets over hoe goed het in het echt werkt.',
                },
                {
                    title: 'Overfitting',
                    icon: '📈',
                    content:
                        'Overfitting gebeurt als een model te goed past bij de trainingdata, maar slecht presteert op nieuwe data. Het model heeft de voorbeelden "uit zijn hoofd geleerd" in plaats van het patroon begrepen. Vergelijk het met een leerling die alle antwoorden van het proefwerk memoriseert maar de stof niet begrijpt. Op het proefwerk: 100%. Op een iets ander proefwerk: 40%.',
                },
                {
                    title: 'Features en labels',
                    icon: '🏷️',
                    content:
                        'Features zijn de kenmerken die het model als input krijgt: "heeft link", "onbekende afzender", "percentage hoofdletters". Labels zijn de uitkomsten die het model moet leren voorspellen: "spam" of "geen spam". Het kiezen van de juiste features is een van de moeilijkste en belangrijkste stappen in machine learning — ook wel "feature engineering" genoemd.',
                },
                {
                    title: 'Classificatie vs. regressie',
                    icon: '🔢',
                    content:
                        'Classificatie: het model voorspelt een categorie (spam/niet spam, hond/kat, ziek/gezond). Regressie: het model voorspelt een getal (de prijs van een huis, het cijfer van een leerling, de temperatuur van morgen). De keuze hangt af van wat je wilt voorspellen. Beide zijn vormen van supervised learning.',
                },
            ],
            questions: [
                {
                    id: 'q7-overfitting-herkennen',
                    question:
                        'Diagnoseer de modelcrash: trainingaccuracy is 98%, testaccuracy is 61%. Wat is er waarschijnlijk aan de hand en welke eerste herstelactie zou jij testen?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het enorme verschil tussen 98% trainingaccuracy en 61% testaccuracy is een klassiek teken van overfitting. Het model kent de trainingsvoorbeelden te goed, maar heeft het algemene patroon niet geleerd. Een logische eerste herstelactie is minder features gebruiken, meer trainingsdata verzamelen, een eenvoudiger model testen of de testset verbeteren.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'train-test-gap', keywords: ['98', '61', 'training', 'test', 'testset'] },
                        { label: 'overfitting diagnose', keywords: ['overfitting', 'memoriseert', 'uit het hoofd', 'te specifiek', 'generaliseert'] },
                        { label: 'nieuwe data probleem', keywords: ['nieuwe data', 'ongeziene data', 'praktijk', 'werkt slecht', 'patroon'] },
                        { label: 'herstelactie', keywords: ['minder features', 'meer trainingsdata', 'eenvoudiger model', 'betere testset', 'oplossing'] },
                    ],
                },
                {
                    id: 'q8-classificatie-regressie',
                    question:
                        'Je wilt een model bouwen dat voorspelt hoeveel uur een leerling per week op zijn telefoon zit. Is dit classificatie of regressie? Leg uit.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Dit is regressie: de uitkomst is een getal (bijv. 3,5 uur), geen categorie. Als je zou willen voorspellen of een leerling "veel" of "weinig" telefoongebruik heeft, wordt het classificatie. Het verschil zit in de uitkomstvariabele: getal = regressie, categorie = classificatie.',
                    points: 0,
                    minLength: 35,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'regressie', keywords: ['regressie'] },
                        { label: 'getal als uitkomst', keywords: ['getal', 'uur', 'uren'] },
                        { label: 'verschil met classificatie', keywords: ['classificatie', 'categorie'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🧠',
            title: 'ML Expert!',
            color: '#0B453F',
        },
        {
            minScore: 65,
            emoji: '🤖',
            title: 'Model Trainer',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Data Scientist in opleiding',
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
        'Supervised learning leert van gelabelde voorbeelden (training set)',
        'Accuracy meet hoe goed een model presteert op nieuwe, ongeziene data (test set)',
        'Overfitting: het model kent de trainingsdata van buiten maar generaliseert slecht',
        'Features zijn kenmerken; labels zijn de uitkomsten die het model leert voorspellen',
        'Classificatie voorspelt categorieën; regressie voorspelt getallen',
    ],
};

export default mlTrainerConfig;
