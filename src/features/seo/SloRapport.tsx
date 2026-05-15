import React, { useEffect, useRef, useState } from 'react';
import { trackEvent } from '@/services/analyticsService';
import { SLO_KERNDOELEN, SloKerndoelCode } from '@/config/sloKerndoelen';
import { getMissionsForKerndoel } from '@/config/slo-kerndoelen-mapping';

// Reguliere VO kerndoelen (domeinen 21-23) per officiële SLO september 2025 codes.
const REGULIER_VO_CODES: SloKerndoelCode[] = [
    '21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C',
];

type DomeinKleur = 'blue' | 'purple' | 'amber';

interface SloRow {
    code: SloKerndoelCode;
    label: string;
    domein: string;
    kleur: DomeinKleur;
    missionCount: number;
}

// Semantic SLO domain colors — preserved per spec (pedagogically meaningful)
const DOMEIN_COLORS: Record<DomeinKleur, string> = {
    blue: 'bg-lab-teal text-white',
    purple: 'bg-lab-teal text-white',
    amber: 'bg-lab-gold text-lab-ink',
};

const ROWS: SloRow[] = REGULIER_VO_CODES.map((code) => {
    const kerndoel = SLO_KERNDOELEN[code];
    return {
        code,
        label: kerndoel.label,
        domein: kerndoel.domein,
        kleur: kerndoel.kleur,
        missionCount: getMissionsForKerndoel(code).length,
    };
});

const DEKKING_COUNT = ROWS.filter((r) => r.missionCount > 0).length;
const TOTAL_MISSIONS = ROWS.reduce((acc, r) => acc + r.missionCount, 0);

export const SloRapport: React.FC = () => {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Voorbeeld SLO-Dekkingsrapport | DGSkills';
        trackEvent('seo_asset_view', { page: 'slo-rapport-voorbeeld' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <div className="min-h-screen bg-lab-cream text-lab-ink font-sans">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-lab-paper/95 backdrop-blur border-b border-lab-line">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center" aria-label="DGSkills homepage">
                        <img src="/logo-lockup.svg" alt="DGSkills" className="h-10 w-auto max-w-[180px] sm:h-12 sm:max-w-[200px] object-contain" />
                    </a>
                    <div className="flex items-center gap-5 text-sm">
                        <a href="/scholen" className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline">Voor scholen</a>
                        <a href="/pilot" className="text-lab-muted hover:text-lab-coral transition-colors hidden sm:inline">Pilot</a>
                        <a href="mailto:info@dgskills.app" className="text-lab-muted hover:text-lab-coral transition-colors">Contact</a>
                    </div>
                </div>
            </nav>

            <main className="pt-28 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <Reveal delay={0}>
                        <div className="bg-lab-paper p-10 rounded-3xl shadow-[0_24px_60px_-30px_rgba(8,40,59,0.10)] border border-lab-line">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-lab-coral/10 text-lab-coral text-[11px] font-bold rounded-full uppercase tracking-[0.14em]">
                                            Voorbeeld · demorapport
                                        </span>
                                    </div>
                                    <h1 className="font-black text-balance text-2xl md:text-3xl text-lab-ink mb-2">
                                        SLO-Dekkingsrapport (Voorbeeld)
                                    </h1>
                                    <p className="text-lab-muted text-sm">
                                        Gegenereerd voor: Voorbeeldschool VO — fictieve data ter illustratie
                                    </p>
                                </div>
                                <img
                                    src="/logo-lockup.svg"
                                    alt="DGSkills"
                                    className="h-10 w-auto max-w-[140px] object-contain opacity-20 hidden sm:block"
                                />
                            </div>

                            <div className="mb-10 p-4 bg-lab-creamWarm border border-lab-line rounded-2xl text-sm text-lab-muted">
                                Dit rapport toont hoe een DGSkills-verantwoordingsrapport eruit ziet. De
                                leerling- en scoregegevens zijn fictief; de <strong className="text-lab-ink">SLO-kerndoelen komen uit
                                het officiële SLO-conceptkader (september 2025)</strong> voor digitale
                                geletterdheid.
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 mb-12">
                                <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                    <div className="text-xs text-lab-mutedSoft uppercase font-bold mb-1">
                                        Missies voltooid
                                    </div>
                                    <div className="text-xl font-black text-lab-ink">1.240</div>
                                    <div className="text-[10px] text-lab-mutedSoft mt-1">voorbeeldwaarde</div>
                                </div>
                                <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                    <div className="text-xs text-lab-mutedSoft uppercase font-bold mb-1">
                                        Kerndoelen gedekt
                                    </div>
                                    <div className="text-xl font-black text-lab-ink">
                                        {DEKKING_COUNT} / {ROWS.length}
                                    </div>
                                    <div className="text-[10px] text-lab-mutedSoft mt-1">regulier VO</div>
                                </div>
                                <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                    <div className="text-xs text-lab-mutedSoft uppercase font-bold mb-1">
                                        Missies in catalogus
                                    </div>
                                    <div className="text-xl font-black text-lab-ink">{TOTAL_MISSIONS}</div>
                                    <div className="text-[10px] text-lab-mutedSoft mt-1">koppelingen totaal</div>
                                </div>
                                <div className="bg-lab-cream p-4 rounded-2xl border border-lab-line">
                                    <div className="text-xs text-lab-mutedSoft uppercase font-bold mb-1">
                                        Gem. score
                                    </div>
                                    <div className="text-xl font-black text-lab-ink">84%</div>
                                    <div className="text-[10px] text-lab-mutedSoft mt-1">voorbeeldwaarde</div>
                                </div>
                            </div>

                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-bold text-lab-mutedSoft uppercase tracking-widest border-b border-lab-line">
                                        <th className="pb-4">Code</th>
                                        <th className="pb-4">Kerndoel</th>
                                        <th className="pb-4">Domein</th>
                                        <th className="pb-4 text-right">Missies</th>
                                        <th className="pb-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ROWS.map((row) => {
                                        const colorClass = DOMEIN_COLORS[row.kleur];
                                        const isCovered = row.missionCount > 0;
                                        return (
                                            <tr
                                                key={row.code}
                                                className="border-b border-lab-line/50 text-sm"
                                            >
                                                <td className="py-4 font-mono font-bold text-lab-ink">
                                                    {row.code}
                                                </td>
                                                <td className="py-4 font-medium text-lab-ink">
                                                    {row.label}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorClass}`}
                                                    >
                                                        {row.domein}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right text-lab-muted tabular-nums">
                                                    {row.missionCount}
                                                </td>
                                                <td className="py-4 text-right">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                            isCovered
                                                                ? 'bg-lab-sage text-white'
                                                                : 'bg-lab-gold text-lab-ink'
                                                        }`}
                                                    >
                                                        {isCovered ? 'Gedekt' : 'Nog niet'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="mt-8 p-4 bg-lab-creamWarm rounded-xl border border-lab-line text-xs text-lab-muted">
                                <p className="mb-1">
                                    <strong className="text-lab-ink">Bron SLO-kerndoelen:</strong> SLO Definitieve conceptkerndoelen
                                    digitale geletterdheid (september 2025). Missie-koppelingen worden
                                    periodiek gevalideerd; laatste audit volgens projectnotities op 28 maart
                                    2026.
                                </p>
                                <p>
                                    Deze pagina is een demo van het rapport dat docenten en ICT-coördinatoren
                                    binnen DGSkills zelf kunnen inzien voor hun eigen klassen.
                                </p>
                            </div>

                            <div className="mt-10 p-6 bg-lab-tealDark rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                                <p className="text-sm text-lab-paper font-medium">
                                    Wil je dit rapport ook voor jouw school?
                                </p>
                                <a
                                    href="/digitale-geletterdheid-vo"
                                    className="inline-flex items-center justify-center px-6 py-2 bg-lab-gold hover:bg-lab-oliveDeep text-lab-ink font-black rounded-lg text-sm transition-colors"
                                >
                                    Start gratis pilot
                                </a>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </main>

            <footer className="py-12 text-lab-mutedSoft text-center text-xs">
                <p>© {new Date().getFullYear()} DGSkills — Privacy &amp; Compliance</p>
            </footer>
        </div>
    );
};

// ─── Inline animation utilities ───────────────────────────────────────────────

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReduced(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    return reduced;
}

function Reveal({
    children,
    className,
    delay = 0,
    y = 24,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    y?: number;
    style?: React.CSSProperties;
}) {
    const reduceMotion = usePrefersReducedMotion();
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (reduceMotion) {
            setInView(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.16 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [reduceMotion]);

    if (reduceMotion) {
        return <div className={className} style={style}>{children}</div>;
    }

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                opacity: inView ? 1 : 0.92,
                transform: inView ? 'translate3d(0,0,0)' : `translate3d(0,${y}px,0)`,
                transition: `opacity 680ms cubic-bezier(.22,1,.36,1) ${delay}s, transform 680ms cubic-bezier(.22,1,.36,1) ${delay}s`,
                willChange: inView ? 'auto' : 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
