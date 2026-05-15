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
    error: 'bg-lab-coral border-lab-coral text-lab-coral',
    success: 'bg-lab-sage border-lab-sage text-lab-sage',
    info: 'bg-lab-coral border-lab-coral text-lab-coral',
  };

  const iconStyles = {
    error: 'bg-lab-coral text-white',
    success: 'bg-lab-sage text-white',
    info: 'bg-lab-coral text-white',
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
