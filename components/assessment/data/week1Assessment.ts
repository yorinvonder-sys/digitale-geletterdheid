
import { AssessmentTask, AssessmentConfig } from '../types';

export const WEEK_1_CONFIG: AssessmentConfig = {
    title: 'De Tijdmachine',
    description: 'Reis terug naar het jaar 2005 en red de presentaties van toen!',
    introIcon: '🕰️',
    themeColor: 'amber',
    introText: 'Je stapt in de tijdmachine en belandt in een computerlokaal uit 2005. De slides zijn lelijk, de bestanden zijn een rommeltje en niemand snapt Word. Help (je ouders?) om de digitale chaos te overleven!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'word-product', label: 'Word-document is volledig en netjes opgemaakt.', required: true },
            { id: 'ppt-product', label: 'PowerPoint heeft 3 duidelijke slides en is mondeling toegelicht.', required: true },
            { id: 'print-check', label: 'Print is correct uitgevoerd (juiste document, leesbaar, compleet).', required: true },
            { id: 'magister-check', label: 'Word + PowerPoint staan correct ingeleverd in Magister.', required: true }
        ],
        teacherInstructions: 'Docent valideert het echte product in de les. AI-score beoordeelt basisvaardigheden in de simulatie; docentscore beoordeelt het echte uitgevoerde werk.'
    }
};

export const WEEK_1_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Magister Master
    // ─────────────────────────────────────────────────────────
    {
        id: 'magister-master-1',
        type: 'inspector',
        title: 'Magister Master',
        description: 'Je hebt je huiswerk af. Nu moet het nog in Magister!',
        xpReward: 60,
        question: 'In de Magister app op je iPad: waar tik je op om een bestand te uploaden voor een opdracht?',
        image: 'SPECIAL:MAGISTER_IPAD_UPLOAD',
        hotspots: [
            {
                id: 'add-file-btn',
                x: 85, y: 15, width: 10, height: 8,
                label: 'Bestand toevoegen',
                correct: true,
                feedback: 'Goed zo! Via het plusje of "Bestand toevoegen" upload je vanuit iCloud of OneDrive.'
            },
            {
                id: 'message-btn',
                x: 10, y: 90, width: 10, height: 8,
                label: 'Berichten',
                correct: false,
                feedback: 'Fout. Dat is voor berichten. Inleveren doe je bij de opdracht zelf.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Cloud Commander (OneDrive)
    // ─────────────────────────────────────────────────────────
    {
        id: 'cloud-commander-1',
        type: 'rescuer',
        title: 'Cloud Commander',
        description: 'Je OneDrive is een zootje. Hoe verplaats je dat verslag naar de juiste map?',
        xpReward: 80,
        npcName: 'Cloud Coach',
        scenario: 'Ik wil "Verslag_V1.docx" verplaatsen naar de map "Periode 1" op mijn iPad. Wat zijn de stappen?',
        availableSteps: [
            { id: 'step-1', text: 'Tik op de drie puntjes (...) naast het bestand.' },
            { id: 'step-2', text: 'Tik op "Verplaatsen".' },
            { id: 'step-3', text: 'Selecteer de map "Periode 1".' },
            { id: 'step-4', text: 'Tik op "Hierheen verplaatsen".' },
            { id: 'step-wrong-1', text: 'Gooi het bestand in de prullenbak.' },
            { id: 'step-wrong-2', text: 'Maak een screenshot van het bestand.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Word Wizard
    // ─────────────────────────────────────────────────────────
    {
        id: 'word-wizard-1',
        type: 'inspector',
        title: 'Word Wizard',
        description: 'Word op iPad heeft handige trucjes voor kleine schermen.',
        xpReward: 100,
        question: 'Waar tik je om de "Mobiele weergave" aan te zetten, zodat de tekst automatisch aanpast aan je scherm?',
        image: 'SPECIAL:WORD_IPAD_MOBILE_VIEW',
        hotspots: [
            {
                id: 'mobile-view-icon',
                x: 92, y: 3, width: 5, height: 5,
                label: 'Mobiele weergave',
                correct: true,
                feedback: 'Top! Hiermee kun je makkelijk typen zonder steeds in en uit te zoomen.'
            },
            {
                id: 'search-icon',
                x: 85, y: 3, width: 5, height: 5,
                label: 'Zoeken',
                correct: false,
                feedback: 'Niet die. Zoek het icoontje dat lijkt op een kleine smartphone rechtsboven.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 4: Slide Specialist (PowerPoint)
    // ─────────────────────────────────────────────────────────
    {
        id: 'slide-specialist-1',
        type: 'rescuer',
        title: 'Slide Specialist',
        description: 'Maak je presentatie interactief met iPad-features.',
        xpReward: 90,
        npcName: 'Presentatie Pro',
        scenario: 'Ik wil live op mijn slide tekenen terwijl ik presenteer op de iPad. Hoe doe ik dat?',
        availableSteps: [
            { id: 'step-1', text: 'Start de diavoorstelling.' },
            { id: 'step-2', text: 'Houd je vinger ingedrukt midden op het scherm.' },
            { id: 'step-3', text: 'Tik op het pen-icoon in het menu dat verschijnt.' },
            { id: 'step-4', text: 'Begin met tekenen op de slide.' },
            { id: 'step-wrong-1', text: 'Schud je iPad hard heen en weer.' },
            { id: 'step-wrong-2', text: 'Roep "TEKENEN" tegen Siri.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 5: Print Pro
    // ─────────────────────────────────────────────────────────
    {
        id: 'print-pro-1',
        type: 'rescuer',
        title: 'Print Pro',
        description: 'Tijd om je werk uit de printer te toveren.',
        xpReward: 70,
        npcName: 'De Printer',
        scenario: 'Je hebt je bestand in de RICOH app geüpload. Wat doe je NU bij de printer op school?',
        availableSteps: [
            { id: 'step-1', text: 'Scan je schoolpasje bij de kaartlezer van de printer.' },
            { id: 'step-2', text: 'Wacht tot je naam in het scherm verschijnt.' },
            { id: 'step-3', text: 'Tik op "Print" of "Afdrukken" op het touchscreen.' },
            { id: 'step-4', text: 'Pak je papier en log uit op het scherm.' },
            { id: 'step-wrong-1', text: 'Sla hard op de zijkant van de printer.' },
            { id: 'step-wrong-2', text: 'Leg je iPad op de scanner en druk op start.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    }
];
