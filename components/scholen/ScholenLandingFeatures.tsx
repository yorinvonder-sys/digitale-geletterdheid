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

const IconBrain = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z"/>
    </svg>
);

const IconTarget = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
);

const IconTrophy = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
);

const IconBarChart = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
);

const IconLock = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const IconGlobe = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
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
                    Digitale geletterdheid wordt verplicht per 2027, maar bestaand lesmateriaal
                    is vaak statisch en weet leerlingen niet te boeien. DGSkills pakt dat anders aan
                    met AI-missies, gamification en real-time voortgangsinzicht.
                </p>
            </div>

            <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 hover:shadow-lg transition-all border border-indigo-100/50 group">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <IconBrain />
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
                            <IconTarget />
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
                            <IconTrophy />
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
                                <IconBarChart />
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
                                <IconLock />
                            </div>
                            <div>
                                <FeatureMarker
                                    label="Privacy"
                                    colorClass="text-slate-600"
                                    barClass="bg-slate-400"
                                />
                                <h3 className="text-xl font-bold text-slate-900 mb-3">AVG-compliant en privacy-proof</h3>
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
                                <IconGlobe />
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
