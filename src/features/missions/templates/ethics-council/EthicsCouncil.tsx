import React, { useState, useCallback, useEffect } from 'react';
import type { TemplateMissionProps, BadgeConfig, MissionGoal } from '../shared/types';
import { PhaseHeader } from '../shared/PhaseHeader';
import { CompletionScreen } from '../shared/CompletionScreen';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { getMissionGoal } from '@/config/missionGoals';
import { IntroDuck } from './sub/IntroDuck';
import { LegaalDossier } from './sub/LegaalDossier';
import { EerlijkDossier } from './sub/EerlijkDossier';
import { TransparantDossier } from './sub/TransparantDossier';
import { UitdagingBoss } from './sub/UitdagingBoss';
import { VonnisClimax } from './sub/VonnisClimax';
import { RewardHud } from './sub/RewardHud';

// ═══════════════════════════════════════════════════════════════
// Config contract (exported so configs/review-week-3.ts can import it)
// ═══════════════════════════════════════════════════════════════

export interface AvgAdvocaatInfo {
    name: string;
    emoji: string;
    role: string;
    keyArgument: string;
    perspective: string;
}

export interface EthicsCouncilConfig {
    missionId: string;
    title: string;
    introEmoji: string;
    introTitle: string;
    introDescription: string;
    introFeatures?: string[];
    missionGoal?: MissionGoal;
    maxScore: number;
    // Dossier 1 — Legaal
    avgAdvocaat: AvgAdvocaatInfo;
    // Dossier 2 — Eerlijk (categorize)
    eerlijkCategories: string[];
    eerlijkItems: Array<{ label: string; correctCategory: string }>;
    // Dossier 3 — Transparant
    transparantHint?: string;
    // Miniboss
    counterArgument: string;
    // Completion
    badges: BadgeConfig[];
    takeaways: string[];
}

// ═══════════════════════════════════════════════════════════════
// State contract (exported so sub-components can reference types)
// ═══════════════════════════════════════════════════════════════

export type EthicsStage =
    | 'intro'
    | 'legaal'
    | 'eerlijk'
    | 'transparant'
    | 'uitdaging'
    | 'vonnis';

export interface EthicsCouncilState {
    /**
     * Template discriminator: lets the stale-save guard detect an old
     * debate-arena blob (which lacks this field) and reset it.
     */
    _template: 'ethics-council';
    /** Tracks which mission the save belongs to */
    configMissionId: string;
    stage: EthicsStage;
    // ── Per-dossier scores ──
    legaalScore: number;
    eerlijkScore: number;
    transparantScore: number;
    uitdagingScore: number;
    // ── Input text (persisted so saves survive navigation) ──
    legaalVerdict: 'ja' | 'twijfel' | 'nee' | null;
    legaalJustification: string;
    transparantText: string;
    counterResponse: string;
}

// ── Point allocation ──────────────────────────────────────────
const LEGAAL_MAX     = 30;
const EERLIJK_MAX    = 30;
const TRANSPARANT_MAX = 20;
const UITDAGING_MAX  = 20;

// Stages in order (excluding intro and vonnis — those are handled separately)
const ACTIVE_STAGES: EthicsStage[] = ['legaal', 'eerlijk', 'transparant', 'uitdaging'];

// ═══════════════════════════════════════════════════════════════
// Allowlist
// ═══════════════════════════════════════════════════════════════

const VALID_ETHICS_COUNCIL_IDS: ReadonlySet<string> = new Set([
    'review-week-3',
]);

// ═══════════════════════════════════════════════════════════════
// Inner component (receives an already-resolved config)
// ═══════════════════════════════════════════════════════════════

interface EthicsCouncilWithConfigProps extends TemplateMissionProps {
    config: EthicsCouncilConfig;
}

const EthicsCouncilWithConfig: React.FC<EthicsCouncilWithConfigProps> = ({
    missionId,
    onBack,
    onComplete,
    config,
}) => {
    const initialState: EthicsCouncilState = {
        _template: 'ethics-council',
        configMissionId: config.missionId,
        stage: 'intro',
        legaalScore: 0,
        eerlijkScore: 0,
        transparantScore: 0,
        uitdagingScore: 0,
        legaalVerdict: null,
        legaalJustification: '',
        transparantText: '',
        counterResponse: '',
    };

    const { state, setState, clearSave } = useMissionAutoSave<EthicsCouncilState>(
        missionId,
        initialState
    );

    // ── Stale-save guard ─────────────────────────────────────
    // An old debate-arena save for review-week-3 won't have _template === 'ethics-council'.
    // Also reset if the configMissionId somehow drifted.
    useEffect(() => {
        const isStale =
            state._template !== 'ethics-council' ||
            state.configMissionId !== config.missionId;
        if (isStale) {
            setState(initialState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.missionId]);

    // ── Derived totals ────────────────────────────────────────
    const totalScore =
        state.legaalScore + state.eerlijkScore + state.transparantScore + state.uitdagingScore;

    // PhaseHeader: 0-based index into ACTIVE_STAGES; -1 on intro/vonnis → clamp to 0
    const phaseIndex = Math.max(0, ACTIVE_STAGES.indexOf(state.stage as EthicsStage));

    // ── Navigation ────────────────────────────────────────────

    const handleStart = useCallback(() => {
        setState((s) => ({ ...s, stage: 'legaal' }));
    }, [setState]);

    const handleLegaalComplete = useCallback(
        (score: number, verdict: 'ja' | 'twijfel' | 'nee', justification: string) => {
            setState((s) => ({
                ...s,
                legaalScore: Math.min(score, LEGAAL_MAX),
                legaalVerdict: verdict,
                legaalJustification: justification,
                stage: 'eerlijk',
            }));
        },
        [setState]
    );

    const handleEerlijkComplete = useCallback(
        (score: number) => {
            setState((s) => ({
                ...s,
                eerlijkScore: Math.min(score, EERLIJK_MAX),
                stage: 'transparant',
            }));
        },
        [setState]
    );

    const handleTransparantComplete = useCallback(
        (score: number, text: string) => {
            setState((s) => ({
                ...s,
                transparantScore: Math.min(score, TRANSPARANT_MAX),
                transparantText: text,
                stage: 'uitdaging',
            }));
        },
        [setState]
    );

    const handleUitdagingComplete = useCallback(
        (score: number, response: string) => {
            setState((s) => ({
                ...s,
                uitdagingScore: Math.min(score, UITDAGING_MAX),
                counterResponse: response,
                stage: 'vonnis',
            }));
        },
        [setState]
    );

    const handleComplete = useCallback(() => {
        clearSave();
        onComplete(true);
    }, [clearSave, onComplete]);

    // ── Render ────────────────────────────────────────────────

    // A stale (old debate-arena) save lacks our _template discriminator; the
    // guard effect above resets it. Until that lands, show the loader so we
    // never read undefined fields from a mismatched blob.
    if (state._template !== 'ethics-council') {
        return <LoadingScreen />;
    }

    if (state.stage === 'intro') {
        return (
            <IntroDuck
                title={config.introTitle}
                description={config.introDescription}
                onStart={handleStart}
                goal={config.missionGoal ?? getMissionGoal(config.missionId)}
                features={config.introFeatures}
            />
        );
    }

    if (state.stage === 'vonnis') {
        const phases = [
            { icon: '⚖️', title: 'Legaal dossier',       score: state.legaalScore,     max: LEGAAL_MAX },
            { icon: '🔍', title: 'Eerlijk dossier',       score: state.eerlijkScore,    max: EERLIJK_MAX },
            { icon: '🪟', title: 'Transparant dossier',   score: state.transparantScore, max: TRANSPARANT_MAX },
            { icon: '⚡', title: 'Miniboss: verdediging', score: state.uitdagingScore,  max: UITDAGING_MAX },
        ];

        return (
            <VonnisClimax
                score={totalScore}
                maxScore={config.maxScore}
                legaalScore={state.legaalScore}
                eerlijkScore={state.eerlijkScore}
                transparantScore={state.transparantScore}
                uitdagingScore={state.uitdagingScore}
                legaalMax={LEGAAL_MAX}
                eerlijkMax={EERLIJK_MAX}
                transparantMax={TRANSPARANT_MAX}
                uitdagingMax={UITDAGING_MAX}
                phases={phases}
                badges={config.badges}
                takeaways={config.takeaways}
                onComplete={handleComplete}
            />
        );
    }

    return (
        <div className="min-h-screen bg-duck-bg p-4">
            <div className="max-w-md mx-auto">
                <PhaseHeader
                    currentPhase={phaseIndex}
                    totalPhases={ACTIVE_STAGES.length}
                    totalScore={totalScore}
                    onBack={onBack}
                />

                <RewardHud completedDossiers={phaseIndex} totalDossiers={ACTIVE_STAGES.length} />

                <div className="bg-white rounded-2xl border border-duck-gray p-5">
                    {state.stage === 'legaal' && (
                        <LegaalDossier
                            advocaat={config.avgAdvocaat}
                            maxScore={LEGAAL_MAX}
                            savedVerdict={state.legaalVerdict}
                            savedJustification={state.legaalJustification}
                            onComplete={handleLegaalComplete}
                        />
                    )}

                    {state.stage === 'eerlijk' && (
                        <EerlijkDossier
                            categories={config.eerlijkCategories}
                            items={config.eerlijkItems}
                            maxScore={EERLIJK_MAX}
                            onComplete={handleEerlijkComplete}
                        />
                    )}

                    {state.stage === 'transparant' && (
                        <TransparantDossier
                            hint={config.transparantHint}
                            maxScore={TRANSPARANT_MAX}
                            savedText={state.transparantText}
                            onComplete={handleTransparantComplete}
                        />
                    )}

                    {state.stage === 'uitdaging' && (
                        <UitdagingBoss
                            counterArgument={config.counterArgument}
                            savedResponse={state.counterResponse}
                            maxScore={UITDAGING_MAX}
                            onComplete={handleUitdagingComplete}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// Loading / error screens
// ═══════════════════════════════════════════════════════════════

const LoadingScreen = () => (
    <div className="min-h-screen bg-duck-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-duck-acid border-t-transparent" />
    </div>
);

// ═══════════════════════════════════════════════════════════════
// Public entry point — dynamically loads the mission config
// ═══════════════════════════════════════════════════════════════

export const EthicsCouncil: React.FC<TemplateMissionProps> = (props) => {
    const { missionId, onBack } = props;
    const [config, setConfig] = useState<EthicsCouncilConfig | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        setConfig(null);
        setLoadError(false);

        if (!VALID_ETHICS_COUNCIL_IDS.has(missionId)) {
            setLoadError(true);
            return;
        }

        import(`./configs/${missionId}.ts`)
            .then((mod) => {
                const cfg: EthicsCouncilConfig | undefined =
                    (mod.default as EthicsCouncilConfig | undefined) ??
                    (Object.values(mod).find(
                        (v): v is EthicsCouncilConfig =>
                            v !== null &&
                            typeof v === 'object' &&
                            'missionId' in (v as object)
                    ));
                if (cfg) setConfig(cfg);
                else setLoadError(true);
            })
            .catch(() => setLoadError(true));
    }, [missionId]);

    if (loadError) {
        return (
            <div className="min-h-screen bg-duck-bg flex items-center justify-center p-4">
                <div className="text-center">
                    <p
                        className="text-duck-ink/60 mb-4"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Config niet gevonden: {missionId}
                    </p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-duck-acid text-duck-ink rounded-xl text-sm font-bold"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Terug
                    </button>
                </div>
            </div>
        );
    }

    if (!config) return <LoadingScreen />;

    return <EthicsCouncilWithConfig {...props} config={config} />;
};
