import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'social-safeguard',
    title: 'Social Safeguard',
    introEmoji: '🛡️',
    introTitle: 'Social Safeguard',
    introDescription:
        'Iemand in je klas wordt online gepest — jij ziet het. Weet je wat je moet doen, en wat je beter kunt laten?',
    introFeatures: [
        'Zie jij het verschil tussen drama en echt gevaar?',
        'Kun jij de juiste stappen in de juiste volgorde zetten?',
        'Wanneer grijp je in — en wanneer maak je het juist erger?',
        'Ontdek welke privacy-instellingen er écht toe doen.',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🛡️',
            title: 'Online Beschermer',
            color: '#EF4444',
        },
        {
            minScore: 60,
            emoji: '🤝',
            title: 'Veilige Omstander',
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
        'Je eerste reactie is bijna nooit de beste — één seconde nadenken verandert de uitkomst.',
        'Een screenshot zonder namen en datum is waardeloos als bewijs.',
        'Iedereen dacht dat iemand anders het zou melden — zo werkt het omstander-effect.',
        'Melden bij een platform haalt content weg; melden bij een volwassene haalt hulp op gang.',
        'Blokkeren is een grens stellen, geen opgeven.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'wat-is-er-aan-de-hand',
            emoji: '🔎',
            title: 'Wat is er precies aan de hand?',
            description:
                'Welke van deze situaties zijn gevaarlijk of strafbaar en vragen direct actie? Selecteer ze.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Scherp — je ziet het verschil tussen vervelend en serieus gevaarlijk.',
            feedbackIncorrect:
                'Sommige situaties zien er onschuldig uit maar zijn dat niet. Kijk wat de situatie concreet mogelijk maakt voor de dader.',
            items: [
                {
                    id: 1,
                    icon: '👤',
                    title: 'Nepaccount van een klasgenoot',
                    description:
                        'Iemand heeft een Instagram-account aangemaakt met de naam, foto en school van een klasgenoot. Ze plaatsen daar berichten die het alsof de klasgenoot ze zelf schrijft.',
                    correct: true,
                    explanation:
                        'Dit is identiteitsfraude — de klasgenoot heeft geen controle over wat er in zijn naam wordt gepost. Kan strafbaar zijn en richt directe reputatieschade aan.',
                },
                {
                    id: 2,
                    icon: '😤',
                    title: 'Klasgenoten negeren elkaar in de app',
                    description:
                        'Twee leerlingen laten iemand bewust niet antwoorden in de groepsapp. Ze reageren op iedereen behalve op die persoon.',
                    correct: true,
                    explanation:
                        'Online uitsluiting is een pesttechniek — minder zichtbaar dan uitschelden, maar even schadelijk. Als het aanhoudt, is het geen groepsdynamiek meer maar structureel pesten.',
                },
                {
                    id: 3,
                    icon: '📸',
                    title: 'Iemand deelt een peinlijke foto van een vriend',
                    description:
                        'Een klasgenoot deelt een foto in de groepsapp waarop een vriend er gek uitziet tijdens gym. De vrienden lachen erom.',
                    correct: false,
                    explanation:
                        'Als alle betrokkenen het grappig vinden en er geen druk of schade is, is dit sociale dynamiek — geen gevaarlijke situatie. Toestemming voor foto\'s is altijd de moeite waard om over na te denken.',
                },
                {
                    id: 4,
                    icon: '📍',
                    title: 'Iemands thuisadres wordt gedeeld',
                    description:
                        'Een leerling plaatst het thuisadres van een ander kind in een groepsapp na een ruzie, met de tekst "voor als jullie hem een bezoekje willen brengen".',
                    correct: true,
                    explanation:
                        'Dit is doxing — privéinformatie als wapen gebruiken. Het thuisadres + een uitnodiging om langs te gaan maakt dit direct een veiligheidsrisico.',
                },
                {
                    id: 5,
                    icon: '💬',
                    title: 'Twee leerlingen maken ruzie via Instagram DM',
                    description:
                        'Twee klasgenoten sturen elkaar boze berichten in privéchat na een conflict op school. Niemand anders is betrokken.',
                    correct: false,
                    explanation:
                        'Zolang er geen bedreigingen zijn en het privé blijft, is dit een interpersoonlijk conflict — geen digitale aanval. Twee mensen mogen boos op elkaar zijn.',
                },
                {
                    id: 6,
                    icon: '📹',
                    title: 'Heimelijk gefilmde video wordt doorgestuurd',
                    description:
                        'Iemand heeft stiekem een video gemaakt in de kleedkamer en stuurt die door in een groepsapp.',
                    correct: true,
                    explanation:
                        'Heimelijk filmen in een kleedkamer is een ernstige privacyschending en strafbaar als er ontkleding in beeld is. Verwijder de video niet zelf — bewijs moet intact blijven voor degene die dit afhandelt.',
                },
                {
                    id: 7,
                    icon: '💀',
                    title: '"Ik wou dat je dood was" in een ruzie',
                    description:
                        'Na een ruzie stuurt iemand via WhatsApp: "Ik wou dat je dood was, je maakt mijn leven kapot."',
                    correct: true,
                    explanation:
                        'Ook als het in woede gezegd is, kan dit een dreigement zijn — of een signaal dat de afzender zelf in nood is. Beide vragen om een volwassene.',
                },
                {
                    id: 8,
                    icon: '🎮',
                    title: 'Iemand wordt gepest in een online game',
                    description:
                        'Een klasgenoot krijgt in een online game constant scheldwoorden en beledigingen van onbekende spelers.',
                    correct: true,
                    explanation:
                        'Online pesten in games is net zo serieus als offline pesten. Systematisch iemands spel saboteren of bedreigen is meldbaar bij het platform en soms strafbaar.',
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
            maxScore: 25,
            feedbackCorrect:
                'Klopt — stoppen, bewijzen, melden, dan pas verwijderen. In die volgorde blijft alles bruikbaar.',
            feedbackIncorrect:
                'De volgorde maakt echt verschil: als je eerst meldt en het platform haalt de content weg, ben je je bewijs kwijt. Screenshot altijd eerst.',
            items: [
                {
                    id: 1,
                    icon: '✋',
                    title: 'Stop — reageer niet impulsief',
                    description:
                        'Je eerste reactie is misschien boos terugschrijven of de berichten doorsturen. Stop. Adem. Denk na over wat je gaat doen.',
                    correctPosition: 0,
                    explanation:
                        'Impulsief reageren kan bewijs vernietigen en jou zelf betrekken in de situatie. Pauzeren is geen passiviteit — het is tactiek.',
                },
                {
                    id: 2,
                    icon: '📸',
                    title: 'Maak een screenshot met context',
                    description:
                        'Maak een screenshot van de berichten inclusief de namen van afzenders, datum en het gesprek erboven zodat de context duidelijk is.',
                    correctPosition: 1,
                    explanation:
                        'Een screenshot zonder context — wie, wanneer, in welk gesprek — is nauwelijks bruikbaar. Namen en datum moeten zichtbaar zijn.',
                },
                {
                    id: 3,
                    icon: '👨‍🏫',
                    title: 'Meld het bij een volwassene',
                    description:
                        'Ga naar een vertrouwde volwassene: je eigen ouder, de mentor of de vertrouwenspersoon van de school.',
                    correctPosition: 2,
                    explanation:
                        'Een volwassene kan dingen doen die jij niet kunt: contact opnemen met ouders, ingrijpen op school, eventueel de politie bellen. Je hoeft dit niet alleen te fixen.',
                },
                {
                    id: 4,
                    icon: '🚩',
                    title: 'Meld de berichten bij het platform',
                    description:
                        'Gebruik de meldknop van de app of het platform om de pestkopberichten te rapporteren.',
                    correctPosition: 3,
                    explanation:
                        'Meld pas nadat je het bewijs hebt — als het platform de content verwijdert voordat je een screenshot hebt, is het weg.',
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
                'Jij bent omstander. Zou jij ingrijpen — ja of nee?',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Klopt — je ziet wanneer actie nodig is en wanneer ruimte geven het slimmere antwoord is.',
            feedbackIncorrect: 'Soms is niets doen gevaarlijker dan ingrijpen. Kijk wat het scenario concreet mogelijk maakt.',
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
                        'Ingrijpen kan levensreddend zijn. Stuur een privébericht of spreek de persoon aan. Zeg iets als: "Ik zag je post en maak me zorgen. Gaat het wel?" Schakel een volwassene in als het antwoord zorgelijk is.',
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
            maxScore: 25,
            feedbackCorrect:
                'Je weet precies welke instellingen er echt toe doen.',
            feedbackIncorrect:
                'Sommige maatregelen lijken veilig maar beschermen nauwelijks. Kijk welke instelling of gewoonte het concrete risico niet wegneemt.',
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
                        'Publieke bio-informatie is makkelijk te misbruiken voor doxing of social engineering. Hoe minder specifieke info, hoe moeilijker het is voor kwaadwillenden om een profiel van jou op te bouwen.',
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
                        'Nep- of onbekende accounts kunnen informatie verzamelen voor social engineering, catfishing of phishing. Als je het profiel niet herkent: weigeren.',
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
