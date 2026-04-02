import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'cookie-crusher',
    title: 'Cookie Crusher',
    introEmoji: '🍪',
    introTitle: 'Cookie Crusher',
    introDescription:
        'Elke dag klikken miljoenen mensen op "Accepteer alles" zonder na te denken. Websites gebruiken slimme trucjes om je dat te laten doen. Jij leert die trucjes herkennen — en er slim mee omgaan.',
    introFeatures: [
        'Herken manipulatieve cookie-popups (dark patterns)',
        'Rangschik popups van meest naar minst manipulatief',
        'Oefen: accepteren of slim weigeren?',
        'Ontdek welke persoonlijke data op het spel staat',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Cookie Detective',
            color: '#D97757',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Privacy Waakzaam',
            color: '#10B981',
        },
        {
            minScore: 40,
            emoji: '📚',
            title: 'Goed Begonnen',
            color: '#6B6B66',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Blijf Oefenen',
            color: '#6B6B66',
        },
    ],
    takeaways: [
        'Dark patterns zijn ontwerptrucs om jou iets te laten doen wat je misschien niet wil.',
        '"Accepteer alles" is bijna nooit in jouw belang — het is in het belang van de website.',
        'Je hebt het wettelijke recht om cookies te weigeren. Dat mag nooit moeilijker zijn dan accepteren.',
        'Kleurcontrast, kleine letters en verborgen knoppen zijn de meestgebruikte manipulatietechnieken.',
        'Persoonsgegevens zoals jouw locatie, leeftijd en surfgedrag zijn geld waard voor adverteerders.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'dark-patterns',
            emoji: '🕵️',
            title: 'Herken de dark patterns',
            description:
                'Hieronder zie je acht beschrijvingen van cookie-popup ontwerpen. Welke zijn dark patterns — trucjes die jou manipuleren? Selecteer alle manipulatieve technieken.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed geselecteerd! Je herkent de trucjes die ontwerpers gebruiken om jou te sturen.',
            feedbackIncorrect:
                'Bijna! Sommige trucjes zijn subtiel. Lees de uitleg goed door.',
            items: [
                {
                    id: 1,
                    icon: '🎨',
                    title: 'Oranje knop vs. grijze tekst',
                    description:
                        '"Accepteer alles" staat in een grote oranje knop. "Weiger" staat als kleine grijze tekst eronder zonder knop.',
                    correct: true,
                    explanation:
                        'Dit is een classic dark pattern: de "goede" keuze voor de website krijgt alle aandacht. Jouw privacyvoorkeur wordt visueel weggepest.',
                },
                {
                    id: 2,
                    icon: '✅',
                    title: 'Vakjes vooraf aangevinkt',
                    description:
                        'Alle optionele cookie-categorieën staan al aangevinkt. Je moet actief uitvinken als je iets niet wil.',
                    correct: true,
                    explanation:
                        'Pre-checked boxes zijn verboden door de AVG voor opt-in toestemming. Echte toestemming is actief, niet passief.',
                },
                {
                    id: 3,
                    icon: '📋',
                    title: 'Drie duidelijke knoppen',
                    description:
                        'De popup heeft drie even grote knoppen: "Accepteer alles", "Stel in" en "Weiger alles".',
                    correct: false,
                    explanation:
                        'Dit is eerlijk! Drie gelijkwaardige opties geven jou een echte keuze. Zo hoort het te zijn.',
                },
                {
                    id: 4,
                    icon: '🔄',
                    title: '"Later instellen" verdwijnt na 3 seconden',
                    description:
                        'Er is een "later instellen"-optie, maar die verdwijnt automatisch na 3 tellen. De popup blijft staan totdat je accepteert.',
                    correct: true,
                    explanation:
                        'Dit heet confirmshaming of een countdown dark pattern. Ze maken weigeren tijdsgevoelig om je te laten schieten.',
                },
                {
                    id: 5,
                    icon: '🔍',
                    title: '"Weiger" in lettertype 9pt grijs op lichtgrijs',
                    description:
                        'De weigerknop bestaat, maar heeft zo weinig contrast dat je hem nauwelijks kunt lezen op het scherm.',
                    correct: true,
                    explanation:
                        'Slechte toegankelijkheid als opzettelijke strategie. De AVG eist dat weigeren net zo makkelijk is als accepteren.',
                },
                {
                    id: 6,
                    icon: '🛡️',
                    title: 'Popup legt uit welke cookies waarvoor dienen',
                    description:
                        'De popup beschrijft elke categorie cookies en waarvoor ze gebruikt worden, met een link naar het privacy­beleid.',
                    correct: false,
                    explanation:
                        'Transparantie is precies wat de wet vereist. Dit is eerlijk gedrag — geen dark pattern.',
                },
                {
                    id: 7,
                    icon: '😢',
                    title: '"Helaas, dan mis je gepersonaliseerde content"',
                    description:
                        'Als je op "weiger" klikt, verschijnt een tussenvenster met de tekst: "Jammer. Je mist nu aanbiedingen die speciaal voor jou zijn."',
                    correct: true,
                    explanation:
                        'Dit heet confirmshaming: de website probeert je schuldig te laten voelen voor je privacykeuze. Psychologische druk is manipulatie.',
                },
                {
                    id: 8,
                    icon: '🔁',
                    title: 'Popup keert elke dag terug',
                    description:
                        'Je hebt al een keer geweigerd, maar de website toont de popup elke dag opnieuw, in de hoop dat je uiteindelijk accepteert.',
                    correct: true,
                    explanation:
                        'Toestemming die al geweigerd is, mag je niet eindeloos opnieuw vragen. Dit is een slijtageaanval op je privacy.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'meest-manipulatief',
            emoji: '📊',
            title: 'Meest manipulatief eerst',
            description:
                'Rangschik deze vijf cookie-popup ontwerpen van meest manipulatief (1e) naar minst manipulatief (5e). Klik ze in die volgorde aan.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Sterke analyse! Je begrijpt welke ontwerptrucs de meeste psychologische druk uitoefenen.',
            feedbackIncorrect:
                'Goede poging. De volgorde heeft te maken met hoeveel psychologische druk en misleiding er in zit.',
            items: [
                {
                    id: 1,
                    icon: '🚫',
                    title: 'Geen weigerknop',
                    description:
                        'De popup heeft alleen een "Accepteer alles"-knop. Er is geen zichtbare manier om te weigeren of instellingen aan te passen.',
                    correctPosition: 0,
                    explanation:
                        'Meest manipulatief. Geen keuze = geen toestemming. Dit is illegaal onder de AVG maar komt nog steeds voor.',
                },
                {
                    id: 2,
                    icon: '😢',
                    title: 'Confirmshaming + countdown',
                    description:
                        'Weigeren geeft een schuldgevoel-bericht én de weigeroptie verdwijnt na 5 seconden.',
                    correctPosition: 1,
                    explanation:
                        'Combineert psychologische druk (schuldgevoel) met urgentie. Dubbele manipulatie.',
                },
                {
                    id: 3,
                    icon: '🎨',
                    title: 'Kleurcontrast-truc',
                    description:
                        '"Accepteer alles" in felle kleur, "Weiger" als bijna onzichtbare grijze tekst.',
                    correctPosition: 2,
                    explanation:
                        'Visuele hiërarchie wordt misbruikt om jou te sturen. Minder ernstig dan geen keuze, maar nog steeds manipulatief.',
                },
                {
                    id: 4,
                    icon: '🔁',
                    title: 'Dagelijkse herhaalde popup',
                    description:
                        'Je hebt al geweigerd, maar elke dag opnieuw verschijnt de popup.',
                    correctPosition: 3,
                    explanation:
                        'Slijtagedruk: ze hopen dat je op een dag gewoon accepteert. Minder direct, maar alsnog een manipulatieve tactiek.',
                },
                {
                    id: 5,
                    icon: '✅',
                    title: 'Drie gelijke knoppen, eerlijke tekst',
                    description:
                        '"Accepteer alles", "Stel in" en "Weiger alles" — even groot, even goed leesbaar, eerlijke uitleg.',
                    correctPosition: 4,
                    explanation:
                        'Minst manipulatief — dit is zoals het hoort. Eerlijke keuze, geen druk.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'accepteren-of-weigeren',
            emoji: '🤔',
            title: 'Accepteren of slim weigeren?',
            description:
                'Voor elk van deze scenario\'s: zou jij de cookies accepteren of weigeren? Er is niet altijd één goed antwoord — maar er is wel een slim antwoord.',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Slimme keuze! Je denkt na over wat je prijsgeeft.',
            feedbackIncorrect: 'Interessant. Bedenk: wat heeft de website aan jouw data?',
            items: [
                {
                    id: 1,
                    icon: '🏥',
                    title: 'Gezondheidswebsite',
                    description:
                        'Je zoekt informatie over hoofdpijn op een medische website. Ze vragen toestemming voor "gepersonaliseerde advertentiecookies".',
                    correct: false,
                    explanation:
                        'Weigeren is slim. Gezondheidsdata is extra gevoelig. Als je accepteert, kunnen adverteerders zien dat jij gezondheidsklachten zoekt. Dat willen verzekeringsmaatschappijen en werkgevers weleens weten.',
                },
                {
                    id: 2,
                    icon: '🎮',
                    title: 'Gratis spelletjessite',
                    description:
                        'Je wil een gratis online spel spelen. De site vraagt alleen functionele cookies (nodig voor het spel) en analytische cookies (hoe mensen de site gebruiken). Geen advertenties.',
                    correct: true,
                    explanation:
                        'Accepteren is hier redelijk. Functionele cookies zijn nodig. Anonieme analytische data helpt de site verbeteren. Er worden geen persoonsgegevens naar derden gestuurd.',
                },
                {
                    id: 3,
                    icon: '🛍️',
                    title: 'Webshop die je niet kent',
                    description:
                        'Je bekijkt een kleine webshop die je via een advertentie hebt gevonden. Ze vragen toestemming voor tracking-cookies van 47 externe partners.',
                    correct: false,
                    explanation:
                        'Weigeren. 47 externe partners is extreem. Jouw surfgedrag, locatie en aankoopinteresses worden dan gedeeld met tientallen bedrijven die je niet kent.',
                },
                {
                    id: 4,
                    icon: '📰',
                    title: 'Nieuwssite die je dagelijks leest',
                    description:
                        'Je favoriete nieuwssite vraagt cookies. Ze geven je de optie: betaal €2/maand OF accepteer gepersonaliseerde advertenties.',
                    correct: true,
                    explanation:
                        'Dit is een eerlijk model (ook wel "consent or pay"). Als je de site gratis wil gebruiken en vertrouwen hebt in hun privacy­beleid, is accepteren een bewuste keuze. Betalen is ook prima als je dat kunt.',
                },
                {
                    id: 5,
                    icon: '🏫',
                    title: 'Schoolplatform',
                    description:
                        'Je schoolplatform vraagt toestemming voor cookies. De popup heeft alleen een "Accepteer alles"-knop en geen weigeroptie.',
                    correct: false,
                    explanation:
                        'Geen weigeroptie = geen echte toestemming. Dit schoolplatform gedraagt zich illegaal. Meld dit aan je docent. Klik op "Accepteer alles" alleen als je geen andere keuze hebt om in te loggen.',
                },
                {
                    id: 6,
                    icon: '📱',
                    title: 'Social media app',
                    description:
                        'Een nieuwe sociale app vraagt cookies voor "een betere gebruikerservaring". Ze zijn vaag over wat dat betekent.',
                    correct: false,
                    explanation:
                        'Weigeren of voorzichtig zijn. "Betere gebruikerservaring" is een vage omschrijving. Als ze eerlijk waren, zouden ze precies zeggen wat ze bijhouden. Vaagheid is een waarschuwingssignaal.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'data-risico',
            emoji: '🔐',
            title: 'Welke data staat op het spel?',
            description:
                'Tracking-cookies kunnen veel meer bijhouden dan je denkt. Welke van deze categorieën persoonlijke data kunnen advertentiecookies verzamelen? Selecteer alles wat van toepassing is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Je weet nu precies wat er op het spel staat als je op "Accepteer alles" klikt.',
            feedbackIncorrect:
                'Tracking is uitgebreider dan de meeste mensen beseffen. Lees de uitleg goed.',
            items: [
                {
                    id: 1,
                    icon: '📍',
                    title: 'Jouw locatie',
                    description:
                        'Via je IP-adres en GPS-data (op mobiel) weten sites vaak in welke stad of straat je zit.',
                    correct: true,
                    explanation:
                        'Locatiedata is goud voor adverteerders. Ze weten of je op school zit, thuis, in een ziekenhuis, of in een winkel van de concurrent.',
                },
                {
                    id: 2,
                    icon: '⏰',
                    title: 'Hoe lang je ergens naar kijkt',
                    description:
                        'Cookies kunnen bijhouden hoeveel seconden je naar een product, artikel of afbeelding keek.',
                    correct: true,
                    explanation:
                        'Dwell time zegt iets over je interesses. Lang kijken naar een onderwerp = sterke interesse = hogere advertentieprijs.',
                },
                {
                    id: 3,
                    icon: '🎂',
                    title: 'Je exacte geboortedatum',
                    description:
                        'Als je die niet hebt ingevoerd op de website, kunnen cookies die niet achterhalen.',
                    correct: false,
                    explanation:
                        'Klopt — cookies kunnen niet zomaar data lezen die je niet hebt gegeven. Maar ze kunnen wel je leeftijd schatten op basis van je gedrag en andere data.',
                },
                {
                    id: 4,
                    icon: '🛒',
                    title: 'Wat je bijna kocht',
                    description:
                        'Als je een product in je winkelwagen legt maar niet afrekent, weet de site (en zijn partners) dat.',
                    correct: true,
                    explanation:
                        'Abandoned cart tracking is een van de meestgebruikte technieken. Daarna zie je overal advertenties voor dat product.',
                },
                {
                    id: 5,
                    icon: '🏥',
                    title: 'Welke ziekten je zoekt',
                    description:
                        'Als je op gezondheidswebsites zoekt naar symptomen of medicijnen, kan dat worden bijgehouden.',
                    correct: true,
                    explanation:
                        'Gezondheidsdata is bijzonder gevoelig. Verzekeringsmaatschappijen, werkgevers en databrokers zijn geïnteresseerd in ziekteprofielen.',
                },
                {
                    id: 6,
                    icon: '💬',
                    title: 'Wat je typt in privéberichten',
                    description:
                        'Cookies kunnen de inhoud van privéchats op andere apps lezen.',
                    correct: false,
                    explanation:
                        'Dit kunnen cookies niet. Privéberichten in apps zijn afgeschermd. Maar als je via een webinterface chat (zoals webmail), kan de site wel zien wat je typt.',
                },
                {
                    id: 7,
                    icon: '🌐',
                    title: 'Welke andere sites je bezoekt',
                    description:
                        'Via third-party tracking-pixels en cookies kunnen advertentienetwerken zien welke andere websites je bezoekt.',
                    correct: true,
                    explanation:
                        'Cross-site tracking is de kern van het advertentie-internet. Google en Meta hebben trackers op miljoenen websites. Zij zien een groot deel van je surfgedrag.',
                },
                {
                    id: 8,
                    icon: '🎵',
                    title: 'Jouw muzieksmaal',
                    description:
                        'Als je Spotify of YouTube via een browser gebruikt en cookies accepteert, kan dat worden bijgehouden.',
                    correct: true,
                    explanation:
                        'Muziek- en videosmaak zijn waardevolle signalen over leeftijd, cultuur en stemming. Adverteerders betalen meer voor specifieke doelgroepen.',
                },
            ],
        },
    ],
};

export default config;
