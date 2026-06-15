import React from 'react';
import type { BarChartData, MeterData, ComparisonData, VisualData } from '../SimulationLab';

export const BarChartVis: React.FC<{ data: BarChartData }> = ({ data }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="flex items-end gap-2 h-36 w-full px-2">
            {data.map((bar) => {
                const heightPct = Math.max((bar.value / max) * 100, 2);
                return (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                        <span
                            className="text-xs font-bold"
                            style={{ color: bar.color, fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {bar.value}
                        </span>
                        <div
                            className="w-full rounded-t-lg transition-all duration-500"
                            style={{
                                height: `${heightPct}%`,
                                backgroundColor: bar.color,
                                minHeight: 4,
                            }}
                        />
                        <span
                            className="text-[10px] text-duck-muted text-center leading-tight"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {bar.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export const MeterVis: React.FC<{ data: MeterData }> = ({ data }) => {
    const clamped = Math.max(0, Math.min(100, data.value));
    // HSL: 0 = red, 120 = green — but we want red = low privacy (0), green = high privacy (100)
    const hue = Math.round((clamped / 100) * 120);
    const color = `hsl(${hue}, 70%, 45%)`;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center gap-2 py-4">
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#e3e2dc" strokeWidth="10" />
                <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.5s ease' }}
                />
                <text
                    x="60"
                    y="64"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="900"
                    fill="#202023"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {clamped}
                </text>
            </svg>
            <span
                className="text-sm font-bold text-duck-ink"
                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
            >
                {data.label}
            </span>
            {data.sublabel && (
                <span
                    className="text-xs text-duck-muted text-center"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {data.sublabel}
                </span>
            )}
        </div>
    );
};

export const ComparisonVis: React.FC<{ data: ComparisonData }> = ({ data }) => (
    <div className="flex gap-2 w-full">
        {[
            { title: data.leftTitle, items: data.leftItems, accent: '#ff3c21' },
            { title: data.rightTitle, items: data.rightItems, accent: '#202023' },
        ].map((panel) => (
            <div
                key={panel.title}
                className="flex-1 rounded-xl border border-duck-line overflow-hidden"
            >
                <div
                    className="px-3 py-2 text-center text-xs font-black uppercase tracking-wide text-white"
                    style={{
                        background: panel.accent,
                        fontFamily: "'Outfit', system-ui, sans-serif",
                    }}
                >
                    {panel.title}
                </div>
                <div className="p-2 space-y-1.5 bg-white">
                    {panel.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            {item.icon.startsWith('/assets/') ? (
                                <img src={item.icon} alt="" className="h-5 w-5 shrink-0 object-contain" width={20} height={20} loading="lazy" decoding="async" />
                            ) : (
                                <span className="text-sm">{item.icon}</span>
                            )}
                            <span
                                className="text-xs text-duck-muted leading-tight"
                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export const SimulationVisual: React.FC<{ visualData: VisualData }> = ({ visualData }) => (
    <>
        {visualData.type === 'bar-chart' && <BarChartVis data={visualData.data} />}
        {visualData.type === 'meter' && <MeterVis data={visualData.data} />}
        {visualData.type === 'comparison' && <ComparisonVis data={visualData.data} />}
    </>
);
