import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const prototypeDeveloperConfig: BuilderCanvasConfig = {
    missionId: 'prototype-developer',
    title: 'Prototype Developer',
    introEmoji: '🛠️',
    introTitle: 'Van idee naar werkend prototype',
    introDescription:
        'In deze missie ga je van een idee naar een werkend digitaal prototype. Je doorloopt de complete ontwikkelcyclus: ontwerpen, bouwen, testen bij gebruikers en verbeteren op basis van hun feedback.',
    introFeatures: [
        'Definieer de kernfunctie van je prototype',
        'Bouw een werkende versie met de tools die je kent',
        'Test met echte gebruikers en verzamel feedback',
        'Itereer: verbeter op basis van wat je hebt geleerd',
    ],
    enableChat: true,
    chatRoleId: 'prototype-developer',
    previewType: 'text-preview',
    steps: [
        {
            id: 'idee-uitwerken',
            title: 'Idee uitwerken en afbakenen',
            description:
                'Het gevaarlijkste moment bij een project is het begin: je hebt duizend ideeën en geen richting. Een goede developer maakt scherpe keuzes over wat erin zit en wat er buiten valt — voordat de code begint.',
            instruction:
                'Beschrijf je product-idee. Vul in: 1) Wat maakt het? (in één zin: "Mijn tool helpt [GEBRUIKER] om [PROBLEEM] op te lossen door [KERNFUNCTIE]"), 2) Welke tools of talen gebruik je om het te bouwen? (Python, HTML/CSS/JS, Scratch, Figma, etc.), 3) Wat zit er WEL in de eerste versie? (max 3 functies), 4) Wat zit er NIET in de eerste versie? (alles wat verleidelijk is maar niet noodzakelijk). Leg bij punt 4 uit waarom je die functies uitstelt.',
            tip: 'Feature creep (steeds meer functies willen toevoegen) is de grootste killer van projecten. Elke extra functie verdubbelt de bouwtijd. Kies drie functies max en bouw die perfect.',
            checklistItems: [
                { id: 'kernzin', label: 'Het idee is beschreven in één zin met gebruiker en kernfunctie' },
                { id: 'tools', label: 'Ik heb aangegeven welke tools of talen ik gebruik' },
                { id: 'in-scope', label: 'Maximaal 3 functies voor de eerste versie zijn benoemd' },
                { id: 'out-scope', label: 'Ik heb uitgelegd welke functies ik uitstel en waarom' },
            ],
            textPrompt: 'Beschrijf je product-idee en afbakening',
        },
        {
            id: 'ontwerpen',
            title: 'Prototype ontwerpen',
            description:
                'Voordat je bouwt, schets je. Een ontwerp helpt je nadenken over hoe het werkt, nog voordat je een uur in code hebt gestoken. Fouten in een schets kosten 5 minuten. Fouten in code kosten uren.',
            instruction:
                'Maak een tekstueel ontwerp van je prototype. Beschrijf: 1) De hoofdschermen of secties (minimaal 2), 2) Hoe de gebruiker door de kernfunctie navigeert (gebruikerspad in stappen), 3) Welke data je opslaat of verwerkt (bijv. gebruikersinvoer, berekeningen), 4) Een lijst van de technische bouwblokken die je nodig hebt (bijv. HTML-formulier, Python-loop, database).',
            tip: 'Schrijf je ontwerp alsof je het uitlegt aan iemand die het moet bouwen terwijl jij op vakantie bent. Alles wat onduidelijk is voor die persoon, is ook onduidelijk in je eigen hoofd.',
            checklistItems: [
                { id: 'schermen', label: 'Minimaal 2 hoofdschermen of secties zijn beschreven' },
                { id: 'gebruikerspad', label: 'Het gebruikerspad door de kernfunctie is beschreven' },
                { id: 'data', label: 'Ik heb beschreven welke data verwerkt of opgeslagen wordt' },
                { id: 'bouwblokken', label: 'De technische bouwblokken zijn geïdentificeerd' },
            ],
            textPrompt: 'Beschrijf je prototype-ontwerp',
        },
        {
            id: 'bouwen',
            title: 'Prototype bouwen',
            description:
                'Nu ga je bouwen. De regel is simpel: bouw de kernfunctie first. Laat alles wat mooi is maar niet functioneel buiten beschouwing totdat de kernfunctie werkt. Een lelijke maar werkende prototype is altijd beter dan een mooie niet-werkende.',
            instruction:
                'Beschrijf hoe je het prototype hebt gebouwd of zou bouwen. Beschrijf: 1) Welke stappen heb je in welke volgorde gezet?, 2) Welke problemen of bugs ben je tegengekomen en hoe heb je ze opgelost?, 3) Wat werkt er nu? (kernfunctie beschrijving), 4) Wat werkt er nog niet of is nog placeholder? Schrijf ook een korte code-snippet of beschrijving van het technisch interessantste onderdeel van je prototype.',
            tip: 'Als je vastloopt, schrijf dan in gewone taal op wat je probeert te doen. Vaak zie je dan zelf al wat er misgaat. Dat heet "rubber duck debugging".',
            checklistItems: [
                { id: 'stappen', label: 'De bouwstappen zijn beschreven in volgorde' },
                { id: 'problemen', label: 'Minimaal 1 probleem of bug is beschreven met oplossing' },
                { id: 'kernfunctie-werkt', label: 'Ik heb beschreven welke kernfunctie nu werkt' },
                { id: 'technisch', label: 'Er is een technische beschrijving van het interessantste onderdeel' },
            ],
            textPrompt: 'Beschrijf het bouwproces',
        },
        {
            id: 'testen-itereren',
            title: 'Testen en itereren',
            description:
                'Een prototype dat je niet hebt getest is niet klaar. Echte gebruikers doen onverwachte dingen. Ze drukken op plekken die je niet bedoeld had. Ze begrijpen instructies anders. Testen onthult wat je zelf niet kunt zien.',
            instruction:
                'Beschrijf je testproces. Vul in: 1) Wie heeft je prototype getest? (minimaal 2 personen — klasgenoot, familielid), 2) Welke taak hebben ze uitgevoerd tijdens het testen?, 3) Welke 2 observaties of feedbackpunten heb je verzameld? (concreet: wat deden of zeiden ze?), 4) Welke 1 verbetering heb je doorgevoerd op basis van de feedback? Beschrijf ook: wat zou je doen als je meer tijd had om te verbeteren?',
            tip: 'Observeer, vraag niet tijdens het testen. Zeg niet "Nee, je moet hier klikken." Kijk gewoon. Waar iemand vastloopt, is een probleem in je design — niet bij de gebruiker.',
            checklistItems: [
                { id: 'twee-testers', label: 'Minimaal 2 testpersonen zijn beschreven' },
                { id: 'taak', label: 'De testtaak is beschreven' },
                { id: 'twee-observaties', label: 'Twee concrete observaties of feedbackpunten zijn genoteerd' },
                { id: 'verbetering', label: 'Minimaal 1 verbetering is doorgevoerd of beschreven' },
            ],
            textPrompt: 'Beschrijf je testproces en iteraties',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Prototype Master', color: '#F59E0B' },
        { minScore: 70, emoji: '🛠️', title: 'Builder', color: '#10B981' },
        { minScore: 50, emoji: '🔧', title: 'Maker', color: '#D97757' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Prototype Bouwer', color: '#8B5CF6' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#6B6B66' },
    ],
    takeaways: [
        'Je weet hoe je een project afbakent zodat je niet verdrinkt in features',
        'Je kunt een technisch ontwerp schrijven voordat je begint met bouwen',
        'Je hebt een prototype gebouwd en de bouwstappen gedocumenteerd',
        'Je begrijpt hoe gebruikerstesten werken en wat je daarna doet met de feedback',
        'Je hebt de complete develop-test-itereer-cyclus doorlopen — de kern van elk software-project',
    ],
};

export default prototypeDeveloperConfig;
