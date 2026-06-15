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
                ? 'bg-duck-ink/8 border-duck-ink/30'
                : 'bg-white border-duck-gray hover:border-duck-acid/40 hover:bg-duck-acid/4'
        }`}
        aria-pressed={checked}
    >
        <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                checked ? 'bg-duck-ink border-duck-ink' : 'border-duck-gray bg-white'
            }`}
        >
            {checked && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <span
            className={`text-sm transition-colors duration-200 ${
                checked ? 'text-duck-ink/60 line-through' : 'text-duck-ink/60'
            }`}
            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
        >
            {label}
        </span>
    </button>
);
