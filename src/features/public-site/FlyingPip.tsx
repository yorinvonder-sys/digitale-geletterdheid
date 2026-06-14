/**
 * MascotGuide — Static mascot aligned to a section header cluster.
 *
 * Usage: wrap around a <section> element:
 *   <PipGuide pose="excited" tooltip="..." side="right">
 *     <section ...>...</section>
 *   </PipGuide>
 *
 * - Renders close to the section title instead of the far outer gutter
 * - Gentle floating animation
 * - Hidden below xl (1280px) where gutters are too narrow
 * - Wrapper is position:relative so the mascot avoids content-visibility clipping
 */
import React, { useEffect } from 'react';

type PipPose = 'flying' | 'concerned' | 'excited' | 'thinking' | 'checkmark' | 'waving' | 'celebrating' | 'reading';

const POSE_SRC: Record<PipPose, string> = {
    flying: '/assets/brand/dgskills-duck-guide-v3.png',
    concerned: '/assets/brand/dgskills-duck-guide-v3.png',
    excited: '/assets/brand/dgskills-duck-guide-v3.png',
    thinking: '/assets/brand/dgskills-duck-guide-v3.png',
    checkmark: '/assets/brand/dgskills-duck-guide-v3.png',
    waving: '/assets/brand/dgskills-duck-guide-v3.png',
    celebrating: '/assets/brand/dgskills-duck-guide-v3.png',
    reading: '/assets/brand/dgskills-duck-guide-v3.png',
};

interface HeroPipNestProps {
    tooltip: string;
}

interface PipGuideProps {
    pose: PipPose;
    tooltip: string;
    side: 'left' | 'right';
    topOffset?: string;
    xOffset?: string;
    children: React.ReactNode;
}

const STYLE_ID = 'pip-guide-style';
function ensureStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        @keyframes pip-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .pip-floating { animation: pip-float 2.5s ease-in-out infinite; }
        .pip-tooltip { pointer-events: none; }
    `;
    document.head.appendChild(style);
}

export function PipGuide({ pose, tooltip, side, topOffset = '8.5rem', xOffset, children }: PipGuideProps) {
    useEffect(() => { ensureStyles(); }, []);

    // Tooltip always above the mascot — avoids overlapping content on either side
    const tooltipSideStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    // Arrow pointing downward toward the mascot
    const arrowStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        border: '5px solid transparent',
        borderTopColor: '#E7D8BD',
    };

    const anchorStyle: React.CSSProperties = side === 'left'
        ? {
            left: '50%',
            transform: xOffset ?? 'translateX(calc(-50% - 18rem))',
        }
        : {
            left: '50%',
            transform: xOffset ?? 'translateX(calc(-50% + 18rem))',
        };

    return (
        <div className="relative">
            {/* Mascot — positioned near the section header for a tighter visual relationship */}
            <div
                className="absolute hidden xl:block pointer-events-none"
                style={{
                    top: topOffset,
                    ...anchorStyle,
                    zIndex: 10,
                }}
                aria-hidden="true"
            >
                <div className="pip-hover-zone pointer-events-auto" style={{ position: 'relative' }}>
                    {/* Tooltip label */}
                    <div
                        className="pip-tooltip"
                        style={{
                            ...tooltipSideStyle,
                            padding: '8px 12px',
                            borderRadius: 10,
                            fontSize: 13,
                            lineHeight: 1.4,
                            fontFamily: "'Outfit', system-ui, sans-serif",
                            color: '#08283B',
                            background: '#FCF6EA',
                            border: '1px solid #E7D8BD',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            maxWidth: 148,
                            textAlign: 'center' as const,
                            whiteSpace: 'normal' as const,
                        }}
                    >
                        {tooltip}
                        <div style={arrowStyle} />
                    </div>

                    {/* Mascot image */}
                    <img
                        src={POSE_SRC[pose]}
                        alt=""
                        className="pip-floating"
                        style={{
                            position: 'relative',
                            width: 48,
                            height: 'auto',
                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
                        }}
                        width={48}
                        loading="lazy"
                    />
                </div>
            </div>

            {children}
        </div>
    );
}

export function HeroPipNest(_props: HeroPipNestProps) {
    return (
        <aside
            className="mt-10 hidden xl:block"
            role="note"
            aria-label="DGSkills eend rust uit"
        >
            <img
                src="/assets/brand/dgskills-duck-guide-v3.png"
                alt="DGSkills eend rust uit"
                style={{
                    width: 160,
                    height: 'auto',
                    filter: 'drop-shadow(0 4px 8px rgba(26,26,25,0.08))',
                }}
                width={160}
                loading="lazy"
            />
        </aside>
    );
}
