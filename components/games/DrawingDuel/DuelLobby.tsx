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
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-white flex items-center gap-2">
                        <Swords className="text-orange-400" size={24} />
                        Tekenduel Lobby
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Daag een klasgenoot uit voor een 1-minuut tekenstrijd!
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Loader2 size={32} className="animate-spin mb-4" />
                        <p>Zoeken naar klasgenoten...</p>
                    </div>
                ) : !currentUser.studentClass ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-6">
                        <WifiOff size={48} className="mb-4 text-slate-600" />
                        <p className="text-lg font-bold mb-2">Geen klas gevonden</p>
                        <p className="text-sm">Je moet aan een klas toegewezen zijn om klasgenoten te kunnen uitdagen.</p>
                    </div>
                ) : classmates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Users size={40} className="text-slate-600" />
                        </div>
                        <p className="text-slate-300 text-lg font-bold mb-2">
                            Nog geen klasgenoten online
                        </p>
                        <p className="text-slate-500 text-sm max-w-xs">
                            Wacht tot een klasgenoot uit {currentUser.studentClass} ook de duel lobby opent, of speel eerst solo!
                        </p>
                        <div className="mt-6 flex items-center gap-2 text-emerald-400 animate-pulse">
                            <Wifi size={16} />
                            <span className="text-sm font-bold">Jij bent online in {currentUser.studentClass}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 mb-4">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm font-bold">{classmates.length} klasgenoot{classmates.length !== 1 ? 'en' : ''} online</span>
                        </div>

                        {classmates.map((classmate) => (
                            <div
                                key={classmate.uid}
                                className="bg-slate-800/50 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800 transition-colors"
                            >
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-black text-lg">
                                    {classmate.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <p className="text-white font-bold">{classmate.name}</p>
                                    <p className="text-slate-400 text-sm flex items-center gap-1">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                        Online
                                    </p>
                                </div>

                                {/* Challenge Button */}
                                <button
                                    onClick={() => handleChallenge(classmate)}
                                    disabled={pendingChallenge !== null}
                                    className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                                        ${pendingChallenge === classmate.uid
                                            ? 'bg-orange-500/20 text-orange-400 cursor-wait'
                                            : pendingChallenge
                                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30 active:scale-95'
                                        }`}
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
            <div className="p-4 border-t border-white/10 bg-slate-900/50 space-y-3">
                <p className="text-slate-500 text-xs text-center">
                    💡 Tip: Wie in 1 minuut de meeste tekeningen door de AI goedgekeurd krijgt, wint!
                </p>

                {/* Solo Mode Button */}
                {onStartSolo && (
                    <button
                        onClick={onStartSolo}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95 shadow-lg"
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
