import type { DataViewerConfig } from '../DataViewer';

// ── Welzijnsonderzoeker ───────────────────────────────────────────────────────
// Missie: Welzijnsonderzoeker
// SLO: 23B (Digitaal welzijn), 21C (Data & Dataverwerking), 23C (Maatschappij)
// Bloom: Niveau 6 — Creëren (analyse + eigen conclusies + aanbevelingen)
// Leerjaar: 3 — Periode 3 (Impact & Innovatie)
//
// Dataset 1: Enquêtetabel van 15 fictieve leerlingen (leerjaar 3)
//   — schermtijd, platform, gevoel, slaap, limiet, tevredenheid
// Dataset 2: Staafgrafiek CBS/Trimbos-achtig — gemiddeld schermgebruik per categorie
// Dataset 3: Trendtabel jan–jun — schermtijd + welzijnsscore (inverse correlatie, niet perfect)
//
// Puntenopbouw (totaal 100):
//   Dataset 1: q1 (20) + q2 (20) + q3 (10) = 50
//   Dataset 2: q4 (15) + q5 (15) = 30
//   Dataset 3: q6 (10) + q7 (10) = 20
//
// Berekeningen Dataset 1:
//   Respondenten MET schermtijdlimiet: R04 (4.0), R08 (2.5), R09 (3.0), R12 (1.5), R14 (2.0)
//   Gemiddelde = (4.0 + 2.5 + 3.0 + 1.5 + 2.0) / 5 = 13.0 / 5 = 2.6 uur
//   Respondenten ZON limiet: R01 (6.5), R02 (5.0), R03 (4.5), R05 (3.5), R07 (3.0),
//                             R06 (4.0), R10 (2.0), R11 (5.5), R13 (3.0), R15 (2.5)
//   Gemiddelde zonder limiet = (6.5+5.0+4.5+3.5+3.0+4.0+2.0+5.5+3.0+2.5) / 10 = 39.5 / 10 = 3.95 uur

export const welzijnsonderzoekerConfig: DataViewerConfig = {
    missionId: 'welzijnsonderzoeker',
    title: 'Welzijnsonderzoeker',
    introEmoji: '🔬',
    introTitle: 'Word een welzijnsonderzoeker',
    introDescription:
        'Wat zegt data écht over digitaal welzijn? Jij analyseert enquêteresultaten van je leeftijdsgenoten, bekijkt nationale cijfers en onderzoekt trends over tijd. Geen meningen — alleen wat de data laat zien.',
    experienceDesign: {
        boringRisk: 'high',
        firstTenSeconds: 'Veilige signal scan: kies welk welzijnssignaal zorgvuldig onderzocht moet worden.',
        primaryInteraction: 'prioritize-case',
        feedbackMoment: 'Na de signaalkeuze benadrukt feedback nuance, correlatie versus oorzaak en niet-oordelend taalgebruik.',
        visualKit: 'data-room',
        evidenceMoment: 'De leerling gebruikt anonieme data om patronen voorzichtig te beschrijven zonder oordeel of label op leerlingen.',
        antiBoringRule: 'Welzijnsdata mag nooit moralistisch of competitief worden; de missie blijft kalm, veilig en helpend.',
        chromeAcceptance: 'Welzijnshook, tabellen en feedback blijven rustig, leesbaar en zonder druk/timer op alle viewports.',
    },
    introFeatures: [
        'Analyseer enquêtedata van 15 leerlingen uit leerjaar 3',
        'Vergelijk categorieën schermgebruik met nationale cijfers',
        'Onderzoek het verband tussen schermtijd en welzijn over 6 maanden',
    ],
    investigationHook: {
        title: 'Welk signaal verdient zorgvuldige aandacht?',
        role: 'Welzijnsonderzoeker',
        scenario:
            'Je onderzoekt anonieme klasdata over digitaal welzijn. Je doel is niet oordelen over schermtijd, maar zorgvuldig zoeken naar signalen die leerlingen kunnen helpen.',
        prompt: 'Welk signaal volg je eerst?',
        contextLabel: 'Welzijnssignaal',
        continueLabel: 'Onderzoek de anonieme data',
        options: [
            {
                id: 'slaap',
                label: 'Slaapkwaliteit naast schermtijd',
                description: 'Je kijkt of veel schermtijd samenvalt met slechter slapen, zonder meteen oorzaak te claimen.',
                feedback: 'Zorgvuldige keuze. Je zoekt een patroon, maar houdt ruimte voor nuance: correlatie is nog geen oorzaak.',
                evidenceChips: ['R01 6,5u slaap 2', 'R12 1,5u slaap 5', 'geen oorzaakclaim'],
                impactCue: 'Slaappatroon voorzichtig',
            },
            {
                id: 'gevoel',
                label: 'Gevoel na lang scrollen',
                description: 'Je let op woorden als onrustig, leeg of ontspannen en vergelijkt die met gedrag.',
                feedback: 'Goed welzijnsspoor. Cijfers krijgen pas betekenis als je ook kijkt naar hoe leerlingen zich erbij voelen.',
                evidenceChips: ['leeg/onrustig', 'actief vs passief', 'context telt'],
                impactCue: 'Niet-oordelend signaal',
            },
            {
                id: 'limiet',
                label: 'Schermtijdlimiet en tevreden balans',
                description: 'Je onderzoekt of een limiet samenhangt met tevredenheid, maar zonder simpele oplossing te forceren.',
                feedback: 'Mooi genuanceerd. Een limiet kan helpen, maar data kan ook laten zien dat context en gewoontes meespelen.',
                evidenceChips: ['limiet 2,6u', 'zonder limiet 3,95u', 'geen garantie'],
                impactCue: 'Balans met nuance',
            },
        ],
    },

    datasets: [
        // ── Dataset 1: Enquêtetabel ───────────────────────────────────────────
        {
            id: 'enquete-welzijn-lj3',
            title: 'Digitaal welzijn enquête — leerjaar 3',
            description:
                'In maart 2026 vulden 15 leerlingen van leerjaar 3 een anonieme enquête in over hun digitale gewoontes en welzijn. Bekijk de tabel en beantwoord de vragen. Tip: klik op een kolomkop om te sorteren.',
            type: 'table',
            columns: [
                { key: 'naam', label: 'Respondent', sortable: true },
                { key: 'schermtijd_uur', label: 'Schermtijd (uur/dag)', sortable: true },
                { key: 'platform', label: 'Meest gebruikt', sortable: true },
                { key: 'gevoel_na_scrollen', label: 'Gevoel na lang scrollen', sortable: true },
                { key: 'slaapkwaliteit', label: 'Slaapkwaliteit (1–5)', sortable: true },
                { key: 'heeft_limiet', label: 'Schermtijdlimiet?', sortable: true },
                { key: 'tevreden_balans', label: 'Tevreden met digitale balans?', sortable: true },
            ],
            rows: [
                { naam: 'R01', schermtijd_uur: 6.5, platform: 'TikTok',     gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R02', schermtijd_uur: 5.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R03', schermtijd_uur: 4.5, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R04', schermtijd_uur: 4.0, platform: 'TikTok',      gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 3, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { naam: 'R05', schermtijd_uur: 3.5, platform: 'Instagram',   gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R06', schermtijd_uur: 4.0, platform: 'Gaming',      gevoel_na_scrollen: 'Opgewonden',  slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { naam: 'R07', schermtijd_uur: 3.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onzeker',     slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R08', schermtijd_uur: 2.5, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { naam: 'R09', schermtijd_uur: 3.0, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { naam: 'R10', schermtijd_uur: 2.0, platform: 'Snapchat',    gevoel_na_scrollen: 'Blij',        slaapkwaliteit: 4, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { naam: 'R11', schermtijd_uur: 5.5, platform: 'TikTok',      gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { naam: 'R12', schermtijd_uur: 1.5, platform: 'Snapchat',    gevoel_na_scrollen: 'Blij',        slaapkwaliteit: 5, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { naam: 'R13', schermtijd_uur: 3.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onzeker',     slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { naam: 'R14', schermtijd_uur: 2.0, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { naam: 'R15', schermtijd_uur: 2.5, platform: 'TikTok',      gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
            ],
            questions: [
                {
                    id: 'woz-q1-slaap-scherm',
                    question:
                        'Sorteer op schermtijd en kijk naar slaapkwaliteit. Welk patroon zie je, en welke voorzichtige nuance hoort daarbij?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Als je op "Schermtijd (uur/dag)" sorteert (hoog naar laag), zie je dat respondenten met veel schermtijd, zoals R01, R02 en R11, lage slaapkwaliteit melden. Respondenten met minder schermtijd, zoals R12, R08 en R14, scoren juist hoger. Let op: dit is een correlatie uit één kleine enquête, geen bewijs van oorzaak en gevolg.',
                    points: 20,
                    minLength: 60,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'schermtijd', keywords: ['schermtijd', 'uur', 'hoog', 'laag'] },
                        { label: 'slaapkwaliteit', keywords: ['slaap', 'slaapkwaliteit', '2', '4', '5'] },
                        { label: 'voorzichtige nuance', keywords: ['correlatie', 'oorzaak', 'geen bewijs', 'kleine enquête', 'nuance'] },
                    ],
                },
                {
                    id: 'woz-q2-gemiddeld-limiet',
                    question:
                        'Wat is de gemiddelde schermtijd (in uur/dag) van leerlingen die WEL een schermtijdlimiet hebben? Rond af op 1 decimaal.',
                    type: 'number-input',
                    correctAnswer: 2.6,
                    explanation:
                        'Filter op "Schermtijdlimiet? = Ja": R04 (4.0), R08 (2.5), R09 (3.0), R12 (1.5), R14 (2.0). Som: 4.0 + 2.5 + 3.0 + 1.5 + 2.0 = 13.0 uur. Gedeeld door 5 respondenten = 2,6 uur. Ter vergelijking: respondenten zónder limiet zitten gemiddeld op 3,95 uur per dag.',
                    points: 20,
                },
                {
                    id: 'woz-q3-limiet-tevredenheid',
                    question:
                        'Beschrijf het verschil in tevredenheid met de digitale balans tussen leerlingen mét en zónder schermtijdlimiet. Wat valt je op?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Van de 5 respondenten MÉT limiet zijn er 4 tevreden ("Ja") en 0 ontevreden. Van de 10 respondenten ZÓNDER limiet zijn 6 respondenten ontevreden ("Nee"), 3 soms tevreden ("Soms") en 1 tevreden. Interessant detail: R04 heeft wél een limiet maar zit toch op 4.0 uur — een limiet alleen garandeert dus geen tevredenheid. Dit maakt de data genuanceerder dan een simpel "limiet = goed".',
                    points: 10,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'limietgroep', keywords: ['limiet', 'met limiet', 'zonder limiet'] },
                        { label: 'tevredenheid', keywords: ['tevreden', 'ontevreden', 'soms', 'ja', 'nee'] },
                        { label: 'datavergelijking', keywords: ['5', '10', '4', '6', 'verschil', 'groep'] },
                    ],
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek — schermgebruik per categorie ─────────────
        {
            id: 'schermgebruik-categorieen-nl',
            title: 'Digitaal schermgebruik Nederlandse jongeren (12–18 jaar)',
            description:
                'Gebaseerd op CBS-data en Trimbos-onderzoek (2025): gemiddeld aantal uren per dag dat Nederlandse jongeren van 12–18 jaar besteden aan verschillende schermactiviteiten. Let goed op de categorieën.',
            type: 'bar-chart',
            chartData: [
                { label: 'Social media',         value: 2.8, color: '#D97848' },
                { label: 'Gaming',               value: 1.9, color: '#0B453F' },
                { label: 'Streaming (video)',     value: 1.6, color: '#0B453F' },
                { label: 'School/huiswerk',       value: 1.2, color: '#5F947D' },
                { label: 'Communicatie (app)',    value: 0.9, color: '#D7C95F' },
                { label: 'Creatief (muziek/video)', value: 0.4, color: '#0B453F' },
            ],
            questions: [
                {
                    id: 'woz-q4-grootste-categorie',
                    question:
                        'Markeer de categorie die gemiddeld de meeste tijd inneemt. Noem de waarde, vergelijk die met minstens één andere categorie en formuleer dit zonder oordeel over jongeren.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Social media staat met 2,8 uur per dag op de eerste plek. Dat is meer dan gaming (1,9 uur), streaming (1,6 uur) en school/huiswerk (1,2 uur). Een zorgvuldige conclusie beschrijft dit als een patroon in de data, niet als label op leerlingen.',
                    points: 15,
                    minLength: 70,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'Social media genoemd', keywords: ['social media'] },
                        { label: 'waarde 2,8 uur gebruikt', keywords: ['2,8', '2.8'] },
                        { label: 'vergelijking met andere categorie', keywords: ['gaming', '1,9', '1.9', 'streaming', '1,6', '1.6', 'school', '1,2', '1.2'] },
                        { label: 'niet-oordelende taal', keywords: ['zonder oordeel', 'niet oordelen', 'patroon', 'data', 'zorgvuldig', 'geen schuld'] },
                    ],
                },
                {
                    id: 'woz-q5-creatief-welzijn',
                    question:
                        'Welke categorie wordt het minst erkend als "schermtijd" in het dagelijks gesprek, maar kan wél een andere impact op welzijn hebben dan passief scrollen? Leg uit waarom.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Creatief gebruik (muziek maken, video\'s produceren) staat onderaan met slechts 0,4 uur, maar onderzoek van Harvard Digital Agency laat zien dat actief creëren een fundamenteel ander effect heeft op welzijn dan passief scrollen. Mensen die iets maken, rapporteren meer controle en voldoening — precies wat bij social media-gebruik vaak ontbreekt. Communicatie via apps (0,9 uur) is ook interessant: dit kan zowel sociaal verbindend als stressverhogend zijn, afhankelijk van de context.',
                    points: 15,
                    minLength: 50,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'creatief of actief gebruik', keywords: ['creatief', 'actief', 'maken', 'produceren', 'muziek', 'video'] },
                        { label: 'verschil met passief scrollen', keywords: ['passief', 'scrollen', 'social media', 'controle', 'voldoening'] },
                        { label: 'welzijnseffect', keywords: ['welzijn', 'impact', 'gevoel', 'context', 'stress'] },
                    ],
                },
            ],
        },

        // ── Dataset 3: Trendtabel jan–jun ─────────────────────────────────────
        {
            id: 'welzijnstrend-halfjaar',
            title: 'Schermtijd en welzijn over 6 maanden',
            description:
                'Een panel van 120 leerlingen (leerjaar 2–4) hield gedurende 6 maanden bij hoeveel ze per dag op een scherm keken en hoe ze zich voelden. De welzijnsscore loopt van 1 (zeer slecht) tot 10 (uitstekend). Let goed op het patroon — maar ook op de uitzonderingen.',
            type: 'table',
            columns: [
                { key: 'maand',          label: 'Maand',                    sortable: false },
                { key: 'schermtijd_uur', label: 'Gem. schermtijd (uur/dag)', sortable: true  },
                { key: 'welzijnsscore',  label: 'Gem. welzijnsscore (1–10)', sortable: true  },
                { key: 'bijzonderheid',  label: 'Context',                  sortable: false },
            ],
            rows: [
                { maand: 'Januari', schermtijd_uur: 4.2, welzijnsscore: 6.8, bijzonderheid: 'Start nieuw jaar, goede voornemens' },
                { maand: 'Februari', schermtijd_uur: 4.6, welzijnsscore: 6.3, bijzonderheid: 'Donkere maand, meer binnenblijven' },
                { maand: 'Maart',   schermtijd_uur: 5.1, welzijnsscore: 6.1, bijzonderheid: 'Toetsperiode + meer scrollen' },
                { maand: 'April',   schermtijd_uur: 4.4, welzijnsscore: 6.5, bijzonderheid: 'Voorjaarsvakantie, meer buitenactiviteiten' },
                { maand: 'Mei',     schermtijd_uur: 5.3, welzijnsscore: 5.9, bijzonderheid: 'Eindtoetsen, stress, meer schermtijd' },
                { maand: 'Juni',    schermtijd_uur: 5.8, welzijnsscore: 5.5, bijzonderheid: 'Zomervakantie nadert, minder structuur' },
            ],
            questions: [
                {
                    id: 'woz-q6-niet-concluderen',
                    question:
                        'Schrijf de conclusie die je juist NIET mag trekken uit deze trendtabel. Leg daarna uit waarom die claim te stellig is en gebruik minimaal één contextkaart als bewijs.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Je mag niet concluderen dat meer schermtijd een lagere welzijnsscore veroorzaakt. De tabel laat een verband zien, maar geen bewijs van oorzaak. De contextkolom laat andere verklaringen zien, zoals toetsperiode, voorjaarsvakantie, eindtoetsen, stress of minder structuur. Je hebt meer onderzoek nodig om causaliteit te bewijzen.',
                    points: 10,
                    minLength: 80,
                    minEvidenceCriteria: 3,
                    textEvidenceCriteria: [
                        { label: 'te stellige oorzaakclaim genoemd', keywords: ['veroorzaakt', 'oorzaak', 'meer schermtijd', 'lagere welzijnsscore', 'slechter welzijn'] },
                        { label: 'correlatie/verband onderscheiden', keywords: ['correlatie', 'verband', 'geen bewijs', 'niet bewijzen', 'causaliteit'] },
                        { label: 'contextkaart gebruikt', keywords: ['toetsperiode', 'voorjaarsvakantie', 'eindtoetsen', 'stress', 'minder structuur', 'context'] },
                        { label: 'voorzichtig onderzoekstaal gebruikt', keywords: ['te stellig', 'voorzichtig', 'meer onderzoek', 'mogelijk', 'kan samenhangen'] },
                    ],
                },
                {
                    id: 'woz-q7-correlatie-causaliteit',
                    question:
                        'Leg in eigen woorden uit waarom het gevaarlijk is om te zeggen: "meer schermtijd = slechter welzijn." Gebruik de contextkolom in je uitleg.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'De contextkolom laat zien dat er steeds andere factoren meespelen: toetsdruk in maart, vakantierust in april, eindexamenstress in mei. Het is gevaarlijk omdat je een simpele oorzaak-gevolgrelatie suggereert terwijl er veel andere verklaringen zijn (confounders). Trimbos en Harvard Digital Agency benadrukken dat het HOE (passief scrollen vs. actief gebruik) en de context belangrijker zijn dan de hoeveelheid uren alleen.',
                    points: 10,
                    minLength: 60,
                    minEvidenceCriteria: 2,
                    textEvidenceCriteria: [
                        { label: 'correlatie is geen oorzaak', keywords: ['correlatie', 'causaliteit', 'oorzaak', 'veroorzaakt', 'verband'] },
                        { label: 'contextfactor', keywords: ['toets', 'vakantie', 'stress', 'context', 'april', 'mei'] },
                        { label: 'nuance in schermgebruik', keywords: ['passief', 'actief', 'hoe', 'uren', 'factoren'] },
                    ],
                },
            ],
        },
    ],

    maxScore: 100,

    badges: [
        {
            minScore: 85,
            emoji: '🔬',
            title: 'Welzijnsexpert!',
            color: '#5F947D',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Data-detective',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Op onderzoek uit',
            color: '#D7C95F',
        },
        {
            minScore: 0,
            emoji: '📋',
            title: 'Onderzoeker in opleiding',
            color: '#445865',
        },
    ],

    takeaways: [
        'Correlatie betekent niet hetzelfde als causaliteit — altijd context meenemen',
        'HOE je een scherm gebruikt (actief vs. passief) telt meer dan hoe lang',
        'Data uit een kleine enquête mag je niet zomaar generaliseren naar alle jongeren',
        'Schermtijdlimieten hangen samen met hogere tevredenheid, maar zijn geen garantie',
        'Als onderzoeker vraag je altijd: welke andere factoren spelen hier een rol?',
    ],
};
