import type { PuzzleLabConfig } from '../puzzleLabTypes';

const normalizePasswordPattern = (input: string): string => input
    .toLowerCase()
    .replace(/[@]/g, 'a')
    .replace(/[0]/g, 'o')
    .replace(/[1!|]/g, 'i')
    .replace(/[3]/g, 'e')
    .replace(/[4]/g, 'a')
    .replace(/[5$]/g, 's')
    .replace(/[7]/g, 't')
    .replace(/[^a-z0-9]/g, '');

const hasWeakPasswordPattern = (input: string): boolean => {
    const normalized = normalizePasswordPattern(input);
    const weakTerms = [
        'password',
        'wachtwoord',
        'welkom',
        'qwerty',
        'admin',
        'login',
        'letmein',
        'zomer',
        'winter',
        'lente',
        'herfst',
        'emma',
        'liam',
        'school',
    ];
    return weakTerms.some(term => normalized.includes(term))
        || /(.)\1{3,}/.test(normalized)
        || /(.{3,})\1/.test(normalized)
        || /1234|2345|3456|4567|5678|abcd|bcde|cdef/.test(normalized);
};

const config: PuzzleLabConfig = {
    missionId: 'wachtwoord-warrior',
    title: 'Wachtwoord Warrior',
    introEmoji: '🛡️',
    introTitle: 'Wachtwoord Warrior',
    introDescription:
        'In 2024 zijn meer dan 10 miljard wachtwoorden gelekt. Wachtwoorden als "123456" worden in minder dan 1 seconde gekraakt. Maar hoe werken aanvallen precies — en wat maakt een wachtwoord echt sterk? Bewijs dat jij je digitale leven kunt beschermen.',
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Kies je eerste kluisspoor: kraaktijd, woordenboekaanval of credential stuffing.',
        primaryInteraction: 'solve-puzzle',
        feedbackMoment: 'Na elke poging zie je waarom een wachtwoordpatroon wel of niet veilig is.',
        visualKit: 'review-puzzle-feedback',
        evidenceMoment: 'Je bewijs bestaat uit opgeloste wachtwoordpuzzels en regels voor veilig wachtwoordgebruik.',
        antiBoringRule: 'Geen paniektimer: de spanning zit in bewijs kraken en veilig herstellen, niet in leerlingen opjagen.',
        chromeAcceptance: 'Routekeuze, hintkosten en safe-recovery panel zijn zichtbaar voordat de eerste puzzel start.',
    },
    missionGoal: {
        primaryGoal: 'Los de wachtwoordpuzzels op en formuleer regels voor een sterk en veilig wachtwoordbeleid.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Minimaal drie wachtwoordpuzzels zijn opgelost met inhoudelijke feedback.',
        },
        evidence: 'Uitleg over kraaktijd, woordenboekaanvallen en veilig wachtwoordgebruik.',
    },
    introFeatures: [
        'Begrijp hoe brute-force en woordenboekaanvallen werken',
        'Analyseer waarom "slimme" wachtwoorden toch zwak zijn',
        'Leer het verschil tussen een zwak en een sterk wachtwoord',
        'Schrijf regels voor een veilig wachtwoordbeleid',
    ],
    maxScore: 100,
    puzzles: [
        {
            id: 'kraaktijd',
            title: 'Hoe snel wordt dit gekraakt?',
            type: 'code-crack',
            description:
                'Een aanvaller gebruikt een computer die 1 miljard wachtwoorden per seconde kan proberen. Schat de kraaktijd van "abc123" en typ je bewijsantwoord.\n\nHet wachtwoord heeft 6 tekens. Er zijn 26 kleine letters + 10 cijfers = 36 mogelijke tekens. Totaal aantal combinaties van 6 tekens: 36⁶ = 2.176.782.336.\n\nNoem in je antwoord dat dit in seconden of vrijwel direct te kraken is.',
            clues: [
                'Bij 1 miljard pogingen per seconde: deel het totaal aantal combinaties door 1.000.000.000.',
                '2.176.782.336 ÷ 1.000.000.000 = ongeveer 2 seconden.',
                'In de praktijk probeert de hacker eerst veelgebruikte wachtwoorden — "abc123" staat in ELKE woordenlijst.',
            ],
            extraClues: [
                'Moderne computers kraken 6-tekenwachtwoorden in seconden. Alleen lengte helpt echt.',
                'Een wachtwoord van 12 tekens (mix van letters, cijfers, symbolen) duurt gemiddeld 200 jaar om te kraken.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                return s.includes('seconde') || s.includes('direct') || s.includes('meteen') || s.includes('minder dan 1 minuut');
            },
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Klopt! "abc123" wordt onmiddellijk gekraakt — het staat in elke woordenlijst die hackers gebruiken. Maar ook als het niet in een lijst stond: 6 tekens zijn bij 1 miljard pogingen per seconde in ~2 seconden uitgeput. Lengte is de belangrijkste factor.',
            hintCost: 4,
        },
        {
            id: 'woordenboekaanval',
            title: 'Waarom is "P@ssw0rd!" zwak?',
            type: 'text-input',
            description:
                'Het wachtwoord "P@ssw0rd!" heeft:\n- Een hoofdletter ✓\n- Een speciaal teken ✓\n- Een cijfer ✓\n- Meer dan 8 tekens ✓\n\nToch wordt het als "zwak" beoordeeld. Typ de reden: welk aanvalspatroon herkent dit soort wachtwoordtruc?',
            clues: [
                'Hackers kennen alle trucs: @ voor a, 0 voor o, 1 voor i, 3 voor e.',
                'Een woordenboekaanval probeert niet alleen woorden, maar ook variaties met vervangingen.',
                '"Password" is het op-één-na meest gebruikte wachtwoord ter wereld — en hackers weten dat mensen het "verbergen" met symbolen.',
            ],
            extraClues: [
                'De echte woordenlijsten van hackers bevatten MILJOENEN variaties: password, p@ssword, P@ssw0rd, P@ssw0rd!, enzovoort.',
                'Een passphrase zoals "Fiets-Rood-Piano-7" is sterker: het is lang en niet voorspelbaar.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                return (s.includes('woordenboek') || s.includes('variatie') || s.includes('bekende woorden')) &&
                    (s.includes('symbool') || s.includes('@') || s.includes('vervang'));
            },
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Precies! Woordenboekaanvallen proberen bekende woorden + alle veelgebruikte vervangingen. "P@ssw0rd!" staat letterlijk in de aanvalslijsten. De les: geen enkel trucsysteem op een herkenbaar woord is veilig — gebruik lange, willekeurige zinnen of een wachtwoordmanager.',
            hintCost: 4,
        },
        {
            id: 'credential-stuffing',
            title: 'Zelfde wachtwoord, meerdere sites',
            type: 'code-crack',
            description:
                'Emma gebruikt het wachtwoord "Zomer2024!" voor haar e-mail, Instagram én haar schoolaccount. In 2024 lekt een grote game-site haar database — ook Emma\'s account met hetzelfde wachtwoord staat erin.\n\nTyp de naam van het risico voor haar andere accounts.',
            clues: [
                'Hackers verkopen of publiceren gelekte wachtwoorden op het dark web.',
                'Daarna proberen ze die wachtwoorden automatisch op andere populaire sites.',
                'Dit heet "credential stuffing" — als één wachtwoord werkt op meerdere sites, zijn alle accounts gehackt.',
            ],
            extraClues: [
                'Gemiddeld gebruikt meer dan 60% van mensen hetzelfde wachtwoord op meerdere sites.',
                'Oplossing: gebruik voor elke site een UNIEK wachtwoord — een wachtwoordmanager helpt je dat bij te houden.',
            ],
            revealExtraAfterAttempts: 2,
            answer: ['credential stuffing'],
            validator: (input: string) => {
                const s = input.toLowerCase();
                return s.includes('credential') || (s.includes('zelfde wachtwoord') && s.includes('andere'));
            },
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! Credential stuffing is geautomatiseerd: zodra één wachtwoord lekt, wordt het meteen geprobeerd op honderden andere populaire sites. Voor Emma betekent dit: haar e-mail, Instagram én schoolaccount zijn allemaal in gevaar. Unieke wachtwoorden per site zijn daarom essentieel.',
            hintCost: 4,
        },
        {
            id: 'sterk-wachtwoord-maken',
            title: 'Maak een fictieve sterke passphrase',
            type: 'text-input',
            description:
                'Nu jij weet hoe aanvallen werken, maak je een fictieve oefen-passphrase. Gebruik nooit een echt wachtwoord of een wachtwoord dat je ergens anders gebruikt. De passphrase moet aan ALLE eisen voldoen:\n\n• Minimaal 14 tekens lang\n• Minstens 1 hoofdletter (A–Z)\n• Minstens 1 cijfer (0–9)\n• Minstens 1 speciaal teken (!@#$%&*-_)\n• Geen bekend wachtwoordwoord, naam, seizoen of voorspelbaar patroon\n\nTip: gebruik meerdere willekeurige woorden met symbolen, bijvoorbeeld: "Paraplu#Boot7Ster"',
            clues: [
                'Lengte is de krachtigste factor: 14 tekens is véél sterker dan 8 tekens.',
                'Willekeurige woorden combineren werkt beter dan trucs op één woord: "Groen-Fiets-42-Maan!" is sterk.',
                'Probeer iets dat je kunt onthouden maar een computer moeilijk kan raden.',
            ],
            extraClues: [
                'Voorbeeld dat voldoet: "Tafel!Oranje9Wolk" — 17 tekens, hoofdletter, cijfer, speciaal teken, geen herkenbaar enkel woord.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.trim();
                return (
                    s.length >= 14 &&
                    /[A-Z]/.test(s) &&
                    /[0-9]/.test(s) &&
                    /[!@#$%&*\-_]/.test(s) &&
                    !hasWeakPasswordPattern(s)
                );
            },
            caseSensitive: true,
            maxAttempts: 10,
            points: 25,
            sensitiveAnswer: true,
            successMessage:
                'Uitstekend! Je begrijpt nu wat een echt sterk wachtwoord maakt: lengte + variatie + onvoorspelbaarheid. In de praktijk hoef je zulke wachtwoorden niet te onthouden — een wachtwoordmanager (zoals Bitwarden of 1Password) slaat unieke sterke wachtwoorden per site op.',
            hintCost: 2,
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Wachtwoord Meester',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🛡️',
            title: 'Security Warrior',
            color: '#445865',
        },
        {
            minScore: 40,
            emoji: '🔐',
            title: 'Wachtwoord Bewaker',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '🔑',
            title: 'Beginnend Beveiliger',
            color: '#0B453F',
        },
    ],
    takeaways: [
        'Korte wachtwoorden (6-8 tekens) worden in seconden gekraakt — lengte is de krachtigste bescherming.',
        'Symboolvervanging (@ voor a, 0 voor o) beschermt niet: hackers kennen alle variaties op bekende woorden.',
        'Credential stuffing: als één wachtwoord lekt, proberen hackers het automatisch op honderden andere sites — gebruik unieke wachtwoorden.',
        'Een passphrase (meerdere willekeurige woorden + symbool + cijfer) is lang, sterk én onthoudbaar.',
        'Een wachtwoordmanager is de praktische oplossing: die maakt en onthoudt unieke sterke wachtwoorden voor elke site.',
    ],
};

export default config;
