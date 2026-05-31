import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    XCircle,
    BookOpen,
    MessageCircle,
    FileSearch,
    Pin,
    Search,
    Target,
} from 'lucide-react';
import type { TemplateMissionProps, FollowUpQuestion, MissionGoal, MissionExperienceDesign } from '../shared/types';
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

export interface InvestigationHookOption {
    id: string;
    label: string;
    description: string;
    feedback: string;
    evidenceChips?: string[];
    impactCue?: string;
}

export interface InvestigationHook {
    title: string;
    role: string;
    scenario: string;
    prompt: string;
    options: InvestigationHookOption[];
    contextLabel?: string;
    continueLabel?: string;
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
    experienceDesign?: MissionExperienceDesign;
    introFeatures?: string[];
    investigationHook?: InvestigationHook;
    datasets: Dataset[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    enableChat?: boolean;
    chatRoleId?: string;
}

// ── State ─────────────────────────────────────────────────────────────────────

interface DataViewerState {
    phase: 'intro' | 'investigation' | 'explore' | 'results';
    currentDataset: number;
    answers: Record<string, string | number>;
    submitted: Record<string, boolean>;
    textObservations: Record<string, string>;
    confidences: Record<string, 1 | 2 | 3>;
    followUpAnswered: Record<string, boolean>;
    followUpCorrect: Record<string, boolean>;
    investigationChoice?: string;
    investigationSubmitted?: boolean;
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

function getPrimaryInteractionLabel(interaction: MissionExperienceDesign['primaryInteraction']): string {
    switch (interaction) {
        case 'pin-evidence':
            return 'Bewijs pinnen';
        case 'operate-simulation':
            return 'Simulatie sturen';
        case 'prioritize-case':
            return 'Case prioriteren';
        case 'defend-position':
            return 'Standpunt verdedigen';
        case 'choose-with-consequence':
            return 'Kiezen met gevolg';
        case 'solve-puzzle':
            return 'Puzzel oplossen';
        case 'build':
            return 'Bouwen';
        case 'test-product':
            return 'Product testen';
        case 'review-and-improve':
            return 'Reviewen en verbeteren';
        default:
            return 'Onderzoeken';
    }
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

function getInvestigationOption(
    hook: InvestigationHook | undefined,
    selectedId: string | undefined
): InvestigationHookOption | undefined {
    if (!hook || !selectedId) return undefined;
    return hook.options.find((option) => option.id === selectedId);
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
                                            ? 'border-[#D97848] bg-[#D97848]/10'
                                            : 'border-[#E7D8BD] hover:border-[#D97848]/40'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={opt}
                                        checked={answer === opt}
                                        onChange={() => onAnswer(q.id, opt)}
                                        data-qa={`question-option-${opt}`}
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
                            data-qa="question-number-input"
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
                                data-qa="question-textarea"
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
                        data-qa="question-submit"
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

// ── Investigation hook ────────────────────────────────────────────────────────

interface InvestigationHookCardProps {
    hook: InvestigationHook;
    experienceDesign?: MissionExperienceDesign;
    selectedId?: string;
    submitted?: boolean;
    onSelect: (id: string) => void;
    onContinue: () => void;
    onBack: () => void;
}

const InvestigationHookCard: React.FC<InvestigationHookCardProps> = ({
    hook,
    experienceDesign,
    selectedId,
    submitted,
    onSelect,
    onContinue,
    onBack,
}) => {
    const selected = getInvestigationOption(hook, selectedId);
    const selectedEvidenceChips = selected?.evidenceChips ?? [];
    const interactionLabel = experienceDesign
        ? getPrimaryInteractionLabel(experienceDesign.primaryInteraction)
        : 'Onderzoeken';

    return (
        <div className="min-h-screen bg-[#FCF6EA]">
            <div className="mx-auto max-w-5xl px-4 py-6">
                <button
                    onClick={onBack}
                    className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#445865] transition-colors hover:bg-[#08283B]/5 hover:text-[#08283B] focus:outline-none focus:ring-2 focus:ring-[#D97848]/35"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ChevronLeft size={14} />
                    Terug
                </button>

                <section
                    className="grid overflow-hidden rounded-xl border border-[#D3C5AB] bg-white md:grid-cols-[0.95fr_1.05fr]"
                    data-qa="investigation-card"
                >
                    <div className="bg-[#08283B] p-5 text-white md:p-6" data-qa="investigation-brief">
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#F0B36A]">
                                <FileSearch size={19} />
                            </div>
                            <div>
                                <p
                                    className="text-sm font-bold text-[#F0B36A]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {hook.role}
                                </p>
                                <h1
                                    className="mt-1 text-2xl font-black leading-tight text-white"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {hook.title}
                                </h1>
                            </div>
                        </div>

                        {experienceDesign?.firstTenSeconds && (
                            <div className="mb-4 rounded-lg border border-white/10 bg-white/8 p-3">
                                <div className="mb-2 flex items-center gap-2 text-[#F0B36A]">
                                    <AlertTriangle size={15} />
                                    <p
                                        className="text-xs font-black"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Eerste zet
                                    </p>
                                </div>
                                <p
                                    className="text-sm leading-relaxed text-white"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {experienceDesign.firstTenSeconds}
                                </p>
                            </div>
                        )}

                        <p
                            className="text-sm leading-relaxed text-white/86"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {hook.scenario}
                        </p>

                        <div className="mt-5 grid gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                            <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                                <div className="mb-2 flex items-center gap-2 text-[#F0B36A]">
                                    <Pin size={14} />
                                    <p
                                        className="text-xs font-black"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Actie
                                    </p>
                                </div>
                                <p
                                    className="text-sm font-black text-white"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {interactionLabel}
                                </p>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/8 p-3">
                                <div className="mb-2 flex items-center gap-2 text-[#F0B36A]">
                                    <Target size={14} />
                                    <p
                                        className="text-xs font-black"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Bewijs
                                    </p>
                                </div>
                                <p
                                    className="text-xs leading-relaxed text-white/86"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {experienceDesign?.evidenceMoment ?? 'Kies een spoor en onderbouw je antwoord met data.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        <div className="mb-4 flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D97848]/10 text-[#D97848]">
                                <Search size={17} />
                            </div>
                            <p
                                className="text-sm font-bold leading-snug text-[#08283B]"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {hook.prompt}
                            </p>
                        </div>

                        <div
                            className="mb-4 rounded-xl border border-[#E7D8BD] bg-[#FFFDF7] p-3"
                            data-qa="investigation-data-room-preview"
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div>
                                    <p
                                        className="text-xs font-black uppercase tracking-widest text-[#0B453F]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Data-room route
                                    </p>
                                    <p
                                        className="mt-0.5 text-xs font-bold text-[#445865]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Eerst spoor kiezen, daarna pas de dataset openen.
                                    </p>
                                </div>
                                <div className="rounded-full border border-[#0B453F]/15 bg-[#0B453F]/10 px-3 py-1 text-[11px] font-black text-[#0B453F]">
                                    {hook.contextLabel ?? 'Spoor'}
                                </div>
                            </div>

                            <div className="grid gap-2 sm:grid-cols-3">
                                {[
                                    ['Hypothese', selected?.impactCue ?? selected?.label ?? 'Kies een spoor', 'bg-[#0B453F] text-white'],
                                    ['Data', selectedEvidenceChips.slice(0, 2).join(' + ') || 'Zoek patroon', 'bg-[#F0B36A] text-[#08283B]'],
                                    ['Bewijs', 'Pin nuance', 'bg-[#5F947D] text-white'],
                                ].map(([label, detail, badgeClass]) => (
                                    <div key={label} className="rounded-lg border border-[#E7D8BD] bg-white p-2.5">
                                        <div className="mb-2 flex items-center gap-2">
                                            <span className={`h-6 w-6 rounded-full ${badgeClass}`} />
                                            <p
                                                className="text-[11px] font-black uppercase tracking-wider text-[#0B453F]"
                                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                            >
                                                {label}
                                            </p>
                                        </div>
                                        <p
                                            className="text-xs font-bold leading-snug text-[#445865]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {detail}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr]">
                                <div className="rounded-lg border border-[#E7D8BD] bg-white p-2.5">
                                    <p
                                        className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#D97848]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Mogelijke signalen
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {hook.options.map((option) => {
                                            const active = option.id === selectedId;
                                            return (
                                                <span
                                                    key={option.id}
                                                    className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
                                                        active
                                                            ? 'border-[#0B453F] bg-[#0B453F] text-white'
                                                            : 'border-[#E7D8BD] bg-[#FCF6EA] text-[#08283B]'
                                                    }`}
                                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                                >
                                                    {option.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="rounded-lg border border-[#5F947D]/25 bg-[#5F947D]/10 p-2.5">
                                    <p
                                        className="mb-1 text-[10px] font-black uppercase tracking-wider text-[#0B453F]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Voorzichtige conclusie
                                    </p>
                                    <p
                                        className="text-xs font-bold leading-snug text-[#0B453F]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Beschrijf wat de data laat zien; claim geen oorzaak zonder bewijs.
                                    </p>
                                </div>
                            </div>

                            {selectedEvidenceChips.length > 0 && (
                                <div className="mt-2 rounded-lg border border-[#0B453F]/15 bg-white p-2.5">
                                    <p
                                        className="mb-2 text-[10px] font-black uppercase tracking-wider text-[#0B453F]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        Bewijs om te pinnen
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selectedEvidenceChips.map((chip) => (
                                            <span
                                                key={chip}
                                                className="rounded-full border border-[#E7D8BD] bg-[#FCF6EA] px-2 py-1 text-[11px] font-black text-[#08283B]"
                                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                            >
                                                {chip}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {hook.options.map((option) => {
                                const active = option.id === selectedId;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() => onSelect(option.id)}
                                        aria-pressed={active}
                                        data-qa={`investigation-option-${option.id}`}
                                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                                            active
                                                ? 'border-[#D97848] bg-[#D97848]/8'
                                                : 'border-[#E7D8BD] bg-[#FFFDF7] hover:border-[#D97848]/50'
                                        }`}
                                    >
                                        <span
                                            className="block text-sm font-black text-[#08283B]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {option.label}
                                        </span>
                                        <span
                                            className="mt-1 block text-xs leading-relaxed text-[#445865]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {option.description}
                                        </span>
                                        {option.evidenceChips && option.evidenceChips.length > 0 && (
                                            <span className="mt-2 flex flex-wrap gap-1.5">
                                                {option.evidenceChips.slice(0, 3).map((chip) => (
                                                    <span
                                                        key={chip}
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                                                            active
                                                                ? 'bg-white/70 text-[#0B453F]'
                                                                : 'bg-[#FCF6EA] text-[#445865]'
                                                        }`}
                                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                                    >
                                                        {chip}
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {submitted && selected && (
                            <div
                                className="mt-4 rounded-lg border border-[#5F947D]/25 bg-[#5F947D]/10 p-3"
                                data-qa="investigation-feedback"
                            >
                                <div className="flex items-start gap-2.5">
                                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-[#5F947D]" />
                                    <p
                                        className="text-xs leading-relaxed text-[#0B453F]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {selected.feedback}
                                    </p>
                                </div>
                            </div>
                        )}

                        {experienceDesign?.feedbackMoment && (
                            <div className="mt-3 rounded-lg border border-[#E7D8BD] bg-[#FCF6EA] p-3">
                                <p
                                    className="text-xs font-bold text-[#08283B]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Feedbackmoment
                                </p>
                                <p
                                    className="mt-1 text-xs leading-relaxed text-[#445865]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {experienceDesign.feedbackMoment}
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={onContinue}
                            disabled={!selected}
                            data-qa="investigation-continue"
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D97848] py-3 text-sm font-bold text-white transition-colors hover:bg-[#C8673D] disabled:cursor-not-allowed disabled:opacity-40"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {hook.continueLabel ?? 'Start onderzoek'}
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

// ── Dataset view ──────────────────────────────────────────────────────────────

interface DatasetViewProps {
    dataset: Dataset;
    experienceDesign?: MissionExperienceDesign;
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
    investigationHook?: InvestigationHook;
    selectedInvestigationOption?: InvestigationHookOption;
}

const DatasetView: React.FC<DatasetViewProps> = ({
    dataset,
    experienceDesign,
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
    investigationHook,
    selectedInvestigationOption,
}) => {
    const showFollowUp = allSubmitted && dataset.followUp !== undefined && !followUpAnswered[dataset.id];
    const canGoNext = allSubmitted && (dataset.followUp === undefined || followUpAnswered[dataset.id]);
    const interactionLabel = experienceDesign
        ? getPrimaryInteractionLabel(experienceDesign.primaryInteraction)
        : 'Onderzoeken';

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

        {experienceDesign && (
            <div
                className="mb-4 grid gap-2 rounded-xl border border-[#D3C5AB] bg-white p-3 sm:grid-cols-3"
                data-qa="data-room-rail"
            >
                <div className="rounded-lg bg-[#FCF6EA] p-3">
                    <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                        <Pin size={14} />
                        <p
                            className="text-xs font-black"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Actie
                        </p>
                    </div>
                    <p
                        className="text-sm font-black leading-snug text-[#08283B]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {interactionLabel}
                    </p>
                </div>
                <div className="rounded-lg bg-[#FCF6EA] p-3">
                    <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                        <FileSearch size={14} />
                        <p
                            className="text-xs font-black"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Bewijs
                        </p>
                    </div>
                    <p
                        className="text-xs leading-relaxed text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {experienceDesign.evidenceMoment}
                    </p>
                </div>
                <div className="rounded-lg bg-[#FCF6EA] p-3">
                    <div className="mb-2 flex items-center gap-2 text-[#D97848]">
                        <Target size={14} />
                        <p
                            className="text-xs font-black"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Feedback
                        </p>
                    </div>
                    <p
                        className="text-xs leading-relaxed text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {experienceDesign.feedbackMoment}
                    </p>
                </div>
            </div>
        )}

        {investigationHook && selectedInvestigationOption && (
            <div
                className="mb-4 rounded-xl border border-[#0B453F]/20 bg-[#0B453F]/10 p-3"
                data-qa="investigation-context"
            >
                <p
                    className="text-xs font-bold text-[#0B453F]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {investigationHook.contextLabel ?? 'Jouw onderzoekspad'}
                </p>
                <p
                    className="mt-1 text-sm font-black text-[#08283B]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {selectedInvestigationOption.label}
                </p>
                <p
                    className="mt-1 text-xs leading-relaxed text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {selectedInvestigationOption.description}
                </p>
            </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
            <section className="min-w-0" aria-label="Dataset en visualisatie">
                {/* Visualisation */}
                <div className="mb-4" data-qa="data-room-dataset-panel">
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
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            {dataset.cards.map((card, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-2xl border border-[#E7D8BD] p-4 flex items-start gap-3"
                                >
                                    <div className="text-2xl flex-shrink-0">{card.icon}</div>
                                    <div className="min-w-0">
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
                <div className="flex items-center gap-2 rounded-xl border border-[#D97848]/15 bg-[#D97848]/6 p-2.5">
                    <BookOpen size={14} className="text-[#D97848] flex-shrink-0" />
                    <p
                        className="text-xs text-[#D97848]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Gebruik de data hierboven om de vragen te beantwoorden. Sorteer of filter om antwoorden te vinden.
                    </p>
                </div>
            </section>

            <section className="min-w-0 lg:sticky lg:top-4 lg:self-start" data-qa="data-room-evidence-panel">
                <div className="mb-3 rounded-xl border border-[#D3C5AB] bg-white p-3">
                    <p
                        className="text-[11px] font-black uppercase tracking-widest text-[#D97848]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Bewijsstation
                    </p>
                    <p
                        className="mt-1 text-xs font-semibold leading-snug text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Pin eerst wat je in de data ziet. Daarna bevestig je pas je conclusie.
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
            </section>
        </div>
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
        investigationChoice: undefined,
        investigationSubmitted: false,
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

    const {
        phase,
        currentDataset,
        answers,
        submitted,
        textObservations,
        confidences,
        followUpAnswered,
        followUpCorrect,
        investigationChoice,
        investigationSubmitted,
    } = state;
    const missionGoal = config.missionGoal ?? getMissionGoal(config.missionId);
    const selectedInvestigationOption = getInvestigationOption(config.investigationHook, investigationChoice);

    useEffect(() => {
        const hasStartedDatasetWork =
            Object.keys(state.answers).length > 0 ||
            Object.keys(state.submitted).length > 0 ||
            Object.keys(state.textObservations).length > 0;

        if (
            config.investigationHook &&
            state.phase === 'explore' &&
            state.currentDataset === 0 &&
            state.investigationSubmitted !== true &&
            !hasStartedDatasetWork
        ) {
            setState(prev => ({ ...prev, phase: 'investigation' }));
        }
    }, [
        config.investigationHook,
        state.answers,
        state.currentDataset,
        state.investigationSubmitted,
        state.phase,
        state.submitted,
        state.textObservations,
        setState,
    ]);

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
            const wellbeingResult = scanWellbeingText(observation, { educationalContext: true });
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

    const handleStart = () => {
        setState(prev => ({
            ...prev,
            phase: config.investigationHook ? 'investigation' : 'explore',
        }));
    };

    const handleInvestigationSelect = (id: string) => {
        setState(prev => ({
            ...prev,
            investigationChoice: id,
            investigationSubmitted: true,
        }));
    };

    const handleInvestigationContinue = () => {
        if (!selectedInvestigationOption) return;
        setState(prev => ({ ...prev, phase: 'explore' }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onStart={handleStart}
            />
        );
    }

    if (phase === 'investigation' && config.investigationHook) {
        return (
            <InvestigationHookCard
                hook={config.investigationHook}
                experienceDesign={config.experienceDesign}
                selectedId={investigationChoice}
                submitted={investigationSubmitted}
                onSelect={handleInvestigationSelect}
                onContinue={handleInvestigationContinue}
                onBack={() => setState(prev => ({ ...prev, phase: 'intro' }))}
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
        <div className="min-h-screen bg-[#FCF6EA]" data-qa="data-viewer-active">
            {showHulplijn && <WellbeingAlert match={wellbeingMatch} onDismiss={dismissHulplijn} />}

            <div className="mx-auto max-w-5xl px-4 py-6">
                <PhaseHeader
                    currentPhase={currentDataset + 1}
                    totalPhases={totalPhases}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <DatasetView
                    dataset={currentDs}
                    experienceDesign={config.experienceDesign}
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
                    investigationHook={config.investigationHook}
                    selectedInvestigationOption={selectedInvestigationOption}
                />

                {/* Back to previous dataset */}
                {currentDataset > 0 && (
                    <button
                        onClick={handlePrevDataset}
                        className="mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[#445865] transition-colors hover:bg-[#08283B]/5 hover:text-[#08283B] focus:outline-none focus:ring-2 focus:ring-[#D97848]/35"
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
                            className="fixed bottom-[calc(env(safe-area-inset-bottom)+8rem)] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#D97848] text-white shadow-lg transition-transform duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F] focus-visible:ring-offset-2 active:scale-95 sm:bottom-6 sm:right-6"
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
