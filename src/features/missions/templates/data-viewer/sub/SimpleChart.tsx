import React, { useState, useEffect, useRef } from 'react';

interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
}

interface SimpleChartProps {
    data: ChartDataPoint[];
    type: 'bar' | 'pie';
}

const DEFAULT_COLORS = [
    '#ff3c21', '#202023', '#202023', '#e1ff01', '#202023', '#ff3c21',
    '#202023', '#99984D', '#ff3c21', '#202023',
];

// ── Bar chart ────────────────────────────────────────────────────────────────

const BarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const [tooltip, setTooltip] = useState<{ index: number; x: number; y: number } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    const max = Math.max(...data.map(d => d.value));
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="flex items-end gap-2 h-48 px-2 pb-1">
                {data.map((d, i) => {
                    const pct = max > 0 ? (d.value / max) * 100 : 0;
                    const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center flex-1 h-full justify-end cursor-pointer group"
                            onMouseEnter={e => {
                                const rect = containerRef.current?.getBoundingClientRect();
                                const barRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setTooltip({
                                    index: i,
                                    x: barRect.left - (rect?.left ?? 0) + barRect.width / 2,
                                    y: barRect.top - (rect?.top ?? 0) - 8,
                                });
                            }}
                            onMouseLeave={() => setTooltip(null)}
                        >
                            <div
                                className="w-full rounded-t-lg transition-all duration-700 ease-out"
                                style={{
                                    backgroundColor: color,
                                    height: mounted ? `${pct}%` : '0%',
                                    minHeight: mounted && d.value > 0 ? '4px' : '0px',
                                    opacity: tooltip && tooltip.index !== i ? 0.65 : 1,
                                    transition: 'height 0.7s ease-out, opacity 0.15s ease',
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* X-axis labels */}
            <div className="flex gap-2 px-2 mt-1">
                {data.map((d, i) => (
                    <div
                        key={i}
                        className="flex-1 text-center text-[10px] text-duck-muted leading-tight truncate"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        title={d.label}
                    >
                        {d.label}
                    </div>
                ))}
            </div>

            {/* Tooltip */}
            {tooltip !== null && (
                <div
                    className="absolute pointer-events-none z-10 bg-duck-ink text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                    style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <span className="font-bold">{data[tooltip.index].label}</span>
                    <span className="ml-1.5 opacity-80">{data[tooltip.index].value}</span>
                </div>
            )}
        </div>
    );
};

// ── Pie chart ────────────────────────────────────────────────────────────────

const PieChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const [tooltip, setTooltip] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    const total = data.reduce((s, d) => s + d.value, 0);
    const SIZE = 180;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    const R = SIZE / 2 - 16;

    // Build SVG arc paths
    let cumAngle = -Math.PI / 2;
    const slices = data.map((d, i) => {
        const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const frac = total > 0 ? d.value / total : 0;
        const angle = frac * 2 * Math.PI;
        const startAngle = cumAngle;
        cumAngle += angle;
        const endAngle = cumAngle;

        const x1 = CX + R * Math.cos(startAngle);
        const y1 = CY + R * Math.sin(startAngle);
        const x2 = CX + R * Math.cos(endAngle);
        const y2 = CY + R * Math.sin(endAngle);
        const largeArc = angle > Math.PI ? 1 : 0;

        const path =
            frac >= 0.9999
                ? `M ${CX} ${CY} m -${R} 0 a ${R} ${R} 0 1 1 ${2 * R} 0 a ${R} ${R} 0 1 1 -${2 * R} 0`
                : `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        // Mid-angle for label
        const midAngle = startAngle + angle / 2;
        const labelR = R * 0.65;
        const lx = CX + labelR * Math.cos(midAngle);
        const ly = CY + labelR * Math.sin(midAngle);

        return { path, color, lx, ly, frac, index: i };
    });

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <svg
                    width={SIZE}
                    height={SIZE}
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="overflow-visible"
                    style={{ transform: mounted ? 'scale(1)' : 'scale(0.85)', transition: 'transform 0.5s ease-out' }}
                >
                    {slices.map(s => (
                        <path
                            key={s.index}
                            d={s.path}
                            fill={s.color}
                            opacity={tooltip !== null && tooltip !== s.index ? 0.55 : 1}
                            style={{ transition: 'opacity 0.15s ease', cursor: 'pointer' }}
                            onMouseEnter={() => setTooltip(s.index)}
                            onMouseLeave={() => setTooltip(null)}
                        />
                    ))}
                    {/* Percentage labels inside slices (only if slice is wide enough) */}
                    {slices.map(s =>
                        s.frac > 0.07 ? (
                            <text
                                key={`lbl-${s.index}`}
                                x={s.lx}
                                y={s.ly}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="9"
                                fill="white"
                                fontWeight="700"
                                fontFamily="'Outfit', system-ui, sans-serif"
                                style={{ pointerEvents: 'none' }}
                            >
                                {Math.round(s.frac * 100)}%
                            </text>
                        ) : null
                    )}
                </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-1.5 w-full max-w-xs">
                {data.map((d, i) => {
                    const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-2 cursor-pointer"
                            onMouseEnter={() => setTooltip(i)}
                            onMouseLeave={() => setTooltip(null)}
                            style={{ opacity: tooltip !== null && tooltip !== i ? 0.55 : 1, transition: 'opacity 0.15s ease' }}
                        >
                            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                            <span
                                className="text-xs text-duck-muted flex-1"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {d.label}
                            </span>
                            <span
                                className="text-xs font-bold text-duck-ink"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {d.value} <span className="font-normal text-duck-muted">({pct}%)</span>
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Export ────────────────────────────────────────────────────────────────────

export const SimpleChart: React.FC<SimpleChartProps> = ({ data, type }) => {
    if (type === 'pie') return <PieChart data={data} />;
    return <BarChart data={data} />;
};
