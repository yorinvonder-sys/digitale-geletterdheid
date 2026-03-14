
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
            <div className="w-full h-full flex flex-col relative overflow-hidden" style={{ backgroundColor: '#FAF9F0' }}>
                <div className="flex-1 flex flex-col items-center justify-start p-6 relative z-10 overflow-y-auto">
                    {/* Header met Pip */}
                    <div className="relative mb-4">
                        <img src="/mascot/pip-excited.webp" alt="Pip" className="w-20 h-20 object-contain" loading="lazy" />
                    </div>

                    <h2 className="text-xl font-black mb-1 tracking-tight text-center" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                        Robbie de Speurhond
                    </h2>
                    <p className="text-sm font-bold mb-4" style={{ color: '#D97757' }}>Leer programmeren door Robbie te besturen!</p>

                    {/* WAT GA JE DOEN */}
                    <div className="rounded-2xl p-4 max-w-md w-full mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                        <h3 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: '#D97757' }}>
                            Wat Ga Je Doen?
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 text-white" style={{ backgroundColor: '#D97757' }}>1</span>
                                <div>
                                    <p className="font-bold" style={{ color: '#1A1A19' }}>Chat met Pip in de chatbalk links</p>
                                    <p className="text-xs" style={{ color: '#6B6B66' }}>Typ commando's zoals "stap" of "draai rechts"</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 text-white" style={{ backgroundColor: '#2A9D8F' }}>2</span>
                                <div>
                                    <p className="font-bold" style={{ color: '#1A1A19' }}>Pip stuurt je code terug</p>
                                    <p className="text-xs" style={{ color: '#6B6B66' }}>De code verschijnt dan hier in dit venster</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 rounded-xl p-3" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <span className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 text-white" style={{ backgroundColor: '#10B981' }}>3</span>
                                <div>
                                    <p className="font-bold" style={{ color: '#1A1A19' }}>Klik op RUN om de code uit te voeren</p>
                                    <p className="text-xs" style={{ color: '#6B6B66' }}>Kijk of Robbie alle botjes vindt!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DE 3 COMMANDO'S */}
                    <div className="rounded-2xl p-4 max-w-md w-full mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2" style={{ color: '#8B6F9E' }}>
                            De 3 Commando's Die Robbie Begrijpt
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <code className="font-bold text-xs" style={{ color: '#D97757' }}>stap</code>
                                <p className="text-[9px] mt-1" style={{ color: '#6B6B66' }}>1 hokje vooruit</p>
                            </div>
                            <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <code className="font-bold text-xs" style={{ color: '#D97757' }}>draai links</code>
                                <p className="text-[9px] mt-1" style={{ color: '#6B6B66' }}>90° draaien</p>
                            </div>
                            <div className="rounded-xl p-2 text-center" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                                <code className="font-bold text-xs" style={{ color: '#D97757' }}>draai rechts</code>
                                <p className="text-[9px] mt-1" style={{ color: '#6B6B66' }}>90° draaien</p>
                            </div>
                        </div>
                    </div>

                    {/* HET DOEL */}
                    <div className="rounded-xl p-3 max-w-md w-full mb-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#10B981' }}>Het Doel</h3>
                        <div className="flex items-center justify-center gap-4 text-sm" style={{ color: '#3D3D38' }}>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">🦴</span>
                                <span className="text-[10px]" style={{ color: '#10B981' }}>Pak alle botjes</span>
                            </div>
                            <span className="font-bold" style={{ color: '#10B981' }}>→</span>
                            <div className="flex flex-col items-center">
                                <span className="text-2xl">🏠</span>
                                <span className="text-[10px]" style={{ color: '#10B981' }}>Ga naar het hok</span>
                            </div>
                        </div>
                    </div>

                    {onStart && (
                        <button
                            onClick={() => {
                                setHasStarted(true);
                                onStart?.();
                            }}
                            className="w-full max-w-md text-white font-bold text-lg py-4 px-8 rounded-full shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                            style={{ backgroundColor: '#D97757' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#D97757')}
                        >
                            Ik Snap Het - Start!
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
                    setLogs(prev => [...prev, `Botsing!`]);
                } else {
                    currentX = nextX;
                    currentY = nextY;
                    setRobotPos({ x: currentX, y: currentY, dir: currentDir });

                    const key = `${currentX},${currentY}`;
                    if (lvl.grid[currentY][currentX] === 'B' && !localCollected.has(key)) {
                        localCollected.add(key);
                        setCollectedBones(new Set(localCollected));
                        setLogs(prev => [...prev, `Botje gepakt!`]);
                    } else {
                        setLogs(prev => [...prev, `Stap`]);
                    }
                }

            } else if (line.includes('rechts') || line.includes('right')) {
                currentDir = (currentDir + 1) % 4;
                setRobotPos({ x: currentX, y: currentY, dir: currentDir });
                setLogs(prev => [...prev, `Draai Rechts`]);

            } else if (line.includes('links') || line.includes('left')) {
                currentDir = (currentDir + 3) % 4;
                setRobotPos({ x: currentX, y: currentY, dir: currentDir });
                setLogs(prev => [...prev, `Draai Links`]);
            }
        }

        if (!crashed) {
            const atKennel = lvl.grid[currentY][currentX] === 'K';
            const allBonesCollected = localCollected.size >= totalBones;

            if (atKennel && allBonesCollected) {
                setStatus('success');
                setLogs(prev => [...prev, `LEVEL ${currentLevel + 1} VOLTOOID!`]);

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
                setLogs(prev => [...prev, `Nog ${totalBones - localCollected.size} botje(s) nodig!`]);
            } else {
                setStatus('idle');
                setLogs(prev => [...prev, `Nog niet bij het hok`]);
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

                    let bgStyle = { backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' };
                    let content = null;

                    if (cell === '#') {
                        bgStyle = { backgroundColor: '#8d6e63', borderColor: '#6d4c41' };
                        content = <span className="text-lg">🌲</span>;
                    } else if (cell === '~') {
                        bgStyle = { backgroundColor: '#81d4fa', borderColor: '#4fc3f7' };
                        content = <span className="text-xs">💧</span>;
                    } else if (cell === 'K') {
                        bgStyle = { backgroundColor: 'rgba(217, 119, 87, 0.15)', borderColor: 'rgba(217, 119, 87, 0.3)' };
                        content = <span className="text-2xl">🏠</span>;
                    } else if (cell === 'B' && !boneCollected) {
                        content = <span className="text-xl animate-pulse">🦴</span>;
                    }

                    return (
                        <div
                            key={`${x}-${y}`}
                            className="w-10 h-10 sm:w-11 sm:h-11 border flex items-center justify-center relative"
                            style={bgStyle}
                        >
                            {content}
                            {isRobotHere && (
                                <div
                                    className="absolute transition-all duration-300 z-10"
                                    style={{ transform: `rotate(${robotPos.dir * 90}deg)` }}
                                >
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full shadow-lg flex items-center justify-center text-xl border-2" style={{ backgroundColor: '#D97757', borderColor: '#C46849' }}>
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
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FAF9F0' }}>
            {/* Header Bar */}
            <div className="px-3 py-2 flex justify-between items-center shrink-0" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E6DF' }}>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(217, 119, 87, 0.08)', border: '1px solid rgba(217, 119, 87, 0.2)' }}>
                        <span className="text-lg">🦴</span>
                        <span className="font-black text-xs" style={{ color: '#D97757' }}>{collectedBones.size}/{totalBones}</span>
                    </span>
                    <span className="flex items-center gap-0.5 px-2 py-1 rounded-lg" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                        {[...Array(3)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < lives ? '' : 'opacity-30'}`}>❤️</span>
                        ))}
                    </span>
                    <span className="px-2 py-1 rounded-lg font-black text-xs hidden sm:block" style={{ backgroundColor: '#FAF9F0', color: '#3D3D38', border: '1px solid #F0EEE8' }}>
                        Lvl {currentLevel + 1}: {level.name}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setHasStarted(false)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#6B6B66' }}
                        title="Bekijk uitleg"
                    >
                        <HelpCircle size={16} />
                    </button>
                    <button onClick={resetLevel} disabled={isRunning} className="p-1.5 rounded-lg transition-colors" style={{ color: '#6B6B66' }}>
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isRunning || !code}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-white font-black text-xs rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        style={{ backgroundColor: '#D97757' }}
                    >
                        <Play size={14} fill="currentColor" /> RUN
                    </button>
                </div>
            </div>

            {/* Main Content with Grid + Instructions */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Game Area */}
                <div className="flex-1 p-3 overflow-y-auto flex flex-col items-center justify-center gap-3" style={{ backgroundColor: '#e8f5e9' }}>

                    {/* Status Banner */}
                    {status !== 'idle' && status !== 'running' && (
                        <div className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest animate-in zoom-in text-white"
                            style={{
                                backgroundColor: status === 'success' ? '#10B981' :
                                    status === 'crashed' ? '#EF4444' : '#D97757'
                            }}
                        >
                            {status === 'success' && 'Level Gehaald!'}
                            {status === 'crashed' && 'Gecrasht!'}
                            {status === 'incomplete' && 'Verzamel eerst alle botjes!'}
                        </div>
                    )}

                    {/* Grid */}
                    <div className="rounded-xl overflow-hidden shadow-2xl" style={{ border: '4px solid #8d6e63', backgroundColor: '#e8f5e9' }}>
                        {renderGrid()}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-3 text-[10px] font-bold" style={{ color: '#6B6B66' }}>
                        <span>🐕 Robbie</span>
                        <span>🦴 Botje</span>
                        <span>🏠 Hok</span>
                        <span>🌲 Boom</span>
                    </div>

                    {/* Logs */}
                    <div className="w-full max-w-md max-h-16 overflow-y-auto custom-scrollbar">
                        {logs.slice(-5).map((log, i) => (
                            <div key={i} className="text-[10px] font-mono pl-2 mb-0.5" style={{ color: '#6B6B66', borderLeft: '2px solid #D97757' }}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* PERMANENT INSTRUCTIONS PANEL */}
                <div className="w-full md:w-56 p-3 shrink-0 overflow-y-auto" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E6DF', borderLeft: '1px solid #E8E6DF' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <HelpCircle size={14} style={{ color: '#D97757' }} />
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#D97757' }}>Commando's</span>
                    </div>

                    <div className="space-y-2">
                        <div className="rounded-lg p-2" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                            <code className="font-bold text-xs" style={{ color: '#D97757' }}>stap</code>
                            <p className="text-[10px] mt-0.5" style={{ color: '#6B6B66' }}>1 hokje vooruit</p>
                        </div>
                        <div className="rounded-lg p-2" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                            <code className="font-bold text-xs" style={{ color: '#D97757' }}>draai links</code>
                            <p className="text-[10px] mt-0.5" style={{ color: '#6B6B66' }}>90° naar links draaien</p>
                        </div>
                        <div className="rounded-lg p-2" style={{ backgroundColor: '#FAF9F0', border: '1px solid #F0EEE8' }}>
                            <code className="font-bold text-xs" style={{ color: '#D97757' }}>draai rechts</code>
                            <p className="text-[10px] mt-0.5" style={{ color: '#6B6B66' }}>90° naar rechts draaien</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F0EEE8' }}>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Doel</div>
                        <div className="text-xs leading-relaxed" style={{ color: '#3D3D38' }}>
                            <span style={{ color: '#D97757' }}>1.</span> Pak alle 🦴<br />
                            <span style={{ color: '#D97757' }}>2.</span> Ga naar 🏠
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F0EEE8' }}>
                        <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#6B6B66' }}>Jouw Code</div>
                        <div className="rounded-lg p-2 font-mono text-[10px] max-h-24 overflow-y-auto whitespace-pre-wrap" style={{ backgroundColor: '#FAF9F0', color: '#D97757', border: '1px solid #F0EEE8' }}>
                            {code || "// Wachten..."}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Over Overlay */}
            {lives <= 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="rounded-2xl p-6 text-center max-w-xs" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E6DF' }}>
                        <div className="text-4xl mb-3">😢</div>
                        <h3 className="text-xl font-black mb-2" style={{ color: '#1A1A19' }}>Game Over!</h3>
                        <p className="text-sm mb-4" style={{ color: '#6B6B66' }}>Je hebt geen levens meer.</p>
                        <button onClick={fullReset} className="w-full py-2.5 text-white font-bold rounded-xl transition-all text-sm" style={{ backgroundColor: '#D97757' }}>
                            Opnieuw Proberen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
