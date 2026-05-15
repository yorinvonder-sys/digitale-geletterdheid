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
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D97848] to-[#D97848] flex items-center justify-center">
                    <span className="text-xs font-black text-white">{stepIndex + 1}</span>
                </div>
                <div>
                    <span
                        className="text-[10px] font-black text-[#D97848] uppercase tracking-widest block"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Stap {stepIndex + 1} van {totalSteps}
                    </span>
                    <h2
                        className="text-lg font-black text-[#08283B] leading-tight"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {stepData.title}
                    </h2>
                </div>
            </div>

            {/* Description */}
            <p
                className="text-sm text-[#445865] leading-relaxed mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {stepData.description}
            </p>

            {/* Instruction card */}
            <div className="bg-white rounded-2xl border border-[#E7D8BD] p-4 mb-4">
                <p
                    className="text-sm text-[#445865] leading-relaxed"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {stepData.instruction}
                </p>
            </div>

            {/* Optional tip */}
            {stepData.tip && (
                <div className="flex items-start gap-2 bg-[#D97848]/8 border border-[#D97848]/20 rounded-xl p-3 mb-4">
                    <Lightbulb size={14} className="text-[#D97848] mt-0.5 shrink-0" />
                    <p
                        className="text-xs text-[#D97848] leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {stepData.tip}
                    </p>
                </div>
            )}

            {/* Checklist */}
            <div className="mb-4">
                <span
                    className="text-[10px] font-black text-[#445865] uppercase tracking-widest mb-2 block"
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
                        className="text-[10px] font-black text-[#445865] uppercase tracking-widest mb-2 block"
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
                        className="w-full min-h-[120px] flex-1 resize-none rounded-xl border border-[#E7D8BD] bg-white px-4 py-3 text-sm leading-relaxed text-[#445865] placeholder:text-[#445865] transition-all duration-200 focus:border-[#D97848]/50 focus:outline-none focus:ring-2 focus:ring-[#D97848]/30"
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
                        ? 'bg-gradient-to-r from-[#D97848] to-[#D97848] hover:from-[#D97848] hover:to-[#D97848] text-white active:scale-[0.98]'
                        : 'bg-[#E7D8BD] text-[#445865] cursor-not-allowed'
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
                    className="text-center text-xs text-[#445865] mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Schrijf eerst minimaal {requiredTextLength} tekens als bewijs van je werk
                </p>
            )}

            {!isStepComplete && textRequirementMet && (
                <p
                    className="text-center text-xs text-[#445865] mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Vink alle items af om door te gaan
                </p>
            )}
        </div>
    );
};
