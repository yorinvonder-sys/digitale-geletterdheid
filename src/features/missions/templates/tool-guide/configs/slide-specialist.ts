import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'slide-specialist',
    title: 'Slide Specialist',
    introEmoji: '🎨',
    introTitle: 'Slide Specialist',
    introDescription:
        'Leer presenteren met PowerPoint op je iPad. Je maakt drie rustige slides met een strak thema, korte tekst, een veilige bronafbeelding en een passende animatie of overgang. Je bewaart het deck in school-OneDrive.',
    introFeatures: [
        'Een professioneel thema kiezen in PowerPoint',
        'Drie slides opbouwen met weinig tekst en een veilig beeld',
        'Een animatie en rustige overgang kiezen en testen',
        'Opslaan in school-OneDrive met veilig bestandsbewijs',
    ],
    toolName: 'Microsoft PowerPoint',
    toolIcon: '🖥️',
    steps: [
        {
            id: 'stap-1-thema',
            title: 'Thema kiezen',
            instruction:
                'Open **PowerPoint** op je iPad en tik op **Nieuw**. Ga naar **Ontwerp** en kies een thema. Kies een **Kleurvariant** als die optie zichtbaar is; anders noteer je dat eerlijk. Sla meteen op in school-OneDrive met de neutrale naam `klas_onderwerp_presentatie.pptx` (geen naam of e-mail). Menu\'s kunnen verschillen per versie, account of schermstand; vraag je docent als Microsoft 365 nodig lijkt.',
            tip: 'Een thema houdt kleuren en lettertypen rustig. OneDrive bewaart wijzigingen automatisch wanneer je het bestand daar opent of opslaat. Zie je geen school-OneDrive of vraagt PowerPoint om een abonnement? Stop en vraag je docent; verzin geen account.',
            checklistItems: [
                { id: 'presentatie-nieuw', label: 'Ik heb een nieuwe lege presentatie aangemaakt' },
                { id: 'thema-gekozen', label: 'Ik heb een thema gekozen via het tabblad Ontwerp' },
                { id: 'kleur-gekozen', label: 'Ik heb een kleurvariant gekozen of eerlijk genoteerd dat de optie ontbreekt' },
                { id: 'onedrive-opgeslagen', label: 'Mijn deck staat in school-OneDrive met een neutrale bestandsnaam' },
            ],
            teacherCheck:
                'Laat je docent het lege deck, het gekozen thema, de kleurvariant (of je eerlijke notitie dat die optie ontbreekt) en de neutrale bestandsnaam in school-OneDrive zien; toon geen account- of e-mailgegevens.',
            verificationQuestion: {
                question: 'Waarom is het slim om een bestaand thema te kiezen in plaats van alles zelf op te maken?',
                options: [
                    'Omdat je dan geen afbeeldingen kunt invoegen',
                    'Omdat een thema zorgt voor een consistente, professionele opmaak door de hele presentatie',
                    'Omdat het tabblad Ontwerp anders verdwijnt',
                    'Omdat je anders te veel slides kunt maken',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan wat een thema voor kleuren en lettertypen door de hele presentatie doet. Kies daarna opnieuw.',
                explanation:
                    'Precies! Een thema zorgt dat kleuren, lettertypen en achtergronden op alle slides consistent zijn. Dat ziet er professioneel uit en bespaart je veel tijd.',
            },
        },
        {
            id: 'stap-2-inhoud',
            title: 'Inhoud op de slide',
            instruction:
                'Maak een tweede én derde slide via **+** (of **Dia dupliceren/Nieuwe dia**). Geef beide een korte titel en maximaal **3 tot 5 korte punten**. Voeg één privacyveilige, herbruikbare afbeelding toe. Gebruik geen personen, namen, schoollogo\'s of privé-screenshots. Noteer maker/bron en URL in de speaker notes, of in een plek die je docent aanwijst.',
            tip: 'Gebruik eigen werk, Microsoft Stock of een aantoonbaar herbruikbare afbeelding. Eén gedachte per slide is genoeg. Zie je geen speaker notes? Stop niet: vraag je docent waar je de bron veilig noteert.',
            checklistItems: [
                { id: 'tweede-slide', label: 'Ik heb een tweede slide aangemaakt' },
                { id: 'derde-slide', label: 'Ik heb een derde slide aangemaakt' },
                { id: 'tweede-korte-punten', label: 'Mijn tweede slide heeft maximaal 5 korte punten' },
                { id: 'derde-korte-punten', label: 'Mijn derde slide heeft maximaal 5 korte punten' },
                { id: 'afbeelding-slide', label: 'Ik heb een afbeelding ingevoegd op de slide' },
                { id: 'bron-genoteerd', label: 'Ik heb gecontroleerd dat ik de afbeelding mag gebruiken en de bron genoteerd' },
            ],
            teacherCheck:
                'Laat je docent alle drie slides, beide tekstcontroles, de privacyveilige afbeelding en de bronnotitie (of de aangewezen veilige plek) zien; laat geen privéfoto of persoonlijke screenshot zien.',
            verificationQuestion: {
                question: 'Hoeveel tekst mag er maximaal op één slide staan voor een goede presentatie?',
                options: [
                    'Zo veel mogelijk — de kijker kan dan alles nalezen',
                    'Drie tot vijf korte punten, geen volledige zinnen',
                    'Minstens twee alinea\'s, anders snap je het niet',
                    'Eén heel lange zin die alles uitlegt',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan een slide als geheugensteun voor je verhaal: kies enkele kernwoorden in plaats van een script. Kies daarna opnieuw.',
                explanation:
                    'Goed! Minder tekst is meer. Het publiek luistert naar jou — de slide is een geheugensteuntje, geen script. Gebruik korte punten zodat iedereen kan volgen.',
            },
        },
        {
            id: 'stap-3-animatie',
            title: 'Animatie toevoegen',
            instruction:
                'Selecteer een titel of afbeelding en ga naar **Animaties**. Kies een beschikbare animatie, zoals **Verschijnen** of **Invliegen**, en tik op **Afspelen** of start de **Diavoorstelling**. iPad toont niet alle desktop-effecten; timing en startopties horen alleen bij desktop of een docentdemonstratie. Noteer een ontbrekende knop en vraag je docent.',
            tip: 'Gebruik maximaal één of twee rustige animaties per slide. Op iPad is een afgespeeld effect met zichtbaar bewijs voldoende; forceer geen desktopoptie die jouw versie niet toont.',
            checklistItems: [
                { id: 'element-geselecteerd', label: 'Ik heb een element op een slide geselecteerd' },
                { id: 'animatie-toegevoegd', label: 'Ik heb een animatie toegevoegd aan dat element' },
                { id: 'animatie-getest', label: 'Ik heb de animatie afgespeeld en gecontroleerd' },
            ],
            teacherCheck:
                'Laat je docent het geanimeerde element en de afgespeelde animatie zien. Als timing alleen op desktop beschikbaar is, toon de docentdemonstratie of noteer dat eerlijk.',
        },
        {
            id: 'stap-4-overgang',
            title: 'Overgangen instellen',
            instruction:
                'Selecteer een slide en ga naar **Overgangen**. Kies één rustige overgang, bijvoorbeeld **Vervaag**, en test via **Diavoorstelling > Vanaf begin**. Duur en automatische timing stel je alleen in op desktop of tijdens een docentdemonstratie; dat is geen verplichte iPad-actie. Kies **Toepassen op alle** als die optie zichtbaar is en controleer school-OneDrive.',
            tip: 'Microsoft PowerPoint voor mobiel kan slide-timings niet instellen. Bewijs op iPad daarom je overgangskeuze en afspelen; vraag je docent om de desktopstap als timing nodig is.',
            checklistItems: [
                { id: 'overgang-gekozen', label: 'Ik heb een overgang gekozen voor een slide' },
                { id: 'overgang-consistent', label: 'Ik heb hetzelfde overgangstype op alle slides gebruikt' },
                { id: 'diavoorstelling', label: 'Ik heb de presentatie als diavoorstelling afgespeeld' },
            ],
            teacherCheck:
                'Laat je docent de overgangskeuze en de diavoorstelling zien. Noteer apart wanneer duur of automatische timing alleen op desktop beschikbaar is; toon geen accountgegevens.',
            verificationQuestion: {
                question: 'Waarom gebruik je bij voorkeur hetzelfde type overgang voor alle slides?',
                options: [
                    'Omdat PowerPoint anders crasht',
                    'Zodat de presentatie er rustig en professioneel uitziet, zonder afleidende variatie',
                    'Omdat je anders geen animaties kunt gebruiken',
                    'Omdat de docent dat altijd verplicht stelt',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan rust en herkenning: één overgangsstijl leidt minder af dan telkens iets anders. Kies daarna opnieuw.',
                explanation:
                    'Juist! Consistentie maakt je presentatie professioneel. Als elke slide een andere overgang heeft, trekt dat de aandacht weg van de inhoud. Kies één stijl en houd die vast.',
            },
        },
    ],
    maxScore: 55,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Presentatie Expert',
            color: '#ff3c21',
        },
        {
            minScore: 40,
            emoji: '🎨',
            title: 'Slide Specialist',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#202023',
        },
    ],
    learningObjectives: [
        'De leerling kiest een passend thema, slaat het deck veilig op in school-OneDrive en legt uit waarom consistente opmaak professioneel oogt.',
        'De leerling bouwt drie slides op met maximaal vijf korte punten per inhoudsslide, één privacyveilige afbeelding en een bronnotitie.',
        'De leerling voegt één beschikbare animatie toe, test die en benoemt wanneer timing alleen op desktop kan.',
        'De leerling kiest één overgangstype, test de diavoorstelling en legt uit waarom consistente stijl helpt.',
    ],
    takeaways: [
        'Je kunt een professioneel thema kiezen en je deck veilig in school-OneDrive opslaan',
        'Je bouwt slides met weinig tekst, een privacyveilige afbeelding en een bronnotitie',
        'Je kunt een beschikbare animatie toevoegen en eerlijk aangeven wanneer timing desktopwerk is',
        'Je kunt één overgangstype kiezen, testen en consistent toepassen',
        'Je begrijpt waarom minder tekst en een rustige stijl je presentatie sterker maken',
    ],
};

export default config;
