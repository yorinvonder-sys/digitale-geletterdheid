import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const videoEditorConfig: BuilderCanvasConfig = {
    missionId: 'video-editor',
    title: 'Video Editor',
    introEmoji: '🎬',
    introTitle: 'Regisseer en monteer een video',
    introDescription:
        'In deze missie leer je hoe een professionele video tot stand komt. Je schrijft een storyboard, maakt een shotlist en ontwerpt een montageplan — precies zoals een echte regisseur dat doet voordat de opname begint.',
    introFeatures: [
        'Ontwerp een storyboard met scènes en cameraposities',
        'Schrijf een shotlist met beschrijvingen per shot',
        'Plan de montage: volgorde, overgangen en muziek',
        'Bedenk een openingsshot die direct de aandacht trekt',
    ],
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Opening shot test: leerling kiest welk eerste beeld kijkers laat blijven kijken.',
        primaryInteraction: 'test-product',
        feedbackMoment: 'Na het openingsshot koppelt feedback doel, doelgroep, storyboard, shotlist en montageplan aan kijkimpact.',
        visualKit: 'maker-canvas',
        evidenceMoment: 'De leerling levert concept, storyboard, shotlist, montageplan en openingsshot als videobewijs.',
        antiBoringRule: 'Video maken start met kijkersimpact en montagekeuze, niet met losse scenes beschrijven.',
        chromeAcceptance: 'Opening-shot start, storyboardstappen en montagebewijs blijven visueel en tekstueel passend op alle vier viewports.',
    },
    enableChat: true,
    chatRoleId: 'video-editor',
    previewType: 'text-preview',
    steps: [
        {
            id: 'concept',
            title: 'Videoconcept bepalen',
            description:
                'Elke goede video heeft een duidelijk doel en een doelgroep. Een promotievideo voor een open dag is anders dan een informatievideo voor leerlingen. Eerst nadenken, dan opnemen.',
            instruction:
                'Kies het onderwerp van je video (bijv. promotievideo voor de open dag, reportage over een schoolevenement). Beschrijf: 1) Het doel van de video (wat wil je dat kijkers doen of voelen na het kijken?), 2) De doelgroep, 3) De duur (max. 60-90 seconden), 4) De toon (formeel, grappig, inspirerend). Schrijf ook je centrale boodschap in één zin.',
            tip: 'Eén heldere centrale boodschap maakt je video sterker dan tien boodschappen tegelijk.',
            checklistItems: [
                { id: 'doel', label: 'Ik heb het doel van de video in één zin beschreven' },
                { id: 'doelgroep-toon', label: 'Doelgroep en toon zijn bepaald' },
                { id: 'centrale-boodschap', label: 'De centrale boodschap staat in één zin' },
            ],
            textPrompt: 'Beschrijf je videoconcept',
        },
        {
            id: 'storyboard',
            title: 'Storyboard schrijven',
            description:
                'Een storyboard is een reeks beschrijvingen (of schetsen) van de scènes in je video. Elke scène beschrijft wat je ziet, hoort en hoe lang die duurt. Film begint niet met de camera, maar op papier.',
            instruction:
                'Schrijf een tekstueel storyboard voor je video met minimaal 5 scènes. Voor elke scène: 1) Wat zie je in beeld? (beschrijving van de shot), 2) Wat hoor je? (dialoog, voice-over of muziek), 3) Hoe lang duurt de scène? (in seconden), 4) Camerahoek (totaalshot, close-up, over-the-shoulder). Begin met een sterke openingsscène die meteen de aandacht trekt.',
            tip: 'De eerste 3 seconden bepalen of mensen blijven kijken. Begin dus niet met een logo of een "Hoi, welkom bij…". Begin direct met actie of een prikkelende vraag.',
            checklistItems: [
                { id: 'vijf-scenes', label: 'Ik heb minimaal 5 scènes beschreven' },
                { id: 'beeld-geluid', label: 'Bij elke scène staat beeld EN geluid beschreven' },
                { id: 'duur', label: 'Bij elke scène staat een duur in seconden' },
                { id: 'camerahoek', label: 'Elke scène heeft een camerahoek' },
            ],
            textPrompt: 'Schrijf je storyboard hier',
        },
        {
            id: 'shotlist',
            title: 'Shotlist maken',
            description:
                'Een shotlist is de praktische checklist op de opnamedag. Elke shot staat erop: wat je opneemt, in welke volgorde, met welk apparaat. Een goede shotlist voorkomt chaos en vergeten opnames.',
            instruction:
                'Maak een shotlist van minimaal 8 shots voor je video. Voor elk shot: 1) Shotnummer, 2) Beschrijving (wat is er in beeld?), 3) Shottype (totaal/medium/close-up), 4) Locatie, 5) Notities (bijv. "geen geluid nodig, wordt met muziek gemonteerd"). Geef ook aan welke shots je bij voorkeur herneemt als back-up.',
            tip: 'Film altijd meer dan je nodig hebt. Monteurs zeggen: "Je kunt niet monteren wat er niet is." Pak van elke shot minimaal 2 takes.',
            checklistItems: [
                { id: 'acht-shots', label: 'Mijn shotlist heeft minimaal 8 shots' },
                { id: 'shottype', label: 'Elk shot heeft een shottype (totaal/medium/close-up)' },
                { id: 'locatie', label: 'Bij elk shot staat de locatie' },
                { id: 'back-up', label: 'Ik heb back-up shots aangeduid' },
            ],
            textPrompt: 'Schrijf je shotlist',
        },
        {
            id: 'montageplan',
            title: 'Montageplan opstellen',
            description:
                'Monteren is het selecteren en samenvoegen van shots tot een vloeiend geheel. Je kiest de volgorde, de overgangen en de muziek. Dit is waar de magie van film echt begint.',
            instruction:
                'Schrijf een montageplan: 1) De definitieve volgorde van je shots (geef shottitels of nummers), 2) Welke overgangstypen je gebruikt (hard cut, dissolve, fade to black) en waarom, 3) Welk type muziek of geluid past bij elke sectie, 4) Waar de pacing versnelt en waar het rustiger wordt. Leg bij elk punt de motivatie uit.',
            tip: 'Minder overgangen = professioneler. Gebruik "hard cuts" (direct knippen) als standaard en gebruik dissolves of fades alleen voor bewuste emotionele momenten.',
            checklistItems: [
                { id: 'volgorde', label: 'Ik heb de definitieve shotsvolgorde bepaald' },
                { id: 'overgangen', label: 'Ik heb overgangstypen gekozen met motivatie' },
                { id: 'muziek', label: 'Muziek of geluid is beschreven per sectie' },
                { id: 'pacing', label: 'Ik heb uitgelegd waar de pacing verandert' },
            ],
            textPrompt: 'Schrijf je montageplan',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Meesterregisseur', color: '#D7C95F' },
        { minScore: 70, emoji: '🎬', title: 'Video Editor', color: '#5F947D' },
        { minScore: 50, emoji: '🎥', title: 'Opnamekandidaat', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Video Editor', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je een videoconcept uitwerkt met doel, doelgroep en centrale boodschap',
        'Je kunt een storyboard schrijven met beeld, geluid en camerahoeken',
        'Je begrijpt hoe een shotlist werkt en waarvoor je hem gebruikt',
        'Je weet wat overgangen doen in een montage en wanneer je ze gebruikt',
        'Je hebt het hele productieproces doorlopen: van concept tot montageplan',
    ],
};

export default videoEditorConfig;
