import React, { useState, useEffect } from 'react';
import { RotateCcw, Smartphone, X } from 'lucide-react';
import { isTablet, isPortrait } from '../utils/screenOrientation';

interface RotateDevicePromptProps {
    onDismiss?: () => void;
    forceDismiss?: boolean;
}

/**
 * Shows a prompt asking users to rotate their device to landscape mode.
 * Only visible on tablets in portrait orientation.
 */
export const RotateDevicePrompt: React.FC<RotateDevicePromptProps> = ({
    onDismiss,
    forceDismiss = false
}) => {
    const [show, setShow] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Show if tablet + portrait + not dismissed
            const shouldShow = isTablet() && isPortrait() && !dismissed && !forceDismiss;
            setShow(shouldShow);
        };

        checkOrientation();

        // Listen for orientation/resize changes
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, [dismissed, forceDismiss]);

    const handleDismiss = () => {
        setDismissed(true);
        setShow(false);
        onDismiss?.();
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                {/* Animated rotate icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto relative">
                        {/* Phone outline */}
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                            <Smartphone size={80} className="text-slate-500 transform rotate-0" />
                        </div>
                        {/* Rotating arrow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RotateCcw
                                size={48}
                                className="text-emerald-400 animate-spin"
                                style={{ animationDuration: '3s' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-black text-white mb-3">
                    📱 Draai je iPad!
                </h2>

                {/* Description */}
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    Deze missie werkt het beste in <span className="text-emerald-400 font-bold">liggend formaat</span>.
                    Draai je scherm voor de beste ervaring!
                </p>

                {/* Visual hint */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-12 h-20 border-2 border-slate-600 rounded-xl flex items-center justify-center">
                        <span className="text-slate-600 text-xs">Nu</span>
                    </div>
                    <div className="text-emerald-400 text-2xl">→</div>
                    <div className="w-20 h-12 border-2 border-emerald-400 rounded-xl flex items-center justify-center bg-emerald-500/10">
                        <span className="text-emerald-400 text-xs font-bold">Beter!</span>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                    <X size={18} />
                    Toch doorgaan
                </button>
            </div>
        </div>
    );
};
