import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'digital-rights-defender',
    title: 'Digital Rights Defender',
    introEmoji: '🛡️',
    introTitle: 'Digital Rights Defender',
    introDescription:
        'Je school verzamelt gegevens via apps, camera\'s en leerlingvolgsystemen. Maar welke rechten heb jij eigenlijk? Debatteer mee over de grenzen van dataverzameling op school.',
    missionGoal: {
        primaryGoal:
            'Onderzoek welke data een school mag verzamelen en verdedig digitale rechten van leerlingen.',
        criteria: {
            type: 'rounds-complete',
            description:
                'Je leest perspectieven, kiest positie, bouwt argumenten en reflecteert op privacygrenzen.',
        },
        evidence:
            'Je standpunt verbindt een recht, risico of regel aan een concrete schoolpraktijk.',
    },
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Rights emergency: leerling kiest direct welk digitaal recht bescherming nodig heeft.',
        primaryInteraction: 'defend-position',
        feedbackMoment: 'Na de rechtenkeuze koppelt feedback dataminimalisatie, toestemming of inzage aan een schoolpraktijk.',
        visualKit: 'debate-dilemma',
        evidenceMoment: 'De leerling verdedigt digitale rechten met concrete data, schoolcontext en privacygrenzen.',
        antiBoringRule: 'Privacy wordt een noodzaak-case met leerlingrechten, niet een losse AVG-begrippenronde.',
        chromeAcceptance: 'Rechtenkeuze, privacycopy, stakeholderkaarten en argumentinput blijven waardig en responsive op alle vier viewports.',
    },
    introFeatures: [
        'Kies eerst welk digitaal recht acuut is',
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    openingChoice: {
        title: 'Rights emergency',
        description:
            'Een schoolapp vraagt meer data dan leerlingen verwachten. Jij kiest eerst welk recht als eerste bescherming nodig heeft.',
        prompt:
            'De app wil aanwezigheid, studiegedrag en opdrachtkliks bijhouden. Welke grens verdedig jij eerst?',
        continueLabel: 'Onderzoek de rechten',
        options: [
            {
                id: 'alleen-noodzakelijk',
                label: 'Alleen noodzakelijke data',
                description:
                    'Als de school het niet echt nodig heeft, hoort het niet verzameld te worden.',
                positionId: 'minimaal',
                feedback:
                    'Je begint bij dataminimalisatie. Let straks op welke data echt onderwijsdoel heeft en welke controle wordt.',
            },
            {
                id: 'eerst-toestemming',
                label: 'Eerst duidelijke toestemming',
                description:
                    'Leerlingen en ouders moeten weten waarvoor data wordt gebruikt.',
                positionId: 'toestemming',
                feedback:
                    'Je kiest voor keuze en uitleg. Onderzoek straks of toestemming op school wel echt vrij kan zijn.',
            },
            {
                id: 'toezicht-nodig',
                label: 'Onafhankelijke controle',
                description:
                    'Een school of leverancier mag niet alleen zijn eigen privacywerk nakijken.',
                positionId: 'reguleren',
                feedback:
                    'Je start als rechtenbewaker. Let straks op welke regels controleerbaar en haalbaar zijn.',
            },
            {
                id: 'schoolruimte',
                label: 'School moet kunnen handelen',
                description:
                    'Data kan helpen om leerlingen sneller te ondersteunen.',
                positionId: 'vrijheid',
                feedback:
                    'Je verdedigt praktische hulp. Check straks waar hulp omslaat in onnodige monitoring.',
            },
        ],
    },
    topic: 'Dataverzameling op school',
    dilemma:
        'Jouw school wil een app invoeren die bijhoudt wanneer je op school bent, hoe lang je studeert en welke opdrachten je bekijkt. De school zegt het is voor jouw eigen leervoortgang. Maar wie heeft toegang tot die data?',
    stakeholders: [
        {
            id: 'daan',
            name: 'Daan',
            emoji: '🧑',
            role: 'Leerling, 14 jaar',
            perspective:
                'Ik wil niet dat de school weet hoelang ik op mijn telefoon zit en wanneer ik mijn huiswerk doe. Dat is mijn privéleven. En als die data ooit gelekt wordt, of als een toekomstige werkgever er toegang toe krijgt — wie beschermt me dan?',
            keyArgument:
                'Privacy is een grondrecht. Ook op school. Minderjarigen verdienen extra bescherming, niet minder.',
        },
        {
            id: 'smit',
            name: 'Mevrouw Smit',
            emoji: '👩‍🏫',
            role: 'Schooldirecteur',
            perspective:
                'We verzamelen data om leerlingen beter te helpen. Als ik zie dat een leerling al twee weken niet meer inlogt, kan ik ingrijpen voordat die leerling uitvalt. Dataverzameling is een middel om kansen te verbeteren, niet om te controleren.',
            keyArgument:
                'Met gegevens kunnen we gerichter helpen. Dat is in het belang van de leerling, niet in strijd met dat belang.',
        },
        {
            id: 'avg',
            name: 'Functionaris Gegevensbescherming',
            emoji: '⚖️',
            role: 'Privacy-expert',
            perspective:
                'De AVG schrijft voor dat scholen een wettelijke grondslag nodig hebben voor elke gegevensverzameling. Toestemming van minderjarigen is problematisch — ouders moeten toestemmen, maar ook die toestemming is niet altijd vrij als het gaat om toegang tot onderwijs. Scholen zijn verplicht een DPIA uit te voeren voor dit soort apps.',
            keyArgument:
                'Dataverzameling mag alleen als het noodzakelijk is, proportioneel is en de betrokkene het weet. Aan alle drie de eisen moet worden voldaan.',
        },
        {
            id: 'tech-bedrijf',
            name: 'Tim',
            emoji: '💻',
            role: 'CEO van een ed-tech bedrijf',
            perspective:
                'Onze app maakt gepersonaliseerd leren mogelijk. De data die we verzamelen, gebruiken we alleen om de leerervaring te verbeteren. We verkopen geen data aan derden — dat staat in onze privacyverklaring. Zonder data kunnen we geen intelligente aanbevelingen doen.',
            keyArgument:
                'Data is de brandstof van personalisatie. Zonder data krijg je een one-size-fits-all aanpak die minder effectief is voor elke leerling.',
        },
    ],
    positions: [
        {
            id: 'minimaal',
            label: 'Minimale dataverzameling',
            description: 'Scholen mogen alleen data verzamelen die strikt noodzakelijk is voor onderwijs. Alles wat verder gaat, is niet toegestaan.',
        },
        {
            id: 'toestemming',
            label: 'Altijd expliciete toestemming',
            description: 'Scholen mogen data verzamelen, maar leerlingen en ouders moeten vooraf expliciet en geïnformeerd toestemming geven voor elk doel.',
        },
        {
            id: 'reguleren',
            label: 'Strikte regulering',
            description: 'Onafhankelijke toezichthouders moeten schoolapps verplicht controleren en goedkeuren voordat ze gebruikt mogen worden.',
        },
        {
            id: 'vrijheid',
            label: 'Scholen mogen zelf bepalen',
            description: 'Scholen weten zelf het best wat goed is voor hun leerlingen. Overregulering hindert innovatief onderwijs.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Want de wet of het onderzoek zegt dat...',
        'Dit raakt specifiek...',
    ],
    reflectionQuestions: [
        'Is er een verschil tussen data verzamelen om te helpen en data verzamelen om te controleren? Leg uit.',
        'Welk recht vind jij het belangrijkst: privacy of toegang tot gepersonaliseerd onderwijs?',
    ],
    counterArgument:
        '"Als we helemaal geen data mogen verzamelen op school, hoe weten we dan welke leerlingen extra hulp nodig hebben? Vroeg signaleren van problemen redt schoolcarrières. Privacy zonder nuance betekent dat kwetsbare leerlingen onzichtbaar worden."',
    argumentQualityIndicators: true,
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#5F947D',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#5F947D',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#445865',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#445865',
        },
    ],
    takeaways: [
        'De AVG geeft jou als leerling het recht op inzage, correctie en verwijdering van jouw data.',
        'Toestemming is niet vrij als afwijzing toegang tot onderwijs kost.',
        'Dataminimalisatie is een wettelijk principe: verzamel alleen wat noodzakelijk is.',
        'Scholen zijn verwerkers van persoonsgegevens en zijn wettelijk aansprakelijk voor hoe ze die bewaren.',
    ],
};

export default config;
