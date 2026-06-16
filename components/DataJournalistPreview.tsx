import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, ArrowRight, Table, PieChart, Eye } from 'lucide-react';

const SAMPLE_DATA = [
    { maand: 'Jan', verbruik: 2400, vorig: 2200 },
    { maand: 'Feb', verbruik: 2100, vorig: 2000 },
    { maand: 'Mrt', verbruik: 1800, vorig: 1900 },
    { maand: 'Apr', verbruik: 1400, vorig: 1500 },
    { maand: 'Mei', verbruik: 1100, vorig: 1200 },
    { maand: 'Jun', verbruik: 900, vorig: 1000 },
    { maand: 'Jul', verbruik: 700, vorig: 800 },
    { maand: 'Aug', verbruik: 750, vorig: 850 },
    { maand: 'Sep', verbruik: 1200, vorig: 1300 },
    { maand: 'Okt', verbruik: 1800, vorig: 1700 },
    { maand: 'Nov', verbruik: 2200, vorig: 2100 },
    { maand: 'Dec', verbruik: 2600, vorig: 2400 },
];

const MAX_VALUE = 2800;

type ViewMode = 'tabel' | 'grafiek' | 'infographic';

const DataJournalistPreview: React.FC = () => {
    const [view, setView] = useState<ViewMode>('grafiek');
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);

    return (
        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-lab-sage" />
                    <span className="text-white font-bold text-sm">Data Journalist Werkblad</span>
                </div>
                <div className="flex gap-1">
                    {(['tabel', 'grafiek', 'infographic'] as ViewMode[]).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-lab-sage' : 'bg-lab-sage/30 text-lab-sage hover:bg-lab-sage/50'}`}
                        >
                            {v === 'tabel' && <Table size={12} className="inline mr-1" />}
                            {v === 'grafiek' && <BarChart2 size={12} className="inline mr-1" />}
                            {v === 'infographic' && <PieChart size={12} className="inline mr-1" />}
                            {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title bar */}
            <div className="shrink-0 px-4 py-3 border-b border-lab-sage">
                <h3 className="font-black text-lab-muted text-sm">Energieverbruik Scholen Nederland (kWh)</h3>
                <p className="text-xs text-lab-muted mt-0.5">Bron: Onderzoeksredactie — 12 maanden, 2 schooljaren</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
                {view === 'tabel' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-lab-sage">
                                    <th className="text-left p-2 font-bold text-lab-sage border-b-2 border-lab-sage">Maand</th>
                                    <th className="text-right p-2 font-bold text-lab-sage border-b-2 border-lab-sage">Dit jaar (kWh)</th>
                                    <th className="text-right p-2 font-bold text-lab-sage border-b-2 border-lab-sage">Vorig jaar</th>
                                    <th className="text-right p-2 font-bold text-lab-sage border-b-2 border-lab-sage">Verschil</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SAMPLE_DATA.map((row, i) => {
                                    const diff = row.verbruik - row.vorig;
                                    const pct = ((diff / row.vorig) * 100).toFixed(0);
                                    return (
                                        <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-lab-sage/50'} hover:bg-lab-sage/50 transition-colors`}>
                                            <td className="p-2 font-bold text-lab-muted">{row.maand}</td>
                                            <td className="p-2 text-right font-mono text-lab-muted">{row.verbruik.toLocaleString()}</td>
                                            <td className="p-2 text-right font-mono text-lab-muted">{row.vorig.toLocaleString()}</td>
                                            <td className={`p-2 text-right font-bold ${diff > 0 ? 'text-red-600' : 'text-lab-sage'}`}>
                                                {diff > 0 ? '+' : ''}{pct}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'grafiek' && (
                    <div className="h-full flex flex-col">
                        {/* Bar chart */}
                        <div className="flex-1 flex items-end gap-1.5 px-2 pb-2 min-h-[200px]">
                            {SAMPLE_DATA.map((row, i) => {
                                const height = (row.verbruik / MAX_VALUE) * 100;
                                const prevHeight = (row.vorig / MAX_VALUE) * 100;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-1 cursor-pointer group"
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                    >
                                        {hoveredBar === i && (
                                            <div className="bg-lab-muted text-white text-[10px] px-2 py-1 rounded-lg font-bold whitespace-nowrap shadow-lg">
                                                {row.verbruik} kWh
                                            </div>
                                        )}
                                        <div className="w-full flex items-end gap-0.5 justify-center">
                                            <div
                                                className="w-[45%] bg-lab-sage/60 rounded-t-sm transition-all duration-300"
                                                style={{ height: `${prevHeight}%` }}
                                            />
                                            <div
                                                className="w-[45%] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-sm transition-all duration-300 group-hover:from-emerald-700 group-hover:to-emerald-500"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-lab-muted">{row.maand}</span>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-4 pt-2 border-t border-lab-sage">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-lab-sage rounded-sm" />
                                <span className="text-[10px] text-lab-muted font-medium">Dit schooljaar</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-lab-sage rounded-sm" />
                                <span className="text-[10px] text-lab-muted font-medium">Vorig schooljaar</span>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'infographic' && (
                    <div className="space-y-4">
                        {/* KPI cards */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white rounded-xl p-3 border border-lab-sage shadow-sm text-center">
                                <Eye size={16} className="mx-auto text-lab-sage mb-1" />
                                <div className="text-lg font-black text-lab-muted">17.950</div>
                                <div className="text-[10px] text-lab-muted font-medium">Totaal kWh dit jaar</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-lab-sage shadow-sm text-center">
                                <TrendingDown size={16} className="mx-auto text-lab-sage mb-1" />
                                <div className="text-lg font-black text-lab-sage">-3.2%</div>
                                <div className="text-[10px] text-lab-muted font-medium">vs. vorig jaar</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 border border-lab-sage shadow-sm text-center">
                                <TrendingUp size={16} className="mx-auto text-red-500 mb-1" />
                                <div className="text-lg font-black text-red-600">Dec</div>
                                <div className="text-[10px] text-lab-muted font-medium">Piekmaand</div>
                            </div>
                        </div>

                        {/* Insight box */}
                        <div className="bg-lab-sage border-2 border-lab-sage rounded-xl p-4">
                            <h4 className="font-bold text-lab-sage text-sm flex items-center gap-1.5">
                                <ArrowRight size={14} />
                                Jouw bevinding hier
                            </h4>
                            <p className="text-xs text-lab-sage mt-1 leading-relaxed">
                                Bespreek in de chat welke patronen je ziet. Welke maand valt op? Waarom denk je dat het verbruik in de winter hoger is?
                            </p>
                        </div>

                        {/* Mini trend line */}
                        <div className="bg-white rounded-xl p-3 border border-lab-sage shadow-sm">
                            <div className="text-xs font-bold text-lab-muted mb-2">Trend: verbruik per maand</div>
                            <svg viewBox="0 0 240 60" className="w-full h-auto">
                                <polyline
                                    fill="none"
                                    stroke="#5F947D"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={SAMPLE_DATA.map((d, i) => `${(i / 11) * 230 + 5},${55 - (d.verbruik / MAX_VALUE) * 50}`).join(' ')}
                                />
                                <polyline
                                    fill="none"
                                    stroke="#A7F3D0"
                                    strokeWidth="1.5"
                                    strokeDasharray="4 3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={SAMPLE_DATA.map((d, i) => `${(i / 11) * 230 + 5},${55 - (d.vorig / MAX_VALUE) * 50}`).join(' ')}
                                />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataJournalistPreview;
