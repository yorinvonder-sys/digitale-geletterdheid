import { useEffect, useRef, useCallback, useState } from 'react';
import { logout } from '@/services/authService';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minuten
const WARNING_MS = 5 * 60 * 1000;  // Waarschuwing 5 minuten voor timeout
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;

/**
 * Inactiviteits-timeout voor gedeelde schoolcomputers.
 * Logt automatisch uit na 30 minuten inactiviteit met 5 minuten waarschuwing.
 */
export function useInactivityTimeout() {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimers = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningRef.current) clearTimeout(warningRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        setShowWarning(false);
    }, []);

    const handleLogout = useCallback(async () => {
        clearTimers();
        try {
            await logout();
        } catch {
            window.location.href = '/login';
        }
    }, [clearTimers]);

    const resetTimer = useCallback(() => {
        clearTimers();

        // Waarschuwing na 25 minuten
        warningRef.current = setTimeout(() => {
            setShowWarning(true);
            setSecondsLeft(Math.floor(WARNING_MS / 1000));
            countdownRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        if (countdownRef.current) clearInterval(countdownRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, TIMEOUT_MS - WARNING_MS);

        // Automatisch uitloggen na 30 minuten
        timeoutRef.current = setTimeout(handleLogout, TIMEOUT_MS);
    }, [clearTimers, handleLogout]);

    const dismissWarning = useCallback(() => {
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        resetTimer();

        const onActivity = () => {
            if (!showWarning) {
                resetTimer();
            }
        };

        for (const event of ACTIVITY_EVENTS) {
            document.addEventListener(event, onActivity, { passive: true });
        }

        return () => {
            clearTimers();
            for (const event of ACTIVITY_EVENTS) {
                document.removeEventListener(event, onActivity);
            }
        };
    }, [resetTimer, clearTimers, showWarning]);

    return { showWarning, secondsLeft, dismissWarning };
}
