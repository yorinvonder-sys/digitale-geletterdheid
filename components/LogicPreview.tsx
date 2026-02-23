
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

interface LogicPreviewProps {
    code: string | null;
    onStart?: () => void;
    onLevelComplete?: (level: number) => void;
}

// Cell types for the grid
type CellType = '.' | '#' | 'S' | 'K' | 'B' | '~';

// Level configuration
interface Level {
    name: string;
    grid: CellType[][];
    startPos: { x: number; y: number };
    startDir: number; // 0=E, 1=S, 2=W, 3=N
}

const LEVELS: Level[] = [
    {
        name: "Eerste Stappen",
        grid: [
            ['S', '.', '.', 'B', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    },
    {
        name: "Draai & Zoek",
        grid: [
            ['S', '.', '.'],
            ['.', '#', '.'],
            ['.', 'B', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    },
    {
        name: "Twee Botjes",
        grid: [
            ['S', '.', 'B', '.', '.'],
            ['.', '#', '#', '.', '.'],
            ['.', '.', '.', 'B', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    },
    {
        name: "Doolhof",
        grid: [
            ['S', '.', '#', 'B', '.'],
            ['.', '#', '.', '#', '.'],
            ['.', '.', '.', '.', '.'],
            ['#', '#', '.', '#', 'B'],
            ['.', '.', '.', '.', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    },
    {
        name: "Boomgaard",
        grid: [
            ['S', '.', '#', '.', 'B', '.', '.'],
            ['.', '#', '.', '#', '.', '#', '.'],
            ['.', '.', 'B', '.', '.', '.', '.'],
            ['#', '#', '.', '#', '#', '.', '#'],
            ['.', '.', '.', 'B', '.', '.', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    },
    {
        name: "Meesterspeurder",
        grid: [
            ['S', '.', '#', '.', 'B', '.', '.', '.'],
            ['.', '.', '#', '.', '#', '#', '.', '#'],
            ['.', '#', '.', '.', '.', '.', 'B', '.'],
            ['.', '.', '.', '#', '#', '.', '#', '.'],
            ['#', '#', '.', '.', 'B', '.', '.', '.'],
            ['.', 'B', '.', '#', '#', '.', '#', 'K'],
        ],
        startPos: { x: 0, y: 0 },
        startDir: 0
    }
];

export const LogicPreview: React.FC<LogicPreviewProps> = ({ code, onStart, onLevelComplete }) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [robotPos, setRobotPos] = useState({ x: 0, y: 0, dir: 0 });
    const [collectedBones, setCollectedBones] = useState<Set<string>>(new Set());
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'idle' | 'running' | 'crashed' | 'success' | 'incomplete'>('idle');
    const [lives, setLives] = useState(3);
    const [hasStarted, setHasStarted] = useState(false);

    const level = LEVELS[currentLevel];
    const totalBones = level.grid.flat().filter(c => c === 'B').length;

    useEffect(() => {
        resetLevel();
    }, [code, currentLevel]);

    const resetLevel = () => {
        const lvl = LEVELS[currentLevel];
        setRobotPos({ ...lvl.startPos, dir: lvl.startDir });
        setCollectedBones(new Set());
        setLogs([]);
        setStatus('idle');
        setIsRunning(false);
    };

    const fullReset = () => {
        setCurrentLevel(0);
        setLives(3);
        resetLevel();
    };

    // INTRO SCREEN
    if (!code && !hasStarted) {
        return (
            <div className="w-full h-full flex flex-col bg-gradient-to-br from-amber-900 to-orange-950 text-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute text-2xl" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}>🐾</div>
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-amber-800/20 via-transparent to-orange-950"></div>

                <div className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 overflow-y-auto">
                    {/* Header met Robbie */}
                    <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 text-4xl">
                            🐕
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-300 rounded-full flex items-center justify-center text-sm shadow-lg">
                            🦴
                        </div>
                    </div>

                    <h2 className="text-xl font-black text-white mb-1 tracking-tight text-center">
                        🎮 Robbie de Speurhond
                    </h2>
                    <p className="text-amber-300 text-sm font-bold mb-4">Leer programmeren door Robbie te besturen!</p>

                    {/* WAT GA JE DOEN - Duidelijke uitleg */}
                    <div className="bg-amber-950/60 backdrop-blur border-2 border-amber-500/50 rounded-2xl p-4 max-w-md w-full mb-4">
                        <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                            📋 Wat Ga Je Doen?
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-3 bg-amber-900/40 rounded-xl p-3">
                                <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0">1</span>
                                <div>
                                    <p className="text-white font-bold">Chat met Robbie in de chatbalk links</p>
                                    <p className="text-amber-400 text-xs">Typ commando's zoals "stap" of "draai rechts"</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-amber-900/40 rounded-xl p-3">
                                <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0">2</span>
                                <div>
                                    <p className="text-white font-bold">Robbie stuurt je code terug</p>
                                    <p className="text-amber-400 text-xs">De code verschijnt dan hier in dit venster</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-amber-900/40 rounded-xl p-3">
                                <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0">3</span>
                                <div>
                                    <p className="text-white font-bold">Klik op RUN om de code uit te voeren</p>
                                    <p className="text-amber-400 text-xs">Kijk of Robbie alle botjes 🦴 vindt!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DE 3 COMMANDO'S */}
                    <div className="bg-amber-950/50 backdrop-blur border border-amber-700/50 rounded-2xl p-4 max-w-md w-full mb-4">
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            🐾 De 3 Commando's Die Robbie Begrijpt
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-amber-900/50 rounded-xl p-2 text-center border border-amber-700/50">
                                <code className="text-amber-200 font-bold text-xs">stap</code>
                                <p className="text-amber-500 text-[9px] mt-1">1 hokje vooruit</p>
                            </div>
                            <div className="bg-amber-900/50 rounded-xl p-2 text-center border border-amber-700/50">
                                <code className="text-amber-200 font-bold text-xs">draai links</code>
                                <p className="text-amber-500 text-[9px] mt-1">90° draaien</p>
                            </div>
                            <div className="bg-amber-900/50 rounded-xl p-2 text-center border border-amber-700/50">
                                <code className="text-amber-200 font-bold text-xs">draai rechts</code>
                                <p className="text-amber-500 text-[9px] mt-1">90° draaien</p>
                            </div>
                        </div>
                    </div>

                    {/* HET DOEL */}
                    <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-3 max-w-md w-full mb-4">
                        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">🎯 Het Doel</h3>
                        <div className="flex items-center justify-center gap-4 text-white text-sm">
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">🦴</span>
                                <span className="text-[10px] text-emerald-300">Pak alle botjes</span>
                            </div>
                            <span className="text-emerald-400 font-bold">→</span>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">🏠</span>
                                <span className="text-[10px] text-emerald-300">Ga naar het hok</span>
                            </div>
                        </div>
                    </div>

                    {onStart && (
                        <button
                            onClick={() => {
                                setHasStarted(true);
                                onStart?.();
                            }}
                            className="w-full max-w-md bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            🐾 Ik Snap Het - Start!
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const runCode = async () => {
        if (isRunning || !code) return;
        setIsRunning(true);
        setStatus('running');

        const lvl = LEVELS[currentLevel];
        let currentX = lvl.startPos.x;
        let currentY = lvl.startPos.y;
        let currentDir = lvl.startDir;
        let localCollected = new Set<string>();

        setRobotPos({ x: currentX, y: currentY, dir: currentDir });
        setCollectedBones(new Set());
        setLogs([]);

        const lines = code.split('\n')
            .map(l => l.trim().toLowerCase())
            .filter(l => l.length > 0 && !l.startsWith('//'));

        let crashed = false;
        const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const line of lines) {
            if (crashed) break;
            await wait(400);

            if (line.includes('stap') || line.includes('move') || line.includes('vooruit')) {
                let nextX = currentX;
                let nextY = currentY;

                if (currentDir === 0) nextX++;
                else if (currentDir === 1) nextY++;
                else if (currentDir === 2) nextX--;
                else if (currentDir === 3) nextY--;

                const gridHeight = lvl.grid.length;
                const gridWidth = lvl.grid[0].length;

                if (
                    nextX < 0 || nextX >= gridWidth ||
                    nextY < 0 || nextY >= gridHeight ||
                    lvl.grid[nextY][nextX] === '#' ||
                    lvl.grid[nextY][nextX] === '~'
                ) {
                    crashed = true;
                    setStatus('crashed');
                    setLives(prev => prev - 1);
                    setLogs(prev => [...prev, `❌ Botsing!`]);
                } else {
                    currentX = nextX;
                    currentY = nextY;
                    setRobotPos({ x: currentX, y: currentY, dir: currentDir });

                    const key = `${currentX},${currentY}`;
                    if (lvl.grid[currentY][currentX] === 'B' && !localCollected.has(key)) {
                        localCollected.add(key);
                        setCollectedBones(new Set(localCollected));
                        setLogs(prev => [...prev, `🦴 Botje gepakt!`]);
                    } else {
                        setLogs(prev => [...prev, `→ Stap`]);
                    }
                }

            } else if (line.includes('rechts') || line.includes('right')) {
                currentDir = (currentDir + 1) % 4;
                setRobotPos({ x: currentX, y: currentY, dir: currentDir });
                setLogs(prev => [...prev, `↻ Draai Rechts`]);

            } else if (line.includes('links') || line.includes('left')) {
                currentDir = (currentDir + 3) % 4;
                setRobotPos({ x: currentX, y: currentY, dir: currentDir });
                setLogs(prev => [...prev, `↺ Draai Links`]);
            }
        }

        if (!crashed) {
            const atKennel = lvl.grid[currentY][currentX] === 'K';
            const allBonesCollected = localCollected.size >= totalBones;

            if (atKennel && allBonesCollected) {
                setStatus('success');
                setLogs(prev => [...prev, `🎉 LEVEL ${currentLevel + 1} VOLTOOID!`]);

                if (onLevelComplete) {
                    onLevelComplete(currentLevel + 1);
                }

                setTimeout(() => {
                    if (currentLevel < LEVELS.length - 1) {
                        setCurrentLevel(prev => prev + 1);
                    }
                }, 1500);
            } else if (atKennel && !allBonesCollected) {
                setStatus('incomplete');
                setLogs(prev => [...prev, `⚠️ Nog ${totalBones - localCollected.size} botje(s) nodig!`]);
            } else {
                setStatus('idle');
                setLogs(prev => [...prev, `⏹️ Nog niet bij het hok 🏠`]);
            }
        }

        setIsRunning(false);
    };

    const renderGrid = () => {
        const lvl = LEVELS[currentLevel];
        return lvl.grid.map((row, y) => (
            <div key={y} className="flex">
                {row.map((cell, x) => {
                    const isRobotHere = robotPos.x === x && robotPos.y === y;
                    const boneKey = `${x},${y}`;
                    const boneCollected = collectedBones.has(boneKey);

                    let bgClass = 'bg-emerald-200 border-emerald-300';
                    let content = null;

                    if (cell === '#') {
                        bgClass = 'bg-amber-700 border-amber-800';
                        content = <span className="text-amber-900 text-lg">🌲</span>;
                    } else if (cell === '~') {
                        bgClass = 'bg-blue-400 border-blue-500';
                        content = <span className="text-blue-600 text-xs">💧</span>;
                    } else if (cell === 'K') {
                        bgClass = 'bg-red-200 border-red-300';
                        content = <span className="text-2xl">🏠</span>;
                    } else if (cell === 'B' && !boneCollected) {
                        content = <span className="text-xl animate-pulse">🦴</span>;
                    }

                    return (
                        <div key={`${x}-${y}`} className={`w-10 h-10 sm:w-11 sm:h-11 border flex items-center justify-center relative ${bgClass}`}>
                            {content}
                            {isRobotHere && (
                                <div
                                    className="absolute transition-all duration-300 z-10"
                                    style={{ transform: `rotate(${robotPos.dir * 90}deg)` }}
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-500 rounded-full shadow-lg flex items-center justify-center text-xl border-2 border-amber-600">
                                        🐕
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        ));
    };

    return (
        <div className="w-full h-full flex flex-col bg-slate-900">
            {/* Orange Header Bar */}
            <div className="bg-orange-500 px-3 py-2 flex justify-between items-center shrink-0 shadow-lg">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-orange-600/50 px-2 py-1 rounded-lg">
                        <span className="text-lg">🦴</span>
                        <span className="text-white font-black text-xs">{collectedBones.size}/{totalBones}</span>
                    </span>
                    <span className="flex items-center gap-0.5 bg-orange-600/50 px-2 py-1 rounded-lg">
                        {[...Array(3)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < lives ? '' : 'opacity-30'}`}>❤️</span>
                        ))}
                    </span>
                    <span className="bg-orange-600/50 px-2 py-1 rounded-lg text-white font-black text-xs hidden sm:block">
                        Lvl {currentLevel + 1}: {level.name}
                    </span>
                </div>
                <div className="flex gap-2">
                    {/* Help/Info button to go back to intro */}
                    <button
                        onClick={() => setHasStarted(false)}
                        className="p-1.5 text-white/60 hover:text-white hover:bg-orange-600 rounded-lg transition-colors"
                        title="Bekijk uitleg"
                    >
                        <HelpCircle size={16} />
                    </button>
                    <button onClick={resetLevel} disabled={isRunning} className="p-1.5 text-white/80 hover:text-white hover:bg-orange-600 rounded-lg transition-colors">
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isRunning || !code}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-orange-600 font-black text-xs rounded-lg transition-all hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        <Play size={14} fill="currentColor" /> RUN
                    </button>
                </div>
            </div>

            {/* Main Content with Grid + Instructions */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Game Area */}
                <div className="flex-1 p-3 overflow-y-auto flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-emerald-800 to-emerald-900">

                    {/* Status Banner */}
                    {status !== 'idle' && status !== 'running' && (
                        <div className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest animate-in zoom-in ${status === 'success' ? 'bg-emerald-500 text-white' :
                            status === 'crashed' ? 'bg-red-500 text-white' :
                                'bg-amber-500 text-white'
                            }`}>
                            {status === 'success' && '🎉 Level Gehaald!'}
                            {status === 'crashed' && '💥 Gecrasht!'}
                            {status === 'incomplete' && '⚠️ Verzamel eerst alle botjes!'}
                        </div>
                    )}

                    {/* Grid */}
                    <div className="border-4 border-amber-800 rounded-xl overflow-hidden shadow-2xl bg-emerald-300">
                        {renderGrid()}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-3 text-[10px] text-emerald-200 font-bold">
                        <span>🐕 Robbie</span>
                        <span>🦴 Botje</span>
                        <span>🏠 Hok</span>
                        <span>🌲 Boom</span>
                    </div>

                    {/* Logs */}
                    <div className="w-full max-w-md max-h-16 overflow-y-auto custom-scrollbar">
                        {logs.slice(-5).map((log, i) => (
                            <div key={i} className="text-[10px] font-mono text-emerald-300/70 pl-2 border-l-2 border-emerald-600 mb-0.5">
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* PERMANENT INSTRUCTIONS PANEL */}
                <div className="w-full md:w-56 bg-slate-800 border-t md:border-t-0 md:border-l border-slate-700 p-3 shrink-0 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <HelpCircle size={14} className="text-amber-400" />
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Commando's</span>
                    </div>

                    <div className="space-y-2">
                        <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                            <code className="text-amber-300 font-bold text-xs">stap</code>
                            <p className="text-slate-400 text-[10px] mt-0.5">1 hokje vooruit</p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                            <code className="text-amber-300 font-bold text-xs">draai links</code>
                            <p className="text-slate-400 text-[10px] mt-0.5">90° naar links draaien</p>
                        </div>
                        <div className="bg-slate-700/50 rounded-lg p-2 border border-slate-600">
                            <code className="text-amber-300 font-bold text-xs">draai rechts</code>
                            <p className="text-slate-400 text-[10px] mt-0.5">90° naar rechts draaien</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Doel</div>
                        <div className="text-slate-300 text-xs leading-relaxed">
                            <span className="text-amber-300">1.</span> Pak alle 🦴<br />
                            <span className="text-amber-300">2.</span> Ga naar 🏠
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="mt-4 pt-3 border-t border-slate-700">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Jouw Code</div>
                        <div className="bg-slate-900 rounded-lg p-2 font-mono text-[10px] text-amber-300 max-h-24 overflow-y-auto whitespace-pre-wrap">
                            {code || "// Wachten..."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Over Overlay */}
            {lives <= 0 && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-2xl p-6 text-center max-w-xs">
                        <div className="text-4xl mb-3">😢</div>
                        <h3 className="text-xl font-black text-white mb-2">Game Over!</h3>
                        <p className="text-slate-400 text-sm mb-4">Je hebt geen levens meer.</p>
                        <button onClick={fullReset} className="w-full py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm">
                            Opnieuw Proberen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
