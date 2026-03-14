
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pencil, RotateCcw, Sparkles, Clock, Check, X, Trophy, ArrowRight, Loader2, Brain, BarChart3, Database, LogOut, Swords } from 'lucide-react';
import { DuelLobby } from './games/DrawingDuel/DuelLobby';
import { DuelGame } from './games/DrawingDuel/DuelGame';
import { DuelWaitingRoom } from './games/DrawingDuel/DuelWaitingRoom';
import { ChallengeToast } from './games/DrawingDuel/ChallengeToast';
import { MissionConclusion } from './MissionConclusion';
import { analyzeDrawingWithAI } from '../services/geminiService';
import { DuelChallenge, subscribeToChallenges, respondToChallenge, setPlayerOnline, setPlayerOffline } from '../services/duelService';
import { blockUser, getBlockedUsers } from '../services/blockingService';

/** State data that can be persisted for this mission */
interface DrawingGamePersistState {
    hasStarted?: boolean;
    currentRound?: number;
    score?: number;
    maxRound?: number;
    gamePrompts?: typeof PROMPTS;
}

interface DrawingGamePreviewProps {
    onLevelComplete?: (level: number) => void;
    onStart?: () => void;
    onXPEarned?: (amount: number, label: string) => void;
    user?: {
        uid: string;
        displayName: string;
        studentClass?: string;
    };
    initialState?: DrawingGamePersistState;
    onSave?: (data: DrawingGamePersistState) => void;
    // R7: Peer Feedback
    enablePeerFeedback?: boolean;
    peerFeedbackProps?: any;
}

// Drawing prompts with pattern keywords, difficulty, and categories for variety
// Exported for use by DuelGame
export const PROMPTS = [
    // 🟢 EASY - Simple shapes
    { word: 'zon', icon: '☀️', patterns: ['cirkel', 'stralen', 'rond'], difficulty: 'easy', category: 'natuur' },
    { word: 'hart', icon: '❤️', patterns: ['punts onderaan', 'twee boogjes'], difficulty: 'easy', category: 'symbolen' },
    { word: 'ster', icon: '⭐', patterns: ['punten', 'vijfhoek'], difficulty: 'easy', category: 'symbolen' },
    { word: 'wolk', icon: '☁️', patterns: ['bolletjes', 'luchtig', 'wit'], difficulty: 'easy', category: 'natuur' },
    { word: 'maan', icon: '🌙', patterns: ['sikkel', 'boog', 'rond'], difficulty: 'easy', category: 'natuur' },
    { word: 'appel', icon: '🍎', patterns: ['rond', 'steeltje', 'blaadje'], difficulty: 'easy', category: 'eten' },

    // 🟡 MEDIUM - More detail needed
    { word: 'kat', icon: '🐱', patterns: ['oren', 'snorharen', 'staart', 'rond hoofd'], difficulty: 'medium', category: 'dieren' },
    { word: 'huis', icon: '🏠', patterns: ['dak', 'raam', 'deur', 'rechthoek'], difficulty: 'medium', category: 'gebouwen' },
    { word: 'bloem', icon: '🌸', patterns: ['bladeren', 'stam', 'blaadjes'], difficulty: 'medium', category: 'natuur' },
    { word: 'auto', icon: '🚗', patterns: ['wielen', 'ramen', 'rechthoek'], difficulty: 'medium', category: 'voertuigen' },
    { word: 'boom', icon: '🌳', patterns: ['stam', 'bladeren', 'kroon'], difficulty: 'medium', category: 'natuur' },
    { word: 'vis', icon: '🐟', patterns: ['staart', 'vinnen', 'schubben'], difficulty: 'medium', category: 'dieren' },
    { word: 'bril', icon: '👓', patterns: ['twee cirkels', 'pootjes', 'brug'], difficulty: 'medium', category: 'objecten' },
    { word: 'boot', icon: '⛵', patterns: ['zeil', 'romp', 'mast'], difficulty: 'medium', category: 'voertuigen' },

    // 🔴 HARD - Complex shapes
    { word: 'vlinder', icon: '🦋', patterns: ['vleugels', 'symmetrie', 'lijf'], difficulty: 'hard', category: 'dieren' },
    { word: 'fiets', icon: '🚲', patterns: ['wielen', 'stuur', 'zadel', 'frame'], difficulty: 'hard', category: 'voertuigen' },
    { word: 'vogel', icon: '🐦', patterns: ['snavel', 'vleugels', 'poten'], difficulty: 'hard', category: 'dieren' },
    { word: 'pizza', icon: '🍕', patterns: ['driehoek', 'toppings', 'korst'], difficulty: 'hard', category: 'eten' },
    { word: 'robot', icon: '🤖', patterns: ['vierkant hoofd', 'antennes', 'armen'], difficulty: 'hard', category: 'technologie' },
    { word: 'raket', icon: '🚀', patterns: ['punt', 'vlammen', 'vinnen'], difficulty: 'hard', category: 'technologie' },
];

// Educational AI facts that rotate during gameplay
const AI_FACTS = [
    { emoji: '🎬', fact: 'Netflix en Spotify gebruiken AI om films en muziek aan te raden die jij leuk vindt, gebaseerd op je geschiedenis.' },
    { emoji: '📧', fact: 'Spamfilters in je mail gebruiken AI om miljoenen e-mails te scannen en ongewenste berichten te blokkeren.' },
    { emoji: '🚜', fact: 'Slimme landbouwmachines gebruiken camera\'s en AI om onkruid te herkennen en alleen daar te spuiten.' },
    { emoji: '🩺', fact: 'AI helpt artsen door röntgenfoto\'s te scannen op kleine afwijkingen die mensen soms over het hoofd zien.' },
    { emoji: '🗺️', fact: 'Google Maps gebruikt AI om verkeersdrukte te voorspellen en de snelste route voor je te berekenen.' },
    { emoji: '🗣️', fact: 'Vertaalcomputers gebruiken slimme AI-modellen om direct spraak en tekst te vertalen naar andere talen.' },
    { emoji: '🏠', fact: 'Slimme thermostaten leren van jouw gedrag via AI om energie te besparen als je niet thuis bent.' },
    { emoji: '🎮', fact: 'In games worden computertegenstanders (NPC\'s) aangestuurd door AI om slim op jouw acties te reageren.' },
    { emoji: '🚁', fact: 'Drones inspecteren windmolens en bruggen met AI om schade te vinden zonder dat mensen hoeven te klimmen.' },
    { emoji: '📱', fact: 'Gezichtsherkenning op je iPad gebruikt AI om je gezicht in 3D te scannen, zelfs in het donker.' },
];

interface Prediction {
    label: string;
    confidence: number;
}

interface AnalysisResult {
    guesses: Prediction[];
    mainGuess: string;
    success: boolean;
    reasoning: string;
    layerActivations: number[]; // For neural viz
}


// Real pattern detection based on drawing characteristics
const analyzeDrawing = (canvas: HTMLCanvasElement, targetWord: string): AnalysisResult => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return {
        guesses: [], mainGuess: '???', success: false, reasoning: 'Geen tekening', layerActivations: []
    };

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    // Analyze drawing properties
    let drawnPixels = 0;
    let minX = width, maxX = 0, minY = height, maxY = 0;
    let centerMassX = 0, centerMassY = 0;

    // Scan for drawn pixels and find bounding box
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            // Check if pixel is dark (drawn)
            if (pixels[idx] < 200 || pixels[idx + 1] < 200 || pixels[idx + 2] < 200) {
                drawnPixels++;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                centerMassX += x;
                centerMassY += y;
            }
        }
    }

    const coverage = drawnPixels / (width * height);

    // Not enough drawing
    if (coverage < 0.01 || drawnPixels < 50) {
        return {
            guesses: [{ label: '???', confidence: 0 }],
            mainGuess: '???',
            success: false,
            reasoning: "Ik zie nog te weinig lijnen. Teken iets meer details!",
            layerActivations: [0.1, 0.1, 0.1, 0.1, 0.1]
        };
    }

    // Calculate drawing characteristics
    centerMassX /= drawnPixels;
    centerMassY /= drawnPixels;

    const drawingWidth = maxX - minX;
    const drawingHeight = maxY - minY;
    const aspectRatio = drawingWidth / Math.max(drawingHeight, 1);

    // Check for specific regions being filled (top, bottom, center)
    const topThird = countPixelsInRegion(pixels, width, height, minX, maxX, minY, minY + drawingHeight / 3);
    const middleThird = countPixelsInRegion(pixels, width, height, minX, maxX, minY + drawingHeight / 3, minY + 2 * drawingHeight / 3);
    const bottomThird = countPixelsInRegion(pixels, width, height, minX, maxX, minY + 2 * drawingHeight / 3, maxY);

    // Check for circular pattern (compare center vs edges)
    const centerDensity = countPixelsInCircle(pixels, width, height, centerMassX, centerMassY, Math.min(drawingWidth, drawingHeight) / 4);
    const edgeDensity = drawnPixels - centerDensity;
    const circularIndex = centerDensity / Math.max(edgeDensity, 1);

    // Analyze shape characteristics
    const isWide = aspectRatio > 1.3;
    const isTall = aspectRatio < 0.7;
    const isSquarish = aspectRatio >= 0.7 && aspectRatio <= 1.3;
    const isCircular = circularIndex > 0.3 && isSquarish;
    const hasHeavyTop = topThird > middleThird * 1.3;
    const hasHeavyBottom = bottomThird > middleThird * 1.3;
    const isSymmetrical = Math.abs(centerMassX - (minX + drawingWidth / 2)) < drawingWidth * 0.15;

    // Calculate scores for each possible word based on characteristics
    const scores: { word: string; score: number; patterns: string[] }[] = PROMPTS.map(prompt => {
        let score = 0;
        const matchedPatterns: string[] = [];

        switch (prompt.word) {
            case 'kat':
                if (hasHeavyTop) { score += 25; matchedPatterns.push('oren/hoofd'); }
                if (isTall || isSquarish) { score += 20; matchedPatterns.push('rechtop'); }
                if (bottomThird > 0) { score += 15; matchedPatterns.push('pootjes'); }
                break;
            case 'huis':
                if (hasHeavyTop) { score += 30; matchedPatterns.push('dak'); }
                if (isSquarish || isTall) { score += 25; matchedPatterns.push('rechthoekig'); }
                if (isSymmetrical) { score += 15; matchedPatterns.push('symmetrisch'); }
                break;
            case 'zon':
                if (isCircular) { score += 40; matchedPatterns.push('rond'); }
                if (isSquarish) { score += 20; matchedPatterns.push('cirkel'); }
                if (coverage > 0.03) { score += 10; matchedPatterns.push('stralen'); }
                break;
            case 'bloem':
                if (hasHeavyTop) { score += 25; matchedPatterns.push('bloemblaadjes'); }
                if (isTall) { score += 25; matchedPatterns.push('stam'); }
                if (bottomThird < topThird) { score += 15; matchedPatterns.push('steel'); }
                break;
            case 'auto':
                if (isWide) { score += 35; matchedPatterns.push('breed'); }
                if (hasHeavyBottom) { score += 25; matchedPatterns.push('wielen'); }
                if (!isTall) { score += 10; matchedPatterns.push('laag'); }
                break;
            case 'boom':
                if (isTall) { score += 30; matchedPatterns.push('hoog'); }
                if (hasHeavyTop) { score += 25; matchedPatterns.push('kroon'); }
                if (bottomThird < topThird) { score += 15; matchedPatterns.push('stam'); }
                break;
            case 'vis':
                if (isWide) { score += 35; matchedPatterns.push('breed'); }
                if (isSymmetrical) { score += 15; matchedPatterns.push('gestroomlijnd'); }
                break;
            case 'ster':
                if (isSquarish) { score += 25; matchedPatterns.push('gelijk'); }
                if (isSymmetrical) { score += 20; matchedPatterns.push('symmetrisch'); }
                if (coverage > 0.02 && coverage < 0.15) { score += 15; matchedPatterns.push('punten'); }
                break;
            case 'appel':
                if (isCircular) { score += 35; matchedPatterns.push('rond'); }
                if (isSquarish) { score += 20; matchedPatterns.push('cirkel'); }
                if (hasHeavyTop) { score += 10; matchedPatterns.push('steeltje'); }
                break;
            case 'bril':
                if (isWide) { score += 35; matchedPatterns.push('breed'); }
                if (isSymmetrical) { score += 20; matchedPatterns.push('twee glazen'); }
                if (!isTall) { score += 15; matchedPatterns.push('laag'); }
                break;
            case 'hart':
                if (isSquarish) { score += 20; matchedPatterns.push('gelijk'); }
                if (hasHeavyTop) { score += 25; matchedPatterns.push('boogjes'); }
                if (isSymmetrical) { score += 15; matchedPatterns.push('symmetrisch'); }
                break;
            case 'wolk':
                if (isWide) { score += 30; matchedPatterns.push('breed'); }
                if (isCircular || hasHeavyTop) { score += 20; matchedPatterns.push('bollig'); }
                if (!hasHeavyBottom) { score += 15; matchedPatterns.push('luchtig'); }
                break;
            case 'boot':
                if (isWide) { score += 30; matchedPatterns.push('breed'); }
                if (hasHeavyBottom) { score += 25; matchedPatterns.push('romp'); }
                if (hasHeavyTop) { score += 15; matchedPatterns.push('zeil/mast'); }
                break;
            // NEW PROMPTS
            case 'maan':
                if (isCircular || isSquarish) { score += 30; matchedPatterns.push('rond'); }
                if (coverage < 0.08) { score += 20; matchedPatterns.push('sikkel'); }
                break;
            case 'vlinder':
                if (isWide) { score += 30; matchedPatterns.push('brede vleugels'); }
                if (isSymmetrical) { score += 25; matchedPatterns.push('symmetrisch'); }
                if (hasHeavyTop && hasHeavyBottom) { score += 15; matchedPatterns.push('vleugels'); }
                break;
            case 'fiets':
                if (isWide) { score += 30; matchedPatterns.push('breed'); }
                if (hasHeavyBottom) { score += 25; matchedPatterns.push('wielen'); }
                if (coverage > 0.03) { score += 10; matchedPatterns.push('frame'); }
                break;
            case 'vogel':
                if (isWide || isSquarish) { score += 25; matchedPatterns.push('vleugels'); }
                if (hasHeavyTop) { score += 20; matchedPatterns.push('kop'); }
                break;
            case 'pizza':
                if (isCircular || isSquarish) { score += 30; matchedPatterns.push('rond'); }
                if (coverage > 0.05) { score += 20; matchedPatterns.push('toppings'); }
                break;
            case 'robot':
                if (isTall || isSquarish) { score += 30; matchedPatterns.push('rechthoekig'); }
                if (hasHeavyTop) { score += 20; matchedPatterns.push('hoofd'); }
                if (isSymmetrical) { score += 15; matchedPatterns.push('symmetrisch'); }
                break;
            case 'raket':
                if (isTall) { score += 35; matchedPatterns.push('hoog'); }
                if (hasHeavyTop) { score += 20; matchedPatterns.push('punt'); }
                if (hasHeavyBottom) { score += 15; matchedPatterns.push('vlammen'); }
                break;
        }

        // Add small random variation for realism
        score += Math.random() * 10;

        return { word: prompt.word, score, patterns: matchedPatterns };
    });

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    // Convert to predictions with normalized confidence
    const maxScore = Math.max(...scores.map(s => s.score));
    const guesses: Prediction[] = scores.slice(0, 3).map(s => ({
        label: s.word,
        confidence: Math.min(99, Math.max(5, Math.floor((s.score / Math.max(maxScore, 1)) * 85 + Math.random() * 10)))
    }));

    // Normalize so they sum to ~100
    const total = guesses.reduce((sum, g) => sum + g.confidence, 0);
    if (total > 100) {
        const factor = 95 / total;
        guesses.forEach(g => g.confidence = Math.floor(g.confidence * factor));
    }

    const topGuess = guesses[0];
    const targetPrompt = PROMPTS.find(p => p.word === targetWord);
    const isCorrect = topGuess.label === targetWord;

    let reasoning = "";
    if (isCorrect) {
        const matchedScore = scores.find(s => s.word === targetWord);
        reasoning = `Ik ben ${topGuess.confidence}% zeker! Ik zie patronen: ${matchedScore?.patterns.join(', ') || 'vormen'}.`;
    } else {
        reasoning = `Hmm, dit lijkt meer op een ${topGuess.label}. Voor een ${targetWord} mis ik: ${targetPrompt?.patterns.slice(0, 2).join(', ')}.`;
    }

    return {
        guesses,
        mainGuess: topGuess.label,
        success: isCorrect,
        reasoning,
        layerActivations: scores.slice(0, 5).map(s => s.score / 100)
    };
};

// Helper: Count pixels in a rectangular region
const countPixelsInRegion = (pixels: Uint8ClampedArray, width: number, height: number, x1: number, x2: number, y1: number, y2: number): number => {
    let count = 0;
    for (let y = Math.floor(y1); y < Math.min(Math.floor(y2), height); y++) {
        for (let x = Math.floor(x1); x < Math.min(Math.floor(x2), width); x++) {
            const idx = (y * width + x) * 4;
            if (pixels[idx] < 200) count++;
        }
    }
    return count;
};

// Helper: Count pixels in a circular region
const countPixelsInCircle = (pixels: Uint8ClampedArray, width: number, height: number, cx: number, cy: number, radius: number): number => {
    let count = 0;
    const r2 = radius * radius;
    for (let y = Math.max(0, Math.floor(cy - radius)); y < Math.min(height, Math.floor(cy + radius)); y++) {
        for (let x = Math.max(0, Math.floor(cx - radius)); x < Math.min(width, Math.floor(cx + radius)); x++) {
            const dx = x - cx, dy = y - cy;
            if (dx * dx + dy * dy <= r2) {
                const idx = (y * width + x) * 4;
                if (pixels[idx] < 200) count++;
            }
        }
    }
    return count;
};


export const DrawingGamePreview: React.FC<DrawingGamePreviewProps> = ({ onLevelComplete, onStart, onXPEarned, user, initialState, onSave, enablePeerFeedback, peerFeedbackProps }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [countdown] = useState(0); // Initial countdown set to 0, no setter needed as it's not modified
    const [currentRound, setCurrentRound] = useState(0);
    const [gamePrompts, setGamePrompts] = useState<typeof PROMPTS>([]);
    const [timeLeft, setTimeLeft] = useState(45);
    const [isDrawing, setIsDrawing] = useState(false);
    const [gamePhase, setGamePhase] = useState<'draw' | 'analyzing' | 'result'>('draw');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [score, setScore] = useState(0);
    const [totalRounds] = useState(10);
    const [analysisStep, setAnalysisStep] = useState(0); // For animating the analysis phase
    const [showConclusion, setShowConclusion] = useState(false);
    const [currentFactIndex, setCurrentFactIndex] = useState(0); // For rotating AI facts

    // DUEL MODE STATE
    const [duelMode, setDuelMode] = useState<'off' | 'lobby' | 'waiting' | 'playing'>('off');
    const [activeDuelSession, setActiveDuelSession] = useState<string | null>(null);
    const [incomingChallenge, setIncomingChallenge] = useState<DuelChallenge | null>(null);
    const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const initializedRef = useRef(false);

    // Restore state
    useEffect(() => {
        if (initialState) {
            if (initialState.hasStarted) setHasStarted(true);
            if (initialState.currentRound !== undefined) setCurrentRound(initialState.currentRound);
            if (initialState.score !== undefined) setScore(initialState.score);
            if (initialState.gamePrompts && initialState.gamePrompts.length > 0) {
                setGamePrompts(initialState.gamePrompts);
                initializedRef.current = true;
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        if (!onSave || !hasStarted) return;
        const timer = setTimeout(() => {
            onSave({
                hasStarted,
                currentRound,
                score,
                gamePrompts
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [hasStarted, currentRound, score, gamePrompts, onSave]);

    // Initialize game prompts
    useEffect(() => {
        if (initializedRef.current) return;
        const shuffled = [...PROMPTS].sort(() => Math.random() - 0.5).slice(0, totalRounds);
        setGamePrompts(shuffled);
    }, [totalRounds]);

    // Fetch blocked users on mount
    useEffect(() => {
        if (!user?.uid) return;
        getBlockedUsers(user.uid).then(setBlockedUserIds);
    }, [user?.uid]);

    // Subscribe to incoming duel challenges
    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = subscribeToChallenges(user.uid, (challenges) => {
            // Show the first pending challenge
            if (challenges.length > 0 && !activeDuelSession) {
                setIncomingChallenge(challenges[0]);
            } else {
                setIncomingChallenge(null);
            }
        });

        return () => unsubscribe();
    }, [user?.uid, activeDuelSession, blockedUserIds]);

    // Handle accepting a challenge
    const handleAcceptChallenge = async () => {
        if (!incomingChallenge?.id) return;
        await respondToChallenge(incomingChallenge.id, true);
        setActiveDuelSession(incomingChallenge.id);
        setDuelMode('waiting');
        setIncomingChallenge(null);
    };

    // Handle declining a challenge
    const handleDeclineChallenge = async () => {
        if (!incomingChallenge?.id) return;
        await respondToChallenge(incomingChallenge.id, false);
        setIncomingChallenge(null);
    };

    // Handle blocking a user from challenges
    const handleBlockUser = async () => {
        if (!incomingChallenge || !user?.uid) return;
        const success = await blockUser(user.uid, incomingChallenge.challenger_uid, incomingChallenge.challenger_name || 'Unknown');
        if (success) {
            setBlockedUserIds(prev => [...prev, incomingChallenge.challenger_uid]);
        }
    };

    // Intro countdown
    // Countdown effect removed, but game starts immediately now
    /*
    useEffect(() => {
        if (gameState === 'drawing' && countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, gameState]);
    */

    // Drawing timer
    useEffect(() => {
        if (hasStarted && gamePhase === 'draw' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gamePhase === 'draw') {
            submitDrawing();
        }
    }, [timeLeft, hasStarted, gamePhase]);

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current && hasStarted) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.strokeStyle = '#1A1A19';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }
    }, [hasStarted, currentRound]);

    const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ('touches' in e) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }, []);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (gamePhase !== 'draw') return;
        isDrawingRef.current = true;
        lastPosRef.current = getPos(e);
    }, [getPos, gamePhase]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingRef.current || gamePhase !== 'draw') return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPosRef.current = pos;
        setIsDrawing(true);
    }, [getPos, gamePhase]);

    const stopDrawing = useCallback(() => { isDrawingRef.current = false; }, []);

    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        setIsDrawing(false);
    };

    const submitDrawing = async () => {
        if (!canvasRef.current || !gamePrompts[currentRound]) return;

        setGamePhase('analyzing');
        setAnalysisStep(0);

        // Step 1: Convert canvas to base64 for AI analysis
        setAnalysisStep(1);
        const imageBase64 = canvasRef.current.toDataURL('image/png').split(',')[1];
        await new Promise(resolve => setTimeout(resolve, 600));

        // Step 2: Send to Gemini AI for real analysis
        setAnalysisStep(2);
        const possibleLabels = PROMPTS.map(p => p.word);
        let analysisResult: AnalysisResult;

        try {
            const aiResult = await analyzeDrawingWithAI(imageBase64, possibleLabels);

            // Step 3: Process AI response
            setAnalysisStep(3);
            await new Promise(resolve => setTimeout(resolve, 400));

            if (aiResult.guesses.length > 0) {
                // Use real AI analysis
                const targetWord = gamePrompts[currentRound].word;
                analysisResult = {
                    guesses: aiResult.guesses,
                    mainGuess: aiResult.mainGuess,
                    success: aiResult.mainGuess.toLowerCase() === targetWord.toLowerCase(),
                    reasoning: aiResult.reasoning,
                    layerActivations: aiResult.guesses.map(g => g.confidence / 100)
                };
            } else {
                // Fallback to local analysis if AI failed
                analysisResult = analyzeDrawing(canvasRef.current!, gamePrompts[currentRound].word);
            }
        } catch (error) {
            console.warn('AI analysis failed, using local fallback:', error);
            setAnalysisStep(3);
            await new Promise(resolve => setTimeout(resolve, 400));
            // Fallback to local pattern detection
            analysisResult = analyzeDrawing(canvasRef.current!, gamePrompts[currentRound].word);
        }

        setResult(analysisResult);

        if (analysisResult.success) {
            setScore(s => s + 100);
        }

        setGamePhase('result');
    };

    const nextRound = () => {
        if (currentRound < totalRounds - 1) {
            setCurrentRound(r => r + 1);
            setTimeLeft(45);
            setGamePhase('draw');
            setResult(null);
            setIsDrawing(false);
            setCurrentFactIndex(prev => (prev + 1) % AI_FACTS.length); // Rotate to next fact
            setTimeout(clearCanvas, 100);
        } else {
            // FINISHED
            setShowConclusion(true);
            if (onLevelComplete) onLevelComplete(1);
        }
    };

    const currentPrompt = gamePrompts[currentRound];

    // CHALLENGE TOAST - always render when there's an incoming challenge
    const challengeToast = incomingChallenge && duelMode !== 'playing' ? (
        <ChallengeToast
            challenge={incomingChallenge}
            onAccept={handleAcceptChallenge}
            onDecline={handleDeclineChallenge}
            onBlock={handleBlockUser}
        />
    ) : null;

    // DUEL LOBBY SCREEN
    if (duelMode === 'lobby' && user) {
        return (
            <>
                {challengeToast}
                <DuelLobby
                    currentUser={{
                        uid: user.uid,
                        displayName: user.displayName,
                        studentClass: user.studentClass || ''
                    }}
                    onBack={() => setDuelMode('off')}
                    onChallengeAccepted={(sessionId) => {
                        setActiveDuelSession(sessionId);
                        setDuelMode('waiting');
                    }}
                    onStartSolo={() => {
                        setDuelMode('off');
                        setHasStarted(true);
                        onStart?.();
                    }}
                />
            </>
        );
    }

    // DUEL WAITING ROOM SCREEN
    if (duelMode === 'waiting' && activeDuelSession && user) {
        return (
            <DuelWaitingRoom
                sessionId={activeDuelSession}
                currentUserId={user.uid}
                onGameStart={() => setDuelMode('playing')}
                onExit={() => {
                    setDuelMode('off');
                    setActiveDuelSession(null);
                }}
            />
        );
    }

    // DUEL GAME SCREEN
    if (duelMode === 'playing' && activeDuelSession && user) {
        return (
            <DuelGame
                sessionId={activeDuelSession}
                currentUserId={user.uid}
                onExit={() => {
                    setDuelMode('off');
                    setActiveDuelSession(null);
                }}
                onXPEarned={onXPEarned}
            />
        );
    }

    // INTRO SCREEN
    if (!hasStarted) {
        return (
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#FAF9F0' }}>
                {challengeToast}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                    <div className="relative mb-6">
                        <img src="/mascot/pip-excited.webp" alt="Pip" className="w-20 h-20 object-contain" loading="lazy" />
                    </div>
                    <h2 className="text-2xl font-black mb-2 text-center" style={{ color: '#1A1A19' }}>AI Tekengame 2.0</h2>
                    <p className="text-center max-w-sm mb-4 text-sm" style={{ color: '#6B6B66' }}>
                        Leer hoe een Neuraal Netwerk jouw tekeningen ziet! De AI analyseert pixels, zoekt patronen en berekent de waarschijnlijkheid.
                    </p>

                    {/* Stappenplan voor duidelijkheid */}
                    <div className="w-full max-w-sm mb-6 rounded-xl p-4 text-sm" style={{ backgroundColor: '#EEF2FF', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <p className="font-bold mb-2" style={{ color: '#6366F1' }}>Zo werkt het spel:</p>
                        <ol className="space-y-1.5" style={{ color: '#3D3D38' }}>
                            <li className="flex gap-2"><span className="font-bold shrink-0" style={{ color: '#6366F1' }}>1.</span> Je krijgt een woord te zien (bijvoorbeeld &quot;kat&quot; of &quot;huis&quot;)</li>
                            <li className="flex gap-2"><span className="font-bold shrink-0" style={{ color: '#6366F1' }}>2.</span> Teken het woord op het tekenveld hieronder</li>
                            <li className="flex gap-2"><span className="font-bold shrink-0" style={{ color: '#6366F1' }}>3.</span> De AI bekijkt je tekening en raadt wat het is</li>
                            <li className="flex gap-2"><span className="font-bold shrink-0" style={{ color: '#6366F1' }}>4.</span> Hoe beter de AI het herkent, hoe meer punten je krijgt!</li>
                        </ol>
                        <p className="mt-3 text-xs" style={{ color: '#6B6B66' }}>
                            Teken hier! Gebruik je muis of vinger om te tekenen.
                        </p>
                    </div>

                    {/* Solo Mode Button */}
                    <button onClick={() => { setHasStarted(true); onStart?.(); }} disabled={countdown > 0} className={`w-full max-w-sm px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${countdown <= 0 ? 'shadow-lg hover:scale-105 cursor-pointer' : 'cursor-not-allowed opacity-50'}`} style={{ backgroundColor: countdown <= 0 ? '#6366F1' : '#E8E6DF', color: countdown <= 0 ? '#FFFFFF' : '#6B6B66' }}>
                        {countdown > 0 ? <span>{countdown} - Lees de uitleg...</span> : <> <Pencil size={24} /> Solo Training </>}
                    </button>

                    {/* Duel Mode Button - Only show if user has class */}
                    {user?.studentClass && (
                        <button
                            onClick={() => setDuelMode('lobby')}
                            className="w-full max-w-sm px-6 py-4 mt-3 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:scale-105"
                            style={{ backgroundColor: '#2A9D8F', color: '#FFFFFF' }}
                        >
                            <Swords size={24} />
                            Duel een Klasgenoot!
                        </button>
                    )}

                    {!user?.studentClass && (
                        <p className="text-xs mt-4 text-center max-w-xs" style={{ color: '#6B6B66' }}>
                            Om klasgenoten uit te dagen moet je aan een klas zijn toegevoegd.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col relative" style={{ backgroundColor: '#FAF9F0', color: '#3D3D38' }}>
            <div className="px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E6DF' }}>
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{currentPrompt?.icon || '🎨'}</div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#6B6B66' }}>Target</p>
                        <h3 className="font-black text-xl uppercase tracking-wider" style={{ color: '#1A1A19' }}>{currentPrompt?.word}</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {gamePhase === 'draw' && (
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono font-bold text-white ${timeLeft <= 5 ? 'bg-red-500 animate-pulse' : ''}`} style={timeLeft > 5 ? { backgroundColor: '#6366F1' } : {}}>
                            <Clock size={16} /> {timeLeft}s
                        </div>
                    )}
                    <div className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}><Trophy size={14} className="inline mr-1" style={{ color: '#D97757' }} /> {score}</div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}>{currentRound + 1}/{totalRounds}</div>

                    {/* Duel Button - Switch to duel lobby */}
                    {user && (
                        <button
                            onClick={() => {
                                if (user.studentClass) {
                                    setHasStarted(false);
                                    setDuelMode('lobby');
                                } else {
                                    alert('Je moet aan een klas zijn toegevoegd om te kunnen duelleren. Vraag je docent!');
                                }
                            }}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all active:scale-95 text-white"
                            style={{ backgroundColor: user.studentClass ? '#2A9D8F' : '#6B6B66', opacity: user.studentClass ? 1 : 0.7 }}
                            title={user.studentClass ? "Speel tegen klasgenoot" : "Geen klas - kan niet duelleren"}
                        >
                            <Swords size={14} />
                            Duel
                        </button>
                    )}

                    {/* Exit Button */}
                    <button
                        onClick={() => {
                            setHasStarted(false);
                            setDuelMode('off');
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold transition-all"
                        style={{ backgroundColor: '#F0EEE8', color: '#6B6B66' }}
                        title="Terug naar menu"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>

            {showConclusion && (
                <MissionConclusion
                    title="Missie Voltooid: AI Tekengame"
                    description="Je hebt gezien hoe een computer 'kijkt'. Hij ziet geen plaatjes, maar patronen in pixels."
                    aiConcept={{
                        title: "Neural Networks (Neurale Netwerken)",
                        text: "Net als jouw hersenen bestaat AI uit lagen. De eerste laag ziet pixels, de volgende ziet lijnen, dan vormen, en ten slotte herkent het 'een kat'. Soms raakt de AI in de war als de pixels lijken op iets anders!"
                    }}
                    onExit={() => setShowConclusion(false)}
                    enablePeerFeedback={enablePeerFeedback}
                    {...(peerFeedbackProps && {
                        currentUserId: peerFeedbackProps.currentUserId,
                        currentUserName: peerFeedbackProps.currentUserName,
                        targetUserId: peerFeedbackProps.targetUserId,
                        missionId: peerFeedbackProps.missionId,
                        schoolId: peerFeedbackProps.schoolId,
                    })}
                />
            )}

            <div className="flex-1 p-4 flex gap-4 overflow-hidden relative">
                {/* EDUCATIONAL SIDEBAR - ACTIVE DURING ANALYSIS */}
                <div className={`absolute left-4 top-4 bottom-4 w-64 rounded-2xl p-4 transition-all duration-500 transform ${gamePhase !== 'draw' ? 'translate-x-0' : '-translate-x-full opacity-0'}`} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                    <h4 className="font-black mb-4 flex items-center gap-2" style={{ color: '#6366F1' }}>
                        <Brain size={18} /> Hoe AI Denkt
                    </h4>

                    <div className="space-y-4">
                        <div className="p-3 rounded-xl border" style={analysisStep >= 1 ? { backgroundColor: '#EEF2FF', borderColor: '#2A9D8F', color: '#1A1A19' } : { backgroundColor: '#F0EEE8', borderColor: '#E8E6DF', color: '#6B6B66' }}>
                            <div className="text-xs font-bold uppercase mb-1">Stap 1: Input</div>
                            <div className="text-sm">AI scant de pixels van jouw tekening (28x28 grid).</div>
                        </div>
                        <div className="p-3 rounded-xl border" style={analysisStep >= 2 ? { backgroundColor: '#F3EEFF', borderColor: '#8B6F9E', color: '#1A1A19' } : { backgroundColor: '#F0EEE8', borderColor: '#E8E6DF', color: '#6B6B66' }}>
                            <div className="text-xs font-bold uppercase mb-1">Stap 2: Patronen</div>
                            <div className="text-sm">Neurale lagen zoeken naar lijnen, bochten en vormen.</div>
                        </div>
                        <div className="p-3 rounded-xl border" style={analysisStep >= 3 ? { backgroundColor: '#ECFDF5', borderColor: '#10B981', color: '#1A1A19' } : { backgroundColor: '#F0EEE8', borderColor: '#E8E6DF', color: '#6B6B66' }}>
                            <div className="text-xs font-bold uppercase mb-1">Stap 3: Waarschijnlijkheid</div>
                            <div className="text-sm">AI berekent % match met getrainde concepten.</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid #E8E6DF' }}>
                        <div className="rounded-xl p-3" style={{ backgroundColor: '#EEF2FF', border: '1px solid #6366F1', borderColor: 'rgba(99,102,241,0.3)' }}>
                            <p className="text-xs font-bold uppercase mb-1 flex items-center gap-1" style={{ color: '#6366F1' }}>
                                {AI_FACTS[currentFactIndex].emoji} Wist je dat?
                            </p>
                            <p className="text-xs leading-relaxed" style={{ color: '#3D3D38' }}>
                                {AI_FACTS[currentFactIndex].fact}
                            </p>
                        </div>
                    </div>
                </div>

                {/* MAIN VISUAL AREA */}
                <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-500 ${gamePhase !== 'draw' ? 'ml-64' : ''}`}>
                    <div className="relative">
                        <canvas
                            ref={canvasRef}
                            width={400} height={400}
                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing}
                            className={`bg-white rounded-2xl shadow-2xl touch-none transition-all duration-300 w-full max-w-[400px] aspect-square ${gamePhase !== 'draw' ? 'scale-75 opacity-50 blur-[2px]' : 'cursor-crosshair'}`}
                            style={{ touchAction: 'none' }}
                        />

                        {/* ANALYSIS OVERLAY */}
                        {gamePhase === 'analyzing' && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                                <div className="absolute inset-0 animate-pulse rounded-2xl" style={{ backgroundColor: 'rgba(42,157,143,0.1)' }}></div>
                                <div className="backdrop-blur p-6 rounded-2xl flex flex-col items-center text-center shadow-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #E8E6DF' }}>
                                    <Loader2 size={32} className="animate-spin mb-2" style={{ color: '#2A9D8F' }} />
                                    <h3 className="text-xl font-black mb-1" style={{ color: '#1A1A19' }}>
                                        {analysisStep === 1 && "Pixels Scannen..."}
                                        {analysisStep === 2 && "Features Extracten..."}
                                        {analysisStep === 3 && "Vergelijken met Dataset..."}
                                    </h3>
                                </div>
                            </div>
                        )}

                        {/* RESULT OVERLAY */}
                        {gamePhase === 'result' && result && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center">
                                <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#1A1A19' }}>
                                            {result.success ? <Check style={{ color: '#10B981' }} /> : <X className="text-red-500" />}
                                            {result.success ? 'Correct Herkend!' : 'Niet Helemaal...'}
                                        </h3>
                                        <div className="text-xs font-bold uppercase" style={{ color: '#6B6B66' }}>AI Confidence</div>
                                    </div>

                                    {/* PROBABILISTIC RESULTS */}
                                    <div className="space-y-3 mb-6">
                                        {result.guesses.slice(0, 3).map((guess, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span style={{ color: guess.label === currentPrompt?.word ? '#10B981' : '#3D3D38' }}>
                                                        {guess.label.toUpperCase()}
                                                    </span>
                                                    <span style={{ color: '#6B6B66' }}>{guess.confidence}%</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F0EEE8' }}>
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${guess.confidence}%`, backgroundColor: guess.label === currentPrompt?.word ? '#10B981' : '#E8E6DF' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 rounded-lg text-sm mb-4" style={{ backgroundColor: '#FAF9F0', color: '#3D3D38', borderLeft: '2px solid #6366F1' }}>
                                        "{result.reasoning}"
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        {!result.success && (
                                            <button
                                                onClick={() => {
                                                    setGamePhase('draw');
                                                    setResult(null);
                                                    setIsDrawing(false);
                                                }}
                                                className="px-5 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors"
                                                style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}
                                            >
                                                <RotateCcw size={16} /> Probeer Opnieuw
                                            </button>
                                        )}

                                        {result.success && (
                                            currentRound < totalRounds - 1 ? (
                                                <button onClick={nextRound} className="px-5 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors text-white" style={{ backgroundColor: '#6366F1' }}>
                                                    Volgende <ArrowRight size={16} />
                                                </button>
                                            ) : (
                                                <button onClick={nextRound} className="px-5 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition-colors text-white shadow-lg animate-pulse" style={{ backgroundColor: '#10B981' }}>
                                                    Afronden <Trophy size={16} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTROLS - iPad optimized touch targets */}
            {gamePhase === 'draw' && (
                <div className="p-4 flex justify-center gap-4 shrink-0" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E6DF' }}>
                    <button onClick={clearCanvas} className="touch-friendly-btn px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-colors min-h-[56px]" style={{ backgroundColor: '#F0EEE8', color: '#3D3D38' }}><RotateCcw size={20} /> Wissen</button>
                    <button onClick={submitDrawing} disabled={!isDrawing} className="touch-friendly-btn px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 min-h-[56px] text-white" style={{ backgroundColor: isDrawing ? '#10B981' : '#E8E6DF', color: isDrawing ? '#FFFFFF' : '#6B6B66' }}><Check size={20} /> Klaar!</button>
                </div>
            )}
        </div>
    );
};
