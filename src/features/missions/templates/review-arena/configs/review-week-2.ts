import type { ReviewArenaConfig } from '../ReviewArena';

const config: ReviewArenaConfig = {
    missionId: 'review-week-2',
    title: 'De Code-Criticus',
    introEmoji: '🧐',
    introTitle: 'Vind de fouten in AI-creaties!',
    introDescription:
        'Je hebt geleerd hoe AI content maakt en hoe games zijn opgebouwd. Nu test je of je fouten in AI-uitvoer kunt herkennen — van bugs in code tot hallucinaties in tekst.',
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Meester-Criticus',
            color: '#D7C95F',
        },
        {
            minScore: 70,
            emoji: '🔍',
            title: 'Scherp Oog',
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
        'AI kan stoppen midden in een zin of verhaal — je moet hem blijven sturen.',
        'Een game-object zonder randdetectie verdwijnt van het scherm.',
        'Hallucinations zijn fouten waarbij AI iets verzint dat niet bestaat of niet klopt.',
        'Goede prompts helpen AI om betere en volledigere output te geven.',
        'Kritisch kijken naar AI-output is een vaardigheid die je kunt trainen.',
    ],
    rounds: [
        {
            id: 'round-drag-sort',
            type: 'drag-sort',
            title: 'Stappen van game-ontwikkeling',
            description:
                'Zet de stappen van game-ontwikkeling in de juiste volgorde, van eerste idee tot eindproduct.',
            maxScore: 25,
            items: [
                { id: 'idee', label: 'Idee bedenken en spelconcept beschrijven', correctPosition: 0 },
                { id: 'ontwerp', label: 'Spelregels en schermontwerp uitwerken', correctPosition: 1 },
                { id: 'programmeren', label: 'Code schrijven voor personages en acties', correctPosition: 2 },
                { id: 'testen', label: 'Bugs opsporen en testen met anderen', correctPosition: 3 },
                { id: 'debuggen', label: 'Gevonden fouten oplossen (debuggen)', correctPosition: 4 },
                { id: 'lanceren', label: 'Eindversie delen of publiceren', correctPosition: 5 },
            ],
        },
        {
            id: 'round-match-pairs',
            type: 'match-pairs',
            title: 'Bugs koppelen aan oplossingen',
            description: 'Koppel elke bug aan de bijbehorende oplossing.',
            maxScore: 25,
            pairs: [
                {
                    left: 'Vijand verdwijnt buiten het scherm',
                    right: 'Randdetectie toevoegen (if x > width)',
                },
                {
                    left: 'AI stopt halverwege een verhaal',
                    right: 'Prompt herhalen of "ga verder" typen',
                },
                {
                    left: 'Spelkarakter reageert niet op toetsenbord',
                    right: 'Event listener toevoegen (onKeyDown)',
                },
                {
                    left: 'AI verzint een nepfeit (hallucinatie)',
                    right: 'Bron controleren en prompt aanscherpen',
                },
                {
                    left: 'Score telt niet op bij punten',
                    right: 'Score-variabele correct bijwerken in code',
                },
            ],
        },
        {
            id: 'round-categorize',
            type: 'categorize',
            title: 'AI-fout of programmeer-bug?',
            description: 'Bepaal of elk probleem een AI-fout (hallucinatie/stopsignaal) of een programmeer-bug is.',
            maxScore: 25,
            followUp: {
                question: 'Je vraagt een AI-chatbot om uitleg over een wetenschappelijk onderzoek. De AI geeft een gedetailleerd antwoord met een overtuigende bronvermelding. Wat is de meest verstandige volgende stap?',
                options: [
                    'De bronvermelding opzoeken om te controleren of het onderzoek echt bestaat',
                    'Het antwoord direct kopiëren — de AI klinkt zelfverzekerd',
                    'Dezelfde vraag opnieuw stellen om te kijken of het antwoord verandert',
                    'De AI vragen of hij zeker weet dat de bron klopt',
                ],
                correctIndex: 0,
                explanation: 'AI-modellen kunnen geloofwaardige maar verzonnen bronnen produceren (hallucinaties). Het zelfverzekerde taalgebruik zegt niets over de juistheid. Zelf de bron opzoeken is de enige betrouwbare check. De AI opnieuw vragen werkt niet — hij herhaalt zijn fout of verzint een andere.',
                bonusPoints: 5,
            },
            categories: ['AI-fout', 'Programmeer-bug'],
            items: [
                { label: 'AI verzint een boek dat niet bestaat', correctCategory: 'AI-fout' },
                { label: 'AI stopt halverwege een tekst', correctCategory: 'AI-fout' },
                { label: 'AI geeft een antwoord in de verkeerde taal', correctCategory: 'AI-fout' },
                { label: 'Personage valt door de vloer van het spel', correctCategory: 'Programmeer-bug' },
                { label: 'Teller gaat van 10 naar 8 in plaats van 9', correctCategory: 'Programmeer-bug' },
                { label: 'Spel crasht als je op "Start" drukt', correctCategory: 'Programmeer-bug' },
                { label: 'AI beschrijft een verkeerde regel bij een speluitleg', correctCategory: 'AI-fout' },
                { label: 'Muziek speelt niet af terwijl de code dat wel zegt', correctCategory: 'Programmeer-bug' },
            ],
        },
        {
            id: 'round-rapid-fire',
            type: 'rapid-fire',
            title: 'AI & Games: Waar of Onwaar?',
            description: 'Acht snelle vragen over AI-beperkingen en programmeren.',
            maxScore: 25,
            followUp: {
                question: 'Je bouwt een spel waarbij vijanden van links naar rechts lopen. Na een tijdje verdwijnen ze van het scherm. Welke aanpak lost dit het meest duurzaam op?',
                options: [
                    'De bewegingssnelheid verlagen zodat ze minder snel het scherm uit lopen',
                    'Randdetectie toevoegen die de vijand terugstuitert of verwijdert als hij de grens raakt',
                    'Het scherm breder maken zodat de vijanden er later uitlopen',
                    'Een timer instellen die elke 5 seconden nieuwe vijanden spawnt',
                ],
                correctIndex: 1,
                explanation: 'Randdetectie is de structurele oplossing: je code reageert op de positie van het object en handelt dat af. Snelheid verlagen of het scherm verbreden pakt de oorzaak niet aan — het probleem verschuift alleen. Een timer maakt nieuwe vijanden aan maar lost het verdwijnen niet op.',
                bonusPoints: 5,
            },
            timePerQuestion: 12,
            questions: [
                {
                    question: 'Een AI maakt nooit fouten als je hem een verhaal laat schrijven.',
                    answer: false,
                    explanation: 'AI kan stoppen, verzinnen of herhalen — kritisch controleren blijft altijd nodig.',
                },
                {
                    question: 'Een if-statement in code wordt gebruikt om keuzes te maken.',
                    answer: true,
                    explanation: 'Het if-statement controleert een conditie en voert daarna de juiste actie uit.',
                },
                {
                    question: 'Debuggen betekent het opzettelijk kapotmaken van je code.',
                    answer: false,
                    explanation: 'Debuggen is het opsporen en repareren van fouten, niet het veroorzaken ervan.',
                },
                {
                    question: 'Een loop in code voert dezelfde actie meerdere keren uit.',
                    answer: true,
                    explanation: 'Loops herhalen stappen automatisch, zoals het bewegen van meerdere vijanden tegelijk.',
                },
                {
                    question: 'AI begrijpt de context van een gesprek altijd volledig.',
                    answer: false,
                    explanation: 'AI heeft een beperkt geheugen per gesprek en kan context verliezen bij lange chats.',
                },
                {
                    question: 'Een variabele kan je zien als een naamkastje voor een waarde in code.',
                    answer: true,
                    explanation: 'Een variabele slaat een waarde op (getal, tekst, etc.) zodat je die later kunt gebruiken.',
                },
                {
                    question: 'Bij game-programmeren is testen pas nodig als je klaar bent met de code.',
                    answer: false,
                    explanation: 'Vroeg testen bespaart tijd — hoe eerder je een bug vindt, hoe makkelijker hij te fixen is.',
                },
                {
                    question: 'Een prompt is de instructie of vraag die je aan een AI stelt.',
                    answer: true,
                    explanation: 'De kwaliteit van je prompt bepaalt sterk hoe goed de AI reageert.',
                },
            ],
        },
    ],
};

export default config;
