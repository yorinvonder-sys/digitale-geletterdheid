import type { DataViewerConfig } from '../DataViewer';

// ── Welzijnsonderzoeker ───────────────────────────────────────────────────────
// Missie: Welzijnsonderzoeker
// SLO: 23B (Digitaal welzijn), 21C (Data & Dataverwerking), 23C (Maatschappij)
// Bloom: Niveau 6 — Creëren (analyse + eigen conclusies + aanbevelingen)
// Leerjaar: 3 — Periode 3 (Impact & Innovatie)
//
// Dataset 1: Synthetische oefentabel van 15 anonieme deelnemers (leerjaar 3)
//   — schermtijd, platform, gevoel, slaap, limiet, tevredenheid
// Dataset 2: Synthetische staafgrafiek — gemiddeld schermgebruik per categorie
// Dataset 3: Trendtabel jan–jun — schermtijd + welzijnsscore (inverse correlatie, niet perfect)
//
// Puntenopbouw (totaal 100):
//   Dataset 1: q1 (20) + q2 (20) + q3 (10) = 50
//   Dataset 2: q4 (15) + q5 (15) = 30
//   Dataset 3: q6 (10) + q7 (10) = 20
//
// Berekeningen Dataset 1:
//   Deelnemers MET schermtijdlimiet: P04 (4.0), P08 (2.5), P09 (3.0), P12 (1.5), P14 (2.0)
//   Gemiddelde = (4.0 + 2.5 + 3.0 + 1.5 + 2.0) / 5 = 13.0 / 5 = 2.6 uur
//   Deelnemers ZONDER limiet: P01 (6.5), P02 (5.0), P03 (4.5), P05 (3.5), P07 (3.0),
//                             P06 (4.0), P10 (2.0), P11 (5.5), P13 (3.0), P15 (2.5)
//   Gemiddelde zonder limiet = (6.5+5.0+4.5+3.5+3.0+4.0+2.0+5.5+3.0+2.5) / 10 = 39.5 / 10 = 3.95 uur

export const welzijnsonderzoekerConfig: DataViewerConfig = {
    missionId: 'welzijnsonderzoeker',
    title: 'Welzijnsonderzoeker',
    introEmoji: '🔬',
    introTitle: 'Word een welzijnsonderzoeker',
    introDescription:
        'Wat zegt data écht over digitaal welzijn? Jij analyseert synthetische oefendatasets, vergelijkt fictieve categorieën en onderzoekt een gesimuleerde trend over tijd. Geen meningen — alleen wat de oefendata laat zien. Gebruik uitsluitend de gegevens in deze oefening en deel geen eigen welzijns-, naam-, contact-, gezondheids- of slaapgegevens.',
    introFeatures: [
        'Analyseer een fictieve enquête met 15 anonieme deelnemers',
        'Vergelijk categorieën schermgebruik in een oefengrafiek',
        'Onderzoek een gesimuleerd verband tussen schermtijd en welzijn',
    ],

    datasets: [
        // ── Dataset 1: Enquêtetabel ───────────────────────────────────────────
        {
            id: 'enquete-welzijn-lj3',
            title: 'Digitaal welzijn enquête — leerjaar 3',
            description:
                'Dit is een synthetische, uitsluitend voor oefening gemaakte dataset van 15 anonieme deelnemers uit leerjaar 3 — geen echte leerlingen en geen echte welzijns- of slaapgegevens. Bekijk de tabel en beantwoord de vragen. Tip: klik op een kolomkop om te sorteren; deel geen eigen gegevens.',
            type: 'table',
            source: {
                kind: 'synthetic',
                label: 'Fictieve, anonieme oefenenquête',
                methodNote: 'Handmatig samengestelde voorbeeldrijen voor reken- en correlatie-oefeningen; geen echte deelnemers of onderzoeksresultaten.',
            },
            columns: [
                { key: 'participant_id', label: 'Deelnemer-ID', sortable: true },
                { key: 'schermtijd_uur', label: 'Schermtijd (uur/dag)', sortable: true },
                { key: 'platform', label: 'Meest gebruikt', sortable: true },
                { key: 'gevoel_na_scrollen', label: 'Gevoel na lang scrollen', sortable: true },
                { key: 'slaapkwaliteit', label: 'Slaapkwaliteit (1–5)', sortable: true },
                { key: 'heeft_limiet', label: 'Schermtijdlimiet?', sortable: true },
                { key: 'tevreden_balans', label: 'Tevreden met digitale balans?', sortable: true },
            ],
            rows: [
                { participant_id: 'P01', schermtijd_uur: 6.5, platform: 'TikTok',     gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P02', schermtijd_uur: 5.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P03', schermtijd_uur: 4.5, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P04', schermtijd_uur: 4.0, platform: 'TikTok',      gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 3, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { participant_id: 'P05', schermtijd_uur: 3.5, platform: 'Instagram',   gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P06', schermtijd_uur: 4.0, platform: 'Gaming',      gevoel_na_scrollen: 'Opgewonden',  slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { participant_id: 'P07', schermtijd_uur: 3.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onzeker',     slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P08', schermtijd_uur: 2.5, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { participant_id: 'P09', schermtijd_uur: 3.0, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { participant_id: 'P10', schermtijd_uur: 2.0, platform: 'Snapchat',    gevoel_na_scrollen: 'Blij',        slaapkwaliteit: 4, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { participant_id: 'P11', schermtijd_uur: 5.5, platform: 'TikTok',      gevoel_na_scrollen: 'Leeg',        slaapkwaliteit: 2, heeft_limiet: 'Nee', tevreden_balans: 'Nee'   },
                { participant_id: 'P12', schermtijd_uur: 1.5, platform: 'Snapchat',    gevoel_na_scrollen: 'Blij',        slaapkwaliteit: 5, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { participant_id: 'P13', schermtijd_uur: 3.0, platform: 'Instagram',   gevoel_na_scrollen: 'Onzeker',     slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
                { participant_id: 'P14', schermtijd_uur: 2.0, platform: 'YouTube',     gevoel_na_scrollen: 'Ontspannen',  slaapkwaliteit: 4, heeft_limiet: 'Ja',  tevreden_balans: 'Ja'    },
                { participant_id: 'P15', schermtijd_uur: 2.5, platform: 'TikTok',      gevoel_na_scrollen: 'Onrustig',    slaapkwaliteit: 3, heeft_limiet: 'Nee', tevreden_balans: 'Soms'  },
            ],
            questions: [
                {
                    id: 'woz-q1-slaap-scherm',
                    question:
                        'Welk verband zie je als je sorteert op schermtijd en kijkt naar de slaapkwaliteit?',
                    type: 'multiple-choice',
                    options: [
                        'Meer schermtijd hangt samen met hogere slaapkwaliteit',
                        'Meer schermtijd hangt samen met lagere slaapkwaliteit',
                        'Er is geen enkel verband zichtbaar tussen schermtijd en slaap',
                        'Leerlingen met minder schermtijd slapen slechter',
                    ],
                    correctAnswer: 'Meer schermtijd hangt samen met lagere slaapkwaliteit',
                    explanation:
                        'Als je op "Schermtijd (uur/dag)" sorteert (hoog → laag), zie je dat de bovenste rijen (P01 6.5u, P11 5.5u, P02 5.0u) allemaal slaapkwaliteit 2 hebben, terwijl deelnemers met minder schermtijd (P12 1.5u, P10 2.0u) een slaapkwaliteit van 4–5 scoren. Let op: dit is een correlatie uit één kleine oefendataset — geen bewijs van oorzaak en gevolg.',
                    points: 20,
                },
                {
                    id: 'woz-q2-gemiddeld-limiet',
                    question:
                        'Wat is de gemiddelde schermtijd (in uur/dag) van leerlingen die WEL een schermtijdlimiet hebben? Rond af op 1 decimaal.',
                    type: 'number-input',
                    correctAnswer: 2.6,
                    explanation:
                        'Filter op "Schermtijdlimiet? = Ja": P04 (4.0), P08 (2.5), P09 (3.0), P12 (1.5), P14 (2.0). Som: 4.0 + 2.5 + 3.0 + 1.5 + 2.0 = 13.0 uur. Gedeeld door 5 deelnemers = 2,6 uur. Ter vergelijking: deelnemers zónder limiet zitten gemiddeld op 3,95 uur per dag.',
                    points: 20,
                },
                {
                    id: 'woz-q3-limiet-tevredenheid',
                    question:
                        'Beschrijf het verschil in tevredenheid met de digitale balans tussen leerlingen mét en zónder schermtijdlimiet. Wat valt je op?',
                    type: 'text-observation',
                    keywords: ['p04', 'garandeert', 'uitzondering'],
                    minKeywords: 1,
                    correctAnswer: '',
                    explanation:
                        'Van de 5 deelnemers MÉT limiet zijn alle 5 tevreden ("Ja") en 0 ontevreden. Van de 10 deelnemers ZÓNDER limiet zijn 6 deelnemers ontevreden ("Nee"), 4 soms tevreden ("Soms") en 0 tevreden. Interessant detail: P04 heeft wél een limiet maar zit toch op 4.0 uur — een limiet garandeert dus niet automatisch weinig schermtijd. Dit maakt de data genuanceerder dan een simpel "limiet = goed".',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek — schermgebruik per categorie ─────────────
        {
            id: 'schermgebruik-categorieen-nl',
            title: 'Gesimuleerd schermgebruik per activiteit (12–18 jaar)',
            description:
                'Deze oefengrafiek gebruikt verzonnen voorbeelduren om verschillende soorten schermgebruik te vergelijken. De waarden zijn geen actuele CBS- of Trimbos-cijfers en mogen niet als echte landelijke gemiddelden worden gebruikt.',
            type: 'bar-chart',
            source: {
                kind: 'synthetic',
                label: 'Gesimuleerde categorieën voor schermgebruik',
                methodNote: 'Didactische voorbeeldwaarden zonder echte steekproef; alleen bedoeld om categorieën te vergelijken en conclusies te begrenzen.',
            },
            chartData: [
                { label: 'Social media',         value: 2.8, color: '#ff3c21' },
                { label: 'Gaming',               value: 1.9, color: '#202023' },
                { label: 'Streaming (video)',     value: 1.6, color: '#202023' },
                { label: 'School/huiswerk',       value: 1.2, color: '#202023' },
                { label: 'Communicatie (app)',    value: 0.9, color: '#e1ff01' },
                { label: 'Creatief (muziek/video)', value: 0.4, color: '#202023' },
            ],
            questions: [
                {
                    id: 'woz-q4-grootste-categorie',
                    question:
                        'Welke categorie neemt in deze oefengrafiek gemiddeld de meeste tijd in beslag?',
                    type: 'multiple-choice',
                    options: [
                        'Gaming',
                        'Social media',
                        'Streaming (video)',
                        'School/huiswerk',
                    ],
                    correctAnswer: 'Social media',
                    explanation:
                        'In deze oefengrafiek staat social media met 2,8 uur per dag op de eerste plek — bijna anderhalf keer zo veel als gaming (1,9 uur). Binnen dit verzonnen rekenvoorbeeld is 2,8 × 7 ongeveer 20 uur per week. Dit is geen uitspraak over het werkelijke schermgebruik van jongeren.',
                    points: 15,
                },
                {
                    id: 'woz-q5-creatief-welzijn',
                    question:
                        'Welke categorie wordt het minst erkend als "schermtijd" in het dagelijks gesprek, maar kan wél een andere impact op welzijn hebben dan passief scrollen? Leg uit waarom.',
                    type: 'text-observation',
                    keywords: ['creatief', 'actief', 'controle'],
                    minKeywords: 1,
                    correctAnswer: '',
                    explanation:
                        'Creatief gebruik (muziek maken, video\'s produceren) staat in deze oefengrafiek onderaan met 0,4 uur. Actief iets maken vraagt meestal andere handelingen dan passief scrollen, waardoor alleen het aantal uren onvoldoende zegt over welzijn. Communicatie via apps (0,9 uur) kan bijvoorbeeld zowel sociaal verbindend als stressverhogend zijn, afhankelijk van de context. Voor uitspraken over echte effecten heb je controleerbaar onderzoek nodig.',
                    points: 15,
                },
            ],
        },

        // ── Dataset 3: Trendtabel jan–jun ─────────────────────────────────────
        {
            id: 'welzijnstrend-halfjaar',
            title: 'Schermtijd en welzijn over 6 maanden',
            description:
                'Deze synthetische oefentabel doet alsof een panel van 120 leerlingen (leerjaar 2–4) gedurende 6 maanden schermtijd en welzijn bijhield. Er zijn geen echte leerlingen gevolgd. De welzijnsscore loopt van 1 (zeer slecht) tot 10 (uitstekend). Let op het patroon én de uitzonderingen.',
            type: 'table',
            source: {
                kind: 'synthetic',
                label: 'Fictieve trendtabel schermtijd en welzijn',
                methodNote: 'Verzonnen maandgemiddelden en contextlabels om correlatie, causaliteit en verstorende factoren te oefenen; geen longitudinaal onderzoek.',
            },
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
                        'Wat kun je NIET concluderen op basis van deze trendtabel, ook al lijkt het patroon duidelijk?',
                    type: 'multiple-choice',
                    options: [
                        'De gemiddelde schermtijd steeg van januari tot juni',
                        'De gemiddelde welzijnsscore daalde van januari tot juni',
                        'Meer schermtijd VEROORZAAKT een lagere welzijnsscore',
                        'In april was de welzijnsscore hoger dan in maart',
                    ],
                    correctAnswer: 'Meer schermtijd VEROORZAAKT een lagere welzijnsscore',
                    explanation:
                        'De eerste twee opties zijn gewoon aflezen uit de data (dat mag). Maar "veroorzaken" is een claim die je nooit uit een correlatie kunt trekken. Kijk naar april: schermtijd daalde én welzijn steeg — maar tegelijk was er een vakantie met meer buitenactiviteiten. Misschien verbeterde het welzijn dáardoor, en nam het scrollen af als bijeffect. Je hebt een experiment nodig om causaliteit te bewijzen.',
                    points: 10,
                },
                {
                    id: 'woz-q7-correlatie-causaliteit',
                    question:
                        'Leg in eigen woorden uit waarom het gevaarlijk is om te zeggen: "meer schermtijd = slechter welzijn." Gebruik de contextkolom in je uitleg.',
                    type: 'text-observation',
                    keywords: ['toetsdruk', 'toetsen', 'vakantie', 'andere factoren'],
                    minKeywords: 1,
                    correctAnswer: '',
                    explanation:
                        'De contextkolom laat zien dat er steeds andere factoren meespelen: toetsdruk in maart, vakantierust in april en toetsstress in mei. Het is gevaarlijk om een simpele oorzaak-gevolgrelatie te suggereren terwijl er veel andere verklaringen zijn (verstorende factoren). Deze oefendata kan alleen laten zien hoe je zulke alternatieve verklaringen onderzoekt; voor echte uitspraken is controleerbaar onderzoek nodig.',
                    points: 10,
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
            color: '#202023',
        },
        {
            minScore: 65,
            emoji: '📊',
            title: 'Data-detective',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔍',
            title: 'Op onderzoek uit',
            color: '#e1ff01',
        },
        {
            minScore: 0,
            emoji: '📋',
            title: 'Onderzoeker in opleiding',
            color: '#202023',
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
