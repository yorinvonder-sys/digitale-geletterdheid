import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const appPrototyperConfig: BuilderCanvasConfig = {
    missionId: 'app-prototyper',
    title: 'App Prototyper',
    introEmoji: '📱',
    introTitle: 'Ontwerp een app van idee tot prototype',
    introDescription:
        'In deze missie leer je hoe professionele designers apps bouwen: van het ontdekken van het probleem, via schetsen en wireframes, naar een klikbaar prototype. Je ontwerpt een app die een echt probleem op school oplost.',
    missionGoal: {
        primaryGoal: 'Werk een app-idee uit tot een toetsbaar prototype met probleem, schermen, flow en testplan.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier ontwerpstappen zijn afgerond met checklist en geschreven uitwerking.',
        },
        evidence: 'Probleemanalyse, drie wireframes, gebruikersflows en een prototype-testplan.',
    },
    introFeatures: [
        'Analyseer een gebruiksprobleem met de 5 W\'s',
        'Schets wireframes voor de belangrijkste schermen',
        'Ontwerp een gebruikersflow die logisch aanvoelt',
        'Beschrijf een testplan voor je prototype',
    ],
    enableChat: true,
    chatRoleId: 'app-prototyper',
    previewType: 'text-preview',
    steps: [
        {
            id: 'probleemanalyse',
            title: 'Gebruikersprobleem analyseren',
            description:
                'Goede apps lossen echte problemen op. Niet problemen die designers verzonnen hebben, maar problemen waar echte gebruikers dagelijks tegenaan lopen. Dit is wat designers "user research" noemen.',
            instruction:
                'Beschrijf het probleem dat jouw app oplost. Gebruik de 5 W\'s: Wie heeft het probleem?, Wat is het probleem precies?, Wanneer doet het probleem zich voor?, Waar gebeurt het?, Waarom is het nu nog niet opgelost? Schrijf daarna in 1 zin de waardepropositie van je app: "Mijn app helpt [DOELGROEP] om [PROBLEEM] op te lossen door [OPLOSSING]."',
            tip: 'Hoe specifieker het probleem, hoe beter de app. "Leerlingen weten niet wanneer de kantine druk is" is specifieker en beter op te lossen dan "leerlingen willen alles weten over school".',
            checklistItems: [
                { id: 'vijf-w', label: 'Alle 5 W\'s zijn ingevuld' },
                { id: 'waardepropositie', label: 'De waardepropositie staat in één zin' },
                { id: 'doelgroep-spec', label: 'De doelgroep is specifiek beschreven' },
            ],
            textPrompt: 'Beschrijf het gebruikersprobleem en de waardepropositie',
        },
        {
            id: 'schermen-ontwerpen',
            title: 'Schermen ontwerpen (wireframes)',
            description:
                'Een wireframe is een schets van een scherm zonder kleuren of mooie plaatjes — alleen de structuur. Welke knoppen staan er? Wat staat er in het midden? Wat zie je als je de app opent? Wireframes maak je snel en gooien er niet mooi uit, maar ze zijn onmisbaar.',
            instruction:
                'Beschrijf 3 schermen van je app als tekstuele wireframes. Voor elk scherm: 1) Naam van het scherm (bijv. "Startscherm", "Zoekpagina", "Detailpagina"), 2) Beschrijving van wat er te zien is (van boven naar beneden), 3) Welke knoppen of interacties er zijn. Geef ook aan welk scherm de gebruiker als eerste ziet als hij de app opent.',
            tip: 'Zet het allerbelangrijkste bovenaan op het scherm — daar kijkt de gebruiker als eerste naar. Op mobiel geldt: duim bereikt onderkant makkelijker dan bovenkant. Knoppen die je vaak gebruikt, horen laag.',
            checklistItems: [
                { id: 'drie-schermen', label: 'Ik heb 3 schermen beschreven' },
                { id: 'per-scherm', label: 'Elk scherm heeft naam, inhoud en interacties' },
                { id: 'startscherm', label: 'Ik heb aangegeven welk scherm de gebruiker als eerste ziet' },
            ],
            textPrompt: 'Beschrijf je wireframes hier',
            reflectionQuestion: {
                question: 'Wat is het belangrijkste doel van een wireframe?',
                options: ['De app er mooi laten uitzien', 'De structuur en gebruikersflow testen voor je gaat bouwen', 'De app sneller laten laden', 'De klant overtuigen met kleur en animatie'],
                correctIndex: 1,
                explanation: 'Een wireframe test de structuur en navigatie zonder afleiding van visuele details. Zo ontdek je problemen vroeg, wanneer aanpassingen nog goedkoop zijn.',
                bonusPoints: 5,
            },
        },
        {
            id: 'gebruikersflow',
            title: 'Gebruikersflow uitwerken',
            description:
                'Een gebruikersflow beschrijft het pad dat een gebruiker door de app afloopt om een doel te bereiken. Bijv: "Open app → Tik op zoeken → Voer druktemeting in → Zie resultaat." Zonder een goede flow raken gebruikers verloren.',
            instruction:
                'Schrijf twee gebruikersflows voor je app. Elke flow beschrijft stap voor stap wat de gebruiker doet om een specifiek doel te bereiken. Minimaal 4 stappen per flow. Geef ook aan wat er gebeurt als de gebruiker een fout maakt of op "terug" drukt — dat heet de "fout-flow". Kies duidelijke namen voor je flows (bijv. "Eerste keer opstarten" of "Druktemeting opzoeken").',
            tip: 'Denk bij elke stap: "Wat kan er hier misgaan?" Goede UX-designers ontwerpen niet alleen voor dingen die lukken, maar ook voor dingen die mislukken.',
            checklistItems: [
                { id: 'twee-flows', label: 'Ik heb 2 gebruikersflows beschreven' },
                { id: 'vier-stappen', label: 'Elke flow heeft minimaal 4 stappen' },
                { id: 'fout-flow', label: 'Ik heb beschreven wat er bij een fout of "terug" gebeurt' },
            ],
            textPrompt: 'Beschrijf je gebruikersflows',
        },
        {
            id: 'testplan',
            title: 'Testplan schrijven',
            description:
                'Een prototype is niet af totdat het getest is. Gebruikers doen dingen die je niet verwacht: ze drukken op plekken waar geen knop is, lezen instructies niet, en raken gefrustreerd om redenen die jij als designer niet ziet.',
            instruction:
                'Schrijf een testplan voor je app-prototype. Beschrijf: 1) Wie gaat je prototype testen (welke gebruikers)?, 2) 3 testtaken die je de testgebruiker laat uitvoeren (bijv. "Zoek hoe druk de kantine is om 12:00")?, 3) Hoe je de feedback verzamelt (observeer je, stel je vragen, of beide?), 4) Welke verbetering je zou doorvoeren als de testgebruiker vastloopt op de gebruikersflow.',
            tip: 'Zeg tijdens het testen niet "Je klikt op de verkeerde knop." Observeer stilletjes. Zo zie je pas écht hoe gebruikers de app ervaren.',
            checklistItems: [
                { id: 'testgebruikers', label: 'Ik heb beschreven wie de testgebruikers zijn' },
                { id: 'drie-taken', label: 'Ik heb 3 concrete testtaken beschreven' },
                { id: 'feedback-methode', label: 'Ik heb de feedbackmethode beschreven' },
                { id: 'verbetering', label: 'Ik heb 1 verbetering beschreven op basis van mogelijke feedback' },
            ],
            textPrompt: 'Schrijf je testplan',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'UX Maestro', color: '#D7C95F' },
        { minScore: 70, emoji: '📱', title: 'App Designer', color: '#5F947D' },
        { minScore: 50, emoji: '✏️', title: 'Wireframe Maker', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende App Ontwerper', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je een gebruikersprobleem analyseert met de 5 W\'s',
        'Je kunt wireframes beschrijven die de structuur van een scherm vastleggen',
        'Je begrijpt hoe een gebruikersflow werkt en hoe je die ontwerpt',
        'Je kunt een testplan schrijven voor een app-prototype',
        'Je hebt de complete UX-designcyclus doorlopen: van probleem naar prototype naar test',
    ],
};

export default appPrototyperConfig;
