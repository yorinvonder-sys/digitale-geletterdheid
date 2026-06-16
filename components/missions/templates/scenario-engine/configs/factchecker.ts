import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'factchecker',
    title: 'Factchecker',
    introEmoji: '🔍',
    introTitle: 'Factchecker',
    introDescription:
        'Elke dag gaan er berichten viral die niet kloppen. Soms per ongeluk, soms met opzet. Als factchecker leer jij de methodes die journalisten gebruiken om de waarheid boven tafel te krijgen — voor je op "delen" klikt.',
    introFeatures: [
        'Herken het verschil tussen feit, mening en desinformatie',
        'Beoordeel bronnen met de CRAAP-methode',
        'Rangschik berichten van meest naar minst betrouwbaar',
        'Oefen: wanneer deel je iets wél en wanneer niet?',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Master Factchecker',
            color: '#D97706',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Kritische Lezer',
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
        'Twijfelen is een superkracht — een sceptische lezer is moeilijker te misleiden dan een gelovige.',
        'Controleer altijd wie de auteur is en wat zijn belang kan zijn bij een bericht.',
        'Één bron is geen bewijs. Pas als meerdere onafhankelijke bronnen iets bevestigen, is het aannemelijk waar.',
        'Een clickbait-kop ("Dit gelooft u nooit!") is zelden een teken van betrouwbare journalistiek.',
        'Emotie in een bericht — woede, angst, verbazing — is een signaal om extra kritisch te zijn, niet om meteen te delen.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'feit-of-nep',
            emoji: '🚩',
            title: 'Herken de rode vlaggen',
            description:
                'Welke kenmerken hieronder zijn signalen dat een bericht mogelijk onbetrouwbaar of desinformatie is? Selecteer alles wat van toepassing is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je herkent de trucjes die misleidende content herkenbaar maken.',
            feedbackIncorrect:
                'Sommige signalen zijn subtiel. Lees de uitleg — desinformatie is goed gecamoufleerd.',
            items: [
                {
                    id: 1,
                    icon: '😱',
                    title: 'Kop: "Dit wil de overheid NIET dat u weet!"',
                    description:
                        'Een artikel heeft een sensationele kop die suggereert dat er geheimen worden verborgen.',
                    correct: true,
                    explanation:
                        'Sensatiekoppen zijn een klassiek clickbait-signaal. Echte journalisten schrijven feitelijke koppen. "Wat ze niet willen dat je weet" is een manipulatietechniek die wantrouwen tegen instituties aanwakkert.',
                },
                {
                    id: 2,
                    icon: '📰',
                    title: 'Artikel gepubliceerd op nu.nl',
                    description:
                        'Een nieuwsbericht is gepubliceerd op nu.nl, een van de grootste Nederlandse nieuwswebsites.',
                    correct: false,
                    explanation:
                        'Nu.nl is een gevestigde nieuwssite met een redactie. Dat garandeert geen perfectie, maar het is een betrouwbaardere bron dan een onbekende website. Domein alleen is niet voldoende om een bericht als nep af te doen.',
                },
                {
                    id: 3,
                    icon: '📅',
                    title: 'Artikel uit 2016, gedeeld alsof het nieuws is',
                    description:
                        'Een artikel van zes jaar oud wordt opnieuw gedeeld op sociale media met de tekst "dit is wat er nu aan de hand is".',
                    correct: true,
                    explanation:
                        'Oud nieuws dat als actueel wordt gepresenteerd is een veelgebruikte misleidingstechniek. Controleer altijd de datum van een bericht voordat je het deelt.',
                },
                {
                    id: 4,
                    icon: '✍️',
                    title: 'Geen auteursnaam vermeld',
                    description:
                        'Een opiniestuk op een website heeft geen naam van een auteur of organisatie bij het artikel.',
                    correct: true,
                    explanation:
                        'Anonimiteit is een waarschuwingssignaal. Wie is er verantwoordelijk voor de bewering? Betrouwbare media vermelden altijd wie er achter een stuk staat.',
                },
                {
                    id: 5,
                    icon: '🔗',
                    title: 'Artikel linkt naar primaire bronnen',
                    description:
                        'Een artikel over een wetenschappelijk onderzoek linkt naar het originele onderzoek in een wetenschappelijk tijdschrift.',
                    correct: false,
                    explanation:
                        'Links naar primaire bronnen zijn een teken van goede journalistiek. Het maakt het voor de lezer mogelijk om de bron zelf te controleren — dat is transparantie, geen verdacht gedrag.',
                },
                {
                    id: 6,
                    icon: '🌐',
                    title: 'Website-adres eindigt op ".info" of ".net" met rare naam',
                    description:
                        'Een artikel staat op "echnieuws-nederland-info.net" — geen bekende nieuwsorganisatie.',
                    correct: true,
                    explanation:
                        'Onbekende websites met generieke of vreemde namen zijn een risico. Iedereen kan een website starten en het "nieuws" noemen. Betrouwbare media hebben een herkenbare naam en redactie.',
                },
                {
                    id: 7,
                    icon: '😡',
                    title: 'Bericht wekt sterke woede of verontwaardiging op',
                    description:
                        'Een post op sociale media is zo geschreven dat je er erg boos van wordt — het is emotioneel geladen.',
                    correct: true,
                    explanation:
                        'Emotioneel geladen taal is een signaal om extra kritisch te zijn. Desinformatie is vaak ontworpen om emoties te triggeren, omdat woede en angst ervoor zorgen dat mensen minder nadenken en meer delen.',
                },
                {
                    id: 8,
                    icon: '📊',
                    title: 'Grafiek zonder bronvermelding',
                    description:
                        'Een bericht bevat een grafiek die een dramatische trend toont, maar er staat nergens vermeld waar de data vandaan komt.',
                    correct: true,
                    explanation:
                        'Grafieken zonder bron zijn makkelijk te vervalsen. Controleer altijd: wie heeft deze data verzameld? Klopt de schaal? Data visualisaties kunnen misleidend zijn zonder goede context.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'meest-betrouwbaar',
            emoji: '📊',
            title: 'Meest betrouwbare bron eerst',
            description:
                'Rangschik deze vijf bronnen van meest betrouwbaar (1e) naar minst betrouwbaar (5e) voor een claim over een nieuw medicijn.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Uitstekend! Je begrijpt de hiërarchie van bronbetrouwbaarheid.',
            feedbackIncorrect:
                'Denk aan: wie heeft de data? Wie heeft belangen? Wie heeft een peer review gehad?',
            items: [
                {
                    id: 1,
                    icon: '🔬',
                    title: 'Peer-reviewed wetenschappelijk artikel',
                    description:
                        'Een studie gepubliceerd in The Lancet (een toonaangevend medisch tijdschrift), geschreven door universitaire onderzoekers, gecontroleerd door andere wetenschappers.',
                    correctPosition: 0,
                    explanation:
                        'Meest betrouwbaar. Peer review betekent dat andere experts het onderzoek hebben gecontroleerd op fouten en methodologie. Dit is de gouden standaard voor wetenschappelijke claims.',
                },
                {
                    id: 2,
                    icon: '🏛️',
                    title: 'Bericht van het RIVM of rijksoverheid.nl',
                    description:
                        'Een officieel persbericht van het Rijksinstituut voor Volksgezondheid en Milieu over de effectiviteit van het medicijn.',
                    correctPosition: 1,
                    explanation:
                        'Overheidsinstanties zijn verantwoordelijk voor de informatie die ze publiceren. Ze baseren zich op wetenschappelijk consensus en zijn gehouden aan openbaarheidsprincipes.',
                },
                {
                    id: 3,
                    icon: '📰',
                    title: 'Artikel van NOS of NRC',
                    description:
                        'Een nieuwsartikel van de NOS of NRC dat de wetenschappelijke studie bespreekt en experts citeert.',
                    correctPosition: 2,
                    explanation:
                        'Gerenommeerde journalistieke media controleren hun bronnen, citeren experts en corrigeren fouten. Betrouwbaar, maar niet het primaire bewijs zelf — ze interpreteren de wetenschap.',
                },
                {
                    id: 4,
                    icon: '👩‍⚕️',
                    title: 'Blog van een arts',
                    description:
                        'Een opinieblog geschreven door een arts die zegt positieve ervaringen te hebben met het medicijn.',
                    correctPosition: 3,
                    explanation:
                        'Eén expert is geen bewijs. Ervaringen van één arts kunnen afwijken van de wetenschappelijke consensus. Interessant als aanvulling, maar niet voldoende als primaire bron.',
                },
                {
                    id: 5,
                    icon: '📱',
                    title: 'TikTok-video van een ervaringsdeskundige',
                    description:
                        'Een persoon beschrijft in een TikTok hoe het medicijn hem heeft geholpen en raadt het iedereen aan.',
                    correctPosition: 4,
                    explanation:
                        'Minst betrouwbaar voor medische claims. Persoonlijke ervaringen zijn geen wetenschappelijk bewijs. Placebo-effecten, toevalligheid en gebrek aan controlegroep maken anekdotes onbetrouwbaar als bewijs.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'delen-of-niet',
            emoji: '🤔',
            title: 'Delen of niet?',
            description:
                'Je ziet dit bericht op sociale media. Zou jij het delen? Denk goed na voor je beslist.',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Goede keuze! Je denkt na voor je deelt.',
            feedbackIncorrect: 'Lastig. Soms lijkt een bericht betrouwbaar maar is het dat niet. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '🌡️',
                    title: '"Heet water drinken geneest COVID"',
                    description:
                        'Een WhatsApp-bericht dat viral gaat: "Artsen in China hebben ontdekt dat heet water drinken het coronavirus doodt. Stuur dit door!" Geen bron vermeld.',
                    correct: false,
                    explanation:
                        'Niet delen. Geen bron, klinisch onmogelijk claim, en de urgentie om het door te sturen is een manipulatietechniek. Dit is een klassiek voorbeeld van gezondheidsdesinformatie.',
                },
                {
                    id: 2,
                    icon: '🌊',
                    title: 'NOS: "Dijkdoorbraak verwacht bij storm"',
                    description:
                        'De NOS publiceert een artikel over verhoogde overstromingsrisico\'s in een regio. Je woont in de buurt en wil vrienden waarschuwen.',
                    correct: true,
                    explanation:
                        'Delen is verstandig. De NOS is een betrouwbare bron met redactionele controle. Veiligheidsinformatie van gerenommeerde media delen is nuttig en verantwoord.',
                },
                {
                    id: 3,
                    icon: '📸',
                    title: 'Foto van verwoest gebied "na de aardbeving"',
                    description:
                        'Na een nieuwsbericht over een aardbeving verspreidt een foto zich snel op sociale media. De foto zou de schade tonen. Je hebt de foto alleen via een onbekend account gezien.',
                    correct: false,
                    explanation:
                        'Niet zomaar delen. Foto\'s worden regelmatig hergebruikt uit een andere context. Doe eerst een reverse image search (via Google Images) om te controleren of de foto echt is.',
                },
                {
                    id: 4,
                    icon: '🏫',
                    title: 'Schoolkrant over roosterwijziging',
                    description:
                        'De officiële schoolkrant publiceert een artikel over een roosterwijziging volgende week. Je wil het delen in de klassengroepsapp.',
                    correct: true,
                    explanation:
                        'Prima om te delen. Het komt van een directe, betrouwbare bron (de school zelf). Praktische schoolinformatie is precies het soort content dat nuttig is om te delen.',
                },
                {
                    id: 5,
                    icon: '🎭',
                    title: '"Bekende persoon opgepakt" — van satirische site',
                    description:
                        'Een artikel met een schokkende kop verschijnt over een bekende politicus. Onderaan de pagina staat in kleine letters: "Dit is een satirische website."',
                    correct: false,
                    explanation:
                        'Niet delen als nieuws. Satire is een kunstvorm, maar als je het deelt zonder de context te vermelden, misleid je anderen. Als je het grappig vindt, deel het dan mét de context: "Dit is satire van De Speld."',
                },
                {
                    id: 6,
                    icon: '🔬',
                    title: 'Wetenschappelijke doorbraak: "één studie, voorlopige resultaten"',
                    description:
                        'Een artikel beschrijft een veelbelovend wetenschappelijk resultaat, maar vermeldt ook: "Dit is een kleine pilotstudie met 12 deelnemers. Meer onderzoek is nodig."',
                    correct: false,
                    explanation:
                        'Wacht met delen. Een pilotstudie is begin van onderzoek, geen bewijs. Veel wetenschappelijke "doorbraken" in de media blijken later niet te worden bevestigd door groter onderzoek. Vermeld altijd de nuance als je het toch deelt.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'craap-methode',
            emoji: '🧪',
            title: 'De CRAAP-methode toepassen',
            description:
                'De CRAAP-methode helpt je een bron te beoordelen: Currency (hoe oud?), Relevance (past het?), Authority (wie zegt het?), Accuracy (klopt het?), Purpose (waarom?). Welke vragen horen bij de CRAAP-methode? Selecteer ze.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je kent de CRAAP-vragen en kunt ze nu zelf toepassen op elke bron.',
            feedbackIncorrect:
                'Sommige vragen klinken logisch maar horen niet bij kritische bronbeoordeling. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '📅',
                    title: '"Wanneer is dit gepubliceerd en is het nog actueel?"',
                    description:
                        'Je controleert de datum van het artikel en of de informatie nog up-to-date is.',
                    correct: true,
                    explanation:
                        'Currency-vraag. Informatie veroudert snel, zeker bij wetenschap, politiek en gezondheid. Een artikel uit 2010 over AI is al volledig achterhaald.',
                },
                {
                    id: 2,
                    icon: '👍',
                    title: '"Hoeveel likes heeft dit bericht?"',
                    description:
                        'Je kijkt hoeveel likes, shares of reacties een post heeft als maatstaf voor de betrouwbaarheid.',
                    correct: false,
                    explanation:
                        'Likes zijn geen indicator van betrouwbaarheid. Desinformatie verspreidt zich juist snel omdat het emotioneel is. Een bericht met 50.000 likes kan compleet onjuist zijn.',
                },
                {
                    id: 3,
                    icon: '👤',
                    title: '"Wie is de auteur en wat zijn zijn of haar kwalificaties?"',
                    description:
                        'Je zoekt op wie het artikel heeft geschreven en of die persoon expertise heeft over het onderwerp.',
                    correct: true,
                    explanation:
                        'Authority-vraag. Een arts die schrijft over medicijnen is geloofwaardiger dan een blogger zonder relevante achtergrond. Maar pas op: ook experts kunnen het mis hebben.',
                },
                {
                    id: 4,
                    icon: '🎯',
                    title: '"Past deze informatie bij mijn onderzoeksvraag?"',
                    description:
                        'Je controleert of de bron echt gaat over het onderwerp dat je onderzoekt.',
                    correct: true,
                    explanation:
                        'Relevance-vraag. Een betrouwbaar artikel over een ander onderwerp helpt je niet. Relevantie is een basischeck voordat je een bron gebruikt.',
                },
                {
                    id: 5,
                    icon: '💰',
                    title: '"Verdient de website geld met advertenties?"',
                    description:
                        'Je kijkt of een website advertentie-inkomsten heeft als primaire financieringsbron.',
                    correct: false,
                    explanation:
                        'Advertentie-inkomsten alléén zijn geen indicator van onbetrouwbaarheid. Nu.nl en NOS.nl gebruiken ook advertenties. Het gaat meer om: heeft de financieringsbron invloed op de inhoud?',
                },
                {
                    id: 6,
                    icon: '🎭',
                    title: '"Waarom is dit geschreven — informeren, overtuigen of verkopen?"',
                    description:
                        'Je vraagt je af wat het doel is van de auteur: neutrale informatie, overtuigen of een product verkopen?',
                    correct: true,
                    explanation:
                        'Purpose-vraag. Een artikel op een farmaceutisch bedrijfswebsite over hun eigen medicijn heeft een belang. Dat maakt het niet automatisch onwaar, maar het betekent dat je extra kritisch moet zijn.',
                },
                {
                    id: 7,
                    icon: '🔗',
                    title: '"Worden claims ondersteund door andere bronnen?"',
                    description:
                        'Je zoekt naar andere onafhankelijke bronnen die dezelfde claim bevestigen.',
                    correct: true,
                    explanation:
                        'Accuracy-vraag. Als meerdere onafhankelijke bronnen iets bevestigen, is de kans groter dat het klopt. "Onafhankelijk" is key: bronnen die allemaal uit dezelfde originele bron putten tellen als één.',
                },
                {
                    id: 8,
                    icon: '✅',
                    title: '"Klopt de spellings- en grammaticacontrole?"',
                    description:
                        'Je beoordeelt de taalverzorging van het artikel als indicator van betrouwbaarheid.',
                    correct: false,
                    explanation:
                        'Moderne AI-tools kunnen foutloze teksten genereren. Taalverzorging is niet meer een betrouwbare indicator. Goed geschreven desinformatie bestaat. Focus op de inhoud, niet de vorm.',
                },
            ],
        },
    ],
};

export default config;
