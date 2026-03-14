import React from 'react';
import { AvatarConfig } from '../types';

/**
 * Modern chibi-style 2D SVG avatar — hip, rounded, expressive.
 * Replaces the old blocky rectangle avatar with proper curves and proportions.
 */

interface AvatarViewer2DProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

// Subtle darken helper for shading
const darken = (hex: string, amount = 0.15): string => {
    const c = hex.replace('#', '');
    const r = Math.max(0, parseInt(c.slice(0, 2), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(c.slice(2, 4), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(c.slice(4, 6), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const lighten = (hex: string, amount = 0.15): string => {
    const c = hex.replace('#', '');
    const r = Math.min(255, parseInt(c.slice(0, 2), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(c.slice(2, 4), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(c.slice(4, 6), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const AvatarViewer2D: React.FC<AvatarViewer2DProps> = ({
    config,
    interactive = true,
    onPartClick,
    variant = 'full'
}) => {
    const hairColor = config.hairColor || '#5D4037';
    const skinColor = config.baseModel === 'robot' ? '#C0C0C0' : (config.skinColor || '#ffe0bd');
    const shirtColor = config.shirtColor || '#D97757';
    const pantsColor = config.pantsColor || '#1F2937';
    const shoeColor = config.shoeColor || '#1a1a1a';
    const eyeColor = config.eyeColor || '#4a3728';
    const expression = config.expression || 'happy';
    const isFemale = config.gender === 'female';
    const pose = config.pose || 'idle';

    const click = (part: string) => {
        if (interactive && onPartClick) onPartClick(part);
    };

    const cursor = interactive && onPartClick ? 'pointer' : 'default';

    // Layout constants
    const headCx = 100;
    const headCy = variant === 'head' ? 80 : 68;
    const headRx = 42;
    const headRy = 46;
    const bodyCy = 155;
    const bodyW = isFemale ? 48 : 54;
    const bodyH = 58;

    // Arm pose offsets
    const leftArmRotation = pose === 'wave' ? -45 : pose === 'peace' ? -30 : pose === 'dab' ? -60 : 0;
    const rightArmRotation = pose === 'wave' ? 0 : pose === 'peace' ? -30 : pose === 'dab' ? 40 : 0;

    const viewBox = variant === 'head' ? '30 10 140 140' : '10 -5 180 270';

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#FAF9F0] to-[#E8E6DF] rounded-2xl overflow-hidden">
            <svg
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
                style={{ maxHeight: '100%' }}
            >
                <defs>
                    {/* Cheek blush gradient */}
                    <radialGradient id="blush-l">
                        <stop offset="0%" stopColor="#ff9999" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="blush-r">
                        <stop offset="0%" stopColor="#ff9999" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
                    </radialGradient>
                    {/* Eye shine */}
                    <radialGradient id="eye-shine" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {variant === 'full' && (
                    <g>
                        {/* === LEGS === */}
                        <g onClick={() => click('pants')} style={{ cursor }}>
                            {/* Left leg — dichter bij elkaar, dikker */}
                            <rect x={82} y={bodyCy + bodyH / 2 - 8} width={20} height={48} rx={10} fill={pantsColor} />
                            {/* Right leg */}
                            <rect x={100} y={bodyCy + bodyH / 2 - 8} width={20} height={48} rx={10} fill={pantsColor} />
                        </g>

                        {/* === SHOES === */}
                        <g onClick={() => click('shoes')} style={{ cursor }}>
                            <ellipse cx={92} cy={bodyCy + bodyH / 2 + 40} rx={16} ry={9} fill={shoeColor} />
                            <ellipse cx={110} cy={bodyCy + bodyH / 2 + 40} rx={16} ry={9} fill={shoeColor} />
                            {/* Shoe sole */}
                            <ellipse cx={92} cy={bodyCy + bodyH / 2 + 44} rx={14} ry={4} fill={darken(shoeColor, 0.15)} />
                            <ellipse cx={110} cy={bodyCy + bodyH / 2 + 44} rx={14} ry={4} fill={darken(shoeColor, 0.15)} />
                            {/* Shoe highlight */}
                            <ellipse cx={90} cy={bodyCy + bodyH / 2 + 37} rx={8} ry={4} fill={lighten(shoeColor, 0.12)} opacity={0.4} />
                            <ellipse cx={108} cy={bodyCy + bodyH / 2 + 37} rx={8} ry={4} fill={lighten(shoeColor, 0.12)} opacity={0.4} />
                        </g>

                        {/* === BODY / TORSO === */}
                        <g onClick={() => click('shirt')} style={{ cursor }}>
                            {/* Main torso - rounded, iets breder */}
                            <rect
                                x={headCx - bodyW / 2}
                                y={bodyCy - bodyH / 2}
                                width={bodyW}
                                height={bodyH}
                                rx={isFemale ? 20 : 16}
                                fill={shirtColor}
                            />
                            {/* Shirt shading */}
                            <rect
                                x={headCx - bodyW / 2 + 4}
                                y={bodyCy - bodyH / 2 + 4}
                                width={bodyW - 8}
                                height={bodyH - 8}
                                rx={isFemale ? 16 : 12}
                                fill={lighten(shirtColor, 0.06)}
                                opacity={0.3}
                            />
                            {/* Collar / neckline */}
                            <path
                                d={`M ${headCx - 12} ${bodyCy - bodyH / 2} Q ${headCx} ${bodyCy - bodyH / 2 + 14} ${headCx + 12} ${bodyCy - bodyH / 2}`}
                                fill="none"
                                stroke={darken(shirtColor, 0.12)}
                                strokeWidth={2}
                                strokeLinecap="round"
                            />
                        </g>

                        {/* === ARMS — dichter bij body, beter aangesloten === */}
                        <g>
                            {/* Left arm */}
                            <g transform={`rotate(${leftArmRotation} ${headCx - bodyW / 2 + 6} ${bodyCy - bodyH / 2 + 12})`}>
                                <rect
                                    x={headCx - bodyW / 2 - 6}
                                    y={bodyCy - bodyH / 2 + 6}
                                    width={14}
                                    height={40}
                                    rx={7}
                                    fill={darken(shirtColor, 0.06)}
                                />
                                {/* Hand */}
                                <circle
                                    cx={headCx - bodyW / 2}
                                    cy={bodyCy - bodyH / 2 + 46}
                                    r={7}
                                    fill={skinColor}
                                />
                            </g>
                            {/* Right arm */}
                            <g transform={`rotate(${rightArmRotation} ${headCx + bodyW / 2 - 6} ${bodyCy - bodyH / 2 + 12})`}>
                                <rect
                                    x={headCx + bodyW / 2 - 8}
                                    y={bodyCy - bodyH / 2 + 6}
                                    width={14}
                                    height={40}
                                    rx={7}
                                    fill={darken(shirtColor, 0.06)}
                                />
                                {/* Hand */}
                                <circle
                                    cx={headCx + bodyW / 2}
                                    cy={bodyCy - bodyH / 2 + 46}
                                    r={7}
                                    fill={skinColor}
                                />
                                {/* Peace sign fingers */}
                                {pose === 'peace' && (
                                    <g>
                                        <rect x={headCx + bodyW / 2 - 3} y={bodyCy - bodyH / 2 + 32} width={4} height={12} rx={2} fill={skinColor} />
                                        <rect x={headCx + bodyW / 2 + 3} y={bodyCy - bodyH / 2 + 32} width={4} height={12} rx={2} fill={skinColor} />
                                    </g>
                                )}
                            </g>
                        </g>

                        {/* === NECK === */}
                        <rect
                            x={headCx - 8}
                            y={headCy + headRy - 10}
                            width={16}
                            height={18}
                            rx={6}
                            fill={skinColor}
                        />
                    </g>
                )}

                {/* === HEAD GROUP === */}
                <g>
                    {/* Hair behind head (long styles) */}
                    <g onClick={() => click('hair')} style={{ cursor }}>
                        {renderHairBack(config.hairStyle, hairColor, headCx, headCy, headRx, headRy, isFemale)}
                    </g>

                    {/* Head shape */}
                    <g onClick={() => click('skin')} style={{ cursor }}>
                        <ellipse cx={headCx} cy={headCy} rx={headRx} ry={headRy} fill={skinColor} />
                        {/* Subtle face highlight */}
                        <ellipse cx={headCx - 4} cy={headCy - 8} rx={headRx - 8} ry={headRy - 10} fill={lighten(skinColor, 0.05)} opacity={0.5} />
                    </g>

                    {/* === EARS === */}
                    <g onClick={() => click('skin')} style={{ cursor }}>
                        <ellipse cx={headCx - headRx + 2} cy={headCy + 4} rx={7} ry={10} fill={skinColor} />
                        <ellipse cx={headCx - headRx + 4} cy={headCy + 4} rx={4} ry={6} fill={darken(skinColor, 0.06)} />
                        <ellipse cx={headCx + headRx - 2} cy={headCy + 4} rx={7} ry={10} fill={skinColor} />
                        <ellipse cx={headCx + headRx - 4} cy={headCy + 4} rx={4} ry={6} fill={darken(skinColor, 0.06)} />
                    </g>

                    {/* === EYES === */}
                    <g onClick={() => click('eyes')} style={{ cursor }}>
                        {expression === 'cool' ? (
                            renderSunglasses(headCx, headCy)
                        ) : (
                            <>
                                {/* Left eye */}
                                <g>
                                    {/* White sclera */}
                                    <ellipse cx={headCx - 15} cy={headCy - 4} rx={11} ry={12} fill="white" />
                                    {/* Iris */}
                                    <circle cx={headCx - 15} cy={headCy - 2} r={7.5} fill={eyeColor} />
                                    {/* Pupil */}
                                    <circle cx={headCx - 15} cy={headCy - 1} r={4} fill="#111111" />
                                    {/* Shine - big */}
                                    <circle cx={headCx - 18} cy={headCy - 7} r={3} fill="white" opacity={0.9} />
                                    {/* Shine - small */}
                                    <circle cx={headCx - 12} cy={headCy - 3} r={1.5} fill="white" opacity={0.7} />
                                    {/* Top eyelid line */}
                                    <path
                                        d={`M ${headCx - 26} ${headCy - 8} Q ${headCx - 15} ${headCy - 18} ${headCx - 4} ${headCy - 8}`}
                                        fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round"
                                    />
                                    {/* Female eyelashes */}
                                    {isFemale && (
                                        <>
                                            <line x1={headCx - 25} y1={headCy - 9} x2={headCx - 28} y2={headCy - 14} stroke="#333" strokeWidth={1.5} strokeLinecap="round" />
                                            <line x1={headCx - 5} y1={headCy - 9} x2={headCx - 2} y2={headCy - 14} stroke="#333" strokeWidth={1.5} strokeLinecap="round" />
                                        </>
                                    )}
                                </g>
                                {/* Right eye */}
                                <g>
                                    <ellipse cx={headCx + 15} cy={headCy - 4} rx={11} ry={12} fill="white" />
                                    <circle cx={headCx + 15} cy={headCy - 2} r={7.5} fill={eyeColor} />
                                    <circle cx={headCx + 15} cy={headCy - 1} r={4} fill="#111111" />
                                    <circle cx={headCx + 12} cy={headCy - 7} r={3} fill="white" opacity={0.9} />
                                    <circle cx={headCx + 18} cy={headCy - 3} r={1.5} fill="white" opacity={0.7} />
                                    <path
                                        d={`M ${headCx + 4} ${headCy - 8} Q ${headCx + 15} ${headCy - 18} ${headCx + 26} ${headCy - 8}`}
                                        fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round"
                                    />
                                    {isFemale && (
                                        <>
                                            <line x1={headCx + 5} y1={headCy - 9} x2={headCx + 2} y2={headCy - 14} stroke="#333" strokeWidth={1.5} strokeLinecap="round" />
                                            <line x1={headCx + 25} y1={headCy - 9} x2={headCx + 28} y2={headCy - 14} stroke="#333" strokeWidth={1.5} strokeLinecap="round" />
                                        </>
                                    )}
                                </g>
                            </>
                        )}
                    </g>

                    {/* === CHEEK BLUSH === */}
                    {(expression === 'happy' || expression === 'surprised') && (
                        <g opacity={0.6}>
                            <ellipse cx={headCx - 28} cy={headCy + 12} rx={9} ry={6} fill="url(#blush-l)" />
                            <ellipse cx={headCx + 28} cy={headCy + 12} rx={9} ry={6} fill="url(#blush-r)" />
                        </g>
                    )}

                    {/* === NOSE === */}
                    <ellipse cx={headCx} cy={headCy + 10} rx={3} ry={2.5} fill={darken(skinColor, 0.1)} />

                    {/* === MOUTH === */}
                    {renderMouth(expression, headCx, headCy)}

                    {/* === EYEBROWS === */}
                    {expression !== 'cool' && renderEyebrows(expression, headCx, headCy, hairColor)}

                    {/* === HAIR FRONT === */}
                    <g onClick={() => click('hair')} style={{ cursor }}>
                        {renderHairFront(config.hairStyle, hairColor, headCx, headCy, headRx, headRy, isFemale)}
                    </g>

                    {/* === ACCESSORY === */}
                    {config.accessory && config.accessory !== 'none' && (
                        renderAccessory(config.accessory, headCx, headCy, headRx, headRy, config.accessoryColor || shirtColor)
                    )}
                </g>
            </svg>
        </div>
    );
};

// === MOUTH EXPRESSIONS ===

function renderMouth(expression: string, cx: number, cy: number): React.ReactNode {
    const my = cy + 20;
    switch (expression) {
        case 'happy':
            return (
                <g>
                    <path
                        d={`M ${cx - 10} ${my} Q ${cx} ${my + 10} ${cx + 10} ${my}`}
                        fill="none" stroke="#6b3a2a" strokeWidth={2.2} strokeLinecap="round"
                    />
                </g>
            );
        case 'surprised':
            return (
                <ellipse cx={cx} cy={my + 3} rx={6} ry={8} fill="#6b3a2a" />
            );
        case 'neutral':
            return (
                <line x1={cx - 8} y1={my + 2} x2={cx + 8} y2={my + 2}
                    stroke="#6b3a2a" strokeWidth={2} strokeLinecap="round" />
            );
        case 'cool':
            return (
                <path
                    d={`M ${cx - 8} ${my} Q ${cx} ${my + 6} ${cx + 8} ${my}`}
                    fill="none" stroke="#6b3a2a" strokeWidth={2} strokeLinecap="round"
                />
            );
        default:
            return (
                <path
                    d={`M ${cx - 10} ${my} Q ${cx} ${my + 10} ${cx + 10} ${my}`}
                    fill="none" stroke="#6b3a2a" strokeWidth={2.2} strokeLinecap="round"
                />
            );
    }
}

// === EYEBROWS ===

function renderEyebrows(expression: string, cx: number, cy: number, hairColor: string): React.ReactNode {
    const browColor = darken(hairColor, 0.1);
    const browY = cy - 20;
    const raised = expression === 'surprised' ? -4 : 0;

    return (
        <g>
            <path
                d={`M ${cx - 24} ${browY + raised + 1} Q ${cx - 15} ${browY + raised - 3} ${cx - 6} ${browY + raised + 1}`}
                fill="none" stroke={browColor} strokeWidth={2.5} strokeLinecap="round"
            />
            <path
                d={`M ${cx + 6} ${browY + raised + 1} Q ${cx + 15} ${browY + raised - 3} ${cx + 24} ${browY + raised + 1}`}
                fill="none" stroke={browColor} strokeWidth={2.5} strokeLinecap="round"
            />
        </g>
    );
}

// === SUNGLASSES ===

function renderSunglasses(cx: number, cy: number): React.ReactNode {
    const glassY = cy - 4;
    return (
        <g>
            {/* Bridge */}
            <path d={`M ${cx - 6} ${glassY} Q ${cx} ${glassY - 3} ${cx + 6} ${glassY}`}
                fill="none" stroke="#222" strokeWidth={2.5} strokeLinecap="round" />
            {/* Left lens */}
            <rect x={cx - 28} y={glassY - 10} width={22} height={16} rx={5} fill="#1a1a1a" />
            <rect x={cx - 27} y={glassY - 9} width={12} height={6} rx={2} fill="#333" opacity={0.4} />
            {/* Right lens */}
            <rect x={cx + 6} y={glassY - 10} width={22} height={16} rx={5} fill="#1a1a1a" />
            <rect x={cx + 7} y={glassY - 9} width={12} height={6} rx={2} fill="#333" opacity={0.4} />
            {/* Temple arms */}
            <line x1={cx - 28} y1={glassY - 3} x2={cx - 40} y2={glassY} stroke="#222" strokeWidth={2} />
            <line x1={cx + 28} y1={glassY - 3} x2={cx + 40} y2={glassY} stroke="#222" strokeWidth={2} />
        </g>
    );
}

// === HAIR BACK (behind head) ===

function renderHairBack(
    style: string, color: string, cx: number, cy: number,
    rx: number, ry: number, isFemale: boolean
): React.ReactNode {
    const dark = darken(color, 0.1);

    switch (style) {
        case 'long':
            return (
                <g>
                    <path d={`M ${cx - rx - 4} ${cy - 10} Q ${cx - rx - 8} ${cy + 50} ${cx - rx + 5} ${cy + 70}
                        Q ${cx - rx + 10} ${cy + 80} ${cx - rx + 2} ${cy + 85}`}
                        fill={dark} stroke="none" />
                    <path d={`M ${cx + rx + 4} ${cy - 10} Q ${cx + rx + 8} ${cy + 50} ${cx + rx - 5} ${cy + 70}
                        Q ${cx + rx - 10} ${cy + 80} ${cx + rx - 2} ${cy + 85}`}
                        fill={dark} stroke="none" />
                    <ellipse cx={cx} cy={cy - ry + 2} rx={rx + 6} ry={18} fill={dark} />
                </g>
            );
        case 'ponytail':
            return (
                <g>
                    <ellipse cx={cx} cy={cy - ry + 2} rx={rx + 4} ry={16} fill={dark} />
                    {/* Ponytail behind */}
                    <path d={`M ${cx + 5} ${cy - ry + 10} Q ${cx + 25} ${cy - ry - 10} ${cx + 15} ${cy + 30}
                        Q ${cx + 10} ${cy + 50} ${cx + 18} ${cy + 60}`}
                        fill={dark} stroke="none" />
                </g>
            );
        case 'pigtails':
            return (
                <g>
                    <ellipse cx={cx} cy={cy - ry + 2} rx={rx + 4} ry={16} fill={dark} />
                    {/* Left pigtail */}
                    <path d={`M ${cx - rx + 2} ${cy - 10} Q ${cx - rx - 15} ${cy + 10} ${cx - rx - 5} ${cy + 45}
                        Q ${cx - rx - 2} ${cy + 55} ${cx - rx - 8} ${cy + 55}`}
                        fill={dark} stroke="none" />
                    <circle cx={cx - rx - 6} cy={cy + 55} r={8} fill={color} />
                    {/* Right pigtail */}
                    <path d={`M ${cx + rx - 2} ${cy - 10} Q ${cx + rx + 15} ${cy + 10} ${cx + rx + 5} ${cy + 45}
                        Q ${cx + rx + 2} ${cy + 55} ${cx + rx + 8} ${cy + 55}`}
                        fill={dark} stroke="none" />
                    <circle cx={cx + rx + 6} cy={cy + 55} r={8} fill={color} />
                </g>
            );
        case 'braids':
            return (
                <g>
                    <ellipse cx={cx} cy={cy - ry + 2} rx={rx + 4} ry={16} fill={dark} />
                    {/* Left braid */}
                    <path d={`M ${cx - rx + 4} ${cy} C ${cx - rx - 8} ${cy + 20}, ${cx - rx + 4} ${cy + 40}, ${cx - rx - 4} ${cy + 60}`}
                        fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
                    {/* Right braid */}
                    <path d={`M ${cx + rx - 4} ${cy} C ${cx + rx + 8} ${cy + 20}, ${cx + rx - 4} ${cy + 40}, ${cx + rx + 4} ${cy + 60}`}
                        fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
                </g>
            );
        case 'bun':
            return (
                <g>
                    <ellipse cx={cx} cy={cy - ry + 2} rx={rx + 4} ry={16} fill={dark} />
                    <circle cx={cx} cy={cy - ry - 12} r={16} fill={color} />
                    <circle cx={cx - 3} cy={cy - ry - 16} r={6} fill={lighten(color, 0.08)} opacity={0.5} />
                </g>
            );
        case 'afro':
            return (
                <ellipse cx={cx} cy={cy - 8} rx={rx + 20} ry={ry + 12} fill={dark} />
            );
        default:
            return null;
    }
}

// === HAIR FRONT (on top of head) ===

function renderHairFront(
    style: string, color: string, cx: number, cy: number,
    rx: number, ry: number, isFemale: boolean
): React.ReactNode {
    const light = lighten(color, 0.08);
    const top = cy - ry;

    switch (style) {
        case 'short':
            return (
                <g>
                    {/* Voller kort haar — bedekt hele bovenkant hoofd */}
                    <path d={`M ${cx - rx - 4} ${cy - 6}
                        Q ${cx - rx - 4} ${top - 14} ${cx} ${top - 10}
                        Q ${cx + rx + 4} ${top - 14} ${cx + rx + 4} ${cy - 6}
                        L ${cx + rx + 2} ${cy - 2}
                        Q ${cx} ${cy - 8} ${cx - rx - 2} ${cy - 2} Z`}
                        fill={color} />
                    {/* Highlight */}
                    <path d={`M ${cx - 18} ${top - 2} Q ${cx - 5} ${top - 10} ${cx + 10} ${top - 2}`}
                        fill={light} opacity={0.35} />
                </g>
            );
        case 'spiky':
            return (
                <g>
                    {/* Basis haarvorm */}
                    <path d={`M ${cx - rx - 4} ${cy - 4}
                        Q ${cx - rx - 2} ${top - 6} ${cx - 24} ${top - 2}
                        L ${cx - 18} ${top - 28}
                        L ${cx - 8} ${top - 6}
                        L ${cx} ${top - 32}
                        L ${cx + 8} ${top - 6}
                        L ${cx + 18} ${top - 28}
                        L ${cx + 24} ${top - 2}
                        Q ${cx + rx + 2} ${top - 6} ${cx + rx + 4} ${cy - 4}
                        Q ${cx + rx + 2} ${cy - 14} ${cx} ${top - 8}
                        Q ${cx - rx - 2} ${cy - 14} ${cx - rx - 4} ${cy - 4}`}
                        fill={color} />
                    {/* Spike highlights */}
                    <path d={`M ${cx - 6} ${top - 4} L ${cx} ${top - 26} L ${cx + 6} ${top - 4}`}
                        fill={light} opacity={0.3} />
                </g>
            );
        case 'messy':
            return (
                <g>
                    <path d={`M ${cx - rx - 4} ${cy - 6}
                        Q ${cx - rx - 6} ${top - 12} ${cx - 15} ${top - 8}
                        Q ${cx - 8} ${top - 16} ${cx + 5} ${top - 6}
                        Q ${cx + 15} ${top - 14} ${cx + rx + 4} ${cy - 6}
                        Q ${cx + rx + 2} ${cy - 22} ${cx} ${top - 16}
                        Q ${cx - rx - 4} ${cy - 22} ${cx - rx - 4} ${cy - 6}`}
                        fill={color} />
                    {/* Messy strands */}
                    <path d={`M ${cx - rx} ${cy - 12} Q ${cx - rx - 6} ${cy - 4} ${cx - rx + 2} ${cy + 2}`}
                        fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
                    <path d={`M ${cx + rx} ${cy - 12} Q ${cx + rx + 6} ${cy - 4} ${cx + rx - 2} ${cy + 2}`}
                        fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
                </g>
            );
        case 'fade':
            return (
                <g>
                    <path d={`M ${cx - rx - 1} ${cy + 4}
                        Q ${cx - rx} ${cy - 8} ${cx - rx + 5} ${top + 2}
                        Q ${cx} ${top - 10} ${cx + rx - 5} ${top + 2}
                        Q ${cx + rx} ${cy - 8} ${cx + rx + 1} ${cy + 4}`}
                        fill={color} />
                    {/* Fade gradient effect at sides */}
                    <rect x={cx - rx - 1} y={cy - 2} width={10} height={14} rx={4} fill={color} opacity={0.4} />
                    <rect x={cx + rx - 9} y={cy - 2} width={10} height={14} rx={4} fill={color} opacity={0.4} />
                </g>
            );
        case 'curls':
            return (
                <g>
                    <path d={`M ${cx - rx - 4} ${cy - 4}
                        Q ${cx - rx - 2} ${top - 10} ${cx} ${top - 6}
                        Q ${cx + rx + 2} ${top - 10} ${cx + rx + 4} ${cy - 4}`}
                        fill={color} />
                    {/* Curl bumps */}
                    {[-20, -8, 4, 16].map((offset, i) => (
                        <circle key={i} cx={cx + offset} cy={top - 2 + (i % 2) * 3} r={8} fill={i % 2 === 0 ? color : light} />
                    ))}
                    <circle cx={cx - rx - 2} cy={cy} r={7} fill={color} />
                    <circle cx={cx + rx + 2} cy={cy} r={7} fill={color} />
                </g>
            );
        case 'buzzcut':
            return (
                <path d={`M ${cx - rx} ${cy - 4}
                    Q ${cx - rx + 2} ${top + 4} ${cx} ${top + 2}
                    Q ${cx + rx - 2} ${top + 4} ${cx + rx} ${cy - 4}`}
                    fill={color} opacity={0.7} />
            );
        case 'mohawk':
            return (
                <g>
                    {/* Side shaved */}
                    <path d={`M ${cx - rx} ${cy - 4} Q ${cx - rx + 2} ${top + 4} ${cx - 8} ${top + 4}`}
                        fill={color} opacity={0.3} />
                    <path d={`M ${cx + rx} ${cy - 4} Q ${cx + rx - 2} ${top + 4} ${cx + 8} ${top + 4}`}
                        fill={color} opacity={0.3} />
                    {/* Mohawk strip */}
                    <path d={`M ${cx - 10} ${top + 4} Q ${cx - 6} ${top - 26} ${cx} ${top - 28}
                        Q ${cx + 6} ${top - 26} ${cx + 10} ${top + 4}`}
                        fill={color} />
                </g>
            );
        case 'pigtails':
        case 'long':
        case 'bob':
            return (
                <g>
                    <path d={`M ${cx - rx - 3} ${cy - 6}
                        Q ${cx - rx} ${top - 10} ${cx} ${top - 6}
                        Q ${cx + rx} ${top - 10} ${cx + rx + 3} ${cy - 6}`}
                        fill={color} />
                    {/* Bangs */}
                    <path d={`M ${cx - 20} ${top + 10} Q ${cx - 10} ${top + 2} ${cx} ${top + 10}
                        Q ${cx + 10} ${top + 2} ${cx + 20} ${top + 10}`}
                        fill={light} opacity={0.3} />
                    {style === 'bob' && (
                        <g>
                            <path d={`M ${cx - rx - 3} ${cy - 6} Q ${cx - rx - 6} ${cy + 15} ${cx - rx + 8} ${cy + 22}`}
                                fill={color} stroke="none" />
                            <path d={`M ${cx + rx + 3} ${cy - 6} Q ${cx + rx + 6} ${cy + 15} ${cx + rx - 8} ${cy + 22}`}
                                fill={color} stroke="none" />
                        </g>
                    )}
                </g>
            );
        case 'ponytail':
        case 'braids':
        case 'bun':
            return (
                <g>
                    <path d={`M ${cx - rx - 3} ${cy - 6}
                        Q ${cx - rx} ${top - 10} ${cx} ${top - 6}
                        Q ${cx + rx} ${top - 10} ${cx + rx + 3} ${cy - 6}`}
                        fill={color} />
                    <path d={`M ${cx - 18} ${top + 10} Q ${cx - 8} ${top + 2} ${cx + 2} ${top + 10}`}
                        fill={light} opacity={0.3} />
                </g>
            );
        case 'afro': {
            const aId = `afro-clip-${cx}-${cy}`;
            return (
                <g>
                    <defs>
                        <clipPath id={aId}>
                            <path
                                d={`M${cx - rx - 25},${cy - ry - 18} h${(rx + 25) * 2} v${(ry + 18) * 2} h-${(rx + 25) * 2}Z M${cx},${cy - ry} a${rx},${ry} 0 0,1 0,${ry * 2} a${rx},${ry} 0 0,1 0,-${ry * 2}Z`}
                                clipRule="evenodd"
                            />
                        </clipPath>
                    </defs>
                    <g clipPath={`url(#${aId})`}>
                        <ellipse cx={cx} cy={cy - 8} rx={rx + 20} ry={ry + 12} fill={color} />
                        {[[-18, -30], [0, -36], [18, -30], [-26, -14], [26, -14]].map(([ox, oy], i) => (
                            <circle key={i} cx={cx + ox} cy={cy + oy} r={6} fill={light} opacity={0.25} />
                        ))}
                    </g>
                </g>
            );
        }
        case 'sidepart':
            return (
                <g>
                    <path d={`M ${cx - rx - 2} ${cy - 6}
                        Q ${cx - rx} ${top - 8} ${cx - 15} ${top - 2}
                        Q ${cx - 5} ${top - 10} ${cx + 15} ${top - 2}
                        Q ${cx + rx} ${top - 8} ${cx + rx + 2} ${cy - 6}
                        Q ${cx + rx} ${cy - 18} ${cx} ${top - 10}
                        Q ${cx - rx} ${cy - 18} ${cx - rx - 2} ${cy - 6}`}
                        fill={color} />
                    {/* Side sweep */}
                    <path d={`M ${cx - rx} ${cy - 8} Q ${cx - rx - 8} ${cy - 2} ${cx - rx + 4} ${cy + 6}`}
                        fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
                </g>
            );
        default:
            return (
                <path d={`M ${cx - rx - 2} ${cy - 10}
                    Q ${cx - rx} ${top - 8} ${cx} ${top - 6}
                    Q ${cx + rx} ${top - 8} ${cx + rx + 2} ${cy - 10}`}
                    fill={color} />
            );
    }
}

// === ACCESSORIES ===

function renderAccessory(
    accessory: string, cx: number, cy: number, rx: number, ry: number, color: string
): React.ReactNode {
    const top = cy - ry;
    const colorDk = darken(color, 0.15);

    switch (accessory) {
        case 'cap':
            return (
                <g>
                    <ellipse cx={cx} cy={top + 6} rx={rx + 8} ry={14} fill={color} />
                    <rect x={cx - rx - 8} y={top + 2} width={rx * 2 + 16} height={12} rx={6} fill={color} />
                    {/* Brim */}
                    <ellipse cx={cx + 20} cy={top + 12} rx={22} ry={6} fill={colorDk} />
                </g>
            );
        case 'beanie':
            return (
                <g>
                    <path d={`M ${cx - rx - 2} ${cy - 14}
                        Q ${cx - rx} ${top - 14} ${cx} ${top - 18}
                        Q ${cx + rx} ${top - 14} ${cx + rx + 2} ${cy - 14}`}
                        fill={color} />
                    {/* Beanie fold */}
                    <rect x={cx - rx - 2} y={cy - 18} width={rx * 2 + 4} height={8} rx={4} fill={colorDk} />
                    {/* Pom pom */}
                    <circle cx={cx} cy={top - 18} r={8} fill={lighten(color, 0.25)} />
                </g>
            );
        case 'glasses':
            return (
                <g>
                    <circle cx={cx - 15} cy={cy - 4} r={14} fill="none" stroke={color} strokeWidth={2.5} />
                    <circle cx={cx + 15} cy={cy - 4} r={14} fill="none" stroke={color} strokeWidth={2.5} />
                    <line x1={cx - 1} y1={cy - 4} x2={cx + 1} y2={cy - 4} stroke={color} strokeWidth={2.5} />
                    <line x1={cx - 29} y1={cy - 6} x2={cx - 40} y2={cy - 2} stroke={color} strokeWidth={2} />
                    <line x1={cx + 29} y1={cy - 6} x2={cx + 40} y2={cy - 2} stroke={color} strokeWidth={2} />
                </g>
            );
        case 'headphones':
            return (
                <g>
                    <path d={`M ${cx - rx - 6} ${cy - 2} Q ${cx - rx - 8} ${top - 18} ${cx} ${top - 20}
                        Q ${cx + rx + 8} ${top - 18} ${cx + rx + 6} ${cy - 2}`}
                        fill="none" stroke="#374151" strokeWidth={5} strokeLinecap="round" />
                    {/* Ear cups */}
                    <rect x={cx - rx - 14} y={cy - 10} width={14} height={20} rx={5} fill={color} />
                    <rect x={cx - rx - 12} y={cy - 6} width={6} height={12} rx={3} fill={lighten(color, 0.15)} />
                    <rect x={cx + rx} y={cy - 10} width={14} height={20} rx={5} fill={color} />
                    <rect x={cx + rx + 6} y={cy - 6} width={6} height={12} rx={3} fill={lighten(color, 0.15)} />
                </g>
            );
        case 'backpack':
            return null; // Only visible from behind
        case 'sunglasses':
            return renderSunglasses(cx, cy);
        default:
            return null;
    }
}

export default AvatarViewer2D;
