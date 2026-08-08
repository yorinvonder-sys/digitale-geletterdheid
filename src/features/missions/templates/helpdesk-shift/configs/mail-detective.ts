import type { HelpdeskShiftConfig } from '../types';

const config: HelpdeskShiftConfig = {
    missionId: 'mail-detective',
    title: 'Helpdeskdienst',
    introEmoji: '🎧',
    introTitle: 'Jij draait de IT-helpdesk',
    introDescription:
        'Vanochtend ben jij de IT-helpdesk van Ons School. Berichten stromen binnen op je scherm — sommige zijn nep, sommige zijn gewoon echt. Bij elk bericht kies jij: meld het bij IT, gooi het weg, of laat het gewoon door. Verkeerde keuzes hebben gevolgen die je meteen ziet.',
    introFeatures: [
        'Loop naar de collega bij wie een bericht binnenkomt',
        'Kies: melden bij IT, weggooien, of doorlaten',
        'Zie direct wat een foute keuze de school kost',
        'Neem de tijd: het volgende bericht komt pas als jij klaar bent',
    ],
    learningObjectives: [
        'De leerling herkent binnen enkele seconden verdachte signalen in een echt binnenkomend bericht (afzenderdomein, bijlagetype, linkbestemming, urgentietaal, verzoek om gegevens).',
        'De leerling kiest onder tijdsdruk een passende handeling (melden, weggooien, doorlaten) in plaats van automatisch alles weg te klikken.',
        'De leerling onderscheidt een verdacht ogend maar echt bericht van een bericht dat er onschuldig uitziet maar nep is.',
        'De leerling begrijpt dat een foute keuze een concreet, zichtbaar gevolg heeft voor echte mensen op school.',
    ],
    startStand: {
        veiligeAccounts: 12,
        verlorenGeld: 0,
        meldingen: 0,
    },
    mails: [
        {
            id: 1,
            fromName: 'Roos Jansen',
            fromAddress: 'r.jansen@onsschool.nl',
            subject: 'Vraag over inleverdatum',
            preview: 'Hoi, weet iemand of het project ook op vrijdag mag?',
            body: [
                'Hoi,',
                'Ik vroeg me af of het project ook op vrijdag ingeleverd mag worden in plaats van donderdag. Kun je dit doorgeven aan de administratie?',
                'Groetjes, Roos',
            ],
            juisteActie: 'doorlaten',
            tell: 'Gewoon schooldomein, geen link, geen bijlage, geen druk om snel te reageren.',
            uitleg:
                'Dit is een heel normaal bericht: het komt van het echte schooldomein (@onsschool.nl), er zit geen link of bijlage bij, en er is geen haast. Zulke berichten laat je gewoon door.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde het bericht van Roos bij IT. Die zagen meteen dat het een normale vraag was en stuurden het gewoon terug — verspilde tijd voor iedereen.',
                },
                weggooien: {
                    melding:
                        'Je gooide het bericht van Roos weg. Ze krijgt nooit antwoord op haar vraag en denkt dat niemand haar mail heeft gezien.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'r.jansen@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Dit is het echte schooldomein — precies zo hoort het e-mailadres van een leerling of collega eruit te zien.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Vraag over inleverdatum',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Een gewone, duidelijke onderwerpregel zonder dreiging of haast.',
                },
                {
                    id: 'verzoek',
                    tekst: 'Kun je dit doorgeven aan de administratie?',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Een gewoon verzoek tussen collega’s — geen vraag om een wachtwoord of geld.',
                },
            ],
        },
        {
            id: 2,
            fromName: 'IT-Support',
            fromAddress: 'noreply@sch00lportaal-nl.com',
            subject: 'Actie vereist: wachtwoord verlopen',
            preview: 'Je wachtwoord verloopt vandaag. Log direct in om te voorkomen dat...',
            body: [
                'Beste gebruiker,',
                'Je schoolwachtwoord verloopt vandaag om 17:00 uur. Log direct in via onderstaande link en vul je huidige inloggegevens in om je account actief te houden.',
                'Doe je dit niet op tijd, dan wordt je account automatisch geblokkeerd.',
            ],
            link: { label: 'Wachtwoord verlengen', destination: 'sch00lportaal-inlog.ru' },
            juisteActie: 'melden',
            tell: 'Het domein heeft een nul in plaats van een o ("sch00l") en vraagt om je inloggegevens.',
            uitleg:
                'Kijk goed naar het domein: er staat "sch00l" met nullen in plaats van letters — dat is geen echt schooldomein. De mail vraagt bovendien om je gebruikersnaam en wachtwoord in te vullen. Echte IT-afdelingen vragen dat nooit via een link in een mail.',
            gevolg: {
                doorlaten: {
                    melding:
                        'Meneer Smits klikte op de link en vulde zijn inloggegevens in. Zijn account is nu in handen van een onbekende.',
                    accountsKwijt: 1,
                },
                weggooien: {
                    melding:
                        'Je gooide de nepmail weg — veilig voor jou, maar niemand anders is gewaarschuwd. Een klasgenoot kreeg dezelfde mail en trapte er wél in.',
                    accountsKwijt: 1,
                },
            },
            vlaggen: [
                {
                    id: 'afzendernaam',
                    tekst: 'IT-Support',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'De naam klinkt heel gewoon — een nepnaam is nooit het probleem, kijk altijd naar het echte adres ernaast.',
                },
                {
                    id: 'afzenderdomein',
                    tekst: 'noreply@sch00lportaal-nl.com',
                    plek: 'afzender',
                    verdacht: true,
                    uitleg: 'Er staan nullen in "sch00l" in plaats van letters, en het domein eindigt niet op onsschool.nl.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Actie vereist: wachtwoord verlopen',
                    plek: 'onderwerp',
                    verdacht: true,
                    uitleg: 'Dit onderwerp jaagt je op om snel te klikken zonder na te denken.',
                },
                {
                    id: 'inloggegevens',
                    tekst: 'vul je huidige inloggegevens in',
                    plek: 'tekst',
                    verdacht: true,
                    uitleg: 'Een echte IT-afdeling vraagt nooit om je wachtwoord via een link in een mail.',
                },
                {
                    id: 'link',
                    tekst: 'sch00lportaal-inlog.ru',
                    plek: 'link',
                    verdacht: true,
                    uitleg: 'Dit .ru-adres heeft niets met de school te maken, ook al klinkt "portaal" vertrouwd.',
                },
            ],
        },
        {
            id: 3,
            fromName: 'Magister',
            fromAddress: 'noreply@magister.net',
            subject: 'Nieuw cijfer beschikbaar',
            preview: 'Er staat een nieuw cijfer klaar voor Wiskunde.',
            body: [
                'Er is een nieuw cijfer toegevoegd aan je dossier.',
                'Log in op Magister om het te bekijken.',
            ],
            juisteActie: 'doorlaten',
            tell: 'Officieel Magister-domein (magister.net), geen link om ergens anders heen te klikken, geen verzoek om gegevens.',
            uitleg:
                'Dit komt van het echte Magister-domein en vraagt je gewoon om zelf in te loggen — geen link, geen druk, geen gegevensverzoek. Dit is precies hoe een normale melding van een schoolsysteem eruitziet.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde de Magister-melding bij IT. Die moesten uitleggen dat dit gewoon een automatisch, veilig bericht was.',
                },
                weggooien: {
                    melding:
                        'Je gooide de melding weg. De leerling weet niet dat er een nieuw cijfer klaarstaat en checkt het pas dagen later.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'noreply@magister.net',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Dit is het officiële domein van het echte cijfersysteem van school.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Nieuw cijfer beschikbaar',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Een gewone melding zonder dreiging of haast.',
                },
                {
                    id: 'verzoek',
                    tekst: 'Log in op Magister om het te bekijken.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Je wordt gevraagd zelf in te loggen op het bekende systeem, niet via een link ergens anders.',
                },
            ],
        },
        {
            id: 4,
            fromName: 'Conciërge',
            fromAddress: 'conciërge@onsschool.nl',
            subject: 'Rooster gymzaal',
            preview: 'Zie bijlage voor het nieuwe rooster van de gymzaal.',
            body: [
                'Beste collega,',
                'Bijgevoegd het nieuwe rooster voor gebruik van de gymzaal deze maand.',
            ],
            attachment: { filename: 'gymzaal_rooster.pdf', size: '210 KB' },
            juisteActie: 'doorlaten',
            acceptabeleActie: 'melden',
            tell: 'Echt schooldomein en een gewone PDF-bijlage — precies wat je van een collega zou verwachten.',
            uitleg:
                'Het adres eindigt op @onsschool.nl en de bijlage is een gewone PDF, geen programmabestand. Dit is een normaal intern bericht. Twijfel je toch over een bijlage: melden bij IT om te laten checken is ook een prima, voorzichtige keuze.',
            gevolg: {
                weggooien: {
                    melding:
                        'Je gooide het roosterbericht weg. De gymzaal wordt deze maand dubbel geboekt omdat niemand het nieuwe rooster zag.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'conciërge@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Een echt schooldomein.',
                },
                {
                    id: 'bijlage',
                    tekst: 'gymzaal_rooster.pdf',
                    plek: 'bijlage',
                    verdacht: false,
                    uitleg: 'Een gewoon PDF-document, geen uitvoerbaar bestand.',
                },
                {
                    id: 'tekst',
                    tekst: 'Bijgevoegd het nieuwe rooster voor gebruik van de gymzaal deze maand.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Duidelijke, onschuldige inhoud zonder verzoek om gegevens of geld.',
                },
            ],
        },
        {
            id: 5,
            fromName: 'Klassenfoto Service',
            fromAddress: 'bestellingen@schoolfotos-bezorgd.info',
            subject: 'Bekijk je klassenfoto\'s hier!',
            preview: 'Je klassenfoto\'s staan klaar — bekijk ze via de bijlage.',
            body: [
                'Beste ouder/verzorger,',
                'De klassenfoto\'s van dit schooljaar staan klaar! Open de bijlage om ze te bekijken en te bestellen.',
            ],
            attachment: { filename: 'klassenfotos_bekijken.scr', size: '3,4 MB' },
            juisteActie: 'melden',
            tell: 'De bijlage eindigt op .scr — dat is een uitvoerbaar programma, geen foto.',
            uitleg:
                'Een foto-bestand eindigt op iets als .jpg of .png, nooit op .scr. Een .scr-bestand (schermbeveiliging, maar in de praktijk vaak misbruikt) is eigenlijk een programma dat kan worden uitgevoerd. Ook het domein "schoolfotos-bezorgd.info" is niet van de school. Dit is een truc om schadelijke software te installeren.',
            gevolg: {
                doorlaten: {
                    melding:
                        'Een ouder opende de bijlage om de klassenfoto\'s te zien. In plaats daarvan installeerde het bestand ongemerkt schadelijke software op de computer.',
                    accountsKwijt: 1,
                },
                weggooien: {
                    melding:
                        'Je gooide de nepmail weg — veilig voor jou, maar andere ouders kregen dezelfde mail zonder waarschuwing.',
                    accountsKwijt: 1,
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'bestellingen@schoolfotos-bezorgd.info',
                    plek: 'afzender',
                    verdacht: true,
                    uitleg: 'Dit domein heeft niets met de school te maken, ook al klinkt het woord "school" erin mee.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Bekijk je klassenfoto’s hier!',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Enthousiasme over foto’s is op zichzelf niets bijzonders — het echte probleem zit in het domein en de bijlage.',
                },
                {
                    id: 'bijlage',
                    tekst: 'klassenfotos_bekijken.scr',
                    plek: 'bijlage',
                    verdacht: true,
                    uitleg: 'Een bestand dat eindigt op .scr is een programma, geen foto.',
                },
                {
                    id: 'tekst',
                    tekst: 'Open de bijlage om ze te bekijken en te bestellen.',
                    plek: 'tekst',
                    verdacht: true,
                    uitleg: 'Je wordt aangespoord de bijlage te openen — precies de gevaarlijke actie bij dit bestandstype.',
                },
            ],
        },
        {
            id: 6,
            fromName: 'Systeembeheer',
            fromAddress: 'systeembeheer@onsschool.nl',
            subject: 'Onderhoud vannacht — server tijdelijk offline',
            preview: 'Vannacht tussen 02:00 en 04:00 is Magister niet bereikbaar.',
            body: [
                'LET OP: vannacht tussen 02:00 en 04:00 uur voeren we onderhoud uit aan de servers.',
                'Magister en de schoolmail zijn in die periode niet bereikbaar. Dit is een automatisch gegenereerd bericht, reageer hier niet op.',
            ],
            juisteActie: 'doorlaten',
            tell: 'Ziet er alarmerend uit met hoofdletters, maar komt van het echte schooldomein en vraagt nergens om te klikken of in te loggen.',
            uitleg:
                'Deze mail ziet er streng uit door de hoofdletters, maar dat maakt hem niet nep. Hij komt van het echte @onsschool.nl-domein, bevat geen link en geen verzoek om gegevens — het is gewoon een automatische systeemmelding. Niet elk dringend-klinkend bericht is een aanval; kijk altijd naar het domein en wat er precies gevraagd wordt.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde de onderhoudsmelding bij IT. Die moesten uitleggen dat het gewoon hun eigen automatische bericht was.',
                },
                weggooien: {
                    melding:
                        'Je gooide de onderhoudsmelding weg. Een docent werkt vannacht door en verliest onverwacht zijn werk als Magister uitvalt.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'systeembeheer@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Een echt schooldomein.',
                },
                {
                    id: 'hoofdletters',
                    tekst: 'LET OP: vannacht tussen 02:00 en 04:00 uur voeren we onderhoud uit aan de servers.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'De hoofdletters klinken streng, maar er wordt niets gevraagd — geen link, geen wachtwoord, geen geld.',
                },
                {
                    id: 'automatisch',
                    tekst: 'Dit is een automatisch gegenereerd bericht, reageer hier niet op.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Typisch voor een systeemmelding, geen verzoek om actie te ondernemen.',
                },
            ],
        },
        {
            id: 7,
            fromName: 'Directie',
            fromAddress: 'directie@onsschool-berichten.net',
            subject: 'URGENT: bevestig je gegevens voor uitbetaling',
            preview: 'Bevestig vandaag nog je gegevens, anders vervalt je vergoeding.',
            body: [
                'Beste medewerker,',
                'Voor de uitbetaling van de reiskostenvergoeding hebben we vandaag nog je bankgegevens nodig. Bevestig deze zo snel mogelijk via de link, anders vervalt je vergoeding deze maand.',
            ],
            link: { label: 'Gegevens bevestigen', destination: 'formulieren-onsschool-net.ru' },
            juisteActie: 'melden',
            tell: 'Ander domein dan de echte school ("onsschool-berichten.net") en grote haast om bankgegevens door te geven.',
            uitleg:
                'Het echte schooldomein is @onsschool.nl — dit bericht komt van "onsschool-berichten.net", een ander domein dat net genoeg lijkt om niet meteen op te vallen. De combinatie van haast ("vandaag nog") en een verzoek om bankgegevens is een klassieke truc om geld te stelen.',
            gevolg: {
                doorlaten: {
                    melding:
                        'De administratie vulde de bankgegevens in. Er werd €1.250 overgemaakt naar een onbekende rekening.',
                    geldKwijt: 1250,
                },
                weggooien: {
                    melding:
                        'Je gooide de mail weg — veilig voor jou, maar een collega kreeg dezelfde mail en werd wél opgelicht.',
                    geldKwijt: 1250,
                },
            },
            vlaggen: [
                {
                    id: 'afzendernaam',
                    tekst: 'Directie',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'De naam zelf ziet er heel gewoon uit — kijk daarom altijd naar het volledige adres ernaast.',
                },
                {
                    id: 'afzenderdomein',
                    tekst: 'directie@onsschool-berichten.net',
                    plek: 'afzender',
                    verdacht: true,
                    uitleg: 'Dit domein lijkt op de school maar is niet hetzelfde als het echte @onsschool.nl.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'URGENT: bevestig je gegevens voor uitbetaling',
                    plek: 'onderwerp',
                    verdacht: true,
                    uitleg: 'Hoofdletters en haast zijn bedoeld om je niet te laten nadenken.',
                },
                {
                    id: 'tekst',
                    tekst: 'Bevestig deze zo snel mogelijk via de link, anders vervalt je vergoeding deze maand.',
                    plek: 'tekst',
                    verdacht: true,
                    uitleg: 'Dreiging, haast en een verzoek om bankgegevens is een klassieke oplichtingstruc.',
                },
                {
                    id: 'link',
                    tekst: 'formulieren-onsschool-net.ru',
                    plek: 'link',
                    verdacht: true,
                    uitleg: 'Dit eindigt op .ru, een domein dat niets met de school te maken heeft.',
                },
            ],
        },
        {
            id: 8,
            fromName: 'Ouderraad',
            fromAddress: 'ouderraad@onsschool.nl',
            subject: 'Verslag ouderraad-vergadering',
            preview: 'Bijgevoegd het verslag van de vergadering van afgelopen dinsdag.',
            body: [
                'Beste ouders,',
                'Zoals beloofd het verslag van de laatste vergadering, met daarin ook de begroting voor het schoolfeest.',
            ],
            attachment: { filename: 'verslag_ouderraad_okt.docx', size: '95 KB' },
            juisteActie: 'doorlaten',
            tell: 'Echt schooldomein en een gewoon Word-document — niets vreemds aan.',
            uitleg:
                'Afzender en domein kloppen, en de bijlage is een gewoon Word-bestand (.docx), geen programma. Dit is normale schoolcommunicatie zonder enig waarschuwingssignaal.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde het verslag bij IT. Die zagen meteen dat het een gewoon, veilig bericht was.',
                },
                weggooien: {
                    melding:
                        'Je gooide het verslag weg. Ouders missen de informatie over de begroting van het schoolfeest.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'ouderraad@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Een echt schooldomein.',
                },
                {
                    id: 'bijlage',
                    tekst: 'verslag_ouderraad_okt.docx',
                    plek: 'bijlage',
                    verdacht: false,
                    uitleg: 'Een gewoon Word-document, geen uitvoerbaar bestand.',
                },
                {
                    id: 'tekst',
                    tekst: 'Zoals beloofd het verslag van de laatste vergadering, met daarin ook de begroting voor het schoolfeest.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Rustige, informatieve tekst zonder verzoek om actie of gegevens.',
                },
            ],
        },
        {
            id: 9,
            fromName: 'Meneer De Wit',
            fromAddress: 'dewit@onsschool.nl',
            subject: 'Bekijk deze presentatie voor de les',
            preview: 'Voor morgen: bekijk deze presentatie via de link hieronder.',
            body: [
                'Beste klas,',
                'Voor morgen graag onderstaande presentatie doornemen. Klik op de link om hem te openen.',
            ],
            link: { label: 'Open presentatie', destination: 'gedeelde-bestanden-schoolnet.info' },
            juisteActie: 'melden',
            acceptabeleActie: 'weggooien',
            tell: 'Het adres van de afzender klopt, maar de link gaat naar een heel ander, onbekend domein.',
            uitleg:
                'Dit is een twijfelgeval: het afzenderadres lijkt echt, maar de link achter de knop gaat naar "gedeelde-bestanden-schoolnet.info" — een domein dat niets met de school te maken heeft. Dat kan betekenen dat het account van meneer De Wit is overgenomen. Melden bij IT is de beste keuze zodat zij het kunnen checken; weggooien is ook veilig, maar dan wordt het account-probleem niet ontdekt.',
            gevolg: {
                doorlaten: {
                    melding:
                        'Een klasgenoot klikte op de link naar de presentatie. De site vroeg om in te loggen met het schoolaccount — en dat account is nu weg.',
                    accountsKwijt: 1,
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'dewit@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Het adres van de afzender zelf klopt gewoon — dat is precies wat dit lastig maakt.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Bekijk deze presentatie voor de les',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Een heel gewone onderwerpregel voor een docent, niets vreemds aan.',
                },
                {
                    id: 'link',
                    tekst: 'gedeelde-bestanden-schoolnet.info',
                    plek: 'link',
                    verdacht: true,
                    uitleg: 'Deze link gaat naar een domein dat niets met de school te maken heeft, ook al klinkt "schoolnet" vertrouwd.',
                },
                {
                    id: 'tekst',
                    tekst: 'Klik op de link om hem te openen.',
                    plek: 'tekst',
                    verdacht: true,
                    uitleg: 'Je wordt aangespoord op een link te klikken die naar een onbekend domein leidt — dat blijft opletten waard, ook als de afzender klopt.',
                },
            ],
        },
        {
            id: 10,
            fromName: 'Bibliotheek',
            fromAddress: 'bibliotheek@onsschool.nl',
            subject: 'Boek te laat ingeleverd',
            preview: 'Je hebt een boek te laat ingeleverd. Lever het z.s.m. in.',
            body: [
                'Beste leerling,',
                'Volgens onze administratie is "De Ontdekking van de Hemel" nog niet ingeleverd. Lever het boek zo snel mogelijk in bij de bibliotheek om een boete te voorkomen.',
            ],
            juisteActie: 'doorlaten',
            tell: 'Gewoon schooldomein, geen link, geen bijlage — een normale administratieve herinnering.',
            uitleg:
                'Dit komt van het echte schooldomein en vraagt nergens om te klikken of gegevens in te vullen. Het is gewoon een administratieve herinnering, precies zoals je die van een bibliotheek zou verwachten.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde de bibliotheekherinnering bij IT. Die zagen dat het een normaal berichtje was.',
                },
                weggooien: {
                    melding:
                        'Je gooide de herinnering weg. De leerling krijgt een boete omdat hij niet wist dat het boek nog terug moest.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'bibliotheek@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Een echt schooldomein.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Boek te laat ingeleverd',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Een gewone administratieve mededeling, geen dreiging met een account of geld.',
                },
                {
                    id: 'tekst',
                    tekst: 'Lever het boek zo snel mogelijk in bij de bibliotheek om een boete te voorkomen.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Vraagt om een fysieke handeling — het boek inleveren — niet om in te loggen of gegevens te geven.',
                },
            ],
        },
        {
            id: 11,
            fromName: 'Financiële Administratie',
            fromAddress: 'facturatie@onsschool-betalingen.com',
            subject: 'Factuur schoolreis — betaal binnen 24 uur',
            preview: 'Je factuur voor de schoolreis staat klaar. Betaal binnen 24 uur.',
            body: [
                'Beste ouder/verzorger,',
                'Bijgevoegd de factuur voor de schoolreis van uw kind. Betaal het bedrag van €85 binnen 24 uur via de bijgevoegde betaallink om de plek te garanderen.',
            ],
            attachment: { filename: 'factuur_schoolreis.pdf', size: '140 KB' },
            link: { label: 'Nu betalen', destination: 'betalen-schoolreis-ideal.net' },
            juisteActie: 'melden',
            tell: 'Domein wijkt af van de echte school en de betaallink gaat naar een heel ander, extern adres.',
            uitleg:
                'De echte school factureert vanaf @onsschool.nl, niet vanaf "onsschool-betalingen.com". De betaallink gaat bovendien naar een extern domein dat niets met iDEAL of de school te maken heeft. Dit is een factuurtruc gericht op ouders — precies daarom is dit soort mail vaak naar de administratie gericht.',
            gevolg: {
                doorlaten: {
                    melding:
                        'Een ouder betaalde €85 via de nep-link. Het geld ging naar de oplichter, niet naar de school.',
                    geldKwijt: 85,
                },
                weggooien: {
                    melding:
                        'Je gooide de nepfactuur weg — veilig voor jou, maar een andere ouder kreeg dezelfde mail en betaalde wél.',
                    geldKwijt: 85,
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'facturatie@onsschool-betalingen.com',
                    plek: 'afzender',
                    verdacht: true,
                    uitleg: 'Dit domein wijkt af van het echte @onsschool.nl, ook al staat er "onsschool" in.',
                },
                {
                    id: 'bijlage',
                    tekst: 'factuur_schoolreis.pdf',
                    plek: 'bijlage',
                    verdacht: false,
                    uitleg: 'De bijlage zelf is een gewoon PDF-bestand — het gevaar zit hem hier niet in de bijlage, maar in de link en het domein.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Factuur schoolreis — betaal binnen 24 uur',
                    plek: 'onderwerp',
                    verdacht: true,
                    uitleg: 'De tijdsdruk is bedoeld om je snel te laten klikken zonder na te denken.',
                },
                {
                    id: 'link',
                    tekst: 'betalen-schoolreis-ideal.net',
                    plek: 'link',
                    verdacht: true,
                    uitleg: 'Dit is geen echt iDEAL-adres en heeft niets met de school te maken, ondanks het woord "ideal" erin.',
                },
            ],
        },
        {
            id: 12,
            fromName: 'Mentor - Mevrouw Aksoy',
            fromAddress: 'aksoy@onsschool.nl',
            subject: 'Laatste kans: geef je keuze voor het kamp door',
            preview: 'Geef vóór morgenochtend 9:00 uur je keuze door voor het schoolkamp.',
            body: [
                'Beste leerling,',
                'Dit is de laatste oproep: geef vóór morgenochtend 9:00 uur je keuze voor het schoolkamp door via het formulier op Magister. Na die tijd wordt automatisch een groep voor je gekozen.',
            ],
            juisteActie: 'doorlaten',
            tell: 'Wel wat haast in de tekst, maar echt schooldomein, geen externe link en geen verzoek om gegevens.',
            uitleg:
                'Er zit een deadline in dit bericht, maar dat maakt het niet verdacht: het komt van het echte schooldomein, verwijst naar het eigen Magister-systeem en vraagt niet om gegevens via een link. Niet elke haast betekent gevaar — kijk altijd naar domein, link en verzoek samen.',
            gevolg: {
                melden: {
                    melding:
                        'Je meldde de oproep van de mentor bij IT. Die zagen dat het gewoon een normale herinnering was.',
                },
                weggooien: {
                    melding:
                        'Je gooide de oproep weg. De leerling geeft zijn keuze niet op tijd door en wordt in een willekeurige kampgroep geplaatst.',
                },
            },
            vlaggen: [
                {
                    id: 'afzenderdomein',
                    tekst: 'aksoy@onsschool.nl',
                    plek: 'afzender',
                    verdacht: false,
                    uitleg: 'Een echt schooldomein.',
                },
                {
                    id: 'onderwerp',
                    tekst: 'Laatste kans: geef je keuze voor het kamp door',
                    plek: 'onderwerp',
                    verdacht: false,
                    uitleg: 'Een deadline is normaal bij zoiets als een schoolkamp en zegt op zichzelf niets over nepgevaar.',
                },
                {
                    id: 'tekst',
                    tekst: 'Na die tijd wordt automatisch een groep voor je gekozen.',
                    plek: 'tekst',
                    verdacht: false,
                    uitleg: 'Een gewoon gevolg van te laat zijn, geen dreiging met een account of geld en geen verzoek om ergens op te klikken.',
                },
            ],
        },
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🎧',
            title: 'Helpdeskheld',
            color: '#ff3c21',
        },
        {
            minScore: 60,
            emoji: '📬',
            title: 'Scherpe Blik',
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
        'Controleer altijd het volledige e-mailadres van de afzender — niet alleen de weergegeven naam, en let op kleine afwijkingen in het domein.',
        'Urgentie en dreiging ("vandaag nog", "anders vervalt je account") zijn waarschuwingssignalen, geen redenen om snel te reageren.',
        'Een link kan naar een heel ander adres leiden dan de tekst laat zien — en niet elk dringend bericht is nep, dus kijk altijd naar domein, link en verzoek sámen.',
        'Bijlagen die geen document zijn (zoals .exe of .scr) kunnen schadelijke software bevatten — open ze nooit.',
        'Twijfel je? Meld het bericht bij IT in plaats van het zomaar weg te gooien — zo worden ook anderen gewaarschuwd.',
    ],
};

export default config;
