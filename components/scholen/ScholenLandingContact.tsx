/**
 * Contact section — lazy-loaded. Supabase deferred until form submit (interaction-time).
 * Inline SVG avoids lucide chunk load.
 */
import React, { useState } from 'react';
import { trackEvent } from '../../services/analyticsService';

const IconCheckCircle = ({ className = '' }: { className?: string }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

const IconShield = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

interface PilotFormData {
    schoolNaam: string;
    contactPersoon: string;
    email: string;
    rol: string;
    bericht: string;
    aantalLeerlingen: string;
}

const PILOT_ENDPOINT =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:54321/functions/v1/submitPilotRequest'
        : `${(import.meta as any).env.VITE_SUPABASE_URL}/functions/v1/submitPilotRequest`;

export const ScholenLandingContact: React.FC = () => {
    const [formData, setFormData] = useState<PilotFormData>({
        schoolNaam: '',
        contactPersoon: '',
        email: '',
        rol: '',
        bericht: '',
        aantalLeerlingen: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const response = await fetch(PILOT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                ...formData,
                    website: ''
                })
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || 'Versturen mislukt.');
            }

            trackEvent('pilot_request_success', { rol: formData.rol });
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error submitting pilot request:', err);
            setSubmitError('Er ging iets mis. Probeer het opnieuw of mail ons direct.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
                        Start met een gratis pilot
                    </h2>
                    <p className="text-slate-400 text-base max-w-2xl mx-auto">
                        Transparante prijzen. Start met een gratis pilot — geen verplichtingen.
                        Snel live (binnen 10 werkdagen); privacy AVG-compliant.
                    </p>
                </div>

                <div className="lg:flex lg:items-stretch lg:gap-6">
                    {/* Pilot card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-7 flex-1 mb-4 lg:mb-0 ring-2 ring-indigo-500/30 relative overflow-hidden">
                        <div className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Aanbevolen</div>
                        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Pilot</p>
                        <p className="text-3xl font-bold text-white mb-1">Gratis</p>
                        <p className="text-sm text-slate-400 mb-5">3 maanden / max. 250 leerlingen</p>
                        <ul className="space-y-2.5 mb-6">
                            {['20+ AI-missies', 'Docenten-dashboard', 'Onboarding 30 min', 'AVG-compliant', 'Live binnen 10 werkdagen'].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                    <IconCheckCircle className="text-indigo-400 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => document.getElementById('pilot-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold min-h-[44px] rounded-lg text-sm transition-colors"
                        >
                            Pilot aanvragen
                        </button>
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-slate-500">
                            <IconShield />
                            Geen creditcard nodig
                        </div>
                    </div>

                    {/* Post-pilot card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-7 flex-1 mb-4 lg:mb-0">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Na de pilot</p>
                        <p className="text-3xl font-bold text-white mb-1">Vanaf €2.000</p>
                        <p className="text-sm text-slate-400 mb-1">per schoollocatie / jaar</p>
                        <p className="text-xs text-slate-400 mt-1 mb-5">Minder dan €7 per leerling per jaar</p>
                        <ul className="space-y-2.5 mb-6">
                            {['Onbeperkt leerlingen', 'Volledige SLO-koppeling', 'Support-SLA (ma-vr)', 'Geen verborgen kosten'].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                    <IconCheckCircle className="text-slate-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => document.getElementById('pilot-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold min-h-[44px] rounded-lg text-sm border border-white/20 transition-colors"
                        >
                            Plan demo
                        </button>
                    </div>

                    {/* Form */}
                    <div id="pilot-form" className="flex-[1.3] max-w-lg scroll-mt-24 lg:min-w-[340px]">
                        <p className="text-sm text-indigo-600 font-medium mb-6">Schooljaar 2025-2026 is het laatste volledige pilotjaar vóór de verwachte verplichting in 2027.</p>
                        <div className="bg-white rounded-2xl p-7 shadow-2xl shadow-black/10">
                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <IconCheckCircle className="text-emerald-600 w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Aanvraag ontvangen!</h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        We nemen binnen 2 werkdagen contact met je op om de pilot in te plannen.
                                    </p>
                                    <div className="bg-slate-50 rounded-xl p-4 text-left">
                                        <p className="text-xs font-bold text-slate-600 mb-1">Wat kun je verwachten?</p>
                                        <ul className="space-y-1 text-xs text-slate-500">
                                            <li>1. Kennismakingsgesprek (15 min)</li>
                                            <li>2. Onboarding voor docenten (30 min)</li>
                                            <li>3. Leerlingen starten binnen 10 werkdagen</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3.5" aria-label="Pilot aanvraagformulier">
                                    <div className="text-center mb-2">
                                        <p className="text-sm font-bold text-slate-900">Direct aanvragen</p>
                                        <p className="text-xs text-slate-400">Reactie binnen 2 werkdagen</p>
                                    </div>

                                    <div>
                                        <label htmlFor="schoolNaam" className="block text-xs font-medium text-slate-500 mb-1.5">Schoolnaam</label>
                                        <input
                                            id="schoolNaam"
                                            type="text"
                                            required
                                            value={formData.schoolNaam}
                                            onChange={(e) => setFormData({ ...formData, schoolNaam: e.target.value })}
                                            placeholder="Naam van je school"
                                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contactPersoon" className="block text-xs font-medium text-slate-500 mb-1.5">Naam</label>
                                        <input
                                            id="contactPersoon"
                                            type="text"
                                            required
                                            value={formData.contactPersoon}
                                            onChange={(e) => setFormData({ ...formData, contactPersoon: e.target.value })}
                                            placeholder="Je volledige naam"
                                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-slate-500 mb-1.5">E-mail</label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="naam@school.nl"
                                            className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="rol" className="block text-xs font-medium text-slate-500 mb-1.5">Rol</label>
                                            <select
                                                id="rol"
                                                value={formData.rol}
                                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                                className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 appearance-none"
                                            >
                                                <option value="">Selecteer</option>
                                                <option value="docent">Docent</option>
                                                <option value="ict-coordinator">ICT-coordinator</option>
                                                <option value="teamleider">Teamleider</option>
                                                <option value="directie">Directie</option>
                                                <option value="anders">Anders</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="aantalLeerlingen" className="block text-xs font-medium text-slate-500 mb-1.5">Leerlingen</label>
                                            <select
                                                id="aantalLeerlingen"
                                                value={formData.aantalLeerlingen}
                                                onChange={(e) => setFormData({ ...formData, aantalLeerlingen: e.target.value })}
                                                className="w-full px-3.5 min-h-[44px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 appearance-none"
                                            >
                                                <option value="">Aantal</option>
                                                <option value="1-50">1 – 50</option>
                                                <option value="50-150">50 – 150</option>
                                                <option value="150-300">150 – 300</option>
                                                <option value="300+">300+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="bericht" className="block text-xs font-medium text-slate-500 mb-1.5">
                                            Bericht <span className="text-slate-400">(optioneel)</span>
                                        </label>
                                        <textarea
                                            id="bericht"
                                            value={formData.bericht}
                                            onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                                            placeholder="Specifieke wensen of vragen?"
                                            rows={2}
                                            className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none min-h-[80px]"
                                        />
                                    </div>

                                    {submitError && (
                                        <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg" role="alert">{submitError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold min-h-[48px] rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                                        ) : (
                                            'Pilot aanvragen'
                                        )}
                                    </button>

                                    <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                                        Reactie binnen 2 werkdagen. Livegang binnen 10 werkdagen na akkoord.
                                    </p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Je gegevens worden verwerkt op grond van precontractueel contact (aanvraag). Verwerking vindt plaats via subverwerkers (o.a. hosting) met passende AVG-overeenkomsten. Zie onze <a href="/ict/privacy/policy" className="text-indigo-400 hover:text-indigo-300 underline">privacyverklaring</a>.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
