import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const memeMachineConfig: BuilderCanvasConfig = {
    missionId: 'meme-machine',
    title: 'Meme Machine',
    introEmoji: '😂',
    introTitle: 'Maak content die viral gaat',
    introDescription:
        'In deze missie ontdek je waarom memes miljoenen mensen bereiken terwijl dure reclames worden weggesklikt. Je analyseert wat viraliteit veroorzaakt en ontwerpt je eigen content die potentie heeft om te delen.',
    introFeatures: [
        'Analyseer populaire meme-formats en wat ze werken',
        'Ontdek de psychologie achter virale content',
        'Ontwerp je eigen meme met een duidelijke boodschap',
        'Leer het verschil tussen humor en schadelijke content',
    ],
    enableChat: true,
    chatRoleId: 'meme-machine',
    previewType: 'text-preview',
    steps: [
        {
            id: 'meme-analyse',
            title: 'Meme-formats analyseren',
            description:
                'Memes zijn geen toeval. Elk format heeft een vaste structuur die je herkent: de "Distracted Boyfriend", de "Drake"-meme, het "This is Fine"-hondnetje. Begrijpen waarom een format werkt, is de eerste stap naar het maken van goede content.',
            instruction:
                'Kies 2 populaire meme-formats die je kent. Beschrijf voor elk: 1) Hoe het format eruitziet (twee vakken, vergelijking, tekst boven/onder), 2) Welke emotie of situatie het uitdrukt, 3) Waarom het goed werkt (herkenbaarheid, humor, contrast). Leg ook uit wat het verschil is tussen een meme die mensen laat lachen en een meme die iemand kwetst.',
            tip: 'Goede memes zijn herkenbaar voor een grote groep mensen. Ze zeggen: "Ja, dit herken ik!" Dat gevoel van herkenning is wat mensen doet delen.',
            checklistItems: [
                { id: 'twee-formats', label: 'Ik heb 2 meme-formats beschreven' },
                { id: 'emotie', label: 'Bij elk format staat welke emotie het uitdrukt' },
                { id: 'waarom-werkt', label: 'Ik heb uitgelegd waarom elk format werkt' },
                { id: 'grens', label: 'Ik heb het verschil tussen humor en kwetsende content benoemd' },
            ],
            textPrompt: 'Schrijf je meme-analyse hier',
        },
        {
            id: 'viraliteit',
            title: 'De psychologie van viraliteit',
            description:
                'Waarom delen mensen content? Onderzoek laat zien dat mensen content sharen als het een sterke emotie oproept (lachen, verrassing, boosheid), als het past bij hun identiteit, of als het nieuws is dat anderen moeten weten.',
            instruction:
                'Beschrijf de 3 redenen waarom mensen content delen (hint: emotie, identiteit, informatie). Geef bij elke reden een echt voorbeeld van content die om die reden viral is gegaan. Leg daarna uit welke reden het sterkst is en waarom. Gebruik dit als basis voor jouw eigen contentidee.',
            tip: 'Content die boosheid of verbazing oproept gaat statistisch het vaakst viral — maar content die laat lachen blijft langer positief geassocieerd met degene die het deelt.',
            checklistItems: [
                { id: 'drie-redenen', label: 'Ik heb 3 redenen voor delen beschreven' },
                { id: 'voorbeelden', label: 'Bij elke reden staat een echt voorbeeld' },
                { id: 'sterkste-reden', label: 'Ik heb uitgelegd welke reden het sterkst is en waarom' },
            ],
            textPrompt: 'Beschrijf de psychologie van viraliteit',
        },
        {
            id: 'eigen-meme',
            title: 'Eigen meme ontwerpen',
            description:
                'Nu ga je zelf content maken. Een goede meme heeft een duidelijk format, een herkenbare situatie en een verrassing in de "punch". Je hoeft niets te tekenen — beschrijf je meme in woorden.',
            instruction:
                'Ontwerp je eigen meme of virale post. Beschrijf: 1) Welk format je gebruikt, 2) Wat de afbeelding of boven-tekst toont, 3) Wat de ondertekst of punchline is, 4) Voor welke doelgroep het is, 5) Waarom jij denkt dat dit gedeeld zou worden. Maak ook een alternatieve versie die bewust NIET werkt — en leg uit waarom niet.',
            tip: 'De beste meme-punchlines zijn kort en onverwacht. Als je de punchline moet uitleggen, werkt hij niet.',
            checklistItems: [
                { id: 'format-gekozen', label: 'Ik heb een concreet format gekozen' },
                { id: 'inhoud-beschreven', label: 'Ik heb afbeelding en tekst beschreven' },
                { id: 'doelgroep', label: 'Ik heb de doelgroep benoemd' },
                { id: 'alternatief', label: 'Ik heb een niet-werkende versie gemaakt met uitleg' },
            ],
            textPrompt: 'Beschrijf je meme-ontwerp',
        },
        {
            id: 'verantwoord',
            title: 'Verantwoord content maken',
            description:
                'Met bereik komt verantwoordelijkheid. Content die viral gaat kan ook mensen kwetsen, misinformatie verspreiden of iemands reputatie beschadigen. Content creators denken na over de impact van wat ze maken.',
            instruction:
                'Beantwoord de volgende vragen: 1) Kun je je eigen meme-ontwerp bekijken vanuit het perspectief van iemand die er misschien kwetsbaar voor is? Wat zou die persoon voelen?, 2) Hoe kun je humor maken zonder een specifieke groep mensen te targeten?, 3) Noem 1 richtlijn die jij zou gebruiken om te bepalen of content "oké" is om te posten.',
            tip: 'Vraag jezelf af: "Zou ik dit ook willen delen als mijn naam eronder staat en mijn oma het ziet?" Die test werkt echt.',
            checklistItems: [
                { id: 'perspectief', label: 'Ik heb nagedacht vanuit het perspectief van iemand die geraakt wordt' },
                { id: 'inclusief', label: 'Ik heb uitgelegd hoe je humor maakt zonder groepen te targeten' },
                { id: 'richtlijn', label: 'Ik heb 1 persoonlijke richtlijn voor verantwoord posten geformuleerd' },
            ],
            textPrompt: 'Schrijf je reflectie op verantwoorde content',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Viral Mastermind', color: '#e1ff01' },
        { minScore: 70, emoji: '😂', title: 'Meme Maker', color: '#202023' },
        { minScore: 50, emoji: '👍', title: 'Content Creator', color: '#ff3c21' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Content Maker', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je weet hoe meme-formats werken en waarom ze zo herkenbaar zijn',
        'Je begrijpt de drie psychologische redenen waarom mensen content delen',
        'Je kunt een eigen meme-concept ontwerpen en onderbouwen',
        'Je kent het verschil tussen humor die verbindt en humor die uitsluit',
        'Je hebt nagedacht over verantwoord content maken op social media',
    ],
};

export default memeMachineConfig;
