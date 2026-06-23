import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const webDeveloperConfig: BuilderCanvasConfig = {
    missionId: 'web-developer',
    title: 'Web Developer',
    introEmoji: '🖥️',
    introTitle: 'Bouw een interactieve webpagina',
    introDescription:
        'In deze missie ga je een stap verder dan HTML en CSS. Je bouwt een interactieve webpagina voor een dierenasiel — met navigatie, een galerij en JavaScript-functies die reageren op klikken. Zo werk je als een echte webdeveloper.',
    missionGoal: {
        primaryGoal: 'Ik ontwerp, beschrijf en test een interactieve webpagina met HTML-structuur, CSS-layout en JavaScript-gedrag.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description: 'Alle vier bouwstappen zijn afgerond met checklist en geschreven uitwerking.',
        },
        evidence: 'HTML-structuur, CSS-layout, JavaScript-interactie en een testplan voor de webpagina.',
    },
    introFeatures: [
        'Ontwerp een navigatiemenu met HTML en CSS',
        'Maak een responsive galerij voor dierenfoto\'s',
        'Voeg interactiviteit toe met JavaScript',
        'Test je pagina en verbeter de gebruikerservaring',
    ],
    enableChat: true,
    chatRoleId: 'web-developer',
    previewType: 'text-preview',
    steps: [
        {
            id: 'html-structuur',
            title: 'Paginastructuur plannen',
            description:
                'Voordat je begint te coderen, plan je de structuur van je pagina. Welke secties heb je nodig? Een navigatiebalk, een headerafbeelding, een galerij en contactinformatie zijn typische onderdelen van een overzichtspagina.',
            instruction:
                'Schrijf de HTML-structuur van je dierenasielpagina. Gebruik semantische tags: `<header>` voor de paginatop, `<nav>` voor het menu, `<main>` voor de inhoud en `<footer>` voor onderaan. Voeg in de `<nav>` drie links toe: "Dieren", "Adopteer" en "Contact". Noteer ook welke CSS-klassen je wilt gebruiken voor de galerij.',
            tip: 'Semantische HTML (header, nav, main, footer) helpt zoekmachines én screenreaders om je pagina te begrijpen. Gebruik nooit alleen divs!',
            checklistItems: [
                { id: 'semantisch', label: 'Ik gebruik semantische tags: header, nav, main, footer' },
                { id: 'nav-links', label: 'De navigatie heeft 3 werkende links' },
                { id: 'secties', label: 'Ik heb de secties van de pagina gepland en benoemd' },
            ],
            textPrompt: 'Schrijf je HTML-structuur hier',
        },
        {
            id: 'css-layout',
            title: 'Layout en stijl ontwerpen',
            description:
                'Een mooie website trekt bezoekers. CSS Flexbox en Grid (= manieren om content netjes te schikken) maken het mogelijk om elementen te rangschikken — ook op smartphones. Een galerij met dierenfoto\'s vraagt om een grid-layout.',
            instruction:
                'Schrijf CSS voor: 1) een navigatiebalk die horizontaal uitlijnt met Flexbox, 2) een grid-galerij die 3 kolommen toont op desktop en 1 kolom op mobiel (gebruik media queries), 3) een kleurenschema dat past bij het thema "zorg voor dieren". Gebruik minimaal 3 verschillende CSS-eigenschappen.',
            tip: 'Voor een responsieve grid gebruik je: `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));`. Dit werkt automatisch op alle schermbreedtes.',
            checklistItems: [
                { id: 'nav-flex', label: 'De navigatie gebruikt Flexbox voor horizontale uitlijning' },
                { id: 'grid', label: 'De galerij gebruikt CSS Grid' },
                { id: 'responsief', label: 'De layout werkt anders op mobiel dan op desktop (media query)' },
                { id: 'kleurenschema', label: 'Ik heb een consistent kleurenschema gekozen' },
            ],
            textPrompt: 'Schrijf je CSS-layout hier',
        },
        {
            id: 'javascript',
            title: 'Interactiviteit toevoegen',
            description:
                'JavaScript maakt een website levend. Knoppen die reageren, filters die werken, tekst die verandert — dat alles doe je met JavaScript. Voor het asiel wil je dat bezoekers op een dier kunnen klikken om meer info te zien.',
            instruction:
                'Beschrijf wat de JavaScript-functie moet doen en schrijf de structuur als een gebruiker op een dierkaart klikt. De functie moet: 1) een verborgen `<div>` zichtbaar maken in het DOM (= de structuur van je pagina) (gebruik `display: block`), 2) de naam en beschrijving van het dier in die div zetten, 3) een sluitknop tonen. Gebruik `addEventListener` — geen inline `onclick`.',
            tip: 'Vermijd onclick="..." in HTML. Gebruik altijd `element.addEventListener("click", functie)` in je JS-bestand. Dat is netter en makkelijker te onderhouden.',
            checklistItems: [
                { id: 'event-listener', label: 'Ik gebruik addEventListener, geen inline onclick' },
                { id: 'dom-manipulatie', label: 'De functie past het DOM aan (= de structuur van je pagina: zichtbaarheid, inhoud)' },
                { id: 'sluitknop', label: 'Er is een sluitknop die de info weer verbergt' },
            ],
            textPrompt: 'Schrijf je JavaScript-functie hier',
        },
        {
            id: 'testen',
            title: 'Testen en verbeteren',
            description:
                'Echte developers testen hun werk voordat ze het opleveren. Je kijkt of alles werkt zoals bedoeld, corrigeert bugs en bedenkt hoe de gebruikerservaring beter kan.',
            instruction:
                'Beschrijf hoe je je pagina zou testen. Welke stappen doorloop je? Noteer minimaal 3 testscenario\'s (bijv. "Wat als een afbeelding niet laadt?"). Beschrijf daarna één verbetering die je zou doorvoeren op basis van die test. Leg ook uit wat je zou doen als de JavaScript-functie niet werkt.',
            tip: 'Goede developers testen altijd "happy paths" (alles werkt goed) én "edge cases" (wat kan er misgaan?).',
            checklistItems: [
                { id: 'drie-tests', label: 'Ik heb 3 testscenario\'s beschreven' },
                { id: 'verbetering', label: 'Ik heb 1 concrete verbetering benoemd' },
                { id: 'debug', label: 'Ik heb uitgelegd hoe ik een niet-werkende JS-functie zou debuggen' },
            ],
            textPrompt: 'Schrijf je testplan en verbeteringen hier',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Full Stack Hero', color: '#e1ff01' },
        { minScore: 70, emoji: '🖥️', title: 'Web Developer', color: '#202023' },
        { minScore: 50, emoji: '🔧', title: 'Code Knutselaar', color: '#ff3c21' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Webdeveloper', color: '#202023' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#202023' },
    ],
    takeaways: [
        'Je weet hoe je semantische HTML gebruikt voor een overzichtelijke paginastructuur',
        'Je begrijpt hoe CSS Flexbox en Grid werken voor lay-outs',
        'Je kunt een responsieve pagina maken die op mobiel anders eruitziet',
        'Je hebt JavaScript gebruikt om DOM-elementen interactief te maken',
        'Je weet hoe je een webpagina systematisch test en verbetert',
    ],
};

export default webDeveloperConfig;
