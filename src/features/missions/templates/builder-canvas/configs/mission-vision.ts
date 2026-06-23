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
                'Beschrijf de visie van je project of idee. Beantwoord: 1) Wat is jouw droom voor dit project? (beschrijf het alsof het al bestaat), 2) Welk probleem lost jouw idee op?, 3) Wie profiteert ervan en hoe verandert hun leven?, 4) Schrijf een visiestelling (= één zin die samenvat waar jij in gelooft) in de vorm: "Wij geloven in een wereld waar [jouw droom] werkelijkheid is." Schrijf daarna 3 kernwaarden (= woorden die uitstralen wat jouw project belangrijk vindt, bijv. eerlijk, creatief, duurzaam).',
            tip: 'De beste visies zijn concreet maar ambitieus. "Elke leerling heeft toegang tot kwalitatief onderwijs, waar ook ter wereld" is concreter dan "beter onderwijs". Maak het voelbaar.',
            checklistItems: [
                { id: 'droom', label: 'De droom is beschreven in tegenwoordige tijd (alsof het al bestaat)' },
                { id: 'visiestelling', label: 'Er is een visiestelling in één zin' },
                { id: 'drie-waarden', label: 'Drie kernwaarden zijn geformuleerd' },
            ],
            textPrompt: 'Schrijf je visie en kernwaarden',
            reflectionQuestion: {
                question: 'Wat hebben een visiestelling en een goede AI-prompt gemeen?',
                options: [
                    'Niets — het een gaat over mensen, het ander over AI',
                    'Allebei: hoe duidelijker en specifieker, hoe beter de ander je begrijpt',
                    'Een visie moet altijd langer zijn dan een prompt',
                    'Alleen prompts moeten kort zijn',
                ],
                correctIndex: 1,
                bonusPoints: 5,
                explanation:
                    'Of je nu een AI aanstuurt of een publiek inspireert: duidelijkheid en specificiteit bepalen of je boodschap overkomt.',
            },
        },
        {
            id: 'moodboard',
            title: 'Moodboard maken',
            description:
                'Een moodboard is een visuele verzameling van beelden, kleuren en stijlen die de sfeer van je idee weergeven. Designers gebruiken moodboards om anderen te laten voelen wat ze zelf zien.',
            instruction:
                'Maak nu écht een moodboard — niet alleen beschrijven. 1) Kies je platform: Canva, Pinterest of PowerPoint. 2) Voeg minimaal 5 beelden toe die de sfeer van jouw project uitstralen. 3) Kies een kleurenpalet van 3 kleuren en schrijf er één zin bij waarom deze kleuren passen. 4) Benoem het gevoel van je moodboard in precies 2 woorden. 5) Sla je moodboard op in de map "P4-Eindproject" in OneDrive en maak een deellink. Plak die link hieronder.',
            tip: 'Een goed moodboard vertelt hetzelfde verhaal als je visie — maar dan zonder woorden. Als iemand je moodboard ziet zonder uitleg, moet hij de juiste sfeer voelen.',
            checklistItems: [
                { id: 'beelden', label: 'Mijn moodboard heeft minimaal 5 beelden' },
                { id: 'kleuren', label: 'Ik heb een kleurenpalet van 3 kleuren gekozen met motivatie' },
                { id: 'gevoel', label: 'Het gevoel van mijn moodboard is in 2 woorden benoemd' },
                { id: 'link-geplakt', label: 'Ik heb het moodboard opgeslagen in OneDrive en de link geplakt' },
            ],
            textPrompt: 'Plak hier de link naar je moodboard',
            minTextLength: 30,
            reflectionQuestion: {
                question: 'Hoe gebruik je AI het beste om beelden voor je moodboard te vinden?',
                options: [
                    '"Geef me afbeeldingen" — kort en simpel',
                    '"Zoek foto\'s" — minder woorden werkt sneller',
                    '"Geef me 5 foto\'s van [onderwerp] met een [sfeer]-gevoel voor een moodboard over [mijn project]" — met context en specificiteit',
                    'AI kan geen beelden zoeken, dus prompten helpt niet',
                ],
                correctIndex: 2,
                bonusPoints: 5,
                explanation:
                    'Duidelijkheid + specificiteit + context = betere prompt. Dat leerde je in Prompt Perfectionist.',
            },
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
            reflectionQuestion: {
                question: 'Slide Specialist-regel: hoeveel bullets per slide is ideaal?',
                options: [
                    '1 bullet',
                    '3 tot 5 korte punten',
                    '8 punten zodat alles erop staat',
                    'Geen bullets, alleen beeld',
                ],
                correctIndex: 1,
                bonusPoints: 5,
                explanation:
                    'Maximaal 3 tot 5 korte punten — de slide ondersteunt jouw verhaal, het publiek luistert naar jou.',
            },
        },
        {
            id: 'pitch-schrijven',
            title: 'Visie pitchen in 2 minuten',
            description:
                'Je visie pitchen (= een korte, overtuigende presentatie geven) is anders dan je plan uitleggen. Een pitch is een verhaal dat mensen enthousiast maakt. Het gaat niet om feiten — het gaat om gevoel, richting en geloof.',
            instruction:
                'Schrijf een 2-minuten pitch voor jouw visie. Gebruik deze structuur: 1) Open met een vraag of beeld dat het probleem voelbaar maakt (30 sec), 2) Beschrijf jouw droom-oplossing (45 sec), 3) Vertel één concreet voorbeeld (30 sec), 4) Sluit af met een uitnodiging aan je publiek (15 sec). Schrijf als gesproken woord — kort en krachtig.',
            tip: 'Een visie-pitch eindigt niet met "zijn er nog vragen?" maar met een uitnodiging: "Ik zoek mensen die dit mee willen bouwen" of "Ik wil weten: welk deel spreekt jou het meest aan?"',
            checklistItems: [
                { id: 'vier-onderdelen', label: 'De pitch heeft 4 onderdelen in de juiste volgorde' },
                { id: 'gesproken-taal', label: 'De tekst is gesproken taal, niet schrijftaal' },
                { id: 'uitnodiging', label: 'De pitch eindigt met een uitnodiging, niet een vraag' },
                { id: 'twee-minuten', label: 'De pitch past in 2 minuten (ca. 250-300 woorden)' },
            ],
            textPrompt: 'Schrijf je 2-minuten visie-pitch',
        },
        {
            id: 'slides-bouwen',
            title: 'Presentatie bouwen in PowerPoint',
            description:
                'Nu je pitch klaar is, bouw je de bijbehorende slides écht in PowerPoint. Goede slides ondersteunen wat jij zegt — ze vervangen jou niet.',
            instruction:
                'Open PowerPoint en maak een presentatie van 5 slides. Kies een thema via het tabblad Ontwerp dat bij jouw visiestelling past. Zorg dat elke slide maximaal 5 bullets heeft. Sla het bestand op in de map "P4-Eindproject" in OneDrive en plak de bestandslink hieronder.',
            checklistItems: [
                { id: 'slides-opgeslagen', label: 'Mijn 5 PowerPoint-slides zijn opgeslagen in de map "P4-Eindproject" in OneDrive' },
            ],
            textPrompt: 'Plak hier de link naar je PowerPoint in OneDrive',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Visionair', color: '#e1ff01' },
        { minScore: 70, emoji: '💡', title: 'Ideeënspreker', color: '#202023' },
        { minScore: 50, emoji: '🎨', title: 'Moodboard Maker', color: '#ff3c21' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Visionair', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je weet hoe je een visie formuleert die anderen inspireert en meeneemt',
        'Je kunt een moodboard beschrijven dat de sfeer en stijl van een idee visualiseert',
        'Je hebt presentatieslides ontworpen die jouw boodschap versterken zonder het podium te stelen',
        'Je hebt een 2-minuten pitch geschreven die gevoel en richting overbrengt',
        'Je hebt bewezen dat je de Slide Specialist-regels kunt toepassen: max 5 bullets per slide, een Ontwerp-thema kiezen en slides opslaan in de cloud — vaardigheden uit Periode 1.',
    ],
};

export default missionVisionConfig;
