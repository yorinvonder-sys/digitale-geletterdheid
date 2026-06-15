import React from 'react';
import { Eye, Layers } from 'lucide-react';
import type { BuilderCanvasConfig } from '../BuilderCanvas';
import type { BuilderCanvasState } from './types';

export interface PreviewPanelProps {
    config: BuilderCanvasConfig;
    state: BuilderCanvasState;
}

const buildSafeHtmlPreview = (html: string): string => {
    const sanitized = html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
        .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, '')
        .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, '')
        .replace(/\son\w+\s*=\s*(["']).*?\1/gi, '')
        .replace(/\s(?:href|src)\s*=\s*(["'])\s*(?:javascript:|data:|https?:\/\/).*?\1/gi, '');

    return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'unsafe-inline';" />
  <style>
    body { font-family: system-ui, sans-serif; margin: 16px; color: #08283B; background: #FFFDF7; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
  </style>
</head>
<body>${sanitized}</body>
</html>`;
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ config, state }) => {
    const { previewType, steps } = config;
    const { checklist, textEntries, currentStep, completedSteps } = state;

    if (previewType === 'text-preview') {
        const hasAnyText = steps.some((s) => textEntries[s.id]?.trim());
        const combinedText = steps
            .map((step) => textEntries[step.id]?.trim())
            .filter(Boolean)
            .join('\n\n');
        const showHtmlPreview = config.missionId === 'website-bouwer' && combinedText.trim().length > 0;

        return (
            <div className="h-full overflow-y-auto p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={16} className="text-duck-coral" />
                    <span
                        className="text-xs font-black text-duck-coral uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Wat je bouwt
                    </span>
                </div>

                {!hasAnyText && (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-3">✍️</div>
                        <p
                            className="text-sm text-duck-muted"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Hier verschijnt jouw werk zodra je begint te schrijven.
                        </p>
                    </div>
                )}

                {showHtmlPreview && (
                    <div className="rounded-2xl border border-duck-line bg-white p-3">
                        <div
                            className="mb-2 text-[10px] font-black uppercase tracking-widest text-duck-muted"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Browser-preview
                        </div>
                        <iframe
                            title="Veilige HTML-preview"
                            sandbox=""
                            referrerPolicy="no-referrer"
                            srcDoc={buildSafeHtmlPreview(combinedText)}
                            className="h-56 w-full rounded-xl border border-duck-line bg-white"
                        />
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
                                    ? 'border-duck-ink/30 bg-duck-ink/5'
                                    : isActive
                                      ? 'border-duck-coral/30 bg-duck-coral/5'
                                      : 'border-duck-line bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                        isDone
                                            ? 'bg-duck-ink text-white'
                                            : isActive
                                              ? 'bg-duck-coral text-white'
                                              : 'bg-duck-line text-duck-muted'
                                    }`}
                                >
                                    {isDone ? '✓' : i + 1}
                                </div>
                                <span
                                    className="text-xs font-bold text-duck-muted uppercase tracking-wider"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {text?.trim() ? (
                                <p
                                    className="text-sm text-duck-muted whitespace-pre-wrap leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {text}
                                </p>
                            ) : (
                                <p
                                    className="text-sm text-duck-muted italic"
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
                    <Layers size={16} className="text-duck-coral" />
                    <span
                        className="text-xs font-black text-duck-coral uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Voortgang
                    </span>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className="text-sm font-bold text-duck-muted"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Totaal voltooid
                        </span>
                        <span className="text-sm font-black text-duck-coral">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-duck-line rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-duck-coral to-duck-ink rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p
                        className="text-xs text-duck-muted mt-1"
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
                                        ? 'border-duck-ink/30 bg-duck-ink/5'
                                        : isActive
                                          ? 'border-duck-coral/30 bg-duck-coral/5'
                                          : 'border-duck-line bg-white opacity-60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                                isDone
                                                    ? 'bg-duck-ink text-white'
                                                    : isActive
                                                      ? 'bg-duck-coral text-white'
                                                      : 'bg-duck-line text-duck-muted'
                                            }`}
                                        >
                                            {isDone ? '✓' : i + 1}
                                        </div>
                                        <span
                                            className="text-sm font-bold text-duck-muted"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs text-duck-muted"
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
                <Eye size={16} className="text-duck-coral" />
                <span
                    className="text-xs font-black text-duck-coral uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Live voorbeeld
                </span>
            </div>
            {activeText.trim() ? (
                <div
                    className="prose prose-sm max-w-none text-duck-muted leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {activeText}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-3xl mb-3">📄</div>
                    <p
                        className="text-sm text-duck-muted"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Begin te schrijven — hier zie je een live voorbeeld.
                    </p>
                </div>
            )}
        </div>
    );
};
