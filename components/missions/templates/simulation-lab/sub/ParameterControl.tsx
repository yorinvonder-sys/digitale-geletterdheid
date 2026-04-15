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
                        className="text-xs font-bold text-[#3D3D38]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        {param.label}
                    </label>
                    <span
                        className="text-xs font-black text-[#D97757] bg-[#D97757]/10 px-2 py-0.5 rounded-full"
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
                    className="w-full accent-[#D97757]"
                />
                <div className="flex justify-between text-[10px] text-[#6B6B66]">
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
                    className="text-xs font-bold text-[#3D3D38]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {param.label}
                </label>
                <button
                    onClick={() => onChange(!v)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
                        v ? 'bg-[#D97757]' : 'bg-[#E8E6DF]'
                    }`}
                >
                    <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${
                            v ? 'translate-x-6' : 'translate-x-1'
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
                    className="text-xs font-bold text-[#3D3D38] block"
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
                                    ? 'bg-[#D97757]/10 border-[#D97757] text-[#D97757] font-bold'
                                    : 'bg-white border-[#E8E6DF] text-[#3D3D38] hover:border-[#D97757]/50'
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
