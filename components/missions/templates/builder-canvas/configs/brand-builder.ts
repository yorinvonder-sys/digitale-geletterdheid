import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const brandBuilderConfig: BuilderCanvasConfig = {
    missionId: 'brand-builder',
    title: 'Brand Builder',
    introEmoji: '🎨',
    introTitle: 'Ontwerp een merkidentiteit',
    introDescription:
        'In deze missie word jij de designer voor een startup die een nieuwe visuele identiteit nodig heeft. Je kiest kleuren, lettertypen en bedenkt een logo-concept. Aan het einde heb je een complete merkidentiteit die je kunt presenteren.',
    introFeatures: [
        'Analyseer bestaande merken en hun kleurkeuzes',
        'Kies een kleurenpalet dat past bij de merkwaarden',
        'Ontwerp een logo-concept met uitleg',
        'Stel een huisstijlgids samen',
    ],
    enableChat: true,
    chatRoleId: 'brand-builder',
    previewType: 'text-preview',
    steps: [
        {
            id: 'merkanalyse',
            title: 'Merk en doelgroep bepalen',
            description:
                'Elk merk heeft een persoonlijkheid. Nike is krachtig en gedurfd. Apple is strak en minimalistisch. Voordat je ook maar één kleur kiest, moet je weten wie je merk is en voor wie het bedoeld is.',
            instruction:
                'Kies een startup die je wilt ontwerpen (bijv. duurzame sneakers, gezond eten voor jongeren, een tech-tool voor leerlingen). Beschrijf: 1) Wat doet het bedrijf?, 2) Wie is de doelgroep (leeftijd, interesses)?, 3) Drie woorden die de merkpersoonlijkheid beschrijven (bijv. "fris, duurzaam, eerlijk"). Leg uit waarom deze woorden passen.',
            tip: 'Drie merkwoorden zijn genoeg. Als je tien woorden kiest, heeft je merk geen duidelijk karakter meer.',
            checklistItems: [
                { id: 'startup-gekozen', label: 'Ik heb een concrete startup beschreven' },
                { id: 'doelgroep', label: 'Ik heb de doelgroep beschreven met leeftijd en interesses' },
                { id: 'merkwoorden', label: 'Ik heb 3 merkwoorden gekozen met uitleg' },
            ],
            textPrompt: 'Beschrijf je merk en doelgroep',
        },
        {
            id: 'kleurenpalet',
            title: 'Kleurenpalet kiezen',
            description:
                'Kleuren roepen emoties op. Rood geeft energie en urgentie, blauw straalt vertrouwen uit, groen staat voor natuur en duurzaamheid. Merken kiezen kleuren met zorg — elke kleur communiceert iets aan de klant.',
            instruction:
                'Kies een kleurenpalet van 3 tot 5 kleuren. Geef van elke kleur de hexadecimale kleurcode (bijv. #2ECC71) en leg uit waarom je deze kleur hebt gekozen in relatie tot je merkwoorden. Verdeel de kleuren ook in rollen: primaire kleur (meest zichtbaar), secundaire kleur en accentkleur.',
            tip: 'Gratis tools als Coolors.co of Adobe Color helpen je bij het kiezen van kleuren die goed samenwerken. Het oog wil ook rust: gebruik niet te veel felle kleuren tegelijk.',
            checklistItems: [
                { id: 'drie-kleuren', label: 'Ik heb minimaal 3 kleuren met hexcodes gekozen' },
                { id: 'kleur-motivatie', label: 'Bij elke kleur staat een uitleg waarom die past' },
                { id: 'kleur-rollen', label: 'Ik heb primaire, secundaire en accentkleur benoemd' },
            ],
            textPrompt: 'Beschrijf je kleurenpalet hier',
            reflectionQuestion: {
                question: 'Waarom is kleurcontrast belangrijk voor je merk?',
                options: ['Het maakt je logo groter', 'Het verbetert leesbaarheid en toegankelijkheid', 'Het maakt de website sneller', 'Het is alleen belangrijk voor print'],
                correctIndex: 1,
                explanation: 'Goed kleurcontrast zorgt dat tekst leesbaar is voor iedereen, inclusief mensen met een visuele beperking. Dit is ook een wettelijke vereiste (WCAG).',
                bonusPoints: 5,
            },
        },
        {
            id: 'logo-concept',
            title: 'Logo-concept ontwerpen',
            description:
                'Een logo is het gezicht van een merk. Het staat op elk product, elke advertentie, elke verpakking. Een goed logo is simpel, herkenbaar en werkt in zwart-wit én in kleur.',
            instruction:
                'Beschrijf je logo-concept in woorden (je hoeft niets te tekenen). Vertel: 1) Welk symbool of icoon gebruik je en waarom?, 2) Is het een woordmerk (alleen tekst), beeldmerk (alleen symbool) of combinatiemerk?, 3) Welk lettertype past bij je merkpersoonlijkheid (serieus/speels/modern)? Leg bij elk punt de keuze uit.',
            tip: 'De beste logo\'s zijn eenvoudig. De Nike swoosh is één streep. De Apple is een gebeten appel. Simpel = memorabel.',
            checklistItems: [
                { id: 'symbool', label: 'Ik heb een symbool of concept beschreven met motivatie' },
                { id: 'logosoort', label: 'Ik heb gekozen tussen woord-, beeld- of combinatiemerk' },
                { id: 'lettertype', label: 'Ik heb een letterkeuze gemaakt en uitgelegd' },
            ],
            textPrompt: 'Beschrijf je logo-concept',
        },
        {
            id: 'huisstijl',
            title: 'Huisstijlgids samenstellen',
            description:
                'Een huisstijlgids (brand guide) zorgt dat iedereen het merk consistent toepast — op de website, in flyers, op social media. Grote bedrijven hebben documenten van tientallen pagina\'s. Jij maakt een compacte versie.',
            instruction:
                'Schrijf een mini-huisstijlgids met: 1) Samenvatting van kleuren (hexcodes + rollen), 2) Lettertype(n) voor titels en voor lopende tekst, 3) Één doe en één niet-doen voor het gebruik van het logo (bijv. "Gebruik het logo altijd op een witte of lichte achtergrond" / "Verander nooit de kleur van het logo"). Leg uit hoe de huisstijl de merkwaarden weerspiegelt.',
            tip: 'Een heldere huisstijlgids bespaart later discussies. Als de regels opgeschreven zijn, maakt iedereen dezelfde keuzes.',
            checklistItems: [
                { id: 'kleuren-overzicht', label: 'Alle kleuren staan met hexcode en rol in de gids' },
                { id: 'lettertypes', label: 'Lettertype voor titels én voor lopende tekst benoemd' },
                { id: 'do-dont', label: 'Er staat minstens 1 "doe dit wel" en 1 "doe dit niet"' },
                { id: 'merkwaarden-link', label: 'Ik heb uitgelegd hoe de stijl de merkwaarden weerspiegelt' },
            ],
            textPrompt: 'Schrijf je mini-huisstijlgids',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Merkarchitect', color: '#D7C95F' },
        { minScore: 70, emoji: '🎨', title: 'Brand Designer', color: '#5F947D' },
        { minScore: 50, emoji: '🖌️', title: 'Kleurenkenner', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Merkbouwer', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je weet hoe je de persoonlijkheid van een merk in woorden kunt vangen',
        'Je begrijpt hoe kleurpsychologie werkt en hoe je een kleurenpalet opbouwt',
        'Je kunt een logo-concept beschrijven en onderbouwen',
        'Je hebt een mini-huisstijlgids gemaakt die consistent gebruik van het merk garandeert',
        'Je ziet het verschil tussen een willekeurige ontwerpcombinatie en een doordachte merkidentiteit',
    ],
};

export default brandBuilderConfig;
