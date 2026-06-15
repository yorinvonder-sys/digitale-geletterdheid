import type { SimulationLabConfig, VisualData } from '../SimulationLab';

// ─── computeVisuals ───────────────────────────────────────────────────────────
// Switch/case over simId — no eval, pure TypeScript.

function computeVisuals(
    simId: string,
    params: Record<string, number | string | boolean>
): VisualData {
    // ── Sim 1: Foutmeldingen lezen → Meter (Debug Score) ──────────────────────
    if (simId === 'foutmelding-lezen') {
        // fouttype: 0 = syntax error, 1 = runtime error, 2 = logische fout
        const fouttype = params['fouttype'] as number ?? 0;
        // diagnose: true = correcte diagnose, false = geen idee
        const diagnose = params['diagnose'] as boolean ?? false;
        // consolelog: 0 = nee, 1 = een keer, 2 = systematisch
        const consolelog = params['consolelog'] as number ?? 0;

        // Score: fouttype herkennen geeft 0-30, diagnose 0-40, consolelog 0-30
        const fouttypeScore = fouttype === 0 ? 25 : fouttype === 1 ? 30 : 20;
        const diagnoseScore = diagnose ? 40 : 0;
        const consolelogScore = consolelog === 0 ? 0 : consolelog === 1 ? 15 : 30;
        const score = fouttypeScore + diagnoseScore + consolelogScore;

        const sublabel =
            score <= 25
                ? 'Je begint net met debuggen'
                : score <= 50
                ? 'Je herkent het probleem, maar zoekt nog'
                : score <= 75
                ? 'Goed speurwerk — je bent op het juiste spoor'
                : 'Expert debugger — je vindt elke bug!';

        return { type: 'meter', data: { value: score, label: 'Debug Score', sublabel } };
    }

    // ── Sim 2: Soorten bugs → BarChart (Bug Gevaar Score) ─────────────────────
    if (simId === 'soorten-bugs') {
        const syntaxFout = params['syntax-fout'] as boolean ?? false;
        const naamFout = params['naam-fout'] as boolean ?? false;
        const logicaFout = params['logica-fout'] as boolean ?? false;
        const offByOne = params['off-by-one'] as boolean ?? false;
        const typesFout = params['types-fout'] as boolean ?? false;

        const bars = [
            {
                label: 'Syntax',
                value: syntaxFout ? 3 : 0,
                color: syntaxFout ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Naamgeving',
                value: naamFout ? 2 : 0,
                color: naamFout ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Logica',
                value: logicaFout ? 5 : 0,
                color: logicaFout ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Off-by-one',
                value: offByOne ? 4 : 0,
                color: offByOne ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Types',
                value: typesFout ? 4 : 0,
                color: typesFout ? '#ff3c21' : '#e3e2dc',
            },
        ];

        return { type: 'bar-chart', data: bars };
    }

    // ── Sim 3: Debugstrategie → Comparison (Aanpak vs Resultaat) ─────────────
    if (simId === 'debugstrategie') {
        const strategie = params['strategie'] as string ?? 'Willekeurig aanpassen';

        if (strategie === 'Willekeurig aanpassen') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Jouw aanpak',
                    leftItems: [
                        { icon: '🎲', label: 'Willekeurig code aanpassen' },
                        { icon: '🔄', label: 'Hopen dat het werkt' },
                        { icon: '❓', label: 'Geen idee wat er fout gaat' },
                        { icon: '⏱️', label: 'Veel tijd kwijt' },
                    ],
                    rightTitle: 'Resultaat',
                    rightItems: [
                        { icon: '❌', label: 'Bug is niet echt opgelost' },
                        { icon: '❌', label: 'Nieuwe bugs geïntroduceerd' },
                        { icon: '❌', label: 'Je leert er niets van' },
                        { icon: '⚠️', label: 'Zelfde fout later opnieuw' },
                    ],
                },
            };
        }

        if (strategie === 'Console.log gebruiken') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Jouw aanpak',
                    leftItems: [
                        { icon: '🖨️', label: 'Variabelen printen met console.log' },
                        { icon: '🔍', label: 'Controleren welke waarden variabelen hebben' },
                        { icon: '📍', label: 'Stap voor stap doorlopen' },
                    ],
                    rightTitle: 'Resultaat',
                    rightItems: [
                        { icon: '✅', label: 'Bug gelokaliseerd' },
                        { icon: '✅', label: 'Je begrijpt wat er fout ging' },
                        { icon: '⚠️', label: 'Vergeet console.logs te verwijderen' },
                        { icon: '⚠️', label: 'Werkt niet bij complexe fouten' },
                    ],
                },
            };
        }

        // Systematisch debuggen
        return {
            type: 'comparison',
            data: {
                leftTitle: 'Jouw aanpak',
                leftItems: [
                    { icon: '📋', label: 'Foutmelding zorgvuldig lezen' },
                    { icon: '🔬', label: 'Bug reproduceren in kleine stappen' },
                    { icon: '📍', label: 'Oorzaak lokaliseren in de code' },
                    { icon: '✏️', label: 'Gerichte fix schrijven en testen' },
                ],
                rightTitle: 'Resultaat',
                rightItems: [
                    { icon: '✅', label: 'Bug echt opgelost' },
                    { icon: '✅', label: 'Geen nieuwe bugs geïntroduceerd' },
                    { icon: '✅', label: 'Je begrijpt jouw eigen code beter' },
                    { icon: '✅', label: 'Sneller bij de volgende bug' },
                ],
            },
        };
    }

    // Fallback
    return { type: 'meter', data: { value: 0, label: 'Geen data' } };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const bugHunterConfig: SimulationLabConfig = {
    missionId: 'bug-hunter',
    title: 'Bug Hunter',
    introEmoji: '🐛',
    introTitle: 'Bug Hunter',
    introDescription:
        'Een bug opsporen is een echte vaardigheid. Oefen met debuggen: leer foutmeldingen lezen, soorten bugs herkennen en een slimme strategie kiezen.',
    missionGoal: {
        primaryGoal: 'Ik spoor bugs systematisch op door foutmeldingen, bugtypen en debugstrategieen te analyseren.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Alle drie debug-simulaties zijn afgerond met keuzes en antwoorden over foutanalyse.',
        },
        evidence: 'Antwoorden over foutmeldingen, bugtypen, debugstrategieen en de behaalde debugscore.',
    },
    introFeatures: [
        'Sim 1 — Lees foutmeldingen en stel je debug-score in',
        'Sim 2 — Ontdek welke bugs het gevaarlijkst zijn',
        'Sim 3 — Vergelijk debugstrategieën en hun resultaat',
    ],
    computeVisuals,
    simulations: [
        {
            id: 'foutmelding-lezen',
            title: 'Foutmeldingen lezen',
            description:
                'Stel in hoe je omgaat met een foutmelding. Pas de opties aan en kijk hoe jouw Debug Score verandert.',
            visualType: 'meter',
            maxScore: 30,
            parameters: [
                {
                    id: 'fouttype',
                    label: 'Soort fout herkennen',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'diagnose',
                    label: 'Diagnose stellen (weet ik wat er mis gaat)',
                    type: 'toggle',
                    defaultToggle: false,
                },
                {
                    id: 'consolelog',
                    label: 'Console.log gebruiken',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
            ],
            questions: [
                {
                    id: 'fl1-q1',
                    question:
                        'Wat is het eerste wat je doet als je een foutmelding ziet?',
                    type: 'multiple-choice',
                    options: [
                        'Alle code verwijderen en opnieuw beginnen',
                        'De foutmelding zorgvuldig lezen en de regelnummer noteren',
                        'Vragen aan een klasgenoot om jouw code over te nemen',
                        'Alles wat je net veranderd hebt ongedaan maken',
                    ],
                    correctAnswer: 'De foutmelding zorgvuldig lezen en de regelnummer noteren',
                    explanation:
                        'Een foutmelding vertelt je exact waar en wat er mis gaat. Het regelnummer en de omschrijving zijn jouw startpunt — lees ze altijd als eerste.',
                    points: 10,
                },
                {
                    id: 'fl1-q2',
                    question:
                        'Wat is het verschil tussen een syntax error en een runtime error?',
                    type: 'multiple-choice',
                    options: [
                        'Er is geen verschil — beide stoppen de code',
                        'Syntax error = schrijffout in code; runtime error = fout die pas optreedt tijdens uitvoering',
                        'Runtime error = schrijffout in code; syntax error = logische fout',
                        'Syntax errors zijn gevaarlijker dan runtime errors',
                    ],
                    correctAnswer: 'Syntax error = schrijffout in code; runtime error = fout die pas optreedt tijdens uitvoering',
                    explanation:
                        'Een syntax error is als een spelfout: de computer begrijpt jou niet. Een runtime error treedt op terwijl de code draait, zoals een variabele die niet bestaat wanneer je er iets mee doet.',
                    points: 10,
                },
                {
                    id: 'fl1-q3',
                    question: 'Waarvoor gebruik je console.log bij het debuggen?',
                    type: 'multiple-choice',
                    options: [
                        'Om de code te versnellen',
                        'Om te zien welke waarden variabelen hebben op een bepaald moment',
                        'Om foutmeldingen permanent te verbergen',
                        'Om de code te exporteren naar een bestand',
                    ],
                    correctAnswer: 'Om te zien welke waarden variabelen hebben op een bepaald moment',
                    explanation:
                        'Console.log laat je "kijken" in de code terwijl hij draait. Je ziet of een variabele de verwachte waarde heeft, zodat je kunt bepalen waar het misgaat.',
                    points: 10,
                },
            ],
        },
        {
            id: 'soorten-bugs',
            title: 'Soorten bugs herkennen',
            description:
                'Zet verschillende bugtypen aan en kijk hoe gevaarlijk ze zijn. Welke bug heeft de grootste impact?',
            visualType: 'bar-chart',
            maxScore: 40,
            parameters: [
                { id: 'syntax-fout', label: 'Syntax fout (bijv. ontbrekend haakje)', type: 'toggle', defaultToggle: false },
                { id: 'naam-fout', label: 'Naamgevingsfout (variabele heet "x")', type: 'toggle', defaultToggle: false },
                { id: 'logica-fout', label: 'Logische fout (verkeerde berekening)', type: 'toggle', defaultToggle: false },
                { id: 'off-by-one', label: 'Off-by-one fout (telt één te ver)', type: 'toggle', defaultToggle: false },
                { id: 'types-fout', label: 'Type fout (getal behandeld als tekst)', type: 'toggle', defaultToggle: false },
            ],
            questions: [
                {
                    id: 'sb1-q1',
                    question: 'Welke bug is het moeilijkst om te vinden?',
                    type: 'multiple-choice',
                    options: [
                        'Syntax fout — de editor toont direct een fout',
                        'Logische fout — de code werkt, maar geeft verkeerde uitkomsten',
                        'Naamgevingsfout — de variabele heet iets anders',
                        'Off-by-one fout — er staat i <= 10 in plaats van i < 10',
                    ],
                    correctAnswer: 'Logische fout — de code werkt, maar geeft verkeerde uitkomsten',
                    explanation:
                        'Logische fouten zijn het gevaarlijkst omdat de code gewoon draait zonder foutmelding. Je ziet pas iets mis is als je de uitkomst controleert. Syntax fouten worden juist als eerste gevonden.',
                    points: 15,
                },
                {
                    id: 'sb1-q2',
                    question:
                        'Je hebt de code: `for (let i = 0; i <= 5; i++)` maar je wil precies 5 elementen doorlopen (0 t/m 4). Welke bug bevat dit?',
                    type: 'multiple-choice',
                    options: [
                        'Syntax fout — de lus is verkeerd geschreven',
                        'Off-by-one fout — de lus loopt één stap te ver (tot 5 inclusief)',
                        'Type fout — i moet een string zijn',
                        'Logische fout — de lus gaat de verkeerde richting op',
                    ],
                    correctAnswer: 'Off-by-one fout — de lus loopt één stap te ver (tot 5 inclusief)',
                    explanation:
                        'i <= 5 betekent dat de lus loopt van 0 t/m 5 — dat zijn 6 stappen. Voor precies 5 elementen gebruik je i < 5. Off-by-one is een veelgemaakte fout bij lussen en lijsten.',
                    points: 10,
                },
                {
                    id: 'sb1-q3',
                    question:
                        'Waarom is een variabele de naam "x" geven een probleem, ook al werkt de code?',
                    type: 'multiple-choice',
                    options: [
                        'De computer begrijpt de naam "x" niet',
                        'Over 2 weken weet jij (of een ander) niet meer wat "x" betekent',
                        'Korte variabelenamen zijn verboden in alle programmeertalen',
                        'Het veroorzaakt automatisch een runtime error',
                    ],
                    correctAnswer: 'Over 2 weken weet jij (of een ander) niet meer wat "x" betekent',
                    explanation:
                        'Slechte naamgeving is geen bug die de code stopt, maar wel een onderhoudsprobleem. Code moet leesbaar zijn voor mensen. Een naam als "leeftijdGebruiker" is duidelijker dan "x".',
                    points: 15,
                },
            ],
        },
        {
            id: 'debugstrategie',
            title: 'De juiste debugstrategie',
            description:
                'Kies hoe je een bug aanpakt. Vergelijk de aanpak met het resultaat.',
            visualType: 'comparison',
            maxScore: 30,
            parameters: [
                {
                    id: 'strategie',
                    label: 'Debugstrategie',
                    type: 'select',
                    options: ['Willekeurig aanpassen', 'Console.log gebruiken', 'Systematisch debuggen'],
                    defaultOption: 'Willekeurig aanpassen',
                },
            ],
            questions: [
                {
                    id: 'ds1-q1',
                    question:
                        'Een klasgenoot "fixt" een bug door willekeurig dingen te veranderen totdat het werkt. Wat is het probleem?',
                    type: 'multiple-choice',
                    options: [
                        'Helemaal geen probleem — als het werkt, is het goed',
                        'Ze begrijpen de oorzaak niet en dezelfde bug keert later terug',
                        'Ze mogen geen code aanpassen zonder toestemming',
                        'Willekeurig aanpassen duurt precies even lang als systematisch debuggen',
                    ],
                    correctAnswer: 'Ze begrijpen de oorzaak niet en dezelfde bug keert later terug',
                    explanation:
                        'Debuggen gaat niet over toevallig werkende code, maar over begrijpen wat er mis ging. Zonder diagnose los je het symptoom op, niet de oorzaak — en de fout duikt later opnieuw op.',
                    points: 10,
                },
                {
                    id: 'ds1-q2',
                    question:
                        'Wat zijn de vier stappen van systematisch debuggen?',
                    type: 'multiple-choice',
                    options: [
                        'Schrijven → Testen → Verwijderen → Opnieuw schrijven',
                        'Reproduceren → Lokaliseren → Diagnosticeren → Fixen',
                        'Googelen → Kopiëren → Plakken → Hopen',
                        'Foutmelding negeren → Code opslaan → Opnieuw opstarten → Klaar',
                    ],
                    correctAnswer: 'Reproduceren → Lokaliseren → Diagnosticeren → Fixen',
                    explanation:
                        'Stap 1: reproduceer de bug zodat je hem betrouwbaar kunt triggeren. Stap 2: lokaliseer waar in de code het misgaat. Stap 3: begrijp waarom. Stap 4: schrijf een gerichte fix.',
                    points: 10,
                },
                {
                    id: 'ds1-q3',
                    question:
                        'Na het fixen van een bug doe je: de fix testen met het geval dat de bug triggerde. Waarom is dat extra stap belangrijk?',
                    type: 'multiple-choice',
                    options: [
                        'Het is niet nodig als je zeker weet dat de fix klopt',
                        'Om te verifiëren dat de bug echt weg is en je geen nieuwe bugs hebt geïntroduceerd',
                        'Alleen om te kunnen aantonen aan je docent dat je het hebt gedaan',
                        'Testen is alleen nodig bij professionele software, niet bij schoolopdrachten',
                    ],
                    correctAnswer: 'Om te verifiëren dat de bug echt weg is en je geen nieuwe bugs hebt geïntroduceerd',
                    explanation:
                        'Een fix kan nieuwe, subtiele bugs introduceren. Testen na elke wijziging is een professionele gewoonte die fouten voorkomt voordat anderen de code gebruiken.',
                    points: 10,
                },
            ],
        },
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Master Debugger',
            color: '#202023',
        },
        {
            minScore: 70,
            emoji: '🐛',
            title: 'Bug Hunter Pro',
            color: '#ff3c21',
        },
        {
            minScore: 50,
            emoji: '🔍',
            title: 'Foutspeurder',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Startende Bug Hunter',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '📖',
            title: 'Aan het leren',
            color: '#202023',
        },
    ],
    takeaways: [
        'Lees de foutmelding altijd eerst volledig — het regelnummer en de omschrijving zijn jouw startpunt.',
        'Logische fouten zijn het gevaarlijkst: de code draait gewoon, maar geeft verkeerde uitkomsten.',
        'Console.log is je beste vriend: gebruik het om te zien wat variabelen bevatten terwijl de code draait.',
        'Systematisch debuggen betekent: reproduceer → lokaliseer → diagnosticeer → fix — in die volgorde.',
        'Goede variabelenamen zijn geen luxe maar noodzaak — ze voorkomen verwarrende bugs later.',
    ],
};

export default bugHunterConfig;
