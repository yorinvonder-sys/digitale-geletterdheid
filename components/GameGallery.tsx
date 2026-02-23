import React, { useRef, useState, useEffect } from 'react';
import {
    Heart,
    Play,
    Loader2,
    X,
    Gamepad2,
    Users,
    Trophy,
    RefreshCw,
    ArrowLeft,
    BookOpen,
    Bot
} from 'lucide-react';
import {
    SharedGame,
    getSharedGames,
    incrementPlayCount,
    toggleLike,
    recordGameScore
} from '../services/gameGalleryService';
import { BookPreview } from './BookPreview';
import { BookData } from '../types';

const GALLERY_CACHE_KEY = 'ai_lab_game_gallery_cache_v1';

interface GameGalleryProps {
    userId: string;
    schoolId?: string;
    userClass?: string;
    onBack?: () => void;
}

export const GameGallery: React.FC<GameGalleryProps> = ({ userId, schoolId, userClass, onBack }) => {
    const [games, setGames] = useState<SharedGame[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState<SharedGame | null>(null);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    // Default to user's own class - students can only see games from their class
    const [filterClass, setFilterClass] = useState<string | undefined>(userClass);
    const [filterMission, setFilterMission] = useState<string | undefined>(undefined);
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const readCachedGames = (): SharedGame[] => {
        try {
            const raw = localStorage.getItem(GALLERY_CACHE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const writeCachedGames = (items: SharedGame[]) => {
        try {
            localStorage.setItem(GALLERY_CACHE_KEY, JSON.stringify(items));
        } catch {
            // Ignore cache write errors (e.g. quota in private mode)
        }
    };

    // Load games when filters change
    useEffect(() => {
        loadGames();
    }, [filterClass, filterMission, isOffline]);

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

    // P2-4 FIX: Prevent score forgery via repeated postMessage events
    const scoreReportedRef = useRef(false);

    // Listen for score messages from game iframe
    useEffect(() => {
        if (!selectedGame || !selectedGame.game_code) return;

        // Reset dedup guard when a new game is selected
        scoreReportedRef.current = false;

        const handleMessage = async (event: MessageEvent) => {
            // Only accept messages from the currently active game iframe.
            if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) return;

            const data = event.data;
            if (!data || typeof data !== 'object') return;

            if (data.type === 'gameScore') {
                setCurrentScore(data.score);
            } else if (data.type === 'gameOver' && selectedGame && !scoreReportedRef.current) {
                // P2-4: Validate score bounds and deduplicate
                const score = Number(data.score);
                if (!Number.isInteger(score) || score < 0 || score > 50000) {
                    console.warn('[GameGallery] Invalid score rejected:', data.score);
                    return;
                }

                scoreReportedRef.current = true;

                // Record final score when game ends (once per session)
                try {
                    const result = await recordGameScore(
                        selectedGame.id,
                        userId,
                        score
                    );
                    if (result.newMilestone) {
                        console.log(`Creator earned ${result.xpAwarded} XP!`);
                    }
                } catch (error) {
                    console.error('Failed to record game score:', error);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [selectedGame, userId]);

    const loadGames = async () => {
        setIsLoading(true);
        if (isOffline) {
            const cached = readCachedGames();
            const filteredCached = filterMission
                ? cached.filter(g => g.mission_id === filterMission)
                : cached;
            setGames(filteredCached);
            setIsLoading(false);
            return;
        }

        try {
            // Load all games and filter client-side for mission
            const loadedGames = await getSharedGames(filterClass, schoolId);

            // Apply mission filter client-side
            const filtered = filterMission
                ? loadedGames.filter(g => g.mission_id === filterMission)
                : loadedGames;

            setGames(filtered);
            writeCachedGames(filtered);
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Play a game
    const handlePlayGame = async (game: SharedGame) => {
        setSelectedGame(game);

        if (game.mission_id === 'verhalen-ontwerper' && game.book_data) {
            // Book specific logic can go here if needed
        } else if (game.game_code) {
            // Create blob URL for iframe
            const blob = new Blob([game.game_code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            setBlobUrl(url);
        }

        // Increment play count
        try {
            await incrementPlayCount(game.id);
            // Update local state
            setGames(prev => prev.map(g =>
                g.id === game.id ? { ...g, play_count: g.play_count + 1 } : g
            ));
        } catch (error) {
            console.error('Failed to increment play count:', error);
        }
    };

    // Close game
    const handleCloseGame = () => {
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
        }
        setSelectedGame(null);
        setBlobUrl(null);
        setCurrentScore(0);
    };

    // Like a game
    const handleLike = async (gameId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const isNowLiked = await toggleLike(gameId, userId);
            setGames(prev => prev.map(g => {
                if (g.id === gameId) {
                    const newLikes = isNowLiked
                        ? [...g.likes, userId]
                        : g.likes.filter(uid => uid !== userId);
                    return { ...g, likes: newLikes };
                }
                return g;
            }));
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    // Format date
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('nl-NL', {
            day: 'numeric',
            month: 'short'
        }).format(date);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-900 p-4 md:p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                aria-label="Terug"
                                className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <ArrowLeft size={24} className="text-slate-400" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                                <Gamepad2 className="text-emerald-400" />
                                Game Galerij
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Speel games gemaakt door je klasgenoten!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={loadGames}
                        aria-label="Vernieuwen"
                        disabled={isLoading || isOffline}
                        className="p-2 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-70"
                    >
                        <RefreshCw size={20} className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                        {isLoading && <span className="sr-only">Games laden...</span>}
                    </button>
                </div>

                {/* Mission Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <button
                        onClick={() => setFilterMission(undefined)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!filterMission
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        📁 Alle Missies
                    </button>
                    <button
                        onClick={() => setFilterMission('game-programmeur')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterMission === 'game-programmeur'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        🎮 Game Programmeur
                    </button>
                    <button
                        onClick={() => setFilterMission('verhalen-ontwerper')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterMission === 'verhalen-ontwerper'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        📖 Verhalen Ontwerper
                    </button>
                    <button
                        onClick={() => setFilterMission('chatbot-trainer')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterMission === 'chatbot-trainer'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        🤖 Chatbot Trainer
                    </button>
                </div>

                {/* Class Filter - only show if userClass exists, otherwise show info */}
                {userClass ? (
                    <div className="flex gap-2 items-center">
                        <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-sm font-bold text-cyan-300">
                            👥 Klas: {userClass}
                        </div>
                        <span className="text-xs text-slate-500">
                            Je ziet alleen games van je klasgenoten
                        </span>
                    </div>
                ) : (
                    <div className="text-xs text-slate-500">
                        (Geen klas ingesteld - alle games worden getoond)
                    </div>
                )}
            </div>

            {/* Games Grid */}
            <div className="max-w-6xl mx-auto">
                {isOffline && (
                    <div className="mb-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm">
                        Offline modus: je ziet alleen eerder geladen galerijgames op dit apparaat.
                    </div>
                )}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
                        <Loader2 size={48} className="animate-spin text-emerald-500 mb-4" aria-hidden="true" />
                        <p className="text-slate-400 font-medium">Games laden...</p>
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-20">
                        <Gamepad2 size={64} className="text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">
                            Nog geen games gepubliceerd
                        </h3>
                        <p className="text-slate-500">
                            Wees de eerste die een game deelt!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {games.map(game => (
                            <article
                                key={game.id}
                                onClick={() => handlePlayGame(game)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handlePlayGame(game);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`${game.title} door ${game.creator_name} openen`}
                                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group hover:shadow-xl hover:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                {/* Game Preview */}
                                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                                    {game.mission_id === 'verhalen-ontwerper' && game.book_data?.coverImage ? (
                                        <img
                                            src={game.book_data.coverImage}
                                            alt={game.title}
                                            className="w-full h-full object-cover opacity-80"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {game.mission_id === 'verhalen-ontwerper' ? (
                                                <BookOpen size={48} className="text-amber-500/50" />
                                            ) : (
                                                <Gamepad2 size={48} className="text-slate-600" />
                                            )}
                                        </div>
                                    )}

                                    {/* Play overlay on hover */}
                                    <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${game.mission_id === 'verhalen-ontwerper' ? 'bg-amber-500/90' : 'bg-emerald-500/90'
                                        }`}>
                                        <div className="text-center">
                                            {game.mission_id === 'verhalen-ontwerper' ? (
                                                <>
                                                    <BookOpen size={48} fill="white" className="text-white mx-auto mb-2" />
                                                    <span className="text-white font-bold">Lezen!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={48} fill="white" className="text-white mx-auto mb-2" />
                                                    <span className="text-white font-bold">Spelen!</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Game Info */}
                                <div className="p-4">
                                    <h3 className="font-black text-white text-lg mb-1 truncate">
                                        {game.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-3">
                                        door {game.creator_name}
                                        {game.student_class && (
                                            <span className="text-slate-500"> • {game.student_class}</span>
                                        )}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1 text-slate-400">
                                                {game.mission_id === 'verhalen-ontwerper' ? <BookOpen size={14} /> : <Play size={14} />}
                                                {game.play_count}
                                            </span>
                                            <button
                                                onClick={(e) => handleLike(game.id, e)}
                                                aria-label={`${game.likes?.includes(userId) ? 'Unlike' : 'Like'} ${game.title}. ${game.likes?.length || 0} likes`}
                                                aria-pressed={game.likes?.includes(userId) || false}
                                                className={`flex items-center gap-1 transition-colors ${game.likes?.includes(userId)
                                                    ? 'text-red-400'
                                                    : 'text-slate-400 hover:text-red-400'
                                                    }`}
                                            >
                                                <Heart
                                                    size={14}
                                                    fill={game.likes?.includes(userId) ? 'currentColor' : 'none'}
                                                />
                                                {game.likes?.length || 0}
                                            </button>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {formatDate(game.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Game Player Modal */}
            {selectedGame && blobUrl && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    {/* Header */}
                    <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                        <div>
                            <h2 className="font-black text-white">{selectedGame.title}</h2>
                            <p className="text-xs text-slate-400">door {selectedGame.creator_name}</p>
                        </div>
                        <button
                            onClick={handleCloseGame}
                            aria-label="Sluit game"
                            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Game iframe */}
                    <div className="flex-1">
                        <iframe
                            ref={iframeRef}
                            src={blobUrl}
                            title={selectedGame.title}
                            className="w-full h-full border-none"
                            // Untrusted student code: keep origin opaque to prevent access to parent context.
                            sandbox="allow-scripts"
                            allow="autoplay"
                        />
                    </div>
                </div>
            )}

            {/* Book Reader Modal */}
            {selectedGame && selectedGame.mission_id === 'verhalen-ontwerper' && selectedGame.book_data && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    {/* Header */}
                    <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 z-50">
                        <div>
                            <h2 className="font-black text-white">{selectedGame.title}</h2>
                            <p className="text-xs text-slate-400">door {selectedGame.creator_name}</p>
                        </div>
                        <button
                            onClick={handleCloseGame}
                            aria-label="Sluit boek"
                            className="p-2 hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Book Reader */}
                    <div className="flex-1 relative bg-stone-100 overflow-hidden">
                        <BookPreview
                            data={selectedGame.book_data}
                            hasStarted={true}
                            readOnly={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
