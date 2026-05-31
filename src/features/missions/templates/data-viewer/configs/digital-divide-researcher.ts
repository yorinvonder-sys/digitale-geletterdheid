import type { DataViewerConfig } from '../DataViewer';

export const digitalDivideResearcherConfig: DataViewerConfig = {
    missionId: 'digital-divide-researcher',
    title: 'Digital Divide Researcher',
    introEmoji: '🌍',
    introTitle: 'Onderzoek de digitale kloof',
    introDescription:
        'Niet iedereen heeft gelijke toegang tot het digitale leven. Ouderen zonder smartphone, gezinnen zonder stabiel internet, mensen die zich geen laptop kunnen veroorloven — dit heet de digitale kloof. Jij gaat als onderzoeker uitzoeken hoe groot het probleem is en wie het raakt.',
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Policy case: kies welke groep als eerste digitale hulp nodig heeft.',
        primaryInteraction: 'prioritize-case',
        feedbackMoment: 'Na de impactkeuze hoort de leerling waarom toegang, inkomen, leeftijd of ontwerp drempels maken.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling gebruikt kloofdata om een hulpprioriteit voorzichtig te onderbouwen.',
        antiBoringRule: 'Maatschappelijke data start met een menselijke beleidskeuze, niet met een tabeloverzicht.',
        chromeAcceptance: 'Impactkeuze en alle dataweergaven blijven waardig, rustig en responsive.',
    },
    introFeatures: [
        'Analyseer CBS-data over internetgebruik per bevolkingsgroep',
        'Vergelijk digitale toegang tussen landen in Europa',
        'Beoordeel welke beleidsmaatregelen het meest effectief zijn',
    ],
    investigationHook: {
        title: 'Een gemeente heeft één hulpprogramma over',
        role: 'Toegankelijkheidsonderzoeker',
        scenario:
            'De gemeente kan maar één groep als eerste helpen met digitale toegang en vaardigheden. Jij kiest een onderzoeksspoor voordat je de ongelijkheidsdata opent.',
        prompt: 'Welke groep onderzoek je eerst voor hulp?',
        contextLabel: 'Impactkeuze',
        continueLabel: 'Bekijk de kloofdata',
        options: [
            {
                id: 'ouderen',
                label: 'Ouderen die online diensten moeten gebruiken',
                description: 'Je let op internetgebruik, basisvaardigheden en zelfstandigheid bij digitale overheid of bankzaken.',
                evidenceChips: ['Internet 58%', 'Basisvaardigheden 32%', 'DigiSterker hulp'],
                impactCue: 'Zelfstandig meedoen met zorg, overheid en bankzaken',
                feedback: 'Sterk maatschappelijk spoor. Digitale toegang raakt hier direct aan meedoen, zorg en praktische zelfstandigheid.',
            },
            {
                id: 'laag-inkomen',
                label: 'Gezinnen met weinig geld voor apparaten',
                description: 'Je onderzoekt hoe toegang, inkomen en vaardigheid elkaar versterken.',
                evidenceChips: ['Internet 81%', 'Vaardigheden 55%', 'apparaatfonds'],
                impactCue: 'Toegang, oefenkansen en betaalbare apparatuur',
                feedback: 'Goede keuze. De digitale kloof is vaak ook een economische kloof: zonder apparaat kun je nauwelijks oefenen.',
            },
            {
                id: 'beperking',
                label: 'Mensen voor wie ontwerp drempels maakt',
                description: 'Je zoekt signalen dat digitale diensten niet toegankelijk genoeg zijn ontworpen.',
                evidenceChips: ['Internet 76%', 'Vaardigheden 44%', 'toegankelijke diensten'],
                impactCue: 'Ontwerp dat drempels wegneemt',
                feedback: 'Belangrijk. Soms is het probleem niet de gebruiker, maar een systeem dat geen rekening houdt met verschillen.',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'digitale-kloof-nederland',
            title: 'Internetgebruik naar bevolkingsgroep — Nederland 2024 (CBS)',
            description:
                'Het CBS meet jaarlijks hoeveel Nederlanders het internet gebruiken, uitgesplitst naar groepen. Bekijk de tabel en zoek patronen in digitale ongelijkheid.',
            type: 'table',
            columns: [
                { key: 'groep', label: 'Bevolkingsgroep', sortable: true },
                { key: 'internet_gebruik_pct', label: 'Internetgebruik (%)', sortable: true },
                { key: 'basis_vaardigheden_pct', label: 'Basisvaardigheden (%)', sortable: true },
                { key: 'bankonline_pct', label: 'Online bankieren (%)', sortable: true },
                { key: 'kwetsbaar', label: 'Kwetsbaar?', sortable: true },
            ],
            rows: [
                { groep: '16-24 jaar', internet_gebruik_pct: 99, basis_vaardigheden_pct: 97, bankonline_pct: 94, kwetsbaar: 'Nee' },
                { groep: '25-44 jaar', internet_gebruik_pct: 98, basis_vaardigheden_pct: 94, bankonline_pct: 92, kwetsbaar: 'Nee' },
                { groep: '45-64 jaar', internet_gebruik_pct: 94, basis_vaardigheden_pct: 82, bankonline_pct: 85, kwetsbaar: 'Licht' },
                { groep: '65-74 jaar', internet_gebruik_pct: 83, basis_vaardigheden_pct: 61, bankonline_pct: 68, kwetsbaar: 'Matig' },
                { groep: '75+ jaar', internet_gebruik_pct: 58, basis_vaardigheden_pct: 32, bankonline_pct: 41, kwetsbaar: 'Hoog' },
                { groep: 'Laag inkomen', internet_gebruik_pct: 81, basis_vaardigheden_pct: 55, bankonline_pct: 63, kwetsbaar: 'Hoog' },
                { groep: 'Laagopgeleid', internet_gebruik_pct: 78, basis_vaardigheden_pct: 48, bankonline_pct: 57, kwetsbaar: 'Hoog' },
                { groep: 'Met beperking', internet_gebruik_pct: 76, basis_vaardigheden_pct: 44, bankonline_pct: 52, kwetsbaar: 'Hoog' },
            ],
            questions: [
                {
                    id: 'q1-kwetsbaarste-groep',
                    question:
                        'Welke groep zou jij als eerste hulp geven? Gebruik minimaal twee datapunten uit de tabel en formuleer respectvol, zonder de groep te labelen als "probleem".',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een sterke onderbouwing kiest bijvoorbeeld 75+ omdat deze groep het laagste internetgebruik (58%) én het laagste percentage digitale basisvaardigheden (32%) heeft. Je kunt ook een andere groep kiezen als je uitlegt welke data dat ondersteunt. Belangrijk: beschrijf de drempel in toegang of vaardigheid, niet de mensen als probleem.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'hulpprioriteit', keywords: ['75+', 'laag inkomen', 'laagopgeleid', 'beperking', 'ouderen', 'groep'] },
                        { label: 'toegangsdata', keywords: ['internetgebruik', '58', '76', '78', '81', 'toegang'] },
                        { label: 'vaardigheden of bankieren', keywords: ['basisvaardigheden', '32', '44', '48', '55', 'bankieren'] },
                        { label: 'respectvolle formulering', keywords: ['hulp', 'drempel', 'toegang', 'vaardigheid', 'ondersteuning', 'meedoen'] },
                    ],
                },
                {
                    id: 'q2-kloof-jongeren-ouderen',
                    question:
                        'Hoeveel procentpunt verschil is er in digitale basisvaardigheden tussen 16-24 jaar en 75+ jaar?',
                    type: 'number-input',
                    correctAnswer: 65,
                    explanation:
                        '16-24 jaar: 97% basisvaardigheden. 75+ jaar: 32%. Verschil: 97 − 32 = 65 procentpunt. Dit enorme gat is de kern van de generatie-digitale kloof. Jongeren zijn opgegroeid met internet; ouderen niet.',
                    points: 15,
                },
                {
                    id: 'q3-oorzaak-observatie',
                    question:
                        'Laagopgeleiden scoren lager dan hoog-opgeleiden op digitale vaardigheden. Noem twee mogelijke oorzaken voor deze ongelijkheid.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Mogelijke oorzaken: (1) Economisch — minder geld voor apparaten en internet. (2) Educatief — minder blootstelling aan ICT tijdens opleiding. (3) Werkgerelateerd — minder beroepen waarbij je verplicht bent digitale tools te leren. (4) Vertrouwen — lager digitaal zelfvertrouwen. Digitale ongelijkheid hangt samen met andere vormen van maatschappelijke ongelijkheid.',
                    points: 10,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'toegang of geld', keywords: ['geld', 'inkomen', 'apparaat', 'laptop', 'internet', 'toegang'] },
                        { label: 'opleiding of oefening', keywords: ['opleiding', 'school', 'onderwijs', 'ict', 'vaardigheden', 'leren'] },
                        { label: 'werk of zelfvertrouwen', keywords: ['werk', 'beroep', 'zelfvertrouwen', 'vertrouwen', 'ervaring'] },
                    ],
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'digitale-toegang-europa',
            title: 'Percentage huishoudens met breedband-internet — Europa 2024',
            description:
                'De digitale kloof bestaat niet alleen binnen landen, maar ook tussen landen. Bekijk de breedband-toegang per Europees land.',
            type: 'bar-chart',
            chartData: [
                { label: 'Nederland', value: 98, color: '#D7C95F' },
                { label: 'Zweden', value: 96, color: '#0B453F' },
                { label: 'Duitsland', value: 91, color: '#0B453F' },
                { label: 'Spanje', value: 87, color: '#D97848' },
                { label: 'Polen', value: 82, color: '#5F947D' },
                { label: 'Roemenië', value: 68, color: '#445865' },
                { label: 'Bulgarije', value: 62, color: '#D97848' },
            ],
            questions: [
                {
                    id: 'q4-europese-kloof',
                    question:
                        'Hoeveel procentpunt verschil is er in breedband-toegang tussen Nederland en Bulgarije?',
                    type: 'number-input',
                    correctAnswer: 36,
                    explanation:
                        'Nederland: 98%. Bulgarije: 62%. Verschil: 98 − 62 = 36 procentpunt. Dit is de Europese digitale kloof: rijkere westerse landen hebben veel hogere internetpenetratie dan armere Oost-Europese landen.',
                    points: 15,
                },
                {
                    id: 'q5-eu-gemiddelde',
                    question:
                        'Wat is het gemiddelde breedband-percentage van alle 7 landen in de grafiek?',
                    type: 'number-input',
                    correctAnswer: 83.4,
                    explanation:
                        'Totaal: 98 + 96 + 91 + 87 + 82 + 68 + 62 = 584. Gemiddelde: 584 ÷ 7 ≈ 83,4%. Nederland zit ver boven het gemiddelde van deze groep landen.',
                    points: 10,
                },
                {
                    id: 'q6-beleid-observatie',
                    question:
                        'Stel dat de EU 100 miljoen euro heeft om de digitale kloof te verkleinen. Zou jij het geld liever inzetten in Nederland of in Bulgarije? Onderbouw je keuze met data.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Het sterkste argument is voor Bulgarije: 36% van de huishoudens heeft geen breedbandtoegang — dat zijn honderdduizenden gezinnen. In Nederland is al 98% aangesloten; elke extra euro heeft minder impact. EU-subsidies gaan dan ook systematisch naar lidstaten met de laagste digitale toegang. Dit heet "where impact is highest".',
                    points: 10,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'landkeuze', keywords: ['bulgarije', 'nederland'] },
                        { label: 'databewijs', keywords: ['36', '62', '98', 'procent', 'breedband'] },
                        { label: 'impactreden', keywords: ['impact', 'toegang', 'huishoudens', 'achterstand', 'kloof'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'beleidsmaatregelen-kloof',
            title: 'Vier maatregelen om de digitale kloof te verkleinen',
            description:
                'Overheden, scholen en bedrijven experimenteren met verschillende oplossingen. Bekijk de voor- en nadelen van elk aanpak.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Maatregel 1: Gratis laptops voor leerlingen',
                    icon: '💻',
                    content:
                        'Verschillende gemeenten geven gratis laptops aan leerlingen uit gezinnen met een laag inkomen. In Amsterdam kregen 4.000 leerlingen een laptop tijdens de coronapandemie. Voordeel: directe toegang voor kwetsbare leerlingen. Nadeel: eenmalig — wat als het apparaat kapotgaat? En thuis is er soms toch geen internet. Een laptop zonder wifi is beperkt nuttig.',
                },
                {
                    title: 'Maatregel 2: Betaalbaar internet voor kwetsbare gezinnen',
                    icon: '📡',
                    content:
                        'KPN en T-Mobile bieden via het programma "Kans op internet" voor €10 per maand internet aan gezinnen die in aanmerking komen voor bijstand. De overheid subsidieert het resterende bedrag. Voordeel: structurele toegang. Nadeel: bereikt niet iedereen — je moet het weten en aanvragen. Veel kwetsbare gezinnen doen dat niet.',
                },
                {
                    title: 'Maatregel 3: DigiSterker voor ouderen',
                    icon: '👴',
                    content:
                        'DigiSterker is een landelijk programma waarbij vrijwilligers en bibliotheken ouderen leren internetten, e-mailen en DigiD gebruiken. Voordeel: laagdrempelig, persoonlijk contact, gericht op vaardigheden. Nadeel: schaalprobleem — Nederland telt 3,2 miljoen 65-plussers, en vrijwilligers zijn schaars. Wachtlijsten zijn lang.',
                },
                {
                    title: 'Maatregel 4: Digitale basisvaardigheden in het onderwijs',
                    icon: '🏫',
                    content:
                        'Sinds 2024 zijn digitale vaardigheden verplicht in het Nederlandse basisonderwijs en voortgezet onderwijs (via Curriculum.nu). Voordeel: bereikt de volgende generatie systematisch. Nadeel: helpt niet de mensen die nu al achter zijn. En de kwaliteit van digitaal onderwijs verschilt sterk per school — rijkere scholen hebben betere ICT-faciliteiten.',
                },
            ],
            questions: [
                {
                    id: 'q7-maatregel-structureel',
                    question:
                        'Kies één maatregel als langetermijnprioriteit voor kinderen in kwetsbare gezinnen. Combineer toegang én vaardigheden in je uitleg en noem ook wat deze maatregel niet direct oplost.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Een sterke prioriteit kiest vaak digitale vaardigheden in het onderwijs, omdat dit alle leerlingen structureel bereikt en vaardigheden opbouwt. De beste antwoorden combineren dat met toegang: zonder laptop, internet of begeleiding blijft de kloof bestaan. Een volwassen aanbeveling benoemt daarom ook de beperking: onderwijs helpt vooral op lange termijn en lost niet meteen apparaat- of internetproblemen thuis op.',
                    points: 15,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'maatregel gekozen', keywords: ['onderwijs', 'internet', 'laptop', 'vaardigheden', 'training', 'school'] },
                        { label: 'structureel effect', keywords: ['structureel', 'langetermijn', 'duurzaam', 'alle leerlingen', 'volgende generatie'] },
                        { label: 'toegang en vaardigheden', keywords: ['toegang', 'apparaat', 'laptop', 'internet', 'vaardigheden', 'oefenen'] },
                        { label: 'beperking benoemd', keywords: ['nadeel', 'lost niet', 'maar', 'beperking', 'niet direct', 'thuis'] },
                    ],
                },
                {
                    id: 'q8-aanbeveling-formuleren',
                    question:
                        'Formuleer één concrete aanbeveling voor de Nederlandse overheid om de digitale kloof bij 75-plussers te verkleinen. Onderbouw waarom jij juist deze aanpak kiest.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Goede aanbevelingen koppelen de aanpak aan de specifieke barrière voor 75-plussers. Typisch: (1) Uitbreiding DigiSterker met meer vrijwilligers en gemeentelijke financiering — gericht op vaardigen, laagdrempelig. (2) Verplichting voor banken om altijd een fysiek loket te houden — vermindert de afhankelijkheid van digitale vaardigheden voor essentiële diensten. De aanbeveling is sterker als ze ingaat op waarom de kloof voor ouderen specifiek bestaat (geen opgegroeid-met-internet).',
                    points: 10,
                    minLength: 60,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'doelgroep 75+', keywords: ['75', 'ouderen', '65', 'senioren'] },
                        { label: 'concrete maatregel', keywords: ['digisterker', 'vrijwilligers', 'bibliotheek', 'loket', 'training', 'cursus'] },
                        { label: 'waarom dit helpt', keywords: ['vaardigheden', 'laagdrempelig', 'persoonlijk', 'toegang', 'vertrouwen'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🌍',
            title: 'Digital Inclusie Expert!',
            color: '#0B453F',
        },
        {
            minScore: 65,
            emoji: '🔬',
            title: 'Onderzoeker Digitale Kloof',
            color: '#5F947D',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Data Analist',
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
        'De digitale kloof raakt ouderen, laaggeletterden en mensen met een laag inkomen het hardst',
        'Er zijn 65 procentpunt verschil in digitale basisvaardigheden tussen jongeren en 75-plussers',
        'Digitale ongelijkheid bestaat ook tussen Europese landen — Nederland scoort hoog, Bulgarije laag',
        'Alleen een laptop geven helpt niet als er geen internet of vaardigheden zijn',
        'Structurele oplossingen vereisen zowel toegang (apparaat + internet) als vaardigheden',
    ],
};

export default digitalDivideResearcherConfig;
