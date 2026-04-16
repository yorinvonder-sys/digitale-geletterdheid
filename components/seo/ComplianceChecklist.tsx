import React, { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../../services/analyticsService';

type Responsibility = 'school' | 'leverancier' | 'samen';

interface ChecklistItem {
    id: string;
    label: string;
    responsibility: Responsibility;
    reference?: string;
    note?: string;
}

interface ChecklistSection {
    id: string;
    title: string;
    intro?: string;
    items: ChecklistItem[];
}

const RESPONSIBILITY_LABEL: Record<Responsibility, string> = {
    school: 'School',
    leverancier: 'Leverancier',
    samen: 'Samen',
};

const RESPONSIBILITY_CLASSES: Record<Responsibility, string> = {
    school: 'bg-emerald-50 text-emerald-700',
    leverancier: 'bg-indigo-50 text-indigo-700',
    samen: 'bg-amber-50 text-amber-700',
};

const SECTIONS: ChecklistSection[] = [
    {
        id: 'juridisch',
        title: '1. Juridische basis & DPA',
        intro: 'Zorg dat de rolverdeling en het juridisch fundament op orde zijn voor ingebruikname.',
        items: [
            {
                id: 'dpa-signed',
                label: 'Er is een ondertekende Verwerkersovereenkomst (Model 4.0) tussen school en leverancier.',
                responsibility: 'samen',
                reference: 'AVG Art. 28 · Privacyconvenant Onderwijs',
            },
            {
                id: 'role-clarity',
                label: 'De rolverdeling verwerkingsverantwoordelijke (school) en verwerker (leverancier) is expliciet vastgelegd.',
                responsibility: 'samen',
                reference: 'AVG Art. 4(7)-(8)',
            },
            {
                id: 'verwerkingsregister',
                label: 'Het gebruik van DGSkills is opgenomen in het verwerkingsregister van de school.',
                responsibility: 'school',
                reference: 'AVG Art. 30',
            },
            {
                id: 'rechtsgrondslag',
                label: 'De rechtsgrondslag voor verwerking is vastgelegd (meestal publieke taak, art. 6(1)(e)).',
                responsibility: 'school',
                reference: 'AVG Art. 6',
            },
            {
                id: 'subverwerkers',
                label: 'De leverancier heeft een actuele subverwerkerslijst verstrekt en meldt wijzigingen vooraf.',
                responsibility: 'leverancier',
                reference: 'AVG Art. 28(2)',
            },
        ],
    },
    {
        id: 'data-privacy',
        title: '2. Data & Privacy',
        intro: 'Minimaliseer gegevens en zorg dat opslag, transport en retentie binnen de kaders vallen.',
        items: [
            {
                id: 'data-eea',
                label: 'Alle persoonsgegevens worden opgeslagen en verwerkt binnen de EER.',
                responsibility: 'leverancier',
                reference: 'AVG Art. 44-50',
                note: 'DGSkills gebruikt Google Cloud europe-west4 (Nederland).',
            },
            {
                id: 'data-min',
                label: 'Alleen de noodzakelijke gegevens worden verwerkt (geen BSN, geen medische gegevens, geen thuissituatie).',
                responsibility: 'samen',
                reference: 'AVG Art. 5(1)(c)',
            },
            {
                id: 'retention',
                label: 'Bewaartermijnen zijn vastgelegd en automatische opschoning is ingericht.',
                responsibility: 'samen',
                reference: 'AVG Art. 5(1)(e)',
            },
            {
                id: 'tls',
                label: 'Al het dataverkeer gaat via TLS/HTTPS en de verbindingen voldoen aan actuele standaarden.',
                responsibility: 'leverancier',
                reference: 'AVG Art. 32',
            },
            {
                id: 'zero-training',
                label: 'Input van leerlingen en docenten wordt niet gebruikt voor het trainen van commerciële AI-modellen.',
                responsibility: 'leverancier',
                reference: 'Privacy-by-design',
            },
            {
                id: 'data-subject-rights',
                label: 'Inzage, correctie, export en verwijdering zijn mogelijk binnen de reguliere AVG-termijnen.',
                responsibility: 'samen',
                reference: 'AVG Art. 15-22',
            },
        ],
    },
    {
        id: 'dpia',
        title: '3. DPIA & minderjarigen',
        intro: 'DGSkills verwerkt gegevens van minderjarigen in een AI-context; een DPIA is verplicht voor de school.',
        items: [
            {
                id: 'dpia-done',
                label: 'De school heeft vóór ingebruikname een DPIA uitgevoerd.',
                responsibility: 'school',
                reference: 'AVG Art. 35',
            },
            {
                id: 'dpia-support',
                label: 'De leverancier heeft DPIA-ondersteuningsinformatie beschikbaar gesteld (datacategorieën, doelen, risico-inschattingen).',
                responsibility: 'leverancier',
                reference: 'AVG Art. 35(7) · AI Act Art. 26(9)',
            },
            {
                id: 'minderjarigen',
                label: 'De DPIA bevat een specifieke paragraaf over risico’s voor minderjarigen.',
                responsibility: 'school',
                reference: 'AVG Art. 8 · AI Act Art. 9(9)',
            },
            {
                id: 'informatieplicht',
                label: 'Leerlingen en ouders zijn geïnformeerd dat het platform een AI-systeem is en waarvoor het gebruikt wordt.',
                responsibility: 'school',
                reference: 'AI Act Art. 26(7) · AVG Art. 13',
            },
        ],
    },
    {
        id: 'ai-act',
        title: '4. AI Act — transparantie & menselijk toezicht',
        intro: 'DGSkills valt onder hoog risico (EU AI Act Annex III, punt 3(b)). Deadline hoog-risico verplichtingen: 2 augustus 2026.',
        items: [
            {
                id: 'ai-disclosure',
                label: 'Voor leerlingen is duidelijk zichtbaar dat ze met een AI-systeem communiceren.',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 50(1)',
            },
            {
                id: 'output-label',
                label: 'AI-gegenereerde output is als zodanig herkenbaar (label of disclaimer).',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 50(2)',
            },
            {
                id: 'ai-literacy',
                label: 'Docenten en leerlingen krijgen uitleg over beperkingen, hallucinaties en menselijke controle.',
                responsibility: 'samen',
                reference: 'AI Act Art. 4',
            },
            {
                id: 'teacher-oversight',
                label: 'De docent heeft inzicht in AI-interacties van leerlingen en kan tussentijds bijsturen.',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 14(1)-(2)',
            },
            {
                id: 'teacher-override',
                label: 'De docent behoudt de eindbeslissing bij beoordeling en kan een AI-uitkomst overrulen.',
                responsibility: 'samen',
                reference: 'AI Act Art. 14(3)-(4)',
            },
            {
                id: 'automation-bias',
                label: 'Er zijn maatregelen tegen automation bias (overmatig vertrouwen op AI bij beoordelingen).',
                responsibility: 'samen',
                reference: 'AI Act Art. 14(4)(b)',
                note: 'Aandachtspunt voor augustus 2026: expliciet beleid per school.',
            },
        ],
    },
    {
        id: 'beveiliging',
        title: '5. Beveiliging & veiligheid',
        intro: 'Technische en organisatorische maatregelen voor veilig gebruik in de klas.',
        items: [
            {
                id: 'safety-filters',
                label: 'Safety filters zijn actief op schadelijke en leeftijdsongeschikte content.',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 9(9)',
            },
            {
                id: 'sso',
                label: 'SSO via Microsoft of Google is correct geconfigureerd; toegang via schoolaccount.',
                responsibility: 'samen',
                reference: 'AVG Art. 32',
            },
            {
                id: 'mfa',
                label: 'Meerfactorauthenticatie (MFA/AAL2) is verplicht voor docent- en beheerrollen.',
                responsibility: 'samen',
                reference: 'AVG Art. 32',
            },
            {
                id: 'incident-response',
                label: 'De leverancier heeft een datalek- en incidentresponseprocedure met responstijden.',
                responsibility: 'leverancier',
                reference: 'AVG Art. 33-34 · AI Act Art. 73',
            },
            {
                id: 'ai-cybersecurity',
                label: 'Er zijn maatregelen tegen AI-specifieke aanvallen (prompt injection, data poisoning).',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 15(5)',
            },
            {
                id: 'logging',
                label: 'Relevante gebeurtenissen worden automatisch gelogd en voor een passende periode bewaard.',
                responsibility: 'leverancier',
                reference: 'AI Act Art. 12',
                note: 'Volledige Art. 12 logging wordt uitgebreid vóór 2 augustus 2026.',
            },
        ],
    },
    {
        id: 'didactiek',
        title: '6. Didactiek & curriculum',
        intro: 'Zorg dat de inzet in de klas aansluit bij de SLO-kerndoelen en onderwijs-specifieke afspraken.',
        items: [
            {
                id: 'slo',
                label: 'De leerlijn is gekoppeld aan de SLO-kerndoelen digitale geletterdheid.',
                responsibility: 'leverancier',
                reference: 'SLO-kerndoelen DG',
            },
            {
                id: 'teacher-dashboard',
                label: 'De docent kan voortgang per leerling en per klas inzien.',
                responsibility: 'leverancier',
            },
            {
                id: 'assessment',
                label: 'Beoordelingen van leerlingen zijn valideerbaar door de docent en niet alleen door het AI-systeem.',
                responsibility: 'samen',
                reference: 'AI Act Art. 14(3)',
            },
            {
                id: 'geen-commercie',
                label: 'Er vindt geen commerciële profilering plaats van minderjarigen en er zijn geen advertenties.',
                responsibility: 'leverancier',
                reference: 'Privacyconvenant Onderwijs',
            },
        ],
    },
];

const TOTAL_ITEMS = SECTIONS.reduce((acc, s) => acc + s.items.length, 0);

const CheckBox: React.FC<{ checked: boolean; onToggle: () => void; id: string }> = ({
    checked,
    onToggle,
    id,
}) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 border-2 rounded flex items-center justify-center shrink-0 transition-colors no-print ${
            checked
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-indigo-200 text-transparent hover:border-indigo-400'
        }`}
    >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    </button>
);

const PrintBox: React.FC<{ checked: boolean }> = ({ checked }) => (
    <span
        aria-hidden="true"
        className={`hidden print:inline-block w-4 h-4 border border-slate-400 mr-2 align-middle ${
            checked ? 'bg-slate-900' : ''
        }`}
    />
);

const Badge: React.FC<{ responsibility: Responsibility }> = ({ responsibility }) => (
    <span
        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide ${RESPONSIBILITY_CLASSES[responsibility]}`}
    >
        {RESPONSIBILITY_LABEL[responsibility]}
    </span>
);

export const ComplianceChecklist: React.FC = () => {
    const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'AI-Compliance Checklist voor VO Scholen | DGSkills';
        trackEvent('seo_asset_view', { page: 'compliance-checklist' });

        return () => {
            document.title = originalTitle;
        };
    }, []);

    const toggle = (id: string) => {
        setCheckedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const progress = useMemo(() => {
        const done = checkedIds.size;
        return { done, total: TOTAL_ITEMS, pct: Math.round((done / TOTAL_ITEMS) * 100) };
    }, [checkedIds]);

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            AI-Compliance Checklist VO
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Versie 2026.2 — gebaseerd op AVG, EU AI Act en Privacyconvenant Onderwijs
                        </p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors no-print self-start"
                    >
                        Print / Opslaan als PDF
                    </button>
                </div>

                <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-sm text-slate-700 mb-3">
                        Gebruik deze checklist bij inkoop, ingebruikname en de periodieke review van
                        een AI-leermiddel in het voortgezet onderwijs. DGSkills valt onder{' '}
                        <strong>hoog risico</strong> volgens de EU AI Act (Annex III, punt 3(b)) —
                        deadline 2 augustus 2026.
                    </p>
                    <div className="flex flex-wrap gap-2 items-center text-xs">
                        <span className="text-slate-500">Verantwoordelijkheid:</span>
                        <Badge responsibility="school" />
                        <Badge responsibility="leverancier" />
                        <Badge responsibility="samen" />
                    </div>
                </div>

                <div className="mb-8 no-print">
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-semibold text-slate-700">
                            Voortgang: {progress.done} / {progress.total} gecontroleerd
                        </span>
                        <span className="text-slate-500">{progress.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all"
                            style={{ width: `${progress.pct}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic">
                        Voortgang wordt niet bewaard — print of exporteer je versie.
                    </p>
                </div>

                <div className="space-y-10">
                    {SECTIONS.map((section) => (
                        <section key={section.id} id={section.id}>
                            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">
                                {section.title}
                            </h2>
                            {section.intro && (
                                <p className="text-sm text-slate-500 mb-4">{section.intro}</p>
                            )}
                            <ul className="list-none p-0 space-y-1">
                                {section.items.map((item) => {
                                    const isChecked = checkedIds.has(item.id);
                                    return (
                                        <li
                                            key={item.id}
                                            className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0"
                                        >
                                            <CheckBox
                                                id={item.id}
                                                checked={isChecked}
                                                onToggle={() => toggle(item.id)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-start gap-2 mb-1">
                                                    <PrintBox checked={isChecked} />
                                                    <span
                                                        id={`${item.id}-label`}
                                                        className="text-slate-700 text-sm flex-1"
                                                    >
                                                        {item.label}
                                                    </span>
                                                    <Badge responsibility={item.responsibility} />
                                                </div>
                                                {(item.reference || item.note) && (
                                                    <div className="text-xs text-slate-400 mt-1 space-x-2">
                                                        {item.reference && (
                                                            <span className="font-mono">
                                                                {item.reference}
                                                            </span>
                                                        )}
                                                        {item.note && (
                                                            <span className="italic">
                                                                · {item.note}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400 mb-4 italic max-w-lg mx-auto">
                        Deze checklist is een hulpmiddel en vervangt geen juridisch advies van je
                        functionaris gegevensbescherming. Voor een compleet compliance-dossier: zie
                        de{' '}
                        <a
                            href="/compliance-hub"
                            className="text-indigo-500 hover:text-indigo-700 underline"
                        >
                            Compliance Hub
                        </a>
                        .
                    </p>
                    <a href="/" className="text-indigo-600 font-bold text-sm">
                        dgskills.app
                    </a>
                </div>
            </div>
        </div>
    );
};
