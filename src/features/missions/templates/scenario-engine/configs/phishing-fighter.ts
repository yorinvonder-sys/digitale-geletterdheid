import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'phishing-fighter',
    title: 'Phishing Fighter',
    introEmoji: '🎣',
    introTitle: 'Phishing Fighter',
    introDescription:
        'Phishing is de meest voorkomende cyberaanval ter wereld. Aanvallers maken nep-berichten die er echt uitzien om jouw wachtwoord of gegevens te stelen. Jij leert de trucjes te herkennen — en hoe je anderen daartegen beschermt.',
    introFeatures: [
        'Herken rode vlaggen in gesimuleerde phishing-berichten',
        'Rangschik aanvallen van gevaarlijkst naar minst gevaarlijk',
        'Oefen: echt of nep? Test jouw instinct',
        'Ontdek hoe aanvallers inspelen op emotie en tijdsdruk',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🛡️',
            title: 'Phishing Expert',
            color: '#e1ff01',
        },
        {
            minScore: 60,
            emoji: '🔍',
            title: 'Waakzame Detective',
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
        'Controleer altijd het e-mailadres van de afzender — niet alleen de weergavenaam.',
        'Urgentie en angst zijn de favoriete wapens van phishers: "Uw account wordt geblokkeerd!"',
        'Zweef altijd over een link voor je klikt — het echte adres verschijnt dan onderaan je scherm.',
        'Tweefactorauthenticatie (2FA) beschermt je zelfs als je wachtwoord gestolen is.',
        'Twijfel je? Bel de organisatie op via een nummer dat je zelf opzoekt — nooit het nummer in het bericht.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'rode-vlaggen',
            emoji: '🚩',
            title: 'Herken de rode vlaggen',
            description:
                'Je ontvangt een e-mail. Welke elementen hieronder zijn rode vlaggen die wijzen op phishing? Selecteer alles wat verdacht is.',
            type: 'select-correct',
            maxScore: 25,
            showConfidence: true,
            feedbackCorrect:
                'Scherp! Je ziet de subtiele en de opvallende signalen allebei.',
            feedbackIncorrect:
                'Sommige trucjes zijn moeilijk te spotten. Lees de uitleg goed — phishers worden steeds beter.',
            items: [
                {
                    id: 1,
                    icon: '📧',
                    title: 'Afzender: noreply@sch00l-portal.nl',
                    description:
                        'De e-mail beweert van jouw school te komen, maar het adres bevat een nul ("0") in plaats van een "o".',
                    correct: true,
                    explanation:
                        'Typosquatting: aanvallers registreren domeinen die spellen op echte namen lijken. "sch00l" ipv "school" is een klassiek voorbeeld. Controleer altijd de spelling van het domein.',
                },
                {
                    id: 2,
                    icon: '⚠️',
                    title: '"Uw account wordt MORGEN verwijderd!"',
                    description:
                        'Het bericht beweert dat je account over 24 uur permanent wordt verwijderd als je niet direct actie onderneemt.',
                    correct: true,
                    explanation:
                        'Urgentie creëren is een kerntruc van social engineering. Tijdsdruk voorkomt dat je nadenkt. Echte organisaties sturen geen ultimatums via e-mail zonder vooraankondiging.',
                },
                {
                    id: 3,
                    icon: '🔗',
                    title: 'Link: http://schoolportal-login.xyz/bevestig',
                    description:
                        'De knop "Klik hier" verwijst naar een adres dat eindigt op ".xyz" en niet op het officiële schooldomein.',
                    correct: true,
                    explanation:
                        'Het domein in de link is het enige dat echt telt. De tekst op een knop kan alles zeggen — het werkelijke adres achter de link is wat je checkt (zweef erover).',
                },
                {
                    id: 4,
                    icon: '✉️',
                    title: 'Verzonden via het officiële schoolsysteem',
                    description:
                        'Het bericht is verstuurd via Magister of een ander officieel platform van de school.',
                    correct: false,
                    explanation:
                        'Als een bericht echt via een vertrouwd intern systeem binnenkomt, is de kans op phishing veel kleiner. Phishers kunnen normaal gesproken geen berichten sturen vanuit beveiligde schoolplatforms.',
                    wrongFeedback:
                        'Je denkt misschien: "alles in een e-mail is verdacht". Maar berichten via beveiligde schoolplatforms (Magister, Teams) zijn juist betrouwbaarder. Het kanaal waarlangs het bericht komt, maakt verschil.',
                },
                {
                    id: 5,
                    icon: '🔑',
                    title: '"Vul hier uw wachtwoord en BSN in"',
                    description:
                        'Het formulier in het bericht vraagt naar je schoolwachtwoord én je burgerservicenummer.',
                    correct: true,
                    explanation:
                        'Geen enkele legitieme organisatie vraagt je wachtwoord via e-mail. Een BSN via e-mail is altijd verdacht. Dit zijn harde waarschuwingstekens.',
                },
                {
                    id: 6,
                    icon: '🏫',
                    title: 'Logo van de school correct weergegeven',
                    description:
                        'De e-mail bevat het juiste logo van de school in goede kwaliteit.',
                    correct: false,
                    explanation:
                        'Logo\'s zijn makkelijk te kopiëren met één rechtsklik. Een correct logo zegt niets over de echtheid van een bericht. Phishers weten dit en kopiëren logo\'s standaard.',
                    wrongFeedback:
                        'Goed dat je kritisch kijkt! Maar een logo is juist GEEN rode vlag — het is makkelijk te kopiëren. Een correct logo maakt een phishing-mail niet veiliger, maar het is op zichzelf geen teken van fraude.',
                },
                {
                    id: 7,
                    icon: '❌',
                    title: 'Taalfouten en vreemde zinnen',
                    description:
                        'De e-mail bevat zinnen als "Uw account heeft nodig bevestiging doen" — grammaticaal onjuist.',
                    correct: true,
                    explanation:
                        'Taalfouten waren vroeger een betrouwbaar signaal. Moderne phishing-tools gebruiken AI om foutloze teksten te genereren, maar goedkopere aanvallen zijn nog steeds herkenbaar aan slechte grammatica.',
                },
                {
                    id: 8,
                    icon: '📅',
                    title: 'E-mail ontvangen op een normaal tijdstip',
                    description:
                        'De e-mail werd verstuurd op een dinsdagmiddag om 14:23, tijdens schooltijd.',
                    correct: false,
                    explanation:
                        'Tijdstip zegt weinig over phishing. Aanvallers plannen hun berichten bewust op "normale" tijden om argwaan te verminderen. Niet verdacht op zichzelf.',
                    wrongFeedback:
                        'Slimme gedachte — maar aanvallers sturen bewust op "normale" tijden om juist niet op te vallen. Het tijdstip van een e-mail is geen betrouwbaar signaal. Focus op de inhoud en de afzender.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'gevaarlijkst-eerst',
            emoji: '📊',
            title: 'Gevaarlijkste aanval eerst',
            description:
                'Rangschik deze vijf phishing-aanvallen van meest gevaarlijk (1e) naar minst gevaarlijk (5e). Klik ze in die volgorde aan.',
            type: 'order-priority',
            maxScore: 25,
            feedbackCorrect:
                'Goede risicoanalyse! Je begrijpt hoe aanvallers hun aanpak aanpassen aan het doelwit.',
            feedbackIncorrect:
                'Bijna goed. Denk aan wie het doelwit is en hoeveel schade er kan worden aangericht.',
            items: [
                {
                    id: 1,
                    icon: '🎯',
                    title: 'Spear phishing naar de directeur',
                    description:
                        'Een aanvaller stuurt een e-mail naar de schooldirecteur, gepersonaliseerd met zijn naam en een verwijzing naar een recente vergadering. Het bericht vraagt hem een factuur van €12.000 te betalen.',
                    correctPosition: 0,
                    explanation:
                        'Meest gevaarlijk. Spear phishing is gericht op één persoon met echte details. Gecombineerd met een financieel verzoek aan iemand met betaalrechten is dit een hoge-schade aanval.',
                },
                {
                    id: 2,
                    icon: '📱',
                    title: 'Smishing via sms',
                    description:
                        'Alle leerlingen op school ontvangen een sms van "de schooladministratie": "Je rapport staat klaar. Log in via: schoollogin-rapport.nl".',
                    correctPosition: 1,
                    explanation:
                        'Gevaarlijk omdat het veel slachtoffers tegelijk bereikt en inspeelt op nieuwsgierigheid. Sms-berichten worden vaker vertrouwd dan e-mails.',
                },
                {
                    id: 3,
                    icon: '📧',
                    title: 'Bulk phishing-mail met taalfouten',
                    description:
                        'Duizenden mensen ontvangen een slecht geschreven e-mail: "uw Netflix abonement is verlopen klik hier om te forleggern."',
                    correctPosition: 2,
                    explanation:
                        'Laag succespercentage, maar door het grote volume vangen aanvallers toch slachtoffers. Minder gevaarlijk per persoon, maar op grote schaal relevant.',
                },
                {
                    id: 4,
                    icon: '🖥️',
                    title: 'Nep-inlogpagina in de schoolbibliotheek',
                    description:
                        'Op een schoolcomputer staat een browservenster open dat precies lijkt op de Magister-inlogpagina, maar op een nep-adres draait.',
                    correctPosition: 3,
                    explanation:
                        'Vereist fysieke toegang, waardoor de schaal beperkt is. Wel gevaarlijk voor de leerling die erop intypt, maar minder efficiënt voor een aanvaller.',
                },
                {
                    id: 5,
                    icon: '📣',
                    title: 'Phishing-post op social media',
                    description:
                        '"Win een gratis iPad! Klik op de link en vul je e-mail in." — geplaatst op een willekeurig socialmedia-account.',
                    correctPosition: 4,
                    explanation:
                        'Minst gevaarlijk in deze context. Leerlingen zijn gewend aan dit soort aanbiedingen en herkennen het vaak als oplichterij. Maar nul risico is het nooit.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'echt-of-nep',
            emoji: '🤔',
            title: 'Echt of phishing?',
            description:
                'Bekijk elk bericht en beslis: is dit een echt bericht of phishing? Vertrouw je instinct — maar controleer ook de details.',
            type: 'binary-choice',
            maxScore: 25,
            showConfidence: true,
            feedbackCorrect: 'Goed gescoord! Jij laat je niet zo makkelijk vangen.',
            feedbackIncorrect: 'Lastig hè? Phishers worden steeds beter. Lees de uitleg goed.',
            items: [
                {
                    id: 1,
                    icon: '📧',
                    title: 'Van: noreply@magister.net — "Je rapport is beschikbaar"',
                    description:
                        'Afzender is noreply@magister.net. Onderwerp: "Je rapport staat klaar." Geen link, geen verzoek om in te loggen. Alleen de melding dat je via de gewone Magister-app kunt inloggen.',
                    correct: true,
                    explanation:
                        'Dit is een echt bericht. Geen urgentie, geen link, geen verzoek om gegevens. Het vraagt je om zelf via de bekende weg in te loggen. Zo horen legitieme notificaties eruit te zien.',
                    wrongFeedback:
                        'Je bent misschien extra voorzichtig — goed instinct! Maar check de signalen: geen link, geen urgentie, geen gegevensverzoek. Dit bericht vraagt je om zelf via de app in te loggen. Dat is juist hoe echte meldingen werken.',
                },
                {
                    id: 2,
                    icon: '💳',
                    title: '"Je DUO-beurs is geblokkeerd, reageer binnen 2 uur"',
                    description:
                        'E-mail van duo-studentfinancien.nl met urgentie: je beurs is geblokkeerd. De link gaat naar "duo-login-herstellen.net". Je moet je IBAN, BSN en wachtwoord invullen.',
                    correct: false,
                    explanation:
                        'Phishing. Domein klopt niet (duo-studentfinancien.nl ≠ duo.nl), de link gaat naar een ander adres, en DUO vraagt nooit je IBAN + BSN + wachtwoord tegelijk via e-mail.',
                },
                {
                    id: 3,
                    icon: '📱',
                    title: 'WhatsApp van "mama": "Ik heb een nieuw nummer"',
                    description:
                        '"Hoi, ik heb een nieuw nummer. Kun je me even 150 euro overmaken? Ik zit zonder geld tot morgen." — van een onbekend nummer.',
                    correct: false,
                    explanation:
                        'Dit is "vriendenfraude" of "familiefraudehulp" — een bekende vorm van social engineering via WhatsApp. Bel altijd het oude nummer om te controleren wie je echt spreekt.',
                },
                {
                    id: 4,
                    icon: '🔐',
                    title: 'Google-melding: "Nieuw inloggen gedetecteerd"',
                    description:
                        'Je ontvangt een e-mail van noreply@accounts.google.com: "Er is ingelogd op uw account vanaf een nieuw apparaat in Rusland. Was dit u?" Met een knop "Beveilig uw account".',
                    correct: true,
                    explanation:
                        'Dit kan een echt bericht zijn — Google stuurt deze meldingen echt. Maar: zweef over de knop en check of het adres naar accounts.google.com gaat. Bij twijfel: ga zelf naar myaccount.google.com.',
                    wrongFeedback:
                        'Begrijpelijk — "inloggen uit Rusland" klinkt alarmerend. Maar Google stuurt dit soort meldingen echt. De afzender (accounts.google.com) is correct. De truc: altijd zelf naar myaccount.google.com gaan in plaats van op de knop te klikken.',
                },
                {
                    id: 5,
                    icon: '🎁',
                    title: '"Gefeliciteerd! Je hebt een iPhone 15 gewonnen"',
                    description:
                        'Pop-up op een website: "Je bent de 1.000.000e bezoeker! Claim je prijs door je adres en creditcardnummer in te vullen voor de bezorgkosten."',
                    correct: false,
                    explanation:
                        'Klassieke oplichterij. Niemand wint zomaar een iPhone. "Bezorgkosten" zijn een truc om je creditcardgegevens te stelen. Sluit het venster onmiddellijk.',
                },
                {
                    id: 6,
                    icon: '🏫',
                    title: 'Mail van docent via schoolplatform over huiswerk',
                    description:
                        'Je docent stuurt via Teams of Magister een bericht met de opdracht voor morgen en een bijlage met de taakinstructies. Geen links naar externe sites.',
                    correct: true,
                    explanation:
                        'Dit is normaal schoolverkeer. Geen externe links, geen gegevensverzoek, verstuurd via een vertrouwd beveiligd platform. Geen reden tot argwaan.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'bescherm-jezelf',
            emoji: '🛡️',
            title: 'Hoe bescherm je jezelf?',
            description:
                'Welke maatregelen beschermen je echt tegen phishing? Selecteer alles wat effectief is.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je kent de tools die echt het verschil maken.',
            feedbackIncorrect:
                'Sommige maatregelen lijken handig maar helpen nauwelijks. Lees de uitleg.',
            followUp: {
                question: 'Je klasgenoot stuurt je een WhatsApp: "Ik kreeg een mail van school dat mijn account geblokkeerd is. Er staat een link om in te loggen. Moet ik klikken?" Wat is het beste advies?',
                options: [
                    'Ja, als het van school komt is het veilig',
                    'Nee, verwijder de mail meteen en blokkeer de afzender',
                    'Nee — log zelf in via Magister of de schoolsite, niet via de link in de mail',
                    'Stuur de link door naar mij, dan check ik het voor je',
                ],
                correctIndex: 2,
                explanation: 'Het beste advies is altijd: ga ZELF naar de bekende website, nooit via een link in een bericht. De mail verwijderen is te weinig (je klasgenoot begrijpt dan niet waarom), en doorsturen is gevaarlijk.',
                bonusPoints: 0,
            },
            items: [
                {
                    id: 1,
                    icon: '🔐',
                    title: 'Tweefactorauthenticatie (2FA) instellen',
                    description:
                        'Je schakelt 2FA in op je schoolaccount, e-mail en sociale media. Naast je wachtwoord heb je een code nodig van je telefoon.',
                    correct: true,
                    explanation:
                        '2FA is een van de krachtigste beschermingen. Zelfs als een phisher je wachtwoord steelt, kan hij niet inloggen zonder de tweede factor die alleen op jouw apparaat staat.',
                },
                {
                    id: 2,
                    icon: '🔗',
                    title: 'Altijd zweven over links voor je klikt',
                    description:
                        'Voordat je op een link klikt, zweef je met je muis erover om te zien welk adres er echt achter zit.',
                    correct: true,
                    explanation:
                        'Het zichtbare linkadres kan anders zijn dan het echte doeladres. Zweven onthult het echte adres onderaan je scherm of in een tooltip. Dit is een gratis en effectieve gewoonte.',
                },
                {
                    id: 3,
                    icon: '🔒',
                    title: 'Hetzelfde sterke wachtwoord overal gebruiken',
                    description:
                        'Je gebruikt één heel sterk wachtwoord (20 tekens, cijfers en symbolen) voor alle accounts.',
                    correct: false,
                    explanation:
                        'Eén sterk wachtwoord overal is een gevaarlijke fout. Als dat wachtwoord ooit lekt (via phishing of een datalek), zijn ALLE accounts tegelijk kwetsbaar. Gebruik een wachtwoordmanager voor unieke wachtwoorden.',
                    wrongFeedback:
                        'Een sterk wachtwoord klinkt goed — maar "sterk" helpt niet als het overal hetzelfde is. Eén lek = alle accounts kwetsbaar. De oplossing: een wachtwoordmanager die unieke wachtwoorden genereert per account.',
                },
                {
                    id: 4,
                    icon: '📢',
                    title: 'Phishing-berichten melden bij IT of platform',
                    description:
                        'Als je een phishing-mail ontvangt, meld je dit bij de IT-afdeling van je school en gebruik je de "Meld als phishing"-knop in je mailprogramma.',
                    correct: true,
                    explanation:
                        'Melden helpt iedereen. De IT-afdeling kan het bericht blokkeren voor andere gebruikers. Platforms gebruiken jouw melding om hun filters te verbeteren.',
                },
                {
                    id: 5,
                    icon: '🖱️',
                    title: 'Nooit op verdachte links klikken',
                    description:
                        'Je opent verdachte e-mails gewoon niet en klikt nooit op links als je niet zeker weet of het klopt.',
                    correct: true,
                    explanation:
                        'De simpelste verdediging: niet klikken. Als je twijfelt, ga dan zelf naar de website via je browser door het adres handmatig in te typen.',
                },
                {
                    id: 6,
                    icon: '📵',
                    title: 'Je telefoon nooit gebruiken voor schoolaccounts',
                    description:
                        'Je logt op school alleen in via schoolcomputers, nooit via je eigen telefoon.',
                    correct: false,
                    explanation:
                        'Dit beschermt niet tegen phishing. Phishing werkt via elk apparaat en elke browser. Waar je inlogt is minder belangrijk dan hoe je inlogt en of je de bron vertrouwt.',
                    wrongFeedback:
                        'Logisch idee, maar het apparaat maakt niet uit — phishing werkt overal. Een schoolcomputer beschermt je niet tegen een nep-link. WAT je doet (link checken, 2FA gebruiken) is belangrijker dan WAAR je inlogt.',
                },
                {
                    id: 7,
                    icon: '📞',
                    title: 'Bij twijfel: bel de organisatie op via een zelfopgezocht nummer',
                    description:
                        'Als je een verdacht bericht ontvangt namens je bank of school, zoek je het officiële telefoonnummer zelf op via de website en belt het na.',
                    correct: true,
                    explanation:
                        'Dit is de gouden regel bij twijfel. Gebruik NOOIT het nummer in het verdachte bericht — dat kan ook nep zijn. Zoek het nummer zelf op via een betrouwbare bron.',
                },
                {
                    id: 8,
                    icon: '🌐',
                    title: 'Controleren of er HTTPS in de adresbalk staat',
                    description:
                        'Je controleert altijd of er een slotje en "https://" staat in de adresbalk voor je gegevens invult.',
                    correct: true,
                    explanation:
                        'HTTPS betekent dat de verbinding versleuteld is — maar het zegt niets over of de website betrouwbaar is. Een nep-website kan ook HTTPS hebben. Gebruik HTTPS als basischeck, maar kijk ook naar het domein.',
                },
            ],
        },
    ],
};

export default config;
