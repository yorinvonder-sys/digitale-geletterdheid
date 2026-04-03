import React from 'react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Laden...', size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 border',
        md: 'w-10 h-10 border-2',
        lg: 'w-14 h-14 border-2',
    };
    const textClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-live="polite">
            <div className={`${sizeClasses[size]} border-slate-200 border-t-indigo-600 rounded-full animate-spin`} aria-hidden="true" />
            <p className={`${textClasses[size]} text-slate-500 font-medium`}>{message}</p>
        </div>
    );
};
