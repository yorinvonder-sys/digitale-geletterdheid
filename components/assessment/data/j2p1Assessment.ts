
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
        type: 'classifier',
        title: 'Bronnen Checken',
        description: 'Een medeleerling heeft informatie gevonden voor een werkstuk. Beoordeel elk advies: is het slim of niet?',
        xpReward: 90,
        npcName: 'Medeleerling',
        scenario: 'Ik heb een artikel gevonden dat zegt dat 90% van de jongeren verslaafd is aan social media. Het staat op een website die ik niet ken. Hoe check ik of dit betrouwbaar is?',
        goodLabel: 'Slim advies',
        badLabel: 'Niet slim',
        minCorrect: 5,
        options: [
            {
                id: 'opt-auteur',
                text: 'Controleer wie de auteur is en wat hun expertise is.',
                correct: true,
                feedback: 'Goed! De achtergrond van de auteur zegt veel over de betrouwbaarheid. Een arts die over gezondheid schrijft is geloofwaardiger dan een anonieme blogger.'
            },
            {
                id: 'opt-kruischeck',
                text: 'Zoek of andere betrouwbare bronnen (bijv. CBS, universiteit) hetzelfde beweren.',
                correct: true,
                feedback: 'Slim! Als meerdere onafhankelijke bronnen hetzelfde zeggen, is de informatie waarschijnlijk betrouwbaarder.'
            },
            {
                id: 'opt-actualiteit',
                text: 'Check wanneer het artikel is gepubliceerd (actualiteit).',
                correct: true,
                feedback: 'Klopt! Een artikel uit 2015 over social media is waarschijnlijk verouderd. Recente bronnen zijn vaak betrouwbaarder voor dit soort onderwerpen.'
            },
            {
                id: 'opt-bronvermelding',
                text: 'Kijk of het artikel bronvermeldingen heeft.',
                correct: true,
                feedback: 'Precies! Goede artikelen verwijzen naar hun bronnen. Zonder bronvermeldingen kun je niet controleren waar de informatie vandaan komt.'
            },
            {
                id: 'opt-uiterlijk',
                text: 'Als het er professioneel uitziet, is het betrouwbaar.',
                correct: false,
                feedback: 'Pas op! Een mooie website zegt niets over de inhoud. Nepnieuws-sites zien er vaak heel professioneel uit om je te misleiden.'
            },
            {
                id: 'opt-kopieren',
                text: 'Kopieer de informatie direct in je werkstuk.',
                correct: false,
                feedback: 'Niet doen! Zonder te checken of het klopt, kun je foute informatie verspreiden. Altijd eerst verifiëren voordat je iets overneemt.'
            }
        ]
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
