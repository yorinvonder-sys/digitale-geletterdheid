import React, { useState, useEffect } from 'react';
import { MilestoneToast } from '../../builder-canvas/sub/MilestoneToast';

interface RewardHudProps {
    /** Number of dossiers completed so far (0-3) — increments fire the toast */
    completedDossiers: number;
    totalDossiers: number;
}

/**
 * Fires a brief "✓ X/Y voltooid!" toast each time a dossier is completed,
 * reusing the shared MilestoneToast (builder-canvas). Auto-hides after 2.5 s.
 */
export const RewardHud: React.FC<RewardHudProps> = ({
    completedDossiers,
    totalDossiers,
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
        <MilestoneToast
            show={showToast}
            completedCount={completedDossiers}
            totalCount={totalDossiers}
        />
    );
};
