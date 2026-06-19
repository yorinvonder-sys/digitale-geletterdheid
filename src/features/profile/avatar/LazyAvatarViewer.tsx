import React, { Suspense } from 'react';
import { AvatarConfig } from '@/types';
import { AvatarViewer2D } from '@/features/profile/avatar/AvatarViewer2D';

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const LazyHuman = React.lazy(() =>
    import('@/features/profile/avatar/AvatarViewer').then((m) => ({ default: m.AvatarViewer }))
);

const LazyDuck3D = React.lazy(() =>
    import('@/features/profile/avatar/AvatarViewer3DDuck').then((m) => ({ default: m.AvatarViewer3DDuck }))
);

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    const isHuman = (props.config.avatarKind ?? 'duck') === 'human';

    return (
        <Suspense fallback={<AvatarViewer2D {...props} interactive={false} />}>
            {isHuman
                ? <LazyHuman {...props} />
                : <LazyDuck3D {...props} />
            }
        </Suspense>
    );
};

export default LazyAvatarViewer;
