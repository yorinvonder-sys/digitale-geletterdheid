import type { DataViewerConfig } from '../DataViewer';

export const uxDetectiveConfig: DataViewerConfig = {
    missionId: 'ux-detective',
    title: 'UX Detective',
    introEmoji: '🕵️',
    introTitle: 'Word een UX Detective',
    introDescription:
        'Waarom is de ene app fijn om te gebruiken en de andere een frustratie? Dat is user experience (UX). Jij gaat als UX-detective apps analyseren: problemen vinden, begrijpen waarom ze problemen zijn, en verbeteringen ontwerpen.',
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Frustratiekaart: kies welke appklacht als eerste opgelost moet worden.',
        primaryInteraction: 'prioritize-case',
        feedbackMoment: 'Na de UX-prioriteit hoort de leerling waarom navigatie, feedback of toegankelijkheid impact heeft.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling prioriteert UX-problemen met frequentie, ernst en toegankelijkheidsbewijs.',
        antiBoringRule: 'UX-analyse begint met een echte frustratie en triage, niet met een vragenlijst.',
        chromeAcceptance: 'UX-triage, tabelsortering en observaties blijven bruikbaar op alle vier viewports.',
    },
    introFeatures: [
        'Analyseer gebruikersonderzoek over app-frustraties',
        'Vergelijk usability-scores van populaire apps',
        'Beoordeel welke UX-problemen het meest impact hebben',
    ],
    investigationHook: {
        title: 'Welke klacht los je als eerste op?',
        role: 'UX-triageteam',
        scenario:
            'De schoolapp krijgt slechte reviews. Er is budget voor één eerste verbetering. Jij kiest welke frustratie het zwaarst telt voordat je de onderzoeksdata opent.',
        prompt: 'Welke UX-prioriteit neem je mee de data in?',
        contextLabel: 'UX-prioriteit',
        continueLabel: 'Onderzoek de klachten',
        options: [
            {
                id: 'navigatie',
                label: 'Leerlingen vinden taken niet',
                description: 'Je zoekt naar navigatieproblemen die vaak terugkomen en dagelijkse impact hebben.',
                feedback: 'Sterke UX-prioriteit. Als gebruikers hun doel niet vinden, voelt de hele app onbetrouwbaar.',
                evidenceChips: ['3 meldingen', 'ernst 5', 'elke dag'],
                impactCue: 'Doel vinden',
            },
            {
                id: 'feedback',
                label: 'De app bevestigt acties niet',
                description: 'Je onderzoekt waar leerlingen onzeker worden omdat de app geen reactie geeft.',
                feedback: 'Goed gezien. Feedback is klein in beeld, maar groot in vertrouwen: gebruikers willen weten of iets gelukt is.',
                evidenceChips: ['2 meldingen', 'bevestiging ontbreekt', 'vertrouwen'],
                impactCue: 'Actiezekerheid',
            },
            {
                id: 'toegankelijkheid',
                label: 'Knoppen en contrast sluiten mensen uit',
                description: 'Je let op touch targets, kleurcontrast en wie daardoor vastloopt.',
                feedback: 'Belangrijk spoor. Toegankelijkheid is geen extraatje, maar bepaalt wie de app zelfstandig kan gebruiken.',
                evidenceChips: ['knoppen te klein', 'contrast', 'zelfstandig gebruik'],
                impactCue: 'Inclusiecheck',
            },
        ],
    },

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
                        'Kies de klacht die jij als UX-detective als eerste zou oplossen. Onderbouw je prioriteit met minimaal twee bewijzen uit de tabel: hoe vaak komt het voor, hoe ernstig is het en welke dagelijkse impact heeft het?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een sterke UX-prioriteit wijst op "Huiswerk niet vinden in menu": dit komt drie keer terug, heeft ernst 5 en gebeurt elke dag. Dat maakt het een high-priority issue: veel gebruikers, hoge ernst en directe impact op schoolwerk. Een ander antwoord kan goed zijn als het met frequentie, ernst en impact wordt onderbouwd.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'concrete klacht gekozen', keywords: ['huiswerk', 'menu', 'navigatie', 'knoppen', 'bevestiging', 'kleuren'] },
                        { label: 'frequentie gebruikt', keywords: ['3', 'drie', 'vaak', 'elke dag', 'dagelijks', 'meest'] },
                        { label: 'ernst gebruikt', keywords: ['ernst', 'score', '5', 'hoog', 'maximaal'] },
                        { label: 'impact op gebruiker', keywords: ['impact', 'schoolwerk', 'frustratie', 'leerlingen', 'doel', 'vinden'] },
                    ],
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
                { label: 'Magister', value: 61, color: '#D7C95F' },
                { label: 'Google Classroom', value: 78, color: '#0B453F' },
                { label: 'Itslearning', value: 55, color: '#D97848' },
                { label: 'Microsoft Teams', value: 72, color: '#0B453F' },
                { label: 'Zermelo', value: 69, color: '#5F947D' },
            ],
            questions: [
                {
                    id: 'q4-slechte-usability',
                    question:
                        'Markeer de apps die onder de SUS-drempel van 68 vallen. Noem hun scores en leg uit waarom dit voor een UX-team een urgent signaal is.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Magister scoort 61 en Itslearning 55: allebei onder de SUS-drempel van 68. Zermelo zit met 69 net boven de grens. Voor een UX-team is dit urgent omdat scores onder 68 wijzen op matige bruikbaarheid en frustratie in dagelijkse schooltaken.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Magister genoemd', keywords: ['magister'] },
                        { label: 'Itslearning genoemd', keywords: ['itslearning'] },
                        { label: 'scores 61 en 55 gebruikt', keywords: ['61', '55'] },
                        { label: 'drempel 68 benoemd', keywords: ['68', 'drempel', 'onder'] },
                        { label: 'urgentie of frustratie uitgelegd', keywords: ['urgent', 'frustratie', 'matig', 'gebruiksvriendelijkheid', 'bruikbaarheid'] },
                    ],
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
                        'Diagnoseer het incident "Inleveren zonder reactie". Leg uit welk UX-principe wordt geschonden, waarom de leerling onzeker wordt en welke concrete bevestiging je als fix toevoegt.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De app geeft geen feedback na de actie: de gebruiker weet niet of de opdracht aangekomen is. Dit is precies het probleem dat 2 van de 10 leerlingen in de feedbacktabel noemden. Een concrete oplossing is een bevestigingsmelding, groen vinkje of tijdstempel zoals "Opdracht ingeleverd op 10:32 uur".',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Feedback-principe genoemd', keywords: ['feedback'] },
                        { label: 'onzekerheid na actie uitgelegd', keywords: ['onzeker', 'niet weet', 'aangekomen', 'niets veranderen', 'geen reactie'] },
                        { label: 'inleveractie gekoppeld', keywords: ['inleveren', 'opdracht', 'actie'] },
                        { label: 'concrete bevestiging voorgesteld', keywords: ['bevestiging', 'groen vinkje', 'melding', 'opgeslagen', 'ingeleverd', 'tijdstempel'] },
                    ],
                },
                {
                    id: 'q8-verbetervoorstel',
                    question:
                        'Kies het ernstigste navigatieprobleem uit de tabel (huiswerk niet vinden). Beschrijf een concrete UX-verbetering en welk principe je toepast.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een goede verbetering past een UX-principe toe: bijv. "Voeg een "Huiswerk"-knop direct op de startpagina toe (Affordance — zichtbaar en toegankelijk)." Of: "Gebruik consistente navigatie zodat huiswerk altijd op dezelfde plek staat (Consistentie)." Of: "Voeg een zoekfunctie toe die snel huiswerk vindt (Foutpreventie — de gebruiker hoeft niet te zoeken in het menu)."',
                    points: 0,
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
            color: '#D97848',
        },
        {
            minScore: 65,
            emoji: '🔍',
            title: 'Usability Detective',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '👆',
            title: 'UX Verkenner',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
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
