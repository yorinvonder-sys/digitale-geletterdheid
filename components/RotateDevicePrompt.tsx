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
        <div className="fixed inset-0 z-[9999] bg-lab-muted/95 backdrop-blur-md flex items-center justify-center p-6">
            <div className="max-w-md text-center">
                {/* Animated rotate icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto relative">
                        {/* Phone outline */}
                        <div className="absolute inset-0 flex items-center justify-center animate-pulse motion-reduce:animate-none">
                            <Smartphone size={80} className="text-lab-muted transform rotate-0" />
                        </div>
                        {/* Rotating arrow */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <RotateCcw
                                size={48}
                                className="text-lab-sage animate-spin motion-reduce:animate-none"
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
                <p className="text-lab-muted text-lg mb-6 leading-relaxed">
                    Deze missie werkt het beste in <span className="text-lab-sage font-bold">liggend formaat</span>.
                    Draai je scherm voor de beste ervaring!
                </p>

                {/* Visual hint */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-12 h-20 border-2 border-lab-muted rounded-xl flex items-center justify-center">
                        <span className="text-lab-muted text-xs">Nu</span>
                    </div>
                    <div className="text-lab-sage text-2xl">→</div>
                    <div className="w-20 h-12 border-2 border-lab-sage rounded-xl flex items-center justify-center bg-lab-sage/10">
                        <span className="text-lab-sage text-xs font-bold">Beter!</span>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="px-6 py-3 bg-lab-muted hover:bg-lab-muted text-lab-muted rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                    <X size={18} />
                    Toch doorgaan
                </button>
            </div>
        </div>
    );
};
