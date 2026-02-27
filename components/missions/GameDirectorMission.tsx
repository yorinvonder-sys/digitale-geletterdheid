
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, Play, RotateCcw, ArrowLeft, Sparkles, Trophy, HelpCircle, CheckCircle2 } from 'lucide-react';
import { UserStats } from '../../types';
import { BlockPalette } from './game-director/BlockPalette';
import { CodeWorkspace } from './game-director/CodeWorkspace';
import { PlacedBlock, BlockDefinition, GameContext } from './game-director/BlockTypes';
import { createExecutor, BlockExecutor } from './game-director/BlockExecutor';
import { MissionConclusion } from '../MissionConclusion';
import { StudentAIChat } from '../StudentAIChat';

interface GameDirectorProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
    stats?: UserStats;
    userId?: string;
}

// Challenge definitions
interface Challenge {
    id: string;
    title: string;
    description: string;
    hint: string;
    check: (ctx: GameContext, blocks: PlacedBlock[]) => boolean;
}

const CHALLENGES: Challenge[] = [
    // === EASY ===
    {
        id: 'first_move',
        title: '🚀 Level 1: De Robot Ontwaakt',
        description: 'Onze robot staat stil! Gebruik de code-blokken om hem naar rechts te laten rijden zodra de game start.',
        hint: 'Sleep een geel "wanneer game start" blok in je werkveld, en voeg dan een "ga naar rechts" blok toe.',
        check: (ctx) => ctx.player.x > 150
    },
    {
        id: 'jumping',
        title: '🦘 Level 2: Eerste Sprong',
        description: 'De robot moet kunnen springen! Voeg een sprong-blok toe dat werkt als je op de spatiebalk drukt.',
        hint: 'Gebruik het "wanneer toets ingedrukt" blok met Spatiebalk, en sleep daar het "spring" blok in.',
        check: (ctx, blocks) => {
            // Must have jump block AND reach the goal
            const hasJumpBlock = blocks.some(b => b.definitionId === 'jump');
            return hasJumpBlock && ctx.reachedGoal;
        }
    },
    {
        id: 'keyboard_control',
        title: '🎮 Level 3: Volledige Besturing',
        description: 'Maak de robot volledig bestuurbaar! Zorg dat hij naar LINKS gaat met ← en naar RECHTS met →.',
        hint: 'Je hebt TWEE "wanneer toets ingedrukt" blokken nodig: één voor ArrowLeft en één voor ArrowRight.',
        check: (ctx, blocks) => {
            const hasRightKey = blocks.some(b => b.definitionId === 'when_key_pressed' && b.inputs.key === 'ArrowRight');
            const hasLeftKey = blocks.some(b => b.definitionId === 'when_key_pressed' && b.inputs.key === 'ArrowLeft');
            // Must have both controls AND reach the goal
            return hasRightKey && hasLeftKey && ctx.reachedGoal;
        }
    },
    {
        id: 'smart_jump',
        title: '🧠 Level 4: Slimme Robot',
        description: 'Een echte programmeur voorkomt bugs! Zorg dat de robot ALLEEN kan springen als hij op de grond staat.',
        hint: 'Gebruik het oranje "als op de grond dan" blok en sleep het "spring" blok NAAR BINNEN in dat blok.',
        check: (ctx, blocks) => {
            const findJumpInIfGrounded = (blockList: PlacedBlock[]): boolean => {
                for (const b of blockList) {
                    if (b.definitionId === 'if_grounded' && b.children?.some(c => c.definitionId === 'jump')) return true;
                    if (b.children && findJumpInIfGrounded(b.children)) return true;
                }
                return false;
            };
            // Must have smart jump AND reach the goal
            return findJumpInIfGrounded(blocks) && ctx.reachedGoal;
        }
    },
    // === HARD ===
    {
        id: 'gravity_master',
        title: '🌍 Level 5: Meester van de Zwaartekracht',
        description: 'EINDBAAS! We zijn op de maan. Pas de zwaartekracht aan (tussen 0.1 en 0.3) zodat de robot superhoog kan springen en het doel kan bereiken!',
        hint: 'Gebruik het "zet zwaartekracht op" blok en experimenteer met een waarde tussen 0.1 en 0.3. Te laag = zweeft weg, te hoog = kan niet hoog genoeg springen!',
        check: (ctx) => ctx.variables['gravity'] <= 0.3 && ctx.variables['gravity'] >= 0.1 && ctx.reachedGoal
    }
];

// Level Layouts configuration (Adaptive)
const LEVEL_LAYOUTS = [
    // Level 1: Flat ground
    {
        standard: {
            walls: [
                { x: -50, y: 0, w: 50, h: 600 },
                { x: 800, y: 0, w: 50, h: 600 },
            ],
            goal: { x: 600, y: 500, w: 50, h: 60 }
        },
        hard: {
            // Hard: A longer distance
            walls: [
                { x: -50, y: 0, w: 50, h: 600 },
                { x: 800, y: 0, w: 50, h: 600 },
            ],
            goal: { x: 700, y: 500, w: 50, h: 60 }
        }
    },
    // Level 2: Keyboard Control
    {
        standard: {
            walls: [
                { x: 300, y: 540, w: 40, h: 20 },
                { x: 500, y: 540, w: 40, h: 20 },
            ],
            goal: { x: 700, y: 500, w: 50, h: 60 }
        },
        hard: {
            // Hard: Taller bumps require jumping combined with moving? No, just moving.
            // Maybe tighter spaces.
            walls: [
                { x: 200, y: 500, w: 40, h: 60 }, // Taller obstacle
                { x: 500, y: 500, w: 40, h: 60 },
            ],
            goal: { x: 750, y: 500, w: 50, h: 60 }
        }
    },
    // Level 3: Jumping
    {
        standard: {
            walls: [
                { x: 350, y: 450, w: 60, h: 110 },
            ],
            goal: { x: 650, y: 500, w: 50, h: 60 }
        },
        hard: {
            // Hard: Double wall
            walls: [
                { x: 300, y: 450, w: 40, h: 110 },
                { x: 500, y: 420, w: 40, h: 140 }, // Higher second wall
            ],
            goal: { x: 700, y: 500, w: 50, h: 60 }
        }
    },
    // Level 4: Platforms
    {
        standard: {
            walls: [
                { x: 200, y: 480, w: 100, h: 20 },
                { x: 400, y: 400, w: 100, h: 20 },
                { x: 600, y: 320, w: 150, h: 20 },
            ],
            goal: { x: 650, y: 260, w: 50, h: 60 }
        },
        hard: {
            // Hard: Smaller platforms, larger gaps
            walls: [
                { x: 200, y: 480, w: 60, h: 20 },
                { x: 450, y: 400, w: 60, h: 20 }, // Big gap
                { x: 650, y: 320, w: 80, h: 20 },
            ],
            goal: { x: 665, y: 260, w: 50, h: 60 }
        }
    },
    // Level 5: Gravity
    {
        standard: {
            walls: [
                { x: 300, y: 300, w: 200, h: 20 },
            ],
            goal: { x: 375, y: 240, w: 50, h: 60 }
        },
        hard: {
            // Hard: Very high, very small platform
            walls: [
                { x: 350, y: 200, w: 100, h: 20 },
            ],
            goal: { x: 375, y: 140, w: 50, h: 60 }
        }
    }
];

export const GameDirectorMission: React.FC<GameDirectorProps> = ({ onComplete, onBack, stats, userId }) => {
    // Block programming state
    const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
    const [draggingBlock, setDraggingBlock] = useState<BlockDefinition | null>(null);

    // Game state
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [challengeComplete, setChallengeComplete] = useState(false);
    const [showConclusion, setShowConclusion] = useState(false);
    const [successPulse, setSuccessPulse] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false); // Control chat state
    const [isHardMode, setIsHardMode] = useState(false); // Adaptive difficulty
    const startTimeRef = useRef<number>(Date.now()); // Track challenge duration

    // Canvas and game loop
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playerRef = useRef<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        grounded: boolean;
        facingRight: boolean;
        action?: {
            type: 'move';
            remainingDistance: number;
            speed: number;
            directionX: number;
            directionY: number;
        };
    }>({ x: 50, y: 512, vx: 0, vy: 0, grounded: true, facingRight: true });
    const keysRef = useRef<Record<string, boolean>>({});
    const reqRef = useRef<number | undefined>(undefined);
    const enemiesRef = useRef<{ x: number, y: number }[]>([]);
    const variablesRef = useRef<Record<string, number>>({ gravity: 0.5, speed: 5 });

    // Current challenge
    const currentChallenge = CHALLENGES[currentChallengeIndex];

    // Add log entry
    const log = useCallback((msg: string) => {
        setLogs(prev => [msg, ...prev].slice(0, 8));
    }, []);

    // Maze walls configuration (Adaptive)
    const wallsRef = useRef(LEVEL_LAYOUTS[0].standard.walls);
    const goalRef = useRef(LEVEL_LAYOUTS[0].standard.goal);
    const [reachedGoal, setReachedGoal] = useState(false);

    // Game context for block execution
    const createGameContext = useCallback((): GameContext => ({
        player: playerRef.current,
        keys: keysRef.current,
        variables: variablesRef.current,
        reachedGoal,
        log,
        setScore
    }), [log, reachedGoal]);

    // Update level layout when challenge changes
    useEffect(() => {
        const layoutGroup = LEVEL_LAYOUTS[currentChallengeIndex] || LEVEL_LAYOUTS[0];
        const layout = isHardMode ? layoutGroup.hard : layoutGroup.standard;

        wallsRef.current = layout.walls;
        goalRef.current = layout.goal;
        startTimeRef.current = Date.now(); // Reset timer for new challenge

        if (isHardMode) {
            log('⚡ Snel gedaan! Hard Mode geactiveerd voor dit level!');
        }
    }, [currentChallengeIndex, log, isHardMode]); // Careful with deps, update manually if needed

    // Game loop
    const update = useCallback(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Clear
        ctx.fillStyle = '#0f172a'; // Dark slate background
        ctx.fillRect(0, 0, width, height);

        // Grid pattern
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Ground
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, height - 40, width, 40);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(0, height - 40, width, 4);

        // Draw maze walls
        wallsRef.current.forEach(wall => {
            // Wall shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(wall.x + 4, wall.y + 4, wall.w, wall.h);
            // Wall body
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
            // Wall highlight
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(wall.x, wall.y, wall.w, 4);
            // Wall stripe pattern
            ctx.fillStyle = '#b91c1c';
            for (let i = 0; i < wall.w; i += 20) {
                ctx.fillRect(wall.x + i, wall.y, 10, wall.h);
            }
        });

        // Draw finish/goal
        const goal = goalRef.current;
        // Goal glow
        ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(goal.x + goal.w / 2, goal.y + goal.h / 2, 40, 0, Math.PI * 2);
        ctx.fill();
        // Goal base
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
        // Goal flag pole
        ctx.fillStyle = '#166534';
        ctx.fillRect(goal.x + 5, goal.y - 60, 6, 60);
        // Goal flag
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(goal.x + 11, goal.y - 60);
        ctx.lineTo(goal.x + 45, goal.y - 45);
        ctx.lineTo(goal.x + 11, goal.y - 30);
        ctx.fill();
        // Goal text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('🏁 FINISH', goal.x - 10, goal.y - 70);

        const p = playerRef.current;
        const gravity = variablesRef.current['gravity'] || 0.5;

        // Physics
        // Reset horizontal velocity (blocks must apply it every frame)
        p.vx = 0;

        // Execute blocks (will set action)
        if (isPlaying) {
            const gameCtx = createGameContext();

            // Only execute blocks if we are NOT currently performing an action
            // or if the action queue logic allows concurrent execution (for now, sequential)
            if (!p.action) {
                const executor = createExecutor(blocks, gameCtx);
                executor.execute();
            }

            // Process current action
            if (p.action) {
                if (p.action.type === 'move') {
                    const moveSpeed = p.action.speed;
                    const distanceToMove = Math.min(p.action.remainingDistance, moveSpeed);

                    p.vx = p.action.directionX * distanceToMove;

                    // Only override vertical velocity if we are explicitly moving vertically (flying)
                    if (p.action.directionY !== 0) {
                        p.vy = p.action.directionY * distanceToMove;
                    }

                    p.action.remainingDistance -= distanceToMove;

                    if (p.action.remainingDistance <= 0) {
                        p.action = undefined;
                    }
                }
            }
        }

        // Apply velocities
        p.vy += gravity;
        p.y += p.vy;
        p.x += p.vx;

        // Ground collision
        if (p.y > height - 40 - 48) {
            p.y = height - 40 - 48;
            p.vy = 0;
            p.grounded = true;
        } else {
            p.grounded = false;
        }

        // Wall collision detection
        wallsRef.current.forEach(wall => {
            const playerRight = p.x + 32;
            const playerBottom = p.y + 48;
            const playerLeft = p.x;
            const playerTop = p.y;

            if (playerRight > wall.x && playerLeft < wall.x + wall.w &&
                playerBottom > wall.y && playerTop < wall.y + wall.h) {

                // Determine collision side and push back
                const overlapLeft = playerRight - wall.x;
                const overlapRight = (wall.x + wall.w) - playerLeft;
                const overlapTop = playerBottom - wall.y;
                const overlapBottom = (wall.y + wall.h) - playerTop;

                const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                if (minOverlap === overlapTop && p.vy > 0) {
                    p.y = wall.y - 48;
                    p.vy = 0;
                    p.grounded = true;
                } else if (minOverlap === overlapBottom && p.vy < 0) {
                    p.y = wall.y + wall.h;
                    p.vy = 0;
                } else if (minOverlap === overlapLeft) {
                    p.x = wall.x - 32;
                } else if (minOverlap === overlapRight) {
                    p.x = wall.x + wall.w;
                }
            }
        });

        // Goal collision detection
        if (p.x + 32 > goal.x && p.x < goal.x + goal.w &&
            p.y + 48 > goal.y && p.y < goal.y + goal.h) {
            if (!reachedGoal) {
                setReachedGoal(true);
                setScore(s => s + 500);
                log('🎉 FINISH! Je hebt het doel bereikt!');
            }
        }

        // (Blocks executed earlier in physics loop)

        // Bounds
        p.x = Math.max(0, Math.min(width - 32, p.x));

        // Draw player (pixel art style)
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(px + 4, height - 38, 24, 6);

        // Body
        ctx.fillStyle = '#4F46E5';
        ctx.fillRect(px + 4, py + 16, 24, 24);

        // Head
        ctx.fillStyle = '#FCD34D';
        ctx.fillRect(px + 6, py, 20, 20);

        // Eyes
        ctx.fillStyle = '#1e293b';
        if (p.facingRight) {
            ctx.fillRect(px + 18, py + 6, 4, 4);
            ctx.fillRect(px + 24, py + 6, 4, 4);
        } else {
            ctx.fillRect(px + 4, py + 6, 4, 4);
            ctx.fillRect(px + 10, py + 6, 4, 4);
        }

        // Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px + 6, py + 40, 8, 8);
        ctx.fillRect(px + 18, py + 40, 8, 8);

        // UI
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(`Score: ${score}`, 16, 28);

        // Goal indicator arrow when not visible
        if (goal.x > width - 100) {
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText('🏁 →', width - 60, 28);
        }

        // Challenge indicator
        if (currentChallenge) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(`🎯 ${currentChallenge.title}`, 16, height - 52);
        }

        // Victory overlay
        if (reachedGoal) {
            ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🎉 GEWONNEN!', width / 2, height / 2);
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Je hebt de finish bereikt!', width / 2, height / 2 + 30);
            ctx.textAlign = 'left';
        }

        if (isPlaying && currentChallenge && !challengeComplete) {
            const gameCtx = createGameContext();
            if (currentChallenge.check(gameCtx, blocks)) {
                setChallengeComplete(true);
                setSuccessPulse(true);
                setTimeout(() => setSuccessPulse(false), 2000);
                log(`🏆 Uitdaging voltooid: ${currentChallenge.title}!`);
                setScore(s => s + 100);
            }
        }

        if (isPlaying) {
            reqRef.current = requestAnimationFrame(update);
        }
    }, [isPlaying, blocks, score, currentChallenge, challengeComplete, createGameContext, log, reachedGoal]);

    // Keyboard controls
    useEffect(() => {
        const handleDown = (e: KeyboardEvent) => {
            keysRef.current[e.key] = true;
        };
        const handleUp = (e: KeyboardEvent) => {
            keysRef.current[e.key] = false;
        };
        window.addEventListener('keydown', handleDown);
        window.addEventListener('keyup', handleUp);
        return () => {
            window.removeEventListener('keydown', handleDown);
            window.removeEventListener('keyup', handleUp);
        };
    }, []);

    // Game loop management
    useEffect(() => {
        if (isPlaying) {
            log('🚀 Game gestart!');
            reqRef.current = requestAnimationFrame(update);
        } else {
            if (reqRef.current) {
                cancelAnimationFrame(reqRef.current);
                reqRef.current = undefined;
            }
            // Render one frame for preview
            update();
        }
        return () => {
            if (reqRef.current) cancelAnimationFrame(reqRef.current);
        };
    }, [isPlaying, update, log]);

    // Reset game state
    const handleReset = useCallback(() => {
        playerRef.current = { x: 50, y: 512, vx: 0, vy: 0, grounded: true, facingRight: true };
        enemiesRef.current = [];
        variablesRef.current = { gravity: 0.5, speed: 5 };
        BlockExecutor.reset(); // Reset executor state so when_game_starts can trigger again
        setScore(0);
        setIsPlaying(false);
        setChallengeComplete(false);
        setReachedGoal(false);
        log('🔄 Game gereset');
    }, [log]);

    // Toggle play/stop
    const handleTogglePlay = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            handleReset();
            setIsPlaying(true);
        }
    }, [isPlaying, handleReset]);

    // Next challenge
    const handleNextChallenge = useCallback(() => {
        // Calculate speed
        const duration = (Date.now() - startTimeRef.current) / 1000;
        const isFast = duration < 45; // 45 seconds threshold implies mastery

        if (currentChallengeIndex < CHALLENGES.length - 1) {
            setCurrentChallengeIndex(i => i + 1);
            setChallengeComplete(false);
            setShowHint(false);

            // Set difficulty for NEXT level
            setIsHardMode(isFast); // If fast now, next level is hard. If slow now, next level is standard.

            handleReset();

            if (isFast) {
                log(`🚀 Wow! ${duration.toFixed(1)}s is supersnel! Level ${currentChallengeIndex + 2} wordt MOEILIJKER!`);
            } else {
                log(`💪 Goed bezig. Op naar het volgende level!`);
            }
        } else {
            // All challenges complete!
            log('🎉 Alle uitdagingen voltooid!');
            setShowConclusion(true);
        }
    }, [currentChallengeIndex, handleReset, log]);

    // Auto-advance to next level when challenge is complete
    useEffect(() => {
        if (challengeComplete) {
            const timer = setTimeout(() => {
                handleNextChallenge();
            }, 3000); // 3 seconds delay to see the victory screen

            return () => clearTimeout(timer);
        }
    }, [challengeComplete, handleNextChallenge]);


    return (
        <div className="bg-slate-900 h-dvh flex flex-col text-white font-sans relative overflow-hidden">

            {showConclusion && (
                <MissionConclusion
                    title="🏆 Missie Voltooid: Game Director!"
                    description="Super gedaan! Je bent nu een echte Game Director. Je hebt niet alleen een game gespeeld, maar zelf de regels bedacht!"
                    aiConcept={{
                        title: "Wie is de baas?",
                        text: "In deze missie was JIJ de baas over de robot, net zoals programmeurs de baas zijn over AI. We moeten AI (zoals ChatGPT) duidelijke instructies geven, zodat het precies doet wat we willen en altijd veilig blijft. Dat noemen we 'AI Alignment'."
                    }}
                    onExit={() => {
                        setShowConclusion(false);
                        onComplete(true);
                    }}
                />
            )}

            {/* Header */}
            <header className="bg-slate-800 border-b border-slate-700 px-6 py-2 flex items-center justify-between shrink-0 min-h-[4rem]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                            <Settings2 size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                Game Director <Sparkles size={14} className="text-amber-400" />
                            </h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                Visueel Programmeren
                            </p>
                        </div>
                    </div>
                </div>

                {/* Challenge Banner - Integrated in Header */}
                {currentChallenge && (
                    <div className={`flex-1 mx-8 px-4 py-2 rounded-xl flex items-center justify-between transition-all duration-500 ${challengeComplete
                        ? (successPulse ? 'bg-emerald-500 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-emerald-500/10 border border-emerald-500/30')
                        : 'bg-slate-950/50 border border-slate-700/50'
                        }`}>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 shrink-0">
                                {challengeComplete ? (
                                    <Trophy size={18} className="text-emerald-400" />
                                ) : (
                                    <span className="text-lg">🎯</span>
                                )}
                                <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">
                                    Missie {currentChallengeIndex + 1}/{CHALLENGES.length}:
                                </span>
                            </div>
                            <h3 className="font-bold text-sm text-white shrink-0">
                                {currentChallenge.title}
                            </h3>
                            <span
                                className="hidden xl:inline text-xs text-slate-400 border-l border-slate-600 pl-4 whitespace-normal leading-tight max-w-2xl"
                                title={currentChallenge.description}
                            >
                                {currentChallenge.description}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-4">
                            {challengeComplete ? (
                                <button
                                    onClick={handleNextChallenge}
                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 shadow-lg shadow-emerald-900/20"
                                >
                                    Volgende <ArrowLeft size={12} className="rotate-180" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 font-bold px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-amber-500/20"
                                >
                                    <HelpCircle size={12} /> {showHint ? 'Verberg Hint' : 'Hint'}
                                </button>
                            )}

                            {/* 'I am stuck' button - Always visible/accessible helper */}
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="flex items-center gap-1 text-[10px] text-white font-bold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Sparkles size={12} /> Hulp nodig?
                            </button>
                        </div>
                    </div>
                )}

            </header>

            <StudentAIChat
                userIdentifier={userId || 'anonymous'}
                isOpen={isChatOpen}
                onOpenChange={setIsChatOpen}
                context={{
                    currentChallenge: currentChallenge ? {
                        title: currentChallenge.title,
                        description: currentChallenge.description,
                        hint: currentChallenge.hint
                    } : null,
                    blocks: blocks.map(b => ({ type: b.definitionId, inputs: b.inputs })),
                    logs: logs.slice(0, 5),
                    gameStatus: { isPlaying, reachedGoal, challengeComplete, score }
                }}
            />

            {showHint && !challengeComplete && currentChallenge && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2 text-center text-xs font-medium text-amber-200 animate-in slide-in-from-top-2">
                    💡 <span className="font-bold">HINT:</span> {currentChallenge.hint}
                </div>
            )}

            {/* Main Content Area - Full Height Grid */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Panel: Block Palette */}
                <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-10 p-2">
                    <BlockPalette onDragStart={setDraggingBlock} />
                </div>

                {/* Middle Panel: Workspace */}
                <div className="flex-1 bg-slate-950 relative flex flex-col min-w-[300px] p-2">
                    <div className="absolute inset-0 bg-[linear-gradient(#1e293b_1px,transparent_1px),linear-gradient(90deg,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
                    <CodeWorkspace
                        blocks={blocks}
                        onBlocksChange={setBlocks}
                        onRun={handleTogglePlay}
                        onReset={handleReset}
                        isRunning={isPlaying}
                    />
                </div>

                {/* Right Panel: Game Preview (Larger!) */}
                <div className="w-[40%] min-w-[500px] max-w-[800px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-20">
                    <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Game Preview</span>
                        </div>
                        <div className="text-xs font-mono text-slate-500">
                            {canvasRef.current ? `${canvasRef.current.width}x${canvasRef.current.height}` : '800x600'}
                        </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden bg-slate-950 relative">
                        {/* Game Screen Container - Maintains Aspect Ratio but fills space */}
                        <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 group">
                            {/* Canvas needs to respond to size */}
                            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#1e293b_0%,#0f172a_100%)]">
                                <canvas
                                    ref={canvasRef}
                                    width={800}
                                    height={600}
                                    className="max-w-full max-h-full object-contain image-pixelated shadow-lg"
                                    style={{ aspectRatio: '4/3' }}
                                />
                            </div>

                            {/* Overlay Controls (Play/Stop) on top of Game */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/90 backdrop-blur-sm p-1.5 rounded-xl border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={handleTogglePlay}
                                    className={`p-3 rounded-lg transition-all active:scale-95 ${isPlaying
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                                >
                                    {isPlaying ? <RotateCcw size={20} /> : <Play size={20} fill="currentColor" />}
                                </button>
                            </div>
                        </div>

                        {/* Console / Logs */}
                        <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex flex-col shrink-0 overflow-hidden">
                            <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Systeem Console</span>
                                <button onClick={() => setLogs([])} className="text-[10px] text-slate-500 hover:text-white transition-colors">Wis</button>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                                {logs.length === 0 ? (
                                    <div className="text-slate-600 italic px-2">Wachten op input...</div>
                                ) : (
                                    logs.map((l, i) => (
                                        <div key={i} className="flex gap-2 text-emerald-400/90 hover:bg-white/5 rounded px-2 py-0.5">
                                            <span className="text-slate-600 select-none">&gt;</span>
                                            <span>{l}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
