
import { AssessmentTask, AssessmentConfig } from '../types';

export const J3P3_CONFIG: AssessmentConfig = {
    title: 'De Innovatie Pitch',
    description: 'Evalueer technologische innovaties en hun maatschappelijke impact op een techconferentie!',
    introIcon: '💡',
    themeColor: 'orange',
    introText: 'Welkom op de TechForward Conferentie — het grootste innovatie-evenement van Nederland! Startups pitchen hun nieuwste technologieën, maar niet alles wat glinstert is goud. Sommige innovaties hebben verborgen ethische problemen, andere beïnvloeden bepaalde groepen negatief. Jij bent uitgenodigd als jonge tech-analist om de innovaties kritisch te beoordelen, ethische kwesties bloot te leggen en de impact op verschillende belanghebbenden in kaart te brengen.',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'innovation-thinking', label: 'Leerling kan het innovatieproces beschrijven van probleem tot iteratie.', required: true },
            { id: 'ethical-analysis', label: 'Leerling kan ethische dilemma\'s in technologie herkennen en beargumenteren.', required: true },
            { id: 'stakeholder-awareness', label: 'Leerling kan verschillende belanghebbenden identificeren en hun perspectieven beschrijven.', required: true },
            { id: 'policy-understanding', label: 'Leerling begrijpt hoe technologiebeleid verschillende groepen kan beïnvloeden.', required: true }
        ],
        teacherInstructions: 'Docent valideert of de leerling niet alleen de concepten herkent, maar ook genuanceerd kan redeneren over ethische kwesties en maatschappelijke impact. Let op of de leerling meerdere perspectieven kan benoemen en niet zwart-wit denkt. De AI-score toetst basiskennis; de docentscore toetst kritisch denkvermogen en nuance.'
    }
};

export const J3P3_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Startup Development Stappen
    // ─────────────────────────────────────────────────────────
    {
        id: 'startup-stappen-1',
        type: 'rescuer',
        title: 'Startup Development Stappen',
        description: 'Een jonge startup wil een app bouwen om eenzaamheid onder ouderen te bestrijden. Zet de ontwikkelstappen in de juiste volgorde!',
        xpReward: 90,
        npcName: 'Startup Coach Yara',
        scenario: 'Team "ZilverConnect" wil een app ontwikkelen die ouderen koppelt aan vrijwilligers in de buurt. Ze hebben een geweldig idee, maar weten niet waar ze moeten beginnen. Help ze het innovatieproces in de juiste volgorde te doorlopen!',
        availableSteps: [
            { id: 'step-problem', text: 'Probleem identificeren: onderzoek hoe groot het eenzaamheidsprobleem onder ouderen precies is.' },
            { id: 'step-research', text: 'Marktonderzoek: bestaan er al vergelijkbare apps? Wat werkt wel en niet?' },
            { id: 'step-design', text: 'Oplossing ontwerpen: maak wireframes en een gebruiksvriendelijk ontwerp (denk aan toegankelijkheid voor ouderen!).' },
            { id: 'step-mvp', text: 'MVP bouwen: ontwikkel een minimale versie met alleen de kernfunctionaliteit.' },
            { id: 'step-test', text: 'Testen met gebruikers: laat echte ouderen en vrijwilligers de app uitproberen en geef feedback.' },
            { id: 'step-iterate', text: 'Itereren: verbeter de app op basis van de testresultaten en gebruikersfeedback.' },
            { id: 'step-wrong-1', text: 'Direct een volledige app bouwen met alle mogelijke functies zonder eerst te testen.' },
            { id: 'step-wrong-2', text: 'Een fancy website maken en hopen dat gebruikers vanzelf komen.' }
        ],
        correctSequence: ['step-problem', 'step-research', 'step-design', 'step-mvp', 'step-test', 'step-iterate']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Ethisch Dilemma Herkennen
    // ─────────────────────────────────────────────────────────
    {
        id: 'ethisch-dilemma-1',
        type: 'inspector',
        title: 'Ethisch Dilemma Herkennen',
        description: 'Een startup pitcht een product met een verborgen ethisch probleem. Kun jij het vinden?',
        xpReward: 110,
        question: 'Startup "SafeCity" pitcht hun product: AI-camera\'s in de openbare ruimte die gezichtsherkenning gebruiken om criminelen op te sporen. Bekijk hun pitch-slide en klik op het grootste ethische probleem.',
        image: 'SPECIAL:SAFECITY_PITCH',
        hotspots: [
            {
                id: 'no-consent',
                x: 10, y: 40, width: 80, height: 18,
                label: 'Gezichtsherkenning zonder toestemming',
                correct: true,
                feedback: 'Precies! Het grootste ethische probleem is dat ALLE voorbijgangers worden gescand zonder hun toestemming. Dit schendt het recht op privacy (AVG/GDPR). Mensen worden in de openbare ruimte gefilmd en geïdentificeerd zonder dat ze het weten of ermee hebben ingestemd. Bovendien is gezichtsherkenning minder nauwkeurig bij bepaalde huidskleuren, wat kan leiden tot discriminatie.'
            },
            {
                id: 'crime-stats',
                x: 60, y: 10, width: 35, height: 18,
                label: 'Criminaliteitsstatistieken',
                correct: false,
                feedback: 'De statistieken zijn niet het kernprobleem. Het ethische dilemma zit in HOE de technologie wordt ingezet: massasurveillance zonder toestemming van burgers. Meer veiligheid is goed, maar niet ten koste van ieders privacy.'
            },
            {
                id: 'tech-specs',
                x: 10, y: 70, width: 45, height: 15,
                label: 'Technische specificaties',
                correct: false,
                feedback: 'De technologie zelf is niet het probleem — het gaat om hoe die wordt gebruikt. De ethische kwestie zit in het schenden van privacy door gezichtsherkenning zonder toestemming toe te passen op iedereen in de openbare ruimte.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Stakeholder Impact Analyse
    // ─────────────────────────────────────────────────────────
    {
        id: 'stakeholder-impact-1',
        type: 'simulator',
        title: 'Stakeholder Impact Analyse',
        description: 'De overheid wil gratis Wi-Fi in alle openbare gebouwen. Sorteer de belanghebbenden op basis van de impact.',
        xpReward: 100,
        items: [
            {
                id: 'item-studenten',
                type: 'file',
                name: 'Studenten zonder thuisinternet',
                icon: 'GraduationCap',
                content: 'Krijgen eindelijk toegang tot internet voor huiswerk en studie.'
            },
            {
                id: 'item-ouderen',
                type: 'file',
                name: 'Ouderen in buurthuizen',
                icon: 'Heart',
                content: 'Kunnen makkelijker contact houden met familie via videobellen.'
            },
            {
                id: 'item-telecom',
                type: 'file',
                name: 'Telecombedrijven',
                icon: 'Building2',
                content: 'Verliezen klanten die overstappen naar gratis Wi-Fi.'
            },
            {
                id: 'item-privacy',
                type: 'file',
                name: 'Privacy-bewuste burgers',
                icon: 'ShieldAlert',
                content: 'Maken zich zorgen over datatracking op openbaar Wi-Fi.'
            },
            {
                id: 'item-ondernemers',
                type: 'file',
                name: 'Kleine ondernemers in de buurt',
                icon: 'Store',
                content: 'Kunnen klanten trekken met gratis internetaanbod, maar betalen via belasting mee.'
            },
            {
                id: 'item-gemeente',
                type: 'file',
                name: 'Gemeenten',
                icon: 'Landmark',
                content: 'Moeten de kosten dragen voor aanleg en onderhoud van het netwerk.'
            }
        ],
        targets: [
            {
                id: 'target-positief',
                name: 'Positief beïnvloed',
                type: 'folder',
                accepts: ['item-studenten', 'item-ouderen', 'item-ondernemers']
            },
            {
                id: 'target-negatief',
                name: 'Negatief beïnvloed',
                type: 'folder',
                accepts: ['item-telecom', 'item-privacy', 'item-gemeente']
            }
        ],
        goal: 'Sleep elke belanghebbende naar de juiste categorie: wordt deze groep positief of negatief beïnvloed door de invoering van gratis openbaar Wi-Fi?',
        successCondition: (state: any) => {
            const positief = state['target-positief'] || [];
            const negatief = state['target-negatief'] || [];
            return positief.includes('item-studenten') &&
                   positief.includes('item-ouderen') &&
                   positief.includes('item-ondernemers') &&
                   negatief.includes('item-telecom') &&
                   negatief.includes('item-privacy') &&
                   negatief.includes('item-gemeente');
        }
    }
];
