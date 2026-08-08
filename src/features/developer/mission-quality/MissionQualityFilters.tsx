import { RotateCcw, Search } from 'lucide-react';

import type { MissionQualityFilters as Filters } from './missionQualityModel';

interface MissionQualityFiltersProps {
    filters: Filters;
    resultCount: number;
    totalCount: number;
    onChange: (filters: Filters) => void;
}

const SELECT_CLASS = 'min-h-11 rounded-xl border border-duck-ink/20 bg-white px-3 text-sm font-bold text-duck-ink focus:outline-none focus:ring-2 focus:ring-duck-ink/25';

export function MissionQualityFilters({
    filters,
    resultCount,
    totalCount,
    onChange,
}: MissionQualityFiltersProps) {
    const update = <Key extends keyof Filters>(key: Key, value: Filters[Key]) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <section className="rounded-3xl border border-duck-ink/15 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1fr)_repeat(4,minmax(120px,auto))_auto]">
                <label className="relative block">
                    <span className="sr-only">Zoek missie</span>
                    <Search
                        size={18}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-duck-ink/55"
                    />
                    <input
                        type="search"
                        value={filters.query || ''}
                        onChange={event => update('query', event.target.value)}
                        placeholder="Zoek missie, type of issue..."
                        className="min-h-11 w-full rounded-xl border border-duck-ink/20 bg-duck-bg pl-10 pr-3 text-sm font-bold text-duck-ink placeholder:text-duck-ink/45 focus:outline-none focus:ring-2 focus:ring-duck-ink/25"
                    />
                </label>

                <label>
                    <span className="sr-only">Leerjaar</span>
                    <select
                        value={filters.yearGroup || 'all'}
                        onChange={event => update(
                            'yearGroup',
                            event.target.value === 'all' ? 'all' : Number(event.target.value),
                        )}
                        className={`w-full ${SELECT_CLASS}`}
                    >
                        <option value="all">Alle leerjaren</option>
                        <option value="1">Leerjaar 1</option>
                        <option value="2">Leerjaar 2</option>
                        <option value="3">Leerjaar 3</option>
                    </select>
                </label>

                <label>
                    <span className="sr-only">Periode</span>
                    <select
                        value={filters.period || 'all'}
                        onChange={event => update(
                            'period',
                            event.target.value === 'all' ? 'all' : Number(event.target.value),
                        )}
                        className={`w-full ${SELECT_CLASS}`}
                    >
                        <option value="all">Alle periodes</option>
                        <option value="1">Periode 1</option>
                        <option value="2">Periode 2</option>
                        <option value="3">Periode 3</option>
                        <option value="4">Periode 4</option>
                    </select>
                </label>

                <label>
                    <span className="sr-only">Auditstatus</span>
                    <select
                        value={filters.auditStatus || 'all'}
                        onChange={event => update('auditStatus', event.target.value as Filters['auditStatus'])}
                        className={`w-full ${SELECT_CLASS}`}
                    >
                        <option value="all">Alle statussen</option>
                        <option value="blocked">Geblokkeerd</option>
                        <option value="fixed">Fixed</option>
                        <option value="missing">Audit ontbreekt</option>
                    </select>
                </label>

                <label>
                    <span className="sr-only">Prioriteit</span>
                    <select
                        value={filters.priorityBand || 'all'}
                        onChange={event => update('priorityBand', event.target.value as Filters['priorityBand'])}
                        className={`w-full ${SELECT_CLASS}`}
                    >
                        <option value="all">Alle prioriteiten</option>
                        <option value="high">Hoog</option>
                        <option value="medium">Middel</option>
                        <option value="low">Laag</option>
                        <option value="unknown">Onbekend</option>
                    </select>
                </label>

                <button
                    type="button"
                    onClick={() => onChange({})}
                    className="min-h-11 rounded-xl border border-duck-ink/20 bg-white px-4 text-sm font-black text-duck-ink transition-colors hover:bg-duck-bg focus:outline-none focus:ring-2 focus:ring-duck-ink/25"
                >
                    <span className="flex items-center justify-center gap-2">
                        <RotateCcw size={16} aria-hidden="true" />
                        Reset
                    </span>
                </button>
            </div>

            <p
                data-qa="mission-quality-results"
                className="mt-3 text-xs font-bold text-duck-ink/60"
                aria-live="polite"
            >
                {resultCount} van {totalCount} actuele missies zichtbaar
            </p>
        </section>
    );
}
