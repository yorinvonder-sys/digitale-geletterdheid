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
            type: 'component-complete',
            description: 'Je doorloopt de promptlevels en verbetert je prompt op basis van feedback.',
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
            type: 'rounds-complete',
            description: 'Je leest standpunten, kiest positie, geeft argumenten en reflecteert.',
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
            min: 4,
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
};

export function getMissionGoal(missionId: string): MissionGoal | undefined {
    return MISSION_GOALS[missionId];
}
