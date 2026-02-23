import { PlacedBlock, getBlockById, GameContext } from './BlockTypes';

/**
 * BlockExecutor - Interprets and executes assembled code blocks
 * 
 * This runs on each game tick to process event-driven blocks
 * and their associated actions.
 */
export class BlockExecutor {
    private blocks: PlacedBlock[];
    private ctx: GameContext;
    private static gameStartExecuted = false;
    private static previousKeyStates: Record<string, boolean> = {};

    constructor(blocks: PlacedBlock[], ctx: GameContext) {
        this.blocks = blocks;
        this.ctx = ctx;
    }

    /**
     * Reset the executor state (call when game resets)
     */
    static reset(): void {
        BlockExecutor.gameStartExecuted = false;
        BlockExecutor.previousKeyStates = {};
    }

    /**
     * Execute all blocks for the current frame
     * Processes event blocks and their children/followers
     */
    execute(): void {
        let currentEventActive = false;

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            const definition = getBlockById(block.definitionId);
            if (!definition) continue;

            // Check if this is an event block
            if (definition.isEvent) {
                // Evaluate the event condition
                if (definition.id === 'when_game_starts') {
                    // Only run ONCE when game starts
                    if (!BlockExecutor.gameStartExecuted) {
                        BlockExecutor.gameStartExecuted = true;
                        currentEventActive = true;
                        // Execute children nested inside this event block
                        if (block.children) {
                            for (const child of block.children) {
                                this.executeBlock(child);
                            }
                        }
                    } else {
                        currentEventActive = false;
                    }
                } else if (definition.id === 'when_key_pressed') {
                    // Check if the specified key was JUST pressed (edge detection)
                    const key = block.inputs['key'];
                    const isPressed = this.ctx.keys[key] === true;
                    const wasPressed = BlockExecutor.previousKeyStates[key] === true;

                    // Only trigger on the rising edge (key just pressed)
                    currentEventActive = isPressed && !wasPressed;

                    // Execute children nested inside this event block when key is pressed
                    if (currentEventActive && block.children) {
                        for (const child of block.children) {
                            this.executeBlock(child);
                        }
                    }
                }
            } else if (currentEventActive) {
                // Execute non-event blocks if we're in an active event chain
                this.executeBlock(block);
            }
        }

        // Update previous key states for next frame
        BlockExecutor.previousKeyStates = { ...this.ctx.keys };
    }

    /**
     * Execute a single block and its children
     */
    private executeBlock(block: PlacedBlock): void {
        const definition = getBlockById(block.definitionId);
        if (!definition) return;

        // Create a function to run children (for control blocks)
        const runChildren = () => {
            if (block.children) {
                for (const child of block.children) {
                    this.executeBlock(child);
                }
            }
        };

        // Execute the block's logic
        try {
            // Throttle logs: only log 1% of the time for repetitive actions
            const originalLog = this.ctx.log;
            const throttledLog = (msg: string) => {
                if (Math.random() < 0.01) {
                    originalLog(msg);
                }
            };

            // Use throttled log for high-frequency blocks
            if (definition.category === 'motion') {
                definition.execute({ ...this.ctx, log: throttledLog }, block.inputs, runChildren);
            } else {
                definition.execute(this.ctx, block.inputs, runChildren);
            }
        } catch (error) {
            console.error(`Error executing block ${block.definitionId}:`, error);
            this.ctx.log(`❌ Fout in blok: ${definition.label}`);
        }
    }
}

/**
 * Factory function to create an executor for current state
 */
export const createExecutor = (blocks: PlacedBlock[], ctx: GameContext): BlockExecutor => {
    return new BlockExecutor(blocks, ctx);
};
