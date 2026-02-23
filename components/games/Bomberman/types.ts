
import { AvatarConfig } from '../../../types';

export type GameStatus = 'lobby' | 'playing' | 'ended';

export interface Player {
    id: string;
    name: string;
    avatar: AvatarConfig;
    x: number;
    y: number;
    isAlive: boolean;
    lives: number; // Max 3
    bombCount: number;
    blastRadius: number;
    speed: number; // Base: 1.0
    color: string;
    score: number;
    ready: boolean;
}

export interface Bomb {
    id: string;
    x: number;
    y: number;
    ownerId: string;
    placedAt: number; // timestamp
    expiresAt: number;
    radius: number;
}

export type TileType = 'empty' | 'wall' | 'crate' | 'powerup_bomb' | 'powerup_radius' | 'powerup_speed';

export interface GameState {
    id: string; // Room ID
    status: GameStatus;
    grid: TileType[][];
    players: Record<string, Player>;
    bombs: Record<string, Bomb>;
    explosions: Record<string, { x: number, y: number, radius: number, createdAt: number, spans?: { up: number, down: number, left: number, right: number } }>; // Visual sync
    createdAt: number;
    winnerId?: string;
    // Auto-start fields
    lobbyStartTime?: number;      // Timestamp when 2nd player joined (countdown starts)
    forceStarted?: boolean;       // True if teacher forced start
    forceStartedBy?: string;      // Teacher ID who forced start
}

export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;
