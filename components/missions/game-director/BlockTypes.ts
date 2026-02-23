// Block Type Definitions for Scratch-like Game Director
// This file defines all available code blocks and their behaviors

export type BlockCategory = 'event' | 'motion' | 'control' | 'variable';

export interface BlockInput {
    name: string;
    type: 'number' | 'string' | 'dropdown' | 'key';
    default: any;
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
}

export interface PlacedBlock {
    id: string;
    definitionId: string;
    inputs: Record<string, any>;
    children?: PlacedBlock[]; // For control blocks that contain other blocks
}

export interface GameContext {
    player: {
        x: number;
        y: number;
        vx: number;
        vy: number;
        grounded: boolean;
        facingRight: boolean;
        // Action queue for smooth movement (instead of instant teleport)
        action?: {
            type: 'move';
            remainingDistance: number;
            speed: number;
            directionX: number; // 1, -1 or 0
            directionY: number; // 1, -1 or 0
        };
    };
    keys: Record<string, boolean>;
    variables: Record<string, number>;
    reachedGoal: boolean; // Whether the player has reached the finish
    log: (msg: string) => void;
    setScore: (fn: (s: number) => number) => void;
}

export interface BlockDefinition {
    id: string;
    category: BlockCategory;
    label: string; // Use {inputName} for input placeholders
    color: string;
    inputs: BlockInput[];
    isEvent?: boolean; // Event blocks are entry points
    hasBody?: boolean; // Control blocks can contain other blocks
    execute: (ctx: GameContext, inputs: Record<string, any>, runChildren?: () => void) => void;
}

// Scratch-inspired color palette
const COLORS = {
    event: '#FFBF00',    // Yellow/Gold for events
    motion: '#4C97FF',   // Blue for motion
    control: '#FFAB19',  // Orange for control
    variable: '#FF8C1A', // Dark orange for variables
};

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
    // ===== EVENT BLOCKS =====
    {
        id: 'when_game_starts',
        category: 'event',
        label: '🚀 wanneer game start',
        color: COLORS.event,
        inputs: [],
        isEvent: true,
        execute: () => { /* Entry point, no action needed */ }
    },
    {
        id: 'when_key_pressed',
        category: 'event',
        label: '⌨️ wanneer {key} ingedrukt',
        color: COLORS.event,
        inputs: [
            {
                name: 'key',
                type: 'dropdown',
                default: 'ArrowRight',
                options: [
                    { label: '→ Pijl Rechts', value: 'ArrowRight' },
                    { label: '← Pijl Links', value: 'ArrowLeft' },
                    { label: '↑ Pijl Omhoog', value: 'ArrowUp' },
                    { label: '↓ Pijl Omlaag', value: 'ArrowDown' },
                    { label: 'Spatiebalk', value: ' ' },
                    { label: 'W', value: 'w' },
                    { label: 'A', value: 'a' },
                    { label: 'S', value: 's' },
                    { label: 'D', value: 'd' },
                ]
            }
        ],
        isEvent: true,
        execute: (ctx, inputs) => {
            // This is checked in the executor - returns true if key is pressed
            return ctx.keys[inputs.key] === true;
        }
    },

    // ===== MOTION BLOCKS =====
    {
        id: 'move_steps',
        category: 'motion',
        label: '➡️ beweeg {steps} stappen',
        color: COLORS.motion,
        inputs: [
            { name: 'steps', type: 'number', default: 5, min: 1, max: 50 }
        ],
        execute: (ctx, inputs) => {
            const dir = ctx.player.facingRight ? 1 : -1;
            // Initiate a smooth move action
            ctx.player.action = {
                type: 'move',
                remainingDistance: inputs.steps * 30,
                speed: 5, // Pixels per frame
                directionX: dir,
                directionY: 0
            };
        }
    },
    {
        id: 'move_right',
        category: 'motion',
        label: '➡️ ga {steps} naar rechts',
        color: COLORS.motion,
        inputs: [
            { name: 'steps', type: 'number', default: 5, min: 1, max: 50 }
        ],
        execute: (ctx, inputs) => {
            ctx.player.facingRight = true;
            ctx.player.action = {
                type: 'move',
                remainingDistance: inputs.steps * 30,
                speed: 5,
                directionX: 1,
                directionY: 0
            };
        }
    },
    {
        id: 'move_left',
        category: 'motion',
        label: '⬅️ ga {steps} naar links',
        color: COLORS.motion,
        inputs: [
            { name: 'steps', type: 'number', default: 5, min: 1, max: 50 }
        ],
        execute: (ctx, inputs) => {
            ctx.player.facingRight = false;
            ctx.player.action = {
                type: 'move',
                remainingDistance: inputs.steps * 30,
                speed: 5,
                directionX: -1,
                directionY: 0
            };
        }
    },
    {
        id: 'move_up',
        category: 'motion',
        label: '⬆️ ga {steps} omhoog',
        color: COLORS.motion,
        inputs: [
            { name: 'steps', type: 'number', default: 5, min: 1, max: 50 }
        ],
        execute: (ctx, inputs) => {
            ctx.player.action = {
                type: 'move',
                remainingDistance: inputs.steps * 20,
                speed: 5,
                directionX: 0,
                directionY: -1
            };
        }
    },
    {
        id: 'move_down',
        category: 'motion',
        label: '⬇️ ga {steps} omlaag',
        color: COLORS.motion,
        inputs: [
            { name: 'steps', type: 'number', default: 5, min: 1, max: 50 }
        ],
        execute: (ctx, inputs) => {
            ctx.player.action = {
                type: 'move',
                remainingDistance: inputs.steps * 20,
                speed: 5,
                directionX: 0,
                directionY: 1
            };
        }
    },
    {
        id: 'jump',
        category: 'motion',
        label: '🦘 spring met kracht {force}',
        color: COLORS.motion,
        inputs: [
            { name: 'force', type: 'number', default: 15, min: 5, max: 50 }
        ],
        execute: (ctx, inputs) => {
            if (ctx.player.grounded) {
                // Multiply force for visible jumps (force 15 = -15px/frame initial velocity)
                ctx.player.vy = -inputs.force * 1.5;
                ctx.log('🦘 Sprong!');
            }
        }
    },
    {
        id: 'teleport',
        category: 'motion',
        label: '✨ teleporteer naar x:{x} y:{y}',
        color: COLORS.motion,
        inputs: [
            { name: 'x', type: 'number', default: 100, min: 0, max: 768 },
            { name: 'y', type: 'number', default: 200, min: 0, max: 500 }
        ],
        execute: (ctx, inputs) => {
            ctx.player.x = inputs.x;
            ctx.player.y = inputs.y;
            ctx.log(`✨ Teleport naar (${inputs.x}, ${inputs.y})`);
        }
    },
    {
        id: 'go_to_start',
        category: 'motion',
        label: '🏠 ga naar startpositie',
        color: COLORS.motion,
        inputs: [],
        execute: (ctx) => {
            ctx.player.x = 100;
            ctx.player.y = 400;
            ctx.log('🏠 Terug naar start!');
        }
    },
    {
        id: 'turn_around',
        category: 'motion',
        label: '🔄 draai om',
        color: COLORS.motion,
        inputs: [],
        execute: (ctx) => {
            ctx.player.facingRight = !ctx.player.facingRight;
            ctx.log('🔄 Omgedraaid!');
        }
    },
    {
        id: 'set_speed',
        category: 'motion',
        label: '💨 zet snelheid op {speed}',
        color: COLORS.motion,
        inputs: [
            { name: 'speed', type: 'number', default: 5, min: 1, max: 20 }
        ],
        execute: (ctx, inputs) => {
            ctx.variables['speed'] = inputs.speed;
        }
    },
    {
        id: 'bounce_edge',
        category: 'motion',
        label: '↩️ kaats terug bij rand',
        color: COLORS.motion,
        inputs: [],
        execute: (ctx) => {
            if (ctx.player.x <= 0 || ctx.player.x >= 768) {
                ctx.player.facingRight = !ctx.player.facingRight;
                ctx.log('↩️ Gekaatst bij rand!');
            }
        }
    },

    // ===== CONTROL BLOCKS =====
    {
        id: 'if_grounded',
        category: 'control',
        label: '❓ als op de grond dan',
        color: COLORS.control,
        inputs: [],
        hasBody: true,
        execute: (ctx, _inputs, runChildren) => {
            if (ctx.player.grounded && runChildren) {
                runChildren();
            }
        }
    },
    {
        id: 'if_touching_edge',
        category: 'control',
        label: '🧱 als ik de rand raak dan',
        color: COLORS.control,
        inputs: [],
        hasBody: true,
        execute: (ctx, _inputs, runChildren) => {
            if ((ctx.player.x <= 5 || ctx.player.x >= 763) && runChildren) {
                runChildren();
            }
        }
    },
    {
        id: 'repeat',
        category: 'control',
        label: '🔁 herhaal {times} keer',
        color: COLORS.control,
        inputs: [
            { name: 'times', type: 'number', default: 3, min: 1, max: 10 }
        ],
        hasBody: true,
        execute: (ctx, inputs, runChildren) => {
            if (runChildren) {
                for (let i = 0; i < inputs.times; i++) {
                    runChildren();
                }
            }
        }
    },
    {
        id: 'wait',
        category: 'control',
        label: '⏱️ wacht {seconds} seconden',
        color: COLORS.control,
        inputs: [
            { name: 'seconds', type: 'number', default: 1, min: 0.1, max: 5 }
        ],
        execute: (ctx, inputs) => {
            // Note: This is a simplified version - real wait would need async
            ctx.log(`⏱️ Wacht ${inputs.seconds}s...`);
        }
    },

    // ===== VARIABLE BLOCKS =====
    {
        id: 'set_gravity',
        category: 'variable',
        label: '🌍 zet zwaartekracht op {value}',
        color: COLORS.variable,
        inputs: [
            { name: 'value', type: 'number', default: 0.5, min: 0.1, max: 2.0 }
        ],
        execute: (ctx, inputs) => {
            ctx.variables['gravity'] = inputs.value;
            ctx.log(`🌍 Zwaartekracht: ${inputs.value}`);
        }
    },
    {
        id: 'add_score',
        category: 'variable',
        label: '⭐ voeg {points} punten toe',
        color: COLORS.variable,
        inputs: [
            { name: 'points', type: 'number', default: 10, min: 1, max: 100 }
        ],
        execute: (ctx, inputs) => {
            ctx.setScore(s => s + inputs.points);
            ctx.log(`⭐ +${inputs.points} punten!`);
        }
    },
    {
        id: 'set_score',
        category: 'variable',
        label: '🎯 zet score op {points}',
        color: COLORS.variable,
        inputs: [
            { name: 'points', type: 'number', default: 0, min: 0, max: 1000 }
        ],
        execute: (ctx, inputs) => {
            ctx.setScore(() => inputs.points);
            ctx.log(`🎯 Score: ${inputs.points}`);
        }
    },
    {
        id: 'set_lives',
        category: 'variable',
        label: '❤️ zet levens op {lives}',
        color: COLORS.variable,
        inputs: [
            { name: 'lives', type: 'number', default: 3, min: 1, max: 10 }
        ],
        execute: (ctx, inputs) => {
            ctx.variables['lives'] = inputs.lives;
            ctx.log(`❤️ Levens: ${inputs.lives}`);
        }
    },
    {
        id: 'lose_life',
        category: 'variable',
        label: '💔 verlies een leven',
        color: COLORS.variable,
        inputs: [],
        execute: (ctx) => {
            const lives = (ctx.variables['lives'] || 3) - 1;
            ctx.variables['lives'] = Math.max(0, lives);
            ctx.log(`💔 Leven verloren! Nog ${lives} over.`);
        }
    },
    {
        id: 'play_sound',
        category: 'variable',
        label: '🔊 speel geluid {sound}',
        color: COLORS.variable,
        inputs: [
            {
                name: 'sound',
                type: 'dropdown',
                default: 'boing',
                options: [
                    { label: '🎵 Boing', value: 'boing' },
                    { label: '💫 Pling', value: 'pling' },
                    { label: '💥 Boem', value: 'boom' },
                    { label: '🎉 Hoera', value: 'win' },
                    { label: '😢 Oeps', value: 'fail' },
                ]
            }
        ],
        execute: (ctx, inputs) => {
            ctx.log(`🔊 Geluid: ${inputs.sound}`);
        }
    },
    {
        id: 'show_message',
        category: 'variable',
        label: '💬 zeg "{message}"',
        color: COLORS.variable,
        inputs: [
            { name: 'message', type: 'string', default: 'Hallo!' }
        ],
        execute: (ctx, inputs) => {
            ctx.log(`💬 "${inputs.message}"`);
        }
    },
];

// Helper to get block definition by id
export const getBlockById = (id: string): BlockDefinition | undefined => {
    return BLOCK_DEFINITIONS.find(b => b.id === id);
};

// Get blocks by category
export const getBlocksByCategory = (category: BlockCategory): BlockDefinition[] => {
    return BLOCK_DEFINITIONS.filter(b => b.category === category);
};

// Category metadata for UI
export const CATEGORY_INFO: Record<BlockCategory, { label: string; icon: string; color: string }> = {
    event: { label: 'Gebeurtenissen', icon: '🚀', color: COLORS.event },
    motion: { label: 'Beweging', icon: '➡️', color: COLORS.motion },
    control: { label: 'Besturing', icon: '🔁', color: COLORS.control },
    variable: { label: 'Variabelen', icon: '📊', color: COLORS.variable },
};
