import React, { Suspense } from 'react';
import { AvatarConfig } from '../types';
import { AvatarViewer2D } from './AvatarViewer2D';

const AvatarViewer3D = React.lazy(() => import('./AvatarViewer'));

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const LoadingOverlay = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-3 p-6 bg-white/90 rounded-2xl shadow-xl border border-indigo-100">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <div className="flex flex-col items-center">
                <span className="text-indigo-900 font-bold text-sm">3D Avatar Laden...</span>
                <span className="text-indigo-500/70 text-[10px] font-medium uppercase tracking-wider">Even geduld</span>
            </div>
        </div>
    </div>
);

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    return (
        <div className="relative w-full h-full group">
            <Suspense fallback={
                <>
                    <AvatarViewer2D {...props} interactive={false} />
                    <LoadingOverlay />
                </>
            }>
                <AvatarViewer3D {...props} />
            </Suspense>
        </div>
    );
};

export default LazyAvatarViewer;
