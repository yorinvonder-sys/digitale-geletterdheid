import type { DataViewerConfig } from '../DataViewer';

export const eindprojectJ2Config: DataViewerConfig = {
    missionId: 'eindproject-j2',
    title: 'Eindproject Jaar 2 Voorbereiding',
    introEmoji: '🏆',
    introTitle: 'Bereid je eindproject voor',
    introDescription:
        'Voordat je gaat bouwen, onderzoek je hoe andere leerlingen eindprojecten hebben aangepakt. Je gebruikt data, tips en voorbeelden om een haalbaar idee voor jouw eigen eindproject te kiezen.',
    missionGoal: {
        primaryGoal:
            'Bereid je eindproject voor door projectdata te analyseren en een eigen idee te onderbouwen.',
        criteria: {
            type: 'component-complete',
            description:
                'Je onderzoekt voorbeeldprojecten, vergelijkt keuzes en formuleert een haalbaar projectidee.',
        },
        evidence:
            'Je voorbereiding noemt een probleem, doelgroep, projectvorm en onderbouwing uit de data.',
    },
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Projectcoach start: kies welke projectroute je met data wilt onderzoeken.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Na elke keuze koppelt feedback projecttype, criteria en tips aan een haalbaar eigen plan.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling gebruikt scores, rubriccriteria en leerlingtips als bewijs voor een eigen projectkeuze.',
        antiBoringRule: 'Eindprojectvoorbereiding moet voelen als een projectkeuze met bewijsdruk, niet als terugkijken naar cijfers.',
        chromeAcceptance: 'Projectroute, scorekaarten, tipkaarten en eindplan blijven responsive en tonen docentbewijs.',
    },
    investigationHook: {
        title: 'Je projectcoach opent het keuzebord',
        role: 'Projectvoorbereider',
        scenario:
            'Je hoeft nog niet te bouwen. Eerst kies je welk soort project je wilt onderzoeken, zodat je later een sterker eigen plan kunt maken.',
        prompt: 'Welke projectroute wil je als eerste onderzoeken?',
        contextLabel: 'Projectroute',
        continueLabel: 'Open het projectbord',
        options: [
            {
                id: 'app',
                label: 'App of prototype met duidelijke gebruiker',
                description: 'Je let op gemiddelde score, techniek en of het probleem voor iemand herkenbaar is.',
                evidenceChips: ['App 7,9', 'Elif 8,3', 'probleem + doelgroep'],
                impactCue: 'Route met herkenbare gebruiker',
                feedback: 'Sterke route. Apps scoren hoog als probleem, doelgroep en functies helder zijn.',
            },
            {
                id: 'onderzoek',
                label: 'Onderzoek met sterke vraag en presentatie',
                description: 'Je zoekt hoe onderzoek toch zichtbaar kan scoren op techniek, originaliteit en uitleg.',
                evidenceChips: ['Onderzoek 6,8', 'Chiara 9-6-9', 'methode zichtbaar'],
                impactCue: 'Criteria-risico oplossen',
                feedback: 'Interessant spoor. Onderzoek vraagt extra bewijs: je moet data, methode en presentatie goed zichtbaar maken.',
            },
            {
                id: 'makersroute',
                label: 'Spel, website of video als makerproject',
                description: 'Je vergelijkt creatieve vorm, technische haalbaarheid en presentatiekracht.',
                evidenceChips: ['Video 7,8', 'Spel 7,7', 'feedback testen'],
                impactCue: 'Vorm plus publiek',
                feedback: 'Goede makersroute. De vorm is niet genoeg: je project moet ook een concreet probleem of publiek hebben.',
            },
        ],
    },
    introFeatures: [
        'Analyseer eindprojectdata van vorig jaar',
        'Vergelijk welke projecttypen het hoogst scoren',
        'Onderbouw welk projectidee bij jou en de beoordelingscriteria past',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'eindproject-resultaten-vorig-jaar',
            title: 'Eindprojecten leerjaar 2 — schooljaar 2024/2025',
            description:
                'Vorig jaar maakten 16 leerlingen een eindproject. De docent heeft de projecten beoordeeld op drie criteria. Bekijk de resultaten en ontdek patronen.',
            type: 'table',
            columns: [
                { key: 'leerling', label: 'Leerling', sortable: false },
                { key: 'project_type', label: 'Projecttype', sortable: true },
                { key: 'originaliteit', label: 'Originaliteit (1-10)', sortable: true },
                { key: 'techniek', label: 'Techniek (1-10)', sortable: true },
                { key: 'presentatie', label: 'Presentatie (1-10)', sortable: true },
                { key: 'eindcijfer', label: 'Eindcijfer', sortable: true },
            ],
            rows: [
                { leerling: 'Amir', project_type: 'App-ontwerp', originaliteit: 8, techniek: 7, presentatie: 8, eindcijfer: 7.7 },
                { leerling: 'Bo', project_type: 'Website', originaliteit: 6, techniek: 8, presentatie: 7, eindcijfer: 7.0 },
                { leerling: 'Chiara', project_type: 'Onderzoek', originaliteit: 9, techniek: 6, presentatie: 9, eindcijfer: 8.0 },
                { leerling: 'Dylan', project_type: 'Spel (Scratch)', originaliteit: 7, techniek: 9, presentatie: 6, eindcijfer: 7.3 },
                { leerling: 'Elif', project_type: 'App-ontwerp', originaliteit: 8, techniek: 8, presentatie: 9, eindcijfer: 8.3 },
                { leerling: 'Finn', project_type: 'Website', originaliteit: 5, techniek: 7, presentatie: 6, eindcijfer: 6.0 },
                { leerling: 'Gaia', project_type: 'Onderzoek', originaliteit: 7, techniek: 5, presentatie: 8, eindcijfer: 6.7 },
                { leerling: 'Hassan', project_type: 'Spel (Scratch)', originaliteit: 8, techniek: 8, presentatie: 7, eindcijfer: 7.7 },
                { leerling: 'Iris', project_type: 'App-ontwerp', originaliteit: 9, techniek: 7, presentatie: 9, eindcijfer: 8.3 },
                { leerling: 'Jasper', project_type: 'Video/animatie', originaliteit: 9, techniek: 6, presentatie: 9, eindcijfer: 8.0 },
                { leerling: 'Kimi', project_type: 'Website', originaliteit: 7, techniek: 8, presentatie: 8, eindcijfer: 7.7 },
                { leerling: 'Lena', project_type: 'Video/animatie', originaliteit: 8, techniek: 5, presentatie: 8, eindcijfer: 7.0 },
                { leerling: 'Milo', project_type: 'Onderzoek', originaliteit: 6, techniek: 4, presentatie: 7, eindcijfer: 5.7 },
                { leerling: 'Nora', project_type: 'Spel (Scratch)', originaliteit: 7, techniek: 9, presentatie: 8, eindcijfer: 8.0 },
                { leerling: 'Omar', project_type: 'App-ontwerp', originaliteit: 7, techniek: 8, presentatie: 7, eindcijfer: 7.3 },
                { leerling: 'Pien', project_type: 'Video/animatie', originaliteit: 10, techniek: 6, presentatie: 9, eindcijfer: 8.3 },
            ],
            questions: [
                {
                    id: 'q1-hoogste-gemiddelde-type',
                    question:
                        'Kies de projectroute die volgens de data het sterkste startpunt lijkt. Noem het gemiddelde van App-ontwerp en vergelijk kort met minstens één andere projectvorm.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'App-ontwerp is in deze oefendata het sterkste startpunt met gemiddeld 7,9. Video/animatie zit daar vlak achter met 7,8 en Spel op 7,7. Een slimme projectkeuze noemt dus de data, maar ziet ook dat het verschil klein is: de route helpt, maar jouw probleem, originaliteit en presentatie blijven doorslaggevend.',
                    points: 15,
                    minLength: 65,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'projectroute gekozen', keywords: ['app', 'app-ontwerp', 'projectroute', 'startpunt'] },
                        { label: 'gemiddelde score', keywords: ['7,9', '7.9', 'gemiddelde', 'hoogste'] },
                        { label: 'vergelijking gemaakt', keywords: ['video', 'spel', 'website', 'onderzoek', '7,8', '7.8', '7,7', '7.7'] },
                        { label: 'nuance bij keuze', keywords: ['verschil klein', 'maar', 'route', 'probleem', 'originaliteit', 'presentatie'] },
                    ],
                },
                {
                    id: 'q2-presentatie-impact',
                    question:
                        'Leg als projectcoach uit hoe Chiara toch een 8,0 haalt. Gebruik haar scores voor originaliteit, techniek en presentatie en benoem wat jij daarvan leert voor je eigen project.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Chiara haalt een 8,0 doordat originaliteit 9 en presentatie 9 haar lagere techniek 6 compenseren. Dat betekent niet dat techniek onbelangrijk is, maar wel dat een sterk probleem en duidelijke uitleg veel kunnen dragen. Voor je eigen project is de les: laat zien waarom je iets maakt en presenteer je keuzes helder.',
                    points: 15,
                    minLength: 65,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Chiara genoemd', keywords: ['chiara'] },
                        { label: 'scores gebruikt', keywords: ['9', '6', '8,0', '8.0', 'originaliteit', 'techniek', 'presentatie'] },
                        { label: 'compensatie uitgelegd', keywords: ['compenseert', 'draagt', 'maakt verschil', 'uitleg', 'presentatie'] },
                        { label: 'eigen projectles', keywords: ['eigen project', 'les', 'leren', 'waarom', 'duidelijk'] },
                    ],
                },
                {
                    id: 'q3-patroon-observatie',
                    question:
                        'Wat valt je op over de relatie tussen originaliteit en eindcijfer? Beschrijf een patroon dat je ziet.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Leerlingen met hoge originaliteitsscores (8-10) halen vrijwel altijd een 7,5 of hoger. Leerlingen met lage originaliteit (5-6) halen zelden boven de 7. Originaliteit lijkt een sterkere voorspeller van het eindcijfer dan techniek alleen. Dit suggereert dat de docent creatief en origineel denken zwaar waardeert.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'projecttype-verdeling',
            title: 'Gemiddelde eindcijfers per projecttype',
            description:
                'Bekijk de gemiddelde eindcijfers per projecttype om te helpen bij jouw keuze.',
            type: 'bar-chart',
            chartData: [
                { label: 'App-ontwerp', value: 7.9, color: '#0B453F' },
                { label: 'Video/animatie', value: 7.8, color: '#0B453F' },
                { label: 'Spel (Scratch)', value: 7.7, color: '#D7C95F' },
                { label: 'Website', value: 6.9, color: '#5F947D' },
                { label: 'Onderzoek', value: 6.8, color: '#D97848' },
            ],
            questions: [
                {
                    id: 'q4-verschil-top-bottom',
                    question:
                        'Hoeveel punt verschil is er in gemiddeld eindcijfer tussen het best scorende en het slechtst scorende projecttype?',
                    type: 'number-input',
                    correctAnswer: 1.1,
                    explanation:
                        'App-ontwerp: 7,9. Onderzoek: 6,8. Verschil: 7,9 − 6,8 = 1,1 punt. Op een 10-puntenschaal is 1,1 punt behoorlijk — het verschil tussen een 7 en een 8. Maar dit zijn gemiddelden over maar 3-4 leerlingen per type, dus de steekproef is klein.',
                    points: 10,
                },
                {
                    id: 'q5-onderzoekers-lager',
                    question:
                        'Onderzoek scoort gemiddeld lager in deze grafiek. Diagnoseer als projectcoach waar het risico zit en bedenk één manier om een onderzoeksproject toch sterker te maken voor de criteria.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Onderzoek scoort in deze oefendata gemiddeld 6,8. Het risico is niet dat onderzoek slecht is, maar dat technische vaardigheden minder tastbaar zichtbaar zijn dan bij een app, website of spel. Een onderzoeksproject wordt sterker als je methode, data-analyse, visualisatie, prototype of presentatie heel concreet maakt.',
                    points: 10,
                    minLength: 65,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'onderzoekscore genoemd', keywords: ['onderzoek', '6,8', '6.8', 'lager'] },
                        { label: 'criteriumrisico', keywords: ['techniek', 'criteria', 'zichtbaar', 'tastbaar', 'minder duidelijk'] },
                        { label: 'geen negatieve generalisatie', keywords: ['niet slecht', 'risico', 'maar', 'kan sterker'] },
                        { label: 'verbeteractie', keywords: ['methode', 'data', 'analyse', 'visualisatie', 'prototype', 'presentatie'] },
                    ],
                },
                {
                    id: 'q6-eigen-keuze',
                    question:
                        'Als jij je eindproject moet kiezen: zou je voor een "veilig" type gaan (app-ontwerp) of iets onbekends proberen? Onderbouw je keuze met de data.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Er is geen fout antwoord. Sterke argumenten voor "veilig": app-ontwerp scoort gemiddeld het hoogst en geeft een heldere structuur. Sterke argumenten voor "onbekend": origineelheid scoort hoog in de beoordeling — een verrassend onderwerp kan compenseren. De data laat ook zien dat individuele scores (Pien: 8,3 voor video) een hogere uitloop hebben dan het type alleen.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'eindproject-tips',
            title: 'Vier tips van leerlingen die een hoog eindcijfer haalden',
            description:
                'De leerlingen met een 8 of hoger deelden hun geheimen. Hier zijn vier concrete tips.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Tip 1: Begin met een probleem dat jou écht bezighoudt',
                    icon: '💡',
                    content:
                        '"Ik maakte een app voor roosterwijzigingen omdat ik altijd te laat hoorde dat mijn les uitviel. Ik wist meteen wat ik wilde oplossen." — Elif (8,3)\n\nProjecten die starten vanuit een echte behoefte zijn origineler en enthousiaster gepresenteerd. De beste eindprojecten lossen een probleem op dat de maker zelf ervaart.',
                },
                {
                    title: 'Tip 2: Maak een plan vóórdat je begint',
                    icon: '📋',
                    content:
                        '"Ik had eerst een wireframe getekend van alle schermen. Toen ik begon te bouwen wist ik precies wat er moest komen." — Iris (8,3)\n\nEen projectplan voorkomt dat je halverwege vastloopt. Minimaal: wat maak ik, voor wie, welke stappen, wat heb ik nodig? 30 minuten plannen bespaart 3 uur verdwalen.',
                },
                {
                    title: 'Tip 3: Leg uit waarom, niet alleen hoe',
                    icon: '🎤',
                    content:
                        '"Bij mijn presentatie begon ik met waarom ik dit probleem wilde oplossen, niet met de technische uitleg. Iedereen begreep het meteen." — Chiara (8,0)\n\nBij een presentatie wil de kijker eerst begrijpen waarom het project er is. Daarna pas hoe het werkt. Start altijd met de context en het probleem — dan volgt de technische uitleg vanzelf.',
                },
                {
                    title: 'Tip 4: Vraag feedback halverwege',
                    icon: '🔄',
                    content:
                        '"Ik heb mijn prototype aan drie klasgenoten laten zien voordat ik verder bouwde. Ze zagen dingen die ik zelf niet zag." — Nora (8,0)\n\nEen tweede paar ogen vindt altijd dingen die je zelf mist. Halfweg feedback vragen is geen zwakte — het is professioneel. In de echte tech-industrie heet dit "user testing" en het is verplicht.',
                },
            ],
            questions: [
                {
                    id: 'q7-beste-tip',
                    question:
                        'Kies de tip die jij als eerste in je projectplan zet. Leg uit waarom starten vanuit een echt probleem originaliteit kan helpen en koppel je keuze aan minstens één leerlingvoorbeeld of score.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Tip 1 is vaak de sterkste eerste stap: begin met een probleem dat jou echt bezighoudt. Elif haalt 8,3 met een app voor een herkenbaar roosterprobleem en Iris haalt 8,3 na een helder plan. Een echt probleem maakt je project specifieker, motiveert je keuzes en helpt je originaliteit zichtbaar te maken.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'tip gekozen', keywords: ['tip 1', 'probleem', 'echt probleem', 'bezighoudt'] },
                        { label: 'originaliteit gekoppeld', keywords: ['originaliteit', 'origineler', 'specifiek', 'richting'] },
                        { label: 'leerlingvoorbeeld of score', keywords: ['elif', 'iris', '8,3', '8.3', 'rooster', 'wireframe'] },
                        { label: 'projectplan toepassing', keywords: ['projectplan', 'eerst', 'keuze', 'mijn project', 'start'] },
                    ],
                },
                {
                    id: 'q8-eigen-plan',
                    question:
                        'Beschrijf in 3 zinnen jouw idee voor een eindproject. Noem het probleem, de doelgroep, de projectvorm en welk datapunt of welke tip jouw keuze onderbouwt.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een goed antwoord benoemt (1) het probleem dat de leerling ervaart, (2) wie er baat bij heeft, (3) wat voor soort project het wordt en (4) welke data of tip de keuze ondersteunt. Voorbeelden: "Klasgenoten weten niet wanneer de bibliotheek open is. Ik wil voor brugklassers een simpele website maken met actuele openingstijden, omdat de data laat zien dat presentatie en originaliteit meetellen." Of: "Ik wil onderzoeken hoeveel schermtijd leerlingen in mijn klas hebben, omdat starten vanuit een echt probleem helpt om mijn eindproject concreet te maken."',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 4,
                    textEvidenceCriteria: [
                        { label: 'probleem', keywords: ['probleem', 'lastig', 'mist', 'niet weten', 'ervaar'] },
                        { label: 'doelgroep', keywords: ['doelgroep', 'leerlingen', 'klasgenoten', 'brugklassers', 'docenten', 'ouders'] },
                        { label: 'projectvorm', keywords: ['app', 'website', 'onderzoek', 'spel', 'video', 'animatie', 'prototype'] },
                        { label: 'data of tip als onderbouwing', keywords: ['data', 'tip', 'score', 'originaliteit', 'presentatie', 'techniek', 'gemiddelde'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🏆',
            title: 'Sterk voorbereid!',
            color: '#D7C95F',
        },
        {
            minScore: 65,
            emoji: '⭐',
            title: 'Goed voorbereid',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🎯',
            title: 'Op de goede weg',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
        },
    ],

    takeaways: [
        'Deze missie helpt je een eindprojectidee kiezen, maar is nog niet het eindproject zelf',
        'App-ontwerp en video/animatie scoren in de voorbeelddata gemiddeld hoog',
        'Originaliteit en presentatie geven richting aan je voorbereiding',
        'Starten vanuit een persoonlijk probleem maakt je idee concreter en gemotiveerder',
        'Feedback halverwege je echte project is professioneel, niet een teken van zwakte',
    ],
};

export default eindprojectJ2Config;
