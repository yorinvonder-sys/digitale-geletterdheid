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
                question:
                    'Pak jouw probleemzin erbij en streep het woord (of de woorden) weg die zeggen WIE dit probleem heeft. Wat houd je over?',
                options: [
                    'Precies dezelfde zin — er stond geen doelgroep in',
                    'Een zin die nog steeds vertelt wát er misgaat, maar niet meer voor wie',
                    'Niets meer, want mijn hele zin ging over de doelgroep',
                    'Eén los woord',
                ],
                correctIndex: 1,
                explanation:
                    'Goed gekeken. Blijft er zonder de doelgroep nog een zin over die vertelt wat er misgaat, dan zitten allebei de delen erin. Zet de doelgroep er weer bij — investeerders willen precies weten voor wie je bouwt.',
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
                question:
                    'Onderstreep in jouw oplossing het werkwoord dat zegt wat de AI zélf doet (herinnert, voorspelt, sorteert, vertaalt ...). Wat kom je tegen?',
                options: [
                    'Alleen werkwoorden die zeggen wat de gebruiker doet, niet de AI',
                    'Minstens één werkwoord waarbij de AI zelf het werk doet',
                    'Geen enkel werkwoord — mijn tekst beschrijft nog steeds het probleem',
                    'Alleen mijn startupnaam, want die staat in elke zin',
                ],
                correctIndex: 1,
                explanation:
                    'Mooi. Dat ene werkwoord is de kern van je pitch: het zegt in één woord wat jouw AI voor iemand doet. Staat het er nog niet, schrijf het er dan alsnog bij.',
            },
        },
        {
            id: 'stap-3-branding',
            title: 'Logo en slogan',
            instruction:
                'Investeerders beoordelen ook je **branding** (= hoe je merk eruitziet en aanvoelt). Ontwerp je **visuele identiteit** (= het geheel van logo, kleuren en slogan):\n1. **Logo** — Beschrijf het symbool en de kleuren. Waarom passen ze bij jouw startup?\n2. **Slogan** — Één zin die alles samenvat: max. 6 woorden, actief en positief.\n\nTeken of beschrijf je logo in je schrift of in een tekenapp.',
            tip: 'Kleuren communiceren gevoel. Banken gebruiken blauw omdat dat vertrouwen uitstraalt. Energiedranken gebruiken rood en oranje voor actie. Kies kleuren die passen bij hoe je startup mensen wil laten voelen.',
            checklistItems: [
                { id: 'logo-beschreven', label: 'Ik heb mijn logo beschreven of getekend met symbool en kleuren' },
                { id: 'slogan', label: 'Ik heb een slogan van maximaal 6 woorden bedacht' },
                { id: 'kleurenpalet', label: 'Ik heb 2 à 3 kleuren gekozen (bijv. blauw = vertrouwen, groen = groei, oranje = energie) en uitgelegd waarom ze passen' },
            ],
            verificationQuestion: {
                question:
                    'Lees jouw slogan en haal er in gedachten het belangrijkste woord uit weg. Wat blijft er over?',
                options: [
                    'Een zin die precies hetzelfde betekent als eerst',
                    'Een zin waar de kern uit is, zodat niemand meer snapt waar mijn startup over gaat',
                    'Niets — mijn slogan bestond uit dat ene woord',
                    'Een langere zin dan eerst',
                ],
                correctIndex: 1,
                explanation:
                    'Klopt. Als één woord weghalen je slogan meteen leegmaakt, dan draagt elk woord zijn gewicht. Dat is precies wat je wilt in maximaal zes woorden.',
            },
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
                question:
                    'Lees de oplossing die je bij je risico schreef en streep alles weg wat geen handeling is die je echt kunt uitvoeren ("beter opletten", "eerlijk zijn"). Wat blijft er staan?',
                options: [
                    'Het risico zelf, nog een keer opgeschreven',
                    'Iets wat je echt kunt doen, zoals data na een maand wissen of de app ook in een andere taal aanbieden',
                    'Niets — er stonden alleen goede bedoelingen',
                    'De lijst met data die mijn AI verzamelt',
                ],
                correctIndex: 1,
                explanation:
                    'Precies. Een risico benoemen is stap één; investeerders willen een maatregel zien die je morgen kunt uitvoeren. Blijft er niets staan, maak je oplossing dan concreter.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 60,
            emoji: '🏆',
            title: 'AI Entrepreneur',
            color: '#ff3c21',
        },
        {
            minScore: 45,
            emoji: '💡',
            title: 'Startup Founder',
            color: '#e1ff01',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#202023',
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
