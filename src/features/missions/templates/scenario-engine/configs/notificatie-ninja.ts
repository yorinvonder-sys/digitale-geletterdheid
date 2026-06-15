import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'notificatie-ninja',
    title: 'Notificatie Ninja',
    introEmoji: '🔔',
    introTitle: 'Notificatie Ninja',
    introDescription:
        'Elke dag sturen apps je honderden notificaties, autoplay-videos en streaks. Dat is geen toeval — het is ontwerp. Jij leert de technieken doorzien waarmee apps jouw aandacht vangen en vasthouden.',
    introFeatures: [
        'Herken welke app-features bedoeld zijn om je aandacht vast te houden',
        'Rangschik notificaties van meest naar minst manipulatief',
        'Beoordeel: is een notificatie nuttig voor jou of voor de app?',
        'Ontdek hoe TikTok, Instagram en Snapchat je brein beïnvloeden',
    ],
    learningObjectives: [
        'Ik herken minimaal 5 ontwerpkeuzes die mijn aandacht kunnen sturen.',
        'Ik kan notificaties ordenen op urgentie, sociale druk en eigen belang.',
        'Ik kan uitleggen of een melding vooral nuttig is voor mij of voor de app.',
        'Ik kies minimaal 2 concrete instellingen of gewoontes voor bewuster appgebruik.',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🥷',
            title: 'Notificatie Ninja',
            color: '#ff3c21',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Aandacht Analist',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '📱',
            title: 'Screen Bewust',
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
        'Apps zijn ontworpen om jouw aandacht vast te houden — dat is hun verdienmodel, niet een bijwerking.',
        'Rode badges, streaks en "iemand die je misschien kent…" zijn niet toevallig: ze spelen in op beloning, nieuwsgierigheid en het gevoel dat je iets kunt missen.',
        'HOE je apps gebruikt heeft meer invloed op je gevoel dan HOEVEEL tijd je erin steekt.',
        'Jij beslist welke apps toegang mogen hebben tot jouw aandacht — dat begint met notificatie-instellingen.',
        'Herkennen hoe een techniek werkt, maakt je minder vatbaar voor het effect — ook als je de app blijft gebruiken.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'herken-aandachtstrekkers',
            emoji: '🕵️',
            title: 'Herken de aandachtstrekkers',
            description:
                'Hieronder zie je acht app-features. Welke zijn specifiek ontworpen om jouw aandacht vast te houden? Selecteer alle aandachtstrekkers.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Scherp! Je herkent de technieken die app-ontwerpers gebruiken om je terug te laten komen.',
            feedbackIncorrect:
                'Bijna! Sommige technieken zijn subtiel verstopt in iets wat nuttig lijkt.',
            items: [
                {
                    id: 1,
                    icon: '🔴',
                    title: 'Rode badge met getal',
                    description:
                        'Een rood bolletje met een getal op het app-icoon dat aangeeft hoeveel meldingen je hebt gemist.',
                    correct: true,
                    explanation:
                        'Rode badges activeren een gevoel van urgentie en onvolledigheid. Onderzoek toont aan dat mensen deze neiging voelen om het getal naar nul te brengen — ook al is de content niet belangrijk.',
                },
                {
                    id: 2,
                    icon: '🔥',
                    title: 'Streak-teller',
                    description:
                        'Snapchat en Duolingo tonen hoeveel dagen op rij je de app hebt gebruikt. Je streak verdwijnt als je een dag mist.',
                    correct: true,
                    explanation:
                        'Streaks koppelen app-gebruik aan verliesaversie: de angst iets te verliezen is sterker dan de wens iets te winnen. Je opent de app niet omdat je het leuk vindt, maar om je streak te beschermen.',
                },
                {
                    id: 3,
                    icon: '🌙',
                    title: 'Donkere modus',
                    description:
                        'Een instelling die de achtergrond van de app donker maakt, zodat het scherm minder fel is in het donker.',
                    correct: false,
                    explanation:
                        'Donkere modus is een gebruiksgemak-feature, geen aandachtstrekker. Het is bedoeld voor comfort — niet om je langer in de app te houden.',
                },
                {
                    id: 4,
                    icon: '▶️',
                    title: 'Autoplay',
                    description:
                        'YouTube en Netflix spelen automatisch de volgende video af zodra de huidige afgelopen is — zonder dat je iets hoeft te doen.',
                    correct: true,
                    explanation:
                        'Autoplay verwijdert het bewuste beslissingsmoment om door te kijken. Je blijft makkelijker kijken uit gewoonte, niet altijd omdat je actief kiest.',
                },
                {
                    id: 5,
                    icon: '🔄',
                    title: 'Pull-to-refresh',
                    description:
                        'Omlaag vegen op Instagram of Twitter vernieuwt je feed en laadt nieuwe berichten — net als een fruitautomaat bedienen.',
                    correct: true,
                    explanation:
                        'De pull-down beweging en de korte vertraging maken de uitkomst onvoorspelbaar. Je weet nooit wat er verschijnt — en die onzekerheid kan je aandacht vasthouden.',
                },
                {
                    id: 6,
                    icon: '💾',
                    title: 'Offline opslaan',
                    description:
                        'Spotify en YouTube Premium laten je nummers of video\'s downloaden voor gebruik zonder internet.',
                    correct: false,
                    explanation:
                        'Offline opslaan is een gebruiksgemak-feature. Het helpt je de app gebruiken zonder afhankelijk te zijn van internet — geen manipulatie.',
                },
                {
                    id: 7,
                    icon: '♾️',
                    title: 'Infinite scroll',
                    description:
                        'TikTok en Instagram tonen een eindeloze stroom content — er is nooit een "einde" van de feed waar je kunt stoppen.',
                    correct: true,
                    explanation:
                        'Infinite scroll verwijdert het natuurlijke stoppunt. Daardoor moet je zelf bewuster kiezen wanneer je stopt, in plaats van dat de app een duidelijk einde aanbiedt.',
                },
                {
                    id: 8,
                    icon: '❤️',
                    title: 'Likes en reacties als melding',
                    description:
                        'Je krijgt een pushmelding elke keer als iemand je post liket, reageert of je bericht deelt.',
                    correct: true,
                    explanation:
                        'Elke like is een kleine dopamine-piek. Apps sturen meldingen niet allemaal tegelijk, maar druppelsgewijs — om je zo vaak mogelijk terug te laten kijken. Dit heet variabele beloningsverdeling.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'rangschik-manipulatie',
            emoji: '📊',
            title: 'Rangschik van meest naar minst manipulatief',
            description:
                'Deze acht notificaties komen allemaal van echte apps. Rangschik ze van meest manipulatief (1e) naar minst manipulatief (8e). Klik ze in die volgorde aan.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Sterke analyse! Je begrijpt welke meldingen bewust op je zwakste momenten inspelen.',
            feedbackIncorrect:
                'Goed geprobeerd. De volgorde hangt af van hoeveel emotionele druk en urgentie een melding creëert.',
            items: [
                {
                    id: 1,
                    icon: '🔥',
                    title: '"Je streak loopt vanavond af!"',
                    description:
                        'Snapchat stuurt een melding om 21:00: "Je streak met Emma loopt vanavond af! Open de app om hem te redden."',
                    correctPosition: 0,
                    explanation:
                        'Meest manipulatief. Combineert verliesaversie (streak kwijtraken), sociale druk (vriendschap), én tijdsdruk. Drie psychologische triggers tegelijk — specifiek ontworpen om angst te veroorzaken.',
                },
                {
                    id: 2,
                    icon: '👁️',
                    title: '"3 mensen hebben jouw profiel bekeken!"',
                    description:
                        'LinkedIn of een datingapp meldt: "Nieuwsgierig wie er op je profiel heeft gekeken? Open de app om te zien wie."',
                    correctPosition: 1,
                    explanation:
                        'Zeer manipulatief. Speelt in op sociale nieuwsgierigheid en FOMO, maar houdt de namen verborgen achter een betaalmuur of login. Je wordt gelokt met onvolledige informatie.',
                },
                {
                    id: 3,
                    icon: '👥',
                    title: '"Iemand die je misschien kent heeft zich aangemeld!"',
                    description:
                        'Instagram of TikTok stuurt: "Sofia (5 gemeenschappelijke vrienden) heeft zich net aangemeld. Volg haar nu!"',
                    correctPosition: 2,
                    explanation:
                        'Manipulatief. Gebruikt je sociale netwerk als lokaas. De vaagheid ("misschien kent") triggert nieuwsgierigheid, en het gevoel van missen als je niet volgt.',
                },
                {
                    id: 4,
                    icon: '❤️',
                    title: '"Je foto is 47 keer geliked in het afgelopen uur!"',
                    description:
                        'Instagram wacht met melden totdat likes zich hebben opgestapeld, en stuurt ze dan gebundeld als "grote" melding.',
                    correctPosition: 3,
                    explanation:
                        'Manipulatief. Het gebundeld versturen van likes is bewust: 47 likes tegelijk voelt meer belonend dan 47 afzonderlijke meldingen. Maximale dopamine in één keer.',
                },
                {
                    id: 5,
                    icon: '/assets/brand/ui-icons/dgskills-duck-surprised.webp',
                    title: '"Je vriend heeft iets gepost wat je niet mag missen!"',
                    description:
                        'Facebook of Instagram meldt dat iemand die je kent een "populaire" post heeft geplaatst — maar laat niet zien wat.',
                    correctPosition: 4,
                    explanation:
                        'Manipulatief. FOMO (Fear Of Missing Out) als directe trigger. "Wat je niet mag missen" is een bewuste formulering die urgentie suggereert zonder informatie te geven.',
                },
                {
                    id: 6,
                    icon: '🆕',
                    title: '"Nieuwe video\'s wachten op je!"',
                    description:
                        'YouTube stuurt een melding dat er nieuwe video\'s zijn van kanalen die je volgt.',
                    correctPosition: 5,
                    explanation:
                        'Licht manipulatief. Relevant als je het kanaal volgt, maar de formulering ("wachten op je") creëert kunstmatige urgentie. Vergelijk dit met een normale update-melding.',
                },
                {
                    id: 7,
                    icon: '📅',
                    title: '"Je wekelijkse samenvatting is klaar"',
                    description:
                        'Spotify of Google Photos stuurt eenmaal per week een overzicht: "Jouw meest beluisterde nummers van deze week."',
                    correctPosition: 6,
                    explanation:
                        'Nauwelijks manipulatief. Periodiek, voorspelbaar, en biedt echte informatie zonder urgentie of sociale druk. Jij hebt de controle.',
                },
                {
                    id: 8,
                    icon: '📦',
                    title: '"Je pakket wordt morgen bezorgd"',
                    description:
                        'Een bezorgdienst stuurt een melding: "Je pakket (bestelnummer 4821) wordt morgen tussen 14:00 en 18:00 bezorgd."',
                    correctPosition: 7,
                    explanation:
                        'Minst manipulatief. Dit is een nuttige, concrete melding die jij hebt aangevraagd doordat je iets besteld hebt. Specifiek, voorspelbaar, en in jouw belang.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'nuttig-of-manipulatief',
            emoji: '🤔',
            title: 'Nuttig of manipulatief?',
            description:
                'Voor elke notificatie: is dit vooral nuttig voor jou, of vooral nuttig voor de app? Analyseer het doel achter de melding.',
            type: 'binary-choice',
            acceptLabel: 'Nuttig voor mij',
            rejectLabel: 'Nuttig voor de app',
            maxScore: 25,
            feedbackCorrect: 'Goed gezien! Je kijkt verder dan de tekst van de melding.',
            feedbackIncorrect:
                'Interessant. Vraag je af: wie heeft er het meest voordeel als jij op deze melding tikt?',
            items: [
                {
                    id: 1,
                    icon: '📦',
                    title: '"Je pakket wordt over 2 uur bezorgd"',
                    description:
                        'PostNL stuurt een melding: "Bezorging vandaag tussen 14:30 en 16:30. Klik om je voorkeuren aan te passen."',
                    correct: true,
                    explanation:
                        'Nuttig voor jou. Je hebt iets besteld en je wil thuis zijn. Deze melding geeft je actiegerichte informatie op het juiste moment. De afzender heeft geen commercieel belang bij of je tikt of niet.',
                },
                {
                    id: 2,
                    icon: '👀',
                    title: '"3 mensen hebben jouw profiel bekeken!"',
                    description:
                        'Een app meldt dat drie mensen je profiel hebben bekeken — maar je ziet hun namen alleen als je de app opent (of betaalt).',
                    correct: false,
                    explanation:
                        'Nuttig voor de app. De informatie is bewust incompleet gehouden om jou naar de app te lokken. Als ze je echt wilden informeren, hadden ze de namen wel getoond.',
                },
                {
                    id: 3,
                    icon: '🔒',
                    title: '"Er is ingelogd op je account vanaf een nieuw apparaat"',
                    description:
                        'Google of je bank stuurt een beveiligingsmelding: "Nieuw inloggen gedetecteerd op Windows in Amsterdam. Jij was dit niet? Beveilig je account."',
                    correct: true,
                    explanation:
                        'Nuttig voor jou. Dit is een veiligheidswaarschuwing die jou beschermt. De app heeft hier geen commercieel belang bij — integendeel: als jouw account gehackt wordt, kost dat hén reputatieschade.',
                },
                {
                    id: 4,
                    icon: '🎁',
                    title: '"Mis dit niet! Aanbieding verloopt over 2 uur"',
                    description:
                        'Een webshop stuurt een pushmelding: "Alleen vandaag: 30% korting op alles! Geldig tot 23:59. Bestel nu!"',
                    correct: false,
                    explanation:
                        'Nuttig voor de app (webshop). Kunstmatige tijdsdruk (urgency scarcity) is een bewuste verkooptechniek. De aanbieding verloopt nooit echt — er is morgen altijd een nieuwe. Jij koopt iets wat je misschien niet nodig had.',
                },
                {
                    id: 5,
                    icon: '💊',
                    title: '"Tijd voor je medicatie"',
                    description:
                        'Een gezondheidsapp die jij zelf hebt ingesteld stuurt een dagelijks herinnering op het tijdstip dat jij hebt gekozen.',
                    correct: true,
                    explanation:
                        'Nuttig voor jou. Jij hebt zelf de herinnering aangemaakt en het tijdstip gekozen. Dit is een voorbeeld van technologie die werkt vóór jou in plaats van tégen je aandacht.',
                },
                {
                    id: 6,
                    icon: '🔥',
                    title: '"Je TikTok-streak loopt vanavond af!"',
                    description:
                        'TikTok meldt dat je een dag niet hebt gepost en dat je "Creator Streak" om middernacht verdwijnt als je nu niets deelt.',
                    correct: false,
                    explanation:
                        'Nuttig voor de app. TikTok verdient aan views en advertenties. Hoe vaker jij post, hoe meer content er is, hoe langer anderen scrollen. De streak is ontworpen om jou gratis content voor hen te laten produceren.',
                },
                {
                    id: 7,
                    icon: '🚨',
                    title: '"NL-Alert: Extreme neerslag verwacht in jouw regio"',
                    description:
                        'De overheid stuurt via NL-Alert een melding over zwaar onweer en overlastrisico in jouw omgeving.',
                    correct: true,
                    explanation:
                        'Nuttig voor jou. NL-Alert heeft geen verdienmodel en geen advertenties. De melding is bedoeld om mensen veilig te houden. Dit is hoe urgentie-meldingen horen te werken: alleen bij echte urgentie.',
                },
                {
                    id: 8,
                    icon: '/assets/brand/ui-icons/dgskills-duck-surprised.webp',
                    title: '"Je vriend reageert misschien op jouw reactie — open de app"',
                    description:
                        'Instagram stuurt: "Luca heeft misschien gereageerd op jouw comment. Tik om te zien of er een reactie is."',
                    correct: false,
                    explanation:
                        'Nuttig voor de app. "Misschien" zegt al genoeg: er is geen echte reactie. Dit is een speculatieve melding bedoeld om je de app in te lokken. Als Luca echt had gereageerd, hadden ze het gewoon gezegd.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'jouw-schermtijd-reflectie',
            emoji: '⏱️',
            title: 'Welke aanpak helpt echt?',
            description:
                'Je weet nu hoe apps je aandacht vangen. Maar wat helpt écht om bewuster met je schermtijd om te gaan? Selecteer alle aanpakken die daadwerkelijk werken.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed gedaan! Je weet nu niet alleen hoe manipulatie werkt, maar ook hoe je er bewust mee om kunt gaan.',
            feedbackIncorrect:
                'Sommige aanpakken klinken logisch maar werken in de praktijk minder goed. Lees de uitleg om te begrijpen waarom.',
            items: [
                {
                    id: 1,
                    icon: '🔕',
                    title: 'Alle notificaties van sociale media uitzetten',
                    description:
                        'In de instellingen van je telefoon schakel je pushmeldingen uit voor Instagram, TikTok en Snapchat.',
                    correct: true,
                    explanation:
                        'Dit is vaak een effectieve stap. Zonder externe triggers open je de app vaker omdat jij dat wilt, niet omdat een melding je aandacht oproept.',
                },
                {
                    id: 2,
                    icon: '📲',
                    title: 'Apps van je startscherm verwijderen',
                    description:
                        'Je verwijdert de app-iconen van je startscherm, maar laat de apps zelf geïnstalleerd. Je moet nu actief zoeken om ze te openen.',
                    correct: true,
                    explanation:
                        'Dit verhoogt de "wrijving" om een app te openen. Kleine drempels hebben een groot effect: als je twee extra stappen moet zetten, open je de app minder impulsief. Het automatische gedrag wordt doorbroken.',
                },
                {
                    id: 3,
                    icon: '🙅',
                    title: '"Ik ga gewoon minder scrollen" zeggen',
                    description:
                        'Je neemt jezelf voor om minder te scrollen, maar verandert verder niets aan je instellingen of gewoontes.',
                    correct: false,
                    explanation:
                        'Goede bedoelingen werken zelden tegen systemen die speciaal zijn ontworpen om ze te omzeilen. Zonder concrete veranderingen in je omgeving of gewoontes val je na een paar dagen terug in hetzelfde patroon.',
                },
                {
                    id: 4,
                    icon: '⏰',
                    title: 'Schermtijdlimieten instellen per app',
                    description:
                        'Via Schermtijd (iPhone) of Digitaal Welzijn (Android) stel je een dagelijkse tijdslimiet in voor specifieke apps.',
                    correct: true,
                    explanation:
                        'Limieten werken het best als jij ze zelf kiest en begrijpt waarom. Ze zijn geen magische oplossing — je kunt ze negeren — maar ze maken je gebruik zichtbaar en zorgen voor een bewust keuzemomenten.',
                },
                {
                    id: 5,
                    icon: '🌑',
                    title: 'Je scherm in grijstinten zetten',
                    description:
                        'Kleur speelt een grote rol in hoe aantrekkelijk apps zijn. Zonder kleur zien feeds er minder verleidelijk uit.',
                    correct: true,
                    explanation:
                        'Grijstinten verminderen de visuele beloning van scrollen. Apps investeren miljoenen in kleurpsychologie. Door die kleur weg te halen, verlaag je de prikkel — zonder iets te verwijderen.',
                },
                {
                    id: 6,
                    icon: '🗑️',
                    title: 'Apps volledig verwijderen voor altijd',
                    description:
                        'Je verwijdert TikTok, Instagram en Snapchat permanent van je telefoon.',
                    correct: false,
                    explanation:
                        'Radicale maatregelen werken zelden lang. De meeste mensen installeren de app daarna opnieuw — en gebruiken hem dan juist meer omdat ze "iets hebben gemist". Bewust gebruik leer je niet door iets weg te gooien.',
                },
                {
                    id: 7,
                    icon: '📵',
                    title: 'Telefoon buiten de slaapkamer leggen',
                    description:
                        'Je laadt je telefoon \'s nachts op in een andere kamer en koopt een gewone wekker.',
                    correct: true,
                    explanation:
                        'Het eerste wat je \'s ochtends doet, bepaalt hoe je dag begint. Wie direct zijn telefoon pakt, begint de dag al in reactiemodus. Telefoon buiten de slaapkamer verlaagt ook blauwlicht-blootstelling voor het slapen.',
                },
                {
                    id: 8,
                    icon: '📊',
                    title: 'Bijhouden hoeveel tijd je echt gebruikt',
                    description:
                        'Je controleert één week lang elke dag hoeveel uur je per app op je scherm zit, zonder iets te veranderen.',
                    correct: true,
                    explanation:
                        'Bewustwording is de eerste stap. Veel mensen schatten hun schermtijd anders in dan wat hun telefoon laat zien. Pas als je de cijfers bekijkt, kun je kiezen of dat past bij hoe jij je tijd wilt besteden.',
                },
            ],
        },
    ],
};

export default config;
