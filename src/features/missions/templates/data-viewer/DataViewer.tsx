import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, BookOpen, MessageCircle } from 'lucide-react';
import type { TemplateMissionProps, FollowUpQuestion, MissionGoal } from '../shared/types';
import type { BadgeConfig } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { InteractiveTable } from './sub/InteractiveTable';
import { SimpleChart } from './sub/SimpleChart';
import { ConfidenceRating, confidenceMultiplier } from '../shared/ConfidenceRating';
import { FollowUpCard } from '../shared/FollowUpCard';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { WellbeingAlert } from '@/features/student/WellbeingAlert';
import { useWellbeingMonitor } from '@/hooks/useWellbeingMonitor';

// ── Config types ──────────────────────────────────────────────────────────────

export interface DataQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'number-input' | 'text-observation';
    options?: string[];
    correctAnswer: string | number;
    explanation: string;
    points: number;
    showConfidence?: boolean;
    minLength?: number;
    textEvidenceCriteria?: TextEvidenceCriterion[];
    minEvidenceCriteria?: number;
}

interface TextEvidenceCriterion {
    label: string;
    keywords: string[];
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
    followUp?: FollowUpQuestion;
}

export interface DataViewerConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    missionGoal?: MissionGoal;
    introFeatures?: string[];
    datasets: Dataset[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    enableChat?: boolean;
    chatRoleId?: string;
}

// ── State ─────────────────────────────────────────────────────────────────────

interface DataViewerState {
    phase: 'intro' | 'explore' | 'results';
    currentDataset: number;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    followUpCorrect: Record<string, boolean>;
}

// ── Helper ────────────────────────────────────────────────────────────────────

function normalizeEvidenceText(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function evaluateTextEvidence(q: DataQuestion, value: string) {
    const criteria = q.textEvidenceCriteria ?? [];
    const normalized = normalizeEvidenceText(value);
    const minimumLength = q.minLength ?? (criteria.length > 0 ? 20 : 10);

    if (criteria.length === 0) {
        return {
            matched: [],
            missing: [],
            required: 0,
            passed: value.trim().length >= minimumLength,
        };
    }

    const matched = criteria.filter((criterion) =>
        criterion.keywords.some((keyword) => normalized.includes(normalizeEvidenceText(keyword)))
    );
    const required = q.minEvidenceCriteria ?? criteria.length;

    return {
        matched,
        missing: criteria.filter((criterion) => !matched.includes(criterion)),
        required,
        passed: value.trim().length >= minimumLength && matched.length >= required,
    };
}

function getCompletionThreshold(goal: MissionGoal | undefined, maxScore: number, fallbackRatio: number): number {
    const threshold = goal?.criteria.threshold;
    if (typeof threshold === 'number') {
        return threshold <= 1 ? Math.round(maxScore * threshold) : threshold;
    }
    return Math.round(maxScore * fallbackRatio);
}

function scoreQuestion(q: DataQuestion, answers: Record<string, string | number>, confidence?: 1 | 2 | 3): number {
    if (q.type === 'text-observation') {
        return evaluateTextEvidence(q, String(answers[q.id] ?? '')).passed ? q.points : 0;
    }
    const raw = answers[q.id];
    if (raw === undefined || raw === '') return 0;
    
    let correct = false;
    if (q.type === 'number-input') {
        const num = Number(raw);
        const correctVal = Number(q.correctAnswer);
        if (isNaN(num)) return 0;
        const tolerance = Math.abs(correctVal) * 0.05;
        correct = Math.abs(num - correctVal) <= tolerance;
    } else {
        // multiple-choice
        correct = String(raw).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
    }

    if (correct) {
        const base = q.points;
        const multiplier = q.showConfidence
            ? confidenceMultiplier(confidence, true)
            : 1;
        return Math.round(base * multiplier);
    } else {
        if (q.showConfidence && confidence) {
            const penaltyMultiplier = confidenceMultiplier(confidence, false);
            // penaltyMultiplier is negative, e.g. -0.5 or -0.2
            return Math.round(q.points * penaltyMultiplier);
        }
        return 0;
    }
}

function clampScore(score: number, maxScore: number): number {
    return Math.min(Math.max(score, 0), maxScore);
}

function isCorrect(q: DataQuestion, answers: Record<string, string | number>): boolean | null {
    if (q.type === 'text-observation') {
        return evaluateTextEvidence(q, String(answers[q.id] ?? '')).passed;
    }
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
    confidences: Record<string, 1 | 2 | 3>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onConfidence: (id: string, level: 1 | 2 | 3) => void;
    onSubmit: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    q,
    answers,
    submitted,
    textObservations,
    confidences,
    onAnswer,
    onTextObservation,
    onConfidence,
    onSubmit,
}) => {
    const isSubmitted = submitted[q.id];
    const correct = isSubmitted ? isCorrect(q, answers) : null;
    const answer = answers[q.id];
    const observation = textObservations[q.id] ?? '';
    const confidence = confidences[q.id];
    const textEvidenceEvaluation = q.type === 'text-observation'
        ? evaluateTextEvidence(q, observation)
        : null;
    const showConfidenceWidget =
        q.showConfidence === true &&
        q.type !== 'text-observation' &&
        !isSubmitted &&
        answer !== undefined &&
        answer !== '';
    const textObservationReady = q.type === 'text-observation'
        ? textEvidenceEvaluation?.passed === true
        : true;
    const submitDisabled = q.type === 'text-observation'
        ? !textObservationReady
        : answer === undefined || answer === '' || (q.showConfidence === true && confidence === undefined);

    return (
        <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-3">
            <div className="flex items-start justify-between gap-3 mb-3">
                <p
                    className="text-sm font-semibold text-[#08283B] leading-snug flex-1"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {q.question}
                </p>
                <span
                    className="text-xs font-bold text-[#D97848] bg-[#D97848]/10 px-2 py-0.5 rounded-full flex-shrink-0"
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
                                            ? 'border-[#D97848] bg-[#D97848]/8'
                                            : 'border-[#E7D8BD] hover:border-[#D97848]/40'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answer === opt}
                                        onChange={() => onAnswer(q.id, opt)}
                                        className="accent-[#D97848]"
                                    />
                                    <span
                                        className="text-sm text-[#445865]"
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
                            className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] text-[#08283B] focus:outline-none focus:border-[#D97848]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                    )}

                    {q.type === 'text-observation' && (
                        <>
                            <textarea
                                rows={3}
                                placeholder="Schrijf je observatie hier…"
                                value={observation}
                                onChange={e => onTextObservation(q.id, e.target.value)}
                                className="w-full mb-3 px-3 py-2 text-sm rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] text-[#08283B] focus:outline-none focus:border-[#D97848] resize-none"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            />
                            {q.textEvidenceCriteria && q.textEvidenceCriteria.length > 0 && textEvidenceEvaluation && (
                                <div className="mb-3 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] px-3 py-2 text-left">
                                    <p
                                        className="text-[11px] font-black uppercase tracking-widest text-[#D97848]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Bewijscheck
                                    </p>
                                    <p
                                        className="mt-1 text-xs leading-snug text-[#445865]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Noem minimaal {textEvidenceEvaluation.required} van: {q.textEvidenceCriteria.map((criterion) => criterion.label).join(', ')}.
                                    </p>
                                    <p
                                        className={`mt-1 text-xs font-semibold leading-snug ${
                                            textEvidenceEvaluation.passed ? 'text-[#5F947D]' : 'text-[#8A4A2B]'
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {textEvidenceEvaluation.passed
                                            ? 'Bewijs compleet - je kunt bevestigen.'
                                            : `Nog nodig: ${textEvidenceEvaluation.missing.map((criterion) => criterion.label).join(', ')}.`}
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {showConfidenceWidget && (
                        <div className="mb-3">
                            <ConfidenceRating onSelect={(level) => onConfidence(q.id, level)} />
                        </div>
                    )}

                    <button
                        onClick={() => onSubmit(q.id)}
                        disabled={submitDisabled}
                        className="w-full py-2 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all duration-200"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Bevestigen
                    </button>
                </>
            )}

            {/* Feedback after submit */}
            {isSubmitted && (() => {
                const pointsEarned = scoreQuestion(q, answers, confidence);
                const submittedTextEvidence = q.type === 'text-observation'
                    ? evaluateTextEvidence(q, String(answers[q.id] ?? ''))
                    : null;
                return (
                    <div
                        className={`rounded-xl p-3 flex items-start gap-2.5 ${
                            correct
                                ? 'bg-[#5F947D]/10 border border-[#5F947D]/25'
                                : 'bg-[#D97848]/8 border border-[#D97848]/20'
                        }`}
                    >
                        {correct ? (
                            <CheckCircle size={16} className="text-[#5F947D] mt-0.5 flex-shrink-0" />
                        ) : (
                            <XCircle size={16} className="text-[#D97848] mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            {q.type === 'text-observation' ? (
                                <>
                                    <p
                                        className={`text-xs font-semibold mb-1 ${correct ? 'text-[#5F947D]' : 'text-[#D97848]'}`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {correct ? 'Observatie bevat genoeg bewijs.' : 'Nog niet genoeg bewijs in je observatie.'}
                                    </p>
                                    {!correct && submittedTextEvidence && submittedTextEvidence.missing.length > 0 && (
                                        <p
                                            className="text-xs text-[#8A4A2B] leading-snug mb-1"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            Mist nog: {submittedTextEvidence.missing.map((criterion) => criterion.label).join(', ')}.
                                        </p>
                                    )}
                                </>
                            ) : correct ? (
                                <p
                                    className="text-xs font-semibold text-[#5F947D] mb-1"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Goed! +{pointsEarned} punten {pointsEarned > q.points && '🌟 (Zelfvertrouwen bonus!)'}
                                </p>
                            ) : (
                                <p
                                    className="text-xs font-semibold text-[#D97848] mb-1"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {pointsEarned < 0 ? (
                                        <>Ai! Strafpunten voor overmoedigheid: {pointsEarned} pt (Juist antwoord: {q.correctAnswer})</>
                                    ) : (
                                        <>Niet helemaal — het juiste antwoord: <strong>{q.correctAnswer}</strong></>
                                    )}
                                </p>
                            )}
                            <p
                                className="text-xs text-[#445865] leading-snug"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {q.explanation}
                            </p>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

// ── Dataset view ──────────────────────────────────────────────────────────────

interface DatasetViewProps {
    dataset: Dataset;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    onAnswer: (id: string, value: string | number) => void;
    onTextObservation: (id: string, value: string) => void;
    onConfidence: (id: string, level: 1 | 2 | 3) => void;
    onSubmit: (id: string) => void;
    onFollowUpComplete: (datasetId: string, correct: boolean) => void;
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
    confidences,
    followUpAnswered,
    onAnswer,
    onTextObservation,
    onConfidence,
    onSubmit,
    onFollowUpComplete,
    allSubmitted,
    onNext,
    isLast,
    datasetIndex,
    totalDatasets,
}) => {
    const showFollowUp = allSubmitted && dataset.followUp !== undefined && !followUpAnswered[dataset.id];
    const canGoNext = allSubmitted && (dataset.followUp === undefined || followUpAnswered[dataset.id]);

    return (
    <div>
        {/* Dataset header */}
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
                <span
                    className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Dataset {datasetIndex + 1} / {totalDatasets}
                </span>
            </div>
            <h2
                className="text-lg font-black text-[#08283B] mb-1"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
                {dataset.title}
            </h2>
            <p
                className="text-sm text-[#445865] leading-relaxed"
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
                <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4">
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
                            className="bg-white rounded-2xl border border-[#E7D8BD] p-4 flex items-start gap-3"
                        >
                            <div className="text-2xl flex-shrink-0">{card.icon}</div>
                            <div>
                                <p
                                    className="text-sm font-black text-[#08283B] mb-1"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {card.title}
                                </p>
                                <p
                                    className="text-xs text-[#445865] leading-relaxed"
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
        <div className="flex items-center gap-2 mb-4 p-2.5 bg-[#D97848]/6 rounded-xl border border-[#D97848]/15">
            <BookOpen size={14} className="text-[#D97848] flex-shrink-0" />
            <p
                className="text-xs text-[#D97848]"
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
                    confidences={confidences}
                    onAnswer={onAnswer}
                    onTextObservation={onTextObservation}
                    onConfidence={onConfidence}
                    onSubmit={onSubmit}
                />
            ))}
        </div>

        {/* FollowUp card — shown after all questions, before next dataset */}
        {showFollowUp && (
            <FollowUpCard
                followUp={dataset.followUp!}
                onComplete={(correct) => onFollowUpComplete(dataset.id, correct)}
                theme="light"
            />
        )}

        {/* Next button */}
        {canGoNext && (
            <button
                onClick={onNext}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {isLast ? 'Bekijk resultaten' : 'Volgende dataset'}
                <ChevronRight size={16} />
            </button>
        )}
    </div>
    );
};

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
        confidences: {},
        followUpAnswered: {},
        followUpCorrect: {},
    };

    const { state, setState, clearSave } = useMissionAutoSave<DataViewerState>(
        missionId,
        INITIAL_STATE
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const {
        scanText: scanWellbeingText,
        showHulplijn,
        lastMatch: wellbeingMatch,
        dismissHulplijn,
    } = useWellbeingMonitor();

    const userId = (() => {
        try {
            const key = Object.keys(localStorage).find((k) =>
                /^sb-[a-z0-9_-]+-auth-token$/i.test(k)
            );
            if (!key) return null;
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw)?.user?.id : null;
        } catch {
            return null;
        }
    })();

    const { phase, currentDataset, answers, submitted, textObservations, confidences, followUpAnswered, followUpCorrect } = state;
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);

    const questionScore = config.datasets.flatMap(ds => ds.questions).reduce((sum, q) => {
        if (!submitted[q.id]) return sum;
        return sum + scoreQuestion(q, answers, confidences[q.id]);
    }, 0);

    const followUpBonusScore = config.datasets.reduce((sum, ds) => {
        if (!ds.followUp || !followUpAnswered[ds.id] || !followUpCorrect[ds.id]) return sum;
        return sum + ds.followUp.bonusPoints;
    }, 0);

    const totalScore = clampScore(questionScore + followUpBonusScore, config.maxScore);
    const allDatasetsComplete = config.datasets.every((dataset) =>
        dataset.questions.every((q) => submitted[q.id]) &&
        (dataset.followUp === undefined || followUpAnswered[dataset.id] === true)
    );
    const textEvidenceComplete = config.datasets.every((dataset) =>
        dataset.questions.every((q) =>
            q.type !== 'text-observation' ||
            evaluateTextEvidence(q, String(answers[q.id] ?? textObservations[q.id] ?? '')).passed
        )
    );
    const completionThreshold = getCompletionThreshold(missionGoal, config.maxScore, 0.4);
    const isMissionComplete = allDatasetsComplete && textEvidenceComplete && totalScore >= completionThreshold;
    const completionStatus = {
        isComplete: isMissionComplete,
        title: isMissionComplete ? 'Bewijs compleet' : 'Nog niet voltooid',
        description: isMissionComplete
            ? `Je score is minimaal ${completionThreshold}/${config.maxScore} en je observaties bevatten genoeg bewijs.`
            : `Voor voltooiing heb je minimaal ${completionThreshold}/${config.maxScore} punten nodig en moeten alle observaties genoeg concreet bewijs bevatten.`,
    };

    const handleAnswer = (id: string, value: string | number) => {
        setState(prev => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
    };

    const handleConfidence = (id: string, level: 1 | 2 | 3) => {
        setState(prev => ({ ...prev, confidences: { ...prev.confidences, [id]: level } }));
    };

    const handleFollowUpComplete = (datasetId: string, correct: boolean) => {
        setState(prev => ({
            ...prev,
            followUpAnswered: { ...prev.followUpAnswered, [datasetId]: true },
            followUpCorrect: { ...prev.followUpCorrect, [datasetId]: correct },
        }));
    };

    const handleTextObservation = (id: string, value: string) => {
        setState(prev => ({
            ...prev,
            textObservations: { ...prev.textObservations, [id]: value },
            answers: { ...prev.answers, [id]: value },
        }));
    };

    const handleSubmitQuestion = (id: string) => {
        const q = config.datasets.flatMap(ds => ds.questions).find(q => q.id === id);
        if (q?.type === 'text-observation') {
            const observation = String(textObservations[id] ?? answers[id] ?? '');
            const wellbeingResult = scanWellbeingText(observation);
            if (wellbeingResult.isBlocked) {
                if (config.enableChat) setIsChatOpen(true);
                return;
            }
        }

        // For text-observation, copy current observation into answers if not already
        setState(prev => {
            const newAnswers = { ...prev.answers };
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
        onComplete(isMissionComplete);
    };

    // Phase breakdown for CompletionScreen
    const phaseScores = config.datasets.map(ds => {
        const max = ds.questions.reduce((s, q) => s + q.points, 0) + (ds.followUp?.bonusPoints ?? 0);
        const score = ds.questions.reduce((s, q) => (submitted[q.id] ? s + scoreQuestion(q, answers, confidences[q.id]) : s), 0)
            + (followUpAnswered[ds.id] && followUpCorrect[ds.id] && ds.followUp ? ds.followUp.bonusPoints : 0);

        return {
            icon: ds.type === 'table' ? '📊' : ds.type === 'document-cards' ? '📰' : '📈',
            title: ds.title,
            score: clampScore(score, max),
            max,
        };
    });

    if (phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                goal={missionGoal}
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
                evidence={missionGoal?.evidence}
                completionStatus={completionStatus}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // Explore phase
    const totalPhases = config.datasets.length;

    return (
        <div className="min-h-screen bg-[#FCF6EA]">
            {showHulplijn && <WellbeingAlert match={wellbeingMatch} onDismiss={dismissHulplijn} />}

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
                    confidences={confidences}
                    followUpAnswered={followUpAnswered}
                    onAnswer={handleAnswer}
                    onTextObservation={handleTextObservation}
                    onConfidence={handleConfidence}
                    onSubmit={handleSubmitQuestion}
                    onFollowUpComplete={handleFollowUpComplete}
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
                        className="mt-3 flex items-center gap-1.5 text-xs text-[#445865] hover:text-[#08283B] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ChevronLeft size={14} />
                        Vorige dataset
                    </button>
                )}
            </div>

            {/* AI Chat overlay */}
            {config.enableChat && (
                <>
                    <StudentAIChat
                        roleId={config.chatRoleId ?? 'student-assistant'}
                        userIdentifier={userId ?? 'anonymous'}
                        isOpen={isChatOpen}
                        onOpenChange={setIsChatOpen}
                        context={{
                            currentDataset: {
                                title: currentDs?.title,
                                description: currentDs?.description,
                            },
                            progress: {
                                dataset: currentDataset + 1,
                                total: config.datasets.length,
                                score: totalScore,
                                maxScore: config.maxScore,
                            },
                        }}
                    />
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#D97848] to-[#D97848] text-white shadow-lg transition-all duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2 active:scale-95"
                            aria-label="Open AI-assistent"
                        >
                            <MessageCircle size={22} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97848] border-t-transparent" />
    </div>
);

export const DataViewer: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete, enableChat, chatRoleId }) => {
    const [config, setConfig] = useState<DataViewerConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is DataViewerConfig => v && typeof v === 'object' && 'missionId' in v);
                if (cfg) setConfig({
                    ...cfg,
                    enableChat: enableChat ?? cfg.enableChat,
                    chatRoleId: chatRoleId ?? cfg.chatRoleId,
                });
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId, enableChat, chatRoleId]);

    if (loadError) return (
        <div className="min-h-screen bg-[#FCF6EA] flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-[#445865] mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Config niet gevonden: {missionId}
                </p>
                <button onClick={onBack} className="px-4 py-2 bg-[#D97848] text-white rounded-xl text-sm font-bold">Terug</button>
            </div>
        </div>
    );
    if (!config) return <LoadingScreen />;

    return <DataViewerInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
