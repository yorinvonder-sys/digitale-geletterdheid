import type { DataViewerConfig } from '../DataViewer';

export const mlTrainerConfig: DataViewerConfig = {
    missionId: 'ml-trainer',
    title: 'ML Trainer',
    introEmoji: '🧠',
    introTitle: 'Word een ML Trainer',
    introDescription:
        'Machine learning klinkt ingewikkeld, maar het idee is simpel: je laat een computer leren van voorbeelden. Jij gaat ontdekken hoe supervised learning werkt — van het kiezen van features tot het beoordelen van de accuracy van een model.',
    introFeatures: [
        'Analyseer een gelabelde dataset voor een spamfilter',
        'Vergelijk accuracy van modellen met verschillende features',
        'Beoordeel wat overfitting betekent en hoe je het herkent',
    ],

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
                        'Er zijn 5 spam-mails (ID 1, 3, 5, 7, 10) en 7 geen-spam-mails. 5 ÷ 12 × 100 ≈ 42%. Filter op "Label" = "Spam" om te tellen. Deze dataset is licht onevenwichtig — een ideale trainingsdataset is vaker ongeveer 50/50.',
                    points: 15,
                },
                {
                    id: 'q2-beste-feature',
                    question:
                        'Welke feature is het sterkste voorspeller van spam op basis van deze dataset?',
                    type: 'multiple-choice',
                    options: [
                        'Heeft link',
                        '"Gratis" of "Win" aanwezig',
                        'Onbekende afzender',
                        'Hoofdletterpercentage boven 40%',
                    ],
                    correctAnswer: '"Gratis" of "Win" aanwezig',
                    explanation:
                        'Elke e-mail met "Gratis" of "Win" is óf spam (ID 1, 3, 5, 7, 10) óf heeft andere spam-kenmerken. Van de 5 e-mails met deze woorden zijn er 4-5 spam. Onbekende afzender is ook sterk, maar ID 9 en 11 zijn geen spam ondanks een onbekende afzender. Filter op de kolom om het zelf te controleren.',
                    points: 15,
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
                { label: 'Alleen afzender', value: 68, color: '#F59E0B' },
                { label: 'Afzender + link', value: 75, color: '#3B82F6' },
                { label: 'Alle 3 features', value: 88, color: '#10B981' },
                { label: 'Alle features + datum', value: 89, color: '#8B5CF6' },
            ],
            questions: [
                {
                    id: 'q4-beste-model',
                    question: 'Welk model heeft de hoogste accuracy op de testset?',
                    type: 'multiple-choice',
                    options: [
                        'Alleen afzender',
                        'Afzender + link',
                        'Alle 3 features',
                        'Alle features + datum',
                    ],
                    correctAnswer: 'Alle features + datum',
                    explanation:
                        '"Alle features + datum" heeft de hoogste accuracy: 89%. Maar het verschil met "Alle 3 features" (88%) is slechts 1 procentpunt. Dit roept een vraag op: is het de moeite waard om een extra feature toe te voegen voor 1% winst? Meer features betekent ook meer complexiteit en kans op overfitting.',
                    points: 10,
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
                        'Een model heeft 98% accuracy op de trainingset, maar slechts 61% op de testset. Wat is dit een teken van?',
                    type: 'multiple-choice',
                    options: [
                        'Het model is perfect — 98% is uitstekend',
                        'Overfitting — het model heeft de trainingdata "gememoriseerd"',
                        'Underfitting — het model is te simpel om patronen te leren',
                        'De testset is te klein om te meten',
                    ],
                    correctAnswer: 'Overfitting — het model heeft de trainingdata "gememoriseerd"',
                    explanation:
                        'Het enorme verschil tussen 98% (training) en 61% (test) is een klassiek teken van overfitting. Het model kent de trainingsvoorbeelden van buiten, maar heeft het algemene patroon niet geleerd. Op nieuwe e-mails werkt het dus slecht. Oplossing: minder features, meer trainingsdata, of een eenvoudiger model.',
                    points: 15,
                },
                {
                    id: 'q8-classificatie-regressie',
                    question:
                        'Je wilt een model bouwen dat voorspelt hoeveel uur een leerling per week op zijn telefoon zit. Is dit classificatie of regressie? Leg uit.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Dit is regressie: de uitkomst is een getal (bijv. 3,5 uur), geen categorie. Als je zou willen voorspellen of een leerling "veel" of "weinig" telefoongebruik heeft, wordt het classificatie. Het verschil zit in de uitkomstvariabele: getal = regressie, categorie = classificatie.',
                    points: 10,
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
            color: '#7C3AED',
        },
        {
            minScore: 65,
            emoji: '🤖',
            title: 'Model Trainer',
            color: '#3B82F6',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Data Scientist in opleiding',
            color: '#10B981',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#6B6B66',
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
