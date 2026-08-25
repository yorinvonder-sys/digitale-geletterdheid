import type { ToolGuideConfig } from '../ToolGuide';

const config: ToolGuideConfig = {
    missionId: 'mission-build',
    title: 'De Bouw',
    introEmoji: '🔨',
    introTitle: 'De Bouw',
    introDescription:
        'Je hebt een plan (De Blauwdruk) en een beeld bij je project (De Visie). Nu ga je het maken. Je kiest je gereedschap, bouwt de kern écht, laat iemand het proberen en zet het klaar om te delen.',
    introFeatures: [
        'Het gereedschap kiezen dat past bij jouw plan uit De Blauwdruk',
        'De kern van je project echt bouwen — het deel waaraan je ziet wat het is',
        'Je werk laten testen door een klasgenoot zonder dat je uitleg geeft',
        'Je product opslaan en deelbaar maken voor De Lancering',
    ],
    toolName: 'Bouwen & Testen',
    toolIcon: '🔨',
    steps: [
        {
            id: 'stap-1-gereedschap',
            title: 'Kies je gereedschap',
            instruction:
                'In periode 2 heb je met verschillende gereedschappen gewerkt. Eén ervan past bij het plan dat je in **De Blauwdruk** hebt gemaakt:\n- **Website Bouwer** — je maakt een website of een pagina\n- **Game Programmeur** — je maakt een game of iets waar je op kunt klikken\n- **AI Tekengame** — je maakt beelden met AI\n- **Verhalen Ontwerper** — je maakt een verhaal, script of tekst\n- **Slide Specialist** — je maakt een uitleg met beeld en tekst\n\nPak je plan uit De Blauwdruk erbij en kijk wat je wilde maken. Kies **één** gereedschap en schrijf op waarom dat past. Kies niet het gereedschap dat je het leukst vindt, maar het gereedschap waarmee je jouw plan kunt bouwen.',
            tip: 'Twijfel je tussen twee? Vraag jezelf af: met welke van de twee heb ik over een uur iets dat werkt? Dat is de goede.',
            checklistItems: [
                { id: 'gereedschap-gekozen', label: 'Ik heb opgeschreven welk gereedschap ik kies' },
                { id: 'plan-erbij', label: 'Ik heb mijn plan uit De Blauwdruk erbij gepakt en aangewezen welk onderdeel ik ga maken' },
                { id: 'waarom-opgeschreven', label: 'Ik heb in één zin opgeschreven waarom dit gereedschap bij dat onderdeel past' },
            ],
            verificationQuestion: {
                question: 'Je plan uit De Blauwdruk is een app waarmee klasgenoten hun huiswerk bijhouden. Welk gereedschap kies je?',
                options: [
                    'AI Tekengame, want mooie plaatjes trekken de aandacht',
                    'Website Bouwer, want daarmee maak je iets dat mensen echt kunnen openen en gebruiken',
                    'Verhalen Ontwerper, want je moet je idee goed kunnen uitleggen',
                    'Het gereedschap waar ik in periode 2 het hoogste cijfer voor had',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Kijk nog eens naar je plan uit De Blauwdruk: met welk gereedschap maak je iets dat mensen echt kunnen openen? Kies daarna opnieuw.',
                explanation:
                    'Klopt. Je kiest het gereedschap waarmee je jóuw plan kunt bouwen. Plaatjes en uitleg komen later, bij De Lancering. Nu maak je het ding zelf.',
            },
        },
        {
            id: 'stap-2-kern',
            title: 'Bouw de kern',
            instruction:
                'Je hoeft niet je hele project af te maken. Je maakt **de kern**: het onderdeel waaraan iemand ziet wat jouw project is. Zo ziet dat eruit:\n- Maak je een **website**? De kern is **één pagina die werkt**, met jouw eigen tekst erop — niet vijf lege pagina\'s.\n- Maak je een **game**? De kern is **één level dat je van begin tot eind kunt spelen**.\n- Maak je een **filmpje of verhaal**? De kern is **één scène die af is**, met beeld en geluid.\n\nWerk met je eigen inhoud. Voorbeeldtekst zoals "Lorem ipsum" of "Titel hier" telt niet mee — dan is het nog leeg.',
            tip: 'Loop je vast op een detail, zoals een kleur of een lettertype? Laat het staan en ga door. De kern moet werken, niet mooi zijn. Mooi maken kan altijd nog.',
            checklistItems: [
                { id: 'kern-werkt', label: 'Mijn kern werkt van begin tot eind — ik kan hem zelf openen en doorlopen' },
                { id: 'eigen-inhoud', label: 'Er staat mijn eigen tekst, beeld of geluid in, geen voorbeeldtekst of lege plek' },
                { id: 'af-en-nog-niet', label: 'Ik kan aanwijzen welk deel af is en welk deel nog niet' },
            ],
            verificationQuestion: {
                question: 'Je maakt een website voor je project. Welke van deze vier is "de kern"?',
                options: [
                    'Vijf pagina\'s met een menu, waar op elke pagina nog "tekst volgt" staat',
                    'Eén pagina die werkt, met jouw eigen tekst en één afbeelding erop',
                    'Een schets van de website op papier',
                    'De kleuren en het lettertype die je gaat gebruiken',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Lees de uitleg boven deze stap nog eens: welk antwoord kun je zelf van begin tot eind openen en gebruiken? Kies daarna opnieuw.',
                explanation:
                    'Precies. De kern is het kleinste stuk dat écht werkt en waaraan iemand ziet wat je project is. Vijf lege pagina\'s zijn nog niets; één werkende pagina wel.',
            },
        },
        {
            id: 'stap-3-testen',
            title: 'Laat het iemand proberen',
            instruction:
                'Nu ga je testen. Vraag een klasgenoot om jouw kern te gebruiken. De regel: **jij zegt niets**. Geen "je moet daar klikken", geen "dat komt nog". Je kijkt alleen en je luistert.\n\nWaar hapert de ander? Waar aarzelt hij, klikt hij verkeerd, of vraagt hij "wat moet ik nu?" Schrijf **één ding** op dat hij niet snapte — in zijn eigen woorden, niet in die van jou. Dat ene ding pas je daarna aan.\n\nMerk je dat je wilt uitleggen? Dan heb je precies het punt gevonden dat je moet aanpassen. Jouw uitleg staat straks niet naast je project.',
            tip: '"Hij snapte het wel" is geen resultaat — dan heb je waarschijnlijk toch geholpen, of niet goed gekeken. Let op wat zijn handen doen, niet op wat hij zegt.',
            checklistItems: [
                { id: 'ander-geprobeerd', label: 'Een klasgenoot heeft mijn kern gebruikt terwijl ik niets uitlegde' },
                { id: 'punt-genoteerd', label: 'Ik heb één ding opgeschreven dat hij niet snapte, in zijn eigen woorden' },
                { id: 'aangepast', label: 'Ik heb dat ene ding aangepast en kan aanwijzen wat ik veranderd heb' },
            ],
            verificationQuestion: {
                question: 'Je klasgenoot zoekt tijdens de test tien seconden naar de startknop. Wat doe je?',
                options: [
                    'Je wijst de knop aan, anders duurt het te lang',
                    'Je zegt niets, schrijft op dat de startknop niet te vinden was, en maakt hem daarna duidelijker',
                    'Je legt uit dat de knop logisch staat als je het ontwerp kent',
                    'Je vraagt een andere klasgenoot die je project al kent',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Lees de testregel in de opdracht terug: wat mag jij tijdens de test wel en niet doen? Kies daarna opnieuw.',
                explanation:
                    'Goed. Dat aarzelen ís je testresultaat. Als jij de knop aanwijst, weet je nog steeds niet of een ander hem zelf kan vinden — en straks sta jij er niet bij.',
            },
        },
        {
            id: 'stap-4-delen',
            title: 'Zet het klaar om te delen',
            instruction:
                'Je kern is af en aangepast. Nu zorg je dat een ander erbij kan zonder jou.\n\n1. Sla je werk op **op de plek die je in De Blauwdruk hebt afgesproken**, bijvoorbeeld je projectmap in de cloud.\n2. Geef het een naam waaraan je ziet wat het is — dus niet "eindversie2def".\n3. Maak het deelbaar en **test de link zelf**: open hem in een privévenster of op een ander apparaat. Werkt hij daar ook?\n4. Zet de link klaar. Bij **De Lancering** heb je hem nodig voor je flyer en je presentatie.\n\nZet geen namen, foto\'s of gegevens van anderen in je product zonder toestemming — dat leerde je in periode 3.',
            tip: 'Een link die alleen op jouw laptop werkt, is geen link. Testen in een privévenster is de snelste manier om dat te merken.',
            checklistItems: [
                { id: 'opgeslagen', label: 'Mijn werk staat op de opslagplek die ik in De Blauwdruk heb afgesproken' },
                { id: 'naam-duidelijk', label: 'De naam van mijn bestand of project zegt wat het is' },
                { id: 'link-getest', label: 'Ik heb de deellink zelf geopend in een privévenster of op een ander apparaat en hij werkte' },
                { id: 'klaar-voor-lancering', label: 'De link staat klaar zodat ik hem bij De Lancering kan gebruiken' },
            ],
            teacherCheck:
                'Laat je docent je échte product zien. De docent opent je deellink zelf, op zijn eigen scherm, zonder dat jij uitlegt hoe het werkt. De docent controleert: het opent en werkt, er staat jouw eigen inhoud in (geen voorbeeldtekst), en je kunt aanwijzen wat je na de test van je klasgenoot hebt veranderd.',
            verificationQuestion: {
                question: 'Je deelt de link naar je project met je docent. Bij jou werkt hij, maar je docent krijgt "geen toegang". Wat is er waarschijnlijk aan de hand?',
                options: [
                    'De docent gebruikt een verkeerde browser',
                    'Het bestand staat nog alleen bij jou en is niet gedeeld — jij was al ingelogd, dus jij zag het verschil niet',
                    'De link is na een dag verlopen',
                    'Je project is te groot om te delen',
                ],
                correctIndex: 1,
                allowRetry: true,
                retryHint:
                    'Nog niet. Open je eigen deellink eens in een privévenster en kijk wat er dan gebeurt. Kies daarna opnieuw.',
                explanation:
                    'Klopt. Jij was al ingelogd, dus bij jou werkte het. Daarom test je een deellink altijd in een privévenster of op een ander apparaat — dan zie je wat een ander ziet.',
            },
        },
    ],
    maxScore: 60,
    badges: [
        {
            minScore: 55,
            emoji: '🏆',
            title: 'Bouwmeester',
            color: '#202023',
        },
        {
            minScore: 40,
            emoji: '🔨',
            title: 'Bouwer',
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
        'Je kunt uit de gereedschappen van dit schooljaar het gereedschap kiezen dat bij je plan past',
        'Je weet wat de kern van een project is: het kleinste deel dat echt werkt',
        'Je hebt je eigen inhoud in een werkend product gezet in plaats van een lege opzet',
        'Je hebt je werk laten testen door iemand anders zonder uitleg te geven',
        'Je kunt uit zo\'n test één concreet verbeterpunt halen en dat doorvoeren',
        'Je kunt je werk zo opslaan en delen dat een ander erbij kan zonder jouw hulp',
    ],
};

export default config;
