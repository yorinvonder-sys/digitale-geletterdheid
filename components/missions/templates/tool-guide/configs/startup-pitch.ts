import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'startup-pitch',
    title: 'Startup Pitch',
    introEmoji: '💡',
    introTitle: 'Startup Pitch',
    introDescription:
        'Bedenk je eigen AI-startup en pitch hem aan investeerders. Je combineert alles wat je hebt geleerd: probleemanalyse, AI-oplossing, branding en ethische reflectie.',
    introFeatures: [
        'Een concreet probleem identificeren uit het dagelijks leven',
        'Een AI-oplossing bedenken en je startup een naam geven',
        'Een logo, slogan en visuele pitch ontwerpen',
        'Nadenken over privacy en ethische risico\'s van je AI',
    ],
    toolName: 'Startup Canvas',
    toolIcon: '🚀',
    steps: [
        {
            id: 'stap-1-probleem',
            title: 'Het probleem',
            instruction:
                'Elke goede startup begint bij een **probleem**. Denk aan je dagelijks leven:\n- Wat kost je veel tijd op school of thuis?\n- Wat frustreert je regelmatig?\n- Welk probleem zou je voor anderen willen oplossen?\n\nKies één specifiek probleem. Schrijf op:\n1. Wat is het probleem? (1 zin)\n2. Wie heeft dit probleem nog meer?\n3. Hoe vaak speelt het?\n\nVaag probleem: "School is moeilijk." Concreet probleem: "Ik vergeet altijd welke deadlines ik deze week heb."',
            tip: 'Hoe specifieker het probleem, hoe sterker je startup. "Mensen zijn soms gestrest" is te vaag. "Leerlingen vergeten 40% van hun deadlines in de derde week van het kwartaal" is concreet.',
            checklistItems: [
                { id: 'probleem-zin', label: 'Ik heb het probleem beschreven in één duidelijke zin' },
                { id: 'doelgroep', label: 'Ik weet voor wie dit probleem speelt' },
                { id: 'frequentie', label: 'Ik heb nagedacht over hoe vaak dit probleem voorkomt' },
            ],
            verificationQuestion: {
                question: 'Welk probleemomschrijving is het sterkst als startpunt voor een startup?',
                options: [
                    'De wereld is niet eerlijk',
                    'School is soms moeilijk voor leerlingen',
                    'Leerlingen vergeten gemiddeld 3 deadlines per maand omdat hun agenda te vol is',
                    'AI kan veel dingen beter dan mensen',
                ],
                correctIndex: 2,
                explanation:
                    'Precies! Een concreet, meetbaar probleem met een specifieke doelgroep is het beste startpunt. Zo weet je straks ook of je oplossing echt werkt.',
            },
        },
        {
            id: 'stap-2-oplossing',
            title: 'De AI-oplossing',
            instruction:
                'Nu je het probleem kent, bedenk je hoe **AI** dit kan oplossen. Kies een type AI-oplossing:\n- Een **chatbot** die helpt met...\n- Een **app** die automatisch...\n- Een **slim systeem** dat voorspelt wanneer...\n\nBeschrijf je oplossing in **2 tot 3 zinnen**. Bedenk daarna een **naam** voor je startup — catchy, makkelijk te onthouden. Goede namen zijn: kort (max. 2 woorden), makkelijk uit te spreken, en ze passen bij het probleem.',
            tip: 'De beste startupnamen zijn kort en zeggen direct iets over het product: Duolingo (duo + lingo = twee talen), Spotify (spot + identify), Dropbox (drop + box). Probeer dat principe!',
            checklistItems: [
                { id: 'oplossing-beschreven', label: 'Ik heb mijn AI-oplossing beschreven in 2 tot 3 zinnen' },
                { id: 'startup-naam', label: 'Ik heb een naam bedacht voor mijn startup' },
                { id: 'naam-catchy', label: 'De naam is kort, makkelijk te onthouden en past bij de oplossing' },
            ],
            verificationQuestion: {
                question: 'Wat maakt een goede startupnaam?',
                options: [
                    'Zo lang mogelijk, zodat het professioneel klinkt',
                    'Een naam met veel technische termen erin',
                    'Kort, makkelijk te onthouden en passend bij het product',
                    'Een naam die niemand kent, zodat het mysterieus klinkt',
                ],
                correctIndex: 2,
                explanation:
                    'Goed! De beste namen zijn kort, uitsprekbaar en roepen meteen een gevoel op dat bij het product past. Denk aan Zoom, Slack, Canva — simpel en direct.',
            },
        },
        {
            id: 'stap-3-branding',
            title: 'Logo en slogan',
            instruction:
                'Investeerders beoordelen ook hoe je startup eruitziet. Ontwerp je **visuele identiteit**:\n1. **Logo** — Beschrijf hoe het logo eruitziet. Welke kleuren? Welk symbool? Waarom past dat bij jouw startup?\n2. **Slogan** — Één zin die alles samenvat. Voorbeelden: "Just do it." (Nike), "Think different." (Apple). Jouw slogan: max. 6 woorden, actief, positief.\n3. **Kleurenpalet** — Kies 2 à 3 kleuren. Blauw = vertrouwen, groen = groei, oranje = energie.\n\nTeken of beschrijf je logo in je schrift of in een tekenapp.',
            tip: 'Kleuren communiceren gevoel. Banken gebruiken blauw omdat dat vertrouwen uitstraalt. Energiedranken gebruiken rood en oranje voor actie. Kies kleuren die passen bij hoe je startup mensen wil laten voelen.',
            checklistItems: [
                { id: 'logo-beschreven', label: 'Ik heb mijn logo beschreven of getekend met kleuren en symbool' },
                { id: 'slogan', label: 'Ik heb een slogan van maximaal 6 woorden bedacht' },
                { id: 'kleurenpalet', label: 'Ik heb 2 à 3 kleuren gekozen en uitgelegd waarom ze passen' },
            ],
        },
        {
            id: 'stap-4-ethiek',
            title: 'Ethische reflectie',
            instruction:
                'Een goede ondernemer denkt ook na over **risico\'s** van zijn AI. Beantwoord deze twee vragen:\n\n1. **Privacy**: Welke data verzamelt jouw AI? (bijv. locatie, schoolresultaten, berichtenhistorie) Is het nodig om al die data op te slaan? Wie heeft er toegang toe?\n2. **Eerlijkheid**: Kan je AI bepaalde groepen benadelen? Bijv. als het systeem alleen in het Nederlands werkt, of als het beter werkt voor leerlingen met een computer dan zonder.\n\nSchrijf voor elk risico ook een oplossing op.',
            tip: 'Elke AI verzamelt data. De vraag is niet OF je data verzamelt, maar WELKE data echt nodig is en HOE je die beschermt. In de EU gelden strenge regels voor het opslaan van data van minderjarigen.',
            checklistItems: [
                { id: 'privacy-data', label: 'Ik heb beschreven welke data mijn AI verzamelt' },
                { id: 'privacy-noodzaak', label: 'Ik heb nagedacht of alle data echt nodig is' },
                { id: 'eerlijkheid', label: 'Ik heb één risico benoemd voor eerlijkheid of toegankelijkheid' },
                { id: 'oplossing-risico', label: 'Ik heb voor minstens één risico een oplossing bedacht' },
            ],
            verificationQuestion: {
                question: 'Waarom moet een AI-startup nadenken over privacy, ook als de app gratis is?',
                options: [
                    'Alleen betaalde apps hoeven zich aan privacyregels te houden',
                    'Omdat gratis apps automatisch geen data verzamelen',
                    'Omdat data van gebruikers — ook minderjarigen — beschermd moet worden, ongeacht de prijs',
                    'Dat hoeft niet — als gebruikers akkoord gaan, is alles toegestaan',
                ],
                correctIndex: 2,
                explanation:
                    'Precies! In de EU gelden voor alle apps strenge regels voor dataverwerking, ook voor gratis apps. Bij apps voor minderjarigen gelden nog extra regels. Een goed product is ook een veilig en eerlijk product.',
            },
        },
    ],
    maxScore: 55,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'AI Entrepreneur',
            color: '#D97757',
        },
        {
            minScore: 40,
            emoji: '💡',
            title: 'Startup Founder',
            color: '#F59E0B',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#10B981',
        },
    ],
    takeaways: [
        'Je kunt een concreet, specifiek probleem identificeren als startpunt voor een startup',
        'Je weet hoe je een AI-oplossing beschrijft en een catchy startupnaam bedenkt',
        'Je kunt een visuele identiteit ontwerpen met logo, slogan en kleurenpalet',
        'Je snapt hoe je nadenkt over privacy en eerlijkheid bij een AI-product',
        'Je begrijpt dat een goede startup zowel nuttig als ethisch verantwoord moet zijn',
    ],
};

export default config;
