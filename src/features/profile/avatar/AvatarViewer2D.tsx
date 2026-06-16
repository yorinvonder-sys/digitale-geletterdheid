import React from 'react';
import { AvatarConfig } from '@/types';

interface AvatarViewer2DProps {
    config: AvatarConfig;
    interactive?: boolean;
    onPartClick?: (part: string) => void;
    variant?: 'full' | 'head';
}

const INK = '#202023';
const ACID = '#e1ff01';
const WHITE = '#ffffff';

// Scale from DuckMark viewBox 0 0 64 64 by ~2.745, circle centered at (100, 93)
// DuckMark: circle cx=32 cy=34 r=25.5  →  cx=100 cy=93 r=70
const CX = 100;
const CY = 93;
const R = 70;
const STROKE = 12; // 4.5 * 2.745

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
    variant = 'full',
}) => {
    const bodyColor = config.baseModel === 'robot' ? '#C0C0C0' : (config.skinColor || ACID);
    const hairColor = config.hairColor || INK;
    const shirtColor = config.shirtColor || '#D97848';
    const footColor = config.shoeColor || '#F2A23C';
    const expression = config.expression || 'happy';
    const accessory = config.accessory && config.accessory !== 'none' ? config.accessory : null;
    const accessoryColor = config.accessoryColor || shirtColor;
    const hairStyle = config.hairStyle || 'short';

    const click = (part: string) => {
        if (interactive && onPartClick) onPartClick(part);
    };
    const cursor = interactive && onPartClick ? 'pointer' : 'default';

    // Show crest when not hidden under cap/beanie
    const hideHair = accessory === 'cap' || accessory === 'beanie';

    const viewBox = variant === 'head' ? '15 5 170 178' : '10 5 180 210';

    return (
        <div className="w-full h-full flex items-center justify-center bg-[#f2f1ec] rounded-2xl overflow-hidden">
            <svg
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
                style={{ maxHeight: '100%' }}
            >
                {/* Webbed feet — behind circle, only in full variant */}
                {variant === 'full' && (
                    <g onClick={() => click('shoes')} style={{ cursor }}>
                        {renderFeet(footColor)}
                    </g>
                )}

                {/* Duck body — the circle IS the entire duck */}
                <g onClick={() => click('skin')} style={{ cursor }}>
                    <circle cx={CX} cy={CY} r={R} fill={bodyColor} stroke={INK} strokeWidth={STROKE} />
                    {config.baseModel === 'robot' && (
                        <circle cx={CX - 22} cy={CY - 22} r={28} fill={WHITE} fillOpacity={0.1} />
                    )}
                </g>

                {/* Crest (hair) — on top of circle, below accessories */}
                {!hideHair && (
                    <g onClick={() => click('hair')} style={{ cursor }}>
                        {renderCrest(hairStyle, hairColor)}
                    </g>
                )}

                {/* Signature DuckMark cowlick curl — always present, hidden under cap/beanie */}
                {!hideHair && (
                    <path
                        d="M100 12 c-8 -4 -18 1 -21 9"
                        fill="none"
                        stroke={hairColor}
                        strokeWidth={10}
                        strokeLinecap="round"
                        onClick={() => click('hair')}
                        style={{ cursor }}
                    />
                )}

                {/* Eyes — scaled from DuckMark (24,31)→(78,85) (40,31)→(122,85) */}
                <g onClick={() => click('eyes')} style={{ cursor }}>
                    {renderEyes(expression)}
                </g>

                {/* Beak — scaled from DuckMark rect x23 y44 w18 h9 rx4.5 */}
                <g onClick={() => click('mouth')} style={{ cursor }}>
                    {renderBeak(expression)}
                </g>

                {/* Outfit band — collar/sweater arc at lower circle */}
                {config.shirtStyle && (
                    <g onClick={() => click('shirt')} style={{ cursor }}>
                        {renderOutfit(shirtColor)}
                    </g>
                )}

                {/* Accessory */}
                {accessory && (
                    <g onClick={() => click('accessory')} style={{ cursor }}>
                        {renderAccessory(accessory, accessoryColor, hairColor)}
                    </g>
                )}
            </svg>
        </div>
    );
};

// === WEBBED FEET ===
function renderFeet(color: string): React.ReactNode {
    const bottomY = CY + R;
    const footDark = darken(color, 0.18);
    return (
        <g>
            {/* Left foot */}
            <ellipse cx={CX - 24} cy={bottomY + 16} rx={24} ry={11} fill={color} stroke={INK} strokeWidth={5} />
            <line x1={CX - 38} y1={bottomY + 9} x2={CX - 32} y2={bottomY + 24} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={CX - 24} y1={bottomY + 7} x2={CX - 24} y2={bottomY + 26} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={CX - 10} y1={bottomY + 9} x2={CX - 16} y2={bottomY + 24} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            {/* Right foot */}
            <ellipse cx={CX + 24} cy={bottomY + 16} rx={24} ry={11} fill={color} stroke={INK} strokeWidth={5} />
            <line x1={CX + 10} y1={bottomY + 9} x2={CX + 16} y2={bottomY + 24} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={CX + 24} y1={bottomY + 7} x2={CX + 24} y2={bottomY + 26} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={CX + 38} y1={bottomY + 9} x2={CX + 32} y2={bottomY + 24} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
        </g>
    );
}

// === EYES ===
// DuckMark eyes: ellipses rx5.4 ry9 at (24,31) and (40,31), scaled → (78,85) (122,85), rx=15 ry=25
function renderEyes(expression: string): React.ReactNode {
    const lx = 78, ex = 122, ey = 85;

    if (expression === 'cool') {
        return (
            <g>
                <line x1={lx + 16} y1={ey} x2={ex - 16} y2={ey} stroke={INK} strokeWidth={6} />
                <rect x={lx - 24} y={ey - 20} width={42} height={34} rx={9} fill={INK} fillOpacity={0.88} stroke={INK} strokeWidth={5} />
                <rect x={ex - 18} y={ey - 20} width={42} height={34} rx={9} fill={INK} fillOpacity={0.88} stroke={INK} strokeWidth={5} />
                <rect x={lx - 20} y={ey - 16} width={14} height={9} rx={3} fill={WHITE} fillOpacity={0.3} />
                <rect x={ex - 14} y={ey - 16} width={14} height={9} rx={3} fill={WHITE} fillOpacity={0.3} />
            </g>
        );
    }

    const eyeRy = expression === 'surprised' ? 30 : expression === 'neutral' ? 18 : 25;
    const eyeRx = 15;
    const shineRy = expression === 'surprised' ? 11 : 9;

    return (
        <g>
            <ellipse cx={lx} cy={ey} rx={eyeRx} ry={eyeRy} fill={INK} />
            <ellipse cx={ex} cy={ey} rx={eyeRx} ry={eyeRy} fill={INK} />
            <ellipse cx={lx - 5} cy={ey - shineRy} rx={5} ry={shineRy * 0.38} fill={WHITE} fillOpacity={0.35} />
            <ellipse cx={ex - 5} cy={ey - shineRy} rx={5} ry={shineRy * 0.38} fill={WHITE} fillOpacity={0.35} />
        </g>
    );
}

// === BEAK ===
// DuckMark: rect x23 y44 w18 h9 rx4.5 scaled → x=75 y=121 w=49 h=25 rx=12
function renderBeak(expression: string): React.ReactNode {
    const bx = 75, by = 121, bw = 49, bh = 25, brx = 12;

    switch (expression) {
        case 'surprised':
            return (
                <g>
                    <rect x={bx} y={by} width={bw} height={bh + 10} rx={brx} fill={WHITE} stroke={INK} strokeWidth={10} />
                    <ellipse cx={CX} cy={by + bh + 4} rx={13} ry={9} fill="#e87070" />
                </g>
            );
        case 'neutral':
            return (
                <rect x={bx} y={by + 5} width={bw} height={bh - 5} rx={brx} fill={WHITE} stroke={INK} strokeWidth={10} />
            );
        default: // happy / cool
            return (
                <rect x={bx} y={by} width={bw} height={bh} rx={brx} fill={WHITE} stroke={INK} strokeWidth={10} />
            );
    }
}

// === CREST (hair variants) ===
function renderCrest(style: string, color: string): React.ReactNode {
    const topY = CY - R; // y=23 — top of circle
    const dark = darken(color, 0.12);
    const sw = 5; // stroke-width for crest outlines

    switch (style) {
        case 'spiky':
        case 'mohawk':
            return (
                <g>
                    <path
                        d={`M${CX - 18} ${topY + 7} L${CX - 10} ${topY - 32} L${CX - 2} ${topY + 6}
                            L${CX + 6} ${topY - 42} L${CX + 14} ${topY + 6}
                            L${CX + 20} ${topY - 26} L${CX + 26} ${topY + 6}`}
                        fill={color} stroke={INK} strokeWidth={sw} strokeLinejoin="round"
                    />
                </g>
            );
        case 'messy':
            return (
                <g>
                    <circle cx={CX - 22} cy={topY - 6} r={16} fill={dark} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX} cy={topY - 16} r={14} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX + 22} cy={topY - 6} r={16} fill={dark} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX - 10} cy={topY - 26} r={10} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX + 10} cy={topY - 22} r={10} fill={dark} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'afro':
        case 'curls':
            return (
                <g>
                    <circle cx={CX} cy={topY - 16} r={34} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX - 24} cy={topY - 2} r={20} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={CX + 24} cy={topY - 2} r={20} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'long':
        case 'bob':
            return (
                <g>
                    <path
                        d={`M${CX - 44} ${CY - 18} Q${CX - 54} ${topY - 12} ${CX} ${topY - 18}
                            Q${CX + 54} ${topY - 12} ${CX + 44} ${CY - 18}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <path
                        d={`M${CX - 62} ${CY + 22} Q${CX - 68} ${CY - 10} ${CX - 44} ${CY - 18}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <path
                        d={`M${CX + 62} ${CY + 22} Q${CX + 68} ${CY - 10} ${CX + 44} ${CY - 18}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                </g>
            );
        case 'ponytail':
        case 'bun':
            return (
                <g>
                    <path
                        d={`M${CX - 14} ${topY + 5} Q${CX} ${topY - 14} ${CX + 14} ${topY + 5}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    {/* Rear tuft visible on the side */}
                    <ellipse cx={CX + R - 8} cy={CY - R + 24} rx={18} ry={22} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'pigtails':
        case 'braids':
        case 'sidepart':
            return (
                <g>
                    <path
                        d={`M${CX - 14} ${topY + 5} Q${CX} ${topY - 12} ${CX + 14} ${topY + 5}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <ellipse cx={CX - R + 4} cy={CY - R + 24} rx={17} ry={21} fill={color} stroke={INK} strokeWidth={sw} />
                    <ellipse cx={CX + R - 4} cy={CY - R + 24} rx={17} ry={21} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        default: // short, fade, buzzcut — minimal stub
            return (
                <path
                    d={`M${CX - 12} ${topY + 5} Q${CX} ${topY - 8} ${CX + 12} ${topY + 5}`}
                    fill={color} stroke={INK} strokeWidth={sw} strokeLinecap="round"
                />
            );
    }
}

// === OUTFIT BAND ===
function renderOutfit(color: string): React.ReactNode {
    const bandY = CY + R * 0.52;
    const dark = darken(color, 0.12);
    return (
        <g>
            <path
                d={`M${CX - 44} ${bandY} Q${CX - 22} ${bandY + 18} ${CX} ${bandY + 20}
                    Q${CX + 22} ${bandY + 18} ${CX + 44} ${bandY}`}
                fill={color}
                fillOpacity={0.8}
                stroke={INK}
                strokeWidth={6}
                strokeLinecap="round"
            />
            {/* V-neck line */}
            <path
                d={`M${CX - 8} ${bandY + 5} L${CX} ${bandY + 14} L${CX + 8} ${bandY + 5}`}
                fill="none"
                stroke={dark}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    );
}

// === ACCESSORIES ===
function renderAccessory(accessory: string, color: string, hairColor: string): React.ReactNode {
    const topY = CY - R;
    const dark = darken(color, 0.15);

    switch (accessory) {
        case 'cap':
            return (
                <g>
                    <path
                        d={`M${CX - R + 6} ${CY - R * 0.62}
                            Q${CX - R + 4} ${topY - 14} ${CX} ${topY - 20}
                            Q${CX + R - 4} ${topY - 14} ${CX + R - 6} ${CY - R * 0.62}`}
                        fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round"
                    />
                    <path
                        d={`M${CX - R + 6} ${CY - R * 0.62 + 5}
                            Q${CX} ${CY - R * 0.62 + 14} ${CX + R - 6} ${CY - R * 0.62 + 5}`}
                        fill={dark} fillOpacity={0.55} stroke={INK} strokeWidth={5}
                    />
                    <ellipse cx={CX + 22} cy={CY - R * 0.62 + 8} rx={26} ry={8} fill={dark} stroke={INK} strokeWidth={5} />
                </g>
            );
        case 'beanie':
            return (
                <g>
                    <path
                        d={`M${CX - R + 4} ${CY - R * 0.58}
                            Q${CX - R + 2} ${topY - 20} ${CX} ${topY - 26}
                            Q${CX + R - 2} ${topY - 20} ${CX + R - 4} ${CY - R * 0.58}`}
                        fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round"
                    />
                    <path
                        d={`M${CX - R + 4} ${CY - R * 0.58 + 4}
                            Q${CX} ${CY - R * 0.58 + 14} ${CX + R - 4} ${CY - R * 0.58 + 4}`}
                        fill={dark} fillOpacity={0.6} stroke={INK} strokeWidth={5}
                    />
                    <circle cx={CX} cy={topY - 26} r={13} fill={lighten(color, 0.28)} stroke={INK} strokeWidth={5} />
                </g>
            );
        case 'glasses':
            return (
                <g>
                    <circle cx={78} cy={85} r={24} fill="none" stroke={color} strokeWidth={6} />
                    <circle cx={122} cy={85} r={24} fill="none" stroke={color} strokeWidth={6} />
                    <line x1={102} y1={85} x2={98} y2={85} stroke={color} strokeWidth={6} />
                    <line x1={54} y1={81} x2={38} y2={76} stroke={color} strokeWidth={5} strokeLinecap="round" />
                    <line x1={146} y1={81} x2={162} y2={76} stroke={color} strokeWidth={5} strokeLinecap="round" />
                </g>
            );
        case 'sunglasses':
            return (
                <g>
                    <line x1={96} y1={85} x2={104} y2={85} stroke={INK} strokeWidth={6} />
                    <rect x={42} y={67} width={48} height={34} rx={10} fill={INK} fillOpacity={0.87} stroke={INK} strokeWidth={5} />
                    <rect x={96} y={67} width={48} height={34} rx={10} fill={INK} fillOpacity={0.87} stroke={INK} strokeWidth={5} />
                    <rect x={46} y={71} width={16} height={9} rx={3} fill={WHITE} fillOpacity={0.28} />
                    <rect x={100} y={71} width={16} height={9} rx={3} fill={WHITE} fillOpacity={0.28} />
                    <line x1={42} y1={82} x2={28} y2={77} stroke={INK} strokeWidth={5} strokeLinecap="round" />
                    <line x1={144} y1={82} x2={158} y2={77} stroke={INK} strokeWidth={5} strokeLinecap="round" />
                </g>
            );
        case 'headphones':
            return (
                <g>
                    <path
                        d={`M${CX - R - 8} ${CY - 14}
                            Q${CX - R - 12} ${topY - 24} ${CX} ${topY - 30}
                            Q${CX + R + 12} ${topY - 24} ${CX + R + 8} ${CY - 14}`}
                        fill="none" stroke="#374151" strokeWidth={8} strokeLinecap="round"
                    />
                    <rect x={CX - R - 20} y={CY - 20} width={18} height={28} rx={6} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={CX - R - 16} y={CY - 14} width={8} height={16} rx={3} fill={lighten(color, 0.22)} />
                    <rect x={CX + R + 2} y={CY - 20} width={18} height={28} rx={6} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={CX + R + 6} y={CY - 14} width={8} height={16} rx={3} fill={lighten(color, 0.22)} />
                </g>
            );
        case 'backpack':
            return (
                <g>
                    <rect x={CX + R - 8} y={CY - 14} width={32} height={44} rx={9} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={CX + R - 4} y={CY - 8} width={16} height={22} rx={5} fill={lighten(color, 0.14)} />
                    <rect x={CX + R + 4} y={CY + 6} width={6} height={6} rx={2} fill={dark} />
                </g>
            );
        default:
            return null;
    }
}

export default AvatarViewer2D;
