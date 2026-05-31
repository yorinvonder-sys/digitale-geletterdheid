import React from 'react';
import { CheckCircle2, Eye, Layers, RotateCcw, Target, TestTube2 } from 'lucide-react';
import type { BuilderCanvasConfig } from '../BuilderCanvas';
import type { BuilderCanvasState } from './types';

export interface PreviewPanelProps {
    config: BuilderCanvasConfig;
    state: BuilderCanvasState;
    onTestLensSelect: (lensId: string) => void;
    onMarkCurrentStepTested: () => void;
}

const TEST_LENSES = [
    {
        id: 'function',
        label: 'Werkt dit?',
        description: 'Test of de kern van deze stap doet wat hij belooft.',
        icon: TestTube2,
    },
    {
        id: 'clarity',
        label: 'Duidelijk?',
        description: 'Check of een ander snapt wat je hebt gemaakt.',
        icon: Eye,
    },
    {
        id: 'evidence',
        label: 'Bewijsbaar?',
        description: 'Kijk of je docent straks zichtbaar bewijs kan beoordelen.',
        icon: Target,
    },
    {
        id: 'iterate',
        label: 'Verbeterbaar?',
        description: 'Kies alvast wat sterker kan in je volgende versie.',
        icon: RotateCcw,
    },
];

// Keep this allowlist small: these missions intentionally render learner HTML inside the sandboxed srcdoc.
const HTML_PREVIEW_MISSION_IDS = new Set(['website-bouwer', 'web-developer']);

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

const MakerTestBench: React.FC<PreviewPanelProps> = ({
    config,
    state,
    onTestLensSelect,
    onMarkCurrentStepTested,
}) => {
    if (!config.experienceDesign) return null;

    const activeStep = config.steps[state.currentStep];
    if (!activeStep) return null;

    const selectedLens = TEST_LENSES.find((lens) => lens.id === state.testLensId);
    const isStepTested = !!state.testedSteps?.[activeStep.id];
    const testedCount = config.steps.filter((step) => state.testedSteps?.[step.id]).length;

    return (
        <section
            className="mb-4 rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] p-3 shadow-sm"
            data-qa="maker-test-bench"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0B453F] text-white">
                        <TestTube2 size={17} />
                    </div>
                    <div>
                        <p
                            className="text-[10px] font-black uppercase tracking-widest text-[#D97848]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Testbank
                        </p>
                        <h2
                            className="text-base font-black leading-tight text-[#08283B]"
                            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                        >
                            Test stap {state.currentStep + 1}: {activeStep.title}
                        </h2>
                    </div>
                </div>
                <span
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black ${
                        isStepTested
                            ? 'bg-[#5F947D]/15 text-[#0B453F]'
                            : 'bg-[#E7D8BD] text-[#445865]'
                    }`}
                    data-qa="maker-test-status"
                >
                    {testedCount}/{config.steps.length} getest
                </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4" role="group" aria-label="Kies testlens">
                {TEST_LENSES.map((lens) => {
                    const Icon = lens.icon;
                    const isSelected = state.testLensId === lens.id;
                    return (
                        <button
                            key={lens.id}
                            type="button"
                            onClick={() => onTestLensSelect(lens.id)}
                            data-qa="maker-test-lens"
                            aria-pressed={isSelected}
                            className={`rounded-xl border p-2 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F]/60 ${
                                isSelected
                                    ? 'border-[#0B453F] bg-[#0B453F] text-white shadow-sm'
                                    : 'border-[#E7D8BD] bg-white text-[#445865] hover:border-[#D97848]/60'
                            }`}
                        >
                            <div className="mb-1.5 flex items-center justify-between gap-2">
                                <Icon size={15} className={isSelected ? 'text-white' : 'text-[#D97848]'} />
                                {isSelected && <CheckCircle2 size={15} />}
                            </div>
                            <p
                                className={`text-xs font-black ${isSelected ? 'text-white' : 'text-[#08283B]'}`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {lens.label}
                            </p>
                            <p
                                className={`mt-1 text-[11px] leading-snug ${isSelected ? 'text-white/80' : 'text-[#445865]'}`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {lens.description}
                            </p>
                        </button>
                    );
                })}
            </div>

            <div
                className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed ${
                    selectedLens
                        ? 'border-[#5F947D]/35 bg-[#5F947D]/10 text-[#0B453F]'
                        : 'border-[#E7D8BD] bg-white text-[#445865]'
                }`}
                data-qa="maker-test-feedback"
                aria-live="polite"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {selectedLens
                    ? `${selectedLens.label} ${config.experienceDesign.feedbackMoment}`
                    : config.experienceDesign.antiBoringRule}
            </div>

            <button
                type="button"
                onClick={onMarkCurrentStepTested}
                disabled={!selectedLens}
                data-qa="maker-step-tested"
                className={`mt-3 flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-3 text-sm font-black transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B453F]/60 ${
                    selectedLens
                        ? isStepTested
                            ? 'bg-[#5F947D] text-white'
                            : 'bg-[#D97848] text-white hover:bg-[#C5673A]'
                        : 'cursor-not-allowed bg-[#E7D8BD] text-[#445865]/60'
                }`}
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {isStepTested ? 'Stap getest' : 'Markeer stap als getest'}
                <CheckCircle2 size={16} />
            </button>
        </section>
    );
};

export const PreviewPanel: React.FC<PreviewPanelProps> = (props) => {
    const { config, state } = props;
    const { previewType, steps } = config;
    const { checklist, textEntries, currentStep, completedSteps } = state;

    if (previewType === 'text-preview') {
        const hasAnyText = steps.some((s) => textEntries[s.id]?.trim());
        const combinedText = steps
            .map((step) => textEntries[step.id]?.trim())
            .filter(Boolean)
            .join('\n\n');
        const showHtmlPreview = HTML_PREVIEW_MISSION_IDS.has(config.missionId) && combinedText.trim().length > 0;

        return (
            <div className="h-full overflow-y-auto p-6 space-y-4" data-qa="builder-preview-panel">
                <MakerTestBench {...props} />

                <div className="flex items-center gap-2 mb-4">
                    <Eye size={16} className="text-[#D97848]" />
                    <span
                        className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Wat je bouwt
                    </span>
                </div>

                {!hasAnyText && (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-3">✍️</div>
                        <p
                            className="text-sm text-[#445865]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Hier verschijnt jouw werk zodra je begint te schrijven.
                        </p>
                    </div>
                )}

                {showHtmlPreview && (
                    <div className="rounded-2xl border border-[#E7D8BD] bg-white p-3">
                        <div
                            className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#445865]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Browser-preview
                        </div>
                        <iframe
                            title="Veilige HTML-preview"
                            sandbox=""
                            referrerPolicy="no-referrer"
                            srcDoc={buildSafeHtmlPreview(combinedText)}
                            className="h-56 w-full rounded-xl border border-[#E7D8BD] bg-white"
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
                                    ? 'border-[#5F947D]/30 bg-[#5F947D]/5'
                                    : isActive
                                      ? 'border-[#D97848]/30 bg-[#D97848]/5'
                                      : 'border-[#E7D8BD] bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                        isDone
                                            ? 'bg-[#5F947D] text-white'
                                            : isActive
                                              ? 'bg-[#D97848] text-white'
                                              : 'bg-[#E7D8BD] text-[#445865]'
                                    }`}
                                >
                                    {isDone ? '✓' : i + 1}
                                </div>
                                <span
                                    className="text-xs font-bold text-[#445865] uppercase tracking-wider"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {step.title}
                                </span>
                            </div>
                            {text?.trim() ? (
                                <p
                                    className="text-sm text-[#445865] whitespace-pre-wrap leading-relaxed"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    {text}
                                </p>
                            ) : (
                                <p
                                    className="text-sm text-[#445865] italic"
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
            <div className="h-full overflow-y-auto p-6" data-qa="builder-preview-panel">
                <MakerTestBench {...props} />

                <div className="flex items-center gap-2 mb-6">
                    <Layers size={16} className="text-[#D97848]" />
                    <span
                        className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Voortgang
                    </span>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className="text-sm font-bold text-[#445865]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            Totaal voltooid
                        </span>
                        <span className="text-sm font-black text-[#D97848]">{percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E7D8BD] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D97848] to-[#5F947D] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p
                        className="text-xs text-[#445865] mt-1"
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
                                        ? 'border-[#5F947D]/30 bg-[#5F947D]/5'
                                        : isActive
                                          ? 'border-[#D97848]/30 bg-[#D97848]/5'
                                          : 'border-[#E7D8BD] bg-white opacity-60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                                isDone
                                                    ? 'bg-[#5F947D] text-white'
                                                    : isActive
                                                      ? 'bg-[#D97848] text-white'
                                                      : 'bg-[#E7D8BD] text-[#445865]'
                                            }`}
                                        >
                                            {isDone ? '✓' : i + 1}
                                        </div>
                                        <span
                                            className="text-sm font-bold text-[#445865]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    <span
                                        className="text-xs text-[#445865]"
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
        <div className="h-full overflow-y-auto p-6" data-qa="builder-preview-panel">
            <MakerTestBench {...props} />

            <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[#D97848]" />
                <span
                    className="text-xs font-black text-[#D97848] uppercase tracking-widest"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Live voorbeeld
                </span>
            </div>
            {activeText.trim() ? (
                <div
                    className="prose prose-sm max-w-none text-[#445865] leading-relaxed whitespace-pre-wrap"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {activeText}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-3xl mb-3">📄</div>
                    <p
                        className="text-sm text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Begin te schrijven — hier zie je een live voorbeeld.
                    </p>
                </div>
            )}
        </div>
    );
};
