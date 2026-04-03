import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Check, ChevronRight, MessageCircle, Layers, Eye, Lightbulb } from 'lucide-react';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import { PhaseHeader } from '../shared/PhaseHeader';
import { StudentAIChat } from '@/components/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import type { TemplateMissionProps, BadgeConfig } from '../shared/types';

// ─── Config types ────────────────────────────────────────────────────────────

export interface BuilderStep {
    id: string;
    title: string;
    description: string;
    instruction: string;
    tip?: string;
    checklistItems: Array<{ id: string; label: string }>;
    textPrompt?: string;
}

export interface BuilderCanvasConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    enableChat: boolean;
    chatRoleId?: string;
    previewType: 'markdown' | 'checklist-only' | 'text-preview';
    steps: BuilderStep[];
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
}

// ─── State ───────────────────────────────────────────────────────────────────

interface BuilderCanvasState {
    phase: 'intro' | 'building' | 'results';
    currentStep: number;
    checklist: Record<string, boolean>;
    textEntries: Record<string, string>;
    completedSteps: string[];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

type MobileTab = 'instructies' | 'preview';

interface ChecklistItemProps {
    id: string;
    label: string;
    checked: boolean;
    onToggle: (id: string) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, onToggle }) => (
    <button
        onClick={() => onToggle(id)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
            checked
                ? 'bg-[#10B981]/8 border-[#10B981]/30'
                : 'bg-white border-[#E8E6DF] hover:border-[#D97757]/40 hover:bg-[#D97757]/4'
        }`}
        aria-pressed={checked}
    >
        <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                checked ? 'bg-[#10B981] border-[#10B981]' : 'border-[#E8E6DF] bg-white'
            }`}
        >
            {checked && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <span
            className={`text-sm transition-colors duration-200 ${
                checked ? 'text-[#6B6B66] line-through' : 'text-[#3D3D38]'
            }`}
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {label}
        </span>
    </button>
);

interface PreviewPanelProps {
    config: BuilderCanvasConfig;
    state: BuilderCanvasState;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ config, state }) => {
    const { previewType, steps } = config;
    const { checklist, textEntries, currentStep, completedSteps } = state;

    if (previewType === 'text-preview') {
        const hasAnyText = steps.some((s) => textEntries[s.id]?.trim());

        return (
            <div className="h-full overflow-y-auto p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={16} className="text-[#D97757]" />
                    <span
                        className="text-xs font-black text-[#D97757] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Wat je bouwt
                    </span>
                </div>

                {!hasAnyText && (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-3">✍️</div>
                        <p
                            className="text-sm text-[#6B6B66]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Hier verschijnt jouw werk zodra je begint te schrijven.
                        </p>
                    </div>
                )}

                {steps.map((step, i) => {
                    const text = textEntries[step.id];
                    const isActive = i === currentStep;
                    const isDone = completedSteps.includes(step.id);
                    if (!text?.trim() && !isActive && !isDone) return null;

                    return (
                        <div
                            key={step.id}
                            className={`rounded-2xl border p-4 transition-all duration-300 ${
                                isDone
                                    ? 'border-[#10B981]/30 bg-[#10B981]/5'
                                    : isActive
                                      ? 'border-[#D97757]/30 bg-[#D97757]/5'
                                      : 'border-[#E8E6DF] bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                        isDone
                                            ? 'bg-[#10B981] text-white'
                                            : isActive
                                              ? 'bg-[#D97757] text-white'
                                              : 'bg-[#E8E6DF] text-[#6B6B66]'
                                    }`}
                                >
                                    {isDone ? '✓' : i + 1}
                                </div>
                                <span
                                    className="text-xs font-bold text-[#6B6B66] uppercase tracking-wider"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {text?.trim() ? (
                                <p
                                    className="text-sm text-[#3D3D38] whitespace-pre-wrap leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {text}
                                </p>
                            ) : (
                                <p
                                    className="text-sm text-[#6B6B66] italic"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Nog niets geschreven…
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (previewType === 'checklist-only') {
        const totalItems = steps.flatMap((s) => s.checklistItems).length;
        const checkedItems = Object.values(checklist).filter(Boolean).length;
        const percentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

        return (
            <div className="h-full overflow-y-auto p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Layers size={16} className="text-[#D97757]" />
                    <span
                        className="text-xs font-black text-[#D97757] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Voortgang
                    </span>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className="text-sm font-bold text-[#3D3D38]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Totaal voltooid
                        </span>
                        <span className="text-sm font-black text-[#D97757]">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E6DF] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D97757] to-[#10B981] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p
                        className="text-xs text-[#6B6B66] mt-1"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {checkedItems} van {totalItems} items afgevinkt
                    </p>
                </div>

                <div className="space-y-3">
                    {steps.map((step, i) => {
                        const stepChecked = step.checklistItems.filter(
                            (item) => checklist[`${step.id}-${item.id}`]
                        ).length;
                        const isDone = completedSteps.includes(step.id);
                        const isActive = i === currentStep;

                        return (
                            <div
                                key={step.id}
                                className={`rounded-xl border p-3 ${
                                    isDone
                                        ? 'border-[#10B981]/30 bg-[#10B981]/5'
                                        : isActive
                                          ? 'border-[#D97757]/30 bg-[#D97757]/5'
                                          : 'border-[#E8E6DF] bg-white opacity-60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                                isDone
                                                    ? 'bg-[#10B981] text-white'
                                                    : isActive
                                                      ? 'bg-[#D97757] text-white'
                                                      : 'bg-[#E8E6DF] text-[#6B6B66]'
                                            }`}
                                        >
                                            {isDone ? '✓' : i + 1}
                                        </div>
                                        <span
                                            className="text-sm font-bold text-[#3D3D38]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs text-[#6B6B66]"
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {stepChecked}/{step.checklistItems.length}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // markdown preview
    const activeText = textEntries[steps[currentStep]?.id] ?? '';

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[#D97757]" />
                <span
                    className="text-xs font-black text-[#D97757] uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Live voorbeeld
                </span>
            </div>
            {activeText.trim() ? (
                <div
                    className="prose prose-sm max-w-none text-[#3D3D38] leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {activeText}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-3xl mb-3">📄</div>
                    <p
                        className="text-sm text-[#6B6B66]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Begin te schrijven — hier zie je een live voorbeeld.
                    </p>
                </div>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface BuilderCanvasProps extends TemplateMissionProps {
    config: BuilderCanvasConfig;
}

const BuilderCanvasInner: React.FC<BuilderCanvasProps> = ({
    config,
    onBack,
    onComplete,
}) => {
    const initialState: BuilderCanvasState = {
        phase: 'intro',
        currentStep: 0,
        checklist: {},
        textEntries: {},
        completedSteps: [],
    };

    const { state, setState, clearSave } = useMissionAutoSave<BuilderCanvasState>(
        config.missionId,
        initialState
    );

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [mobileTab, setMobileTab] = useState<MobileTab>('instructies');

    const currentStepData = config.steps[state.currentStep];
    const pointsPerStep = Math.floor(config.maxScore / config.steps.length);

    // ─── Helpers ─────────────────────────────────────────────────────────

    const isStepComplete = useCallback(
        (stepId: string, step: BuilderStep): boolean => {
            return step.checklistItems.every((item) => state.checklist[`${stepId}-${item.id}`]);
        },
        [state.checklist]
    );

    const currentStepComplete = currentStepData
        ? isStepComplete(currentStepData.id, currentStepData)
        : false;

    const totalScore = state.completedSteps.length * pointsPerStep;

    // ─── Handlers ────────────────────────────────────────────────────────

    const handleStart = () => {
        setState((prev) => ({ ...prev, phase: 'building' }));
    };

    const handleChecklistToggle = (itemKey: string) => {
        setState((prev) => ({
            ...prev,
            checklist: {
                ...prev.checklist,
                [itemKey]: !prev.checklist[itemKey],
            },
        }));
    };

    const handleTextChange = (stepId: string, value: string) => {
        setState((prev) => ({
            ...prev,
            textEntries: { ...prev.textEntries, [stepId]: value },
        }));
    };

    const handleNextStep = () => {
        if (!currentStepData) return;

        const updatedCompleted = state.completedSteps.includes(currentStepData.id)
            ? state.completedSteps
            : [...state.completedSteps, currentStepData.id];

        const isLastStep = state.currentStep === config.steps.length - 1;

        if (isLastStep) {
            setState((prev) => ({
                ...prev,
                completedSteps: updatedCompleted,
                phase: 'results',
            }));
        } else {
            setState((prev) => ({
                ...prev,
                completedSteps: updatedCompleted,
                currentStep: prev.currentStep + 1,
            }));
            setMobileTab('instructies');
        }
    };

    const handleComplete = () => {
        clearSave();
        onComplete(true);
    };

    // ─── Phase: Intro ─────────────────────────────────────────────────────

    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                onStart={handleStart}
            />
        );
    }

    // ─── Phase: Results ───────────────────────────────────────────────────

    if (state.phase === 'results') {
        const phaseBreakdown = config.steps.map((step, i) => ({
            icon: i === 0 ? '🎯' : i === 1 ? '🗂️' : i === 2 ? '✍️' : '💬',
            title: step.title,
            score: state.completedSteps.includes(step.id) ? pointsPerStep : 0,
            max: pointsPerStep,
        }));

        return (
            <CompletionScreen
                score={totalScore}
                maxScore={config.maxScore}
                badges={config.badges}
                phases={phaseBreakdown}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    // ─── Phase: Building ──────────────────────────────────────────────────

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

    return (
        <div className="min-h-screen bg-[#FAF9F0] flex flex-col">
            {/* Header */}
            <div className="px-4 pt-4 pb-2 shrink-0">
                <PhaseHeader
                    currentPhase={state.currentStep}
                    totalPhases={config.steps.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />
            </div>

            {/* Mobile tab bar */}
            <div className="md:hidden flex border-b border-[#E8E6DF] bg-white shrink-0">
                {(['instructies', 'preview'] as MobileTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setMobileTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            mobileTab === tab
                                ? 'text-[#D97757] border-b-2 border-[#D97757] bg-[#D97757]/5'
                                : 'text-[#6B6B66] hover:text-[#1A1A19]'
                        }`}
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {tab === 'instructies' ? (
                            <>
                                <Layers size={14} />
                                Instructies
                            </>
                        ) : (
                            <>
                                <Eye size={14} />
                                Preview
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Main split layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left panel — instructions */}
                <div
                    className={`md:w-[45%] border-r border-[#E8E6DF] overflow-y-auto flex flex-col ${
                        mobileTab !== 'instructies' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    <div className="p-5 flex-1 flex flex-col">
                        {/* Step indicator */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D97757] to-[#C46849] flex items-center justify-center">
                                <span className="text-xs font-black text-white">
                                    {state.currentStep + 1}
                                </span>
                            </div>
                            <div>
                                <span
                                    className="text-[10px] font-black text-[#D97757] uppercase tracking-widest block"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Stap {state.currentStep + 1} van {config.steps.length}
                                </span>
                                <h2
                                    className="text-lg font-black text-[#1A1A19] leading-tight"
                                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                >
                                    {currentStepData.title}
                                </h2>
                            </div>
                        </div>

                        {/* Description */}
                        <p
                            className="text-sm text-[#6B6B66] leading-relaxed mb-4"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {currentStepData.description}
                        </p>

                        {/* Instruction card */}
                        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
                            <p
                                className="text-sm text-[#3D3D38] leading-relaxed"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {currentStepData.instruction}
                            </p>
                        </div>

                        {/* Optional tip */}
                        {currentStepData.tip && (
                            <div className="flex items-start gap-2 bg-[#D97757]/8 border border-[#D97757]/20 rounded-xl p-3 mb-4">
                                <Lightbulb size={14} className="text-[#D97757] mt-0.5 shrink-0" />
                                <p
                                    className="text-xs text-[#D97757] leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {currentStepData.tip}
                                </p>
                            </div>
                        )}

                        {/* Checklist */}
                        <div className="mb-4">
                            <span
                                className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest mb-2 block"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Checklist
                            </span>
                            <div className="space-y-2">
                                {currentStepData.checklistItems.map((item) => (
                                    <ChecklistItem
                                        key={item.id}
                                        id={item.id}
                                        label={item.label}
                                        checked={
                                            state.checklist[`${currentStepData.id}-${item.id}`] ?? false
                                        }
                                        onToggle={(id) =>
                                            handleChecklistToggle(`${currentStepData.id}-${id}`)
                                        }
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Optional text area */}
                        {currentStepData.textPrompt && (
                            <div className="mb-4 flex-1 flex flex-col">
                                <label
                                    className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest mb-2 block"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    htmlFor={`text-${currentStepData.id}`}
                                >
                                    {currentStepData.textPrompt}
                                </label>
                                <textarea
                                    id={`text-${currentStepData.id}`}
                                    value={state.textEntries[currentStepData.id] ?? ''}
                                    onChange={(e) =>
                                        handleTextChange(currentStepData.id, e.target.value)
                                    }
                                    placeholder="Schrijf hier jouw antwoord…"
                                    rows={5}
                                    className="w-full flex-1 resize-none rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 text-sm text-[#3D3D38] placeholder:text-[#6B6B66] focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757]/50 transition-all duration-200 leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                />
                            </div>
                        )}

                        {/* Next step button */}
                        <button
                            onClick={handleNextStep}
                            disabled={!currentStepComplete}
                            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${
                                currentStepComplete
                                    ? 'bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white active:scale-[0.98]'
                                    : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {state.currentStep === config.steps.length - 1 ? (
                                <>Resultaten bekijken</>
                            ) : (
                                <>
                                    Volgende stap
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>

                        {!currentStepComplete && (
                            <p
                                className="text-center text-xs text-[#6B6B66] mt-2"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                Vink alle items af om door te gaan
                            </p>
                        )}
                    </div>
                </div>

                {/* Right panel — preview */}
                <div
                    className={`md:w-[55%] overflow-hidden bg-white ${
                        mobileTab !== 'preview' ? 'hidden md:block' : 'block'
                    }`}
                >
                    <PreviewPanel config={config} state={state} />
                </div>
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
                            currentStep: {
                                title: currentStepData?.title,
                                instruction: currentStepData?.instruction,
                                tip: currentStepData?.tip,
                            },
                            progress: {
                                step: state.currentStep + 1,
                                total: config.steps.length,
                                completedSteps: state.completedSteps.length,
                            },
                            textEntry: currentStepData
                                ? state.textEntries[currentStepData.id] ?? ''
                                : '',
                        }}
                    />

                    {/* Floating chat button — only visible when chat is closed */}
                    {!isChatOpen && (
                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="fixed bottom-6 right-6 z-40 w-13 h-13 bg-gradient-to-br from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
                            aria-label="Open AI-assistent"
                        >
                            <MessageCircle size={22} />
                        </button>
                    )}
                </>
            )}

            {/* Back button for mobile preview */}
            {mobileTab === 'preview' && (
                <div className="md:hidden fixed bottom-20 left-4 z-30">
                    <button
                        onClick={() => setMobileTab('instructies')}
                        className="flex items-center gap-2 bg-white border border-[#E8E6DF] rounded-full px-4 py-2 shadow-sm text-sm font-bold text-[#3D3D38]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        <ArrowLeft size={14} />
                        Instructies
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Public entry point — loads config dynamically ────────────────────────────

const LoadingScreen = () => (
    <div className="min-h-screen bg-[#FAF9F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D97757] border-t-transparent" />
    </div>
);

const builderConfigModules = import.meta.glob<{ default: BuilderCanvasConfig }>('./configs/*.ts');

export const BuilderCanvas: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<BuilderCanvasConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loader = builderConfigModules[`./configs/${missionId}.ts`];
        if (!loader) { setLoadError(true); return; }
        loader().then((mod) => {
            const cfg = mod.default ?? Object.values(mod).find((v): v is BuilderCanvasConfig => v && typeof v === 'object' && 'missionId' in v);
            if (cfg) setConfig(cfg);
            else setLoadError(true);
        }).catch(() => setLoadError(true));
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

    return <BuilderCanvasInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
