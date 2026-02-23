import React, { useState } from 'react';
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

    if (!isOpen) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                        <Share size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{title}</h3>
                    <p className="text-slate-500 text-sm">{description}</p>
                </div>

                {isSharing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                        <span className="text-slate-400 text-sm">Link genereren...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-600 font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow"
                                title="Kopieer link"
                            >
                                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                            </button>
                        </div>

                        <div className="text-center text-xs text-slate-400">
                            {copied ? '✓ Gekopieerd!' : 'Kopieer de link om te delen'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
