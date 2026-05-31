import type { DataViewerConfig } from '../DataViewer';

export const techImpactAnalystConfig: DataViewerConfig = {
    missionId: 'tech-impact-analyst',
    title: 'Tech Impact Analyst',
    introEmoji: '🔎',
    introTitle: 'Word een Tech Impact Analyst',
    introDescription:
        'Elke technologie heeft gevolgen — voor mensen, samenleving en milieu. Jij gaat als onafhankelijk analist de maatschappelijke impact van AI-systemen en andere technologieën in kaart brengen. Voordelen én risico\'s. Want technologie is nooit neutraal.',
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Impact room: kies welk risico van gezichtsherkenning het zwaarst weegt.',
        primaryInteraction: 'prioritize-case',
        feedbackMoment: 'Na de impactlens krijgt de leerling feedback op privacy, bias of democratisch gedrag.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling onderbouwt kansen en risico’s met impactmatrix, beleid en ethische afwegingen.',
        antiBoringRule: 'Impactanalyse wordt een advieskamer met trade-offs, geen neutrale vragenlijst.',
        chromeAcceptance: 'Impactlens, matrix en observaties blijven rustig, niet angstig, en werken op alle viewports.',
    },
    introFeatures: [
        'Analyseer de maatschappelijke impact van gezichtsherkenning',
        'Vergelijk beleidsposities van landen over AI-regulering',
        'Beoordeel welke ethische afwegingen relevant zijn',
    ],
    investigationHook: {
        title: 'De impactkamer gaat open',
        role: 'Onafhankelijk analist',
        scenario:
            'Een stad overweegt gezichtsherkenning op drukke plekken. Jij moet vooraf kiezen welk risico je het strengst gaat wegen in je analyse.',
        prompt: 'Welke impact krijgt jouw eerste aandacht?',
        contextLabel: 'Impactlens',
        continueLabel: 'Open de impactmatrix',
        options: [
            {
                id: 'privacy',
                label: 'Privacy en massasurveillance',
                description: 'Je onderzoekt of onschuldige burgers structureel gevolgd of geregistreerd worden.',
                evidenceChips: ['Ernst 5', 'alle burgers gescand', 'hoog bewijs'],
                impactCue: 'Vrijheid versus opsporingsvoordeel',
                feedback: 'Sterke lens. Bij publieke technologie telt niet alleen wat het systeem kan, maar ook hoeveel vrijheid het kost.',
            },
            {
                id: 'bias',
                label: 'Bias en foutieve herkenning',
                description: 'Je kijkt naar ongelijke foutkansen en wie daardoor meer risico loopt.',
                evidenceChips: ['ongelijke foutkans', 'trainingsdata', 'valse herkenning'],
                impactCue: 'Ongelijke foutkansen en valse herkenning',
                feedback: 'Belangrijk spoor. Een gemiddeld hoge score kan verbergen dat sommige groepen veel slechter worden behandeld.',
            },
            {
                id: 'democratie',
                label: 'Effect op protest en gedrag',
                description: 'Je onderzoekt of mensen zich anders gedragen als ze weten dat ze gevolgd kunnen worden.',
                evidenceChips: ['Ernst 5', 'protest vermijden', 'matige zekerheid'],
                impactCue: 'Gedrag verandert als toezicht zichtbaar is',
                feedback: 'Scherp. Technologie kan gedrag veranderen zonder iemand direct aan te raken; dat maakt impactanalyse lastig en belangrijk.',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'gezichtsherkenning-impact',
            title: 'Impact-analyse: gezichtsherkenning in de openbare ruimte',
            description:
                'Gezichtsherkenning wordt steeds vaker gebruikt door overheden en bedrijven. Bekijk de impact-matrix met positieve en negatieve effecten per domein.',
            type: 'table',
            columns: [
                { key: 'domein', label: 'Domein', sortable: true },
                { key: 'positief_effect', label: 'Positief effect', sortable: false },
                { key: 'negatief_risico', label: 'Negatief risico', sortable: false },
                { key: 'ernst_risico', label: 'Ernst risico (1-5)', sortable: true },
                { key: 'zekerheid', label: 'Wetenschappelijke zekerheid', sortable: true },
            ],
            rows: [
                { domein: 'Veiligheid', positief_effect: 'Sneller criminelen opsporen', negatief_risico: 'Massasurveillance van onschuldigen', ernst_risico: 5, zekerheid: 'Hoog' },
                { domein: 'Privacy', positief_effect: 'Geen direct voordeel', negatief_risico: 'Permanente registratie van bewegingen', ernst_risico: 5, zekerheid: 'Hoog' },
                { domein: 'Discriminatie', positief_effect: 'Objectievere identificatie (theoretisch)', negatief_risico: 'Algoritme discrimineert donkere huidskleur (hogere foutkans)', ernst_risico: 4, zekerheid: 'Hoog' },
                { domein: 'Economie', positief_effect: 'Snellere paspoortcontrole, minder personeel nodig', negatief_risico: 'Verlies van banen in beveiliging', ernst_risico: 3, zekerheid: 'Matig' },
                { domein: 'Democratie', positief_effect: 'Fraude bij verkiezingen voorkomen', negatief_risico: 'Burgers gaan protesten vermijden uit angst voor registratie', ernst_risico: 5, zekerheid: 'Matig' },
                { domein: 'Gezondheid', positief_effect: 'Patiëntidentificatie in ziekenhuizen', negatief_risico: 'Medische data koppelen aan identiteit zonder toestemming', ernst_risico: 4, zekerheid: 'Laag' },
            ],
            questions: [
                {
                    id: 'q1-hoogste-ernst',
                    question:
                        'Hoeveel domeinen hebben een ernst-score van 5 (maximaal ernstig risico)?',
                    type: 'number-input',
                    correctAnswer: 3,
                    explanation:
                        'Veiligheid, Privacy en Democratie hebben allemaal ernst-score 5. Dit zijn de drie domeinen waar het risico het ernstigst is. Sorteer op "Ernst risico" om ze te groeperen. Een impact-analist zou deze drie als "high priority" markeren in het rapport.',
                    points: 15,
                },
                {
                    id: 'q2-bias-probleem',
                    question:
                        'Leg uit waarom de hogere foutkans bij donkere huidskleur een algoritmische bias-risico is. Gebruik bewijs uit de impactmatrix en noem waarom dit niet simpelweg een softwarebug is.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een sterke analyse noemt dat het probleem structureel is: het model is getraind met data die groepen niet gelijk vertegenwoordigt, waardoor de foutkans ongelijk verdeeld is. Dat kan leiden tot valse herkenningen, discriminatie of onterechte controles. Het is dus niet alleen een losse softwarebug, maar een risico in data, ontwerp en toepassing.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'algoritmische bias', keywords: ['bias', 'algoritmische', 'algoritme', 'ongelijk', 'foutkans'] },
                        { label: 'trainingsdata of representatie', keywords: ['trainingsdata', 'representatief', 'data', 'voorbeelden', 'model'] },
                        { label: 'impact op mensen', keywords: ['valse', 'aanhouding', 'discriminatie', 'risico', 'groep', 'burgers'] },
                        { label: 'niet alleen een bug', keywords: ['geen bug', 'niet makkelijk', 'structureel', 'systeem', 'ontwerp'] },
                    ],
                },
                {
                    id: 'q3-afweging-observatie',
                    question:
                        'Het argument voor gezichtsherkenning bij veiligheid is "sneller criminelen opsporen". Welk tegenargument zou een privacy-advocaat direct geven?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een privacy-advocaat zou zeggen: om criminelen te vinden, moeten alle onschuldige burgers ook worden gescand en geregistreerd. Dit is massasurveillance — je behandelt iedereen als verdachte. Dit schendt het principe van "onschuldig totdat het tegendeel bewezen is". Bovendien toont onderzoek dat de foutmarge bij donkere huidskleur leidt tot valse aanhoudingen van onschuldigen.',
                    points: 10,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'onschuldige burgers', keywords: ['onschuldig', 'burgers', 'iedereen', 'verdachte'] },
                        { label: 'privacy of surveillance', keywords: ['privacy', 'massasurveillance', 'surveillance', 'registratie', 'scannen'] },
                        { label: 'discriminatie of foutmarge', keywords: ['bias', 'fout', 'donkere', 'huidskleur', 'discriminatie'] },
                    ],
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'ai-regulering-landen',
            title: 'AI-regulering: hoe streng zijn landen?',
            description:
                'Landen kiezen verschillende posities bij het reguleren van AI. Onderzoekers gaven landen een score van 0-100 voor de strengheid van hun AI-wetgeving (2024).',
            type: 'bar-chart',
            chartData: [
                { label: 'EU', value: 78, color: '#0B453F' },
                { label: 'VK', value: 52, color: '#0B453F' },
                { label: 'VS', value: 38, color: '#D97848' },
                { label: 'China', value: 65, color: '#D97848' },
                { label: 'Japan', value: 44, color: '#D7C95F' },
                { label: 'India', value: 28, color: '#5F947D' },
            ],
            questions: [
                {
                    id: 'q4-strengste-regelgeving',
                    question:
                        'Markeer de regio met de strengste AI-regulering. Noem de score, vergelijk die met minstens één andere regio en leg kort uit wat zo’n hogere score voor burgers of bedrijven kan betekenen.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De EU scoort het hoogst met 78. Dat is hoger dan China (65), het VK (52), Japan (44), de VS (38) en India (28). Een hogere reguleringsscore kan burgers meer bescherming en uitlegrechten geven, terwijl bedrijven meer compliancewerk, documentatie en aanpassingen moeten doen.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'EU als strengste regio', keywords: ['eu'] },
                        { label: 'score 78 gebruikt', keywords: ['78'] },
                        { label: 'vergelijking met andere regio', keywords: ['china', '65', 'vk', '52', 'japan', '44', 'vs', '38', 'india', '28'] },
                        { label: 'gevolg voor burgers of bedrijven', keywords: ['burgers', 'bescherming', 'uitleg', 'bedrijven', 'compliance', 'regels', 'aanpassen'] },
                    ],
                },
                {
                    id: 'q5-vs-eu-verschil',
                    question:
                        'Hoeveel punten verschil zit er in AI-regulering tussen de EU en de VS?',
                    type: 'number-input',
                    correctAnswer: 40,
                    explanation:
                        'EU: 78 punten. VS: 38 punten. Verschil: 78 − 38 = 40 punten. Dit grote verschil heeft directe gevolgen: technologiebedrijven moeten hun producten aanpassen om aan EU-regels te voldoen, ook al zijn ze gevestigd in de VS.',
                    points: 10,
                },
                {
                    id: 'q6-regulering-observatie',
                    question:
                        'Waarom zou een techbedrijf strenge AI-regulering soms niet erg vinden? En wanneer wel? Beschrijf beide kanten.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Voordeel voor het bedrijf: duidelijke regels geven zekerheid over wat wel en niet mag. Gevestigde grote bedrijven hebben de middelen om aan regels te voldoen — kleine concurrenten soms niet. Regels kunnen zo een "moat" creëren die grote spelers beschermt. Nadeel: compliance kost geld en vertraagt innovatie. Nieuwe toepassingen kunnen verboden worden voordat hun nut bewezen is.',
                    points: 10,
                    minLength: 60,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'voordeel van regels', keywords: ['duidelijk', 'zekerheid', 'vertrouwen', 'regels', 'moat'] },
                        { label: 'nadeel van regels', keywords: ['kosten', 'compliance', 'duur', 'vertraagt', 'innovatie'] },
                        { label: 'bedrijfsperspectief', keywords: ['bedrijf', 'techbedrijf', 'grote', 'kleine', 'concurrent'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'impact-analyse-methode',
            title: 'Vier stappen van een professionele impact-analyse',
            description:
                'Impact-analisten gebruiken een gestructureerde methode. Hier zijn de vier stappen die elke analyst doorloopt.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Stap 1: Technologie beschrijven',
                    icon: '📋',
                    content:
                        'Beschrijf objectief wat de technologie doet: hoe werkt het, waarvoor wordt het gebruikt, wie heeft het ontwikkeld? Vermijd hype en doemdenken. Een impact-analyse begint met feiten, niet met meningen. Vraag: "Wat doet het precies?" is altijd de eerste vraag vóór "Is het goed of slecht?".',
                },
                {
                    title: 'Stap 2: Positieve effecten in kaart brengen',
                    icon: '✅',
                    content:
                        'Identificeer alle voordelen: efficiëntie, toegankelijkheid, veiligheid, economische groei. Geef aan voor wie de voordelen zijn (burger? bedrijf? overheid?) en op welke termijn (direct of langetermijn). Een eerlijke analyse erkent altijd echte voordelen — ook als je de technologie kritisch beoordeelt.',
                },
                {
                    title: 'Stap 3: Risico\'s analyseren',
                    icon: '⚠️',
                    content:
                        'Identificeer negatieve effecten op privacy, mensenrechten, milieu en ongelijkheid. Beoordeel ernst (hoe erg als het misgaat?) en waarschijnlijkheid (hoe groot is de kans?). Vraag: "Wie draagt het risico — en is dat dezelfde persoon als wie het voordeel krijgt?" Dit is de kern van ethische impact-analyse.',
                },
                {
                    title: 'Stap 4: Conclusie en aanbeveling',
                    icon: '📝',
                    content:
                        'Weeg voordelen en risico\'s. Geef een concreet advies: verbieden, toestaan onder strikte voorwaarden, of verder onderzoek vereist? Een goede conclusie is specifiek: niet "dit is gevaarlijk" maar "deze toepassing mag alleen gebruikt worden als [voorwaarde X en Y]." Beleidsmakers hebben concrete adviezen nodig, geen vage waarschuwingen.',
                },
            ],
            questions: [
                {
                    id: 'q7-methode-toepassen',
                    question:
                        'Een overheid wil AI inzetten om sollicitaties te beoordelen. Kies de analysestap die als eerste een serieus risico blootlegt en onderbouw met minimaal twee risico’s die je bij sollicitatie-AI moet onderzoeken.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Stap 3: Risico’s analyseren legt dit als eerste bloot. Voor AI bij sollicitaties moet je letten op discriminatie of bias in trainingsdata, gebrek aan transparantie, recht op uitleg bij afwijzing en menselijke controle bij twijfel. Dit is geen neutrale sorteertool maar een hoog-risico toepassing voor kansen van mensen.',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Stap 3 risicoanalyse gekozen', keywords: ['stap 3', 'risico', 'risicoanalyse', 'risico’s analyseren', 'risico analyseren'] },
                        { label: 'bias of discriminatie genoemd', keywords: ['bias', 'discriminatie', 'trainingsdata', 'ongelijk'] },
                        { label: 'transparantie of uitleg genoemd', keywords: ['transparantie', 'uitleg', 'afwijzing', 'waarom'] },
                        { label: 'menselijke controle of hoog risico', keywords: ['menselijke controle', 'mens', 'hoog risico', 'sollicitatie', 'kansen'] },
                    ],
                },
                {
                    id: 'q8-eigen-analyse',
                    question:
                        'TikTok gebruikt een aanbevelingsalgoritme dat bepaalt welke video\'s je ziet. Noem één positief effect en één negatief risico van dit systeem.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Positief: het algoritme helpt je precies de content vinden die je interessant vindt — efficiënte ontdekking van nieuwe creators en onderwerpen. Negatief: filterbubbel — je ziet steeds extremere versies van wat je al leuk vindt, en nooit tegengestelde perspectieven. Dit kan polarisering versterken en je informatieverwerving eenzijdig maken.',
                    points: 15,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'positief effect', keywords: ['positief', 'voordeel', 'kans', 'interessant', 'ontdekken', 'relevant'] },
                        { label: 'negatief risico', keywords: ['negatief', 'risico', 'filterbubbel', 'polarisatie', 'eenzijdig', 'extreem'] },
                        { label: 'algoritme genoemd', keywords: ['algoritme', 'aanbeveling', 'tiktok', 'video'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🔎',
            title: 'Tech Impact Expert!',
            color: '#5F947D',
        },
        {
            minScore: 65,
            emoji: '⚖️',
            title: 'Kritisch Analist',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🔬',
            title: 'Impact Onderzoeker',
            color: '#D7C95F',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
        },
    ],

    takeaways: [
        'Elke technologie heeft zowel voordelen als risico\'s — eerlijke analyse erkent beide',
        'Algoritmische bias ontstaat als trainingsdata niet representatief is voor alle groepen',
        'De EU heeft met de AI Act \'s werelds strengste AI-regulering ingevoerd',
        'Een impact-analyse beoordeelt ernst én waarschijnlijkheid van risico\'s',
        'Technologie is nooit neutraal: het heeft altijd winnaars en verliezers',
    ],
};

export default techImpactAnalystConfig;
