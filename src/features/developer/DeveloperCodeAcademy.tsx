import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Code2,
  GitPullRequest,
  LayoutDashboard,
  Lock,
  Play,
  RotateCcw,
  Route,
  Sparkles,
} from 'lucide-react';

type Lesson = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  remember: string;
  file: string;
  code: string;
  steps: Array<{ title: string; text: string }>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

const STORAGE_KEY = 'dgskills-code-academy-progress-v1';

const LESSONS: Lesson[] = [
  {
    id: 'main',
    number: 1,
    title: 'Waar start de website?',
    subtitle: 'Van browser naar React',
    remember: 'main.tsx is de startknop van DGskills.app.',
    file: 'src/main.tsx',
    code: `const root = ReactDOM.createRoot(rootElement);\nroot.render(\n  <ErrorBoundary>\n    <App />\n  </ErrorBoundary>\n);`,
    steps: [
      { title: 'Browser', text: 'De gebruiker opent DGskills.app.' },
      { title: 'main.tsx', text: 'React wordt gestart en zoekt #root.' },
      { title: '<App />', text: 'De hoofdcomponent wordt in de pagina geplaatst.' },
    ],
    quiz: {
      question: 'Wat is de belangrijkste taak van main.tsx?',
      options: ['Alle opdrachten tonen', 'React starten en App laden', 'De gebruiker inloggen'],
      correctIndex: 1,
      explanation: 'main.tsx zet React aan en plaatst <App /> in de webpagina.',
    },
  },
  {
    id: 'app',
    number: 2,
    title: 'Wat doet App.tsx?',
    subtitle: 'Een kleine doorgeeflaag',
    remember: 'App.tsx geeft de besturing direct door aan AppRouter.',
    file: 'src/app/App.tsx',
    code: `function App() {\n  return <AppRouter />;\n}\n\nexport default App;`,
    steps: [
      { title: 'main.tsx', text: 'Laadt de component <App />.' },
      { title: 'App.tsx', text: 'Doet bewust bijna niets zelf.' },
      { title: 'AppRouter', text: 'Krijgt de verantwoordelijkheid voor de route.' },
    ],
    quiz: {
      question: 'Waarom is App.tsx zo klein?',
      options: ['Omdat de code ontbreekt', 'Omdat AppRouter de routelogica beheert', 'Omdat React geen grote bestanden accepteert'],
      correctIndex: 1,
      explanation: 'De verantwoordelijkheden zijn gescheiden: App.tsx start de router, AppRouter kiest de route.',
    },
  },
  {
    id: 'router',
    number: 3,
    title: 'Wie kiest het juiste scherm?',
    subtitle: 'De router als wegwijzer',
    remember: 'AppRouter kiest openbaar, login of de ingelogde app.',
    file: 'src/app/AppRouter.tsx',
    code: `const AuthenticatedApp = React.lazy(() =>\n  import('@/app/AuthenticatedApp')\n);`,
    steps: [
      { title: 'URL bekijken', text: 'De router leest het huidige pad.' },
      { title: 'Toegang bepalen', text: 'Openbare route, login of ingelogde omgeving?' },
      { title: 'Scherm laden', text: 'Alleen de benodigde pagina wordt geladen.' },
    ],
    quiz: {
      question: 'Wat beslist AppRouter?',
      options: ['Welke databasekolom wordt gebruikt', 'Welke hoofdpagina wordt geladen', 'Hoeveel XP een missie geeft'],
      correctIndex: 1,
      explanation: 'De router koppelt de URL en inlogstatus aan het juiste hoofdscherm.',
    },
  },
  {
    id: 'authenticated-app',
    number: 4,
    title: 'De verkeersregelaar',
    subtitle: 'AuthenticatedApp verdeelt het verkeer',
    remember: 'AuthenticatedApp bepaalt welk onderdeel een ingelogde gebruiker ziet.',
    file: 'src/app/AuthenticatedApp.tsx',
    code: `if (user.role === 'teacher') {\n  return <TeacherDashboard />;\n}\n\nreturn <ProjectZeroDashboard />;`,
    steps: [
      { title: 'Gebruiker laden', text: 'Rol, voortgang en instellingen komen binnen.' },
      { title: 'Rol controleren', text: 'Leerling, docent of developer?' },
      { title: 'Onderdeel tonen', text: 'Dashboard, profiel, game of missie wordt geopend.' },
    ],
    quiz: {
      question: 'Welke vergelijking past het beste bij AuthenticatedApp?',
      options: ['Een verkeersregelaar', 'Een losse opdrachtkaart', 'Een afbeelding'],
      correctIndex: 0,
      explanation: 'AuthenticatedApp stuurt gebruikers en gekozen onderdelen naar het juiste scherm.',
    },
  },
  {
    id: 'dashboard',
    number: 5,
    title: 'Hoe verschijnen opdrachten?',
    subtitle: 'Het leerlingdashboard bouwt de lijst',
    remember: 'ProjectZeroDashboard bepaalt welke missies zichtbaar, open of vergrendeld zijn.',
    file: 'src/features/student/ProjectZeroDashboard.tsx',
    code: `const currentMissions = useMemo(() => {\n  return buildMissionsForPeriod(\n    currentYearGroup,\n    activeWeek\n  );\n}, [currentYearGroup, activeWeek]);`,
    steps: [
      { title: 'Leerjaar', text: 'Het gekozen leerjaar wordt gelezen.' },
      { title: 'Periode', text: 'De actieve periode of schoolcontainer wordt gekozen.' },
      { title: 'Missies', text: 'De lijst en vergrendelingen worden samengesteld.' },
    ],
    quiz: {
      question: 'Waar wordt vooral bepaald welke opdrachten zichtbaar zijn?',
      options: ['main.tsx', 'ProjectZeroDashboard.tsx', 'App.tsx'],
      correctIndex: 1,
      explanation: 'Het dashboard combineert curriculum, periode, klas, rechten en voortgang.',
    },
  },
  {
    id: 'card',
    number: 6,
    title: 'Eén opdrachtkaart',
    subtitle: 'StudentProjectCard toont één missie',
    remember: 'De kaart tekent de missie en meldt welke missie wordt aangeklikt.',
    file: 'src/features/student/ProjectZeroDashboard.tsx',
    code: `<button onClick={() => onSelectModule(mission.id)}>\n  Start missie\n</button>`,
    steps: [
      { title: 'Mission-object', text: 'Titel, uitleg, status en id komen binnen.' },
      { title: 'Kaart tekenen', text: 'De leerling ziet beeld, tekst en status.' },
      { title: 'Klik doorgeven', text: 'onSelectModule ontvangt het missie-id.' },
    ],
    quiz: {
      question: 'Opent StudentProjectCard zelf de volledige missie?',
      options: ['Ja, volledig zelfstandig', 'Nee, de kaart geeft het missie-id door', 'Alleen bij docenten'],
      correctIndex: 1,
      explanation: 'De kaart meldt de keuze. AuthenticatedApp opent daarna het juiste missiecomponent.',
    },
  },
  {
    id: 'props-data',
    number: 7,
    title: 'Hoe reist informatie?',
    subtitle: 'Props en state zonder jargon',
    remember: 'Props komen van boven; state verandert binnen een component.',
    file: 'Meerdere React-componenten',
    code: `<ProjectZeroDashboard\n  stats={user.stats}\n  activeWeek={activeWeek}\n  onSelectModule={handleSelectModule}\n/>`,
    steps: [
      { title: 'Oudercomponent', text: 'Heeft gegevens en functies beschikbaar.' },
      { title: 'Props', text: 'Geeft deze informatie als pakketje door.' },
      { title: 'Kindcomponent', text: 'Gebruikt het pakketje om iets te tonen of doen.' },
    ],
    quiz: {
      question: 'Wat zijn props het beste te vergelijken met?',
      options: ['Een pakketje informatie', 'Een databasefout', 'Een CSS-kleur'],
      correctIndex: 0,
      explanation: 'Props zijn waarden en functies die een component van zijn ouder ontvangt.',
    },
  },
  {
    id: 'ai-review',
    number: 8,
    title: 'AI-code veilig beoordelen',
    subtitle: 'Lees een pull request als producteigenaar',
    remember: 'Volg altijd de gebruikersactie, gewijzigde bestanden, data en tests.',
    file: 'GitHub → Pull request → Files changed',
    code: `Probleem → gewijzigde bestanden → gebruikersflow\n        → data/security → tests → handmatige controle`,
    steps: [
      { title: 'Wat veranderde?', text: 'Bekijk eerst het doel en de gewijzigde bestanden.' },
      { title: 'Volg de flow', text: 'Van klik naar component, service en opgeslagen data.' },
      { title: 'Zoek bewijs', text: 'Tests, foutafhandeling en handmatige controle moeten de claim dragen.' },
    ],
    quiz: {
      question: 'Wat is géén voldoende bewijs dat AI-code goed werkt?',
      options: ['Gerichte tests', 'Alleen de melding “build geslaagd”', 'Een handmatige gebruikersflow'],
      correctIndex: 1,
      explanation: 'Een build bewijst vooral dat de code compileert, niet dat de gebruikersflow correct werkt.',
    },
  },
];

function readCompleted(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function FlowVisual({ lesson }: { lesson: Lesson }) {
  return (
    <div className="rounded-[2rem] border border-duck-ink/15 bg-gradient-to-br from-white to-duck-bgLight p-5 md:p-8 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-duck-ink text-duck-acid">
          <Route size={22} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-duck-ink/55">Visuele route</p>
          <h3 className="font-black text-duck-ink">Bekijk de stroom van links naar rechts</h3>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {lesson.steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="relative rounded-3xl border border-duck-ink/15 bg-white p-5">
              <span className="mb-4 flex size-9 items-center justify-center rounded-full bg-duck-acid text-sm font-black text-duck-ink">
                {index + 1}
              </span>
              <h4 className="font-black text-duck-ink">{step.title}</h4>
              <p className="mt-2 text-sm font-medium leading-relaxed text-duck-ink/65">{step.text}</p>
            </div>
            {index < lesson.steps.length - 1 && (
              <div className="flex items-center justify-center text-duck-ink/45">
                <ArrowRight className="hidden md:block" size={24} />
                <ArrowRight className="rotate-90 md:hidden" size={24} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LessonView({
  lesson,
  isCompleted,
  onComplete,
  onBack,
  onPrevious,
  onNext,
}: {
  lesson: Lesson;
  isCompleted: boolean;
  onComplete: () => void;
  onBack: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const answerIsCorrect = selectedAnswer === lesson.quiz.correctIndex;

  useEffect(() => {
    setSelectedAnswer(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lesson.id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <button onClick={onBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-duck-ink/65 hover:bg-white hover:text-duck-ink">
        <ArrowLeft size={17} /> Alle lessen
      </button>

      <section className="overflow-hidden rounded-[2rem] bg-duck-ink text-white shadow-duck-soft">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-9">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-duck-acid">Les {lesson.number} · {lesson.subtitle}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{lesson.title}</h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70">Vandaag leer je maar één klein onderdeel. Je hoeft de rest nog niet te onthouden.</p>
          </div>
          <div className="flex size-20 items-center justify-center self-center rounded-[1.75rem] bg-duck-acid text-duck-ink">
            <Code2 size={38} />
          </div>
        </div>
      </section>

      <FlowVisual lesson={lesson} />

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/55">Echte plek in DGskills</p>
          <p className="mt-2 rounded-xl bg-duck-bgLight px-3 py-2 font-mono text-xs font-bold text-duck-ink">{lesson.file}</p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#111827] p-5 text-xs leading-6 text-slate-100"><code>{lesson.code}</code></pre>
        </div>

        <div className="rounded-[2rem] border border-duck-ink/15 bg-duck-acid p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Sparkles size={22} />
            <h3 className="font-black text-duck-ink">Onthoud alleen dit</h3>
          </div>
          <p className="mt-5 text-xl font-black leading-snug text-duck-ink">{lesson.remember}</p>
          <div className="mt-6 rounded-2xl bg-white/65 p-4 text-sm font-semibold leading-relaxed text-duck-ink/75">
            Probeer deze zin hardop in je eigen woorden te zeggen. Dan weet je meteen of je het begrijpt.
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={23} className="text-duck-ink" />
          <h3 className="text-xl font-black text-duck-ink">Kleine controlevraag</h3>
        </div>
        <p className="mt-4 font-bold text-duck-ink">{lesson.quiz.question}</p>
        <div className="mt-4 grid gap-3">
          {lesson.quiz.options.map((option, index) => {
            const selected = selectedAnswer === index;
            const correct = selected && index === lesson.quiz.correctIndex;
            const wrong = selected && !correct;
            return (
              <button
                key={option}
                onClick={() => setSelectedAnswer(index)}
                className={`flex min-h-[52px] items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition-colors ${correct ? 'border-green-600 bg-green-50 text-green-900' : wrong ? 'border-red-500 bg-red-50 text-red-900' : selected ? 'border-duck-ink bg-duck-bgLight text-duck-ink' : 'border-duck-ink/15 text-duck-ink hover:border-duck-ink/40 hover:bg-duck-bgLight'}`}
              >
                {selected ? (correct ? <Check size={18} /> : <Circle size={18} />) : <Circle size={18} />}
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div className={`mt-5 rounded-2xl p-4 text-sm font-semibold leading-relaxed ${answerIsCorrect ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
            {answerIsCorrect ? 'Goed! ' : 'Nog niet. '}{lesson.quiz.explanation}
          </div>
        )}

        <button
          disabled={!answerIsCorrect}
          onClick={onComplete}
          className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-duck-ink px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          {isCompleted ? <Check size={17} /> : <Play size={17} />}
          {isCompleted ? 'Les afgerond' : 'Markeer als afgerond'}
        </button>
      </section>

      <div className="flex items-center justify-between gap-3">
        <button disabled={!onPrevious} onClick={onPrevious} className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-duck-ink/15 bg-white px-4 text-sm font-bold text-duck-ink disabled:opacity-30">
          <ArrowLeft size={17} /> Vorige
        </button>
        <button disabled={!onNext} onClick={onNext} className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-duck-acid px-5 text-sm font-black text-duck-ink disabled:opacity-30">
          Volgende <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

export function DeveloperCodeAcademy() {
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>(() => readCompleted());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }, [completed]);

  const activeIndex = useMemo(() => LESSONS.findIndex((lesson) => lesson.id === activeLessonId), [activeLessonId]);
  const activeLesson = activeIndex >= 0 ? LESSONS[activeIndex] : null;
  const completionPercentage = Math.round((completed.length / LESSONS.length) * 100);

  if (activeLesson) {
    return (
      <LessonView
        lesson={activeLesson}
        isCompleted={completed.includes(activeLesson.id)}
        onComplete={() => setCompleted((current) => current.includes(activeLesson.id) ? current : [...current, activeLesson.id])}
        onBack={() => setActiveLessonId(null)}
        onPrevious={activeIndex > 0 ? () => setActiveLessonId(LESSONS[activeIndex - 1].id) : undefined}
        onNext={activeIndex < LESSONS.length - 1 ? () => setActiveLessonId(LESSONS[activeIndex + 1].id) : undefined}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <section className="overflow-hidden rounded-[2rem] bg-duck-ink p-6 text-white shadow-duck-soft md:p-9">
        <div className="grid gap-7 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-duck-acid text-duck-ink"><BookOpen size={25} /></div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-duck-acid">DGskills Code Academie</p>
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">Leer jouw eigen webapp begrijpen</h2>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-white/70">Acht korte Nederlandse lessen. Eén onderwerp tegelijk, met visuele stromen, echte bestanden en een kleine controlevraag.</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-6 ring-1 ring-white/15">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">Jouw voortgang</p>
                <p className="mt-1 text-4xl font-black text-duck-acid">{completionPercentage}%</p>
              </div>
              <p className="text-sm font-bold text-white/65">{completed.length}/{LESSONS.length} lessen</p>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-duck-acid transition-all" style={{ width: `${completionPercentage}%` }} /></div>
            {completed.length > 0 && (
              <button onClick={() => setCompleted([])} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white"><RotateCcw size={14} /> Voortgang resetten</button>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LESSONS.map((lesson, index) => {
          const done = completed.includes(lesson.id);
          const previousDone = index === 0 || completed.includes(LESSONS[index - 1].id);
          const locked = !previousDone;
          return (
            <button
              key={lesson.id}
              disabled={locked}
              onClick={() => setActiveLessonId(lesson.id)}
              className={`group flex min-h-[230px] flex-col rounded-[2rem] border p-6 text-left shadow-sm transition-all ${locked ? 'cursor-not-allowed border-duck-ink/10 bg-duck-bgLight opacity-55' : 'border-duck-ink/15 bg-white hover:-translate-y-1 hover:border-duck-ink/40 hover:shadow-duck-soft'}`}
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-11 items-center justify-center rounded-2xl text-sm font-black ${done ? 'bg-duck-ink text-duck-acid' : 'bg-duck-acid text-duck-ink'}`}>{done ? <Check size={20} /> : lesson.number}</span>
                {locked ? <Lock size={18} className="text-duck-ink/45" /> : <ArrowRight size={19} className="text-duck-ink/45 transition-transform group-hover:translate-x-1" />}
              </div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-duck-ink/50">{lesson.subtitle}</p>
              <h3 className="mt-2 text-xl font-black leading-tight text-duck-ink">{lesson.title}</h3>
              <p className="mt-auto pt-5 text-sm font-semibold text-duck-ink/60">{locked ? 'Rond eerst de vorige les af.' : done ? 'Afgerond · opnieuw bekijken' : 'Start deze korte les'}</p>
            </button>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-duck-ink/15 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-duck-bgLight text-duck-ink"><GitPullRequest size={22} /></div>
          <div>
            <h3 className="font-black text-duck-ink">Gebouwd voor jouw developeraccount</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-duck-ink/65">Deze omgeving staat binnen het developerdashboard. De voortgang wordt alleen in deze browser opgeslagen; er zijn geen nieuwe persoonsgegevens of databasetabellen nodig.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
