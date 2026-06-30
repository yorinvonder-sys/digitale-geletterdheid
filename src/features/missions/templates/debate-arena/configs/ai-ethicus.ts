import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'ai-ethicus',
    title: 'AI Ethicus',
    introEmoji: '⚖️',
    introTitle: 'AI Ethicus',
    introDescription:
        'Een school overweegt een AI-tool te gebruiken die essays van leerlingen nakijkt en beoordeelt. Dat bespaart tijd — maar is het ook eerlijk? En wat gaat er verloren als een mens de beoordeling niet meer doet? Debatteer mee over de rol van AI in het onderwijs.',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'AI als beoordelaar van leerlingwerk',
    dilemma:
        'Een school wil een AI-tool inzetten die essays van leerlingen nakijkt en een cijfer geeft. De tool is snel en consistent — maar mag een algoritme beoordelen wat een leerling weet en kan?',
    stakeholders: [
        {
            id: 'leerkracht',
            name: 'Mevrouw De Vries',
            emoji: '👩‍🏫',
            role: 'Docent Nederlands, 12 jaar ervaring',
            perspective:
                'Ik besteed nu 6 uur per week aan nakijken. Als de AI een eerste beoordeling geeft, kan ik die tijd gebruiken voor individuele begeleiding. De uiteindelijke beoordeling blijft bij mij — de AI is een hulpmiddel, geen vervanger.',
            keyArgument:
                'Een docent die minder tijd kwijt is aan nakijken, heeft meer tijd voor de leerlingen zelf. Dat is een verbetering van het onderwijs, niet een verslechtering.',
        },
        {
            id: 'leerling',
            name: 'Sven',
            emoji: '🧑‍💻',
            role: 'Leerling, 14 jaar',
            perspective:
                'Mijn essays gaan over persoonlijke ervaringen en creatieve ideeën. Een machine begrijpt niet wat ik bedoel. Ik maak soms bewust afwijkende zinnen om een bepaald effect te bereiken — die straft een AI af als fouten. Mijn cijfer voelt dan oneerlijk.',
            keyArgument:
                'Schrijven is meer dan spelling en grammatica. Creativiteit en eigen stem zijn moeilijk te meten met een algoritme — en fouten daarin kunnen een eerlijke beoordeling in de weg staan.',
        },
        {
            id: 'ai-expert',
            name: 'Dr. Karimov',
            emoji: '🔬',
            role: 'Onderzoeker taalverwerking en AI',
            perspective:
                'Huidige AI-tools zijn goed in het herkennen van structuur, argumentatielijn en taalfouten. Ze zijn minder goed in het beoordelen van originaliteit of subjectieve kwaliteit. Het beste resultaat krijg je als AI en docent samenwerken: de AI doet het technische deel, de docent beoordeelt de inhoud.',
            keyArgument:
                'AI is een gereedschap met specifieke sterktes en zwaktes. Transparantie over wat de tool wel en niet kan beoordelen is voorwaarde voor eerlijk gebruik.',
        },
        {
            id: 'coordinator',
            name: 'Dhr. Willems',
            emoji: '🏫',
            role: 'Onderwijscoördinator',
            perspective:
                'Bij landelijke examens worden essays al gedeeltelijk door meerdere beoordelaars nagekeken om consistentie te waarborgen. Een AI kan een vergelijkbare rol vervullen: zorgen dat de lat overal gelijk ligt. Maar ik ben ook bezorgd dat scholen de tool gaan gebruiken als bezuiniging — dan komt de kwaliteit onder druk.',
            keyArgument:
                'Consistentie in beoordeling is een reëel probleem: dezelfde docent geeft op maandag soms andere cijfers dan op vrijdag. Een AI is altijd even uitgerust — maar dat is alleen een voordeel als de kwaliteit van de AI-beoordeling hoog genoeg is.',
        },
    ],
    positions: [
        {
            id: 'volledig-inzetten',
            label: 'Volledig inzetten',
            description: 'De AI beoordeelt essays zelfstandig. De docent grijpt alleen in bij bezwaar of twijfel.',
        },
        {
            id: 'assistentie',
            label: 'Als hulpmiddel',
            description: 'De AI geeft een eerste beoordeling, maar de docent controleert altijd en stelt het eindcijfer vast.',
        },
        {
            id: 'beperkt',
            label: 'Alleen technisch',
            description: 'De AI checkt alleen spelling, grammatica en structuur — de inhoudelijke beoordeling blijft volledig bij de docent.',
        },
        {
            id: 'niet-inzetten',
            label: 'Niet inzetten',
            description: 'Essays nakijken blijft een menselijke taak. De relatie tussen docent en leerling staat centraal in beoordeling.',
        },
    ],
    reflectionQuestions: [
        'Wat is het verschil tussen een beoordeling die consistent is en een beoordeling die eerlijk is?',
        'Heeft dit debat je kijk op wat "goed onderwijs" betekent veranderd?',
    ],
    counterArgument:
        '"Menselijke docenten zijn ook inconsistent — dezelfde docent geeft vrijdagmiddag gemiddeld lagere cijfers dan maandagochtend. Een AI-tool is altijd even uitgerust en objectief. Door AI te weigeren, houden we een systeem in stand dat ook niet perfect eerlijk is."',
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
            emoji: '⚖️',
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
        'AI-tools kunnen essays beoordelen op structuur en taalgebruik, maar hebben moeite met originaliteit en creatieve afwijkingen.',
        'Consistent en eerlijk zijn niet hetzelfde: een algoritme kan consistent onjuist beoordelen.',
        'Transparantie over wat een AI wel en niet kan is een voorwaarde voor verantwoord gebruik in onderwijs.',
        'Menselijk toezicht op AI-beoordelingen is niet optioneel — het is de kern van verantwoord AI-gebruik in de klas.',
    ],
};

export default config;
