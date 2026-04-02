import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'digitale-balans-coach',
    title: 'Digitale Balans Coach',
    introEmoji: '⚖️',
    introTitle: 'Digitale Balans Coach',
    introDescription:
        'Je gebruikt je telefoon elke dag — maar wie bepaalt eigenlijk hoelang? Jijzelf, de app-makers, je ouders, of de overheid? In dit debat onderzoek je vier perspectieven en bouw je je eigen standpunt op.',
    introFeatures: [
        'Lees hoe vier betrokkenen hier anders over denken',
        'Kies jouw positie: wie is verantwoordelijk?',
        'Bouw 2-3 argumenten op vanuit de perspectieven',
        'Reageer op een sterk tegenargument',
        'Reflecteer op je eigen digitale gewoontes',
    ],
    topic: 'Jouw digitale balans — wie bepaalt hoeveel tijd je online bent?',
    dilemma:
        'Wie is verantwoordelijk voor jouw digitale balans: jijzelf, de app-makers, je ouders, of de overheid?',
    stakeholders: [
        {
            id: 'leerling',
            name: 'Noor',
            emoji: '🧑',
            role: 'Leerling, 14 jaar',
            perspective:
                'Eerlijk gezegd wil ik soms zelf ook minder op mijn telefoon zitten. Maar als ik YouTube opendoe "even kijken wat er is", ben ik een uur verder. Ik vind het lastig om te stoppen, ook al wíl ik dat. Ik wil niet dat mijn ouders mijn telefoon afpakken — ik wil het zelf leren regelen. Maar of dat altijd lukt? Niet altijd.',
            keyArgument:
                'Ik wil zelf verantwoordelijk zijn, maar ik heb soms wel hulp nodig om te stoppen — niet een verbod, maar een plan.',
        },
        {
            id: 'ontwikkelaar',
            name: 'Sam',
            emoji: '💻',
            role: 'App-ontwikkelaar',
            perspective:
                'Wij maken apps die mensen fijn vinden om te gebruiken. Dat is ons werk. We bieden ook tools aan: schermtijdlimieten, pauze-herinneringen, rustmodus. Maar als mensen die tools niet aanzetten, kunnen wij dat niet forceren. We proberen het aantrekkelijker te maken om gezond te gebruiken — maar uiteindelijk maakt de gebruiker zelf de keuze.',
            keyArgument:
                'We bieden de tools. Of iemand ze gebruikt, is aan die persoon zelf — we kunnen niet elke keuze voor je maken.',
        },
        {
            id: 'ouder',
            name: 'Mevrouw De Groot',
            emoji: '👩',
            role: 'Ouder',
            perspective:
                'Ik maak me soms zorgen, maar ik wil ook niet alles verbieden. Als ik de telefoon wegpak, leidt dat alleen maar tot ruzie. Wat ik wél wil: samen afspraken maken over wanneer en hoelang. Niet als straf, maar als gezinsregel. Dat werkt beter dan controleren. Maar ik snap ook dat ik niet weet wat mijn kind allemaal ziet en doet online.',
            keyArgument:
                'Samen afspraken maken werkt beter dan verbieden — dan is het een gedeelde keuze in plaats van een conflict.',
        },
        {
            id: 'wetenschapper',
            name: 'Dr. Hoekstra',
            emoji: '🔬',
            role: 'Neurowetenschapper',
            perspective:
                'Het tienerbrein is extra gevoelig voor directe beloningen — like, reactie, notificatie. Dat is geen zwakte, dat is biologie. Het prefrontale gebied dat impulsen remt, is pas rond je 25e volledig ontwikkeld. Dat betekent niet dat tieners hulpeloos zijn — maar het verklaart wél waarom het voor hen moeilijker is om te stoppen dan voor volwassenen. Kennis hierover helpt al enorm.',
            keyArgument:
                'Het tienerbrein reageert sterker op beloningsprikkels. Dat is neurowetenschappelijk normaal — maar je kunt leren hoe je daarmee omgaat.',
        },
    ],
    positions: [
        {
            id: 'zelfregulatie',
            label: 'Ik regel het zelf',
            description:
                'Jij bent verantwoordelijk voor je eigen schermtijd. Maak eigen afspraken, gebruik de tools die er zijn, en leer van je eigen gedrag.',
        },
        {
            id: 'bedrijfsverantwoordelijkheid',
            label: 'Apps moeten eerlijker',
            description:
                'App-makers mogen niet onbeperkt gebruik van psychologische trucjes. Ze moeten standaard eerlijker en gezonder ontwerpen — niet alleen als je zelf gaat zoeken.',
        },
        {
            id: 'gedeeld',
            label: 'Samen afspraken maken',
            description:
                'Thuis, op school en in de samenleving maak je samen afspraken over digitaal gebruik. Niet als verbod, maar als gedeelde verantwoordelijkheid.',
        },
        {
            id: 'regulering',
            label: 'De overheid moet ingrijpen',
            description:
                'Alleen wetten en regels kunnen grote techbedrijven dwingen verantwoord te ontwerpen. Vrijwilligheid werkt niet als er zoveel geld mee gemoeid is.',
        },
    ],
    argumentPrompts: [
        'Welk perspectief spreekt jou het meest aan, en waarom herken je je daarin?',
        'Welk argument vind je het sterkst als je kijkt naar wat er in de praktijk werkt — thuis, op school, of in de wet?',
        'Als je eerlijk bent over je eigen gedrag: welke aanpak zou voor jou persoonlijk het meeste verschil maken?',
    ],
    reflectionQuestions: [
        'Wat vind jij het belangrijkste aan je online tijd — en helpt hoe je het nu gebruikt daarbij?',
        'Is je mening veranderd na het horen van alle perspectieven? Waarom wel of niet?',
        'Welke concrete afspraak zou je met jezelf kunnen maken over je digitale gebruik?',
    ],
    counterArgument:
        '"Jij kunt je gedrag veranderen als je het echt wilt. Wij weten uit onderzoek dat het tienerbrein extra vatbaar is voor beloningsprikkels — maar datzelfde onderzoek laat ook zien dat tieners die begrijpen hóé hun brein werkt, beter in staat zijn om bewuste keuzes te maken. Kennis is al een vorm van zelfregulatie."',
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '⚖️',
            title: 'Balansexpert',
            color: '#6366F1',
        },
        {
            minScore: 60,
            emoji: '🧠',
            title: 'Bewust Denker',
            color: '#D97757',
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
        'Digitale balans gaat niet om hoeveel schermtijd je hebt, maar om wat je doet, waarom, en of dat bij jouw waarden past.',
        'Het tienerbrein reageert sterker op directe beloningen — dat verklaart waarom stoppen moeilijk is, maar het is geen excuus om het niet te proberen.',
        'Afspraken die je zelf maakt — of samen met anderen — werken beter dan regels die van buitenaf worden opgelegd.',
        'App-makers, ouders, scholen en de overheid spelen allemaal een rol. Maar jij bent uiteindelijk de expert over jouw eigen leven.',
        'Één kleine gewoonte veranderen — zoals je telefoon buiten de slaapkamer laten — kan al een groot verschil maken.',
    ],
};

export default config;
