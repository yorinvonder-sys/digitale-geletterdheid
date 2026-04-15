import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import type { TemplateMissionProps, BadgeConfig, FollowUpQuestion } from '../shared/types';
import { ExplorePhase } from './sub/ExplorePhase';
import { PositionPhase } from './sub/PositionPhase';
import { ArguePhase } from './sub/ArguePhase';
import { ChallengePhase } from './sub/ChallengePhase';
import { ReflectPhase } from './sub/ReflectPhase';

// ─── Config types ────────────────────────────────────────────────────────────

export interface Stakeholder {
    id: string;
    name: string;
    emoji: string;
    role: string;
    perspective: string;
    keyArgument: string;
}

export interface Position {
    id: string;
    label: string;
    description: string;
}

export interface DebateArenaConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    topic: string;
    dilemma: string;
    stakeholders: Stakeholder[];
    positions: Position[];
    argumentPrompts: string[];
    reflectionQuestions: string[];
    counterArgument: string;
    maxScore: number;
    badges: BadgeConfig[];
    takeaways: string[];
    explorationQuiz?: FollowUpQuestion;
    argumentQualityIndicators?: boolean;
}

// ─── State ───────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'explore' | 'position' | 'argue' | 'challenge' | 'reflect' | 'results';

export interface ArgumentEntry {
    claim: string;
    evidence: string;
    stakeholderId: string;
}

export interface DebateArenaState {
    phase: Phase;
    stakeholdersRead: string[];
    selectedPosition: string | null;
    arguments: ArgumentEntry[];
    counterResponse: string;
    reflectionAnswers: Record<string, string>;
    finalPosition: string | null;
    activeStakeholderIndex: number;
    activeArgumentIndex: number;
    explorationQuizAnswered?: boolean;
    explorationQuizCorrect?: boolean;
}

const buildInitialState = (): DebateArenaState => ({
    phase: 'intro',
    stakeholdersRead: [],
    selectedPosition: null,
    arguments: [
        { claim: '', evidence: '', stakeholderId: '' },
        { claim: '', evidence: '', stakeholderId: '' },
        { claim: '', evidence: '', stakeholderId: '' },
    ],
    counterResponse: '',
    reflectionAnswers: {},
    finalPosition: null,
    activeStakeholderIndex: 0,
    activeArgumentIndex: 0,
    explorationQuizAnswered: undefined,
    explorationQuizCorrect: undefined,
});

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(state: DebateArenaState, config: DebateArenaConfig): number {
    let score = 0;

    // All stakeholders read: 10 pts
    if (state.stakeholdersRead.length >= config.stakeholders.length) score += 10;

    // Exploration quiz bonus pts
    if (state.explorationQuizCorrect && config.explorationQuiz) {
        score += config.explorationQuiz.bonusPoints;
    }

    // Position chosen: 10 pts
    if (state.selectedPosition) score += 10;

    // Arguments: 20 pts each, max 3
    const validArgs = state.arguments.filter(
        (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
    );
    score += Math.min(validArgs.length, 3) * 20;

    // Counter-response: 10 pts
    if (state.counterResponse.trim().length >= 20) score += 10;

    // Reflection: 10 pts per question
    for (const q of config.reflectionQuestions) {
        const answer = state.reflectionAnswers[q] ?? '';
        if (answer.trim().length >= 20) score += 10;
    }

    return Math.min(score, config.maxScore);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DebateArenaProps extends TemplateMissionProps {
    config: DebateArenaConfig;
}

// ─── Component ────────────────────────────────────────────────────────────────

const DebateArenaInner: React.FC<DebateArenaProps> = ({ config, onBack, onComplete }) => {
    const { state, setState, clearSave } = useMissionAutoSave<DebateArenaState>(
        config.missionId,
        buildInitialState()
    );

    const score = useMemo(() => calcScore(state, config), [state, config]);

    const setPhase = (phase: Phase) => setState((s) => ({ ...s, phase }));

    const markStakeholderRead = (id: string) => {
        setState((s) => ({
            ...s,
            stakeholdersRead: s.stakeholdersRead.includes(id)
                ? s.stakeholdersRead
                : [...s.stakeholdersRead, id],
        }));
    };

    const phaseIndex: Record<Phase, number> = {
        intro: 0,
        explore: 1,
        position: 2,
        argue: 3,
        challenge: 4,
        reflect: 5,
        results: 6,
    };

    // Phase: intro
    if (state.phase === 'intro') {
        return (
            <IntroScreen
                emoji={config.introEmoji}
                title={config.introTitle}
                description={config.introDescription}
                features={config.introFeatures}
                onStart={() => setPhase('explore')}
            />
        );
    }

    // Phase: results
    if (state.phase === 'results') {
        const initialPos = config.positions.find((p) => p.id === state.selectedPosition);
        const finalPos = config.positions.find((p) => p.id === (state.finalPosition ?? state.selectedPosition));

        const phases = [
            { icon: '👥', title: 'Stakeholders gelezen', score: state.stakeholdersRead.length >= config.stakeholders.length ? 10 : 0, max: 10 },
            { icon: '📍', title: 'Positie gekozen', score: state.selectedPosition ? 10 : 0, max: 10 },
            { icon: '💬', title: 'Argumenten gebouwd', score: Math.min(state.arguments.filter(a => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20).length, 3) * 20, max: 60 },
            { icon: '⚡', title: 'Tegenargument beantwoord', score: state.counterResponse.trim().length >= 20 ? 10 : 0, max: 10 },
            { icon: '🪞', title: 'Gereflecteerd', score: config.reflectionQuestions.filter(q => (state.reflectionAnswers[q] ?? '').trim().length >= 20).length * 10, max: config.reflectionQuestions.length * 10 },
        ];

        return (
            <div className="min-h-screen bg-[#FAF9F0] p-4">
                <div className="max-w-md mx-auto">
                    <PhaseHeader
                        currentPhase={6}
                        totalPhases={6}
                        totalScore={score}
                        onBack={onBack}
                    />

                    {/* Journey summary */}
                    <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={16} className="text-[#8B6F9E]" />
                            <span className="text-xs font-black text-[#8B6F9E] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                Jouw debattraject
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 bg-[#F5F4EE] rounded-xl p-3 text-center">
                                <div className="text-xs text-[#6B6B66] mb-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Begin</div>
                                <div className="text-sm font-bold text-[#1A1A19]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {initialPos?.label ?? '—'}
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-[#6B6B66] shrink-0" />
                            <div className="flex-1 bg-[#8B6F9E]/10 rounded-xl p-3 text-center border border-[#8B6F9E]/20">
                                <div className="text-xs text-[#8B6F9E] mb-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Einde</div>
                                <div className="text-sm font-bold text-[#8B6F9E]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {finalPos?.label ?? initialPos?.label ?? '—'}
                                </div>
                            </div>
                        </div>

                        {state.arguments.filter(a => a.claim.trim().length > 0).map((arg, i) => (
                            <div key={i} className={`py-2.5 ${i < 2 ? 'border-b border-[#E8E6DF]' : ''}`}>
                                <div className="text-xs text-[#6B6B66] mb-0.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Argument {i + 1}
                                </div>
                                <div className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {arg.claim.trim()}
                                </div>
                            </div>
                        ))}
                    </div>

                    <CompletionScreen
                        score={score}
                        maxScore={config.maxScore}
                        badges={config.badges}
                        phases={phases}
                        takeaways={config.takeaways}
                        onComplete={() => {
                            clearSave();
                            onComplete(true);
                        }}
                    />
                </div>
            </div>
        );
    }

    const currentPhaseIndex = phaseIndex[state.phase];

    return (
        <div className="min-h-screen bg-[#FAF9F0] p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={currentPhaseIndex}
                    totalPhases={6}
                    totalScore={score}
                    onBack={onBack}
                />

                {/* Dilemma banner */}
                <div className="bg-[#8B6F9E]/8 border border-[#8B6F9E]/20 rounded-2xl p-3 mb-5">
                    <div className="text-xs font-black text-[#8B6F9E] uppercase tracking-widest mb-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Stelling
                    </div>
                    <p className="text-sm text-[#3D3D38] leading-relaxed italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        "{config.dilemma}"
                    </p>
                </div>

                {state.phase === 'explore' && (
                    <ExplorePhase
                        config={config}
                        state={state}
                        onMarkRead={markStakeholderRead}
                        onSetActiveIndex={(i) => setState((s) => ({ ...s, activeStakeholderIndex: i }))}
                        onNext={() => setPhase('position')}
                        onQuizComplete={(correct) => setState((s) => ({ ...s, explorationQuizAnswered: true, explorationQuizCorrect: correct }))}
                    />
                )}

                {state.phase === 'position' && (
                    <PositionPhase
                        config={config}
                        state={state}
                        onSelect={(id) => setState((s) => ({ ...s, selectedPosition: id }))}
                        onNext={() => setPhase('argue')}
                        onBack={() => setPhase('explore')}
                    />
                )}

                {state.phase === 'argue' && (
                    <ArguePhase
                        config={config}
                        state={state}
                        onUpdateArgument={(index, field, value) => {
                            setState((s) => {
                                const args = [...s.arguments];
                                args[index] = { ...args[index], [field]: value };
                                return { ...s, arguments: args };
                            });
                        }}
                        onSetActiveIndex={(i) => setState((s) => ({ ...s, activeArgumentIndex: i }))}
                        onNext={() => setPhase('challenge')}
                        onBack={() => setPhase('position')}
                    />
                )}

                {state.phase === 'challenge' && (
                    <ChallengePhase
                        config={config}
                        state={state}
                        onUpdateResponse={(val) => setState((s) => ({ ...s, counterResponse: val }))}
                        onNext={() => setPhase('reflect')}
                        onBack={() => setPhase('argue')}
                    />
                )}

                {state.phase === 'reflect' && (
                    <ReflectPhase
                        config={config}
                        state={state}
                        onUpdateAnswer={(q, val) =>
                            setState((s) => ({
                                ...s,
                                reflectionAnswers: { ...s.reflectionAnswers, [q]: val },
                            }))
                        }
                        onSelectFinalPosition={(id) => setState((s) => ({ ...s, finalPosition: id }))}
                        onNext={() => setPhase('results')}
                        onBack={() => setPhase('challenge')}
                    />
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

export const DebateArena: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<DebateArenaConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        import(`./configs/${missionId}`)
            .then((mod) => {
                const cfg = mod.default ?? Object.values(mod).find((v): v is DebateArenaConfig => v && typeof v === 'object' && 'missionId' in v);
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

    return <DebateArenaInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
