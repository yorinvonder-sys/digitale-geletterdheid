import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'code-review-2',
    title: 'Code Terugblik',
    introEmoji: '🔄',
    introTitle: 'Bewijs dat je programmeren beheerst!',
    introDescription:
        'Je hebt algoritmes, webdevelopment, debugging en automatisering geleerd. In vier ronden test je of je de kernconcepten echt begrijpt.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Code Master',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '💻',
            title: 'Solide Programmeur',
            color: '#5F947D',
        },
        {
            minScore: 50,
            emoji: '📚',
            title: 'Op de goede weg',
            color: '#0B453F',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Kennis in opbouw',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '💪',
            title: 'Goede poging',
            color: '#D97848',
        },
    ],
    takeaways: [
        'Een algoritme is een stap-voor-stap plan dat een computer kan uitvoeren.',
        'HTML structureert content, CSS verzorgt de opmaak, JavaScript voegt interactiviteit toe.',
        'UX staat voor "User Experience" — hoe prettig een gebruiker een product ervaart.',
        'Automatisering vervangt herhalende taken door code die ze zelfstandig uitvoert.',
        'Code review helpt fouten op te sporen die je zelf over het hoofd ziet.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Lagen van een webpagina',
            description:
                'Sorteer de onderdelen van een webpagina van de meest fundamentele laag (boven) naar de meest visuele/interactieve laag (onder).',
            maxScore: 25,
            items: [
                { id: 'html', label: 'HTML — structuur en inhoud', correctPosition: 0 },
                { id: 'css', label: 'CSS — kleur, lettertype en layout', correctPosition: 1 },
                { id: 'js', label: 'JavaScript — knoppen, animaties, logica', correctPosition: 2 },
                { id: 'api', label: 'API-koppelingen — live data van buiten', correctPosition: 3 },
                { id: 'ux', label: 'UX-design — gebruikerservaring en toegankelijkheid', correctPosition: 4 },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Begrippen koppelen',
            description: 'Koppel elk programmeer- of webdev-begrip aan de juiste omschrijving.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Algoritme',
                    right: 'Stap-voor-stap plan om een probleem op te lossen',
                },
                {
                    left: 'Debuggen',
                    right: 'Fouten opsporen en repareren in code',
                },
                {
                    left: 'Functie',
                    right: 'Herbruikbaar stukje code met een naam',
                },
                {
                    left: 'Loop',
                    right: 'Herhaalt een actie totdat een conditie niet meer klopt',
                },
                {
                    left: 'Responsive design',
                    right: 'Website past zich aan aan schermgrootte',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'HTML, CSS of JavaScript?',
            description: 'Geef aan welke webtechnologie elk fragment of begrip bij hoort.',
            maxScore: 25,
            followUp: {
                question: 'Een klasgenoot klaagt: "Mijn knop ziet er goed uit maar doet niks als ik erop klik." Welke laag van de website moet worden aangepast?',
                options: [
                    'HTML — de knop-tag ontbreekt of is verkeerd geplaatst',
                    'CSS — de stijl zorgt ervoor dat klikken geblokkeerd wordt',
                    'JavaScript — er ontbreekt een event listener die reageert op de klik',
                    'De API — de server geeft geen antwoord terug',
                ],
                correctIndex: 2,
                explanation: 'Als een knop zichtbaar is (HTML aanwezig) en er goed uitziet (CSS correct), maar niet reageert, is de interactielogica het probleem. Dat zit in JavaScript: een onclick-handler of addEventListener ontbreekt. CSS kan in zeldzame gevallen klikken blokkeren (pointer-events: none), maar dat is hier niet de meest logische diagnose.',
                bonusPoints: 5,
            },
            categories: ['HTML', 'CSS', 'JavaScript'],
            items: [
                { label: '<h1>Welkom op mijn site</h1>', correctCategory: 'HTML' },
                { label: 'background-color: #0B453F;', correctCategory: 'CSS' },
                { label: 'document.getElementById("knop").onclick = ...', correctCategory: 'JavaScript' },
                { label: '<img src="foto.jpg" alt="Profielfoto">', correctCategory: 'HTML' },
                { label: 'font-size: 18px; font-weight: bold;', correctCategory: 'CSS' },
                { label: 'let score = 0; score = score + 10;', correctCategory: 'JavaScript' },
                { label: '<nav> met daarin <a href="..."> links', correctCategory: 'HTML' },
                { label: 'border-radius: 12px; padding: 1rem;', correctCategory: 'CSS' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'Programmeren: Waar of Onwaar?',
            description: 'Acht snelle vragen over algoritmes, webdev en automatisering.',
            maxScore: 25,
            followUp: {
                question: 'Je schoolagenda-app werkt alleen op een grote laptop maar ziet er gebroken uit op je telefoon. Welk concept helpt dit op te lossen?',
                options: [
                    'Algorithme — de sorteervolgorde van afspraken aanpassen',
                    'Responsive design — de layout past zich aan aan de schermgrootte',
                    'Debuggen — de logische fout in de agendacode opsporen',
                    'Automatisering — een script dat de lay-out elke nacht herstart',
                ],
                correctIndex: 1,
                explanation: 'Responsive design zorgt dat een interface werkt op verschillende schermformaten, via CSS media queries of flexibele layouts. Debuggen lost logische fouten op, maar het probleem hier is geen bug — de opmaak is simpelweg niet ontworpen voor kleine schermen. Automatisering en algoritmes zijn hier niet relevant.',
                bonusPoints: 5,
            },
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Een while-loop stopt automatisch als de conditie onwaar wordt.',
                    answer: true,
                    explanation: 'Zodra de conditie false is, gaat de code verder na de loop.',
                },
                {
                    question: 'CSS bepaalt welke tekst op een webpagina staat.',
                    answer: false,
                    explanation: 'CSS bepaalt de opmaak (stijl). De inhoud wordt door HTML bepaald.',
                },
                {
                    question: 'Een API laat twee systemen met elkaar communiceren.',
                    answer: true,
                    explanation: 'Via een API kan een app data opvragen bij een andere service, zoals weer-data of betalen.',
                },
                {
                    question: 'UX staat voor "User Experience" (gebruikerservaring).',
                    answer: true,
                    explanation: 'UX gaat over hoe prettig en intuïtief een gebruiker een product ervaart.',
                },
                {
                    question: 'Je hoeft geen variabelen te gebruiken als je code werkt.',
                    answer: false,
                    explanation: 'Variabelen maken code leesbaar, herbruikbaar en makkelijk aan te passen.',
                },
                {
                    question: 'Automatisering vervangt herhalende handmatige taken door code.',
                    answer: true,
                    explanation: 'Automatisering bespaart tijd door taken die altijd hetzelfde zijn te laten draaien zonder menselijke tussenkomst.',
                },
                {
                    question: 'Een bug is altijd zichtbaar als een foutmelding in de browser.',
                    answer: false,
                    explanation: 'Logische fouten (de code doet iets anders dan bedoeld) geven geen foutmelding maar leveren wel verkeerde resultaten.',
                },
                {
                    question: 'Computational thinking kun je ook buiten programmeren toepassen.',
                    answer: true,
                    explanation: 'Problemen opsplitsen, patronen herkennen en stap-voor-stap denken helpt in wiskunde, organisatie en veel andere vakken.',
                },
            ],
        },
    ],
};

export default config;
