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
  children,
}) => {
  return <>{children}</>;
};
