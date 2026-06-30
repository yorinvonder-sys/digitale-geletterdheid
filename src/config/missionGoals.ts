import type { MissionGoal } from '@/features/missions/templates/shared/types';

export const MISSION_GOALS: Record<string, MissionGoal> = {
    'magister-master': {
        primaryGoal: 'Ik laat zien dat ik zelfstandig de belangrijkste Magister-onderdelen voor school kan vinden.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier stappen zijn afgerond met checklist, checkvraag en docentcheck.',
        },
        evidence: 'Je toont waar rooster, huiswerk, berichten en cijfers staan zonder persoonlijke gegevens hardop te delen.',
    },
    'cloud-commander': {
        primaryGoal: 'Ik orden, upload en deel schoolbestanden veilig in de cloud.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je rondt openen, map maken, uploaden en delen af.',
        },
        evidence: 'Je hebt een School-map, een geupload bestand en een veilige deelactie laten zien.',
    },
    'word-wizard': {
        primaryGoal: 'Ik maak een verzorgd schooldocument met duidelijke koppen, tekst en beeld.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je gebruikt documentopmaak, controleert de leesbaarheid en bewaart het bestand netjes.',
        },
        evidence: 'Je document heeft een titel, koppen, nette tekst, een afbeelding en een logische bestandsnaam.',
    },
    'slide-specialist': {
        primaryGoal: 'Ik maak een korte presentatie die rustig oogt en begrijpelijk is voor mijn publiek.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt slides met kernwoorden, beeld en een duidelijke volgorde.',
        },
        evidence: 'Je presentatie heeft leesbare slides, passend beeld en een korte uitleg per slide.',
    },
    'print-pro': {
        primaryGoal: 'Ik print en lever een schoolbestand correct in met de juiste printerinstellingen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je kiest het bestand, controleert instellingen, print en levert het bewijs in.',
        },
        evidence: 'Je kunt uitleggen welke printer, pagina-instelling en inleverstap je gebruikte.',
    },
    'cloud-cleaner': {
        primaryGoal: 'Ik ruim digitale schoolbestanden op door ze in logische mappen te plaatsen.',
        criteria: {
            type: 'component-complete',
            description: 'Je sorteert bestanden correct en controleert je mapstructuur.',
        },
        evidence: 'De bestanden staan in passende mappen en je kunt je keuzes uitleggen.',
    },
    'layout-doctor': {
        primaryGoal: 'Ik verbeter een rommelig Word-document zodat het leesbaar en professioneel wordt.',
        criteria: {
            type: 'component-complete',
            description: 'Je past de gevraagde opmaakverbeteringen toe.',
        },
        evidence: 'Het document heeft duidelijke koppen, consistente tekst en betere plaatsing van beeld.',
    },
    'pitch-police': {
        primaryGoal: 'Ik beoordeel en verbeter slides op rust, contrast en duidelijke boodschap.',
        criteria: {
            type: 'component-complete',
            description: 'Je spoort slideproblemen op en past verbeteringen toe.',
        },
        evidence: 'Je kunt per verbeterde slide noemen wat rustiger, leesbaarder of sterker is geworden.',
    },
    'prompt-master': {
        primaryGoal: 'Ik schrijf prompts die steeds beter worden doordat ik context, vorm en duidelijke eisen toevoeg.',
        criteria: {
            type: 'score-threshold',
            threshold: 60,
            description: 'De missie is behaald als je eindscore minstens 60% is.',
        },
        evidence: 'Je eindprompt bevat context, opdracht, vorm en kwaliteitscriteria.',
    },
    'game-programmeur': {
        primaryGoal: 'Ik pas gamegedrag aan met duidelijke instructies en test wat er verandert.',
        criteria: {
            type: 'component-complete',
            description: 'Je geeft opdrachten, bekijkt het resultaat en verbetert je instructies.',
        },
        evidence: 'Je game laat zichtbaar aangepast gedrag zien en je kunt uitleggen welke opdracht dat veroorzaakte.',
    },
    'ai-trainer': {
        primaryGoal: 'Ik train een AI-model met voorbeelden en controleer of de uitkomst klopt.',
        criteria: {
            type: 'component-complete',
            description: 'Je verzamelt voorbeelden, traint het model en test meerdere voorspellingen.',
        },
        evidence: 'Je kunt aanwijzen welke trainingsvoorbeelden hielpen en waar het model nog fouten maakt.',
    },
    'chatbot-trainer': {
        primaryGoal: 'Ik bouw en test chatbotregels die passende antwoorden geven op leerlingvragen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt intents, antwoorden en testgesprekken.',
        },
        evidence: 'Je chatbot reageert op meerdere voorbeeldvragen met passende antwoorden.',
    },
    'verhalen-ontwerper': {
        primaryGoal: 'Ik ontwerp een kort verhaal met AI-beeld en tekst die samen een logisch geheel vormen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt verhaalkeuzes, prompts en een samenhangende uitwerking.',
        },
        evidence: 'Je verhaal heeft een begin, vervolg, beeldkeuzes en een korte toelichting op je prompts.',
    },
    'game-director': {
        primaryGoal: 'Ik programmeer Robbie door vijf levels heen en leg uit wat duidelijke instructies met AI te maken hebben.',
        criteria: {
            type: 'component-complete',
            description: 'Je voltooit de levels en reflecteert op de gebruikte instructies.',
        },
        evidence: 'Robbie haalt de doelen en je kunt uitleggen welke blokken het gedrag bepalen.',
    },
    'ai-tekengame': {
        primaryGoal: 'Ik laat zien hoe AI een tekening kan herkennen en waar herkenning lastig wordt.',
        criteria: {
            type: 'component-complete',
            description: 'Je speelt meerdere tekenrondes en bespreekt herkenningsverschillen.',
        },
        evidence: 'Je kunt voorbeelden noemen van tekeningen die de AI goed en minder goed herkende.',
    },
    'ai-beleid-brainstorm': {
        primaryGoal: 'Ik bedenk bruikbare AI-afspraken voor school en onderbouw waarom ze nodig zijn.',
        criteria: {
            type: 'component-complete',
            description: 'Je levert voorstellen, stemt of kiest, en legt je keuze uit.',
        },
        evidence: 'Je hebt minimaal twee concrete AI-regels met reden en schoolsituatie.',
    },
    'code-denker': {
        primaryGoal: 'Ik herken programmeerlogica door stappen, voorwaarden en volgorde goed te lezen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je rondt de scenario-rondes af en verklaart je keuzes.',
        },
        evidence: 'Je kunt uitleggen welke volgorde of voorwaarde de juiste uitkomst geeft.',
    },
    'website-bouwer': {
        primaryGoal: 'Ik bouw een werkende Over Mij-webpagina met HTML, CSS en een korte uitleg van mijn keuzes.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt structuur, styling, inhoud en controleert het resultaat.',
        },
        evidence: 'Je pagina toont tekst, opmaak en een duidelijke persoonlijke boodschap.',
    },
    'schermtijd-coach': {
        primaryGoal: 'Ik bouw een onderbouwd standpunt over wie verantwoordelijk is voor gezonde schermtijd.',
        criteria: {
            type: 'steps-complete',
            min: 5,
            description: 'Verkennen, positie kiezen, argumenten bouwen, tegenargument beantwoorden en reflecteren.',
        },
        evidence: 'Je eindstandpunt bevat minimaal twee argumenten en een reflectie op je eigen gedrag.',
    },
    'notificatie-ninja': {
        primaryGoal: 'Ik herken hoe notificaties mijn aandacht sturen en kies bewuste instellingen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert aandachtstrekkers, rangschikt meldingen en kiest verbeteracties.',
        },
        evidence: 'Je benoemt minimaal twee notificatie-instellingen of gewoontes die je bewuster maakt.',
    },
    'review-week-2': {
        primaryGoal: 'Ik beoordeel AI- en codevoorbeelden kritisch en herken wat beter moet.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je rondt de reviewrondes af en kiest onderbouwde verbeteringen.',
        },
        evidence: 'Je kunt per fout uitleggen waarom die fout is en hoe je hem verbetert.',
    },
    'data-detective': {
        primaryGoal: 'Ik onderzoek hoe apps data gebruiken en kies bewust welke data ik wel of niet deel.',
        criteria: {
            type: 'component-complete',
            description: 'Je analyseert appdata en maakt privacykeuzes.',
        },
        evidence: 'Je kunt uitleggen welke appgegevens gevoelig zijn en welke keuze veiliger is.',
    },
    'data-verzamelaar': {
        primaryGoal: 'Ik verzamel data netjes en trek een eenvoudige conclusie uit mijn resultaten.',
        criteria: {
            type: 'component-complete',
            description: 'Je verzamelt, bekijkt en gebruikt data voor een klein advies.',
        },
        evidence: 'Je data-overzicht leidt tot een conclusie of advies dat je kunt uitleggen.',
    },
    'deepfake-detector': {
        primaryGoal: 'Ik herken deepfake-signalen in beeld, tekst en claims en maak een kort actieplan tegen misleiding.',
        criteria: {
            type: 'component-complete',
            description: 'Je onderzoekt voorbeelden en kiest controleacties.',
        },
        evidence: 'Je noemt signalen en controleert bron, context of beeldkenmerken.',
    },
    'ai-spiegel': {
        primaryGoal: 'Ik ontdek welke data een AI-profiel over mij kan vormen en welke privacykeuzes ik heb.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je test instellingen en beantwoordt de analysevragen.',
        },
        evidence: 'Je benoemt welke data gevoelig is en welke instelling meer controle geeft.',
    },
    'social-safeguard': {
        primaryGoal: 'Ik herken online risicosituaties en kies een veilige, helpende reactie.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je beoordeelt scenario\u2019s en kiest passende acties.',
        },
        evidence: 'Je kunt uitleggen wanneer je bewaart, blokkeert, meldt of hulp vraagt.',
    },
    'scroll-stopper': {
        primaryGoal: 'Ik onderbouw een standpunt over verslavend app-design met belangen van meerdere partijen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest stakeholders, kiest positie, bouwt argumenten en reflecteert.',
        },
        evidence: 'Je eindantwoord bevat een positie, argumenten en reactie op een tegenargument.',
    },
    'cookie-crusher': {
        primaryGoal: 'Ik herken cookiekeuzes en dark patterns zodat ik bewuster toestemming geef.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert cookievoorbeelden en kiest privacyvriendelijke opties.',
        },
        evidence: 'Je kunt uitleggen welke knop of tekst je richting onnodig delen duwt.',
    },
    'mail-detective': {
        primaryGoal: 'Ik herken signalen van phishing en kies een veilige actie bij verdachte mail.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je onderzoekt mails op afzender, link, taal en urgentie.',
        },
        evidence: 'Je kunt minimaal drie phishing-signalen aanwijzen en een veilige vervolgstap kiezen.',
    },
    'access-control-engineer': {
        primaryGoal: 'Ik beveilig het schoolsysteem door onveilige toegangsregels te vinden, te verbeteren en te testen.',
        criteria: {
            type: 'steps-complete',
            min: 3,
            description: 'Problemen vinden, veilige regels bouwen en testscenario\'s doorstaan.',
        },
        evidence: 'Gevonden risico\'s, aangepaste regels en geslaagde toegangstesten.',
    },
    'phishing-fighter': {
        primaryGoal: 'Ik herken phishing-aanvallen en adviseer anderen over de veiligste reactie.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert, rangschikt en beoordeelt phishing-scenario\'s en geeft advies.',
        },
        evidence: 'Je kunt minimaal vier rode vlaggen benoemen en een veilig advies geven bij een verdachte mail.',
    },
    'data-handelaar': {
        primaryGoal: 'Ik beoordeel datasituaties op privacy, toestemming en eerlijk gebruik.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je lost datapuzzels op en verklaart welke handelwijze wel of niet mag.',
        },
        evidence: 'Je kunt per casus uitleggen welke data gevoelig is en waarom.',
    },
    'filter-bubble-breaker': {
        primaryGoal: 'Ik vergelijk feeds en ontdek hoe aanbevelingen mijn beeld van de wereld kunnen sturen.',
        criteria: {
            type: 'component-complete',
            description: 'Je vergelijkt, analyseert en reflecteert op filterbubbels.',
        },
        evidence: 'Je noemt verschillen tussen feeds en schrijft wat je bewuster wilt controleren.',
    },
    'datalekken-rampenplan': {
        primaryGoal: 'Ik maak een stappenplan voor een datalek en kies wat eerst moet gebeuren.',
        criteria: {
            type: 'component-complete',
            description: 'Je onderzoekt bewijs, prioriteert acties en maakt een melding of plan.',
        },
        evidence: 'Je crisisplan noemt wie je informeert, welke data geraakt is en welke actie eerst komt.',
    },
    'data-voor-data': {
        primaryGoal: 'Ik weeg af welke persoonlijke data ik wel of niet wil ruilen voor digitale voordelen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt keuzes in de dataveiling en reflecteert op je grenzen.',
        },
        evidence: 'Je kunt minimaal twee datakeuzes onderbouwen met privacy en voordeel.',
    },
    'data-speurder': {
        primaryGoal: 'Ik onderzoek data, kies passende visualisaties en trek een conclusie die ik met bewijs kan uitleggen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert datasets en beantwoordt de vragen met onderbouwing.',
        },
        evidence: 'Je conclusie verwijst naar een getal, patroon of grafiek.',
    },
    'research-project': {
        primaryGoal: 'Ik formuleer een onderzoeksvraag, analyseer data uit betrouwbare bronnen en trek een onderbouwde conclusie.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert datasets, evalueert onderzoeksmethoden en beantwoordt vragen met onderbouwing.',
        },
        evidence: 'Je conclusie verwijst naar een getal, patroon of bron die je keuze ondersteunt.',
    },
    'digital-forensics': {
        primaryGoal: 'Ik analyseer logbestanden en trek een onderbouwde conclusie over wat er is gebeurd.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je herkent verdachte patronen, reconstrueert een tijdlijn en evalueert digitaal bewijs.',
        },
        evidence: 'Je kunt uitleggen welke logregels een aanval bewijzen en welke conclusie je daaruit trekt.',
    },
    'digitale-balans-coach': {
        primaryGoal: 'Ik maak een persoonlijk en haalbaar plan voor digitale balans en privacy.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je verkent standpunten, kiest acties en reflecteert op je eigen balans.',
        },
        evidence: 'Je plan bevat minstens twee haalbare afspraken voor schermgebruik of privacy.',
    },
    'mission-blueprint': {
        primaryGoal: 'Ik maak een duidelijk plan voor mijn eindproject met taken, volgorde en opslagplek.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je beschrijft project, taken, volgorde en cloudopslag.',
        },
        evidence: 'Je projectplan heeft een doel, takenlijst, planning en gedeelde opslagplek.',
    },
    'mission-vision': {
        primaryGoal: 'Ik ontwikkel een duidelijke visie voor mijn eindproject met publiek, boodschap en sfeer.',
        criteria: {
            type: 'steps-complete',
            min: 5,
            description: 'Je werkt doel, doelgroep, boodschap en visuele richting uit.',
        },
        evidence: 'Je kunt laten zien voor wie je project is en welke stijl of boodschap erbij hoort.',
    },
    'mission-launch': {
        primaryGoal: 'Ik presenteer mijn eindproject duidelijk met een korte lancering en passende materialen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt lanceringsmateriaal, controleert de boodschap en presenteert.',
        },
        evidence: 'Je hebt een flyer, pitch of uitleg waarmee iemand je project begrijpt.',
    },
    'review-week-3': {
        primaryGoal: 'Ik beoordeel digitale dilemma\u2019s vanuit privacy, AI en maatschappelijke gevolgen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest perspectieven, neemt positie in en onderbouwt je advies.',
        },
        evidence: 'Je advies noemt voordelen, risico\u2019s en een keuze die je kunt verdedigen.',
    },
    'ipad-print-instructies': {
        primaryGoal: 'Ik print vanaf een iPad door de juiste app, printer en stappen te gebruiken.',
        criteria: {
            type: 'component-complete',
            description: 'Je installeert of opent de printapp, kiest printerinstellingen en test de print.',
        },
        evidence: 'Je kunt de printstappen zelfstandig voordoen of uitleggen.',
    },
    'startup-pitch': {
        primaryGoal: 'Ik bedenk een AI-startup, onderbouw het probleem en de oplossing, en reflecteer op privacy en eerlijkheid.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt probleemanalyse, AI-oplossing, branding en ethische reflectie uit.',
        },
        evidence: 'Je pitch beschrijft een concreet probleem, een AI-oplossing met naam, een logo-concept en een privacyreflectie.',
    },

    // === ScenarioEngine ===
    'online-helden': {
        primaryGoal: 'Ik herken cyberpesten en kies als bijstander de meest effectieve en veilige reactie.',
        criteria: {
            type: 'score-threshold',
            threshold: 60,
            description: 'Je beoordeelt bijstandersituaties en rangschikt de impact van online acties.',
        },
        evidence: 'Je kunt uitleggen wanneer iets cyberpesten is en welke bijstandersactie het meest helpt.',
    },
    'factchecker': {
        primaryGoal: 'Ik beoordeel berichten en bronnen kritisch met de CRAAP-methode en besluit bewust of ik iets deel.',
        criteria: {
            type: 'score-threshold',
            threshold: 60,
            description: 'Je herkent rode vlaggen, rangschikt bronnen op betrouwbaarheid en kiest de juiste CRAAP-vragen.',
        },
        evidence: 'Je kunt minimaal drie rode vlaggen voor onbetrouwbare berichten noemen en uitleggen wanneer je niet deelt.',
    },
    'ai-bias-detective': {
        primaryGoal: 'Ik herken AI-bias in systemen, schat het risico in en kies maatregelen die bijdragen aan eerlijkere AI.',
        criteria: {
            type: 'score-threshold',
            threshold: 60,
            description: 'Je identificeert bias-situaties, rangschikt risico\'s en beoordeelt oplossingen.',
        },
        evidence: 'Je kunt twee concrete voorbeelden van AI-bias noemen en een maatregel kiezen die écht helpt.',
    },

    // === PuzzleLab ===
    'encryption-expert': {
        primaryGoal: 'Ik los encryptie-puzzels op en leg uit hoe versleuteling gegevens beschermt van Caesar-cijfer tot moderne sleutels.',
        criteria: {
            type: 'score-threshold',
            threshold: 70,
            description: 'Je kraakt een Caesar-cijfer, decodeert Base64, begrijpt publieke sleutels en maakt een sterk wachtwoord.',
        },
        evidence: 'Je hebt een Caesar-code gekraakt, Base64 gedecodeerd en een wachtwoord gemaakt dat voldoet aan de veiligheidseisen.',
    },
    'cyber-detective': {
        primaryGoal: 'Ik analyseer logbestanden, herken aanvalsmethoden en stel een forensische tijdlijn op als digitaal rechercheur.',
        criteria: {
            type: 'score-threshold',
            threshold: 70,
            description: 'Je identificeert aanvalsmethoden, kiest de juiste bewijsmethode en reconstrueert de aanvalsvolgorde.',
        },
        evidence: 'Je kunt een brute-force aanval herkennen in een logboek en de correcte volgorde van aanvalsgebeurtenissen noemen.',
    },
    'wachtwoord-warrior': {
        primaryGoal: 'Ik los wachtwoordpuzzels op en formuleer regels voor een sterk en veilig wachtwoordbeleid.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Je begrijpt wachtwoordaanvallen en maakt een wachtwoord dat voldoet aan de veiligheidscriteria.',
        },
        evidence: 'Je kunt uitleggen waarom veelgebruikte wachtwoorden zwak zijn en hebt een eigen sterk wachtwoord aangemaakt.',
    },
    'security-auditor': {
        primaryGoal: 'Ik spoor kwetsbaarheden op in een webshop, classificeer ze op ernst en schrijf een concrete aanbeveling.',
        criteria: {
            type: 'score-threshold',
            threshold: 70,
            description: 'Je herkent SQL-injectie, rangschikt kwetsbaarheden op ernst en adviseert over een XSS-aanval.',
        },
        evidence: 'Je kunt een SQL-injectie herkennen en een technische aanbeveling formuleren met de term "prepared statements".',
    },

    // === SimulationLab ===
    'privacy-by-design': {
        primaryGoal: 'Ik maak privacykeuzes die een app veiliger maken en leg uit welke data echt nodig is.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Alle drie privacy-simulaties zijn onderzocht met vragen en reflectie.',
        },
        evidence: 'Je kunt per simulator uitleggen welke instelling meer of minder data deelt en waarom.',
    },
    'bug-hunter': {
        primaryGoal: 'Ik lees foutmeldingen, herken bug-typen en kies de beste debugstrategie om een probleem systematisch op te lossen.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Je doorloopt drie simulaties over foutlezen, bug-taxonomie en debugaanpak.',
        },
        evidence: 'Je kunt uitleggen wat een foutmelding betekent, welk bug-type het gevaarlijkst is en welke debugstrategie past.',
    },
    'code-reviewer': {
        primaryGoal: 'Ik beoordeel code op leesbaarheid en het DRY-principe en geef constructieve feedback aan een mede-ontwikkelaar.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Je doorloopt simulaties over leesbaarheid, herhaling in code en feedbackmethoden.',
        },
        evidence: 'Je kunt DRY-schendingen herkennen en het verschil uitleggen tussen destructieve en constructieve code-feedback.',
    },
    'algorithm-architect': {
        primaryGoal: 'Ik vergelijk zoek- en sorteeralgoritmen op efficiëntie en leg uit waarom algoritme-keuze bij grote datasets uitmaakt.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Je doorloopt simulaties over lineair vs. binair zoeken, sorteervergelijking en pseudocode als planningsinstrument.',
        },
        evidence: 'Je kunt uitleggen waarom binair zoeken sneller is dan lineair en welke sorteerkosten bij grote datasets toenemen.',
    },

    // === ReviewArena ===
    'data-review': {
        primaryGoal: 'Ik beoordeel databronnen op betrouwbaarheid, classificeer persoonsgegevens en beantwoord vragen over AVG-rechten.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert databronnen, koppelt beveiligingsmaatregelen, categoriseert persoonsgegevens en beantwoordt AVG-vragen.',
        },
        evidence: 'Je kunt het verschil uitleggen tussen gewone en bijzondere persoonsgegevens en weet welke AVG-rechten je hebt.',
    },
    'code-review-2': {
        primaryGoal: 'Ik laat zien dat ik de programmeer- en webdev-concepten uit periode 2 beheers door ze te sorteren, te koppelen en toe te passen.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert weblagen, koppelt begrippen, categoriseert codefragmenten en beantwoordt programmeer-vragen.',
        },
        evidence: 'Je kunt weblagen van fundamenteel naar interactief ordenen en HTML, CSS en JavaScript van elkaar onderscheiden.',
    },
    'media-review': {
        primaryGoal: 'Ik laat zien dat ik digitale media-concepten uit het blok beheers en bewuste mediakeuzes van onbewuste kan onderscheiden.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert videoproductie-stappen, koppelt mediabegrippen, categoriseert mediakeuzes en beantwoordt media-vragen.',
        },
        evidence: 'Je kunt uitleggen welke stap in videoproductie het concept vastlegt en wanneer een formatkeuze doelbewust is.',
    },
    'security-review': {
        primaryGoal: 'Ik laat zien dat ik cybersecurity-concepten uit het blok beheers door wachtwoorden te beoordelen, aanvallen te koppelen en gedrag te classificeren.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert wachtwoorden op sterkte, koppelt aanvallen aan tegenmaatregelen, categoriseert gedrag en beantwoordt security-vragen.',
        },
        evidence: 'Je kunt uitleggen waarom een sterk wachtwoord alleen niet genoeg is en welke tegenmaatregel bij welke aanval hoort.',
    },
    'advanced-code-review': {
        primaryGoal: 'Ik laat zien dat ik geavanceerde programmeer- en ML-concepten beheers door een ML-pipeline te ordenen, begrippen te koppelen en scenario\'s te classificeren.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert ML-stappen, koppelt geavanceerde begrippen, categoriseert leerstijlen en beantwoordt AI/ML-vragen.',
        },
        evidence: 'Je kunt de stappen van een ML-pipeline in de juiste volgorde zetten en overfitting van underfitting onderscheiden.',
    },
    'impact-review': {
        primaryGoal: 'Ik beoordeel maatschappelijke effecten van technologie en onderscheid kansen van risico\'s vanuit ethisch en beleidsmatig perspectief.',
        criteria: {
            type: 'rounds-complete',
            min: 4,
            description: 'Je sorteert impact-analyse-stappen, koppelt technologieën aan effecten, categoriseert kansen/risico\'s en beantwoordt ethische vragen.',
        },
        evidence: 'Je kunt een maatschappelijke impact-analyse opzetten en uitleggen wanneer iets een kans of een risico is voor de samenleving.',
    },

    // === BuilderCanvas ===
    'web-developer': {
        primaryGoal: 'Ik bouw een interactieve website met HTML-structuur, CSS-layout en JavaScript-interactiviteit en test het resultaat.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt HTML-structuur, CSS-layout, JavaScript-interactiviteit en testen uit.',
        },
        evidence: 'Je website heeft een werkende structuur, nette opmaak, interactieve elementen met addEventListener en een testverslag.',
    },
    'podcast-producer': {
        primaryGoal: 'Ik produceer een podcast van begin tot eind: onderwerp, structuur, pakkende intro en interviewvragen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt onderwerp, structuur, intro en vijf interviewvragen met doorvragen uit.',
        },
        evidence: 'Je podcast heeft een duidelijk onderwerp, een hook-first intro en vijf interviewvragen met follow-ups.',
    },
    'brand-builder': {
        primaryGoal: 'Ik ontwerp een merkidentiteit met brandpersoonlijkheid, kleurenpalet, logoconcept en een mini-stijlgids.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt merkanalyse, kleurenpalet, logoconcept en do/don\'t-regels uit.',
        },
        evidence: 'Je merkidentiteit heeft drie merkwoorden, een kleurenpalet met hexcodes en rollen, en een logobeschrijving.',
    },
    'video-editor': {
        primaryGoal: 'Ik bereid een korte video voor van concept tot montageplan met storyboard, shotlist en overgangen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt concept, storyboard, shotlist en montageplan uit.',
        },
        evidence: 'Je storyboard heeft minstens vijf scènes en je shotlist bevat minstens acht shots met type, locatie en back-up.',
    },
    'meme-machine': {
        primaryGoal: 'Ik analyseer meme-formaten, ontwerp mijn eigen meme-concept en reflecteer op verantwoord content maken.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je analyseert meme-formaten, onderzoekt viraliteit, ontwerpt een eigen meme en schrijft een persoonlijke richtlijn.',
        },
        evidence: 'Je meme-concept beschrijft doelgroep en format, en je richtlijn legt uit wanneer je iets wel of niet post.',
    },
    'digital-storyteller': {
        primaryGoal: 'Ik ontwerp een vertakkend interactief verhaal met keuzemomenten, meerdere eindes en twee uitgeschreven scènes.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt verhalidee, stroomschema, twee scènes en een presentatieplan uit.',
        },
        evidence: 'Je verhaal heeft twee keuzemomenten, minstens drie eindes en een openingsscène van 80+ woorden in de tweede persoon.',
    },
    'app-prototyper': {
        primaryGoal: 'Ik ontwerp een app die een schoolprobleem oplost met probleemanalyse, wireframes, gebruikersstromen en een testplan.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt probleemanalyse, drie wireframes, twee gebruikersstromen en een testplan met drie taken uit.',
        },
        evidence: 'Je app-ontwerp beschrijft het probleem in een value proposition-zin en bevat wireframes, fout-flow en testopzet.',
    },
    'automation-engineer': {
        primaryGoal: 'Ik identificeer een herhalende taak, schrijf pseudocode met IF/THEN en loops, en ontwerp een veilig testplan met dry-run.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt taakanalyse, pseudocode, Python-scriptstructuur en testplan uit.',
        },
        evidence: 'Je pseudocode heeft minstens acht stappen met IF/THEN en een FOR-loop, en je testplan beschrijft drie testcases met dry-run.',
    },
    'api-architect': {
        primaryGoal: 'Ik ontwerp een complete REST API met endpoints, authenticatie en professionele documentatie.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt REST-principes, minstens zes endpoints, JWT-authenticatie en API-documentatie voor twee endpoints uit.',
        },
        evidence: 'Je API-ontwerp beschrijft HTTP-methoden, statuscodes, request bodies en beveiligde vs. open endpoints.',
    },
    'open-source-contributor': {
        primaryGoal: 'Ik doorloop de volledige open source workflow: fork, branch, bugfix en pull request op GitHub.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt de Git-workflow, bug-analyse, bugfix met testcase en een professionele pull request uit.',
        },
        evidence: 'Je pull request beschrijft het probleem, de oplossing, teststappen en sluit een issue met "Closes #42".',
    },
    'startup-simulator': {
        primaryGoal: 'Ik ontwikkel een tech-startup van probleemdefinitie tot pitchstructuur als echte oprichter.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt probleem/oplossing, businessmodel, marktanalyse en zesdelige pitchstructuur uit.',
        },
        evidence: 'Je startup heeft een break-even-berekening, een USP ten opzichte van twee concurrenten en een 3-minuten pitch-outline.',
    },
    'innovation-lab': {
        primaryGoal: 'Ik kies een alledaags probleem (school, sport, hobby of thuis), ontwerp een technologische oplossing met Design Thinking, maak een MVP-concept en presenteer het.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt probleemkeuze, oplossingsontwerp, MVP-concept en presentatie uit.',
        },
        evidence: 'Je innovatie-ontwerp beschrijft wie de gebruikers zijn, hoe de kern-functie werkt en meetbare impact-indicatoren.',
    },
    'portfolio-builder': {
        primaryGoal: 'Ik stel een professioneel digitaal portfolio samen van mijn beste projecten met reflecties en een persoonlijk profiel.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt projectselectie, WWW-reflecties, portfoliostructuur en een persoonlijk profiel van 80–120 woorden uit.',
        },
        evidence: 'Je portfolio heeft minstens drie projecten met motivatie, twee reflecties in WWW-structuur en een bio in de eerste persoon.',
    },
    'prototype-developer': {
        primaryGoal: 'Ik bouw een digitaal prototype door de volledige cyclus te doorlopen: scopen, ontwerpen, bouwen en testen met echte gebruikers.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt probleemscope, prototypeontwerp, bouwlog en testresultaten met minstens twee testgebruikers uit.',
        },
        evidence: 'Je prototype-log beschrijft een opgeloste bug, de kernfunctie-status en een verbetering op basis van gebruikerstesten.',
    },
    'pitch-perfect': {
        primaryGoal: 'Ik bereid een overtuigende 5-minuten pitch voor mijn meesterproef voor met structuur, volledige tekst en voorbereide juryvragen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt zesdelige pitchstructuur, volledige pitchtekst, verwerkte feedback en vier juryvragen met antwoorden uit.',
        },
        evidence: 'Je pitch heeft een hook, probleemschets, oplossing, resultaat, reflectie en afsluiting met een kernzin per onderdeel.',
    },
    'meesterproef': {
        primaryGoal: 'Ik plan, bouw, documenteer en verdedig mijn eindproject als afsluitende meesterproef van drie jaar informatica.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt projectvoorstel, ontwikkellog, eindproductbeschrijving en verdedigingsvoorbereiding uit.',
        },
        evidence: 'Je meesterproef-dossier bevat een SMART-doel, drie werklogboekentries, eerlijke zelfevaluatie en antwoorden op juryvragen.',
    },

    // === DataViewer ===
    'data-journalist': {
        primaryGoal: 'Ik analyseer social media- en schermtijddata als datajournalist en trek onderbouwde conclusies over betrouwbaarheid van nieuwsartikelen.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert drie datasets over schermtijd en sociale media en beantwoordt vragen over bronkwaliteit.',
        },
        evidence: 'Je conclusie verwijst naar concrete getallen uit de data en je kunt uitleggen waarom een nieuwsartikel betrouwbaar of onbetrouwbaar is.',
    },
    'welzijnsonderzoeker': {
        primaryGoal: 'Ik onderzoek de relatie tussen schermtijd en welzijn met enquêtedata en CBS-statistieken en onderscheid correlatie van oorzakelijkheid.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert drie datasets over welzijn, schermgebruik en trends en beantwoordt vragen over verbanden en context.',
        },
        evidence: 'Je kunt uitleggen waarom correlatie geen oorzakelijkheid bewijst en hoe context (examen, vakantie) data beïnvloedt.',
    },
    'spreadsheet-specialist': {
        primaryGoal: 'Ik gebruik spreadsheet-formules zoals SOM, GEMIDDELDE en MAX om vragen te beantwoorden en data te filteren en sorteren.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert boekhouddata van de leerlingenraad en beantwoordt vragen met de juiste formules.',
        },
        evidence: 'Je kunt uitleggen welke formule een totaal, gemiddelde of maximum berekent en wanneer je filtert of sorteert.',
    },
    'api-verkenner': {
        primaryGoal: 'Ik lees JSON-antwoorden van een API, begrijp hoe URL-parameters werken en weet waarvoor een API-sleutel dient.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert JSON-data, API-aanvragen en voorbeeld-URLs van een weer-API.',
        },
        evidence: 'Je kunt een veld in een JSON-antwoord aanwijzen, uitleggen wat een URL-parameter doet en waarom een API-sleutel nodig is.',
    },
    'dashboard-designer': {
        primaryGoal: 'Ik kies de juiste visualisatie voor een dataset en selecteer zinvolle KPI\'s voor een schooldashboard.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert schoolprestatie-data en beantwoordt vragen over grafiektype, KPI-keuze en ontwerppricipes.',
        },
        evidence: 'Je kunt uitleggen wanneer je een taartdiagram of staafgrafiek kiest en welke KPI het meest informatief is.',
    },
    'network-navigator': {
        primaryGoal: 'Ik volg de weg van een bericht door het netwerk en begrijp wat DNS, routers, latency en HTTP-statuscodes betekenen.',
        criteria: {
            type: 'rounds-complete',
            min: 3,
            description: 'Je analyseert drie datasets over netwerksappen, pingtijden en HTTP-codes.',
        },
        evidence: 'Je kunt de zeven stappen van een netwerkreis benoemen en uitleggen wat de HTTP-statuscodes 200, 403, 404 en 500 betekenen.',
    },
    'data-pipeline': {
        primaryGoal: 'Ik identificeer datakwaliteitsproblemen in ruwe sensordata en kies de juiste transformatiestrategie voor een ETL-pipeline.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert sensordata, vergelijkt ruwe en gecleande gemiddelden en kiest transformatiestrategieën.',
        },
        evidence: 'Je kunt vijf datakwaliteitsproblemen benoemen in de sensordata en uitleggen wat "garbage in, garbage out" betekent.',
    },
    'ml-trainer': {
        primaryGoal: 'Ik begrijp hoe een supervised ML-model werkt met features, labels en trainings- en testsets, en herken overfitting.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert een spamfilter-dataset, vergelijkt modelnauwkeurigheden en beantwoordt ML-conceptvragen.',
        },
        evidence: 'Je kunt het verschil uitleggen tussen trainings- en testset en aanwijzen welk model overfit in de accuraatheidsdata.',
    },
    'neural-navigator': {
        primaryGoal: 'Ik bereken een forward pass door een neuraal netwerk en leg uit hoe lagen, gewichten en backpropagatie werken.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert neuronen met gewichten en biassen, vergelijkt trainingsresultaten en beantwoordt vragen over netwerklagen.',
        },
        evidence: 'Je kunt de output van een neuron berekenen met invoer, gewichten en bias, en uitleggen wat backpropagatie doet.',
    },
    'ux-detective': {
        primaryGoal: 'Ik analyseer gebruikersfeedback en SUS-scores om UX-problemen in schoolapps te identificeren en te prioriteren.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert UX-klachten, vergelijkt SUS-scores van vijf apps en beantwoordt UX-principevragen.',
        },
        evidence: 'Je kunt de SUS-drempelwaarde voor "goed" noemen en uitleggen welk UX-probleem het hoogst geprioriteerd moet worden.',
    },
    'digital-divide-researcher': {
        primaryGoal: 'Ik onderzoek internetsnelheden en apparaatgebruik per land en leeftijdsgroep en beoordeel de betrouwbaarheid van databronnen.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert CBS-data naar leeftijdsgroep, Europese breedbandcijfers en internationale connectiviteitsrapporten.',
        },
        evidence: 'Je kunt het procentuele verschil in internetsnelheid of apparaatbeschikbaarheid tussen leeftijdsgroepen of landen noemen en een databron beoordelen.',
    },
    'tech-impact-analyst': {
        primaryGoal: 'Ik voer een maatschappelijke impact-analyse uit van bezorgdrones en weeg de voordelen en risico\'s af met de vier-stappenmethode.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert een impactmatrix, vergelijkt perspectieven van verschillende stakeholders en beantwoordt vragen over de vier impact-analysestappen.',
        },
        evidence: 'Je kunt de vier stappen van een maatschappelijke impact-analyse benoemen en uitleggen hoe je voordelen en risico\'s van een technologie afweegt.',
    },
    'sustainability-scanner': {
        primaryGoal: 'Ik analyseer trends in digitaal gebruik (gaming, video- en muziekstreaming, sociale media, berichten) en trek onderbouwde observaties uit trenddata.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert gebruiksstatistieken per categorie, vergelijkt trends over tijd en beantwoordt vragen over trenddata lezen en berekeningen maken.',
        },
        evidence: 'Je kunt het verschil in gebruikstrend tussen twee digitale categorieën uitleggen en twee observaties onderbouwen met concrete cijfers.',
    },
    'eindproject-j2': {
        primaryGoal: 'Ik analyseer eindprojectresultaten uit jaar 2 en ontdek welke projecttypen en kwaliteiten tot de hoogste cijfers leiden.',
        criteria: {
            type: 'score-threshold',
            threshold: 65,
            description: 'Je analyseert projectscores van 16 leerlingen, vergelijkt gemiddelden per projecttype en leest tips van hoog-scorende leerlingen.',
        },
        evidence: 'Je kunt het best-scorende projecttype noemen en uitleggen welke component de sterkste voorspeller is van een hoog eindcijfer.',
    },

    // === DebateArena ===
    'ai-ethicus': {
        primaryGoal: 'Ik bouw een onderbouwd standpunt over de vraag of AI essays van leerlingen mag nakijken en reageer op het sterkste tegenargument.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier perspectieven, kiest een positie, formuleert argumenten en reflecteert op de dilemma\'s.',
        },
        evidence: 'Je eindstandpunt bevat minimaal twee argumenten voor jouw positie en een reactie op het sterkste tegenargument.',
    },
    'digital-rights-defender': {
        primaryGoal: 'Ik neem een onderbouwd standpunt in over dataverzameling door scholen via trackingapps en verdedig de digitale rechten van leerlingen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier perspectieven, kiest een positie, formuleert argumenten en reflecteert op privacy en controle.',
        },
        evidence: 'Je standpunt beschrijft wanneer dataverzameling helpen wordt en wanneer controleren, met minimaal twee onderbouwde argumenten.',
    },
    'tech-court': {
        primaryGoal: 'Ik beoordeel of een bedrijf schuldig is aan indirecte discriminatie door een CV-screening AI en onderbouw mijn juridische oordeel.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier standpunten uit de rechtszaal, kiest je oordeel, bouwt argumenten en reflecteert op systeemverantwoordelijkheid.',
        },
        evidence: 'Je oordeel noemt de betrokken partijen, de kern van het discriminatie-verwijt en wie volgens jou (mede-)verantwoordelijk is.',
    },
    'future-forecaster': {
        primaryGoal: 'Ik formuleer een visie op de rol van menselijke leraren in 2040 als AI gepersonaliseerd onderwijs kan geven en onderbouw die met argumenten.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier toekomstperspectieven, kiest een model, bouwt argumenten en reflecteert op wat onderwijs uniek menselijk maakt.',
        },
        evidence: 'Je toekomstvisie kiest een van de vier modellen en onderbouwt waarom menselijk onderwijs wel of niet vervangbaar is.',
    },
    'policy-maker': {
        primaryGoal: 'Ik adviseer als beleidsmaker over telefoonbeleid op school en weeg de belangen van leerlingen, docenten, ouders en directie zorgvuldig af.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier stakeholderperspectieven, kiest een beleidsoptie, bouwt argumenten en reflecteert op de afweging tussen de betrokken partijen.',
        },
        evidence: 'Je beleidsadvies kiest een van de vier opties en onderbouwt de keuze met argumenten vanuit minimaal twee perspectieven.',
    },
    'reflection-report': {
        primaryGoal: 'Ik formuleer een standpunt over de rol van reflectie en ethisch denken in het informatica-curriculum en onderbouw waarom dit wel of niet een kerndoel moet zijn.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest vier perspectieven op de eindreflectie, kiest een positie, bouwt argumenten en sluit je drie jaar informatica bewust af.',
        },
        evidence: 'Je eindstandpunt beschrijft welke plek reflectie in informatica verdient en bevat minimaal twee argumenten voor die keuze.',
    },
};

export function getMissionGoal(missionId: string): MissionGoal | undefined {
    return MISSION_GOALS[missionId];
}
