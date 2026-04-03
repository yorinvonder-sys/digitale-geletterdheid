// XP notificatie context — beheert de wachtrij van XP-meldingen en level-up detectie.
// Luistert naar het globale DOM-event 'dgskills:xp-awarded' dat door XPService wordt verstuurd.

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useRef,
} from 'react';

export interface XPNotification {
    id: string;
    amount: number;
    isLevelUp: boolean;
    newLevel?: number;
}

interface XPNotificationContextType {
    notifications: XPNotification[];
    removeNotification: (id: string) => void;
}

const XPNotificationContext = createContext<XPNotificationContextType | null>(null);

let notificationCounter = 0;

export function XPNotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<XPNotification[]>([]);
    // Houd het laatste bekende level bij om level-ups te detecteren
    const lastLevelRef = useRef<number | null>(null);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    useEffect(() => {
        const handleXPAwarded = (event: Event) => {
            const customEvent = event as CustomEvent<{
                amount: number;
                newLevel?: number;
                oldLevel?: number;
            }>;

            const { amount, newLevel, oldLevel } = customEvent.detail;

            // Detecteer level-up: vergelijk nieuw level met oud level (of laatste bekende level)
            const previousLevel = oldLevel ?? lastLevelRef.current;
            const isLevelUp = !!(newLevel && previousLevel !== null && newLevel > previousLevel);

            if (newLevel !== undefined) {
                lastLevelRef.current = newLevel;
            }

            const notification: XPNotification = {
                id: `xp-${++notificationCounter}-${Date.now()}`,
                amount,
                isLevelUp,
                newLevel: isLevelUp ? newLevel : undefined,
            };

            setNotifications(prev => [...prev, notification]);
        };

        window.addEventListener('dgskills:xp-awarded', handleXPAwarded);
        return () => window.removeEventListener('dgskills:xp-awarded', handleXPAwarded);
    }, []);

    return (
        <XPNotificationContext.Provider value={{ notifications, removeNotification }}>
            {children}
        </XPNotificationContext.Provider>
    );
}

export function useXPNotifications(): XPNotificationContextType {
    const ctx = useContext(XPNotificationContext);
    if (!ctx) throw new Error('useXPNotifications must be used within XPNotificationProvider');
    return ctx;
}
