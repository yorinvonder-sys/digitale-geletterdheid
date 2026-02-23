
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GameCanvas } from './GameCanvas';
import { useBombermanGame } from './useBombermanGame';
import { AvatarConfig } from '../../../types';
import { Loader, Users, Play, Info, X, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../services/supabase';

interface BombermanProps {
    avatarConfig: AvatarConfig;
    schoolId?: string;
    onExit: () => void;
    onXPEarned?: (amount: number, label: string) => void;
}

export const Bomberman: React.FC<BombermanProps> = ({ avatarConfig, schoolId, onExit, onXPEarned }) => {
    const { gameState, myPlayerId, move, placeBomb, pickupPowerup, startGame, error } = useBombermanGame(avatarConfig, schoolId);
    const [timeLeft, setTimeLeft] = useState(180); // 3 mins
    const [showInstructions, setShowInstructions] = useState(true);
    const [isSuddenDeath, setIsSuddenDeath] = useState(false);
    const [shrinkLevel, setShrinkLevel] = useState(0);
    const [showGameOver, setShowGameOver] = useState(false);
    const [showHitFlash, setShowHitFlash] = useState(false);
    const [lobbyCountdown, setLobbyCountdown] = useState<number | null>(null); // 60-second countdown
    const gameOverShownRef = useRef(false);
    const prevLivesRef = useRef<number | null>(null);
    const [readCountdown, setReadCountdown] = useState(5); // 5 second instruction read timer
    const zoneDamageDebounceRef = useRef<number>(0); // Debounce for zone damage

    // Handle zone death (sudden death red zone)
    const handleZoneDeath = useCallback(() => {
        if (!gameState || !myPlayerId) return;
        const player = gameState.players[myPlayerId];
        if (!player || !player.isAlive) return;

        // Debounce: only deal damage once per second
        const now = Date.now();
        if (now - zoneDamageDebounceRef.current < 1000) return;
        zoneDamageDebounceRef.current = now;

        const newLives = Math.max(0, (player.lives || 1) - 1);

        const updatedPlayers = {
            ...gameState.players,
            [myPlayerId]: {
                ...player,
                lives: newLives,
                ...(newLives <= 0 ? { isAlive: false } : {})
            }
        };

        supabase
            .from('bomberman_rooms')
            .update({ players: updatedPlayers as any })
            .eq('id', gameState.id)
            .then();
    }, [gameState, myPlayerId]);

    // Device detection: Check if running on a touch device (iPad/tablet/mobile)
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkTouchDevice = () => {
            // Check for touch capability AND screen size typical for tablets/phones
            const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 1024; // Tablets and below
            // Also check user agent for iPad (even in desktop mode)
            const isIPad = /iPad|Macintosh/.test(navigator.userAgent) && 'ontouchstart' in window;
            setIsTouchDevice(hasTouchScreen && (isSmallScreen || isIPad));
        };

        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    // Shared Input Ref for Keyboard and Touch
    const inputRef = useRef({ up: false, down: false, left: false, right: false, bomb: false });

    useEffect(() => {
        if (gameState?.status === 'playing') {
            // Auto-close the instructions/lobby screen when game starts
            setShowInstructions(false);

            const timer = setInterval(() => {
                setTimeLeft(p => {
                    if (p <= 0) {
                        clearInterval(timer);
                        setIsSuddenDeath(true);
                        return 0;
                    }
                    return p - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState?.status]);

    // Lobby auto-start countdown (60 seconds after 2+ players join)
    useEffect(() => {
        if (gameState?.status !== 'lobby' || !gameState.lobbyStartTime) {
            setLobbyCountdown(null);
            return;
        }

        const playerCount = Object.keys(gameState.players || {}).length;
        if (playerCount < 2) {
            setLobbyCountdown(null);
            return;
        }

        // Calculate remaining time (60 seconds from lobbyStartTime)
        const LOBBY_DURATION = 60 * 1000; // 60 seconds
        const elapsed = Date.now() - gameState.lobbyStartTime;
        const remaining = Math.max(0, Math.ceil((LOBBY_DURATION - elapsed) / 1000));

        setLobbyCountdown(remaining);

        // Auto-start when countdown reaches 0
        if (remaining <= 0 && startGame) {
            startGame();
            return;
        }

        // Update countdown every second
        const timer = setInterval(() => {
            const now = Date.now();
            const newElapsed = now - (gameState.lobbyStartTime || now);
            const newRemaining = Math.max(0, Math.ceil((LOBBY_DURATION - newElapsed) / 1000));
            setLobbyCountdown(newRemaining);

            if (newRemaining <= 0 && startGame) {
                startGame();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState?.status, gameState?.lobbyStartTime, gameState?.players, startGame]);

    // Read countdown timer (5 seconds to read instructions before starting)
    useEffect(() => {
        if (gameState?.status !== 'lobby') {
            setReadCountdown(5); // Reset for next game
            return;
        }

        if (readCountdown <= 0) return;

        const timer = setInterval(() => {
            setReadCountdown(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState?.status, readCountdown]);

    // Sudden Death: Shrink zone every 5 seconds
    useEffect(() => {
        if (!isSuddenDeath) return;
        const shrinkTimer = setInterval(() => {
            setShrinkLevel(prev => {
                // Max shrink: leave at least 3x3 area in center
                const maxShrink = Math.min(Math.floor(15 / 2) - 2, Math.floor(13 / 2) - 2); // ~5
                if (prev >= maxShrink) {
                    clearInterval(shrinkTimer);
                    return prev;
                }
                return prev + 1;
            });
        }, 5000);
        return () => clearInterval(shrinkTimer);
    }, [isSuddenDeath]);

    // Detect player death and show Game Over overlay
    useEffect(() => {
        if (!gameState || !myPlayerId) return;
        const myPlayer = gameState.players[myPlayerId];
        if (!myPlayer) return;

        // Track lives for hit detection
        if (prevLivesRef.current === null) {
            prevLivesRef.current = myPlayer.lives;
        } else if (myPlayer.lives < prevLivesRef.current) {
            // Player was hit! Show flash
            setShowHitFlash(true);
            setTimeout(() => setShowHitFlash(false), 300);
            prevLivesRef.current = myPlayer.lives;
        }

        // Game over detection
        if (!myPlayer.isAlive && !gameOverShownRef.current) {
            gameOverShownRef.current = true;
            setShowGameOver(true);
            setTimeout(() => setShowGameOver(false), 2000);
        }
    }, [gameState?.players, myPlayerId]);

    // Keyboard Controls
    useEffect(() => {
        console.log('Bomberman: Keyboard listeners mounted');

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            console.log('Bomberman: KeyDown', e.key);
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': inputRef.current.up = true; break;
                case 'ArrowDown': case 's': case 'S': inputRef.current.down = true; break;
                case 'ArrowLeft': case 'a': case 'A': inputRef.current.left = true; break;
                case 'ArrowRight': case 'd': case 'D': inputRef.current.right = true; break;
                case ' ':
                    e.preventDefault(); // Prevent page scroll
                    if (!inputRef.current.bomb) {
                        console.log('Bomberman: Spacebar - placing bomb');
                        placeBomb();
                        inputRef.current.bomb = true;
                        setTimeout(() => inputRef.current.bomb = false, 100);
                    }
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': case 'w': case 'W': inputRef.current.up = false; break;
                case 'ArrowDown': case 's': case 'S': inputRef.current.down = false; break;
                case 'ArrowLeft': case 'a': case 'A': inputRef.current.left = false; break;
                case 'ArrowRight': case 'd': case 'D': inputRef.current.right = false; break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            console.log('Bomberman: Keyboard listeners unmounted');
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [placeBomb]);

    // Touch Handlers
    const handleTouchStart = (dir: 'up' | 'down' | 'left' | 'right') => {
        inputRef.current[dir] = true;
    };
    const handleTouchEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
        inputRef.current[dir] = false;
    };
    const handleBombPress = () => {
        if (!inputRef.current.bomb) {
            placeBomb();
            inputRef.current.bomb = true;
            setTimeout(() => inputRef.current.bomb = false, 100);
        }
    };

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                <div className="text-center p-8 bg-slate-800 rounded-2xl border border-red-500/50 shadow-2xl">
                    <p className="text-red-400 mb-6 text-xl font-bold">⚠️ Connection Error</p>
                    <p className="mb-6 text-slate-300">{error}</p>
                    <button onClick={onExit} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition-all">
                        Terug naar Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 animate-pulse"></div>
                <div className="z-10 flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-ping"></div>
                        <Loader className="animate-spin mb-8 text-emerald-400" size={64} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">ARENA BATTLE</h2>
                    <p className="text-emerald-400 font-mono text-sm animate-pulse">CONNECTING TO SERVER...</p>
                </div>
            </div>
        );
    }

    // Lobby & Instructions
    if (gameState.status === 'lobby' || showInstructions) {
        const players = Object.values(gameState.players);
        const playerCount = players.length;

        return (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden relative">
                {/* Dynamic Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px]"></div>

                {/* Main Modal */}
                <div className="relative w-full max-w-4xl h-[90%] md:h-auto bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

                    {/* Instructions Side */}
                    <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onExit}
                                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    title="Terug naar dashboard"
                                >
                                    <ArrowLeft size={20} className="text-white" />
                                </button>
                                <h2 className="text-2xl font-black text-white italic">HOW TO PLAY</h2>
                            </div>
                            {gameState.status === 'playing' && (
                                <button onClick={() => setShowInstructions(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                                    <X size={20} className="text-white" />
                                </button>
                            )}
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                    🎯 Doel
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Plaats bommen om kisten te vernietigen en power-ups te vinden.
                                    Blaas je tegenstanders op om te winnen!
                                </p>
                            </div>

                            {/* Show controls based on detected device */}
                            {isTouchDevice ? (
                                <div className="bg-white/5 p-4 rounded-xl border border-emerald-500/30">
                                    <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                        📱 Touch Besturing
                                    </h3>
                                    <p className="text-slate-300 text-sm">
                                        Gebruik de virtuele joystick links om te bewegen en de bom-knop rechts om bommen te plaatsen.
                                    </p>
                                    <div className="mt-3 flex justify-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1">Joystick</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full bg-red-600 border-2 border-red-400 flex items-center justify-center text-white font-bold text-lg">
                                                💣
                                            </div>
                                            <span className="text-xs text-slate-400 mt-1">Bom</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                        ⌨️ Toetsenbord Besturing
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-slate-400 text-xs mb-1">Bewegen</div>
                                            <div className="font-mono text-white text-sm bg-black/30 p-2 rounded">WASD / Pijltjes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-slate-400 text-xs mb-1">Bom</div>
                                            <div className="font-mono text-white text-sm bg-black/30 p-2 rounded">Spatie</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {gameState.status === 'lobby' && (
                            <div className="mt-6 pt-6 border-t border-white/5">
                                <p className="text-center text-slate-500 text-xs">Waiting for players...</p>
                            </div>
                        )}
                    </div>

                    {/* Lobby Side */}
                    {gameState.status === 'lobby' && (
                        <div className="w-full md:w-1/2 p-8 bg-slate-900/50 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10">
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">
                                    <span className="text-emerald-500">ARENA</span> BATTLE
                                </h1>
                                <div className="flex justify-center items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                                    <p className="text-emerald-400 font-mono text-sm">LIVE LOBBY</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {[0, 1, 2, 3].map(i => {
                                    const player = players[i];
                                    return (
                                        <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${player
                                            ? 'bg-slate-800 border-emerald-500/50 shadow-lg shadow-emerald-500/10 transform hover:scale-[1.02]'
                                            : 'bg-slate-800/30 border-dashed border-slate-700'
                                            }`}>
                                            {player ? (
                                                <>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                                        style={{ backgroundColor: player.avatar.shirtColor }}>
                                                        {player.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-white truncate max-w-[120px]">
                                                            {player.id === myPlayerId ? 'Jij' : player.name}
                                                        </p>
                                                    </div>
                                                    <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded font-bold">
                                                        READY
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-3 text-slate-600 w-full">
                                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                                                        <Users size={16} />
                                                    </div>
                                                    <span className="font-mono text-sm">Waiting...</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                {playerCount >= 2 && lobbyCountdown !== null ? (
                                    // Auto-start countdown active
                                    <div className="w-full py-4 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white font-bold rounded-xl text-center border border-emerald-600 flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/30">
                                        <div className="relative w-12 h-12">
                                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-emerald-950"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    className="text-emerald-400"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${((60 - lobbyCountdown) / 60) * 100}, 100`}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-emerald-300">
                                                {lobbyCountdown}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-emerald-300 text-lg">Game start in {lobbyCountdown}s</span>
                                            <span className="text-emerald-500 text-xs">Of wacht tot docent start</span>
                                        </div>
                                    </div>
                                ) : playerCount >= 1 ? (
                                    // Waiting for more players
                                    <div className="w-full py-4 bg-slate-800 text-slate-400 font-bold rounded-xl text-center border border-slate-700 flex flex-col items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                            <span>Wachten op meer spelers...</span>
                                        </div>
                                        <span className="text-xs text-slate-500">{playerCount}/2 spelers nodig om te starten</span>
                                        <span className="text-[10px] text-slate-600 mt-1">💡 Docent kan het spel ook direct starten</span>
                                    </div>
                                ) : (
                                    <div className="w-full py-4 bg-slate-800 text-slate-500 font-bold rounded-xl text-center border border-slate-700">
                                        Wachten op spelers...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* If Playing but Instructions Open */}
                    {gameState.status === 'playing' && (
                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-center">
                            <div className="mb-6">
                                <Play size={64} className="text-emerald-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-white">Game Started!</h2>
                            </div>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Sluit Menu & Speel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative bg-slate-900 select-none overflow-hidden touch-none">
            {/* Game Canvas */}
            <GameCanvas
                gameState={gameState}
                myPlayerId={myPlayerId || ''}
                onMove={move}
                onBomb={placeBomb}
                onPickup={pickupPowerup}
                inputRef={inputRef}
                shrinkLevel={shrinkLevel}
                isSuddenDeath={isSuddenDeath}
                onDeath={handleZoneDeath}
            />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex justify-between items-start z-10">
                <div className="flex gap-2 pointer-events-auto">
                    <button onClick={onExit} className="bg-slate-800/90 backdrop-blur text-white p-3 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/10">
                        <X size={20} />
                    </button>
                    <button onClick={() => setShowInstructions(true)} className="bg-slate-800/90 backdrop-blur text-white p-3 rounded-xl hover:bg-blue-500/20 hover:text-blue-400 transition-colors border border-white/10">
                        <Info size={20} />
                    </button>
                </div>

                <div className={`absolute top-4 left-1/2 -translate-x-1/2 backdrop-blur px-6 py-2 rounded-2xl font-mono text-2xl font-black border shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all ${timeLeft <= 30
                    ? 'bg-red-900/90 text-red-400 border-red-500/50 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                    : isSuddenDeath
                        ? 'bg-red-900/90 text-red-300 border-red-500/50'
                        : 'bg-slate-900/90 text-emerald-400 border-emerald-500/30'
                    }`}>
                    {isSuddenDeath ? '☠️ SUDDEN DEATH' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                </div>

                <div className="flex flex-col gap-2">
                    {Object.values(gameState.players).map(p => (
                        <div key={p.id} className={`flex items-center gap-2 bg-slate-900/80 p-2 pl-3 rounded-lg border transition-all ${p.isAlive
                            ? 'border-emerald-500/30 shadow-lg'
                            : 'border-red-500/30 opacity-50 grayscale'
                            }`}>
                            <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: p.color, color: p.color }} />
                            <div className="flex flex-col">
                                <span className="text-xs text-white font-bold truncate max-w-[80px]">{p.name}</span>
                                <div className="flex gap-0.5 text-[10px]">
                                    {Array(Math.max(0, p.lives || 0)).fill('❤️').map((h, i) => <span key={i}>{h}</span>)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* GAME OVER OVERLAY */}
            {showGameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30 animate-pulse">
                    <div className="text-center">
                        <div className="text-6xl mb-4">💀</div>
                        <h2 className="text-4xl font-black text-red-500 mb-2">GAME OVER</h2>
                        <p className="text-slate-400">Je bent uitgeschakeld!</p>
                        <p className="text-slate-500 text-sm mt-2">Je kunt blijven kijken...</p>
                    </div>
                </div>
            )}

            {/* HIT FLASH OVERLAY */}
            {showHitFlash && (
                <div className="absolute inset-0 bg-red-500/40 pointer-events-none z-40 animate-ping" />
            )}

            {/* TOUCH CONTROLS (Visible on all devices for tablet/touch support) */}
            <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none flex justify-between items-end p-8 z-20 md:opacity-50 hover:opacity-100 transition-opacity">

                {/* ANALOG JOYSTICK */}
                <div
                    className="relative w-36 h-36 pointer-events-auto touch-none"
                    onTouchStart={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const deltaX = touch.clientX - centerX;
                        const deltaY = touch.clientY - centerY;
                        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        const maxDistance = rect.width / 2 - 20;

                        // Update thumb position
                        const thumb = e.currentTarget.querySelector('.joystick-thumb') as HTMLElement;
                        if (thumb) {
                            const clampedDist = Math.min(distance, maxDistance);
                            const angle = Math.atan2(deltaY, deltaX);
                            thumb.style.transform = `translate(${Math.cos(angle) * clampedDist}px, ${Math.sin(angle) * clampedDist}px)`;
                        }

                        // Determine direction (dead zone = 20px)
                        if (distance > 20) {
                            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                            inputRef.current.up = angle < -45 && angle > -135;
                            inputRef.current.down = angle > 45 && angle < 135;
                            inputRef.current.left = angle > 135 || angle < -135;
                            inputRef.current.right = angle > -45 && angle < 45;
                        }
                    }}
                    onTouchMove={(e) => {
                        e.preventDefault();
                        const touch = e.touches[0];
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const deltaX = touch.clientX - centerX;
                        const deltaY = touch.clientY - centerY;
                        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                        const maxDistance = rect.width / 2 - 20;

                        // Update thumb position
                        const thumb = e.currentTarget.querySelector('.joystick-thumb') as HTMLElement;
                        if (thumb) {
                            const clampedDist = Math.min(distance, maxDistance);
                            const angle = Math.atan2(deltaY, deltaX);
                            thumb.style.transform = `translate(${Math.cos(angle) * clampedDist}px, ${Math.sin(angle) * clampedDist}px)`;
                        }

                        // Determine direction (dead zone = 20px)
                        if (distance > 20) {
                            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
                            inputRef.current.up = angle < -45 && angle > -135;
                            inputRef.current.down = angle > 45 && angle < 135;
                            inputRef.current.left = angle > 135 || angle < -135;
                            inputRef.current.right = angle > -45 && angle < 45;
                        } else {
                            inputRef.current.up = false;
                            inputRef.current.down = false;
                            inputRef.current.left = false;
                            inputRef.current.right = false;
                        }
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        // Reset thumb position
                        const thumb = e.currentTarget.querySelector('.joystick-thumb') as HTMLElement;
                        if (thumb) {
                            thumb.style.transform = 'translate(0, 0)';
                        }
                        // Reset all directions
                        inputRef.current.up = false;
                        inputRef.current.down = false;
                        inputRef.current.left = false;
                        inputRef.current.right = false;
                    }}
                >
                    {/* Outer Ring */}
                    <div className="absolute inset-0 bg-slate-800/70 backdrop-blur-sm rounded-full border-2 border-slate-600/50 shadow-lg shadow-black/30"></div>

                    {/* Direction Indicators */}
                    <div className="absolute inset-4 rounded-full border border-slate-600/30"></div>

                    {/* Joystick Thumb (Movable) */}
                    <div
                        className="joystick-thumb absolute top-1/2 left-1/2 -ml-7 -mt-7 w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full shadow-xl border-2 border-slate-400/50 transition-transform duration-75"
                        style={{ transform: 'translate(0, 0)' }}
                    >
                        {/* Inner highlight */}
                        <div className="absolute inset-1 bg-gradient-to-br from-slate-400/30 to-transparent rounded-full"></div>
                    </div>
                </div>

                {/* BOMB BUTTON */}
                <button
                    className="w-24 h-24 bg-red-500/80 backdrop-blur-sm rounded-full shadow-2xl border-4 border-red-400 active:scale-90 active:bg-red-400 transition-all pointer-events-auto flex items-center justify-center group"
                    onTouchStart={(e) => { e.preventDefault(); handleBombPress(); }}
                    onClick={(e) => { e.preventDefault(); handleBombPress(); }} // Fallback for mouse
                >
                    <span className="text-4xl filter drop-shadow-lg group-active:scale-125 transition-transform">💣</span>
                </button>
            </div>

        </div>
    );
};
