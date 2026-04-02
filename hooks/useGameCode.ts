import { useState, useRef, useCallback } from 'react';
import { ChatMessage } from '../types';
import { stripAiProvenance } from '../utils/aiContentMarker';

const GAME_HTML_DOCUMENT_REGEX = /<!doctype html(?:\s[^>]*)?>[\s\S]*?<\/html>/i;
const GAME_HTML_ROOT_REGEX = /<html[\s\S]*?<\/html>/i;
const GAME_HTML_FENCE_REGEX = /```(?:html)?\s*([\s\S]*?)```/i;

export function extractGameHtmlDocument(rawResponse: string): string | null {
    const cleaned = stripAiProvenance(rawResponse).trim();
    if (!cleaned) return null;

    const fullDocumentMatch = cleaned.match(GAME_HTML_DOCUMENT_REGEX);
    if (fullDocumentMatch) {
        return fullDocumentMatch[0].trim();
    }

    const htmlRootMatch = cleaned.match(GAME_HTML_ROOT_REGEX);
    if (htmlRootMatch) {
        return `<!DOCTYPE html>\n${htmlRootMatch[0].trim()}`;
    }

    const fencedCodeMatch = cleaned.match(GAME_HTML_FENCE_REGEX);
    if (fencedCodeMatch) {
        return extractGameHtmlDocument(fencedCodeMatch[1]);
    }

    const looksLikeGameFragment =
        /<canvas\b/i.test(cleaned) &&
        /<script\b/i.test(cleaned) &&
        /<\/script>/i.test(cleaned);

    if (looksLikeGameFragment) {
        return [
            '<!DOCTYPE html>',
            '<html lang="nl">',
            '<head>',
            '  <meta charset="UTF-8" />',
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
            '  <title>Game Preview</title>',
            '</head>',
            '<body>',
            cleaned,
            '</body>',
            '</html>',
        ].join('\n');
    }

    return null;
}

export function stripGameCodeFromResponse(rawResponse: string): string {
    return stripAiProvenance(rawResponse)
        .replace(GAME_HTML_DOCUMENT_REGEX, '')
        .replace(GAME_HTML_ROOT_REGEX, '')
        .replace(GAME_HTML_FENCE_REGEX, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

interface UseGameCodeProps {
    initialGameCode?: string | null;
}

export const useGameCode = ({ initialGameCode = null }: UseGameCodeProps = {}) => {
    const [activeGameCode, setActiveGameCode] = useState<string | null>(initialGameCode);
    const [gameCodeHistory, setGameCodeHistory] = useState<string[]>([]);
    const previousGameCodeRef = useRef<string | null>(null);

    const pushToHistory = useCallback((code: string) => {
        setGameCodeHistory(prev => [...prev.slice(-9), code]);
    }, []);

    const undoGameCode = useCallback((setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
        if (gameCodeHistory.length === 0) return;

        const previousCode = gameCodeHistory[gameCodeHistory.length - 1];
        setGameCodeHistory(prev => prev.slice(0, -1));
        setActiveGameCode(previousCode);
        previousGameCodeRef.current = previousCode;

        setMessages(prev => [...prev, {
            role: 'model',
            text: '↩️ **Vorige versie hersteld!**\nDe game is teruggezet naar de vorige werkende versie.',
            timestamp: new Date()
        }]);
    }, [gameCodeHistory]);

    return {
        activeGameCode,
        setActiveGameCode,
        gameCodeHistory,
        pushToHistory,
        previousGameCodeRef,
        undoGameCode,
    };
};
