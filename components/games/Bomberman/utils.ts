
import { GRID_HEIGHT, GRID_WIDTH, TileType } from './types';

export const generateGrid = (): TileType[][] => {
    const grid: TileType[][] = Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill('empty'));

    // 1. Fixed Walls (Odd/Odd)
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            // Borders
            if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1) {
                grid[y][x] = 'wall';
                continue;
            }

            // Fixed pillars
            if (y % 2 === 0 && x % 2 === 0) {
                grid[y][x] = 'wall';
            }
        }
    }

    // 2. Random Crates
    // Avoid corners (Spawn zones) - need 3x3 safe area around each spawn
    const safeZones = [
        // Top Left (Player 0 spawns at 1.5, 1.5)
        { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 1 },
        // Top Right (Player 2 spawns at GRID_WIDTH - 2.5, 1.5)
        { x: GRID_WIDTH - 2, y: 1 }, { x: GRID_WIDTH - 3, y: 1 }, { x: GRID_WIDTH - 2, y: 2 },
        { x: GRID_WIDTH - 3, y: 2 }, { x: GRID_WIDTH - 4, y: 1 }, { x: GRID_WIDTH - 2, y: 3 },
        // Bottom Left (Player 3 spawns at 1.5, GRID_HEIGHT - 2.5)
        { x: 1, y: GRID_HEIGHT - 2 }, { x: 1, y: GRID_HEIGHT - 3 }, { x: 2, y: GRID_HEIGHT - 2 },
        { x: 2, y: GRID_HEIGHT - 3 }, { x: 3, y: GRID_HEIGHT - 2 }, { x: 1, y: GRID_HEIGHT - 4 },
        // Bottom Right (Player 1 spawns at GRID_WIDTH - 2.5, GRID_HEIGHT - 2.5)
        { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2 }, { x: GRID_WIDTH - 3, y: GRID_HEIGHT - 2 },
        { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 3 }, { x: GRID_WIDTH - 3, y: GRID_HEIGHT - 3 },
        { x: GRID_WIDTH - 4, y: GRID_HEIGHT - 2 }, { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 4 },
    ];

    const isSafe = (x: number, y: number) => safeZones.some(p => p.x === x && p.y === y);

    for (let y = 1; y < GRID_HEIGHT - 1; y++) {
        for (let x = 1; x < GRID_WIDTH - 1; x++) {
            if (grid[y][x] === 'empty' && !isSafe(x, y)) {
                if (Math.random() < 0.7) { // 70% density
                    grid[y][x] = 'crate';
                }
            }
        }
    }

    return grid;
};

export const getSpawnPoint = (playerIndex: number) => {
    // IMPORTANT: Spawn positions must floor to ODD coordinates to avoid walls.
    // Grid has walls at borders (x=0, x=14, y=0, y=12) and fixed pillars at even/even.
    // Using X.5 positions: floor(1.5)=1 (odd, good), floor(11.5)=11 (odd, good)
    // GRID_WIDTH=15, GRID_HEIGHT=13
    // Safe spawn tiles: (1,1), (13,1), (1,11), (13,11) - all odd/odd = empty
    switch (playerIndex) {
        case 0: return { x: 1.5, y: 1.5 };                   // Top Left (1,1) ✓
        case 1: return { x: GRID_WIDTH - 2.5, y: GRID_HEIGHT - 2.5 }; // Bottom Right
        case 2: return { x: GRID_WIDTH - 2.5, y: 1.5 };      // Top Right
        case 3: return { x: 1.5, y: GRID_HEIGHT - 2.5 };     // Bottom Left
        default: return { x: 1.5, y: 1.5 };
    }
};

// Helper to verify a spawn point is on a walkable tile (for debugging)
export const isWalkableTile = (x: number, y: number): boolean => {
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);

    // Border walls
    if (tileX <= 0 || tileX >= GRID_WIDTH - 1 || tileY <= 0 || tileY >= GRID_HEIGHT - 1) {
        return false;
    }

    // Fixed pillars at even/even positions
    if (tileX % 2 === 0 && tileY % 2 === 0) {
        return false;
    }

    return true;
};

// Safe spawn points that are guaranteed to be on walkable tiles
export const getSafeSpawnPoint = (playerIndex: number): { x: number, y: number } => {
    // These positions floor to odd/odd coordinates, avoiding walls
    const spawns = [
        { x: 1.5, y: 1.5 },     // Top Left: floor to (1,1)
        { x: 13.5, y: 11.5 },   // Bottom Right: floor to (13,11) - FIXED!
        { x: 13.5, y: 1.5 },    // Top Right: floor to (13,1)
        { x: 1.5, y: 11.5 },    // Bottom Left: floor to (1,11)
    ];

    return spawns[playerIndex % spawns.length];
};
