import React, { useEffect, useState } from 'react';
import { Bot, ShieldCheck } from 'lucide-react';

interface AiTransparencyNoticeProps {
  studentId: string;
  children: React.ReactNode;
}

const STORAGE_KEY = 'dgskills_ai_notice_seen';

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
        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (acknowledged) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
        <Bot size={32} className="text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">AI-mentor</h3>
      <p className="text-sm text-slate-600 mb-4">
        Je gaat chatten met een AI-mentor die je helpt bij opdrachten.
      </p>
      <ul className="text-left text-sm text-slate-500 space-y-2 mb-6">
        <li className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
          <span>Alleen de tekst van je bericht wordt naar de AI gestuurd — geen persoonsgegevens.</span>
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
          <span>De AI onthoudt geen persoonlijke gegevens na de sessie.</span>
        </li>
        <li className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-green-500 mt-0.5 shrink-0" />
          <span>Je gegevens blijven in Europa (Nederland).</span>
        </li>
      </ul>
      <button
        onClick={() => {
          markNoticeSeen(studentId);
          setAcknowledged(true);
        }}
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        Begrepen
      </button>
    </div>
  );
};
