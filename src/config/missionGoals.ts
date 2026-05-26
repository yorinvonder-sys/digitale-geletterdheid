import type { MissionGoal } from '@/features/missions/templates/shared/types';

export const MISSION_GOALS: Record<string, MissionGoal> = {
    'magister-master': {
        primaryGoal: 'Laat zien dat je zelfstandig de belangrijkste Magister-onderdelen voor school kunt vinden.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier stappen zijn afgerond met checklist, checkvraag en docentcheck.',
        },
        evidence: 'Je toont waar rooster, huiswerk, berichten en cijfers staan zonder persoonlijke gegevens hardop te delen.',
    },
    'cloud-commander': {
        primaryGoal: 'Orden, upload en deel schoolbestanden veilig in de cloud.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je rondt openen, map maken, uploaden en delen af.',
        },
        evidence: 'Je hebt een School-map, een geupload bestand en een veilige deelactie laten zien.',
    },
    'word-wizard': {
        primaryGoal: 'Maak een verzorgd schooldocument met duidelijke koppen, tekst en beeld.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je gebruikt documentopmaak, controleert de leesbaarheid en bewaart het bestand netjes.',
        },
        evidence: 'Je document heeft een titel, koppen, nette tekst, een afbeelding en een logische bestandsnaam.',
    },
    'slide-specialist': {
        primaryGoal: 'Maak een korte presentatie die rustig oogt en begrijpelijk is voor je publiek.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt slides met kernwoorden, beeld en een duidelijke volgorde.',
        },
        evidence: 'Je presentatie heeft leesbare slides, passend beeld en een korte uitleg per slide.',
    },
    'print-pro': {
        primaryGoal: 'Print en lever een schoolbestand correct in met de juiste printerinstellingen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je kiest het bestand, controleert instellingen, print en levert het bewijs in.',
        },
        evidence: 'Je kunt uitleggen welke printer, pagina-instelling en inleverstap je gebruikte.',
    },
    'cloud-cleaner': {
        primaryGoal: 'Ruim digitale schoolbestanden op door ze in logische mappen te plaatsen.',
        criteria: {
            type: 'component-complete',
            description: 'Je sorteert bestanden correct en controleert je mapstructuur.',
        },
        evidence: 'De bestanden staan in passende mappen en je kunt je keuzes uitleggen.',
    },
    'layout-doctor': {
        primaryGoal: 'Verbeter een rommelig Word-document zodat het leesbaar en professioneel wordt.',
        criteria: {
            type: 'component-complete',
            description: 'Je past de gevraagde opmaakverbeteringen toe.',
        },
        evidence: 'Het document heeft duidelijke koppen, consistente tekst en betere plaatsing van beeld.',
    },
    'pitch-police': {
        primaryGoal: 'Beoordeel en verbeter slides op rust, contrast en duidelijke boodschap.',
        criteria: {
            type: 'component-complete',
            description: 'Je spoort slideproblemen op en past verbeteringen toe.',
        },
        evidence: 'Je kunt per verbeterde slide noemen wat rustiger, leesbaarder of sterker is geworden.',
    },
    'prompt-master': {
        primaryGoal: 'Schrijf prompts die beter worden door context, vorm en duidelijke eisen toe te voegen.',
        criteria: {
            type: 'component-complete',
            description: 'Je doorloopt de promptlevels en verbetert je prompt op basis van feedback.',
        },
        evidence: 'Je eindprompt bevat context, opdracht, vorm en kwaliteitscriteria.',
    },
    'game-programmeur': {
        primaryGoal: 'Pas gamegedrag aan met duidelijke instructies en test wat er verandert.',
        criteria: {
            type: 'component-complete',
            description: 'Je geeft opdrachten, bekijkt het resultaat en verbetert je instructies.',
        },
        evidence: 'Je game laat zichtbaar aangepast gedrag zien en je kunt uitleggen welke opdracht dat veroorzaakte.',
    },
    'ai-trainer': {
        primaryGoal: 'Train een AI-model met voorbeelden en controleer of de uitkomst klopt.',
        criteria: {
            type: 'component-complete',
            description: 'Je verzamelt voorbeelden, traint het model en test meerdere voorspellingen.',
        },
        evidence: 'Je kunt aanwijzen welke trainingsvoorbeelden hielpen en waar het model nog fouten maakt.',
    },
    'chatbot-trainer': {
        primaryGoal: 'Bouw en test chatbotregels die passende antwoorden geven op leerlingvragen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt intents, antwoorden en testgesprekken.',
        },
        evidence: 'Je chatbot reageert op meerdere voorbeeldvragen met passende antwoorden.',
    },
    'verhalen-ontwerper': {
        primaryGoal: 'Ontwerp een kort verhaal met AI-beeld en tekst die samen een logisch geheel vormen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt verhaalkeuzes, prompts en een samenhangende uitwerking.',
        },
        evidence: 'Je verhaal heeft een begin, vervolg, beeldkeuzes en een korte toelichting op je prompts.',
    },
    'game-director': {
        primaryGoal: 'Programmeer Robbie door vijf levels heen en leg uit wat duidelijke instructies met AI te maken hebben.',
        criteria: {
            type: 'component-complete',
            description: 'Je voltooit de levels en reflecteert op de gebruikte instructies.',
        },
        evidence: 'Robbie haalt de doelen en je kunt uitleggen welke blokken het gedrag bepalen.',
    },
    'ai-tekengame': {
        primaryGoal: 'Laat zien hoe AI een tekening kan herkennen en waar herkenning lastig wordt.',
        criteria: {
            type: 'component-complete',
            description: 'Je speelt meerdere tekenrondes en bespreekt herkenningsverschillen.',
        },
        evidence: 'Je kunt voorbeelden noemen van tekeningen die de AI goed en minder goed herkende.',
    },
    'ai-beleid-brainstorm': {
        primaryGoal: 'Bedenk bruikbare AI-afspraken voor school en onderbouw waarom ze nodig zijn.',
        criteria: {
            type: 'component-complete',
            description: 'Je levert voorstellen, stemt of kiest, en legt je keuze uit.',
        },
        evidence: 'Je hebt minimaal twee concrete AI-regels met reden en schoolsituatie.',
    },
    'code-denker': {
        primaryGoal: 'Herken programmeerlogica door stappen, voorwaarden en volgorde goed te lezen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je rondt de scenario-rondes af en verklaart je keuzes.',
        },
        evidence: 'Je kunt uitleggen welke volgorde of voorwaarde de juiste uitkomst geeft.',
    },
    'website-bouwer': {
        primaryGoal: 'Bouw een werkende Over Mij-webpagina met HTML, CSS en een korte uitleg van je keuzes.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt structuur, styling, inhoud en controleert het resultaat.',
        },
        evidence: 'Je pagina toont tekst, opmaak en een duidelijke persoonlijke boodschap.',
    },
    'schermtijd-coach': {
        primaryGoal: 'Bouw een onderbouwd standpunt over wie verantwoordelijk is voor gezonde schermtijd.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest standpunten, kiest positie, geeft argumenten en reflecteert.',
        },
        evidence: 'Je eindstandpunt bevat minimaal twee argumenten en een reflectie op je eigen gedrag.',
    },
    'notificatie-ninja': {
        primaryGoal: 'Herken hoe notificaties je aandacht sturen en kies bewuste instellingen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert aandachtstrekkers, rangschikt meldingen en kiest verbeteracties.',
        },
        evidence: 'Je benoemt minimaal twee notificatie-instellingen of gewoontes die je bewuster maakt.',
    },
    'review-week-2': {
        primaryGoal: 'Beoordeel AI- en codevoorbeelden kritisch en herken wat beter moet.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je rondt de reviewrondes af en kiest onderbouwde verbeteringen.',
        },
        evidence: 'Je kunt per fout uitleggen waarom die fout is en hoe je hem verbetert.',
    },
    'data-detective': {
        primaryGoal: 'Onderzoek hoe apps data gebruiken en kies bewust welke data je wel of niet deelt.',
        criteria: {
            type: 'component-complete',
            description: 'Je analyseert appdata en maakt privacykeuzes.',
        },
        evidence: 'Je kunt uitleggen welke appgegevens gevoelig zijn en welke keuze veiliger is.',
    },
    'data-verzamelaar': {
        primaryGoal: 'Verzamel data netjes en trek een eenvoudige conclusie uit je resultaten.',
        criteria: {
            type: 'component-complete',
            description: 'Je verzamelt, bekijkt en gebruikt data voor een klein advies.',
        },
        evidence: 'Je data-overzicht leidt tot een conclusie of advies dat je kunt uitleggen.',
    },
    'deepfake-detector': {
        primaryGoal: 'Herken deepfake-signalen in beeld, tekst en claims en maak een kort actieplan tegen misleiding.',
        criteria: {
            type: 'component-complete',
            description: 'Je onderzoekt voorbeelden en kiest controleacties.',
        },
        evidence: 'Je noemt signalen en controleert bron, context of beeldkenmerken.',
    },
    'ai-spiegel': {
        primaryGoal: 'Ontdek welke data een AI-profiel over jou kan vormen en welke privacykeuzes je hebt.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je test instellingen en beantwoordt de analysevragen.',
        },
        evidence: 'Je benoemt welke data gevoelig is en welke instelling meer controle geeft.',
    },
    'social-safeguard': {
        primaryGoal: 'Herken online risicosituaties en kies een veilige, helpende reactie.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je beoordeelt scenario’s en kiest passende acties.',
        },
        evidence: 'Je kunt uitleggen wanneer je bewaart, blokkeert, meldt of hulp vraagt.',
    },
    'scroll-stopper': {
        primaryGoal: 'Onderbouw een standpunt over verslavend app-design met belangen van meerdere partijen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest stakeholders, kiest positie, bouwt argumenten en reflecteert.',
        },
        evidence: 'Je eindantwoord bevat een positie, argumenten en reactie op een tegenargument.',
    },
    'cookie-crusher': {
        primaryGoal: 'Herken cookiekeuzes en dark patterns zodat je bewuster toestemming geeft.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert cookievoorbeelden en kiest privacyvriendelijke opties.',
        },
        evidence: 'Je kunt uitleggen welke knop of tekst je richting onnodig delen duwt.',
    },
    'mail-detective': {
        primaryGoal: 'Herken signalen van phishing en kies een veilige actie bij verdachte mail.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je onderzoekt mails op afzender, link, taal en urgentie.',
        },
        evidence: 'Je kunt minimaal drie phishing-signalen aanwijzen en een veilige vervolgstap kiezen.',
    },
    'data-handelaar': {
        primaryGoal: 'Beoordeel datasituaties op privacy, toestemming en eerlijk gebruik.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je lost datapuzzels op en verklaart welke handelwijze wel of niet mag.',
        },
        evidence: 'Je kunt per casus uitleggen welke data gevoelig is en waarom.',
    },
    'filter-bubble-breaker': {
        primaryGoal: 'Vergelijk feeds en ontdek hoe aanbevelingen je beeld van de wereld kunnen sturen.',
        criteria: {
            type: 'component-complete',
            description: 'Je vergelijkt, analyseert en reflecteert op filterbubbels.',
        },
        evidence: 'Je noemt verschillen tussen feeds en schrijft wat je bewuster wilt controleren.',
    },
    'datalekken-rampenplan': {
        primaryGoal: 'Maak een stappenplan voor een datalek en kies wat eerst moet gebeuren.',
        criteria: {
            type: 'component-complete',
            description: 'Je onderzoekt bewijs, prioriteert acties en maakt een melding of plan.',
        },
        evidence: 'Je crisisplan noemt wie je informeert, welke data geraakt is en welke actie eerst komt.',
    },
    'data-voor-data': {
        primaryGoal: 'Weeg af welke persoonlijke data je wel of niet wilt ruilen voor digitale voordelen.',
        criteria: {
            type: 'component-complete',
            description: 'Je maakt keuzes in de dataveiling en reflecteert op je grenzen.',
        },
        evidence: 'Je kunt minimaal twee datakeuzes onderbouwen met privacy en voordeel.',
    },
    'data-speurder': {
        primaryGoal: 'Onderzoek data, kies passende visualisaties en trek een conclusie die je met bewijs kunt uitleggen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je analyseert datasets en beantwoordt de vragen met onderbouwing.',
        },
        evidence: 'Je conclusie verwijst naar een getal, patroon of grafiek.',
    },
    'ux-detective': {
        primaryGoal: 'Onderzoek UX-data, herken de grootste gebruiksproblemen en onderbouw welke verbetering prioriteit heeft.',
        criteria: {
            type: 'component-complete',
            description: 'Je analyseert de datasets, beantwoordt de vragen en kiest een UX-verbetering met data-onderbouwing.',
        },
        evidence: 'Je antwoorden verwijzen naar gebruikersonderzoek, usability-scores en een prioriteit op basis van impact.',
    },
    'podcast-producer': {
        primaryGoal: 'Ontwerp een podcastconcept met doelgroep, structuur, sterke intro en open interviewvragen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt onderwerp, structuur, intro en interviewvragen uit.',
        },
        evidence: 'Je podcastplan bevat een doelgroep, segmenten, hook en minimaal vijf interviewvragen.',
    },
    'meme-machine': {
        primaryGoal: 'Analyseer waarom content gedeeld wordt en ontwerp een meme of post met bewuste boodschap en verantwoordelijkheid.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je analyseert formats, viraliteit en impact voordat je eigen content ontwerpt.',
        },
        evidence: 'Je meme-ontwerp benoemt format, doelgroep, deelreden en grens tussen humor en schadelijke content.',
    },
    'digital-storyteller': {
        primaryGoal: 'Ontwerp een interactief verhaal waarin keuzes, structuur en digitale presentatie logisch samenwerken.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt setting, flowchart, scenes en presentatievorm uit.',
        },
        evidence: 'Je verhaal heeft een hoofdpersoon, keuzemomenten, minimaal drie eindes en een digitale presentatiekeuze.',
    },
    'brand-builder': {
        primaryGoal: 'Ontwerp een merkidentiteit die doelgroep, merkwaarden, kleur, logo en huisstijl bewust verbindt.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je bepaalt merk, kleurenpalet, logo-concept en huisstijlgids.',
        },
        evidence: 'Je merkpresentatie bevat doelgroep, merkwoorden, kleurkeuzes, logo-uitleg en consistente huisstijlregels.',
    },
    'video-editor': {
        primaryGoal: 'Plan een korte video met doel, storyboard, shotlist en montagekeuzes voordat je gaat produceren.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt concept, storyboard, shotlist en montageplan uit.',
        },
        evidence: 'Je videoplan bevat doelgroep, centrale boodschap, minimaal vijf scenes, acht shots en montagekeuzes.',
    },
    'online-helden': {
        primaryGoal: 'Herken cyberpesten en kies als bijstander een veilige, helpende reactie die de situatie niet verergert.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je beoordeelt scenario’s, rangschikt gedrag en kiest onderbouwde bijstanderacties.',
        },
        evidence: 'Je kunt uitleggen wanneer je bewaart, meldt, steun biedt of hulp inschakelt.',
    },
    'media-review': {
        primaryGoal: 'Bewijs dat je media-keuzes, UX, branding, storytelling en doelgroepgericht ontwerpen kunt beoordelen.',
        criteria: {
            type: 'score-threshold',
            threshold: 70,
            description: 'Je rondt de reviewrondes af en haalt minimaal het niveau Scherp Mediabewust.',
        },
        evidence: 'Je score en ronde-antwoorden laten zien dat je productievolgorde, begrippen en bewuste mediakeuzes begrijpt.',
    },
    'ai-ethicus': {
        primaryGoal: 'Onderzoek AI-bias vanuit meerdere perspectieven en formuleer een verdedigbaar standpunt.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest perspectieven, kiest positie, bouwt argumenten en reflecteert op je mening.',
        },
        evidence: 'Je standpunt noemt minstens twee argumenten en een gevolg voor leerlingen of school.',
    },
    'digital-rights-defender': {
        primaryGoal: 'Onderzoek welke data een school mag verzamelen en verdedig digitale rechten van leerlingen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest perspectieven, kiest positie, bouwt argumenten en reflecteert op privacygrenzen.',
        },
        evidence: 'Je standpunt verbindt een recht, risico of regel aan een concrete schoolpraktijk.',
    },
    'tech-court': {
        primaryGoal: 'Beoordeel een tech-dilemma als rechtszaak en onderbouw een eerlijk oordeel.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je onderzoekt rollen, kiest positie, bouwt argumenten en reageert op tegenwerpingen.',
        },
        evidence: 'Je oordeel noemt maatschappelijke gevolgen en wat dit betekent voor digitaal welzijn.',
    },
    'future-forecaster': {
        primaryGoal: 'Voorspel hoe technologie de toekomst kan veranderen en weeg voordelen en risico’s af.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je verkent perspectieven, kiest positie, bouwt argumenten en reflecteert op je voorspelling.',
        },
        evidence: 'Je toekomstvisie noemt minstens een kans, een risico en wie erdoor geraakt wordt.',
    },
    'eindproject-j2': {
        primaryGoal: 'Bereid je eindproject voor door projectdata te analyseren en een eigen idee te onderbouwen.',
        criteria: {
            type: 'component-complete',
            description: 'Je onderzoekt voorbeeldprojecten, vergelijkt keuzes en formuleert een haalbaar projectidee.',
        },
        evidence: 'Je voorbereiding noemt een probleem, doelgroep, projectvorm en onderbouwing uit de data.',
    },
    'digitale-balans-coach': {
        primaryGoal: 'Maak een persoonlijk en haalbaar plan voor digitale balans en privacy.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je verkent standpunten, kiest acties en reflecteert op je eigen balans.',
        },
        evidence: 'Je plan bevat minstens twee haalbare afspraken voor schermgebruik of privacy.',
    },
    'mission-blueprint': {
        primaryGoal: 'Maak een duidelijk plan voor je eindproject met taken, volgorde en opslagplek.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je beschrijft project, taken, volgorde en cloudopslag.',
        },
        evidence: 'Je projectplan heeft een doel, takenlijst, planning en gedeelde opslagplek.',
    },
    'mission-vision': {
        primaryGoal: 'Ontwikkel een duidelijke visie voor je eindproject met publiek, boodschap en sfeer.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je werkt doel, doelgroep, boodschap en visuele richting uit.',
        },
        evidence: 'Je kunt laten zien voor wie je project is en welke stijl of boodschap erbij hoort.',
    },
    'mission-launch': {
        primaryGoal: 'Presenteer je eindproject duidelijk met een korte lancering en passende materialen.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Je maakt lanceringsmateriaal, controleert de boodschap en presenteert.',
        },
        evidence: 'Je hebt een flyer, pitch of uitleg waarmee iemand je project begrijpt.',
    },
    'review-week-3': {
        primaryGoal: 'Beoordeel digitale dilemma’s vanuit privacy, AI en maatschappelijke gevolgen.',
        criteria: {
            type: 'rounds-complete',
            description: 'Je leest perspectieven, neemt positie in en onderbouwt je advies.',
        },
        evidence: 'Je advies noemt voordelen, risico’s en een keuze die je kunt verdedigen.',
    },
    'ipad-print-instructies': {
        primaryGoal: 'Print vanaf een iPad door de juiste app, printer en stappen te gebruiken.',
        criteria: {
            type: 'component-complete',
            description: 'Je installeert of opent de printapp, kiest printerinstellingen en test de print.',
        },
        evidence: 'Je kunt de printstappen zelfstandig voordoen of uitleggen.',
    },
};

export function getMissionGoal(missionId: string): MissionGoal | undefined {
    return MISSION_GOALS[missionId];
}
