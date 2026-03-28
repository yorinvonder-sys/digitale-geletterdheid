import React, { useState, useCallback } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, XCircle, Monitor, Server, Database, Cookie, AlertTriangle, Lock, Sparkles } from 'lucide-react';
import { useMissionAutoSave } from '../../hooks/useMissionAutoSave';

/* ────────────────────────────────────────────────────────────
   TYPES
   ──────────────────────────────────────────────────────────── */

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    stats?: Record<string, any>;
    vsoProfile?: string;
}

type VulnId = 'sql-injection' | 'plain-text-password' | 'no-session-expiry';

interface MissionState {
    currentStep: 1 | 2 | 3;
    showIntro: boolean;
    showMissionComplete: boolean;
    // Step 1: system understanding
    systemAnswers: Record<string, boolean>;
    // Step 2: vulnerability hunting
    foundVulns: VulnId[];
    selectedLineIdx: number | null;
    // Step 3: applying fixes
    appliedFixes: VulnId[];
    selectedFix: Record<VulnId, string | null>;
}

const INITIAL_STATE: MissionState = {
    currentStep: 1,
    showIntro: true,
    showMissionComplete: false,
    systemAnswers: {},
    foundVulns: [],
    selectedLineIdx: null,
    appliedFixes: [],
    selectedFix: {
        'sql-injection': null,
        'plain-text-password': null,
        'no-session-expiry': null,
    },
};

/* ────────────────────────────────────────────────────────────
   CODE DATA
   ──────────────────────────────────────────────────────────── */

interface CodeLine {
    code: string;
    indent: number;
    vulnId?: VulnId;
    hint: string;
    explanation: string;
    isComment?: boolean;
}

const CODE_LINES: CodeLine[] = [
    { code: '// SchoolConnect login — versie 1.0', indent: 0, hint: '', explanation: '', isComment: true },
    { code: 'function login(gebruikersnaam, wachtwoord) {', indent: 0, hint: '', explanation: '' },
    { code: '// Stap 1: Haal gebruiker op', indent: 1, hint: '', explanation: '', isComment: true },
    {
        code: 'gebruiker = database.zoek("SELECT * FROM gebruikers WHERE naam = \'" + gebruikersnaam + "\'")',
        indent: 1,
        vulnId: 'sql-injection',
        hint: 'Wat als iemand speciale tekens als naam intypt, zoals aanhalingstekens?',
        explanation: 'SQL-injectie! De gebruikersnaam wordt direct in de query geplakt. Een aanvaller kan hiermee inloggen als ieder account.',
    },
    { code: '// Stap 2: Check wachtwoord', indent: 1, hint: '', explanation: '', isComment: true },
    {
        code: 'if (wachtwoord == gebruiker.wachtwoord) {',
        indent: 1,
        vulnId: 'plain-text-password',
        hint: 'Wat staat er in de database als je "Welkom123" opslaat?',
        explanation: 'Het wachtwoord staat in platte tekst in de database! Als de database lekt, heeft de aanvaller direct alle wachtwoorden.',
    },
    { code: '// Stap 3: Maak sessie', indent: 2, hint: '', explanation: '', isComment: true },
    { code: 'sessie = maakSessie(gebruiker.id)', indent: 2, hint: '', explanation: '' },
    {
        code: 'sessie.verlooptNa = "nooit"',
        indent: 2,
        vulnId: 'no-session-expiry',
        hint: 'Wat als je vergeet uit te loggen op een schoolcomputer?',
        explanation: 'De sessie verloopt nooit! Iedereen die na jou op die computer zit, is automatisch ingelogd als jou.',
    },
    { code: 'return "Ingelogd!"', indent: 2, hint: '', explanation: '' },
    { code: '}', indent: 1, hint: '', explanation: '' },
    { code: 'return "Fout wachtwoord"', indent: 1, hint: '', explanation: '' },
    { code: '}', indent: 0, hint: '', explanation: '' },
];

/* ────────────────────────────────────────────────────────────
   FIX OPTIONS (Step 3)
   ──────────────────────────────────────────────────────────── */

interface FixOption {
    id: string;
    label: string;
    code: string;
    correct: boolean;
    feedback: string;
}

const FIX_OPTIONS: Record<VulnId, { title: string; description: string; options: FixOption[] }> = {
    'sql-injection': {
        title: 'Fix 1: SQL-injectie voorkomen',
        description: 'De gebruikersnaam wordt nu direct in de query geplakt. Hoe maak je dit veilig?',
        options: [
            {
                id: 'param-query',
                label: 'Parameterized query',
                code: 'database.zoek("SELECT * FROM gebruikers WHERE naam = ?", [gebruikersnaam])',
                correct: true,
                feedback: 'De database behandelt de parameter nu als data, niet als code. SQL-injectie is onmogelijk!',
            },
            {
                id: 'filter-quotes',
                label: 'Aanhalingstekens verwijderen',
                code: 'database.zoek("SELECT * FROM ... WHERE naam = \'" + gebruikersnaam.replace("\'","") + "\'")',
                correct: false,
                feedback: 'Slim geprobeerd, maar aanvallers vinden altijd een weg eromheen. Een parameterized query is de enige betrouwbare oplossing.',
            },
            {
                id: 'max-length',
                label: 'Maximale lengte instellen',
                code: 'database.zoek("SELECT * FROM ... WHERE naam = \'" + gebruikersnaam.substring(0,20) + "\'")',
                correct: false,
                feedback: 'Een limiet helpt niet — een SQL-injectie kan kort zijn: admin\'-- is maar 8 tekens.',
            },
        ],
    },
    'plain-text-password': {
        title: 'Fix 2: Wachtwoord beveiligen',
        description: 'Het wachtwoord staat in platte tekst in de database. Hoe maak je dit veilig?',
        options: [
            {
                id: 'hash',
                label: 'Wachtwoord hashen',
                code: 'if (hash(wachtwoord) == gebruiker.wachtwoordHash)',
                correct: true,
                feedback: 'Een hash is een eenrichtingsberekening: je kunt het wachtwoord niet terughalen uit de hash, maar je kunt wel checken of het klopt.',
            },
            {
                id: 'encrypt',
                label: 'Wachtwoord versleutelen',
                code: 'if (decrypt(gebruiker.wachtwoord) == wachtwoord)',
                correct: false,
                feedback: 'Versleuteling kan worden teruggedraaid als de sleutel lekt. Hashing is veiliger omdat het niet terug te draaien is.',
            },
            {
                id: 'base64',
                label: 'Wachtwoord coderen (base64)',
                code: 'if (decode(gebruiker.wachtwoord) == wachtwoord)',
                correct: false,
                feedback: 'Base64 is geen beveiliging — het is net zo makkelijk te decoderen als te coderen. Iedereen kan het lezen.',
            },
        ],
    },
    'no-session-expiry': {
        title: 'Fix 3: Sessie laten verlopen',
        description: 'De sessie verloopt nooit. Hoe voorkom je dat iemand anders jouw sessie kan gebruiken?',
        options: [
            {
                id: 'timeout',
                label: 'Sessie-timeout instellen',
                code: 'sessie.verlooptNa = "2 uur"',
                correct: true,
                feedback: 'Na 2 uur inactiviteit wordt je automatisch uitgelogd. Veilig genoeg voor een schooldag, niet te irritant voor leerlingen.',
            },
            {
                id: 'never-but-logout',
                label: 'Geen timeout, maar uitlogknop toevoegen',
                code: 'sessie.verlooptNa = "nooit" // uitlogknop bestaat al',
                correct: false,
                feedback: 'De meeste leerlingen vergeten uit te loggen. Een timeout is een vangnet — "vergeten" mag niet leiden tot een beveiligingslek.',
            },
            {
                id: 'per-page',
                label: 'Bij elke pagina opnieuw inloggen',
                code: 'sessie.verlooptNa = "0 seconden"',
                correct: false,
                feedback: 'Dit is veel te streng — niemand wil 50 keer per dag inloggen. Een timeout van 1-2 uur is een goede balans.',
            },
        ],
    },
};

const VULN_ORDER: VulnId[] = ['sql-injection', 'plain-text-password', 'no-session-expiry'];

/* ────────────────────────────────────────────────────────────
   SYSTEM QUESTIONS (Step 1)
   ──────────────────────────────────────────────────────────── */

interface SystemQuestion {
    id: string;
    question: string;
    options: { id: string; text: string; correct: boolean }[];
    explanation: string;
}

const SYSTEM_QUESTIONS: SystemQuestion[] = [
    {
        id: 'flow',
        question: 'Wat is de juiste volgorde bij inloggen?',
        options: [
            { id: 'a', text: 'Browser → Webserver → Database → Sessie-cookie', correct: true },
            { id: 'b', text: 'Database → Browser → Webserver → Cookie', correct: false },
            { id: 'c', text: 'Browser → Database → Webserver → Cookie', correct: false },
        ],
        explanation: 'Je browser stuurt je gegevens naar de webserver. Die checkt het wachtwoord in de database. Als het klopt, krijg je een sessie-cookie terug.',
    },
    {
        id: 'cookie',
        question: 'Waarom is een sessie-cookie nodig?',
        options: [
            { id: 'a', text: 'Zodat de server onthoudt dat je bent ingelogd', correct: true },
            { id: 'b', text: 'Om je wachtwoord op te slaan in de browser', correct: false },
            { id: 'c', text: 'Om advertenties te tonen', correct: false },
        ],
        explanation: 'Zonder cookie zou je bij elke klik opnieuw moeten inloggen. De cookie is je "bewijs" dat je je al hebt geïdentificeerd.',
    },
    {
        id: 'intercept',
        question: 'Wat kan er misgaan als de verbinding niet beveiligd is (geen HTTPS)?',
        options: [
            { id: 'a', text: 'Iemand op hetzelfde netwerk kan je wachtwoord meelezen', correct: true },
            { id: 'b', text: 'De website laadt langzamer', correct: false },
            { id: 'c', text: 'Je kunt geen afbeeldingen zien', correct: false },
        ],
        explanation: 'Zonder HTTPS worden gegevens als leesbare tekst verstuurd. Op een schoolnetwerk kan iedereen met de juiste tools meekijken.',
    },
];

/* ────────────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────────────── */

export const LoginLocksmithMission: React.FC<Props> = ({ onBack, onComplete, vsoProfile }) => {
    const { state, setState, clearSave } = useMissionAutoSave<MissionState>('login-locksmith', INITIAL_STATE);

    const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; message: string } | null>(null);
    const [showHint, setShowHint] = useState<number | null>(null);

    const totalVulns = 3;
    const totalFixes = 3;

    /* ── helpers ────────────────────────────────────────────── */

    const updateState = useCallback((patch: Partial<MissionState>) => {
        setState(prev => ({ ...prev, ...patch }));
    }, [setState]);

    const handleComplete = useCallback(() => {
        clearSave();
        onComplete(true);
    }, [clearSave, onComplete]);

    /* ── Step 1: answer system question ───────────────────── */

    const handleSystemAnswer = useCallback((questionId: string, optionId: string) => {
        const q = SYSTEM_QUESTIONS.find(sq => sq.id === questionId);
        if (!q) return;
        const correct = q.options.find(o => o.id === optionId)?.correct ?? false;
        if (correct) {
            const next = { ...state.systemAnswers, [questionId]: true };
            updateState({ systemAnswers: next });
            setFeedback({ type: 'correct', message: q.explanation });
            // Auto-advance to step 2 when all answered
            if (Object.keys(next).length === SYSTEM_QUESTIONS.length) {
                setTimeout(() => {
                    updateState({ currentStep: 2, systemAnswers: next });
                    setFeedback(null);
                }, 2000);
            }
        } else {
            setFeedback({ type: 'incorrect', message: 'Niet helemaal. Denk aan de volgorde: je browser praat met de server, de server praat met de database.' });
        }
    }, [state.systemAnswers, updateState]);

    /* ── Step 2: click code line ──────────────────────────── */

    const handleLineClick = useCallback((idx: number) => {
        const line = CODE_LINES[idx];
        if (line.isComment || !line.vulnId) {
            setFeedback({ type: 'incorrect', message: 'Deze regel ziet er oké uit. Zoek naar regels waar gebruikersinvoer, wachtwoorden of sessies worden verwerkt.' });
            setShowHint(null);
            return;
        }
        if (state.foundVulns.includes(line.vulnId)) {
            setFeedback({ type: 'correct', message: 'Deze kwetsbaarheid heb je al gevonden!' });
            return;
        }
        const next = [...state.foundVulns, line.vulnId] as VulnId[];
        updateState({ foundVulns: next, selectedLineIdx: idx });
        setFeedback({ type: 'correct', message: line.explanation });
        setShowHint(null);
        // Auto-advance to step 3 when all found
        if (next.length === totalVulns) {
            setTimeout(() => {
                updateState({ currentStep: 3, foundVulns: next });
                setFeedback(null);
            }, 2500);
        }
    }, [state.foundVulns, updateState]);

    /* ── Step 3: select fix ───────────────────────────────── */

    const handleFixSelect = useCallback((vulnId: VulnId, optionId: string) => {
        const fixData = FIX_OPTIONS[vulnId];
        const option = fixData.options.find(o => o.id === optionId);
        if (!option) return;

        const nextSelectedFix = { ...state.selectedFix, [vulnId]: optionId };
        updateState({ selectedFix: nextSelectedFix });

        if (option.correct) {
            const nextApplied = [...state.appliedFixes, vulnId] as VulnId[];
            updateState({ appliedFixes: nextApplied, selectedFix: nextSelectedFix });
            setFeedback({ type: 'correct', message: option.feedback });
            if (nextApplied.length === totalFixes) {
                setTimeout(() => {
                    updateState({ showMissionComplete: true, appliedFixes: nextApplied });
                    setFeedback(null);
                }, 2000);
            }
        } else {
            setFeedback({ type: 'incorrect', message: option.feedback });
        }
    }, [state.selectedFix, state.appliedFixes, updateState]);

    /* ── Progress bar ─────────────────────────────────────── */

    const progress = state.currentStep === 1
        ? Object.keys(state.systemAnswers).length / SYSTEM_QUESTIONS.length * 33
        : state.currentStep === 2
            ? 33 + (state.foundVulns.length / totalVulns * 33)
            : 66 + (state.appliedFixes.length / totalFixes * 34);

    /* ════════════════════════════════════════════════════════
       RENDER: INTRO
       ════════════════════════════════════════════════════════ */

    if (state.showIntro) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-slate-800/80 border border-teal-500/20 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center mb-6">
                        <ShieldCheck className="w-10 h-10 text-teal-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Newsreader, serif' }}>
                        Login Locksmith
                    </h1>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        Het inlogsysteem van <span className="text-teal-300 font-semibold">SchoolConnect</span> is gehackt.
                        Leerlingen klagen dat hun accounts zijn overgenomen — iemand heeft hun cijfers bekeken en berichten gestuurd namens hen.
                    </p>
                    <p className="text-slate-400 text-sm mb-8">
                        Jij bent ingehuurd als beveiligingsexpert. Onderzoek het systeem, vind de kwetsbaarheden en repareer de code.
                    </p>
                    <div className="flex flex-col gap-2 mb-8 text-left">
                        {[
                            { icon: <Monitor size={16} />, label: 'Systeem ontleden', desc: 'Hoe werkt het inlogsysteem?' },
                            { icon: <AlertTriangle size={16} />, label: 'Kwetsbaarheden opsporen', desc: 'Vind 3 fouten in de code' },
                            { icon: <Lock size={16} />, label: 'Beveiligingspatch schrijven', desc: 'Repareer alle fouten' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-700/40 rounded-lg p-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-300 shrink-0">
                                    {step.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Stap {i + 1}: {step.label}</div>
                                    <div className="text-xs text-slate-400">{step.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-colors text-sm">
                            Terug
                        </button>
                        <button
                            onClick={() => updateState({ showIntro: false })}
                            className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-500 transition-colors text-sm"
                        >
                            Start onderzoek
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ════════════════════════════════════════════════════════
       RENDER: MISSION COMPLETE
       ════════════════════════════════════════════════════════ */

    if (state.showMissionComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 flex items-center justify-center p-4">
                <div className="max-w-lg w-full bg-slate-800/80 border border-teal-500/30 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-teal-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Newsreader, serif' }}>
                        SchoolConnect is veilig!
                    </h1>
                    <p className="text-slate-300 mb-6 leading-relaxed">
                        Je hebt alle 3 de kwetsbaarheden gevonden en gerepareerd. Het inlogsysteem van SchoolConnect is nu beveiligd tegen de meest voorkomende aanvallen.
                    </p>
                    <div className="bg-slate-700/40 rounded-xl p-4 mb-6 text-left">
                        <div className="flex items-center gap-2 text-teal-300 font-medium text-sm mb-3">
                            <Sparkles size={16} />
                            Wat je hebt geleerd
                        </div>
                        <ul className="text-slate-300 text-sm space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" />
                                <span><strong>SQL-injectie</strong> voorkomen met parameterized queries</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" />
                                <span><strong>Wachtwoorden hashen</strong> zodat ze niet leesbaar in de database staan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-teal-400 mt-0.5 shrink-0" />
                                <span><strong>Sessie-timeouts</strong> instellen om ongeautoriseerd gebruik te voorkomen</span>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-slate-700/40 rounded-xl p-4 mb-8 text-left">
                        <div className="text-slate-400 text-xs mb-1">SLO-kerndoelen</div>
                        <div className="flex gap-2 flex-wrap">
                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-medium">21A Digitale systemen</span>
                            <span className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-xs font-medium">23A Veiligheid & privacy</span>
                            <span className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs font-medium">22B Programmeren</span>
                        </div>
                    </div>
                    <button
                        onClick={handleComplete}
                        className="w-full py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-500 transition-colors"
                    >
                        Missie afronden
                    </button>
                </div>
            </div>
        );
    }

    /* ════════════════════════════════════════════════════════
       RENDER: MAIN MISSION
       ════════════════════════════════════════════════════════ */

    const currentVulnToFix = VULN_ORDER.find(v => !state.appliedFixes.includes(v));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex flex-col">
            {/* ── Header ─────────────────────────────────────── */}
            <div className="sticky top-0 z-10 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Terug</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={18} className="text-teal-400" />
                        <span className="text-white font-medium text-sm">Login Locksmith</span>
                    </div>
                    <div className="text-xs text-slate-400">
                        Stap {state.currentStep}/3
                    </div>
                </div>
                {/* Progress bar */}
                <div className="max-w-3xl mx-auto mt-2">
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.round(progress)}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        {['Systeem', 'Kwetsbaarheden', 'Patch'].map((label, i) => (
                            <span key={i} className={`text-xs ${state.currentStep > i + 1 ? 'text-teal-400' : state.currentStep === i + 1 ? 'text-white' : 'text-slate-500'}`}>
                                {label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">

                    {/* ─── STEP 1: Systeem ontleden ──────────── */}
                    {state.currentStep === 1 && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Stap 1: Systeem ontleden</h2>
                            <p className="text-slate-400 text-sm mb-6">Begrijp hoe het inlogsysteem van SchoolConnect werkt.</p>

                            {/* System diagram */}
                            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 mb-6">
                                <div className="text-xs text-slate-400 mb-3 uppercase tracking-wider">Systeemdiagram</div>
                                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
                                    {[
                                        { icon: <Monitor size={20} />, label: 'Browser', color: 'text-blue-300', bg: 'bg-blue-500/15 border-blue-500/30' },
                                        { icon: <ArrowRight size={16} />, label: '', color: 'text-slate-500', bg: '' },
                                        { icon: <Server size={20} />, label: 'Webserver', color: 'text-purple-300', bg: 'bg-purple-500/15 border-purple-500/30' },
                                        { icon: <ArrowRight size={16} />, label: '', color: 'text-slate-500', bg: '' },
                                        { icon: <Database size={20} />, label: 'Database', color: 'text-amber-300', bg: 'bg-amber-500/15 border-amber-500/30' },
                                    ].map((item, i) => item.label ? (
                                        <div key={i} className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border ${item.bg} shrink-0`}>
                                            <div className={item.color}>{item.icon}</div>
                                            <span className={`text-xs font-medium ${item.color}`}>{item.label}</span>
                                        </div>
                                    ) : (
                                        <div key={i} className={item.color}>{item.icon}</div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-center mt-3 gap-2">
                                    <Cookie size={14} className="text-orange-300" />
                                    <span className="text-xs text-orange-300">← Sessie-cookie terug naar browser</span>
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="space-y-4">
                                {SYSTEM_QUESTIONS.map((q) => {
                                    const answered = state.systemAnswers[q.id];
                                    return (
                                        <div key={q.id} className={`bg-slate-800/60 border rounded-xl p-4 transition-all ${answered ? 'border-teal-500/30 opacity-70' : 'border-slate-700/50'}`}>
                                            <div className="text-sm font-medium text-white mb-3">{q.question}</div>
                                            <div className="space-y-2">
                                                {q.options.map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => !answered && handleSystemAnswer(q.id, opt.id)}
                                                        disabled={!!answered}
                                                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                                                            answered && opt.correct
                                                                ? 'bg-teal-500/20 border border-teal-500/40 text-teal-200'
                                                                : answered
                                                                    ? 'bg-slate-700/30 border border-transparent text-slate-500 cursor-not-allowed'
                                                                    : 'bg-slate-700/40 border border-slate-600/30 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500/40'
                                                        }`}
                                                    >
                                                        {opt.text}
                                                        {answered && opt.correct && <CheckCircle2 size={14} className="inline ml-2 text-teal-400" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ─── STEP 2: Kwetsbaarheden opsporen ────── */}
                    {state.currentStep === 2 && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Stap 2: Kwetsbaarheden opsporen</h2>
                            <p className="text-slate-400 text-sm mb-2">
                                Klik op de regels code die een beveiligingsrisico vormen. Er zitten <span className="text-red-300 font-semibold">3 fouten</span> in.
                            </p>
                            <div className="flex items-center gap-2 mb-6" role="status" aria-label={`${state.foundVulns.length} van 3 kwetsbaarheden gevonden`}>
                                <span className="text-xs text-slate-500">Gevonden:</span>
                                {VULN_ORDER.map((v, i) => (
                                    <span key={i} role="img" aria-label={`Kwetsbaarheid ${i + 1}: ${state.foundVulns.includes(v) ? 'gevonden' : 'nog niet gevonden'}`} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                        state.foundVulns.includes(v) ? 'bg-teal-500/30 text-teal-300' : 'bg-slate-700/50 text-slate-500'
                                    }`}>
                                        {state.foundVulns.includes(v) ? '✓' : i + 1}
                                    </span>
                                ))}
                            </div>

                            {/* Code block */}
                            <div className="bg-slate-950 border border-slate-700/50 rounded-xl overflow-hidden mb-4" role="region" aria-label="Broncode van het inlogsysteem">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border-b border-slate-700/50">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                    <span className="text-xs text-slate-400 ml-2">login.js — SchoolConnect v1.0</span>
                                </div>
                                <div className="p-3 sm:p-4 overflow-x-auto -mx-3 sm:mx-0">
                                    {CODE_LINES.map((line, idx) => {
                                        const isVuln = !!line.vulnId;
                                        const isFound = isVuln && state.foundVulns.includes(line.vulnId!);
                                        const indent = '\u00A0\u00A0'.repeat(line.indent);
                                        return (
                                            <div key={idx} className="group relative">
                                                <button
                                                    onClick={() => handleLineClick(idx)}
                                                    className={`w-full text-left font-mono text-[11px] sm:text-sm leading-6 sm:leading-7 px-2 -mx-1 rounded transition-all whitespace-nowrap ${
                                                        isFound
                                                            ? 'bg-red-500/15 border-l-2 border-red-400'
                                                            : line.isComment
                                                                ? 'text-slate-500 cursor-default'
                                                                : 'hover:bg-slate-800/60 active:bg-slate-700/60 cursor-pointer'
                                                    }`}
                                                >
                                                    <span className="text-slate-600 select-none inline-block w-5 sm:w-6 text-right mr-2 sm:mr-3">{idx + 1}</span>
                                                    <span className={isFound ? 'text-red-300' : line.isComment ? 'text-slate-500' : 'text-slate-200'}>
                                                        {indent}{line.code}
                                                    </span>
                                                    {isFound && <span className="ml-2 text-red-400 text-[10px] sm:text-xs">⚠</span>}
                                                </button>
                                                {/* Hint button — visible on hover/focus (desktop) and always tappable on touch */}
                                                {isVuln && !isFound && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setShowHint(showHint === idx ? null : idx); }}
                                                        aria-label="Toon hint voor deze regel"
                                                        aria-expanded={showHint === idx}
                                                        className="absolute right-1 sm:right-2 top-1 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100 opacity-60 text-[10px] sm:text-xs text-amber-400 hover:text-amber-300 active:text-amber-200 transition-opacity px-1 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                                                    >
                                                        💡
                                                    </button>
                                                )}
                                                {showHint === idx && isVuln && (
                                                    <div className="ml-7 sm:ml-9 text-[11px] sm:text-xs text-amber-300/80 bg-amber-500/10 rounded px-2 py-1.5 mb-1 whitespace-normal">
                                                        {line.hint}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {vsoProfile === 'dagbesteding' && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4 text-xs text-amber-200">
                                    💡 Tip: Zoek naar regels waar gebruikersinvoer, wachtwoorden of sessies worden verwerkt. Die bevatten vaak beveiligingsfouten.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── STEP 3: Beveiligingspatch ─────────── */}
                    {state.currentStep === 3 && currentVulnToFix && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-1">Stap 3: Beveiligingspatch schrijven</h2>
                            <p className="text-slate-400 text-sm mb-2">
                                Kies de juiste fix voor elke kwetsbaarheid.
                            </p>
                            <div className="flex items-center gap-2 mb-6" role="status" aria-label={`${state.appliedFixes.length} van 3 fixes toegepast`}>
                                <span className="text-xs text-slate-500">Gefixt:</span>
                                {VULN_ORDER.map((v, i) => (
                                    <span key={i} role="img" aria-label={`Fix ${i + 1}: ${state.appliedFixes.includes(v) ? 'toegepast' : 'nog open'}`} className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                                        state.appliedFixes.includes(v) ? 'bg-teal-500/30 text-teal-300' : v === currentVulnToFix ? 'bg-amber-500/30 text-amber-300 animate-pulse' : 'bg-slate-700/50 text-slate-500'
                                    }`}>
                                        {state.appliedFixes.includes(v) ? '✓' : i + 1}
                                    </span>
                                ))}
                            </div>

                            {/* Current fix */}
                            {(() => {
                                const fixData = FIX_OPTIONS[currentVulnToFix];
                                return (
                                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
                                        <h3 className="text-base font-semibold text-white mb-1">{fixData.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{fixData.description}</p>

                                        <div className="space-y-3">
                                            {fixData.options.map((opt) => {
                                                const selected = state.selectedFix[currentVulnToFix] === opt.id;
                                                const isCorrectAndSelected = selected && opt.correct;
                                                const isWrongAndSelected = selected && !opt.correct;
                                                const alreadyFixed = state.appliedFixes.includes(currentVulnToFix);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => !alreadyFixed && handleFixSelect(currentVulnToFix, opt.id)}
                                                        disabled={alreadyFixed}
                                                        className={`w-full text-left rounded-xl border p-4 transition-all ${
                                                            isCorrectAndSelected
                                                                ? 'border-teal-500/50 bg-teal-500/10'
                                                                : isWrongAndSelected
                                                                    ? 'border-red-500/50 bg-red-500/10'
                                                                    : 'border-slate-600/40 bg-slate-700/30 hover:bg-slate-700/50 hover:border-slate-500/50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm font-medium text-white">{opt.label}</span>
                                                            {isCorrectAndSelected && <CheckCircle2 size={16} className="text-teal-400" />}
                                                            {isWrongAndSelected && <XCircle size={16} className="text-red-400" />}
                                                        </div>
                                                        <code className="block text-xs font-mono text-slate-300 bg-slate-900/50 rounded-lg p-2 overflow-x-auto">
                                                            {opt.code}
                                                        </code>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* ── Feedback toast ──────────────────────── */}
                    {feedback && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            aria-atomic="true"
                            className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-20 rounded-xl border p-4 shadow-xl transition-all ${
                            feedback.type === 'correct'
                                ? 'bg-teal-900/90 border-teal-500/30 text-teal-100'
                                : 'bg-red-900/90 border-red-500/30 text-red-100'
                        }`}>
                            <div className="flex items-start gap-2">
                                {feedback.type === 'correct'
                                    ? <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                                    : <XCircle size={18} className="text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                                }
                                <div>
                                    <div className="text-sm font-medium mb-0.5">
                                        {feedback.type === 'correct' ? 'Goed!' : 'Niet helemaal'}
                                    </div>
                                    <div className="text-xs opacity-80">{feedback.message}</div>
                                </div>
                                <button onClick={() => setFeedback(null)} aria-label="Sluit melding" className="ml-auto text-sm opacity-50 hover:opacity-100 focus:opacity-100">✕</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
