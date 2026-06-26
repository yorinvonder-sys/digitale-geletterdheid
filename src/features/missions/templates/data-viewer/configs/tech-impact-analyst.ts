import type { DataViewerConfig } from '../DataViewer';

export const techImpactAnalystConfig: DataViewerConfig = {
    missionId: 'tech-impact-analyst',
    title: 'Tech Impact Analyst',
    introEmoji: '🔎',
    introTitle: 'Word een Tech Impact Analyst',
    introDescription:
        'Elke technologie heeft gevolgen — voor mensen, samenleving en milieu. Jij gaat als onafhankelijk analist de maatschappelijke impact van bezorgdrones in kaart brengen. Voordelen én risico\'s, eerlijk en evenwichtig.',
    introFeatures: [
        'Analyseer de maatschappelijke impact van bezorgdrones',
        'Vergelijk drone-bezorgtijden en adoptie per land',
        'Pas de 4-stappen impact-analysemethode toe',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'bezorgdrones-impact',
            title: 'Impact-analyse: bezorgdrones in de samenleving',
            description:
                'Bezorgdrones worden door logistieke bedrijven getest en ingezet. Bekijk de impact-matrix met positieve en negatieve effecten per domein.',
            type: 'table',
            columns: [
                { key: 'domein', label: 'Domein', sortable: true },
                { key: 'positief_effect', label: 'Positief effect', sortable: false },
                { key: 'negatief_risico', label: 'Negatief risico', sortable: false },
                { key: 'ernst_risico', label: 'Ernst risico (1-5)', sortable: true },
                { key: 'zekerheid', label: 'Wetenschappelijke zekerheid', sortable: true },
            ],
            rows: [
                { domein: 'Snelheid & gemak', positief_effect: 'Bezorging binnen 30 minuten zonder verkeer', negatief_risico: 'Afhankelijkheid van drone-beschikbaarheid en batterijleven', ernst_risico: 2, zekerheid: 'Hoog' },
                { domein: 'Veiligheid luchtruim', positief_effect: 'Minder bestelwagens in stadsverkeer, minder ongelukken', negatief_risico: 'Risico op botsingen met vliegtuigen en andere drones', ernst_risico: 4, zekerheid: 'Hoog' },
                { domein: 'Geluidsoverlast', positief_effect: 'Geen diesel-bestelwagens in woonwijken', negatief_risico: 'Constant zoemend geluid boven woongebieden', ernst_risico: 3, zekerheid: 'Hoog' },
                { domein: 'Werkgelegenheid bezorgers', positief_effect: 'Nieuwe technische banen voor drone-onderhoud', negatief_risico: 'Minder werk voor traditionele bezorgers', ernst_risico: 3, zekerheid: 'Matig' },
                { domein: 'Bereikbaarheid platteland', positief_effect: 'Pakketten bezorgen in gebieden zonder goede wegen', negatief_risico: 'Hoge kosten maken plattelandsdienst minder rendabel', ernst_risico: 2, zekerheid: 'Matig' },
                { domein: 'Kosten', positief_effect: 'Lagere bezorgkosten op lange termijn door automatisering', negatief_risico: 'Hoge investeringskosten maken dienst voorlopig duur', ernst_risico: 2, zekerheid: 'Laag' },
            ],
            questions: [
                {
                    id: 'q1-hoogste-ernst',
                    question:
                        'Hoeveel domeinen hebben een ernst-score van 3 of hoger?',
                    type: 'number-input',
                    correctAnswer: 3,
                    explanation:
                        'Veiligheid luchtruim (4), Geluidsoverlast (3) en Werkgelegenheid bezorgers (3) hebben een ernst-score van 3 of hoger — dat zijn 3 domeinen. De andere drie (Snelheid & gemak, Bereikbaarheid platteland en Kosten) scoren elk 2. Sorteer op "Ernst risico" om ze te groeperen.',
                    points: 15,
                },
                {
                    id: 'q2-luchtruim-probleem',
                    question:
                        'Veiligheid in het luchtruim krijgt de hoogste ernst-score (4). Welke van de volgende omschrijvingen legt de reden hiervoor het best uit?',
                    type: 'multiple-choice',
                    options: [
                        'Drones zijn te langzaam om gevaarlijk te zijn',
                        'Botsingen met vliegtuigen of andere drones kunnen ernstige gevolgen hebben voor mensenlevens',
                        'Het luchtruim is al zo druk dat een paar drones er niets aan toevoegen',
                        'Batterijproblemen maken drones onbetrouwbaar maar niet gevaarlijk',
                    ],
                    correctAnswer: 'Botsingen met vliegtuigen of andere drones kunnen ernstige gevolgen hebben voor mensenlevens',
                    explanation:
                        'Veiligheid in het luchtruim scoort 4 omdat een botsing van een drone met een vliegtuig of helikopter desastreuze gevolgen kan hebben. Dit is een risico met lage kans maar hoge ernst — precies wat een score van 4 rechtvaardigt. Regelgeving (zoals het verplicht registreren van drones) probeert dit risico te beheersen.',
                    points: 15,
                },
                {
                    id: 'q3-afweging-observatie',
                    question:
                        'Het argument vóór bezorgdrones bij werkgelegenheid is "nieuwe technische banen voor drone-onderhoud". Welk tegenargument zou een vakbond direct geven?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een vakbond zou zeggen: het aantal nieuwe technische banen is veel kleiner dan het aantal verloren bezorgbanen. Bovendien vereisen die nieuwe banen een andere opleiding — een bezorger kan niet zomaar drone-technicus worden. Dit heet structurele werkloosheid: de banen die verdwijnen en de banen die ontstaan, zijn niet uitwisselbaar. Een impact-analist zou vragen: hoeveel banen verdwijnen, hoeveel komen er terug, en voor wie?',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'drone-bezorging-landen',
            title: 'Gemiddelde bezorgtijd (minuten) met drone vs. traditioneel — 2024',
            description:
                'Landen en steden testen bezorgdrones op verschillende schaal. Onderzoekers maten de gemiddelde bezorgtijd in minuten voor een pakket van 1 kg binnen een straal van 5 km.',
            type: 'bar-chart',
            chartData: [
                { label: 'Drone (US)', value: 28, color: '#202023' },
                { label: 'Traditioneel (US)', value: 52, color: '#ff3c21' },
                { label: 'Drone (AU)', value: 22, color: '#202023' },
                { label: 'Traditioneel (AU)', value: 48, color: '#ff3c21' },
                { label: 'Drone (NL pilot)', value: 35, color: '#e1ff01' },
                { label: 'Traditioneel (NL)', value: 58, color: '#202023' },
            ],
            questions: [
                {
                    id: 'q4-snelste-drone',
                    question: 'In welk land is de drone het snelst ten opzichte van de traditionele bezorging?',
                    type: 'multiple-choice',
                    options: ['VS (US)', 'Australië (AU)', 'Nederland (NL)', 'Alle landen zijn even snel'],
                    correctAnswer: 'Australië (AU)',
                    explanation:
                        'In Australië is het tijdverschil 48 − 22 = 26 minuten. In de VS is dat 52 − 28 = 24 minuten. In Nederland 58 − 35 = 23 minuten. Australië heeft het grootste voordeel voor drones, waarschijnlijk door minder stedelijke bebouwing en gunstige regelgeving.',
                    points: 10,
                },
                {
                    id: 'q5-nl-verschil',
                    question:
                        'Hoeveel minuten sneller is de drone-bezorging in de Nederlandse pilot vergeleken met traditionele bezorging?',
                    type: 'number-input',
                    correctAnswer: 23,
                    explanation:
                        'Traditioneel in NL: 58 minuten. Drone in NL: 35 minuten. Verschil: 58 − 35 = 23 minuten. De Nederlandse pilot is trager dan in de VS en Australië, deels door strengere luchtruimregels en dichter bebouwd stedelijk gebied.',
                    points: 10,
                },
                {
                    id: 'q6-regulering-observatie',
                    question:
                        'Waarom zou een bezorgbedrijf drone-bezorging willen invoeren ook als het duurder is dan traditionele bezorging? En wanneer is het economisch pas interessant?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Voordeel voor het bedrijf: drones kunnen 24/7 rijden zonder chauffeur, worden nooit ziek en vermijden verkeersfiles. Op hoog volume (veel pakketten per dag) zijn de vaste kosten van drones lager dan de arbeidskosten van bezorgers. Economisch interessant als: volume hoog genoeg is om de aanschaf- en onderhoudskosten te dekken, én de regelgeving ruimte biedt voor commerciële vluchten.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'impact-analyse-methode',
            title: 'Vier stappen van een professionele impact-analyse',
            description:
                'Impact-analisten (= onderzoekers die onderzoeken welke gevolgen iets heeft) gebruiken een gestructureerde methode. Hier zijn de vier stappen die elke analyst doorloopt.',
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
                        'Identificeer negatieve effecten op veiligheid, privacy, milieu en werkgelegenheid. Beoordeel ernst (hoe erg als het misgaat?) en waarschijnlijkheid (hoe groot is de kans?). Vraag: "Wie draagt het risico — en is dat dezelfde persoon als wie het voordeel krijgt?" Dit is de kern van een zorgvuldige impact-analyse.',
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
                        'Een gemeente wil bezorgdrones toestaan boven woonwijken. Welke stap in de impact-analyse zou als eerste een serieus risico blootleggen?',
                    type: 'multiple-choice',
                    options: [
                        'Stap 1: Technologie beschrijven',
                        'Stap 2: Positieve effecten in kaart brengen',
                        'Stap 3: Risico\'s analyseren',
                        'Stap 4: Conclusie en aanbeveling',
                    ],
                    correctAnswer: 'Stap 3: Risico\'s analyseren',
                    explanation:
                        'In Stap 3 worden risico\'s geanalyseerd. Voor drones boven woonwijken: risico op geluidsoverlast, technisch falen boven mensen (vallende drone), veiligheid in het luchtruim en privacyzorgen bij camera\'s aan boord. Dit zijn concrete risico\'s die specifieke regels vereisen voordat je kunt adviseren.',
                    points: 15,
                },
                {
                    id: 'q8-eigen-analyse',
                    question:
                        'TikTok gebruikt een aanbevelingsalgoritme dat bepaalt welke video\'s je ziet. Noem één positief effect en één negatief risico van dit systeem.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Positief: het algoritme helpt je precies de content vinden die je interessant vindt — efficiënte ontdekking van nieuwe creators en onderwerpen. Negatief: filterbubbel — je ziet steeds extremere versies van wat je al leuk vindt, en nooit tegengestelde perspectieven. Dit kan de informatieverwerving eenzijdig maken.',
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
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '⚖️',
            title: 'Kritisch Analist',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔬',
            title: 'Impact Onderzoeker',
            color: '#e1ff01',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#202023',
        },
    ],

    takeaways: [
        'Elke technologie heeft voordelen én nadelen — een eerlijke analyse weegt beide',
        'Ernst van een risico is niet hetzelfde als de kans dat het optreedt — een impact-analyse beoordeelt allebei',
        'Bezorgdrones zijn gemiddeld 23-26 minuten sneller dan traditionele bezorging in testpilots',
        'Een impact-analyse weegt voordelen en risico\'s per domein en geeft een concrete aanbeveling',
        'Technische banen die een technologie creëert vervangen niet altijd de banen die ze doet verdwijnen',
    ],
};

export default techImpactAnalystConfig;
