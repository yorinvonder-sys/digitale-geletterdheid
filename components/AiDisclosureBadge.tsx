import React from 'react';
import { Sparkles } from 'lucide-react';

interface AiDisclosureBadgeProps {
    /** Optional: override the default disclosure text */
    text?: string;
    /** Compact mode for inline use (smaller text, no border) */
    compact?: boolean;
    /** Custom className for positioning */
    className?: string;
}

/**
 * AI Disclosure Badge — EU AI Act Art. 50 compliance.
 * 
 * Must be shown whenever AI-generated content is displayed to users.
 * This ensures students always know they are interacting with AI,
 * as required by the EU AI Act transparency obligations.
 * 
 * Usage:
 *   <AiDisclosureBadge />                          — standard badge
 *   <AiDisclosureBadge compact />                   — inline/compact
 *   <AiDisclosureBadge text="AI Mentor antwoord" /> — custom text
 */
export const AiDisclosureBadge: React.FC<AiDisclosureBadgeProps> = ({
    text,
    compact = false,
    className = '',
}) => {
    if (compact) {
        return (
            <span
                className={`inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium ${className}`}
                title="Dit antwoord is gegenereerd door kunstmatige intelligentie en kan fouten bevatten."
                role="note"
                aria-label="AI-gegenereerde inhoud"
            >
                <Sparkles size={10} className="text-purple-400" />
                {text || 'AI-gegenereerd'}
            </span>
        );
    }

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-100 
                        rounded-lg text-xs text-purple-600 font-medium ${className}`}
            role="note"
            aria-label="AI-gegenereerde inhoud"
        >
            <Sparkles size={12} className="text-purple-500 shrink-0" />
            <span>{text || 'Gegenereerd door AI — kan fouten bevatten'}</span>
        </div>
    );
};
