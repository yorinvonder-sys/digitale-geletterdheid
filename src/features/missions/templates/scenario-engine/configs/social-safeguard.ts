import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'social-safeguard',
    title: 'Social Safeguard',
    introEmoji: '🛡️',
    introTitle: 'Social Safeguard',
    introDescription:
        'Online conflicten kunnen snel escaleren: pesten, nepaccounts, doxing (= iemands privé-informatie online zetten als aanval), schermafdrukken die worden doorgestuurd. Je wil helpen — maar hoe doe je dat zonder het erger te maken? Jij leert veilig en slim reageren in lastige online situaties.',
    introFeatures: [
        'Herken wat er echt aan de hand is in online conflicten',
        'Kies de veiligste actie in lastige situaties',
        'Leer het SAFE-ACT protocol: Stop, Save, Share, Secure',
        'Ontdek wanneer je zelf kunt helpen en wanneer je een volwassene inschakelt',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🛡️',
            title: 'Online Beschermer',
            color: '#ff3c21',
        },
        {
            minScore: 60,
            emoji: '🤝',
            title: 'Veilige Omstander',
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
        'Reageer nooit impulsief op online conflicten — stop eerst en denk na over de gevolgen.',
        'Maak bewijs altijd met context: een screenshot zonder datum en gesprekstekst is minder bruikbaar.',
        'Het omstander-effect: niemand helpt omdat iedereen denkt dat iemand anders het wel doet. Jij kunt het verschil maken.',
        'Melden bij een platform verwijdert content — melden bij een volwassene brengt hulp op gang. Doe allebei.',
        'Blokkeren en muten is zelfzorg, geen lafheid. Je hoeft geen online aanvallen te blijven ontvangen.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'wat-is-er-aan-de-hand',
            emoji: '🔎',
            title: 'Wat is er precies aan de hand?',
            description:
                'In een groepsapp en op sociale media gebeuren verschillende dingen. Welke situaties hieronder zijn gevaarlijk of strafbaar en vragen direct actie? Selecteer ze.',
            type: 'select-correct',
            minSelections: 6,
            selectionInstruction: 'Selecteer alle situaties die direct actie vragen',
            maxScore: 25,
            feedbackCorrect:
                'Goed. Je herkent het verschil tussen vervelend gedrag en serieuze situaties die actie vragen.',
            feedbackIncorrect:
                'Sommige situaties lijken onschuldig maar zijn dat niet. Lees de uitleg goed.',
            items: [
                {
                    id: 1,
                    icon: '👤',
                    title: 'Nepaccount van een klasgenoot',
                    description:
                        'Iemand heeft een Instagram-account aangemaakt met de naam, foto en school van een klasgenoot. Ze plaatsen daar berichten die het alsof de klasgenoot ze zelf schrijft.',
                    correct: true,
                    explanation:
                        'Dit is identiteitsfraude en kan strafbaar zijn. Het beschadigt de reputatie van het slachtoffer en de klasgenoot heeft er geen controle over. Directe actie vereist: melden bij platform + een vertrouwenspersoon inschakelen.',
                },
                {
                    id: 2,
                    icon: '😤',
                    title: 'Klasgenoten negeren elkaar in de app',
                    description:
                        'Twee leerlingen laten iemand bewust niet antwoorden in de groepsapp. Ze reageren op iedereen behalve op die persoon.',
                    correct: true,
                    explanation:
                        'Uitsluiting (ook online) is een vorm van pesten. Het is minder zichtbaar dan uitschelden maar kan net zo veel schade aanrichten. Het verdient aandacht van een volwassene als het aanhoudt.',
                },
                {
                    id: 3,
                    icon: '📸',
                    title: 'Iemand deelt een peinlijke foto van een vriend',
                    description:
                        'Een klasgenoot deelt een foto in de groepsapp waarop een vriend er gek uitziet tijdens gym. De vrienden lachen erom.',
                    correct: false,
                    explanation:
                        'Vervelend kan het zijn — maar als alle betrokkenen het grappig vinden en er geen druk of schade is, is dit sociale dynamiek, geen gevaarlijke situatie. Wel goed om bewust te zijn van toestemming bij het delen van foto\'s.',
                },
                {
                    id: 4,
                    icon: '📍',
                    title: 'Iemands thuisadres wordt gedeeld',
                    description:
                        'Een leerling plaatst het thuisadres van een ander kind in een groepsapp na een ruzie, met de tekst "voor als jullie hem een bezoekje willen brengen".',
                    correct: true,
                    explanation:
                        'Dit is doxing: het openbaar maken van privéinformatie als wapen. Dit kan in de echte wereld gevaarlijk worden. Dit is een ernstige situatie — direct melden bij een volwassene of de politie.',
                },
                {
                    id: 5,
                    icon: '💬',
                    title: 'Twee leerlingen maken ruzie via Instagram DM',
                    description:
                        'Twee klasgenoten sturen elkaar boze berichten in privéchat na een conflict op school. Niemand anders is betrokken.',
                    correct: false,
                    explanation:
                        'Een privéruzie tussen twee personen is niet meteen een gevaarlijke situatie. Zolang er geen bedreigingen zijn en het privé blijft, is dit een interpersoonlijk conflict, geen digitale aanval.',
                },
                {
                    id: 6,
                    icon: '📹',
                    title: 'Heimelijk gefilmde video wordt doorgestuurd',
                    description:
                        'Iemand heeft stiekem een video gemaakt in de kleedkamer en stuurt die door in een groepsapp.',
                    correct: true,
                    explanation:
                        'Dit is een ernstige schending van privacy en kan strafbaar zijn als het om ontkleding gaat (ook als minderjarigen betrokken zijn). Verwijder de video niet zelf — laat een volwassene het bewijs documenteren en meld het bij platform én school.',
                },
                {
                    id: 7,
                    icon: '💀',
                    title: '"Ik wou dat je dood was" in een ruzie',
                    description:
                        'Na een ruzie stuurt iemand via WhatsApp: "Ik wou dat je dood was, je maakt mijn leven kapot."',
                    correct: true,
                    explanation:
                        'Uitspraken als deze — ook in woede — moeten serieus worden genomen. Het kan een dreigement zijn, of een signaal dat de afzender zelf in nood is. Altijd een volwassene inschakelen.',
                },
                {
                    id: 8,
                    icon: '🎮',
                    title: 'Iemand wordt gepest in een online game',
                    description:
                        'Een klasgenoot krijgt in een online game constant scheldwoorden en beledigingen van onbekende spelers.',
                    correct: true,
                    explanation:
                        'Online pesten in games is even serieus als offline pesten. Scheldwoorden, bedreigingen of doelbewust ruïneren van het spel kunnen worden gemeld bij de game-platform en zijn soms strafbaar.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'safe-act-volgorde',
            emoji: '📋',
            title: 'De juiste volgorde van handelen',
            description:
                'Je ziet dat een klasgenoot gepest wordt in een groepsapp. Rangschik deze vijf acties van eerste (1e) tot laatste (5e) stap.',
            type: 'order-priority',
            orderInstruction: 'Klik de acties in de SAFE-ACT volgorde: eerste stap eerst',
            maxScore: 25,
            feedbackCorrect:
                'Perfect! Je weet hoe je bedachtzaam handelt zonder bewijs te vernietigen.',
            feedbackIncorrect:
                'De volgorde doet ertoe. Bewijs verzamelen moet eerder dan verwijderen — anders ben je het kwijt.',
            items: [
                {
                    id: 1,
                    icon: '✋',
                    title: 'Stop — reageer niet impulsief',
                    description:
                        'Je eerste reactie is misschien boos terugschrijven of de berichten doorsturen. Stop. Adem. Denk na over wat je gaat doen.',
                    correctPosition: 0,
                    explanation:
                        'Impulsief reageren kan de situatie verergeren, bewijs vernietigen of jou zelf in de problemen brengen. De eerste stap is altijd: pauzeren.',
                },
                {
                    id: 2,
                    icon: '📸',
                    title: 'Maak een screenshot met context',
                    description:
                        'Maak een screenshot van de berichten inclusief de namen van afzenders, datum en het gesprek erboven zodat de context duidelijk is.',
                    correctPosition: 1,
                    explanation:
                        'Bewijs moet bewaard worden voordat het verwijderd wordt. Een screenshot zonder context (wie? wanneer?) is veel minder bruikbaar voor school of politie.',
                },
                {
                    id: 3,
                    icon: '👨‍🏫',
                    title: 'Meld het bij een volwassene',
                    description:
                        'Ga naar een vertrouwde volwassene: je eigen ouder, de mentor of de vertrouwenspersoon van de school.',
                    correctPosition: 2,
                    explanation:
                        'Een volwassene kan ingrijpen op school, contact opnemen met ouders en indien nodig de politie inschakelen. Jij hoeft dit niet alleen op te lossen.',
                },
                {
                    id: 4,
                    icon: '🚩',
                    title: 'Meld de berichten bij het platform',
                    description:
                        'Gebruik de meldknop van de app of het platform om de pestkopberichten te rapporteren.',
                    correctPosition: 3,
                    explanation:
                        'Platforms kunnen accounts blokkeren en content verwijderen. Meld nádat je het bewijs hebt — als je eerst meldt en het wordt verwijderd, heb je geen screenshot meer.',
                },
                {
                    id: 5,
                    icon: '🔒',
                    title: 'Beveilig de privacy van het slachtoffer',
                    description:
                        'Help het slachtoffer hun privacy-instellingen aan te passen: privé-account, ongewenste mensen blokkeren.',
                    correctPosition: 4,
                    explanation:
                        'Preventie voor de toekomst. Dit doe je nadat de acute situatie is gemeld en gedocumenteerd — niet als eerste stap.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'ingrijpen-of-niet',
            emoji: '🤔',
            title: 'Ingrijpen of niet?',
            description:
                'In elk scenario ben jij een omstander. Zou jij ingrijpen — ja of nee? En hoe?',
            type: 'binary-choice',
            acceptLabel: 'Ingrijpen',
            rejectLabel: 'Niet ingrijpen',
            maxScore: 25,
            feedbackCorrect: 'Goede keuze! Jij denkt na over effect én veiligheid.',
            feedbackIncorrect: 'Soms is niet ingrijpen gevaarlijker. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '👀',
                    title: 'Groepsapp vol met gemene grappen over één persoon',
                    description:
                        'In een klassengroepsapp worden al drie dagen grappen gemaakt over één persoon. Het slachtoffer reageert niet. Jij bent lid van de groep.',
                    correct: true,
                    explanation:
                        'Ingrijpen is de juiste keuze. Je kunt iets schrijven als "dit is niet grappig" of het privé melden bij een volwassene. Niets doen is het omstander-effect in actie — de pester denkt dat iedereen het goedkeurt.',
                },
                {
                    id: 2,
                    icon: '📤',
                    title: 'Vriend vraagt om de pesterij door te sturen',
                    description:
                        'Een vriend vraagt jou om de berichten van de pestkop door te sturen aan andere klasgenoten "zodat iedereen het ziet".',
                    correct: false,
                    explanation:
                        'Niet doen. Doorsturen vergroot het bereik van de pesterij. Zelfs met goede bedoelingen kan dit het slachtoffer beschadigen en maak jij jezelf medeplichtig aan verspreiding.',
                },
                {
                    id: 3,
                    icon: '📱',
                    title: 'Klasgenoot meldt dat hij bedreigd wordt',
                    description:
                        'Een vriend laat je een WhatsApp-bericht zien: iemand dreigt hem fysiek iets aan te doen als hij morgen naar school komt.',
                    correct: true,
                    explanation:
                        'Ingrijpen is verplicht. Een fysieke bedreiging is altijd ernstig. Maak meteen samen een screenshot en ga samen naar een volwassene of meld dit bij de politie (0900-8844).',
                },
                {
                    id: 4,
                    icon: '🔇',
                    title: 'Iemand blokkeert je na een ruzie',
                    description:
                        'Na een ruzie blokkeert een vriend je op alle platforms. Jullie praten al een week niet meer.',
                    correct: false,
                    explanation:
                        'Dit is geen situatie die actie vereist in de zin van ingrijpen. Iemand blokkeren is een persoonlijk grenzen-stellen. Geef de ander ruimte. Dit is geen onveilige situatie.',
                },
                {
                    id: 5,
                    icon: '📷',
                    title: 'Iemand vraagt je om een foto van een ander te sturen',
                    description:
                        'Een anoniem account vraagt jou in de DM om een foto van een klasgenoot te sturen. "Gewoon voor de lol."',
                    correct: false,
                    explanation:
                        'Niet doen. Een anoniem verzoek om foto\'s van anderen is nooit onschuldig. Dit kan voor pesten, manipulatie of erger worden gebruikt. Blokkeer het account en meld het eventueel.',
                },
                {
                    id: 6,
                    icon: '💬',
                    title: 'Iemand post een zorgwekkende status',
                    description:
                        'Een klasgenoot post op Instagram: "Soms vraag ik me af waarom ik er nog ben." Je volgt deze persoon, je kent hem een beetje.',
                    correct: true,
                    explanation:
                        'Ingrijpen kan levensreddend zijn. Laat de persoon merken dat je de post hebt gezien, maar schakel meteen een volwassene in, ook als je nog niet weet hoe ernstig het is. Jij hoeft dit niet alleen te beoordelen.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'privacy-instellingen',
            emoji: '🔒',
            title: 'Slim omgaan met privacy online',
            description:
                'Welke acties beschermen jouw privacy en veiligheid op sociale media? Selecteer alles wat echt helpt.',
            type: 'select-correct',
            minSelections: 4,
            selectionInstruction: 'Selecteer alle acties die jouw privacy echt beschermen',
            maxScore: 25,
            feedbackCorrect:
                'Je weet precies welke instellingen er echt toe doen.',
            feedbackIncorrect:
                'Sommige maatregelen lijken veilig maar beschermen nauwelijks. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '🔒',
                    title: 'Profiel op privé zetten',
                    description:
                        'Je stelt je Instagram of TikTok-account in op privé, zodat alleen goedgekeurde volgers je berichten zien.',
                    correct: true,
                    explanation:
                        'Een privéprofiel beperkt wie jouw content ziet. Onbekenden kunnen niet zomaar je foto\'s, locatie of school achterhalen. Dit is de basisbescherming voor tieners.',
                },
                {
                    id: 2,
                    icon: '🏫',
                    title: 'Je school en woonplaats uit je bio verwijderen',
                    description:
                        'Je verwijdert de naam van je school, je stad en je verjaardag uit je publieke profielbeschrijving.',
                    correct: true,
                    explanation:
                        'Publieke bio-informatie is makkelijk te misbruiken voor doxing of social engineering (= mensen manipuleren door informatie over hen te gebruiken). Hoe minder specifieke info, hoe moeilijker het is voor kwaadwillenden om een profiel van jou op te bouwen.',
                },
                {
                    id: 3,
                    icon: '🌍',
                    title: 'Locatie altijd aanzetten voor "betere aanbevelingen"',
                    description:
                        'Je laat je locatie aan staan in alle apps zodat ze je relevantere content laten zien.',
                    correct: false,
                    explanation:
                        'Constante locatiedeling geeft apps (en dus adverteerders en eventuele hackers) inzicht in al jouw bewegingen: thuis, school, vrienden bezoeken. Zet locatie alleen aan als je het echt nodig hebt.',
                },
                {
                    id: 4,
                    icon: '🤝',
                    title: 'Onbekende volgverzoeken weigeren',
                    description:
                        'Je accepteert geen volgverzoeken van mensen die je niet persoonlijk kent.',
                    correct: true,
                    explanation:
                        'Nep- of onbekende accounts kunnen informatie verzamelen voor social engineering of catfishing (= iemand doet zich voor als een ander om jou te misleiden). Als je het profiel niet herkent: weigeren.',
                },
                {
                    id: 5,
                    icon: '📲',
                    title: 'Hetzelfde wachtwoord voor alle apps',
                    description:
                        'Je gebruikt één sterk wachtwoord voor al je sociale media-accounts zodat je het niet vergeet.',
                    correct: false,
                    explanation:
                        'Als één account wordt gehackt of een platform een datalek heeft, zijn alle accounts tegelijk kwetsbaar. Gebruik unieke wachtwoorden en een wachtwoordmanager.',
                },
                {
                    id: 6,
                    icon: '🚫',
                    title: 'Blokkeer en meld pestaccounts direct',
                    description:
                        'Als je gepest wordt door een account, blokkeer je het én meldt je het bij het platform.',
                    correct: true,
                    explanation:
                        'Blokkeren stopt de directe aanval. Melden helpt het platform om het account te verwijderen of te waarschuwen, zodat anderen worden beschermd.',
                },
                {
                    id: 7,
                    icon: '📸',
                    title: 'Foto\'s met locatiedata delen',
                    description:
                        'Je deelt foto\'s rechtstreeks vanuit je telefoon op sociale media zonder de locatiedata (metadata) te verwijderen.',
                    correct: false,
                    explanation:
                        'Foto\'s bevatten soms GPS-coördinaten in de metadata. Als je ze deelt, kan iemand exact zien waar de foto is gemaakt — ook al staat er geen locatie in de caption.',
                },
                {
                    id: 8,
                    icon: '👥',
                    title: 'Controleer wie er in je groepsapps zitten',
                    description:
                        'Je controleert regelmatig wie lid is van groepsapps en verwijdert mensen die je niet (meer) kent of vertrouwt.',
                    correct: true,
                    explanation:
                        'Groepsapps groeien vaak en voegen onbekenden toe. Iemand die je niet vertrouwt kan berichten screenshotten en doorsturen. Regelmatig controleren houdt je groep veilig.',
                },
            ],
        },
    ],
};

export default config;
