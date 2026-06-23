import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'mission-launch',
    title: 'De Lancering',
    introEmoji: '🚀',
    introTitle: 'De Lancering',
    introDescription:
        'Je project is af — nu moet de wereld het weten. Je leert een pakkende flyer maken met een sterke kop, heldere informatie en een duidelijke call to action. Plus: je bereidt je presentatie voor.',
    introFeatures: [
        'Een aandachttrekkende kop bedenken voor je flyer',
        'De kernboodschap kort en helder formuleren',
        'Een call to action schrijven die mensen activeert',
        'Je flyer visueel indelen volgens de regels van visuele hiërarchie',
    ],
    toolName: 'Flyer & Presentatie',
    toolIcon: '📢',
    steps: [
        {
            id: 'stap-1-kop',
            title: 'De pakkende kop',
            instruction:
                'Een flyer heeft maar **2 seconden** om iemand te stoppen. De kop is het allerbelangrijkste element. Bedenk **3 verschillende opties** voor een kop. Gebruik een van deze formules:\n- **Probleem + oplossing**: "Nooit meer huiswerkstress!"\n- **Nieuwsgierigheid**: "De app die je docent niet kent"\n- **Concreet voordeel**: "3× sneller leren met AI"\n\nKies daarna de beste van je drie opties. Slechte koppen zijn te vaag ("Mijn project") of te lang (meer dan 8 woorden).',
            tip: 'Test je kop: lees hem hardop in 2 seconden. Begrijpt iemand die hem niet kent meteen waar het over gaat? Zo ja — goede kop. Zo nee — maak hem korter of specifieker.',
            checklistItems: [
                { id: 'drie-opties', label: 'Ik heb 3 verschillende koppen bedacht' },
                { id: 'beste-gekozen', label: 'Ik heb de beste kop gekozen' },
                { id: 'kop-kort', label: 'Mijn kop is kort (maximaal 8 woorden) en concreet' },
            ],
            verificationQuestion: {
                question: 'Welke kop is het sterkst voor een flyer?',
                options: [
                    'Mijn informatica-project over kunstmatige intelligentie voor de eindpresentatie',
                    'Een app voor school',
                    'Nooit meer huiswerkstress!',
                    'Project van klas 1A',
                ],
                correctIndex: 2,
                explanation:
                    'Precies! "Nooit meer huiswerkstress!" combineert een herkenbaar probleem met een belofte van een oplossing. Het is kort, concreet en spreekt direct de lezer aan.',
            },
        },
        {
            id: 'stap-2-kernboodschap',
            title: 'De kernboodschap',
            instruction:
                'Na de kop volgen maximaal **3 tot 5 zinnen** met de kern van je boodschap. Beantwoord deze drie vragen:\n1. **WAT** is het? (1 zin)\n2. **VOOR WIE** is het? (1 zin)\n3. **WANNEER en WAAR** kun je het zien? (1 zin)\n\nSchrap alles wat je kunt weglaten zonder dat de lezer iets mist. Een goede flyer begrijp je in **5 seconden**. Test het: laat iemand 5 seconden kijken en vraag wat ze onthouden.',
            tip: 'Minder is meer. Als je meer dan 5 zinnen nodig hebt, is je boodschap niet duidelijk genoeg. Schrijf eerst alles op wat je wilt zeggen, en schrap dan de helft.',
            checklistItems: [
                { id: 'wat-zin', label: 'Ik heb in één zin beschreven wat mijn project is' },
                { id: 'voor-wie', label: 'Ik heb beschreven voor wie het is' },
                { id: 'wanneer-waar', label: 'Ik heb de datum, tijd of locatie toegevoegd' },
            ],
            verificationQuestion: {
                question: 'Hoeveel tekst mag er maximaal op een goede flyer staan?',
                options: [
                    'Zo veel mogelijk — dan weet de lezer alles',
                    'Maximaal 3 tot 5 korte zinnen, zodat je de flyer in 5 seconden begrijpt',
                    'Minstens een hele alinea uitleg',
                    'Alleen de naam van het project',
                ],
                correctIndex: 1,
                explanation:
                    'Goed! Een flyer is geen verslag. Gebruik maximaal 3 tot 5 korte zinnen. Alles wat je kunt weglaten zonder dat de lezer iets mist, hoort niet op de flyer.',
            },
        },
        {
            id: 'stap-3-cta',
            title: 'Call to action',
            instruction:
                'Een call to action (CTA) vertelt mensen **wat ze moeten doen**. Niet alleen informeren, maar activeren. Voorbeelden van sterke CTA\'s:\n- "Kom vrijdag naar de aula!" (concreet, met datum)\n- "Scan de QR-code en probeer het zelf!" (interactief)\n- "Vraag me er morgen naar!" (laagdrempelig)\n\nSlechte CTA\'s: "Meer info volgt later" (vaag) of "Misschien leuk?" (twijfelachtig). Zet de CTA op de flyer als het **grootste en duidelijkste element** onderaan.',
            tip: 'Stel je voor dat een vriend je flyer leest. Zou die weten wat ze moeten doen? En zouden ze het ook daadwerkelijk doen? Dat is de maatstaf voor een goede CTA.',
            checklistItems: [
                { id: 'cta-bedacht', label: 'Ik heb een duidelijke call to action bedacht' },
                { id: 'cta-concreet', label: 'Mijn CTA is concreet — de lezer weet precies wat te doen' },
                { id: 'cta-positie', label: 'De CTA staat onderaan op de flyer als het meest opvallende element' },
            ],
            verificationQuestion: {
                question: 'Je wilt een foto van een klasgenoot op je flyer zetten. De foto staat al openbaar op Instagram. Wat moet je doen?',
                options: [
                    'Niets — de foto is al openbaar',
                    'Eerst toestemming vragen aan de persoon op de foto',
                    'De foto wazig maken zodat niemand het herkent',
                    'De flyer alleen digitaal verspreiden, niet op papier',
                ],
                correctIndex: 1,
                explanation:
                    'Openbaar betekent niet vrij te gebruiken — dit leerde je in Periode 3. Vraag altijd toestemming voordat je iemands foto gebruikt.',
            },
        },
        {
            id: 'stap-4-ontwerp',
            title: 'Flyer indelen',
            instruction:
                'Maak de flyer in **Word, PowerPoint of Canva** (of op papier). Gebruik visuele hiërarchie: groot = belangrijk. De kop staat bovenaan en is het grootst. Daarna korte tekst en een afbeelding. Onderaan de call to action in een opvallende kleur. Gebruik maximaal 2 lettertypen en laat genoeg witruimte. Vink de checklist af als je klaar bent.',
            tip: 'Test je flyer: dek de helft af met je hand. Mis je iets belangrijks? Als het antwoord nee is, dan kan die helft weg. Eenvoud wint altijd.',
            checklistItems: [
                { id: 'hiearchie', label: 'Mijn kop staat bovenaan en is het grootst' },
                { id: 'witruimte', label: 'Er is voldoende witruimte — de flyer is niet vol gepropt' },
                { id: 'twee-lettertypes', label: 'Ik gebruik maximaal 2 verschillende lettertypen' },
                { id: 'cta-onderaan', label: 'De call to action staat onderaan en valt direct op' },
            ],
            teacherCheck:
                'Laat je echte flyer aan je docent zien. De docent controleert: de flyer is leesbaar, de kop is het grootst, de call to action valt op, en er staan geen foto\'s of namen van anderen op zonder toestemming.',
            verificationQuestion: {
                question: 'Wat is de "gouden regel" van visuele hiërarchie op een flyer?',
                options: [
                    'Zet zo veel mogelijk informatie op de flyer zodat niemand iets mist',
                    'Gebruik zo veel mogelijk kleuren om de aandacht te trekken',
                    'Groot = belangrijk: het meest cruciale element is ook het grootste',
                    'Gebruik altijd minstens drie lettertypen voor variatie',
                ],
                correctIndex: 2,
                explanation:
                    'Juist! Grootte = importantie. De lezer scant een flyer in seconden. Door het belangrijkste element het grootst te maken, gaat de blik vanzelf naar de kernboodschap.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Marketing Expert',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🚀',
            title: 'Launcher',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '🌱',
            title: 'Aan de slag',
            color: '#202023',
        },
    ],
    takeaways: [
        'Je kunt een pakkende kop bedenken die in 2 seconden de aandacht grijpt',
        'Je weet hoe je de kernboodschap van een flyer kort en helder formuleert',
        'Je snapt wat een call to action is en hoe je mensen activeert',
        'Je kunt een flyer visueel indelen met de juiste hiërarchie',
        'Je begrijpt waarom minder tekst en witruimte een flyer sterker maakt',
        'Je weet dat je toestemming nodig hebt voordat je iemands foto op een flyer gebruikt.',
    ],
};

export default config;
