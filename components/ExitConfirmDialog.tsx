import React from 'react';
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-lab-muted/60 backdrop-blur-sm"
                onClick={onCancel}
            />
            <div
                className="bg-white rounded-2xl p-6 shadow-2xl border border-lab-muted w-full max-w-sm relative z-10 animate-in zoom-in duration-200"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="exit-dialog-title"
                aria-describedby="exit-dialog-desc"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-lab-gold rounded-xl flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} className="text-lab-gold" />
                    </div>
                    <h3 id="exit-dialog-title" className="text-lg font-extrabold text-lab-muted">{title}</h3>
                </div>
                <p id="exit-dialog-desc" className="text-lab-muted text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 text-lab-muted font-bold text-sm hover:bg-lab-muted rounded-xl transition-colors"
                    >
                        Annuleren
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-lab-gold hover:bg-lab-gold text-white rounded-xl font-bold text-sm transition-colors"
                    >
                        Verlaten
                    </button>
                </div>
            </div>
        </div>
    );
};
