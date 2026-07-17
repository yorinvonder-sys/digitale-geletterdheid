import type { GameSettings } from './gameProgrammerState';

export const VIEW_WIDTH = 640;
export const VIEW_HEIGHT = 360;
export const GROUND_Y = 292;
export const PLAYER_X = 88;
export const PLAYER_WIDTH = 38;
export const PLAYER_HEIGHT = 52;
export const OBSTACLE_WIDTH = 44;
export const GRAVITY = 1050;

export interface PlatformObstacle {
    id: number;
    x: number;
    height: number;
    scored: boolean;
}

export interface PlatformFrame {
    playerY: number;
    velocityY: number;
    obstacles: ReadonlyArray<PlatformObstacle>;
    score: number;
    elapsed: number;
    collision: boolean;
}

export function createInitialPlatformFrame(): PlatformFrame {
    return {
        playerY: GROUND_Y - PLAYER_HEIGHT,
        velocityY: 0,
        obstacles: [{ id: 1, x: 520, height: 68, scored: false }],
        score: 0,
        elapsed: 0,
        collision: false,
    };
}

export function jumpPlatformPlayer(frame: PlatformFrame, jumpForce: number): PlatformFrame {
    const groundLevel = GROUND_Y - PLAYER_HEIGHT;
    const isGrounded = frame.playerY >= groundLevel - 0.5 && frame.velocityY === 0;
    if (!isGrounded || frame.collision) return frame;
    return { ...frame, velocityY: jumpForce };
}

function collidesWithPlayer(playerY: number, obstacle: PlatformObstacle) {
    const playerRight = PLAYER_X + PLAYER_WIDTH;
    const playerBottom = playerY + PLAYER_HEIGHT;
    const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
    const obstacleTop = GROUND_Y - obstacle.height;

    return PLAYER_X < obstacleRight
        && playerRight > obstacle.x
        && playerY < GROUND_Y
        && playerBottom > obstacleTop;
}

export function advancePlatformFrame(
    frame: PlatformFrame,
    deltaSeconds: number,
    settings: GameSettings,
): PlatformFrame {
    if (frame.collision) return frame;

    const delta = Math.max(0, Math.min(deltaSeconds, 0.05));
    const groundLevel = GROUND_Y - PLAYER_HEIGHT;
    const nextVelocity = frame.velocityY + GRAVITY * delta;
    const nextPlayerY = Math.min(groundLevel, frame.playerY + nextVelocity * delta);
    const landed = nextPlayerY >= groundLevel;

    let score = frame.score;
    let obstacles = frame.obstacles
        .map((obstacle) => {
            const moved = { ...obstacle, x: obstacle.x - settings.obstacleSpeed * delta };
            if (!moved.scored && moved.x + OBSTACLE_WIDTH < PLAYER_X) {
                score += 10;
                return { ...moved, scored: true };
            }
            return moved;
        })
        .filter((obstacle) => obstacle.x > -OBSTACLE_WIDTH - 8);

    const lastObstacle = obstacles.at(-1);
    if (!lastObstacle || lastObstacle.x < 330) {
        const nextId = (lastObstacle?.id ?? 0) + 1;
        obstacles = [
            ...obstacles,
            {
                id: nextId,
                x: VIEW_WIDTH + 36,
                height: 56 + (nextId % 3) * 12,
                scored: false,
            },
        ];
    }

    const collision = obstacles.some((obstacle) => collidesWithPlayer(nextPlayerY, obstacle));

    return {
        playerY: nextPlayerY,
        velocityY: landed ? 0 : nextVelocity,
        obstacles,
        score,
        elapsed: frame.elapsed + delta,
        collision,
    };
}
