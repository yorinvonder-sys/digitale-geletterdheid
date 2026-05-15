import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const apiArchitectConfig: BuilderCanvasConfig = {
    missionId: 'api-architect',
    title: 'API Architect',
    introEmoji: '🔌',
    introTitle: 'Ontwerp een professionele REST API',
    introDescription:
        'In deze missie ontwerp je een complete REST API voor een huiswerk-planner startup. Je leert hoe APIs de communicatie tussen frontend en backend regelen, welke endpoints je nodig hebt en hoe je ze documenteert.',
    introFeatures: [
        'Begrijp wat een REST API is en hoe het werkt',
        'Ontwerp endpoints met de juiste HTTP-methodes',
        'Schrijf API-documentatie zoals een professional',
        'Bedenk hoe je de API beveiligt met authenticatie',
    ],
    enableChat: true,
    chatRoleId: 'api-architect',
    previewType: 'text-preview',
    steps: [
        {
            id: 'api-basics',
            title: 'REST API-principes begrijpen',
            description:
                'Een API (Application Programming Interface) is een afgesproken manier voor apps om met elkaar te praten. REST is de meest gebruikte stijl. Je communiceert via HTTP-verzoeken met specifieke methodes en ontvangt data terug in JSON-formaat.',
            instruction:
                'Leg in eigen woorden uit: 1) Wat is een API en waarom is het nodig? (Gebruik het voorbeeld van een restaurant: jij bent de klant, de keuken is de database, de ober is de API), 2) Wat doen de 4 HTTP-methodes GET, POST, PUT en DELETE? Koppel elk aan een echt voorbeeld (bijv. GET = ophalen van huiswerktaken), 3) Wat is JSON en waarom gebruiken APIs het?',
            tip: 'REST-APIs werken altijd stateless: elke aanvraag bevat alle informatie die nodig is. De server onthoudt niets tussen aanvragen.',
            checklistItems: [
                { id: 'api-uitleg', label: 'Ik heb uitgelegd wat een API is met een analogie' },
                { id: 'http-methodes', label: 'GET, POST, PUT en DELETE zijn uitgelegd met voorbeelden' },
                { id: 'json', label: 'Ik heb uitgelegd wat JSON is' },
            ],
            textPrompt: 'Schrijf je uitleg van REST API-principes',
        },
        {
            id: 'endpoints-ontwerpen',
            title: 'Endpoints ontwerpen',
            description:
                'Een endpoint is een URL waarop je een API-verzoek kunt sturen. Goede endpoint-namen zijn logisch, consistent en beschrijven altijd een resource (zelfstandig naamwoord), niet een actie. Zo is `/taken` goed, maar `/getTaak` is slecht REST-design.',
            instruction:
                'Ontwerp de endpoints voor een huiswerk-planner API. Maak een tabel met: Endpoint-URL, HTTP-methode, Beschrijving, en Voorbeeld van request-body (indien POST of PUT). Ontwerp minimaal 6 endpoints, verdeeld over de resources: `taken` en `gebruikers`. Geef ook de HTTP-statuscodes aan die elk endpoint teruggeeft bij succes en bij een fout.',
            tip: 'Gebruik altijd meervoud voor resource-namen: `/taken` niet `/taak`. En houd nesting beperkt: `/gebruikers/{id}/taken` is prima, maar `/school/{id}/klassen/{id}/leerlingen/{id}/taken` is te diep.',
            checklistItems: [
                { id: 'zes-endpoints', label: 'Ik heb minimaal 6 endpoints ontworpen' },
                { id: 'resource-namen', label: 'Endpoint-namen zijn meervoud zelfstandige naamwoorden' },
                { id: 'statuscodes', label: 'Succes- en fout-statuscodes zijn aangegeven' },
                { id: 'request-body', label: 'POST en PUT endpoints hebben een voorbeeld request-body' },
            ],
            textPrompt: 'Ontwerp je API-endpoints hier',
        },
        {
            id: 'authenticatie',
            title: 'Beveiliging met authenticatie',
            description:
                'Een open API is een gevaarlijk ding. Zonder beveiliging kan iedereen data ophalen, aanpassen of verwijderen. REST APIs beveiligen we standaard met tokens: een gebruiker logt in en krijgt een token terug, dat hij bij elk volgend verzoek meestuurt.',
            instruction:
                'Beschrijf hoe authenticatie werkt in jouw API. Leg uit: 1) Hoe logt een gebruiker in? (welk endpoint, welke data stuur je mee?), 2) Wat krijgt de gebruiker terug na succesvolle login? (JWT of sessiesleutel), 3) Hoe gebruikt de app dit token bij volgende verzoeken? (Authorization header), 4) Welke endpoints zijn openbaar en welke vereisen authenticatie?',
            tip: 'JWT (JSON Web Token) is de standaard voor API-authenticatie. Het token bevat versleuteld: wie je bent en wanneer het verloopt. De server kan het controleren zonder database te raadplegen.',
            checklistItems: [
                { id: 'login-endpoint', label: 'Het login-endpoint is beschreven' },
                { id: 'token', label: 'Uitgelegd welk token de gebruiker terugkrijgt' },
                { id: 'header', label: 'Beschreven hoe het token bij verzoeken wordt meegestuurd' },
                { id: 'openbaar-auth', label: 'Onderscheid tussen openbare en beveiligde endpoints' },
            ],
            textPrompt: 'Beschrijf de authenticatie van je API',
        },
        {
            id: 'documentatie',
            title: 'API-documentatie schrijven',
            description:
                'Een API zonder documentatie is waardeloos voor andere developers. Goede API-documentatie beschrijft elk endpoint zo duidelijk dat iemand die jou nooit heeft gesproken er direct mee aan de slag kan.',
            instruction:
                'Schrijf de documentatie voor 2 endpoints uit je ontwerp. Gebruik dit formaat voor elk: Endpoint, Methode, Beschrijving, Request-body (met JSON-voorbeeld), Response bij succes (met JSON-voorbeeld en statuscode), Response bij fout (met foutmelding en statuscode). Schrijf de documentatie in het Engels — dat is de internationale standaard.',
            tip: 'Tools als Swagger/OpenAPI genereren automatisch documentatie vanuit je code. Maar eerst moet je begrijpen hoe documentatie eruitziet — dan begrijp je ook de tools beter.',
            checklistItems: [
                { id: 'twee-endpoints-gedoc', label: 'Twee endpoints zijn volledig gedocumenteerd' },
                { id: 'json-voorbeelden', label: 'Request en response zijn als JSON-voorbeeld uitgeschreven' },
                { id: 'fout-response', label: 'Foutresponses zijn beschreven voor beide endpoints' },
                { id: 'engels', label: 'Documentatie is geschreven in het Engels' },
            ],
            textPrompt: 'Schrijf je API-documentatie',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'API Master', color: '#D7C95F' },
        { minScore: 70, emoji: '🔌', title: 'Backend Architect', color: '#5F947D' },
        { minScore: 50, emoji: '📡', title: 'Endpoint Builder', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende API Bouwer', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je begrijpt hoe een REST API werkt en wat de 4 HTTP-methodes betekenen',
        'Je kunt endpoints ontwerpen met de juiste namen, methodes en statuscodes',
        'Je weet hoe authenticatie met tokens werkt in een API',
        'Je kunt API-documentatie schrijven die andere developers direct kunnen gebruiken',
        'Je ziet hoe de frontend en backend via een API met elkaar communiceren',
    ],
};

export default apiArchitectConfig;
