import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    /** Optional fallback UI to render on error */
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    errorId: string | null;
}

/**
 * SecureErrorBoundary - Catches React component crashes without leaking
 * sensitive information (stack traces, file paths, internal state) to users.
 * 
 * Security considerations for vibe-coded apps:
 * - Stack traces can reveal file structure, API endpoints, and service names
 * - Error messages may contain user data, tokens, or internal state
 * - This boundary logs details to console (for devs) but shows a safe UI
 */
export class SecureErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorId: null };
    }

    static getDerivedStateFromError(_error: Error): Partial<State> {
        // Generate a short error ID for support reference
        const errorId = `E-${Date.now().toString(36).slice(-6).toUpperCase()}`;
        return { hasError: true, errorId };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log full details for developers — NEVER expose to UI
        console.error('[SecureErrorBoundary] Caught error:', {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            errorId: this.state.errorId,
            timestamp: new Date().toISOString(),
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, errorId: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                        <AlertTriangle className="text-amber-500" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                        Oeps, er ging iets mis
                    </h2>
                    <p className="text-slate-500 mb-1 max-w-md">
                        Dit onderdeel werkt even niet. Probeer het opnieuw of ververs de pagina.
                    </p>
                    <p className="text-xs text-slate-400 mb-6 font-mono">
                        Referentie: {this.state.errorId}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRetry}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm
                                       hover:bg-indigo-700 transition-colors flex items-center gap-2
                                       active:scale-95 transition-transform"
                        >
                            <RefreshCw size={16} />
                            Opnieuw proberen
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm
                                       hover:bg-slate-200 transition-colors active:scale-95 transition-transform"
                        >
                            Pagina verversen
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
