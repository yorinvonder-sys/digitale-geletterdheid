import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'online-helden',
    title: 'Online Helden & Helpers',
    introEmoji: '🦸',
    introTitle: 'Online Helden & Helpers',
    introDescription:
        'Cyberpesten speelt zich af op platforms die jij elke dag gebruikt. Het is niet altijd duidelijk wanneer iets écht pesten is — en wat jij daarin kunt doen. In deze missie leer je patronen herkennen, situaties beoordelen en kiezen hoe jij reageert als bijstander.',
    introFeatures: [
        'Herken cyberpesten in echte situaties op echte platforms',
        'Ontdek welke bijstander-acties echt werken',
        'Rangschik online gedrag van meest naar minst schadelijk',
        'Bouw inzicht op om zelf te kiezen hoe jij optreedt',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🦸',
            title: 'Online Held',
            color: '#6366F1',
        },
        {
            minScore: 60,
            emoji: '🛡️',
            title: 'Actieve Helper',
            color: '#10B981',
        },
        {
            minScore: 40,
            emoji: '👀',
            title: 'Waakzame Bijstander',
            color: '#F59E0B',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Blijf Oefenen',
            color: '#6B6B66',
        },
    ],
    takeaways: [
        'Cyberpesten is niet altijd luid en zichtbaar — uitsluiten, negeren en subtiele "grapjes" zijn net zo schadelijk.',
        'Als bijstander heb je meer invloed dan je denkt: één privébericht naar het slachtoffer kan het verschil maken.',
        'Meedoen aan pesten — ook door lachen of liken — versterkt het gedrag van de pester.',
        'Screenshot bewaren als bewijs, melden bij platform en volwassene inschakelen zijn concrete acties die werken.',
        'Openbaar terechtwijzen helpt zelden — het kan de situatie juist verergeren of het slachtoffer verder in de spotlight zetten.',
    ],
    rounds: [
        // ── RONDE 1: binary-choice ────────────────────────────────────────────────
        {
            id: 'is-dit-cyberpesten',
            emoji: '🔍',
            title: 'Is dit cyberpesten?',
            description:
                'Bekijk elke situatie en beoordeel: is dit cyberpesten, of valt dit binnen normaal online gedrag? Sommige gevallen zijn bewust subtiel.',
            type: 'binary-choice',
            maxScore: 30,
            feedbackCorrect:
                'Goed beoordeeld! Cyberpesten heeft veel gezichten — ook subtiele vormen tellen mee.',
            feedbackIncorrect:
                'Niet helemaal. Let goed op herhaling, opzet en de impact op de ander — die bepalen samen of iets pesten is.',
            items: [
                {
                    id: 1,
                    icon: '💬',
                    title: 'Steeds als laatste',
                    description:
                        'In de WhatsApp-groep van de klas wordt elke dag gevraagd wie er mee wil naar school. Iedereen reageert, behalve op berichten van Lara. Haar berichten worden consistent genegeerd.',
                    correct: true,
                    explanation:
                        'Dit is cyberpesten door uitsluiting. Het is geen per ongeluk — het patroon herhaalt zich elke dag. Uitsluiten online is net zo pijnlijk als fysiek buitengesloten worden.',
                },
                {
                    id: 2,
                    icon: '📸',
                    title: 'Screenshot gedeeld',
                    description:
                        'Daan maakt een screenshot van een privébericht dat Sofie hem stuurde en deelt het in de klasgroep op Instagram zonder haar toestemming.',
                    correct: true,
                    explanation:
                        'Een privébericht zonder toestemming delen is een schending van vertrouwen én privacy. Als dit bedoeld is om Sofie voor gek te zetten of te kwetsen, is het cyberpesten.',
                },
                {
                    id: 3,
                    icon: '🎮',
                    title: 'Comment in een discussie',
                    description:
                        'Onder een YouTube-video zijn twee mensen het oneens over een film. Ze wisselen stevige meningen uit, maar blijven bij het onderwerp.',
                    correct: false,
                    explanation:
                        'Oneens zijn en discussiëren is normaal online gedrag. Zolang het over het onderwerp gaat en niet over de persoon, is dit geen pesten.',
                },
                {
                    id: 4,
                    icon: '😂',
                    title: 'Het "grapje" dat herhaalt',
                    description:
                        'In de Discord-server van de klas maakt iedereen al weken grapjes over hoe Noah zijn naam uitspreekt. Noah heeft meerdere keren aangegeven dat hij het vervelend vindt. Ze gaan door.',
                    correct: true,
                    explanation:
                        'Zodra iemand aangeeft dat iets hem kwetst en het gaat gewoon door, is het geen grapje meer. Herhaling na een "stop"-signaal is een kenmerk van pesten.',
                },
                {
                    id: 5,
                    icon: '👻',
                    title: 'Niet terugvolgen',
                    description:
                        'Emma volgt haar vroegere vriendin Maya niet terug op Instagram nadat Maya haar was gaan volgen. Ze sturen elkaar ook geen DMs.',
                    correct: false,
                    explanation:
                        'Iemand niet terugvolgen is normaal. Online vriendschappen evolueren. Dit is geen pesten, tenzij het deel uitmaakt van een groter patroon van bewust uitsluiten.',
                },
                {
                    id: 6,
                    icon: '📱',
                    title: 'TikTok zonder toestemming',
                    description:
                        'Yusuf filmt zijn klasgenoot Finn op school terwijl Finn iets gênants doet, post de video op TikTok en tag de school. De video gaat viral in de buurt.',
                    correct: true,
                    explanation:
                        'Een video posten die iemand in verlegenheid brengt zonder toestemming is een ernstige vorm van cyberpesten. Het publieke bereik maakt de schade groter.',
                },
                {
                    id: 7,
                    icon: '🗣️',
                    title: 'Constructieve kritiek',
                    description:
                        'Roos plaatst haar tekening online en vraagt om feedback. Een reactie zegt: "De compositie werkt niet goed, probeer meer ruimte links te laten." Roos vindt het niet leuk om te lezen.',
                    correct: false,
                    explanation:
                        'Eerlijke feedback, ook als die pijn doet, is geen pesten. Pijn voelen bij kritiek is menselijk — maar de intentie hier is helpen, niet kwetsen.',
                },
                {
                    id: 8,
                    icon: '🔁',
                    title: 'Doorgestuurd gerucht',
                    description:
                        'Er gaat een Snapchat-bericht rond in de klas: "Heb je gehoord van Lena?" Het bericht bevat iets over haar privéleven dat niet klopt. Het wordt al dagenlang doorgestuurd.',
                    correct: true,
                    explanation:
                        'Geruchten verspreiden via doorsturen is een indirecte vorm van cyberpesten. Het speelt in op de groepsdruk en kan iemands reputatie flink beschadigen.',
                },
            ],
        },

        // ── RONDE 2: select-correct ───────────────────────────────────────────────
        {
            id: 'wat-doe-jij',
            emoji: '🦸',
            title: 'Wat doe jij?',
            description:
                'In elk scenario sta jij aan de zijlijn. Welke bijstander-acties zijn effectief? Selecteer de acties die écht helpen. Let op: niet elk scenario heeft hetzelfde juiste antwoord.',
            type: 'select-correct',
            maxScore: 40,
            feedbackCorrect:
                'Goede keuze. Bijstaan hoeft niet dramatisch te zijn — kleine acties maken al een verschil.',
            feedbackIncorrect:
                'Bijna. Denk na over wat de impact is op het slachtoffer en de pester — en of de actie de situatie erger kan maken.',
            items: [
                {
                    id: 1,
                    icon: '💬',
                    title: 'Privébericht sturen',
                    description:
                        'Iemand wordt in de klasgroep uitgelachen. Jij stuurt het slachtoffer een DM: "Ik vind dit niet oké. Gaat het?"',
                    correct: true,
                    explanation:
                        'Privé steun bieden is een van de meest effectieve bijstander-acties. Het doorbreekt de isolatie van het slachtoffer zonder publiek conflict te veroorzaken.',
                },
                {
                    id: 2,
                    icon: '😐',
                    title: 'Niets doen',
                    description:
                        'Je ziet dat een klasgenoot online gepest wordt, maar mengt je er niet in. Je denkt: "Het gaat me niet aan."',
                    correct: false,
                    explanation:
                        'Niets doen versterkt het probleem. Passief toekijken geeft de pester het signaal dat het gedrag geaccepteerd wordt. Bijstanders die niets doen maken het erger.',
                },
                {
                    id: 3,
                    icon: '📲',
                    title: 'Melden bij het platform',
                    description:
                        'Er wordt een video van een klasgenoot gepost die hem voor schut zet. Jij meldt de video via de rapporteerknop.',
                    correct: true,
                    explanation:
                        'Content melden bij het platform is concreet en anoniem. Platforms verwijderen schadelijke content — dit beschermt het slachtoffer zonder directe confrontatie.',
                },
                {
                    id: 4,
                    icon: '😂',
                    title: 'Meedoen met lachen',
                    description:
                        'Een klassikale groepschat staat vol grapjes ten koste van iemand. Jij stuurt ook een lachende emoji mee.',
                    correct: false,
                    explanation:
                        'Meedoen — ook alleen met een emoji — versterkt het gedrag van de pester en vergroot de sociale druk op het slachtoffer. Een lachende emoji is geen neutrale actie.',
                },
                {
                    id: 5,
                    icon: '📷',
                    title: 'Screenshot bewaren',
                    description:
                        'Je ziet berichten waarmee iemand bedreigd wordt. Jij maakt screenshots voordat de berichten verwijderd worden.',
                    correct: true,
                    explanation:
                        'Bewijs bewaren is cruciaal. Pesters verwijderen hun berichten vaak snel. Screenshots zijn nodig voor een melding bij een volwassene of de school.',
                },
                {
                    id: 6,
                    icon: '📢',
                    title: 'Openbaar reageren',
                    description:
                        'In de klasgroep wordt iemand gepest. Jij reageert openbaar: "Dit is echt zielig van jullie, stop hiermee!"',
                    correct: false,
                    explanation:
                        'Openbaar terechtwijzen werkt zelden. Het kan leiden tot groepsdruk tegen jou, of het slachtoffer nog meer in de spotlight zetten. Privé of via een volwassene werkt beter.',
                },
                {
                    id: 7,
                    icon: '👨‍🏫',
                    title: 'Volwassene inschakelen',
                    description:
                        'Iemand uit jouw klas wordt al weken online gepest. Jij vertelt het aan een vertrouwde docent of mentor.',
                    correct: true,
                    explanation:
                        'Een volwassene inschakelen is moedig en effectief, zeker bij herhaald of ernstig pesten. Docenten kunnen structureel ingrijpen op een manier die jij niet kunt.',
                },
                {
                    id: 8,
                    icon: '🔗',
                    title: 'De link verder delen',
                    description:
                        'Er staat een gênante foto van iemand online. Een vriend vraagt of jij de link doorstuurt. Je denkt: "Ik heb hem niet gepost, ik deel hem alleen."',
                    correct: false,
                    explanation:
                        'Doorsturen is deelnemen. Elke keer dat iemand de link deelt, vergroot het bereik en de schade voor het slachtoffer. "Ik heb het niet gemaakt" is geen excuus.',
                },
            ],
        },

        // ── RONDE 3: order-priority ───────────────────────────────────────────────
        {
            id: 'rangschik-impact',
            emoji: '📊',
            title: 'Rangschik de impact',
            description:
                'Rangschik deze acht online acties van meest schadelijk (1e) naar minst schadelijk (8e). Sommige "kleine" dingen zijn schadelijker dan ze op het eerste gezicht lijken.',
            type: 'order-priority',
            maxScore: 30,
            feedbackCorrect:
                'Sterke analyse. Je begrijpt dat schade niet altijd zichtbaar is — sociale uitsluiting en reputatieschade zijn net zo erg als expliciete bedreigingen.',
            feedbackIncorrect:
                'Goed geprobeerd. Denk na over permanentie, bereik en de kwetsbaarheid van het slachtoffer — die bepalen samen hoe groot de schade is.',
            items: [
                {
                    id: 1,
                    icon: '📍',
                    title: 'Iemands adres online zetten',
                    description:
                        'Het thuisadres of routebeschrijving van een klasgenoot posten op een publiek platform, bedoeld als bedreiging.',
                    correctPosition: 0,
                    explanation:
                        'Meest schadelijk. Dit heet doxxing. Het brengt de fysieke veiligheid van iemand in gevaar en kan angst, stalking en geweld veroorzaken. Dit is ook strafbaar.',
                },
                {
                    id: 2,
                    icon: '👤',
                    title: 'Nep-account aanmaken',
                    description:
                        'Een nep-Instagram aanmaken op naam van een klasgenoot en daarmee beschamende dingen posten alsof zij het zelf zegt.',
                    correctPosition: 1,
                    explanation:
                        'Identiteitsfraude en reputatieschade. Het slachtoffer verliest controle over haar eigen naam en imago. De schade is moeilijk terug te draaien.',
                },
                {
                    id: 3,
                    icon: '📹',
                    title: 'Gênante video viraal laten gaan',
                    description:
                        'Een video van een klasgenoot in een kwetsbare situatie — zonder toestemming gepost — wordt honderden keren gedeeld.',
                    correctPosition: 2,
                    explanation:
                        'Virale verspreiding maakt schade permanent. De video blijft online circuleren, ook lang na de schooltijd. Het bereik vergroot het trauma.',
                },
                {
                    id: 4,
                    icon: '💬',
                    title: 'Geruchten verspreiden via doorsturen',
                    description:
                        'Een vals gerucht over iemands privéleven wordt wekenlang doorgestuurd in klasgroepen.',
                    correctPosition: 3,
                    explanation:
                        'Reputatieschade door geruchten kan net zo diep snijden als directe beledigingen. Het is moeilijk te weerleggen als het al breed verspreid is.',
                },
                {
                    id: 5,
                    icon: '🔇',
                    title: 'Steeds gemute of gekickt worden',
                    description:
                        'In een Discord-server wordt één persoon stelselmatig gemute, de mic gezet of uit voice-kanalen gekickt door de groep.',
                    correctPosition: 4,
                    explanation:
                        'Sociale uitsluiting via technologie is cyberpesten. Het effect lijkt kleiner dan een virale video, maar de dagelijkse herhaling maakt de impact groot.',
                },
                {
                    id: 6,
                    icon: '😂',
                    title: 'Liken van pestberichten',
                    description:
                        'Berichten die een klasgenoot belachelijk maken krijgen tientallen likes van klasgenoten die er verder niets mee doen.',
                    correctPosition: 5,
                    explanation:
                        'Liken is niet neutraal. Het versterkt het gedrag van de pester en geeft het slachtoffer het gevoel dat de klas achter de pester staat. Zichtbare goedkeuring vergroot de pijn.',
                },
                {
                    id: 7,
                    icon: '🔕',
                    title: 'Iemand niet terugvolgen na een breuk',
                    description:
                        'Na een ruzie ontvolgt een leerling zijn vroegere vriend op alle platforms zonder uitleg.',
                    correctPosition: 6,
                    explanation:
                        'Pijnlijk, maar dit valt normaal binnen hoe online vriendschappen eindigen. Het wordt pesten als het onderdeel wordt van een groter patroon van bewuste uitsluiting.',
                },
                {
                    id: 8,
                    icon: '💬',
                    title: 'Kritische reactie op een publieke post',
                    description:
                        'Iemand schrijft onder een publieke TikTok: "Dit vind ik niet grappig, je doet anderen pijn met dit soort grappen."',
                    correctPosition: 7,
                    explanation:
                        'Minst schadelijk — dit is iemand aanspreken op zijn gedrag, respectvol en onderbouwd. Dit is geen pesten; dit is een bijstander die reageert.',
                },
            ],
        },
    ],
};

export default config;
