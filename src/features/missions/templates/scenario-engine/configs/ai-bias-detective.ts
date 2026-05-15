import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'ai-bias-detective',
    title: 'AI Bias Detective',
    introEmoji: '🔎',
    introTitle: 'AI Bias Detective',
    introDescription:
        'AI-systemen leren van menselijke data — en die data is niet neutraal. Als de trainingsdata scheef is, worden de resultaten ook scheef. Jij leert als AI Bias Detective herkennen wanneer een AI oneerlijk uitpakt voor bepaalde groepen mensen.',
    introFeatures: [
        'Herken vooroordelen in AI-systemen aan de hand van echte voorbeelden',
        'Rangschik AI-toepassingen van meest naar minst risicovol',
        'Ontdek: wanneer is een AI-resultaat scheef of eerlijk?',
        'Bedenk oplossingen voor eerlijkere technologie',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'AI Eerlijkheidsexpert',
            color: '#D97848',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Bias Detective',
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
        'AI is niet objectief — het leert van menselijke data en menselijke data bevat menselijke vooroordelen.',
        'Bias in AI kan iedereen treffen, maar treft mensen die al gemarginaliseerd zijn onevenredig hard.',
        'Diverse trainingsdata en diverse ontwikkelteams zijn de beste remedie tegen bias.',
        'Herkennen van bias is een vaardigheid die je kunt leren — je hoeft geen programmeur te zijn.',
        'Als AI wordt gebruikt voor beslissingen die mensen raken (aanname, leningen, straffen), moet er altijd mensenlijk toezicht zijn.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'herken-bias',
            emoji: '🚩',
            title: 'Herken AI-bias',
            description:
                'In welke van deze situaties is er sprake van AI-bias? Selecteer alles wat een voorbeeld is van scheefheid in een AI-systeem.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Scherp! Je herkent bias in verschillende vormen en contexten.',
            feedbackIncorrect:
                'Sommige vormen van bias zijn goed gecamoufleerd. Lees de uitleg om de patronen te zien.',
            items: [
                {
                    id: 1,
                    icon: '📚',
                    title: 'Boekaanbevelingen op basis van gender',
                    description:
                        'Een schoolbibliotheek-AI beveelt meisjes automatisch romantische romans aan en jongens avonturenboeken, op basis van hun naam.',
                    correct: true,
                    explanation:
                        'Dit is genderbias. De AI heeft geleerd van historische data waarin jongens en meisjes andere boeken lazen, maar dat was het gevolg van sociale verwachtingen — niet van daadwerkelijke interesse. De AI reproduceert stereotypen.',
                },
                {
                    id: 2,
                    icon: '🌡️',
                    title: 'Weersapp voorspelt regen in Amsterdam',
                    description:
                        'Een weersapp voorspelt dat het morgen regent in Amsterdam op basis van historische weerdata.',
                    correct: false,
                    explanation:
                        'Dit is geen bias — dit is gewone patroonherkenning in neutrale data. Weerspatronen hebben geen sociale dimensie. Niet elke fout of voorspelling van een AI is bias.',
                },
                {
                    id: 3,
                    icon: '💼',
                    title: 'CV-filter wijst vrouwen vaker af',
                    description:
                        'Een bedrijf gebruikt een AI om sollicitatiebrieven te filteren. De AI wijst vrouwen systematisch vaker af voor technische functies, ook bij gelijke kwalificaties.',
                    correct: true,
                    explanation:
                        'Amazon moest een soortgelijk systeem stoppen in 2018. De AI had geleerd van historische aannames, waarbij mannen oververtegenwoordigd waren in tech. Het systeem leerde dat "mannelijk" een positief signaal was.',
                },
                {
                    id: 4,
                    icon: '🎵',
                    title: 'Spotify beveelt muziek aan op basis van luistergedrag',
                    description:
                        'Spotify beveelt nummers aan die lijken op wat jij al hebt geluisterd.',
                    correct: false,
                    explanation:
                        'Dit is personalisatie op basis van jouw eigen gedrag — geen bias in de klassieke zin. Wel kan het leiden tot een "bubbel" waarbij je steeds hetzelfde genre hoort. Dat is een neveneffect, maar geen oneerlijke behandeling van een groep.',
                },
                {
                    id: 5,
                    icon: '📸',
                    title: 'Gezichtsherkenning werkt slechter voor donkere huid',
                    description:
                        'Een gezichtsherkenningssysteem herkent mensen met een lichte huid met 99% nauwkeurigheid, maar mensen met een donkere huid slechts met 65%.',
                    correct: true,
                    explanation:
                        'Dit is een bewezen bias in veel commerciële gezichtsherkenningssystemen (Joy Buolamwini heeft dit aangetoond). De trainingsdata bestond grotendeels uit lichte huidtinten. Gevolg: het systeem werkt slechter voor mensen van kleur, met soms ernstige consequenties bij politiegebruik.',
                },
                {
                    id: 6,
                    icon: '🏥',
                    title: 'Pijnbehandelingsalgoritme raadt minder pijnstillers aan voor zwarte patiënten',
                    description:
                        'Een ziekenhuisalgoritme dat prioriteert wie extra zorg nodig heeft, raadt zwarte patiënten minder behandelingen aan bij gelijke pijnklachten.',
                    correct: true,
                    explanation:
                        'Dit is een gedocumenteerd geval uit de VS. Het algoritme gebruikte zorgkosten als proxy voor gezondheidsbehoeften — maar zwarte patiënten hadden historisch minder zorg ontvangen (door ongelijkheid), dus werden als "minder ziek" geclassificeerd.',
                },
                {
                    id: 7,
                    icon: '🧮',
                    title: 'Rekenmachine maakt een rekenfout',
                    description:
                        'Een rekenmachine rekent 2 + 2 = 5 door een softwarebug.',
                    correct: false,
                    explanation:
                        'Een rekenfout door een bug is geen bias — het is een technische fout. Bias gaat specifiek over systematische scheefheid die een groep mensen anders behandelt dan een andere groep.',
                },
                {
                    id: 8,
                    icon: '🗺️',
                    title: 'Navigatieapp stuurt vrachtwagens door woonwijken',
                    description:
                        'Een navigatieapp routeert zwaar vrachtverkeer consistent door smalle woonstraten in bepaalde wijken.',
                    correct: true,
                    explanation:
                        'Als de algoritme kwetsbaardere wijken (lager inkomen, minder politieke invloed) disproportioneel belast ten opzichte van rijkere wijken, is er sprake van algoritmische bias met sociale gevolgen.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'meest-risicovol',
            emoji: '⚠️',
            title: 'Meest risicovolle AI-toepassing eerst',
            description:
                'Rangschik deze vijf AI-toepassingen van meest risicovolle bias (1e) naar minst risicovolle (5e) als de trainingsdata scheef is.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Goede risicoanalyse. Je begrijpt dat hoe groter de gevolgen voor mensen, hoe gevaarlijker de bias.',
            feedbackIncorrect:
                'Denk aan: wat zijn de gevolgen als de AI het fout heeft? Wie wordt er geraakt?',
            items: [
                {
                    id: 1,
                    icon: '⚖️',
                    title: 'AI die voorspelt of iemand opnieuw een misdrijf pleegt',
                    description:
                        'Rechters gebruiken een AI-systeem dat inschat hoe groot de kans is dat een verdachte opnieuw een misdrijf zal plegen. De uitkomst beïnvloedt strafmaat en vrijlating.',
                    correctPosition: 0,
                    explanation:
                        'Meest risicovol. Gebaseerd op COMPAS, een echt gebruikt systeem in de VS. Bias hier betekent dat mensen van kleur hogere risicoscores kregen bij gelijke situaties. Gevolg: ongegronde gevangenisstraf. Dit is direct levensveranderend.',
                },
                {
                    id: 2,
                    icon: '🏦',
                    title: 'AI die leningaanvragen beoordeelt',
                    description:
                        'Een bank gebruikt AI om te besluiten of iemand een hypotheek of lening krijgt en tegen welke rente.',
                    correctPosition: 1,
                    explanation:
                        'Zeer risicovol. Leningen zijn levensbepalend — huis, studie, onderneming. Bias op basis van postcode, naam of etniciteit heeft grote financiële en sociale gevolgen die generaties meegaan.',
                },
                {
                    id: 3,
                    icon: '💼',
                    title: 'AI die sollicitaties filtert',
                    description:
                        'Een bedrijf filtert alle sollicitaties met een AI voordat een recruiter ze ziet. CV\'s van afgewezen kandidaten worden nooit door een mens bekeken.',
                    correctPosition: 2,
                    explanation:
                        'Risicovol. Bias betekent dat mensen systematisch worden uitgesloten van kansen. Maar de gevolgen zijn minder acuut dan gevangenisstraf of woningweigering — er zijn meer werkgevers.',
                },
                {
                    id: 4,
                    icon: '🎵',
                    title: 'AI die muziek aanbeveelt op Spotify',
                    description:
                        'Een aanbevelingssysteem kiest welke nieuwe artiesten jij te horen krijgt.',
                    correctPosition: 3,
                    explanation:
                        'Lage impact op individueel niveau — je hoort wat andere muziek. Maar op macroniveau kan bias betekenen dat artiesten uit bepaalde groepen structureel minder exposure krijgen.',
                },
                {
                    id: 5,
                    icon: '🛒',
                    title: 'AI die aanbevelingen doet in een webshop',
                    description:
                        'Een webshop AI beveelt producten aan op basis van eerder aankoopgedrag.',
                    correctPosition: 4,
                    explanation:
                        'Minst risicovolle bias. Als de AI je de verkeerde spijkerbroek aanbeveelt, is de schade beperkt. Wel kan prijsdiscriminatie op basis van algoritmen een serieuzer probleem zijn.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'eerlijk-of-scheef',
            emoji: '⚖️',
            title: 'Eerlijk of scheef?',
            description:
                'Is het AI-resultaat in dit scenario eerlijk of is er sprake van bias? Kies zorgvuldig.',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Goed gezien! Je onderscheidt eerlijke personalisatie van echte bias.',
            feedbackIncorrect: 'Soms is de grens dun. Lees de uitleg om te begrijpen waarom.',
            items: [
                {
                    id: 1,
                    icon: '📖',
                    title: 'AI beveelt Nederlandstalige boeken aan aan Nederlandstalige lezers',
                    description:
                        'Een bibliotheek-AI beveelt automatisch boeken in de voorkeurstaal van de lezer aan, gebaseerd op taalinstellingen.',
                    correct: true,
                    explanation:
                        'Dit is eerlijke personalisatie op basis van een relevante voorkeur (taal). Er wordt geen groep benadeeld — het systeem past zich aan aan de behoeften van de individuele gebruiker.',
                },
                {
                    id: 2,
                    icon: '🏠',
                    title: 'AI toont minder huizen in rijke wijken aan zoekers met bepaalde achternamen',
                    description:
                        'Een huizenzoeksite-algoritme toont automatisch minder dure huizen in witte wijken aan mensen met niet-westerse achternamen.',
                    correct: false,
                    explanation:
                        'Dit is ernstige bias — en het is vergelijkbaar met redlining, een historische praktijk van woningdiscriminatie. Op basis van naam (een proxy voor etniciteit) worden mensen minder kansen getoond.',
                },
                {
                    id: 3,
                    icon: '🎮',
                    title: 'Game-AI past moeilijkheidsgraad aan op basis van jouw speelgedrag',
                    description:
                        'Een spelletjes-AI maakt het spel moeilijker als je te makkelijk wint en makkelijker als je het te moeilijk vindt.',
                    correct: true,
                    explanation:
                        'Dit is adaptieve technologie — de AI past zich aan om jouw ervaring beter te maken. Niemand wordt benadeeld op basis van een persoonskenmerk.',
                },
                {
                    id: 4,
                    icon: '🔍',
                    title: 'Zoekmachine toont alleen nieuws dat past bij jouw eerdere zoekopdrachten',
                    description:
                        'Als jij altijd naar tech-nieuws zoekt, laat de zoekmachine je automatisch minder politiek nieuws zien.',
                    correct: false,
                    explanation:
                        'Dit is een filterbubbel — een neveneffect van personalisatie dat je blootstelt aan steeds eenzijdiger informatie. Hoewel niet bedoeld als discriminatie, kan het je wereldbeeld versmallen en bijdragen aan maatschappelijke polarisatie.',
                },
                {
                    id: 5,
                    icon: '💊',
                    title: 'Medisch AI dat doseringen adviseert op basis van lichaamsgewicht',
                    description:
                        'Een AI berekent medicijndoseringen op basis van het gewicht van de patiënt, zoals standaard in de geneeskunde.',
                    correct: true,
                    explanation:
                        'Dosering op basis van gewicht is medisch verantwoord en niet-discriminerend. Het is gebaseerd op een fysiologisch relevante variabele. Dit is correcte, eerlijke toepassing van data.',
                },
                {
                    id: 6,
                    icon: '🚓',
                    title: 'Politie-AI voorspelt criminaliteit op basis van postcodegebied',
                    description:
                        'Een AI-systeem stuurt politie naar buurten op basis van historische criminaliteitscijfers, wat zorgt voor meer controles in arme wijken.',
                    correct: false,
                    explanation:
                        'Dit is een voorbeeld van zelfrefererende bias: meer politie in een wijk → meer arrestaties → meer data die de wijk als "risicovol" bestempelt → nóg meer politie. Arme wijken worden systematisch zwaarder gecontroleerd dan rijke wijken.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'oplossingen',
            emoji: '🛠️',
            title: 'Hoe maak je AI eerlijker?',
            description:
                'Welke maatregelen helpen écht om bias in AI te verminderen? Selecteer alles wat effectief is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je weet dat eerlijkheid in AI zowel technische als sociale oplossingen vereist.',
            feedbackIncorrect:
                'Sommige maatregelen klinken logisch maar pakken het probleem niet bij de kern aan. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '📊',
                    title: 'Diverse trainingsdata verzamelen',
                    description:
                        'Zorg dat de data waarop het AI-model wordt getraind alle relevante groepen goed vertegenwoordigt.',
                    correct: true,
                    explanation:
                        'De meest directe oplossing voor data-bias. Als de trainingsdata divers en representatief is, leert het model ook patronen die voor alle groepen gelden, niet alleen voor de meerderheid.',
                },
                {
                    id: 2,
                    icon: '👥',
                    title: 'Diverse ontwikkelteams samenstellen',
                    description:
                        'Zorg dat AI-ontwikkelteams bestaan uit mensen van verschillende genders, achtergronden en culturen.',
                    correct: true,
                    explanation:
                        'Diverse teams stellen andere vragen en zien andere risico\'s. Als het team homogeen is, worden bepaalde vormen van bias simpelweg niet opgemerkt tijdens het ontwerp en testen.',
                },
                {
                    id: 3,
                    icon: '⚡',
                    title: 'AI sneller en goedkoper maken',
                    description:
                        'Door de AI efficiënter te maken, kunnen meer organisaties het gebruiken.',
                    correct: false,
                    explanation:
                        'Snellere of goedkopere AI lost bias niet op — het kan het zelfs verspreiden als meer organisaties een bevooroordeeld systeem gebruiken. Schaalbaarheid zonder eerlijkheid vergroot het probleem.',
                },
                {
                    id: 4,
                    icon: '🧪',
                    title: 'AI testen op verschillende groepen voor uitrol',
                    description:
                        'Voordat een AI-systeem live gaat, wordt het getest op of het eerlijk werkt voor mensen van verschillende geslachten, leeftijden en achtergronden.',
                    correct: true,
                    explanation:
                        'Fairness audits zijn een standaardpraktijk geworden bij verantwoorde AI-ontwikkeling. Door gestructureerd te testen vind je bias voordat het systeem echte schade kan aanrichten.',
                },
                {
                    id: 5,
                    icon: '🔍',
                    title: 'Transparantie over hoe beslissingen worden genomen',
                    description:
                        'Organisaties die AI gebruiken voor beslissingen over mensen zijn verplicht uit te leggen hoe de AI tot een beslissing komt (explainability).',
                    correct: true,
                    explanation:
                        'Explainability is een kernvereiste van de EU AI Act voor hoog-risico AI. Als je niet kunt uitleggen waarom een AI een beslissing neemt, kun je ook niet controleren of het eerlijk is.',
                },
                {
                    id: 6,
                    icon: '🤖',
                    title: 'Alle beslissingen volledig aan de AI overlaten',
                    description:
                        'Door mensen uit het beslissingsproces te halen, vermijd je menselijke vooroordelen.',
                    correct: false,
                    explanation:
                        'Dit is een veelgemaakte denkfout. AI vervangt menselijke bias niet — het kan menselijke bias versterken en op grote schaal reproduceren. Menselijk toezicht is juist essentieel, zeker bij beslissingen die mensen raken.',
                },
                {
                    id: 7,
                    icon: '📜',
                    title: 'Wetgeving en externe audits voor hoog-risico AI',
                    description:
                        'Overheden verplichten organisaties die AI gebruiken voor consequente beslissingen (aannames, leningen, strafrechtspraak) om externe audits te ondergaan.',
                    correct: true,
                    explanation:
                        'De EU AI Act verplicht dit al voor hoog-risico AI. Externe controle is nodig omdat organisaties zelf belangen hebben om problemen te minimaliseren. Onafhankelijke audits brengen bias aan het licht.',
                },
                {
                    id: 8,
                    icon: '🗣️',
                    title: 'Getroffen groepen betrekken bij het ontwerpen van AI',
                    description:
                        'Mensen die het meest geraakt kunnen worden door een AI-systeem worden betrokken bij het ontwerp en de evaluatie ervan.',
                    correct: true,
                    explanation:
                        'Participatief ontwerp is een krachtige methode. De mensen die het risico lopen kennen de context van het probleem het beste. Hun perspectief onthult blinde vlekken die ontwikkelaars niet zien.',
                },
            ],
        },
    ],
};

export default config;
