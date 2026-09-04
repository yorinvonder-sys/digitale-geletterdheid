import type { AcademyLesson } from '../types';

export const FUNDAMENT_LESSONS: AcademyLesson[] = [
  {
    id: 'main-entry',
    number: 1,
    track: 'fundament',
    title: 'Waar start de website?',
    subtitle: 'Van browser naar React',
    objective: 'Je kunt aanwijzen welk bestand React start en waarom daar een root-element voor nodig is.',
    durationMinutes: 10,
    whyItMatters: 'Bij een fout tijdens het opstarten weet je waar de eerste code wordt uitgevoerd en welke onderdelen nog niet actief kunnen zijn.',
    remember: 'main.tsx is de startknop: het maakt de React-root en rendert App.',
    file: 'src/main.tsx',
    code: `const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);`,
    explanation: [
      'De browser laadt eerst de HTML-pagina. Daarin staat een leeg element met het id root. React gebruikt dat element als vaste plek om de complete interface op te bouwen.',
      'main.tsx maakt één React-root, plaatst App daarin en zet een algemene ErrorBoundary om de applicatie. Daardoor kan een onverwachte fout gecontroleerd worden opgevangen.',
    ],
    concepts: [
      { term: 'Entry point', meaning: 'Het eerste applicatiebestand dat wordt uitgevoerd.', example: 'src/main.tsx' },
      { term: 'Root-element', meaning: 'Het HTML-element waarin React de interface plaatst.', example: `<div id='root'></div>` },
      { term: 'Renderen', meaning: 'Componenten omzetten naar zichtbare interface.', example: `root.render(<App />)` },
    ],
    dataFlow: [
      { from: 'Browser', to: 'index.html', data: 'Pagina-aanvraag', reason: 'De browser heeft een document nodig.' },
      { from: 'index.html', to: 'main.tsx', data: 'Moduleverwijzing', reason: 'De JavaScript-app moet starten.' },
      { from: 'main.tsx', to: 'App', data: 'React-component', reason: 'De applicatieboom wordt opgebouwd.' },
    ],
    pitfalls: [
      'Als het root-element ontbreekt, kan React nergens worden gemonteerd.',
      'Een fout vóór de ErrorBoundary actief is, kan de hele start blokkeren.',
    ],
    practice: {
      title: 'Vind de startlijn',
      instruction: 'Open src/main.tsx en wijs de drie regels aan die het root-element zoeken, de React-root maken en App renderen.',
      checklist: ['Ik vind getElementById', 'Ik vind createRoot', 'Ik vind <App />'],
    },
    aiPrompt: `Leg src/main.tsx uit als een stroom van browser naar zichtbare interface. Noem per stap wat binnenkomt, wat gebeurt en wat de mogelijke fout is.`,
    quiz: {
      question: 'Wat doet main.tsx als belangrijkste taak?',
      options: ['Alle missies uit de database laden', 'React starten en App in de pagina plaatsen', 'De gebruiker een rol geven'],
      correctIndex: 1,
      explanation: 'main.tsx initialiseert React en rendert de hoofdcomponent. Missies en rollen komen pas later.',
    },
    visual: {
      kind: 'flow',
      title: 'De opstartstroom',
      caption: 'Lees van links naar rechts: elk blok kan pas starten nadat het vorige klaar is.',
      nodes: [
        { label: 'Browser', detail: 'Opent DGskills.app', accent: 'blue' },
        { label: 'index.html', detail: 'Bevat #root', accent: 'teal' },
        { label: 'main.tsx', detail: 'Start React', accent: 'acid' },
        { label: '<App />', detail: 'Start de componentboom', accent: 'purple' },
      ],
    },
  },
  {
    id: 'app-shell',
    number: 2,
    track: 'fundament',
    title: 'Waarom is App.tsx zo klein?',
    subtitle: 'Een bewuste doorgeeflaag',
    objective: 'Je begrijpt waarom App.tsx vrijwel alleen AppRouter rendert.',
    durationMinutes: 8,
    whyItMatters: 'Een kleine hoofdcomponent maakt verantwoordelijkheden zichtbaar: starten gebeurt in main.tsx en routekeuze gebeurt in AppRouter.',
    remember: 'App.tsx is een dunne schakel tussen het startbestand en de router.',
    file: 'src/app/App.tsx',
    code: `function App() {
  return <AppRouter />;
}

export default App;`,
    explanation: [
      'App.tsx bevat bewust geen dashboardlogica, authenticatie of databaseverzoeken. Het enige doel is de applicatie doorgeven aan AppRouter.',
      'Deze scheiding maakt het makkelijker om bij een probleem eerst te bepalen of het in de start, routekeuze of ingelogde applicatie zit.',
    ],
    concepts: [
      { term: 'Dunne laag', meaning: 'Een bestand met één kleine, duidelijke verantwoordelijkheid.', example: 'App rendert alleen AppRouter.' },
      { term: 'Delegatie', meaning: 'Werk bewust doorgeven aan een gespecialiseerd onderdeel.', example: 'App geeft routekeuze door.' },
      { term: 'Component', meaning: 'Een herbruikbaar deel van de React-interface.', example: '<AppRouter />' },
    ],
    dataFlow: [
      { from: 'main.tsx', to: 'App.tsx', data: '<App />', reason: 'De hoofdcomponent wordt gestart.' },
      { from: 'App.tsx', to: 'AppRouter.tsx', data: '<AppRouter />', reason: 'De router krijgt de routeverantwoordelijkheid.' },
      { from: 'AppRouter', to: 'Pagina', data: 'Gekozen hoofdscherm', reason: 'De juiste omgeving moet zichtbaar worden.' },
    ],
    pitfalls: [
      'Logica toevoegen aan App.tsx maakt de routeverantwoordelijkheid onduidelijk.',
      'Een importfout naar AppRouter blokkeert alle routes tegelijk.',
    ],
    practice: {
      title: 'Leg de delegatie uit',
      instruction: 'Omschrijf in één zin waarom App.tsx niet zelf controleert of de gebruiker is ingelogd.',
      checklist: ['Ik noem AppRouter', 'Ik noem scheiding van verantwoordelijkheden', 'Mijn uitleg is één zin'],
    },
    aiPrompt: `Vergelijk de verantwoordelijkheden van src/main.tsx, src/app/App.tsx en src/app/AppRouter.tsx in een tabel met maximaal drie regels.`,
    quiz: {
      question: 'Waarom bevat App.tsx bijna geen logica?',
      options: ['Omdat React grote componenten verbiedt', 'Omdat AppRouter de routekeuze beheert', 'Omdat de database nog leeg is'],
      correctIndex: 1,
      explanation: 'App.tsx delegeert de routekeuze. Dat is een ontwerpkeuze, geen beperking van React.',
    },
    visual: {
      kind: 'layers',
      title: 'Drie dunne opstartlagen',
      caption: 'Elke laag doet één ding en geeft daarna door.',
      nodes: [
        { label: 'main.tsx', detail: 'React starten', accent: 'blue' },
        { label: 'App.tsx', detail: 'Router renderen', accent: 'acid' },
        { label: 'AppRouter.tsx', detail: 'Route kiezen', accent: 'purple' },
      ],
    },
  },
  {
    id: 'router',
    number: 3,
    track: 'fundament',
    title: 'Wie kiest het juiste scherm?',
    subtitle: 'AppRouter als wegwijzer',
    objective: 'Je kunt uitleggen hoe het URL-pad en de inlogstatus samen het hoofdscherm bepalen.',
    durationMinutes: 15,
    whyItMatters: 'Wanneer een gebruiker op het verkeerde scherm belandt, ligt de oorzaak vaak in routeherkenning, authenticatie of een foutieve redirect.',
    remember: 'AppRouter koppelt het pad en de sessie aan een openbare, login- of ingelogde route.',
    file: 'src/app/AppRouter.tsx',
    code: `const AuthenticatedApp = React.lazy(() =>
  import('@/app/AuthenticatedApp')
    .then(module => ({ default: module.AuthenticatedApp }))
);`,
    explanation: [
      'AppRouter leest window.location.pathname en luistert naar wijzigingen. Daardoor kan de interface wisselen zonder dat de browser een volledige nieuwe pagina hoeft te laden.',
      'Zware onderdelen zoals AuthenticatedApp worden lazy geladen. Openbare bezoekers downloaden daardoor niet meteen alle code van het dashboard en de missies.',
    ],
    concepts: [
      { term: 'Route', meaning: 'Een URL-pad dat bij een scherm hoort.', example: '/login' },
      { term: 'Lazy loading', meaning: 'Code pas downloaden wanneer die nodig is.', example: 'React.lazy voor AuthenticatedApp' },
      { term: 'Redirect', meaning: 'De gebruiker naar een ander pad sturen.', example: 'Niet ingelogd naar /login' },
    ],
    dataFlow: [
      { from: 'Adresbalk', to: 'usePath', data: 'pathname', reason: 'De router moet weten welke route is gevraagd.' },
      { from: 'Auth-service', to: 'AppRouter', data: 'Gebruiker of null', reason: 'Privépagina’s vereisen een sessie.' },
      { from: 'AppRouter', to: 'React', data: 'Gekozen component', reason: 'Alleen het juiste scherm wordt gerenderd.' },
    ],
    pitfalls: [
      'Een redirect tijdens render kan React-fouten veroorzaken; navigatie hoort in een effect of event.',
      'Een ontbrekende fallback bij lazy loading kan een leeg scherm opleveren tijdens laden.',
    ],
    practice: {
      title: 'Volg drie routes',
      instruction: 'Zoek in AppRouter wat gebeurt bij /, /login en een ingelogde privéroute.',
      checklist: ['Ik vind de openbare route', 'Ik vind de loginroute', 'Ik vind AuthenticatedApp'],
    },
    aiPrompt: `Maak een beslisboom van AppRouter.tsx. Begin bij het URL-pad en eindig bij de component die wordt getoond. Vermeld ook loading en geen gebruiker.`,
    quiz: {
      question: 'Welke twee signalen zijn het belangrijkst voor AppRouter?',
      options: ['URL-pad en inlogstatus', 'XP en avatar', 'Schermbreedte en browserkleur'],
      correctIndex: 0,
      explanation: 'De router combineert het gevraagde pad met de vraag of een geldige gebruiker beschikbaar is.',
    },
    visual: {
      kind: 'tree',
      title: 'Routebeslissing',
      caption: 'De router vertakt op basis van pad en toegang.',
      nodes: [
        { label: 'URL-pad', detail: 'Wat vraagt de browser?', accent: 'blue', children: ['Openbaar', 'Login', 'Privé'] },
        { label: 'Openbaar', detail: 'Landing of informatie', accent: 'teal', children: ['ScholenLanding'] },
        { label: 'Login', detail: 'Aanmelden', accent: 'orange', children: ['Login'] },
        { label: 'Privé', detail: 'Sessie vereist', accent: 'purple', children: ['AuthenticatedApp'] },
      ],
    },
  },
  {
    id: 'authenticated-app',
    number: 4,
    track: 'fundament',
    title: 'De verkeersregelaar van de ingelogde app',
    subtitle: 'Rol, scherm en actieve module',
    objective: 'Je kunt beschrijven waarom AuthenticatedApp verschillende dashboards en missies kan tonen.',
    durationMinutes: 18,
    whyItMatters: 'Veel AI-wijzigingen raken dit bestand. Begrijpen welke state de schermkeuze stuurt voorkomt dat een kleine wijziging onverwacht meerdere gebruikersrollen breekt.',
    remember: 'AuthenticatedApp combineert gebruiker, navigatiestate en actieve module tot één zichtbaar hoofdscherm.',
    file: 'src/app/AuthenticatedApp.tsx',
    code: `const { user, loading, handleLogout } = useAuth();
const { activeModule, viewMode } = useNavigation({ user });

if (user.role === 'teacher' && viewMode === 'monitoring') {
  return <TeacherDashboard />;
}`,
    explanation: [
      'Het bestand haalt de ingelogde gebruiker op, beheert navigatiekeuzes en lazy-loadt zware onderdelen. Daarna bepaalt renderContent welk onderdeel zichtbaar wordt.',
      'De volgorde van controles is belangrijk. Een actieve missie moet bijvoorbeeld vóór het standaard leerlingdashboard worden afgehandeld, anders ziet de leerling het verkeerde scherm.',
    ],
    concepts: [
      { term: 'Orchestrator', meaning: 'Een component die meerdere onderdelen coördineert.', example: 'AuthenticatedApp' },
      { term: 'Rol', meaning: 'Het toegangstype van de gebruiker.', example: 'student, teacher, admin, developer' },
      { term: 'Actieve module', meaning: 'De missie of functie die nu geopend is.', example: 'prompt-master' },
    ],
    dataFlow: [
      { from: 'useAuth', to: 'AuthenticatedApp', data: 'user en loading', reason: 'Rol en identiteit bepalen toegang.' },
      { from: 'useNavigation', to: 'AuthenticatedApp', data: 'activeModule en viewMode', reason: 'De huidige plek in de app moet bekend zijn.' },
      { from: 'AuthenticatedApp', to: 'Dashboard of missie', data: 'Props en callbacks', reason: 'Het gekozen onderdeel krijgt context.' },
    ],
    pitfalls: [
      'Hooks na een vroege return plaatsen kan de React Rules of Hooks breken.',
      'Een nieuwe missie-id toevoegen zonder renderroute kan leiden tot een niet-openende kaart.',
    ],
    practice: {
      title: 'Maak een schermvolgorde',
      instruction: 'Schrijf de belangrijkste rendercontroles in de volgorde waarin AuthenticatedApp ze afhandelt.',
      checklist: ['Ik begin bij loading en user', 'Ik noem actieve missies', 'Ik eindig bij het standaarddashboard'],
    },
    aiPrompt: `Analyseer AuthenticatedApp.tsx als verkeersregelaar. Geef de renderprioriteit, gebruikte hooks en drie plekken waar een nieuwe feature per ongeluk bestaand gedrag kan breken.`,
    quiz: {
      question: 'Waarom is de volgorde van if-controles in AuthenticatedApp belangrijk?',
      options: ['Omdat CSS anders niet laadt', 'Omdat de eerste passende controle het zichtbare scherm bepaalt', 'Omdat TypeScript alleen de eerste if leest'],
      correctIndex: 1,
      explanation: 'De renderfunctie retourneert zodra een conditie klopt. Latere controles worden dan niet meer uitgevoerd.',
    },
    visual: {
      kind: 'flow',
      title: 'Van gebruiker naar scherm',
      caption: 'De eerste passende route bepaalt wat zichtbaar wordt.',
      nodes: [
        { label: 'useAuth', detail: 'Wie is ingelogd?', accent: 'blue' },
        { label: 'useNavigation', detail: 'Wat is actief?', accent: 'teal' },
        { label: 'renderContent', detail: 'Welke conditie klopt?', accent: 'acid' },
        { label: 'Scherm', detail: 'Dashboard, profiel, game of missie', accent: 'purple' },
      ],
    },
  },
  {
    id: 'folder-map',
    number: 5,
    track: 'fundament',
    title: 'Hoe lees je de mappenstructuur?',
    subtitle: 'Verantwoordelijkheid herkennen aan het pad',
    objective: 'Je kunt aan een bestandspad inschatten of code bij een feature, service, hook, configuratie of herbruikbaar component hoort.',
    durationMinutes: 14,
    whyItMatters: 'AI kan code technisch werkend op een onlogische plek zetten. Een goede mapkeuze maakt onderhoud en review eenvoudiger.',
    remember: 'Het pad vertelt meestal welk probleem het bestand oplost en wie het gebruikt.',
    file: 'src/',
    code: `src/
  app/          hoofdroute en ingelogde shell
  features/     productonderdelen
  components/   herbruikbare interface
  hooks/        herbruikbaar React-gedrag
  services/     data en externe systemen
  config/       vaste productinstellingen
  utils/        pure hulpfuncties`,
    explanation: [
      'Featurecode hoort zo dicht mogelijk bij het productonderdeel dat de code gebruikt. Studentendashboardcode staat daarom onder features/student en developerhulpmiddelen onder features/developer.',
      'Services praten met Supabase of andere systemen. Hooks combineren React-state en effecten. Config bevat vaste productkennis zoals curriculum en thema’s.',
    ],
    concepts: [
      { term: 'Feature', meaning: 'Een herkenbaar productonderdeel.', example: 'student, teacher, missions' },
      { term: 'Service', meaning: 'Een laag voor data of externe communicatie.', example: 'authService' },
      { term: 'Utility', meaning: 'Een algemene hulpfunctie zonder eigen scherm.', example: 'missionBuilder' },
    ],
    dataFlow: [
      { from: 'Featurecomponent', to: 'Hook', data: 'UI-behoefte', reason: 'Gedrag wordt herbruikbaar gemaakt.' },
      { from: 'Hook of feature', to: 'Service', data: 'Lees- of schrijfopdracht', reason: 'Datatoegang blijft uit de UI.' },
      { from: 'Config', to: 'Feature', data: 'Vaste productregels', reason: 'Productkennis heeft één bron.' },
    ],
    pitfalls: [
      'Een Supabase-query direct in een visuele kaart maakt testen en hergebruik moeilijker.',
      'Een algemene utils-map kan een rommelmap worden als featurelogica daar belandt.',
    ],
    practice: {
      title: 'Sorteer vijf bestanden',
      instruction: 'Kies vijf imports uit ProjectZeroDashboard en voorspel aan het pad welke verantwoordelijkheid ieder bestand heeft.',
      checklist: ['Ik herken een component', 'Ik herken een service', 'Ik herken config of utility'],
    },
    aiPrompt: `Beoordeel deze lijst bestandspaden op verantwoordelijkheidsverdeling. Benoem welke bestanden logisch staan en welke beter bij een feature, service, hook, config of utility passen.`,
    quiz: {
      question: 'Waar hoort code die Supabase-authenticatie afhandelt het meest logisch?',
      options: ['In een visuele kaartcomponent', 'In een service of auth-hook', 'In een CSS-bestand'],
      correctIndex: 1,
      explanation: 'Authenticatie is data- en gedragslogica. Een service of gespecialiseerde hook houdt dit los van de interface.',
    },
    visual: {
      kind: 'tree',
      title: 'De src-boom',
      caption: 'Elke hoofdtak heeft een andere verantwoordelijkheid.',
      nodes: [
        { label: 'src', detail: 'De applicatiecode', accent: 'ink', children: ['app', 'features', 'components', 'hooks', 'services', 'config', 'utils'] },
        { label: 'features', detail: 'Productonderdelen', accent: 'acid', children: ['student', 'teacher', 'developer', 'missions'] },
        { label: 'services', detail: 'Data en externe systemen', accent: 'blue', children: ['auth', 'permissions', 'feedback'] },
        { label: 'components', detail: 'Herbruikbare interface', accent: 'teal', children: ['app-shell', 'brand', 'ui'] },
      ],
    },
  },
  {
    id: 'component-tree',
    number: 6,
    track: 'fundament',
    title: 'Hoe hangt de interface aan elkaar?',
    subtitle: 'De componentboom van DGskills',
    objective: 'Je kunt van een zichtbaar scherm terugredeneren naar de bovenliggende componenten.',
    durationMinutes: 16,
    whyItMatters: 'Een visueel probleem kan ontstaan in de kaart zelf, het dashboard dat props doorgeeft of de app-shell die het scherm kiest. De componentboom helpt de juiste laag vinden.',
    remember: 'Een scherm is een boom: bovenliggende componenten kiezen en voeden onderliggende componenten.',
    file: 'src/main.tsx → src/app → src/features',
    code: `<App />
  <AppRouter />
    <AuthenticatedApp />
      <ProjectZeroDashboard />
        <StudentProjectCard />`,
    explanation: [
      'React bouwt geen losse pagina’s naast elkaar, maar een boom van componenten. Een oudercomponent kan data en callbacks naar kinderen doorgeven.',
      'Wanneer een kaart niet verschijnt, controleer je van boven naar beneden: wordt het dashboard gekozen, bevat de missielijst de kaart en rendert de kaart de juiste status?',
    ],
    concepts: [
      { term: 'Oudercomponent', meaning: 'Een component die andere componenten rendert.', example: 'AuthenticatedApp' },
      { term: 'Kindcomponent', meaning: 'Een component die binnen een ouder staat.', example: 'ProjectZeroDashboard' },
      { term: 'Componentboom', meaning: 'De hiërarchie van alle gerenderde componenten.', example: 'App → Router → Dashboard → Kaart' },
    ],
    dataFlow: [
      { from: 'AuthenticatedApp', to: 'ProjectZeroDashboard', data: 'user, stats, callbacks', reason: 'Het dashboard heeft gebruikerscontext nodig.' },
      { from: 'ProjectZeroDashboard', to: 'StudentProjectCard', data: 'mission en status', reason: 'Elke kaart toont één missie.' },
      { from: 'StudentProjectCard', to: 'AuthenticatedApp', data: 'mission.id via callback', reason: 'De gekozen missie moet centraal worden geopend.' },
    ],
    pitfalls: [
      'Props op één niveau vergeten kan diep onderin een leeg of fout scherm veroorzaken.',
      'Te veel verantwoordelijkheden in één oudercomponent maken de boom moeilijk te begrijpen.',
    ],
    practice: {
      title: 'Volg één klik omhoog',
      instruction: 'Start bij de knop Start missie en volg de callback terug tot AuthenticatedApp.',
      checklist: ['Ik vind StudentProjectCard', 'Ik vind onSelectModule', 'Ik vind handleSelectModule'],
    },
    aiPrompt: `Maak van deze React-bestanden een componentboom. Zet bij iedere pijl welke props of callbacks worden doorgegeven en markeer waar een gebruikersklik weer omhoog reist.`,
    quiz: {
      question: 'Welke component staat direct boven StudentProjectCard in deze flow?',
      options: ['main.tsx', 'ProjectZeroDashboard', 'Supabase'],
      correctIndex: 1,
      explanation: 'ProjectZeroDashboard bouwt de lijst en rendert voor iedere missie een StudentProjectCard.',
    },
    visual: {
      kind: 'tree',
      title: 'Van app naar opdrachtkaart',
      caption: 'Naar beneden reizen props; via callbacks kan een actie terug omhoog.',
      nodes: [
        { label: 'App', detail: 'Start de router', accent: 'blue', children: ['AppRouter'] },
        { label: 'AppRouter', detail: 'Kiest privéroute', accent: 'teal', children: ['AuthenticatedApp'] },
        { label: 'AuthenticatedApp', detail: 'Kiest leerlingdashboard', accent: 'acid', children: ['ProjectZeroDashboard'] },
        { label: 'ProjectZeroDashboard', detail: 'Bouwt kaarten', accent: 'purple', children: ['StudentProjectCard'] },
      ],
    },
  },
];
