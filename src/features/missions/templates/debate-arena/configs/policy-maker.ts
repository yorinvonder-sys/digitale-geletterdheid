import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'policy-maker',
    title: 'Policy Maker',
    introEmoji: '📋',
    introTitle: 'Policy Maker',
    introDescription:
        'De schoolleiding moet een beslissing nemen over het telefoonbeleid op school. Leerlingen, docenten, ouders en de directie hebben allemaal een mening. Jij bent beleidsadviseur. Wat adviseer je?',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Telefoonbeleid op school',
    dilemma:
        'De school overweegt haar telefoonbeleid aan te passen. Moet de smartphone volledig verboden worden tijdens schooltijd, alleen toegestaan in de pauze, of mogen leerlingen zelf bepalen wanneer ze hun telefoon gebruiken?',
    stakeholders: [
        {
            id: 'leerling',
            name: 'Yasmine',
            emoji: '🎒',
            role: 'Leerlingraadlid, 16 jaar',
            perspective:
                'Mijn telefoon is mijn agenda, woordenboek en communicatiemiddel met mijn ouders. Ik kan mezelf prima beheersen. Als ik hem afgeef voelt dat alsof de school me niet vertrouwt. Bovendien gebruik ik soms apps die écht nuttig zijn tijdens de les, zoals een rekenmachine of een woordenboekapp.',
            keyArgument:
                'Leerlingen leren verantwoordelijk omgaan met technologie beter door oefening dan door verbod. Een smartphone hoort bij het dagelijks leven en dat verdwijnt niet na school.',
        },
        {
            id: 'docent',
            name: 'Meneer Janssen',
            emoji: '📚',
            role: 'Docent Nederlands, 12 jaar ervaring',
            perspective:
                'Ik verlies elke les tijd aan het aanspreken van leerlingen die stiekem op hun telefoon zitten. Als ik een leerling aanspreek, volgt er een discussie. Een duidelijk verbod scheelt me veel energie en geeft de klas meer rust. Onderzoek laat zien dat leerlingen zonder telefoon in de buurt gemiddeld hogere toetsresultaten halen.',
            keyArgument:
                'Rust in de klas is een voorwaarde voor goed onderwijs. Een helder beleid geeft docenten handvatten om de les te leiden zonder eindeloze discussies.',
        },
        {
            id: 'ouder',
            name: 'De heer Petrov',
            emoji: '👨‍👧',
            role: 'Ouder, lid van de medezeggenschapsraad',
            perspective:
                'Ik wil mijn dochter kunnen bereiken als er iets thuis is. Een volledig verbod — ook in de pauze — voelt te ver gaan. Tegelijk snap ik dat de school rust wil. Een duidelijk onderscheid tussen lestijd en pauzetijd lijkt me het meest redelijk. Dan behoudt iedereen zijn belang.',
            keyArgument:
                'Ouders en kinderen hebben een bereikbaarheidsbelang. Een totaalverbod gaat voorbij aan dat belang; een gebalanceerd beleid houdt rekening met alle betrokkenen.',
        },
        {
            id: 'schoolleider',
            name: 'Rector Van den Berg',
            emoji: '🏫',
            role: 'Schoolleider',
            perspective:
                'De Rijksoverheid heeft scholen opgeroepen om telefoons in de les te verbieden — maar de uitvoering is aan de school zelf. We willen een beleid dat werkt én gedragen wordt. Als leerlingen en ouders het beleid niet accepteren, is handhaving een dagelijkse strijd. Ik wil iets dat realistisch is om vol te houden.',
            keyArgument:
                'Goed beleid is uitvoerbaar beleid. Een regel die niemand naleeft werkt erger dan geen regel. Draagvlak is een voorwaarde voor effectiviteit.',
        },
    ],
    positions: [
        {
            id: 'vrij-gebruik',
            label: 'Vrij gebruik (leerling beslist zelf)',
            description: 'Leerlingen mogen hun telefoon gebruiken wanneer zij dat zelf nodig achten — de verantwoordelijkheid ligt bij de leerling.',
        },
        {
            id: 'alleen-pauze',
            label: 'Alleen in de pauze toegestaan',
            description: 'Tijdens lessen is de telefoon weg; in de pauze mogen leerlingen hem vrijelijk gebruiken.',
        },
        {
            id: 'volledig-verbod',
            label: 'Volledig verbod tijdens schooltijd',
            description: 'De telefoon gaat bij binnenkomst in een kluisje of tas en wordt pas na school teruggegeven.',
        },
        {
            id: 'gedifferentieerd',
            label: 'Gedifferentieerd per situatie',
            description: 'Per les of activiteit bepaalt de docent of de telefoon nuttig of storend is — geen universele regel, maar contextafhankelijk gebruik.',
        },
    ],
    argumentPrompts: [
        'Mijn beleidsadvies is...',
        'De reden daarvoor is...',
        'De groep die het meest profiteert van dit beleid is...',
    ],
    reflectionQuestions: [
        'Welk stakeholder-perspectief had je het minst verwacht? Heeft dat je mening veranderd?',
        'Is er een oplossing die alle vier de standpunten gedeeltelijk tegemoetkomt?',
    ],
    counterArgument:
        '"Leerlingen gebruiken hun telefoon toch al voor alles buiten school. Als we ze leren ermee om te gaan op school — inclusief de momenten dat je hem moet wegleggen — leren ze zelfregulatie. Een volledig verbod leert niets: zodra ze van school af zijn, hebben ze geen regels meer en geen ervaring met zelf-beheersen."',
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
        'Goed beleid is uitvoerbaar beleid: draagvlak bij alle betrokkenen is een voorwaarde voor effectieve handhaving.',
        'Verschillende stakeholders hebben legitieme maar tegenstrijdige belangen — beleid moet die afwegen.',
        'De Rijksoverheid kan scholen een richting geven, maar de uitvoering vraagt maatwerk per school.',
        'Stakeholderanalyse (= in kaart brengen wie er belang bij heeft) is de eerste stap van elk goed beleidsvoorstel.',
    ],
};

export default config;
