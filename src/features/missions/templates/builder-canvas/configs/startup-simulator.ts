import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const startupSimulatorConfig: BuilderCanvasConfig = {
    missionId: 'startup-simulator',
    title: 'Startup Simulator',
    introEmoji: '🚀',
    introTitle: 'Bouw een startup van nul tot pitch',
    introDescription:
        'In deze missie ontwikkel je een tech-startup idee van begin tot einde. Je definieert het probleem, ontwerpt het businessmodel, bepaalt de doelgroep en bereidt je pitch voor — zoals echte startupoprichters doen.',
    introFeatures: [
        'Bedenk een tech-startup die een echt probleem oplost',
        'Ontwerp een businessmodel met een verdienmodel',
        'Analyseer de markt en de concurrentie',
        'Schrijf een overtuigende pitch-structuur',
    ],
    enableChat: true,
    chatRoleId: 'startup-simulator',
    previewType: 'text-preview',
    steps: [
        {
            id: 'probleem-oplossing',
            title: 'Probleem en oplossing definiëren',
            description:
                'De meeste startups falen niet omdat de technologie niet werkt, maar omdat ze een probleem oplossen dat niemand heeft. De beste startups beginnen met een pijnpunt dat de founders zelf hebben ervaren.',
            instruction:
                'Beschrijf je startup-idee. Beantwoord: 1) Welk probleem los je op? (Beschrijf het probleem concreet — gebruik een verhaal of situatie), 2) Hoe groot is het probleem? (Hoeveel mensen hebben er last van?), 3) Wat is jouw oplossing? (Beschrijf het product of de dienst in 2 zinnen), 4) Waarom is dit nu het juiste moment? (Welke technologie of trend maakt het mogelijk?)',
            tip: 'Goede startups zijn "painkiller", niet "vitamine". Een painkiller lost een dringend probleem op. Een vitamine is nice-to-have. Investeerders kiezen altijd pijnstillers.',
            checklistItems: [
                { id: 'probleem', label: 'Het probleem is concreet beschreven met een verhaal' },
                { id: 'omvang', label: 'Ik heb geschat hoeveel mensen het probleem hebben' },
                { id: 'oplossing', label: 'De oplossing is beschreven in max 2 zinnen' },
                { id: 'timing', label: 'Ik heb uitgelegd waarom nu het juiste moment is' },
            ],
            textPrompt: 'Beschrijf het probleem en de oplossing',
        },
        {
            id: 'businessmodel',
            title: 'Businessmodel ontwerpen',
            description:
                'Een geweldig idee zonder verdienmodel is een hobby, geen startup. Hoe verdient je bedrijf geld? Abonnementen, eenmalige aankoop, advertenties, commissie? Elk model heeft voor- en nadelen.',
            instruction:
                'Ontwerp het businessmodel van je startup. Beschrijf: 1) Jouw verdienmodel: hoe verdien je geld? (kies één: abonnement, freemium, transactiekosten, advertenties, licenties), 2) Prijsstrategie: wat betaalt een klant per maand/jaar?, 3) Kosten: wat zijn de drie grootste kosten om te beginnen?, 4) Break-even punt: hoeveel betalende klanten heb je nodig om je kosten te dekken? Bereken dit globaal.',
            tip: 'Freemium werkt zo: gratis basisversie + betaalde premium. Spotify, Dropbox, Duolingo gebruiken dit model. Het nadeel: minder dan 5% van gebruikers betaalt uiteindelijk.',
            checklistItems: [
                { id: 'verdienmodel', label: 'Ik heb een verdienmodel gekozen en uitgelegd' },
                { id: 'prijs', label: 'Er staat een concrete prijs beschreven' },
                { id: 'kosten', label: 'De drie grootste kosten zijn benoemd' },
                { id: 'break-even', label: 'Ik heb een globaal break-even punt berekend' },
            ],
            textPrompt: 'Beschrijf je businessmodel',
        },
        {
            id: 'marktanalyse',
            title: 'Markt en concurrentie analyseren',
            description:
                'Geen enkel product bestaat in een vacuüm. Er zijn altijd concurrenten — soms direct, soms indirect. Investeerders vragen altijd: "Wat doen jullie beter dan X?" Zonder antwoord ben je kansloos.',
            instruction:
                'Analyseer de markt voor je startup. Beschrijf: 1) De doelgroep: wie zijn je ideale klanten? (leeftijd, locatie, gedrag), 2) Twee directe concurrenten (producten die hetzelfde probleem oplossen), 3) Jouw unieke voordeel ten opzichte van de concurrentie (USP: Unique Selling Proposition), 4) Een schatting van de marktomvang: hoeveel potentiële klanten zijn er in Nederland?',
            tip: 'Zeg nooit "We hebben geen concurrenten." Dat zegt: "We hebben de markt niet goed onderzocht." Zelfs WhatsApp had concurrenten (SMS, e-mail). Jouw USP is wat je beter doet.',
            checklistItems: [
                { id: 'doelgroep', label: 'De doelgroep is concreet beschreven' },
                { id: 'twee-concurrenten', label: 'Twee concurrenten zijn benoemd met beschrijving' },
                { id: 'usp', label: 'De USP is helder beschreven' },
                { id: 'marktomvang', label: 'Een schatting van de marktomvang is gegeven' },
            ],
            textPrompt: 'Schrijf je marktanalyse',
        },
        {
            id: 'pitch',
            title: 'Pitch structuur schrijven',
            description:
                'Je hebt 3 minuten. De jury is druk. Hoe vertel je in drie minuten waarom jouw startup de moeite waard is? Een goede pitch volgt een bewezen structuur die investeerders meteen snappen.',
            instruction:
                'Schrijf de structuur van je 3-minuten pitch in punten. Gebruik de volgende structuur: 1) Hook (30 sec): een prikkelende vraag of statistiek die het probleem invoelt, 2) Probleem (30 sec): maak het probleem voelbaar, 3) Oplossing (45 sec): laat zien hoe jouw product werkt, 4) Businessmodel (30 sec): hoe verdien je geld?, 5) Traction of plan (30 sec): wat heb je al bereikt of wat zijn de eerste stappen?, 6) Call to action (15 sec): wat vraag je van de jury? Schrijf bij elk onderdeel de kernzin die je zou zeggen.',
            tip: 'Begin NOOIT met "Wij zijn [bedrijfsnaam] en wij..." Dat is saai. Begin met een statistiek of verhaal dat de jury raakt.',
            checklistItems: [
                { id: 'hook', label: 'De hook is een prikkelende vraag of statistiek' },
                { id: 'zes-onderdelen', label: 'Alle 6 pitch-onderdelen zijn uitgewerkt' },
                { id: 'kernzinnen', label: 'Bij elk onderdeel staat een kernzin' },
                { id: 'call-to-action', label: 'Er is een duidelijke call to action' },
            ],
            textPrompt: 'Schrijf je pitch-structuur',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Startup Founder', color: '#D7C95F' },
        { minScore: 70, emoji: '🚀', title: 'Tech Entrepreneur', color: '#5F947D' },
        { minScore: 50, emoji: '💡', title: 'Ideeënmachine', color: '#D97848' },
        { minScore: 25, emoji: '🌱', title: 'Beginnende Ondernemer', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je een pijnpunt identificeert dat de basis vormt voor een succesvolle startup',
        'Je begrijpt hoe verschillende businessmodellen werken en hoe je er één kiest',
        'Je kunt een marktanalyse uitvoeren met doelgroep, concurrenten en USP',
        'Je hebt een 3-minuten pitch-structuur geschreven die investeerders overtuigt',
        'Je ziet hoe idee, businessmodel en pitch samenhangen in een complete startup-visie',
    ],
};

export default startupSimulatorConfig;
