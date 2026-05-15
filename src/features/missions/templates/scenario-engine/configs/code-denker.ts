import type { ScenarioEngineConfig } from '../types';

const config: ScenarioEngineConfig = {
    missionId: 'code-denker',
    title: 'De Code Denker',
    introEmoji: '🧠',
    introTitle: 'De Code Denker',
    introDescription:
        'Programmeurs schrijven niet gewoon code — ze denken EERST na. Ze splitsen problemen op, zoeken patronen, laten onnodige details weg en schrijven stappenplannen. Dat heet computational thinking. En het beste nieuws: je hebt er geen computer voor nodig.',
    introFeatures: [
        'Herken de 4 bouwstenen van computational thinking',
        'Rangschik stappen van een algoritme in de juiste volgorde',
        'Oefen: welke aanpak hoort bij welk probleem?',
        'Ontdek hoe computers "denken" aan de hand van alledaagse situaties',
    ],
    learningObjectives: [
        'De leerling herkent minimaal 3 voorbeelden van decompositie in alledaagse situaties.',
        'De leerling zet 5 stappen van een simpel algoritme in een logische volgorde.',
        'De leerling onderscheidt bij 6 voorbeelden wanneer abstractie details terecht weglaat.',
        'De leerling selecteert patronen in reeksen zonder willekeurige voorbeelden mee te nemen.',
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 80,
            emoji: '🧠',
            title: 'Meester Algoritme-Denker',
            color: '#0B453F',
        },
        {
            minScore: 60,
            emoji: '💡',
            title: 'Code Denker',
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
        'Decompositie: een groot probleem opdelen in kleine beheersbare stukken is de eerste stap van elke programmeur.',
        'Patroonherkenning: computers en mensen zijn beide goed in het spotten van herhalende structuren in data.',
        'Abstractie: details weglaten die er niet toe doen zodat je het echte probleem ziet.',
        'Een algoritme is een herhaalbaar stappenplan — een recept is ook een algoritme.',
        'Computational thinking is een manier van denken die je overal kunt toepassen, niet alleen bij programmeren.',
    ],
    rounds: [
        // ── RONDE 1: select-correct ───────────────────────────────────────────────
        {
            id: 'welke-bouwsteen',
            emoji: '🧱',
            title: 'Welke bouwsteen is dit?',
            description:
                'Elk voorbeeld hieronder past bij één van de vier bouwstenen van computational thinking: decompositie, patroonherkenning, abstractie of algoritme. Welke voorbeelden zijn voorbeelden van DECOMPOSITIE? Selecteer ze.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je herkent wanneer een groot probleem wordt opgeknipt in kleine stappen.',
            feedbackIncorrect:
                'Let op: decompositie gaat specifiek over het opsplitsen van een probleem. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '🎂',
                    title: 'Verjaardag organiseren in losse taken',
                    description:
                        'In plaats van te zeggen "ik organiseer een feest" maak je een lijst: uitnodigingen versturen, eten bestellen, muziek kiezen, huis versieren, taart bakken.',
                    correct: true,
                    explanation:
                        'Dit is decompositie. Het grote probleem ("feest organiseren") wordt opgesplitst in kleinere, uitvoerbare deeltaken. Programmeurs doen dit altijd voordat ze beginnen met coderen.',
                },
                {
                    id: 2,
                    icon: '🔢',
                    title: 'Zien dat 2, 4, 6, 8 steeds +2 is',
                    description:
                        'Je kijkt naar een reeks getallen en ziet dat elk getal steeds 2 meer is dan het vorige.',
                    correct: false,
                    explanation:
                        'Dit is patroonherkenning, niet decompositie. Je ziet een herhaling in een reeks — dat is een ander computational thinking-concept.',
                },
                {
                    id: 3,
                    icon: '📝',
                    title: 'Een scriptie schrijven opgesplitst in hoofdstukken',
                    description:
                        'In plaats van meteen te beginnen met schrijven, deel je het op: inleiding, theorie, methode, resultaten, conclusie.',
                    correct: true,
                    explanation:
                        'Decompositie. Een groot schrijfproject wordt opgedeeld in beheersbare secties. Elk hoofdstuk is een deelprobleem dat je apart kunt aanpakken.',
                },
                {
                    id: 4,
                    icon: '🗺️',
                    title: 'Een kaart tekenen zonder elke steen op straat',
                    description:
                        'Een plattegrond toont straten en gebouwen, maar laat individuele tegels, struiken en prullenbakken weg.',
                    correct: false,
                    explanation:
                        'Dit is abstractie. Onnodige details worden weggelaten zodat je het grote geheel ziet. Abstractie en decompositie zijn verwant maar anders: abstractie = details weglaten, decompositie = opdelen.',
                },
                {
                    id: 5,
                    icon: '🏗️',
                    title: 'Een huis bouwen in fasen',
                    description:
                        'Een aannemer verdeelt het bouwproject in: fundering, muren, dak, elektra, loodgieter, afwerking.',
                    correct: true,
                    explanation:
                        'Decompositie. Een complex project wordt in logische fasen gesplitst. Elke fase is een apart deelprobleem met eigen uitvoerders en afhankelijkheden.',
                },
                {
                    id: 6,
                    icon: '🍳',
                    title: 'Een recept: stap 1, stap 2, stap 3...',
                    description:
                        'Je schrijft een recept op als genummerde stappen die je altijd in dezelfde volgorde uitvoert.',
                    correct: false,
                    explanation:
                        'Dit is een algoritme: een herhaalbaar stappenplan. Een recept is een klassiek voorbeeld van een algoritme. Het kan ook decompositie bevatten (bereid het vlees, bereid de saus), maar het concept "recept = stappenplan" is algoritme.',
                },
                {
                    id: 7,
                    icon: '📱',
                    title: 'App-ontwerp opdelen: login, profiel, berichten, instellingen',
                    description:
                        'Een app-ontwerper splitst de app op in vier aparte schermen die elk apart worden gebouwd.',
                    correct: true,
                    explanation:
                        'Decompositie in software-ontwerp. Dit is precies hoe professionele developers werken: grote applicaties worden opgedeeld in modules of features die onafhankelijk kunnen worden ontwikkeld.',
                },
                {
                    id: 8,
                    icon: '☀️',
                    title: 'Herkennen dat het elke ochtend licht wordt',
                    description:
                        'Je observeert dat de zon elke dag opkomt en stelt vast dat dit een herhaling is.',
                    correct: false,
                    explanation:
                        'Dit is patroonherkenning: je ziet een herhaling in de natuur. Computers en AI maken gebruik van hetzelfde principe om voorspellingen te doen op basis van herhalende patronen in data.',
                },
            ],
        },

        // ── RONDE 2: order-priority ───────────────────────────────────────────────
        {
            id: 'algoritme-volgorde',
            emoji: '📋',
            title: 'Zet het algoritme in de juiste volgorde',
            description:
                'Hieronder staan vijf stappen voor het maken van een pindakaasboterham, maar ze staan door elkaar. Zet ze in de juiste volgorde voor een computer: van eerste (1e) tot laatste (5e) stap.',
            type: 'order-priority',
            orderInstruction: 'Klik de stappen in volgorde: eerste stap eerst',
            maxScore: 25,
            feedbackCorrect:
                'Perfect algoritme! Een computer zou dit stappenplan kunnen volgen zonder extra uitleg.',
            feedbackIncorrect:
                'Denk als een computer: hij begrijpt NIETS vanzelf. Welke stap moet logisch de vorige volgen?',
            items: [
                {
                    id: 1,
                    icon: '🍞',
                    title: 'Pak twee sneetjes brood uit de zak',
                    description:
                        'Haal de broodzak uit de kast, trek de clip eraf en haal twee sneetjes brood tevoorschijn.',
                    correctPosition: 0,
                    explanation:
                        'Je hebt het brood nodig als basis voor alles wat volgt. Een computer begint altijd met het verkrijgen van de benodigde ingrediënten voordat hij kan werken.',
                },
                {
                    id: 2,
                    icon: '🥄',
                    title: 'Pak een mes uit de bestekla',
                    description:
                        'Open de bestekla en haal er een botermes of tafelmes uit.',
                    correctPosition: 1,
                    explanation:
                        'Het gereedschap ophalen is de tweede stap. Je hebt het mes nodig om te smeren, maar je kunt het mes ook al pakken terwijl het brood klaarstaat.',
                },
                {
                    id: 3,
                    icon: '🫙',
                    title: 'Open de pot pindakaas en schep een lepel vol',
                    description:
                        'Pak de pot pindakaas, draai het deksel eraf en steek het mes erin om een flinke laag pindakaas op te scheppen.',
                    correctPosition: 2,
                    explanation:
                        'Ingrediënt ophalen en klaarzetten. Dit moet na het pakken van het mes — anders heb je niets om mee te scheppen.',
                },
                {
                    id: 4,
                    icon: '🧈',
                    title: 'Smeer de pindakaas gelijkmatig over één sneetje',
                    description:
                        'Beweeg het mes met pindakaas van het midden naar de randen van het sneetje brood totdat het gelijkmatig bedekt is.',
                    correctPosition: 3,
                    explanation:
                        'De centrale actie. Dit kan pas nadat je het brood hebt, het mes hebt en de pindakaas hebt opgeschept. De volgorde van voorbereiding bepaalt wanneer je de hoofdactie kunt uitvoeren.',
                },
                {
                    id: 5,
                    icon: '🥪',
                    title: 'Leg het tweede sneetje brood erop',
                    description:
                        'Neem het tweede sneetje brood en leg het met de platte kant naar beneden op het gesmeerde sneetje.',
                    correctPosition: 4,
                    explanation:
                        'Laatste stap: samenvoegen tot eindproduct. Dit kan pas nadat de pindakaas is aangebracht. Als je dit eerder doet, heb je geen toegang meer tot het gesmeerde sneetje.',
                },
            ],
        },

        // ── RONDE 3: binary-choice ────────────────────────────────────────────────
        {
            id: 'abstractie-of-detail',
            emoji: '🔭',
            title: 'Abstractie: wat laat je weg?',
            description:
                'Abstractie is het weglaten van onnodige details zodat je je kunt concentreren op wat echt belangrijk is. Is het weglaten van dit detail verstandige abstractie — of verlies je iets cruciaals?',
            type: 'binary-choice',
            maxScore: 25,
            feedbackCorrect: 'Goed! Je weet wanneer details ertoe doen en wanneer niet.',
            feedbackIncorrect: 'Lastig. Soms is een detail cruciaal, soms leidt het alleen maar af.',
            items: [
                {
                    id: 1,
                    icon: '🗺️',
                    title: 'Routebeschrijving zonder namen van kleine steegjes',
                    description:
                        'Je beschrijft de route van school naar de Albert Heijn. Je noemt de grote straten en afslaan, maar laat kleine straatjes die je niet in hoeft weg.',
                    correct: true,
                    explanation:
                        'Goede abstractie. De niet-relevante steegjes weglaten maakt de routebeschrijving duidelijker en makkelijker te volgen. Ze zijn niet nodig om het doel te bereiken.',
                },
                {
                    id: 2,
                    icon: '🚦',
                    title: 'Routebeschrijving zonder verkeerslichten',
                    description:
                        'Je beschrijft een fietsroute en laat alle verkeerslichten weg uit de instructies.',
                    correct: false,
                    explanation:
                        'Dit is een te grote abstractie. Verkeerslichten zijn cruciaal voor veiligheid en oriëntatie ("sla rechts af na het derde stoplicht"). Details weglaten die noodzakelijk zijn voor het doel is geen goede abstractie.',
                },
                {
                    id: 3,
                    icon: '📱',
                    title: 'App-prototype zonder kleur of lettertype',
                    description:
                        'Je tekent een schets van een app op papier. Je tekent de knoppen en tekst, maar laat kleuren en lettertypen weg.',
                    correct: true,
                    explanation:
                        'Goede abstractie voor een prototype. In de schetsfase gaat het om de structuur en functionaliteit, niet om het uiterlijk. Kleuren en lettertypen zijn details voor een latere fase.',
                },
                {
                    id: 4,
                    icon: '🏥',
                    title: 'Patiëntendossier zonder allergieën',
                    description:
                        'Een arts maakt een vereenvoudigd overzicht van een patiënt en laat allergie-informatie weg om het overzicht korter te maken.',
                    correct: false,
                    explanation:
                        'Te gevaarlijke abstractie. Allergieën zijn levensbelangrijke informatie die nooit mag ontbreken in een medisch dossier. Abstractie mag nooit veiligheid in gevaar brengen.',
                },
                {
                    id: 5,
                    icon: '🌍',
                    title: 'Wereldkaart zonder rivieren',
                    description:
                        'Een kaart van de wereld toont landen en hoofdsteden, maar geen rivieren, meren of bergen.',
                    correct: true,
                    explanation:
                        'Het hangt af van het doel. Als je een politieke wereldkaart maakt (voor landen en grenzen), is abstractie van rivieren logisch. Als je een geografische kaart maakt, zijn rivieren essentieel. Context bepaalt wat je kunt weglaten.',
                },
                {
                    id: 6,
                    icon: '🧪',
                    title: 'Scheikundeformule zonder het element waterstof',
                    description:
                        'Bij het opschrijven van de formule voor water laat je de H (waterstof) weg zodat het er eenvoudiger uitziet.',
                    correct: false,
                    explanation:
                        'Water is H₂O — beide elementen zijn essentieel. Waterstof weglaten verandert de betekenis fundamenteel. Abstractie mag de accuraatheid van een model nooit aantasten.',
                },
            ],
        },

        // ── RONDE 4: select-correct ───────────────────────────────────────────────
        {
            id: 'patroonherkenning',
            emoji: '🔢',
            title: 'Patroonherkenning',
            description:
                'Computers zijn heel goed in het herkennen van patronen in data. Welke van de volgende reeksen bevatten een duidelijk patroon? Selecteer ze.',
            type: 'select-correct',
            maxScore: 25,
            feedbackCorrect:
                'Goed! Je herkent patronen even snel als een algoritme.',
            feedbackIncorrect:
                'Sommige reeksen lijken willekeurig maar hebben toch een patroon. Lees de uitleg.',
            items: [
                {
                    id: 1,
                    icon: '🔢',
                    title: '2, 4, 6, 8, 10, ...',
                    description:
                        'Een reeks getallen: 2, 4, 6, 8, 10. Wat is het volgende getal?',
                    correct: true,
                    explanation:
                        'Patroon: +2 bij elk getal. Het volgende getal is 12. Dit is een eenvoudig lineair patroon dat elke computer (en elk algoritme) in milliseconden herkent.',
                },
                {
                    id: 2,
                    icon: '🎲',
                    title: '3, 7, 2, 9, 1, 5, ...',
                    description:
                        'Een reeks getallen: 3, 7, 2, 9, 1, 5. Er is geen zichtbaar verband tussen de getallen.',
                    correct: false,
                    explanation:
                        'Dit lijkt willekeurig — er is geen duidelijk rekenkundig patroon. Zelfs computers hebben moeite met echte willekeurigheid. Randomheid is juist moeilijk om te herkennen én te genereren.',
                },
                {
                    id: 3,
                    icon: '🌀',
                    title: '1, 1, 2, 3, 5, 8, 13, ...',
                    description:
                        'Een reeks getallen: 1, 1, 2, 3, 5, 8, 13. Wat is het volgende getal?',
                    correct: true,
                    explanation:
                        'Dit is de Fibonacci-reeks: elk getal is de som van de twee vorige getallen. Het volgende getal is 21 (8+13). Dit patroon komt voor in de natuur: spiraalschelpen, bloemblaadjes, zonnebloemen.',
                },
                {
                    id: 4,
                    icon: '📅',
                    title: 'Ma, Di, Wo, Do, ...',
                    description:
                        'Een reeks: Maandag, Dinsdag, Woensdag, Donderdag. Wat komt daarna?',
                    correct: true,
                    explanation:
                        'Patroon: de dagen van de week in volgorde. Het volgende is Vrijdag. Computers herkennen dit soort cyclische patronen en kunnen ze gebruiken om kalenders, roosters en planningstools te bouwen.',
                },
                {
                    id: 5,
                    icon: '🌡️',
                    title: 'Temperaturen: 15, 22, 18, 25, 20, 28, ...',
                    description:
                        'Dagtemperaturen door de week: 15, 22, 18, 25, 20, 28. Er staat geen uitleg bij over dag en nacht.',
                    correct: false,
                    explanation:
                        'Zonder context is dit te onzeker. Je kunt misschien iets vermoeden, maar een goede code-denker noemt dit pas een patroon als de regel duidelijk genoeg is.',
                },
                {
                    id: 6,
                    icon: '🔤',
                    title: 'A, Q, D, Z, B, M, ...',
                    description:
                        'Een reeks letters: A, Q, D, Z, B, M. Wat is de volgende letter?',
                    correct: false,
                    explanation:
                        'Dit lijkt op een losse mix van letters. Als je geen duidelijke regel kunt uitleggen, is het voor deze opdracht geen betrouwbaar patroon.',
                },
                {
                    id: 7,
                    icon: '🎵',
                    title: 'Do, Mi, La, Re, Sol, ...',
                    description:
                        'Een reeks muzieknoten: Do, Mi, La, Re, Sol. Wat komt daarna?',
                    correct: false,
                    explanation:
                        'Deze noten staan niet in de gewone toonladdervolgorde. Er kan muziek achter zitten, maar als reeks is de regel niet duidelijk genoeg.',
                },
                {
                    id: 8,
                    icon: '🌈',
                    title: 'Rood, Blauw, Groen, Rood, Blauw, ...',
                    description:
                        'Een reeks kleuren: Rood, Blauw, Groen, Rood, Blauw. Welke kleur volgt?',
                    correct: true,
                    explanation:
                        'Patroon: Rood, Blauw, Groen herhaalt zich. De volgende is Groen. Dit is een eenvoudig cyclisch patroon van lengte 3. Computers gebruiken zulke patronen voor animaties, datacompressie en cryptografie.',
                },
            ],
        },
    ],
};

export default config;
