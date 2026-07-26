import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ouderwetse film-leader: één seconde celluloid met een roterende sweep hand,
 * korrel, krassen en perforatiegaten.
 *
 * Er wordt bewust niet afgeteld. De aftelling 3 · 2 · 1 duurde 3,6 seconden en
 * liet de bezoeker wachten voordat het verhaal begon; wat overblijft is een
 * korte filmische aanloop van één omwenteling.
 *
 * De kleuren hier zijn bewust géén merktokens: dit is celluloid (#3a3a38 /
 * #e8e4d8), geen DGSkills-vlak.
 */
export function Leader({ t }: { t: number }) {
    // Eén volledige omwenteling over de duur van de scène.
    const frac = Math.min(1, Math.max(0, t));
    const sweep = (1 - frac) * 360;

    return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#3a3a38] text-[#e8e4d8]">
            {/* korrelflikkering */}
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-[0.16]"
                animate={{ opacity: [0.1, 0.22, 0.14, 0.2, 0.12] }}
                transition={{ duration: 0.32, repeat: Infinity, repeatType: 'mirror' }}
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />

            {/* krassen op de film */}
            {[12, 38, 64, 86].map((x, i) => (
                <motion.span
                    key={x}
                    className="absolute top-0 h-full w-px bg-[#e8e4d8]"
                    style={{ left: `${x}%` }}
                    animate={{ opacity: [0, 0.14, 0, 0.1, 0] }}
                    transition={{
                        duration: 0.4 + i * 0.13,
                        repeat: Infinity,
                        repeatDelay: 0.6 + i * 0.3,
                    }}
                />
            ))}

            {/* perforatiegaten */}
            <div className="absolute inset-y-0 left-3 flex w-7 flex-col justify-around py-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="h-6 w-7 rounded-[3px] bg-[#14130f]" />
                ))}
            </div>
            <div className="absolute inset-y-0 right-3 flex w-7 flex-col justify-around py-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="h-6 w-7 rounded-[3px] bg-[#14130f]" />
                ))}
            </div>

            {/* de leader-cirkel */}
            <div className="relative">
                <svg
                    width="300"
                    height="300"
                    viewBox="0 0 300 300"
                    className="h-[46svh] max-h-[300px] w-[46svh] max-w-[300px]"
                    aria-hidden="true"
                >
                    <circle cx="150" cy="150" r="140" fill="none" stroke="#e8e4d8" strokeWidth="2" opacity="0.9" />
                    <circle cx="150" cy="150" r="118" fill="none" stroke="#e8e4d8" strokeWidth="1.2" opacity="0.5" />
                    {/* draadkruis */}
                    <line x1="150" y1="4" x2="150" y2="296" stroke="#e8e4d8" strokeWidth="1.6" opacity="0.85" />
                    <line x1="4" y1="150" x2="296" y2="150" stroke="#e8e4d8" strokeWidth="1.6" opacity="0.85" />
                    {/* sweep hand */}
                    <line
                        x1="150"
                        y1="150"
                        x2="150"
                        y2="18"
                        stroke="#e8e4d8"
                        strokeWidth="4"
                        strokeLinecap="round"
                        transform={`rotate(${sweep} 150 150)`}
                    />
                    {/* sector die achter de wijzer aan sleept */}
                    <path
                        d={describeArc(
                            150,
                            150,
                            132,
                            sweep - 90,
                            sweep - 90 + Math.min(120, 360 * frac + 20),
                        )}
                        fill="#e8e4d8"
                        opacity="0.10"
                    />
                    <circle cx="150" cy="150" r="5" fill="#e8e4d8" />
                </svg>
            </div>

            <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#e8e4d8]/60 md:text-xs">
                DGSkills presenteert
            </p>
        </div>
    );
}

/* SVG-boogpad voor de gearceerde sweep-sector. */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polar(cx, cy, r, endAngle);
    const end = polar(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function polar(cx: number, cy: number, r: number, angle: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
