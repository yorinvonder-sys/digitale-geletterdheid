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
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#FCF6EA' }}>
                <Loader2 size={48} className="animate-spin" style={{ color: '#D97848' }} />
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FCF6EA', color: '#08283B' }}>
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7D8BD' }}>
                <button
                    onClick={handleLeave}
                    className="flex items-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                    style={{ color: '#445865' }}
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Verlaten</span>
                </button>
                <div className="flex items-center gap-2">
                    <Swords size={20} style={{ color: '#D97848' }} />
                    <span className="text-lg uppercase tracking-wider" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700 }}>Duel Lobby</span>
                </div>
                <div className="w-24" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
                {/* Countdown Overlay */}
                {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(26,26,25,0.85)' }}>
                        <div className="text-center">
                            <div className="text-9xl font-black animate-pulse" style={{ color: '#D97848' }}>
                                {countdown === 0 ? 'GO!' : countdown}
                            </div>
                            <p className="text-2xl font-bold mt-4" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#FFFFFF' }}>
                                {countdown === 0 ? 'Start Tekenen!' : 'Maak je klaar...'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Title */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>Tekenduel</h2>
                    <p style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>Beide spelers moeten READY zijn om te beginnen!</p>
                </div>

                {/* Players */}
                <div className="flex items-center gap-12">
                    {/* Player 1 (You) */}
                    <div
                        className="relative p-6 rounded-2xl border-4 transition-all duration-300"
                        style={myReady
                            ? { borderColor: '#5F947D', backgroundColor: 'rgba(16,185,129,0.08)', boxShadow: '0 8px 24px rgba(16,185,129,0.15)' }
                            : { borderColor: '#E7D8BD', backgroundColor: '#FFFFFF' }
                        }
                    >
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4" style={{ background: 'linear-gradient(135deg, #D97848, #D97848)' }}>
                            {myName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${!myReady ? 'animate-pulse' : ''}`} style={{ backgroundColor: myReady ? '#5F947D' : '#D97848' }} />
                            <p className="font-bold text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#08283B' }}>{myName}</p>
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#D97848' }}>(Jij)</p>

                        {myReady && (
                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#5F947D' }}>
                                <Check size={24} className="text-white" />
                            </div>
                        )}
                    </div>

                    {/* VS */}
                    <div className="text-4xl font-black" style={{ color: '#E7D8BD' }}>VS</div>

                    {/* Player 2 (Opponent) */}
                    <div
                        className="relative p-6 rounded-2xl border-4 transition-all duration-300"
                        style={opponentReady
                            ? { borderColor: '#5F947D', backgroundColor: 'rgba(16,185,129,0.08)', boxShadow: '0 8px 24px rgba(16,185,129,0.15)' }
                            : { borderColor: '#E7D8BD', backgroundColor: '#FFFFFF' }
                        }
                    >
                        <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black text-white mb-4" style={{ background: 'linear-gradient(135deg, #0B453F, #7A5F8E)' }}>
                            {opponentName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${!opponentReady ? 'animate-pulse' : ''}`} style={{ backgroundColor: opponentReady ? '#5F947D' : '#D97848' }} />
                            <p className="font-bold text-lg" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#08283B' }}>{opponentName}</p>
                        </div>
                        <p className="text-center text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>Tegenstander</p>

                        {opponentReady ? (
                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#5F947D' }}>
                                <Check size={24} className="text-white" />
                            </div>
                        ) : (
                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FCF6EA' }}>
                                <Clock size={20} className="animate-pulse" style={{ color: '#445865' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Ready Button */}
                {readCountdown > 0 && !myReady ? (
                    <div className="mt-8 px-12 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3" style={{ backgroundColor: '#FCF6EA', color: '#445865', border: '1px solid #E7D8BD', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                        <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#E7D8BD"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#5F947D"
                                    strokeWidth="3"
                                    strokeDasharray={`${((5 - readCountdown) / 5) * 100}, 100`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: '#08283B' }}>
                                {readCountdown}
                            </span>
                        </div>
                        <span>Lees eerst de instructies...</span>
                    </div>
                ) : (
                    <button
                        onClick={handleToggleReady}
                        disabled={isSettingReady || countdown !== null}
                        className={`mt-8 px-12 py-5 rounded-full font-black text-xl uppercase tracking-wider transition-all duration-300 flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#D97848] ${!myReady ? 'hover:scale-105 active:scale-95' : ''}`}
                        style={myReady
                            ? { backgroundColor: '#FCF6EA', color: '#445865', fontFamily: "'Outfit', system-ui, sans-serif" }
                            : { background: 'linear-gradient(135deg, #5F947D, #5F947D)', color: '#FFFFFF', boxShadow: '0 8px 24px rgba(16,185,129,0.3)', fontFamily: "'Outfit', system-ui, sans-serif" }
                        }
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
                    <p className="flex items-center gap-2 animate-pulse" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                        <Clock size={16} />
                        Wachten op tegenstander...
                    </p>
                )}

                {/* Both ready message */}
                {myReady && opponentReady && countdown === null && (
                    <p className="flex items-center gap-2 font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#5F947D' }}>
                        <Check size={16} />
                        Beide klaar! Start over een moment...
                    </p>
                )}
            </div>

            {/* Footer */}
            <footer className="px-6 py-3 text-center" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E7D8BD' }}>
                <p className="text-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                    Tip: Wie in 1 minuut de meeste tekeningen door de AI goedgekeurd krijgt, wint!
                </p>
            </footer>
        </div>
    );
};

export default DuelWaitingRoom;
