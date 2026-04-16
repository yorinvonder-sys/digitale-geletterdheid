import type { DataViewerConfig } from '../DataViewer';

export const digitalDivideResearcherConfig: DataViewerConfig = {
    missionId: 'digital-divide-researcher',
    title: 'Digital Divide Researcher',
    introEmoji: '🌍',
    introTitle: 'Onderzoek de digitale kloof',
    introDescription:
        'Niet iedereen heeft gelijke toegang tot het digitale leven. Ouderen zonder smartphone, gezinnen zonder stabiel internet, mensen die zich geen laptop kunnen veroorloven — dit heet de digitale kloof. Jij gaat als onderzoeker uitzoeken hoe groot het probleem is en wie het raakt.',
    introFeatures: [
        'Analyseer CBS-data over internetgebruik per bevolkingsgroep',
        'Vergelijk digitale toegang tussen landen in Europa',
        'Beoordeel welke beleidsmaatregelen het meest effectief zijn',
    ],

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
                        'Welke bevolkingsgroep heeft zowel het laagste internetgebruik als het laagste percentage basisvaardigheden?',
                    type: 'multiple-choice',
                    options: ['65-74 jaar', '75+ jaar', 'Laag inkomen', 'Met beperking'],
                    correctAnswer: '75+ jaar',
                    explanation:
                        'De groep 75+ heeft het laagste internetgebruik (58%) én het laagste percentage digitale basisvaardigheden (32%). Dit is een dubbele kwetsbaarheid: ze zijn minder online én hebben minder vaardigheden als ze online zijn. Sorteer op "Internetgebruik" of "Basisvaardigheden" om het snel te bevestigen.',
                    points: 15,
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
                { label: 'Nederland', value: 98, color: '#F59E0B' },
                { label: 'Zweden', value: 96, color: '#3B82F6' },
                { label: 'Duitsland', value: 91, color: '#8B5CF6' },
                { label: 'Spanje', value: 87, color: '#EF4444' },
                { label: 'Polen', value: 82, color: '#10B981' },
                { label: 'Roemenië', value: 68, color: '#6B7280' },
                { label: 'Bulgarije', value: 62, color: '#D97757' },
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
                        'Welke maatregel pakt de digitale kloof het meest structureel aan voor kinderen in kwetsbare gezinnen?',
                    type: 'multiple-choice',
                    options: [
                        'Gratis laptops voor leerlingen',
                        'Betaalbaar internet voor gezinnen',
                        'DigiSterker voor ouderen',
                        'Digitale vaardigheden in het onderwijs',
                    ],
                    correctAnswer: 'Digitale vaardigheden in het onderwijs',
                    explanation:
                        'Digitale vaardigheden in het onderwijs bereikt alle leerlingen structureel en duurzaam — niet eenmalig. De combinatie van toegang (laptop + internet) én vaardigheden (onderwijs) is sterker dan elk los. Maar het duurt generaties om effect te hebben. Voor direct effect is "betaalbaar internet" effectiever.',
                    points: 15,
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
            color: '#2563EB',
        },
        {
            minScore: 65,
            emoji: '🔬',
            title: 'Onderzoeker Digitale Kloof',
            color: '#10B981',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'Data Analist',
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
        'De digitale kloof raakt ouderen, laaggeletterden en mensen met een laag inkomen het hardst',
        'Er zijn 65 procentpunt verschil in digitale basisvaardigheden tussen jongeren en 75-plussers',
        'Digitale ongelijkheid bestaat ook tussen Europese landen — Nederland scoort hoog, Bulgarije laag',
        'Alleen een laptop geven helpt niet als er geen internet of vaardigheden zijn',
        'Structurele oplossingen vereisen zowel toegang (apparaat + internet) als vaardigheden',
    ],
};

export default digitalDivideResearcherConfig;
