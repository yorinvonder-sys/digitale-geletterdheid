import React, { useState } from 'react';
import { LayoutDashboard, BarChart2, TrendingUp, PieChart, Hash, GripVertical, Check } from 'lucide-react';

type WidgetType = 'kpi' | 'bar' | 'line' | 'pie';

interface Widget {
    id: string;
    type: WidgetType;
    label: string;
    value: string;
    placed: boolean;
}

const INITIAL_WIDGETS: Widget[] = [
    { id: 'w1', type: 'kpi', label: 'Gem. cijfer', value: '7.2', placed: false },
    { id: 'w2', type: 'bar', label: 'Cijfers per vak', value: '', placed: false },
    { id: 'w3', type: 'line', label: 'Aanwezigheid trend', value: '', placed: false },
    { id: 'w4', type: 'kpi', label: 'Aanwezigheid', value: '94%', placed: false },
    { id: 'w5', type: 'pie', label: 'Verdeling niveaus', value: '', placed: false },
    { id: 'w6', type: 'kpi', label: 'Tevredenheid', value: '8.1', placed: false },
];

const WIDGET_ICONS: Record<WidgetType, React.ReactNode> = {
    kpi: <Hash size={14} />,
    bar: <BarChart2 size={14} />,
    line: <TrendingUp size={14} />,
    pie: <PieChart size={14} />,
};

const WIDGET_COLORS: Record<WidgetType, string> = {
    kpi: 'from-blue-500 to-blue-600',
    bar: 'from-emerald-500 to-emerald-600',
    line: 'from-violet-500 to-violet-600',
    pie: 'from-amber-500 to-amber-600',
};

const MiniBarChart: React.FC = () => (
    <svg viewBox="0 0 80 40" className="w-full h-full">
        {[28, 35, 22, 30, 38, 25].map((h, i) => (
            <rect key={i} x={i * 13 + 2} y={40 - h} width={10} height={h} rx={2} className="fill-emerald-400/80" />
        ))}
    </svg>
);

const MiniLineChart: React.FC = () => (
    <svg viewBox="0 0 80 40" className="w-full h-full">
        <polyline
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="4,32 16,28 28,20 40,22 52,14 64,10 76,8"
        />
        <polyline
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="0"
            points="4,32 16,28 28,20 40,22 52,14 64,10 76,8 76,40 4,40"
            className="fill-violet-200/40"
        />
    </svg>
);

const MiniPieChart: React.FC = () => (
    <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="16" className="fill-amber-100" />
        <path d="M20,20 L20,4 A16,16 0 0,1 36,20 Z" className="fill-amber-400" />
        <path d="M20,20 L36,20 A16,16 0 0,1 20,36 Z" className="fill-amber-300" />
        <path d="M20,20 L20,36 A16,16 0 0,1 4,20 Z" className="fill-amber-200" />
    </svg>
);

const DashboardDesignerPreview: React.FC = () => {
    const [widgets, setWidgets] = useState(INITIAL_WIDGETS);
    const [grid, setGrid] = useState<(string | null)[]>([null, null, null, null, null, null]);

    const placedCount = grid.filter(Boolean).length;

    const handlePlaceWidget = (widgetId: string) => {
        const firstEmpty = grid.indexOf(null);
        if (firstEmpty === -1) return;

        setGrid(prev => {
            const next = [...prev];
            next[firstEmpty] = widgetId;
            return next;
        });
        setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, placed: true } : w));
    };

    const handleRemoveFromGrid = (index: number) => {
        const widgetId = grid[index];
        if (!widgetId) return;
        setGrid(prev => {
            const next = [...prev];
            next[index] = null;
            return next;
        });
        setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, placed: false } : w));
    };

    const renderWidget = (widget: Widget, small?: boolean) => {
        if (widget.type === 'kpi') {
            return (
                <div className="text-center">
                    <div className={`${small ? 'text-lg' : 'text-2xl'} font-black text-slate-800`}>{widget.value}</div>
                    <div className="text-[9px] text-slate-500 font-medium mt-0.5">{widget.label}</div>
                </div>
            );
        }
        if (widget.type === 'bar') return <MiniBarChart />;
        if (widget.type === 'line') return <MiniLineChart />;
        if (widget.type === 'pie') return <MiniPieChart />;
        return null;
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-blue-200" />
                    <span className="text-white font-bold text-sm">Dashboard Designer</span>
                </div>
                <span className="text-[10px] bg-blue-500/40 text-blue-100 px-2 py-0.5 rounded-full font-bold">
                    {placedCount}/6 geplaatst
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* Dashboard canvas */}
                <div className="bg-white rounded-xl border-2 border-blue-200 p-3 shadow-sm">
                    <div className="text-[10px] font-bold text-blue-700 uppercase mb-2">Schooldashboard — preview</div>
                    <div className="grid grid-cols-3 gap-2">
                        {grid.map((widgetId, i) => {
                            const widget = widgetId ? widgets.find(w => w.id === widgetId) : null;
                            return (
                                <div
                                    key={i}
                                    onClick={() => widgetId && handleRemoveFromGrid(i)}
                                    className={`aspect-[4/3] rounded-lg flex items-center justify-center transition-all ${widget
                                        ? 'bg-white border-2 border-blue-200 shadow-sm cursor-pointer hover:border-red-300 hover:bg-red-50/30 p-2'
                                        : 'bg-blue-50 border-2 border-dashed border-blue-200'
                                    }`}
                                >
                                    {widget ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            {renderWidget(widget, true)}
                                            {widget.type !== 'kpi' && (
                                                <div className="text-[8px] text-slate-500 font-medium mt-1">{widget.label}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-blue-300 font-medium">Leeg</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Widget palette */}
                <div className="bg-white rounded-xl border border-blue-100 p-3 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-700 uppercase mb-2">Beschikbare widgets — klik om te plaatsen</div>
                    <div className="grid grid-cols-2 gap-2">
                        {widgets.filter(w => !w.placed).map((widget) => (
                            <button
                                key={widget.id}
                                onClick={() => handlePlaceWidget(widget.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all text-left group"
                            >
                                <div className={`w-6 h-6 rounded bg-gradient-to-br ${WIDGET_COLORS[widget.type]} flex items-center justify-center text-white shrink-0`}>
                                    {WIDGET_ICONS[widget.type]}
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-slate-700">{widget.label}</div>
                                    <div className="text-[9px] text-slate-400 capitalize">{widget.type === 'kpi' ? 'Getal-kaart' : widget.type === 'bar' ? 'Staafdiagram' : widget.type === 'line' ? 'Lijndiagram' : 'Cirkeldiagram'}</div>
                                </div>
                                <GripVertical size={12} className="text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                    {widgets.filter(w => !w.placed).length === 0 && (
                        <div className="text-center py-3">
                            <Check size={20} className="mx-auto text-blue-500 mb-1" />
                            <span className="text-xs text-blue-600 font-bold">Alle widgets geplaatst!</span>
                        </div>
                    )}
                </div>

                {/* Task hint */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-700">
                        Plaats de widgets in het dashboard en bespreek in de chat: <strong>welke grafiek</strong> past bij welke data? Zou de directeur dit in 5 seconden snappen?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardDesignerPreview;
