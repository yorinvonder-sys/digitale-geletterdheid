import React, { Suspense } from 'react';
import { AvatarConfig } from '@/types';

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const LazyHuman = React.lazy(() =>
    import('@/features/profile/avatar/AvatarViewer').then((m) => ({ default: m.AvatarViewer }))
);

const LazyDuck = React.lazy(() =>
    import('@/features/profile/avatar/AvatarViewer2D').then((m) => ({ default: m.AvatarViewer2D }))
);

const AvatarLoadingFallback: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-lab-cream" />
);

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    const isHuman = (props.config.avatarKind ?? 'duck') === 'human';

    return (
        <Suspense fallback={<AvatarLoadingFallback />}>
            {isHuman
                ? <LazyHuman {...props} />
                : <LazyDuck {...props} />
            }
        </Suspense>
    );
};

export default LazyAvatarViewer;
