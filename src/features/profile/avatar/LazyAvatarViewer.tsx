import React, { Suspense, useMemo } from 'react';
import { AvatarConfig } from '@/types';
import { normalizeAvatarConfig } from '@/config/avatarCatalog';

interface LazyAvatarViewerProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const LazyAvatar3D = React.lazy(() =>
    import('@/features/profile/avatar/AvatarViewer').then((m) => ({ default: m.AvatarViewer }))
);

/** Blokkerig silhouet in de kleuren van de leerling, getoond terwijl het
 *  3D-bestand nog laadt. Puur CSS: geen WebGL, geen extra netwerkverkeer. */
const AvatarSkeleton: React.FC<{ config: AvatarConfig; variant: 'full' | 'head' }> = ({ config, variant }) => (
    <div
        className="w-full h-full flex items-end justify-center pb-[12%] animate-pulse"
        style={{ backgroundColor: variant === 'full' ? '#FCF6EA' : 'transparent' }}
        aria-hidden="true"
    >
        <div className="flex flex-col items-center gap-[2px]">
            <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: config.skinColor }} />
            {variant === 'full' && (
                <>
                    <div className="flex gap-[2px]">
                        <div className="w-3 h-12 rounded-sm" style={{ backgroundColor: config.shirtColor }} />
                        <div className="w-10 h-12 rounded-sm" style={{ backgroundColor: config.shirtColor }} />
                        <div className="w-3 h-12 rounded-sm" style={{ backgroundColor: config.shirtColor }} />
                    </div>
                    <div className="flex gap-[2px]">
                        <div className="w-[18px] h-10 rounded-sm" style={{ backgroundColor: config.pantsColor }} />
                        <div className="w-[18px] h-10 rounded-sm" style={{ backgroundColor: config.pantsColor }} />
                    </div>
                </>
            )}
        </div>
    </div>
);

export const LazyAvatarViewer: React.FC<LazyAvatarViewerProps> = (props) => {
    // Verdedigingslinie: ook als een aanroeper een oude, opgeslagen configuratie
    // doorgeeft (eend-verenkleur, huisdier in het accessoire-slot) rendert de
    // avatar correct.
    const config = useMemo(() => normalizeAvatarConfig(props.config), [props.config]);

    return (
        <Suspense fallback={<AvatarSkeleton config={config} variant={props.variant ?? 'full'} />}>
            <LazyAvatar3D {...props} config={config} />
        </Suspense>
    );
};

export default LazyAvatarViewer;
