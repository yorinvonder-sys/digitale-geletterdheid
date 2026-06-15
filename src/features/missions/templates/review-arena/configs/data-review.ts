import type { ReviewArenaConfig } from '../ReviewArena';

export const dataReviewConfig: ReviewArenaConfig = {
    missionId: 'data-review',
    title: 'Data & Privacy Review',
    introEmoji: '🔐',
    introTitle: 'Wat weet jij over data en privacy?',
    introDescription:
        'Test je kennis over databronnen, persoonsgegevens en de AVG via vier afwisselende ronden. Elk type opgave vraagt iets anders van je.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Privacy Expert',
            color: '#e1ff01',
        },
        {
            minScore: 70,
            emoji: '🎯',
            title: 'Databewuste leerling',
            color: '#202023',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Kennis in opbouw',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#ff3c21',
        },
    ],
    takeaways: [
        'Overheidsdata en wetenschappelijk onderzoek zijn doorgaans betrouwbaarder dan sociale media.',
        'Persoonsgegevens zijn alle gegevens waarmee je iemand direct of indirect kunt identificeren.',
        'De AVG geeft burgers rechten: inzage, correctie, verwijdering en bezwaar.',
        'Encryptie beschermt data in opslag én tijdens transport.',
        'Geboortedatum op zichzelf is geen persoonsgegeven, maar in combinatie met naam wel.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Vertrouwbaarheid van databronnen',
            description:
                'Sorteer deze databronnen van meest betrouwbaar (boven) naar minst betrouwbaar (onder).',
            maxScore: 25,
            showConfidence: true,
            followUp: {
                question: 'Wat is het verschil tussen persoonsgegevens en bijzondere persoonsgegevens volgens de AVG?',
                options: ['Bijzondere gegevens zijn geheimer', 'Bijzondere gegevens onthullen gevoelige kenmerken zoals gezondheid of religie', 'Er is geen verschil', 'Bijzondere gegevens zijn alleen van kinderen'],
                correctIndex: 1,
                explanation: 'Bijzondere persoonsgegevens (artikel 9 AVG) onthullen gevoelige kenmerken zoals gezondheid, etniciteit, religie of seksuele geaardheid en vereisen extra bescherming.',
                bonusPoints: 5,
            },
            items: [
                {
                    id: 'cbs',
                    label: 'CBS (Centraal Bureau voor de Statistiek)',
                    correctPosition: 0,
                },
                {
                    id: 'peer-reviewed',
                    label: 'Peer-reviewed wetenschappelijk artikel',
                    correctPosition: 1,
                },
                {
                    id: 'krant',
                    label: 'Landelijk dagblad (NRC, de Volkskrant)',
                    correctPosition: 2,
                },
                {
                    id: 'wiki',
                    label: 'Wikipedia-pagina',
                    correctPosition: 3,
                },
                {
                    id: 'instagram',
                    label: 'Bericht op Instagram',
                    correctPosition: 4,
                },
                {
                    id: 'tiktok',
                    label: 'TikTok-video zonder bronvermelding',
                    correctPosition: 5,
                },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Datatype & beveiliging',
            description: 'Koppel elk datatype aan de passende beveiligingsmaatregel.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Wachtwoorden in een database',
                    right: 'Hashing (bijv. bcrypt)',
                },
                {
                    left: 'E-mails over het internet',
                    right: 'Versleuteling (TLS/SSL)',
                },
                {
                    left: 'Medisch dossier op een USB-stick',
                    right: 'Encryptie van het apparaat',
                },
                {
                    left: 'Gezichtsherkenningsdata',
                    right: 'Expliciete toestemming (opt-in)',
                },
                {
                    left: 'Inlogpogingen op een systeem',
                    right: 'Logging & monitoring',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'Persoonsgegeven of niet?',
            description:
                'Categoriseer elk item als "Persoonsgegeven" of "Geen persoonsgegeven" volgens de AVG.',
            maxScore: 25,
            showConfidence: true,
            categories: ['Persoonsgegeven', 'Geen persoonsgegeven'],
            items: [
                { label: 'Naam + geboortedatum', correctCategory: 'Persoonsgegeven' },
                { label: 'IP-adres', correctCategory: 'Persoonsgegeven' },
                { label: 'BSN-nummer', correctCategory: 'Persoonsgegeven' },
                { label: 'E-mailadres', correctCategory: 'Persoonsgegeven' },
                { label: 'Locatiedata van een telefoon', correctCategory: 'Persoonsgegeven' },
                { label: 'Anonieme statistische data', correctCategory: 'Geen persoonsgegeven' },
                { label: 'Geboortejaar (alleen het jaar)', correctCategory: 'Geen persoonsgegeven' },
                { label: 'Kleur van een willekeurig huis', correctCategory: 'Geen persoonsgegeven' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'AVG & Privacy: Waar of Onwaar?',
            description: 'Acht snelle vragen. Goed raden telt mee voor je streak-bonus!',
            maxScore: 25,
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Een school mag leerlingresultaten delen met adverteerders als de ouders dat hebben ondertekend.',
                    answer: false,
                    explanation:
                        'Schoolresultaten zijn bijzondere persoonsgegevens; voor commercieel gebruik is dit onder de AVG vrijwel nooit toegestaan.',
                },
                {
                    question: 'Je hebt het recht om een organisatie te vragen welke gegevens zij over jou hebben.',
                    answer: true,
                    explanation:
                        'Dit is het recht op inzage (art. 15 AVG). Elke EU-burger kan dit kosteloos opvragen.',
                },
                {
                    question: 'Een datalek moet altijd binnen 72 uur worden gemeld bij de Autoriteit Persoonsgegevens.',
                    answer: true,
                    explanation:
                        'Art. 33 AVG verplicht dit bij elk lek dat een risico vormt voor betrokkenen.',
                },
                {
                    question: 'Foto\'s op een beveiligde schoolserver zijn nooit persoonsgegevens.',
                    answer: false,
                    explanation:
                        'Foto\'s waarop personen herkenbaar zijn, zijn biometrische persoonsgegevens.',
                },
                {
                    question: 'De AVG geldt alleen voor bedrijven, niet voor scholen.',
                    answer: false,
                    explanation:
                        'De AVG geldt voor alle organisaties die persoonsgegevens verwerken, inclusief scholen en overheden.',
                },
                {
                    question: 'Je mag je eigen persoonsgegevens laten verwijderen ("recht op vergetelheid").',
                    answer: true,
                    explanation:
                        'Art. 17 AVG — je kunt verwijdering vragen, tenzij er een wettelijke bewaarverplichting geldt.',
                },
                {
                    question: 'Een sterk wachtwoord is altijd voldoende beveiliging voor persoonsgegevens.',
                    answer: false,
                    explanation:
                        'De AVG vereist passende technische én organisatorische maatregelen — één wachtwoord is niet voldoende.',
                },
                {
                    question: 'Data die is geanonimiseerd valt buiten de AVG.',
                    answer: true,
                    explanation:
                        'Echt geanonimiseerde data kan niet worden herleid naar een persoon en valt daarmee buiten de AVG — pseudonimisering is echter niet hetzelfde.',
                },
            ],
        },
    ],
};
