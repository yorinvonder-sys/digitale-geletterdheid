/**
 * Toast.tsx
 * Simple toast notification for user feedback (success, error, info).
 */

import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'error',
  onDismiss,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const styles = {
    error: 'bg-white border border-duck-error text-duck-ink shadow-duck-soft',
    success: 'bg-duck-ink text-white border border-duck-ink shadow-duck-soft',
    info: 'bg-duck-ink text-white border border-duck-ink shadow-duck-soft',
  };

  const iconStyles = {
    error: 'bg-duck-error text-white',
    success: 'bg-duck-acid text-duck-ink',
    info: 'bg-white/15 text-white',
  };

  const Icon = type === 'error' ? AlertTriangle : type === 'success' ? CheckCircle2 : Info;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-4 py-3 rounded-[1rem] animate-in fade-in slide-in-from-bottom-4 duration-300 ${styles[type]}`}
    >
      <div className={`p-2 rounded-lg ${iconStyles[type]}`}>
        <Icon size={18} />
      </div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};
