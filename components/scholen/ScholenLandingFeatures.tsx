/**
 * Features section — cards with mini-screenshots and visual icons.
 */
import React from 'react';

const FeatureMarker: React.FC<{ label: string; colorClass: string; barClass: string }> = ({ label, colorClass, barClass }) => (
    <div className="flex items-center gap-2 mb-3">
        <div className={`w-1 h-3.5 rounded-full ${barClass}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
            {label}
        </span>
    </div>
);

/** Raket — AI-gestuurde missies */
const IconRocket = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
);

/** Vlaggetje op route — SLO Kerndoelen bereiken */
const IconFlag = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
    </svg>
);

/** Game controller — gamification */
const IconGamepad = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
    </svg>
);

/** Scherm met pulse — live dashboard monitoring */
const IconDashboardPulse = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="6 10 9 10 10.5 7 13.5 13 15 10 18 10"/>
    </svg>
);

/** Schild met slot — AVG privacy-bescherming */
const IconShieldLock = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9a2 2 0 1 1 4 0v2"/>
    </svg>
);

/** Laptop + telefoon — werkt op elk apparaat */
const IconMultiDevice = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="15" height="10" rx="1.5"/><line x1="5" y1="17" x2="12" y2="17"/><line x1="8.5" y1="14" x2="8.5" y2="17"/><rect x="17" y="7" width="6" height="11" rx="1"/><line x1="17" y1="15" x2="23" y2="15"/>
    </svg>
);

export const ScholenLandingFeatures: React.FC = () => (
    <div>
        <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-16">
                <p className="text-indigo-600 font-semibold text-sm mb-3 tracking-wide">Waarom DGSkills</p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Waarom scholen kiezen voor DGSkills
                </h2>
                <p className="text-base text-slate-500 leading-relaxed">
                    Digitale geletterdheid wordt wettelijk verplicht per 1 augustus 2027 (implementatieperiode tot 2031), maar bestaand lesmateriaal
                    is vaak statisch en weet leerlingen niet te boeien. DGSkills pakt dat anders aan
                    met AI-missies, gamification en real-time voortgangsinzicht.
                </p>
            </div>

            <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-indigo-100/50 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <IconRocket />
                            </div>
                            <div>
                                <FeatureMarker
                                    label="Leerervaring"
                                    colorClass="text-indigo-600"
                                    barClass="bg-indigo-500"
                                />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">AI-gestuurde missies voor digitale geletterdheid</h3>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Leerlingen lossen uitdagingen op met Google Gemini AI. Van het detecteren van
                                    deepfakes en het schrijven van effectieve prompts tot het opstellen van een AI-beleidsplan.
                                    Elke missie past zich aan het niveau aan — geen leerling zit stil.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-emerald-100/50 group">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                            <IconFlag />
                        </div>
                        <FeatureMarker
                            label="Curriculum"
                            colorClass="text-emerald-600"
                            barClass="bg-emerald-500"
                        />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">SLO Kerndoelen 2025</h3>
                        <p className="text-slate-500 text-[15px] leading-relaxed">
                            Elke missie is gekoppeld aan officiële SLO-kerndoelen voor digitale geletterdheid.
                            Je ziet in één oogopslag welke doelen behaald zijn.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-amber-100/50 group">
                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <IconGamepad />
                        </div>
                        <FeatureMarker
                            label="Motivatie"
                            colorClass="text-amber-600"
                            barClass="bg-amber-500"
                        />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Gamification die werkt in de klas</h3>
                        <p className="text-slate-500 text-[15px] leading-relaxed">
                            XP, badges, leaderboards en 3D-avatars.
                            Leerlingen willen verder — niet omdat het moet, maar omdat het leuk is.
                        </p>
                    </div>
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-blue-100/50 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <IconDashboardPulse />
                            </div>
                            <div>
                                <FeatureMarker
                                    label="Regie"
                                    colorClass="text-blue-600"
                                    barClass="bg-blue-500"
                                />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Dashboard voor docenten</h3>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Real-time inzicht per leerling en per klas. Bekijk SLO-voortgang, activiteit,
                                    resultaten en wie extra aandacht nodig heeft. Focus Mode laat je bepalen
                                    wanneer leerlingen aan welke missie werken.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-slate-100 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <IconShieldLock />
                            </div>
                            <div>
                                <FeatureMarker
                                    label="Privacy"
                                    colorClass="text-slate-600"
                                    barClass="bg-slate-400"
                                />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">AVG-compliant, Privacy by Design</h3>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    Data blijft binnen de EU in een beveiligde Europese database.
                                    Verwerkersovereenkomst en DPIA beschikbaar voor scholen.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-rose-100/50 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <IconMultiDevice />
                            </div>
                            <div>
                                <FeatureMarker
                                    label="Toegang"
                                    colorClass="text-rose-600"
                                    barClass="bg-rose-500"
                                />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Werkt op elk apparaat</h3>
                                <p className="text-slate-500 text-[15px] leading-relaxed">
                                    iPad, Chromebook, laptop, telefoon — maakt niet uit.
                                    Geen installatie, geen IT-afdeling nodig. Open de link en ga aan de slag.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
