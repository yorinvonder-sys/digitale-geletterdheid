
import { AssessmentTask, AssessmentConfig } from '../types';

export const J3P1_CONFIG: AssessmentConfig = {
    title: 'Het AI Laboratorium',
    description: 'Debug een ontspoord AI-systeem in een ziekenhuis en bewijs je kennis van programmeren en kunstmatige intelligentie!',
    introIcon: '🧪',
    themeColor: 'violet',
    introText: 'NOODMELDING: Het AI-systeem van het Dijkstra Ziekenhuis is ontregeld! De machine learning-modellen geven verkeerde diagnoses, de API stuurt foutieve statuscodes terug en de hele trainings-pipeline is in de war. Jij bent de enige programmeur die beschikbaar is. Ga het lab in, analyseer de problemen en herstel het systeem voordat er echte schade ontstaat!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'ml-concepts', label: 'Leerling kan de basisbegrippen van machine learning uitleggen (supervised learning, training, evaluatie).', required: true },
            { id: 'api-understanding', label: 'Leerling begrijpt hoe een REST API werkt en kan HTTP-statuscodes herkennen.', required: true },
            { id: 'programming-paradigms', label: 'Leerling kan het verschil uitleggen tussen verschillende programmeerparadigma\'s (bijv. imperatief vs. declaratief).', required: true },
            { id: 'computational-thinking', label: 'Leerling past computational thinking toe: probleem ontleden, patronen herkennen, abstractie en algoritme ontwerpen.', required: true }
        ],
        teacherInstructions: 'Docent valideert of de leerling de concepten echt begrijpt en niet alleen de juiste antwoorden heeft geraden. Let op of de leerling kan uitleggen WAAROM een stap in de ML-pipeline nodig is en WAT er misgaat bij de API-fout. De AI-score toetst basiskennis; de docentscore toetst diepgaand begrip en toepassing.'
    }
};

export const J3P1_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: ML Pipeline Herstellen
    // ─────────────────────────────────────────────────────────
    {
        id: 'ml-pipeline-1',
        type: 'rescuer',
        title: 'ML Pipeline Herstellen',
        description: 'De trainings-pipeline van het AI-diagnosesysteem is door elkaar gegooid. Zet de stappen in de juiste volgorde!',
        xpReward: 100,
        npcName: 'Dr. Neural',
        scenario: 'Het AI-diagnosesysteem moet opnieuw getraind worden, maar een stagiair heeft alle stappen door elkaar gehaald. De pipeline is compleet in de war! Zet de stappen van de machine learning trainings-pipeline in de correcte volgorde om het systeem te herstellen.',
        availableSteps: [
            { id: 'step-collect', text: 'Data verzamelen: medische scans en patiëntgegevens ophalen uit de database.' },
            { id: 'step-preprocess', text: 'Data voorbewerken: ontbrekende waarden aanvullen, data normaliseren en opschonen.' },
            { id: 'step-split', text: 'Data splitsen in een trainingsset (80%) en een testset (20%).' },
            { id: 'step-train', text: 'Het model trainen op de trainingsset met het juiste algoritme.' },
            { id: 'step-evaluate', text: 'Het model evalueren op de testset en de nauwkeurigheid meten.' },
            { id: 'step-deploy', text: 'Het gevalideerde model deployen naar het ziekenhuissysteem.' },
            { id: 'step-wrong-1', text: 'Het model direct deployen zonder te testen op nieuwe data.' },
            { id: 'step-wrong-2', text: 'Alleen de mooiste data gebruiken en de rest weggooien.' }
        ],
        correctSequence: ['step-collect', 'step-preprocess', 'step-split', 'step-train', 'step-evaluate', 'step-deploy']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: API Fout Opsporen
    // ─────────────────────────────────────────────────────────
    {
        id: 'api-fout-1',
        type: 'inspector',
        title: 'API Fout Opsporen',
        description: 'De REST API van het ziekenhuis stuurt verkeerde responses terug. Vind de fouten!',
        xpReward: 90,
        question: 'Bekijk deze API-response van het patiëntensysteem. Er zitten twee fouten in: een verkeerde HTTP-statuscode en een ontbrekend verplicht veld. Klik op de fout die het systeem laat crashen.',
        image: 'SPECIAL:API_RESPONSE_ERROR',
        hotspots: [
            {
                id: 'wrong-status',
                x: 15, y: 12, width: 35, height: 10,
                label: 'Verkeerde HTTP-statuscode',
                correct: true,
                feedback: 'Goed gevonden! De API geeft statuscode 200 (OK) terug, maar de patiënt is niet gevonden. Dat hoort statuscode 404 (Not Found) te zijn. Een verkeerde statuscode zorgt ervoor dat het systeem denkt dat alles goed is, terwijl er eigenlijk een fout is opgetreden.'
            },
            {
                id: 'missing-field',
                x: 15, y: 55, width: 50, height: 10,
                label: 'Ontbrekend verplicht veld',
                correct: true,
                feedback: 'Scherp gezien! Het veld "patient_id" ontbreekt in de response body. Dit is een verplicht veld dat het systeem nodig heeft om de juiste patiëntgegevens op te halen. Zonder dit veld crasht de frontend.'
            },
            {
                id: 'correct-header',
                x: 15, y: 35, width: 40, height: 10,
                label: 'Content-Type header',
                correct: false,
                feedback: 'Deze header is correct! "Content-Type: application/json" is precies wat je verwacht bij een JSON API-response. De fout zit ergens anders — kijk naar de statuscode en de body.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: ML Concepten Matchen
    // ─────────────────────────────────────────────────────────
    {
        id: 'ml-concepten-1',
        type: 'simulator',
        title: 'ML Concepten Matchen',
        description: 'Het kennissysteem is gecrasht. Koppel de ML-begrippen aan hun juiste definities om het te herstellen.',
        xpReward: 110,
        items: [
            {
                id: 'item-supervised',
                type: 'file',
                name: 'Supervised Learning',
                icon: 'Brain',
                content: 'Een techniek waarbij het model leert van gelabelde voorbeelddata.'
            },
            {
                id: 'item-neural',
                type: 'file',
                name: 'Neuraal Netwerk',
                icon: 'Network',
                content: 'Een model geïnspireerd op het menselijk brein, met lagen van verbonden knooppunten.'
            },
            {
                id: 'item-overfit',
                type: 'file',
                name: 'Overfitting',
                icon: 'AlertTriangle',
                content: 'Een probleem waarbij het model de trainingsdata uit het hoofd leert in plaats van te generaliseren.'
            },
            {
                id: 'item-traindata',
                type: 'file',
                name: 'Trainingsdata',
                icon: 'Database',
                content: 'De dataset die gebruikt wordt om het model te laten leren.'
            }
        ],
        targets: [
            {
                id: 'target-leert-voorbeelden',
                name: 'Leert van gelabelde voorbeelden',
                type: 'folder',
                accepts: ['item-supervised']
            },
            {
                id: 'target-brein-model',
                name: 'Geïnspireerd op het menselijk brein',
                type: 'folder',
                accepts: ['item-neural']
            },
            {
                id: 'target-te-goed-geleerd',
                name: 'Te goed geleerd, te slecht gegeneraliseerd',
                type: 'folder',
                accepts: ['item-overfit']
            },
            {
                id: 'target-input-data',
                name: 'Input voor het leerproces',
                type: 'folder',
                accepts: ['item-traindata']
            }
        ],
        goal: 'Sleep elk ML-begrip naar de juiste definitie om het kennissysteem van het ziekenhuis te herstellen.',
        successCondition: (state: any) => {
            if (!state) return false;
            return state['target-leert-voorbeelden']?.includes('item-supervised') &&
                   state['target-brein-model']?.includes('item-neural') &&
                   state['target-te-goed-geleerd']?.includes('item-overfit') &&
                   state['target-input-data']?.includes('item-traindata');
        }
    }
];
