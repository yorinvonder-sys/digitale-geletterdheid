import { useState, useEffect } from 'react';
import { ParentUser } from '../types';
import { subscribeToAuthChanges, logout } from '../services/authService';
import { logger } from '../utils/logger';
import { logActivity } from '../services/teacherService';

export function useAuth() {
    const [user, setUser] = useState<ParentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let authTimeoutId: ReturnType<typeof setTimeout> | undefined;
        const unsubscribe = subscribeToAuthChanges((u) => {
            clearTimeout(authTimeoutId);
            setUser(u);
            setLoading(false);
            if (u && u.role === 'student') {
                logActivity({
                    uid: u.uid,
                    schoolId: u.schoolId,
                    studentName: u.displayName || 'Naamloos',
                    type: 'login',
                    data: 'App geopend'
                });
            }
        });
        // Failsafe: als de auth-callback na 10s niet heeft gevuurd
        // (corrupt token of trage DB), stop met laden en redirect naar login.
        authTimeoutId = setTimeout(async () => {
            // Actief opruimen: signOut stopt Supabase's interne refresh-loop.
            try {
                const { supabase: sb } = await import('../services/supabase');
                await sb.auth.signOut({ scope: 'local' });
            } catch { /* negeer */ }
            setUser(null);
            setLoading(false);
        }, 10_000);
        return () => {
            clearTimeout(authTimeoutId);
            unsubscribe();
        };
    }, []);

    const handleLogout = () => {
        // logout() garandeert altijd navigatie via finally-blok, ook bij errors.
        void logout();
    };

    return { user, setUser, loading, handleLogout };
}
