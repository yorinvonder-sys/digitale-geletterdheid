/**
 * Shared pilot request form.
 *
 * Used on:
 * - /scholen marketing landing (via ScholenLandingContact)
 * - /pilot-aanmelden dedicated signup page
 *
 * Security:
 * - Server-side validation in supabase/functions/submitPilotRequest
 * - Honeypot field (visually hidden) to trap naive bots
 * - submittedAt timestamp to detect instant-submission bots
 */
import React, { useState } from 'react';
import { trackEvent } from '../../services/analyticsService';

const IconCheckCircle = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
);

interface PilotFormData {
    schoolNaam: string;
    contactPersoon: string;
    email: string;
    rol: string;
    bericht: string;
    aantalLeerlingen: string;
    website: string; // honeypot
}

export interface PilotRequestFormProps {
    /** Optional analytics label to distinguish form placements. */
    source?: string;
    /** Visual variant — `light` uses dark text on light bg, `inline` assumes embedded. */
    variant?: 'light' | 'inline';
    /** Optional intro copy shown above the form. */
    introTitle?: string;
    introSubtitle?: string;
}

const PILOT_ENDPOINT =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://127.0.0.1:54321/functions/v1/submitPilotRequest'
        : `${(import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL ?? ''}/functions/v1/submitPilotRequest`;

export const PilotRequestForm: React.FC<PilotRequestFormProps> = ({
    source = 'unknown',
    variant = 'light',
    introTitle,
    introSubtitle,
}) => {
    const [formData, setFormData] = useState<PilotFormData>({
        schoolNaam: '',
        contactPersoon: '',
        email: '',
        rol: '',
        bericht: '',
        aantalLeerlingen: '',
        website: '',
    });
    const [formStartedAt] = useState(() => Date.now());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            trackEvent('pilot_request_start', { rol: formData.rol || 'onbekend', source });
            const response = await fetch(PILOT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    submittedAt: formStartedAt,
                }),
            });

            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload?.error || 'Versturen mislukt.');
            }

            trackEvent('pilot_request_success', { rol: formData.rol, source });
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error submitting pilot request:', err);
            setSubmitError('Er ging iets mis. Probeer het opnieuw of mail ons direct.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const wrapperClass = variant === 'light'
        ? 'bg-white rounded-2xl p-7 shadow-2xl shadow-black/10'
        : 'bg-white rounded-2xl p-7 border border-slate-200';

    if (isSubmitted) {
        return (
            <div className={wrapperClass}>
                <div className="text-center py-8">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconCheckCircle className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "'Newsreader', Georgia, serif", color: '#1A1A19' }}>
                        Aanvraag ontvangen!
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#6B6B66' }}>
                        We nemen binnen 2 werkdagen contact met je op om de pilot in te plannen.
                    </p>
                    <div className="rounded-xl p-4 text-left" style={{ backgroundColor: '#F5F3EC' }}>
                        <p className="text-xs font-bold mb-1" style={{ color: '#1A1A19' }}>Wat kun je verwachten?</p>
                        <ul className="space-y-1 text-xs" style={{ color: '#6B6B66' }}>
                            <li>1. Kennismakingsgesprek (15 min) — binnen 2 werkdagen</li>
                            <li>2. Onboarding voor docenten (30 min)</li>
                            <li>3. Leerlingen starten binnen 10 werkdagen</li>
                        </ul>
                    </div>
                    <p className="text-xs mt-4" style={{ color: '#9C9C95' }}>
                        Je ontvangt binnen enkele minuten een bevestigingsmail met onze Compliance Hub, demo-link en FAQ.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={wrapperClass}>
            <form onSubmit={handleSubmit} className="space-y-3.5" aria-label="Pilot aanvraagformulier" aria-busy={isSubmitting}>
                {/* Honeypot — verborgen veld dat alleen bots invullen */}
                <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                {(introTitle || introSubtitle) && (
                    <div className="text-center mb-2">
                        {introTitle && (
                            <p className="text-sm font-bold" style={{ color: '#1A1A19' }}>{introTitle}</p>
                        )}
                        {introSubtitle && (
                            <p className="text-xs" style={{ color: '#9C9C95' }}>{introSubtitle}</p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="schoolNaam" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>Schoolnaam</label>
                    <input
                        id="schoolNaam"
                        type="text"
                        required
                        value={formData.schoolNaam}
                        onChange={(e) => setFormData({ ...formData, schoolNaam: e.target.value })}
                        placeholder="Naam van je school…"
                        autoComplete="organization"
                        className="w-full px-3.5 min-h-[44px] bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] placeholder:text-[#9C9C95]"
                    />
                </div>

                <div>
                    <label htmlFor="contactPersoon" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>Naam</label>
                    <input
                        id="contactPersoon"
                        type="text"
                        required
                        value={formData.contactPersoon}
                        onChange={(e) => setFormData({ ...formData, contactPersoon: e.target.value })}
                        placeholder="Je volledige naam…"
                        autoComplete="name"
                        className="w-full px-3.5 min-h-[44px] bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] placeholder:text-[#9C9C95]"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>E-mail</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="naam@school.nl"
                        autoComplete="email"
                        spellCheck={false}
                        className="w-full px-3.5 min-h-[44px] bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] placeholder:text-[#9C9C95]"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="rol" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>Rol</label>
                        <select
                            id="rol"
                            value={formData.rol}
                            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                            className="w-full px-3.5 min-h-[44px] bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] appearance-none"
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
                        <label htmlFor="aantalLeerlingen" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>Leerlingen</label>
                        <select
                            id="aantalLeerlingen"
                            value={formData.aantalLeerlingen}
                            onChange={(e) => setFormData({ ...formData, aantalLeerlingen: e.target.value })}
                            className="w-full px-3.5 min-h-[44px] bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] appearance-none"
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
                    <label htmlFor="bericht" className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B66' }}>
                        Bericht <span style={{ color: '#9C9C95' }}>(optioneel)</span>
                    </label>
                    <textarea
                        id="bericht"
                        value={formData.bericht}
                        onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                        placeholder="Specifieke wensen of vragen…"
                        rows={2}
                        className="w-full px-3.5 py-3 bg-[#F5F3EC] border border-[#E8E6DF] rounded-lg outline-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] transition-all text-sm text-[#1A1A19] placeholder:text-[#9C9C95] resize-none min-h-[80px]"
                    />
                </div>

                {submitError && (
                    <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg" role="alert">{submitError}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="w-full text-white font-semibold min-h-[48px] rounded-full flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D97757]"
                    style={{ backgroundColor: '#D97757' }}
                    onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C46849'; }}
                    onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#D97757'; }}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true"></div>
                            <span className="sr-only">Aanvraag wordt verzonden…</span>
                        </>
                    ) : (
                        'Pilot aanvragen'
                    )}
                </button>

                <p className="text-[11px] text-center leading-relaxed" style={{ color: '#9C9C95' }}>
                    Reactie binnen 2 werkdagen. Livegang binnen 10 werkdagen na akkoord.
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#6B6B66' }}>
                    Je gegevens worden verwerkt op grond van precontractueel contact (aanvraag). Verwerking vindt plaats via subverwerkers (o.a. hosting) met passende AVG-overeenkomsten. Zie onze{' '}
                    <a href="/ict/privacy/policy" className="underline transition-colors" style={{ color: '#D97757' }}>privacyverklaring</a>.
                </p>
            </form>
        </div>
    );
};
