import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'word-wizard',
    title: 'Word Wizard',
    introEmoji: '✍️',
    introTitle: 'Word Wizard',
    introDescription:
        'Leer werken met Microsoft Word op je iPad. Je maakt een verzorgd verslag met koppen en een afbeelding. Daarna zie je op een laptop of desktop hoe Word van je koppen een automatische inhoudsopgave maakt.',
    introFeatures: [
        'Een nieuw Word-document aanmaken en opslaan',
        'Tekst opmaken met kopstijlen (Kop 1, Kop 2)',
        'Een afbeelding invoegen en tekstomloop instellen',
        'Een automatische inhoudsopgave voorbereiden en op desktop toevoegen',
    ],
    toolName: 'Microsoft Word',
    toolIcon: '📄',
    steps: [
        {
            id: 'stap-1-nieuw-document',
            title: 'Nieuw document aanmaken',
            instruction:
                'Controleer eerst: **Word voor iPad** is geïnstalleerd en je kunt met je **schoolaccount** bij **OneDrive**. Bij een iPad groter dan 10,1 inch, OneDrive van school of premiumfuncties kan Microsoft 365 nodig zijn. Vraagt Word om een abonnement? Vraag je docent. Maak een leeg document, typ je titel en sla het direct met een duidelijke naam op in je schoolmap.',
            tip: 'Sla je document altijd meteen op als je begint — niet pas als je klaar bent. Word slaat automatisch op in de cloud als je OneDrive gebruikt, maar alleen als je het bestand een naam hebt gegeven.',
            checklistItems: [
                { id: 'app-open', label: 'Ik heb de Word-app geopend' },
                { id: 'nieuw-document', label: 'Ik heb een nieuw leeg document aangemaakt' },
                { id: 'opgeslagen', label: 'Ik heb het document opgeslagen met een duidelijke naam in OneDrive' },
                { id: 'bestandsnaam', label: 'De bestandsnaam volgt het format Naam_Verslag_Vak.docx' },
            ],
            teacherCheck:
                'Laat je docent in OneDrive de bestandsnaam en opslaglocatie van je document zien.',
            verificationQuestion: {
                question: 'Kijk boven in beeld, nu je het document hebt opgeslagen. Welke naam staat daar?',
                options: [
                    'Document1',
                    'De naam die ik zelf koos, bijvoorbeeld Sanne_Verslag_Biologie',
                    'Naamloos',
                    'OneDrive',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Open je document en kijk naar de balk bovenaan. Staat daar nog "Document1", dan heb je het bestand nog geen naam gegeven — doe dat eerst en kies daarna opnieuw.',
                explanation:
                    'Klopt. Zodra je het bestand een naam en een plek in OneDrive geeft, verandert de titel bovenaan en slaat Word je werk vanzelf op terwijl je typt.',
            },
        },
        {
            id: 'stap-2-koppen',
            title: 'Kopstijlen gebruiken',
            instruction:
                'Typ een hoofdstuktitel, selecteer die en ga via **Start** (Home) naar **Stijlen**. Kies **Kop 1**. Afhankelijk van je Word-versie en schermstand staat Stijlen achter het stijlen-pictogram of in **Lettertype** (Font). Zie je Stijlen niet? Vraag je docent. Geef daarna een paragraaftitel **Kop 2**; gewone tekst gebruikt **Standaard** of **Normale tekst**.',
            tip: 'Kopstijlen zijn niet alleen voor de opmaak — Word gebruikt ze ook om automatisch een inhoudsopgave te bouwen. Gebruik Kop 1 voor hoofdstukken, Kop 2 voor paragrafen.',
            checklistItems: [
                { id: 'kop1-gezet', label: 'Ik heb minstens één tekst de stijl "Kop 1" gegeven' },
                { id: 'kop2-gezet', label: 'Ik heb minstens één tekst de stijl "Kop 2" gegeven' },
                { id: 'stijlen-zichtbaar', label: 'Ik zie de koppen er visueel anders uitzien dan de gewone tekst' },
            ],
            teacherCheck:
                'Laat je docent in het document minimaal één Kop 1 en één Kop 2 zien.',
            verificationQuestion: {
                question: 'Wat gebeurde er met je titel op het moment dat je "Kop 1" aantikte?',
                options: [
                    'Er kwam een venster waarin ik zelf de lettergrootte moest invullen',
                    'De regel veranderde meteen van grootte en kleur, zonder dat ik zelf iets aan het lettertype deed',
                    'De titel sprong naar een nieuwe pagina',
                    'Er kwam automatisch een nummer voor de titel te staan',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Zet je cursor in je titel en tik nogmaals op Kop 1. Let goed op wat er direct met die regel gebeurt, en kies daarna opnieuw.',
                explanation:
                    'Precies. Een stijl verandert de opmaak in één tik. Word onthoudt daarbij ook dát het een kop is, en gebruikt dat later voor de automatische inhoudsopgave.',
            },
        },
        {
            id: 'stap-3-afbeelding',
            title: 'Afbeelding invoegen',
            instruction:
                'Gebruik een neutrale afbeelding die je docent aanlevert of die aantoonbaar herbruikbaar is. Gebruik geen persoonlijke foto\'s of afbeeldingen van mensen. Noteer de bron. Voeg de afbeelding toe via **Invoegen**, selecteer de afbeelding, kies **Tekstomloop** en daarna **Strak** of **Vierkant**.',
            tip: 'Met de instelling "Strak" loopt tekst direct om de rand van de afbeelding. Met "Vierkant" loopt tekst om een denkbeeldig vierkant eromheen. Beide zien er professioneler uit dan de standaardinstelling "In lijn met tekst".',
            checklistItems: [
                { id: 'afbeelding-ingevoegd', label: 'Ik heb een afbeelding in mijn document ingevoegd' },
                { id: 'bron-genoteerd', label: 'Ik heb gecontroleerd dat ik de afbeelding mag gebruiken en de bron genoteerd' },
                { id: 'tekstomloop', label: 'Ik heb de tekstomloop ingesteld op "Strak" of "Vierkant"' },
                { id: 'afbeelding-verplaatst', label: 'Ik kan de afbeelding op de gewenste plek zetten' },
            ],
            teacherCheck:
                'Laat je docent de gekozen afbeelding, de bron en de ingestelde tekstomloop zien.',
            verificationQuestion: {
                question: 'Wat zag je in je document gebeuren toen je de tekstomloop op "Strak" of "Vierkant" zette?',
                options: [
                    'De afbeelding werd zwart-wit',
                    'De tekst ging om de afbeelding heen lopen en ik kon de afbeelding vrij verslepen',
                    'De afbeelding sprong naar de laatste pagina van het document',
                    'De tekst onder de afbeelding verdween',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Selecteer je afbeelding, zet de tekstomloop op Strak of Vierkant en sleep de afbeelding een stukje. Kijk wat de tekst eromheen doet, en kies daarna opnieuw.',
                explanation:
                    'Goed gezien. Met Strak of Vierkant staat de afbeelding los van de tekst: de tekst loopt eromheen en je kunt de afbeelding neerzetten waar je wilt.',
            },
        },
        {
            id: 'stap-4-inhoudsopgave',
            title: 'Inhoudsopgave voorbereiden',
            instruction:
                'Op de **iPad** kun je een bestaande inhoudsopgave openen, maar niet toevoegen of bijwerken. Controleer daarom of hoofdstukken **Kop 1** en paragrafen **Kop 2** gebruiken. Open het bestand daarna op een laptop of desktop in Word. Kies **Verwijzingen** → **Inhoudsopgave** → **Automatische inhoudsopgave**. Kies na wijzigingen **Tabel bijwerken**.',
            tip: 'Geen laptop of desktop beschikbaar? Laat je kopstructuur aan je docent zien. De docent kan deze desktopstap demonstreren; zoek niet naar een iPad-knop die er niet is.',
            checklistItems: [
                { id: 'kopstructuur-gecontroleerd', label: 'Op de iPad heb ik gecontroleerd dat mijn koppen Kop 1 en Kop 2 gebruiken' },
                { id: 'desktopstap-bekeken', label: 'Ik heb op laptop of desktop gezien hoe Word een automatische inhoudsopgave toevoegt' },
                { id: 'bijwerken-bekeken', label: 'Ik heb gezien hoe Tabel bijwerken een gewijzigde kop toevoegt' },
            ],
            teacherCheck:
                'Laat je docent je kopstructuur zien en leg uit waarom toevoegen en bijwerken op een laptop of desktop gebeurt.',
            verificationQuestion: {
                question: 'Wat stond er in de inhoudsopgave die Word op de laptop of desktop maakte?',
                options: [
                    'Alle zinnen uit mijn document, op alfabetische volgorde',
                    'Precies mijn Kop 1- en Kop 2-teksten, met de Kop 2-regels ingesprongen en paginanummers erachter',
                    'Een lege tabel die ik zelf regel voor regel moest invullen',
                    'Alleen de bestandsnaam en de datum van vandaag',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk (of laat je docent laten zien) wat er verschijnt na Verwijzingen → Inhoudsopgave → Automatische inhoudsopgave, en vergelijk dat met je eigen koppen. Kies daarna opnieuw.',
                explanation:
                    'Klopt. Word haalt de regels uit je Kop 1 en Kop 2 en zet ze met paginanummers in de lijst. Verander je een kop, dan kies je op laptop of desktop Tabel bijwerken.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 60,
            emoji: '🏆',
            title: 'Document Expert',
            color: '#202023',
        },
        {
            minScore: 45,
            emoji: '✍️',
            title: 'Word Wizard',
            color: '#3D3D40',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#6B6B70',
        },
    ],
    learningObjectives: [
        'De leerling maakt een Word-document aan, geeft het een naam en slaat het op in OneDrive.',
        'De leerling past Kop 1 en Kop 2 toe op titels en paragrafen in een verslag.',
        'De leerling voegt een afbeelding in en stelt de tekstomloop in op "Strak" of "Vierkant".',
        'De leerling bereidt met Kop 1 en Kop 2 een automatische inhoudsopgave voor en legt uit hoe Word die kopstijlen gebruikt.',
    ],
    takeaways: [
        'Je kunt een nieuw Word-document aanmaken en direct opslaan in OneDrive',
        'Je snapt hoe je kopstijlen (Kop 1, Kop 2) toepast voor structuur',
        'Je kunt een afbeelding invoegen en de tekstomloop instellen',
        'Je weet waarom je de automatische inhoudsopgave op laptop of desktop toevoegt en bijwerkt',
        'Je begrijpt waarom kopstijlen en automatische inhoudsopgaven samenwerken',
    ],
};

export default config;
