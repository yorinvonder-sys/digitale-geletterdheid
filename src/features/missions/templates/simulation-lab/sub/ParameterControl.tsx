import React from 'react';
import type { Parameter } from '../SimulationLab';

export const ParameterControl: React.FC<{
    param: Parameter;
    value: number | string | boolean;
    onChange: (val: number | string | boolean) => void;
}> = ({ param, value, onChange }) => {
    if (param.type === 'slider') {
        const v = value as number;
        return (
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <label
                        className="text-xs font-bold text-duck-muted"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {param.label}
                    </label>
                    <span
                        className="text-xs font-black text-duck-coral bg-duck-coral/10 px-2 py-0.5 rounded-full"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {v}
                    </span>
                </div>
                <input
                    type="range"
                    min={param.min ?? 0}
                    max={param.max ?? 100}
                    step={param.step ?? 1}
                    value={v}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="min-h-[44px] w-full accent-[#D97848]"
                />
                <div className="flex justify-between text-[10px] text-duck-muted">
                    <span>{param.min ?? 0}</span>
                    <span>{param.max ?? 100}</span>
                </div>
            </div>
        );
    }

    if (param.type === 'toggle') {
        const v = value as boolean;
        return (
            <div className="flex items-center justify-between">
                <label
                    className="text-xs font-bold text-duck-muted"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <button
                    onClick={() => onChange(!v)}
                    className={`relative min-h-[44px] min-w-14 rounded-full transition-colors duration-300 ${
                        v ? 'bg-duck-coral' : 'bg-duck-line'
                    }`}
                    aria-pressed={v}
                >
                    <div
                        className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-300 ${
                            v ? 'translate-x-7' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        );
    }

    if (param.type === 'select') {
        const v = value as string;
        return (
            <div className="space-y-1">
                <label
                    className="text-xs font-bold text-duck-muted block"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <div className="flex flex-col gap-1">
                    {(param.options ?? []).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                                v === opt
                                    ? 'bg-duck-coral/10 border-duck-coral text-duck-coral font-bold'
                                    : 'bg-white border-duck-line text-duck-muted hover:border-duck-coral/50'
                            }`}
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};
