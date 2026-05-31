import type { DataViewerConfig } from '../DataViewer';

export const dashboardDesignerConfig: DataViewerConfig = {
    missionId: 'dashboard-designer',
    title: 'Dashboard Designer',
    introEmoji: '📈',
    introTitle: 'Word een Dashboard Designer',
    introDescription:
        'Een goed dashboard vertelt een verhaal zonder woorden. Bedrijven, scholen en overheden gebruiken dashboards om complexe data in één oogopslag begrijpelijk te maken. Jij leert welke visualisaties passen bij welke data — en waarom "minder meer is".',
    missionGoal: {
        primaryGoal: 'Ontwerp datakeuzes voor een dashboard door KPI’s, grafiektypen en doelgroep helder te onderbouwen.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Alle drie datasets zijn afgerond, observaties onderbouwen KPI- en grafiekkeuzes en de score is minimaal 65/100.',
        },
        evidence: 'Leerlingbewijs: antwoorden over schooldata, grafiekkeuze en dashboardprincipes plus drie observaties met doelgroep- en KPI-argumenten. Docentbewijs: score, fase-overzicht en zichtbaar tekstbewijs voor eindproductcriteria.',
    },
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Dashboard brief: kies één hoofd-KPI voordat de leerling de tabel ziet.',
        primaryInteraction: 'build',
        feedbackMoment: 'Na de KPI-keuze hoort de leerling hoe focus, doelgroep en vervolgvragen samenhangen.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling onderbouwt KPI, grafiektype en dashboardprincipe met observaties.',
        antiBoringRule: 'Dashboardontwerp begint met een ontwerpbesluit, niet met losse datavragen.',
        chromeAcceptance: 'KPI-keuze, grafiekdata en observatievelden blijven scanbaar op desktop, tablet en mobile.',
    },
    introFeatures: [
        'Analyseer schooldata over cijfers en aanwezigheid',
        'Ontdek welk grafiektype past bij welke soort data',
        'Beoordeel dashboard-ontwerpen op overzichtelijkheid',
    ],
    investigationHook: {
        title: 'De directie wil maar één hoofdgetal',
        role: 'Dashboard-redacteur',
        scenario:
            'De schooldirecteur opent het dashboard straks op een digibord. Er is bovenaan plek voor één hoofd-KPI. Jouw keuze bepaalt waar het gesprek over gaat.',
        prompt: 'Welke KPI verdient de eerste plek?',
        contextLabel: 'Dashboardfocus',
        continueLabel: 'Bekijk de schooldata',
        options: [
            {
                id: 'aanwezigheid',
                label: 'Aanwezigheid als waarschuwingssignaal',
                description: 'Je onderzoekt of afwezigheid vroeg laat zien waar prestaties later onder druk komen.',
                feedback: 'Sterk voor actiegericht dashboarden: aanwezigheid is snel meetbaar en kan een vroeg signaal zijn voordat cijfers dalen.',
                evidenceChips: ['89% bij 2C', '8 procentpunt verschil', 'trendvraag'],
                impactCue: 'Vroeg signaal',
            },
            {
                id: 'onvoldoendes',
                label: 'Aantal onvoldoendes als urgentie',
                description: 'Je zoekt naar de klas of het vak waar leerlingen nu het meest hulp nodig hebben.',
                feedback: 'Goede directiekeuze. Onvoldoendes maken urgentie zichtbaar, maar je moet straks wel verklaren wat erachter zit.',
                evidenceChips: ['19 onvoldoendes', '2C markeren', 'Wiskunde 28%'],
                impactCue: 'Hulpprioriteit',
            },
            {
                id: 'tevredenheid',
                label: 'Tevredenheid als verborgen risico',
                description: 'Je kijkt of cijfers alleen te weinig zeggen en welzijn/tevredenheid het verhaal aanvult.',
                feedback: 'Mooi genuanceerd. Een dashboard is sterker als het niet alleen prestaties toont, maar ook signalen die prestaties kunnen verklaren.',
                evidenceChips: ['6,5 tevredenheid', 'doelgroep', 'kleur bewust'],
                impactCue: 'Contextsignaal',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'schooldata-klassen',
            title: 'Schooldata leerjaar 2 — periode 1 (2025)',
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
                    question:
                        'Markeer de klas die bovenaan het dashboard als aandachtspunt moet komen. Onderbouw je keuze met minimaal twee datapunten uit de tabel, zoals cijfer, aanwezigheid, onvoldoendes of tevredenheid.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een sterke dashboardkeuze markeert klas 2C: deze klas heeft het laagste gemiddelde cijfer (6,4), de laagste aanwezigheid (89%) en de meeste onvoldoendes (19). Dat is een duidelijk patroon. Een goed directiedashboard toont niet alleen losse getallen, maar maakt zichtbaar waar actie nodig is.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'klas 2C gemarkeerd', keywords: ['2c', 'klas 2c', 'aandachtspunt'] },
                        { label: 'cijfer gebruikt', keywords: ['6,4', '6.4', 'laagste cijfer', 'gemiddelde', 'cijfer'] },
                        { label: 'aanwezigheid gebruikt', keywords: ['89', 'aanwezigheid', 'laagste aanwezigheid', 'afwezigheid'] },
                        { label: 'onvoldoendes of tevredenheid gebruikt', keywords: ['19', 'onvoldoendes', 'tevredenheid', '6,5', '6.5'] },
                        { label: 'actiegericht dashboard', keywords: ['actie', 'directie', 'dashboard', 'signaal', 'markeren'] },
                    ],
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
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'aanwezigheid', keywords: ['aanwezigheid', 'afwezigheid', 'percentage'] },
                        { label: 'cijfers of onvoldoendes', keywords: ['cijfer', 'onvoldoende', 'prestaties', 'gemiddelde'] },
                        { label: 'waarom relevant voor directeur', keywords: ['directeur', 'belangrijk', 'inzicht', 'actie', 'signaal'] },
                    ],
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
                { label: 'Wiskunde', value: 28, color: '#D97848' },
                { label: 'Engels', value: 18, color: '#0B453F' },
                { label: 'Nederlands', value: 14, color: '#5F947D' },
                { label: 'Aardrijkskunde', value: 22, color: '#D7C95F' },
                { label: 'Overige vakken', value: 18, color: '#0B453F' },
            ],
            questions: [
                {
                    id: 'q4-grootste-deel',
                    question:
                        'Pin het vak dat als prioriteitskaart op het directiedashboard moet verschijnen. Noem het percentage, leg uit waarom dit het grootste deel is en voorkom dat je het vak meteen "slecht" noemt.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Wiskunde vertegenwoordigt 28% van alle onvoldoendes — het grootste segment van het cirkeldiagram. Dit betekent niet dat wiskunde het "slechtste" vak is, maar dat het de meeste hulp nodig heeft.',
                    points: 10,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Wiskunde geprioriteerd', keywords: ['wiskunde'] },
                        { label: '28% genoemd', keywords: ['28', '28%'] },
                        { label: 'grootste aandeel of segment uitgelegd', keywords: ['grootste', 'meeste', 'aandeel', 'segment', 'deel'] },
                        { label: 'voorzichtige dashboardtaal', keywords: ['hulp', 'aandacht', 'prioriteit', 'niet slecht', 'niet het slechtste'] },
                    ],
                },
                {
                    id: 'q5-cirkel-geschikt',
                    question:
                        'Test je grafiekkeuze: wanneer mag dit cirkeldiagram blijven staan op het dashboard? Leg uit welk type data het toont en noem één situatie waarin je juist geen cirkeldiagram gebruikt.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een cirkeldiagram toont altijd hoe een geheel (100%) verdeeld is over delen. Het werkt goed met 3-6 categorieën. Bij meer categorieën worden de segmenten te klein om te lezen. Voor trends in de tijd gebruik je een lijndiagram.',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'geheel of 100% benoemd', keywords: ['geheel', '100', 'totaal'] },
                        { label: 'categorieën of delen benoemd', keywords: ['categorie', 'delen', 'verdeling', 'verdeeld'] },
                        { label: 'beperkt aantal categorieën', keywords: ['3-6', '3 tot 6', 'weinig categorie', 'te veel categorie'] },
                        { label: 'geen trend of tijdreeks', keywords: ['trend', 'tijd', 'lijn', 'lijndiagram', 'maanden'] },
                    ],
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
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'kleine verschillen zijn lastig in cirkel', keywords: ['kleine verschillen', 'lastig', 'moeilijk', 'cirkel'] },
                        { label: 'staafdiagram vergelijkt beter', keywords: ['staaf', 'balk', 'vergelijken', 'vergelijk'] },
                        { label: 'exacte waarden of categorieën', keywords: ['exact', 'waarde', 'categorie', 'lengte'] },
                    ],
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
                        'Test je dashboard voor de eerste directievraag: aanwezigheid over 6 maanden. Kies het grafiektype en verdedig waarom dit de stijging of daling sneller zichtbaar maakt dan een cirkel of losse KPI.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een lijndiagram is ideaal voor het tonen van een trend over tijd. Zes maanden is een tijdreeks — dan zie je in een lijndiagram direct of het omhoog of omlaag gaat. Een staafdiagram zou ook kunnen, maar een lijn maakt de trend visueel sterker.',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'lijndiagram gekozen', keywords: ['lijndiagram', 'lijn'] },
                        { label: 'trend over tijd benoemd', keywords: ['trend', 'tijd', 'maanden', '6 maanden', 'zes maanden'] },
                        { label: 'stijging of daling zichtbaar', keywords: ['stijging', 'daling', 'omhoog', 'omlaag', 'verandering'] },
                        { label: 'vergeleken met cirkel of KPI', keywords: ['cirkel', 'cirkeldiagram', 'kpi', 'losse kpi'] },
                    ],
                },
                {
                    id: 'q8-dashboard-reflectie',
                    question:
                        'Beschrijf in 2-3 zinnen hoe jij een dashboard zou ontwerpen voor klas 2C. Welke KPI\'s zou jij kiezen en waarom?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een effectief antwoord benoemt 2-3 relevante KPI\'s (bijv. aanwezigheid, gemiddeld cijfer, aantal onvoldoendes), legt uit waarom die het belangrijkst zijn voor 2C, en koppelt ze aan een actie voor de docent. Een goed dashboard triggert een gesprek: "Wat doen we nu met deze informatie?"',
                    points: 10,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'klas 2C', keywords: ['2c', 'klas'] },
                        { label: 'relevante KPI’s', keywords: ['kpi', 'aanwezigheid', 'cijfer', 'onvoldoende', 'tevredenheid'] },
                        { label: 'actie of docentgesprek', keywords: ['actie', 'docent', 'gesprek', 'hulp', 'aanpak'] },
                    ],
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
            color: '#0B453F',
        },
        {
            minScore: 65,
            emoji: '📈',
            title: 'Data Visualist',
            color: '#5F947D',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Dashboard Starter',
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
        'Een goed dashboard toont alleen de meest relevante data (KPI\'s)',
        'Elk grafiektype heeft een specifiek doel: staaf = vergelijken, lijn = trend, cirkel = verdeling',
        'Ken je doelgroep: ontwerp altijd vanuit de vraag van de kijker',
        'Minder is meer: 4-6 visualisaties per scherm houden het overzichtelijk',
        'Kleur gebruik je om te benadrukken, niet om te decoreren',
    ],
};

export default dashboardDesignerConfig;
