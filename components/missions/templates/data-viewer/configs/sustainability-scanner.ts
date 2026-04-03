import type { DataViewerConfig } from '../DataViewer';

export const sustainabilityScannerConfig: DataViewerConfig = {
    missionId: 'sustainability-scanner',
    title: 'Sustainability Scanner',
    introEmoji: '🌱',
    introTitle: 'Scan de digitale voetafdruk',
    introDescription:
        'Elke zoekopdracht, gestreamde video en verstuurde app-notificatie kost energie. Datacenters verbruiken meer stroom dan heel Nederland. Jij gaat de verborgen milieu-impact van technologie uitrekenen en nadenken over duurzame alternatieven.',
    introFeatures: [
        'Analyseer de CO2-uitstoot van verschillende digitale activiteiten',
        'Vergelijk energieverbruik van datacenters in Europa',
        'Beoordeel welke maatregelen de meeste impact hebben',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'co2-digitale-activiteiten',
            title: 'CO2-uitstoot per digitale activiteit (gram CO2 per gebruik)',
            description:
                'Onderzoekers van het Shift Project (2024) berekenden de CO2-uitstoot van veelgebruikte digitale activiteiten. Bekijk de tabel en reken de impact van jouw gedrag uit.',
            type: 'table',
            columns: [
                { key: 'activiteit', label: 'Activiteit', sortable: true },
                { key: 'co2_gram', label: 'CO2 (gram)', sortable: true },
                { key: 'vergelijking', label: 'Vergelijking', sortable: false },
                { key: 'categorie', label: 'Categorie', sortable: true },
                { key: 'frequentie_nl', label: 'Gem. frequentie NL/dag', sortable: true },
            ],
            rows: [
                { activiteit: 'E-mail versturen (tekst)', co2_gram: 0.3, vergelijking: '= 1 minuut gloeilamp branden', categorie: 'Communicatie', frequentie_nl: 40 },
                { activiteit: 'Google-zoekopdracht', co2_gram: 0.2, vergelijking: '= LED-lamp 3 seconden', categorie: 'Zoeken', frequentie_nl: 6 },
                { activiteit: 'Video streamen (1 uur SD)', co2_gram: 36, vergelijking: '= 5 km autorijden', categorie: 'Streaming', frequentie_nl: 2.5 },
                { activiteit: 'Video streamen (1 uur HD)', co2_gram: 97, vergelijking: '= 13 km autorijden', categorie: 'Streaming', frequentie_nl: 1.8 },
                { activiteit: 'AI-chatgesprek (10 berichten)', co2_gram: 12, vergelijking: '= LED-lamp 3 uur', categorie: 'AI', frequentie_nl: 0.4 },
                { activiteit: 'Cryptocurrency transactie (Bitcoin)', co2_gram: 700000, vergelijking: '= 700 km vliegen', categorie: 'Crypto', frequentie_nl: 0.01 },
                { activiteit: 'Foto uploaden (Instagram)', co2_gram: 0.6, vergelijking: '= 2 minuten gloeilamp', categorie: 'Social media', frequentie_nl: 3 },
                { activiteit: 'E-mail met bijlage (1 MB)', co2_gram: 19, vergelijking: '= LED-lamp 5 uur', categorie: 'Communicatie', frequentie_nl: 8 },
            ],
            questions: [
                {
                    id: 'q1-grootste-uitstoot',
                    question:
                        'Welke activiteit heeft veruit de hoogste CO2-uitstoot per gebruik?',
                    type: 'multiple-choice',
                    options: ['Video streamen HD', 'AI-chatgesprek', 'Cryptocurrency transactie', 'E-mail met bijlage'],
                    correctAnswer: 'Cryptocurrency transactie',
                    explanation:
                        'Een Bitcoin-transactie stoot 700.000 gram CO2 uit — dat is 700 kg! Dat is 7.000 keer meer dan een uur HD-streamen. Bitcoin gebruikt proof-of-work: miljarden berekeningen per seconde om één transactie te valideren. Sorteer op "CO2 (gram)" om het verschil te zien.',
                    points: 10,
                },
                {
                    id: 'q2-dagelijkse-impact',
                    question:
                        'Als een gemiddelde Nederlander elke dag 1,8 uur HD-video streamt, hoeveel gram CO2 is dat per week?',
                    type: 'number-input',
                    correctAnswer: 1222.2,
                    explanation:
                        '1 uur HD-streaming = 97 gram CO2. 1,8 uur = 1,8 × 97 = 174,6 gram per dag. Per week: 174,6 × 7 = 1.222,2 gram ≈ 1.222 gram (ook 1.223 is correct met afronding). Dat is ruim 1,2 kg CO2 per week alleen van streaming!',
                    points: 20,
                },
                {
                    id: 'q3-vergelijking-observatie',
                    question:
                        'De data zegt dat één uur HD-streamen gelijkstaat aan 13 km autorijden. Wat zegt dit over hoe we gewoonlijk digitale technologie beoordelen op milieu-impact?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'We zien digitale technologie als "schoon" — geen uitlaatgas, geen brandstof. Maar datacenters en netwerken gebruiken enorme hoeveelheden stroom, vaak nog deels opgewekt met fossiele brandstoffen. De impact is onzichtbaar, waardoor we die onderschatten. Dit heet het "dematerialisatieprobleem": digitale diensten lijken materiaalvrij maar zijn dat niet.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Cirkelgrafiek ─────────────────────────────────────────
        {
            id: 'energiebronnen-datacenters',
            title: 'Energiemix van datacenters in Europa (2024)',
            description:
                'Niet alle datacenters zijn even duurzaam. De energiemix bepaalt hoe "groen" jouw gebruik is. Bekijk de verdeling van energiebronnen.',
            type: 'pie-chart',
            chartData: [
                { label: 'Windenergie', value: 28, color: '#3B82F6' },
                { label: 'Zonne-energie', value: 18, color: '#F59E0B' },
                { label: 'Waterkracht', value: 15, color: '#10B981' },
                { label: 'Aardgas', value: 22, color: '#8B5CF6' },
                { label: 'Kolen/olie', value: 12, color: '#6B7280' },
                { label: 'Kernenergie', value: 5, color: '#EF4444' },
            ],
            questions: [
                {
                    id: 'q4-hernieuwbaar-pct',
                    question:
                        'Hoeveel procent van de energie van Europese datacenters komt uit hernieuwbare bronnen (wind + zon + waterkracht)?',
                    type: 'number-input',
                    correctAnswer: 61,
                    explanation:
                        'Wind: 28% + Zon: 18% + Water: 15% = 61% hernieuwbaar. Dit betekent dat 39% nog uit fossiele of nucleaire bronnen komt. Europa is op weg naar 100% hernieuwbaar, maar is er nog niet.',
                    points: 15,
                },
                {
                    id: 'q5-fossiel-andeel',
                    question:
                        'Welke energiebron heeft het grootste aandeel in de "niet-hernieuwbare" categorie (fossiel + kernenergie)?',
                    type: 'multiple-choice',
                    options: ['Kernenergie', 'Kolen/olie', 'Aardgas', 'Waterkracht'],
                    correctAnswer: 'Aardgas',
                    explanation:
                        'Aardgas heeft 22% — het grootste aandeel van de niet-hernieuwbare bronnen. Kolen/olie heeft 12% en kernenergie 5%. Aardgas is "minder vervuilend" dan kolen maar stoot nog steeds CO2 uit. Veel datacenters gebruiken gas als back-up bij piekvraag.',
                    points: 10,
                },
                {
                    id: 'q6-locatie-datacenter',
                    question:
                        'Waarom zetten techbedrijven zoals Google en Microsoft hun datacenters in IJsland of Noorwegen? Koppel dit aan de energiemix-data.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'IJsland en Noorwegen hebben bijna 100% hernieuwbare energie (water- en geothermische energie) en het is er koud — minder koeling nodig, wat ook energie bespaart. Datacenters zijn enorme warmteproducenten en hebben continu koeling nodig. Door te kiezen voor koude klimaten met groene stroom verlagen techbedrijven hun energiekosten én CO2-uitstoot tegelijk.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'duurzame-alternatieven',
            title: 'Vier manieren om je digitale voetafdruk te verkleinen',
            description:
                'Je hoeft niet te stoppen met internet gebruiken — maar slimme keuzes kunnen de impact aanzienlijk verkleinen. Bekijk de opties.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Optie 1: Stream in lagere kwaliteit',
                    icon: '📺',
                    content:
                        'HD-streaming gebruikt 97g CO2/uur, SD-streaming maar 36g — een besparing van 63%. De meeste content is prima zichtbaar op SD op een klein scherm (telefoon, laptop). Op een grote tv of voor gaming is HD relevanter. Eenvoudige instelling in Netflix, YouTube of Spotify. Besparing: tot 2/3 van je streaming-CO2.',
                },
                {
                    title: 'Optie 2: Gebruik minder e-mails met bijlagen',
                    icon: '📧',
                    content:
                        'Een e-mail met 1 MB bijlage stoot 19g CO2 uit — 63 keer meer dan een lege e-mail. Alternatief: gebruik een gedeelde link (Google Drive, WeTransfer) in plaats van een bijlage. De ontvanger downloadt het bestand alleen als ze het echt nodig hebben. Grote bedrijven besparen zo honderden kg CO2 per jaar.',
                },
                {
                    title: 'Optie 3: Kies een groene zoekmachine',
                    icon: '🌱',
                    content:
                        'Ecosia is een zoekmachine die zijn serverenergie voor 200% compenseert met windenergie en de winst gebruikt om bomen te planten. Elke zoekopdracht plant gemiddeld een deel van een boom. Per zoekopdracht is het CO2-verschil klein (0.2g), maar Google verwerkt 8,5 miljard zoekopdrachten per dag wereldwijd — op die schaal maakt het uit.',
                },
                {
                    title: 'Optie 4: Verleng de levensduur van je apparaat',
                    icon: '📱',
                    content:
                        'De productie van een nieuwe smartphone kost 70-80 kg CO2 — meer dan een jaar dagelijks gebruik. Door je telefoon 3 jaar te gebruiken in plaats van 2 jaar verlaag je de jaarlijkse productie-CO2 met 33%. Repareren in plaats van weggooien helpt ook. E-waste is een van de snelst groeiende milieuproblemen ter wereld.',
                },
            ],
            questions: [
                {
                    id: 'q7-meeste-impact',
                    question:
                        'Welke maatregel heeft waarschijnlijk de meeste CO2-besparing per jaar voor een gemiddeld persoon?',
                    type: 'multiple-choice',
                    options: [
                        'Stream in lagere kwaliteit',
                        'Gebruik minder e-mails met bijlagen',
                        'Kies een groene zoekmachine',
                        'Verleng de levensduur van je apparaat',
                    ],
                    correctAnswer: 'Verleng de levensduur van je apparaat',
                    explanation:
                        'Smartphone-productie kost 70-80 kg CO2 — dat is meer dan een heel jaar dagelijks streamen (365 × 1,8u × 0,097 kg ≈ 64 kg). Door één jaar langer een telefoon te gebruiken bespaar je meer dan alle andere opties bij elkaar. Dit heet "embodied carbon" — de verborgen CO2 in de productie van apparaten.',
                    points: 15,
                },
                {
                    id: 'q8-actieplan',
                    question:
                        'Noem twee concrete aanpassingen die jij persoonlijk kunt doen om je digitale voetafdruk te verkleinen. Schat ook hoeveel gram CO2 je daarmee per week bespaart.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Goede aanpassingen zijn: SD in plaats van HD (besparing: 60,4g CO2 per uur streaming). Bijlagen vervangen door links (besparing: 152g per 8 bijlagen per dag). Telefoon één jaar langer gebruiken (besparing: ≈25.000g CO2 gespreid over het extra jaar). De beste antwoorden koppelen een concrete gewoonte aan een berekening.',
                    points: 0,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🌱',
            title: 'Duurzaamheids Expert!',
            color: '#16A34A',
        },
        {
            minScore: 65,
            emoji: '♻️',
            title: 'Eco-Analyst',
            color: '#10B981',
        },
        {
            minScore: 40,
            emoji: '🔋',
            title: 'Voetafdruk Scanner',
            color: '#3B82F6',
        },
        {
            minScore: 0,
            emoji: '📚',
            title: 'Aan de slag!',
            color: '#6B6B66',
        },
    ],

    takeaways: [
        'HD-streaming stoot per uur 97 gram CO2 uit — gelijk aan 13 km autorijden',
        'Een Bitcoin-transactie stoot net zoveel CO2 uit als 700 km vliegen',
        '61% van de Europese datacenter-energie komt al uit hernieuwbare bronnen',
        'Smartphone-productie kost meer CO2 dan een jaar dagelijks gebruik — verleng de levensduur',
        'Digitale technologie lijkt "schoon" maar datacenters verbruiken enorme hoeveelheden energie',
    ],
};

export default sustainabilityScannerConfig;
