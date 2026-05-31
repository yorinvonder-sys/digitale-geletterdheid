import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const meesterproefConfig: BuilderCanvasConfig = {
    missionId: 'meesterproef',
    title: 'De Meesterproef',
    introEmoji: '🏆',
    introTitle: 'Het grote eindproject',
    introDescription:
        'Dit is het moment. De Meesterproef brengt alles samen wat je in drie jaar informatica hebt geleerd. Je onderzoekt, ontwerpt, bouwt, presenteert en reflecteert — en laat zien dat je klaar bent voor de volgende stap.',
    introFeatures: [
        'Schrijf een sterk projectvoorstel met duidelijk doel',
        'Plan en documenteer het ontwikkelproces',
        'Bouw en test je eindproduct',
        'Verdedig je project voor een jury',
    ],
    missionGoal: {
        primaryGoal:
            'Laat met een eindproject zien dat je zelfstandig kunt onderzoeken, ontwerpen, bouwen, testen, presenteren en reflecteren.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description:
                'Je rondt projectvoorstel, ontwikkeldagboek, eindproductverantwoording en juryvoorbereiding af.',
        },
        evidence:
            'Leerlingbewijs: SMART-projectvoorstel, ontwikkeldagboek, productbeschrijving, testbewijs en juryvoorbereiding. Docentbewijs: checklistvoortgang en tekstinvoer tonen of de leerling een compleet digitaal project kan plannen en verantwoorden.',
    },
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Meesterproefbrief: leerling kiest welk productbewijs de jury als eerste moet overtuigen.',
        primaryInteraction: 'test-product',
        feedbackMoment: 'Na de bewijskeuze koppelt feedback projectdoel, ontwikkeldagboek, testbewijs en juryverdediging aan elkaar.',
        visualKit: 'maker-canvas',
        evidenceMoment: 'De leerling toont SMART-voorstel, proceslog, productverantwoording, testbewijs en juryvoorbereiding.',
        antiBoringRule: 'De eindopdracht blijft volwassen productbewijs met test en verdediging, geen extra speellaag bovenop de meesterproef.',
        chromeAcceptance: 'Projectbrief, canvasstappen, bewijsstatus en eindstaat blijven professioneel, rustig en responsive op alle vier viewports.',
    },
    enableChat: true,
    chatRoleId: 'meesterproef',
    previewType: 'text-preview',
    steps: [
        {
            id: 'projectvoorstel',
            title: 'Projectvoorstel schrijven',
            description:
                'Een goed projectvoorstel is het fundament van je meesterproef. Het beschrijft wat je gaat maken, waarom dat zinvol is, hoe je het gaat aanpakken en wanneer alles klaar is. Zonder een sterk voorstel loop je het risico later koers te verliezen.',
            instruction:
                'Schrijf een projectvoorstel met: 1) Projectnaam en korte samenvatting (max 50 woorden), 2) Probleemomschrijving: wat is het probleem of de behoefte die je aanpakt?, 3) Doelstelling: wat lever je op aan het einde? (concreet en meetbaar), 4) Doelgroep: voor wie maak je het?, 5) Aanpak: in welke fasen werk je? (ontwerp, bouw, test), 6) Planning: een globale tijdlijn met mijlpalen. Zorg dat de doelstelling SMART is: Specifiek, Meetbaar, Acceptabel, Realistisch, Tijdgebonden.',
            tip: 'Als je je projectdoel niet in één zin kunt beschrijven, is het nog niet concreet genoeg. Herschrijf totdat het in één zin past.',
            checklistItems: [
                { id: 'samenvatting', label: 'Er is een projectnaam en samenvatting van max 50 woorden' },
                { id: 'probleem', label: 'Het probleem of de behoefte is beschreven' },
                { id: 'smart-doel', label: 'De doelstelling is SMART geformuleerd' },
                { id: 'planning', label: 'Er is een tijdlijn met mijlpalen' },
            ],
            textPrompt: 'Schrijf je projectvoorstel',
        },
        {
            id: 'ontwikkelproces',
            title: 'Ontwikkelproces documenteren',
            description:
                'Professionele developers documenteren hun werk terwijl ze bezig zijn — niet achteraf. Logboeken, beslissingen, problemen en oplossingen. Dit maakt je project reproduceerbaar en laat de jury zien hoe jij denkt.',
            instruction:
                'Schrijf een ontwikkeldagboek voor minstens 3 werksessies. Elke sessie bevat: 1) Datum en duur, 2) Wat was het doel voor deze sessie?, 3) Wat heb je gedaan?, 4) Wat was een probleem of uitdaging?, 5) Hoe heb je het opgelost of wat is de status?. Schrijf ook een "beslissingenlog": een lijst van 3 keuzes die je hebt gemaakt tijdens het project met de reden voor elke keuze.',
            tip: 'Een beslissingenlog is goud waard bij de jury-verdediging. Als iemand vraagt "Waarom heb je voor Python gekozen?", kun je je motivatie direct benoemen.',
            checklistItems: [
                { id: 'drie-sessies', label: 'Er zijn 3 werksessies gedocumenteerd' },
                { id: 'per-sessie', label: 'Elke sessie heeft doel, actie, probleem en oplossing' },
                { id: 'beslissingenlog', label: 'Het beslissingenlog bevat 3 keuzes met motivatie' },
            ],
            textPrompt: 'Schrijf je ontwikkeldagboek en beslissingenlog',
        },
        {
            id: 'eindproduct',
            title: 'Eindproduct beschrijven en verantwoorden',
            description:
                'Het eindproduct is het bewijs van alles wat je hebt geleerd. Je beschrijft wat je hebt opgeleverd, hoe het werkt, en waarom je de technische keuzes hebt gemaakt die je hebt gemaakt.',
            instruction:
                'Beschrijf je eindproduct. Vul in: 1) Wat heb je opgeleverd? (beschrijf het product concreet), 2) Hoe werkt de kernfunctie? (stap voor stap), 3) Welke technologieën heb je gebruikt en waarom?, 4) Hoe heb je het getest? (wie, wat, hoe?), 5) Wat werkt goed en wat niet? (eerlijk zelfonderzoek), 6) Wat zou je anders doen als je meer tijd had?',
            tip: 'Wees eerlijk over wat niet werkt. Een jury waardeert zelfreflectie en eerlijkheid veel meer dan een gelikt product zonder kritisch nadenken.',
            checklistItems: [
                { id: 'product-beschreven', label: 'Het eindproduct is concreet beschreven' },
                { id: 'technologie', label: 'Technologieën zijn beschreven met motivatie' },
                { id: 'testen', label: 'Het testproces is beschreven' },
                { id: 'eerlijk', label: 'Er is een eerlijke evaluatie van wat werkt en wat niet' },
            ],
            textPrompt: 'Beschrijf en verantwoord je eindproduct',
        },
        {
            id: 'verdediging',
            title: 'Voorbereiding op de verdediging',
            description:
                'De jury-verdediging is het slotakkoord van drie jaar informatica. Je presenteert je project, beantwoordt vragen en laat zien dat je niet alleen iets kunt bouwen, maar ook kunt nadenken over wat je hebt gemaakt.',
            instruction:
                'Bereid je voor op de jury-verdediging. Schrijf: 1) Een samenvatting van je project in 3 zinnen (voor als de jury vraagt: "Wat heb je gemaakt?"), 2) De 3 dingen die je het meest trots op bent in je project, 3) De 3 dingen die je zou verbeteren, 4) De antwoorden op deze jury-vragen: "Wat was de grootste uitdaging?", "Waarom heb je [technologie X] gekozen?", "Wat heb je geleerd over jezelf als maker?". Schrijf elk antwoord in max 3 zinnen.',
            tip: 'De sterkste verdedigingen bevatten zowel trots als eerlijkheid. Een jury die ziet dat jij je eigen werk kritisch kunt beoordelen, vertrouwt jou meer dan iemand die alleen de successen noemt.',
            checklistItems: [
                { id: 'drie-zinnen', label: 'Er is een samenvatting van het project in 3 zinnen' },
                { id: 'trots', label: 'De 3 dingen die ik trots op ben zijn beschreven' },
                { id: 'verbeter', label: 'De 3 verbeterpunten zijn beschreven' },
                { id: 'jury-antwoorden', label: 'Alle 3 jury-vragen zijn beantwoord (max 3 zinnen per antwoord)' },
            ],
            textPrompt: 'Schrijf je voorbereiding op de verdediging',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Meesterproef Geslaagd', color: '#D7C95F' },
        { minScore: 70, emoji: '🎓', title: 'Digital Professional', color: '#5F947D' },
        { minScore: 50, emoji: '💪', title: 'Doorzetters Medaille', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Meesterproef', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je hebt een compleet projectvoorstel geschreven met een SMART-doelstelling',
        'Je hebt je ontwikkelproces gedocumenteerd zodat je keuzes verantwoord zijn',
        'Je hebt je eindproduct eerlijk en volledig beschreven, inclusief verbeterpunten',
        'Je bent voorbereid op de jury-verdediging met antwoorden op de moeilijkste vragen',
        'Je kunt een complex digitaal project zelfstandig plannen, uitvoeren en evalueren volgens eigen succescriteria',
    ],
};

export default meesterproefConfig;
