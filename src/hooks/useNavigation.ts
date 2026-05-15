import { useState } from 'react';
import { ParentUser } from '@/types';
import { logActivity } from '@/services/teacherService';

interface UseNavigationParams {
    user: ParentUser | null;
}

export function useNavigation({ user }: UseNavigationParams) {
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [pendingLibraryItem, setPendingLibraryItem] = useState<any | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [initialProfileTab, setInitialProfileTab] = useState<'profile' | 'shop' | 'trophies' | 'privacy'>('profile');
    const [viewMode, setViewMode] = useState<'assignments' | 'monitoring'>('monitoring');
    const [activeWeek, setActiveWeek] = useState(2);
    const [showGames, setShowGames] = useState(false);
    const [initialGameId, setInitialGameId] = useState<string | null>(null);
    const [gamesEnabled, setGamesEnabled] = useState(true);
    const [activeYearGroup, setActiveYearGroup] = useState<number>(1);
    const [devViewOverride, setDevViewOverride] = useState<'developer' | 'student' | 'teacher'>('developer');
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [peerFeedbackMissionId, setPeerFeedbackMissionId] = useState<string | null>(null);

    const FOCUS_INTENT_KEY = 'dgskills_focus_intent';

    const handleExitModule = () => {
        setActiveModule(null);
        setPendingLibraryItem(null);
        setShowExitConfirm(false);

        // Clear focus intent when explicitly exiting a module
        sessionStorage.removeItem(FOCUS_INTENT_KEY);
    };

    const handleRequestExitModule = () => {
        if (user?.role === 'student' && activeModule) {
            setShowExitConfirm(true);
        } else {
            handleExitModule();
        }
    };

    const handleSelectModule = (moduleId: string, libraryItemData?: any) => {
        setActiveModule(moduleId);
        setPendingLibraryItem(libraryItemData || null);

        if (user && user.role === 'student') {
            logActivity({
                uid: user.uid,
                schoolId: user.schoolId,
                studentName: user.displayName || 'Naamloos',
                type: 'mission_start',
                data: `Missie gestart: ${moduleId}`,
                missionId: moduleId
            });
        }
    };

    return {
        activeModule,
        setActiveModule,
        pendingLibraryItem,
        setPendingLibraryItem,
        isProfileOpen,
        setIsProfileOpen,
        initialProfileTab,
        setInitialProfileTab,
        viewMode,
        setViewMode,
        activeWeek,
        setActiveWeek,
        showGames,
        setShowGames,
        initialGameId,
        setInitialGameId,
        gamesEnabled,
        setGamesEnabled,
        activeYearGroup,
        setActiveYearGroup,
        devViewOverride,
        setDevViewOverride,
        showExitConfirm,
        setShowExitConfirm,
        peerFeedbackMissionId,
        setPeerFeedbackMissionId,
        handleExitModule,
        handleRequestExitModule,
        handleSelectModule,
    };
}
