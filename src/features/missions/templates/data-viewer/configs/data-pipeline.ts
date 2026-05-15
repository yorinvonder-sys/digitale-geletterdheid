import type { DataViewerConfig } from '../DataViewer';

export const dataPipelineConfig: DataViewerConfig = {
    missionId: 'data-pipeline',
    title: 'Data Pipeline',
    introEmoji: '🔧',
    introTitle: 'Word een Data Engineer',
    introDescription:
        'Ruwe data is altijd een puinhoop. Ontbrekende waarden, verkeerde formaten, duplicaten — voordat je data kunt analyseren moet je hem opschonen. Dit heet een ETL-proces: Extract, Transform, Load. Jij gaat leren hoe data-engineers orde scheppen in chaos.',
    introFeatures: [
        'Analyseer rommelige sensordata en vind de problemen',
        'Vergelijk hoe groot het effect van data-opschoning is',
        'Beoordeel welke transformatiestrategie past bij welk probleem',
    ],

    datasets: [
        // ── Dataset 1: Tabel ──────────────────────────────────────────────────
        {
            id: 'ruwe-sensordata',
            title: 'Ruwe sensordata: energieverbruik schoolgebouw',
            description:
                'Sensoren meten elk uur de temperatuur en het stroomverbruik van lokalen. Maar de data is rommelig. Zoek alle dataproblemen in deze tabel.',
            type: 'table',
            columns: [
                { key: 'timestamp', label: 'Tijdstip', sortable: true },
                { key: 'lokaal', label: 'Lokaal', sortable: true },
                { key: 'temp_celsius', label: 'Temp (°C)', sortable: true },
                { key: 'stroom_watt', label: 'Stroom (W)', sortable: true },
                { key: 'probleem', label: 'Probleem?', sortable: true },
            ],
            rows: [
                { timestamp: '2025-01-15 08:00', lokaal: 'Lokaal 3A', temp_celsius: 21.5, stroom_watt: 1200, probleem: 'Geen' },
                { timestamp: '2025-01-15 08:00', lokaal: 'Lokaal 3A', temp_celsius: 21.5, stroom_watt: 1200, probleem: 'Duplicaat' },
                { timestamp: '2025-01-15 09:00', lokaal: 'Lokaal 3A', temp_celsius: '', stroom_watt: 1150, probleem: 'Missende waarde' },
                { timestamp: '2025-01-15 10:00', lokaal: 'lokaal 3a', temp_celsius: 215, stroom_watt: 1300, probleem: 'Inconsistente naam + fout getal' },
                { timestamp: '15-01-2025 11:00', lokaal: 'Lokaal 3B', temp_celsius: 20.8, stroom_watt: 980, probleem: 'Verkeerd datumformaat' },
                { timestamp: '2025-01-15 12:00', lokaal: 'Lokaal 3B', temp_celsius: 21.2, stroom_watt: -50, probleem: 'Onmogelijke waarde' },
                { timestamp: '2025-01-15 13:00', lokaal: 'Lokaal 3A', temp_celsius: 22.0, stroom_watt: 1180, probleem: 'Geen' },
                { timestamp: '2025-01-15 14:00', lokaal: 'Lokaal 3B', temp_celsius: 21.5, stroom_watt: 1010, probleem: 'Geen' },
            ],
            questions: [
                {
                    id: 'q1-problemen-tellen',
                    question:
                        'Hoeveel rijen bevatten een datakwaliteitsprobleem (geen "Geen" in de kolom "Probleem?")?',
                    type: 'number-input',
                    correctAnswer: 5,
                    explanation:
                        'Rijen met een probleem: duplicaat (08:00 tweede keer), missende waarde (09:00), inconsistente naam + fout getal (10:00), verkeerd datumformaat (11:00), onmogelijke waarde (12:00). Dat zijn 5 van de 8 rijen! Filter op "Probleem?" ≠ "Geen" om ze te zien.',
                    points: 15,
                },
                {
                    id: 'q2-onmogelijke-waarde',
                    question:
                        'De sensor registreert -50 Watt stroomverbruik om 12:00. Welke actie is het meest correct?',
                    type: 'multiple-choice',
                    options: [
                        'De waarde accepteren — misschien geeft de sensor energie terug aan het net',
                        'De rij verwijderen uit de dataset',
                        'De waarde vervangen door het gemiddelde van omliggende metingen',
                        'De waarde omzetten naar positief: 50 Watt',
                    ],
                    correctAnswer: 'De waarde vervangen door het gemiddelde van omliggende metingen',
                    explanation:
                        'Een negatief stroomverbruik is vrijwel zeker een sensorfout. De meest data-vriendelijke aanpak is imputation: vervang de onmogelijke waarde door het gemiddelde van de omliggende metingen (bijv. 980 en 1010 → gemiddelde ≈ 995 W). Verwijderen verliest data. Simpelweg omkeren is willekeurig.',
                    points: 15,
                },
                {
                    id: 'q3-etl-observatie',
                    question:
                        'Waarom is het gevaarlijk om analyses te doen op ruwe data zonder die eerst op te schonen? Geef een concreet voorbeeld met de sensordata.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Als je het gemiddelde stroomverbruik berekent met -50 W erin, wordt het resultaat misleidend laag. Als je de duplicaat meeneemt, tel je 08:00 twee keer mee. Als je 215°C als temperatuur gebruikt, beïnvloedt het het gemiddelde enorm (echte gemiddelde is ~21°C maar met die fout wordt het ~47°C). Garbage in, garbage out — slechte data levert slechte conclusies.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 2: Staafgrafiek ───────────────────────────────────────────
        {
            id: 'datakwaliteit-voor-na',
            title: 'Effect van data-opschoning: voor vs. na',
            description:
                'Na het ETL-proces is de dataset opgeschoond. Bekijk het verschil in gemiddelde temperatuur per lokaal voor en na de opschoning.',
            type: 'bar-chart',
            chartData: [
                { label: 'Lokaal 3A (ruw)', value: 47.8, color: '#D97848' },
                { label: 'Lokaal 3A (schoon)', value: 21.6, color: '#0B453F' },
                { label: 'Lokaal 3B (ruw)', value: 20.8, color: '#D97848' },
                { label: 'Lokaal 3B (schoon)', value: 21.0, color: '#5F947D' },
            ],
            questions: [
                {
                    id: 'q4-verschil-lokaal3a',
                    question:
                        'Hoeveel graden wijkt het ruwe gemiddelde van Lokaal 3A af van het schoone gemiddelde?',
                    type: 'number-input',
                    correctAnswer: 26.2,
                    explanation:
                        'Ruw gemiddelde: 47,8 °C. Schoon gemiddelde: 21,6 °C. Verschil: 47,8 − 21,6 = 26,2 °C. Dit enorme verschil komt door de ene foutieve meting van 215°C die het gemiddelde omhoog trok. Eén fout in je data kan je hele analyse onbruikbaar maken.',
                    points: 15,
                },
                {
                    id: 'q5-lokaal3b-verschil',
                    question:
                        'Waarom is het verschil tussen ruw en schoon voor Lokaal 3B veel kleiner dan voor Lokaal 3A?',
                    type: 'multiple-choice',
                    options: [
                        'Lokaal 3B had geen dataproblemen in zijn metingen',
                        'De problemen in Lokaal 3B waren minder ernstig (geen extreme uitschieters)',
                        'Lokaal 3B werd vaker gemeten dan Lokaal 3A',
                        'De sensor in Lokaal 3B was recenter gekalibreerd',
                    ],
                    correctAnswer: 'De problemen in Lokaal 3B waren minder ernstig (geen extreme uitschieters)',
                    explanation:
                        'Lokaal 3B had wel een probleem (-50 W stroom) maar geen extreme temperatuuruitschieter zoals Lokaal 3A (215°C). Kleine fouten beïnvloeden het gemiddelde weinig; grote uitschieters kunnen het enorm vertrekken. Dit is waarom je bij data-opschoning eerst naar uitschieters zoekt.',
                    points: 10,
                },
                {
                    id: 'q6-etl-keuze',
                    question:
                        'Beschrijf de drie stappen van een ETL-proces in eigen woorden. Gebruik de sensordata als voorbeeld.',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Extract: haal de sensordata op uit de database of CSV-bestanden. Transform: schoon de data op — verwijder duplicaten, repareer datumformaten, vervang onmogelijke waarden, standaardiseer lokaal-namen. Load: laad de schoone data in een nieuw bestand of database die klaar is voor analyse. Zonder de Transform-stap zijn de Extract en Load nutteloos.',
                    points: 10,
                },
            ],
        },

        // ── Dataset 3: Document-cards ─────────────────────────────────────────
        {
            id: 'transformatie-strategieen',
            title: 'Vier transformatiestrategieën voor slechte data',
            description:
                'Data-engineers hebben vaste strategieën voor elk type dataprobleem. Lees de vier meest gebruikte en beantwoord de vragen.',
            type: 'document-cards',
            cards: [
                {
                    title: 'Strategie 1: Verwijderen (deletion)',
                    icon: '🗑️',
                    content:
                        'Verwijder rijen met ernstige fouten of duplicaten. Dit is de eenvoudigste aanpak, maar je verliest data. Gebruik dit alleen als: de rij te veel fouten heeft om te repareren, of als het een exacte duplicaat is. Pas op: als je te veel rijen verwijdert, wordt de dataset te klein om betrouwbare conclusies te trekken.',
                },
                {
                    title: 'Strategie 2: Imputatie (imputation)',
                    icon: '🔧',
                    content:
                        'Vervang een missende of foutieve waarde door een geschatte waarde: het gemiddelde, mediaan, of de waarde van de vorige/volgende meting. Dit behoudt de grootte van de dataset. Voorbeeld: een missende temperatuur vervang je door het gemiddelde van het uur ervoor en erna. Risico: je voegt verzonnen data toe.',
                },
                {
                    title: 'Strategie 3: Standaardiseren',
                    icon: '📐',
                    content:
                        'Zorg dat alle waarden hetzelfde formaat hebben: datums allemaal "YYYY-MM-DD HH:MM", lokaal-namen altijd "Lokaal XY" met hoofdletter, temperaturen altijd in °C. Inconsistente formaten zorgen ervoor dat databases en programma\'s de data niet kunnen groeperen. "lokaal 3a" en "Lokaal 3A" zijn voor een computer twee verschillende lokalen.',
                },
                {
                    title: 'Strategie 4: Uitschieters markeren',
                    icon: '🚩',
                    content:
                        'Soms is een extreme waarde geen fout, maar een echte gebeurtenis. Markeer uitschieters met een extra kolom (bijv. "is_outlier: true") in plaats van ze te verwijderen. Zo kun je later beslissen hoe je ermee omgaat. 215°C is waarschijnlijk een sensorfout, maar een stroomverbruik van 5000W in een groot lokaal kan echt zijn.',
                },
            ],
            questions: [
                {
                    id: 'q7-strategie-keuze',
                    question:
                        'De sensor registreert een missende temperatuurwaarde voor 09:00. Welke transformatiestrategie is het meest geschikt?',
                    type: 'multiple-choice',
                    options: [
                        'Verwijderen — de rij is onbruikbaar',
                        'Imputatie — vervang door het gemiddelde van 08:00 en 10:00',
                        'Standaardiseren — zorg dat het format klopt',
                        'Uitschieters markeren — markeer de rij als outlier',
                    ],
                    correctAnswer: 'Imputatie — vervang door het gemiddelde van 08:00 en 10:00',
                    explanation:
                        'Een missende waarde (leeg veld) is het beste op te lossen met imputatie: neem het gemiddelde van de omliggende metingen. 08:00 was 21,5°C, 10:00 was (gecorrigeerd) ≈ 21,8°C, dus een redelijke schatting is ≈ 21,6°C. Verwijderen verliest informatie over dat tijdstip onnodig.',
                    points: 15,
                },
                {
                    id: 'q8-pipeline-reflectie',
                    question:
                        'Benoem één nadeel van imputatie als transformatiestrategie. Wanneer zou je toch liever de rij verwijderen?',
                    type: 'text-observation',
                    correctAnswer: '',
                    explanation:
                        'Nadeel van imputatie: je voegt verzonnen data toe aan je dataset. Als je later precies wilt weten wat er om 09:00 is gemeten, bestaat dat getal niet echt. Je zou liever verwijderen als: de omliggende metingen ook ontbreken (je kunt geen gemiddelde maken), of als de meting over een crisissituatie ging waarbij je géén geschatte waarden wilt invoegen.',
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
            title: 'Data Engineer Pro!',
            color: '#5F947D',
        },
        {
            minScore: 65,
            emoji: '🔧',
            title: 'Pipeline Bouwer',
            color: '#0B453F',
        },
        {
            minScore: 40,
            emoji: '📊',
            title: 'ETL Beginner',
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
        'ETL staat voor Extract, Transform, Load — de basis van elk data-engineering proces',
        'Eén extreme uitschieter kan een heel gemiddelde onbetrouwbaar maken',
        'Imputatie vult missende waarden aan; verwijderen verwijdert slechte rijen',
        'Standaardiseren zorgt dat dezelfde dingen ook als hetzelfde worden herkend',
        'Garbage in, garbage out: slechte data levert altijd slechte analyses op',
    ],
};

export default dataPipelineConfig;
