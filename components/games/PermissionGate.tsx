/**
 * PermissionGate.tsx
 * A wrapper component that checks if a game is enabled by the teacher.
 * If not enabled, shows a locked message. If enabled, renders children.
 */

import React, { useState, useEffect } from 'react';
import { Lock, Gamepad2 } from 'lucide-react';
import { isGameEnabled } from '../../services/PermissionService';

interface PermissionGateProps {
    gameId: string;
    gameName: string;
    children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
    gameId,
    gameName,
    children
}) => {
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check permission on mount and set up listener for changes
        const checkPermission = async () => {
            const result = await isGameEnabled(gameId);
            setEnabled(result);
            setLoading(false);
        };

        checkPermission();

        // Listen for storage changes (in case teacher enables from another tab)
        const handleStorageChange = (e: StorageEvent) => {
            // Keep in sync with PermissionService STORAGE_KEY.
            if (e.key === 'game-permissions-cache') {
                checkPermission();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also poll every 5 seconds for same-tab updates
        const interval = setInterval(checkPermission, 5000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [gameId]);

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-mono text-sm">Permissies controleren...</p>
                </div>
            </div>
        );
    }

    if (!enabled) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10 max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl text-center">
                    {/* Lock Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center border-4 border-slate-600 shadow-inner">
                        <Lock size={40} className="text-slate-400" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-2">
                        <Gamepad2 className="text-amber-500" />
                        {gameName}
                    </h2>

                    {/* Message */}
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        <span className="text-amber-400 font-bold">Wacht op toestemming van de docent</span>
                        <br />om dit spel te spelen.
                    </p>

                    {/* Status indicator */}
                    <div className="inline-flex items-center gap-2 bg-slate-700/50 border border-slate-600 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                            Vergrendeld
                        </span>
                    </div>

                    {/* Hint for teachers */}
                    <div className="mt-8 pt-4 border-t border-slate-700">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                            💡 Docenten kunnen dit inschakelen via het Dashboard
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Permission granted - render the game
    return <>{children}</>;
};

export default PermissionGate;
