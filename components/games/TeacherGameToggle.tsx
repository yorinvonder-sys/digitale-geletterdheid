/**
 * TeacherGameToggle.tsx
 * A simple component for teachers to enable/disable games for students.
 * Can be added to any teacher-facing dashboard or settings page.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Gamepad2, Lock, Unlock, Shield, Users, Play, Calendar, Loader2 } from 'lucide-react';
import { getGamePermissions, setGamePermission, subscribeToPermissions, GamePermissions } from '../../services/PermissionService';
import { CURRICULUM } from '../../config/curriculum';

interface GameInfo {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}

function buildAvailableGames(yearGroup: number = 1): GameInfo[] {
    const yearConfig = CURRICULUM.yearGroups[yearGroup];
    if (!yearConfig) return [];

    const games: GameInfo[] = Object.entries(yearConfig.periods).map(([periodStr, config]) => ({
        id: `week-${periodStr}`,
        name: config.title,
        description: config.subtitle,
        icon: <Calendar size={20} />,
    }));

    games.push({
        id: 'arena-battle',
        name: 'Arena Battle',
        description: 'Multiplayer Bomberman style game (1vs1vs1vs1)',
        icon: <Gamepad2 size={20} />,
    });

    return games;
}

interface TeacherGameToggleProps {
    onTestGame?: (gameId: string) => void;
    yearGroup?: number;
}

export const TeacherGameToggle: React.FC<TeacherGameToggleProps> = ({ onTestGame, yearGroup = 1 }) => {
    const [permissions, setPermissions] = useState<GamePermissions | null>(null);
    const [saving, setSaving] = useState<string | null>(null);
    const games = useMemo(() => buildAvailableGames(yearGroup), [yearGroup]);

    useEffect(() => {
        // Initial load
        getGamePermissions().then(setPermissions);

        // Subscribe for real-time updates
        const unsubscribe = subscribeToPermissions(undefined, (perms) => {
            setPermissions(perms);
        });

        return () => unsubscribe();
    }, []);

    const handleToggle = async (gameId: string, enabled: boolean) => {
        setSaving(gameId);
        try {
            await setGamePermission(gameId, enabled);
            // Permissions will be updated via subscription
        } catch (error) {
            console.error('Error toggling game permission:', error);
        } finally {
            setTimeout(() => setSaving(null), 300);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white">Game Permissies</h2>
                        <p className="text-white/80 text-xs">Beheer welke games beschikbaar zijn voor leerlingen</p>
                    </div>
                </div>
            </div>

            {/* Games List */}
            <div className="p-4 space-y-3">
                {games.map((game) => {
                    const isEnabled = permissions?.enabled_games?.includes(game.id) ?? false;

                    return (
                        <div
                            key={game.id}
                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isEnabled
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEnabled
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {game.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{game.name}</h3>
                                    <p className="text-xs text-slate-500">{game.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {onTestGame && (
                                    <button
                                        onClick={() => onTestGame(game.id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-all"
                                        title="Test de game zelf"
                                    >
                                        <Play size={14} fill="currentColor" />
                                        Test
                                    </button>
                                )}
                                <button
                                    onClick={() => handleToggle(game.id, !isEnabled)}
                                    disabled={saving === game.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isEnabled
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        } ${saving === game.id ? 'opacity-50' : ''}`}
                                >
                                    {isEnabled ? (
                                        <>
                                            <Unlock size={16} />
                                            Ingeschakeld
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={16} />
                                            Uitgeschakeld
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer info */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users size={14} />
                    <span>Wijzigingen worden direct toegepast voor alle leerlingen</span>
                </div>
            </div>
        </div>
    );
};

export default TeacherGameToggle;
