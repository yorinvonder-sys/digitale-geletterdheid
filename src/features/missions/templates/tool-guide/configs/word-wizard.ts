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
                question: 'Waarom sla je een document meteen op als je begint, en niet pas aan het einde?',
                options: [
                    'Omdat Word anders automatisch stopt na 5 minuten',
                    'Zodat je werk niet verloren gaat als de app crasht of de iPad uitvalt',
                    'Omdat je anders niet kunt typen',
                    'Omdat de docent het anders niet kan zien',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan wat er met je werk gebeurt als de app sluit voordat het bestand een naam en opslaglocatie heeft. Kies daarna opnieuw.',
                explanation:
                    'Precies! Als je document al een naam en locatie heeft, slaat Word het automatisch op terwijl je werkt. Zo is de kans kleiner dat je werk verliest bij een crash of lege batterij.',
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
                question: 'Waarvoor gebruikt Word de stijlen "Kop 1" en "Kop 2" naast de opmaak?',
                options: [
                    'Om de tekst automatisch te vertalen naar een andere taal',
                    'Om automatisch een inhoudsopgave te kunnen genereren',
                    'Om de tekst groter te maken op het scherm',
                    'Om spelfouten in de koptekst te controleren',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan hoe Word hoofdstukken en paragrafen kan herkennen zonder de tekst zelf te begrijpen. Kies daarna opnieuw.',
                explanation:
                    'Goed! Word leest je kopstijlen en gebruikt die om een automatische inhoudsopgave te bouwen. Na een wijziging werk je de inhoudsopgave op laptop of desktop opnieuw bij.',
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
                question: 'Waarom gebruik je op de iPad al Kop 1 en Kop 2 voordat je op desktop de inhoudsopgave toevoegt?',
                options: [
                    'Omdat Word anders geen afbeeldingen kan openen',
                    'Omdat Word de kopstijlen gebruikt om de inhoudsopgave op te bouwen',
                    'Omdat Kop 1 het document automatisch naar de docent stuurt',
                    'Omdat de iPad dan zelf paginanummers toevoegt',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan hoe Word bepaalt welke regels hoofdstukken en paragrafen zijn. Kies daarna opnieuw.',
                explanation:
                    'Goed! Word gebruikt Kop 1 en Kop 2 als bron voor de automatische inhoudsopgave. Na wijzigingen kies je op laptop of desktop Tabel bijwerken.',
            },
        },
    ],
    maxScore: 55,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Document Expert',
            color: '#202023',
        },
        {
            minScore: 40,
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
