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
                        'Welk projecttype heeft het hoogste gemiddelde eindcijfer over alle leerlingen?',
                    type: 'multiple-choice',
                    options: ['Website', 'Onderzoek', 'App-ontwerp', 'Video/animatie'],
                    correctAnswer: 'App-ontwerp',
                    explanation:
                        'App-ontwerp: (7,7 + 8,3 + 8,3 + 7,3) ÷ 4 = 31,6 ÷ 4 = 7,9. Video/animatie: (8,0 + 7,0 + 8,3) ÷ 3 = 7,8. Spel: (7,3 + 7,7 + 8,0) ÷ 3 = 7,7. Onderzoek: (8,0 + 6,7 + 5,7) ÷ 3 = 6,8. Website: (7,0 + 6,0 + 7,7) ÷ 3 = 6,9. App-ontwerp wint net. Filter op projecttype en sorteer op eindcijfer.',
                    points: 15,
                },
                {
                    id: 'q2-presentatie-impact',
                    question:
                        'Chiara scoort 9 voor originaliteit, maar slechts 5 voor techniek. Toch haalt ze een 8,0. Wat maakt het verschil?',
                    type: 'multiple-choice',
                    options: [
                        'Originaliteit weegt zwaarder dan techniek in het eindcijfer',
                        'Ze scoort een 9 voor presentatie — dat compenseert de lage techniek-score',
                        'Het eindcijfer is alleen gebaseerd op presentatie',
                        'De docent heeft een fout gemaakt in de berekening',
                    ],
                    correctAnswer: 'Ze scoort een 9 voor presentatie — dat compenseert de lage techniek-score',
                    explanation:
                        'Chiara: originaliteit 9 + techniek 6 + presentatie 9 = gemiddelde (9+6+9)/3 = 8,0. Een sterke presentatie kan een lagere techniek compenseren. Dit is een waardevolle les: hoe je je werk presenteert is net zo belangrijk als hoe je het maakt.',
                    points: 15,
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
                        'Onderzoek-projecten scoren gemiddeld lager. Wat is de meest logische verklaring?',
                    type: 'multiple-choice',
                    options: [
                        'Onderzoeken zijn makkelijker te maken dan apps of spellen',
                        'Techniek-score weegt zwaarder bij onderzoeken',
                        'Bij onderzoeken is het moeilijker om technische vaardigheden te laten zien',
                        'Docenten houden niet van onderzoeksprojecten',
                    ],
                    correctAnswer: 'Bij onderzoeken is het moeilijker om technische vaardigheden te laten zien',
                    explanation:
                        'De beoordelingscriteria zijn originaliteit, techniek en presentatie. Bij een app of spel kun je duidelijk technische vaardigheden laten zien (code, ontwerp, functies). Bij een onderzoek scoort de techniek-kolom lager omdat "techniek" minder tastbaar is. Het is een kwestie van hoe goed het project aansluit bij de beoordelingscriteria.',
                    points: 10,
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
                        'Welke tip heeft het meeste impact op de originaliteits-score op basis van de leerlingen die hem gaven?',
                    type: 'multiple-choice',
                    options: [
                        'Tip 1: Begin met een probleem dat jou bezighoudt',
                        'Tip 2: Maak een plan vóórdat je begint',
                        'Tip 3: Leg uit waarom, niet alleen hoe',
                        'Tip 4: Vraag feedback halverwege',
                    ],
                    correctAnswer: 'Tip 1: Begin met een probleem dat jou bezighoudt',
                    explanation:
                        'Elif en Iris (beiden 8,3) begonnen vanuit een persoonlijk probleem. Een persoonlijk vertrekpunt leidt tot een origineler, specifieker project. Originaliteit is in de tabel de sterkste voorspeller van het eindcijfer. Starten vanuit een echte behoefte in plaats van een vaag idee geeft automatisch meer richting en motivatie.',
                    points: 15,
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
