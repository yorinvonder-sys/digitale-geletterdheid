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
            <div className="space-y-0.5">
                <div className="flex justify-between items-center">
                    <label
                        className="text-[11px] font-bold text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {param.label}
                    </label>
                    <span
                        className="text-xs font-black text-[#D97848] bg-[#D97848]/10 px-2 py-0.5 rounded-full"
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
                    data-qa={`param-slider-${param.id}`}
                    className="min-h-[34px] w-full accent-[#D97848]"
                />
                <div className="flex justify-between text-[10px] text-[#445865]">
                    <span>{param.min ?? 0}</span>
                    <span>{param.max ?? 100}</span>
                </div>
            </div>
        );
    }

    if (param.type === 'toggle') {
        const v = value as boolean;
        return (
            <div className="flex items-center justify-between gap-3">
                <label
                    className="text-[11px] font-bold leading-tight text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <button
                    onClick={() => onChange(!v)}
                    data-qa={`param-toggle-${param.id}`}
                    className={`relative min-h-[34px] min-w-12 rounded-full transition-colors duration-300 ${
                        v ? 'bg-[#D97848]' : 'bg-[#E7D8BD]'
                    }`}
                    aria-pressed={v}
                >
                    <div
                        className={`absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-300 ${
                            v ? 'translate-x-5' : 'translate-x-0'
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
                    className="block text-[11px] font-bold text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <div className="grid gap-1 sm:grid-cols-2">
                    {(param.options ?? []).map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onChange(opt)}
                            data-qa={`param-select-${param.id}-${opt}`}
                            className={`rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-all duration-200 ${
                                v === opt
                                    ? 'bg-[#D97848]/10 border-[#D97848] text-[#D97848] font-bold'
                                    : 'bg-white border-[#E7D8BD] text-[#445865] hover:border-[#D97848]/50'
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
