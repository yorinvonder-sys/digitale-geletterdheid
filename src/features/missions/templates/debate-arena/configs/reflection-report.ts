import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'reflection-report',
    title: 'Reflection Report',
    introEmoji: '📖',
    introTitle: 'Reflection Report',
    introDescription:
        'Drie jaar informatica zitten erop. Maar wat heb je eigenlijk geleerd — en wat zegt dat over wie jij bent als digitale burger? Debatteer mee over de waarde van zelfreflectie en persoonlijke groei.',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'De waarde van reflectie in een digitale wereld',
    dilemma:
        'Informatica gaat over vaardigheden en kennis. Maar moet een informatica-opleiding ook bijdragen aan wie je bent als persoon — je zelfkennis, je verantwoordelijkheidsgevoel, je digitale ethiek? Of is dat buiten de scope?',
    stakeholders: [
        {
            id: 'lena',
            name: 'Lena',
            emoji: '👩',
            role: 'Afstuderend leerling, 16 jaar',
            perspective:
                'Informatica heeft mij geleerd hoe ik problemen oplos. Maar het meest waardevolle was het leren omgaan met mislukkingen — mijn code die niet werkte, mijn project dat ik opnieuw moest beginnen. Die momenten hebben mij meer geleerd over doorzetten dan elk vak daarvoor.',
            keyArgument:
                'Technische vaardigheden verouderen. Wat je leert over jezelf als probleemoplosser, gebruik je je hele leven.',
        },
        {
            id: 'kamphuis',
            name: 'Dhr. Kamphuis',
            emoji: '👨‍💼',
            role: 'HR-manager bij een techbedrijf',
            perspective:
                'We kijken niet alleen naar wat kandidaten kunnen, maar ook naar hoe ze reflecteren op hun eigen functioneren. Iemand die zijn sterke en zwakke punten kent en kan verwoorden, is waardevoller dan iemand met perfecte technische kennis maar nul zelfinzicht.',
            keyArgument:
                'Zelfreflectie is een professionele vaardigheid. Werkgevers zoeken mensen die weten wat ze niet weten.',
        },
        {
            id: 'pieters',
            name: 'Mevrouw Pieters',
            emoji: '👩‍🏫',
            role: 'Informaticadocent',
            perspective:
                'Ik geef informatica, geen filosofie. Als ik mijn leerlingen ook nog persoonlijke groei moet bijbrengen, terwijl het examenprogramma al overvol is, dan schiet ik mijn doel voorbij. Reflectie is waardevol, maar het is niet mijn kerntaak.',
            keyArgument:
                'Leerlingen kunnen niet alles leren in informatica. Focus en diepgang in de kernvaardigheden zijn meer waard dan brede maar oppervlakkige programma\'s.',
        },
        {
            id: 'filosoof',
            name: 'Dr. Van Rijn',
            emoji: '🎓',
            role: 'Onderwijsfilosoof',
            perspective:
                'De snelste programmeur die niet nadenkt over de maatschappelijke impact van wat ze bouwt, is gevaarlijker dan iemand die langzamer werkt maar ethisch reflecteert. Informatica zonder ethische vorming produceert mensen die systemen bouwen zonder zich af te vragen of ze dat moeten doen.',
            keyArgument:
                'Technologie is niet neutraal. De mensen die haar bouwen, zijn verantwoordelijk voor haar gevolgen — ook als dat niet hun intentie was.',
        },
    ],
    positions: [
        {
            id: 'reflectie-kern',
            label: 'Reflectie is kerndoel',
            description: 'Informatica moet expliciet aandacht besteden aan zelfreflectie, ethisch denken en persoonlijke groei — dat zijn vaardigheden voor het leven.',
        },
        {
            id: 'technisch-eerst',
            label: 'Technische vaardigheden eerst',
            description: 'Informatica moet focussen op technische competenties. Persoonlijke vorming is primair de verantwoordelijkheid van andere vakken en de thuissituatie.',
        },
        {
            id: 'integreren',
            label: 'Integreren, niet apart',
            description: 'Reflectie moet verweven zijn met alle projecten — niet als apart onderdeel, maar als onderdeel van elk project en elke opdracht.',
        },
        {
            id: 'student-kiest',
            label: 'Leerling bepaalt zelf',
            description: 'Leerlingen moeten de ruimte krijgen om zelf te kiezen hoeveel nadruk ze leggen op technische verdieping versus persoonlijke reflectie.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Mijn ervaring of redenering is...',
        'Dit is relevant voor de toekomst omdat...',
    ],
    reflectionQuestions: [
        'Wat heb jij de afgelopen jaren het meest geleerd — en was dat wat je verwachtte te leren?',
        'Heeft het debat jouw kijk op de waarde van informatica als vak veranderd?',
    ],
    counterArgument:
        '"Als we informatica volstoppen met reflectie en ethiek, verliezen we de concurrentiepositie ten opzichte van landen waar leerlingen puur technisch worden opgeleid. De arbeidsmarkt vraagt om mensen die code kunnen schrijven, niet om mensen die over code nadenken."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#D7C95F',
        },
        {
            minScore: 60,
            emoji: '📖',
            title: 'Scherp Denker',
            color: '#D97848',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#445865',
        },
    ],
    takeaways: [
        'Zelfreflectie is een professionele vaardigheid die werkgevers en vervolgopleidingen waarderen.',
        'Technische kennis veroudert; zelfkennis en aanpassingsvermogen niet.',
        'Technologie is niet neutraal — de maker draagt verantwoordelijkheid voor de gevolgen.',
        'Een eerlijk reflectieverslag benoemt zwakke punten: dat maakt het juist sterker.',
    ],
};

export default config;
