import React, { useState, useEffect } from 'react';
import { ParentUser } from '../types';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';
import { logActivity } from '../services/teacherService';
import { deserializeClassroomConfig } from '../utils/classroomConfig';

interface UseFocusModeParams {
    user: ParentUser | null;
    activeModule: string | null;
    handleSelectModule: (id: string) => void;
}

export function useFocusMode({ user, activeModule, handleSelectModule }: UseFocusModeParams) {
    const [focusMode, setFocusMode] = useState(false);
    const [focusMissionId, setFocusMissionId] = useState<string | null>(null);
    const [focusMissionTitle, setFocusMissionTitle] = useState<string | null>(null);
    const [focusModeAcknowledged, setFocusModeAcknowledged] = useState(false);
    // NEW: Robust tracking of focus state to prevent reset loops
    const lastProcessedFocusMissionId = React.useRef<string | null>(null);
    const lastProcessedFocusMode = React.useRef<boolean>(false);

    // NEW: Session storage key for focus intent persistence
    const FOCUS_INTENT_KEY = 'dgskills_focus_intent';
    const FOCUS_INTENT_TTL = 5 * 60 * 1000; // 5 minutes

    useEffect(() => {
        if (!user || user.role !== 'student') return;
        const cls = user.stats?.studentClass || user.studentClass;
        if (!cls) return;

        const channel = supabase
            .channel(`classroom-config-${cls}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'classroom_configs',
                filter: `id=eq.${cls}`
            }, (payload) => {
                const config = deserializeClassroomConfig(payload.new as Record<string, unknown>);
                if (!config) return;

                // Only reset acknowledgement if focus mode changed or mission ID changed
                const focusModeChanged = config.focusMode !== lastProcessedFocusMode.current;
                const missionChanged = config.focusMissionId !== lastProcessedFocusMissionId.current;

                if (focusModeChanged || missionChanged) {
                    // But don't reset if we are RESTORING from session storage
                    const stored = sessionStorage.getItem(FOCUS_INTENT_KEY);
                    let isRestoring = false;
                    if (stored) {
                        try {
                            const { missionId } = JSON.parse(stored);
                            if (missionId === config.focusMissionId) isRestoring = true;
                        } catch (e) { }
                    }

                    if (!isRestoring) {
                        setFocusModeAcknowledged(false);
                    }
                }

                lastProcessedFocusMode.current = !!config.focusMode;
                lastProcessedFocusMissionId.current = config.focusMissionId || null;

                setFocusMode(config.focusMode);
                setFocusMissionId(config.focusMissionId || null);
                setFocusMissionTitle(config.focusMissionTitle || null);

                if (config.focusMode) {
                    logActivity({
                        uid: user.uid,
                        schoolId: user.schoolId,
                        studentName: user.displayName || 'Naamloos',
                        type: 'focus_lost',
                        data: config.focusMissionId
                            ? `Focus Modus: ${config.focusMissionTitle}`
                            : 'Focus Modus geactiveerd door docent'
                    });
                }
            })
            .subscribe();

        // Initial fetch
        supabase
            .from('classroom_configs')
            .select('*')
            .eq('id', cls)
            .single()
            .then(({ data }) => {
                const config = deserializeClassroomConfig(data);
                if (config) {
                    lastProcessedFocusMode.current = !!config.focusMode;
                    lastProcessedFocusMissionId.current = config.focusMissionId || null;
                    setFocusMode(config.focusMode);
                    setFocusMissionId(config.focusMissionId || null);
                    setFocusMissionTitle(config.focusMissionTitle || null);
                }
            });

        return () => { supabase.removeChannel(channel); };
    }, [user]);

    useEffect(() => {
        if (!user || user.role !== 'student' || activeModule || !focusMode || !focusMissionId) return;

        // Check for pending focus intent after reload
        try {
            const stored = sessionStorage.getItem(FOCUS_INTENT_KEY);
            if (stored) {
                const { missionId, timestamp } = JSON.parse(stored);
                const isStillValid = Date.now() - timestamp < FOCUS_INTENT_TTL;
                const isSameMission = missionId === focusMissionId;

                if (isStillValid && isSameMission) {
                    logger.log("[FocusPersistence] Restoring focus mission after reload:", missionId);
                    setFocusModeAcknowledged(true);
                    handleSelectModule(missionId);
                } else {
                    // Stale or different mission, clean up
                    sessionStorage.removeItem(FOCUS_INTENT_KEY);
                }
            }
        } catch (e) {
            console.error("Failed to restore focus intent:", e);
            sessionStorage.removeItem(FOCUS_INTENT_KEY);
        }
    }, [user, focusMode, focusMissionId, activeModule]);

    const clearFocusState = () => {
        sessionStorage.removeItem(FOCUS_INTENT_KEY);
    };

    return {
        focusMode,
        setFocusMode,
        focusMissionId,
        setFocusMissionId,
        focusMissionTitle,
        setFocusMissionTitle,
        focusModeAcknowledged,
        setFocusModeAcknowledged,
        FOCUS_INTENT_KEY,
        clearFocusState,
    };
}
