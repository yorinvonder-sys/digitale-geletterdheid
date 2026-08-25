import React, { useState, useMemo, useEffect, useRef } from 'react';
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

    // Filteren krimpt de tabel terwijl de focus in het invoerveld blijft: zonder
    // statusmelding hoort een schermlezergebruiker daar niets van. De melding is
    // vertraagd, zodat alleen de uiteindelijke telling wordt aangekondigd en niet
    // elke toetsaanslag. Bij de eerste render blijft hij leeg — beginhoud hoort in
    // de zichtbare tekst, niet in een live-regio.
    const [announcement, setAnnouncement] = useState(() => `${rows.length} van ${rows.length} rijen zichtbaar.`);
    const firstRender = useRef(true);
    const sortLabel = columns.find(c => c.key === sortKey)?.label;

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const t = setTimeout(() => {
            setAnnouncement(
                `${sortedRows.length} van ${rows.length} rijen zichtbaar` +
                    (sortKey && sortDir
                        ? `, gesorteerd op ${sortLabel} ${sortDir === 'asc' ? 'oplopend' : 'aflopend'}`
                        : '') +
                    '.'
            );
        }, 700);
        return () => clearTimeout(t);
    }, [sortedRows.length, rows.length, sortKey, sortDir, sortLabel]);

    return (
        <div className="rounded-xl border border-duck-gray overflow-hidden">
            {/* Filter row */}
            <div className="bg-duck-bg border-b border-duck-gray px-3 py-2 flex gap-2 flex-wrap">
                {/* Ingevulde tekst op volle inktkleur, placeholder blijft op /75: anders
                    zijn 'leeg' en 'ingevuld' visueel niet te onderscheiden. */}
                {columns.map(col => (
                    <input
                        key={col.key}
                        type="text"
                        aria-label={`Filter op ${col.label}`}
                        placeholder={`Filter ${col.label.toLowerCase()}…`}
                        value={filters[col.key] ?? ''}
                        onChange={e => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                        className="flex-1 min-w-[100px] text-xs px-2.5 py-1.5 rounded-lg border border-duck-gray bg-white text-duck-ink placeholder:text-duck-ink/75 focus:outline-none focus:border-duck-acid"
                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                    />
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                    <thead>
                        <tr className="bg-duck-bg border-b border-duck-gray">
                            {columns.map(col => {
                                const sortable = col.sortable !== false;
                                const active = sortKey === col.key;
                                const ariaSort = !sortable
                                    ? undefined
                                    : active && sortDir === 'asc'
                                        ? 'ascending'
                                        : active && sortDir === 'desc'
                                            ? 'descending'
                                            : 'none';
                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        aria-sort={ariaSort}
                                        className={`text-left text-xs font-black text-duck-ink uppercase tracking-wide select-none ${
                                            active ? 'bg-duck-acid/5' : ''
                                        }`}
                                        style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                    >
                                        {sortable ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSort(col.key)}
                                                className="w-full min-h-[44px] px-4 py-2.5 flex items-center gap-1.5 text-left uppercase tracking-wide hover:text-duck-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-inset"
                                                style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                            >
                                                {col.label}
                                                <span className="text-duck-ink/75">
                                                    {active && sortDir === 'asc' ? (
                                                        <ChevronUp size={12} className="text-duck-ink" />
                                                    ) : active && sortDir === 'desc' ? (
                                                        <ChevronDown size={12} className="text-duck-ink" />
                                                    ) : (
                                                        <ChevronsUpDown size={12} />
                                                    )}
                                                </span>
                                                <span className="sr-only">
                                                    {active && sortDir === 'asc'
                                                        ? '— oplopend gesorteerd, klik voor aflopend'
                                                        : active && sortDir === 'desc'
                                                            ? '— aflopend gesorteerd, klik om sortering te wissen'
                                                            : '— klik om oplopend te sorteren'}
                                                </span>
                                            </button>
                                        ) : (
                                            <div className="px-4 py-2.5">{col.label}</div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-6 text-center text-sm text-duck-ink/75"
                                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                                >
                                    Geen resultaten voor deze filter
                                </td>
                            </tr>
                        ) : (
                            sortedRows.map((row, i) => (
                                <tr
                                    key={i}
                                    className={`border-b border-duck-gray last:border-b-0 transition-colors ${
                                        i % 2 === 0 ? 'bg-white' : 'bg-duck-bg'
                                    } hover:bg-duck-acid/5`}
                                >
                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-2.5 text-sm text-duck-ink/75 ${
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
            <div className="bg-duck-bg border-t border-duck-gray px-4 py-1.5">
                <span
                    aria-hidden="true"
                    className="text-xs text-duck-ink/75"
                    style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}
                >
                    {sortedRows.length} van {rows.length} rijen
                    {sortKey && sortDir && (
                        <span className="ml-2 text-duck-ink">
                            Gesorteerd op {sortLabel} ({sortDir === 'asc' ? 'oplopend' : 'aflopend'})
                        </span>
                    )}
                </span>
                <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                    {announcement}
                </span>
            </div>
        </div>
    );
};
