import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const pitchPerfectConfig: BuilderCanvasConfig = {
    missionId: 'pitch-perfect',
    title: 'Pitch Perfect',
    introEmoji: '🎤',
    introTitle: 'Pitch je project aan de jury',
    introDescription:
        'In deze missie leer je hoe je een overtuigende pitch van 5 minuten maakt voor je meesterproef. Je bouwt de structuur op, oefent je verhaal, verwerkt feedback en staat straks zelfverzekerd voor de jury.',
    introFeatures: [
        'Bouw een pitchstructuur die jury\'s overtuigt',
        'Schrijf een hook die direct de aandacht trekt',
        'Oefen je pitch en verbeter op basis van feedback',
        'Leer omgaan met vragen van de jury',
    ],
    enableChat: true,
    chatRoleId: 'pitch-perfect',
    previewType: 'text-preview',
    steps: [
        {
            id: 'pitch-structuur',
            title: 'Pitchstructuur opbouwen',
            description:
                'Een overtuigende pitch vertelt een verhaal: er is een probleem, jij bent de held met een oplossing, en dit is waarom het lukt. Investeerders en jury\'s hebben duizenden pitches gehoord. Alleen een heldere structuur met een scherpe boodschap valt op.',
            instruction:
                'Schrijf de structuur van je 5-minuten pitch in punt-form. Gebruik deze indeling: 1) Hook (30 sec) — prikkelende vraag, statistiek of scenario, 2) Probleem (45 sec) — maak het probleem voelbaar, 3) Jouw oplossing (90 sec) — wat heb je gebouwd en hoe werkt het?, 4) Resultaat en bewijs (60 sec) — wat heb je bereikt? Wat zijn de testresultaten?, 5) Reflectie (30 sec) — wat leerde je?, 6) Afsluiting (15 sec) — wat vraag je van de jury? Bij elk onderdeel: schrijf de kernzin die je gaat zeggen.',
            tip: 'Een pitch is geen samenvatting van je verslag. Het is een verhaal. Begin niet met "Mijn project gaat over…" — begin met iets dat de jury doet nadenken of lachen.',
            checklistItems: [
                { id: 'zes-onderdelen', label: 'Alle 6 onderdelen zijn ingevuld' },
                { id: 'kernzinnen', label: 'Bij elk onderdeel staat een kernzin' },
                { id: 'hook-sterk', label: 'De hook is prikkelend en begint niet met "Mijn project..."' },
                { id: 'tijdsverdeling', label: 'De tijdsverdeling klopt (samen 5 minuten)' },
            ],
            textPrompt: 'Schrijf je pitch-structuur',
        },
        {
            id: 'uitwerking',
            title: 'Pitch uitschrijven',
            description:
                'Nu schrijf je de volledige pitch uit. Niet als een verslag, maar als een gesproken tekst. Korte zinnen. Actieve taal. Concrete voorbeelden. Jij vertelt een verhaal dat de jury meeneemt.',
            instruction:
                'Schrijf de volledige tekst van je pitch uit (gebruik je structuur als leidraad). Houd rekening met: 1) Gebruik de tweede persoon soms ("Stel je voor dat jij...") voor betrokkenheid, 2) Varieer in zinslengte: korte zinnen geven nadruk, langere zinnen bouwen op, 3) Sluit elk onderdeel af met een brug naar het volgende (bijv. "En dat bracht mij op het idee…"), 4) Aan het einde: vraag of de jury vragen heeft. Schrijf de tekst zoals je hem echt zou uitspreken — niet als schrijftaal.',
            tip: 'Lees je uitgeschreven pitch hardop voor. Als je ergens struikelt of het klinkt onnatuurlijk, herschrijf die zin. Wat lekker leest, klinkt niet altijd lekker.',
            checklistItems: [
                { id: 'volledige-tekst', label: 'De volledige pitch is uitgeschreven' },
                { id: 'bruggen', label: 'Elk onderdeel heeft een brug naar het volgende' },
                { id: 'gesproken-taal', label: 'De tekst is geschreven als gesproken taal, niet als essay' },
                { id: 'vraag-jury', label: 'De afsluiting nodigt de jury uit tot vragen' },
            ],
            textPrompt: 'Schrijf je volledige pitch uit',
        },
        {
            id: 'oefenen',
            title: 'Pitch oefenen en feedback verwerken',
            description:
                'De beste sprekers zijn niet de meest getalenteerde — het zijn de meest geoefende. Elk uur oefenen maakt je beter. Maar oefenen zonder feedback is rondjes draaien.',
            instruction:
                'Beschrijf hoe je je pitch hebt geoefend. Beantwoord: 1) Wie heb je je pitch laten horen? (klasgenoot, ouder, docent), 2) Welke 2 feedbackpunten heb je gekregen? (concreet: wat zeiden ze precies?), 3) Hoe heb je elk feedbackpunt verwerkt in je pitch? (beschrijf de aanpassing), 4) Wat vind jij zelf het moeilijkste onderdeel om te pitchen en waarom?',
            tip: 'Zet je pitch op video. Je ziet dan precies hoe je overkomt: je houding, je tempo, of je oogcontact maakt. Dat is oncomfortabel maar leerzaam.',
            checklistItems: [
                { id: 'geoefend', label: 'Ik heb mijn pitch aan minstens 1 persoon laten horen' },
                { id: 'twee-feedback', label: 'Twee feedbackpunten zijn beschreven (concreet)' },
                { id: 'verwerkt', label: 'Beide feedbackpunten zijn verwerkt in de pitch' },
                { id: 'zelf-reflectie', label: 'Ik heb beschreven wat ik zelf het moeilijkste vind' },
            ],
            textPrompt: 'Beschrijf je oefensessie en feedbackverwerking',
        },
        {
            id: 'jury-vragen',
            title: 'Voorbereiden op jury-vragen',
            description:
                'Na je pitch stelt de jury vragen. Goede presentatoren worden niet verrast — ze hebben zich voorbereid op de moeilijkste vragen. Een goed antwoord is eerlijk, concreet en kort.',
            instruction:
                'Bedenk 4 moeilijke vragen die de jury aan jou zou kunnen stellen over je project. Schrijf bij elke vraag ook je antwoord (max 3 zinnen per antwoord). Kies vragen over: 1) Iets dat niet goed werkte in je project, 2) Een technische keuze die je hebt gemaakt, 3) Wat je anders zou doen als je het opnieuw deed, 4) Wat de volgende stap zou zijn als je meer tijd had. Schrijf tot slot: wat doe je als je een vraag niet weet?',
            tip: 'Zeggen "Dat weet ik niet" is altijd beter dan bluffen. Voeg toe: "Maar hier zou ik beginnen met zoeken: …" Dat laat zien dat je kunt redeneren, ook zonder het perfecte antwoord.',
            checklistItems: [
                { id: 'vier-vragen', label: 'Vier moeilijke jury-vragen zijn bedacht' },
                { id: 'antwoorden', label: 'Bij elke vraag staat een concreet antwoord (max 3 zinnen)' },
                { id: 'niet-weet', label: 'Ik heb beschreven wat ik doe als ik een vraag niet weet' },
            ],
            textPrompt: 'Schrijf je jury-vragen en antwoorden',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Pitch Perfect', color: '#F59E0B' },
        { minScore: 70, emoji: '🎤', title: 'Overtuigend Spreker', color: '#10B981' },
        { minScore: 50, emoji: '🗣️', title: 'Pitch Beginner', color: '#D97757' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#6B6B66' },
    ],
    takeaways: [
        'Je weet hoe je een 5-minuten pitch opbouwt met een bewezen structuur',
        'Je kunt een hook schrijven die de jury direct aanspreekt',
        'Je hebt je pitch geoefend en feedback verwerkt tot een sterkere versie',
        'Je bent voorbereid op moeilijke jury-vragen met eerlijke en concrete antwoorden',
        'Je begrijpt dat pitchen een vaardigheid is die iedereen kan leren met oefening',
    ],
};

export default pitchPerfectConfig;
