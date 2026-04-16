import type { DataViewerConfig } from '../DataViewer';

export const uxDetectiveConfig: DataViewerConfig = {
    missionId: 'ux-detective',
    title: 'UX Detective',
    introEmoji: '🕵️',
    introTitle: 'Word een UX Detective',
    introDescription:
        'Waarom is de ene app fijn om te gebruiken en de andere een frustratie? Dat is user experience (UX). Jij gaat als UX-detective apps analyseren: problemen vinden, begrijpen waarom ze problemen zijn, en verbeteringen ontwerpen.',
    introFeatures: [
        'Analyseer gebruikersonderzoek over app-frustraties',
        'Vergelijk usability-scores van populaire apps',
        'Beoordeel welke UX-problemen het meest impact hebben',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'gebruikersfeedback-app',
            title: 'Gebruikersfeedback: schoolapp van DTLS',
            description:
                'Een schoolapp kreeg slechte reviews. UX-onderzoekers interviewden 10 leerlingen. Bekijk de bevindingen per gebruiker en beantwoord de vragen.',
            type: 'table',
            columns: [
                { key: 'gebruiker', label: 'Gebruiker', sortable: false },
                { key: 'probleem', label: 'Gevonden probleem', sortable: true },
                { key: 'categorie', label: 'Categorie', sortable: true },
                { key: 'ernst', label: 'Ernst (1-5)', sortable: true },
                { key: 'frequentie', label: 'Hoe vaak?', sortable: true },
            ],
            rows: [
                { gebruiker: 'Leerling 1', probleem: 'Kan huiswerk niet vinden in menu', categorie: 'Navigatie', ernst: 5, frequentie: 'Elke dag' },
                { gebruiker: 'Leerling 2', probleem: 'Knoppen te klein voor mijn vingers', categorie: 'Touch targets', ernst: 4, frequentie: 'Elke dag' },
                { gebruiker: 'Leerling 3', probleem: 'App geeft geen bevestiging na inleveren', categorie: 'Feedback', ernst: 4, frequentie: 'Wekelijks' },
                { gebruiker: 'Leerling 4', probleem: 'Kan huiswerk niet vinden in menu', categorie: 'Navigatie', ernst: 5, frequentie: 'Elke dag' },
                { gebruiker: 'Leerling 5', probleem: 'Rooster en huiswerk zijn op aparte plekken', categorie: 'Navigatie', ernst: 3, frequentie: 'Dagelijks' },
                { gebruiker: 'Leerling 6', probleem: 'Knoppen te klein voor mijn vingers', categorie: 'Touch targets', ernst: 4, frequentie: 'Elke dag' },
                { gebruiker: 'Leerling 7', probleem: 'Kleuren zijn moeilijk te zien', categorie: 'Toegankelijkheid', ernst: 3, frequentie: 'Altijd' },
                { gebruiker: 'Leerling 8', probleem: 'App geeft geen bevestiging na inleveren', categorie: 'Feedback', ernst: 4, frequentie: 'Wekelijks' },
                { gebruiker: 'Leerling 9', probleem: 'Laden duurt te lang', categorie: 'Prestatie', ernst: 2, frequentie: 'Soms' },
                { gebruiker: 'Leerling 10', probleem: 'Kan huiswerk niet vinden in menu', categorie: 'Navigatie', ernst: 5, frequentie: 'Elke dag' },
            ],
            questions: [
                {
                    id: 'q1-meest-voorkomend',
                    question:
                        'Welk usability-probleem komt het meest voor in deze gebruikersfeedback?',
                    type: 'multiple-choice',
                    options: [
                        'Knoppen te klein',
                        'Geen bevestiging na inleveren',
                        'Huiswerk niet vinden in menu',
                        'Kleuren moeilijk te zien',
                    ],
                    correctAnswer: 'Huiswerk niet vinden in menu',
                    explanation:
                        '"Huiswerk niet vinden in menu" wordt door 3 leerlingen (1, 4, 10) genoemd — het meest van alle problemen. Het heeft ook ernst 5 (maximaal). Sorteer op "Gevonden probleem" om duplicaten te groeperen. In UX noemen we dit een "high-priority issue": veel gebruikers, hoge ernst.',
                    points: 15,
                },
                {
                    id: 'q2-gemiddelde-ernst',
                    question:
                        'Wat is de gemiddelde ernst-score van de navigatie-problemen?',
                    type: 'number-input',
                    correctAnswer: 4.3,
                    explanation:
                        'De drie navigatie-problemen hebben ernst 5, 5 en 3. Gemiddelde: (5 + 5 + 3) ÷ 3 = 13 ÷ 3 ≈ 4,3. Filter op "Categorie" = "Navigatie" om de drie rijen te isoleren.',
                    points: 15,
                },
                {
                    id: 'q3-prioriteit-observatie',
                    question:
                        'Als je maar één probleem mag oplossen met beperkt budget, welk kies je en waarom? Gebruik de data om je keuze te onderbouwen.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het sterkste argument is voor "Huiswerk niet vinden in menu": het treft 3 van de 10 gebruikers (30%), heeft ernst 5 (maximum) en gebeurt elke dag. UX-prioritering combineert frequentie, ernst en impact. Een navigatieprobleem raakt alle functies van de app, terwijl "kleuren te flauw" (ernst 3) minder gebruikers treft en minder kritiek is.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'sus-scores-apps',
            title: 'SUS-score (usability) van vijf schoolapps',
            description:
                'De SUS (System Usability Scale) is een standaard maatstaf voor gebruiksvriendelijkheid op een schaal van 0-100. Boven 68 = goed. Bekijk de scores van vijf apps.',
            type: 'bar-chart',
            chartData: [
                { label: 'Magister', value: 61, color: '#F59E0B' },
                { label: 'Google Classroom', value: 78, color: '#3B82F6' },
                { label: 'Itslearning', value: 55, color: '#EF4444' },
                { label: 'Microsoft Teams', value: 72, color: '#8B5CF6' },
                { label: 'Zermelo', value: 69, color: '#10B981' },
            ],
            questions: [
                {
                    id: 'q4-slechte-usability',
                    question: 'Welke apps scoren ONDER de drempelwaarde van 68 (dus als "niet goed" beschouwd)?',
                    type: 'multiple-choice',
                    options: [
                        'Magister en Itslearning',
                        'Itslearning en Google Classroom',
                        'Magister, Itslearning en Zermelo',
                        'Alleen Itslearning',
                    ],
                    correctAnswer: 'Magister en Itslearning',
                    explanation:
                        'Magister scoort 61 (onder 68) en Itslearning 55 (ruim onder 68). Zermelo zit met 69 net boven de grens. Google Classroom (78) en Microsoft Teams (72) zijn goed bruikbaar. Magister is de meest gebruikte Nederlandse schoolapp maar heeft dus een onder-gemiddelde usability.',
                    points: 10,
                },
                {
                    id: 'q5-verschil-google-itslearning',
                    question:
                        'Hoeveel punten verschil zit er op de SUS-schaal tussen Google Classroom en Itslearning?',
                    type: 'number-input',
                    correctAnswer: 23,
                    explanation:
                        'Google Classroom: 78. Itslearning: 55. Verschil: 78 − 55 = 23 punten. Op een schaal van 100 is dit een groot verschil — het kan het verschil zijn tussen een app die leerlingen graag gebruiken en een app die ze frustreert.',
                    points: 15,
                },
                {
                    id: 'q6-sus-verklaring',
                    question:
                        'Een SUS-score van 55 voor Itslearning — wat betekent dit voor de gebruikerservaring? Wat zou een UX-designer als eerste aanpakken?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een score van 55 valt in de categorie "matig" — gebruikers vinden het moeilijk en frustrerend. Een UX-designer zou beginnen met het meest ernstige en meest voorkomende probleem (zie de gebruikersfeedback-tabel). Navigatieproblemen zijn vaak de eerste prioriteit, omdat ze de toegang tot alle andere functies blokkeren.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'ux-principes',
            title: 'Vier UX-principes die elke ontwerper kent',
            description:
                'Goede UX is niet toevallig — het volgt principes. Hier zijn vier principes die professionele UX-designers dagelijks gebruiken.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Affordance: maak duidelijk wat klikbaar is',
                    icon: '👆',
                    content:
                        'Affordance betekent dat iets er al uitziet zoals het werkt. Een knop moet eruitzien als een knop: verhoogd, met duidelijke rand of kleur. Als gebruikers niet zien dat iets klikbaar is, klikken ze erop niet. Slechte affordance: grijze tekst die eigenlijk een link is. Goede affordance: een blauwe onderstreepte link, of een duidelijk afgeronde knop.',
                },
                {
                    title: 'Feedback: laat altijd weten wat er is gebeurd',
                    icon: '✅',
                    content:
                        'Na elke actie van de gebruiker moet de app reageren. Het inleveren van een opdracht zonder bevestiging laat de gebruiker denken: "Is het wel aangekomen?" Goede feedback: een groen vinkje, een melding "Opgeslagen!", of een laadanimatie. Geen feedback = onzekerheid = frustratie. Feedback is een van de meest vergeten elementen in app-design.',
                },
                {
                    title: 'Consistentie: hetzelfde werkt altijd hetzelfde',
                    icon: '🔄',
                    content:
                        'Als de "terug"-knop op pagina 1 links bovenin staat, moet hij dat op elke pagina zijn. Als rood altijd "verwijderen" betekent, mag rood niet plotseling "opslaan" betekenen. Inconsistentie dwingt gebruikers om elke pagina opnieuw te leren. Goede apps gebruiken een "design system" met vaste patronen voor knoppen, kleuren en navigatie.',
                },
                {
                    title: 'Foutpreventie: voorkom fouten vóórdat ze gebeuren',
                    icon: '🛡️',
                    content:
                        'Het is beter om te voorkomen dat een gebruiker een fout maakt, dan daarna een foutmelding te tonen. Voorbeelden: een "Weet je het zeker?"-scherm vóór het verwijderen, een formulier dat al rood kleurt als een e-mailadres geen @ bevat, of een knop die grijs is zolang een verplicht veld leeg is. Nielsen\'s wet: "Beter voorkomen dan genezen."',
                },
            ],
            questions: [
                {
                    id: 'q7-principe-herkennen',
                    question:
                        'Een leerling klikt op "Inleveren" maar ziet niets veranderen. Ze weet niet of haar opdracht aangekomen is. Welk UX-principe wordt hier geschonden?',
                    type: 'multiple-choice',
                    options: ['Affordance', 'Feedback', 'Consistentie', 'Foutpreventie'],
                    correctAnswer: 'Feedback',
                    explanation:
                        'De app geeft geen feedback na de actie — de gebruiker weet niet of de opdracht aangekomen is. Dit is precies het probleem dat 2 van de 10 leerlingen in de gebruikersfeedback-tabel noemden. Oplossing: voeg een bevestigingsmelding toe ("Opdracht ingeleverd op 10:32 uur").',
                    points: 15,
                },
                {
                    id: 'q8-verbetervoorstel',
                    question:
                        'Kies het ernstigste navigatieprobleem uit de tabel (huiswerk niet vinden). Beschrijf een concrete UX-verbetering en welk principe je toepast.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een goede verbetering past een UX-principe toe: bijv. "Voeg een "Huiswerk"-knop direct op de startpagina toe (Affordance — zichtbaar en toegankelijk)." Of: "Gebruik consistente navigatie zodat huiswerk altijd op dezelfde plek staat (Consistentie)." Of: "Voeg een zoekfunctie toe die snel huiswerk vindt (Foutpreventie — de gebruiker hoeft niet te zoeken in het menu)."',
                    points: 10,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🕵️',
            title: 'UX Expert!',
            color: '#E8956F',
        },
        {
            minScore: 65,
            emoji: '🔍',
            title: 'Usability Detective',
            color: '#8B5CF6',
        },
        {
            minScore: 40,
            emoji: '👆',
            title: 'UX Verkenner',
            color: '#3B82F6',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#6B6B66',
        },
    ],

    takeaways: [
        'Usability-problemen prioriteer je op basis van ernst en hoe vaak ze voorkomen',
        'SUS-scores boven 68 gelden als "goed" — daaronder is er werk aan de winkel',
        'Feedback na een actie is cruciaal: laat altijd zien wat er is gebeurd',
        'Affordance betekent: maak zichtbaar wat klikbaar of aanraakbaar is',
        'Consistentie verlaagt de cognitieve belasting voor gebruikers',
    ],
};

export default uxDetectiveConfig;
