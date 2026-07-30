export type CharacterType = 'robot' | 'astronaut' | 'kat' | 'draak' | 'ninja' | 'eenhoorn';
export type ObstacleType = 'cactus' | 'rots' | 'krat' | 'ijspegel' | 'vuur' | 'robotarm';
export type CollectibleType = 'munt' | 'ster' | 'kristal' | 'appel' | 'diamant';
export type Powerup = 'geen' | 'dubbelsprong' | 'schild' | 'magneet' | 'turbo';
export type WinType = 'score' | 'survive';

export interface GameBackground {
    clouds: boolean;
    stars: boolean;
    mountains: boolean;
    trees: boolean;
    moon: boolean;
}

export interface GameWinCondition {
    type: WinType;
    target: number;
}

export interface GameSpec {
    theme: string;
    sky: string;
    ground: string;
    character: string;
    accent: string;
    characterType: CharacterType;
    gravity: number;
    jumpHeight: number;
    speed: number;
    obstacleCount: number;
    obstacleType: ObstacleType;
    collectibleCount: number;
    collectibleType: CollectibleType;
    powerup: Powerup;
    winCondition: GameWinCondition;
    background: GameBackground;
}

export type ParseReason = 'ok' | 'no_block' | 'too_large' | 'invalid_json' | 'not_object';

export interface ParseGameSpecResult {
    spec: GameSpec;
    applied: boolean;
    reason: ParseReason;
}

export declare const MAX_SPEC_BLOCK_CHARS: number;
export declare const CHARACTER_TYPES: readonly CharacterType[];
export declare const OBSTACLE_TYPES: readonly ObstacleType[];
export declare const COLLECTIBLE_TYPES: readonly CollectibleType[];
export declare const POWERUPS: readonly Powerup[];
export declare const WIN_TYPES: readonly WinType[];
export declare const DEFAULT_GAME_SPEC: Readonly<GameSpec>;

export declare function parseGameSpec(text: string, previous?: GameSpec): ParseGameSpecResult;
export declare function stripGameStateBlock(text: string): string;
export declare function describeSpec(spec: GameSpec): string;
export declare function specSummary(spec: GameSpec): Array<{ label: string; value: string }>;
export declare function specToPromptJson(spec: GameSpec): string;
