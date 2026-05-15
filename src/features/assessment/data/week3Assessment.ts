
import { AssessmentTask, AssessmentConfig } from '../types';

export const WEEK_3_CONFIG: AssessmentConfig = {
    title: 'De Data Kluis',
    description: 'Bewijs dat je data-gevaren kunt herkennen en jezelf kunt beschermen!',
    introIcon: '🔐',
    themeColor: 'emerald',
    introText: 'Een mysterieus bedrijf is betrapt op illegale datapraktijken. De Autoriteit Persoonsgegevens heeft JOU ingeschakeld als junior-onderzoeker. Analyseer het bewijs, herken de overtredingen en bescherm de slachtoffers!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'privacy-check', label: 'Leerling heeft eigen app-permissies gecontroleerd op iPad.', required: true },
            { id: 'dark-pattern', label: 'Leerling kan minimaal 2 dark patterns benoemen.', required: true },
            { id: 'avg-basis', label: 'Leerling kan in eigen woorden uitleggen waarom je onder 16 toestemming nodig hebt.', required: true },
            { id: 'actieplan', label: 'Leerling heeft een persoonlijk data-actieplan opgesteld.', required: true }
        ],
        teacherInstructions: 'Docent valideert of de leerling daadwerkelijk de iPad-instellingen heeft gecheckt en een bewust actieplan kan formuleren. De AI-score toetst basiskennis; de docentscore toetst echte toepassing.'
    }
};

export const WEEK_3_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Dark Pattern Spotter
    // ─────────────────────────────────────────────────────────
    {
        id: 'dark-pattern-1',
        type: 'inspector',
        title: 'Dark Pattern Spotter',
        description: 'Herken het dark pattern in deze cookie-popup.',
        xpReward: 80,
        question: 'Wat is het dark pattern in deze cookie-popup? Klik op het element dat je manipuleert.',
        image: 'SPECIAL:COOKIE_POPUP_DARK_PATTERN',
        hotspots: [
            {
                id: 'tiny-reject',
                x: 50, y: 85, width: 30, height: 6,
                label: 'Piepkleine weigeren-link',
                correct: true,
                feedback: 'Goed gezien! De "Weigeren" optie is opzettelijk piepklein en bijna onzichtbaar gemaakt. Dit is een dark pattern: de website maakt het moeilijk om NEE te zeggen.'
            },
            {
                id: 'big-accept',
                x: 50, y: 60, width: 40, height: 12,
                label: 'Grote accepteerknop',
                correct: false,
                feedback: 'Dit is inderdaad opvallend groot, maar het dark pattern zit in hoe de WEIGEREN-optie is verborgen. Kijk nog eens goed onderaan!'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: AVG Meldproces
    // ─────────────────────────────────────────────────────────
    {
        id: 'avg-meld-1',
        type: 'rescuer',
        title: 'AVG Meldproces',
        description: 'Een app deelt locatiedata van kinderen zonder toestemming. Wat zijn de juiste stappen?',
        xpReward: 90,
        npcName: 'Privacy Agent',
        scenario: 'De game "CoolQuest" deelt de locatiedata van 14-jarige spelers met adverteerders. De ouders weten van niks. Zet de juiste stappen in de goede volgorde om dit op te lossen.',
        availableSteps: [
            { id: 'step-1', text: 'Bewijs verzamelen: screenshots van de privacyvoorwaarden en het datadelen.' },
            { id: 'step-2', text: 'Controleren: is er toestemming gevraagd aan de ouders? (Nee, want onder 16 jaar.)' },
            { id: 'step-3', text: 'Melding maken bij de Autoriteit Persoonsgegevens (AP).' },
            { id: 'step-4', text: 'De app verwijderen of locatietoegang uitzetten in je instellingen.' },
            { id: 'step-wrong-1', text: 'Een boze review plaatsen op de App Store.' },
            { id: 'step-wrong-2', text: 'Wachten tot de app het zelf oplost.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Deepfake Check
    // ─────────────────────────────────────────────────────────
    {
        id: 'deepfake-check-1',
        type: 'inspector',
        title: 'Deepfake Check',
        description: 'Is dit profiel echt of AI-gegenereerd?',
        xpReward: 100,
        question: 'Dit profielfoto ziet er perfect uit. Maar er is iets mis. Waar zit de fout die verraadt dat het AI-gegenereerd is?',
        image: 'SPECIAL:AI_FACE_DETECTION',
        hotspots: [
            {
                id: 'asymmetric-ear',
                x: 10, y: 45, width: 8, height: 12,
                label: 'Asymmetrisch oor',
                correct: true,
                feedback: 'Goed gevonden! AI heeft moeite met oren. Ze zijn vaak asymmetrisch, wazig of missen details. Dit is een klassiek teken van een AI-gegenereerde foto.'
            },
            {
                id: 'eyes-area',
                x: 45, y: 35, width: 15, height: 10,
                label: 'Ogen',
                correct: false,
                feedback: 'De ogen zien er goed uit. AI is inmiddels erg goed in ogen. Zoek naar details die AI lastiger vindt, zoals oren of vingers!'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 4: Datalek Response
    // ─────────────────────────────────────────────────────────
    {
        id: 'datalek-response-1',
        type: 'rescuer',
        title: 'Datalek Response',
        description: 'De school is gehackt! 500 leerlingprofielen staan online. Wat doe je?',
        xpReward: 90,
        npcName: 'Directeur',
        scenario: 'Er is een datalek op school. Namen, adressen en cijfers van 500 leerlingen zijn gelekt. De directeur vraagt jou om het juiste noodplan te volgen. Zet de stappen in de goede volgorde!',
        availableSteps: [
            { id: 'step-1', text: 'Het lek dichten: wachtwoorden resetten en het systeem afsluiten.' },
            { id: 'step-2', text: 'Inventariseren: welke data is precies gelekt?' },
            { id: 'step-3', text: 'Melding doen bij de Autoriteit Persoonsgegevens (verplicht binnen 72 uur).' },
            { id: 'step-4', text: 'Ouders en leerlingen informeren over wat er is gebeurd.' },
            { id: 'step-wrong-1', text: 'Het stilhouden zodat de school geen slechte naam krijgt.' },
            { id: 'step-wrong-2', text: 'Alle computers weggooien en nieuwe kopen.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 5: Filter Bubble Doorbreken
    // ─────────────────────────────────────────────────────────
    {
        id: 'filter-bubble-1',
        type: 'rescuer',
        title: 'Filter Bubble Doorbreken',
        description: 'Je zit vast in een filterbubbel. Hoe kom je eruit?',
        xpReward: 80,
        npcName: 'Algoritme Expert',
        scenario: 'Na 2 weken alleen maar voetbalcontent bekijken op YouTube, krijg je NIKS anders meer te zien. Je wilt je bubbel doorbreken. Welke stappen neem je?',
        availableSteps: [
            { id: 'step-1', text: 'Zoek bewust naar andere onderwerpen (bijv. koken, wetenschap, muziek).' },
            { id: 'step-2', text: 'Gebruik de incognito/privémodus van je browser.' },
            { id: 'step-3', text: 'Volg accounts of kanalen buiten je interesses.' },
            { id: 'step-4', text: 'Zet "niet geïnteresseerd" aan bij content die je niet wilt zien.' },
            { id: 'step-wrong-1', text: 'Nog meer voetbalvideo\'s bekijken.' },
            { id: 'step-wrong-2', text: 'Je account verwijderen en nooit meer internet gebruiken.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    }
];
