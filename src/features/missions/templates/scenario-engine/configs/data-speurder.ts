import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'data-speurder',
    title: 'Data Speurder',
    introEmoji: '📊',
    introTitle: 'Data Speurder',
    introDescription:
        'Data is overal — maar zonder de juiste vaardigheden is het gewoon ruis. Jij leert als Data Speurder hoe je data verzamelt, analyseert en presenteert zodat het een verhaal vertelt. Datageletterdheid is een van de meest gevraagde vaardigheden van de 21e eeuw.',
    missionGoal: {
        primaryGoal: 'Onderzoek data, kies passende visualisaties en trek een conclusie die je met bewijs kunt uitleggen.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Alle scenario-rondes zijn doorlopen met datakeuzes, grafiekkeuzes en conclusies.',
        },
        evidence: 'Antwoorden over data versus informatie, grafieken, patronen en misleiding.',
    },
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Bekijk de datasetcase en kies eerst welk bewijs nodig is voor een betrouwbare conclusie.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Feedback laat zien of je data, grafiekkeuze en conclusie logisch aan elkaar koppelt.',
        visualKit: 'data-room',
        evidenceMoment: 'Leerlingen leveren grafiekkeuzes, patroonherkenning en een conclusie met databewijs.',
        antiBoringRule: 'Geen tabelvragen zonder doel: elke ronde start met bewijs zoeken voor een concrete dataclaim.',
        chromeAcceptance: 'Datasetcase, bewijskeuze, feedback en completionbewijs zijn duidelijk en niet alleen multiple choice.',
    },
    introFeatures: [
        'Onderscheid data van informatie en conclusies',
        'Kies de juiste grafiekvorm voor verschillende soorten data',
        'Herken patronen en trek onderbouwde conclusies',
        'Oefen: wat zegt deze data écht — en wat niet?',
    ],
    introChoice: {
        title: 'Datacase',
        scenario: 'Je krijgt straks meetwaarden over schermtijd, cijfers en klasgedrag. Eerst maak je een onderzoekshypothese.',
        prompt: 'Welke hypothese wil jij als data-speurder toetsen?',
        options: [
            {
                id: 'schermtijd-cijfers',
                label: 'Schermtijd hangt samen met cijfers',
                description: 'Ik verwacht een patroon tussen veel schermtijd en lagere cijfers.',
                feedback: 'Goede start: je kiest een toetsbare relatie. Let straks wel op: verband is nog geen oorzaak.'
            },
            {
                id: 'grafiek-misleidt',
                label: 'De grafiek kan misleiden',
                description: 'Ik verwacht dat presentatiekeuzes het verhaal kunnen verdraaien.',
                feedback: 'Sterke datahouding: je kijkt niet alleen naar getallen, maar ook naar hoe ze worden getoond.'
            },
            {
                id: 'gemiddelde-verbergt',
                label: 'Het gemiddelde verbergt uitschieters',
                description: 'Ik verwacht dat een samenvatting niet alles vertelt.',
                feedback: 'Scherp: gemiddelden zijn handig, maar kunnen verschillen in de groep onzichtbaar maken.'
            }
        ]
    },
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Data Expert',
            color: '#0B453F',
        },
        {
            minScore: 60,
            emoji: '📊',
            title: 'Data Analist',
            color: '#5F947D',
        },
        {
            minScore: 40,
            emoji: '📚',
            title: 'Goed Begonnen',
            color: '#445865',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Blijf Oefenen',
            color: '#445865',
        },
    ],
    takeaways: [
        'Data is een rauwe meting of observatie. Informatie is data met betekenis. Conclusies zijn interpretaties.',
        'Correlatie betekent niet causaliteit: twee dingen die samen bewegen zijn niet per se oorzaak en gevolg.',
        'Een grafiek kan eerlijk of misleidend zijn — kijk altijd naar de schaal van de y-as.',
        'Gemiddeld, mediaan en modus kunnen heel verschillende dingen vertellen over dezelfde dataset.',
        'Goede datavisualisatie maakt complexe informatie toegankelijk voor mensen die de ruwe data niet kunnen lezen.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'data-of-conclusie',
            emoji: '🔎',
            title: 'Data, informatie of conclusie?',
            description:
                'Er is een verschil tussen ruwe data, informatie en een conclusie. Welke van de volgende uitspraken zijn RUWE DATA (feiten, meetwaarden)? Selecteer ze.',
            type: 'select-correct',
            minSelections: 3,
            selectionInstruction: 'Selecteer alle uitspraken die echt ruwe data zijn',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je herkent het verschil tussen wat gemeten is en wat er over wordt gezegd.',
            feedbackIncorrect:
                'Let op: data is een meting of observatie. Een conclusie of interpretatie is dat niet. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '📱',
                    title: '"Ik gebruik Instagram 47 minuten per dag"',
                    description:
                        'Schermtijdmeting van je telefoon over de afgelopen week.',
                    correct: true,
                    explanation:
                        'Dit is ruwe data. Een specifieke meetwaarde (47 minuten) over een specifieke periode. Geen interpretatie, geen vergelijking — gewoon wat de telefoon heeft geregistreerd.',
                },
                {
                    id: 2,
                    icon: '😴',
                    title: '"Jongeren slapen te weinig door social media"',
                    description:
                        'Een uitspraak die je tegenkomt in een artikel over schermtijd.',
                    correct: false,
                    explanation:
                        'Dit is een conclusie (met een oorzaak-gevolg claim bovendien). Om dit te bewijzen heb je data nodig: hoeveel slapen jongeren? Is er een verband met schermtijd? Conclusies vereisen onderbouwing.',
                },
                {
                    id: 3,
                    icon: '🌡️',
                    title: '"De temperatuur in Amsterdam was gisteren 18°C"',
                    description:
                        'Waarneming van het weerstation.',
                    correct: true,
                    explanation:
                        'Ruwe data: een gemeten getal op een specifiek moment en locatie. Dit is wat een weerstation registreert — objectief en herhaalbaar.',
                },
                {
                    id: 4,
                    icon: '🚲',
                    title: '"Nederlanders fietsen meer dan andere Europeanen"',
                    description:
                        'Een bewering die je hoort in een discussie.',
                    correct: false,
                    explanation:
                        'Dit is informatie of een conclusie — het is een interpretatie van data. Om dit te bewijzen heb je gemeten gegevens nodig: hoeveel km fietsen Nederlanders vs. andere Europeanen per jaar?',
                },
                {
                    id: 5,
                    icon: '📊',
                    title: '"Klas 2A heeft een gemiddeld eindcijfer van 6,8"',
                    description:
                        'Berekend uit de cijferlijst van alle 28 leerlingen in de klas.',
                    correct: false,
                    explanation:
                        'Dit is informatie: ruwe cijfers zijn samengevat tot een gemiddelde. Het getal is feitelijk, maar niet meer de ruwe data zelf.',
                },
                {
                    id: 6,
                    icon: '🎮',
                    title: '"Gamers zijn sociaal geïsoleerd"',
                    description:
                        'Een populaire opvatting over gamende jongeren.',
                    correct: false,
                    explanation:
                        'Dit is een vooroordeel of onbewezen conclusie. Onderzoek laat juist zien dat gamers vaak sterk verbonden zijn met online communities. Conclusies zonder data zijn aannames.',
                },
                {
                    id: 7,
                    icon: '🏃',
                    title: '"Mijn stappenteller telde vandaag 8.247 stappen"',
                    description:
                        'Gegevens van de Gezondheid-app op je telefoon.',
                    correct: true,
                    explanation:
                        'Ruwe data van een sensor. Een specifieke meting (8.247 stappen) op een specifieke dag. De sensor heeft het gemeten, niet geïnterpreteerd.',
                },
                {
                    id: 8,
                    icon: '🌱',
                    title: '"Klimaatverandering verloopt sneller dan verwacht"',
                    description:
                        'Uitspraak van klimaatwetenschappers op basis van temperatuurmetingen.',
                    correct: false,
                    explanation:
                        'Dit is een conclusie gebaseerd op data (temperatuurmetingen over decennia). De conclusie zelf is geen data. De meetwaarden (gemiddelde temperatuur per jaar) zijn de data.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'grafiek-kiezen',
            emoji: '📈',
            title: 'Welke grafiek past het best?',
            description:
                'Rangschik deze vijf datavragen naar welke grafiekvorm het BESTE past, van meest geschikt voor een staafdiagram (1e) naar minst geschikt (5e).',
            type: 'order-priority',
            orderInstruction: 'Klik van beste naar minst passende staafdiagram-keuze',
            maxScore: 25,
            feedbackCorrect:
                'Uitstekend! Je weet wanneer een staafdiagram de beste keuze is.',
            feedbackIncorrect:
                'Denk aan: staafdiagrammen zijn het sterkst bij vergelijken van categorieën. Lijndiagrammen voor trends in de tijd.',
            items: [
                {
                    id: 1,
                    icon: '🎮',
                    title: 'Populairste spelletjes in de klas vergelijken',
                    description:
                        'Je hebt bijgehouden welk spelletje elk van de 28 klasgenoten het liefst speelt: Minecraft, FIFA, Roblox, Fortnite of andere.',
                    correctPosition: 0,
                    explanation:
                        'Perfect voor een staafdiagram. Je vergelijkt categorieën (spelletjes) op een meetwaarde (aantal leerlingen). Dit is het klassieke gebruik van een staafdiagram.',
                },
                {
                    id: 2,
                    icon: '🏆',
                    title: 'Cijfers per vak vergelijken',
                    description:
                        'Je gemiddelde cijfer per schoolvak: Nederlands 7,2 — Wiskunde 6,8 — Engels 8,1 — Biologie 7,5.',
                    correctPosition: 1,
                    explanation:
                        'Goed voor een staafdiagram. Je vergelijkt categorieën (vakken) op een numerieke waarde (cijfer). Staafdiagrammen maken zulke vergelijkingen visueel direct duidelijk.',
                },
                {
                    id: 3,
                    icon: '🌡️',
                    title: 'Temperatuurontwikkeling door de week',
                    description:
                        'De dagtemperatuur van maandag tot en met vrijdag: 12, 15, 18, 14, 16 graden.',
                    correctPosition: 2,
                    explanation:
                        'Een lijndiagram is eigenlijk beter voor tijdreeksen — maar een staafdiagram kan ook. De keuze hangt af van of je de trend (lijn) of de absolute waarde per dag (staaf) wil benadrukken.',
                },
                {
                    id: 4,
                    icon: '🥧',
                    title: 'Verdeling schermtijd over apps',
                    description:
                        'Je totale schermtijd: 40% Instagram, 30% TikTok, 20% WhatsApp, 10% overig.',
                    correctPosition: 3,
                    explanation:
                        'Een cirkeldiagram (taartdiagram) is beter voor verhoudingen die optellen tot 100%. Een staafdiagram kan dit tonen, maar maakt het minder intuïtief duidelijk dat het om delen van een geheel gaat.',
                },
                {
                    id: 5,
                    icon: '🌱',
                    title: 'Relatie tussen studie-uren en cijfer',
                    description:
                        'Voor elk van de 28 leerlingen: hoeveel uur ze hebben gestudeerd én hun cijfer voor de toets.',
                    correctPosition: 4,
                    explanation:
                        'Een spreidingsdiagram (scatterplot) is het meest geschikt om verbanden tussen twee variabelen te tonen. Een staafdiagram past hier het slechtst.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'misleidende-data',
            emoji: '🤔',
            title: 'Eerlijk of misleidend?',
            description:
                'Data kan op een eerlijke of misleidende manier worden gepresenteerd. Is de volgende datapresentatie eerlijk of misleidend?',
            type: 'binary-choice',
            acceptLabel: 'Eerlijk',
            rejectLabel: 'Misleidend',
            maxScore: 25,
            feedbackCorrect: 'Goed! Je doorziet hoe data gemanipuleerd kan worden.',
            feedbackIncorrect: 'Soms is misleiding subtiel. Lees de uitleg om de truc te zien.',
            items: [
                {
                    id: 1,
                    icon: '📉',
                    title: 'Y-as begint op 95% in plaats van 0%',
                    description:
                        'Een grafiek toont dat het klanttevredenheidscijfer steeg van 96% naar 98%. De y-as begint op 95%, waardoor de stijging er enorm uitziet.',
                    correct: false,
                    explanation:
                        'Misleidend. Door de y-as op 95% te laten beginnen, ziet een stijging van 2 procentpunt eruit als een verdubbeling. De werkelijke verandering is klein. Altijd controleren of de y-as bij 0 begint.',
                },
                {
                    id: 2,
                    icon: '📊',
                    title: 'Gemiddelde schermtijd met uitbijters vermeld',
                    description:
                        'Een rapport meldt: "De gemiddelde schermtijd is 4,2 uur per dag. Twee leerlingen (8 en 9 uur) trekken het gemiddelde omhoog. De mediaan is 3,5 uur."',
                    correct: true,
                    explanation:
                        'Eerlijk. Het rapport vermeldt niet alleen het gemiddelde, maar ook de mediaan en de uitbijters. Dit geeft een volledig beeld. Transparantie over uitbijters is goede datapresentatie.',
                },
                {
                    id: 3,
                    icon: '🎂',
                    title: 'Cirkeldiagram met segmenten die samen 110% vormen',
                    description:
                        'Een cirkeldiagram toont: 40% TikTok, 35% Instagram, 25% YouTube, 10% andere. Totaal: 110%.',
                    correct: false,
                    explanation:
                        'Misleidend. Een cirkeldiagram moet optellen tot precies 100%. Als het meer is, zijn de segmenten onjuist berekend of is er dubbeltellingen. Dit is een fundamentele fout in datavisualisatie.',
                },
                {
                    id: 4,
                    icon: '📈',
                    title: 'Lijndiagram met duidelijk aangegeven datapunten en bron',
                    description:
                        'Een lijndiagram over gemiddelde temperatuur per jaar (1900-2024) met datapunten per 10 jaar, bron: KNMI vermeld onderaan.',
                    correct: true,
                    explanation:
                        'Eerlijk. Datapunten zijn duidelijk, de tijdsperiode is volledig, en de bron is vermeld. Zo hoort een goede grafiek eruit te zien.',
                },
                {
                    id: 5,
                    icon: '🏆',
                    title: '"90% van de gebruikers is tevreden" — steekproef van 10 vrienden',
                    description:
                        'Een app-bedrijf claimt dat 90% tevreden is, gebaseerd op een enquête onder 10 vaste klanten.',
                    correct: false,
                    explanation:
                        'Misleidend. Een steekproef van 10 mensen is te klein voor betrouwbare statistieken, en het zijn vaste klanten — een selecte, positief gestemde groep. Dit is geen representatieve steekproef.',
                },
                {
                    id: 6,
                    icon: '📋',
                    title: 'Tabel met cijfers en de gebruikte rekenmethode uitgelegd',
                    description:
                        'Een schoolrapport toont een tabel met cijfers per toets, het gewogen gemiddelde, en een voetnoot die uitlegt hoe het gewogen gemiddelde is berekend.',
                    correct: true,
                    explanation:
                        'Eerlijk en transparant. Door de rekenmethode te vermelden kan iedereen het zelf controleren. Transparantie over methode is een kenmerk van goede datapresentatie.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'conclusies-trekken',
            emoji: '🧪',
            title: 'Welke conclusies mag je trekken?',
            description:
                'Je hebt de schermtijddata van 28 leerlingen verzameld. Gemiddeld 3,8 uur per dag. Leerlingen met hogere schermtijd hebben gemiddeld 0,3 punt lagere cijfers. Welke conclusies mag je trekken op basis van alleen deze data? Selecteer ze.',
            type: 'select-correct',
            minSelections: 3,
            selectionInstruction: 'Selecteer alle conclusies die je verantwoord mag trekken',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je weet het verschil tussen wat data bewijst en wat je er graag uit wilt lezen.',
            feedbackIncorrect:
                'Pas op voor te sterke conclusies. Data bewijst correlaties, zelden oorzaken.',
            items: [
                {
                    id: 1,
                    icon: '📊',
                    title: '"Het gemiddelde is 3,8 uur per dag"',
                    description:
                        'Op basis van de verzamelde data is het gemiddelde berekend als 3,8 uur.',
                    correct: true,
                    explanation:
                        'Dit is een feitelijke, aantoonbare conclusie op basis van de data. Het is een rekenkundige uitkomst van de meetwaarden.',
                },
                {
                    id: 2,
                    icon: '📉',
                    title: '"Meer schermtijd veroorzaakt slechtere cijfers"',
                    description:
                        'Op basis van de correlatie (hogere schermtijd → lagere cijfers gemiddeld 0,3 punt).',
                    correct: false,
                    explanation:
                        'Dit is te ver. Correlatie is geen causaliteit. Misschien hebben leerlingen die minder studeren zowel meer schermtijd als slechtere cijfers. Of misschien is er een derde factor. De data bewijst geen oorzaak-gevolg.',
                },
                {
                    id: 3,
                    icon: '🔗',
                    title: '"Er is een verband tussen hogere schermtijd en lagere cijfers in deze klas"',
                    description:
                        'Op basis van de correlatie in de data van 28 leerlingen.',
                    correct: true,
                    explanation:
                        'Dit is een terechte conclusie. Je beschrijft een patroon in de data (correlatie) zonder een oorzaak te claimen. "Verband" is het juiste woord voor een correlatie.',
                },
                {
                    id: 4,
                    icon: '🌍',
                    title: '"Alle jongeren in Nederland zitten gemiddeld 3,8 uur op hun telefoon"',
                    description:
                        'Gegeneraliseerd vanuit jouw klassendata naar alle jongeren in Nederland.',
                    correct: false,
                    explanation:
                        'Je kunt data van 28 leerlingen in één klas niet generaliseren naar alle jongeren in Nederland. Een representatieve steekproef voor Nederland vereist duizenden respondenten uit diverse regio\'s en achtergronden.',
                },
                {
                    id: 5,
                    icon: '📱',
                    title: '"In deze klas is de gemiddelde schermtijd hoger dan de aanbevolen 2 uur per dag"',
                    description:
                        'Vergelijking van het gemeten gemiddelde (3,8 uur) met een vooraf gekozen richtlijn van 2 uur.',
                    correct: true,
                    explanation:
                        'Dit kan alleen als je die richtlijn vooraf duidelijk als bron of onderzoeksafspraak noemt. Dan vergelijk je een meetwaarde met een transparante referentie, zonder te doen alsof de data zelf die norm bewijst.',
                },
                {
                    id: 6,
                    icon: '🔮',
                    title: '"Als we de schermtijd verlagen, gaan de cijfers omhoog"',
                    description:
                        'Een beleidsaanbeveling op basis van de gevonden correlatie.',
                    correct: false,
                    explanation:
                        'Dit is een te sterke claim. De data toont een correlatie, maar niet dat verlagen van schermtijd de oorzaak van de lagere cijfers wegneemt. Er kunnen andere factoren spelen. Een aanbeveling voor beleid vereist meer onderzoek.',
                },
                {
                    id: 7,
                    icon: '📏',
                    title: '"Leerlingen met meer dan 5 uur schermtijd per dag hadden gemiddeld een 0,3 punt lager cijfer"',
                    description:
                        'Een specifieke beschrijving van het patroon dat is gevonden in de data.',
                    correct: true,
                    explanation:
                        'Dit is een nauwkeurige en eerlijke beschrijving van wat de data laat zien. Specifiek (5 uur grens), feitelijk (0,3 punt lager) en zonder overinterpretatie.',
                },
                {
                    id: 8,
                    icon: '📚',
                    title: '"Schermtijd is de grootste bedreiging voor schoolprestaties"',
                    description:
                        'Een dramatische claim op basis van de gevonden kleine correlatie.',
                    correct: false,
                    explanation:
                        'Veel te sterke conclusie. De data toont een kleine correlatie (0,3 punt) in één klas. Er zijn tientallen andere factoren die cijfers beïnvloeden: thuissituatie, motivatie, leerondersteuning. "Grootste bedreiging" is niet bewezen door deze data.',
                },
            ],
        },
    ],
};

export default config;
