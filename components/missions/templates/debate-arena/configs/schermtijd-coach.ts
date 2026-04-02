import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'schermtijd-coach',
    title: 'Schermtijd Coach',
    introEmoji: '📱',
    introTitle: 'Schermtijd Coach',
    introDescription:
        'De gemiddelde tiener zit 7 uur per dag op een scherm buiten school. Apps zijn ontworpen om je aandacht vast te houden — maar hoeveel van jouw tijd kies JIJ zelf? Debatteer mee over wie de verantwoordelijkheid draagt.',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Verantwoordelijkheid voor schermtijd',
    dilemma:
        'Apps zijn bewust ontworpen om je zo lang mogelijk vast te houden. Wie is er verantwoordelijk voor hoeveel tijd jij op je telefoon doorbrengt?',
    stakeholders: [
        {
            id: 'yasmine',
            name: 'Yasmine',
            emoji: '👧',
            role: 'Scholier, 13 jaar',
            perspective:
                'Ik wil stoppen met scrollen maar ik kan het niet. TikTok start automatisch de volgende video, Snapchat geeft me een streak-melding, Instagram laat me zien hoeveel mensen online zijn. Ik heb het gevoel dat de app sterker is dan ik.',
            keyArgument:
                'Als je bewust trucjes inbouwt zodat iemand niet kan stoppen, dan neem je hun vrije keuze weg.',
        },
        {
            id: 'van-dijk',
            name: 'Mevrouw Van Dijk',
            emoji: '👩‍💼',
            role: 'Product manager bij een app-bedrijf',
            perspective:
                'Wij zijn een gratis app. Zonder advertentie-inkomsten bestaat onze dienst niet. Gebruikers kunnen altijd uitloggen, notificaties uitzetten of de app verwijderen. Wij dwingen niemand. Als mensen onze app leuk vinden, is dat toch goed?',
            keyArgument:
                'Ouders en gebruikers zijn zelf verantwoordelijk. Wij bieden een dienst aan — de keuze om hem te gebruiken ligt bij jou.',
        },
        {
            id: 'prins',
            name: 'Dr. Prins',
            emoji: '🧠',
            role: 'Gedragswetenschapper',
            perspective:
                'Het tienerbrein is biologisch kwetsbaarder voor impulsief gedrag. Dezelfde variabele beloningen — soms een like, soms niet — die apps gebruiken, activeren dopamine op precies dezelfde manier als gokautomaten. Kinderen en tieners zijn een bijzondere groep die extra bescherming verdient.',
            keyArgument:
                'Wetenschap toont aan dat jongeren minder goed impuls kunnen beheersen. Apps misbruiken dat biologische feit. Dat is geen eerlijk spel.',
        },
        {
            id: 'hoogenbosch',
            name: 'Raadslid Hoogenbosch',
            emoji: '🏛️',
            role: 'Gemeenteraadslid',
            perspective:
                'We kunnen niet elke app verbieden of volledig reguleren — dat schaadt innovatie. Maar voor minderjarigen moeten we nadenken over grenzen. De Digital Services Act van de EU verplicht platforms al tot meer transparantie. Toch blijft handhaving lastig als platforms vanuit Amerika opereren.',
            keyArgument:
                'Regelgeving is nodig, maar moet slim zijn: gericht op ontwerptrucs die specifiek op jongeren zijn gericht, niet op de hele app-sector.',
        },
    ],
    positions: [
        {
            id: 'verbieden',
            label: 'Ontwerptrucs verbieden',
            description: 'Autoplay, infinite scroll en verslavende meldingen moeten wettelijk verboden zijn voor apps die door minderjarigen gebruikt worden.',
        },
        {
            id: 'ouders',
            label: 'Ouders verantwoordelijk',
            description: 'Ouders moeten zelf grenzen stellen via ouderlijk toezicht en schermtijdinstellingen. De overheid moet zich hier niet mee bemoeien.',
        },
        {
            id: 'eigen-keuze',
            label: 'Eigen keuze',
            description: 'Gebruikers zijn zelf verantwoordelijk voor hun schermtijd. Wie een app gebruikt, kiest er zelf voor.',
        },
        {
            id: 'bedrijven',
            label: 'Bedrijven aansprakelijk',
            description: 'App-bedrijven moeten wettelijk aansprakelijk worden gesteld als hun ontwerp aantoonbaar schadelijk gedrag veroorzaakt bij jongeren.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Want uit onderzoek of de praktijk blijkt dat...',
        'Dit is belangrijk omdat...',
    ],
    reflectionQuestions: [
        'Welk belang van welke partij vind jij het zwaarst wegen? Waarom?',
        'Is jouw mening over eigen verantwoordelijkheid veranderd na dit debat?',
    ],
    counterArgument:
        '"Als we ontwerptrucs verbieden, zijn Europese apps op een nadeel ten opzichte van Amerikaanse concurrenten die dezelfde regels niet hoeven te volgen. Dan verdwijnen onze bedrijven en blijven alleen de grote platforms over die zich toch niets aantrekken van Europese regels."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Debatmeester',
            color: '#8B6F9E',
        },
        {
            minScore: 60,
            emoji: '⚖️',
            title: 'Scherp Denker',
            color: '#D97706',
        },
        {
            minScore: 40,
            emoji: '💬',
            title: 'Goed Bezig',
            color: '#10B981',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de Start',
            color: '#6B6B66',
        },
    ],
    takeaways: [
        'Apps zijn geen neutrale gereedschappen — ze zijn gebouwd om je aandacht te stelen.',
        'Biologische kwetsbaarheid van het tienerbrein maakt "eigen verantwoordelijkheid" een ingewikkeld argument.',
        'Technologiebedrijven, ouders, overheid én gebruikers dragen elk een deel van de verantwoordelijkheid.',
        'Europese regelgeving werkt alleen als handhaving ook buiten de EU mogelijk is.',
    ],
};

export default config;
