import React from 'react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center">
        {icon ? (
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400" aria-hidden="true">
                {icon}
            </div>
        ) : (
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
            </div>
        )}
        <div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
            {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
        </div>
        {action && (
            <button
                onClick={action.onClick}
                className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                {action.label}
            </button>
        )}
    </div>
);
