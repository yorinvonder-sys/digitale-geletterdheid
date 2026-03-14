
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
            <div className="w-full h-full flex items-center justify-center text-white" style={{ backgroundColor: '#1A1A19' }}>
                <div className="text-center p-8 rounded-2xl border shadow-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E6DF' }}>
                    <p className="mb-6 text-xl font-bold" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>Verbindingsfout</p>
                    <p className="mb-6" style={{ color: '#3D3D38' }}>{error}</p>
                    <button onClick={onExit} className="px-6 py-3 rounded-full font-bold transition-all duration-300" style={{ backgroundColor: '#D97757', color: '#FFFFFF' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}>
                        Terug naar Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!gameState) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white relative overflow-hidden" style={{ backgroundColor: '#1A1A19' }}>
                <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle at center, rgba(217,119,87,0.15), #1A1A19 70%)' }}></div>
                <div className="z-10 flex flex-col items-center">
                    <div className="relative">
                        <div className="absolute inset-0 blur-xl opacity-20 animate-ping" style={{ backgroundColor: '#D97757' }}></div>
                        <Loader className="animate-spin mb-8" size={64} style={{ color: '#D97757' }} />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>ARENA BATTLE</h2>
                    <p className="font-mono text-sm animate-pulse" style={{ color: '#D97757' }}>VERBINDEN MET SERVER...</p>
                </div>
            </div>
        );
    }

    // Lobby & Instructions
    if (gameState.status === 'lobby' || showInstructions) {
        const players = Object.values(gameState.players);
        const playerCount = players.length;

        return (
            <div className="w-full h-full flex items-center justify-center overflow-hidden relative" style={{ backgroundColor: '#1A1A19' }}>
                {/* Dynamic Background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#D97757 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                {/* Main Modal */}
                <div className="relative w-full max-w-4xl h-[90%] md:h-auto backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row" style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #E8E6DF' }}>

                    {/* Instructions Side */}
                    <div className="w-full md:w-1/2 p-8 flex flex-col" style={{ backgroundColor: '#FAF9F0' }}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onExit}
                                    className="p-2 rounded-full transition-all duration-300"
                                    style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
                                    title="Terug naar dashboard"
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8E6DF')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0EEE8')}
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <h2 className="text-2xl font-black italic" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>Zo speel je</h2>
                            </div>
                            {gameState.status === 'playing' && (
                                <button onClick={() => setShowInstructions(false)} className="p-2 rounded-full transition-all duration-300"
                                    style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E8E6DF')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0EEE8')}>
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-6 flex-1 overflow-y-auto">
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>
                                    Doel
                                </h3>
                                <p className="text-sm" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                    Plaats bommen om kisten te vernietigen en power-ups te vinden.
                                    Blaas je tegenstanders op om te winnen!
                                </p>
                            </div>

                            {/* Show controls based on detected device */}
                            {isTouchDevice ? (
                                <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D97757' }}>
                                    <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>
                                        Touch Besturing
                                    </h3>
                                    <p className="text-sm" style={{ color: '#3D3D38', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                        Gebruik de virtuele joystick links om te bewegen en de bom-knop rechts om bommen te plaatsen.
                                    </p>
                                    <div className="mt-3 flex justify-center gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0EEE8', border: '2px solid #E8E6DF' }}>
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6B6B66' }}></div>
                                            </div>
                                            <span className="text-xs mt-1" style={{ color: '#6B6B66' }}>Joystick</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#D97757', border: '2px solid #C46849' }}>
                                                💣
                                            </div>
                                            <span className="text-xs mt-1" style={{ color: '#6B6B66' }}>Bom</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                    <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>
                                        Toetsenbord Besturing
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-xs mb-1" style={{ color: '#6B6B66' }}>Bewegen</div>
                                            <div className="font-mono text-sm p-2 rounded-xl" style={{ backgroundColor: '#FAF9F0', color: '#1A1A19', border: '1px solid #E8E6DF' }}>WASD / Pijltjes</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs mb-1" style={{ color: '#6B6B66' }}>Bom</div>
                                            <div className="font-mono text-sm p-2 rounded-xl" style={{ backgroundColor: '#FAF9F0', color: '#1A1A19', border: '1px solid #E8E6DF' }}>Spatie</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {gameState.status === 'lobby' && (
                            <div className="mt-6 pt-6" style={{ borderTop: '1px solid #E8E6DF' }}>
                                <p className="text-center text-xs" style={{ color: '#6B6B66' }}>Wachten op spelers...</p>
                            </div>
                        )}
                    </div>

                    {/* Lobby Side */}
                    {gameState.status === 'lobby' && (
                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center" style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid #E8E6DF' }}>
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-black mb-2 tracking-tighter" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>
                                    <span style={{ color: '#D97757' }}>ARENA</span> BATTLE
                                </h1>
                                <div className="flex justify-center items-center gap-2">
                                    <div className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: '#2A9D8F' }}></div>
                                    <p className="font-mono text-sm" style={{ color: '#2A9D8F' }}>LIVE LOBBY</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {[0, 1, 2, 3].map(i => {
                                    const player = players[i];
                                    return (
                                        <div key={i} className={`p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 ${player
                                            ? 'transform hover:scale-[1.02]'
                                            : ''
                                            }`}
                                            style={player
                                                ? { backgroundColor: '#FFFFFF', border: '1px solid #D97757', boxShadow: '0 4px 12px rgba(217,119,87,0.1)' }
                                                : { backgroundColor: '#FAF9F0', border: '1px dashed #E8E6DF' }
                                            }>
                                            {player ? (
                                                <>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                                                        style={{ backgroundColor: player.avatar.shirtColor }}>
                                                        {player.name.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold truncate max-w-[120px]" style={{ color: '#1A1A19', fontFamily: "'Outfit', system-ui, sans-serif" }}>
                                                            {player.id === myPlayerId ? 'Jij' : player.name}
                                                        </p>
                                                    </div>
                                                    <div className="px-3 py-1 text-xs rounded-full font-bold inline-flex items-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
                                                        READY
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-3 w-full" style={{ color: '#6B6B66' }}>
                                                    <div className="w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: '#E8E6DF' }}>
                                                        <Users size={16} />
                                                    </div>
                                                    <span className="font-mono text-sm">Wachten...</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center">
                                {playerCount >= 2 && lobbyCountdown !== null ? (
                                    // Auto-start countdown active
                                    <div className="w-full py-4 text-white font-bold rounded-2xl text-center flex items-center justify-center gap-3 shadow-lg" style={{ background: 'linear-gradient(135deg, #D97757, #C46849)', boxShadow: '0 4px 20px rgba(217,119,87,0.3)' }}>
                                        <div className="relative w-12 h-12">
                                            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.2)"
                                                    strokeWidth="3"
                                                />
                                                <path
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="#FFFFFF"
                                                    strokeWidth="3"
                                                    strokeDasharray={`${((60 - lobbyCountdown) / 60) * 100}, 100`}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
                                                {lobbyCountdown}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-white text-lg">Game start in {lobbyCountdown}s</span>
                                            <span className="text-white/70 text-xs">Of wacht tot docent start</span>
                                        </div>
                                    </div>
                                ) : playerCount >= 1 ? (
                                    // Waiting for more players
                                    <div className="w-full py-4 font-bold rounded-2xl text-center flex flex-col items-center gap-2" style={{ backgroundColor: '#FAF9F0', color: '#6B6B66', border: '1px solid #E8E6DF' }}>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#D97757' }} />
                                            <span style={{ color: '#3D3D38' }}>Wachten op meer spelers...</span>
                                        </div>
                                        <span className="text-xs" style={{ color: '#6B6B66' }}>{playerCount}/2 spelers nodig om te starten</span>
                                        <span className="text-[10px] mt-1" style={{ color: '#6B6B66' }}>Docent kan het spel ook direct starten</span>
                                    </div>
                                ) : (
                                    <div className="w-full py-4 font-bold rounded-2xl text-center" style={{ backgroundColor: '#FAF9F0', color: '#6B6B66', border: '1px solid #E8E6DF' }}>
                                        Wachten op spelers...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* If Playing but Instructions Open */}
                    {gameState.status === 'playing' && (
                        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center text-center" style={{ backgroundColor: '#FFFFFF' }}>
                            <div className="mb-6">
                                <Play size={64} className="mx-auto mb-4" style={{ color: '#D97757' }} />
                                <h2 className="text-2xl font-bold" style={{ color: '#1A1A19', fontFamily: "'Newsreader', Georgia, serif" }}>Game gestart!</h2>
                            </div>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="px-8 py-3 font-bold rounded-full transition-all duration-300 text-white"
                                style={{ backgroundColor: '#D97757' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
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
        <div className="w-full h-full relative select-none overflow-hidden touch-none" style={{ backgroundColor: '#1A1A19' }}>
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
                    <button onClick={onExit} className="backdrop-blur text-white p-3 rounded-full transition-all duration-300" style={{ backgroundColor: 'rgba(26,26,25,0.8)', border: '1px solid rgba(232,230,223,0.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(217,119,87,0.2)'; e.currentTarget.style.color = '#D97757'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(26,26,25,0.8)'; e.currentTarget.style.color = '#FFFFFF'; }}>
                        <X size={20} />
                    </button>
                    <button onClick={() => setShowInstructions(true)} className="backdrop-blur text-white p-3 rounded-full transition-all duration-300" style={{ backgroundColor: 'rgba(26,26,25,0.8)', border: '1px solid rgba(232,230,223,0.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(42,157,143,0.2)'; e.currentTarget.style.color = '#2A9D8F'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(26,26,25,0.8)'; e.currentTarget.style.color = '#FFFFFF'; }}>
                        <Info size={20} />
                    </button>
                </div>

                <div className={`absolute top-4 left-1/2 -translate-x-1/2 backdrop-blur px-6 py-2 rounded-full font-mono text-2xl font-black transition-all ${timeLeft <= 30
                    ? 'animate-pulse'
                    : ''
                    }`}
                    style={timeLeft <= 30
                        ? { backgroundColor: 'rgba(220,38,38,0.9)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.5)', boxShadow: '0 0 30px rgba(220,38,38,0.5)' }
                        : isSuddenDeath
                            ? { backgroundColor: 'rgba(220,38,38,0.9)', color: '#fca5a5', border: '1px solid rgba(220,38,38,0.5)' }
                            : { backgroundColor: 'rgba(26,26,25,0.9)', color: '#D97757', border: '1px solid rgba(217,119,87,0.3)', boxShadow: '0 0 20px rgba(217,119,87,0.2)' }
                    }>
                    {isSuddenDeath ? 'SUDDEN DEATH' : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                </div>

                <div className="flex flex-col gap-2">
                    {Object.values(gameState.players).map(p => (
                        <div key={p.id} className={`flex items-center gap-2 p-2 pl-3 rounded-xl transition-all duration-300 ${!p.isAlive ? 'opacity-50 grayscale' : ''}`}
                            style={p.isAlive
                                ? { backgroundColor: 'rgba(26,26,25,0.85)', border: '1px solid rgba(217,119,87,0.3)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }
                                : { backgroundColor: 'rgba(26,26,25,0.6)', border: '1px solid rgba(220,38,38,0.3)' }
                            }>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }} />
                            <div className="flex flex-col">
                                <span className="text-xs text-white font-bold truncate max-w-[80px]" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{p.name}</span>
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
                <div className="absolute inset-0 flex items-center justify-center z-30 animate-pulse" style={{ backgroundColor: 'rgba(26,26,25,0.8)' }}>
                    <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <h2 className="text-4xl font-black mb-2" style={{ color: '#D97757', fontFamily: "'Newsreader', Georgia, serif" }}>GAME OVER</h2>
                        <p style={{ color: '#3D3D38' }}>Je bent uitgeschakeld!</p>
                        <p className="text-sm mt-2" style={{ color: '#6B6B66' }}>Je kunt blijven kijken...</p>
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
                    <div className="absolute inset-0 backdrop-blur-sm rounded-full shadow-lg" style={{ backgroundColor: 'rgba(26,26,25,0.7)', border: '2px solid rgba(232,230,223,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}></div>

                    {/* Direction Indicators */}
                    <div className="absolute inset-4 rounded-full" style={{ border: '1px solid rgba(232,230,223,0.2)' }}></div>

                    {/* Joystick Thumb (Movable) */}
                    <div
                        className="joystick-thumb absolute top-1/2 left-1/2 -ml-7 -mt-7 w-14 h-14 rounded-full shadow-xl transition-transform duration-75"
                        style={{ background: 'linear-gradient(135deg, #6B6B66, #3D3D38)', border: '2px solid rgba(232,230,223,0.4)', transform: 'translate(0, 0)' }}
                    >
                        {/* Inner highlight */}
                        <div className="absolute inset-1 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(232,230,223,0.2), transparent)' }}></div>
                    </div>
                </div>

                {/* BOMB BUTTON */}
                <button
                    className="w-24 h-24 backdrop-blur-sm rounded-full shadow-2xl active:scale-90 transition-all duration-300 pointer-events-auto flex items-center justify-center group"
                    style={{ backgroundColor: 'rgba(217,119,87,0.85)', border: '4px solid #C46849' }}
                    onTouchStart={(e) => { e.preventDefault(); handleBombPress(); }}
                    onClick={(e) => { e.preventDefault(); handleBombPress(); }}
                >
                    <span className="text-4xl filter drop-shadow-lg group-active:scale-125 transition-transform">💣</span>
                </button>
            </div>

        </div>
    );
};
