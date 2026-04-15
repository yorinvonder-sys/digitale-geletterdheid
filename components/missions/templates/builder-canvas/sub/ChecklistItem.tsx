import React from 'react';
import { Check } from 'lucide-react';

export interface ChecklistItemProps {
    id: string;
    label: string;
    checked: boolean;
    onToggle: (id: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, onToggle }) => (
    <button
        onClick={() => onToggle(id)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
            checked
                ? 'bg-[#10B981]/8 border-[#10B981]/30'
                : 'bg-white border-[#E8E6DF] hover:border-[#D97757]/40 hover:bg-[#D97757]/4'
        }`}
        aria-pressed={checked}
    >
        <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                checked ? 'bg-[#10B981] border-[#10B981]' : 'border-[#E8E6DF] bg-white'
            }`}
        >
            {checked && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <span
            className={`text-sm transition-colors duration-200 ${
                checked ? 'text-[#6B6B66] line-through' : 'text-[#3D3D38]'
            }`}
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {label}
        </span>
    </button>
);
