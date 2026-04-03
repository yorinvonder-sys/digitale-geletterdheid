import React from 'react';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Er ging iets mis',
    message = 'Probeer het later opnieuw of neem contact op met support.',
    onRetry,
    retryLabel = 'Opnieuw proberen',
}) => (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center" role="alert">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        </div>
        <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 max-w-sm">{message}</p>
        </div>
        {onRetry && (
            <button
                onClick={onRetry}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                {retryLabel}
            </button>
        )}
    </div>
);
