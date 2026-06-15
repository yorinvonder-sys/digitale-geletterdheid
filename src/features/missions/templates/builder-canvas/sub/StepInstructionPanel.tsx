import React from 'react';
import { ChevronRight, Lightbulb } from 'lucide-react';
import { FollowUpCard } from '../../shared/FollowUpCard';
import { ChecklistItem } from './ChecklistItem';
import type { BuilderStep } from '../BuilderCanvas';
import type { BuilderCanvasState } from './types';

interface StepInstructionPanelProps {
    stepData: BuilderStep;
    stepIndex: number;
    totalSteps: number;
    state: BuilderCanvasState;
    isStepComplete: boolean;
    onChecklistToggle: (itemKey: string) => void;
    onTextChange: (stepId: string, value: string) => void;
    onReflectionComplete: (stepId: string, correct: boolean) => void;
    onNextStep: () => void;
}

export const StepInstructionPanel: React.FC<StepInstructionPanelProps> = ({
    stepData,
    stepIndex,
    totalSteps,
    state,
    isStepComplete,
    onChecklistToggle,
    onTextChange,
    onReflectionComplete,
    onNextStep,
}) => {
    const reflectionRequired =
        isStepComplete &&
        !!stepData.reflectionQuestion &&
        !state.reflectionAnswered[stepData.id];
    const canProceed = isStepComplete && !reflectionRequired;
    const requiredTextLength = stepData.textPrompt ? (stepData.minTextLength ?? 40) : 0;
    const currentTextLength = state.textEntries[stepData.id]?.trim().length ?? 0;
    const textRequirementMet = !requiredTextLength || currentTextLength >= requiredTextLength;

    return (
        <div className="flex min-h-full flex-col p-5">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-duck-coral to-duck-coral flex items-center justify-center">
                    <span className="text-xs font-black text-white">{stepIndex + 1}</span>
                </div>
                <div>
                    <span
                        className="text-[10px] font-black text-duck-coral uppercase tracking-widest block"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Stap {stepIndex + 1} van {totalSteps}
                    </span>
                    <h2
                        className="text-lg font-black text-duck-ink leading-tight"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {stepData.title}
                    </h2>
                </div>
            </div>

            {/* Description */}
            <p
                className="text-sm text-duck-muted leading-relaxed mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {stepData.description}
            </p>

            {/* Instruction card */}
            <div className="bg-white rounded-2xl border border-duck-line p-4 mb-4">
                <p
                    className="text-sm text-duck-muted leading-relaxed"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {stepData.instruction}
                </p>
            </div>

            {/* Optional tip */}
            {stepData.tip && (
                <div className="flex items-start gap-2 bg-duck-coral/8 border border-duck-coral/20 rounded-xl p-3 mb-4">
                    <Lightbulb size={14} className="text-duck-coral mt-0.5 shrink-0" />
                    <p
                        className="text-xs text-duck-coral leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {stepData.tip}
                    </p>
                </div>
            )}

            {/* Checklist */}
            <div className="mb-4">
                <span
                    className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-2 block"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Checklist
                </span>
                <div className="space-y-2">
                    {stepData.checklistItems.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            checked={state.checklist[`${stepData.id}-${item.id}`] ?? false}
                            onToggle={(id) => onChecklistToggle(`${stepData.id}-${id}`)}
                        />
                    ))}
                </div>
            </div>

            {/* Optional text area */}
            {stepData.textPrompt && (
                <div className="mb-4 flex min-h-[160px] flex-1 flex-col">
                    <label
                        className="text-[10px] font-black text-duck-muted uppercase tracking-widest mb-2 block"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        htmlFor={`text-${stepData.id}`}
                    >
                        {stepData.textPrompt}
                    </label>
                    <textarea
                        id={`text-${stepData.id}`}
                        value={state.textEntries[stepData.id] ?? ''}
                        onChange={(e) => onTextChange(stepData.id, e.target.value)}
                        placeholder="Schrijf hier jouw antwoord…"
                        rows={5}
                        className="w-full min-h-[120px] flex-1 resize-none rounded-xl border border-duck-line bg-white px-4 py-3 text-sm leading-relaxed text-duck-muted placeholder:text-duck-muted transition-all duration-200 focus:border-duck-coral/50 focus:outline-none focus:ring-2 focus:ring-duck-coral/30"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                </div>
            )}

            {/* Reflection question — shown after checklist is complete */}
            {isStepComplete && stepData.reflectionQuestion && !state.reflectionAnswered[stepData.id] && (
                <FollowUpCard
                    followUp={stepData.reflectionQuestion}
                    onComplete={(correct) => onReflectionComplete(stepData.id, correct)}
                    theme="light"
                />
            )}

            {/* Next step button */}
            <button
                onClick={onNextStep}
                disabled={!canProceed}
                className={`mt-auto flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    canProceed
                        ? 'bg-gradient-to-r from-duck-coral to-duck-coral hover:from-duck-coral hover:to-duck-coral text-white active:scale-[0.98]'
                        : 'bg-duck-line text-duck-muted cursor-not-allowed'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {stepIndex === totalSteps - 1 ? (
                    <>Resultaten bekijken</>
                ) : (
                    <>
                        Volgende stap
                        <ChevronRight size={16} />
                    </>
                )}
            </button>

            {!textRequirementMet && (
                <p
                    className="text-center text-xs text-duck-muted mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Schrijf eerst minimaal {requiredTextLength} tekens als bewijs van je werk
                </p>
            )}

            {!isStepComplete && textRequirementMet && (
                <p
                    className="text-center text-xs text-duck-muted mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Vink alle items af om door te gaan
                </p>
            )}
        </div>
    );
};
