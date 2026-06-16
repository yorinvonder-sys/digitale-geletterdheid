import React, { useState } from 'react';
import { DemoMissionHost } from './DemoMissionHost';
import {
    DEMO_ASSIGNMENTS,
    SKILL_CATEGORIES,
    CATEGORY_ORDER,
    SkillCategorie,
    DemoAssignment,
} from './demoGalleryConfig';
import { DuckMark } from '@/components/brand/DuckMark';

function getInitialCategorie(): SkillCategorie {
    const params = new URLSearchParams(window.location.search);
    const val = params.get('categorie');
    if (val && val in SKILL_CATEGORIES) return val as SkillCategorie;
    return 'ai';
}

function navigateTo(path: string) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('pathchange'));
}

const MissionCard: React.FC<{ assignment: DemoAssignment; onPlay: () => void }> = ({
    assignment,
    onPlay,
}) => (
    <div className="flex flex-col rounded-[1.6rem] bg-white p-6 shadow-[2px_4px_24px_rgba(199,197,188,0.30)]">
        <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl leading-tight">{assignment.title}</h3>
            {assignment.aiPowered && (
                <span className="shrink-0 rounded-full bg-duck-acid px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-duck-ink">
                    AI
                </span>
            )}
        </div>
        <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-duck-ink/65">
            {assignment.blurb}
        </p>
        <button
            onClick={onPlay}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-duck-ink px-6 py-2.5 text-sm font-extrabold text-white transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
        >
            Speel nu →
        </button>
    </div>
);

export const SpeeltuinGallery: React.FC = () => {
    const [selectedCategorie, setSelectedCategorie] = useState<SkillCategorie>(getInitialCategorie);
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

    if (selectedMissionId) {
        return (
            <DemoMissionHost
                missionId={selectedMissionId}
                onBack={() => setSelectedMissionId(null)}
            />
        );
    }

    const filtered = DEMO_ASSIGNMENTS.filter((a) => a.categorie === selectedCategorie);

    return (
        <div className="min-h-screen bg-duck-bg">
            {/* Demo banner */}
            <div className="border-b border-duck-ink/10 bg-duck-ink/5 px-4 py-2.5 text-center text-xs font-semibold text-duck-ink/60">
                Demo — fictieve opdrachten — gratis, zonder account
            </div>

            {/* Header */}
            <header className="mx-auto max-w-5xl px-5 pt-10 pb-8 md:px-10 md:pt-16">
                <button
                    onClick={() => navigateTo('/scholen')}
                    className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-duck-muted transition-colors hover:text-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                >
                    ← Terug naar DGSkills
                </button>
                <DuckMark className="h-10 w-10" />
                <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05]">
                    Dit speelt jouw klas
                </h1>
                <p className="mt-3 max-w-xl text-base font-semibold leading-7 text-duck-ink/65">
                    Kies een skill en speel een echte opdracht — gratis, zonder account. Zo ziet het er voor leerlingen uit.
                </p>
            </header>

            {/* Category tabs */}
            <div className="mx-auto max-w-5xl px-5 md:px-10">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill categorieën">
                    {CATEGORY_ORDER.map((cat) => (
                        <button
                            key={cat}
                            role="tab"
                            aria-selected={selectedCategorie === cat}
                            onClick={() => setSelectedCategorie(cat)}
                            className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink ${
                                selectedCategorie === cat
                                    ? 'bg-duck-ink text-white'
                                    : 'bg-duck-ink/10 text-duck-ink hover:bg-duck-ink/20'
                            }`}
                        >
                            {SKILL_CATEGORIES[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mission cards */}
            <main className="mx-auto max-w-5xl px-5 py-10 md:px-10">
                {filtered.length === 0 ? (
                    <div className="rounded-[1.6rem] border-2 border-dashed border-duck-ink/20 p-10 text-center">
                        <p className="font-display text-lg text-duck-ink">Opdrachten komen binnenkort</p>
                        <p className="mt-2 text-sm font-semibold text-duck-muted">
                            Meld je school aan voor een pilot en krijg vroeg toegang.
                        </p>
                        <a
                            href="/pilot"
                            className="mt-6 inline-flex min-h-[50px] items-center gap-2 rounded-full bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink"
                        >
                            Schoolpilot aanmelden
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((assignment) => (
                            <MissionCard
                                key={assignment.missionId}
                                assignment={assignment}
                                onPlay={() => setSelectedMissionId(assignment.missionId)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* CTA footer */}
            <footer className="mx-auto max-w-5xl px-5 pb-16 md:px-10">
                <div className="rounded-[1.6rem] bg-duck-ink p-8 text-white md:flex md:items-center md:justify-between md:gap-8">
                    <div>
                        <h2 className="font-display text-2xl leading-tight">Wil je meer opdrachten zien?</h2>
                        <p className="mt-2 text-sm font-semibold leading-6 text-white/65">
                            In een schoolpilot krijg je toegang tot alle 90+ missies.
                        </p>
                    </div>
                    <a
                        href="/pilot"
                        className="mt-6 inline-flex min-h-[50px] shrink-0 items-center gap-2 rounded-full bg-duck-acid px-7 py-3 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-acid focus-visible:ring-offset-2 focus-visible:ring-offset-duck-ink md:mt-0"
                    >
                        Schoolpilot aanmelden
                    </a>
                </div>
            </footer>
        </div>
    );
};
