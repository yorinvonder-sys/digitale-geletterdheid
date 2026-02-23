
import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, GRID_HEIGHT, GRID_WIDTH, Player, Bomb, TileType } from './types';

interface GameCanvasProps {
    gameState: GameState;
    myPlayerId: string;
    onMove: (x: number, y: number) => void;
    onBomb: () => void;
    onPickup?: (x: number, y: number) => void;
    inputRef: React.MutableRefObject<{ up: boolean, down: boolean, left: boolean, right: boolean, bomb: boolean }>;
    shrinkLevel?: number;
    isSuddenDeath?: boolean;
    onDeath?: () => void;
}

const TILE_SIZE = 48;

// Visual Assets / Constants
const COLORS = {
    bg: '#0f172a', // Slate 900
    gridLight: '#1e3a8a', // Blue 900 (Dark Blue)
    gridDark: '#172554', // Blue 950 (Darker Blue)
    wallTop: '#334155',
    wallSide: '#1e293b',
    crate: '#d97706',
    crateDark: '#92400e',
    bomb: '#000000',
    bombFuse: '#ef4444',
    explosionCore: '#fef08a', // Yellow 200
    explosionOuter: '#ef4444', // Red 500
    dangerZone: 'rgba(220, 38, 38, 0.5)', // Red danger zone
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
    gameState,
    myPlayerId,
    onMove,
    onBomb,
    onPickup,
    inputRef,
    shrinkLevel = 0,
    isSuddenDeath = false,
    onDeath
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);

    // Inputs are now managed by parent (via inputRef prop)
    const localPosRef = useRef<{ x: number, y: number } | null>(null);
    const lastUpdateRef = useRef<number>(0);

    // Remote player interpolation - store current visual positions and lerp towards target
    const remotePosRef = useRef<Record<string, { x: number, y: number, targetX: number, targetY: number }>>({});

    // Particles System
    const particlesRef = useRef<{ x: number, y: number, vx: number, vy: number, life: number, color: string, size: number }[]>([]);



    useEffect(() => {
        const myP = gameState.players[myPlayerId];
        if (myP && !localPosRef.current) {
            localPosRef.current = { x: myP.x, y: myP.y };
        }
    }, [gameState.players, myPlayerId]);

    // Detect new explosions to spawn particles
    const prevExplosionsRef = useRef<Set<string>>(new Set());
    useEffect(() => {
        if (!gameState.explosions) return;

        Object.keys(gameState.explosions).forEach(key => {
            if (!prevExplosionsRef.current.has(key)) {
                // Spawn particles for new explosion
                const exp = gameState.explosions[key];
                const count = 40;
                for (let i = 0; i < count; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 8;
                    particlesRef.current.push({
                        x: exp.x * TILE_SIZE + TILE_SIZE / 2,
                        y: exp.y * TILE_SIZE + TILE_SIZE / 2,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        life: 1.0,
                        color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
                        size: Math.random() * 6 + 2
                    });
                }
                prevExplosionsRef.current.add(key);
            }
        });
    }, [gameState.explosions]);

    // --- RENDER LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const render = (time: number) => {
            // 1. UPDATE LOGIC
            // Physics / Movement
            const myPlayer = gameState.players[myPlayerId];
            if (myPlayer && myPlayer.isAlive && localPosRef.current) {
                const baseSpeed = 0.08;
                const playerSpeed = (myPlayer as any).speed || 1.0;
                const speed = baseSpeed * playerSpeed;
                const snapStrength = 0.2; // How fast we snap to grid center
                let { x, y } = localPosRef.current;
                let dx = 0, dy = 0;

                // 1. Determine Input Direction (No diagonals)
                // Priority: If moving in a new axis, switch to it? 
                // Simple priority: Up/Down > Left/Right to prevent diagonals
                if (inputRef.current.up) dy = -speed;
                else if (inputRef.current.down) dy = speed;
                else if (inputRef.current.left) dx = -speed;
                else if (inputRef.current.right) dx = speed;



                // 2. Lane Snapping / Rail Mechanics
                if (dx !== 0) {
                    // Moving Horizontally -> Snap Y to center
                    const idealY = Math.floor(y) + 0.5;
                    const diff = idealY - y;
                    if (Math.abs(diff) > 0.05) {
                        y += Math.sign(diff) * Math.min(Math.abs(diff), snapStrength);
                    } else {
                        y = idealY;
                    }
                } else if (dy !== 0) {
                    // Moving Vertically -> Snap X to center
                    const idealX = Math.floor(x) + 0.5;
                    const diff = idealX - x;
                    if (Math.abs(diff) > 0.05) {
                        x += Math.sign(diff) * Math.min(Math.abs(diff), snapStrength);
                    } else {
                        x = idealX;
                    }
                }

                if (dx !== 0 || dy !== 0) {
                    const checkCollision = (cx: number, cy: number) => {
                        // Tighter collision radius for cleaner movement
                        // Tile center is .5. Wall is at 1.0. Radius must be < 0.5.
                        // 0.45 radius means 0.05 gap to wall.
                        const r = 0.40;
                        const points = [
                            { x: cx - r, y: cy - r }, { x: cx + r, y: cy - r },
                            { x: cx - r, y: cy + r }, { x: cx + r, y: cy + r }
                        ];
                        for (const p of points) {
                            const tx = Math.floor(p.x);
                            const ty = Math.floor(p.y);

                            // Bounds
                            if (tx < 0 || tx >= GRID_WIDTH || ty < 0 || ty >= GRID_HEIGHT) return true;

                            // Walls/Crates
                            const tile = gameState.grid[ty][tx];
                            if (tile === 'wall' || tile === 'crate') return true;

                            // Bombs (Solid) - Can ALWAYS walk over OWN bombs, block others
                            const bombAtTile = Object.values(gameState.bombs).find(b => Math.floor(b.x) === tx && Math.floor(b.y) === ty);
                            if (bombAtTile && bombAtTile.ownerId !== myPlayerId) {
                                // Only block if it's someone else's bomb
                                return true;
                            }
                        }
                        return false;
                    };

                    // Move X
                    if (dx !== 0) {
                        if (!checkCollision(x + dx, y)) {
                            x += dx;
                        } else {
                            // "Corner Sliding" - if we hit a wall, but we are close to a corner, maybe slide Y?
                            // For now, simple stop.
                            dx = 0;
                        }
                    }

                    // Move Y
                    if (dy !== 0) {
                        if (!checkCollision(x, y + dy)) {
                            y += dy;
                        } else {
                            dy = 0;
                        }
                    }

                    localPosRef.current = { x, y };

                    // Check Sudden Death Zone - Lethal on contact!
                    if (isSuddenDeath && shrinkLevel > 0) {
                        const tileX = Math.floor(x);
                        const tileY = Math.floor(y);
                        const inDangerZone = tileX < shrinkLevel || tileX >= GRID_WIDTH - shrinkLevel ||
                            tileY < shrinkLevel || tileY >= GRID_HEIGHT - shrinkLevel;

                        if (inDangerZone) {
                            // Player is in danger zone - trigger death callback
                            if (onDeath) onDeath();
                        }
                    }

                    // Check for power-up pickup
                    const tileX = Math.floor(x);
                    const tileY = Math.floor(y);
                    const currentTile = gameState.grid[tileY]?.[tileX];
                    if (currentTile && currentTile.startsWith('powerup_') && onPickup) {
                        onPickup(tileX, tileY);
                    }

                    if (time - lastUpdateRef.current > 50) {
                        onMove(x, y);
                        lastUpdateRef.current = time;
                    }
                }
            }

            // 2. DRAW
            ctx.fillStyle = COLORS.bg;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const offsetX = (canvas.width - GRID_WIDTH * TILE_SIZE) / 2;
            const offsetY = (canvas.height - GRID_HEIGHT * TILE_SIZE) / 2;

            ctx.save();
            ctx.translate(offsetX, offsetY);

            // Draw Board (Glow Effect)
            ctx.shadowBlur = 0;
            for (let y = 0; y < GRID_HEIGHT; y++) {
                for (let x = 0; x < GRID_WIDTH; x++) {
                    const tile = gameState.grid[y][x];
                    const px = x * TILE_SIZE;
                    const py = y * TILE_SIZE;

                    // Floor Pattern
                    ctx.fillStyle = (x + y) % 2 === 0 ? COLORS.gridLight : COLORS.gridDark;
                    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

                    // Grid lines for tech feel
                    ctx.strokeStyle = '#334155';
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

                    if (tile === 'wall') {
                        // Neon Wall
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = '#64748b';
                        ctx.fillStyle = '#475569';
                        ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);

                        // Top Highlight
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 4);
                        ctx.shadowBlur = 0;
                    } else if (tile === 'crate') {
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = COLORS.crate;
                        ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);

                        // Detail
                        ctx.fillStyle = COLORS.crateDark;
                        ctx.fillRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);

                        // X
                        ctx.strokeStyle = '#d97706';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(px + 8, py + 8); ctx.lineTo(px + TILE_SIZE - 8, py + TILE_SIZE - 8);
                        ctx.moveTo(px + TILE_SIZE - 8, py + 8); ctx.lineTo(px + 8, py + TILE_SIZE - 8);
                        ctx.stroke();
                    } else if (tile === 'powerup_bomb') {
                        // Extra Bomb Power-up (Blue)
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#3b82f6';
                        ctx.fillStyle = '#3b82f6';
                        ctx.beginPath();
                        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('💣', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
                    } else if (tile === 'powerup_radius') {
                        // Blast Radius Power-up (Orange)
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#f97316';
                        ctx.fillStyle = '#f97316';
                        ctx.beginPath();
                        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('💥', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
                    } else if (tile === 'powerup_speed') {
                        // Speed Power-up (Green)
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = '#22c55e';
                        ctx.fillStyle = '#22c55e';
                        ctx.beginPath();
                        ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('👟', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
                    }
                }
            }

            // Draw Danger Zone (Sudden Death)
            if (isSuddenDeath && shrinkLevel > 0) {
                ctx.fillStyle = COLORS.dangerZone;
                for (let y = 0; y < GRID_HEIGHT; y++) {
                    for (let x = 0; x < GRID_WIDTH; x++) {
                        const inDanger = x < shrinkLevel || x >= GRID_WIDTH - shrinkLevel ||
                            y < shrinkLevel || y >= GRID_HEIGHT - shrinkLevel;
                        if (inDanger) {
                            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
                // Pulsing border effect
                const pulse = Math.abs(Math.sin(time / 300)) * 0.3 + 0.7;
                ctx.strokeStyle = `rgba(220, 38, 38, ${pulse})`;
                ctx.lineWidth = 4;
                ctx.strokeRect(
                    shrinkLevel * TILE_SIZE,
                    shrinkLevel * TILE_SIZE,
                    (GRID_WIDTH - shrinkLevel * 2) * TILE_SIZE,
                    (GRID_HEIGHT - shrinkLevel * 2) * TILE_SIZE
                );
            }

            // Draw Bombs (Pulsing)
            Object.values(gameState.bombs).forEach(bomb => {
                const px = bomb.x * TILE_SIZE + TILE_SIZE / 2;
                const py = bomb.y * TILE_SIZE + TILE_SIZE / 2;

                const pulse = Math.abs(Math.sin(time / 200));

                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ef4444';

                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(px, py, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(239, 68, 68, ${0.5 + pulse * 0.5})`;
                ctx.beginPath();
                ctx.arc(px, py, (TILE_SIZE / 2 - 8) * (0.8 + pulse * 0.2), 0, Math.PI * 2);
                ctx.fill();

                ctx.shadowBlur = 0;
            });

            // Draw Explosions (Ground Scorch / Flash)
            if (gameState.explosions) {
                Object.values(gameState.explosions).forEach(exp => {
                    if (Date.now() - exp.createdAt > 500) return; // Hide after 500ms

                    const cx = exp.x * TILE_SIZE + TILE_SIZE / 2;
                    const cy = exp.y * TILE_SIZE + TILE_SIZE / 2;

                    // Cross shape using explicit spans if available
                    ctx.fillStyle = `rgba(255, 200, 0, 0.5)`;

                    if (exp.spans) {
                        // Draw center
                        ctx.fillRect(cx - 20, cy - 20, 40, 40);

                        // Draw Up
                        if (exp.spans.up > 0) {
                            const h = exp.spans.up * TILE_SIZE;
                            ctx.fillRect(cx - 20, cy - 20 - h, 40, h);
                        }
                        // Draw Down
                        if (exp.spans.down > 0) {
                            const h = exp.spans.down * TILE_SIZE;
                            ctx.fillRect(cx - 20, cy + 20, 40, h);
                        }
                        // Draw Left
                        if (exp.spans.left > 0) {
                            const w = exp.spans.left * TILE_SIZE;
                            ctx.fillRect(cx - 20 - w, cy - 20, w, 40);
                        }
                        // Draw Right
                        if (exp.spans.right > 0) {
                            const w = exp.spans.right * TILE_SIZE;
                            ctx.fillRect(cx + 20, cy - 20, w, 40);
                        }
                    } else {
                        // Legacy Fallback (Full blast)
                        const rw = exp.radius * TILE_SIZE;
                        ctx.fillRect(cx - rw, cy - 20, rw * 2, 40);
                        ctx.fillRect(cx - 20, cy - rw, 40, rw * 2);
                    }
                });
            }

            // Draw Players (Interpolated)
            Object.values(gameState.players).forEach(p => {
                if (!p.isAlive) return;

                let drawX: number, drawY: number;

                if (p.id === myPlayerId && localPosRef.current) {
                    // Local player uses client-side predicted position
                    drawX = localPosRef.current.x;
                    drawY = localPosRef.current.y;
                } else {
                    // Remote players: interpolate toward their database position
                    if (!remotePosRef.current[p.id]) {
                        // First time seeing this player, initialize position
                        remotePosRef.current[p.id] = { x: p.x, y: p.y, targetX: p.x, targetY: p.y };
                    }

                    const remotePos = remotePosRef.current[p.id];

                    // Update target when database position changes
                    remotePos.targetX = p.x;
                    remotePos.targetY = p.y;

                    // Lerp toward target (smooth interpolation)
                    const lerpSpeed = 0.15; // How fast to interpolate (0.1 = slow, 0.3 = fast)
                    remotePos.x += (remotePos.targetX - remotePos.x) * lerpSpeed;
                    remotePos.y += (remotePos.targetY - remotePos.y) * lerpSpeed;

                    // Snap if very close (avoid micro-movements)
                    if (Math.abs(remotePos.targetX - remotePos.x) < 0.01) remotePos.x = remotePos.targetX;
                    if (Math.abs(remotePos.targetY - remotePos.y) < 0.01) remotePos.y = remotePos.targetY;

                    drawX = remotePos.x;
                    drawY = remotePos.y;
                }

                const px = drawX * TILE_SIZE;
                const py = drawY * TILE_SIZE;

                // Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.beginPath();
                ctx.ellipse(px, py + TILE_SIZE / 3, TILE_SIZE / 3, TILE_SIZE / 5, 0, 0, Math.PI * 2);
                ctx.fill();

                // Body
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.avatar.shirtColor;
                ctx.fillStyle = p.avatar.shirtColor;
                ctx.beginPath();
                ctx.arc(px, py, TILE_SIZE / 2 - 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // Head/Face
                ctx.fillStyle = p.avatar.skinColor;
                ctx.beginPath();
                ctx.arc(px, py - 6, TILE_SIZE / 4, 0, Math.PI * 2);
                ctx.fill();

                // Name
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#000';
                ctx.shadowBlur = 4;
                ctx.fillText(p.name, px, py - TILE_SIZE / 2 - 10);
                ctx.shadowBlur = 0;
            });

            // Particles (Global layer)
            ctx.restore(); // Back to screen space for particles? No, stay in camera space
            ctx.save();
            ctx.translate(offsetX, offsetY); // Re-apply camera

            for (let i = particlesRef.current.length - 1; i >= 0; i--) {
                const p = particlesRef.current[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.05;
                p.size *= 0.95;

                if (p.life <= 0) {
                    particlesRef.current.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.restore();

            frameRef.current = requestAnimationFrame(render);
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        frameRef.current = requestAnimationFrame(render);
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameRef.current);
        };
    }, [gameState, myPlayerId]);

    return (
        <canvas ref={canvasRef} className="block w-full h-full bg-slate-900" />
    );
};
