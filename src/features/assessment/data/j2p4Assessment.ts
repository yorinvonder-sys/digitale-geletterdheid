
import { AssessmentTask, AssessmentConfig } from '../types';

export const J2P4_CONFIG: AssessmentConfig = {
    title: 'Het Ethisch Tribunaal',
    description: 'Bewijs dat je kritisch kunt nadenken over de impact van technologie op mens en maatschappij!',
    introIcon: '⚖️',
    themeColor: 'amber',
    introText: 'De gemeenteraad heeft een noodvergadering uitgeschreven. Er zijn grote zorgen over nieuwe technologieën die op school en in de stad worden ingevoerd. Privacy wordt geschonden, AI neemt beslissingen over mensen en niemand weet wat de gevolgen zijn. Jij bent aangesteld als Ethisch Adviseur om de waarheid boven tafel te krijgen!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'ethisch-redeneren', label: 'Leerling kan ethische dilemma\'s rondom technologie herkennen en beargumenteren.', required: true },
            { id: 'privacy-bewustzijn', label: 'Leerling begrijpt privacyrisico\'s en kent basisrechten (AVG/GDPR).', required: true },
            { id: 'maatschappelijke-impact', label: 'Leerling kan de maatschappelijke impact van technologie analyseren.', required: true },
            { id: 'evenwichtige-argumentatie', label: 'Leerling kan zowel voor- als nadelen van technologie benoemen en afwegen.' }
        ],
        teacherInstructions: 'Beoordeel of de leerling genuanceerd kan redeneren over ethische kwesties rondom technologie. Let op het vermogen om meerdere perspectieven te zien en een onderbouwd standpunt in te nemen.'
    }
};

export const J2P4_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: AI Impact Analyse
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p4-ai-impact',
        type: 'rescuer',
        title: 'AI Impact Analyse',
        description: 'De gemeente wil AI inzetten voor het toewijzen van woningen. Analyseer de maatschappelijke impact!',
        xpReward: 90,
        npcName: 'Wethouder',
        scenario: 'We overwegen om een AI-systeem te gebruiken dat automatisch bepaalt wie voorrang krijgt bij het toewijzen van sociale huurwoningen. Hoe moeten we de impact hiervan analyseren?',
        availableSteps: [
            { id: 'step-stakeholders', text: 'Identificeer alle betrokkenen: woningzoekenden, gemeente, woningcorporaties, kwetsbare groepen.' },
            { id: 'step-benefits', text: 'Analyseer de voordelen: snellere toewijzing, minder menselijke fouten, objectievere criteria.' },
            { id: 'step-risks', text: 'Analyseer de risico\'s: discriminatie door bias in data, gebrek aan transparantie, uitsluiting van kwetsbare groepen.' },
            { id: 'step-guidelines', text: 'Stel richtlijnen op: menselijke controle, transparantie over criteria, mogelijkheid tot bezwaar, regelmatige audit op bias.' },
            { id: 'step-wrong-1', text: 'Laat de AI gewoon zijn gang gaan, technologie is altijd eerlijker dan mensen.' },
            { id: 'step-wrong-2', text: 'Negeer de risico\'s want de voordelen wegen altijd zwaarder.' }
        ],
        correctSequence: ['step-stakeholders', 'step-benefits', 'step-risks', 'step-guidelines']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Privacy Speurder
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p4-privacy-speurder',
        type: 'inspector',
        title: 'Privacy Speurder',
        description: 'De school heeft een nieuwe app geinstalleerd. Maar een leerling heeft iets verdachts ontdekt in de voorwaarden...',
        xpReward: 80,
        question: 'Bekijk de gebruikersvoorwaarden van deze school-app. Waar zit de privacyschending?',
        image: 'SPECIAL:APP_PRIVACY_TERMS',
        hotspots: [
            {
                id: 'location-sharing',
                x: 10, y: 45, width: 80, height: 15,
                label: 'Locatiedata delen met adverteerders',
                correct: true,
                feedback: 'Scherp gevonden! De app deelt de locatiegegevens van leerlingen met externe adverteerders. Dit is een ernstige privacyschending, zeker bij minderjarigen. Volgens de AVG/GDPR mogen persoonsgegevens van minderjarigen niet zonder expliciete toestemming van ouders worden gedeeld met derden voor commerciële doeleinden.'
            },
            {
                id: 'notifications',
                x: 10, y: 20, width: 80, height: 12,
                label: 'Push-notificaties voor huiswerk',
                correct: false,
                feedback: 'Push-notificaties voor huiswerk zijn een normale functie van een school-app. Dit is geen privacyprobleem. Kijk naar welke data met externe partijen wordt gedeeld.'
            },
            {
                id: 'login',
                x: 10, y: 70, width: 80, height: 12,
                label: 'Inloggen met schoolaccount',
                correct: false,
                feedback: 'Inloggen met een schoolaccount is standaard en veilig, mits goed beveiligd. Het privacyprobleem zit in wat er met je data gebeurt nadat je ingelogd bent.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Impact Sorteerder
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p4-impact-sorteerder',
        type: 'simulator',
        title: 'Impact Sorteerder',
        description: 'De gemeenteraad heeft een lijst met technologie-effecten. Sorteer ze in de juiste categorie!',
        xpReward: 100,
        items: [
            { id: 'impact-toegang-info', type: 'file', name: 'Internet geeft iedereen toegang tot informatie', icon: 'Globe' },
            { id: 'impact-cyberpesten', type: 'file', name: 'Social media maakt cyberpesten makkelijker', icon: 'MessageSquare' },
            { id: 'impact-zorg-ai', type: 'file', name: 'AI helpt artsen om ziektes sneller te ontdekken', icon: 'Heart' },
            { id: 'impact-banen', type: 'file', name: 'Automatisering vervangt banen van mensen', icon: 'Briefcase' },
            { id: 'impact-onderwijs', type: 'file', name: 'Online leren maakt onderwijs toegankelijker', icon: 'GraduationCap' },
            { id: 'impact-milieu', type: 'file', name: 'Datacenters verbruiken enorm veel energie', icon: 'Zap' }
        ],
        targets: [
            { id: 'positief', name: 'Positieve impact', type: 'folder', accepts: ['impact-toegang-info', 'impact-zorg-ai', 'impact-onderwijs'] },
            { id: 'negatief', name: 'Negatieve impact', type: 'folder', accepts: ['impact-cyberpesten', 'impact-banen', 'impact-milieu'] }
        ],
        goal: 'Sorteer de technologie-effecten in de juiste categorie: positief of negatief. Denk goed na over wat een voordeel en wat een nadeel is voor de maatschappij.',
        successCondition: (state: any) =>
            (state?.['positief']?.includes('impact-toegang-info') &&
            state?.['positief']?.includes('impact-zorg-ai') &&
            state?.['positief']?.includes('impact-onderwijs') &&
            state?.['negatief']?.includes('impact-cyberpesten') &&
            state?.['negatief']?.includes('impact-banen') &&
            state?.['negatief']?.includes('impact-milieu')) ?? false
    }
];
