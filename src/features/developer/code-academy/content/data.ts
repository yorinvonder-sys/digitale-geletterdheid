import type { AcademyLesson } from '../types';

export const DATA_LESSONS: AcademyLesson[] = [
  {
    id: 'typescript-types',
    number: 13,
    track: 'data',
    title: 'Hoe beschrijft TypeScript de data?',
    subtitle: 'Types als contract',
    objective: 'Je kunt een interface lezen en bepalen welke velden verplicht, optioneel of beperkt tot vaste waarden zijn.',
    durationMinutes: 16,
    whyItMatters: 'Types laten vaak sneller dan de uitvoeringscode zien welke informatie een onderdeel verwacht en welke toestanden officieel zijn toegestaan.',
    remember: 'Een TypeScript-type is een controleerbaar contract over de vorm van data.',
    file: 'src/types.ts',
    code: `export interface ParentUser {
  uid: string;
  displayName: string | null;
  role: 'student' | 'teacher' | 'admin' | 'developer';
  schoolId?: string;
  stats?: UserStats;
}`,
    explanation: [
      'Een interface noemt velden en hun toegestane typen. Een vraagteken betekent dat het veld mag ontbreken. Een union met verticale strepen beperkt een waarde tot vaste opties.',
      'TypeScript controleert dit tijdens ontwikkeling en build. Het valideert niet automatisch onbetrouwbare data die tijdens runtime uit een API komt; daarvoor blijft runtimevalidatie nodig.',
    ],
    concepts: [
      { term: 'Interface', meaning: 'Een benoemd contract voor de vorm van een object.', example: 'ParentUser' },
      { term: 'Union type', meaning: 'Een waarde mag één van meerdere vaste typen zijn.', example: `'student' | 'teacher'` },
      { term: 'Optioneel veld', meaning: 'Een veld dat mag ontbreken.', example: 'schoolId?: string' },
    ],
    dataFlow: [
      { from: 'Supabase of auth', to: 'ParentUser', data: 'Profielgegevens', reason: 'De app wil één bekende gebruikersvorm.' },
      { from: 'ParentUser', to: 'useAuth', data: 'user of null', reason: 'Authenticatie levert een getypeerde gebruiker.' },
      { from: 'useAuth', to: 'Componenten', data: 'Props', reason: 'Schermen weten welke velden beschikbaar zijn.' },
    ],
    pitfalls: [
      'any schakelt de typecontrole grotendeels uit en kan fouten verbergen.',
      'Een optioneel veld gebruiken zonder controle kan undefined-fouten veroorzaken.',
    ],
    practice: {
      title: 'Lees ParentUser als formulier',
      instruction: 'Maak twee kolommen: verplicht en optioneel. Plaats alle relevante ParentUser-velden in de juiste kolom.',
      checklist: ['Ik herken vraagtekens', 'Ik herken nullable velden', 'Ik herken de vaste rollen'],
    },
    aiPrompt: `Leg deze TypeScript-interface uit als datacontract. Benoem verplichte, optionele en nullable velden, vaste waardes en drie runtimecontroles die TypeScript niet uitvoert.`,
    quiz: {
      question: 'Wat betekent schoolId?: string?',
      options: ['schoolId is altijd een lege string', 'schoolId mag ontbreken, maar is een string wanneer aanwezig', 'schoolId wordt automatisch uit Supabase gehaald'],
      correctIndex: 1,
      explanation: 'Het vraagteken maakt het veld optioneel. De interface zegt niets over automatisch ophalen.',
    },
    visual: {
      kind: 'layers',
      title: 'Van ruwe data naar getypeerd gebruik',
      caption: 'Types liggen tussen externe data en componenten als ontwikkelcontract.',
      nodes: [
        { label: 'Externe data', detail: 'Kan onverwacht zijn', accent: 'orange' },
        { label: 'Runtimecontrole', detail: 'Controleert echte waarde', accent: 'purple' },
        { label: 'TypeScript-type', detail: 'Beschrijft verwachte vorm', accent: 'acid' },
        { label: 'Component', detail: 'Gebruikt bekende velden', accent: 'teal' },
      ],
    },
  },
  {
    id: 'service-layer',
    number: 14,
    track: 'data',
    title: 'Waarom staat data niet overal in componenten?',
    subtitle: 'De servicelaag',
    objective: 'Je kunt uitleggen waarom Supabase- en auth-logica in services wordt gecentraliseerd.',
    durationMinutes: 15,
    whyItMatters: 'Wanneer databasequeries verspreid raken over visuele componenten, wordt testen, foutafhandeling en beveiligingsreview veel moeilijker.',
    remember: 'Een service vertaalt een productactie naar data- of netwerkwerk en houdt dat uit de interface.',
    file: 'src/services/',
    code: `export const getGamePermissions = async (schoolId?: string) => {
  const { data, error } = await supabase
    .from('game_permissions')
    .select('*')
    .eq('school_id', schoolId)
    .maybeSingle();

  if (error) throw error;
  return data;
};`,
    explanation: [
      'Een component hoort vooral gebruikersinteractie en presentatie te beheren. Een service kent tabellen, API’s, tokens en omzetting van externe data naar een bruikbare vorm.',
      'Een goede service heeft een duidelijke functie zoals getGamePermissions of submitFeedback. De aanroeper hoeft niet te weten hoe de query precies is opgebouwd.',
    ],
    concepts: [
      { term: 'Servicelaag', meaning: 'Functies voor externe data en systemen.', example: 'authService, PermissionService' },
      { term: 'Abstractie', meaning: 'Details verbergen achter een duidelijke interface.', example: 'getGamePermissions(schoolId)' },
      { term: 'Side effect', meaning: 'Een actie buiten puur berekenen.', example: 'Database schrijven of netwerkverzoek' },
    ],
    dataFlow: [
      { from: 'Component of hook', to: 'Servicefunctie', data: 'Productgerichte opdracht', reason: 'De UI vraagt om data of een actie.' },
      { from: 'Service', to: 'Supabase', data: 'Tabelquery', reason: 'De service kent de externe techniek.' },
      { from: 'Service', to: 'Component', data: 'Bruikbaar resultaat of fout', reason: 'De UI kan een toestand tonen.' },
    ],
    pitfalls: [
      'Een service die JSX of browserlayout beheert mengt verantwoordelijkheden.',
      'Een service die fouten stil inslikt kan een leeg resultaat laten lijken op geldige data.',
    ],
    practice: {
      title: 'Teken de grens',
      instruction: 'Kies één component met een service-import en markeer welke regels UI zijn en welke regels naar de service zijn verplaatst.',
      checklist: ['Ik vind de service-import', 'Ik vind de aanroep', 'Ik kan zeggen welke technische details verborgen blijven'],
    },
    aiPrompt: `Beoordeel of data- en UI-verantwoordelijkheden in deze bestanden goed gescheiden zijn. Noem concrete regels die naar een service, hook of component horen.`,
    quiz: {
      question: 'Wat is een belangrijk voordeel van een servicelaag?',
      options: ['Alle componenten worden automatisch kleiner dan tien regels', 'Database- en netwerkdetails blijven centraal en herbruikbaar', 'Supabase heeft dan geen beveiligingsregels nodig'],
      correctIndex: 1,
      explanation: 'Centralisatie verbetert leesbaarheid en hergebruik, maar vervangt geen databasebeveiliging.',
    },
    visual: {
      kind: 'layers',
      title: 'UI, gedrag en data',
      caption: 'De laaggrenzen maken zichtbaar waar een wijziging thuishoort.',
      nodes: [
        { label: 'Component', detail: 'Toont en ontvangt events', accent: 'teal' },
        { label: 'Hook', detail: 'Combineert React-gedrag', accent: 'blue' },
        { label: 'Service', detail: 'Praat met externe systemen', accent: 'acid' },
        { label: 'Supabase', detail: 'Auth, database en realtime', accent: 'purple' },
      ],
    },
  },
  {
    id: 'supabase-read',
    number: 15,
    track: 'data',
    title: 'Hoe leest DGskills gegevens?',
    subtitle: 'Selecteren, filteren en één resultaat',
    objective: 'Je kunt een Supabase select-query van tabel tot resultaat lezen.',
    durationMinutes: 18,
    whyItMatters: 'Bij ontbrekende of verkeerde gegevens moet je kunnen bepalen welke tabel, filters en foutafhandeling de read bepalen.',
    remember: 'Een read noemt de tabel, geselecteerde velden, filters en verwachte hoeveelheid resultaten.',
    file: 'src/services/PermissionService.ts',
    code: `let query = supabase
  .from('game_permissions')
  .select('*');

query = schoolId
  ? query.eq('school_id', schoolId)
  : query.is('school_id', null);

const { data, error } = await query.limit(1).maybeSingle();`,
    explanation: [
      'from kiest de tabel en select kiest de velden. eq en is voegen filters toe. limit en maybeSingle geven aan dat nul of één rij wordt verwacht.',
      'De query levert data en error apart terug. De code moet beide toestanden behandelen en daarna externe databasevormen omzetten naar producttypen.',
    ],
    concepts: [
      { term: 'Select', meaning: 'Velden uit een tabel lezen.', example: `.select('*')` },
      { term: 'Filter', meaning: 'Beperken welke rijen meetellen.', example: `.eq('school_id', schoolId)` },
      { term: 'maybeSingle', meaning: 'Nul of één rij als object verwachten.', example: 'Geen record is niet automatisch een fout.' },
    ],
    dataFlow: [
      { from: 'PermissionService', to: 'game_permissions', data: 'schoolId-filter', reason: 'Alleen de relevante schoolconfiguratie is nodig.' },
      { from: 'Supabase', to: 'PermissionService', data: 'row en error', reason: 'De service moet succes of fout verwerken.' },
      { from: 'PermissionService', to: 'Dashboard', data: 'GamePermissions', reason: 'De UI gebruikt een stabiel producttype.' },
    ],
    pitfalls: [
      'select(*) kan onnodig meer gegevens ophalen dan de gebruiker nodig heeft.',
      'Een ontbrekend schoolfilter kan configuratie van een andere tenant meenemen als RLS niet correct is.',
    ],
    practice: {
      title: 'Lees een query hardop',
      instruction: 'Vertaal iedere method call van een Supabase-read naar één Nederlandse zin.',
      checklist: ['Ik noem de tabel', 'Ik noem de velden', 'Ik noem alle filters', 'Ik noem nul, één of meerdere resultaten'],
    },
    aiPrompt: `Vertaal deze Supabase-query stap voor stap naar gewone taal. Controleer tenantfilter, geselecteerde velden, verwachte cardinaliteit, foutafhandeling en RLS-aannames.`,
    quiz: {
      question: 'Wat betekent maybeSingle vooral?',
      options: ['Er moeten precies honderd rijen zijn', 'De code verwacht nul of één rij als object', 'De query wordt alleen mobiel uitgevoerd'],
      correctIndex: 1,
      explanation: 'maybeSingle past bij een optionele configuratierij. Meerdere rijen zijn niet de bedoelde uitkomst.',
    },
    visual: {
      kind: 'data',
      title: 'De read-pijplijn',
      caption: 'Elke stap maakt de dataset smaller en bruikbaarder.',
      nodes: [
        { label: 'Tabel', detail: 'game_permissions', accent: 'purple' },
        { label: 'Select', detail: 'Welke velden?', accent: 'blue' },
        { label: 'Filter', detail: 'Welke school?', accent: 'orange' },
        { label: 'Resultaat', detail: 'Nul of één rij', accent: 'acid' },
        { label: 'Producttype', detail: 'GamePermissions', accent: 'teal' },
      ],
    },
  },
  {
    id: 'supabase-write',
    number: 16,
    track: 'data',
    title: 'Hoe schrijft DGskills gegevens?',
    subtitle: 'Upsert, merge en cache',
    objective: 'Je kunt een schrijfoperatie lezen en herkennen welke data wordt samengevoegd en opgeslagen.',
    durationMinutes: 20,
    whyItMatters: 'Schrijffouten kunnen gebruikersdata overschrijven, tenantgrenzen raken of een interface succes laten tonen terwijl de database faalt.',
    remember: 'Een veilige write bepaalt de huidige data, de nieuwe vorm, de conflictsleutel, foutafhandeling en cache-invalidering.',
    file: 'src/services/PermissionService.ts',
    code: `const mergedData = {
  enabled_games: permissions.enabled_games ?? current.enabled_games,
  blocked_games: permissions.blocked_games ?? current.blocked_games,
  custom_settings: permissions.custom_settings ?? current.custom_settings,
};

const { error } = await supabase
  .from('game_permissions')
  .upsert({ id, school_id: schoolId || null, data: mergedData });`,
    explanation: [
      'De functie leest eerst de huidige rechten en vervangt alleen velden die in de update zijn meegegeven. Daarna schrijft upsert een nieuwe rij of past de bestaande rij aan.',
      'Na succes wordt lokale cache ongeldig gemaakt. Anders zou de interface nog minutenlang oude rechten kunnen tonen ondanks een geslaagde databasewrite.',
    ],
    concepts: [
      { term: 'Upsert', meaning: 'Invoegen wanneer afwezig, bijwerken wanneer aanwezig.', example: `.upsert(..., { onConflict: 'id' })` },
      { term: 'Merge', meaning: 'Nieuwe en bestaande velden combineren.', example: 'nieuw ?? bestaand' },
      { term: 'Cache invalidation', meaning: 'Oude lokale kopie verwijderen na wijziging.', example: 'invalidateCache()' },
    ],
    dataFlow: [
      { from: 'Docentenactie', to: 'updateGamePermissions', data: 'Gedeeltelijke update', reason: 'Niet elk veld hoeft te veranderen.' },
      { from: 'Service', to: 'Supabase', data: 'mergedData en tenant-id', reason: 'De complete geldige rij wordt opgeslagen.' },
      { from: 'Succes', to: 'Cache', data: 'Invalidatie', reason: 'Volgende read moet nieuwe data ophalen.' },
    ],
    pitfalls: [
      'Een gedeeltelijk object direct opslaan kan niet-meegestuurde velden wissen.',
      'De UI als succesvol bijwerken vóór databasebevestiging kan een onjuiste toestand tonen.',
    ],
    practice: {
      title: 'Controleer een write-contract',
      instruction: 'Markeer brondata, merge, tenant-id, conflictsleutel, foutpad en cacheactie in één schrijffunctie.',
      checklist: ['Ik vind de huidige waarde', 'Ik vind de nieuwe waarde', 'Ik vind error', 'Ik vind wat na succes wordt vernieuwd'],
    },
    aiPrompt: `Review deze Supabase-write op dataverlies, tenantisolatie, race conditions, optimistische UI, foutafhandeling en cache-invalidering. Geef bewijs per conclusie.`,
    quiz: {
      question: 'Waarom wordt na een geslaagde write de cache ongeldig gemaakt?',
      options: ['Om oude data niet opnieuw te tonen', 'Om de database te verwijderen', 'Om TypeScript sneller te maken'],
      correctIndex: 0,
      explanation: 'Een cache bevat een kopie. Na een wijziging moet die kopie worden vernieuwd of verwijderd.',
    },
    visual: {
      kind: 'cycle',
      title: 'Write en opnieuw lezen',
      caption: 'Een wijziging is pas compleet wanneer toekomstige reads de nieuwe toestand zien.',
      nodes: [
        { label: 'Huidige data', detail: 'Bestaande rechten', accent: 'blue' },
        { label: 'Merge', detail: 'Gedeeltelijke update combineren', accent: 'orange' },
        { label: 'Upsert', detail: 'Database bevestigt', accent: 'purple' },
        { label: 'Cache wissen', detail: 'Oude kopie weg', accent: 'acid' },
        { label: 'Nieuwe read', detail: 'Verse rechten', accent: 'teal' },
      ],
    },
  },
  {
    id: 'auth-session',
    number: 17,
    track: 'data',
    title: 'Hoe weet de app wie is ingelogd?',
    subtitle: 'Sessie, token en useAuth',
    objective: 'Je kunt de stroom van Supabase-sessie naar ParentUser en rolgebaseerd scherm volgen.',
    durationMinutes: 22,
    whyItMatters: 'Authenticatie raakt vrijwel elke privéroute. Onzorgvuldige wijzigingen kunnen gebruikers uitloggen, verlopen tokens laten hangen of verkeerde rollen tonen.',
    remember: 'Supabase beheert de sessie; authService vertaalt die naar een gebruiker; useAuth houdt React-state actueel.',
    file: 'src/hooks/useAuth.ts en src/services/supabase.ts',
    code: `const [user, setUser] = useState<ParentUser | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = subscribeToAuthChanges(nextUser => {
    setUser(nextUser);
    setLoading(false);
  });
  return unsubscribe;
}, []);`,
    explanation: [
      'De Supabase-client bewaart en ververst sessies. subscribeToAuthChanges meldt wijzigingen. useAuth zet die wijziging om in React-state zodat route en dashboard opnieuw kunnen renderen.',
      'De code bevat ook een timeout-failsafe. Wanneer de auth-callback niet komt, wordt lokale sessie opgeruimd en stopt loading zodat de gebruiker niet eindeloos naar een spinner kijkt.',
    ],
    concepts: [
      { term: 'Sessie', meaning: 'De ingelogde toestand met gebruiker en tokens.', example: 'supabase.auth.getSession()' },
      { term: 'Access token', meaning: 'Kortlevend bewijs voor geauthenticeerde verzoeken.', example: 'Bearer JWT' },
      { term: 'Auth subscription', meaning: 'Listener voor inloggen, uitloggen en tokenwijzigingen.', example: 'subscribeToAuthChanges' },
    ],
    dataFlow: [
      { from: 'Supabase Auth', to: 'authService', data: 'Sessie en user-id', reason: 'De basisidentiteit moet worden gelezen.' },
      { from: 'authService', to: 'useAuth', data: 'ParentUser of null', reason: 'De app gebruikt één productvorm.' },
      { from: 'useAuth', to: 'AppRouter en AuthenticatedApp', data: 'user en loading', reason: 'Route en rolweergave worden gekozen.' },
    ],
    pitfalls: [
      'Een geldig lokaal token wissen bij iedere externe 401 kan gebruikers onnodig uitloggen.',
      'Een auth-listener niet unsubscriben kan dubbele callbacks veroorzaken.',
    ],
    practice: {
      title: 'Teken het inlogpad',
      instruction: 'Volg een geslaagde login van Supabase-event tot het developer- of leerlingdashboard.',
      checklist: ['Ik noem de sessie', 'Ik noem ParentUser', 'Ik noem useAuth', 'Ik noem de route- of rolkeuze'],
    },
    aiPrompt: `Maak een authenticatie-sequentiediagram van Supabase-client, authService, useAuth, AppRouter en AuthenticatedApp. Neem succes, timeout, verlopen token en logout op.`,
    quiz: {
      question: 'Welke taak heeft useAuth vooral?',
      options: ['Alle wachtwoorden opslaan', 'Auth-wijzigingen omzetten naar React user- en loading-state', 'CSS voor login maken'],
      correctIndex: 1,
      explanation: 'De hook verbindt authService met de React-componenten en ruimt het abonnement op.',
    },
    visual: {
      kind: 'flow',
      title: 'Van sessie naar dashboard',
      caption: 'Elke laag vertaalt de informatie naar een vorm die de volgende laag begrijpt.',
      nodes: [
        { label: 'Supabase sessie', detail: 'Token en user-id', accent: 'purple' },
        { label: 'authService', detail: 'Bouwt ParentUser', accent: 'blue' },
        { label: 'useAuth', detail: 'user + loading state', accent: 'acid' },
        { label: 'Router/App', detail: 'Kiest toegang en rol', accent: 'orange' },
        { label: 'Dashboard', detail: 'Juiste privéomgeving', accent: 'teal' },
      ],
    },
  },
  {
    id: 'loading-errors',
    number: 18,
    track: 'data',
    title: 'Wat ziet de gebruiker terwijl data nog niet klopt?',
    subtitle: 'Loading, leeg, fout en succes',
    objective: 'Je kunt voor een dataverzoek vier afzonderlijke UI-toestanden ontwerpen en controleren.',
    durationMinutes: 17,
    whyItMatters: 'Een lege lijst kan betekenen dat er echt niets is, dat laden nog bezig is of dat een verzoek is mislukt. Zonder duidelijke toestanden krijgt de gebruiker verkeerde informatie.',
    remember: 'Loading, fout, leeg en succes zijn vier verschillende producttoestanden.',
    file: 'Bijvoorbeeld src/features/developer/DeveloperDocsViewer.tsx',
    code: `if (loading) return <Loader />;
if (error) return <ErrorMessage message={error} />;
if (files.length === 0) return <EmptyState />;
return <DocumentsList files={files} />;`,
    explanation: [
      'Loading hoort zichtbaar te maken dat de app bezig is. Een error hoort uitleg en eventueel herstelactie te geven. Een lege toestand hoort te bevestigen dat het verzoek wel slaagde, maar geen items opleverde.',
      'De succesinterface mag pas verschijnen wanneer de benodigde data klaar is. Anders kunnen componenten proberen velden van null of undefined te lezen.',
    ],
    concepts: [
      { term: 'Loading state', meaning: 'Het verzoek is nog niet afgerond.', example: 'Spinner met statuslabel' },
      { term: 'Empty state', meaning: 'Het verzoek slaagde maar leverde geen items op.', example: 'Nog geen documenten' },
      { term: 'Error boundary', meaning: 'Vangt onverwachte renderfouten in een componentboom op.', example: 'SecureErrorBoundary' },
    ],
    dataFlow: [
      { from: 'Component', to: 'Service', data: 'Verzoek', reason: 'De data moet worden geladen.' },
      { from: 'Promise', to: 'State', data: 'loading, data of error', reason: 'React moet de actuele toestand kennen.' },
      { from: 'State', to: 'Gebruiker', data: 'Loader, fout, leeg of inhoud', reason: 'De interface moet eerlijk communiceren.' },
    ],
    pitfalls: [
      'Een catch die alleen console.error doet kan de gebruiker een eeuwige loader geven.',
      'Een fouttekst rechtstreeks uit een backend tonen kan te technisch of privacygevoelig zijn.',
    ],
    practice: {
      title: 'Maak een vierstatusreview',
      instruction: 'Test of één datacomponent loading, fout, nul resultaten en normale resultaten afzonderlijk kan tonen.',
      checklist: ['Loading is herkenbaar', 'Fout stopt loading', 'Leeg is geen fout', 'Succes gebruikt geldige data'],
    },
    aiPrompt: `Review deze asynchrone component op loading-, error-, empty- en success-state. Zoek ook race conditions, updates na unmount en fouten die alleen in de console verdwijnen.`,
    quiz: {
      question: 'Wat is het verschil tussen leeg en fout?',
      options: ['Er is geen verschil', 'Leeg betekent geslaagd zonder items; fout betekent dat het verzoek niet betrouwbaar slaagde', 'Fout betekent altijd dat de gebruiker is uitgelogd'],
      correctIndex: 1,
      explanation: 'De uitkomst en de betrouwbaarheid verschillen. Daarom horen ze een andere interface te krijgen.',
    },
    visual: {
      kind: 'comparison',
      title: 'Vier datatoestanden',
      caption: 'Een goede interface maakt het verschil zichtbaar en biedt passend vervolg.',
      nodes: [
        { label: 'Loading', detail: 'Nog bezig', accent: 'blue', children: ['status', 'geen dubbele actie'] },
        { label: 'Error', detail: 'Verzoek mislukt', accent: 'orange', children: ['uitleg', 'opnieuw proberen'] },
        { label: 'Empty', detail: 'Geslaagd, nul items', accent: 'purple', children: ['context', 'eerste actie'] },
        { label: 'Success', detail: 'Geldige data', accent: 'teal', children: ['inhoud', 'normale interactie'] },
      ],
    },
  },
];
