import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const openSourceContributorConfig: BuilderCanvasConfig = {
    missionId: 'open-source-contributor',
    title: 'Open Source Contributor',
    introEmoji: '🐙',
    introTitle: 'Draag bij aan een open source project',
    introDescription:
        'In deze missie doorloop je een gesimuleerde open source workflow: je analyseert een issue, plant een fork/branch, schrijft een bugfix en maakt een pull request-tekst — precies zoals echte developers dat doen, maar zonder dat je echt GitHub hoeft te openen.',
    missionGoal: {
        primaryGoal:
            'Laat zien dat je een open-source issue kunt analyseren, een bugfix kunt uitleggen en een duidelijke PR kunt voorbereiden.',
        criteria: {
            type: 'steps-complete',
            min: 4,
            description:
                'Alle vier stappen zijn afgerond met checklist en geschreven bewijs voor workflow, issue-analyse, bugfix en PR.',
        },
        evidence:
            'Leerlingbewijs: Git-workflow, issue-analyse, deterministische sorteerfix met test en PR-tekst. Docentbewijs: fase-overzicht en tekstbewijs tonen of de leerling professioneel kan samenwerken aan code.',
    },
    introFeatures: [
        'Begrijp hoe open source samenwerking werkt',
        'Analyseer een bug-rapport en reproduceer het probleem',
        'Schrijf een bugfix met duidelijke code en uitleg',
        'Maak een professioneel pull request',
    ],
    enableChat: false,
    chatRoleId: 'open-source-contributor',
    previewType: 'text-preview',
    steps: [
        {
            id: 'git-workflow',
            title: 'De Git-workflow begrijpen',
            description:
                'Open source projecten leven op GitHub. De workflow is altijd hetzelfde: Fork (kopieer het project naar je account) → Clone (download het naar je computer) → Branch (maak een eigen tak) → Fix → Commit → Push → Pull Request. Dit is hoe miljoenen developers wereldwijd samenwerken.',
            instruction:
                'Beschrijf de complete open source workflow stap voor stap in eigen woorden. Leg bij elke stap uit: wat doe je, en waarom is deze stap nodig? Schrijf ook de bijbehorende Git-commando\'s op. Begin bij `git clone` en eindig bij `git push`. Verklaar ook het verschil tussen een "fork" en een "clone" — veel beginners verwarren ze.',
            tip: 'Nooit direct op de `main`-branch werken bij een open source project. Altijd een nieuwe branch aanmaken, bijv. `git checkout -b fix/zoek-sortering`. Zo houd je je wijzigingen gescheiden.',
            checklistItems: [
                { id: 'zes-stappen', label: 'De workflow is beschreven in minimaal 6 stappen' },
                { id: 'commando', label: 'Bij elke stap staat het Git-commando' },
                { id: 'fork-clone', label: 'Het verschil tussen fork en clone is uitgelegd' },
                { id: 'branch', label: 'Ik heb uitgelegd waarom je een aparte branch aanmaakt' },
            ],
            textPrompt: 'Beschrijf de complete Git open source workflow',
            minTextLength: 150,
        },
        {
            id: 'issue-analyseren',
            title: 'Bug-issue analyseren',
            description:
                'Een goed issue-rapport beschrijft het probleem, hoe het te reproduceren, en wat het verwachte gedrag is. Als contributor is je eerste taak: begrijp het issue volledig voordat je code aanraakt.',
            instruction:
                'Stel je voor: er is een issue aangemaakt in een bibliotheek die boeken sorteert op publicatiedatum. Het issue zegt: "Boeken met dezelfde datum worden in willekeurige volgorde getoond." Analyseer dit issue: 1) Wat is het exacte probleem?, 2) Hoe reproduceer je het? (beschrijf de stappen), 3) Wat is het verwachte gedrag?, 4) Wat is een mogelijke oorzaak in de code? (hint: vergelijkingsfunctie bij gelijke waarden), 5) Welke bestanden of functies ga je bekijken?',
            tip: 'Voor je ook maar één regel code schrijft: reproduceer het probleem. Als je het niet kunt reproduceren, weet je niet zeker of je oplossing werkt.',
            checklistItems: [
                { id: 'probleem-beschreven', label: 'Het exacte probleem is beschreven' },
                { id: 'reproductie', label: 'De reproductiestappen zijn beschreven' },
                { id: 'verwacht-gedrag', label: 'Het verwachte gedrag is benoemd' },
                { id: 'oorzaak', label: 'Een mogelijke oorzaak in de code is beschreven' },
            ],
            textPrompt: 'Schrijf je issue-analyse',
            minTextLength: 140,
        },
        {
            id: 'bugfix',
            title: 'Bugfix schrijven',
            description:
                'Een bugfix in open source moet meer zijn dan "het werkt nu". De code moet leesbaar zijn, consistent met de codestijl van het project, en voorzien van een duidelijk commentaar waarom je de wijziging hebt gemaakt.',
            instruction:
                'Schrijf de bugfix voor het sorteerprobleem. De huidige sorteercode ziet er zo uit: `items.sort((a, b) => a.date - b.date)`. Wanneer twee items dezelfde datum hebben, is de volgorde ongedefinieerd. Schrijf een verbeterde versie die: 1) Op datum sorteert, 2) Bij gelijke datum op titel (alfabetisch) sorteert als tiebreaker, 3) Voorzien is van een commentaarregel die de keuze uitlegt. Schrijf ook een test-voorbeeld: geef 3 boeken op met datum en controleer de verwachte uitvoer.',
            tip: 'Sorteerfuncties moeten deterministisch zijn: dezelfde invoer geeft altijd dezelfde uitvoer. Willekeurige volgorde bij gelijke waarden is altijd een bug.',
            checklistItems: [
                { id: 'verbeterde-sort', label: 'De sorteerfunctie is verbeterd' },
                { id: 'tiebreaker', label: 'Er is een tiebreaker bij gelijke datum' },
                { id: 'commentaar', label: 'De code heeft een commentaarregel met motivatie' },
                { id: 'testgeval', label: 'Er is een testgeval met invoer en verwachte uitvoer' },
            ],
            textPrompt: 'Schrijf je bugfix met testgeval',
            minTextLength: 180,
        },
        {
            id: 'pull-request',
            title: 'Pull Request indienen',
            description:
                'Een pull request (PR) is een verzoek aan de maintainer om jouw wijzigingen in het project op te nemen. Een goede PR beschrijft wat je hebt gewijzigd, waarom en hoe je het hebt getest — zodat de reviewer snel kan beslissen.',
            instruction:
                'Schrijf de tekst voor een professioneel pull request. Gebruik dit formaat: 1) Titel (max 60 tekens, beschrijft wat je hebt opgelost), 2) Beschrijving: wat was het probleem?, 3) Wat heb je veranderd? (in bullet points), 4) Hoe kun je de fix testen? (stappen voor de reviewer), 5) Welk issue lost dit op? (schrijf: "Closes #42"), 6) Noteer ook: is er iets wat je nog niet zeker weet of wat de reviewer extra aandacht moet geven?',
            tip: 'Een goede PR-titel begint met een werkwoord: "Fix: sorteervolstabiliteit bij gelijke datum" of "Add: tiebreaker voor sortering". Duidelijk en concreet.',
            checklistItems: [
                { id: 'pr-titel', label: 'De PR-titel is beschrijvend en max 60 tekens' },
                { id: 'beschrijving', label: 'Het probleem en de wijziging zijn beschreven' },
                { id: 'testinstructies', label: 'Er zijn testinstructies voor de reviewer' },
                { id: 'closes', label: 'Ik heb "Closes #[nummer]" vermeld' },
            ],
            textPrompt: 'Schrijf je pull request tekst',
            minTextLength: 160,
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Open Source Hero', color: '#D7C95F' },
        { minScore: 70, emoji: '🐙', title: 'Contributor', color: '#5F947D' },
        { minScore: 50, emoji: '🔀', title: 'Pull Request Beginner', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Contributor', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je begrijpt de complete open source workflow van fork tot pull request',
        'Je kunt een bug-issue analyseren en reproduceren voordat je code schrijft',
        'Je hebt een echte bugfix geschreven met tiebreaker en commentaar',
        'Je kunt een professioneel pull request schrijven dat reviewers direct begrijpen',
        'Je weet hoe miljoenen developers wereldwijd samenwerken aan open source code',
    ],
};

export default openSourceContributorConfig;
