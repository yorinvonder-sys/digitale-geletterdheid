import type { DataViewerConfig } from '../DataViewer';

export const techImpactAnalystConfig: DataViewerConfig = {
    missionId: 'tech-impact-analyst',
    title: 'Tech Impact Analyst',
    introEmoji: '🔎',
    introTitle: 'Word een Tech Impact Analyst',
    introDescription:
        'Elke technologie heeft gevolgen — voor mensen, samenleving en milieu. Jij gaat als onafhankelijk analist de maatschappelijke impact van AI-systemen en andere technologieën in kaart brengen. Voordelen én risico\'s. Want technologie is nooit neutraal.',
    introFeatures: [
        'Analyseer de maatschappelijke impact van gezichtsherkenning',
        'Vergelijk beleidsposities van landen over AI-regulering',
        'Beoordeel welke ethische afwegingen relevant zijn',
    ],

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
                        'Gezichtsherkenning-algoritmes maken meer fouten bij donkere huidskleur. Wat is dit een voorbeeld van?',
                    type: 'multiple-choice',
                    options: [
                        'Een softwarebug die makkelijk te repareren is',
                        'Algoritmische bias door niet-representatieve trainingsdata',
                        'Een hardwareprobleem met camera-sensoren',
                        'Bewuste discriminatie door de ontwikkelaars',
                    ],
                    correctAnswer: 'Algoritmische bias door niet-representatieve trainingsdata',
                    explanation:
                        'De meeste gezichtsherkenning-modellen zijn getraind op datasets met overwegend lichte huidskleur. Het model heeft daardoor minder voorbeelden gezien van donkere gezichten en maakt er meer fouten op. Dit heet algoritmische bias. Het is geen bewuste keuze, maar een structureel probleem door niet-representatieve data.',
                    points: 15,
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
                { label: 'EU', value: 78, color: '#3B82F6' },
                { label: 'VK', value: 52, color: '#8B5CF6' },
                { label: 'VS', value: 38, color: '#D97757' },
                { label: 'China', value: 65, color: '#EF4444' },
                { label: 'Japan', value: 44, color: '#F59E0B' },
                { label: 'India', value: 28, color: '#10B981' },
            ],
            questions: [
                {
                    id: 'q4-strengste-regelgeving',
                    question: 'Welke regio heeft de strengste AI-regulering op basis van de data?',
                    type: 'multiple-choice',
                    options: ['VS', 'China', 'EU', 'Japan'],
                    correctAnswer: 'EU',
                    explanation:
                        'De EU scoort het hoogst met 78 — dat klopt met de werkelijkheid: de EU AI Act (2024) is \'s werelds eerste uitgebreide AI-wetgeving. De VS heeft bewust minder strenge regels om innovatie te stimuleren. China heeft eigen strikte regels, maar die zijn meer gericht op inhoudelijke controle dan op mensenrechten.',
                    points: 10,
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
                        'Een overheid wil AI inzetten om sollicitaties te beoordelen. Welk stap in de impact-analyse zou als eerste een serieus risico blootleggen?',
                    type: 'multiple-choice',
                    options: [
                        'Stap 1: Technologie beschrijven',
                        'Stap 2: Positieve effecten in kaart brengen',
                        'Stap 3: Risico\'s analyseren',
                        'Stap 4: Conclusie en aanbeveling',
                    ],
                    correctAnswer: 'Stap 3: Risico\'s analyseren',
                    explanation:
                        'In Stap 3 worden risico\'s geanalyseerd. Voor AI bij sollicitaties: risico op discriminatie (als de trainingsdata bias bevat), gebrek aan transparantie (sollicitant weet niet waarom hij is afgewezen) en schending van arbeidsrecht (recht op uitleg bij een afwijzing). Dit zijn serieuze mensenrechtenrisico\'s die de EU AI Act als "hoog risico" classificeert.',
                    points: 15,
                },
                {
                    id: 'q8-eigen-analyse',
                    question:
                        'TikTok gebruikt een aanbevelingsalgoritme dat bepaalt welke video\'s je ziet. Noem één positief effect en één negatief risico van dit systeem.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Positief: het algoritme helpt je precies de content vinden die je interessant vindt — efficiënte ontdekking van nieuwe creators en onderwerpen. Negatief: filterbubbel — je ziet steeds extremere versies van wat je al leuk vindt, en nooit tegengestelde perspectieven. Dit kan polarisering versterken en je informatieverwerving eenzijdig maken.',
                    points: 0,
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
            color: '#059669',
        },
        {
            minScore: 65,
            emoji: '⚖️',
            title: 'Kritisch Analist',
            color: '#3B82F6',
        },
        {
            minScore: 40,
            emoji: '🔬',
            title: 'Impact Onderzoeker',
            color: '#F59E0B',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#6B6B66',
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
