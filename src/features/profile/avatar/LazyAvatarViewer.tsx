import React, { Suspense } from 'react';
import { AvatarConfig } from '@/types';

const AvatarStage = React.lazy(() => import('@/features/profile/avatar/AvatarStage'));

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const AvatarStageFallback = ({ variant = 'full' }: Pick<LazyAvatarViewerProps, 'variant'>) => (
    <div
        data-avatar-stage-fallback="true"
        className={`relative h-full w-full overflow-hidden ${variant === 'head' ? 'min-h-[160px]' : 'min-h-[300px]'}`}
        style={{ backgroundColor: variant === 'head' ? 'transparent' : '#FCF6EA' }}
        role="status"
        aria-live="polite"
    >
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className={variant === 'head' ? 'relative h-28 w-28' : 'relative h-64 w-40'}>
                {variant !== 'head' && (
                    <>
                        <div className="absolute left-1/2 top-[92px] h-28 w-24 -translate-x-1/2 rounded-[12px] border border-[#E7D8BD] bg-[#F2E4CC]" />
                        <div className="absolute left-1/2 top-[202px] h-12 w-32 -translate-x-1/2 rounded-[10px] bg-[#E7D8BD]" />
                    </>
                )}
                <div className="absolute left-1/2 top-6 h-20 w-20 -translate-x-1/2 rounded-full border border-[#E7D8BD] bg-[#F5D0B0]" />
                <div className="absolute left-1/2 top-3 h-9 w-24 -translate-x-1/2 rounded-t-full bg-[#3D2314]" />
                <div className="absolute left-1/2 top-[86px] h-3 w-24 -translate-x-1/2 rounded-full bg-[#D97848]" />
            </div>
        </div>
        <span className="sr-only">Avatar wordt geladen...</span>
    </div>
);

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    return (
        <div className="relative w-full h-full group" style={{ backgroundColor: props.variant === 'head' ? 'transparent' : '#FCF6EA' }}>
            <Suspense fallback={<AvatarStageFallback variant={props.variant} />}>
                <AvatarStage {...props} />
            </Suspense>
        </div>
    );
};

export default LazyAvatarViewer;
