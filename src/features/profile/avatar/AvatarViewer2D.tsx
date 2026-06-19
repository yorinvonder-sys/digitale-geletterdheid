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
const BILL_ORANGE = '#F2A23C';
const BILL_DARK = '#D4821A';

// === DUCK GEOMETRY ===
// Duck body: oval egg shape centered around (100, 130), width 110, height 130
// Duck head: circle at (108, 68), radius 44 — slightly forward (rightward) to suggest beak side
// Beak projects right from the head at y=72
const BODY_CX = 100;
const BODY_CY = 130;
const BODY_RX = 52;   // narrower width
const BODY_RY = 60;   // taller height — egg shape
const HEAD_CX = 105;
const HEAD_CY = 66;
const HEAD_R = 44;

// Crest sits on top of head
const CREST_TOP_X = HEAD_CX;
const CREST_TOP_Y = HEAD_CY - HEAD_R; // y = 22

// Stroke width
const STROKE = 9;

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

    // viewBox: head variant crops to head+bill area (must include bill tip at x≈182), full shows entire duck incl feet
    const viewBox = variant === 'head' ? '30 10 160 120' : '15 8 175 205';

    return (
        <div className="w-full h-full flex items-center justify-center bg-[#f2f1ec] rounded-2xl overflow-hidden">
            <svg
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
                style={{ maxHeight: '100%' }}
            >
                {/* Webbed feet — behind body, only in full variant */}
                {variant === 'full' && (
                    <g onClick={() => click('shoes')} style={{ cursor }}>
                        {renderFeet(footColor)}
                    </g>
                )}

                {/* Duck body — egg/oval */}
                <g onClick={() => click('skin')} style={{ cursor }}>
                    <ellipse
                        cx={BODY_CX}
                        cy={BODY_CY}
                        rx={BODY_RX}
                        ry={BODY_RY}
                        fill={bodyColor}
                        stroke={INK}
                        strokeWidth={STROKE}
                    />
                    {/* Robot shine */}
                    {config.baseModel === 'robot' && (
                        <ellipse cx={BODY_CX - 16} cy={BODY_CY - 20} rx={20} ry={26} fill={WHITE} fillOpacity={0.1} />
                    )}
                </g>

                {/* Wing — small ellipse on body side */}
                <g onClick={() => click('skin')} style={{ cursor }}>
                    <ellipse
                        cx={BODY_CX - 30}
                        cy={BODY_CY + 10}
                        rx={20}
                        ry={28}
                        fill={darken(bodyColor, 0.1)}
                        stroke={INK}
                        strokeWidth={6}
                        transform={`rotate(-15 ${BODY_CX - 30} ${BODY_CY + 10})`}
                    />
                </g>

                {/* Tail — upturned at back of body */}
                <path
                    d={`M${BODY_CX - BODY_RX + 6} ${BODY_CY + 10}
                        Q${BODY_CX - BODY_RX - 22} ${BODY_CY - 10}
                        ${BODY_CX - BODY_RX - 14} ${BODY_CY - 36}`}
                    fill={darken(bodyColor, 0.12)}
                    stroke={INK}
                    strokeWidth={7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Outfit collar band — at neck/lower body junction */}
                {config.shirtStyle && (
                    <g onClick={() => click('shirt')} style={{ cursor }}>
                        {renderOutfit(shirtColor)}
                    </g>
                )}

                {/* Duck head — separate circle, slightly forward */}
                <g onClick={() => click('skin')} style={{ cursor }}>
                    <circle
                        cx={HEAD_CX}
                        cy={HEAD_CY}
                        r={HEAD_R}
                        fill={bodyColor}
                        stroke={INK}
                        strokeWidth={STROKE}
                    />
                    {config.baseModel === 'robot' && (
                        <circle cx={HEAD_CX - 12} cy={HEAD_CY - 12} r={16} fill={WHITE} fillOpacity={0.1} />
                    )}
                </g>

                {/* Crest (hair) — on top of head */}
                {!hideHair && (
                    <g onClick={() => click('hair')} style={{ cursor }}>
                        {renderCrest(hairStyle, hairColor)}
                    </g>
                )}

                {/* Signature cowlick curl */}
                {!hideHair && (
                    <path
                        d={`M${HEAD_CX + 4} ${CREST_TOP_Y + 2} c-6 -5 -16 -1 -18 7`}
                        fill="none"
                        stroke={hairColor}
                        strokeWidth={7}
                        strokeLinecap="round"
                        onClick={() => click('hair')}
                        style={{ cursor }}
                    />
                )}

                {/* Eyes — on head, smaller, positioned away from bill side */}
                <g onClick={() => click('eyes')} style={{ cursor }}>
                    {renderEyes(expression)}
                </g>

                {/* Bill — prominent orange duck bill projecting right */}
                <g onClick={() => click('mouth')} style={{ cursor }}>
                    {renderBeak(expression)}
                </g>

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
    const bottomY = BODY_CY + BODY_RY; // bottom of egg body
    const footDark = darken(color, 0.18);
    const lx = BODY_CX - 18;
    const rx = BODY_CX + 18;
    return (
        <g>
            {/* Left foot */}
            <ellipse cx={lx} cy={bottomY + 14} rx={22} ry={9} fill={color} stroke={INK} strokeWidth={5} />
            <line x1={lx - 16} y1={bottomY + 7} x2={lx - 10} y2={bottomY + 20} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={lx} y1={bottomY + 5} x2={lx} y2={bottomY + 22} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={lx + 14} y1={bottomY + 7} x2={lx + 8} y2={bottomY + 20} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            {/* Right foot */}
            <ellipse cx={rx} cy={bottomY + 14} rx={22} ry={9} fill={color} stroke={INK} strokeWidth={5} />
            <line x1={rx - 14} y1={bottomY + 7} x2={rx - 8} y2={bottomY + 20} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={rx} y1={bottomY + 5} x2={rx} y2={bottomY + 22} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
            <line x1={rx + 16} y1={bottomY + 7} x2={rx + 10} y2={bottomY + 20} stroke={footDark} strokeWidth={3} strokeLinecap="round" />
        </g>
    );
}

// === EYES ===
// Eyes sit in upper-left portion of head, smaller and rounder — duck eye, not smiley
function renderEyes(expression: string): React.ReactNode {
    // Single eye visible from the front-facing 3/4 side — main left eye + partial right
    const eyeX = HEAD_CX - 12; // left eye, center of face
    const eyeY = HEAD_CY - 8;  // upper half of head
    const eyeX2 = HEAD_CX + 14; // right eye, partially visible

    if (expression === 'cool') {
        return (
            <g>
                <rect x={eyeX - 16} y={eyeY - 9} width={28} height={18} rx={6} fill={INK} fillOpacity={0.9} stroke={INK} strokeWidth={4} />
                <rect x={eyeX2 - 12} y={eyeY - 9} width={24} height={18} rx={6} fill={INK} fillOpacity={0.9} stroke={INK} strokeWidth={4} />
                <rect x={eyeX - 12} y={eyeY - 6} width={9} height={5} rx={2} fill={WHITE} fillOpacity={0.3} />
                <rect x={eyeX2 - 8} y={eyeY - 6} width={9} height={5} rx={2} fill={WHITE} fillOpacity={0.3} />
            </g>
        );
    }

    const eyeR = expression === 'surprised' ? 14 : expression === 'neutral' ? 9 : 11;
    const shineR = eyeR * 0.32;

    return (
        <g>
            <circle cx={eyeX} cy={eyeY} r={eyeR} fill={INK} />
            <circle cx={eyeX2} cy={eyeY} r={eyeR * 0.78} fill={INK} />
            <circle cx={eyeX - 3} cy={eyeY - eyeR * 0.4} r={shineR + 1} fill={WHITE} fillOpacity={0.45} />
            <circle cx={eyeX2 - 2} cy={eyeY - eyeR * 0.38} r={shineR} fill={WHITE} fillOpacity={0.4} />
        </g>
    );
}

// === BILL (duck bill, not smiley mouth) ===
// Prominent flat duck bill projecting to the RIGHT of the head.
// Single outlined wedge with a center divider — avoids the "chopstick" look
// that separate stroked paths produce.
function renderBeak(expression: string): React.ReactNode {
    // Bill base attaches at the right side of the head
    const bx = HEAD_CX + HEAD_R - 4; // x ≈ 145 — bill root
    const by = HEAD_CY + 6;          // y ≈ 72 — vertical center of bill

    // Closed bill: one trapezoidal wedge (upper=ORANGE, lower=DARK split by divider)
    //   top-back (bx, by-12), tip-top (bx+38, by-4)
    //   tip-bottom (bx+38, by+10), bottom-back (bx, by+14)
    const tipX = bx + 38;
    const topBack = `${bx},${by - 12}`;
    const tipTop  = `${tipX},${by - 4}`;
    const tipBot  = `${tipX},${by + 10}`;
    const botBack = `${bx},${by + 14}`;
    // divider midpoints
    const divBack = `${bx},${by + 1}`;
    const divTip  = `${tipX},${by + 3}`;

    if (expression === 'surprised') {
        // Open bill: gap of ~8px between upper and lower
        const gapY = 8;
        return (
            <g>
                {/* Upper mandible */}
                <path
                    d={`M${bx},${by - 12} L${tipX},${by - 4} L${tipX},${by} L${bx},${by - 2} Z`}
                    fill={BILL_ORANGE} stroke={INK} strokeWidth={6} strokeLinejoin="round"
                />
                {/* Mouth interior (tongue) */}
                <path
                    d={`M${bx + 2},${by} L${tipX - 4},${by + 2} L${tipX - 4},${by + gapY + 4} L${bx + 2},${by + gapY + 4} Z`}
                    fill="#e87070"
                />
                {/* Lower mandible */}
                <path
                    d={`M${bx},${by + gapY} L${tipX},${by + gapY + 2} L${tipX},${by + gapY + 12} L${bx},${by + gapY + 14} Z`}
                    fill={BILL_DARK} stroke={INK} strokeWidth={6} strokeLinejoin="round"
                />
            </g>
        );
    }

    // Closed bill (happy / neutral / cool)
    return (
        <g>
            {/* Full bill outline — single closed path */}
            <path
                d={`M${topBack} L${tipTop} L${tipBot} L${botBack} Z`}
                fill={BILL_ORANGE} stroke={INK} strokeWidth={6} strokeLinejoin="round"
            />
            {/* Lower-mandible shade: fills bottom half in darker orange */}
            <path
                d={`M${divBack} L${divTip} L${tipBot} L${botBack} Z`}
                fill={BILL_DARK} fillOpacity={0.85}
            />
            {/* Divider line — center crease */}
            <line
                x1={bx} y1={by + 1} x2={tipX} y2={by + 3}
                stroke={INK} strokeWidth={3} strokeLinecap="round"
            />
        </g>
    );
}

// === CREST (hair variants) ===
// All anchored to CREST_TOP_X, CREST_TOP_Y (top of head circle)
function renderCrest(style: string, color: string): React.ReactNode {
    const topY = CREST_TOP_Y;     // = HEAD_CY - HEAD_R = 22
    const tx = CREST_TOP_X;       // = 105
    const dark = darken(color, 0.12);
    const sw = 5;

    switch (style) {
        case 'spiky':
        case 'mohawk':
            return (
                <g>
                    <path
                        d={`M${tx - 16} ${topY + 6} L${tx - 9} ${topY - 28} L${tx - 1} ${topY + 5}
                            L${tx + 7} ${topY - 38} L${tx + 15} ${topY + 5}
                            L${tx + 20} ${topY - 22} L${tx + 25} ${topY + 5}`}
                        fill={color} stroke={INK} strokeWidth={sw} strokeLinejoin="round"
                    />
                </g>
            );
        case 'messy':
            return (
                <g>
                    <circle cx={tx - 20} cy={topY - 5} r={14} fill={dark} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx} cy={topY - 14} r={13} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx + 20} cy={topY - 5} r={14} fill={dark} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx - 9} cy={topY - 23} r={9} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx + 9} cy={topY - 20} r={9} fill={dark} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'afro':
        case 'curls':
            return (
                <g>
                    <circle cx={tx} cy={topY - 14} r={30} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx - 22} cy={topY - 1} r={18} fill={color} stroke={INK} strokeWidth={sw} />
                    <circle cx={tx + 22} cy={topY - 1} r={18} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'long':
        case 'bob':
            return (
                <g>
                    <path
                        d={`M${tx - 38} ${HEAD_CY - 12} Q${tx - 46} ${topY - 10} ${tx} ${topY - 16}
                            Q${tx + 46} ${topY - 10} ${tx + 38} ${HEAD_CY - 12}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <path
                        d={`M${tx - 54} ${HEAD_CY + 20} Q${tx - 60} ${HEAD_CY - 8} ${tx - 38} ${HEAD_CY - 12}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <path
                        d={`M${tx + 54} ${HEAD_CY + 20} Q${tx + 60} ${HEAD_CY - 8} ${tx + 38} ${HEAD_CY - 12}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                </g>
            );
        case 'ponytail':
        case 'bun':
            return (
                <g>
                    <path
                        d={`M${tx - 12} ${topY + 4} Q${tx} ${topY - 12} ${tx + 12} ${topY + 4}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    {/* Rear tuft */}
                    <ellipse cx={tx + HEAD_R - 6} cy={HEAD_CY - HEAD_R + 20} rx={16} ry={20} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        case 'pigtails':
        case 'braids':
        case 'sidepart':
            return (
                <g>
                    <path
                        d={`M${tx - 12} ${topY + 4} Q${tx} ${topY - 10} ${tx + 12} ${topY + 4}`}
                        fill={color} stroke={INK} strokeWidth={sw}
                    />
                    <ellipse cx={tx - HEAD_R + 2} cy={HEAD_CY - HEAD_R + 20} rx={15} ry={19} fill={color} stroke={INK} strokeWidth={sw} />
                    <ellipse cx={tx + HEAD_R - 2} cy={HEAD_CY - HEAD_R + 20} rx={15} ry={19} fill={color} stroke={INK} strokeWidth={sw} />
                </g>
            );
        default: // short, fade, buzzcut
            return (
                <path
                    d={`M${tx - 10} ${topY + 4} Q${tx} ${topY - 7} ${tx + 10} ${topY + 4}`}
                    fill={color} stroke={INK} strokeWidth={sw} strokeLinecap="round"
                />
            );
    }
}

// === OUTFIT BAND ===
// Collar at neck — junction between head and body
function renderOutfit(color: string): React.ReactNode {
    // Neck area: just below head, above body
    const neckY = HEAD_CY + HEAD_R - 4; // ≈ 106
    const dark = darken(color, 0.12);
    return (
        <g>
            <path
                d={`M${BODY_CX - 26} ${neckY + 4}
                    Q${BODY_CX - 10} ${neckY + 18} ${BODY_CX + 8} ${neckY + 20}
                    Q${BODY_CX + 26} ${neckY + 18} ${BODY_CX + 38} ${neckY + 4}`}
                fill={color}
                fillOpacity={0.85}
                stroke={INK}
                strokeWidth={6}
                strokeLinecap="round"
            />
            {/* V-neck */}
            <path
                d={`M${BODY_CX - 6} ${neckY + 6} L${BODY_CX + 2} ${neckY + 14} L${BODY_CX + 10} ${neckY + 6}`}
                fill="none"
                stroke={dark}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    );
}

// === ACCESSORIES ===
// All re-anchored to HEAD geometry
function renderAccessory(accessory: string, color: string, hairColor: string): React.ReactNode {
    const topY = CREST_TOP_Y;   // top of head = 22
    const hx = HEAD_CX;
    const hy = HEAD_CY;
    const hr = HEAD_R;
    const dark = darken(color, 0.15);

    switch (accessory) {
        case 'cap':
            return (
                <g>
                    <path
                        d={`M${hx - hr + 4} ${hy - hr * 0.54}
                            Q${hx - hr + 2} ${topY - 12} ${hx} ${topY - 18}
                            Q${hx + hr - 2} ${topY - 12} ${hx + hr - 4} ${hy - hr * 0.54}`}
                        fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round"
                    />
                    <path
                        d={`M${hx - hr + 4} ${hy - hr * 0.54 + 4}
                            Q${hx} ${hy - hr * 0.54 + 12} ${hx + hr - 4} ${hy - hr * 0.54 + 4}`}
                        fill={dark} fillOpacity={0.55} stroke={INK} strokeWidth={5}
                    />
                    {/* brim forward */}
                    <ellipse cx={hx + 18} cy={hy - hr * 0.54 + 7} rx={22} ry={7} fill={dark} stroke={INK} strokeWidth={5} />
                </g>
            );
        case 'beanie':
            return (
                <g>
                    <path
                        d={`M${hx - hr + 3} ${hy - hr * 0.52}
                            Q${hx - hr + 1} ${topY - 18} ${hx} ${topY - 24}
                            Q${hx + hr - 1} ${topY - 18} ${hx + hr - 3} ${hy - hr * 0.52}`}
                        fill={color} stroke={INK} strokeWidth={8} strokeLinejoin="round"
                    />
                    <path
                        d={`M${hx - hr + 3} ${hy - hr * 0.52 + 4}
                            Q${hx} ${hy - hr * 0.52 + 12} ${hx + hr - 3} ${hy - hr * 0.52 + 4}`}
                        fill={dark} fillOpacity={0.6} stroke={INK} strokeWidth={5}
                    />
                    <circle cx={hx} cy={topY - 24} r={12} fill={lighten(color, 0.28)} stroke={INK} strokeWidth={5} />
                </g>
            );
        case 'glasses':
            return (
                <g>
                    {/* Glasses centered on eyes — eyeX = HEAD_CX-12, eyeX2 = HEAD_CX+14 */}
                    <circle cx={hx - 12} cy={hy - 8} r={18} fill="none" stroke={color} strokeWidth={5} />
                    <circle cx={hx + 14} cy={hy - 8} r={16} fill="none" stroke={color} strokeWidth={5} />
                    <line x1={hx - 12 + 18} y1={hy - 8} x2={hx + 14 - 16} y2={hy - 8} stroke={color} strokeWidth={5} />
                    <line x1={hx - 12 - 18} y1={hy - 12} x2={hx - 12 - 30} y2={hy - 16} stroke={color} strokeWidth={4} strokeLinecap="round" />
                    <line x1={hx + 14 + 16} y1={hy - 12} x2={hx + 14 + 28} y2={hy - 16} stroke={color} strokeWidth={4} strokeLinecap="round" />
                </g>
            );
        case 'sunglasses':
            return (
                <g>
                    <line x1={hx - 12 + 18} y1={hy - 8} x2={hx + 14 - 16} y2={hy - 8} stroke={INK} strokeWidth={5} />
                    <rect x={hx - 12 - 18} y={hy - 8 - 12} width={36} height={22} rx={8} fill={INK} fillOpacity={0.87} stroke={INK} strokeWidth={4} />
                    <rect x={hx + 14 - 16} y={hy - 8 - 12} width={32} height={22} rx={8} fill={INK} fillOpacity={0.87} stroke={INK} strokeWidth={4} />
                    <rect x={hx - 12 - 14} y={hy - 8 - 8} width={10} height={6} rx={2} fill={WHITE} fillOpacity={0.28} />
                    <rect x={hx + 14 - 12} y={hy - 8 - 8} width={10} height={6} rx={2} fill={WHITE} fillOpacity={0.28} />
                    <line x1={hx - 12 - 18} y1={hy - 4} x2={hx - 12 - 32} y2={hy - 10} stroke={INK} strokeWidth={4} strokeLinecap="round" />
                    <line x1={hx + 14 + 16} y1={hy - 4} x2={hx + 14 + 30} y2={hy - 10} stroke={INK} strokeWidth={4} strokeLinecap="round" />
                </g>
            );
        case 'headphones':
            return (
                <g>
                    <path
                        d={`M${hx - hr - 6} ${hy - 10}
                            Q${hx - hr - 10} ${topY - 22} ${hx} ${topY - 28}
                            Q${hx + hr + 10} ${topY - 22} ${hx + hr + 6} ${hy - 10}`}
                        fill="none" stroke="#374151" strokeWidth={7} strokeLinecap="round"
                    />
                    <rect x={hx - hr - 18} y={hy - 16} width={16} height={26} rx={6} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={hx - hr - 14} y={hy - 10} width={6} height={14} rx={3} fill={lighten(color, 0.22)} />
                    <rect x={hx + hr + 2} y={hy - 16} width={16} height={26} rx={6} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={hx + hr + 6} y={hy - 10} width={6} height={14} rx={3} fill={lighten(color, 0.22)} />
                </g>
            );
        case 'backpack':
            return (
                <g>
                    <rect x={BODY_CX + BODY_RX - 6} y={BODY_CY - 10} width={30} height={42} rx={9} fill={color} stroke={INK} strokeWidth={5} />
                    <rect x={BODY_CX + BODY_RX - 2} y={BODY_CY - 4} width={14} height={20} rx={5} fill={lighten(color, 0.14)} />
                    <rect x={BODY_CX + BODY_RX + 4} y={BODY_CY + 8} width={5} height={5} rx={2} fill={dark} />
                </g>
            );
        default:
            return null;
    }
}

export default AvatarViewer2D;
