import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'mail-detective',
    title: 'Mail Detective',
    introEmoji: '📬',
    introTitle: 'Mail Detective',
    introDescription:
        'Elke dag landen er duizenden nep-mails in Nederlandse inboxen. Aanvallers maken ze zo echt mogelijk — maar als je weet waar je op moet letten, prik je er zo doorheen. Jij wordt Mail Detective.',
    experienceDesign: {
        boringRisk: 'medium',
        firstTenSeconds: 'Open de verdachte inbox en pin meteen het eerste signaal dat niet klopt.',
        primaryInteraction: 'pin-evidence',
        feedbackMoment: 'Na elke ronde laat de feedback zien welke mailtruc je wel of niet hebt ontmaskerd.',
        visualKit: 'casefile',
        evidenceMoment: 'Leerlingen leveren verdachte signalen, risicovolgorde en veilige reactie als docentbewijs.',
        antiBoringRule: 'Niet starten met phishingtheorie: eerst bewijs uit een casefile kiezen en daarna pas uitleg lezen.',
        chromeAcceptance: 'Inboxcase, bewijskeuze, feedback en eindbewijs zijn zichtbaar zonder overflow; de hoofdhandeling is bewijs pinnen of prioriteren.',
    },
    introFeatures: [
        'Herken verdachte signalen in gesimuleerde e-mails',
        'Rangschik e-mails van gevaarlijkst naar minst gevaarlijk',
        'Oefen: echt schoolbericht of valstrik?',
        'Ontdek welke trucs aanvallers gebruiken om jou te misleiden',
    ],
    learningObjectives: [
        'De leerling herkent minimaal 4 verdachte signalen in een gesimuleerde e-mail (afzenderadres, urgentietaal, linkbestemming, bijlagetype).',
        'De leerling rangschikt e-mailrisico\'s op basis van type gevaar en mogelijke schade.',
        'De leerling onderscheidt echte schoolmails van nep-mails op basis van kanaal en afzenderkenmerken.',
        'De leerling benoemt minimaal 3 veilige reactiestrategieën bij een verdachte mail.',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🔎',
            title: 'Mail Detective',
            color: '#D97848',
        },
        {
            minScore: 60,
            emoji: '📬',
            title: 'Waakzame Lezer',
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
        'Controleer altijd het e-mailadres van de afzender — niet alleen de naam die wordt weergegeven.',
        'Urgentie en dreiging ("Je account wordt geblokkeerd!") zijn waarschuwingssignalen, geen redenen om snel te klikken.',
        'Een link in een e-mail kan naar een heel ander adres gaan dan de tekst laat zien — zweef er altijd eerst over.',
        'Bijlagen in verdachte e-mails kunnen virussen bevatten — open ze nooit als je de afzender niet herkent.',
        'Twijfel je? Vraag een ouder, docent of open de website zelf in je browser — nooit via de link in de mail.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'signalen-herkennen',
            emoji: '🚩',
            title: 'Wat is er verdacht aan deze mail?',
            description:
                'Je opent je e-mail en ziet dit bericht. Welke onderdelen hieronder zijn verdachte signalen? Selecteer alles wat je waarschuwt.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Scherp gezien! Je herkent de signalen die zeggen: "Wees voorzichtig."',
            feedbackIncorrect:
                'Sommige trucs zijn subtiel. Lees de uitleg — zo word je een betere Mail Detective.',
            items: [
                {
                    id: 1,
                    icon: '📧',
                    title: 'Afzender: docent.smits@magister-berichten.com',
                    description:
                        'De mail beweert van je docent te komen, maar het adres eindigt op "@magister-berichten.com" — niet op het domein van je school.',
                    correct: true,
                    explanation:
                        'Je docent heeft een schoolmailadres dat eindigt op het schooldomein (bijv. @onsschool.nl). Een adres als "@magister-berichten.com" is niet officieel. Aanvallers kiezen namen die vertrouwd klinken, maar het domein achter het @-teken verraadt hen.',
                },
                {
                    id: 2,
                    icon: '📎',
                    title: 'Bijlage: "huiswerk_opdracht_wiskunde.exe"',
                    description:
                        'De mail heeft een bijlage die eruit ziet als een huiswerkopdracht, maar de bestandsnaam eindigt op ".exe".',
                    correct: true,
                    explanation:
                        'Een .exe-bestand is een uitvoerbaar programma — geen document. Echte huiswerkopdrachten zijn altijd .pdf of .docx. Als je dit opent, kan er malware op je apparaat worden geïnstalleerd.',
                },
                {
                    id: 3,
                    icon: '🔗',
                    title: '"Log in op Magister" knop verwijst naar magister-rooster-app.net',
                    description:
                        'De blauwe knop staat "Bekijk je roosterwijziging op Magister", maar als je erover zweeft zie je een ander adres dan het echte magister.net.',
                    correct: true,
                    explanation:
                        'De tekst op een knop kan van alles zeggen — het werkelijke adres achter de knop is wat telt. Het echte Magister gebruikt altijd het domein magister.net. Zweef over een link om het echte adres te zien voor je klikt.',
                },
                {
                    id: 4,
                    icon: '📬',
                    title: 'Roosterwijziging via het berichtencentrum van Magister',
                    description:
                        'Je docent stuurt via het berichtencentrum van Magister een bericht dat morgen het eerste uur uitvalt.',
                    correct: false,
                    explanation:
                        'Berichten via het echte Magister-platform zijn betrouwbaar — aanvallers kunnen normaal gesproken geen berichten sturen vanuit beveiligde schoolsystemen. Het kanaal is hier het kenmerk van echtheid.',
                    wrongFeedback:
                        'Goed dat je waakzaam bent! Maar berichten die binnenkomen via het beveiligde berichtencentrum van Magister zelf zijn juist betrouwbaarder dan gewone e-mail. Let op het kanaal: via Magister of via je gewone inbox?',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'gevaarlijkste-mail',
            emoji: '📊',
            title: 'Welke mail is het gevaarlijkst?',
            description:
                'Rangschik deze vijf e-mails van gevaarlijkst (1e) naar minst gevaarlijk (5e). Klik ze in die volgorde aan.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Sterke analyse! Je begrijpt hoe aanvallers het verschil maken tussen een gevaarlijke en een minder gevaarlijke aanval.',
            feedbackIncorrect:
                'Bijna goed. Denk aan wat de mail vraagt en hoe groot de schade kan zijn als iemand erop ingaat.',
            items: [
                {
                    id: 1,
                    icon: '💳',
                    title: 'Mail over geblokkeerd schoolaccount met wachtwoord-verzoek',
                    description:
                        '"Je schoolaccount is geblokkeerd. Log in via de link en vul je gebruikersnaam, wachtwoord en geboortedatum in om je account te herstellen." — van support@sch00l-portal.nl.',
                    correctPosition: 0,
                    explanation:
                        'Meest gevaarlijk. Deze mail vraagt om je inloggegevens via een nep-link. Als je dat doet, heeft de aanvaller toegang tot je schoolaccount en alles wat daarin staat.',
                },
                {
                    id: 2,
                    icon: '📎',
                    title: 'Mail met bijlage "Rapport_definitief.exe"',
                    description:
                        '"Bekijk je nieuwe rapport via de bijlage." De bijlage eindigt op .exe — een uitvoerbaar programmabestand.',
                    correctPosition: 1,
                    explanation:
                        'Heel gevaarlijk. Een .exe-bestand kan malware zijn. Als je het opent, kan de aanvaller je computer overnemen of bestanden stelen. Nooit een .exe openen van een onbekende afzender.',
                },
                {
                    id: 3,
                    icon: '🎁',
                    title: 'Mail: "Gefeliciteerd, je hebt een cadeaubon gewonnen!"',
                    description:
                        '"Klik op de link om je €50 cadeaubon te claimen! Alleen vandaag geldig." — van prizes@gratis-win.nl.',
                    correctPosition: 2,
                    explanation:
                        'Gevaarlijk, maar minder dan de eerste twee. Je wordt verleid met een cadeau, maar er staat geen duidelijk verzoek om wachtwoord of bestand. De link kan wel naar een site leiden die je gegevens steelt.',
                },
                {
                    id: 4,
                    icon: '📰',
                    title: 'Nep-nieuwsbrief van een onbekende organisatie',
                    description:
                        'Een nieuwsbrief van een organisatie die je niet kent, met links naar artikelen op een website die je ook niet kent.',
                    correctPosition: 3,
                    explanation:
                        'Minder gevaarlijk dan de andere drie, maar nog steeds verdacht. De links kunnen naar kwaadaardige websites gaan. Verwijder de mail en klik op niets.',
                },
                {
                    id: 5,
                    icon: '📬',
                    title: 'Mail van noreply@school.nl met "Toets verplaatst"',
                    description:
                        '"De toets van morgen is verplaatst naar donderdag." — van het officiële schooldomein, geen links, geen bijlagen.',
                    correctPosition: 4,
                    explanation:
                        'Minst gevaarlijk. Officieel schooldomein, geen link, geen gegevensverzoek, geen bijlage. Dit lijkt op een echte schoolmail. Controleer wel even of het domein klopt.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'echt-of-vals',
            emoji: '🤔',
            title: 'Echte schoolmail of valstrik?',
            description:
                'Bekijk elk e-mailbericht en beslis: is dit een echte schoolmail of een poging om je te misleiden?',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Goed gescoord! Jij laat je niet zomaar vangen.',
            feedbackIncorrect: 'Lastig hè? Lees de uitleg — zo herken je het de volgende keer wel.',
            items: [
                {
                    id: 1,
                    icon: '📧',
                    title: 'Van: noreply@magister.net — "Je rapport is beschikbaar"',
                    description:
                        'Afzender: noreply@magister.net. Onderwerp: "Je rapport staat klaar." Geen link, geen bijlage. De mail zegt dat je via de gewone Magister-app kunt inloggen om je rapport te bekijken.',
                    correct: true,
                    explanation:
                        'Dit is een echt bericht. Geen urgentie, geen link, geen gegevensverzoek. Het vraagt je om zelf via de app in te loggen. Zo horen echte meldingen eruit te zien.',
                    wrongFeedback:
                        'Je bent extra voorzichtig — goed instinct! Maar let op de signalen: geen link, geen urgentie, geen verzoek om gegevens. Het vraagt je om zelf via de app in te loggen. Dat is precies hoe echte meldingen werken.',
                },
                {
                    id: 2,
                    icon: '⚠️',
                    title: '"Je schoolmail wordt morgen afgesloten — log in om te verlengen"',
                    description:
                        'Van: it-support@schoolaccount-verlengen.net. De mail zegt dat je schoolaccount stopt als je niet via de meegestuurde link je gegevens bevestigt.',
                    correct: false,
                    explanation:
                        'Nep-mail. Het domein "schoolaccount-verlengen.net" is niet het officiële schooldomein. IT vraagt nooit via e-mail om je inloggegevens te bevestigen via een externe link.',
                },
                {
                    id: 3,
                    icon: '🏫',
                    title: 'Docent stuurt via Magister de opdracht voor morgen',
                    description:
                        'Je docent stuurt via het berichtencentrum van Magister de taakinstructies voor morgen, als bijlage een Word-document. Geen externe links.',
                    correct: true,
                    explanation:
                        'Dit is normaal en veilig schoolverkeer. Verstuurd via een beveiligd platform, een herkenbare afzender, geen externe links. Geen reden tot argwaan.',
                    wrongFeedback:
                        'Begrijpelijk dat je voorzichtig bent! Maar dit bericht komt via Magister zelf — een beveiligd platform. De docent is de afzender, er zijn geen externe links en de bijlage is een Word-document. Dit is gewone schoolcommunicatie.',
                },
                {
                    id: 4,
                    icon: '🎁',
                    title: '"Je bent geselecteerd voor een gratis studietoelage — reageer vandaag!"',
                    description:
                        'Van: info@studiebeurs-kansen.nl. Je bent "speciaal geselecteerd" voor €500 studietoelage. Klik op de link en vul je naam, adres en rekeningnummer in om het te ontvangen.',
                    correct: false,
                    explanation:
                        'Nep-mail. Echte studiebeurzen vragen nooit om je rekeningnummer via e-mail. "Speciaal geselecteerd" zonder dat je je ooit hebt aangemeld is een groot waarschuwingssignaal.',
                },
                {
                    id: 5,
                    icon: '📬',
                    title: '"Herinnering: inleverdatum project is vrijdag"',
                    description:
                        'Van: j.devries@onsschool.nl. Korte herinnering van je docent over de inleverdatum. Geen link, geen bijlage, geen urgentie.',
                    correct: true,
                    explanation:
                        'Dit is een echte mail. Officieel schooldomein, herkende naam, geen link, geen bijlage, geen alarmerend verzoek. Zo communiceren docenten normaal.',
                    wrongFeedback:
                        'Goed dat je kritisch bent! Maar kijk naar de signalen: officieel domein, herkende afzender, geen link, geen gegevensverzoek. Dit is een gewone herinnering van je docent.',
                },
                {
                    id: 6,
                    icon: '📎',
                    title: '"Factuur bijgevoegd — betaal voor 1 november"',
                    description:
                        'Van: boekhouding@schoolpas-facturen.com. Een factuur voor schoolmaterialen als bijlage (.exe-bestand). Je ouders moeten betalen via iDEAL via de bijlage.',
                    correct: false,
                    explanation:
                        'Nep-mail. Scholen sturen facturen nooit als .exe-bestand. iDEAL-betalingen gaan via een website, niet via een programmabestand in een e-mail. Het domein "schoolpas-facturen.com" is ook niet officieel.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'slim-reageren',
            emoji: '🛡️',
            title: 'Hoe reageer je slim?',
            description:
                'Je ontvangt een verdachte mail. Welke acties hieronder zijn slim en veilig? Selecteer alles wat een goede reactie is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je weet hoe je veilig omgaat met verdachte mail.',
            feedbackIncorrect:
                'Sommige reacties lijken logisch maar zijn gevaarlijk. Lees de uitleg goed.',
            followUp: {
                question:
                    'Je krijgt een mail: "Je schoolaccount wordt vandaag geblokkeerd. Klik hier om in te loggen." Wat is de slimste reactie?',
                options: [
                    'Meteen klikken, want anders ben je je account kwijt',
                    'De link doorsturen naar een vriend om te vragen of die veilig is',
                    'Zelf naar Magister of de schoolsite gaan en bij twijfel een docent of IT vragen',
                    'Antwoorden op de mail en je wachtwoord vragen terug te sturen',
                ],
                correctIndex: 2,
                explanation:
                    'Ga nooit via de link in een urgente mail. Open zelf de bekende schoolsite of Magister en vraag bij twijfel een docent of IT-medewerker.',
                bonusPoints: 0,
            },
            items: [
                {
                    id: 1,
                    icon: '🚫',
                    title: 'Nooit klikken op een link als je de afzender niet herkent',
                    description:
                        'Je klikt niet op links in een mail als je de afzender niet kent of de mail verdacht vindt.',
                    correct: true,
                    explanation:
                        'De simpelste verdediging. Phishing-aanvallen beginnen bijna altijd met een klik. Als je twijfelt: niet klikken, maar zelf het adres intypen in je browser.',
                },
                {
                    id: 2,
                    icon: '🔍',
                    title: 'Het afzenderadres goed bekijken — ook achter het @-teken',
                    description:
                        'Je checkt niet alleen de naam van de afzender maar ook het volledige e-mailadres, inclusief het domein achter het @-teken.',
                    correct: true,
                    explanation:
                        'De weergavenaam ("School IT Support") kan vals zijn — het adres erachter niet. Een adres als "support@sch00l-portal.net" is niet hetzelfde als "support@school.nl".',
                },
                {
                    id: 3,
                    icon: '🌐',
                    title: 'Zelf naar de schoolwebsite gaan via je browser — niet via de link in de mail',
                    description:
                        'In plaats van op de link in de mail te klikken, open je je browser en typ je het schooladres handmatig in.',
                    correct: true,
                    explanation:
                        'Dit is de gouden regel. Als je schoolaccount echt een probleem heeft, zie je dat ook als je zelf inlogt. Je hoeft nooit via een link in een mail te gaan.',
                },
                {
                    id: 4,
                    icon: '📤',
                    title: 'De verdachte mail doorsturen naar je vrienden om te waarschuwen',
                    description:
                        'Je stuurt de phishing-mail door naar je klasgenoten zodat zij ook weten dat hij bestaat.',
                    correct: false,
                    explanation:
                        'Dit is gevaarlijk! Door de mail door te sturen geef je de aanvaller meer bereik. Als een vriend per ongeluk op de link klikt, is hij ook het slachtoffer. Meld de mail liever bij een volwassene of via de "Meld als spam"-knop.',
                },
            ],
        },
    ],
};

export default config;
