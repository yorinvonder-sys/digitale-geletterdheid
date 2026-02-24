
import { AssessmentTask, AssessmentConfig } from '../types';

export const J3P4_CONFIG: AssessmentConfig = {
    title: 'De Meesterproef',
    description: 'De ultieme uitdaging: bewijs je meesterschap over alle domeinen van digitale geletterdheid!',
    introIcon: '🏆',
    themeColor: 'indigo',
    introText: 'Dit is het moment waar je drie jaar naartoe hebt gewerkt. De Meesterproef is de ultieme test van jouw digitale geletterdheid. Je hebt geleerd over programmeren, AI, cybersecurity, privacy, ethiek en innovatie. Nu moet je bewijzen dat je al deze kennis kunt combineren. Beoordeel een portfolio, doorloop een volledig projectproces en koppel alle kerndoelen aan concrete activiteiten. Alleen de ware digitale meesters halen deze proef. Succes!',
    hybridAssessment: {
        autoWeight: 0.5,
        teacherWeight: 0.5,
        teacherChecklist: [
            { id: 'portfolio-quality', label: 'Het digitale portfolio is volledig, professioneel en bevat werk uit alle periodes.', required: true },
            { id: 'research-depth', label: 'Het onderzoek is grondig uitgevoerd met meerdere bronnen en een duidelijke onderzoeksvraag.', required: true },
            { id: 'presentation-skills', label: 'De presentatie is helder, goed gestructureerd en de leerling kan vragen beantwoorden.', required: true },
            { id: 'reflection-depth', label: 'De reflectie toont zelfinzicht: de leerling benoemt sterke punten, verbeterpunten en groei.', required: true },
            { id: 'technical-execution', label: 'De technische uitvoering is correct: code werkt, bestanden zijn georganiseerd, tools zijn juist gebruikt.', required: true },
            { id: 'interdisciplinary-thinking', label: 'De leerling kan verbanden leggen tussen verschillende domeinen (bijv. ethiek + AI, security + privacy).', required: true }
        ],
        teacherInstructions: 'Dit is de capstone-beoordeling van leerjaar 3. De weging is 50/50 omdat het portfolio en de presentatie minstens zo belangrijk zijn als de digitale toets. Beoordeel het GEHEEL: technische vaardigheden, kritisch denken, samenwerking en reflectie. Let specifiek op of de leerling verbanden kan leggen tussen domeinen en of de reflectie oprecht en diepgaand is. De AI-score toetst parate kennis; de docentscore toetst de totale groei en het eindniveau.'
    }
};

export const J3P4_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Project Development Lifecycle
    // ─────────────────────────────────────────────────────────
    {
        id: 'project-lifecycle-1',
        type: 'rescuer',
        title: 'Project Development Lifecycle',
        description: 'Doorloop het volledige ontwikkelproces van een digitaal project in de juiste volgorde.',
        xpReward: 100,
        npcName: 'Projectleider Sam',
        scenario: 'Je eindproject is een interactieve website over de impact van AI op de samenleving. Je hebt 6 weken de tijd. Maar je teamgenoot heeft alle stappen door elkaar gegooid! Zet het volledige projectproces in de juiste volgorde — van begin tot eind.',
        availableSteps: [
            { id: 'step-research', text: 'Onderzoek: formuleer een onderzoeksvraag en verzamel informatie uit betrouwbare bronnen.' },
            { id: 'step-plan', text: 'Planning: maak een tijdlijn, verdeel taken en stel duidelijke doelen per week.' },
            { id: 'step-design', text: 'Ontwerp: maak wireframes, kies kleuren en typografie, en ontwerp de gebruikerservaring.' },
            { id: 'step-build', text: 'Bouwen: programmeer de website, schrijf content en voeg interactieve elementen toe.' },
            { id: 'step-test', text: 'Testen: controleer op fouten, test op verschillende apparaten en vraag feedback aan klasgenoten.' },
            { id: 'step-present', text: 'Presenteren: geef een heldere presentatie over je product, proces en bevindingen.' },
            { id: 'step-reflect', text: 'Reflecteren: schrijf een reflectieverslag over wat je hebt geleerd, wat goed ging en wat beter kan.' },
            { id: 'step-wrong-1', text: 'Direct beginnen met bouwen zonder plan of onderzoek.' },
            { id: 'step-wrong-2', text: 'De presentatie overslaan en alleen het product inleveren.' }
        ],
        correctSequence: ['step-research', 'step-plan', 'step-design', 'step-build', 'step-test', 'step-present', 'step-reflect']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: Portfolio Kwaliteitscheck
    // ─────────────────────────────────────────────────────────
    {
        id: 'portfolio-check-1',
        type: 'inspector',
        title: 'Portfolio Kwaliteitscheck',
        description: 'Beoordeel dit digitale portfolio op kwaliteitsproblemen. Er zijn meerdere fouten die opgelost moeten worden!',
        xpReward: 110,
        question: 'Bekijk dit digitale portfolio van een medeleerling. Er zitten verschillende kwaliteitsproblemen in. Klik op het meest ernstige probleem.',
        image: 'SPECIAL:PORTFOLIO_REVIEW',
        hotspots: [
            {
                id: 'missing-sources',
                x: 10, y: 60, width: 80, height: 12,
                label: 'Ontbrekende bronvermeldingen',
                correct: true,
                feedback: 'Goed gevonden! Er staan feiten en cijfers in het portfolio zonder enige bronvermelding. "AI vervangt 40% van alle banen" — waar komt dat vandaan? Zonder bronnen is informatie oncontroleerbaar en mogelijk onbetrouwbaar. Altijd je bronnen vermelden!'
            },
            {
                id: 'broken-links',
                x: 10, y: 78, width: 55, height: 8,
                label: 'Gebroken links',
                correct: true,
                feedback: 'Scherp! Meerdere links in het portfolio leiden naar "404 - Pagina niet gevonden". Dit betekent dat de leerling de links niet heeft getest voordat het portfolio werd ingeleverd. Altijd je links controleren!'
            },
            {
                id: 'accessibility',
                x: 10, y: 25, width: 80, height: 15,
                label: 'Toegankelijkheidsproblemen',
                correct: true,
                feedback: 'Goed opgemerkt! De afbeeldingen missen alt-teksten, het kleurcontrast is te laag (lichtgrijs op wit) en er is geen logische koppenstructuur. Dit maakt het portfolio ontoegankelijk voor mensen met een visuele beperking of die een screenreader gebruiken.'
            },
            {
                id: 'header-design',
                x: 10, y: 5, width: 80, height: 12,
                label: 'Header en titel',
                correct: false,
                feedback: 'De header en titel zien er prima uit. De problemen zitten in de inhoud: ontbrekende bronnen, kapotte links en slechte toegankelijkheid. Kijk daar nog eens goed naar!'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: SLO Kerndoelen Matchen
    // ─────────────────────────────────────────────────────────
    {
        id: 'kerndoelen-match-1',
        type: 'simulator',
        title: 'SLO Kerndoelen Matchen',
        description: 'Koppel alle kerndoelen digitale geletterdheid aan de juiste voorbeeldactiviteiten.',
        xpReward: 120,
        items: [
            {
                id: 'item-website',
                type: 'app',
                name: 'Een website bouwen met HTML/CSS',
                icon: 'Code',
                content: 'Digitale producten maken en publiceren.'
            },
            {
                id: 'item-algorithm',
                type: 'app',
                name: 'Een sorteeralgoritme programmeren',
                icon: 'Terminal',
                content: 'Algoritmen en programmeerconcepten toepassen.'
            },
            {
                id: 'item-network',
                type: 'app',
                name: 'Uitleggen hoe het internet werkt',
                icon: 'Wifi',
                content: 'Netwerken en communicatie begrijpen.'
            },
            {
                id: 'item-data',
                type: 'file',
                name: 'Een enquête analyseren met grafieken',
                icon: 'BarChart3',
                content: 'Data verzamelen, verwerken en visualiseren.'
            },
            {
                id: 'item-security',
                type: 'file',
                name: 'Een wachtwoordmanager instellen',
                icon: 'Shield',
                content: 'Veiligheid en beveiliging toepassen.'
            },
            {
                id: 'item-media',
                type: 'file',
                name: 'Beoordelen of een nieuwsartikel betrouwbaar is',
                icon: 'FileSearch',
                content: 'Media en informatie kritisch evalueren.'
            },
            {
                id: 'item-ethics',
                type: 'file',
                name: 'Debatteren over AI-discriminatie',
                icon: 'Scale',
                content: 'Ethische en maatschappelijke kwesties analyseren.'
            },
            {
                id: 'item-impact',
                type: 'file',
                name: 'De invloed van social media onderzoeken',
                icon: 'Globe',
                content: 'Maatschappelijke impact van technologie onderzoeken.'
            },
            {
                id: 'item-ai',
                type: 'app',
                name: 'Een chatbot trainen met voorbeelddata',
                icon: 'Bot',
                content: 'Kunstmatige intelligentie begrijpen en toepassen.'
            }
        ],
        targets: [
            {
                id: 'target-22a',
                name: '22A Digitale producten',
                type: 'folder',
                accepts: ['item-website']
            },
            {
                id: 'target-22b',
                name: '22B Programmeren & algoritmen',
                type: 'folder',
                accepts: ['item-algorithm']
            },
            {
                id: 'target-21a',
                name: '21A Digitale systemen',
                type: 'folder',
                accepts: ['item-network']
            },
            {
                id: 'target-21b',
                name: '21B Media & informatie',
                type: 'folder',
                accepts: ['item-media']
            },
            {
                id: 'target-21c',
                name: '21C Data & dataverwerking',
                type: 'folder',
                accepts: ['item-data']
            },
            {
                id: 'target-21d',
                name: '21D Kunstmatige intelligentie',
                type: 'folder',
                accepts: ['item-ai']
            },
            {
                id: 'target-23a',
                name: '23A Veiligheid & privacy',
                type: 'folder',
                accepts: ['item-security']
            },
            {
                id: 'target-23b',
                name: '23B Digitaal welzijn & ethiek',
                type: 'folder',
                accepts: ['item-ethics']
            },
            {
                id: 'target-23c',
                name: '23C Maatschappelijke impact',
                type: 'folder',
                accepts: ['item-impact']
            }
        ],
        goal: 'Sleep elke activiteit naar het juiste SLO-kerndoel. Bewijs dat je weet welke activiteiten bij welk kerndoel horen!',
        successCondition: (state: any) => {
            if (!state) return false;
            return state['target-22a']?.includes('item-website') &&
                   state['target-22b']?.includes('item-algorithm') &&
                   state['target-21a']?.includes('item-network') &&
                   state['target-21b']?.includes('item-media') &&
                   state['target-21c']?.includes('item-data') &&
                   state['target-21d']?.includes('item-ai') &&
                   state['target-23a']?.includes('item-security') &&
                   state['target-23b']?.includes('item-ethics') &&
                   state['target-23c']?.includes('item-impact');
        }
    }
];
