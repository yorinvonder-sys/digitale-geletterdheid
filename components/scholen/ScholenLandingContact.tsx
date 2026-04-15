/**
 * Contact section — lazy-loaded. Supabase deferred until form submit (interaction-time).
 * The actual form is the shared PilotRequestForm component so both /scholen and
 * /pilot-aanmelden stay in sync.
 */
import React from 'react';
import { PilotRequestForm } from './PilotRequestForm';

const IconCheckCircle = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

const IconShield = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const ScholenLandingContact: React.FC = () => {
    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3" style={{ fontFamily: "'Newsreader', Georgia, serif" }}>
                        Start met een gratis pilot
                    </h2>
                    <p className="text-base max-w-2xl mx-auto" style={{ color: '#9C9C95' }}>
                        Transparante prijzen. Start met een gratis pilot — geen verplichtingen.
                        Snel live (binnen 10 werkdagen); privacy AVG-compliant.
                    </p>
                </div>

                <div className="lg:flex lg:items-stretch lg:gap-6">
                    {/* Pilot card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-7 flex-1 mb-4 lg:mb-0 ring-2 ring-[#D97757]/30 relative overflow-hidden">
                        <div className="text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full absolute top-3 right-3" style={{ backgroundColor: '#D97757' }}>Aanbevolen</div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#D97757' }}>Pilot</p>
                        <p className="text-3xl font-bold text-white mb-1">Gratis</p>
                        <p className="text-sm mb-5" style={{ color: '#9C9C95' }}>3 maanden / max. 250 leerlingen</p>
                        <ul className="space-y-2.5 mb-6">
                            {['20+ AI-missies', 'Docenten-dashboard', 'Onboarding 30 min', 'AVG-compliant', 'Live binnen 10 werkdagen'].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                    <IconCheckCircle className="flex-shrink-0" style={{ color: '#D97757' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => document.getElementById('pilot-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full text-white font-semibold min-h-[44px] rounded-full text-sm transition-colors"
                            style={{ backgroundColor: '#D97757' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C46849')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#D97757')}
                        >
                            Pilot aanvragen
                        </button>
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px]" style={{ color: '#9C9C95' }}>
                            <IconShield />
                            Geen creditcard nodig
                        </div>
                    </div>

                    {/* Post-pilot card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-7 flex-1 mb-4 lg:mb-0">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#9C9C95' }}>Na de pilot</p>
                        <p className="text-3xl font-bold text-white mb-1">Vanaf €2.000</p>
                        <p className="text-sm mb-1" style={{ color: '#9C9C95' }}>per schoollocatie / jaar</p>
                        <p className="text-xs mt-1 mb-5" style={{ color: '#9C9C95' }}>Minder dan €7 per leerling per jaar</p>
                        <ul className="space-y-2.5 mb-6">
                            {['Onbeperkt leerlingen', 'Volledige SLO-koppeling', 'Support-SLA (ma-vr)', 'Geen verborgen kosten'].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                    <IconCheckCircle className="flex-shrink-0" style={{ color: '#9C9C95' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => document.getElementById('pilot-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold min-h-[44px] rounded-full text-sm border border-white/20 transition-colors"
                        >
                            Plan demo
                        </button>
                    </div>

                    {/* Form */}
                    <div id="pilot-form" className="flex-[1.3] max-w-lg scroll-mt-24 w-full lg:min-w-[340px]">
                        <p className="text-sm font-medium mb-6" style={{ color: '#D97757' }}>Schooljaar 2025-2026 is het laatste volledige pilotjaar vóór de verwachte verplichting in 2027.</p>
                        <PilotRequestForm
                            source="scholen-landing"
                            variant="light"
                            introTitle="Direct aanvragen"
                            introSubtitle="Reactie binnen 2 werkdagen"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
