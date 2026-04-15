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

    return (
        <div className="p-5 flex-1 flex flex-col">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#D97757] to-[#C46849] flex items-center justify-center">
                    <span className="text-xs font-black text-white">{stepIndex + 1}</span>
                </div>
                <div>
                    <span
                        className="text-[10px] font-black text-[#D97757] uppercase tracking-widest block"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Stap {stepIndex + 1} van {totalSteps}
                    </span>
                    <h2
                        className="text-lg font-black text-[#1A1A19] leading-tight"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                        {stepData.title}
                    </h2>
                </div>
            </div>

            {/* Description */}
            <p
                className="text-sm text-[#6B6B66] leading-relaxed mb-4"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {stepData.description}
            </p>

            {/* Instruction card */}
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
                <p
                    className="text-sm text-[#3D3D38] leading-relaxed"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {stepData.instruction}
                </p>
            </div>

            {/* Optional tip */}
            {stepData.tip && (
                <div className="flex items-start gap-2 bg-[#D97757]/8 border border-[#D97757]/20 rounded-xl p-3 mb-4">
                    <Lightbulb size={14} className="text-[#D97757] mt-0.5 shrink-0" />
                    <p
                        className="text-xs text-[#D97757] leading-relaxed"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {stepData.tip}
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
                <div className="mb-4 flex-1 flex flex-col">
                    <label
                        className="text-[10px] font-black text-[#6B6B66] uppercase tracking-widest mb-2 block"
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
                        className="w-full flex-1 resize-none rounded-xl border border-[#E8E6DF] bg-white px-4 py-3 text-sm text-[#3D3D38] placeholder:text-[#6B6B66] focus:outline-none focus:ring-2 focus:ring-[#D97757]/30 focus:border-[#D97757]/50 transition-all duration-200 leading-relaxed"
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
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-auto ${
                    canProceed
                        ? 'bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white active:scale-[0.98]'
                        : 'bg-[#E8E6DF] text-[#6B6B66] cursor-not-allowed'
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

            {!isStepComplete && (
                <p
                    className="text-center text-xs text-[#6B6B66] mt-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Vink alle items af om door te gaan
                </p>
            )}
        </div>
    );
};
