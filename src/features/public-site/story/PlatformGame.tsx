import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { GameSettings, GameStatus } from './gameProgrammerState';
import {
    GROUND_Y,
    OBSTACLE_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
    PLAYER_X,
    VIEW_HEIGHT,
    VIEW_WIDTH,
    advancePlatformFrame,
    createInitialPlatformFrame,
    jumpPlatformPlayer,
    type PlatformFrame,
} from './platformGameEngine';

interface PlatformGameProps {
    settings: GameSettings;
    status: GameStatus;
    runId: number;
    onGameOver: (score: number) => void;
    onRestart: () => void;
}

export function PlatformGame({
    settings,
    status,
    runId,
    onGameOver,
    onRestart,
}: PlatformGameProps) {
    const [frame, setFrame] = useState<PlatformFrame>(() => createInitialPlatformFrame());
    const frameRef = useRef(frame);
    const onGameOverRef = useRef(onGameOver);
    const playfieldRef = useRef<HTMLDivElement>(null);
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        onGameOverRef.current = onGameOver;
    }, [onGameOver]);

    useEffect(() => {
        const initial = createInitialPlatformFrame();
        frameRef.current = initial;
        setFrame(initial);
    }, [runId]);

    useEffect(() => {
        if (status !== 'playing') return;

        let current = createInitialPlatformFrame();
        let animationFrame = 0;
        let previousTime = performance.now();
        let stopped = false;
        frameRef.current = current;
        setFrame(current);

        const tick = (time: number) => {
            if (stopped) return;
            const deltaSeconds = (time - previousTime) / 1000;
            previousTime = time;
            current = advancePlatformFrame(current, deltaSeconds, settings);
            frameRef.current = current;
            setFrame(current);

            if (current.collision) {
                stopped = true;
                onGameOverRef.current(current.score);
                return;
            }
            animationFrame = requestAnimationFrame(tick);
        };

        animationFrame = requestAnimationFrame(tick);
        playfieldRef.current?.focus({ preventScroll: true });

        return () => {
            stopped = true;
            cancelAnimationFrame(animationFrame);
        };
    }, [runId, settings, status]);

    const jump = () => {
        if (status !== 'playing') return;
        const next = jumpPlatformPlayer(frameRef.current, settings.jumpForce);
        frameRef.current = next;
        setFrame(next);
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.focus({ preventScroll: true });
        jump();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.code !== 'Space') return;
        event.preventDefault();
        jump();
    };

    const playerTop = frame.playerY;

    return (
        <div className="min-w-0">
            <div
                ref={playfieldRef}
                role="application"
                tabIndex={0}
                aria-label="Speelveld van Game Programmeur"
                aria-keyshortcuts="Space"
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                className="relative min-w-0 max-w-full touch-manipulation overflow-hidden rounded-[1.5rem] border-2 border-duck-ink bg-[#f7f4ea] shadow-[6px_7px_0_#202023] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/35"
            >
                <svg
                    viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
                    className="block h-auto w-full select-none"
                    aria-hidden="true"
                >
                    <defs>
                        <linearGradient id="game-sky" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dcefe5" />
                            <stop offset="72%" stopColor="#f7f4ea" />
                        </linearGradient>
                        <pattern id="game-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M32 0H0V32" fill="none" stroke="#202023" strokeOpacity="0.055" strokeWidth="1" />
                        </pattern>
                    </defs>

                    <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#game-sky)" />
                    <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="url(#game-grid)" />

                    <g className={reduceMotion ? '' : 'motion-safe:animate-pulse'} opacity="0.72">
                        <path d="M58 92h106c16 0 22-21 8-29-9-5-19-2-25 5-6-18-31-21-41-6-14-8-34 3-33 20-8 0-15 4-15 10Z" fill="#fff" stroke="#202023" strokeWidth="3" />
                        <path d="M398 68h126c14 0 20-18 8-26-8-5-18-3-23 4-7-17-31-18-39-3-16-9-37 3-35 20-17-3-29 5-37 5Z" fill="#fff" stroke="#202023" strokeWidth="3" />
                    </g>

                    <path d="M0 268c78-38 130-6 194-32 82-34 158-15 222 7 69 24 132-5 224-25v74H0Z" fill="#b9d8c4" opacity="0.88" />

                    <rect x="0" y={GROUND_Y} width={VIEW_WIDTH} height="18" fill="#5F947D" stroke="#202023" strokeWidth="3" />
                    <rect x="0" y={GROUND_Y + 18} width={VIEW_WIDTH} height={VIEW_HEIGHT - GROUND_Y - 18} fill="#e7d8bd" />
                    {Array.from({ length: 14 }, (_, index) => (
                        <path key={index} d={`M${index * 52 - 10} ${GROUND_Y + 22}l28 28M${index * 52 + 18} ${GROUND_Y + 22}l28 28`} stroke="#202023" strokeOpacity="0.12" strokeWidth="4" />
                    ))}

                    {frame.obstacles.map((obstacle) => {
                        const top = GROUND_Y - obstacle.height;
                        return (
                            <g key={obstacle.id} transform={`translate(${obstacle.x} 0)`}>
                                <rect x="0" y={top} width={OBSTACLE_WIDTH} height={obstacle.height} rx="4" fill="#5F947D" stroke="#202023" strokeWidth="4" />
                                <rect x="-6" y={top} width={OBSTACLE_WIDTH + 12} height="17" rx="4" fill="#e1ff01" stroke="#202023" strokeWidth="4" />
                                <path d={`M10 ${top + 23}v${Math.max(8, obstacle.height - 31)}`} stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
                            </g>
                        );
                    })}

                    <g transform={`translate(${PLAYER_X} ${playerTop})`}>
                        <rect x="3" y="15" width={PLAYER_WIDTH - 6} height={PLAYER_HEIGHT - 15} rx="8" fill={settings.playerColor} stroke="#202023" strokeWidth="4" />
                        <circle cx={PLAYER_WIDTH / 2} cy="13" r="13" fill="#f3cfa9" stroke="#202023" strokeWidth="4" />
                        <path d="M6 10c4-14 24-17 30 0Z" fill={settings.playerColor} stroke="#202023" strokeWidth="4" strokeLinejoin="round" />
                        <circle cx="15" cy="13" r="2" fill="#202023" />
                        <circle cx="24" cy="13" r="2" fill="#202023" />
                        <path d="M9 51v8M29 51v8" stroke="#202023" strokeWidth="5" strokeLinecap="round" />
                    </g>

                    <g transform="translate(22 20)">
                        <rect width="150" height="42" rx="14" fill="#202023" />
                        <text x="18" y="27" fill="#fff" fontSize="17" fontWeight="800" fontFamily="monospace">SCORE {frame.score}</text>
                    </g>
                    <g transform="translate(478 20)">
                        <rect width="140" height="42" rx="14" fill="#e1ff01" stroke="#202023" strokeWidth="3" />
                        <text x="70" y="27" textAnchor="middle" fill="#202023" fontSize="13" fontWeight="900" fontFamily="sans-serif">SUPER CODE JUMPER</text>
                    </g>
                </svg>

                {status === 'ready' && (
                    <div className="absolute inset-0 grid place-items-center bg-duck-ink/38 px-5 text-center backdrop-blur-[1px]">
                        <div className="max-w-sm rounded-2xl border-2 border-duck-ink bg-white px-5 py-4 shadow-[5px_6px_0_#202023]">
                            <Play className="mx-auto size-6 text-duck-error" aria-hidden="true" />
                            <p className="mt-2 text-sm font-black text-duck-ink">Kies eerst een codewijziging</p>
                            <p className="mt-1 text-xs font-semibold leading-5 text-duck-ink/55">Start daarna de game en spring over de pijpen.</p>
                        </div>
                    </div>
                )}

                {status === 'game-over' && (
                    <div className="absolute inset-0 grid place-items-center bg-duck-ink/62 px-5 text-center backdrop-blur-[2px]">
                        <div className="max-w-sm rounded-2xl border-2 border-duck-ink bg-white px-5 py-4 shadow-[5px_6px_0_#e1ff01]">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-duck-error">Game over</p>
                            <p className="mt-1 font-display text-4xl leading-none text-duck-ink">Score {frame.score}</p>
                            <button
                                type="button"
                                onPointerDown={(event) => event.stopPropagation()}
                                onClick={onRestart}
                                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-duck-ink px-5 text-xs font-black text-duck-acid focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-duck-error/35"
                            >
                                <RotateCcw className="size-4" aria-hidden="true" /> Speel opnieuw
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-3 text-center text-xs font-extrabold text-duck-ink/58">
                Tik of druk op spatie om te springen
            </p>
        </div>
    );
}
