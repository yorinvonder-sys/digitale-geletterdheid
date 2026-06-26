import type { DataViewerConfig } from '../DataViewer';

export const sustainabilityScannerConfig: DataViewerConfig = {
    missionId: 'sustainability-scanner',
    title: 'Trend Scanner',
    introEmoji: '📊',
    introTitle: 'Scan digitale gebruikstrends',
    introDescription:
        'Hoe besteden jongeren hun online tijd? Van gaming en video-streaming tot muziek en berichten sturen — de cijfers vertellen een opvallend verhaal. Jij gaat trenddata lezen, berekeningen maken en jouw eigen observaties formuleren.',
    introFeatures: [
        'Analyseer een tabel met gemiddeld dagelijks gebruik per activiteit',
        'Bekijk het marktaandeel van apparaten voor mediaconsumptie',
        'Lees informatiekaarten over streaming, leeftijdsclassificaties en schermtijd',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'digitale-activiteiten-gebruik',
            title: 'Gemiddeld dagelijks gebruik per online activiteit (wereldwijd, 2024)',
            description:
                'Onderzoekers van DataReportal (2024) analyseerden hoeveel minuten jongeren van 13-24 jaar gemiddeld per dag besteden aan verschillende online activiteiten. Bekijk de tabel en reken de wekelijkse totalen uit.',
            type: 'table',
            columns: [
                { key: 'activiteit', label: 'Activiteit', sortable: true },
                { key: 'minuten_per_dag', label: 'Min. per dag', sortable: true },
                { key: 'gebruikers_wereld_mln', label: 'Gebruikers wereldwijd (mln)', sortable: true },
                { key: 'categorie', label: 'Categorie', sortable: true },
            ],
            rows: [
                { activiteit: 'Online gamen', minuten_per_dag: 85, gebruikers_wereld_mln: 500, categorie: 'Gaming' },
                { activiteit: 'Video streamen', minuten_per_dag: 95, gebruikers_wereld_mln: 900, categorie: 'Streaming' },
                { activiteit: 'Muziek streamen', minuten_per_dag: 40, gebruikers_wereld_mln: 650, categorie: 'Streaming' },
                { activiteit: 'Sociale media', minuten_per_dag: 75, gebruikers_wereld_mln: 1200, categorie: 'Social' },
                { activiteit: 'Berichten sturen', minuten_per_dag: 55, gebruikers_wereld_mln: 2100, categorie: 'Communicatie' },
            ],
            questions: [
                {
                    id: 'q1-meeste-gebruikers',
                    question:
                        'Welke activiteit heeft het grootste aantal gebruikers wereldwijd?',
                    type: 'multiple-choice',
                    options: ['Online gamen', 'Video streamen', 'Sociale media', 'Berichten sturen'],
                    correctAnswer: 'Berichten sturen',
                    explanation:
                        'Berichten sturen heeft 2.100 miljoen gebruikers wereldwijd — meer dan enige andere activiteit in de tabel. Dat zijn meer dan 2 miljard mensen. Apps zoals WhatsApp, iMessage en WeChat zijn daardoor de meest gebruikte digitale diensten ter wereld. Sorteer op "Gebruikers wereldwijd" om het overzicht te zien.',
                    points: 10,
                },
                {
                    id: 'q2-wekelijks-gamen',
                    question:
                        'Als een gemiddelde gamer elke dag 85 minuten online gamet, hoeveel minuten is dat per week?',
                    type: 'number-input',
                    correctAnswer: 595,
                    explanation:
                        '85 minuten per dag × 7 dagen = 595 minuten per week. Dat is bijna 10 uur gamen per week. Ter vergelijking: een schoolweek heeft ongeveer 30 lesuren — gaming neemt dus al snel een flink deel van de vrije tijd in.',
                    points: 20,
                },
                {
                    id: 'q3-vergelijking-observatie',
                    question:
                        'Berichten sturen heeft 2.100 miljoen gebruikers wereldwijd, terwijl video streamen er 900 miljoen heeft — meer dan twee keer zoveel. Wat zegt dit verschil volgens jou over hoe mensen digitale technologie het meest gebruiken?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Communicatie (berichten sturen) is de meest universele digitale activiteit — meer mensen sturen berichten dan dat ze video kijken of sociale media gebruiken. Dit laat zien dat de basis van digitale technologie voor veel mensen niet entertainment is, maar verbinding met anderen. Streamen en gaming zijn populair, maar directe communicatie is nog dominanter.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Cirkelgrafiek ─────────────────────────────────────────
        {
            id: 'apparaat-aandeel-media',
            title: 'Apparaataandeel bij mediaconsumptie (2024)',
            description:
                'Op welk apparaat kijken, luisteren en gamen mensen het meest? Onderzoeksbureau Statista bracht in 2024 het marktaandeel van verschillende apparaten in kaart voor mediaconsumptie (video, muziek, gaming, sociale media).',
            type: 'pie-chart',
            chartData: [
                { label: 'Smartphone', value: 54, color: '#202023' },
                { label: 'Laptop', value: 22, color: '#e1ff01' },
                { label: 'Smart-tv', value: 13, color: '#202023' },
                { label: 'Tablet', value: 7, color: '#202023' },
                { label: 'Console', value: 4, color: '#ff3c21' },
            ],
            questions: [
                {
                    id: 'q4-draagbaar-pct',
                    question:
                        'Hoeveel procent van de mediaconsumptie vindt plaats op draagbare apparaten (smartphone + laptop + tablet)?',
                    type: 'number-input',
                    correctAnswer: 83,
                    explanation:
                        'Smartphone: 54% + Laptop: 22% + Tablet: 7% = 83% draagbaar. Dat betekent dat slechts 17% van de media op een vast apparaat (smart-tv of console) wordt geconsumeerd. Dit verklaart waarom streamingdiensten hun apps primair voor smartphones ontwerpen.',
                    points: 15,
                },
                {
                    id: 'q5-grootste-niet-draagbaar',
                    question:
                        'Welk vast apparaat (niet draagbaar) heeft het grootste aandeel in mediaconsumptie?',
                    type: 'multiple-choice',
                    options: ['Console', 'Smart-tv', 'Laptop', 'Tablet'],
                    correctAnswer: 'Smart-tv',
                    explanation:
                        'Smart-tv heeft 13% — het grootste aandeel van de vaste apparaten. Console volgt met 4%. Dit laat zien dat de televisie, nu als "slim" apparaat, nog steeds een belangrijke rol speelt bij het kijken naar series en films — ook al is de smartphone duidelijk de winnaar overall.',
                    points: 10,
                },
                {
                    id: 'q6-smartphone-dominantie',
                    question:
                        'De smartphone heeft ruim de helft van het marktaandeel. Waarom denk jij dat de smartphone zo dominant is voor mediaconsumptie vergeleken met andere apparaten?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De smartphone is vrijwel altijd beschikbaar (mee onderweg, op bed, in de pauze), heeft een persoonlijk scherm, combineert alle functies in één apparaat en is eenvoudig te bedienen. Andere apparaten hebben één of meer van deze voordelen niet: een smart-tv staat vast, een laptop is groter en minder snel in de hand, een console is voor gaming-specifiek gebruik.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'media-informatie-kaarten',
            title: 'Vier dingen die handig zijn om te weten over digitale media',
            description:
                'Achter de apps en platforms die je dagelijks gebruikt, zit veel meer dan je misschien denkt. Bekijk deze informatiekaarten om meer te begrijpen van hoe digitale media werkt.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Kaart 1: Hoe videokwaliteit de databehoefte beïnvloedt',
                    icon: '📺',
                    content:
                        'Een video in SD-kwaliteit (standaard) gebruikt ongeveer 700 MB data per uur. In HD (1080p) is dat al 3 GB per uur, en in 4K loopt dat op tot 15-20 GB per uur. Streamingdiensten zoals Netflix en YouTube laten je zelf de kwaliteit kiezen. Op een klein smartphonescherm is het verschil tussen SD en HD nauwelijks zichtbaar — op een grote smart-tv wel.',
                },
                {
                    title: 'Kaart 2: Hoe PEGI-leeftijdsclassificaties werken',
                    icon: '🎮',
                    content:
                        'PEGI staat voor Pan European Game Information. Het systeem geeft games een aanbevolen minimumleeftijd: PEGI 3, 7, 12, 16 of 18. Naast de leeftijdsindicator zijn er ook inhoudslabels voor geweld, grof taalgebruik, angstaanjagend content en online-interactie. PEGI is een advies, geen wettelijk verbod in Nederland — maar detailhandelaren mogen games met PEGI 16 of 18 niet verkopen aan jongere kopers.',
                },
                {
                    title: 'Kaart 3: Hoe schermtijdtools werken',
                    icon: '📱',
                    content:
                        'Zowel Android (Digitaal Welzijn) als iOS (Schermtijd) bieden ingebouwde overzichten van je appgebruik per dag en week. Je kunt limieten instellen per app-categorie of per specifieke app. Onderzoek laat zien dat mensen hun eigen schermtijd gemiddeld 20-40% onderschatten. Het bijhouden van je gebruik is een eerste stap om bewuster te kiezen wanneer je je telefoon pakt.',
                },
                {
                    title: 'Kaart 4: Hoe aanbevelingsalgoritmen werken',
                    icon: '🔁',
                    content:
                        'Platforms zoals YouTube, TikTok en Spotify gebruiken algoritmen om content aan te bevelen. Ze kijken naar wat je bekijkt, hoe lang je kijkt, wat je oversloeg en wat anderen met vergelijkbare interesses leuk vonden. Dit systeem heet collaborative filtering. Het doel is dat je langer op het platform blijft. Je kunt het beïnvloeden door actief aan te geven wat je niet meer wil zien of door je zoekgeschiedenis te wissen.',
                },
            ],
            questions: [
                {
                    id: 'q7-databehoefte',
                    question:
                        'Stel je streamt 2 uur video per dag in HD (3 GB/uur). Welke bewering klopt dan het best?',
                    type: 'multiple-choice',
                    options: [
                        'Je gebruikt 3 GB data per dag',
                        'Je gebruikt 6 GB data per dag',
                        'Je gebruikt 1,5 GB data per dag',
                        'Je gebruikt 15 GB data per dag',
                    ],
                    correctAnswer: 'Je gebruikt 6 GB data per dag',
                    explanation:
                        '2 uur × 3 GB/uur = 6 GB data per dag. In een maand (30 dagen) zou dat 180 GB zijn — een groot mobiel dataabonnement is in Nederland typisch 10-50 GB. Streamen in HD op een mobiel netwerk is dus snel duurder of trager dan verwacht.',
                    points: 15,
                },
                {
                    id: 'q8-media-reflectie',
                    question:
                        'Kies één van de vier informatiekaarten en leg uit wat jij er nieuw van leerde of wat jou het meest verraste. Geef ook een concreet voorbeeld uit je eigen mediagebruik.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Goede antwoorden benoemen een specifiek feit uit de kaart (bijv. het datagebruik bij 4K, de werking van PEGI-labels, de 20-40% onderschatting van schermtijd, of de rol van collaborative filtering) en koppelen dat aan een eigen ervaring. Het gaat om het verbinden van informatie aan de eigen leefwereld.',
                    points: 0,
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '📊',
            title: 'Trend Expert',
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '🔍',
            title: 'Data Analist',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '📡',
            title: 'Trend Scanner',
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
        'Berichten sturen is de meest gebruikte digitale activiteit wereldwijd — meer dan video streamen of gamen',
        '83% van mediaconsumptie vindt plaats op draagbare apparaten (smartphone, laptop, tablet)',
        'HD-streaming gebruikt ruim 4× meer data dan SD — een groot verschil op mobiele data',
        'Mensen onderschatten hun eigen schermtijd gemiddeld met 20-40%',
        'Aanbevelingsalgoritmen leren van je gedrag en zijn te beïnvloeden door actief keuzes te maken',
    ],
};

export default sustainabilityScannerConfig;
