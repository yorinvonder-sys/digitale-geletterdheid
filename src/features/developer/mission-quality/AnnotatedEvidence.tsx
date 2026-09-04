import {
    Camera,
    Code2,
    ExternalLink,
    FileCheck2,
    GitPullRequest,
    ImageOff,
    Route,
} from 'lucide-react';

import type { MissionEvidence } from './missionQualityModel';

interface AnnotatedEvidenceProps {
    evidence: MissionEvidence;
}

const SEVERITY_LABELS = {
    BLOCKER: 'Blokkerend',
    HIGH: 'Groot',
    MEDIUM: 'Middel',
    LOW: 'Klein',
    OBSERVATION: 'Observatie',
} as const;

const REFERENCE_LABELS = [
    { key: 'mission', label: 'Missie', icon: Route },
    { key: 'test', label: 'Test', icon: FileCheck2 },
    { key: 'code', label: 'Codewijziging', icon: Code2 },
    { key: 'pullRequest', label: 'Pull request', icon: GitPullRequest },
] as const;

function isNavigableReference(value: string): boolean {
    return value.startsWith('/') || value.startsWith('https://');
}

export function AnnotatedEvidence({ evidence }: AnnotatedEvidenceProps) {
    const annotations = evidence.findings.flatMap(finding => (
        finding.annotations.map(annotation => ({ annotation, finding }))
    ));

    return (
        <section className="space-y-4" aria-label="Geannoteerd browserbewijs">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-duck-ink/55">
                        Browserbewijs
                    </p>
                    <p className="mt-1 text-sm font-bold text-duck-ink">
                        {evidence.device} · {evidence.viewport.width}×{evidence.viewport.height}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-duck-ink/55">
                        Vastgelegd {new Date(evidence.capturedAt).toLocaleString('nl-NL')}
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-duck-ink/15 bg-duck-bg px-3 py-1.5 text-xs font-black text-duck-ink">
                    <Camera size={14} aria-hidden="true" />
                    {evidence.evidenceType}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                <figure className="min-w-0 overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bg">
                    <figcaption className="border-b border-duck-ink/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-duck-ink">
                        Vóór
                    </figcaption>
                    {evidence.beforeImage ? (
                        <div className="relative">
                            <img
                                src={evidence.beforeImage}
                                alt={`Browseropname vóór verbetering van ${evidence.missionId}`}
                                className="block h-auto w-full"
                                loading="lazy"
                            />
                            {annotations.map(({ annotation, finding }) => (
                                <span
                                    key={`${finding.id}-${annotation.id}`}
                                    aria-hidden="true"
                                    className={`pointer-events-none absolute border-[3px] border-duck-error shadow-[0_0_0_2px_rgba(255,255,255,0.9)] ${
                                        annotation.shape === 'circle' ? 'rounded-full' : 'rounded-lg'
                                    }`}
                                    style={{
                                        left: `${annotation.x}%`,
                                        top: `${annotation.y}%`,
                                        width: `${annotation.width}%`,
                                        height: `${annotation.height}%`,
                                    }}
                                >
                                    <span className="absolute -left-3 -top-3 flex size-7 items-center justify-center rounded-full border-2 border-white bg-duck-error text-xs font-black text-white shadow-md">
                                        {annotation.id}
                                    </span>
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center text-duck-ink/55">
                            <ImageOff size={28} aria-hidden="true" />
                            <span className="text-sm font-bold">Geen vóór-screenshot</span>
                        </div>
                    )}
                </figure>

                <figure className="min-w-0 overflow-hidden rounded-2xl border border-duck-ink/15 bg-duck-bg">
                    <figcaption className="border-b border-duck-ink/15 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-duck-ink">
                        Na
                    </figcaption>
                    {evidence.afterImage ? (
                        <img
                            src={evidence.afterImage}
                            alt={`Browseropname na verbetering van ${evidence.missionId}`}
                            className="block h-auto w-full"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex min-h-52 flex-col items-center justify-center gap-2 p-6 text-center text-duck-ink/55">
                            <ImageOff size={28} aria-hidden="true" />
                            <span className="text-sm font-bold">Nog geen hertest</span>
                            <span className="max-w-xs text-xs">
                                Het vak blijft leeg totdat dezelfde route na de fix opnieuw is vastgelegd.
                            </span>
                        </div>
                    )}
                </figure>
            </div>

            {annotations.length > 0 && (
                <ol className="space-y-3">
                    {annotations.map(({ annotation, finding }) => (
                        <li
                            key={`legend-${finding.id}-${annotation.id}`}
                            className="rounded-2xl border border-duck-ink/15 bg-white p-4"
                        >
                            <div className="flex items-start gap-3">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-duck-error text-xs font-black text-white">
                                    {annotation.id}
                                </span>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-black text-duck-ink">{finding.title}</p>
                                        <span className="rounded-full bg-duck-error/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-duck-error">
                                            {SEVERITY_LABELS[finding.severity]}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm leading-relaxed text-duck-ink/70">{finding.description}</p>
                                    <p className="mt-2 rounded-xl bg-duck-bg px-3 py-2 text-xs font-bold text-duck-ink/70">
                                        <strong className="text-duck-ink">Markering:</strong> {annotation.label}
                                    </p>
                                    <dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                                        <div>
                                            <dt className="font-black uppercase tracking-wide text-duck-ink/50">Effect leerling</dt>
                                            <dd className="mt-0.5 font-bold text-duck-ink">{finding.learnerImpact}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-black uppercase tracking-wide text-duck-ink/50">Conceptverbetering</dt>
                                            <dd className="mt-0.5 font-bold text-duck-ink">{finding.recommendedFix}</dd>
                                        </div>
                                        <div>
                                            <dt className="font-black uppercase tracking-wide text-duck-ink/50">Getroffen persona’s</dt>
                                            <dd className="mt-0.5 font-bold text-duck-ink">
                                                {finding.personas.length > 0
                                                    ? finding.personas.join(', ')
                                                    : 'Niet gespecificeerd'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="font-black uppercase tracking-wide text-duck-ink/50">Validatie</dt>
                                            <dd className="mt-0.5 font-bold text-duck-ink">
                                                {finding.requiresHumanValidation
                                                    ? 'Vereist jouw inhoudelijke akkoord'
                                                    : 'Objectief hertestbaar'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            )}

            <section aria-label="Bewijskoppelingen">
                <h5 className="text-xs font-black uppercase tracking-widest text-duck-ink/55">
                    Koppelingen
                </h5>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {REFERENCE_LABELS.map(reference => {
                        const Icon = reference.icon;
                        const value = evidence.references[reference.key];
                        return (
                            <div
                                key={reference.key}
                                className="min-w-0 rounded-xl border border-duck-ink/15 bg-duck-bg p-3"
                            >
                                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-duck-ink/50">
                                    <Icon size={14} aria-hidden="true" />
                                    {reference.label}
                                </p>
                                {value ? (
                                    isNavigableReference(value) ? (
                                        <a
                                            href={value}
                                            target={value.startsWith('https://') ? '_blank' : undefined}
                                            rel={value.startsWith('https://') ? 'noreferrer' : undefined}
                                            className="mt-1 flex min-h-7 min-w-0 items-center gap-1.5 break-all text-xs font-black text-duck-ink underline decoration-duck-ink/30 underline-offset-2"
                                        >
                                            <span>{value}</span>
                                            <ExternalLink size={12} aria-hidden="true" className="shrink-0" />
                                        </a>
                                    ) : (
                                        <code className="mt-1 block break-all text-xs font-bold text-duck-ink">
                                            {value}
                                        </code>
                                    )
                                ) : (
                                    <p className="mt-1 text-xs font-bold text-duck-ink/50">Niet gekoppeld</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </section>
    );
}
