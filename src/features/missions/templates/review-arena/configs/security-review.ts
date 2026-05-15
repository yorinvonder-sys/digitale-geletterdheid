import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'security-review',
    title: 'Security Review',
    introEmoji: '🔒',
    introTitle: 'Hoe veilig ben jij online?',
    introDescription:
        'Je hebt gewerkt als cyber detective, encryptie-expert en forensisch analist. Nu toets je of je de kernconcepten van cybersecurity echt begrijpt via vier afwisselende ronden.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Security Expert',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🛡️',
            title: 'Waakzame Verdediger',
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
        'Symmetrische encryptie gebruikt dezelfde sleutel voor versleutelen en ontsleutelen.',
        'Asymmetrische encryptie gebruikt een publieke sleutel (versleutelen) en een privésleutel (ontsleutelen).',
        'Phishing misleidt je om inloggegevens of persoonlijke data te geven via nepberichten.',
        'Tweefactorauthenticatie (2FA) voegt een extra beveiligingslaag toe naast je wachtwoord.',
        'Logbestanden zijn digitale sporen die laten zien wie wat wanneer heeft gedaan op een systeem.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Sterkte van wachtwoorden',
            description:
                'Sorteer deze wachtwoorden van het sterkste (boven) naar het zwakste (onder) op basis van beveiligingsprincipes.',
            maxScore: 25,
            showConfidence: true,
            followUp: {
                question: 'Waarom is een sterk wachtwoord alleen niet voldoende om je account te beschermen?',
                options: ['Omdat wachtwoorden altijd gekraakt kunnen worden', 'Omdat phishing je wachtwoord kan stelen, ongeacht de sterkte', 'Omdat computers steeds sneller worden', 'Omdat websites wachtwoorden niet goed opslaan'],
                correctIndex: 1,
                explanation: 'Zelfs het sterkste wachtwoord beschermt niet tegen phishing. Daarom is multi-factor authenticatie (MFA) essentieel als extra beveiligingslaag.',
                bonusPoints: 5,
            },
            items: [
                {
                    id: 'passphrase',
                    label: 'Paars!Giraffe42-Kastanje (lange wachtzin met symbolen)',
                    correctPosition: 0,
                },
                {
                    id: 'random',
                    label: 'xK9#mPq2!Zw (willekeurige tekens, 12 karakters)',
                    correctPosition: 1,
                },
                {
                    id: 'long-words',
                    label: 'fiets-school-appel (lange woorden, geen cijfers)',
                    correctPosition: 2,
                },
                {
                    id: 'short-complex',
                    label: 'P@ss1 (kort maar met symbolen)',
                    correctPosition: 3,
                },
                {
                    id: 'common',
                    label: 'welkom123 (veelgebruikt wachtwoord)',
                    correctPosition: 4,
                },
                {
                    id: 'name-date',
                    label: 'Mohamed2009 (naam + geboortejaar)',
                    correctPosition: 5,
                },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Aanval & tegenmaatregel',
            description: 'Koppel elk type cyberaanval aan de meest passende tegenmaatregel.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Phishing-aanval via e-mail',
                    right: 'Links controleren en afzender verifiëren',
                },
                {
                    left: 'Zwak wachtwoord geraden (brute force)',
                    right: 'Lang wachtwoord + 2FA activeren',
                },
                {
                    left: 'Malware op een USB-stick',
                    right: 'Automatisch uitvoeren van USB uitschakelen',
                },
                {
                    left: 'Man-in-the-middle aanval op wifi',
                    right: 'HTTPS gebruiken en VPN inschakelen',
                },
                {
                    left: 'DDoS-aanval overbelast een server',
                    right: 'Verkeer filteren via firewall en rate limiting',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Veilig of onveilig gedrag?',
            description: 'Bepaal of elk digitaal gedrag veilig of onveilig is.',
            maxScore: 25,
            showConfidence: true,
            categories: ['Veilig gedrag', 'Onveilig gedrag'],
            items: [
                { label: 'Voor elke dienst een ander wachtwoord gebruiken', correctCategory: 'Veilig gedrag' },
                { label: 'Inloggen op school-wifi zonder VPN voor gevoelige data', correctCategory: 'Onveilig gedrag' },
                { label: 'Software-updates direct installeren', correctCategory: 'Veilig gedrag' },
                { label: 'Wachtwoord opslaan in een notitie op je bureaublad', correctCategory: 'Onveilig gedrag' },
                { label: 'Tweefactorauthenticatie (2FA) aanzetten op accounts', correctCategory: 'Veilig gedrag' },
                { label: 'Op een link klikken zonder de URL te controleren', correctCategory: 'Onveilig gedrag' },
                { label: 'Een wachtwoordmanager gebruiken', correctCategory: 'Veilig gedrag' },
                { label: 'Hetzelfde wachtwoord voor school en Instagram gebruiken', correctCategory: 'Onveilig gedrag' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'Cybersecurity: Waar of Onwaar?',
            description: 'Acht snelle vragen over encryptie, phishing en digitale forensics.',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'HTTPS betekent dat de verbinding met een website versleuteld is.',
                    answer: true,
                    explanation: 'Het slotje en HTTPS geven aan dat data versleuteld wordt verzonden via TLS.',
                },
                {
                    question: 'Een sterk wachtwoord mag je gerust met vrienden delen.',
                    answer: false,
                    explanation: 'Een wachtwoord is persoonlijk en geheim — zelfs voor vrienden of IT-beheerders.',
                },
                {
                    question: 'Symmetrische encryptie gebruikt één sleutel voor versleutelen én ontsleutelen.',
                    answer: true,
                    explanation: 'Bij symmetrische encryptie (bijv. AES) heeft de ontvanger dezelfde sleutel als de verzender.',
                },
                {
                    question: 'Een phishing-mail is altijd duidelijk te herkennen aan spelfouten.',
                    answer: false,
                    explanation: 'Moderne phishing-aanvallen zijn goed geschreven en nauwelijks van echt te onderscheiden.',
                },
                {
                    question: 'Logbestanden kunnen bewijzen wie wanneer ingelogd is op een systeem.',
                    answer: true,
                    explanation: 'Logbestanden slaan tijdstempels, IP-adressen en acties op — essentieel voor digitaal forensisch onderzoek.',
                },
                {
                    question: 'Een VPN verbergt je IP-adres voor websites die je bezoekt.',
                    answer: true,
                    explanation: 'Een VPN stuurt je verkeer via een tussensysteem zodat websites het IP van de VPN-server zien.',
                },
                {
                    question: 'Tweefactorauthenticatie maakt je account volledig onhackbaar.',
                    answer: false,
                    explanation: '2FA verhoogt de beveiliging sterk, maar geen systeem is 100% onhackbaar — social engineering blijft een risico.',
                },
                {
                    question: 'Een firewall monitort en filtert inkomend en uitgaand netwerkverkeer.',
                    answer: true,
                    explanation: 'Een firewall is een digitale poortwachter die verdacht verkeer tegenhoudt op basis van regels.',
                },
            ],
        },
    ],
};

export default config;
