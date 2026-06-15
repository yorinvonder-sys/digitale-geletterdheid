import React from 'react';

const IconArrowLeft = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

export const IctIntegraties: React.FC = () => {
    const integrations = [
        { category: 'Identity / SSO', platform: 'Microsoft 365 (Azure AD)', status: 'Ondersteund', method: 'SAML / OAuth2' },
        { category: 'Identity / SSO', platform: 'Google Workspace', status: 'Gepland', method: 'OAuth2' },
        { category: 'Identity / SSO', platform: 'SURFconext', status: 'Gepland', method: 'SAML' },
        { category: 'LMS / ELO', platform: 'Magister', status: 'Export/Import', method: 'CSV / ELO-koppeling' },
        { category: 'LMS / ELO', platform: 'SOMtoday', status: 'Export/Import', method: 'CSV' },
        { category: 'LMS / ELO', platform: 'Itslearning', status: 'Gepland', method: 'LTI 1.3' },
        { category: 'Rapportage', platform: 'PowerBI / Excel', status: 'Ondersteund', method: 'API / CSV Export' },
    ];

    return (
        <div className="min-h-screen bg-duck-bg py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict" className="inline-flex items-center gap-2 text-duck-ink/60 hover:text-duck-acid font-medium mb-12 transition-colors min-h-[44px] py-2">
                    <IconArrowLeft />
                    Terug naar overzicht
                </a>

                <h1 className="text-4xl font-bold text-duck-ink mb-6">Integratie & Compatibiliteit</h1>
                <p className="text-lg text-duck-ink/60 mb-12">
                    DGSkills is ontworpen om naadloos samen te werken met de bestaande ICT-infrastructuur van VO-scholen. 
                    Wij geloven in open standaarden en platform-onafhankelijkheid.
                </p>

                <section className="bg-white rounded-2xl shadow-sm border border-duck-ink/15 overflow-hidden mb-12">
                    <div className="p-6 border-b border-duck-ink/15 bg-duck-bg/50">
                        <h2 className="font-bold text-duck-ink">Integratiematrix</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-duck-ink/60 uppercase tracking-wider">
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Categorie</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Platform</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Status</th>
                                    <th className="px-6 py-4 border-b border-duck-ink/15">Methode</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {integrations.map((item, i) => (
                                    <tr key={i} className="hover:bg-duck-bg transition-colors">
                                        <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">{item.category}</td>
                                        <td className="px-6 py-4 border-b border-duck-ink/15 font-medium text-duck-ink">{item.platform}</td>
                                        <td className="px-6 py-4 border-b border-duck-ink/15">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                item.status === 'Ondersteund' ? 'bg-duck-ink/10 text-duck-ink' :
                                                item.status === 'Export/Import' ? 'bg-duck-ink/10 text-duck-ink' :
                                                'bg-duck-acid text-duck-ink'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 border-b border-duck-ink/15 text-duck-ink/60">{item.method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-duck-ink/15">
                        <h3 className="text-lg font-bold text-duck-ink mb-4">Single Sign-On (SSO)</h3>
                        <p className="text-duck-ink/60 text-sm leading-relaxed">
                            Wij maken gebruik van federatieve login via Microsoft 365 of Google Workspace.
                            Dit betekent dat leerlingen en docenten geen nieuwe wachtwoorden hoeven te onthouden
                            en dat accounts automatisch worden beheerd via jullie centrale directory.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-duck-ink/15">
                        <h3 className="text-lg font-bold text-duck-ink mb-4">LVS Koppelingen</h3>
                        <p className="text-duck-ink/60 text-sm leading-relaxed">
                            Voortgangsdata kan eenvoudig worden geëxporteerd naar Magister en SOMtoday. 
                            Hiermee borgen we dat resultaten op de juiste plek in de schooladministratie terechtkomen 
                            zonder handmatig overtypwerk voor docenten.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
