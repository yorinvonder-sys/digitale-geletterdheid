import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'schermtijd-coach',
    title: 'Schermtijd Coach',
    introEmoji: '📱',
    introTitle: 'Schermtijd Coach',
    introDescription:
        'Apps gebruiken ontwerpkeuzes zoals notificaties, autoplay en beloningen om aandacht vast te houden. Welke verantwoordelijkheid ligt bij jou, ouders, school, overheid of techbedrijven? Debatteer mee vanuit meerdere kanten.',
    missionGoal: {
        primaryGoal: 'Bouw een onderbouwd standpunt over wie verantwoordelijk is voor gezonde schermtijd.',
        criteria: {
            type: 'steps-complete',
            min: 5,
            description: 'Verkennen, positie kiezen, argumenten bouwen, tegenargument beantwoorden en reflecteren.',
        },
        evidence: 'Een gekozen positie, meerdere argumenten, een reactie op kritiek en een reflectie.',
    },
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Telefoonmoment: leerling kiest eerst hoe te reageren op streakmelding en autoplay.',
        primaryInteraction: 'choose-with-consequence',
        feedbackMoment: 'Na de schermtijdkeuze koppelt feedback eigen regie, hulpafspraken of platformregels aan aandacht.',
        visualKit: 'debate-dilemma',
        evidenceMoment: 'De leerling bouwt een onderbouwd standpunt over verantwoordelijkheid voor gezonde schermtijd.',
        antiBoringRule: 'Digitale balans blijft niet-oordelend en handelingsgericht; geen schuldgevoel, wel keuzes en perspectieven.',
        chromeAcceptance: 'Schermtijdkeuze, welzijnscopy, stakeholderkaarten en reflectie werken rustig op desktop, tablet portrait, tablet landscape en mobile.',
    },
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Maak eerst een eigen schermtijdkeuze',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    openingChoice: {
        title: 'Je telefoon vraagt aandacht',
        description:
            'Voor je gaat debatteren, maak je eerst zelf een kleine keuze. Zo merk je hoe ontwerpkeuzes je gedrag kunnen sturen zonder dat het meteen fout of goed hoeft te zijn.',
        prompt:
            'Je wilde tien minuten ontspannen, maar een app toont een streakmelding en start automatisch de volgende video. Wat doe jij eerst?',
        options: [
            {
                id: 'zelf-sturen',
                label: 'Ik stuur mijn eigen aandacht',
                description: 'Meldingen uit, pauzes nemen en bewust kiezen horen bij mijn eigen regie.',
                positionId: 'eigen-keuze',
                feedback:
                    'Je start vanuit eigen keuze. Let straks op of die keuze nog eerlijk voelt als apps bewust blijven trekken.',
            },
            {
                id: 'hulp-afspraken',
                label: 'Afspraken en hulp zijn nodig',
                description: 'Ouders, school of instellingen kunnen helpen zonder meteen alles te verbieden.',
                positionId: 'ouders',
                feedback:
                    'Je kiest voor steun rond gedrag. Verzamel straks bewijs voor wat hulpvol is en wat betuttelend voelt.',
            },
            {
                id: 'bedrijf-plicht',
                label: 'App-bedrijven moeten eerlijker ontwerpen',
                description: 'Autoplay, streaks en prikkels zijn ontwerpkeuzes waar bedrijven voor kiezen.',
                positionId: 'bedrijven',
                feedback:
                    'Je legt verantwoordelijkheid bij ontwerpers. Let straks op hoe ver die verantwoordelijkheid reikt.',
            },
            {
                id: 'regels',
                label: 'Ontwerptrucs voor jongeren begrenzen',
                description: 'Voor minderjarigen mogen de sterkste aandachtstrucs niet standaard aan staan.',
                positionId: 'verbieden',
                feedback:
                    'Je kiest een duidelijke beschermingsgrens. Check straks of regels haalbaar en eerlijk te handhaven zijn.',
            },
        ],
        continueLabel: 'Bekijk wie hier verantwoordelijk is',
    },
    topic: 'Verantwoordelijkheid voor schermtijd',
    dilemma:
        'Apps zijn vaak ontworpen om aandacht vast te houden. Wie is er verantwoordelijk voor gezonde digitale keuzes?',
    stakeholders: [
        {
            id: 'yasmine',
            name: 'Yasmine',
            emoji: '👧',
            role: 'Scholier, 13 jaar',
            perspective:
                'Ik merk dat stoppen met scrollen soms lastig is. Een volgende video start automatisch, een streak-melding vraagt aandacht, en sommige apps laten zien hoeveel mensen online zijn. Daardoor blijf ik soms langer dan ik vooraf van plan was.',
            keyArgument:
                'Als ontwerpkeuzes het lastig maken om te stoppen, moeten app-bedrijven daar verantwoordelijkheid voor nemen.',
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
                'Het tienerbrein is nog volop in ontwikkeling en kan gevoeliger zijn voor impulsief gedrag. Variabele beloningen — soms een like, soms niet — kunnen extra aantrekkelijk zijn. Kinderen en tieners zijn een bijzondere groep die extra bescherming verdient.',
            keyArgument:
                'Jongeren kunnen gevoeliger zijn voor prikkels. Daarom moeten ontwerpkeuzes voor minderjarigen extra zorgvuldig zijn.',
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
            description: 'Autoplay, infinite scroll en aandachtstrekkende meldingen moeten wettelijk begrensd worden voor apps die door minderjarigen gebruikt worden.',
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
            color: '#0B453F',
        },
        {
            minScore: 60,
            emoji: '⚖️',
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
        'Apps zijn geen neutrale gereedschappen — veel apps zijn gebouwd om je aandacht zo lang mogelijk vast te houden.',
        'Biologische kwetsbaarheid van het tienerbrein maakt "eigen verantwoordelijkheid" een ingewikkeld argument.',
        'Technologiebedrijven, ouders, overheid én gebruikers dragen elk een deel van de verantwoordelijkheid.',
        'Europese regelgeving werkt alleen als handhaving ook buiten de EU mogelijk is.',
    ],
};

export default config;
