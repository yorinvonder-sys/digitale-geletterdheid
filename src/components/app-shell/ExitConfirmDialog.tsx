import React, { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ExitConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}

export const ExitConfirmDialog: React.FC<ExitConfirmDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    title = 'Missie verlaten?',
    message = 'Weet je zeker dat je deze missie wilt verlaten? Je voortgang voor deze missie kan verloren gaan.'
}) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Focus trap: move focus into dialog when opened
    useEffect(() => {
        if (isOpen && dialogRef.current) {
            const firstFocusable = dialogRef.current.querySelector<HTMLElement>('button');
            firstFocusable?.focus();
        }
    }, [isOpen]);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
    }, [onCancel]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-duck-ink/40 backdrop-blur-[2px]"
                onClick={onCancel}
            />
            <div
                ref={dialogRef}
                className="rounded-[1.5rem] bg-white p-6 shadow-duck-soft w-full max-w-sm relative z-10 animate-in zoom-in duration-200 motion-reduce:animate-none"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="exit-dialog-title"
                aria-describedby="exit-dialog-desc"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-duck-ink rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} className="text-duck-acid" />
                    </div>
                    <h3 id="exit-dialog-title" className="text-lg font-extrabold text-duck-ink">{title}</h3>
                </div>
                <p id="exit-dialog-desc" className="text-duck-ink/65 text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-duck-ink/20 bg-duck-bgLight px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:border-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    >
                        Annuleren
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2"
                    >
                        Verlaten
                    </button>
                </div>
            </div>
        </div>
    );
};
