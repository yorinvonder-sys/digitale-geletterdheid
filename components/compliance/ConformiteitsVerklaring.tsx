/**
 * ConformiteitsVerklaring — On-demand EU AI Act conformiteitsverklaring.
 *
 * Annex IV-gebaseerd document voor DGSkills.app (HIGH RISK, Annex III 3(b)).
 * Gerenderd via createPortal + .print-section klasse zodat browser-print
 * alleen dit document toont; de rest van de app wordt weggefilterd door
 * de CSS in index.css (body > *:not(.print-section) { display:none }).
 *
 * Auto-gedateerd; versie "1.0" tot content substantieel wijzigt.
 */
import React from 'react';
import { createPortal } from 'react-dom';
import { Printer, ArrowLeft, FileCheck } from 'lucide-react';

export interface ConformiteitsVerklaringProps {
    onClose?: () => void;
}

const vandaag = (): string =>
    new Date().toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' });

const serifStyle = { fontFamily: "'Newsreader', Georgia, serif" } as const;

export const ConformiteitsVerklaring: React.FC<ConformiteitsVerklaringProps> = ({ onClose }) => {
    if (typeof document === 'undefined') return null;
    const datum = vandaag();

    const handlePrint = () => window.print();

    return createPortal(
        <div
            className="print-section fixed inset-0 z-[90] bg-white overflow-y-auto print:static print:inset-auto print:overflow-visible"
            role="dialog"
            aria-labelledby="conformiteit-title"
        >
            <style>{`@page { size: A4; margin: 16mm; }`}</style>
            {/* Toolbar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 bg-white border-b border-slate-200 print:hidden">
                <div className="flex items-center gap-2">
                    {onClose ? (
                        <button onClick={onClose} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
                            <ArrowLeft size={14} /> Compliance Hub
                        </button>
                    ) : (
                        <a href="/compliance-hub" className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
                            <ArrowLeft size={14} /> Compliance Hub
                        </a>
                    )}
                    <span className="text-xs text-slate-500 hidden md:inline">EU AI Act Annex IV — Conformiteitsverklaring</span>
                </div>
                <button onClick={handlePrint} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                    <Printer size={14} /> Printen / opslaan als PDF
                </button>
            </div>

            {/* Document */}
            <article className="max-w-[210mm] mx-auto bg-white px-6 md:px-12 py-10 text-slate-800 leading-relaxed print:max-w-none print:p-0">
                <header className="border-b-2 border-slate-900 pb-4 mb-8 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                        <FileCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest uppercase text-indigo-600">EU AI Act — Annex IV</p>
                        <h1 id="conformiteit-title" className="text-2xl md:text-3xl font-bold text-slate-900" style={serifStyle}>
                            Conformiteitsverklaring — DGSkills.app
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">Versie 1.0 · {datum}</p>
                    </div>
                </header>

                {/* 1 */}
                <Section n={1} title="Algemene identificatie">
                    <table className="w-full text-sm">
                        <tbody>
                            {[
                                ['Productnaam', 'DGSkills.app'],
                                ['Aanbieder', 'Yorin Vonder (eenmanszaak DGSkills.app)'],
                                ['KvK', '81819889'],
                                ['Contact', 'info@dgskills.app'],
                                ['Privacy Officer (FG)', 'privacy@dgskills.app'],
                                ['Documentversie', `1.0 — ${datum}`],
                                ['Geldig vanaf', datum],
                                ['AI Act classificatie', 'HIGH RISK — Annex III punt 3(b)'],
                            ].map(([k, v]) => (
                                <tr key={k} className="border-b border-slate-100">
                                    <td className="py-1.5 pr-4 font-semibold text-slate-700 w-52">{k}</td>
                                    <td className="py-1.5 text-slate-800">{v}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>

                {/* 2 */}
                <Section n={2} title="Beschrijving van het AI-systeem">
                    <p>DGSkills.app ondersteunt digitale geletterdheid in het Nederlandse voortgezet onderwijs. De doelgroep betreft leerlingen van 12–18 jaar (vmbo/mavo/havo/vwo) en hun docenten. Het systeem fungeert als AI-copiloot voor missies, SLO-dekkingsanalyse en assessment-begeleiding.</p>
                    <p className="mt-2">Technologie: Google Gemini 2.0 Flash via Google Vertex AI (europe-west4), gebouwd op React 19 + Supabase. Dataresidentie: Europese Unie (Nederland). Er vinden geen AI-interacties plaats buiten de EU.</p>
                </Section>

                {/* 3 */}
                <Section n={3} title="Trainingsdata en inputdata">
                    <p>Het AI-model wordt niet getraind op klantdata (Zero-Training Guarantee via de Google Cloud DPA met Standard Contractual Clauses). Inputdata van leerlingen wordt server-side gesanitized via <code>promptSanitizer.ts</code> (40+ patronen NL+EN, homoglyph-normalisatie). Data-minimalisatie is vastgelegd in de DPIA (geen BSN, geen adresgegevens, geen etniciteit).</p>
                </Section>

                {/* 4 */}
                <Section n={4} title="Risk management (Art. 9)">
                    <p>Een continu risicobeheerssysteem wordt onderhouden conform Art. 9(1). Het risicoregister omvat twintig gedocumenteerde risico's (R01–R20) verdeeld over zeven categorieën: veiligheid, bias, privacy, operationeel, juridisch, ai-bias en algoritmische discriminatie. Review-cyclus: per kwartaal of bij incident. Risico's worden gescoord op Waarschijnlijkheid × Impact (1–25), met classificatie laag / midden / hoog / kritiek.</p>
                </Section>

                {/* 5 */}
                <Section n={5} title="Data governance (Art. 10)">
                    <p>AVG-compliance: DPIA uitgevoerd, verwerkersovereenkomst (DPA Model 4.0) beschikbaar, ouderlijke toestemming vereist voor leerlingen &lt;16 (Art. 8 AVG / UAVG). Bias-beheersing via server-side prompt-sanitization en periodieke biastesting per onderwijsniveau. Retentie en verwijdering conform DPIA.</p>
                </Section>

                {/* 6 */}
                <Section n={6} title="Transparantie (Art. 13)">
                    <p>Elke AI-interactie is voor leerlingen en docenten herkenbaar via een zichtbare AiDisclosureBadge. De AI-transparantieverklaring is publiek beschikbaar op <code>/ict/privacy/ai</code>. Docenten zien in het SLO-rapport welke beoordelingen AI-gegenereerd zijn.</p>
                </Section>

                {/* 7 */}
                <Section n={7} title="Human oversight (Art. 14)">
                    <p>Docenten kunnen AI-uitgerekende SLO-percentages overrulen met verplichte reden (min. 10 tekens). Elke override wordt gelogd in de tabel <code>ai_oversight_events</code> met AI-waarde, override-waarde, reden en timestamp. Escalatiemogelijkheid voor leerlingen en ouders via <code>privacy@dgskills.app</code>.</p>
                </Section>

                {/* 8 */}
                <Section n={8} title="Accuraatheid, robuustheid, cybersecurity (Art. 15)">
                    <ul className="list-disc list-outside pl-5 space-y-1">
                        <li>Prompt-injection-bescherming met 40+ patronen (NL+EN), homoglyph-normalisatie, server-side sanitization.</li>
                        <li>Rate limiting op alle AI-endpoints (15 requests per minuut per gebruiker, durable rate limiter).</li>
                        <li>HTTPS-only, Content Security Policy (CSP) headers zonder <code>unsafe-inline</code> of <code>unsafe-eval</code>.</li>
                        <li>Multi-Factor Authentication (AAL2) verplicht voor docenten en admins.</li>
                        <li>Laatste security audit: <code>docs/security/security-audit-rapport-dgskills.md</code>.</li>
                    </ul>
                </Section>

                {/* 9 */}
                <Section n={9} title="Beveiligingsmaatregelen (Art. 32 AVG)">
                    <p>EU-hosting: Vercel edge (frontend) en Supabase europe-west4 (backend + database). Toegangscontrole via Supabase Row Level Security (RLS) en role-based permissions. Audit logging via de tabel <code>ai_oversight_events</code> (Art. 12). Encryption: TLS 1.2+ in transit, at-rest versleuteling door Supabase.</p>
                </Section>

                {/* 10 */}
                <Section n={10} title="Logging en monitoring (Art. 12)">
                    <p>Alle AI-interacties, SLO-bepalingen en docent-overrides worden gelogd als gestructureerde events met school-scoped RLS. Retentieduur conform DPIA. Schoolbesturen en ICT-coördinatoren hebben via het docent-dashboard inzage in AI-beoordelingen en overrides van de eigen school.</p>
                </Section>

                {/* 11 */}
                <Section n={11} title="Procedures voor wijzigingen">
                    <p>Versiebeheer via Git (<code>yorinvonder-sys/digitale-geletterdheid</code>). Elke wijziging aan het AI-systeem, prompts of RLS-policies loopt via een pull request met code-review. Pre-release security audit is verplicht. Deployment-logs vormen het auditspoor.</p>
                </Section>

                {/* 12 */}
                <Section n={12} title="Conformiteitsverklaring">
                    <div className="border-2 border-slate-900 bg-slate-50 rounded-lg p-4 my-3">
                        <p className="text-sm">
                            DGSkills.app verklaart dat bovenstaand AI-systeem op de datum van dit document voldoet aan de verplichtingen van de EU AI Act voor hoog-risico AI-systemen (Verordening EU 2024/1689), Annex III punt 3(b), gemeten naar de dan geldende interpretatie. Deze verklaring is opgesteld op basis van interne audits en documentatie, en vervangt geen externe conformiteitsbeoordeling door een Notified Body waar deze door de AI Act wordt vereist. Deadline voor volledige hoog-risico conformiteit: <strong>2 augustus 2026</strong>.
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p><strong>Naam:</strong> Yorin Vonder</p>
                                <p><strong>Rol:</strong> Oprichter &amp; Privacy Officer, DGSkills.app</p>
                                <p><strong>Datum:</strong> {datum}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-6">Handtekening:</p>
                                <div className="border-b border-slate-400 h-10"></div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* 13 */}
                <Section n={13} title="Referenties">
                    <ul className="list-disc list-outside pl-5 text-sm space-y-0.5">
                        <li><a href="/compliance-hub" className="text-indigo-600 hover:underline print:text-slate-700 print:no-underline">Compliance Hub (app)</a></li>
                        <li><a href="/ict/privacy" className="text-indigo-600 hover:underline print:text-slate-700 print:no-underline">Privacyverklaring</a></li>
                        <li><a href="/ict/privacy/ai" className="text-indigo-600 hover:underline print:text-slate-700 print:no-underline">AI-transparantieverklaring</a></li>
                        <li><a href="/ict/algemene-voorwaarden" className="text-indigo-600 hover:underline print:text-slate-700 print:no-underline">Algemene voorwaarden</a></li>
                        <li><code>business/nl-vo/compliance/dpia-dgskills-compleet.md</code> — DPIA</li>
                        <li><code>business/nl-vo/compliance/risicoregister-ai-act.md</code> — Risicoregister Art. 9</li>
                        <li><code>business/nl-vo/compliance/annex-iv-technische-documentatie.md</code> — Technische documentatie</li>
                        <li><code>business/nl-vo/compliance/eu-ai-act-conformiteitsplan.md</code> — Conformiteitsplan</li>
                        <li><code>docs/security/security-audit-rapport-dgskills.md</code> — Security audit</li>
                    </ul>
                </Section>

                <footer className="mt-10 pt-4 border-t border-slate-200 text-[10px] text-slate-400">
                    DGSkills.app · KvK 81819889 · © {new Date().getFullYear()} · Dit document is opgesteld conform EU AI Act Annex IV en is bedoeld voor interne audits, aanbestedingen en toezichthoudende inzage.
                </footer>
            </article>
        </div>,
        document.body,
    );
};

const Section: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
    <section className="mb-6 print:break-inside-avoid">
        <h2 className="text-lg font-bold text-slate-900 mb-2" style={serifStyle}>
            {n}. {title}
        </h2>
        <div className="text-sm">{children}</div>
    </section>
);
