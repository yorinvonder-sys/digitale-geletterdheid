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
                ? 'bg-[#5F947D]/8 border-[#5F947D]/30'
                : 'bg-white border-[#E7D8BD] hover:border-[#D97848]/40 hover:bg-[#D97848]/4'
        }`}
        aria-pressed={checked}
    >
        <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                checked ? 'bg-[#5F947D] border-[#5F947D]' : 'border-[#E7D8BD] bg-white'
            }`}
        >
            {checked && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <span
            className={`text-sm transition-colors duration-200 ${
                checked ? 'text-[#445865] line-through' : 'text-[#445865]'
            }`}
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {label}
        </span>
    </button>
);
