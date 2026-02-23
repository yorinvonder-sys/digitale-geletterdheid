/**
 * ChallengeToast.tsx
 * Notification toast for incoming duel challenges.
 * Shows challenger name with Accept/Decline/Block buttons and countdown timer.
 */

import React, { useState, useEffect } from 'react';
import { Swords, X, Check, Clock, Ban } from 'lucide-react';
import { DuelChallenge } from '../../../services/duelService';

interface ChallengeToastProps {
    challenge: DuelChallenge;
    onAccept: () => void;
    onDecline: () => void;
    onBlock?: () => void;
}

export const ChallengeToast: React.FC<ChallengeToastProps> = ({
    challenge,
    onAccept,
    onDecline,
    onBlock
}) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);

    useEffect(() => {
        // DuelChallenge has created_at (ISO), compute 30s expiry from it
        const createdMs = challenge.created_at ? new Date(challenge.created_at).getTime() : Date.now();
        const expiresMs = createdMs + 30_000;

        const updateTimer = () => {
            const remaining = Math.max(0, Math.ceil((expiresMs - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) {
                onDecline();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [challenge.created_at, onDecline]);

    const handleBlockConfirm = () => {
        if (onBlock) {
            onBlock();
        }
        onDecline();
        setShowBlockConfirm(false);
    };

    // Block confirmation modal
    if (showBlockConfirm) {
        return (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 rounded-2xl shadow-2xl border border-red-500/30 p-6 max-w-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                            <Ban size={24} className="text-red-400" />
                        </div>
                        <div>
                            <p className="text-white font-black text-lg">
                                {challenge.challenger_name} blokkeren?
                            </p>
                            <p className="text-slate-400 text-xs">
                                Deze persoon kan je niet meer uitdagen.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBlockConfirm(false)}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            onClick={handleBlockConfirm}
                            className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors"
                        >
                            🚫 Ja, Blokkeer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl shadow-orange-500/30 p-1">
                <div className="bg-slate-900 rounded-xl p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Swords size={24} className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">
                                Tekenduel Uitdaging!
                            </p>
                            <p className="text-white font-black text-lg">
                                {challenge.challenger_name} daagt je uit!
                            </p>
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-mono font-bold text-sm
                            ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
                            <Clock size={14} />
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4">
                        1 minuut tekenen - wie krijgt de meeste tekeningen goedgekeurd door de AI?
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        {onBlock && (
                            <button
                                onClick={() => setShowBlockConfirm(true)}
                                className="py-3 px-3 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-red-300 rounded-xl font-bold flex items-center justify-center transition-colors"
                                title="Blokkeer deze persoon"
                            >
                                <Ban size={18} />
                            </button>
                        )}
                        <button
                            onClick={onDecline}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                            <X size={18} />
                            Weigeren
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                        >
                            <Check size={18} />
                            Accepteren!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeToast;

