import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import type { TemplateMissionProps } from '../shared/types';
import type { BadgeConfig } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { InteractiveTable } from './sub/InteractiveTable';
import { SimpleChart } from './sub/SimpleChart';

// ── Config types ──────────────────────────────────────────────────────────────

export interface DataQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'number-input' | 'text-observation';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
}

export interface Dataset {
    id: string;
    title: string;
    description: string;
    type: 'table' | 'bar-chart' | 'pie-chart' | 'document-cards';
    // table
    columns?: Array<{ key: string; label: string; sortable?: boolean }>;
    rows?: Record<string, string | number>[];
    // chart
    chartData?: Array<{ label: string; value: number; color?: string }>;
    // document-cards
    cards?: Array<{ title: string; icon: string; content: string }>;
    questions: DataQuestion[];
}

export interface DataViewerConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    datasets: Dataset[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

// ── State ─────────────────────────────────────────────────────────────────────

interface DataViewerState {
    phase: 'intro' | 'explore' | 'results';
    currentDataset: number;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function scoreQuestion(q: DataQuestion, answers: Record<string, string | number>): number {
    if (q.type === 'text-observation') return q.points; // always participation points
    const raw = answers[q.id];
    if (raw === undefined || raw === '') return 0;
    if (q.type === 'number-input') {
        const num = Number(raw);
        const correct = Number(q.correctAnswer);
        if (isNaN(num)) return 0;
        const tolerance = Math.abs(correct) * 0.05;
        return Math.abs(num - correct) <= tolerance ? q.points : 0;
    }
    // multiple-choice
    return String(raw).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
        ? q.points
        : 0;
}

function isCorrect(q: DataQuestion, answers: Record<string, string | number>): boolean | null {
    if (q.type === 'text-observation') return true; // always accepted
    const raw = answers[q.id];
    if (raw === undefined || raw === '') return null;
    if (q.type === 'number-input') {
        const num = Number(raw);
        const correct = Number(q.correctAnswer);
        if (isNaN(num)) return false;
        return Math.abs(num - correct) <= Math.abs(correct) * 0.05;
    }
    return String(raw).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
}

// ── Question component ────────────────────────────────────────────────────────

interface QuestionCardProps {
    q: DataQuestion;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onSubmit: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    q,
    answers,
    submitted,
    textObservations,
    onAnswer,
    onTextObservation,
    onSubmit,
}) => {
    const isSubmitted = submitted[q.id];
    const correct = isSubmitted ? isCorrect(q, answers) : null;
    const answer = answers[q.id];
    const observation = textObservations[q.id] ?? '';

    return (
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-3">
            <div className="flex items-start justify-between gap-3 mb-3">
                <p
                    className="text-sm font-semibold text-[#1A1A19] leading-snug flex-1"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {q.question}
                </p>
                <span
                    className="text-xs font-bold text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {q.points} pt
                </span>
            </div>

            {/* Answer input */}
            {!isSubmitted && (
                <>
                    {q.type === 'multiple-choice' && q.options && (
                        <div className="flex flex-col gap-2 mb-3">
                            {q.options.map(opt => (
                                <label
                                    key={opt}
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                        answer === opt
                                            ? 'border-[#D97757] bg-[#D97757]/8'
                                            : 'border-[#E8E6DF] hover:border-[#D97757]/40'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answer === opt}
                                        onChange={() => onAnswer(q.id, opt)}
                                        className="accent-[#D97757]"
                                    />
                                    <span
                                        className="text-sm text-[#3D3D38]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {opt}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}

                    {q.type === 'number-input' && (
                        <input
                            type="number"
                            step="any"
                            placeholder="Typ een getal…"
                            value={answer ?? ''}
                            onChange={e => onAnswer(q.id, e.target.value)}
                            className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-[#E8E6DF] bg-[#FAF9F0] text-[#1A1A19] focus:outline-none focus:border-[#D97757]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                    )}

                    {q.type === 'text-observation' && (
                        <textarea
                            rows={3}
                            placeholder="Schrijf je observatie hier…"
                            value={observation}
                            onChange={e => onTextObservation(q.id, e.target.value)}
                            className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-[#E8E6DF] bg-[#FAF9F0] text-[#1A1A19] focus:outline-none focus:border-[#D97757] resize-none"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                    )}

                    <button
                        onClick={() => onSubmit(q.id)}
                        disabled={
                            q.type === 'text-observation'
                                ? observation.trim().length < 10
                                : answer === undefined || answer === ''
                        }
                        className="w-full py-2 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Bevestigen
                    </button>
                </>
            )}

            {/* Feedback after submit */}
            {isSubmitted && (
                <div
                    className={`rounded-xl p-3 flex items-start gap-2.5 ${
                        correct
                            ? 'bg-[#10B981]/10 border border-[#10B981]/25'
                            : 'bg-[#D97757]/8 border border-[#D97757]/20'
                    }`}
                >
                    {correct ? (
                        <CheckCircle size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                    ) : (
                        <XCircle size={16} className="text-[#D97757] mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        {q.type === 'text-observation' ? (
                            <p
                                className="text-xs font-semibold text-[#10B981] mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Goed opgeschreven! Observatie ontvangen.
                            </p>
                        ) : correct ? (
                            <p
                                className="text-xs font-semibold text-[#10B981] mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Goed! +{q.points} punten
                            </p>
                        ) : (
                            <p
                                className="text-xs font-semibold text-[#D97757] mb-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Niet helemaal — het juiste antwoord: <strong>{q.correctAnswer}</strong>
                            </p>
                        )}
                        <p
                            className="text-xs text-[#6B6B66] leading-snug"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {q.explanation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Dataset view ──────────────────────────────────────────────────────────────

interface DatasetViewProps {
    dataset: Dataset;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onSubmit: (id: string) => void;
    allSubmitted: boolean;
    onNext: () => void;
    isLast: boolean;
    datasetIndex: number;
    totalDatasets: number;
}

const DatasetView: React.FC<DatasetViewProps> = ({
    dataset,
    answers,
    submitted,
    textObservations,
    onAnswer,
    onTextObservation,
    onSubmit,
    allSubmitted,
    onNext,
    isLast,
    datasetIndex,
    totalDatasets,
}) => (
    <div>
        {/* Dataset header */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
                <span
                    className="text-xs font-black text-[#D97757] uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Dataset {datasetIndex + 1} / {totalDatasets}
                </span>
            </div>
            <h2
                className="text-lg font-black text-[#1A1A19] mb-1"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                {dataset.title}
            </h2>
            <p
                className="text-sm text-[#6B6B66] leading-relaxed"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {dataset.description}
            </p>
        </div>

        {/* Visualisation */}
        <div className="mb-5">
            {dataset.type === 'table' && dataset.columns && dataset.rows && (
                <InteractiveTable columns={dataset.columns} rows={dataset.rows} />
            )}

            {(dataset.type === 'bar-chart' || dataset.type === 'pie-chart') && dataset.chartData && (
                <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4">
                    <SimpleChart
                        data={dataset.chartData}
                        type={dataset.type === 'pie-chart' ? 'pie' : 'bar'}
                    />
                </div>
            )}

            {dataset.type === 'document-cards' && dataset.cards && (
                <div className="flex flex-col gap-3">
                    {dataset.cards.map((card, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl border border-[#E8E6DF] p-4 flex items-start gap-3"
                        >
                            <div className="text-2xl flex-shrink-0">{card.icon}</div>
                            <div>
                                <p
                                    className="text-sm font-black text-[#1A1A19] mb-1"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {card.title}
                                </p>
                                <p
                                    className="text-xs text-[#6B6B66] leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {card.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 mb-4 p-2.5 bg-[#D97757]/6 rounded-xl border border-[#D97757]/15">
            <BookOpen size={14} className="text-[#D97757] flex-shrink-0" />
            <p
                className="text-xs text-[#D97757]"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                Gebruik de data hierboven om de vragen te beantwoorden. Sorteer of filter om antwoorden te vinden.
            </p>
        </div>

        {/* Questions */}
        <div>
            {dataset.questions.map(q => (
                <QuestionCard
                    key={q.id}
                    q={q}
                    answers={answers}
                    submitted={submitted}
                    textObservations={textObservations}
                    onAnswer={onAnswer}
                    onTextObservation={onTextObservation}
                    onSubmit={onSubmit}
                />
            ))}
        </div>

        {/* Next button */}
        {allSubmitted && (
            <button
                onClick={onNext}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {isLast ? 'Bekijk resultaten' : 'Volgende dataset'}
                <ChevronRight size={16} />
            </button>
        )}
    </div>
);

// ── Main component ────────────────────────────────────────────────────────────

interface DataViewerProps extends TemplateMissionProps {
    config: DataViewerConfig;
}

const DataViewerInner: React.FC<DataViewerProps> = ({
    missionId,
    onBack,
    onComplete,
    config,
}) => {
    const INITIAL_STATE: DataViewerState = {
        phase: 'intro',
        currentDataset: 0,
        answers: {},
        submitted: {},
        textObservations: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<DataViewerState>(
        missionId,
        INITIAL_STATE
    );

    const { phase, currentDataset, answers, submitted, textObservations } = state;

    const totalScore = config.datasets.flatMap(ds => ds.questions).reduce((sum, q) => {
        if (!submitted[q.id]) return sum;
        return sum + scoreQuestion(q, answers);
    }, 0);

    const handleAnswer = (id: string, value: string | number) => {
        setState(prev => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
    };

    const handleTextObservation = (id: string, value: string) => {
        setState(prev => ({
            ...prev,
            textObservations: { ...prev.textObservations, [id]: value },
            answers: { ...prev.answers, [id]: value },
        }));
    };

    const handleSubmitQuestion = (id: string) => {
        // For text-observation, copy current observation into answers if not already
        setState(prev => {
            const newAnswers = { ...prev.answers };
            const q = config.datasets.flatMap(ds => ds.questions).find(q => q.id === id);
            if (q?.type === 'text-observation' && prev.textObservations[id]) {
                newAnswers[id] = prev.textObservations[id];
            }
            return {
                ...prev,
                answers: newAnswers,
                submitted: { ...prev.submitted, [id]: true },
            };
        });
    };

    const currentDs = config.datasets[currentDataset];
    const allQuestionsSubmitted =
        currentDs?.questions.every(q => submitted[q.id]) ?? false;

    const handleNextDataset = () => {
        if (currentDataset < config.datasets.length - 1) {
            setState(prev => ({ ...prev, currentDataset: prev.currentDataset + 1 }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setState(prev => ({ ...prev, phase: 'results' }));
        }
    };

    const handlePrevDataset = () => {
        if (currentDataset > 0) {
            setState(prev => ({ ...prev, currentDataset: prev.currentDataset - 1 }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleComplete = () => {
        clearSave();
        onComplete(true);
    };

    // Phase breakdown for CompletionScreen
    const phaseScores = config.datasets.map(ds => ({
        icon: ds.type === 'table' ? '📊' : ds.type === 'document-cards' ? '📰' : '📈',
        title: ds.title,
        score: ds.questions.reduce((s, q) => (submitted[q.id] ? s + scoreQuestion(q, answers) : s), 0),
        max: ds.questions.reduce((s, q) => s + q.points, 0),
    }));

    if (phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                onStart={() => setState(prev => ({ ...prev, phase: 'explore' }))}
            />
        );
    }

    if (phase === 'results') {
        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phaseScores}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // Explore phase
    const totalPhases = config.datasets.length;

    return (
        <div className="min-h-screen bg-[#FAF9F0]">
            <div className="max-w-lg mx-auto px-4 py-6">
                <PhaseHeader
                    currentPhase={currentDataset}
                    totalPhases={totalPhases}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <DatasetView
                    dataset={currentDs}
                    answers={answers}
                    submitted={submitted}
                    textObservations={textObservations}
                    onAnswer={handleAnswer}
                    onTextObservation={handleTextObservation}
                    onSubmit={handleSubmitQuestion}
                    allSubmitted={allQuestionsSubmitted}
                    onNext={handleNextDataset}
                    isLast={currentDataset === config.datasets.length - 1}
                    datasetIndex={currentDataset}
                    totalDatasets={config.datasets.length}
                />

                {/* Back to previous dataset */}
                {currentDataset > 0 && (
                    <button
                        onClick={handlePrevDataset}
                        className="mt-3 flex items-center gap-1.5 text-xs text-[#6B6B66] hover:text-[#1A1A19] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ChevronLeft size={14} />
                        Vorige dataset
                    </button>
                )}
            </div>
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97757] border-t-transparent" />
    </div>
);

export const DataViewer: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<DataViewerConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is DataViewerConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) return (
        <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-[#6B6B66] mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-[#D97757] text-white rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <DataViewerInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
