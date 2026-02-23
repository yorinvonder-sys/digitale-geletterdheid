
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Users, PlayCircle, Settings, Check, X, Loader2, Play, Zap } from 'lucide-react';
import { setGamePermission, subscribeToPermissions, GamePermissions } from '../../services/PermissionService';
import { supabase } from '../../services/supabase';
import { subscribeToActiveLobbies, forceStartAllLobbies, forceStartLobbiesByClass, BombermanLobby } from '../../services/BombermanService';

interface GamesPanelProps {
    onOpenGame: (gameId?: string) => void;
}

// Define available games - map to permission IDs
const GAMES = [
    {
        id: 'bomberman',
        permissionId: 'arena-battle', // Maps to PermissionService ID
        name: 'Bomberman',
        description: 'Strategisch puzzelspel waar leerlingen bommetjes plaatsen om obstakels te ontwijken.',
        icon: '💣',
        category: 'Strategie',
        hasLobbyControl: true, // This game has lobby/force-start controls
    },
    {
        id: 'drawing-duel',
        permissionId: 'drawing-duel',
        name: 'Drawing Duel',
        description: 'Creatief tekenspel met AI-beoordeling. Wie tekent het beste?',
        icon: '🎨',
        category: 'Creativiteit',
        alwaysEnabled: true, // Always available for students without teacher activation
    },
    {
        id: 'typing-trainer',
        permissionId: 'typing-trainer',
        name: 'Typing Trainer',
        description: 'Train typevaardigheid met leuke mini-games en uitdagingen.',
        icon: '⌨️',
        category: 'Vaardigheden',
    }
];

// Available classes for per-class force start
const CLASSES = ['MH1A', 'MH1B', 'MH1C', 'MH1D', 'MH1E', 'MH2A', 'MH2B', 'MH2C', 'MH2D', 'MH2E'];

export const GamesPanel: React.FC<GamesPanelProps> = ({ onOpenGame }) => {
    const [permissions, setPermissions] = useState<GamePermissions | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [activeLobbies, setActiveLobbies] = useState<BombermanLobby[]>([]);
    const [forceStarting, setForceStarting] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>('');

    useEffect(() => {
        const unsub = subscribeToPermissions(undefined, (perms) => {
            setPermissions(perms);
        });
        return () => unsub();
    }, []);

    // Subscribe to active Bomberman lobbies
    useEffect(() => {
        const unsub = subscribeToActiveLobbies((lobbies) => {
            setActiveLobbies(lobbies);
        });
        return () => unsub();
    }, []);

    const handleToggleGame = async (permissionId: string, currentlyEnabled: boolean) => {
        setLoading(permissionId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const teacherId = session?.user?.id || 'teacher_demo';
            await setGamePermission(permissionId, !currentlyEnabled, teacherId);
        } catch (error) {
            console.error('Error toggling game permission:', error);
        } finally {
            setLoading(null);
        }
    };

    const handleForceStartAll = async () => {
        setForceStarting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const teacherId = session?.user?.id || 'teacher_demo';
            const count = await forceStartAllLobbies(teacherId);
            console.log(`Force started ${count} lobbies`);
        } catch (error) {
            console.error('Error force starting lobbies:', error);
        } finally {
            setForceStarting(false);
        }
    };

    const handleForceStartByClass = async () => {
        if (!selectedClass) return;
        setForceStarting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const teacherId = session?.user?.id || 'teacher_demo';
            const count = await forceStartLobbiesByClass(selectedClass, teacherId);
            console.log(`Force started ${count} lobbies for class ${selectedClass}`);
        } catch (error) {
            console.error('Error force starting lobbies by class:', error);
        } finally {
            setForceStarting(false);
        }
    };

    const isGameEnabled = (permissionId: string) => {
        return permissions?.enabled_games?.includes(permissionId) ?? false;
    };

    const totalPlayersInLobbies = activeLobbies.reduce((sum, l) => sum + l.playerCount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-[2rem] p-6 md:p-8 text-white shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Gamepad2 size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black">Games Beheer</h2>
                        <p className="text-white/80">Activeer en beheer games voor je leerlingen</p>
                    </div>
                </div>
            </div>

            {/* Active Lobbies Section - Only show if there are active lobbies */}
            {activeLobbies.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">Actieve Bomberman Lobbies</h3>
                                <p className="text-sm text-slate-500">{activeLobbies.length} lobby(s) • {totalPlayersInLobbies} spelers wachten</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live</span>
                        </div>
                    </div>

                    {/* Force Start Controls - FIRST/PROMINENT */}
                    <div className="bg-white/70 rounded-xl p-4 border border-amber-200 mb-4">
                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Zap size={14} />
                            Docent Controls
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {/* Force Start All Button */}
                            <button
                                onClick={handleForceStartAll}
                                disabled={forceStarting || activeLobbies.length === 0}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {forceStarting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Play size={16} fill="currentColor" />
                                )}
                                Start Alle Lobbies
                            </button>

                            {/* Per-Class Force Start */}
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                >
                                    <option value="">Kies klas...</option>
                                    {CLASSES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleForceStartByClass}
                                    disabled={forceStarting || !selectedClass}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Play size={16} fill="currentColor" />
                                    Start {selectedClass || 'Klas'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Collapsible Lobby List - Hidden by default */}
                    <details className="group">
                        <summary className="cursor-pointer flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors py-2">
                            <span className="group-open:rotate-90 transition-transform">▶</span>
                            Bekijk {activeLobbies.length} wachtende lobby(s)
                        </summary>
                        <div className="space-y-2 mt-3 animate-in slide-in-from-top-2 duration-200">
                            {activeLobbies.map((lobby) => (
                                <div key={lobby.id} className="bg-white rounded-xl p-3 border border-amber-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💣</span>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{lobby.playerCount} speler{lobby.playerCount !== 1 ? 's' : ''}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{lobby.playerNames.join(', ')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lobby.lobbyStartTime && (
                                            <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-bold">
                                                Auto-start actief
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                </div>
            )}

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GAMES.map((game, index) => {
                    const enabled = game.alwaysEnabled || isGameEnabled(game.permissionId);
                    const isLoading = loading === game.permissionId;
                    const isAlwaysEnabled = game.alwaysEnabled;

                    return (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl border-2 shadow-lg p-6 hover:shadow-xl transition-all group ${enabled ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-100'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-4xl">{game.icon}</div>
                                <div className="flex items-center gap-2">
                                    {isAlwaysEnabled ? (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                                            ⚡ Altijd Actief
                                        </span>
                                    ) : enabled && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Check size={10} /> Actief
                                        </span>
                                    )}
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                        {game.category}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-2">{game.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{game.description}</p>

                            <div className="flex gap-2">
                                {isAlwaysEnabled ? (
                                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600">
                                        <Check size={16} />
                                        Altijd beschikbaar voor leerlingen
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleToggleGame(game.permissionId, enabled)}
                                        disabled={isLoading}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${enabled
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                                            } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {isLoading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : enabled ? (
                                            <>
                                                <X size={16} />
                                                Deactiveren
                                            </>
                                        ) : (
                                            <>
                                                <PlayCircle size={16} />
                                                Activeren
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Settings size={16} className="text-slate-400" />
                    Snelle Acties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        onClick={() => onOpenGame()}
                        className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                    >
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                            <Gamepad2 size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">Open Games Menu</div>
                            <div className="text-xs text-slate-500">Bekijk alle beschikbare games</div>
                        </div>
                    </button>
                    <button
                        onClick={() => onOpenGame()}
                        className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left group"
                    >
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                            <Users size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 text-sm">Speel met Klas</div>
                            <div className="text-xs text-slate-500">Start een klassikale game-sessie</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
