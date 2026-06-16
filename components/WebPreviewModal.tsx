import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ExternalLink, Globe, AlertTriangle } from 'lucide-react';

interface WebPreviewModalProps {
    url: string;
    onClose: () => void;
}

export const WebPreviewModal: React.FC<WebPreviewModalProps> = ({ url, onClose }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus trap: move focus into modal when opened
    useEffect(() => {
        if (modalRef.current) {
            const firstFocusable = modalRef.current.querySelector<HTMLElement>('button, a, [tabindex]:not([tabindex="-1"])');
            firstFocusable?.focus();
        }
    }, []);

    // Escape to close
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Sanitizing URL to ensure it has a protocol
    const safeUrl = url.startsWith('http') ? url : `https://${url}`;
    const hostname = (() => {
        try {
            return new URL(safeUrl).hostname;
        } catch {
            return safeUrl;
        }
    })();

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-lab-muted/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Web voorvertoning" className="bg-white w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 motion-reduce:animate-none border border-lab-muted">

                {/* Header */}
                <div className="bg-lab-muted border-b border-lab-muted p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white border border-lab-muted rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                            <Globe size={20} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h3 className="font-bold text-lab-muted text-sm truncate">Web Voorvertoning</h3>
                            <span className="text-xs text-lab-muted truncate font-mono bg-lab-muted px-1 rounded max-w-[60vw] sm:max-w-[300px]">{safeUrl}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-lab-muted hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline">Open in Browser</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 bg-lab-muted hover:bg-lab-muted text-lab-muted rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label="Sluiten"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-lab-muted relative group">
                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center text-lab-muted" role="status" aria-live="polite">
                            <span className="sr-only">Pagina laden...</span>
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true"></div>
                        </div>
                    )}

                    {hasError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-lab-muted">
                            <div className="w-16 h-16 bg-lab-gold text-lab-gold rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-lab-muted mb-2">Kan website niet tonen</h4>
                            <p className="text-lab-muted max-w-md mb-6">
                                Deze website ({hostname}) staat niet toe dat we hem hier laten zien. Dit is een beveiliging van de site zelf.
                            </p>
                            <a
                                href={safeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-2"
                                onClick={onClose}
                            >
                                <ExternalLink size={18} />
                                Open in Nieuw Tabblad
                            </a>
                        </div>
                    ) : (
                        <iframe
                            src={safeUrl}
                            className="w-full h-full border-none bg-white"
                            onLoad={() => setIsLoading(false)}
                            onError={() => setHasError(true)}
                            // Sandbox attributes for security, but allow necessary visuals
                            sandbox="allow-scripts allow-forms allow-presentation"
                            title="Web Preview"
                        />
                    )}

                    {/* Iframe blocker detection overlay (Visual Hint) */}
                    {!hasError && !isLoading && (
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-lab-muted/80 backdrop-blur text-white text-xs px-3 py-2 rounded-lg pointer-events-none">
                            Is het scherm wit? Klik dan op 'Open in Browser' ↗️
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
