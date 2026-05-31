import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const digitalStorytellerConfig: BuilderCanvasConfig = {
    missionId: 'digital-storyteller',
    title: 'Digital Storyteller',
    introEmoji: '📖',
    introTitle: 'Schrijf een interactief verhaal',
    introDescription:
        'In deze missie ontwerp je een interactief verhaal waar de lezer zelf keuzes maakt. Je leert hoe je een verhalenstructuur met vertakkingen bouwt — precies zoals in avontuurlijke boeken en games.',
    introFeatures: [
        'Ontwerp een verhaal met vertakkende keuzes',
        'Schrijf meeslepende scènes in digitale stijl',
        'Teken een beslissingsdiagram (flowchart)',
        'Maak een digitale presentatie van je verhaal',
    ],
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Story fork: leerling kiest meteen de eerste keuze die het verhaal echt laat vertakken.',
        primaryInteraction: 'test-product',
        feedbackMoment: 'Na de story fork koppelt feedback setting, personage, flowchart en digitale presentatie aan keuze-impact.',
        visualKit: 'maker-canvas',
        evidenceMoment: 'De leerling bewijst dat keuzes gevolgen hebben via scenes, flowchart en presentatieopzet.',
        antiBoringRule: 'Interactief schrijven draait om keuzes met gevolgen, niet om een lineair verhaal in een digitaal jasje.',
        chromeAcceptance: 'Story fork, flowchart-stappen, tekstinvoer en voortgang blijven leesbaar op desktop, tablet portrait, tablet landscape en mobile.',
    },
    enableChat: true,
    chatRoleId: 'digital-storyteller',
    previewType: 'text-preview',
    steps: [
        {
            id: 'verhaalidee',
            title: 'Verhaalidee en setting bepalen',
            description:
                'Een goed interactief verhaal heeft een setting die de lezer aanspreekt, een hoofdpersoon met een probleem en een keuze die er echt toe doet. De lezer moet het gevoel hebben dat zijn keuze de uitkomst verandert.',
            instruction:
                'Kies een setting voor je verhaal (bijv. toekomstige stad, onderwaterwereld, historisch avontuur). Beschrijf: 1) De wereld en de sfeer in 3-4 zinnen, 2) De hoofdpersoon met naam en één eigenschap, 3) Het beginprobleem of de vraag die het verhaal opstart. Schrijf ook in één zin wat de grote keuze is die de lezer uiteindelijk moet maken.',
            tip: 'De beste interactieve verhalen hebben keuzes die allebei verleidelijk zijn. Als één optie duidelijk beter is, is het eigenlijk geen echte keuze.',
            checklistItems: [
                { id: 'setting', label: 'Ik heb de wereld en sfeer in 3-4 zinnen beschreven' },
                { id: 'personage', label: 'De hoofdpersoon heeft een naam en eigenschap' },
                { id: 'beginprobleem', label: 'Het beginprobleem staat beschreven' },
                { id: 'grote-keuze', label: 'De grote keuze staat in één zin' },
            ],
            textPrompt: 'Beschrijf je verhaalidee en setting',
        },
        {
            id: 'flowchart',
            title: 'Verhalenstructuur uitwerken',
            description:
                'Een interactief verhaal is een boom van beslissingen. Elk keuzemoment splitst het verhaal in twee of meer takken. Zonder een goede structuur raak je verstrikt in eindeloze vertakkingen.',
            instruction:
                'Teken of beschrijf een tekstuele flowchart van je verhaal. Begin met één beginscène. Voeg daarna 2 keuzemomenten toe, elk met 2 opties. Eindig met minimaal 3 mogelijke uitkomsten (endings). Geef elke scène een korte naam (bijv. "De kelder" of "Het mysterieuze bericht"). Beschrijf ook bij elk keuzemoment: wat is de vraag die de lezer krijgt?',
            tip: 'Schrijf je flowchart als een lijst: Scène 1 → Keuze A gaat naar Scène 2a, Keuze B gaat naar Scène 2b. Eenvoudig en overzichtelijk.',
            checklistItems: [
                { id: 'beginscene', label: 'Er is één beginscène beschreven' },
                { id: 'twee-keuzes', label: 'Er zijn 2 keuzemomenten elk met 2 opties' },
                { id: 'drie-endings', label: 'Er zijn minimaal 3 verschillende einduitkomsten' },
                { id: 'scene-namen', label: 'Alle scènes hebben een naam' },
            ],
            textPrompt: 'Beschrijf je verhalenstructuur / flowchart',
        },
        {
            id: 'scène-schrijven',
            title: 'Eerste scènes schrijven',
            description:
                'Nu ga je de tekst schrijven. Interactieve verhalen zijn anders dan boeken: je schrijft in de tweede persoon ("Jij loopt de kamer binnen") zodat de lezer zich de hoofdpersoon voelt. Kort, levendig en actiegericht.',
            instruction:
                'Schrijf de beginscène en één keuze-scène van je verhaal. Gebruik de tweede persoon ("jij" of "je"). De beginscène: minimaal 80 woorden, eindigend met een eerste keuze voor de lezer. De keuze-scène: een van de twee opties uitgewerkt tot minstens 60 woorden. Voeg aan het einde van elke scène de keuze-opties toe als: [KIES: Optie A] of [KIES: Optie B].',
            tip: 'Begin elke scène in medias res — midden in de actie. Niet: "Het was een rustige dag." Wel: "De deur vloog open en..."',
            checklistItems: [
                { id: 'tweede-persoon', label: 'Het verhaal is geschreven in de tweede persoon (jij/je)' },
                { id: 'beginscene-tekst', label: 'De beginscène is minimaal 80 woorden' },
                { id: 'keuze-opties', label: 'De keuze-opties staan duidelijk aan het einde' },
                { id: 'tweede-scene', label: 'Een vervolgscène is uitgewerkt (minimaal 60 woorden)' },
            ],
            textPrompt: 'Schrijf je beginscène en één vervolgscène',
        },
        {
            id: 'digitale-presentatie',
            title: 'Digitale presentatie ontwerpen',
            description:
                'Interactieve verhalen leven op het scherm. Je moet nadenken over hoe de keuzes gepresenteerd worden: knoppen, links, afbeeldingen? Hoe zorg je dat de lezer weet wat te doen zonder instructies te lezen?',
            instruction:
                'Beschrijf hoe je je verhaal digitaal zou presenteren. Kies uit: website met klikbare knoppen, Twine (gratis verhalen-tool), Google Slides met hyperlinks, of een app. Leg uit: 1) Welk platform je zou kiezen en waarom, 2) Hoe de keuzes visueel gepresenteerd worden (knoppen, links, iets anders), 3) Of je afbeeldingen of geluid zou toevoegen, en zo ja: welk type past bij je verhaal.',
            tip: 'Twine (twinery.org) is een gratis tool specifiek voor interactieve verhalen. Je hoeft niet te kunnen programmeren en het resultaat is direct speelbaar in een browser.',
            checklistItems: [
                { id: 'platform', label: 'Ik heb een platform gekozen met motivatie' },
                { id: 'keuze-presentatie', label: 'Ik heb uitgelegd hoe keuzes visueel worden getoond' },
                { id: 'media', label: 'Ik heb benoemd of ik afbeeldingen/geluid gebruik en waarom' },
            ],
            textPrompt: 'Beschrijf je digitale presentatie-aanpak',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Verhalen Architect', color: '#D7C95F' },
        { minScore: 70, emoji: '📖', title: 'Digital Storyteller', color: '#5F947D' },
        { minScore: 50, emoji: '✍️', title: 'Verhalen Beginner', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Verhalenverteller', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je een interactief verhaal structureert met vertakkingen en keuzemomenten',
        'Je kunt een flowchart maken die de verhalenstructuur overzichtelijk weergeeft',
        'Je hebt scènes geschreven in de tweede persoon voor maximale betrokkenheid',
        'Je weet hoe je een interactief verhaal digitaal kunt presenteren',
        'Je begrijpt wat een "echte" keuze is in een verhaal versus een schijnkeuze',
    ],
};

export default digitalStorytellerConfig;
