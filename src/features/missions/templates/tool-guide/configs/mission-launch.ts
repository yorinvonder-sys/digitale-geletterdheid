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
                'Een flyer heeft maar **2 seconden** om iemand te stoppen. Bedenk **3 verschillende koppen** met deze formules:\n- **Probleem + oplossing**: "Nooit meer huiswerkstress!"\n- **Nieuwsgierigheid**: "De app die je docent niet kent"\n- **Concreet voordeel**: "Minder zoekwerk, meer overzicht"\n\nLet op: beloof alleen wat je waar kunt maken. Een kop als "3× sneller leren met AI" klinkt sterk, maar zonder bewijs is dat een loze claim — en die hoort niet op jouw flyer.\n\nKies de beste. Maximaal 8 woorden, geen vage titels zoals "Mijn project".',
            tip: 'Test je kop: lees hem hardop in 2 seconden. Begrijpt iemand die hem niet kent meteen waar het over gaat? Zo ja — goede kop. Zo nee — maak hem korter of specifieker.',
            checklistItems: [
                { id: 'drie-opties', label: 'Ik heb 3 verschillende koppen bedacht' },
                { id: 'beste-gekozen', label: 'Ik heb de beste kop gekozen' },
                { id: 'kop-kort', label: 'Mijn kop is kort (maximaal 8 woorden) en concreet' },
            ],
            verificationQuestion: {
                question:
                    'Je hebt je drie koppen hardop voorgelezen. Waaraan merk je tijdens dat voorlezen dat een kop te lang is?',
                options: [
                    'Je bent na 2 seconden nog steeds aan het voorlezen',
                    'De kop bevat een uitroepteken',
                    'De kop past niet op één regel op je scherm',
                    'Je moet even nadenken over de spelling',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Lees je kop nog een keer hardop voor met een timer erbij en let op hoe ver je na 2 seconden bent. Kies daarna opnieuw.',
                explanation:
                    'Klopt. De 2-secondentest doe je hardop: ben je dan nog niet klaar, dan is je kop te lang. Maak hem korter of specifieker.',
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
                question:
                    'Je laat iemand 5 seconden naar jouw kernboodschap kijken. Die persoon kan daarna alleen zeggen: "iets met school". Wat zegt dat over je tekst?',
                options: [
                    'Niets bijzonders — 5 seconden is nu eenmaal te kort',
                    'Mijn WAT en VOOR WIE zijn nog te vaag; ik moet concreter schrijven',
                    'Ik moet er meer zinnen bij zetten zodat het duidelijker wordt',
                    'Ik moet een ander lettertype kiezen',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk terug naar de drie vragen van deze stap: welke daarvan komt in het antwoord van je tester niet terug? Kies daarna opnieuw.',
                explanation:
                    'Precies. Onthoudt iemand na 5 seconden alleen iets vaags, dan is je boodschap niet scherp. Maak WAT en VOOR WIE concreter — niet langer.',
            },
        },
        {
            id: 'stap-3-cta',
            title: 'Call to action',
            instruction:
                'Een call to action (CTA) vertelt mensen **wat ze moeten doen**. Sterke voorbeelden:\n- "Kom vrijdag naar de aula!"\n- "Scan de QR-code en probeer het zelf!"\n- "Vraag me er morgen naar!"\n\nVermijd vaag ("Meer info volgt later"). Zet de CTA onderaan, groot en duidelijk.',
            tip: 'Stel je voor dat een vriend je flyer leest. Zou die weten wat ze moeten doen? En zouden ze het ook daadwerkelijk doen? Dat is de maatstaf voor een goede CTA.',
            checklistItems: [
                { id: 'cta-bedacht', label: 'Ik heb een duidelijke call to action bedacht' },
                { id: 'cta-concreet', label: 'Mijn CTA is concreet — de lezer weet precies wat te doen' },
                { id: 'cta-positie', label: 'De CTA staat onderaan op de flyer als het meest opvallende element' },
            ],
            verificationQuestion: {
                question:
                    'Je leest jouw eigen call to action voor aan een klasgenoot. Wat moet die klasgenoot daarna meteen kunnen navertellen?',
                options: [
                    'Hoe lang je aan je project hebt gewerkt',
                    'Wat hij of zij moet doen, en wanneer of waar',
                    'Welke kleuren je op de flyer gebruikt',
                    'Hoe jouw kop precies luidt',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk naar de voorbeeld-CTA\'s in de opdracht: welke informatie geven die allemaal aan de lezer? Kies daarna opnieuw.',
                explanation:
                    'Goed. Je CTA is geslaagd als de lezer direct weet welke actie hij moet doen — en wanneer of waar. Lukt dat navertellen niet, maak je CTA dan concreter.',
            },
        },
        {
            id: 'stap-4-ontwerp',
            title: 'Flyer indelen',
            instruction:
                'Maak de flyer in **Word, PowerPoint of Canva** (of op papier). Groot = belangrijk: kop bovenaan en het grootst, dan korte tekst en een afbeelding, CTA onderaan in een opvallende kleur. Maximaal 2 lettertypen, genoeg witruimte.',
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
                question:
                    'Je hebt je flyer gemaakt in Word, PowerPoint of Canva. Wat deed je daar om je kop het grootste element te maken?',
                options: [
                    'De kop geselecteerd en de lettergrootte omhoog gezet',
                    'De flyer op een grotere zoom bekeken',
                    'Extra witregels boven de kop gezet',
                    'De kop alleen vetgedrukt gemaakt',
                ],
                correctIndex: 0,
                allowRetry: true,
                retryHint:
                    'Nog niet. Klik je kop in je flyer aan en kijk in de werkbalk welke instelling de tekst echt groter maakt. Kies daarna opnieuw.',
                explanation:
                    'Klopt. Visuele hiërarchie maak je met echte lettergrootte: selecteer je kop en zet het lettertype groter. Inzoomen of alleen vet maken verandert de hiërarchie niet.',
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
