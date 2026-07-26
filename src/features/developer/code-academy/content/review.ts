import type { AcademyLesson } from '../types';

export const REVIEW_LESSONS: AcademyLesson[] = [
  {
    id: 'student-dashboard',
    number: 19,
    track: 'review',
    title: 'Hoe bouwt het leerlingdashboard de opdrachtlijst?',
    subtitle: 'Curriculum, periode en voortgang samenbrengen',
    objective: 'Je kunt de invoer van ProjectZeroDashboard koppelen aan de uiteindelijke zichtbare missies.',
    durationMinutes: 22,
    whyItMatters: 'Dit is de plek waar leerlingen ervaren welke opdrachten bestaan, open zijn en afgerond zijn. Kleine fouten hebben daardoor direct grote UX-impact.',
    remember: 'ProjectZeroDashboard combineert curriculum, schoolplanning, rechten en voortgang tot de zichtbare missielijst.',
    file: 'src/features/student/ProjectZeroDashboard.tsx',
    code: `const currentMissions = useMemo(() => {
  let missions = isCustomSchedule && activeContainer
    ? buildMissionsFromContainer(activeContainer)
    : buildMissionsForPeriod(currentYearGroup, activeWeek);

  return applyMissionRules(missions);
}, [currentYearGroup, activeWeek, permissions, stats]);`,
    explanation: [
      'Het dashboard ontvangt onder andere activeWeek, activeYearGroup, containers, userRole en stats. Op basis daarvan kiest het een curriculumperiode of aangepaste schoolcontainer.',
      'Daarna volgen regels voor developerbypass, publieke demo, klasbeperking, docenttoestemming en herhalingspoorten. Pas daarna worden review- en hoofdmissies gescheiden en als kaarten weergegeven.',
    ],
    concepts: [
      { term: 'Afgeleide data', meaning: 'Data die uit andere waarden wordt berekend.', example: 'currentMissions uit week, jaar en rechten' },
      { term: 'Curriculumconfig', meaning: 'Vaste indeling van leerjaar en periode.', example: 'getPeriodConfig' },
      { term: 'Schoolcontainer', meaning: 'Aangepaste planning voor een school.', example: 'buildMissionsFromContainer' },
    ],
    dataFlow: [
      { from: 'AuthenticatedApp', to: 'Dashboard', data: 'week, leerjaar, stats, rol, containers', reason: 'De context bepaalt de lijst.' },
      { from: 'Curriculum of container', to: 'missionBuilder', data: 'Mission-id’s en metadata', reason: 'De basislijst wordt gebouwd.' },
      { from: 'Rechten en voortgang', to: 'currentMissions', data: 'status en filters', reason: 'De lijst krijgt beschikbaarheid.' },
      { from: 'currentMissions', to: 'Kaarten', data: 'Mission-objecten', reason: 'De leerling ziet de uitkomst.' },
    ],
    pitfalls: [
      'Te veel regels in één useMemo maken het moeilijk te zien welke regel een missie vergrendelt.',
      'Een dependency vergeten kan zorgen dat de lijst niet vernieuwt wanneer rechten of voortgang veranderen.',
    ],
    practice: {
      title: 'Volg één missie door alle regels',
      instruction: 'Kies prompt-master en noteer voor iedere filter- of lockstap of de missie zichtbaar, open of vergrendeld blijft.',
      checklist: ['Ik bepaal de basislijst', 'Ik controleer klas en periode', 'Ik controleer reviewgate', 'Ik controleer voltooiing'],
    },
    aiPrompt: `Traceer missie prompt-master door ProjectZeroDashboard. Geef per regel aan welke invoer de status kan veranderen en toon de uiteindelijke kaartstatus voor student, docent en developer.`,
    quiz: {
      question: 'Welke informatie bepaalt currentMissions?',
      options: ['Alleen de schermbreedte', 'Onder andere leerjaar, periode, rechten en voortgang', 'Alleen de titel van de missie'],
      correctIndex: 1,
      explanation: 'De missielijst is afgeleide productdata uit meerdere bronnen.',
    },
    visual: {
      kind: 'layers',
      title: 'De missielijst in lagen',
      caption: 'Van brede basislijst naar een leerling-specifieke zichtbare lijst.',
      nodes: [
        { label: 'Curriculum/container', detail: 'Welke missies bestaan?', accent: 'blue' },
        { label: 'Klas en periode', detail: 'Welke zijn relevant?', accent: 'teal' },
        { label: 'Rechten en gates', detail: 'Welke zijn open?', accent: 'orange' },
        { label: 'Voortgang', detail: 'Welke zijn voltooid?', accent: 'acid' },
        { label: 'Kaarten', detail: 'Wat ziet de leerling?', accent: 'purple' },
      ],
    },
  },
  {
    id: 'mission-builder',
    number: 20,
    track: 'review',
    title: 'Waar krijgt een missie haar vorm?',
    subtitle: 'MissionBuilder als fabriek',
    objective: 'Je kunt uitleggen hoe een missie-id wordt verrijkt met titel, beschrijving, iconen en SLO-metadata.',
    durationMinutes: 20,
    whyItMatters: 'Wanneer een kaart verkeerde tekst, status of metadata toont, moet je onderscheid maken tussen curriculumbron, builder en dashboardregels.',
    remember: 'MissionBuilder zet configuratie-id’s om in volledige Mission-objecten voor de interface.',
    file: 'src/utils/missionBuilder.tsx',
    code: `export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon' | 'locked';
  sloKerndoelen?: SloKerndoelCode[];
}`,
    explanation: [
      'Het curriculum bevat welke missie-id’s bij een periode horen. De builder zoekt aanvullende informatie op in agents, overrides en SLO-mapping en bouwt één consistent Mission-object.',
      'Overrides corrigeren of verrijken specifieke missies zonder alle metadata op meerdere plekken te dupliceren. Daardoor is het belangrijk te weten welke bron voor ieder veld leidend is.',
    ],
    concepts: [
      { term: 'Builder', meaning: 'Functie die uit losse bronnen een compleet object maakt.', example: 'buildMissionsForPeriod' },
      { term: 'Override', meaning: 'Gerichte vervanging of aanvulling van standaardwaarden.', example: 'MISSION_OVERRIDES' },
      { term: 'Single source of truth', meaning: 'Eén leidende bron voor een gegeven.', example: 'Curriculum voor periode-indeling' },
    ],
    dataFlow: [
      { from: 'curriculum', to: 'missionBuilder', data: 'Mission-id’s', reason: 'De periode bepaalt welke missies horen.' },
      { from: 'agents en overrides', to: 'missionBuilder', data: 'Titel, uitleg, iconen', reason: 'De id krijgt productmetadata.' },
      { from: 'SLO-mapping', to: 'missionBuilder', data: 'Kerndoelen', reason: 'Onderwijsdoelen worden gekoppeld.' },
      { from: 'missionBuilder', to: 'Dashboard', data: 'Mission[]', reason: 'De UI krijgt consistente objecten.' },
    ],
    pitfalls: [
      'Dezelfde titel of beschrijving op meerdere plekken beheren kan tegenstrijdige waarden opleveren.',
      'Een nieuwe curriculum-id zonder metadata kan een generieke of kapotte kaart veroorzaken.',
    ],
    practice: {
      title: 'Vind alle bronnen van één missie',
      instruction: 'Zoek game-programmeur in curriculum, agents, overrides en SLO-mapping en noteer welk veld uit welke bron komt.',
      checklist: ['Ik vind de periode', 'Ik vind de inhoud', 'Ik vind eventuele override', 'Ik vind kerndoelen'],
    },
    aiPrompt: `Maak een herkomstmatrix voor missie game-programmeur. Zet ieder Mission-veld naast de repositorybron die de uiteindelijke waarde bepaalt en meld conflicten.`,
    quiz: {
      question: 'Wat is de kernfunctie van MissionBuilder?',
      options: ['CSS-bestanden comprimeren', 'Losse configuratiebronnen omzetten in volledige Mission-objecten', 'Gebruikers automatisch promoveren'],
      correctIndex: 1,
      explanation: 'De builder vormt productdata voor het dashboard uit id’s en metadata.',
    },
    visual: {
      kind: 'data',
      title: 'De missiefabriek',
      caption: 'Meerdere bronnen komen samen in één objectcontract.',
      nodes: [
        { label: 'Curriculum', detail: 'id en periode', accent: 'blue' },
        { label: 'Agents', detail: 'titel en inhoud', accent: 'teal' },
        { label: 'Overrides', detail: 'gerichte aanpassing', accent: 'orange' },
        { label: 'SLO-mapping', detail: 'kerndoelen', accent: 'purple' },
        { label: 'Mission', detail: 'één compleet object', accent: 'acid' },
      ],
    },
  },
  {
    id: 'mission-card-flow',
    number: 21,
    track: 'review',
    title: 'Wat gebeurt er bij Start missie?',
    subtitle: 'Van kaartklik naar missiecomponent',
    objective: 'Je kunt de volledige gebruikersflow van opdrachtkaart naar actieve missie volgen.',
    durationMinutes: 18,
    whyItMatters: 'Een knop kan visueel correct zijn terwijl navigatie, mission-id of renderrouter faalt. De end-to-end flow laat zien waar bewijs nodig is.',
    remember: 'De kaart meldt mission.id; navigatiestate bewaart de keuze; AuthenticatedApp rendert de juiste missie.',
    file: 'ProjectZeroDashboard.tsx → useNavigation.ts → AuthenticatedApp.tsx',
    code: `onClick={() => onSelectModule(mission.id)}

// ouder
handleSelectModule(missionId)

// render
if (activeModule === 'prompt-master') {
  return <PromptMasterMission />;
}`,
    explanation: [
      'StudentProjectCard kent alleen de missie en callback. De kaart hoeft niet te weten welke grote component achter een id zit. Dat blijft de verantwoordelijkheid van de app-shell.',
      'Voor template-missies bestaat een generieke TemplateMissionRouter. Voor enkele gespecialiseerde missies bevat AuthenticatedApp een expliciete renderroute.',
    ],
    concepts: [
      { term: 'Selection callback', meaning: 'Meldt welke missie de gebruiker koos.', example: 'onSelectModule(mission.id)' },
      { term: 'Navigatiestate', meaning: 'Bewaart het actieve onderdeel.', example: 'activeModule' },
      { term: 'Mission router', meaning: 'Koppelt een missie-id aan een component.', example: 'TemplateMissionRouter' },
    ],
    dataFlow: [
      { from: 'StudentProjectCard', to: 'Dashboardcallback', data: 'mission.id', reason: 'De keuze wordt gemeld.' },
      { from: 'Dashboardcallback', to: 'useNavigation', data: 'Geselecteerde module', reason: 'De app bewaart navigatiestate.' },
      { from: 'activeModule', to: 'AuthenticatedApp', data: 'Mission-id', reason: 'De juiste renderroute wordt gekozen.' },
      { from: 'Missiecomponent', to: 'Gebruiker', data: 'Interactieve opdracht', reason: 'De flow eindigt zichtbaar.' },
    ],
    pitfalls: [
      'Een kaart-id die niet overeenkomt met router-id opent geen missie.',
      'Een exitcallback die state niet volledig reset kan de volgende navigatie vervuilen.',
    ],
    practice: {
      title: 'Test de keten op drie niveaus',
      instruction: 'Controleer de kaartklik, de activeModule-wijziging en het renderen van de missie afzonderlijk.',
      checklist: ['Klik geeft juiste id', 'State bevat juiste id', 'Juiste component opent', 'Terugknop reset de state'],
    },
    aiPrompt: `Traceer de Start missie-flow end-to-end. Geef voor iedere stap bestand, functie, input, output, stateverandering, foutpad en passende test.`,
    quiz: {
      question: 'Waarom opent StudentProjectCard niet zelf direct PromptMasterMission?',
      options: ['Omdat de kaart alleen selectie hoort te melden en de app-shell centrale navigatie beheert', 'Omdat knoppen geen componenten mogen openen', 'Omdat prompt-master extern is'],
      correctIndex: 0,
      explanation: 'De scheiding houdt de kaart herbruikbaar en de navigatie centraal.',
    },
    visual: {
      kind: 'flow',
      title: 'De volledige startflow',
      caption: 'Een werkende knop vereist dat alle vier schakels hetzelfde missie-id begrijpen.',
      nodes: [
        { label: 'Kaartklik', detail: 'mission.id', accent: 'blue' },
        { label: 'Callback', detail: 'handleSelectModule', accent: 'acid' },
        { label: 'State', detail: 'activeModule', accent: 'orange' },
        { label: 'Router', detail: 'id → component', accent: 'purple' },
        { label: 'Missie', detail: 'Zichtbare opdracht', accent: 'teal' },
      ],
    },
  },
  {
    id: 'permissions-locks',
    number: 22,
    track: 'review',
    title: 'Waarom staat een missie op slot?',
    subtitle: 'Rechten, cache en realtime updates',
    objective: 'Je kunt uitleggen hoe game_permissions, lokale cache en dashboardregels samen beschikbaarheid bepalen.',
    durationMinutes: 22,
    whyItMatters: 'Een onterecht open of gesloten missie raakt onderwijsplanning en toegang. Dit vereist controle van zowel data als UI-regels.',
    remember: 'PermissionService levert schoolrechten; het dashboard vertaalt die rechten plus voortgang naar kaartstatus.',
    file: 'src/services/PermissionService.ts en ProjectZeroDashboard.tsx',
    code: `const unsubscribe = subscribeToPermissions(schoolId, setPermissions);

const enabledGames = permissions?.enabled_games || [];
const isWeekEnabled =
  !permissions ||
  enabledGames.length === 0 ||
  enabledGames.includes('week-' + activeWeek);`,
    explanation: [
      'PermissionService leest een schoolrij, bewaart vijf minuten een lokale cache en luistert via Supabase Realtime naar databasewijzigingen. Bij een wijziging wordt de cache ongeldig en de actuele data opnieuw gelezen.',
      'Het dashboard gebruikt enabled_games voor periodevrijgave en combineert dit met klasrestricties en reviewgates. Developer- en docentenrollen kunnen bepaalde sloten omzeilen voor beheer en controle.',
    ],
    concepts: [
      { term: 'Permission', meaning: 'Een regel die bepaalt wat beschikbaar is.', example: 'enabled_games' },
      { term: 'Realtime subscription', meaning: 'Live melding wanneer een tabel verandert.', example: 'postgres_changes' },
      { term: 'Review gate', meaning: 'Vereiste herhalingen voordat latere missies openen.', example: 'allReviewsDone' },
    ],
    dataFlow: [
      { from: 'Docent', to: 'game_permissions', data: 'Ingeschakelde periode of game', reason: 'De planning wordt gepubliceerd.' },
      { from: 'Supabase', to: 'PermissionService', data: 'Rij en realtime event', reason: 'Clients krijgen actuele rechten.' },
      { from: 'PermissionService', to: 'Dashboard', data: 'GamePermissions', reason: 'De UI past de lockregels toe.' },
      { from: 'Dashboard', to: 'MissionCard', data: 'available of locked', reason: 'De leerling ziet de status.' },
    ],
    pitfalls: [
      'Een standaard bij fout die alles opent kan onbedoelde toegang geven; een standaard die alles sluit kan onderwijs blokkeren.',
      'Een cache zonder school- of leerjaarscope kan rechten tussen contexten vermengen.',
    ],
    practice: {
      title: 'Diagnoseer een gesloten missie',
      instruction: 'Werk een vaste checklist af voor een missie die volgens de docent open hoort te zijn.',
      checklist: ['Juiste schoolrij', 'Realtime of cache vernieuwd', 'Periode enabled', 'Klasrestrictie klopt', 'Reviewgate afgerond'],
    },
    aiPrompt: `Diagnoseer waarom deze missie locked is. Volg databasewaarde, cachekey, realtime-update, dashboardfilters, rolbypass en reviewgate. Maak geen aanname zonder codebewijs.`,
    quiz: {
      question: 'Waar wordt de uiteindelijke kaartstatus vooral bepaald?',
      options: ['Alleen in Supabase', 'Door rechten uit de service plus dashboardregels en voortgang', 'Alleen door CSS-opacity'],
      correctIndex: 1,
      explanation: 'Supabase levert input; het dashboard vertaalt meerdere signalen naar de status.',
    },
    visual: {
      kind: 'cycle',
      title: 'Rechten blijven actueel',
      caption: 'Write, realtime melding, cacheverversing en nieuwe kaartstatus vormen één keten.',
      nodes: [
        { label: 'Docentwijziging', detail: 'Permission write', accent: 'orange' },
        { label: 'Supabase', detail: 'Slaat rij op', accent: 'purple' },
        { label: 'Realtime', detail: 'Meldt verandering', accent: 'blue' },
        { label: 'Cache/read', detail: 'Verse rechten', accent: 'acid' },
        { label: 'Dashboard', detail: 'Kaartstatus vernieuwt', accent: 'teal' },
      ],
    },
  },
  {
    id: 'pull-request-review',
    number: 23,
    track: 'review',
    title: 'Hoe beoordeel je een AI-pull-request?',
    subtitle: 'Van claim naar verifieerbaar bewijs',
    objective: 'Je kunt een pull request beoordelen op scope, gebruikersflow, data, risico en bewijs.',
    durationMinutes: 25,
    whyItMatters: 'AI kan overtuigende samenvattingen geven die niet volledig door code of tests worden gedragen. Een vaste reviewmethode voorkomt schijnzekerheid.',
    remember: 'Beoordeel niet de uitleg van AI, maar het verschil in code en het bewijs dat de bedoelde flow werkt.',
    file: 'GitHub → Pull request → Files changed en checks',
    code: `1. Doel en scope
2. Gewijzigde bestanden
3. Gebruikersflow vóór en na
4. Data, auth en security
5. Loading, fout en edge cases
6. Gerichte tests
7. Handmatige controle
8. Claims die niet bewezen zijn`,
    explanation: [
      'Begin bij het productprobleem en controleer of de diff uitsluitend noodzakelijke bestanden raakt. Volg daarna één concrete gebruikersactie door alle gewijzigde lagen.',
      'Een groene build bewijst dat code kan compileren, niet dat UX, rechten en foutpaden correct zijn. Zoek tests die specifiek falen wanneer de nieuwe functionaliteit kapotgaat.',
    ],
    concepts: [
      { term: 'Diff', meaning: 'Het verschil tussen oude en nieuwe code.', example: 'GitHub Files changed' },
      { term: 'Regressie', meaning: 'Bestaand gedrag dat door de wijziging breekt.', example: 'Leerlingdashboard opent niet meer' },
      { term: 'Bewijsketen', meaning: 'Code, test en observatie die samen een claim dragen.', example: 'Test + build + handmatige flow' },
    ],
    dataFlow: [
      { from: 'PR-beschrijving', to: 'Reviewer', data: 'Claim en doel', reason: 'De bedoelde verandering wordt afgebakend.' },
      { from: 'Diff', to: 'Reviewer', data: 'Werkelijke codewijzigingen', reason: 'De claim wordt met implementatie vergeleken.' },
      { from: 'Tests en checks', to: 'Reviewer', data: 'Automatisch bewijs', reason: 'Specifieke fouten moeten detecteerbaar zijn.' },
      { from: 'Preview', to: 'Reviewer', data: 'Werkelijke gebruikerservaring', reason: 'Visueel en interactief gedrag wordt gecontroleerd.' },
    ],
    pitfalls: [
      'Een groot aantal gewijzigde regels kan relevante risico’s verbergen achter veel cosmetische wijzigingen.',
      'Tests die alleen tekst in bronbestanden zoeken bewijzen minder dan gedragstests van de gebruikersflow.',
    ],
    practice: {
      title: 'Review één kleine PR',
      instruction: 'Schrijf een review met drie kolommen: claim, bewijs en resterende onzekerheid.',
      checklist: ['Ik benoem scope', 'Ik volg één flow', 'Ik controleer data/security', 'Ik noem onbewezen claims'],
    },
    aiPrompt: `Review deze pull request tegensprekend in plaats van bevestigend. Zoek te sterke claims, ontbrekende tests, regressierisico, auth/data-impact en wijzigingen buiten scope. Zeg expliciet wat niet verifieerbaar is.`,
    quiz: {
      question: 'Wat bewijst een geslaagde productiebuild niet?',
      options: ['Dat de code syntactisch en technisch gebouwd kon worden', 'Dat iedere gebruikersflow, permissie en fouttoestand correct werkt', 'Dat imports kunnen worden gebundeld'],
      correctIndex: 1,
      explanation: 'Een build is noodzakelijk bewijs, maar geen volledige gedragsvalidatie.',
    },
    visual: {
      kind: 'comparison',
      title: 'Claim tegenover bewijs',
      caption: 'Een sterke review verbindt iedere conclusie aan concreet controleerbaar materiaal.',
      nodes: [
        { label: 'AI-claim', detail: 'Werkt, veilig, sneller', accent: 'orange', children: ['samenvatting', 'zelfrapportage'] },
        { label: 'Controleerbaar bewijs', detail: 'Diff, test, check, preview', accent: 'acid', children: ['code', 'gedrag', 'metingen'] },
      ],
    },
  },
  {
    id: 'quality-gates',
    number: 24,
    track: 'review',
    title: 'Wanneer is een wijziging klaar?',
    subtitle: 'Typecheck, tests, security, performance en preview',
    objective: 'Je kunt een passende verificatieset kiezen op basis van het soort wijziging.',
    durationMinutes: 24,
    whyItMatters: 'Niet iedere check bewijst hetzelfde. Een goede gate combineert snelle statische controle met gerichte gedragstests en een echte gebruikerscontrole.',
    remember: 'Klaar betekent: de vereisten zijn bewezen door passende onafhankelijke controles, niet alleen door één groene check.',
    file: 'package.json, tests/, scripts/ en GitHub Actions',
    code: `npm run typecheck:app
npm run build:prod
node --test tests/developer/code-academy.test.mjs
npm run audit:security
npm run performance:ci`,
    explanation: [
      'Typecheck controleert TypeScript-contracten. Build controleert bundeling en prerender. Gerichte tests controleren afgesproken gedrag. Security- en performancechecks onderzoeken andere risicoklassen.',
      'Welke checks nodig zijn hangt af van de wijziging. Een auth-aanpassing vraagt andere bewijslast dan een tekstcorrectie. De reviewer moet ook checken of de test zelf het defect werkelijk zou detecteren.',
    ],
    concepts: [
      { term: 'Typecheck', meaning: 'Controle van TypeScript-contracten zonder uitvoeren.', example: 'tsc --noEmit' },
      { term: 'Gedragstest', meaning: 'Test die een echte functie of gebruikersflow controleert.', example: 'Klik opent missie' },
      { term: 'Quality gate', meaning: 'Voorwaarde die groen moet zijn vóór samenvoegen.', example: 'CI-check op pull request' },
    ],
    dataFlow: [
      { from: 'Codewijziging', to: 'Typecheck', data: 'TypeScript-bron', reason: 'Contractfouten worden vroeg gevonden.' },
      { from: 'Codewijziging', to: 'Gerichte test', data: 'Verwacht gedrag', reason: 'De feature moet aantoonbaar werken.' },
      { from: 'Build', to: 'Preview', data: 'Gebundelde app', reason: 'De werkelijke omgeving moet laden.' },
      { from: 'Reviewbewijs', to: 'Mergebesluit', data: 'Checks en resterende risico’s', reason: 'Samenvoegen moet verantwoord zijn.' },
    ],
    pitfalls: [
      'Een test kan groen zijn omdat hij het relevante gedrag nooit uitvoert.',
      'Een check die queued of niet uitgevoerd is mag niet als geslaagd worden gerapporteerd.',
    ],
    practice: {
      title: 'Kies een gate per risico',
      instruction: 'Koppel voor een UI-, auth-, database- en performancewijziging minimaal één passende automatische en één handmatige controle.',
      checklist: ['UI heeft visuele flowcheck', 'Auth heeft sessie- en roltest', 'Database heeft rechten- en writecheck', 'Performance heeft echte meting'],
    },
    aiPrompt: `Ontwerp een minimale maar voldoende verificatiematrix voor deze diff. Koppel iedere check aan een concreet risico en zeg wat de check niet bewijst. Rapporteer queued of ontbrekende checks niet als geslaagd.`,
    quiz: {
      question: 'Welke combinatie geeft het sterkste bewijs voor een nieuwe interactieve feature?',
      options: ['Alleen typecheck', 'Gerichte gedragstest, geslaagde build en handmatige previewflow', 'Alleen een AI-samenvatting'],
      correctIndex: 1,
      explanation: 'De combinatie dekt contract, bouwbaarheid en werkelijk gedrag beter af dan één controle.',
    },
    visual: {
      kind: 'layers',
      title: 'De bewijslagen',
      caption: 'Hogere zekerheid ontstaat door verschillende onafhankelijke controles te stapelen.',
      nodes: [
        { label: 'Typecheck', detail: 'Contracten', accent: 'blue' },
        { label: 'Gerichte tests', detail: 'Gedrag', accent: 'acid' },
        { label: 'Build en security', detail: 'Integratie en risico', accent: 'purple' },
        { label: 'Preview', detail: 'Werkelijke gebruikersflow', accent: 'teal' },
        { label: 'Review', detail: 'Claims en onzekerheden', accent: 'orange' },
      ],
    },
  },
];
