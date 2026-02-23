/**
 * GamesSection.tsx
 * A dedicated section for mini-games.
 * Shows available games, permission status, and teacher controls.
 */

import React, { useState, useEffect } from 'react';
import { Gamepad2, Lock, Play, Shield, Users, WifiOff } from 'lucide-react';
import { isGameEnabled, subscribeToPermissions } from '../services/PermissionService';
import { Bomberman } from './games/Bomberman';
import { DrawingDuelGame } from './games/DrawingDuelGame';
import { TypingTrainer } from './games/TypingTrainer';
import { TeacherGameToggle } from './games/TeacherGameToggle';
import { GameGallery } from './GameGallery';
import { AvatarConfig, UserRole, DEFAULT_AVATAR_CONFIG } from '../types';
import { supabase } from '../services/supabase';

interface GamesSectionProps {
    userRole: UserRole;
    schoolId?: string;
    avatarConfig?: AvatarConfig;
    onXPEarned?: (amount: number, label: string) => void;
    onBack?: () => void;
    initialGameId?: string | null;
    userId?: string;
    userClass?: string;
}

interface GameCard {
    id: string;
    name: string;
    description: string;
    color: string;
    emoji: string;
    onlineRequired?: boolean;
    component: React.ReactNode;
}

export const GamesSection: React.FC<GamesSectionProps> = ({
    userRole,
    schoolId,
    avatarConfig,
    onXPEarned,
    onBack,
    initialGameId,
    userId,
    userClass,
}) => {
    const [activeGame, setActiveGame] = useState<string | null>(initialGameId || null);
    const [activeTab, setActiveTab] = useState<'games' | 'gallery'>('games');
    const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

    useEffect(() => {
        if (initialGameId) {
            setActiveGame(initialGameId);
        }
    }, [initialGameId]);
    const [showTeacherPanel, setShowTeacherPanel] = useState(false);
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Subscribe to real-time permission updates from Supabase
    useEffect(() => {
        // Initial load from cache
        setPermissions({
            'arena-battle': isGameEnabled('arena-battle'),
            'code-breaker': isGameEnabled('code-breaker'),
            'typing-trainer': isGameEnabled('typing-trainer'),
            // Drawing Duel is always available for students
            'drawing-duel': true,
        });

        // Subscribe to Supabase for real-time updates
        const unsubscribe = subscribeToPermissions((perms: Record<string, { enabled: boolean }>) => {
            setPermissions({
                'arena-battle': perms['arena-battle']?.enabled ?? false,
                'code-breaker': perms['code-breaker']?.enabled ?? false,
                'typing-trainer': perms['typing-trainer']?.enabled ?? false,
                'drawing-duel': true,
            });
        });

        return () => unsubscribe();
    }, []);

    const isTeacher = userRole === 'teacher' || userRole === 'admin';

    const games: GameCard[] = [
        {
            id: 'arena-battle',
            name: 'Arena Battle',
            description: 'Strijd tegen je klasgenoten in de arena! (1vs1vs1vs1)',
            color: 'from-emerald-500 to-teal-500',
            emoji: '💣',
            onlineRequired: true,
            component: (
                <Bomberman
                    avatarConfig={avatarConfig || DEFAULT_AVATAR_CONFIG}
                    schoolId={schoolId}
                    onXPEarned={onXPEarned}
                    onExit={() => setActiveGame(null)}
                />
            ),
        },
        {
            id: 'drawing-duel',
            name: 'Drawing Duel',
            description: 'Daag een klasgenoot uit voor een 1-minuut tekenstrijd met AI-beoordeling.',
            color: 'from-orange-500 to-pink-500',
            emoji: '🎨',
            onlineRequired: true,
            component: (
                <div className="fixed inset-0 z-50 bg-slate-900">
                    <DrawingDuelGame
                        user={{
                            uid: userId || '',
                            displayName: 'Leerling',
                            studentClass: userClass || 'Onbekend',
                            schoolId: schoolId,
                        }}
                        onXPEarned={onXPEarned}
                        onExit={() => setActiveGame(null)}
                    />
                </div>
            ),
        },
        {
            id: 'typing-trainer',
            name: 'Typing Trainer',
            description: 'Train je typevaardigheid met een korte sprint en haal een hogere WPM.',
            color: 'from-sky-500 to-cyan-500',
            emoji: '⌨️',
            component: (
                <TypingTrainer
                    onXPEarned={onXPEarned}
                    onExit={() => setActiveGame(null)}
                />
            ),
        },

        // Add more games here
    ];

    // If a game is active, show it fullscreen
    if (activeGame) {
        const game = games.find(g => g.id === activeGame);
        if (game) {
            return (
                <div className="fixed inset-0 z-50 bg-slate-900">
                    {game.component}
                </div>
            );
        }
    }

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-auto">
            {/* Header */}
            <div className="shrink-0 px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors touch-friendly-btn text-lg"
                            >
                                ←
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                <Gamepad2 className="text-amber-400" />
                                Games
                            </h1>
                            <p className="text-slate-400 text-sm">Speel en leer tegelijk!</p>
                        </div>
                    </div>

                    {/* Teacher controls */}
                    {isTeacher && (
                        <button
                            onClick={() => setShowTeacherPanel(!showTeacherPanel)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${showTeacherPanel
                                ? 'bg-amber-500 text-slate-900'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Shield size={16} />
                            Docent Panel
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setActiveTab('games')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'games'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                            }`}
                    >
                        <Gamepad2 size={16} />
                        Mini Games
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        disabled={isOffline}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'gallery'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white'
                            }`}
                    >
                        <Users size={16} />
                        {isOffline ? 'Galerij (offline uit)' : 'Leerling Galerij'}
                    </button>
                </div>
            </div>

            {/* Teacher Panel (conditionally shown) */}
            {isTeacher && showTeacherPanel && (
                <div className="shrink-0 p-6 border-b border-white/10 bg-slate-800/50">
                    <TeacherGameToggle />
                </div>
            )}

            {isOffline && (
                <div className="shrink-0 px-6 py-3 bg-amber-500/10 border-b border-amber-500/30 text-amber-200 text-sm flex items-center gap-2">
                    <WifiOff size={16} />
                    Offline modus: alleen lokale games zijn beschikbaar.
                </div>
            )}

            {/* Game Gallery Tab */}
            {activeTab === 'gallery' && userId && !isOffline && (
                <GameGallery
                    userId={userId}
                    schoolId={schoolId}
                    userClass={userClass}
                    onBack={() => setActiveTab('games')}
                />
            )}

            {activeTab === 'gallery' && isOffline && (
                <div className="flex-1 p-6">
                    <div className="max-w-2xl mx-auto bg-slate-800/40 border border-white/10 rounded-2xl p-6 text-center">
                        <WifiOff className="mx-auto mb-3 text-amber-300" />
                        <h3 className="text-white font-bold mb-1">Galerij vereist internet</h3>
                        <p className="text-slate-400 text-sm">
                            Verbind met internet om games van klasgenoten te laden.
                        </p>
                    </div>
                </div>
            )}

            {/* Games Grid - Only show when on games tab */}
            {activeTab === 'games' && (
                <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {games.map((game) => {
                            const isEnabled = permissions[game.id];
                            const blockedByOffline = isOffline && game.onlineRequired;
                            const canPlay = (isEnabled || isTeacher) && !blockedByOffline;

                            return (
                                <div
                                    key={game.id}
                                    className={`relative bg-slate-800/50 backdrop-blur border border-white/10 rounded-2xl overflow-hidden transition-all group ${canPlay ? 'hover:scale-[1.02] hover:border-white/20' : 'opacity-60'
                                        }`}
                                >
                                    {/* Game Card Header */}
                                    <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center relative`}>
                                        <span className="text-6xl">{game.emoji}</span>

                                        {/* Lock overlay */}
                                        {!canPlay && (
                                            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Lock size={32} className="text-slate-400 mx-auto mb-2" />
                                                    <p className="text-slate-400 text-xs">Vergrendeld</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Game Card Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-black text-white mb-1">{game.name}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{game.description}</p>

                                        <button
                                            onClick={() => canPlay && setActiveGame(game.id)}
                                            disabled={!canPlay}
                                            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-[56px] touch-friendly-btn ${canPlay
                                                ? `bg-gradient-to-r ${game.color} text-white hover:shadow-lg active:scale-95`
                                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                }`}
                                        >
                                            {canPlay ? (
                                                <>
                                                    <Play size={20} fill="currentColor" />
                                                    Spelen
                                                </>
                                            ) : blockedByOffline ? (
                                                <>
                                                    <WifiOff size={18} />
                                                    Online nodig
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={18} />
                                                    Wacht op docent
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Coming Soon Card */}
                        <div className="bg-slate-800/30 border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-3xl">🎮</span>
                            </div>
                            <h3 className="text-slate-400 font-bold mb-1">Meer Games</h3>
                            <p className="text-slate-500 text-xs">Binnenkort beschikbaar...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesSection;
