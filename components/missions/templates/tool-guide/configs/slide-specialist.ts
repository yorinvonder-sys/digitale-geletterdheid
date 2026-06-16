import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'slide-specialist',
    title: 'Slide Specialist',
    introEmoji: '🎨',
    introTitle: 'Slide Specialist',
    introDescription:
        'Leer presenteren met PowerPoint op je iPad. Je maakt een professionele presentatie met een strak thema, korte tekst, afbeeldingen en animaties — zodat je publiek blijft kijken.',
    introFeatures: [
        'Een professioneel thema kiezen in PowerPoint',
        'Slides opbouwen met weinig tekst en sterke beelden',
        'Animaties toevoegen aan elementen op een slide',
        'Overgangen instellen tussen slides',
    ],
    toolName: 'Microsoft PowerPoint',
    toolIcon: '🖥️',
    steps: [
        {
            id: 'stap-1-thema',
            title: 'Thema kiezen',
            instruction:
                'Open de **PowerPoint**-app op je iPad en tik op **Nieuw** om een lege presentatie te starten. Ga naar het tabblad **Ontwerp** bovenaan. Je ziet een rij met thema\'s — klik er een aan om een voorbeeld te zien. Kies een thema dat past bij je onderwerp: zakelijk, kleurrijk of minimalistisch. Tik daarna op **Kleurvariant** om een kleurenschema te kiezen.',
            tip: 'Een goed thema geeft je presentatie een professionele uitstraling zonder dat je zelf alles hoeft op te maken. Kies een thema dat past bij het gevoel dat je wilt overbrengen: serieus, vrolijk of modern.',
            checklistItems: [
                { id: 'presentatie-nieuw', label: 'Ik heb een nieuwe lege presentatie aangemaakt' },
                { id: 'thema-gekozen', label: 'Ik heb een thema gekozen via het tabblad Ontwerp' },
                { id: 'kleur-gekozen', label: 'Ik heb een kleurenvariant geselecteerd' },
            ],
            verificationQuestion: {
                question: 'Waarom is het slim om een bestaand thema te kiezen in plaats van alles zelf op te maken?',
                options: [
                    'Omdat je dan geen afbeeldingen kunt invoegen',
                    'Omdat een thema zorgt voor een consistente, professionele opmaak door de hele presentatie',
                    'Omdat het tabblad Ontwerp anders verdwijnt',
                    'Omdat je anders te veel slides kunt maken',
                ],
                correctIndex: 1,
                explanation:
                    'Precies! Een thema zorgt dat kleuren, lettertypen en achtergronden op alle slides consistent zijn. Dat ziet er professioneel uit en bespaart je veel tijd.',
            },
        },
        {
            id: 'stap-2-inhoud',
            title: 'Inhoud op de slide',
            instruction:
                'Voeg een tweede slide toe via het **+-icoon** in het slides-paneel links (of tik lang op een slide en kies "Dia dupliceren" of "Nieuwe dia"). Typ een korte titel bovenaan. Zet in het tekstvak maximaal **3 tot 5 korte punten** — geen lange zinnen. Voeg daarna een afbeelding in via **Invoegen > Afbeeldingen**. Maak de afbeelding groot genoeg zodat die het verhaal ondersteunt.',
            tip: 'De gouden regel van presentaties: één gedachte per slide. Als je meer wilt zeggen, voeg dan een extra slide toe in plaats van meer tekst op één slide te zetten.',
            checklistItems: [
                { id: 'tweede-slide', label: 'Ik heb een tweede slide aangemaakt' },
                { id: 'korte-punten', label: 'Mijn slide heeft maximaal 5 korte punten' },
                { id: 'afbeelding-slide', label: 'Ik heb een afbeelding ingevoegd op de slide' },
            ],
            verificationQuestion: {
                question: 'Hoeveel tekst mag er maximaal op één slide staan voor een goede presentatie?',
                options: [
                    'Zo veel mogelijk — de kijker kan dan alles nalezen',
                    'Drie tot vijf korte punten, geen volledige zinnen',
                    'Minstens twee alinea\'s, anders snap je het niet',
                    'Eén heel lange zin die alles uitlegt',
                ],
                correctIndex: 1,
                explanation:
                    'Goed! Minder tekst is meer. Het publiek luistert naar jou — de slide is een geheugensteuntje, geen script. Gebruik korte punten zodat iedereen kan volgen.',
            },
        },
        {
            id: 'stap-3-animatie',
            title: 'Animatie toevoegen',
            instruction:
                'Selecteer een **element op een slide** (bijv. de titel of een afbeelding) door erop te tikken. Ga naar het tabblad **Animaties** bovenaan. Kies een animatie, bijvoorbeeld **Verschijnen**, **Invliegen** of **Uitzoomen**. Tik op **Animatievenster** of **Afspelen** om je animatie te testen. Pas de timing aan via de opties (bijv. "Bij klikken" of "Na vorig").',
            tip: 'Gebruik animaties spaarzaam — maximaal één of twee per slide. Te veel beweging leidt af. Kies animaties die passen bij de sfeer: rustig voor serieuze onderwerpen, dynamisch voor energie.',
            checklistItems: [
                { id: 'element-geselecteerd', label: 'Ik heb een element op een slide geselecteerd' },
                { id: 'animatie-toegevoegd', label: 'Ik heb een animatie toegevoegd aan dat element' },
                { id: 'animatie-getest', label: 'Ik heb de animatie afgespeeld en gecontroleerd' },
            ],
        },
        {
            id: 'stap-4-overgang',
            title: 'Overgangen instellen',
            instruction:
                'Tik in het slides-paneel op een **slide** waaraan je een overgang wilt toevoegen. Ga naar het tabblad **Overgangen** bovenaan. Kies een overgang, bijv. **Fade**, **Zetelen** of **Doelwit**. Stel de **duur** in (bijv. 0,5 seconden). Tik op **Toepassen op alle** als je alle slides dezelfde overgang wilt geven. Test je presentatie via **Diavoorstelling > Vanaf begin**.',
            tip: 'Gebruik één type overgang voor de hele presentatie. Verschillende overgangen op elke slide ziet er onprofessioneel en onrustig uit.',
            checklistItems: [
                { id: 'overgang-gekozen', label: 'Ik heb een overgang gekozen voor een slide' },
                { id: 'duur-ingesteld', label: 'Ik heb de duur van de overgang ingesteld' },
                { id: 'diavoorstelling', label: 'Ik heb de presentatie als diavoorstelling afgespeeld' },
            ],
            verificationQuestion: {
                question: 'Waarom gebruik je bij voorkeur hetzelfde type overgang voor alle slides?',
                options: [
                    'Omdat PowerPoint anders crasht',
                    'Zodat de presentatie er rustig en professioneel uitziet, zonder afleidende variatie',
                    'Omdat je anders geen animaties kunt gebruiken',
                    'Omdat de docent dat altijd verplicht stelt',
                ],
                correctIndex: 1,
                explanation:
                    'Juist! Consistentie maakt je presentatie professioneel. Als elke slide een andere overgang heeft, trekt dat de aandacht weg van de inhoud. Kies één stijl en houd die vast.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Presentatie Expert',
            color: '#EA580C',
        },
        {
            minScore: 40,
            emoji: '🎨',
            title: 'Slide Specialist',
            color: '#D97848',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#5F947D',
        },
    ],
    takeaways: [
        'Je kunt een professioneel thema kiezen en aanpassen in PowerPoint',
        'Je snapt hoe je slides opbouwt met weinig tekst en sterke beelden',
        'Je kunt animaties toevoegen aan elementen en de timing instellen',
        'Je weet hoe je overgangen instelt en ze consistent toepast',
        'Je begrijpt waarom minder tekst en consistente stijl je presentatie sterker maakt',
    ],
};

export default config;
