import React, { useState } from 'react';
import { FileText, Download, ExternalLink, BookOpen, Search, ChevronRight } from 'lucide-react';

interface SloDocument {
    id: string;
    title: string;
    description: string;
    path: string;
    category: 'slo' | 'compliance' | 'handleiding';
    updatedAt: string;
    tags: string[];
    type?: 'pdf' | 'link';
}

const TEACHER_DOCUMENTS: SloDocument[] = [
    {
        id: 'slo-dg-kerndoelen-2025',
        title: 'SLO Definitieve Conceptkerndoelen Digitale Geletterdheid',
        description: 'Het officiële SLO-document met alle definitieve conceptkerndoelen voor digitale geletterdheid, inclusief toelichtingsdocument. Opgeleverd in 2025 aan het ministerie van OCW.',
        path: '/resources/SLO_definitieve_conceptkerndoelen_digitale_geletterdheid.pdf',
        category: 'slo',
        updatedAt: '2025-09-01',
        tags: ['SLO', 'Kerndoelen', 'Digitale Geletterdheid', '2025'],
        type: 'pdf',
    },
    {
        id: 'slo-kerndoelen-overzicht',
        title: 'SLO Kerndoelen Overzicht',
        description: 'Interactief overzicht van alle SLO-kerndoelen digitale geletterdheid, inclusief domeinindeling en leerjaarprogressie.',
        path: '/slo-kerndoelen-digitale-geletterdheid',
        category: 'slo',
        updatedAt: '2026-01-01',
        tags: ['SLO', 'Kerndoelen', 'Overzicht'],
        type: 'link',
    },
    {
        id: 'slo-dekkingsrapport',
        title: 'SLO Dekkingsrapport',
        description: 'Rapport dat toont welke SLO-kerndoelen worden gedekt door de DGSkills-missies, per domein en leerjaar.',
        path: '/compliance/slo-rapport',
        category: 'slo',
        updatedAt: '2026-01-01',
        tags: ['SLO', 'Dekking', 'Rapport', 'Missies'],
        type: 'link',
    },
    {
        id: 'dpa-verwerkersovereenkomst-v4',
        title: 'Verwerkersovereenkomst (DPA) v4.0',
        description: 'Model verwerkersovereenkomst conform AVG/GDPR voor gebruik van DGSkills op school. Versie 4.0 — gereed voor ondertekening.',
        path: '/compliance-hub',
        category: 'compliance',
        updatedAt: '2026-03-28',
        tags: ['DPA', 'AVG', 'Privacy', 'Verwerkersovereenkomst'],
        type: 'link',
    },
    {
        id: 'dpia-support',
        title: 'DPIA Support Document',
        description: 'Ondersteuningsdocument voor de Data Protection Impact Assessment (DPIA), inclusief gegevensstromen, risico-analyse en mitigerende maatregelen.',
        path: '/compliance-hub',
        category: 'compliance',
        updatedAt: '2026-03-28',
        tags: ['DPIA', 'Privacy', 'AVG', 'Risico'],
        type: 'link',
    },
    {
        id: 'ai-transparantieverklaring',
        title: 'AI-Transparantieverklaring',
        description: 'Verklaring over het gebruik van AI in DGSkills: welke modellen worden ingezet, hoe worden leerlingen begeleid, en welke menselijke toetsing is aanwezig.',
        path: '/ict/privacy/ai',
        category: 'compliance',
        updatedAt: '2026-03-28',
        tags: ['AI', 'Transparantie', 'EU AI Act', 'Leerlingen'],
        type: 'link',
    },
    {
        id: 'privacyverklaring',
        title: 'Privacyverklaring',
        description: 'Volledige privacyverklaring van DGSkills, inclusief gegevensverwerking, bewaartermijnen en rechten van betrokkenen (leerlingen en ouders).',
        path: '/ict/privacy/policy',
        category: 'compliance',
        updatedAt: '2026-03-28',
        tags: ['Privacy', 'AVG', 'Persoonsgegevens', 'Leerlingen'],
        type: 'link',
    },
    {
        id: 'implementatiegids-ict',
        title: 'Implementatiegids voor ICT',
        description: 'Stap-voor-stap handleiding voor ICT-coördinatoren: van aanmaken van klassen tot koppelen van leerlingen en instellen van rechten.',
        path: '/ict/implementatiegids',
        category: 'handleiding',
        updatedAt: '2026-01-01',
        tags: ['ICT', 'Implementatie', 'Handleiding', 'Onboarding'],
        type: 'link',
    },
    {
        id: 'technische-specificaties',
        title: 'Technische Specificaties',
        description: 'Overzicht van systeemvereisten, netwerkinstellingen, SSO-mogelijkheden en data-residency voor gebruik van DGSkills op schoolnetwerken.',
        path: '/ict/technisch',
        category: 'handleiding',
        updatedAt: '2026-01-01',
        tags: ['ICT', 'Technisch', 'SSO', 'Netwerk', 'Data Residency'],
        type: 'link',
    },
];

const CATEGORY_LABELS: Record<SloDocument['category'], string> = {
    slo: 'SLO Kerndoelen',
    compliance: 'Compliance',
    handleiding: 'Handleidingen',
};

const CATEGORY_COLORS: Record<SloDocument['category'], { bg: string; text: string; border: string; iconBg: string }> = {
    slo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', iconBg: 'bg-indigo-100' },
    compliance: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100' },
    handleiding: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', iconBg: 'bg-emerald-100' },
};

export const TeacherDocumentsPanel: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | SloDocument['category']>('all');
    const [previewDoc, setPreviewDoc] = useState<SloDocument | null>(null);

    const filteredDocs = TEACHER_DOCUMENTS.filter(doc => {
        const matchesSearch = !searchQuery ||
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(TEACHER_DOCUMENTS.map(d => d.category))] as ('all' | SloDocument['category'])[];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <BookOpen size={20} className="text-indigo-600" />
                            Documenten
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Officiële SLO-documenten en handleidingen voor docenten.
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Zoek documenten..."
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category filter */}
                {categories.length > 2 && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === cat
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {cat === 'all' ? 'Alles' : CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Document cards */}
            <div className="grid grid-cols-1 gap-4">
                {filteredDocs.map(doc => {
                    const colors = CATEGORY_COLORS[doc.category];
                    return (
                        <div
                            key={doc.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Icon area */}
                                <div className={`${colors.bg} p-6 flex items-center justify-center md:w-32 shrink-0`}>
                                    <div className={`${colors.iconBg} p-4 rounded-xl`}>
                                        <FileText size={32} className={colors.text} strokeWidth={1.5} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                                    {CATEGORY_LABELS[doc.category]}
                                                </span>
                                                {(doc.type === 'pdf' || !doc.type) && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                                                    PDF
                                                </span>
                                            )}
                                            {doc.type === 'link' && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-600">
                                                    Online
                                                </span>
                                            )}
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 leading-tight">
                                                {doc.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {doc.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {doc.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tight">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                                        <span className="text-xs text-slate-400">
                                            Bijgewerkt: {new Date(doc.updatedAt).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                        <div className="flex gap-2">
                                            {doc.type === 'link' ? (
                                                <a
                                                    href={doc.path}
                                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                >
                                                    <ExternalLink size={14} />
                                                    Openen
                                                </a>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setPreviewDoc(previewDoc?.id === doc.id ? null : doc)}
                                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                    >
                                                        <ExternalLink size={14} />
                                                        Bekijken
                                                    </button>
                                                    <a
                                                        href={doc.path}
                                                        download
                                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                                                    >
                                                        <Download size={14} />
                                                        Download
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inline PDF preview */}
                            {previewDoc?.id === doc.id && (
                                <div className="border-t border-slate-200">
                                    <iframe
                                        src={doc.path}
                                        className="w-full h-[70vh] bg-slate-50"
                                        title={doc.title}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredDocs.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                    <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Geen documenten gevonden</p>
                    <p className="text-sm text-slate-400 mt-1">Probeer een andere zoekterm of categorie.</p>
                </div>
            )}

            {/* Info banner */}
            <div className="bg-indigo-50 rounded-2xl p-5 flex items-start gap-4 border border-indigo-100">
                <div className="bg-indigo-100 p-2 rounded-xl shrink-0">
                    <BookOpen size={20} className="text-indigo-600" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">Over de SLO Kerndoelen</h4>
                    <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
                        De definitieve conceptkerndoelen voor digitale geletterdheid zijn in 2025 opgeleverd door SLO aan het ministerie van OCW.
                        DGSkills dekt alle vier domeinen af: Digitale vaardigheden, Informatievaardigheden, Mediawijsheid en Computational Thinking.
                    </p>
                    <button
                        onClick={() => {
                            const sloDoc = TEACHER_DOCUMENTS.find(d => d.category === 'slo');
                            if (sloDoc) setPreviewDoc(sloDoc);
                        }}
                        className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                        Bekijk het kerndoelendocument
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
