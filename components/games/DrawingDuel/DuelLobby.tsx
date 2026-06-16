/**
 * DuelLobby.tsx
 * Shows online classmates who can be challenged to a drawing duel.
 */

import React, { useState, useEffect } from 'react';
import { Users, Swords, Loader2, Wifi, WifiOff, ArrowLeft, Pencil } from 'lucide-react';
import {
    OnlinePlayer,
    subscribeToOnlinePlayers,
    subscribeToChallenges,
    sendChallenge,
    setPlayerOnline,
    setPlayerOffline
} from '../../../services/duelService';

interface DuelLobbyProps {
    currentUser: {
        uid: string;
        displayName: string;
        studentClass: string;
        schoolId?: string;
    };
    onBack: () => void;
    onChallengeAccepted: (sessionId: string) => void;
    onStartSolo?: () => void; // NEW: Allow switching to solo mode from lobby
}

export const DuelLobby: React.FC<DuelLobbyProps> = ({
    currentUser,
    onBack,
    onChallengeAccepted,
    onStartSolo
}) => {
    const [classmates, setClassmates] = useState<OnlinePlayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pendingChallenge, setPendingChallenge] = useState<string | null>(null);

    // Set user online when entering lobby
    useEffect(() => {
        if (currentUser.uid && currentUser.studentClass) {
            setPlayerOnline(currentUser.uid, currentUser.displayName, currentUser.studentClass, currentUser.schoolId);
        }

        // Cleanup: set offline when leaving
        return () => {
            if (currentUser.uid) {
                setPlayerOffline(currentUser.uid);
            }
        };
    }, [currentUser.uid, currentUser.displayName, currentUser.studentClass]);

    // Subscribe to online classmates
    useEffect(() => {
        if (!currentUser.studentClass) {
            setIsLoading(false);
            return;
        }

        const unsubscribe = subscribeToOnlinePlayers(
            currentUser.schoolId,
            (updatedClassmates) => {
                // Filter to same class and exclude self
                const sameClass = updatedClassmates.filter(p => p.class === currentUser.studentClass && p.uid !== currentUser.uid);
                setClassmates(sameClass);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser.studentClass, currentUser.uid]);

    const handleChallenge = async (classmate: OnlinePlayer) => {
        if (pendingChallenge) return;

        setPendingChallenge(classmate.uid);
        const challengeId = await sendChallenge({
            challenger_uid: currentUser.uid,
            challenger_name: currentUser.displayName,
            challenged_uid: classmate.uid,
            challenged_name: classmate.name,
            school_id: currentUser.schoolId,
        });

        if (!challengeId) {
            setPendingChallenge(null);
        }
    };

    // Subscribe to outgoing challenges to detect when they're accepted
    useEffect(() => {
        if (!currentUser.uid) return;

        const unsubscribe = subscribeToChallenges(
            currentUser.uid,
            (challenges) => {
                // Find any accepted challenge
                const acceptedChallenge = challenges.find(
                    c => c.status === 'accepted' && c.id
                );
                if (acceptedChallenge && acceptedChallenge.id) {
                    console.log('Duel: Challenge accepted! Joining session:', acceptedChallenge.id);
                    onChallengeAccepted(acceptedChallenge.id);
                }
            }
        );

        return () => unsubscribe();
    }, [currentUser.uid, onChallengeAccepted]);

    return (
        <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#FCF6EA' }}>
            {/* Header */}
            <div className="p-4 flex items-center gap-4" style={{ borderBottom: '1px solid #E7D8BD' }}>
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                    style={{ backgroundColor: '#FCF6EA', color: '#445865' }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl flex items-center gap-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>
                        <Swords style={{ color: '#D97848' }} size={24} />
                        Tekenduel Lobby
                    </h1>
                    <p className="text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                        Daag een klasgenoot uit voor een 1-minuut tekenstrijd!
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full" style={{ color: '#445865' }}>
                        <Loader2 size={32} className="animate-spin mb-4" style={{ color: '#D97848' }} />
                        <p style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Zoeken naar klasgenoten...</p>
                    </div>
                ) : !currentUser.studentClass ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <WifiOff size={48} className="mb-4" style={{ color: '#E7D8BD' }} />
                        <p className="text-lg mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>Geen klas gevonden</p>
                        <p className="text-sm" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>Je moet aan een klas toegewezen zijn om klasgenoten te kunnen uitdagen.</p>
                    </div>
                ) : classmates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#FCF6EA' }}>
                            <Users size={40} style={{ color: '#445865' }} />
                        </div>
                        <p className="text-lg mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", fontWeight: 700, color: '#08283B' }}>
                            Nog geen klasgenoten online
                        </p>
                        <p className="text-sm max-w-xs" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                            Wacht tot een klasgenoot uit {currentUser.studentClass} ook de duel lobby opent, of speel eerst solo!
                        </p>
                        <div className="mt-6 flex items-center gap-2 animate-pulse" style={{ color: '#5F947D' }}>
                            <Wifi size={16} />
                            <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>Jij bent online in {currentUser.studentClass}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4" style={{ color: '#5F947D' }}>
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#5F947D' }} />
                            <span className="text-sm font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>{classmates.length} klasgenoot{classmates.length !== 1 ? 'en' : ''} online</span>
                        </div>

                        {classmates.map((classmate) => (
                            <div
                                key={classmate.uid}
                                className="rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
                                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E7D8BD' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#D97848')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E7D8BD')}
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #D97848, #D97848)' }}>
                                    {classmate.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="font-bold" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#08283B' }}>{classmate.name}</p>
                                    <p className="text-sm flex items-center gap-1" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#5F947D' }} />
                                        Online
                                    </p>
                                </div>

                                {/* Challenge Button */}
                                <button
                                    onClick={() => handleChallenge(classmate)}
                                    disabled={pendingChallenge !== null}
                                    className="px-5 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#D97848]"
                                    style={
                                        pendingChallenge === classmate.uid
                                            ? { backgroundColor: 'rgba(217,119,87,0.15)', color: '#D97848', cursor: 'wait' }
                                            : pendingChallenge
                                                ? { backgroundColor: '#FCF6EA', color: '#445865', cursor: 'not-allowed' }
                                                : { background: 'linear-gradient(135deg, #D97848, #D97848)', color: '#FFFFFF' }
                                    }
                                >
                                    {pendingChallenge === classmate.uid ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Wachten...
                                        </>
                                    ) : (
                                        <>
                                            <Swords size={18} />
                                            Uitdagen
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 space-y-3" style={{ borderTop: '1px solid #E7D8BD', backgroundColor: '#FFFFFF' }}>
                <p className="text-xs text-center" style={{ fontFamily: "'Outfit', system-ui, sans-serif", color: '#445865' }}>
                    Tip: Wie in 1 minuut de meeste tekeningen door de AI goedgekeurd krijgt, wint!
                </p>

                {/* Solo Mode Button */}
                {onStartSolo && (
                    <button
                        onClick={onStartSolo}
                        className="w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#5F947D]"
                        style={{ backgroundColor: '#5F947D', color: '#FFFFFF' }}
                    >
                        <Pencil size={18} />
                        Speel Solo (Tegen AI)
                    </button>
                )}
            </div>
        </div>
    );
};

export default DuelLobby;
