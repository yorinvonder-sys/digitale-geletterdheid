import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'policy-maker',
    title: 'Policy Maker',
    introEmoji: '📋',
    introTitle: 'Policy Maker',
    introDescription:
        'De gemeenteraad wil gezichtsherkenningscamera\'s plaatsen op het schoolplein om pesten te bestrijden. De helft van de ouders is enthousiast. De andere helft is bang voor een bewakingsstaat. Jij bent beleidsadviseur. Wat adviseer je?',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Gezichtsherkenning op scholen',
    dilemma:
        'De gemeente wil gezichtsherkenningscamera\'s inzetten op schoolpleinen om pestsituaties sneller te signaleren. Het systeem herkent emoties en alarmeert als er een dreigende situatie is. Is dat een goed idee?',
    stakeholders: [
        {
            id: 'ouder',
            name: 'Mevrouw El Amrani',
            emoji: '👩',
            role: 'Ouder van gepest kind',
            perspective:
                'Mijn dochter is maanden lang gepest voordat iemand het in de gaten had. Als een systeem eerder had kunnen signaleren dat er iets fout zat, had ik liever dat gehad. Haar veiligheid weegt zwaarder dan mijn abstracte bezwaren over privacy.',
            keyArgument:
                'Veiligheid op school is een grondrecht. Als technologie kinderen beschermt die nu niet beschermd worden, dan is dat een afweging waard.',
        },
        {
            id: 'leerling',
            name: 'Roos',
            emoji: '👧',
            role: 'Leerlingraadlid, 15 jaar',
            perspective:
                'Ik wil me op school vrij kunnen voelen — ook als ik een slechte dag heb, of ruzie met een vriendin. Als een camera mijn gezichtsuitdrukking monitort, pas ik me aan om niet als verdacht te worden gezien. Dat is precies het tegenovergestelde van een veilige schoolcultuur.',
            keyArgument:
                'Bewaking creëert geen veiligheid, het creëert conformiteit. Echte veiligheid komt van vertrouwen, niet van toezicht.',
        },
        {
            id: 'wethouder',
            name: 'Wethouder De Groot',
            emoji: '🏛️',
            role: 'Wethouder Onderwijs',
            perspective:
                'De EU AI Act verbiedt real-time biometrische identificatie (= herkennen via je lichaam, zoals je gezicht) in openbare ruimtes tenzij er een wettelijke uitzondering is. Schoolpleinen vallen waarschijnlijk onder die regel. We moeten dit eerst laten toetsen door juristen. Ik ben niet tégen de camera\'s, maar we moeten het wettelijk kunnen verantwoorden.',
            keyArgument:
                'Goed beleid begint bij wettigheid. Als we een systeem invoeren dat later juridisch onhoudbaar blijkt, beschadigt dat het vertrouwen in de overheid.',
        },
        {
            id: 'onderzoeker',
            name: 'Prof. Bakker',
            emoji: '🔬',
            role: 'Onderzoeker sociaal veiligheidsbeleid',
            perspective:
                'Uit onderzoek blijkt dat camera\'s pestgedrag niet verminderen — pestgedrag verplaatst zich buiten het zichtbereik van de camera\'s, of naar online. Bewijs voor de effectiviteit van gezichtsherkenning bij pesten ontbreekt. Beleid op basis van schijnveiligheid is erger dan geen beleid, want het kost geld en legt privacydruk op leerlingen.',
            keyArgument:
                'Goed beleid is effectief beleid. Als er geen bewijs is dat de maatregel werkt, zijn de kosten — ook de maatschappelijke kosten — niet te rechtvaardigen.',
        },
    ],
    positions: [
        {
            id: 'invoeren',
            label: 'Invoeren met strikte voorwaarden',
            description: 'Gezichtsherkenning mag worden ingezet mits er wettelijke toestemming is, data minimaal bewaard wordt en er menselijk toezicht is op elk alarm.',
        },
        {
            id: 'verbieden',
            label: 'Verbieden',
            description: 'Gezichtsherkenning op schoolpleinen is een disproportionele inbreuk op de privacy van minderjarigen en moet wettelijk verboden worden.',
        },
        {
            id: 'pilot',
            label: 'Pilot met evaluatie',
            description: 'Een beperkte pilot op vrijwillige basis, met onafhankelijke evaluatie, voordat een beslissing wordt genomen over brede invoering.',
        },
        {
            id: 'alternatieven',
            label: 'Inzetten op alternatieven',
            description: 'Het pestprobleem aanpakken via meer mentoren, anonieme meldlijnen en sociale programma\'s — zonder biometrische surveillance.',
        },
    ],
    argumentPrompts: [
        'Mijn beleidsadvies is...',
        'De reden daarvoor is...',
        'De groep die het meest geraakt wordt is...',
    ],
    reflectionQuestions: [
        'Hoe weeg je veiligheid en privacy als beide grondrechten zijn?',
        'Is er een stakeholder waarvan jij het standpunt veranderd hebt na het debat?',
    ],
    counterArgument:
        '"We accepteren al camera\'s in supermarkten, op straat en in het verkeer. Waarom is een schoolplein anders? Als ouders kiezen voor veiligheid van hun kind, is het paternalistisch (= beslissen vóór iemand anders, \'voor zijn eigen bestwil\') om te zeggen dat hun kind geen bewaking mag hebben terwijl andere plekken in de samenleving al volledig gemonitord zijn."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#202023',
        },
        {
            minScore: 60,
            emoji: '📋',
            title: 'Scherp Denker',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#202023',
        },
    ],
    takeaways: [
        'De EU AI Act verbiedt real-time biometrische identificatie in openbare ruimtes, met strenge uitzonderingen.',
        'Goed beleid is effectief beleid: als een maatregel niet werkt, zijn de kosten niet te rechtvaardigen.',
        'Veiligheid en privacy zijn allebei grondrechten — de spanning daartussen vraagt om een zorgvuldige afweging.',
        'Stakeholderanalyse (= in kaart brengen wie er belang bij heeft) is de eerste stap van elk goed beleidsvoorstel.',
    ],
};

export default config;
