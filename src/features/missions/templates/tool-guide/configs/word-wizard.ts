import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'word-wizard',
    title: 'Word Wizard',
    introEmoji: '✍️',
    introTitle: 'Word Wizard',
    introDescription:
        'Leer werken met Microsoft Word op je iPad. Je maakt een professioneel verslag met koppen, een afbeelding en een automatische inhoudsopgave — precies zoals het op school verwacht wordt.',
    introFeatures: [
        'Een nieuw Word-document aanmaken en opslaan',
        'Tekst opmaken met kopstijlen (Kop 1, Kop 2)',
        'Een afbeelding invoegen en tekstomloop instellen',
        'Een automatische inhoudsopgave toevoegen',
    ],
    toolName: 'Microsoft Word',
    toolIcon: '📄',
    steps: [
        {
            id: 'stap-1-nieuw-document',
            title: 'Nieuw document aanmaken',
            instruction:
                'Open de **Word**-app op je iPad. Tik op **Nieuw** (of het +-icoon) en kies **Leeg document**. Typ de titel van je verslag bovenaan. Sla het document daarna direct op: tik op het **menu linksboven** (de drie streepjes of het Word-logo) en kies **Opslaan als**. Sla het op in OneDrive onder je schoolmap met een duidelijke naam, zoals `Naam_Verslag_Vak.docx`.',
            tip: 'Sla je document altijd meteen op als je begint — niet pas als je klaar bent. Word slaat automatisch op in de cloud als je OneDrive gebruikt, maar alleen als je het bestand een naam hebt gegeven.',
            checklistItems: [
                { id: 'app-open', label: 'Ik heb de Word-app geopend' },
                { id: 'nieuw-document', label: 'Ik heb een nieuw leeg document aangemaakt' },
                { id: 'opgeslagen', label: 'Ik heb het document opgeslagen met een duidelijke naam in OneDrive' },
            ],
            verificationQuestion: {
                question: 'Waarom sla je een document meteen op als je begint, en niet pas aan het einde?',
                options: [
                    'Omdat Word anders automatisch stopt na 5 minuten',
                    'Zodat je werk niet verloren gaat als de app crasht of de iPad uitvalt',
                    'Omdat je anders niet kunt typen',
                    'Omdat de docent het anders niet kan zien',
                ],
                correctIndex: 1,
                explanation:
                    'Precies! Als je document al een naam en locatie heeft, slaat Word het automatisch op terwijl je werkt. Zo verlies je nooit je werk bij een crash of lege batterij.',
            },
        },
        {
            id: 'stap-2-koppen',
            title: 'Kopstijlen gebruiken',
            instruction:
                'Typ een hoofdstuktitel (bijv. "Inleiding"). Selecteer die tekst door erop te tikken en te slepen. Tik op het **penseel-icoon** rechtsboven (Opmaak) en ga naar het tabblad **Stijlen**. Kies **Kop 1**. Typ dan een paragraaftitel (bijv. "Achtergrond") en geef die de stijl **Kop 2**. Normale alineatekst krijgt automatisch de stijl **Standaard** of **Normale tekst**.',
            tip: 'Kopstijlen zijn niet alleen voor de opmaak — Word gebruikt ze ook om automatisch een inhoudsopgave te bouwen. Gebruik Kop 1 voor hoofdstukken, Kop 2 voor paragrafen.',
            checklistItems: [
                { id: 'kop1-gezet', label: 'Ik heb minstens één tekst de stijl "Kop 1" gegeven' },
                { id: 'kop2-gezet', label: 'Ik heb minstens één tekst de stijl "Kop 2" gegeven' },
                { id: 'stijlen-zichtbaar', label: 'Ik zie de koppen er visueel anders uitzien dan de gewone tekst' },
            ],
            verificationQuestion: {
                question: 'Waarvoor gebruikt Word de stijlen "Kop 1" en "Kop 2" naast de opmaak?',
                options: [
                    'Om de tekst automatisch te vertalen naar een andere taal',
                    'Om automatisch een inhoudsopgave te kunnen genereren',
                    'Om de tekst groter te maken op het scherm',
                    'Om spelfouten in de koptekst te controleren',
                ],
                correctIndex: 1,
                explanation:
                    'Goed! Word leest je kopstijlen en gebruikt die om een automatische inhoudsopgave te bouwen. Als je later een hoofdstuk verplaatst, past de inhoudsopgave zich vanzelf aan.',
            },
        },
        {
            id: 'stap-3-afbeelding',
            title: 'Afbeelding invoegen',
            instruction:
                'Klik in je document op de plek waar je de afbeelding wilt. Tik op **Invoegen** (tabblad bovenaan) en kies **Afbeeldingen** of **Foto\'s**. Selecteer een foto uit je Fotoalbum of voeg een online afbeelding in. Tik op de afbeelding nadat je hem hebt ingevoegd en zoek in het menu naar **Tekstomloop**. Kies **Strak** of **Vierkant** zodat de tekst netjes om de afbeelding heen loopt.',
            tip: 'Met de instelling "Strak" loopt tekst direct om de rand van de afbeelding. Met "Vierkant" loopt tekst om een denkbeeldig vierkant eromheen. Beide zien er professioneler uit dan de standaardinstelling "In lijn met tekst".',
            checklistItems: [
                { id: 'afbeelding-ingevoegd', label: 'Ik heb een afbeelding in mijn document ingevoegd' },
                { id: 'tekstomloop', label: 'Ik heb de tekstomloop ingesteld op "Strak" of "Vierkant"' },
                { id: 'afbeelding-verplaatst', label: 'Ik kan de afbeelding op de gewenste plek zetten' },
            ],
        },
        {
            id: 'stap-4-inhoudsopgave',
            title: 'Automatische inhoudsopgave',
            instruction:
                'Ga naar het **begin van je document** — net na de titelpagina of als eerste element. Tik op **Invoegen** (tabblad bovenaan) en zoek naar **Inhoudsopgave**. Kies een stijl (bijv. de eerste automatische optie). Word maakt nu een inhoudsopgave op basis van je kopstijlen. Als je daarna tekst toevoegt of koppen aanpast, tik je op de inhoudsopgave en kies je **Bijwerken** om hem te vernieuwen.',
            tip: 'Als je koppen later aanpast, vergeet dan niet de inhoudsopgave bij te werken. Tik erop en kies "Bijwerken" of "Alles bijwerken".',
            checklistItems: [
                { id: 'inhoudsopgave-ingevoegd', label: 'Ik heb een automatische inhoudsopgave ingevoegd' },
                { id: 'koppen-zichtbaar', label: 'Mijn koppen staan in de inhoudsopgave' },
                { id: 'paginanummers', label: 'De inhoudsopgave toont paginanummers bij de koppen' },
            ],
            verificationQuestion: {
                question: 'Wat moet je doen als je na het invoegen van de inhoudsopgave nog een hoofdstuk toevoegt?',
                options: [
                    'De inhoudsopgave verwijderen en opnieuw invoegen',
                    'Het nieuwe hoofdstuk handmatig toevoegen aan de inhoudsopgave',
                    'Op de inhoudsopgave tikken en kiezen voor "Bijwerken"',
                    'Niets — Word doet dit automatisch zonder dat je iets hoeft te doen',
                ],
                correctIndex: 2,
                explanation:
                    'Goed! Je hoeft de inhoudsopgave niet te verwijderen. Tik erop en kies "Bijwerken" — Word past hem automatisch aan op basis van je nieuwe koppen.',
            },
        },
    ],
    maxScore: 60,
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
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#202023',
        },
    ],
    takeaways: [
        'Je kunt een nieuw Word-document aanmaken en direct opslaan in OneDrive',
        'Je snapt hoe je kopstijlen (Kop 1, Kop 2) toepast voor structuur',
        'Je kunt een afbeelding invoegen en de tekstomloop instellen',
        'Je weet hoe je een automatische inhoudsopgave maakt en bijwerkt',
        'Je begrijpt waarom kopstijlen en automatische inhoudsopgaven samenwerken',
    ],
};

export default config;
