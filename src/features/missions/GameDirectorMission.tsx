
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, Play, RotateCcw, ArrowLeft, Sparkles, Trophy, HelpCircle, CheckCircle2, Puzzle, Code2, Gamepad2 } from 'lucide-react';
import { UserStats } from '@/types';
import { BlockPalette } from './game-director/BlockPalette';
import { CodeWorkspace } from './game-director/CodeWorkspace';
import { PlacedBlock, BlockDefinition, GameContext, MoveAction, getBlockById } from './game-director/BlockTypes';
import { createExecutor, BlockExecutor } from './game-director/BlockExecutor';
import { MissionConclusion } from '@/features/missions/shared/MissionConclusion';
import { StudentAIChat } from '@/features/ai-chat/StudentAIChat';
import { useMissionAutoSave } from '@/hooks/useMissionAutoSave';
import { MissionGoalBanner } from './templates/shared/MissionGoalBanner';
import type { MissionGoal } from './templates/shared/types';

interface GameDirectorProgress {
    currentChallengeIndex: number;
    score: number;
    isHardMode: boolean;
    reflectie: string;
}

interface GameDirectorProps {
    onComplete: (success: boolean) => void;
    onBack: () => void;
    stats?: UserStats;
    userId?: string;
}

const MISSION_GOAL: MissionGoal = {
    primaryGoal: 'Ik programmeer Robbie door vijf levels heen en leg uit wat duidelijke instructies met AI te maken hebben.',
    criteria: {
        type: 'component-complete',
        min: 5,
        description: 'Alle vijf Game Director challenges zijn voltooid en de reflectie is ingevuld.',
    },
    evidence: 'Werkende blokcode per level en een reflectie van minimaal 10 tekens.',
};

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
        title: '🐾 Level 1: Robbie Ontwaakt',
        description: 'Robbie de speurhond ruikt een spoor! Programmeer hem om naar rechts te lopen naar het eerste bewijs.',
        hint: 'Sleep een geel "wanneer game start" blok in je werkveld, en voeg dan een "ga naar rechts" blok toe.',
        check: (ctx) => ctx.player.x > 150
    },
    {
        id: 'jumping',
        title: '🦴 Level 2: Over het Hek',
        description: 'Er staat een hek in de weg! Programmeer Robbie om te springen als je op de spatiebalk drukt.',
        hint: 'Gebruik het "wanneer toets ingedrukt" blok met Spatiebalk, en voeg het "spring" blok toe.',
        check: (ctx, blocks) => {
            // Must have jump block AND reach the goal
            const hasJumpBlock = blocks.some(b => b.definitionId === 'jump');
            return hasJumpBlock && ctx.reachedGoal;
        }
    },
    {
        id: 'keyboard_control',
        title: '🔍 Level 3: De Zoektocht',
        description: 'Robbie moet overal kunnen zoeken! Zorg dat hij naar LINKS gaat met ← en naar RECHTS met →.',
        hint: 'Je hebt TWEE "wanneer toets ingedrukt" blokken nodig: één voor ← en één voor →.',
        check: (ctx, blocks) => {
            const hasRightKey = blocks.some(b => b.definitionId === 'when_key_pressed' && b.inputs.key === 'ArrowRight');
            const hasLeftKey = blocks.some(b => b.definitionId === 'when_key_pressed' && b.inputs.key === 'ArrowLeft');
            // Must have both controls AND reach the goal
            return hasRightKey && hasLeftKey && ctx.reachedGoal;
        }
    },
    {
        id: 'smart_jump',
        title: '🧠 Level 4: Slimme Speurhond',
        description: 'Een goede speurhond springt alleen als het veilig is! Zorg dat Robbie ALLEEN springt als hij op de grond staat.',
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
        title: '🌙 Level 5: Maanmissie',
        description: 'EINDBAAS! Robbie zoekt bewijs op de maan! Pas de zwaartekracht aan (tussen 0.1 en 0.3) zodat Robbie superhoog kan springen!',
        hint: 'Gebruik het "zet zwaartekracht op" blok en experimenteer met een waarde tussen 0.1 en 0.3. Te laag = zweeft weg, te hoog = springt niet hoog genoeg!',
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
            walls: [
                { x: -50, y: 0, w: 50, h: 600 },
                { x: 800, y: 0, w: 50, h: 600 },
            ],
            goal: { x: 700, y: 500, w: 50, h: 60 }
        }
    },
    // Level 2: Jumping over fence
    {
        standard: {
            walls: [
                { x: 300, y: 540, w: 40, h: 20 },
                { x: 500, y: 540, w: 40, h: 20 },
            ],
            goal: { x: 700, y: 500, w: 50, h: 60 }
        },
        hard: {
            walls: [
                { x: 200, y: 500, w: 40, h: 60 },
                { x: 500, y: 500, w: 40, h: 60 },
            ],
            goal: { x: 750, y: 500, w: 50, h: 60 }
        }
    },
    // Level 3: Navigation
    {
        standard: {
            walls: [
                { x: 350, y: 450, w: 60, h: 110 },
            ],
            goal: { x: 650, y: 500, w: 50, h: 60 }
        },
        hard: {
            walls: [
                { x: 300, y: 450, w: 40, h: 110 },
                { x: 500, y: 420, w: 40, h: 140 },
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
            walls: [
                { x: 200, y: 480, w: 60, h: 20 },
                { x: 450, y: 400, w: 60, h: 20 },
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
            walls: [
                { x: 350, y: 200, w: 100, h: 20 },
            ],
            goal: { x: 375, y: 140, w: 50, h: 60 }
        }
    }
];

export const GameDirectorMission: React.FC<GameDirectorProps> = ({ onComplete, onBack, stats, userId }) => {
    // Persistent progress state (auto-saved to localStorage)
    const { state: progress, setState: setProgress, clearSave } = useMissionAutoSave<GameDirectorProgress>(
        'game-director',
        { currentChallengeIndex: 0, score: 0, isHardMode: false, reflectie: '' }
    );

    // Block programming state
    const [blocks, setBlocks] = useState<PlacedBlock[]>([]);
    const [draggingBlock, setDraggingBlock] = useState<BlockDefinition | null>(null);

    // Mobile tab state
    type MobileTab = 'blocks' | 'code' | 'game';
    const [mobileTab, setMobileTab] = useState<MobileTab>('code');

    // Add block handler (for keyboard/button add from palette)
    const handleAddBlock = useCallback((definition: BlockDefinition) => {
        const newBlock: PlacedBlock = {
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            definitionId: definition.id,
            inputs: definition.inputs.reduce((acc, input) => {
                acc[input.name] = input.default;
                return acc;
            }, {} as Record<string, any>)
        };
        setBlocks(prev => [...prev, newBlock]);
    }, []);

    // Transient game state
    const [isPlaying, setIsPlaying] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [challengeComplete, setChallengeComplete] = useState(false);
    const [showConclusion, setShowConclusion] = useState(false);
    const [successPulse, setSuccessPulse] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const startTimeRef = useRef<number>(Date.now());

    // Canvas and game loop
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const playerRef = useRef<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        grounded: boolean;
        facingRight: boolean;
        actionQueue: MoveAction[];
    }>({ x: 50, y: 512, vx: 0, vy: 0, grounded: true, facingRight: true, actionQueue: [] });
    const keysRef = useRef<Record<string, boolean>>({});
    const reqRef = useRef<number | undefined>(undefined);
    const enemiesRef = useRef<{ x: number, y: number }[]>([]);
    const variablesRef = useRef<Record<string, number>>({ gravity: 0.5, speed: 5 });

    // Current challenge
    const currentChallenge = CHALLENGES[progress.currentChallengeIndex];

    // Score setter compatible with GameContext.setScore signature
    const setScore = useCallback((fn: (s: number) => number) => {
        setProgress(prev => ({ ...prev, score: fn(prev.score) }));
    }, [setProgress]);

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
        const layoutGroup = LEVEL_LAYOUTS[progress.currentChallengeIndex] || LEVEL_LAYOUTS[0];
        const layout = progress.isHardMode ? layoutGroup.hard : layoutGroup.standard;

        wallsRef.current = layout.walls;
        goalRef.current = layout.goal;
        startTimeRef.current = Date.now(); // Reset timer for new challenge

        if (progress.isHardMode) {
            log('⚡ Snel gedaan! Hard Mode geactiveerd voor dit level!');
        }
    }, [progress.currentChallengeIndex, log, progress.isHardMode]);

    // Game loop
    const update = useCallback(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Clear — park at night theme
        ctx.fillStyle = '#202023';
        ctx.fillRect(0, 0, width, height);

        // Subtle grass pattern
        ctx.strokeStyle = '#202023';
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

        // Stars in the sky
        ctx.fillStyle = 'rgba(215, 201, 95, 0.6)';
        const starSeed = [23, 87, 142, 201, 315, 467, 523, 611, 702, 45, 189, 334, 556, 678, 99];
        for (let i = 0; i < starSeed.length; i++) {
            const sx = (starSeed[i] * 3) % width;
            const sy = (starSeed[i] * 7) % (height - 200);
            ctx.fillRect(sx, sy, 2, 2);
        }

        // Ground (grass)
        ctx.fillStyle = '#202023';
        ctx.fillRect(0, height - 40, width, 40);
        ctx.fillStyle = '#202023';
        ctx.fillRect(0, height - 40, width, 4);
        // Grass blades
        ctx.fillStyle = '#202023';
        for (let gx = 0; gx < width; gx += 12) {
            ctx.fillRect(gx, height - 44, 2, 6);
        }

        // Draw obstacles as wooden fences
        wallsRef.current.forEach(wall => {
            // Shadow
            ctx.fillStyle = 'rgba(8, 40, 59,0.3)';
            ctx.fillRect(wall.x + 3, wall.y + 3, wall.w, wall.h);
            // Fence body (brown wood)
            ctx.fillStyle = '#99984D';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
            // Wood grain
            ctx.fillStyle = '#99984D';
            ctx.fillRect(wall.x, wall.y, wall.w, 3);
            // Planks
            ctx.fillStyle = '#202023';
            for (let i = 0; i < wall.w; i += 16) {
                ctx.fillRect(wall.x + i, wall.y, 1, wall.h);
            }
            // Horizontal bars
            ctx.fillStyle = '#99984D';
            const barSpacing = Math.max(20, wall.h / 3);
            for (let j = barSpacing; j < wall.h; j += barSpacing) {
                ctx.fillRect(wall.x, wall.y + j, wall.w, 3);
            }
        });

        // Draw goal — golden bone
        const goal = goalRef.current;
        // Glow
        ctx.fillStyle = 'rgba(215, 201, 95, 0.2)';
        ctx.beginPath();
        ctx.arc(goal.x + goal.w / 2, goal.y + goal.h / 2, 40, 0, Math.PI * 2);
        ctx.fill();

        // Bone shape
        const boneX = goal.x + goal.w / 2;
        const boneY = goal.y + goal.h / 2;
        ctx.fillStyle = '#e8e3d8';
        // Center bar
        ctx.fillRect(boneX - 12, boneY - 4, 24, 8);
        // Left knobs
        ctx.beginPath();
        ctx.arc(boneX - 12, boneY - 4, 6, 0, Math.PI * 2);
        ctx.arc(boneX - 12, boneY + 4, 6, 0, Math.PI * 2);
        ctx.fill();
        // Right knobs
        ctx.beginPath();
        ctx.arc(boneX + 12, boneY - 4, 6, 0, Math.PI * 2);
        ctx.arc(boneX + 12, boneY + 4, 6, 0, Math.PI * 2);
        ctx.fill();
        // Sparkle
        ctx.fillStyle = '#e1ff01';
        ctx.font = '14px sans-serif';
        ctx.fillText('✨', goal.x + goal.w / 2 - 6, goal.y - 15);
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText('🦴 BEWIJS', goal.x - 8, goal.y - 25);

        const p = playerRef.current;
        const gravity = variablesRef.current['gravity'] || 0.5;

        // Physics
        // Reset horizontal velocity (blocks must apply it every frame)
        p.vx = 0;

        // Execute blocks (will set actions in the queue)
        if (isPlaying) {
            const gameCtx = createGameContext();

            // Only execute blocks if no actions are pending in the queue
            if (p.actionQueue.length === 0) {
                const executor = createExecutor(blocks, gameCtx);
                executor.execute();
            }

            // Process current action (first in queue)
            if (p.actionQueue.length > 0) {
                const currentAction = p.actionQueue[0];
                if (currentAction.type === 'move') {
                    const moveSpeed = currentAction.speed;
                    const distanceToMove = Math.min(currentAction.remainingDistance, moveSpeed);

                    p.vx = currentAction.directionX * distanceToMove;

                    // Only override vertical velocity if we are explicitly moving vertically
                    if (currentAction.directionY !== 0) {
                        p.vy = currentAction.directionY * distanceToMove;
                    }

                    currentAction.remainingDistance -= distanceToMove;

                    if (currentAction.remainingDistance <= 0) {
                        p.actionQueue.shift(); // Remove completed action, next one starts
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
                setScore((s: number) => s + 500);
                log('🦴 GEVONDEN! Robbie heeft het bewijs gevonden!');
            }
        }

        // Bounds
        p.x = Math.max(0, Math.min(width - 32, p.x));

        // === Draw Robbie (pixel art detective dog) ===
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);

        // Shadow under dog
        ctx.fillStyle = 'rgba(8, 40, 59,0.4)';
        ctx.beginPath();
        ctx.ellipse(px + 16, height - 38, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail (behind body)
        ctx.strokeStyle = '#e1ff01';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (p.facingRight) {
            ctx.moveTo(px + 4, py + 22);
            ctx.quadraticCurveTo(px - 8, py + 10, px - 2, py + 6);
        } else {
            ctx.moveTo(px + 28, py + 22);
            ctx.quadraticCurveTo(px + 40, py + 10, px + 34, py + 6);
        }
        ctx.stroke();
        ctx.lineCap = 'butt';

        // Body (golden brown)
        ctx.fillStyle = '#99984D';
        ctx.fillRect(px + 4, py + 18, 24, 20);

        // Belly (lighter)
        ctx.fillStyle = '#e8e3d8';
        ctx.fillRect(px + 8, py + 30, 16, 6);

        // Head
        ctx.fillStyle = '#e1ff01';
        ctx.fillRect(px + 4, py + 2, 24, 18);

        // Ears (floppy, hanging down)
        ctx.fillStyle = '#99984D';
        if (p.facingRight) {
            // Back ear
            ctx.fillRect(px + 2, py, 7, 14);
            // Front ear (slightly forward)
            ctx.fillRect(px + 24, py + 2, 7, 12);
        } else {
            ctx.fillRect(px + 24, py, 7, 14);
            ctx.fillRect(px + 1, py + 2, 7, 12);
        }

        // Eye
        ctx.fillStyle = '#202023';
        if (p.facingRight) {
            ctx.fillRect(px + 20, py + 7, 4, 4);
            // Eye shine
            ctx.fillStyle = '#fff';
            ctx.fillRect(px + 21, py + 7, 2, 2);
        } else {
            ctx.fillRect(px + 8, py + 7, 4, 4);
            ctx.fillStyle = '#fff';
            ctx.fillRect(px + 9, py + 7, 2, 2);
        }

        // Nose (round black nose)
        ctx.fillStyle = '#202023';
        ctx.beginPath();
        if (p.facingRight) {
            ctx.arc(px + 30, py + 14, 3, 0, Math.PI * 2);
        } else {
            ctx.arc(px + 2, py + 14, 3, 0, Math.PI * 2);
        }
        ctx.fill();

        // Snout highlight
        ctx.fillStyle = '#e1ff01';
        if (p.facingRight) {
            ctx.fillRect(px + 24, py + 11, 6, 4);
        } else {
            ctx.fillRect(px + 2, py + 11, 6, 4);
        }

        // Legs
        ctx.fillStyle = '#99984D';
        ctx.fillRect(px + 6, py + 38, 6, 10);
        ctx.fillRect(px + 20, py + 38, 6, 10);

        // Paws
        ctx.fillStyle = '#99984D';
        ctx.fillRect(px + 5, py + 45, 8, 3);
        ctx.fillRect(px + 19, py + 45, 8, 3);

        // UI
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(`Score: ${progress.score}`, 16, 28);

        // Paw print icon next to score
        ctx.font = '14px sans-serif';
        ctx.fillText('🐾', width - 50, 28);

        // Goal indicator arrow when not visible
        if (goal.x > width - 100) {
            ctx.fillStyle = '#e1ff01';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText('🦴 →', width - 60, 28);
        }

        // Challenge indicator
        if (currentChallenge) {
            ctx.fillStyle = '#e1ff01';
            ctx.font = 'bold 12px Inter, sans-serif';
            ctx.fillText(`🔍 ${currentChallenge.title}`, 16, height - 52);
        }

        // Victory overlay
        if (reachedGoal) {
            ctx.fillStyle = 'rgba(95, 148, 125, 0.3)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🐾 GEVONDEN!', width / 2, height / 2);
            ctx.font = '16px Inter, sans-serif';
            ctx.fillText('Robbie heeft het bewijs gevonden!', width / 2, height / 2 + 30);
            ctx.textAlign = 'left';
        }

        if (isPlaying && currentChallenge && !challengeComplete) {
            const gameCtx = createGameContext();
            if (currentChallenge.check(gameCtx, blocks)) {
                setChallengeComplete(true);
                setSuccessPulse(true);
                setTimeout(() => setSuccessPulse(false), 2000);
                log(`🏆 Uitdaging voltooid: ${currentChallenge.title}!`);
                setScore((s: number) => s + 100);
            }
        }

        if (isPlaying) {
            reqRef.current = requestAnimationFrame(update);
        }
    }, [isPlaying, blocks, progress.score, currentChallenge, challengeComplete, createGameContext, log, reachedGoal]);

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
            log('🐾 Robbie is wakker!');
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
        playerRef.current = { x: 50, y: 512, vx: 0, vy: 0, grounded: true, facingRight: true, actionQueue: [] };
        enemiesRef.current = [];
        variablesRef.current = { gravity: 0.5, speed: 5 };
        BlockExecutor.reset(); // Reset executor state so when_game_starts can trigger again
        setScore(() => 0);
        setIsPlaying(false);
        setChallengeComplete(false);
        setReachedGoal(false);
        log('🔄 Robbie gaat terug naar start');
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

        if (progress.currentChallengeIndex < CHALLENGES.length - 1) {
            setProgress(prev => ({
                ...prev,
                currentChallengeIndex: prev.currentChallengeIndex + 1,
                isHardMode: isFast,
            }));
            setChallengeComplete(false);
            setShowHint(false);

            handleReset();

            if (isFast) {
                log(`🚀 Wow! ${duration.toFixed(1)}s is supersnel! Level ${progress.currentChallengeIndex + 2} wordt MOEILIJKER!`);
            } else {
                log(`💪 Goed bezig, Robbie! Op naar het volgende level!`);
            }
        } else {
            // All challenges complete!
            log('🎉 Alle uitdagingen voltooid! Robbie is de beste speurhond!');
            setShowConclusion(true);
        }
    }, [progress.currentChallengeIndex, handleReset, log, setProgress]);

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
        <div className="bg-duck-bg h-dvh flex flex-col text-duck-ink font-['Outfit',system-ui,sans-serif] relative overflow-y-auto">

            {showConclusion && (
                <MissionConclusion
                    title="🏆 Missie Voltooid: Robbie de Speurhond!"
                    description="Super gedaan! Je hebt Robbie geprogrammeerd om alle bewijzen te vinden. Je bent nu een echte Game Director!"
                    aiConcept={{
                        title: "Wie is de baas?",
                        text: "In deze missie was JIJ de baas over Robbie, net zoals programmeurs de baas zijn over AI. We moeten AI (zoals ChatGPT) duidelijke instructies geven, zodat het precies doet wat we willen en altijd veilig blijft. Dat noemen we 'AI Alignment'."
                    }}
                    onExit={progress.reflectie.trim().length >= 10 ? () => {
                        clearSave();
                        setShowConclusion(false);
                        onComplete(true);
                    } : undefined}
                >
                    {/* Reflectie */}
                    <div className="bg-duck-bg rounded-2xl p-4 border border-duck-coral/20 text-left space-y-3 mt-6">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-duck-coral" />
                            <p className="text-xs font-black uppercase tracking-widest text-duck-coral" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Reflectie</p>
                        </div>
                        <p className="text-xs text-duck-muted" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Wat heb je geleerd in deze missie? Waar zou je dit in het dagelijks leven tegenkomen?</p>
                        <textarea
                            value={progress.reflectie}
                            onChange={e => setProgress(prev => ({ ...prev, reflectie: e.target.value }))}
                            placeholder="Wat heb je geleerd? Waar kom je dit nog meer tegen?"
                            className="w-full p-3 rounded-xl border-2 border-duck-line bg-white text-sm resize-none focus:border-duck-coral focus:outline-none transition-all duration-300"
                            style={{ minHeight: '80px', fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                        {progress.reflectie.trim().length < 10 && (
                            <p className="text-[10px] text-duck-line" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Schrijf minimaal 10 tekens om de missie af te ronden</p>
                        )}
                    </div>
                </MissionConclusion>
            )}

            {/* Header */}
            <header className="bg-white border-b border-duck-line px-3 md:px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shrink-0 min-h-[4rem]">
                <div className="flex w-full md:w-auto items-center gap-3 md:gap-6">
                    <button
                        onClick={onBack}
                        className="flex shrink-0 items-center gap-2 text-duck-muted hover:text-duck-coral transition-all duration-300 font-bold text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft size={16} /> Terug
                    </button>
                    <div className="hidden md:block h-8 w-px bg-duck-line"></div>
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="p-2 bg-duck-coral/10 text-duck-coral rounded-xl">
                            <Settings2 size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 font-['Newsreader',Georgia,serif] text-duck-ink">
                                Game Director <Sparkles size={14} className="text-duck-coral" />
                            </h1>
                            <p className="text-[10px] text-duck-muted uppercase tracking-widest font-bold">
                                Programmeer Robbie de Speurhond
                            </p>
                        </div>
                    </div>
                </div>

                {/* Challenge Banner - Integrated in Header */}
                {currentChallenge && (
                    <div className={`w-full md:flex-1 md:mx-8 px-3 md:px-4 py-2 rounded-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 transition-all duration-500 ${challengeComplete
                        ? (successPulse ? 'bg-duck-ink scale-105 shadow-[0_0_30px_rgba(95, 148, 125,0.4)]' : 'bg-duck-ink/10 border border-duck-ink/30')
                        : 'bg-duck-bg border border-duck-line'
                        }`}>
                        <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-4">
                            <div className="flex items-center gap-2 shrink-0">
                                {challengeComplete ? (
                                    <Trophy size={18} className="text-duck-ink" />
                                ) : (
                                    <span className="text-lg">🔍</span>
                                )}
                                <span className="font-bold text-xs text-duck-muted uppercase tracking-widest">
                                    Puzzel {progress.currentChallengeIndex + 1}/{CHALLENGES.length}
                                </span>
                                <div className="flex items-center gap-1 ml-1">
                                    {CHALLENGES.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                i < progress.currentChallengeIndex
                                                    ? 'bg-duck-ink'
                                                    : i === progress.currentChallengeIndex
                                                        ? (challengeComplete ? 'bg-duck-ink scale-125' : 'bg-duck-coral scale-125')
                                                        : 'bg-duck-line'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <h3 className="font-bold text-sm text-duck-ink min-w-0 font-['Newsreader',Georgia,serif]">
                                {currentChallenge.title}
                            </h3>
                            <span
                                className="hidden xl:inline text-xs text-duck-muted border-l border-duck-line pl-4 whitespace-normal leading-tight max-w-2xl"
                                title={currentChallenge.description}
                            >
                                {currentChallenge.description}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 lg:ml-4">
                            {challengeComplete ? (
                                <button
                                    onClick={handleNextChallenge}
                                    className="px-3 py-1.5 bg-duck-ink hover:bg-duck-ink text-white rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-1 shadow-lg shadow-duck-ink/20"
                                >
                                    Volgende <ArrowLeft size={12} className="rotate-180" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center gap-1 text-[10px] text-duck-coral hover:text-duck-coral font-bold px-2 py-1.5 bg-white hover:bg-duck-bg rounded-full transition-all duration-300 border border-duck-coral/20"
                                >
                                    <HelpCircle size={12} /> {showHint ? 'Verberg Hint' : 'Hint'}
                                </button>
                            )}

                            {/* 'I am stuck' button - Always visible/accessible helper */}
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="flex items-center gap-1 text-[10px] text-white font-bold px-3 py-1.5 bg-duck-coral hover:bg-duck-coral rounded-full transition-all duration-300 shadow-lg shadow-duck-coral/20 focus-visible:ring-2 focus-visible:ring-duck-coral"
                            >
                                <Sparkles size={12} /> Hulp nodig?
                            </button>
                        </div>
                    </div>
                )}

            </header>

            <MissionGoalBanner goal={MISSION_GOAL} compact className="mx-4 my-2 shrink-0" />

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
                    gameStatus: { isPlaying, reachedGoal, challengeComplete, score: progress.score }
                }}
            />

            {showHint && !challengeComplete && currentChallenge && (
                <div className="bg-duck-coral/10 border-b border-duck-coral/20 px-6 py-2 text-center text-xs font-medium text-duck-coral animate-in slide-in-from-top-2">
                    💡 <span className="font-bold">HINT:</span> {currentChallenge.hint}
                </div>
            )}

            {/* Mobile Tab Bar */}
            <div className="lg:hidden flex border-b border-duck-line bg-white shrink-0">
                {([
                    { key: 'blocks' as MobileTab, label: 'Blokken', icon: <Puzzle size={16} /> },
                    { key: 'code' as MobileTab, label: 'Code', icon: <Code2 size={16} /> },
                    { key: 'game' as MobileTab, label: 'Game', icon: <Gamepad2 size={16} /> },
                ]).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setMobileTab(tab.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            mobileTab === tab.key
                                ? 'text-duck-coral border-b-2 border-duck-coral bg-duck-coral/5'
                                : 'text-duck-muted hover:text-duck-ink'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area - Full Height Grid */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* Left Panel: Block Palette */}
                <div className={`${mobileTab === 'blocks' ? 'flex' : 'hidden'} lg:flex w-full lg:w-64 bg-duck-bg border-b lg:border-b-0 lg:border-r border-duck-line flex-col shrink-0 z-10 p-2 flex-1 lg:flex-initial lg:max-h-none overflow-y-auto`}>
                    <BlockPalette onDragStart={setDraggingBlock} onAddBlock={handleAddBlock} />
                </div>

                {/* Middle Panel: Workspace */}
                <div className={`${mobileTab === 'code' ? 'flex' : 'hidden'} lg:flex flex-1 bg-duck-bg relative flex-col min-w-0 p-2`}>
                    <div className="absolute inset-0 bg-[linear-gradient(#E7D8BD_1px,transparent_1px),linear-gradient(90deg,#E7D8BD_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none"></div>
                    <CodeWorkspace
                        blocks={blocks}
                        onBlocksChange={setBlocks}
                        onRun={handleTogglePlay}
                        onReset={handleReset}
                        isRunning={isPlaying}
                    />
                </div>

                {/* Right Panel: Game Preview (Larger!) */}
                <div className={`${mobileTab === 'game' ? 'flex' : 'hidden'} lg:flex w-full lg:w-[40%] lg:min-w-[320px] lg:max-w-[800px] bg-white border-t lg:border-t-0 lg:border-l border-duck-line flex-col shadow-2xl z-20`}>
                    <div className="p-4 bg-duck-bg border-b border-duck-line flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-duck-ink animate-pulse"></div>
                            <span className="text-xs font-bold text-duck-muted uppercase tracking-wider">Game Preview</span>
                        </div>
                        <div className="text-xs font-mono text-duck-muted">
                            {canvasRef.current ? `${canvasRef.current.width}x${canvasRef.current.height}` : '800x600'}
                        </div>
                    </div>

                    <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto bg-duck-bg relative">
                        {/* Game Screen Container - Maintains Aspect Ratio but fills space */}
                        <div className="flex-1 relative bg-duck-ink rounded-2xl overflow-hidden shadow-2xl border-4 border-duck-line ring-1 ring-black/5 group">
                            {/* Canvas needs to respond to size */}
                            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#0B453F_0%,#08283B_100%)]">
                                <canvas
                                    ref={canvasRef}
                                    width={800}
                                    height={600}
                                    className="max-w-full max-h-full object-contain image-pixelated shadow-lg"
                                    style={{ aspectRatio: '4/3' }}
                                />
                            </div>

                            {/* Overlay Controls (Play/Stop) on top of Game - always visible on touch, hover on desktop */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full border border-duck-line shadow-xl opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={handleTogglePlay}
                                    className={`p-3 rounded-full transition-all duration-300 active:scale-95 ${isPlaying
                                        ? 'bg-lab-coral/20 text-lab-muted hover:bg-lab-coral hover:text-white'
                                        : 'bg-duck-coral/20 text-duck-coral hover:bg-duck-coral hover:text-white'}`}
                                >
                                    {isPlaying ? <RotateCcw size={20} /> : <Play size={20} fill="currentColor" />}
                                </button>
                            </div>
                        </div>

                        {/* Console / Logs */}
                        <div className="h-32 bg-white rounded-2xl border border-duck-line flex flex-col shrink-0 overflow-hidden">
                            <div className="px-3 py-2 bg-duck-bg border-b border-duck-line flex justify-between items-center">
                                <span className="text-[10px] font-bold text-duck-muted uppercase tracking-widest">Systeem Console</span>
                                <button onClick={() => setLogs([])} className="text-[10px] text-duck-muted hover:text-duck-coral transition-all duration-300">Wis</button>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                                {logs.length === 0 ? (
                                    <div className="text-duck-muted italic px-2">Wachten op input...</div>
                                ) : (
                                    logs.map((l, i) => (
                                        <div key={i} className="flex gap-2 text-duck-ink hover:bg-duck-bg rounded px-2 py-0.5">
                                            <span className="text-duck-muted select-none">&gt;</span>
                                            <span>{l}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar with Run/Reset */}
            <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white border-t border-duck-line shrink-0 gap-2">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-duck-muted hover:text-duck-coral bg-duck-bg border border-duck-line font-bold text-xs transition-all duration-300"
                >
                    <RotateCcw size={14} /> Reset
                </button>
                <div className="flex items-center gap-2 text-xs text-duck-muted font-bold">
                    {blocks.length} blok{blocks.length !== 1 ? 'ken' : ''}
                </div>
                <button
                    onClick={handleTogglePlay}
                    disabled={blocks.length === 0}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-300 ${isPlaying
                        ? 'bg-lab-coral hover:bg-lab-coral hover:text-white'
                        : 'bg-duck-coral hover:bg-duck-coral disabled:bg-duck-line disabled:text-duck-muted'
                    }`}
                >
                    <Play size={14} fill="currentColor" />
                    {isPlaying ? 'STOP' : 'START'}
                </button>
            </div>
        </div>
    );
};
