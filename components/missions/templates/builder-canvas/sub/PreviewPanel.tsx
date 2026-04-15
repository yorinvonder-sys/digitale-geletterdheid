import React from 'react';
import { Eye, Layers } from 'lucide-react';
import type { BuilderCanvasConfig } from '../BuilderCanvas';
import type { BuilderCanvasState } from './types';

export interface PreviewPanelProps {
    config: BuilderCanvasConfig;
    state: BuilderCanvasState;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ config, state }) => {
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
