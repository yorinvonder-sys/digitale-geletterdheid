import React, { useState } from 'react';
import { LayoutDashboard, BarChart2, TrendingUp, PieChart, Hash, GripVertical, Check } from 'lucide-react';

type WidgetType = 'kpi' | 'bar' | 'line' | 'pie';
type GridState = Array<string | null>;

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
    kpi: 'from-lab-coral to-lab-teal',
    bar: 'from-lab-coral to-lab-sage',
    line: 'from-lab-coral to-lab-teal',
    pie: 'from-lab-coral to-lab-gold',
};

const DRAG_WIDGET_MIME = 'application/x-dashboard-widget';

const MiniBarChart: React.FC = () => (
    <svg viewBox="0 0 80 40" className="w-full h-full">
        {[28, 35, 22, 30, 38, 25].map((h, i) => (
            <rect key={i} x={i * 13 + 2} y={40 - h} width={10} height={h} rx={2} className="fill-lab-sage/80" />
        ))}
    </svg>
);

const MiniLineChart: React.FC = () => (
    <svg viewBox="0 0 80 40" className="w-full h-full">
        <polyline
            fill="none"
            stroke="#0B453F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points="4,32 16,28 28,20 40,22 52,14 64,10 76,8"
        />
        <polyline
            fill="none"
            stroke="#0B453F"
            strokeWidth="0"
            points="4,32 16,28 28,20 40,22 52,14 64,10 76,8 76,40 4,40"
            className="fill-lab-teal/40"
        />
    </svg>
);

const MiniPieChart: React.FC = () => (
    <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="16" className="fill-lab-gold" />
        <path d="M20,20 L20,4 A16,16 0 0,1 36,20 Z" className="fill-lab-gold" />
        <path d="M20,20 L36,20 A16,16 0 0,1 20,36 Z" className="fill-lab-gold" />
        <path d="M20,20 L20,36 A16,16 0 0,1 4,20 Z" className="fill-lab-gold" />
    </svg>
);

const DashboardDesignerPreview: React.FC = () => {
    const [widgets, setWidgets] = useState(INITIAL_WIDGETS);
    const [grid, setGrid] = useState<GridState>([null, null, null, null, null, null]);
    const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [isPaletteDragOver, setIsPaletteDragOver] = useState(false);

    const placedCount = grid.filter(Boolean).length;
    const availableWidgets = widgets.filter(w => !w.placed);

    const syncGrid = (nextGrid: GridState) => {
        const placedIds = new Set(nextGrid.filter((widgetId): widgetId is string => widgetId !== null));
        setGrid(nextGrid);
        setWidgets(prev => prev.map(widget => ({ ...widget, placed: placedIds.has(widget.id) })));
    };

    const moveWidgetToIndex = (widgetId: string, targetIndex: number) => {
        const currentIndex = grid.indexOf(widgetId);

        if (currentIndex === targetIndex) return;

        const nextGrid = [...grid];
        const displacedWidgetId = nextGrid[targetIndex];

        if (currentIndex !== -1) {
            nextGrid[currentIndex] = displacedWidgetId ?? null;
        }

        nextGrid[targetIndex] = widgetId;
        syncGrid(nextGrid);
    };

    const handlePlaceWidget = (widgetId: string) => {
        const firstEmpty = grid.indexOf(null);
        if (firstEmpty === -1) return;
        moveWidgetToIndex(widgetId, firstEmpty);
    };

    const handleRemoveFromGrid = (index: number) => {
        const widgetId = grid[index];
        if (!widgetId) return;

        const nextGrid = [...grid];
        nextGrid[index] = null;
        syncGrid(nextGrid);
    };

    const getDraggedWidgetId = (e: React.DragEvent) =>
        e.dataTransfer.getData(DRAG_WIDGET_MIME) || e.dataTransfer.getData('text/plain');

    const handleDragStart = (e: React.DragEvent, widgetId: string) => {
        e.stopPropagation();
        e.dataTransfer.setData('text/plain', widgetId);
        e.dataTransfer.setData(DRAG_WIDGET_MIME, widgetId);
        e.dataTransfer.effectAllowed = 'move';
        setDraggedWidgetId(widgetId);
    };

    const handleDragEnd = () => {
        setDraggedWidgetId(null);
        setDragOverIndex(null);
        setIsPaletteDragOver(false);
    };

    const handleSlotDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (dragOverIndex !== index) {
            setDragOverIndex(index);
        }
    };

    const handleSlotDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        const widgetId = getDraggedWidgetId(e);
        setDragOverIndex(null);

        if (!widgetId) return;

        moveWidgetToIndex(widgetId, index);
    };

    const handlePaletteDragOver = (e: React.DragEvent) => {
        if (!draggedWidgetId || !grid.includes(draggedWidgetId)) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsPaletteDragOver(true);
    };

    const handlePaletteDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const widgetId = getDraggedWidgetId(e);
        setIsPaletteDragOver(false);

        if (!widgetId) return;

        const currentIndex = grid.indexOf(widgetId);
        if (currentIndex === -1) return;

        const nextGrid = [...grid];
        nextGrid[currentIndex] = null;
        syncGrid(nextGrid);
    };

    const renderWidget = (widget: Widget, small?: boolean) => {
        if (widget.type === 'kpi') {
            return (
                <div className="text-center">
                    <div className={`${small ? 'text-lg' : 'text-2xl'} font-black text-lab-ink`}>{widget.value}</div>
                    <div className="text-[9px] text-lab-muted font-medium mt-0.5">{widget.label}</div>
                </div>
            );
        }
        if (widget.type === 'bar') return <MiniBarChart />;
        if (widget.type === 'line') return <MiniLineChart />;
        if (widget.type === 'pie') return <MiniPieChart />;
        return null;
    };

    return (
        <div className="w-full h-full bg-gradient-to-br from-lab-teal to-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-gradient-to-r from-lab-teal to-lab-teal px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-lab-teal" />
                    <span className="text-white font-bold text-sm">Dashboard Designer</span>
                </div>
                <span className="text-[10px] bg-lab-coral/40 text-lab-teal px-2 py-0.5 rounded-full font-bold">
                    {placedCount}/6 geplaatst
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                {/* Dashboard canvas */}
                <div className="bg-white rounded-xl border-2 border-lab-teal p-3 shadow-sm">
                    <div className="text-[10px] font-bold text-lab-teal uppercase mb-2">Schooldashboard — preview</div>
                    <div className="grid grid-cols-3 gap-2">
                        {grid.map((widgetId, i) => {
                            const widget = widgetId ? widgets.find(w => w.id === widgetId) : null;
                            const isDragTarget = dragOverIndex === i && draggedWidgetId !== null;
                            return (
                                <div
                                    key={i}
                                    draggable={Boolean(widget)}
                                    onDragStart={widget ? (e) => handleDragStart(e, widget.id) : undefined}
                                    onDragEnd={widget ? handleDragEnd : undefined}
                                    onDragOver={(e) => handleSlotDragOver(e, i)}
                                    onDrop={(e) => handleSlotDrop(e, i)}
                                    onDragEnter={() => setDragOverIndex(i)}
                                    onClick={() => widgetId && handleRemoveFromGrid(i)}
                                    className={`aspect-[4/3] rounded-lg flex items-center justify-center transition-all ${widget
                                        ? 'bg-white border-2 border-lab-teal shadow-sm cursor-grab hover:border-lab-coral hover:bg-lab-coral/30 p-2 active:cursor-grabbing'
                                        : 'bg-lab-teal border-2 border-dashed border-lab-teal'
                                    } ${isDragTarget
                                        ? 'border-lab-teal bg-lab-teal/70 ring-2 ring-lab-teal'
                                        : ''
                                    }`}
                                    title={widget ? 'Klik om te verwijderen of sleep om te verplaatsen' : 'Sleep hierheen om te plaatsen'}
                                >
                                    {widget ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            {renderWidget(widget, true)}
                                            {widget.type !== 'kpi' && (
                                                <div className="text-[8px] text-lab-muted font-medium mt-1">{widget.label}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-lab-teal font-medium">Leeg</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Widget palette */}
                <div
                    onDragOver={handlePaletteDragOver}
                    onDrop={handlePaletteDrop}
                    onDragLeave={() => setIsPaletteDragOver(false)}
                    className={`bg-white rounded-xl border p-3 shadow-sm transition-all ${isPaletteDragOver
                        ? 'border-lab-teal bg-lab-teal/70 ring-2 ring-lab-teal'
                        : 'border-lab-teal'
                    }`}
                >
                    <div className="text-[10px] font-bold text-lab-muted uppercase mb-2">Beschikbare widgets — sleep of klik om te plaatsen</div>
                    <div className="grid grid-cols-2 gap-2">
                        {availableWidgets.map((widget) => (
                            <button
                                key={widget.id}
                                type="button"
                                draggable
                                onClick={() => handlePlaceWidget(widget.id)}
                                onDragStart={(e) => handleDragStart(e, widget.id)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-lab-teal hover:bg-lab-teal hover:text-white border border-lab-teal transition-all text-left group cursor-grab active:cursor-grabbing ${draggedWidgetId === widget.id ? 'opacity-60 scale-[0.98]' : ''}`}
                                title="Sleep naar een vak of klik om automatisch te plaatsen"
                            >
                                <div className={`w-6 h-6 rounded bg-gradient-to-br ${WIDGET_COLORS[widget.type]} flex items-center justify-center text-white shrink-0`}>
                                    {WIDGET_ICONS[widget.type]}
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold text-lab-muted">{widget.label}</div>
                                    <div className="text-[9px] text-lab-muted capitalize">{widget.type === 'kpi' ? 'Getal-kaart' : widget.type === 'bar' ? 'Staafdiagram' : widget.type === 'line' ? 'Lijndiagram' : 'Cirkeldiagram'}</div>
                                </div>
                                <GripVertical size={12} className={`text-lab-muted ml-auto transition-opacity ${draggedWidgetId === widget.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                            </button>
                        ))}
                    </div>
                    {availableWidgets.length > 0 && (
                        <p className="mt-2 text-[10px] text-lab-muted">
                            Sleep naar een vak. Sleep een geplaatste widget terug hierheen om hem weg te halen.
                        </p>
                    )}
                    {availableWidgets.length === 0 && (
                        <div className="text-center py-3">
                            <Check size={20} className="mx-auto text-lab-muted mb-1" />
                            <span className="text-xs text-lab-teal font-bold">Alle widgets geplaatst!</span>
                        </div>
                    )}
                </div>

                {/* Task hint */}
                <div className="bg-lab-teal border-2 border-lab-teal rounded-xl p-3">
                    <p className="text-xs text-lab-teal">
                        Plaats de widgets in het dashboard en bespreek in de chat: <strong>welke grafiek</strong> past bij welke data? Zou de directeur dit in 5 seconden snappen?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardDesignerPreview;
