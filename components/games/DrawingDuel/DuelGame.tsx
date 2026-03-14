/**
 * DuelGame.tsx
 * The main duel gameplay component - 1 minute drawing competition.
 * Both players get the same prompts in the same order.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Trophy, Swords, Check, X, RotateCcw, Loader2, Crown } from 'lucide-react';
import {
    ActiveDuel,
    subscribeToDuel,
    updateDuel,
    endDuel
} from '../../../services/duelService';
import { analyzeDrawingWithAI } from '../../../services/geminiService';

// Import PROMPTS from DrawingGamePreview (we'll need to export it)
const PROMPTS = [
    { word: 'zon', icon: '☀️' },
    { word: 'hart', icon: '❤️' },
    { word: 'ster', icon: '⭐' },
    { word: 'wolk', icon: '☁️' },
    { word: 'maan', icon: '🌙' },
    { word: 'appel', icon: '🍎' },
    { word: 'kat', icon: '🐱' },
    { word: 'huis', icon: '🏠' },
    { word: 'bloem', icon: '🌸' },
    { word: 'auto', icon: '🚗' },
    { word: 'boom', icon: '🌳' },
    { word: 'vis', icon: '🐟' },
    { word: 'bril', icon: '👓' },
    { word: 'boot', icon: '⛵' },
    { word: 'vlinder', icon: '🦋' },
    { word: 'fiets', icon: '🚲' },
    { word: 'vogel', icon: '🐦' },
    { word: 'pizza', icon: '🍕' },
    { word: 'robot', icon: '🤖' },
    { word: 'raket', icon: '🚀' },
];

interface DuelGameProps {
    sessionId: string;
    currentUserId: string;
    onExit: () => void;
    onXPEarned?: (amount: number, label: string) => void;
}

export const DuelGame: React.FC<DuelGameProps> = ({
    sessionId,
    currentUserId,
    onExit,
    onXPEarned
}) => {
    const [session, setSession] = useState<ActiveDuel | null>(null);
    const [countdown, setCountdown] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [lastResult, setLastResult] = useState<{ success: boolean; word: string } | null>(null);
    const [hasEnded, setHasEnded] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });

    // Determine if current user is player1 or player2
    const isPlayer1 = session?.player1_uid === currentUserId;
    const myScore = isPlayer1 ? session?.player1_score : session?.player2_score;
    const opponentScore = isPlayer1 ? session?.player2_score : session?.player1_score;
    const opponentName = isPlayer1 ? session?.player2_name : session?.player1_name;

    // Get current prompt from session's prompt order
    const currentPrompt = session?.current_round !== undefined
        ? PROMPTS[currentPromptIndex % PROMPTS.length]
        : PROMPTS[0];

    // Subscribe to session updates
    useEffect(() => {
        const unsubscribe = subscribeToDuel(sessionId, (updatedSession) => {
            setSession(updatedSession);
        });
        return () => unsubscribe();
    }, [sessionId]);

    // Countdown before game starts
    useEffect(() => {
        if (session?.status === 'drawing' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (session?.status === 'drawing' && countdown === 0) {
            // Game has started - timer handled in game timer effect
        }
    }, [session?.status, countdown, isPlayer1, sessionId]);

    // Game timer
    useEffect(() => {
        if (session?.status === 'drawing' && session.round_start_time) {
            const updateTimer = () => {
                const startMs = new Date(session.round_start_time!).getTime();
                const elapsedSecs = Math.floor((Date.now() - startMs) / 1000);
                const remaining = Math.max(0, 60 - elapsedSecs);
                setTimeLeft(remaining);

                if (remaining <= 0 && !hasEnded) {
                    setHasEnded(true);
                    if (isPlayer1) {
                        endDuel(sessionId);
                    }
                }
            };

            updateTimer();
            const interval = setInterval(updateTimer, 100);
            return () => clearInterval(interval);
        }
    }, [session?.status, session?.round_start_time, hasEnded, isPlayer1, sessionId]);

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current && session?.status === 'drawing') {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.strokeStyle = '#3D3D38';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }
    }, [session?.status, currentPromptIndex]);

    // Drawing handlers
    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }, []);

    const startDrawingHandler = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (session?.status !== 'drawing' || isAnalyzing) return;
        isDrawingRef.current = true;
        lastPosRef.current = getPos(e);
    }, [getPos, session?.status, isAnalyzing]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingRef.current || session?.status !== 'drawing' || isAnalyzing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPosRef.current = pos;
        setIsDrawing(true);
    }, [getPos, session?.status, isAnalyzing]);

    const stopDrawing = useCallback(() => {
        isDrawingRef.current = false;
    }, []);

    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setIsDrawing(false);
    };

    const submitDrawing = async () => {
        if (!canvasRef.current || !session || isAnalyzing) return;

        setIsAnalyzing(true);
        const imageBase64 = canvasRef.current.toDataURL('image/png').split(',')[1];
        const possibleLabels = PROMPTS.map(p => p.word);

        try {
            const result = await analyzeDrawingWithAI(imageBase64, possibleLabels);
            const isCorrect = result.mainGuess.toLowerCase() === currentPrompt.word.toLowerCase();

            setLastResult({ success: isCorrect, word: currentPrompt.word });

            if (isCorrect) {
                const newScore = (myScore || 0) + 1;
                await updateDuel(sessionId, {
                    [isPlayer1 ? 'player1_score' : 'player2_score']: newScore,
                });
            }

            // Clear canvas and move to next prompt after brief delay
            setTimeout(() => {
                clearCanvas();
                setCurrentPromptIndex(i => i + 1);
                setLastResult(null);
                setIsAnalyzing(false);
            }, 500);

        } catch (error) {
            console.error('Analysis failed', error);
            setIsAnalyzing(false);
        }
    };

    // Handle game end and XP
    const handleExit = () => {
        endDuel(sessionId);

        // Award XP
        if (session?.status === 'finished' && onXPEarned) {
            // Determine winner by comparing scores
            const p1Score = session.player1_score;
            const p2Score = session.player2_score;
            const isWinner = isPlayer1 ? p1Score > p2Score : p2Score > p1Score;
            const isTie = p1Score === p2Score;

            if (isWinner) {
                onXPEarned(50, "Tekenduel Gewonnen!");
            } else if (isTie) {
                onXPEarned(25, "Tekenduel Gelijkspel");
            } else {
                onXPEarned(15, "Tekenduel Deelname");
            }

            // Bonus for 5+ correct
            if ((myScore || 0) >= 5) {
                onXPEarned(10, "Tekenduel 5+ Bonus");
            }
        }

        onExit();
    };

    // COUNTDOWN SCREEN
    if (session?.status === 'drawing' && countdown > 0) {
        return (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#FAF9F0' }}>
                <div className="text-center">
                    <Swords size={64} className="mx-auto mb-6" style={{ color: '#D97757' }} />
                    <h2 className="text-2xl mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#1A1A19' }}>Duel Start in...</h2>
                    <div className="text-8xl font-black animate-pulse" style={{ color: '#D97757' }}>
                        {countdown}
                    </div>
                    <p className="mt-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#6B6B66' }}>vs {opponentName}</p>
                </div>
            </div>
        );
    }

    // FINISHED SCREEN
    if (session?.status === 'finished') {
        const p1Score = session.player1_score;
        const p2Score = session.player2_score;
        const isWinner = isPlayer1 ? p1Score > p2Score : p2Score > p1Score;
        const isTie = p1Score === p2Score;

        return (
            <div className="w-full h-full flex items-center justify-center p-6" style={{ backgroundColor: '#FAF9F0' }}>
                <div className="text-center max-w-md">
                    {isWinner ? (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217,119,87,0.12)' }}>
                                <Crown size={48} style={{ color: '#D97757' }} />
                            </div>
                            <h2 className="text-3xl mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#D97757' }}>JIJ WINT!</h2>
                        </>
                    ) : isTie ? (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0EEE8' }}>
                                <Swords size={48} style={{ color: '#6B6B66' }} />
                            </div>
                            <h2 className="text-3xl mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#1A1A19' }}>GELIJKSPEL!</h2>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0EEE8' }}>
                                <Trophy size={48} style={{ color: '#6B6B66' }} />
                            </div>
                            <h2 className="text-3xl mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#1A1A19' }}>{opponentName} Wint</h2>
                        </>
                    )}

                    <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                        <div className="flex justify-around">
                            <div className="text-center">
                                <p className="text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#6B6B66' }}>Jij</p>
                                <p className="text-3xl font-black" style={{ color: '#1A1A19' }}>{myScore || 0}</p>
                            </div>
                            <div className="text-2xl font-bold" style={{ color: '#E8E6DF' }}>vs</div>
                            <div className="text-center">
                                <p className="text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#6B6B66' }}>{opponentName}</p>
                                <p className="text-3xl font-black" style={{ color: '#1A1A19' }}>{opponentScore || 0}</p>
                            </div>
                        </div>
                    </div>

                    <p className="mb-6" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#6B6B66' }}>
                        {isWinner ? "+50 XP" : isTie ? "+25 XP" : "+15 XP"}
                        {(myScore || 0) >= 5 && " +10 XP bonus!"}
                    </p>

                    <button
                        onClick={handleExit}
                        className="px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                        style={{ background: 'linear-gradient(135deg, #D97757, #C46849)', color: '#FFFFFF' }}
                    >
                        Afsluiten
                    </button>
                </div>
            </div>
        );
    }

    // PLAYING SCREEN
    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FAF9F0' }}>
            {/* Header */}
            <div className="p-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #D97757, #C46849)' }}>
                <div className="flex items-center gap-4">
                    {/* Current Prompt */}
                    <div className="rounded-full px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Teken</p>
                        <p className="text-white font-black text-xl flex items-center gap-2">
                            {currentPrompt?.icon} {currentPrompt?.word}
                        </p>
                    </div>
                </div>

                {/* Timer */}
                <div
                    className="px-4 py-2 rounded-full font-mono font-black text-xl flex items-center gap-2"
                    style={timeLeft <= 10
                        ? { backgroundColor: '#ef4444', color: '#FFFFFF' }
                        : { backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }
                    }
                >
                    <Clock size={20} />
                    {timeLeft}s
                </div>

                {/* Scores */}
                <div className="flex items-center gap-3">
                    <div className="rounded-full px-3 py-2 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>Jij</p>
                        <p className="text-white font-black text-lg">{myScore || 0}</p>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm">vs</span>
                    <div className="rounded-full px-3 py-2 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>{opponentName}</p>
                        <p className="text-white font-black text-lg">{opponentScore || 0}</p>
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
                <canvas
                    ref={canvasRef}
                    width={350}
                    height={350}
                    onMouseDown={startDrawingHandler}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawingHandler}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="bg-white rounded-2xl shadow-2xl touch-none cursor-crosshair"
                    style={{ touchAction: 'none', border: '1px solid #E8E6DF' }}
                />

                {/* Result overlay */}
                {lastResult && (
                    <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ backgroundColor: lastResult.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}
                    >
                        <div className="text-6xl">
                            {lastResult.success ? '✅' : '❌'}
                        </div>
                    </div>
                )}

                {/* Analyzing overlay */}
                {isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(250,249,240,0.7)' }}>
                        <Loader2 size={48} className="animate-spin" style={{ color: '#D97757' }} />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 flex justify-center gap-4" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E6DF' }}>
                <button
                    onClick={clearCanvas}
                    disabled={isAnalyzing}
                    className="px-6 py-3 disabled:opacity-50 rounded-full font-bold flex items-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
                >
                    <RotateCcw size={18} />
                    Wissen
                </button>
                <button
                    onClick={submitDrawing}
                    disabled={!isDrawing || isAnalyzing}
                    className="px-10 py-3 disabled:opacity-50 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    style={
                        !isDrawing || isAnalyzing
                            ? { backgroundColor: '#E8E6DF', color: '#6B6B66' }
                            : { background: 'linear-gradient(135deg, #D97757, #C46849)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(217,119,87,0.3)' }
                    }
                >
                    <Check size={18} />
                    Check!
                </button>
            </div>
        </div>
    );
};

export default DuelGame;
