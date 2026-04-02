import type { DataViewerConfig } from '../DataViewer';

export const dashboardDesignerConfig: DataViewerConfig = {
    missionId: 'dashboard-designer',
    title: 'Dashboard Designer',
    introEmoji: '📈',
    introTitle: 'Word een Dashboard Designer',
    introDescription:
        'Een goed dashboard vertelt een verhaal zonder woorden. Bedrijven, scholen en overheden gebruiken dashboards om complexe data in één oogopslag begrijpelijk te maken. Jij leert welke visualisaties passen bij welke data — en waarom "minder meer is".',
    introFeatures: [
        'Analyseer schooldata over cijfers en aanwezigheid',
        'Ontdek welk grafiektype past bij welke soort data',
        'Beoordeel dashboard-ontwerpen op overzichtelijkheid',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'schooldata-klassen',
            title: 'Schooldata leerjaar 2 — periode 3 (2025)',
            description:
                'De schooldirecteur wil een dashboard over de prestaties van de vier klassen in leerjaar 2. Bekijk de ruwe data en beantwoord de vragen.',
            type: 'table',
            columns: [
                { key: 'klas', label: 'Klas', sortable: true },
                { key: 'gem_cijfer', label: 'Gem. cijfer', sortable: true },
                { key: 'aanwezigheid_pct', label: 'Aanwezigheid (%)', sortable: true },
                { key: 'onvoldoendes', label: 'Onvoldoendes', sortable: true },
                { key: 'tevredenheid', label: 'Tevredenheid (1-10)', sortable: true },
            ],
            rows: [
                { klas: '2A', gem_cijfer: 6.8, aanwezigheid_pct: 94, onvoldoendes: 12, tevredenheid: 7.4 },
                { klas: '2B', gem_cijfer: 7.2, aanwezigheid_pct: 97, onvoldoendes: 6, tevredenheid: 8.1 },
                { klas: '2C', gem_cijfer: 6.4, aanwezigheid_pct: 89, onvoldoendes: 19, tevredenheid: 6.5 },
                { klas: '2D', gem_cijfer: 7.0, aanwezigheid_pct: 95, onvoldoendes: 9, tevredenheid: 7.8 },
            ],
            questions: [
                {
                    id: 'q1-zorgenklas',
                    question: 'Welke klas heeft zowel het laagste gemiddelde cijfer als de laagste aanwezigheid?',
                    type: 'multiple-choice',
                    options: ['2A', '2B', '2C', '2D'],
                    correctAnswer: '2C',
                    explanation:
                        '2C heeft het laagste gemiddelde cijfer (6,4) én de laagste aanwezigheid (89%). Dit is een patroon: minder aanwezigheid hangt vaak samen met lagere prestaties. Een goed dashboard zou deze klas automatisch markeren als "aandachtspunt".',
                    points: 15,
                },
                {
                    id: 'q2-verschil-aanwezigheid',
                    question:
                        'Hoeveel procentpunt verschil is er in aanwezigheid tussen de beste en de slechtste klas?',
                    type: 'number-input',
                    correctAnswer: 8,
                    explanation:
                        'Beste aanwezigheid: 2B met 97%. Slechtste aanwezigheid: 2C met 89%. Verschil: 97 − 89 = 8 procentpunt. Sorteer de kolom "Aanwezigheid" om dit snel te zien.',
                    points: 15,
                },
                {
                    id: 'q3-kpi-observatie',
                    question:
                        'Als je maar TWEE cijfers (KPI\'s) op het dashboard mag tonen voor de directeur, welke twee kies jij en waarom?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Goede keuzes zijn "gemiddeld cijfer" en "aanwezigheidspercentage" — ze geven snel inzicht in prestaties én gedrag. KPI staat voor Key Performance Indicator: de meest relevante maatstaven voor je doel. Een directeur hoeft niet elk getal te zien; alleen de signaalwaarden. "Minder is meer" is een kernprincipe van goed dashboard-design.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Cirkelgrafiek ─────────────────────────────────────────
        {
            id: 'vakken-verdeling-onvoldoendes',
            title: 'Verdeling onvoldoendes per vak — leerjaar 2',
            description:
                'Een cirkeldiagram laat zien hoe een geheel verdeeld is over delen. Bekijk de verdeling van onvoldoendes over vakken en beantwoord de vragen.',
            type: 'pie-chart',
            chartData: [
                { label: 'Wiskunde', value: 28, color: '#D97757' },
                { label: 'Engels', value: 18, color: '#3B82F6' },
                { label: 'Nederlands', value: 14, color: '#10B981' },
                { label: 'Aardrijkskunde', value: 22, color: '#F59E0B' },
                { label: 'Overige vakken', value: 18, color: '#8B5CF6' },
            ],
            questions: [
                {
                    id: 'q4-grootste-deel',
                    question: 'Welk vak heeft het grootste aandeel in de totale onvoldoendes?',
                    type: 'multiple-choice',
                    options: ['Engels', 'Aardrijkskunde', 'Wiskunde', 'Nederlands'],
                    correctAnswer: 'Wiskunde',
                    explanation:
                        'Wiskunde vertegenwoordigt 28% van alle onvoldoendes — het grootste segment van het cirkeldiagram. Dit betekent niet dat wiskunde het "slechtste" vak is, maar dat het de meeste hulp nodig heeft.',
                    points: 10,
                },
                {
                    id: 'q5-cirkel-geschikt',
                    question:
                        'Cirkeldiagrammen zijn het meest geschikt voor welk type data?',
                    type: 'multiple-choice',
                    options: [
                        'Data die een trend in de tijd toont',
                        'Data die laat zien hoe een totaal verdeeld is over categorieën',
                        'Data waarbij je twee groepen naast elkaar vergelijkt',
                        'Data met meer dan 10 categorieën',
                    ],
                    correctAnswer: 'Data die laat zien hoe een totaal verdeeld is over categorieën',
                    explanation:
                        'Een cirkeldiagram toont altijd hoe een geheel (100%) verdeeld is over delen. Het werkt goed met 3-6 categorieën. Bij meer categorieën worden de segmenten te klein om te lezen. Voor trends in de tijd gebruik je een lijndiagram.',
                    points: 15,
                },
                {
                    id: 'q6-dashboard-keuze',
                    question:
                        'Waarom is een cirkeldiagram soms minder geschikt dan een staafdiagram? Geef een situatie waarbij je liever een staafdiagram zou gebruiken.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een cirkeldiagram maakt het moeilijk om kleine verschillen te zien (is 18% groter dan 22%?). Een staafdiagram maakt vergelijking makkelijker door de lengtes van balken. Gebruik een staafdiagram als je de exacte waarden wilt vergelijken, en een cirkeldiagram als het gaat om de verhouding tot het geheel.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'dashboard-principes',
            title: 'Vier principes van goed dashboard-design',
            description:
                'UX-designers en data-experts hanteren vaste principes voor goede dashboards. Lees de vier principes en beantwoord de vragen.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Principe 1: Ken je doelgroep',
                    icon: '👤',
                    content:
                        'Een dashboard voor een directeur is anders dan een dashboard voor een docent. De directeur wil schoolbrede trends in één oogopslag. De docent wil details per leerling. Stel jezelf altijd de vraag: "Wie kijkt hier naar, en wat willen ze in 5 seconden weten?" Ontwerp nooit een dashboard zonder eerst de doelgroep te kennen.',
                },
                {
                    title: 'Principe 2: Kies de juiste visualisatie',
                    icon: '📊',
                    content:
                        'Elk grafiektype heeft een specifiek doel: staafdiagram = categorieën vergelijken. Lijndiagram = trend in de tijd tonen. Cirkeldiagram = verdeling van een geheel. Getalskaart (KPI) = één belangrijk getal uitlichten. Gebruik nooit een grafiek alleen omdat hij er mooi uitziet — de boodschap bepaalt het type.',
                },
                {
                    title: 'Principe 3: Minder is meer',
                    icon: '✂️',
                    content:
                        'Een dashboard vol grafieken is verwarrend. Beperk je tot 4-6 visualisaties per scherm. Gebruik witruimte om het overzichtelijk te houden. Verwijder alles wat de kijker afleidt van de kernboodschap. Edward Tufte, de grondlegger van datavisualisatie, noemde dit "data-ink ratio": elke pixel moet nuttige informatie bevatten.',
                },
                {
                    title: 'Principe 4: Gebruik kleur bewust',
                    icon: '🎨',
                    content:
                        'Kleur trekt aandacht — gebruik het om te benadrukken, niet om te decoreren. Rood signaleert een probleem (laag cijfer, hoge afwezigheid). Groen = goed. Grijs = neutraal. Gebruik nooit meer dan 4-5 kleuren per dashboard. Denk ook aan kleurenblinden: zorg dat informatie niet alleen door kleur wordt overgebracht.',
                },
            ],
            questions: [
                {
                    id: 'q7-principe-toepassen',
                    question:
                        'De directeur wil weten of aanwezigheid de afgelopen 6 maanden is gestegen of gedaald. Welk grafiektype past het best?',
                    type: 'multiple-choice',
                    options: ['Cirkeldiagram', 'Staafdiagram', 'Lijndiagram', 'Getalskaart (KPI)'],
                    correctAnswer: 'Lijndiagram',
                    explanation:
                        'Een lijndiagram is ideaal voor het tonen van een trend over tijd. Zes maanden is een tijdreeks — dan zie je in een lijndiagram direct of het omhoog of omlaag gaat. Een staafdiagram zou ook kunnen, maar een lijn maakt de trend visueel sterker.',
                    points: 15,
                },
                {
                    id: 'q8-dashboard-reflectie',
                    question:
                        'Beschrijf in 2-3 zinnen hoe jij een dashboard zou ontwerpen voor klas 2C. Welke KPI\'s zou jij kiezen en waarom?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een effectief antwoord benoemt 2-3 relevante KPI\'s (bijv. aanwezigheid, gemiddeld cijfer, aantal onvoldoendes), legt uit waarom die het belangrijkst zijn voor 2C, en koppelt ze aan een actie voor de docent. Een goed dashboard triggert een gesprek: "Wat doen we nu met deze informatie?"',
                    points: 0,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🏆',
            title: 'Dashboard Designer Pro!',
            color: '#2563EB',
        },
        {
            minScore: 65,
            emoji: '📈',
            title: 'Data Visualist',
            color: '#10B981',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Dashboard Starter',
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
        'Een goed dashboard toont alleen de meest relevante data (KPI\'s)',
        'Elk grafiektype heeft een specifiek doel: staaf = vergelijken, lijn = trend, cirkel = verdeling',
        'Ken je doelgroep: ontwerp altijd vanuit de vraag van de kijker',
        'Minder is meer: 4-6 visualisaties per scherm houden het overzichtelijk',
        'Kleur gebruik je om te benadrukken, niet om te decoreren',
    ],
};

export default dashboardDesignerConfig;
