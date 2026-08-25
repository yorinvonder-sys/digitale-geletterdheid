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
                question: 'Je tikte in het tabblad Ontwerp op een thema. Wat gebeurde er op dat moment met je lege slide?',
                options: [
                    'De slide bleef wit; het thema werkt pas vanaf de tweede slide',
                    'De slide kreeg meteen de achtergrond, kleuren en lettertypen van dat thema',
                    'PowerPoint maakte er automatisch drie extra slides bij',
                    'Er verscheen eerst een venster waarin je een bestandsnaam moest typen',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk terug naar je slide op het moment dat je het thema aantikte. Kies daarna opnieuw.',
                explanation:
                    'Precies! Zodra je een thema aantikt, verandert je slide direct van achtergrond, kleuren en lettertypen. Daarom ziet je hele deck er meteen consistent uit.',
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
                question: 'Je hebt je afbeelding net op de slide gezet. Wat zag je toen de afbeelding verscheen?',
                options: [
                    'De afbeelding stond op de slide met blokjes (handvatten) langs de randen om hem groter of kleiner te slepen',
                    'De afbeelding werd meteen als achtergrond op alle drie de slides gezet',
                    'PowerPoint vroeg eerst om de bron-URL voordat de afbeelding zichtbaar werd',
                    'De tekstvakken op die slide verdwenen zodra de afbeelding erin stond',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk aan wat er precies rond je afbeelding stond toen die net was ingevoegd. Kies daarna opnieuw.',
                explanation:
                    'Goed gezien! Een net ingevoegde afbeelding staat geselecteerd op je slide, met handvatten langs de randen. Daarmee zet je hem op de goede plek en maat, zonder dat je tekst verdwijnt.',
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
            verificationQuestion: {
                question: 'Je tikte op Afspelen (of startte de diavoorstelling) om je animatie te testen. Wat gebeurde er met het element dat je had geselecteerd?',
                options: [
                    'Het element kwam pas in beeld of bewoog op het moment dat de animatie afging',
                    'Alle slides werden automatisch achter elkaar doorgeklikt',
                    'Het thema van de presentatie veranderde tijdelijk van kleur',
                    'De animatie werd na één keer afspelen meteen weer verwijderd',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk terug aan wat je op je scherm zag gebeuren met dat ene element. Kies daarna opnieuw.',
                explanation:
                    'Klopt! Een animatie werkt op één element: dat verschijnt of beweegt op het moment dat de animatie afgaat. Zo test je meteen of het effect rustig genoeg is.',
            },
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
                question: 'Je speelde je presentatie af via Diavoorstelling > Vanaf begin. Wat zag je bij de wissel van slide 1 naar slide 2?',
                options: [
                    'De slides wisselden met het effect dat je koos, bijvoorbeeld rustig vervagen in plaats van hard omslaan',
                    'De slides wisselden pas nadat je een wachtwoord had ingetypt',
                    'De tekst op beide slides verdween tijdens het wisselen',
                    'Slide 2 werd overgeslagen omdat er een overgang op stond',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Denk terug aan het moment waarop de ene slide overging in de volgende. Kies daarna opnieuw.',
                explanation:
                    'Juist! In de diavoorstelling zie je je overgang echt werken: de ene slide gaat rustig over in de volgende. Gebruik overal hetzelfde effect, dan blijft de aandacht bij je verhaal.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 60,
            emoji: '🏆',
            title: 'Presentatie Expert',
            color: '#ff3c21',
        },
        {
            minScore: 45,
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
