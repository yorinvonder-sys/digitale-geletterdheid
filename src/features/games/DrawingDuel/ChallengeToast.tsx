/**
 * ChallengeToast.tsx
 * Notification toast for incoming duel challenges.
 * Shows challenger name with Accept/Decline/Block buttons and countdown timer.
 */

import React, { useState, useEffect } from 'react';
import { Swords, X, Check, Clock, Ban } from 'lucide-react';
import { DuelChallenge } from '@/services/duelService';

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
                <div className="rounded-2xl shadow-2xl p-6 max-w-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                            <Ban size={24} style={{ color: '#D97848' }} />
                        </div>
                        <div>
                            <p className="text-lg" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>
                                {challenge.challenger_name} blokkeren?
                            </p>
                            <p className="text-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                                Deze persoon kan je niet meer uitdagen.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBlockConfirm(false)}
                            className="flex-1 py-3 rounded-full font-bold transition-all duration-300"
                            style={{ backgroundColor: '#E7D8BD', color: '#445865' }}
                        >
                            Annuleren
                        </button>
                        <button
                            onClick={handleBlockConfirm}
                            className="flex-1 py-3 rounded-full font-bold transition-all duration-300"
                            style={{ backgroundColor: '#D97848', color: '#FFFFFF' }}
                        >
                            Ja, Blokkeer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="p-[2px] rounded-2xl" style={{ background: 'linear-gradient(135deg, #D97848, #D97848)' }}>
                <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF' }}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 120, 72,0.12)' }}>
                            <Swords size={24} style={{ color: '#D97848' }} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#D97848' }}>
                                Tekenduel Uitdaging!
                            </p>
                            <p className="text-lg" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>
                                {challenge.challenger_name} daagt je uit!
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-1 px-3 py-1 rounded-full font-mono font-bold text-sm"
                            style={timeLeft <= 10
                                ? { backgroundColor: '#D97848', color: '#FFFFFF' }
                                : { backgroundColor: '#E7D8BD', color: '#445865' }
                            }
                        >
                            <Clock size={14} />
                            {timeLeft}s
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm mb-4" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                        1 minuut tekenen - wie krijgt de meeste tekeningen goedgekeurd door de AI?
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        {onBlock && (
                            <button
                                onClick={() => setShowBlockConfirm(true)}
                                className="py-3 px-3 rounded-full font-bold flex items-center justify-center transition-all duration-300"
                                style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#D97848' }}
                                title="Blokkeer deze persoon"
                            >
                                <Ban size={18} />
                            </button>
                        )}
                        <button
                            onClick={onDecline}
                            className="flex-1 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300"
                            style={{ backgroundColor: '#E7D8BD', color: '#445865' }}
                        >
                            <X size={18} />
                            Weigeren
                        </button>
                        <button
                            onClick={onAccept}
                            className="flex-1 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                            style={{ background: 'linear-gradient(135deg, #D97848, #D97848)', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(217, 120, 72,0.3)' }}
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
