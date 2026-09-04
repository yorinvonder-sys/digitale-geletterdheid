import { useCallback, useEffect, useRef, useState } from 'react';

import {
    getDeveloperSettings,
    updateDeveloperSettings,
    type DeveloperSettings,
} from '@/services/developerService';
import {
    applyMissionQualityDecision,
    type DecisionStatus,
    type MissionQualityDecisionMap,
} from './missionQualityModel';

interface UseMissionQualityDecisionsOptions {
    userId?: string;
    previewMode: boolean;
}

export function useMissionQualityDecisions({
    userId,
    previewMode,
}: UseMissionQualityDecisionsOptions) {
    const [decisions, setDecisions] = useState<MissionQualityDecisionMap>({});
    const [loading, setLoading] = useState(!previewMode && Boolean(userId));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
    const decisionsRef = useRef<MissionQualityDecisionMap>({});
    const settingsRef = useRef<DeveloperSettings>({});
    const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
    const pendingSavesRef = useRef(0);
    const mountedRef = useRef(true);
    const persistenceReadyRef = useRef(previewMode);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (previewMode || !userId) {
            persistenceReadyRef.current = previewMode;
            setLoading(false);
            return;
        }

        let active = true;
        persistenceReadyRef.current = false;
        decisionsRef.current = {};
        settingsRef.current = {};
        setDecisions({});
        setLastSavedAt(null);
        setLoading(true);
        setError(null);

        getDeveloperSettings(userId)
            .then(settings => {
                if (!active) return;
                const savedDecisions = settings.missionQualityDecisions || {};
                settingsRef.current = settings;
                decisionsRef.current = savedDecisions;
                persistenceReadyRef.current = true;
                setDecisions(savedDecisions);
            })
            .catch(() => {
                if (active) {
                    persistenceReadyRef.current = false;
                    setError('Besluiten laden is mislukt. Nieuwe keuzes worden nu niet veilig opgeslagen.');
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [previewMode, userId]);

    const updateDecision = useCallback((
        decisionKey: string,
        status: DecisionStatus | null,
    ) => {
        if (!previewMode && (!userId || !persistenceReadyRef.current)) {
            setError('Wacht totdat eerdere besluiten veilig zijn geladen voordat je een keuze maakt.');
            return;
        }

        const nextDecisions = applyMissionQualityDecision(
            decisionsRef.current,
            decisionKey,
            status,
        );
        decisionsRef.current = nextDecisions;
        setDecisions(nextDecisions);

        if (previewMode || !userId) return;

        const nextSettings: DeveloperSettings = {
            ...settingsRef.current,
            missionQualityDecisions: nextDecisions,
        };
        settingsRef.current = nextSettings;
        pendingSavesRef.current += 1;
        setSaving(true);
        setError(null);

        saveQueueRef.current = saveQueueRef.current
            .catch(() => undefined)
            .then(() => updateDeveloperSettings(userId, nextSettings))
            .then(() => {
                if (mountedRef.current) {
                    setError(null);
                    setLastSavedAt(new Date().toISOString());
                }
            })
            .catch(() => {
                if (mountedRef.current) {
                    setError('Keuze staat op dit scherm, maar opslaan is mislukt. Vernieuw nog niet.');
                }
            })
            .finally(() => {
                pendingSavesRef.current -= 1;
                if (mountedRef.current && pendingSavesRef.current === 0) {
                    setSaving(false);
                }
            });
    }, [previewMode, userId]);

    return {
        decisions,
        canEdit: previewMode || Boolean(userId && persistenceReadyRef.current),
        loading,
        saving,
        error,
        lastSavedAt,
        updateDecision,
    };
}
