import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'impact-review',
    title: 'Impact Review',
    introEmoji: '🌍',
    introTitle: 'Wat is de impact van technologie?',
    introDescription:
        'Technologie verandert de samenleving — soms ten goede, soms niet. In vier ronden toets je je kennis over de maatschappelijke gevolgen van digitale innovaties.',
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Kies je impactreviewroute: analysevolgorde, effectkoppels of kans-risico dossier.',
        primaryInteraction: 'review-and-improve',
        feedbackMoment: 'Feedback laat zien of je maatschappelijke gevolgen genuanceerd en bewijsgericht beoordeelt.',
        visualKit: 'review-puzzle-feedback',
        evidenceMoment: 'Je bewijs bestaat uit impactvolgorde, technologie-effectkoppels, kans-risico keuzes en ethische uitleg.',
        antiBoringRule: 'Impactreview blijft genuanceerd: gamification ondersteunt afwegingen, niet zwart-wit winnen.',
        chromeAcceptance: 'Routekeuze start de analyse actief en houdt maatschappelijke nuance zichtbaar op alle viewports.',
    },
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Impact Analist',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🌍',
            title: 'Maatschappelijk Bewust',
            color: '#5F947D',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#0B453F',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Kennis in opbouw',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#D97848',
        },
    ],
    takeaways: [
        'De digitale kloof is het verschil in toegang tot en gebruik van technologie tussen groepen mensen.',
        'Algoritmen op platforms bepalen mee welke informatie jij ziet — dit beïnvloedt je wereldbeeld.',
        'Technologie kan zowel kansen bieden als bestaande ongelijkheden versterken.',
        'Ethische vragen over technologie gaan over rechtvaardigheid, privacy en transparantie.',
        'Beleid en regelgeving (zoals de EU AI Act) zijn nodig om technologie verantwoord in te zetten.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Van technologie naar maatschappij',
            description:
                'Sorteer de stappen van een maatschappelijke impact-analyse van eerste verkenning (boven) tot beleidsadvies (onder).',
            maxScore: 25,
            items: [
                { id: 'technologie', label: 'Technologie beschrijven: wat is het en hoe werkt het?', correctPosition: 0 },
                { id: 'gebruikers', label: 'Identificeren wie de technologie gebruikt en beïnvloedt', correctPosition: 1 },
                { id: 'positief', label: 'Positieve effecten in kaart brengen', correctPosition: 2 },
                { id: 'negatief', label: 'Risico\'s en negatieve effecten analyseren', correctPosition: 3 },
                { id: 'ethiek', label: 'Ethische dilemma\'s benoemen', correctPosition: 4 },
                { id: 'beleid', label: 'Beleidsadvies formuleren voor overheid of bedrijf', correctPosition: 5 },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Technologie & maatschappelijk effect',
            description: 'Koppel elke technologie aan een concreet maatschappelijk effect.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Gezichtsherkenning in openbare ruimte',
                    right: 'Risico op privacy-inbreuk en massa-surveillance',
                },
                {
                    left: 'Algoritmisch sollicitatiebeoordeling',
                    right: 'Gevaar voor discriminatie op basis van onzichtbare criteria',
                },
                {
                    left: 'Online leerplatform in afgelegen gebieden',
                    right: 'Kans om de digitale kloof te verkleinen',
                },
                {
                    left: 'Automatisering in fabrieken',
                    right: 'Verlies van banen in uitvoerende functies',
                },
                {
                    left: 'Aanbevelingsalgoritme op sociale media',
                    right: 'Risico op filterbubble en polarisatie',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Kans of risico?',
            description:
                'Bepaal bij elk maatschappelijk effect van digitale technologie of het primair een kans of een risico is.',
            maxScore: 25,
            followUp: {
                question: 'Een gemeente wil gezichtsherkenning inzetten bij ingangen van scholen om de veiligheid te verhogen. Welk argument weegt het zwaarst bij de ethische beoordeling?',
                options: [
                    'Het systeem is duur, dus de gemeente kan dat geld beter anders besteden',
                    'Het verzamelt biometrische data van minderjarigen zonder expliciete toestemming, wat privacyrechten schendt',
                    'Gezichtsherkenning werkt niet goed genoeg om veiligheid echt te verbeteren',
                    'Leraren kunnen zelf ook bijhouden wie er binnenkomt',
                ],
                correctIndex: 1,
                explanation: 'Biometrische data van minderjarigen valt onder bijzondere persoonsgegevens die extra bescherming vereisen (AVG). Inzet zonder toestemming schendt fundamentele privacyrechten — ongeacht of het systeem effectief is. Kosten en effectiviteit zijn relevante factoren, maar privacyrechten zijn een harde juridische en ethische grens. Alternatieve methoden (optie 4) doen niet af aan de rechtsvraag.',
                bonusPoints: 5,
            },
            categories: ['Kans', 'Risico'],
            items: [
                { label: 'AI-diagnose helpt artsen in landen met weinig dokters', correctCategory: 'Kans' },
                { label: 'Deepfakes maken het moeilijk om nepvideo\'s te herkennen', correctCategory: 'Risico' },
                { label: 'Vertaaltools maken kennis toegankelijk in elke taal', correctCategory: 'Kans' },
                { label: 'Dataverzameling door apps zonder duidelijke toestemming', correctCategory: 'Risico' },
                { label: 'Online onderwijs bereikt leerlingen die niet naar school kunnen', correctCategory: 'Kans' },
                { label: 'Sociale media versterkt eenzaamheid bij sommige jongeren', correctCategory: 'Risico' },
                { label: 'Sensoren in steden helpen energieverbruik te verminderen', correctCategory: 'Kans' },
                { label: 'Algoritmen die ongelijke toegang tot leningen vergroten', correctCategory: 'Risico' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'Maatschappij & technologie: Waar of Onwaar?',
            description: 'Acht snelle vragen over digitale kloof, AI Act en ethiek.',
            maxScore: 25,
            followUp: {
                question: 'Je ontwerpt een AI-systeem dat sollicitanten beoordeelt voor een baan. Je gebruikt historische aanstellingsdata als trainingsdata. Welk risico is het meest urgent om te onderzoeken voordat je het systeem inzet?',
                options: [
                    'Het systeem is te traag voor grote aantallen sollicitaties',
                    'De historische data bevat mogelijk bestaande discriminatiepatronen die het model overneemt',
                    'Sollicitanten zullen het systeem niet vertrouwen omdat het een computer is',
                    'Het systeem kost meer dan een HR-medewerker',
                ],
                correctIndex: 1,
                explanation: 'Historische aanstellingsdata weerspiegelt vaak bestaande vooroordelen (bijv. minder vrouwen of mensen met een migratieachtergrond in bepaalde functies). Een model dat hierop traint leert die bias over — en versterkt deze op schaal. Dit is het kernprobleem van algoritmische discriminatie en een harde eis onder de EU AI Act voor hoog-risico systemen. Snelheid, vertrouwen en kosten zijn reële overwegingen, maar de bias-vraag is ethisch en juridisch het meest urgent.',
                bonusPoints: 5,
            },
            timePerQuestion: 12,
            questions: [
                {
                    question: 'De digitale kloof bestaat alleen in ontwikkelingslanden.',
                    answer: false,
                    explanation: 'De digitale kloof bestaat overal — ook in Nederland zijn er ouderen, mensen met een laag inkomen en mensen met een beperking die minder digitale toegang hebben.',
                },
                {
                    question: 'De EU AI Act verplicht bedrijven om risicovolle AI-systemen transparant te maken.',
                    answer: true,
                    explanation: 'De EU AI Act verdeelt AI in risicocategorieën en stelt eisen aan transparantie, veiligheid en menselijk toezicht.',
                },
                {
                    question: 'Een filterbubble zorgt ervoor dat je meer diverse meningen te zien krijgt.',
                    answer: false,
                    explanation: 'Een filterbubble toont je juist meer van hetzelfde — content die aansluit bij je bestaande opvattingen.',
                },
                {
                    question: 'Technologische innovatie lost altijd maatschappelijke problemen op.',
                    answer: false,
                    explanation: 'Technologie kan bestaande problemen versterken of nieuwe creëren — kritische analyse van effecten is altijd nodig.',
                },
                {
                    question: 'Een startup kan maatschappelijke impact hebben zonder dat dat het hoofddoel was.',
                    answer: true,
                    explanation: 'Veel technologieën met grote maatschappelijke impact (positief of negatief) begonnen als commercieel product.',
                },
                {
                    question: 'Ethiek in technologie gaat over eerlijkheid, transparantie en welzijn.',
                    answer: true,
                    explanation: 'Ethische vragen over technologie draaien om wie profiteert, wie schade lijdt en wie verantwoordelijk is.',
                },
                {
                    question: 'Als AI een beslissing neemt, is er geen menselijke verantwoordelijkheid meer.',
                    answer: false,
                    explanation: 'De mensen en organisaties die AI ontwerpen en inzetten blijven verantwoordelijk voor de effecten.',
                },
                {
                    question: 'Digitale innovatie kan zowel kansen als risico\'s tegelijk meebrengen.',
                    answer: true,
                    explanation: 'Vrijwel elke technologie heeft voor- en nadelen — een goede analyse kijkt altijd naar beide kanten.',
                },
            ],
        },
    ],
};

export default config;
