import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const podcastProducerConfig: BuilderCanvasConfig = {
    missionId: 'podcast-producer',
    title: 'Podcast Producer',
    introEmoji: '🎙️',
    introTitle: 'Maak je eigen podcast',
    introDescription:
        'In deze missie leer je hoe je een podcast van begin tot eind produceert. Je kiest een onderwerp, maakt een structuur, schrijft een pakkende intro en bedenkt sterke interviewvragen — net als een echte radiopresentator.',
    introFeatures: [
        'Kies een interessant onderwerp voor jouw doelgroep',
        'Bouw een duidelijke structuur met intro, segmenten en outro',
        'Schrijf een pakkende openingszin die luisteraars pakt',
        'Bedenk open interviewvragen die gesprekken op gang brengen',
    ],
    enableChat: true,
    chatRoleId: 'podcast-producer',
    previewType: 'text-preview',
    steps: [
        {
            id: 'onderwerp',
            title: 'Onderwerp kiezen',
            description:
                'Een goede podcast begint met een scherp onderwerp. Je wilt dat luisteraars direct begrijpen waar jouw podcast over gaat én waarom het voor hén interessant is.',
            instruction:
                'Kies een onderwerp dat jij interessant vindt én dat past bij jouw doelgroep. Denk na: wie gaat er luisteren? Zijn het leeftijdgenoten, leraren, ouders? Wat willen zij weten of horen? Schrijf daarna in 2 à 3 zinnen waarom dit onderwerp de moeite waard is.',
            tip: 'Het beste onderwerp is iets waar jij zelf enthousiast over bent. Dat hoor je terug in je stem.',
            checklistItems: [
                { id: 'onderwerp-gekozen', label: 'Ik heb een concreet onderwerp gekozen' },
                { id: 'doelgroep-bepaald', label: 'Ik weet wie mijn doelgroep is en waarom dit hen interesseert' },
            ],
            textPrompt: 'Beschrijf je podcast in 2-3 zinnen',
        },
        {
            id: 'structuur',
            title: 'Structuur plannen',
            description:
                'Een goede podcast is als een goed verhaal: er is een begin, een midden en een einde. Een heldere structuur helpt jou om rustig te praten en helpt luisteraars om alles te volgen.',
            instruction:
                'Plan de opbouw van jouw podcast. Begin met een korte intro (30-60 seconden) waarin je jezelf en het onderwerp voorstelt. Daarna komen 3 inhoudelijke segmenten — elk met een eigen invalshoek of gast. Sluit af met een outro: een korte samenvatting en een oproep tot actie (reageren, delen, nadenken).',
            tip: 'Geef elk segment een naam, zoals "Het probleem", "De oplossing" en "Jouw mening". Dan weet je altijd wat je gaat zeggen.',
            checklistItems: [
                { id: 'intro-gepland', label: 'Ik heb een intro gepland (wat ga ik zeggen?)' },
                { id: 'drie-segmenten', label: 'Ik heb 3 segmenten bedacht met elk een eigen onderwerp' },
                { id: 'outro-gepland', label: 'Ik heb een outro gepland met een afsluiting' },
            ],
            textPrompt: 'Schrijf je podcast-structuur',
        },
        {
            id: 'intro',
            title: 'Intro schrijven',
            description:
                'De eerste 30 seconden bepalen of iemand blijft luisteren of afzet. Jouw intro moet direct de aandacht grijpen — een sterke openingszin, een verassend feit of een prikkelende vraag.',
            instruction:
                'Schrijf een intro van ongeveer 60-80 woorden. Begin met een hook: iets waardoor de luisteraar meteen nieuwsgierig wordt. Stel jezelf dan kort voor ("Ik ben [naam] en dit is [naam podcast]") en vertel wat er vandaag te horen is. Vermijd: "Hoi, welkom bij mijn podcast, ik ben…" — dat is saai. Verras je luisteraar!',
            tip: 'Begin eens met een vraag ("Wist jij dat…?"), een stelling ("Iedereen denkt dat X, maar…") of een korte anekdote.',
            checklistItems: [
                { id: 'hook-geschreven', label: 'Mijn intro begint met een hook die de aandacht trekt' },
                { id: 'naam-voorgesteld', label: 'Ik heb mezelf en de podcast voorgesteld' },
                { id: 'onderwerp-geintroduceerd', label: 'Ik heb kort verteld wat er vandaag besproken wordt' },
            ],
            textPrompt: 'Schrijf je intro-tekst',
            reflectionQuestion: {
                question: 'Wat is het verschil tussen een intro en een hook in een podcast?',
                options: ['Een hook is altijd langer dan een intro', 'Een hook trekt aandacht, een intro geeft context', 'Er is geen verschil', 'Een intro komt altijd na de hook'],
                correctIndex: 1,
                explanation: 'De hook is een kort, pakkend fragment dat de luisteraar direct boeit (vaak de eerste 15 seconden). De intro geeft daarna context: wie je bent, wat het onderwerp is.',
                bonusPoints: 5,
            },
        },
        {
            id: 'vragen',
            title: 'Interviewvragen bedenken',
            description:
                'Goede interviewvragen zorgen voor levendige gesprekken. De truc: stel open vragen (vragen die beginnen met hoe, wat, waarom, vertel eens) zodat je gast meer dan "ja" of "nee" antwoordt.',
            instruction:
                'Bedenk 5 interviewvragen voor jouw podcast. Minstens 3 moeten open vragen zijn. Voeg bij elke vraag ook een mogelijke vervolgvraag toe (follow-up), die je stelt als het antwoord interessant is maar je meer wilt weten. Voorbeeld van een follow-up: "Wat bedoel je precies met…?" of "Kun je daar een voorbeeld van geven?"',
            tip: 'Vermijd vragen die beginnen met "Ben je…" of "Heb je…" — die krijgen altijd een kort antwoord. Kies voor "Hoe ben je…" of "Wat heeft je gebracht tot…".',
            checklistItems: [
                { id: 'vijf-vragen', label: 'Ik heb 5 interviewvragen geschreven' },
                { id: 'open-vragen', label: 'Minstens 3 vragen zijn open vragen (beginnen met hoe, wat, waarom)' },
                { id: 'follow-ups', label: 'Ik heb voor elke vraag een mogelijke vervolgvraag bedacht' },
            ],
            textPrompt: 'Schrijf je interviewvragen',
        },
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Top Producer',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🎙️',
            title: 'Radio Talent',
            color: '#5F947D',
        },
        {
            minScore: 50,
            emoji: '🎧',
            title: 'Podcast Beginner',
            color: '#D97848',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Beginnende Podcast Maker',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Op weg',
            color: '#445865',
        },
    ],
    takeaways: [
        'Je weet hoe je een duidelijk en interessant podcast-onderwerp kiest',
        'Je begrijpt hoe een goede podcaststructuur eruitziet (intro, segmenten, outro)',
        'Je kunt een pakkende intro schrijven die luisteraars vasthoudt',
        'Je weet het verschil tussen open en gesloten vragen — en wanneer je welke gebruikt',
        'Je hebt een complete opzet voor een echte podcast die je kunt opnemen',
    ],
};
