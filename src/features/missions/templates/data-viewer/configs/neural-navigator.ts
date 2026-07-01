import type { DataViewerConfig } from '../DataViewer';

export const neuralNavigatorConfig: DataViewerConfig = {
    missionId: 'neural-navigator',
    title: 'Neural Navigator',
    introEmoji: '⚡',
    introTitle: 'Word een Neural Navigator',
    introDescription:
        'Neurale netwerken zijn de motor achter gezichtsherkenning, stemassistenten en aanbevelingsalgoritmes. Ze zijn geïnspireerd op het menselijk brein. Jij gaat van binnenuit ontdekken hoe neuronen, lagen en backpropagation samenwerken — backpropagation is de manier waarop een netwerk leert door fouten terug te rekenen naar de gewichten.',
    introFeatures: [
        'Reken zelf een forward pass door een neuraal netwerk',
        'Vergelijk hoe de output verandert bij andere gewichten',
        'Beoordeel hoe backpropagation een netwerk laat leren van fouten',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'neuron-berekeningen',
            title: 'Forward pass: vier neurons doorrekenen',
            description:
                'Elk neuron berekent: output = (input1 × gewicht1) + (input2 × gewicht2) + bias. Bekijk de tabel met vier neurons uit een netwerk en beantwoord de vragen.',
            type: 'table',
            columns: [
                { key: 'neuron', label: 'Neuron', sortable: false },
                { key: 'input1', label: 'Input 1', sortable: false },
                { key: 'gewicht1', label: 'Gewicht 1', sortable: false },
                { key: 'input2', label: 'Input 2', sortable: false },
                { key: 'gewicht2', label: 'Gewicht 2', sortable: false },
                { key: 'bias', label: 'Bias', sortable: false },
                { key: 'output', label: 'Output', sortable: true },
            ],
            rows: [
                { neuron: 'Neuron A', input1: 0.8, gewicht1: 0.5, input2: 0.6, gewicht2: 0.3, bias: 0.1, output: 0.68 },
                { neuron: 'Neuron B', input1: 1.0, gewicht1: 0.2, input2: 0.4, gewicht2: 0.7, bias: 0.0, output: 0.48 },
                { neuron: 'Neuron C', input1: 0.5, gewicht1: 0.9, input2: 0.9, gewicht2: 0.4, bias: 0.2, output: 1.01 },
                { neuron: 'Neuron D', input1: 0.3, gewicht1: 0.6, input2: 0.7, gewicht2: 0.8, bias: 0.1, output: 0.84 },
            ],
            questions: [
                {
                    id: 'q1-neuron-b-berekening',
                    question:
                        'Bereken de output van Neuron B met de formule: (input1 × gewicht1) + (input2 × gewicht2) + bias. Wat is het resultaat?',
                    type: 'number-input',
                    correctAnswer: 0.48,
                    explanation:
                        'Neuron B: (1.0 × 0.2) + (0.4 × 0.7) + 0.0 = 0.2 + 0.28 + 0.0 = 0.48. De output van Neuron B is 0,48. Dit getal gaat dan als input naar de volgende laag in het netwerk.',
                    points: 20,
                },
                {
                    id: 'q2-hoogste-output',
                    question: 'Welk neuron heeft de hoogste output?',
                    type: 'multiple-choice',
                    options: ['Neuron A', 'Neuron B', 'Neuron C', 'Neuron D'],
                    correctAnswer: 'Neuron C',
                    explanation:
                        'Neuron C heeft de hoogste output: 1,01 (0,5 × 0,9 + 0,9 × 0,4 + 0,2). Sorteer op "Output" om het snel te zien. Een hogere output betekent dat dit neuron sterker "actief" is dan de anderen. In een netwerk voor beeldherkenning zou een sterk actief neuron een specifiek kenmerk (lijn, kleur, vorm) kunnen vertegenwoordigen.',
                    points: 10,
                },
                {
                    id: 'q3-gewichten-observatie',
                    question:
                        'Wat is de rol van gewichten in een neuraal netwerk? Waarom worden ze aangepast tijdens het leren?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Gewichten bepalen hoe "belangrijk" elke input is voor het neuron. Een hoog gewicht betekent: deze input telt zwaar mee. Tijdens training worden gewichten aangepast (via backpropagation) zodat de outputs beter overeenkomen met de gewenste uitkomsten. Het leerproces van een neuraal netwerk is eigenlijk het optimaliseren van al die gewichten.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'output-na-aanpassing',
            title: 'Effect van gewichtsaanpassing: voor vs. na training',
            description:
                'Dit netwerk leert handgeschreven cijfers herkennen. Bekijk hoe de output-kansen per cijfer veranderen na 1000 trainingsrondes.',
            type: 'bar-chart',
            chartData: [
                { label: 'Cijfer 3 (voor)', value: 0.12, color: '#ff3c21' },
                { label: 'Cijfer 3 (na)', value: 0.87, color: '#202023' },
                { label: 'Cijfer 8 (voor)', value: 0.31, color: '#ff3c21' },
                { label: 'Cijfer 8 (na)', value: 0.08, color: '#202023' },
                { label: 'Overig (voor)', value: 0.57, color: '#202023' },
                { label: 'Overig (na)', value: 0.05, color: '#202023' },
            ],
            questions: [
                {
                    id: 'q4-juiste-voorspelling',
                    question:
                        'Na training herkent het netwerk een afbeelding van een "3". Wat is de kans (output) dat het netwerk zegt "dit is een 3"?',
                    type: 'number-input',
                    correctAnswer: 0.87,
                    explanation:
                        'Na training is de output voor "Cijfer 3" gestegen naar 0,87 — dat betekent 87% zekerheid. Voor training was dit slechts 0,12 (12%). Dit toont het leereffect: het netwerk is 75 procentpunt zekerder geworden na 1000 trainingsrondes.',
                    points: 15,
                },
                {
                    id: 'q5-verwarring-3-8',
                    question:
                        'Waarom was het netwerk vóór training vaker in de war tussen een "3" en een "8"?',
                    type: 'multiple-choice',
                    options: [
                        'Het netwerk had te weinig neuronen',
                        'De gewichten waren willekeurig — het netwerk had nog niets geleerd',
                        'Cijfers 3 en 8 zien er precies hetzelfde uit',
                        'De trainingsdata bevatte geen afbeeldingen van "3"',
                    ],
                    correctAnswer: 'De gewichten waren willekeurig — het netwerk had nog niets geleerd',
                    explanation:
                        'Aan het begin zijn gewichten willekeurig — willekeurige beginwaarden. Het netwerk maakt dan willekeurige voorspellingen. Na elke fout worden gewichten aangepast via backpropagation. Na genoeg trainingsrondes heeft het netwerk geleerd welke patronen bij "3" horen (open aan de bovenkant) en welke bij "8" (gesloten cirkel).',
                    points: 10,
                },
                {
                    id: 'q6-backpropagation',
                    question:
                        'Beschrijf in eigen woorden hoe backpropagation werkt. Gebruik een vergelijking als hulp.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Backpropagation is het leerproces: het netwerk maakt een voorspelling (forward pass), vergelijkt die met het juiste antwoord, berekent hoe groot de fout is, en past de gewichten aan om de fout kleiner te maken. Vergelijking: als je basketbal leert en je gooit te ver, pas je je worp aan (meer of minder kracht). Het netwerk doet hetzelfde, maar met honderden gewichten tegelijk.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'netwerk-architectuur',
            title: 'De lagen van een neuraal netwerk',
            description:
                'Een neuraal netwerk is opgebouwd uit lagen. Hier zijn de drie soorten lagen en hun rol.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Input layer (invoerlaag)',
                    icon: '➡️',
                    content:
                        'De eerste laag ontvangt de ruwe data. Bij beeldherkenning zijn de inputs de pixelwaarden van de afbeelding (bijv. 784 inputs voor een 28×28 pixel plaatje). Bij spam-detectie zijn de inputs features zoals "heeft link" en "percentage hoofdletters". Elke input-neuron ontvangt één waarde en stuurt die door naar de hidden layer.',
                },
                {
                    title: 'Hidden layers (verborgen lagen)',
                    icon: '🔀',
                    content:
                        'De "magie" van neurale netwerken zit in de hidden layers. Hier leren de neuronen abstracte patronen: rechte lijnen, hoeken, kleurvlakken (bij beelden), of combinaties van woorden (bij taal). Deep learning = netwerken met veel hidden layers (soms honderden). Meer lagen = hogere abstractie, maar ook meer trainingstijd en risico op overfitting.',
                },
                {
                    title: 'Output layer (uitvoerlaag)',
                    icon: '🏁',
                    content:
                        'De laatste laag geeft de uiteindelijke voorspelling. Bij cijferherkenning (0-9) zijn er 10 output-neuronen — elk neuron geeft een kans dat het de afbeelding dat cijfer is. Het neuron met de hoogste waarde "wint" en dat is de voorspelling. Bij spam-detectie zijn er 2 output-neuronen: P(spam) en P(geen spam).',
                },
                {
                    title: 'Activatiefuncties',
                    icon: '📐',
                    content:
                        'Elke neuron past een activatiefunctie toe op zijn output. Dit zorgt ervoor dat het netwerk niet-lineaire patronen kan leren. Zonder activatiefunctie is een neuraal netwerk gewoon een reeks lineaire berekeningen — dan is één laag voldoende en heeft diepte geen zin. De meest gebruikte activatiefunctie heet ReLU: "geef de waarde door als hij positief is, anders geef 0".',
                },
            ],
            questions: [
                {
                    id: 'q7-output-neuronen',
                    question:
                        'Een netwerk herkent 5 soorten bloemen (roos, tulp, zonnebloem, orchidee, lavendel). Hoeveel output-neuronen heeft het netwerk?',
                    type: 'number-input',
                    correctAnswer: 5,
                    explanation:
                        'Voor elke klasse is er één output-neuron. Bij 5 bloemensoorten zijn er 5 output-neuronen. Elk neuron geeft een kans: bijv. [roos: 0.82, tulp: 0.05, zonnebloem: 0.08, orchidee: 0.03, lavendel: 0.02]. Het netwerk kiest de klasse met de hoogste kans: roos (82%).',
                    points: 15,
                },
                {
                    id: 'q8-netwerk-toepassing',
                    question:
                        'Noem een toepassing van neurale netwerken die jij dagelijks gebruikt. Beschrijf wat de input en output van dat netwerk waarschijnlijk zijn.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Goede voorbeelden: gezichtsontgrendeling van je telefoon (input: pixelwaarden, output: jij/niet jij), TikTok aanbevelingsalgoritme (input: kijkgedrag en likes, output: kans dat je een video leuk vindt), autocorrectie (input: getypte letters, output: waarschijnlijkste woord). Neurale netwerken zitten overal in moderne apps.',
                    points: 10,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '⚡',
            title: 'Neural Netwerk Expert!',
            color: '#ff3c21',
        },
        {
            minScore: 65,
            emoji: '🧠',
            title: 'Netwerk Navigator',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔌',
            title: 'Neuron Ontdekker',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#202023',
        },
    ],

    takeaways: [
        'Een neuron berekent: (input × gewicht) + bias = output',
        'Gewichten bepalen hoe zwaar elke input meetelt in de berekening',
        'Backpropagation past gewichten aan op basis van de fout in de voorspelling',
        'Input layer → hidden layers → output layer: dit is de basisstructuur van elk neuraal netwerk',
        'Activatiefuncties zorgen dat netwerken niet-lineaire patronen kunnen leren',
    ],
};

export default neuralNavigatorConfig;
