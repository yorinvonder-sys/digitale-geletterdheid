import type { PuzzleLabConfig } from '../puzzleLabTypes';

export const encryptionExpertConfig: PuzzleLabConfig = {
    missionId: 'encryption-expert',
    title: 'Encryptie Expert',
    introEmoji: '🔐',
    introTitle: 'Encryptie Expert',
    introDescription:
        'Welkom, hacker-in-opleiding. In deze missie leer je hoe mensen berichten geheim houden — van oude codes tot moderne encryptie. Kraak de puzzels en bewijs dat jij de codes begrijpt.',
    introFeatures: [
        'Kraak een Caesar-cijfer met schuif 3',
        'Decodeer een Base64-bericht',
        'Begrijp hoe publieke-sleutelencryptie werkt',
        'Maak een sterk wachtwoord dat aan alle eisen voldoet',
    ],
    maxScore: 100,
    puzzles: [
        {
            id: 'caesar-crack',
            title: 'Kraak het Caesar-cijfer',
            type: 'text-input',
            description:
                'Julius Caesar gebruikte een simpele code: elk letter in het bericht werd 3 posities naar rechts verschoven in het alfabet. A wordt D, B wordt E, Z wordt C. Jij hebt het gecodeerde bericht onderschept. Wat staat er echt?',
            clues: [
                'Het gecodeerde bericht is: YHLOLJ',
                'De schuif is 3 — elk letter is 3 posities naar rechts verschoven.',
                'Y → V, H → E, L → I, O → L, L → I, J → G',
            ],
            extraClues: [
                'Verschuif elke letter 3 posities TERUG in het alfabet (A=1, B=2, C=3 ... Z=26): Y=25, 25−3=22=V. H=8, 8−3=5=E. L=12, 12−3=9=I. O=15, 15−3=12=L.',
                'Het antwoord is een Nederlands woord dat te maken heeft met bescherming.',
            ],
            revealExtraAfterAttempts: 3,
            answer: ['veilig', 'VEILIG'],
            caseSensitive: false,
            maxAttempts: 6,
            points: 25,
            successMessage:
                'Correct! YHLOLJ → VEILIG. Elke letter 3 posities terug: Y→V, H→E, L→I, O→L, L→I, J→G.',
            hintCost: 3,
        },
        {
            id: 'base64-decode',
            title: 'Decodeer het Base64-bericht',
            type: 'text-input',
            description:
                'Base64 is geen echte encryptie — het is een manier om data om te zetten naar tekst zodat computers het makkelijk kunnen versturen. Maar voor mensen ziet het er geheimzinnig uit! Het gecodeerde bericht is: d2FjaHR3b29yZA==\n\nBase64 werkt met blokjes van 3 bytes → 4 tekens. Elk teken staat voor een getal 0–63 (A=0, B=1 ... Z=25, a=26 ... z=51, 0=52 ... 9=61, +=62, /=63).',
            clues: [
                'Base64 is geen echte encryptie — iedereen kan het decoderen.',
                'd2FjaHR3b29yZA== is het gecodeerde woord.',
                'Plak de code in een Base64-decoder als je één hebt. Of: de eerste 4 tekens "d2Fj" staan voor de letters w, a, c, h.',
            ],
            extraClues: [
                'Verder: "aHR3" → t, w, o. En "b29y" → o, r, d. De "==" aan het einde zijn padding-tekens.',
                'Het antwoord is een Nederlands woord: de letters zijn w-a-c-h-t-w-o-o-r-d.',
            ],
            revealExtraAfterAttempts: 2,
            answer: ['wachtwoord', 'WACHTWOORD'],
            caseSensitive: false,
            maxAttempts: 5,
            points: 25,
            successMessage:
                'Goed gedaan! d2FjaHR3b29yZA== decodeert naar "wachtwoord". Base64 beschermt NIKS — gebruik het dus nooit als echte beveiliging.',
            hintCost: 4,
        },
        {
            id: 'public-key',
            title: 'Wie kan het bericht lezen?',
            type: 'multiple-choice',
            description:
                'Stel: Emma wil een geheim bericht sturen naar Liam. Liam heeft een publieke sleutel (die iedereen mag weten) en een privésleutel (die alleen Liam heeft).\n\nEmma versleutelt het bericht met Liams PUBLIEKE sleutel. Wie kan het bericht nu ontsleutelen en lezen?',
            clues: [
                'Bij asymmetrische encryptie zijn er twee sleutels: een publieke en een privé.',
                'Wat versleuteld is met de publieke sleutel, kan alleen ontsleuteld worden met de bijbehorende privésleutel.',
                'De publieke sleutel mag iedereen hebben — de privésleutel bewaar je zelf.',
            ],
            options: [
                'Iedereen, want de publieke sleutel is openbaar',
                'Alleen Emma, want zij heeft het bericht verstuurd',
                'Alleen Liam, want hij heeft de privésleutel',
                'Zowel Emma als Liam, want zij zijn allebei betrokken',
            ],
            revealExtraAfterAttempts: 999,
            answer: 'Alleen Liam, want hij heeft de privésleutel',
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Precies! Alleen Liam kan het bericht lezen — want alleen hij heeft de privésleutel die hoort bij zijn publieke sleutel. Dit is het principe achter HTTPS, e-mail-encryptie en Signal.',
            hintCost: 5,
        },
        {
            id: 'strong-password',
            title: 'Maak een sterk wachtwoord',
            type: 'text-input',
            description:
                'Tijd om het geleerde te gebruiken! Maak een wachtwoord dat aan ALLE onderstaande eisen voldoet:\n\n• Minimaal 12 tekens lang\n• Minstens 1 hoofdletter (A–Z)\n• Minstens 1 cijfer (0–9)\n• Minstens 1 speciaal teken (!@#$%^&*)\n• Geen echte naam of woord (dus niet "Welkom123!")\n\nType je wachtwoord hieronder. Het systeem controleert automatisch of het aan de eisen voldoet.',
            clues: [
                'Gebruik een zin als basis: "IkHoud2VanPizza!" is al een stuk beter dan "pizza123".',
                'Afkortingen werken goed: "MijnHond@Heet5Bobby" is lang en complex.',
                'Mix letters, cijfers en symbolen door elkaar: "T!ger$7Rend3r".',
            ],
            extraClues: [
                'Probeer een patroon van 3 woorden + cijfer + symbool: "Rood#Fiets9Boom!" voldoet aan alle eisen.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.trim();
                return (
                    s.length >= 12 &&
                    /[A-Z]/.test(s) &&
                    /[0-9]/.test(s) &&
                    /[!@#$%^&*]/.test(s) &&
                    !/^[a-zA-Z]+$/.test(s)
                );
            },
            caseSensitive: true,
            maxAttempts: 10,
            points: 25,
            successMessage:
                'Uitstekend! Jij begrijpt wat een sterk wachtwoord is. In de praktijk: gebruik een wachtwoordmanager zodat je voor elke site een ander sterk wachtwoord hebt.',
            hintCost: 2,
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Master Cryptograaf',
            color: '#e1ff01',
        },
        {
            minScore: 70,
            emoji: '🥈',
            title: 'Gevorderd Hacker',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔐',
            title: 'Code Kraker',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '📖',
            title: 'Leerling Cryptograaf',
            color: '#202023',
        },
    ],
    takeaways: [
        'Het Caesar-cijfer is een van de oudste codes — maar ook de zwakste. Moderne computers kraken het in milliseconden.',
        'Base64 is GEEN encryptie — het is alleen codering voor transport. Behandel Base64-data nooit als geheim.',
        'Asymmetrische encryptie (publiek + privé sleutel) is de basis van veilig internet: HTTPS, Signal, e-mail-encryptie.',
        'Een sterk wachtwoord heeft lengte, variatie en geen herkenbare woorden — en je gebruikt voor elke site een ander wachtwoord.',
    ],
};
