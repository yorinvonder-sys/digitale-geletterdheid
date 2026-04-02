import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const missionBlueprintConfig: BuilderCanvasConfig = {
    missionId: 'mission-blueprint',
    title: 'De Blauwdruk',
    introEmoji: '🗺️',
    introTitle: 'Plan je meesterwerk',
    introDescription:
        'In deze missie leer je hoe je een groot project structureert voordat je begint. Je maakt een planning in stappen, bepaalt de volgorde van taken en slaat je plan op zodat je altijd weet wat je nog moet doen.',
    introFeatures: [
        'Breek een groot project op in kleine stappen',
        'Bepaal de volgorde van je taken',
        'Maak een realistische tijdsindeling',
        'Sla je plan op in de cloud',
    ],
    enableChat: true,
    chatRoleId: 'mission-blueprint',
    previewType: 'text-preview',
    steps: [
        {
            id: 'project-kiezen',
            title: 'Project beschrijven',
            description:
                'Elk groot project begint met een helder beeld van wat je wilt bereiken. Zonder doel weet je niet wanneer je klaar bent. En zonder omschrijving weet je niet waar je begint.',
            instruction:
                'Beschrijf je eindproject in 3 tot 5 zinnen. Beantwoord: 1) Wat ga je maken?, 2) Voor wie is het?, 3) Wat is het coolste of meest uitdagende eraan? Geef je project ook een naam. Schrijf daarna in één zin op wanneer je "klaar" bent — dat is je definitie van Done.',
            tip: 'Een project zonder duidelijk eindpunt is als een reis zonder bestemming. Schrijf je definitie van Done op en hang hem ergens waar je hem elke sessie ziet.',
            checklistItems: [
                { id: 'beschrijving', label: 'Ik heb mijn project beschreven in 3-5 zinnen' },
                { id: 'naam', label: 'Mijn project heeft een naam' },
                { id: 'done', label: 'Ik heb in één zin beschreven wanneer ik "klaar" ben' },
            ],
            textPrompt: 'Beschrijf je project en definitie van Done',
        },
        {
            id: 'stappen-lijst',
            title: 'Taken opschrijven',
            description:
                'Een goed plan bestaat uit kleine, concrete stappen. Niet "website maken", maar "startpagina HTML schrijven". Hoe concreter een taak, hoe makkelijker je hem kunt uitvoeren en afvinken.',
            instruction:
                'Schrijf alle stappen op die je moet zetten om je project af te ronden. Minimaal 8 taken. Elke taak moet concreet zijn: begin met een werkwoord ("Maak...", "Schrijf...", "Test...", "Zoek..."). Vermijd vage taken als "project afmaken". Voeg bij elke taak toe hoe lang je denkt dat het duurt (in minuten of uren).',
            tip: 'Als een taak meer dan 2 uur duurt, is hij te groot. Splits hem op in deeltaken. Kleine taken zijn makkelijker vol te houden.',
            checklistItems: [
                { id: 'acht-taken', label: 'Ik heb minimaal 8 concrete taken opgeschreven' },
                { id: 'werkwoord', label: 'Elke taak begint met een werkwoord' },
                { id: 'tijdsinschatting', label: 'Bij elke taak staat een tijdsinschatting' },
            ],
            textPrompt: 'Schrijf je takenlijst',
        },
        {
            id: 'volgorde',
            title: 'Volgorde bepalen',
            description:
                'Niet alle taken kun je in willekeurige volgorde doen. Je kunt pas een website testen als hij gemaakt is. Je kunt pas een video monteren als de shots zijn opgenomen. Afhankelijkheden bepalen je volgorde.',
            instruction:
                'Neem je takenlijst en bepaal de volgorde. Zet een nummer voor elke taak (1 = als eerste, 2 = daarna, etc.). Noteer bij maximaal 3 taken een afhankelijkheid: "Taak X kan pas beginnen als Taak Y klaar is." Kies daarna welke taak je als allereerste gaat doen als je morgen begint — en schrijf op waarom.',
            tip: 'Begin met de taak die je het meest ophoudt als hij niet gedaan is. Dat is vaak de moeilijkste — en die wil je het liefst uitstellen. Doe die eerst.',
            checklistItems: [
                { id: 'genummerd', label: 'Alle taken zijn genummerd in volgorde' },
                { id: 'afhankelijkheden', label: 'Minimaal 3 afhankelijkheden zijn beschreven' },
                { id: 'eerste-taak', label: 'Ik heb de eerste taak gekozen met motivatie' },
            ],
            textPrompt: 'Schrijf de volgorde en afhankelijkheden van je taken',
        },
        {
            id: 'opslaan',
            title: 'Plan opslaan in de cloud',
            description:
                'Een planning die alleen in je hoofd zit, bestaat niet. Een planning in een document dat je kwijtraakt ook bijna niet. De cloud zorgt dat je plan altijd bereikbaar is — ook als je computer kapotgaat.',
            instruction:
                'Beschrijf hoe je je plan opslaat. Kies een tool: Word in OneDrive, Google Docs, Notion, Trello, of een ander programma. Leg uit: 1) Welke tool je kiest en waarom, 2) In welke map of workspace je het opslaat, 3) Hoe je zorgt dat je het plan bijhoudt (bijv. elke les 5 minuten), 4) Hoe je iemand anders toegang geeft als je samenwerkt of als iemand je plan moet beoordelen.',
            tip: 'Google Docs en OneDrive slaan automatisch op. Geen bestand meer verloren door een crash. Kies altijd cloud boven lokale opslag voor schoolprojecten.',
            checklistItems: [
                { id: 'tool-gekozen', label: 'Ik heb een cloudtool gekozen met motivatie' },
                { id: 'locatie', label: 'Ik heb beschreven in welke map of workspace ik het opsla' },
                { id: 'bijhouden', label: 'Ik heb uitgelegd hoe ik het plan bijhoud' },
                { id: 'delen', label: 'Ik heb beschreven hoe ik het plan deel met anderen' },
            ],
            textPrompt: 'Beschrijf hoe je je plan opslaat en bijhoudt',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Projectmanager', color: '#F59E0B' },
        { minScore: 70, emoji: '🗺️', title: 'Planner', color: '#10B981' },
        { minScore: 50, emoji: '📋', title: 'Takenlijst Maker', color: '#D97757' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#6B6B66' },
    ],
    takeaways: [
        'Je weet hoe je een groot project opbreekt in kleine, concrete stappen',
        'Je begrijpt het concept van afhankelijkheden: sommige taken kunnen pas beginnen als andere klaar zijn',
        'Je hebt een realistische planning gemaakt met tijdsinschattingen per taak',
        'Je weet hoe je een plan opslaat in de cloud en bijhoudt tijdens het project',
        'Je hebt geleerd dat een goede blauwdruk de helft van het werk al is',
    ],
};

export default missionBlueprintConfig;
