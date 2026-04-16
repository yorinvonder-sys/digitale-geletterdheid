/**
 * AdminRiskRegister — EU AI Act Art. 9 risicoregister (admin-only).
 *
 * Toont gestructureerd risicoregister met filters, stats en CSV-export.
 * Source of truth: config/aiActRiskRegister.ts (statisch, gesynchroniseerd
 * met business/nl-vo/compliance/risicoregister-ai-act.md).
 *
 * Admin-check: role === 'developer' || role === 'admin'.
 */
import React, { useMemo, useState, useCallback } from 'react';
import {
    ShieldCheck, AlertTriangle, Filter, Download, ArrowLeft, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { ParentUser } from '../../types';
import {
    calculateScore,
    classifyScore,
    RISK_REGISTER_VERSION,
    RISK_REGISTER_LAST_UPDATED,
    type AiActRisk,
    type RiskCategory,
    type RiskStatus,
    type ScoreClass,
} from '../../config/aiActRiskRegister';
import { getAllRisks, summariseRiskPosture } from '../../services/riskRegisterService';

export interface AdminRiskRegisterProps {
    user: ParentUser;
    onBack?: () => void;
}

const CATEGORY_LABELS: Record<RiskCategory, string> = {
    'veiligheid': 'Veiligheid',
    'bias': 'Bias',
    'privacy': 'Privacy',
    'operationeel': 'Operationeel',
    'juridisch': 'Juridisch',
    'ai-bias': 'AI-bias',
    'algoritmische-discriminatie': 'Algoritmische discriminatie',
};

const STATUS_LABELS: Record<RiskStatus, string> = {
    'beheerst': 'Beheerst',
    'actief': 'Actief',
    'onvoldoende-beheerst': 'Onvoldoende beheerst',
    'non-compliant': 'Non-compliant',
};

const STATUS_BADGE: Record<RiskStatus, string> = {
    'beheerst': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'actief': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'onvoldoende-beheerst': 'bg-amber-50 text-amber-700 border-amber-200',
    'non-compliant': 'bg-rose-50 text-rose-700 border-rose-200',
};

const SCORE_COLORS: Record<ScoreClass, string> = {
    'laag': 'bg-emerald-100 text-emerald-800',
    'midden': 'bg-amber-100 text-amber-800',
    'hoog': 'bg-orange-100 text-orange-800',
    'kritiek': 'bg-rose-100 text-rose-800',
};

function csvEscape(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
}

export const AdminRiskRegister: React.FC<AdminRiskRegisterProps> = ({ user, onBack }) => {
    const [categoryFilter, setCategoryFilter] = useState<RiskCategory | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<RiskStatus | 'all'>('all');
    const [scoreFilter, setScoreFilter] = useState<ScoreClass | 'all'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const isAdmin = user.role === 'developer' || user.role === 'admin';
    const posture = useMemo(() => summariseRiskPosture(), []);
    const allRisks = useMemo(() => getAllRisks(), []);

    const filteredRisks = useMemo(() => {
        return allRisks.filter((r) => {
            if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            if (scoreFilter !== 'all' && classifyScore(calculateScore(r)) !== scoreFilter) return false;
            return true;
        });
    }, [allRisks, categoryFilter, statusFilter, scoreFilter]);

    const today = useMemo(() => new Date(), []);
    const todayYmd = today.toISOString().slice(0, 10);

    const handleExportCsv = useCallback(() => {
        const header = ['id', 'title', 'category', 'likelihood', 'impact', 'score', 'class',
            'status', 'owner', 'lastReview', 'nextReviewDue', 'mitigations', 'residualRisk', 'aiActArticle'];
        const lines = [header.join(',')];
        for (const r of filteredRisks) {
            const score = calculateScore(r);
            lines.push([
                csvEscape(r.id), csvEscape(r.title), csvEscape(r.category),
                csvEscape(r.likelihood), csvEscape(r.impact), csvEscape(score),
                csvEscape(classifyScore(score)), csvEscape(r.status), csvEscape(r.owner),
                csvEscape(r.lastReview), csvEscape(r.nextReviewDue),
                csvEscape(r.mitigations.join('; ')), csvEscape(r.residualRisk),
                csvEscape(r.aiActArticle || ''),
            ].join(','));
        }
        const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AI_Act_Risicoregister_${todayYmd}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [filteredRisks, todayYmd]);

    const resetFilters = useCallback(() => {
        setCategoryFilter('all');
        setStatusFilter('all');
        setScoreFilter('all');
    }, []);

    if (!isAdmin) {
        return (
            <div className="max-w-2xl mx-auto mt-16 p-6 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="font-semibold text-amber-800">Geen toegang</p>
                    <p className="text-sm text-amber-700 mt-1">
                        Het EU AI Act risicoregister is alleen beschikbaar voor platform-developers en admins.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900">EU AI Act Art. 9 — Risicoregister</h1>
                        <p className="text-xs text-slate-500">Versie {RISK_REGISTER_VERSION} · Laatst bijgewerkt {RISK_REGISTER_LAST_UPDATED}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {onBack && (
                        <button onClick={onBack} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg">
                            <ArrowLeft size={14} /> Compliance Hub
                        </button>
                    )}
                    <button onClick={handleExportCsv} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">
                        <Download size={14} /> Download CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                <StatBlock label="Totaal" value={posture.total} tone="neutral" />
                <StatBlock label="Open" value={posture.open} tone="neutral" />
                <StatBlock label="Onder controle" value={posture.underControl} tone="success" />
                <StatBlock label="Non-compliant" value={posture.nonCompliant} tone="danger" />
                <StatBlock label="Achterstallig" value={posture.overdueReviews} tone="warn" />
                <StatBlock label="Kritiek + Hoog" value={posture.criticalCount + posture.highCount} tone="danger" />
            </div>

            {/* Filter bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600"><Filter size={12} /> Filters:</span>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as RiskCategory | 'all')} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white" aria-label="Filter op categorie">
                    <option value="all">Alle categorieën</option>
                    {(Object.keys(CATEGORY_LABELS) as RiskCategory[]).map((c) => (<option key={c} value={c}>{CATEGORY_LABELS[c]}</option>))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RiskStatus | 'all')} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white" aria-label="Filter op status">
                    <option value="all">Alle statussen</option>
                    {(Object.keys(STATUS_LABELS) as RiskStatus[]).map((s) => (<option key={s} value={s}>{STATUS_LABELS[s]}</option>))}
                </select>
                <select value={scoreFilter} onChange={(e) => setScoreFilter(e.target.value as ScoreClass | 'all')} className="text-xs border border-slate-200 rounded px-2 py-1 bg-white" aria-label="Filter op score-klasse">
                    <option value="all">Alle scores</option>
                    <option value="laag">Laag (1-4)</option>
                    <option value="midden">Midden (5-9)</option>
                    <option value="hoog">Hoog (10-15)</option>
                    <option value="kritiek">Kritiek (16-25)</option>
                </select>
                <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-slate-900 underline ml-auto">Reset filters</button>
                <span className="text-xs text-slate-500">{filteredRisks.length} van {allRisks.length}</span>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-xs uppercase text-slate-500">
                            <th className="text-left px-3 py-2">ID</th>
                            <th className="text-left px-3 py-2">Titel</th>
                            <th className="text-left px-3 py-2">Categorie</th>
                            <th className="text-center px-3 py-2">W×I</th>
                            <th className="text-center px-3 py-2">Score</th>
                            <th className="text-left px-3 py-2">Status</th>
                            <th className="text-left px-3 py-2">Volgende review</th>
                            <th className="w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRisks.map((r) => {
                            const score = calculateScore(r);
                            const cls = classifyScore(score);
                            const overdue = new Date(r.nextReviewDue) < today;
                            const expanded = expandedId === r.id;
                            return (
                                <React.Fragment key={r.id}>
                                    <tr
                                        className="border-b border-slate-100 hover:bg-indigo-50/40 cursor-pointer"
                                        onClick={() => setExpandedId(expanded ? null : r.id)}
                                        role="button"
                                        tabIndex={0}
                                        aria-expanded={expanded}
                                        aria-label={`Details voor risico ${r.id}`}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expanded ? null : r.id); } }}
                                    >
                                        <td className="px-3 py-2 font-mono text-xs text-slate-600">{r.id}</td>
                                        <td className="px-3 py-2 font-medium text-slate-900">{r.title}</td>
                                        <td className="px-3 py-2 text-xs text-slate-600">{CATEGORY_LABELS[r.category]}</td>
                                        <td className="px-3 py-2 text-center text-xs text-slate-500">{r.likelihood}×{r.impact}</td>
                                        <td className="px-3 py-2 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${SCORE_COLORS[cls]}`}>{score}</span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className={`inline-block px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[r.status]}`}>{STATUS_LABELS[r.status]}</span>
                                        </td>
                                        <td className={`px-3 py-2 text-xs ${overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                                            {r.nextReviewDue}{overdue && ' ⚠'}
                                        </td>
                                        <td className="px-3 py-2 text-slate-400">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</td>
                                    </tr>
                                    {expanded && (
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <td colSpan={8} className="px-4 py-3 text-xs text-slate-700 space-y-2">
                                                <p><strong className="text-slate-900">Beschrijving:</strong> {r.description}</p>
                                                <div>
                                                    <strong className="text-slate-900">Huidige maatregelen:</strong>
                                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                                        {r.mitigations.map((m, i) => <li key={i}>{m}</li>)}
                                                    </ul>
                                                </div>
                                                <p><strong className="text-slate-900">Restrisico:</strong> {r.residualRisk}</p>
                                                {r.aiActArticle && <p><strong className="text-slate-900">AI Act artikel:</strong> {r.aiActArticle}</p>}
                                                {r.evidenceRefs && r.evidenceRefs.length > 0 && (
                                                    <p><strong className="text-slate-900">Evidence:</strong> <code className="text-[10px] bg-white border border-slate-200 px-1 rounded">{r.evidenceRefs.join(', ')}</code></p>
                                                )}
                                                <p className="text-[10px] text-slate-500">Eigenaar: {r.owner} · Laatste review: {r.lastReview}</p>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {filteredRisks.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">Geen risico's voldoen aan de geselecteerde filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
                EU AI Act Art. 9 vereist een continu risicobeheerssysteem. Dit register is de bron voor het conformiteitsdossier en wordt bij elk kwartaal herzien.
            </p>
        </div>
    );
};

const StatBlock: React.FC<{ label: string; value: number; tone: 'neutral' | 'success' | 'warn' | 'danger' }> = ({ label, value, tone }) => {
    const toneClass = tone === 'success' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : tone === 'danger' ? 'text-rose-700' : 'text-slate-900';
    return (
        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
            <p className={`text-xl font-bold ${toneClass}`}>{value}</p>
        </div>
    );
};
