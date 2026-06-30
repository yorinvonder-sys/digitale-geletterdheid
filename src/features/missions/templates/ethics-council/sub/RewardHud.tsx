import React, { useState, useEffect } from 'react';
import { StreakIndicator } from '../../shared/StreakIndicator';
import { MilestoneToast } from '../../builder-canvas/sub/MilestoneToast';

interface RewardHudProps {
    /** Number of dossiers completed so far (0-3) */
    completedDossiers: number;
    totalDossiers: number;
    /** Consecutive dossiers completed above-threshold → drives the streak display */
    streak: number;
}

/**
 * Small HUD shown during the active dossier stages.
 * Composes StreakIndicator (shared) + MilestoneToast (builder-canvas).
 * The toast auto-hides after 2.5 s.
 */
export const RewardHud: React.FC<RewardHudProps> = ({
    completedDossiers,
    totalDossiers,
    streak,
}) => {
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (completedDossiers > 0) {
            setShowToast(true);
            const t = setTimeout(() => setShowToast(false), 2_500);
            return () => clearTimeout(t);
        }
    }, [completedDossiers]);

    return (
        <>
            <MilestoneToast
                show={showToast}
                completedCount={completedDossiers}
                totalCount={totalDossiers}
            />
            {streak >= 2 && (
                <div className="flex justify-end mb-2">
                    <StreakIndicator streak={streak} />
                </div>
            )}
        </>
    );
};
