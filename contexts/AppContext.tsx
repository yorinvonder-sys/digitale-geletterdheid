import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ParentUser, UserStats } from '../types';
import { subscribeToAuthChanges, logout } from '../services/authService';
import { supabase } from '../services/supabase';

interface AppContextType {
    // User State
    user: ParentUser | null;
    loading: boolean;

    // Navigation State
    activeModule: string | null;
    setActiveModule: (module: string | null) => void;
    isProfileOpen: boolean;
    setIsProfileOpen: (open: boolean) => void;
    activeWeek: number;
    setActiveWeek: (week: number) => void;
    showIntro: boolean;
    setShowIntro: (show: boolean) => void;
    showGames: boolean;
    setShowGames: (show: boolean) => void;
    completedIntroWeeks: number[];

    // Settings
    gamesEnabled: boolean;

    // Actions
    handleLogout: () => Promise<void>;
    handleSaveProgress: (stats: UserStats) => Promise<void>;
    handleUpdateProfile: (data: Partial<ParentUser>) => Promise<void>;
    handleGoHome: () => void;
    markIntroComplete: (week: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // User State
    const [user, setUser] = useState<ParentUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Navigation State
    const [activeModule, setActiveModule] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [activeWeek, setActiveWeek] = useState(2);
    const [showIntro, setShowIntro] = useState(false);
    const [showGames, setShowGames] = useState(false);
    const [completedIntroWeeks, setCompletedIntroWeeks] = useState<number[]>([]);

    // Settings (TODO: Load from teacher settings)
    const [gamesEnabled] = useState(false);

    // Auth subscription
    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Actions
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            setActiveModule(null);
            setIsProfileOpen(false);
            setShowGames(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, []);

    // Helper: Deep sanitize data for database
    const sanitizeForDB = (obj: any): any => {
        if (obj === null || obj === undefined) return null;
        if (obj instanceof Date) return obj.toISOString();
        if (typeof obj === 'number') {
            if (Number.isNaN(obj) || !Number.isFinite(obj)) return null;
            return obj;
        }
        if (typeof obj === 'string') {
            if (obj === 'loading') return null; // Skip transient loading states
            return obj;
        }
        if (typeof obj === 'boolean') return obj;
        if (Array.isArray(obj)) {
            return obj
                .map(item => sanitizeForDB(item))
                .filter(item => item !== null && item !== undefined);
        }
        if (typeof obj === 'object') {
            const result: any = {};
            for (const [key, value] of Object.entries(obj)) {
                if (value === undefined) continue;
                if (typeof value === 'function') continue;
                if (typeof value === 'symbol') continue;
                const sanitizedValue = sanitizeForDB(value);
                if (sanitizedValue !== null && sanitizedValue !== undefined) {
                    result[key] = sanitizedValue;
                }
            }
            return result;
        }
        return null;
    };

    const handleSaveProgress = useCallback(async (stats: UserStats) => {
        if (!user) return;
        try {
            const cleanStats = sanitizeForDB(stats);
            const { error } = await supabase
                .from('users')
                .update({
                    stats: cleanStats,
                    last_active: new Date().toISOString()
                })
                .eq('id', user.uid);
            if (error) console.error("Error saving progress:", error);
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    }, [user]);

    const handleUpdateProfile = useCallback(async (data: Partial<ParentUser>) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('users')
                .update(data as any)
                .eq('id', user.uid);
            if (error) throw error;
            setUser({ ...user, ...data });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }, [user]);

    const handleGoHome = useCallback(() => {
        setIsProfileOpen(false);
        setShowIntro(false);
        setActiveModule(null);
        setShowGames(false);
    }, []);

    const markIntroComplete = useCallback((week: number) => {
        setCompletedIntroWeeks(prev =>
            prev.includes(week) ? prev : [...prev, week]
        );
        setShowIntro(false);
    }, []);

    const value: AppContextType = {
        user,
        loading,
        activeModule,
        setActiveModule,
        isProfileOpen,
        setIsProfileOpen,
        activeWeek,
        setActiveWeek,
        showIntro,
        setShowIntro,
        showGames,
        setShowGames,
        completedIntroWeeks,
        gamesEnabled,
        handleLogout,
        handleSaveProgress,
        handleUpdateProfile,
        handleGoHome,
        markIntroComplete,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
