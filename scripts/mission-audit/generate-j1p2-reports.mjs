import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const DATE = '2026-08-02';
const BATCH = 'j1p2';
const SHA = '298c1bbf3051ffc3dde346fcaf8a4f14258666bf';
const VIEWPORTS = ['desktop', 'ipad-portrait', 'ipad-landscape', 'mobile'];

const commonGitDir = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
  encoding: 'utf8',
}).trim();
const repositoryRoot = path.dirname(commonGitDir);
const reportRoot = path.join(process.cwd(), 'business', 'dgskills-reviews');
const manifestPath = path.join(repositoryRoot, 'screenshots', 'mission-audit', 'batches', BATCH, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null;
if (!manifest || manifest.schemaVersion !== 2 || manifest.batch !== BATCH || manifest.productionSha !== SHA) {
  throw new Error('J1P2 evidence manifest is missing or fails the batch/SHA/schema contract');
}

const finding = (severity, status, text, file, needle) => ({ severity, status, text, file, needle });

const missions = [
  {
    id: 'prompt-master', title: 'Prompt Master', template: 'PromptMasterMission (handcrafted)',
    design: [
      finding('high', 'open', 'De vier-viewport Visual Precision Gate is nog niet compleet; iPad-portret heeft bovendien een native-capturedimensie die afwijkt van de ingestelde CSS-viewport.', 'src/features/missions/PromptMasterMission.tsx', 'export const PromptMasterMission'),
      finding('medium', 'open', 'De resultaatstaat toont bij uitgeschakelde beeldgeneratie veel uitleg tegelijk; tekstfit en primaire CTA moeten nog op mobiel worden bewezen.', 'src/features/missions/PromptMasterMission.tsx', 'Jouw Resultaat'),
    ],
    didactic: [
      finding('high', 'resolved', 'De succesdrempel en doelweergave volgen nu het actieve niveau in plaats van een vaste grens.', 'src/features/missions/promptMasterLogic.ts', 'calculatePromptMasterPassingPercentage'),
      finding('medium', 'open', 'De eindscore bewijst promptcriteria, maar nog niet dat leerlingen hun keuzes in eigen woorden kunnen verklaren.', 'src/config/missionGoals.ts', "'prompt-master':"),
    ],
    technical: [
      finding('high', 'resolved', 'Completion wacht op de auth-bound handler en wist autosave pas na duurzame bevestiging.', 'src/features/missions/PromptMasterMission.tsx', 'const completed = await onComplete(true);'),
      finding('medium', 'open', 'De native iPad-portretcapture levert 820x885 bij een gemeten CSS-viewport van 820x1180; de browsercaptureketen moet worden gecorrigeerd of expliciet anders gemodelleerd.', 'scripts/mission-audit/build-evidence-manifest.mjs', "'ipad-portrait': { width: 820, height: 1180 }"),
    ],
  },
  {
    id: 'game-programmeur', title: 'Game Programmeur', template: 'AI Lab / GamePreview',
    design: [
      finding('high', 'open', 'De volledige viewportmatrix en visuele eindstaat zijn nog niet vastgelegd.', 'src/features/ai-lab/AiLab.tsx', "selectedRole?.id === 'game-programmeur'"),
      finding('medium', 'open', 'Compacte game-controls en icon targets moeten op 390px nog op tappability worden beoordeeld.', 'src/features/games/GamePreview.tsx', 'export const GamePreview'),
    ],
    didactic: [
      finding('medium', 'open', 'De flow stimuleert iteratief testen, maar vraagt weinig expliciete reflectie op oorzaak en effect van een codewijziging.', 'src/config/agents/year1.tsx', "id: 'game-programmeur'"),
    ],
    technical: [
      finding('high', 'resolved', 'Ongeldige stepmarkers, cross-mission state en resetgedrag zijn genormaliseerd en met een contractcheck afgedekt.', 'src/hooks/useStepCompletion.ts', 'normalizeCompletedSteps'),
      finding('high', 'resolved', 'De lokale preview heeft een missiespecifieke gamefallback wanneer geen echte AI-sessie actief is.', 'src/hooks/useAgentLogic.ts', "selectedRole?.id === 'game-programmeur'"),
    ],
  },
  {
    id: 'ai-trainer', title: 'AI Trainer', template: 'AI Lab / TrainerPreview',
    design: [
      finding('high', 'open', 'Geen complete vier-viewportflow of completionbeeld beschikbaar.', 'src/features/ai-lab/previews/TrainerPreview.tsx', 'export const TrainerPreview'),
      finding('medium', 'open', 'Dataset, voorspelling en conclusie delen veel informatie; mobiele informatiehiërarchie moet visueel worden getoetst.', 'src/features/ai-lab/previews/TrainerPreview.tsx', 'canCompleteMission'),
    ],
    didactic: [
      finding('medium', 'open', 'Recovery na een verkeerde voorspelling is instructiegestuurd; de leerling hoeft de verbeterstrategie niet zelf te formuleren.', 'src/config/agents/year1.tsx', 'Na de eerste test geef je altijd een vervolgactie'),
      finding('medium', 'open', 'Dubbele of bijna gelijke trainingsvoorbeelden worden niet didactisch onderscheiden.', 'src/features/ai-lab/previews/TrainerPreview.tsx', 'hasBalancedDataset'),
    ],
    technical: [
      finding('high', 'resolved', 'Trainercompletion is losgemaakt van generieke stepcompletion en wacht op duurzame auth-bound completion.', 'src/features/ai-lab/previews/TrainerPreview.tsx', 'const completed = await onComplete?.();'),
      finding('high', 'resolved', 'Trainerdata herstelt uit lokale fallback en reset missiespecifiek.', 'src/hooks/useAgentLogic.ts', 'normalizeTrainerData'),
    ],
  },
  {
    id: 'chatbot-trainer', title: 'Chatbot Trainer', template: 'AI Lab / ChatbotTrainerPreview',
    design: [
      finding('high', 'open', 'De vier viewports en dashboardterugkeer zijn nog onbewezen.', 'src/features/ai-lab/previews/ChatbotTrainerPreview.tsx', 'export const ChatbotTrainerPreview'),
      finding('high', 'resolved', 'De builder en testweergave stapelen op smalle schermen in plaats van naast elkaar te blijven staan.', 'src/features/ai-lab/previews/ChatbotTrainerPreview.tsx', 'flex-1 flex flex-col md:flex-row'),
    ],
    didactic: [
      finding('medium', 'open', 'De fout-herstelroute test gedrag, maar laat de leerling de gekozen regel niet expliciet onderbouwen.', 'src/config/agents/year1.tsx', "id: 'chatbot-trainer'"),
    ],
    technical: [
      finding('high', 'resolved', 'Completion gebeurt pas in de conclusie en gebruikt de dedicated auth-bound handler.', 'src/features/ai-lab/AiLab.tsx', "completeMission?.('chatbot-trainer')"),
    ],
  },
  {
    id: 'verhalen-ontwerper', title: 'Verhalen Ontwerper', template: 'AI Lab / BookPreview',
    design: [
      finding('high', 'open', 'De boekflow is nog niet op alle vier viewports vastgelegd.', 'src/features/student/BookPreview.tsx', 'export const BookPreview'),
      finding('medium', 'open', 'Illustratieknoppen blijven visueel onderdeel van de boekervaring terwijl beeldgeneratie beleidsmatig is uitgeschakeld.', 'src/features/student/BookPreview.tsx', 'IMAGE_GENERATION_ENABLED = false'),
    ],
    didactic: [
      finding('medium', 'open', 'Het bewijs voor AI-illustratieprompts is zwak zolang illustraties niet beschikbaar zijn; de schrijfdoelen blijven wel uitvoerbaar.', 'src/config/missionGoals.ts', "'verhalen-ontwerper':"),
      finding('high', 'resolved', 'De vijfpagina-afspraak wordt nu ook technisch afgedwongen en niet alleen in de agentprompt genoemd.', 'src/hooks/useAgentLogic.ts', 'MAX_STORY_PAGES = 5'),
    ],
    technical: [
      finding('high', 'resolved', 'Hersteldata, PAGE-tags, IMG-targets en de zichtbare nieuwe-paginaflow worden allemaal op vijf pagina\'s begrensd.', 'src/hooks/useAgentLogic.ts', 'normalizeStoryBookData'),
      finding('medium', 'open', 'Een mislukte afbeelding toont nog een retry-achtige affordance terwijl de providerfunctie is uitgeschakeld.', 'src/features/student/BookPreview.tsx', 'Illustraties zijn tijdelijk niet beschikbaar'),
    ],
  },
  {
    id: 'game-director', title: 'Game Director', template: 'GameDirectorMission (handcrafted)',
    design: [
      finding('high', 'open', 'Canvas, blokkenpaneel en mobiele tabs zijn nog niet in vier viewportflows bewezen.', 'src/features/missions/GameDirectorMission.tsx', 'export const GameDirectorMission'),
      finding('high', 'resolved', 'Touch-drops worden naar het juiste geneste parentblok gerouteerd.', 'src/features/missions/game-director/CodeWorkspace.tsx', 'customEvent.detail?.parentId'),
    ],
    didactic: [
      finding('medium', 'open', 'De inhoudelijke checks zijn grotendeels structureel; een leerling hoeft nauwelijks uit te leggen waarom een blokcombinatie werkt.', 'src/config/missionGoals.ts', "'game-director':"),
    ],
    technical: [
      finding('high', 'resolved', 'Blokstate wordt opgeslagen en completion wist die state pas na bevestiging.', 'src/features/missions/GameDirectorMission.tsx', 'const completed = await onComplete(true);'),
      finding('medium', 'open', 'De werkruimte blijft complex stateful; reload van elke geneste blokvariant moet nog runtime worden bewezen.', 'src/features/missions/GameDirectorMission.tsx', 'useMissionAutoSave'),
    ],
  },
  {
    id: 'ai-tekengame', title: 'AI Tekengame', template: 'AI Lab / DrawingGamePreview',
    design: [
      finding('high', 'open', 'De canvas- en conclusieflow mist nog vier-viewportbewijs.', 'src/features/ai-lab/previews/DrawingGamePreview.tsx', 'export const DrawingGamePreview'),
      finding('high', 'resolved', 'De mobiele opbouw en naamgeving van canvascontrols zijn aangepast voor smallere schermen en assistive tech.', 'src/features/ai-lab/previews/DrawingGamePreview.tsx', 'aria-label'),
    ],
    didactic: [
      finding('medium', 'open', 'De missie laat vergelijken en raden, maar de leerling reflecteert niet expliciet op welke promptdetails het beeld herkenbaar maakten.', 'src/config/missionGoals.ts', "'ai-tekengame':"),
    ],
    technical: [
      finding('high', 'resolved', 'Completion is dedicated, auth-bound en niet langer een vroege levelcallback.', 'src/features/ai-lab/AiLab.tsx', "completeMission?.('ai-tekengame')"),
      finding('medium', 'open', 'De lokale fallback bevat willekeur, waardoor exacte herstel- en regressiestates niet altijd reproduceerbaar zijn.', 'src/features/ai-lab/previews/DrawingGamePreview.tsx', 'Math.random'),
    ],
  },
  {
    id: 'ai-beleid-brainstorm', title: 'AI Beleid Brainstorm', template: 'AI Lab / AiBeleidBrainstormPreview',
    design: [
      finding('high', 'open', 'Stemmen, eigen ideeën en completion missen nog volledige viewport- en reloadcaptures.', 'src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'export const AiBeleidBrainstormPreview'),
      finding('medium', 'open', 'Stemcontrols en lange beleidsideeën moeten nog op keyboard, tekstfit en focus worden beoordeeld.', 'src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'handleVote'),
    ],
    didactic: [
      finding('high', 'open', 'Completion telt nu alleen twee eigen regelideeën; reden en schoolcontext staan in de instructie maar worden niet gevalideerd.', 'src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'const canComplete = ownRuleIdeas.length >= 2'),
    ],
    technical: [
      finding('high', 'resolved', 'Privacycopy zegt eerlijk dat bijdragen aan account en school zijn gekoppeld en completion gebruikt de auth-bound handler.', 'src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'account en school'),
      finding('medium', 'open', 'Vote/load/reload-samenloop is nog niet runtime gevalideerd.', 'src/features/ai-lab/previews/AiBeleidBrainstormPreview.tsx', 'useEffect'),
    ],
  },
  {
    id: 'code-denker', title: 'Code Denker', template: 'ScenarioEngine',
    design: [
      finding('high', 'open', 'Wereldkaart, scenario en completion missen nog vier viewportflows.', 'src/features/missions/templates/scenario-engine/configs/code-denker.ts', "missionId: 'code-denker'"),
      finding('medium', 'open', 'De abstracte wereldkaart vraagt extra visuele vertaling voor leerlingen die de scenariovolgorde niet direct begrijpen.', 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'phases={config.rounds.map'),
    ],
    didactic: [
      finding('medium', 'open', 'De leerling kiest oplossingen, maar het bewijs vraagt nog weinig eigen uitleg over de gekozen denkstap.', 'src/config/missionGoals.ts', "'code-denker':"),
    ],
    technical: [
      finding('high', 'resolved', 'Rondecompletion wordt niet meer door een verborgen scoregrens geblokkeerd en wacht op duurzame completion.', 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'const completed = await onComplete(success);'),
      finding('medium', 'open', 'Beschadigde of verouderde autosavevormen hebben geen expliciete migratie-/foutstate.', 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'useMissionAutoSave'),
    ],
  },
  {
    id: 'website-bouwer', title: 'Website Bouwer', template: 'BuilderCanvas',
    design: [
      finding('high', 'open', 'Builder, preview en conclusie zijn nog niet in alle viewports vastgelegd.', 'src/features/missions/templates/builder-canvas/configs/website-bouwer.ts', "missionId: 'website-bouwer'"),
      finding('medium', 'open', 'De samengestelde preview valideert nog niet visueel of alle gekozen blokken correct en toegankelijk renderen.', 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx', '<PreviewPanel config={config} state={state} />'),
    ],
    didactic: [
      finding('high', 'resolved', 'De opdracht vraagt expliciet om fictieve of algemene gegevens en geen echte naam, school, adres, foto of contactinformatie.', 'src/features/missions/templates/builder-canvas/configs/website-bouwer.ts', 'fictieve'),
      finding('medium', 'open', 'De leerling bouwt HTML/CSS, maar echte syntactische validatie en uitleg van fouten blijven beperkt.', 'src/features/missions/templates/builder-canvas/configs/website-bouwer.ts', "textPrompt: 'Schrijf hier je HTML-basisstructuur'"),
    ],
    technical: [
      finding('high', 'resolved', 'Ruwe website-inhoud wordt niet naar de coachcontext gestuurd en completion wist pas na bevestiging.', 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx', 'const completed = await onComplete(true);'),
      finding('medium', 'open', 'Previewassemblage en keyboardbediening van alle buildercontrols moeten nog runtime worden getest.', 'src/features/missions/templates/builder-canvas/BuilderCanvas.tsx', 'export const BuilderCanvas'),
    ],
  },
  {
    id: 'schermtijd-coach', title: 'Schermtijd Coach', template: 'DebateArena',
    design: [
      finding('high', 'open', 'De lange argumentatie- en reflectieflow heeft nog geen vier-viewportbewijs.', 'src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts', "missionId: 'schermtijd-coach'"),
    ],
    didactic: [
      finding('high', 'open', 'Antwoordkwaliteit wordt vooral via lengte gemeten; inhoudelijk lege maar lange antwoorden kunnen completion halen.', 'src/features/missions/templates/debate-arena/DebateArena.tsx', 'trim().length >= 20'),
      finding('high', 'resolved', 'De derde reflectie vraagt nu een concreet eigen schermtijdakkoord en de SLO-claim is teruggebracht tot digitaal welzijn.', 'src/features/missions/templates/debate-arena/configs/schermtijd-coach.ts', 'Welke concrete afspraak wil jij zelf proberen'),
    ],
    technical: [
      finding('high', 'resolved', 'Completion wacht op de auth-bound handler en wist autosave alleen na succes.', 'src/features/missions/templates/debate-arena/DebateArena.tsx', 'const completed = await onComplete(true);'),
      finding('medium', 'open', 'De semantische kwaliteit van argumenten heeft geen lokale deterministische validator.', 'src/features/missions/templates/debate-arena/DebateArena.tsx', 'function calcScore'),
    ],
  },
  {
    id: 'notificatie-ninja', title: 'Notificatie Ninja', template: 'ScenarioEngine',
    design: [
      finding('high', 'open', 'De scenarioflow mist nog volledige viewport- en completioncaptures.', 'src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts', "missionId: 'notificatie-ninja'"),
      finding('medium', 'open', 'Veel meldingen, badges en keuzes kunnen op mobiel cognitief dicht worden; tekstfit en scanbaarheid zijn onbewezen.', 'src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts', 'rounds: ['),
    ],
    didactic: [
      finding('high', 'resolved', 'Doel en evidence beschrijven nu gemeten selectiegedrag in plaats van niet-gevraagde eigen uitleg.', 'src/config/missionGoals.ts', "'notificatie-ninja':"),
      finding('medium', 'open', 'Foutrecovery blijft vooral keuze-gestuurd en vraagt weinig transfer naar eigen notificatie-instellingen.', 'src/features/missions/templates/scenario-engine/configs/notificatie-ninja.ts', 'feedback'),
    ],
    technical: [
      finding('high', 'resolved', 'De gedeelde scenario-engine completion is duurzaam en wist pas na succes.', 'src/features/missions/templates/scenario-engine/ScenarioEngine.tsx', 'const completed = await onComplete(success);'),
    ],
  },
  {
    id: 'cloud-cleaner', title: 'Cloud Cleaner', template: 'CloudCleanerMission (handcrafted)',
    design: [
      finding('high', 'open', 'Bestandsboom, prullenbak en eindstaat zijn nog niet over vier viewports bewezen.', 'src/features/missions/review/CloudCleanerMission.tsx', 'export const CloudCleanerMission'),
      finding('high', 'resolved', 'De mobiele mapbediening staat niet langer als vaste overlay over de inhoud en interactieve items hebben keyboardrollen.', 'src/features/missions/review/CloudCleanerMission.tsx', 'onKeyDown'),
    ],
    didactic: [
      finding('high', 'open', 'De laatste bestandsplaatsing opent geen reflectievraag en de eind-CTA controleert niet of eerder een reflectie correct is beantwoord.', 'src/features/missions/review/CloudCleanerMission.tsx', 'if (!isLastFile && WHY_QUESTIONS[folderId])'),
      finding('medium', 'open', 'De leerling sorteert en verwijdert correct, maar transfer naar eigen cloudopruimregels wordt beperkt uitgevraagd.', 'src/config/missionGoals.ts', "'cloud-cleaner':"),
    ],
    technical: [
      finding('high', 'resolved', 'Een lege resterende bestandsset herstelt na reload naar de succes-CTA en completion wacht op bevestiging.', 'src/features/missions/review/CloudCleanerMission.tsx', 'remainingFileIds.length === 0'),
    ],
  },
  {
    id: 'layout-doctor', title: 'Layout Doctor', template: 'WordSimulator',
    design: [
      finding('high', 'open', 'De vaste Word-layout met brede sidebar en documentcanvas is zonder mobiele runtimecheck releaseblokkerend.', 'src/features/word-simulator/WordSimulator.tsx', 'w-[300px]'),
      finding('medium', 'open', 'Ribboncontrols en documentcanvas zijn nog niet op focus, overlap en horizontale overflow beoordeeld.', 'src/features/word-simulator/Ribbon.tsx', 'overflow-x-auto'),
    ],
    didactic: [
      finding('high', 'resolved', 'De inhoudsopgavecasus slaagt alleen bij de structurele marker van de echte TOC-action.', 'src/features/word-simulator/WordSimulator.tsx', 'LAYOUT_DOCTOR_TOC_SELECTOR'),
      finding('high', 'resolved', 'Dashboardmetadata toont nu zowel 21A als 22A.', 'src/features/student/ProjectZeroDashboard.tsx', "id: 'layout-doctor'"),
      finding('medium', 'open', 'Foutfeedback blijft dun bij verkeerde Word-acties; de leerling krijgt vooral hints vooraf.', 'src/features/word-simulator/WordSimulator.tsx', 'hint:'),
    ],
    technical: [
      finding('blocker', 'resolved', 'TOC-labels worden via textContent opgebouwd en de geserialiseerde HTML wordt voor insertHTML gesanitized.', 'src/features/word-simulator/WordSimulator.tsx', 'const safeToc = DOMPurify.sanitize'),
      finding('medium', 'open', 'Autosave bewaart vooral het casusniveau; volledige documentinhoud en simulatorstate zijn niet aantoonbaar reloadpersistent.', 'src/features/word-simulator/WordSimulator.tsx', 'useMissionAutoSave<{ levelIndex: number }>'),
    ],
  },
  {
    id: 'pitch-police', title: 'Pitch Police', template: 'PitchPoliceMission (handcrafted)',
    design: [
      finding('high', 'open', 'De slide-, inspectie- en mobiele drawerflow heeft nog geen vier-viewportbewijs.', 'src/features/missions/review/PitchPoliceMission.tsx', 'export const PitchPoliceMission'),
      finding('medium', 'open', 'Externe Giphy/Unsplash-media hebben geen lokale visuele fallback wanneer laden faalt.', 'src/features/missions/review/PitchPoliceMission.tsx', 'images.unsplash.com'),
    ],
    didactic: [
      finding('high', 'resolved', 'Goal en evidence claimen nu alleen de acht keuzes en zichtbare verbeteringen die de leerling echt uitvoert.', 'src/config/missionGoals.ts', "'pitch-police':"),
      finding('high', 'resolved', 'SLO- en basisvaardighedenmetadata staan onder de J1P2-review en zijn feitelijk geformuleerd.', 'src/config/slo-kerndoelen-mapping.ts', "id: 'pitch-police'"),
      finding('medium', 'open', 'Een fout antwoord geeft weinig uitleg waarom de gekozen verbetering niet past.', 'src/features/missions/review/PitchPoliceMission.tsx', 'Probeer het nog eens'),
    ],
    technical: [
      finding('high', 'resolved', 'De eind-CTA heeft een completionlock, await de auth-bound uitkomst en wist alleen bij expliciet succes.', 'src/features/missions/review/PitchPoliceMission.tsx', 'const completed = await onComplete(true);'),
    ],
  },
  {
    id: 'review-week-2', title: 'Review Week 2', template: 'ReviewArena',
    design: [
      finding('high', 'open', 'Vier rondetypen en de completionstate zijn nog niet op alle viewports vastgelegd.', 'src/features/missions/templates/review-arena/configs/review-week-2.ts', "missionId: 'review-week-2'"),
      finding('high', 'resolved', 'Categorie-zones zijn keyboardbedienbaar met role, tabIndex, Enter/Space en focusring.', 'src/features/missions/templates/review-arena/sub/Categorize.tsx', 'role="button"'),
    ],
    didactic: [
      finding('medium', 'open', 'De evidencezin legt nog meer nadruk op uitleg dan de sorteer-, match- en keuze-interacties feitelijk vragen.', 'src/config/missionGoals.ts', "'review-week-2':"),
      finding('medium', 'open', 'Agentmetadata beschrijft een oudere missieopzet dan de vier actieve rondes.', 'src/config/agents/year1.tsx', "id: 'review-week-2'"),
    ],
    technical: [
      finding('high', 'resolved', 'Ronde-afhandeling is vergrendeld en controleert fase, index en scorelengte tegen dubbelklikken of stale callbacks.', 'src/features/missions/templates/review-arena/ReviewArena.tsx', 'roundAdvanceLockRef'),
      finding('high', 'resolved', 'Completion is retrybaar en autosave wordt pas na bevestiging gewist.', 'src/features/missions/templates/review-arena/ReviewArena.tsx', 'const completionResult = await onComplete(true);'),
      finding('medium', 'open', 'Interne state van de actieve subronde wordt niet volledig in de parent-autosave bewaard.', 'src/features/missions/templates/review-arena/ReviewArena.tsx', 'roundScores'),
    ],
  },
];

const sourceCache = new Map();
const missingAnchors = [];
for (const mission of missions) {
  const viewportGate = mission.design.find((item) => item.severity === 'high' && item.status === 'open');
  if (viewportGate) {
    viewportGate.file = manifestPath;
    viewportGate.needle = `"${mission.id}": {`;
  }
}
function anchor(entry) {
  const absolute = path.isAbsolute(entry.file) ? entry.file : path.join(process.cwd(), entry.file);
  if (!sourceCache.has(absolute)) sourceCache.set(absolute, readFileSync(absolute, 'utf8').split('\n'));
  const lines = sourceCache.get(absolute);
  const index = lines.findIndex((line) => line.includes(entry.needle));
  if (index < 0) {
    missingAnchors.push(`${entry.file} :: ${entry.needle}`);
    return `${entry.file}:?`;
  }
  return `${entry.file}:${index + 1}`;
}

function countsFor(mission) {
  const counts = { blocker: 0, high: 0, medium: 0, low: 0 };
  for (const section of [mission.design, mission.didactic, mission.technical]) {
    for (const item of section) {
      if (!['blocker', 'high', 'medium', 'low'].includes(item.severity)) throw new Error(`Unknown severity: ${item.severity}`);
      if (!['open', 'resolved'].includes(item.status)) throw new Error(`Unknown finding status: ${item.status}`);
      if (item.status === 'open') counts[item.severity] += 1;
    }
  }
  return counts;
}

function viewportRows(missionId) {
  const records = manifest?.missions?.[missionId]?.viewports || {};
  return VIEWPORTS.map((viewport) => {
    const record = records[viewport];
    if (!record) return `| ${viewport} | missing | 0 | 0 | niet uitgevoerd |`;
    const dimensions = record.screenshots?.length
      ? [...new Set(record.screenshots.map((shot) => `${shot.actual?.width ?? '?'}x${shot.actual?.height ?? '?'}`))].join(', ')
      : 'niet uitgevoerd';
    return `| ${viewport} | ${record.status} | ${record.checkpointCount} | ${record.validPngCount} | ${dimensions} |`;
  }).join('\n');
}

function sectionMarkdown(title, findings) {
  const lines = findings.map((item) => {
    const label = item.status === 'resolved' ? 'opgelost in batch' : 'open';
    return `- **${item.severity.toUpperCase()} - ${label}:** ${item.text} (${anchor(item)})`;
  });
  return `## ${title}\n\n${lines.join('\n')}`;
}

function reportFor(mission) {
  const counts = countsFor(mission);
  const missionEvidence = manifest?.missions?.[mission.id];
  const evidenceComplete = missionEvidence?.status === 'complete';
  const verdict = evidenceComplete && counts.blocker === 0 && counts.high === 0 ? 'ship' : 'fix-eerst';
  return `# ${mission.title} - missieaudit ${DATE}

- **missionId:** \`${mission.id}\`
- **Curriculum:** Leerjaar 1, periode 2
- **Template/route:** ${mission.template}
- **Bron-SHA:** \`${SHA}\`
- **Aanbeveling:** **${verdict}**
- **Bewijsstatus:** ${evidenceComplete ? 'vier lokale viewportsets compleet' : 'onvolledig; geen releaseclaim'}

## Severitytelling

| Blocker open | High open | Medium open | Low open |
|---:|---:|---:|---:|
| ${counts.blocker} | ${counts.high} | ${counts.medium} | ${counts.low} |

${sectionMarkdown('Design', mission.design)}

${sectionMarkdown('Didactiek', mission.didactic)}

${sectionMarkdown('Techniek', mission.technical)}

## Viewport- en checkpointmatrix

| Viewport | Status | Checkpoints | Geldige PNG | Vastgelegde afmetingen |
|---|---|---:|---:|---|
${viewportRows(mission.id)}

## Flowbewijs

- Intro, normale interactie, bewuste fout, herstel/hint, mid-flow, eindstaat en dashboardprogress tellen pas als bewezen wanneer ze in de viewportset en het batchmanifest staan.
- Mobiele productiecompletion, reload en dashboard-/portfolio-readback zijn nog niet uitgevoerd voor deze missie.
- De lokale preview is side-effectvrij en bewijst geen productie-auth, XP, Supabase-write of dashboardpersistentie.

## Onzekerheden

- **Echte iPad-check nodig:** Chromium-/interne-browserviewportbewijs is geen fysieke iPad- of Safari-test.
- De externe Opus 5/high-controle is nog geblokkeerd door ontbrekende Claude-authenticatie.
- Dit rapport gebruikt uitsluitend actuele broncode en evidence op bovengenoemde SHA; oudere rapporten zijn geen afrondingsbewijs.
`;
}

for (const mission of missions) {
  for (const section of [mission.design, mission.didactic, mission.technical]) {
    for (const item of section) anchor(item);
  }
}
if (missingAnchors.length > 0) {
  throw new Error(`Missing report anchors:\n${[...new Set(missingAnchors)].join('\n')}`);
}

mkdirSync(reportRoot, { recursive: true });
for (const mission of missions) {
  writeFileSync(path.join(reportRoot, `${mission.id}-${DATE}.md`), reportFor(mission));
}

const batchRows = missions.map((mission) => {
  const counts = countsFor(mission);
  const evidence = manifest?.missions?.[mission.id]?.status || 'missing';
  const verdict = evidence === 'complete' && counts.blocker === 0 && counts.high === 0 ? 'ship' : 'fix-eerst';
  return `| [${mission.id}](${mission.id}-${DATE}.md) | ${counts.blocker} | ${counts.high} | ${counts.medium} | ${evidence} | ${verdict} |`;
}).join('\n');

const batchSummary = `# Leerjaar 1 periode 2 - batchaudit ${DATE}

- **Bron-SHA:** \`${SHA}\`
- **Omvang:** 16 missies
- **Batchstatus:** **niet releaseklaar**
- **Manifest:** \`${manifestPath}\`
- **Productiemutaties J1P2:** 0
- **Tijdelijke J1P2-accounts:** nog niet aangemaakt

| Missie | Blocker open | High open | Medium open | Viewportbewijs | Advies |
|---|---:|---:|---:|---|---|
${batchRows}

## Bewijsstatus van checks

- Deze rapportgenerator voert contractscripts, doctor, build en security niet zelf uit. Zonder afzonderlijk machineleesbaar verificatiebewijs worden die checks hier niet als releasebewijs geclaimd.
- De losse \`mark_mission_completed\`-RPC bindt aan \`auth.uid()\` en voegt missionIds idempotent toe; de volledige completion- en XP-keten heeft nog open permission- en idempotentierisico's.
- Alleen viewportsets met een geldige \`capture.json\`, schoon bronbewijs, semantische checkpointlabels, actuele hashes en geldige afmetingen tellen mee.

## Open releasegates

- De volledige 16 x 4 viewportmatrix ontbreekt. Prompt Master iPad-portret staat partial door 820x885 native capturebestanden bij een gemeten CSS-viewport van 820x1180.
- Mobiele productiecompletion, reload en dashboard-/portfolio-readback ontbreken voor alle 16 missies.
- De lokale RLS-functiecheck stopt op ontbrekende tabel \`public.feedback\`; dit is lokale schema-/harnessdrift en geen groene permissiongate.
- Een machineleesbaar verificatiebewijs voor contracts, doctor, build en security ontbreekt nog.
- Opus 5/high is niet uitgevoerd omdat Claude CLI niet is ingelogd.
- PR-, Vercel-, merge-, productiehercontrole-, evidence-PR-, Release-ZIP- en cleanupbewijs ontbreken.

## Bewijsbeperking

Vier interne browserchats en responsieve viewportmetingen zouden nog steeds geen vier geïsoleerde productieaccounts of een fysieke Safari/iPad-test bewijzen.
`;
writeFileSync(path.join(reportRoot, `j1p2-batch-${DATE}.md`), batchSummary);

const masterIndex = `# DGSkills J1P2 masterindex - ${DATE}

- [Batchsamenvatting](j1p2-batch-${DATE}.md)
- Machineleesbaar manifest: \`${manifestPath}\`

## Missierapporten

${missions.map((mission, index) => `${index + 1}. [${mission.title}](${mission.id}-${DATE}.md)`).join('\n')}

## Releasebesluit

**Fix-eerst.** De bronfixes en lokale checks zijn sterk verbeterd, maar de vereiste browser-, productie-, onafhankelijke-review-, release- en cleanupgates zijn nog niet compleet.
`;
writeFileSync(path.join(reportRoot, `j1p2-master-index-${DATE}.md`), masterIndex);

console.log(`Generated ${missions.length} mission reports, batch summary and master index.`);
