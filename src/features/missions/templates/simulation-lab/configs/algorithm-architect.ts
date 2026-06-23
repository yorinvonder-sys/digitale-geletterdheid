import type { SimulationLabConfig, VisualData } from '../SimulationLab';

// ─── computeVisuals ───────────────────────────────────────────────────────────
// Switch/case over simId — no eval, pure TypeScript.

function computeVisuals(
    simId: string,
    params: Record<string, number | string | boolean>
): VisualData {
    // ── Sim 1: Zoekalgoritme → Meter (Efficiëntiescore) ───────────────────────
    if (simId === 'zoekalgoritme') {
        // lijstgrootte: 0 = 10, 1 = 100, 2 = 1000 items
        const lijstgrootte = params['lijstgrootte'] as number ?? 0;
        // algoritme: 0 = lineair zoeken, 1 = binair zoeken
        const algoritme = params['algoritme'] as number ?? 0;
        // gesorteerd: true = lijst is gesorteerd, false = niet
        const gesorteerd = params['gesorteerd'] as boolean ?? false;

        // Lineair zoeken: altijd O(n) — schaal heeft grote impact
        // Binair zoeken: O(log n) maar alleen op gesorteerde lijst
        let stappen = 0;
        if (lijstgrootte === 0) stappen = 10;
        else if (lijstgrootte === 1) stappen = 100;
        else stappen = 1000;

        let score = 0;
        if (algoritme === 0) {
            // Lineair: stappen is alles — hoe groter, hoe minder efficiënt
            score = lijstgrootte === 0 ? 60 : lijstgrootte === 1 ? 30 : 10;
        } else {
            // Binair: alleen efficiënt als gesorteerd
            if (!gesorteerd) {
                score = 20; // Binair op ongesorteerde lijst werkt niet goed
            } else {
                // log2(10) ≈ 4, log2(100) ≈ 7, log2(1000) ≈ 10
                score = lijstgrootte === 0 ? 90 : lijstgrootte === 1 ? 85 : 80;
            }
        }

        const stappenLabel = algoritme === 1 && gesorteerd
            ? `~${lijstgrootte === 0 ? 4 : lijstgrootte === 1 ? 7 : 10} stappen (binair zoeken)`
            : `~${stappen} stappen (lineair zoeken)`;

        return {
            type: 'meter',
            data: { value: score, label: 'Efficiëntiescore', sublabel: stappenLabel },
        };
    }

    // ── Sim 2: Sorteeralgoritme → BarChart (Vergelijkingskosten) ──────────────
    if (simId === 'sorteeralgoritme') {
        const bubbleSort = params['bubble-sort'] as boolean ?? false;
        const selectionSort = params['selection-sort'] as boolean ?? false;
        const insertionSort = params['insertion-sort'] as boolean ?? false;
        const snelSorteren = params['snel-sorteren'] as boolean ?? false;

        // Relatieve vergelijkingskosten voor 100 elementen (geschaald 0-5)
        const bars = [
            {
                label: 'Bubble Sort',
                value: bubbleSort ? 5 : 0,
                color: bubbleSort ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Selection Sort',
                value: selectionSort ? 4 : 0,
                color: selectionSort ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Insertion Sort',
                value: insertionSort ? 3 : 0,
                color: insertionSort ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Snel Sorteren',
                value: snelSorteren ? 2 : 0,
                color: snelSorteren ? '#202023' : '#e3e2dc',
            },
        ];

        return { type: 'bar-chart', data: bars };
    }

    // ── Sim 3: Pseudocode schrijven → Comparison (Plan vs Code) ───────────────
    if (simId === 'pseudocode') {
        const aanpak = params['aanpak'] as string ?? 'Direct code schrijven';

        if (aanpak === 'Direct code schrijven') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Jouw aanpak',
                    leftItems: [
                        { icon: '⌨️', label: 'Meteen beginnen met code typen' },
                        { icon: '🎲', label: 'Structuur bedenken terwijl je bezig bent' },
                        { icon: '🔄', label: 'Veel herstarten als het niet werkt' },
                        { icon: '⏱️', label: 'Veel tijd kwijt aan fouten oplossen' },
                    ],
                    rightTitle: 'Wat er gebeurt',
                    rightItems: [
                        { icon: '❌', label: 'Fouten in de structuur pas laat ontdekt' },
                        { icon: '❌', label: 'Moeilijk te begrijpen voor anderen' },
                        { icon: '⚠️', label: 'Soms werkt het toevallig' },
                        { icon: '❌', label: 'Geen duidelijk plan achteraf' },
                    ],
                },
            };
        }

        if (aanpak === 'Stroomschema tekenen') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Jouw aanpak',
                    leftItems: [
                        { icon: '📊', label: 'Visueel de stappen intekenen' },
                        { icon: '🔀', label: 'Keuzemomenten zichtbaar maken (ja/nee)' },
                        { icon: '🔄', label: 'Lussen tekenen met terugkoppeling' },
                    ],
                    rightTitle: 'Wat er gebeurt',
                    rightItems: [
                        { icon: '✅', label: 'Structuur duidelijk voor iedereen' },
                        { icon: '✅', label: 'Fouten in logica vroeg gevonden' },
                        { icon: '⚠️', label: 'Meer werk vooraf' },
                        { icon: '✅', label: 'Code schrijven gaat sneller daarna' },
                    ],
                },
            };
        }

        // Pseudocode schrijven
        return {
            type: 'comparison',
            data: {
                leftTitle: 'Jouw aanpak',
                leftItems: [
                    { icon: '✏️', label: 'Stappen opschrijven in gewone taal' },
                    { icon: '📋', label: '"Als X dan Y, anders Z" structuren' },
                    { icon: '🔄', label: '"Herhaal voor elk item in de lijst"' },
                    { icon: '🧪', label: 'Doorlopen met een voorbeeld vooraf' },
                ],
                rightTitle: 'Wat er gebeurt',
                rightItems: [
                    { icon: '✅', label: 'Logica gecontroleerd zonder code te schrijven' },
                    { icon: '✅', label: 'Taalbarrière weg — iedereen begrijpt het' },
                    { icon: '✅', label: 'Omzetten naar code gaat makkelijker' },
                    { icon: '✅', label: 'Beste voorbereiding voor elk algoritme' },
                ],
            },
        };
    }

    // Fallback
    return { type: 'meter', data: { value: 0, label: 'Geen data' } };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const algorithmArchitectConfig: SimulationLabConfig = {
    missionId: 'algorithm-architect',
    title: 'Algorithm Architect',
    introEmoji: '⚙️',
    introTitle: 'Algorithm Architect',
    introDescription:
        'Een algoritme is een recept voor computers: stap-voor-stap instructies om een probleem op te lossen. Ontdek hoe zoek- en sorteeralgoritmes werken en waarom het ene sneller is dan het andere.',
    missionGoal: {
        primaryGoal: 'Ik vergelijk algoritmes en leg uit wanneer een zoek-, sorteer- of pseudocode-aanpak efficient is.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Alle drie simulaties zijn doorlopen met antwoorden over zoeken, sorteren en pseudocode.',
        },
        evidence: 'Ingevulde simulatievragen, scores per algoritme-onderdeel en een uitleg van de gekozen aanpak.',
    },
    introFeatures: [
        'Sim 1 — Vergelijk lineair en binair zoeken',
        'Sim 2 — Ontdek de kosten van sorteeralgoritmes',
        'Sim 3 — Oefen met pseudocode als eerste stap',
    ],
    computeVisuals,
    simulations: [
        {
            id: 'zoekalgoritme',
            title: 'Zoekalgoritmes vergelijken',
            description:
                'Pas de lijstgrootte en het algoritme aan. Zie hoeveel stappen het algoritme nodig heeft.',
            visualType: 'meter',
            maxScore: 30,
            followUp: {
                question: 'Wat zie je gebeuren met de zoektijd als je de lijst veel groter maakt?',
                options: ['De zoektijd blijft altijd hetzelfde', 'De zoektijd wordt iets langer, nauwelijks merkbaar', 'Lineair zoeken heeft veel meer stappen nodig — de tijd groeit mee met de lijstgrootte', 'Binair zoeken wordt langzamer dan lineair zoeken'],
                correctIndex: 2,
                explanation: 'Bij lineair zoeken moet je bij een grotere lijst ook meer stappen zetten: 10 items → ~10 stappen, 1000 items → ~1000 stappen. Binair zoeken groeit veel minder snel: bij 1000 items nog maar ~10 stappen. Daarom is de keuze van algoritme belangrijk bij grote lijsten.',
                bonusPoints: 5,
            },
            parameters: [
                {
                    id: 'lijstgrootte',
                    label: 'Lijstgrootte',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'algoritme',
                    label: 'Zoekalgoritme (0 = lineair, 1 = binair)',
                    type: 'slider',
                    min: 0,
                    max: 1,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'gesorteerd',
                    label: 'Lijst is gesorteerd',
                    type: 'toggle',
                    defaultToggle: false,
                },
            ],
            questions: [
                {
                    id: 'za1-q1',
                    question:
                        'Wat is het grootste voordeel van binair zoeken ten opzichte van lineair zoeken?',
                    type: 'multiple-choice',
                    options: [
                        'Binair zoeken werkt ook op ongesorteerde lijsten',
                        'Binair zoeken halveert elke stap het zoekgebied — veel minder stappen nodig',
                        'Lineair zoeken is altijd sneller bij korte lijsten',
                        'Binair zoeken heeft geen lijst nodig',
                    ],
                    correctAnswer: 'Binair zoeken halveert elke stap het zoekgebied — veel minder stappen nodig',
                    explanation:
                        'Binair zoeken begint in het midden: is het item groter of kleiner? Zo halveer je elke keer de mogelijkheden. In een lijst van 1000 items heb je maar ~10 stappen nodig in plaats van 1000.',
                    points: 10,
                },
                {
                    id: 'za1-q2',
                    question: 'Wanneer mag je binair zoeken gebruiken?',
                    type: 'multiple-choice',
                    options: [
                        'Altijd — binair zoeken werkt bij elke lijst',
                        'Alleen bij gesorteerde lijsten',
                        'Alleen bij lijsten met minder dan 100 items',
                        'Alleen bij getallen, niet bij namen',
                    ],
                    correctAnswer: 'Alleen bij gesorteerde lijsten',
                    explanation:
                        'Binair zoeken werkt alleen als de lijst gesorteerd is. Als je niet weet of het linker of rechter deel kleiner is, kun je het zoekgebied niet halveren.',
                    points: 10,
                },
                {
                    id: 'za1-q3',
                    question:
                        'Je hebt de simulatie gedraaid met binair zoeken op 1000 items. Hoeveel stappen zag je in de meter staan?',
                    type: 'multiple-choice',
                    options: [
                        '1000 stappen — elk item één keer',
                        '500 stappen — de helft van de lijst',
                        '~10 stappen — binair zoeken halveert elke keer',
                        '1 stap — binair zoeken vindt altijd direct',
                    ],
                    correctAnswer: '~10 stappen — binair zoeken halveert elke keer',
                    explanation:
                        'Binair zoeken halveert elke stap het zoekgebied. Bij 1000 items zie je in de simulatie ~10 stappen. Vergeleken met de ~1000 stappen van lineair zoeken is dat een enorm verschil — en hoe groter de lijst, hoe groter dat voordeel.',
                    points: 10,
                },
            ],
        },
        {
            id: 'sorteeralgoritme',
            title: 'Sorteeralgoritmes vergelijken',
            description:
                'Zet sorteeralgoritmes aan en vergelijk hun kosten. Welk algoritme is het zuinigst?',
            visualType: 'bar-chart',
            maxScore: 40,
            parameters: [
                { id: 'bubble-sort', label: 'Bubble Sort (vergelijk buurparen)', type: 'toggle', defaultToggle: false },
                { id: 'selection-sort', label: 'Selection Sort (zoek steeds het kleinste)', type: 'toggle', defaultToggle: false },
                { id: 'insertion-sort', label: 'Insertion Sort (voeg op de juiste plek in)', type: 'toggle', defaultToggle: false },
                { id: 'snel-sorteren', label: 'Snel Sorteren / Quicksort (verdeel en heers)', type: 'toggle', defaultToggle: false },
            ],
            questions: [
                {
                    id: 'sa1-q1',
                    question: 'Hoe werkt Bubble Sort in één zin?',
                    type: 'multiple-choice',
                    options: [
                        'Zoek het kleinste element en zet het vooraan, herhaal voor de rest',
                        'Vergelijk steeds twee naast elkaar liggende elementen en wissel als ze in de verkeerde volgorde staan',
                        'Verdeel de lijst in twee helften en sorteer die apart',
                        'Voeg elk element in op de juiste plek in een al gesorteerd deel',
                    ],
                    correctAnswer: 'Vergelijk steeds twee naast elkaar liggende elementen en wissel als ze in de verkeerde volgorde staan',
                    explanation:
                        'Bij Bubble Sort "borrelen" grote getallen naar het einde, zoals bubbels omhoog in water. Het is makkelijk te begrijpen maar langzaam: voor 100 elementen kan het 10.000 vergelijkingen nodig hebben.',
                    points: 15,
                },
                {
                    id: 'sa1-q2',
                    question:
                        'Waarom is het belangrijk te weten welk sorteeralgoritme je kiest bij grote hoeveelheden data?',
                    type: 'multiple-choice',
                    options: [
                        'Het maakt niet uit — alle algoritmes zijn even snel',
                        'Een slecht algoritme op miljoenen rijen data kan minuten of uren langer duren dan een goed algoritme',
                        'Sorteeralgoritmes worden alleen gebruikt in theorie, niet in echte software',
                        'Snelle computers maken algoritmekeuze overbodig',
                    ],
                    correctAnswer: 'Een slecht algoritme op miljoenen rijen data kan minuten of uren langer duren dan een goed algoritme',
                    explanation:
                        'Bij kleine lijsten is het verschil nauwelijks merkbaar. Maar bij miljoenen items kan het verschil tussen O(n²) en O(n log n) het verschil zijn tussen 1 seconde en 11 uur.',
                    points: 15,
                },
                {
                    id: 'sa1-q3',
                    question:
                        'Wat bedoelen we met "efficiëntie" van een algoritme?',
                    type: 'multiple-choice',
                    options: [
                        'Hoeveel regels code het algoritme heeft',
                        'Hoeveel stappen (tijd) of geheugen het nodig heeft in verhouding tot de invoergrootte',
                        'Hoe moeilijk het is om te begrijpen',
                        'Of het algoritme geschreven is door een professionele programmeur',
                    ],
                    correctAnswer: 'Hoeveel stappen (tijd) of geheugen het nodig heeft in verhouding tot de invoergrootte',
                    explanation:
                        'Efficiëntie gaat over de schaling: als je de invoer verdubbelt, hoeveel extra stappen kost dat dan? Dit wordt uitgedrukt als Big-O notatie: O(n), O(n²), O(n log n) etc.',
                    points: 10,
                },
            ],
        },
        {
            id: 'pseudocode',
            title: 'Pseudocode als voorbereiding',
            description:
                'Kies jouw aanpak voordat je code schrijft. Vergelijk het met direct beginnen. Computational thinking betekent: problemen slim opdelen en stap voor stap oplossen. Het heeft vier basisdelen.',
            visualType: 'comparison',
            maxScore: 30,
            parameters: [
                {
                    id: 'aanpak',
                    label: 'Hoe begin je een algoritme?',
                    type: 'select',
                    options: ['Direct code schrijven', 'Stroomschema tekenen', 'Pseudocode schrijven'],
                    defaultOption: 'Direct code schrijven',
                },
            ],
            questions: [
                {
                    id: 'ps1-q1',
                    question: 'Wat is pseudocode?',
                    type: 'multiple-choice',
                    options: [
                        'Code die er echt uitziet maar niet werkt',
                        'Stappen van een algoritme in gewone taal opgeschreven — niet in een echte programmeertaal',
                        'Een speciale programmeertaal voor beginners',
                        'Commentaar in je code dat je achteraf toevoegt',
                    ],
                    correctAnswer: 'Stappen van een algoritme in gewone taal opgeschreven — niet in een echte programmeertaal',
                    explanation:
                        'Pseudocode schrijft je in begrijpelijke taal: "Als de score groter is dan 50, dan toon GESLAAGD, anders toon GEZAKT." Je controleert de logica vóórdat je je zorgen maakt over de exacte syntax.',
                    points: 10,
                },
                {
                    id: 'ps1-q2',
                    question:
                        'Wat zijn de vier basisconcepten van computational thinking?',
                    type: 'multiple-choice',
                    options: [
                        'HTML, CSS, JavaScript en Python',
                        'Decompositie, patroonherkenning, abstractie en algoritmisch denken',
                        'Input, output, verwerking en opslag',
                        'Lussen, functies, variabelen en condities',
                    ],
                    correctAnswer: 'Decompositie, patroonherkenning, abstractie en algoritmisch denken',
                    explanation:
                        'Computational thinking is een denkstrategie: splits het probleem op (decompositie), zoek patronen, abstraeer details weg en denk in stap-voor-stap oplossingen (algoritmisch). Daarna pas code schrijven.',
                    points: 10,
                },
                {
                    id: 'ps1-q3',
                    question:
                        'Je schrijft pseudocode voor het vinden van het grootste getal in een lijst. Wat is de eerste stap?',
                    type: 'multiple-choice',
                    options: [
                        'Begin met het getal 0 als tijdelijke grootste',
                        'Sorteer eerst de hele lijst',
                        'Tel hoeveel getallen er in de lijst zitten',
                        'Verwijder de kleinste getallen één voor één',
                    ],
                    correctAnswer: 'Begin met het getal 0 als tijdelijke grootste',
                    explanation:
                        'Je hebt een startwaarde nodig om mee te vergelijken. "Stel tijdelijke grootste in op het eerste element." Dan loop je door de rest: "Als dit getal groter is, vervang dan de tijdelijke grootste." Zo vind je het maximum.',
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
            title: 'Master Architect',
            color: '#202023',
        },
        {
            minScore: 70,
            emoji: '⚙️',
            title: 'Algorithm Pro',
            color: '#202023',
        },
        {
            minScore: 50,
            emoji: '🔧',
            title: 'Codebouwer',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Startende Algoritme Ontwerper',
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
        'Binair zoeken is exponentieel sneller dan lineair zoeken, maar werkt alleen op gesorteerde lijsten.',
        'De keuze voor een sorteeralgoritme maakt bij grote datasets een enorm verschil in snelheid.',
        'Schrijf altijd eerst pseudocode of teken een stroomschema — denk vóórdat je typt.',
        'Computational thinking is niet hetzelfde als programmeren: het is het probleem begrijpen en opsplitsen.',
        'Efficiëntie gaat over hoe een algoritme schaalt — niet over hoeveel regels code het heeft.',
    ],
};

export default algorithmArchitectConfig;
