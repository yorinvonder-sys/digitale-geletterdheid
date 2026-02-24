
import { AssessmentTask, AssessmentConfig } from '../types';

export const J2P2_CONFIG: AssessmentConfig = {
    title: 'De Code Challenge',
    description: 'Laat zien dat je algoritmisch kunt denken, bugs kunt vinden en code kunt lezen!',
    introIcon: '💻',
    themeColor: 'blue',
    introText: 'Het schoolsysteem is gecrasht! Overal in de code zitten bugs, algoritmes werken niet meer en niemand begrijpt wat er mis is. Jij bent de enige programmeur die het kan fixen. Duik in de code en red het systeem!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'algoritmisch-denken', label: 'Leerling kan een probleem stapsgewijs oplossen met een algoritme.', required: true },
            { id: 'debugging', label: 'Leerling kan systematisch fouten opsporen en oplossen in code.', required: true },
            { id: 'code-lezen', label: 'Leerling kan pseudocode en eenvoudige programmacode lezen en begrijpen.', required: true },
            { id: 'decompositie', label: 'Leerling kan een complex probleem opdelen in kleinere deelproblemen.' }
        ],
        teacherInstructions: 'Beoordeel of de leerling algoritmisch kan denken en code kan lezen. Let op het vermogen om problemen op te delen en systematisch te debuggen.'
    }
};

export const J2P2_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Bug Hunter
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p2-bug-hunter',
        type: 'inspector',
        title: 'Bug Hunter',
        description: 'Er zit een fout in dit sorteeralgoritme. De lijst wordt niet goed gesorteerd. Vind de bug!',
        xpReward: 90,
        question: 'Bekijk deze pseudocode voor een sorteeralgoritme. Er zit een off-by-one error in. Waar zit de fout?',
        image: 'SPECIAL:PSEUDOCODE_SORT_BUG',
        hotspots: [
            {
                id: 'loop-boundary',
                x: 10, y: 40, width: 80, height: 12,
                label: 'HERHAAL i VAN 1 TOT lengte(lijst)',
                correct: true,
                feedback: 'Goed gevonden! De loop moet gaan van 0 TOT lengte(lijst) - 1, niet van 1 TOT lengte(lijst). Dit is een klassieke off-by-one error: het eerste element wordt overgeslagen en het algoritme probeert voorbij het einde van de lijst te lezen.'
            },
            {
                id: 'swap-line',
                x: 10, y: 60, width: 80, height: 12,
                label: 'VERWISSEL lijst[i] EN lijst[i+1]',
                correct: false,
                feedback: 'De verwissel-operatie zelf is correct. Het probleem zit in welke elementen worden doorlopen. Kijk naar de grenzen van de herhaling.'
            },
            {
                id: 'if-condition',
                x: 10, y: 50, width: 80, height: 12,
                label: 'ALS lijst[i] > lijst[i+1] DAN',
                correct: false,
                feedback: 'De vergelijking is juist: je wilt inderdaad checken of het huidige element groter is dan het volgende. Het probleem zit ergens anders. Kijk naar waar de herhaling begint.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Debug Procedure
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p2-debug-procedure',
        type: 'rescuer',
        title: 'Debug Procedure',
        description: 'Een klasgenoot heeft een programma geschreven dat niet werkt. Help met de juiste debugstappen!',
        xpReward: 80,
        npcName: 'Klasgenoot',
        scenario: 'Mijn programma geeft een fout maar ik weet niet waar het misgaat. Ik heb al 100 keer opnieuw op "Run" gedrukt maar het werkt steeds niet. Wat moet ik doen?',
        availableSteps: [
            { id: 'step-1', text: 'Reproduceer de fout: voer het programma opnieuw uit en noteer precies wat er misgaat.' },
            { id: 'step-2', text: 'Isoleer het probleem: comment stukken code uit om te vinden welk deel de fout veroorzaakt.' },
            { id: 'step-3', text: 'Fix de fout: pas de code aan op de plek waar het probleem zit.' },
            { id: 'step-4', text: 'Test de oplossing: voer het programma opnieuw uit en controleer of het nu wel werkt.' },
            { id: 'step-wrong-1', text: 'Verwijder al je code en begin helemaal opnieuw.' },
            { id: 'step-wrong-2', text: 'Kopieer de code van iemand anders en hoop dat het werkt.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Concept Matcher
    // ─────────────────────────────────────────────────────────
    {
        id: 'j2p2-concept-matcher',
        type: 'simulator',
        title: 'Concept Matcher',
        description: 'De programmeerhandleiding is uit elkaar gevallen! Koppel elk concept aan de juiste definitie.',
        xpReward: 100,
        items: [
            { id: 'item-variabele', type: 'file', name: 'Variabele', icon: 'Box' },
            { id: 'item-loop', type: 'file', name: 'Loop (herhaling)', icon: 'Repeat' },
            { id: 'item-conditie', type: 'file', name: 'Conditie (als-dan)', icon: 'GitBranch' },
            { id: 'item-functie', type: 'file', name: 'Functie', icon: 'Code' }
        ],
        targets: [
            { id: 'def-opslag', name: 'Slaat een waarde op die je later kunt gebruiken', type: 'folder', accepts: ['item-variabele'] },
            { id: 'def-herhaling', name: 'Voert dezelfde stappen meerdere keren uit', type: 'folder', accepts: ['item-loop'] },
            { id: 'def-keuze', name: 'Maakt een keuze op basis van een voorwaarde', type: 'folder', accepts: ['item-conditie'] },
            { id: 'def-herbruikbaar', name: 'Een herbruikbaar blok code met een naam', type: 'folder', accepts: ['item-functie'] }
        ],
        goal: 'Sleep elk programmeerconcept naar de juiste definitie. Alle vier de concepten moeten bij de correcte omschrijving staan.',
        successCondition: (state: any) =>
            (state?.['def-opslag']?.includes('item-variabele') &&
            state?.['def-herhaling']?.includes('item-loop') &&
            state?.['def-keuze']?.includes('item-conditie') &&
            state?.['def-herbruikbaar']?.includes('item-functie')) ?? false
    }
];
