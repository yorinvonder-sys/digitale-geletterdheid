import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

interface AiTransparencyNoticeProps {
  studentId: string;
  children: React.ReactNode;
}

const STORAGE_KEY = 'dgskills_ai_notice_seen';
const GAME_PROGRAMMEUR_LOGO = '/assets/missions/game-programmeur-logo.png';

function hasSeenNotice(studentId: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return seen[studentId] === true;
  } catch {
    return false;
  }
}

function markNoticeSeen(studentId: string): void {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    seen[studentId] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // localStorage unavailable — notice will show again next time
  }
}

export const AiTransparencyNotice: React.FC<AiTransparencyNoticeProps> = ({
  studentId,
  children,
}) => {
  const [acknowledged, setAcknowledged] = useState<boolean | null>(null);

  useEffect(() => {
    setAcknowledged(hasSeenNotice(studentId));
  }, [studentId]);

  if (acknowledged === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-lab-line border-t-lab-coral rounded-full animate-spin" />
      </div>
    );
  }

  if (acknowledged) {
    return <>{children}</>;
  }

  return (
    <div className="w-full flex items-center justify-center p-6" style={{ minHeight: '100dvh' }}>
      <div
        className="flex w-full max-w-[440px] flex-col items-center justify-center text-center rounded-[28px] px-6 py-7 shadow-[0_20px_50px_rgba(8,40,59,0.10)]"
        style={{ backgroundColor: '#FFFDF7', border: '1px solid #E7D8BD', color: '#08283B' }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-sm"
          style={{ backgroundColor: '#FCF6EA', border: '1px solid #E7D8BD' }}
        >
          <img
            src={GAME_PROGRAMMEUR_LOGO}
            alt="Game Programmeur opdrachtlogo"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.14em] mb-2" style={{ color: '#5F947D' }}>
          Game Programmeur
        </p>
        <h3 className="text-xl font-black text-lab-ink mb-2">AI-mentor</h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#445865' }}>
          Je chat met AI om je opdracht stap voor stap te maken.
        </p>
        <ul className="w-full text-left text-sm space-y-3 mb-6" style={{ color: '#445865' }}>
          <li className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: '#5F947D' }} />
            <span>Alleen noodzakelijke opdrachtcontext gaat naar de AI.</span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: '#5F947D' }} />
            <span>Providergebruik en bewaartermijnen volgen de school- en providerafspraken.</span>
          </li>
          <li className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" style={{ color: '#5F947D' }} />
            <span>Opslag en verwerking volgen de afgesproken EER/EU-projectregio waar contractueel vastgelegd.</span>
          </li>
        </ul>
        <button
          onClick={() => {
            markNoticeSeen(studentId);
            setAcknowledged(true);
          }}
          className="px-7 py-3 rounded-xl text-sm font-black transition-colors shadow-sm hover:brightness-95"
          style={{ backgroundColor: '#D7C95F', color: '#08283B' }}
        >
          Begrepen
        </button>
      </div>
    </div>
  );
};
