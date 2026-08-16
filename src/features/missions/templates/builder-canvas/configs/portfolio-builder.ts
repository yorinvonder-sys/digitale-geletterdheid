import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const portfolioBuilderConfig: BuilderCanvasConfig = {
    missionId: 'portfolio-builder',
    title: 'Portfolio Builder',
    introEmoji: '✨',
    introTitle: 'Bouw een digitaal portfolio',
    introDescription:
        'In deze missie stel je een professioneel digitaal portfolio samen dat jouw beste werk uit drie jaar informatica bundelt. Je selecteert projecten, geeft ze context en ontwerpt een presentatie die indruk maakt.',
    introFeatures: [
        'Selecteer je sterkste projecten met onderbouwing',
        'Schrijf reflecties die leren en groeien laten zien',
        'Ontwerp de structuur van je portfolio',
        'Schrijf een makerprofiel met een pseudoniem, initialen of zonder naam',
    ],
    enableChat: true,
    chatRoleId: 'portfolio-builder',
    previewType: 'text-preview',
    steps: [
        {
            id: 'projectselectie',
            title: 'Projecten selecteren en prioriteren',
            description:
                'Een portfolio is geen opbergdoos voor alles wat je ooit hebt gemaakt. Het is een zorgvuldige selectie van je beste en meest representatieve werk. Kwaliteit wint het altijd van kwantiteit.',
            instruction:
                'Selecteer 3 tot 5 projecten uit je drie jaar informatica. Voor elk project: 1) Een projecttitel en een zin die het project beschrijft, 2) Welke vaardigheden je hebt gebruikt (bijv. HTML/CSS, Python, Figma, presenteren), 3) Wat het resultaat was (wat heb je opgeleverd?), 4) Waarom je dit project hebt geselecteerd voor je portfolio (wat maakt het bijzonder?). Rangschik daarna je projecten van "sterkste" naar "minst sterk" en leg uit waarom.',
            tip: 'Kies projecten die verschillende vaardigheden laten zien. Een portfolio met vijf websites is minder indrukwekkend dan een portfolio met een website, een animatie, een onderzoek en een presentatie.',
            checklistItems: [
                { id: 'drie-vijf', label: 'Ik heb 3 tot 5 projecten geselecteerd' },
                { id: 'vaardigheden', label: 'Bij elk project staan de gebruikte vaardigheden' },
                { id: 'resultaat', label: 'Bij elk project staat wat het resultaat was' },
                { id: 'motivatie', label: 'Ik heb uitgelegd waarom elk project is geselecteerd' },
            ],
            textPrompt: 'Schrijf je projectselectie en motivatie',
            evidence: {
                label: 'Bewijs voor je portfolio',
                prompt: 'Noteer een kort, geredigeerd portfoliofragment en leg uit welk leerdoel het laat zien. Deel het alleen via een door je docent goedgekeurde omgeving.',
                placeholder: 'Gebruik alleen een afgeschermd excerpt; verwijder namen, e-mailadressen, foto’s en persoonlijke links.',
                minLength: 45,
            },
        },
        {
            id: 'reflecties',
            title: 'Reflecties schrijven',
            description:
                'Een portfolio zonder reflectie is een foto-album. Reflecties laten zien dat je hebt nagedacht over je leerproces: wat ging goed, wat was moeilijk, wat zou je anders doen? Dat onderscheidt een leerling die doet van een leerling die groeit.',
            instruction:
                'Schrijf voor 2 van je geselecteerde projecten een korte reflectie (elk 60-100 woorden). Gebruik de WWW-structuur: Wat heb je gedaan?, Wat leerde je ervan?, Wat zou je de volgende keer anders doen? Schrijf ook een "groeizin": één zin die de stap beschrijft van hoe je was aan het begin van dit project naar hoe je nu bent.',
            tip: 'Vermijd vage uitspraken als "Ik heb veel geleerd." Schrijf concreet: "Ik leerde dat CSS Grid makkelijker is dan Flexbox voor tweedimensionale layouts." Specifiek = geloofwaardig.',
            checklistItems: [
                { id: 'twee-reflecties', label: 'Ik heb 2 reflecties geschreven' },
                { id: 'www', label: 'Elke reflectie gebruikt de WWW-structuur' },
                { id: 'groeizin', label: 'Elke reflectie heeft een groeizin' },
                { id: 'concreet', label: 'De reflecties zijn concreet, niet vaag' },
            ],
            textPrompt: 'Schrijf je projectreflecties',
        },
        {
            id: 'structuur',
            title: 'Portfolio-structuur ontwerpen',
            description:
                'Een goed portfolio heeft een logische structuur die de lezer leidt. Te veel informatie tegelijk overweldigt. Te weinig informatie laat de lezer met vragen. Goede structuur leidt de lezer van wie je bent naar wat je kunt.',
            instruction:
                'Ontwerp de structuur van je portfolio. Beschrijf: 1) Welke secties heeft je portfolio (bijv. Over mij, Projecten, Vaardigheden, Reflecties), 2) In welke volgorde komen de secties en waarom?, 3) Welke door je docent goedgekeurde omgeving gebruik je? (afgeschermde website, PDF, PowerPoint, Notion of Figma), 4) Welke visuele elementen gebruik je? (kleur en geredigeerde screenshots zonder persoonsgegevens), 5) Wat is het eerste dat een bezoeker ziet als hij je portfolio opent? Deel geen openbare link.',
            tip: 'De eerste indruk telt. Stel jezelf de vraag: als iemand 10 seconden naar je portfolio kijkt, wat moet hij dan weten? Dat is wat je bovenaan zet. Houd je artefacten afgeschermd en deel ze alleen via een door je docent goedgekeurde omgeving.',
            checklistItems: [
                { id: 'secties', label: 'Alle secties zijn beschreven met motivatie voor de volgorde' },
                { id: 'platform', label: 'Het platform is gekozen en gemotiveerd' },
                { id: 'visueel', label: 'Visuele keuzes zijn beschreven' },
                { id: 'eerste-indruk', label: 'Ik heb beschreven wat de bezoeker als eerste ziet' },
            ],
            textPrompt: 'Beschrijf de structuur van je portfolio',
        },
        {
            id: 'persoonlijk-profiel',
            title: 'Persoonlijk profiel schrijven',
            description:
                'Het "Over mij"-gedeelte is het moeilijkste om te schrijven — maar ook het belangrijkste. Het is de persoonlijke handshake met de lezer. Een goed profiel is eerlijk, specifiek en laat zien wie jij bent als maker.',
            instruction:
                'Schrijf een makerprofiel van 80-120 woorden voor je portfolio. Gebruik een pseudoniem, initialen of geen naam. Neem op: 1) Welke digitale vaardigheden je hebt ontwikkeld, 2) Wat jou drijft als maker of leerling (wat vind je leuk of interessant aan technologie?), 3) Een niet-identificerende vooruitblik op interesses voor later. Vraag of vermeld geen contactgegevens, foto, persoonlijke link, school, klas, leerjaar, richting of herleidbare details. Schrijf in de eerste persoon en vermijd clichés als "Ik ben een harde werker."',
            tip: 'Een goed profiel eindigt met iets memorabels: een doel, een drijfveer, of een interessant feit zonder persoonsgegevens. Houd het profiel afgeschermd en deel het alleen via een door je docent goedgekeurde omgeving.',
            checklistItems: [
                { id: 'profiel-lengte', label: 'Het profiel is 80-120 woorden' },
                { id: 'vaardigheden', label: 'Digitale vaardigheden zijn concreet benoemd' },
                { id: 'drijfveer', label: 'Mijn drijfveer als maker is beschreven' },
                { id: 'vooruitblik', label: 'Er is een vooruitblik naar de toekomst' },
            ],
            textPrompt: 'Schrijf je persoonlijk profiel',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Portfolio Perfectionist', color: '#e1ff01' },
        { minScore: 70, emoji: '✨', title: 'Digital Maker', color: '#202023' },
        { minScore: 50, emoji: '📁', title: 'Portfolio Starter', color: '#ff3c21' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Portfolio Bouwer', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je weet hoe je je beste projecten selecteert en prioriteert voor een portfolio',
        'Je kunt zinvolle reflecties schrijven die groei en leerproces laten zien',
        'Je hebt een doordachte portfoliostructuur ontworpen die de lezer begeleidt',
        'Je hebt een privacyveilig makerprofiel geschreven dat jouw werk als maker neerzet',
        'Je begrijpt waarom een portfolio meer is dan een verzameling werk — het is een verhaal over wie jij bent',
    ],
};

export default portfolioBuilderConfig;
