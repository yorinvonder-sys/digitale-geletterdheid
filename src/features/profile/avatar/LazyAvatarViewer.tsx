import React from 'react';
import { AvatarConfig } from '@/types';
import { AvatarViewer2D } from '@/features/profile/avatar/AvatarViewer2D';

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    return <AvatarViewer2D {...props} />;
};

export default LazyAvatarViewer;
