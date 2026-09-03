import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Users, Plus, X, Loader2, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
    getClassScopingOverview,
    assignClass,
    unassignClass,
    setTeacherScope,
    teachersWithoutClass,
    classesWithoutTeacher,
    strictReadiness,
    type ClassScopingOverview,
    type TeacherScope,
} from '@/services/teacherClassScopingService';

interface ClassScopingPanelProps {
    schoolId?: string;
    /** Alleen een beheerder mag koppelen; de database weigert de rest sowieso. */
    canManage: boolean;
}

const SCOPE_LABELS: Record<TeacherScope, { title: string; body: string }> = {
    school: {
        title: 'Schoolbreed',
        body: 'Elke docent ziet elke leerling van de school. Dit is de huidige stand.',
    },
    class_soft: {
        title: 'Klasgebonden, met overgangsregeling',
        body: 'Een docent met klassen ziet alleen die klassen. Een docent zonder klassen ziet nog de hele school. Bedoeld om over te stappen, niet als eindstand.',
    },
    class_strict: {
        title: 'Klasgebonden',
        body: 'Een docent ziet alleen zijn eigen klassen. Een docent zonder klassen ziet niemand.',
    },
};

export const ClassScopingPanel: React.FC<ClassScopingPanelProps> = ({ schoolId, canManage }) => {
    const [overview, setOverview] = useState<ClassScopingOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState<string | null>(null);
    const [addingFor, setAddingFor] = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!schoolId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            setOverview(await getClassScopingOverview(schoolId));
        } catch (e) {
            console.error('Klaskoppeling laden mislukt:', e);
            setError('De koppelingen konden niet geladen worden.');
        } finally {
            setLoading(false);
        }
    }, [schoolId]);

    useEffect(() => { void load(); }, [load]);

    const linksByTeacher = useMemo(() => {
        const map = new Map<string, ClassScopingOverview['links']>();
        for (const link of overview?.links || []) {
            const list = map.get(link.teacherId) || [];
            list.push(link);
            map.set(link.teacherId, list);
        }
        return map;
    }, [overview]);

    const run = async (key: string, action: () => Promise<void>) => {
        setBusy(key);
        setError(null);
        try {
            await action();
            await load();
        } catch (e) {
            console.error('Wijziging mislukt:', e);
            setError('De wijziging is geweigerd. Beheerders met tweefactor mogen dit; anderen niet.');
        } finally {
            setBusy(null);
        }
    };

    if (!schoolId) {
        return (
            <div className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                <p className="text-duck-ink/60">Dit scherm hoort bij een school; er is geen school gekoppeld aan dit account.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white rounded-[2rem] border border-duck-ink/15 p-6 flex items-center gap-3 text-duck-ink/60">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span>Koppelingen laden…</span>
            </div>
        );
    }

    if (!overview) {
        return (
            <div className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                <p className="text-duck-error font-bold">{error || 'Geen gegevens.'}</p>
            </div>
        );
    }

    const zonderKlas = teachersWithoutClass(overview);
    const zonderDocent = classesWithoutTeacher(overview);
    const scope = overview.scope;
    const readiness = strictReadiness(overview);

    return (
        <div className="space-y-6">
            {error && (
                <p role="alert" className="bg-duck-error/10 border border-duck-error/40 text-duck-error rounded-xl p-4 font-bold">
                    {error}
                </p>
            )}

            {/* Stand van de school */}
            <section className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-duck-acid rounded-xl flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-duck-ink" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 className="font-bold text-duck-ink">Wie ziet welke leerlingen</h2>
                            <p className="text-sm text-duck-ink/60">{SCOPE_LABELS[scope].title} — {SCOPE_LABELS[scope].body}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => void load()}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-duck-ink/15 text-sm font-bold text-duck-ink hover:bg-duck-bg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" aria-hidden="true" />
                        Vernieuwen
                    </button>
                </div>

                {canManage && (
                    <div className="flex flex-wrap gap-2">
                        {(Object.keys(SCOPE_LABELS) as TeacherScope[]).map(option => (
                            <button
                                key={option}
                                disabled={busy !== null || option === scope}
                                onClick={() => void run(`scope-${option}`, () => setTeacherScope(schoolId, option))}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${option === scope
                                    ? 'bg-duck-ink text-white border-duck-ink'
                                    : 'border-duck-ink/15 text-duck-ink hover:bg-duck-bg'}`}
                            >
                                {SCOPE_LABELS[option].title}
                                {option === scope && <span className="sr-only"> (huidige stand)</span>}
                            </button>
                        ))}
                    </div>
                )}

                {canManage && scope !== 'class_strict' && !readiness.ready && (
                    <p className="mt-4 flex items-start gap-2 text-sm text-duck-ink/70">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                            Nog niet klaar voor de strenge stand: {readiness.teachersWithoutClass} docent(en) zonder klas
                            en {readiness.studentsWithoutClass} leerling(en) zonder klas. Zet je nu om, dan valt die groep buiten beeld.
                        </span>
                    </p>
                )}

                {scope !== 'school' && zonderKlas.length > 0 && (
                    <p className="mt-4 flex items-start gap-2 text-sm text-duck-ink/70">
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                            {zonderKlas.length} {zonderKlas.length === 1 ? 'docent heeft' : 'docenten hebben'} nog geen klas.
                            {scope === 'class_strict' ? ' Zij zien op dit moment niemand.' : ' Zij zien nu nog de hele school.'}
                        </span>
                    </p>
                )}
            </section>

            {/* Docenten en hun klassen */}
            <section className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                <h2 className="font-bold text-duck-ink mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" aria-hidden="true" />
                    Docenten en hun klassen
                </h2>

                {overview.teachers.length === 0 && (
                    <p className="text-duck-ink/60">Er staan geen docenten bij deze school.</p>
                )}

                <ul className="divide-y divide-duck-ink/10">
                    {overview.teachers.map(teacher => {
                        const links = linksByTeacher.get(teacher.id) || [];
                        const beschikbaar = overview.classes.filter(c => !links.some(l => l.studentClass === c));
                        return (
                            <li key={teacher.id} className="py-4 flex flex-wrap items-center gap-3">
                                <span className="font-bold text-duck-ink min-w-[12rem]">{teacher.name}</span>

                                {links.length === 0 && (
                                    <span className="text-sm text-duck-ink/50">nog geen klas</span>
                                )}

                                {links.map(link => (
                                    <span key={link.id} className="inline-flex items-center gap-1 bg-duck-bg text-duck-ink text-sm font-bold px-3 py-1 rounded-full">
                                        {link.studentClass}
                                        {canManage && (
                                            <button
                                                disabled={busy !== null}
                                                onClick={() => void run(link.id, () => unassignClass(link.id))}
                                                aria-label={`Klas ${link.studentClass} weghalen bij ${teacher.name}`}
                                                className="text-duck-ink/50 hover:text-duck-error transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" aria-hidden="true" />
                                            </button>
                                        )}
                                    </span>
                                ))}

                                {canManage && beschikbaar.length > 0 && (
                                    addingFor === teacher.id ? (
                                        <select
                                            autoFocus
                                            defaultValue=""
                                            aria-label={`Klas toevoegen aan ${teacher.name}`}
                                            onBlur={() => setAddingFor(null)}
                                            onChange={e => {
                                                const klas = e.target.value;
                                                setAddingFor(null);
                                                if (klas) void run(`${teacher.id}-${klas}`, () => assignClass(teacher.id, schoolId, klas));
                                            }}
                                            className="text-sm border border-duck-ink/15 rounded-xl px-3 py-1 text-duck-ink"
                                        >
                                            <option value="">Kies een klas…</option>
                                            {beschikbaar.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    ) : (
                                        <button
                                            disabled={busy !== null}
                                            onClick={() => setAddingFor(teacher.id)}
                                            className="inline-flex items-center gap-1 text-sm font-bold text-duck-ink border border-duck-ink/15 rounded-full px-3 py-1 hover:bg-duck-bg transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                            Klas toevoegen
                                        </button>
                                    )
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Twee wachtrijen */}
            <div className="grid gap-6 md:grid-cols-2">
                <section className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                    <h2 className="font-bold text-duck-ink mb-2">Leerlingen zonder klas</h2>
                    <p className="text-sm text-duck-ink/60 mb-4">
                        Zolang een leerling geen klas heeft, is hij in een klasgebonden stand voor geen enkele docent zichtbaar.
                        Deel hem in; maak geen verzamelklas.
                    </p>
                    {overview.studentsWithoutClass.length === 0 ? (
                        <p className="text-duck-ink/60 text-sm">Iedereen heeft een klas.</p>
                    ) : (
                        <ul className="space-y-1 text-sm text-duck-ink">
                            {overview.studentsWithoutClass.map(s => <li key={s.id}>{s.name}</li>)}
                        </ul>
                    )}
                </section>

                <section className="bg-white rounded-[2rem] border border-duck-ink/15 p-6">
                    <h2 className="font-bold text-duck-ink mb-2">Klassen zonder docent</h2>
                    <p className="text-sm text-duck-ink/60 mb-4">
                        Aan deze klassen hangt nog geen enkele docent. In de strenge stand kijkt daar niemand mee.
                    </p>
                    {zonderDocent.length === 0 ? (
                        <p className="text-duck-ink/60 text-sm">Elke klas heeft een docent.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {zonderDocent.map(c => (
                                <li key={c} className="bg-duck-bg text-duck-ink text-sm font-bold px-3 py-1 rounded-full">{c}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};
