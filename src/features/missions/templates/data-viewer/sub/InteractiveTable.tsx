import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

interface InteractiveTableProps {
    columns: Column[];
    rows: Record<string, string | number>[];
}

type SortDir = 'asc' | 'desc' | null;

export const InteractiveTable: React.FC<InteractiveTableProps> = ({ columns, rows }) => {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleSort = (key: string) => {
        if (sortKey === key) {
            if (sortDir === 'asc') setSortDir('desc');
            else if (sortDir === 'desc') { setSortKey(null); setSortDir(null); }
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filteredRows = useMemo(() => {
        return rows.filter(row =>
            columns.every(col => {
                const f = filters[col.key]?.toLowerCase().trim();
                if (!f) return true;
                return String(row[col.key] ?? '').toLowerCase().includes(f);
            })
        );
    }, [rows, columns, filters]);

    const sortedRows = useMemo(() => {
        if (!sortKey || !sortDir) return filteredRows;
        return [...filteredRows].sort((a, b) => {
            const av = a[sortKey];
            const bv = b[sortKey];
            const aNum = Number(av);
            const bNum = Number(bv);
            const numeric = !isNaN(aNum) && !isNaN(bNum);
            if (numeric) return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
            const aStr = String(av ?? '').toLowerCase();
            const bStr = String(bv ?? '').toLowerCase();
            if (aStr < bStr) return sortDir === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredRows, sortKey, sortDir]);

    return (
        <div className="rounded-xl border border-duck-line overflow-hidden">
            {/* Filter row */}
            <div className="bg-duck-bg border-b border-duck-line px-3 py-2 flex gap-2 flex-wrap">
                {columns.map(col => (
                    <input
                        key={col.key}
                        type="text"
                        placeholder={`Filter ${col.label.toLowerCase()}…`}
                        value={filters[col.key] ?? ''}
                        onChange={e => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                        className="flex-1 min-w-[100px] text-xs px-2.5 py-1.5 rounded-lg border border-duck-line bg-white text-duck-muted placeholder:text-duck-muted focus:outline-none focus:border-duck-coral"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                    <thead>
                        <tr className="bg-duck-bg border-b border-duck-line">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-2.5 text-left text-xs font-black text-duck-ink uppercase tracking-wide select-none ${
                                        col.sortable !== false
                                            ? 'cursor-pointer hover:text-duck-coral transition-colors'
                                            : ''
                                    } ${sortKey === col.key ? 'text-duck-coral bg-duck-coral/5' : ''}`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable !== false && (
                                            <span className="text-duck-muted">
                                                {sortKey === col.key && sortDir === 'asc' ? (
                                                    <ChevronUp size={12} className="text-duck-coral" />
                                                ) : sortKey === col.key && sortDir === 'desc' ? (
                                                    <ChevronDown size={12} className="text-duck-coral" />
                                                ) : (
                                                    <ChevronsUpDown size={12} />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-6 text-center text-sm text-duck-muted"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Geen resultaten voor deze filter
                                </td>
                            </tr>
                        ) : (
                            sortedRows.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`border-b border-duck-line last:border-b-0 transition-colors ${
                                        i % 2 === 0 ? 'bg-white' : 'bg-duck-bg'
                                    } hover:bg-duck-coral/5`}
                                >
                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-2.5 text-sm text-duck-muted ${
                                                sortKey === col.key ? 'font-semibold text-duck-ink' : ''
                                            }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {row[col.key] ?? '—'}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Row count */}
            <div className="bg-duck-bg border-t border-duck-line px-4 py-1.5">
                <span
                    className="text-xs text-duck-muted"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {sortedRows.length} van {rows.length} rijen
                    {sortKey && sortDir && (
                        <span className="ml-2 text-duck-coral">
                            Gesorteerd op {columns.find(c => c.key === sortKey)?.label} ({sortDir === 'asc' ? 'oplopend' : 'aflopend'})
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};
