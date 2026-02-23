/**
 * Skeleton Component
 * Reusable loading placeholder for perceived performance
 */

import React from 'react';

interface SkeletonProps {
    variant?: 'text' | 'title' | 'avatar' | 'card' | 'image' | 'circle' | 'rect';
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
    animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'rect',
    width,
    height,
    className = '',
    count = 1,
    animated = true,
}) => {
    const baseClass = animated ? 'skeleton' : 'skeleton-pulse';

    const getVariantClass = () => {
        switch (variant) {
            case 'text':
                return 'skeleton-text';
            case 'title':
                return 'skeleton-title';
            case 'avatar':
                return 'skeleton-avatar';
            case 'card':
                return 'skeleton-card';
            case 'image':
                return 'skeleton-image';
            case 'circle':
                return 'skeleton-avatar';
            default:
                return '';
        }
    };

    const style: React.CSSProperties = {
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
    };

    const skeletons = Array.from({ length: count }, (_, i) => (
        <div
            key={i}
            className={`${baseClass} ${getVariantClass()} ${className}`}
            style={style}
            aria-hidden="true"
        />
    ));

    return count === 1 ? skeletons[0] : <>{skeletons}</>;
};

/**
 * Skeleton Card - Pre-built mission card loading state
 */
export const SkeletonMissionCard: React.FC = () => (
    <div className="card p-6 space-y-4">
        <Skeleton variant="avatar" width={64} height={64} />
        <div className="flex gap-2">
            <Skeleton width={60} height={20} className="rounded-full" />
            <Skeleton width={80} height={20} className="rounded-full" />
        </div>
        <Skeleton variant="title" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="60%" />
    </div>
);

/**
 * Skeleton Chat Message - Loading state for chat bubbles
 */
export const SkeletonChatMessage: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && <Skeleton variant="avatar" width={40} height={40} />}
        <div className="flex-1 max-w-[70%] space-y-2">
            <Skeleton height={60} className="rounded-2xl" />
        </div>
    </div>
);

/**
 * Skeleton Image - Loading state for images with aspect ratio
 */
export const SkeletonImage: React.FC<{ aspectRatio?: string; className?: string }> = ({
    aspectRatio = '16 / 9',
    className = '',
}) => (
    <div
        className={`skeleton ${className}`}
        style={{ aspectRatio, width: '100%' }}
        aria-hidden="true"
    />
);

export default Skeleton;
