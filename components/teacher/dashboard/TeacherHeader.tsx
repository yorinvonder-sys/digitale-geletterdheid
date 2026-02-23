
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
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Title */}
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Docenten Dashboard
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Project 0 DG • Almere College</p>
                    </div>

                    {/* Right: Action Buttons - Grouped */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Focus Mode Toggle - Compact */}
                        <div data-tutorial="focus-toggle" className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 group relative">
                            <span className="text-xs font-bold text-slate-500">Focus</span>
                            <button
                                onClick={handleToggleFocusMode}
                                aria-label={focusMode ? 'Focus modus uitschakelen' : 'Focus modus inschakelen'}
                                className={`transition-all duration-300 ${focusMode ? 'text-indigo-600' : 'text-slate-300'}`}
                            >
                                {focusMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                            </button>
                            {focusMode && focusModeRemaining > 0 && (
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full" aria-live="polite">
                                    {Math.floor(focusModeRemaining / 60)}:{String(focusModeRemaining % 60).padStart(2, '0')}
                                </span>
                            )}
                            {/* Tooltip */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                <p className="font-bold mb-1">🎯 Focus Modus</p>
                                Dwing alle leerlingen naar één specifieke opdracht om de les te sturen.
                            </div>
                        </div>

                        {/* Presentation Button */}
                        <div className="group relative">
                            <button
                                data-tutorial="presentation-btn"
                                onClick={() => setShowPresentation(true)}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-colors text-sm font-bold"
                            >
                                <MonitorPlay size={16} />
                                <span className="hidden sm:inline">Presentatie</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
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
                                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
                                >
                                    <Eye size={16} />
                                    <span className="hidden sm:inline">Leerling View</span>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
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
                                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
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
