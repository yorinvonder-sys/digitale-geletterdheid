import React, { useEffect, useMemo, useState } from 'react';
import { DuelChallenge, respondToChallenge, subscribeToChallenges } from '../../services/duelService';
import { blockUser, getBlockedUsers } from '../../services/blockingService';
import { ChallengeToast } from './DrawingDuel/ChallengeToast';
import { DuelLobby } from './DrawingDuel/DuelLobby';
import { DuelWaitingRoom } from './DrawingDuel/DuelWaitingRoom';
import { DuelGame } from './DrawingDuel/DuelGame';

type View = 'lobby' | 'waiting' | 'playing';

interface DrawingDuelGameProps {
  user: {
    uid: string;
    displayName: string;
    studentClass: string;
    schoolId?: string;
  };
  onExit: () => void;
  onXPEarned?: (amount: number, label: string) => void;
}

export const DrawingDuelGame: React.FC<DrawingDuelGameProps> = ({ user, onExit, onXPEarned }) => {
  const [view, setView] = useState<View>('lobby');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [incomingChallenge, setIncomingChallenge] = useState<DuelChallenge | null>(null);
  const [blockedUids, setBlockedUids] = useState<string[]>([]);

  // Load blocked users once.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await getBlockedUsers(user.uid);
      if (mounted) setBlockedUids(list);
    })();
    return () => {
      mounted = false;
    };
  }, [user.uid]);

  // Subscribe to incoming challenges.
  useEffect(() => {
    if (!user.uid) return;
    const unsub = subscribeToChallenges(
      user.uid,
      (challenges) => {
        // Filter out blocked users client-side
        const filtered = challenges.filter(c => !blockedUids.includes(c.challenger_uid));
        const latest = filtered[0] || null;
        setIncomingChallenge(latest);
      }
    );
    return () => unsub();
  }, [user.uid, blockedUids]);

  const handleAcceptChallenge = async () => {
    if (!incomingChallenge?.id) return;
    await respondToChallenge(incomingChallenge.id, true);
    setIncomingChallenge(null);
    setActiveSessionId(incomingChallenge.id);
    setView('waiting');
  };

  const handleDeclineChallenge = async () => {
    if (!incomingChallenge?.id) return;
    await respondToChallenge(incomingChallenge.id, false);
    setIncomingChallenge(null);
  };

  const handleBlockChallenger = async () => {
    if (!incomingChallenge) return;
    const ok = await blockUser(user.uid, incomingChallenge.challenger_uid, incomingChallenge.challenger_name);
    if (ok) {
      setBlockedUids((prev) => Array.from(new Set([...prev, incomingChallenge.challenger_uid])));
    }
  };

  const toast = useMemo(() => {
    if (!incomingChallenge) return null;
    if (view === 'playing') return null;
    return (
      <ChallengeToast
        challenge={incomingChallenge}
        onAccept={handleAcceptChallenge}
        onDecline={handleDeclineChallenge}
        onBlock={handleBlockChallenger}
      />
    );
  }, [incomingChallenge, view]);

  if (view === 'waiting' && activeSessionId) {
    return (
      <DuelWaitingRoom
        sessionId={activeSessionId}
        currentUserId={user.uid}
        onGameStart={() => setView('playing')}
        onExit={() => {
          setActiveSessionId(null);
          setView('lobby');
        }}
      />
    );
  }

  if (view === 'playing' && activeSessionId) {
    return (
      <DuelGame
        sessionId={activeSessionId}
        currentUserId={user.uid}
        onXPEarned={onXPEarned}
        onExit={() => {
          setActiveSessionId(null);
          setView('lobby');
        }}
      />
    );
  }

  // Default: lobby.
  return (
    <>
      {toast}
      <DuelLobby
        currentUser={user}
        onBack={onExit}
        onChallengeAccepted={(sessionId) => {
          setActiveSessionId(sessionId);
          setView('waiting');
        }}
      />
    </>
  );
};

export default DrawingDuelGame;

