import type { SimulationLabConfig, VisualData } from '../SimulationLab';

// ─── computeVisuals ───────────────────────────────────────────────────────────
// Switch/case over simId — no eval, pure TypeScript.

function computeVisuals(
    simId: string,
    params: Record<string, number | string | boolean>
): VisualData {
    // ── Sim 1: Code leesbaarheid → Meter (Kwaliteitsscore) ────────────────────
    if (simId === 'code-leesbaarheid') {
        // naamgeving: 0 = slecht (x, abc), 1 = matig, 2 = goed (beschrijvend)
        const naamgeving = params['naamgeving'] as number ?? 0;
        // commentaar: true = aanwezig, false = afwezig
        const commentaar = params['commentaar'] as boolean ?? false;
        // inspringen: true = consistent, false = willekeurig
        const inspringen = params['inspringen'] as boolean ?? false;

        const naamgeving_score = naamgeving === 0 ? 0 : naamgeving === 1 ? 15 : 30;
        const commentaarScore = commentaar ? 35 : 0;
        const inspringenScore = inspringen ? 35 : 0;
        const score = naamgeving_score + commentaarScore + inspringenScore;

        const sublabel =
            score <= 20
                ? 'Onleesbare code — niemand begrijpt dit over 6 maanden'
                : score <= 50
                ? 'Gedeeltelijk leesbaar, maar nog veel te verbeteren'
                : score <= 80
                ? 'Goede leesbaarheid — makkelijk te volgen'
                : 'Professionele codekwaliteit!';

        return { type: 'meter', data: { value: score, label: 'Kwaliteitsscore', sublabel } };
    }

    // ── Sim 2: DRY-principe → BarChart (Herhaling in code) ────────────────────
    if (simId === 'dry-principe') {
        const herhaaldeFuncties = params['herhaalde-functies'] as boolean ?? false;
        const gekopieerdeBlokken = params['gekopieerde-blokken'] as boolean ?? false;
        const magigeGetallen = params['magische-getallen'] as boolean ?? false;
        const duplicateLogica = params['duplicate-logica'] as boolean ?? false;
        const functiesGebruikt = params['functies-gebruikt'] as boolean ?? false;

        const bars = [
            {
                label: 'Herhaalde functies',
                value: herhaaldeFuncties ? 4 : 0,
                color: herhaaldeFuncties ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Gekopieerde blokken',
                value: gekopieerdeBlokken ? 5 : 0,
                color: gekopieerdeBlokken ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Magische getallen',
                value: magigeGetallen ? 3 : 0,
                color: magigeGetallen ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Duplicate logica',
                value: duplicateLogica ? 5 : 0,
                color: duplicateLogica ? '#D97848' : '#E7D8BD',
            },
            {
                label: 'Functies gebruikt',
                value: functiesGebruikt ? 1 : 0,
                color: functiesGebruikt ? '#5F947D' : '#E7D8BD',
            },
        ];

        return { type: 'bar-chart', data: bars };
    }

    // ── Sim 3: Feedback methode → Comparison (Aanpak vs Sfeer) ────────────────
    if (simId === 'feedback-methode') {
        const methode = params['methode'] as string ?? 'Afkraken';

        if (methode === 'Afkraken') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Hoe jij feedback geeft',
                    leftItems: [
                        { icon: '💢', label: '"Deze code is verschrikkelijk slecht"' },
                        { icon: '👎', label: '"Heb jij hier niets van geleerd?"' },
                        { icon: '🚫', label: 'Geen positieve punten benoemen' },
                        { icon: '😤', label: 'Alleen kritiek, geen oplossing' },
                    ],
                    rightTitle: 'Wat er gebeurt',
                    rightItems: [
                        { icon: '❌', label: 'De ander voelt zich aangevallen' },
                        { icon: '❌', label: 'Samenwerking verslechtert' },
                        { icon: '❌', label: 'Niemand verbetert' },
                        { icon: '❌', label: 'Jij leert er ook niets van' },
                    ],
                },
            };
        }

        if (methode === 'Sandwich-methode') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Hoe jij feedback geeft',
                    leftItems: [
                        { icon: '✅', label: '"De structuur van je code is duidelijk"' },
                        { icon: '🔧', label: '"De variabelenamen kunnen beschrijvender"' },
                        { icon: '✅', label: '"De logica in de lus klopt helemaal"' },
                    ],
                    rightTitle: 'Wat er gebeurt',
                    rightItems: [
                        { icon: '✅', label: 'De ander staat open voor verbetering' },
                        { icon: '✅', label: 'Concrete verbeterpunten zijn duidelijk' },
                        { icon: '✅', label: 'Positieve samenwerking' },
                        { icon: '⚠️', label: 'Vraagt oefening om goed te doen' },
                    ],
                },
            };
        }

        // Alleen positief
        return {
            type: 'comparison',
            data: {
                leftTitle: 'Hoe jij feedback geeft',
                leftItems: [
                    { icon: '😊', label: '"Ziet er goed uit!"' },
                    { icon: '👍', label: '"Prima gedaan!"' },
                    { icon: '🙈', label: 'Problemen bewust niet noemen' },
                ],
                rightTitle: 'Wat er gebeurt',
                rightItems: [
                    { icon: '⚠️', label: 'Bugs blijven in de code' },
                    { icon: '⚠️', label: 'De ander verbetert niet' },
                    { icon: '❌', label: 'Niet eerlijk en niet nuttig' },
                    { icon: '✅', label: 'Prettige sfeer (op korte termijn)' },
                ],
            },
        };
    }

    // Fallback
    return { type: 'meter', data: { value: 0, label: 'Geen data' } };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const codeReviewerConfig: SimulationLabConfig = {
    missionId: 'code-reviewer',
    title: 'Code Reviewer',
    introEmoji: '👀',
    introTitle: 'Code Reviewer',
    introDescription:
        'Goede code is niet alleen code die werkt — het is code die anderen kunnen begrijpen. Ontdek wat leesbaarheid, het DRY-principe en constructieve feedback betekenen.',
    introFeatures: [
        'Sim 1 — Stel leesbaarheid in en zie je kwaliteitsscore',
        'Sim 2 — Ontdek hoeveel herhaling te veel is',
        'Sim 3 — Vergelijk feedbackmethoden',
    ],
    computeVisuals,
    simulations: [
        {
            id: 'code-leesbaarheid',
            title: 'Code leesbaarheid',
            description:
                'Speel met de opties voor naamgeving, commentaar en inspringing. Hoe verandert de kwaliteitsscore?',
            visualType: 'meter',
            maxScore: 30,
            parameters: [
                {
                    id: 'naamgeving',
                    label: 'Naamgeving variabelen',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'commentaar',
                    label: 'Commentaar toegevoegd',
                    type: 'toggle',
                    defaultToggle: false,
                },
                {
                    id: 'inspringen',
                    label: 'Consistente inspringing',
                    type: 'toggle',
                    defaultToggle: false,
                },
            ],
            questions: [
                {
                    id: 'cl1-q1',
                    question:
                        'Je ziet een variabele met de naam "temp2". Wat is hiervan het probleem?',
                    type: 'multiple-choice',
                    options: [
                        'De naam is te lang',
                        'Je kunt niet raden wat de variabele bevat zonder de rest van de code te lezen',
                        '"temp" is een verboden woord in JavaScript',
                        'Cijfers mogen niet in variabelenamen',
                    ],
                    correctAnswer: 'Je kunt niet raden wat de variabele bevat zonder de rest van de code te lezen',
                    explanation:
                        'Een naam als "temp2" vertelt niets. "gebruikersLeeftijd" of "berekendeKorting" zijn meteen duidelijk. Goede namen maken code leesbaar zonder uitleg.',
                    points: 10,
                },
                {
                    id: 'cl1-q2',
                    question: 'Wanneer moet je commentaar schrijven in code?',
                    type: 'multiple-choice',
                    options: [
                        'Bij elke regel code, altijd',
                        'Nooit — goede code heeft geen commentaar nodig',
                        'Bij complexe logica die niet vanzelfsprekend is, of bij bewuste keuzes uitleggen',
                        'Alleen bij fouten en bugs',
                    ],
                    correctAnswer: 'Bij complexe logica die niet vanzelfsprekend is, of bij bewuste keuzes uitleggen',
                    explanation:
                        'Te veel commentaar is ruis. Te weinig is verwarrend. Schrijf commentaar waar iemand anders (of jij over 6 maanden) zich zou afvragen: "Waarom staat dit hier zo?"',
                    points: 10,
                },
                {
                    id: 'cl1-q3',
                    question:
                        'Waarom is consistente inspringing (indentation) zo belangrijk in code?',
                    type: 'multiple-choice',
                    options: [
                        'De computer werkt sneller met nette inspringing',
                        'Het maakt de structuur van de code zichtbaar — wat is binnen wat?',
                        'Editors eisen het anders sla je niet op',
                        'Inspringing maakt de code veiliger',
                    ],
                    correctAnswer: 'Het maakt de structuur van de code zichtbaar — wat is binnen wat?',
                    explanation:
                        'Inspringing laat zien welke code binnen een functie, lus of if-blok staat. Zonder consistente inspringing wordt de structuur raak aan te zien, en herken je fouten niet meer.',
                    points: 10,
                },
            ],
        },
        {
            id: 'dry-principe',
            title: 'DRY — Don\'t Repeat Yourself',
            description:
                'Zet codeherhalingen aan en zie hoe groot de schade is. Wat is er mis met dubbele code?',
            visualType: 'bar-chart',
            maxScore: 40,
            parameters: [
                { id: 'herhaalde-functies', label: 'Herhaalde functies (zelfde code twee keer)', type: 'toggle', defaultToggle: false },
                { id: 'gekopieerde-blokken', label: 'Gekopieerde blokken (copy-paste)', type: 'toggle', defaultToggle: false },
                { id: 'magische-getallen', label: 'Magische getallen (bijv. 3.14 overal)', type: 'toggle', defaultToggle: false },
                { id: 'duplicate-logica', label: 'Duplicate logica (zelfde berekening meerdere keren)', type: 'toggle', defaultToggle: false },
                { id: 'functies-gebruikt', label: 'Functies gebruikt voor herhaalbare taken', type: 'toggle', defaultToggle: false },
            ],
            questions: [
                {
                    id: 'dry1-q1',
                    question: 'Wat betekent het DRY-principe (Don\'t Repeat Yourself)?',
                    type: 'multiple-choice',
                    options: [
                        'Schrijf code zo snel mogelijk, zonder te wachten',
                        'Schrijf dezelfde logica maar één keer en hergebruik het via functies',
                        'Nooit dezelfde variabelenaam twee keer gebruiken',
                        'Code altijd opnieuw schrijven in plaats van kopiëren',
                    ],
                    correctAnswer: 'Schrijf dezelfde logica maar één keer en hergebruik het via functies',
                    explanation:
                        'DRY betekent: als je dezelfde code twee keer schrijft, maak er dan een functie van. Als je later iets wilt veranderen, doe je het op één plek — niet op tien plekken.',
                    points: 15,
                },
                {
                    id: 'dry1-q2',
                    question:
                        'Wat is een "magisch getal" in code en waarom is het een probleem?',
                    type: 'multiple-choice',
                    options: [
                        'Een getal dat nooit verandert, zoals het getal 1',
                        'Een hardgecodeerd getal zonder naam, zoals "0.21" voor btw — niemand weet wat het betekent',
                        'Een getal dat de code versnelt',
                        'Een getal dat door AI is gegenereerd',
                    ],
                    correctAnswer: 'Een hardgecodeerd getal zonder naam, zoals "0.21" voor btw — niemand weet wat het betekent',
                    explanation:
                        '"0.21" zegt niets. "BTW_TARIEF = 0.21" is meteen duidelijk én makkelijk aan te passen. Geef getallen met betekenis altijd een naam via een constante.',
                    points: 15,
                },
                {
                    id: 'dry1-q3',
                    question:
                        'Je hebt dezelfde berekening op 5 plekken in de code. Het btw-tarief verandert. Hoe vaak moet je de code aanpassen?',
                    type: 'multiple-choice',
                    options: [
                        'Één keer, als je de berekening in een functie hebt gezet',
                        'Vijf keer — één keer per plek in de code',
                        'Helemaal niet — de berekening werkt automatisch bij',
                        'Twee keer — begin en einde van de code',
                    ],
                    correctAnswer: 'Vijf keer — één keer per plek in de code',
                    explanation:
                        'Exact het probleem dat DRY wil voorkomen: dezelfde logica op vijf plekken betekent vijf plekken updaten, en vijf kansen om een fout te maken. Één functie lost dit op.',
                    points: 10,
                },
            ],
        },
        {
            id: 'feedback-methode',
            title: 'Constructieve feedback geven',
            description:
                'Kies hoe je feedback geeft op andermans code. Vergelijk de aanpak met wat er echt gebeurt.',
            visualType: 'comparison',
            maxScore: 30,
            parameters: [
                {
                    id: 'methode',
                    label: 'Feedbackmethode',
                    type: 'select',
                    options: ['Afkraken', 'Sandwich-methode', 'Alleen positief'],
                    defaultOption: 'Afkraken',
                },
            ],
            questions: [
                {
                    id: 'fb1-q1',
                    question: 'Wat is de kern van de sandwich-methode bij code review?',
                    type: 'multiple-choice',
                    options: [
                        'Alleen maar positief zijn zodat de samenwerking goed blijft',
                        'Positief punt → verbeterpunt met uitleg → positief punt',
                        'Eerst alle fouten noemen, dan de goede dingen',
                        'Code review doe je altijd schriftelijk, nooit mondeling',
                    ],
                    correctAnswer: 'Positief punt → verbeterpunt met uitleg → positief punt',
                    explanation:
                        'De sandwich-methode opent met iets wat goed is, benoemt dan concreet wat beter kan (met uitleg waarom), en sluit positief af. Zo staat de ander open voor verbetering.',
                    points: 10,
                },
                {
                    id: 'fb1-q2',
                    question:
                        'Wat is het verschil tussen "Dit is slechte code" en "De functienaam geeft niet aan wat de functie doet"?',
                    type: 'multiple-choice',
                    options: [
                        'Geen verschil — beide beschrijven een probleem',
                        'De tweede is concreet en actionable — je weet precies wat je kunt verbeteren',
                        'De eerste is vriendelijker',
                        'De tweede is te vaag om nuttig te zijn',
                    ],
                    correctAnswer: 'De tweede is concreet en actionable — je weet precies wat je kunt verbeteren',
                    explanation:
                        '"Slechte code" is een oordeel. "De naam geeft niet aan wat de functie doet" is een specifiek punt dat je direct kunt oplossen. Goede feedback is altijd concreet.',
                    points: 10,
                },
                {
                    id: 'fb1-q3',
                    question:
                        'Waarom is het ook nuttig voor de reviewer om code review te doen — niet alleen voor de schrijver?',
                    type: 'multiple-choice',
                    options: [
                        'Het is niet nuttig voor de reviewer',
                        'Je leert code van anderen lezen en patroonherkennen — dat maakt jou een betere programmeur',
                        'Alleen om een beoordeling te geven aan de docent',
                        'De reviewer kan de code kopiëren voor eigen projecten',
                    ],
                    correctAnswer: 'Je leert code van anderen lezen en patroonherkennen — dat maakt jou een betere programmeur',
                    explanation:
                        'Code review is leren in twee richtingen. Je ziet hoe iemand anders een probleem aanpakt, herkent patronen die je zelf ook kunt gebruiken, en scherpt je analytische blik.',
                    points: 10,
                },
            ],
        },
    ],
    maxScore: 100,
    badges: [
        {
            minScore: 90,
            emoji: '🏆',
            title: 'Senior Reviewer',
            color: '#5F947D',
        },
        {
            minScore: 70,
            emoji: '👀',
            title: 'Code Reviewer Pro',
            color: '#5F947D',
        },
        {
            minScore: 50,
            emoji: '🔧',
            title: 'Code Kijker',
            color: '#445865',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Startende Code Reviewer',
            color: '#0B453F',
        },
        {
            minScore: 0,
            emoji: '📖',
            title: 'Aan het leren',
            color: '#445865',
        },
    ],
    takeaways: [
        'Goede naamgeving, commentaar en inspringing maken code leesbaar — ook voor jezelf over 6 maanden.',
        'DRY: schrijf dezelfde logica maar één keer en gebruik functies voor herhaalbaarheid.',
        'Magische getallen zijn verborgen bugs — geef ze altijd een naam via een constante.',
        'Constructieve feedback is concreet en actionable: noem wat beter kan én waarom.',
        'Code review helpt zowel de schrijver als de reviewer — je leert van andermans code.',
    ],
};

export default codeReviewerConfig;
