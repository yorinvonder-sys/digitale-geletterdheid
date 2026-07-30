import React, { useCallback, useEffect, useRef, useState } from 'react';
import { describeSpec } from '@/features/public-site/game-lab/gameSpec';
import type { GameSpec } from '@/features/public-site/game-lab/gameSpec';

/**
 * Speelbare canvas-runner die volledig door een `GameSpec` wordt aangestuurd.
 *
 * De spec komt uit `parseGameSpec` en is daar al gevalideerd; hier wordt niets
 * uit modeluitvoer als code behandeld. Kleuren gaan naar `fillStyle`, getallen
 * naar de physics, enums naar een `switch`. Meer niet.
 */

const WORLD_W = 480;
const WORLD_H = 270;
const GROUND_Y = 214;
const PLAYER_X = 64;
const PLAYER_SIZE = 22;
const STEP = 1 / 60;
const MAX_FRAME_DT = 0.1;
const GRAVITY_SCALE = 52;
const JUMP_SCALE = 15.5;
const BASE_SCROLL = 46;
const FLASH_MS = 900;

type Status = 'idle' | 'running' | 'won' | 'lost';

interface Obstacle {
    x: number;
    w: number;
    h: number;
}

interface Collectible {
    x: number;
    y: number;
    taken: boolean;
}

interface World {
    playerY: number;
    velocity: number;
    onGround: boolean;
    jumpsLeft: number;
    shieldLeft: number;
    obstacles: Obstacle[];
    collectibles: Collectible[];
    score: number;
    elapsed: number;
    distance: number;
    invulnerable: number;
    flashUntil: number;
    /** Geseed, zodat ook het recyclen van obstakels reproduceerbaar blijft. */
    random: () => number;
}

export interface PlayableGameProps {
    spec: GameSpec;
    reduceMotion: boolean;
    onOutcome?: (outcome: 'won' | 'lost', score: number) => void;
    className?: string;
}

/** Deterministische PRNG — hetzelfde spec geeft hetzelfde level. */
function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hashString(value: string): number {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function scrollSpeed(spec: GameSpec): number {
    const turbo = spec.powerup === 'turbo' ? 1.25 : 1;
    return BASE_SCROLL * (0.6 + spec.speed * 0.28) * turbo;
}

function buildWorld(spec: GameSpec): World {
    const random = mulberry32(hashString(`${spec.theme}|${spec.obstacleCount}|${spec.collectibleCount}|${spec.speed}|${spec.obstacleType}`));
    const target = spec.winCondition.type === 'score' ? spec.winCondition.target : spec.collectibleCount;
    // Minstens zoveel items als nodig om te kunnen winnen, anders is het doel
    // onhaalbaar en voelt de game kapot in plaats van moeilijk.
    const collectibleTotal = Math.max(spec.collectibleCount, spec.winCondition.type === 'score' ? target : 0);

    const obstacles: Obstacle[] = [];
    let cursor = WORLD_W + 60;
    for (let i = 0; i < spec.obstacleCount; i += 1) {
        const h = 20 + Math.round(random() * 16);
        obstacles.push({ x: cursor, w: 16 + Math.round(random() * 10), h });
        cursor += 170 + random() * 130;
    }

    // Hoogte van de items volgt uit de werkelijke sprongfysica. Met een vaste
    // 34-86px kon een geldige spec (bv. jumpHeight 6 met gravity 2, piek ~12px)
    // een spel opleveren dat rekenkundig onwinbaar was: de items hingen buiten
    // bereik terwijl je ze allemaal moest pakken.
    const peak = (spec.jumpHeight * JUMP_SCALE) ** 2 / (2 * spec.gravity * GRAVITY_SCALE * 3.4);
    const jumps = spec.powerup === 'dubbelsprong' ? 2 : 1;
    const reach = Math.max(8, Math.min(120, peak * jumps * 0.8));

    const collectibles: Collectible[] = [];
    cursor = WORLD_W + 130;
    for (let i = 0; i < collectibleTotal; i += 1) {
        collectibles.push({
            x: cursor,
            y: GROUND_Y - PLAYER_SIZE - Math.round(random() * reach),
            taken: false,
        });
        cursor += 140 + random() * 110;
    }

    return {
        playerY: GROUND_Y - PLAYER_SIZE,
        velocity: 0,
        onGround: true,
        jumpsLeft: spec.powerup === 'dubbelsprong' ? 2 : 1,
        shieldLeft: spec.powerup === 'schild' ? 1 : 0,
        obstacles,
        collectibles,
        score: 0,
        elapsed: 0,
        distance: 0,
        invulnerable: 0,
        flashUntil: 0,
        random,
    };
}

export const PlayableGame: React.FC<PlayableGameProps> = ({ spec, reduceMotion, onOutcome, className }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const specRef = useRef<GameSpec>(spec);
    const worldRef = useRef<World>(buildWorld(spec));
    const rafRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    const accumulatorRef = useRef<number>(0);
    const jumpQueuedRef = useRef<boolean>(false);
    const statusRef = useRef<Status>('idle');
    const scoreRef = useRef<number>(0);
    const onOutcomeRef = useRef(onOutcome);

    const [status, setStatus] = useState<Status>('idle');
    const [score, setScore] = useState(0);
    const [inView, setInView] = useState(true);
    const [pageVisible, setPageVisible] = useState(true);

    useEffect(() => { onOutcomeRef.current = onOutcome; }, [onOutcome]);
    useEffect(() => { statusRef.current = status; }, [status]);

    /* ── Tekenen ──────────────────────────────────────────────────── */

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const s = specRef.current;
        const w = worldRef.current;
        const now = typeof performance !== 'undefined' ? performance.now() : 0;

        ctx.fillStyle = s.sky;
        ctx.fillRect(0, 0, WORLD_W, WORLD_H);

        if (s.background.stars) {
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            for (let i = 0; i < 26; i += 1) {
                const x = (i * 79) % WORLD_W;
                const y = (i * 37) % 130;
                ctx.fillRect(x, y, i % 3 === 0 ? 2 : 1, i % 3 === 0 ? 2 : 1);
            }
        }
        if (s.background.moon) {
            ctx.fillStyle = 'rgba(255,255,255,0.88)';
            ctx.beginPath();
            ctx.arc(404, 52, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = s.sky;
            ctx.beginPath();
            ctx.arc(394, 46, 18, 0, Math.PI * 2);
            ctx.fill();
        }
        if (s.background.clouds) {
            ctx.fillStyle = 'rgba(255,255,255,0.24)';
            for (let i = 0; i < 3; i += 1) {
                const x = ((i * 190 - w.distance * 0.12) % (WORLD_W + 140)) + 70;
                const y = 40 + i * 26;
                ctx.beginPath();
                ctx.ellipse(x, y, 40, 14, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        if (s.background.mountains) {
            ctx.fillStyle = 'rgba(0,0,0,0.20)';
            for (let i = 0; i < 4; i += 1) {
                const x = ((i * 150 - w.distance * 0.28) % (WORLD_W + 200)) + 40;
                ctx.beginPath();
                ctx.moveTo(x - 76, GROUND_Y);
                ctx.lineTo(x, GROUND_Y - 88);
                ctx.lineTo(x + 76, GROUND_Y);
                ctx.closePath();
                ctx.fill();
            }
        }
        if (s.background.trees) {
            ctx.fillStyle = 'rgba(0,0,0,0.26)';
            for (let i = 0; i < 6; i += 1) {
                const x = ((i * 96 - w.distance * 0.5) % (WORLD_W + 120)) + 30;
                ctx.fillRect(x - 3, GROUND_Y - 30, 6, 30);
                ctx.beginPath();
                ctx.arc(x, GROUND_Y - 38, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.fillStyle = s.ground;
        ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);
        ctx.fillStyle = 'rgba(255,255,255,0.14)';
        ctx.fillRect(0, GROUND_Y, WORLD_W, 3);

        drawObstacles(ctx, s, w);
        drawCollectibles(ctx, s, w);
        drawPlayer(ctx, s, w);
        drawHud(ctx, s, w, now);
    }, []);

    /* ── Simulatie ────────────────────────────────────────────────── */

    const finish = useCallback((outcome: 'won' | 'lost') => {
        setStatus(outcome);
        statusRef.current = outcome;
        scoreRef.current = worldRef.current.score;
        setScore(worldRef.current.score);
        onOutcomeRef.current?.(outcome, worldRef.current.score);
    }, []);

    const update = useCallback((dt: number) => {
        const s = specRef.current;
        const w = worldRef.current;

        w.elapsed += dt;
        const speed = scrollSpeed(s);
        w.distance += speed * dt;

        if (jumpQueuedRef.current) {
            jumpQueuedRef.current = false;
            if (w.jumpsLeft > 0) {
                w.velocity = -s.jumpHeight * JUMP_SCALE;
                w.jumpsLeft -= 1;
                w.onGround = false;
            }
        }

        w.velocity += s.gravity * GRAVITY_SCALE * dt * 3.4;
        w.playerY += w.velocity * dt;

        const floor = GROUND_Y - PLAYER_SIZE;
        if (w.playerY >= floor) {
            w.playerY = floor;
            w.velocity = 0;
            w.onGround = true;
            w.jumpsLeft = s.powerup === 'dubbelsprong' ? 2 : 1;
        }
        if (w.playerY < 0) {
            w.playerY = 0;
            w.velocity = 0;
        }
        if (w.invulnerable > 0) w.invulnerable -= dt;

        // Obstakels: verplaatsen, recyclen, botsing.
        const trailing = Math.max(...w.obstacles.map((o) => o.x), WORLD_W);
        for (const obstacle of w.obstacles) {
            obstacle.x -= speed * dt;
            if (obstacle.x + obstacle.w < -20) {
                obstacle.x = trailing + 170 + w.random() * 130;
            }
            const hit =
                PLAYER_X + PLAYER_SIZE > obstacle.x &&
                PLAYER_X < obstacle.x + obstacle.w &&
                w.playerY + PLAYER_SIZE > GROUND_Y - obstacle.h;

            if (hit && w.invulnerable <= 0) {
                if (w.shieldLeft > 0) {
                    w.shieldLeft -= 1;
                    w.invulnerable = 1.2;
                } else {
                    finish('lost');
                    return;
                }
            }
        }

        // Verzamelbare items.
        const magnet = s.powerup === 'magneet' ? 34 : 14;
        for (const item of w.collectibles) {
            item.x -= speed * dt;
            if (item.taken) continue;
            const dx = Math.abs(item.x - (PLAYER_X + PLAYER_SIZE / 2));
            const dy = Math.abs(item.y - (w.playerY + PLAYER_SIZE / 2));
            if (dx < magnet && dy < magnet) {
                item.taken = true;
                w.score += 1;
            }
        }

        if (s.winCondition.type === 'score') {
            if (w.score >= s.winCondition.target) { finish('won'); return; }
            // Alles opgepakt maar doel niet gehaald zou een doodlopende run zijn.
            if (w.collectibles.length > 0 && w.collectibles.every((c) => c.taken || c.x < -20)) {
                finish('lost');
                return;
            }
        } else if (w.elapsed >= s.winCondition.target) {
            finish('won');
            return;
        }

        // Via een ref, anders zou `update` bij elk punt opnieuw worden gemaakt
        // en de rAF-loop midden in het spel herstarten.
        if (w.score !== scoreRef.current) {
            scoreRef.current = w.score;
            setScore(w.score);
        }
    }, [finish]);

    /* ── Loop ─────────────────────────────────────────────────────── */

    // Bewust GEEN `!reduceMotion` hierin. De game start nooit vanzelf — `status`
    // wordt alleen 'running' door een klik op Start, Opnieuw of Springen. Die
    // expliciete keuze ís de opt-in. Stond `reduceMotion` hier wel in, dan
    // verdween de overlay wel maar draaide de loop nooit: een bevroren spel,
    // terwijl de tekst eronder belooft dat Start hem speelt.
    const shouldRun = status === 'running' && inView && pageVisible;

    useEffect(() => {
        if (!shouldRun) {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            draw();
            return;
        }

        lastTimeRef.current = performance.now();
        accumulatorRef.current = 0;

        const frame = (time: number) => {
            const dt = Math.min((time - lastTimeRef.current) / 1000, MAX_FRAME_DT);
            lastTimeRef.current = time;
            accumulatorRef.current += dt;

            while (accumulatorRef.current >= STEP) {
                accumulatorRef.current -= STEP;
                if (statusRef.current !== 'running') break;
                update(STEP);
            }
            draw();

            if (statusRef.current === 'running') {
                rafRef.current = requestAnimationFrame(frame);
            } else {
                rafRef.current = null;
            }
        };

        rafRef.current = requestAnimationFrame(frame);
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [shouldRun, update, draw]);

    /* ── Canvas-resolutie ─────────────────────────────────────────── */

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = WORLD_W * dpr;
        canvas.height = WORLD_H * dpr;
        const ctx = canvas.getContext('2d');
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
    }, [draw]);

    /* ── Nieuwe spec: level opnieuw opbouwen ──────────────────────── */

    useEffect(() => {
        specRef.current = spec;
        worldRef.current = buildWorld(spec);
        worldRef.current.flashUntil = (typeof performance !== 'undefined' ? performance.now() : 0) + FLASH_MS;
        scoreRef.current = 0;
        setScore(0);
        setStatus((prev) => (prev === 'running' ? 'running' : 'idle'));
        draw();
    }, [spec, draw]);

    /* ── Pauzeren buiten beeld en in een verborgen tab ────────────── */

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || typeof IntersectionObserver !== 'function') return;
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.25 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const onVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    /* ── Besturing ────────────────────────────────────────────────── */

    const jump = useCallback(() => {
        if (statusRef.current === 'running') {
            jumpQueuedRef.current = true;
            return;
        }
        worldRef.current = buildWorld(specRef.current);
        scoreRef.current = 0;
        setScore(0);
        setStatus('running');
        statusRef.current = 'running';
    }, []);

    const restart = useCallback(() => {
        worldRef.current = buildWorld(specRef.current);
        scoreRef.current = 0;
        setScore(0);
        setStatus('running');
        statusRef.current = 'running';
        canvasRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (event.key === 'Escape') {
            event.currentTarget.blur();
            return;
        }
        const isJump = event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W';
        if (!isJump) return;
        // Alleen blokkeren als het canvas focus heeft — daarbuiten moet spatie
        // gewoon de pagina scrollen.
        event.preventDefault();
        jump();
    }, [jump]);

    const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
        event.currentTarget.focus();
        jump();
    }, [jump]);

    const statusMessage =
        status === 'won' ? `Gewonnen! Score ${score}.`
            : status === 'lost' ? `Verloren. Score ${score}.`
                : status === 'running' ? '' : 'Klaar om te starten.';

    return (
        <div className={className}>
            <div ref={wrapperRef} role="group" aria-label="Speelveld" className="relative overflow-hidden rounded-[1.25rem] border border-duck-bg/20 bg-duck-ink">
                <canvas
                    ref={canvasRef}
                    tabIndex={0}
                    aria-label={`Speelveld. ${describeSpec(spec)}`}
                    aria-describedby="game-lab-help"
                    onKeyDown={handleKeyDown}
                    onPointerDown={handlePointerDown}
                    style={{ touchAction: 'manipulation' }}
                    className="block aspect-video w-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                />

                {status !== 'running' && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-duck-ink/55 px-4">
                        <div className="pointer-events-auto text-center">
                            <p className="font-display text-2xl text-duck-bg">
                                {status === 'won' ? 'Gehaald!' : status === 'lost' ? 'Game over' : 'Klaar om te spelen'}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-duck-bg/65">
                                {status === 'idle'
                                    ? 'Springen met spatie, pijl omhoog of tikken.'
                                    : `Score ${score}`}
                            </p>
                            <button
                                type="button"
                                onClick={restart}
                                className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-duck-ink bg-duck-acid px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                            >
                                {status === 'idle' ? 'Start het spel' : 'Opnieuw'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p id="game-lab-help" className="sr-only">
                Tab naar het speelveld en druk op spatie of pijl omhoog om te springen. Druk op Escape om het speelveld te verlaten.
            </p>
            <p className="sr-only" aria-live="polite">{statusMessage}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={jump}
                    className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-full border border-duck-acid px-6 text-sm font-extrabold text-duck-acid transition-colors hover:bg-duck-acid hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                >
                    Springen
                </button>
                <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-duck-bg/25 px-6 text-sm font-extrabold text-duck-bg/80 transition-colors hover:border-duck-bg hover:text-duck-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink"
                >
                    Opnieuw
                </button>
            </div>

            {reduceMotion && (
                <p className="mt-2 text-xs font-semibold text-duck-bg/55">
                    Je systeem vraagt om minder beweging, dus de game staat stil. Druk op Start om hem toch te spelen.
                </p>
            )}
        </div>
    );
};

/* ── Tekenhulpjes ─────────────────────────────────────────────────── */

function drawObstacles(ctx: CanvasRenderingContext2D, spec: GameSpec, world: World) {
    for (const obstacle of world.obstacles) {
        if (obstacle.x > WORLD_W + 20 || obstacle.x + obstacle.w < -20) continue;
        const top = GROUND_Y - obstacle.h;
        ctx.fillStyle = spec.accent;

        switch (spec.obstacleType) {
            case 'cactus':
                ctx.fillRect(obstacle.x + obstacle.w / 3, top, obstacle.w / 3, obstacle.h);
                ctx.fillRect(obstacle.x, top + obstacle.h * 0.3, obstacle.w, 4);
                break;
            case 'ijspegel':
                ctx.beginPath();
                ctx.moveTo(obstacle.x, GROUND_Y);
                ctx.lineTo(obstacle.x + obstacle.w / 2, top);
                ctx.lineTo(obstacle.x + obstacle.w, GROUND_Y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'vuur':
                ctx.beginPath();
                ctx.moveTo(obstacle.x, GROUND_Y);
                ctx.quadraticCurveTo(obstacle.x - 4, top + 6, obstacle.x + obstacle.w / 2, top);
                ctx.quadraticCurveTo(obstacle.x + obstacle.w + 4, top + 6, obstacle.x + obstacle.w, GROUND_Y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'robotarm':
                ctx.fillRect(obstacle.x, top, obstacle.w, 6);
                ctx.fillRect(obstacle.x + obstacle.w / 2 - 2, top, 4, obstacle.h);
                break;
            case 'krat':
                ctx.fillRect(obstacle.x, top, obstacle.w, obstacle.h);
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.fillRect(obstacle.x + 2, top + 2, obstacle.w - 4, 3);
                break;
            default:
                ctx.beginPath();
                ctx.ellipse(obstacle.x + obstacle.w / 2, GROUND_Y - obstacle.h / 2, obstacle.w / 2, obstacle.h / 2, 0, 0, Math.PI * 2);
                ctx.fill();
        }
    }
}

function drawCollectibles(ctx: CanvasRenderingContext2D, spec: GameSpec, world: World) {
    for (const item of world.collectibles) {
        if (item.taken || item.x > WORLD_W + 20 || item.x < -20) continue;
        ctx.fillStyle = spec.character;

        switch (spec.collectibleType) {
            case 'ster': {
                ctx.beginPath();
                for (let i = 0; i < 10; i += 1) {
                    const radius = i % 2 === 0 ? 8 : 3.4;
                    const angle = (Math.PI / 5) * i - Math.PI / 2;
                    const px = item.x + Math.cos(angle) * radius;
                    const py = item.y + Math.sin(angle) * radius;
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'kristal':
            case 'diamant':
                ctx.beginPath();
                ctx.moveTo(item.x, item.y - 8);
                ctx.lineTo(item.x + 6, item.y);
                ctx.lineTo(item.x, item.y + 8);
                ctx.lineTo(item.x - 6, item.y);
                ctx.closePath();
                ctx.fill();
                break;
            case 'appel':
                ctx.beginPath();
                ctx.arc(item.x, item.y, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = spec.ground;
                ctx.fillRect(item.x - 1, item.y - 11, 2, 5);
                break;
            default:
                ctx.beginPath();
                ctx.arc(item.x, item.y, 6.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(0,0,0,0.25)';
                ctx.beginPath();
                ctx.arc(item.x, item.y, 3, 0, Math.PI * 2);
                ctx.fill();
        }
    }
}

function drawPlayer(ctx: CanvasRenderingContext2D, spec: GameSpec, world: World) {
    const x = PLAYER_X;
    const y = world.playerY;
    const blinking = world.invulnerable > 0 && Math.floor(world.invulnerable * 10) % 2 === 0;
    if (blinking) return;

    ctx.fillStyle = spec.character;

    switch (spec.characterType) {
        case 'astronaut':
            ctx.fillRect(x + 2, y + 8, PLAYER_SIZE - 4, PLAYER_SIZE - 8);
            ctx.beginPath();
            ctx.arc(x + PLAYER_SIZE / 2, y + 7, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.arc(x + PLAYER_SIZE / 2 + 2, y + 6, 4.5, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'kat':
            ctx.beginPath();
            ctx.ellipse(x + PLAYER_SIZE / 2, y + 14, 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + PLAYER_SIZE / 2, y + 6, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 1); ctx.lineTo(x + 6, y - 5); ctx.lineTo(x + 10, y + 1);
            ctx.moveTo(x + 18, y + 1); ctx.lineTo(x + 16, y - 5); ctx.lineTo(x + 12, y + 1);
            ctx.fill();
            break;
        case 'draak':
            ctx.beginPath();
            ctx.ellipse(x + PLAYER_SIZE / 2, y + 14, 11, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + PLAYER_SIZE / 2 + 3, y + 6, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x + 4, y + 8); ctx.lineTo(x - 4, y + 2); ctx.lineTo(x + 4, y + 2);
            ctx.closePath();
            ctx.fill();
            break;
        case 'ninja':
            ctx.fillStyle = '#1b1b20';
            ctx.fillRect(x + 3, y + 6, PLAYER_SIZE - 6, PLAYER_SIZE - 6);
            ctx.fillStyle = spec.character;
            ctx.fillRect(x + 1, y + 8, PLAYER_SIZE - 2, 5);
            break;
        case 'eenhoorn':
            ctx.fillStyle = '#f7f7f2';
            ctx.beginPath();
            ctx.ellipse(x + PLAYER_SIZE / 2, y + 14, 11, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + PLAYER_SIZE / 2, y + 6, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = spec.character;
            ctx.beginPath();
            ctx.moveTo(x + PLAYER_SIZE / 2, y - 6);
            ctx.lineTo(x + PLAYER_SIZE / 2 - 3, y + 1);
            ctx.lineTo(x + PLAYER_SIZE / 2 + 3, y + 1);
            ctx.closePath();
            ctx.fill();
            break;
        default:
            ctx.fillRect(x + 2, y + 6, PLAYER_SIZE - 4, PLAYER_SIZE - 6);
            ctx.fillRect(x + 5, y, PLAYER_SIZE - 10, 6);
            ctx.fillStyle = '#141417';
            ctx.fillRect(x + 6, y + 9, 4, 4);
            ctx.fillRect(x + 13, y + 9, 4, 4);
    }

    if (world.shieldLeft > 0) {
        ctx.strokeStyle = spec.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + PLAYER_SIZE / 2, y + PLAYER_SIZE / 2, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function drawHud(ctx: CanvasRenderingContext2D, spec: GameSpec, world: World, now: number) {
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textBaseline = 'top';

    const goal = spec.winCondition.type === 'score'
        ? `${world.score} / ${spec.winCondition.target}`
        : `${Math.max(0, Math.ceil(spec.winCondition.target - world.elapsed))}s`;

    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.fillRect(10, 10, 96, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(spec.winCondition.type === 'score' ? `Score ${goal}` : `Nog ${goal}`, 18, 16);

    const label = spec.theme.slice(0, 22);
    const labelWidth = ctx.measureText(label).width + 20;
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.fillRect(WORLD_W - labelWidth - 10, 10, labelWidth, 24);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, WORLD_W - labelWidth, 16);

    if (now < world.flashUntil) {
        ctx.fillStyle = spec.accent;
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillText('Aangepast!', 18, 44);
    }
}
