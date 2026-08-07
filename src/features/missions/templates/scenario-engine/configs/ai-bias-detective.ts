import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'ai-bias-detective',
    title: 'AI Bias Detective',
    introEmoji: '🔎',
    introTitle: 'AI Bias Detective',
    introDescription:
        'AI-systemen leren van menselijke data — en die data is niet neutraal. Als de trainingsdata (= de voorbeelden waarvan een AI leert) scheef is, worden de resultaten ook scheef. Jij leert als AI Bias Detective herkennen wanneer een AI oneerlijk uitpakt voor bepaalde groepen mensen.',
    introFeatures: [
        'Herken vooroordelen in AI-systemen aan de hand van echte voorbeelden',
        'Rangschik AI-toepassingen van meest naar minst risicovol',
        'Ontdek: wanneer is een AI-resultaat scheef of eerlijk?',
        'Beoordeel welke oplossingen voor eerlijkere technologie écht werken',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'AI Eerlijkheidsexpert',
            color: '#ff3c21',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Bias Detective',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '📚',
            title: 'Goed Begonnen',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Blijf Oefenen',
            color: '#202023',
        },
    ],
    takeaways: [
        'AI is niet objectief — het leert van menselijke data en menselijke data bevat menselijke vooroordelen.',
        'Bias in AI kan iedereen treffen, maar treft mensen die al in een nadelige positie zitten onevenredig hard.',
        'Diverse trainingsdata en diverse ontwikkelteams helpen veel — maar niet altijd: soms zit de fout in wát je meet, niet in wie er in de data zit.',
        'Herkennen van bias is een vaardigheid die je kunt leren — je hoeft geen programmeur te zijn.',
        'Als AI wordt gebruikt voor beslissingen die mensen raken (aanname, leningen, straffen), moet er altijd menselijk toezicht zijn.',
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
                    title: 'Zorgalgoritme selecteert zwarte patiënten minder vaak voor extra zorg',
                    description:
                        'Een ziekenhuisalgoritme bepaalt wie er in een programma voor extra zorg komt. Zwarte patiënten worden minder vaak gekozen, ook als ze even ziek zijn.',
                    correct: true,
                    explanation:
                        'Dit is een gedocumenteerd geval uit de VS (onderzoek van Obermeyer en collega\'s, 2019). Het algoritme gebruikte zorgkosten als vervangende maatstaf voor gezondheidsbehoeften — maar zwarte patiënten hadden historisch minder zorg ontvangen (door ongelijkheid), dus werden als "minder ziek" geclassificeerd.',
                },
                {
                    id: 7,
                    icon: '📧',
                    title: 'Spamfilter blokkeert reclamemails',
                    description:
                        'Een e-mailprogramma verplaatst berichten met veel reclamewoorden automatisch naar de map ongewenst.',
                    correct: false,
                    explanation:
                        'Dit is geen bias. Het filter kijkt naar de inhoud van een bericht, niet naar wie de ontvanger is. Er wordt geen groep mensen anders behandeld dan een andere groep.',
                },
                {
                    id: 8,
                    icon: '📢',
                    title: 'Vacatures worden alleen aan jongere mensen getoond',
                    description:
                        'Een AI die vacatures verspreidt op social media, laat advertenties voor goedbetaalde banen vooral zien aan mensen onder de veertig.',
                    correct: true,
                    explanation:
                        'Dit is leeftijdsbias. Wie een vacature nooit te zien krijgt, kan er ook niet op solliciteren. De AI leerde dat jongere mensen vaker klikken en sluit daarmee oudere mensen systematisch uit van kansen. Bias gaat dus niet alleen over afkomst of gender.',
                },
                {
                    id: 9,
                    icon: '🧮',
                    title: 'Rekenmachine maakt een rekenfout',
                    description:
                        'Een rekenmachine rekent 2 + 2 = 5 door een softwarebug.',
                    correct: false,
                    explanation:
                        'Een rekenfout door een bug is geen bias — het is een technische fout. Bias gaat specifiek over systematische scheefheid die een groep mensen anders behandelt dan een andere groep.',
                },
                {
                    id: 10,
                    icon: '🗺️',
                    title: 'Navigatieapp stuurt vrachtwagens door woonwijken',
                    description:
                        'Een navigatieapp routeert zwaar vrachtverkeer consistent door smalle woonstraten in de armste wijken, terwijl duurdere wijken worden ontzien.',
                    correct: true,
                    explanation:
                        'Het algoritme belast wijken met lagere inkomens en minder politieke invloed structureel zwaarder dan rijkere wijken. Bewoners krijgen meer lawaai, uitstoot en onveilige straten, zonder dat iemand daarvoor gekozen heeft. Dat is algoritmische bias met sociale gevolgen.',
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
                    icon: '💼',
                    title: 'AI die sollicitaties filtert',
                    description:
                        'Een bedrijf filtert alle sollicitaties met een AI voordat een recruiter ze ziet. CV\'s van afgewezen kandidaten worden nooit door een mens bekeken.',
                    correctPosition: 2,
                    explanation:
                        'Risicovol. Bias betekent dat mensen systematisch worden uitgesloten van kansen. Maar de gevolgen zijn minder acuut dan gevangenisstraf of woningweigering — er zijn meer werkgevers.',
                },
                {
                    id: 2,
                    icon: '🛒',
                    title: 'AI die aanbevelingen doet in een webshop',
                    description:
                        'Een webshop AI beveelt producten aan op basis van eerder aankoopgedrag.',
                    correctPosition: 4,
                    explanation:
                        'Minst risicovolle bias. Als de AI je de verkeerde spijkerbroek aanbeveelt, is de schade beperkt. Wel kan prijsdiscriminatie op basis van algoritmen een serieuzer probleem zijn.',
                },
                {
                    id: 3,
                    icon: '⚖️',
                    title: 'AI die voorspelt of iemand opnieuw een misdrijf pleegt',
                    description:
                        'Rechters gebruiken een AI-systeem dat inschat hoe groot de kans is dat een verdachte opnieuw een misdrijf zal plegen. De uitkomst beïnvloedt strafmaat en vrijlating.',
                    correctPosition: 0,
                    explanation:
                        'Meest risicovol. Gebaseerd op COMPAS, een systeem dat in de VS echt is gebruikt. Onderzoekers vonden dat het bij zwarte verdachten vaker ten onrechte voorspelde dat ze in herhaling zouden vallen. Rechters lieten die score meewegen in hun beslissing — een fout kan hier iemands leven veranderen.',
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
                    icon: '🏦',
                    title: 'AI die leningaanvragen beoordeelt',
                    description:
                        'Een bank gebruikt AI om te besluiten of iemand een hypotheek of lening krijgt en tegen welke rente.',
                    correctPosition: 1,
                    explanation:
                        'Zeer risicovol. Leningen zijn levensbepalend — huis, studie, onderneming. Bias op basis van postcode, naam of etniciteit heeft grote financiële en sociale gevolgen die generaties meegaan.',
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
                    icon: '🏠',
                    title: 'AI toont minder dure huizen aan mensen met bepaalde achternamen',
                    description:
                        'Een huizenzoeksite laat automatisch minder dure woningen zien zodra de achternaam van de zoeker bij een bepaalde groep hoort.',
                    correct: false,
                    explanation:
                        'Dit is ernstige bias. De achternaam wordt gebruikt als vervangende maatstaf voor afkomst, waardoor mensen minder keuze te zien krijgen zonder dat ze het merken. Deze praktijk heeft een naam: redlining — vroeger werden hele wijken op een kaart aangewezen waar bewoners geen lening of verzekering konden krijgen. Een algoritme kan dat onbedoeld herhalen.',
                },
                {
                    id: 2,
                    icon: '📖',
                    title: 'AI beveelt Nederlandstalige boeken aan aan Nederlandstalige lezers',
                    description:
                        'Een bibliotheek-AI beveelt automatisch boeken in de voorkeurstaal van de lezer aan, gebaseerd op taalinstellingen.',
                    correct: true,
                    explanation:
                        'Dit is eerlijke personalisatie op basis van een relevante voorkeur (taal). Er wordt geen groep benadeeld — het systeem past zich aan aan de behoeften van de individuele gebruiker.',
                },
                {
                    id: 3,
                    icon: '💊',
                    title: 'Medisch AI dat doseringen adviseert op basis van lichaamsgewicht',
                    description:
                        'Een AI berekent medicijndoseringen op basis van het gewicht van de patiënt, zoals standaard in de geneeskunde.',
                    correct: true,
                    explanation:
                        'Dosering op basis van gewicht is medisch verantwoord en niet-discriminerend. Het is gebaseerd op een fysiologisch relevante variabele. Dit is correcte, eerlijke toepassing van data.',
                },
                {
                    id: 4,
                    icon: '🚓',
                    title: 'Politie-AI voorspelt criminaliteit op basis van postcodegebied',
                    description:
                        'Een AI-systeem stuurt politie naar buurten op basis van historische criminaliteitscijfers, wat zorgt voor meer controles in arme wijken.',
                    correct: false,
                    explanation:
                        'Dit is een voorbeeld van zelfrefererende bias: meer politie in een wijk → meer arrestaties → meer data die de wijk als "risicovol" bestempelt → nóg meer politie. Arme wijken worden systematisch zwaarder gecontroleerd dan rijke wijken.',
                },
                {
                    id: 5,
                    icon: '🎙️',
                    title: 'Spraakassistent verstaat mensen met een spraakbeperking veel slechter',
                    description:
                        'Een spraakassistent begrijpt de meeste mensen bijna altijd, maar wie stottert of moeilijk verstaanbaar praat, wordt vaak niet begrepen.',
                    correct: false,
                    explanation:
                        'Dit is bias op basis van beperking. De AI is vooral getraind op stemmen zonder spraakbeperking, dus wie anders klinkt, kan de technologie niet gebruiken. Juist mensen die het meeste baat hebben bij spraakbediening worden zo uitgesloten.',
                },
                {
                    id: 6,
                    icon: '🎮',
                    title: 'Game-AI past moeilijkheidsgraad aan op basis van jouw speelgedrag',
                    description:
                        'Een spelletjes-AI maakt het spel moeilijker als je te makkelijk wint en makkelijker als je het te moeilijk vindt.',
                    correct: true,
                    explanation:
                        'Dit is adaptieve technologie — de AI past zich aan om jouw ervaring beter te maken. Niemand wordt benadeeld op basis van een persoonskenmerk.',
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
                        'Een van de meest directe oplossingen voor data-bias. Als de trainingsdata divers en representatief is, leert het model ook patronen die voor alle groepen gelden, niet alleen voor de meerderheid. Let op: het helpt niet als de fout in de gekozen maatstaf zit, zoals bij het zorgalgoritme.',
                },
                {
                    id: 2,
                    icon: '🙈',
                    title: 'De AI geslacht en etniciteit helemaal niet meer laten zien',
                    description:
                        'Haal kenmerken als geslacht en etniciteit uit de data, zodat de AI er niet meer naar kan kijken.',
                    correct: false,
                    explanation:
                        'Klinkt logisch, maar het werkt niet. De AI vindt vervangende aanwijzingen: een postcode, een achternaam of een school zegt vaak al genoeg — precies wat er bij de huizenzoeksite gebeurt. Erger nog: als je die kenmerken niet meer meet, kun je ook niet meer controleren of een groep wordt benadeeld.',
                },
                {
                    id: 3,
                    icon: '👥',
                    title: 'Diverse ontwikkelteams samenstellen',
                    description:
                        'Zorg dat AI-ontwikkelteams bestaan uit mensen van verschillende genders, achtergronden en culturen.',
                    correct: true,
                    explanation:
                        'Diverse teams stellen andere vragen en zien andere risico\'s. Als het team homogeen is, worden bepaalde vormen van bias simpelweg niet opgemerkt tijdens het ontwerp en testen.',
                },
                {
                    id: 4,
                    icon: '⚡',
                    title: 'AI sneller en goedkoper maken',
                    description:
                        'Door de AI efficiënter te maken, kunnen meer organisaties het gebruiken.',
                    correct: false,
                    explanation:
                        'Snellere of goedkopere AI lost bias niet op — het kan het zelfs verspreiden als meer organisaties een bevooroordeeld systeem gebruiken. Schaalbaarheid zonder eerlijkheid vergroot het probleem.',
                },
                {
                    id: 5,
                    icon: '🧪',
                    title: 'AI testen op verschillende groepen voor uitrol',
                    description:
                        'Voordat een AI-systeem live gaat, wordt het getest op of het eerlijk werkt voor mensen van verschillende geslachten, leeftijden en achtergronden.',
                    correct: true,
                    explanation:
                        'Fairness audits zijn een standaardpraktijk geworden bij verantwoorde AI-ontwikkeling. Door gestructureerd te testen vind je bias voordat het systeem echte schade kan aanrichten.',
                },
                {
                    id: 6,
                    icon: '🔍',
                    title: 'Transparantie over hoe beslissingen worden genomen',
                    description:
                        'Organisaties die AI gebruiken voor belangrijke beslissingen over mensen (zoals een baan, een lening of zorg) moeten kunnen uitleggen hoe de AI tot die beslissing komt (explainability).',
                    correct: true,
                    explanation:
                        'Explainability is een kernvereiste van de EU AI Act voor hoog-risico AI. Als je niet kunt uitleggen waarom een AI een beslissing neemt, kun je ook niet controleren of het eerlijk is.',
                },
                {
                    id: 7,
                    icon: '➕',
                    title: 'Gewoon veel meer data verzamelen',
                    description:
                        'Verzamel zo veel mogelijk extra data, want hoe meer voorbeelden een AI ziet, hoe beter hij wordt.',
                    correct: false,
                    explanation:
                        'Méér van dezelfde scheve data verandert de scheefheid niet — het maakt het foute patroon alleen maar zekerder. Het gaat erom wélke data je verzamelt en wát je ermee meet, niet hoeveel.',
                },
                {
                    id: 8,
                    icon: '🤖',
                    title: 'Alle beslissingen volledig aan de AI overlaten',
                    description:
                        'Door mensen uit het beslissingsproces te halen, vermijd je menselijke vooroordelen.',
                    correct: false,
                    explanation:
                        'Dit is een veelgemaakte denkfout. AI vervangt menselijke bias niet — het kan menselijke bias versterken en op grote schaal reproduceren. Menselijk toezicht is juist essentieel, zeker bij beslissingen die mensen raken.',
                },
                {
                    id: 9,
                    icon: '📜',
                    title: 'Wetgeving en onafhankelijke controle voor hoog-risico AI',
                    description:
                        'Overheden stellen regels voor AI die zwaarwegende beslissingen beïnvloedt (aannames, leningen, strafrechtspraak) en laten die systemen controleren voordat ze gebruikt mogen worden.',
                    correct: true,
                    explanation:
                        'Regels en controle helpen echt. De EU AI Act legt de plicht bij de maker van een hoog-risico AI-systeem: die moet vóór gebruik aantonen dat het systeem gecontroleerd is. Meestal mag de maker die controle zelf uitvoeren; alleen bij de gevoeligste toepassingen, zoals gezichtsherkenning, moet een onafhankelijke instantie meekijken. Controle door een buitenstaander verplichten is dus een echte aanscherping, want een maker heeft er belang bij problemen klein te houden.',
                },
                {
                    id: 10,
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
