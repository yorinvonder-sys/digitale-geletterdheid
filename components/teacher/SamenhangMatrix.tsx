import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Filter } from 'lucide-react';
import { CURRICULUM } from '@/config/curriculum';
import { KERNDOEL_MISSIONS } from '@/config/slo-kerndoelen-mapping';
import { getBasisvaardighedenForMission } from '@/config/basisvaardigheden-mapping';
import type { BasisvaardigheidTag } from '@/types/slo';

// Data wordt geleverd door config/basisvaardigheden-mapping.ts

// ============================================================================
// Props
// ============================================================================

interface SamenhangMatrixProps {
    selectedYear?: number;
}

// ============================================================================
// Helpers
// ============================================================================

type Categorie = 'taal' | 'rekenen' | 'burgerschap';

const CATEGORIE_CONFIG: Record<Categorie, { label: string; icon: string }> = {
    taal: { label: 'Taal', icon: '\u{1F4DD}' },
    rekenen: { label: 'Rekenen', icon: '\u{1F522}' },
    burgerschap: { label: 'Burgerschap', icon: '\u{1F3DB}\uFE0F' },
};

const CATEGORIEEN: Categorie[] = ['taal', 'rekenen', 'burgerschap'];

interface CellDetail {
    missionId: string;
    missionTitle: string;
    tags: BasisvaardigheidTag[];
}

interface CellData {
    count: number;
    details: CellDetail[];
}

function getIntensityClass(count: number): string {
    if (count === 0) return 'bg-gray-100 text-slate-400';
    if (count <= 2) return 'bg-blue-100 text-blue-700';
    if (count <= 4) return 'bg-blue-300 text-blue-900';
    return 'bg-blue-500 text-white';
}

// ============================================================================
// Component
// ============================================================================

export const SamenhangMatrix: React.FC<SamenhangMatrixProps> = ({ selectedYear }) => {
    const [yearFilter, setYearFilter] = useState<number | 'all'>(selectedYear ?? 'all');
    const [expandedCell, setExpandedCell] = useState<string | null>(null);

    // Bouw de matrix data op basis van curriculum periodes
    const matrixData = useMemo(() => {
        const yearGroups = yearFilter === 'all'
            ? Object.keys(CURRICULUM.yearGroups).map(Number)
            : [yearFilter];

        const rows: {
            key: string;
            label: string;
            sublabel: string;
            yearGroup: number;
            period: number;
            cells: Record<Categorie, CellData>;
        }[] = [];

        for (const yg of yearGroups) {
            const yearConfig = CURRICULUM.yearGroups[yg];
            if (!yearConfig) continue;

            for (const [periodStr, periodConfig] of Object.entries(yearConfig.periods)) {
                const period = Number(periodStr);
                const allMissionIds = [
                    ...periodConfig.missions,
                    ...(periodConfig.reviewMissions || []),
                ];

                const cells: Record<Categorie, CellData> = {
                    taal: { count: 0, details: [] },
                    rekenen: { count: 0, details: [] },
                    burgerschap: { count: 0, details: [] },
                };

                for (const missionId of allMissionIds) {
                    const tags = getBasisvaardighedenForMission(missionId);
                    if (tags.length === 0) continue;

                    // Groepeer tags per categorie
                    const tagsByCategorie: Partial<Record<Categorie, BasisvaardigheidTag[]>> = {};
                    for (const tag of tags) {
                        if (!tagsByCategorie[tag.categorie]) tagsByCategorie[tag.categorie] = [];
                        tagsByCategorie[tag.categorie]!.push(tag);
                    }

                    // Zoek missie-titel
                    const missionMeta = KERNDOEL_MISSIONS.find(m => m.id === missionId);
                    const missionTitle = missionMeta?.title || missionId;

                    for (const cat of CATEGORIEEN) {
                        const catTags = tagsByCategorie[cat];
                        if (catTags && catTags.length > 0) {
                            cells[cat].count += catTags.length;
                            cells[cat].details.push({
                                missionId,
                                missionTitle,
                                tags: catTags,
                            });
                        }
                    }
                }

                rows.push({
                    key: `j${yg}-p${period}`,
                    label: yearFilter === 'all' ? `J${yg} P${period}` : `Periode ${period}`,
                    sublabel: periodConfig.title,
                    yearGroup: yg,
                    period,
                    cells,
                });
            }
        }

        return rows;
    }, [yearFilter]);

    // Samenvatting per categorie
    const summary = useMemo(() => {
        const result: Record<Categorie, { total: number; subcategorieCounts: Record<string, number> }> = {
            taal: { total: 0, subcategorieCounts: {} },
            rekenen: { total: 0, subcategorieCounts: {} },
            burgerschap: { total: 0, subcategorieCounts: {} },
        };

        for (const row of matrixData) {
            for (const cat of CATEGORIEEN) {
                const cell = row.cells[cat];
                result[cat].total += cell.count;
                for (const detail of cell.details) {
                    for (const tag of detail.tags) {
                        result[cat].subcategorieCounts[tag.subcategorie] =
                            (result[cat].subcategorieCounts[tag.subcategorie] || 0) + 1;
                    }
                }
            }
        }

        return result;
    }, [matrixData]);

    function getTopSubcategorie(cat: Categorie): string {
        const counts = summary[cat].subcategorieCounts;
        const entries = Object.entries(counts);
        if (entries.length === 0) return '-';
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0];
    }

    const handleCellClick = (cellKey: string) => {
        setExpandedCell(expandedCell === cellKey ? null : cellKey);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Samenhang Basisvaardigheden
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Hoe digitale geletterdheid samenhangt met taal, rekenen en burgerschap
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-slate-400" />
                        <select
                            value={yearFilter}
                            onChange={(e) => {
                                const val = e.target.value;
                                setYearFilter(val === 'all' ? 'all' : Number(val));
                                setExpandedCell(null);
                            }}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none hover:bg-slate-50 transition-colors"
                        >
                            <option value="all">Alle leerjaren</option>
                            <option value={1}>Leerjaar 1</option>
                            <option value={2}>Leerjaar 2</option>
                            <option value={3}>Leerjaar 3</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Matrix */}
            <div className="px-6 pb-2 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left text-[9px] font-black text-slate-400 uppercase tracking-widest py-2 pr-3 w-40">
                                Periode
                            </th>
                            {CATEGORIEEN.map(cat => (
                                <th key={cat} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest py-2 px-2">
                                    <span className="mr-1">{CATEGORIE_CONFIG[cat].icon}</span>
                                    {CATEGORIE_CONFIG[cat].label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrixData.map(row => (
                            <React.Fragment key={row.key}>
                                <tr>
                                    <td className="py-1.5 pr-3">
                                        <div className="text-xs font-bold text-slate-700">{row.label}</div>
                                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{row.sublabel}</div>
                                    </td>
                                    {CATEGORIEEN.map(cat => {
                                        const cellKey = `${row.key}-${cat}`;
                                        const cell = row.cells[cat];
                                        const isExpanded = expandedCell === cellKey;
                                        return (
                                            <td key={cat} className="py-1.5 px-2">
                                                <button
                                                    onClick={() => cell.count > 0 && handleCellClick(cellKey)}
                                                    className={`w-full rounded-xl py-3 px-2 text-center font-black text-lg transition-all ${getIntensityClass(cell.count)} ${
                                                        cell.count > 0
                                                            ? 'cursor-pointer hover:ring-2 hover:ring-blue-400/40 hover:scale-105 active:scale-95'
                                                            : 'cursor-default'
                                                    } ${isExpanded ? 'ring-2 ring-blue-500' : ''}`}
                                                >
                                                    {cell.count}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Detail sectie */}
                                <AnimatePresence>
                                    {CATEGORIEEN.map(cat => {
                                        const cellKey = `${row.key}-${cat}`;
                                        if (expandedCell !== cellKey) return null;
                                        const cell = row.cells[cat];
                                        return (
                                            <tr key={`detail-${cellKey}`}>
                                                <td colSpan={4} className="pb-3">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mt-1">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="text-sm">{CATEGORIE_CONFIG[cat].icon}</span>
                                                                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                                                    {row.sublabel} — {CATEGORIE_CONFIG[cat].label}
                                                                </h4>
                                                                <button
                                                                    onClick={() => setExpandedCell(null)}
                                                                    className="ml-auto text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                                                >
                                                                    Sluiten
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {cell.details.map(detail => (
                                                                    <div
                                                                        key={detail.missionId}
                                                                        className="bg-white rounded-lg border border-slate-100 p-3"
                                                                    >
                                                                        <div className="text-xs font-bold text-slate-800">
                                                                            {detail.missionTitle}
                                                                        </div>
                                                                        <div className="mt-1.5 space-y-1">
                                                                            {detail.tags.map((tag, i) => (
                                                                                <div key={i} className="flex items-start gap-2 text-[11px]">
                                                                                    <span className="inline-block mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                                                                                    <span>
                                                                                        <span className="font-bold text-slate-600">{tag.subcategorie}:</span>{' '}
                                                                                        <span className="text-slate-500">{tag.toelichting}</span>
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legenda */}
            <div className="px-6 pb-4">
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Intensiteit:</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-gray-100 border border-slate-200"></div>
                        <span>0</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-blue-100"></div>
                        <span>1-2</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-blue-300"></div>
                        <span>3-4</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-blue-500"></div>
                        <span>5+</span>
                    </div>
                </div>
            </div>

            {/* Samenvatting */}
            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CATEGORIEEN.map(cat => {
                        const config = CATEGORIE_CONFIG[cat];
                        const data = summary[cat];
                        const topSub = getTopSubcategorie(cat);
                        const colorMap: Record<Categorie, { bg: string; border: string; iconBg: string; text: string }> = {
                            taal: { bg: 'bg-indigo-50', border: 'border-indigo-200', iconBg: 'bg-indigo-100', text: 'text-indigo-700' },
                            rekenen: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', text: 'text-amber-700' },
                            burgerschap: { bg: 'bg-emerald-50', border: 'border-emerald-200', iconBg: 'bg-emerald-100', text: 'text-emerald-700' },
                        };
                        const colors = colorMap[cat];

                        return (
                            <div
                                key={cat}
                                className={`${colors.bg} rounded-xl border ${colors.border} p-4`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-8 h-8 ${colors.iconBg} rounded-lg flex items-center justify-center text-lg`}>
                                        {config.icon}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-black uppercase tracking-wider ${colors.text}`}>
                                            {config.label}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-2xl font-black text-slate-900">{data.total}</div>
                                <div className="text-[10px] text-slate-500 font-medium">raakvlakken totaal</div>
                                {topSub !== '-' && (
                                    <div className="mt-2 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                                        <ChevronDown size={10} className="rotate-[-90deg]" />
                                        Meest: {topSub}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
