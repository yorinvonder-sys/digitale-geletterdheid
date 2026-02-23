import React, { useState } from 'react';
import { X, ExternalLink, Globe, AlertTriangle } from 'lucide-react';

interface WebPreviewModalProps {
    url: string;
    onClose: () => void;
}

export const WebPreviewModal: React.FC<WebPreviewModalProps> = ({ url, onClose }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 border border-slate-200">

                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                            <Globe size={20} />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <h3 className="font-bold text-slate-800 text-sm truncate">Web Voorvertoning</h3>
                            <span className="text-xs text-slate-500 truncate font-mono bg-slate-100 px-1 rounded max-w-[300px]">{safeUrl}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold"
                        >
                            <ExternalLink size={16} />
                            <span className="hidden sm:inline">Open in Browser</span>
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-slate-100 relative group">
                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400" role="status" aria-live="polite">
                            <span className="sr-only">Pagina laden...</span>
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" aria-hidden="true"></div>
                        </div>
                    )}

                    {hasError ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                            <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">Kan website niet tonen</h4>
                            <p className="text-slate-500 max-w-md mb-6">
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
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800/80 backdrop-blur text-white text-xs px-3 py-2 rounded-lg pointer-events-none">
                            Is het scherm wit? Klik dan op 'Open in Browser' ↗️
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
