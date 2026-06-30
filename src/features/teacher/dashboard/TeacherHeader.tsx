
import React from 'react';
import { MonitorPlay, Eye, LogOut, ToggleRight, ToggleLeft } from 'lucide-react';

interface TeacherHeaderProps {
    focusMode: boolean;
    handleToggleFocusMode: () => void;
    focusModeRemaining: number;
    setShowPresentation: (show: boolean) => void;
    onViewAssignments?: () => void;
    onLogout?: () => void;
}

export const TeacherHeader: React.FC<TeacherHeaderProps> = ({
    focusMode,
    handleToggleFocusMode,
    focusModeRemaining,
    setShowPresentation,
    onViewAssignments,
    onLogout
}) => {
    return (
        <header className="max-w-7xl mx-auto mb-6">
            <div className="bg-white rounded-2xl border border-duck-ink/15 shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Title */}
                    <div>
                        <h1 className="text-2xl font-black text-duck-ink tracking-tight">
                            Docenten Dashboard
                        </h1>
                        <p className="text-duck-ink/60 font-medium text-sm">Beheer je klassen, volg voortgang en stuur je lessen.</p>
                    </div>

                    {/* Right: Action Buttons - Grouped */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Focus Mode Toggle - Compact */}
                        <div data-tutorial="focus-toggle" className="flex items-center gap-2 bg-duck-bg px-3 py-2 rounded-xl border border-duck-ink/15 group relative">
                            <span className="text-xs font-bold text-duck-ink/60">Focus</span>
                            <button
                                onClick={handleToggleFocusMode}
                                aria-label={focusMode ? 'Focus modus uitschakelen' : 'Focus modus inschakelen'}
                                className={`transition-all duration-300 ${focusMode ? 'text-duck-ink' : 'text-duck-ink/60'}`}
                            >
                                {focusMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                            {focusMode && focusModeRemaining > 0 && (
                                <span className="text-[10px] font-bold text-white bg-duck-ink px-2 py-0.5 rounded-full" aria-live="polite">
                                    {Math.floor(focusModeRemaining / 60)}:{String(focusModeRemaining % 60).padStart(2, '0')}
                                </span>
                            )}
                            {/* Tooltip */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-duck-ink text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                <p className="font-bold mb-1">🎯 Focus Modus</p>
                                Dwing alle leerlingen naar één specifieke opdracht om de les te sturen.
                            </div>
                        </div>

                        {/* Presentation Button */}
                        <div className="group relative">
                            <button
                                data-tutorial="presentation-btn"
                                onClick={() => setShowPresentation(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-duck-ink text-white rounded-xl hover:bg-duck-ink/80 transition-colors text-sm font-bold"
                            >
                                <MonitorPlay size={16} />
                                <span className="hidden sm:inline">Presentatie</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-duck-ink text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                <p className="font-bold mb-1">🖥️ Presentatie Scherm</p>
                                Open de QR-code en instructies voor op het digibord.
                            </div>
                        </div>

                        {/* Student View Button */}
                        {onViewAssignments && (
                            <div className="group relative">
                                <button
                                    data-tutorial="student-view-btn"
                                    onClick={onViewAssignments}
                                    className="flex items-center gap-2 px-3 py-2 bg-duck-ink text-white rounded-xl text-sm font-bold hover:bg-duck-ink/80 transition-colors"
                                >
                                    <Eye size={16} />
                                    <span className="hidden sm:inline">Leerling View</span>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-duck-ink text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                    <p className="font-bold mb-1">👁️ Bekijk als Leerling</p>
                                    Zie precies wat jouw leerlingen zien in hun dashboard.
                                </div>
                            </div>
                        )}

                        {/* Logout Button */}
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                aria-label="Uitloggen"
                                className="flex items-center gap-2 px-3 py-2 bg-duck-bg text-duck-ink/60 rounded-xl text-sm font-bold hover:bg-duck-error hover:text-white transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
