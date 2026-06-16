import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const automationEngineerConfig: BuilderCanvasConfig = {
    missionId: 'automation-engineer',
    title: 'Automation Engineer',
    introEmoji: '⚡',
    introTitle: 'Automatiseer saaie taken',
    introDescription:
        'In deze missie leer je hoe je met scripts repetitieve taken kunt automatiseren. Je analyseert een probleem, ontwerpt een algoritme en schrijft pseudocode — precies zoals een echte software-engineer.',
    introFeatures: [
        'Analyseer welke taken geschikt zijn voor automatisering',
        'Ontwerp een algoritme in pseudocode',
        'Schrijf een script-structuur voor een Python-oplossing',
        'Bedenk hoe je de automatisering kunt testen',
    ],
    enableChat: true,
    chatRoleId: 'automation-engineer',
    previewType: 'text-preview',
    steps: [
        {
            id: 'taak-analyse',
            title: 'Automatiseringskandidaat identificeren',
            description:
                'Niet alle taken zijn geschikt voor automatisering. De beste kandidaten zijn: taken die vaak herhaald worden, altijd dezelfde stappen volgen, en tijdrovend zijn maar weinig denkwerk vereisen. Een goede engineer herkent ze snel.',
            instruction:
                'Beschrijf een taak die je wilt automatiseren (bijv. het hernoemen van bestanden, het sturen van wekelijkse e-mails, het maken van een back-up). Analyseer de taak met: 1) Hoe vaak wordt het gedaan? (per dag/week), 2) Hoeveel tijd kost het nu?, 3) Volgt het altijd dezelfde stappen?, 4) Wat gaat er soms mis bij handmatig uitvoeren? Bereken daarna hoeveel tijd automatisering per jaar bespaart.',
            tip: 'Als een mens een taak kan beschrijven als een recept (stap 1, stap 2, stap 3) zonder te hoeven nadenken, kan een computer het ook uitvoeren.',
            checklistItems: [
                { id: 'taak-gekozen', label: 'Ik heb een concrete taak gekozen om te automatiseren' },
                { id: 'frequentie', label: 'Ik heb beschreven hoe vaak en hoelang de taak nu duurt' },
                { id: 'tijdsbesparing', label: 'Ik heb de jaarlijkse tijdsbesparing berekend' },
                { id: 'fouten', label: 'Ik heb beschreven wat er bij handmatig uitvoeren misgaat' },
            ],
            textPrompt: 'Analyseer je automatiseringskandidaat',
        },
        {
            id: 'algoritme',
            title: 'Algoritme ontwerpen',
            description:
                'Een algoritme is een stap-voor-stap plan om een probleem op te lossen. Voordat je ook maar één regel code schrijft, denk je het algoritme uit in gewone taal. Dat heet pseudocode: code die leesbaar is voor mensen, niet voor computers.',
            instruction:
                'Schrijf het algoritme voor je automatisering in pseudocode. Gebruik duidelijke stappen (STAP 1, STAP 2...), IF/THEN-constructies voor keuzes, en FOR-lussen voor herhalingen. Voorbeeld: "ALS het bestand al bestaat, SLA DAN OVER. ANDERS: hernoem het bestand." Schrijf minimaal 8 stappen.',
            tip: 'Pseudocode hoeft niet in het Engels. Nederlands is prima. Het gaat erom dat de logica klopt, niet de syntax.',
            checklistItems: [
                { id: 'acht-stappen', label: 'Mijn pseudocode heeft minimaal 8 stappen' },
                { id: 'if-then', label: 'Ik gebruik minimaal 1 IF/THEN-constructie' },
                { id: 'lus', label: 'Ik gebruik minimaal 1 FOR-lus of herhaling' },
                { id: 'logisch', label: 'Het algoritme volgt een logische volgorde' },
            ],
            textPrompt: 'Schrijf je pseudocode-algoritme',
        },
        {
            id: 'script-structuur',
            title: 'Script-structuur uitwerken',
            description:
                'Nu zet je de pseudocode om naar een echte script-structuur in Python. Je hoeft niet alles werkend te maken, maar je beschrijft welke functies je nodig hebt en hoe ze samenwerken.',
            instruction:
                'Schrijf de Python-structuur van je script. Gebruik: 1) Commentaarregels (#) om elke sectie te beschrijven, 2) Minstens 2 functiedefinities met `def functienaam():`, 3) Een main-sectie die de functies aanroept, 4) Beschrijf in commentaar welke Python-modules je nodig hebt (bijv. `os` voor bestanden, `smtplib` voor e-mail). Je hoeft de functies niet volledig te implementeren.',
            tip: 'Een Python-functie: `def hernoem_bestand(oud_naam, nieuw_naam):`. Elke taak in een eigen functie houdt code overzichtelijk.',
            checklistItems: [
                { id: 'twee-functies', label: 'Er zijn minimaal 2 functiedefinities' },
                { id: 'main', label: 'Er is een main-sectie die de functies aanroept' },
                { id: 'commentaar', label: 'Commentaarregels leggen elke sectie uit' },
                { id: 'modules', label: 'Benodigde Python-modules zijn beschreven' },
            ],
            textPrompt: 'Schrijf je Python-scriptstructuur',
        },
        {
            id: 'testplan',
            title: 'Script testen en valideren',
            description:
                'Automatiseringsscripts moeten zorgvuldig getest worden. Een fout in een script dat 1000 bestanden hernoemt is catastrofaal — je kunt niet handmatig terugdraaien. Testen is geen optie, het is verplicht.',
            instruction:
                'Schrijf een testplan voor je script. Beschrijf: 1) Hoe je het script test ZONDER echte data te beïnvloeden (bijv. een testmap met dummy-bestanden), 2) 3 testcases: één waarbij alles klopt, één waarbij een bestand al bestaat, één waarbij de invoer onverwacht is, 3) Hoe je een "dry run" modus inbouwt die beschrijft wat het script ZOU doen, maar het niet doet. Leg ook uit hoe je het script veilig voor anderen maakt.',
            tip: 'Bouw altijd eerst een "dry run" in: het script print wat het zou doen, maar doet het nog niet echt. Zo zie je fouten voordat ze schade aanrichten.',
            checklistItems: [
                { id: 'testomgeving', label: 'Ik heb beschreven hoe ik test zonder echte data' },
                { id: 'drie-testcases', label: 'Ik heb 3 testcases beschreven' },
                { id: 'dry-run', label: 'Ik heb uitgelegd hoe een dry run werkt' },
                { id: 'veiligheid', label: 'Ik heb nagedacht over veiligheid voor anderen' },
            ],
            textPrompt: 'Schrijf je testplan',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Script Wizard', color: '#D7C95F' },
        { minScore: 70, emoji: '⚡', title: 'Automation Engineer', color: '#5F947D' },
        { minScore: 50, emoji: '🔄', title: 'Loop Leerling', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Automatiseerder', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je een taak beoordeelt op geschiktheid voor automatisering',
        'Je kunt pseudocode schrijven met IF/THEN-constructies en lussen',
        'Je begrijpt hoe een Python-script is opgebouwd met functies en een main-sectie',
        'Je weet waarom testen cruciaal is bij automatisering en hoe je een dry run gebruikt',
        'Je kunt berekenen hoeveel tijd automatisering bespaart — en dat is overtuigend voor elke opdrachtgever',
    ],
};

export default automationEngineerConfig;
