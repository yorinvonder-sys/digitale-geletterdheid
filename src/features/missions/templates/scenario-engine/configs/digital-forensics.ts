import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'digital-forensics',
    title: 'Digital Forensics',
    introEmoji: '🕵️',
    introTitle: 'Digital Forensics',
    introDescription:
        'Elke keer dat iemand een computer gebruikt, laat hij digitale sporen achter: in logbestanden, metadata en netwerkdata. Als digitaal forensisch analist leer jij die sporen lezen, een tijdlijn reconstrueren en een onderbouwde conclusie trekken — net als bij de politie.',
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Open het forensisch dossier en pin het eerste digitale spoor dat de tijdlijn verandert.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Feedback maakt onderscheid tussen feit, aanname en bruikbaar digitaal bewijs.',
        visualKit: 'casefile',
        evidenceMoment: 'Leerlingen leveren spoorselectie, tijdlijnvolgorde en onderbouwde conclusie.',
        antiBoringRule: 'Geen definities vooraf: leerlingen bouwen eerst een bewijsdossier en benoemen daarna de forensische regel.',
        chromeAcceptance: 'Dossierkaart, bewijsselectie, prioritering en resultaatfeedback passen zonder overlap.',
    },
    introFeatures: [
        'Herken verdachte patronen in gesimuleerde logbestanden',
        'Rangschik gebeurtenissen chronologisch om een tijdlijn op te bouwen',
        'Leer het verschil tussen feiten en aannames',
        'Ontdek hoe digitaal bewijs wordt verzameld en gedocumenteerd',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🏆',
            title: 'Hoofd Forensisch Analist',
            color: '#0B453F',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Digitale Speurder',
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
        'Elke digitale handeling laat een spoor achter — een timestamp, een IP-adres, een logregel.',
        'Een goede forensisch analist concludeert alleen wat de data bewijst, niet meer.',
        'Herhaalde mislukte inlogpogingen gevolgd door een succesvolle inlog zijn een klassiek patroon bij brute force aanvallen.',
        'Bewijsketen (chain of custody): bewijs mag nooit worden gewijzigd nadat het is verzameld.',
        'Digitaal forensisch bewijs speelt steeds vaker een rol in rechtszaken — nauwkeurigheid is dan een juridische verantwoordelijkheid.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'verdachte-logregels',
            emoji: '🚨',
            title: 'Herken verdachte logregels',
            description:
                'Hieronder zie je logregels uit een serverlogboek. Welke regels zijn verdacht en wijzen op een mogelijke aanval of beveiligingsincident? Selecteer ze.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Scherpe analyse! Je ziet de patronen die een aanval verraden.',
            feedbackIncorrect:
                'Sommige signalen zijn subtiel. Een forensisch analist let op combinaties van regels, niet alleen op één logregel.',
            items: [
                {
                    id: 1,
                    icon: '🔁',
                    title: 'Vijf mislukte inlogpogingen binnen 10 seconden',
                    description:
                        '22:54:10 | LOGIN FAILED | user: admin\n22:54:11 | LOGIN FAILED | user: admin\n22:54:12 | LOGIN FAILED | user: admin\n22:54:13 | LOGIN FAILED | user: admin\n22:54:19 | LOGIN SUCCESS | user: admin',
                    correct: true,
                    explanation:
                        'Dit is een brute force aanval: razendsnel proberen totdat het werkt. Vijf pogingen in 9 seconden is niet menselijk typgedrag. De succesvolle inlog daarna is extra alarmerend.',
                },
                {
                    id: 2,
                    icon: '🌅',
                    title: 'Inloggen op maandagochtend 08:45',
                    description:
                        '2024-03-11 08:45:22 | LOGIN SUCCESS | user: medewerker_jan | IP: 192.168.1.15',
                    correct: false,
                    explanation:
                        'Dit is volkomen normaal. Een medewerker die op maandagochtend inlogt via het interne netwerk (192.168.x.x is een intern IP-adres) is geen verdacht gedrag.',
                },
                {
                    id: 3,
                    icon: '🕒',
                    title: 'Inloggen midden in de nacht',
                    description:
                        '2024-03-09 03:17:44 | LOGIN SUCCESS | user: directeur_bakker | IP: 178.45.22.11',
                    correct: true,
                    explanation:
                        'Een inlog midden in de nacht van een account dat normaal overdag actief is, met een onbekend extern IP-adres, is verdacht. Het kan een inbraak zijn — of de directeur die thuis werkt. Nader onderzoek is nodig.',
                },
                {
                    id: 4,
                    icon: '📁',
                    title: 'Normaal bestandsbeheer',
                    description:
                        '2024-03-10 10:22:18 | FILE_ACCESS | user: secretaresse | file: agenda_2024.xlsx | action: READ',
                    correct: false,
                    explanation:
                        'Een secretaresse die overdag een agendabestand leest is normaal gedrag. Er is geen reden tot argwaan op basis van deze logregel.',
                },
                {
                    id: 5,
                    icon: '📤',
                    title: 'Grote hoeveelheid data gedownload',
                    description:
                        '2024-03-08 22:55:41 | DATA_EXPORT | user: extern_account | bytes_transferred: 847.000.000 | destination: 185.22.103.55',
                    correct: true,
                    explanation:
                        'Dit is een alarmsignaal. 847 MB aan data geëxporteerd door een extern account naar een onbekend IP-adres buiten het bedrijfsnetwerk. Dit past bij een datalek of data-exfiltratie aanval.',
                },
                {
                    id: 6,
                    icon: '🔍',
                    title: 'Portscan van een intern IP-adres',
                    description:
                        '2024-03-08 22:51:03 | PORT_SCAN_DETECTED | source_IP: 10.0.5.44 | scanned_ports: 1-65535',
                    correct: true,
                    explanation:
                        'Een portscan over alle 65.535 poorten is een klassieke eerste stap van een aanvaller die het netwerk verkent. Het feit dat dit van een intern IP-adres komt suggereert dat een intern apparaat al is gecompromitteerd.',
                },
                {
                    id: 7,
                    icon: '🖨️',
                    title: 'Printer wordt gebruikt voor een printopdracht',
                    description:
                        '2024-03-10 14:30:05 | PRINT_JOB | user: leraar_vos | printer: printer_lokaal_3 | pages: 12',
                    correct: false,
                    explanation:
                        'Gewone printopdracht. Geen verdachte kenmerken: bekende gebruiker, bekende printer, overdag, klein documentje.',
                },
                {
                    id: 8,
                    icon: '🔑',
                    title: 'Aanmaken van een nieuw beheerdersaccount buiten kantooruren',
                    description:
                        '2024-03-08 23:12:07 | ACCOUNT_CREATED | new_user: admin_backup2 | role: SUPERADMIN | created_by: admin | IP: 10.0.5.44',
                    correct: true,
                    explanation:
                        'Een nieuw superadmin-account aanmaken midden in de nacht, van hetzelfde IP-adres als de eerdere portscan, is een sterke aanwijzing voor privilege escalation — een aanvaller die zichzelf permanente toegang geeft.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'tijdlijn-bouwen',
            emoji: '⏱️',
            title: 'Bouw de tijdlijn',
            description:
                'Hieronder staan vijf logregels uit een incident bij een ziekenhuis. Zet ze in de juiste chronologische volgorde (1e = eerste wat er is gebeurd).',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Perfecte tijdlijn! Je kunt nu de aanval reconstrueren en rapporteren.',
            feedbackIncorrect:
                'Kijk goed naar de timestamps. Elke seconde telt in forensisch onderzoek.',
            items: [
                {
                    id: 1,
                    icon: '🔍',
                    title: 'Portscan: verkenning van het netwerk',
                    description:
                        '22:51:03 | IP: 10.0.5.44 | PORT_SCAN_DETECTED — aanvaller verkent welke systemen er zijn en welke poorten open staan.',
                    correctPosition: 0,
                    explanation:
                        'Eerste stap: verkenning. Voordat een aanvaller iets doet, brengt hij het doelwit in kaart. Een portscan is bijna altijd de eerste stap van een gerichte aanval.',
                },
                {
                    id: 2,
                    icon: '❌',
                    title: 'Mislukte inlogpogingen',
                    description:
                        '22:54:17 en 22:54:19 | LOGIN FAILED | user: dr_bakker — aanvaller probeert wachtwoord te raden.',
                    correctPosition: 1,
                    explanation:
                        'Tweede stap: toegang proberen te krijgen. Na de verkenning richt de aanvaller zich op een specifiek account en probeert in te loggen.',
                },
                {
                    id: 3,
                    icon: '✅',
                    title: 'Succesvolle inlog',
                    description:
                        '22:54:22 | LOGIN SUCCESS | user: dr_bakker — aanvaller heeft toegang gekregen tot het account.',
                    correctPosition: 2,
                    explanation:
                        'Derde stap: toegang verkregen. Na twee mislukte pogingen lukt het. Dit kan betekenen dat het wachtwoord zwak was of dat de aanvaller het wachtwoord al kende.',
                },
                {
                    id: 4,
                    icon: '📂',
                    title: 'Toegang tot patiëntgegevens',
                    description:
                        '22:55:41 | ACCESS | database: patient_records | rows: 847 — aanvaller leest 847 patiëntdossiers.',
                    correctPosition: 3,
                    explanation:
                        'Vierde stap: het doel bereiken. De aanvaller heeft toegang tot de patiëntendatabase en raadpleegt 847 dossiers. Dit is het feitelijke datalek.',
                },
                {
                    id: 5,
                    icon: '🚪',
                    title: 'Uitloggen',
                    description:
                        '22:58:03 | LOGOUT | user: dr_bakker — aanvaller verlaat het systeem na het incident.',
                    correctPosition: 4,
                    explanation:
                        'Vijfde stap: vertrekken. De aanvaller logt netjes uit, mogelijk om minder sporen achter te laten. Het totale incident duurde slechts 7 minuten.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'feit-of-aanname',
            emoji: '⚖️',
            title: 'Feit of aanname?',
            description:
                'Een forensisch analist mag alleen concluderen wat de data bewijst. Is onderstaande uitspraak een bewezen feit of een aanname die niet uit de logdata volgt?',
            type: 'binary-choice',
            acceptLabel: 'Feit',
            rejectLabel: 'Aanname',
            maxScore: 25,
            feedbackCorrect: 'Correct! Je maakt het cruciale onderscheid tussen bewijs en speculatie.',
            feedbackIncorrect: 'Lastig. Een rechter accepteert alleen wat de data direct bewijst.',
            items: [
                {
                    id: 1,
                    icon: '⏰',
                    title: '"De inlog vond plaats om 22:54:22"',
                    description:
                        'Op basis van de logregel: 22:54:22 | LOGIN SUCCESS | user: dr_bakker',
                    correct: true,
                    explanation:
                        'Dit is een feit. De timestamp staat letterlijk in de logdata. Timestamps in serverlogboeken worden automatisch gegenereerd en zijn betrouwbaar bewijs.',
                },
                {
                    id: 2,
                    icon: '👤',
                    title: '"Dr. Bakker heeft zelf ingelogd"',
                    description:
                        'Op basis van de logregel: LOGIN SUCCESS | user: dr_bakker | IP: 10.0.5.44',
                    correct: false,
                    explanation:
                        'Dit is een aanname. De log bewijst alleen dat er is ingelogd met de inloggegevens van dr_bakker. Dat kan de echte dr. Bakker zijn — of iemand die zijn wachtwoord heeft gestolen. De identiteit van de persoon is niet bewezen.',
                },
                {
                    id: 3,
                    icon: '🌐',
                    title: '"Het aanvals-IP-adres 10.0.5.44 is een intern netwerkapparaat"',
                    description:
                        'IP-adressen die beginnen met 10.x.x.x zijn per definitie privé/interne adressen (RFC 1918 standaard).',
                    correct: true,
                    explanation:
                        'Dit is een feit — een technisch bewezen gegeven. 10.0.0.0/8 is een gereserveerd privéadresbereik. Dit IP-adres kan nooit van buiten het netwerk afkomstig zijn.',
                },
                {
                    id: 4,
                    icon: '😤',
                    title: '"De aanvaller was een ontevreden medewerker"',
                    description:
                        'Op basis van de logbestanden is een aanval reconstructeerd. Er is geen ander bewijs over de motivatie.',
                    correct: false,
                    explanation:
                        'Dit is een aanname. De logdata zegt niets over de motivatie of identiteit van de aanvaller. Motivatie is een strafvorderlijke conclusie die extra bewijs vereist — geen forensische loganalyse.',
                },
                {
                    id: 5,
                    icon: '📊',
                    title: '"Er zijn 847 patiëntdossiers ingezien"',
                    description:
                        'Op basis van: ACCESS | database: patient_records | rows: 847',
                    correct: true,
                    explanation:
                        'Dit is een feit. De database-logregel registreert exact hoeveel rijen er zijn opgevraagd. Dit is technisch meetbaar en betrouwbaar als bewijs voor de omvang van het datalek.',
                },
                {
                    id: 6,
                    icon: '🌍',
                    title: '"De aanvaller bevindt zich in het buitenland"',
                    description:
                        'Het IP-adres 10.0.5.44 is gedetecteerd als aanvals-IP. Op basis hiervan concludeert iemand dat de aanvaller in het buitenland zit.',
                    correct: false,
                    explanation:
                        'Dit is onjuist én een aanname. 10.0.5.44 is een intern IP-adres — dit kan nooit van buiten het netwerk komen. Bovendien zegt een IP-adres niets over de fysieke locatie van een persoon (VPN, proxy).',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'forensisch-protocol',
            emoji: '📋',
            title: 'Forensisch protocol',
            description:
                'Welke werkwijzen horen bij een correct digitaal forensisch onderzoek? Selecteer alles wat van toepassing is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je kent de professionele standaarden voor digitaal forensisch werk.',
            feedbackIncorrect:
                'Sommige acties klinken logisch maar zijn juridisch problematisch. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '📸',
                    title: 'Maak een kopie van bewijs voordat je het analyseert',
                    description:
                        'Je analyseert altijd een exacte kopie (forensische image) van een harde schijf, nooit het origineel.',
                    correct: true,
                    explanation:
                        'Chain of custody vereist dat origineel bewijs onaangetast blijft. Als je het origineel analyseert en er iets verandert, is het bewijs niet meer bruikbaar voor een rechtbank.',
                },
                {
                    id: 2,
                    icon: '🗑️',
                    title: 'Verwijder dubbele of irrelevante logregels',
                    description:
                        'Om het overzicht te bewaren, verwijder je logregels die niets te maken hebben met het incident.',
                    correct: false,
                    explanation:
                        'Nooit bewijs verwijderen. Wat nu irrelevant lijkt, kan later cruciaal blijken. Forensisch analisten selecteren en markeren — ze verwijderen nooit.',
                },
                {
                    id: 3,
                    icon: '📝',
                    title: 'Documenteer elke stap die je zet',
                    description:
                        'Je houdt bij welke acties je hebt ondernomen, wanneer, en wat je hebt gevonden.',
                    correct: true,
                    explanation:
                        'Documentatie is essentieel voor de bewijsketen. Als jouw rapport aangevochten wordt voor de rechter, moet je exact kunnen aantonen wat je hebt gedaan en hoe je tot je conclusies bent gekomen.',
                },
                {
                    id: 4,
                    icon: '🤫',
                    title: 'Bespreek het onderzoek niet met het slachtoffer of de verdachte',
                    description:
                        'Je deelt onderzoeksresultaten niet met betrokkenen totdat het onderzoek is afgerond en goedgekeurd.',
                    correct: true,
                    explanation:
                        'Een lopend forensisch onderzoek moet vertrouwelijk blijven. Als een verdachte hoort wat er is gevonden, kan hij bewijs wissen of een alibi fabriceren.',
                },
                {
                    id: 5,
                    icon: '⚡',
                    title: 'Schakel het verdachte systeem snel uit om bewijs te beschermen',
                    description:
                        'Als je een gehackt systeem vindt, schakel je het onmiddellijk uit om verdere schade te voorkomen.',
                    correct: false,
                    explanation:
                        'Uitschakelen vernietigt vluchtig bewijs in het RAM-geheugen: actieve verbindingen, lopende processen, versleutelingssleutels. Forensisch analisten doen een live RAM-dump vóór afsluiting als dat mogelijk is.',
                },
                {
                    id: 6,
                    icon: '🕰️',
                    title: 'Controleer of de servertijd gesynchroniseerd is',
                    description:
                        'Je controleert of de serverklok correct is ingesteld, zodat de timestamps in de logbestanden betrouwbaar zijn.',
                    correct: true,
                    explanation:
                        'Tijdsynchronisatie is cruciaal. Als een serverclock 2 uur achterloopt, kloppen alle timestamps niet. In een multi-system onderzoek moeten alle tijden op dezelfde tijdzone worden gecalibreerd.',
                },
                {
                    id: 7,
                    icon: '🔒',
                    title: 'Bewaar bewijs op een beveiligde, read-only locatie',
                    description:
                        'Forensische images en originele logbestanden worden opgeslagen op een medium waarop niets kan worden overschreven.',
                    correct: true,
                    explanation:
                        'Read-only opslag garandeert dat het bewijs niet per ongeluk of opzettelijk wordt gewijzigd. In rechtszaken is aantoonbare integriteit van bewijs een harde eis.',
                },
                {
                    id: 8,
                    icon: '🎯',
                    title: 'Concludeer wie de dader is op basis van circumstantial evidence',
                    description:
                        'Op basis van alle indirecte aanwijzingen concludeer je in je rapport wie de aanval heeft uitgevoerd.',
                    correct: false,
                    explanation:
                        'Een forensisch analist concludeert feiten, geen daderschap. Wie de aanvaller is, is een juridische conclusie voor een rechtbank. Jij rapporteert wat de data bewijst: welk IP, welke accounts, welke acties — niet wie de persoon achter het toetsenbord was.',
                },
            ],
        },
    ],
};

export default config;
