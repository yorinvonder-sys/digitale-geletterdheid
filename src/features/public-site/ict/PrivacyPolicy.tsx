import React from 'react';
import { ArrowLeft, Shield, Mail, Lock, Database, UserCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-duck-bg py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict/privacy" className="inline-flex items-center gap-2 text-duck-ink/60 hover:text-duck-acid font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Terug naar Security & Privacy
                </a>

                <div className="bg-white rounded-3xl shadow-sm border border-duck-ink/15 p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-duck-acid rounded-2xl flex items-center justify-center">
                            <Shield className="text-duck-ink" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-duck-ink">Privacyverklaring</h1>
                            <p className="text-duck-ink/60">Laatst bijgewerkt: 14 februari 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg leading-relaxed text-duck-ink/60">
                            DGSkills (een product van <strong>Future Architect</strong>) hecht grote waarde aan de bescherming van persoonsgegevens, 
                            zeker in een onderwijsomgeving. In deze verklaring leggen we uit hoe we omgaan met gegevens van leerlingen en docenten.
                        </p>

                        <div className="my-8 p-6 bg-duck-bg rounded-2xl border border-duck-ink/15">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-duck-ink/60 mb-4">Identiteit van de Verwerker</h3>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-bold text-duck-ink">Future Architect</p>
                                    <p className="text-duck-ink/60">De exacte KvK-nummer, adres en vestigingsgegevens staan vermeld in de ondertekende verwerkersovereenkomst (DPA) en/of het contract met uw school. Indien deze niet openbaar beschikbaar zijn, vindt u ze in die documenten.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-duck-ink">Functionaris Gegevensbescherming (FG)</p>
                                    <p className="text-duck-ink/60">Bereikbaar via: privacy@dgskills.app</p>
                                    <p className="text-duck-ink/60">T.a.v. Privacy Officer</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">1. Onze Rol</h2>
                        <p>
                            DGSkills treedt op als <strong>verwerker</strong> in de zin van de AVG. De school (het schoolbestuur) 
                            is de <strong>verwerkingsverantwoordelijke</strong>. Wij verwerken gegevens uitsluitend in opdracht 
                            van de school en voor het doel waarvoor de school de gegevens aan ons verstrekt: het aanbieden van 
                            het interactieve leerplatform voor digitale geletterdheid.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">2. Welke gegevens verwerken wij?</h2>
                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <div className="p-4 bg-duck-bg rounded-xl border border-duck-ink/15">
                                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    <UserCheck size={16} className="text-duck-ink/60" /> Accountgegevens
                                </h3>
                                <p className="text-xs text-duck-ink/60">E-mailadres (inlog), weergavenaam, rol (leerling/docent) en klas-ID.</p>
                            </div>
                            <div className="p-4 bg-duck-bg rounded-xl border border-duck-ink/15">
                                <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    <Database size={16} className="text-duck-ink/60" /> Leerlingvoortgang
                                </h3>
                                <p className="text-xs text-duck-ink/60">XP, levels, voltooide missies, badges en antwoorden op opdrachten.</p>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">3. Grondslag en Doel</h2>
                        <p>
                            De verwerking van gegevens van leerlingen door DGSkills vindt plaats op basis van de instructies van de school. 
                            De school hanteert hiervoor doorgaans de grondslag <strong>"Publiekrechtelijke taak"</strong> (Art. 6 lid 1 sub e AVG), 
                            gericht op het aanbieden van onderwijs conform de kerndoelen van de SLO. 
                            Voor docenten kan de grondslag <strong>"Gerechtvaardigd belang"</strong> of <strong>"Uitvoering overeenkomst"</strong> van toepassing zijn.
                        </p>
                        <p className="mt-4">
                            <strong>Minderjarigen (onder 16 jaar):</strong> DGSkills is ontworpen voor gebruik binnen het onderwijs onder verantwoordelijkheid van de school.
                            De school bepaalt als verwerkingsverantwoordelijke de juridische grondslag en de toepasselijke waarborgen voor minderjarigen.
                            Waar verwerking op toestemming berust, is voor kinderen onder 16 jaar ouderlijke toestemming vereist conform AVG/UAVG.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">4. Subverwerkers</h2>
                        <p>
                            Voor onze dienstverlening maken wij gebruik van de volgende subverwerkers. Met al deze partijen zijn verwerkersovereenkomsten gesloten die voldoen aan de AVG-eisen:
                        </p>
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-duck-bg">
                                    <tr>
                                        <th className="px-4 py-2 font-bold">Partij</th>
                                        <th className="px-4 py-2 font-bold">Functie</th>
                                        <th className="px-4 py-2 font-bold">Locatie</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-4 py-2 italic text-duck-ink font-medium">Supabase (AWS)</td>
                                        <td className="px-4 py-2">Database, Authenticatie, Storage</td>
                                        <td className="px-4 py-2 font-medium">EER (Ierland)</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-4 py-2 italic text-duck-ink font-medium">Mistral AI</td>
                                        <td className="px-4 py-2">Tekst, vision en OCR via server-side Edge Functions, geen training op klantdata</td>
                                        <td className="px-4 py-2 font-medium">EER/EU API-verwerking</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="px-4 py-2 italic text-duck-ink font-medium">Black Forest Labs</td>
                                        <td className="px-4 py-2">FLUX image generation via server-side Edge Functions, geen provider-URL's naar de browser</td>
                                        <td className="px-4 py-2 font-medium">EU endpoint</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">5. Datalocatie en Beveiliging</h2>
                        <p>
                            Al onze data wordt opgeslagen binnen de Europese Economische Ruimte (EER). Wij maken gebruik van 
                            Supabase (AWS region: <code>eu-west-1</code>, Ierland). Onze beveiligingsmaatregelen omvatten:
                        </p>
                        <ul>
                            <li>Encryptie van data in rust (AES-256) en in transport (TLS 1.2+).</li>
                            <li>Strikt rolgebaseerd toegangsbeheer (RBAC) via Supabase Row Level Security (RLS).</li>
                            <li>Continue logging van beveiligingsgerelateerde events (audit logs).</li>
                        </ul>
                        <h3 className="text-lg font-bold mt-6 mb-3">AI-verwerking (Mistral AI en Black Forest Labs)</h3>
                        <p>
                            Voor AI-ondersteuning gebruiken wij Mistral AI voor tekst, vision en OCR, en Black Forest Labs FLUX voor image generation.
                            Alle provider-aanroepen lopen server-side via Supabase Edge Functions. API keys, ruwe auditcontent en tijdelijke image delivery URL's
                            worden niet naar de browser gestuurd. Wij gebruiken deze gegevens niet voor marketingprofilering of modeltraining.
                            Gegevensdeling en retentie volgen de verwerkersafspraken en de instructies van de school.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">6. Bewaartermijnen</h2>
                        <ul>
                            <li><strong>Actieve accounts:</strong> Totdat de school de licentie beëindigt of het account verwijdert.</li>
                            <li><strong>Activiteitslogs:</strong> Maximaal 90 dagen voor audit-doeleinden.</li>
                            <li><strong>Verwijdering:</strong> Na opzegging door de school worden alle gegevens binnen 30 dagen definitief gewist uit back-ups.</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">7. Jouw Rechten</h2>
                        <p>
                            Betrokkenen (via de school als verantwoordelijke) hebben de volgende rechten:
                        </p>
                        <ul>
                            <li><strong>Inzage & Dataportabiliteit:</strong> Direct mogelijk via profielinstellingen.</li>
                            <li><strong>Verwijdering (Vergetelheid):</strong> Direct mogelijk via profielinstellingen.</li>
                            <li><strong>Rectificatie:</strong> De mogelijkheid om onjuiste gegevens te corrigeren.</li>
                            <li><strong>Beperking:</strong> Het recht om de verwerking tijdelijk te beperken (aan te vragen via privacy-instellingen).</li>
                            <li><strong>Bezwaar (Art. 21 AVG):</strong> Het recht om bezwaar te maken tegen verwerking op grond van gerechtvaardigd belang of voor directe marketing.</li>
                            <li><strong>Intrekking toestemming:</strong> Waar verwerking op toestemming berust, kunt u die te allen tijde intrekken zonder dat dit de rechtmatigheid van eerdere verwerking aantast.</li>
                        </ul>
                        <p className="mt-4">
                            Wij maken geen gebruik van geautomatiseerde besluitvorming of profilering die een rechtsgevolg of vergelijkbare wezenlijke impact heeft. Indien dit in de toekomst zou veranderen, gelden passende waarborgen en het recht op menselijke tussenkomst.
                        </p>
                        <p className="mt-4">
                            Mocht u van mening zijn dat wij niet correct omgaan met uw gegevens, dan heeft u het recht om een klacht in te dienen bij de <strong>Autoriteit Persoonsgegevens (AP)</strong> via <a href="https://autoriteitpersoonsgegevens.nl" className="text-duck-acid underline" target="_blank" rel="noopener noreferrer">hun website</a>.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">8. Contact</h2>
                        <p>
                            Voor vragen over privacy kunt u contact opnemen met uw school of rechtstreeks met ons via:
                        </p>
                        <div className="flex items-center gap-2 p-4 bg-duck-acid/20 rounded-xl border border-duck-acid w-fit">
                            <Mail size={18} className="text-duck-ink" />
                            <span className="font-bold text-duck-ink underline">privacy@dgskills.app</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
