import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Circle,
    Clock,
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Palmtree,
    Zap,
    Target,
    CalendarDays,
    User,
    ChevronUp,
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────

interface SprintTask {
    id: string;
    title: string;
    description: string;       // Begrijpelijke uitleg: wat is dit en waarom?
    youDo: string;             // Wat jij (Yorin) concreet moet doen
    claudeDoes: string;        // Wat Claude doet
    time: string;
    priority: 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
}

interface Sprint {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    dateRange: string;
    startDate: string;
    endDate: string;
    hours: string;
    isPause?: boolean;
    focusPriority: string;
    tasks: SprintTask[];
}

const PRIORITY_LABELS: Record<string, string> = {
    p1: 'Opdrachten',
    p2: 'UI/UX',
    p3: 'Bugs',
    p4: 'Zakelijk',
    p5: 'Homepage',
    p6: 'Dashboard',
};

const PRIORITY_COLORS: Record<string, string> = {
    p1: 'bg-rose-50 text-rose-600 border-rose-100',
    p2: 'bg-violet-50 text-violet-600 border-violet-100',
    p3: 'bg-orange-50 text-orange-600 border-orange-100',
    p4: 'bg-amber-50 text-amber-700 border-amber-100',
    p5: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    p6: 'bg-teal-50 text-teal-600 border-teal-100',
};

const SPRINTS: Sprint[] = [
    {
        id: 's1',
        number: 1,
        title: 'Opdrachten (deel 1)',
        subtitle: 'Security fix + start missie-review',
        dateRange: '1–8 mrt',
        startDate: '2026-03-01',
        endDate: '2026-03-08',
        hours: '~4–5 uur',
        focusPriority: 'p1',
        tasks: [
            {
                id: 's1-t1',
                title: 'Beveiligingsprobleem oplossen in AI-chat',
                description: 'Op dit moment stuurt de app een soort "instructiebriefje" voor de AI mee vanuit de browser van de leerling. Dat is niet veilig — iemand zou dat briefje kunnen aanpassen en de AI verkeerde opdrachten geven. Claude lost dit op door dat briefje voortaan alleen op de server te verwerken, zodat leerlingen het niet kunnen manipuleren.',
                youDo: 'Niets — dit is puur technisch werk. Zodra Claude klaar is, test je even of de AI-chat nog normaal werkt door een missie te openen en een bericht te sturen.',
                claudeDoes: 'De code aanpassen zodat de AI-instructies server-side worden gevalideerd, en de fix deployen naar de live omgeving.',
                time: '2u',
                priority: 'p1',
            },
            {
                id: 's1-t2',
                title: 'Eerste batch missies doorlopen op kwaliteit (jaar 1, blok 1+2)',
                description: 'Er zijn 94 missies in het platform. We beginnen met de missies die leerlingen als eerste tegenkomen: jaar 1, blok 1 en 2. Claude loopt ze één voor één na op kwaliteit: kloppen de stappen? Is de taal begrijpelijk voor een 12-jarige? Past het bij de SLO-kerndoelen (de officiële leerdoelen van de overheid)?',
                youDo: 'Open Claude Code en zeg: "Doe taak 1.2: review de missies van jaar 1 blok 1 en 2." Je krijgt een rapport terug. Lees dat rapport en geef aan welke verbeterpunten je het meest urgent vindt. Jij beslist als docent — Claude voert uit.',
                claudeDoes: 'Alle missies van jaar 1, blok 1+2 systematisch doorlopen en een rapport maken met: wat klopt, wat niet klopt, en welke missies herschreven moeten worden.',
                time: '3u',
                priority: 'p1',
            },
        ],
    },
    {
        id: 'pause',
        number: 0,
        title: 'Schoolreis',
        subtitle: 'Geen werk. Geniet van de reis.',
        dateRange: '9–14 mrt',
        startDate: '2026-03-09',
        endDate: '2026-03-14',
        hours: '',
        focusPriority: 'p1',
        isPause: true,
        tasks: [],
    },
    {
        id: 's2',
        number: 2,
        title: 'Opdrachten (deel 2)',
        subtitle: 'Missies afronden + branding starten',
        dateRange: '15–28 mrt',
        startDate: '2026-03-15',
        endDate: '2026-03-28',
        hours: '~10 uur',
        focusPriority: 'p1',
        tasks: [
            {
                id: 's2-t1',
                title: 'Resterende missies reviewen (jaar 1 blok 3+4, jaar 2 en 3)',
                description: 'We gaan verder waar we gebleven zijn. Nu worden de missies voor de oudere leerjaren doorgelopen. Jaar 2 en 3 zijn complexer — de opdrachten gaan over AI, privacy, deepfakes, en online veiligheid. Die moeten didactisch kloppen én veilig zijn voor minderjarigen.',
                youDo: 'Zeg in Claude Code: "Doe taak 2.1: review jaar 1 blok 3+4, jaar 2 en jaar 3." Lees het rapport, geef prioriteit aan de problemen die je zelf ook als docent zou signaleren.',
                claudeDoes: 'De overige missies doorlopen op kwaliteit, taal, veiligheid en aansluiting op SLO-kerndoelen. Rapport opleveren per jaargroep.',
                time: '3u',
                priority: 'p1',
            },
            {
                id: 's2-t2',
                title: 'Uitzoeken welke leerdoelen nog ontbreken',
                description: 'De overheid heeft officiële leerdoelen voor digitale geletterdheid (SLO-kerndoelen). Claude checkt of alle kerndoelen minstens één missie hebben in het platform. Als er een kerndoel is zonder missie, dan is er een gat in het curriculum — dat is een probleem als scholen vragen: "Dekt dit jullie programma volledig?"',
                youDo: 'Wacht op het rapport van Claude. Beslis dan: welke ontbrekende kerndoelen zijn het meest urgent om te vullen? Als docent weet jij beter dan Claude wat scholen prioriteit geven.',
                claudeDoes: 'Een lijst maken van alle SLO-kerndoelen, en per kerndoel controleren of er een missie bij hoort. De gaten rapporteren.',
                time: '1u',
                priority: 'p1',
            },
            {
                id: 's2-t3',
                title: 'De 3 belangrijkste ontbrekende missies schrijven',
                description: 'Op basis van de gatenanalyse schrijven we de drie meest urgente missies die nog missen. Elke missie heeft een scenario ("Je bent..."), een opdracht, stappen voor de leerling, en een AI-agent die de leerling begeleidt. Dit is de kern van het product.',
                youDo: 'Geef Claude de drie kerndoelen die je het meest urgent vindt. Zeg: "Schrijf een missie voor [kerndoel X]." Lees de concept-missie en geef als docent feedback: klopt het didactisch? Past het bij de doelgroep?',
                claudeDoes: 'Drie volledige missies schrijven in het juiste format, inclusief scenario, stappen, AI-instructies en XP-waarde.',
                time: '3u',
                priority: 'p1',
            },
            {
                id: 's2-t4',
                title: 'Didactische visie op papier zetten',
                description: 'Als scholen vragen "waarom werkt dit?", moet je een antwoord klaar hebben dat meer is dan "wij hebben 94 missies". De didactische onderbouwing legt uit welk leermodel je gebruikt (bijv. ervaringsleren, scaffolding), waarom AI-begeleiding werkt, en hoe het aansluit bij de SLO-kerndoelen. Dit is het document dat je meestuurt naar ICT-coördinatoren.',
                youDo: 'Vertel Claude in eigen woorden waarom jij gelooft dat dit platform werkt voor leerlingen. Wat zie je in de klas? Wat werkte bij jou als docent? Die input maakt het document authentiek.',
                claudeDoes: 'Een professioneel didactisch onderbouwingsdocument schrijven op basis van jouw input, aangevuld met onderwijskundige bronnen.',
                time: '2u',
                priority: 'p1',
            },
            {
                id: 's2-t5',
                title: 'Branding vastleggen: wie zijn we, wat is onze toon?',
                description: 'DGSkills heeft nog geen officieel "merkverhaal". Wat is de missie in één zin? Hoe klinkt de app — formeel of juist casual? Welke kleuren en lettertypes horen erbij? Dit document zorgt ervoor dat alles — de app, de homepage, e-mails aan scholen — één geheel vormt.',
                youDo: 'Beantwoord drie vragen voor Claude: (1) Wat wil je dat leerlingen over 5 jaar over DGSkills zeggen? (2) Beschrijf DGSkills als een persoon — hoe praat die? (3) Welke drie woorden omschrijven het platform het beste?',
                claudeDoes: 'Een brandingdocument schrijven met: missie, visie, tone-of-voice, kleurenpalet en typografie — gebaseerd op jouw antwoorden.',
                time: '1u',
                priority: 'p2',
            },
        ],
    },
    {
        id: 's3',
        number: 3,
        title: 'UI/UX + Bugs',
        subtitle: 'Professionele uitstraling + zakelijk fundament',
        dateRange: '29 mrt – 11 apr',
        startDate: '2026-03-29',
        endDate: '2026-04-11',
        hours: '~10 uur',
        focusPriority: 'p2',
        tasks: [
            {
                id: 's3-t1',
                title: 'Visuele consistentie checken door heel de app',
                description: 'Na maanden bouwen kunnen er plekken zijn waar kleuren, lettergroottes of afstanden net niet kloppen — een knop die er iets anders uitziet dan andere knoppen, of een scherm dat op mobiel raar staat. Claude loopt de hele app door en maakt alles visueel consistent.',
                youDo: 'Wacht op de bevindingen van Claude. Bekijk de schermafbeeldingen of beschrijvingen en geef aan: "Dit vind ik inderdaad niet kloppen" of "Dit mag zo blijven." Jij hebt het laatste woord over hoe het eruitziet.',
                claudeDoes: 'De hele app doorlopen op visuele inconsistenties (kleuren, typografie, spacing, iconen) en een lijst van fixes maken + uitvoeren.',
                time: '2u',
                priority: 'p2',
            },
            {
                id: 's3-t2',
                title: 'Bugs opsporen: de volledige leerlingenflow uitproberen',
                description: 'We doorlopen de app precies zoals een leerling dat zou doen: inloggen → avatar kiezen → dashboard zien → missie starten → missie afronden → uitloggen. Elke stap die hapert of fout gaat wordt genoteerd en opgelost. Eén bug bij een leerling kan ervoor zorgen dat een docent het platform nooit meer gebruikt.',
                youDo: 'Log in als testeleerling en doe zelf ook de flow. Noteer alles wat raar voelt, ook al kun je het niet technisch omschrijven. "Dit scherm laadt traag" of "Ik weet niet wat ik hier moet doen" zijn ook bugs.',
                claudeDoes: 'De code analyseren op bekende foutpatronen, de gemelde bugs fixen, en controleren of de hele flow foutloos werkt.',
                time: '3u',
                priority: 'p3',
            },
            {
                id: 's3-t3',
                title: 'Snelheidsaudit: hoe snel laadt de app?',
                description: 'Google heeft een gratis tool (Lighthouse) die meet hoe snel een website laadt, hoe toegankelijk hij is voor mensen met een beperking, en hoe goed hij gevonden wordt in Google. We willen een score boven de 90. Een trage app verliest gebruikers — zeker op schoolcomputers die vaak traag zijn.',
                youDo: 'Niets — Claude voert dit volledig uit. Je mag wel het eindrapport bekijken: het geeft een cijfer van 0-100. Als het boven de 90 staat, is het klaar.',
                claudeDoes: 'Een Lighthouse-audit draaien, de 5 grootste problemen identificeren en oplossen in de code.',
                time: '2u',
                priority: 'p3',
            },
            {
                id: 's3-t4',
                title: 'Controleren of de app werkt op telefoon, tablet en computer',
                description: 'Leerlingen gebruiken van alles: een schoolchromebook, een iPad, of soms hun eigen telefoon. De app moet op al die schermen goed werken. Knoppen mogen niet te klein zijn voor vingers, tekst mag niet afgekapt worden, en menu\'s moeten bereikbaar zijn.',
                youDo: 'Open de app op je eigen telefoon en tablet (als je die hebt). Klik door de missies. Werkt alles? Meld aan Claude wat er raar of onhandig is.',
                claudeDoes: 'De app testen op verschillende schermformaten via de browser-developer tools, problemen fixen en responsief design verbeteren.',
                time: '1u',
                priority: 'p3',
            },
            {
                id: 's3-t5',
                title: 'KvK, bankrekening, belasting en verzekering regelen',
                description: 'Om je product aan scholen te mogen verkopen, moet je een officieel bedrijf zijn. Dat begint bij de Kamer van Koophandel (KvK). Daarna heb je een zakelijke rekening nodig om facturen te ontvangen, en een beroepsaansprakelijkheidsverzekering voor het geval er iets misgaat. Ook de BTW-vraag (21% of korting via KOR?) moet je beantwoord hebben vóór je eerste factuur stuurt.',
                youDo: '(1) Ga naar kvk.nl en schrijf je in als eenmanszaak — kost €75, doe je online in ~30 minuten. (2) Open een zakelijke rekening (Knab of Bunq zijn goedkoop voor starters). (3) Vraag Claude om een vergelijking van BAV-verzekeringen voor EdTech. (4) Vraag Claude om de KOR-berekening voor jouw verwachte omzet.',
                claudeDoes: 'Een checklist maken voor KvK-inschrijving, bankopties vergelijken, de KOR-berekening uitvoeren, en BAV-opties op een rij zetten.',
                time: '2u',
                priority: 'p4',
            },
        ],
    },
    {
        id: 's4',
        number: 4,
        title: 'Homepage + Dashboard',
        subtitle: 'Etalage + docentervaring verbeteren',
        dateRange: '12–25 apr',
        startDate: '2026-04-12',
        endDate: '2026-04-25',
        hours: '~10 uur',
        focusPriority: 'p5',
        tasks: [
            {
                id: 's4-t1',
                title: 'AI-chat demo en dashboard-demo afmaken op de homepage',
                description: 'Op de homepage willen we bezoekers (ICT-coördinatoren, directeurs) laten zien hoe het platform werkt — zonder dat ze hoeven in te loggen. Er zijn twee interactieve demo\'s gepland: één die laat zien hoe de AI-chat met een leerling werkt, en één die het docentendashboard toont. Die moeten nog afgemaakt worden.',
                youDo: 'Bekijk de huidige homepage op dgskills.app. Zeg tegen Claude wat je wil dat bezoekers ervaren als ze de demo uitproberen. Welke missie of welk dashboard-moment wil je laten zien?',
                claudeDoes: 'De twee demo-componenten bouwen en integreren in de homepage.',
                time: '2u',
                priority: 'p5',
            },
            {
                id: 's4-t2',
                title: 'Homepage overtuigender maken voor scholen',
                description: 'De homepage is nu technisch goed, maar verkoopt het product nog niet optimaal. Bezoekers moeten binnen 10 seconden begrijpen: wat is dit, voor wie is het, en waarom moet ik dit hebben? We verbeteren de teksten, de volgorde van informatie, en de knoppen die doorlinken naar "aanvragen".',
                youDo: 'Ga naar dgskills.app en lees de homepage alsof je een ICT-coördinator bent die dit voor het eerst ziet. Noteer: "Hier haak ik af" en "Dit overtuigt mij wél." Stuur die notities naar Claude.',
                claudeDoes: 'De teksten herschrijven, de call-to-action knoppen verbeteren, en social proof (bijv. "94 missies, 40+ uur lesmateriaal") prominenter plaatsen.',
                time: '2u',
                priority: 'p5',
            },
            {
                id: 's4-t3',
                title: 'Gevonden worden in Google verbeteren (SEO)',
                description: 'Als een ICT-coördinator googelt op "digitale geletterdheid tools VO" of "SLO kerndoelen software", wil je dat DGSkills bovenaan staat. Daarvoor moeten de juiste zoekwoorden op de juiste plekken staan in de code — niet zichtbaar voor bezoekers, maar wél voor Google.',
                youDo: 'Niets technisch — Claude doet dit volledig. Je kunt daarna eventueel via Google Search Console (gratis) bijhouden of je vindbaar bent.',
                claudeDoes: 'Meta-titels, beschrijvingen, alt-teksten bij afbeeldingen en schema-markup controleren en aanvullen voor de belangrijkste zoekwoorden.',
                time: '1u',
                priority: 'p5',
            },
            {
                id: 's4-t4',
                title: 'Docentendashboard eenvoudiger maken',
                description: 'Het docentendashboard heeft momenteel 11 tabbladen. Dat is veel. Een docent die dit voor het eerst ziet, weet niet waar te beginnen. We vereenvoudigen het zodat een docent binnen 5 minuten begrijpt hoe hij/zij een klas aanmaakt, leerlingen ziet, en een missie uitzet.',
                youDo: 'Log in als docent (of vraag Claude om testinloggegevens). Probeer zelf in 5 minuten: een klas aanmaken, een missie uitzetten, en de voortgang van een leerling zien. Wat lukt niet? Wat is onduidelijk?',
                claudeDoes: 'Op basis van jouw feedback de navigatie vereenvoudigen, de meest gebruikte functies prominenter zetten, en een mini-onboarding toevoegen voor nieuwe docenten.',
                time: '3u',
                priority: 'p6',
            },
            {
                id: 's4-t5',
                title: 'Focus-modus en groepsfunctie testen',
                description: 'De focus-modus is een unieke feature: als docent kun je alle leerlingen tegelijk naar één specifieke missie sturen (handig in de les). Groepen laten je differentiëren. Deze functies moeten foutloos werken vóór je een pilot draait — anders verlies je direct het vertrouwen van docenten.',
                youDo: 'Activeer de focus-modus vanuit het docentendashboard. Log daarna in als leerling en kijk of die correct de focus-modus ziet. Meld aan Claude wat je ziet.',
                claudeDoes: 'Bekende bugs in focus-modus en groepenbeheer opsporen en fixen.',
                time: '1u',
                priority: 'p6',
            },
            {
                id: 's4-t6',
                title: 'Pilotovereenkomst en prijzen bepalen',
                description: 'Vóór je een school benadert, moet je weten wat je aanbiedt en voor welke prijs. De pilotovereenkomst is een kort contract (1-2 pagina\'s) dat de school tekent. De prijzen moeten aansluiten bij schoolbudgetten — typisch betaalt een school per leerling per jaar, of een vast bedrag per school.',
                youDo: 'Beantwoord twee vragen voor Claude: (1) Hoeveel leerlingen verwacht je bij een pilotschool? (2) Wat zou jij als ICT-coördinator "normaal" vinden om te betalen voor een tool als dit per leerling per jaar?',
                claudeDoes: 'Een pilotovereenkomst opstellen en drie prijsopties uitwerken met voor- en nadelen per optie.',
                time: '2u',
                priority: 'p4',
            },
        ],
    },
    {
        id: 's5',
        number: 5,
        title: 'Go-to-Market',
        subtitle: 'Eerste klant(en) binnenhalen',
        dateRange: '26 apr – 9 mei',
        startDate: '2026-04-26',
        endDate: '2026-05-09',
        hours: '~8 uur',
        focusPriority: 'p5',
        tasks: [
            {
                id: 's5-t1',
                title: 'Eén-pager maken voor ICT-coördinatoren',
                description: 'Een ICT-coördinator krijgt tientallen verkooppraatjes per jaar. Jij hebt maximaal één A4-tje om te overtuigen. Die eén-pager moet in één oogopslag duidelijk maken: wat is het probleem (scholen moeten digitale geletterdheid aanbieden), wat is de oplossing (DGSkills), en wat kost het. Kort, visueel, overtuigend.',
                youDo: 'Vertel Claude de drie redenen waarom jij als docent zou willen dat jouw school DGSkills gebruikt. Dat wordt de kern van de pitch. Daarna beoordeel je de conceptversie.',
                claudeDoes: 'Een professionele eén-pager ontwerpen in PDF-formaat, inclusief statistieken, quotes en een duidelijke call-to-action.',
                time: '3u',
                priority: 'p5',
            },
            {
                id: 's5-t2',
                title: 'Je eigen school als eerste pilot voorstellen',
                description: 'Je beste referentie is je eigen school. Als jij als docent zegt "Ik gebruik dit in mijn klas en het werkt", is dat geloofwaardiger dan elke advertentie. Bereid een kort gesprek voor met je schoolleiding of ICT-coördinator: wat wil je aanbieden, hoe lang duurt de pilot, en wat kost het (gratis of gereduceerd voor de eerste pilot)?',
                youDo: 'Plan een gesprek (15 minuten) met je schoolleiding of ICT-coördinator. Vraag Claude vooraf om een script: wat zeg je als ze vragen "maar wat als de AI iets fouts zegt?" of "voldoet dit aan de AVG?"',
                claudeDoes: 'Een gespreksscript en FAQ voorbereiden met antwoorden op de meest gestelde bezwaren van scholen (privacy, kosten, tijdsinvestering).',
                time: '1u',
                priority: 'p5',
            },
            {
                id: 's5-t3',
                title: '3 tot 5 scholen in je netwerk benaderen',
                description: 'Je kent waarschijnlijk collega-docenten of ICT-coördinatoren op andere scholen via nascholing, LinkedIn of vakverenigingen. Dat is je warme netwerk — die mensen vertrouwen jou. Een persoonlijk berichtje ("Ik heb iets gebouwd, zou je 10 minuten willen kijken?") werkt veel beter dan een koude e-mail.',
                youDo: 'Maak een lijst van 5-10 mensen die je kent en die met digitale geletterdheid bezig zijn. Deel die lijst met Claude. Claude schrijft een persoonlijk outreach-berichtje per type contact (collega, ICT-coördinator, schoolleider).',
                claudeDoes: 'Outreach-templates schrijven die persoonlijk klinken, geen verkooppitch zijn, en aansluiten bij de specifieke rol van de ontvanger.',
                time: '2u',
                priority: 'p5',
            },
            {
                id: 's5-t4',
                title: 'Compliance-pagina live zetten',
                description: 'Scholen die overwegen een tool aan te schaffen, vragen altijd: "Voldoet dit aan de AVG?" en "Waar staan jullie privacyverklaring en verwerkersovereenkomst?" Die documenten zijn al gemaakt — ze moeten alleen nog vindbaar zijn op de website. Een compliance-hub pagina geeft scholen het vertrouwen dat je dit serieus neemt.',
                youDo: 'Niets — Claude plaatst alle bestaande documenten op de juiste pagina. Je hoeft alleen even te controleren of de links werken.',
                claudeDoes: 'Alle juridische documenten (privacyverklaring, DPA, DPIA-samenvatting, AI-transparantieverklaring) koppelen aan de compliance-hub pagina.',
                time: '1u',
                priority: 'p4',
            },
            {
                id: 's5-t5',
                title: 'Aanmelden bij Kennisgroep ICT van Kennisnet',
                description: 'Kennisnet is de organisatie die scholen adviseert over ICT-tools. Ze hebben een Kennisgroep ICT met de ICT-coördinatoren van honderden scholen. Als jij lid wordt en daar actief bent, kun je DGSkills introduceren aan precies de mensen die besluiten welke tools een school aanschaft — zonder koude acquisitie.',
                youDo: 'Ga naar de website van Kennisnet en meld je aan voor de Kennisgroep ICT. Claude geeft je de exacte link en instructies. Kosten: gratis.',
                claudeDoes: 'De aanmeldprocedure uitzoeken, een korte introductieboodschap schrijven die je kunt gebruiken bij aanmelding.',
                time: '1u',
                priority: 'p5',
            },
        ],
    },
    {
        id: 's6',
        number: 6,
        title: 'Pilot Draaien',
        subtitle: 'Uitvoeren, feedback verzamelen, verbeteren',
        dateRange: 'mei – juni',
        startDate: '2026-05-10',
        endDate: '2026-06-30',
        hours: '~6–8 uur/week',
        focusPriority: 'p6',
        tasks: [
            {
                id: 's6-t1',
                title: 'Onboarding bouwen: hoe leert een nieuwe docent het platform kennen?',
                description: 'Als een school "ja" zegt, moet je ze kunnen onboarden zonder dat jij er fysiek bij hoeft te zijn. Dat betekent: een korte instructievideo of klikbare rondleiding die een nieuwe docent in 10 minuten wegwijs maakt. Zonder goede onboarding haken docenten af bij de eerste drempel.',
                youDo: 'Denk na over de drie dingen die een nieuwe docent als eerste moet weten. Niet meer. Niet minder. Deel die met Claude — hij bouwt de interactieve rondleiding in de app.',
                claudeDoes: 'Een interactieve onboarding-flow bouwen in het docentendashboard: stap-voor-stap tooltips die een nieuwe docent begeleiden bij de eerste keer gebruiken.',
                time: '4u',
                priority: 'p6',
            },
            {
                id: 's6-t2',
                title: 'Wekelijks feedback vragen aan docenten en leerlingen',
                description: 'Feedback is goud tijdens een pilot. Wat werkt? Wat werkt niet? Welke missie vinden leerlingen saai? Welke functie mist de docent? Een korte survey (5 vragen, max 2 minuten) die je wekelijks verstuurt geeft je de data om het product snel te verbeteren.',
                youDo: 'Eén keer per week: stuur de survey via e-mail of Teams naar de pilotdocent(en). Lees de antwoorden en stuur de top-3 verbeterpunten naar Claude.',
                claudeDoes: 'Een korte, professionele survey opstellen in Google Forms (voor docenten én leerlingen), en de resultaten samenvatten tot actiepunten.',
                time: '1u/week',
                priority: 'p6',
            },
            {
                id: 's6-t3',
                title: 'De 3 grootste feedbackpunten per week verwerken',
                description: 'Feedback zonder actie is zinloos. Elke week kies je de drie meest genoemde verbeterpunten en lossen we die op. Kleine dingen (een tekst die onduidelijk is, een knop op de verkeerde plek) kunnen snel. Grote dingen plannen we voor de volgende sprint.',
                youDo: 'Kies elke week welke drie dingen prioriteit hebben. Niet meer — ADHD-proof. Zeg tegen Claude: "Fix dit, dit en dit." Claude doet de code, jij test het.',
                claudeDoes: 'De gemelde problemen analyseren, prioriteren op impact vs. moeilijkheid, en de geselecteerde fixes uitvoeren in de code.',
                time: '3u/week',
                priority: 'p6',
            },
            {
                id: 's6-t4',
                title: "Bijhouden hoe goed het gaat (gebruik, tevredenheid, terugkeer)",
                description: 'Om school #2 te overtuigen, heb je concrete cijfers nodig: hoeveel leerlingen hebben de app gebruikt, hoeveel missies zijn voltooid, en wat vonden docenten ervan (NPS-score)? Die data heb je ook nodig voor je eigen businessplan en voor subsidieaanvragen.',
                youDo: 'Eén keer per week: bekijk het analytics-overzicht in je developer dashboard. Noteer de drie getallen die je het meest relevant vindt. Die worden je verkoopargumenten.',
                claudeDoes: 'Een KPI-dashboard inrichten in het developer-portaal dat automatisch de belangrijkste cijfers bijhoudt: actieve gebruikers, missies voltooid, gemiddelde sessieduur, NPS.',
                time: '1u/week',
                priority: 'p6',
            },
        ],
    },
];

const STORAGE_KEY = 'dgskills-sprint-plan-v1';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getSprintStatus(sprint: Sprint): 'done' | 'active' | 'upcoming' | 'pause' {
    if (sprint.isPause) return 'pause';
    const now = new Date();
    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    end.setHours(23, 59, 59);
    if (now > end) return 'done';
    if (now >= start && now <= end) return 'active';
    return 'upcoming';
}

function daysUntil(dateStr: string): number {
    const target = new Date(dateStr);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntilDeadline(): number {
    return daysUntil('2026-05-09');
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeveloperSprintPlan() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [expandedTask, setExpandedTask] = useState<string | null>(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setChecked(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    const toggleTask = (taskId: string) => {
        setChecked(prev => {
            const next = { ...prev, [taskId]: !prev[taskId] };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
            return next;
        });
    };

    const toggleCollapse = (sprintId: string) => {
        setCollapsed(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
    };

    const toggleExpandTask = (taskId: string) => {
        setExpandedTask(prev => prev === taskId ? null : taskId);
    };

    const totalTasks = SPRINTS.flatMap(s => s.tasks).length;
    const doneTasks = SPRINTS.flatMap(s => s.tasks).filter(t => checked[t.id]).length;
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const deadlineDays = daysUntilDeadline();

    return (
        <div className="space-y-8 max-w-4xl">

            {/* ── Top stats ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voortgang</p>
                    <p className="text-3xl font-black text-slate-900">{pct}%</p>
                    <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Taken</p>
                    <p className="text-3xl font-black text-slate-900">{doneTasks}<span className="text-lg text-slate-400">/{totalTasks}</span></p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">afgevinkt</p>
                </div>
                <div className={`p-5 rounded-2xl border shadow-sm ${deadlineDays <= 14 ? 'bg-red-50 border-red-100' : deadlineDays <= 30 ? 'bg-amber-50 border-amber-100' : 'bg-white border-slate-200'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
                    <p className={`text-3xl font-black ${deadlineDays <= 14 ? 'text-red-600' : deadlineDays <= 30 ? 'text-amber-600' : 'text-slate-900'}`}>{deadlineDays}d</p>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">tot 9 mei 2026</p>
                </div>
                <div className="bg-indigo-600 p-5 rounded-2xl shadow-sm shadow-indigo-200">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Harde deadline</p>
                    <p className="text-lg font-black text-white leading-tight">Inkoopvenster scholen</p>
                    <p className="text-[10px] text-indigo-300 mt-2 font-medium">Feb–mei 2026</p>
                </div>
            </div>

            {/* ── Legenda ────────────────────────────────────────────────── */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-3 items-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest shrink-0">Klik op een taak</span>
                <span className="text-[11px] text-slate-500">→ je ziet wat je zelf moet doen en wat Claude doet</span>
            </div>

            {/* ── Sprints ────────────────────────────────────────────────── */}
            <div className="space-y-4">
                {SPRINTS.map((sprint) => {
                    const status = getSprintStatus(sprint);
                    const isCollapsed = collapsed[sprint.id];
                    const sprintDone = sprint.tasks.filter(t => checked[t.id]).length;
                    const sprintTotal = sprint.tasks.length;
                    const sprintPct = sprintTotal > 0 ? Math.round((sprintDone / sprintTotal) * 100) : 0;

                    if (sprint.isPause) {
                        return (
                            <div key={sprint.id} className="flex items-center gap-4 px-6 py-4 bg-amber-50 border border-amber-100 rounded-2xl">
                                <Palmtree size={20} className="text-amber-500 shrink-0" />
                                <div>
                                    <p className="font-black text-amber-800 text-sm uppercase tracking-tight">Schoolreis — {sprint.dateRange}</p>
                                    <p className="text-[11px] text-amber-600">{sprint.subtitle}</p>
                                </div>
                            </div>
                        );
                    }

                    const statusConfig = {
                        active: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Actief nu' },
                        done:   { badge: 'bg-slate-50 text-slate-400 border-slate-100', label: 'Gereed' },
                        upcoming: { badge: 'bg-slate-50 text-slate-400 border-slate-100', label: 'Gepland' },
                        pause:  { badge: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Pauze' },
                    }[status];

                    return (
                        <div key={sprint.id} className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${status === 'active' ? 'border-indigo-300 shadow-md shadow-indigo-100' : 'border-slate-200'}`}>
                            {/* Sprint header */}
                            <button
                                onClick={() => toggleCollapse(sprint.id)}
                                className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                            >
                                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${status === 'active' ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300' : status === 'done' ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                    {sprintPct === 100 ? <CheckCircle2 size={16} /> : sprint.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className={`font-black text-base truncate ${status === 'done' ? 'text-slate-400' : 'text-slate-900'}`}>
                                            Sprint {sprint.number} — {sprint.title}
                                        </h3>
                                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusConfig.badge}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">{sprint.subtitle}</p>
                                </div>
                                <div className="shrink-0 flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end gap-1">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                                            <CalendarDays size={12} />{sprint.dateRange}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                            <Clock size={12} />{sprint.hours}
                                        </span>
                                    </div>
                                    <span className="text-xs font-black text-slate-500">{sprintDone}/{sprintTotal}</span>
                                    {isCollapsed ? <ChevronRight size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                                </div>
                            </button>

                            {/* Sprint tasks */}
                            {!isCollapsed && (
                                <div className="border-t border-slate-100">
                                    {sprintTotal > 0 && (
                                        <div className="px-6 pt-4 pb-2">
                                            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${sprintPct}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    <ul className="divide-y divide-slate-50">
                                        {sprint.tasks.map((task) => {
                                            const isDone = !!checked[task.id];
                                            const isExpanded = expandedTask === task.id;

                                            return (
                                                <li key={task.id} className={`transition-colors ${isDone ? 'bg-slate-50/50' : ''}`}>
                                                    {/* Task row */}
                                                    <div className="flex gap-4 px-6 py-4">
                                                        <button
                                                            onClick={() => toggleTask(task.id)}
                                                            className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                                                            aria-label={isDone ? 'Markeer als niet gedaan' : 'Markeer als gedaan'}
                                                        >
                                                            {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                                        </button>

                                                        <div className="flex-1 min-w-0">
                                                            <button
                                                                onClick={() => toggleExpandTask(task.id)}
                                                                className="w-full text-left group"
                                                            >
                                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                    <p className={`font-bold text-sm group-hover:text-indigo-600 transition-colors ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                                                        {task.title}
                                                                    </p>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[task.priority]}`}>
                                                                        {PRIORITY_LABELS[task.priority]}
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-4">
                                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                                        <Clock size={12} />{task.time}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium group-hover:text-indigo-500 transition-colors">
                                                                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                                                        {isExpanded ? 'Minder info' : 'Wat moet ik doen?'}
                                                                    </span>
                                                                </div>
                                                            </button>

                                                            {/* Expanded detail */}
                                                            {isExpanded && (
                                                                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                                    {/* Uitleg */}
                                                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Wat is dit?</p>
                                                                        <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
                                                                    </div>

                                                                    {/* Jij doet */}
                                                                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                            <User size={12} />
                                                                            Jij doet
                                                                        </p>
                                                                        <p className="text-sm text-indigo-900 leading-relaxed">{task.youDo}</p>
                                                                    </div>

                                                                    {/* Claude doet */}
                                                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                                            <Zap size={12} />
                                                                            Claude doet
                                                                        </p>
                                                                        <p className="text-sm text-emerald-900 leading-relaxed">{task.claudeDoes}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── AI Act deadline ────────────────────────────────────────── */}
            <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-black text-red-800 text-sm uppercase tracking-tight">EU AI Act — 2 augustus 2026</p>
                    <p className="text-[11px] text-red-600 mt-0.5">
                        Hoog-risico verplichtingen worden dan afdwingbaar. Dit pakken we na de pilot op — staat in de achtergrondtaken.
                    </p>
                </div>
                <div className="shrink-0 ml-auto text-right">
                    <p className="text-2xl font-black text-red-600">{daysUntil('2026-08-02')}d</p>
                    <p className="text-[10px] text-red-400 font-bold uppercase">resterend</p>
                </div>
            </div>

            {/* ── Prioriteiten ───────────────────────────────────────────── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Target size={16} className="text-indigo-500" />
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Waarom deze volgorde?</h3>
                </div>
                <div className="space-y-2">
                    {[
                        { key: 'p1', why: 'Dit IS het product. Zonder goede opdrachten is de rest zinloos.' },
                        { key: 'p2', why: 'Eerste indruk telt. Alles moet professioneel aanvoelen.' },
                        { key: 'p3', why: 'Bugs bij leerlingen = vertrouwen kwijt bij docenten.' },
                        { key: 'p4', why: 'Geregeld zijn zodat je eind 2026 geen belastingstress hebt.' },
                        { key: 'p5', why: 'De etalage — overtuigt ICT-coördinatoren en docenten.' },
                        { key: 'p6', why: 'Docenten moeten het in 5 minuten snappen.' },
                    ].map(({ key, why }) => (
                        <div key={key} className="flex items-start gap-3">
                            <span className={`mt-0.5 shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[key]}`}>
                                {PRIORITY_LABELS[key]}
                            </span>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{why}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
