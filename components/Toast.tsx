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
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  const iconStyles = {
    error: 'bg-red-100 text-red-600',
    success: 'bg-emerald-100 text-emerald-600',
    info: 'bg-indigo-100 text-indigo-600',
  };

  const Icon = type === 'error' ? AlertTriangle : type === 'success' ? CheckCircle2 : Info;

  return (
    <div
      role="alert"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${styles[type]}`}
    >
      <div className={`p-2 rounded-lg ${iconStyles[type]}`}>
        <Icon size={18} />
      </div>
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};
