import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const missionVisionConfig: BuilderCanvasConfig = {
    missionId: 'mission-vision',
    title: 'De Visie',
    introEmoji: '💡',
    introTitle: 'Visualiseer je droom',
    introDescription:
        'In deze missie leer je hoe je een idee zichtbaar maakt voor anderen. Je maakt een moodboard en bouwt een pitch-presentatie met PowerPoint — zodat mensen in jouw idee gaan geloven.',
    introFeatures: [
        'Verwoord je visie in heldere kernboodschappen',
        'Maak een moodboard met sfeer en stijl',
        'Ontwerp slides die jouw idee uitstralen',
        'Presenteer je visie overtuigend en beknopt',
    ],
    enableChat: true,
    chatRoleId: 'mission-vision',
    previewType: 'text-preview',
    steps: [
        {
            id: 'visie-formuleren',
            title: 'Visie in woorden vangen',
            description:
                'Een visie is meer dan een plan. Het is een beeld van hoe jij wilt dat de wereld (of jouw project) eruitziet in de toekomst. Een sterke visie inspireert andere mensen om mee te doen.',
            instruction:
                'Beschrijf de visie van je project of idee. Beantwoord: 1) Wat is jouw droom voor dit project? (beschrijf het alsof het al bestaat), 2) Welk probleem lost jouw idee op?, 3) Wie profiteert ervan en hoe verandert hun leven?, 4) Schrijf een "visiestelling" in één zin: "Wij geloven in een wereld waar [jouw droom] werkelijkheid is." Schrijf daarna 3 kernwaarden die jouw project uitstraalt (bijv. eerlijk, creatief, duurzaam).',
            tip: 'De beste visies zijn concreet maar ambitieus. "Elke leerling heeft toegang tot kwalitatief onderwijs, waar ook ter wereld" is concreter dan "beter onderwijs". Maak het voelbaar.',
            checklistItems: [
                { id: 'droom', label: 'De droom is beschreven in tegenwoordige tijd (alsof het al bestaat)' },
                { id: 'visiestelling', label: 'Er is een visiestelling in één zin' },
                { id: 'drie-waarden', label: 'Drie kernwaarden zijn geformuleerd' },
            ],
            textPrompt: 'Schrijf je visie en kernwaarden',
        },
        {
            id: 'moodboard',
            title: 'Moodboard maken',
            description:
                'Een moodboard is een visuele verzameling van beelden, kleuren en stijlen die de sfeer van je idee weergeven. Designers gebruiken moodboards om anderen te laten voelen wat ze zelf zien.',
            instruction:
                'Beschrijf je moodboard in woorden (je hoeft niets te tekenen). Beschrijf: 1) 3 tot 5 soorten beelden die je zou opnemen en waarom (bijv. "foto van jongeren die samenwerken — laat de sfeer van samenwerking zien"), 2) Het kleurenpalet: welke kleuren passen bij de sfeer van jouw idee?, 3) Het gevoel dat je wilt overbrengen met het moodboard (in 2 woorden), 4) Welk platform je gebruikt om het moodboard te maken (Canva, Pinterest, PowerPoint, Google Slides).',
            tip: 'Een goed moodboard vertelt hetzelfde verhaal als je visie — maar dan zonder woorden. Als iemand je moodboard ziet zonder uitleg, moet hij de juiste sfeer voelen.',
            checklistItems: [
                { id: 'beelden', label: 'Ik heb 3-5 soorten beelden beschreven met motivatie' },
                { id: 'kleuren', label: 'Het kleurenpalet is beschreven' },
                { id: 'gevoel', label: 'Het gevoel van het moodboard is in 2 woorden beschreven' },
                { id: 'platform', label: 'Ik heb een platform gekozen voor het moodboard' },
            ],
            textPrompt: 'Beschrijf je moodboard',
        },
        {
            id: 'slides-ontwerpen',
            title: 'Presentatieslides ontwerpen',
            description:
                'Een presentatie die jouw visie uitstraalt is anders dan een standaard schoolpresentatie. Minder tekst, meer beeld. Elke slide vertelt één ding. De slide ondersteunt wat jij zegt — hij vervangt jou niet.',
            instruction:
                'Ontwerp een presentatie van 5 slides voor jouw visie. Beschrijf voor elke slide: 1) De slide-titel (max 5 woorden), 2) Het centrale beeld of element (wat domineert de slide?), 3) Maximaal 3 bulletpoints of de ene zin die op de slide staat, 4) Wat jij erbij zegt (de boodschap die niet op de slide staat). Geef ook aan welk design-principe je toepast: minder is meer, contrast, uitlijning of herhaling.',
            tip: 'De beste presentaties hebben weinig tekst op de slides. Alles wat je van een slide kunt weghalen zonder dat de boodschap verloren gaat — weghalen.',
            checklistItems: [
                { id: 'vijf-slides', label: 'Ik heb 5 slides beschreven' },
                { id: 'per-slide', label: 'Elke slide heeft een titel, beeld, tekst en gesproken boodschap' },
                { id: 'min-tekst', label: 'Elke slide heeft maximaal 3 bulletpoints of 1 zin' },
                { id: 'design', label: 'Een design-principe is benoemd' },
            ],
            textPrompt: 'Beschrijf je presentatie-slides',
        },
        {
            id: 'pitchen',
            title: 'Visie pitchen in 2 minuten',
            description:
                'Je visie pitchen is anders dan je plan uitleggen. Een pitch is een verhaal dat mensen enthousiast maakt. Het gaat niet om feiten — het gaat om gevoel, richting en geloof.',
            instruction:
                'Schrijf een 2-minuten pitch voor jouw visie. Gebruik deze structuur: 1) Open met een vraag of beeld dat het probleem voelbaar maakt (30 sec), 2) Beschrijf jouw droom-oplossing en wat die verandert (45 sec), 3) Vertel één concreet voorbeeld of verhaal dat jouw visie laat leven (30 sec), 4) Sluit af met een uitnodiging: wat wil je van je publiek? (15 sec). Schrijf de tekst als gesproken woord — kort en krachtig.',
            tip: 'Een visie-pitch eindigt niet met "zijn er nog vragen?" maar met een uitnodiging: "Ik zoek mensen die dit mee willen bouwen" of "Ik wil weten: welk deel spreekt jou het meest aan?"',
            checklistItems: [
                { id: 'vier-onderdelen', label: 'De pitch heeft 4 onderdelen in de juiste volgorde' },
                { id: 'gesproken-taal', label: 'De tekst is gesproken taal, niet schrijftaal' },
                { id: 'uitnodiging', label: 'De pitch eindigt met een uitnodiging, niet een vraag' },
                { id: 'twee-minuten', label: 'De pitch past in 2 minuten (ca. 250-300 woorden)' },
            ],
            textPrompt: 'Schrijf je 2-minuten visie-pitch',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Visionair', color: '#F59E0B' },
        { minScore: 70, emoji: '💡', title: 'Ideeënspreker', color: '#10B981' },
        { minScore: 50, emoji: '🎨', title: 'Moodboard Maker', color: '#D97757' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Visionair', color: '#8B5CF6' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#6B6B66' },
    ],
    takeaways: [
        'Je weet hoe je een visie formuleert die anderen inspireert en meeneemt',
        'Je kunt een moodboard beschrijven dat de sfeer en stijl van een idee visualiseert',
        'Je hebt presentatieslides ontworpen die jouw boodschap versterken zonder het podium te stelen',
        'Je hebt een 2-minuten pitch geschreven die gevoel en richting overbrengt',
        'Je begrijpt dat visie presenteren een vaardigheid is die los staat van het idee zelf — en net zo belangrijk',
    ],
};

export default missionVisionConfig;
