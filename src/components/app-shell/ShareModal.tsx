import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Share, X, Check, Copy, Loader2 } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
    isSharing: boolean;
    title?: string;
    description?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    shareUrl,
    isSharing,
    title = "Deel je Project!",
    description = "Laat anderen jouw creatie zien."
}) => {
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap: move focus into modal when opened
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
        }
    }, [isOpen]);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="share-modal-title" className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 motion-reduce:animate-none">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-lab-muted hover:text-lab-muted transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Sluiten"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-lab-coral rounded-full flex items-center justify-center mx-auto mb-4 text-lab-coral">
                        <Share size={32} />
                    </div>
                    <h3 id="share-modal-title" className="text-xl font-black text-lab-ink mb-1">{title}</h3>
                    <p className="text-lab-muted text-sm">{description}</p>
                </div>

                {isSharing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 size={32} className="animate-spin motion-reduce:animate-none text-lab-muted mb-2" />
                        <span className="text-lab-muted text-sm">Link genereren...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full bg-lab-cream border border-lab-line rounded-xl py-3 pl-4 pr-12 text-sm text-lab-muted font-mono focus:outline-none focus:border-lab-coral focus:ring-2 focus:ring-lab-coral/20 transition-all"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-2 p-1.5 text-lab-muted hover:text-lab-coral transition-colors bg-white rounded-lg border border-lab-line shadow-sm hover:shadow min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Kopieer link"
                            >
                                {copied ? <Check size={18} className="text-lab-muted" /> : <Copy size={18} />}
                            </button>
                        </div>

                        <div className="text-center text-xs text-lab-muted">
                            {copied ? '✓ Gekopieerd!' : 'Kopieer de link om te delen'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
