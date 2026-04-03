import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, MessageSquare, Sparkles, Trophy, Users } from 'lucide-react';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { PhaseHeader } from '../shared/PhaseHeader';
import { IntroScreen } from '../shared/IntroScreen';
import { CompletionScreen } from '../shared/CompletionScreen';
import type { TemplateMissionProps, BadgeConfig } from '../shared/types';

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
}

// ─── State ───────────────────────────────────────────────────────────────────

type Phase = 'intro' | 'explore' | 'position' | 'argue' | 'challenge' | 'reflect' | 'results';

interface ArgumentEntry {
    claim: string;
    evidence: string;
    stakeholderId: string;
}

interface DebateArenaState {
    phase: Phase;
    stakeholdersRead: string[];
    selectedPosition: string | null;
    arguments: ArgumentEntry[];
    counterResponse: string;
    reflectionAnswers: Record<string, string>;
    finalPosition: string | null;
    activeStakeholderIndex: number;
    activeArgumentIndex: number;
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
});

// ─── Score calculation ────────────────────────────────────────────────────────

function calcScore(state: DebateArenaState, config: DebateArenaConfig): number {
    let score = 0;

    // All stakeholders read: 10 pts
    if (state.stakeholdersRead.length >= config.stakeholders.length) score += 10;

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

// ─── Stakeholder border colors ────────────────────────────────────────────────

const STAKEHOLDER_COLORS = ['#D97757', '#8B6F9E', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

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

    // Helpers
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

                {/* ── PHASE: EXPLORE ── */}
                {state.phase === 'explore' && (
                    <ExplorePhase
                        config={config}
                        state={state}
                        onMarkRead={markStakeholderRead}
                        onSetActiveIndex={(i) => setState((s) => ({ ...s, activeStakeholderIndex: i }))}
                        onNext={() => setPhase('position')}
                    />
                )}

                {/* ── PHASE: POSITION ── */}
                {state.phase === 'position' && (
                    <PositionPhase
                        config={config}
                        state={state}
                        onSelect={(id) => setState((s) => ({ ...s, selectedPosition: id }))}
                        onNext={() => setPhase('argue')}
                        onBack={() => setPhase('explore')}
                    />
                )}

                {/* ── PHASE: ARGUE ── */}
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

                {/* ── PHASE: CHALLENGE ── */}
                {state.phase === 'challenge' && (
                    <ChallengePhase
                        config={config}
                        state={state}
                        onUpdateResponse={(val) => setState((s) => ({ ...s, counterResponse: val }))}
                        onNext={() => setPhase('reflect')}
                        onBack={() => setPhase('argue')}
                    />
                )}

                {/* ── PHASE: REFLECT ── */}
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

// ─── Sub-phases ───────────────────────────────────────────────────────────────

interface ExplorePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onMarkRead: (id: string) => void;
    onSetActiveIndex: (i: number) => void;
    onNext: () => void;
}

const ExplorePhase: React.FC<ExplorePhaseProps> = ({ config, state, onMarkRead, onSetActiveIndex, onNext }) => {
    const active = config.stakeholders[state.activeStakeholderIndex];
    const color = STAKEHOLDER_COLORS[state.activeStakeholderIndex % STAKEHOLDER_COLORS.length];
    const allRead = state.stakeholdersRead.length >= config.stakeholders.length;

    const handleMarkRead = () => {
        onMarkRead(active.id);
    };

    const isRead = state.stakeholdersRead.includes(active.id);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Leer de betrokkenen kennen
                </h2>
                <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Lees alle {config.stakeholders.length} perspectieven voordat je positie kiest.
                </p>
            </div>

            {/* Stakeholder tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {config.stakeholders.map((sh, i) => {
                    const read = state.stakeholdersRead.includes(sh.id);
                    const isActive = i === state.activeStakeholderIndex;
                    return (
                        <button
                            key={sh.id}
                            onClick={() => onSetActiveIndex(i)}
                            className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all duration-200 ${
                                isActive
                                    ? 'border-[#8B6F9E] bg-[#8B6F9E]/10'
                                    : 'border-[#E8E6DF] bg-white hover:border-[#8B6F9E]/40'
                            }`}
                        >
                            <span className="text-lg leading-none">{sh.emoji}</span>
                            <span className="text-[10px] font-bold text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {sh.name}
                            </span>
                            {read && <span className="text-[9px] text-[#10B981] font-bold">✓ gelezen</span>}
                        </button>
                    );
                })}
            </div>

            {/* Active stakeholder card */}
            <div
                className="bg-white rounded-2xl border-2 p-5 mb-4 transition-all duration-300"
                style={{ borderColor: color }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ background: `${color}18` }}
                    >
                        {active.emoji}
                    </div>
                    <div>
                        <div className="font-black text-[#1A1A19] text-base" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                            {active.name}
                        </div>
                        <div className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            {active.role}
                        </div>
                    </div>
                </div>

                <p className="text-sm text-[#3D3D38] leading-relaxed mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    "{active.perspective}"
                </p>

                <div className="rounded-xl p-3" style={{ background: `${color}10`, borderLeft: `3px solid ${color}` }}>
                    <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color, fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Kernargument
                    </div>
                    <p className="text-sm text-[#3D3D38]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {active.keyArgument}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3 mb-4">
                <button
                    onClick={() => onSetActiveIndex(Math.max(0, state.activeStakeholderIndex - 1))}
                    disabled={state.activeStakeholderIndex === 0}
                    className="flex-1 py-2.5 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] disabled:opacity-30 transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    ← Vorige
                </button>
                {!isRead ? (
                    <button
                        onClick={handleMarkRead}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                        style={{ background: color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Gelezen ✓
                    </button>
                ) : state.activeStakeholderIndex < config.stakeholders.length - 1 ? (
                    <button
                        onClick={() => onSetActiveIndex(state.activeStakeholderIndex + 1)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]"
                        style={{ background: color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Volgende →
                    </button>
                ) : null}
            </div>

            {allRead && (
                <button
                    onClick={onNext}
                    className="w-full py-3.5 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Kies jouw positie
                    <ChevronRight size={16} />
                </button>
            )}

            {!allRead && (
                <p className="text-center text-xs text-[#6B6B66] mt-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Lees alle perspectieven om door te gaan ({state.stakeholdersRead.length}/{config.stakeholders.length} gelezen)
                </p>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

interface PositionPhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onSelect: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const PositionPhase: React.FC<PositionPhaseProps> = ({ config, state, onSelect, onNext, onBack }) => {
    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Wat vind jij?
                </h2>
                <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Kies de positie die het best bij jouw mening past. Je kunt aan het einde reflecteren of die is veranderd.
                </p>
            </div>

            <div className="space-y-3 mb-6">
                {config.positions.map((pos) => {
                    const isSelected = state.selectedPosition === pos.id;
                    return (
                        <button
                            key={pos.id}
                            onClick={() => onSelect(pos.id)}
                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                                isSelected
                                    ? 'border-[#8B6F9E] bg-[#8B6F9E]/10'
                                    : 'border-[#E8E6DF] bg-white hover:border-[#8B6F9E]/40'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                                        isSelected ? 'border-[#8B6F9E] bg-[#8B6F9E]' : 'border-[#E8E6DF]'
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <div
                                        className={`font-black text-sm mb-1 ${isSelected ? 'text-[#8B6F9E]' : 'text-[#1A1A19]'}`}
                                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                                    >
                                        {pos.label}
                                    </div>
                                    <p className="text-xs text-[#6B6B66] leading-relaxed" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        {pos.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-[#F5F4EE] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!state.selectedPosition}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bouw je argumenten
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

interface ArguePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateArgument: (index: number, field: keyof ArgumentEntry, value: string) => void;
    onSetActiveIndex: (i: number) => void;
    onNext: () => void;
    onBack: () => void;
}

const ArguePhase: React.FC<ArguePhaseProps> = ({ config, state, onUpdateArgument, onSetActiveIndex, onNext, onBack }) => {
    const activeArg = state.arguments[state.activeArgumentIndex];
    const validCount = state.arguments.filter(
        (a) => a.claim.trim().length >= 20 && a.evidence.trim().length >= 20
    ).length;

    const selectedPos = config.positions.find((p) => p.id === state.selectedPosition);

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Bouw je argumenten
                </h2>
                <p className="text-xs text-[#6B6B66] mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Onderbouw je positie met minimaal 2 sterke argumenten.
                </p>
                {selectedPos && (
                    <div className="inline-flex items-center gap-1.5 bg-[#8B6F9E]/10 border border-[#8B6F9E]/20 rounded-full px-3 py-1">
                        <span className="text-xs font-bold text-[#8B6F9E]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                            Jouw positie: {selectedPos.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Argument tabs */}
            <div className="flex gap-2 mb-4">
                {state.arguments.map((arg, i) => {
                    const valid = arg.claim.trim().length >= 20 && arg.evidence.trim().length >= 20;
                    const isActive = i === state.activeArgumentIndex;
                    return (
                        <button
                            key={i}
                            onClick={() => onSetActiveIndex(i)}
                            className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                                isActive
                                    ? 'border-[#D97757] bg-[#D97757]/10 text-[#D97757]'
                                    : valid
                                      ? 'border-[#10B981] bg-[#10B981]/5 text-[#10B981]'
                                      : 'border-[#E8E6DF] bg-white text-[#6B6B66]'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {valid ? '✓ ' : ''}Arg {i + 1}
                        </button>
                    );
                })}
            </div>

            {/* Argument card */}
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-4">
                <div className="text-xs font-black text-[#D97757] uppercase tracking-widest mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Argument {state.activeArgumentIndex + 1}
                </div>

                <div className="mb-3">
                    <label className="text-xs font-bold text-[#6B6B66] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Ik vind dat...
                    </label>
                    <textarea
                        value={activeArg.claim}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'claim', e.target.value)}
                        placeholder="Geef jouw standpunt weer in eigen woorden..."
                        rows={2}
                        className="w-full text-sm text-[#1A1A19] bg-[#F5F4EE] border border-[#E8E6DF] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97757] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    <div className={`text-right text-[10px] mt-0.5 ${activeArg.claim.trim().length >= 20 ? 'text-[#10B981]' : 'text-[#6B6B66]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {activeArg.claim.trim().length}/20 min.
                    </div>
                </div>

                <div className="mb-3">
                    <label className="text-xs font-bold text-[#6B6B66] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Want...
                    </label>
                    <textarea
                        value={activeArg.evidence}
                        onChange={(e) => onUpdateArgument(state.activeArgumentIndex, 'evidence', e.target.value)}
                        placeholder="Onderbouw met een feit, voorbeeld of redenering..."
                        rows={2}
                        className="w-full text-sm text-[#1A1A19] bg-[#F5F4EE] border border-[#E8E6DF] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97757] transition-colors"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                    <div className={`text-right text-[10px] mt-0.5 ${activeArg.evidence.trim().length >= 20 ? 'text-[#10B981]' : 'text-[#6B6B66]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        {activeArg.evidence.trim().length}/20 min.
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-[#6B6B66] block mb-1.5" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Dit raakt het perspectief van...
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {config.stakeholders.map((sh) => (
                            <button
                                key={sh.id}
                                onClick={() => onUpdateArgument(state.activeArgumentIndex, 'stakeholderId', sh.id)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                                    activeArg.stakeholderId === sh.id
                                        ? 'border-[#D97757] bg-[#D97757]/10 text-[#D97757]'
                                        : 'border-[#E8E6DF] bg-[#F5F4EE] text-[#6B6B66] hover:border-[#D97757]/40'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {sh.emoji} {sh.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-[#F5F4EE] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={validCount < 2}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {validCount < 2 ? `Nog ${2 - validCount} argument${2 - validCount === 1 ? '' : 'en'} nodig` : 'Beantwoord tegenargument'}
                    {validCount >= 2 && <ChevronRight size={16} />}
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

interface ChallengePhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateResponse: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const ChallengePhase: React.FC<ChallengePhaseProps> = ({ config, state, onUpdateResponse, onNext, onBack }) => {
    const canContinue = state.counterResponse.trim().length >= 20;

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Verdedig je standpunt
                </h2>
                <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Een tegenstander heeft een argument. Wat antwoord jij?
                </p>
            </div>

            {/* Counter-argument card */}
            <div className="bg-white rounded-2xl border-2 border-[#D97757]/30 p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#D97757]/10 rounded-xl flex items-center justify-center text-base">
                        ⚡
                    </div>
                    <div className="text-xs font-black text-[#D97757] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Tegenargument
                    </div>
                </div>
                <p className="text-sm text-[#3D3D38] leading-relaxed italic" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    {config.counterArgument}
                </p>
            </div>

            {/* Response input */}
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-5">
                <label className="text-xs font-bold text-[#6B6B66] block mb-2" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Jouw reactie
                </label>
                <textarea
                    value={state.counterResponse}
                    onChange={(e) => onUpdateResponse(e.target.value)}
                    placeholder="Leg uit waarom je het eens of oneens bent met dit tegenargument, of nuanceer het..."
                    rows={4}
                    className="w-full text-sm text-[#1A1A19] bg-[#F5F4EE] border border-[#E8E6DF] rounded-xl p-3 resize-none focus:outline-none focus:border-[#D97757] transition-colors"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                />
                <div className={`text-right text-[10px] mt-1 ${canContinue ? 'text-[#10B981]' : 'text-[#6B6B66]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    {state.counterResponse.trim().length}/20 min.
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-[#F5F4EE] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!canContinue}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Reflecteer
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────

interface ReflectPhaseProps {
    config: DebateArenaConfig;
    state: DebateArenaState;
    onUpdateAnswer: (q: string, val: string) => void;
    onSelectFinalPosition: (id: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const ReflectPhase: React.FC<ReflectPhaseProps> = ({ config, state, onUpdateAnswer, onSelectFinalPosition, onNext, onBack }) => {
    const allAnswered = config.reflectionQuestions.every(
        (q) => (state.reflectionAnswers[q] ?? '').trim().length >= 20
    );

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-lg font-black text-[#1A1A19] mb-1" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                    Reflecteer
                </h2>
                <p className="text-xs text-[#6B6B66]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Goede debaters denken na over hun eigen standpunten.
                </p>
            </div>

            {/* Reflection questions */}
            <div className="space-y-4 mb-5">
                {config.reflectionQuestions.map((q, i) => {
                    const answer = state.reflectionAnswers[q] ?? '';
                    const valid = answer.trim().length >= 20;
                    return (
                        <div key={i} className="bg-white rounded-2xl border border-[#E8E6DF] p-4">
                            <div className="flex items-start gap-2 mb-2">
                                <div className="w-5 h-5 bg-[#8B6F9E]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-black text-[#8B6F9E]">{i + 1}</span>
                                </div>
                                <label className="text-sm font-bold text-[#1A1A19]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    {q}
                                </label>
                            </div>
                            <textarea
                                value={answer}
                                onChange={(e) => onUpdateAnswer(q, e.target.value)}
                                placeholder="Schrijf je antwoord hier..."
                                rows={3}
                                className="w-full text-sm text-[#1A1A19] bg-[#F5F4EE] border border-[#E8E6DF] rounded-xl p-3 resize-none focus:outline-none focus:border-[#8B6F9E] transition-colors"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            />
                            <div className={`text-right text-[10px] mt-1 ${valid ? 'text-[#10B981]' : 'text-[#6B6B66]'}`} style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                {answer.trim().length}/20 min.
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Optional position shift */}
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#8B6F9E]" />
                    <span className="text-xs font-black text-[#8B6F9E] uppercase tracking-widest" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        Eindpositie (optioneel)
                    </span>
                </div>
                <p className="text-xs text-[#6B6B66] mb-3" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                    Is je mening veranderd? Je kunt je positie aanpassen. Dat is juist een teken van goed denken.
                </p>
                <div className="space-y-2">
                    {config.positions.map((pos) => {
                        const effectiveFinal = state.finalPosition ?? state.selectedPosition;
                        const isSelected = effectiveFinal === pos.id;
                        const isInitial = state.selectedPosition === pos.id;
                        return (
                            <button
                                key={pos.id}
                                onClick={() => onSelectFinalPosition(pos.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all text-sm ${
                                    isSelected
                                        ? 'border-[#8B6F9E] bg-[#8B6F9E]/10 font-bold text-[#8B6F9E]'
                                        : 'border-[#E8E6DF] bg-[#F5F4EE] text-[#3D3D38] hover:border-[#8B6F9E]/40'
                                }`}
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {pos.label}
                                {isInitial && <span className="text-[10px] text-[#6B6B66] ml-2">(was jouw keuze)</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-3 border border-[#E8E6DF] rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-[#F5F4EE] transition-all"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={onNext}
                    disabled={!allAnswered}
                    className="flex-1 py-3 bg-gradient-to-r from-[#D97757] to-[#C46849] hover:from-[#C46849] hover:to-[#B05A3C] text-white rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    Bekijk resultaat
                    <Trophy size={16} />
                </button>
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

const debateConfigModules = import.meta.glob<{ default: DebateArenaConfig }>('./configs/*.ts');

export const DebateArena: React.FC<TemplateMissionProps> = ({ missionId, onBack, onComplete }) => {
    const [config, setConfig] = useState<DebateArenaConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const loader = debateConfigModules[`./configs/${missionId}.ts`];
        if (!loader) { setLoadError(true); return; }
        loader().then((mod) => {
            const cfg = mod.default ?? Object.values(mod).find((v): v is DebateArenaConfig => v && typeof v === 'object' && 'missionId' in v);
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

    return <DebateArenaInner config={config} missionId={missionId} onBack={onBack} onComplete={onComplete} />;
};
