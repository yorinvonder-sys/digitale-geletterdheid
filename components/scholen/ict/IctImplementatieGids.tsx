import React from 'react';

const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconCopy = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

const StepHeader: React.FC<{ step: number; title: string; estimate: string }> = ({ step, title, estimate }) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0">{step}</div>
        <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="text-xs text-slate-400">{estimate}</p>
        </div>
    </div>
);

const CheckItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3">
        <div className="mt-0.5 text-emerald-500 shrink-0"><IconCheck /></div>
        <span className="text-sm text-slate-700">{children}</span>
    </li>
);

const CodeBlock: React.FC<{ children: string }> = ({ children }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="relative bg-slate-900 rounded-xl p-4 my-4 group">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Kopieer naar klembord"
            >
                {copied ? <IconCheck /> : <IconCopy />}
            </button>
            <pre className="text-sm text-slate-200 overflow-x-auto font-mono whitespace-pre-wrap">{children}</pre>
        </div>
    );
};

export const IctImplementatieGids: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict/technisch" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar technische vereisten
                </a>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">ICT Implementatiegids</h1>
                <p className="text-lg text-slate-600 mb-4 max-w-2xl">
                    Stapsgewijze handleiding om DGSkills binnen uw school operationeel te krijgen. Gemiddelde doorlooptijd: 30 minuten.
                </p>
                <div className="flex flex-wrap gap-3 mb-12">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">4 stappen</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">Geen installatie nodig</span>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">~30 min doorlooptijd</span>
                </div>

                {/* Stap 1 */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
                    <StepHeader step={1} title="Netwerk & Firewall Checklist" estimate="~5 minuten" />
                    <p className="text-sm text-slate-600 mb-4">
                        DGSkills draait volledig in de browser via HTTPS (poort 443). Zorg dat de volgende domeinen op de allowlist van uw firewall/webfilter staan:
                    </p>
                    <CodeBlock>{`# Allowlist domeinen (poort 443/HTTPS)
*.dgskills.app
*.supabase.co
*.googleapis.com`}</CodeBlock>
                    <div className="bg-slate-50 rounded-xl p-4 mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-3">Verificatie checklist</p>
                        <ul className="space-y-2">
                            <CheckItem>Open <strong>dgskills.app</strong> vanaf een leerling-device op het schoolnetwerk</CheckItem>
                            <CheckItem>Controleer dat de inlogpagina volledig laadt (geen witte pagina of foutmelding)</CheckItem>
                            <CheckItem>Bevestig dat WebSocket-verbindingen niet worden geblokkeerd (nodig voor realtime functies)</CheckItem>
                        </ul>
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-sm text-amber-800">
                            <strong>Let op:</strong> Gebruikt uw school een contentfilter (bijv. Lightspeed, Securly, iBoss)? Voeg dan <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">dgskills.app</code> toe als vertrouwd domein om te voorkomen dat AI-chatverkeer wordt geblokkeerd.
                        </p>
                    </div>
                </section>

                {/* Stap 2 */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
                    <StepHeader step={2} title="SSO Koppeling configureren" estimate="~5 minuten" />
                    <p className="text-sm text-slate-600 mb-6">
                        DGSkills ondersteunt inloggen via Microsoft 365 en Google Workspace. Leerlingen en docenten loggen in met hun bestaande schoolaccount.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-[#00a4ef] rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 21 21" fill="white">
                                        <rect width="9.5" height="9.5" />
                                        <rect x="11.5" width="9.5" height="9.5" />
                                        <rect y="11.5" width="9.5" height="9.5" />
                                        <rect x="11.5" y="11.5" width="9.5" height="9.5" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Microsoft 365</h3>
                            </div>
                            <ol className="space-y-2 text-sm text-slate-600">
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">1.</span> Leerlingen klikken op "Inloggen met Microsoft"</li>
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">2.</span> Ze loggen in met hun school Microsoft-account</li>
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">3.</span> Bij eerste login: de beheerder of gebruiker geeft eenmalig toestemming</li>
                            </ol>
                            <p className="text-xs text-slate-400 mt-3">Geen Azure AD-configuratie nodig aan de schoolkant.</p>
                        </div>

                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm">Google Workspace</h3>
                            </div>
                            <ol className="space-y-2 text-sm text-slate-600">
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">1.</span> Leerlingen klikken op "Inloggen met Google"</li>
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">2.</span> Ze loggen in met hun school Google-account</li>
                                <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">3.</span> Bij eerste login: de beheerder of gebruiker geeft eenmalig toestemming</li>
                            </ol>
                            <p className="text-xs text-slate-400 mt-3">Geen Google Admin Console-configuratie nodig aan de schoolkant.</p>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <p className="text-sm text-indigo-800">
                            <strong>Tip:</strong> Wilt u inloggen beperken tot alleen uw schooldomein? Neem contact op met <a href="mailto:support@dgskills.app" className="underline font-medium">support@dgskills.app</a> en wij stellen een domeinbeperking in.
                        </p>
                    </div>
                </section>

                {/* Stap 3 */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
                    <StepHeader step={3} title="Test Run uitvoeren" estimate="~15 minuten" />
                    <p className="text-sm text-slate-600 mb-6">
                        Valideer de volledige keten voordat u breder uitrolt. Voer onderstaande tests uit met 1-2 testaccounts.
                    </p>

                    <div className="space-y-3">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm font-bold text-slate-900 mb-2">A. Inloggen testen</p>
                            <ul className="space-y-2">
                                <CheckItem>Log in als <strong>docent</strong> via SSO - controleer of het docentendashboard verschijnt</CheckItem>
                                <CheckItem>Log in als <strong>leerling</strong> via SSO - controleer of de missie-selectie verschijnt</CheckItem>
                                <CheckItem>Test op minimaal 2 device-types (bijv. Chromebook + iPad)</CheckItem>
                            </ul>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm font-bold text-slate-900 mb-2">B. AI-chat testen</p>
                            <ul className="space-y-2">
                                <CheckItem>Start een missie en voer een chatgesprek met de AI-agent</CheckItem>
                                <CheckItem>Controleer dat antwoorden binnen 5 seconden verschijnen</CheckItem>
                                <CheckItem>Verifieer dat de chat niet wordt geblokkeerd door de contentfilter</CheckItem>
                            </ul>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm font-bold text-slate-900 mb-2">C. Docentenfuncties testen</p>
                            <ul className="space-y-2">
                                <CheckItem>Open het docentendashboard en bekijk de leerlingenlijst</CheckItem>
                                <CheckItem>Controleer dat voortgang van de testleerling zichtbaar is</CheckItem>
                                <CheckItem>Test het in- en uitschakelen van een missie</CheckItem>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-800">
                            <strong>Problemen?</strong> De meest voorkomende oorzaak is een contentfilter die API-verkeer naar <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">*.supabase.co</code> of <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">*.googleapis.com</code> blokkeert. Controleer uw filterregels of neem contact op met <a href="mailto:support@dgskills.app" className="underline font-medium">support@dgskills.app</a>.
                        </p>
                    </div>
                </section>

                {/* Stap 4 */}
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm mb-8">
                    <StepHeader step={4} title="Go-Live & uitrol" estimate="~5 minuten" />
                    <p className="text-sm text-slate-600 mb-6">
                        Na een succesvolle test run kunt u DGSkills breder beschikbaar stellen. Hieronder de aanbevolen uitrolstrategie.
                    </p>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                                    <th className="px-6 py-3 border-b border-slate-200">Fase</th>
                                    <th className="px-6 py-3 border-b border-slate-200">Wie</th>
                                    <th className="px-6 py-3 border-b border-slate-200">Wanneer</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">Pilotgroep</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">1-2 klassen met enthousiaste docent</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">Week 1-2</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">Evaluatie</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">Docent + ICT evalueren ervaringen</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">Week 3</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-900">Bredere uitrol</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-600">Meerdere klassen / jaarlagen</td>
                                    <td className="px-6 py-4 border-b border-slate-100 text-slate-500">Week 4+</td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">Schoolbreed</td>
                                    <td className="px-6 py-4 text-slate-600">Alle relevante klassen</td>
                                    <td className="px-6 py-4 text-slate-500">Na positieve evaluatie</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-bold text-slate-900 mb-2">Communicatie naar leerlingen</p>
                            <p className="text-xs text-slate-600">
                                Deel de link <strong>dgskills.app</strong> via de elektronische leeromgeving (ELO) of in de les. Leerlingen loggen in met hun schoolaccount — er is geen aparte registratie nodig.
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-sm font-bold text-slate-900 mb-2">Communicatie naar ouders</p>
                            <p className="text-xs text-slate-600">
                                Informeer ouders/verzorgers via de reguliere schoolcommunicatie over het gebruik van DGSkills. Verwijs naar de <a href="/ict/privacy/policy" className="text-indigo-600 underline">privacyverklaring</a> voor vragen over gegevensverwerking.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Support & Contact */}
                <section className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white">
                    <h2 className="text-2xl font-bold mb-4">Hulp nodig bij de implementatie?</h2>
                    <p className="text-indigo-200 text-sm mb-8 max-w-xl">
                        Ons team helpt u graag bij het configureren van DGSkills voor uw school. We bieden gratis onboarding-ondersteuning aan tijdens de pilotperiode.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">E-mail</p>
                            <a href="mailto:support@dgskills.app" className="text-sm font-bold hover:text-indigo-300 transition-colors">support@dgskills.app</a>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Responstijd</p>
                            <p className="text-sm font-bold">Binnen 1 werkdag</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Documentatie</p>
                            <a href="/ict" className="text-sm font-bold hover:text-indigo-300 transition-colors">ICT Portaal &rarr;</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
