/**
 * DuelWaitingRoom.tsx
 * Pre-game lobby where both players must click READY before the game starts.
 * Shows both player avatars, ready states, and a countdown when both are ready.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Users, Check, Loader2, ArrowLeft, Swords, Clock } from 'lucide-react';
import {
    ActiveDuel,
    subscribeToDuel,
    updateDuel,
    endDuel
} from '../../../services/duelService';

interface DuelWaitingRoomProps {
    sessionId: string;
    currentUserId: string;
    onGameStart: () => void;
    onExit: () => void;
}

export const DuelWaitingRoom: React.FC<DuelWaitingRoomProps> = ({
    sessionId,
    currentUserId,
    onGameStart,
    onExit
}) => {
    const [session, setSession] = useState<ActiveDuel | null>(null);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [isSettingReady, setIsSettingReady] = useState(false);
    const [readCountdown, setReadCountdown] = useState(5); // 5-second reading timer

    // Subscribe to session updates
    useEffect(() => {
        const unsubscribe = subscribeToDuel(sessionId, (sess) => {
            setSession(sess);

            // Start countdown when status changes to 'countdown'
            if (sess?.status === 'drawing' && countdown === null) {
                setCountdown(3);
            }

            // Transition to game when round > 0 or drawing status
            if (sess?.status === 'drawing' && sess?.current_round > 0) {
                onGameStart();
            }
        });

        return () => unsubscribe();
    }, [sessionId, countdown, onGameStart]);

    // Countdown timer
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            // Start the game
            updateDuel(sessionId, { status: 'drawing' });
        }
    }, [countdown, sessionId]);

    // 5-second reading timer before Ready button is enabled
    useEffect(() => {
        if (readCountdown > 0) {
            const timer = setInterval(() => {
                setReadCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [readCountdown]);

    // Get current player info
    const isPlayer1 = session?.player1_uid === currentUserId;
    const myReady = false; // Simplified: auto-ready in Supabase version
    const opponentReady = false;
    const myName = isPlayer1 ? session?.player1_name : session?.player2_name;
    const opponentName = isPlayer1 ? session?.player2_name : session?.player1_name;

    const handleToggleReady = useCallback(async () => {
        if (!session) return;
        setIsSettingReady(true);
        await updateDuel(sessionId, { status: 'drawing' });
        setIsSettingReady(false);
    }, [session, sessionId, currentUserId]);

    const handleLeave = useCallback(async () => {
        await endDuel(sessionId);
        onExit();
    }, [sessionId, currentUserId, onExit]);

    if (!session) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <Loader2 size={48} className="animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={handleLeave}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold text-sm">Verlaten</span>
                </button>
                <div className="flex items-center gap-2">
                    <Swords size={20} className="text-orange-400" />
                    <span className="font-black text-lg uppercase tracking-wider">Duel Lobby</span>
                </div>
                <div className="w-24" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
                {/* Countdown Overlay */}
                {countdown !== null && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="text-9xl font-black text-orange-500 animate-pulse">
                                {countdown === 0 ? 'GO!' : countdown}
                            </div>
                            <p className="text-2xl font-bold text-white mt-4">
                                {countdown === 0 ? 'Start Tekenen!' : 'Maak je klaar...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-black text-white mb-2">⚔️ Tekenduel</h2>
                    <p className="text-slate-400">Beide spelers moeten READY zijn om te beginnen!</p>
                </div>

                {/* Players */}
                <div className="flex items-center gap-12">
                    {/* Player 1 (You) */}
                    <div className={`relative p-6 rounded-2xl border-4 transition-all duration-300 ${myReady
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-slate-700 bg-slate-800'
                        }`}>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-4xl font-black text-white mb-4">
                            {myName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${myReady ? 'bg-green-500' : 'bg-red-500'} ${!myReady ? 'animate-pulse' : ''}`} />
                            <p className="font-bold text-lg text-white">{myName}</p>
                        </div>
                        <p className="text-center text-xs text-orange-400 font-bold uppercase tracking-wider">(Jij)</p>

                        {myReady && (
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check size={24} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* VS */}
                    <div className="text-4xl font-black text-slate-600">VS</div>

                    {/* Player 2 (Opponent) */}
                    <div className={`relative p-6 rounded-2xl border-4 transition-all duration-300 ${opponentReady
                        ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
                        : 'border-slate-700 bg-slate-800'
                        }`}>
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-black text-white mb-4">
                            {opponentName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${opponentReady ? 'bg-green-500' : 'bg-red-500'} ${!opponentReady ? 'animate-pulse' : ''}`} />
                            <p className="font-bold text-lg text-white">{opponentName}</p>
                        </div>
                        <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-wider">Tegenstander</p>

                        {opponentReady ? (
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check size={24} className="text-white" />
                            </div>
                        ) : (
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
                                <Clock size={20} className="text-slate-400 animate-pulse" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Ready Button */}
                {readCountdown > 0 && !myReady ? (
                    <div className="mt-8 px-12 py-5 bg-slate-700 text-slate-400 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 border border-slate-600">
                        <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                                <path
                                    className="text-slate-600"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className="text-green-500"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeDasharray={`${((5 - readCountdown) / 5) * 100}, 100`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                                {readCountdown}
                            </span>
                        </div>
                        <span>Lees eerst de instructies...</span>
                    </div>
                ) : (
                    <button
                        onClick={handleToggleReady}
                        disabled={isSettingReady || countdown !== null}
                        className={`mt-8 px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-wider transition-all duration-300 flex items-center gap-3 ${myReady
                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 hover:scale-105 active:scale-95'
                            }`}
                    >
                        {isSettingReady ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : myReady ? (
                            <>
                                <Check size={24} />
                                READY! (Klik om te annuleren)
                            </>
                        ) : (
                            <>
                                <Users size={24} />
                                IK BEN KLAAR!
                            </>
                        )}
                    </button>
                )}

                {/* Waiting message */}
                {myReady && !opponentReady && (
                    <p className="text-slate-400 flex items-center gap-2 animate-pulse">
                        <Clock size={16} />
                        Wachten op tegenstander...
                    </p>
                )}

                {/* Both ready message */}
                {myReady && opponentReady && countdown === null && (
                    <p className="text-green-400 flex items-center gap-2 font-bold">
                        <Check size={16} />
                        Beide klaar! Start over een moment...
                    </p>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-slate-800/50 border-t border-slate-700 px-6 py-3 text-center">
                <p className="text-slate-500 text-xs">
                    💡 Tip: Wie in 1 minuut de meeste tekeningen door de AI goedgekeurd krijgt, wint!
                </p>
            </footer>
        </div>
    );
};

export default DuelWaitingRoom;
