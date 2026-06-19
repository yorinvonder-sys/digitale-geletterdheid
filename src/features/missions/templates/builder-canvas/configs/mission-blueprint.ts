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
                'Beschrijf je eindproject in 3 tot 5 zinnen. Beantwoord: 1) Wat ga je maken?, 2) Voor wie is het?, 3) Wat is het coolste of meest uitdagende eraan? Geef je project ook een naam. Schrijf daarna in één zin op wanneer je "klaar" bent — dat is je definitie van Done. Je kiest zelf het onderwerp, maar je project moet aansluiten bij een vaardigheid of concept dat je dit jaar leerde — uit Periode 1 (digitale tools, cloud), Periode 2 (AI & maken) of Periode 3 (digitaal burgerschap). Beschrijf welke vaardigheid je gaat gebruiken.',
            tip: 'Een project zonder duidelijk eindpunt is als een reis zonder bestemming. Schrijf je definitie van Done op en hang hem ergens waar je hem elke sessie ziet.',
            checklistItems: [
                { id: 'beschrijving', label: 'Ik heb mijn project beschreven in 3-5 zinnen' },
                { id: 'naam', label: 'Mijn project heeft een naam' },
                { id: 'done', label: 'Ik heb in één zin beschreven wanneer ik "klaar" ben' },
                { id: 'dg-link', label: 'Ik heb beschreven welke vaardigheid uit P1, P2 of P3 mijn project gebruikt' },
            ],
            textPrompt: 'Beschrijf je project en definitie van Done',
            reflectionQuestion: {
                question: 'Welke "definitie van Done" is goed?',
                options: [
                    'Het project is af als ik het leuk vind',
                    'Het project is af als ik er genoeg tijd in heb gestopt',
                    'Het project is af als alle functies werken die ik in mijn omschrijving noemde',
                    'Het project is af als de tijd op is',
                ],
                correctIndex: 2,
                bonusPoints: 5,
                explanation:
                    'Een goede definitie van Done is controleerbaar door iemand anders — niet afhankelijk van hoe jij je voelt.',
            },
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
            reflectionQuestion: {
                question: 'Je mag AI als copiloot gebruiken bij je project. Wat hoort daar WEL bij?',
                options: [
                    'AI schrijft mijn hele eindproduct en ik lever het in als eigen werk',
                    'Ik gebruik AI om te brainstormen of mijn tekst te verbeteren, maar ik beslis zelf',
                    'Ik mag AI helemaal niet gebruiken voor schoolwerk',
                    'Ik kopieer AI-antwoorden zonder ze te lezen',
                ],
                correctIndex: 1,
                bonusPoints: 5,
                explanation:
                    'AI als copiloot versterkt jouw denken — jij blijft de baas over het eindresultaat. AI als vervanger is plagiaat.',
            },
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
            reflectionQuestion: {
                question: '"Taak X kan pas beginnen als taak Y klaar is." Hoe heet dit?',
                options: [
                    'Een tijdsinschatting',
                    'Een afhankelijkheid',
                    'Een mijlpaal',
                    'Een definitie van Done',
                ],
                correctIndex: 1,
                bonusPoints: 5,
                explanation:
                    'Dat is een afhankelijkheid. Je kunt een video pas monteren als je hebt opgenomen — de volgorde van je taken hangt daarvan af.',
            },
        },
        {
            id: 'opslaan',
            title: 'Plan opslaan in de cloud',
            description:
                'Een planning die alleen in je hoofd zit, bestaat niet. Een planning in een document dat je kwijtraakt ook bijna niet. De cloud zorgt dat je plan altijd bereikbaar is — ook als je computer kapotgaat.',
            instruction:
                'Sla je projectplan nu écht op in de cloud — net als in Cloud Commander. 1) Open OneDrive. 2) Maak een nieuwe map met de naam "P4-Eindproject". 3) Sla je takenlijst en volgorde op als Word-bestand met de naam Voornaam_Achternaam_Blauwdruk.docx. 4) Maak een deellink voor je docent en plak die hieronder in het tekstvak.',
            tip: 'Google Docs en OneDrive slaan automatisch op. Geen bestand meer verloren door een crash. Kies altijd cloud boven lokale opslag voor schoolprojecten.',
            checklistItems: [
                { id: 'map-aangemaakt', label: 'Ik heb de map "P4-Eindproject" aangemaakt in OneDrive' },
                { id: 'document-opgeslagen', label: 'Mijn blauwdruk staat opgeslagen als Voornaam_Achternaam_Blauwdruk.docx' },
                { id: 'link-gemaakt', label: 'Ik heb een deellink voor mijn docent gemaakt' },
                { id: 'link-geplakt', label: 'Ik heb de deellink hieronder geplakt' },
            ],
            textPrompt: 'Plak hier je OneDrive-deellink',
            minTextLength: 30,
            reflectionQuestion: {
                question: 'Je deelt je plan via een OneDrive-link in plaats van als e-mailbijlage. Wat is het voordeel?',
                options: [
                    'Een link is kleiner qua bestandsgrootte',
                    'Via een link ziet de ontvanger altijd de meest recente versie',
                    'E-mailbijlagen zijn verboden op school',
                    'Een link werkt ook zonder internet',
                ],
                correctIndex: 1,
                bonusPoints: 5,
                explanation:
                    'Precies — dit leerde je in Cloud Commander. Een deellink toont altijd de live versie; pas je iets aan, dan hoef je geen nieuwe link te sturen.',
            },
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Projectmanager', color: '#e1ff01' },
        { minScore: 70, emoji: '🗺️', title: 'Planner', color: '#202023' },
        { minScore: 50, emoji: '📋', title: 'Takenlijst Maker', color: '#ff3c21' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Planner', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je weet hoe je een groot project opbreekt in kleine, concrete stappen',
        'Je begrijpt het concept van afhankelijkheden: sommige taken kunnen pas beginnen als andere klaar zijn',
        'Je hebt een realistische planning gemaakt met tijdsinschattingen per taak',
        'Je weet hoe je een plan opslaat in de cloud en bijhoudt tijdens het project',
        'Je hebt bewezen dat je een OneDrive-map kunt aanmaken, een bestand correct kunt benoemen en een deellink kunt delen — vaardigheden uit Periode 1.',
    ],
};

export default missionBlueprintConfig;
