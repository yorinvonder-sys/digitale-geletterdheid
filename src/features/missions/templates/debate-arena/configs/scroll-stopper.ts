import type { DebateArenaConfig } from '../DebateArena';

const config: DebateArenaConfig = {
    missionId: 'scroll-stopper',
    title: 'Scroll Stopper',
    introEmoji: '📱',
    introTitle: 'Scroll Stopper',
    introDescription:
        'Social media apps zijn bewust ontworpen om je zo lang mogelijk vast te houden. Infinite scroll (= eindeloos scrollen zonder stopknop), likes, notificaties — allemaal trucjes. Maar is dat erg? En wie mag daar iets van vinden?',
    introFeatures: [
        'Lees de standpunten van 4 betrokkenen',
        'Kies jouw positie in het debat',
        'Bouw 2-3 sterke argumenten op',
        'Reageer op een tegenargument',
        'Reflecteer: is je mening veranderd?',
    ],
    topic: 'Verslavend app-design',
    dilemma:
        'Social media apps zijn bewust ontworpen om je zo lang mogelijk vast te houden. Is dat acceptabel?',
    stakeholders: [
        {
            id: 'luna',
            name: 'Luna',
            emoji: '👧',
            role: 'Tiener, 14 jaar',
            perspective:
                'Ik merk dat ik niet kan stoppen met scrollen, zelfs als ik eigenlijk wil stoppen. Ik ga naar bed en denk: nog één video. Een uur later lig ik nog te scrollen. Het voelt niet alsof ík dat kies.',
            keyArgument:
                'Als je niet meer kunt stoppen ook al wíl je stoppen, dan is dat geen vrijheid meer.',
        },
        {
            id: 'mark',
            name: 'Mark',
            emoji: '💼',
            role: 'App-ontwerper',
            perspective:
                'Engagement (= hoe lang je blijft kijken) is hoe wij geld verdienen. Zonder advertentie-inkomsten kunnen we onze app niet gratis aanbieden. We ontwerpen voor een prettige gebruikerservaring — als mensen lang blijven, vinden ze het blijkbaar leuk.',
            keyArgument:
                'Niemand dwingt je de app te gebruiken. Wij maken hem aantrekkelijk; jij kiest zelf hoelang je blijft.',
        },
        {
            id: 'bakker',
            name: 'Dr. Bakker',
            emoji: '🧠',
            role: 'Psycholoog',
            perspective:
                'Onderzoek toont aan dat variabele beloningen (= je krijgt soms een like, soms niet) dezelfde reactie in je hersenen veroorzaken als gokken. Jongeren zijn extra kwetsbaar omdat het deel van je hersenen dat helpt om te stoppen pas rond je 25e klaar is.',
            keyArgument:
                'Als een ontwerp gebruik maakt van psychologische kwetsbaarheden van tieners, is "eigen keuze" een misleidend argument.',
        },
        {
            id: 'devries',
            name: 'Kamerlid De Vries',
            emoji: '🏛️',
            role: 'Politicus',
            perspective:
                'We moeten als overheid iets doen, maar we moeten ook oppassen dat we innovatie niet remmen. Nederland kan niet zomaar regels maken die alleen hier gelden als de grote platforms gewoon vanuit Amerika opereren. Ik ben voor strengere regels, maar het moet haalbaar zijn.',
            keyArgument:
                'Europese samenwerking is de sleutel: alleen met EU-brede wetgeving kunnen we grote platforms echt aanpakken.',
        },
    ],
    positions: [
        {
            id: 'verboden',
            label: 'Totaal verbieden',
            description: 'Verslavende designkeuzes zoals infinite scroll en variabele beloningen moeten wettelijk verboden zijn.',
        },
        {
            id: 'reguleren',
            label: 'Strenger reguleren',
            description: 'Bedrijven mogen dergelijke functies aanbieden, maar de overheid stelt strenge grenzen — zeker voor minderjarigen.',
        },
        {
            id: 'zelfregulatie',
            label: 'Zelfregulatie',
            description: 'Bedrijven moeten zelf verantwoordelijkheid nemen en gedragsregels opstellen, zonder overheidsbemoeienis.',
        },
        {
            id: 'vrijheid',
            label: 'Vrijheid van ontwerp',
            description: 'Bedrijven mogen hun apps ontwerpen zoals ze willen. Gebruikers hebben de vrijheid om zelf grenzen te stellen.',
        },
    ],
    argumentPrompts: [
        'Ik vind dat...',
        'Want uit onderzoek blijkt dat...',
        'Dit raakt vooral...',
    ],
    reflectionQuestions: [
        'Wat heb je geleerd over de belangen van de verschillende partijen?',
        'Is je mening veranderd tijdens dit debat? Waarom wel of niet?',
    ],
    counterArgument:
        '"Als we design-keuzes gaan verbieden, waar stoppen we dan? Moeten we ook kleur, geluid en animaties reguleren? Dan bemoeit de overheid zich met elke creatieve keuze van ontwerpers."',
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
            color: '#ff3c21',
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
        'Verslavend app-design raakt jongeren harder door hersenontwikkeling.',
        'Belangen van bedrijven, gebruikers en overheden botsen — en dat is de kern van het debat.',
        'Er is geen "juist" antwoord, maar jouw argumenten maken je standpunt sterker.',
        'Regelgeving werkt het best op Europees niveau.',
    ],
};

export default config;
