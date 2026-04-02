import type { PuzzleLabConfig } from '../puzzleLabTypes';

const config: PuzzleLabConfig = {
    missionId: 'wachtwoord-warrior',
    title: 'Wachtwoord Warrior',
    introEmoji: '🛡️',
    introTitle: 'Wachtwoord Warrior',
    introDescription:
        'In 2024 zijn meer dan 10 miljard wachtwoorden gelekt. Wachtwoorden als "123456" worden in minder dan 1 seconde gekraakt. Maar hoe werken aanvallen precies — en wat maakt een wachtwoord echt sterk? Bewijs dat jij je digitale leven kunt beschermen.',
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
            type: 'multiple-choice',
            description:
                'Een hacker gebruikt een computer die 1 miljard wachtwoorden per seconde kan proberen. Hoe lang duurt het om het wachtwoord **"abc123"** te kraken?\n\nHet wachtwoord heeft 6 tekens. Er zijn 26 kleine letters + 10 cijfers = 36 mogelijke tekens. Totaal aantal combinaties van 6 tekens: 36⁶ = 2.176.782.336.',
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
            options: [
                'Meerdere jaren — 6 tekens is genoeg voor veiligheid',
                'Enkele uren — een computer moet veel combinaties proberen',
                'Minder dan 1 minuut — maar de hacker heeft geluk nodig',
                'Minder dan 1 seconde — het staat in elke hackerswoordenlijst',
            ],
            answer: 'Minder dan 1 seconde — het staat in elke hackerswoordenlijst',
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
            type: 'multiple-choice',
            description:
                'Het wachtwoord **"P@ssw0rd!"** heeft:\n- Een hoofdletter ✓\n- Een speciaal teken ✓\n- Een cijfer ✓\n- Meer dan 8 tekens ✓\n\nToch wordt het als "zwak" beoordeeld. Waarom?',
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
            options: [
                'Het wachtwoord is te kort — minder dan 10 tekens',
                'Hackers kennen variaties op bekende woorden, waardoor symboolvervanging niet helpt',
                'Het bevat geen kleine letters, dus de computer kan het raden',
                'Het is niet sterk genoeg omdat het geen spaties bevat',
            ],
            answer: 'Hackers kennen variaties op bekende woorden, waardoor symboolvervanging niet helpt',
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
            type: 'multiple-choice',
            description:
                'Emma gebruikt het wachtwoord "Zomer2024!" voor haar e-mail, Instagram én haar schoolaccount. In 2024 lekt een grote game-site haar database — ook Emma\'s account (met hetzelfde wachtwoord) staat erin.\n\nWat is het gevaar voor Emma\'s andere accounts?',
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
            options: [
                'Geen gevaar — de game-site heeft niets te maken met haar andere accounts',
                'Weinig gevaar — hackers richten zich niet op individuele personen',
                'Groot gevaar — hackers proberen het gelekte wachtwoord automatisch op andere sites',
                'Gemiddeld gevaar — alleen als haar e-mailadres ook bekend is',
            ],
            answer: 'Groot gevaar — hackers proberen het gelekte wachtwoord automatisch op andere sites',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! Credential stuffing is geautomatiseerd: zodra één wachtwoord lekt, wordt het meteen geprobeerd op honderden andere populaire sites. Voor Emma betekent dit: haar e-mail, Instagram én schoolaccount zijn allemaal in gevaar. Unieke wachtwoorden per site zijn daarom essentieel.',
            hintCost: 4,
        },
        {
            id: 'sterk-wachtwoord-maken',
            title: 'Maak een echt sterk wachtwoord',
            type: 'text-input',
            description:
                'Nu jij weet hoe aanvallen werken, maak je een wachtwoord dat echt sterk is. Het moet aan ALLE eisen voldoen:\n\n• Minimaal 14 tekens lang\n• Minstens 1 hoofdletter (A–Z)\n• Minstens 1 cijfer (0–9)\n• Minstens 1 speciaal teken (!@#$%&*-_)\n• Geen herkenbaar woord of naam\n\nTip: gebruik een passphrase — meerdere willekeurige woorden met symbolen: "Paraplu#Boot7Ster"',
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
                    /[!@#$%&*\-_]/.test(s)
                );
            },
            caseSensitive: true,
            maxAttempts: 10,
            points: 25,
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
            color: '#F59E0B',
        },
        {
            minScore: 70,
            emoji: '🛡️',
            title: 'Security Warrior',
            color: '#6B7280',
        },
        {
            minScore: 40,
            emoji: '🔐',
            title: 'Wachtwoord Bewaker',
            color: '#10B981',
        },
        {
            minScore: 0,
            emoji: '🔑',
            title: 'Beginnend Beveiliger',
            color: '#3B82F6',
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
