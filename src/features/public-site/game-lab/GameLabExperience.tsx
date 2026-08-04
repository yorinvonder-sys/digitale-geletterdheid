import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { PlayableGame } from '@/features/public-site/game-lab/PlayableGame';
import { GameLabChat } from '@/features/public-site/game-lab/GameLabChat';
import { DEFAULT_GAME_SPEC, parseGameSpec } from '@/features/public-site/game-lab/gameSpec';
import type { GameSpec } from '@/features/public-site/game-lab/gameSpec';

/**
 * Het interactieve blok van het game-lab: speelveld links, chat rechts.
 *
 * Bewust zonder kop, sectie of achtergrond — de pagina die dit inbedt levert de
 * eigen typografie aan (op `/verhaal` is dat een hoofdstuk met `ChapterMarker`).
 * Zo blijft dit component herbruikbaar zonder dat er twee koppen boven elkaar
 * komen te staan.
 */

const MAX_PROMPTS = 10;

const GameLabExperience: React.FC = () => {
    const [spec, setSpec] = useState<GameSpec>(() => structuredClone(DEFAULT_GAME_SPEC) as GameSpec);
    const specRef = useRef(spec);
    useEffect(() => { specRef.current = spec; }, [spec]);
    const reduceMotion = usePrefersReducedMotion();

    // Geeft terug of het antwoord echt een nieuwe staat opleverde; de chat
    // gebruikt dat om een no-op niet als succes te presenteren.
    const handleAssistantText = useCallback((rawText: string) => {
        const result = parseGameSpec(rawText, specRef.current);
        specRef.current = result.spec;
        if (result.applied) setSpec(result.spec);
        return result.applied;
    }, []);

    return (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
                <PlayableGame spec={spec} reduceMotion={reduceMotion} />

            </div>

            <GameLabChat currentSpec={spec} onAssistantText={handleAssistantText} maxMessages={MAX_PROMPTS} />
        </div>
    );
};

export default GameLabExperience;
