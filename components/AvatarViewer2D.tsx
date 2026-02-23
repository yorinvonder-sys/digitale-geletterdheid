import React from 'react';
import { AvatarConfig } from '../types';

/**
 * Lightweight 2D SVG avatar preview - replaces three.js-based AvatarViewer.
 * Maintains: avatar visible, color/style feedback, onPartClick, variant (full/head).
 * Trade-off: 2D front view only (no 3D rotation/orbit).
 */

interface AvatarViewer2DProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const HAIR_COLORS: Record<string, string> = {
    short: '#5D4037', spiky: '#FF6B35', messy: '#4E342E', fade: '#212121',
    curls: '#3E2723', pigtails: '#F472B6', long: '#FFD700', bob: '#1F2937',
    ponytail: '#F59E0B', braids: '#263238', mohawk: '#ef4444', afro: '#292524',
    bun: '#854d0e', sidepart: '#F59E0B', buzzcut: '#57534e'
};

export const AvatarViewer2D: React.FC<AvatarViewer2DProps> = ({
    config,
    interactive = true,
    onPartClick,
    variant = 'full'
}) => {
    const hairColor = config.hairColor || HAIR_COLORS[config.hairStyle] || '#5D4037';
    const skinColor = config.baseModel === 'robot' ? '#C0C0C0' : config.skinColor;
    const shirtColor = config.shirtColor || '#3B82F6';
    const pantsColor = config.pantsColor || '#1F2937';
    const shoeColor = config.shoeColor || '#1a1a1a';
    const eyeColor = config.eyeColor || '#111111';
    const expression = config.expression || 'happy';
    const isFemale = config.gender === 'female';

    const handlePartClick = (part: string) => {
        if (interactive && onPartClick) {
            onPartClick(part);
        }
    };

    const clickableProps = (part: string) => interactive && onPartClick ? {
        onClick: () => handlePartClick(part),
        style: { cursor: 'pointer' as const }
    } : {};

    // SVG viewBox: centered, full body ~2 units tall
    const viewBox = variant === 'head' ? '0 0 100 120' : '0 0 100 200';
    const scale = variant === 'head' ? 0.6 : 1;

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-800/30 rounded-2xl overflow-hidden">
            <svg
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
            >
                <g transform={`translate(50, ${variant === 'head' ? 60 : 100}) scale(${scale})`}>
                    {variant === 'full' && (
                        <>
                            {/* Legs & shoes */}
                            <g {...clickableProps('pants')}>
                                <rect x={-18} y={50} width={16} height={50} fill={pantsColor} />
                                <rect x={2} y={50} width={16} height={50} fill={pantsColor} />
                                <rect x={-20} y={100} width={18} height={10} fill={shoeColor} />
                                <rect x={2} y={100} width={18} height={10} fill={shoeColor} />
                            </g>
                            {/* Torso */}
                            <g {...clickableProps('shirt')}>
                                <rect x={-22} y={0} width={44} height={55} fill={shirtColor} />
                            </g>
                            {/* Arms */}
                            <rect x={-32} y={0} width={10} height={50} fill={isFemale ? skinColor : shirtColor} />
                            <rect x={22} y={0} width={10} height={50} fill={isFemale ? skinColor : shirtColor} />
                        </>
                    )}
                    {/* Head group */}
                    <g transform={`translate(0, ${variant === 'full' ? -25 : 0})`}>
                        {/* Hair - behind/around head */}
                        <g {...clickableProps('hair')}>
                            {renderBlockHair(config.hairStyle, hairColor)}
                        </g>
                        {/* Head / face */}
                        <g {...clickableProps('skin')}>
                            <rect x={-25} y={-25} width={50} height={50} fill={skinColor} />
                            {/* Eyes */}
                            <g {...clickableProps('eyes')}>
                                <rect x={-15} y={-10} width={10} height={10} fill={eyeColor} />
                                <rect x={5} y={-10} width={10} height={10} fill={eyeColor} />
                            </g>
                            {/* Mouth/Expression */}
                            {renderBlockExpression(expression)}
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
};

function renderBlockHair(style: string, color: string): React.ReactNode {
    const fill = color;
    switch (style) {
        case 'short':
            return <rect x={-27} y={-30} width={54} height={15} fill={fill} />;
        case 'spiky':
            return (
                <>
                    <rect x={-27} y={-30} width={54} height={15} fill={fill} />
                    <rect x={-15} y={-35} width={10} height={10} fill={fill} />
                    <rect x={5} y={-35} width={10} height={10} fill={fill} />
                </>
            );
        case 'long':
            return (
                <>
                    <rect x={-27} y={-30} width={54} height={15} fill={fill} />
                    <rect x={-27} y={-15} width={10} height={40} fill={fill} />
                    <rect x={17} y={-15} width={10} height={40} fill={fill} />
                </>
            );
        default:
            return <rect x={-27} y={-30} width={54} height={15} fill={fill} />;
    }
}

function renderBlockExpression(expression: string): React.ReactNode {
    const color = "#7c3b2a";
    switch (expression) {
        case 'happy':
            return <rect x={-10} y={10} width={20} height={5} fill={color} />;
        case 'surprised':
            return <rect x={-5} y={8} width={10} height={10} fill={color} />;
        case 'neutral':
            return <rect x={-8} y={12} width={16} height={3} fill={color} />;
        case 'cool':
            return <rect x={-25} y={-12} width={50} height={12} fill="#111" />;
        default:
            return <rect x={-10} y={10} width={20} height={5} fill={color} />;
    }
}

export default AvatarViewer2D;
