import type { AcademyLesson } from '../types';

export const REACT_LESSONS: AcademyLesson[] = [
  {
    id: 'react-component',
    number: 7,
    track: 'react',
    title: 'Wat is een React-component?',
    subtitle: 'Een functie die interface beschrijft',
    objective: 'Je herkent een functionele component en kunt uitleggen wat de return-waarde zichtbaar maakt.',
    durationMinutes: 12,
    whyItMatters: 'Vrijwel elk scherm in DGskills is opgebouwd uit componenten. Zonder dit begrip is het lastig te zien waar tekst, knoppen en interacties vandaan komen.',
    remember: 'Een component is een functie die op basis van invoer beschrijft wat React moet tonen.',
    file: 'Bijvoorbeeld src/features/developer/DeveloperDashboard.tsx',
    code: `export function TabLoader() {
  return (
    <div className='flex items-center justify-center py-24'>
      <div className='animate-spin' />
    </div>
  );
}`,
    explanation: [
      'Een functionele component is een gewone TypeScript-functie met een hoofdletter. De functie geeft JSX terug: een beschrijving van de zichtbare structuur.',
      'React roept de functie opnieuw aan wanneer props of state veranderen. De nieuwe JSX wordt vergeleken met de vorige interface en alleen noodzakelijke wijzigingen worden toegepast.',
    ],
    concepts: [
      { term: 'JSX', meaning: 'HTML-achtige schrijfwijze binnen TypeScript.', example: `<div>Welkom</div>` },
      { term: 'Functionele component', meaning: 'Een functie die JSX teruggeeft.', example: 'function TabLoader()' },
      { term: 'Render', meaning: 'Een uitvoering van de componentfunctie om de interface te bepalen.', example: 'State verandert → opnieuw renderen' },
    ],
    dataFlow: [
      { from: 'Props en state', to: 'Componentfunctie', data: 'Huidige waarden', reason: 'De component moet weten wat nu geldt.' },
      { from: 'Componentfunctie', to: 'JSX', data: 'Interfacebeschrijving', reason: 'React krijgt de gewenste structuur.' },
      { from: 'React', to: 'Browser', data: 'DOM-wijzigingen', reason: 'De zichtbare pagina wordt bijgewerkt.' },
    ],
    pitfalls: [
      'Een componentnaam met een kleine letter wordt door React als HTML-tag behandeld.',
      'Zware berekeningen direct in elke render kunnen de interface vertragen.',
    ],
    practice: {
      title: 'Markeer de componentdelen',
      instruction: 'Kies een kleine component en markeer de naam, invoer, return en zichtbare elementen.',
      checklist: ['Ik vind de functienaam', 'Ik vind de return', 'Ik kan benoemen wat zichtbaar wordt'],
    },
    aiPrompt: `Leg deze React-component uit in vier blokken: invoer, lokale logica, gerenderde interface en mogelijke zij-effecten. Gebruik geen jargon zonder definitie.`,
    quiz: {
      question: 'Wat geeft een React-component meestal terug?',
      options: ['Een JSX-beschrijving van de interface', 'Altijd een databaseantwoord', 'Alleen CSS-klassen'],
      correctIndex: 0,
      explanation: 'De return beschrijft wat React moet tonen. Dat kan afhankelijk zijn van props en state.',
    },
    visual: {
      kind: 'cycle',
      title: 'De rendercyclus',
      caption: 'Nieuwe invoer veroorzaakt een nieuwe beschrijving en daarna een gerichte schermupdate.',
      nodes: [
        { label: 'Props/state', detail: 'Huidige invoer', accent: 'blue' },
        { label: 'Component', detail: 'Functie wordt uitgevoerd', accent: 'acid' },
        { label: 'JSX', detail: 'Gewenste interface', accent: 'purple' },
        { label: 'Browser', detail: 'Zichtbare update', accent: 'teal' },
      ],
    },
  },
  {
    id: 'props',
    number: 8,
    track: 'react',
    title: 'Hoe reist informatie omlaag?',
    subtitle: 'Props als pakketjes',
    objective: 'Je kunt aanwijzen welke waarden en callbacks een kindcomponent van zijn ouder ontvangt.',
    durationMinutes: 14,
    whyItMatters: 'Wanneer een component verkeerde informatie toont, moet je weten waar die informatie vandaan komt en op welk niveau de waarde wordt bepaald.',
    remember: 'Props zijn alleen-lezen pakketjes die een oudercomponent aan een kindcomponent geeft.',
    file: 'src/app/AuthenticatedApp.tsx',
    code: `<ProjectZeroDashboard
  userDisplayName={user?.displayName}
  stats={user?.stats}
  activeWeek={activeWeek}
  onSelectModule={handleSelectModule}
/>`,
    explanation: [
      'Een oudercomponent zet props als attributen op een kindcomponent. Het kind ontvangt die waarden via zijn functieparameters en gebruikt ze in logica of JSX.',
      'Callbacks zijn ook props. Daardoor kan een kind melden dat er iets is gebeurd, zonder zelf te bepalen hoe de hele app daarop reageert.',
    ],
    concepts: [
      { term: 'Prop', meaning: 'Een waarde of functie die van ouder naar kind gaat.', example: 'activeWeek={activeWeek}' },
      { term: 'Callback', meaning: 'Een meegegeven functie waarmee het kind een actie meldt.', example: 'onSelectModule' },
      { term: 'Alleen-lezen', meaning: 'Het kind hoort de ontvangen prop niet zelf te overschrijven.', example: 'Een nieuwe waarde komt van de ouder.' },
    ],
    dataFlow: [
      { from: 'AuthenticatedApp', to: 'ProjectZeroDashboard', data: 'stats en activeWeek', reason: 'Het dashboard toont de juiste voortgang en periode.' },
      { from: 'AuthenticatedApp', to: 'ProjectZeroDashboard', data: 'onSelectModule', reason: 'Het dashboard moet een keuze kunnen melden.' },
      { from: 'ProjectZeroDashboard', to: 'StudentProjectCard', data: 'mission', reason: 'Iedere kaart toont één missie.' },
    ],
    pitfalls: [
      'Een optionele prop zonder fallback kan undefined in de interface tonen.',
      'Te veel props door veel lagen heen heet prop drilling en maakt wijzigingen moeilijker.',
    ],
    practice: {
      title: 'Teken één propketen',
      instruction: 'Volg activeWeek van AuthenticatedApp naar het dashboard en beschrijf waar de waarde wordt gebruikt.',
      checklist: ['Ik vind de bronwaarde', 'Ik vind de prop', 'Ik vind de gebruiksplek'],
    },
    aiPrompt: `Maak een props-tabel voor deze component. Gebruik de kolommen naam, type, bron, doel, optioneel en risico bij ontbrekende waarde.`,
    quiz: {
      question: 'Welke richting reizen props?',
      options: ['Van ouder naar kind', 'Alleen van database naar browser', 'Automatisch beide kanten op'],
      correctIndex: 0,
      explanation: 'Props worden omlaag doorgegeven. Acties kunnen via een callback weer omhoog worden gemeld.',
    },
    visual: {
      kind: 'data',
      title: 'Props omlaag, acties omhoog',
      caption: 'De ouder bezit de context; het kind gebruikt de context en meldt gebeurtenissen.',
      nodes: [
        { label: 'AuthenticatedApp', detail: 'Bezit user, week en navigatie', accent: 'blue' },
        { label: 'Props ↓', detail: 'stats, activeWeek, callback', accent: 'acid' },
        { label: 'Dashboard', detail: 'Toont en handelt klik af', accent: 'teal' },
        { label: 'Callback ↑', detail: 'mission.id', accent: 'purple' },
      ],
    },
  },
  {
    id: 'state',
    number: 9,
    track: 'react',
    title: 'Wat onthoudt een component?',
    subtitle: 'State verandert tijdens gebruik',
    objective: 'Je herkent useState en begrijpt dat de setter een nieuwe render veroorzaakt.',
    durationMinutes: 15,
    whyItMatters: 'Menu’s, modals, geselecteerde lessen en laadstatussen werken met state. Foute state kan schermen laten vastlopen of elkaar tegenspreken.',
    remember: 'State is veranderlijke informatie van een component; de setter vraagt React opnieuw te renderen.',
    file: 'src/features/developer/DeveloperDashboard.tsx',
    code: `const [activeTab, setActiveTab] = useState<TabId>('sprintplan');

<button onClick={() => setActiveTab('docs')}>
  Documenten
</button>`,
    explanation: [
      'useState geeft twee waarden terug: de huidige state en een setter. De initiële waarde wordt alleen bij de eerste opbouw gebruikt.',
      'Na een setter-aanroep plant React een nieuwe render. Direct na setState kan de oude waarde in dezelfde functie daarom nog zichtbaar zijn.',
    ],
    concepts: [
      { term: 'State', meaning: 'Informatie die tijdens gebruik kan veranderen.', example: 'activeTab' },
      { term: 'Setter', meaning: 'Functie die een nieuwe statewaarde doorgeeft aan React.', example: 'setActiveTab' },
      { term: 'Functionele update', meaning: 'Nieuwe state berekenen uit de vorige state.', example: `setItems(current => [...current, item])` },
    ],
    dataFlow: [
      { from: 'Klik', to: 'Setter', data: 'Nieuwe tab-id', reason: 'De gebruiker kiest een ander onderdeel.' },
      { from: 'Setter', to: 'React', data: 'State-update', reason: 'React moet een nieuwe render plannen.' },
      { from: 'Nieuwe state', to: 'JSX', data: 'activeTab', reason: 'Het juiste tabpaneel wordt getoond.' },
    ],
    pitfalls: [
      'Een object of array direct aanpassen zonder setter levert vaak geen betrouwbare update op.',
      'Twee onafhankelijke bronnen die dezelfde state zetten kunnen elkaar overschrijven.',
    ],
    practice: {
      title: 'Vind drie soorten state',
      instruction: 'Zoek in een dashboard state voor navigatie, een modal en een invoerveld.',
      checklist: ['Ik vind de huidige waarde', 'Ik vind de setter', 'Ik vind minstens één event dat de setter gebruikt'],
    },
    aiPrompt: `Inventariseer alle useState-aanroepen in dit bestand. Leg per state uit wie hem verandert, wat ermee wordt gerenderd en of twee updates elkaar kunnen tegenspreken.`,
    quiz: {
      question: 'Wat gebeurt er normaal na een state-setter?',
      options: ['React plant een nieuwe render', 'De browser verwijdert de component', 'Supabase maakt automatisch een rij'],
      correctIndex: 0,
      explanation: 'De setter verandert React-state. Opslag in een database gebeurt alleen als aparte code dat expliciet doet.',
    },
    visual: {
      kind: 'cycle',
      title: 'Van klik naar nieuwe interface',
      caption: 'State vormt een herhalende lus tussen gebruiker en component.',
      nodes: [
        { label: 'Gebruiker', detail: 'Klikt op een tab', accent: 'blue' },
        { label: 'Setter', detail: 'setActiveTab', accent: 'orange' },
        { label: 'State', detail: 'activeTab verandert', accent: 'acid' },
        { label: 'Render', detail: 'Nieuw paneel zichtbaar', accent: 'teal' },
      ],
    },
  },
  {
    id: 'effects',
    number: 10,
    track: 'react',
    title: 'Wanneer praat een component met buiten?',
    subtitle: 'useEffect en opruimen',
    objective: 'Je begrijpt wanneer een effect start, waarom dependencies belangrijk zijn en wat cleanup doet.',
    durationMinutes: 18,
    whyItMatters: 'Authenticatie-abonnementen, realtime updates en browserlisteners zijn effecten. Zonder cleanup kunnen dubbele listeners, geheugenlekken of updates na unmount ontstaan.',
    remember: 'Een effect synchroniseert React met iets buiten de render en ruimt die koppeling zo nodig weer op.',
    file: 'src/hooks/useAuth.ts',
    code: `useEffect(() => {
  const unsubscribe = subscribeToAuthChanges(setUser);

  return () => {
    unsubscribe();
  };
}, []);`,
    explanation: [
      'De effectfunctie wordt na render uitgevoerd. Met een lege dependencylijst gebeurt dit één keer na montage en de cleanup bij ontkoppeling.',
      'Dependencies vertellen React welke waarden het effect gebruikt. Ontbrekende dependencies kunnen oude waarden vasthouden; onstabiele dependencies kunnen het effect onnodig vaak herstarten.',
    ],
    concepts: [
      { term: 'Effect', meaning: 'Synchronisatie met een extern systeem of browser-API.', example: 'auth-abonnement' },
      { term: 'Dependency', meaning: 'Waarde waarvan het effect afhankelijk is.', example: '[user.uid]' },
      { term: 'Cleanup', meaning: 'Functie die listener, timer of abonnement stopt.', example: 'unsubscribe()' },
    ],
    dataFlow: [
      { from: 'Render', to: 'useEffect', data: 'Dependencies', reason: 'React bepaalt of het effect moet starten.' },
      { from: 'Effect', to: 'Auth-service', data: 'Callback', reason: 'De component wil sessiewijzigingen ontvangen.' },
      { from: 'Cleanup', to: 'Abonnement', data: 'unsubscribe', reason: 'Geen updates meer na unmount.' },
    ],
    pitfalls: [
      'Een timer of listener niet opruimen kan na unmount nog state proberen te zetten.',
      'Een effect gebruiken voor berekende waarden die ook direct tijdens render kunnen worden bepaald maakt code ingewikkelder.',
    ],
    practice: {
      title: 'Controleer een effect',
      instruction: 'Kies een useEffect en beantwoord: wat start, wanneer start het, welke waarden gebruikt het en hoe stopt het?',
      checklist: ['Ik vind de dependencies', 'Ik vind het externe effect', 'Ik vind of mis een cleanup'],
    },
    aiPrompt: `Audit alle useEffect-blokken in dit bestand. Maak per effect een tabel met trigger, dependencies, side effect, cleanup, race-risico en mogelijke vereenvoudiging.`,
    quiz: {
      question: 'Waarom retourneert een effect soms een functie?',
      options: ['Om JSX te tonen', 'Om listeners, timers of abonnementen op te ruimen', 'Om TypeScript uit te schakelen'],
      correctIndex: 1,
      explanation: 'De geretourneerde cleanup voorkomt dat externe koppelingen blijven bestaan nadat het effect opnieuw start of de component verdwijnt.',
    },
    visual: {
      kind: 'cycle',
      title: 'Effectlevenscyclus',
      caption: 'Start, ontvang updates, ruim op en start eventueel opnieuw.',
      nodes: [
        { label: 'Render', detail: 'Dependencies controleren', accent: 'blue' },
        { label: 'Effect', detail: 'Abonnement starten', accent: 'acid' },
        { label: 'Updates', detail: 'Callback verandert state', accent: 'teal' },
        { label: 'Cleanup', detail: 'Abonnement stoppen', accent: 'orange' },
      ],
    },
  },
  {
    id: 'events',
    number: 11,
    track: 'react',
    title: 'Hoe reageert de app op gebruikers?',
    subtitle: 'Events en handlers',
    objective: 'Je kunt een klik volgen van de knop naar de handler en de uiteindelijke state- of navigatiewijziging.',
    durationMinutes: 13,
    whyItMatters: 'De meeste gebruikersflows beginnen met een event. Door handlers te volgen kun je snel bepalen wat een knop werkelijk doet en welke neveneffecten optreden.',
    remember: 'Een eventhandler is de brug tussen een gebruikersactie en applicatielogica.',
    file: 'src/features/student/ProjectZeroDashboard.tsx',
    code: `<button
  type='button'
  onClick={() => onSelectModule(mission.id)}
>
  Start missie
</button>`,
    explanation: [
      'onClick ontvangt een functie. Pas wanneer de gebruiker klikt, wordt die functie uitgevoerd en krijgt onSelectModule het id van de missie.',
      'Een handler kan state veranderen, een callback aanroepen of een service starten. Voor review is het belangrijk die keten door te volgen tot het echte resultaat.',
    ],
    concepts: [
      { term: 'Event', meaning: 'Een gebeurtenis uit browser of gebruiker.', example: 'click, keydown, submit' },
      { term: 'Handler', meaning: 'De functie die op een event reageert.', example: 'handleOpen' },
      { term: 'Event propagation', meaning: 'Een event kan door bovenliggende elementen reizen.', example: 'Een knop binnen een klikbare kaart' },
    ],
    dataFlow: [
      { from: 'Knop', to: 'onClick', data: 'Klik-event', reason: 'De browser meldt de actie.' },
      { from: 'Handler', to: 'onSelectModule', data: 'mission.id', reason: 'De gekozen missie wordt doorgegeven.' },
      { from: 'Navigatiehook', to: 'AuthenticatedApp', data: 'activeModule', reason: 'Het missiescherm wordt gekozen.' },
    ],
    pitfalls: [
      'onClick={functie()} voert de functie tijdens render uit; meestal is onClick={() => functie()} bedoeld.',
      'Een knop zonder type binnen een formulier kan onbedoeld het formulier verzenden.',
    ],
    practice: {
      title: 'Volg een knop volledig',
      instruction: 'Kies één knop in DGskills en schrijf alle functies op die vanaf de klik worden aangeroepen.',
      checklist: ['Ik vind de knop', 'Ik vind de handler', 'Ik vind het uiteindelijke zichtbare of opgeslagen resultaat'],
    },
    aiPrompt: `Traceer deze gebruikersactie van DOM-event tot eindresultaat. Geef elke functie in volgorde, de doorgegeven data en alle mogelijke vroege returns of foutpaden.`,
    quiz: {
      question: 'Waarom staat bij een klik vaak een pijlfunctie?',
      options: ['Om de actie pas bij de klik met de juiste argumenten uit te voeren', 'Omdat JSX geen functienamen ondersteunt', 'Om automatisch een database te openen'],
      correctIndex: 0,
      explanation: 'De pijlfunctie stelt de aanroep uit en kan bijvoorbeeld mission.id meegeven.',
    },
    visual: {
      kind: 'flow',
      title: 'Klikketen Start missie',
      caption: 'Volg niet alleen de knop, maar ook de callback en navigatiestate.',
      nodes: [
        { label: 'Klik', detail: 'Browser-event', accent: 'blue' },
        { label: 'Handler', detail: 'onSelectModule(id)', accent: 'acid' },
        { label: 'Navigatie', detail: 'activeModule wordt id', accent: 'orange' },
        { label: 'Render', detail: 'Missiecomponent opent', accent: 'purple' },
      ],
    },
  },
  {
    id: 'conditional-rendering',
    number: 12,
    track: 'react',
    title: 'Waarom ziet niet iedereen hetzelfde?',
    subtitle: 'Conditioneel renderen',
    objective: 'Je begrijpt hoe if-statements, ternaire expressies en && bepalen welk onderdeel zichtbaar is.',
    durationMinutes: 15,
    whyItMatters: 'Rollen, loading, sloten, foutmeldingen en modals gebruiken conditioneel renderen. Een fout in de conditie kan functionaliteit onzichtbaar of onbedoeld toegankelijk maken.',
    remember: 'React toont alleen de JSX van de conditie die op dat moment waar is.',
    file: 'src/app/AuthenticatedApp.tsx en dashboardcomponenten',
    code: `{loading ? (
  <LoadingFallback />
) : user ? (
  <AuthenticatedApp />
) : (
  <Login />
)}`,
    explanation: [
      'Een component kan vroeg returnen bij loading of een fout. Daarna kan de normale interface worden gerenderd. Dit houdt uitzonderlijke toestanden uit de hoofd-JSX.',
      'Een conditie in de interface is geen beveiliging op zichzelf. Gevoelige data moet ook in de database of backend met rechten worden beschermd.',
    ],
    concepts: [
      { term: 'Early return', meaning: 'De component stopt vroeg met een specifiek scherm.', example: 'if (loading) return <Spinner />' },
      { term: 'Ternaire expressie', meaning: 'Korte keuze tussen twee JSX-uitkomsten.', example: 'done ? Voltooid : Start' },
      { term: 'UI-autorisatie', meaning: 'Interface verbergen op basis van rol.', example: 'Developerknop alleen voor developer' },
    ],
    dataFlow: [
      { from: 'State of prop', to: 'Conditie', data: 'loading, role, locked', reason: 'De app moet een keuze maken.' },
      { from: 'Conditie', to: 'JSX-tak', data: 'true of false', reason: 'Slechts één toestand hoort zichtbaar te zijn.' },
      { from: 'JSX-tak', to: 'Gebruiker', data: 'Loader, inhoud of fout', reason: 'De huidige toestand wordt duidelijk gemaakt.' },
    ],
    pitfalls: [
      'Alleen een knop verbergen beschermt de onderliggende data of API niet.',
      'Diep geneste ternaries maken de zichtbare logica moeilijk te controleren.',
    ],
    practice: {
      title: 'Maak een toestandstabel',
      instruction: 'Kies een component met loading, error en data en schrijf per combinatie op wat zichtbaar hoort te zijn.',
      checklist: ['Ik heb loading', 'Ik heb error', 'Ik heb succesdata', 'Geen toestand overlapt onbedoeld'],
    },
    aiPrompt: `Zet alle conditionele renders in deze component om naar een toestandstabel. Markeer onbereikbare, overlappende of onveilige toestanden.`,
    quiz: {
      question: 'Is een verborgen developerknop voldoende beveiliging?',
      options: ['Ja, onzichtbaar betekent ontoegankelijk', 'Nee, backend- en databaserechten blijven noodzakelijk', 'Alleen op mobiele schermen'],
      correctIndex: 1,
      explanation: 'UI-condities verbeteren de ervaring, maar echte autorisatie moet ook aan de datakant worden afgedwongen.',
    },
    visual: {
      kind: 'comparison',
      title: 'Interfacekeuze versus beveiliging',
      caption: 'Beide zijn nodig, maar ze lossen een ander probleem op.',
      nodes: [
        { label: 'UI-conditie', detail: 'Toont het juiste scherm', accent: 'acid', children: ['loading', 'role', 'locked'] },
        { label: 'Backend/RLS', detail: 'Beschermt data en acties', accent: 'purple', children: ['policy', 'token', 'servercheck'] },
      ],
    },
  },
];
