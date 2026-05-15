
import { AssessmentTask, AssessmentConfig } from '../types';

export const WEEK_2_CONFIG: AssessmentConfig = {
    title: 'Het AI Lab',
    description: 'Bewijs dat je AI & Creatie begrijpt en slim kunt inzetten!',
    introIcon: '🤖',
    themeColor: 'purple',
    introText: 'Een mysterieuze AI is losgelaten op het internet en maakt er een rommeltje van. Slechte prompts, foute trainingsdata en onbetrouwbare chatbots verspreiden zich overal. Jij bent ingeschakeld als AI-specialist om de boel te fixen!',
    hybridAssessment: {
        autoWeight: 0.6,
        teacherWeight: 0.4,
        teacherChecklist: [
            { id: 'prompt-check', label: 'Leerling kan het verschil uitleggen tussen een goede en slechte prompt.', required: true },
            { id: 'ai-training', label: 'Leerling begrijpt hoe AI leert van voorbeelden (trainingsdata).', required: true },
            { id: 'ai-grenzen', label: 'Leerling kan benoemen wat AI wel en niet kan.', required: true },
            { id: 'creatief-gebruik', label: 'Leerling heeft AI creatief ingezet tijdens een missie (game, verhaal of tekening).', required: true }
        ],
        teacherInstructions: 'Docent valideert of de leerling daadwerkelijk begrijpt hoe AI werkt en het creatief heeft toegepast. De AI-score toetst basiskennis; de docentscore toetst begrip en toepassing.'
    }
};

export const WEEK_2_ASSESSMENT: AssessmentTask[] = [
    // ─────────────────────────────────────────────────────────
    // MISSION 1: Prompt Herkenning
    // ─────────────────────────────────────────────────────────
    {
        id: 'prompt-herkenning-1',
        type: 'inspector',
        title: 'Prompt Herkenning',
        description: 'Herken de slechte prompt in dit AI-gesprek.',
        xpReward: 80,
        question: 'Een leerling wil dat AI een verhaal schrijft, maar krijgt een slecht resultaat. Welke prompt is het probleem?',
        image: 'SPECIAL:PROMPT_COMPARISON',
        hotspots: [
            {
                id: 'bad-prompt',
                x: 50, y: 30, width: 45, height: 15,
                label: 'Vage prompt zonder context',
                correct: true,
                feedback: 'Goed gezien! "Schrijf iets" is veel te vaag. Een goede prompt geeft context, een doel en details mee. Bijvoorbeeld: "Schrijf een spannend verhaal over een robot die verdwaalt in een stad, geschikt voor 12-jarigen."'
            },
            {
                id: 'good-prompt',
                x: 50, y: 70, width: 45, height: 15,
                label: 'Gedetailleerde prompt met context',
                correct: false,
                feedback: 'Dit is juist een GOEDE prompt! Deze geeft context, een onderwerp en een doelgroep mee. Kijk nog eens naar de andere prompt — wat mist daar?'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 2: AI Training Stappen
    // ─────────────────────────────────────────────────────────
    {
        id: 'ai-training-1',
        type: 'rescuer',
        title: 'AI Training Stappen',
        description: 'Een AI moet leren om katten en honden te herkennen. Zet de stappen in de juiste volgorde!',
        xpReward: 90,
        npcName: 'AI Trainer',
        scenario: 'Je moet een AI trainen om katten en honden uit elkaar te houden. De AI weet nog helemaal niks — je begint vanaf nul. Zet de trainingstappen in de juiste volgorde!',
        availableSteps: [
            { id: 'step-1', text: 'Verzamel veel foto\'s van katten EN honden (trainingsdata).' },
            { id: 'step-2', text: 'Label elke foto: dit is een kat, dit is een hond.' },
            { id: 'step-3', text: 'Laat de AI de gelabelde foto\'s bestuderen (trainen).' },
            { id: 'step-4', text: 'Test de AI met nieuwe foto\'s die hij nog niet heeft gezien.' },
            { id: 'step-wrong-1', text: 'De AI een boek over dieren laten lezen.' },
            { id: 'step-wrong-2', text: 'Alleen foto\'s van katten gebruiken en hopen dat het werkt.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 3: Chatbot Fouten Spotten
    // ─────────────────────────────────────────────────────────
    {
        id: 'chatbot-fout-1',
        type: 'inspector',
        title: 'Chatbot Fouten Spotten',
        description: 'Deze chatbot geeft een fout antwoord. Kun jij de fout vinden?',
        xpReward: 100,
        question: 'Een leerling vraagt de chatbot: "Hoeveel planeten heeft ons zonnestelsel?" De chatbot geeft twee antwoorden. Welk antwoord is fout?',
        image: 'SPECIAL:CHATBOT_ERROR_DETECTION',
        hotspots: [
            {
                id: 'wrong-answer',
                x: 50, y: 35, width: 45, height: 18,
                label: 'Fout chatbot-antwoord',
                correct: true,
                feedback: 'Goed gevonden! De chatbot zegt "9 planeten inclusief Pluto", maar Pluto is sinds 2006 geen planeet meer. AI kan verouderde of foutieve informatie geven — daarom moet je altijd checken! Het juiste antwoord is 8 planeten.'
            },
            {
                id: 'correct-answer',
                x: 50, y: 70, width: 45, height: 18,
                label: 'Correct chatbot-antwoord',
                correct: false,
                feedback: 'Dit antwoord klopt juist! 8 planeten is correct. Kijk nog eens naar het andere antwoord — daar zit de fout.'
            }
        ]
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 4: Game Programmeren Logica
    // ─────────────────────────────────────────────────────────
    {
        id: 'game-logica-1',
        type: 'rescuer',
        title: 'Game Programmeren Logica',
        description: 'Je game werkt niet! Zet de programmeer-stappen in de juiste volgorde om de bug te fixen.',
        xpReward: 90,
        npcName: 'Game Developer',
        scenario: 'Je spel-personage beweegt niet meer. De code is door elkaar gegooid. Zet de stappen in de juiste volgorde om het probleem op te lossen!',
        availableSteps: [
            { id: 'step-1', text: 'Lees de foutmelding in de console om te begrijpen wat er mis is.' },
            { id: 'step-2', text: 'Zoek de regel code waar de fout zit (de bewegings-functie).' },
            { id: 'step-3', text: 'Fix de code: zorg dat de positie verandert als je op een toets drukt.' },
            { id: 'step-4', text: 'Test het spel opnieuw om te checken of de fix werkt.' },
            { id: 'step-wrong-1', text: 'De hele code wissen en opnieuw beginnen.' },
            { id: 'step-wrong-2', text: 'Meer vijanden toevoegen zodat niemand merkt dat de speler niet beweegt.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    },

    // ─────────────────────────────────────────────────────────
    // MISSION 5: AI Mogelijkheden & Grenzen
    // ─────────────────────────────────────────────────────────
    {
        id: 'ai-grenzen-1',
        type: 'rescuer',
        title: 'AI Mogelijkheden & Grenzen',
        description: 'Sorteer wat AI wel en niet kan. Ken jij de grenzen van kunstmatige intelligentie?',
        xpReward: 80,
        npcName: 'AI Expert',
        scenario: 'Je klasgenoot denkt dat AI alles kan. Jij weet beter! Zet de uitspraken in de juiste volgorde: eerst wat AI WEL kan, dan wat AI NIET kan.',
        availableSteps: [
            { id: 'step-1', text: 'AI KAN: patronen herkennen in grote hoeveelheden data (bijv. foto\'s sorteren).' },
            { id: 'step-2', text: 'AI KAN: tekst, afbeeldingen en muziek genereren op basis van voorbeelden.' },
            { id: 'step-3', text: 'AI KAN NIET: echt begrijpen wat het zegt of voelt — het simuleert begrip.' },
            { id: 'step-4', text: 'AI KAN NIET: betrouwbaar feiten checken — het kan zelfverzekerd foute dingen zeggen.' },
            { id: 'step-wrong-1', text: 'AI kan menselijke emoties echt voelen en begrijpen.' },
            { id: 'step-wrong-2', text: 'AI is altijd 100% betrouwbaar en maakt nooit fouten.' }
        ],
        correctSequence: ['step-1', 'step-2', 'step-3', 'step-4']
    }
];
