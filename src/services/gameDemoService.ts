/**
 * gameDemoService — client for the public /demo-chat edge function in
 * "flappy-beaver" mode. Used only by the AiGameBuilderDemo on /scholen.
 *
 * The endpoint requires no auth, runs IP-based rate limiting (5/24h), and
 * returns a server-validated config delta. All numeric clamping and color
 * whitelisting happens server-side, so this client just merges the delta
 * into the running game config.
 */

import { EDGE_FUNCTION_URL } from './supabase';

export interface GameConfig {
    gravity: number;
    flapVelocity: number;
    scrollSpeed: number;
    gateGap: number;
    gateInterval: number;
    beaverColor: string | null;
    pipeColor: string | null;
    skyColor: string | null;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
    gravity: 0.10,
    flapVelocity: -2.6,
    scrollSpeed: 0.22,
    gateGap: 56,
    gateInterval: 60,
    beaverColor: null,
    pipeColor: null,
    skyColor: null,
};

export interface GameTweakDelta {
    gravity?: number;
    flapVelocity?: number;
    scrollSpeed?: number;
    gateGap?: number;
    gateInterval?: number;
    beaverColor?: string;
    pipeColor?: string;
    skyColor?: string;
    reset?: boolean;
}

export type GameTweakErrorCode =
    | 'rate_limit'
    | 'blocked'
    | 'bad_request'
    | 'unavailable'
    | 'network';

export interface GameTweakError {
    code: GameTweakErrorCode;
    message: string;
    remaining?: number;
}

export interface GameTweakSuccess {
    ok: true;
    delta: GameTweakDelta;
    reply: string;
    remaining: number | null;
}

export interface GameTweakFailure {
    ok: false;
    error: GameTweakError;
}

export type GameTweakResult = GameTweakSuccess | GameTweakFailure;

/**
 * Apply a server-returned delta to a config. If `reset: true`, returns the
 * default. Color values from the server are already validated hex strings.
 */
export function applyDelta(current: GameConfig, delta: GameTweakDelta): GameConfig {
    if (delta.reset) return { ...DEFAULT_GAME_CONFIG };
    return {
        gravity: typeof delta.gravity === 'number' ? delta.gravity : current.gravity,
        flapVelocity: typeof delta.flapVelocity === 'number' ? delta.flapVelocity : current.flapVelocity,
        scrollSpeed: typeof delta.scrollSpeed === 'number' ? delta.scrollSpeed : current.scrollSpeed,
        gateGap: typeof delta.gateGap === 'number' ? delta.gateGap : current.gateGap,
        gateInterval: typeof delta.gateInterval === 'number' ? delta.gateInterval : current.gateInterval,
        beaverColor: typeof delta.beaverColor === 'string' ? delta.beaverColor : current.beaverColor,
        pipeColor: typeof delta.pipeColor === 'string' ? delta.pipeColor : current.pipeColor,
        skyColor: typeof delta.skyColor === 'string' ? delta.skyColor : current.skyColor,
    };
}

/**
 * Send a natural-language tweak request to the demo edge function.
 * The honeypot field MUST stay empty — only bots fill it in.
 */
export async function tweakGameDemo(
    userMessage: string,
    currentConfig: GameConfig,
    honeypot: string,
): Promise<GameTweakResult> {
    let res: Response;
    try {
        res = await fetch(`${EDGE_FUNCTION_URL}/demo-chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                gameType: 'flappy-beaver',
                currentConfig,
                hp_field: honeypot,
            }),
        });
    } catch {
        return {
            ok: false,
            error: { code: 'network', message: 'Geen verbinding met de AI. Check je internet en probeer opnieuw.' },
        };
    }

    let data: Record<string, unknown> = {};
    try {
        data = await res.json();
    } catch {
        return {
            ok: false,
            error: { code: 'unavailable', message: 'AI gaf een onverwacht antwoord. Probeer het later opnieuw.' },
        };
    }

    if (!res.ok) {
        if (res.status === 429 || data.error === 'demo_limit') {
            return {
                ok: false,
                error: {
                    code: 'rate_limit',
                    message: typeof data.reason === 'string' ? data.reason : 'Promptlimiet bereikt voor vandaag.',
                    remaining: 0,
                },
            };
        }
        if (res.status === 422 || data.error === 'blocked') {
            return {
                ok: false,
                error: {
                    code: 'blocked',
                    message: typeof data.reason === 'string' ? data.reason : 'Dat bericht mag de AI niet verwerken.',
                },
            };
        }
        if (res.status === 400) {
            return {
                ok: false,
                error: {
                    code: 'bad_request',
                    message: typeof data.error === 'string' ? data.error : 'Ongeldig verzoek.',
                },
            };
        }
        return {
            ok: false,
            error: {
                code: 'unavailable',
                message: typeof data.error === 'string' ? data.error : 'AI tijdelijk niet beschikbaar.',
            },
        };
    }

    const delta = (data.delta && typeof data.delta === 'object') ? data.delta as GameTweakDelta : {};
    const reply = typeof data.reply === 'string' ? data.reply : 'Aangepast!';
    const remaining = typeof data.remaining === 'number' ? data.remaining : null;

    return { ok: true, delta, reply, remaining };
}
