import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import type { CategorizeProgress } from '../review-arena/sub/Categorize';
import { toScorePercent } from '../shared/scorePercent';

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
    /** Plaatsingen van dossier 2; optioneel, want oudere saves kennen dit veld niet. */
    eerlijkProgress?: CategorizeProgress;
}

// ── Point allocation ──────────────────────────────────────────
const LEGAAL_MAX     = 30;
const EERLIJK_MAX    = 30;
const TRANSPARANT_MAX = 20;
const UITDAGING_MAX  = 20;

// Stages in order (excluding intro and vonnis — those are handled separately)
const ACTIVE_STAGES: EthicsStage[] = ['legaal', 'eerlijk', 'transparant', 'uitdaging'];

const VALID_STAGES = new Set<string>([
    'intro',
    'legaal',
    'eerlijk',
    'transparant',
    'uitdaging',
    'vonnis',
] satisfies EthicsStage[]);

/** Elk veld dat een ethics-council-save mag bevatten. */
const STATE_KEYS = new Set<string>([
    '_template',
    'configMissionId',
    'stage',
    'legaalScore',
    'eerlijkScore',
    'transparantScore',
    'uitdagingScore',
    'legaalVerdict',
    'legaalJustification',
    'transparantText',
    'counterResponse',
    'eerlijkProgress',
] satisfies Array<keyof EthicsCouncilState>);

/**
 * De hook merget opgeslagen state OVER de initiële state heen, dus `_template`
 * en `configMissionId` komen altijd uit de initiële state en verraden een blob
 * van een andere template niet. Zijn eigen velden blijven na die merge wél
 * staan — daar herkennen we hem aan. Zo lekt een oude debate-arena-save met een
 * gelijknamig veld (`counterResponse`) geen voorgevulde tekst in de miniboss.
 * Een oudere ethics-council-save bevat alleen bekende velden en blijft geldig.
 */
const isOwnSave = (state: EthicsCouncilState): boolean =>
    Object.keys(state).every((key) => STATE_KEYS.has(key)) &&
    VALID_STAGES.has(state.stage);

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
        initialState,
        { validate: isOwnSave }
    );

    // ── Focus bij stagewissel ────────────────────────────────
    // De kaartinhoud wordt vervangen zonder dat er iets van navigatie verschuift;
    // zonder overdracht valt de focus terug op <body> en hoort een schermlezer
    // niets van het nieuwe dossier.
    const stageCardRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        stageCardRef.current?.focus();
    }, [state.stage]);

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

    const handleEerlijkProgress = useCallback(
        (progress: CategorizeProgress) => {
            setState((s) => ({ ...s, eerlijkProgress: progress }));
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

    const handleComplete = useCallback(async () => {
        // Pas wissen als de voltooiing is vastgelegd, anders raakt de leerling
        // zijn dossiers kwijt bij een mislukte serveropslag.
        const completed = await onComplete(true, toScorePercent(totalScore, config.maxScore));
        if (completed !== false) {
            clearSave();
        }
    }, [clearSave, onComplete, totalScore, config.maxScore]);

    // Opnieuw proberen vanaf dossier 1. Antwoorden én scores blijven staan: elk
    // dossier overschrijft zijn eigen score pas bij het opnieuw afsluiten, dus
    // wie halverwege stopt houdt wat hij al had.
    const handleRetry = useCallback(() => {
        setState((s) => ({ ...s, stage: 'legaal' }));
    }, [setState]);

    // ── Render ────────────────────────────────────────────────

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
                onRetry={handleRetry}
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

                <div
                    ref={stageCardRef}
                    tabIndex={-1}
                    className="bg-white rounded-2xl border border-duck-gray p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                >
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
                            savedProgress={state.eerlijkProgress}
                            onProgress={handleEerlijkProgress}
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
                        className="text-duck-ink/70 mb-4"
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
