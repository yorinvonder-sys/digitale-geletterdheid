import type { DataViewerConfig } from '../DataViewer';

export const spreadsheetSpecialistConfig: DataViewerConfig = {
    missionId: 'spreadsheet-specialist',
    title: 'Spreadsheet Specialist',
    introEmoji: '📊',
    introTitle: 'Word een Spreadsheet Specialist',
    introDescription:
        'Spreadsheets zijn de werkpaarden van data-analisten, ondernemers en wetenschappers. Jij gaat leren hoe je formules schrijft, grafieken maakt en data samenvat — net als echte professionals. Analyseer het kasboek van de leerlingenraad!',
    missionGoal: {
        primaryGoal: 'Gebruik spreadsheetdata en formules om financiële patronen te berekenen, visualiseren en uitleggen.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Alle drie datasets zijn afgerond, formule-observaties noemen de juiste begrippen en de score is minimaal 65/100.',
        },
        evidence: 'Leerlingbewijs: berekeningen, formulekeuzes en observaties over grafieksoorten en misleidende gemiddelden. Docentbewijs: score, fase-overzicht en tekstbewijs waarin formulebegrip en interpretatie zichtbaar zijn.',
    },
    experienceDesign: {
        boringRisk: 'low',
        firstTenSeconds: 'Formula rescue: het kasboektotaal klopt niet en jij kiest welk bewijs eerst wordt gecontroleerd.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Feedback koppelt formulekeuze, bereik en grafiekbewijs aan een gecorrigeerd kasboekadvies.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling noemt formule, categorie, bedrag en grafiekkeuze voordat het budgetadvies telt.',
        antiBoringRule: 'Spreadsheetwerk moet voelen als foutopsporing in een kasboek, niet als losse formulequiz.',
        chromeAcceptance: 'Formulecrisis, kasboekrijen, grafiekbewijs en tekstobservaties blijven scanbaar zonder overflow.',
    },
    introFeatures: [
        'Analyseer het kasboek van de leerlingenraad met formules',
        'Vergelijk uitgaven per categorie in een grafiek',
        'Beoordeel welke formule je wanneer gebruikt',
    ],
    investigationHook: {
        title: 'Het budgetrapport geeft een vreemd totaal',
        role: 'Formule-auditor',
        scenario:
            'De leerlingenraad wil stemmen over een nieuw evenement, maar het kasboek lijkt niet te kloppen. Jij kiest welk spoor je eerst controleert.',
        prompt: 'Welke controle levert waarschijnlijk het snelste bewijs op?',
        contextLabel: 'Formulespoor',
        continueLabel: 'Open het kasboek',
        options: [
            {
                id: 'sumif',
                label: 'Check de SOM.ALS voor uitgaven',
                description: 'Je controleert of alleen uitgave-rijen in het totaal zijn meegenomen.',
                evidenceChips: ['Uitgaven 513', 'SOM.ALS', 'type=Uitgave'],
                impactCue: 'Voorwaarde + bereik',
                feedback: 'Goed spoor. SOM.ALS voorkomt dat inkomsten en uitgaven door elkaar in één totaal belanden.',
            },
            {
                id: 'category-income',
                label: 'Vergelijk inkomsten per categorie',
                description: 'Je zoekt welke categorie echt de meeste inkomsten oplevert.',
                evidenceChips: ['Subsidie 700', 'Verkoop 272', 'categorie totaal'],
                impactCue: 'Inkomstenbewijs',
                feedback: 'Slim. Een budgetadvies wordt sterker als je categorieën met bedragen onderbouwt.',
            },
            {
                id: 'outlier',
                label: 'Spoor een uitschieter op met MAX',
                description: 'Je test of één dure post het beeld vertekent.',
                evidenceChips: ['Evenement 460', 'Materiaal 53', 'MAX duurste post'],
                impactCue: 'Uitschieter vinden',
                feedback: 'Sterke auditkeuze. MAX helpt om extreme bedragen te vinden voordat een gemiddelde misleidt.',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'kasboek-leerlingenraad',
            title: 'Kasboek Leerlingenraad — schooljaar 2024/2025',
            description:
                'De penningmeester van de leerlingenraad heeft alle inkomsten en uitgaven bijgehouden. Bekijk de tabel en beantwoord de vragen over formules en totalen.',
            type: 'table',
            columns: [
                { key: 'maand', label: 'Maand', sortable: true },
                { key: 'categorie', label: 'Categorie', sortable: true },
                { key: 'omschrijving', label: 'Omschrijving', sortable: false },
                { key: 'bedrag_euro', label: 'Bedrag (€)', sortable: true },
                { key: 'type', label: 'Type', sortable: true },
            ],
            rows: [
                { maand: 'September', categorie: 'Evenement', omschrijving: 'Introductiedag', bedrag_euro: 120, type: 'Uitgave' },
                { maand: 'September', categorie: 'Subsidie', omschrijving: 'Schoolbijdrage', bedrag_euro: 500, type: 'Inkomst' },
                { maand: 'Oktober', categorie: 'Evenement', omschrijving: 'Halloween feest', bedrag_euro: 85, type: 'Uitgave' },
                { maand: 'Oktober', categorie: 'Verkoop', omschrijving: 'Koekjesverkoop', bedrag_euro: 42, type: 'Inkomst' },
                { maand: 'November', categorie: 'Materiaal', omschrijving: 'Posters drukken', bedrag_euro: 35, type: 'Uitgave' },
                { maand: 'December', categorie: 'Evenement', omschrijving: 'Kerstmarkt', bedrag_euro: 160, type: 'Uitgave' },
                { maand: 'December', categorie: 'Verkoop', omschrijving: 'Kerstmarkt opbrengst', bedrag_euro: 230, type: 'Inkomst' },
                { maand: 'Januari', categorie: 'Materiaal', omschrijving: 'Vergadersnacks', bedrag_euro: 18, type: 'Uitgave' },
                { maand: 'Februari', categorie: 'Evenement', omschrijving: 'Carnaval activiteit', bedrag_euro: 95, type: 'Uitgave' },
                { maand: 'Maart', categorie: 'Subsidie', omschrijving: 'Gemeentelijke subsidie', bedrag_euro: 200, type: 'Inkomst' },
            ],
            questions: [
                {
                    id: 'q1-totaal-uitgaven',
                    question: 'Hoeveel euro is de leerlingenraad in totaal kwijtgeraakt aan uitgaven? (Tel alle Uitgave-rijen op)',
                    type: 'number-input',
                    showConfidence: true,
                    correctAnswer: 513,
                    explanation:
                        'Alle uitgaven: 120 + 85 + 35 + 160 + 18 + 95 = 513 euro. In een Nederlandse spreadsheet gebruik je bijvoorbeeld =SOM.ALS(E2:E11;"Uitgave";D2:D11). Filter op "Uitgave" om het snel te controleren.',
                    points: 20,
                },
                {
                    id: 'q2-hoogste-inkomst',
                    question:
                        'Pin de inkomsten-categorie die het budget het meest draagt. Noem de categorie, de twee bedragen die je optelt en vergelijk kort met verkoop.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Subsidie bracht 500 + 200 = 700 euro op. Verkoop bracht 42 + 230 = 272 euro. Subsidie wint. Een formule-auditor onderbouwt de categorie dus met beide bedragen en een vergelijking.',
                    points: 15,
                    minLength: 65,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'subsidie gekozen', keywords: ['subsidie', 'sponsoring'] },
                        { label: 'beide subsidiebedragen genoemd', keywords: ['500', '200', '700'] },
                        { label: 'verkoopvergelijking genoemd', keywords: ['verkoop', '42', '230', '272'] },
                        { label: 'budgetbewijs', keywords: ['inkomsten', 'categorie', 'bewijs', 'optellen'] },
                    ],
                },
                {
                    id: 'q3-formule-observatie',
                    question:
                        'Welke formule gebruik je om het gemiddelde bedrag per uitgave te berekenen? Beschrijf ook wanneer je =GEMIDDELDE() gebruikt in plaats van =SOM().',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '=GEMIDDELDE() gebruik je als je wilt weten wat een "typische" waarde is in een reeks. Hier wil je alleen uitgaven meenemen: =GEMIDDELDE.ALS(E2:E11;"Uitgave";D2:D11). Het gemiddelde van de 6 uitgaven is 513 ÷ 6 = 85,50 euro.',
                    points: 10,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'gemiddelde of gemiddelde.als', keywords: ['gemiddelde', 'gemiddelde.als', '=gemiddelde'] },
                        { label: 'typische waarde', keywords: ['typische', 'gemiddeld bedrag', 'per uitgave', 'representatief'] },
                        { label: 'SOM is voor totaal', keywords: ['som', '=som', 'totaal', 'optellen'] },
                    ],
                },
            ],
            followUp: {
                question: 'Wat is het grootste voordeel van formules boven handmatig rekenen in spreadsheets?',
                options: ['Formules zijn sneller om te typen', 'Formules updaten automatisch bij nieuwe data', 'Formules zien er professioneler uit', 'Formules gebruiken minder geheugen'],
                correctIndex: 1,
                explanation: 'Het grootste voordeel is dat formules automatisch herberekenen wanneer brondata verandert. Dit voorkomt fouten en bespaart tijd bij updates.',
                bonusPoints: 0,
            },
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'uitgaven-per-categorie',
            title: 'Uitgaven per categorie: vergelijking',
            description:
                'Een staafdiagram is ideaal om categorieën te vergelijken. Bekijk de totale uitgaven per categorie en beantwoord de vragen.',
            type: 'bar-chart',
            chartData: [
                { label: 'Evenement', value: 460, color: '#0B453F' },
                { label: 'Materiaal', value: 53, color: '#D7C95F' },
            ],
            questions: [
                {
                    id: 'q4-grootste-post',
                    question:
                        'Markeer de grootste uitgavenpost als grafiekbewijs. Noem de post, het bedrag en waarom dit in een staafdiagram meteen opvalt.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Evenementen kosten 460 euro — bijna 90% van de totale uitgaven (513 euro). Dit zijn de introductiedag, Halloween, Kerstmarkt en Carnaval bij elkaar opgeteld. Een staafdiagram maakt dit ongelijkwicht in één oogopslag zichtbaar.',
                    points: 10,
                    minLength: 55,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'evenement gekozen', keywords: ['evenement', 'evenementen'] },
                        { label: 'bedrag genoemd', keywords: ['460', '513', '90'] },
                        { label: 'staafdiagram verklaard', keywords: ['staaf', 'grafiek', 'balk', 'opvalt', 'vergelijken'] },
                        { label: 'vergelijking met materiaal', keywords: ['materiaal', '53', 'groter', 'verschil'] },
                    ],
                },
                {
                    id: 'q5-verschil',
                    question:
                        'Hoeveel euro meer geeft de leerlingenraad uit aan evenementen dan aan materiaal?',
                    type: 'number-input',
                    showConfidence: true,
                    correctAnswer: 407,
                    explanation:
                        'Evenement: 460 euro. Materiaal: 53 euro. Verschil: 460 − 53 = 407 euro. In een spreadsheet: =B2-B3 als de waarden in kolom B staan.',
                    points: 15,
                },
                {
                    id: 'q6-grafiekkeuze',
                    question:
                        'Waarom is een staafdiagram beter dan een lijndiagram voor het vergelijken van uitgaven per categorie? Leg uit in eigen woorden.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een staafdiagram is geschikt voor het vergelijken van losse categorieën die geen tijdsvolgorde hebben. Een lijndiagram gebruik je als je een trend in de tijd wilt tonen (bijv. uitgaven per maand). Categorieën zoals "Evenement" en "Materiaal" hebben geen logische volgorde, dus staafdiagram is de betere keuze.',
                    points: 10,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'staafdiagram vergelijkt categorieën', keywords: ['staaf', 'categorie', 'vergelijken', 'vergelijk'] },
                        { label: 'lijndiagram is voor tijd of trend', keywords: ['lijn', 'trend', 'tijd', 'maand'] },
                        { label: 'geen logische volgorde', keywords: ['geen volgorde', 'losse', 'niet op volgorde', 'geen tijdsvolgorde'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'formule-cheatsheet',
            title: 'Spreadsheet formules: wanneer gebruik je welke?',
            description:
                'Hieronder staan vier veelgebruikte spreadsheet-formules. Lees ze zorgvuldig — elk heeft een specifiek doel.',
            type: 'document-cards',
            cards: [
                {
                    title: '=SOM(bereik)',
                    icon: '➕',
                    content:
                        'Telt alle getallen in een bereik op. Gebruik dit als je een totaal wilt berekenen. Voorbeeld: =SOM(B2:B15) telt alle bedragen van rij 2 tot en met rij 15 op. Dit is de meest gebruikte formule in elk kasboek of begroting.',
                },
                {
                    title: '=GEMIDDELDE(bereik)',
                    icon: '📐',
                    content:
                        'Berekent het gemiddelde van alle getallen in een bereik. Gebruik dit om een "typische" waarde te vinden. Voorbeeld: =GEMIDDELDE(C2:C12) geeft het gemiddeld cijfer van een klas. Let op: uitschieters (heel hoge of lage waarden) kunnen het gemiddelde sterk beïnvloeden.',
                },
                {
                    title: '=MAX(bereik) en =MIN(bereik)',
                    icon: '📈',
                    content:
                        '=MAX() geeft de hoogste waarde in een bereik, =MIN() de laagste. Gebruik dit om uitschieters snel te vinden. Voorbeeld: =MAX(D2:D20) geeft de duurste aankoop in je kasboek. Handig bij het opsporen van onverwachte kosten of records.',
                },
                {
                    title: '=AANTAL(bereik)',
                    icon: '🔢',
                    content:
                        'Telt het aantal cellen in een bereik dat een getal bevat. Gebruik dit om te weten hoeveel datapunten je hebt. Voorbeeld: =AANTAL(B2:B50) telt hoeveel transacties er in je kasboek staan. Er is ook =AANTALA() die alle niet-lege cellen telt (ook tekst).',
                },
            ],
            questions: [
                {
                    id: 'q7-juiste-formule',
                    question:
                        'Kies als formule-auditor de formule waarmee je de duurste post vindt. Leg uit waarom die formule beter past dan SOM of GEMIDDELDE.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        '=MAX() geeft de hoogste waarde in een bereik terug — dat is precies de duurste aankoop. =SOM() geeft het totaal, =GEMIDDELDE() het gemiddelde en =AANTAL() telt alleen hoeveel rijen er zijn.',
                    points: 15,
                    minLength: 65,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'MAX gekozen', keywords: ['max', '=max', 'maximum', 'hoogste'] },
                        { label: 'duurste post uitgelegd', keywords: ['duurste', 'hoogste waarde', 'aankoop', 'post'] },
                        { label: 'SOM afgezet', keywords: ['som', '=som', 'totaal', 'optellen'] },
                        { label: 'GEMIDDELDE afgezet', keywords: ['gemiddelde', 'typische', 'gemiddeld'] },
                    ],
                },
                {
                    id: 'q8-formule-uitleg',
                    question:
                        'Leg uit: wanneer is het gemiddelde misleidend? Beschrijf een situatie waarbij je beter het maximum of minimum zou gebruiken.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het gemiddelde is misleidend als er uitschieters zijn. Stel: 9 leerlingen geven 1 euro uit en 1 leerling 100 euro — het gemiddelde is dan 10,9 euro, maar dat is niet representatief. In dat geval is =MAX() handiger om die uitschieter te spotten. Ook bij sportprestaties is het maximum (record) vaak relevanter dan het gemiddelde.',
                    points: 5,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'uitschieters', keywords: ['uitschieter', 'extreem', 'heel hoog', 'heel laag'] },
                        { label: 'gemiddelde kan misleiden', keywords: ['misleidend', 'niet representatief', 'vertekenen', 'gemiddelde'] },
                        { label: 'maximum of minimum gebruiken', keywords: ['max', 'maximum', 'min', 'minimum'] },
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
            title: 'Formule-expert!',
            color: '#D7C95F',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Data-analist in opleiding',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🔢',
            title: 'Spreadsheet-starter',
            color: '#5F947D',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#445865',
        },
    ],

    takeaways: [
        'Je weet wanneer je =SOM(), =GEMIDDELDE(), =MAX() en =MIN() gebruikt',
        'Een staafdiagram is geschikt voor het vergelijken van categorieën',
        'Gemiddelden kunnen misleidend zijn bij uitschieters in de data',
        'Sorteren en filteren helpt je snel patronen te vinden in een tabel',
        'Spreadsheets automatiseren berekeningen die anders veel tijd kosten',
    ],
};

export default spreadsheetSpecialistConfig;
