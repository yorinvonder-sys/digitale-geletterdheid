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
                ctx.strokeStyle = '#1e293b';
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
                onXPEarned(50, "Tekenduel Gewonnen! 🏆");
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
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Swords size={64} className="text-orange-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white mb-2">Duel Start in...</h2>
                    <div className="text-8xl font-black text-orange-400 animate-pulse">
                        {countdown}
                    </div>
                    <p className="text-slate-400 mt-4">vs {opponentName}</p>
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
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    {isWinner ? (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                                <Crown size={48} className="text-amber-400" />
                            </div>
                            <h2 className="text-3xl font-black text-amber-400 mb-2">JIJ WINT! 🎉</h2>
                        </>
                    ) : isTie ? (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 bg-slate-500/20 rounded-full flex items-center justify-center">
                                <Swords size={48} className="text-slate-400" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-300 mb-2">GELIJKSPEL!</h2>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 mx-auto mb-6 bg-slate-500/20 rounded-full flex items-center justify-center">
                                <Trophy size={48} className="text-slate-400" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-300 mb-2">{opponentName} Wint</h2>
                        </>
                    )}

                    <div className="bg-slate-800/50 rounded-2xl p-6 mb-6">
                        <div className="flex justify-around">
                            <div className="text-center">
                                <p className="text-slate-400 text-sm">Jij</p>
                                <p className="text-3xl font-black text-white">{myScore || 0}</p>
                            </div>
                            <div className="text-slate-600 text-2xl font-bold">vs</div>
                            <div className="text-center">
                                <p className="text-slate-400 text-sm">{opponentName}</p>
                                <p className="text-3xl font-black text-white">{opponentScore || 0}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-400 mb-6">
                        {isWinner ? "+50 XP" : isTie ? "+25 XP" : "+15 XP"}
                        {(myScore || 0) >= 5 && " +10 XP bonus!"}
                    </p>

                    <button
                        onClick={handleExit}
                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg"
                    >
                        Afsluiten
                    </button>
                </div>
            </div>
        );
    }

    // PLAYING SCREEN
    return (
        <div className="w-full h-full bg-slate-900 flex flex-col">
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Current Prompt */}
                    <div className="bg-black/20 rounded-xl px-4 py-2">
                        <p className="text-orange-200 text-[10px] uppercase tracking-wider">Teken</p>
                        <p className="text-white font-black text-xl flex items-center gap-2">
                            {currentPrompt?.icon} {currentPrompt?.word}
                        </p>
                    </div>
                </div>

                {/* Timer */}
                <div className={`px-4 py-2 rounded-xl font-mono font-black text-xl flex items-center gap-2
                    ${timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-black/20'}`}>
                    <Clock size={20} />
                    {timeLeft}s
                </div>

                {/* Scores */}
                <div className="flex items-center gap-3">
                    <div className="bg-black/20 rounded-xl px-3 py-2 text-center">
                        <p className="text-[10px] text-orange-200">Jij</p>
                        <p className="text-white font-black text-lg">{myScore || 0}</p>
                    </div>
                    <span className="text-white/50 text-sm">vs</span>
                    <div className="bg-black/20 rounded-xl px-3 py-2 text-center">
                        <p className="text-[10px] text-orange-200">{opponentName}</p>
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
                    style={{ touchAction: 'none' }}
                />

                {/* Result overlay */}
                {lastResult && (
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none
                        ${lastResult.success ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                        <div className={`text-6xl`}>
                            {lastResult.success ? '✅' : '❌'}
                        </div>
                    </div>
                )}

                {/* Analyzing overlay */}
                {isAnalyzing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                        <Loader2 size={48} className="animate-spin text-orange-400" />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-800 flex justify-center gap-4">
                <button
                    onClick={clearCanvas}
                    disabled={isAnalyzing}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-2"
                >
                    <RotateCcw size={18} />
                    Wissen
                </button>
                <button
                    onClick={submitDrawing}
                    disabled={!isDrawing || isAnalyzing}
                    className="px-10 py-3 bg-gradient-to-r from-orange-500 to-red-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg"
                >
                    <Check size={18} />
                    Check!
                </button>
            </div>
        </div>
    );
};

export default DuelGame;
