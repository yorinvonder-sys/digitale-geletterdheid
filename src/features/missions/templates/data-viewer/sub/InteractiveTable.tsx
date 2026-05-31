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

    const sortedColumnLabel = columns.find(c => c.key === sortKey)?.label;

    return (
        <div className="overflow-hidden rounded-xl border border-[#E7D8BD]">
            {/* Filter row */}
            <div className="grid gap-2 border-b border-[#E7D8BD] bg-[#FCF6EA] px-3 py-2 sm:grid-cols-2">
                {columns.map(col => (
                    <label key={col.key} className="min-w-0">
                        <span
                            className="mb-1 block truncate text-[10px] font-black uppercase text-[#445865]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        >
                            {col.label}
                        </span>
                        <input
                            type="text"
                            placeholder="Filter…"
                            value={filters[col.key] ?? ''}
                            onChange={e => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                            className="w-full rounded-lg border border-[#E7D8BD] bg-white px-2.5 py-2 text-xs text-[#445865] placeholder:text-[#8EA0A9] focus:outline-none focus:border-[#D97848]"
                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                        />
                    </label>
                ))}
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-[#E7D8BD] sm:hidden">
                {sortedRows.length === 0 ? (
                    <div
                        className="bg-white px-4 py-6 text-center text-sm text-[#445865]"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    >
                        Geen resultaten voor deze filter
                    </div>
                ) : (
                    sortedRows.map((row, i) => (
                        <article key={i} className="bg-white px-4 py-3">
                            <div className="grid gap-2">
                                {columns.map(col => (
                                    <div key={col.key} className="min-w-0 rounded-lg bg-[#FCF6EA] px-3 py-2">
                                        <div
                                            className="text-[10px] font-black uppercase text-[#445865]"
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {col.label}
                                        </div>
                                        <div
                                            className={`mt-0.5 break-words text-sm text-[#08283B] ${
                                                sortKey === col.key ? 'font-bold' : 'font-semibold'
                                            }`}
                                            style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                        >
                                            {row[col.key] ?? '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Table */}
            <div className="hidden overflow-x-auto sm:block" aria-label="Datatabel">
                <table className="w-full min-w-[480px]">
                    <thead>
                        <tr className="bg-[#FCF6EA] border-b border-[#E7D8BD]">
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-2.5 text-left text-xs font-black text-[#08283B] uppercase tracking-wide select-none ${
                                        col.sortable !== false
                                            ? 'cursor-pointer hover:text-[#D97848] transition-colors'
                                            : ''
                                    } ${sortKey === col.key ? 'text-[#D97848] bg-[#D97848]/5' : ''}`}
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable !== false && (
                                            <span className="text-[#445865]">
                                                {sortKey === col.key && sortDir === 'asc' ? (
                                                    <ChevronUp size={12} className="text-[#D97848]" />
                                                ) : sortKey === col.key && sortDir === 'desc' ? (
                                                    <ChevronDown size={12} className="text-[#D97848]" />
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
                                    className="px-4 py-6 text-center text-sm text-[#445865]"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Geen resultaten voor deze filter
                                </td>
                            </tr>
                        ) : (
                            sortedRows.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`border-b border-[#E7D8BD] last:border-b-0 transition-colors ${
                                        i % 2 === 0 ? 'bg-white' : 'bg-[#FCF6EA]'
                                    } hover:bg-[#D97848]/5`}
                                >
                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-2.5 text-sm text-[#445865] ${
                                                sortKey === col.key ? 'font-semibold text-[#08283B]' : ''
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
            <div className="bg-[#FCF6EA] border-t border-[#E7D8BD] px-4 py-1.5">
                <span
                    className="text-xs text-[#445865]"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {sortedRows.length} van {rows.length} rijen
                    {sortedColumnLabel && sortDir && (
                        <span className="ml-2 text-[#D97848]">
                            Gesorteerd op {sortedColumnLabel} ({sortDir === 'asc' ? 'oplopend' : 'aflopend'})
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};
