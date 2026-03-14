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

// DGSkills branding tokens
const C = {
    bg: '#FAF9F0',
    bgAlt: '#F5F3EC',
    surface: '#FFFFFF',
    text: '#1A1A19',
    textBody: '#3D3D38',
    textMuted: '#6B6B66',
    textLight: '#9C9C95',
    accent: '#D97757',
    accentHover: '#C46849',
    teal: '#2A9D8F',
    lavender: '#8B6F9E',
    success: '#10B981',
    border: '#E8E6DF',
    borderLight: '#F0EEE8',
} as const;

const SERIF = "'Newsreader', Georgia, serif";
const SANS = "'Outfit', system-ui, sans-serif";

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
            color: '#D97757',
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
            color: '#B8886F',
            emoji: '🎨',
            onlineRequired: true,
            component: (
                <div className="fixed inset-0 z-50" style={{ backgroundColor: C.text }}>
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
            color: '#9C9C95',
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
                <div className="fixed inset-0 z-50" style={{ backgroundColor: C.text }}>
                    {game.component}
                </div>
            );
        }
    }

    return (
        <div className="w-full h-full flex flex-col overflow-auto" style={{ backgroundColor: C.bg, fontFamily: SANS }}>
            {/* Header */}
            <div className="shrink-0 px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 touch-friendly-btn text-base focus-visible:outline-none focus-visible:ring-2"
                                style={{ backgroundColor: C.bgAlt, color: C.textMuted, border: `1px solid ${C.border}`, '--tw-ring-color': C.accent } as React.CSSProperties}
                            >
                                ←
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: SERIF, color: C.text }}>
                                <Gamepad2 size={22} style={{ color: C.accent }} />
                                Games
                            </h1>
                            <p className="text-sm" style={{ color: C.textMuted }}>Speel en leer tegelijk!</p>
                        </div>
                    </div>

                    {/* Teacher controls */}
                    {isTeacher && (
                        <button
                            onClick={() => setShowTeacherPanel(!showTeacherPanel)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                            style={showTeacherPanel
                                ? { backgroundColor: C.accent, color: '#fff', '--tw-ring-color': C.accent } as React.CSSProperties
                                : { backgroundColor: C.bgAlt, color: C.textMuted, border: `1px solid ${C.border}`, '--tw-ring-color': C.accent } as React.CSSProperties
                            }
                        >
                            <Shield size={14} />
                            Docent Panel
                        </button>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setActiveTab('games')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                        style={activeTab === 'games'
                            ? { backgroundColor: C.accent, color: '#fff', '--tw-ring-color': C.accent } as React.CSSProperties
                            : { backgroundColor: C.bgAlt, color: C.textLight, border: `1px solid ${C.border}`, '--tw-ring-color': C.accent } as React.CSSProperties
                        }
                    >
                        <Gamepad2 size={14} />
                        Mini Games
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        disabled={isOffline}
                        className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2"
                        style={activeTab === 'gallery'
                            ? { backgroundColor: C.accent, color: '#fff', '--tw-ring-color': C.accent } as React.CSSProperties
                            : { backgroundColor: C.bgAlt, color: C.textLight, border: `1px solid ${C.border}`, '--tw-ring-color': C.accent } as React.CSSProperties
                        }
                    >
                        <Users size={14} />
                        {isOffline ? 'Galerij (offline uit)' : 'Leerling Galerij'}
                    </button>
                </div>
            </div>

            {/* Teacher Panel (conditionally shown) */}
            {isTeacher && showTeacherPanel && (
                <div className="shrink-0 p-6" style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.bgAlt }}>
                    <TeacherGameToggle />
                </div>
            )}

            {isOffline && (
                <div className="shrink-0 px-6 py-3 text-sm flex items-center gap-2 font-medium" style={{ backgroundColor: '#FEF3C7', borderBottom: '1px solid #FDE68A', color: '#92400E' }}>
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
                    <div className="max-w-2xl mx-auto rounded-2xl p-6 text-center" style={{ backgroundColor: C.bgAlt, border: `1px solid ${C.border}` }}>
                        <WifiOff className="mx-auto mb-3" style={{ color: C.accent }} />
                        <h3 className="font-bold mb-1" style={{ fontFamily: SERIF, color: C.text }}>Galerij vereist internet</h3>
                        <p className="text-sm" style={{ color: C.textMuted }}>
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
                                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 group ${canPlay ? 'hover:scale-[1.02] hover:shadow-lg' : 'opacity-60'}`}
                                    style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
                                >
                                    {/* Game Card Header */}
                                    <div className="h-32 flex items-center justify-center relative" style={{ backgroundColor: `${game.color}14` }}>
                                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{game.emoji}</span>

                                        {/* Lock overlay */}
                                        {!canPlay && (
                                            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${C.bg}e0` }}>
                                                <div className="text-center">
                                                    <Lock size={28} className="mx-auto mb-2" style={{ color: C.textLight }} />
                                                    <p className="text-xs font-medium" style={{ color: C.textLight }}>Vergrendeld</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Game Card Content */}
                                    <div className="p-4">
                                        <h3 className="text-base font-bold mb-1" style={{ fontFamily: SERIF, color: C.text }}>{game.name}</h3>
                                        <p className="text-sm mb-4" style={{ color: C.textBody }}>{game.description}</p>

                                        <button
                                            onClick={() => canPlay && setActiveGame(game.id)}
                                            disabled={!canPlay}
                                            className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 min-h-[48px] touch-friendly-btn active:scale-95 focus-visible:outline-none focus-visible:ring-2"
                                            style={canPlay
                                                ? { backgroundColor: C.accent, color: '#fff', '--tw-ring-color': C.accent } as React.CSSProperties
                                                : { backgroundColor: C.bgAlt, color: C.textLight, cursor: 'not-allowed' }
                                            }
                                            onMouseEnter={(e) => { if (canPlay) (e.currentTarget.style.backgroundColor = C.accentHover); }}
                                            onMouseLeave={(e) => { if (canPlay) (e.currentTarget.style.backgroundColor = C.accent); }}
                                        >
                                            {canPlay ? (
                                                <>
                                                    <Play size={16} fill="currentColor" />
                                                    Spelen
                                                </>
                                            ) : blockedByOffline ? (
                                                <>
                                                    <WifiOff size={16} />
                                                    Online nodig
                                                </>
                                            ) : (
                                                <>
                                                    <Lock size={16} />
                                                    Wacht op docent
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Coming Soon Card */}
                        <div className="rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px] transition-all duration-300" style={{ border: `2px dashed ${C.border}` }}>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: C.bgAlt }}>
                                <Gamepad2 size={24} style={{ color: C.textLight }} />
                            </div>
                            <h3 className="font-bold mb-1" style={{ fontFamily: SERIF, color: C.textLight }}>Meer Games</h3>
                            <p className="text-xs" style={{ color: C.textMuted }}>Binnenkort beschikbaar...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GamesSection;
