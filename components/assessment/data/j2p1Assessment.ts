
import { AssessmentTask, AssessmentConfig } from '../types';

export const J2P1_CONFIG: AssessmentConfig = {
    title: 'Het Data Lab',
    description: 'Bewijs dat je data kunt analyseren, verwerken en kritisch kunt beoordelen!',
    introIcon: '📊',
    themeColor: 'emerald',
    introText: 'Een mysterieus datalek heeft de school getroffen. Datasets zijn door elkaar gegooid, bronnen zijn onbetrouwbaar en een AI-systeem maakt verdachte beslissingen. Jij bent ingeschakeld als Data Specialist om de boel te redden!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'data-analyse', label: 'Leerling kan een dataset interpreteren en conclusies trekken.', required: true },
            { id: 'bronverificatie', label: 'Leerling kan online bronnen verifiëren en betrouwbaarheid beoordelen.', required: true },
            { id: 'spreadsheet', label: 'Leerling kan basisformules en grafieken gebruiken in een spreadsheet.', required: true },
            { id: 'ai-bias', label: 'Leerling kan voorbeelden geven van bias in AI-systemen.' }
        ],
        teacherInstructions: 'Beoordeel of de leerling data kan analyseren en kritisch kan omgaan met digitale informatie. Let op begrip van bronbetrouwbaarheid en AI-bias.'
    }
};

export const J2P1_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Grafiek Detective
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p1-data-inspector',
        type: 'inspector',
        title: 'Grafiek Detective',
        description: 'Een schoolkrant heeft een grafiek gepubliceerd over smartphonegebruik. Maar er klopt iets niet...',
        xpReward: 80,
        question: 'Bekijk deze grafiek over smartphonegebruik onder jongeren. Wat is er misleidend?',
        image: 'SPECIAL:BAR_CHART_MISLEADING',
        hotspots: [
            {
                id: 'y-axis',
                x: 5, y: 30, width: 15, height: 40,
                label: 'Y-as begint niet bij 0',
                correct: true,
                feedback: 'Goed gevonden! De Y-as begint bij 60% in plaats van 0%. Hierdoor lijken de verschillen veel groter dan ze zijn. Dit is een veelgebruikte truc om data misleidend te presenteren.'
            },
            {
                id: 'title',
                x: 20, y: 5, width: 60, height: 10,
                label: 'Titel van de grafiek',
                correct: false,
                feedback: 'De titel is informatief maar niet het probleem. Kijk eens goed naar de schaalverdeling van de grafiek.'
            },
            {
                id: 'bars',
                x: 25, y: 30, width: 55, height: 50,
                label: 'De staven zelf',
                correct: false,
                feedback: 'De staven zijn correct getekend, maar de schaal waarop ze staan is misleidend. Kijk naar de Y-as!'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Bronnen Checken
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p1-broncheck',
        type: 'rescuer',
        title: 'Bronnen Checken',
        description: 'Een medeleerling heeft informatie gevonden voor een werkstuk. Help om de bronnen te verifiëren!',
        xpReward: 90,
        npcName: 'Medeleerling',
        scenario: 'Ik heb een artikel gevonden dat zegt dat 90% van de jongeren verslaafd is aan social media. Het staat op een website die ik niet ken. Hoe check ik of dit betrouwbaar is?',
        availableSteps: [
            { id: 'step-1', text: 'Controleer wie de auteur is en wat hun expertise is.' },
            { id: 'step-2', text: 'Zoek of andere betrouwbare bronnen (bijv. CBS, universiteit) hetzelfde beweren.' },
            { id: 'step-3', text: 'Check wanneer het artikel is gepubliceerd (actualiteit).' },
            { id: 'step-4', text: 'Kijk of het artikel bronvermeldingen heeft.' },
            { id: 'step-wrong-1', text: 'Als het er professioneel uitziet, is het betrouwbaar.' },
            { id: 'step-wrong-2', text: 'Kopieer de informatie direct in je werkstuk.' }
        ],
        correctSequence: ['step-1', 'step-4', 'step-2', 'step-3']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: AI Bias Ontdekken
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p1-ai-bias',
        type: 'simulator',
        title: 'AI Bias Ontdekken',
        description: 'Een AI-sollicitatiesysteem maakt verdachte keuzes. Onderzoek de trainingsdata!',
        xpReward: 100,
        items: [
            { id: 'cv-man-tech', type: 'file', name: 'CV: Man, IT-ervaring', icon: 'FileText' },
            { id: 'cv-vrouw-tech', type: 'file', name: 'CV: Vrouw, IT-ervaring', icon: 'FileText' },
            { id: 'cv-man-geen', type: 'file', name: 'CV: Man, geen ervaring', icon: 'FileText' },
            { id: 'cv-vrouw-geen', type: 'file', name: 'CV: Vrouw, geen ervaring', icon: 'FileText' }
        ],
        targets: [
            { id: 'aangenomen', name: 'Aangenomen door AI', type: 'folder', accepts: ['cv-man-tech', 'cv-vrouw-tech'] },
            { id: 'afgewezen', name: 'Afgewezen door AI', type: 'trash', accepts: ['cv-vrouw-tech', 'cv-man-geen', 'cv-vrouw-geen'] },
            { id: 'bias-flag', name: 'Bias Gedetecteerd', type: 'folder', accepts: ['cv-vrouw-tech'] }
        ],
        goal: 'De AI wijst vrouwen met IT-ervaring af maar mannen zonder ervaring niet. Sleep het CV dat onterecht afgewezen wordt naar "Bias Gedetecteerd".',
        successCondition: (state: any) => state?.['bias-flag']?.includes('cv-vrouw-tech') ?? false
    }
];
