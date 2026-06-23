import type { SimulationLabConfig, VisualData } from '../SimulationLab';

// ─── computeVisuals ───────────────────────────────────────────────────────────
// Switch/case over simId — no eval, pure TypeScript.

function computeVisuals(
    simId: string,
    params: Record<string, number | string | boolean>
): VisualData {
    // ── Sim 1: Advertentieprofiel opbouwen → Meter (Profiel Score) ────────────
    if (simId === 'advertentieprofiel') {
        // kijktijd: 0 = weinig, 1 = gemiddeld, 2 = veel
        const kijktijd = params['kijktijd'] as number ?? 0;
        // likes: 0 = nooit, 1 = soms, 2 = altijd
        const likes = params['likes'] as number ?? 0;
        // locatie: true = aan, false = uit
        const locatie = params['locatie'] as boolean ?? false;

        // Hoe meer data, hoe nauwkeuriger het profiel (en hoe hoger de score van het platform)
        const kijktijdScore = kijktijd === 0 ? 10 : kijktijd === 1 ? 25 : 40;
        const likesScore = likes === 0 ? 5 : likes === 1 ? 15 : 30;
        const locatieScore = locatie ? 30 : 0;
        const score = kijktijdScore + likesScore + locatieScore;

        const sublabel =
            score <= 20
                ? 'Heel weinig data — platform weet weinig over jou'
                : score <= 45
                ? 'Gemiddeld profiel — redelijke schatting van jouw interesses'
                : score <= 70
                ? 'Gedetailleerd profiel — platform herkent jouw patronen'
                : 'Volledig profiel — platform kan jouw gedrag voorspellen';

        return { type: 'meter', data: { value: score, label: 'Profielnauwkeurigheid', sublabel } };
    }

    // ── Sim 2: iPad-instellingen → BarChart (Privacy Exposure) ────────────────
    if (simId === 'ipad-instellingen') {
        // locatieApps: 0 = 0 apps, 1 = 1-2 apps, 2 = 3-5 apps, 3 = 6+ apps
        const locatieApps = params['locatie-apps'] as number ?? 0;
        const cameraApps = params['camera-apps'] as number ?? 0;
        const microfoonApps = params['microfoon-apps'] as number ?? 0;

        const locatieValue = locatieApps === 0 ? 0 : locatieApps === 1 ? 2 : locatieApps === 2 ? 4 : 5;
        const cameraValue = cameraApps === 0 ? 0 : cameraApps === 1 ? 1 : cameraApps === 2 ? 3 : 5;
        const microfoonValue = microfoonApps === 0 ? 0 : microfoonApps === 1 ? 1 : microfoonApps === 2 ? 3 : 5;

        const bars = [
            {
                label: 'Locatie',
                value: locatieValue,
                color: locatieValue > 2 ? '#ff3c21' : locatieValue > 0 ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Camera',
                value: cameraValue,
                color: cameraValue > 2 ? '#ff3c21' : cameraValue > 0 ? '#ff3c21' : '#e3e2dc',
            },
            {
                label: 'Microfoon',
                value: microfoonValue,
                color: microfoonValue > 2 ? '#ff3c21' : microfoonValue > 0 ? '#ff3c21' : '#e3e2dc',
            },
        ];

        return { type: 'bar-chart', data: bars };
    }

    // ── Sim 3: Filterbubbel → Comparison (Wat je ziet vs Wat bestaat) ─────────
    if (simId === 'filterbubbel') {
        const aanbevelingen = params['aanbevelingen'] as string ?? 'Alles aan';

        if (aanbevelingen === 'Alles aan') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Wat jij ziet',
                    leftItems: [
                        { icon: '🎮', label: 'Gaming-content die bij jou past' },
                        { icon: '⚽', label: 'Sport van jouw favoriete team' },
                        { icon: '🎵', label: 'Muziek die op jouw smaak lijkt' },
                        { icon: '📢', label: 'Meningen die op die van jou lijken' },
                    ],
                    rightTitle: 'Wat er écht bestaat',
                    rightItems: [
                        { icon: '🌍', label: 'Nieuws over de wereld' },
                        { icon: '🤔', label: 'Andere standpunten en meningen' },
                        { icon: '🎨', label: 'Content buiten jouw interesse' },
                        { icon: '⚠️', label: 'Jij ziet dit bijna nooit' },
                    ],
                },
            };
        }

        if (aanbevelingen === 'Gedeeltelijk') {
            return {
                type: 'comparison',
                data: {
                    leftTitle: 'Wat jij ziet',
                    leftItems: [
                        { icon: '🎮', label: 'Content die bij jou past' },
                        { icon: '🌍', label: 'Soms nieuws buiten jouw interesse' },
                        { icon: '🤔', label: 'Af en toe andere meningen' },
                    ],
                    rightTitle: 'Wat er écht bestaat',
                    rightItems: [
                        { icon: '✅', label: 'Iets meer diversiteit in je feed' },
                        { icon: '⚠️', label: 'Nog steeds beïnvloed door algoritme' },
                        { icon: '⚠️', label: 'Bubbel kleiner, niet weg' },
                        { icon: '✅', label: 'Bewuster mediagebruik' },
                    ],
                },
            };
        }

        // Uitgeschakeld
        return {
            type: 'comparison',
            data: {
                leftTitle: 'Wat jij ziet',
                leftItems: [
                    { icon: '🌍', label: 'Breed scala aan onderwerpen' },
                    { icon: '🤔', label: 'Verschillende standpunten' },
                    { icon: '📰', label: 'Nieuws dat jij niet verwacht' },
                    { icon: '🎲', label: 'Willekeuriger, minder gepersonaliseerd' },
                ],
                rightTitle: 'Wat er écht bestaat',
                rightItems: [
                    { icon: '✅', label: 'Kleinste filterbubbel' },
                    { icon: '✅', label: 'Meer bewust van de wereld om je heen' },
                    { icon: '⚠️', label: 'Minder makkelijk te volgen' },
                    { icon: '⚠️', label: 'Minder "relevant" aanbevelingen' },
                ],
            },
        };
    }

    // Fallback
    return { type: 'meter', data: { value: 0, label: 'Geen data' } };
}

// ─── Config ───────────────────────────────────────────────────────────────────

export const aiSpiegelConfig: SimulationLabConfig = {
    missionId: 'ai-spiegel',
    title: 'De AI Spiegel',
    introEmoji: '🪞',
    introTitle: 'De AI Spiegel',
    introDescription:
        'Jouw likes, kijktijd en locatie bouwen stukje bij beetje een profiel van jou op. Ontdek hoe dat werkt, wat platforms ermee doen en hoe je zelf keuzes kunt maken.',
    introFeatures: [
        'Sim 1 — Bouw je advertentieprofiel en zie hoe nauwkeurig het wordt',
        'Sim 2 — Check je iPad-instellingen en hun impact',
        'Sim 3 — Ontdek wat de filterbubbel je verbergt',
    ],
    computeVisuals,
    simulations: [
        {
            id: 'advertentieprofiel',
            title: 'Jouw advertentieprofiel',
            description:
                'Speel met kijktijd, likes en locatie. Zie hoe nauwkeurig het platform jou kan inschatten.',
            visualType: 'meter',
            maxScore: 30,
            parameters: [
                {
                    id: 'kijktijd',
                    label: 'Kijktijd per video',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'likes',
                    label: 'Hoe vaak je iets liket',
                    type: 'slider',
                    min: 0,
                    max: 2,
                    step: 1,
                    default: 0,
                },
                {
                    id: 'locatie',
                    label: 'Locatie delen ingeschakeld',
                    type: 'toggle',
                    defaultToggle: false,
                },
            ],
            questions: [
                {
                    id: 'ap1-q1',
                    question:
                        'Waarom is kijktijd een waardevollere datapunt voor platforms dan likes?',
                    type: 'multiple-choice',
                    options: [
                        'Kijktijd wordt niet bijgehouden — alleen likes tellen',
                        'Kijktijd is moeilijker te manipuleren — als je lang kijkt, vind je het echt interessant',
                        'Likes zijn volledig anoniem voor platforms',
                        'Kijktijd is hetzelfde als likes klikken',
                    ],
                    correctAnswer: 'Kijktijd is moeilijker te manipuleren — als je lang kijkt, vind je het echt interessant',
                    explanation:
                        'Je kunt vergeten te liken, maar kijktijd is automatisch gedrag. Als je 90% van een video kijkt, is dat een betrouwbaar signaal. Platforms gebruiken dit om een nauwkeuriger profiel te maken.',
                    points: 10,
                },
                {
                    id: 'ap1-q2',
                    question:
                        'Wat betekent het als een platform jouw gedrag kan "voorspellen"?',
                    type: 'multiple-choice',
                    options: [
                        'Het platform weet wat jij gaat doen voordat jij het zelf weet',
                        'Het platform gokt altijd en heeft nooit gelijk',
                        'Voorspellen is alleen mogelijk bij volwassenen',
                        'Het betekent dat het platform jouw berichten leest',
                    ],
                    correctAnswer: 'Het platform weet wat jij gaat doen voordat jij het zelf weet',
                    explanation:
                        'Met genoeg data over jouw gedrag kan een algoritme berekenen welke video je als volgende gaat kijken, welk product je gaat kopen, of wat voor advertentie je aanklikt. Dit is hoe aanbevelingsalgoritmes werken.',
                    points: 10,
                },
                {
                    id: 'ap1-q3',
                    question:
                        'Wat is de KANS van een goed gepersonaliseerd platform — niet alleen het risico?',
                    type: 'multiple-choice',
                    options: [
                        'Er zijn geen voordelen aan personalisatie',
                        'Je vindt sneller content die je interessant vindt, wat tijd bespaart',
                        'Personalisatie beschermt je automatisch tegen nepnieuws',
                        'Je krijgt gratis toegang tot betaalde diensten',
                    ],
                    correctAnswer: 'Je vindt sneller content die je interessant vindt, wat tijd bespaart',
                    explanation:
                        'Personalisatie heeft echte voordelen: relevante content, minder zoeken, betere aanbevelingen. Het gaat erom dat je weet dat het gebeurt en bewust kunt kiezen hoeveel data je geeft.',
                    points: 10,
                },
            ],
        },
        {
            id: 'ipad-instellingen',
            title: 'Jouw iPad-instellingen checken',
            description:
                'Stel in hoeveel apps toegang hebben tot je locatie, camera en microfoon. Zie de impact op jouw privacy.',
            visualType: 'bar-chart',
            maxScore: 40,
            parameters: [
                {
                    id: 'locatie-apps',
                    label: 'Apps met locatietoegang (altijd)',
                    type: 'slider',
                    min: 0,
                    max: 3,
                    step: 1,
                    default: 1,
                },
                {
                    id: 'camera-apps',
                    label: 'Apps met cameratoegang',
                    type: 'slider',
                    min: 0,
                    max: 3,
                    step: 1,
                    default: 1,
                },
                {
                    id: 'microfoon-apps',
                    label: 'Apps met microfoontoegang',
                    type: 'slider',
                    min: 0,
                    max: 3,
                    step: 1,
                    default: 1,
                },
            ],
            questions: [
                {
                    id: 'ip1-q1',
                    question:
                        'Welk type toegang is gevaarlijker: "Alleen bij gebruik van de app" of "Altijd"?',
                    type: 'multiple-choice',
                    options: [
                        '"Alleen bij gebruik" — dan ziet de app meer',
                        '"Altijd" — de app kan jouw locatie bijhouden ook als je hem niet gebruikt',
                        'Ze zijn even gevaarlijk',
                        'Geen van beide is gevaarlijk',
                    ],
                    correctAnswer: '"Altijd" — de app kan jouw locatie bijhouden ook als je hem niet gebruikt',
                    explanation:
                        '"Altijd" betekent dat een app continu jouw locatie bijhoudt, zelfs als je de app niet open hebt. Dit geeft een compleet beeld van jouw dagelijkse bewegingen.',
                    points: 15,
                },
                {
                    id: 'ip1-q2',
                    question:
                        'Je controleert je iPad en ziet dat een spelletjes-app toegang heeft tot je microfoon. Wat doe je?',
                    type: 'multiple-choice',
                    options: [
                        'Niets — alle apps mogen de microfoon gebruiken',
                        'Beoordeel of het spelletje de microfoon echt nodig heeft, en zo niet: toegang intrekken',
                        'Direct de app verwijderen',
                        'De iPad opnieuw opstarten',
                    ],
                    correctAnswer: 'Beoordeel of het spelletje de microfoon echt nodig heeft, en zo niet: toegang intrekken',
                    explanation:
                        'Vraag je altijd af: heeft deze app deze toegang écht nodig om te werken? Een spelletje zonder voice chat heeft geen reden om je microfoon te gebruiken. Toegang intrekken kost je niks.',
                    points: 15,
                },
                {
                    id: 'ip1-q3',
                    question:
                        'Waar ga je op je iPad om app-permissies te controleren?',
                    type: 'multiple-choice',
                    options: [
                        'Instellingen → Privacy & Beveiliging → [Soort toegang]',
                        'Instellingen → Algemeen → Over',
                        'App Store → Jouw account',
                        'Instellingen → Schermtijd',
                    ],
                    correctAnswer: 'Instellingen → Privacy & Beveiliging → [Soort toegang]',
                    explanation:
                        'Via Instellingen → Privacy & Beveiliging zie je per toegangstype (locatie, camera, microfoon) welke apps er toegang toe hebben — en kun je dat per app aanpassen.',
                    points: 10,
                },
            ],
        },
        {
            id: 'filterbubbel',
            title: 'De filterbubbel doorprikken',
            description:
                'Kies hoe actief aanbevelingen zijn ingesteld. Vergelijk wat jij ziet met wat er buiten jouw bubbel bestaat. Een filterbubbel (= je ziet online vooral wat bij je past) wordt gemaakt door een algoritme (= een set regels die de app gebruikt om te beslissen wat jij te zien krijgt).',
            visualType: 'comparison',
            maxScore: 30,
            parameters: [
                {
                    id: 'aanbevelingen',
                    label: 'Aanbevelingsalgoritme',
                    type: 'select',
                    options: ['Alles aan', 'Gedeeltelijk', 'Uitgeschakeld'],
                    defaultOption: 'Alles aan',
                },
            ],
            questions: [
                {
                    id: 'fb1-q1',
                    question: 'Wat is een filterbubbel?',
                    type: 'multiple-choice',
                    options: [
                        'Een beveiligingssetting op je browser',
                        'Een situatie waarbij algoritmes je steeds meer van hetzelfde laten zien, waardoor andere perspectieven verdwijnen',
                        'Een manier om ongewenste reclame te blokkeren',
                        'Een probleem dat alleen bij nepnieuwssites speelt',
                    ],
                    correctAnswer: 'Een situatie waarbij algoritmes je steeds meer van hetzelfde laten zien, waardoor andere perspectieven verdwijnen',
                    explanation:
                        'Algoritmes zijn ontworpen om jou betrokken te houden. Ze laten je steeds meer zien van wat je al leuk vindt — waardoor je minder in aanraking komt met andere meningen, nieuws of culturen.',
                    points: 10,
                },
                {
                    id: 'fb1-q2',
                    question:
                        'Wat kan er misgaan als je altijd alleen je eigen mening terugziet?',
                    type: 'multiple-choice',
                    options: [
                        'Niks — je eigen mening zien is juist fijn, dat maakt je blij',
                        'Als mensen steeds andere informatie zien, wordt het moeilijker om een gemeenschappelijke basis te vinden voor gesprekken en beslissingen',
                        'Filterbubbels maken internet duurder',
                        'Filterbubbels beschermen je juist tegen nepnieuws',
                    ],
                    correctAnswer: 'Als mensen steeds andere informatie zien, wordt het moeilijker om een gemeenschappelijke basis te vinden voor gesprekken en beslissingen',
                    explanation:
                        'Als iedereen zijn eigen informatiebel heeft, praten mensen langs elkaar heen. Gezamenlijke feiten zijn de basis van democratische discussie — filterbubbels ondermijnen dat.',
                    points: 10,
                },
                {
                    id: 'fb1-q3',
                    question:
                        'Welke strategie helpt het meest om bewust uit je filterbubbel te stappen?',
                    type: 'multiple-choice',
                    options: [
                        'Social media helemaal verwijderen',
                        'Bewust zoeken naar bronnen en meningen die je normaal niet tegenkomt',
                        'Alleen gevestigde nieuwsmedia volgen',
                        'Je algoritme-instellingen uitschakelen lost alles op',
                    ],
                    correctAnswer: 'Bewust zoeken naar bronnen en meningen die je normaal niet tegenkomt',
                    explanation:
                        'Zelfs met algoritmes uitgeschakeld blijf je geneigd dezelfde bronnen op te zoeken. Bewuste keuze is effectiever: zoek actief andere perspectieven op en vergelijk ze met wat je al weet.',
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
            title: 'Privacy Expert',
            color: '#202023',
        },
        {
            minScore: 70,
            emoji: '🪞',
            title: 'Bewuste Digitale Burger',
            color: '#ff3c21',
        },
        {
            minScore: 50,
            emoji: '🔍',
            title: 'Data Detective',
            color: '#202023',
        },
        {
            minScore: 25,
            emoji: '💡',
            title: 'Startende Digitale Burger',
            color: '#202023',
        },
        {
            minScore: 0,
            emoji: '📖',
            title: 'Aan het leren',
            color: '#202023',
        },
    ],
    takeaways: [
        'Jouw kijktijd is waardevoller voor platforms dan likes — het is moeilijker te manipuleren.',
        'Controleer regelmatig via Instellingen → Privacy & Beveiliging welke apps toegang hebben tot je locatie, camera en microfoon.',
        'Een filterbubbel laat je steeds meer van hetzelfde zien — bewust andere bronnen opzoeken is de tegenstrategie.',
        'Personalisatie heeft voordelen, maar weten dat het bestaat maakt je een bewustere gebruiker.',
        'Kleine privacykeuzes op je iPad kunnen grote gevolgen hebben voor wat platforms over jou weten.',
    ],
};

export default aiSpiegelConfig;
